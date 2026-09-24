#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Las seis placas de la fecha, de la LIGA — no de un club.

    python3 seis_placas.py --repo ../VOLLEY_NAFELS

Una por fundamento: saque, recepción, armado, ataque, bloqueo, equipo ideal.
Entre placa y placa va el video de la mejor acción de ese fundamento.
"""
import argparse, json, pathlib, re
import armador, fechas, liga, placas2

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


# Piso de volumen adaptativo. Un piso fijo sirve para una temporada entera y
# deja sin placas a la fecha 3, donde nadie llego a 150 saques. Se toma el
# mayor entre un piso minimo y el 40% de la mediana de los que jugaron.
PISO = {'saque': 12, 'recepcion': 12, 'ataque': 15, 'bloqueo': 8}


def piso(EQ, NOM, fund):
    vals = sorted(J[fund]['T'] for d in EQ.values() for dor, J in d['jug'].items()
                  if J[fund]['T'] > 0)
    if not vals:
        return PISO[fund]
    return max(PISO[fund], int(vals[len(vals) // 2] * 0.4))


def mejor(EQ, NOM, fund, minimo, zona):
    """El mejor de la liga en un fundamento, con piso de volumen."""
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
    return c[0] if c else None


def ficha(fund, zona, hero, titulo, bajada, pie, EQ, NOM, minimo, fecha, fuente,
          filtro):
    m = mejor(EQ, NOM, fund, minimo, zona)
    if not m:
        return None
    ef, eq, dor, J = m
    nom, pos, _ = NOM[(eq, dor)]
    zonas = liga.matriz(J[zona])
    # La cancha NO dibuja todo: dibuja lo filtrado. Los dos numeros van a la
    # vista, porque el que mira la placa no tiene otra forma de saberlo.
    n, total = sum(zonas), J[fund]['T']
    return {'tipo': 'ficha', 'slug': fund, 'fundamento': fund, 'liga': LIGA,
            'fecha': fecha, 'titulo': titulo, 'bajada': bajada,
            'fichas': [{'dorsal': int(dor), 'nombre': nom, 'equipo': eq,
                        'puesto': pos or 'NLA', 'total': '%d %s' % (total, PLURAL[fund]),
                        'zonas': zonas,
                        'filtro': {'izq': 'En la cancha', 'que': filtro,
                                   'der': '%d de %d %s' % (n, total, PLURAL[fund])},
                        'rotulo_tira': 'Escala DataVolley · sus %d %s'
                                       % (total, PLURAL[fund]),
                        'hero': hero(J), 'valoraciones': liga.valoraciones(J, fund)}],
            'fuente': fuente,
            'pie': pie(ef, eq, J) + ' Volumen mínimo para entrar: %d %s.'
                                    % (minimo, PLURAL[fund])}


def construir(repo, carpeta, temporada, fecha, archivos=None):
    NOM_json, equipos = nombres(repo, temporada)
    EQ = liga.leer(repo, carpeta, archivos)
    NOM = fichas(EQ, NOM_json)
    n_part = len(archivos) if archivos is not None else \
        sum(1 for _ in (pathlib.Path(repo) / carpeta).glob('*.dvw'))
    fuente = 'Volley-Stats · %d partidos scouteados con nuestro sistema' % n_part
    P = []

    # 1 · SAQUE
    P.append(ficha('saque', 'z_saque_pos',
                   lambda J: [('EFICIENCIA', '%d' % liga.eficacias(J)['saque']),
                              ('ACE / ERROR', '%d-%d' % (J['saque']['#'], J['saque']['='])),
                              ('% RUPTURA', '%d%%' % round(
                                  100.0 * (J['saque']['#'] + J['saque']['/'] +
                                           J['saque']['+']) / (J['saque']['T'] or 1)))],
                   'El saque más determinante',
                   'Arriba, dónde caen los saques que rompen el K1 rival: ace, '
                   'saque sin ataque posible y saque positivo. Abajo, la escala '
                   'completa de su servicio.',
                   lambda ef, eq, J: 'El mapa excluye los saques que el rival recibió '
                                     'bien: queda desde dónde condiciona el side-out '
                                     'contrario. La eficiencia es un coeficiente '
                                     'ponderado de la escala, no un porcentaje.',
                   EQ, NOM, piso(EQ, NOM, 'saque'), fecha, fuente,
                   'solo saque de ruptura · # / +'))

    # 2 · RECEPCIÓN
    P.append(ficha('recepcion', 'z_recepcion_pos',
                   lambda J: [('EFICIENCIA', '%d' % liga.eficacias(J)['recepcion']),
                              ('% POSITIVA', '%d%%' % round(
                                  100.0 * (J['recepcion']['#'] + J['recepcion']['+'])
                                  / (J['recepcion']['T'] or 1))),
                              ('% PERFECTA', '%d%%' % round(
                                  100.0 * J['recepcion']['#']
                                  / (J['recepcion']['T'] or 1)))],
                   'El receptor más sólido',
                   'Arriba, desde qué zonas sostiene el K1: recepción perfecta (#) '
                   'y positiva (+), las que dejan al armador con todo el juego '
                   'disponible. Abajo, la escala completa.',
                   lambda ef, eq, J: '# es recepción perfecta: el armador tiene todas '
                                     'las opciones. + es positiva: llega a la zona de '
                                     'armado. Juntas deciden si se puede jugar rápido '
                                     'por el centro.',
                   EQ, NOM, piso(EQ, NOM, 'recepcion'), fecha, fuente,
                   'solo recepción positiva · # +'))

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
                   lambda J: [('EFICACIA', '%d%%' % liga.eficacias(J)['ataque']),
                              ('% PUNTO', '%d%%' % round(
                                  100.0 * J['ataque']['#'] / (J['ataque']['T'] or 1))),
                              ('ERR + BLQ', '%d' % (J['ataque']['='] + J['ataque']['/']))],
                   'El atacante más eficaz',
                   'Arriba, dónde termina sus ataques de punto (#) y positivos (+). '
                   'Abajo, la escala completa de su remate.',
                   lambda ef, eq, J: 'Eficacia = (punto − error − bloqueado) / total, '
                                     'la fórmula estándar internacional. El mapa deja '
                                     'solo el ataque que gana el rally o deja al rival '
                                     'sin contraataque.',
                   EQ, NOM, piso(EQ, NOM, 'ataque'), fecha, fuente,
                   'solo ataque # + · K1 y K2'))

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

    # 6 · EQUIPO IDEAL
    P.append(equipo_ideal(EQ, NOM, equipos, fecha, fuente, n_part))
    return [x for x in P if x]


def equipo_ideal(EQ, NOM, equipos, fecha, fuente, n_part=0):
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

    def top(pos, fund, minimo, n, et, pct=True):
        # el valor tiene que ser > 0: un puesto vacio dice la verdad, uno
        # relleno con 0% de eficacia es peor que no poner nada
        c = [x for x in cand.get(pos, [])
             if x[2][fund]['T'] >= minimo and x[3].get(fund, 0) > 0]
        c.sort(key=lambda x: -x[3][fund])
        # la eficiencia de recepción es un coeficiente ponderado, no un
        # porcentaje: se muestra sin el signo % a propósito
        return [{'jugador': nm, 'equipo': eq,
                 'dato': '%s %d%s' % (et, e[fund], '%' if pct else '')}
                for eq, nm, J, e in c[:n]]

    s = []
    pa, pb, pr = piso(EQ, NOM, 'ataque'), piso(EQ, NOM, 'bloqueo'), piso(EQ, NOM, 'recepcion')
    for i, x in enumerate(top('PUNTA', 'ataque', pa, 2, 'EFICACIA')):
        s.append(dict(x, puesto='Punta %d' % (i + 1)))
    for i, x in enumerate(top('CENTRAL', 'bloqueo', pb, 2, 'PUNTO BLQ')):
        s.append(dict(x, puesto='Central %d' % (i + 1)))
    for x in top('OPUESTO', 'ataque', pa, 1, 'EFICACIA'):
        s.append(dict(x, puesto='Opuesto'))
    for x in top('LÍBERO', 'recepcion', pr, 1, 'EFICIENCIA', pct=False):
        s.append(dict(x, puesto='Líbero'))
    atk = {t['team']: t.get('atk_all') or 0 for t in equipos}
    # el armador del equipo ideal: el que mas armo del club con mejor ataque
    arms = sorted(cand.get('ARMADOR', []),
                  key=lambda x: (-atk.get(x[0], 0), -x[2]['armado']['T']))
    if arms:
        eq, nm, _, _ = arms[0]
        s.append({'puesto': 'Armador', 'jugador': nm, 'equipo': eq,
                  'dato': 'ATAQUE EQUIPO %d%%' % atk.get(eq, 0)})
    return {'tipo': 'siete', 'slug': 'equipo-ideal', 'fundamento': 'armado', 'liga': LIGA,
            'fecha': fecha, 'titulo': 'El siete ideal de la fecha',
            'bajada': 'Puntas y opuesto por eficacia de ataque; centrales por '
                      'porcentaje de punto de bloqueo; líbero por eficiencia de '
                      'recepción. Con volumen mínimo para entrar.',
            'siete': s, 'fuente': fuente,
            'filtro': {'izq': 'Volumen mínimo',
                       'que': '%d ataques · %d bloqueos · %d recepciones' % (pa, pb, pr),
                       'der': 'por debajo, no entra'},
            'pie': ('El armador es el único puesto sin estadística individual que lo '
                    'mida: va el del equipo con mejor eficacia de ataque colectiva. '
                    'Es una atribución, no una medición.')
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
