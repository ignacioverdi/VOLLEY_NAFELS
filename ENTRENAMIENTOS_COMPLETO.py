# -*- coding: utf-8 -*-
"""
ENTRENAMIENTOS_COMPLETO.py
==========================

Que un entrenamiento aparezca COMPLETO: heat maps, analisis, dashboard y el
perfil de cada jugador.

── LAS TRES CAUSAS ───────────────────────────────────────────────────────────

1. COMBO_EQUIV NO ESTABA DEFINIDA
   El motor fallaba al leer cada .dvw y la base quedaba en 0 sesiones.
   (Ya corregido en el paso anterior; aca se verifica.)

2. EL FILTRO POR LADO
   En un entrenamiento los dos lados son el mismo club y las acciones vienen
   todas de un lado. El filtro 'if l[0] != pfx: continue' las descartaba.

   Aparece en DOS lugares: al leer las acciones y al armar el historial.
   El primero ya se corrigio; el segundo es el que dejaba vacios el analisis,
   el dashboard y el perfil del jugador.

3. EL FILTRO POR SETS  ← la causa de fondo
   Antes de armar el historial hay esto:

       if tsets + rsets == 0: continue

   Un entrenamiento NO tiene sets ganados ni perdidos: la seccion [3SET] del
   .dvw viene vacia. Asi que la sesion se descartaba entera y nunca llegaba
   al historial.

   Por eso los heat maps mostraban los datos (leen de otro archivo) pero
   Analisis decia "0 ENTRENAMIENTOS" y el perfil del jugador estaba vacio.

── QUE HACE ──────────────────────────────────────────────────────────────────
Los tres filtros dejan de aplicarse cuando es un entrenamiento del equipo
contra si mismo. En un partido de verdad, todo sigue igual.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))

TABLA = """
# Traduce las combinaciones de ataque de DataVolley. El motor de partidos ya
# la tenia; el de entrenamientos la usaba sin definirla y fallaba al leer.
COMBO_EQUIV = {
    'W4':'X5','G4':'V5','J1':'X1','J4':'XM','J3':'X2','J2':'X7','J5':'CB',
    'W2':'X6','G2':'V6','Y9':'X8','G9':'V8','Y8':'XP','G8':'VP',
}

"""


def main():
    print()
    print('  ' + '=' * 62)
    print('     ENTRENAMIENTOS — QUE APAREZCAN COMPLETOS')
    print('  ' + '=' * 62)
    print()

    motores = sorted(glob.glob(os.path.join(AQUI, 'update_db*entrenamientos*.py')))
    if not motores:
        motores = sorted(glob.glob(os.path.join(AQUI, 'update_db*.py')))
    if not motores:
        print('     No encontre los motores update_db*.py')
        print()
        return 1

    print('     Se corrigen tres cosas en el motor de entrenamientos:')
    print()
    print('       1. la tabla COMBO_EQUIV que faltaba')
    print('       2. el filtro por lado, en el armado del historial')
    print('       3. el filtro por sets  (un entrenamiento no tiene sets)')
    print()
    print('     El tercero es el que dejaba vacios el analisis, el dashboard')
    print('     y el perfil de cada jugador.')
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
    for m in motores:
        f = os.path.basename(m)
        s = io.open(m, encoding='utf-8', errors='replace').read()
        orig = s
        hechos = []

        # ── 1. COMBO_EQUIV ──────────────────────────────────────────────
        if 'COMBO_EQUIV' in s and not re.search(r'^COMBO_EQUIV\s*=', s, re.M):
            ult = 0
            for mm in re.finditer(r'^(import |from )[^\n]*\n', s, re.M):
                ult = mm.end()
            s = s[:ult] + TABLA + s[ult:]
            hechos.append('COMBO_EQUIV')

        # ── 2 y 3. los filtros del historial ────────────────────────────
        # la bandera, junto al calculo de team_home del historial
        V = "          team_home = norm(home_raw)==team_name\n          pfx = '*' if team_home else 'a'"
        if V not in s:
            mm = re.search(r'( *)team_home = norm\(home_raw\)==team_name\n( *)pfx = \'\*\' if team_home else \'a\'', s)
            V = mm.group(0) if mm else None

        if V and '_ENTREN_MISMO' not in s:
            ind = re.match(r'( *)', V).group(1)
            N = (V + '\n' +
                 ind + '# En un entrenamiento los dos lados son el mismo club: las acciones\n' +
                 ind + '# vienen todas de un lado y no hay que filtrar por lado.\n' +
                 ind + '_home_e, _away_e = get_teams(lines)\n' +
                 ind + '_ENTREN_MISMO = norm(_home_e).strip().upper() == norm(_away_e).strip().upper()')
            s = s.replace(V, N, 1)
            hechos.append('bandera de entrenamiento')

        # el filtro por lado, en el historial. La indentacion cambia segun
        # el motor, asi que se busca con expresion regular.
        m2 = re.search(r'^( *)if l\[0\]!=pfx: continue', s, re.M)
        if m2 and 'not _ENTREN_MISMO and l[0]' not in s:
            s = s.replace(m2.group(0),
                          m2.group(1) + 'if not _ENTREN_MISMO and l[0]!=pfx: continue', 1)
            hechos.append('filtro por lado')

        # ── 3. el filtro por sets ───────────────────────────────────────
        V3 = "          if tsets+rsets==0: continue"
        if V3 not in s:
            mm = re.search(r'( *)if tsets\+rsets==0: continue', s)
            V3 = mm.group(0) if mm else None
        if V3:
            ind = re.match(r'( *)', V3).group(1)
            N3 = (ind + '# Un entrenamiento no tiene sets ganados ni perdidos: la seccion\n' +
                  ind + '# [3SET] del .dvw viene vacia. Sin esto, la sesion se descartaba\n' +
                  ind + '# entera y no llegaba al historial que leen el analisis, el\n' +
                  ind + '# dashboard y el perfil del jugador.\n' +
                  ind + '_es_entren = norm(home).strip().upper() == norm(away).strip().upper()\n' +
                  ind + 'if tsets+rsets==0 and not _es_entren: continue')
            s = s.replace(V3, N3, 1)
            hechos.append('filtro por sets')

        if s == orig:
            print('       %-36s ya estaba' % f)
            continue

        resp = m + '.antes-completo'
        if not os.path.exists(resp):
            try:
                shutil.copy2(m, resp)
            except Exception:
                pass
        io.open(m, 'w', encoding='utf-8').write(s)
        print('       %-36s %s' % (f, ' · '.join(hechos)))

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
