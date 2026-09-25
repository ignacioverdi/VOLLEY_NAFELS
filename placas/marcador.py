#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""El marcador de cada acción y el resultado final del partido.

POR QUÉ
-------
Un ace suelto no dice nada. El mismo ace a 5-3 del primer set y a 23-24 del
quinto son dos acciones distintas, y el que mira el video lo entiende solo si
ve el marcador. Es lo primero que pone la TV arriba de cualquier repetición.

DE DÓNDE SALE
-------------
Del .dvw, sin estimar nada:

  [3TEAMS]   AXP;AXPO NAFELS;2;...      el campo 2 son los sets ganados
             TVR;TV Rottenburg;1;...

  [3SET]     True; 5- 8;11-16;21-19;25-21;23;
             los parciales del set y, al final, el resultado y la duración

  [3SCOUT]   *p18:17    el código de punto: el número es LOCAL:VISITANTE
                        (el prefijo * o a dice quién ganó el rally)

El marcador de una acción es el del código de punto que CIERRA su rally, o
sea el primero que aparece después de la acción. Así el ace que hace el 18-17
se rotula 18-17, igual que en la tele.
"""
import re

RX_PUNTO = re.compile(r'^([*a])p(\d{1,2}):(\d{1,2})$')

# Palabras que no distinguen a nadie: todos los clubes las tienen.
GENERICOS = {'VOLLEY', 'VOLLEYBALL', 'VOLLEYS', 'VOLEY', 'VOLEIBOL', 'CLUB',
             'TV', 'VBC', 'VC', 'SVG', 'SV', 'TS', 'TEAM', 'CA', 'CD', 'CV'}

# Si algún nombre queda raro, se arregla acá y listo. Lo que pongas manda
# sobre todo lo demás: la clave es el nombre tal como viene en el .dvw.
NOMBRE_CORTO = {}

# Los ocho de la Nationalliga A, por el mismo slug con el que se resuelve el
# escudo. El scout escribe el nombre de cada club a su manera —con sponsor,
# con abreviatura, con o sin acento— y el heurístico de abajo acierta casi
# siempre, pero casi no alcanza para una placa que se publica. Esto manda.
POR_SLUG = {
    'nafels': 'NÄFELS',
    'amriswil': 'AMRISWIL',
    'chenois': 'CHÊNOIS',
    'colombier': 'COLOMBIER',
    'jona': 'JONA',
    'lausanne': 'LAUSANNE',
    'schoenenwerd': 'SCHÖNENWERD',
    'stgallen': 'ST. GALLEN',
}


def _slug(s):
    import unicodedata
    s = unicodedata.normalize('NFKD', str(s))
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', s.lower())

LARGO_MAX = 14


def corto(nombre):
    """El nombre para el rótulo: corto, sin sponsor ni palabra de relleno."""
    n = (nombre or '').strip()
    if not n:
        return ''
    if n.upper() in NOMBRE_CORTO:
        return NOMBRE_CORTO[n.upper()]
    if n in NOMBRE_CORTO:
        return NOMBRE_CORTO[n]
    # por slug: 'TV Rottenburg' -> 'tvrottenburg'; se busca el club cuyo slug
    # esté contenido, que es como resuelve los escudos club.escudo_de
    sl = _slug(n)
    for k, v in POR_SLUG.items():
        if k in sl:
            return v
    partes = [p for p in n.upper().replace('.', ' ').split() if p]
    utiles = [p for p in partes if p not in GENERICOS] or partes
    r = ' '.join(utiles)
    if len(r) > LARGO_MAX and len(utiles) > 1:
        r = utiles[-1]          # en los clubes el lugar va casi siempre al final
    return r[:LARGO_MAX + 6]


def _ganados(lineas):
    """Los sets que ganó cada uno, del campo 2 de [3TEAMS]."""
    dentro, out = False, []
    for l in lineas:
        s = l.strip()
        if s.startswith('['):
            dentro = s.upper().startswith('[3TEAMS')
            continue
        if dentro and s:
            c = s.split(';')
            if len(c) > 2 and c[2].strip().isdigit():
                out.append(int(c[2].strip()))
            else:
                out.append(None)
    return (out + [None, None])[:2]


def parciales(lineas):
    """Los sets jugados: [(25,21), (21,25), (25,23)]."""
    dentro, out = False, []
    for l in lineas:
        s = l.strip()
        if s.startswith('['):
            dentro = s.upper().startswith('[3SET')
            continue
        if not dentro or not s:
            continue
        c = [x.strip() for x in s.split(';')]
        # campo 0 = jugado, 1..4 = parciales, 5 = duración.  El resultado del
        # set es el último parcial que tiene algo.
        ult = ''
        for x in c[1:5]:
            if x and '-' in x:
                ult = x
        if not ult:
            continue
        try:
            a, b = [int(y) for y in ult.replace(' ', '').split('-')[:2]]
        except ValueError:
            continue
        out.append((a, b))
    return out


def contexto(lineas, local, visita):
    """Todo lo del partido que hace falta para rotular una acción."""
    sets = parciales(lineas)
    g = _ganados(lineas)
    # Si [3TEAMS] no trae los sets ganados, se cuentan de los parciales.
    if g[0] is None or g[1] is None:
        g = [sum(1 for a, b in sets if a > b), sum(1 for a, b in sets if b > a)]
    cl, cv = corto(local), corto(visita)
    return {'local': local, 'visita': visita, 'corto_l': cl, 'corto_v': cv,
            'sets': (g[0] or 0, g[1] or 0), 'parciales': sets,
            'resultado': '%s %d - %d %s' % (cl, g[0] or 0, g[1] or 0, cv)}


def puntos(scout):
    """[(índice de línea, local, visitante)] de cada punto del partido."""
    out = []
    for i, l in enumerate(scout):
        cod = l.split(';')[0].strip()
        m = RX_PUNTO.match(cod)
        if m:
            out.append((i, int(m.group(2)), int(m.group(3))))
    return out


def cierra_el_rally(pts, i):
    """El marcador con el que termina el rally de la línea `i`.

    Devuelve (local, visitante) o None si la acción quedó sin punto detrás
    (última línea del archivo, error de scout): es preferible no rotular nada
    a rotular un marcador de otro rally.
    """
    for j, a, b in pts:
        if j >= i:
            return (a, b)
    return None


def como_va(ctx, marca, lado):
    """El marcador visto desde el equipo del jugador: 'PROPIO-RIVAL'."""
    if not marca:
        return ''
    a, b = marca
    return '%d-%d' % ((a, b) if lado == '*' else (b, a))


def resultado_visto(ctx, lado):
    """El resultado final, con el equipo del jugador adelante."""
    if not ctx:
        return ''
    l, v = ctx['sets']
    if lado == '*':
        return '%s %d - %d %s' % (ctx['corto_l'], l, v, ctx['corto_v'])
    return '%s %d - %d %s' % (ctx['corto_v'], v, l, ctx['corto_l'])


def ordinal(s):
    import idioma
    try:
        n = int(s)
    except (TypeError, ValueError):
        return ''
    return idioma.v('set_n', n) if 1 <= n <= 5 else ''


# Un punto de vóley solo se anota de tres maneras: rematando, bloqueando o
# sacando. Es el "puntos" de cualquier planilla oficial, y por eso el máximo
# anotador del partido es un dato que no se discute.
PUNTUA = {'A': 'atk', 'B': 'blq', 'S': 'ace'}


def _corto_jug(nom):
    """'Kieran Robinson-Dunning' -> 'K. Robinson-Dunning'."""
    p = (nom or '').split()
    return ('%s. %s' % (p[0][0], ' '.join(p[1:]))) if len(p) > 1 else nom


def anotadores(lineas, scout, local, visita, plantel_de):
    """El que más puntos hizo en el partido, de cada lado.

    plantel_de(seccion) -> {dorsal: (nombre, puesto)}"""
    import collections
    planteles = {'*': plantel_de('3PLAYERS-H'), 'a': plantel_de('3PLAYERS-V')}
    cuenta = collections.defaultdict(lambda: {'atk': 0, 'blq': 0, 'ace': 0})
    for l in scout:
        cod = l.split(';')[0].strip()
        if len(cod) < 6 or cod[0] not in '*a' or not cod[1:3].isdigit():
            continue
        k = PUNTUA.get(cod[3])
        if k and cod[5] == '#':
            cuenta[(cod[0], cod[1:3])][k] += 1
    out = {}
    for lado, equipo in (('*', local), ('a', visita)):
        mejor = None
        for (ld, dor), c in cuenta.items():
            if ld != lado:
                continue
            tot = c['atk'] + c['blq'] + c['ace']
            if tot and (mejor is None or tot > mejor['pts']):
                nom = (planteles[lado].get(dor) or ('', ''))[0]
                nom = nom or ('#' + dor.lstrip('0'))
                mejor = dict(c, pts=tot, dorsal=dor, equipo=equipo,
                             nombre=nom, corto=_corto_jug(nom))
        if mejor:
            out[lado] = mejor
    return out


def de_la_fecha(repo, archivos):
    """Los partidos de la fecha, para la placa de resultados.

    [{'local','visita','corto_l','corto_v','sl','sv','parciales'}]"""
    import os, sys
    repo = os.path.abspath(repo)
    if repo not in sys.path:
        sys.path.insert(0, repo)
    cwd = os.getcwd(); os.chdir(repo)
    try:
        import gen_liga_stats as gl
    finally:
        os.chdir(cwd)
    out = []
    for fn in [str(x) for x in archivos]:
        try:
            lineas = gl.read_lines(fn)
            l, v = gl.get_teams(lineas)
        except Exception:
            continue
        if not l or not v:
            continue
        ctx = contexto(lineas, l, v)
        if not ctx['parciales']:
            continue
        fig = {}
        try:
            import liga
            fig = anotadores(lineas, gl.get_scout(lineas), l, v,
                             lambda sec: liga.plantel(lineas, sec))
        except Exception:
            fig = {}
        out.append({'archivo': fn, 'local': l, 'visita': v,
                    'corto_l': ctx['corto_l'], 'corto_v': ctx['corto_v'],
                    'sl': ctx['sets'][0], 'sv': ctx['sets'][1],
                    'parciales': ctx['parciales'],
                    'fig_l': fig.get('*'), 'fig_v': fig.get('a'),
                    'puntos': (sum(a for a, b in ctx['parciales']),
                               sum(b for a, b in ctx['parciales']))})
    return out
