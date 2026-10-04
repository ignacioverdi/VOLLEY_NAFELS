# -*- coding: utf-8 -*-
# ============================================================================
#  DEMO_RECORTE.py — QUE SE MUESTRA Y QUE NO EN LA DEMO PUBLICA
#  ---------------------------------------------------------------------------
#  POR QUE EXISTE
#
#  La puerta de registro de la demo es JavaScript: protege las PAGINAS, no los
#  ARCHIVOS. Un .js, un .png o un .enc se sirven crudos, sin que corra nada:
#  cualquiera que escriba la direccion los baja. Y la llave de la demo viaja
#  publica dentro de demo_guard.js, asi que lo cifrado tampoco esta a salvo.
#
#  Conclusion: esconder una pantalla no alcanza. Lo unico que de verdad limita
#  la demo es NO COPIAR el archivo. Eso es lo que hace este modulo.
#
#  LAS TRES COSAS QUE HACE
#
#    1. EXCLUIR   archivos que no se copian nunca (datos del club, fotos,
#                 video, scouting de rivales, claves).
#    2. CARTEL    paginas que se reemplazan por un cartel "esto esta en la
#                 version completa". Se deja el acceso a proposito: el que
#                 mira la demo tiene que VER que la funcion existe.
#    3. PODAR     de los datos que si viajan, se recorta: un partido en vez
#                 de cinco, un equipo en vez de seis, dos entrenamientos en
#                 vez de quince. Y se cambian los nombres reales por
#                 inventados, para que ni el plantel ni los rivales queden
#                 expuestos.
#
#  HONESTIDAD: el nombre de un equipo puede quedar escondido dentro de algun
#  identificador interno (del estilo "E2026-09-07-PRAAXPONAFEL"). Eso es
#  cosmetico: lo que importa —las claves, las fotos, el scouting de rivales,
#  el playbook, el video— no viaja.
# ============================================================================
import re, json

# ── 1 · LO QUE NO SE COPIA ──────────────────────────────────────────────────
# Comodines estilo .gitignore, contra el nombre del archivo.
EXCLUIR = [
    # las claves de los jugadores
    'datos_plantel.js', 'datos_plantel.js.enc',
    # lo que un rival pagaria por leer
    'scouting_rival.js.enc', 'scouting_rival.js',
    'datos_recepcion.js.enc', 'datos_recepcion_ent.js.enc',
    'Team Playbook Nafels.pptx',
    # video del club: se publican numeros, nunca el video
    'datos_video*.js.enc', 'datos_videos.js.enc', 'mapa_videos*.js.enc',
    'videos_nafels.xlsx',
    # bases y planillas internas
    'nla_players_db.json.enc', 'nla_players_db.json',
    'entrenamientos_nafels_db.json', 'mis_codigos.js',
    # la planilla de la liga: son datos de TODOS los clubes de la NLA, con
    # nombre y apellido de cada jugador. Es informacion publica de la liga,
    # pero no es material propio y no pinta bien al lado de "Club Demo".
    'nla_stats.json', 'nla_full_stats.json', 'entrenamientos_full_stats.json',
    '.control_pantallas.json', 'cambios_dorsal.json',
    # otro club
    'datos_casla.js.enc',
    # el chat del plantel
    'chat_nafels.js',
    # documentos internos
    'FIREBASE_REGLAS*.json', 'config_club.json',
    'foto *.jpg', 'foto *.jpeg', 'foto *.png', 'FONDOCAMISETA.png',
]
# 'imagenes/' NO va aca a proposito: son los diagramas de sistemas de defensa
# (V5, X1, ...). Son del producto, no del club, y sin ellos Game Plan y
# Armadores quedan con un hueco. 'escudos/' si va: son los logos reales de los
# clubes de la liga.
CARPETAS_EXCLUIR = {'fotos', 'placas', 'manos bloqueo', 'escudos'}

# OJO: una pagina que ademas este en CARTEL (mas abajo) NO va aca. Si se
# excluye, el enlace de la portada queda en 404; lo que se quiere es que la
# pagina exista y explique por que no muestra nada.

# ── 2 · LAS PAGINAS QUE PASAN A SER UN CARTEL ───────────────────────────────
# Se dividen en dos para que el cartel diga la verdad en cada caso.
CARTEL_CLUB = [            # muestra datos del club que no van a una demo
    'scouting_rival.html', 'recepcion.html', 'Team_Playbook_Nafels.html',
    'MANUAL_NAFELS_VOLEY.html', 'horarios.html', 'videos.html', 'cortes.html',
    'calendario.html', 'nla_stats_table.html',
]
CARTEL_CARGA = [           # herramientas de carga y administracion
    'alta_jugadores.html', 'asociar_codigos.html', 'subir_partido.html',
    'importar_dvw.html', 'importar_video.html', 'unir_video.html',
    'recuperar.html', 'diagnostico.html', 'revisar.html',
    'prueba_delay.html', 'nla_stats_template.html',
]
CARTEL = CARTEL_CLUB + CARTEL_CARGA

