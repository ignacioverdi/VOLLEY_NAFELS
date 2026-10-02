#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  RESPALDAR_FIREBASE.py — LA COPIA DIARIA DE LO QUE SOLO VIVE EN FIREBASE
-------------------------------------------------------------------------------
  QUE PROBLEMA RESUELVE

  Los .dvw estan a salvo: hay 122 versionados en git, y de ahi se reconstruye
  casi todo. Pero hay cosas que NO salen de ningun .dvw y viven en un solo
  lugar, la base de Firebase:

      wellness de todo el plantel . pesos, RM y evolucion de cada jugador
      las rutinas del PF . las notas entre jugador y profe . el calendario y
      el fixture . usuarios, roles y dorsales . el cuerpo tecnico . los .dvw
      subidos desde la app que todavia no se procesaron

  Si alguien borra un nodo por error, o la cuenta se cae, eso no vuelve.

  QUE HACE

      1. entra a la base con la cuenta del robot (un usuario comun)
      2. baja el arbol entero
      3. lo compara con el respaldo anterior y FRENA si encogio a la mitad
      4. lo cifra con la llave del club y lo guarda en respaldos/
      5. deja solo los ultimos 30 dias

  POR QUE CIFRADO
      Tiene datos personales del plantel. El repositorio puede ser publico.

  POR QUE EL FRENO
      Un respaldo que guarda una base vacia es PEOR que no tener respaldo:
      pisa el ultimo bueno y nadie se entera. Si el volcado de hoy pesa menos
      de la mitad que el anterior, no se guarda nada y la corrida falla.

  VARIABLES QUE NECESITA  (como secretos del repositorio)
      FB_URL        la direccion de la base
      FB_KEY        la clave publica del proyecto
      ROBOT_MAIL    cuenta del robot
      ROBOT_CLAVE   su contrasena
      CLUB_ID       (opcional) si la base guarda varios clubes
      FB_REFERER    (opcional) el dominio de la app, si la clave esta limitada
  Y la llave del club en LLAVE.txt, igual que el resto del sistema.

  COMO SE ABRE UN RESPALDO
      python RESPALDAR_FIREBASE.py --abrir respaldos/firebase_2026-10-02.resp
      Deja al lado el .json en claro. Borralo cuando termines.

  QUE DEVUELVE
      0  -> se guardo (o no habia nada que hacer)
      1  -> algo fallo: NO se guardo nada
