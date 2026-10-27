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

Las fechas que se numeran son las de la LIGA. Los amistosos, la Supercopa y
los archivos sin fecha en el nombre quedan afuera: salen listados aparte,
con el motivo, y no entran en ninguna placa de fecha ni en el acumulado.
"""
import datetime, json, pathlib, re

RX_NUM = re.compile(r'#\s*(\d{1,2})')
RX_DIA = re.compile(r'(\d{4})-(\d{2})-(\d{2})')


# ══ LOS AMISTOSOS Y LA SUPERCOPA NO LLEVAN NUMERO DE FECHA ══════════════
# La numeracion salia de contar fines de semana, y contaba TODO. Con la
# carpeta de la 26-27 daba esto:
#
#     fecha 1   25/09 - 28/09   2 partidos   amistosos
#     fecha 2   30/09 - 04/10   3 partidos   amistosos
#     fecha 3   19/09           3 partidos   amistosos
#     fecha 4   07/10 - 09/10   3 partidos   amistosos
#     fecha 5   15/10 - 20/10   6 partidos   1 amistoso + Supercopa + fecha 1
#     fecha 6   24/10           4 partidos   la fecha 2 de la liga
#
# O sea: la placa de la fecha 2 iba a salir diciendo "ROUND 6", y la de la
# fecha 1 iba a salir con seis partidos que no son una fecha.
#
# El dato para arreglarlo ya existe y es el MISMO que usa el motor de la
# app: fases_temporada.json dice desde que dia empieza lo oficial y cuales
# son los dias de Supercopa. Lo que queda afuera no se pierde: se lista
# aparte con el motivo, y la Supercopa ya tiene su propio supercup.py.
#
# Si el archivo no esta, o ninguna temporada suya alcanza a estos partidos,
# no se filtra nada y la numeracion queda exactamente como antes.
_FASES = {}
_MOTIVO = {}          # ruta -> por que ese archivo quedo afuera


def _lee_fases(carpeta):
    """fases_temporada.json, buscado al lado de la carpeta de .dvw."""
    clave = str(carpeta)
    if clave in _FASES:
        return _FASES[clave]
    cfg = {}
    for base in (carpeta.parent, carpeta.parent.parent,
                 pathlib.Path(__file__).resolve().parent.parent):
        try:
            f = base / 'fases_temporada.json'
            if f.is_file():
                cfg = json.loads(f.read_text(encoding='utf-8')) or {}
                break
        except Exception:
            cfg = {}
    _FASES[clave] = cfg
    return cfg


def _fecha_txt(s):
    try:
        return datetime.date(*map(int, str(s)[:10].split('-')))
    except Exception:
        return None


def fases_de(carpeta, dias):
    """(oficial_desde, {dias de Supercopa}) para los partidos de esa carpeta.

    De todas las temporadas del archivo elige la del 'oficial_desde' mas
    nuevo que no sea posterior al ultimo partido de la carpeta. Asi no hace
    falta pasarle el nombre de la temporada ni mantener dos formatos: aca se
    escribe '26-27' y en el json '2026/27', y nadie se tiene que acordar.
    """
    cfg = _lee_fases(pathlib.Path(carpeta).resolve())
    if not isinstance(cfg, dict) or not dias:
        return None, set()
    ultimo, mejor = max(dias), None
    for _, v in cfg.items():
        if not isinstance(v, dict):
            continue
        d = _fecha_txt(v.get('oficial_desde'))
        if d and d <= ultimo and (mejor is None or d > mejor[0]):
            mejor = (d, v)
    if not mejor:
        return None, set()
    sc = set()
    for z in (mejor[1].get('supercopa') or []):
        x = _fecha_txt(z)
        if x:
            sc.add(x)
    return mejor[0], sc


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
    archivos = sorted(carpeta.glob('*.dvw'))
    dias = [d for d in (_dia(f.name) for f in archivos) if d]
    desde, supercopa = fases_de(carpeta, dias)

    grupos, sueltos = {}, []
    for f in archivos:
        d = _dia(f.name)
        if d is None:
            _MOTIVO[str(f)] = 'sin fecha en el nombre'
            sueltos.append(f)
            continue
        if desde and d < desde:
            _MOTIVO[str(f)] = 'amistoso de pretemporada'
            sueltos.append(f)
            continue
        if d in supercopa:
            _MOTIVO[str(f)] = 'Supercopa'
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


def ultima(carpeta):
    """El número de la última fecha que hay en la carpeta, o None.

    Sirve para no tener que escribirlo: el lunes la última fecha es la del
    domingo, siempre."""
    grupos, _ = detectar(carpeta)
    return max((x['n'] for x in grupos), default=None)


def archivos_de(carpeta, fecha=None, hasta=None):
    """Los .dvw de una fecha, o de todas hasta una, o todos."""
    grupos, sueltos = detectar(carpeta)
    # 'ultima' o '.' = la última que haya; así el .bat puede aceptar Enter
    if str(fecha).strip().lower() in ('ultima', 'última', '.', 'last'):
        fecha = max((x['n'] for x in grupos), default=None)
    if fecha:
        g = [x for x in grupos if x['n'] == int(fecha)]
        if not g:
            return None, grupos, sueltos
        return list(g[0]['archivos']), grupos, sueltos
    # El acumulado es de LIGA. Antes sumaba tambien los sueltos, que cuando
    # esto se escribio eran solo los archivos sin fecha en el nombre; ahora
    # ahi caen los amistosos y la Supercopa, y una placa que diga "la
    # temporada" no puede estar contando partidos de septiembre.
    if hasta:
        arch = []
        for x in grupos:
            if x['n'] <= int(hasta):
                arch += x['archivos']
        return arch, grupos, sueltos
    return sorted(f for x in grupos for f in x['archivos']), grupos, sueltos


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
        out.append('%d archivos fuera de las fechas de liga '
                   '(no entran en ninguna placa):' % len(sueltos))
        for f in sueltos:
            out.append('  %-52s %s' % (f.name, _MOTIVO.get(str(f), '')))
    return '\n'.join(out)
