# -*- coding: utf-8 -*-
"""
ARREGLAR_71.py - cambia el saque del #71 por el #7

Busca en TODAS las carpetas de .dvw que encuentre, sin importar como se
llamen. Si no encuentra nada, te dice donde busco y que si vio, para saber
si el problema es la carpeta o si ya estaba corregido.

Uso:  doble clic, o  python ARREGLAR_71.py
"""
import io, os, re, shutil

VIEJO = '71'
NUEVO = '07'


def main():
    aqui = os.path.dirname(os.path.abspath(__file__)) or '.'
    os.chdir(aqui)

    print()
    print('  ==============================================')
    print('    CAMBIAR EL SAQUE DEL #%s POR EL #%d' % (VIEJO, int(NUEVO)))
    print('  ==============================================')
    print()
    print('  Buscando en: %s' % aqui)
    print()

    # todos los .dvw, esten donde esten
    archivos = []
    for raiz, dirs, files in os.walk(aqui):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for a in files:
            if a.lower().endswith('.dvw'):
                archivos.append(os.path.join(raiz, a))

    if not archivos:
        print('  No encontre NINGUN archivo .dvw.')
        print('  Puse este script en la carpeta equivocada:')
        print('  tiene que estar al lado de HACER_TODO.bat')
        print()
        return

    print('  Encontre %d archivo(s) .dvw' % len(archivos))
    print()

    patron = re.compile(r'^([*a])' + VIEJO + r'([A-Z])', re.M)
    total = 0
    con71 = []

    for ruta in sorted(archivos):
        try:
            txt = io.open(ruta, encoding='latin-1', errors='replace').read()
        except Exception as e:
            print('  no pude abrir %s: %s' % (os.path.basename(ruta), e))
            continue

        if not patron.search(txt):
            continue

        con71.append(ruta)
        print('  %s' % os.path.relpath(ruta, aqui))
        for m in patron.finditer(txt):
            ini = txt.rfind('\n', 0, m.start()) + 1
            fin = txt.find('\n', m.start())
            print('     antes:  %s' % txt[ini:fin][:62])

        nuevo = patron.sub(lambda m: m.group(1) + NUEVO + m.group(2), txt)
        shutil.copy2(ruta, ruta + '.bak')
        io.open(ruta, 'w', encoding='latin-1', errors='replace').write(nuevo)

        n = len(patron.findall(txt))
        total += n
        print('     ahora:  %d accion(es) a nombre del #%d' % (n, int(NUEVO)))
        print('     copia:  %s.bak' % os.path.basename(ruta))
        print()

    if total:
        print('  Listo: %d accion(es) corregida(s).' % total)
        print('  Ahora corre HACER_TODO.')
    else:
        print('  Revise los %d archivos y NINGUNO tiene acciones del #%s.'
              % (len(archivos), VIEJO))
        print()
        print('  Puede ser que:')
        print('    - ya lo hayas corregido a mano en el scout, o')
        print('    - el .dvw de ese entrenamiento todavia no este exportado')
        print()
        print('  Para que pueda ayudarte, fijate si esta este archivo:')
        print('    &Pra-AXPO NAFELS-2026-09-15-M.dvw')
        print('  y decime en que carpeta lo tenes.')
    print()


if __name__ == '__main__':
    main()
    try:
        input('  Enter para cerrar...')
    except Exception:
        pass
