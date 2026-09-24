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


def _slug(s):
    """'Näfels' -> 'nafels'. Los archivos de escudos/ están sin acentos."""
    s = unicodedata.normalize('NFKD', str(s))
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', s.lower())


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
    s = _slug(equipo)
    if s in esc:
        return esc[s]
    for k in sorted(esc, key=len, reverse=True):
        if len(k) >= 4 and (k in s or s in k):
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
