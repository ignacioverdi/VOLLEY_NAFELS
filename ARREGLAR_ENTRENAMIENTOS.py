# -*- coding: utf-8 -*-
"""
ARREGLAR_ENTRENAMIENTOS.py
==========================

Que un entrenamiento del equipo contra si mismo registre TODAS las acciones.

── EL PROBLEMA ───────────────────────────────────────────────────────────────
En un entrenamiento los dos lados son el mismo club:

    [3TEAMS]
    AXP;AXPO NAFELS;...
    AXP;AXPO NAFELS;...

El motor procesa los dos lados por separado y guarda asi:

    for team, pfx in [(home,'*'), (away,'a')]:
        ...
        result[team] = {...}

Como los dos equipos se llaman igual, **la segunda vuelta pisa a la primera**.
Y como en un entrenamiento las acciones suelen quedar todas de un lado, el
otro viene vacio y borra lo que habia.

Resultado: de 228 acciones reales quedaban 3.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Cuando los dos lados son el mismo equipo, se procesan JUNTOS: es el plantel
entrenando, no dos rivales. Las acciones de los dos lados se suman en el
mismo jugador, por dorsal.

Si son equipos distintos —un amistoso, un partido— sigue funcionando como
antes.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))

VIEJO = "result[team]={'players':players,'atk':dict(atk),'srv':dict(srv),"

NUEVO = """# Entrenamiento: los dos lados son el mismo equipo.
        # Si home y away se llaman igual, esto es el plantel entrenando
        # contra si mismo. Antes la segunda vuelta pisaba a la primera y
        # se perdian casi todas las acciones (228 quedaban en 3).
        # Ahora se suman: cada jugador junta lo que hizo de los dos lados.
        if team in result:
            _ya = result[team]
            for _k, _nuevo in [('atk',atk),('srv',srv),('rec',rec),('sets',sets),('blk',blk)]:
                _viejo = _ya.get(_k) or {}
                for _n, _acc in dict(_nuevo).items():
                    _viejo[_n] = (_viejo.get(_n) or []) + _acc
                _ya[_k] = _viejo
            for _n, _p in (players or {}).items():
                if _n not in _ya['players']:
                    _ya['players'][_n] = _p
            continue

        result[team]={'players':players,'atk':dict(atk),'srv':dict(srv),"""


def main():
    print()
    print('  ' + '=' * 62)
    print('     ENTRENAMIENTOS: EL EQUIPO CONTRA SI MISMO')
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
        if VIEJO in s and 'Entrenamiento: los dos lados son el mismo equipo' not in s:
            tocar.append(os.path.basename(m))

    if not tocar:
        print('  ' + '-' * 62)
        print('     Ya estaba arreglado (o el motor guarda de otra forma).')
        print()
        return 0

    print('     Motores a corregir:')
    for f in tocar:
        print('       · ' + f)
    print()
    print('     Cuando los dos lados son el mismo equipo, las acciones se')
    print('     suman en vez de pisarse.')
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

        m = re.search(r'^([ \t]*)' + re.escape(VIEJO), s, re.M)
        if not m:
            print('       %-34s no pude ubicarlo' % f)
            continue
        ind = m.group(1)
        # se reindenta el bloque nuevo al nivel que tenia la linea original
        lineas = NUEVO.split('\n')
        base = len(lineas[0]) - len(lineas[0].lstrip())
        nuevo = '\n'.join((ind + l[8:]) if l.startswith('        ') else (ind + l.lstrip() if l.strip() else '')
                          for l in lineas)
        s = s.replace(m.group(0), nuevo, 1)

        resp = ruta + '.antes-entren'
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
