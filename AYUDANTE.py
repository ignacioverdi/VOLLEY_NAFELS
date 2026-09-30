# -*- coding: utf-8 -*-
"""EL AYUDANTE — el que hace que Cortes tenga un boton de verdad.

   Una pagina web no puede abrir archivos de tu disco ni correr ffmpeg. Por eso
   hasta ahora habia que bajar un CSV y arrastrarlo a un programa. Esto lo
   reemplaza: queda escuchando en tu propia maquina, la pagina le manda la
   seleccion, y el hace el trabajo.

   POR QUE FUNCIONA
   La pagina esta en https y este programa habla http, que normalmente el
   navegador bloquea. Pero hay una excepcion, y esta en la norma: lo que va a
   TU PROPIA MAQUINA (127.0.0.1) se considera seguro, porque no sale de la
   computadora. Comprobado en Chrome: una conexion insegura a example.com la
   rechaza con SecurityError, y a 127.0.0.1 la deja pasar.

   QUE PUEDE Y QUE NO
   Solo escucha en 127.0.0.1, asi que nadie de afuera de la maquina lo ve.
   Solo contesta a las paginas de la lista de abajo.
   NUNCA acepta una ruta de archivo que venga de la pagina: la pagina manda el
   codigo del partido, y la ruta sale de un archivo que esta aca. Asi, aunque
   alguien lograra hablarle, no puede hacerle tocar un archivo cualquiera.
   No borra nada.
"""
import io
import json
import os
import re
import subprocess
import sys
import threading
import time
import uuid

try:
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
except ImportError:
    print('Hace falta Python 3.7 o mas nuevo.')
    sys.exit(1)

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

PUERTO = 8765
VERSION = '1.0'

# Solo estas paginas pueden hablarle. Si algun dia cambia el dominio, se agrega.
PERMITIDOS = {
    'https://volley-nafels.vercel.app',
    'http://localhost:8000', 'http://127.0.0.1:8000',   # para probar en casa
}

CONFIG = os.path.join(AQUI, 'ayudante_config.json')

try:
    from CORTAR_SAQUES import buscar_ffmpeg, bajar_ffmpeg, datos_del_video, leer_dvw
    from CORTAR_SELECCION import cortar, pegar, arranque_real, limpio, VALOR, fuente
except Exception as e:
    print('  Faltan CORTAR_SAQUES.py y CORTAR_SELECCION.py en esta carpeta.')
    print('  (%s)' % e)
    input('\n  Enter para cerrar. ')
    sys.exit(1)


# ══════════════════════════════════════════════════════════════════════════
#   la libreta: que video es cada partido
# ══════════════════════════════════════════════════════════════════════════

def leer_config():
    try:
        with io.open(CONFIG, encoding='utf-8') as f:
            c = json.load(f)
    except Exception:
        c = {}
    c.setdefault('videos', {})     # id de YouTube o codigo de partido -> ruta
    c.setdefault('carpetas', [])   # donde buscar solo, ej el disco extraible
    c.setdefault('salida', '')     # donde dejar los cortes
    c.setdefault('medir_saques_solo', True)   # medir la velocidad sin que nadie apriete nada
    c.setdefault('medidos', {})               # libreta: que .dvw ya se midio
    return c


def guardar_config(c):
    with io.open(CONFIG, 'w', encoding='utf-8') as f:
        f.write(json.dumps(c, ensure_ascii=False, indent=1))


def buscar_video(c, vid, partido):
    """La ruta del video de este partido, o None.

    Primero mira la libreta. Si no lo tiene, busca en las carpetas configuradas
    un archivo cuyo nombre contenga el id del video o el codigo del partido: asi
    un partido nuevo entra solo, sin tener que anotarlo a mano.
    """
    for clave in (vid, partido):
        if clave and c['videos'].get(clave) and os.path.exists(c['videos'][clave]):
            return c['videos'][clave]
    pistas = [p.lower() for p in (vid, partido) if p]
    for carpeta in c['carpetas']:
        if not os.path.isdir(carpeta):
            continue                      # el disco extraible puede no estar
        for raiz, _dirs, files in os.walk(carpeta):
            for f in files:
                if not f.lower().endswith(('.mp4', '.mts', '.m2ts', '.mkv', '.mov', '.avi')):
                    continue
                bajo = f.lower()
                if any(p and p in bajo for p in pistas):
                    ruta = os.path.join(raiz, f)
                    if vid:
                        c['videos'][vid] = ruta
                        guardar_config(c)
                    return ruta
    return None


