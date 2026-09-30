# -*- coding: utf-8 -*-
"""
MEDIR_SAQUES.py — la velocidad de cada saque, del video del partido

QUE HACE
--------
Lee el .dvw, y para cada saque le pide al video solo los cuatro segundos que
importan. Encuentra la pelota cuadro a cuadro, ajusta el vuelo en metros de
cancha y saca los km/h al cruzar la linea de fondo.

NO HACE FALTA CORTAR NADA. El corte existia solo para poder mandar el video a
medir a otro lado; midiendo aca no hay clips, no hay archivos intermedios y no
se sube nada.

QUE NECESITA
------------
  · el .dvw del partido o entrenamiento
  · el video entero (el que sale de UNIR_VIDEO)
  · una calibracion de camara para esa posicion (radar/calibraciones.json)

CUANTO TARDA
------------
Unos ocho segundos por saque. 240 saques son unos 35-45 minutos, y puede quedar
corriendo solo.

DONDE DEJA EL RESULTADO
-----------------------
velocidades_<PARTIDO>.json, al lado del .dvw. Se va guardando saque por saque,
asi que se puede cortar y seguir despues: lo ya medido no se vuelve a medir.
"""
import io, json, os, re, sys, time

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

VENTANA_ANTES = 0.2      # segundos antes del segundo anotado
VENTANA_LARGO = 4.2      # cuanto se mira (el golpe cae ~1 s despues del anotado)
# Cuando, contando desde el principio de la ventana, se espera que arranque el
# vuelo. El scout marca la S en el lanzamiento y el golpe viene alrededor de un
# segundo y medio despues. Un vuelo que arranca lejos de ahi no es este saque.
GOLPE_ESPERADO = 1.8


def falta(paquete, pip):
    print()
    print('     Falta %s.' % paquete)
    print('     Instalalo una sola vez con:   pip install %s' % pip)
    print()
    input('     Enter para cerrar. ')
    sys.exit(1)


try:
    import numpy as np
except ImportError:
    falta('numpy', 'numpy')
try:
    import cv2
except ImportError:
    falta('OpenCV', 'opencv-python')
try:
    import scipy
except ImportError:
    falta('SciPy', 'scipy')
try:
    import onnxruntime
except ImportError:
    falta('onnxruntime', 'onnxruntime')

from radar import tuberia, camara, cadena
from radar.pelota import Buscador

try:
    from CORTAR_SAQUES import leer_dvw, buscar_ffmpeg, bajar_ffmpeg, pedir, mmss
except ImportError:
    print('     No encuentro CORTAR_SAQUES.py al lado. Tienen que estar los dos')
    print('     en la misma carpeta.')
    input('\n     Enter para cerrar. ')
    sys.exit(1)

MODELO = os.path.join(AQUI, 'radar', 'modelo',
                      'VballNetV4c_seq9_grayscale_20260908_213829.onnx')


def elegir_calibracion(carpeta_dvw):
    todo = camara.cargar(os.path.join(AQUI, 'radar'))
    nombres = sorted(todo)
    # se adivina por el nombre de la carpeta, y se pide confirmacion
    pista = 'ENTRENAMIENTO' if 'ENTRENAMIENTO' in carpeta_dvw.upper() else None
    if pista not in todo:
        pista = nombres[0]
    print()
    print('     Calibraciones de camara guardadas:')
    for i, n in enumerate(nombres, 1):
        c = todo[n]
        print('       %d) %-16s %s' % (i, n, c.get('nombre', '')))
    r = pedir('     Cual uso? (Enter = %s): ' % pista)
    if r:
        if r.isdigit() and 1 <= int(r) <= len(nombres):
            pista = nombres[int(r) - 1]
        elif r.upper() in todo:
            pista = r.upper()
    c = todo[pista]
    print('     Uso %s — camara a %.2f m de alto, %.1f m detras de la linea de fondo.'
          % (pista, c['altura_camara_m'], c['distancia_a_la_linea_central_m'] - 9))
    print('     %s' % c.get('vale_mientras', ''))
    cal = camara.armar(c)
    cal['calibracion'] = pista
    return cal


