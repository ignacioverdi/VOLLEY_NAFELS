#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Una placa por partido, con un cuadro del video de fondo.

POR QUÉ
-------
La placa de resultados cuenta los tres partidos juntos. Sirve para el que
sigue la liga, pero no sirve para que la comparta un club: ningún equipo
postea un gráfico donde su partido es una fila de tres.

Esto es la otra mitad: una placa por partido, con el escudo de cada uno, el
marcador grande, el set a set y la figura. Cada club puede compartir la suya,
y ahí es donde te empiezan a seguir los otros siete.

DE DÓNDE SALE EL FONDO
----------------------
De una jugada del partido, no de un banco de imágenes. `clips.py` ya baja los
partidos enteros para cortar las acciones; antes de borrarlos, se saca un
fotograma del momento de una de esas acciones y queda guardado. Material real
del partido real, sin pagarle a nadie y sin inventar nada.

Y SI NO HAY VIDEO
-----------------
La placa sale igual. El fondo pasa a ser un degradé con los colores de los
dos escudos, que es lo que hacen los clubes cuando no tienen foto. Nunca se
cae por no tener el video: el video la mejora, no la habilita.
"""
import base64
import pathlib
import shutil
import subprocess

import club
import fotos
import idioma
import marcador

# El fotograma se saca un segundo DESPUÉS del contacto: en el instante justo
# el balón todavía está en la mano y la foto parece un ensayo. Un segundo más
# tarde hay balón en el aire, bloqueo arriba y defensa en el piso.
DESPUES = 1.0

CARPETA = 'fondos'

# Cómo se arma la placa. Cambiar esta palabra cambia las tres versiones:
#   'panel'    la foto como panel con marco arriba, el marcador encima
#   'split'    la foto a lo alto de un lado, los datos del otro
#   'estadio'  la foto a sangre detrás de todo
# Sin fotograma, cualquiera de los tres cae en el degradé de los dos clubes.
ESTILO = 'estadio'

# ¿Se usa el fotograma del partido como fondo?
#   False  fondo limpio, con el degradé de los colores de los dos clubes
#   True   el cuadro del video detrás de todo
# Los fotogramas se siguen sacando igual (cuestan cero, se sacan mientras el
# video ya está bajado). Esto solo decide si se usan.
FOTOGRAMA = False


# ── EL FOTOGRAMA ────────────────────────────────────────────────────────────
def momentos(packs):
    """El mejor instante de cada partido: {archivo: segundo}.

    Se prefiere una acción de ataque, que es la que tiene a todo el mundo en
    el aire. Si ese partido no aportó ninguna, vale cualquier otra."""
    elegido, respaldo = {}, {}
    for pk in packs or []:
        ataque = 'ataque' in str(pk.get('slug', '')).lower()
        for a in pk.get('acciones', []):
            arch, t = a.get('archivo'), a.get('t')
            if not arch or t is None:
                continue
            destino = elegido if ataque else respaldo
            destino.setdefault(arch, float(t))
    for arch, t in respaldo.items():
        elegido.setdefault(arch, t)
    return elegido


def _sacar(origen, segundo, salida):
    """Un cuadro del video, en 1080 de ancho."""
    cmd = ['ffmpeg', '-y', '-loglevel', 'error',
           '-ss', '%.2f' % max(0.0, segundo + DESPUES),
           '-i', str(origen), '-frames:v', '1',
           '-vf', 'scale=1080:-2', '-q:v', '3', str(salida)]
    try:
        subprocess.run(cmd, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    return salida if salida.exists() and salida.stat().st_size > 0 else None


def sacar_fondos(videos, packs, destino):
    """Guarda un fotograma por partido. Devuelve cuántos sacó.

    `videos` es {archivo .dvw: video en el disco}, tal como lo arma clips.py
    una vez que bajó lo que hacía falta. Se llama desde ahí, con los videos
    todavía en la máquina."""
    if not shutil.which('ffmpeg'):
        return 0
    carpeta = pathlib.Path(destino) / CARPETA
    carpeta.mkdir(parents=True, exist_ok=True)
    n = 0
    for arch, t in momentos(packs).items():
        v = videos.get(arch)
        if not v:
            continue
        if _sacar(v, t, carpeta / (pathlib.Path(arch).stem[:60] + '.jpg')):
            n += 1
    return n


def fondos(destino):
    """Los fotogramas que ya están sacados: {stem del .dvw: ruta}."""
    carpeta = pathlib.Path(destino) / CARPETA
    if not carpeta.is_dir():
        return {}
    return {f.stem: f for f in carpeta.glob('*.jpg')}


def _uri(ruta):
    try:
        return 'data:image/jpeg;base64,' + base64.b64encode(
            pathlib.Path(ruta).read_bytes()).decode('ascii')
    except OSError:
        return ''


# ── LAS PLACAS ──────────────────────────────────────────────────────────────
def placas_de(repo, archivos, fecha, fuente, ctx, video_dir=None):
    """Una placa por partido de la fecha.

    Devuelve la lista lista para placas2.generar. Si no hay fotogramas, las
    placas salen igual con el degradé de los dos clubes."""
    try:
        partidos = marcador.de_la_fecha(repo, archivos)
    except Exception:
        return []
    if not partidos:
        return []

    fot = fondos(video_dir) if video_dir else {}
    esc = (ctx or {}).get('escudos')
    out = []
    for x in partidos:
        x['esc_l'] = club.escudo_de(esc, x['local'])
        x['esc_v'] = club.escudo_de(esc, x['visita'])
        x['color_l'] = club.color_escudo(x['esc_l']) or '#64748B'
        x['color_v'] = club.color_escudo(x['esc_v']) or '#64748B'
        for lado, corto in (('fig_l', x['corto_l']), ('fig_v', x['corto_v'])):
            if x.get(lado):
                x[lado]['club'] = corto
        cand = [f for f in (x.get('fig_l'), x.get('fig_v')) if f]
        x['figura'] = max(cand, key=lambda f: f['pts']) if cand else None
        # el retrato de la figura, si está cargado en placas/jugadores/.
        # Se busca por NOMBRE: la federación publica el retrato con el
        # nombre, no con el dorsal. Si no hay, va el dorsal de siempre.
        if x['figura']:
            f = x['figura']
            f['foto'] = fotos.foto_de(f.get('nombre'),
                                      f.get('equipo') or f.get('club') or '')

        stem = pathlib.Path(x['archivo']).stem[:60]
        x['fondo'] = _uri(fot[stem]) if (FOTOGRAMA and stem in fot) else ''

        # el slug lleva los dos equipos: así el club encuentra la suya de un
        # vistazo en la carpeta, sin abrir los archivos uno por uno
        slug = 'partido-%s-%s' % (_slug(x['corto_l']), _slug(x['corto_v']))
        out.append({'tipo': 'partido', 'slug': slug, 'fundamento': 'ataque',
                    'estilo': ESTILO,
                    'liga': ctx.get('liga') or '', 'fecha': fecha,
                    'partido': x, 'fuente': fuente,
                    'nombre_archivo': slug})
    return out


def _slug(s):
    import re
    import unicodedata
    s = unicodedata.normalize('NFKD', str(s))
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', '', s.lower())[:12] or 'x'
