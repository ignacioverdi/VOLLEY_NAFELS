"""
===============================================================================
  completar_capsula.py — LO QUE LE FALTA A LA CÁPSULA
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de la carpeta de una temporada archivada.

  ── QUÉ HACE ────────────────────────────────────────────────────────────────

  1) TRAE LOS ARCHIVOS QUE ESTÁN EN LA TEMPORADA ACTUAL
     Al reemplazar pantallas por las de la temporada nueva, esas pantallas
     empiezan a pedir archivos que la cápsula nunca tuvo. Los que existen en la
     carpeta del club se copian tal cual.

  2) CREA LOS QUE NO EXISTEN EN NINGÚN LADO
     Algunos archivos no existen ni en la temporada actual: son de pantallas
     que se agregaron después, o dependen de motores que este club todavía no
     tiene.

     Se crean vacíos. Suena a poco, pero es lo correcto: sin el archivo, el
     navegador tira un error y la pantalla puede quedar a medio dibujar. Con el
     archivo vacío, la pantalla abre y muestra "sin datos", que es la verdad.

  3) CORRIGE LOS CARTELES DEL AÑO
     Las pantallas traídas de la temporada actual dicen su año. Se les pone el
     de esta cápsula, y el "temporada en curso" pasa a "temporada archivada".

  ── LO QUE NO TOCA ──────────────────────────────────────────────────────────
  Ni los datos que ya estaban, ni el plantel, ni los archivos cifrados.
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
print('     LO QUE LE FALTA A LA CAPSULA')
print('  ' + '=' * 62)
print()

m = re.match(r'^(\d{4})-(\d{2})$', CARPETA)
if not m:
    print('  Esta carpeta no parece una temporada archivada (%s).' % CARPETA)
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

ANIO = int(m.group(1))
ESTA = '%d/%s' % (ANIO, m.group(2))
CLUB = os.path.dirname(os.path.dirname(AQUI))

print('  Temporada: %s' % ESTA)
print()

# ── 1 · qué archivos piden las pantallas y no están ────────────────────────
piden = set()
for p in glob.glob(os.path.join(AQUI, '*.html')):
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue
    for x in re.findall(r'<script src="([^"?]+)"', s):
        if x.startswith('http') or x.startswith('../'):
            continue
        piden.add(x)

faltan = []
for x in sorted(piden):
    base = x.replace('.enc', '')
    if (os.path.exists(os.path.join(AQUI, x)) or
        os.path.exists(os.path.join(AQUI, base)) or
        os.path.exists(os.path.join(AQUI, base + '.enc'))):
        continue
    faltan.append(base)

# ── 2 · los que estén en la carpeta del club se copian ─────────────────────
copiados = 0
creados = 0

# qué variable define cada uno, para crearlo vacío con sentido
VACIOS = {
    'datos_entrenamientos.js':     'window.ENTRENAMIENTOS_DATA = {};',
    'liga_data_entrenamientos.js': 'window.LIGA_DATA_ENT = {"teams":{}};',
    'game_plans.js':               'window.GAME_PLANS = {};',
    'datos_gameplan.js':           'window.GAMEPLAN_DATA = {};',
    'datos_prep_fisica.js':        'window.PREP_DATA = {};',
    'datos_voley.js':              'window.VOLEY_DATA = {};',
    'datos_videos.js':             'window.VIDEOS_DATA = {};',
}

for f in faltan:
    origen = os.path.join(CLUB, f)
    origen_enc = origen + '.enc'
    destino = os.path.join(AQUI, f)

    if os.path.exists(origen):
        shutil.copy2(origen, destino)
        copiados += 1
        print('     traido    %-30s de la temporada actual' % f[:30])
        continue
    if os.path.exists(origen_enc):
        shutil.copy2(origen_enc, destino + '.enc')
        copiados += 1
        print('     traido    %-30s cifrado' % f[:30])
        continue

    # no existe en ningún lado: se crea vacío
    if f.startswith('datos_') and f.endswith('.js') and f not in VACIOS:
        # el archivo de datos del otro club: acá no aplica
        cuerpo = ('/* %s — este archivo es del club de origen y no aplica aca.\n'
                  '   Se deja vacio para que la pantalla abra sin error. */\n'
                  'window.__SIN_DATOS_%s = true;\n'
                  % (f, re.sub(r'[^A-Z]', '', f.upper())[:12]))
    else:
        var = VACIOS.get(f, 'window.__VACIO = true;')
        cuerpo = ('/* %s — vacio.\n'
                  '   Esta temporada no genero estos datos: es anterior a esa pantalla,\n'
                  '   o depende de un motor que este club todavia no tiene.\n'
                  '   El archivo existe para que la pantalla abra sin error. */\n'
                  '%s\n' % (f, var))
    open(destino, 'w', encoding='utf-8').write(cuerpo)
    creados += 1
    print('     creado    %-30s vacio' % f[:30])

# ── 3 · los carteles del año ────────────────────────────────────────────────
print()
tocadas = 0
carteles = 0
for p in sorted(glob.glob(os.path.join(AQUI, '*.html'))):
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue
    original = s
    n = 0
    for y in range(ANIO + 1, ANIO + 4):
        etq = '%d/%02d' % (y, (y + 1) % 100)
        s, k = re.subn(r'(?<![\w/-])' + re.escape(etq) + r'(?![\w/-])', ESTA, s)
        n += k
    s, k = re.subn(r'temporada en curso', 'temporada archivada', s, flags=re.I)
    n += k
    if s != original:
        if not os.path.exists(p + '.antes-completar'):
            shutil.copy2(p, p + '.antes-completar')
        open(p, 'w', encoding='utf-8').write(s)
        tocadas += 1
        carteles += n
        print('     %-30s %d carteles' % (os.path.basename(p)[:30], n))

print()
print('  ' + '-' * 62)
print('     traidos: %d   ·   creados vacios: %d   ·   carteles: %d'
      % (copiados, creados, carteles))
print('  ' + '-' * 62)
print()
print('  Los datos, el plantel y los cifrados NO se tocaron.')
print()
print('  Publica desde la carpeta principal del club.')
print()
input('  Enter para cerrar...')
