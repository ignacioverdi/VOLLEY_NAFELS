# -*- coding: utf-8 -*-
"""
===============================================================================
  UNIR_VIDEO.py — VARIAS PARTES, UN SOLO VIDEO
-------------------------------------------------------------------------------
  Doble clic. Arrastra las partes del partido y las une en un archivo.

  ── PARA QUE SIRVE ──────────────────────────────────────────────────────────
  Muchas camaras cortan la grabacion cada 20 o 30 minutos, o cada 4 GB. Un
  partido queda en cuatro o cinco archivos.

  Para que los cortes de video funcionen hace falta UN solo archivo: cada
  accion guarda el minuto en que ocurrio, y si el partido esta partido en
  cuatro, esos minutos apuntan al lugar equivocado.

  ── POR QUE UN PROGRAMA Y NO LA APP ─────────────────────────────────────────
  Se intento hacerlo en el navegador y no da: un partido son varios gigas y
  el navegador tiene un limite de memoria de unos 2 GB. No falla con un error,
  se queda intentando para siempre.

  Aca no hay limite: el video se procesa en el disco, como cualquier programa
  de edicion.

  ── LA PRIMERA VEZ ──────────────────────────────────────────────────────────
  Necesita ffmpeg, que es gratuito y lo usan casi todos los programas de video
  del mundo. Si no esta, el programa lo descarga solo: son unos 80 MB, una
  sola vez, y despues funciona para siempre.
===============================================================================
"""
import io
import os
import re
import sys
import glob
import json
import shutil
import zipfile
import subprocess
import time
import tempfile

try:
    from urllib.request import urlopen, Request
except ImportError:
    from urllib2 import urlopen, Request

AQUI = os.path.dirname(os.path.abspath(__file__))
CARPETA_FF = os.path.join(AQUI, '_ffmpeg')

EXTENSIONES = ('.mp4', '.mov', '.mkv', '.avi', '.m4v', '.mts', '.m2ts', '.wmv',
               '.mpg', '.mpeg', '.ts')

# La version portable para Windows: no hay que instalar nada, es un .exe suelto
URL_FFMPEG = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'


# ══════════════════════════════════════════════════════════════════════════
#   ffmpeg
# ══════════════════════════════════════════════════════════════════════════

def buscar_ffmpeg():
    """Donde esta ffmpeg, si esta."""
    # el que ya bajamos
    local = os.path.join(CARPETA_FF, 'ffmpeg.exe')
    if os.path.exists(local):
        return local
    # uno instalado en el sistema
    for cmd in ('ffmpeg', 'ffmpeg.exe'):
        try:
            subprocess.run([cmd, '-version'], capture_output=True, timeout=10)
            return cmd
        except Exception:
            continue
    return None


