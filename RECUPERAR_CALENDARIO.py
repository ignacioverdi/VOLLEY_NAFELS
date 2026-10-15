# -*- coding: utf-8 -*-
"""
RECUPERAR_CALENDARIO.py  ·  SACAR EL CALENDARIO DE LOS RESPALDOS

QUE HACE
Lee los respaldos diarios de respaldos\\ y arma un archivo chico,
calendario_respaldo.js, con TODOS los partidos que alguna vez estuvieron en
el calendario: con la hora, el lugar y el mapa que tenian. De cada partido
toma la version MAS NUEVA, que es la ultima que se corrigio a mano.

DESPUES
Se publica y, en la pantalla de calendario, el boton "Recuperar del
respaldo" compara con lo que hay hoy, muestra lo que falta y lo vuelve a
poner. La escritura la hace la app con TU sesion: aca no hay ninguna clave
de Firebase, y no hace falta.

QUE NO HACE
  · No toca Firebase ni el calendario. Solo escribe ese archivo.
  · Del respaldo abre UNICAMENTE el calendario de partidos. Nada del
    plantel se abre, se muestra ni se guarda.
  · No deja el respaldo descifrado en el disco.
"""

import io
import json
import os
import re
import sys
import datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
CARPETA = os.path.join(AQUI, 'respaldos')
SALIDA = os.path.join(AQUI, 'calendario_respaldo.js')


def llave():
    ruta = os.path.join(AQUI, 'LLAVE.txt')
    if not os.path.exists(ruta):
        return None
    t = io.open(ruta, encoding='utf-8').read().strip()
    return t if len(t) == 64 else None


def lista(ps):
    if ps is None:
        return []
    if isinstance(ps, dict):
        ps = [ps[k] for k in ps]
    return [p for p in (ps or []) if isinstance(p, dict)]


def clave(p):
    return '%s|%s|%s' % (str(p.get('fecha') or ''),
                         str(p.get('rival') or ''),
                         str(p.get('condicion') or p.get('cond') or ''))


def como_se_ve(p):
    h = str(p.get('hora') or '').strip()
    l = str(p.get('lugar') or '').strip()
    s = '%s %s  %s (%s)' % (str(p.get('fecha') or '?'),
                            (h if h else '  :  '),
                            str(p.get('rival') or '?'),
                            str(p.get('condicion') or p.get('cond') or ''))
    if l:
        s += '  ·  ' + l
    if p.get('mapa'):
        s += '  [con mapa]'
    return s


def decir(s):
    try:
        print(s)
    except Exception:
        print(s.encode('ascii', 'replace').decode('ascii'))


def main():
    print()
    k = llave()
    if not k:
        decir('  No encuentro LLAVE.txt al lado de este programa.')
        return 1
    if not os.path.isdir(CARPETA):
        decir('  No encuentro la carpeta respaldos\\.')
        return 1

    sys.path.insert(0, AQUI)
    try:
        import cifrar_datos as cd
    except Exception as e:
        decir('  No pude cargar cifrar_datos.py (%s).' % e.__class__.__name__)
        return 1

    archivos = sorted((a for a in os.listdir(CARPETA)
                       if a.startswith('firebase_') and a.endswith('.resp')),
                      reverse=True)
    if not archivos:
        decir('  No hay respaldos en respaldos\\.')
        return 1

    encontrados = {}       # clave -> (partido, dia del respaldo)
    leidos = 0
    for a in archivos:
        ruta = os.path.join(CARPETA, a)
        try:
            txt = io.open(ruta, encoding='utf-8').read()
            m = re.search(r'/\*RESPALDO:([^*]+)\*/(.*)$', txt, re.S)
            if not m:
                continue
            claro = cd.descifrar(m.group(2).strip(), k, m.group(1))
            arbol = json.loads(claro)
            claro = None
        except Exception:
            decir('  %s  ->  no lo pude abrir, lo salteo' % a)
            continue
        leidos += 1
        dia = a.replace('firebase_', '').replace('.resp', '')
        for p in lista(((arbol or {}).get('calendario') or {}).get('partidos')):
            c = clave(p)
            if c in encontrados:
                continue            # ya lo tome de un respaldo mas nuevo
            encontrados[c] = (p, dia)
        arbol = None

    if not leidos:
        decir('  No pude abrir ningun respaldo. Reviso LLAVE.txt.')
        return 1

    partidos = [p for p, _d in encontrados.values()]
    partidos.sort(key=lambda x: str(x.get('fecha') or ''))

    decir('  Mire %d respaldo(s), del %s al %s.'
          % (leidos, archivos[-1][9:19], archivos[0][9:19]))
    decir('  Encontre %d partido(s) distintos en total.' % len(partidos))
    decir('')
    hoy = datetime.date.today().isoformat()
    porvenir = [p for p in partidos if str(p.get('fecha') or '') >= hoy]
    decir('  De esos, %d son de hoy en adelante:' % len(porvenir))
    for p in porvenir:
        decir('    %s     (del respaldo del %s)' % (como_se_ve(p), encontrados[clave(p)][1]))

    datos = {'generado': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
             'desde': archivos[-1][9:19], 'hasta': archivos[0][9:19],
             'partidos': partidos}
    cabeza = (u'/* calendario_respaldo.js\n'
              u'   Lo arma RECUPERAR_CALENDARIO.py con los respaldos diarios.\n'
              u'   Son SOLO partidos del calendario: fecha, hora, rival, condicion,\n'
              u'   lugar y mapa. Nada del plantel.\n'
              u'   Lo usa el boton "Recuperar del respaldo" de calendario.html. */\n')
    io.open(SALIDA, 'w', encoding='utf-8').write(
        cabeza + 'window.CAL_RESPALDO = ' +
        json.dumps(datos, ensure_ascii=False, separators=(',', ':')) + ';\n')

    decir('')
    decir('  Listo: calendario_respaldo.js  (%.1f KB)' % (os.path.getsize(SALIDA) / 1024.0))
    decir('')
    decir('  AHORA:')
    decir('   1. Publica (PUBLICAR_EN_GITHUB.bat).')
    decir('   2. Abri el calendario en la app.')
    decir('   3. Apreta "Recuperar del respaldo": te muestra que falta')
    decir('      y lo vuelve a poner, sin borrar nada.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
