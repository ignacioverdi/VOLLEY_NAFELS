# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
  CORTAR SAQUES — el montaje para el radar, sacado del video ORIGINAL
════════════════════════════════════════════════════════════════════════════

  QUE PROBLEMA RESUELVE

  El montaje de saques que exporta DataVolley llega en 1280x720 a 2,0 Mbps.
  Para una toma abierta de gimnasio eso es muy poco: YouTube recomienda 5 Mbps
  para 720p, y aca hay una pelota que a veinte metros ocupa cinco pixeles. La
  compresion se la come contra el fondo.

  Por eso filmar en 1080p no alcanza por si solo: si despues el montaje sale
  igual comprimido, la mejora se pierde en la exportacion.

  Este programa saltea la exportacion. Corta los saques DIRECTO DEL VIDEO
  ORIGINAL, con la calidad que tenga el original.

  COMO SABE DONDE ESTA CADA SAQUE

  El .dvw ya lo dice. Adentro tiene dos cosas que alcanzan:

    [3VIDEO] Camera0=...   la ruta del video original
    campo 12 de cada accion   el segundo exacto de esa accion en ese video

  Asi que no hay que detectar nada: se lee el .dvw, se corta, y de paso se
  escribe el mapa de que saque es cada clip —quien saco, de que tipo, como
  termino—. Eso tambien saca del medio el paso de leer el rotulo azul con OCR,
  que era la parte del sistema que podia equivocarse.

  COMO SE USA

    Arrastra el archivo .dvw del partido sobre CORTAR_SAQUES.bat

  Si el video no esta donde dice el .dvw —porque lo scouteo otra computadora—
  te lo pregunta y le arrastras el video.

  QUE DEJA

    <PARTIDO>_set1.mp4  ... un archivo por set
    <PARTIDO>_set1_saques.json  ... el mapa de cada uno

  Eso es lo que hay que mandar para medir.

