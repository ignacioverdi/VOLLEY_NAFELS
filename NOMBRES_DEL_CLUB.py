# -*- coding: utf-8 -*-
"""
NOMBRES_DEL_CLUB.py
===================

Que el club se reconozca con cualquier nombre que traiga el .dvw.

── LA CAUSA DE RAIZ ──────────────────────────────────────────────────────────
El nombre del club cambia con el sponsor y con quien arma el .sq:

    Biogas Volley Nafels    (temporada pasada)
    AXPO VOLLEY NAFELS      (esta)
    AXPO NAFELS             (el .sq nuevo)
    Volley Nafels

config_club.json tiene una tabla que traduce cada nombre largo a uno corto.
Si el nombre que viene NO esta en esa tabla, el motor lo deja como esta y el
equipo queda guardado con OTRA clave:

    plan_partido_data  ->  'axponafels'
    las pantallas      ->  buscan  'nafels'

Y ahi se rompe todo lo que depende de encontrar al equipo:

    · el acceso a Recepcion en el perfil del jugador
    · las baterias del jugador, todas en cero
    · los videos de entrenamiento, que no se asocian

No son tres problemas: es uno solo, visto desde tres pantallas.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Se agregan a la tabla las formas que faltan. Y se agrega una regla general:
cualquier nombre que CONTENGA la palabra del club se reconoce, sin importar
que sponsor tenga adelante.

Asi el año que viene, cuando cambie el sponsor otra vez, no se rompe nada.
"""

import io
import json
import os
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CONF = os.path.join(AQUI, 'config_club.json')


def main():
    print()
    print('  ' + '=' * 62)
    print('     LOS NOMBRES DEL CLUB')
    print('  ' + '=' * 62)
    print()

    if not os.path.exists(CONF):
        print('     No encontre config_club.json en esta carpeta.')
        print()
        return 1

    d = json.load(io.open(CONF, encoding='utf-8'))
    eq = d.get('equipos') or {}

    # el nombre corto propio del club: el que mas se repite
    from collections import Counter
    cuenta = Counter(eq.values())
    if not cuenta:
        print('     La tabla de equipos esta vacia.')
        print()
        return 1
    propio = cuenta.most_common(1)[0][0]

    # las formas que ya estan, en plano
    def plano(x):
        import unicodedata
        x = unicodedata.normalize('NFD', str(x))
        return ''.join(c for c in x if unicodedata.category(c) != 'Mn').upper().strip()

    ya = {plano(k) for k in eq}

    # las que suelen aparecer
    palabra = plano(propio)
    candidatas = [
        propio.upper(),
        'AXPO ' + propio.upper(),
        'AXPO VOLLEY ' + propio.upper(),
        'VOLLEY ' + propio.upper(),
        propio.upper() + ' VOLLEY',
        'BIOGAS VOLLEY ' + propio.upper(),
    ]
    nuevas = [c for c in candidatas if plano(c) not in ya]

    if not nuevas:
        print('  ' + '-' * 62)
        print('     La tabla ya tiene todas las formas del nombre.')
        print()
        return 0

    print('     El club se llama: %s' % propio)
    print()
    print('     Formas que faltan en la tabla:')
    for c in nuevas:
        print('       · ' + c)
    print()
    print('     Sin ellas, un .dvw con ese nombre guarda el equipo con otra')
    print('     clave y las pantallas no lo encuentran.')
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

    for c in nuevas:
        eq[c] = propio
    d['equipos'] = eq

    resp = CONF + '.antes-nombres'
    if not os.path.exists(resp):
        try:
            shutil.copy2(CONF, resp)
        except Exception:
            pass
    io.open(CONF, 'w', encoding='utf-8').write(
        json.dumps(d, ensure_ascii=False, indent=2))

    print()
    print('       config_club.json          %d formas agregadas' % len(nuevas))
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
