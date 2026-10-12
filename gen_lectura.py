#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  gen_lectura.py — LA LECTURA DEL PARTIDO
-------------------------------------------------------------------------------
  Escribe datos_lectura.js, que lectura.js dibuja arriba de analisis.html.

  ── QUE PROBLEMA RESUELVE ───────────────────────────────────────────────────

  La app ya calcula todo lo que hay que calcular. Lo que no hacia era CERRAR:
  mostraba ocho tablas del partido y el entrenador tenia que encontrar solo
  donde se fue el partido. gen_informe.py ya hace esa lectura, pero de la
  TEMPORADA: sirve para "como venimos", no para "que paso el sabado".

  Esto lee cada partido por separado, con el mismo metodo y la misma tabla de
  referencia de la liga, y contesta cuatro preguntas en este orden:

      EL MARGEN   cuanto deberias haber ganado o perdido, y cuanto sacaste
      DONDE       en que set y en que rotacion se fue
      QUE         cual fundamento costo mas puntos, medido en puntos
      QUIEN       que jugador rindio por encima o por debajo de lo suyo

  ── EL LIBRO MAYOR (la parte que no hace ningun software) ───────────────────

  Todos los puntos del partido salen de dos canastas:

      puntos propios  = rallies ganados recibiendo (SO) + rallies ganados
                        sacando (BP)
      puntos del rival = el resto

  Y de cada canasta se sabe cuanto DEBERIA haber salido: el SO esperable sale
  de la calidad con la que se recibio, y el BP esperable de la calidad con la
  que el rival recibio nuestros saques. Las dos referencias se calculan con
  todos los partidos cargados, o sea con el nivel de ESTA liga.

      margen real      = (SO_g + BP_g) - (SO_n - SO_g + BP_n - BP_g)
      margen esperable = lo mismo con los valores esperados

  La diferencia entre los dos se reparte en dos aportes, y la cuenta cierra
  exacta porque cada rally ganado de mas es un punto propio Y un punto que el
  rival no suma — de ahi el factor 2:

      aporte del ataque en cambio de saque = 2 * (SO_g - SO_esperado)
      aporte del saque y el bloqueo        = 2 * (BP_g - BP_esperado)

  Eso convierte "perdimos 0-4" en "perdiste por 32 y el partido daba -18: el
  ataque puso +17 sobre lo esperable y el saque se fue -31". Es la frase que
  un entrenador puede llevar al entrenamiento del lunes.

  ── DE DONDE SALE CADA COSA ─────────────────────────────────────────────────

  Del propio .dvw, los mismos campos que usa gen_informe.py, mas dos:

      campo 8    el SET de la accion      -> para leer set por set
      campo 12   el SEGUNDO DE VIDEO      -> para que cada conclusion se
                                             pueda mirar en video

  El campo 12 es el mismo que usa build_video.py para armar los cortes, asi
  que los clips de la lectura abren cortes.html con el formato que esa
  pantalla ya entiende: codigo-segundo-dorsal.

  NADA de este programa toca los .dvw ni modifica otro archivo. Si falla, la
  app queda exactamente como estaba: lectura.js no dibuja nada cuando no
  encuentra datos.
