# -*- coding: utf-8 -*-
"""
ARREGLAR_ENTRENAMIENTOS.py — el rival de los entrenamientos pasa a ser el club

QUE PASABA
    En los entrenamientos el panel pedia un nombre de rival igual. Segun quien
    lo cargara quedaba 'ENTRENAMIENTO', 'PRUEBA' o cualquier cosa, y ese nombre
    se arrastraba al .dvw, a las tablas y a los cortes de video: aparecian
    equipos que no existen.

QUE HACE
    Busca los .dvw de las carpetas de entrenamiento y pone el nombre del club
    en los DOS lados. Deja una copia .bak de cada archivo que toca.

COMO SE USA
    Al lado de HACER_TODO.bat, doble clic o:
        python ARREGLAR_ENTRENAMIENTOS.py
    Despues corre HACER_TODO para que se regeneren los datos.
"""
import io, os, re, glob, shutil


def club():
    """El nombre del club TAL CUAL figura en los .dvw.

    ══ POR QUE NO SE USA config_club ═════════════════════════════════════════
    config_club devuelve el nombre legal —"Biogas Volley Nafels"— y en los
    .dvw el equipo se llama "AXPO NAFELS". Si se pisa con el legal, los
    entrenamientos dejan de coincidir con los partidos y el sistema los toma
    como dos clubes distintos.

    Se usa el nombre que mas aparece como LOCAL en los entrenamientos, que es
    el que el scout viene escribiendo.
    """
    cuenta = {}
    for d in glob.glob('DVW *'):
        if not os.path.isdir(d) or 'ENTREN' not in d.upper():
            continue
        for ruta in glob.glob(os.path.join(d, '*.dvw')):
            try:
                t = io.open(ruta, encoding='latin-1', errors='replace').read()
            except Exception:
                continue
            m = re.search(r'\[3TEAMS\]\s*\n([^\n]*)', t)
            if not m:
                continue
            c = m.group(1).split(';')
            if len(c) > 1 and c[1].strip():
                n = c[1].strip()
                cuenta[n] = cuenta.get(n, 0) + 1
    if cuenta:
        return max(cuenta, key=cuenta.get)
    return ''


def main():
    print()
    print('  ' + '=' * 62)
    print('     EL RIVAL DE LOS ENTRENAMIENTOS = EL CLUB')
    print('  ' + '=' * 62)
    print()

    nombre = club()
    if not nombre:
        print('  No pude averiguar el nombre del club.')
        print('  Reviso config_club.py y las carpetas DVW.')
        print()
        return

    print('  Club: %s' % nombre)
    print()

    carpetas = [d for d in glob.glob('DVW *')
                if os.path.isdir(d) and 'ENTREN' in d.upper()]
    if not carpetas:
        print('  No encontre carpetas de entrenamiento.')
        print()
        return

    tocados = 0
    for c in carpetas:
        for ruta in sorted(glob.glob(os.path.join(c, '*.dvw'))):
            txt = io.open(ruta, encoding='latin-1', errors='replace').read()

            m = re.search(r'(\[3TEAMS\]\s*\n)([^\n]*)\n([^\n]*)', txt)
            if not m:
                continue

            loc = m.group(2).split(';')
            vis = m.group(3).split(';')
            if len(loc) < 2 or len(vis) < 2:
                continue

            actual = vis[1].strip()
            if actual.upper() == nombre.upper():
                continue          # ya esta bien

            print('  %s' % os.path.basename(ruta)[:52])
            print('     rival: "%s"  ->  "%s"' % (actual[:30], nombre))

            vis[1] = nombre
            nuevo = txt[:m.start(3)] + ';'.join(vis) + txt[m.end(3):]

            shutil.copy2(ruta, ruta + '.bak')
            io.open(ruta, 'w', encoding='latin-1', errors='replace').write(nuevo)
            tocados += 1

    print()
    if tocados:
        print('  Listo: %d entrenamiento(s) corregido(s).' % tocados)
        print('  Cada uno tiene su copia .bak por las dudas.')
        print('  Ahora corre HACER_TODO.')
    else:
        print('  Todos los entrenamientos ya tenian el nombre correcto.')
    print()


if __name__ == '__main__':
    main()
    try:
        input('  Enter para cerrar...')
    except Exception:
        pass
