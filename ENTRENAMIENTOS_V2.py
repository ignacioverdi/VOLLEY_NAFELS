# -*- coding: utf-8 -*-
"""
ENTRENAMIENTOS_V2.py
====================

Segunda pasada: que un entrenamiento del equipo contra si mismo registre
TODAS las acciones.

── POR QUE HIZO FALTA ────────────────────────────────────────────────────────
La version anterior sumaba los resultados de los dos lados, pero el problema
estaba antes. En el bucle que lee las acciones hay este filtro:

    if t != pfx: continue

Descarta toda accion que no sea del lado que se esta procesando. En un
entrenamiento TODAS las acciones vienen del lado '*', asi que la segunda
vuelta (pfx='a') las descarta a todas y no queda nada para sumar.

── QUE HACE ──────────────────────────────────────────────────────────────────
Cuando los dos lados son el mismo equipo, ese filtro no se aplica: se toman
las acciones de los dos lados, que son del mismo plantel.

Y para que no se cuenten dos veces, la segunda vuelta se saltea entera.

En un partido de verdad —equipos distintos— todo sigue igual que antes.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))

VIEJO = "            if t!=pfx: continue"

NUEVO = """            # En un entrenamiento los dos lados son el mismo equipo y las
            # acciones suelen venir todas de un lado. Si se filtrara por
            # lado, la segunda vuelta las descartaria todas.
            if not _MISMO_EQUIPO and t!=pfx: continue"""

# la bandera, y el salteo de la segunda vuelta
MARCA_BUCLE = "for team, pfx, section in [(home,'*','[3PLAYERS-H]'),(away,'a','[3PLAYERS-V]')]:"

NUEVO_BUCLE = """# Entrenamiento: si los dos lados son el mismo club, es el plantel
    # entrenando contra si mismo. Se procesa UNA sola vez, tomando las
    # acciones de los dos lados.
    _MISMO_EQUIPO = bool(home) and bool(away) and home.strip().upper() == away.strip().upper()
    for team, pfx, section in [(home,'*','[3PLAYERS-H]'),(away,'a','[3PLAYERS-V]')]:
        if _MISMO_EQUIPO and pfx == 'a':
            continue   # ya se tomaron las dos mitades en la primera vuelta"""


def main():
    print()
    print('  ' + '=' * 62)
    print('     ENTRENAMIENTOS — SEGUNDA PASADA')
    print('  ' + '=' * 62)
    print()

    motores = sorted(glob.glob(os.path.join(AQUI, 'update_db*.py')))
    tocar = []
    for m in motores:
        s = io.open(m, encoding='utf-8', errors='replace').read()
        if VIEJO in s and '_MISMO_EQUIPO' not in s:
            tocar.append(os.path.basename(m))

    if not tocar:
        print('  ' + '-' * 62)
        print('     Ya estaba (o el filtro tiene otra forma).')
        print()
        return 0

    print('     Motores a corregir:')
    for f in tocar:
        print('       · ' + f)
    print()
    print('     El filtro "if t!=pfx" descartaba las acciones del otro lado.')
    print('     En un entrenamiento eso deja todo vacio.')
    print()

    if '--si' in sys.argv:
        print('     Aplico? (S/N): S   (automatico)')
    else:
        try:
            r = input('     Aplico? (S/N): ').strip().lower()
        except Exception:
            r = 'n'
        if r not in ('s', 'si', 'y'):
            print()
            print('     No toque nada.')
            print()
            return 0

    print()
    for f in tocar:
        ruta = os.path.join(AQUI, f)
        s = io.open(ruta, encoding='utf-8', errors='replace').read()

        # 1) la bandera y el salteo, en el bucle
        m = re.search(r'^([ \t]*)' + re.escape(MARCA_BUCLE), s, re.M)
        if not m:
            print('       %-34s no encontre el bucle' % f)
            continue
        ind = m.group(1)
        bloque = (
            ind + '# Entrenamiento: si los dos lados son el mismo club, es el plantel\n' +
            ind + '# entrenando contra si mismo. Se procesa UNA sola vez, tomando las\n' +
            ind + '# acciones de los dos lados.\n' +
            ind + '_MISMO_EQUIPO = bool(home) and bool(away) and home.strip().upper() == away.strip().upper()\n' +
            ind + MARCA_BUCLE + '\n' +
            ind + '    if _MISMO_EQUIPO and pfx == \'a\':\n' +
            ind + '        continue   # ya se tomaron las dos mitades en la primera vuelta'
        )
        s = s.replace(m.group(0), bloque, 1)

        # 2) el filtro
        s = s.replace(VIEJO, NUEVO, 1)

        resp = ruta + '.antes-entren2'
        if not os.path.exists(resp):
            try:
                shutil.copy2(ruta, resp)
            except Exception:
                pass
        io.open(ruta, 'w', encoding='utf-8').write(s)
        print('       %-34s listo' % f)

    print()
    print('  ' + '-' * 62)
    print('     Listo. Corre HACER_TODO.bat')
    print()
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    finally:
        if '--si' not in sys.argv:
            try:
                input('  Enter para cerrar...')
            except Exception:
                pass
