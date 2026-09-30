# -*- coding: utf-8 -*-
"""tuberia.py — sacarle a ffmpeg los cuadros de un tramo, sin archivos de por medio.

POR QUE ASI
-----------
Para medir un saque hacen falta cuatro segundos de video, en gris, del tamanio
que espera el modelo. La forma obvia seria cortar ese pedazo a un archivo y
despues abrirlo; para 240 saques eso son 240 archivos que se escriben y se
borran, y el disco termina haciendo mas trabajo que la medicion.

Aca ffmpeg escribe los cuadros crudos directo a la salida y Python los lee de
ahi. No toca el disco y no recomprime nada.

EL 60i
------
La camara graba 1080/60i: sesenta medias imagenes por segundo, guardadas de a
dos por cuadro. El contenedor declara 59,94 cuadros por segundo pero al
decodificar salen 29,97, porque cada cuadro trae los dos campos adentro.
`bwdif=send_field` los separa y devuelve los 59,94 instantes de verdad, que es
el doble de resolucion temporal para medir. Para que ffmpeg no duplique cuadros
antes de separarlos hay que decirle a que ritmo entra el video, y eso se mide
decodificando un tramo corto y contando.
"""
import json, os, re, subprocess
import numpy as np

ANCHO, ALTO = 1280, 720


def _correr(cmd):
    return subprocess.run(cmd, capture_output=True)


def datos(ff, ffp, video):
    """Tamanio, ritmo real y si viene entrelazado."""
    r = _correr([ffp, '-v', 'error', '-select_streams', 'v:0',
                 '-show_entries', 'stream=width,height,r_frame_rate,field_order',
                 '-show_entries', 'format=duration',
                 '-of', 'json', video])
    try:
        d = json.loads(r.stdout.decode('utf-8', 'ignore'))
        s = d['streams'][0]
    except Exception:
        return None
    w, h = int(s.get('width') or 0), int(s.get('height') or 0)
    a, b = (s.get('r_frame_rate') or '0/1').split('/')
    declarado = float(a) / float(b or 1)
    dur = float(d.get('format', {}).get('duration') or 0)
    orden = (s.get('field_order') or '').lower()

    # El ritmo REAL: se decodifican seis segundos y se cuentan los cuadros. Se
    # hace en DOS tramos distintos y se toma el menor. Equivocar esto por un
    # factor dos duplicaria todas las velocidades, y el modo en que falla
    # —contar de mas— es justo el que el minimo descarta.
    cuentas = []
    for frac in (0.34, 0.66):
        t0 = max(0.0, dur * frac)
        r = _correr([ff, '-hide_banner', '-nostats', '-ss', '%.2f' % t0, '-t', '6',
                     '-i', video, '-f', 'null', '-'])
        m = re.findall(rb'frame=\s*(\d+)', r.stderr)
        if m and int(m[-1]) > 30:
            cuentas.append(int(m[-1]) / 6.0)
    real = min(cuentas) if cuentas else declarado
    entrelazado = orden in ('tt', 'bb', 'tb', 'bt') or (declarado > 1.6 * real)

    # El conteo de arriba sirve para SABER si viene entrelazado, pero como ritmo
    # es aproximado (los bordes de la ventana se comen medio cuadro). El ritmo
    # exacto es el que declara el contenedor, o su mitad si vienen dos campos
    # por cuadro. Y el ritmo importa: equivocarlo corre la velocidad en la misma
    # proporcion.
    if entrelazado and abs(real - declarado / 2.0) < 0.06 * declarado:
        real = declarado / 2.0
    elif not entrelazado and abs(real - declarado) < 0.06 * max(declarado, 1):
        real = declarado

    # El filtro quiere tff/bff, no el 'tt'/'bb' que devuelve ffprobe. Y cuando
    # el contenedor no lo dice —pasa si el archivo se armo copiando trozos— se
    # toma tff, que es lo que graba cualquier camara de 1080/60i.
    paridad = {'tt': 'tff', 'bb': 'bff'}.get(orden, 'tff')
    return dict(w=w, h=h, dur=dur, declarado=declarado,
                real=round(real, 5), entrelazado=bool(entrelazado),
                orden=paridad,
                fps_medicion=round(real * 2, 4) if entrelazado else round(real, 4))


def leer(ff, video, desde, largo, d, ancho=ANCHO, alto=ALTO):
    """Devuelve (cuadros, fps). cuadros: lista de imagenes en gris, uint8."""
    filtros = []
    if d['entrelazado']:
        filtros.append('bwdif=mode=send_field:parity=%s' % d['orden'])
    filtros.append('scale=%d:%d' % (ancho, alto))
    filtros.append('format=gray')
    cmd = [ff, '-hide_banner', '-loglevel', 'error']
    if d['entrelazado']:
        # a que ritmo entra: si no, ffmpeg duplica cuadros para llegar a los
        # 59,94 que declara el contenedor y despues los separa dos veces
        cmd += ['-r', '%.6f' % d['real']]
    cmd += ['-ss', '%.3f' % max(0.0, desde), '-t', '%.3f' % largo, '-i', video,
            '-vf', ','.join(filtros), '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    n = ancho * alto
    cuadros = []
    while True:
        b = p.stdout.read(n)
        if not b or len(b) < n:
            break
        cuadros.append(np.frombuffer(b, np.uint8).reshape(alto, ancho))
    p.stdout.close()
    p.wait()
    return cuadros, d['fps_medicion']
