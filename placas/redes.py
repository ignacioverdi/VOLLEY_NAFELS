#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Los videos para YouTube y TikTok, armados con lo que ya está hecho.

LA IDEA
-------
Después de correr una fecha ya tenemos las siete placas y los recortes de
video de cada una. Con eso, sin calcular nada nuevo, salen:

  YOUTUBE   un solo video de la fecha: cada placa aparece como pantalla y
            atrás van sus acciones. Cinco minutos, 16:9, con los capítulos
            ya escritos para pegar en la descripción.

  TIKTOK    un video corto por fundamento, 9:16: la placa vertical dos
            segundos y sus acciones atrás. Cinco videos de 40 a 60 segundos.

  REELS     son los mismos que los de TikTok.

No hace falta editar nada. Sale de concatenar lo que el sistema ya produjo.

    python redes.py --repo .. --fecha 3
"""
import argparse, json, pathlib, re, shutil, subprocess, sys

import clips, edicion, fechas, idioma, limpiar, marca, marcador, placas2, seis_placas

BG = '0x07080F'                 # el mismo negro de las placas
LIGA_NOM = idioma.liga()
SEG_PLACA_YT = 4.5              # cuánto dura cada placa en el video largo
SEG_PLACA_TT = 2.4              # y en los cortos
SEG_PORTADA = 1.7               # el enganche del arranque
SEG_INTRO = 2.3                 # la marca, solo en YouTube
SEG_CIERRE = 3.0

# Cómo se llama cada fundamento en la banda de arriba del video.
class _Banda(dict):
    def get(self, k, d=None):
        return idioma.v('b_' + k) if k else d


BANDA = _Banda()

# El gancho de cada corto. Una sola idea, en mayúsculas y enorme. Nada de
# explicar: en TikTok el que no entiende en un segundo ya se fue.
def _gancho(slug):
    return idioma.v('g_' + slug)


class _Gancho(dict):
    def get(self, k, d=None):
        try:
            return idioma.v('g_' + k)
        except Exception:
            return d


GANCHO = _Gancho()
YT_W, YT_H = 1920, 1080
TT_W, TT_H = 1080, 1920


def _ff(args):
    try:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + args, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def _dur(f):
    try:
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                            'format=duration', '-of', 'csv=p=0', str(f)],
                           capture_output=True, text=True, check=True)
        return float(r.stdout.strip())
    except Exception:
        return 0.0


def _tiene_audio(f):
    try:
        r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a',
                            '-show_entries', 'stream=index', '-of', 'csv=p=0', str(f)],
                           capture_output=True, text=True, check=True)
        return bool(r.stdout.strip())
    except Exception:
        return False


VID = ['-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
       '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2']


def _encuadre(w, h):
    """Entra completo y lo que sobra se rellena con el negro de la marca."""
    return ('scale=%d:%d:force_original_aspect_ratio=decrease,'
            'pad=%d:%d:(ow-iw)/2:(oh-ih)/2:%s,setsar=1' % (w, h, w, h, BG))


def placa_a_video(png, salida, w, h, seg):
    """Una placa fija, convertida en un tramo de video con silencio."""
    return _ff(['-loop', '1', '-framerate', '30', '-i', str(png),
                '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
                '-t', '%.2f' % seg, '-vf', _encuadre(w, h)] + VID +
               ['-shortest', str(salida)])


def clip_a_video(mp4, salida, w, h):
    """Un recorte, reencuadrado al formato de la red.

    Si el recorte viene sin audio (pasa cuando el video del partido no
    tenía), se le pega un silencio: si no, la unión de los tramos falla."""
    if _tiene_audio(mp4):
        return _ff(['-i', str(mp4), '-vf', _encuadre(w, h)] + VID + [str(salida)])
    return _ff(['-i', str(mp4),
                '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
                '-vf', _encuadre(w, h)] + VID + ['-shortest', str(salida)])


def unir(partes, salida):
    if not partes:
        return None
    lista = salida.parent / (salida.stem + '_lista.txt')
    lista.write_text(''.join("file '%s'\n" % p.resolve().as_posix() for p in partes),
                     encoding='utf-8')
    ok = _ff(['-f', 'concat', '-safe', '0', '-i', str(lista), '-c', 'copy', str(salida)])
    lista.unlink(missing_ok=True)
    return salida if ok else None


def _mmss(s):
    s = int(s)
    return '%d:%02d' % (s // 60, s % 60)


def piezas_de(carpeta, piezas):
    """Empareja cada placa con su recorte, por el número de publicación."""
    out = []
    for i, p in enumerate(piezas, 1):
        slug = '%d-%s' % (i, p['slug'].split('-', 1)[-1]) if '-' in str(p['slug']) \
            else '%d-%s' % (i, p['slug'])
        png = carpeta / (slug + '.png')
        if not png.exists():
            # la corrida numeró distinto: se busca por el final del nombre
            cand = list(carpeta.glob('%d-*.png' % i))
            png = cand[0] if cand else None
        if not png:
            continue
        mp4 = png.with_suffix('.mp4')
        vert = carpeta / 'historias' / png.name
        dato = p.get('quien', '')
        try:
            h = (p.get('fichas') or [{}])[0].get('hero') or []
            if dato and h:
                dato = '%s  ·  %s %s' % (dato, str(h[0][0]).title(), h[0][1])
        except Exception:
            pass
        out.append({'n': i, 'titulo': p.get('titulo', ''), 'quien': p.get('quien', ''),
                    'dato': dato,
                    'fundamento': p.get('fundamento', 'saque'),
                    'png': png, 'vertical': vert if vert.exists() else png,
                    'clip': mp4 if mp4.exists() else None,
                    'slug': png.stem})
    return out


LARGO_ROTULO = 30          # lo que entra al lado del marcador, en vertical


def _abreviado(nom, tope):
    """'JOAO PEDRO NASCIMENTO' -> 'J. P. NASCIMENTO' -> 'NASCIMENTO'.

    Es lo que hace cualquier gráfico de TV: el apellido es lo que identifica,
    los nombres de pila entran solo si sobra lugar."""
    nom = (nom or '').strip()
    p = nom.split()
    if len(p) < 2 or (tope and len(nom) <= tope):
        return nom
    corto = ' '.join([x[0] + '.' for x in p[:-1]] + [p[-1]])
    return corto if (not tope or len(corto) <= tope) else p[-1]


def completar_marcador(base, repo, archivos):
    """Les pone el marcador a las acciones que ya estaban cortadas.

    Los cortes hechos antes de que esto existiera no tienen el marcador en su
    .json. Se completa leyendo otra vez el .dvw —que ya está en el disco— y
    cruzando por set y segundo de video. Así no hay que volver a bajar un solo
    partido para tener los rótulos nuevos."""
    carpeta = base / 'acciones'
    if not carpeta.is_dir():
        return 0
    pendientes = []
    for j in sorted(carpeta.glob('*.json')):
        try:
            d = json.loads(j.read_text(encoding='utf-8'))
        except ValueError:
            continue
        if any(not x.get('marcador') for x in d.get('acciones', [])):
            pendientes.append((j, d))
    if not pendientes:
        return 0
    try:
        acc = clips.acciones(repo, archivos)
    except Exception:
        return 0
    fino, grueso = {}, {}
    for a in acc:
        fino.setdefault((str(a.get('set')), int(a['t']), a['skill'], a['ev']),
                        []).append(a)
        grueso.setdefault((str(a.get('set')), int(a['t'])), []).append(a)

    def una(d, k):
        """Solo si no hay duda: un marcador equivocado es peor que ninguno."""
        v = d.get(k) or []
        return v[0] if len(v) == 1 else None
    n = 0
    for j, d in pendientes:
        sk = clips.BUSCA.get(edicion.fundamento_de(d.get('slug', '')),
                             ('E', []))[0]
        for x in d.get('acciones', []):
            if x.get('marcador'):
                continue
            k = (str(x.get('set')), int(x.get('seg') or 0))
            src = una(fino, k + (sk, x.get('ev', ''))) or una(grueso, k)
            if not src:
                continue
            x['marcador'] = src.get('marcador', '')
            x['resultado'] = src.get('resultado', '')
            x['club'] = src.get('club', '')
            x['dorsal'] = src.get('dorsal', '')
            n += 1
        j.write_text(json.dumps(d, ensure_ascii=False, indent=1),
                     encoding='utf-8')
    return n


def _pantallas(tmp, w, h, cta):
    """La intro y el cierre de marca, dibujadas una sola vez por corrida."""
    try:
        return marca.pantallas(tmp, w, h, cta=cta)
    except Exception:
        return {}


def _banda(tmp, it, liga_nom, rotulo):
    """La banda de arriba: el logo, la liga y la fecha, sobre el vacío."""
    try:
        # corta: en la banda entran dos datos, no cuatro
        liga = (liga_nom or '').split(' · ')[0]
        fecha = (rotulo or '').split(' · ')[0]
        return marca.cabecera(
            tmp, TT_W, izq=' · '.join(x for x in (liga, fecha) if x),
            der=BANDA.get(it.get('fundamento'), it.get('titulo', '')),
            nombre='banda_%02d' % it['n'])
    except Exception:
        return None


def _rotulo(datos, it, a):
    """Las tres líneas del rótulo de una acción.

    Línea 1: quién es, con dorsal y club, como lo pone un grafico de TV.
    Línea 2: qué hizo, en qué set y en qué zona.
    Marcador: cómo quedó el partido con ese rally.
    Pie:      cómo terminó el partido.
    """
    nom = datos.get('quien') or it.get('quien') or ''
    dor = ('#' + (a.get('dorsal') or '').lstrip('0')) if a.get('dorsal') else ''
    club = a.get('club') or ''
    def arma(n, con_club):
        return ' · '.join([x for x in [n, dor, club if con_club else ''] if x])
    ini = _abreviado(nom, 0)                       # 'J. P. NASCIMENTO'
    ape = nom.split()[-1] if nom.split() else nom  # 'NASCIMENTO'
    # de más completo a más corto: se usa el primero que entra
    if club and club.upper() in nom.upper():       # 'AXPO NAFELS · NAFELS' no
        club = ''
    opciones = [arma(nom, True), arma(ini, True), arma(ape, True),
                arma(ini, False), arma(ape, False)]
    quien = next((o for o in opciones if len(o) <= LARGO_ROTULO), opciones[-1])
    res = a.get('resultado') or ''
    return quien, a.get('marcador') or '', \
        (idioma.v('final') + '  ' + res) if res else ''


def youtube(items, destino, rotulo, base, musica=True):
    """Un video de la fecha: placa, sus acciones, placa, sus acciones."""
    tmp = destino / '_tmp'; tmp.mkdir(parents=True, exist_ok=True)
    partes, capitulos, t = [], [], 0.0
    pant = _pantallas(tmp, YT_W, YT_H, marca.CIERRE_YT)
    intro = tmp / 'yt_intro.mp4'
    if pant.get('intro') and edicion.placa_animada(
            pant['intro'], intro, YT_W, YT_H, SEG_INTRO, '0xE8192C'):
        partes.append(intro); t += SEG_INTRO
    elif edicion.cierre(intro, YT_W, YT_H, '0xE8192C', 'VOLLEY·STATS',
                        rotulo, seg=2.2):
        partes.append(intro); t += 2.2
    for it in items:
        color = '0x' + placas2.FUNDA.get(it['fundamento'], '#F59E0B').lstrip('#')
        seg = tmp / ('yt_%02d_placa.mp4' % it['n'])
        if edicion.placa_animada(it['png'], seg, YT_W, YT_H, SEG_PLACA_YT, color):
            capitulos.append((t, it['titulo']))
            partes.append(seg); t += SEG_PLACA_YT
        datos = edicion.leer_acciones(base, it['slug'])
        if datos:
            total = len(datos['acciones'])
            for a in datos['acciones']:
                d = tmp / ('yt_%02d_a%02d.mp4' % (it['n'], a['n']))
                que = edicion.etiqueta(it['slug'], a.get('ev', ''))
                quien, marca_, pie = _rotulo(datos, it, a)
                ok, dd = edicion.accion_rotulada(
                    a['ruta'], d, YT_W, YT_H, quien,
                    que, a['n'], total, color, recorte=0.0,
                    seg_extra=marcador.ordinal(a.get('set')),
                    marca=marca_, pie=pie)
                if ok:
                    partes.append(d); t += dd
        elif it['clip']:
            seg2 = tmp / ('yt_%02d_clip.mp4' % it['n'])
            if clip_a_video(it['clip'], seg2, YT_W, YT_H):
                partes.append(seg2); t += _dur(seg2)
    fin = tmp / 'yt_fin.mp4'
    if pant.get('cierre') and edicion.placa_animada(
            pant['cierre'], fin, YT_W, YT_H, SEG_CIERRE, '0xE8192C'):
        partes.append(fin); t += SEG_CIERRE
    elif edicion.cierre(fin, YT_W, YT_H, '0xE8192C', 'VOLLEY·STATS',
                        'volley-stats.com', seg=2.5):
        partes.append(fin); t += 2.5
    salida = destino / ('resumen-%s.mp4' % re.sub(r'[^a-z0-9]+', '-', rotulo.lower()).strip('-'))
    crudo = tmp / 'yt_full.mp4'
    out = unir(partes, crudo)
    if out:
        pistas = edicion.temas()
        listo = edicion.con_musica(out, salida, pistas[0], vol_musica=0.35) \
            if (musica and pistas) else None
        if not listo:
            shutil.copy(out, salida)
        out = salida
    shutil.rmtree(tmp, ignore_errors=True)
    return out, capitulos, t


def portada_de(it, rotulo, destino, liga_nom):
    """El PNG del enganche, hecho con el mismo motor que las placas."""
    base_slug = it['slug'].split('-', 1)[-1]
    g = GANCHO.get(base_slug)
    if not g:
        return None
    pieza = {'tipo': 'portada', 'slug': 'portada-' + base_slug,
             'fundamento': it['fundamento'], 'liga': liga_nom, 'fecha': rotulo,
             'titulo': '', 'sobre': '%s · %s' % (liga_nom, rotulo),
             'gancho': g,
             'dato': it.get('dato') or it['titulo'],
             'fuente': '', 'cta': None}
    try:
        hechos = placas2.generar([pieza], destino, alto=TT_H)
    except Exception:
        return None
    if not hechos:
        return None
    f = destino / hechos[0]
    return f if f.exists() else None


def tiktok(items, destino, base, musica=True, rotulo='', liga_nom=''):
    """Un corto por fundamento, editado.

    La placa entra con zoom, cada acción lleva su rótulo y su contador, y
    cierra con la marca. Si hay acciones sueltas se usan esas, que permiten
    recortar el arranque y poner texto encima; si no, se cae al recorte
    pegado, que igual sale pero sin rótulos.
    """
    hechos = []
    tmp = destino / '_tmp'; tmp.mkdir(parents=True, exist_ok=True)
    pistas = edicion.temas()
    pant = _pantallas(tmp, TT_W, TT_H, marca.CIERRE_TT)
    for k, it in enumerate(items):
        if not it['clip']:
            continue
        color = '0x' + placas2.FUNDA.get(it['fundamento'], '#F59E0B').lstrip('#')
        partes = []
        # 1 · el enganche: que se entienda en un segundo qué se va a ver
        png_port = portada_de(it, rotulo, tmp, liga_nom)
        if png_port:
            pp = tmp / ('tt_%02d_port.mp4' % it['n'])
            if edicion.placa_animada(png_port, pp, TT_W, TT_H,
                                     SEG_PORTADA, color):
                partes.append(pp)
        # 2 · la placa con los datos
        seg = tmp / ('tt_%02d_placa.mp4' % it['n'])
        if edicion.placa_animada(it['vertical'], seg, TT_W, TT_H,
                                 SEG_PLACA_TT, color):
            partes.append(seg)

        cab = _banda(tmp, it, liga_nom, rotulo)
        datos = edicion.leer_acciones(base, it['slug'])
        if datos:
            total = len(datos['acciones'])
            for a in datos['acciones']:
                d = tmp / ('tt_%02d_a%02d.mp4' % (it['n'], a['n']))
                que = edicion.etiqueta(it['slug'], a.get('ev', ''))
                extra = ('Z%d' % a['zona']) if a.get('zona') else ''
                quien, marca_, pie = _rotulo(datos, it, a)
                ok, _ = edicion.accion_rotulada(
                    a['ruta'], d, TT_W, TT_H, quien,
                    que, a['n'], total, color,
                    recorte=edicion.RECORTE_CORTO,
                    seg_extra=marcador.ordinal(a.get('set')) +
                              (('  ·  ' + extra) if extra else ''),
                    marca=marca_, pie=pie, cabecera=cab)
                if ok:
                    partes.append(d)
        else:
            seg2 = tmp / ('tt_%02d_clip.mp4' % it['n'])
            if clip_a_video(it['clip'], seg2, TT_W, TT_H):
                partes.append(seg2)

        fin = tmp / ('tt_%02d_fin.mp4' % it['n'])
        if pant.get('cierre') and edicion.placa_animada(
                pant['cierre'], fin, TT_W, TT_H, SEG_CIERRE, color):
            partes.append(fin)
        elif edicion.cierre(fin, TT_W, TT_H, color):
            partes.append(fin)

        crudo = tmp / ('tt_%02d_full.mp4' % it['n'])
        out = unir(partes, crudo)
        if not out:
            continue
        final = destino / (it['slug'] + '.mp4')
        listo = None
        if musica and pistas:
            listo = edicion.con_musica(out, final, pistas[k % len(pistas)], semilla=k)
        if not listo:
            shutil.copy(out, final)
            listo = final
        hechos.append((listo, _dur(listo)))
    shutil.rmtree(tmp, ignore_errors=True)
    return hechos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='..')
    ap.add_argument('--carpeta', default='')
    ap.add_argument('--temporada', default='')
    ap.add_argument('--fecha', default='')
    ap.add_argument('--hasta', default='')
    ap.add_argument('--salida', default='salida')
    ap.add_argument('--sin-musica', action='store_true', dest='sin_musica',
                    help='no mezclar la musica de la carpeta musica')
    a = ap.parse_args()

    if not shutil.which('ffmpeg'):
        raise SystemExit('Hace falta ffmpeg para armar los videos de redes.')

    if not a.carpeta or not a.temporada:
        c, t = seis_placas.detectar(a.repo)
        if not c:
            raise SystemExit('No encuentro la carpeta de .dvw. Pasá --repo.')
        a.carpeta = a.carpeta or c
        a.temporada = a.temporada or t

    ruta = pathlib.Path(a.repo) / a.carpeta
    archivos, _, _ = fechas.archivos_de(ruta, a.fecha or None, a.hasta or None)
    if archivos is None:
        raise SystemExit('No existe la fecha %s.' % a.fecha)

    if a.fecha:
        rotulo = idioma.rotulo('fecha', a.fecha, a.temporada)
        base = pathlib.Path(a.salida) / a.temporada / ('fecha-%02d' % int(a.fecha))
    elif a.hasta:
        rotulo = idioma.rotulo('hasta', a.hasta, a.temporada)
        base = pathlib.Path(a.salida) / a.temporada / ('hasta-%02d' % int(a.hasta))
    else:
        rotulo = idioma.rotulo('temporada', a.temporada)
        base = pathlib.Path(a.salida) / a.temporada / 'acumulado'

    if not base.is_dir():
        raise SystemExit('Primero corré la fecha: no existe %s' % base)

    piezas = seis_placas.construir(a.repo, a.carpeta, a.temporada, rotulo, archivos,
                                   fecha_n=a.fecha or None)
    orden = {s: i for i, s in enumerate(
        ['apertura', 'resultados', 'saque', 'recepcion', 'armado', 'ataque',
         'bloqueo', 'defensa', 'equipo-ideal', 'rotaciones', 'cierre'])}
    piezas.sort(key=lambda p: orden.get(p.get('slug'), 99))
    items = piezas_de(base, piezas)
    if not items:
        raise SystemExit('No encuentro las placas en %s' % base)

    redes = base / 'redes'
    # lo de la corrida anterior se borra: si cambió el orden o el jugador
    # elegido, los videos viejos quedarían al lado de los nuevos
    n = limpiar.limpiar(base, 'redes')
    yt = redes / 'youtube'; tt = redes / 'tiktok'
    yt.mkdir(parents=True, exist_ok=True); tt.mkdir(parents=True, exist_ok=True)
    if n:
        print(limpiar.aviso(n, 'la corrida anterior'))

    con_clip = sum(1 for x in items if x['clip'])
    print('%d placas, %d con acciones de video' % (len(items), con_clip))
    rep = completar_marcador(base, a.repo, archivos)
    if rep:
        print('marcador: se lo agregué a %d acciones que ya estaban cortadas' % rep)
    # que se vea de entrada si los rotulos van a poder dibujarse
    if edicion.ruta_fuente(edicion.FUENTE):
        print('rotulos: con la tipografia de la carpeta fuentes')
    else:
        print('rotulos: NO pude usar la tipografia de fuentes;')
        print('         los videos salen igual, con la letra por defecto.')

    print()
    print('YouTube (16:9)')
    vid, caps, total = youtube(items, yt, rotulo, base, musica=not a.sin_musica)
    if vid:
        print('   %s  ·  %s' % (vid.name, _mmss(total)))
        L = ['%s · Liga Nacional A Suiza' % rotulo, '',
             'Resumen de la fecha con los datos de cada fundamento y las mejores',
             'acciones de cada uno. Todo sale del scout de los partidos, con',
             'Volley-Stats.', '', 'CAPÍTULOS', '']
        for t0, tit in caps:
            L.append('%s  %s' % (_mmss(t0), tit))
        L += ['', 'volley-stats.com', '',
              '#volleyball #voley #volleyballstats #scouting #datavolley']
        (yt / 'descripcion.txt').write_text('\n'.join(L), encoding='utf-8')
        print('   descripcion.txt (con los capítulos ya calculados)')
    else:
        print('   no se pudo armar')

    print()
    print('TikTok y Reels (9:16)')
    hechos = tiktok(items, tt, base, musica=not a.sin_musica,
                    rotulo=rotulo, liga_nom=LIGA_NOM)
    for f, d in hechos:
        print('   %-22s %s' % (f.name, _mmss(d)))
    if not hechos:
        print('   ninguno: hacen falta los recortes de video de cada placa')

    print()
    print('Todo en %s' % redes.resolve())
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\nCortado.')
        sys.exit(130)
