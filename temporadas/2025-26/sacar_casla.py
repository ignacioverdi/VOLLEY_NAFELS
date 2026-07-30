"""
===============================================================================
  sacar_casla.py — LAS MENCIONES AL CLUB DE ORIGEN
-------------------------------------------------------------------------------
  Doble clic. Trabaja sobre las páginas de esta carpeta.

  ── QUÉ ARREGLA ─────────────────────────────────────────────────────────────
  Al traer pantallas de otro club, el reemplazo cambió la clave del equipo
  —sanlorenzo por nafels— pero se olvidó del nombre visible. Quedaron 88
  menciones repartidas en quince páginas:

      <title>Plan de Partido — CASLA</title>
      CASLA · DataVolley 4

  Son carteles, no datos, pero cualquiera que entre ve el nombre de otro club.

  ── CÓMO SABE CÓMO SE LLAMA ESTE CLUB ───────────────────────────────────────
  Del nombre de los archivos propios —chat_nafels.js, plantel_nafels.js— y del
  título de las páginas que no vinieron de afuera. No hay que decirle nada.

  ── LO QUE NO TOCA ──────────────────────────────────────────────────────────
  Ni los datos, ni los nombres de archivo, ni las claves de equipo: sólo el
  texto que se ve en pantalla.
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
print('     LAS MENCIONES AL CLUB DE ORIGEN')
print('  ' + '=' * 62)
print()

# ── cómo se llama este club ────────────────────────────────────────────────
corto = ''
for patron in ('chat_*.js', 'plantel_*.js', '*_players_db.json'):
    for f in glob.glob(os.path.join(AQUI, patron)) + \
             glob.glob(os.path.join(os.path.dirname(os.path.dirname(AQUI)), patron)):
        n = os.path.basename(f)
        m = re.match(r'(?:chat_|plantel_)?([a-z0-9]+)[._]', n)
        if m and m.group(1) not in ('nla', 'liga', 'datos', 'seguros'):
            corto = m.group(1)
            break
    if corto:
        break

if not corto:
    print('  No pude deducir el nombre de este club.')
    corto = input('  Escribilo (ej: nafels): ').strip().lower()
if not corto:
    print()
    input('  Enter para cerrar...')
    sys.exit(1)

MOSTRAR = corto.upper()
# el acento del club, si lo tiene en alguna pagina propia
for p in ('index.html', 'dashboard.html'):
    q = os.path.join(os.path.dirname(os.path.dirname(AQUI)), p)
    if not os.path.exists(q):
        continue
    try:
        t = open(q, encoding='utf-8', errors='replace').read(6000)
    except Exception:
        continue
    m = re.search(r'([A-ZÄÖÜÁÉÍÓÚÑ]{3,}[A-ZÄÖÜÁÉÍÓÚÑ\s]{0,14})\s*(?:·|&middot;|-)\s*DataVolley', t)
    if m:
        MOSTRAR = m.group(1).strip()
        break

print('  Este club: %s' % MOSTRAR)
print()

# ── lo que se reemplaza ─────────────────────────────────────────────────────
#    Sólo el nombre visible. Las claves de equipo y los nombres de archivo
#    quedan como están: cambiarlos rompería los enlaces y los datos.
CAMBIOS = [
    (r'\bCASLA\b', MOSTRAR),
    (r'\bCasla\b', MOSTRAR.capitalize()),
    (r'\bSan Lorenzo\b', MOSTRAR.capitalize()),
]

tocadas = 0
total = 0
for p in sorted(glob.glob(os.path.join(AQUI, '*.html'))):
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue
    original = s
    n = 0
    for pat, rep in CAMBIOS:
        # no tocar lo que sea parte de un nombre de archivo o de una direccion
        def cuidado(m):
            i = m.start()
            ventana = s[max(0, i - 30):i + 30]
            if re.search(r'src=|href=|\.js|\.html|\.json|equipo=', ventana):
                return m.group(0)
            return rep
        s, k = re.subn(pat, cuidado, s)
        n += k
    if s != original:
        if not os.path.exists(p + '.antes-nombre'):
            shutil.copy2(p, p + '.antes-nombre')
        open(p, 'w', encoding='utf-8').write(s)
        tocadas += 1
        total += n
        print('     %-26s %d menciones' % (nombre[:26], n))

print()
if tocadas:
    print('  %d paginas · %d menciones cambiadas.' % (tocadas, total))
    print('  Se guardo una copia .antes-nombre de cada una.')
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  Ninguna pagina mencionaba al club de origen.')
print()
input('  Enter para cerrar...')
