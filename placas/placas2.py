#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cuatro formatos nuevos, construidos sobre las pantallas del sistema:
ficha de jugador, mapa de la liga, las seis canchitas y la tabla de la fecha.

Nada de barras. Todo cancha, celda y ficha, como en el producto.
"""
import html, os, pathlib
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
        out.append('<div class="%s" style="background:%s"><i>z%d</i>'
                   '<b style="color:%s">%d</b>%s</div>'
                   % (cls, bg, GRILLA[i], tint, n, extra))
    neta = ('<div class="red" style="border-color:%s"><span>RED</span></div>'
            % color) if red else ''
    return '%s<div class="gr %s">%s</div>' % (neta, tam, ''.join(out))


def escala_color(color):
    """Leyenda del degradado. Sin esto no se sabe si el naranja son 7 o 70."""
    pasos = ''.join('<i style="background:rgba(%s,%.2f)"></i>' % (_rgb(color), a)
                    for a in (0.16, 0.34, 0.52, 0.70, 0.88))
    return '<div class="esc"><span>menos</span>%s<span>más</span></div>' % pasos


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
               c, c, esc(j['puesto']), esc(j['total']),
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
                     '<b style="color:%s">ARMADOR EN %s</b>'
                     '<span>%d %s</span></div>'
                     '<div class="agr">%s</div></div>'
                     % (c, esc(r['rot']), r['total'],
                        'balón' if r['total'] == 1 else 'balones', ''.join(cel)))
    leg = ''.join('<span><i style="background:%s"></i>%s</span>' % (col, esc(et))
                  for et, col in p.get('leyenda', []))
    return ('%s<div class="aleg">%s</div><div class="seis">%s</div>'
            '<div class="anota">Por zona de salida del ataque: balones distribuidos '
            'arriba, y abajo %% de distribución · %% de punto. Cancha en vista del '
            'rival, como se scoutea.</div>'
            % (barra_filtro(p.get('filtro'), c), leg, ''.join(cajas)))


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
        filas.append('<tr><td class="ix">%d</td><td class="jg"><b>%s</b><span>%s</span></td>%s</tr>'
                     % (i + 1, esc(f['nombre']), esc(f['equipo']), tds))
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
                    '<span class="nd">sin volumen<br>suficiente</span></div>' % esc(pu))
        c = COL.get(pu, FUNDA['ataque'])
        es = ('<img class="es3" src="%s" alt="">' % x['escudo']) if x.get('escudo') else ''
        # el segundo dato es el que hace honesta la elección: un punta entra
        # por ataque Y recepción, y se ven las dos
        d2 = ('<u>%s</u>' % esc(x['dato2'])) if x.get('dato2') else ''
        return ('<div class="pz" style="border-top-color:%s"><div class="pu">%s</div>'
                '<b>%s</b><div class="pe">%s<span>%s</span></div>'
                '<div class="st" style="color:%s">%s%s</div></div>'
                % (c, esc(pu), esc(x['jugador']), es, esc(x['equipo']), c,
                   esc(x['dato']), d2))

    return (barra_filtro(p.get('filtro'), FUNDA[p['fundamento']]) +
            '<div class="cancha7"><div class="red7">RED</div>'
            '<div class="f3">%s%s%s</div><div class="f3">%s%s%s</div>'
            '<div class="lb">%s</div></div>'
            # formacion real en cancha: adelante punta-central-opuesto,
            # atras central-punta-armador, y el libero abajo
            % (cel('Punta 1'), cel('Central 1'), cel('Opuesto'),
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
        filas.append(
            '<div class="rf"><div class="rh">%s<div class="rn"><b>%s</b>'
            '<span>%s</span></div>'
            '<div class="rg"><em style="color:%s">%d%%</em><span>SIDE-OUT</span></div>'
            '<div class="rg"><em>%d%%</em><span>BREAK</span></div></div>'
            '<div class="rr">%s</div></div>'
            % (es, esc(f['equipo']),
               '%d partido%s' % (f['partidos'], '' if f['partidos'] == 1 else 's'),
               c, f['so'], f['bp'], ''.join(cel)))
    leyenda = ('<div class="anota">Side-out = porcentaje de rallies ganados '
               'recibiendo, en cada rotación. La rotación se nombra por la '
               'posición del armador. El número chico es cuántos rallies. '
               'Verde: su mejor rotación. Rojo: su peor.</div>')
    return '<div class="rot">%s</div>%s' % (''.join(filas), leyenda)


VIZ = {'ficha': ficha, 'mapa': mapa, 'seis': seis, 'tabla': tabla,
       'siete': siete, 'rotaciones': rotaciones}

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden}
body{width:1080px;height:1350px;background:%(BG)s;color:%(TEXT)s;
  font-family:'Poppins','DejaVu Sans',sans-serif;padding:60px 56px 46px;
  display:flex;flex-direction:column}
.eb{font-family:'DejaVu Sans Mono',monospace;font-size:18px;letter-spacing:.18em;
  color:%(C)s;text-transform:uppercase;margin-bottom:20px}
h1{font-size:56px;line-height:1.06;font-weight:700;letter-spacing:-.02em;margin-bottom:14px}
.bj{color:%(MUTED)s;font-size:23px;line-height:1.4;margin-bottom:28px}
.zn{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}
.pi{font-size:20px;line-height:1.4;border-left:4px solid %(C)s;padding-left:19px;margin-top:20px}
.ct{margin-top:22px;border-left:4px solid;background:%(CARD)s;border-radius:0 10px 10px 0;
  padding:15px 20px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.ctx b{display:block;font-size:22px;font-weight:600;line-height:1.25}
.ctx span{display:block;color:%(MUTED)s;font-size:18px;line-height:1.3;margin-top:3px}
.ctl{font-family:'DejaVu Sans Mono',monospace;font-size:16px;font-weight:700;
  letter-spacing:.1em;white-space:nowrap}
.ci{margin-top:auto;padding-top:18px;border-top:1px solid %(BD2)s;display:flex;
  justify-content:space-between;align-items:flex-end;
  font-family:'DejaVu Sans Mono',monospace;font-size:15px;letter-spacing:.1em;color:%(MUTED)s}
.ci b{color:%(TEXT)s;font-weight:700;letter-spacing:.2em;font-size:20px}
.ci .dr{text-align:right;line-height:1.55;max-width:400px;font-size:13px}

/* la red y la linea de 3 metros: lo que hace que parezca una cancha */
.red{border-bottom:3px solid;text-align:center;padding-bottom:5px;margin-bottom:8px}
.red span{font-family:'DejaVu Sans Mono',monospace;font-size:11px;letter-spacing:.32em;
  color:%(MUTED)s}
.cl.l3{border-top:2px dashed rgba(255,255,255,.22)}
.cl.vacia{background:rgba(255,255,255,.015);border-style:dashed;
  border-color:rgba(255,255,255,.05)}

/* leyenda de la escala de color */
.esc{margin-left:auto;display:flex;align-items:center;gap:4px;
  font-family:'DejaVu Sans Mono',monospace;font-size:11px;color:%(SUBTLE)s;
  letter-spacing:.06em;text-transform:none}
.esc i{width:19px;height:9px;border-radius:2px;display:block}

/* celdas de cancha */
.gr{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.cl{aspect-ratio:1.42;border-radius:8px;border:1px solid %(BD)s;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.cl i{position:absolute;top:7px;left:9px;font-family:'DejaVu Sans Mono',monospace;
  font-size:13px;font-style:normal;color:%(SUBTLE)s;letter-spacing:.08em}
.cl b{font-family:'DejaVu Sans Mono',monospace;font-size:48px;font-weight:700;line-height:1}
.cl u{font-family:'DejaVu Sans Mono',monospace;font-size:13px;text-decoration:none;margin-top:3px}
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
  justify-content:center;font-family:'DejaVu Sans Mono',monospace;font-size:24px;
  font-weight:700;color:#0A0500}
.fn{flex:1}
.fn b{display:block;font-size:32px;font-weight:700;line-height:1.1;letter-spacing:-.01em}
.fn span{font-family:'DejaVu Sans Mono',monospace;font-size:14px;color:%(MUTED)s;
  letter-spacing:.09em;text-transform:uppercase}
.es{width:38px;height:38px;object-fit:contain;flex:none;border-radius:6px}
.fp{text-align:right}
.fp em{display:inline-block;font-style:normal;font-family:'DejaVu Sans Mono',monospace;
  font-size:12px;letter-spacing:.12em;border:1px solid;border-radius:99px;padding:3px 11px}
.fp span{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:14px;
  color:%(MUTED)s;margin-top:6px}

/* la linea que dice que esta mostrando el dibujo */
.mapt{display:flex;align-items:baseline;gap:11px;margin-bottom:10px;
  font-family:'DejaVu Sans Mono',monospace;font-size:14px;letter-spacing:.11em;
  text-transform:uppercase;line-height:1.3}
.mapt span{color:%(SUBTLE)s;white-space:nowrap}
.mapt b{font-weight:700}
.mapt u{margin-left:auto;text-decoration:none;color:%(MUTED)s;white-space:nowrap}
.ftt{font-family:'DejaVu Sans Mono',monospace;font-size:14px;letter-spacing:.11em;
  text-transform:uppercase;color:%(SUBTLE)s;margin-bottom:6px}

.heros{display:flex;gap:9px;margin:11px 0 9px}
.hm{flex:1;background:%(CARD2)s;border:1px solid %(BD)s;border-radius:9px;
  padding:11px 14px;text-align:center}
.hm span{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:12px;
  letter-spacing:.15em;text-transform:uppercase;color:%(MUTED)s;margin-bottom:3px}
.hm b{font-family:'DejaVu Sans Mono',monospace;font-size:30px;font-weight:700;line-height:1}
.hm b small{font-size:15px;font-weight:700;margin-left:7px;letter-spacing:.04em}
.hm u{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:12px;
  text-decoration:none;color:%(SUBTLE)s;margin-top:6px;letter-spacing:.06em}
/* la vara: donde cae el contra la media de la liga */
.vara{position:relative;height:5px;border-radius:3px;background:rgba(255,255,255,.07);
  margin:8px 0 4px}
.vb2{position:absolute;left:0;top:0;bottom:0;border-radius:3px}
.mk{position:absolute;top:-3px;width:2px;height:11px;background:%(TEXT)s;opacity:.85}
.vtx{font-family:'DejaVu Sans Mono',monospace;font-size:11px;color:%(SUBTLE)s;
  letter-spacing:.06em}
/* el 2do y el 3ro, para que la placa sirva de ranking */
.podio{margin-top:11px;display:flex;gap:26px;flex-wrap:wrap;
  font-family:'DejaVu Sans Mono',monospace;font-size:14px;color:%(MUTED)s;
  letter-spacing:.05em}
.podio b{color:%(TEXT)s;font-weight:700}

.tira{display:flex;height:16px;border-radius:4px;overflow:hidden;gap:2px;margin-bottom:11px}
.vals{display:flex;gap:9px}
.vb{flex:1;background:%(CARD2)s;border:1px solid %(BD)s;border-radius:9px;
  padding:11px 6px;text-align:center}
.vs{font-family:'DejaVu Sans Mono',monospace;font-size:26px;font-weight:700;line-height:1}
.ve{font-family:'DejaVu Sans Mono',monospace;font-size:12px;letter-spacing:.14em;
  color:%(MUTED)s;margin:5px 0 8px}
.vb b{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:33px;
  font-weight:700;line-height:1}
.vb i{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:15px;
  font-style:normal;color:%(MUTED)s;margin-top:5px}

/* B · mapa de la liga */
.mapa{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 14px}
.mq{background:%(CARD)s;border:1px solid %(BD)s;border-radius:13px;padding:14px}
.mh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}
.mh span{text-align:center}
.mh b{font-size:19px;font-weight:700}
.mh span{font-family:'DejaVu Sans Mono',monospace;font-size:12px;color:%(MUTED)s}

/* C · las seis del armador */
.aleg{display:flex;gap:22px;margin-bottom:14px;flex-wrap:wrap}
.aleg span{display:flex;align-items:center;gap:8px;font-size:17px;color:%(MUTED)s}
.aleg i{width:13px;height:13px;border-radius:4px;display:block}
.agr{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.ac{aspect-ratio:1.42;border-radius:6px;border:1px solid %(BD)s;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:rgba(255,255,255,.02)}
.ac.vacia{opacity:.5}
.ac i{position:absolute;top:4px;left:6px;font-family:'DejaVu Sans Mono',monospace;
  font-size:10px;font-style:normal;color:%(SUBTLE)s}
.ac b{font-family:'DejaVu Sans Mono',monospace;font-size:27px;font-weight:700;line-height:1}
.ac u{font-family:'DejaVu Sans Mono',monospace;font-size:10px;text-decoration:none;
  color:rgba(255,255,255,.72);margin-top:3px;letter-spacing:.02em}
.anota{margin-top:13px;font-family:'DejaVu Sans Mono',monospace;font-size:13px;
  color:%(SUBTLE)s;line-height:1.4}

/* B · mapa de la liga */
.seis{display:grid;grid-template-columns:repeat(3,1fr);gap:20px 16px}
.sq{background:%(CARD)s;border:1px solid %(BD)s;border-radius:12px;padding:12px}
.sh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}
.sh b{font-family:'DejaVu Sans Mono',monospace;font-size:14px;letter-spacing:.09em}
.sh span{font-family:'DejaVu Sans Mono',monospace;font-size:12px;color:%(MUTED)s}

/* equipo ideal */
.cancha7{display:flex;flex-direction:column;gap:12px}
.red7{font-family:'DejaVu Sans Mono',monospace;font-size:13px;letter-spacing:.3em;
  color:%(MUTED)s;border-bottom:2px solid %(C)s;text-align:center;padding-bottom:7px;
  margin-bottom:4px}
.f3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.lb{display:grid;max-width:33%%;margin:0 auto;width:100%%}
.pz{background:%(CARD)s;border:1px solid %(BD)s;border-top:3px solid %(C)s;
  border-radius:12px;padding:16px 13px 14px;text-align:center}
.pu{font-family:'DejaVu Sans Mono',monospace;font-size:12px;letter-spacing:.15em;
  text-transform:uppercase;color:%(MUTED)s;margin-bottom:8px}
.pz b{display:block;font-size:24px;font-weight:700;line-height:1.15;margin-bottom:3px}
.pz span{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:12px;
  color:%(MUTED)s;letter-spacing:.06em;text-transform:uppercase}
.pe{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:2px}
.es3{width:19px;height:19px;object-fit:contain;flex:none;border-radius:4px}
.st{margin-top:9px;font-family:'DejaVu Sans Mono',monospace;font-size:17px;font-weight:700}
.st u{display:block;text-decoration:none;font-size:14px;font-weight:400;
  color:%(MUTED)s;margin-top:4px;letter-spacing:.04em}

.pz.vacio{border:1px dashed %(BD2)s;border-top:1px dashed %(BD2)s;background:transparent;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
.pz.vacio .pu{margin-bottom:12px}
.nd{font-family:'DejaVu Sans Mono',monospace;font-size:13px;line-height:1.5;
  color:%(SUBTLE)s;letter-spacing:.06em;text-transform:uppercase;text-align:center}

/* E · side-out por rotacion */
.rot{display:flex;flex-direction:column;gap:14px}
.rf{background:%(CARD)s;border:1px solid %(BD)s;border-radius:13px;padding:15px 17px}
.rh{display:flex;align-items:center;gap:13px;margin-bottom:11px}
.es2{width:34px;height:34px;object-fit:contain;flex:none;border-radius:6px}
.rn{flex:1}
.rn b{display:block;font-size:24px;font-weight:700;line-height:1.1}
.rn span{font-family:'DejaVu Sans Mono',monospace;font-size:12px;color:%(SUBTLE)s;
  letter-spacing:.08em;text-transform:uppercase}
.rg{text-align:center;min-width:104px}
.rg em{display:block;font-style:normal;font-family:'DejaVu Sans Mono',monospace;
  font-size:30px;font-weight:700;line-height:1;color:%(TEXT)s}
.rg span{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:11px;
  letter-spacing:.15em;color:%(MUTED)s;margin-top:5px}
.rr{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
.rc{background:%(CARD2)s;border:1px solid %(BD)s;border-top:3px solid %(SUBTLE)s;
  border-radius:8px;padding:9px 4px 8px;text-align:center}
.rc.vacia{opacity:.4;border-top-color:rgba(255,255,255,.08)}
.rc.mejor{border-top-color:#22C55E}
.rc.peor{border-top-color:#EF4444}
.rc i{display:block;font-style:normal;font-family:'DejaVu Sans Mono',monospace;
  font-size:12px;letter-spacing:.12em;color:%(MUTED)s;margin-bottom:6px}
.rc b{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:27px;
  font-weight:700;line-height:1}
.rc u{display:block;font-family:'DejaVu Sans Mono',monospace;font-size:11px;
  text-decoration:none;color:%(SUBTLE)s;margin-top:5px}

/* D · tabla */
.tb{width:100%%;border-collapse:collapse}
.tb th{font-family:'DejaVu Sans Mono',monospace;font-size:13px;letter-spacing:.13em;
  text-align:center;padding:0 9px 13px;font-weight:400}
.tb th:nth-child(2){text-align:left}
.tb td{padding:13px 9px;border-top:1px solid %(BD)s;text-align:center;
  font-family:'DejaVu Sans Mono',monospace;font-size:23px}
.tb .ix{color:%(SUBTLE)s;font-size:16px;width:34px;text-align:left}
.tb .jg{text-align:left;font-family:'Poppins',sans-serif}
.tb .jg b{display:block;font-size:25px;font-weight:600;line-height:1.15}
.tb .jg span{font-family:'DejaVu Sans Mono',monospace;font-size:13px;color:%(MUTED)s;
  letter-spacing:.08em;text-transform:uppercase}
"""

