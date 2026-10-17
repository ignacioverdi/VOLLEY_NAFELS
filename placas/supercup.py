#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  supercup.py — las dos placas de la final de la Super Cup
-------------------------------------------------------------------------------
  Va en la carpeta placas\\, al lado de placas2.py.  Se corre:  python supercup.py

  QUE SACA
    A-supercup-final.png   el anuncio del partido
    B-la-ultima-final.png  los datos de la ultima final entre los dos

  DE DONDE SALEN LOS NUMEROS
  De los .dvw de DVW NAFELS 2026, leidos uno por uno. No hay un solo numero
  escrito a mano: todos se calculan abajo, en NUMEROS(), y si manana cambia
  el scout cambia la placa. El partido de manana sale del calendario de la app.

  VOLLEY-STATS ES OBJETIVA
  Las dos placas tratan a los dos equipos igual: los mismos datos de un lado
  y del otro, en el mismo orden, sin destacar a uno. No es la cuenta de un
  club: es la del que mira el partido con los numeros delante.
===============================================================================
"""
import base64, io, pathlib, re, sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent if (AQUI.parent / 'DVW NAFELS 2026').is_dir() else AQUI
DVW  = RAIZ / 'DVW NAFELS 2026'
FUENTES = (AQUI / 'fuentes') if (AQUI / 'fuentes').is_dir() else (RAIZ / 'placas' / 'fuentes')
ESCUDOS = (RAIZ / 'escudos') if (RAIZ / 'escudos').is_dir() else (AQUI / 'escudos')

BG, CARD, CARD2 = '#07080F', '#0D0E1A', '#111220'
TEXT, MUTED, SUBTLE = '#E2E8F0', '#64748B', '#475569'
BD, BD2 = 'rgba(255,255,255,.07)', 'rgba(255,255,255,.14)'
ROJO = '#E8192C'
AZUL = '#3295CB'          # el frio del sistema de datos, para el segundo equipo

AMRI = 'Volley Amriswil'
NAFE = 'Biogas Volley Näfels'


# ══ LOS DATOS, DEL SCOUT ═══════════════════════════════════════════════════
def _secciones(p):
    d = io.open(p, encoding='latin-1').read().replace('\r', '')
    sec, cur = {}, None
    for l in d.split('\n'):
        if l.startswith('['):
            cur = l.strip(); sec[cur] = []
        elif cur is not None:
            sec[cur].append(l)
    return sec


def _utf(x):
    try: return x.encode('latin-1').decode('utf-8')
    except Exception: return x


def _vacio():
    return {'SQ': 0, 'S#': 0, 'S=': 0, 'AT': 0, 'A#': 0, 'A=': 0, 'A/': 0,
            'R': 0, 'R+': 0, 'B#': 0, 'D': 0}


def _partido(p):
    """Un .dvw -> equipos, sets, totales por equipo y puntos por jugador."""
    sec = _secciones(p)
    eq = []
    for l in sec.get('[3TEAMS]', []):
        if l.strip():
            x = l.split(';')
            eq.append({'n': _utf(x[1]).replace(' (NLA Men)', ''), 'sets': int(x[2])})
        if len(eq) == 2:
            break
    sets = []
    for l in sec.get('[3SET]', []):
        x = l.split(';')
        if len(x) > 4 and '-' in x[4]:
            a, b = [int(v) for v in x[4].split('-')]
            sets.append((a, b))
    ros = {'*': {}, 'a': {}}
    for lado, k in (('*', '[3PLAYERS-H]'), ('a', '[3PLAYERS-V]')):
        for l in sec.get(k, []):
            f = l.split(';')
            if len(f) > 10 and f[1].strip().isdigit():
                ape, nom = _utf(f[9]).strip(), _utf(f[10]).strip()
                ros[lado][int(f[1])] = ((nom[0] + '. ') if nom else '') + ape
    tot = {'*': _vacio(), 'a': _vacio()}
    jug = {'*': {}, 'a': {}}
    pset = {}
    nset = 1
    for l in sec.get('[3SCOUT]', []):
        f = l.split(';'); c = f[0]
        if len(f) > 8 and f[8].strip().isdigit():
            nset = int(f[8])
        if len(c) < 6 or c[0] not in '*a' or not c[1:3].isdigit():
            continue
        lado, num, sk, ev = c[0], int(c[1:3]), c[3], c[5]
        S = pset.setdefault(nset, {'*': _vacio(), 'a': _vacio()})[lado]
        T, J = tot[lado], jug[lado].setdefault(num, _vacio())
        def sumar(k):
            T[k] += 1; J[k] += 1; S[k] += 1
        if sk == 'S':
            sumar('SQ')
            if ev == '#': sumar('S#')
            elif ev == '=': sumar('S=')
        elif sk == 'A':
            sumar('AT')
            if ev == '#': sumar('A#')
            elif ev == '=': sumar('A=')
            elif ev == '/': sumar('A/')
        elif sk == 'R':
            sumar('R')
            if ev in '#+': sumar('R+')
        elif sk == 'B' and ev == '#':
            sumar('B#')
        elif sk == 'D':
            sumar('D')
    return {'eq': eq, 'sets': sets, 'tot': tot, 'jug': jug, 'ros': ros, 'pset': pset}


def NUMEROS():
    arch = sorted([f for f in DVW.glob('*.dvw')
                   if 'AMRI-BIO' in f.name or 'BIO-AMRI' in f.name])
    if not arch:
        sys.exit('No encuentro los .dvw en %s' % DVW)
    hist, acc, atq, setsj = [], 0, 0, 0
    gana = {AMRI: 0, NAFE: 0}
    ultima = None
    for f in arch:
        m = _partido(f)
        fecha = re.search(r'(\d{4}-\d{2}-\d{2})', f.name).group(1)
        a, b = m['eq'][0], m['eq'][1]
        gana[a['n'] if a['sets'] > b['sets'] else b['n']] += 1
        setsj += a['sets'] + b['sets']
        for l in _secciones(f).get('[3SCOUT]', []):
            c = l.split(';')[0]
            if len(c) >= 6 and c[0] in '*a' and c[1:3].isdigit():
                acc += 1
                if c[3] == 'A':
                    atq += 1
        hist.append({'fecha': fecha, **m})
        if fecha == '2026-04-12':
            ultima = hist[-1]
    return {'hist': hist, 'acc': acc, 'atq': atq, 'sets': setsj,
            'gana': gana, 'partidos': len(arch), 'ultima': ultima}


# ══ EL DIBUJO ══════════════════════════════════════════════════════════════
def _fuentes():
    caras = [('Placa', 'Poppins-Light.ttf', 300), ('Placa', 'Poppins-Regular.ttf', 400),
             ('Placa', 'Poppins-Medium.ttf', 500), ('Placa', 'Poppins-Bold.ttf', 700),
             ('PlacaMono', 'DejaVuSansMono.ttf', 400),
             ('PlacaMono', 'DejaVuSansMono-Bold.ttf', 700)]
    out = []
    for fam, a, peso in caras:
        f = FUENTES / a
        if f.exists():
            out.append("@font-face{font-family:'%s';font-weight:%d;src:url('%s') format('truetype')}"
                       % (fam, peso, f.as_uri()))
    return '\n'.join(out)


def _escudo(nombre):
    f = ESCUDOS / (nombre + '.png')
    if not f.exists():
        return ''
    return 'data:image/png;base64,' + base64.b64encode(f.read_bytes()).decode()


def _simbolo(c=ROJO):
    """El balon de la marca, igual que en marca.py (SIMBOLO='balon')."""
    B = '#FFFFFF'
    barras = ''.join('<rect x="%d" y="%d" width="28" height="%d" rx="7" fill="%s"/>'
                     % (132 + i * 38, 212 - h, h, c) for i, h in enumerate((44, 74, 108)))
    return ('<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">'
            '<circle cx="150" cy="150" r="108" fill="none" stroke="%s" stroke-width="14"/>'
            '<path d="M70 78 q56 72 26 166" stroke="%s" stroke-width="12" fill="none" stroke-linecap="round"/>'
            '<path d="M50 128 q76 -40 150 4" stroke="%s" stroke-width="12" fill="none" stroke-linecap="round"/>'
            '%s</svg>' % (B, B, B, barras))


def _pie(fuente):
    return ('<div class="ci"><span class="mrc"><i class="mrs">%s</i>'
            '<span><b>VOLLEY·STATS</b><br>Analysis: Ignacio Verdi</span></span>'
            '<span class="dr">Source:<br>%s</span></div>' % (_simbolo(), fuente))


CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden}
body{width:1080px;height:%(ALTO)dpx;background:%(BG)s;color:%(TEXT)s;
  font-family:'Placa','Poppins',sans-serif;padding:%(PADY)dpx 56px %(PADB)dpx;
  display:flex;flex-direction:column;position:relative}
/* el resplandor: saca el negro plano sin robarle atencion a nada */
body::before{content:'';position:absolute;left:50%%;top:-6%%;width:1250px;height:1250px;
  transform:translateX(-50%%);border-radius:50%%;pointer-events:none;
  background:radial-gradient(circle,rgba(232,25,44,.17) 0%%,transparent 62%%)}
/* la grilla de atras: dice "sistema" sin que se note */
body::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);
  background-size:60px 60px;
  -webkit-mask-image:radial-gradient(circle at 50%% 40%%,#000 0%%,transparent 78%%)}
body>*{position:relative;z-index:1}
.eb{font-family:'PlacaMono',monospace;font-size:17px;letter-spacing:.2em;
  color:%(C)s;text-transform:uppercase;margin-bottom:16px;display:flex;
  align-items:center;gap:14px}
.eb::after{content:'';flex:1;height:1px;
  background:linear-gradient(90deg,%(C)s,transparent);opacity:.45}
h1{font-size:62px;line-height:1.0;font-weight:700;letter-spacing:-.03em;margin-bottom:13px}
.bj{color:%(MUTED)s;font-size:22px;line-height:1.42;margin-bottom:26px;font-weight:300;max-width:92%%}
.zn{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0;gap:14px}
.zn.rep{justify-content:center;gap:26px}
.ci{margin-top:auto;padding-top:18px;border-top:1px solid %(BD2)s;display:flex;
  justify-content:space-between;align-items:flex-end;
  font-family:'PlacaMono',monospace;font-size:15px;letter-spacing:.1em;color:%(MUTED)s}
.ci b{color:%(TEXT)s;font-weight:700;letter-spacing:.2em;font-size:20px}
.ci .mrc{display:flex;align-items:center;gap:13px}
.ci .mrs{width:40px;height:40px;flex:none;display:block}
.ci .mrs svg{width:100%%;height:100%%;display:block}
.ci .dr{text-align:right;line-height:1.6;max-width:640px;font-size:12px;letter-spacing:.06em}

/* ── el cruce ── */
.cruce{display:flex;align-items:stretch;gap:0;margin:0 0 6px}
.lado{flex:1;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.012));
  border:1px solid %(BD)s;border-radius:22px;padding:88px 36px;text-align:center;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;
  box-shadow:0 24px 60px -30px #000}
.lado img{height:205px;width:100%%;max-width:290px;object-fit:contain;
  filter:drop-shadow(0 10px 26px rgba(0,0,0,.65))}
.lado b{font-size:46px;font-weight:700;letter-spacing:-.02em;line-height:1}
.lado span{font-family:'PlacaMono',monospace;font-size:13px;letter-spacing:.2em;
  color:%(SUBTLE)s;text-transform:uppercase}
.vs{flex:none;width:112px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px}
.vs i{font-style:normal;font-family:'PlacaMono',monospace;font-weight:700;font-size:26px;
  letter-spacing:.1em;color:#fff;background:%(C)s;border-radius:999px;padding:10px 18px;
  box-shadow:0 0 44px -6px rgba(232,25,44,.8)}
.vs u{display:block;width:1px;flex:1;background:linear-gradient(180deg,transparent,%(BD2)s,transparent)}

/* ── tiles de dato ── */
.tiles{display:flex;gap:10px}
.tile{flex:1;background:%(CARD)s;border:1px solid %(BD)s;border-radius:16px;
  padding:28px 18px;text-align:center}
.tile span{display:block;font-family:'PlacaMono',monospace;font-size:14px;
  letter-spacing:.2em;text-transform:uppercase;color:%(MUTED)s;margin-bottom:11px}
.tile b{display:block;font-family:'PlacaMono',monospace;font-size:36px;font-weight:700;
  line-height:1.12;letter-spacing:-.015em;color:#fff}
.tile b.chico{font-size:25px;line-height:1.3}

/* ── la franja de dato duro ── */
.franja{margin-top:0;border-left:5px solid %(C)s;background:%(CARD2)s;
  border-radius:0 14px 14px 0;padding:24px 28px}
.franja em{font-style:normal;display:block;font-family:'PlacaMono',monospace;font-size:14px;
  letter-spacing:.2em;text-transform:uppercase;color:%(MUTED)s;margin-bottom:12px}
.franja p{font-size:24px;line-height:1.5;font-weight:300;color:%(TEXT)s}
.franja p b{font-weight:700;font-family:'PlacaMono',monospace;font-size:25px;color:#fff}

/* ── placa B ── */
.hero{text-align:center;margin:0 0 20px}
.hero span{display:block;font-family:'PlacaMono',monospace;font-size:14px;
  letter-spacing:.3em;text-transform:uppercase;color:%(MUTED)s;margin-bottom:4px}
.hero b{display:block;font-family:'PlacaMono',monospace;font-weight:700;font-size:142px;
  line-height:.92;letter-spacing:-.04em;
  background:linear-gradient(180deg,#fff 35%%,rgba(232,25,44,.92));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero u{display:block;text-decoration:none;font-family:'PlacaMono',monospace;font-size:14px;
  letter-spacing:.2em;text-transform:uppercase;color:%(SUBTLE)s;margin-top:8px}
/* el marcador: los dos equipos uno al lado del otro, en el mismo orden en que
   despues aparecen las columnas de la comparacion. Si el marcador va apilado y
   la comparacion en columnas, no hay forma de saber cual es cual. */
.mkd{display:flex;align-items:center;gap:18px;background:%(CARD)s;border:1px solid %(BD)s;
  border-radius:16px 16px 0 0;border-bottom:0;padding:20px 24px}
.mkd .lad{flex:1;display:flex;align-items:center;gap:16px;min-width:0}
.mkd .lad.der{flex-direction:row-reverse}
.mkd img{height:66px;width:132px;object-fit:contain;flex:none}
.mkd .lad.der img{object-position:right center}
.mkd .nm{font-size:27px;font-weight:700;letter-spacing:-.015em;line-height:1}
.mkd .st{font-family:'PlacaMono',monospace;font-size:58px;font-weight:700;line-height:1}
.mkd .gui{font-family:'PlacaMono',monospace;font-size:30px;color:%(SUBTLE)s}
.marcador{display:flex;align-items:center;gap:18px;background:%(CARD)s;
  border:1px solid %(BD)s;border-radius:14px;padding:15px 22px;margin-bottom:9px}
.marcador img{height:50px;width:96px;object-fit:contain;object-position:left center;flex:none}
.marcador .nm{font-size:25px;font-weight:700;letter-spacing:-.01em;flex:1}
.marcador .pr{font-family:'PlacaMono',monospace;font-size:19px;color:%(MUTED)s;
  letter-spacing:.07em;font-variant-numeric:tabular-nums}
.marcador .pr b{color:%(TEXT)s;font-weight:700}
.marcador .st{font-family:'PlacaMono',monospace;font-size:44px;font-weight:700;
  line-height:1;width:46px;text-align:right}
.cmp{border:1px solid %(BD)s;border-radius:0 0 16px 16px;overflow:hidden;background:%(CARD)s}
.parc2{display:flex;align-items:center;justify-content:center;gap:12px;
  background:%(CARD)s;border-left:1px solid %(BD)s;border-right:1px solid %(BD)s;
  padding:11px 0;font-family:'PlacaMono',monospace;font-size:19px;letter-spacing:.1em;
  color:%(MUTED)s;font-variant-numeric:tabular-nums}
.parc2 b{color:%(TEXT)s;font-weight:700}
.parc2 i{font-style:normal;color:%(SUBTLE)s;font-size:12px;letter-spacing:.2em;
  text-transform:uppercase}
.cf{display:flex;align-items:center;gap:14px;padding:12px 20px;
  border-bottom:1px solid rgba(255,255,255,.05)}
.cf:last-child{border-bottom:0}
.cf .et{flex:1;font-family:'PlacaMono',monospace;font-size:13px;letter-spacing:.14em;
  text-transform:uppercase;color:%(MUTED)s;text-align:center}
.cf .v{font-family:'PlacaMono',monospace;font-size:28px;font-weight:700;width:150px;
  font-variant-numeric:tabular-nums}
.cf .v.d{text-align:right}
.cf .v small{font-size:14px;font-weight:400;color:%(SUBTLE)s;margin-left:5px}
.jugs{display:flex;gap:10px;margin-top:11px}
.parc{display:flex;align-items:center;justify-content:center;gap:12px;margin:0 0 13px;
  font-family:'PlacaMono',monospace;font-size:19px;letter-spacing:.1em;color:%(MUTED)s;
  font-variant-numeric:tabular-nums}
.parc b{color:%(TEXT)s;font-weight:700}
.parc i{font-style:normal;color:%(SUBTLE)s;font-size:12px;letter-spacing:.2em;
  text-transform:uppercase}
.jg{flex:1;background:%(CARD2)s;border:1px solid %(BD)s;border-radius:13px;padding:14px 17px}
.jg span{display:block;font-family:'PlacaMono',monospace;font-size:11px;letter-spacing:.17em;
  text-transform:uppercase;color:%(MUTED)s;margin-bottom:6px}
.jg b{display:block;font-size:24px;font-weight:700;line-height:1.1}
.jg em{font-style:normal;display:block;font-family:'PlacaMono',monospace;font-size:13px;
  color:%(SUBTLE)s;margin-top:5px;letter-spacing:.04em}
.jg i{font-style:normal;float:right;font-family:'PlacaMono',monospace;font-size:30px;
  font-weight:700;line-height:1}
"""


