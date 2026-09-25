#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cuatro formatos nuevos, construidos sobre las pantallas del sistema:
ficha de jugador, mapa de la liga, las seis canchitas y la tabla de la fecha.

Nada de barras. Todo cancha, celda y ficha, como en el producto.
"""
import html, os, pathlib

import idioma
from playwright.sync_api import sync_playwright

# En Windows y Mac, Playwright sabe solo donde dejo el Chromium que bajo
# `playwright install`. La ruta de abajo es la del contenedor Linux donde se
# desarrollo esto: solo se usa si existe. Nunca fijar una ruta a mano.
_CHROMIUM_LINUX = '/opt/pw-browsers/chromium'


def _navegador(pw):
    if os.path.exists(_CHROMIUM_LINUX):
        return pw.chromium.launch(executable_path=_CHROMIUM_LINUX)
    return pw.chromium.launch()

# scouting_rival.html:13
FUNDA = {'saque': '#F59E0B', 'ataque': '#F97316', 'recepcion': '#22C55E',
         'armado': '#818CF8', 'defensa': '#EF4444', 'bloqueo': '#06B6D4'}
BG, CARD, CARD2 = '#07080F', '#0D0E1A', '#111220'
TEXT, MUTED, SUBTLE = '#E2E8F0', '#64748B', '#475569'
BD, BD2 = 'rgba(255,255,255,.07)', 'rgba(255,255,255,.14)'
ROJO = '#E8192C'
GRILLA = [4, 3, 2, 7, 8, 9, 5, 6, 1]
CC_MIN = 2


def esc(s):
    return html.escape(str(s))


def _fuentes():
    """Las tipografías viajan con la carpeta, no se esperan del sistema.

    Poppins está instalada en la máquina donde se diseñó esto, pero en un
    Windows común no está: el navegador la reemplaza por otra y la placa sale
    distinta de la que uno aprobó. Con las fuentes acá al lado, la placa se
    ve igual en cualquier computadora.
    """
    carpeta = pathlib.Path(__file__).resolve().parent / 'fuentes'
    caras = [('Placa', 'Poppins-Light.ttf', 300), ('Placa', 'Poppins-Regular.ttf', 400),
             ('Placa', 'Poppins-Medium.ttf', 500), ('Placa', 'Poppins-Bold.ttf', 700),
             ('PlacaMono', 'DejaVuSansMono.ttf', 400),
             ('PlacaMono', 'DejaVuSansMono-Bold.ttf', 700)]
    out = []
    for familia, archivo, peso in caras:
        f = carpeta / archivo
        if f.exists():
            out.append("@font-face{font-family:'%s';font-weight:%d;font-style:normal;"
                       "src:url('%s') format('truetype')}"
                       % (familia, peso, f.as_uri()))
    return '\n'.join(out)


def _rgb(h):
    h = h.lstrip('#')
    return '%d,%d,%d' % tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def cancha(vals, color, mx=None, tam='', pct=False, red=True):
    """La cancha de nueve zonas, dibujada como una cancha.

    Tres cosas respecto de la versión anterior:
      · la red arriba y la línea de 3 metros punteada entre la primera línea
        y la zaga. Sin eso son nueve cajas, no una cancha.
      · las zonas en cero quedan VACÍAS, con borde punteado. El "0" gris
        ocupaba el mismo peso visual que la información y ensuciaba el mapa.
      · el alfa arranca de hm_ataque.html (ccGrid), como en el producto.
    """
    mx = mx or max(vals) or 1
    tot = sum(vals) or 1
    out = []
    for i, n in enumerate(vals):
        # las tres celdas de la fila del medio llevan la línea de 3 metros
        cls = 'cl l3' if i in (3, 4, 5) else 'cl'
        if not n:
            out.append('<div class="%s vacia"><i>z%d</i></div>' % (cls, GRILLA[i]))
            continue
        if n < CC_MIN:
            bg, tint, sub = 'rgba(255,255,255,.05)', MUTED, SUBTLE
        else:
            bg = 'rgba(%s,%.2f)' % (_rgb(color), 0.16 + (n / mx) * 0.72)
            tint, sub = TEXT, 'rgba(255,255,255,.55)'
        extra = ('<u style="color:%s">%d%%</u>' % (sub, round(100 * n / tot))) if pct and n else ''
        if n == mx and n >= CC_MIN:
            cls += ' pico'
        out.append('<div class="%s" style="background:%s"><i>z%d</i>'
                   '<b style="color:%s">%d</b>%s</div>'
                   % (cls, bg, GRILLA[i], tint, n, extra))
    neta = ('<div class="red" style="border-color:%s"><span>%s</span></div>'
            % (color, idioma.t('red'))) if red else ''
    return '%s<div class="gr %s">%s</div>' % (neta, tam, ''.join(out))


def escala_color(color):
    """Leyenda del degradado. Sin esto no se sabe si el naranja son 7 o 70."""
    pasos = ''.join('<i style="background:rgba(%s,%.2f)"></i>' % (_rgb(color), a)
                    for a in (0.16, 0.34, 0.52, 0.70, 0.88))
    return ('<div class="esc"><span>%s</span>%s<span>%s</span></div>'
            % (idioma.t('menos'), pasos, idioma.t('mas')))


def tiles(ms, color):
    return ''.join('<div class="tl"><span>%s</span><b style="color:%s">%s</b></div>'
                   % (esc(k), color, esc(v)) for k, v in ms)


def barra_filtro(f, color):
    """La línea que dice, arriba del dibujo, QUÉ se está mostrando.

    Sin esto la placa se contradice sola: el encabezado dice "34 saques" y
    la cancha dibuja 10, porque el mapa está filtrado. El que la lee de
    afuera no tiene cómo saberlo. Va siempre, en todas las placas.
    """
    if not f:
        return ''
    der = ('<u>%s</u>' % esc(f['der'])) if f.get('der') else ''
    leg = escala_color(color) if f.get('escala') else ''
    return ('<div class="mapt"><span>%s</span><b style="color:%s">%s</b>%s%s</div>'
            % (esc(f.get('izq', 'En la cancha')), color, esc(f['que']), der, leg))


def vara(v, valor, color, tope=None):
    """La media de la liga marcada debajo del número.

    Un 43% no dice nada solo. Contra una media de 29% dice todo. La barra es
    el jugador, la marquita blanca es la liga, y la escala se estira hasta
    `tope` para que los dos entren siempre."""
    if not v or valor is None:
        return ''
    tope = tope or max(60, valor * 1.25, v['media'] * 1.6)
    return ('<div class="vara"><div class="vb2" style="width:%.0f%%;background:%s"></div>'
            '<div class="mk" style="left:%.0f%%"></div></div>'
            '<div class="vtx">media liga %s</div>'
            % (max(0, min(100, 100.0 * valor / tope)), color,
               max(0, min(100, 100.0 * v['media'] / tope)),
               esc(v.get('etiqueta', '%d' % v['media']))))


# ── A · FICHA DE JUGADOR ───────────────────────────────────────────────────
def ficha(p):
    """Cancha ancha arriba, y abajo la tira de valoraciones tipo tablero.

    Antes las metricas iban en una grilla al costado y competian con la
    cancha. Separadas se leen las dos: arriba DONDE, abajo CON QUE RESULTADO.
    """
    c = FUNDA[p['fundamento']]
    j = p['fichas'][0]
    val = j.get('valoraciones') or []
    tot = sum(v[3] for v in val) or 1

    barra = ''.join('<div style="width:%.2f%%;background:%s"></div>'
                    % (100.0 * n / tot, col)
                    for sim, et, col, n, pc in val if n)
    cajas = ''.join(
        '<div class="vb"><div class="vs" style="color:%s">%s</div>'
        '<div class="ve">%s</div><b>%d</b><i>%d%%</i></div>'
        % (col, esc(sim), esc(et), n, pc) for sim, et, col, n, pc in val)
    # cada tile puede traer un pie (el volumen) y, el primero, la vara de la
    # liga. Formato: (etiqueta, valor, pie|None, vara|None)
    hero = ''
    for t in (j.get('hero') or []):
        k, v = t[0], t[1]
        pie = t[2] if len(t) > 2 else None
        vr = t[3] if len(t) > 3 else None
        extra = vara(vr, vr.get('valor') if vr else None, c) if vr else \
            ('<u>%s</u>' % esc(pie) if pie else '')
        # La variación contra la fecha anterior va PEGADA al número, no en
        # un renglón propio: un renglón más acá hace desbordar la placa
        # entera. Sale sola cuando el historial tiene con qué comparar.
        suf = ''
        if len(t) > 4 and t[4]:
            d = t[4]
            col = '#22C55E' if d['delta'] > 0 else ('#EF4444' if d['delta'] < 0 else MUTED)
            suf = ('<small style="color:%s">%s%d</small>'
                   % (col, '+' if d['delta'] > 0 else '', d['delta']))
        hero += ('<div class="hm"><span>%s</span><b style="color:%s">%s%s</b>%s</div>'
                 % (esc(k), c, esc(v), suf, extra))

    es = ('<img class="es" src="%s" alt="">' % j['escudo']) if j.get('escudo') else ''
    podio = ''
    if j.get('podio'):
        podio = '<div class="podio">%s</div>' % ''.join(
            '<span>%s <b>%s</b> · %s · %s</span>' % (esc(p[0]), esc(p[1]), esc(p[2]), esc(p[3]))
            for p in j['podio'])

    return ('<div class="fi">'
            '<div class="fh"><div class="dor" style="background:%s">%s</div>'
            '<div class="fn"><b>%s</b><span>%s</span></div>%s'
            '<div class="fp"><em style="border-color:%s;color:%s">%s</em>'
            '<span>%s</span></div></div>'
            '%s%s'
            '<div class="heros">%s</div>'
            '<div class="ftt">%s</div>'
            '<div class="tira">%s</div>'
            '<div class="vals">%s</div>%s'
            '</div>'
            % (c, esc(j['dorsal']), esc(j['nombre']), esc(j['equipo']), es,
               c, c, esc(idioma.puesto_ficha(j['puesto'])), esc(j['total']),
               barra_filtro(j.get('filtro'), c), cancha(j['zonas'], c), hero,
               esc(j.get('rotulo_tira', '')), barra, cajas, podio))


# ── B · MAPA DE LA LIGA ────────────────────────────────────────────────────
def mapa(p):
    c = FUNDA[p['fundamento']]
    mx = max(max(e['zonas']) for e in p['equipos']) or 1
    return ('<div class="mapa">%s</div>' %
            ''.join('<div class="mq"><div class="mh"><b>%s</b><span>%d</span></div>%s</div>'
                    % (esc(e['equipo']), sum(e['zonas']), cancha(e['zonas'], c, mx, 'chico'))
                    for e in p['equipos']))


# ── C · LAS SEIS CANCHITAS DEL ARMADOR ─────────────────────────────────────
def seis(p):
    """Como la pantalla del sistema: pelotas armadas arriba, y abajo
    % de distribución - % de punto. Color por zona = por quién remató."""
    c = FUNDA['armado']
    mx = max(x['n'] for r in p['rotaciones'] for x in r['celdas']) or 1
    fuera = sum(r.get('fuera', 0) for r in p['rotaciones'])
    cajas = []
    for r in p['rotaciones']:
        cel = []
        for x in r['celdas']:
            if not x['n']:
                cel.append('<div class="ac vacia"><i>z%d</i></div>' % x['z'])
                continue
            a = 0.22 + (x['n'] / mx) * 0.66
            cel.append('<div class="ac" style="background:rgba(%s,%.2f);'
                       'border-color:rgba(%s,.55)"><i>z%d</i>'
                       '<b>%d</b><u>%d%% · %d%%</u></div>'
                       % (_rgb(x['color']), a, _rgb(x['color']), x['z'], x['n'],
                          x['dist'], x['pto']))
        cajas.append('<div class="sq"><div class="sh">'
                     '<b style="color:%s">%s</b>'
                     '<span>%d %s</span></div>'
                     '<div class="agr">%s</div></div>'
                     % (c, idioma.t('armador_en', esc(r['rot'])), r['total'],
                        idioma.t('balon' if r['total'] == 1 else 'balones'),
                        ''.join(cel)))
    leg = ''.join('<span><i style="background:%s"></i>%s</span>' % (col, esc(et))
                  for et, col in p.get('leyenda', []))
    return ('%s<div class="aleg">%s</div><div class="seis">%s</div>'
            '<div class="anota">%s%s</div>'
            % (barra_filtro(p.get('filtro'), c), leg, ''.join(cajas),
               esc(idioma.t('nota_seis')),
               (' ' + esc(idioma.t('fuera_zona', fuera))) if fuera else ''))


# ── D · TABLA DE LA FECHA ──────────────────────────────────────────────────
def tabla(p):
    cols = p['columnas']
    th = ''.join('<th style="color:%s">%s</th>' % (c.get('color', MUTED), esc(c['t']))
                 for c in cols)
    filas = []
    for i, f in enumerate(p['filas']):
        tds = ''.join('<td style="color:%s;%s">%s</td>'
                      % (c.get('color', TEXT) if c.get('fuerte') else TEXT,
                         'font-weight:700' if c.get('fuerte') else '', esc(f[c['k']]))
                      for c in cols)
        es = ('<img class="jge" src="%s" alt="">' % f['escudo']) \
            if f.get('escudo') else ''
        filas.append('<tr><td class="ix">%d</td><td class="jg">%s'
                     '<span class="jgt"><b>%s</b><span>%s</span></span></td>%s</tr>'
                     % (i + 1, es, esc(f['nombre']), esc(f['equipo']), tds))
    return ('%s<table class="tb"><thead><tr><th></th><th>JUGADOR</th>%s</tr></thead>'
            '<tbody>%s</tbody></table>'
            % (barra_filtro(p.get('filtro'), FUNDA[p['fundamento']]),
               th, ''.join(filas)))


def siete(p):
    """El equipo ideal, dibujado sobre la cancha."""
    j = {x['puesto']: x for x in p['siete']}
    COL = {'Armador': FUNDA['armado'], 'Líbero': FUNDA['bloqueo'],
           'Central 1': FUNDA['bloqueo'], 'Central 2': FUNDA['bloqueo']}

    def cel(pu):
        x = j.get(pu)
        if not x:
            # Un puesto vacio se explica, no se deja en blanco: con pocos
            # partidos puede no haber nadie que pase el piso de volumen.
            return ('<div class="pz vacio"><div class="pu">%s</div>'
                    '<span class="nd">%s</span></div>'
                    % (esc(idioma.puesto(pu)), idioma.t('sin_volumen')))
        c = COL.get(pu, FUNDA['ataque'])
        es = ('<img class="es3" src="%s" alt="">' % x['escudo']) if x.get('escudo') else ''
        # el segundo dato es el que hace honesta la elección: un punta entra
        # por ataque Y recepción, y se ven las dos
        d2 = ('<u>%s</u>' % esc(x['dato2'])) if x.get('dato2') else ''
        return ('<div class="pz" style="border-top-color:%s"><div class="pu">%s</div>'
                '<b>%s</b><div class="pe">%s<span>%s</span></div>'
                '<div class="st" style="color:%s">%s%s</div></div>'
                % (c, esc(idioma.puesto(pu)), esc(x['jugador']), es,
                   esc(x['equipo']), c,
                   esc(x['dato']), d2))

    return (barra_filtro(p.get('filtro'), FUNDA[p['fundamento']]) +
            '<div class="cancha7"><div class="red7">%s</div>'
            '<div class="f3">%s%s%s</div><div class="f3">%s%s%s</div>'
            '<div class="lb">%s</div></div>'
            # formacion real en cancha: adelante punta-central-opuesto,
            # atras central-punta-armador, y el libero abajo
            % (idioma.t('red'), cel('Punta 1'), cel('Central 1'), cel('Opuesto'),
               cel('Central 2'), cel('Punta 2'), cel('Armador'), cel('Líbero')))


# ── E · SIDE-OUT POR ROTACIÓN ──────────────────────────────────────────────
def rotaciones(p):
    """Una fila por equipo: side-out global, break, y las seis rotaciones.

    El verde y el rojo marcan la mejor y la peor rotación de cada equipo, que
    es lo único que un entrenador busca acá: dónde presionar y qué arreglar.
    """
    c = FUNDA[p['fundamento']]
    filas = []
    for f in p['filas']:
        cel = []
        for x in f['celdas']:
            if x['pct'] is None:
                cel.append('<div class="rc vacia"><i>%s</i><b>—</b></div>' % x['rot'])
                continue
            marca = ' mejor' if x['mejor'] else (' peor' if x['peor'] else '')
            cel.append('<div class="rc%s"><i>%s</i><b>%d%%</b><u>%d</u></div>'
                       % (marca, x['rot'], x['pct'], x['n']))
        es = ('<img class="es2" src="%s" alt="">' % f['escudo']) if f.get('escudo') else ''
        # Una sola línea por equipo. Antes iban dos (cabecera arriba, las
        # seis rotaciones abajo) y con cinco equipos ya no entraba: en una
        # fecha real hay ocho y la placa salía cortada.
        filas.append(
            '<div class="rf">%s<div class="rn"><b>%s</b><span>%s</span></div>'
            '<div class="rr">%s</div>'
            '<div class="rg"><em style="color:%s">%d%%</em><span>%s</span></div>'
            '<div class="rg"><em>%d%%</em><span>%s</span></div></div>'
            % (es, esc(f['equipo']),
               '%d %s' % (f['partidos'], idioma.c('partido' if f['partidos'] == 1
                                                  else 'partidos')),
               ''.join(cel), c, f['so'], idioma.c('side_out'),
               f['bp'], idioma.c('break')))
    leyenda = '<div class="anota">%s</div>' % esc(idioma.t('nota_rot'))
    return ('<div class="rot" data-n="%d">%s</div>%s'
            % (len(filas), ''.join(filas), leyenda))


# ── F · PORTADA DE ENGANCHE (TikTok / Reels) ──────────────────────────────
def portada(p):
    """Los dos primeros segundos del corto.

    Sin esto el video arranca con una ficha llena de números y el que pasa
    scrolleando no entiende qué está mirando: sigue de largo antes de la
    primera acción. Acá va una sola idea, enorme, y el dato que engancha.
    """
    c = FUNDA[p['fundamento']]
    d = p.get('dato') or ''
    return ('<div class="port">'
            '<div class="pnum" style="color:%s">%s</div>'
            '<h2>%s</h2>'
            '<div class="pln" style="background:%s"></div>'
            '<div class="pdato">%s</div>'
            '</div>' % (c, esc(p.get('sobre', '')), esc(p.get('gancho', '')),
                        c, esc(d)))


def _fila_res(x, lado, color):
    """Una línea de equipo: escudo, nombre, sus parciales y sus sets.

    Así lo hace cualquier gráfico de resultados profesional: una línea por
    equipo, con los parciales de cada set en columna. No '25-21' junto, que
    obliga a leer dos veces para saber cuál número es de quién."""
    es = x['esc_l'] if lado == 'l' else x['esc_v']
    nom = x['corto_l'] if lado == 'l' else x['corto_v']
    mio = x['sl'] if lado == 'l' else x['sv']
    suyo = x['sv'] if lado == 'l' else x['sl']
    gana = mio > suyo
    sets = ''.join('<i class="%s">%d</i>'
                   % ('g' if (a > b) == (lado == 'l') else '', a if lado == 'l' else b)
                   for a, b in x['parciales'])
    # sin escudo no se deja el hueco: va un disco con las iniciales en el
    # color del club, que es lo que hace cualquier tabla de resultados
    ini = ''.join(w[0] for w in str(nom).split()[:2]).upper() or '?'
    img = ('<img src="%s" alt="">' % es) if es \
        else ('<u style="background:%s">%s</u>' % (color, esc(ini)))
    return ('<div class="rsl%s" style="--cc:%s">'
            '<span class="rsi">%s</span>'
            '<b>%s</b>'
            '<span class="rsn">%s</span>'
            '<em>%d</em></div>'
            % (' gan' if gana else '', color, img, esc(nom), sets, mio))


def resultados(p):
    """Los partidos de la fecha, con el lenguaje de un gráfico de resultados.

    Una línea por equipo, los parciales en columna, el marcador de sets
    grande a la derecha y el color de cada club sacado de su propio escudo.
    Abajo, quién lo definió."""
    filas = []
    for x in p['partidos']:
        cl = x.get('color_l') or '#64748B'
        cv = x.get('color_v') or '#64748B'
        gana = cl if x['sl'] > x['sv'] else cv
        f = x.get('figura')
        fig = ''
        if f:
            fig = ('<div class="rsf"><span class="rsfe">%s</span>'
                   '<b>%s</b><em>%s</em>'
                   '<span class="rsfp"><u>%d</u>%s</span>'
                   '<span class="rsfd">%s</span></div>'
                   % (idioma.t('figura'), esc(f.get('corto') or f['nombre']),
                      esc(f.get('club') or f['equipo']),
                      f['pts'], idioma.t('pts'),
                      idioma.t('desglose', f['atk'], f['blq'], f['ace'])))
        filas.append('<div class="rsp" style="--cg:%s">%s%s%s</div>'
                     % (gana, _fila_res(x, 'l', cl), _fila_res(x, 'v', cv), fig))
    # con tres o cuatro partidos sobra aire: las bandas crecen para llenarlo
    return ('%s<div class="rsc" data-n="%d">%s</div>'
            % (barra_filtro(p.get('filtro'), FUNDA[p['fundamento']]),
               len(filas), ''.join(filas)))


def apertura(p):
    """La primera del carrusel. Dice quién habla y de qué va, y nada más.

    Sin esto el carrusel arranca con una tabla de resultados: el que no nos
    conoce no sabe de dónde salió ni quién la hizo. Con esto, la primera
    imagen que ve es la marca."""
    return ('<div class="ap">'
            '<div class="apl">%s</div>'
            '<div class="apn">%s</div>'
            '<div class="apr"></div>'
            '<div class="apf">%s</div>'
            '<div class="apt">%s</div>'
            '<div class="apd">%s</div>'
            '<div class="apx">%s</div>'
            '</div>'
            % (_marca_grande(), esc(p.get('nombre', 'VOLLEY·STATS')),
               esc(p.get('fecha', '')), esc(p.get('lema', '')),
               esc(_cuantas(p)), idioma.t('deslizar')))


def _cuantas(p):  # noqa: E301
    """'11 placas · 3 partidos · todo del scout'.

    El número de placas se arma al renderizar, no al construir la pieza: en
    ese momento todavía faltaban agregar la mitad y la portada anunciaba
    nueve cuando eran once."""
    return idioma.t('placas_partidos', p.get('total') or 0,
                    p.get('partidos_n') or 0)


def cierre_placa(p):
    """La última. Una sola cosa para hacer y dónde está el producto."""
    return ('<div class="ap">'
            '<div class="apl">%s</div>'
            '<div class="apn">%s</div>'
            '<div class="apr"></div>'
            '<div class="apt">%s</div>'
            '<div class="apc">%s</div>'
            '<div class="apw">%s<span>·</span>%s</div>'
            '</div>'
            % (_marca_grande(), esc(p.get('nombre', 'VOLLEY·STATS')),
               esc(p.get('pitch', '')), esc(p.get('cta2', '')),
               esc(p.get('web', '')), esc(p.get('handle', ''))))


def _chip(p):
    """La barra del jugador, para las placas que no llevan ficha.

    La de armado era la única que no decía de quién hablaba con el mismo
    formato que las demás: el nombre iba perdido adentro de la bajada, en
    gris. Con esto las nueve se identifican igual."""
    j = p.get('chip')
    if not j:
        return ''
    c = FUNDA.get(p.get('fundamento', 'ataque'), ROJO)
    es = ('<img src="%s" alt="">' % j['escudo']) if j.get('escudo') else ''
    return ('<div class="chip" style="border-color:%s">'
            '<span class="chd" style="background:%s">%s</span>'
            '<span class="chn"><b>%s</b><i>%s</i></span>'
            '<span class="che">%s</span>'
            '<span class="chp" style="color:%s;border-color:%s">%s</span>'
            '</div>'
            % (c, c, esc(j.get('dorsal', '')), esc(j.get('nombre', '')),
               esc(j.get('equipo', '')), es, c, c,
               esc(idioma.puesto_ficha(j.get('puesto', '')))))


def _marca_grande():
    try:
        import marca
        return marca.simbolo(ROJO)
    except Exception:
        return ''


def partido(p):
    """Un partido, a sangre, con un cuadro del propio partido de fondo.

    La de resultados cuenta la fecha entera: sirve para el que sigue la liga.
    Esta cuenta UN partido, y por eso la puede compartir el club que lo jugó.
    Son dos trabajos distintos y por eso son dos placas.

    Está armada como las arman los clubes: el cartel de FINAL arriba, los
    colores de los dos escudos como banda, el marcador grande, el set a set
    en tabla y el goleador como bloque propio con su dorsal y sus números.
    El fondo es un fotograma del partido; sin video, el degradé de los dos
    clubes y la placa sale igual."""
    x = p['partido']
    cl, cv = x.get('color_l') or '#64748B', x.get('color_v') or '#64748B'
    gana_l = x['sl'] > x['sv']

    if x.get('fondo'):
        fondo = ('<div class="ptf" style="background-image:url(%s)"></div>'
                 '<div class="ptv"></div>' % x['fondo'])
    else:
        fondo = ('<div class="ptg" style="background:'
                 'radial-gradient(880px 700px at 10% 20%,{cl}55,transparent 60%),'
                 'radial-gradient(880px 700px at 90% 80%,{cv}55,transparent 60%),'
                 'linear-gradient(160deg,#0D0E1A,#07080F)"></div>'
                 .format(cl=cl, cv=cv))
    fondo += ('<div class="ptbn"><i style="background:%s"></i>'
              '<i style="background:%s"></i></div>' % (cl, cv))

    def escudo(es, nom, color):
        dentro = ('<img src="%s" alt="">' % es) if es else (
            '<u>%s</u>' % esc(''.join(w[0] for w in str(nom).split()[:2]).upper() or '?'))
        return '<span class="pthl" style="--c:%s">%s</span>' % (color, dentro)

    # el set a set como tabla: una columna por set, una fila por equipo
    n = len(x['parciales'])
    cab = ''.join('<th>%d</th>' % (i + 1) for i in range(n))
    def fila(lado, nom, color, sets, gana):
        tds = ''.join('<td class="%s">%d</td>'
                      % ('pt' if (a > b) == (lado == 'l') else '',
                         a if lado == 'l' else b)
                      for a, b in x['parciales'])
        return ('<tr class="%s"><td class="eq" style="--c:%s">%s</td>%s'
                '<td class="pt">%d</td></tr>'
                % ('gan' if gana else '', color, esc(nom), tds, sets))
    tabla_sets = ('<table class="ptt"><thead><tr><th class="eq">%s</th>%s'
                  '<th>%s</th></tr></thead><tbody>%s%s</tbody></table>'
                  % (idioma.t('sets_cab'), cab, idioma.t('sets_tot'),
                     fila('l', x['corto_l'], cl, x['sl'], gana_l),
                     fila('v', x['corto_v'], cv, x['sv'], not gana_l)))

    # los puntos totales: el dato que no trae ningún gráfico de resultados
    pt = x.get('puntos') or (0, 0)
    puntos = ''
    if pt[0] or pt[1]:
        tot = float(pt[0] + pt[1]) or 1.0
        puntos = ('<div class="ptpt"><div class="cab"><b>%d</b>&nbsp;%s'
                  '<span class="der">%s&nbsp;<b>%d</b></span></div>'
                  '<div class="br"><i style="width:%.1f%%;background:%s"></i>'
                  '<i style="width:%.1f%%;background:%s"></i></div></div>'
                  % (pt[0], esc(x['corto_l']), esc(x['corto_v']), pt[1],
                     100.0 * pt[0] / tot, cl, 100.0 * pt[1] / tot, cv))

    f = x.get('figura')
    fig = ''
    if f:
        color_f = cl if (f.get('club') or f.get('equipo')) == x['corto_l'] else cv
        dor = str(f.get('dorsal') or '').lstrip('0')
        fig = ('<div class="ptfig" style="--c:%s"><span class="ptl">%s</span>'
               '<div class="ptfr">%s<div class="nm"><b>%s</b><em>%s</em></div>'
               '<div class="big"><u>%d</u><span>%s</span></div></div>'
               '<div class="ptst"><div><u>%d</u><span>%s</span></div>'
               '<div><u>%d</u><span>%s</span></div>'
               '<div><u>%d</u><span>%s</span></div></div></div>'
               % (color_f, idioma.t('figura'),
                  ('<span class="ptdor">%s</span>' % esc(dor)) if dor else '',
                  esc(f.get('corto') or f['nombre']),
                  esc(f.get('club') or f['equipo']),
                  f['pts'], idioma.t('pts'),
                  f['atk'], idioma.c('d_atk'),
                  f['blq'], idioma.c('d_blk'),
                  f['ace'], idioma.c('d_ace')))

    # ── las piezas, iguales para los tres estilos ─────────────────────────
    cabecera = ('<div class="pte"><span class="ptfin" style="background:%s">%s</span>'
                '%s<u></u>%s</div>'
                % (cl if gana_l else cv, idioma.v('final'),
                   esc(p.get('liga', '')), esc(p.get('fecha', ''))))
    marcador_ = ('<div class="ptm">'
                 '<div class="ptc%s">%s<b>%s</b></div>'
                 '<div class="ptr"><span class="%s">%d</span><s>-</s>'
                 '<span class="%s">%d</span></div>'
                 '<div class="ptc%s">%s<b>%s</b></div></div>'
                 % ('' if gana_l else ' perd',
                    escudo(x.get('esc_l'), x['corto_l'], cl), esc(x['corto_l']),
                    '' if gana_l else 'pierde', x['sl'],
                    'pierde' if gana_l else '', x['sv'],
                    ' perd' if gana_l else '',
                    escudo(x.get('esc_v'), x['corto_v'], cv), esc(x['corto_v'])))
    pie = ('<div class="ptpie"><span class="mrc">%s<span><b>VOLLEY&#183;STATS</b>'
           '<br>%s</span></span><span class="dr">%s:<br>%s</span></div>'
           % (_marca(), TXT['firma'], TXT['fuente'], esc(p.get('fuente', ''))))
    datos = '%s%s<div class="ptx">%s%s</div>' % (tabla_sets, puntos, fig, pie)

    estilo = p.get('estilo') or 'estadio'
    img = x.get('fondo')

    if estilo == 'panel' and img:
        # la foto como panel con marco, y el marcador encima de la foto: se
        # ve la jugada, que es lo que le falta a la version a sangre
        return ('<div class="ptw panel">%s'
                '<div class="ptpan"><div class="im" style="background-image:url(%s)">'
                '</div><div class="vl"></div>%s</div>%s</div>'
                % (cabecera, img, marcador_, datos))

    if estilo == 'split' and img:
        # la foto a lo alto de un lado. Es el armado de las plantillas de
        # club: la imagen respira entera y los datos no la pisan
        return ('<div class="ptw split">'
                '<div class="izq"><div class="im" style="background-image:url(%s)">'
                '</div><div class="vl"></div></div>'
                '<div class="der">%s%s%s</div></div>'
                % (img, cabecera, marcador_, datos))

    # estadio (y el respaldo cuando no hay foto)
    return ('%s<div class="ptw">%s%s%s</div>'
            % (fondo, cabecera, marcador_, datos))


VIZ = {'ficha': ficha, 'apertura': apertura, 'cierre': cierre_placa, 'mapa': mapa, 'seis': seis, 'tabla': tabla,
       'resultados': resultados,
       'portada': portada,
       'siete': siete, 'rotaciones': rotaciones, 'partido': partido}

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden}
body.solo{padding:%(PADY)dpx 64px}
body{width:1080px;height:%(ALTO)dpx;background:%(BG)s;color:%(TEXT)s;
  font-family:'Placa','Poppins',sans-serif;padding:%(PADY)dpx 56px 46px;
  display:flex;flex-direction:column}
.eb{font-family:'PlacaMono',monospace;font-size:17px;letter-spacing:.2em;
  color:%(C)s;text-transform:uppercase;margin-bottom:16px;display:flex;
  align-items:center;gap:14px}
.eb::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,%(C)s,transparent);
  opacity:.45}
h1{font-size:58px;line-height:1.02;font-weight:700;letter-spacing:-.028em;
  margin-bottom:13px}
.bj{color:%(MUTED)s;font-size:22px;line-height:1.42;margin-bottom:26px;font-weight:300;
  max-width:92%%}
.zn{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}
.pi{font-size:20px;line-height:1.4;border-left:4px solid %(C)s;padding-left:19px;margin-top:20px}
.ct{margin-top:22px;border-left:4px solid;background:%(CARD)s;border-radius:0 10px 10px 0;
  padding:15px 20px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.ctx b{display:block;font-size:22px;font-weight:600;line-height:1.25}
.ctx span{display:block;color:%(MUTED)s;font-size:18px;line-height:1.3;margin-top:3px}
.ctl{font-family:'PlacaMono',monospace;font-size:16px;font-weight:700;
  letter-spacing:.1em;white-space:nowrap}
.ci{margin-top:auto;padding-top:18px;border-top:1px solid %(BD2)s;display:flex;
  justify-content:space-between;align-items:flex-end;
  font-family:'PlacaMono',monospace;font-size:15px;letter-spacing:.1em;color:%(MUTED)s}
.ci b{color:%(TEXT)s;font-weight:700;letter-spacing:.2em;font-size:20px}
/* ojo: .fi y .fm ya existen (la ficha). Clases propias, no reusadas. */
.ci .mrc{display:flex;align-items:center;gap:13px}
.ci .mrs{width:40px;height:40px;flex:none;display:block}
.ci .mrs svg{width:100%%;height:100%%;display:block}
.ci .dr{text-align:right;line-height:1.6;max-width:640px;font-size:12px;
  letter-spacing:.06em}

/* la red y la linea de 3 metros: lo que hace que parezca una cancha */
.red{border-bottom:3px solid;text-align:center;padding-bottom:5px;margin-bottom:8px}
.red span{font-family:'PlacaMono',monospace;font-size:11px;letter-spacing:.32em;
  color:%(MUTED)s}
.cl.l3{border-top:2px dashed rgba(255,255,255,.22)}
.cl.vacia{background:rgba(255,255,255,.015);border-style:dashed;
  border-color:rgba(255,255,255,.05)}
.cl.pico{border-color:rgba(%(CRGB)s,.85);box-shadow:0 0 0 1px rgba(%(CRGB)s,.5),
  0 6px 22px -6px rgba(%(CRGB)s,.55)}
.cl b{font-variant-numeric:tabular-nums}

/* leyenda de la escala de color */
.esc{margin-left:auto;display:flex;align-items:center;gap:4px;
  font-family:'PlacaMono',monospace;font-size:11px;color:%(SUBTLE)s;
  letter-spacing:.06em;text-transform:none}
.esc i{width:19px;height:9px;border-radius:2px;display:block}

/* celdas de cancha */
.gr{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.cl{aspect-ratio:1.42;border-radius:8px;border:1px solid %(BD)s;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.cl i{position:absolute;top:7px;left:9px;font-family:'PlacaMono',monospace;
  font-size:13px;font-style:normal;color:%(SUBTLE)s;letter-spacing:.08em}
.cl b{font-family:'PlacaMono',monospace;font-size:48px;font-weight:700;line-height:1}
.cl u{font-family:'PlacaMono',monospace;font-size:13px;text-decoration:none;margin-top:3px}
.gr.chico{gap:4px}
.gr.chico .cl{aspect-ratio:1.5;border-radius:5px}
.gr.chico .cl i{font-size:11px;top:5px;left:7px}
.gr.chico .cl b{font-size:26px}
.gr.chico .cl u{font-size:9px;margin-top:1px}

/* A · ficha */
.fi .gr{gap:6px}
.fi .gr .cl{aspect-ratio:4.1;border-radius:7px}
.fi .gr .cl i{font-size:12px;top:6px;left:9px}
.fi .gr .cl b{font-size:38px}
.fi{background:%(CARD)s;border:1px solid %(BD)s;border-radius:16px;padding:20px}
.fh{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.dor{width:46px;height:46px;border-radius:9px;display:flex;align-items:center;
  justify-content:center;font-family:'PlacaMono',monospace;font-size:24px;
  font-weight:700;color:#0A0500}
.fn{flex:1}
.fn b{display:block;font-size:32px;font-weight:700;line-height:1.1;letter-spacing:-.01em}
.fn span{font-family:'PlacaMono',monospace;font-size:14px;color:%(MUTED)s;
  letter-spacing:.09em;text-transform:uppercase}
.es{height:36px;width:auto;max-width:86px;object-fit:contain;flex:none}
.fp{text-align:right}
.fp em{display:inline-block;font-style:normal;font-family:'PlacaMono',monospace;
  font-size:12px;letter-spacing:.12em;border:1px solid;border-radius:99px;padding:3px 11px}
.fp span{display:block;font-family:'PlacaMono',monospace;font-size:14px;
  color:%(MUTED)s;margin-top:6px}

/* la linea que dice que esta mostrando el dibujo */
.mapt{display:flex;align-items:baseline;gap:11px;margin-bottom:10px;
  font-family:'PlacaMono',monospace;font-size:14px;letter-spacing:.11em;
  text-transform:uppercase;line-height:1.3}
.mapt span{color:%(SUBTLE)s;white-space:nowrap}
.mapt b{font-weight:700}
.mapt u{margin-left:auto;text-decoration:none;color:%(MUTED)s;white-space:nowrap}
.ftt{font-family:'PlacaMono',monospace;font-size:14px;letter-spacing:.11em;
  text-transform:uppercase;color:%(SUBTLE)s;margin-bottom:6px}

.heros{display:flex;gap:9px;margin:11px 0 9px}
.hm{flex:1;background:%(CARD2)s;border:1px solid %(BD)s;border-radius:9px;
  padding:11px 14px;text-align:center}
.hm span{display:block;font-family:'PlacaMono',monospace;font-size:12px;
  letter-spacing:.15em;text-transform:uppercase;color:%(MUTED)s;margin-bottom:3px}
.hm b{font-family:'PlacaMono',monospace;font-size:30px;font-weight:700;line-height:1}
.hm b small{font-size:15px;font-weight:700;margin-left:7px;letter-spacing:.04em}
.hm u{display:block;font-family:'PlacaMono',monospace;font-size:12px;
  text-decoration:none;color:%(SUBTLE)s;margin-top:6px;letter-spacing:.06em}
/* la vara: donde cae el contra la media de la liga */
.vara{position:relative;height:5px;border-radius:3px;background:rgba(255,255,255,.07);
  margin:8px 0 4px}
.vb2{position:absolute;left:0;top:0;bottom:0;border-radius:3px}
.mk{position:absolute;top:-3px;width:2px;height:11px;background:%(TEXT)s;opacity:.85}
.vtx{font-family:'PlacaMono',monospace;font-size:11px;color:%(SUBTLE)s;
  letter-spacing:.06em}
/* el 2do y el 3ro, para que la placa sirva de ranking */
.podio{margin-top:11px;display:flex;gap:26px;flex-wrap:wrap;
  font-family:'PlacaMono',monospace;font-size:14px;color:%(MUTED)s;
  letter-spacing:.05em}
.podio b{color:%(TEXT)s;font-weight:700}

.tira{display:flex;height:16px;border-radius:4px;overflow:hidden;gap:2px;margin-bottom:11px}
.vals{display:flex;gap:9px}
.vb{flex:1;background:%(CARD2)s;border:1px solid %(BD)s;border-radius:9px;
  padding:11px 6px;text-align:center}
.vs{font-family:'PlacaMono',monospace;font-size:26px;font-weight:700;line-height:1}
.ve{font-family:'PlacaMono',monospace;font-size:12px;letter-spacing:.14em;
  color:%(MUTED)s;margin:5px 0 8px}
.vb b{display:block;font-family:'PlacaMono',monospace;font-size:33px;
  font-weight:700;line-height:1}
.vb i{display:block;font-family:'PlacaMono',monospace;font-size:15px;
  font-style:normal;color:%(MUTED)s;margin-top:5px}

/* B · mapa de la liga */
.mapa{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 14px}
.mq{background:%(CARD)s;border:1px solid %(BD)s;border-radius:13px;padding:14px}
.mh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}
.mh span{text-align:center}
.mh b{font-size:19px;font-weight:700}
.mh span{font-family:'PlacaMono',monospace;font-size:12px;color:%(MUTED)s}

/* C · las seis del armador */
.aleg{display:flex;gap:22px;margin-bottom:14px;flex-wrap:wrap}
.aleg span{display:flex;align-items:center;gap:8px;font-size:17px;color:%(MUTED)s}
.aleg i{width:13px;height:13px;border-radius:4px;display:block}
.agr{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
/* seis zonas, no nueve: las celdas crecen para llenar el mismo alto */
.ac{aspect-ratio:1.05;border-radius:6px;border:1px solid %(BD)s;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:rgba(255,255,255,.02)}
.ac.vacia{opacity:.5}
.ac i{position:absolute;top:4px;left:6px;font-family:'PlacaMono',monospace;
  font-size:10px;font-style:normal;color:%(SUBTLE)s}
.ac b{font-family:'PlacaMono',monospace;font-size:27px;font-weight:700;line-height:1}
.ac u{font-family:'PlacaMono',monospace;font-size:10px;text-decoration:none;
  color:rgba(255,255,255,.72);margin-top:3px;letter-spacing:.02em}
.anota{margin-top:13px;font-family:'PlacaMono',monospace;font-size:13px;
  color:%(SUBTLE)s;line-height:1.4}

/* B · mapa de la liga */
.seis{display:grid;grid-template-columns:repeat(3,1fr);gap:20px 16px}
.sq{background:%(CARD)s;border:1px solid %(BD)s;border-radius:12px;padding:12px}
.sh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}
.sh b{font-family:'PlacaMono',monospace;font-size:14px;letter-spacing:.09em}
.sh span{font-family:'PlacaMono',monospace;font-size:12px;color:%(MUTED)s}

/* equipo ideal */
.cancha7{display:flex;flex-direction:column;gap:14px;
  border-left:1px solid rgba(255,255,255,.10);border-right:1px solid rgba(255,255,255,.10);
  border-bottom:1px solid rgba(255,255,255,.10);border-radius:0 0 16px 16px;
  padding:0 16px 18px}
.red7{font-family:'PlacaMono',monospace;font-size:13px;letter-spacing:.3em;
  color:%(MUTED)s;border-bottom:2px solid %(C)s;text-align:center;padding-bottom:7px;
  margin-bottom:4px}
.f3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.lb{display:grid;max-width:33%%;margin:0 auto;width:100%%}
.pz{background:%(CARD)s;border:1px solid %(BD)s;border-top:3px solid %(C)s;
  border-radius:12px;padding:20px 13px 18px;text-align:center}
.pu{font-family:'PlacaMono',monospace;font-size:12px;letter-spacing:.15em;
  text-transform:uppercase;color:%(MUTED)s;margin-bottom:8px}
.pz b{display:block;font-size:26px;font-weight:700;line-height:1.15;margin-bottom:3px}
.pz span{display:block;font-family:'PlacaMono',monospace;font-size:12px;
  color:%(MUTED)s;letter-spacing:.06em;text-transform:uppercase}
.pe{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:2px}
.es3{height:17px;width:auto;max-width:46px;object-fit:contain;flex:none}
.st{margin-top:11px;font-family:'PlacaMono',monospace;font-size:19px;font-weight:700}
.st u{display:block;text-decoration:none;font-size:14px;font-weight:400;
  color:%(MUTED)s;margin-top:4px;letter-spacing:.04em}

.pz.vacio{border:1px dashed %(BD2)s;border-top:1px dashed %(BD2)s;background:transparent;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.pz.vacio .pu{margin-bottom:12px}
.nd{font-family:'PlacaMono',monospace;font-size:13px;line-height:1.5;
  color:%(SUBTLE)s;letter-spacing:.06em;text-transform:uppercase;text-align:center}

/* F · portada de enganche */
.port{display:flex;flex-direction:column;justify-content:center;height:100%%;
  text-align:left}
.pnum{font-family:'PlacaMono',monospace;font-size:26px;letter-spacing:.22em;
  text-transform:uppercase;margin-bottom:26px;font-weight:700}
.port h2{font-size:118px;line-height:.94;font-weight:700;letter-spacing:-.035em;
  margin:0 0 34px;text-transform:uppercase}
.pln{width:170px;height:8px;border-radius:4px;margin-bottom:30px}
.pdato{font-size:40px;line-height:1.28;color:%(MUTED)s;font-weight:300;max-width:94%%}

/* E · side-out por rotacion — una linea por equipo */
.rot{display:flex;flex-direction:column;gap:10px}
.rf{background:%(CARD)s;border:1px solid %(BD)s;border-radius:13px;
  padding:11px 16px;display:grid;
  grid-template-columns:56px minmax(128px,1fr) auto 78px 78px;
  align-items:center;gap:11px}
.es2{height:36px;width:auto;max-width:50px;object-fit:contain;
  justify-self:center}
.rn b{display:block;font-size:25px;font-weight:700;line-height:1.1;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rn span{font-family:'PlacaMono',monospace;font-size:11.5px;color:%(SUBTLE)s;
  letter-spacing:.08em;text-transform:uppercase}
.rg{text-align:center}
.rg em{display:block;font-style:normal;font-family:'PlacaMono',monospace;
  font-size:24px;font-weight:700;line-height:1;color:%(TEXT)s}
.rg span{display:block;font-family:'PlacaMono',monospace;font-size:9.5px;
  letter-spacing:.14em;color:%(MUTED)s;margin-top:4px}
.rr{display:grid;grid-template-columns:repeat(6,78px);gap:5px}
.rc{background:%(CARD2)s;border:1px solid %(BD)s;border-top:3px solid %(SUBTLE)s;
  border-radius:8px;padding:6px 3px 5px;text-align:center}
.rc.vacia{opacity:.4;border-top-color:rgba(255,255,255,.08)}
.rc.mejor{border-top-color:#22C55E}
.rc.peor{border-top-color:#EF4444}
.rc i{display:block;font-style:normal;font-family:'PlacaMono',monospace;
  font-size:10.5px;letter-spacing:.1em;color:%(MUTED)s}
.rc b{display:block;font-family:'PlacaMono',monospace;font-size:21px;
  font-weight:700;line-height:1.15}
.rc u{display:block;font-family:'PlacaMono',monospace;font-size:10px;
  text-decoration:none;color:%(SUBTLE)s}
/* con la fecha entera (siete u ocho equipos) se aprieta para que entre */
.rot[data-n="7"],.rot[data-n="8"]{gap:7px}
.rot[data-n="7"] .rf,.rot[data-n="8"] .rf{padding:8px 14px}
.rot[data-n="7"] .rn b,.rot[data-n="8"] .rn b{font-size:23px}
.rot[data-n="7"] .es2,.rot[data-n="8"] .es2{height:33px}
.rot[data-n="7"] .rc b,.rot[data-n="8"] .rc b{font-size:21px}
/* con pocos equipos sobra aire: las filas crecen para llenarlo */
.rot[data-n="2"],.rot[data-n="3"],.rot[data-n="4"]{gap:16px}
.rot[data-n="2"] .rf,.rot[data-n="3"] .rf,.rot[data-n="4"] .rf{padding:19px 18px}
.rot[data-n="2"] .rc,.rot[data-n="3"] .rc,.rot[data-n="4"] .rc{padding:11px 4px 9px}
.rot[data-n="2"] .rc b,.rot[data-n="3"] .rc b,.rot[data-n="4"] .rc b{font-size:27px}
.rot[data-n="2"] .es2,.rot[data-n="3"] .es2,.rot[data-n="4"] .es2{height:46px}

/* D · tabla */
/* la barra del jugador en las placas sin ficha */
.chip{display:flex;align-items:center;gap:16px;background:%(CARD)s;
  border:1px solid;border-radius:14px;padding:12px 18px;margin-bottom:24px}
.chd{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;
  justify-content:center;font-weight:700;font-size:21px;color:#0B0C14;flex:none}
.chn{flex:1;min-width:0}
.chn b{display:block;font-size:27px;font-weight:700;letter-spacing:-.02em;
  line-height:1.1}
.chn i{font-style:normal;font-family:'PlacaMono',monospace;font-size:14px;
  letter-spacing:.14em;color:%(MUTED)s;text-transform:uppercase}
.che{width:40px;height:40px;flex:none;display:flex;align-items:center}
.che img{max-width:100%%;max-height:100%%;display:block}
.chp{font-family:'PlacaMono',monospace;font-size:13px;letter-spacing:.16em;
  border:1px solid;border-radius:999px;padding:6px 14px;flex:none}

/* la placa que abre y la que cierra */
.ap{height:100%%;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;position:relative}
.ap::before{content:'';position:absolute;left:50%%;top:44%%;width:1400px;
  height:1400px;transform:translate(-50%%,-50%%);border-radius:50%%;
  background:radial-gradient(circle,%(CRGB2)s 0%%,transparent 62%%);z-index:0}
.ap>*{position:relative;z-index:1}
.apl{width:232px;height:232px}
.apl svg{width:100%%;height:100%%;display:block}
.apn{font-size:84px;font-weight:700;letter-spacing:-.03em;margin-top:34px;
  line-height:1}
.apr{width:96px;height:5px;border-radius:3px;background:%(C)s;margin:26px 0}
.apf{font-family:'PlacaMono',monospace;font-size:26px;letter-spacing:.24em;
  color:%(TEXT)s;text-transform:uppercase}
.apt{font-size:27px;color:%(MUTED)s;font-weight:300;margin-top:18px;
  line-height:1.4;max-width:760px}
.apd{font-family:'PlacaMono',monospace;font-size:17px;letter-spacing:.14em;
  color:%(MUTED)s;margin-top:40px;text-transform:uppercase}
.apx{position:absolute;bottom:%(APX)dpx;font-family:'PlacaMono',monospace;
  font-size:17px;letter-spacing:.3em;color:%(C)s;border:1px solid %(C)s;
  border-radius:999px;padding:11px 26px}
.apc{margin-top:34px;background:%(C)s;color:#fff;font-weight:700;font-size:26px;
  padding:19px 40px;border-radius:999px}
.apw{position:absolute;bottom:%(APX)dpx;font-family:'PlacaMono',monospace;
  font-size:17px;letter-spacing:.2em;color:%(TEXT)s;display:flex;gap:22px}
.apw span{color:%(SUBTLE)s}

/* el número de placa, para no perderse en el carrusel */
.pg{position:absolute;top:%(PGY)dpx;right:56px;font-family:'PlacaMono',monospace;
  font-size:15px;letter-spacing:.18em;color:%(SUBTLE)s;z-index:5}
.pg b{color:%(TEXT)s;font-weight:700}

/* los resultados de la fecha */
.rsc{display:flex;flex-direction:column;gap:15px}
.rsc[data-n="3"],.rsc[data-n="2"]{gap:20px}
.rsc[data-n="3"] .rsl,.rsc[data-n="2"] .rsl{padding-top:17px;padding-bottom:17px}
.rsc[data-n="3"] .rsl b,.rsc[data-n="2"] .rsl b{font-size:38px}
.rsc[data-n="3"] .rsl em,.rsc[data-n="2"] .rsl em{font-size:64px}
.rsc[data-n="3"] .rsn,.rsc[data-n="2"] .rsn{font-size:28px;grid-auto-columns:58px}
.rsc[data-n="3"] .rsi,.rsc[data-n="2"] .rsi{width:58px;height:58px}
.rsc[data-n="4"] .rsl{padding-top:13px;padding-bottom:13px}
.rsp{border-radius:16px;padding:6px 0 0;overflow:hidden;
  background:linear-gradient(100deg,color-mix(in srgb,var(--cg) 17%%,%(CARD)s) 0%%,
    %(CARD)s 52%%);border:1px solid %(BD)s}
.rsl{display:grid;grid-template-columns:58px 1fr auto 92px;align-items:center;
  gap:18px;padding:11px 20px 11px 22px;position:relative}
.rsl+.rsl{border-top:1px solid rgba(255,255,255,.055)}
.rsl.gan::before{content:'';position:absolute;left:0;top:7px;bottom:7px;
  width:5px;border-radius:0 4px 4px 0;background:var(--cc)}
.rsl .rsi{width:52px;height:52px;display:flex;align-items:center;
  justify-content:center;opacity:.45}
.rsl.gan .rsi{opacity:1}
.rsl .rsi img{max-width:100%%;max-height:100%%;display:block;border-radius:9px}
.rsl .rsi u{text-decoration:none;width:46px;height:46px;border-radius:50%%;
  display:flex;align-items:center;justify-content:center;color:#0B0C14;
  font-family:'Placa',sans-serif;font-weight:700;font-size:19px;
  letter-spacing:-.02em}
.rsl b{font-size:34px;font-weight:600;letter-spacing:-.025em;color:%(SUBTLE)s;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.1}
.rsl.gan b{color:%(TEXT)s;font-weight:700}
.rsn{display:grid;grid-auto-flow:column;grid-auto-columns:54px;
  font-family:'PlacaMono',monospace;font-size:25px;text-align:center}
.rsn i{font-style:normal;color:%(SUBTLE)s;opacity:.7}
.rsn i.g{color:%(TEXT)s;opacity:1;font-weight:700}
.rsl em{font-style:normal;font-family:'PlacaMono',monospace;font-size:56px;
  font-weight:700;line-height:.9;text-align:right;color:%(SUBTLE)s}
.rsl.gan em{color:var(--cc)}

/* quién lo definió */
.rsf{display:flex;align-items:baseline;gap:11px;padding:11px 22px 12px;
  background:rgba(255,255,255,.028);border-top:1px solid %(BD)s;
  font-family:'Placa',sans-serif}
.rsfe{font-family:'PlacaMono',monospace;font-size:11px;letter-spacing:.24em;
  color:var(--cg);flex:none}
.rsf b{font-size:21px;font-weight:700;letter-spacing:-.01em}
.rsf em{font-style:normal;font-size:16px;color:%(MUTED)s;
  font-family:'PlacaMono',monospace;letter-spacing:.08em}
.rsfp{margin-left:auto;font-family:'PlacaMono',monospace;font-size:12px;
  letter-spacing:.16em;color:%(MUTED)s;flex:none}
.rsfp u{text-decoration:none;color:%(TEXT)s;font-size:22px;font-weight:700;
  margin-right:6px}
.rsfd{font-family:'PlacaMono',monospace;font-size:13px;color:%(SUBTLE)s;
  letter-spacing:.06em;flex:none}
.tb{width:100%%;border-collapse:collapse}
.tb th{font-family:'PlacaMono',monospace;font-size:13px;letter-spacing:.13em;
  text-align:center;padding:0 9px 13px;font-weight:400}
.tb th:nth-child(2){text-align:left}
.tb td{padding:9px 9px;border-top:1px solid %(BD)s;text-align:center;
  font-family:'PlacaMono',monospace;font-size:22px;font-variant-numeric:tabular-nums}
.tb tbody tr:first-child td{border-top:none}
.tb tbody tr:nth-child(-n+3) td{background:rgba(255,255,255,.018)}
.tb .ix{color:%(SUBTLE)s;font-size:16px;width:34px;text-align:left}
.tb .jg{text-align:left;font-family:'Placa',sans-serif;display:flex;
  align-items:center;gap:13px}
.tb .jge{width:34px;height:34px;object-fit:contain;flex:none;display:block}
.tb .jgt{display:block;min-width:0;font-family:'Placa',sans-serif;
  letter-spacing:normal;font-size:inherit}
.tb .jg b{display:block;font-size:23px;font-weight:600;line-height:1.15}
.tb .jgt span{font-family:'PlacaMono',monospace;font-size:13px;color:%(MUTED)s;
  letter-spacing:.08em;text-transform:uppercase}

/* ══ LA PLACA DE UN PARTIDO ════════════════════════════════════════════════
   A sangre, con el fotograma del propio partido. Lo que la hace parecer de
   club y no de planilla, mirando como las hacen los clubes de verdad:
     · el cartel FINAL, que ubica de que se trata antes de leer nada
     · los colores de los dos clubes como banda, que es lo que ancla la
       identidad cuando la foto es gris
     · el set a set como TABLA, una columna por set: se lee de corrido
     · el goleador como bloque con su dorsal y sus tres numeros, no como
       una linea al pie
   En 9:16 hay 570 px mas de alto: se los queda el bloque del jugador, que
   es la parte que se comparte. */
body.pt{padding:0;display:block;position:relative;overflow:hidden}
.ptf{position:absolute;inset:0;background-size:cover;background-position:center;
  filter:saturate(.9) contrast(1.06)}
.ptv{position:absolute;inset:0;background:
  linear-gradient(180deg,rgba(7,8,15,.88) 0%%,rgba(7,8,15,.42) 26%%,
                  rgba(7,8,15,.78) 58%%,rgba(7,8,15,.985) 88%%)}
.ptg{position:absolute;inset:0}
/* la banda de los dos clubes: el recurso de toda grafica deportiva */
.ptbn{position:absolute;left:0;right:0;top:0;height:9px;display:flex}
.ptbn i{flex:1;display:block}
.ptw{position:relative;height:100%%;display:flex;flex-direction:column;
  padding:74px 60px 50px}

.pte{display:flex;align-items:center;gap:16px;font-family:'PlacaMono',monospace;
  font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:%(SUBTLE)s}
.ptfin{font-weight:700;letter-spacing:.24em;color:#fff;background:%(C)s;
  padding:7px 15px;border-radius:8px;font-size:15px;flex:none}
.pte u{flex:1;height:1px;background:%(BD2)s;text-decoration:none}

.ptm{margin-top:auto;display:grid;grid-template-columns:1fr auto 1fr;
  align-items:center;gap:18px}
.ptc{display:flex;flex-direction:column;align-items:center;gap:18px;min-width:0}
.pthl{width:210px;height:210px;border-radius:50%%;display:grid;place-items:center;
  background:rgba(7,8,15,.55);border:3px solid var(--c);
  box-shadow:0 0 0 10px rgba(7,8,15,.35),0 16px 40px rgba(0,0,0,.6)}
.pthl img{width:150px;height:150px;object-fit:contain;display:block}
.pthl u{text-decoration:none;font-size:80px;font-weight:700;color:#fff}
.ptc b{font-size:42px;font-weight:700;letter-spacing:-.025em;text-align:center;
  line-height:1.04;text-shadow:0 3px 16px rgba(0,0,0,.85)}
.ptc.perd{opacity:.55}
.ptr{display:flex;align-items:center;gap:16px;font-weight:700;
  font-size:150px;line-height:1;letter-spacing:-.055em;
  font-variant-numeric:tabular-nums;text-shadow:0 6px 26px rgba(0,0,0,.9)}
.ptr s{text-decoration:none;color:%(SUBTLE)s;font-size:70px;font-weight:500}
.ptr .pierde{color:rgba(226,232,240,.45)}

/* el set a set, como tabla: una columna por set */
.ptt{width:100%%;border-collapse:collapse;margin-top:40px;
  background:rgba(7,8,15,.62);border:1px solid %(BD2)s;border-radius:16px;
  overflow:hidden;backdrop-filter:blur(7px)}
.ptt th{font-family:'PlacaMono',monospace;font-size:13px;letter-spacing:.16em;
  color:%(SUBTLE)s;font-weight:500;padding:12px 0 8px;text-transform:uppercase}
.ptt th.eq{text-align:left;padding-left:22px}
.ptt td{font-family:'PlacaMono',monospace;font-size:30px;font-weight:600;
  font-variant-numeric:tabular-nums;text-align:center;padding:11px 0;
  color:rgba(226,232,240,.5)}
.ptt td.eq{text-align:left;padding-left:22px;font-family:'Placa',sans-serif;
  font-size:25px;font-weight:600;letter-spacing:-.01em;color:%(TEXT)s;
  border-left:5px solid var(--c)}
.ptt tr.gan td{color:%(TEXT)s}
.ptt tr.gan td.pt{color:#fff}
.ptt tbody tr+tr td{border-top:1px solid %(BD)s}

/* los puntos totales del partido: el dato que llena el medio y que ningun
   grafico de resultados trae. Un set 25-23 y otro 25-12 dan el mismo 1-0 y
   partidos completamente distintos; esto lo dice de un vistazo. */
.ptpt{margin-top:26px;background:rgba(7,8,15,.62);border:1px solid %(BD2)s;
  border-radius:16px;padding:18px 22px;backdrop-filter:blur(7px)}
.ptpt .cab{display:flex;align-items:baseline;font-family:'PlacaMono',monospace;
  font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:%(SUBTLE)s}
.ptpt .cab b{color:%(TEXT)s;font-family:'Placa',sans-serif;font-size:26px;
  font-weight:700;letter-spacing:-.01em}
.ptpt .cab .der{margin-left:auto}
.ptpt .br{display:flex;height:14px;border-radius:7px;overflow:hidden;margin-top:12px;
  background:rgba(255,255,255,.06)}
.ptpt .br i{display:block;height:100%%}
body.pt.alta .ptpt{margin-top:34px;padding:22px 26px}
body.pt.alta .ptpt .cab b{font-size:30px}

/* el jugador del partido: bloque, con dorsal y sus tres numeros */
.ptx{margin-top:auto;padding-top:34px}
.ptfig{border-radius:20px;background:rgba(7,8,15,.74);border:1px solid %(BD2)s;
  backdrop-filter:blur(9px);overflow:hidden}
.ptfig .ptl{display:block;font-family:'PlacaMono',monospace;font-size:13px;
  letter-spacing:.2em;text-transform:uppercase;color:#fff;background:var(--c);
  padding:9px 22px}
.ptfr{display:flex;align-items:center;gap:20px;padding:22px}
.ptdor{font-family:'PlacaMono',monospace;font-size:38px;font-weight:700;
  color:#fff;background:var(--c);width:74px;height:74px;border-radius:16px;
  display:grid;place-items:center;flex:none;font-variant-numeric:tabular-nums}
.ptfr .nm{min-width:0}
.ptfr .nm b{display:block;font-size:38px;font-weight:700;letter-spacing:-.025em;
  line-height:1.1}
.ptfr .nm em{font-style:normal;font-family:'PlacaMono',monospace;font-size:15px;
  color:%(MUTED)s;letter-spacing:.12em;text-transform:uppercase}
.ptfr .big{margin-left:auto;text-align:right;flex:none}
.ptfr .big u{text-decoration:none;font-size:58px;font-weight:700;line-height:1;
  font-variant-numeric:tabular-nums}
.ptfr .big span{display:block;font-family:'PlacaMono',monospace;font-size:13px;
  letter-spacing:.2em;color:%(MUTED)s;margin-top:4px}
.ptst{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid %(BD)s}
.ptst div{padding:15px 0;text-align:center;border-left:1px solid %(BD)s}
.ptst div:first-child{border-left:none}
.ptst u{text-decoration:none;display:block;font-size:30px;font-weight:700;
  font-variant-numeric:tabular-nums}
.ptst span{font-family:'PlacaMono',monospace;font-size:12px;letter-spacing:.2em;
  color:%(MUTED)s;text-transform:uppercase}

/* 9:16 · el alto de mas va al bloque del jugador, que es lo que se comparte */
body.pt.alta .ptw{padding:120px 60px 90px}
body.pt.alta .pthl{width:250px;height:250px}
body.pt.alta .pthl img{width:180px;height:180px}
body.pt.alta .ptr{font-size:176px}
body.pt.alta .ptc b{font-size:48px}
body.pt.alta .ptt td{font-size:34px;padding:14px 0}
body.pt.alta .ptfr{padding:28px}
body.pt.alta .ptfr .nm b{font-size:44px}
body.pt.alta .ptfr .big u{font-size:70px}
body.pt.alta .ptst div{padding:20px 0}
body.pt.alta .ptst u{font-size:36px}

/* ══ TRES ESTILOS PARA LA MISMA PLACA ══════════════════════════════════════
   Cambian donde vive la foto, que es lo unico que de verdad cambia como se
   ve. Se elige en partido.ESTILO.

     estadio  la foto a sangre detras de todo (la primera que hicimos)
     panel    la foto como panel con marco arriba, y los datos debajo
     split    la foto a lo alto de un lado, los datos del otro           */

/* ── PANEL ─────────────────────────────────────────────────────────────── */
.ptw.panel{padding:56px 52px 46px}
.ptw.panel .ptpan{border-radius:20px;overflow:hidden;position:relative;
  margin-top:22px;height:430px;flex:none;border:1px solid %(BD2)s}
body.pt.alta .ptw.panel .ptpan{height:700px}
.ptw.panel .ptpan .im{position:absolute;inset:0;background-size:cover;
  background-position:center}
.ptw.panel .ptpan .vl{position:absolute;inset:0;background:
  linear-gradient(180deg,rgba(7,8,15,.22) 0%%,rgba(7,8,15,.05) 42%%,
                  rgba(7,8,15,.92) 100%%)}
/* el marcador vive DENTRO del panel, sobre la foto, abajo */
.ptw.panel .ptm{position:absolute;left:0;right:0;bottom:26px;margin:0;
  padding:0 28px;gap:12px}
.ptw.panel .pthl{width:132px;height:132px;border-width:3px}
.ptw.panel .pthl img{width:92px;height:92px}
.ptw.panel .pthl u{font-size:52px}
.ptw.panel .ptc{gap:11px}
.ptw.panel .ptc b{font-size:31px}
.ptw.panel .ptr{font-size:104px}
.ptw.panel .ptr s{font-size:48px}
body.pt.alta .ptw.panel .pthl{width:160px;height:160px}
body.pt.alta .ptw.panel .pthl img{width:112px;height:112px}
body.pt.alta .ptw.panel .ptr{font-size:126px}
body.pt.alta .ptw.panel .ptc b{font-size:36px}
.ptw.panel .ptt{margin-top:20px}
.ptw.panel .ptx{padding-top:20px}

/* ── SPLIT ─────────────────────────────────────────────────────────────── */
.ptw.split{padding:0;display:grid;grid-template-columns:44%% 56%%;
  grid-template-rows:100%%;height:100%%;align-items:stretch}
.ptw.split .izq{position:relative;overflow:hidden;height:100%%;min-height:0}
.ptw.split .izq .im{position:absolute;inset:0;background-size:cover;
  background-position:center}
.ptw.split .izq .vl{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(7,8,15,.30),rgba(7,8,15,.05) 55%%,rgba(7,8,15,.55))}
.ptw.split .der{padding:56px 46px 44px;display:flex;flex-direction:column;
  background:linear-gradient(180deg,#0B0D18,#07080F);min-width:0}
.ptw.split .pte{flex-wrap:wrap;gap:10px;font-size:13px}
.ptw.split .pte u{flex-basis:100%%;height:0;background:none;margin:0}
.ptw.split .ptm{grid-template-columns:1fr;gap:14px;text-align:center;margin-top:34px}
.ptw.split .ptc{flex-direction:row;gap:14px;justify-content:center}
.ptw.split .pthl{width:88px;height:88px;border-width:3px}
.ptw.split .pthl img{width:60px;height:60px}
.ptw.split .pthl u{font-size:34px}
.ptw.split .ptc b{font-size:31px;text-align:left}
.ptw.split .ptr{justify-content:center;font-size:110px}
.ptw.split .ptr s{font-size:46px}
.ptw.split .ptt,.ptw.split .ptpt,.ptw.split .ptfig{flex:none}
.ptw.split .ptt td{font-size:24px}
.ptw.split .ptt td.eq{font-size:20px}
.ptw.split .ptfr{padding:18px}
.ptw.split .ptfr .nm b{font-size:30px}
.ptw.split .ptfr .big u{font-size:46px}
.ptw.split .ptdor{width:60px;height:60px;font-size:30px}
.ptw.split .ptst u{font-size:25px}
body.pt.alta .ptw.split .der{padding:90px 46px 70px}
body.pt.alta .ptw.split .ptr{font-size:132px}
body.pt.alta .ptw.split .pthl{width:104px;height:104px}
body.pt.alta .ptw.split .pthl img{width:72px;height:72px}

.ptpie{display:flex;align-items:flex-end;gap:18px;margin-top:26px;
  padding-top:18px;border-top:1px solid %(BD2)s}
.ptpie .mrc{display:flex;align-items:center;gap:13px;
  font-family:'PlacaMono',monospace;font-size:15px;letter-spacing:.1em;
  color:%(MUTED)s}
.ptpie .mrc b{color:%(TEXT)s;font-weight:700;letter-spacing:.2em;font-size:20px}
.ptpie .mrs{width:40px;height:40px;flex:none;display:block}
.ptpie .mrs svg{width:100%%;height:100%%;display:block}
.ptpie .dr{margin-left:auto;font-family:'PlacaMono',monospace;font-size:13px;
  color:%(SUBTLE)s;text-align:right;line-height:1.5}
"""

