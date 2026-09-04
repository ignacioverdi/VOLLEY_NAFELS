# -*- coding: utf-8 -*-
"""
ARREGLAR_MOTOR_ENTRENAMIENTOS.py
================================

El motor de entrenamientos nunca pudo procesar un .dvw.

── EL ERROR ──────────────────────────────────────────────────────────────────
Al correrlo aparece:

    ERROR &Pra-AXPO NAFELS-2026-09-03.dvw: name 'COMBO_EQUIV' is not defined
    DB updated: 0 added, 0 skipped

COMBO_EQUIV es la tabla que traduce las combinaciones de ataque de
DataVolley ('W4' -> 'X5', etc.). El motor de PARTIDOS la define; el de
ENTRENAMIENTOS la usa pero nunca la definio.

Resultado: cada .dvw de entrenamiento falla al leerse, la base queda con
0 sesiones, y en la app se ven datos viejos de otra corrida.

Lo revisamos contra el historial del repo: no es algo que se haya roto
ahora, nunca funciono.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Se agrega la misma tabla que usa el motor de partidos, para que los dos
traduzcan las combinaciones igual.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))

TABLA = """
# Traduce las combinaciones de ataque de DataVolley a las que usa el sistema.
# El motor de partidos ya la tenia; el de entrenamientos la usaba sin
# definirla, y por eso fallaba al leer cada .dvw.
COMBO_EQUIV = {
    'W4':'X5','G4':'V5','J1':'X1','J4':'XM','J3':'X2','J2':'X7','J5':'CB',
    'W2':'X6','G2':'V6','Y9':'X8','G9':'V8','Y8':'XP','G8':'VP',
}

"""


def main():
    print()
    print('  ' + '=' * 62)
    print('     EL MOTOR DE ENTRENAMIENTOS')
    print('  ' + '=' * 62)
    print()

    motores = sorted(glob.glob(os.path.join(AQUI, 'update_db*.py')))
    if not motores:
        print('     No encontre los motores update_db*.py')
        print()
        return 1

    tocar = []
    for m in motores:
        s = io.open(m, encoding='utf-8', errors='replace').read()
        usa = 'COMBO_EQUIV' in s
        define = bool(re.search(r'^COMBO_EQUIV\s*=', s, re.M))
        if usa and not define:
            tocar.append(os.path.basename(m))

    if not tocar:
        print('  ' + '-' * 62)
        print('     Todos los motores ya tienen la tabla.')
        print()
        return 0

    print('     Motores que usan COMBO_EQUIV sin definirla:')
    for f in tocar:
        print('       · ' + f)
    print()
    print('     Por eso fallaba al leer cada .dvw de entrenamiento y la base')
    print('     quedaba con 0 sesiones.')
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

        # la tabla va despues del ultimo import, antes de que se use
        ult = 0
        for mm in re.finditer(r'^(import |from )[^\n]*\n', s, re.M):
            ult = mm.end()
        s = s[:ult] + TABLA + s[ult:]

        resp = ruta + '.antes-combo'
        if not os.path.exists(resp):
            try:
                shutil.copy2(ruta, resp)
            except Exception:
                pass
        io.open(ruta, 'w', encoding='utf-8').write(s)
        print('       %-36s listo' % f)

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