# ── 3 · LOS NOMBRES ─────────────────────────────────────────────────────────
# Apellido real -> apellido inventado. Se reemplaza en TODO archivo de texto.
# El orden importa: "SCHMID R" tiene que salir antes que "SCHMID".
JUGADORES = [
    ('BOGDANOVSKI', 'PETROVIC'), ('BARTHOLET', 'AMMANN'),
    ('SCHWITTER', 'BRUNNER'),    ('JOHANSSON', 'LINDBERG'),
    ('STEIMANN', 'KELLER'),      ('SCHMID R', 'WEBER R'),
    ('SCHMID J', 'WEBER J'),     ('BRUDERER', 'HOFER'),
    ('VAZQUEZ', 'MORENO'),       ('CLEMENT', 'FAVRE'),
    ('ROFFLER', 'GRAF'),         ('NORRIS', 'HARPER'),
    ('DURDOS', 'RIVAS'),         ('AZCOITIA', 'SALAS'),
    ('VERDI', 'ROMANO'),
    ('SCHMID', 'WEBER'),
    # Los que jugaron la temporada pasada y ya no estan. Viven en
    # temporadas/2025-26/, que es una copia entera de la app con sus propios
    # datos: si no estan aca, viajan con nombre y apellido.
    ('HESSELHOLT', 'LARSEN'),    ('FIGUEIREDO', 'COSTA'),
    ('CABANAS', 'SOTO'),         ('NIKOLOV', 'DIMOV'),
    ('DEECKE', 'KUHN'),          ('BROCH', 'MAIER'),
    ('PETER', 'BAUMANN'),
]
PILA = [
    ('Ezequiel', 'Martin'), ('Yannik', 'Luca'),   ('James', 'Alex'),
    ('Patrik', 'Nils'),     ('Olivier', 'Pierre'),('Valentin', 'Diego'),
    ('Christian', 'Marco'), ('Pascal', 'Simon'),  ('Dejan', 'Ivan'),
    ('Jonas', 'Elias'),     ('Gian', 'Noah'),     ('Sebastian', 'Andres'),
    ('Ignacio', 'Lucas'),   ('Tom', 'Jan'),       ('Roy', 'Rolf'),
    ('IGNACIO', 'LUCAS'),   ('SEBASTIAN', 'ANDRES'),
    ('Joachim', 'Mads'),    ('Manuel', 'Rui'),    ('Denis', 'Nico'),
    ('Risto', 'Stefan'),    ('Linus', 'Timo'),    ('Nathan', 'Felix'),
    ('Elias', 'Till'),
]
# Club propio y rivales. Lo mas largo primero, siempre.
EQUIPOS = [
    ('AXPO VOLLEY NAFELS', 'CLUB DEMO'), ('Axpo Volley Nafels', 'Club Demo'),
    ('AXPO NAFELS', 'CLUB DEMO'),        ('Axpo Nafels', 'Club Demo'),
    ('NAFELS VOLEY', 'CLUB DEMO'),       ('Nafels Voley', 'Club Demo'),
    ('Volley Nafels', 'Club Demo'),
    ('TV Rottenburg', 'Rival 4'), ('TV ROTTENBURG', 'RIVAL 4'),
    ('Schonenwerd', 'Rival 7'),   ('SCHONENWERD', 'RIVAL 7'),
    ('St. Gallen', 'Rival 3'),    ('ST. GALLEN', 'RIVAL 3'),
    ('St.Gallen', 'Rival 3'),     ('ST.GALLEN', 'RIVAL 3'),
    ('St Gallen', 'Rival 3'),     ('ST GALLEN', 'RIVAL 3'),
    ('Rottenburg', 'Rival 4'),    ('ROTTENBURG', 'RIVAL 4'),
    ('Colombier', 'Rival 1'),     ('COLOMBIER', 'RIVAL 1'),
    ('Amriswil', 'Rival 6'),      ('AMRISWIL', 'RIVAL 6'),
    ('Lausanne', 'Rival 8'),      ('LAUSANNE', 'RIVAL 8'),
    ('FREIBURG', 'RIVAL 5'),      ('Freiburg', 'Rival 5'),
    ('Chenois', 'Rival 9'),       ('CHENOIS', 'RIVAL 9'),
    ('Jona', 'Rival 2'),          ('JONA', 'RIVAL 2'),
    ('NAFELS', 'CLUB DEMO'),      ('Nafels', 'Club Demo'),
    ('NAFELS', 'CLUB DEMO'),
]
# El acento se trata aparte: "Näfels" aparece escrito de las dos formas.
ACENTOS = [('NÄFELS', 'CLUB DEMO'), ('Näfels', 'Club Demo')]

