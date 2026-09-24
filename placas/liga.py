#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Una sola pasada sobre los .dvw de la liga: zonas y contadores por jugador.

La regla del tilde, que es la trampa del formato: ataque y armado leen el
segundo grupo del código; saque, recepción, defensa y bloqueo leen el cuarto.
Está así en update_db_nafels_FULL.py (parse_dvw_both).
"""
import collections, glob, os, sys

GRILLA = [4, 3, 2, 7, 8, 9, 5, 6, 1]
SKILLS = {'S': 'saque', 'R': 'recepcion', 'A': 'ataque', 'B': 'bloqueo',
          'D': 'defensa', 'E': 'armado'}
TIPO_SQ = {'Q': 'potencia', 'T': 'potencia', 'M': 'flotado', 'H': 'flotado'}

# Que cuenta como "buena" en cada fundamento. El saque suma la barra (/):
# el saque que deja al rival sin ataque tambien rompe, aunque no sea ace.
POSITIVO = {'saque': '#/+', 'recepcion': '#+', 'ataque': '#+',
            'bloqueo': '#+', 'defensa': '#+', 'armado': '#+'}

# Fase del ataque, campo 3 de la linea del [3SCOUT]. DataVolley la scoutea:
#   'r'  ataque directo de la recepcion
#   's'  segunda oportunidad dentro del mismo rally recibido
#   'p'  contraataque: el equipo estaba sacando
# K1 (side-out) = el rally lo recibimos nosotros, o sea 'r' mas 's'. Esa es
# la definicion que usa update_db_nafels_FULL.py para atk_so/atk_tr, y hay
# que respetarla: si las placas cortaran distinto que la app, el mismo
# jugador tendria dos numeros y se cae el argumento de venta entero.
FASE_K1 = ('r', 's')


def _gl(repo):
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


def _trayectoria(skill, resto):
    """Devuelve (origen, destino) aplicando la regla del tilde."""
    tp = resto.split('~')
    if skill in ('A', 'E'):
        traj = tp[1] if len(tp) > 1 else ''
    else:
        traj = tp[3] if len(tp) > 3 else ''
    o = int(traj[0]) if traj and traj[0].isdigit() else 0
    d = int(traj[1]) if len(traj) > 1 and traj[1].isdigit() else 0
    return o, d


# Puesto segun DataVolley, campo 13 de la fila del jugador en [3PLAYERS-*].
# El mapa es el mismo que usa update_db_nafels_FULL.py.
PUESTO_DV = {'1': 'L', '2': 'OH', '3': 'OPP', '4': 'MB', '5': 'S'}


def plantel(lineas, seccion):
    """Dorsal -> (nombre, puesto), leido del propio .dvw.

    Se lee de aca y no de nla_stats.json porque el .dvw es la fuente: trae el
    nombre completo y el puesto que cargo el scout. En nla_stats.json de la
    26-27 los puestos venian corridos (Durdos figuraba OPP siendo punta) y
    habia fichas con el nombre vacio.
    """
    out, dentro = {}, False
    for l in lineas:
        s = l.strip()
        if s.upper() == '[' + seccion + ']':
            dentro = True
            continue
        if s.startswith('[') and dentro:
            break
        if not dentro or ';' not in s:
            continue
        c = s.split(';')
        if len(c) < 14 or not c[1].strip().isdigit():
            continue
        dorsal = '%02d' % int(c[1])
        ape = c[9].strip().title() if len(c) > 9 else ''
        nom = c[10].strip().title() if len(c) > 10 else ''
        nombre = (nom + ' ' + ape).strip()
        rol = c[12].strip().upper() if len(c) > 12 else ''
        pu = 'L' if rol == 'L' else PUESTO_DV.get(c[13].strip(), '')
        if nombre or pu:
            out[dorsal] = (nombre, pu)
    return out


def leer(repo, carpeta, archivos=None):
    """{equipo: {dorsal: {skill: Counter(ev), 'z_<skill>': Counter(zona), ...}}}

    `archivos` limita a esos .dvw (los de una fecha); None = toda la carpeta."""
    gl = _gl(repo)
    eq = collections.defaultdict(lambda: {'jug': collections.defaultdict(
        lambda: collections.defaultdict(collections.Counter)),
        'sets': 0, 'plantel': {}})
    lista = [str(x) for x in archivos] if archivos is not None else \
        sorted(glob.glob(os.path.join(repo, carpeta, '*.dvw')))
    for fn in lista:
        try:
            lineas = gl.read_lines(fn)
            local, visita = [gl.norm(x) for x in gl.get_teams(lineas)]
            scout = gl.get_scout(lineas)
        except Exception:
            continue
        if not scout:
            continue
        for equipo_, seccion in ((local, '3PLAYERS-H'), (visita, '3PLAYERS-V')):
            if equipo_:
                eq[equipo_]['plantel'].update(plantel(lineas, seccion))
        sets = set()
        # K1 vs transición NO se deduce: DataVolley ya scoutea la fase en el
        # campo 3 de la línea ('r' = recepción/side-out, 'p' y 's' = el
        # resto), y es exactamente lo que lee update_db_nafels_FULL.py:1912.
        # Deducirlo por mi cuenta daba números parecidos pero distintos, que
        # es el peor resultado posible: dos verdades para el mismo dato.
        #
        # Lo único que sí hay que seguir del rally es el TIPO del saque, para
        # poder partir la recepción en "contra potencia" y "contra flotado".
        srv_tipo, rec_pfx = None, None
        for l in scout:
            sc = l.split(';')
            cod = sc[0].strip()
            if len(cod) < 6 or cod[0] not in '*a':
                continue
            equipo = local if cod[0] == '*' else visita
            if not equipo:
                continue
            cuerpo = cod[1:]
            if not cuerpo[:2].isdigit():
                continue
            sk = cuerpo[2]
            pfx = cod[0]
            fase = sc[2].strip().lower() if len(sc) > 2 else ''
            if sk not in SKILLS:
                continue
            dorsal, tipo, ev = cuerpo[:2], cuerpo[3], cuerpo[4]
            J = eq[equipo]['jug'][dorsal]
            nom = SKILLS[sk]
            J[nom][ev] += 1
            J[nom]['T'] += 1

            if sk == 'S':
                t = TIPO_SQ.get(tipo, 'otro')
                J['tipo_saque'][t] += 1
                J['sq_' + t][ev] += 1
                J['sq_' + t]['T'] += 1
                srv_tipo = t
                rec_pfx = 'a' if pfx == '*' else '*'
            elif sk == 'R':
                if pfx == rec_pfx and srv_tipo and srv_tipo != 'otro':
                    J['rec_vs_' + srv_tipo][ev] += 1
                    J['rec_vs_' + srv_tipo]['T'] += 1
            elif sk == 'A':
                k = 'atk_k1' if fase in FASE_K1 else 'atk_k2'
                J[k][ev] += 1
                J[k]['T'] += 1
            o, d = _trayectoria(sk, cuerpo[5:])
            # el saque y el ataque se leen por donde CAEN; el armado, por
            # donde SALE la pelota, que es a quien se la puso
            z = o if sk in ('E', 'A') and nom == 'armado' else d
            if sk == 'A':
                if d:
                    J['z_ataque'][d] += 1
                    # el mapa que le sirve al entrenador es donde caen las
                    # BUENAS: punto y positiva. El resto es ruido.
                    if ev in POSITIVO['ataque']:
                        J['z_ataque_pos'][d] += 1
                if o:
                    J['z_salida'][o] += 1
            elif z:
                J['z_' + nom][z] += 1
                if ev in POSITIVO.get(nom, '#+'):
                    J['z_' + nom + '_pos'][z] += 1
            for x in sc[8:9]:
                if x.strip().isdigit() and 1 <= int(x) <= 5:
                    sets.add(int(x))
        eq[local]['sets'] += len(sets)
        eq[visita]['sets'] += len(sets)
    return eq


def matriz(cnt):
    return [int(cnt.get(z, 0)) for z in GRILLA]


def _p(n, d):
    return round(100.0 * n / d) if d else 0


def eficacias(J):
    """Las fórmulas vigentes: to_pcts() de baterias_engine, escala 0-100.

    Dos cosas distintas, que en las placas se nombran distinto:

      EFICIENCIA (saque, recepción) — coeficiente ponderado sobre la escala
      DataVolley. No es un porcentaje de nada: es un índice de calidad media.

      EFICACIA (ataque) — (punto - error - bloqueado) / total. Es la fórmula
      estándar internacional, la misma que publica la FIVB.

      % ÚTIL (bloqueo) — acá se devuelve punto/total; la tabla ordena por
      punto más control, que es lo que gana el rally.
    """
    out = {}
    S = J['saque']
    if S['T']:
        out['saque'] = round((S['#'] * 100 + S['/'] * 87.5 + S['+'] * 75 +
                              S['!'] * 50 + S['-'] * 25) / S['T'])
    R = J['recepcion']
    if R['T']:
        out['recepcion'] = round((R['#'] * 100 + R['+'] * 75 + R['!'] * 50 +
                                  R['-'] * 25 + R['/'] * 12.5) / R['T'])
    A = J['ataque']
    if A['T']:
        out['ataque'] = round((A['#'] - A['/'] - A['=']) / A['T'] * 100)
    B = J['bloqueo']
    if B['T']:
        out['bloqueo'] = _p(B['#'], B['T'])
    return out


# Orden y color de las valoraciones, de mejor a peor.
#
# Las etiquetas son las de la escala DataVolley, con el nombre que tiene cada
# símbolo en el uso internacional. No son abreviaturas caseras:
#
#   SAQUE      # ace · / el rival no puede atacar · + limita al rival ·
#              ! neutro · - el rival recibe positivo · = error
#   RECEPCIÓN  # perfecta (todas las opciones) · + positiva (armador en zona) ·
#              ! regular (armador desplazado) · - negativa (solo balón alto) ·
#              / pasada al campo rival (overpass) · = error
#   ATAQUE     # punto (kill) · + positivo · ! neutro · - negativo ·
#              / bloqueado · = error
#   BLOQUEO    # punto directo · + control (el balón queda jugable) ·
#              ! toque · = error
VALORACIONES = {
    'saque':     [('#', 'ACE', '#22C55E'), ('/', 'SIN ATAQUE', '#86EFAC'),
                  ('+', 'POSITIVO', '#4ADE80'), ('!', 'NEUTRO', '#64748B'),
                  ('-', 'NEGATIVO', '#F59E0B'), ('=', 'ERROR', '#EF4444')],
    'recepcion': [('#', 'PERFECTA', '#22C55E'), ('+', 'POSITIVA', '#4ADE80'),
                  ('!', 'REGULAR', '#64748B'), ('-', 'NEGATIVA', '#F59E0B'),
                  ('/', 'PASADA', '#F97316'), ('=', 'ERROR', '#EF4444')],
    'ataque':    [('#', 'PUNTO', '#22C55E'), ('+', 'POSITIVO', '#4ADE80'),
                  ('!', 'NEUTRO', '#64748B'), ('-', 'NEGATIVO', '#F59E0B'),
                  ('/', 'BLOQUEADO', '#F97316'), ('=', 'ERROR', '#EF4444')],
    'bloqueo':   [('#', 'PUNTO', '#22C55E'), ('+', 'CONTROL', '#4ADE80'),
                  ('!', 'TOQUE', '#64748B'), ('=', 'ERROR', '#EF4444')],
}


def _ef_ataque(C):
    """(punto - error - bloqueado) / total. La fórmula estándar."""
    return round((C['#'] - C['/'] - C['=']) / C['T'] * 100) if C['T'] else None


def _ef_saque(C):
    return round((C['#'] * 100 + C['/'] * 87.5 + C['+'] * 75 +
                  C['!'] * 50 + C['-'] * 25) / C['T']) if C['T'] else None


def _ef_recepcion(C):
    return round((C['#'] * 100 + C['+'] * 75 + C['!'] * 50 +
                  C['-'] * 25 + C['/'] * 12.5) / C['T']) if C['T'] else None


def cortes(J, fund):
    """Los dos cortes que le interesan a un entrenador, por fundamento.

    Devuelve [(etiqueta, valor|None, n)]. Todo se calcula sobre los MISMOS
    partidos que el resto de la placa: nla_stats.json trae estos cortes ya
    hechos, pero acumulados de temporada, y mezclar una fecha con la
    temporada da un número que no es ninguna de las dos cosas.
    """
    if fund == 'ataque':
        return [('EN K1', _ef_ataque(J['atk_k1']), J['atk_k1']['T']),
                ('EN TRANSICIÓN', _ef_ataque(J['atk_k2']), J['atk_k2']['T'])]
    if fund == 'saque':
        return [('DE POTENCIA', _ef_saque(J['sq_potencia']), J['sq_potencia']['T']),
                ('FLOTADO', _ef_saque(J['sq_flotado']), J['sq_flotado']['T'])]
    if fund == 'recepcion':
        return [('VS POTENCIA', _ef_recepcion(J['rec_vs_potencia']),
                 J['rec_vs_potencia']['T']),
                ('VS FLOTADO', _ef_recepcion(J['rec_vs_flotado']),
                 J['rec_vs_flotado']['T'])]
    return []


def valoraciones(J, fund):
    """[(simbolo, etiqueta, color, cantidad, porcentaje)] para la tira."""
    C, T = J[fund], J[fund]['T'] or 1
    return [(sim, et, col, C[sim], round(100.0 * C[sim] / T))
            for sim, et, col in VALORACIONES[fund]]


def tiles_saque(J):
    S, T = J['saque'], J['saque']['T']
    tp = J['tipo_saque']; tt = sum(tp.values()) or 1
    return [('EFIC', '%d%%' % eficacias(J)['saque']), ('ACES', '%d%%' % _p(S['#'], T)),
            ('ERR', '%d%%' % _p(S['='], T)), ('POTENCIA', '%d%%' % _p(tp['potencia'], tt)),
            ('FLOTADO', '%d%%' % _p(tp['flotado'], tt)), ('N', str(T))]


def tiles_recepcion(J):
    R, T = J['recepcion'], J['recepcion']['T']
    return [('EFIC', '%d%%' % eficacias(J)['recepcion']),
            ('#+', '%d%%' % _p(R['#'] + R['+'], T)), ('/=', '%d%%' % _p(R['/'] + R['='], T)),
            ('PERFECTA', '%d%%' % _p(R['#'], T)), ('MALA', '%d%%' % _p(R['-'], T)),
            ('N', str(T))]


def tiles_ataque(J):
    A, T = J['ataque'], J['ataque']['T']
    return [('EFIC', '%d%%' % eficacias(J)['ataque']), ('PUNTO', '%d%%' % _p(A['#'], T)),
            ('BLOQ', '%d%%' % _p(A['/'], T)), ('ERR', '%d%%' % _p(A['='], T)),
            ('N', str(T)), ('', '')]
