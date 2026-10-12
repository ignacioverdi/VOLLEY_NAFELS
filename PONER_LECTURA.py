#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  PONER_LECTURA.py — instala LA LECTURA DEL PARTIDO
-------------------------------------------------------------------------------
  Por defecto NO toca nada: muestra lo que haria. Para aplicarlo de verdad:

      PONER_LECTURA.bat        (o)       python PONER_LECTURA.py --si

  De cada archivo que cambia deja una copia  <archivo>.antes_lectura  antes de
  escribir. Se puede correr dos veces: si ya esta puesto, avisa y no hace nada.

  ── QUE TOCA, Y POR QUE ─────────────────────────────────────────────────────

  1) analisis.html   dos lineas: cargar datos_lectura.js.enc y lectura.js.
                     Van justo antes de abrirDatos(), que es quien abre los
                     archivos cifrados: cargado despues, nadie lo abriria.

  2) cifrar_datos.py y descifrar_datos.py
                     agrega 'datos_lectura.js' a las dos listas. Sin esto el
                     archivo se publicaria EN CLARO en un repositorio que es
                     publico, con el analisis de cada rival adentro.
                     Tiene que estar en las dos: si solo esta en la de cifrar,
                     HACER_TODO no lo puede volver a abrir y queda congelado.

  3) HACER_TODO.bat  agrega la corrida de gen_lectura.py, justo despues del
                     informe de equipo, que es de donde reusa el metodo.

  4) cortes.html     UN arreglo de una linea, explicado abajo.

  ── EL ARREGLO DE cortes.html ───────────────────────────────────────────────

  Los links de recortes de video viajan asi:  codigo-segundo-dorsal  y del
  otro lado se parten con split('-'), tomando el primer pedazo como codigo.

  Eso funciona mientras el codigo del partido sea el numero oficial de la liga
  (5 o 6 digitos). Cuando el .dvw no trae ese numero —y NINGUNO de los de
  Nafels lo trae, porque los archivos se nombran por fecha— build_video.py
  arma el codigo como  P2026-10-07-20261007AXPV , que tiene guiones adentro.
  Entonces split('-') devuelve codigo 'P2026' y segundo '10': no existe, y la
  pantalla abre con CERO clips.

  O sea que hoy el boton de compartir recortes genera links que no abren nada.
  Se arregla leyendo de DERECHA a IZQUIERDA —el dorsal y el segundo son los
  dos ultimos pedazos, el resto es el codigo— que da el mismo resultado para
  los links viejos y ademas funciona para estos. Es la unica linea que cambia.
