# -*- coding: utf-8 -*-
"""
LIMPIAR_VIDEOS_FANTASMA.py
==========================

Que la pantalla "Cargar videos" no liste partidos ni entrenamientos cuyo
.dvw ya no existe.

── EL PROBLEMA ───────────────────────────────────────────────────────────────
build_video.py hace un "merge seguro": lee lo que ya habia y solo agrega lo
nuevo.

    existentes = load_existing_season(...)
    for code, m in partidos:
        if code not in existentes:
            agregar

Nunca saca lo que dejo de existir. Por eso seguia apareciendo
"AXPO NAFELS vs Campana" —una prueba del 30/07— aunque su .dvw ya no este
en la carpeta.

Es el mismo patron que ya se corrigio en el motor de estadisticas: ahi la
base tambien acumulaba y nunca limpiaba.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Antes de guardar, se sacan las entradas cuyo .dvw ya no esta en la carpeta.
Lo que sigue existiendo se conserva igual que antes, con su link de video.

Asi borrar un .dvw alcanza para que desaparezca de todos lados.
"""

import io
import os
import re
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ARCH = os.path.join(AQUI, 'build_video.py')


def main():
    print()
    print('  ' + '=' * 62)
    print('     VIDEOS DE SESIONES QUE YA NO EXISTEN')
    print('  ' + '=' * 62)
    print()

    if not os.path.exists(ARCH):
        print('     No encontre build_video.py en esta carpeta.')
        print()
        return 1

    s = io.open(ARCH, encoding='utf-8', errors='replace').read()

    if '_ARCHIVOS_QUE_EXISTEN' in s:
        print('  ' + '-' * 62)
        print('     Ya estaba puesto.')
        print()
        return 0

    m = re.search(r'^( *)existentes=load_existing_season\(season_out\)', s, re.M)
    if not m:
        print('     El archivo tiene otra forma: no lo toco.')
        print()
        return 1

    print('     La pantalla lista sesiones cuyo .dvw ya no esta.')
    print('     Despues de esto, borrar el archivo alcanza para que')
    print('     desaparezca de todos lados.')
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

    ind = m.group(1)
    nuevo = (m.group(0) + '\n' +
             ind + '# Sacar lo que ya no existe: el merge de arriba conserva todo lo\n' +
             ind + '# anterior, asi que una sesion borrada de la carpeta seguia\n' +
             ind + '# apareciendo en "Cargar videos" para siempre.\n' +
             ind + 'try:\n' +
             ind + '    _ARCHIVOS_QUE_EXISTEN = set(por_temp[season].keys())\n' +
             ind + '    _fuera = [c for c in list(existentes.keys())\n' +
             ind + '              if c not in _ARCHIVOS_QUE_EXISTEN]\n' +
             ind + '    for _c in _fuera:\n' +
             ind + '        existentes.pop(_c, None)\n' +
             ind + '    if _fuera:\n' +
             ind + "        print('   Saque %d sesion(es) de la lista de videos: su .dvw ya no esta.' % len(_fuera))\n" +
             ind + 'except Exception:\n' +
             ind + '    pass')
    s = s.replace(m.group(0), nuevo, 1)

    resp = ARCH + '.antes-fantasma'
    if not os.path.exists(resp):
        try:
            shutil.copy2(ARCH, resp)
        except Exception:
            pass
    io.open(ARCH, 'w', encoding='utf-8').write(s)

    print()
    print('       build_video.py           listo')
    print()
    print('  ' + '-' * 62)
    print('     Corre HACER_TODO.bat')
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
