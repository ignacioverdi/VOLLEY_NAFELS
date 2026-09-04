# -*- coding: utf-8 -*-
"""
LIMPIAR_SESIONES_FANTASMA.py
============================

Que la base no conserve partidos ni entrenamientos cuyo .dvw ya no existe.

── EL PROBLEMA ───────────────────────────────────────────────────────────────
El motor acumula: lee la base anterior, agrega lo nuevo y guarda todo junto.

    games_log = db.get('games', [])       # lo que ya habia
    if fname in existing_dates: continue  # lo que ya estaba, se saltea
    db_out = {'games': games_log}         # se guarda todo

Nunca saca lo que dejo de existir. Si se borra un .dvw de la carpeta, su
sesion queda para siempre en la base y sigue apareciendo en la app.

Fue lo que paso con "AXPO NAFELS vs Campana" —una prueba— y con la sesion
del 30/07: no estan en la carpeta pero seguian mostrandose, con jugadores
que nunca participaron.

Es el mismo patron que hizo que un partido corregido no se actualizara.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Antes de guardar, se sacan de la base las sesiones cuyo archivo ya no esta
en la carpeta. Lo que sigue existiendo no se toca.

Asi la base es siempre un reflejo de la carpeta, y borrar un .dvw alcanza
para que desaparezca de la app.
"""

import io
import os
import re
import shutil
import sys
import glob

AQUI = os.path.dirname(os.path.abspath(__file__))

VIEJO = "    db_out = {'teams': teams_data, 'games': games_log}"

NUEVO = """    # ── SACAR LAS SESIONES CUYO .dvw YA NO EXISTE ────────────────────
    # El motor acumula: si se borra un archivo de la carpeta, su sesion
    # quedaba en la base para siempre y seguia apareciendo en la app, con
    # jugadores que no participaron.
    #
    # Aca la base se pone al dia con la carpeta: lo que ya no esta, sale.
    try:
        _en_carpeta = set(os.listdir(dvw_dir))
        _antes = len(games_log)
        games_log = [g for g in games_log if g.get('file') in _en_carpeta]
        _fuera = _antes - len(games_log)
        if _fuera:
            print('   Saque %d sesion(es) de la base: su .dvw ya no esta en la carpeta.' % _fuera)
    except Exception as _e:
        print('   (aviso: no pude revisar la carpeta, dejo la base como estaba)')

    db_out = {'teams': teams_data, 'games': games_log}"""


def main():
    print()
    print('  ' + '=' * 62)
    print('     SESIONES QUE YA NO EXISTEN')
    print('  ' + '=' * 62)
    print()

    motores = sorted(glob.glob(os.path.join(AQUI, 'update_db*.py')))
    tocar = []
    for m in motores:
        s = io.open(m, encoding='utf-8', errors='replace').read()
        if "db_out = {'teams': teams_data, 'games': games_log}" in s and '_en_carpeta' not in s:
            tocar.append(os.path.basename(m))

    if not tocar:
        print('  ' + '-' * 62)
        print('     Ya estaba (o los motores guardan de otra forma).')
        print()
        return 0

    print('     Motores a corregir:')
    for f in tocar:
        print('       · ' + f)
    print()
    print('     Despues de esto, borrar un .dvw de la carpeta alcanza para')
    print('     que su sesion desaparezca de la app.')
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

        m = re.search(r'^( *)db_out = \{\'teams\': teams_data, \'games\': games_log\}', s, re.M)
        if not m:
            print('       %-36s no pude ubicarlo' % f)
            continue

        ind = m.group(1)
        nuevo = '\n'.join((ind + l[4:]) if l.startswith('    ') else (ind + l if l.strip() else '')
                          for l in NUEVO.split('\n'))
        s = s.replace(m.group(0), nuevo, 1)

        resp = ruta + '.antes-fantasma'
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
