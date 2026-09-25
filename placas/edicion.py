#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""La edición de los videos: movimiento, rótulos, contador y música.

QUÉ RESUELVE
------------
Un corto de TikTok que arranca con una imagen fija dos segundos y después
muestra seis acciones sin ningún texto encima no retiene a nadie. El que
pasa scrolleando no llega nunca a la segunda acción.

Acá se arma la edición:

  · la placa entra con un zoom lento en vez de quedarse quieta;
  · sobre cada acción va un rótulo con el jugador, qué hizo y a qué zona;
  · un contador "2 / 6" arriba, que da la sensación de que falta poco;
  · una barra de avance finita en el borde de arriba;
  · un cierre de marca de segundo y medio;
  · y música de fondo, si hay, bajando el sonido de cancha sin taparlo.

TODO CON FFMPEG. No hace falta instalar nada más de lo que ya está.

LA MÚSICA
---------
Poné los temas en la carpeta `musica` de `placas`. Se elige uno por corto,
rotando, así no salen todos iguales. Si la carpeta está vacía queda el
sonido de cancha solo, que también funciona.

    placas\\musica\\tema1.mp3
    placas\\musica\\tema2.mp3

Ojo con los derechos: para TikTok e Instagram conviene ponerle la música
desde la propia app, que además te da más alcance. Esta carpeta es para
YouTube o para temas que puedas usar.
"""
import json, pathlib, random, shutil, subprocess

FUENTE = pathlib.Path(__file__).resolve().parent / 'fuentes' / 'Poppins-Bold.ttf'
FUENTE_MONO = pathlib.Path(__file__).resolve().parent / 'fuentes' / 'DejaVuSansMono-Bold.ttf'
MUSICA = pathlib.Path(__file__).resolve().parent / 'musica'
BG = '0x07080F'
EXT_AUDIO = ('.mp3', '.m4a', '.aac', '.wav', '.ogg')

# Cuánto se recorta del arranque de cada acción para el formato corto. Los
# recortes vienen con 4 segundos antes del contacto, que está bien para
# YouTube y es una eternidad en TikTok.
RECORTE_CORTO = 2.2

def _sim():
    import idioma
    return (
        {'#': idioma.v('ev_punto'), '+': idioma.v('ev_positivo'),
         '/': idioma.v('ev_sin_ataque'), '!': idioma.v('ev_neutro'),
         '-': idioma.v('ev_negativo'), '=': idioma.v('ev_error')},
        {'#': idioma.v('ev_ace'), '/': idioma.v('ev_sin_ataque'),
         '+': idioma.v('ev_positivo')},
        {'#': idioma.v('ev_perfecta'), '+': idioma.v('ev_positiva')},
        {'#': idioma.v('ev_blq_punto'), '+': idioma.v('ev_blq_control')},
        {'#': idioma.v('ev_def_perfecta'), '+': idioma.v('ev_def_positiva')})


def _ff(args):
    try:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + args, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def dur(f):
    try:
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                            'format=duration', '-of', 'csv=p=0', str(f)],
                           capture_output=True, text=True, check=True)
        return float(r.stdout.strip())
    except Exception:
        return 0.0


def _txt(s):
    """Escapa el texto para drawtext, que es quisquilloso."""
    s = str(s).replace('\\', r'\\\\').replace(':', r'\:').replace("'", r"\'")
    return s.replace('%', r'\%').replace(',', r'\,').replace('[', r'\[').replace(']', r'\]')


# ── LA RUTA DE LA FUENTE EN WINDOWS ────────────────────────────────────────
# Adentro de un filtro de ffmpeg la barra invertida es caracter de escape y
# los dos puntos separan opciones. Una ruta de Windows tiene las dos cosas:
#
#     C:\Users\User\...\Poppins-Bold.ttf
#
# y ffmpeg la parte en "C" y "\Users\...". El error es
# "No option name near '\Users\...'" y NINGUN rotulo se dibuja: los videos
# salen de dos segundos, solo con la placa.
#
# La forma que funciona es barras normales y los dos puntos escapados:
#
#     C\:/Users/User/.../Poppins-Bold.ttf
#
# Igual no se da por sentado, porque cada build de ffmpeg parsea distinto:
# al arrancar se prueban las variantes con un fotograma de mentira y se usa
# la primera que ande. Si no anda ninguna se sigue SIN fontfile, con la
# tipografia por defecto, en vez de quedarse sin videos.
_CACHE_FUENTE = {}


def _variantes(p):
    s = str(p)
    yield s.replace('\\', '/').replace(':', r'\:')
    yield s.replace('\\', '/')
    yield s.replace('\\', r'\\').replace(':', r'\:')
    yield s


def ruta_fuente(p):
    """Como escribir esta ruta para que ffmpeg la entienda. '' si no hay forma."""
    clave = str(p)
    if clave in _CACHE_FUENTE:
        return _CACHE_FUENTE[clave]
    if not pathlib.Path(p).exists():
        _CACHE_FUENTE[clave] = ''
        return ''
    for v in _variantes(p):
        cmd = ['ffmpeg', '-y', '-loglevel', 'error',
               '-f', 'lavfi', '-i', 'color=c=black:s=64x64:d=1:r=5',
               '-vf', "drawtext=fontfile='%s':text='x':fontcolor=white"
                      ":fontsize=20:x=2:y=2" % v,
               '-frames:v', '1', '-f', 'null', '-']
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL)
            _CACHE_FUENTE[clave] = v
            return v
        except (subprocess.CalledProcessError, FileNotFoundError):
            continue
    _CACHE_FUENTE[clave] = ''
    return ''


def _ft(p):
    """El trozo 'fontfile=...:' listo para el filtro, o vacio si no se puede."""
    v = ruta_fuente(p)
    return ("fontfile='%s':" % v) if v else ''


FUNDAMENTOS = ('saque', 'recepcion', 'armado', 'ataque', 'bloqueo', 'defensa')


def fundamento_de(slug):
    """'A-1-saque' -> 'saque'.

    Ojo con esto: la placa se llama con la letra y el número de orden
    adelante, así que partir por el primer guión devolvía '1-saque' y ningún
    saque llegaba nunca a decir ACE: caían todos en el 'PUNTO' genérico."""
    s = (slug or '').lower()
    for f in FUNDAMENTOS:
        if s == f or s.endswith('-' + f):
            return f
    return s


def etiqueta(slug, ev):
    gen, sq, rc, bq, df = _sim()
    base = fundamento_de(slug)
    esp = {'saque': sq, 'recepcion': rc, 'bloqueo': bq, 'defensa': df}.get(base)
    if esp:
        return esp.get(ev, gen.get(ev, ''))
    return gen.get(ev, '')


VID = ['-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
       '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2']


def _encaja(texto, fs, ancho, factor=0.56, minimo=14):
    """Baja el tamaño de letra hasta que el texto entre en el ancho que hay."""
    n = max(1, len(texto or ''))
    return max(minimo, min(fs, int(ancho / (n * factor))))


def _encuadre(w, h, fondo_video=True):
    """El clip metido en el lienzo, con el fondo lleno.

    En vertical un video de cancha ocupa la franja del medio y arriba y abajo
    queda una banda negra enorme: un tercio de la pantalla sin nada. En vez de
    negro se pone el mismo video, ampliado y desenfocado. Es lo que hace toda
    la gente que edita para TikTok, y no es capricho: el ojo lee la pantalla
    entera como una imagen y el clip parece más grande de lo que es.

    El desenfoque se hace en chiquito (270x480) y se agranda después. Hacerlo
    en tamaño real cuesta cuatro veces más y se ve igual.
    """
    recto = ('scale=%d:%d:force_original_aspect_ratio=decrease,'
             'pad=%d:%d:(ow-iw)/2:(oh-ih)/2:%s,setsar=1' % (w, h, w, h, BG))
    if not fondo_video or h <= w:
        return recto
    return (
        'split=2[bg][fg];'
        '[bg]scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,'
        'scale=270:-2,boxblur=14:2,scale=%d:%d,'
        'eq=brightness=-0.22:saturation=0.65,setsar=1[bgb];'
        '[fg]scale=%d:%d:force_original_aspect_ratio=decrease,setsar=1[fgs];'
        '[bgb][fgs]overlay=(W-w)/2:(H-h)/2'
        % (w, h, w, h, w, h, w, h))


def placa_animada(png, salida, w, h, seg, color='0xF59E0B'):
    """La placa con un zoom lento y una barra de color que crece abajo.

    El movimiento es mínimo —del 100% al 106%— pero alcanza para que no
    parezca una foto colgada, que es lo que hace que la gente siga de largo.
    """
    cuadros = int(seg * 30)
    vf = (_encuadre(w, h) +
          ",zoompan=z='min(1.06,zoom+0.0007)':d=%d:x='iw/2-(iw/zoom/2)'"
          ":y='ih/2-(ih/zoom/2)':s=%dx%d:fps=30" % (cuadros, w, h) +
          ",drawbox=x=0:y=ih-8:w='iw*(t/%.2f)':h=8:color=%s@0.95:t=fill" % (seg, color))
    return _ff(['-loop', '1', '-framerate', '30', '-i', str(png),
                '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
                '-t', '%.2f' % seg, '-vf', vf] + VID + ['-shortest', str(salida)])


def accion_rotulada(mp4, salida, w, h, quien, que, n, total, color='0xF59E0B',
                    recorte=0.0, seg_extra='', marca='', pie='', cabecera=None):
    """Una acción con el rótulo encima, el contador y la barra de avance.

    El rótulo importa más de lo que parece: el que cae en el video por el
    medio no vio la placa, y sin esto no sabe quién es ni qué está mirando.

    `marca` es el marcador de ese rally ('18-17') y va a la derecha, con el
    tamaño de un marcador de TV: es el dato que le da contexto a la acción.
    `pie` es el resultado final del partido, chico y abajo.
    """
    d = max(0.5, dur(mp4) - recorte)
    alto_r = int(h * (0.112 if pie else 0.092))
    # En vertical el rótulo va justo debajo del video, no abajo de todo: ahí
    # TikTok e Instagram le encajan encima el usuario, el texto del posteo y
    # la botonera. Todo lo que baje del 78% de la pantalla lo tapan.
    y_r = int(h * (0.665 if h > w else 0.755)) if pie \
        else int(h * (0.685 if h > w else 0.775))
    f1 = int(h * 0.030)
    f2 = int(h * 0.022)
    f3 = int(h * 0.017)
    fm = int(h * 0.042)                    # el marcador, grande
    hasta = d - 0.4
    # Con el marcador a la derecha el nombre ya no tiene todo el ancho. En
    # vertical entra justo, así que el tamaño se baja hasta que el texto
    # entre: un nombre cortado por el borde arruina el rótulo entero.
    linea2 = que + ('  ·  ' + seg_extra if seg_extra else '')
    # En horizontal el panel no cruza toda la pantalla: un rótulo de 1920 px
    # con el marcador en la otra punta se lee en dos viajes. Se corta al 62%
    # y el marcador queda al lado del texto, como un grafico de TV.
    xp = w if h > w else int(w * 0.62)
    reserva = (int(fm * 0.62 * len(marca)) + 56) if marca else 0
    f1 = _encaja(quien, f1, xp - 96 - reserva, 0.54, int(h * 0.016))
    f2 = _encaja(linea2, f2, xp - 96 - reserva, 0.62, int(h * 0.012))
    if pie:
        f3 = _encaja(pie, f3, xp - 96, 0.62, int(h * 0.010))
    partes = [
        _encuadre(w, h),
        # barra de avance del corto entero, arriba
        "drawbox=x=0:y=0:w='iw*(t/%.2f)':h=6:color=%s@0.9:t=fill" % (d, color),
        # panel del rotulo, con entrada y salida suaves
        ("drawbox=x=0:y=%d:w=%d:h=%d:color=black@0.62:t=fill"
         ":enable='between(t,0.25,%.2f)'" % (y_r, xp, alto_r, hasta)),
        # filo de color a la izquierda: ancla la lectura
        ("drawbox=x=0:y=%d:w=8:h=%d:color=%s@0.95:t=fill"
         ":enable='between(t,0.25,%.2f)'" % (y_r, alto_r, color, hasta)),
        # y otro a la derecha cuando el panel no cruza toda la pantalla
        ("drawbox=x=%d:y=%d:w=6:h=%d:color=%s@0.95:t=fill"
         ":enable='between(t,0.25,%.2f)'"
         % (xp - 6, y_r, alto_r, color, hasta)) if xp < w else 'null',
        ("drawtext=%stext='%s':fontcolor=white:fontsize=%d"
         ":x=48:y=%d:enable='between(t,0.25,%.2f)'"
         % (_ft(FUENTE), _txt(quien.upper()), f1,
            y_r + int(alto_r * 0.11), hasta)),
        ("drawtext=%stext='%s':fontcolor=%s:fontsize=%d"
         ":x=48:y=%d:enable='between(t,0.25,%.2f)'"
         % (_ft(FUENTE_MONO), _txt(linea2),
            color, f2, y_r + int(alto_r * (0.45 if pie else 0.55)), hasta)),
        # contador arriba a la derecha
        ("drawtext=%stext='%d / %d':fontcolor=white@0.85:fontsize=%d"
         ":x=w-tw-44:y=34:box=1:boxcolor=black@0.45:boxborderw=14"
         % (_ft(FUENTE_MONO), n, total, f2)),
    ]
    if pie:
        partes.append(
            "drawtext=%stext='%s':fontcolor=white@0.62:fontsize=%d"
            ":x=48:y=%d:enable='between(t,0.25,%.2f)'"
            % (_ft(FUENTE_MONO), _txt(pie.upper()), f3,
               y_r + int(alto_r * 0.74), hasta))
    if marca:
        # el marcador va pegado al borde derecho, como en la tele
        partes.append(
            "drawtext=%stext='%s':fontcolor=white:fontsize=%d"
            ":x=%d-tw:y=%d:enable='between(t,0.25,%.2f)'"
            % (_ft(FUENTE_MONO), _txt(marca), fm, xp - 48,
               y_r + int(alto_r * (0.22 if pie else 0.26)), hasta))
    args = ['-ss', '%.2f' % recorte, '-i', str(mp4), '-t', '%.2f' % d]
    graf = ','.join(x for x in partes if x != 'null')
    if cabecera and h > w:
        # la banda de arriba se pega como imagen, no con drawtext: así la
        # tipografía y el logo son los mismos que en las placas
        hc = int(w * .175)
        y_c = max(int(h * .045), int((h - w * 9 / 16.0) / 2) - hc - 34)
        fc = ('[0:v]%s[base];[base][1:v]overlay=0:%d:'
              "enable='between(t,0.15,%.2f)'[v]" % (graf, y_c, hasta))
        ok = _ff(args + ['-i', str(cabecera), '-filter_complex', fc,
                         '-map', '[v]', '-map', '0:a?'] + VID + [str(salida)])
        if ok:
            return True, d
    if _ff(args + ['-vf', graf] + VID + [str(salida)]):
        return True, d
    # Escalones de respaldo: primero el rotulo viejo, de una sola linea, y si
    # tampoco sale, la accion sin texto. Un texto que falla no puede costar el
    # clip entero: eso fue exactamente lo que dejo los cortos en dos segundos.
    simple = [_encuadre(w, h, False),
              ("drawbox=x=0:y=%d:w=iw:h=%d:color=black@0.55:t=fill"
               % (int(h * 0.80), int(h * 0.085))),
              ("drawtext=%stext='%s':fontcolor=white:fontsize=%d:x=48:y=%d"
               % (_ft(FUENTE), _txt(quien.upper()), f1, int(h * 0.80) + 12))]
    if _ff(args + ['-vf', ','.join(simple)] + VID + [str(salida)]):
        return True, d
    return _ff(args + ['-vf', _encuadre(w, h, False)] + VID + [str(salida)]), d


def cierre(salida, w, h, color='0xF59E0B', texto='VOLLEY·STATS',
           sub='volley-stats.com', seg=1.6):
    """El cierre de marca. Corto: el que llegó hasta acá ya vio lo que venía."""
    f1 = int(h * 0.055)
    f2 = int(h * 0.026)
    vf = ("drawtext=%stext='%s':fontcolor=white:fontsize=%d"
          ":x=(w-tw)/2:y=(h-th)/2-%d"
          ",drawtext=%stext='%s':fontcolor=%s:fontsize=%d"
          ":x=(w-tw)/2:y=(h-th)/2+%d"
          ",drawbox=x=(iw-%d)/2:y=ih/2+%d:w=%d:h=4:color=%s@0.9:t=fill"
          % (_ft(FUENTE), _txt(texto), f1, int(h * 0.02),
             _ft(FUENTE_MONO), _txt(sub), color, f2, int(h * 0.045),
             int(w * 0.14), int(h * 0.005), int(w * 0.14), color))
    base = ['-f', 'lavfi', '-i', 'color=c=%s:s=%dx%d:d=%.2f:r=30' % (BG, w, h, seg),
            '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000']
    if _ff(base + ['-vf', vf] + VID + ['-shortest', str(salida)]):
        return True
    # sin texto, pero la placa de cierre sale
    return _ff(base + VID + ['-shortest', str(salida)])


def temas():
    if not MUSICA.is_dir():
        return []
    return sorted(f for f in MUSICA.iterdir() if f.suffix.lower() in EXT_AUDIO)


def con_musica(video, salida, tema, vol_musica=0.55, semilla=0):
    """Mezcla la música debajo del sonido de cancha.

    La música NO tapa el partido: se le baja el volumen y se la comprime
    contra el audio original, así cuando hay grito o golpe la música cede.
    """
    if not tema or not tema.exists():
        return None
    d = dur(video)
    if d <= 0:
        return None
    # arranca en un punto variable del tema, para que dos cortos seguidos no
    # empiecen con la misma frase musical
    inicio = (semilla * 17) % max(1, int(max(1.0, dur(tema)) - d - 1))
    fc = ('[1:a]atrim=start=%d,asetpts=PTS-STARTPTS,volume=%.2f,'
          'afade=t=in:st=0:d=0.8,afade=t=out:st=%.2f:d=1.0[m];'
          '[m][0:a]sidechaincompress=threshold=0.05:ratio=6:attack=15:release=350[mc];'
          '[0:a][mc]amix=inputs=2:duration=first:dropout_transition=0,'
          'volume=1.6[a]' % (inicio, vol_musica, max(0.0, d - 1.0)))
    ok = _ff(['-i', str(video), '-stream_loop', '-1', '-i', str(tema),
              '-filter_complex', fc, '-map', '0:v', '-map', '[a]',
              '-c:v', 'copy', '-c:a', 'aac', '-ar', '48000', '-ac', '2',
              '-t', '%.2f' % d, str(salida)])
    return salida if ok else None


def unir(partes, salida):
    if not partes:
        return None
    lista = salida.parent / (salida.stem + '_l.txt')
    lista.write_text(''.join("file '%s'\n" % p.resolve().as_posix() for p in partes),
                     encoding='utf-8')
    ok = _ff(['-f', 'concat', '-safe', '0', '-i', str(lista), '-c', 'copy', str(salida)])
    lista.unlink(missing_ok=True)
    return salida if ok else None


def leer_acciones(carpeta, nombre):
    """Las acciones sueltas de una placa, si clips.py las dejó."""
    j = carpeta / 'acciones' / ('%s.json' % nombre)
    if not j.exists():
        # La numeración de las placas cambia cuando se agrega o se saca una
        # (la de resultados, por ejemplo) y el .json queda con el nombre
        # viejo. Se busca por fundamento, que es lo único que no cambia.
        f = fundamento_de(nombre)
        cand = sorted((carpeta / 'acciones').glob('*-%s.json' % f)) \
            if (carpeta / 'acciones').is_dir() else []
        if not cand and (carpeta / 'acciones' / ('%s.json' % f)).exists():
            cand = [carpeta / 'acciones' / ('%s.json' % f)]
        if not cand:
            return None
        j = cand[0]
    try:
        d = json.loads(j.read_text(encoding='utf-8'))
    except ValueError:
        return None
    # El archivo se resuelve por el numero, no por el nombre guardado: la
    # carpeta de publicacion renombra todo con el numero de orden y el
    # nombre de adentro del json deja de coincidir.
    ac = carpeta / 'acciones'
    for a in d.get('acciones', []):
        cand = ac / ('%s_%02d.mp4' % (nombre, a['n']))
        if not cand.exists():
            # por fundamento, nunca por el número solo: '*_03.mp4' agarra la
            # acción 3 de cualquier otra placa y te mete un bloqueo adentro
            # del video del saque
            f = fundamento_de(nombre)
            g = [x for x in sorted(ac.glob('*_%02d.mp4' % a['n']))
                 if fundamento_de(x.stem.rsplit('_', 1)[0]) == f]
            cand = g[0] if g else cand
        a['ruta'] = cand
    d['acciones'] = [a for a in d.get('acciones', []) if a['ruta'].exists()]
    return d if d['acciones'] else None