def _leer_cache(carpeta_cache, k):
    """Las detecciones guardadas de este saque, si estan.

    Encontrar la pelota es el 95% del trabajo: son diez segundos de video que
    hay que decodificar y pasar por el modelo. Las reglas que deciden CUAL de
    las pelotas es el saque, en cambio, se calculan en un segundo. Guardando
    las detecciones, cambiar una regla y volver a medir los 240 pasa de tres
    cuartos de hora a dos minutos.
    """
    if not carpeta_cache:
        return None
    ruta = os.path.join(carpeta_cache, 'c%03d.json' % k)
    if not os.path.exists(ruta):
        return None
    try:
        with io.open(ruta, encoding='utf-8') as f:
            d = json.load(f)
        return ({int(a): [tuple(p) for p in b] for a, b in d['cand'].items()},
                float(d['fps']))
    except Exception:
        return None


def _guardar_cache(carpeta_cache, k, cand, fps):
    if not carpeta_cache:
        return
    try:
        with io.open(os.path.join(carpeta_cache, 'c%03d.json' % k), 'w',
                     encoding='utf-8') as f:
            f.write(json.dumps({'saque': k, 'fps': fps,
                                'cand': {str(a): [[round(z, 3) for z in p] for p in b]
                                         for a, b in cand.items()}},
                               separators=(',', ':')))
    except Exception:
        pass


