// ═══════════════════════════════════════════════════════════════════════════
//  lang.js — Motor de idiomas (Español / English / Deutsch)
//  - Arma el selector ES/EN/DE en el contenedor #lang-wrap.
//  - Traduce todo elemento con  data-t="clave"  (texto) y  data-t-ph="clave"
//    (placeholder de inputs). Guarda la elección en este dispositivo.
//  - NO toca las valoraciones de DataVolley (Perfecta/Positiva/Exclamativa/…,
//    Ace, Punto/Bloqueado, etc.): esas son estándar profesional y van igual en
//    los tres idiomas, por eso no se marcan con data-t.
//
//  Términos de vóley en alemán verificados con la VBL-Wiki (wiki oficial de
//  DataVolley de la liga alemana) y referencias de vóley en alemán.
//
//  Para sumar textos nuevos: poné  data-t="mi_clave"  en el HTML y agregá la
//  clave acá abajo con sus tres idiomas.
// ═══════════════════════════════════════════════════════════════════════════
(function(){
  "use strict";

  var LANGS  = ['es','en','de'];
  var LABELS = { es:'ES', en:'EN', de:'DE' };
  var STORE  = 'vb_lang';

  // ── Diccionario ───────────────────────────────────────────────────────────
  var T = {
    // --- Navegación / accesos (index) ---
    acceso_rapido:    { es:'Acceso rápido',     en:'Quick access',          de:'Schnellzugriff' },
    panel_vivo:       { es:'Panel en Vivo',     en:'Live Panel',            de:'Live-Panel' },
    en_vivo:          { es:'En vivo',           en:'Live',                  de:'Live' },
    game_plan:        { es:'Plan de Juego',     en:'Game Plan',             de:'Matchplan' },
    historial:        { es:'Historial',         en:'History',               de:'Verlauf' },
    equipo:           { es:'Equipo',            en:'Team',                  de:'Mannschaft' },
    prep_fisica:      { es:'Preparación Física',en:'Physical Preparation',  de:'Athletiktraining' },
    wellness:         { es:'Wellness',           en:'Wellness',             de:'Wellness' },
    wellness_sub:     { es:'Estado físico diario',en:'Daily physical state', de:'Täglicher körperlicher Zustand' },
    d_wellness_tail:  { es:'Encuesta del 1 al 10 post-entrenamiento y tabla de cómo viene cada jugador.',en:'A 1-to-10 survey after training and a table of how each player is doing.',de:'Eine Umfrage von 1 bis 10 nach dem Training und eine Tabelle dazu, wie es jedem Spieler geht.' },
    prep_fisica_sub:  { es:'Rutinas personalizadas por jugador', en:'Personalized routines per player', de:'Personalisierte Programme pro Spieler' },

    // --- Estado del sistema ---
    estado_sistema:   { es:'Estado del sistema',en:'System status',         de:'Systemstatus' },
    operativo:        { es:'Operativo',         en:'Operational',           de:'Betriebsbereit' },
    en_desarrollo:    { es:'En desarrollo',     en:'In development',        de:'In Entwicklung' },
    dev_banner:       { es:'Sección en desarrollo activo · Los datos se guardan en este dispositivo',
                        en:'Section under active development · Data is saved on this device',
                        de:'Bereich in aktiver Entwicklung · Daten werden auf diesem Gerät gespeichert' },

    // --- Selección de jugador ---
    selecciona_jugador:      { es:'Seleccioná un jugador',  en:'Select a player',  de:'Spieler auswählen' },
    // --- Login / PIN ---
    pin_ingresar:     { es:'Ingresar',              en:'Sign in',                    de:'Anmelden' },
    pin_sel_nombre:   { es:'Seleccioná tu nombre',  en:'Select your name',           de:'Wähle deinen Namen' },
    pin_num_camiseta: { es:'número de camiseta',    en:'jersey number',              de:'Trikotnummer' },
    pin_ej_camiseta:  { es:'Ej: camiseta',          en:'E.g. jersey',                de:'z.B. Trikot' },
    pin_elegi_nombre: { es:'— Elegí tu nombre —',   en:'— Select your name —',       de:'— Wähle deinen Namen —' },
    pin_entrar:       { es:'ENTRAR',                en:'ENTER',                      de:'EINTRETEN' },
    pin_continuar:    { es:'Continuar sin ingresar',en:'Continue without signing in',de:'Ohne Anmeldung fortfahren' },
    selecciona_jugador_rut:  { es:'Seleccioná tu nombre para ver tu rutina personalizada',
                               en:'Select your name to see your personalized routine',
                               de:'Wähle deinen Namen, um dein persönliches Programm zu sehen' },

    // --- Calculadora física ---
    calc_titulo:  { es:'Calculadora de Carga',  en:'Load Calculator',       de:'Lastrechner' },
    calc_sub:     { es:'1RM & Progresión',      en:'1RM & Progression',     de:'1RM & Progression' },
    calc_peso:    { es:'Peso levantado (kg)',   en:'Weight lifted (kg)',    de:'Gehobenes Gewicht (kg)' },
    calc_reps:    { es:'Repeticiones',          en:'Repetitions',           de:'Wiederholungen' },
    calc_formula: { es:'Fórmula',               en:'Formula',               de:'Formel' },
    calc_btn:     { es:'CALCULAR 1RM Y PROGRESIÓN', en:'CALCULATE 1RM & PROGRESSION', de:'1RM & PROGRESSION BERECHNEN' },

    // --- Fundamentos (títulos de sección) — alemán según VBL-Wiki ---
    fund_ataque:    { es:'Ataque',       en:'Attack',          de:'Angriff' },
    fund_saque:     { es:'Saque',        en:'Serve',           de:'Aufschlag' },
    fund_recepcion: { es:'Recepción',    en:'Reception',       de:'Annahme' },
    fund_bloqueo:   { es:'Bloqueo',      en:'Block',           de:'Block' },
    fund_armado:    { es:'Armado',       en:'Set',             de:'Zuspiel' },
    fund_defensa:   { es:'Defensa',      en:'Dig',             de:'Abwehr' },

    // --- Posiciones — alemán según VBL-Wiki / refs alemanas ---
    pos_armador:  { es:'Armador',   en:'Setter',         de:'Zuspieler' },
    pos_central:  { es:'Central',   en:'Middle Blocker', de:'Mittelblocker' },
    pos_opuesto:  { es:'Opuesto',   en:'Opposite',       de:'Diagonalspieler' },
    pos_punta:    { es:'Punta',     en:'Outside Hitter', de:'Außenangreifer' },
    pos_libero:   { es:'Líbero',    en:'Libero',         de:'Libero' },

    // --- Términos generales de stats ---
    g_analisis:      { es:'Análisis',      en:'Analysis',      de:'Analyse' },
    g_temporada:     { es:'Temporada',     en:'Season',        de:'Saison' },
    g_jugador:       { es:'Jugador',       en:'Player',        de:'Spieler' },
    g_partido:       { es:'Partido',       en:'Match',         de:'Spiel' },
    g_entrenamiento: { es:'Entrenamiento', en:'Training',      de:'Training' },
    g_rival:         { es:'Rival',         en:'Opponent',      de:'Gegner' },
    g_eficiencia:    { es:'Eficiencia',    en:'Efficiency',    de:'Effizienz' },
    g_total:         { es:'Total',         en:'Total',         de:'Gesamt' },
    g_puntos:        { es:'Puntos',        en:'Points',        de:'Punkte' },

    // --- Página / botón de Temporadas ---
    temp_menu:        { es:'Temporadas',         en:'Seasons',          de:'Saisons' },
    temp_volver:      { es:'Volver al actual',   en:'Back to current',  de:'Zurück zur aktuellen' },
    temp_titulo:      { es:'Temporadas',         en:'Seasons',          de:'Saisons' },
    temp_sub:         { es:'Elegí una temporada para ver sus estadísticas.',
                        en:'Choose a season to view its statistics.',
                        de:'Wähle eine Saison, um ihre Statistiken zu sehen.' },
    temp_en_curso:    { es:'Temporada en curso', en:'Current season',   de:'Laufende Saison' },
    temp_actual:      { es:'Temporada actual',   en:'Current season',   de:'Aktuelle Saison' },
    temp_actual_det:  { es:'Datos en vivo · se actualiza con cada partido',
                        en:'Live data · updates with every match',
                        de:'Live-Daten · wird mit jedem Spiel aktualisiert' },
    temp_badge_curso: { es:'En curso',           en:'Current',          de:'Aktuell' },
    temp_anteriores:  { es:'Temporadas anteriores', en:'Previous seasons', de:'Frühere Saisons' },
    temp_archivo_det: { es:'Archivo · solo lectura', en:'Archive · read-only', de:'Archiv · schreibgeschützt' },
    temp_badge_arch:  { es:'Archivo',            en:'Archive',          de:'Archiv' },
    temp_vacio:       { es:'Todavía no hay temporadas archivadas. Cuando termine la temporada, se agregan acá automáticamente.',
                        en:'No archived seasons yet. They are added here automatically when a season ends.',
                        de:'Noch keine archivierten Saisons. Sie werden automatisch hinzugefügt, wenn eine Saison endet.' },
    temp_temporada:   { es:'Temporada',          en:'Season',           de:'Saison' },

    // --- index (Tanda 1) ---
    // --- jugador (Tanda 1) ---
    // --- dashboard (Tanda 1) ---
    // --- compartidas (Tandas 2-4) ---
    g_posicion: { es:"Posición", en:"Position", de:"Position" },
    g_promedio: { es:"Promedio", en:"Average", de:"Durchschnitt" },
    pos_receptor: { es:"Receptor", en:"Outside Hitter", de:"Außenangreifer" },
    g_set: { es:"Set", en:"Set", de:"Satz" },
    g_sets: { es:"Sets", en:"Sets", de:"Sätze" },
    g_fecha: { es:"Fecha", en:"Date", de:"Datum" },
    g_resultado: { es:"Resultado", en:"Result", de:"Ergebnis" },
    d_mi_perf: { es:"MI PERFORMANCE VS EQUIPO", en:"MY PERFORMANCE VS TEAM", de:"MEINE LEISTUNG VS MANNSCHAFT" },
    d_resumen: { es:"Resumen del equipo", en:"Team summary", de:"Mannschafts-Übersicht" },
    d_objetivos: { es:"Objetivos", en:"Goals", de:"Ziele" },
    d_tipo: { es:"Tipo", en:"Type", de:"Typ" },
    d_todos: { es:"Todos", en:"All", de:"Alle" },
    d_sesion: { es:"Sesión", en:"Session", de:"Session" },
    d_por_jugador: { es:"Por jugador", en:"By player", de:"Pro Spieler" },
    d_analisis_rivales: { es:"Análisis de Rivales", en:"Opponent analysis", de:"Gegner-Analyse" },
    d_nombre: { es:"Nombre", en:"Name", de:"Name" },
    d_distribucion: { es:"Distribución", en:"Distribution", de:"Verteilung" },
    d_totales: { es:"TOTALES", en:"TOTALS", de:"GESAMT" },
    d_sin_datos: { es:"Sin datos cargados", en:"No data loaded", de:"Keine Daten geladen" },
    j_comparativa: { es:"Comparativa vs Equipo y Posición", en:"Comparison vs Team and Position", de:"Vergleich mit Mannschaft und Position" },
    j_stats_acum: { es:"Estadísticas acumuladas", en:"Cumulative statistics", de:"Kumulierte Statistiken" },
    j_prox_rutina: { es:"Próxima rutina", en:"Next routine", de:"Nächstes Programm" },
    j_partido: { es:"PARTIDO", en:"MATCH", de:"SPIEL" },
    j_entrenamiento: { es:"ENTRENAMIENTO", en:"TRAINING", de:"TRAINING" },
    club_sub: { es:"Sistema de Análisis · NLA Suiza 2026/27", en:"Analysis System · Swiss NLA 2026/27", de:"Analysesystem · NLA Schweiz 2026/27" },
    sec_fixture: { es:"📅 Fixture · NLA Suiza 2026/27", en:"📅 Fixture · Swiss NLA 2026/27", de:"📅 Spielplan · NLA Schweiz 2026/27" },
    c_stats_liga: { es:"Estadísticas Liga", en:"League Stats", de:"Liga-Statistik" },
    c_importar_dvw: { es:"Importar DVW", en:"Import DVW", de:"DVW importieren" },
    c_pizarron: { es:"Pizarrón", en:"Whiteboard", de:"Taktiktafel" },
    b_analisis_hist: { es:"Análisis histórico", en:"Historical analysis", de:"Historische Analyse" },
    b_individual: { es:"Individual", en:"Individual", de:"Individuell" },
    b_detallado: { es:"Detallado", en:"Detailed", de:"Detailliert" },
    b_liga_nla: { es:"Liga NLA", en:"NLA League", de:"NLA-Liga" },
    b_entrenador: { es:"Entrenador", en:"Coach", de:"Trainer" },
    b_proximamente: { es:"Próximamente", en:"Coming soon", de:"Demnächst" },
    chip1: { es:"DV4 en tiempo real", en:"DV4 in real time", de:"DV4 in Echtzeit" },
    chip2: { es:"Dirección de saque", en:"Serve direction", de:"Aufschlagrichtung" },
    chip3: { es:"Filtros por fundamento", en:"Filters by skill", de:"Filter nach Element" },
    d_panel: { es:"Stats en tiempo real durante el entrenamiento o partido. Saque, recepción, ataque y bloqueo con visualización táctica de la cancha.", en:"Real-time stats during training or matches. Serve, reception, attack and block with tactical court visualization.", de:"Echtzeit-Statistiken im Training oder Spiel. Aufschlag, Annahme, Angriff und Block mit taktischer Feldvisualisierung." },
    d_historial: { es:"Stats acumulados por jugador y equipo. Comparativas, tendencias y evolución por período. Filtros por entrenamiento o partido.", en:"Cumulative stats by player and team. Comparisons, trends and evolution by period. Filters by training or match.", de:"Kumulierte Statistiken pro Spieler und Mannschaft. Vergleiche, Trends und Entwicklung nach Zeitraum. Filter nach Training oder Spiel." },
    d_equipo: { es:"Plantel completo con fotos, posiciones y acceso al perfil individual de cada jugador.", en:"Full roster with photos, positions and access to each player's individual profile.", de:"Kompletter Kader mit Fotos, Positionen und Zugang zum Einzelprofil jedes Spielers." },
    d_analisis: { es:"Stats detalladas por partido o acumulado. Saque, recepción, ataque y bloqueo con todos los valores.", en:"Detailed stats by match or cumulative. Serve, reception, attack and block with all values.", de:"Detaillierte Statistiken pro Spiel oder kumuliert. Aufschlag, Annahme, Angriff und Block mit allen Werten." },
    d_stats_liga: { es:"Base de datos completa NLA 2026/27. Ranking por equipo y stats individuales de toda la liga. Ataque, saque, recepción y bloqueo.", en:"Complete NLA 2026/27 database. Team ranking and individual stats for the whole league. Attack, serve, reception and block.", de:"Komplette NLA-Datenbank 2026/27. Mannschafts-Ranking und Einzelstatistiken der ganzen Liga. Angriff, Aufschlag, Annahme und Block." },
    d_heatmaps: { es:"Análisis visual por jugador. Ataque, saque, recepción y armado con heatmaps de zonas, EFF y tendencias.", en:"Visual analysis by player. Attack, serve, reception and setting with zone heatmaps, EFF and trends.", de:"Visuelle Analyse pro Spieler. Angriff, Aufschlag, Annahme und Zuspiel mit Zonen-Heatmaps, EFF und Trends." },
    d_importar: { es:"Subí el archivo .dvw de DataVolley y el sistema parsea todas las acciones automáticamente.", en:"Upload the DataVolley .dvw file and the system parses all actions automatically.", de:"Lade die DataVolley-.dvw-Datei hoch und das System verarbeitet alle Aktionen automatisch." },
    d_dashboard: { es:"Progreso de todos los jugadores en tiempo real. Quién cargó los pesos, quién no, y comparativa del equipo.", en:"All players' progress in real time. Who logged their weights, who didn't, and team comparison.", de:"Fortschritt aller Spieler in Echtzeit. Wer seine Gewichte eingetragen hat, wer nicht, und Mannschaftsvergleich." },
    d_pizarron: { es:"Vista para la tele. Rutina del día con todos los jugadores y pesos editables en tiempo real.", en:"TV view. The day's routine with all players and weights editable in real time.", de:"TV-Ansicht. Das Tagesprogramm mit allen Spielern und in Echtzeit editierbaren Gewichten." },
    d_baggerone: { es:"Tabla de posiciones, armado de equipos, registro de sets y podio con fotos.", en:"Standings, team building, set log and podium with photos.", de:"Tabelle, Teameinteilung, Satz-Protokoll und Podium mit Fotos." },
    d_planjuego: { es:"Analisis tactico del rival. Ataques, saques y zonas preferidas por jugador.", en:"Tactical analysis of the opponent. Attacks, serves and preferred zones by player.", de:"Taktische Analyse des Gegners. Angriffe, Aufschläge und bevorzugte Zonen pro Spieler." },
    d_videos: { es:"Videoteca de acciones, clips por jugador y análisis de jugadas específicas vinculadas al plan de juego.", en:"Action video library, clips by player and analysis of specific plays linked to the game plan.", de:"Video-Bibliothek mit Aktionen, Clips pro Spieler und Analyse einzelner Spielzüge, verknüpft mit dem Matchplan." },
    d_prep_tail: { es:"Registrá tus pesos por serie, seguí tu progresión y calculá cargas de entrenamiento.", en:"Log your weights per set, track your progression and calculate training loads.", de:"Trage deine Gewichte pro Satz ein, verfolge deinen Fortschritt und berechne die Trainingslasten." }
  };

  // expone el diccionario por si otros scripts (ej. el menú) quieren traducir
  window.LANG_T = T;

  function getLang(){
    var l = null;
    try { l = localStorage.getItem(STORE); } catch(e){}
    return (LANGS.indexOf(l) >= 0) ? l : 'es';
  }
  window.getLang = getLang;

  function tr(key, lang){
    var e = T[key];
    if (!e) return null;
    return e[lang] || e.es || null;
  }
  window.tr = tr;

  // ═══ MOTOR DE TRADUCCIÓN POR TEXTO (sin necesidad de data-t) ═══════════════
  //  Traduce cualquier texto en español que esté en este diccionario, incluso
  //  el contenido generado dinámicamente por JS (tablas, etiquetas, etc.).
  var PHRASES_EXTRA = {
    // ===== PLAN DE PARTIDO (scouting interactivo) =====
    "Distribución del armador":{en:"Setter distribution",de:"Zuspielerverteilung"},
    "Análisis del rival":{en:"Opponent analysis",de:"Gegneranalyse"},
    "Armador":{en:"Setter",de:"Zuspieler"},
    "Rotación":{en:"Rotation",de:"Rotation"},
    "Fase":{en:"Phase",de:"Phase"},
    "Transición":{en:"Transition",de:"Transition"},
    "Llamada":{en:"Call",de:"Ansage"},
    "armados":{en:"sets",de:"Zuspiele"},
    "pelotas armadas":{en:"balls set",de:"gespielte Bälle"},
    "distribución":{en:"distribution",de:"Verteilung"},
    "punto":{en:"point",de:"Punkt"},
    "Acciones":{en:"Actions",de:"Aktionen"},
    "Guardar":{en:"Save",de:"Speichern"},
    "Guardado":{en:"Saved",de:"Gespeichert"},
    "Solo seleccionadas":{en:"Selected only",de:"Nur ausgewählte"},
    "Todas":{en:"All",de:"Alle"},
    "Toda":{en:"All",de:"Alle"},
    "Todo":{en:"All",de:"Alle"},
    "Ninguna":{en:"None",de:"Keine"},
    "Ninguno":{en:"None",de:"Keine"},
    "Filtrar":{en:"Filter",de:"Filter"},
    "Partidos":{en:"Matches",de:"Spiele"},
    "Partido":{en:"Match",de:"Spiel"},
    "Puntas":{en:"Outside hitters",de:"Außenangreifer"},
    "Centrales":{en:"Middles",de:"Mittelblocker"},
    "Opuestos":{en:"Opposites",de:"Diagonalangreifer"},
    "espejo":{en:"mirror",de:"gespiegelt"},
    "espejado":{en:"mirrored",de:"gespiegelt"},
    "vista del rival":{en:"opponent view",de:"Gegneransicht"},
    "primer tiempo":{en:"quick",de:"Schnellangriff"},
    "Repetir":{en:"Repeat",de:"Wiederholen"},
    "Antes":{en:"Before",de:"Vorher"},
    "Después":{en:"After",de:"Nachher"},
    "zona":{en:"zone",de:"Zone"},
    "sin video":{en:"no video",de:"kein Video"},
    "Resultado":{en:"Result",de:"Ergebnis"},
    "Recibe":{en:"Receives",de:"nimmt an"},
    "Recep. desde":{en:"Rec. from",de:"Annahme aus"},
    "Momento":{en:"Moment",de:"Zeitpunkt"},
    "Desde":{en:"From",de:"Aus"},
    "Potencia":{en:"Power",de:"Kraft"},
    "Flotado":{en:"Float",de:"Flatteraufschlag"},
    "Doble-click":{en:"Double-click",de:"Doppelklick"},
    // ===== BARRIDO COMPLETO (analisis, scouting, prep, etc.) =====
    "EQUIPO — Axpo Volley Näfels":{en:"TEAM — Axpo Volley Näfels",de:"TEAM — Axpo Volley Näfels"},
    "PIZARRÓN — Axpo Volley Näfels":{en:"WHITEBOARD — Axpo Volley Näfels",de:"TAKTIKTAFEL — Axpo Volley Näfels"},
    "PREPARACIÓN FÍSICA — Axpo Volley Näfels":{en:"PHYSICAL PREP — Axpo Volley Näfels",de:"ATHLETIK — Axpo Volley Näfels"},
    "Recepción — Nafels Voley":{en:"Reception — Nafels Voley",de:"Annahme — Nafels Voley"},
    "Scouting Rival — Nafels Voley":{en:"Opponent Scouting — Nafels Voley",de:"Gegner-Scouting — Nafels Voley"},
    "Comparador — Näfels vs Rival":{en:"Comparator — Näfels vs Opponent",de:"Vergleich — Näfels vs Gegner"},
    "Plan de Partido — Näfels":{en:"Match Plan — Näfels",de:"Matchplan — Näfels"},
    "Cargar Videos — Näfels":{en:"Upload Videos — Näfels",de:"Videos hochladen — Näfels"},
    "Mi Performance — Nafels Voley":{en:"My Performance — Nafels Voley",de:"Meine Leistung — Nafels Voley"},
    "Análisis de Partidos — NAFELS VOLEY":{en:"Match Analysis — NAFELS VOLEY",de:"Spielanalyse — NAFELS VOLEY"},
    "Análisis táctico de rivales — Volley Näfels":{en:"Opponent tactical analysis — Volley Näfels",de:"Taktische Gegneranalyse — Volley Näfels"},
    "Volley Nafels — Análisis Liga":{en:"Volley Nafels — League Analysis",de:"Volley Nafels — Liga-Analyse"},
    "NLA Suiza 2026/27 — Estadísticas Liga":{en:"Swiss NLA 2026/27 — League Stats",de:"Schweizer NLA 2026/27 — Liga-Statistiken"},
    "Analisis de Armado — Nafels 2026":{en:"Setting Analysis — Nafels 2026",de:"Zuspiel-Analyse — Nafels 2026"},
    "Analisis de Ataque — Nafels 2026":{en:"Attack Analysis — Nafels 2026",de:"Angriffsanalyse — Nafels 2026"},
    "ANALISIS DE SAQUE — Nafels 2026":{en:"SERVE ANALYSIS — Nafels 2026",de:"AUFSCHLAGANALYSE — Nafels 2026"},
    "NAFELS VOLEY · Rutina del día":{en:"NAFELS VOLEY · Routine of the day",de:"NAFELS VOLEY · Tagesprogramm"},
    "Acceso rápido":{en:"Quick access",de:"Schnellzugriff"},
    "ACUMULADO (todos los partidos)":{en:"CUMULATIVE (all matches)",de:"KUMULIERT (alle Spiele)"},
    "Análisis de Rivales":{en:"Opponent Analysis",de:"Gegneranalyse"},
    "Análisis DV4":{en:"DV4 Analysis",de:"DV4-Analyse"},
    "Apretar el saque en":{en:"Press the serve on",de:"Aufschlag erhöhen auf"},
    "Armador rival:":{en:"Opponent setter:",de:"Gegner-Zuspieler:"},
    "Arrastrá el archivo aquí":{en:"Drag the file here",de:"Datei hierher ziehen"},
    "Arrastrá o seleccioná el archivo .dvw exportado de DataVolley 4":{en:"Drag or select the .dvw file exported from DataVolley 4",de:"Ziehe oder wähle die aus DataVolley 4 exportierte .dvw-Datei"},
    "Asignar por orden de fecha":{en:"Assign by date order",de:"Nach Datum zuordnen"},
    "Ataque · Saque · Rec · Armado":{en:"Attack · Serve · Rec · Setting",de:"Angriff · Aufschlag · Ann · Zuspiel"},
    "Axpo Volley Näfels · Cuerpo técnico":{en:"Axpo Volley Näfels · Coaching staff",de:"Axpo Volley Näfels · Trainerstab"},
    "Ayuda al bloqueo":{en:"Block help",de:"Blockhilfe"},
    "Baja a la diagonal corta":{en:"Drops to the short cross",de:"Geht auf die kurze Diagonale"},
    "Bloqueo a la pelota":{en:"Block on the ball",de:"Block am Ball"},
    "Bloqueo en ZONA 2 (lado opuesto) — a la pelota, tapa y abre diagonal":{en:"Block in ZONE 2 (opposite side) — on the ball, covers and opens the cross",de:"Block in ZONE 2 (Gegenseite) — am Ball, deckt und öffnet die Diagonale"},
    "Bloqueo en ZONA 4 (lado opuesto) — a la pelota, tapa y abre diagonal":{en:"Block in ZONE 4 (opposite side) — on the ball, covers and opens the cross",de:"Block in ZONE 4 (Gegenseite) — am Ball, deckt und öffnet die Diagonale"},
    "Bloqueo primer tiempo":{en:"First-tempo block",de:"Block gegen Schnellangriff"},
    "Cada jugador tiene su rutina personalizada.":{en:"Each player has their personalized routine.",de:"Jeder Spieler hat sein persönliches Programm."},
    "Calidad recepción":{en:"Reception quality",de:"Annahmequalität"},
    "Cargar":{en:"Load",de:"Laden"},
    "Cargar partido":{en:"Load match",de:"Spiel laden"},
    "Cargá el bloqueo a ellos.":{en:"Load the block on them.",de:"Block auf sie ausrichten."},
    "Categoría":{en:"Category",de:"Kategorie"},
    "Clickeá un casillero para ver esas defensas en video 🎬":{en:"Click a cell to see those defenses on video 🎬",de:"Klicke auf eine Zelle, um diese Abwehraktionen im Video zu sehen 🎬"},
    "Combinaciones de ataque":{en:"Attack combinations",de:"Angriffskombinationen"},
    "Combinación":{en:"Combination",de:"Kombination"},
    "Comparacion Side Out vs Transicion por rival":{en:"Side-out vs Transition comparison by opponent",de:"Side-out vs. Transition Vergleich pro Gegner"},
    "Comparación directa de rendimiento":{en:"Direct performance comparison",de:"Direkter Leistungsvergleich"},
    "Cubre el toque":{en:"Covers the tip",de:"Deckt den Lob"},
    "Cuerpo Técnico":{en:"Coaching staff",de:"Trainerstab"},
    "Cómo reciben · dónde atacar":{en:"How they receive · where to attack",de:"Wie sie annehmen · wohin angreifen"},
    "Cómo redistribuye el armador su juego (dato histórico)":{en:"How the setter redistributes their game (historical data)",de:"Wie der Zuspieler sein Spiel verteilt (historische Daten)"},
    "Cómo se usa:":{en:"How to use:",de:"So funktioniert es:"},
    "Datos en vivo · se actualiza con cada partido":{en:"Live data · updates with each match",de:"Live-Daten · aktualisiert sich mit jedem Spiel"},
    "De dónde atacaron":{en:"Where they attacked from",de:"Woher sie angegriffen haben"},
    "Del. Centro (3)":{en:"Mid. Front (3)",de:"Mitte vorne (3)"},
    "Del. Der. (2)":{en:"Front Right (2)",de:"Vorne rechts (2)"},
    "Del. Izq. (4)":{en:"Front Left (4)",de:"Vorne links (4)"},
    "Desde Zona 1":{en:"From Zone 1",de:"Aus Zone 1"},
    "Desde Zona 5":{en:"From Zone 5",de:"Aus Zone 5"},
    "Desde Zona 6":{en:"From Zone 6",de:"Aus Zone 6"},
    "Distribución del juego":{en:"Game distribution",de:"Spielverteilung"},
    "Dossier del próximo rival · NLA Suiza":{en:"Next opponent dossier · Swiss NLA",de:"Dossier des nächsten Gegners · Schweizer NLA"},
    "DV4 Equipo":{en:"DV4 Team",de:"DV4 Team"},
    "Día de rutina":{en:"Routine day",de:"Programmtag"},
    "EFF del ataque por rival":{en:"Attack EFF by opponent",de:"Angriffs-EFF pro Gegner"},
    "EFF · Zonas · Por rival":{en:"EFF · Zones · By opponent",de:"EFF · Zonen · Pro Gegner"},
    "Eficiencia Ataque Alta":{en:"High-ball attack efficiency",de:"Angriffseffizienz hoher Ball"},
    "Eficiencia Saque":{en:"Serve efficiency",de:"Aufschlageffizienz"},
    "El profe todavía no cargó la rutina.":{en:"The coach has not loaded the routine yet.",de:"Der Trainer hat das Programm noch nicht eingetragen."},
    "Elegí el día de rutina":{en:"Choose the routine day",de:"Programmtag wählen"},
    "Elegí primero":{en:"Choose first",de:"Zuerst wählen"},
    "Elegí qué posición neutralizar para ver hacia dónde se vuelca el armador:":{en:"Choose which position to neutralize to see where the setter leans:",de:"Wähle, welche Position neutralisiert wird, um zu sehen, wohin der Zuspieler tendiert:"},
    "Elegí si es Partido o Entrenamiento y completá el rival":{en:"Choose whether it is a Match or Training and fill in the opponent",de:"Wähle Spiel oder Training und trage den Gegner ein"},
    "Elegí un jugador o partido en la izquierda,":{en:"Choose a player or match on the left,",de:"Wähle links einen Spieler oder ein Spiel,"},
    "Elegí un rival para comparar.":{en:"Choose an opponent to compare.",de:"Wähle einen Gegner zum Vergleichen."},
    "Elegí una temporada para ver sus estadísticas.":{en:"Choose a season to see its stats.",de:"Wähle eine Saison, um ihre Statistiken zu sehen."},
    "Equipo A":{en:"Team A",de:"Team A"},
    "Equipo B":{en:"Team B",de:"Team B"},
    "Estado del sistema":{en:"System status",de:"Systemstatus"},
    "Este día no tiene ejercicios cargados aún":{en:"This day has no exercises loaded yet",de:"Für diesen Tag sind noch keine Übungen eingetragen"},
    "Evolución del equipo partido a partido":{en:"Team evolution match by match",de:"Team-Entwicklung Spiel für Spiel"},
    "Función de recepción no disponible":{en:"Reception function not available",de:"Annahme-Funktion nicht verfügbar"},
    "Fórmula":{en:"Formula",de:"Formel"},
    "Hacia dónde":{en:"Where to",de:"Wohin"},
    "Híbrido":{en:"Hybrid",de:"Hybrid"},
    "Imagen no disponible. Subila a la carpeta /imagenes/ del repo.":{en:"Image not available. Upload it to the /imagenes/ folder of the repo.",de:"Bild nicht verfügbar. Lade es in den Ordner /imagenes/ des Repos."},
    "Ingresá el peso máximo que levantaste y las reps para calcular tu":{en:"Enter the max weight you lifted and the reps to calculate your",de:"Gib das maximale Gewicht und die Wiederholungen ein, um dein"},
    "Juego corrido · sin recepción · armado por el setter":{en:"Transition · no reception · set by the setter",de:"Transition · ohne Annahme · vom Zuspieler gestellt"},
    "Juego segun posicion del armador":{en:"Game by setter position",de:"Spiel nach Zuspieler-Position"},
    "Jugador no encontrado":{en:"Player not found",de:"Spieler nicht gefunden"},
    "Llamadas que usa":{en:"Calls they use",de:"Verwendete Calls"},
    "Los videos se cargan desde":{en:"Videos are loaded from",de:"Videos werden geladen von"},
    "luego la categoría, y acá aparecen los clips.":{en:"then the category, and the clips appear here.",de:"dann die Kategorie, und hier erscheinen die Clips."},
    "Límite 1-9, paso izquierda":{en:"Limit 1-9, step left",de:"Limit 1-9, Schritt links"},
    "Límite 5-7, paso derecha":{en:"Limit 5-7, step right",de:"Limit 5-7, Schritt rechts"},
    "Mín. ataques":{en:"Min. attacks",de:"Min. Angriffe"},
    "No hay partidos en el historial.":{en:"No matches in the history.",de:"Keine Spiele im Verlauf."},
    "No se pudieron cargar los datos.":{en:"Could not load the data.",de:"Daten konnten nicht geladen werden."},
    "o hacé clic para seleccionar · Formato: .dvw (DataVolley 4)":{en:"or click to select · Format: .dvw (DataVolley 4)",de:"oder klicken zum Auswählen · Format: .dvw (DataVolley 4)"},
    "Objetivos del Dia":{en:"Goals of the Day",de:"Tagesziele"},
    "Objetivos del equipo · 2026":{en:"Team goals · 2026",de:"Teamziele · 2026"},
    "Orden de rotación real:":{en:"Actual rotation order:",de:"Tatsächliche Rotationsreihenfolge:"},
    "para verlos.":{en:"to see them.",de:"um sie zu sehen."},
    "Partido procesado":{en:"Match processed",de:"Spiel verarbeitet"},
    "partidos analizados · scouting basado en datos reales":{en:"matches analyzed · scouting based on real data",de:"Spiele analysiert · Scouting auf Basis echter Daten"},
    "Plan de Juego":{en:"Game Plan",de:"Matchplan"},
    "Planificación táctica":{en:"Tactical planning",de:"Taktische Planung"},
    "Pocos datos.":{en:"Little data.",de:"Wenige Daten."},
    "Por jugador":{en:"By player",de:"Pro Spieler"},
    "Posición armador":{en:"Setter position",de:"Zuspieler-Position"},
    "Preparador físico":{en:"Physical coach",de:"Athletiktrainer"},
    "Próximo":{en:"Next",de:"Nächstes"},
    "Jugado":{en:"Played",de:"Gespielt"},
    "Puntos de bloqueo por partido":{en:"Block points per match",de:"Blockpunkte pro Spiel"},
    "Quién":{en:"Who",de:"Wer"},
    "Qué produce cada llamada":{en:"What each call produces",de:"Was jeder Call bringt"},
    "Registrá tus pesos en cada sesión para seguir tu progreso.":{en:"Log your weights each session to track your progress.",de:"Erfasse deine Gewichte in jeder Session, um deinen Fortschritt zu verfolgen."},
    "REMATADORES — cómo bloquearle y defenderle":{en:"HITTERS — how to block and defend them",de:"ANGREIFER — wie man sie blockt und verteidigt"},
    "Resumen del equipo":{en:"Team summary",de:"Team-Übersicht"},
    "Revisás el resumen y guardás — se agrega al historial automáticamente":{en:"You review the summary and save — it is added to the history automatically",de:"Du prüfst die Übersicht und speicherst — sie wird automatisch zum Verlauf hinzugefügt"},
    "Sacar fuerte y cargar el bloqueo a ellos.":{en:"Serve hard and load the block on them.",de:"Hart aufschlagen und den Block auf sie ausrichten."},
    "Sacándole fuerte a":{en:"Serving hard at",de:"Hart aufschlagen auf"},
    "Saque / Recepción":{en:"Serve / Reception",de:"Aufschlag / Annahme"},
    "Saque desde Zona 1":{en:"Serve from Zone 1",de:"Aufschlag aus Zone 1"},
    "Saque desde Zona 5":{en:"Serve from Zone 5",de:"Aufschlag aus Zone 5"},
    "Saque desde Zona 6":{en:"Serve from Zone 6",de:"Aufschlag aus Zone 6"},
    "Saque flotado":{en:"Float serve",de:"Flatteraufschlag"},
    "Saque potencia":{en:"Power serve",de:"Kraftaufschlag"},
    "SAQUE — a quién, cómo y dónde":{en:"SERVE — to whom, how and where",de:"AUFSCHLAG — an wen, wie und wo"},
    "Scouting Rival":{en:"Opponent Scouting",de:"Gegner-Scouting"},
    "Selecciona un armador para comenzar":{en:"Select a setter to start",de:"Wähle einen Zuspieler zum Starten"},
    "Seleccioná el día arriba para ver la rutina completa":{en:"Select the day above to see the full routine",de:"Wähle oben den Tag, um das ganze Programm zu sehen"},
    "Seleccioná tu nombre para ver tu rutina personalizada":{en:"Select your name to see your personalized routine",de:"Wähle deinen Namen, um dein persönliches Programm zu sehen"},
    "Sin ataques en entrenamientos":{en:"No attacks in trainings",de:"Keine Angriffe im Training"},
    "Sin ataques registrados":{en:"No attacks recorded",de:"Keine Angriffe erfasst"},
    "Sin compañeros de la misma posición para comparar.":{en:"No teammates in the same position to compare.",de:"Keine Mitspieler auf derselben Position zum Vergleichen."},
    "Sin datos cargados":{en:"No data loaded",de:"Keine Daten geladen"},
    "Sin datos de ataque":{en:"No attack data",de:"Keine Angriffsdaten"},
    "Sin datos de dirección":{en:"No direction data",de:"Keine Richtungsdaten"},
    "Sin datos de equipo":{en:"No team data",de:"Keine Teamdaten"},
    "Sin datos de historial":{en:"No history data",de:"Keine Verlaufsdaten"},
    "Sin datos de partido":{en:"No match data",de:"Keine Spieldaten"},
    "Sin datos de recepción":{en:"No reception data",de:"Keine Annahmedaten"},
    "Sin datos de recepción en entrenamientos":{en:"No reception data in trainings",de:"Keine Annahmedaten im Training"},
    "Sin datos de recepción rival cargados":{en:"No opponent reception data loaded",de:"Keine Gegner-Annahmedaten geladen"},
    "Sin datos de saque":{en:"No serve data",de:"Keine Aufschlagdaten"},
    "Sin datos DV4":{en:"No DV4 data",de:"Keine DV4-Daten"},
    "Sin datos para este jugador":{en:"No data for this player",de:"Keine Daten für diesen Spieler"},
    "Sin datos suficientes":{en:"Not enough data",de:"Nicht genug Daten"},
    "Sin defensas registradas":{en:"No defenses recorded",de:"Keine Abwehraktionen erfasst"},
    "Sin mínimo":{en:"No minimum",de:"Kein Minimum"},
    "Sin participación registrada":{en:"No participation recorded",de:"Keine Teilnahme erfasst"},
    "Sin partidos registrados aún":{en:"No matches recorded yet",de:"Noch keine Spiele erfasst"},
    "Sin resultados con los filtros actuales":{en:"No results with the current filters",de:"Keine Ergebnisse mit den aktuellen Filtern"},
    "Sin rutina para este día":{en:"No routine for this day",de:"Kein Programm für diesen Tag"},
    "Sin saques en entrenamientos":{en:"No serves in trainings",de:"Keine Aufschläge im Training"},
    "Sin saques registrados":{en:"No serves recorded",de:"Keine Aufschläge erfasst"},
    "Sin sesiones para este jugador":{en:"No sessions for this player",de:"Keine Sessions für diesen Spieler"},
    "Sin videos cargados.":{en:"No videos loaded.",de:"Keine Videos geladen."},
    "Sin videos en esta categoría":{en:"No videos in this category",de:"Keine Videos in dieser Kategorie"},
    "Sistema de Análisis · NLA":{en:"Analysis System · NLA",de:"Analyse-System · NLA"},
    "Sube a posición 7":{en:"Moves up to position 7",de:"Rückt auf Position 7"},
    "Sube a posición 9":{en:"Moves up to position 9",de:"Rückt auf Position 9"},
    "sólida":{en:"solid",de:"solide"},
    "Súper rápido":{en:"Super fast",de:"Super schnell"},
    "Temporada actual":{en:"Current season",de:"Aktuelle Saison"},
    "Temporada en curso":{en:"Season in progress",de:"Laufende Saison"},
    "Tipo de sesión":{en:"Session type",de:"Session-Typ"},
    "Todavía no hay días cargados.":{en:"No days loaded yet.",de:"Noch keine Tage eingetragen."},
    "Ver Game Plan":{en:"See Game Plan",de:"Matchplan ansehen"},
    "Ver heatmap de defensa con video →":{en:"See defense heatmap with video →",de:"Abwehr-Heatmap mit Video ansehen →"},
    "ver wellness →":{en:"see wellness →",de:"Wellness ansehen →"},
    "vs RIVAL":{en:"vs OPPONENT",de:"vs GEGNER"},
    "— Elegí el día —":{en:"— Choose the day —",de:"— Wähle den Tag —"},
    "— Elegí un rival —":{en:"— Choose an opponent —",de:"— Wähle einen Gegner —"},
    "— Elegí —":{en:"— Choose —",de:"— Wählen —"},
    "— sin jugadores con rutina este mes —":{en:"— no players with a routine this month —",de:"— keine Spieler mit Programm diesen Monat —"},
    "— tildá para armar tu recorte":{en:"— check to build your clip",de:"— ankreuzen, um deinen Clip zu erstellen"},
    "← Prep Física":{en:"← Physical Prep",de:"← Athletik"},
    "ver en YouTube":{en:"watch on YouTube",de:"auf YouTube ansehen"},
    "Tu lectura táctica...":{en:"Your tactical read...",de:"Deine taktische Lesart..."},
    "ataque":{en:"attack",de:"Angriff"},
    "saque":{en:"serve",de:"Aufschlag"},
    "equipo":{en:"team",de:"Team"},
    "zona":{en:"zone",de:"Zone"},
    "⚙️ Configuración":{en:"⚙️ Settings",de:"⚙️ Einstellungen"},
    "⚡ Ataque":{en:"⚡ Attack",de:"⚡ Angriff"},
    "💥 Ataque":{en:"💥 Attack",de:"💥 Angriff"},
    "⚡ Cómo funciona":{en:"⚡ How it works",de:"⚡ So funktioniert es"},
    "⚡ Pegado masivo — cargar todos los links de una":{en:"⚡ Bulk paste — load all links at once",de:"⚡ Sammeleinfügen — alle Links auf einmal laden"},
    "⚡ Reels rápidos:":{en:"⚡ Quick reels:",de:"⚡ Schnelle Reels:"},
    "⚡ Saque":{en:"⚡ Serve",de:"⚡ Aufschlag"},
    "⬆️ Saque":{en:"⬆️ Serve",de:"⬆️ Aufschlag"},
    "❌ Errores de saque":{en:"❌ Serve errors",de:"❌ Aufschlagfehler"},
    "🆚 Partido":{en:"🆚 Match",de:"🆚 Spiel"},
    "🎬 Cargar videos de los partidos":{en:"🎬 Upload match videos",de:"🎬 Spielvideos hochladen"},
    "🎯 vs Equipo":{en:"🎯 vs Team",de:"🎯 vs Team"},
    "🏆 Partido oficial":{en:"🏆 Official match",de:"🏆 Offizielles Spiel"},
    "🏐 Pizarrón":{en:"🏐 Whiteboard",de:"🏐 Taktiktafel"},
    "👥 Equipo":{en:"👥 Team",de:"👥 Team"},
    "👥 Estado del equipo":{en:"👥 Team status",de:"👥 Team-Status"},
    "💪 Prep. Física":{en:"💪 Physical Prep",de:"💪 Athletik"},
    "📅 Por sesión":{en:"📅 By session",de:"📅 Pro Session"},
    "📈 Análisis":{en:"📈 Analysis",de:"📈 Analyse"},
    "📈 Tu historial":{en:"📈 Your history",de:"📈 Dein Verlauf"},
    "📊 Análisis de Partidos":{en:"📊 Match Analysis",de:"📊 Spielanalyse"},
    "📋 Indicación del profe":{en:"📋 Coach note",de:"📋 Trainer-Hinweis"},
    "📋 Plan de partido":{en:"📋 Match plan",de:"📋 Matchplan"},
    "📝 Encuesta del día":{en:"📝 Survey of the day",de:"📝 Umfrage des Tages"},
    "🔄 TRANSICIÓN (juego corrido)":{en:"🔄 TRANSITION",de:"🔄 TRANSITION"},
    "🔑 Claves del partido":{en:"🔑 Match keys",de:"🔑 Spiel-Schlüssel"},
    "🛡 Recepción":{en:"🛡 Reception",de:"🛡 Annahme"},
    "🛡 SIDE-OUT (tras recepción)":{en:"🛡 SIDE-OUT (after reception)",de:"🛡 SIDE-OUT (nach Annahme)"},
    "🤚 Bloqueo":{en:"🤚 Block",de:"🤚 Block"},
    "🧤 DEFENSA · datos de partidos (NLA)":{en:"🧤 DEFENSE · match data (NLA)",de:"🧤 ABWEHR · Spieldaten (NLA)"},
    "⚖ Comparar con Näfels":{en:"⚖ Compare with Näfels",de:"⚖ Mit Näfels vergleichen"},
    "1° zona":{en:"1st zone",de:"1. Zone"},
    "2° zona":{en:"2nd zone",de:"2. Zone"},
    "(P = zona del armador). La":{en:"(P = setter zone). The",de:"(P = Zuspieler-Zone). Die"},
    "(vs su promedio de temporada).":{en:"(vs their season average).",de:"(vs. ihrem Saisondurchschnitt)."},
    ". Elegí un fundamento para ver quién lo está haciendo y en qué forma viene":{en:". Choose a skill to see who is doing it and what form they are in",de:". Wähle ein Element, um zu sehen, wer es macht und in welcher Form"},
    "= cada pelota con la zona a la que la manda (Z1 derecha · Z5 izq · Z6/7/8/9 fondo).":{en:"= each ball with the zone it is sent to (Z1 right · Z5 left · Z6/7/8/9 back).",de:"= jeder Ball mit der Zone, in die er gespielt wird (Z1 rechts · Z5 links · Z6/7/8/9 hinten)."},
    "= eficacia en side-out. Acomodá bloqueo y zaga a esas direcciones.":{en:"= side-out efficiency. Set your block and back row to those directions.",de:"= Side-out-Effizienz. Richte Block und Abwehr auf diese Richtungen aus."},
    "= está jugando aunque no era regular.":{en:"= is playing although they were not a starter.",de:"= spielt, obwohl er kein Stammspieler war."},
    "= su número de las últimas fechas cambió ±8 pts vs su promedio de temporada (▲▼).":{en:"= their number from recent rounds changed ±8 pts vs their season average (▲▼).",de:"= ihr Wert der letzten Runden änderte sich ±8 Pkt vs. Saisondurchschnitt (▲▼)."},
    "= todos los ataques ·":{en:"= all attacks ·",de:"= alle Angriffe ·"},
    "= zona de la cancha desde la que saca (Z1 derecha · Z6 medio · Z5 izq).":{en:"= court zone they serve from (Z1 right · Z6 middle · Z5 left).",de:"= Feldzone, aus der sie aufschlagen (Z1 rechts · Z6 Mitte · Z5 links)."},
    "= zonas de su cancha donde recibe más flojo (apuntar el saque ahí)":{en:"= zones of their court where they receive weakest (aim the serve there)",de:"= Zonen ihres Feldes, wo sie am schwächsten annehmen (dorthin aufschlagen)"},
    "= zonas donde más lo pone — preparar la recepción ahí.":{en:"= zones where they put it most — prepare the reception there.",de:"= Zonen, wohin sie am meisten spielen — dort die Annahme vorbereiten."},
    "A dónde defendió":{en:"Where they defended",de:"Wo verteidigt wurde"},
    "Basado en cómo distribuyó históricamente en las pelotas que NO fueron a esa posición.":{en:"Based on how they historically distributed on balls that did NOT go to that position.",de:"Basierend darauf, wie historisch bei Bällen verteilt wurde, die NICHT auf diese Position gingen."},
    "El sistema parsea automáticamente todas las acciones de NAFELS":{en:"The system automatically parses all of NAFELS actions",de:"Das System verarbeitet automatisch alle Aktionen von NAFELS"},
    "(elegí cuáles)":{en:"(choose which)",de:"(wähle welche)"},
    "· clickeá un casillero o una llamada para ver el video 🎬":{en:"· click a cell or a call to see the video 🎬",de:"· klicke auf eine Zelle oder einen Call, um das Video zu sehen 🎬"},
    "· cómo distribuye en juego corrido (defensa/contraataque) ·":{en:"· how they distribute in transition (defense/counterattack) ·",de:"· wie sie in der Transition verteilen (Abwehr/Gegenangriff) ·"},
    "· distribución en K1 (recepción positiva) ·":{en:"· distribution in K1 (positive reception) ·",de:"· Verteilung in K1 (positive Annahme) ·"},
    "◀ / ▶ marca quién está mejor en cada métrica · el borde brillante es el mejor valor":{en:"◀ / ▶ marks who is better in each metric · the glowing border is the best value",de:"◀ / ▶ zeigt, wer in jeder Metrik besser ist · der leuchtende Rand ist der beste Wert"},
    "★ = lo hizo en el último partido.":{en:"★ = did it in the last match.",de:"★ = im letzten Spiel gemacht."},
    "🎯 = receptor más vulnerable ·":{en:"🎯 = most vulnerable receiver ·",de:"🎯 = anfälligster Annahmespieler ·"},
    "→ ubicá el P6 de ese lado":{en:"→ position the P6 on that side",de:"→ den P6 auf dieser Seite positionieren"},
    "y el armador va a":{en:"and the setter goes to",de:"und der Zuspieler geht zu"},
    // ===== Calendario =====
    "Calendario":{en:"Calendar",de:"Kalender"},
    "Editable":{en:"Editable",de:"Bearbeitbar"},
    "Partidos y entrenamientos del equipo. Fecha, hora, lugar y tipo — editable en la misma página.":{en:"Team matches and trainings. Date, time, place and type — editable on the same page.",de:"Spiele und Trainings des Teams. Datum, Uhrzeit, Ort und Typ — auf derselben Seite bearbeitbar."},
    "Agregar":{en:"Add",de:"Hinzufügen"},
    "+ Agregar":{en:"+ Add",de:"+ Hinzufügen"},
    "Editar":{en:"Edit",de:"Bearbeiten"},
    "Eliminar":{en:"Delete",de:"Löschen"},
    "Cancelar":{en:"Cancel",de:"Abbrechen"},
    "Condición":{en:"Home/Away",de:"Heim/Auswärts"},
    "Local":{en:"Home",de:"Heim"},
    "Visita":{en:"Away",de:"Auswärts"},
    "Tipo de entrenamiento":{en:"Training type",de:"Trainingsart"},
    "Nuevo partido":{en:"New match",de:"Neues Spiel"},
    "Nuevo entrenamiento":{en:"New training",de:"Neues Training"},
    "Editar partido":{en:"Edit match",de:"Spiel bearbeiten"},
    "Editar entrenamiento":{en:"Edit training",de:"Training bearbeiten"},
    "No hay partidos cargados":{en:"No matches added",de:"Keine Spiele eingetragen"},
    "No hay entrenamientos cargados":{en:"No trainings added",de:"Keine Trainings eingetragen"},
    "Técnica":{en:"Technical",de:"Technik"},
    "Táctica":{en:"Tactical",de:"Taktik"},
    "Físico":{en:"Physical",de:"Athletik"},
    "Gimnasio":{en:"Gym",de:"Kraftraum"},
    "Amistoso":{en:"Friendly",de:"Freundschaftsspiel"},
    "Recuperación":{en:"Recovery",de:"Regeneration"},
    "Libre":{en:"Free",de:"Frei"},
    "Otro":{en:"Other",de:"Andere"},
    // ===== Wellness restante =====
    "(no se cargó el plantel)":{en:"(roster not loaded)",de:"(Kader nicht geladen)"},
    "Elegí un jugador.":{en:"Pick a player.",de:"Wähle einen Spieler."},
    "Ver tu preparación física →":{en:"See your physical prep →",de:"Sieh deine Athletik →"},
    "Ver tu preparación física":{en:"See your physical prep",de:"Sieh deine Athletik"},
    "Estado del equipo":{en:"Team status",de:"Team-Status"},
    "Tu historial":{en:"Your history",de:"Dein Verlauf"},
    "Encuesta del día":{en:"Survey of the day",de:"Umfrage des Tages"},
    "Ordenado de menor a mayor wellness (a quién mirar primero).":{en:"Sorted from lowest to highest wellness (who to look at first).",de:"Sortiert von niedrigstem zu höchstem Wellness (wen man zuerst ansehen soll)."},
    // ===== HUB / home (index) =====
    "Sistema de Análisis":{en:"Analysis System",de:"Analyse-System"},
    "NAFELS VOLEY — Sistema de Análisis":{en:"NAFELS VOLEY — Analysis System",de:"NAFELS VOLEY — Analyse-System"},
    "NAFELS VOLEY · Sistema de Análisis v1.0":{en:"NAFELS VOLEY · Analysis System v1.0",de:"NAFELS VOLEY · Analyse-System v1.0"},
    "Seleccioná tu nombre · PIN =":{en:"Select your name · PIN =",de:"Wähle deinen Namen · PIN ="},
    "+ número de camiseta":{en:"+ jersey number",de:"+ Trikotnummer"},
    "Sistema de Análisis · NLA Suiza 2026/27":{en:"Analysis System · Swiss NLA 2026/27",de:"Analyse-System · Schweizer NLA 2026/27"},
    "NLA Suiza":{en:"Swiss NLA",de:"Schweizer NLA"},
    "NLA Suiza 2026/27 · temporada en curso":{en:"Swiss NLA 2026/27 · current season",de:"Schweizer NLA 2026/27 · laufende Saison"},
    "Dirección de saque":{en:"Serve direction",de:"Aufschlagrichtung"},
    "Filtros por fundamento":{en:"Filters by skill",de:"Filter nach Element"},
    "Análisis histórico":{en:"Historical analysis",de:"Historische Analyse"},
    "Preparación Física":{en:"Physical Preparation",de:"Athletiktraining"},
    "Rutinas personalizadas por jugador":{en:"Personalized routines per player",de:"Personalisierte Programme pro Spieler"},
    "Estado físico diario":{en:"Daily physical state",de:"Täglicher körperlicher Zustand"},
    "Detallado":{en:"Detailed",de:"Detailliert"},
    "Próximo partido":{en:"Next match",de:"Nächstes Spiel"},
    "Liga NLA":{en:"NLA League",de:"NLA-Liga"},
    "Estadísticas Liga":{en:"League Stats",de:"Liga-Statistiken"},
    "Nuevo":{en:"New",de:"Neu"},
    "Cargar Videos":{en:"Upload Videos",de:"Videos hochladen"},
    "Pizarrón":{en:"Whiteboard",de:"Taktiktafel"},
    "Próximamente":{en:"Coming soon",de:"Demnächst"},
    "Scouting del Rival":{en:"Opponent Scouting",de:"Gegner-Scouting"},
    "🔍 Scouting del Rival":{en:"🔍 Opponent Scouting",de:"🔍 Gegner-Scouting"},
    "Imprimible":{en:"Printable",de:"Druckbar"},
    "Plan de Partido":{en:"Match Plan",de:"Matchplan"},
    "Cara a cara":{en:"Head to head",de:"Direkter Vergleich"},
    "Comparador":{en:"Comparator",de:"Vergleich"},
    "Tendencias":{en:"Trends",de:"Trends"},
    "Días":{en:"Days",de:"Tage"},
    "Operativo · Filtros activos":{en:"Operational · Active filters",de:"Betriebsbereit · Aktive Filter"},
    "Fixture · NLA Suiza 2026/27":{en:"Fixture · Swiss NLA 2026/27",de:"Spielplan · Schweizer NLA 2026/27"},
    "📅 Fixture · NLA Suiza 2026/27":{en:"📅 Fixture · Swiss NLA 2026/27",de:"📅 Spielplan · Schweizer NLA 2026/27"},
    "Stats en tiempo real durante el entrenamiento o partido. Saque, recepción, ataque y bloqueo con visualización táctica de la cancha.":{en:"Real-time stats during training or match. Serve, reception, attack and block with tactical court visualization.",de:"Echtzeit-Statistiken im Training oder Spiel. Aufschlag, Annahme, Angriff und Block mit taktischer Feldvisualisierung."},
    "Stats acumulados por jugador y equipo. Comparativas, tendencias y evolución por período. Filtros por entrenamiento o partido.":{en:"Cumulative stats by player and team. Comparisons, trends and evolution by period. Filters by training or match.",de:"Kumulierte Statistiken pro Spieler und Team. Vergleiche, Trends und Entwicklung nach Zeitraum. Filter nach Training oder Spiel."},
    "Registrá tus pesos por serie, seguí tu progresión y calculá cargas de entrenamiento.":{en:"Log your weights per set, track your progression and calculate training loads.",de:"Erfasse deine Gewichte pro Satz, verfolge deinen Fortschritt und berechne Trainingslasten."},
    "Encuesta del 1 al 10 post-entrenamiento y tabla de cómo viene cada jugador.":{en:"A 1-to-10 survey after training and a table of how each player is doing.",de:"Umfrage von 1 bis 10 nach dem Training und Tabelle, wie es jedem Spieler geht."},
    "Plantel completo con fotos, posiciones y acceso al perfil individual de cada jugador.":{en:"Full roster with photos, positions and access to each player's individual profile.",de:"Vollständiger Kader mit Fotos, Positionen und Zugang zum individuellen Profil jedes Spielers."},
    "Stats detalladas por partido o acumulado. Saque, recepción, ataque y bloqueo con todos los valores.":{en:"Detailed stats by match or cumulative. Serve, reception, attack and block with all values.",de:"Detaillierte Statistiken pro Spiel oder kumuliert. Aufschlag, Annahme, Angriff und Block mit allen Werten."},
    "Plan del próximo rival: defensa, armadores, recepción y videos.":{en:"Next opponent plan: defense, setters, reception and videos.",de:"Plan für den nächsten Gegner: Abwehr, Zuspieler, Annahme und Videos."},
    "Base de datos completa NLA 2026/27. Ranking por equipo y stats individuales de toda la liga. Ataque, saque, recepción y bloqueo.":{en:"Complete NLA 2026/27 database. Team ranking and individual stats for the whole league. Attack, serve, reception and block.",de:"Komplette NLA 2026/27 Datenbank. Team-Rangliste und Einzelstatistiken der ganzen Liga. Angriff, Aufschlag, Annahme und Block."},
    "Análisis visual por jugador. Ataque, saque, recepción y armado con heatmaps de zonas, EFF y tendencias.":{en:"Visual analysis by player. Attack, serve, reception and setting with zone heatmaps, EFF and trends.",de:"Visuelle Analyse pro Spieler. Angriff, Aufschlag, Annahme und Zuspiel mit Zonen-Heatmaps, EFF und Trends."},
    "Subí el archivo .dvw de DataVolley y el sistema parsea todas las acciones automáticamente.":{en:"Upload the DataVolley .dvw file and the system parses all actions automatically.",de:"Lade die DataVolley .dvw-Datei hoch und das System verarbeitet alle Aktionen automatisch."},
    "Filtrá acciones como en los heatmaps y mirá los clips de video sincronizados. Armá recortes para mostrarles a los jugadores.":{en:"Filter actions like in the heatmaps and watch the synced video clips. Build clips to show the players.",de:"Filtere Aktionen wie in den Heatmaps und sieh die synchronisierten Videoclips. Erstelle Clips, um sie den Spielern zu zeigen."},
    "Pegá el link de YouTube de cada partido de la temporada y generá el archivo. Sin que participe nadie más.":{en:"Paste the YouTube link of each match of the season and generate the archive. With no one else involved.",de:"Füge den YouTube-Link jedes Saisonspiels ein und erstelle das Archiv. Ohne dass jemand anderes beteiligt ist."},
    "Progreso de todos los jugadores en tiempo real. Quién cargó los pesos, quién no, y comparativa del equipo.":{en:"All players' progress in real time. Who logged their weights, who didn't, and team comparison.",de:"Fortschritt aller Spieler in Echtzeit. Wer seine Gewichte eingetragen hat, wer nicht, und Team-Vergleich."},
    "Vista para la tele. Rutina del día con todos los jugadores y pesos editables en tiempo real.":{en:"TV view. The day's routine with all players and weights editable in real time.",de:"TV-Ansicht. Das Tagesprogramm mit allen Spielern und in Echtzeit bearbeitbaren Gewichten."},
    "Tabla de posiciones, armado de equipos, registro de sets y podio con fotos.":{en:"Standings, team building, set log and podium with photos.",de:"Tabelle, Mannschaftsaufstellung, Satz-Protokoll und Podium mit Fotos."},
    "Analisis tactico del rival. Ataques, saques y zonas preferidas por jugador.":{en:"Tactical analysis of the opponent. Attacks, serves and preferred zones by player.",de:"Taktische Analyse des Gegners. Angriffe, Aufschläge und bevorzugte Zonen pro Spieler."},
    "Videoteca de acciones, clips por jugador y análisis de jugadas específicas vinculadas al plan de juego.":{en:"Action video library, clips by player and analysis of specific plays linked to the game plan.",de:"Video-Bibliothek der Aktionen, Clips pro Spieler und Analyse bestimmter Spielzüge, verknüpft mit dem Matchplan."},
    "Dossier completo de cada rival de la liga: saque, ataque por rematador con direcciones, armador, recepción, rotaciones y en sistema vs fuera de sistema.":{en:"Complete dossier of each league opponent: serve, attack by hitter with directions, setter, reception, rotations and in system vs out of system.",de:"Komplettes Dossier jedes Liga-Gegners: Aufschlag, Angriff pro Angreifer mit Richtungen, Zuspieler, Annahme, Rotationen und In-System vs. Out-of-System."},
    "Näfels vs cualquier rival, lado a lado: saque, ataque y recepción con barras que marcan quién está mejor en cada métrica.":{en:"Näfels vs any opponent, side by side: serve, attack and reception with bars marking who's better in each metric.",de:"Näfels vs. jeden Gegner, Seite an Seite: Aufschlag, Angriff und Annahme mit Balken, die zeigen, wer in jeder Metrik besser ist."},
    "Evolución partido a partido del equipo: ataque, saque, recepción y bloqueo en gráficos, con la tira de resultados y promedios.":{en:"Match-by-match evolution of the team: attack, serve, reception and block in charts, with the results strip and averages.",de:"Spiel-für-Spiel-Entwicklung des Teams: Angriff, Aufschlag, Annahme und Block in Diagrammen, mit der Ergebnisleiste und Durchschnittswerten."},
    // ===== AÑADIDOS: login, perfil del jugador, cortes, wellness =====
    '— Elegí tu nombre —':{en:'— Choose your name —',de:'— Wähle deinen Namen —'},
    'Elegí tu nombre':{en:'Choose your name',de:'Wähle deinen Namen'},
    'Seleccioná tu nombre':{en:'Choose your name',de:'Wähle deinen Namen'},
    'Entrenador (Staff)':{en:'Coach (Staff)',de:'Trainer (Staff)'},
    'Preparador Físico (PF)':{en:'Physical Coach (PF)',de:'Athletiktrainer (PF)'},
    'Asistente Técnico (AT)':{en:'Assistant Coach (AT)',de:'Co-Trainer (AT)'},
    'Continuar sin ingresar':{en:'Continue without signing in',de:'Ohne Anmeldung fortfahren'},
    'número de camiseta':{en:'jersey number',de:'Trikotnummer'},
    'Mis estadísticas':{en:'My stats',de:'Meine Statistiken'},
    'Mi preparación física':{en:'My physical prep',de:'Meine Athletik'},
    'Plan del próximo partido':{en:'Next match plan',de:'Plan fürs nächste Spiel'},
    'Sesión actual':{en:'Current session',de:'Aktuelle Session'},
    'Mi posición en el equipo':{en:'My ranking in the team',de:'Meine Position im Team'},
    'Mi recepción por zona':{en:'My reception by zone',de:'Meine Annahme nach Zone'},
    'Mis saques por zona':{en:'My serves by zone',de:'Meine Aufschläge nach Zone'},
    'Mis ataques por zona':{en:'My attacks by zone',de:'Meine Angriffe nach Zone'},
    'Mi armado de juego':{en:'My setting distribution',de:'Mein Zuspiel'},
    'Todo el sistema':{en:'Whole system',de:'Gesamtes System'},
    'Mis acciones en video':{en:'My video actions',de:'Meine Video-Aktionen'},
    'Mis Cortes':{en:'My Clips',de:'Meine Clips'},
    'Rutina':{en:'Routine',de:'Programm'},
    'Panel en Vivo':{en:'Live Panel',de:'Live-Panel'},
    'Distribución':{en:'Distribution',de:'Verteilung'},
    'Estadísticas acumuladas':{en:'Cumulative stats',de:'Kumulierte Statistiken'},
    'Próxima rutina':{en:'Next routine',de:'Nächstes Programm'},
    'Comparativa vs Equipo y Posición':{en:'Comparison vs Team and Position',de:'Vergleich vs. Team und Position'},
    'Lejos':{en:'Far',de:'Weit'}, 'Cerca':{en:'Close',de:'Nah'},
    'Neutro':{en:'Neutral',de:'Neutral'},
    'Sobre equipo':{en:'Above team',de:'Über Team'},
    'Cerca equipo':{en:'Near team',de:'Nahe Team'},
    'Bajo equipo':{en:'Below team',de:'Unter Team'},
    'Elegí acciones y apretá Reproducir':{en:'Pick actions and press Play',de:'Aktionen wählen und Play drücken'},
    'Reels rápidos':{en:'Quick reels',de:'Schnelle Reels'},
    'Errores de Saque':{en:'Serve errors',de:'Aufschlagfehler'},
    'Ataques Punto':{en:'Attack points',de:'Angriffspunkte'},
    'Ataques fallados/Bloqueados':{en:'Missed/blocked attacks',de:'Verfehlte/geblockte Angriffe'},
    'Bloqueos Punto':{en:'Block points',de:'Blockpunkte'},
    'recepciones rotas':{en:'broken receptions',de:'gebrochene Annahmen'},
    'Mirar en YouTube':{en:'Watch on YouTube',de:'Auf YouTube ansehen'},
    'Repetir':{en:'Repeat',de:'Wiederholen'},
    'Limpiar filtros':{en:'Clear filters',de:'Filter löschen'},
    'Limpiar':{en:'Clear',de:'Löschen'}, 'Marcar todos':{en:'Select all',de:'Alle auswählen'},
    'No hay acciones con esos filtros.':{en:'No actions with those filters.',de:'Keine Aktionen mit diesen Filtern.'},
    'clips filtrados':{en:'filtered clips',de:'gefilterte Clips'},
    'Tildá para armar tu recorte':{en:'Check to build your clip',de:'Ankreuzen, um deinen Clip zu erstellen'},
    'Perfecto':{en:'Perfect',de:'Perfekt'}, 'Bueno':{en:'Good',de:'Gut'},
    'Punto':{en:'Point',de:'Punkt'}, 'Bloqueado':{en:'Blocked',de:'Geblockt'},
    'Tu wellness de hoy':{en:'Your wellness today',de:'Dein Wellness heute'},
    'Cómo viene tu estado físico':{en:'How your physical state is going',de:'Wie dein körperlicher Zustand ist'},
    'Mi día':{en:'My day',de:'Mein Tag'}, 'Tu promedio':{en:'Your average',de:'Dein Durchschnitt'},
    'Promedio del equipo':{en:'Team average',de:'Team-Durchschnitt'},
    'Guardar':{en:'Save',de:'Speichern'}, 'Pesas':{en:'Weights',de:'Gewichte'},
    'Pelota':{en:'Ball',de:'Ball'}, 'Sesión':{en:'Session',de:'Session'},
    'Nivel':{en:'Level',de:'Stufe'}, 'Fecha':{en:'Date',de:'Datum'},
    'Hora':{en:'Time',de:'Uhrzeit'}, 'Lugar':{en:'Place',de:'Ort'},
    // ----- Mis Cortes: textos restantes -----
    'Click para pausar/reproducir':{en:'Click to pause/play',de:'Klicken zum Pausieren/Abspielen'},
    'Pantalla completa':{en:'Fullscreen',de:'Vollbild'},
    'Repetir este clip (R)':{en:'Repeat this clip (R)',de:'Diesen Clip wiederholen (R)'},
    'Bloqueado/Tocado':{en:'Blocked/Touched',de:'Geblockt/Berührt'},
    'Filtrado por ':{en:'Filtered by ',de:'Gefiltert nach '},
    'No hay clips':{en:'No clips',de:'Keine Clips'},
    'Perfecto / Punto':{en:'Perfect / Point',de:'Perfekt / Punkt'},
    'Recorte compartido':{en:'Shared clip',de:'Geteilter Clip'},
    'Velocidad':{en:'Speed',de:'Geschwindigkeit'}, 'velocidad':{en:'speed',de:'Geschwindigkeit'},
    'Acciones a mostrar':{en:'Actions to show',de:'Anzuzeigende Aktionen'},
    'Elegir acciones':{en:'Choose actions',de:'Aktionen wählen'},
    'Espacio':{en:'Space',de:'Leertaste'}, 'play/pausa':{en:'play/pause',de:'Play/Pause'},
    'pausa':{en:'pause',de:'Pause'}, 'pantalla':{en:'screen',de:'Bildschirm'},
    'después':{en:'after',de:'danach'}, 'antes':{en:'before',de:'davor'},
    'contacto':{en:'contact',de:'Kontakt'},
    'clip anterior/siguiente':{en:'previous/next clip',de:'vorheriger/nächster Clip'},
    'anterior':{en:'previous',de:'vorherige'}, 'siguiente':{en:'next',de:'nächste'},
    '(uno o varios · vacío = todos)':{en:'(one or more · empty = all)',de:'(eine oder mehrere · leer = alle)'},
    // Generales / navegación
    'Todos':{en:'All',de:'Alle'}, 'Todas':{en:'All',de:'Alle'},
    'Total':{en:'Total',de:'Gesamt'}, 'Totales':{en:'Totals',de:'Gesamt'},
    'Jugador':{en:'Player',de:'Spieler'}, 'Jugadores':{en:'Players',de:'Spieler'},
    'Equipo':{en:'Team',de:'Mannschaft'}, 'Rival':{en:'Opponent',de:'Gegner'},
    'Set':{en:'Set',de:'Satz'}, 'Partido':{en:'Match',de:'Spiel'},
    'Partidos':{en:'Matches',de:'Spiele'}, 'Partido específico':{en:'Specific match',de:'Bestimmtes Spiel'},
    'Entrenamiento':{en:'Training',de:'Training'}, 'Entrenamientos':{en:'Trainings',de:'Trainings'},
    'Nombre':{en:'Name',de:'Name'}, 'Tipo':{en:'Type',de:'Typ'},
    'Contexto':{en:'Context',de:'Kontext'}, 'Objetivo':{en:'Target',de:'Ziel'},
    'Objetivos':{en:'Targets',de:'Ziele'}, 'Técnico':{en:'Coach',de:'Trainer'},
    'Análisis':{en:'Analysis',de:'Analyse'}, 'Ranking':{en:'Ranking',de:'Rangliste'},
    'Resumen':{en:'Summary',de:'Übersicht'}, 'Comparativa':{en:'Comparison',de:'Vergleich'},
    'Comparar':{en:'Compare',de:'Vergleichen'}, 'Individual':{en:'Individual',de:'Einzeln'},
    // Fundamentos
    'Ataque':{en:'Attack',de:'Angriff'}, 'Saque':{en:'Serve',de:'Aufschlag'},
    'Recepción':{en:'Reception',de:'Annahme'}, 'Recepcion':{en:'Reception',de:'Annahme'},
    'Bloqueo':{en:'Block',de:'Block'}, 'Defensa':{en:'Defense',de:'Abwehr'},
    'Armado':{en:'Setting',de:'Zuspiel'}, 'Armador':{en:'Setter',de:'Zuspieler'},
    'Armadores':{en:'Setters',de:'Zuspieler'}, 'Freeball':{en:'Freeball',de:'Freeball'},
    'Ataques':{en:'Attacks',de:'Angriffe'}, 'Saques':{en:'Serves',de:'Aufschläge'},
    'Recepciones':{en:'Receptions',de:'Annahmen'}, 'Armadas':{en:'Sets',de:'Zuspiele'},
    // Cancha / heatmap
    'Origen':{en:'Origin',de:'Ursprung'}, 'Propio':{en:'Own',de:'Eigen'},
    'Destino':{en:'Target',de:'Ziel'}, 'Red':{en:'Net',de:'Netz'}, 'Net':{en:'Net',de:'Netz'},
    'Cancha':{en:'Court',de:'Feld'}, 'Zona':{en:'Zone',de:'Zone'},
    'Origen propio':{en:'Own origin',de:'Eigener Ursprung'}, 'Ataque rival':{en:'Opp. attack',de:'Gegner-Angriff'},
    'Destino defensa':{en:'Defense target',de:'Abwehrziel'}, 'Cancha propia':{en:'Own court',de:'Eigenes Feld'},
    'Cancha rival':{en:'Opp. court',de:'Gegnerisches Feld'},
    // Métricas / valoraciones
    'Eficiencia':{en:'Efficiency',de:'Effizienz'}, 'Valoración':{en:'Rating',de:'Bewertung'},
    'Puntos':{en:'Points',de:'Punkte'}, 'Punto':{en:'Point',de:'Punkt'},
    'Errores':{en:'Errors',de:'Fehler'}, 'Error':{en:'Error',de:'Fehler'},
    'Perfecta':{en:'Perfect',de:'Perfekt'}, 'Buena':{en:'Good',de:'Gut'},
    'Regular':{en:'Fair',de:'Mittel'}, 'Mala':{en:'Poor',de:'Schwach'},
    'Positivo':{en:'Positive',de:'Positiv'}, 'Negativo':{en:'Negative',de:'Negativ'},
    'Neutro':{en:'Neutral',de:'Neutral'}, 'Vendida':{en:'Over',de:'Übergabe'},
    'Vendidas':{en:'Over',de:'Übergaben'}, 'Kill':{en:'Kill',de:'Kill'},
    'Flotado':{en:'Float',de:'Flatter'}, 'Potencia':{en:'Spin',de:'Sprung'},
    'Rápida':{en:'Quick',de:'Schnell'}, 'Alta':{en:'High',de:'Hoch'},
    'Central':{en:'Middle',de:'Mitte'}, 'Cerca':{en:'Close',de:'Nah'},
    'Side Out':{en:'Side Out',de:'Side Out'}, 'Transición':{en:'Transition',de:'Übergang'},
    'Transicion':{en:'Transition',de:'Übergang'},
    'Side Out':{en:'Side Out',de:'Side Out'},
    // Posiciones
    'ARMADOR':{en:'SETTER',de:'ZUSPIELER'}, 'OPUESTO':{en:'OPPOSITE',de:'DIAGONAL'},
    'CENTRAL':{en:'MIDDLE',de:'MITTE'}, 'PUNTA':{en:'OUTSIDE',de:'AUSSEN'},
    'LIBERO':{en:'LIBERO',de:'LIBERO'}, 'Opuesto':{en:'Opposite',de:'Diagonal'},
    'Punta':{en:'Outside',de:'Außen'}, 'Líbero':{en:'Libero',de:'Libero'},
    // Filtros / acciones
    'Limpiar filtros':{en:'Clear filters',de:'Filter löschen'},
    'Seleccionar…':{en:'Select…',de:'Auswählen…'}, 'Seleccionar...':{en:'Select...',de:'Auswählen...'},
    'Seleccioná un jugador':{en:'Select a player',de:'Spieler auswählen'},
    'Selecciona un jugador':{en:'Select a player',de:'Spieler auswählen'},
    'Elegí un jugador primero.':{en:'Choose a player first.',de:'Zuerst Spieler wählen.'},
    'Elegí un armador primero.':{en:'Choose a setter first.',de:'Zuerst Zuspieler wählen.'},
    'Elegí un jugador para ver su defensa':{en:'Choose a player to see their defense',de:'Spieler wählen, um die Abwehr zu sehen'},
    'Elegí un partido arriba':{en:'Choose a match above',de:'Spiel oben wählen'},
    'Elegí dos jugadores para comparar':{en:'Choose two players to compare',de:'Zwei Spieler zum Vergleich wählen'},
    'Elegí dos jugadores diferentes':{en:'Choose two different players',de:'Zwei verschiedene Spieler wählen'},
    'Origen de datos':{en:'Data source',de:'Datenquelle'},
    'Momento del set':{en:'Set moment',de:'Satzzeitpunkt'},
    'Origen zona':{en:'Origin zone',de:'Ursprungszone'},
    'Sin datos':{en:'No data',de:'Keine Daten'},
    'Sin datos aun':{en:'No data yet',de:'Noch keine Daten'},
    'Sin datos aún':{en:'No data yet',de:'Noch keine Daten'},
    'Sin datos para los filtros seleccionados':{en:'No data for the selected filters',de:'Keine Daten für die gewählten Filter'},
    'Sin datos para los filtros elegidos':{en:'No data for the chosen filters',de:'Keine Daten für die gewählten Filter'},
    'Sin datos de entrenamiento':{en:'No training data',de:'Keine Trainingsdaten'},
    'Top destinos:':{en:'Top destinations:',de:'Top-Ziele:'},
    'Distribucion en cancha':{en:'Court distribution',de:'Feldverteilung'},
    'Distribución en cancha':{en:'Court distribution',de:'Feldverteilung'},
    'Analisis por llamada':{en:'Analysis by call',de:'Analyse nach Ruf'},
    'Mapa de defensa':{en:'Defense map',de:'Abwehrkarte'},
    'Eficiencia por rival':{en:'Efficiency by opponent',de:'Effizienz nach Gegner'},
    'Evolucion partido a partido':{en:'Match-by-match trend',de:'Spielverlauf'},
    'Llamadas del colocador':{en:'Setter calls',de:'Stellerrufe'},
    'TOTALES EQUIPO':{en:'TEAM TOTALS',de:'TEAM GESAMT'},
    'Sobre equipo':{en:'Above team',de:'Über Team'}, 'Bajo equipo':{en:'Below team',de:'Unter Team'},
    'acciones filtradas':{en:'filtered actions',de:'gefilterte Aktionen'},
    'armadas filtradas':{en:'filtered sets',de:'gefilterte Zuspiele'},
    'defensas mostradas':{en:'shown defenses',de:'gezeigte Abwehren'},
    'clips filtrados':{en:'filtered clips',de:'gefilterte Clips'},
    'Inicio:':{en:'Start:',de:'Anfang:'}, 'Final:':{en:'End:',de:'Ende:'},
    'Inicio':{en:'Start',de:'Anfang'}, 'Final':{en:'End',de:'Ende'},
    'Velocidad':{en:'Speed',de:'Tempo'}, 'antes':{en:'before',de:'vorher'},
    'después':{en:'after',de:'nachher'}, 'contacto':{en:'contact',de:'Kontakt'},
    'Reproducir':{en:'Play',de:'Abspielen'}, 'Anterior':{en:'Previous',de:'Zurück'},
    'Siguiente':{en:'Next',de:'Weiter'}, 'Marcar todos':{en:'Select all',de:'Alle wählen'},
    'Limpiar':{en:'Clear',de:'Leeren'}, 'Compartir recorte':{en:'Share clip',de:'Clip teilen'},
    'Elegir acciones':{en:'Choose actions',de:'Aktionen wählen'},
    'Elegir partidos':{en:'Choose matches',de:'Spiele wählen'},
    'Acciones a mostrar':{en:'Actions to show',de:'Anzuzeigende Aktionen'},
    'Cortes de Video':{en:'Video Clips',de:'Video-Clips'},

    // ════ SCOUTING DEL RIVAL — títulos de sección ════
    'Scouting del Rival':{en:'Opponent Scouting',de:'Gegner-Scouting'},
    'Saque — desde dónde y hacia dónde sacan':{en:'Serve — from where and where to',de:'Aufschlag — von wo und wohin'},
    'Ataque — por jugador':{en:'Attack — by player',de:'Angriff — pro Spieler'},
    'Cómo arma según desde dónde le llega la recepción':{en:'How they set by reception origin',de:'Zuspiel je nach Annahmeursprung'},
    'Cómo arma según QUIÉN recibe':{en:'How they set by WHO receives',de:'Zuspiel je nach ANNEHMER'},
    'Cómo arma según quién recibe':{en:'How they set by who receives',de:'Zuspiel je nach Annehmer'},
    'En sistema vs fuera de sistema — qué pasa si les rompés la recepción':{en:'In-system vs out-of-system — what happens if you break their reception',de:'Im System vs. außerhalb — was passiert bei gestörter Annahme'},
    'Por rotación — prioridad de saque (orden P1·P6·P5·P4·P3·P2)':{en:'By rotation — serving priority (order P1·P6·P5·P4·P3·P2)',de:'Nach Rotation — Aufschlagpriorität (Reihenfolge P1·P6·P5·P4·P3·P2)'},
    'Recepción — dónde atacarlos con el saque':{en:'Reception — where to serve them',de:'Annahme — wohin aufschlagen'},
    'Claves del partido':{en:'Match keys',de:'Spielschlüssel'},
    'Claves':{en:'Keys',de:'Schlüssel'},

    // ════ Headers de tabla ════
    'Combinación → dirección (dónde la manda)':{en:'Combination → direction (where they send it)',de:'Kombination → Richtung (wohin)'},
    'Combinación → dirección':{en:'Combination → direction',de:'Kombination → Richtung'},
    'Hacia dónde lo pone':{en:'Where they place it',de:'Wohin platziert'},
    'Termina en (rematador)':{en:'Ends in (hitter)',de:'Endet bei (Angreifer)'},
    'Receptor (de + débil a + fuerte)':{en:'Receiver (weakest to strongest)',de:'Annehmer (schwächster zuerst)'},
    'Receptor (por volumen)':{en:'Receiver (by volume)',de:'Annehmer (nach Volumen)'},
    'Recibe peor en':{en:'Receives worst in',de:'Schwächste Annahme in'},
    'Sacador':{en:'Server',de:'Aufschläger'},
    'Desde':{en:'From',de:'Von'},
    'Uso':{en:'Usage',de:'Nutzung'},
    'Llamada':{en:'Call',de:'Ruf'},
    'Pelota':{en:'Ball',de:'Ball'},
    'Rematador':{en:'Hitter',de:'Angreifer'},
    'Rematadores':{en:'Hitters',de:'Angreifer'},
    'Receptor':{en:'Receiver',de:'Annehmer'},
    'Positiva%':{en:'Positive%',de:'Positiv%'},
    'Positiva (#+)':{en:'Positive (#+)',de:'Positiv (#+)'},
    'Rec.':{en:'Rec.',de:'Ann.'},
    'vs Flotado':{en:'vs Float',de:'vs Flatter'},
    'vs Potencia':{en:'vs Spin',de:'vs Sprung'},
    'Atq':{en:'Att',de:'Ang'},
    'Error%':{en:'Error%',de:'Fehler%'},

    // ════ KPI / pills ════
    'Bloqueados':{en:'Blocked',de:'Geblockt'},
    'Vendida (/)':{en:'Over (/)',de:'Übergabe (/)'},
    'Aces':{en:'Aces',de:'Asse'},
    'Ace':{en:'Ace',de:'Ass'},

    // ════ Tabs ════
    'Side-out (recepción +)':{en:'Side-out (reception +)',de:'Side-out (Annahme +)'},

    // ════ Opciones de los desplegables ════
    'Con recepción + (#/+)':{en:'With reception + (#/+)',de:'Mit Annahme + (#/+)'},
    'Con recepción − (!/-)':{en:'With reception − (!/-)',de:'Mit Annahme − (!/-)'},
    'Recepción + (#/+)':{en:'Reception + (#/+)',de:'Annahme + (#/+)'},
    'Recepción − (!/-)':{en:'Reception − (!/-)',de:'Annahme − (!/-)'},
    'Toda recepción':{en:'All reception',de:'Alle Annahmen'},
    'Todo el set':{en:'Whole set',de:'Ganzer Satz'},
    'Inicio (0-8)':{en:'Start (0-8)',de:'Anfang (0-8)'},
    'Medio (9-16)':{en:'Middle (9-16)',de:'Mitte (9-16)'},
    'Final (17+)':{en:'End (17+)',de:'Ende (17+)'},

    // ════ Botones ════
    'Comparar con Näfels':{en:'Compare with Näfels',de:'Mit Näfels vergleichen'},
    'Plan de partido':{en:'Match plan',de:'Spielplan'},
    'Imprimir':{en:'Print',de:'Drucken'},

    // ════ Sección receptor / por zona ════
    'Elegí un receptor y mirá a quién arma el armador rival cuando le llega el pase desde ese jugador:':{en:'Pick a receiver and see who the opposing setter sets to when the pass comes from that player:',de:'Wähle einen Annehmer und sieh, zu wem der gegnerische Zuspieler stellt, wenn der Pass von diesem Spieler kommt:'},
    'Cuando pasa bien':{en:'When they pass well',de:'Bei guter Annahme'},
    'Cuando lo rompés':{en:'When you break them',de:'Bei gestörter Annahme'},
    'Le arma a':{en:'Sets to',de:'Stellt zu'},
    'Arma a':{en:'Sets to',de:'Stellt zu'},
    'Recibe':{en:'Receives',de:'Annahme'},
    'Reciben':{en:'They receive',de:'Sie nehmen an'},
    'recepciones':{en:'receptions',de:'Annahmen'},
    'jugadas':{en:'plays',de:'Aktionen'},
    'pocos datos':{en:'little data',de:'wenig Daten'},
    'pocas bolas':{en:'few balls',de:'wenige Bälle'},
    'muestra chica':{en:'small sample',de:'kleine Stichprobe'},
    'partidos analizados':{en:'matches analyzed',de:'analysierte Spiele'},
    'partidos jugados':{en:'matches played',de:'gespielte Spiele'},
    'rendimiento en side-out':{en:'side-out performance',de:'Side-out-Leistung'},
    'en transición':{en:'in transition',de:'im Übergang'},
    'Ordenado por cantidad de saques':{en:'Sorted by number of serves',de:'Nach Anzahl der Aufschläge sortiert'},
    'los primeros son los titulares':{en:'the first ones are the starters',de:'die ersten sind die Stammspieler'},

    // ════ Claves del partido (fragmentos) — más largas primero ════
    'Rematador principal':{en:'Main hitter',de:'Hauptangreifer'},
    'Segunda opción':{en:'Second option',de:'Zweite Option'},
    'Central de referencia':{en:'Reference middle',de:'Wichtigster Mittelblocker'},
    'Su llamada principal':{en:'Their main call',de:'Ihr Hauptruf'},
    'Receptor más vulnerable':{en:'Most vulnerable receiver',de:'Schwächster Annehmer'},
    'Prioridad de saque por rotación':{en:'Serving priority by rotation',de:'Aufschlagpriorität nach Rotation'},
    'Son sus rotaciones más flojas para recibir':{en:'These are their weakest receiving rotations',de:'Das sind ihre schwächsten Annahme-Rotationen'},
    'apretar el saque ahí':{en:'press the serve there',de:'dort den Aufschlag forcieren'},
    'Fuera de sistema su ataque cae':{en:'Out of system their attack drops',de:'Außerhalb des Systems fällt ihr Angriff'},
    'Romperles la recepción y cargar el bloqueo ahí':{en:'Break their reception and load the block there',de:'Ihre Annahme stören und den Block dort verstärken'},
    'Reforzar la recepción y tener plan B de armado':{en:'Reinforce reception and have a setting plan B',de:'Annahme verstärken und Zuspiel-Plan B haben'},
    'Presionarlos a arriesgar el saque':{en:'Pressure them to risk the serve',de:'Sie zum riskanten Aufschlag zwingen'},
    'Bloqueo y defensa cargados por zona 2 y zaga derecha':{en:'Block and defense loaded on zone 2 and right back',de:'Block und Abwehr auf Zone 2 und hinten rechts'},
    'Bloqueo en zona 4, defensa de diagonal y paralela':{en:'Block on zone 4, defend cross and line',de:'Block auf Zone 4, Diagonal- und Longline-Abwehr'},
    'Lectura del primer tiempo':{en:'Read the quick attack',de:'Schnellangriff lesen'},
    'Sus combinaciones':{en:'Their combinations',de:'Ihre Kombinationen'},
    'Sacarle a él':{en:'Serve at him',de:'Auf ihn aufschlagen'},
    'Sacan fuerte':{en:'They serve hard',de:'Sie schlagen stark auf'},
    'Saque errático':{en:'Erratic serve',de:'Unbeständiger Aufschlag'},
    'más flojo ahí':{en:'weaker there',de:'dort schwächer'},
    'se concentra en':{en:'concentrates on',de:'konzentriert sich auf'},
    'Ojo con':{en:'Watch out for',de:'Achtung bei'},
    'apuntando a':{en:'aiming at',de:'gezielt auf'},
    'distribuye el':{en:'distributes',de:'verteilt'},
    'termina en':{en:'ends in',de:'endet bei'},
    'positiva en':{en:'positive in',de:'positiv in'},
    'en side-out':{en:'in side-out',de:'im Side-out'},
    'con saque':{en:'with serve',de:'mit Aufschlag'},
    'de aces':{en:'aces',de:'Asse'},
    'de error':{en:'error',de:'Fehler'},
    'del juego':{en:'of the game',de:'des Spiels'},
    'puntos':{en:'points',de:'Punkte'},
    'bolas':{en:'balls',de:'Bälle'},
    'derecha':{en:'right',de:'rechts'},
    'izquierda':{en:'left',de:'links'},
    'paralela':{en:'line',de:'Longline'},
    'diagonal':{en:'cross',de:'Diagonal'},
    'zaga':{en:'back row',de:'hintere Reihe'},
    'primer tiempo':{en:'quick attack',de:'Schnellangriff'},
    'ataque de zaga':{en:'back-row attack',de:'Angriff aus der hinteren Reihe'},
    'titular':{en:'starter',de:'Stammspieler'},
    'titulares':{en:'starters',de:'Stammspieler'},
    'fuera de sistema':{en:'out of system',de:'außerhalb des Systems'},
    'en sistema':{en:'in system',de:'im System'},
    'prioridad de saque':{en:'serving priority',de:'Aufschlagpriorität'},
    'PJ':{en:'MP',de:'Sp'},

    // ════ Header / vacíos / labels que faltaban ════
    'Dossier del próximo rival':{en:'Next opponent dossier',de:'Dossier des nächsten Gegners'},
    'NLA Suiza':{en:'Swiss NLA',de:'NLA Schweiz'},
    'Suiza':{en:'Switzerland',de:'Schweiz'},
    'Elegí un rival':{en:'Pick an opponent',de:'Wähle einen Gegner'},
    'Seleccioná un equipo arriba para ver su dossier completo de scouting.':{en:'Select a team above to see their full scouting dossier.',de:'Wähle oben eine Mannschaft, um das vollständige Scouting-Dossier zu sehen.'},
    'A quién va':{en:'Who gets it',de:'Wohin gespielt'},
    'rendimiento':{en:'efficiency',de:'Leistung'},
    'Pelotas':{en:'Balls',de:'Bälle'},
    'En red':{en:'At net',de:'Am Netz'},
    'Pocos datos para ese filtro.':{en:'Little data for that filter.',de:'Wenig Daten für diesen Filter.'},
    'Ordenado por cantidad de saques (los primeros son los titulares).':{en:'Sorted by number of serves (the first ones are the starters).',de:'Nach Anzahl der Aufschläge sortiert (die ersten sind die Stammspieler).'},

    // ════ Footnotes completos (traducen limpio) ════
    'En sistema = recepción positiva (#/+), el armador tiene todas las opciones. Fuera de sistema = recepción rota (−//), el armador queda condicionado. Solo cuenta el ataque de side-out.':{en:'In system = positive reception (#/+), the setter has every option. Out of system = broken reception (−//), the setter is constrained. Only side-out attack counts.',de:'Im System = positive Annahme (#/+), der Zuspieler hat alle Optionen. Außerhalb = gestörte Annahme (−//), der Zuspieler ist eingeschränkt. Nur der Side-out-Angriff zählt.'},
    'Filtrá por calidad de recepción y momento del set para ver cómo cambia su distribución. Ej: fuera de sistema (recepción −) suele simplificar a su rematador de confianza. Tocá una llamada en el Game Plan para el heatmap.':{en:'Filter by reception quality and set moment to see how their distribution changes. E.g.: out of system (reception −) they tend to simplify to their go-to hitter. Tap a call in the Game Plan for the heatmap.',de:'Filtere nach Annahmequalität und Satzzeitpunkt, um zu sehen, wie sich ihre Verteilung ändert. Z.B.: außerhalb des Systems (Annahme −) vereinfachen sie meist auf ihren Lieblingsangreifer. Tippe im Matchplan auf einen Ruf für die Heatmap.'},
    'Zona 1 = recibe por la derecha · Zona 6 = por el medio · Zona 5 = por la izquierda. A qué rematador arma según de dónde le llega el pase (solo side-out). Filtrá por recepción y momento del set.':{en:'Zone 1 = receives on the right · Zone 6 = through the middle · Zone 5 = on the left. Which hitter they set by where the pass comes from (side-out only). Filter by reception and set moment.',de:'Zone 1 = Annahme rechts · Zone 6 = durch die Mitte · Zone 5 = links. Zu welchem Angreifer gestellt wird, je nach Passherkunft (nur Side-out). Filtere nach Annahme und Satzzeitpunkt.'},

    // ════ Footnote de rotación (fragmentos) ════
    'Orden de rotación real':{en:'Real rotation order',de:'Echte Rotationsreihenfolge'},
    'Zona del SETTER':{en:'SETTER zone',de:'ZUSPIELER-Zone'},
    'serving priority':{en:'serving priority',de:'Aufschlagpriorität'},
    'ordena las 6 rotaciones de la más floja':{en:'sorts the 6 rotations from the weakest',de:'sortiert die 6 Rotationen von der schwächsten'},
    'a la más fuerte':{en:'to the strongest',de:'zur stärksten'},
    'apretá el saque en las primeras':{en:'press the serve on the first ones',de:'forciere den Aufschlag bei den ersten'},
    'sus 3 jugadores en zona de ataque':{en:'their 3 players in the attack zone',de:'ihre 3 Spieler in der Angriffszone'},
    'in side-out':{en:'in side-out',de:'im Side-out'},

    // ════ Clave in/out system (fragmentos) ════
    'Rompiéndoles la recepción, su eficacia cae':{en:'Break their reception and their efficiency drops',de:'Bei gestörter Annahme fällt ihre Effizienz um'},
    'y el ataque se concentra en':{en:'and the attack concentrates on',de:'und der Angriff konzentriert sich auf'},
    'el ataque se concentra en':{en:'the attack concentrates on',de:'der Angriff konzentriert sich auf'},
    'entre los dos':{en:'between the two',de:'zwischen beiden'},
    'casi todo pelota alta':{en:'almost all high ball',de:'fast nur hohe Bälle'},
    'pelota alta':{en:'high ball',de:'hoher Ball'},
    'Sacar fuerte y cargar el bloqueo a ellos':{en:'Serve hard and load the block on them',de:'Stark aufschlagen und den Block auf sie laden'},

    // ════ FORMA RECIENTE ════
    'Forma reciente — cómo viene jugando ahora':{en:'Recent form — how they are playing now',de:'Aktuelle Form — wie sie gerade spielen'},
    'Forma reciente':{en:'Recent form',de:'Aktuelle Form'},
    'Atacaron en el último partido (su 6 probable)':{en:'Attacked in the last match (their likely 6)',de:'Im letzten Spiel angegriffen (wahrscheinliche Sechs)'},
    'El promedio de toda la temporada esconde cambios':{en:'The full-season average hides changes',de:'Der Saisondurchschnitt verbirgt Veränderungen'},
    'acá ves quién está jugando y en qué forma':{en:'here you see who is playing and in what form',de:'hier siehst du, wer spielt und in welcher Form'},
    'última fecha':{en:'last date',de:'letztes Datum'},
    'Temporada':{en:'Season',de:'Saison'},
    'Últimos 4':{en:'Last 4',de:'Letzte 4'},
    'Partido a partido':{en:'Match by match',de:'Spiel für Spiel'},
    'EN ALZA':{en:'RISING',de:'STEIGEND'},
    'EN BAJA':{en:'FALLING',de:'FALLEND'},
    'NUEVO TITULAR':{en:'NEW STARTER',de:'NEU IN DER STARTSECHS'},
    'AUSENTE':{en:'ABSENT',de:'ABWESEND'},
    'atacó en el último partido':{en:'attacked in the last match',de:'griff im letzten Spiel an'},
    'su eficacia de las últimas fechas cambió':{en:'their recent efficiency changed',de:'ihre Effizienz der letzten Spiele änderte sich um'},
    'vs su promedio de temporada':{en:'vs their season average',de:'gegenüber dem Saisondurchschnitt'},
    'está jugando aunque no era regular':{en:'is playing although they were not a regular',de:'spielt, obwohl kein Stammspieler'},
    'amenaza nueva':{en:'new threat',de:'neue Bedrohung'},
    'atacante habitual que no jugó las últimas fechas':{en:'regular attacker who did not play recently',de:'Stammangreifer, der zuletzt nicht spielte'},
    'pocas pelotas ese partido':{en:'few balls that match',de:'wenige Bälle in dem Spiel'},
    'atenuado':{en:'dimmed',de:'abgeschwächt'},

    // ════ Filtro de fundamentos (forma reciente) ════
    'Bloqueo':{en:'Block',de:'Block'},
    'Defensa':{en:'Defense',de:'Abwehr'},
    'Lo hicieron en el último partido':{en:'Did it in the last match',de:'Im letzten Spiel gemacht'},
    'Elegí un fundamento para ver quién lo está haciendo y en qué forma viene':{en:'Pick a skill to see who is doing it and in what form',de:'Wähle ein Element, um zu sehen, wer es macht und in welcher Form'},
    'la cifra es':{en:'the figure is',de:'die Zahl ist'},
    'Mostrando':{en:'Showing',de:'Zeige'},
    'eficacia':{en:'efficiency',de:'Effizienz'},
    'positiva%':{en:'positive%',de:'positiv%'},
    'Pocos datos de este fundamento en las últimas fechas.':{en:'Little data for this skill in recent matches.',de:'Wenig Daten für dieses Element in den letzten Spielen.'},
    'lo hizo en el último partido':{en:'did it in the last match',de:'machte es im letzten Spiel'},
    'su número de las últimas fechas cambió':{en:'their recent figure changed',de:'ihre Zahl der letzten Spiele änderte sich um'},
    'habitual que no jugó las últimas fechas':{en:'regular who did not play recently',de:'Stammspieler, der zuletzt nicht spielte'},
    'poco volumen ese partido':{en:'low volume that match',de:'wenig Volumen in dem Spiel'},
    'ahora':{en:'now',de:'jetzt'},
    'Últimos':{en:'Last',de:'Letzte'},
    'scouting basado en datos reales':{en:'scouting based on real data',de:'Scouting auf Basis echter Daten'},

    // ════ Plan de partido ════
    'Hoja de ruta del próximo rival — para imprimir y llevar al partido':{en:'Roadmap for the next opponent — to print and take to the match',de:'Fahrplan für den nächsten Gegner — zum Ausdrucken und Mitnehmen'},
    'a quién, cómo y dónde':{en:'who, how and where',de:'wer, wie und wo'},
    'Si les rompés la recepción':{en:'If you break their reception',de:'Wenn du ihre Annahme störst'},
    'cómo bloquearle y defenderle':{en:'how to block and defend them',de:'wie blocken und verteidigen'},
    'Qué produce cada llamada del armador: a qué rematador y con qué pelota termina.':{en:'What each setter call produces: which hitter and with what ball it ends.',de:'Was jeder Stellerruf erzeugt: welcher Angreifer und mit welchem Ball.'},
    'Prioridad por rotación':{en:'Priority by rotation',de:'Priorität nach Rotation'},
    'Al recibir, ojo con':{en:'When receiving, watch out for',de:'Bei der Annahme, Achtung bei'},
    'Al recibir':{en:'When receiving',de:'Bei der Annahme'},
    'Fuera de sistema va a':{en:'Out of system goes to',de:'Außerhalb des Systems geht zu'},
    'Su eficacia cae':{en:'Their efficiency drops',de:'Ihre Effizienz fällt'},
    'Cargá el bloqueo a ellos':{en:'Load the block on them',de:'Lade den Block auf sie'},
    'Elegí un rival arriba.':{en:'Pick an opponent above.',de:'Wähle oben einen Gegner.'},
    'Objetivo':{en:'Target',de:'Ziel'},
    '2º objetivo':{en:'2nd target',de:'2. Ziel'},
    'sacarle':{en:'serve at him',de:'auf ihn aufschlagen'},
    'positiva como equipo':{en:'positive as a team',de:'positiv als Team'},
    'como equipo':{en:'as a team',de:'als Team'},

    // ════ Páginas internas (filtros, defensa, ranking, video) ════
    'Todos':{en:'All',de:'Alle'},
    'Todas':{en:'All',de:'Alle'},
    'Ninguno':{en:'None',de:'Keiner'},
    'Ninguna':{en:'None',de:'Keine'},
    'Limpiar filtros':{en:'Clear filters',de:'Filter zurücksetzen'},
    'Marcar todos':{en:'Select all',de:'Alle markieren'},
    'Seleccionar...':{en:'Select...',de:'Auswählen...'},
    'Seleccionar…':{en:'Select…',de:'Auswählen…'},
    'Selecciona un jugador para comenzar':{en:'Select a player to start',de:'Spieler auswählen zum Starten'},
    'Selecciona un jugador':{en:'Select a player',de:'Spieler auswählen'},
    'Elegí un jugador para ver su defensa':{en:'Pick a player to see their defense',de:'Wähle einen Spieler für seine Abwehr'},
    'acciones filtradas':{en:'filtered actions',de:'gefilterte Aktionen'},
    'clips filtrados':{en:'filtered clips',de:'gefilterte Clips'},
    'defensas mostradas':{en:'defenses shown',de:'gezeigte Abwehraktionen'},
    'Sin datos para los filtros seleccionados':{en:'No data for the selected filters',de:'Keine Daten für die gewählten Filter'},
    'Sin defensas para los filtros elegidos':{en:'No defenses for the chosen filters',de:'Keine Abwehr für die gewählten Filter'},
    'Sin datos suficientes en esta rotación':{en:'Not enough data in this rotation',de:'Nicht genug Daten in dieser Rotation'},
    'Sin datos de transición':{en:'No transition data',de:'Keine Übergangsdaten'},
    'No hay acciones con esos filtros.':{en:'No actions with those filters.',de:'Keine Aktionen mit diesen Filtern.'},
    'Sin video para reproducir':{en:'No video to play',de:'Kein Video abspielbar'},
    'Sin datos':{en:'No data',de:'Keine Daten'},
    'Partido específico':{en:'Specific match',de:'Bestimmtes Spiel'},
    'Momento del set':{en:'Set moment',de:'Satzzeitpunkt'},
    'Evolucion partido a partido':{en:'Match-by-match evolution',de:'Entwicklung Spiel für Spiel'},
    'Evolución partido a partido':{en:'Match-by-match evolution',de:'Entwicklung Spiel für Spiel'},
    'Mapa de cancha':{en:'Court map',de:'Spielfeldkarte'},
    'Origen del ataque ↔ destino de la defensa':{en:'Attack origin ↔ defense destination',de:'Angriffsursprung ↔ Abwehrziel'},
    'Zona origen (saque rival)':{en:'Origin zone (opponent serve)',de:'Ursprungszone (Gegner-Aufschlag)'},
    'Zona origen':{en:'Origin zone',de:'Ursprungszone'},
    'Tipo de saque':{en:'Serve type',de:'Aufschlagart'},
    'Tipo de recepción':{en:'Reception type',de:'Annahmeart'},
    'Tipo de ataque':{en:'Attack type',de:'Angriffsart'},
    'Quién recibió':{en:'Who received',de:'Wer angenommen hat'},
    'EFF por rival':{en:'EFF by opponent',de:'EFF pro Gegner'},
    'Perfectas (#)':{en:'Perfect (#)',de:'Perfekt (#)'},
    'Perfectas':{en:'Perfect',de:'Perfekt'},
    'Mayor riesgo':{en:'Highest risk',de:'Höchstes Risiko'},
    'Pegá los links de YouTube':{en:'Paste the YouTube links',de:'YouTube-Links einfügen'},
    'Se guarda solo':{en:'Saves automatically',de:'Speichert automatisch'},
    'Siguiente':{en:'Next',de:'Weiter'},
    'Valoración':{en:'Rating',de:'Bewertung'},
    'Contexto':{en:'Context',de:'Kontext'},
    'Posición':{en:'Position',de:'Position'},
    'Velocidad':{en:'Speed',de:'Geschwindigkeit'},
    'Métrica':{en:'Metric',de:'Metrik'},
    'Origen':{en:'Origin',de:'Ursprung'},
    'Destino':{en:'Destination',de:'Ziel'},
    'Partidos':{en:'Matches',de:'Spiele'},
    'Partido':{en:'Match',de:'Spiel'},
    'Técnico':{en:'Coach',de:'Trainer'},
    'Inicio':{en:'Start',de:'Anfang'},
    'Transicion':{en:'Transition',de:'Übergang'},
    'pelotas / puntos':{en:'balls / points',de:'Bälle / Punkte'},
    'en orden de fecha':{en:'in date order',de:'nach Datum sortiert'},
    'concentrada':{en:'concentrated',de:'konzentriert'},
    'repartida':{en:'spread out',de:'verteilt'},
    'miniatura':{en:'thumbnail',de:'Vorschaubild'},
    'Distribución por rotación':{en:'Distribution by rotation',de:'Verteilung nach Rotation'},
    'A quién le arma en cada rotación':{en:'Who they set in each rotation',de:'Wen sie in jeder Rotation anspielen'},
    'Side-out (rec #+)':{en:'Side-out (rec #+)',de:'Side-out (Ann. #+)'},
    'Bolas':{en:'Balls',de:'Bälle'},
    'A quién le arma — % (kill%)':{en:'Who they set — % (kill%)',de:'Wen sie anspielen — % (Kill%)'},
    '% = cuántas pelotas le da a cada rematador en esa rotación · (k%) = su eficacia ahí. Orden P1·P6·P5·P4·P3·P2.':{en:'% = how many balls each hitter gets in that rotation · (k%) = their efficiency there. Order P1·P6·P5·P4·P3·P2.',de:'% = wie viele Bälle jeder Angreifer in dieser Rotation bekommt · (k%) = seine Effizienz dort. Reihenfolge P1·P6·P5·P4·P3·P2.'},
    'Estado físico diario':{en:'Daily physical state',de:'Täglicher körperlicher Zustand'},
    'Mi día':{en:'My day',de:'Mein Tag'},
    'Encuesta del día':{en:"Today's survey",de:'Tagesumfrage'},
    'Respondé del 1 al 10 cómo te sentís hoy':{en:'Rate from 1 to 10 how you feel today',de:'Bewerte von 1 bis 10, wie du dich heute fühlst'},
    '¿Después de qué?':{en:'After what?',de:'Wonach?'},
    'Sueño / descanso':{en:'Sleep / rest',de:'Schlaf / Erholung'},
    'Energía / vitalidad':{en:'Energy / vitality',de:'Energie / Vitalität'},
    'Frescura muscular (piernas)':{en:'Muscle freshness (legs)',de:'Muskelfrische (Beine)'},
    'Estado general del cuerpo':{en:'Overall body state',de:'Allgemeiner Körperzustand'},
    'Ánimo / motivación':{en:'Mood / motivation',de:'Stimmung / Motivation'},
    'Calma / manejo del estrés':{en:'Calm / stress management',de:'Ruhe / Stressbewältigung'},
    'Esfuerzo de la sesión (RPE)':{en:'Session effort (RPE)',de:'Belastung der Einheit (RPE)'},
    '10 = dormí excelente':{en:'10 = slept great',de:'10 = super geschlafen'},
    '10 = a full':{en:'10 = full energy',de:'10 = volle Energie'},
    '10 = sin dolor, frescas':{en:'10 = no pain, fresh',de:'10 = schmerzfrei, frisch'},
    '10 = impecable, sin molestias':{en:'10 = flawless, no issues',de:'10 = top, keine Beschwerden'},
    '10 = muy motivado':{en:'10 = very motivated',de:'10 = sehr motiviert'},
    '10 = relajado, sin estrés':{en:'10 = relaxed, no stress',de:'10 = entspannt, kein Stress'},
    '10 = durísima · solo carga, no entra al %':{en:'10 = very hard · load only, not in the %',de:'10 = sehr hart · nur Belastung, zählt nicht zum %'},
    'Tu wellness de hoy':{en:'Your wellness today',de:'Dein Wellness heute'},
    'Tu historial':{en:'Your history',de:'Dein Verlauf'},
    'Cómo viene tu estado físico':{en:'How your physical state is trending',de:'Wie sich dein körperlicher Zustand entwickelt'},
    'Elegí tu nombre y cargá tu primera encuesta.':{en:'Pick your name and submit your first survey.',de:'Wähle deinen Namen und reiche deine erste Umfrage ein.'},
    'Todavía no cargaste encuestas.':{en:"You haven't submitted any surveys yet.",de:'Du hast noch keine Umfragen eingereicht.'},
    'Tu promedio':{en:'Your average',de:'Dein Durchschnitt'},
    'Estado del equipo':{en:'Team status',de:'Mannschaftsstatus'},
    'Quién llega bien y quién necesita atención':{en:"Who's ready and who needs attention",de:'Wer fit ist und wer Aufmerksamkeit braucht'},
    'Promedio del equipo':{en:'Team average',de:'Mannschaftsdurchschnitt'},
    'Sin respuestas cargadas todavía.':{en:'No responses logged yet.',de:'Noch keine Antworten erfasst.'},
    'Nadie cargó la encuesta para este día todavía.':{en:'Nobody has submitted the survey for this day yet.',de:'Für diesen Tag hat noch niemand die Umfrage eingereicht.'},
    '🟢 Óptimo — listo para carga alta.':{en:'🟢 Optimal — ready for high load.',de:'🟢 Optimal — bereit für hohe Belastung.'},
    '🟢 Bien — estado normal para entrenar.':{en:'🟢 Good — normal state to train.',de:'🟢 Gut — normaler Zustand zum Training.'},
    '🟡 Precaución — monitorear, ajustar volumen si hace falta.':{en:'🟡 Caution — monitor, adjust volume if needed.',de:'🟡 Vorsicht — beobachten, Umfang bei Bedarf anpassen.'},
    '🔴 Alerta — posible fatiga, priorizar recuperación.':{en:'🔴 Alert — possible fatigue, prioritize recovery.',de:'🔴 Achtung — mögliche Ermüdung, Erholung priorisieren.'},
    'Nivel':{en:'Level',de:'Niveau'},
    'Día':{en:'Day',de:'Tag'},
    'Todas':{en:'All',de:'Alle'},
    'Ver tu preparación física':{en:'See your physical preparation',de:'Deine Athletikvorbereitung ansehen'},
    'ver wellness':{en:'see wellness',de:'Wellness ansehen'},
    'Armar rutinas':{en:'Build routines',de:'Trainingspläne erstellen'},
    'Mes':{en:'Month',de:'Monat'},
    'Sin rutina cargada':{en:'No routine loaded',de:'Kein Plan geladen'},
    'Llegó con readiness bajo':{en:'Came in with low readiness',de:'Kam mit niedriger Readiness'},
    'Considerá bajar volumen o intensidad y priorizar técnica.':{en:'Consider lowering volume or intensity and prioritizing technique.',de:'Erwäge weniger Umfang oder Intensität und Technikfokus.'},
    'Readiness moderado':{en:'Moderate readiness',de:'Mäßige Readiness'},
    'Ajustá la carga si lo notás cansado.':{en:'Adjust the load if you notice they are tired.',de:'Passe die Belastung an, wenn er müde wirkt.'},
    'Llegó en buen estado':{en:'Came in in good shape',de:'Kam in gutem Zustand'},
    'Listo para la carga planificada.':{en:'Ready for the planned load.',de:'Bereit für die geplante Belastung.'},
    'RPE último:':{en:'last RPE:',de:'letzter RPE:'},
    'readiness':{en:'readiness',de:'Readiness'},
    'hoy':{en:'today',de:'heute'},
    'Tus pesos y notas se guardan y':{en:'Your weights and notes are saved and',de:'Deine Gewichte und Notizen werden gespeichert und'},
    'sincronizan automáticamente':{en:'sync automatically',de:'synchronisieren automatisch'},
    'con tu cuenta.':{en:'with your account.',de:'mit deinem Konto.'},
    'respondieron':{en:'responded',de:'antworteten'},
    'en alerta':{en:'in alert',de:'im Alarm'}
  };
  var PHRASE_LC = {};
  (function(){
    Object.keys(T).forEach(function(k){ var e=T[k]; if(e&&e.es) PHRASE_LC[String(e.es).toLowerCase()]={en:e.en,de:e.de}; });
    Object.keys(PHRASES_EXTRA).forEach(function(es){ PHRASE_LC[es.toLowerCase()]=PHRASES_EXTRA[es]; });
  })();
  function trPhrase(es, lang){
    var raw=(es||'').trim(); if(!raw) return null;
    var e=PHRASE_LC[raw.toLowerCase()]; if(!e) return null;
    var out=e[lang]||raw;
    if(raw===raw.toUpperCase() && raw!==raw.toLowerCase()) out=out.toUpperCase();
    return out;
  }
  // ── Sustitución de frases conocidas DENTRO de un texto ────────────────────
  //  Permite traducir frases que vienen mezcladas con datos (nombres, números),
  //  ej: "Rematador principal: Schalch (Opuesto, 27 PJ)". Se reemplaza cada
  //  frase del diccionario que aparezca, respetando límites de palabra y
  //  priorizando las más largas. Esto es lo que hace la traducción automática:
  //  alcanza con tener el término en el diccionario una vez.
  var WORDCH='A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ';
  function escapeRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  var PHRASE_MAP=null, PHRASE_LCMAP=null, BIG_RE=null;
  function buildPhraseIndex(){
    PHRASE_MAP={}; PHRASE_LCMAP={}; var keys=[];
    function add(es,tr){ if(!es) return; es=String(es); if(!PHRASE_MAP[es]){ PHRASE_MAP[es]=tr; PHRASE_LCMAP[es.toLowerCase()]=tr; keys.push(es); } }
    Object.keys(T).forEach(function(k){ var e=T[k]; if(e&&e.es) add(e.es,{en:e.en,de:e.de}); });
    Object.keys(PHRASES_EXTRA).forEach(function(es){ add(es,PHRASES_EXTRA[es]); });
    keys.sort(function(a,b){ return b.length-a.length; });   // frases más largas primero
    try{ BIG_RE=new RegExp('(^|[^'+WORDCH+'])('+keys.map(escapeRe).join('|')+')(?!['+WORDCH+'])','gi'); }
    catch(e){ BIG_RE=null; }
  }
  function translateString(text, lang){
    if(lang==='es'||!text) return text;
    var exact=trPhrase(text.trim(),lang);
    if(exact!==null) return text.replace(text.trim(), exact);
    if(!PHRASE_MAP) buildPhraseIndex();
    if(!BIG_RE) return text;
    return text.replace(BIG_RE, function(m,pre,ph){
      var e=PHRASE_LCMAP[ph.toLowerCase()]; if(!e||!e[lang]) return m;
      var t=e[lang];
      if(ph===ph.toUpperCase() && ph!==ph.toLowerCase()) t=t.toUpperCase();
      return pre+t;
    });
  }
  window.translateString=translateString;
  var SKIP_TAGS={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1};
  function translateTextNodes(lang){
    if(!document.body) return;
    var walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode:function(n){
        var p=n.parentNode; if(!p||!p.nodeName) return NodeFilter.FILTER_REJECT;
        if(SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if(p.hasAttribute&&p.hasAttribute('data-t')) return NodeFilter.FILTER_REJECT;
        if(p.closest&&p.closest('#lang-wrap,[data-notr]')) return NodeFilter.FILTER_REJECT;
        if(!n.nodeValue||!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes=[],n; while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(function(node){
      if(node.__es==null) node.__es=node.nodeValue;
      var tr=translateString(node.__es, lang);
      if(node.nodeValue!==tr) node.nodeValue=tr;
    });
  }
  window.translateTextNodes=translateTextNodes;
  var _obs=null,_pend=null;
  function startObserver(){
    if(_obs||!window.MutationObserver||!document.body) return;
    _obs=new MutationObserver(function(){
      if(_pend) return;
      _pend=setTimeout(function(){ _pend=null;
        var lang=getLang(); if(lang==='es') return;
        _obs.disconnect(); translateTextNodes(lang); _obs.observe(document.body,{childList:true,subtree:true});
      },200);
    });
    _obs.observe(document.body,{childList:true,subtree:true});
  }

  function applyLang(lang){
    document.documentElement.setAttribute('lang', lang);
    // textos
    var els = document.querySelectorAll('[data-t]');
    for (var i=0; i<els.length; i++){
      var k = els[i].getAttribute('data-t');
      var v = tr(k, lang);
      if (v !== null) els[i].textContent = v;   // si no está en el diccionario, no toca nada
    }
    // placeholders
    var ph = document.querySelectorAll('[data-t-ph]');
    for (var j=0; j<ph.length; j++){
      var kp = ph[j].getAttribute('data-t-ph');
      var vp = tr(kp, lang);
      if (vp !== null) ph[j].setAttribute('placeholder', vp);
    }
    // traducir TODO el texto en español (incluye contenido dinámico)
    try { translateTextNodes(lang); } catch(e){}
    // avisar a otros scripts (ej. menú de temporadas) que cambió el idioma
    try { window.dispatchEvent(new CustomEvent('langchange', { detail:{ lang:lang } })); } catch(e){}
  }
  window.applyLang = applyLang;

  function setLang(lang){
    if (LANGS.indexOf(lang) < 0) return;
    try { localStorage.setItem(STORE, lang); } catch(e){}
    applyLang(lang);
    paintSelector(lang);
  }
  window.setLang = setLang;

  function paintSelector(active){
    var wrap = document.getElementById('lang-wrap');
    if (!wrap) {
      // si la página no tiene su propio selector, creamos uno flotante
      wrap = document.createElement('div');
      wrap.id = 'lang-wrap';
      wrap.setAttribute('data-notr','');
      wrap.style.cssText = 'position:fixed;top:10px;right:12px;z-index:99999;display:flex;gap:4px;'+
        'background:rgba(15,18,28,.85);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);'+
        'padding:4px 6px;border-radius:9px;border:1px solid rgba(255,255,255,.12)';
      (document.body || document.documentElement).appendChild(wrap);
      if (!document.getElementById('lang-wrap-print-css')) {
        var st = document.createElement('style');
        st.id = 'lang-wrap-print-css';
        st.textContent = '@media print{#lang-wrap{display:none!important}}';
        document.head.appendChild(st);
      }
    }
    wrap.innerHTML = '';
    LANGS.forEach(function(l){
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = LABELS[l];
      var on = (l === active);
      b.style.cssText =
        'font-family:Barlow Condensed,sans-serif;font-size:12px;font-weight:800;letter-spacing:1px;'+
        'cursor:pointer;border-radius:6px;padding:4px 8px;transition:all .15s;'+
        (on ? 'color:#fff;background:#e8192c;border:1px solid #e8192c;'
            : 'color:#94a3b8;background:transparent;border:1px solid rgba(255,255,255,.12);');
      b.addEventListener('click', function(){ setLang(l); });
      wrap.appendChild(b);
    });
  }

  function init(){
    var lang = getLang();
    paintSelector(lang);
    applyLang(lang);
    startObserver();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ===== Escudo del club en todas las páginas (abajo-izquierda, va a Inicio) ===== */
(function(){
  function addEscudo(){
    try{
      if(document.getElementById('club-escudo')) return;
      var a=document.createElement('a');
      a.id='club-escudo'; a.href='index.html'; a.title='Inicio · Volley Näfels';
      a.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99990;width:46px;height:46px;border-radius:50%;overflow:hidden;background:#000;border:1px solid rgba(255,255,255,.18);box-shadow:0 2px 12px rgba(0,0,0,.55);display:block;';
      var img=document.createElement('img');
      img.src='escudo.png'; img.alt='Volley Näfels';
      img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;';
      a.appendChild(img); document.body.appendChild(a);
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addEscudo);
  else addEscudo();
})();

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
