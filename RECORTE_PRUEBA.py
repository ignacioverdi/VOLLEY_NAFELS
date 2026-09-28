# -*- coding: utf-8 -*-
"""Saca un pedacito de un video, sin recomprimir, para mirarlo de cerca.

No sirve para medir nada por si solo: sirve para mandar una muestra liviana
sin que el envio la ensucie. Por eso corta con copia directa de los bytes:
lo que se ve en la muestra es EXACTAMENTE lo que grabo la camara.

Se usa: doble clic, arrastrar el video, decir en que minuto.
"""
import io
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

try:
    from CORTAR_SAQUES import buscar_ffmpeg, bajar_ffmpeg, datos_del_video
except Exception:
    print('  No encuentro CORTAR_SAQUES.py, que tiene que estar en esta misma')
    print('  carpeta (de ahi saca ffmpeg).')
    input('\n  Enter para cerrar. ')
    sys.exit(1)

DURACION = 30.0     # segundos de muestra


def pedir(t):
    return input(t).strip().strip('"').strip("'")


def a_segundos(txt):
    """Un momento: 4:35, 1:04:35 o 275. Devuelve None si no se entiende.

    La coma NO se toca aca: separa momentos, no partes de un momento. Antes
    se cambiaba por dos puntos y \"47:48,48:48\" se volvia la hora 172128.
    """
    p = [x for x in txt.replace('.', ':').strip().split(':') if x.strip()]
    try:
        p = [int(x) for x in p]
    except ValueError:
        return None
    if not p or len(p) > 3 or any(x < 0 for x in p):
        return None
    s = 0
    for x in p:
        s = s * 60 + x
    return s


def momentos(txt, dur):
    """Varios momentos de una linea: \"47:48, 48:48\" o \"4:35 9:10\".

    Devuelve (buenos, malos). Un momento mas alla del final del video es malo:
    cortar ahi deja un archivo de un mega que no sirve para nada, y es mejor
    decirlo en el momento que descubrirlo cuando ya se mando.
    """
    buenos, malos = [], []
    for trozo in re.split(r'[,;]+|\s+', txt or ''):
        if not trozo.strip():
            continue
        s = a_segundos(trozo)
        if s is None:
            malos.append((trozo, 'no lo entiendo'))
        elif dur and s > dur - 2:
            malos.append((trozo, 'el video dura %s' % mmss(dur)))
        else:
            buenos.append(s)
    return buenos, malos


def mmss(seg):
    seg = int(seg or 0)
    h, r = divmod(seg, 3600)
    m, s = divmod(r, 60)
    return ('%d:%02d:%02d' % (h, m, s)) if h else ('%d:%02d' % (m, s))


def main():
    print()
    print('  ' + '=' * 66)
    print('     SACAR UNA MUESTRA DEL VIDEO (sin recomprimir)')
    print('  ' + '=' * 66)

    args = [a for a in sys.argv[1:] if os.path.exists(a)]
    video = args[0] if args else pedir('\n     Arrastra el video y apreta Enter: ')
    if not video or not os.path.exists(video):
        print('     No encuentro ese archivo.')
        input('\n     Enter para cerrar. ')
        return

    ff = buscar_ffmpeg() or bajar_ffmpeg()
    if not ff:
        input('\n     Enter para cerrar. ')
        return

    d = datos_del_video(ff, video)
    if d:
        print()
        print('     %sx%s  ·  %.0f cuadros por segundo  ·  %.1f Mbps'
              % (d['w'], d['h'], d['fps'], d['mbps']))
        if d.get('entrelazado'):
            print('     entrelazado (%s)' % d['orden'])
        else:
            print('     progresivo (no entrelazado)')
        if d.get('dur'):
            m, s = divmod(int(d['dur']), 60)
            h, m = divmod(m, 60)
            print('     dura %d:%02d:%02d' % (h, m, s))

    dur = (d or {}).get('dur') or 0
    base = os.path.splitext(video)[0]
    hechos = []

    # Se pregunta DESDE y HASTA por separado a proposito. Antes se pedia todo
    # en un renglon y la coma era ambigua: "47:48, 48:48" tanto puede querer
    # decir "de 47:48 a 48:48" como "dos muestras, una en cada momento".
    # Preguntando dos veces no hay nada que adivinar.
    print()
    print('     Que pedazo del video queres. Se escribe 47:48, o 1:04:35,')
    print('     o los segundos sueltos.')
    while True:
        print()
        txt = pedir('     DESDE (Enter para terminar): ')
        if not txt:
            break
        desde = a_segundos(txt)
        if desde is None:
            print('     No entendi \"%s\". Proba con 47:48' % txt)
            continue
        if dur and desde > dur - 2:
            print('     Ese momento no existe: el video dura %s.' % mmss(dur))
            continue

        txt = pedir('     HASTA (Enter = %.0f segundos): ' % DURACION)
        if not txt:
            hasta = desde + DURACION
        else:
            hasta = a_segundos(txt)
            if hasta is None:
                print('     No entendi \"%s\". Lo dejo en %.0f segundos.' % (txt, DURACION))
                hasta = desde + DURACION
            elif hasta <= desde:
                print('     El final tiene que ser despues del principio.')
                continue
        if dur:
            hasta = min(hasta, dur)

        # Se toman dos segundos de aire antes, porque el momento que uno anota
        # mirando el video suele ser el golpe, y la jugada empieza antes.
        ini = max(0.0, desde - 2.0)
        salida = '%s_muestra_%02dm%02ds.mp4' % (base, int(desde) // 60, int(desde) % 60)
        print('     Cortando de %s a %s...' % (mmss(desde), mmss(hasta)), end=' ', flush=True)
        r = subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-y',
                            '-ss', '%.3f' % ini, '-to', '%.3f' % hasta, '-i', video,
                            '-c', 'copy', salida], capture_output=True)
        if r.returncode != 0 or not os.path.exists(salida):
            print('no se pudo')
            continue
        mb = os.path.getsize(salida) / 1e6
        # Un recorte de verdad pesa decenas de MB. Si pesa uno, cayo fuera del
        # video: mejor decirlo aca que descubrirlo cuando ya se mando.
        if mb < 5:
            print('salio vacio (ese pedazo no existe en el video)')
            try:
                os.remove(salida)
            except OSError:
                pass
            continue
        print('%.0f MB' % mb)
        hechos.append((salida, mb))

    print()
    print('  ' + '=' * 66)
    if not hechos:
        print('     No salio ninguno.')
    else:
        print('     LISTO. %d recorte(s), al lado del video:' % len(hechos))
        for s, mb in hechos:
            print('        %-46s %4.0f MB' % (os.path.basename(s)[:46], mb))
        if sum(mb for _s, mb in hechos) > 380:
            print()
            print('     [OJO] Entre todos pasan los 380 MB: mandalos de a uno.')
    print('  ' + '=' * 66)
    input('\n     Enter para cerrar. ')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print('\n     Se rompio: %s' % e)
        input('\n     Enter para cerrar. ')