===============================================================================
"""
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
CARPETA = os.path.join(AQUI, 'respaldos')
INDICE = os.path.join(CARPETA, '_tamanos.json')
CUANTOS_DIAS = 30

FB_URL = (os.environ.get('FB_URL') or '').rstrip('/')
FB_KEY = os.environ.get('FB_KEY') or ''
ROBOT_MAIL = os.environ.get('ROBOT_MAIL') or ''
ROBOT_CLAVE = os.environ.get('ROBOT_CLAVE') or ''
CLUB_ID = (os.environ.get('CLUB_ID') or '').strip()
FB_REFERER = (os.environ.get('FB_REFERER') or '').strip()
RAIZ = ('clubes/%s/' % CLUB_ID) if CLUB_ID else ''


def llamar(url, datos=None, metodo='GET'):
    cuerpo = json.dumps(datos).encode('utf-8') if datos is not None else None
    cab = {'Content-Type': 'application/json'}
    if FB_REFERER:
        cab['Referer'] = FB_REFERER
    pedido = urllib.request.Request(url, data=cuerpo, method=metodo, headers=cab)
    try:
        with urllib.request.urlopen(pedido, timeout=180) as r:
            return r.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        print('   [http %s] %s' % (e.code, e.read().decode('utf-8', 'replace')[:200]))
        return None
    except Exception as e:
        print('   [error] %s' % e)
        return None


def entrar():
    t = llamar('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FB_KEY,
               {'email': ROBOT_MAIL, 'password': ROBOT_CLAVE, 'returnSecureToken': True}, 'POST')
    if not t:
        return None
    try:
        return (json.loads(t) or {}).get('idToken')
    except Exception:
        return None


def _llave():
    """La misma llave del club que usa el resto del sistema."""
    ruta = os.path.join(AQUI, 'LLAVE.txt')
    if not os.path.exists(ruta):
        return None
    t = io.open(ruta, encoding='utf-8').read().strip()
    return t if len(t) == 64 else None


def _cifrador():
    """Se reusa el de cifrar_datos.py para no tener dos formatos distintos."""
    sys.path.insert(0, AQUI)
    import cifrar_datos
    return cifrar_datos


def leer_indice():
    try:
        return json.load(io.open(INDICE, encoding='utf-8'))
    except Exception:
        return {}


def guardar_indice(d):
    io.open(INDICE, 'w', encoding='utf-8').write(
        json.dumps(d, ensure_ascii=False, indent=1, sort_keys=True))


def podar(hoy):
    """Deja los ultimos CUANTOS_DIAS respaldos. Git guarda el resto."""
    try:
        archivos = sorted(a for a in os.listdir(CARPETA)
                          if a.startswith('firebase_') and a.endswith('.resp'))
    except Exception:
        return []
    sobran = archivos[:-CUANTOS_DIAS] if len(archivos) > CUANTOS_DIAS else []
    fuera = []
    for a in sobran:
        try:
            os.remove(os.path.join(CARPETA, a))
            fuera.append(a)
        except Exception:
            pass
    return fuera


def abrir(ruta):
    """Devuelve el .json en claro al lado del respaldo."""
    k = _llave()
    if not k:
        print('  No encuentro LLAVE.txt: sin la llave no se puede abrir.')
        return 1
    cd = _cifrador()
    txt = io.open(ruta, encoding='utf-8').read()
    import re
    m = re.search(r'/\*RESPALDO:([^*]+)\*/(.*)$', txt, re.S)
    if not m:
        print('  Ese archivo no tiene forma de respaldo.')
        return 1
    nombre, b64 = m.group(1), m.group(2).strip()
    claro = cd.descifrar(b64, k, nombre)
    destino = ruta[:-5] + '.json' if ruta.endswith('.resp') else ruta + '.json'
    io.open(destino, 'w', encoding='utf-8').write(claro)
    print('  Listo: %s  (%.1f KB)' % (os.path.basename(destino), len(claro) / 1024))
    print('  Borralo cuando termines: tiene datos del plantel en claro.')
    return 0


def main():
    if '--abrir' in sys.argv:
        i = sys.argv.index('--abrir')
        if i + 1 >= len(sys.argv):
            print('  Falta decir que archivo abrir.')
            return 1
        return abrir(sys.argv[i + 1])

    if not (FB_URL and FB_KEY and ROBOT_MAIL and ROBOT_CLAVE):
        print('  Faltan las variables de Firebase: no hay nada que respaldar.')
        return 1

    k = _llave()
    if not k:
        print('  No encuentro LLAVE.txt. El respaldo tiene datos personales,')
        print('  asi que sin llave NO se guarda nada.')
        return 1

    print()
    print('  Entrando a la base con la cuenta del robot...')
    tok = entrar()
    if not tok:
        print('  No pude entrar. Reviso ROBOT_MAIL / ROBOT_CLAVE / FB_KEY.')
        return 1

    print('  Bajando la base entera...')
    crudo = llamar('%s/%s.json?auth=%s' % (FB_URL, RAIZ, tok))
    if crudo is None:
        print('  No pude bajar la base.')
        return 1
    if crudo.strip() in ('', 'null'):
        print('  La base vino VACIA. No guardo nada: un respaldo vacio es peor')
        print('  que no tener respaldo.')
        return 1

    # que sea JSON de verdad, y guardarlo ordenado para que dos dias iguales
    # den el mismo archivo
    try:
        arbol = json.loads(crudo)
    except Exception as e:
        print('  Lo que vino no es JSON valido: %s' % e)
        return 1
    texto = json.dumps(arbol, ensure_ascii=False, sort_keys=True,
                       separators=(',', ':'))
    tam = len(texto.encode('utf-8'))
    print('  Bajado: %.1f KB  (%d nodos arriba de todo)'
          % (tam / 1024, len(arbol) if isinstance(arbol, dict) else 0))

    # ══ EL FRENO ══════════════════════════════════════════════════════════
    os.makedirs(CARPETA, exist_ok=True)
    indice = leer_indice()
    previos = [v for _, v in sorted(indice.items())]
    if previos:
        antes = previos[-1].get('bytes') or 0
        if antes and tam < antes / 2:
            print()
            print('  ' + '=' * 64)
            print('    FRENO: el volcado de hoy pesa MENOS DE LA MITAD')
            print('  ' + '=' * 64)
            print('    anterior: %.1f KB     hoy: %.1f KB' % (antes / 1024, tam / 1024))
            print()
            print('    No guardo nada. Un respaldo que pisa al bueno con una')
            print('    base a medias deja sin red justo cuando hace falta.')
            print('    Si la base encogio a proposito, corre esto de nuevo con')
            print('    --igual-guardo.')
            print()
            if '--igual-guardo' not in sys.argv:
                return 1
            print('    (--igual-guardo: guardo igual, bajo tu responsabilidad)')

    hoy = time.strftime('%Y-%m-%d')
    nombre = 'firebase_%s.resp' % hoy
    cd = _cifrador()
    cifrado = cd.cifrar(texto, k, nombre)
    io.open(os.path.join(CARPETA, nombre), 'w', encoding='utf-8').write(
        '/*RESPALDO:%s*/%s' % (nombre, cifrado))

    indice[hoy] = {'bytes': tam, 'cuando': time.strftime('%Y-%m-%d %H:%M')}
    guardar_indice(indice)
    fuera = podar(hoy)

    print('  Guardado: respaldos/%s' % nombre)
    if fuera:
        print('  Saque %d respaldo(s) viejo(s): %s' % (len(fuera), ', '.join(fuera)))
    print('  Para abrirlo:  python RESPALDAR_FIREBASE.py --abrir respaldos/%s' % nombre)
    print()
    return 0


if __name__ == '__main__':
    sys.exit(main())