===============================================================================
"""
import os
import re
import sys
import json
import glob
import argparse
import unicodedata
from collections import defaultdict

# Las piezas de gen_informe.py se REUSAN tal cual, sin tocar ese archivo: la
# lectura de .dvw, el nombre corto de cada equipo, el filtro de temporada, la
# tabla de referencia de la liga y los valores esperados. Si algun dia se
# corrige algo ahi, esto lo hereda.
import gen_informe as G

CAL = G.CAL
pct = G.pct
eff = G.eff
esperado = G.esperado


# ── La fecha ────────────────────────────────────────────────────────────────
def fecha_de(txt, ruta):
    """La fecha del partido, en AAAA-MM-DD.

    gen_informe.py lee [3MATCH] como MM/DD/AAAA, que es lo correcto para los
    archivos con los que se verifico. Pero los .dvw de esta liga vienen con el
    DIA adelante: el partido del 3 de octubre trae 03/10/2026 y leido como mes
    primero da 10 de marzo. En la lectura eso no es un detalle: ordena mal los
    partidos y pone la fecha equivocada en la tarjeta.

    El nombre del archivo SI es inequivoco —AAAA-MM-DD— y es como el club los
    nombra, asi que manda. Solo si el nombre no la trae se recurre a [3MATCH]
    con la logica de gen_informe.
    """
    m = re.search(r'(\d{4})-(\d{1,2})-(\d{1,2})', os.path.basename(ruta))
    if m:
        a, mes, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= mes <= 12 and 1 <= d <= 31:
            return '%04d-%02d-%02d' % (a, mes, d)
    return G.fecha_del_partido(txt, ruta)


def codigo_video(ruta, fecha):
    """El codigo con el que el video conoce a este partido.

    Es el MISMO que arma build_video.py (parse_dvw): primero un numero de 5 o
    6 digitos en el nombre del archivo —el codigo oficial de la liga— y si no
    lo hay, 'P' + fecha + '-' + el nombre limpio cortado en 12. Se replica
    aca en vez de importarlo porque build_video.py hace mucho mas que eso al
    cargarse; si alguna vez cambia alla, esta funcion queda desactualizada y
    el unico efecto es que el boton de video no encuentra clips.
    """
    base = os.path.basename(ruta)
    m = re.search(r'&?[\s_]*(\d{5,6})(?!\d)', base)
    if m:
        return m.group(1)
    t = unicodedata.normalize('NFKD', os.path.splitext(base)[0])
    t = t.encode('ascii', 'ignore').decode()
    t = re.sub(r'[^A-Za-z0-9]+', '', t).upper()[:12] or 'SIN'
    return 'P' + (fecha or 'sinfecha') + '-' + t


# ── El recorrido de los rallies ─────────────────────────────────────────────
def rallies(txt):
    """Un registro por rally, igual que G.rallies() pero guardando tambien el
    SET y el SEGUNDO DE VIDEO, que es lo que permite leer set por set y abrir
    cada conclusion en el video.

    Se escribe aca en vez de modificar gen_informe.py para no tocar un archivo
    que ya funciona y del que depende el informe de temporada.
    """
    out = []
    saque = sn = st = rc = rn = None
    rot_l = rot_v = None
    atk, blk = [], []
    nset = vid = None
    for linea in G.seccion(txt, '3SCOUT').split('\n'):
        c = linea.split(';')
        cod = c[0].strip()
        if not cod:
            continue
        campo = lambda i: (c[i].strip() if len(c) > i else '')

        m = re.match(r'^([*a])(\d\d)S(.)(.)', cod)
        if m:
            saque, sn, st = m.group(1), int(m.group(2)), m.group(3)
            rc = rn = None
            nset = campo(8)
            vid = campo(12)
            if len(c) > 25:
                try:
                    rot_l = [int(x) for x in c[14:20] if x.strip().isdigit()]
                    rot_v = [int(x) for x in c[20:26] if x.strip().isdigit()]
                except Exception:
                    pass
            continue

        m = re.match(r'^([*a])(\d\d)R(.)(.)', cod)
        if m:
            rn, rc = int(m.group(2)), m.group(4)
            continue

        m = re.match(r'^([*a])(\d\d)A(.)(.)', cod)
        if m:
            atk.append({'lado': m.group(1), 'num': int(m.group(2)),
                        'tipo': m.group(3), 'res': m.group(4), 'rec_cal': rc})
            continue

        m = re.match(r'^([*a])(\d\d)B(.)(.)', cod)
        if m:
            blk.append({'lado': m.group(1), 'num': int(m.group(2)), 'res': m.group(4)})
            continue

        m = re.match(r'^([*a])p(\d+):(\d+)', cod)
        if m and saque:
            out.append({'saca': saque, 'gana': m.group(1),
                        'saque_num': sn, 'saque_tipo': st,
                        'rec_num': rn, 'rec_cal': rc,
                        'rot_local': rot_l, 'rot_visit': rot_v,
                        'atk': atk, 'blk': blk,
                        'set': int(nset) if str(nset).isdigit() else 0,
                        'vid': int(vid) if str(vid).isdigit() else 0,
                        'tanto': (int(m.group(2)), int(m.group(3)))})
            saque = sn = st = rc = rn = None
            atk, blk = [], []
    return out


# ── Lo que se acumula de UN partido, de UN lado ─────────────────────────────
def vacio():
    return {
        'so_n': 0, 'so_g': 0, 'bp_n': 0, 'bp_g': 0,
        'rec': defaultdict(int), 'rec_g': defaultdict(int),
        'srv': defaultdict(int), 'srv_g': defaultdict(int),
        'aces': 0, 'srv_err': 0,
        'sets': defaultdict(lambda: {'so_n': 0, 'so_g': 0, 'bp_n': 0, 'bp_g': 0,
                                     'rec': defaultdict(int), 'pf': 0, 'pc': 0}),
        'rot': defaultdict(lambda: {'so_n': 0, 'so_g': 0, 'bp_n': 0, 'bp_g': 0,
                                    'rec': defaultdict(int), 'clips': []}),
        'atk': defaultdict(lambda: {'n': 0, 'pt': 0, 'err': 0, 'blo': 0}),
        'atk_rec': defaultdict(lambda: {'n': 0, 'pt': 0, 'err': 0, 'blo': 0}),
        'jug_rec': defaultdict(lambda: defaultdict(int)),
        'jug_rec_g': defaultdict(lambda: defaultdict(int)),
        'jug_rec_clips': defaultdict(list),
        'jug_atk': defaultdict(lambda: {'n': 0, 'pt': 0, 'err': 0, 'blo': 0, 'clips': []}),
        'clips': defaultdict(list),
    }


def acumular(D, rl, lado, arm):
    """Suma los rallies de un partido desde el punto de vista de 'lado'.

    Misma logica que gen_informe.acumular, con tres agregados: el set, la
    rotacion con sus clips, y la lista de segundos de video de cada cosa que
    salio mal, para poder mirarla.
    """
    for r in rl:
        mio = (r['saca'] == lado)
        gano = (r['gana'] == lado)
        s = r['set']
        v = r['vid']
        rot = G.rotacion_de(r['rot_local'] if lado == '*' else r['rot_visit'], arm)
        fase = 'tr' if mio else 'so'

        D['sets'][s]['pf' if gano else 'pc'] += 1

        for a in r.get('atk') or []:
            if a['lado'] != lado:
                continue
            for d in (D['atk'][fase], D['atk']['tot']):
                d['n'] += 1
                d['pt'] += (a['res'] == '#')
                d['err'] += (a['res'] == '=')
                d['blo'] += (a['res'] == '/')
            j = D['jug_atk'][a['num']]
            j['n'] += 1
            j['pt'] += (a['res'] == '#')
            j['err'] += (a['res'] == '=')
            j['blo'] += (a['res'] == '/')
            if a['res'] in ('=', '/') and v:
                j['clips'].append((v, a['num']))
            if fase == 'so' and a.get('rec_cal') in CAL:
                d2 = D['atk_rec'][a['rec_cal']]
                d2['n'] += 1
                d2['pt'] += (a['res'] == '#')
                d2['err'] += (a['res'] == '=')
                d2['blo'] += (a['res'] == '/')

        if mio:
            D['bp_n'] += 1
            D['bp_g'] += gano
            D['sets'][s]['bp_n'] += 1
            D['sets'][s]['bp_g'] += gano
            if rot:
                D['rot'][rot]['bp_n'] += 1
                D['rot'][rot]['bp_g'] += gano
            c = r['rec_cal']
            if c in CAL:
                D['srv'][c] += 1
                D['srv_g'][c] += gano
            elif c is None:
                if gano:
                    D['aces'] += 1
                else:
                    D['srv_err'] += 1
                    if v and r['saque_num']:
                        D['clips']['srv_err'].append((v, r['saque_num']))
        else:
            D['so_n'] += 1
            D['so_g'] += gano
            D['sets'][s]['so_n'] += 1
            D['sets'][s]['so_g'] += gano
            c = r['rec_cal']
            if rot:
                D['rot'][rot]['so_n'] += 1
                D['rot'][rot]['so_g'] += gano
                if c in CAL:
                    D['rot'][rot]['rec'][c] += 1
                if not gano and v and r['rec_num']:
                    D['rot'][rot]['clips'].append((v, r['rec_num']))
            if c in CAL:
                D['rec'][c] += 1
                D['rec_g'][c] += gano
                D['sets'][s]['rec'][c] += 1
                if r['rec_num']:
                    D['jug_rec'][r['rec_num']][c] += 1
                    D['jug_rec_g'][r['rec_num']][c] += gano
                    if not gano and v:
                        D['jug_rec_clips'][r['rec_num']].append((v, r['rec_num']))
                if c in ('#', '+') and not gano and v and r['rec_num']:
                    D['clips']['rec_desperdiciada'].append((v, r['rec_num']))


# ── El libro mayor ──────────────────────────────────────────────────────────
def libro(D, ref_rec, ref_srv):
    """El margen real contra el margen esperable, repartido en dos aportes.

    La cuenta cierra siempre: margen_real - margen_esperable es exactamente
    aporte_ataque + aporte_saque. No es una estimacion, es una identidad.
    """
    so = pct(D['so_g'], D['so_n'])
    bp = pct(D['bp_g'], D['bp_n'])
    so_e = esperado(D['rec'], ref_rec)
    bp_e = esperado(D['srv'], ref_srv)
    if so is None or bp is None or so_e is None or bp_e is None:
        return None
    g_so_e = D['so_n'] * so_e / 100.0
    g_bp_e = D['bp_n'] * bp_e / 100.0
    mios = D['so_g'] + D['bp_g']
    suyos = (D['so_n'] - D['so_g']) + (D['bp_n'] - D['bp_g'])
    esp_mios = g_so_e + g_bp_e
    return {
        'so': so, 'so_esp': so_e, 'so_n': D['so_n'],
        'bp': bp, 'bp_esp': bp_e, 'bp_n': D['bp_n'],
        'puntos': mios, 'puntos_rival': suyos,
        'margen': mios - suyos,
        'margen_esp': round(2 * esp_mios - (D['so_n'] + D['bp_n']), 1),
        'ap_ataque': round(2 * (D['so_g'] - g_so_e), 1),
        'ap_saque': round(2 * (D['bp_g'] - g_bp_e), 1),
    }


def clips(lista, tope=12):
    """Los segundos de video de una conclusion, en el formato que entiende
    cortes.html: segundo y dorsal. El codigo del partido lo pone lectura.js,
    que es el que sabe de que partido se trata."""
    vistos = []
    for v, num in lista:
        if not v:
            continue
        par = [v, '%02d' % int(num)]
        if par not in vistos:
            vistos.append(par)
    return vistos[:tope]


# ── DONDE: el set y la rotacion ─────────────────────────────────────────────
def donde(D):
    """El set que se fue y la rotacion que mas costo.

    Un set no se lee por su resultado —eso ya se ve en el marcador— sino
    comparandolo con el resto del PROPIO partido: si recibiendo ganabas 7 de
    cada 10 rallies en todo el partido y en el tercero ganaste 4, ahi hubo
    algo, y es algo que paso dentro del mismo partido, con los mismos
    jugadores y el mismo rival. Eso es mucho mas util que compararlo con la
    liga.
    """
    out = {'sets': [], 'rot': [], 'set_clave': None, 'rot_clave': None}
    sets = [s for s in sorted(D['sets']) if s and (D['sets'][s]['so_n'] + D['sets'][s]['bp_n']) >= 8]
    for s in sets:
        v = D['sets'][s]
        out['sets'].append({
            'set': s,
            'pf': v['pf'], 'pc': v['pc'], 'dif': v['pf'] - v['pc'],
            'so': pct(v['so_g'], v['so_n']), 'so_n': v['so_n'],
            'bp': pct(v['bp_g'], v['bp_n']), 'bp_n': v['bp_n'],
            'rec_pos': pct(v['rec'].get('#', 0) + v['rec'].get('+', 0), sum(v['rec'].values())),
        })
    # el set clave: el de peor diferencia, y solo si de verdad se despega
    if len(out['sets']) >= 3:
        peor = min(out['sets'], key=lambda x: x['dif'])
        resto = [x for x in out['sets'] if x['set'] != peor['set']]
        prom = sum(x['dif'] for x in resto) / float(len(resto))
        so_resto = pct(sum(D['sets'][x['set']]['so_g'] for x in resto),
                       sum(D['sets'][x['set']]['so_n'] for x in resto))
        if peor['dif'] <= prom - 4:
            out['set_clave'] = {'set': peor['set'], 'dif': peor['dif'],
                                'so': peor['so'], 'so_resto': so_resto,
                                'bp': peor['bp'], 'prom': round(prom, 1)}
    # la rotacion: cambio de saque por rotacion contra el promedio del partido
    prom_so = pct(sum(v['so_g'] for v in D['rot'].values()),
                  sum(v['so_n'] for v in D['rot'].values()))
    for k in ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']:
        v = D['rot'].get(k)
        if not v or v['so_n'] < 6:
            continue
        p = pct(v['so_g'], v['so_n'])
        out['rot'].append({'rot': k, 'so': p, 'so_n': v['so_n'],
                           'bp': pct(v['bp_g'], v['bp_n']), 'bp_n': v['bp_n'],
                           'rec_pos': pct(v['rec'].get('#', 0) + v['rec'].get('+', 0),
                                          sum(v['rec'].values())),
                           'dif': (v['so_g'] + v['bp_g']) - ((v['so_n'] - v['so_g']) + (v['bp_n'] - v['bp_g'])),
                           'clips': clips(v['clips'])})
    cand = [r for r in out['rot'] if r['so'] is not None and prom_so is not None
            and prom_so - r['so'] >= 12 and r['so_n'] >= 8]
    if cand:
        peor = min(cand, key=lambda x: x['so'])
        out['rot_clave'] = {'rot': peor['rot'], 'so': peor['so'], 'so_n': peor['so_n'],
                            'prom': prom_so, 'clips': peor['clips'],
                            'costo': round((prom_so - peor['so']) / 100.0 * peor['so_n'], 1)}
    return out


# ── QUE: los fundamentos, en puntos del partido ─────────────────────────────
#
#   Cada conclusion sale de aca como un CODIGO con sus numeros, no como una
#   frase. La frase la arma lectura.js en el idioma que tenga puesto la app.
#   La app es trilingue —espanol, ingles, aleman— y el cuerpo tecnico de
#   Nafels no lee espanol: una lectura en un solo idioma no serviria. Ademas
#   asi los numeros quedan separados del texto y se pueden volver a usar.
#
#   El costo siempre es la misma cuenta: la diferencia contra la referencia
#   por las veces que paso. O sea RALLIES, que en voley es lo mismo que
#   puntos. Nada de ponderaciones inventadas: si una conclusion no se puede
#   medir en puntos, no entra.
#
#   Los umbrales son mas chicos que en el informe de temporada porque un
#   partido tiene 60 a 100 recepciones y no 600. Pero ninguna sale con menos
#   de 10 acciones, para que no sea ruido.
# ────────────────────────────────────────────────────────────────────────────
def que(D, R, ref_rec, ref_srv, liga):
    H = []

    def mete(tipo, area, cod, costo, args, cl=None):
        H.append({'tipo': tipo, 'area': area, 'cod': cod,
                  'costo': round(costo, 1), 'd': args, 'clips': cl or []})

    # 1 · las recepciones buenas que no se convirtieron en punto.
    #     Es el reproche mas directo que se le puede hacer a un ataque: la
    #     pelota llego bien y el rally se perdio igual.
    for c in ('#', '+'):
        n = D['rec'].get(c, 0)
        if n < 12 or c not in ref_rec:
            continue
        real = pct(D['rec_g'].get(c, 0), n)
        lg = round(100 * ref_rec[c], 1)
        if real is not None and lg - real >= 8:
            mete('malo', 'ataque', 'rec_no_convertida', (lg - real) / 100.0 * n,
                 {'cal': c, 'real': real, 'liga': lg, 'n': n, 'g': D['rec_g'].get(c, 0)},
                 clips(D['clips']['rec_desperdiciada']))

    # 2 · el bloqueo y la defensa: que hizo el rival con las pelotas que le
    #     costo recibir. Es la unica forma honesta de leer el propio bloqueo,
    #     porque el cambio de saque del rival es el reverso exacto de nuestro
    #     breakpoint. Si el rival recibe mal y gana el rally igual, el saque
    #     hizo su trabajo y el que no lo hizo fue el bloqueo.
    flojas = [c for c in ('!', '-', '/') if c in ref_rec]
    n_f = sum(R['rec'].get(c, 0) for c in flojas)
    g_f = sum(R['rec_g'].get(c, 0) for c in flojas)
    if n_f >= 15:
        real = pct(g_f, n_f)
        esp = esperado({c: R['rec'].get(c, 0) for c in flojas}, ref_rec)
        if real is not None and esp is not None:
            if real - esp >= 4:
                mete('malo', 'bloqueo', 'bloqueo_no_convirtio', (real - esp) / 100.0 * n_f,
                     {'real': real, 'esp': esp, 'n': n_f, 'g': g_f})
            elif esp - real >= 5:
                mete('bueno', 'bloqueo', 'bloqueo_convirtio', (esp - real) / 100.0 * n_f,
                     {'real': real, 'esp': esp, 'n': n_f, 'g': g_f})

    # 3 · el error de saque, contra el promedio de la liga en este torneo
    if D['bp_n'] >= 25 and liga.get('srv_err_pct') is not None:
        p = 100.0 * D['srv_err'] / D['bp_n']
        m = liga['srv_err_pct']
        if p - m >= 4:
            mete('malo', 'saque', 'saque_error_alto', (p - m) / 100.0 * D['bp_n'],
                 {'err': D['srv_err'], 'pct': round(p, 1), 'liga': round(m, 1),
                  'n': D['bp_n'], 'aces': D['aces']},
                 clips(D['clips']['srv_err']))
        elif m - p >= 4:
            mete('bueno', 'saque', 'saque_error_bajo', (m - p) / 100.0 * D['bp_n'],
                 {'err': D['srv_err'], 'pct': round(p, 1), 'liga': round(m, 1),
                  'n': D['bp_n'], 'aces': D['aces']})

    # 4 · el contraataque contra el ataque de cambio de saque.
    #     Atacar despues de una defensa no es lo mismo que atacar despues de
    #     recibir: en el primer caso el equipo esta en desorden. Si la brecha
    #     es grande, el problema es la transicion y no el ataque.
    a_so, a_tr = D['atk'].get('so'), D['atk'].get('tr')
    if a_so and a_tr and a_so['n'] >= 20 and a_tr['n'] >= 20:
        e_so, e_tr = eff(a_so), eff(a_tr)
        if e_so is not None and e_tr is not None and (e_so - e_tr) >= 12:
            mete('malo', 'ataque', 'contraataque_bajo', (e_so - e_tr) / 100.0 * a_tr['n'],
                 {'eff_tr': e_tr, 'eff_so': e_so, 'n_tr': a_tr['n'], 'n_so': a_so['n']})

    # 5 · el ataque bloqueado, contra la liga
    tot = D['atk'].get('tot')
    if tot and tot['n'] >= 40 and liga.get('blo_pct') is not None:
        p = 100.0 * tot['blo'] / tot['n']
        m = liga['blo_pct']
        if p - m >= 3:
            mete('malo', 'ataque', 'muy_bloqueado', (p - m) / 100.0 * tot['n'],
                 {'blo': tot['blo'], 'pct': round(p, 1), 'liga': round(m, 1), 'n': tot['n']})

    # 6 · la calidad de la recepcion propia.
    #     El costo no es la diferencia de porcentaje positivo: es cuanto
    #     cambio de saque se PIERDE por haber recibido asi. Se calcula con la
    #     misma tabla de la liga, comparando la distribucion de calidades
    #     propia contra la distribucion promedio de la liga.
    rec_n = sum(D['rec'].values())
    esp_liga = esperado(liga.get('rec_dist') or {}, ref_rec)
    if rec_n >= 30 and liga.get('rec_pos_pct') is not None and esp_liga is not None:
        p = pct(D['rec'].get('#', 0) + D['rec'].get('+', 0), rec_n)
        m = liga['rec_pos_pct']
        esp_propio = esperado(D['rec'], ref_rec)
        if p is not None and esp_propio is not None and m - p >= 6:
            mete('malo', 'recepcion', 'recepcion_floja',
                 max(0.0, esp_liga - esp_propio) / 100.0 * rec_n,
                 {'pos': p, 'liga': round(m, 1), 'esp': esp_propio, 'esp_liga': esp_liga,
                  'n': rec_n, 'perf': pct(D['rec'].get('#', 0), rec_n),
                  'err': pct(D['rec'].get('=', 0) + D['rec'].get('/', 0), rec_n)})
        elif p is not None and p - m >= 6:
            mete('bueno', 'recepcion', 'recepcion_buena',
                 max(0.0, (esp_propio or 0) - esp_liga) / 100.0 * rec_n,
                 {'pos': p, 'liga': round(m, 1), 'n': rec_n,
                  'perf': pct(D['rec'].get('#', 0), rec_n)})

    # 7 · la presion del saque: con que calidad dejo recibir al rival.
    #     Es la causa mas comun de un breakpoint bajo y no se ve en ninguna
    #     tabla: si el rival recibe comodo, el bloqueo no tiene con que.
    r_n = sum(R['rec'].get(c, 0) for c in CAL)
    if r_n >= 30 and liga.get('rec_pos_pct') is not None and esp_liga is not None:
        rp = pct(R['rec'].get('#', 0) + R['rec'].get('+', 0), r_n)
        m = liga['rec_pos_pct']
        esp_rival = esperado(R['rec'], ref_rec)
        if rp is not None and esp_rival is not None and rp - m >= 6:
            mete('malo', 'saque', 'saque_sin_presion',
                 max(0.0, esp_rival - esp_liga) / 100.0 * r_n,
                 {'pos': rp, 'liga': round(m, 1), 'esp': esp_rival, 'n': r_n})
        elif rp is not None and esp_rival is not None and m - rp >= 6:
            mete('bueno', 'saque', 'saque_con_presion',
                 max(0.0, esp_liga - esp_rival) / 100.0 * r_n,
                 {'pos': rp, 'liga': round(m, 1), 'n': r_n,
                  'incomodo': pct(R['rec'].get('!', 0) + R['rec'].get('-', 0) +
                                  R['rec'].get('/', 0), r_n)})

    H.sort(key=lambda x: -abs(x['costo']))
    return H


# ── QUIEN ───────────────────────────────────────────────────────────────────
def quien(D, ref_rec, nombres):
    """Jugador por jugador, con el mismo metodo: lo que hizo contra lo que se
    esperaba de las pelotas que le toco jugar.

    En recepcion el esperado sale de la calidad de SUS pases; en ataque, de la
    eficacia. Nada de rankings: solo el que se despego para arriba o para
    abajo, que es lo unico que cambia una decision.
    """
    rec, atk = [], []
    for num, cuenta in D['jug_rec'].items():
        n = sum(cuenta.values())
        if n < 10:
            continue
        g = sum(D['jug_rec_g'][num].values())
        e = esperado(cuenta, ref_rec)
        r = pct(g, n)
        rec.append({'num': num, 'nombre': nombres.get(num, '#%d' % num), 'n': n,
                    'so': r, 'so_esp': e,
                    'dif': (round(r - e, 1) if (r is not None and e is not None) else None),
                    'pos': pct(cuenta.get('#', 0) + cuenta.get('+', 0), n),
                    'err': pct(cuenta.get('=', 0) + cuenta.get('/', 0), n),
                    'clips': clips(D['jug_rec_clips'][num], 8)})
    rec.sort(key=lambda x: -(x['n']))
    for num, d in D['jug_atk'].items():
        if d['n'] < 8:
            continue
        atk.append({'num': num, 'nombre': nombres.get(num, '#%d' % num), 'n': d['n'],
                    'eff': eff(d), 'pt': d['pt'], 'err': d['err'], 'blo': d['blo'],
                    'clips': clips(d['clips'], 8)})
    atk.sort(key=lambda x: -(x['n']))
    return {'recepcion': rec, 'ataque': atk}


# ── El plantel del archivo ──────────────────────────────────────────────────
def nombres_de(txt, sec):
    """El apellido de cada dorsal, del propio .dvw. El campo 1 es el numero de
    camiseta y el 9 el apellido, como los escribe DataVolley."""
    out = {}
    for linea in G.seccion(txt, sec).split('\n'):
        c = linea.split(';')
        if len(c) > 9 and c[1].strip().isdigit():
            n = c[9].strip()
            if n:
                out[int(c[1])] = n
    return out


# ── Promedios de la liga, para comparar cada partido ────────────────────────
def promedios(por_equipo):
    """Error de saque, ataque bloqueado y recepcion positiva: el promedio de
    todos los equipos cargados. Es la referencia con la que se mide si un
    numero del partido estuvo bien o mal EN ESTA liga."""
    srv_err = srv_n = 0
    blo = atk_n = 0
    pos = rec_n = 0
    dist = defaultdict(int)
    for D in por_equipo.values():
        for c in CAL:
            dist[c] += D['rec'].get(c, 0)
        srv_err += D['srv_err']
        srv_n += D['bp_n']
        t = D['atk'].get('tot')
        if t:
            blo += t['blo']
            atk_n += t['n']
        rn = sum(D['rec'].values())
        rec_n += rn
        pos += D['rec'].get('#', 0) + D['rec'].get('+', 0)
    return {
        'srv_err_pct': (100.0 * srv_err / srv_n) if srv_n else None,
        'blo_pct': (100.0 * blo / atk_n) if atk_n else None,
        'rec_pos_pct': (100.0 * pos / rec_n) if rec_n else None,
        # La distribucion de calidades de TODA la liga. Sirve para medir
        # cuanto cambio de saque cuesta recibir peor que el promedio: se
        # compara el esperable con la propia calidad contra el esperable con
        # la calidad promedio.
        'rec_dist': dist,
    }


def sets_del_partido(D):
    """Sets ganados y perdidos, contados de los puntos de cada set. El
    marcador del .dvw ([3SET]) no siempre viene completo; los rallies si."""
    g = p = 0
    for s in sorted(D['sets']):
        if not s:
            continue
        v = D['sets'][s]
        if v['pf'] + v['pc'] < 10:
            continue
        if v['pf'] > v['pc']:
            g += 1
        else:
            p += 1
    return g, p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dvw_dir', required=True)
    ap.add_argument('--out', default='datos_lectura.js')
    ap.add_argument('--equipo', default=None)
    ap.add_argument('--temporada', default='')
    a = ap.parse_args()

    propio = a.equipo
    if not propio:
        try:
            import config_club as cc
            propio = cc.equipo_propio()
        except Exception:
            pass

    # ── Primera pasada: acumular la temporada de TODOS, que es de donde sale
    #    la tabla de referencia de la liga. Es el mismo calculo que hace
    #    gen_informe.py, con sus mismas funciones.
    por_equipo = defaultdict(G.nuevo)
    crudos = []
    vistos = set()
    fuera = 0
    for ruta in sorted(glob.glob(os.path.join(a.dvw_dir, '*.dvw'))):
        try:
            txt = G.leer_dvw(ruta)
        except Exception:
            continue
        local, visit = G.equipos_del_partido(txt)
        if not local or not visit:
            continue
        f = fecha_de(txt, ruta)
        if not G.es_de_la_temporada(f, a.dvw_dir, a.temporada):
            fuera += 1
            continue
        rl = rallies(txt)
        if not rl:
            continue
        # El mismo partido scouteado dos veces —pasa cuando se corrige un
        # archivo y queda el anterior— entraba dos veces y ensuciaba la
        # referencia de la liga. La huella del scout lo delata: misma cantidad
        # de rallies y mismo tramo de video.
        vids = [r['vid'] for r in rl if r['vid']]
        huella = (len(rl), min(vids) if vids else 0, max(vids) if vids else 0)
        if huella in vistos:
            continue
        vistos.add(huella)

        arm_l = G.armadores_declarados(txt, '3PLAYERS-H')
        arm_v = G.armadores_declarados(txt, '3PLAYERS-V')
        if not arm_l or not arm_v:
            il, iv = G.armadores_por_acciones(txt)
            if not arm_l:
                arm_l = il
            if not arm_v:
                arm_v = iv
        for eq, lado, arm in [(local, '*', arm_l), (visit, 'a', arm_v)]:
            G.acumular(por_equipo[eq], rl, lado, arm)
            por_equipo[eq]['partidos'] += 1
        crudos.append({'ruta': ruta, 'fecha': f, 'local': local, 'visit': visit,
                       'rl': rl, 'arm': {'*': arm_l, 'a': arm_v},
                       'nom': {'*': nombres_de(txt, '3PLAYERS-H'),
                               'a': nombres_de(txt, '3PLAYERS-V')}})

    if not crudos:
        with open(a.out, 'w', encoding='utf-8') as fh:
            fh.write('window.LECTURA_DATA = ' + json.dumps(
                {'temporada': a.temporada, 'propio': propio or '', 'partidos': [],
                 'temporada_lectura': None}, ensure_ascii=False) + ';\n')
        print('[lectura] no hay partidos de %s en %s' % (a.temporada, a.dvw_dir))
        return 0

    if not propio or propio not in por_equipo:
        propio = max(por_equipo, key=lambda e: por_equipo[e]['partidos'])

    ref_rec = G.tabla_referencia(por_equipo, 'rec', 'rec_g')
    ref_srv = G.tabla_referencia(por_equipo, 'srv', 'srv_g')
    liga = promedios(por_equipo)

    # ── Segunda pasada: leer cada partido del club propio
    partidos = []
    for c in crudos:
        lado = '*' if c['local'] == propio else ('a' if c['visit'] == propio else None)
        if lado is None:
            continue
        otro = 'a' if lado == '*' else '*'
        rival = c['visit'] if lado == '*' else c['local']

        D = vacio()
        acumular(D, c['rl'], lado, c['arm'][lado])
        R = vacio()
        acumular(R, c['rl'], otro, c['arm'][otro])

        L = libro(D, ref_rec, ref_srv)
        if not L:
            continue
        sg, sp = sets_del_partido(D)
        H = que(D, R, ref_rec, ref_srv, liga)

        partidos.append({
            'fecha': c['fecha'],
            'fecha_app': '/'.join(reversed(c['fecha'].split('-'))) if c['fecha'] else '',
            'rival': rival,
            'local': lado == '*',
            'mc': codigo_video(c['ruta'], c['fecha']),
            'sets': '%d-%d' % (sg, sp),
            'libro': L,
            'donde': donde(D),
            'que': H,
            'quien': quien(D, ref_rec, c['nom'][lado]),
        })

    partidos.sort(key=lambda x: x['fecha'], reverse=True)

    # ── La lectura de la temporada, con el mismo molde, para la tarjeta
    #    ACUMULADO de la pantalla
    T = vacio()
    TR = vacio()
    for c in crudos:
        lado = '*' if c['local'] == propio else ('a' if c['visit'] == propio else None)
        if lado is None:
            continue
        acumular(T, c['rl'], lado, c['arm'][lado])
        acumular(TR, c['rl'], 'a' if lado == '*' else '*', c['arm']['a' if lado == '*' else '*'])
    LT = libro(T, ref_rec, ref_srv)
    temporada_lectura = None
    if LT:
        temporada_lectura = {
            'partidos': len(partidos),
            'libro': LT,
            'que': que(T, TR, ref_rec, ref_srv, liga),
            'donde': donde(T),
        }

    datos = {
        'temporada': a.temporada,
        'propio': propio,
        'referencia': {c: round(100 * v, 1) for c, v in ref_rec.items()},
        'referencia_saque': {c: round(100 * v, 1) for c, v in ref_srv.items()},
        'liga': {k: (round(v, 1) if isinstance(v, float) else None)
                 for k, v in liga.items() if k != 'rec_dist'},
        'partidos': partidos,
        'temporada_lectura': temporada_lectura,
    }
    with open(a.out, 'w', encoding='utf-8') as fh:
        fh.write('window.LECTURA_DATA = ' + json.dumps(datos, ensure_ascii=False) + ';\n')

    print('[lectura] %d partidos de %s leidos -> %s%s'
          % (len(partidos), propio, a.out,
             ('  (%d de otra temporada, fuera)' % fuera) if fuera else ''))
    for p in partidos[:3]:
        print('[lectura] %s vs %-14s margen %+d (esperable %+.1f) - ataque %+.1f - saque %+.1f'
              % (p['fecha'], p['rival'][:14], p['libro']['margen'], p['libro']['margen_esp'],
                 p['libro']['ap_ataque'], p['libro']['ap_saque']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