# ══ LOS DOS TAMAÑOS ═══════════════════════════════════════════════════════
#  1350 es el vertical del feed (4:5) y 1920 la historia (9:16). No es el
#  mismo dibujo estirado: en la historia hay 570 px mas de alto, asi que los
#  bloques respiran mas y los numeros crecen. Lo que NO cambia es el contenido:
#  las dos dicen exactamente lo mismo.
STORY = """
body.story .eb{font-size:21px;margin-bottom:22px}
body.story h1{font-size:78px;margin-bottom:18px}
body.story .bj{font-size:28px;margin-bottom:34px}
body.story .zn{gap:26px}
body.story .lado{padding:104px 40px}
body.story .lado img{height:250px;max-width:330px}
body.story .vs i{font-size:32px;padding:13px 23px}
body.story .tile{padding:38px 20px;border-radius:20px}
body.story .tile span{font-size:17px;margin-bottom:14px}
body.story .tile b{font-size:44px}
body.story .tile b.chico{font-size:31px}
body.story .franja{padding:32px 36px;border-radius:0 18px 18px 0}
body.story .franja em{font-size:17px;margin-bottom:16px}
body.story .franja p{font-size:30px;line-height:1.5}
body.story .franja p b{font-size:31px}
body.story .hero b{font-size:168px}
body.story .hero span{font-size:18px}
body.story .hero u{font-size:18px;margin-top:14px}
body.story .mkd{padding:30px 30px}
body.story .mkd img{height:84px;width:168px}
body.story .mkd .nm{font-size:34px}
body.story .mkd .st{font-size:76px}
body.story .parc2{font-size:25px;padding:16px 0}
body.story .cf{padding:18px 26px}
body.story .cf .v{font-size:38px;width:200px}
body.story .cf .et{font-size:17px}
body.story .jg{padding:22px 24px}
body.story .jg span{font-size:14px;margin-bottom:9px}
body.story .jg b{font-size:30px}
body.story .jg em{font-size:15.5px;margin-top:8px;white-space:nowrap}
body.story .jg i{font-size:42px}
body.story .ci b{font-size:24px}
body.story .ci,body.story .ci .mrc{font-size:18px}
body.story .ci .mrs{width:52px;height:52px}
body.story .ci .dr{font-size:15px}
"""


