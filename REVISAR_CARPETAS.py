# -*- coding: utf-8 -*-
"""
REVISAR_CARPETAS.py — que archivos ve el generador, y con que nombre

POR QUE
    En Plan de Partido aparecian sesiones de mas y un rival "PRUEBA" que no
    existe. En la copia del repositorio no pasa: salen 10 entrenamientos y
    ningun PRUEBA. Asi que la diferencia esta en los archivos de esta maquina.

    Esto lista lo que hay, con el nombre de equipo que trae cada .dvw y la
    clave que le va a tocar. Con eso se ve de una cual es el que sobra.
"""
import io, os, re, glob

def slug(fn):
    b = os.path.splitext(os.path.basename(fn))[0]
    return re.sub(r'[^A-Z0-9]', '', b.upper())[:12]

def turno(fn):
    b = os.path.splitext(os.path.basename(fn))[0].upper()
    if b.endswith('-M'): return 'M'
    if b.endswith('-T'): return 'T'
    for p, t in [('MORNING','M'),('MANANA','M'),('TARDE','T'),('AFTERNOON','T')]:
        if p in b: return t
    return ''

print()
print('  ' + '=' * 70)
print('     LO QUE VE EL GENERADOR')
print('  ' + '=' * 70)

for d in sorted(glob.glob('DVW *')):
    if not os.path.isdir(d): continue
    fs = sorted(glob.glob(os.path.join(d, '*.dvw')))
    if not fs: continue
    print()
    print('  [%s]  %d archivos' % (d, len(fs)))
    claves = {}
    for f in fs:
        t = io.open(f, encoding='latin-1', errors='replace').read()
        m = re.search(r'\[3TEAMS\](.*?)\[3', t, re.S)
        tl = [l for l in m.group(1).splitlines() if l.strip()] if m else []
        h = tl[0].split(';')[1].strip() if len(tl) > 0 else '?'
        a = tl[1].split(';')[1].strip() if len(tl) > 1 else '?'
        dm = re.search(r'(20\d\d-\d\d-\d\d)', os.path.basename(f))
        k = 'E' + (dm.group(1) if dm else 'sinfecha') + '-' + slug(f)
        claves.setdefault(k, []).append(os.path.basename(f))
        aviso = '  <<< distinto' if h.upper() != a.upper() else ''
        print('     %-46s %s vs %s  [%s]%s' % (
            os.path.basename(f)[:46], h[:13], a[:13], turno(f) or '-', aviso))

    rep = {k: v for k, v in claves.items() if len(v) > 1}
    if rep:
        print()
        print('     ── CLAVES QUE SE PISAN ──')
        for k, v in rep.items():
            print('     %s' % k)
            for x in v: print('        %s' % x)

print()
print('  ' + '-' * 70)
print('  Si un archivo aparece dos veces con la misma clave, el generador le')
print('  agrega -2 y esa sesion pierde el video, porque el mapa busca la clave')
print('  original.')
print()

try: input('  Enter para cerrar...')
except Exception: pass
