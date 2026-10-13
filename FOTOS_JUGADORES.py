#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  FOTOS_JUGADORES.py — las caras del plantel, sin cargar ninguna a mano
-------------------------------------------------------------------------------
  Lee las fotos de estudio que ya estan en la carpeta del club, las recorta a
  cabeza y hombros, las achica, y escribe datos_fotos.js con todas adentro.

  Uso:  FOTOS_JUGADORES.bat     (o)     python FOTOS_JUGADORES.py

  ── DE DONDE SACA EL DORSAL ─────────────────────────────────────────────────

  Del principio del nombre del archivo. Asi vienen las fotos oficiales:

      01_Valentin_Durdos_CEV_Z9N_9672.jpg   ->  dorsal 01
      20_Jonas_Schmid_CEV_Z9N_9696.jpg      ->  dorsal 20
      Ignacio_Verdi_HC_CEV_Z9N_9620.jpg     ->  sin dorsal: se saltea

  No hay que renombrar nada ni cargar nada en ninguna pantalla. Si manana
  entra un jugador nuevo, se tira su foto en la carpeta con el dorsal
  adelante y a la proxima corrida ya esta.

  ── EL RECORTE ──────────────────────────────────────────────────────────────

  Las fotos oficiales son todas iguales: estudio, fondo gris, el jugador
  centrado y la cara arriba. Por eso el recorte puede ser automatico y sale
  parejo en las quince: se toma el 48% de arriba, centrado, en proporcion 3:4.

  Si algun ano las fotos vienen con otro encuadre, se tocan las tres medidas
  de abajo (ARRIBA, ALTO, PROPORCION) y listo. No hace falta tocar nada mas.

  ── POR QUE VAN ADENTRO DE UN ARCHIVO DE DATOS Y NO SUELTAS ─────────────────

  Porque el repositorio es publico. Una carpeta con las caras del plantel
  colgada en internet no se pone, ni aunque nadie la linkee: se baja igual.

  datos_fotos.js lo cifra cifrar_datos.py solo —ya agarra todo lo que empieza
  con datos_ y termina en .js, no hubo que tocarle una linea— asi que viaja
  ilegible como el resto y solo lo abre quien inicio sesion en el club.

  ── QUE NECESITA ────────────────────────────────────────────────────────────

  Pillow, que es la libreria de imagenes de Python. Si no esta, el programa
  lo dice y no hace nada:   pip install Pillow
