#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  SACAR_NACIM.py — EL ULTIMO PASO: QUE LA FECHA DE NACIMIENTO DEJE DE SER PUBLICA
-------------------------------------------------------------------------------
  POR QUE EXISTE

  La clave de cada jugador es su fecha de nacimiento. Mientras esa fecha viva
  en plantel_nafels.js —que se publica tal cual, sin cifrar— cualquiera que
  encuentre el repositorio tiene la clave de todos. Y uno del plantel es menor
  de edad.

  Las fechas ya se copiaron a datos_plantel.js, que SI se cifra (arranca con
  "datos_", asi que cifrar_datos.py lo toma solo). La planilla P-2 y la
  pantalla de Equipo ya las leen de ahi, y si no las encuentran usan las del
  plantel: por eso hoy funciona igual que siempre.

  Este script da el ultimo paso: las borra de plantel_nafels.js.

  CUANDO CORRERLO

  Despues de una corrida completa de HACER_TODO (que cifra y publica), cuando
  ya exista datos_plantel.js.enc y hayas visto la planilla P-2 con las fechas
  en su lugar. Antes de eso, este script se niega a hacer nada.

  QUE HACE

      1. comprueba que datos_plantel.js (o su .enc) exista y tenga las 13 fechas
      2. deja una copia: plantel_nafels.js.antes_de_sacar_nacim
      3. saca el campo nacim de los jugadores y del cuerpo tecnico
      4. te dice que publiques

  SI ALGO SALE MAL
      Renombra plantel_nafels.js.antes_de_sacar_nacim a plantel_nafels.js y
      todo vuelve a como estaba.
===============================================================================
"""
import io
import os
import re
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
PLANTEL = os.path.join(AQUI, 'plantel_nafels.js')
PRIVADO = os.path.join(AQUI, 'datos_plantel.js')
PRIVADO_ENC = PRIVADO + '.enc'


def cuantas_fechas_hay():
    """Cuantas fechas guarda el archivo privado (en claro o cifrado)."""
    if os.path.exists(PRIVADO):
        t = io.open(PRIVADO, encoding='utf-8').read()
        return len(re.findall(r'nacim:\s*"[^"]+"', t)), 'datos_plantel.js'
    if os.path.exists(PRIVADO_ENC):
        # cifrado: no se puede contar sin la llave, pero que exista y pese
        # ya dice que se cifro de verdad
        if os.path.getsize(PRIVADO_ENC) > 200:
            return -1, 'datos_plantel.js.enc'
    return 0, None


def main():
    if not os.path.exists(PLANTEL):
        print('  No encuentro plantel_nafels.js.')
        return 1

    texto = io.open(PLANTEL, encoding='utf-8').read()
    cuantas = len(re.findall(r'nacim:\s*"[^"]*"', texto))
    if not cuantas:
        print()
        print('  Ya estaba hecho: plantel_nafels.js no tiene ninguna fecha.')
        print()
        return 0

    hay, de_donde = cuantas_fechas_hay()
    if hay == 0:
        print()
        print('  ' + '=' * 66)
        print('    TODAVIA NO')
        print('  ' + '=' * 66)
        print()
        print('    No encuentro datos_plantel.js ni datos_plantel.js.enc.')
        print('    Sin ese archivo, sacar las fechas de aca deja la planilla')
        print('    P-2 sin fechas, que es justo lo que no puede pasar.')
        print()
        print('    Corre HACER_TODO (que cifra y publica), fijate que la P-2')
        print('    siga mostrando las fechas, y despues volve aca.')
        print()
        return 1
    if hay > 0 and hay < cuantas:
        print()
        print('    El archivo privado tiene %d fechas y el plantel %d.' % (hay, cuantas))
        print('    Falta alguna: no saco nada hasta que esten todas.')
        print()
        return 1

    copia = PLANTEL + '.antes_de_sacar_nacim'
    if not os.path.exists(copia):
        shutil.copy2(PLANTEL, copia)

    nuevo = re.sub(r',\s*nacim:\s*"[^"]*"', '', texto)
    quedan = len(re.findall(r'nacim:\s*"[^"]*"', nuevo))
    if quedan:
        # alguna quedo con otra forma (primera de la linea, por ejemplo)
        nuevo = re.sub(r'nacim:\s*"[^"]*"\s*,\s*', '', nuevo)
        quedan = len(re.findall(r'nacim:\s*"[^"]*"', nuevo))

    # el archivo tiene que seguir siendo JavaScript valido y con los 13
    if nuevo.count('num:') != texto.count('num:'):
        print('  Algo no cuadra: cambio la cantidad de jugadores. No toco nada.')
        return 1

    # y que la explicacion de arriba no mienta mas
    nuevo = nuevo.replace(
        '     - nacim  : fecha de nacimiento\n',
        '     - (la fecha de nacimiento ya no vive aca: es la clave de cada\n'
        '        jugador y este archivo se publica. Esta en datos_plantel.js,\n'
        '        que se cifra. La leen la planilla P-2 y la pantalla de Equipo)\n')

    io.open(PLANTEL, 'w', encoding='utf-8', newline='').write(nuevo)

    print()
    print('  Listo: saque %d fecha(s) de plantel_nafels.js.' % (cuantas - quedan))
    print('  Las fechas siguen en %s.' % (de_donde or 'datos_plantel.js'))
    print('  Copia de seguridad: %s' % os.path.basename(copia))
    print()
    print('  AHORA: abri la planilla P-2 y fijate que las fechas sigan ahi.')
    print('  Si estan, publica. Si no, renombra la copia y avisame.')
    print()
    return 0


if __name__ == '__main__':
    sys.exit(main())