===============================================================================
"""
import io
import os
import re
import sys
import shutil
import hashlib

AQUI = os.path.dirname(os.path.abspath(__file__))
APLICAR = ('--si' in sys.argv)
DESDE_BAT = ('--desde-bat' in sys.argv)

NUEVOS = ['gen_lectura.py', 'lectura.js']


def leer(nombre):
    """Se lee en binario y se pasa a texto a mano para NO tocar los finales de
    linea: los .bat de Windows dejan de funcionar si se les cambian."""
    with open(os.path.join(AQUI, nombre), 'rb') as f:
        return f.read().decode('utf-8', 'surrogateescape')


def escribir(nombre, txt):
    ruta = os.path.join(AQUI, nombre)
    copia = ruta + '.antes_lectura'
    if not os.path.exists(copia):
        shutil.copy2(ruta, copia)
    with open(ruta, 'wb') as f:
        f.write(txt.encode('utf-8', 'surrogateescape'))


def md5(nombre):
    with open(os.path.join(AQUI, nombre), 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()


# ── Los cuatro cambios ──────────────────────────────────────────────────────
def cambio_analisis(s):
    if 'datos_lectura.js.enc' in s:
        return None, 'ya estaba'
    anc = '<script>abrirDatos();</script>'
    if s.count(anc) != 1:
        return None, 'no encontre abrirDatos() una sola vez (aparece %d veces)' % s.count(anc)
    fin = '\r\n' if '\r\n' in s else '\n'
    nuevo = ('<script src="datos_lectura.js.enc" onerror="void 0"></script>' + fin + '  '
             + anc + fin + '  <script src="lectura.js" defer></script>')
    return s.replace(anc, nuevo), 'dos lineas agregadas antes de abrirDatos()'


def cambio_lista(s):
    if "'datos_lectura.js'" in s:
        return None, 'ya estaba'
    anc = "    'datos_informe.js',\n"
    if anc not in s:
        return None, "no encontre la linea de 'datos_informe.js'"
    return s.replace(anc, anc + "    # La lectura del partido: sale de los mismos .dvw y tiene el\n"
                                "    # analisis de cada rival adentro, asi que viaja cifrada igual.\n"
                                "    'datos_lectura.js',\n", 1), "agregado a la lista"


# El bloque que se agrega a HACER_TODO.bat. Se escribe SIN finales de linea
# y despues se arman con los que ya tenga el archivo: HACER_TODO.bat de Nafels
# esta guardado con finales de Unix y funciona asi, de modo que meterle lineas
# de Windows lo dejaria mezclado. Lo que hay, se respeta.
LINEAS_BAT = [
    "REM ===================================================================",
    "REM   LA LECTURA DEL PARTIDO",
    "REM",
    "REM   El informe de arriba lee la TEMPORADA. Esto lee cada PARTIDO por",
    "REM   separado, con la misma tabla de referencia de la liga: cuanto",
    "REM   deberia haber salido el partido, en que set y en que rotacion se",
    "REM   fue, que fundamento costo mas puntos y quien rindio por encima o",
    "REM   por debajo de lo suyo. Se dibuja arriba de Analisis del partido.",
    "REM ===================================================================",
    "echo  ================= LA LECTURA DEL PARTIDO =================",
    "echo.",
    'python gen_lectura.py --dvw_dir "!DVW_DIR!" --temporada "!TEMPORADA_ACTUAL!" --out "datos_lectura.js"',
    "if errorlevel 1 echo      [aviso] Problema armando la lectura. Sigo igual.",
    'if errorlevel 1 set "FALLOS=!FALLOS!|Problema armando la lectura."',
    "if errorlevel 1 set /a NFALLOS+=1",
    "echo.",
    "",
]


def cambio_hacer_todo(s):
    if 'gen_lectura.py' in s:
        return None, 'ya estaba'
    fin = '\r\n' if '\r\n' in s else '\n'
    def L(ls):
        return fin.join(ls) + fin
    anc = L(['if errorlevel 1 set /a NFALLOS+=1', 'echo.', '',
             'REM ===================================================================',
             'REM   ESTADISTICAS DE LA LIGA'])
    if s.count(anc) != 1:
        return None, 'no encontre el final del bloque del informe (aparece %d veces)' % s.count(anc)
    corte = L(['if errorlevel 1 set /a NFALLOS+=1', 'echo.', ''])
    resto = L(['REM ===================================================================',
               'REM   ESTADISTICAS DE LA LIGA'])
    return s.replace(anc, corte + L(LINEAS_BAT) + resto, 1), 'bloque agregado despues del informe'


VIEJO_CLIPS = ("var want=pClips.split(';').map(function(str){var x=str.split('-');"
               "return {mc:x[0],t:parseFloat(x[1]),num:x[2]};});")
NUEVO_CLIPS = ("var want=pClips.split(';').map(function(str){"
               "/* El codigo del partido puede traer guiones adentro "
               "(P2026-10-07-20261007AXPV): se lee de DERECHA a IZQUIERDA, que es "
               "donde estan el segundo y el dorsal, y lo que queda es el codigo. "
               "Para los links viejos, con codigo de 5 o 6 digitos, el resultado es "
               "el mismo. */"
               "var x=str.split('-');var num=x.pop();var t=x.pop();"
               "return {mc:x.join('-'),t:parseFloat(t),num:num};});")


def cambio_cortes(s):
    if 'de DERECHA a IZQUIERDA' in s:
        return None, 'ya estaba'
    if s.count(VIEJO_CLIPS) != 1:
        return None, 'no encontre la linea de los clips tal cual (aparece %d veces)' % s.count(VIEJO_CLIPS)
    return s.replace(VIEJO_CLIPS, NUEVO_CLIPS, 1), 'links de recorte arreglados'


CAMBIOS = [
    ('analisis.html', cambio_analisis),
    ('cifrar_datos.py', cambio_lista),
    ('descifrar_datos.py', cambio_lista),
    ('HACER_TODO.bat', cambio_hacer_todo),
    ('cortes.html', cambio_cortes),
]


def main():
    print('')
    print('=' * 68)
    print('  LA LECTURA DEL PARTIDO' + ('' if APLICAR else '   (prueba: no escribo nada)'))
    print('=' * 68)
    print('')

    faltan = [n for n in NUEVOS if not os.path.exists(os.path.join(AQUI, n))]
    if faltan:
        print('  [ERROR] faltan estos archivos en la carpeta: ' + ', '.join(faltan))
        print('          Copialos primero y volve a correr esto.')
        return 1
    for n in NUEVOS:
        print('  ok   %-22s %s' % (n, md5(n)))
    print('')

    hechos = 0
    for nombre, fn in CAMBIOS:
        ruta = os.path.join(AQUI, nombre)
        if not os.path.exists(ruta):
            print('  --   %-22s no esta en la carpeta, lo salteo' % nombre)
            continue
        try:
            s = leer(nombre)
        except Exception as e:
            print('  !!   %-22s no lo pude leer: %s' % (nombre, e))
            continue
        nuevo, motivo = fn(s)
        if nuevo is None:
            print('  --   %-22s %s' % (nombre, motivo))
            continue
        if APLICAR:
            escribir(nombre, nuevo)
            print('  OK   %-22s %s' % (nombre, motivo))
        else:
            print('  ->   %-22s %s' % (nombre, motivo))
        hechos += 1

    print('')
    if not APLICAR:
        print('  Nada se escribio. Para aplicarlo de verdad: PONER_LECTURA.bat')
    elif hechos:
        print('  Listo: %d archivos cambiados (quedo una copia .antes_lectura de cada uno).' % hechos)
        print('')
        print('  AHORA, para que aparezca:')
        print('     1) ACTUALIZAR_LECTURA.bat   genera y cifra los datos')
        print('     2) VER_LA_APP.bat           miralo antes de publicar')
        print('     3) PUBLICAR_EN_GITHUB.bat')
    else:
        print('  No habia nada que hacer: ya estaba todo puesto.')
    print('')
    return 0


if __name__ == '__main__':
    try:
        r = main()
    except Exception:
        import traceback
        traceback.print_exc()
        r = 1
    if not DESDE_BAT:
        try:
            input('\n  (enter para cerrar) ')
        except Exception:
            pass
    sys.exit(r)