# La clave interna "nafels" (minuscula, sin espacios) NO se toca: es un
# identificador que viaja en las direcciones (?equipo=nafels) y en las claves
# de los objetos. Cambiarla obligaria a tocar las 64 paginas y es justo donde
# se rompen las cosas. No muestra nada: es una palabra en una URL.

_MAPA = ACENTOS + EQUIPOS + JUGADORES + PILA

# Se reemplaza SOLO cuando el nombre esta suelto: ni pegado a una letra, ni a
# un numero, ni a un guion bajo. Eso es lo que salva a los identificadores de
# JavaScript, que es donde esto se rompe: window.NAFELS_ARMADOR tiene que
# seguir llamandose asi, y window.PLANTEL_NAFELS tambien, porque hay paginas
# que los buscan por ese nombre exacto. Los identificadores de los partidos
# ("Nafels__2026-09-19") tampoco se tocan, y mejor: los distintos archivos se
# siguen refiriendo al mismo partido.
_RX = [(re.compile(r'(?<![A-Za-z0-9_])' + re.escape(de) + r'(?![A-Za-z0-9_])'), a)
       for de, a in _MAPA]

def renombrar(texto):
    for rx, a in _RX:
        texto = rx.sub(a, texto)
    return texto


# ── 4 · LA PODA ─────────────────────────────────────────────────────────────
PARTIDOS_QUE_QUEDAN = 1
SESIONES_QUE_QUEDAN = 2

def _bloque(texto, desde):
    """Devuelve (inicio, fin) del objeto/array que arranca despues de 'desde'.

    El ancla es el nombre MAS el signo igual, no el nombre solo. Dos razones,
    las dos aprendidas a los golpes:

      - "window.LIGA_DATA" tambien entra dentro de "window.LIGA_DATA_ENT", que
        es otra variable. Con el igual de por medio ya no se confunden.
      - si el archivo arranca con un comentario que menciona la variable, el
        nombre solo apunta al comentario y la primera llave que se encuentra
        es la de un ejemplo, no la del dato.
    """
    m = re.search(re.escape(desde) + r'\s*=', texto)
    if not m:
        return None
    j = m.end()
    while j < len(texto) and texto[j] not in '[{':
        if not texto[j].isspace():
            return None            # entre el igual y la llave no va nada mas
        j += 1
    if j >= len(texto):
        return None
    abre = texto[j]; cierra = ']' if abre == '[' else '}'
    d = 0; k = j; en_txt = False; esc = False
    while k < len(texto):
        c = texto[k]
        if en_txt:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': en_txt = False
        else:
            if c == '"': en_txt = True
            elif c == abre: d += 1
            elif c == cierra:
                d -= 1
                if d == 0: return (j, k + 1)
        k += 1
    return None

AVISOS = []

def _leer(texto, desde):
    """Si no esta, o no es JSON, devuelve (None, None) y no revienta.

    Que un archivo no tenga la forma esperada no puede costar el archivo
    entero: la demo quedaria con una pantalla vacia. Se deja pasar sin podar
    y se avisa por pantalla, que es lo que hay que mirar.
    """
    r = _bloque(texto, desde)
    if not r:
        return None, None
    try:
        return json.loads(texto[r[0]:r[1]]), r
    except Exception:
        return None, None

def _escribir(texto, r, valor):
    return texto[:r[0]] + json.dumps(valor, ensure_ascii=False) + texto[r[1]:]

def _solo_propio(texto, nombre_var, clave='nafels'):
    """Deja un solo equipo en un objeto {equipo: ...}."""
    d, r = _leer(texto, nombre_var)
    if d is None or clave not in d:
        return texto
    return _escribir(texto, r, {clave: d[clave]})

def _recortar_lista(texto, nombres_meta, cuantos):
    """Recorta META a 'cuantos' y deja solo esos ids en el resto de las listas."""
    meta, r = _leer(texto, nombres_meta[0])
    if not isinstance(meta, list) or len(meta) <= cuantos:
        ids = set(x.get('id') for x in meta) if isinstance(meta, list) else None
    else:
        meta = meta[:cuantos]
        texto = _escribir(texto, r, meta)
        ids = set(x.get('id') for x in meta)
    if ids is None:
        return texto
    for var in nombres_meta[1:]:
        d, r2 = _leer(texto, var)
        if isinstance(d, dict):
            texto = _escribir(texto, r2, {k: v for k, v in d.items() if k in ids})
        elif isinstance(d, list):
            texto = _escribir(texto, r2,
                              [x for x in d if not isinstance(x, dict)
                               or x.get('id') in ids or 'id' not in x])
    # y el total, para que la pantalla no prometa mas de lo que hay
    texto = re.sub(r'(_TOTAL\s*=\s*)\d+', lambda m: m.group(1) + str(len(ids)), texto)
    return texto


