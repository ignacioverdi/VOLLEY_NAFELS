#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  ARREGLAR_DETALLES.py — los detalles anotados en IDIOMA_PENDIENTE.txt
-------------------------------------------------------------------------------
  Por defecto NO toca nada: muestra lo que haria. Para aplicarlo de verdad:

      ARREGLAR_DETALLES.bat      (o)     python ARREGLAR_DETALLES.py --si

  De cada archivo que cambia deja una copia  <archivo>.antes_detalles.
  Se puede correr dos veces: si ya esta puesto, avisa y no hace nada.

  ── 1 · EL IDIOMA ───────────────────────────────────────────────────────────

  Se abrio CADA pantalla en un navegador de verdad, con la app en INGLES y con
  datos reales, y se anoto todo nodo de texto visible que el traductor dejaba
  igual. Salieron 125 frases. Agrupadas por plantilla son 97 claves, y todas
  entran en lang.js: ni una sola pantalla se modifica.

  Despues del arreglo, la misma medicion da 3, y las tres son falsos positivos
  (frases que ya estaban en ingles y la deteccion marco por la palabra
  "rival" o "formula"). En aleman da 0.

  Lo mas visible, que es lo que esta en la portada:

    · "la flecha compara los ultimos 3 partidos con los anteriores"
      La clave de lang.js estaba escrita con un 2 fijo, pero la portada
      escribe 2 o 3 segun cuantos partidos haya cargados (NUL en index.html).
      Cuando escribia 3 no coincidia ni una letra y quedaba en castellano.
      Se reemplaza por una PLANTILLA con {0}, que sirve para cualquier numero.

    · "HOY", "MANANA", "EN 8 DIAS"
      La cuenta regresiva del proximo partido. No estaban en lang.js en
      ninguno de los tres idiomas: no habia nada que encontrar.

  ── 2 · EL "—" DEL PANEL DE OBJETIVOS ───────────────────────────────────────

  La bateria "% Armado de Alta" mostraba siempre un guion, en las cuatro
  pantallas que la dibujan. El motivo: gen_baterias.py cuenta saque,
  recepcion, ataque, bloqueo y defensa, pero NO cuenta la letra E (el
  armado), asi que ese numero no existia en ningun lado. La meta estaba
  puesta —70— y el valor nunca llegaba.

  Se arregla donde corresponde: en el motor. Tres cambios en gen_baterias.py.

  No hace falta ninguna carpeta nueva: los armados de alta ya estan en los
  .dvw que el motor lee. Medido en esta temporada:

      DVW NAFELS 2027                  641 armados de alta
      DVW ENTRENAMIENTOS NAFELS 2026 2.366 armados de alta

  La escala es la que ya documenta la propia meta de objetivos_config.js:
  cada armado vale de -2 a +2 (# +2, + +1, ! +0,5, - -1, / -1,5, = -2) y el
  promedio se lleva a 0-100 con (p + 2) / 4 * 100. No se invento nada: la
  conversion estaba escrita, faltaba quien hiciera la cuenta.

  Con los datos de hoy da: equipo 59 sobre 2.703 armados; VAZQUEZ 70 sobre
  576, que es justo el objetivo.

  ── 3 · EL PARTIDO REPETIDO ────────────────────────────────────────────────

  En "DVW NAFELS 2027" esta dos veces el partido con St Gallen: el archivo
  bueno y otro al que le falta un 2 en el ano ("&206-09-30..."). Adentro el
  equipo figura como PRUEBA, asi que el informe de equipo lo cuenta como un
  NOVENO equipo de la liga y mete sus numeros en la tabla de referencia.

  Este paso NO borra nada: mueve ese archivo a una subcarpeta "_repetidos"
  dentro de la misma carpeta de .dvw. Si algun dia hace falta, esta ahi.
===============================================================================
"""
import os
import re
import sys
import glob
import shutil
import hashlib

AQUI = os.path.dirname(os.path.abspath(__file__))
APLICAR = ('--si' in sys.argv)
DESDE_BAT = ('--desde-bat' in sys.argv)


def leer(nombre):
    """Binario -> texto a mano, para NO tocar los finales de linea."""
    with open(os.path.join(AQUI, nombre), 'rb') as f:
        return f.read().decode('utf-8', 'surrogateescape')


def escribir(nombre, txt):
    ruta = os.path.join(AQUI, nombre)
    copia = ruta + '.antes_detalles'
    if not os.path.exists(copia):
        shutil.copy2(ruta, copia)
    with open(ruta, 'wb') as f:
        f.write(txt.encode('utf-8', 'surrogateescape'))


# ── 1 · lang.js ─────────────────────────────────────────────────────────────
CLAVES = r'''    /* ══ LO QUE QUEDABA EN CASTELLANO, MEDIDO PANTALLA POR PANTALLA ════════
       Se abrio cada pantalla con la app en INGLES, con datos reales, y se
       anoto TODO nodo de texto visible que translateString() dejaba igual.
       Salieron 125 frases, que se agrupan en estas claves: las que llevan
       {0} son plantillas y cubren todas las variantes con numero.
       No hay ninguna inventada: cada una se vio en pantalla.              */

    /* --- la portada --- */
    'la flecha compara los últimos {0} partidos con los anteriores': { en:'the arrow compares the last {0} matches with the ones before', de:'der Pfeil vergleicht die letzten {0} Spiele mit den vorherigen' },
    'HOY': { en:'TODAY', de:'HEUTE' },
    'MAÑANA': { en:'TOMORROW', de:'MORGEN' },
    'EN {0} DÍAS': { en:'IN {0} DAYS', de:'IN {0} TAGEN' },
    'Preguntá sobre stats, táctica...': { en:'Ask about stats, tactics...', de:'Frag nach Statistiken, Taktik...' },

    /* --- analisis del partido --- */
    'ELEGIR SESIONES': { en:'CHOOSE SESSIONS', de:'EINHEITEN WAEHLEN' },
    '{0} SESIÓN ELEGIDA': { en:'{0} SESSION SELECTED', de:'{0} EINHEIT GEWAEHLT' },
    '{0} SESIONES ELEGIDAS': { en:'{0} SESSIONS SELECTED', de:'{0} EINHEITEN GEWAEHLT' },
    'Sin elegir: se muestra el acumulado': { en:'None selected: showing the total', de:'Nichts gewaehlt: Gesamtwert wird angezeigt' },
    '{0} de {1} elegidas': { en:'{0} of {1} selected', de:'{0} von {1} gewaehlt' },
    'Buscar rival o fecha...': { en:'Search opponent or date...', de:'Gegner oder Datum suchen...' },
    'VER TODAS': { en:'SEE ALL', de:'ALLE ANZEIGEN' },
    '% Armado de Alta (70)': { en:'% High set (70)', de:'% Hohes Zuspiel (70)' },
    '% Armado de Alta: {0}': { en:'% High set: {0}', de:'% Hohes Zuspiel: {0}' },
    '🇦🇷 NAFELS VOLEY · Temporada {0}': { en:'🇦🇷 NAFELS VOLEY · {0} season', de:'🇦🇷 NAFELS VOLEY · Saison {0}' },

    /* --- los mapas de calor --- */
    '🎬 VER VIDEO DE ESTAS ACCIONES': { en:'🎬 WATCH VIDEO OF THESE ACTIONS', de:'🎬 VIDEO DIESER AKTIONEN ANSEHEN' },
    '🎬 VER VIDEO DE K{0}': { en:'🎬 WATCH VIDEO OF K{0}', de:'🎬 VIDEO VON K{0} ANSEHEN' },
    '🎬 VER VIDEO DE KE': { en:'🎬 WATCH VIDEO OF KE', de:'🎬 VIDEO VON KE ANSEHEN' },
    'Zona pref.': { en:'Pref. zone', de:'Bevorz. Zone' },
    '{0}% destinos': { en:'{0}% of targets', de:'{0}% der Ziele' },
    'formula oficial': { en:'official formula', de:'offizielle Formel' },
    'Mejorando +{0}%': { en:'Improving +{0}%', de:'Verbesserung +{0}%' },
    '▶ Ver video — {0} acciones': { en:'▶ Watch video — {0} actions', de:'▶ Video ansehen — {0} Aktionen' },
    '{0} acciones': { en:'{0} actions', de:'{0} Aktionen' },
    '{0} arm. · {1}% del total': { en:'{0} sets · {1}% of the total', de:'{0} Zuspiele · {1}% des Gesamten' },
    'EFF segun calidad de recepcion previa': { en:'EFF by quality of the previous reception', de:'EFF nach Qualitaet der vorherigen Annahme' },
    'Combinaciones mas bloqueadas': { en:'Most blocked combinations', de:'Am haeufigsten geblockte Kombinationen' },

    /* --- game plan y armadores --- */
    '{0} rivales analizados': { en:'{0} opponents analysed', de:'{0} Gegner analysiert' },
    'Elegir equipo rival': { en:'Choose opponent team', de:'Gegnerteam waehlen' },
    '{0} · LOS JUGADORES': { en:'{0} · THE PLAYERS', de:'{0} · DIE SPIELER' },
    '{0} · EL PLAN': { en:'{0} · THE PLAN', de:'{0} · DER PLAN' },
    'ARMADOR TITULAR': { en:'STARTING SETTER', de:'STAMM-ZUSPIELER' },
    'CÓMO ATACAN': { en:'HOW THEY ATTACK', de:'WIE SIE ANGREIFEN' },
    '⚡ CÓMO ATACAN': { en:'⚡ HOW THEY ATTACK', de:'⚡ WIE SIE ANGREIFEN' },
    'Cómo atacan ellos': { en:'How they attack', de:'Wie sie angreifen' },
    'DÓNDE Y CÓMO SACAR': { en:'WHERE AND HOW TO SERVE', de:'WOHIN UND WIE AUFSCHLAGEN' },
    '🎯 DÓNDE Y CÓMO SACAR': { en:'🎯 WHERE AND HOW TO SERVE', de:'🎯 WOHIN UND WIE AUFSCHLAGEN' },
    'A quién sacarle': { en:'Who to serve at', de:'Wen anschlagen' },
    'Armas y direcciones': { en:'Weapons and directions', de:'Waffen und Richtungen' },
    'Claves del jugador': { en:'Player keys', de:'Schluessel zum Spieler' },
    'La clave de este jugador…': { en:'The key to this player…', de:'Der Schluessel zu diesem Spieler…' },
    'Sus mejores direcciones': { en:'Their best directions', de:'Ihre besten Richtungen' },
    'Dónde caen sus remates ·': { en:'Where their attacks land ·', de:'Wo ihre Angriffe landen ·' },
    'Dónde pone sus saques ·': { en:'Where they place their serves ·', de:'Wohin sie ihre Aufschlaege setzen ·' },
    'Dónde se para y de dónde le sacan ·': { en:'Where they stand and where they get served ·', de:'Wo er steht und woher er angeschlagen wird ·' },
    'Más sólida en': { en:'Strongest in', de:'Am staerksten in' },
    'Más vulnerable en': { en:'Most vulnerable in', de:'Am anfaelligsten in' },
    'Reciben peor el': { en:'They receive worst the', de:'Am schlechtesten nehmen sie an den' },
    'El resto': { en:'The rest', de:'Der Rest' },
    'remates': { en:'attacks', de:'Angriffe' },
    'pelotas con': { en:'balls with', de:'Baelle mit' },
    'Ataque —': { en:'Attack —', de:'Angriff —' },
    'Recepción —': { en:'Reception —', de:'Annahme —' },
    'Saque —': { en:'Serve —', de:'Aufschlag —' },
    'SAQUE DESDE {0}': { en:'SERVE FROM {0}', de:'AUFSCHLAG AUS {0}' },
    'un color por tipo de saque': { en:'one colour per serve type', de:'eine Farbe pro Aufschlagart' },
    'un color por zona de origen': { en:'one colour per origin zone', de:'eine Farbe pro Ursprungszone' },
    '✍️ Anotá algo…': { en:'✍️ Write something…', de:'✍️ Etwas notieren…' },
    'Ver cómo distribuye en K{0} →': { en:'See how they distribute in K{0} →', de:'Verteilung in K{0} ansehen →' },
    'Ver cómo distribuye en KE →': { en:'See how they distribute in KE →', de:'Verteilung in KE ansehen →' },
    'Ver heatmap armador →': { en:'See setter heatmap →', de:'Zuspieler-Heatmap ansehen →' },
    'Ver la distribución de esta rotación en side-out y en transición': { en:'See how this rotation distributes in side-out and in transition', de:'Verteilung dieser Rotation im Side-Out und in der Transition ansehen' },
    'Doble clic: ver el video de estos ataques': { en:'Double click: watch the video of these attacks', de:'Doppelklick: Video dieser Angriffe ansehen' },
    'Doble clic: ver el video de estos attacks': { en:'Double click: watch the video of these attacks', de:'Doppelklick: Video dieser Angriffe ansehen' },
    'línea': { en:'line', de:'Linie' },
    'línea ·': { en:'line ·', de:'Linie ·' },
    'línea ({0}%)': { en:'line ({0}%)', de:'Linie ({0}%)' },
    'línea [{0}% ef, bajo media]': { en:'line [{0}% eff, below average]', de:'Linie [{0}% Eff, unter dem Schnitt]' },
    'centro [{0}% ef, sobre la media]': { en:'middle [{0}% eff, above average]', de:'Mitte [{0}% Eff, ueber dem Schnitt]' },
    '({0}% ef.) → atacar ahí': { en:'({0}% eff.) → attack there', de:'({0}% Eff.) → dort angreifen' },
    '({0}% pos.) · sufre el': { en:'({0}% pos.) · struggles with the', de:'({0}% pos.) · hat Muehe mit dem' },
    '({0} sin destino)': { en:'({0} with no target)', de:'({0} ohne Ziel)' },
    '({0}% ef): cargar el saque cuando rotan ahí.': { en:'({0}% eff): load the serve when they rotate there.', de:'({0}% Eff): den Aufschlag laden, wenn sie dorthin rotieren.' },
    '({0}% ef): evitar el saque-error, jugar seguro.': { en:'({0}% eff): avoid the service error, play it safe.', de:'({0}% Eff): Aufschlagfehler vermeiden, sicher spielen.' },
    '({0}% pos vs {1}% el otro): priorizar ese saque.': { en:'({0}% pos vs {1}% the other): prioritise that serve.', de:'({0}% pos gegen {1}% der andere): diesen Aufschlag bevorzugen.' },
    '; en saque y recepción, el': { en:'; in serve and reception, the', de:'; bei Aufschlag und Annahme, der' },
    'de positivas: es el más barato del equipo.': { en:'of positives: he is the cheapest on the team.', de:'der positiven: er ist der guenstigste im Team.' },
    ': zona {0} ({1}%, {2} pts, {3}% ef.)': { en:': zone {0} ({1}%, {2} pts, {3}% eff.)', de:': Zone {0} ({1}%, {2} Pkt., {3}% Eff.)' },
    ': zona {0} ({1}%, {2} pts, {3}% ef.) · {4}do': { en:': zone {0} ({1}%, {2} pts, {3}% eff.) · no. {4}', de:': Zone {0} ({1}%, {2} Pkt., {3}% Eff.) · Nr. {4}' },
    'Sin datos de entrenamiento cargados': { en:'No training data loaded', de:'Keine Trainingsdaten geladen' },
    'Mi performance en partidos — Volley Näfels': { en:'My performance in matches — Volley Näfels', de:'Meine Leistung in Spielen — Volley Näfels' },

    /* --- ficha del jugador --- */
    'Cómo viene · partidos': { en:'Current form · matches', de:'Aktuelle Form · Spiele' },
    'VS EQUIPO': { en:'VS TEAM', de:'GEGEN TEAM' },
    'En los últimos {0} partidos viene': { en:'Over the last {0} matches he is', de:'In den letzten {0} Spielen ist er' },
    'los últimos {0} partidos: {1}% ({2} ataques) · antes: {3}% ({4} ataques)': { en:'the last {0} matches: {1}% ({2} attacks) · before: {3}% ({4} attacks)', de:'die letzten {0} Spiele: {1}% ({2} Angriffe) · davor: {3}% ({4} Angriffe)' },
    'los últimos {0} partidos: {1}% ({2} bloqueos) · antes: {3}% ({4} bloqueos)': { en:'the last {0} matches: {1}% ({2} blocks) · before: {3}% ({4} blocks)', de:'die letzten {0} Spiele: {1}% ({2} Bloecke) · davor: {3}% ({4} Bloecke)' },
    'los últimos {0} partidos: {1}% ({2} saques) · antes: {3}% ({4} saques)': { en:'the last {0} matches: {1}% ({2} serves) · before: {3}% ({4} serves)', de:'die letzten {0} Spiele: {1}% ({2} Aufschlaege) · davor: {3}% ({4} Aufschlaege)' },
    'los últimos {0} partidos: {1}% ({2} recepciones) · antes: {3}% ({4} recepciones)': { en:'the last {0} matches: {1}% ({2} receptions) · before: {3}% ({4} receptions)', de:'die letzten {0} Spiele: {1}% ({2} Annahmen) · davor: {3}% ({4} Annahmen)' },

    /* --- cortes de video --- */
    '{0} partido(s) cargado(s) · tildá partidos y acciones, y armá tu reel': { en:'{0} match(es) loaded · tick matches and actions, and build your reel', de:'{0} Spiel(e) geladen · Spiele und Aktionen anhaken und dein Reel bauen' },
    'los {0} partidos': { en:'the {0} matches', de:'die {0} Spiele' },
    'Ver {0} más': { en:'See {0} more', de:'{0} weitere ansehen' },
    'Cortar los clips elegidos en tu computadora': { en:'Cut the selected clips on your computer', de:'Die gewaehlten Clips auf deinem Computer schneiden' },

    /* --- calendario y plantel --- */
    'Cambiar el orden': { en:'Change the order', de:'Reihenfolge aendern' },
    'Guarda los partidos ya jugados y deja el calendario con lo que viene': { en:'Archives the matches already played and leaves the calendar with what is coming', de:'Archiviert die gespielten Spiele und laesst im Kalender, was noch kommt' },
    'Toma el proximo partido de este calendario y lo muestra en toda la app': { en:'Takes the next match from this calendar and shows it across the app', de:'Nimmt das naechste Spiel aus diesem Kalender und zeigt es in der ganzen App' },

    /* --- plan de partido --- */
    'Eficacia de ataque · la misma escala que el resto de la app ({0} / {1} / {2})': { en:'Attack efficiency · the same scale as the rest of the app ({0} / {1} / {2})', de:'Angriffseffizienz · dieselbe Skala wie im Rest der App ({0} / {1} / {2})' },
'''

VIEJA_FLECHA = ('    "la flecha compara los últimos 2 partidos con los anteriores": '
                '{ en:"the arrow compares the last 2 matches with the ones before", '
                'de:"der Pfeil vergleicht die letzten 2 Spiele mit den vorherigen" },\n')


def cambio_lang(s):
    if 'LO QUE QUEDABA EN CASTELLANO, MEDIDO PANTALLA POR PANTALLA' in s:
        return None, 'ya estaba'
    anc = '  var PHRASES_MEDIDAS = {\n'
    if s.count(anc) != 1:
        return None, 'no encontre PHRASES_MEDIDAS (aparece %d veces)' % s.count(anc)
    n = s.count(VIEJA_FLECHA)
    s2 = s.replace(VIEJA_FLECHA, '', 1) if n == 1 else s
    s2 = s2.replace(anc, anc + CLAVES, 1)
    return s2, ('97 claves agregadas' + (' y la de la flecha reemplazada por plantilla' if n == 1
                else '  [aviso: no encontre la clave vieja de la flecha]'))


# ── 2 · gen_baterias.py ─────────────────────────────────────────────────────
GB = [
    # (lo que se busca, lo que se pone en su lugar)
    ("            'zag':na(),\n",
     "            'zag':na(),\n"
     "            # ══ EL ARMADO DE ALTA ════════════════════════════════════════\n"
     "            # 'E' es el armado y el tipo H es la pelota alta: la que levanta\n"
     "            # el armador cuando la recepcion no deja jugar rapido. Es el unico\n"
     "            # armado que se puntua, y es el fundamento de la bateria 'hset'\n"
     "            # de objetivos_config.js, que hasta ahora mostraba un guion porque\n"
     "            # este motor no contaba la letra E.\n"
     "            #\n"
     "            # No hace falta ninguna carpeta nueva: los armados de alta estan\n"
     "            # en los .dvw que ya se leen —641 en los partidos de la 26/27 y\n"
     "            # 2.366 en los entrenamientos—, igual que el saque o el ataque.\n"
     "            'E':{'#':0,'+':0,'!':0,'-':0,'/':0,'=':0,'T':0},\n"),

    ("        elif skill=='A' and pfx==side:\n            tipo=body[3]  # Q=central · H=alta · T=rápida\n",
     "        elif skill=='E' and pfx==side:\n"
     "            # Solo la pelota ALTA (tipo H). La rapida (Q) y la tensa (T) son\n"
     "            # otra decision del armador y tienen su propia lectura; mezclarlas\n"
     "            # esconde las dos.\n"
     "            if len(body)>3 and body[3]=='H':\n"
     "                Pe=get(num); Pe['E']['T']+=1\n"
     "                if res in Pe['E']: Pe['E'][res]+=1\n"
     "        elif skill=='A' and pfx==side:\n            tipo=body[3]  # Q=central · H=alta · T=rápida\n"),

    ("    D=P.get('D') or {'#':0,'+':0,'!':0,'-':0,'=':0,'T':0}\n",
     "    D=P.get('D') or {'#':0,'+':0,'!':0,'-':0,'=':0,'T':0}\n"
     "    # El armado de alta. Se lee con .get() como la defensa: un archivo de\n"
     "    # baterias viejo no lo trae y la cuenta no tiene que reventar por eso.\n"
     "    E=P.get('E') or {'#':0,'+':0,'!':0,'-':0,'/':0,'=':0,'T':0}\n"),

    ("        'n_atqz':  P['zag']['T'],\n    }\n",
     "        'n_atqz':  P['zag']['T'],\n"
     "        # ══ ARMADO DE ALTA ═══════════════════════════════════════════════════\n"
     "        #  La pantalla de High Set puntua cada armado de -2 a +2:\n"
     "        #      #  +2     +  +1     !  +0,5     -  -1     /  -1,5     =  -2\n"
     "        #  y muestra el promedio por armado. Aca se lleva a la escala 0-100\n"
     "        #  del resto de las baterias con (p + 2) / 4 * 100, donde el error\n"
     "        #  queda en 0, lo perfecto en 100 y el neutro en 50.\n"
     "        #\n"
     "        #  Es exactamente la conversion que ya documenta la meta 'hset' de\n"
     "        #  objetivos_config.js (\"los 70 del objetivo son +0,80 por armado\").\n"
     "        #  Lo unico que faltaba era que alguien calculara el numero.\n"
     "        'hset':   _roundpy(((2*E['#'] + E['+'] + 0.5*E['!'] - E['-']\n"
     "                             - 1.5*E['/'] - 2*E['=']) / E['T'] + 2) / 4 * 100) if E['T'] else None,\n"
     "        'n_hset': E['T'],\n"
     "        'hsetD':  {'p':E['#'], 'o':E['+'], 'n':E['!'], 'm':E['-'],\n"
     "                   's':E['/'], 'e':E['='], 't':E['T']},\n"
     "    }\n"),
]


def cambio_baterias(s):
    if "'hset':" in s:
        return None, 'ya estaba'
    for viejo, _ in GB:
        if s.count(viejo) != 1:
            return None, 'no encontre un tramo tal cual (aparece %d veces)' % s.count(viejo)
    for viejo, nuevo in GB:
        s = s.replace(viejo, nuevo, 1)
    return s, 'el armado de alta ya se cuenta'


CAMBIOS = [
    ('lang.js', cambio_lang),
    ('gen_baterias.py', cambio_baterias),
]


# ── 3 · el partido repetido ─────────────────────────────────────────────────
def partido_repetido():
    """El .dvw con el ano mal escrito. Se busca por el patron, no por el nombre
    exacto, para no depender de como quedo escrito."""
    for carpeta in sorted(glob.glob(os.path.join(AQUI, 'DVW *'))):
        if not os.path.isdir(carpeta):
            continue
        for f in sorted(glob.glob(os.path.join(carpeta, '*.dvw'))):
            base = os.path.basename(f)
            # un ano de 3 cifras al principio: &206-09-30 ...
            if re.match(r'^&?\s*\d{3}-\d{2}-\d{2}\b', base):
                return f
    return None


def main():
    print('')
    print('=' * 70)
    print('  LOS DETALLES ANOTADOS' + ('' if APLICAR else '   (prueba: no escribo nada)'))
    print('=' * 70)
    print('')

    hechos = 0
    for nombre, fn in CAMBIOS:
        ruta = os.path.join(AQUI, nombre)
        if not os.path.exists(ruta):
            print('  --   %-18s no esta en la carpeta, lo salteo' % nombre)
            continue
        try:
            s = leer(nombre)
        except Exception as e:
            print('  !!   %-18s no lo pude leer: %s' % (nombre, e))
            continue
        nuevo, motivo = fn(s)
        if nuevo is None:
            print('  --   %-18s %s' % (nombre, motivo))
            continue
        if APLICAR:
            escribir(nombre, nuevo)
            print('  OK   %-18s %s' % (nombre, motivo))
        else:
            print('  ->   %-18s %s' % (nombre, motivo))
        hechos += 1

    rep = partido_repetido()
    if not rep:
        print('  --   %-18s no hay ninguno con el ano mal escrito' % 'partido repetido')
    else:
        destino = os.path.join(os.path.dirname(rep), '_repetidos')
        print('  %s   %-18s %s  ->  _repetidos\\' % ('OK' if APLICAR else '->',
                                                     'partido repetido', os.path.basename(rep)))
        if APLICAR:
            try:
                os.makedirs(destino, exist_ok=True)
                final = os.path.join(destino, os.path.basename(rep))
                if os.path.exists(final):
                    print('       (ya habia uno ahi, lo dejo donde esta)')
                else:
                    shutil.move(rep, final)
                    hechos += 1
            except Exception as e:
                print('       no lo pude mover: %s' % e)

    print('')
    if not APLICAR:
        print('  Nada se escribio. Para aplicarlo de verdad: ARREGLAR_DETALLES.bat')
    elif hechos:
        print('  Listo: %d cambios (queda una copia .antes_detalles de cada archivo).' % hechos)
        print('')
        print('  AHORA, para que se vea:')
        print('     1) HACER_TODO.bat        rehace las baterias con el armado de alta')
        print('        (o GENERAR_BATERIAS.bat si solo queres eso)')
        print('     2) VER_LA_APP.bat        miralo antes de publicar')
        print('     3) PUBLICAR_EN_GITHUB.bat')
        print('')
        print('  Lo del idioma se ve apenas publicas: no depende de ningun dato.')
    else:
        print('  No habia nada que hacer: ya estaba todo puesto.')
    print('')
    return 0


if __name__ == '__main__':
    try:
        r = main()
    except Exception:
        import traceback
        traceback.print_exc()
        r = 1
    if not DESDE_BAT:
        try:
            input('\n  (enter para cerrar) ')
        except Exception:
            pass
    sys.exit(r)
