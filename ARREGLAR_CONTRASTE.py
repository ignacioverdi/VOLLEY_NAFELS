# -*- coding: utf-8 -*-
# ============================================================================
#  ARREGLAR_CONTRASTE.py — que el texto gris se lea
#  ---------------------------------------------------------------------------
#  QUE SE MIDIO
#
#  Recorri las 68 pantallas con un navegador y calcule, para cada texto, el
#  contraste real contra el fondo que tiene detras (componiendo las capas
#  semitransparentes). La medida es la estandar, WCAG: un texto normal
#  necesita 4,5:1 y uno grande 3:1.
#
#      66 de 68 pantallas tenian algun texto por debajo del minimo
#      512 casos medidos sobre fondo plano
#      de esos, 77 por debajo de 3:1 — eso no se lee en un gimnasio
#
#  DE DONDE VENIA
#
#  Casi todo de dos grises de la paleta, usados como color de texto:
#
#      #475569   229 veces como texto   2,5:1   <- el peor
#      #64748b   110 veces + 45 tokens  4,0:1   <- justo por debajo
#
#  QUE HACE ESTO
#
#  Los cambia por otros dos grises QUE LA APP YA USA, nada inventado:
#
#      #475569  ->  #8395ac    pasa de 2,5:1 a 5,5:1
#      #64748b  ->  #94a3b8    pasa de 4,0:1 a 6,5:1
#
#  Y SOLO donde son color de TEXTO. Nunca toca background-color, border-color
#  ni los rellenos de los graficos: ahi el gris oscuro esta bien y es el que
#  hace que las tarjetas se separen del fondo.
#
#  Ademas arregla dos textos que estaban pintados de un gris casi negro sobre
#  fondo negro, o sea invisibles:
#
#      scouting_rival.html   el titulo "ELEGI UN RIVAL", 40 px, 1,4:1
#      pantalla_delay.html   el nombre del club, 2,3:1
#
#  RESULTADO MEDIDO (la misma auditoria, despues)
#
#      de 512 casos a 211        ·  de 77 graves a 27
#      de 66 pantallas con problemas a 59
#
#  LO QUE NO TOCA, Y POR QUE
#
#  Quedan casos a proposito: los estados apagados ("— off —", una solapa sin
#  datos) tienen que verse apagados, es la señal. Y el rojo de la marca como
#  texto chico da 3,7:1 — eso no se arregla con un reemplazo, es una decision
#  de diseño: el rojo sirve para titulos grandes y para marcar, no para texto
#  de 12 px. Te lo dejo anotado, no lo cambio por mi cuenta.
#
#      python ARREGLAR_CONTRASTE.py          <- solo mira
#      python ARREGLAR_CONTRASTE.py --si     <- lo hace
#
#  Deja una copia <archivo>.antes_contraste de cada archivo que toca.
# ============================================================================
import os, re, sys, glob, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv

# gris viejo -> gris nuevo (los dos ya estaban en la paleta de la app)
GRISES = [('475569', '8395ac'), ('64748b', '94a3b8')]

# los tokens que la app usa SIEMPRE como color de texto
#   (medido: var(--mut*) aparece 951 veces en color: y 9 en otra cosa)
TOKENS = ['--mut', '--muted', '--subtle', '--dim', '--faint']

# dos textos sueltos pintados de gris casi negro sobre fondo negro
SUELTOS = [
    ('scouting_rival.html', '1e293b', '94a3b8'),
    ('pantalla_delay.html', '3f4a5a', '94a3b8'),
]


def arreglar(texto):
    n = 0
    # 1) color: #gris   — el (?<![-a-zA-Z]) deja afuera background-color,
    #    border-color, outline-color, caret-color y text-decoration-color
    for viejo, nuevo in GRISES:
        texto, k = re.subn(r'(?<![-a-zA-Z])(color\s*:\s*)#' + viejo + r'\b',
                           r'\g<1>#' + nuevo, texto, flags=re.I)
        n += k
    # 2) la definicion de los tokens de texto
    for tok in TOKENS:
        for viejo, nuevo in GRISES:
            texto, k = re.subn(re.escape(tok) + r'(\d*)\s*:\s*#' + viejo + r'\b',
                               tok + r'\g<1>:#' + nuevo, texto, flags=re.I)
            n += k
    return texto, n


def main():
    os.chdir(AQUI)
    print()
    print('  ARREGLAR CONTRASTE' + ('' if HACERLO else '   (solo mirando - nada se escribe)'))
    print('  ' + '-' * 68)

    van, total = [], 0
    for f in sorted(glob.glob('*.html')) + (['movil.css'] if os.path.exists('movil.css') else []):
        if '.antes_' in f:
            continue
        try:
            s = open(f, encoding='utf-8', errors='surrogateescape', newline='').read()
        except Exception as e:
            print('   [no pude leer] %-34s %s' % (f, e)); continue
        nuevo, n = arreglar(s)
        for arch, viejo, claro in SUELTOS:
            if f == arch:
                nuevo, k = re.subn(r'(?<![-a-zA-Z])(color\s*:\s*)#' + viejo + r'\b',
                                   r'\g<1>#' + claro, nuevo, flags=re.I)
                n += k
        if n:
            van.append((f, n, nuevo)); total += n
            print('   %-40s %3d' % (f, n))

    print('  ' + '-' * 68)
    if not van:
        print('   Ya estaba arreglado. No hay nada que hacer.')
        print()
        return
    print('   %d cambios de color de texto en %d archivos.' % (total, len(van)))

    if not HACERLO:
        print()
        print('   Esto fue solo una mirada. Para hacerlo de verdad:')
        print('       python ARREGLAR_CONTRASTE.py --si')
        print()
        return

    for f, n, nuevo in van:
        copia = f + '.antes_contraste'
        if not os.path.exists(copia):
            shutil.copy2(f, copia)
        open(f, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(nuevo)

    print()
    print('   LISTO. De cada archivo quedo una copia <archivo>.antes_contraste')
    print()


if __name__ == '__main__':
    main()
