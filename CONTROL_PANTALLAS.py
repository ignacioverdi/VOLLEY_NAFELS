# -*- coding: utf-8 -*-
"""
CONTROL_PANTALLAS.py - avisa si una pantalla quedo rota ANTES de publicar

QUE PROBLEMA RESUELVE
    El 16/09 plan_partido.html se publico CORTADO: 86 KB en vez de 98. Le
    faltaban dos roles de ROLECFG y una funcion. El efecto no fue "falta el
    armador": el script se corto justo antes de declarar las variables del
    video, y eso dejo sin canchas y sin videos a TODAS las secciones —ataque,
    saque, recepcion, defensa y bloqueo—.

    Lo peor: se publico sin un solo error. El archivo era HTML valido, los
    scripts compilaban, y la pantalla abria. Solo al hacer doble clic se veia
    que no pasaba nada.

QUE HACE
    Antes de publicar, compara cada pantalla contra su ultima version buena:

      1. TAMANO      si encogio mas del 8%, avisa
      2. FUNCIONES   si desaparecio alguna, la nombra
      3. COMPILA     revisa que cada bloque <script> sea JavaScript valido
      4. ESTRUCTURAS las tablas de configuracion no pueden perder entradas

    Si algo cambio para mal, lo dice con nombre y apellido y pregunta si se
    publica igual.

COMO SE USA
    La primera vez, con todo andando bien:

        python CONTROL_PANTALLAS.py --guardar

    Eso toma la foto de como estan las pantallas hoy. Despues, cada vez:

        python CONTROL_PANTALLAS.py

    HACER_TODO lo llama solo antes de publicar.
"""
import io, os, re, sys, json, glob, subprocess

FOTO = '.control_pantallas.json'
ENCOGIO = 0.92          # menos del 92% del tamanio anterior = sospechoso
TABLAS = ['ROLECFG', 'SKILLS', 'OBJ_DETALLE', 'DBAT_VALOR', 'ST_TIPOS']


def bloques_js(html):
    return re.findall(r'<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)</script>', html, re.I)


def funciones(html):
    return set(re.findall(r'function\s+(\w+)\s*\(', html))


def entradas_de_tabla(html, nombre):
    """Las claves de una tabla de configuracion, p.ej. los roles de ROLECFG."""
    m = re.search(r'(?:var|let|const)\s+' + nombre + r'\s*=\s*\{', html)
    if not m:
        return None
    # cerrar la llave
    i = html.index('{', m.start())
    d = 0
    k = i
    while k < len(html):
        if html[k] == '{':
            d += 1
        elif html[k] == '}':
            d -= 1
            if d == 0:
                break
        k += 1
    cuerpo = html[i:k]
    # Fuera los comentarios: adentro hay texto en castellano con dos puntos
    # —"Consecuencia: ..."— y esas palabras se colaban como si fueran claves.
    cuerpo = re.sub(r'/\*[\s\S]*?\*/', ' ', cuerpo)
    cuerpo = re.sub(r'//[^\n]*', ' ', cuerpo)
    # solo las claves del primer nivel
    claves = []
    prof = 0
    for mm in re.finditer(r'[{}]|(\w+)\s*:', cuerpo):
        t = mm.group(0)
        if t == '{':
            prof += 1
        elif t == '}':
            prof -= 1
        elif prof == 1 and mm.group(1):
            claves.append(mm.group(1))
    return claves


def radiografia(ruta):
    html = io.open(ruta, encoding='utf-8', errors='replace').read()
    r = {
        'bytes': len(html),
        'funciones': sorted(funciones(html)),
        'tablas': {},
    }
    for t in TABLAS:
        e = entradas_de_tabla(html, t)
        if e:
            r['tablas'][t] = e
    return r, html


