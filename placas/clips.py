#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Los videos de la fecha, cortados y listos para publicar.

QUÉ HACE
--------
Para cada placa, arma el video de las mejores acciones del jugador que la
placa eligió. Si la placa dice "el mejor saque de la fecha: Roy Schmid",
este script te deja un `A-saque.mp4` con sus aces, uno atrás del otro.

DE DÓNDE SALEN LOS SEGUNDOS
---------------------------
Del mismo lugar que los usa tu app: el campo 13 de cada línea del [3SCOUT]
trae el SEGUNDO de video de esa acción, que DataVolley escribe cuando se
scoutea con el video cargado. Es exactamente lo que lee build_video.py:307
(`t = int(c[12])`), así que el corte cae en el mismo lugar que cuando un
jugador abre esa acción en Cortes de Video.

El margen también es el mismo que usa esa pantalla: 4 segundos antes del
contacto y 5 después (cortes.html:262).

DÓNDE BUSCA LOS VIDEOS
----------------------
Un archivo de video por partido, con el MISMO nombre que el .dvw:

    DVW NAFELS 2027\\&2026-09-19 #03 AXPO NAFELS vs JONA.dvw
    DVW NAFELS 2027\\&2026-09-19 #03 AXPO NAFELS vs JONA.mp4

También sirve una carpeta VIDEOS en el repo, o un videos.json acá adentro:

    {"&2026-09-19 #03 AXPO NAFELS vs JONA.dvw": "D:/partidos/jona.mp4"}

SI NO HAY VIDEO O NO HAY FFMPEG
-------------------------------
Igual te deja `cortes.txt` con el set y el minuto exacto de cada acción,
para que abras el video y cortes a mano sin buscar nada.

    python clips.py --repo .. --fecha 3
    python clips.py --repo .. --fecha 3 --vertical
