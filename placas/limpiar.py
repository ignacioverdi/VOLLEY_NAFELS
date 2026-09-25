#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Borra lo viejo antes de rehacerlo.

POR QUÉ
-------
Todo lo que se genera lleva el número de orden en el nombre: 3-saque.png,
3-saque.mp4. Si cambia el orden —porque agregamos una placa, o sacamos otra—
los archivos nuevos se llaman distinto y los viejos se quedan ahí para
siempre. Pasa lo mismo si el mejor sacador de la fecha cambia después de
corregir un scout.

Así terminás con dos versiones de la misma fecha en la misma carpeta, sin
saber cuál es cuál, y con 600 MB de videos que ya no van a ninguna parte.

Cada paso borra LO SUYO antes de escribir:

    placas   los PNG de la fecha y los de historias
    textos   textos.txt y PUBLICAR.txt
    redes    los videos de YouTube y de TikTok
    videos   los recortes de acciones

Los recortes se borran solo cuando se vuelven a cortar, porque volver a
bajarlos cuesta media hora. Rehacer las redes no los toca.

LA RED DE SEGURIDAD
-------------------
No borra nada fuera de una carpeta de salida: la ruta tiene que terminar en
fecha-NN, hasta-NN o acumulado. Si no, no hace nada y avisa. Es barato y
evita el día que alguien pase la carpeta equivocada.
"""
import pathlib
import re
import shutil

RX_SALIDA = re.compile(r'^(fecha-\d+|hasta-\d+|acumulado)$')

GRUPOS = {
    'placas': ['*.png', 'historias/*.png', 'historias/*.html', '*.html'],
    'textos': ['textos.txt', 'PUBLICAR.txt', 'REVISION.txt'],
    'redes':  ['redes/youtube/*', 'redes/tiktok/*'],
    'videos': ['video/*.mp4', 'video/acciones/*'],
}


def es_salida(destino):
    return bool(RX_SALIDA.match(pathlib.Path(destino).name))


def limpiar(destino, *grupos):
    """Borra los archivos de esos grupos. Devuelve cuántos borró."""
    destino = pathlib.Path(destino)
    if not destino.is_dir() or not es_salida(destino):
        return 0
    n = 0
    for g in grupos:
        for patron in GRUPOS.get(g, []):
            for f in destino.glob(patron):
                try:
                    if f.is_dir():
                        shutil.rmtree(f, ignore_errors=True)
                    else:
                        f.unlink()
                    n += 1
                except OSError:
                    pass
    return n


def aviso(n, que):
    if not n:
        return ''
    return '   (borré %d archivo%s de %s que ya no van)' % (
        n, '' if n == 1 else 's', que)
