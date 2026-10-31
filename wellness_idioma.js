/* ══════════════════════════════════════════════════════════════════════════
   wellness_idioma.js  ·  EL WELLNESS EN LOS TRES IDIOMAS

   POR QUE EXISTE
   El menu salia en ingles y la encuesta en castellano. Eso no es un detalle
   de estilo: el plantel tiene jugadores que solo hablan ingles o aleman, y
   la pantalla donde se les pregunta como estan era justo la que no se
   traducia. Un jugador que no entiende la pregunta contesta cualquier cosa,
   y el dato que llega al cuerpo tecnico no sirve.

   POR QUE NO ALCANZABA lang.js
   lang.js traduce FRASES ENTERAS que ya estan dibujadas. Casi todo lo que
   escribe el wellness lleva un numero adentro —"tu normal: 8.3",
   "monotonia 2.4", "(3 dias)"— asi que la frase entera nunca es la misma
   dos veces y no hay forma de tenerla en un diccionario.

   QUE HACE ESTE ARCHIVO
   Traduce EN EL MOMENTO EN QUE SE ESCRIBE EL TEXTO, no despues. El
   diccionario esta ordenado por la frase en castellano —que es la que
   figura en el codigo— y las que llevan un dato adentro usan {0}, {1}.
   Asi el numero se arma aparte y la frase se traduce entera.

   Ventaja de hacerlo asi y no con el traductor de nodos: no hay parpadeo.
   El texto nace en el idioma que corresponde; no aparece en castellano y
   cambia medio segundo despues.

   COMO SE AGREGA UNA FRASE
   Se escribe la frase en castellano tal cual esta en el codigo y se le
   ponen sus dos traducciones. Si falta, queda en castellano y se ve: no
   rompe nada.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var D = {

    /* ── LAS SEIS PREGUNTAS ─────────────────────────────────────────────── */
    'Sueño':   { en:'Sleep',  de:'Schlaf' },
    'Energía': { en:'Energy', de:'Energie' },
    'Piernas': { en:'Legs',   de:'Beine' },
    'Cuerpo':  { en:'Body',   de:'Körper' },
    'Ánimo':   { en:'Mood',   de:'Stimmung' },
    'Cabeza':  { en:'Head',   de:'Kopf' },
    'Cuánto costó': { en:'How hard it was', de:'Wie hart es war' },

    'Cómo dormiste anoche: si te costó, si te despertaste, si descansaste.':
      { en:'Last night: trouble falling asleep, waking up, waking up rested.',
        de:'Letzte Nacht: Einschlafen, Aufwachen, erholt aufstehen.' },
    'Con cuántas ganas y cuánta nafta te levantaste hoy, antes de entrenar.':
      { en:'How much drive and fuel you woke up with today, before training.',
        de:'Mit wie viel Antrieb und Kraft du heute aufgestanden bist.' },
    'Cuánto te pesan o te tiran las piernas al subir una escalera o al saltar.':
      { en:'How heavy or tight your legs feel on stairs or when you jump.',
        de:'Wie schwer oder zäh die Beine auf der Treppe oder beim Sprung sind.' },
    'El resto del cuerpo: hombro, espalda, brazos. Sin contar las piernas.':
      { en:'The rest of the body: shoulder, back, arms. Legs not included.',
        de:'Der Rest des Körpers: Schulter, Rücken, Arme. Ohne die Beine.' },
    'Las ganas de estar hoy acá, con el grupo y con el entrenamiento.':
      { en:'How much you want to be here today, with the group and the training.',
        de:'Wie gern du heute hier bist, mit der Gruppe und dem Training.' },
    'Lo de afuera: estudio, trabajo, familia, viajes. Cuánto te está pesando.':
      { en:'Life outside: study, work, family, travel. How much it weighs on you.',
        de:'Alles ausserhalb: Studium, Arbeit, Familie, Reisen. Wie stark es belastet.' },
    'Lo exigente que SENTISTE la sesión que terminaste. Se contesta al final.':
      { en:'How demanding the session you just finished FELT. Answer at the end.',
        de:'Wie fordernd sich die beendete Einheit ANGEFÜHLT hat. Am Ende ausfüllen.' },

    /* los anclas del 1, el 5 y el 10 */
    'Casi no pegué un ojo':   { en:'Barely slept at all',   de:'Kaum ein Auge zugetan' },
    'Dormí, pero me desperté':{ en:'Slept, but woke up',    de:'Geschlafen, aber aufgewacht' },
    'De un tirón, impecable': { en:'Straight through',      de:'Durchgeschlafen' },
    'Fundido':                { en:'Drained',               de:'Ausgelaugt' },
    'Normal':                 { en:'Normal',                de:'Normal' },
    'A full':                 { en:'Full tank',             de:'Voll da' },
    'Durísimas, no saltan':   { en:'Dead, no jump',         de:'Bretthart, kein Sprung' },
    'Cargadas pero van':      { en:'Heavy but okay',        de:'Schwer, aber okay' },
    'Livianas, saltan solas': { en:'Light, springy',        de:'Leicht, federn von selbst' },
    'Me duele y me condiciona':{ en:'It hurts and limits me',de:'Es tut weh und schränkt ein' },
    'Alguna molestia':        { en:'Some discomfort',       de:'Etwas Beschwerden' },
    'Cero molestias':         { en:'No discomfort',         de:'Keine Beschwerden' },
    'No tengo ganas':         { en:'Not up for it',         de:'Keine Lust' },
    'Con todo':               { en:'All in',                de:'Voll dabei' },
    'Muy cargado':            { en:'Very loaded',           de:'Stark belastet' },
    'Algo':                   { en:'Some',                  de:'Etwas' },
    'Tranquilo':              { en:'Clear head',            de:'Entspannt' },
    'Muy suave':              { en:'Very easy',             de:'Sehr locker' },
    'Exigente':               { en:'Demanding',             de:'Fordernd' },
    'Lo máximo que doy':      { en:'The most I have',       de:'Mein Maximum' },

    /* ── LO QUE SE PREGUNTA APARTE ──────────────────────────────────────── */
    '¿Cuántas horas dormiste?': { en:'How many hours did you sleep?', de:'Wie viele Stunden hast du geschlafen?' },
    '¿Cuántos minutos duró?':   { en:'How many minutes did it last?', de:'Wie viele Minuten hat sie gedauert?' },
    'ej. 7.5': { en:'e.g. 7.5', de:'z. B. 7.5' },
    'ej. 90':  { en:'e.g. 90',  de:'z. B. 90' },
    /* ── los tres numeros del Whoop ─────────────── */
    'Si usás Whoop': { en:'If you use Whoop', de:'Wenn du Whoop nutzt' },
    'Recovery': { en:'Recovery', de:'Recovery' },
    'HRV': { en:'HRV', de:'HRV' },
    'Dormido': { en:'Slept', de:'Geschlafen' },
    'Los copiás de la app del Whoop a la mañana. Si no tenés, dejalos vacíos: no cambia nada.':
      { en:'Copy them from the Whoop app in the morning. If you do not have one, leave them empty: nothing changes.',
        de:'Morgens aus der Whoop-App abschreiben. Ohne Whoop einfach leer lassen: es ändert nichts.' },
    'ej. 72':  { en:'e.g. 72',  de:'z. B. 72' },
    'ej. 85':  { en:'e.g. 85',  de:'z. B. 85' },
    'ej. 7.4': { en:'e.g. 7.4', de:'z. B. 7.4' },
    'Opcional. Las horas y cómo dormiste no son lo mismo: 8 horas malas son 8 horas malas.':
      { en:'Optional. Hours and quality are not the same: 8 bad hours are 8 bad hours.',
        de:'Optional. Stunden und Qualität sind nicht dasselbe: 8 schlechte Stunden bleiben 8 schlechte Stunden.' },
    'Con esto el esfuerzo pasa a ser carga de verdad: RPE × minutos. Si lo dejás vacío se estiman 90.':
      { en:'This turns effort into real load: RPE × minutes. Left empty, 90 are assumed.',
        de:'Damit wird aus Anstrengung echte Belastung: RPE × Minuten. Leer bleibt, werden 90 angenommen.' },

    /* ── CONTRA SU PROPIO NORMAL ────────────────────────────────────────── */
    'todavía sin referencia':      { en:'no baseline yet',           de:'noch keine Referenz' },
    'MUY por debajo de tu normal': { en:'WELL below your normal',    de:'DEUTLICH unter deinem Normalwert' },
    'por debajo de tu normal':     { en:'below your normal',         de:'unter deinem Normalwert' },
    'por encima de tu normal':     { en:'above your normal',         de:'über deinem Normalwert' },
    'como siempre':                { en:'as usual',                  de:'wie immer' },
    '· tu normal: {0}':            { en:'· your normal: {0}',        de:'· dein Normalwert: {0}' },
    'Tu normal se arma con unos días más de respuestas.':
      { en:'Your normal builds up after a few more days of answers.',
        de:'Dein Normalwert entsteht nach ein paar weiteren Tagen.' },

    /* ── LA CARGA ───────────────────────────────────────────────────────── */
    'Sin sesiones cargadas esta semana.': { en:'No sessions logged this week.', de:'Diese Woche keine Einheiten erfasst.' },
    'Carga en orden.':                    { en:'Load is fine.',                de:'Belastung in Ordnung.' },
    'la carga subió de golpe (aguda:crónica {0})':
      { en:'load jumped up (acute:chronic {0})', de:'Belastung sprunghaft gestiegen (akut:chronisch {0})' },
    'viene entrenando bastante menos que las semanas anteriores':
      { en:'training a lot less than the previous weeks', de:'trainiert deutlich weniger als in den Vorwochen' },
    'todos los días parecidos (monotonía {0}): falta un día suave':
      { en:'every day alike (monotony {0}): a light day is missing', de:'alle Tage gleich (Monotonie {0}): ein lockerer Tag fehlt' },
    'Tu carga':        { en:'Your load',      de:'Deine Belastung' },
    'Esta semana':     { en:'This week',      de:'Diese Woche' },
    'Monotonía':       { en:'Monotony',       de:'Monotonie' },
    'Aguda:crónica':   { en:'Acute:chronic',  de:'Akut:chronisch' },
    'RPE × minutos, últimos 7 días':       { en:'RPE × minutes, last 7 days',        de:'RPE × Minuten, letzte 7 Tage' },
    'Arriba de 2: todos los días iguales': { en:'Above 2: every day the same',       de:'Über 2: jeden Tag dasselbe' },
    'Esta semana contra el promedio de 4': { en:'This week against the 4-week mean', de:'Diese Woche gegen den 4-Wochen-Schnitt' },
    'Alguna sesión no tiene los minutos cargados: ahí se estimaron 90.':
      { en:'Some session has no minutes logged: 90 were assumed there.',
        de:'Bei einer Einheit fehlen die Minuten: dort wurden 90 angenommen.' },

    /* ── EL MAPA DEL CUERPO ─────────────────────────────────────────────── */
    'Mapa del cuerpo': { en:'Body map', de:'Körperkarte' },
    'No se pudo cargar el mapa del cuerpo.': { en:'The body map could not be loaded.', de:'Die Körperkarte konnte nicht geladen werden.' },
    'Frente':  { en:'Front',  de:'Vorne' },
    'Espalda': { en:'Back',   de:'Hinten' },
    'Quitar':  { en:'Remove', de:'Entfernen' },
    'Ya no me duele': { en:'It no longer hurts', de:'Tut nicht mehr weh' },
    'Tocá la zona que te molesta. Si no te duele nada, no toques nada: está perfecto así.':
      { en:'Tap the area that bothers you. If nothing hurts, tap nothing — that is perfect.',
        de:'Tippe auf die Stelle, die dich stört. Wenn nichts wehtut, tippe nichts an – das ist perfekt.' },
    'Lo que marcaste': { en:'What you marked', de:'Was du markiert hast' },
    '· se ve del otro lado': { en:'· shown on the other side', de:'· auf der anderen Seite sichtbar' },
    'Molesta':        { en:'Bothers me',   de:'Stört' },
    'Me condiciona':  { en:'Limits me',    de:'Schränkt ein' },
    'No puedo':       { en:'Cannot train', de:'Geht nicht' },
    'La siento, pero juego igual': { en:'I feel it, but I play', de:'Spürbar, aber ich spiele' },
    'Juego, pero no al 100%':      { en:'I play, but not at 100%', de:'Ich spiele, aber nicht zu 100%' },
    'Así no puedo entrenar':       { en:'I cannot train like this', de:'So kann ich nicht trainieren' },
    'primer día':  { en:'first day',     de:'erster Tag' },
    'mejorando':   { en:'improving',     de:'besser' },
    'empeorando':  { en:'getting worse', de:'schlechter' },
    'igual':       { en:'same',          de:'gleich' },

    /* ── LAS ZONAS DEL CUERPO ───────────────────────────────────────────── */
    'Cuello':            { en:'Neck',            de:'Nacken' },
    'Trapecio':          { en:'Trapezius',       de:'Trapez' },
    'Hombro izquierdo':  { en:'Left shoulder',   de:'Linke Schulter' },
    'Hombro derecho':    { en:'Right shoulder',  de:'Rechte Schulter' },
    'Pectorales':        { en:'Chest',           de:'Brust' },
    'Espalda alta':      { en:'Upper back',      de:'Oberer Rücken' },
    'Lumbares':          { en:'Lower back',      de:'Unterer Rücken' },
    'Abdominales':       { en:'Abs',             de:'Bauch' },
    'Oblicuos':          { en:'Obliques',        de:'Seitliche Bauchmuskeln' },
    'Bíceps izquierdo':  { en:'Left biceps',     de:'Linker Bizeps' },
    'Bíceps derecho':    { en:'Right biceps',    de:'Rechter Bizeps' },
    'Tríceps izquierdo': { en:'Left triceps',    de:'Linker Trizeps' },
    'Tríceps derecho':   { en:'Right triceps',   de:'Rechter Trizeps' },
    'Antebrazo y muñeca izq.': { en:'Left forearm & wrist',  de:'Linker Unterarm & Handgelenk' },
    'Antebrazo y muñeca der.': { en:'Right forearm & wrist', de:'Rechter Unterarm & Handgelenk' },
    'Glúteos':           { en:'Glutes',          de:'Gesäss' },
    'Aductores':         { en:'Adductors',       de:'Adduktoren' },
    'Cuádriceps izquierdo': { en:'Left quad',    de:'Linker Quadrizeps' },
    'Cuádriceps derecho':   { en:'Right quad',   de:'Rechter Quadrizeps' },
    'Isquios izquierdo': { en:'Left hamstring',  de:'Hamstrings links' },
    'Isquios derecho':   { en:'Right hamstring', de:'Hamstrings rechts' },
    'Rodilla izquierda': { en:'Left knee',       de:'Linkes Knie' },
    'Rodilla derecha':   { en:'Right knee',      de:'Rechtes Knie' },
    'Tibia izquierda':   { en:'Left shin',       de:'Linkes Schienbein' },
    'Tibia derecha':     { en:'Right shin',      de:'Rechtes Schienbein' },
    'Gemelo izquierdo':  { en:'Left calf',       de:'Linke Wade' },
    'Gemelo derecho':    { en:'Right calf',      de:'Rechte Wade' },
    'Aquiles izquierdo': { en:'Left Achilles',   de:'Linke Achillessehne' },
    'Aquiles derecho':   { en:'Right Achilles',  de:'Rechte Achillessehne' },

    /* ── LA DEVOLUCION AL GUARDAR ───────────────────────────────────────── */
    'Elegí un jugador.': { en:'Choose a player.', de:'Wähle einen Spieler.' },
    'Tu wellness de hoy': { en:'Your wellness today', de:'Dein Wellness heute' },
    'Tu normal de las últimas 3 semanas es {0}% · sobre {1} respuestas':
      { en:'Your normal over the last 3 weeks is {0}% · from {1} answers',
        de:'Dein Normalwert der letzten 3 Wochen ist {0}% · aus {1} Antworten' },
    'Todavía no tenés suficientes días cargados para comparar.':
      { en:'Not enough days logged yet to compare.', de:'Noch nicht genug Tage erfasst, um zu vergleichen.' },
    'Con 4 respuestas ya te digo cómo venís contra vos mismo.':
      { en:'From 4 answers on I can tell you how you are doing against yourself.',
        de:'Ab 4 Antworten sage ich dir, wie du im Vergleich zu dir selbst dastehst.' },
    '{0} es lo que más te bajó':      { en:'{0} dropped the most',             de:'{0} ist am stärksten abgefallen' },
    '{0} es lo mejor que traés hoy':  { en:'{0} is the best you bring today',  de:'{0} ist heute dein stärkster Wert' },
    '{0}/10 · tu normal {1}':         { en:'{0}/10 · your normal {1}',         de:'{0}/10 · dein Normalwert {1}' },
    'Marcaste {0} zona':              { en:'You marked {0} area',              de:'{0} Stelle markiert' },
    'Marcaste {0} zonas':             { en:'You marked {0} areas',             de:'{0} Stellen markiert' },
    '— el cuerpo técnico lo ve en el parte de hoy.':
      { en:'— the staff sees it in today’s report.', de:'— das Trainerteam sieht es im Tagesbericht.' },
    'Ver tu preparación física →': { en:'See your physical prep →', de:'Zu deiner Athletik →' },

    /* ── EL HISTORIAL ───────────────────────────────────────────────────── */
    'Tu normal': { en:'Your normal', de:'Dein Normalwert' },
    'Promedio propio de las últimas 3 semanas: {0} sobre {1} respuestas. Es contra esto que se mide tu día, no contra el 100.':
      { en:'Your own average over the last 3 weeks: {0} from {1} answers. Your day is measured against this, not against 100.',
        de:'Dein eigener Schnitt der letzten 3 Wochen: {0} aus {1} Antworten. Daran wird dein Tag gemessen, nicht an 100.' },
    'Tus molestias de hoy': { en:'Your complaints today', de:'Deine Beschwerden heute' },
    '({0} día)':  { en:'({0} day)',  de:'({0} Tag)' },
    '({0} días)': { en:'({0} days)', de:'({0} Tage)' },

    /* ── EL PARTE DEL DIA ───────────────────────────────────────────────── */
    'Entrenan':      { en:'Training',     de:'Trainieren' },
    'Limitados':     { en:'Limited',      de:'Eingeschränkt' },
    'No entrenan':   { en:'Not training', de:'Trainieren nicht' },
    'Sin reportar':  { en:'Not reported', de:'Nicht gemeldet' },
    'Entrena':       { en:'Trains',       de:'Trainiert' },
    'Limitado':      { en:'Limited',      de:'Eingeschränkt' },
    'No entrena':    { en:'Not training', de:'Trainiert nicht' },
    'sin reportar':  { en:'not reported', de:'nicht gemeldet' },
    'Todavía no reportaron': { en:'Have not reported yet', de:'Noch nicht gemeldet' },
    'Requiere atención':     { en:'Needs attention',       de:'Braucht Aufmerksamkeit' },
    'Nadie en rojo hoy. El plantel llega bien.':
      { en:'Nobody in red today. The squad is arriving well.', de:'Heute niemand im roten Bereich. Der Kader kommt gut an.' },
    'El resto del plantel': { en:'The rest of the squad', de:'Der restliche Kader' },
    'Lo que le bajó contra lo suyo: {0}.':
      { en:'What dropped against his own normal: {0}.', de:'Was gegenüber seinem Normalwert abgefallen ist: {0}.' },
    'Durmió {0} h.': { en:'Slept {0} h.', de:'{0} h geschlafen.' },
    'No cargó la encuesta de este día.': { en:'Did not fill in the survey for this day.', de:'Hat die Umfrage für diesen Tag nicht ausgefüllt.' },
    'Molestias:': { en:'Complaints:', de:'Beschwerden:' },
    'Carga:':     { en:'Load:',       de:'Belastung:' },
    '{0}, {1}d':  { en:'{0}, {1}d',   de:'{0}, {1} T' },
    '{0} esta semana · monotonía {1} · aguda:crónica {2}':
      { en:'{0} this week · monotony {1} · acute:chronic {2}',
        de:'{0} diese Woche · Monotonie {1} · akut:chronisch {2}' },
    'Nota del cuerpo técnico:': { en:'Note from the staff:', de:'Notiz des Trainerteams:' },
    'Nota para el jugador: por qué, y qué sí puede hacer':
      { en:'Note for the player: why, and what he can still do',
        de:'Notiz für den Spieler: warum, und was er trotzdem machen kann' }
  };

  function idioma() {
    try { if (typeof window.getLang === 'function') return window.getLang(); } catch (e) {}
    try { var l = localStorage.getItem('vb_lang'); if (l === 'en' || l === 'de' || l === 'es') return l; } catch (e) {}
    return 'es';
  }

  /* La frase, con los datos puestos adentro. Si no esta en el diccionario
     queda en castellano: se ve que falta y no se rompe nada. */
  function T(es) {
    var args = Array.prototype.slice.call(arguments, 1);
    var l = idioma();
    var txt = es;
    if (l !== 'es') {
      var e = D[es];
      if (e && e[l]) txt = e[l];
    }
    return String(txt).replace(/\{(\d+)\}/g, function (_, n) {
      var v = args[+n];
      return (v === undefined || v === null) ? '' : v;
    });
  }

  /* En castellano y en ingles una palabra suelta va en minuscula dentro de
     una frase; en aleman los sustantivos van SIEMPRE con mayuscula, asi que
     ahi se deja como esta. */
  function TBaja(es) {
    var t = T(es);
    return (idioma() === 'de') ? t : t.toLocaleLowerCase();
  }

  /* Los miles y los decimales no se escriben igual en los tres idiomas. */
  function locale() {
    var l = idioma();
    return l === 'en' ? 'en-GB' : l === 'de' ? 'de-CH' : 'es-AR';
  }
  function num(n) {
    try { return Number(n).toLocaleString(locale()); } catch (e) { return String(n); }
  }

  window.wpT     = T;
  window.wpTBaja = TBaja;
  window.wpNum   = num;
  window.wpIdioma = idioma;
})();

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
