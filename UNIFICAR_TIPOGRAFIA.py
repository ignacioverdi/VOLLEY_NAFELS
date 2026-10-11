# -*- coding: utf-8 -*-
# ============================================================================
#  UNIFICAR_TIPOGRAFIA.py — de diez tipografias a cuatro
#  ---------------------------------------------------------------------------
#  QUE HACE
#
#  La app pintaba DIEZ familias tipograficas distintas al mismo tiempo. Contadas
#  sobre texto realmente dibujado en pantalla, recorriendo las 68 paginas:
#
#      Barlow Condensed 2378 · Inter 380 · system-ui 311 · Barlow 276
#      Bebas Neue 228 · Archivo 181 · Rajdhani 101 · JetBrains Mono 67
#      Bricolage Grotesque 59 · ui-monospace 35
#
#  Las que no son de la familia Barlow no aportan nada: son restos de pantallas
#  hechas en momentos distintos. Y las dos "sin asignar" (system-ui,
#  ui-monospace) las dibuja el sistema operativo, asi que la misma pantalla se
#  ve distinta en Windows, en iPhone y en Android.
#
#  Esto las reemplaza por las cuatro que se quedan:
#
#      Bebas Neue        titulos y numeros grandes
#      Barlow Condensed  toda la interfaz
#      Barlow            texto largo de lectura   (no se toca)
#      JetBrains Mono    numeros en tablas densas
#
#  QUE NO HACE
#
#  Cambia UNICAMENTE el nombre de la tipografia adentro de una declaracion
#  font-family. No toca una sola linea de logica, ni datos, ni cuentas, ni
#  permisos, ni el HTML, ni el color de nada. Medido en la copia de prueba:
#  111 cambios, los 111 adentro de un font-family, cero afuera.
#
#  Y solo reemplaza cuando la tipografia es la PRIMERA de la lista. Si va de
#  reserva (por ejemplo "'Barlow Condensed', Inter, sans-serif") se deja como
#  esta, porque ahi no se usa nunca.
#
#  COMO SE USA
#
#      python UNIFICAR_TIPOGRAFIA.py          <- solo MIRA y te dice que haria
#      python UNIFICAR_TIPOGRAFIA.py --si     <- lo hace de verdad
#
#  Antes de escribir, de cada archivo que toca deja una copia  <archivo>.antes_tipografia
#  Para volver atras: borrar el archivo y renombrar la copia. O "git checkout".
# ============================================================================
import os, re, sys, glob, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv

# ── las que se van, y a donde van ──────────────────────────────────────────
# (el patron se aplica solo cuando es la PRIMERA de la lista)
CAMBIOS = [
    (r"['\"]Inter['\"]",               "'Barlow Condensed'"),
    (r"Inter",                         "'Barlow Condensed'"),
    (r"['\"]Archivo['\"]",             "'Barlow Condensed'"),
    (r"['\"]Rajdhani['\"]",            "'Barlow Condensed'"),
    (r"Rajdhani",                      "'Barlow Condensed'"),
    (r"['\"]Bricolage Grotesque['\"]", "'Barlow Condensed'"),
    (r"system-ui",                     "'Barlow Condensed'"),
    (r"-apple-system",                 "'Barlow Condensed'"),
    (r"Arial",                         "'Barlow Condensed'"),
    (r"ui-monospace",                  "'JetBrains Mono'"),
    (r"monospace",                     "'JetBrains Mono'"),
    (r"['\"]?Oswald['\"]?",            "'Bebas Neue'"),
    (r"['\"]?Archivo Black['\"]?",     "'Bebas Neue'"),
]

# ── el remate: los elementos que no tienen tipografia puesta ───────────────
BLOQUE = """

/* ════════════════════════════════════════════════════════════════════════════
   MARCA — una sola voz tipografica          (lo pone UNIFICAR_TIPOGRAFIA.py)
   ----------------------------------------------------------------------------
   Cubre los elementos que no tienen tipografia declarada y caian en la del
   sistema operativo, que es distinta en Windows, en iPhone y en Android.
   Sin !important a proposito: cualquier pagina que declare lo suyo gana.
   Para sacarlo: borrar este bloque. No toca nada mas.
   ════════════════════════════════════════════════════════════════════════════ */
html{ font-family:'Barlow Condensed', system-ui, sans-serif; }
"""
MARCA_BLOQUE = 'MARCA — una sola voz tipografica'


def revisar(texto):
    """Devuelve (texto_nuevo, cuantos_cambios)."""
    n = 0
    for patron, reemplazo in CAMBIOS:
        texto, k = re.subn(r"(font-family\s*:\s*)" + patron + r"(?=\s*[,;}'\"])",
                           r"\1" + reemplazo, texto)
        n += k
    # si el reemplazo dejo la misma familia dos veces seguidas, se saca la repetida
    texto = re.sub(r"(font-family\s*:\s*'Barlow Condensed')\s*,\s*'Barlow Condensed'", r"\1", texto)
    texto = re.sub(r"(font-family\s*:\s*'Bebas Neue')\s*,\s*'Bebas Neue'", r"\1", texto)
    texto = re.sub(r"(font-family\s*:\s*'JetBrains Mono')\s*,\s*'JetBrains Mono'", r"\1", texto)
    return texto, n


def main():
    os.chdir(AQUI)
    archivos = sorted(glob.glob('*.html'))
    if os.path.exists('movil.css'):
        archivos.append('movil.css')

    print()
    print('  UNIFICAR TIPOGRAFIA' + ('' if HACERLO else '   (solo mirando — nada se escribe)'))
    print('  ' + '-' * 68)

    total, tocados = 0, []
    for f in archivos:
        if f.endswith('.antes_tipografia'):
            continue
        try:
            s = open(f, encoding='utf-8', errors='surrogateescape', newline='').read()
        except Exception as e:
            print('   [no pude leer] %-34s %s' % (f, e))
            continue
        nuevo, n = revisar(s)
        if n:
            total += n
            tocados.append((f, n, nuevo))
            print('   %-38s %3d cambio%s' % (f, n, '' if n == 1 else 's'))

    falta_bloque = False
    if os.path.exists('movil.css'):
        css = open('movil.css', encoding='utf-8', errors='surrogateescape', newline='').read()
        falta_bloque = MARCA_BLOQUE not in css
        if falta_bloque:
            print('   %-38s + el bloque de cierre' % 'movil.css')

    print('  ' + '-' * 68)
    if not total and not falta_bloque:
        print('   Ya esta todo unificado. No hay nada que hacer.')
        print()
        return

    print('   %d cambios en %d archivos.' % (total, len(tocados)))

    if not HACERLO:
        print()
        print('   Esto fue solo una mirada. Para hacerlo de verdad:')
        print('       python UNIFICAR_TIPOGRAFIA.py --si')
        print()
        return

    for f, n, nuevo in tocados:
        copia = f + '.antes_tipografia'
        if not os.path.exists(copia):
            shutil.copy2(f, copia)
        open(f, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(nuevo)

    if falta_bloque:
        if not os.path.exists('movil.css.antes_tipografia'):
            shutil.copy2('movil.css', 'movil.css.antes_tipografia')
        fin = '\r\n' if '\r\n' in css else '\n'
        with open('movil.css', 'a', encoding='utf-8', errors='surrogateescape', newline='') as fh:
            fh.write(BLOQUE.replace('\n', fin))

    print()
    print('   LISTO. De cada archivo quedo una copia <archivo>.antes_tipografia')
    print('   Si algo no te gusta: borra el archivo y renombra la copia, o "git checkout".')
    print()


if __name__ == '__main__':
    main()
