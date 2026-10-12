# -*- coding: utf-8 -*-
# ============================================================================
#  PONER_BARRA.py — la barra de navegacion en todas las pantallas
#  ---------------------------------------------------------------------------
#  QUE RESUELVE
#
#  Hasta ahora cada pantalla era una isla. Entrabas, hacias lo tuyo, volvias a
#  la portada y buscabas la siguiente en una lista de 36 tarjetas. Para ir de
#  Analisis a Game Plan habia que pasar por el inicio si o si.
#
#  La barra pone arriba de todas las pantallas las 45 pantallas de la app,
#  agrupadas por para-que sirven:
#
#      Partido · Rendimiento · Plantel · Video · En vivo · Dia a dia · Entrenador
#
#  Desde cualquier lado se llega a cualquier lado en un clic. Y con la tecla /
#  se abre un buscador que entiende los tres idiomas a la vez: con la app en
#  ingles podes escribir "mapa" y te encuentra los Serve map y Reception map.
#
#  QUE HACE ESTE ARCHIVO
#
#  Agrega UNA linea al <head> de cada pantalla:
#
#      <script src="nav.js" defer></script>
#
#  Nada mas. El trabajo lo hace nav.js, que ya esta en la carpeta.
#
#  QUE NO TOCA
#
#  · Las pantallas de tiempo real: Panel en vivo, Panel de voley, Velocidades,
#    Camara, Pizarron de TV y las de delay. Ahi la barra estorba y manda la
#    velocidad de operacion.
#  · El contenido de ninguna pantalla. La barra se agrega al principio del
#    <body> y corre el resto 52 px para abajo.
#  · Ninguna pantalla de las que llevan barra define su propio espacio arriba
#    (lo medi una por una), asi que no se pierde el aire de nadie.
#  · Al imprimir, la barra desaparece.
#
#  PROBADO
#
#  Las 60 pantallas con barra, en telefono y en escritorio: ningun desborde,
#  ningun error de JavaScript, la barra no tapa contenido en ninguna. Y las 69
#  de la app cargadas una por una en un navegador de verdad: cero errores.
#
#      python PONER_BARRA.py          <- solo mira
#      python PONER_BARRA.py --si     <- lo hace
#
#  De cada archivo deja una copia <archivo>.antes_barra
#
#  APAGARLA SIN DESINSTALAR NADA
#      En la consola del navegador:  localStorage.setItem('vs_nav','off')
#      y recargar.
# ============================================================================
import os, re, sys, glob, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv

SIN_BARRA = {
    'panel_vivo.html', 'panel_voley.html', 'velocidades_vivo.html',
    'pantalla_delay.html', 'prueba_delay.html', 'camara.html',
    'pizarron.html', 'modelo_completo.html', 'revisar.html',
}
LINEA = '<script src="nav.js" defer></script>'
RX_HEAD = re.compile(r'</head>', re.I)


def main():
    os.chdir(AQUI)
    print()
    print('  PONER LA BARRA' + ('' if HACERLO else '   (solo mirando - nada se escribe)'))
    print('  ' + '-' * 68)

    if not os.path.exists('nav.js'):
        print('   FALTA nav.js en esta carpeta. Sin ese archivo esto no hace nada.')
        print(); return

    van, ya, sin_head = [], 0, []
    for f in sorted(glob.glob('*.html')):
        if f in SIN_BARRA or '.antes_' in f:
            continue
        try:
            s = open(f, encoding='utf-8', errors='surrogateescape', newline='').read()
        except Exception as e:
            print('   [no pude leer] %-32s %s' % (f, e)); continue
        if 'nav.js' in s:
            ya += 1; continue
        if not RX_HEAD.search(s):
            sin_head.append(f); continue
        van.append((f, s))

    for f, _ in van:
        print('   %s' % f)

    print('  ' + '-' * 68)
    if ya:
        print('   %d pantallas ya la tenian.' % ya)
    if sin_head:
        print('   %d sin </head>, se saltean.' % len(sin_head))
    print('   %d pantallas sin barra a proposito (tiempo real).' % len(SIN_BARRA))

    if not van:
        print('   No hay nada que hacer.')
        print(); return

    print('   %d pantallas a las que les agrego UNA linea.' % len(van))

    if not HACERLO:
        print()
        print('   Esto fue solo una mirada. Para hacerlo de verdad:')
        print('       python PONER_BARRA.py --si')
        print(); return

    for f, s in van:
        copia = f + '.antes_barra'
        if not os.path.exists(copia):
            shutil.copy2(f, copia)
        fin = '\r\n' if '\r\n' in s else '\n'
        m = RX_HEAD.search(s)
        open(f, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(
            s[:m.start()] + fin + LINEA + fin + s[m.start():])

    print()
    print('   LISTO. De cada archivo quedo una copia <archivo>.antes_barra')
    print('   Para volver atras: borra el archivo y renombra la copia, o "git checkout".')
    print()


def esperar():
    if '--desde-bat' in sys.argv:
        return
    try:
        if sys.stdin and sys.stdin.isatty():
            input('   (Enter para cerrar) ')
    except Exception:
        pass


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(); print('   Se corto por un error:', e)
        import traceback; traceback.print_exc()
    esperar()