"""
import argparse, json, os, pathlib, shutil, subprocess, sys

import fechas, seis_placas

# Mismo margen que la pantalla de Cortes de Video del sistema.
ANTES, DESPUES = 4.0, 5.0
MAX_CLIPS = 6
VIDEO_EXT = ('.mp4', '.mkv', '.mov', '.m4v', '.avi', '.mts')
FONDO = '#07080F'          # el mismo negro de las placas

# Qué acción se busca para cada placa, en orden de preferencia.
BUSCA = {
    'saque':     ('S', ['#', '/']),
    'recepcion': ('R', ['#']),
    'ataque':    ('A', ['#']),
    'bloqueo':   ('B', ['#']),
}


def hhmmss(s):
    s = int(s)
    return '%d:%02d:%02d' % (s // 3600, (s % 3600) // 60, s % 60)


def _motor(repo):
    repo = os.path.abspath(repo)
    if repo not in sys.path:
        sys.path.insert(0, repo)
    cwd = os.getcwd(); os.chdir(repo)
    try:
        import gen_liga_stats
    finally:
        os.chdir(cwd)
    return gen_liga_stats


def acciones(repo, archivos):
    """Todas las acciones con segundo de video, por partido.

    [{'archivo','equipo','dorsal','skill','ev','set','t'}]"""
    gl = _motor(repo)
    out = []
    for fn in [str(x) for x in archivos]:
        try:
            lineas = gl.read_lines(fn)
            local, visita = [gl.norm(x) for x in gl.get_teams(lineas)]
            scout = gl.get_scout(lineas)
        except Exception:
            continue
        for l in scout:
            c = l.split(';')
            cod = c[0].strip()
            if len(cod) < 6 or cod[0] not in '*a' or not cod[1:3].isdigit():
                continue
            try:
                t = int(c[12])
            except (ValueError, IndexError):
                continue
            if t <= 0:
                continue
            out.append({'archivo': fn,
                        'equipo': local if cod[0] == '*' else visita,
                        'lado': cod[0], 'dorsal': cod[1:3], 'skill': cod[3],
                        'ev': cod[5] if len(cod) > 5 else '',
                        'set': c[8] if len(c) > 8 else '', 't': t})
    return out


def _del_armador(acc, equipo, dorsal):
    """Los armados que terminaron en punto.

    Un armado solo no se ve; lo que se ve es la pelota que puso y el remate
    que vino después. Se corta desde el armado, así entra todo."""
    out = []
    for i, a in enumerate(acc):
        if a['skill'] != 'E' or a['equipo'] != equipo or a['dorsal'] != dorsal:
            continue
        for b in acc[i + 1:i + 3]:
            if b['archivo'] != a['archivo']:
                break
            if b['skill'] == 'A' and b['lado'] == a['lado']:
                if b['ev'] == '#':
                    out.append(dict(a, hasta=b['t']))
                break
    return out


def elegir(piezas, acc):
    """Qué acciones van en el video de cada placa."""
    packs = []
    for p in piezas:
        slug = p.get('slug')
        if slug == 'armado':
            j = p.get('jugador')
            if not j:
                continue
            sel = _del_armador(acc, j[0], j[1])
            quien = p.get('quien') or j[0]
        elif slug in BUSCA:
            j = p.get('jugador')
            if not j:
                continue
            sk, evs = BUSCA[slug]
            sel = []
            for ev in evs:              # primero los mejores; si faltan, los que siguen
                if len(sel) >= MAX_CLIPS:
                    break
                sel += [a for a in acc
                        if a['skill'] == sk and a['ev'] == ev
                        and a['equipo'] == j[0] and a['dorsal'] == j[1]]
            quien = p.get('quien') or j[0]
        else:
            continue                    # rotaciones y siete ideal no tienen video
        sel.sort(key=lambda a: (a['archivo'], a['set'], a['t']))
        if sel:
            packs.append({'slug': slug, 'nombre': p.get('nombre_archivo') or slug,
                          'quien': quien, 'titulo': p.get('titulo', ''),
                          'acciones': sel[:MAX_CLIPS]})
    return packs


def buscar_video(dvw, repo, mapa):
    """El archivo de video de ese partido, si está."""
    dvw = pathlib.Path(dvw)
    if dvw.name in mapa:
        p = pathlib.Path(mapa[dvw.name])
        return p if p.exists() else None
    candidatos = [dvw.parent, pathlib.Path(repo) / 'VIDEOS', dvw.parent / 'VIDEOS']
    for carpeta in candidatos:
        if not carpeta.is_dir():
            continue
        for ext in VIDEO_EXT:
            p = carpeta / (dvw.stem + ext)
            if p.exists():
                return p
    return None


def cortar(pack, videos, destino, vertical=False):
    """Corta cada acción y las pega en un solo mp4."""
    tmp = destino / '_tmp'
    tmp.mkdir(parents=True, exist_ok=True)
    partes = []
    for i, a in enumerate(pack['acciones']):
        vid = videos.get(a['archivo'])
        if not vid:
            continue
        ini = max(0, a['t'] - ANTES)
        dur = (a.get('hasta', a['t']) - a['t']) + ANTES + DESPUES
        seg = tmp / ('%s_%02d.mp4' % (pack['slug'], i))
        vf = ('scale=1080:-2,pad=1080:1920:0:(oh-ih)/2:%s' % FONDO.replace('#', '0x')) \
            if vertical else 'scale=1080:-2'
        cmd = ['ffmpeg', '-y', '-loglevel', 'error',
               '-ss', '%.2f' % ini, '-i', str(vid), '-t', '%.2f' % dur,
               '-vf', vf, '-r', '30',
               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21',
               '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2',
               str(seg)]
        try:
            subprocess.run(cmd, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue
        if seg.exists() and seg.stat().st_size > 0:
            partes.append(seg)
    if not partes:
        shutil.rmtree(tmp, ignore_errors=True)
        return None, 0
    lista = tmp / ('%s.txt' % pack['slug'])
    lista.write_text(''.join("file '%s'\n" % p.resolve().as_posix() for p in partes),
                     encoding='utf-8')
    salida = destino / ('%s.mp4' % pack['nombre'])
    try:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat',
                        '-safe', '0', '-i', str(lista), '-c', 'copy', str(salida)],
                       check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        salida = None
    shutil.rmtree(tmp, ignore_errors=True)
    return salida, len(partes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='..')
    ap.add_argument('--carpeta', default='')
    ap.add_argument('--temporada', default='')
    ap.add_argument('--fecha', default='')
    ap.add_argument('--hasta', default='')
    ap.add_argument('--salida', default='salida')
    ap.add_argument('--vertical', action='store_true',
                    help='1080x1920 para historias y reels')
    a = ap.parse_args()

    if not a.carpeta or not a.temporada:
        c, t = seis_placas.detectar(a.repo)
        if not c:
            raise SystemExit('No encuentro la carpeta de .dvw. Pasá --repo.')
        a.carpeta = a.carpeta or c
        a.temporada = a.temporada or t

    ruta = pathlib.Path(a.repo) / a.carpeta
    archivos, _, _ = fechas.archivos_de(ruta, a.fecha or None, a.hasta or None)
    if archivos is None:
        raise SystemExit('No existe la fecha %s.' % a.fecha)

    if a.fecha:
        rotulo = 'Fecha %s · %s' % (a.fecha, a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / ('fecha-%02d' % int(a.fecha)) / 'video'
    elif a.hasta:
        rotulo = 'Fechas 1 a %s · %s' % (a.hasta, a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / ('hasta-%02d' % int(a.hasta)) / 'video'
    else:
        rotulo = 'Temporada %s' % a.temporada
        destino = pathlib.Path(a.salida) / a.temporada / 'acumulado' / 'video'
    destino.mkdir(parents=True, exist_ok=True)

    piezas = seis_placas.construir(a.repo, a.carpeta, a.temporada, rotulo, archivos)
    acc = acciones(a.repo, archivos)
    if not acc:
        raise SystemExit(
            'Ninguna acción trae el segundo de video.\n'
            'Eso pasa cuando el partido se scouteó SIN el video cargado en\n'
            'DataVolley. Sin ese dato no hay cortes, ni acá ni en la app.')
    packs = elegir(piezas, acc)

    # la lista para cortar a mano: sale siempre, haya video o no
    txt = ['CORTES DE VIDEO · %s' % rotulo, '=' * 60, '']
    for pk in packs:
        txt.append('%s · %s' % (pk['titulo'], pk['quien']))
        for x in pk['acciones']:
            txt.append('   set %-2s  %s   %s'
                       % (x['set'], hhmmss(x['t']), pathlib.Path(x['archivo']).name))
        txt.append('')
    txt.append('El minuto es la posición dentro del video de ese partido.')
    txt.append('El corte va de %ds antes a %ds después, igual que en la app.'
               % (ANTES, DESPUES))
    (destino / 'cortes.txt').write_text('\n'.join(txt), encoding='utf-8')
    print('cortes.txt  ->  %d placas con video' % len(packs))

    # y ahora, si se puede, el mp4 hecho
    mapa = {}
    jm = pathlib.Path('videos.json')
    if jm.exists():
        try:
            mapa = json.loads(jm.read_text(encoding='utf-8'))
        except ValueError:
            pass
    videos = {}
    for fn in [str(x) for x in archivos]:
        v = buscar_video(fn, a.repo, mapa)
        if v:
            videos[fn] = v
    if not shutil.which('ffmpeg'):
        print()
        print('No tengo ffmpeg, así que no puedo cortar los videos solo.')
        print('Instalalo de ffmpeg.org y volvé a correr: el cortes.txt ya está.')
        return 0
    if not videos:
        print()
        print('No encontré ningún archivo de video de estos partidos.')
        print('Poné el video al lado del .dvw con el mismo nombre, o armá un')
        print('videos.json acá con la ruta de cada uno. El cortes.txt ya está.')
        return 0

    print('videos encontrados: %d de %d partidos' % (len(videos), len(archivos)))
    for pk in packs:
        if not any(x['archivo'] in videos for x in pk['acciones']):
            continue
        out, n = cortar(pk, videos, destino, a.vertical)
        # cuantas quedaron afuera por no tener el video de ESE partido
        falta = len(pk['acciones']) - n
        nota = ' (%d sin video del partido)' % falta if falta else ''
        print('   %-22s %s' % (pk['nombre'] + '.mp4',
                               ('%d acci%s%s' % (n, 'ón' if n == 1 else 'ones', nota))
                               if out else 'no se pudo cortar'))
    print()
    print('Todo en %s' % destino)
    return 0


if __name__ == '__main__':
    sys.exit(main())
