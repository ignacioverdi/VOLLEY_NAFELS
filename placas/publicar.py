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

import clips, fechas, historial, liga, rotacion, seis_placas, placas2, verificar

# El orden de publicación. La conclusión fuerte (side-out) va al final, que
# es donde queda la gente que llegó hasta ahí.
ORDEN = ['saque', 'recepcion', 'armado', 'ataque', 'bloqueo',
         'equipo-ideal', 'rotaciones']

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
        rotulo = 'Fecha %s · %s' % (a.fecha, a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / ('fecha-%02d' % int(a.fecha))
    elif a.hasta:
        rotulo = 'Fechas 1 a %s · %s' % (a.hasta, a.temporada)
        destino = pathlib.Path(a.salida) / a.temporada / ('hasta-%02d' % int(a.hasta))
    else:
        rotulo = 'Temporada %s' % a.temporada
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
            for f in list(vd.iterdir()):
                if f.suffix == '.mp4':
                    f.replace(destino / ((numerado.get(f.stem, f.stem)) + '.mp4'))
                elif f.name == 'cortes.txt':
                    f.replace(destino / f.name)
            shutil.rmtree(vd, ignore_errors=True)

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

    # ── 4 · los textos ────────────────────────────────────────────────────
    print()
    print('[4/4] Textos')
    T = ['TEXTOS DE LA %s' % rotulo.upper(), '',
         'Uno por publicación, en orden. Copiá y pegá.', '']
    for i, p in enumerate(piezas, 1):
        T.append(texto_de(p, i))
    (destino / 'textos.txt').write_text('\n'.join(T), encoding='utf-8')
    print('   textos.txt')

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
    print('Se publica de arriba hacia abajo: la placa 1, su video, la 2, y así.')
    return 1 if avisos else 0


if __name__ == '__main__':
    sys.exit(main())