TXT = {'firma': idioma.t('firma'), 'fuente': idioma.t('fuente')}

# El mensaje cambia segun lo que muestra la placa: no es el mismo gancho
# ver la ficha de un jugador que el mapa entero de la liga.
CTA = {'ficha': idioma.t('cta_ficha'), 'mapa': idioma.t('cta_mapa'),
       'seis': idioma.t('cta_seis'), 'tabla': idioma.t('cta_tabla'),
       'siete': idioma.t('cta_siete'),
       'rotaciones': idioma.t('cta_rotaciones')}


def _marca(_c=None):
    """El símbolo del canal, chiquito, en el pie de cada placa.

    Va en todas para que la marca se reconozca sin leer: a la quinta placa
    que ven, el símbolo ya dice de quién es. Se importa acá adentro y no
    arriba porque marca.py importa este módulo."""
    try:
        import marca
        # siempre en el rojo de la marca, no en el color de la placa: el
        # símbolo tiene que ser siempre el mismo para que se reconozca
        return '<i class="mrs">%s</i>' % marca.simbolo(ROJO)
    except Exception:
        return ''


def render(p, alto=1350):
    c = FUNDA.get(p.get('fundamento', 'ataque'), ROJO)
    css = CSS % {'BG': BG, 'CARD': CARD, 'CARD2': CARD2, 'TEXT': TEXT, 'MUTED': MUTED,
                 'SUBTLE': SUBTLE, 'BD': BD, 'BD2': BD2, 'C': c, 'CRGB': _rgb(c),
                 'ALTO': alto, 'PADY': 60 if alto <= 1400 else 150,
                 'CRGB2': 'rgba(%s,.13)' % _rgb(c),
                 'APX': 74 if alto <= 1400 else 150,
                 'PGY': 58 if alto <= 1400 else 130}
    # el número de placa: en un carrusel de once, sin esto no sabés dónde
    # estás ni cuánto falta
    pg = ('<div class="pg"><b>%02d</b> / %02d</div>'
          % (p['nro'], p['total'])) if p.get('nro') and p.get('total') else ''
    if p.get('tipo') == 'partido':
        # a sangre: el fotograma tiene que llegar a los cuatro bordes
        return ('<!doctype html><html lang="es"><meta charset="utf-8">'
                '<style>%s\n%s</style><body class="pt%s">%s%s</body></html>'
                % (_fuentes(), css, ' alta' if alto > 1400 else '', pg,
                   VIZ['partido'](p)))
    if p.get('tipo') in ('apertura', 'cierre'):
        return ('<!doctype html><html lang="es"><meta charset="utf-8">'
                '<style>%s\n%s</style><body class="solo">%s%s</body></html>'
                % (_fuentes(), css, pg, VIZ[p['tipo']](p)))
    if p.get('tipo') == 'portada':
        # el enganche ocupa toda la pantalla: cualquier cosa arriba o abajo
        # le come tamaño al único mensaje que tiene que entrar de un vistazo
        return ('<!doctype html><html lang="es"><meta charset="utf-8">'
                '<style>%s\n%s</style><body class="solo">%s</body></html>'
                % (_fuentes(), css, VIZ['portada'](p)))
    bj = '<p class="bj">%s</p>' % esc(p['bajada']) if p.get('bajada') else ''
    bj += _chip(p)
    ct = p.get('cta') or CTA.get(p['tipo'])
    cta = ('<div class="ct" style="border-color:%s">'
           '<div class="ctx"><b>%s</b><span>%s</span></div>'
           '<div class="ctl" style="color:%s">volley-stats.com</div></div>'
           % (c, esc(ct[0]), esc(ct[1]), c)) if ct else ''
    pi = '<div class="pi">%s</div>' % esc(p['pie']) if p.get('pie') else ''
    return ('<!doctype html><html lang="es"><meta charset="utf-8"><style>%s\n%s</style><body>'
            '%s<div class="eb">%s &nbsp;·&nbsp; %s</div><h1>%s</h1>%s'
            '<div class="zn">%s</div>%s%s'
            '<div class="ci"><span class="mrc">%s<span><b>VOLLEY·STATS</b><br>%s'
            '</span></span>'
            '<span class="dr">%s:<br>%s</span></div></body></html>'
            % (_fuentes(), css, pg, esc(p['liga']), esc(p['fecha']),
               esc(p['titulo']), bj,
               VIZ[p['tipo']](p), pi, cta, _marca(),
               TXT['firma'], TXT['fuente'], esc(p.get('fuente', ''))))


def generar(piezas, destino, alto=1350):
    """alto 1350 = el vertical de feed. 1920 = historias, reels y TikTok."""
    destino = pathlib.Path(destino); destino.mkdir(parents=True, exist_ok=True)
    out = []
    with sync_playwright() as pw:
        b = _navegador(pw)
        pg = b.new_page(viewport={'width': 1080, 'height': alto})
        for i, p in enumerate(piezas, 1):
            p.setdefault('nro', i)
            p.setdefault('total', len(piezas))
            nom = '%s-%s' % (chr(64 + i), p.get('slug', p['tipo']))
            t = destino / (nom + '.html')
            t.write_text(render(p, alto), encoding='utf-8')
            pg.goto(t.resolve().as_uri()); pg.wait_for_timeout(300)
            pg.screenshot(path=str(destino / (nom + '.png')))
            t.unlink()
            out.append(nom + '.png')
        b.close()
    return out
