# -*- coding: utf-8 -*-
"""
VER_CALENDARIO_VIEJO.py  ·  QUE TENIA EL CALENDARIO CADA DIA

PARA QUE SIRVE
Cuando un partido "desaparece" del calendario, esto dice CUANDO. Lee los
respaldos diarios de respaldos\\ —uno por dia— y muestra, dia por dia, que
partidos tenia el calendario y cuales se agregaron o se fueron.

QUE NO HACE
Los respaldos tienen TODA la base, con datos del plantel. Este programa abre
el respaldo en memoria y saca UNICAMENTE el calendario de partidos. No deja
el respaldo abierto en el disco, no muestra nada mas y no toca Firebase.

COMO SE USA
Doble clic en VER_CALENDARIO_VIEJO.bat. Deja el resumen en
respaldos\\CALENDARIO_POR_DIA.txt, que se puede mandar sin problema: ahi
adentro solo hay fechas y rivales.
"""

import io
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CARPETA = os.path.join(AQUI, 'respaldos')
SALIDA = os.path.join(CARPETA, 'CALENDARIO_POR_DIA.txt')


def llave():
    ruta = os.path.join(AQUI, 'LLAVE.txt')
    if not os.path.exists(ruta):
        return None
    t = io.open(ruta, encoding='utf-8').read().strip()
    return t if len(t) == 64 else None


def descifrador():
    sys.path.insert(0, AQUI)
    import cifrar_datos
    return cifrar_datos


def partidos_de(texto_json):
    """Solo el calendario. Si el respaldo no lo trae, lista vacia."""
    try:
        d = json.loads(texto_json)
    except Exception:
        return None
    cal = (d or {}).get('calendario') or {}
    ps = cal.get('partidos')
    if ps is None:
        return []
    if isinstance(ps, dict):
        ps = [ps[k] for k in ps]
    out = []
    for p in (ps or []):
        if not isinstance(p, dict):
            continue
        out.append((str(p.get('fecha') or ''),
                    str(p.get('rival') or '?'),
                    str(p.get('condicion') or p.get('cond') or '')))
    out.sort()
    return out


def clave(p):
    return p[0] + ' | ' + p[1] + ' | ' + p[2]


def main():
    k = llave()
    if not k:
        print('No encuentro LLAVE.txt al lado de este programa.')
        return 1
    if not os.path.isdir(CARPETA):
        print('No encuentro la carpeta respaldos\\.')
        return 1
    cd = descifrador()
    archivos = sorted(a for a in os.listdir(CARPETA)
                      if a.startswith('firebase_') and a.endswith('.resp'))
    if not archivos:
        print('No hay respaldos en respaldos\\.')
        return 1

    lineas = []
    def decir(s):
        lineas.append(s)
        try:
            print(s)
        except Exception:          # consolas que no muestran acentos
            print(s.encode('ascii', 'replace').decode('ascii'))

    decir('QUE TENIA EL CALENDARIO CADA DIA')
    decir('=' * 60)
    antes = None
    nombre_antes = ''
    import re
    for a in archivos:
        ruta = os.path.join(CARPETA, a)
        try:
            txt = io.open(ruta, encoding='utf-8').read()
            m = re.search(r'/\*RESPALDO:([^*]+)\*/(.*)$', txt, re.S)
            if not m:
                decir('%s  ->  no tiene forma de respaldo' % a)
                continue
            claro = cd.descifrar(m.group(2).strip(), k, m.group(1))
        except Exception as e:
            decir('%s  ->  no lo pude abrir (%s)' % (a, e.__class__.__name__))
            continue

        ps = partidos_de(claro)
        claro = None                      # que no quede dando vueltas
        dia = a.replace('firebase_', '').replace('.resp', '')
        if ps is None:
            decir('%s  ->  el respaldo no se entiende' % dia)
            continue

        decir('')
        decir('%s   %d partido(s) en el calendario' % (dia, len(ps)))
        if antes is not None:
            aa = set(clave(p) for p in antes)
            bb = set(clave(p) for p in ps)
            se_fueron = sorted(aa - bb)
            llegaron = sorted(bb - aa)
            if not se_fueron and not llegaron:
                decir('   (igual que %s)' % nombre_antes)
            for x in se_fueron:
                decir('   SE FUE    %s' % x)
            for x in llegaron:
                decir('   se agrego %s' % x)
        else:
            for p in ps:
                decir('   %s' % clave(p))
        antes = ps
        nombre_antes = dia

    decir('')
    decir('=' * 60)
    decir('Y HOY, EN EL CALENDARIO:')
    if antes is not None:
        for p in antes:
            decir('   %s' % clave(p))
    decir('')
    decir('Este archivo solo tiene fechas y rivales: se puede mandar.')

    try:
        io.open(SALIDA, 'w', encoding='utf-8').write('\n'.join(lineas) + '\n')
        print('')
        print('Resumen guardado en respaldos\\CALENDARIO_POR_DIA.txt')
    except Exception:
        print('')
        print('(no pude guardar el resumen, pero arriba esta todo)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
