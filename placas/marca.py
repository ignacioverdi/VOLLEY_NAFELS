#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""La marca del canal: el logo, la intro y el cierre.

POR QUÉ UN LOGO Y NO UN TEXTO
-----------------------------
El que ve el corto por primera vez no sabe quién se lo está mostrando. Un
texto que dice VOLLEY·STATS lo lee y lo olvida; una marca la reconoce a la
tercera vez sin leer nada. Y en el avatar de TikTok, YouTube o Instagram no
entra un texto: entra un símbolo de 48 píxeles.

El símbolo sale de lo que ya hacemos: la cancha de nueve zonas con la zona
caliente pintada, que es el dibujo que está en todas las placas. Así el logo
y el producto dicen lo mismo.

Se dibuja acá, en SVG, y se renderiza con el mismo Chromium que las placas.
Queda un PNG con fondo transparente que sirve para todo: el video, el avatar,
el perfil, una remera.
"""
import pathlib

import idioma, placas2

BG = '#07080F'
ROJO = '#E8192C'
BLANCO = '#FFFFFF'
GRIS = '#8A94A6'

AQUI = pathlib.Path(__file__).resolve().parent
CARPETA = AQUI / 'marca'


# ── LOS TRES SÍMBOLOS ──────────────────────────────────────────────────────
def _svg(cuerpo, fondo=None):
    return ('<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">'
            + ('<rect width="300" height="300" rx="68" fill="%s"/>' % fondo
               if fondo else '') + cuerpo + '</svg>')


# el mapa de calor del símbolo: la zona 1, que es donde cae el saque
CALOR = [.07, .07, .07,
         .07, .12, .20,
         .12, .30, 1.0]


def _cancha(c=ROJO, fondo=None):
    """LA CANCHA. Las nueve zonas con la zona caliente pintada.

    Es el dibujo del producto: el que vio una placa lo reconoce al toque. Y a
    64 píxeles se sigue leyendo, que es lo único que importa en un avatar:
    una grilla y una celda encendida.
    """
    celdas = []
    for i in range(9):
        x, y = 48 + (i % 3) * 70, 86 + (i // 3) * 70
        o = CALOR[i]
        # las celdas frías se dibujan en blanco tenue, no en rojo oscuro: en
        # rojo oscuro sobre fondo negro no se ven y la grilla desaparece
        celdas.append(
            '<rect x="%d" y="%d" width="64" height="64" rx="9" fill="%s" '
            'fill-opacity="%.2f" stroke="%s" stroke-opacity="%.2f" '
            'stroke-width="3"/>'
            % (x, y, c, o if o > .25 else 0,
               c if o > .25 else BLANCO, .95 if o > .9 else (.5 if o > .25 else .3)))
    return _svg(
        # la red, arriba
        '<rect x="40" y="56" width="220" height="7" rx="3.5" fill="%s"/>' % BLANCO
        + '<g opacity=".38">'
        + ''.join('<rect x="%d" y="38" width="4" height="18" rx="2" fill="%s"/>'
                  % (44 + i * 30, BLANCO) for i in range(8))
        + '</g>'
        + ''.join(celdas)
        # la pelota, cayendo en la zona caliente
        + '<circle cx="220" cy="258" r="19" fill="%s"/>' % BLANCO
        + '<path d="M206 250 q14 9 28 0 M220 240 q-8 18 0 36 M204 266 q16 4 32 -10" '
          'stroke="%s" stroke-width="3" fill="none" stroke-linecap="round"/>' % BG,
        fondo)


def _balon(c=ROJO, fondo=None):
    """EL BALÓN QUE SUBE. Media pelota, media barra de datos."""
    return _svg(
        '<circle cx="150" cy="150" r="108" fill="none" stroke="%s" '
        'stroke-width="14"/>' % BLANCO
        + '<path d="M70 78 q56 72 26 166" stroke="%s" stroke-width="12" '
          'fill="none" stroke-linecap="round"/>' % BLANCO
        + '<path d="M50 128 q76 -40 150 4" stroke="%s" stroke-width="12" '
          'fill="none" stroke-linecap="round"/>' % BLANCO
        # las barras: el dato que crece adentro del balón
        + ''.join('<rect x="%d" y="%d" width="28" height="%d" rx="7" '
                  'fill="%s"/>' % (132 + i * 38, 212 - h, h, c)
                  for i, h in enumerate((44, 74, 108))),
        fondo)


def _monograma(c=ROJO, fondo=None):
    """VS. Las dos letras y la pelota, que es el punto de la V."""
    return _svg(
        '<text x="150" y="212" text-anchor="middle" font-family="Poppins,'
        'Montserrat,Arial" font-weight="800" font-size="190" fill="%s" '
        'letter-spacing="-10">V<tspan fill="%s">S</tspan></text>' % (BLANCO, c)
        + '<rect x="58" y="238" width="184" height="10" rx="5" fill="%s" '
          'opacity=".9"/>' % c,
        fondo)


SIMBOLOS = {'cancha': _cancha, 'balon': _balon, 'monograma': _monograma}

# ── LO QUE SE CAMBIA EN UNA LÍNEA ──────────────────────────────────────────
SIMBOLO = 'balon'                      # 'balon' · 'cancha' · 'monograma'
NOMBRE = 'VOLLEY·STATS'
LEMA = idioma.m('lema')
WEB = 'volley-stats.com'
HANDLE = '@volleystats'
CIERRE_TT = idioma.m('cierre_tt')
CIERRE_YT = idioma.m('cierre_yt')
PITCH = idioma.m('pitch')


def simbolo(c=ROJO, fondo=None, cual=None):
    return SIMBOLOS[cual or SIMBOLO](c, fondo)


# ── LAS PANTALLAS ──────────────────────────────────────────────────────────
def _css(alto, c, ancho=1080):
    # En 16:9 todo se mide contra el alto, que es el lado corto, y la marca
    # queda chiquita y perdida en el medio. Se agranda la escala para que el
    # logo pese lo mismo en los dos formatos.
    k = alto if alto > ancho else int(alto * 1.34)
    return (placas2._fuentes() + """
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden}
body{width:%(ANCHO)dpx;height:%(ALTO)dpx;background:%(BG)s;color:#fff;
  font-family:'Placa','Poppins',sans-serif;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;padding:70px;
  position:relative}