def _rival_de_muestra(t):
    """Un rival de mentira hecho con la forma del de verdad.

    Se guardan los numeros y los puestos; cada jugador pasa a llamarse por su
    numero y se le vacian todas las acciones. Alcanza para que Rotaciones
    dibuje las seis rotaciones y no alcanza para enterarse de nada.
    """
    fuera = {'name': 'Rival 1', 'roster': dict(t.get('roster') or {})}
    for sk in ('atk', 'srv', 'rec', 'dig'):
        orig = t.get(sk) or {}
        fuera[sk] = dict((n, {'name': 'J' + str(n), 'num': int(n) if str(n).isdigit() else n})
                         for n in orig)
    fuera['rivals'] = ['Club Demo']
    fuera['games'] = []
    fuera['matches'] = []
    return fuera


def podar(nombre, texto):
    """nombre: el del archivo SIN .enc. Devuelve el texto o None (no copiar).

    Pase lo que pase con la poda, el archivo sale: como mucho sale entero y
    renombrado. Perder el archivo seria peor que no recortarlo, y el aviso
    queda a la vista para arreglarlo.
    """
    try:
        return _podar(nombre, texto)
    except Exception as e:
        AVISOS.append('%s: no pude recortarlo (%s). Va entero.' % (nombre, e))
        try:
            return renombrar(texto)
        except Exception:
            return texto


def _podar(nombre, texto):
    n = nombre.split('/')[-1]

    if n.startswith('plantel'):
        # Cinturon y tiradores. La fecha de nacimiento es la clave de cada
        # jugador: que no viaje no puede depender de que alguien se acuerde de
        # correr SACAR_NACIM.py en cada carpeta. Y las fotos tampoco viajan,
        # asi que el que las pide se queda con un cuadradito roto.
        texto = re.sub(r'(nacim\s*:\s*)"[^"]*"', r'\1""', texto)
        texto = re.sub(r'(foto\s*:\s*)"[^"]*"', r'\1null', texto)
    elif n in ('plan_partido_data.js',):
        texto = _solo_propio(texto, 'window.PP_DATA')
    elif n in ('datos_bloqueo.js',):
        texto = _solo_propio(texto, 'window.PP_BLOCK')
    elif n in ('liga_data.js', 'liga_data_entrenamientos.js'):
        var = ('window.LIGA_DATA_ENT' if n == 'liga_data_entrenamientos.js'
               else 'window.LIGA_DATA')
        # Se van los equipos rivales enteros, que es el scouting que no puede
        # viajar. Pero NO se recorta la lista de partidos del equipo propio:
        # las acciones de cada jugador se refieren a los partidos por numero
        # de orden, y si se cortan quedan apuntando al vacio. Asi lo descubri:
        # recortandolos, los seis mapas de calor (hm_*) se caian con
        # "Cannot read properties of undefined". Los nombres de los rivales
        # ya salen cambiados por la tabla de arriba.
        d, r = _leer(texto, var)
        if isinstance(d, dict) and 'teams' in d and 'nafels' in d['teams']:
            nuevos = {'nafels': d['teams']['nafels']}
            # Rotaciones compara MI rotacion contra la del rival: sin ningun
            # rival la pantalla queda en blanco. Asi que queda uno, pero
            # vaciado: los numeros y los puestos (que es lo unico que esa
            # pantalla usa) y nada mas. Ni el nombre de un jugador rival ni
            # una sola accion suya viajan.
            otros = [k for k in d['teams'] if k != 'nafels']
            if otros:
                nuevos['rival'] = _rival_de_muestra(d['teams'][otros[0]])
            d['teams'] = nuevos
            texto = _escribir(texto, r, d)
    elif n == 'datos_partidos.js':
        texto = _recortar_lista(texto, [
            'const PARTIDOS_META', 'const PARTIDOS_JUGADORES',
            'const PARTIDOS_EQUIPO_OBJ', 'const PARTIDOS_INDIVIDUAL',
            'const PARTIDOS_ARMADOR', 'const PARTIDOS_TRANSICION',
        ], PARTIDOS_QUE_QUEDAN)
    elif n == 'datos_entrenamientos.js':
        texto = _recortar_lista(texto, [
            'const ENTRENAMIENTOS_META', 'const ENTRENAMIENTOS_JUGADORES',
            'const ENTRENAMIENTOS_EQUIPO_OBJ', 'const ENTRENAMIENTOS_INDIVIDUAL',
            'const ENTRENAMIENTOS_ARMADOR', 'const ENTRENAMIENTOS_TRANSICION',
        ], SESIONES_QUE_QUEDAN)
    elif n == 'datos_historial.js':
        d, r = _leer(texto, 'window.HISTORIAL_DATA')
        if isinstance(d, dict):
            for k in ('entrenamientos', 'partidos'):
                if isinstance(d.get(k), list):
                    d[k] = d[k][:SESIONES_QUE_QUEDAN]
            texto = _escribir(texto, r, d)
    elif n.startswith('datos_equipo'):
        # las fotos del plantel no viajan: sin esto la pantalla de Equipo
        # pide 12 imagenes que no existen y quedan 12 cuadraditos rotos
        d, r = _leer(texto, 'window.EQUIPO_DATA')
        if isinstance(d, dict) and isinstance(d.get('jugadores'), list):
            for j in d['jugadores']:
                j['foto'] = None
            texto = _escribir(texto, r, d)
    elif n == 'proximo_rival.js':
        d, r = _leer(texto, 'window.FIXTURE_DATA')
        if isinstance(d, dict) and isinstance(d.get('fixture'), list):
            d['fixture'] = d['fixture'][:2]
            texto = _escribir(texto, r, d)

    return renombrar(texto)