def bajar_ffmpeg():
    """Lo descarga la primera vez. Son unos 80 MB."""
    print()
    print('  ' + '=' * 66)
    print('     PRIMERA VEZ: descargando el motor de video')
    print('  ' + '=' * 66)
    print()
    print('     Son unos 80 MB. Se baja UNA sola vez y despues no hace falta')
    print('     mas: queda guardado al lado de este programa.')
    print()
    print('     Es ffmpeg, el motor que usan casi todos los programas de')
    print('     video. Gratuito y de codigo abierto.')
    print()

    try:
        r = input('  Lo bajo ahora? (s/n): ').strip().lower()
    except Exception:
        r = 'n'
    if r != 's':
        return None

    os.makedirs(CARPETA_FF, exist_ok=True)
    tmp = os.path.join(CARPETA_FF, '_bajando.zip')

    try:
        print()
        print('  Bajando...', end='', flush=True)
        pedido = Request(URL_FFMPEG, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(pedido, timeout=300) as resp:
            total = int(resp.headers.get('Content-Length') or 0)
            leido = 0
            with open(tmp, 'wb') as f:
                while True:
                    trozo = resp.read(1024 * 256)
                    if not trozo:
                        break
                    f.write(trozo)
                    leido += len(trozo)
                    if total:
                        print('\r  Bajando... %d%%' % (leido * 100 // total),
                              end='', flush=True)
        print('\r  Bajando... listo      ')

        print('  Abriendo el archivo...', end='', flush=True)
        with zipfile.ZipFile(tmp) as z:
            for nombre in z.namelist():
                base = os.path.basename(nombre)
                if base.lower() in ('ffmpeg.exe', 'ffprobe.exe'):
                    with z.open(nombre) as origen:
                        destino = os.path.join(CARPETA_FF, base)
                        with open(destino, 'wb') as f:
                            shutil.copyfileobj(origen, f)
        print('\r  Abriendo el archivo... listo')

        os.remove(tmp)
        exe = os.path.join(CARPETA_FF, 'ffmpeg.exe')
        if os.path.exists(exe):
            print()
            print('  Listo. No hace falta volver a bajarlo.')
            return exe
    except Exception as e:
        print()
        print('  No pude bajarlo: %s' % str(e)[:70])
        print()
        print('  Se puede bajar a mano:')
        print('     1. entra a  https://www.gyan.dev/ffmpeg/builds/')
        print('     2. baja  ffmpeg-release-essentials.zip')
        print('     3. abri el zip, entra a la carpeta  bin')
        print('     4. copia  ffmpeg.exe  y  ffprobe.exe  a la carpeta')
        print('        _ffmpeg  que esta al lado de este programa')
        try:
            os.remove(tmp)
        except Exception:
            pass
    return None


# ══════════════════════════════════════════════════════════════════════════
#   Los videos
# ══════════════════════════════════════════════════════════════════════════

def datos_de(cmd, ruta):
    """El formato de un video, para saber si se puede pegar sin recomprimir."""
    probe = cmd.replace('ffmpeg', 'ffprobe')
    try:
        r = subprocess.run(
            [probe, '-v', 'error',
             '-show_entries', 'stream=codec_name,width,height,r_frame_rate',
             '-show_entries', 'format=duration',
             '-of', 'json', ruta],
            capture_output=True, text=True, timeout=90)
        d = json.loads(r.stdout or '{}')
        v = None
        for s in (d.get('streams') or []):
            if s.get('width'):
                v = s
                break
        dur = float((d.get('format') or {}).get('duration') or 0)
        if not v:
            return None, dur
        return (v.get('codec_name'), v.get('width'), v.get('height'),
                v.get('r_frame_rate')), dur
    except Exception:
        return None, 0


def mmss(seg):
    seg = int(seg or 0)
    h, r = divmod(seg, 3600)
    m, s = divmod(r, 60)
    return ('%d:%02d:%02d' % (h, m, s)) if h else ('%d:%02d' % (m, s))


def pedir_archivos():
    print('  Arrastra las partes del partido, una por una, y Enter en cada una.')
    print('  Cuando termines, Enter solo.')
    print()
    print('  IMPORTANTE: arrastralas EN ORDEN, de la primera a la ultima.')
    print()
    lista = []
    while True:
        try:
            r = input('  %d) ' % (len(lista) + 1)).strip().strip('"').strip("'")
        except Exception:
            break
        if not r:
            break
        if not os.path.isfile(r):
            print('     no encuentro ese archivo')
            continue
        if not r.lower().endswith(EXTENSIONES):
            print('     eso no parece un video')
            continue
        lista.append(r)
    return lista


def main():
    print()
    print('  ' + '=' * 66)
    print('     UNIR LAS PARTES DE UN PARTIDO')
    print('  ' + '=' * 66)
    print()

    cmd = buscar_ffmpeg()
    if not cmd:
        cmd = bajar_ffmpeg()
        if not cmd:
            input('\n  Enter para cerrar...')
            return 1

    archivos = pedir_archivos()
    if len(archivos) < 2:
        print()
        print('  Hacen falta al menos dos archivos para unir.')
        input('\n  Enter para cerrar...')
        return 0

    # ── que son ─────────────────────────────────────────────────────────────
    print()
    print('  ' + '-' * 66)
    print('  LAS PARTES')
    print('  ' + '-' * 66)
    formatos, total, peso = [], 0, 0
    for f in archivos:
        fmt, dur = datos_de(cmd, f)
        formatos.append(fmt)
        total += dur
        tam = os.path.getsize(f) / 1048576
        peso += tam
        print('     %-40s %8s  %6.0f MB' % (os.path.basename(f)[:40], mmss(dur), tam))
        if fmt:
            print('        %s · %sx%s' % (fmt[0], fmt[1], fmt[2]))

    print()
    print('     En total: %s  ·  %.0f MB' % (mmss(total), peso))

    # Que dos partes no den EXACTAMENTE el mismo formato casi nunca importa:
    # en un .MTS ffprobe estima los cuadros por segundo del propio contenido y
    # puede darle 60 a un pedazo y 59,94 a otro. Eso no impide pegarlos.
    #
    # Lo que SI importa es el codec y el tamanio de imagen. Si esos cambian de
    # un pedazo a otro, no son partes de la misma grabacion, y pegarlas tal
    # cual da un archivo que parece bien (dura lo que tiene que durar) pero
    # esta roto adentro. Por eso se miran las dos cosas por separado.
    esenciales = [f[0:3] for f in formatos if f]
    mismo_video = bool(esenciales) and all(e == esenciales[0] for e in esenciales) \
                  and len(esenciales) == len(formatos)
    iguales = bool(formatos[0]) and all(f == formatos[0] for f in formatos)

    # Antes se decidia aca si pegar o recomprimir, y si los formatos no daban
    # identicos se recomprimia TODO el partido con libx264: veinte minutos o
    # varias horas. Eso no hace falta casi nunca.
    #
    # Ahora se PRUEBA pegar sin recomprimir igual, y recien si eso falla se va
    # bajando de escalon. Pegar sin recomprimir va a la velocidad del disco:
    # unos 350 MB por segundo, o sea un partido de 25 GB en poco mas de un
    # minuto. Recomprimir va a la velocidad del procesador, que es entre cien
    # y mil veces mas lento.
    print()
    if iguales:
        print('     Todas las partes son del mismo formato.')
    elif mismo_video:
        print('     Las partes no se declaran identicas, pero el codec y el')
        print('     tamanio de imagen coinciden: son la misma grabacion. Eso')
        print('     alcanza para pegarlas sin recomprimir.')
    else:
        print('     [ATENCION] Las partes NO son la misma grabacion: cambia el')
        print('     codec o el tamanio de imagen de una a otra.')
        for f in formatos:
            print('        %s' % ('desconocido' if not f else
                                  '%s  %sx%s' % (f[0], f[1], f[2])))
        print()
        print('     Pegarlas tal cual daria un archivo roto, asi que en este')
        print('     caso hay que recomprimir, que es el camino lento.')
    if mismo_video:
        print('     Voy a pegarlas SIN recomprimir: a velocidad de disco, no de')
        print('     procesador. No se pierde ni un poco de calidad.')

    base = os.path.splitext(archivos[0])[0]
    carpeta_de = os.path.dirname(os.path.abspath(archivos[0]))
    base = re.sub(r'[_\- ]*\(?\d+\)?$', '', base)
    # Las camaras numeran los archivos 00000.MTS, 00001.MTS... Sacarle los
    # numeros a "00000" no deja nada, y el resultado quedaba llamandose
    # "_completo.mp4" a secas. En ese caso se usa el nombre de la carpeta,
    # que es donde el que filma pone de que partido se trata.
    if not os.path.basename(base).strip(' _-'):
        base = os.path.join(carpeta_de, os.path.basename(carpeta_de) or 'PARTIDO')
    ext = os.path.splitext(archivos[0])[1].lower()
    # Si las partes vienen de la camara (.MTS de AVCHD), dejar la salida en el
    # mismo envase evita cualquier conversion de contenedor. Si son otra cosa,
    # mp4, que es lo que veniamos usando.
    de_camara = ext in ('.mts', '.m2ts', '.ts')
    # La salida sigue siendo .mp4 como siempre: es lo que ya venia usando el
    # sistema y lo que abren DataVolley y los sitios de video. El envase no
    # cuesta nada de tiempo; lo caro es recomprimir, y eso no se hace.
    salida = base + '_completo.mp4'
    print()
    print('     Va a quedar como:')
    print('        %s' % os.path.basename(salida))

    print()
    try:
        r = input('  Uno las partes? (s/n): ').strip().lower()
    except Exception:
        r = 'n'
    if r != 's':
        print('  No toque nada.')
        input('\n  Enter para cerrar...')
        return 0

    # \u2500\u2500 unir \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    print()
    print('  Uniendo... (no cierres esta ventana)')
    print()

    carpeta_salida = os.path.dirname(salida) or '.'
    lista_txt = os.path.join(carpeta_salida, '_partes.txt')

    def correr(orden, etiqueta):
        """Corre ffmpeg mostrando el avance. Devuelve True si salio bien."""
        t0 = time.time()
        p = subprocess.Popen(orden, stdout=subprocess.PIPE,
                             stderr=subprocess.STDOUT, universal_newlines=True,
                             encoding='utf-8', errors='replace')
        ultimo = ''
        for linea in p.stdout:
            m = re.search(r'time=(\d+):(\d+):(\d+)', linea or '')
            if m:
                seg = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
                pct = min(100, int(seg * 100 / total)) if total else 0
                pasado = time.time() - t0
                # cuantas veces mas rapido que el tiempo real va: con copia da
                # cientos, recomprimiendo da menos de diez. Sirve para ver de
                # un vistazo por que camino esta yendo.
                x = (seg / pasado) if pasado > 0.5 else 0
                print('\r  %s %d%%  (%s de %s)   %.0fx ' %
                      (etiqueta, pct, mmss(seg), mmss(total), x),
                      end='', flush=True)
            if linea and linea.strip():
                ultimo = linea.strip()
        p.wait()
        print()
        if p.returncode != 0:
            return False, ultimo
        if not os.path.exists(salida) or os.path.getsize(salida) < 100000:
            return False, 'el archivo salio vacio'
        return True, ''

    def bien():
        """El resultado dura lo que suman las partes y es el mismo video?

        Las dos cosas, no una. Un archivo mal pegado puede durar exactamente
        lo que tiene que durar y estar roto adentro.
        """
        f, d = datos_de(cmd, salida)
        if formatos[0] and (not f or f[0:3] != formatos[0][0:3]):
            return False
        if not total:
            return d > 0
        return d > 0 and abs(d - total) <= max(5.0, total * 0.01)

    base_ff = [cmd, '-hide_banner', '-f', 'concat', '-safe', '0', '-i', lista_txt]
    # +faststart obliga a reescribir el archivo entero una segunda vez para
    # mover el indice al principio. En un archivo de 25 GB eso es leer y
    # escribir 25 GB de mas, al pedo: sirve para ver el video por internet
    # mientras se descarga, no para abrirlo del disco.
    grande = peso > 4000   # MB
    fast = [] if (grande or de_camara) else ['-movflags', '+faststart']

    intentos = [
        (base_ff + ['-c', 'copy'] + fast + [salida, '-y'],
         'Pegando (sin recomprimir)...'),
        # Si el envase de salida no se lleva con el audio del original, se
        # rehace SOLO el audio. El video, que es el 99% del archivo, sigue
        # copiandose tal cual: sigue tardando segundos.
        (base_ff + ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k'] + fast + [salida, '-y'],
         'Pegando (rehaciendo solo el audio)...'),
        (base_ff + ['-c:v', 'copy', '-an'] + fast + [salida, '-y'],
         'Pegando (sin audio)...'),
    ]

    ok, ultimo = False, ''
    if not mismo_video:
        intentos = []          # no tiene sentido probar la copia
    try:
        with io.open(lista_txt, 'w', encoding='utf-8') as f:
            for a in archivos:
                ruta = os.path.abspath(a).replace('\\', '/').replace("'", "'\\''")
                f.write("file '%s'\n" % ruta)

        for orden, etiqueta in intentos:
            ok, ultimo = correr(orden, etiqueta)
            if ok and bien():
                break
            ok = False

        if not ok:
            # Ultimo recurso. Esto SI tarda, y por eso se avisa y se pregunta:
            # nadie deberia arrancar una hora de recompresion sin saberlo.
            print()
            print('  ' + '-' * 66)
            print('  No se pudieron pegar tal cual. Queda recomprimir, que es')
            print('  el camino lento: para un partido de dos horas en 1080p')
            print('  puede llevar de una a varias horas, y ademas pierde algo')
            print('  de calidad.')
            if ultimo:
                print('     (el motivo: %s)' % ultimo[:60])
            print('  ' + '-' * 66)
            print()
            try:
                r = input('  Recomprimir igual? (s/n): ').strip().lower()
            except Exception:
                r = 'n'
            if r != 's':
                print()
                print('  No toque nada. Las partes estan intactas.')
                input('\n  Enter para cerrar...')
                return 0
            ok, ultimo = correr(
                base_ff + ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
                           '-c:a', 'aac'] + fast + [salida, '-y'],
                'Recomprimiendo...')

        if not ok:
            print()
            print('  No pude unirlas.')
            if ultimo:
                print('     %s' % ultimo[:70])
            input('\n  Enter para cerrar...')
            return 1
    finally:
        try:
            os.remove(lista_txt)
        except Exception:
            pass


    _fmt, dur = datos_de(cmd, salida)
    tam = os.path.getsize(salida) / 1048576

    print()
    print('  ' + '=' * 66)
    print('     LISTO')
    print('  ' + '=' * 66)
    print('     %s' % os.path.basename(salida))
    print('     %s  ·  %.0f MB' % (mmss(dur), tam))
    print()
    if total and abs(dur - total) > 5:
        print('     [ATENCION] El video unido dura %s y las partes sumaban %s.'
              % (mmss(dur), mmss(total)))
        print('     Revisalo antes de subirlo.')
        print()
    print('     Las partes originales quedaron intactas.')
    print()
    print('     Ahora subilo a donde quieras —YouTube, VolleyMetrics, lo que')
    print('     uses— y pega el link en Cargar Videos.')
    print()
    input('  Enter para cerrar...')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\n\n  Cancelado.')
        sys.exit(1)
    except SystemExit:
        raise
    except Exception as e:
        import traceback
        print()
        print('  ALGO FALLO: %s' % e)
        traceback.print_exc()
        try:
            input('  Enter para cerrar...')
        except Exception:
            pass
        sys.exit(1)
