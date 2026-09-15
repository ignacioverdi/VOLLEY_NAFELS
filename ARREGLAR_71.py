# -*- coding: utf-8 -*-
"""
ARREGLAR_71.py — cambia el saque del #71 por el #7

QUE PASO
    El 15/09 el asistente tipeo 71 donde queria poner 7. En DataVolley el
    numero de camiseta son DOS digitos, asi que "71" es un jugador que no
    existe: aparece en las tablas como un numero fantasma y ese saque no se
    le suma a nadie.

QUE HACE
    Busca la linea  *71SM!  en el .dvw del entrenamiento y la deja como
    *07SM!  — que es como se escribe el 7 en formato de dos digitos.

    Toca UNA sola linea. Antes deja una copia con .bak por si acaso.

COMO SE USA
    Ponelo en la carpeta del sistema (al lado de HACER_TODO.bat) y hace
    doble clic, o desde la consola:

        python ARREGLAR_71.py

    Despues corre HACER_TODO para que los datos se regeneren.
"""
import io, os, glob, re, shutil

VIEJO = '71'
NUEVO = '07'
CARPETAS = ['DVW ENTRENAMIENTOS NAFELS 2026', 'DVW NAFELS 2026',
            'DVW HIGH SET NAFELS 2026']


def main():
    print()
    print('  ==============================================')
    print('    CAMBIAR EL SAQUE DEL #%s POR EL #%s' % (VIEJO, str(int(NUEVO))))
    print('  ==============================================')
    print()

    total = 0
    for carpeta in CARPETAS:
        if not os.path.isdir(carpeta):
            continue
        for ruta in sorted(glob.glob(os.path.join(carpeta, '*.dvw'))):
            txt = io.open(ruta, encoding='latin-1', errors='replace').read()

            # Solo las lineas que EMPIEZAN con el numero, para no tocar un 71
            # que aparezca en el medio de otro dato.
            patron = re.compile(r'^([*a])' + VIEJO + r'([A-Z])', re.M)
            encontradas = patron.findall(txt)
            if not encontradas:
                continue

            print('  %s' % os.path.basename(ruta))
            for m in patron.finditer(txt):
                ini = txt.rfind('\n', 0, m.start()) + 1
                fin = txt.find('\n', m.start())
                print('     antes:  %s' % txt[ini:fin][:60])

            nuevo = patron.sub(lambda m: m.group(1) + NUEVO + m.group(2), txt)

            for m in re.finditer(r'^([*a])' + NUEVO + r'[A-Z][^\n]*', nuevo, re.M):
                pass

            shutil.copy2(ruta, ruta + '.bak')
            io.open(ruta, 'w', encoding='latin-1', errors='replace').write(nuevo)

            for m in patron.finditer(nuevo):
                pass
            print('     ahora:  el saque quedo a nombre del #%s' % str(int(NUEVO)))
            print('     copia:  %s.bak' % os.path.basename(ruta))
            total += len(encontradas)
            print()

    if total:
        print('  Listo: %d accion(es) corregida(s).' % total)
        print('  Ahora corre HACER_TODO para que se actualicen los datos.')
    else:
        print('  No encontre ninguna accion del #%s.' % VIEJO)
        print('  Puede que ya este corregido.')
    print()


if __name__ == '__main__':
    main()
    try:
        input('  Enter para cerrar...')
    except Exception:
        pass
