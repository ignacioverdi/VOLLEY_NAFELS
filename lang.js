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
    club_sub: { es:"Sistema de Análisis · NLA Suiza 2025/26", en:"Analysis System · Swiss NLA 2025/26", de:"Analysesystem · NLA Schweiz 2025/26" },
    sec_fixture: { es:"📅 Fixture · NLA Suiza 2025/26 · 26 partidos", en:"📅 Fixture · Swiss NLA 2025/26 · 26 matches", de:"📅 Spielplan · NLA Schweiz 2025/26 · 26 Spiele" },
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
    d_stats_liga: { es:"Base de datos completa NLA 2025/26. Ranking por equipo y stats individuales de toda la liga. Ataque, saque, recepción y bloqueo.", en:"Complete NLA 2025/26 database. Team ranking and individual stats for the whole league. Attack, serve, reception and block.", de:"Komplette NLA-Datenbank 2025/26. Mannschafts-Ranking und Einzelstatistiken der ganzen Liga. Angriff, Aufschlag, Annahme und Block." },
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
    'atenuado':{en:'dimmed',de:'abgeschwächt'}
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
    if (!wrap) return;
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
