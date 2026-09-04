# -*- coding: utf-8 -*-
"""
LINKS_VIDEO_V2.py
=================

Que build_video lea los links de video aunque el archivo este cifrado.

── POR QUE UNA SEGUNDA VERSION ───────────────────────────────────────────────
La primera reimplementaba el descifrado a mano y le faltaba un detalle: la
clave de cada archivo lleva un separador entre la llave del club y el nombre.

    hashlib.sha256(llave + b'|' + nombre)
                          ^^^^ esto faltaba

Por eso el descifrado daba basura y los links seguian sin leerse.

Esta version NO reimplementa nada: importa las funciones de
descifrar_datos.py, que son las que usa el resto del sistema. Si algun dia
cambia el cifrado, esto sigue funcionando solo.

── EL PROBLEMA DE FONDO ──────────────────────────────────────────────────────
    1. bajas mapa_videos_ent.js desde "Cargar videos"
    2. lo pones en la carpeta
    3. cifrar_datos.py lo convierte en .enc y BORRA el .js
    4. build_video busca el .js -> ya no esta -> genera el archivo vacio

El video queda cargado en la pantalla pero nunca llega a los cortes.
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

    Usa las funciones de descifrar_datos.py en vez de reimplementarlas, para
    que siga funcionando si algun dia cambia el cifrado.
    """
    ruta = nombre + '.enc'
    if not os.path.isfile(ruta):
        return None
    try:
        import descifrar_datos as _dd
        llave = _dd.llave_guardada(os.getcwd()) or _dd.llave_guardada('.')
        if not llave:
            return None
        crudo = open(ruta, encoding='utf-8', errors='replace').read()
        m = re.search(r'window\\.__D\\["([^"]+)"\\]\\s*=\\s*"([^"]*)"', crudo, re.S)
        if not m:
            return None
        return _dd.descifrar(m.group(2), llave, m.group(1))
    except Exception as e:
        print('   (aviso: no pude leer %s: %s)' % (ruta, str(e)[:60]))
        return None

'''


def main():
    print()
    print('  ' + '=' * 62)
    print('     LOS LINKS DE VIDEO — SEGUNDA VERSION')
    print('  ' + '=' * 62)
    print()

    if not os.path.exists(ARCH):
        print('     No encontre build_video.py en esta carpeta.')
        print()
        return 1

    s = io.open(ARCH, encoding='utf-8', errors='replace').read()

    # se saca la version anterior si esta
    if '_leer_enc' in s:
        i = s.find('def _leer_enc')
        j = s.find('def read_mapa_links')
        if 0 < i < j:
            s = s[:i] + s[j:]
            print('     (saco la version anterior del lector)')

    m = re.search(r'^( *)if os\.path\.isfile\(mapa_file\):', s, re.M)
    if not m:
        print('     El archivo tiene otra forma: no lo toco.')
        print()
        return 1

    print('     A la version anterior le faltaba el separador de la clave.')
    print('     Esta usa las funciones de descifrar_datos.py directamente.')
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

    # y el uso, si todavia no esta
    if '_leer_enc(mapa_file)' not in s:
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
                 ind + "                print('   Lei %d link(s) de video del archivo cifrado.' % len(links))\n" +
                 ind + '        except Exception:\n' +
                 ind + '            pass\n' +
                 m.group(0))
        s = s.replace(m.group(0), nuevo, 1)

    resp = ARCH + '.antes-links2'
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
