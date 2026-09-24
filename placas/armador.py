#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Distribución del armador por rotación, como la pantalla del sistema.

La rotación ES la posición del armador: viene en los campos 10 y 11 de la
línea del [3SCOUT] (sc[9] local, sc[10] visitante), no hay campo 'rotación'.
Eso lo confirma update_db_nafels_FULL.py:2153, que arma la etiqueta como
'P' + str(pos).

De cada ataque se toma la ZONA DE SALIDA, que es desde donde se remato el
balon que puso el armador: z4 punta, z3 central, z2 opuesto, y z7/z8/z9 los
tres ataques de zaga (zaga izquierda, pipe y zaga derecha).

K1 CON RECEPCION POSITIVA
-------------------------
Por defecto solo cuenta el ataque de K1 (side-out) nacido de una recepcion
# o +. Es lo que mira un entrenador: que elige el armador CUANDO TIENE TODAS
LAS OPCIONES ABIERTAS. El K1 de emergencia y el K2 (transicion) responden a
otra logica, y promediarlos borra el patron.

La regla del cruce recepcion->ataque es la misma que usa baterias_engine:
la recepcion vale solo para el PRIMER ataque del equipo despues de recibir, y
si el rival toca el balon en el medio (A/D/E/B) o hay un free ball, ese
ataque ya es K2 y no cuenta.
"""
import collections, glob, os, sys

GRILLA = [4, 3, 2, 7, 8, 9, 5, 6, 1]
ROTACIONES = ['P4', 'P3', 'P2', 'P5', 'P6', 'P1']   # el orden de la pantalla

# Color y nombre por zona de SALIDA del ataque: quién remató esa pelota.
#
# Las zonas de ataque de DataVolley no son las seis de la rotación. Las de
# primera línea son 4-3-2 y las de zaga son 7-8-9:
#
#   z4 punta   z3 central   z2 opuesto
#   z7 zaga izquierda   z8 pipe   z9 zaga derecha
#
# Estaban mal agrupadas: la z8, que es el pipe, iba con la zaga genérica, y
# la z7, que es un ataque de zaga hecho y derecho, caía en "Otra".
COLOR_ZONA = {4: '#22C55E', 3: '#F59E0B', 2: '#F97316',
              7: '#6366F1', 8: '#A78BFA', 9: '#818CF8',
              1: '#64748B', 6: '#64748B', 5: '#64748B'}
ETIQUETA_ZONA = {4: 'Punta (z4)', 3: 'Central (z3)', 2: 'Opuesto (z2)',
                 7: 'Zaga izq. (z7)', 8: 'Pipe (z8)', 9: 'Zaga der. (z9)',
                 1: 'Otra', 6: 'Otra', 5: 'Otra'}


def _motor(repo):
    # absoluto a proposito: con una ruta relativa como '..' el import se
    # rompe apenas hacemos chdir, porque sys.path deja de resolver
    repo = os.path.abspath(repo)
    if repo not in sys.path:
        sys.path.insert(0, repo)
    cwd = os.getcwd(); os.chdir(repo)
    try:
        import gen_liga_stats
    finally:
        os.chdir(cwd)
    return gen_liga_stats


def por_rotacion(repo, carpeta, equipo_buscado, archivos=None, rec='#+'):
    """{ 'P4': {zona: {'tot':n,'pt':n}}, ... } para un equipo de la liga.

    `rec` filtra por calidad de la recepcion previa: '#+' (lo habitual),
    '#' sola, o '' para no filtrar nada."""
    gl = _motor(repo)
    acum = {r: collections.defaultdict(lambda: {'tot': 0, 'pt': 0}) for r in ROTACIONES}
    partidos = 0
    lista = [str(x) for x in archivos] if archivos is not None else \
        sorted(glob.glob(os.path.join(repo, carpeta, '*.dvw')))
    for fn in lista:
        try:
            lineas = gl.read_lines(fn)
            local, visita = [gl.norm(x) for x in gl.get_teams(lineas)]
            scout = gl.get_scout(lineas)
        except Exception:
            continue
        lados = [(local, '*', 9), (visita, 'a', 10)]
        if equipo_buscado not in (local, visita):
            continue
        partidos += 1
        for eq, pfx, idx_pos in lados:
            if eq != equipo_buscado:
                continue
            ult_rec, rec_vale = None, False
            for l in scout:
                sc = l.split(';')
                cod = sc[0].strip()
                if len(cod) < 6 or cod[0] not in '*a':
                    continue
                cuerpo = cod[1:]
                if not cuerpo[:2].isdigit():
                    continue
                sk, ev = cuerpo[2], cuerpo[4]
                mio = cod[0] == pfx

                # estado del rally, igual que baterias_engine
                if sk == 'S':
                    ult_rec, rec_vale = None, False
                    continue
                if sk == 'R':
                    if mio:
                        ult_rec, rec_vale = ev, True
                    continue
                if sk == 'F' or (not mio and sk in 'ADEB'):
                    ult_rec, rec_vale = None, False   # ya es transición
                    continue
                if sk != 'A' or not mio:
                    continue
                if rec and not (rec_vale and ult_rec in rec):
                    ult_rec, rec_vale = None, False
                    continue
                ult_rec, rec_vale = None, False       # solo el primer ataque
                # zona de salida: primer dígito del grupo de trayectoria
                resto = cuerpo[5:].split('~')
                traj = resto[1] if len(resto) > 1 else ''
                if not traj or not traj[0].isdigit():
                    continue
                z = int(traj[0])
                if z < 1 or z > 9:
                    continue
                if len(sc) <= idx_pos or not sc[idx_pos].strip().isdigit():
                    continue
                pos = int(sc[idx_pos].strip())
                if pos < 1 or pos > 6:
                    continue
                cel = acum['P%d' % pos][z]
                cel['tot'] += 1
                if ev == '#':
                    cel['pt'] += 1
    return acum, partidos


def a_placa(acum):
    """Arma las seis canchitas con número, % de distribución y % de punto."""
    out = []
    for r in ROTACIONES:
        zonas = acum[r]
        total = sum(c['tot'] for c in zonas.values())
        celdas = []
        for z in GRILLA:
            c = zonas.get(z, {'tot': 0, 'pt': 0})
            celdas.append({
                'z': z, 'n': c['tot'],
                'dist': round(100.0 * c['tot'] / total) if total and c['tot'] else 0,
                'pto': round(100.0 * c['pt'] / c['tot']) if c['tot'] else 0,
                'color': COLOR_ZONA.get(z, '#64748B')})
        out.append({'rot': r, 'total': total, 'celdas': celdas})
    return out


def leyenda(placa):
    """Las zonas que de verdad aparecen, para no poner una leyenda de relleno."""
    vistos, orden = {}, []
    for r in placa:
        for c in r['celdas']:
            if c['n'] and c['z'] not in vistos:
                vistos[c['z']] = (ETIQUETA_ZONA.get(c['z'], 'z%d' % c['z']), c['color'])
                orden.append(c['z'])
    fuera, out = set(), []
    for z in sorted(orden, key=lambda z: GRILLA.index(z)):
        et, col = vistos[z]
        if et in fuera:
            continue
        fuera.add(et)
        out.append((et, col))
    return out