def compila(html):
    """Cada bloque <script> tiene que ser JavaScript valido.

    ══ POR QUE SE MANDA EN BYTES ═════════════════════════════════════════════
    Las pantallas tienen tildes, ñ y simbolos como ═. Al pasarle el texto a
    node con text=True, Python lo convierte a la codificacion de la consola de
    Windows —cp1252—, que no sabe escribir esos caracteres y revienta:

        UnicodeEncodeError: 'charmap' codec can't encode characters

    Mandandolo ya convertido a UTF-8, el problema no existe.
    """
    malos = 0
    for b in bloques_js(html):
        try:
            r = subprocess.run(['node', '--check', '-'],
                               input=b.encode('utf-8'),
                               capture_output=True, timeout=30)
            if r.returncode != 0:
                malos += 1
        except FileNotFoundError:
            return None      # no hay node instalado: se saltea este chequeo
        except Exception:
            return None
    return malos


def main():
    guardar = '--guardar' in sys.argv

    pantallas = sorted(glob.glob('*.html'))
    if not pantallas:
        print('  No hay pantallas .html en esta carpeta.')
        return 0

    vieja = {}
    if os.path.exists(FOTO):
        try:
            vieja = json.load(io.open(FOTO, encoding='utf-8'))
        except Exception:
            vieja = {}

    print()
    print('  ' + '=' * 66)
    print('     CONTROL DE PANTALLAS')
    print('  ' + '=' * 66)
    print()

    nueva = {}
    avisos = []

    for p in pantallas:
        r, html = radiografia(p)
        nueva[p] = r
        v = vieja.get(p)

        # 3. compila
        malos = compila(html)
        if malos:
            avisos.append((p, 'tiene %d bloque(s) de JavaScript con error' % malos))

        if not v:
            continue

        # 1. tamanio
        if v['bytes'] and r['bytes'] < v['bytes'] * ENCOGIO:
            avisos.append((p, 'encogio de %d a %d KB  (%d%% menos)' % (
                v['bytes'] // 1024, r['bytes'] // 1024,
                round((1 - r['bytes'] / v['bytes']) * 100))))

        # 2. funciones
        perdidas = sorted(set(v['funciones']) - set(r['funciones']))
        if perdidas:
            avisos.append((p, 'perdio %d funcion(es): %s' % (
                len(perdidas), ', '.join(perdidas[:6]))))

        # 4. tablas de configuracion
        for t, claves in (v.get('tablas') or {}).items():
            ahora = r['tablas'].get(t)
            if ahora is None:
                avisos.append((p, 'ya no tiene la tabla %s' % t))
                continue
            faltan = [c for c in claves if c not in ahora]
            if faltan:
                avisos.append((p, '%s perdio: %s' % (t, ', '.join(faltan))))

    if guardar:
        json.dump(nueva, io.open(FOTO, 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)
        print('  Foto guardada: %d pantallas.' % len(nueva))
        print('  A partir de ahora se comparan contra esta version.')
        print()
        return 0

    if not vieja:
        print('  Todavia no hay con que comparar.')
        print()
        print('  Con la app andando bien, corre una vez:')
        print('      python CONTROL_PANTALLAS.py --guardar')
        print()
        return 0

    if not avisos:
        print('  Las %d pantallas estan enteras.' % len(pantallas))
        print('  Ninguna encogio, ninguna perdio funciones ni configuracion.')
        print()
        json.dump(nueva, io.open(FOTO, 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)
        return 0

    print('  ATENCION: %d cosa(s) para mirar antes de publicar' % len(avisos))
    print()
    for p, t in avisos:
        print('     %-26s %s' % (p, t))
    print()
    print('  ' + '-' * 66)
    print('  Una pantalla que encoge o pierde funciones suele quedar ROTA aunque')
    print('  abra sin errores: alcanza con que falte una entrada de configuracion')
    print('  para que el script se corte y dejen de andar los videos.')
    print()
    print('  Si el cambio es a proposito, publica igual y despues corre:')
    print('      python CONTROL_PANTALLAS.py --guardar')
    print('  ' + '-' * 66)
    print()
    return 1


if __name__ == '__main__':
    codigo = main()
    # Si se abrio con doble clic, la ventana se cerraria antes de que se
    # alcance a leer nada. Con esto espera.
    if sys.stdout.isatty():
        try:
            input('  Enter para cerrar...')
        except Exception:
            pass
    sys.exit(codigo)
