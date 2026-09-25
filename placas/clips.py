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
import argparse, json, os, pathlib, re, shutil, subprocess, sys

import fechas, marcador, seis_placas

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
    'defensa':   ('D', ['#', '+']),
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

    [{'archivo','equipo','dorsal','skill','ev','set','t','marcador','resultado'}]

    El marcador y el resultado salen del mismo .dvw (ver marcador.py): el
    rótulo del video los necesita para que la acción se entienda sola."""
    gl = _motor(repo)
    out = []
    for fn in [str(x) for x in archivos]:
        try:
            lineas = gl.read_lines(fn)
            local, visita = [gl.norm(x) for x in gl.get_teams(lineas)]
            scout = gl.get_scout(lineas)
        except Exception:
            continue
        # Los nombres para el rótulo salen del archivo tal cual, no de norm():
        # norm() devuelve None para los equipos que no son de la liga.
        crudos = gl.get_teams(lineas)
        ctx = marcador.contexto(lineas, crudos[0], crudos[1])
        pts = marcador.puntos(scout)
        for i, l in enumerate(scout):
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
            resto = cod[6:].split('~')
            sk = cod[3]
            traj = resto[1] if (sk in 'AE' and len(resto) > 1) else (
                resto[3] if len(resto) > 3 else '')
            oz = int(traj[0]) if traj and traj[0].isdigit() else 0
            dz = int(traj[1]) if len(traj) > 1 and traj[1].isdigit() else 0
            marca = marcador.cierra_el_rally(pts, i)
            out.append({'archivo': fn,
                        'equipo': local if cod[0] == '*' else visita,
                        'lado': cod[0], 'dorsal': cod[1:3], 'skill': sk,
                        'ev': cod[5] if len(cod) > 5 else '',
                        'oz': oz, 'dz': dz,
                        'set': c[8] if len(c) > 8 else '', 't': t,
                        'marcador': marcador.como_va(ctx, marca, cod[0]),
                        'resultado': marcador.resultado_visto(ctx, cod[0]),
                        'club': ctx['corto_l'] if cod[0] == '*' else ctx['corto_v']})
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


def links_youtube(repo, archivos):
    """{ruta del .dvw: link de YouTube}, leído del mapa de videos de la app.

    Los partidos no están como archivo en el disco: están subidos a YouTube
    sin listar, y el link lo cargaste vos en "Cargar Videos". Ese mapa ya
    existe (mapa_videos.js, o su .enc si corriste el cifrado), así que se lee
    de ahí en vez de pedirte los archivos de nuevo.

    El identificador del partido lo calcula el propio build_video.py, para
    que sea el mismo con el que se guardó el link.
    """
    repo = os.path.abspath(repo)
    if repo not in sys.path:
        sys.path.insert(0, repo)
    # las rutas se resuelven ANTES del chdir: después, un '../DVW ...'
    # apunta a otro lado y no se encuentra ningún partido
    rutas = [(str(x), os.path.abspath(str(x))) for x in archivos]
    cwd = os.getcwd()
    out = {}
    try:
        os.chdir(repo)
        import build_video
        mapa = build_video.read_mapa_links()
        if not mapa:
            return {}
        for fn, absoluta in rutas:
            try:
                r = build_video.parse_dvw(absoluta)
            except Exception:
                continue
            if not r:
                continue
            code = r[0]
            if code in mapa and mapa[code]:
                out[fn] = mapa[code]
    except Exception:
        return {}
    finally:
        os.chdir(cwd)
    return out


def _id_youtube(url):
    m = re.search(r'(?:v=|youtu\.be/|/embed/|/shorts/)([A-Za-z0-9_-]{11})', url or '')
    return m.group(1) if m else None


def link_en(url, seg):
    """El link de YouTube abierto en ese segundo."""
    vid = _id_youtube(url)
    return ('https://youtu.be/%s?t=%d' % (vid, int(seg))) if vid else ''


def ytdlp():
    """Cómo invocar yt-dlp en esta máquina.

    pip lo instala en la carpeta Scripts de Python, que en Windows muchas
    veces NO está en el PATH — el propio instalador lo avisa. Buscarlo por
    nombre falla y parece que no estuviera instalado.

    Por eso se prueba primero el ejecutable y, si no aparece, se lo llama
    como módulo del mismo Python que está corriendo este script, que es
    donde pip lo dejó. Así funciona esté o no en el PATH.
    """
    exe = shutil.which('yt-dlp')
    if exe:
        return [exe]
    try:
        import yt_dlp            # noqa: F401
        return [sys.executable, '-m', 'yt_dlp']
    except ImportError:
        return None


def bajar_partido(url, destino):
    """Baja el partido entero, una sola vez.

    Por qué entero y no tramo por tramo: hay hasta seis acciones por placa y
    cinco placas con video, o sea unas treinta descargas. Cada una arranca
    una conexión nueva y obliga a recodificar para cortar en el lugar justo,
    y eso son veinte minutos largos.

    Bajando el partido una vez, los treinta cortes salen de un archivo local
    en segundos y caen exactos. Son tres descargas en vez de treinta.

    El archivo se borra solo al terminar (ver `limpiar`): ocupa entre 300 y
    600 MB y no hace falta guardarlo.
    """
    base = ytdlp()
    if not base:
        return None
    cmd = base + ['--no-playlist', '--no-warnings', '--no-part',
                  '-f', 'bv*[height<=1080]+ba/b[height<=1080]/b',
                  '--merge-output-format', 'mp4',
                  '-o', str(destino), url]
    try:
        # a propósito SIN silenciar: una descarga de 40 minutos sin ninguna
        # señal en pantalla parece un cuelgue
        subprocess.run(cmd, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError, KeyboardInterrupt):
        return None
    return destino if destino.exists() and destino.stat().st_size > 0 else None


def _bajar_tramo(url, ini, dur, destino):
    """Baja solo ese pedacito del video de YouTube, con yt-dlp."""
    base = ytdlp()
    if not base:
        return None
    cmd = base + ['--quiet', '--no-warnings', '--no-playlist',
           '-f', 'bv*[height<=1080]+ba/b[height<=1080]/b',
           '--download-sections', '*%.2f-%.2f' % (ini, ini + dur),
           '--force-keyframes-at-cuts',
           '--merge-output-format', 'mp4',
           '-o', str(destino), url]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    return destino if destino.exists() and destino.stat().st_size > 0 else None


def cortar(pack, videos, links, destino, vertical=False):
    """Corta cada acción y las pega en un solo mp4.

    El video del partido puede venir de dos lados: un archivo en el disco, o
    el link de YouTube que ya cargaste en la app. Con el link se baja SOLO el
    pedacito de cada acción, no el partido entero."""
    tmp = destino / '_tmp'
    tmp.mkdir(parents=True, exist_ok=True)
    partes = []
    for i, a in enumerate(pack['acciones']):
        ini = max(0, a['t'] - ANTES)
        dur = (a.get('hasta', a['t']) - a['t']) + ANTES + DESPUES
        seg = tmp / ('%s_%02d.mp4' % (pack['slug'], i))
        vf = ('scale=1080:-2,pad=1080:1920:0:(oh-ih)/2:%s' % FONDO.replace('#', '0x')) \
            if vertical else 'scale=1080:-2'
        base = ['-vf', vf, '-r', '30',
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2']

        vid = videos.get(a['archivo'])
        if vid:
            cmd = ['ffmpeg', '-y', '-loglevel', 'error',
                   '-ss', '%.2f' % ini, '-i', str(vid), '-t', '%.2f' % dur] \
                + base + [str(seg)]
        elif links.get(a['archivo']):
            crudo = _bajar_tramo(links[a['archivo']], ini, dur,
                                 tmp / ('crudo_%02d.mp4' % i))
            if not crudo:
                continue
            # yt-dlp corta en el keyframe anterior, así que el tramo puede
            # empezar antes: se recorta de nuevo para que quede parejo
            cmd = ['ffmpeg', '-y', '-loglevel', 'error',
                   '-i', str(crudo), '-t', '%.2f' % dur] + base + [str(seg)]
        else:
            continue
        try:
            subprocess.run(cmd, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue
        if seg.exists() and seg.stat().st_size > 0:
            partes.append(seg)
    if not partes:
        shutil.rmtree(tmp, ignore_errors=True)
        return None, 0
    # Cada acción se guarda también por separado. Pegadas no se pueden
    # editar: para el corto de TikTok hace falta poner un rótulo sobre cada
    # una, contar "ace 2 de 4" y ajustar el arranque, y eso solo se puede
    # con los pedazos sueltos.
    sueltas = destino / 'acciones'
    sueltas.mkdir(parents=True, exist_ok=True)
    meta = []
    for i, seg in enumerate(partes):
        a = pack['acciones'][i] if i < len(pack['acciones']) else {}
        dst = sueltas / ('%s_%02d.mp4' % (pack['nombre'], i + 1))
        shutil.copy(seg, dst)
        meta.append({'archivo': dst.name, 'n': i + 1, 'de': len(partes),
                     'set': a.get('set', ''), 'ev': a.get('ev', ''),
                     'zona': a.get('dz') or a.get('oz') or 0,
                     'seg': a.get('t', 0),
                     'dorsal': a.get('dorsal', ''), 'club': a.get('club', ''),
                     'marcador': a.get('marcador', ''),
                     'resultado': a.get('resultado', '')})
    (sueltas / ('%s.json' % pack['nombre'])).write_text(
        json.dumps({'slug': pack['slug'], 'quien': pack['quien'],
                    'titulo': pack['titulo'], 'acciones': meta},
                   ensure_ascii=False, indent=1), encoding='utf-8')
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
    ap.add_argument('--guardar-video', action='store_true', dest='guardar_video',
                    help='no borrar los partidos bajados (por defecto se borran)')
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

    # de dónde sale el video de cada partido: archivo en el disco, o el link
    # de YouTube que ya está cargado en la app
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
    links = links_youtube(a.repo, archivos)

    # la lista para cortar a mano: sale siempre, haya o no con qué cortar.
    # Con el link cargado, cada acción queda como un link que abre YouTube
    # justo ahí: eso solo ya te ahorra buscar.
    txt = ['CORTES DE VIDEO · %s' % rotulo, '=' * 66, '']
    for pk in packs:
        txt.append('%s · %s' % (pk['titulo'], pk['quien']))
        for x in pk['acciones']:
            l = link_en(links.get(x['archivo']), x['t'])
            txt.append('   set %-2s  %s   %s'
                       % (x['set'], hhmmss(x['t']),
                          l or pathlib.Path(x['archivo']).name))
        txt.append('')
    txt.append('El minuto es la posición dentro del video de ese partido.')
    txt.append('El corte va de %ds antes a %ds después, igual que en la app.'
               % (ANTES, DESPUES))
    (destino / 'cortes.txt').write_text('\n'.join(txt), encoding='utf-8')
    print('cortes.txt  ->  %d placas con video' % len(packs))

    if not shutil.which('ffmpeg'):
        print()
        print('No tengo ffmpeg, así que no puedo cortar los videos solo.')
        print('Instalalo de ffmpeg.org y volvé a correr: el cortes.txt ya está.')
        return 0
    hay_yt = ytdlp() is not None
    if links and not hay_yt:
        print()
        print('Los partidos están en YouTube pero no tengo yt-dlp para bajarlos.')
        print('Corré INSTALAR.bat de nuevo, o: python -m pip install yt-dlp')
        print('Mientras tanto, cortes.txt trae el link de cada acción.')
    if not videos and not (links and hay_yt):
        print()
        print('Sin video no puedo cortar. Tenés dos caminos:')
        print('  · cargar el link del partido en Cargar Videos, como siempre;')
        print('  · o poner el archivo al lado del .dvw con el mismo nombre.')
        return 0

    print('con video: %d de %d partidos  (%d por archivo, %d por link)'
          % (len({*videos} | {*links}), len(archivos), len(videos), len(links)))

    # Los partidos que hacen falta se bajan enteros, una vez cada uno, y se
    # cortan localmente. Al terminar se borran.
    cache = pathlib.Path('_videos_temporales')
    shutil.rmtree(cache, ignore_errors=True)     # restos de una corrida cortada
    necesarios = {x['archivo'] for pk in packs for x in pk['acciones']}
    bajados = []
    if hay_yt:
        pend = [f for f in necesarios if f not in videos and links.get(f)]
        for i, f in enumerate(pend, 1):
            cache.mkdir(parents=True, exist_ok=True)
            nom = pathlib.Path(f).stem[:40].replace(' ', '_')
            destino_v = cache / ('%s.mp4' % nom)
            print()
            print('Bajando el partido %d de %d: %s' % (i, len(pend),
                                                       pathlib.Path(f).name))
            print('(se baja una sola vez y se borra al terminar)')
            v = bajar_partido(links[f], destino_v)
            if v:
                videos[f] = v
                bajados.append(v)
            else:
                print('   no se pudo bajar; voy a cortar por tramos, más lento')
        if pend:
            print()
    for pk in packs:
        if not any(x['archivo'] in videos or x['archivo'] in links
                   for x in pk['acciones']):
            continue
        out, n = cortar(pk, videos, links, destino, a.vertical)
        # cuantas quedaron afuera por no tener el video de ESE partido
        falta = len(pk['acciones']) - n
        nota = ' (%d sin video del partido)' % falta if falta else ''
        print('   %-22s %s' % (pk['nombre'] + '.mp4',
                               ('%d acci%s%s' % (n, 'ón' if n == 1 else 'ones', nota))
                               if out else 'no se pudo cortar'))
    # Un fotograma de cada partido, para la placa de ese partido. Va ACÁ, con
    # los videos todavía en la máquina: dos líneas abajo se borran y bajarlos
    # de nuevo son cuarenta minutos.
    try:
        import partido
        nf = partido.sacar_fondos(videos, packs, destino)
        if nf:
            print()
            print('   %d fotograma%s para las placas de partido'
                  % (nf, '' if nf == 1 else 's'))
    except Exception as e:
        print('   (no pude sacar los fotogramas: %s)' % e)

    # y se borran los partidos bajados: ya están los cortes, el original no
    # hace falta y son cientos de megas cada uno
    if bajados and not a.guardar_video:
        libres = sum(v.stat().st_size for v in bajados if v.exists())
        shutil.rmtree(cache, ignore_errors=True)
        print()
        print('Borré los %d partidos que bajé (%d MB liberados).'
              % (len(bajados), libres // (1024 * 1024)))
    elif bajados:
        print()
        print('Los partidos bajados quedan en %s (--guardar-video).' % cache)

    print()
    print('Todo en %s' % destino)
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        # si lo cortás a mitad de una descarga, igual se limpia
        shutil.rmtree(pathlib.Path('_videos_temporales'), ignore_errors=True)
        print('\nCortado. Borré lo que había bajado.')
        sys.exit(130)
