# -*- coding: utf-8 -*-
"""
LINKS_VIDEO_CIFRADOS.py
=======================

Que los links de video no se pierdan al cifrar.

── EL PROBLEMA ───────────────────────────────────────────────────────────────
El circuito hoy es este:

    1. bajas mapa_videos_ent.js desde "Cargar videos"
    2. lo pones en la carpeta del club
    3. cifrar_datos.py lo convierte en .enc Y BORRA el .js
    4. HACER_TODO corre build_video
    5. build_video busca mapa_videos_ent.js  ->  ya no esta

    if os.path.isfile('mapa_videos_ent.js'):   # False
        leer los links

Resultado: build_video no encuentra ningun link y genera el archivo vacio.
El video queda cargado en la pantalla pero no llega a los cortes.

── LA SOLUCION ───────────────────────────────────────────────────────────────
Si el .js no esta, se lee el .enc y se descifra con la llave del club, que
esta en LLAVE.txt. Es la misma llave que usa la app.

Asi el orden de los pasos deja de importar: cifrar primero o despues, los
links se leen igual.
"""

import io
import os
import re
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ARCH = os.path.join(AQUI, 'build_video.py')

LECTOR = '''
def _leer_enc(nombre):
    """Lee un archivo de datos cifrado (.enc) y devuelve su texto.

    Hace falta porque cifrar_datos.py borra el .js original: si build_video
    corre despues del cifrado, el archivo suelto ya no existe y los links
    se perderian.
    """
    import base64, hashlib, json as _json
    ruta = nombre + '.enc'
    if not os.path.isfile(ruta):
        return None
    try:
        llave_txt = open('LLAVE.txt', encoding='utf-8').read().strip()
    except Exception:
        return None
    try:
        crudo = open(ruta, encoding='utf-8', errors='replace').read()
        m = re.search(r'window\\.__D\\["[^"]+"\\]\\s*=\\s*"([^"]*)"', crudo, re.S)
        if not m:
            return None
        datos = bytearray(base64.b64decode(m.group(1)))

        # la clave del archivo: sha256(llave + nombre), igual que en la app
        llave = bytes.fromhex(llave_txt) if re.fullmatch(r'[0-9a-fA-F]+', llave_txt) \\
                else llave_txt.encode('utf-8')
        clave = hashlib.sha256(llave + nombre.encode('utf-8')).digest()

        bloque = 0
        pos = 0
        while pos < len(datos):
            ent = clave + bloque.to_bytes(8, 'big')
            f = hashlib.sha256(ent).digest()
            for j in range(32):
                if pos >= len(datos):
                    break
                datos[pos] ^= f[j]
                pos += 1
            bloque += 1
        return datos.decode('utf-8', errors='replace')
    except Exception:
        return None

'''


def main():
    print()
    print('  ' + '=' * 62)
    print('     LOS LINKS DE VIDEO Y EL CIFRADO')
    print('  ' + '=' * 62)
    print()

    if not os.path.exists(ARCH):
        print('     No encontre build_video.py en esta carpeta.')
        print()
        return 1

    s = io.open(ARCH, encoding='utf-8', errors='replace').read()

    if '_leer_enc' in s:
        print('  ' + '-' * 62)
        print('     Ya estaba puesto.')
        print()
        return 0

    m = re.search(r'^( *)if os\.path\.isfile\(mapa_file\):', s, re.M)
    if not m:
        print('     El archivo tiene otra forma: no lo toco.')
        print()
        return 1

    print('     cifrar_datos.py borra el .js despues de cifrarlo, y')
    print('     build_video no encuentra los links: genera el archivo vacio.')
    print()
    print('     Con esto, si el .js no esta se lee el .enc.')
    print()

    if '--si' in sys.argv:
        print('     Aplico? (S/N): S   (automatico)')
    else:
        try:
            r = input('     Aplico? (S/N): ').strip().lower()
        except Exception:
            r = 'n'
        if r not in ('s', 'si', 'y'):
            print()
            print('     No toque nada.')
            print()
            return 0

    # el lector, antes de read_mapa_links
    i = s.find('def read_mapa_links')
    s = s[:i] + LECTOR.lstrip('\n') + '\n' + s[i:]

    # y que se use cuando el .js no esta
    m = re.search(r'^( *)if os\.path\.isfile\(mapa_file\):', s, re.M)
    ind = m.group(1)
    nuevo = (ind + '# Si el .js no esta (cifrar_datos lo borro), se lee el .enc.\n' +
             ind + 'if not os.path.isfile(mapa_file):\n' +
             ind + '    _txt = _leer_enc(mapa_file)\n' +
             ind + '    if _txt:\n' +
             ind + '        try:\n' +
             ind + "            _mm = re.search(r'window\\\\.'+mapa_glob+r'\\\\s*=\\\\s*(\\\\{.*?\\\\})\\\\s*;', _txt, re.S)\n" +
             ind + '            if _mm:\n' +
             ind + '                for k, v in json.loads(_mm.group(1)).items():\n' +
             ind + '                    if v: links[k] = v\n' +
             ind + '        except Exception:\n' +
             ind + '            pass\n' +
             m.group(0))
    s = s.replace(m.group(0), nuevo, 1)

    resp = ARCH + '.antes-links'
    if not os.path.exists(resp):
        try:
            shutil.copy2(ARCH, resp)
        except Exception:
            pass
    io.open(ARCH, 'w', encoding='utf-8').write(s)

    print()
    print('       build_video.py           listo')
    print()
    print('  ' + '-' * 62)
    print('     Corre HACER_TODO.bat')
    print()
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    finally:
        if '--si' not in sys.argv:
            try:
                input('  Enter para cerrar...')
            except Exception:
                pass
