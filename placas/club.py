#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Escudos de los clubes y varas de comparación de la liga.

Dos cosas que las placas no tenían y que ya estaban en el repo:

  ESCUDOS  — la carpeta escudos/ tiene los ocho clubes de la NLA. Se embeben
             en base64 porque la placa se renderiza desde un HTML temporal y
             una ruta relativa no sobrevive al cambio de carpeta.

  VARAS    — la media de la liga. Un 43% no dice nada solo; contra una media
             de 29% dice todo. Sale de nla_stats.json, de la temporada
             COMPLETA anterior, que es la única con volumen para ser una vara
             (92 jugadores, 97 partidos en la 25-26).
"""
import base64, json, os, pathlib, re, statistics, unicodedata

# volumen mínimo para entrar en el cálculo de la media: una vara hecha con
# jugadores de tres acciones no es una vara
MIN_VARA = {'ataque': 20, 'recepcion': 20, 'saque': 20, 'bloqueo': 10}
CAMPO_TOT = {'ataque': 'atk_tot', 'recepcion': 'rec_tot',
             'saque': 'srv_tot', 'bloqueo': 'blk_tot'}
CAMPO_EF = {'ataque': 'atk_eff', 'recepcion': 'rec_eff',
            'saque': 'srv_eff', 'bloqueo': 'blk_eff'}


# ══ EL NOMBRE DEL CLUB, COMO VENGA ═════════════════════════════════════
# Dos cosas rompian el nombre de los clubes suizos, y las dos se veian en la
# misma placa:
#
# 1) Los .dvw de VolleyMetrics estan en UTF-8 y el lector los abre como
#    cp1252, asi que 'Chenois' llega escrito 'ChÃªnois'. Con ese texto no
#    coincide ni el escudo ni el rotulo: la placa del partido del 24/10
#    salia titulada "MEN)" —la ultima palabra de "Chenois Geneve Volleyball
#    (NLA Men)"— y sin escudo.
#
# 2) En aleman la dieresis se escribe de las dos maneras y cada fuente elige
#    una: el .dvw dice "Schonenwerd" con dieresis y el escudo se llama
#    schoenenwerd.png. Buscando una sola forma, ese club tampoco aparecia.
#
# Se arregla una vez, aca, y lo usan el escudo y el rotulo.
_UML = (('ä', 'ae'), ('ö', 'oe'), ('ü', 'ue'), ('ß', 'ss'))


def arreglar_texto(s):
    """Repara el texto leido con la codificacion equivocada."""
    s = str(s or '')
    if 'Ã' in s or 'Â' in s:
        try:
            return s.encode('cp1252').decode('utf-8')
        except (UnicodeDecodeError, UnicodeEncodeError):
            return s
    return s


def _slug(s):
    """'Näfels' -> 'nafels'. Los archivos de escudos/ están sin acentos."""
    s = unicodedata.normalize('NFKD', arreglar_texto(s))
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', s.lower())


def _sin_e(sl):
    """'schoenenwerd' -> 'schonenwerd'. La vuelta de _UML, ya en slug.

    Hace falta porque el nombre llega de las dos puntas: el .dvw escribe
    "Schönenwerd" y el lector del motor lo deja en "Schonenwerd", mientras
    que el escudo del club se llama schoenenwerd.png."""
    for _a, b in _UML:
        sl = sl.replace(b, b[0])
    return sl


def slugs(s):
    """Las formas en que puede estar escrito ese club. Al menos una."""
    s = arreglar_texto(s)
    formas = []
    base = _slug(s)
    largo = s
    for a, b in _UML:
        largo = largo.replace(a, b).replace(a.upper(), b.upper())
    for x in (base, _slug(largo), _sin_e(base)):
        if x and x not in formas:
            formas.append(x)
    return formas


def escudos(repo):
    """{slug del club: data-uri del escudo}. Vacío si no está la carpeta."""
    carpeta = pathlib.Path(repo) / 'escudos'
    out = {}
    if not carpeta.is_dir():
        return out
    for f in carpeta.iterdir():
        if f.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.svg'):
            continue
        mime = 'image/svg+xml' if f.suffix.lower() == '.svg' else \
               ('image/jpeg' if f.suffix.lower() in ('.jpg', '.jpeg') else 'image/png')
        try:
            b = base64.b64encode(f.read_bytes()).decode()
        except OSError:
            continue
        out[_slug(f.stem)] = 'data:%s;base64,%s' % (mime, b)
    return out


def escudo_de(esc, equipo):
    """Busca el escudo de un equipo con el nombre que venga del .dvw.

    El .dvw escribe 'Axpo Volley Näfels', 'NAFELS', 'Volley Näfels'... y el
    archivo se llama nafels.png. Se prueba el slug entero y después por
    contención, que es lo que resuelve los nombres largos."""
    if not esc or not equipo:
        return ''
    formas = slugs(equipo)
    for s in formas:
        if s in esc:
            return esc[s]
    for s in formas:
        for k in sorted(esc, key=len, reverse=True):
            if len(k) >= 4 and (k in s or s in k):
                return esc[k]
    # ultimo intento: las dos puntas reducidas a la misma forma. El motor
    # devuelve 'Schonenwerd' —ya sin dieresis— y el archivo se llama
    # schoenenwerd.png: ninguno de los dos contiene al otro, y ese club se
    # quedaba sin escudo en la placa de rotaciones.
    for s in formas:
        rs = _sin_e(s)
        for k in sorted(esc, key=len, reverse=True):
            rk = _sin_e(k)
            if len(rk) >= 4 and (rk in rs or rs in rk):
                return esc[k]
    return ''


def _temporada_previa(temporada):
    """'26-27' -> '25-26'."""
    m = re.match(r'(\d{2})-(\d{2})$', str(temporada))
    if not m:
        return None
    a = int(m.group(1))
    return '%02d-%02d' % ((a - 1) % 100, a % 100)


def varas(repo, temporada):
    """{fundamento: {'media':n,'n':n,'temporada':'25-26'}}.

    Usa la temporada anterior completa. Si no existe (primera temporada del
    club en el sistema), cae a la actual y lo dice en 'temporada', para que
    la placa pueda aclararlo en vez de mentir."""
    try:
        d = json.loads((pathlib.Path(repo) / 'nla_stats.json').read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {}
    previa = _temporada_previa(temporada)
    for temp in (previa, temporada):
        if not temp:
            continue
        P = [p for p in d.get('players', []) if p.get('temporada') == temp]
        out = {}
        for fund, ef in CAMPO_EF.items():
            v = [p[ef] for p in P
                 if p.get(ef) is not None
                 and (p.get(CAMPO_TOT[fund]) or 0) >= MIN_VARA[fund]]
            if len(v) >= 15:      # con menos de 15 no es una media, es ruido
                out[fund] = {'media': round(statistics.mean(v)),
                             'n': len(v), 'temporada': temp}
        if out:
            return out
    return {}


# ── EL COLOR DEL CLUB, SACADO DE SU ESCUDO ─────────────────────────────────
# Los colores de los clubes no están en ningún lado del repo, pero están
# adentro de cada escudo. Se saca el color que más manda —ignorando el
# blanco, el negro y los grises, que son de todos— y se lo lleva a un tono
# que se lea sobre el fondo negro de las placas.
_CACHE_COLOR = {}


def color_escudo(datauri, defecto='#E8192C'):
    if not datauri:
        return defecto
    if datauri in _CACHE_COLOR:
        return _CACHE_COLOR[datauri]
    try:
        from PIL import Image
        import colorsys, io
        crudo = base64.b64decode(datauri.split(',', 1)[1])
        im = Image.open(io.BytesIO(crudo)).convert('RGBA')
        im.thumbnail((80, 80))
        cuenta = {}
        for r, g, b, a in im.getdata():
            if a < 140:
                continue
            h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
            if s < 0.28 or l < 0.10 or l > 0.93:
                continue          # gris, casi negro o casi blanco: no dice nada
            clave = (int(h * 18), int(s * 3), int(l * 3))
            d = cuenta.setdefault(clave, [0, 0.0, 0.0, 0.0])
            d[0] += 1; d[1] += h; d[2] += s; d[3] += l
        if not cuenta:
            _CACHE_COLOR[datauri] = defecto
            return defecto
        n, hs, ss, ls = max(cuenta.values(), key=lambda d: d[0])
        h, s, l = hs / n, ss / n, ls / n
        # sobre negro, un color oscuro desaparece y uno pálido ensucia
        s = min(0.95, max(0.55, s))
        l = min(0.62, max(0.46, l))
        r, g, b = colorsys.hls_to_rgb(h, l, s)
        col = '#%02X%02X%02X' % (int(r * 255), int(g * 255), int(b * 255))
    except Exception:
        col = defecto
    _CACHE_COLOR[datauri] = col
    return col
