# -*- coding: utf-8 -*-
# ============================================================================
#  PONER_ICONOS.py — cambia los emojis por los iconos propios
#  ---------------------------------------------------------------------------
#  QUE PROBLEMA RESUELVE
#
#  La app usaba emojis como iconos. Recorriendo las 68 pantallas con un
#  navegador de verdad: 1.561 emojis pintados, 117 distintos, en 44 pantallas.
#
#  El emoji no lo dibuja la app: lo dibuja el sistema operativo. El mismo
#  signo sale distinto en Windows, en iPhone y en Android, con otro color y
#  otro grosor, y algunos no salen. En un producto que se le vende a un club,
#  es lo que mas rapido lo delata como casero.
#
#  QUE HACE
#
#  Agrega UNA linea al <head> de cada pantalla:
#
#      <script src="iconos.js" defer></script>
#
#  Eso es todo. El trabajo lo hace iconos.js, que trae 85 iconos propios
#  dibujados sobre la misma grilla, con el mismo trazo, y pintados con el
#  color del texto que los rodea.
#
#  QUE NO TOCA
#
#  · Las pantallas de tiempo real (Panel en vivo, Panel de voley, Velocidades
#    en vivo, Camara, las de delay). Ahi manda la velocidad, no la estetica,
#    asi que no se les agrega nada.
#  · Los <option> de los desplegables: adentro de un <option> un dibujo no se
#    puede mostrar. Esos emojis quedan como estan (son los de las opciones de
#    bloqueo en Armadores y Game Plan).
#  · Los cuadrados de color de las leyendas, las banderas de nacionalidad y
#    las caras del wellness: NO son iconos, son dato. Quedan como estan.
#
#  POR QUE NO ROMPE NADA
#
#  El emoji no se borra: queda en el texto, invisible y sin ocupar lugar.
#  Cualquier codigo que lea .textContent o .innerText sigue leyendo lo mismo
#  que antes, y el traductor (lang.js) sigue encontrando sus frases.
#
#  Probado sobre la app entera: 0 errores nuevos en consola, 0 desbordes
#  nuevos, 0 pantallas rotas.
#
#  COMO SE USA
#
#      python PONER_ICONOS.py          <- solo MIRA y te dice que haria
#      python PONER_ICONOS.py --si     <- lo hace de verdad
#
#  De cada archivo que toca deja una copia  <archivo>.antes_iconos
#
#  APAGARLO SIN DESINSTALAR NADA
#      En la consola del navegador:  localStorage.setItem('vs_iconos','off')
#      y recargar. Vuelven los emojis.
# ============================================================================
import os, re, sys, glob, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv

# las de tiempo real no se tocan: ahi manda la velocidad
SIN_ICONOS = {
    'panel_vivo.html', 'panel_voley.html', 'velocidades_vivo.html',
    'pantalla_delay.html', 'prueba_delay.html', 'camara.html',
    'modelo_completo.html',
}

LINEA = '<script src="iconos.js" defer></script>'
RX_HEAD = re.compile(r'</head>', re.I)


def main():
    os.chdir(AQUI)

    if not os.path.exists('iconos.js'):
        print()
        print('   FALTA iconos.js en esta carpeta. Sin ese archivo esto no hace nada.')
        print()
        return

    print()
    print('  PONER ICONOS' + ('' if HACERLO else '   (solo mirando — nada se escribe)'))
    print('  ' + '-' * 68)

    van, ya, sin_head = [], 0, []
    for f in sorted(glob.glob('*.html')):
        if f in SIN_ICONOS or f.endswith('.antes_iconos'):
            continue
        try:
            s = open(f, encoding='utf-8', errors='surrogateescape', newline='').read()
        except Exception as e:
            print('   [no pude leer] %-34s %s' % (f, e))
            continue
        if 'iconos.js' in s:
            ya += 1
            continue
        if not RX_HEAD.search(s):
            sin_head.append(f)
            continue
        van.append((f, s))

    for f, _ in van:
        print('   %s' % f)

    print('  ' + '-' * 68)
    if ya:
        print('   %d pantallas ya lo tenian.' % ya)
    if sin_head:
        print('   %d sin </head>, se saltean: %s' % (len(sin_head), ', '.join(sin_head[:4])))
    print('   %d pantallas sin tocar a proposito (tiempo real).' % len(SIN_ICONOS))

    if not van:
        print('   No hay nada que hacer.')
        print()
        return

    print('   %d pantallas a las que les agrego UNA linea.' % len(van))

    if not HACERLO:
        print()
        print('   Esto fue solo una mirada. Para hacerlo de verdad:')
        print('       python PONER_ICONOS.py --si')
        print()
        return

    for f, s in van:
        copia = f + '.antes_iconos'
        if not os.path.exists(copia):
            shutil.copy2(f, copia)
        fin = '\r\n' if '\r\n' in s else '\n'
        m = RX_HEAD.search(s)
        nuevo = s[:m.start()] + fin + LINEA + fin + s[m.start():]
        open(f, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(nuevo)

    print()
    print('   LISTO. De cada archivo quedo una copia <archivo>.antes_iconos')
    print('   Para volver atras: borra el archivo y renombra la copia, o "git checkout".')
    print()


if __name__ == '__main__':
    main()
