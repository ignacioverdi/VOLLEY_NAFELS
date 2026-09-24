#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Side-out y break point por rotación. La métrica del vóley profesional.

Todo plan de partido se reduce a lo mismo: encontrar la rotación donde el
rival no sostiene su side-out, y meter ahí al mejor sacador. Y saber cuál es
la propia que se rompe.

DE DÓNDE SALE, EXACTO
---------------------
No se estima. El .dvw trae todo:

  *13SM+~~~16     el saque: el prefijo dice qué equipo sacó
  ...
  *p05:03         el código de punto: el prefijo dice quién GANÓ el rally
                  y el número es el marcador

Y los campos 10 y 11 de cada línea (sc[9] local, sc[10] visitante) traen la
posición del armador, que es la rotación, en ese momento exacto.

  SIDE-OUT  = el que recibe gana el rally.   Se cuenta en la rotación del
              equipo que RECIBE.
  BREAK     = el que saca gana el rally.     Se cuenta en la rotación del
              equipo que SACA.

Los dos son complementarios del rally: side-out del receptor + break del
sacador = 100%. Por eso se miran siempre juntos.

QUÉ NO CUENTA
-------------
Un rally sin saque previo identificable no se cuenta (línea suelta, error de
scout). Es preferible perder un rally a contarlo en la rotación equivocada.
"""
import collections, glob, os, re, sys

ROTACIONES = ['P1', 'P6', 'P5', 'P4', 'P3', 'P2']   # orden de rotación real
RX_PUNTO = re.compile(r'^([*a])p(\d{1,2}):(\d{1,2})$')


def _motor(repo):
    repo = os.path.abspath(repo)
    if repo not in sys.path:
        sys.path.insert(0, repo)
    cwd = os.getcwd(); os.chdir(repo)
    try:
        import gen_liga_stats
    finally:
        os.chdir(cwd)
    return gen_liga_stats


def _nuevo():
    return {r: {'so': [0, 0], 'bp': [0, 0]} for r in ROTACIONES}


def por_equipo(repo, carpeta, archivos=None):
    """{equipo: {'rot': {P1: {'so':[gan,tot],'bp':[gan,tot]}}, 'sets':n}}"""
    gl = _motor(repo)
    EQ = collections.defaultdict(lambda: {'rot': _nuevo(), 'sets': set(),
                                          'partidos': set()})
    lista = [str(x) for x in archivos] if archivos is not None else \
        sorted(glob.glob(os.path.join(repo, carpeta, '*.dvw')))
    for fn in lista:
        try:
            lineas = gl.read_lines(fn)
            local, visita = [gl.norm(x) for x in gl.get_teams(lineas)]
            scout = gl.get_scout(lineas)
        except Exception:
            continue
        if not scout or not local or not visita:
            continue
        saca = None                      # '*' o 'a', quién puso el saque
        for l in scout:
            sc = l.split(';')
            cod = sc[0].strip()
            if len(cod) < 4 or cod[0] not in '*a':
                continue
            cuerpo = cod[1:]
            # el saque abre el rally y fija quién saca
            if cuerpo[:2].isdigit() and len(cuerpo) > 2 and cuerpo[2] == 'S':
                saca = cod[0]
                continue
            m = RX_PUNTO.match(cod)
            if not m:
                continue
            if saca is None:             # rally sin saque identificable
                continue
            gana = m.group(1)
            recibe = 'a' if saca == '*' else '*'
            eq_rec = local if recibe == '*' else visita
            eq_saq = local if saca == '*' else visita
            try:
                rot_rec = int(sc[9 if recibe == '*' else 10])
                rot_saq = int(sc[9 if saca == '*' else 10])
                set_n = int(sc[8])
            except (ValueError, IndexError):
                saca = None
                continue
            for eq in (eq_rec, eq_saq):
                EQ[eq]['partidos'].add(fn)
                if 1 <= set_n <= 5:
                    EQ[eq]['sets'].add((fn, set_n))
            if 1 <= rot_rec <= 6:
                c = EQ[eq_rec]['rot']['P%d' % rot_rec]['so']
                c[1] += 1
                if gana == recibe:
                    c[0] += 1
            if 1 <= rot_saq <= 6:
                c = EQ[eq_saq]['rot']['P%d' % rot_saq]['bp']
                c[1] += 1
                if gana == saca:
                    c[0] += 1
            saca = None
    return {eq: {'rot': d['rot'], 'sets': len(d['sets']),
                 'partidos': len(d['partidos'])}
            for eq, d in EQ.items()}


def _p(c):
    return round(100.0 * c[0] / c[1]) if c[1] else None


def a_placa(datos, minimo=6):
    """Ordena los equipos por side-out global y arma las filas de la placa.

    `minimo` = rallies mínimos por rotación para mostrar el número. Con menos
    se muestra la raya: un 100% de dos rallies engaña más de lo que informa.
    """
    filas = []
    for eq, d in datos.items():
        so_g = sum(d['rot'][r]['so'][0] for r in ROTACIONES)
        so_t = sum(d['rot'][r]['so'][1] for r in ROTACIONES)
        bp_g = sum(d['rot'][r]['bp'][0] for r in ROTACIONES)
        bp_t = sum(d['rot'][r]['bp'][1] for r in ROTACIONES)
        if so_t < minimo * 3:
            continue
        celdas = []
        for r in ROTACIONES:
            c = d['rot'][r]['so']
            celdas.append({'rot': r, 'pct': _p(c) if c[1] >= minimo else None,
                           'n': c[1]})
        # marcar mejor y peor solo si hay una diferencia que signifique algo:
        # con seis rotaciones dentro de cinco puntos, pintar una de verde y
        # otra de rojo inventa una jerarquia que el dato no tiene
        vis = [x['pct'] for x in celdas if x['pct'] is not None]
        vale = bool(vis) and (max(vis) - min(vis)) >= 10
        for x in celdas:
            x['mejor'] = vale and x['pct'] == max(vis)
            x['peor'] = vale and x['pct'] == min(vis)
        filas.append({'equipo': eq, 'so': _p([so_g, so_t]), 'so_n': so_t,
                      'bp': _p([bp_g, bp_t]), 'bp_n': bp_t,
                      'celdas': celdas, 'partidos': d['partidos']})
    filas.sort(key=lambda f: -(f['so'] or 0))
    return filas


def salto_minimo(s):
    """Por debajo de 15 puntos de diferencia no hay conclusion que sacar."""
    return s < 15


def titular(filas):
    """La conclusión de entrenador: dónde conviene sacarle a quién.

    Busca el equipo con la mayor diferencia entre su mejor y su peor
    rotación de side-out: es el que tiene un agujero explotable."""
    mejor = None
    for f in filas:
        vis = [(x['pct'], x['rot']) for x in f['celdas'] if x['pct'] is not None]
        if len(vis) < 4:
            continue
        alto, bajo = max(vis), min(vis)
        salto = alto[0] - bajo[0]
        if mejor is None or salto > mejor[0]:
            mejor = (salto, f['equipo'], bajo, alto)
    if not mejor or salto_minimo(mejor[0]):
        return None
    salto, eq, bajo, alto = mejor
    return ('A %s hay que sacarle en %s: ahí sostiene el %d%% de su side-out, '
            'contra el %d%% de su %s. Son %d puntos de diferencia.'
            % (eq, bajo[1], bajo[0], alto[0], alto[1], salto))
