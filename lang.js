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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