TXT = {'firma': 'Análisis: Ignacio Verdi', 'fuente': 'Fuente'}

# El mensaje cambia segun lo que muestra la placa: no es el mismo gancho
# ver la ficha de un jugador que el mapa entero de la liga.
CTA = {
    'ficha': ('Esta misma ficha, de cualquier jugador de tu próximo rival.',
              'Y de cada jugador de tu plantel, en su celular.'),
    'mapa':  ('Este mapa, de tu liga y del rival que te toca el sábado.',
              'Actualizado solo, fecha a fecha.'),
    'seis':  ('La distribución en K1 del armador rival, antes de jugar.',
              'Con el video de cada balón, a un doble clic.'),
    'tabla': ('Esta tabla, con tu plantel, todas las semanas.',
              'Sin cargar nada a mano: sale del scout del partido.'),
    'siete': ('Tu equipo medido con la misma vara, fecha a fecha.',
              'Y cada jugador viendo lo suyo en su celular.'),
    'rotaciones': ('Las seis rotaciones del rival del sábado, antes de jugar.',
                   'Dónde presionarlo con el saque, y cuál es la tuya que se rompe.'),
}


def render(p):
    c = FUNDA.get(p.get('fundamento', 'ataque'), ROJO)
    css = CSS % {'BG': BG, 'CARD': CARD, 'CARD2': CARD2, 'TEXT': TEXT, 'MUTED': MUTED,
                 'SUBTLE': SUBTLE, 'BD': BD, 'BD2': BD2, 'C': c}
    bj = '<p class="bj">%s</p>' % esc(p['bajada']) if p.get('bajada') else ''
    ct = p.get('cta') or CTA.get(p['tipo'])
    cta = ('<div class="ct" style="border-color:%s">'
           '<div class="ctx"><b>%s</b><span>%s</span></div>'
           '<div class="ctl" style="color:%s">volley-stats.com</div></div>'
           % (c, esc(ct[0]), esc(ct[1]), c)) if ct else ''
    pi = '<div class="pi">%s</div>' % esc(p['pie']) if p.get('pie') else ''
    return ('<!doctype html><html lang="es"><meta charset="utf-8"><style>%s</style><body>'
            '<div class="eb">%s &nbsp;·&nbsp; %s</div><h1>%s</h1>%s'
            '<div class="zn">%s</div>%s%s'
            '<div class="ci"><span><b>VOLLEY·STATS</b><br>%s</span>'
            '<span class="dr">%s:<br>%s</span></div></body></html>'
            % (css, esc(p['liga']), esc(p['fecha']), esc(p['titulo']), bj,
               VIZ[p['tipo']](p), pi, cta,
               TXT['firma'], TXT['fuente'], esc(p.get('fuente', ''))))


def generar(piezas, destino):
    destino = pathlib.Path(destino); destino.mkdir(parents=True, exist_ok=True)
    out = []
    with sync_playwright() as pw:
        b = _navegador(pw)
        pg = b.new_page(viewport={'width': 1080, 'height': 1350})
        for i, p in enumerate(piezas, 1):
            nom = '%s-%s' % (chr(64 + i), p.get('slug', p['tipo']))
            t = destino / (nom + '.html')
            t.write_text(render(p), encoding='utf-8')
            pg.goto(t.resolve().as_uri()); pg.wait_for_timeout(300)
            pg.screenshot(path=str(destino / (nom + '.png')))
            t.unlink()
            out.append(nom + '.png')
        b.close()
    return out
