#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Las fotos de los jugadores, para el bloque de figura de la placa.

POR QUÉ ASÍ
-----------
La federación suiza publica el retrato de cada jugador en la ficha del
equipo, pero publica **el nombre, no el dorsal**. Así que acá no se busca
por número: se busca por nombre, que es el único dato que tienen en común
el `.dvw` y la foto.

CÓMO SE GUARDAN
---------------
    placas/jugadores/<club>/<apellido>.jpg

El nombre de la carpeta es el del club —como vos quieras escribirlo,
'nafels', 'Näfels', 'axpo volley nafels', da igual—. El del archivo, el
apellido del jugador. Si en el plantel hay dos apellidos iguales, se le
agrega el nombre: `robinson-dunning-kieran.jpg`. Valen .jpg, .png y .webp.

Una foto suelta en `placas/jugadores/` sin carpeta de club vale para
cualquier club: sirve para los casos raros sin tener que inventar carpetas.

SI NO HAY FOTO
--------------
La placa sale igual, con el dorsal en el cuadrado de siempre. Hoy la mitad
de los planteles de la federación todavía no cargó las fotos, así que el
caso normal es que falte.
"""
import base64
import io
import pathlib
import re
import unicodedata

CARPETA = 'jugadores'
EXT = ('.jpg', '.jpeg', '.png', '.webp')

# a qué tamaño se guarda el retrato adentro de la placa. La federación los
# sirve a 300 px de ancho: agrandar no agrega nada, así que 300 es el techo.
LADO = 300

_CACHE = {}


def _tokens(s):
    """'Robinson-Dunning, Kieran' -> {'robinson','dunning','kieran'}"""
    s = unicodedata.normalize('NFKD', str(s or ''))
    s = ''.join(c for c in s if not unicodedata.combining(c)).lower()
    return {t for t in re.split(r'[^a-z0-9]+', s) if len(t) > 1}


def _del_club(carpeta, club):
    """¿Esta carpeta es la de este club?"""
    a, b = _tokens(carpeta), _tokens(club)
    return bool(a & b)


def _catalogo(base):
    """Todas las fotos que hay: [(tokens del archivo, carpeta, ruta)]."""
    raiz = pathlib.Path(base) / CARPETA
    if not raiz.is_dir():
        return []
    out = []
    for f in raiz.rglob('*'):
        if f.is_file() and f.suffix.lower() in EXT:
            carpeta = f.parent.name if f.parent != raiz else ''
            out.append((_tokens(f.stem), carpeta, f))
    return out


def _uri(ruta):
    """El retrato como data URI, recortado en cuadrado si hay Pillow."""
    if ruta in _CACHE:
        return _CACHE[ruta]
    dato = ''
    try:
        crudo = pathlib.Path(ruta).read_bytes()
        try:
            from PIL import Image
            im = Image.open(io.BytesIO(crudo)).convert('RGB')
            an, al = im.size
            lado = min(an, al)
            # el recorte se corre hacia arriba: en un retrato la cara está en
            # el tercio de arriba, y un cuadrado centrado le come la frente
            arriba = max(0, int((al - lado) * 0.25))
            im = im.crop(((an - lado) // 2, arriba,
                          (an - lado) // 2 + lado, arriba + lado))
            if lado > LADO:
                im = im.resize((LADO, LADO), Image.LANCZOS)
            b = io.BytesIO()
            im.save(b, 'JPEG', quality=86)
            crudo, tipo = b.getvalue(), 'jpeg'
        except Exception:
            tipo = pathlib.Path(ruta).suffix.lower().lstrip('.')
            tipo = 'jpeg' if tipo == 'jpg' else tipo
        dato = ('data:image/%s;base64,%s'
                % (tipo, base64.b64encode(crudo).decode('ascii')))
    except OSError:
        dato = ''
    _CACHE[ruta] = dato
    return dato


def foto_de(nombre, club='', base=None):
    """El retrato del jugador como data URI, o '' si no está.

    Se elige el archivo cuyo nombre esté enteramente contenido en el del
    jugador: `norris.jpg` matchea 'James Norris', y `norris-james.jpg`
    matchea mejor todavía. Un archivo que diga algo que el jugador no tiene
    no matchea nunca, así que un apellido parecido no roba la foto."""
    base = base or pathlib.Path(__file__).parent
    jug = _tokens(nombre)
    if not jug:
        return ''
    mejor, puntos = None, 0
    for toks, carpeta, ruta in _catalogo(base):
        if not toks or not toks <= jug:
            continue
        if carpeta and club and not _del_club(carpeta, club):
            continue
        # más tokens en común = más específico; la carpeta del club desempata
        p = len(toks) * 2 + (1 if carpeta else 0)
        if p > puntos:
            mejor, puntos = ruta, p
    return _uri(mejor) if mejor else ''


def cuantas(base=None):
    """Cuántas fotos hay cargadas. Para el informe de publicar.py."""
    return len(_catalogo(base or pathlib.Path(__file__).parent))