════════════════════════════════════════════════════════════════════════════
"""
import io
import os
import re
import subprocess
import sys
import json
import zipfile
import shutil
import tempfile

try:
    from urllib.request import urlopen, Request
except ImportError:                                     # Python 2, por si acaso
    from urllib2 import urlopen, Request

AQUI = os.path.dirname(os.path.abspath(__file__))
CARPETA_FF = os.path.join(AQUI, '_ffmpeg')
URL_FFMPEG = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'

# ── LA VENTANA DE CADA CLIP ───────────────────────────────────
# El segundo que guarda el .dvw NO es el golpe. Leyendo el manual de DataVolley
# (9.1.4.4, Alignment Smart Time) y comprobandolo en los cuatro partidos de la
# temporada, lo que pasa es esto:
#
#   · el que scoutea alinea UN punto por rally;
#   · de ahi DataVolley genera los tiempos del resto con un algoritmo fijo
#     (saque + 3 s = primer ataque rival, ataque + 3,2 s = ataque siguiente...);
#   · y el manual pide expresamente que la S se tipee EN EL PIQUE, no en el
#     golpe: "we strongly suggest the user who is scouting to type S for serve
#     when the player tosses the ball and not when the player makes contact".
#
# Comprobado en los .dvw del club: saque y recepcion comparten el segundo en el
# 100% de los casos, y ataque/bloqueo/defensa tambien. Eso solo pasa si los
# tiempos son generados, no medidos uno por uno.
#
# O sea que el golpe cae alrededor de UN SEGUNDO DESPUES del segundo anotado,
# con un error de alineacion de un par de segundos para cualquier lado. Con la
# ventana de 2,5 + 1,5 el vuelo se podia quedar afuera del recorte y el radar
# no habria tenido nada que medir.
#
# Por eso va ancha hasta que midamos el desfase real en un partido. Una vez
# medido se puede achicar y los archivos bajan a la mitad.
ANTES = 3.0      # segundos antes del segundo anotado
DESPUES = 4.0    # segundos despues

# ── COMO SE CORTA ─────────────────────────────────────────────────
# COPIA = True corta SIN recomprimir: se copian los bytes del original tal cual.
# Es unas veinte veces mas rapido —un partido entero en menos de dos minutos en
# vez de quince— y no pierde absolutamente nada, porque no se decodifica ni se
# vuelve a codificar. Y como no decodifica, TARDA LO MISMO CON CUALQUIER
# CALIDAD: un original de 28 Mbps sale tan rapido como uno de 2.
#
# A cambio los archivos pesan lo que pesa el original: con 4 s por saque y 139
# saques, alrededor de 1,8 GB.
#
# El unico costo es que el corte no cae en el segundo exacto que se pide, sino
# en el cuadro clave anterior (en AVCHD, hasta medio segundo antes). Eso NO
# afecta la medicion: despues de cortar se lee el tiempo real donde arranco
# cada clip y se anota en el mapa, asi que el golpe queda ubicado exacto igual.
#
# Si se pone en False vuelve a recomprimir con CRF: mas lento, archivos mas
# chicos, y una perdida chica pero real de calidad.
COPIA = True

# ── LA CALIDAD (solo si COPIA = False) ──────────────────────────────
# 20 es practicamente igual al original y da la mitad del tamanio. Si los
# archivos quedan muy pesados para mandar, subir a 23. Nunca pasar de 26: ahi
# empieza a borronearse la pelota, que es justo lo que hay que evitar.
CRF = 20


# ══════════════════════════════════════════════════════════════════════════
#   ffmpeg
# ══════════════════════════════════════════════════════════════════════════

def buscar_ffmpeg():
    """Donde esta ffmpeg, si esta. Es el mismo que ya usa UNIR_VIDEO."""
    local = os.path.join(CARPETA_FF, 'ffmpeg.exe')
    if os.path.exists(local):
        return local
    for cmd in ('ffmpeg', 'ffmpeg.exe'):
        try:
            subprocess.run([cmd, '-version'], capture_output=True, timeout=10)
            return cmd
        except Exception:
            continue
    return None


def bajar_ffmpeg():
    """La primera vez lo baja solo. Son unos 80 MB y queda guardado."""
    print()
    print('  ' + '=' * 68)
    print('     PRIMERA VEZ: descargando el motor de video')
    print('  ' + '=' * 68)
    print('     Es ffmpeg, el mismo que usa UNIR_VIDEO. Son unos 80 MB y se')
    print('     baja una sola vez: despues queda en la carpeta _ffmpeg.')
    print()
    r = input('     Seguir? (s/n): ').strip().lower()
    if r not in ('s', 'si', 'sí', 'y', ''):
        return None
    try:
        os.makedirs(CARPETA_FF, exist_ok=True)
        tmp = os.path.join(tempfile.gettempdir(), 'ffmpeg.zip')
        print('     bajando...', flush=True)
        pedido = Request(URL_FFMPEG, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(pedido, timeout=120) as r_, open(tmp, 'wb') as f:
            shutil.copyfileobj(r_, f)
        print('     abriendo...', flush=True)
        with zipfile.ZipFile(tmp) as z:
            for n in z.namelist():
                base = os.path.basename(n)
                if base.lower() in ('ffmpeg.exe', 'ffprobe.exe'):
                    with z.open(n) as o, open(os.path.join(CARPETA_FF, base), 'wb') as d:
                        shutil.copyfileobj(o, d)
        os.remove(tmp)
        exe = os.path.join(CARPETA_FF, 'ffmpeg.exe')
        if os.path.exists(exe):
            print('     listo.')
            return exe
    except Exception as e:
        print('     no se pudo: %s' % e)
    print()
    print('     A mano: entra a https://www.gyan.dev/ffmpeg/builds/, baja')
    print('     ffmpeg-release-essentials.zip, y copia ffmpeg.exe y')
    print('     ffprobe.exe a la carpeta _ffmpeg que esta al lado de este')
    print('     programa.')
    return None


def datos_del_video(ff, ruta):
    """Resolucion, cuadros por segundo y bitrate del original."""
    probe = ff.replace('ffmpeg', 'ffprobe')
    try:
        s = subprocess.run([probe, '-v', 'error', '-select_streams', 'v:0',
                            '-show_entries', 'stream=width,height,r_frame_rate,field_order,codec_name',
                            '-show_entries', 'format=bit_rate,duration',
                            '-of', 'json', ruta], capture_output=True, timeout=60)
        d = json.loads(s.stdout.decode('utf-8', 'ignore'))
        v = (d.get('streams') or [{}])[0]
        fm = d.get('format') or {}
        fr = v.get('r_frame_rate', '0/1').split('/')
        fps = float(fr[0]) / float(fr[1]) if len(fr) == 2 and float(fr[1]) else 0.0
        # 60i quiere decir ENTRELAZADO: cada cuadro son dos medias imagenes
        # tomadas con 1/60 de segundo de diferencia.
        orden = (v.get('field_order') or 'progressive').lower()
        entre = orden not in ('progressive', 'unknown', '')
        return dict(w=v.get('width'), h=v.get('height'), fps=fps, entrelazado=entre,
                    orden=orden, codec=v.get('codec_name'),
                    mbps=(float(fm.get('bit_rate', 0)) / 1e6) if fm.get('bit_rate') else 0.0,
                    dur=float(fm.get('duration', 0) or 0))
    except Exception:
        return None


# ══════════════════════════════════════════════════════════════════════════
#   el .dvw
# ══════════════════════════════════════════════════════════════════════════

def leer_dvw(ruta):
    """Los saques, con su set y su segundo dentro del video original.

    El .dvw es texto plano con secciones entre corchetes. De [3SCOUT] nos
    interesan las lineas de saque, que se reconocen asi:

        *04SM/~~~16B
        ^ ^^ ^^ ^
        | |  || valoracion   # ace  / freeball  + bueno  ! neutro  - malo  = error
        | |  |tipo           M flotado  Q potencia  T salto flotado  H alta
        | |  skill: S es saque
        | numero de camiseta
        equipo: * el local, a el visitante

    Y de los campos separados por ; :  [8] el set,  [12] el segundo del video.
    """
    t = io.open(ruta, encoding='latin-1').read().splitlines()

    # ── el video original ──
    video = None
    for k, l in enumerate(t):
        if l.startswith('[3VIDEO]'):
            for l2 in t[k + 1:]:
                if l2.startswith('['):
                    break
                m = re.match(r'\s*Camera\d+\s*=\s*(.+?)\s*$', l2)
                if m:
                    video = m.group(1)
                    break
            break

    # ── los nombres, para que el mapa diga quien saco ──
    nombres = {'*': {}, 'a': {}}
    equipos = {'*': 'LOCAL', 'a': 'VISITA'}
    for pre, sec in (('*', '[3PLAYERS-H]'), ('a', '[3PLAYERS-V]')):
        i = [k for k, l in enumerate(t) if l.startswith(sec)]
        if not i:
            continue
        for l in t[i[0] + 1:]:
            if l.startswith('['):
                break
            c = l.split(';')
            if len(c) > 10 and c[1].strip().isdigit():
                nombres[pre][int(c[1])] = (c[9].strip(), c[10].strip())
    i = [k for k, l in enumerate(t) if l.startswith('[3TEAMS]')]
    if i:
        for j, pre in ((1, '*'), (2, 'a')):
            if i[0] + j < len(t):
                c = t[i[0] + j].split(';')
                if len(c) > 1 and c[1].strip():
                    equipos[pre] = c[1].strip()

    # ── los saques ──
    i = [k for k, l in enumerate(t) if l.startswith('[3SCOUT]')]
    if not i:
        return None, [], equipos
    saques = []
    for l in t[i[0] + 1:]:
        if l.startswith('['):
            break
        c = l.split(';')
        if len(c) < 13:
            continue
        b = c[0]
        if len(b) < 6 or b[0] not in '*a' or not b[1:3].isdigit() or b[3] != 'S':
            continue
        try:
            seg = int(c[12])
        except (ValueError, TypeError):
            continue
        num = int(b[1:3])
        ap, no = nombres[b[0]].get(num, ('', ''))
        saques.append(dict(pre=b[0], num=num, tipo=b[4], val=b[5],
                           set=int(c[8]) if c[8].strip().isdigit() else 0,
                           seg=seg, ape=ap, nombre=no, equipo=equipos[b[0]]))
    return video, saques, equipos


# ══════════════════════════════════════════════════════════════════════════
#   cortar
# ══════════════════════════════════════════════════════════════════════════

def _arranque_real(ff, p):
    """En que segundo del ORIGINAL arranca de verdad este recorte, y cuanto dura.

    Cortando sin recomprimir ffmpeg no puede empezar en cualquier cuadro: tiene
    que arrancar en un cuadro clave, que en AVCHD aparece cada medio segundo.
    O sea que el clip empieza un poco ANTES de lo que se pidio, y cuanto antes
    cambia de saque en saque.

    Eso no es un problema mientras se sepa. Con -copyts los tiempos del recorte
    quedan en la escala del original, asi que alcanza con leer el primero. Con
    ese numero, la posicion del golpe dentro del clip queda exacta, que es lo
    unico que el radar necesita.

    Devuelve (arranque, duracion) en segundos, o (None, None) si no se pudo leer.
    """
    probe = ff.replace('ffmpeg', 'ffprobe')
    try:
        a = subprocess.run([probe, '-v', 'error', '-select_streams', 'v:0',
                            '-show_entries', 'packet=pts_time', '-of', 'csv=p=0',
                            '-read_intervals', '%+#1', p],
                           capture_output=True, timeout=60)
        t = a.stdout.decode('utf-8', 'ignore').strip().split('\n')[0].strip().strip(',')
        b = subprocess.run([probe, '-v', 'error', '-show_entries', 'format=duration',
                            '-of', 'csv=p=0', p], capture_output=True, timeout=60)
        d = b.stdout.decode('utf-8', 'ignore').strip()
        return float(t), float(d)
    except Exception:
        return None, None


DESFASE = [0.0]      # lo que se corrigio entre el reloj del scout y el del video


def cortar(ff, video, saques, salida_base, carpeta, datos=None):
    """Un archivo por set, con todos los saques de ese set pegados.

    NO SE RECOMPRIME NADA. Se copian los bytes del original tal cual (COPIA).
    Eso hace dos cosas que importan:

      · es unas veinte veces mas rapido, y ademas tarda lo mismo con cualquier
        calidad de original, porque no decodifica ni codifica: solo copia;
      · no pierde ni un poco de calidad, que es justo lo que estabamos
        tratando de recuperar.

    SI EL VIDEO VIENE ENTRELAZADO (60i) NO SE DESENTRELAZA ACA.
    El 60i ya tiene sesenta instantes por segundo, guardados de a dos por cuadro
    (una media imagen con las lineas pares y otra con las impares, tomadas con
    1/60 de segundo de diferencia). Separarlos es una decision que pierde algo
    —hay que inventar las lineas que faltan— asi que conviene hacerla del lado
    de la medicion, con el codigo del radar, y no aca. En el mapa queda anotado
    que el origen viene entrelazado para que la medicion lo sepa.
    """
    tmp = os.path.join(carpeta, '_cortes_tmp')
    os.makedirs(tmp, exist_ok=True)
    hechos = []
    entrelazado = bool(datos and datos.get('entrelazado'))
    fps_src = (datos.get('fps') or 0.0) if datos else 0.0
    if entrelazado:
        print()
        print('     El video viene ENTRELAZADO (60i). Lo dejo asi y lo anoto en')
        print('     el mapa: separar los campos lo hace el radar al medir, que')
        print('     es donde menos se pierde.')
    if COPIA:
        print()
        print('     Corto SIN recomprimir: no se pierde nada y es mucho mas rapido.')

    sets = sorted(set(s['set'] for s in saques))
    for st in sets:
        de_este = [s for s in saques if s['set'] == st]
        print()
        print('  SET %d \u2014 %d saques' % (st, len(de_este)))
        partes, mapa = [], []
        acum = 0.0
        for k, s in enumerate(de_este, 1):
            ini = max(0.0, s['seg'] - ANTES)
            fin = s['seg'] + DESPUES
            p = os.path.join(tmp, 'p%03d.mp4' % k)
            cmd = [ff, '-hide_banner', '-loglevel', 'error', '-y', '-ss', '%.3f' % ini]
            if COPIA:
                # -to es absoluto porque -copyts deja los tiempos en la escala
                # del original. Sin -copyts habria que usar -t, que es relativo.
                cmd += ['-to', '%.3f' % fin, '-i', video, '-an',
                        '-c', 'copy', '-copyts', '-muxdelay', '0', '-muxpreload', '0', p]
            else:
                cmd += ['-i', video, '-t', '%.3f' % (fin - ini), '-an']
                if entrelazado:
                    cmd += ['-vf', 'yadif=mode=1']
                cmd += ['-c:v', 'libx264', '-crf', str(CRF),
                        '-preset', 'veryfast', '-pix_fmt', 'yuv420p', p]
            r = subprocess.run(cmd, capture_output=True)
            if r.returncode != 0 or not os.path.exists(p) or os.path.getsize(p) < 4096:
                print('     saque %d: no se pudo cortar' % k)
                continue

            if COPIA:
                t0, dur = _arranque_real(ff, p)
                if t0 is None:
                    t0, dur = ini, fin - ini
            else:
                t0, dur = ini, fin - ini

            partes.append(p)
            # El golpe, medido desde el arranque REAL del clip. Este es el
            # numero que usa el radar: sin el, el corte en cuadro clave correria
            # la busqueda hasta medio segundo.
            en_clip = round(s['seg'] - t0, 3)
            mapa.append(dict(clip=len(partes),
                             ini=round(acum, 3),
                             fin=round(acum + dur, 3),
                             saque=k, set=st,
                             equipo=s['equipo'], num=s['num'], ape=s['ape'],
                             nombre=s['nombre'], tipo=s['tipo'], val=s['val'],
                             seg_original=s['seg'],
                             arranque_en_el_original=round(t0, 3),
                             golpe_en=en_clip,
                             golpe_en_el_montaje=round(acum + en_clip, 3)))
            acum += dur
            if k % 10 == 0 or k == len(de_este):
                print('     %d de %d' % (k, len(de_este)), flush=True)
        if not partes:
            continue
        lista = os.path.join(tmp, 'lista.txt')
        with io.open(lista, 'w', encoding='utf-8') as f:
            for p in partes:
                f.write("file '%s'\n" % p.replace('\\', '/').replace("'", "'\\''"))
        destino = os.path.join(carpeta, '%s_set%d.mp4' % (salida_base, st))
        r = subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-y',
                            '-f', 'concat', '-safe', '0', '-i', lista,
                            '-c', 'copy', destino], capture_output=True)
        if r.returncode != 0:
            print('     no se pudo pegar el set %d' % st)
            continue
        # La fps va en el mapa porque la medicion la usa para pasar de pixeles
        # por cuadro a metros por segundo: equivocarla corre la velocidad en la
        # misma proporcion.
        jmapa = dict(partido=salida_base, archivo=os.path.basename(destino),
                     sets_en_este_archivo=[st],
                     fps=round(fps_src, 4) or None,
                     entrelazado_de_origen=entrelazado,
                     fps_si_se_desentrelaza=(round(fps_src * 2, 4) if entrelazado else None),
                     sin_recomprimir=bool(COPIA),
                     ventana=dict(antes=ANTES, despues=DESPUES),
                     duracion=round(acum, 3),
                     saques_totales_del_partido=len(saques),
                     origen='corte directo del video original (sin exportar de DataVolley)',
                     desfase_aplicado=round(DESFASE[0], 2),
                     clips=mapa)
        with io.open(os.path.join(carpeta, '%s_set%d_saques.json' % (salida_base, st)),
                     'w', encoding='utf-8') as f:
            f.write(json.dumps(jmapa, ensure_ascii=False, indent=1))
        mb = os.path.getsize(destino) / 1e6
        print('     -> %s  (%.0f MB)' % (os.path.basename(destino), mb))
        hechos.append(destino)
        for p in partes:
            try:
                os.remove(p)
            except OSError:
                pass
    try:
        shutil.rmtree(tmp)
    except OSError:
        pass
    return hechos


def mmss(seg):
    seg = int(seg or 0)
    h, r = divmod(seg, 3600)
    m, s = divmod(r, 60)
    return ('%d:%02d:%02d' % (h, m, s)) if h else ('%d:%02d' % (m, s))


def a_segundos_simple(txt):
    """4:35 · 1:04:35 · 275. None si no se entiende."""
    p = [x for x in str(txt).replace('.', ':').strip().split(':') if x.strip()]
    try:
        p = [int(x) for x in p]
    except ValueError:
        return None
    if not p or len(p) > 3 or any(x < 0 for x in p):
        return None
    s = 0
    for x in p:
        s = s * 60 + x
    return s


def pedir(txt):
    r = input(txt).strip()
    return r.strip('"').strip("'")


def main():
    print()
    print('  ' + '=' * 68)
    print('     CORTAR SAQUES — del video original, sin pasar por la')
    print('     exportacion de DataVolley')
    print('  ' + '=' * 68)

    # Se acepta tambien un archivo sin extension: el panel a veces guarda el
    # scout sin el .dvw y arrastrarlo no hacia nada, sin decir por que.
    args = [a for a in sys.argv[1:]
            if os.path.isfile(a) and (a.lower().endswith('.dvw') or '.' not in os.path.basename(a))]
    dvw = args[0] if args else pedir('\n     Arrastra el .dvw del partido y apreta Enter: ')
    if not dvw or not os.path.exists(dvw):
        print('     No encuentro ese archivo.')
        input('\n     Enter para cerrar. ')
        return

    video, saques, equipos = leer_dvw(dvw)
    if not saques:
        print('     Ese .dvw no tiene saques con tiempo de video.')
        input('\n     Enter para cerrar. ')
        return

    print()
    print('     %s  vs  %s' % (equipos['*'], equipos['a']))
    print('     %d saques en %d sets' % (len(saques), len(set(s['set'] for s in saques))))

    if not video or not os.path.exists(video):
        print()
        if video:
            print('     El .dvw dice que el video esta en:')
            print('       %s' % video)
            print('     y ahi no esta (seguramente lo scouteo otra computadora).')
        print()
        video = pedir('     Arrastra el video del partido y apreta Enter: ')
    if not video or not os.path.exists(video):
        print('     Sin el video no puedo cortar.')
        input('\n     Enter para cerrar. ')
        return

    ff = buscar_ffmpeg() or bajar_ffmpeg()
    if not ff:
        input('\n     Enter para cerrar. ')
        return

    d = datos_del_video(ff, video)
    if d:
        print()
        print('     El video original es %sx%s a %.0f cuadros por segundo, %.1f Mbps'
              % (d['w'], d['h'], d['fps'], d['mbps']))
        print('     (el montaje de DataVolley llegaba en 1280x720 a 2,0 Mbps)')
        if d.get('entrelazado'):
            print('     Viene ENTRELAZADO (%s): son 60 medias imagenes por segundo.' % d['orden'])
        if d['w'] and int(d['w']) < 1900:
            print()
            print('     OJO: el original no es 1920 de ancho. En la camara hay que')
            print('     subir el MODO GRAB: HQ y LP graban 1440x1080, que es angosto.')
            print('     PS o FX graban 1920x1080.')

    base = os.path.splitext(os.path.basename(dvw))[0]
    base = re.sub(r'^[&\s]+', '', base)
    base = re.sub(r'[^A-Za-z0-9]+', '_', base).strip('_').upper()[:40] or 'PARTIDO'
    carpeta = os.path.dirname(os.path.abspath(dvw))

    # ── EL DESFASE ENTRE EL RELOJ DEL .dvw Y EL DEL VIDEO ──────────────────
    # Cuando el scouting se hace en DataVolley con el video puesto, los dos
    # relojes son el mismo y no hay nada que hacer. Pero cuando se scoutea EN
    # VIVO —en el panel, o en DataVolley sin video— el reloj arranca cuando se
    # carga el primer codigo, y la camara arranco antes o despues. Ese desfase
    # es el mismo para todo el partido, asi que con decir donde cae UN saque
    # queda resuelto para los 240.
    #
    # Sin esto, la primera corrida sobre un scout en vivo saldria entera vacia
    # y sin ningun mensaje de error: los recortes caerian en otro momento del
    # video y nadie se enteraria hasta abrirlos.
    prim = min(s['seg'] for s in saques)
    print()
    print('     El primer saque, segun el scout, esta en el segundo %d (%s).'
          % (prim, mmss(prim)))
    print('     Si el scouting se hizo EN VIVO, ese numero es del reloj del')
    print('     panel y no del video. Decime en que momento del video cae ese')
    print('     primer saque y corrijo todos de una.')
    print()
    r = pedir('     Momento en el video (4:35, o Enter si ya coinciden): ')
    desfase = 0.0
    if r:
        m = a_segundos_simple(r)
        if m is None:
            print('     No entendi, sigo sin corregir.')
        else:
            desfase = m - prim
            for s in saques:
                s['seg'] = s['seg'] + desfase
            DESFASE[0] = desfase
            print('     Corrijo %+.0f segundos en los %d saques.' % (desfase, len(saques)))
            ult = max(s['seg'] for s in saques)
            if d and d.get('dur') and ult > d['dur']:
                print()
                print('     [OJO] Con esa correccion el ultimo saque caeria en %s'
                      % mmss(ult))
                print('     y el video dura %s. Algo no cierra: revisa el momento'
                      % mmss(d['dur']))
                print('     que pusiste, o cortalo igual y fijate el primer clip.')

    print()
    print('     Corto %.1f s antes y %.1f s despues de cada saque.' % (ANTES, DESPUES))
    if COPIA:
        print('     Sin recomprimir: no pierde calidad y tarda un par de minutos.')
    print('     Van a quedar en:  %s' % carpeta)
    print()
    if pedir('     Seguir? (s/n): ').lower() not in ('s', 'si', 'sí', 'y', ''):
        return

    hechos = cortar(ff, video, saques, base, carpeta, d)
    print()
    print('  ' + '=' * 68)
    if hechos:
        print('     LISTO. %d archivos, mas su mapa .json al lado.' % len(hechos))
        print('     Eso es lo que hay que mandar para medir.')
    else:
        print('     No salio ninguno. Fijate los mensajes de arriba.')
    print('  ' + '=' * 68)
    input('\n     Enter para cerrar. ')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print('\n     Se rompio: %s' % e)
        input('\n     Enter para cerrar. ')
