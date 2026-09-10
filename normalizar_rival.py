# -*- coding: utf-8 -*-
"""
NORMALIZAR EL RIVAL EN LAS ACCIONES YA GUARDADAS
=================================================
Por que hace falta correr esto UNA VEZ

El archivo entrenamientos_nafels_db.json ACUMULA las acciones de cada
jugador y no reescribe las viejas: por eso, aunque el motor ya quedo
arreglado, las acciones que se cargaron ANTES siguen guardando adentro

    "rival": "PRUEBA"      "rival": "CAMPANA"

La lista de equipos y el historial ya salieron limpios porque se
regeneran enteros. Estas no.

Que hace este script: en cada accion, si el rival es uno de los nombres
inventados, lo cambia por el nombre del club. No toca ningun otro dato:
ni el jugador, ni la zona, ni la evaluacion, ni la fecha.

Deja una copia del original con extension .bak antes de escribir.
"""
import io, json, os, shutil, sys

RAIZ = sys.argv[1] if len(sys.argv) > 1 else '.'
DB    = os.path.join(RAIZ, 'entrenamientos_nafels_db.json')
CLUB  = 'Nafels'
FALSOS = ('PRUEBA', 'CAMPANA')


def normalizar(obj, cuenta):
    """Recorre todo y cambia el rival donde sea uno de los inventados."""
    if isinstance(obj, dict):
        r = obj.get('rival')
        if isinstance(r, str) and r.strip().upper() in FALSOS:
            obj['rival'] = CLUB
            cuenta[0] += 1
        for v in obj.values():
            normalizar(v, cuenta)
    elif isinstance(obj, list):
        for v in obj:
            normalizar(v, cuenta)


if __name__ == '__main__':
    if not os.path.exists(DB):
        print('  no encontre %s' % DB)
        raise SystemExit(1)

    shutil.copy2(DB, DB + '.bak')
    d = json.load(io.open(DB, encoding='utf-8'))

    cuenta = [0]
    normalizar(d, cuenta)

    # y por las dudas, los equipos inventados que pudieran quedar
    eq = d.get('teams') or {}
    borrados = [k for k in list(eq.keys()) if k.strip().upper() in FALSOS]
    for k in borrados:
        del eq[k]

    json.dump(d, io.open(DB, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    print('  acciones corregidas : %d' % cuenta[0])
    print('  equipos borrados    : %s' % (', '.join(borrados) or 'ninguno'))
    print('  copia previa        : %s.bak' % os.path.basename(DB))