# ══════════════════════════════════════════════════════════════════════════
#   los trabajos
# ══════════════════════════════════════════════════════════════════════════

TRABAJOS = {}
_LOCK = threading.Lock()


def nuevo_trabajo():
    t = uuid.uuid4().hex[:12]
    with _LOCK:
        TRABAJOS[t] = dict(estado='arrancando', hechos=0, total=0, mensaje='',
                           archivos=[], carpeta='', error='', cuando=time.time())
    return t


def tocar(t, **kw):
    with _LOCK:
        if t in TRABAJOS:
            TRABAJOS[t].update(kw)


def trabajar(t, pedido):
    """Corta de verdad. Corre en su propio hilo para que la pagina no espere."""
    try:
        c = leer_config()
        ff = buscar_ffmpeg() or bajar_ffmpeg()
        if not ff:
            tocar(t, estado='error', error='No encuentro ffmpeg')
            return
        clips = pedido.get('clips') or []
        modo = 'rotulo' if pedido.get('modo') == 'rotulo' else 'rapido'
        fnt = fuente() if modo == 'rotulo' else None
        if modo == 'rotulo' and not fnt:
            modo = 'rapido'

        # Un grupo por partido: cada uno sale de un archivo distinto.
        grupos = {}
        for r in clips:
            grupos.setdefault((r.get('partido', ''), r.get('video', '')), []).append(r)

        faltan = []
        for (part, vid), rs in grupos.items():
            if not buscar_video(c, vid, part):
                faltan.append(part or vid or '(sin nombre)')
        if faltan:
            tocar(t, estado='falta_video', error='No tengo el video de: ' + ', '.join(sorted(set(faltan))))
            return

        total = sum(max(1, int(r.get('repetir') or 1)) for r in clips)
        salida = c['salida'] or os.path.join(AQUI, 'CORTES')
        etiqueta = re.sub(r'[^0-9]', '', time.strftime('%Y%m%d-%H%M%S'))
        dir_clips = os.path.join(salida, 'seleccion_' + etiqueta)
        os.makedirs(dir_clips, exist_ok=True)
        tocar(t, estado='cortando', total=total, carpeta=dir_clips)

        hechos, mapa, n = [], [], 0
        for (part, vid), rs in sorted(grupos.items()):
            video = buscar_video(c, vid, part)
            rs.sort(key=lambda r: float(r.get('inicio_seg') or 0))
            partes = []
            for r in rs:
                fila = dict(ini=float(r.get('inicio_seg') or 0),
                            fin=float(r.get('fin_seg') or 0),
                            jug=r.get('jugador', ''), num=r.get('numero', ''),
                            acc=r.get('accion', ''), det=r.get('detalle', ''),
                            val=r.get('valoracion', ''), set=r.get('set', ''))
                if fila['fin'] <= fila['ini']:
                    continue
                for k in range(max(1, int(r.get('repetir') or 1))):
                    n += 1
                    nom = '%03d_%s_%s_%s_%s_set%s.mp4' % (
                        n, limpio(fila['num']), limpio(fila['jug']), limpio(fila['acc']),
                        VALOR.get(str(fila['val']).strip(), limpio(fila['val']) or 'sv'),
                        limpio(fila['set']))
                    if int(r.get('repetir') or 1) > 1:
                        nom = nom[:-4] + ('_x%d.mp4' % (k + 1))
                    p = os.path.join(dir_clips, nom)
                    ok, err = cortar(ff, video, fila, p, modo, fnt)
                    if not ok:
                        continue
                    partes.append(p)
                    dur, desde = fila['fin'] - fila['ini'], fila['ini']
                    if modo == 'rapido':
                        t0, dr = arranque_real(ff, p)
                        if t0 is not None:
                            dur, desde = dr, t0
                    mapa.append(dict(archivo=nom, partido=part, jugador=fila['jug'],
                                     numero=fila['num'], accion=fila['acc'],
                                     valoracion=fila['val'], set=fila['set'],
                                     desde=round(fila['ini'], 2), hasta=round(fila['fin'], 2),
                                     desde_real=round(desde, 2), dura=round(dur, 2)))
                    tocar(t, hechos=n, mensaje=nom)
            if partes:
                dest = os.path.join(dir_clips, 'MONTAJE_%s.mp4' % (limpio(part) or 'todo'))
                if pegar(ff, partes, dest):
                    hechos.append(dest)
        with io.open(os.path.join(dir_clips, 'clips.json'), 'w', encoding='utf-8') as f:
            f.write(json.dumps(dict(modo=modo, clips=mapa), ensure_ascii=False, indent=1))
        tocar(t, estado='listo', hechos=n, archivos=[os.path.basename(x) for x in hechos],
              carpeta=dir_clips, mensaje='')
    except Exception as e:
        tocar(t, estado='error', error=str(e))


