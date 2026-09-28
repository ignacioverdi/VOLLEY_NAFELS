# -*- coding: utf-8 -*-
"""CORTAR SELECCION — de la seleccion de Cortes al video, sin pasar por DataVolley.

   En Cortes filtras y tildas lo que te interesa, apretas exportar, y te baja un
   CSV. Este programa toma ese CSV y corta los clips del video original.

   Es lo mismo que hace el Montaje de DataVolley (manual 9.6.5), con dos modos
   que son los mismos dos que tiene el:

     RAPIDO   copia los bytes del original, sin recomprimir. Es el "FAST" del
              manual: tarda segundos y no se pierde nada. Sin rotulos.
     ROTULO   recomprime para poder escribir encima quien fue, que hizo y como
              termino. Tarda mas y pierde un poco, como cualquier recompresion.

   Lo que agrega por encima de DataVolley:

     · el modo rapido no recomprime NADA, asi que el clip sale identico al
       original; la exportacion de DataVolley siempre vuelve a comprimir;
     · deja tambien los clips sueltos, con nombre —04_VAZQUEZ_Saque_ace_set2—
       para mandarle a cada jugador lo suyo sin tener que recortar el montaje;
     · la columna "repetir" del CSV repite una jugada, como el clone del
       manual, pero se edita en el Excel antes de cortar.
"""
import csv
import io
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

try:
    from CORTAR_SAQUES import buscar_ffmpeg, bajar_ffmpeg, datos_del_video
except Exception:
    print('  Falta CORTAR_SAQUES.py en esta misma carpeta (de ahi sale ffmpeg).')
    input('\n  Enter para cerrar. ')
    sys.exit(1)

# ── LA CALIDAD DEL MODO ROTULO ─────────────────────────────────────────────
# Solo se usa cuando hay que escribir encima. En modo rapido no se recomprime.
CRF = 20
# Camara lenta: 1 = normal, 2 = a la mitad. El manual lo ofrece por clip; aca
# es para todo el montaje, que es lo que se usa en la charla tecnica.
LENTO = 1.0

FUENTES = ['C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/arial.ttf',
           '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']


def pedir(t):
    return input(t).strip().strip('"').strip("'")


# Los simbolos de valoracion no sobreviven a un nombre de archivo (# / = no se
# pueden usar en Windows), asi que van con el nombre que les da DataVolley.
VALOR = {'#': 'exc', '+': 'pos', '!': 'ok', '-': 'neg', '/': 'over', '=': 'err'}


def limpio(s):
    s = re.sub(r'[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ ._-]+', '', str(s or '')).strip()
    return re.sub(r'\s+', '_', s)[:40]


def fuente():
    for f in FUENTES:
        if os.path.exists(f):
            return f
    return None


def _esc(t):
    """drawtext usa : y \\ y ' para su propia sintaxis: hay que taparlos."""
    return (str(t or '').replace('\\', '\\\\').replace(':', '\\:')
            .replace("'", "\u2019").replace('%', '\\%'))


# ══════════════════════════════════════════════════════════════════════════
#   el CSV que exporta Cortes
# ══════════════════════════════════════════════════════════════════════════

def leer_csv(ruta):
    """Devuelve las filas y avisa si el CSV es de una version vieja.

    El export viejo no traia la columna 'video'. Se puede usar igual —se
    pregunta el archivo una sola vez— pero si la seleccion mezcla partidos no
    hay forma de saber cual es cual, y eso hay que decirlo.
    """
    with io.open(ruta, encoding='utf-8-sig', newline='') as f:
        filas = list(csv.DictReader(f))
    if not filas:
        return [], False
    tiene_video = 'video' in filas[0]
    out = []
    for r in filas:
        try:
            ini = float(r.get('inicio_seg') or 0)
            fin = float(r.get('fin_seg') or 0)
        except ValueError:
            continue
        if fin <= ini:
            continue
        try:
            rep = max(1, min(5, int(float(r.get('repetir') or 1))))
        except ValueError:
            rep = 1
        out.append(dict(partido=r.get('partido', ''), fecha=r.get('fecha', ''),
                        video=(r.get('video') or '').strip(),
                        ini=ini, fin=fin,
                        jug=r.get('jugador', ''), num=r.get('numero', ''),
                        acc=r.get('accion', ''), det=r.get('detalle', ''),
                        val=r.get('valoracion', ''), set=r.get('set', ''),
                        rep=rep))
    return out, tiene_video


def agrupar(filas):
    """Un grupo por partido: cada uno sale de un archivo de video distinto."""
    g = {}
    for r in filas:
        g.setdefault((r['partido'], r['video']), []).append(r)
    for k in g:
        g[k].sort(key=lambda r: r['ini'])
    return g


# ══════════════════════════════════════════════════════════════════════════
#   cortar
# ══════════════════════════════════════════════════════════════════════════