===============================================================================
"""
import os
import re
import sys
import glob
import json
import base64
import argparse

AQUI = os.path.dirname(os.path.abspath(__file__))

# El recorte, en fracciones de la foto original. Ver el comentario de arriba.
ARRIBA = 0.032      # donde empieza, contado desde el borde de arriba
ALTO = 0.478        # cuanto se queda, hacia abajo
PROPORCION = 0.75   # ancho / alto del resultado (3:4)
ANCHO_SALIDA = 180  # pixeles. El cuadro de la ficha mide 62, el doble para pantallas retina
CALIDAD = 72        # calidad del JPEG. 72 es donde deja de notarse y el archivo pesa la mitad

CARPETAS = ['NAFELS PLAYERS 26-27', 'NAFELS PLAYERS', 'FOTOS JUGADORES', 'jugadores']
EXT = ('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')


def buscar_carpeta(dada):
    if dada:
        return dada if os.path.isdir(dada) else None
    for c in CARPETAS:
        r = os.path.join(AQUI, c)
        if os.path.isdir(r):
            return r
    # cualquier carpeta que diga PLAYERS o JUGADORES y tenga imagenes adentro
    for n in sorted(os.listdir(AQUI)):
        r = os.path.join(AQUI, n)
        if not os.path.isdir(r):
            continue
        if 'PLAYER' not in n.upper() and 'JUGADOR' not in n.upper():
            continue
        if any(a.endswith(EXT) for a in os.listdir(r)):
            return r
    return None


def dorsal_de(nombre):
    """El dorsal sale de los digitos del principio del nombre del archivo."""
    # Ojo con \b: el guion bajo es caracter de palabra, asi que en
    # "01_Valentin.jpg" NO hay borde entre el 1 y el _. Probado: con \b no
    # entraba ni una foto. Lo que hace falta es "digitos que no siguen con
    # otro digito".
    m = re.match(r'^(\d{1,2})(?!\d)', os.path.basename(nombre))
    return ('0' + m.group(1))[-2:] if m else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--carpeta', default=None, help='donde estan las fotos')
    ap.add_argument('--out', default='datos_fotos.js')
    ap.add_argument('--desde-bat', action='store_true', help='lo pone el .bat: no espera un enter al final')
    a = ap.parse_args()

    print('')
    print('=' * 68)
    print('  LAS FOTOS DEL PLANTEL')
    print('=' * 68)
    print('')

    try:
        from PIL import Image
    except ImportError:
        print('  [FALTA UNA LIBRERIA]  Esto necesita Pillow para abrir las fotos.')
        print('')
        print('      pip install Pillow')
        print('')
        print('  Se instala una sola vez. Mientras tanto no toque nada: la app')
        print('  sigue andando igual, solo que sin las caras.')
        return 1

    carpeta = buscar_carpeta(a.carpeta)
    if not carpeta:
        print('  No encontre la carpeta de las fotos.')
        print('  Busque: ' + ', '.join(CARPETAS))
        print('  Si esta en otro lado:  python FOTOS_JUGADORES.py --carpeta "LA CARPETA"')
        return 1
    print('  Carpeta: ' + os.path.basename(carpeta))
    print('')

    archivos = sorted([p for p in glob.glob(os.path.join(carpeta, '*')) if p.endswith(EXT)])
    if not archivos:
        print('  La carpeta no tiene fotos.')
        return 1

    fotos, salteadas, total_kb = {}, [], 0.0
    for ruta in archivos:
        nn = dorsal_de(ruta)
        if not nn:
            salteadas.append(os.path.basename(ruta))
            continue
        try:
            im = Image.open(ruta)
            if im.mode != 'RGB':
                im = im.convert('RGB')
            W, H = im.size
            y0 = int(H * ARRIBA)
            h = int(H * ALTO)
            w = int(h * PROPORCION)
            if w > W:                       # una foto mas angosta de lo esperado
                w = W
                h = int(w / PROPORCION)
            x0 = max(0, (W - w) // 2)
            h = min(h, H - y0)
            rec = im.crop((x0, y0, x0 + w, y0 + h))
            rec = rec.resize((ANCHO_SALIDA, int(ANCHO_SALIDA / PROPORCION)), Image.LANCZOS)
            import io
            buf = io.BytesIO()
            rec.save(buf, 'JPEG', quality=CALIDAD, optimize=True, progressive=True)
            b = buf.getvalue()
            fotos[nn] = 'data:image/jpeg;base64,' + base64.b64encode(b).decode('ascii')
            total_kb += len(b) / 1024.0
            print('    #%-3s  %-42s %5.0f KB -> %4.0f KB' % (
                nn.lstrip('0') or '0', os.path.basename(ruta)[:42],
                os.path.getsize(ruta) / 1024.0, len(b) / 1024.0))
        except Exception as e:
            print('    [salteo] %s: %s' % (os.path.basename(ruta), e))

    if not fotos:
        print('')
        print('  Ninguna foto tenia el dorsal adelante del nombre.')
        print('  Tienen que llamarse asi:  01_Nombre_Apellido.jpg')
        return 1

    cab = ('/* Las caras del plantel, sacadas de las fotos oficiales por\n'
           '   FOTOS_JUGADORES.py. NO se edita a mano: se rehace sola.\n'
           '   Va cifrada como el resto de los datos del club. */\n')
    texto = cab + 'window.FOTOS_JUGADORES=' + json.dumps(fotos, separators=(',', ':')) + ';\n'
    ruta_out = os.path.join(AQUI, a.out)
    with open(ruta_out, 'w', encoding='utf-8') as f:
        f.write(texto)

    print('')
    print('  %d fotos -> %s   (%.0f KB de imagen, %.0f KB el archivo)' % (
        len(fotos), a.out, total_kb, len(texto) / 1024.0))
    if salteadas:
        print('  Sin dorsal adelante, no entraron: ' + ', '.join(salteadas))
    print('')
    print('  Ahora hay que cifrarlo y publicar:  ACTUALIZAR_FICHA.bat')
    print('')
    return 0


if __name__ == '__main__':
    try:
        r = main()
    except Exception:
        import traceback
        traceback.print_exc()
        r = 1
    if '--desde-bat' not in sys.argv:
        try:
            input('  (enter para cerrar) ')
        except Exception:
            pass
    sys.exit(r)
