# -*- coding: utf-8 -*-
"""
RECEPCION_POR_TIPO.py
=====================

Que las recepciones se separen bien en flotado y potencia.

── EL PROBLEMA ───────────────────────────────────────────────────────────────
El motor clasifica cada recepcion mirando el SAQUE anterior:

    if linea es un saque:  _last_serve_tp = flotado / potencia
    ...
    elif es recepcion:     usa _last_serve_tp

Eso funciona en un partido, donde cada recepcion viene despues de un saque.
Pero en un entrenamiento con maquina de saque NO HAY linea de saque: la
maquina no scoutea. De 165 recepciones, 102 no tienen saque antes.

Esas 102 quedaban sin clasificar: no aparecian ni en flotado ni en potencia.

── LO QUE SE PIERDE ──────────────────────────────────────────────────────────
En este entrenamiento:

    recepciones flotadas (RM):  62
    recepciones potencia (RQ): 103

El dato ESTA en el .dvw, en la propia linea de recepcion. El motor lo
ignoraba y miraba el saque.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Leer el tipo de la propia recepcion: RM / RH = flotado, RQ / RT = potencia.
Si por algun motivo no lo trae, recien ahi se mira el saque anterior, como
antes.

Asi funciona igual en partidos y con maquina de saque.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))

VIEJO = """                  if _last_serve_tp=='flotado': pa[pn]['r_flo'].append({'effect':ef})
                  elif _last_serve_tp=='potencia': pa[pn]['r_pot'].append({'effect':ef})"""

NUEVO = """                  # El tipo lo trae la propia recepcion: RM/RH flotado,
                  # RQ/RT potencia. Antes se miraba el saque anterior, y con
                  # maquina de saque no hay saque que mirar: 102 de 165
                  # recepciones quedaban sin clasificar.
                  _rtyp = code[3] if len(code)>3 else ''
                  if   _rtyp in ('M','H'): pa[pn]['r_flo'].append({'effect':ef})
                  elif _rtyp in ('Q','T'): pa[pn]['r_pot'].append({'effect':ef})
                  elif _last_serve_tp=='flotado': pa[pn]['r_flo'].append({'effect':ef})
                  elif _last_serve_tp=='potencia': pa[pn]['r_pot'].append({'effect':ef})"""


def main():
    print()
    print('  ' + '=' * 62)
    print('     RECEPCIONES: FLOTADO Y POTENCIA')
    print('  ' + '=' * 62)
    print()

    motores = sorted(glob.glob(os.path.join(AQUI, 'update_db*.py')))
    tocar = []
    for m in motores:
        s = io.open(m, encoding='utf-8', errors='replace').read()
        if "_last_serve_tp=='flotado'" in s and '_rtyp' not in s:
            tocar.append(os.path.basename(m))

    if not tocar:
        print('  ' + '-' * 62)
        print('     Ya estaba puesto.')
        print()
        return 0

    print('     Motores a corregir:')
    for f in tocar:
        print('       · ' + f)
    print()
    print('     El motor miraba el saque anterior para saber si la recepcion')
    print('     fue de flotado o de potencia. Con maquina de saque no hay')
    print('     saque, y 102 de 165 recepciones quedaban sin clasificar.')
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

        m = re.search(r"^( *)if _last_serve_tp=='flotado': pa\[pn\]\['r_flo'\]\.append\(\{'effect':ef\}\)\n( *)elif _last_serve_tp=='potencia': pa\[pn\]\['r_pot'\]\.append\(\{'effect':ef\}\)", s, re.M)
        if not m:
            print('       %-36s no pude ubicarlo' % f)
            continue

        ind = m.group(1)
        nuevo = (
            ind + '# El tipo lo trae la propia recepcion: RM/RH flotado,\n' +
            ind + '# RQ/RT potencia. Antes se miraba el saque anterior, y con\n' +
            ind + '# maquina de saque no hay saque que mirar: quedaban sin\n' +
            ind + '# clasificar 102 de 165 recepciones.\n' +
            ind + "_rtyp = code[3] if len(code)>3 else ''\n" +
            ind + "if   _rtyp in ('M','H'): pa[pn]['r_flo'].append({'effect':ef})\n" +
            ind + "elif _rtyp in ('Q','T'): pa[pn]['r_pot'].append({'effect':ef})\n" +
            ind + "elif _last_serve_tp=='flotado': pa[pn]['r_flo'].append({'effect':ef})\n" +
            ind + "elif _last_serve_tp=='potencia': pa[pn]['r_pot'].append({'effect':ef})"
        )
        s = s.replace(m.group(0), nuevo, 1)

        resp = ruta + '.antes-rectipo'
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
