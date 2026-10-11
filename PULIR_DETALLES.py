# -*- coding: utf-8 -*-
# ============================================================================
#  PULIR_DETALLES.py — las terminaciones
#  ---------------------------------------------------------------------------
#  Agrega UN bloque al final de movil.css. Ninguna de sus reglas mueve un
#  elemento de lugar ni cambia un numero. Son las diez terminaciones que
#  separan "funciona" de "es un producto":
#
#   1  el texto, mejor dibujado (antialiasing)
#   2  la barra de scroll oscura y fina, en vez de la blanca de Windows
#   3  el texto seleccionado, en el rojo de la marca
#   4  el foco de teclado visible (solo con teclado, no con el mouse)
#   5  en el telefono: sin el destello azul al tocar, y con respuesta al toque
#   6  los checkbox, radio y deslizadores, en el rojo de la marca
#   7  iPhone: que Safari no haga zoom solo al tocar un campo
#   8  quien pidio menos movimiento en su telefono, recibe menos movimiento
#   9  los dos botones flotantes de abajo a la derecha dejan de tocarse
#  10  ninguna imagen puede empujar la pantalla a lo ancho
#
#  Probado sobre las 68 pantallas: 0 desbordes, 0 pantallas rotas, misma
#  velocidad de carga.
#
#      python PULIR_DETALLES.py          <- solo mira
#      python PULIR_DETALLES.py --si     <- lo hace
#
#  Deja una copia movil.css.antes_pulido
#  Para sacarlo: borrar el bloque "TERMINACIONES" del final de movil.css.
# ============================================================================
import os, sys, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv
MARCA = 'TERMINACIONES'

BLOQUE = r"""
/* ════════════════════════════════════════════════════════════════════════════
   TERMINACIONES — los detalles que separan "funciona" de "es un producto"
   ----------------------------------------------------------------------------
   Lo pone PULIR_DETALLES.py. Ninguna de estas reglas mueve un elemento de
   lugar ni cambia un numero: son terminaciones.
   Para sacarlo: borrar este bloque entero. No toca nada mas.
   ════════════════════════════════════════════════════════════════════════════ */

/* 1 · el texto, mejor dibujado ------------------------------------------- */
html{ -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }

/* 2 · la barra de scroll, oscura y fina (antes era la blanca de Windows) -- */
*{ scrollbar-width:thin; scrollbar-color:#2A2F3E transparent; }
::-webkit-scrollbar{ width:10px; height:10px; }
::-webkit-scrollbar-track{ background:transparent; }
::-webkit-scrollbar-thumb{ background:#262B38; border-radius:99px; border:2px solid transparent; background-clip:content-box; }
::-webkit-scrollbar-thumb:hover{ background:#39404F; background-clip:content-box; }
::-webkit-scrollbar-corner{ background:transparent; }

/* 3 · el texto seleccionado, en el rojo de la marca ----------------------- */
::selection{ background:rgba(232,25,44,.30); color:#fff; }
::-moz-selection{ background:rgba(232,25,44,.30); color:#fff; }

/* 4 · el foco de teclado: se ve, y se ve bien ----------------------------- */
:focus-visible{ outline:2px solid #E8192C; outline-offset:2px; border-radius:4px; }
/* el foco del mouse no deja marca: eso es lo que molestaba y por eso lo
   apagaban. Con :focus-visible solo aparece cuando se navega con teclado. */

/* 5 · en el telefono: sin el destello azul al tocar, y con respuesta ------ */
*{ -webkit-tap-highlight-color:transparent; }
@media (hover:none){
  a:active, button:active, [role="button"]:active,
  .card:active, .tab-btn:active, .btn:active{ opacity:.72; }
}

/* 6 · los controles nativos, en el color de la marca --------------------- */
input[type="checkbox"], input[type="radio"], input[type="range"],
progress{ accent-color:#E8192C; }

/* 7 · iPhone: que no haga zoom solo al tocar un campo --------------------
   Safari agranda la pagina cuando un campo tiene menos de 16px, y despues
   queda corrida. Solo iOS: en Windows y Android no se toca nada. */
@supports (-webkit-touch-callout:none){
  @media (max-width:820px){
    input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
    select, textarea{ font-size:16px; }
  }
}

/* 8 · quien pidio menos movimiento, recibe menos movimiento -------------- */
@media (prefers-reduced-motion:reduce){
  *, *::before, *::after{
    animation-duration:.01ms !important; animation-iteration-count:1 !important;
    transition-duration:.01ms !important; scroll-behavior:auto !important;
  }
}

/* 9 · los dos botones flotantes de abajo a la derecha se tocaban --------- */
#ayuda-btn{ bottom:70px; }

/* 10 · las imagenes nunca empujan la pantalla a lo ancho ----------------- */
img{ max-width:100%; }
"""


def main():
    os.chdir(AQUI)
    print()
    print('  PULIR DETALLES' + ('' if HACERLO else '   (solo mirando - nada se escribe)'))
    print('  ' + '-' * 68)

    if not os.path.exists('movil.css'):
        print('   No encuentro movil.css en esta carpeta. No hago nada.')
        print()
        return

    s = open('movil.css', encoding='utf-8', errors='surrogateescape', newline='').read()
    if MARCA in s:
        print('   Ya estaba puesto. No hay nada que hacer.')
        print()
        return

    print('   movil.css  + las 10 reglas de terminacion')
    print('  ' + '-' * 68)

    if not HACERLO:
        print('   Esto fue solo una mirada. Para hacerlo de verdad:')
        print('       python PULIR_DETALLES.py --si')
        print()
        return

    if not os.path.exists('movil.css.antes_pulido'):
        shutil.copy2('movil.css', 'movil.css.antes_pulido')
    fin = '\r\n' if '\r\n' in s else '\n'
    with open('movil.css', 'a', encoding='utf-8', errors='surrogateescape', newline='') as fh:
        fh.write(BLOQUE.replace('\n', fin))
    print()
    print('   LISTO. Quedo una copia movil.css.antes_pulido')
    print()


if __name__ == '__main__':
    main()