# ══════════════════════════════════════════════════════════════════════════
#   el servidor
# ══════════════════════════════════════════════════════════════════════════

class Mozo(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    server_version = 'AyudanteVolley/' + VERSION

    def log_message(self, *a):
        pass                              # sin ruido en la consola

    # ── los permisos del navegador ────────────────────────────────────────
    def _origen(self):
        o = self.headers.get('Origin') or ''
        return o if o in PERMITIDOS else None

    def _cabeceras(self, code=200, tipo='application/json'):
        o = self._origen()
        self.send_response(code)
        self.send_header('Content-Type', tipo + '; charset=utf-8')
        if o:
            self.send_header('Access-Control-Allow-Origin', o)
            self.send_header('Vary', 'Origin')
        # Chrome, antes de dejar que una pagina publica hable con algo de la red
        # local, pregunta aparte. Si no se contesta esto, el pedido no llega.
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store')

    def _mandar(self, obj, code=200):
        cuerpo = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self._cabeceras(code)
        self.send_header('Content-Length', str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def do_OPTIONS(self):
        self._cabeceras(204, 'text/plain')
        self.send_header('Content-Length', '0')
        self.end_headers()

    # ── lo que sabe contestar ─────────────────────────────────────────────
    def do_GET(self):
        ruta = self.path.split('?')[0]
        if ruta == '/ping':
            c = leer_config()
            return self._mandar(dict(ok=True, version=VERSION,
                                     videos=len(c['videos']), carpetas=c['carpetas'],
                                     salida=c['salida'] or os.path.join(AQUI, 'CORTES')))
        if ruta == '/estado':
            t = ''
            if '?' in self.path:
                for p in self.path.split('?', 1)[1].split('&'):
                    if p.startswith('t='):
                        t = p[2:]
            with _LOCK:
                j = TRABAJOS.get(t)
            if not j:
                return self._mandar(dict(error='no conozco ese trabajo'), 404)
            return self._mandar(j)
        return self._mandar(dict(error='no se que es eso'), 404)

    def do_POST(self):
        if not self._origen():
            # Sin origen conocido no se hace nada. Esto es lo que impide que
            # otra pagina cualquiera que tengas abierta le de ordenes.
            return self._mandar(dict(error='pagina no autorizada'), 403)
        if self.path.split('?')[0] != '/cortar':
            return self._mandar(dict(error='no se que es eso'), 404)
        try:
            largo = int(self.headers.get('Content-Length') or 0)
            if largo > 4 * 1024 * 1024:
                return self._mandar(dict(error='pedido demasiado grande'), 413)
            pedido = json.loads(self.rfile.read(largo).decode('utf-8'))
        except Exception as e:
            return self._mandar(dict(error='no entendi el pedido: %s' % e), 400)
        clips = pedido.get('clips') or []
        if not clips:
            return self._mandar(dict(error='la seleccion vino vacia'), 400)
        if len(clips) > 2000:
            return self._mandar(dict(error='son demasiados clips de una'), 400)
        t = nuevo_trabajo()
        threading.Thread(target=trabajar, args=(t, pedido), daemon=True).start()
        return self._mandar(dict(ok=True, trabajo=t, total=len(clips)))


def preguntar_carpetas(c):
    """La primera vez hay que decirle donde estan los videos."""
    print()
    print('     Todavia no se donde buscar los videos de los partidos.')
    print('     Arrastra la carpeta donde los guardas (el disco extraible, por')
    print('     ejemplo) y apreta Enter. Podes agregar varias, una por vez.')
    print('     Enter solo para terminar.')
    while True:
        r = input('\n     Carpeta: ').strip().strip('"').strip("'")
        if not r:
            break
        if os.path.isdir(r):
            if r not in c['carpetas']:
                c['carpetas'].append(r)
            print('     anotada')
        else:
            print('     esa carpeta no existe')
    if not c['salida']:
        r = input('\n     Donde dejo los cortes? (Enter para una carpeta CORTES aca): ')
        r = r.strip().strip('"').strip("'")
        c['salida'] = r if r and os.path.isdir(r) else ''
    guardar_config(c)


# ══════════════════════════════════════════════════════════════════════════
#   medir los saques sin que nadie apriete nada
# ══════════════════════════════════════════════════════════════════════════
#
# Cuando aparece un .dvw nuevo en una carpeta DVW, con su video al lado, no
# hay ninguna razon para que alguien tenga que venir a apretar un boton: el
# ayudante ya esta abierto y la maquina esta libre. Asi que lo hace solo.
#
# SOLO cuando el .dvw trae adentro la ruta de su video y esa ruta existe. Eso
# significa que el scouting se hizo CON el video puesto, y entonces el reloj
# del scout y el del video son el mismo: el desfase es cero y no hay nada que
# preguntar. Si el scouting fue en vivo, el reloj arranca en otro lado y hay
# que decirle a mano donde cae el primer saque; esos quedan para MEDIR_SAQUES
# a mano, porque medirlos con el desfase equivocado daria numeros que parecen
# buenos y no lo son.

def _slug(dvw):
    b = os.path.splitext(os.path.basename(dvw))[0]
    b = re.sub(r'^[&\s]+', '', b)
    return re.sub(r'[^A-Za-z0-9]+', '_', b).strip('_').upper()[:40] or 'PARTIDO'


def _falta_medir(dvw):
    """(video, cuantos saques) si hay que medirlo; None si no."""
    try:
        video, saques, _eq = leer_dvw(dvw)
    except Exception:
        return None
    if not saques:
        return None
    if not video or not os.path.exists(video):
        return None                      # scouting en vivo o video en otra maquina
    salida = os.path.join(os.path.dirname(os.path.abspath(dvw)),
                          'velocidades_%s.json' % _slug(dvw))
    if os.path.exists(salida):
        try:
            with io.open(salida, encoding='utf-8') as f:
                d = json.load(f)
            if len(d.get('saques') or {}) >= len(saques):
                return None              # ya esta entero
        except Exception:
            pass
    return video, len(saques)


def _cuantos_medidos(dvw):
    salida = os.path.join(os.path.dirname(os.path.abspath(dvw)),
                          'velocidades_%s.json' % _slug(dvw))
    try:
        with io.open(salida, encoding='utf-8') as f:
            return len(json.load(f).get('saques') or {})
    except Exception:
        return 0


def _trabajando(dvw, minutos=3):
    """Si el archivo de velocidades se movio recien, alguien ya lo esta
    midiendo —MEDIR_SAQUES a mano, por ejemplo— y no hay que arrancar otro."""
    salida = os.path.join(os.path.dirname(os.path.abspath(dvw)),
                          'velocidades_%s.json' % _slug(dvw))
    try:
        return (time.time() - os.path.getmtime(salida)) < minutos * 60
    except OSError:
        return False


def _intentos(c, dvw):
    return int((c['medidos'].get(os.path.abspath(dvw)) or {}).get('intentos') or 0)


def _anotar(dvw, ok, cuantos):
    """Que paso con este .dvw, para no volver a intentarlo eternamente.

    Un .dvw que no se puede medir —el video esta cortado, el scout esta en otro
    reloj— fallaria igual la proxima vez. Sin esta libreta el vigilante lo
    reintentaria cada minuto para siempre, tapando la ventana de mensajes y
    ocupando la maquina al pedo.
    """
    c = leer_config()
    k = os.path.abspath(dvw)
    d = c['medidos'].get(k) or {}
    # Si en este intento se midio alguno mas que en el anterior, el contador
    # vuelve a cero: una corrida que quedo por la mitad —porque cerraron la
    # ventana— tiene que poder seguir, y eso no es un fallo.
    hechos = _cuantos_medidos(dvw)
    if hechos > int(d.get('hechos') or 0):
        d['intentos'] = 0
    d['hechos'] = hechos
    d['intentos'] = int(d.get('intentos') or 0) + 1
    d['ultimo'] = time.strftime('%Y-%m-%d %H:%M')
    d['ok'] = bool(ok)
    d['saques'] = cuantos
    c['medidos'][k] = d
    guardar_config(c)


def _medir(dvw, video, cuantos):
    """Corre MEDIR_SAQUES como lo correria una persona, contestando que si."""
    guion = os.path.join(AQUI, 'MEDIR_SAQUES.py')
    if not os.path.exists(guion):
        return False
    print()
    print('     [medir] %s — %d saques. Esto tarda un rato; el ayudante sigue'
          % (os.path.basename(dvw), cuantos))
    print('     [medir] atendiendo la pagina mientras tanto.')
    try:
        p = subprocess.Popen([sys.executable, guion, dvw, video],
                             stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.STDOUT,
                             cwd=AQUI, universal_newlines=True)
        # las respuestas: desfase (ninguno), rango (todos), calibracion (la de
        # siempre) y el Enter del final
        p.communicate(input='\n\n\n\n', timeout=6 * 3600)
        ok = (p.returncode == 0)
    except Exception as e:
        _anotar(dvw, False, cuantos)
        print('     [medir] no pude: %s' % e)
        return False
    _anotar(dvw, ok, cuantos)
    print('     [medir] listo: velocidades_%s.json' % _slug(dvw))
    return ok


def vigilar():
    """Cada tanto mira las carpetas DVW y mide lo que falte."""
    time.sleep(20)                        # que el ayudante termine de levantar
    while True:
        try:
            c = leer_config()
            if c.get('medir_saques_solo'):
                for carpeta in sorted(d for d in os.listdir(AQUI)
                                      if d.upper().startswith('DVW ')
                                      and os.path.isdir(os.path.join(AQUI, d))):
                    ruta = os.path.join(AQUI, carpeta)
                    for f in sorted(os.listdir(ruta)):
                        if not f.lower().endswith('.dvw'):
                            continue
                        dvw = os.path.join(ruta, f)
                        r = _falta_medir(dvw)
                        if not r:
                            continue
                        if _intentos(c, dvw) >= 2:
                            continue        # ya fallo dos veces: no insisto mas
                        if _trabajando(dvw):
                            continue        # ya lo esta midiendo alguien
                        # que no se haya copiado a medias
                        t1 = os.path.getsize(dvw)
                        time.sleep(3)
                        if os.path.getsize(dvw) != t1:
                            continue
                        _medir(dvw, r[0], r[1])
        except Exception as e:
            print('     [medir] %s' % e)
        time.sleep(60)


def main():
    print()
    print('  ' + '=' * 68)
    print('     EL AYUDANTE DE VOLLEY-STATS')
    print('  ' + '=' * 68)
    c = leer_config()
    if not c['carpetas']:
        preguntar_carpetas(c)
        c = leer_config()
    print()
    print('     Busco los videos en:')
    for f in c['carpetas']:
        print('        %s%s' % (f, '' if os.path.isdir(f) else '   (ahora no esta conectada)'))
    print('     Dejo los cortes en:')
    print('        %s' % (c['salida'] or os.path.join(AQUI, 'CORTES')))
    print()
    print('     Escuchando en http://127.0.0.1:%d' % PUERTO)
    print()
    print('     Ya podes ir a Cortes, elegir lo que quieras y apretar')
    print('     "Cortar ahora". Esta ventana tiene que quedar abierta.')
    print()
    if leer_config().get('medir_saques_solo'):
        print('     Ademas mido la velocidad de los saques sola, cuando aparece')
        print('     un .dvw nuevo que tenga su video al lado.')
        print()
    print('     (para cambiar las carpetas, borra ayudante_config.json)')
    print('  ' + '=' * 68)
    threading.Thread(target=vigilar, daemon=True).start()
    try:
        ThreadingHTTPServer(('127.0.0.1', PUERTO), Mozo).serve_forever()
    except OSError as e:
        print()
        print('     No pude escuchar en el puerto %d: %s' % (PUERTO, e))
        print('     Lo mas probable es que el ayudante ya este abierto en otra ventana.')
        input('\n     Enter para cerrar. ')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n     Chau.')
