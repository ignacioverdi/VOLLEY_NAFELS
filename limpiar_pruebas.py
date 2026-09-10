# -*- coding: utf-8 -*-
"""
LIMPIAR LOS EQUIPOS DE PRUEBA
==============================
Saca del sistema los equipos inventados CAMPANA y PRUEBA, SIN perder ninguna
accion scouteada.

QUE HACE, Y POR QUE

1. El .dvw del 08/09 mañana se exporto ANTES de que arreglaramos el panel, y
   por eso quedo como si fuera un partido contra un rival llamado PRUEBA:

       [3MATCH]  08/09/2026;;;;;;;;      <- sin temporada, sin fase
       [3TEAMS]  AXPO NAFELS  vs  PRUEBA

   Un entrenamiento hecho con DataVolley se ve asi:

       [3MATCH]  07/09/2026;;2026/2027;PRE-SEASON;Practice;...
       [3TEAMS]  AXPO NAFELS  vs  AXPO NAFELS

   El archivo se reescribe con ese formato. Las 427 acciones no se tocan: se
   cambian dos lineas de la cabecera y nada mas.

2. Del entrenamientos_nafels_db.json se borran los planteles CAMPANA y
   PRUEBA, que son basura que quedo de las pruebas.

3. Se borra la entrada del 08/09 del registro para que HACER_TODO la vuelva
   a procesar desde el .dvw ya corregido.

Despues de correr esto hay que hacer HACER_TODO.
"""
import io, os, re, json, shutil, sys

RAIZ = sys.argv[1] if len(sys.argv) > 1 else '.'
DVW  = os.path.join(RAIZ, 'DVW ENTRENAMIENTOS NAFELS 2026',
                    '&2026-09-08 AXP-ENTRENAMIENTO MORNING.dvw')
DB   = os.path.join(RAIZ, 'entrenamientos_nafels_db.json')

FALSOS = ('PRUEBA', 'CAMPANA')


def temporada(fecha_ddmmyyyy):
    """La temporada va de agosto a julio, como el calendario real."""
    try:
        d, m, y = fecha_ddmmyyyy.split('/')
        y, m = int(y), int(m)
        ini = y if m >= 8 else y - 1
        return '%d/%d' % (ini, ini + 1)
    except Exception:
        return ''


def hexSQ(t):
    """El texto en hexadecimal con el prefijo que usa DataVolley."""
    if not t:
        return '\x0f2'
    return '\x0f2' + ''.join('%02X' % ord(ch) for ch in t)


def arreglar_dvw(path):
    if not os.path.exists(path):
        print('  [dvw] no encontre %s' % path)
        return False
    shutil.copy2(path, path + '.bak')          # por las dudas, siempre
    t = io.open(path, encoding='latin-1', errors='replace').read()
    antes = t

    # ── [3MATCH]: marcarlo como practica de pretemporada ──
    m = re.search(r'(\[3MATCH\]\r?\n)([^\r\n]*)', t)
    if m:
        col = m.group(2).split(';')
        while len(col) < 16:
            col.append('')
        fecha = col[0]
        col[2]  = col[2] or temporada(fecha)
        col[3]  = col[3] or 'PRE-SEASON'
        col[4]  = col[4] or 'Practice'
        col[11] = '1'                          # es entrenamiento
        col[12] = hexSQ(col[3])
        col[13] = hexSQ(col[4])
        t = t[:m.start(2)] + ';'.join(col) + t[m.end(2):]

    # ── [3TEAMS]: el visitante pasa a ser el mismo club ──
    m = re.search(r'(\[3TEAMS\]\r?\n)([^\r\n]*)(\r?\n)([^\r\n]*)', t)
    if m:
        local = m.group(2).split(';')
        vis   = m.group(4).split(';')
        if len(local) > 1 and len(vis) > 1 and vis[1].strip().upper() in FALSOS:
            vis[0] = local[0]                  # mismo codigo
            vis[1] = local[1]                  # mismo nombre
            if len(vis) > 6 and len(local) > 6:
                vis[6] = local[6]              # el nombre en hexadecimal
            t = t[:m.start(4)] + ';'.join(vis) + t[m.end(4):]

    if t == antes:
        print('  [dvw] ya estaba bien, no toque nada')
        return False
    io.open(path, 'w', encoding='latin-1', errors='replace').write(t)
    print('  [dvw] corregido (copia previa en .bak)')
    return True


def limpiar_db(path):
    if not os.path.exists(path):
        print('  [db] no encontre %s' % path)
        return
    shutil.copy2(path, path + '.bak')
    d = json.load(io.open(path, encoding='utf-8'))

    eq = d.get('teams') or {}
    sacados = [k for k in list(eq.keys()) if k.strip().upper() in FALSOS]
    for k in sacados:
        del eq[k]
    print('  [db] planteles borrados: %s' % (', '.join(sacados) or 'ninguno'))

    # el 08/09 mañana se saca del registro para que se reprocese del .dvw
    juegos = d.get('games') or []
    antes = len(juegos)
    d['games'] = [g for g in juegos
                  if 'ENTRENAMIENTO MORNING' not in (g.get('file') or '')]
    print('  [db] entradas reprocesables: %d' % (antes - len(d['games'])))

    json.dump(d, io.open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('  [db] guardado (copia previa en .bak)')


if __name__ == '__main__':
    print('  LIMPIEZA DE EQUIPOS DE PRUEBA')
    print()
    arreglar_dvw(DVW)
    limpiar_db(DB)
    print()
    print('  Listo. Ahora corre HACER_TODO y publica.')
