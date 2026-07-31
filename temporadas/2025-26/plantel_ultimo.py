"""
===============================================================================
  plantel_ultimo.py — QUE EL PLANTEL DE LA TEMPORADA GANE
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de la carpeta de la temporada archivada.

  ── QUÉ PASÓ ────────────────────────────────────────────────────────────────
  Las pantallas de la cápsula cargan el plantel de un archivo cifrado que quedó
  congelado con los jugadores de la temporada siguiente:

      datos_equipo.js.enc          <- el que gana hoy
      datos_equipo_2025-26.js.enc

  Y el archivo con el plantel correcto —plantel_nafels.js— no lo carga ninguna.
  Por eso cambiarlo no tenía ningún efecto: nadie lo estaba leyendo.

  ── CÓMO SE RESUELVE ────────────────────────────────────────────────────────
  Se lo agrega AL FINAL de la lista de cada pantalla. El último que carga es el
  que manda, así que gana sobre los anteriores sin tener que tocarlos ni
  descifrar nada.

  El archivo del plantel publica los datos con los cuatro nombres que usan las
  distintas pantallas, así que con cargarlo alcanza.

  Queda una copia .antes-ultimo de cada pantalla.
===============================================================================
"""
import os
import re
import glob
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))

print()
print('  ' + '=' * 62)
print('     QUE EL PLANTEL DE LA TEMPORADA GANE')
print('  ' + '=' * 62)
print()

# ── el archivo del plantel ─────────────────────────────────────────────────
archivo = ''
for p in glob.glob(os.path.join(AQUI, 'plantel_*.js')):
    if not p.endswith('.enc'):
        archivo = os.path.basename(p)
        break

if not archivo:
    print('  No encuentro plantel_<club>.js en esta carpeta.')
    print('  Copialo primero y volve a correr esto.')
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

try:
    t = open(os.path.join(AQUI, archivo), encoding='utf-8', errors='replace').read()
    n = len(re.findall(r'num:\s*\d+', t))
    temp = re.search(r'temporada:\s*"([^"]+)"', t)
    aps = re.findall(r'ap:\s*"([^"]+)"', t)
    print('  %s  ·  temporada %s  ·  %d jugadores'
          % (archivo, (temp.group(1) if temp else '?'), n))
    print('     %s' % ', '.join(aps[:6]))
except Exception:
    pass
print()

LINEA = ('<script src="%s" onerror="void 0"></script>' % archivo)

tocadas = 0
for p in sorted(glob.glob(os.path.join(AQUI, '*.html'))):
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue

    # sólo las que muestran el plantel
    if not re.search(r'EQUIPO_DATA|PLANTEL_|_JUGADORES', s):
        continue

    # si ya lo carga, se saca de donde está: tiene que quedar al final
    ya = re.search(r'\s*<script src="' + re.escape(archivo) + r'"[^>]*></script>', s)
    if ya:
        s = s[:ya.start()] + s[ya.end():]

    # al final de todos los que carga
    todos = list(re.finditer(r'<script src="[^"]+"[^>]*></script>', s))
    if not todos:
        continue
    fin = todos[-1].end()
    s = s[:fin] + '\n  ' + LINEA + s[fin:]

    if not os.path.exists(p + '.antes-ultimo'):
        shutil.copy2(p, p + '.antes-ultimo')
    open(p, 'w', encoding='utf-8').write(s)
    tocadas += 1
    print('     %-26s %s' % (nombre[:26], 'ya lo tenia, lo movi al final'
                             if ya else 'agregado al final'))

print()
if tocadas:
    print('  %d pantallas. Se guardo una copia .antes-ultimo.' % tocadas)
    print()
    print('  El plantel se carga ultimo, asi que gana sobre los archivos')
    print('  cifrados que traian el plantel de la otra temporada.')
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  Ninguna pantalla muestra el plantel.')
print()
input('  Enter para cerrar...')
