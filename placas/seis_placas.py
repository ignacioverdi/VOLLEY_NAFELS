#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Las seis placas de la fecha, de la LIGA — no de un club.

    python3 seis_placas.py --repo ../VOLLEY_NAFELS

Una por fundamento: saque, recepción, armado, ataque, bloqueo, equipo ideal.
Entre placa y placa va el video de la mejor acción de ese fundamento.
"""
import argparse, json, pathlib, re
import armador, club, fechas, liga, placas2, rotacion

LIGA = 'Liga Nacional A · Suiza'
PLURAL = {'saque': 'saques', 'recepcion': 'recepciones',
          'ataque': 'ataques', 'bloqueo': 'bloqueos'}
PUESTOS = {'OH': 'PUNTA', 'OPP': 'OPUESTO', 'MB': 'CENTRAL', 'S': 'ARMADOR', 'L': 'LÍBERO'}


def fichas(EQ, NOM_json):
    """Nombre y puesto de cada jugador.

    Manda el .dvw, que es la fuente: trae el nombre completo y el puesto que
    cargo el scout. nla_stats.json queda de respaldo, porque en la 26-27
    tenia los puestos corridos (Durdos figuraba OPUESTO siendo punta,
    Vazquez OUTSIDE siendo armador) y fichas con el nombre vacio."""
    out = dict(NOM_json)
    for eq, d in EQ.items():
        for dor, (nombre, pu) in d.get('plantel', {}).items():
            viejo = out.get((eq, dor))
            nom = nombre.upper() if nombre else (viejo[0] if viejo else '')
            pos = PUESTOS.get(pu) or (viejo[1] if viejo else '')
            if nom:
                out[(eq, dor)] = (nom, pos, viejo[2] if viejo else None)
    return out


# Todas las pills llevan el signo %, que es como lo muestra DataVolley y
# como lo lee un entrenador. La nota sobre el coeficiente ponderado se sacó
# del pie: era una aclaración de manual, no de placa.
PCT = {}


def tiles(fund, principal, J, vara_, respaldo):
    """Los tres tiles: el número grande con la vara, y los dos cortes.

    Si un corte no tiene volumen (pasa en una fecha suelta), cae al respaldo
    en vez de mostrar un porcentaje de dos acciones.
    """
    fmt = PCT.get(fund, '%d%%')
    out = [(principal[0], fmt % principal[1], None, vara_ or None)]
    # El corte se muestra solo si LOS DOS lados tienen volumen. Si el jugador
    # sacó 34 flotados y ningún potencia, "FLOTADO 47" al lado de
    # "EFICIENCIA 47" es el mismo número dos veces: no es un corte, es ruido.
    cs = [(et, v, n) for et, v, n in liga.cortes(J, fund) if v is not None and n >= 4]
    if len(cs) == 2:
        out += [(et, fmt % v, '%d %s' % (n, PLURAL[fund]), None) for et, v, n in cs]
    while len(out) < 3 and respaldo:
        et, v = respaldo.pop(0)
        out.append((et, v, None, None))
    return out[:3]


def lindo(n):
    return ' '.join(w.capitalize() if w.isupper() else w for w in str(n).split())


def nombres(repo, temporada):
    d = json.loads((pathlib.Path(repo) / 'nla_stats.json').read_text(encoding='utf-8'))
    out = {}
    for x in d['players']:
        if x['temporada'] == temporada:
            out[(x['team'], '%02d' % x['num'])] = (
                lindo(x['name']).upper(), PUESTOS.get(x['pos'], ''), x)
    return out, [t for t in d['teams'] if t['temporada'] == temporada]


# PISO DE VOLUMEN
# ---------------
# Una fecha y una temporada no se pueden medir con la misma vara, y el piso
# tiene que moverse solo. Medi el volumen real por jugador EN UN PARTIDO
# sobre los 97 .dvw de la 25-26, y da esto:
#
#     saque      mediana  9    titulares 11
#     recepcion  mediana 10    receptores 18
#     ataque     mediana  9    titulares 12
#     bloqueo    mediana  6    titulares  6
#
# O sea que un piso de 15 ataques, que es razonable para una temporada, en
# una fecha deja afuera a mas de la mitad de los titulares, y a casi todos
# los centrales. Los pisos de abajo son el MINIMO ABSOLUTO: por debajo de
# esto un porcentaje no significa nada, porque una sola accion lo mueve diez
# puntos o mas. Son para el caso chico (una fecha, un partido).
MIN_ABS = {'saque': 6, 'recepcion': 8, 'ataque': 8, 'bloqueo': 6}

# Para el caso grande manda la parte adaptativa: 40% del percentil 75 de los
# que hicieron algo. Se usa el p75 y no la mediana porque la mediana la
# hunden los que tocaron el fundamento de casualidad: en recepcion, un
# central que recibio una sola pelota en toda la temporada cuenta igual que
# un libero con 400, y la mediana termina en 19 sobre 97 partidos.
FRACCION = 0.4


def piso(EQ, NOM, fund):
    """El mayor entre el minimo absoluto y el 40% del p75 de la muestra.

    Con una fecha manda el minimo; con media temporada o mas manda el p75.
    El numero sale impreso en la placa junto con cuantos lo superaron, asi
    que el que la lee puede juzgar por su cuenta."""
    vals = sorted(J[fund]['T'] for d in EQ.values() for dor, J in d['jug'].items()
                  if J[fund]['T'] > 0)
    if not vals:
        return MIN_ABS[fund]
    p75 = vals[int(len(vals) * 0.75)]
    return max(MIN_ABS[fund], int(p75 * FRACCION))


def ranking(EQ, NOM, fund, minimo, zona):
    """Todos los que superan el piso, ordenados. El 1ro va a la ficha y el
    2do y 3ro al podio: la placa sirve de ranking y nombra a más gente."""
    c = []
    for eq, d in EQ.items():
        for dor, J in d['jug'].items():
            if (eq, dor) not in NOM or J[fund]['T'] < minimo:
                continue
            ef = liga.eficacias(J).get(fund)
            if ef is None or sum(J[zona].values()) < minimo * 0.4:
                continue
            c.append((ef, eq, dor, J))
    c.sort(key=lambda x: -x[0])
    return c


def mejor(EQ, NOM, fund, minimo, zona):
    c = ranking(EQ, NOM, fund, minimo, zona)
    return c[0] if c else None


def ficha(fund, zona, hero, titulo, bajada, pie, EQ, NOM, minimo, fecha, fuente,
          filtro, ctx=None):
    ctx = ctx or {}
    orden = ranking(EQ, NOM, fund, minimo, zona)
    if not orden:
        return None
    ef, eq, dor, J = orden[0]
    nom, pos, st = NOM[(eq, dor)]
    zonas = liga.matriz(J[zona])
    # el 2do y el 3ro al pie: la placa pasa de "el mejor" a ranking.
    # Si en nla_stats.json la ficha vino sin nombre, va el dorsal: mejor
    # "#14" que un renglón que empieza con un punto y nada.
    podio = [('%dº' % (i + 2),
              lindo(NOM[(e, d)][0]) or ('#%d' % int(d)), e, '%d%%' % v)
             for i, (v, e, d, _J) in enumerate(orden[1:3])]
    # La cancha NO dibuja todo: dibuja lo filtrado. Los dos numeros van a la
    # vista, porque el que mira la placa no tiene otra forma de saberlo.
    n, total = sum(zonas), J[fund]['T']
    # la vara: la media de la liga, para que el número tenga contra qué leerse
    v = dict(ctx.get('varas', {}).get(fund) or {})
    if v:
        v['valor'] = ef
        v['etiqueta'] = '%d%%' % v['media']
    return {'tipo': 'ficha', 'slug': fund, 'fundamento': fund, 'liga': LIGA,
            'fecha': fecha, 'titulo': titulo, 'bajada': bajada,
            'fichas': [{'dorsal': int(dor), 'nombre': nom, 'equipo': eq,
                        'puesto': pos or 'NLA', 'total': '%d %s' % (total, PLURAL[fund]),
                        'zonas': zonas, 'podio': podio,
                        'escudo': club.escudo_de(ctx.get('escudos'), eq),
                        'filtro': {'izq': 'En la cancha', 'que': filtro, 'escala': True,
                                   'der': '%d de %d %s' % (n, total, PLURAL[fund])},
                        'rotulo_tira': 'Escala DataVolley · sus %d %s'
                                       % (total, PLURAL[fund]),
                        'hero': hero(J, st or {}, v),
                        'valoraciones': liga.valoraciones(J, fund)}],
            'fuente': fuente + ' · mínimo %d %s, %d jugadores lo superaron'
                               % (minimo, PLURAL[fund], len(orden)),
            'pie': pie(ef, eq, J)}


def construir(repo, carpeta, temporada, fecha, archivos=None):
    NOM_json, equipos = nombres(repo, temporada)
    EQ = liga.leer(repo, carpeta, archivos)
    NOM = fichas(EQ, NOM_json)
    n_part = len(archivos) if archivos is not None else \
        sum(1 for _ in (pathlib.Path(repo) / carpeta).glob('*.dvw'))
    # la muestra, declarada: cuántos partidos y cuántos equipos de la liga
    n_eq = len([e for e in EQ if EQ[e]['jug']])
    fuente = ('Volley-Stats · %d partidos scouteados con nuestro sistema · '
              '%d equipos' % (n_part, n_eq))
    ctx = {'escudos': club.escudos(repo), 'varas': club.varas(repo, temporada)}
    P = []

    # 1 · SAQUE
    P.append(ficha('saque', 'z_saque_pos',
                   lambda J, st, v: tiles(
                       'saque', ('EFICIENCIA', liga.eficacias(J)['saque']), J, v,
                       [('ACE / ERROR', '%d-%d' % (J['saque']['#'], J['saque']['='])),
                        ('% ACE', '%d%%' % round(
                            100.0 * J['saque']['#'] / (J['saque']['T'] or 1)))]),
                   'El mejor saque de la fecha',
                   'Sus zonas de saque cuando complica al receptor, y qué rinde '
                   'con cada tipo de servicio.',
                   lambda ef, eq, J: 'El mapa deja solo los saques con los que '
                                     'complica al receptor. Esa es su zona: es adónde '
                                     'va a sacar el sábado.',
                   EQ, NOM, piso(EQ, NOM, 'saque'), fecha, fuente,
                   'solo saque positivo · # / +', ctx))

    # 2 · RECEPCIÓN
    P.append(ficha('recepcion', 'z_recepcion_pos',
                   lambda J, st, v: tiles(
                       'recepcion', ('EFICIENCIA', liga.eficacias(J)['recepcion']), J, v,
                       [('% POSITIVA', '%d%%' % round(
                           100.0 * (J['recepcion']['#'] + J['recepcion']['+'])
                           / (J['recepcion']['T'] or 1))),
                        ('% PERFECTA', '%d%%' % round(
                            100.0 * J['recepcion']['#']
                            / (J['recepcion']['T'] or 1)))]),
                   'El receptor más sólido',
                   'Sus zonas de recepción cuando la deja armable, y qué rinde '
                   'contra potencia y contra flotado.',
                   lambda ef, eq, J: 'El mapa deja solo la recepción perfecta y la '
                                     'positiva, que son las que dejan armar. Las zonas '
                                     'que quedan vacías son por donde hay que sacarle.',
                   EQ, NOM, piso(EQ, NOM, 'recepcion'), fecha, fuente,
                   'solo recepción positiva · # +', ctx))

    # 3 · ARMADO — las seis canchitas
    mejor_eq = max(equipos, key=lambda t: t.get('atk_all') or 0)['team']
    ac, _ = armador.por_rotacion(repo, carpeta, mejor_eq, archivos, rec='#+')
    rot = armador.a_placa(ac)
    # el mismo conteo sin filtrar, solo para poder decir "X de Y" en la placa
    todo, _ = armador.por_rotacion(repo, carpeta, mejor_eq, archivos, rec='')
    n_arm = sum(r['total'] for r in rot)
    n_todo = sum(c['tot'] for z in todo.values() for c in z.values()) or n_arm
    # El armador de la placa es el que MAS ARMO en esos partidos, no el
    # primer ARMADOR del club que aparezca en nla_stats.json. Si no, la placa
    # del armado nombra a uno y la del equipo ideal a otro.
    arm = None
    cands = [(J['armado']['T'], dor) for dor, J in EQ.get(mejor_eq, {}).get('jug', {}).items()
             if NOM.get((mejor_eq, dor), ('', '', None))[1] == 'ARMADOR']
    if cands:
        arm = NOM[(mejor_eq, max(cands)[1])]
    P.append({'tipo': 'seis', 'slug': 'armado', 'fundamento': 'armado', 'liga': LIGA,
              'fecha': fecha, 'titulo': 'La distribución del armador en K1',
              'bajada': '%s · %s. Cómo reparte el balón en cada rotación cuando '
                        'la recepción es perfecta o positiva, es decir cuando '
                        'tiene todas las opciones abiertas.'
                        % (lindo(arm[0]) if arm else mejor_eq, mejor_eq),
              'rotaciones': rot, 'leyenda': armador.leyenda(rot), 'fuente': fuente,
              'filtro': {'izq': 'En las canchas',
                         'que': 'solo K1 con recepción # +',
                         'der': '%d de %d ataques' % (n_arm, n_todo)},
              'pie': 'Solo K1 con recepción # o +: esto es lo que elige cuando puede '
                     'elegir. El K1 de emergencia y el K2 de transición responden a '
                     'otra lógica, y promediarlos borra el patrón. La rotación se '
                     'nombra por la posición del armador.'})

    # 4 · ATAQUE — la cancha con los ataques # y + solamente
    P.append(ficha('ataque', 'z_ataque_pos',
                   lambda J, st, v: tiles(
                       'ataque', ('EFICACIA', liga.eficacias(J)['ataque']), J, v,
                       [('% PUNTO', '%d%%' % round(
                           100.0 * J['ataque']['#'] / (J['ataque']['T'] or 1))),
                        ('ERR + BLQ', '%d' % (J['ataque']['='] + J['ataque']['/']))]),
                   'El atacante más eficaz',
                   'Dónde ataca cuando hace daño, y la diferencia entre lo que '
                   'rinde en side-out y en transición.',
                   lambda ef, eq, J: 'Eficacia = (punto − error − bloqueado) / total, '
                                     'la fórmula estándar internacional. El mapa deja '
                                     'solo el ataque que gana el rally o deja al rival '
                                     'sin contraataque.',
                   EQ, NOM, piso(EQ, NOM, 'ataque'), fecha, fuente,
                   'solo ataque positivo · # +', ctx))

    # 5 · BLOQUEO — tabla, porque el bloqueo se cuenta, no se dibuja
    filas = []
    for eq, d in EQ.items():
        for dor, J in d['jug'].items():
            B = J['bloqueo']
            if (eq, dor) not in NOM or B['T'] < piso(EQ, NOM, 'bloqueo'):
                continue
            nom, pos, _ = NOM[(eq, dor)]
            filas.append({'nombre': lindo(nom), 'equipo': eq,
                          # ordena por #+, no solo por punto: el bloqueo que
                          # deja la pelota jugable tambien gana el rally
                          'pct': '%d%%' % round(100.0 * (B['#'] + B['+']) / B['T']),
                          'tot': B['T'], 'pto': B['#'], 'pos': B['+'], 'err': B['=']})
    filas.sort(key=lambda f: -int(f['pct'].rstrip('%')))
    P.append({'tipo': 'tabla', 'slug': 'bloqueo', 'fundamento': 'bloqueo', 'liga': LIGA,
              'fecha': fecha, 'titulo': 'El bloqueo de la fecha',
              'bajada': 'Los %d mejores por bloqueo útil: punto directo (#) más '
                        'bloqueo de control (+), el que deja el balón jugable para '
                        'su equipo.' % min(8, len(filas)),
              'filtro': {'izq': 'La tabla', 'que': 'ordenada por % de bloqueo útil',
                         'der': 'desde %d bloqueos' % piso(EQ, NOM, 'bloqueo')},
              'columnas': [{'t': '% ÚTIL', 'k': 'pct', 'color': '#06B6D4', 'fuerte': True},
                           {'t': 'TOTAL', 'k': 'tot', 'color': '#F59E0B', 'fuerte': True},
                           {'t': '# PUNTO', 'k': 'pto', 'color': '#22C55E', 'fuerte': True},
                           {'t': '+ CONTROL', 'k': 'pos'},
                           {'t': '= ERROR', 'k': 'err', 'color': '#EF4444', 'fuerte': True}],
              'filas': filas[:8], 'fuente': fuente,
              'pie': 'El bloqueo-punto es solo una parte. El bloqueo que frena el '
                     'balón y lo deja defendible gana el rally igual, y por eso la '
                     'tabla ordena por # más +, no por punto directo.'})

    # 6 · SIDE-OUT POR ROTACIÓN — la métrica del vóley profesional
    P.append(placa_rotaciones(repo, carpeta, archivos, fecha, fuente, ctx))

    # 7 · EQUIPO IDEAL
    P.append(equipo_ideal(EQ, NOM, equipos, fecha, fuente, n_part, ctx))
    return [x for x in P if x]


def placa_rotaciones(repo, carpeta, archivos, fecha, fuente, ctx):
    """Side-out y break point por rotación, de cada equipo de la fecha.

    Todo plan de partido se reduce a esto: dónde no sostiene el rival, y cuál
    es la rotación propia que se rompe."""
    datos = rotacion.por_equipo(repo, carpeta, archivos)
    filas = rotacion.a_placa(datos)
    if not filas:
        return None
    for f in filas:
        f['escudo'] = club.escudo_de(ctx.get('escudos'), f['equipo'])
    conclusion = rotacion.titular(filas)
    total = sum(f['so_n'] for f in filas)
    return {'tipo': 'rotaciones', 'slug': 'rotaciones', 'fundamento': 'saque',
            'liga': LIGA, 'fecha': fecha,
            'titulo': 'El side-out, rotación por rotación',
            'bajada': 'Cuánto sostiene cada equipo su recepción en cada una de '
                      'sus seis rotaciones. Es el número sobre el que se arma '
                      'todo plan de partido.',
            'filas': filas[:5],
            'filtro': {'izq': 'Calculado sobre', 'que': '%d rallies con saque' % total,
                       'der': 'mínimo 6 rallies por rotación'},
            'fuente': fuente,
            'pie': conclusion or ('Side-out alto significa que el equipo gana el '
                                  'punto cuando recibe. Break point es lo mismo '
                                  'del lado del que saca.')}


# Cómo se arma un siete ideal en serio, que es como lo hacen la FIVB y las
# ligas europeas: ningún puesto se elige por un solo número.
#
#   PUNTA    ataca Y recibe. Un punta que remata 35% pero recibe mal no le
#            sirve a nadie; el que hace las dos cosas es el que vale.
#   CENTRAL  bloquea Y ataca. El central es el jugador con mejor eficacia de
#            ataque del equipo (la rápida es el balón más fácil), así que
#            premiar solo el bloqueo deja afuera media función del puesto.
#   OPUESTO  no recibe: se lo mide por ataque.
#   LÍBERO   recepción.
#   ARMADOR  no tiene estadística individual que lo mida; va por el ataque
#            del equipo, y la placa lo dice.
#
# (fundamento, etiqueta, peso). El primero es el principal y es obligatorio.
COMPUESTO = {
    'PUNTA':   [('ataque', 'ATK', 0.6), ('recepcion', 'REC', 0.4)],
    'CENTRAL': [('bloqueo', 'BLQ', 0.5), ('ataque', 'ATK', 0.5)],
    'OPUESTO': [('ataque', 'ATK', 1.0)],
    'LÍBERO':  [('recepcion', 'REC', 1.0)],
}


def equipo_ideal(EQ, NOM, equipos, fecha, fuente, n_part=0, ctx=None):
    ctx = ctx or {}
    cand = {}
    for eq, d in EQ.items():
        for dor, J in d['jug'].items():
            if (eq, dor) not in NOM:
                continue
            nom, pos, st = NOM[(eq, dor)]
            if not str(nom).strip():
                continue          # en nla_stats.json hay fichas sin nombre
            ef = liga.eficacias(J)
            cand.setdefault(pos, []).append((eq, lindo(nom), J, ef))

    pa, pb, pr = piso(EQ, NOM, 'ataque'), piso(EQ, NOM, 'bloqueo'), piso(EQ, NOM, 'recepcion')
    PISOS = {'ataque': pa, 'bloqueo': pb, 'recepcion': pr}
    varas_ = ctx.get('varas') or {}

    def top(pos, n):
        """Ordena por el índice compuesto del puesto.

        Cada componente se mide contra la media de la liga, así se pueden
        sumar dos cosas que no están en la misma escala (un 30% de eficacia
        de ataque y un 58% de recepción no se promedian a lo bruto). Si a un
        jugador le falta volumen en un componente, el peso se reparte entre
        los que sí tiene, y ese dato no se muestra.
        """
        comp = COMPUESTO[pos]
        out = []
        for eq, nm, J, e in cand.get(pos, []):
            partes, peso, datos = 0.0, 0.0, []
            for fund, et, w in comp:
                v = e.get(fund)
                if v is None or v <= 0 or J[fund]['T'] < PISOS[fund]:
                    continue
                base = (varas_.get(fund) or {}).get('media') or v
                partes += w * (v / base)
                peso += w
                datos.append('%s %d%%' % (et, v))
            if not peso or not datos:
                continue
            # exigir el componente principal: un punta sin volumen de ataque
            # no es el mejor punta de la fecha por mucho que reciba
            if comp[0][1] not in datos[0]:
                continue
            # y si el puesto se define por dos cosas, el que hizo las dos va
            # primero. Si no, la placa dice "punta por ataque y recepción" y
            # arriba de todo pone a uno que no recibió una pelota.
            completo = 0 if len(datos) == len(comp) else 1
            out.append((completo, -(partes / peso), nm, eq, datos))
        out.sort()
        return [{'jugador': nm, 'equipo': eq,
                 'escudo': club.escudo_de(ctx.get('escudos'), eq),
                 'dato': d[0], 'dato2': d[1] if len(d) > 1 else ''}
                for _comp, _sc, nm, eq, d in out[:n]]

    s = []
    for i, x in enumerate(top('PUNTA', 2)):
        s.append(dict(x, puesto='Punta %d' % (i + 1)))
    for i, x in enumerate(top('CENTRAL', 2)):
        s.append(dict(x, puesto='Central %d' % (i + 1)))
    for x in top('OPUESTO', 1):
        s.append(dict(x, puesto='Opuesto'))
    for x in top('LÍBERO', 1):
        s.append(dict(x, puesto='Líbero'))
    atk = {t['team']: t.get('atk_all') or 0 for t in equipos}
    # el armador del equipo ideal: el que mas armo del club con mejor ataque
    arms = sorted(cand.get('ARMADOR', []),
                  key=lambda x: (-atk.get(x[0], 0), -x[2]['armado']['T']))
    if arms:
        eq, nm, _, _ = arms[0]
        s.append({'puesto': 'Armador', 'jugador': nm, 'equipo': eq,
                  'escudo': club.escudo_de(ctx.get('escudos'), eq),
                  'dato': 'ATAQUE EQUIPO %d%%' % atk.get(eq, 0), 'dato2': ''})
    return {'tipo': 'siete', 'slug': 'equipo-ideal', 'fundamento': 'armado', 'liga': LIGA,
            'fecha': fecha, 'titulo': 'El siete ideal de la fecha',
            'bajada': 'Puntas por ataque y recepción; centrales por bloqueo y '
                      'ataque; opuesto por ataque; líbero por recepción. Ningún '
                      'puesto se elige por un solo número.',
            'siete': s, 'fuente': fuente,
            'filtro': {'izq': 'Volumen mínimo',
                       'que': '%d ataques · %d bloqueos · %d recepciones' % (pa, pb, pr),
                       'der': 'por debajo, no entra'},
            'pie': ('El punta pondera 60% ataque y 40% recepción; el central, mitad '
                    'y mitad bloqueo y ataque. Cada componente se mide contra la '
                    'media de la liga. El armador es el único sin estadística propia: '
                    'va el del equipo con mejor ataque.')
                   if len(s) >= 7 else
                   ('Con %d partidos todavía no hay volumen para llenar los siete '
                    'puestos. Los que faltan se completan solos a medida que avance '
                    'la temporada.' % n_part)}


def detectar(repo):
    """Encuentra la carpeta 'DVW ... <anio>' mas nueva y deduce la temporada.
    El anio de la carpeta es el de FIN: 'DVW NAFELS 2027' = temporada 26-27.
    Mismo criterio que gen_liga_stats.py:16."""
    cands = []
    for d in pathlib.Path(repo).iterdir():
        if not d.is_dir() or not d.name.upper().startswith('DVW '):
            continue
        if 'ENTREN' in d.name.upper() or 'HIGH SET' in d.name.upper():
            continue
        anios = [int(x) for x in re.findall(r'(20\d{2})', d.name)]
        if anios and list(d.glob('*.dvw')):
            cands.append((max(anios), d.name))
    if not cands:
        return None, None
    anio, nombre = max(cands)
    return nombre, '%02d-%02d' % ((anio - 1) % 100, anio % 100)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='..')
    ap.add_argument('--carpeta', default='')
    ap.add_argument('--temporada', default='')
    ap.add_argument('--fecha', default='', help='solo los partidos de esa fecha')
    ap.add_argument('--hasta', default='', help='acumulado desde la 1 hasta esa fecha')
    ap.add_argument('--listar', action='store_true', help='mostrar las fechas y salir')
    ap.add_argument('--salida', default='salida')
    a = ap.parse_args()

    if not a.carpeta or not a.temporada:
        c, t = detectar(a.repo)
        if not c:
            raise SystemExit('No encuentro ninguna carpeta "DVW ..." con archivos .dvw '
                             'en %s.\nPasá --repo con la ruta del repo.'
                             % pathlib.Path(a.repo).resolve())
        a.carpeta = a.carpeta or c
        a.temporada = a.temporada or t
        print('Carpeta: %s   ·   Temporada: %s' % (a.carpeta, a.temporada))

    ruta_dvw = pathlib.Path(a.repo) / a.carpeta
    grupos, sueltos = fechas.detectar(ruta_dvw)

    if a.listar:
        print(); print(fechas.resumen(grupos, sueltos)); raise SystemExit(0)

    archivos, _, _ = fechas.archivos_de(ruta_dvw, a.fecha or None, a.hasta or None)
    if archivos is None:
        print(); print(fechas.resumen(grupos, sueltos))
        raise SystemExit('\nNo existe la fecha %s en esa carpeta.' % a.fecha)

    if a.fecha:
        rotulo = 'Fecha %s · %s' % (a.fecha, a.temporada)
        carpeta_sal = pathlib.Path(a.salida) / a.temporada / ('fecha-%02d' % int(a.fecha))
    elif a.hasta:
        rotulo = 'Fechas 1 a %s · %s' % (a.hasta, a.temporada)
        carpeta_sal = pathlib.Path(a.salida) / a.temporada / ('hasta-%02d' % int(a.hasta))
    else:
        rotulo = 'Temporada %s' % a.temporada
        carpeta_sal = pathlib.Path(a.salida) / a.temporada / 'acumulado'

    print('%d partidos:' % len(archivos))
    for x in archivos[:8]:
        print('   ' + x.name)
    if len(archivos) > 8:
        print('   ... y %d más' % (len(archivos) - 8))

    piezas = construir(a.repo, a.carpeta, a.temporada, rotulo, archivos)
    hechos = placas2.generar(piezas, carpeta_sal)
    print()
    print('%d placas en %s' % (len(hechos), carpeta_sal))
    for n in hechos:
        print('  ', n)
