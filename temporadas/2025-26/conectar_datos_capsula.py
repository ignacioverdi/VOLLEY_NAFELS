"""
===============================================================================
  conectar_datos_capsula.py — QUE CADA PANTALLA PIDA LO QUE USA
-------------------------------------------------------------------------------
  Doble clic. Se corre DENTRO de la carpeta de la temporada archivada.

  ── QUÉ PASÓ ────────────────────────────────────────────────────────────────
  El perfil del jugador lee el historial para armar las baterías:

      window.HISTORIAL_DATA

  Pero nunca carga el archivo donde eso vive. El archivo está en la carpeta,
  con sus 26 sesiones adentro: la página simplemente no lo pide.

  Lo mismo con los cortes de video, y por eso los mapas de calor aparecen
  vacíos aunque los videos estén subidos.

  ── QUÉ HACE ────────────────────────────────────────────────────────────────
  Mira qué variables usa cada pantalla, se fija cuál es el archivo que las
  define, y si no lo está cargando, lo agrega. Si el archivo está cifrado, pide
  el cifrado.

  No inventa nada: conecta lo que ya está en la carpeta.

  Queda una copia .antes-conectar de cada pantalla.
===============================================================================
"""
import os
import re
import glob
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))

print()
print('  ' + '=' * 64)
print('     QUE CADA PANTALLA PIDA LO QUE USA')
print('  ' + '=' * 64)
print()

# ── qué archivo define cada variable ───────────────────────────────────────
#    Es la correspondencia de siempre: cada archivo de datos guarda su
#    contenido con un nombre fijo, igual en todos los clubes.
MAPA = {
    'HISTORIAL_DATA':      'datos_historial.js',
    'HISTORIAL_DATA_ENT':  'datos_historial_ent.js',
    'PARTIDOS_DATA':       'datos_partidos.js',
    'ENTRENAMIENTOS_DATA': 'datos_entrenamientos.js',
    'EQUIPO_DATA':         'datos_equipo.js',
    'ARMADORES_DATA':      'datos_armadores.js',
    'RECEPCION_RIVAL_DATA':'datos_recepcion.js',
    'EJERCICIOS_DATA':     'datos_ejercicios.js',
    'NLA_DATA':            'datos_nla.js',
    'LIGA_DATA':           'liga_data.js',
    'LIGA_DATA_ENT':       'liga_data_entrenamientos.js',
    'PP_DATA':             'plan_partido_data.js',
    'PP_BLOCK':            'datos_bloqueo.js',
    'BAT_PARTIDOS':        'datos_baterias.js',
    'VIDEO_DATA':          'datos_video.js',
    'MAPA_VIDEOS':         'mapa_videos.js',
    'MAPA_VIDEOS_ENT':     'mapa_videos_ent.js',
    'SCOUTING_RIVAL':      'scouting_rival.js',
    'GAMEPLAN_DATA':       'datos_gameplan.js',
    'PREP_DATA':           'datos_prep_fisica.js',
    'OBJETIVOS_CONFIG':    'objetivos_config.js',
}


def como_esta(arch):
    """Con qué nombre existe el archivo: tal cual, cifrado, o no está."""
    if os.path.exists(os.path.join(AQUI, arch)):
        return arch
    if os.path.exists(os.path.join(AQUI, arch + '.enc')):
        return arch + '.enc'
    return None


tocadas = 0
for p in sorted(glob.glob(os.path.join(AQUI, '*.html'))):
    nombre = os.path.basename(p)
    try:
        s = open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        continue
    original = s
    agregados = []

    carga = set(re.findall(r'<script src="([^"?]+)"', s))

    for var, arch in sorted(MAPA.items()):
        if not re.search(r'\b' + var + r'\b', s):
            continue                       # no la usa
        real = como_esta(arch)
        if not real:
            continue                       # no está en la carpeta
        if real in carga or arch in carga or (arch + '.enc') in carga:
            continue                       # ya lo carga

        # va antes del primer script propio, para llegar a tiempo
        m = re.search(r'<script src="[^"]+"[^>]*></script>', s)
        if not m:
            continue
        s = (s[:m.start()] +
             '<script src="%s" onerror="void 0"></script>\n  ' % real +
             s[m.start():])
        carga.add(real)
        agregados.append(real)

    # si quedó cargando algo cifrado, tiene que saber abrirlo
    if re.search(r'src="[^"]+\.enc"', s):
        if 'datos_seguros.js' not in s:
            m = re.search(r'<script src="[^"]+\.enc"[^>]*></script>', s)
            if m:
                s = (s[:m.start()] +
                     '<script src="datos_seguros.js" onerror="void 0"></script>\n  ' +
                     s[m.start():])
                agregados.append('datos_seguros.js')
        if not re.search(r'abrirDatos\s*\(', s):
            todos = list(re.finditer(r'<script src="[^"]+\.enc"[^>]*></script>', s))
            if todos:
                s = (s[:todos[-1].end()] +
                     '\n  <script>abrirDatos();</script>' +
                     s[todos[-1].end():])
                agregados.append('abrirDatos()')

    if s != original:
        if not os.path.exists(p + '.antes-conectar'):
            shutil.copy2(p, p + '.antes-conectar')
        open(p, 'w', encoding='utf-8').write(s)
        tocadas += 1
        print('     %-24s + %s' % (nombre[:24], ', '.join(agregados[:4])))

print()
if tocadas:
    print('  %d pantallas conectadas. Se guardo una copia .antes-conectar.' % tocadas)
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  Todas las pantallas ya pedian lo que usan.')
print()
input('  Enter para cerrar...')