# ── 5 · EL CARTEL ───────────────────────────────────────────────────────────
_CARTEL = u'''<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Volley-Stats — Demo</title>
<style>
:root{--bg:#07080F;--pan:#0D1020;--line:rgba(255,255,255,.09);
      --txt:#E9ECF3;--dim:#8A94A6;--red:#E8192C}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--txt);min-height:100vh;
     font-family:system-ui,-apple-system,Segoe UI,sans-serif;
     display:flex;align-items:center;justify-content:center;padding:24px}
.caja{max-width:470px;width:100%;background:var(--pan);border:1px solid var(--line);
      border-radius:16px;padding:34px 30px;text-align:center}
img{width:62px;height:62px;margin-bottom:20px}
h1{font-size:21px;line-height:1.3;margin-bottom:12px;letter-spacing:-.2px}
p{color:var(--dim);font-size:15px;line-height:1.65;margin-bottom:24px}
a{display:inline-block;background:var(--red);color:#fff;text-decoration:none;
  padding:11px 22px;border-radius:9px;font-weight:600;font-size:14px}
.vol{display:block;margin-top:14px;background:none;color:var(--dim);
     font-size:13px;font-weight:500;padding:6px}
.vol:hover{color:var(--txt)}
</style></head><body><div class="caja">
<img src="@@P@@icon-192.png" alt="Volley-Stats">
<h1 id="t">Esta pantalla no est&aacute; en la demo</h1>
<p id="d">@@TXT@@</p>
<a href="https://volley-stats.com">Ver planes y precios</a>
<a class="vol" href="@@P@@index.html">&larr; Volver a la demo</a>
</div>
<script>
(function(){
  var L=''; try{ L=(localStorage.getItem('vb_lang')||navigator.language||'').slice(0,2).toLowerCase();}catch(e){}
  var T={en:{t:'This screen is not in the demo',
             club:'It shows a real club\\u2019s own material \\u2014 roster, video, opponent scouting. The demo runs on sample data, so this screen stays in the full version.',
             carga:'This is a loading and administration tool: it writes to the club\\u2019s database. The demo is read-only, so it stays in the full version.',
             volver:'\\u2190 Back to the demo', planes:'See plans and pricing'},
      de:{t:'Dieser Bildschirm ist nicht in der Demo',
             club:'Er zeigt vereinseigenes Material \\u2014 Kader, Video, Gegnerscouting. Die Demo l\\u00e4uft mit Beispieldaten, daher bleibt dieser Bildschirm der Vollversion vorbehalten.',
             carga:'Das ist ein Eingabe- und Verwaltungswerkzeug: es schreibt in die Vereinsdatenbank. Die Demo ist nur lesend, daher bleibt es der Vollversion vorbehalten.',
             volver:'\\u2190 Zur\\u00fcck zur Demo', planes:'Preise ansehen'}};
  /* el castellano es el que ya esta escrito en la pagina; el resto de los
     idiomas que no son aleman van en ingles, no en castellano */
  var t = T[L] || (L==='es' ? null : T.en); if(!t) return;
  document.documentElement.setAttribute('lang', T[L] ? L : 'en');
  document.getElementById('t').textContent=t.t;
  document.getElementById('d').textContent=t['@@TIPO@@'];
  var a=document.querySelectorAll('a');
  a[0].textContent=t.planes; a[1].textContent=t.volver;
})();
</script></body></html>
'''

