"""
===============================================================================
  descifrar_datos.py — QUE TODAS LAS PANTALLAS PUEDAN LEER LOS DATOS
-------------------------------------------------------------------------------
  Doble clic. Se corre en la carpeta del club.

  ── QUÉ PASÓ ────────────────────────────────────────────────────────────────
  Los datos del club están cifrados: los archivos terminan en .enc y el
  navegador no puede leerlos directamente. Para abrirlos hacen falta dos cosas:

      <script src="datos_seguros.js"></script>     el que sabe abrirlos
      <script>abrirDatos();</script>               el que los abre

  Quince pantallas lo hacen. Treinta y tres, no. Y esas cargan el archivo
  cifrado, el navegador intenta leerlo como si fuera codigo, falla en silencio,
  y la pantalla se queda sin datos.

  De ahi venian casi todos los sintomas juntos:

      "Jugador no encontrado"
      la pestaña de Jugadores vacia
      Recepcion vacia
      Ranking vacio
      los mapas de calor sin nada
      Analisis que no ve el entrenamiento

  Una sola causa. Y no es de ahora: esas pantallas nunca pudieron leer datos
  cifrados. En la temporada archivada funcionaban porque ahi les agregamos
  archivos sin cifrar.

  ── QUÉ HACE ────────────────────────────────────────────────────────────────
  A cada pantalla que cargue algo cifrado y no sepa abrirlo, se le agregan esas
  dos lineas, en el mismo orden que usan las que ya funcionan: el lector antes
  de los datos, y la apertura despues.

  Queda una copia .antes-descifrar de cada una.
===============================================================================
"""
import os
import re
import glob
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))

print()
print('  ' + '=' * 66)
print('     QUE TODAS LAS PANTALLAS PUEDAN LEER LOS DATOS')
print('  ' + '=' * 66)
print()

if not os.path.exists(os.path.join(AQUI, 'datos_seguros.js')):
    print('  Falta datos_seguros.js en esta carpeta.')
    print('  Es el archivo que sabe abrir los datos cifrados.')
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

paginas = sorted(glob.glob(os.path.join(AQUI, '*.html')))
tocadas = 0
ya = 0
sin_cifrado = 0

for p in paginas:
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue

    # ¿carga algo cifrado?
    cifrados = re.findall(r'<script src="([^"]+\.enc)"[^>]*></script>', s)
    if not cifrados:
        sin_cifrado += 1
        continue

    tiene_lector = 'datos_seguros.js' in s
    tiene_apertura = re.search(r'abrirDatos\s*\(\s*\)', s) is not None
    if tiene_lector and tiene_apertura:
        ya += 1
        continue

    original = s

    # ── 1 · el lector, ANTES del primer archivo cifrado ───────────────────
    if not tiene_lector:
        m = re.search(r'<script src="[^"]+\.enc"[^>]*></script>', s)
        if m:
            s = (s[:m.start()] +
                 '<script src="datos_seguros.js"></script>\n  ' +
                 s[m.start():])

    # ── 2 · la apertura, DESPUÉS del último ───────────────────────────────
    if not tiene_apertura:
        todos = list(re.finditer(r'<script src="[^"]+\.enc"[^>]*></script>', s))
        if todos:
            fin = todos[-1].end()
            s = (s[:fin] +
                 '\n  <script>abrirDatos();</script>' +
                 s[fin:])

    if s != original:
        if not os.path.exists(p + '.antes-descifrar'):
            shutil.copy2(p, p + '.antes-descifrar')
        open(p, 'w', encoding='utf-8').write(s)
        tocadas += 1
        falta = []
        if not tiene_lector:
            falta.append('el lector')
        if not tiene_apertura:
            falta.append('la apertura')
        print('     %-26s %d archivo(s) cifrado(s) · le faltaba %s'
              % (nombre[:26], len(cifrados), ' y '.join(falta)))

print()
print('  ' + '-' * 66)
print('     arregladas: %d   ·   ya estaban: %d   ·   sin datos cifrados: %d'
      % (tocadas, ya, sin_cifrado))
print('  ' + '-' * 66)
print()
if tocadas:
    print('  Ahora todas las pantallas pueden leer los datos del club.')
    print()
    print('  Publica y proba el dashboard, el perfil del jugador y los mapas.')
print()
input('  Enter para cerrar...')
