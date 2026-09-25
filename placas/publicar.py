#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Un solo paso: de los .dvw a la carpeta lista para publicar.

Hace, en orden:
    1. las siete placas
    2. el chequeo (que nada se corte, que coincida con la app, que la
       muestra alcance)
    3. los videos de cada placa, cortados con ffmpeg si hay video
    4. los textos de cada publicación
    5. deja todo numerado en orden de publicación y abre la carpeta

Queda así:

    salida\\26-27\\fecha-03\\
        1-saque.png          1-saque.mp4          textos.txt
        2-recepcion.png      2-recepcion.mp4      cortes.txt
        3-armado.png         3-armado.mp4         REVISION.txt
        ...

Se publica de arriba hacia abajo: la placa, el video de esa placa, la
siguiente placa. Sin decidir nada.

    python publicar.py --repo .. --fecha 3
"""
import argparse, io, pathlib, shutil, sys, contextlib

import clips, club, fechas, historial, idioma, liga, limpiar, partido, publicacion, redes, rotacion, seis_placas, placas2, verificar

# El orden de publicación. La conclusión fuerte (side-out) va al final, que
# es donde queda la gente que llegó hasta ahí.
ORDEN = ['apertura', 'resultados', 'saque', 'recepcion', 'armado', 'ataque',
         'bloqueo', 'defensa', 'equipo-ideal', 'rotaciones', 'cierre']

HASHTAGS = ('#volleyball #voley #volleyballstats #analisis #scouting '
            '#datavolley #volleystats')


def texto_de(p, n):
    """El texto de la publicación, armado con lo que la placa ya sabe."""
    L = ['-' * 58,
         '%d · %s' % (n, p.get('titulo', '')),
         '-' * 58,
         '',
         p.get('titulo', '')]
    quien = p.get('quien')
    if quien:
        L[-1] += ' · ' + quien
    L.append('')
    if p.get('bajada'):
        L.append(p['bajada'])
        L.append('')
    if p.get('pie'):
        L.append(p['pie'])
        L.append('')
    L.append(p.get('fuente', ''))
    L.append('')
    L.append(HASHTAGS)
    L.append('')
    return '\n'.join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='..')
    ap.add_argument('--carpeta', default='')
    ap.add_argument('--temporada', default='')
    ap.add_argument('--fecha', default='')
    ap.add_argument('--hasta', default='')
    ap.add_argument('--salida', default='salida')
    ap.add_argument('--vertical', action='store_true')
    ap.add_argument('--sin-historias', action='store_true', dest='sin_historias',
                    help='no generar la version 1080x1920')
    ap.add_argument('--sin-redes', action='store_true', dest='sin_redes',
                    help='no armar los videos de YouTube y TikTok')
    ap.add_argument('--guardar-video', action='store_true', dest='guardar_video',
                    help='no borrar los partidos bajados de YouTube')
    ap.add_argument('--sin-video', action='store_true',
                    help='saltear el corte de video (es lo que más tarda)')
    a = ap.parse_args()

    if not a.carpeta or not a.temporada:
        c, t = seis_placas.detectar(a.repo)
        if not c:
            raise SystemExit('No encuentro la carpeta de .dvw. Pasá --repo.')
        a.carpeta = a.carpeta or c
        a.temporada = a.temporada or t
        print('Carpeta: %s   ·   Temporada: %s' % (a.carpeta, a.temporada))

    ruta = pathlib.Path(a.repo) / a.carpeta
    archivos, grupos, sueltos = fechas.archivos_de(ruta, a.fecha or None,
                                                   a.hasta or None)
    if archivos is None:
        print(); print(fechas.resumen(grupos, sueltos))
        raise SystemExit('\nNo existe la fecha %s.' % a.fecha)

    if a.fecha:
        rotulo = idioma.rotulo('fecha', a.fecha, a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / ('fecha-%02d' % int(a.fecha))
    elif a.hasta:
        rotulo = idioma.rotulo('hasta', a.hasta, a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / ('hasta-%02d' % int(a.hasta))
    else:
        rotulo = idioma.rotulo('temporada', a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / 'acumulado'

    print()
    print('%d partidos' % len(archivos))
    for x in archivos[:8]:
        print('   ' + x.name)
    if len(archivos) > 8:
        print('   ... y %d más' % (len(archivos) - 8))

    # ── 1 · las placas ────────────────────────────────────────────────────
    print()
    print('[1/4] Placas')
    piezas = seis_placas.construir(a.repo, a.carpeta, a.temporada, rotulo,
                                   archivos, fecha_n=a.fecha or None)
    orden = {s: i for i, s in enumerate(ORDEN)}
    piezas.sort(key=lambda p: orden.get(p.get('slug'), 99))
    destino.mkdir(parents=True, exist_ok=True)
    # Lo viejo se borra ANTES de escribir lo nuevo. Los nombres llevan el
    # número de orden, así que si cambia el orden los archivos viejos se
    # quedarían ahí con otro nombre y nunca sabrías cuál es la buena.
    n = limpiar.limpiar(destino, 'placas', 'textos')
    if n:
        print(limpiar.aviso(n, 'la corrida anterior'))
    # se numeran en orden de publicacion, no por fundamento
    for i, p in enumerate(piezas, 1):
        p['slug'] = '%d-%s' % (i, p['slug'])
        p['nombre_archivo'] = p['slug']
    hechos = placas2.generar(piezas, destino)
    for h in hechos:
        print('   ' + h)
    # placas2.generar antepone A-, B-... y acá ya viene el número
    for h in hechos:
        viejo = destino / h
        nuevo = destino / h.split('-', 1)[1]
        if viejo.exists():
            viejo.replace(nuevo)

    # las mismas placas en 1080x1920, para historias, reels y TikTok.
    # Es el mismo HTML con otro alto: el contenido se centra solo y las
    # franjas de arriba y abajo quedan libres, que es donde las apps ponen
    # sus botones.
    if not a.sin_historias:
        hs = destino / 'historias'
        hechos_h = placas2.generar(piezas, hs, alto=1920)
        for h in hechos_h:
            viejo = hs / h
            nuevo = hs / h.split('-', 1)[1]
            if viejo.exists():
                viejo.replace(nuevo)
        print('   %d en vertical 9:16 (carpeta historias)' % len(hechos_h))

    # ── 2 · el chequeo ────────────────────────────────────────────────────
    print()
    print('[2/4] Revisión')
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        malas = verificar.desborde(piezas)
        dif = verificar.coherencia(a.repo, a.carpeta, a.temporada, archivos)
    informe = buf.getvalue()
    (destino / 'REVISION.txt').write_text(informe, encoding='utf-8')
    for linea in informe.splitlines():
        if 'SE PISA' in linea or 'difieren' in linea:
            print('  ' + linea.strip())
    n_eq = len({f['equipo'] for p in piezas for f in p.get('filas', []) if 'equipo' in f})
    avisos = []
    if malas:
        avisos.append('Hay placas que se pisan: %s' % ', '.join(malas))
    if dif:
        avisos.append('%d jugadores no coinciden con la app' % len(dif))
    if len(archivos) < 3:
        avisos.append('Solo %d partidos: yo no diría "de la fecha"' % len(archivos))
    if n_eq and n_eq < 6:
        avisos.append('Solo %d equipos en la muestra' % n_eq)
    print('   ' + ('todo en orden' if not avisos else 'con avisos'))

    # ── 3 · los videos ────────────────────────────────────────────────────
    print()
    print('[3/4] Videos')
    if a.sin_video:
        print('   salteado (--sin-video)')
    else:
        # se vuelven a cortar, así que los recortes viejos ya no sirven
        n = limpiar.limpiar(destino, 'videos')
        if n:
            print(limpiar.aviso(n, 'recortes anteriores'))
        for vieja in (destino / 'acciones',):
            if vieja.is_dir():
                import shutil as _sh
                _sh.rmtree(vieja, ignore_errors=True)
        argv = sys.argv
        sys.argv = ['clips.py', '--repo', a.repo, '--carpeta', a.carpeta,
                    '--temporada', a.temporada, '--salida', a.salida]
        if a.fecha:
            sys.argv += ['--fecha', a.fecha]
        if a.hasta:
            sys.argv += ['--hasta', a.hasta]
        if a.vertical:
            sys.argv += ['--vertical']
        if a.guardar_video:
            sys.argv += ['--guardar-video']
        try:
            clips.main()
        except SystemExit as e:
            if e.code:
                print('   ' + str(e))
        finally:
            sys.argv = argv
        # El video de cada placa al lado de su placa y CON EL MISMO NUMERO:
        # clips.py nombra por fundamento y acá la numeración es de
        # publicación, así que hay que traducir. Si no, la placa 1 queda al
        # lado de un saque.mp4 y hay que adivinar cuál va con cuál.
        numerado = {p['slug'].split('-', 1)[1]: p['slug'] for p in piezas}
        vd = destino / 'video'
        if vd.is_dir():
            ac = vd / 'acciones'
            if ac.is_dir():
                dst = destino / 'acciones'
                dst.mkdir(exist_ok=True)
                for f in list(ac.iterdir()):
                    base_n = f.stem.rsplit('_', 1)[0] if f.suffix == '.mp4' else f.stem
                    nuevo = numerado.get(base_n, base_n)
                    f.replace(dst / f.name.replace(base_n, nuevo, 1))
            for f in list(vd.iterdir()):
                if f.suffix == '.mp4':
                    f.replace(destino / ((numerado.get(f.stem, f.stem)) + '.mp4'))
                elif f.name == 'cortes.txt':
                    f.replace(destino / f.name)
            shutil.rmtree(vd, ignore_errors=True)

    # ── 3c · YouTube y TikTok ─────────────────────────────────────────────
    # Se arman con lo que ya está: las placas y sus recortes. No calcula
    # nada nuevo, solo los pega en el formato de cada red.
    if not a.sin_video and not a.sin_redes:
        print()
        print('[+] Redes')
        n = limpiar.limpiar(destino, 'redes')
        if n:
            print(limpiar.aviso(n, 'videos de redes anteriores'))
        argv = sys.argv
        sys.argv = ['redes.py', '--repo', a.repo, '--carpeta', a.carpeta,
                    '--temporada', a.temporada, '--salida', a.salida]
        if a.fecha:
            sys.argv += ['--fecha', a.fecha]
        if a.hasta:
            sys.argv += ['--hasta', a.hasta]
        try:
            redes.main()
        except SystemExit as e:
            if e.code:
                print('   ' + str(e))
        except Exception as e:
            print('   no se pudieron armar (%s)' % str(e)[:70])
        finally:
            sys.argv = argv

    # ── 3b · el historial ─────────────────────────────────────────────────
    # Se guarda SIEMPRE, incluso si la fecha no se publica: el valor está en
    # tenerla, y la fecha 1 solo existe si se guardó en la fecha 1.
    try:
        EQ = liga.leer(a.repo, a.carpeta, archivos)
        NOM_json, _eqs = seis_placas.nombres(a.repo, a.temporada)
        NOM = seis_placas.fichas(EQ, NOM_json)
        rot = rotacion.a_placa(rotacion.por_equipo(a.repo, a.carpeta, archivos))
        clave = '%s/%s' % (a.temporada, destino.name)
        n = historial.guardar(clave, a.temporada, archivos, EQ, NOM, rot)
        print()
        print('[+] Historial: %d fechas guardadas' % n)
    except Exception as e:
        print()
        print('[+] Historial: no se pudo guardar (%s)' % str(e)[:60])

    # ── 3b · una placa por partido ────────────────────────────────────────
    # Van aparte, en su carpeta: no son del carrusel de la fecha. Cada una
    # cuenta UN partido, con el fotograma de ese partido de fondo, para que
    # la pueda compartir el club que lo jugó. Sin video salen igual, con el
    # degradé de los dos escudos.
    print()
    print('[3b] Placas de partido')
    try:
        ctx_p = {'escudos': club.escudos(a.repo), 'liga': seis_placas.LIGA}
        pp = partido.placas_de(a.repo, archivos, rotulo,
                               (piezas[0].get('fuente') if piezas else ''),
                               ctx_p, video_dir=destino / 'video')
    except Exception as e:
        pp = []
        print('   no pude armarlas: %s' % e)
    if pp:
        carpeta_p = destino / 'partidos'
        limpiar.limpiar(destino, 'partidos')
        carpeta_p.mkdir(parents=True, exist_ok=True)
        # sin numerar: acá el orden no importa, cada placa es de un club
        for x in pp:
            x['nro'] = x['total'] = 0
        hechos_p = placas2.generar(pp, carpeta_p)
        con_foto = sum(1 for x in pp if x['partido'].get('fondo'))
        for h in hechos_p:
            viejo = carpeta_p / h
            nuevo_n = carpeta_p / h.split('-', 1)[1]
            if viejo.exists():
                viejo.replace(nuevo_n)
            print('   partidos/' + h.split('-', 1)[1])
        print('   %d placa%s (%d con fotograma del partido)'
              % (len(pp), '' if len(pp) == 1 else 's', con_foto))
        # y en 9:16, que es como las comparte un club en historias
        if not a.sin_historias:
            hp = carpeta_p / 'historias'
            for h in placas2.generar(pp, hp, alto=1920):
                viejo_h = hp / h
                if viejo_h.exists():
                    viejo_h.replace(hp / h.split('-', 1)[1])
            print('   %d en vertical 9:16 (partidos/historias)' % len(pp))
    else:
        print('   sin partidos para placa')

    # ── 4 · los textos ────────────────────────────────────────────────────
    print()
    print('[4/4] Textos')
    con = [p.get('slug') for p in piezas
           if (destino / 'redes' / 'tiktok' / (str(p.get('slug')) + '.mp4')).exists()]
    (destino / 'PUBLICAR.txt').write_text(
        publicacion.plan(piezas, rotulo, seis_placas.LIGA.split(' · ')[0], con),
        encoding='utf-8')
    print('   PUBLICAR.txt  (el orden, los textos y el calendario)')
    # el texto suelto de cada placa se sigue dejando, por si querés publicar
    # alguna sola
    T = ['TEXTOS SUELTOS DE LA %s' % rotulo.upper(), '',
         'Por si publicás una placa sola. El plan está en PUBLICAR.txt.', '']
    for i, p in enumerate(piezas, 1):
        T.append(texto_de(p, i))
    (destino / 'textos.txt').write_text('\n'.join(T), encoding='utf-8')
    print('   textos.txt   (una por una, por si hace falta)')

    print()
    print('=' * 58)
    if avisos:
        print('LEER ANTES DE PUBLICAR:')
        for x in avisos:
            print('  · ' + x)
        print()
    print('Listo. Está todo en:')
    print('   %s' % destino.resolve())
    print()
    print('Abrí PUBLICAR.txt: ahí está el orden del carrusel, el texto para')
    print('pegar, el de cada reel y el calendario de la semana.')
    return 1 if avisos else 0


if __name__ == '__main__':
    sys.exit(main())