_TXT = {
    'club':  u'Muestra material propio de un club real — plantel, video, '
             u'scouting de rivales. La demo corre con datos de muestra, así '
             u'que esta pantalla queda en la versión completa.',
    'carga': u'Es una herramienta de carga y administración: escribe en la '
             u'base del club. La demo es solo de lectura, así que queda en '
             u'la versión completa.',
}

def pagina_cartel(nombre, prefijo=''):
    tipo = 'carga' if nombre in CARTEL_CARGA else 'club'
    return (_CARTEL.replace('@@TXT@@', _TXT[tipo])
                   .replace('@@TIPO@@', tipo)
                   .replace('@@P@@', prefijo))


# ── 6 · LA VISITA GUIADA ──────────────────────────────────────────────
# El archivo entero vive aca para que este junto a lo demas que define
# como se ve la demo. HACER_DEMO.py lo escribe como demo_tour.js.
TOUR = r'''/* ══════════════════════════════════════════════════════════════════════
   demo_tour.js — la visita guiada de la demo
   ----------------------------------------------------------------------
   Solo existe en la copia demo. La app del club no lo lleva.

   QUE HACE
     La primera vez que alguien entra a la portada, lo lleva por las cinco
     pantallas que valen la pena y le explica, de paso, que esta mirando
     una version reducida. Despues no vuelve a aparecer.

   COMO ENCUENTRA LAS TARJETAS
     Por el destino del enlace (a[href^="panel_vivo.html"]), no por su
     posicion ni por una clase de CSS. Si manana la portada se reordena o
     cambia de estilo, el recorrido sigue funcionando. Si una tarjeta no
     esta, ese paso se saltea solo en vez de romperse.

   CUANDO ARRANCA
     Espera a que la puerta de registro se cierre. Mientras el visitante
     no entro, no hay nada que mostrarle.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LLAVE = 'vs_demo_tour';

  /* solo en la portada */
  var p = (location.pathname || '').split('/').pop().toLowerCase();
  if (p && p !== 'index.html') return;

  try { if (localStorage.getItem(LLAVE)) return; } catch (e) {}

  /* ── los textos ──────────────────────────────────────────────────── */
  var TXT = {
    es: {
      saltar: 'Saltar', siguiente: 'Siguiente', empezar: 'Entrar a la demo',
      de: 'de', planes: 'Ver planes y precios',
      pasos: [
        { t: 'Esto es Volley-Stats',
          d: 'Lo que vas a ver funciona de verdad: son estadisticas reales de voley de alto nivel, con el club y los jugadores cambiados. Nada de lo que toques se guarda.' },
        { h: 'panel_vivo.html', t: 'Scout en Vivo',
          d: 'Aca se carga el partido punto por punto, con el codigo de DataVolley. En la demo entran 100 codigos: un set entero, con todos los analisis andando.' },
        { h: 'panel_voley.html', t: 'Panel en Vivo',
          d: 'Mientras uno tipea, esto se actualiza solo. Fichas, tablas y graficos, para mirar desde el banco o desde la tribuna.' },
        { h: 'plan_partido.html', t: 'Plan de Partido',
          d: 'El plan del proximo rival, armado con lo que ya scouteaste: saque, recepcion, defensa y armadores.' },
        { h: 'equipo.html', t: 'El plantel',
          d: 'Cada jugador entra con su numero y ve lo suyo: sus numeros, sus objetivos de la semana y sus videos.' },
        { t: 'Lo que no vas a encontrar',
          d: 'Algunas pantallas muestran un cartel. Son las que usan material propio de un club —el playbook, el scouting de los rivales, el video— o las de carga de datos. En tu club estan todas.' }
      ]
    },
    en: {
      saltar: 'Skip', siguiente: 'Next', empezar: 'Enter the demo',
      de: 'of', planes: 'See plans and pricing',
      pasos: [
        { t: 'This is Volley-Stats',
          d: 'Everything here really works: real top-level volleyball data, with the club and the players renamed. Nothing you touch is saved.' },
        { h: 'panel_vivo.html', t: 'Live Scout',
          d: 'This is where the match is typed in, rally by rally, with DataVolley codes. The demo allows 100 codes: a full set, with every analysis running.' },
        { h: 'panel_voley.html', t: 'Live Panel',
          d: 'While someone types, this updates by itself. Player cards, tables and charts, to follow from the bench or the stands.' },
        { h: 'plan_partido.html', t: 'Match Plan',
          d: 'The plan for the next opponent, built from what you already scouted: serve, reception, defence and setters.' },
        { h: 'equipo.html', t: 'The squad',
          d: 'Each player signs in with their number and sees their own: their numbers, their weekly goals and their video.' },
        { t: 'What you will not find',
          d: 'Some screens show a notice. Those are the ones using a club’s own material — the playbook, opponent scouting, video — or the data-loading tools. In your club they are all there.' }
      ]
    },
    de: {
      saltar: 'Überspringen', siguiente: 'Weiter', empezar: 'Zur Demo',
      de: 'von', planes: 'Preise ansehen',
      pasos: [
        { t: 'Das ist Volley-Stats',
          d: 'Alles hier funktioniert wirklich: echte Daten aus dem Spitzenvolleyball, mit geändertem Verein und geänderten Namen. Nichts, was du anfasst, wird gespeichert.' },
        { h: 'panel_vivo.html', t: 'Live-Scouting',
          d: 'Hier wird das Spiel Ballwechsel für Ballwechsel erfasst, mit DataVolley-Codes. In der Demo sind 100 Codes möglich: ein ganzer Satz, mit allen Analysen.' },
        { h: 'panel_voley.html', t: 'Live-Panel',
          d: 'Während jemand erfasst, aktualisiert sich das von selbst. Spielerkarten, Tabellen und Grafiken, für Bank oder Tribüne.' },
        { h: 'plan_partido.html', t: 'Spielplan',
          d: 'Der Plan für den nächsten Gegner, aus dem bereits Gescouteten: Aufschlag, Annahme, Abwehr und Zuspiel.' },
        { h: 'equipo.html', t: 'Der Kader',
          d: 'Jeder Spieler meldet sich mit seiner Nummer an und sieht sein Eigenes: seine Zahlen, seine Wochenziele und seine Videos.' },
        { t: 'Was du nicht finden wirst',
          d: 'Einige Bildschirme zeigen einen Hinweis. Das sind die mit vereinseigenem Material — Playbook, Gegnerscouting, Video — oder die Eingabewerkzeuge. In deinem Verein sind sie alle da.' }
      ]
    }
  };

  /* Lo que no es castellano, ingles o aleman entra en INGLES: a un entrenador
     de Luxemburgo o de Francia el castellano no le dice nada. */
  function idioma() {
    var l = '';
    try { l = localStorage.getItem('vb_lang') || ''; } catch (e) {}
    if (!l) { try { l = (navigator.language || '').slice(0, 2).toLowerCase(); } catch (e) {} }
    return TXT[l] ? l : 'en';
  }

  /* ── el armazon ──────────────────────────────────────────────────── */
  var T, pasos, i = 0, capa, hueco, caja, estilo;

  function css() {
    if (estilo) return;
    estilo = document.createElement('style');
    estilo.textContent =
      '#vs-tour{position:fixed;inset:0;z-index:2147483000;pointer-events:auto}' +
      /* el fondo solo atrapa los clics. El oscurecido lo hace la sombra
         gigante del hueco, que deja transparente justo la tarjeta: si los
         dos oscurecieran, la tarjeta enfocada quedaria tan apagada como el
         resto y el foco no se entenderia. */
      '#vs-tour-fondo{position:absolute;inset:0;background:transparent;' +
        'transition:background .28s ease}' +
      '#vs-tour-fondo.solo{background:rgba(3,4,10,.82)}' +
      '#vs-tour-hueco{position:absolute;border-radius:14px;pointer-events:none;' +
        'box-shadow:0 0 0 3px #E8192C,0 0 0 9999px rgba(3,4,10,.9);' +
        'transition:all .28s cubic-bezier(.4,0,.2,1);display:none}' +
      '#vs-tour-caja{position:absolute;max-width:380px;width:calc(100vw - 32px);' +
        'background:#0D1020;border:1px solid rgba(255,255,255,.1);border-radius:14px;' +
        'padding:20px 20px 16px;color:#E9ECF3;box-shadow:0 20px 60px rgba(0,0,0,.6);' +
        'font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55}' +
      '#vs-tour-caja .n{font-size:11px;letter-spacing:1.4px;color:#8A94A6;' +
        'text-transform:uppercase;margin-bottom:8px}' +
      '#vs-tour-caja h3{font-size:19px;margin:0 0 8px;font-weight:700;letter-spacing:-.2px}' +
      '#vs-tour-caja p{font-size:14.5px;color:#B6BECC;margin:0 0 16px}' +
      '#vs-tour-caja .pies{display:flex;align-items:center;gap:10px}' +
      '#vs-tour-caja button{font:inherit;font-size:13.5px;font-weight:600;' +
        'border-radius:9px;border:0;padding:9px 16px;cursor:pointer}' +
      '#vs-tour-sig{background:#E8192C;color:#fff;margin-left:auto}' +
      '#vs-tour-sig:hover{background:#FF3B4E}' +
      '#vs-tour-salt{background:transparent;color:#8A94A6;padding-left:0}' +
      '#vs-tour-salt:hover{color:#E9ECF3}' +
      '#vs-tour-caja a.pl{color:#8A94A6;font-size:12.5px;text-decoration:none;' +
        'display:inline-block;margin-top:2px}' +
      '#vs-tour-caja a.pl:hover{color:#E9ECF3}' +
      '@media print{#vs-tour{display:none}}';
    document.head.appendChild(estilo);
  }

  function tarjeta(href) {
    if (!href) return null;
    try {
      var a = document.querySelector('a[href="' + href + '"], a[href^="' + href + '?"]');
      if (!a) return null;
      var c = a.closest('.card, .hm-card, a') || a;
      return c.getBoundingClientRect().height > 0 ? c : null;
    } catch (e) { return null; }
  }

  function ubicar(el) {
    var m = 10, r;
    var fondo = document.getElementById('vs-tour-fondo');
    if (el) {
      r = el.getBoundingClientRect();
      if (fondo) fondo.className = '';
      hueco.style.display = 'block';
      hueco.style.left = (r.left - m) + 'px';
      hueco.style.top = (r.top - m) + 'px';
      hueco.style.width = (r.width + m * 2) + 'px';
      hueco.style.height = (r.height + m * 2) + 'px';
    } else {
      if (fondo) fondo.className = 'solo';
      hueco.style.display = 'none';
    }
    /* la caja: debajo de la tarjeta si entra, si no arriba, si no al medio */
    var cw = Math.min(380, window.innerWidth - 32), ch = caja.offsetHeight || 210;
    var x, y;
    if (el && r) {
      x = Math.min(Math.max(12, r.left), window.innerWidth - cw - 12);
      y = r.bottom + 18;
      if (y + ch > window.innerHeight - 12) y = r.top - ch - 18;
      if (y < 12) y = Math.max(12, (window.innerHeight - ch) / 2);
    } else {
      x = (window.innerWidth - cw) / 2;
      y = (window.innerHeight - ch) / 2;
    }
    caja.style.left = Math.round(x) + 'px';
    caja.style.top = Math.round(y) + 'px';
  }

  function pintar() {
    var s = pasos[i];
    var el = tarjeta(s.h);
    caja.innerHTML =
      '<div class="n">' + (i + 1) + ' ' + T.de + ' ' + pasos.length + '</div>' +
      '<h3></h3><p></p>' +
      '<div class="pies">' +
        '<button id="vs-tour-salt" type="button"></button>' +
        '<button id="vs-tour-sig" type="button"></button>' +
      '</div>';
    caja.querySelector('h3').textContent = s.t;
    caja.querySelector('p').textContent = s.d;
    caja.querySelector('#vs-tour-salt').textContent = T.saltar;
    caja.querySelector('#vs-tour-sig').textContent =
      (i === pasos.length - 1) ? T.empezar : T.siguiente;
    caja.querySelector('#vs-tour-salt').onclick = cerrar;
    caja.querySelector('#vs-tour-sig').onclick = function () {
      if (i >= pasos.length - 1) { cerrar(); return; }
      i++; pintar();
    };
    if (i === pasos.length - 1) {
      var a = document.createElement('a');
      a.className = 'pl'; a.href = 'https://volley-stats.com'; a.textContent = T.planes;
      caja.appendChild(a);
    }
    if (el) {
      try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e2) {}
      setTimeout(function () { ubicar(el); }, 320);
      ubicar(el);
    } else {
      ubicar(null);
    }
  }

  function cerrar() {
    try { localStorage.setItem(LLAVE, '1'); } catch (e) {}
    try { capa.remove(); } catch (e2) {}
    window.removeEventListener('resize', alMover);
    window.removeEventListener('scroll', alMover, true);
  }

  function alMover() { if (capa && capa.isConnected) pintar(); }

  function abrir() {
    var l = idioma();
    T = TXT[l]; pasos = T.pasos;
    css();
    capa = document.createElement('div');
    capa.id = 'vs-tour';
    capa.setAttribute('data-notr', '');
    capa.innerHTML = '<div id="vs-tour-fondo"></div>' +
                     '<div id="vs-tour-hueco"></div>' +
                     '<div id="vs-tour-caja"></div>';
    document.body.appendChild(capa);
    hueco = document.getElementById('vs-tour-hueco');
    caja = document.getElementById('vs-tour-caja');
    capa.querySelector('#vs-tour-fondo').onclick = function (e) { e.stopPropagation(); };
    window.addEventListener('resize', alMover);
    window.addEventListener('scroll', alMover, true);
    pintar();
  }

  /* espera a que la puerta de registro se vaya */
  function esperar(intentos) {
    if (document.getElementById('demo-puerta')) {
      if (intentos > 0) { setTimeout(function () { esperar(intentos - 1); }, 700); }
      return;                       /* no entro: no hay nada que mostrarle */
    }
    abrir();
  }

  function arrancar() { setTimeout(function () { esperar(300); }, 1200); }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
'''
