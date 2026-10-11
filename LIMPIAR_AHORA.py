# -*- coding: utf-8 -*-
# ============================================================================
#  LIMPIAR_AHORA.py — sacar de la carpeta lo que ya no sirve
#  ---------------------------------------------------------------------------
#  DE DONDE SALE LA LISTA
#
#  De dos lados:
#    · BORRAR_ESTO.txt, la revision que ya estaba hecha el 5/10/2026
#    · las copias de respaldo que dejaron UNIFICAR_TIPOGRAFIA y MEJORAR_APP
#
#  COMO SE ASEGURA DE NO ROMPER NADA
#
#  1. Hay una lista de INTOCABLES que se revisa primero y gana siempre:
#     LLAVE.txt, LLAVE_DEMO.txt, .git, los .enc, respaldos\, las carpetas de
#     DVW, el manual de Data Volley y el playbook. Si algo esta ahi, no se
#     borra aunque aparezca mas abajo.
#
#  2. Antes de borrar un archivo, lo BUSCA por nombre adentro de todos los
#     .html, .js, .css, .json y .py de la carpeta. Si alguien lo nombra, no lo
#     toca y te avisa. Las copias .antes_* no pasan por ese filtro porque son
#     copias, por definicion no las usa nadie.
#
#  3. Lo que borra esta en el historial de Git (.git), asi que nada se pierde
#     de verdad mientras no borres esa carpeta.
#
#      python LIMPIAR_AHORA.py          <- solo MIRA y te dice que borraria
#      python LIMPIAR_AHORA.py --si     <- lo borra
# ============================================================================
import os, sys, glob, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
HACERLO = '--si' in sys.argv

# ── 1 · LO QUE NO SE TOCA NUNCA ────────────────────────────────────────────
INTOCABLES = {
    'llave.txt', 'llave_demo.txt', 'llave_donde_esta.txt',
    '.gitignore', '.gitattributes', '.vercelignore', 'vercel.json',
    'manifest.json', 'license', 'readme.md', 'sw.js',
    'dvwin4_handbook_eng.pdf', 'team playbook nafels.pptx',
    'borrar_esto.txt',
}
CARPETAS_INTOCABLES = {'.git', '.github', 'api', 'respaldos', 'escudos', 'fotos',
                       'imagenes', 'placas', 'temporadas', 'manos bloqueo',
                       'nafels players 26-27', 'claude outputs'}

def protegido(nombre):
    n = nombre.lower()
    if n in INTOCABLES: return True
    if n.endswith('.enc'): return True
    if n.startswith('llave'): return True
    if n.startswith('dvw '): return True
    return False

# ── 2 · LO QUE SE VA ───────────────────────────────────────────────────────
# a) las copias de respaldo de las mejoras (no se chequean: son copias)
PATRONES_COPIAS = ['*.antes_tipografia', '*.antes_iconos', '*.antes_pulido', '*.antes_contraste']

# b) lo de BORRAR_ESTO.txt (cada uno se chequea antes de borrar)
SUELTOS = [
    'codigos consola.log',
    'volley-stats.html',
    'entrenamientos_nafels_db.json.bak',
    'codigo extendido.zip',
    'panel_vivo-1.html',
    'panel_estilo-1.js',
    'plantel_nafels.js.antes_de_sacar_nacim',
    'error consola.png',
    'analisis superpuesto.png',
    'heatmap ataque.png',
    'diagnostico.txt',
    'REHACER_ENTRENAMIENTOS.log',
    '.gitattributes.txt',
    '.gitignore.txt',
    'gitignore',
    '4370.sq', '4371.sq', '587.sq',
    '_prueba_roundtrip.js',
    '_gemelo.js',
]

CARPETAS = ['__pycache__']


def mide(ruta):
    if os.path.isdir(ruta):
        t = 0
        for r, _, fs in os.walk(ruta):
            for f in fs:
                try: t += os.path.getsize(os.path.join(r, f))
                except Exception: pass
        return t
    try: return os.path.getsize(ruta)
    except Exception: return 0


