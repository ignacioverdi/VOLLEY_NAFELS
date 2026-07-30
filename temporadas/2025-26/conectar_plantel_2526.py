"""
===============================================================================
  conectar_plantel_2526.py — EL PLANTEL QUE JUGÓ, EN LA CÁPSULA
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de  temporadas\\2025-26 , después de copiar ahí el
  archivo  datos_equipo_2025-26.js

  ── QUÉ HACE ────────────────────────────────────────────────────────────────
  Le agrega UNA línea a las páginas que muestran el plantel, para que carguen
  el archivo de la temporada después del cifrado. Como carga después, gana.

  Nada más. No se reemplaza ni se reescribe ningún código: eso fue lo que
  rompió el intento anterior.

  ── POR QUÉ HACE FALTA ──────────────────────────────────────────────────────
  Las páginas leen el plantel de  datos_equipo.js.enc , que está cifrado y
  quedó congelado con los jugadores de la temporada SIGUIENTE al archivar. Por
  eso se ven números sin foto: las fotos que hay son las de los que sí jugaron.

  ── SE PUEDE DESHACER ───────────────────────────────────────────────────────
  Queda una copia .antes-plantel3 de cada página. Y como el único cambio es una
  línea agregada, borrar el archivo datos_equipo_2025-26.js ya alcanza para
  volver todo atrás.
===============================================================================
"""
import os
import re
import glob
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = 'datos_equipo_2025-26.js'

print()
print('  ' + '=' * 62)
print('     EL PLANTEL QUE JUGO, EN LA CAPSULA')
print('  ' + '=' * 62)
print()

if not os.path.exists(os.path.join(AQUI, DATOS)):
    print('  Falta %s en esta carpeta.' % DATOS)
    print('  Copialo primero y volve a correr esto.')
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

# cuántos jugadores trae, para que se vea antes de tocar nada
try:
    t = open(os.path.join(AQUI, DATOS), encoding='utf-8', errors='replace').read()
    n = len(re.findall(r'num:\s*\d+', t))
    temp = re.search(r'temporada:\s*"([^"]+)"', t)
    print('  El plantel a usar:  %s  ·  %d jugadores'
          % (temp.group(1) if temp else '?', n))
except Exception:
    print('  El plantel a usar: (no lo pude leer)')
print()

# La línea que se agrega. Va DESPUÉS de abrirDatos(), que es donde el archivo
# cifrado deja su contenido: al cargar después, este lo reemplaza.
LINEA = '<script src="' + DATOS + '" onerror="void 0"></script>\n'

tocadas = 0
for p in sorted(glob.glob(os.path.join(AQUI, '*.html'))):
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue

    if DATOS in s:
        continue                      # ya la tiene
    # Las paginas que vienen de otra app buscan el plantel con otro nombre
    # —CASLA_JUGADORES— asi que hay que contemplarlo o quedan sin plantel.
    import re as _re
    if not _re.search(r'EQUIPO_DATA|[A-Z]+_JUGADORES|PLANTEL_[A-Z]+', s):
        continue                      # no muestra el plantel

    # El ancla: justo despues de abrirDatos(), que es donde el archivo cifrado
    # deja su contenido. Si la pagina no lo tiene —las que vienen de una app
    # sin cifrado— se pone despues del ultimo archivo de datos que cargue.
    m = re.search(r'<script>\s*abrirDatos\(\)\s*;?\s*</script>', s)
    if not m:
        m = re.search(r'<script src="datos_equipo\.js(?:\.enc)?"[^>]*></script>', s)
    if not m:
        todos = list(re.finditer(r'<script src="[^"]+\.js(?:\.enc)?"[^>]*></script>', s))
        m = todos[-1] if todos else None
    if not m:
        print('     %-26s no encontre donde ponerla' % nombre[:26])
        continue

    s = s[:m.end()] + '\n' + LINEA + s[m.end():]

    if not os.path.exists(p + '.antes-plantel3'):
        shutil.copy2(p, p + '.antes-plantel3')
    open(p, 'w', encoding='utf-8').write(s)
    tocadas += 1
    print('     %-26s lista' % nombre[:26])

print()
if tocadas:
    print('  %d paginas cargan el plantel de la temporada.' % tocadas)
    print('  Se guardo una copia .antes-plantel3 de cada una.')
    print()
    print('  El archivo cifrado NO se toco, y no se reescribio ningun codigo:')
    print('  el unico cambio es una linea agregada por pagina.')
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  Ninguna pagina necesitaba el cambio.')
print()
input('  Enter para cerrar...')