def medir(dvw, video=None):
    print()
    print('  ' + '=' * 68)
    print('     MEDIR SAQUES — velocidad de cada saque, del video del partido')
    print('  ' + '=' * 68)

    v_dvw, saques, equipos = leer_dvw(dvw)
    if not saques:
        print('     Ese .dvw no tiene saques con tiempo de video.')
        input('\n     Enter para cerrar. ')
        return
    video = video or v_dvw
    print()
    print('     %s  vs  %s' % (equipos['*'], equipos['a']))
    print('     %d saques en %d sets' % (len(saques), len(set(s['set'] for s in saques))))

    if not video or not os.path.exists(video):
        print()
        if video:
            print('     El .dvw dice que el video esta en:')
            print('       %s' % video)
            print('     y ahi no esta.')
        video = pedir('     Arrastra el video entero y apreta Enter: ')
    if not video or not os.path.exists(video):
        print('     Sin el video no puedo medir.')
        input('\n     Enter para cerrar. ')
        return

    ff = buscar_ffmpeg() or bajar_ffmpeg()
    if not ff:
        input('\n     Enter para cerrar. ')
        return
    ffp = ff.replace('ffmpeg.exe', 'ffprobe.exe').replace('ffmpeg', 'ffprobe')
    if not os.path.exists(ffp):
        ffp = 'ffprobe'

    d = tuberia.datos(ff, ffp, video)
    if not d:
        print('     No pude leer el video.')
        input('\n     Enter para cerrar. ')
        return
    print()
    print('     Video: %dx%d, %.2f cuadros por segundo reales%s'
          % (d['w'], d['h'], d['real'],
             ', ENTRELAZADO' if d['entrelazado'] else ''))
    if d['entrelazado']:
        print('     Separo los dos campos de cada cuadro: mido a %.2f muestras'
              % d['fps_medicion'])
        print('     por segundo, el doble de resolucion temporal.')
    if d['w'] < 1900:
        print()
        print('     OJO: el original no es 1920 de ancho. La calibracion se hizo')
        print('     con 1920x1080; con otro tamanio los numeros no valen.')

    carpeta = os.path.dirname(os.path.abspath(dvw))
    base = os.path.splitext(os.path.basename(dvw))[0]
    base = re.sub(r'^[&\s]+', '', base)
    base = re.sub(r'[^A-Za-z0-9]+', '_', base).strip('_').upper()[:40] or 'PARTIDO'

    # ── el desfase entre el reloj del scout y el del video ──
    prim = min(s['seg'] for s in saques)
    print()
    print('     El primer saque, segun el scout, esta en el segundo %d (%s).'
          % (prim, mmss(prim)))
    r = pedir('     En que momento del video cae? (Enter = ahi mismo  ·  ej: 2:17 ): ')
    desfase = 0.0
    if r:
        m = re.match(r'^\s*(?:(\d+)\s*:\s*)?(\d+)(?:\s*[.,]\s*(\d+))?\s*$', r)
        if m:
            mm_ = int(m.group(1) or 0); ss = int(m.group(2))
            seg = mm_ * 60 + ss + (float('0.' + m.group(3)) if m.group(3) else 0)
            desfase = seg - prim
            for s in saques:
                s['seg'] = s['seg'] + desfase
            print('     Corrijo %+.0f segundos en los %d saques.' % (desfase, len(saques)))

    # ── se pueden medir solo algunos ──
    print()
    print('     Son %d saques. Podes medirlos todos o solo un rango.' % len(saques))
    r = pedir('     Cuales? (Enter = todos  ·  o por ejemplo  1-20 ): ')
    pedidos = list(range(1, len(saques) + 1))
    if r:
        m = re.match(r'^\s*(\d+)\s*[-a]\s*(\d+)\s*$', r)
        if m:
            a, b = int(m.group(1)), int(m.group(2))
            pedidos = [k for k in pedidos if a <= k <= b]
        else:
            try:
                pedidos = pedidos[:int(r.strip())]
            except ValueError:
                pass
        print('     Mido %d saques.' % len(pedidos))

    cal = elegir_calibracion(carpeta)

    salida = os.path.join(carpeta, 'velocidades_%s.json' % base)
    hechos = {}
    if os.path.exists(salida):
        try:
            with io.open(salida, encoding='utf-8') as f:
                viejo = json.load(f)
            hechos = {int(k): v for k, v in viejo.get('saques', {}).items()}
            if hechos:
                print()
                print('     Ya habia %d saques medidos de antes: esos los salteo.'
                      % len(hechos))
        except Exception:
            hechos = {}

    # Las detecciones se guardan: encontrar la pelota es lo caro de todo esto,
    # y guardandolas se puede volver a calcular con otras reglas en segundos en
    # vez de volver a mirar el video una hora.
    carpeta_cache = os.path.join(carpeta, '_radar_cache_%s' % base)
    try:
        os.makedirs(carpeta_cache, exist_ok=True)
    except Exception:
        carpeta_cache = None

    # Si ya estan guardadas las detecciones de este partido, no hace falta
    # volver a mirar el video: se recalcula con lo que hay y tarda minutos.
    hay = len([1 for k in pedidos if _leer_cache(carpeta_cache, k)])
    usar_cache = False
    if hay:
        print()
        print('     Tengo guardadas las detecciones de %d de los %d saques.'
              % (hay, len(pedidos)))
        r = pedir('     Las uso? (Enter = si  ·  n = volver a mirar el video): ')
        usar_cache = r.strip().lower() not in ('n', 'no')
        if usar_cache:
            print('     Uso las guardadas: esto va a tardar minutos, no una hora.')
            hechos = {}          # se recalcula todo con las reglas de ahora

    print()
    B = None
    if not usar_cache or hay < len(pedidos):
        print('     Cargando el modelo...')
        B = Buscador(MODELO)
    print('     Listo. Empiezo. (Se puede cortar cuando quieras: lo medido queda.)')
    print()

    t_ini = time.time()
    medidos = 0
    del_cache = 0
    for pos, k in enumerate(pedidos, 1):
        # Un saque ya medido se saltea, pero solo si ademas quedaron guardadas
        # sus detecciones. Si no, hay que volver a mirarlo: sin las detecciones
        # no se puede recalcular despues sin pasar otra vez por todo el video.
        if k in hechos and (not carpeta_cache or
                            os.path.exists(os.path.join(carpeta_cache, 'c%03d.json' % k))):
            continue
        s = saques[k - 1]
        guardado = _leer_cache(carpeta_cache, k) if usar_cache else None
        if guardado:
            cand, fps = guardado
            del_cache += 1
        else:
            try:
                cuadros, fps = tuberia.leer(ff, video, s['seg'] - VENTANA_ANTES,
                                            VENTANA_LARGO, d)
            except Exception as e:
                print('     saque %3d: no pude leer el video (%s)' % (k, e))
                continue
            if len(cuadros) < 40:
                print('     saque %3d: el video se corta ahi' % k)
                continue
            if B is None:
                print('     Cargando el modelo...')
                B = Buscador(MODELO)
            cand = B.candidatos(cuadros)
            _guardar_cache(carpeta_cache, k, cand, fps)
        otros = []
        aj = cadena.buscar(cal, cand, fps, golpe_esperado=GOLPE_ESPERADO,
                           todos=otros)
        fila = dict(saque=k, set=s['set'], equipo=s['equipo'], num=s['num'],
                    ape=s['ape'], nombre=s['nombre'], tipo=s['tipo'],
                    val=s['val'], seg=round(s['seg'], 2))
        if aj is None:
            fila.update(kmh=None, motivo='no se encontro un vuelo de saque')
            print('     saque %3d  %-12s %s   --' % (k, s['ape'][:12], s['val']))
        else:
            fila.update(kmh=round(aj['golpe']['kmh'], 1),
                        alto_del_golpe=round(aj['golpe']['z'], 2),
                        altura_en_la_red=round(aj['red']['z'], 2),
                        kmh_en_la_red=round(aj['red']['kmh'], 1),
                        residuo_px=round(aj['res_uv'], 2),
                        cuadros=len(aj['cuadros']),
                        arranque_en_la_ventana=aj.get('arranque_s'),
                        otros_vuelos=sorted(otros, key=lambda x: x['puntaje'])[:4])
            medidos += 1
            print('     saque %3d  %-12s %s   %5.1f km/h   (residuo %.1f px)'
                  % (k, s['ape'][:12], s['val'], fila['kmh'], fila['residuo_px']))
        hechos[k] = fila

        doc = dict(partido=base, video=os.path.basename(video),
                   calibracion=cal['calibracion'],
                   desfase_aplicado=round(desfase, 2),
                   fps_medicion=fps,
                   entrelazado_de_origen=d['entrelazado'],
                   correccion_de_estela=True,
                   medidos=sum(1 for x in hechos.values() if x.get('kmh')),
                   pedidos=len(pedidos),
                   saques={str(a): b for a, b in sorted(hechos.items())})
        with io.open(salida, 'w', encoding='utf-8') as f:
            f.write(json.dumps(doc, ensure_ascii=False, indent=1))

        if pos % 10 == 0:
            paso = (time.time() - t_ini) / max(pos, 1)
            faltan = (len(pedidos) - pos) * paso
            print('     ... %d de %d, faltan unos %d min'
                  % (pos, len(pedidos), int(faltan / 60) + 1))

    print()
    print('  ' + '=' * 68)
    ok = [x for x in hechos.values() if x.get('kmh')]
    print('     LISTO. %d saques con velocidad, de %d.' % (len(ok), len(hechos)))
    if ok:
        v = sorted(x['kmh'] for x in ok)
        print('     Mas rapido %.1f   ·   promedio %.1f   ·   mas lento %.1f km/h'
              % (v[-1], sum(v) / len(v), v[0]))
        porj = {}
        for x in ok:
            porj.setdefault('%s #%s' % (x['ape'], x['num']), []).append(x['kmh'])
        print()
        print('     Por jugador:')
        for n in sorted(porj, key=lambda a: -sum(porj[a]) / len(porj[a])):
            z = porj[n]
            print('       %-22s %5.1f km/h de promedio  (max %.1f, %d saques)'
                  % (n, sum(z) / len(z), max(z), len(z)))
    print()
    if del_cache:
        print('     (%d saques recalculados con las detecciones guardadas)' % del_cache)
    print('     Queda en:  %s' % os.path.basename(salida))
    print('  ' + '=' * 68)


def main():
    args = [a for a in sys.argv[1:] if os.path.isfile(a)]
    dvw = next((a for a in args if a.lower().endswith('.dvw')
                or '.' not in os.path.basename(a)), None)
    vid = next((a for a in args if a is not dvw and
                os.path.splitext(a)[1].lower() in
                ('.mp4', '.mts', '.m2ts', '.mov', '.mkv', '.avi')), None)
    if not dvw:
        dvw = pedir('\n     Arrastra el .dvw y apreta Enter: ')
    if not dvw or not os.path.exists(dvw):
        print('     No encuentro ese archivo.')
        input('\n     Enter para cerrar. ')
        return
    medir(dvw, vid)
    input('\n     Enter para cerrar. ')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n     Cortado. Lo medido quedo guardado.')
        input('\n     Enter para cerrar. ')