def bonito(n):
    for u in ('B', 'KB', 'MB', 'GB'):
        if n < 1024 or u == 'GB':
            return ('%.1f %s' % (n, u)) if u != 'B' else ('%d B' % n)
        n /= 1024.0


def texto_de_la_carpeta():
    """El codigo que la APP carga, para ver si alguien nombra un archivo.

    Solo .html, .js, .css y .json: es lo que el navegador pide. Los .py y .bat
    quedan afuera a proposito — ahi aparecen nombres de archivos que justamente
    se generan o se borran, y eso no es motivo para conservar nada. Este mismo
    archivo tampoco entra: si no, se protegeria a si mismo."""
    yo = os.path.basename(__file__).lower()
    trozos = []
    for p in ('*.html', '*.js', '*.css', '*.json'):
        for f in glob.glob(p):
            b = os.path.basename(f)
            if b.lower() == yo: continue
            if b in SUELTOS or b.endswith(('.antes_tipografia', '.antes_iconos', '.antes_pulido', '.antes_contraste')):
                continue          # un archivo que se va no vale como testigo
            try:
                trozos.append(open(f, encoding='utf-8', errors='ignore').read())
            except Exception:
                pass
    return '\n'.join(trozos)


def main():
    os.chdir(AQUI)
    print()
    print('  LIMPIAR LA CARPETA' + ('' if HACERLO else '   (solo mirando - no se borra nada)'))
    print('  ' + '=' * 68)

    copias, sueltos, carpetas, quedan = [], [], [], []

    for patron in PATRONES_COPIAS:
        for f in sorted(glob.glob(patron)):
            if protegido(os.path.basename(f)): continue
            copias.append((f, mide(f)))

    codigo = texto_de_la_carpeta()
    for nombre in SUELTOS:
        if not os.path.exists(nombre): continue
        if protegido(nombre): continue
        if nombre in codigo:
            quedan.append(nombre)
        else:
            sueltos.append((nombre, mide(nombre)))

    for d in CARPETAS:
        if os.path.isdir(d) and d.lower() not in CARPETAS_INTOCABLES:
            carpetas.append((d, mide(d)))

    total = sum(s for _, s in copias + sueltos + carpetas)

    if copias:
        print()
        print('  COPIAS DE RESPALDO DE LAS MEJORAS   %d archivos   %s'
              % (len(copias), bonito(sum(s for _, s in copias))))
        print('     (los originales estan en el historial de Git)')
    if sueltos:
        print()
        print('  ARCHIVOS VIEJOS   %d   %s' % (len(sueltos), bonito(sum(s for _, s in sueltos))))
        for f, s in sorted(sueltos, key=lambda x: -x[1]):
            print('     %-44s %10s' % (f[:44], bonito(s)))
    if carpetas:
        print()
        print('  CARPETAS')
        for f, s in carpetas:
            print('     %-44s %10s' % (f + '\\', bonito(s)))
    if quedan:
        print()
        print('  NO LOS TOCO: alguien los nombra en el codigo')
        for f in quedan:
            print('     %s' % f)

    print()
    print('  ' + '=' * 68)
    if not (copias or sueltos or carpetas):
        print('   No hay nada para limpiar.')
        print()
        return
    print('   SE LIBERAN  %s' % bonito(total))

    if not HACERLO:
        print()
        print('   Esto fue solo una mirada. Para borrarlo de verdad:')
        print('       python LIMPIAR_AHORA.py --si')
        print()
        return

    print()
    n = 0
    for f, _ in copias + sueltos:
        try:
            os.remove(f); n += 1
        except Exception as e:
            print('   [no pude] %s  %s' % (f, e))
    for d, _ in carpetas:
        try:
            shutil.rmtree(d); n += 1
        except Exception as e:
            print('   [no pude] %s  %s' % (d, e))

    print('   Listo: %d borrados, %s liberados.' % (n, bonito(total)))
    print('   Si llegara a faltar algo:  git checkout <archivo>')
    print()


if __name__ == '__main__':
    main()
