"""
===============================================================================
  actualizar_capsula.py — TRAER LAS PANTALLAS DE LA TEMPORADA ACTUAL
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de la carpeta de una temporada archivada
  (por ejemplo  temporadas\\2025-26 ).

  ── POR QUÉ DESDE ACÁ Y NO DESDE OTRO CLUB ─────────────────────────────────
  Es el mismo club: mismo nombre de equipo, mismo cifrado, mismos archivos de
  datos. No hay nada que adaptar salvo el año que dicen los carteles.

  Traerlas de otro club obliga a cambiar la clave del equipo, el archivo de
  chat y el cifrado, y cualquiera de esas tres cosas mal deja la pantalla sin
  datos. Desde acá no existe ese riesgo.

  ── QUÉ HACE ────────────────────────────────────────────────────────────────
  Compara cada pantalla de la cápsula con la de la temporada actual, función
  por función. Si a la de la cápsula le faltan, la reemplaza — y le corrige el
  año de los carteles para que siga diciendo su propia temporada.

  ── LO QUE NO TOCA ──────────────────────────────────────────────────────────
  Ni los datos, ni el plantel, ni los archivos cifrados. Sólo las pantallas que
  estén atrasadas.

  Queda una copia .antes-actualizar de cada una.
===============================================================================
"""
import os
import re
import glob
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CARPETA = os.path.basename(AQUI)

print()
print('  ' + '=' * 62)
print('     TRAER LAS PANTALLAS DE LA TEMPORADA ACTUAL')
print('  ' + '=' * 62)
print()

# ── la temporada de esta cápsula, del nombre de la carpeta ──────────────────
m = re.match(r'^(\d{4})-(\d{2})$', CARPETA)
if not m:
    print('  Esta carpeta no parece una temporada archivada.')
    print('  Se esperaba un nombre como  2025-26  y esta es:  %s' % CARPETA)
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

ANIO = int(m.group(1))
ESTA = '%d/%s' % (ANIO, m.group(2))

# ── la carpeta del club, dos niveles arriba ─────────────────────────────────
CLUB = os.path.dirname(os.path.dirname(AQUI))
if not os.path.exists(os.path.join(CLUB, 'index.html')):
    print('  No encuentro la carpeta del club.')
    print('  Este script va adentro de  temporadas\\%s' % CARPETA)
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

print('  Esta capsula:        temporada %s' % ESTA)
print('  La temporada actual: %s' % CLUB)
print()

# ── qué pantallas están atrasadas ───────────────────────────────────────────
atrasadas = []
for p in sorted(glob.glob(os.path.join(CLUB, '*.html'))):
    f = os.path.basename(p)
    q = os.path.join(AQUI, f)
    if not os.path.exists(q):
        continue
    try:
        vieja = open(q, encoding='utf-8', errors='replace').read()
        nueva = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue
    fa = set(re.findall(r'function\s+([A-Za-z_]\w*)\s*\(', vieja))
    fb = set(re.findall(r'function\s+([A-Za-z_]\w*)\s*\(', nueva))
    falta = fb - fa
    if falta:
        atrasadas.append((f, len(falta)))

if not atrasadas:
    print('  Ninguna pantalla esta atrasada. La capsula ya esta al dia.')
    print()
    input('  Enter para cerrar...')
    sys.exit(0)

print('  Pantallas atrasadas (%d):' % len(atrasadas))
for f, n in sorted(atrasadas, key=lambda x: -x[1]):
    print('     %-26s le faltan %d funciones' % (f[:26], n))
print()
print('  Se van a reemplazar por las de la temporada actual, corrigiendo')
print('  el ano de los carteles.')
print()
input('  Enter para seguir, o cerra la ventana para cancelar...')
print()


def corregir_ano(texto, anio, esta):
    """Le pone a los carteles la temporada de esta capsula.

       Se reemplaza el ano que venga de la temporada siguiente, y el
       'temporada en curso' pasa a 'temporada archivada', que es lo que es."""
    n = 0
    for y in range(anio + 1, anio + 4):
        etq = '%d/%02d' % (y, (y + 1) % 100)
        texto, k = re.subn(r'(?<![\w/-])' + re.escape(etq) + r'(?![\w/-])', esta, texto)
        n += k
    texto, k = re.subn(r'temporada en curso', 'temporada archivada', texto, flags=re.I)
    return texto, n + k


hechas = 0
for f, _ in atrasadas:
    origen = os.path.join(CLUB, f)
    destino = os.path.join(AQUI, f)
    try:
        s = open(origen, encoding='utf-8', errors='replace').read()
    except Exception:
        continue

    s, carteles = corregir_ano(s, ANIO, ESTA)

    if not os.path.exists(destino + '.antes-actualizar'):
        shutil.copy2(destino, destino + '.antes-actualizar')
    open(destino, 'w', encoding='utf-8').write(s)
    hechas += 1
    print('     traida    %-26s %d carteles corregidos' % (f[:26], carteles))

print()
print('  %d pantallas al dia. Se guardo una copia .antes-actualizar.' % hechas)
print()
print('  Los datos, el plantel y los archivos cifrados NO se tocaron.')
print()
print('  Publica desde la carpeta principal del club.')
print()
input('  Enter para cerrar...')
