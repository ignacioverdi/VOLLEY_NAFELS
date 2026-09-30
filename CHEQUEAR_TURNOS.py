# -*- coding: utf-8 -*-
# ============================================================================
#  CHEQUEAR_TURNOS.py
# ----------------------------------------------------------------------------
#  Un control, no un motor: no genera ni cambia nada.
#
#  Mira liga_data_entrenamientos.js y dice, por sesion, la fecha, el turno y
#  cuantos armados tiene cada armador. Sirve para confirmar que la manana y la
#  tarde de un mismo dia quedaron SEPARADAS. Cuando quedaban juntas, la tarde
#  aparecia vacia en Distribucion del armador.
#
#  Imprime solo fechas, turnos y cantidades. Ningun nombre de jugador y ningun
#  dato del club, asi que el log se puede mirar de afuera sin problema.
# ============================================================================
import io, json, os, sys
from collections import Counter

ARCH = 'liga_data_entrenamientos.js'

def main():
    if not os.path.exists(ARCH):
        print('   no encuentro %s (se genera en el paso anterior)' % ARCH)
        return 1
    with io.open(ARCH, encoding='utf-8', errors='replace') as f:
        t = f.read()
    try:
        d = json.loads(t[t.index('=') + 1:].strip().rstrip(';'))
    except Exception as e:
        print('   no pude leer %s: %s' % (ARCH, e))
        return 1

    problemas = 0
    for slug, td in sorted((d.get('teams') or {}).items()):
        ses = td.get('matches') or []
        arm = td.get('setters') or []
        if not ses or not arm:
            continue
        print('   equipo %s: %d sesiones, %d armadores' % (slug, len(ses), len(arm)))
        con_turno = sum(1 for s in ses if 'turno' in s)
        if con_turno != len(ses):
            print('   [ATENCION] %d de %d sesiones NO traen turno: el motor viejo'
                  ' quedo sin actualizar.' % (len(ses) - con_turno, len(ses)))
            problemas += 1
        cuentas = {}
        for a in arm:
            c = Counter(r[12] for r in (a.get('s') or []))
            cuentas[a.get('num')] = c
        for i, s in enumerate(ses):
            tn = s.get('turno', '?')
            etiqueta = {'M': 'manana', 'T': 'tarde', '': 'sin marca'}.get(tn, tn)
            detalle = ' · '.join('#%s: %d' % (n, c.get(i, 0))
                                 for n, c in sorted(cuentas.items(), key=lambda x: str(x[0])))
            print('      %s  %-10s  %s' % (s.get('date', '?'), etiqueta, detalle))
        # dos sesiones con la MISMA fecha y el MISMO turno no se pueden separar
        repes = [k for k, v in Counter((s.get('date', ''), s.get('turno', ''))
                                       for s in ses).items() if v > 1]
        if repes:
            print('   [ATENCION] hay sesiones con la misma fecha Y el mismo turno: %s' % repes)
            print('              renombra un .dvw con -M o -T al final para separarlas.')
            problemas += 1
    problemas += revisar_plan_partido()
    if problemas == 0:
        print('   OK: las dos puntas dicen lo mismo. Cada sesion tiene su turno.')
    return 0


def revisar_plan_partido():
    """El otro extremo del camino.

    liga_data dice a que sesion pertenece cada armado; plan_partido_data dice
    que sesiones existen y como se llaman. Si una punta trae el turno y la otra
    no, no se pueden juntar y la pantalla queda vacia. Aca se confirma que las
    dos lo traen.

    Solo imprime cantidades y fechas. Ningun nombre de jugador.
    """
    arch = 'plan_partido_data.js'
    if not os.path.exists(arch):
        print('   (no miro plan_partido_data.js: esta cifrado, es lo normal fuera'
              ' de una corrida)')
        return 0
    with io.open(arch, encoding='utf-8', errors='replace') as f:
        t = f.read()
    try:
        d = json.loads(t[t.index('=') + 1:].strip().rstrip(';'))
    except Exception as e:
        print('   no pude leer %s: %s' % (arch, e))
        return 1
    equipos = d if isinstance(d, dict) else {}
    total = con = 0
    fechas = Counter()
    for _slug, D in equipos.items():
        info = (D or {}).get('info') if isinstance(D, dict) else None
        if not isinstance(info, dict):
            continue
        for _mid, meta in info.items():
            if not isinstance(meta, dict):
                continue
            if (meta.get('tipo') or '') != 'entrenamiento':
                continue
            total += 1
            if 'turno' in meta:
                con += 1
            fechas[(meta.get('date', '?'), meta.get('turno', '?'))] += 1
    if not total:
        print('   plan_partido_data: no hay entrenamientos cargados.')
        return 0
    print('   plan_partido_data: %d sesiones de entrenamiento, %d con turno' % (total, con))
    repetidas = sorted(d for d, _t in fechas if sum(
        v for (dd, _tt), v in fechas.items() if dd == d) > 1)
    for f_ in sorted(set(repetidas)):
        turnos = sorted(tt for (dd, tt) in fechas if dd == f_)
        print('      %s tiene %d sesiones, turnos: %s' % (f_, len(turnos), turnos))
        if len(set(turnos)) < len(turnos):
            print('      [ATENCION] dos sesiones de ese dia con el mismo turno.')
            return 1
    if con != total:
        print('   [ATENCION] %d sesiones sin turno en plan_partido_data:'
              ' falta correr gen_plan_partido.' % (total - con))
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
