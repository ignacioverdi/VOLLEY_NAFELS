#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""El plan de publicación de la fecha, escrito para copiar y pegar.

POR QUÉ ESTO Y NO UN TEXTO POR PLACA
------------------------------------
Nueve publicaciones sueltas en Instagram no son nueve oportunidades: son
nueve veces que la misma gente ve lo mismo, y el alcance de cada una cae
porque la anterior todavía está rotando. Lo que rinde es al revés:

  UN carrusel con las nueve placas     -> una sola publicación, el domingo
  UN reel por día de la semana         -> seis, de martes a domingo
  Las historias, el mismo día          -> las placas en 9:16

Con eso la fecha ocupa la semana entera y cada pieza sale cuando la anterior
ya rindió. El carrusel es lo que más se guarda —la gente vuelve a mirarlo— y
los reels son lo que trae gente nueva.

Todo lo que hay acá adentro sale de las placas: ni un número escrito a mano.
"""
import re

import idioma

def HASHTAGS():
    return idioma.post('hashtags')


def FIRMA():
    return idioma.post('firma')

DIAS = ['domingo', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
        'domingo']

def NOMBRE_FUND(slug):
    return idioma.post('f_' + slug)


def GANCHO_REEL(slug, por_defecto=''):
    try:
        return idioma.v('g_' + slug)
    except Exception:
        return por_defecto


def base(p):
    """El slug sin el número de orden: '2-saque' -> 'saque'.

    publicar.py numera los slugs para que los archivos queden en orden, así
    que acá nunca se compara contra el slug crudo."""
    return re.sub(r'^\d+-', '', str(p.get('slug') or ''))


def _n(p):
    """El número que define la placa: ('EFICIENCIA', '47%', media de liga)."""
    f = (p.get('fichas') or [{}])[0]
    h = (f.get('hero') or [None])[0]
    if not h:
        return None
    vara = h[3] if len(h) > 3 and isinstance(h[3], dict) else None
    return h[0], h[1], (vara or {}).get('media')


def _sin_fecha(rotulo):
    return re.sub(r'\s*·.*$', '', rotulo or '').strip()


def titular(piezas):
    """Las dos o tres líneas que van arriba de todo del carrusel."""
    L = []
    for p in piezas:
        if base(p) in ('resultados', 'rotaciones', 'equipo-ideal'):
            continue
        d = _n(p)
        if not d or not p.get('quien'):
            continue
        et, val, media = d
        linea = idioma.post('linea', p['quien'], val, et.lower(),
                            NOMBRE_FUND(base(p)))
        if media:
            linea += idioma.post('vs_liga', media)
        L.append(linea)
    return L[:3]


def resultados_en_texto(piezas):
    for p in piezas:
        if base(p) == 'resultados':
            return ['%s %d-%d %s' % (x['corto_l'], x['sl'], x['sv'], x['corto_v'])
                    for x in p.get('partidos', [])]
    return []


def carrusel(piezas, rotulo, liga_nom):
    """El texto de la publicación del carrusel, listo para pegar."""
    fecha = _sin_fecha(rotulo)
    res = resultados_en_texto(piezas)
    L = [idioma.post('hook', fecha, liga_nom)]
    L.append('')
    if res:
        L += res
        L.append('')
    tit = titular(piezas)
    if tit:
        L += tit
        L.append('')
    # la conclusión de la placa de rotaciones, que es la más fuerte
    for p in piezas:
        if base(p) == 'rotaciones' and p.get('pie'):
            L.append(p['pie'])
            L.append('')
            break
    L.append(idioma.post('deslizar', len(piezas)))
    L.append('')
    L.append(FIRMA())
    L.append('')
    L.append(HASHTAGS())
    return '\n'.join(L)


def reel(p, rotulo, liga_nom):
    """El texto de un reel, el del fundamento de esa placa."""
    fund = base(p)
    d = _n(p)
    L = [GANCHO_REEL(base(p), p.get('titulo', '')) + '.']
    L.append('')
    if p.get('quien'):
        linea = p['quien']
        if d:
            et, val, media = d
            linea += ' · ' + idioma.post('linea', '', val, et.lower(),
                                         NOMBRE_FUND(base(p))).lstrip(' ·')
            if media:
                linea += idioma.post('contra', media)
        L.append(linea + '.')
        L.append('')
    if p.get('pie'):
        L.append(p['pie'])
        L.append('')
    L.append('%s · %s' % (liga_nom, _sin_fecha(rotulo)))
    L.append(FIRMA())
    L.append('')
    L.append(HASHTAGS() + ' #' + re.sub(r'[^a-z]', '', (fund or '')))
    return '\n'.join(L)


def _caja(t):
    return ['', '=' * 62, t.upper(), '=' * 62, '']


def plan(piezas, rotulo, liga_nom, con_video=()):
    """El archivo entero: qué se sube, en qué orden, con qué texto y qué día."""
    fecha = _sin_fecha(rotulo)
    L = ['PLAN DE PUBLICACIÓN · %s' % rotulo.upper(), '',
         'Está todo hecho. Esto es solo el orden y los textos para pegar.']

    L += _caja('1 · Instagram — el carrusel (una sola publicación)')
    L.append('Subí las placas EN ESTE ORDEN, todas en la misma publicación:')
    L.append('')
    for i, p in enumerate(piezas, 1):
        arch = '%s.png' % p.get('slug', '')
        L.append('   %d.  %s  %s' % (i, arch.ljust(24), p.get('titulo', '')))
    L.append('')
    L.append('Instagram deja hasta 20; nueve es un buen número: se termina de')
    L.append('mirar y queda la sensación de que hay más.')
    L.append('')
    L.append('TEXTO DE LA PUBLICACIÓN — copiá desde la línea de abajo:')
    L.append('-' * 62)
    L.append(carrusel(piezas, rotulo, liga_nom))
    L.append('-' * 62)

    cv = {re.sub(r'^\d+-', '', str(x)) for x in (con_video or ())}
    con = [p for p in piezas if base(p) in cv]
    if con:
        L += _caja('2 · Instagram — los reels (uno por día)')
        L.append('Están en redes\\tiktok. El mismo archivo sirve para TikTok,')
        L.append('Reels y Shorts.')
        L.append('')
        L.append('IMPORTANTE: subilos SIN música puesta y elegí el tema')
        L.append('adentro de la app. Ver MUSICA.md.')
        for i, p in enumerate(con, 1):
            L.append('')
            L.append('-' * 62)
            L.append('REEL %d · %s  ·  %s' % (i, base(p),
                                              DIAS[min(i, len(DIAS) - 1)]))
            L.append('-' * 62)
            L.append(reel(p, rotulo, liga_nom))

    L += _caja('3 · Historias')
    L.append('En la carpeta historias están las mismas placas en 9:16.')
    L.append('El mismo día del carrusel, una atrás de otra, con el sticker de')
    L.append('encuesta en la del siete ideal: es la que más respuestas junta.')

    L += _caja('4 · YouTube')
    L.append('redes\\youtube tiene el resumen largo y descripcion.txt con los')
    L.append('capítulos ya calculados. Título sugerido:')
    L.append('')
    L.append('   ' + idioma.post('yt_titulo', fecha, liga_nom))

    L += _caja('El calendario de la semana')
    L.append('   domingo    el carrusel + las historias')
    for i, p in enumerate(con, 1):
        L.append('   %-10s reel %d · %s  (%s.mp4)'
                 % (DIAS[min(i, len(DIAS) - 1)], i, base(p), p.get('slug', '')))
    L.append('   cuando puedas   el resumen largo a YouTube')
    L.append('')
    L.append('Un solo carrusel y un reel por día: la fecha ocupa la semana')
    L.append('entera y ninguna pieza le come el alcance a la anterior.')
    L.append('')
    return '\n'.join(L)
