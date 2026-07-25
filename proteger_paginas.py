# -*- coding: utf-8 -*-
# ============================================================================
#  proteger_paginas.py — enseña a las paginas a abrir los datos cifrados
#
#  Cambia en cada pagina las lineas que cargan los datos, para que carguen la
#  version cifrada y la abran antes de arrancar. Para el resto del codigo no
#  cambia nada: window.PP_DATA y compania quedan igual que siempre.
#
#  Correlo DESPUES de CIFRAR_DATOS.bat, en la misma carpeta.
#  Uso:  python proteger_paginas.py
# ============================================================================
import os, re, sys, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
LOADER = 'datos_seguros.js'

def main():
    carpeta = AQUI
    FUERA = {'.git', '__pycache__', 'node_modules', '_respaldo', 'fotos', 'escudos', 'imagenes'}
    cifrados_por_carpeta = {}
    paginas = []
    for raiz, dirs, archivos in os.walk(carpeta):
        dirs[:] = [d for d in dirs if d.lower() not in FUERA and not d.lower().startswith('dvw ')]
        enc = {a[:-4] for a in archivos if a.endswith('.enc')}
        if enc: cifrados_por_carpeta[raiz] = enc
        for a in archivos:
            if a.lower().endswith('.html'): paginas.append(os.path.join(raiz, a))
    cifrados = set()
    for v in cifrados_por_carpeta.values(): cifrados |= v
    if not cifrados:
        print('\n  No encuentro archivos cifrados.')
        print('  Corré primero CIFRAR_DATOS.bat\n')
        input('  Enter para cerrar...'); return
    if not os.path.exists(os.path.join(carpeta, LOADER)):
        print('\n  Falta ' + LOADER + ' en esta carpeta.\n')
        input('  Enter para cerrar...'); return

    print('\n  Archivos protegidos: %d' % len(cifrados))
    print('  Reviso las paginas...\n')

    # <script src="datos_equipo.js?v=3" onerror="..."></script>
    patron = re.compile(r'<script([^>]*?)src="([^"?]+)(\?[^"]*)?"([^>]*)>\s*</script>', re.I)

    tocadas = respaldo = 0
    for ruta in sorted(paginas):
        archivo = os.path.relpath(ruta, carpeta)
        aqui = cifrados_por_carpeta.get(os.path.dirname(ruta), set())
        try:
            html = open(ruta, encoding='utf-8').read()
        except Exception:
            continue
        if 'abrirDatos()' in html:          # ya estaba protegida
            continue

        usados = []
        def cambiar(m):
            antes, src, query, despues = m.group(1), m.group(2), m.group(3) or '', m.group(4)
            if src in aqui:
                usados.append(src)
                return '<script%ssrc="%s.enc%s"%s></script>' % (antes, src, query, despues)
            return m.group(0)

        nuevo = patron.sub(cambiar, html)
        if not usados:
            continue

        # el lector va antes del primer dato, y la apertura despues del ultimo
        primer = nuevo.find('.enc"')
        ini = nuevo.rfind('<script', 0, primer)
        prof = os.path.relpath(carpeta, os.path.dirname(ruta)).replace('\\', '/')
        ruta_loader = LOADER if prof == '.' else (prof + '/' + LOADER)
        nuevo = nuevo[:ini] + '<script src="%s"></script>\n  ' % ruta_loader + nuevo[ini:]

        ultimo = nuevo.rfind('.enc"')
        fin = nuevo.find('</script>', ultimo) + len('</script>')
        nuevo = nuevo[:fin] + '\n  <script>abrirDatos();</script>' + nuevo[fin:]

        # respaldo antes de tocar
        resp = ruta + '.antes'
        if not os.path.exists(resp):
            shutil.copy2(ruta, resp); respaldo += 1
        open(ruta, 'w', encoding='utf-8').write(nuevo)
        tocadas += 1
        print('    %-32s %d archivos de datos' % (archivo, len(set(usados))))

    print('\n  Paginas preparadas: %d' % tocadas)
    if respaldo:
        print('  (guarde una copia de cada una con .antes, por las dudas)')
    print()
    input('  Enter para cerrar...')

if __name__ == '__main__':
    main()