def _css(alto):
    css = CSS % {'BG': BG, 'CARD': CARD, 'CARD2': CARD2, 'TEXT': TEXT,
                 'MUTED': MUTED, 'SUBTLE': SUBTLE, 'BD': BD, 'BD2': BD2, 'C': ROJO,
                 'ALTO': alto, 'PADY': 60 if alto <= 1400 else 205,
                 'PADB': 46 if alto <= 1400 else 185}
    return _fuentes() + '\n' + css + ('\n' + STORY if alto > 1400 else '')


def _doc(cuerpo, alto=1350):
    return ('<!doctype html><html lang="en"><meta charset="utf-8"><style>%s</style>'
            '<body class="%s">%s</body></html>'
            % (_css(alto), 'story' if alto > 1400 else '', cuerpo))


# ── PLACA A · el anuncio ───────────────────────────────────────────────────
def placa_a(N, alto=1350):
    g = N['gana']
    return _doc(
        '<div class="eb">Swiss Volley · Super Cup &nbsp;·&nbsp; Final</div>'
        '<h1>One match.<br>One trophy.</h1>'
        '<p class="bj">The two teams that decided last season\'s title open the new one '
        'against each other — this time in a single final.</p>'
        '<div class="zn rep">'
        '<div class="cruce">'
        '  <div class="lado"><img src="%s"></div>'
        '  <div class="vs"><u></u><i>VS</i><u></u></div>'
        '  <div class="lado"><img src="%s"></div>'
        '</div>'
        '<div class="tiles">'
        '  <div class="tile"><span>Date</span><b>SAT 17 OCT</b></div>'
        '  <div class="tile"><span>First serve</span><b>17:30</b></div>'
        '  <div class="tile"><span>Venue</span><b class="chico">Mobiliar Arena<br>Muri bei Bern</b></div>'
        '</div>'
        '<div class="franja"><em>They already know each other</em>'
        '<p>Six meetings in 2025-26 — league, Swiss Cup final and playoff final. '
        '<b>%d&nbsp;sets</b>, <b>%s&nbsp;attacks</b> and <b>%s</b> scouted actions. '
        'Amriswil won five of the six.</p></div>'
        '</div>' % (_escudo('amriswil'), _escudo('nafels'), N['sets'],
                    '{:,}'.format(N['atq']), '{:,}'.format(N['acc']))
        + _pie('6 matches · Nationalliga A 2025-26 · DataVolley scouts'), alto)


