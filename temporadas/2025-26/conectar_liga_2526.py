"""
===============================================================================
  conectar_liga_2526.py — LOS ARMADORES EN LA CÁPSULA
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de  temporadas\\2025-26 , después de copiar ahí el
  archivo  liga_data_2025-26.js

  ── QUÉ ARREGLA ─────────────────────────────────────────────────────────────
  La solapa de Armado abría vacía. No era un problema de conexión: la liga_data
  que tiene la cápsula es de cuando se archivó la temporada, y **le falta la
  sección de armadores** — esa parte del motor se agregó después.

  El archivo nuevo se regeneró desde los 97 .dvw de la temporada, con el motor
  de hoy. Trae los armadores (#4 Vazquez, #1 Deecke), el plantel completo y los
  atacantes.

  ── CÓMO SE CONECTA ─────────────────────────────────────────────────────────
  Se agrega UNA línea por página, después del archivo cifrado. Como carga
  después, lo reemplaza — sin descifrar ni tocar nada.

  Es el mismo mecanismo que usamos para el plantel, y es el que no rompió nada.

  ── SE PUEDE DESHACER ───────────────────────────────────────────────────────
  Borrando  liga_data_2025-26.js  vuelve todo a como estaba.
===============================================================================
"""
import os
import re
import glob
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = 'liga_data_2025-26.js'

print()
print('  ' + '=' * 62)
print('     LOS ARMADORES EN LA CAPSULA')
print('  ' + '=' * 62)
print()

if not os.path.exists(os.path.join(AQUI, DATOS)):
    print('  Falta %s en esta carpeta.' % DATOS)
    print('  Copialo primero y volve a correr esto.')
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

# qué trae, para que se vea antes de tocar nada
try:
    t = open(os.path.join(AQUI, DATOS), encoding='utf-8', errors='replace').read(600000)
    m = re.search(r'"nafels"\s*:\s*\{.*?"setters"\s*:\s*\[(.*?)\]', t, re.S)
    if not m:
        m = re.search(r'"setters"\s*:\s*\[(.*?)\]', t, re.S)
    if m:
        nums = re.findall(r'"num"\s*:\s*(\d+)', m.group(1))
        print('  El archivo trae armadores: %s' % (', '.join('#' + n for n in nums[:5]) or '(ninguno)'))
    eq = len(set(re.findall(r'"([a-z_]{3,20})"\s*:\s*\{\s*"name"', t)))
    print('  Equipos: %d' % eq)
except Exception:
    pass
print()

LINEA = '<script src="' + DATOS + '" onerror="void 0"></script>\n'

tocadas = 0
for p in sorted(glob.glob(os.path.join(AQUI, '*.html'))):
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue

    if DATOS in s:
        continue
    # sólo las que usan la liga
    if 'LIGA_DATA' not in s and 'liga_data' not in s:
        continue

    # justo después de que cargue la liga cifrada, o de abrirDatos()
    m = re.search(r'<script src="liga_data\.js(?:\.enc)?"[^>]*></script>', s)
    if not m:
        m = re.search(r'<script>\s*abrirDatos\(\)\s*;?\s*</script>', s)
    if not m:
        todos = list(re.finditer(r'<script src="[^"]+\.js(?:\.enc)?"[^>]*></script>', s))
        m = todos[-1] if todos else None
    if not m:
        print('     %-26s no encontre donde ponerla' % nombre[:26])
        continue

    s = s[:m.end()] + '\n' + LINEA + s[m.end():]

    if not os.path.exists(p + '.antes-liga'):
        shutil.copy2(p, p + '.antes-liga')
    open(p, 'w', encoding='utf-8').write(s)
    tocadas += 1
    print('     %-26s lista' % nombre[:26])

print()
if tocadas:
    print('  %d paginas usan la liga de esta temporada.' % tocadas)
    print('  Se guardo una copia .antes-liga de cada una.')
    print()
    print('  El archivo cifrado NO se toco.')
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  Ninguna pagina necesitaba el cambio.')
print()
input('  Enter para cerrar...')
