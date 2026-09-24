#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Guarda los números de cada fecha, para poder mirar la temporada.

POR QUÉ EXISTE
--------------
Cada vez que se corren las placas, los números de esa fecha se calculan y se
tiran. La fecha siguiente pisa a la anterior. Eso significa que la evolución
de un jugador a lo largo del año no existe en ningún lado, y no se puede
recuperar después: los datos de la fecha 1 solo existen si alguien los
guardó en la fecha 1.

Este archivo los guarda. Con tres o cuatro fechas ya se puede poner la línea
de tendencia al lado del número grande, el side-out de cada equipo fecha a
fecha, y "el jugador que más creció".

QUÉ GUARDA
----------
Un registro por fecha, con:
  · qué partidos entraron (para no contar dos veces)
  · por jugador: volumen y eficacia de cada fundamento
  · por equipo: side-out y break, global y por rotación

NO guarda nada que no se pueda recalcular desde los .dvw: si el archivo se
borra, se rehace corriendo las fechas de nuevo. Es una comodidad, no una
fuente de verdad.
"""
import json, pathlib

import liga

ARCHIVO = 'historial.json'
VERSION = 1
FUNDAMENTOS = ['saque', 'recepcion', 'ataque', 'bloqueo']


def _ruta(carpeta=None):
    return pathlib.Path(carpeta or '.') / ARCHIVO


def leer(carpeta=None):
    p = _ruta(carpeta)
    if not p.exists():
        return {'v': VERSION, 'fechas': {}}
    try:
        d = json.loads(p.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {'v': VERSION, 'fechas': {}}
    if d.get('v') != VERSION:
        return {'v': VERSION, 'fechas': {}}
    d.setdefault('fechas', {})
    return d


def guardar(clave, temporada, archivos, EQ, NOM, rot=None, carpeta=None):
    """Escribe (o pisa) el registro de una fecha.

    `clave` es algo como '26-27/fecha-03'. Se pisa a propósito: si volvés a
    correr la misma fecha porque llegó un partido que faltaba, el registro
    tiene que quedar con los cuatro partidos, no con los tres de antes.
    """
    d = leer(carpeta)
    jug = {}
    for eq, dd in EQ.items():
        for dor, J in dd['jug'].items():
            ef = liga.eficacias(J)
            fila = {}
            for f in FUNDAMENTOS:
                t = J[f]['T']
                if t:
                    fila[f] = [t, ef.get(f)]
            if not fila:
                continue
            nom = ''
            if NOM and (eq, dor) in NOM:
                nom = NOM[(eq, dor)][0]
            jug['%s|%s' % (eq, dor)] = {'n': nom, 'f': fila}

    equipos = {}
    for e in (rot or []):
        equipos[e['equipo']] = {
            'so': e['so'], 'so_n': e['so_n'], 'bp': e['bp'], 'bp_n': e['bp_n'],
            'rot': {c['rot']: [c['pct'], c['n']] for c in e['celdas']}}

    d['fechas'][clave] = {
        'temporada': temporada,
        'partidos': sorted(pathlib.Path(str(x)).name for x in archivos),
        'jugadores': jug, 'equipos': equipos}
    _ruta(carpeta).write_text(
        json.dumps(d, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    return len(d['fechas'])


def _ordenadas(d, temporada):
    """Las fechas de esa temporada, en orden, solo las que son 'fecha-NN'."""
    out = []
    for k, v in d.get('fechas', {}).items():
        if v.get('temporada') != temporada or '/fecha-' not in k:
            continue
        try:
            n = int(k.rsplit('-', 1)[1])
        except ValueError:
            continue
        out.append((n, k, v))
    out.sort()
    return out


def serie(temporada, equipo, dorsal, fund, carpeta=None, hasta=None):
    """La eficacia de un jugador en ese fundamento, fecha a fecha.

    Devuelve [(nro de fecha, valor)] salteando las fechas en las que no
    jugó. Sin al menos tres puntos no hay tendencia que mostrar."""
    d = leer(carpeta)
    k = '%s|%s' % (equipo, dorsal)
    out = []
    for n, _clave, v in _ordenadas(d, temporada):
        if hasta and n > int(hasta):
            continue
        f = (v.get('jugadores', {}).get(k) or {}).get('f', {})
        if fund in f and f[fund][1] is not None:
            out.append((n, f[fund][1]))
    return out


def serie_equipo(temporada, equipo, campo='so', carpeta=None):
    d = leer(carpeta)
    out = []
    for n, _clave, v in _ordenadas(d, temporada):
        e = v.get('equipos', {}).get(equipo)
        if e and e.get(campo) is not None:
            out.append((n, e[campo]))
    return out


def resumen(carpeta=None):
    d = leer(carpeta)
    if not d['fechas']:
        return 'El historial está vacío: se llena solo cada vez que corrés una fecha.'
    L = ['%d fechas guardadas:' % len(d['fechas'])]
    for k in sorted(d['fechas']):
        v = d['fechas'][k]
        L.append('   %-20s %d partidos · %d jugadores · %d equipos'
                 % (k, len(v.get('partidos', [])), len(v.get('jugadores', {})),
                    len(v.get('equipos', {}))))
    return '\n'.join(L)


if __name__ == '__main__':
    print(resumen())