def rotulo_de(r):
    n = str(r['num']).strip()
    p = ('#%s ' % n if n and n != '0' else '') + str(r['jug']).strip()
    partes = [p, r['acc']]
    if r['det']:
        partes.append(r['det'])
    if r['val']:
        partes.append(r['val'])
    if r['set']:
        partes.append('set ' + str(r['set']))
    return '  ·  '.join(x for x in partes if x)


def cortar(ff, video, r, destino, modo, fnt):
    """Un clip. En modo rapido se copian los bytes; en rotulo se recomprime."""
    cmd = [ff, '-hide_banner', '-loglevel', 'error', '-y',
           '-ss', '%.3f' % r['ini'], '-to', '%.3f' % r['fin'], '-i', video, '-an']
    if modo == 'rapido':
        # -copyts deja los tiempos en la escala del original para poder leer
        # despues donde arranco de verdad el corte (cae en el cuadro clave
        # anterior, hasta medio segundo antes de lo pedido).
        cmd += ['-c', 'copy', '-copyts', '-muxdelay', '0', '-muxpreload', '0']
    else:
        vf = []
        if LENTO and LENTO != 1.0:
            vf.append('setpts=%.3f*PTS' % LENTO)
        if fnt:
            vf.append(
                "drawtext=fontfile='%s':text='%s':fontcolor=white:fontsize=h/26"
                ":box=1:boxcolor=black@0.55:boxborderw=14:x=28:y=h-th-28"
                % (fnt.replace(':', '\\:'), _esc(rotulo_de(r))))
        if vf:
            cmd += ['-vf', ','.join(vf)]
        cmd += ['-c:v', 'libx264', '-crf', str(CRF), '-preset', 'veryfast',
                '-pix_fmt', 'yuv420p']
    cmd.append(destino)
    p = subprocess.run(cmd, capture_output=True)
    ok = p.returncode == 0 and os.path.exists(destino) and os.path.getsize(destino) > 4096
    return ok, p.stderr.decode('utf-8', 'ignore')[-160:]


def arranque_real(ff, p):
    """En que segundo del original arranca de verdad el clip copiado."""
    probe = ff.replace('ffmpeg', 'ffprobe')
    try:
        a = subprocess.run([probe, '-v', 'error', '-select_streams', 'v:0',
                            '-show_entries', 'packet=pts_time', '-of', 'csv=p=0',
                            '-read_intervals', '%+#1', p], capture_output=True, timeout=60)
        t = a.stdout.decode('utf-8', 'ignore').strip().split('\n')[0].strip().strip(',')
        b = subprocess.run([probe, '-v', 'error', '-show_entries', 'format=duration',
                            '-of', 'csv=p=0', p], capture_output=True, timeout=60)
        return float(t), float(b.stdout.decode('utf-8', 'ignore').strip())
    except Exception:
        return None, None


def pegar(ff, partes, destino):
    lista = destino + '.txt'
    with io.open(lista, 'w', encoding='utf-8') as f:
        for p in partes:
            f.write("file '%s'\n" % p.replace('\\', '/').replace("'", "'\\''"))
    r = subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-y',
                        '-f', 'concat', '-safe', '0', '-i', lista,
                        '-c', 'copy', destino], capture_output=True)
    try:
        os.remove(lista)
    except OSError:
        pass
    return r.returncode == 0 and os.path.exists(destino)


# ══════════════════════════════════════════════════════════════════════════
#   el programa
# ══════════════════════════════════════════════════════════════════════════

