#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""De qué fecha es cada .dvw.

El .dvw NO trae el número de fecha adentro. Sale del nombre del archivo, y
hay dos caminos:

  1. Algun archivo del fin de semana trae "#03"  ->  esa es la fecha de TODO
     ese fin de semana, exacta, sin adivinar. Alcanza con numerar uno.
     Ej: "&2026-09-19 #03 AXPO NAFELS vs JONA.dvw"

  2. Ninguno lo trae  ->  se agrupa por FIN DE SEMANA: el sabado y el domingo
     van siempre juntos, y cada fecha se identifica por su sabado.
     Ej: "&2025-10-11 636587 AMRI-LUC(VM).dvw"

Por que el fin de semana y no la semana calendario: la semana ISO corta el
lunes, asi que una fecha jugada domingo y lunes quedaria partida en dos.
Y agrupar por "dias cercanos" encadena una fecha con la siguiente cuando hay
partidos entre semana.

Los partidos de entre semana son postergados, no fechas propias: sobre los
95 .dvw fechados de la 25-26, el 80% se jugo sabado o domingo, y los de
miercoles vienen de a uno o dos. Por eso cada uno se engancha al fin de
semana mas cercano, que es la fecha de la que se corrio.

Los archivos sin fecha en el nombre (amistosos, copa) quedan afuera de toda
fecha, pero siguen contando para el acumulado de temporada.
"""
import datetime, pathlib, re

RX_NUM = re.compile(r'#\s*(\d{1,2})')
RX_DIA = re.compile(r'(\d{4})-(\d{2})-(\d{2})')


def _dia(nombre):
    m = RX_DIA.search(nombre)
    if not m:
        return None
    try:
        return datetime.date(*map(int, m.groups()))
    except ValueError:
        return None


def sabado_de(d):
    """El sábado del fin de semana al que pertenece ese partido.

    Sábado y domingo -> su propio fin de semana.
    Los demás días -> el fin de semana más cercano, que es la fecha de la
    que se postergó (o adelantó) ese partido."""
    wd = d.weekday()                       # 0 lunes ... 5 sábado, 6 domingo
    if wd == 5:
        return d
    if wd == 6:
        return d - datetime.timedelta(days=1)
    previo = d - datetime.timedelta(days=(wd + 2))      # sábado anterior
    siguiente = previo + datetime.timedelta(days=7)     # sábado siguiente
    return previo if (d - previo).days <= (siguiente - d).days else siguiente


def detectar(carpeta):
    """[{'n':1,'desde':date,'hasta':date,'archivos':[Path],'como':...}]

    Primero agrupa TODO por fin de semana. Recién después mira si algún
    archivo del grupo trae "#NN": si lo trae, ese número manda para todo el
    fin de semana.

    Por qué así y no al revés: si en un mismo finde hay un archivo con #03 y
    otros dos sin numerar, tratarlos por separado parte la fecha en dos
    (pasaba con los tres .dvw del 19/09/2026).
    """
    carpeta = pathlib.Path(carpeta)
    grupos, sueltos = {}, []
    for f in sorted(carpeta.glob('*.dvw')):
        d = _dia(f.name)
        if d is None:
            sueltos.append(f)
            continue
        grupos.setdefault(sabado_de(d), []).append((d, f))

    out = []
    for sab in sorted(grupos):
        items = grupos[sab]
        ds = [d for d, _ in items]
        # ¿alguno del finde viene numerado a mano?
        nums = sorted({int(RX_NUM.search(f.name).group(1))
                       for _, f in items if RX_NUM.search(f.name)})
        out.append({'n': nums[0] if nums else None,
                    'desde': min(ds), 'hasta': max(ds), 'sabado': sab,
                    'archivos': [f for _, f in items],
                    'como': 'nombre' if nums else 'finde',
                    'conflicto': nums[1:] if len(nums) > 1 else []})

    # numerar los findes sin número, respetando los que sí lo traen
    usados = {x['n'] for x in out if x['n']}
    libre = 1
    for x in sorted(out, key=lambda x: x['desde']):
        if x['n'] is None:
            while libre in usados:
                libre += 1
            x['n'] = libre
            usados.add(libre)
    out.sort(key=lambda x: x['n'])
    return out, sueltos


def archivos_de(carpeta, fecha=None, hasta=None):
    """Los .dvw de una fecha, o de todas hasta una, o todos."""
    grupos, sueltos = detectar(carpeta)
    if fecha:
        g = [x for x in grupos if x['n'] == int(fecha)]
        if not g:
            return None, grupos, sueltos
        return list(g[0]['archivos']), grupos, sueltos
    if hasta:
        arch = []
        for x in grupos:
            if x['n'] <= int(hasta):
                arch += x['archivos']
        return arch + sueltos, grupos, sueltos
    return sorted(pathlib.Path(carpeta).glob('*.dvw')), grupos, sueltos


def resumen(grupos, sueltos):
    out = ['%d fechas detectadas en la carpeta:' % len(grupos)]
    for x in grupos:
        rango = x['desde'].isoformat() if x['desde'] else '?'
        if x['hasta'] and x['hasta'] != x['desde']:
            rango += ' a ' + x['hasta'].isoformat()
        out.append('  fecha %2d  %-24s %2d partidos   (%s)'
                   % (x['n'], rango, len(x['archivos']),
                      'numerada en el archivo' if x['como'] == 'nombre'
                      else 'finde del ' + x['sabado'].strftime('%d/%m')))
        if x.get('conflicto'):
            out.append('            OJO: en ese finde hay archivos con #%s. '
                       'Se usó el #%d.'
                       % (' y #'.join(str(c) for c in x['conflicto']), x['n']))
    if sueltos:
        out.append('')
        out.append('%d archivos sin fecha en el nombre (no entran en ninguna fecha,' % len(sueltos))
        out.append('pero sí en el acumulado de temporada):')
        for f in sueltos:
            out.append('  ' + f.name)
    return '\n'.join(out)
