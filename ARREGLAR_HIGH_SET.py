# -*- coding: utf-8 -*-
"""
ARREGLAR_HIGH_SET.py
====================

Convierte en EH los armados del ejercicio de High Set que quedaron tipeados
como ET.

── QUE PASO ──────────────────────────────────────────────────────────────────

El scout tecleaba solo la E y el Data Volley completaba el tipo con su valor
por defecto, que es T. Asi, un ejercicio entero de pelota alta quedo guardado
como ET:

    *04ET+~~~~~~2      lo que quedo en el archivo
    *04EH+~~~~~~2      lo que era en realidad

La tabla de High Set busca EH, asi que esos armados no aparecian. Medido en la
carpeta: 510 armados perdidos, casi la mitad del ejercicio en cuatro sesiones.

── QUE SE CAMBIA, Y QUE NO ───────────────────────────────────────────────────

SOLO los ET que forman parte de una TIRADA de 8 o mas armados seguidos, sin
ninguna otra accion en el medio. Ese es el ejercicio: arman y arman, nadie
saca, nadie ataca.

Un ET suelto entre un saque y un ataque NO se toca: ese es un armado de juego
normal, y ahi la T puede ser correcta.

── ANTES DE TOCAR NADA ───────────────────────────────────────────────────────

De cada archivo queda una copia .antes-highset. Si algo sale mal, se borra el
.dvw y se le saca ese final al nombre de la copia.

── COMO SE USA ───────────────────────────────────────────────────────────────

Doble clic. Primero muestra lo que va a hacer y pide confirmacion.
Despues hay que correr HACER_TODO para que la tabla se actualice.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))
MIN_BLOQUE = 8


def acciones_de(lineas):
    """Los indices de las lineas que son una accion de scout."""
    out = []
    for i, ln in enumerate(lineas):
        c = ln.split(';')[0].strip()
        if re.match(r'^[*a]\d\d[SRABDEF]', c):
            out.append((i, c))
    return out


def bloques_et(acc):
    """Los indices (dentro de 'acc') de los ET que estan en tirada larga."""
    marcados, run = [], []
    for k, (i, c) in enumerate(acc):
        if re.match(r'^\*\d\dET', c):
            run.append(k)
        else:
            if len(run) >= MIN_BLOQUE:
                marcados.extend(run)
            run = []
    if len(run) >= MIN_BLOQUE:
        marcados.extend(run)
    return marcados


def revisar(ruta):
    """Devuelve (cuantos, lineas_nuevas) sin escribir nada."""
    try:
        txt = io.open(ruta, encoding='latin-1', errors='replace').read()
    except Exception:
        return 0, None, None

    corte = txt.find('[3SCOUT]')
    if corte < 0:
        return 0, None, None

    cabeza = txt[:corte]
    cola = txt[corte:]
    lineas = cola.split('\n')

    acc = acciones_de(lineas)
    marcados = bloques_et(acc)
    if not marcados:
        return 0, None, None

    cambios = 0
    for k in marcados:
        i, c = acc[k]
        ln = lineas[i]
        # se cambia SOLO la quinta letra del codigo, nada mas de la linea
        nuevo = ln[:4] + 'H' + ln[5:]
        if nuevo != ln:
            lineas[i] = nuevo
            cambios += 1

    return cambios, cabeza, '\n'.join(lineas)


def main():
    print()
    print('  ' + '=' * 68)
    print('     LOS ARMADOS DEL EJERCICIO QUE QUEDARON COMO ET')
    print('  ' + '=' * 68)
    print()

    carpetas = [d for d in glob.glob(os.path.join(AQUI, 'DVW *'))
                if os.path.isdir(d)]
    if not carpetas:
        print('     No encontre carpetas de .dvw en esta carpeta.')
        print()
        return 1

    # ── primero mirar, sin tocar ──────────────────────────────────────────
    plan = []
    for d in sorted(carpetas):
        for f in sorted(glob.glob(os.path.join(d, '*.dvw'))):
            n, cabeza, nuevo = revisar(f)
            if n:
                plan.append((f, n, cabeza, nuevo))

    if not plan:
        print('     No hay ningun ET en tirada larga. No hay nada que cambiar.')
        print()
        return 0

    total = sum(x[1] for x in plan)
    print('     Voy a convertir %d armados, en %d archivo(s):' % (total, len(plan)))
    print()
    carpeta_ant = None
    for f, n, _, _ in plan:
        d = os.path.basename(os.path.dirname(f))
        if d != carpeta_ant:
            print('     [%s]' % d)
            carpeta_ant = d
        print('        %-46s %4d armados' % (os.path.basename(f)[:46], n))
    print()
    print('     Solo se cambian los ET que estan en tirada de %d o mas seguidos.' % MIN_BLOQUE)
    print('     Los ET sueltos del juego normal NO se tocan.')
    print('     De cada archivo queda una copia .antes-highset')
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
    hechos = 0
    for f, n, cabeza, nuevo in plan:
        try:
            resp = f + '.antes-highset'
            if not os.path.exists(resp):
                shutil.copy2(f, resp)
            io.open(f, 'w', encoding='latin-1', errors='replace').write(cabeza + nuevo)
            hechos += n
            print('     %-46s %4d convertidos' % (os.path.basename(f)[:46], n))
        except Exception as e:
            print('     %-46s ERROR: %s' % (os.path.basename(f)[:46], str(e)[:40]))

    print()
    print('  ' + '-' * 68)
    print('     %d armados convertidos.' % hechos)
    print()
    print('     AHORA CORRE HACER_TODO para que la tabla de High Set los tome.')
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