def main():
    print()
    print('  ' + '=' * 68)
    print('     CORTAR LA SELECCION DE CORTES')
    print('  ' + '=' * 68)

    args = [a for a in sys.argv[1:] if a.lower().endswith('.csv')]
    ruta = args[0] if args else pedir('\n     Arrastra el CSV que bajaste de Cortes: ')
    if not ruta or not os.path.exists(ruta):
        print('     No encuentro ese archivo.')
        input('\n     Enter para cerrar. ')
        return

    filas, tiene_video = leer_csv(ruta)
    if not filas:
        print('     Ese CSV no tiene clips con principio y fin.')
        input('\n     Enter para cerrar. ')
        return

    grupos = agrupar(filas)
    total = sum(r['rep'] for r in filas)
    print()
    print('     %d clips (%d con las repeticiones) en %d partido(s)'
          % (len(filas), total, len(grupos)))
    for (part, _v), rs in sorted(grupos.items()):
        seg = sum((r['fin'] - r['ini']) * r['rep'] for r in rs)
        print('        %-34s %3d clips · %d:%02d' % (part[:34], len(rs), int(seg) // 60, int(seg) % 60))
    if not tiene_video and len(grupos) > 1:
        print()
        print('     [OJO] Este CSV es de una version anterior de Cortes y no dice')
        print('     de que video es cada clip. Como hay mas de un partido, te voy')
        print('     a pedir el archivo de cada uno y tenes que acertar el orden.')
        print('     Volviendo a exportar desde Cortes ya viene resuelto.')

    ff = buscar_ffmpeg() or bajar_ffmpeg()
    if not ff:
        input('\n     Enter para cerrar. ')
        return

    print()
    print('     COMO CORTAR')
    print('       1  Rapido       sin recomprimir. Segundos, calidad del original,')
    print('                       sin rotulos. Es el "FAST" de DataVolley.')
    print('       2  Con rotulo   escribe encima quien, que y como termino.')
    print('                       Recomprime, asi que tarda y pierde un poco.')
    modo = 'rotulo' if pedir('\n     Cual? (1/2): ') == '2' else 'rapido'
    fnt = fuente() if modo == 'rotulo' else None
    if modo == 'rotulo' and not fnt:
        print()
        print('     No encontre ninguna tipografia para escribir encima.')
        print('     Sigo en modo rapido, sin rotulos.')
        modo = 'rapido'

    carpeta = os.path.dirname(os.path.abspath(ruta))
    base = os.path.splitext(os.path.basename(ruta))[0]
    dir_clips = os.path.join(carpeta, base + '_clips')
    os.makedirs(dir_clips, exist_ok=True)

    hechos, mapa = [], []
    for (part, vid), rs in sorted(grupos.items()):
        print()
        print('  ' + '-' * 68)
        print('  %s   (%d clips)' % (part, len(rs)))
        if vid:
            print('  video de YouTube: %s' % vid)
        print('  ' + '-' * 68)
        video = pedir('     Arrastra el video de ESTE partido (Enter para saltearlo): ')
        if not video or not os.path.exists(video):
            print('     Salteado.')
            continue
        d = datos_del_video(ff, video)
        if d:
            print('     %sx%s · %.1f Mbps%s' % (d['w'], d['h'], d['mbps'],
                                                ' · entrelazado' if d.get('entrelazado') else ''))
        partes = []
        n = 0
        for r in rs:
            for k in range(r['rep']):
                n += 1
                nom = '%03d_%s_%s_%s_%s_set%s.mp4' % (
                    n, limpio(r['num']), limpio(r['jug']), limpio(r['acc']),
                    VALOR.get(str(r['val']).strip(), limpio(r['val']) or 'sv'),
                    limpio(r['set']))
                if r['rep'] > 1:
                    nom = nom[:-4] + ('_x%d.mp4' % (k + 1))
                p = os.path.join(dir_clips, nom)
                ok, err = cortar(ff, video, r, p, modo, fnt)
                if not ok:
                    print('     clip %d: no se pudo (%s)' % (n, err[:60]))
                    continue
                partes.append(p)
                # Cortando sin recomprimir, el clip arranca en el cuadro clave
                # anterior al segundo pedido: empieza un poco ANTES, nunca
                # despues, asi que no se pierde nada de lo que se pidio. El
                # mapa anota el arranque de verdad, no el que se pidio.
                dur = r['fin'] - r['ini']
                desde_real = r['ini']
                if modo == 'rapido':
                    t0, dr = arranque_real(ff, p)
                    if t0 is not None:
                        dur, desde_real = dr, t0
                mapa.append(dict(archivo=os.path.basename(p), partido=part,
                                 jugador=r['jug'], numero=r['num'], accion=r['acc'],
                                 detalle=r['det'], valoracion=r['val'], set=r['set'],
                                 desde=round(r['ini'], 2), hasta=round(r['fin'], 2),
                                 desde_real=round(desde_real, 2), dura=round(dur, 2)))
                if n % 10 == 0 or n == total:
                    print('     %d clips' % n, flush=True)
        if not partes:
            continue
        destino = os.path.join(carpeta, '%s_%s_montaje.mp4' % (base, limpio(part)))
        if pegar(ff, partes, destino):
            mb = os.path.getsize(destino) / 1e6
            print('     -> %s  (%.0f MB)' % (os.path.basename(destino), mb))
            hechos.append(destino)
        else:
            print('     No pude pegar el montaje de este partido, pero los clips')
            print('     sueltos quedaron en la carpeta.')

    if mapa:
        import json
        with io.open(os.path.join(carpeta, base + '_clips.json'), 'w', encoding='utf-8') as f:
            f.write(json.dumps(dict(origen=os.path.basename(ruta), modo=modo,
                                    clips=mapa), ensure_ascii=False, indent=1))

    print()
    print('  ' + '=' * 68)
    if not mapa:
        print('     No salio ningun clip.')
    else:
        print('     LISTO. %d clips.' % len(mapa))
        print('        sueltos, con nombre:  %s' % os.path.basename(dir_clips))
        for h in hechos:
            print('        montaje:              %s' % os.path.basename(h))
        print('        el mapa de todo:      %s_clips.json' % base)
        if len(hechos) > 1:
            print()
            print('     Hay un montaje por partido. Si los queres en uno solo,')
            print('     pasalos por UNIR_VIDEO.')
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