# ── PLACA B · la ultima final ──────────────────────────────────────────────
def placa_b(N, alto=1350):
    u = N['ultima']
    loc, vis = u['eq'][0]['n'], u['eq'][1]['n']
    lado = {'*': loc, 'a': vis}
    T = u['tot']
    s4 = u['pset'][4]
    sets = ' · '.join('<b>%d-%d</b>' % s for s in u['sets'])

    def pct(a, b): return 100.0 * a / max(1, b)

    def fila(et, va, vb, suf=''):
        """Cada valor con el color de su equipo: el mismo azul y el mismo rojo
           del marcador de arriba. Asi la columna se lee sin pensar."""
        return ('<div class="cf"><span class="v" style="color:%s">%s%s</span>'
                '<span class="et">%s</span>'
                '<span class="v d" style="color:%s">%s%s</span></div>'
                % (AZUL, va, suf, et, ROJO, vb, suf))

    def mejor(l):
        best, bp = None, -1
        for n, j in u['jug'][l].items():
            p = j['A#'] + j['S#'] + j['B#']
            if p > bp: best, bp = (n, j, p), p
        return best

    ml, mv = mejor('*'), mejor('a')

    def chip(l, m, color):
        n, j, p = m
        return ('<div class="jg"><span>%s · top scorer</span>'
                '<i style="color:%s">%d</i><b>%s</b>'
                '<em>%d kills of %d · %.0f%% · %d blocks · %d aces</em></div>'
                % ('NÄFELS' if lado[l] == NAFE else 'AMRISWIL', color, p,
                   u['ros'][l].get(n, '#%d' % n).upper(),
                   j['A#'], j['AT'], pct(j['A#'], j['AT']), j['B#'], j['S#']))

    return _doc(
        '<div class="eb">Playoff final · 12 April 2026 &nbsp;·&nbsp; Näfels</div>'
        '<h1>The set that<br>would not end.</h1>'
        '<p class="bj">Their last final went the distance. The fourth set alone took 64 points — '
        'the longest set the two played all season.</p>'
        '<div class="zn">'
        '<div class="hero"><span>Set 4</span><b>33–31</b>'
        '<u>Näfels levelled it · Amriswil took the fifth 15-12</u></div>'
        '<div class="mkd">'
        '  <div class="lad"><img src="%s"><span class="nm">NÄFELS</span></div>'
        '  <span class="st" style="color:%s">%d</span><span class="gui">–</span>'
        '  <span class="st" style="color:%s">%d</span>'
        '  <div class="lad der"><img src="%s"><span class="nm">AMRISWIL</span></div>'
        '</div>'
        '<div class="parc2"><i>Set by set</i>%s</div>'
        '<div class="cmp">%s%s%s%s</div>'
        '<div class="jugs">%s%s</div>'
        '</div>'
        % (_escudo('nafels'), AZUL, u['eq'][0]['sets'],
           ROJO, u['eq'][1]['sets'], _escudo('amriswil'), sets,
           fila('Attacks', T['*']['AT'], T['a']['AT']),
           fila('Kill rate', '%.1f' % pct(T['*']['A#'], T['*']['AT']),
                '%.1f' % pct(T['a']['A#'], T['a']['AT']), '%'),
           fila('Blocks', T['*']['B#'], T['a']['B#']),
           fila('Aces', T['*']['S#'], T['a']['S#']),
           chip('*', ml, AZUL), chip('a', mv, ROJO))
        + _pie('Playoff final, 12 Apr 2026 · DataVolley scout · 5 sets'), alto)


def main():
    N = NUMEROS()
    from playwright.sync_api import sync_playwright
    salida = AQUI / 'salida' / 'supercup'
    salida.mkdir(parents=True, exist_ok=True)
    exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=exe if pathlib.Path(exe).exists() else None)
        for alto, sufijo in ((1920, '-historia'), (1350, '-feed')):
            pg = b.new_page(viewport={'width': 1080, 'height': alto})
            for nom, doc in (('A-supercup-final', placa_a(N, alto)),
                             ('B-la-ultima-final', placa_b(N, alto))):
                t = salida / (nom + sufijo + '.html')
                t.write_text(doc, encoding='utf-8')
                pg.goto(t.resolve().as_uri()); pg.wait_for_timeout(350)
                pg.screenshot(path=str(salida / (nom + sufijo + '.png')))
                t.unlink()
                print('  ', nom + sufijo + '.png')
            pg.close()
        b.close()
    print('Listo, en', salida)


if __name__ == '__main__':
    main()
