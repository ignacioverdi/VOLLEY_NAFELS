# -*- coding: utf-8 -*-
# ============================================================================
#  MEJORAR_TABLAS.py — que las tablas de estadistica se lean
#  ---------------------------------------------------------------------------
#  QUE MIRE
#
#  Las tres pantallas donde esta el valor del producto: Analisis, Dashboard y
#  Armadores. Medido sobre la app corriendo:
#
#    · los numeros NO eran de ancho fijo: un 1 ocupaba menos que un 8, asi que
#      las columnas no se alineaban nunca
#    · estaban centrados, que es lo peor para comparar de arriba abajo
#    · la cabecera se iba al desplazar: 13 jugadores por 10 columnas sin saber
#      que columna estas mirando
#    · en Analisis no habia filas alternadas, ni separacion entre el nombre y
#      los numeros, ni la fila de totales despegada
#    · en el telefono las ocho columnas no entraban: habia que deslizar al
#      costado para ver el final de cada fila
#
#  LA REFERENCIA ES TUYA
#
#  La tabla del Dashboard ya estaba bien resuelta: dorsal en una chapita, el
#  divisor despues del nombre, la eficiencia y el total destacados. Esto no
#  inventa un diseño nuevo: lleva a las otras tablas al nivel de esa.
#
#  QUE NO TOCA
#
#  Ni un numero, ni el significado de un solo color. El verde sigue siendo
#  punto, el rojo error, el naranja negativo. Solo cambia COMO se leen.
#  Es un bloque de CSS al final de movil.css: no se abre ninguna pantalla.
#
#      python MEJORAR_TABLAS.py          <- solo mira
#      python MEJORAR_TABLAS.py --si     <- lo hace
#
#  Deja una copia movil.css.antes_tablas
# ============================================================================
import os, sys, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv
MARCA = 'LAS TABLAS DE ESTADISTICA'

BLOQUE = r"""
/* ════════════════════════════════════════════════════════════════════════════
   LAS TABLAS DE ESTADISTICA                        (lo pone MEJORAR_TABLAS.py)
   ----------------------------------------------------------------------------
   Analisis, Dashboard, Informe de equipo, Baggerone.
   No cambia un solo numero ni el significado de un solo color: cambia como se
   leen. La referencia es la tabla del Dashboard, que ya estaba bien resuelta;
   esto lleva a las otras al mismo nivel.
   Para sacarlo: borrar este bloque entero.
   ════════════════════════════════════════════════════════════════════════════ */

/* 1 · numeros comparables: cada digito ocupa lo mismo que los demas, asi las
       columnas se alinean solas (antes un 1 ocupaba menos que un 8) */
.tabla-wrap th, .tabla-wrap td, table.tabla th, table.tabla td{ font-variant-numeric:tabular-nums; font-feature-settings:"tnum" 1; }

/* 2 · los numeros a la derecha: es la unica forma de comparar magnitudes de
       arriba abajo de un vistazo. El nombre del jugador se queda a la izquierda. */
.tabla-wrap td:not(.left):not(:first-child), table.tabla td:not(.left):not(:first-child),
.tabla-wrap th:not(.left):not(.sec):not(:first-child), table.tabla th:not(.left):not(.sec):not(:first-child){ text-align:right; padding-right:16px; }

/* 3 · la cabecera no se va al desplazar: en una tabla de 13 jugadores y 10
       columnas, perder los titulos es perder la tabla */
.tabla-wrap thead tr:last-child th, table.tabla thead tr:last-child th{ position:sticky; top:0; z-index:3;
  background:#0d0e1a; box-shadow:0 1px 0 rgba(255,255,255,.09); }

/* 4 · filas alternadas y realce al pasar el mouse: para no perder el renglon
       a mitad de camino */
.tabla-wrap tbody tr:nth-child(even):not(.total-row), table.tabla tbody tr:nth-child(even):not(.total-row){ background:rgba(255,255,255,.045); }
.tabla-wrap tbody tr:hover:not(.total-row), table.tabla tbody tr:hover:not(.total-row){ background:rgba(232,25,44,.10); }

/* 5 · separar QUIEN de CUANTO */
table.tabla td.left, table.tabla th.left{ border-right:1px solid rgba(255,255,255,.14); }

/* 6 · el ancla: la eficiencia es lo que se mira primero, y el total es el que
       le da peso. Hoy tenian el mismo tamanio que el resto. */
table.tabla tbody td:nth-child(2){ font-weight:800; font-size:17px; letter-spacing:-.2px; }
table.tabla tbody td.val-tot{ font-weight:700; font-size:15px; color:#f1f5f9; }

/* 7 · la fila de totales, despegada del resto */
.tabla-wrap tr.total-row, table.tabla tr.total-row{ background:rgba(255,255,255,.07); border-top:2px solid rgba(255,255,255,.26); }
.tabla-wrap tr.total-row td, table.tabla tr.total-row td{ font-weight:800; }

/* 8 · la densidad: la tabla se estiraba a todo el ancho de la pantalla y los
       numeros quedaban a 15 cm unos de otros. Con las columnas al ancho de su
       contenido y un piso comodo, los datos forman un bloque que se barre de
       una mirada en vez de un campo vacio con numeros sueltos. */
/*    En el TELEFONO: columnas al ancho de su contenido, asi las ocho entran
      enteras en 432 px sin deslizar al costado. */
@media (max-width:768px){
  .tabla-wrap table.tabla, table.tabla{ width:auto; min-width:100%; }
}
/*    En la COMPUTADORA: la tabla ocupa todo el ancho —si no, queda media
      pantalla vacia y parece rota— pero el nombre se queda con el espacio que
      sobra, asi los numeros no terminan a quince centimetros unos de otros. */
@media (min-width:769px){
  .tabla-wrap table.tabla, table.tabla{ width:100%; }
  table.tabla td.left, table.tabla th.left{ width:30%; }
}
table.tabla th, table.tabla td{ padding-left:14px; padding-right:18px; }
table.tabla td.left, table.tabla th.left{ padding-right:22px; }
"""


def main():
    os.chdir(AQUI)
    print()
    print('  MEJORAR TABLAS' + ('' if HACERLO else '   (solo mirando - nada se escribe)'))
    print('  ' + '-' * 68)

    if not os.path.exists('movil.css'):
        print('   No encuentro movil.css en esta carpeta. No hago nada.')
        print(); return

    s = open('movil.css', encoding='utf-8', errors='surrogateescape', newline='').read()
    if MARCA in s:
        print('   Ya estaba puesto. No hay nada que hacer.')
        print(); return

    print('   movil.css  + 8 reglas para las tablas de estadistica')
    print('  ' + '-' * 68)

    if not HACERLO:
        print('   Esto fue solo una mirada. Para hacerlo de verdad:')
        print('       python MEJORAR_TABLAS.py --si')
        print(); return

    if not os.path.exists('movil.css.antes_tablas'):
        shutil.copy2('movil.css', 'movil.css.antes_tablas')
    fin = '\r\n' if '\r\n' in s else '\n'
    with open('movil.css', 'a', encoding='utf-8', errors='surrogateescape', newline='') as fh:
        fh.write(BLOQUE.replace('\n', fin))
    print()
    print('   LISTO. Quedo una copia movil.css.antes_tablas')
    print()


def esperar_si_hace_falta():
    if '--desde-bat' in sys.argv:
        return
    try:
        if sys.stdin and sys.stdin.isatty():
            input('   (Enter para cerrar) ')
    except Exception:
        pass


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(); print('   Se corto por un error:', e)
        import traceback; traceback.print_exc()
    esperar_si_hace_falta()
