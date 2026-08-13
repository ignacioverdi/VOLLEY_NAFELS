# -*- coding: utf-8 -*-
"""
===============================================================================
  sellar_version.py — QUE EL NAVEGADOR SE ENTERE DE QUE HAY ALGO NUEVO
-------------------------------------------------------------------------------
  Lo corre PUBLICAR_EN_GITHUB.bat antes de subir. No hay que llamarlo a mano.

  ── QUE PROBLEMA RESUELVE ───────────────────────────────────────────────────
  El navegador guarda los .js y .css para no bajarlos cada vez. Eso esta bien,
  pero necesita alguna señal para saber que un archivo cambio. Sin esa señal se
  queda con el que tiene, y puede pasar MESES asi.

  Se vio con un jugador que reportaba errores ya corregidos: tenia la app de
  hace semanas y no habia forma de que le llegara lo nuevo. Nadie iba a
  sospechar de la cache.

  La solucion estandar es agregarle una version a cada archivo:

      <script src="lang.js">            ->   <script src="lang.js?v=20260813-1855">

  Al cambiar ese numero, para el navegador es un archivo distinto y lo baja de
  nuevo. Se hace en cada publicacion, sobre las paginas .html — los archivos en
  si no se tocan.

  ── LO QUE NO TOCA ──────────────────────────────────────────────────────────
  Los enlaces a otros sitios (https://...), que no son nuestros, y sw.js, que
  el navegador maneja aparte con sus propias reglas.
===============================================================================
"""
import io
import os
import re
import sys
import glob
import datetime

# Los que se versionan. El resto queda igual.
EXT = (r'\.js', r'\.css')


def main():
    sello = datetime.datetime.now().strftime('%Y%m%d-%H%M')

    # src="algo.js"  o  href="algo.css", sin http y sin version previa
    patron = re.compile(
        r'(\s(?:src|href)=")(?!https?:|//)([^"?]+?(?:' + '|'.join(EXT) + r'))(\?v=[^"]*)?(")',
        re.I)

    def reemplazo(m):
        archivo = m.group(2)
        # sw.js lo maneja el navegador con sus propias reglas: si se le cambia
        # la direccion en cada publicacion, se reinstala de cero cada vez.
        if os.path.basename(archivo).lower() == 'sw.js':
            return m.group(1) + archivo + (m.group(3) or '') + m.group(4)
        return m.group(1) + archivo + '?v=' + sello + m.group(4)

    tocados = 0
    total = 0
    for p in sorted(glob.glob('*.html')):
        try:
            s = io.open(p, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        nuevo, n = patron.subn(reemplazo, s)
        if n and nuevo != s:
            try:
                io.open(p, 'w', encoding='utf-8').write(nuevo)
                tocados += 1
                total += n
            except Exception as e:
                print('  [aviso] no pude escribir %s: %s' % (p, e))

    if tocados:
        print('  Version de la app: %s   (%d archivos en %d paginas)'
              % (sello, total, tocados))
    else:
        print('  Version de la app: %s   (nada que actualizar)' % sello)
    return 0


if __name__ == '__main__':
    sys.exit(main())
