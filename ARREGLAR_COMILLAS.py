# -*- coding: utf-8 -*-
# ============================================================================
#  ARREGLAR_COMILLAS.py — URGENTE: repara lo que rompio UNIFICAR_TIPOGRAFIA
#  ---------------------------------------------------------------------------
#  QUE PASO
#
#  UNIFICAR_TIPOGRAFIA cambiaba, entre otras cosas:
#
#      font-family: monospace    ->    font-family:'JetBrains Mono'
#
#  Eso esta bien en una hoja de estilos. Pero en algunos lugares ese CSS vive
#  ADENTRO de una cadena de JavaScript escrita con comillas simples:
#
#      html += '<div style="font-family:monospace">' + x + '</div>'
#
#  Al meterle comillas simples a la familia, la cadena se corta por la mitad:
#
#      html += '<div style="font-family:'JetBrains Mono'">' + ...
#                                       ^ aca se cierra la cadena
#
#  y el navegador tira "Unexpected identifier 'JetBrains'". Cuando eso pasa,
#  TODO el bloque <script> donde esta esa linea deja de ejecutarse.
#
#  DONDE
#
#      camara.html         1 lugar
#      panel_vivo.html     3 lugares   <- el Scout en vivo
#      panel_vivo-1.html   3 lugares   (copia vieja, si todavia existe)
#
#  COMO LO ARREGLA
#
#  Le saca las comillas al nombre de la familia, SOLO en esos lugares:
#
#      font-family:'JetBrains Mono'   ->   font-family:JetBrains Mono
#
#  En CSS eso es valido y se ve igual. La cadena de JavaScript vuelve a cerrar
#  donde tiene que cerrar y el bloque corre de nuevo.
#
#  Solo toca lo que esta adentro de un <script> y adentro de una cadena de
#  comillas simples. El CSS de las hojas de estilo no se toca.
#
#      python ARREGLAR_COMILLAS.py          <- solo mira
#      python ARREGLAR_COMILLAS.py --si     <- lo arregla
#
#  Deja una copia <archivo>.antes_comillas
# ============================================================================
import os, re, sys, glob, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv
FAMS = ["'JetBrains Mono'", "'Barlow Condensed'", "'Bebas Neue'"]


def rotos(texto):
    """Devuelve las posiciones (absolutas) a reparar."""
    sitios = []
    for m in re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', texto, re.S | re.I):
        js, base = m.group(1), m.start(1)
        for fam in FAMS:
            for x in re.finditer(re.escape('font-family:' + fam), js):
                k = x.start()
                ini = js.rfind('\n', 0, k) + 1
                if js[ini:k].count("'") % 2 == 1:        # cadena de comillas simples abierta
                    sitios.append((base + k, fam))
    return sitios


def main():
    os.chdir(AQUI)
    print()
    print('  ARREGLAR COMILLAS' + ('' if HACERLO else '   (solo mirando - nada se escribe)'))
    print('  ' + '-' * 68)

    van, total = [], 0
    for f in sorted(glob.glob('*.html')):
        if '.antes_' in f:
            continue
        try:
            s = open(f, encoding='utf-8', errors='surrogateescape', newline='').read()
        except Exception:
            continue
        sitios = rotos(s)
        if not sitios:
            continue
        nuevo = s
        for pos, fam in sorted(sitios, reverse=True):
            sin = fam.strip("'")
            nuevo = nuevo[:pos] + ('font-family:' + sin) + nuevo[pos + len('font-family:' + fam):]
        van.append((f, len(sitios), nuevo)); total += len(sitios)
        for pos, fam in sitios:
            print('   %-24s linea %-6d %s' % (f, s[:pos].count('\n') + 1, fam))

    print('  ' + '-' * 68)
    if not van:
        print('   No hay nada roto. Todo en orden.')
        print(); return
    print('   %d lugares rotos en %d archivos.' % (total, len(van)))

    if not HACERLO:
        print()
        print('   Para arreglarlo de verdad:')
        print('       python ARREGLAR_COMILLAS.py --si')
        print(); return

    for f, n, nuevo in van:
        copia = f + '.antes_comillas'
        if not os.path.exists(copia):
            shutil.copy2(f, copia)
        open(f, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(nuevo)
    print()
    print('   ARREGLADO. De cada archivo quedo una copia <archivo>.antes_comillas')
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
