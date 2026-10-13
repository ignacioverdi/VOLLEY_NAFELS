#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  gen_ficha.py — LA FICHA DEL JUGADOR
-------------------------------------------------------------------------------
  Escribe datos_ficha.js, que dibuja mi_juego.html: la pantalla del jugador.

  ── QUE CONTESTA ────────────────────────────────────────────────────────────

  Un jugador abre la app y quiere saber tres cosas, en este orden:

      QUE HICE          cuanto sumo o resto en cada partido, en PUNTOS
      COMO ESTOY        contra los de mi puesto en la liga, no contra mi equipo
      QUE MIRO          sus propias jugadas, en video, sin que nadie las corte

  Lo primero y lo segundo no los da ningun sistema de voley del mercado. El
  tercero lo da Hudl, pero lo tiene que armar el entrenador a mano.

  ── EL APORTE: COMO SE MIDE ─────────────────────────────────────────────────

  No es una nota inventada del 1 al 10. Es la misma cuenta que usa la lectura
  del partido, aplicada a un jugador: cuantos RALLIES ganados de mas o de
  menos que lo esperable.

      RECEPCION   lo esperable sale de la tabla de la liga: cada calidad de
                  pase (#, +, !, -, /) da un porcentaje de rallies ganados.
                  Se suma lo esperable de SUS recepciones y se compara con
                  los rallies que de verdad se ganaron con ellas.

      ATAQUE      su eficacia contra la de su PUESTO en la NLA, por la
                  cantidad de ataques. Un punta se compara con puntas.

      SAQUE       sus aces y sus errores contra los de su puesto en la liga.

  Los tres en la misma unidad —puntos— asi que se pueden sumar. Y la suma es
  el aporte del jugador a ese partido.

  BLOQUEO Y DEFENSA NO ENTRAN EN EL APORTE, a proposito: en un partido hay
  dos o tres bloqueos por jugador y con esa muestra cualquier numero es ruido.
  Se muestran como cuenta, que es lo que son.

  ── CONTRA LA LIGA ──────────────────────────────────────────────────────────

  nla_full_stats.json ya trae los 67 jugadores de los 8 equipos de la NLA con
  su puesto y 48 metricas cada uno. Esa base existe desde hace meses y nunca
  se habia usado para esto.

  OJO CON LA MUESTRA: al arrancar la temporada hay seis puntas con 40 ataques
  en toda la liga. Un percentil sobre seis jugadores no significa nada. Por
  eso la ficha muestra PUESTO y PROMEDIO ("4o de 24 - la liga promedia 24%"),
  nunca percentil, y siempre dice sobre cuantas acciones esta hecho. Cuando
  la temporada tenga cuerpo, el percentil entra solo.
===============================================================================
"""
import os
import re
import sys
import json
import glob
import argparse
from collections import defaultdict

import gen_informe as G
import gen_lectura as L

CAL = G.CAL
pct = G.pct
eff = G.eff
esperado = G.esperado

# Cuantas acciones hacen falta, EN UN PARTIDO, para que el aporte se pueda
# medir. Son umbrales bajos a proposito: el aporte se mide en PUNTOS y va
# multiplicado por la cantidad de acciones, asi que una muestra chica produce
# un aporte chico y se limita sola. Con el umbral de una temporada (15) un
# central —que ataca diez pelotas por partido y saca ocho— no tenia ni un
# solo partido medido, y la ficha le quedaba vacia.
MIN = {'atk': 8, 'srv': 8, 'rec': 8, 'blk': 6, 'dig': 10}
# ...y cuantos jugadores tiene que haber en la liga para poder comparar.
MIN_LIGA = 3


def _cuartil(vals, q):
    """El cuartil, por interpolacion lineal. Con cuatro o cinco jugadores por
       puesto no hay lugar para sutilezas estadisticas: esto es solo para
       dibujar donde esta el grueso del puesto."""
    if not vals:
        return None
    v = sorted(vals)
    if len(v) == 1:
        return round(v[0], 1)
    i = (len(v) - 1) * q
    lo, hi = int(i), min(int(i) + 1, len(v) - 1)
    return round(v[lo] + (v[hi] - v[lo]) * (i - lo), 1)


# ── El codigo con el que el VIDEO conoce a este archivo ─────────────────────
def _turno(nombre):
    """Dos entrenamientos el mismo dia: manana y tarde. El .dvw no trae la
       hora, asi que el turno sale del nombre. Devuelve 'M', 'T' o ''."""
    n = (nombre or '').upper()
    base = os.path.splitext(os.path.basename(n))[0]
    if base.endswith('-M'):
        return 'M'
    if base.endswith('-T'):
        return 'T'
    for pal, t in [('MORNING', 'M'), ('MANANA', 'M'), ('MA\u00d1ANA', 'M'), ('MORGEN', 'M'),
                   ('VORMITTAG', 'M'), ('TURNO1', 'M'),
                   ('AFTERNOON', 'T'), ('TARDE', 'T'), ('NACHMITTAG', 'T'), ('ABEND', 'T'),
                   ('EVENING', 'T'), ('NOCHE', 'T'), ('TURNO2', 'T')]:
        if pal in n:
            return t
    for pal, t in [('AM', 'M'), ('T1', 'M'), ('PM', 'T'), ('T2', 'T')]:
        if re.search(r'(?<![A-Z0-9])' + pal + r'(?![A-Z0-9])', n):
            return t
    return ''


def codigo_video(ruta, fecha, tipo):
    """El codigo con el que cortes.html conoce a este archivo.

    Hay DOS esquemas distintos y hay que respetar los dos, porque los arma
    build_video.py y el reel no inventa nada: pide por ese nombre exacto.

        partido         el numero oficial de la liga si el nombre lo trae,
                        y si no  P<fecha>-<nombre limpio, 12 letras>
        entrenamiento   ENT<fecha sin guiones><turno>

    Paso de verdad: antes esto usaba el esquema de partido para todo, asi que
    las practicas salian como 'P2026-09-23-PRAAXPONAFEL' cuando el video las
    tiene como 'ENT20260923'. 53 de 290 clips abrian en cero. Replicado aca y
    no importado porque build_video.py hace mucho mas que esto al cargarse; si
    algun dia cambia alla, el unico efecto es que el boton no encuentra clips.
    """
    base = os.path.basename(ruta)
    m = re.search(r'&?[\s_]*(\d{5,6})(?!\d)', base)
    if m:
        return m.group(1)
    if tipo == 'entrenamiento':
        if fecha:
            return 'ENT' + fecha.replace('-', '') + _turno(base)
        return 'ENT_' + re.sub(r'[^A-Za-z0-9]', '', os.path.splitext(base)[0])[:12]
    return L.codigo_video(ruta, fecha)


# Que acciones entran al reel y de que lado caen. Las letras son las del
# propio .dvw: A ataque, B bloqueo, S saque, R recepcion.
#
# LO QUE SALIO MAL TAMBIEN ENTRA. Antes se guardaban solo los puntos, asi que
# el reel era una cinta de highlights: linda, y la mitad de la historia. Si la
# pantalla dice "el saque te costo 14 puntos", el jugador tiene que poder ver
# esos saques, no solo los aces. Un error es el clip que mas ensena.
CLIP_SK = {'A': 'atk', 'B': 'blk', 'S': 'srv', 'R': 'rec'}
CLIP_BIEN = {'A': ('#',), 'B': ('#',), 'S': ('#',), 'R': ('#', '+')}
CLIP_MAL = {'A': ('=', '/'), 'B': ('=',), 'S': ('=',), 'R': ('=', '/')}


# ── La referencia de la liga, por puesto ────────────────────────────────────
def referencias_liga(ruta):
    """Lo que rinde cada puesto en la NLA: eficacia de ataque, aces y errores
    de saque. Sale de nla_full_stats.json, que ya genera update_db."""
    if not os.path.exists(ruta):
        return {}
    try:
        d = json.load(open(ruta, encoding='utf-8'))
    except Exception:
        return {}
    por_puesto = defaultdict(lambda: {'atk': [], 'ace': [], 'err': [], 'rec': [], 'blk': []})
    for p in d.get('players') or []:
        if (p.get('team') or '').upper() in ('PRUEBA', ''):
            continue
        pos = p.get('pos') or ''
        if not pos:
            continue
        b = por_puesto[pos]
        if (p.get('atk_tot') or 0) >= 40 and p.get('atk_eff') is not None:
            b['atk'].append((p['atk_eff'], p.get('name'), p.get('team')))
        if (p.get('srv_tot') or 0) >= 30:
            if p.get('srv_ace') is not None:
                b['ace'].append((p['srv_ace'], p.get('name'), p.get('team')))
            if p.get('srv_e') is not None:
                b['err'].append((p['srv_e'], p.get('name'), p.get('team')))
        # ── LA COLUMNA TIENE QUE SER LA MISMA QUE SE MIDE ACA ──────────────
        # rec_eff y blk_eff son EFICACIAS (llevan los errores restando). Lo
        # que esta pantalla mide es otra cosa: el porcentaje de recepciones
        # positivas y el porcentaje de bloqueos que terminaron en punto.
        # Comparar una contra la otra es comparar dos cosas distintas y poner
        # el resultado como si fuera un ranking.
        #
        # Paso de verdad: un central con 11.7% de bloqueos punto aparecia
        # "5o de 5, la liga en 43.2" — y el 43.2 era la eficacia de bloqueo,
        # no el porcentaje de puntos. Con la columna que corresponde la liga
        # esta en 16.1 y el numero vuelve a querer decir algo.
        #
        #   rec_perf + rec_pos  las recepciones # y +, que es lo que se mide
        #   blk_k               los bloqueos que fueron punto
        if (p.get('rec_tot') or 0) >= 30 and (p.get('rec_perf') is not None
                                              or p.get('rec_pos') is not None):
            b['rec'].append((round((p.get('rec_perf') or 0) + (p.get('rec_pos') or 0), 1),
                             p.get('name'), p.get('team')))
        if (p.get('blk_tot') or 0) >= 20 and p.get('blk_k') is not None:
            b['blk'].append((p['blk_k'], p.get('name'), p.get('team')))
    out = {}
    for pos, b in por_puesto.items():
        out[pos] = {}
        for k, v in b.items():
            if len(v) >= MIN_LIGA:
                vals = sorted(x[0] for x in v)
                out[pos][k] = {'n': len(vals), 'media': round(sum(vals) / len(vals), 1),
                               'mejor': vals[-1], 'peor': vals[0], 'vals': vals, 'quien': v}
    return out


def puesto_de(num, roster):
    """El puesto del dorsal, como lo escribe el propio .dvw.
       1 Libero · 2 Punta · 3 Opuesto · 4 Central · 5 Armador"""
    return roster.get(num)


MAPA_PUESTO = {1: 'L', 2: 'OH', 3: 'OPP', 4: 'MB', 5: 'S'}
NOMBRE_PUESTO = {'L': 'Libero', 'OH': 'Punta', 'OPP': 'Opuesto', 'MB': 'Central', 'S': 'Armador'}


def roster_del_dvw(txt, seccion):
    """Dorsal -> puesto y apellido, del propio archivo."""
    pos, nom = {}, {}
    for linea in G.seccion(txt, seccion).split('\n'):
        c = linea.split(';')
        if len(c) > 13 and c[1].strip().isdigit():
            n = int(c[1])
            if c[13].strip().isdigit():
                pos[n] = MAPA_PUESTO.get(int(c[13].strip()))
            if len(c) > 9 and c[9].strip():
                nom[n] = c[9].strip()
    return pos, nom


# ── Lo que hizo cada jugador en un partido ──────────────────────────────────
def vacio_jug():
    return {'rec': defaultdict(int), 'rec_g': defaultdict(int),
            'atk': {'n': 0, 'pt': 0, 'err': 0, 'blo': 0},
            'srv': {'n': 0, 'ace': 0, 'err': 0},
            'blk': {'n': 0, 'pt': 0},
            'dig': {'n': 0, 'ok': 0, 'err': 0},
            'clips': []}


def acumular_jugadores(rl, lado, scout_lineas):
    """Todo lo que hizo cada jugador propio, rally por rally.

    El bloqueo y la defensa no vienen en el registro de rallies —ahi solo
    estan el saque, la recepcion y el ataque— asi que se leen del scout
    aparte, con el mismo formato de siempre.
    """
    J = defaultdict(vacio_jug)
    for r in rl:
        gano = (r['gana'] == lado)
        v = r.get('vid') or 0
        s = r.get('set') or 0
        # recepcion
        if r['saca'] != lado and r.get('rec_num') and r.get('rec_cal') in CAL:
            j = J[r['rec_num']]
            j['rec'][r['rec_cal']] += 1
            j['rec_g'][r['rec_cal']] += gano
        # el saque se cuenta mas abajo, leyendo su propia valoracion
        # ataque
        for a in r.get('atk') or []:
            if a['lado'] != lado:
                continue
            j = J[a['num']]
            j['atk']['n'] += 1
            j['atk']['pt'] += (a['res'] == '#')
            j['atk']['err'] += (a['res'] == '=')
            j['atk']['blo'] += (a['res'] == '/')
        # bloqueo
        for b in r.get('blk') or []:
            if b['lado'] != lado:
                continue
            j = J[b['num']]
            j['blk']['n'] += 1
            j['blk']['pt'] += (b['res'] == '#')

    # ── EL SAQUE Y LA DEFENSA SE LEEN DEL SCOUT, NO DEL RALLY ───────────────
    # El ace se contaba como "saque sin linea de recepcion que ganamos". Suena
    # bien y esta mal: un saque que el rival pifia sin tocar tambien queda sin
    # linea de recepcion, y al reves, el ace que el scout valora con # SIEMPRE
    # lo dice en su propio codigo. Contado del rally daban casi todos cero y
    # la tabla de la liga —que lo cuenta del codigo— no coincidia.
    #
    #   *01SQ#   saque del 1, potencia, PUNTO
    #   *01SQ=   saque del 1, potencia, ERROR
    #
    # ── Y LOS CLIPS TAMBIEN ────────────────────────────────────────────────
    # El segundo de video que guarda el rally es el del SAQUE: uno solo para
    # todo el punto. Usarlo para el remate daba un link que cortes.html no
    # podia encontrar —busca la accion exacta, con tolerancia de 0.05 s— y el
    # reel abria con cero clips. Probado: el remate del 1 en Amriswil quedaba
    # apuntando al segundo 4436, que es la recepcion del 20.
    #
    # El segundo de cada accion esta en SU propia linea, campo 12, que es de
    # donde lo saca build_video.py. Leido de ahi, el link cae clavado.
    for linea in scout_lineas:
        campos = linea.split(';')
        cod = campos[0].strip()
        m = re.match(r'^([*a])(\d\d)([SRABDE])(.?)(.?)', cod)
        if not m or m.group(1) != lado:
            continue
        num, fund, ev = int(m.group(2)), m.group(3), m.group(5)
        j = J[num]
        if fund == 'S':
            j['srv']['n'] += 1
            j['srv']['ace'] += (ev == '#')
            j['srv']['err'] += (ev == '=')
        elif fund == 'D':
            j['dig']['n'] += 1
            j['dig']['ok'] += (ev in ('#', '+'))
            j['dig']['err'] += (ev == '=')
        # el clip, si esa accion merece verse y tiene segundo
        if fund not in CLIP_SK:
            continue
        if ev in CLIP_BIEN.get(fund, ()):
            bien = 1
        elif ev in CLIP_MAL.get(fund, ()):
            bien = 0
        else:
            continue
        try:
            t = int(campos[12])
        except Exception:
            continue
        if not t:
            continue
        try:
            st = int(campos[8])
        except Exception:
            st = 0
        j['clips'].append({'t': t, 'num': num, 'sk': CLIP_SK[fund], 'ev': ev,
                           'set': st, 'b': bien})
    return J


def aporte_de(j, ref_rec, liga_pos):
    """Los puntos que el jugador sumo o resto en ese partido.

    Todo en la misma unidad: RALLIES. Por eso se pueden sumar.
    """
    out = {'rec': None, 'atk': None, 'srv': None, 'total': 0.0, 'partes': []}

    # recepcion — contra la tabla de la liga, calidad por calidad
    n = sum(j['rec'].values())
    if n >= MIN['rec'] and ref_rec:
        g = sum(j['rec_g'].values())
        espv = esperado(j['rec'], ref_rec)
        if espv is not None:
            d = g - n * espv / 100.0
            out['rec'] = {'n': n, 'real': pct(g, n), 'esp': espv, 'ap': round(d, 1)}
            out['total'] += d
            out['partes'].append(('rec', round(d, 1)))

    # ataque — contra la eficacia de SU PUESTO en la NLA
    a = j['atk']
    if a['n'] >= MIN['atk']:
        e = eff(a)
        lref = (liga_pos or {}).get('atk')
        if e is not None and lref:
            d = (e - lref['media']) / 100.0 * a['n']
            out['atk'] = {'n': a['n'], 'eff': e, 'liga': lref['media'], 'ap': round(d, 1),
                          'pt': a['pt'], 'err': a['err'], 'blo': a['blo']}
            out['total'] += d
            out['partes'].append(('atk', round(d, 1)))
        elif e is not None:
            out['atk'] = {'n': a['n'], 'eff': e, 'liga': None, 'ap': None,
                          'pt': a['pt'], 'err': a['err'], 'blo': a['blo']}

    # saque — aces y errores contra los de su puesto
    s = j['srv']
    if s['n'] >= MIN['srv']:
        ace = 100.0 * s['ace'] / s['n']
        err = 100.0 * s['err'] / s['n']
        la = (liga_pos or {}).get('ace')
        le = (liga_pos or {}).get('err')
        if la and le:
            d = ((ace - la['media']) + (le['media'] - err)) / 100.0 * s['n']
            out['srv'] = {'n': s['n'], 'ace': s['ace'], 'err': s['err'],
                          'ace_pct': round(ace, 1), 'err_pct': round(err, 1),
                          'liga_ace': la['media'], 'liga_err': le['media'], 'ap': round(d, 1)}
            out['total'] += d
            out['partes'].append(('srv', round(d, 1)))
        else:
            out['srv'] = {'n': s['n'], 'ace': s['ace'], 'err': s['err'],
                          'ace_pct': round(ace, 1), 'err_pct': round(err, 1), 'ap': None}

    out['total'] = round(out['total'], 1)
    return out


# ── Contra la liga, por puesto ──────────────────────────────────────────────
def contra_la_liga(tot, pos, liga, apellido=''):
    """Donde esta parado contra los de su puesto en la NLA.

    PUESTO Y PROMEDIO, nunca percentil: con seis puntas en toda la liga un
    percentil es ruido disfrazado de precision. Y siempre va la muestra al
    lado, para que el numero se pueda leer bien.
    """
    L_ = (liga or {}).get(pos) or {}
    filas = []

    def fila(clave, etiqueta, valor, n, minimo, mas_es_mejor=True):
        ref = L_.get(clave)
        base = {'k': clave, 'lbl': etiqueta, 'v': valor, 'n': n,
                'mas_mejor': mas_es_mejor, 'puesto': None, 'de': None,
                'liga': (ref or {}).get('media'), 'falta': None, 'sin_ref': not ref}
        if not ref:
            # el puesto todavia no tiene con quien compararse en la liga
            return base
        if valor is None or n < minimo:
            base['falta'] = max(0, minimo - n)
            return base
        vals = ref['vals']
        # Si el jugador YA esta en la tabla de la liga, el puesto sale sobre
        # esos mismos; si todavia no entro —porque la tabla y este motor no
        # cuentan igual— se lo agrega, o salia "8o de 7".
        propio = any(nm and apellido and apellido.upper() in str(nm).upper() and
                     str(tm).upper().startswith('NAF') for _v, nm, tm in ref.get('quien', []))
        de = ref['n'] if propio else ref['n'] + 1
        mejores = sum(1 for x in vals if (x > valor if mas_es_mejor else x < valor))
        # El riel del dibujo va de lo PEOR a lo MEJOR de la liga en ese puesto,
        # pero si el jugador quedo afuera de la tabla su valor puede caer fuera
        # del rango y el punto se dibujaria pisando el borde. Por eso lo y hi
        # se calculan INCLUYENDO su propio numero: el riel siempre lo contiene.
        lo = min([ref['peor'], valor]); hi = max([ref['mejor'], valor])
        if hi - lo < 1e-9:
            lo, hi = lo - 1.0, hi + 1.0
        base.update({'falta': 0, 'mejor': ref['mejor'], 'peor': ref['peor'],
                     'lo': round(lo, 1), 'hi': round(hi, 1),
                     'vals': vals, 'q1': _cuartil(vals, .25), 'q3': _cuartil(vals, .75),
                     'puesto': min(mejores + 1, de), 'de': de})
        return base

    a = tot['atk']
    filas.append(fila('atk', 'Ataque', eff(a) if a['n'] else None, a['n'], 40))
    rn = sum(tot['rec'].values())
    rp = pct(tot['rec'].get('#', 0) + tot['rec'].get('+', 0), rn) if rn else None
    filas.append(fila('rec', 'Recepcion', rp, rn, 30))
    s = tot['srv']
    filas.append(fila('ace', 'Saque punto', round(100.0 * s['ace'] / s['n'], 1) if s['n'] else None, s['n'], 30))
    filas.append(fila('err', 'Error de saque', round(100.0 * s['err'] / s['n'], 1) if s['n'] else None,
                      s['n'], 30, mas_es_mejor=False))
    b = tot['blk']
    filas.append(fila('blk', 'Bloqueo punto', pct(b['pt'], b['n']) if b['n'] else None, b['n'], 20))
    # Un central no recibe y un libero no ataca: una fila en cero no es un
    # dato, es una fila que no corresponde. Se muestra solo lo que de verdad
    # juega, aunque todavia no tenga muestra suficiente.
    #
    # El piso es TRES y no una: a un libero el scout le anota un bloqueo
    # suelto en toda la temporada y la pantalla le abria una fila
    # "Bloqueo punto, sobre 1 acciones, 0%". Eso no es informacion, es ruido
    # con cara de dato.
    return [f for f in filas if f['n'] >= 3]


def fuertes_y_flojos(filas):
    """Lo mejor y lo peor del jugador, en palabras, y solo con muestra.

    Es el bloque de Sofascore —tres fuertes, una floja— que funciona porque
    no obliga a leer numeros. Aca ademas se dice contra que: su puesto en la
    NLA, no una opinion.
    """
    con = [f for f in filas if f.get('puesto') and f.get('liga') is not None]
    if not con:
        return {'fuertes': [], 'flojos': []}
    def margen(f):
        d = f['v'] - f['liga']
        return -d if f.get('mas_mejor') is False else d
    con.sort(key=margen, reverse=True)
    fuertes = [f for f in con if margen(f) > 0][:3]
    flojos = [f for f in con if margen(f) < 0][-2:]
    return {'fuertes': [{'k': f['k'], 'lbl': f['lbl'], 'd': round(margen(f), 1),
                         'puesto': f['puesto'], 'de': f['de']} for f in fuertes],
            'flojos': [{'k': f['k'], 'lbl': f['lbl'], 'd': round(margen(f), 1),
                        'puesto': f['puesto'], 'de': f['de']} for f in flojos]}


def mejores_clips(clips, tope=24):
    clips = [c for c in clips if c.get('b')]
    """El reel: sus jugadas, repartidas entre lo que sabe hacer.

    Antes esto ordenaba por habilidad y cortaba en 18, asi que un punta se
    llevaba dieciocho ataques punto y ni un bloqueo: el filtro de arriba
    quedaba con un solo boton y el reel no contaba nada. Ahora se reparte
    por RONDAS —un ataque, un bloqueo, un ace, una recepcion, y otra vuelta—
    asi cada habilidad que de verdad jugo entra en la lista, y dentro de cada
    una van primero las mas recientes.
    """
    orden = {'atk': 0, 'blk': 1, 'srv': 2, 'rec': 3}
    por = {}
    vistos = set()
    for x in clips:
        k = (x['mc'], x['t'], x['num'])
        if k in vistos:
            continue
        vistos.add(k)
        por.setdefault(x['sk'], []).append(x)
    for k in por:
        por[k].sort(key=lambda x: (x.get('fecha') or '', x.get('t') or 0), reverse=True)
    claves = sorted(por, key=lambda k: orden.get(k, 9))
    out, i = [], 0
    while len(out) < tope and any(len(por[k]) > i for k in claves):
        for k in claves:
            if len(por[k]) > i:
                out.append(por[k][i])
                if len(out) >= tope:
                    break
        i += 1
    return out


# ── El recorrido ────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dvw_dir', required=True, help='carpeta de PARTIDOS')
    ap.add_argument('--ent_dir', default=None, help='carpeta de ENTRENAMIENTOS (opcional)')
    ap.add_argument('--liga', default='nla_full_stats.json')
    ap.add_argument('--out', default='datos_ficha.js')
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

    liga = referencias_liga(a.liga)

    fuentes = [(a.dvw_dir, 'partido')] + ([(a.ent_dir, 'entrenamiento')] if a.ent_dir else [])

    # ── primera pasada: la tabla de referencia de la liga para la recepcion
    por_equipo = defaultdict(G.nuevo)
    crudos = []
    vistos = set()
    for carpeta, tipo in fuentes:
        if not carpeta or not os.path.isdir(carpeta):
            continue
        for ruta in sorted(glob.glob(os.path.join(carpeta, '*.dvw'))):
            try:
                txt = G.leer_dvw(ruta)
            except Exception:
                continue
            local, visit = G.equipos_del_partido(txt)
            if not local or not visit:
                continue
            f = L.fecha_de(txt, ruta)
            if tipo == 'partido' and not G.es_de_la_temporada(f, carpeta, a.temporada):
                continue
            rl = L.rallies(txt)
            if not rl:
                continue
            vids = [r['vid'] for r in rl if r['vid']]
            huella = (tipo, len(rl), min(vids) if vids else 0, max(vids) if vids else 0)
            if huella in vistos:
                continue
            vistos.add(huella)
            arm_l = G.armadores_declarados(txt, '3PLAYERS-H')
            arm_v = G.armadores_declarados(txt, '3PLAYERS-V')
            if tipo == 'partido':
                for eq, lado, arm in [(local, '*', arm_l), (visit, 'a', arm_v)]:
                    G.acumular(por_equipo[eq], rl, lado, arm)
                    por_equipo[eq]['partidos'] += 1
            crudos.append({'ruta': ruta, 'tipo': tipo, 'fecha': f, 'local': local,
                           'visit': visit, 'rl': rl, 'txt': txt})

    ref_rec = G.tabla_referencia(por_equipo, 'rec', 'rec_g') if por_equipo else {}

    # ── segunda pasada: jugador por jugador
    JUG = defaultdict(lambda: {'num': None, 'pos': None, 'nombre': '', 'partidos': [],
                               'tot': None, 'clips': []})
    TOT = defaultdict(lambda: {'rec': defaultdict(int), 'rec_g': defaultdict(int),
                               'atk': {'n': 0, 'pt': 0, 'err': 0, 'blo': 0},
                               'srv': {'n': 0, 'ace': 0, 'err': 0},
                               'blk': {'n': 0, 'pt': 0},
                               'dig': {'n': 0, 'ok': 0, 'err': 0}})
    crudos.sort(key=lambda c: (c['fecha'] or '', c['ruta']))

    for c in crudos:
        lado = '*' if c['local'] == propio else ('a' if c['visit'] == propio else None)
        if lado is None:
            continue
        rival = c['visit'] if lado == '*' else c['local']
        mc = codigo_video(c['ruta'], c['fecha'], c['tipo'])
        sec = '3PLAYERS-H' if lado == '*' else '3PLAYERS-V'
        pos_map, nom_map = roster_del_dvw(c['txt'], sec)
        lineas = G.seccion(c['txt'], '3SCOUT').split('\n')
        J = acumular_jugadores(c['rl'], lado, lineas)

        for num, j in J.items():
            if not nom_map.get(num):
                continue
            # LA CLAVE ES EL DORSAL. Con el apellido se juntaban los dos
            # SCHMID del plantel en una sola ficha, con 18 partidos de 9.
            k = num
            d = JUG[k]
            d['num'] = num
            if nom_map[num] and len(nom_map[num]) > len(d['nombre'] or ''):
                d['nombre'] = nom_map[num]
            d['pos'] = d['pos'] or pos_map.get(num)
            # El acumulado que se compara con la liga se arma SOLO con
            # partidos: la tabla de la NLA son partidos, y sumarle los
            # entrenamientos le daba al jugador el doble de muestra que a sus
            # rivales. Los clips, en cambio, salen de todo.
            if c['tipo'] == 'partido':
                T = TOT[k]
                for cal, v in j['rec'].items():
                    T['rec'][cal] += v
                for cal, v in j['rec_g'].items():
                    T['rec_g'][cal] += v
                for sec2 in ('atk', 'srv', 'blk', 'dig'):
                    for kk, vv in j[sec2].items():
                        T[sec2][kk] += vv
            for cl in j['clips']:
                cl2 = dict(cl)
                cl2['mc'] = mc
                cl2['fecha'] = c['fecha']
                cl2['rival'] = rival
                cl2['tipo'] = c['tipo']
                d['clips'].append(cl2)
            if c['tipo'] != 'partido':
                continue
            lp = liga.get(d['pos'] or '') or {}
            apo = aporte_de(j, ref_rec, lp)
            d['partidos'].append({
                'fecha': c['fecha'],
                'fecha_app': '/'.join(reversed((c['fecha'] or '').split('-'))),
                'rival': rival, 'mc': mc,
                'aporte': apo['total'], 'rec': apo['rec'], 'atk': apo['atk'], 'srv': apo['srv'],
                'blk': {'n': j['blk']['n'], 'pt': j['blk']['pt']},
                'dig': {'n': j['dig']['n'], 'ok': j['dig']['ok'], 'err': j['dig']['err']},
            })

    # ── armar la salida
    jugadores = []
    for k, d in JUG.items():
        if not d['partidos'] and not d['clips']:
            continue
        T = TOT[k]
        pos = d['pos']
        # un partido con aporte medible: si no hay ninguno, el total no es
        # cero, es "todavia no se puede decir"
        medidos = [p for p in d['partidos'] if p['rec'] or p['atk'] or p['srv']]
        filas = contra_la_liga(T, pos, liga, d['nombre'])
        jugadores.append({
            'id': str(d['num']), 'num': d['num'], 'nombre': d['nombre'],
            'pos': pos, 'pos_lbl': NOMBRE_PUESTO.get(pos, ''),
            'partidos': d['partidos'],
            'aporte_total': (round(sum(p['aporte'] for p in medidos), 1) if medidos else None),
            'n_medidos': len(medidos),
            'liga': filas,
            'perfil': fuertes_y_flojos(filas),
            'reel': mejores_clips(d['clips']),
            # La lista COMPLETA, ordenada por fecha. Es lo que convierte cada
            # numero de la pantalla en una puerta al video: la celda del saque
            # del 09/10 sabe cuales son sus clips porque estan todos aca.
            # Se corta en 400 por jugador para que el archivo no se vaya de
            # tamano; con nueve partidos nadie llega ni a la mitad.
            'clips': sorted(d['clips'], key=lambda c: (c.get('fecha') or '', c.get('t') or 0))[:400],
            'n_clips': sum(1 for c in d['clips'] if c.get('b')),
            'n_mal': sum(1 for c in d['clips'] if not c.get('b')),
            'tot': {
                'rec_n': sum(T['rec'].values()),
                'rec_pos': pct(T['rec'].get('#', 0) + T['rec'].get('+', 0), sum(T['rec'].values())),
                'atk_n': T['atk']['n'], 'atk_eff': eff(T['atk']),
                'atk_pt': T['atk']['pt'], 'atk_err': T['atk']['err'], 'atk_blo': T['atk']['blo'],
                'srv_n': T['srv']['n'], 'srv_ace': T['srv']['ace'], 'srv_err': T['srv']['err'],
                'blk_n': T['blk']['n'], 'blk_pt': T['blk']['pt'],
                'dig_n': T['dig']['n'], 'dig_ok': T['dig']['ok'],
            },
        })
    jugadores.sort(key=lambda x: (x['num'] or 99))

    datos = {
        'temporada': a.temporada,
        'club': propio,
        'referencia': {c: round(100 * v, 1) for c, v in ref_rec.items()},
        # Del lado del navegador viajan los NUMEROS de cada puesto, nunca los
        # nombres de los jugadores de los otros clubes. Con la lista completa
        # la pantalla puede dibujar el reparto entero —donde esta parado cada
        # uno— en vez de un promedio suelto: un puesto en el que todos andan
        # cerca y otro en el que hay un abismo son dos historias distintas, y
        # con la media sola las dos se ven iguales.
        'liga': {p: {k: {'media': v['media'], 'n': v['n'], 'mejor': v['mejor'],
                         'peor': v['peor'], 'vals': v['vals'],
                         'q1': _cuartil(v['vals'], .25), 'q3': _cuartil(v['vals'], .75)}
                     for k, v in m.items()} for p, m in liga.items()},
        'jugadores': jugadores,
    }
    with open(a.out, 'w', encoding='utf-8') as fh:
        fh.write('window.FICHA_DATA = ' + json.dumps(datos, ensure_ascii=False,
                                                     separators=(',', ':')) + ';\n')

    print('[ficha] %d jugadores -> %s' % (len(jugadores), a.out))
    hay = [p for p in liga if liga[p]]
    print('[ficha] referencia de la liga por puesto: %s' % (', '.join(sorted(hay)) or 'todavia no alcanza'))
    for j in jugadores[:6]:
        ap = ('%+6.1f' % j['aporte_total']) if j['aporte_total'] is not None else '  s/m '
        print('[ficha]   #%-3s %-20s %-8s %2d partidos (%d medidos) · aporte %s · %d clips'
              % (j['num'], j['nombre'][:20], j['pos_lbl'], len(j['partidos']),
                 j['n_medidos'], ap, j['n_clips']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