/* el resplandor de atrás: saca el negro plano sin robar atención */
body::before{content:'';position:absolute;left:50%%;top:42%%;width:1500px;
  height:1500px;transform:translate(-50%%,-50%%);border-radius:50%%;
  background:radial-gradient(circle,%(C)s22 0%%,transparent 62%%)}
.sim{width:%(SIM)dpx;height:%(SIM)dpx;position:relative;z-index:1}
.sim svg{width:100%%;height:100%%;display:block}
.nom{position:relative;z-index:1;font-size:%(NOM)dpx;font-weight:700;
  letter-spacing:-.02em;margin-top:%(GAP)dpx;line-height:1}
.ln{position:relative;z-index:1;width:%(LN)dpx;height:5px;border-radius:3px;
  background:%(C)s;margin:%(GAP2)dpx 0}
.lema{position:relative;z-index:1;font-family:'PlacaMono',monospace;
  font-size:%(LEMA)dpx;letter-spacing:.2em;color:#CBD5E1;text-transform:uppercase}
.pitch{position:relative;z-index:1;font-size:%(PIT)dpx;line-height:1.45;
  color:#CBD5E1;font-weight:300;max-width:760px;margin-top:%(GAP)dpx}
.cta{position:relative;z-index:1;margin-top:%(GAP3)dpx;background:%(C)s;
  color:#fff;font-weight:700;font-size:%(CTA)dpx;letter-spacing:.01em;
  padding:%(CTAY)dpx %(CTAX)dpx;border-radius:999px}
.pie{position:absolute;z-index:1;left:0;right:0;bottom:%(PIE)dpx;
  font-family:'PlacaMono',monospace;font-size:%(WEB)dpx;letter-spacing:.22em;
  color:#fff;opacity:.92;display:flex;gap:34px;justify-content:center}
.pie span{color:#64748B}
""") % {'ALTO': alto, 'ANCHO': ancho, 'BG': BG, 'C': c,
        'SIM': int(k * .175), 'NOM': int(k * .062),
        'GAP': int(k * .026), 'GAP2': int(k * .022),
        'GAP3': int(k * .034), 'LN': int(k * .075),
        'LEMA': int(k * .0165), 'PIT': int(k * .0235),
        'CTA': int(k * .0235), 'CTAY': int(k * .016),
        'CTAX': int(k * .034), 'WEB': int(k * .0155),
        'PIE': int(alto * .055)}


def _pagina(alto, c, cuerpo, ancho=1080):
    return ('<html><head><meta charset="utf-8"><style>%s</style></head>'
            '<body>%s</body></html>' % (_css(alto, c, ancho), cuerpo))


def html_intro(alto=1920, c=ROJO, ancho=1080):
    """La apertura. Una sola idea: quiénes somos y de qué va esto."""
    return _pagina(alto, c,
                   '<div class="sim">%s</div>'
                   '<div class="nom">%s</div>'
                   '<div class="ln"></div>'
                   '<div class="lema">%s</div>'
                   % (simbolo(c), placas2.esc(NOMBRE), placas2.esc(LEMA)),
                   ancho)


def html_cierre(alto=1920, c=ROJO, cta=None, ancho=1080):
    """El cierre. Una sola cosa para hacer, y dónde está el producto."""
    return _pagina(alto, c,
                   '<div class="sim">%s</div>'
                   '<div class="nom">%s</div>'
                   '<div class="ln"></div>'
                   '<div class="pitch">%s</div>'
                   '<div class="cta">%s</div>'
                   '<div class="pie">%s<span>·</span>%s</div>'
                   % (simbolo(c), placas2.esc(NOMBRE), placas2.esc(PITCH),
                      placas2.esc(cta or CIERRE_TT),
                      placas2.esc(WEB), placas2.esc(HANDLE)),
                   ancho)


def _render(paginas, destino, ancho=1080, alto=1920, escala=1):
    """paginas = {nombre: html}. Devuelve {nombre: ruta del png}."""
    from playwright.sync_api import sync_playwright
    destino = pathlib.Path(destino); destino.mkdir(parents=True, exist_ok=True)
    out = {}
    with sync_playwright() as pw:
        b = placas2._navegador(pw)
        pg = b.new_page(viewport={'width': ancho, 'height': alto},
                        device_scale_factor=escala)
        for nom, h in paginas.items():
            t = destino / (nom + '.html')
            t.write_text(h, encoding='utf-8')
            pg.goto(t.resolve().as_uri()); pg.wait_for_timeout(250)
            png = destino / (nom + '.png')
            pg.screenshot(path=str(png), omit_background=True)
            t.unlink()
            out[nom] = png
        b.close()
    return out


def pantallas(destino, ancho, alto, c=ROJO, cta=None):
    """La intro y el cierre, en el tamaño que pidas."""
    return _render({'intro': html_intro(alto, c, ancho),
                    'cierre': html_cierre(alto, c, cta, ancho)},
                   destino, ancho, alto)


def logo_png(destino, lado=1024, fondo=None, cual=None):
    """El símbolo solo, para el avatar y la marca de agua. Fondo transparente
    si no le pasás uno."""
    h = ('<html><head><meta charset="utf-8"><style>'
         '*{margin:0;padding:0}html,body{overflow:hidden}'
         'body{width:%dpx;height:%dpx;background:transparent}'
         'svg{width:100%%;height:100%%;display:block}</style></head>'
         '<body>%s</body></html>' % (lado, lado, simbolo(ROJO, fondo, cual)))
    return _render({'logo' + ('-' + cual if cual else ''): h},
                   destino, lado, lado)


def html_cabecera(ancho, alto, c, izq, der):
    """La banda de arriba del video: quién lo hace y de qué fecha es.

    Va sobre el vacío que queda arriba del clip en vertical. Sin esto, el que
    llega por un ace ve una franja negra y no sabe de qué liga, de qué fecha
    ni de quién es el video."""
    lado = int(alto * .47)
    return ('<html><head><meta charset="utf-8"><style>' + placas2._fuentes() + """
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow:hidden}
/* la banda se apoya sobre el video desenfocado, que cambia de color todo
   el tiempo: sin un velo oscuro atrás el texto se pierde. El velo se
   desvanece arriba y abajo para que no se vea el borde. */
body{width:%(W)dpx;height:%(H)dpx;background:transparent;color:#fff;
  font-family:'Placa','Poppins',sans-serif;display:flex;align-items:center;
  gap:%(GAP)dpx;padding:0 %(PAD)dpx;position:relative}
body::before{content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(7,8,15,0) 0%%,rgba(7,8,15,.82) 22%%,
    rgba(7,8,15,.82) 78%%,rgba(7,8,15,0) 100%%)}
.sim,.tx,.der{position:relative;z-index:1}
.sim{width:%(L)dpx;height:%(L)dpx;flex:none}
.sim svg{width:100%%;height:100%%;display:block}
.tx{flex:1;min-width:0}
.tx b{display:block;font-size:%(F1)dpx;font-weight:700;letter-spacing:-.01em;
  line-height:1.05}
.tx span{display:block;font-family:'PlacaMono',monospace;font-size:%(F2)dpx;
  letter-spacing:.2em;color:%(C)s;text-transform:uppercase;margin-top:%(M)dpx}
.der{font-family:'PlacaMono',monospace;font-size:%(F2)dpx;letter-spacing:.18em;
  color:#94A3B8;text-transform:uppercase;text-align:right;white-space:nowrap}
</style></head><body>
<div class="sim">%(SVG)s</div>
<div class="tx"><b>%(NOM)s</b><span>%(IZQ)s</span></div>
<div class="der">%(DER)s</div>
</body></html>""" % {'W': ancho, 'H': alto, 'L': lado, 'C': c,
                     'GAP': int(alto * .14), 'PAD': int(alto * .20),
                     'F1': int(alto * .23), 'F2': int(alto * .118),
                     'M': int(alto * .042), 'SVG': simbolo(c),
                     'NOM': placas2.esc(NOMBRE), 'IZQ': placas2.esc(izq),
                     'DER': placas2.esc(der)})


def cabecera(destino, ancho, c=ROJO, izq='', der='', nombre='cabecera'):
    alto = int(ancho * .175)
    return _render({nombre: html_cabecera(ancho, alto, c, izq, der)},
                   destino, ancho, alto)[nombre]
