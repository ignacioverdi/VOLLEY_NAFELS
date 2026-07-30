"""
===============================================================================
  plantel_capsula.py — QUE LA CAPSULA MUESTRE SU PROPIO PLANTEL
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de la carpeta de una temporada archivada
  (por ejemplo  temporadas\\2025-26 ).

  ── QUÉ PASA ────────────────────────────────────────────────────────────────
  La cápsula tiene DOS lugares con el plantel:

      plantel_nafels.js       el que corregimos — tiene el plantel real
      datos_equipo.js.enc     cifrado, congelado al archivar la temporada

  Y seis páginas leen sólo el segundo. Por eso siguen mostrando los jugadores
  de la temporada siguiente aunque el primero esté bien:

      equipo.html · jugador.html · historial_voley.html
      videos.html · baggerone.html

  ── CÓMO SE RESUELVE ────────────────────────────────────────────────────────
  Sin tocar el archivo cifrado —eso sería arriesgado y no hace falta—. Se les
  enseña a esas páginas a mirar primero el plantel de la temporada y, si no
  estuviera, recién ahí el archivo viejo.

  Ocho de las catorce páginas ya lo hacían así. Esto empareja a las otras seis.

  Queda una copia .antes-plantel2 de cada una.
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
print('     QUE LA CAPSULA MUESTRE SU PROPIO PLANTEL')
print('  ' + '=' * 62)
print()

# ── cuál es el archivo del plantel de esta carpeta ──────────────────────────
variable = ''
archivo = ''
for p in glob.glob(os.path.join(AQUI, 'plantel_*.js')):
    try:
        t = open(p, encoding='utf-8', errors='replace').read(30000)
    except Exception:
        continue
    m = re.search(r'window\.([A-Z_][A-Z0-9_]*)\s*=', t)
    if m:
        variable = m.group(1)
        archivo = os.path.basename(p)
        break

if not variable:
    print('  No encuentro el archivo del plantel en esta carpeta.')
    print('  Se esperaba algo como  plantel_<club>.js')
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

# cuántos jugadores tiene, para que se vea que es el correcto
try:
    txt = open(os.path.join(AQUI, archivo), encoding='utf-8', errors='replace').read()
    cuantos = len(re.findall(r'num:\s*\d+', txt))
    temp = re.search(r'temporada:\s*"([^"]+)"', txt)
except Exception:
    cuantos, temp = 0, None

print('  El plantel de esta temporada:')
print('     %s  ·  %s  ·  %d jugadores'
      % (archivo, (temp.group(1) if temp else '?'), cuantos))
print()

paginas = sorted(glob.glob(os.path.join(AQUI, '*.html')))
tocadas = 0

for p in paginas:
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue

    usa_eq = 'EQUIPO_DATA' in s
    usa_pl = variable in s
    if not usa_eq or usa_pl:
        continue                      # o no lo usa, o ya mira el correcto

    original = s

    # que cargue el archivo del plantel, si no lo hacía
    if archivo not in s:
        m = re.search(r'<script src="[^"]+"[^>]*></script>', s)
        if m:
            s = (s[:m.start()] +
                 '<script src="%s" onerror="void 0"></script>\n' % archivo +
                 s[m.start():])

    # y que lo prefiera al archivo viejo.
    #
    # El plantel de la temporada viene envuelto —{temporada, jugadores}— y
    # EQUIPO_DATA tambien tiene .jugadores, asi que se prueban los dos en
    # orden. Solo se tocan las LECTURAS: si alguna pagina le asigna un valor,
    # reemplazarlo dejaria una expresion del lado izquierdo de un igual.
    puente = ('((window.%s&&window.%s.jugadores&&window.%s)||window.EQUIPO_DATA)'
              % (variable, variable, variable))
    no_asig = r'(?!\s*=(?!=))'
    s, n1 = re.subn(r'window\.EQUIPO_DATA\b' + no_asig, puente, s)
    s, n2 = re.subn(r'(?<![.\w])EQUIPO_DATA\b' + no_asig, puente, s)

    if s != original:
        if not os.path.exists(p + '.antes-plantel2'):
            shutil.copy2(p, p + '.antes-plantel2')
        open(p, 'w', encoding='utf-8').write(s)
        tocadas += 1
        print('     %-26s %d referencias' % (nombre[:26], n1 + n2))

print()
if tocadas:
    print('  %d paginas al dia. Se guardo una copia .antes-plantel2.' % tocadas)
    print()
    print('  El archivo cifrado NO se toco.')
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  Todas las paginas ya miraban el plantel correcto.')
print()
input('  Enter para cerrar...')
