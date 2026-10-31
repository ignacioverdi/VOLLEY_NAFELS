/* ============================================================================
   nav.js — la barra que convierte 68 pantallas sueltas en una sola app
   ----------------------------------------------------------------------------
   POR QUE EXISTE

   Hasta ahora cada pantalla era una isla: entrabas, hacias lo tuyo, volvias a
   la portada y buscabas la siguiente en una lista de 36 tarjetas. Para ir de
   Analisis a Game Plan habia que pasar por el inicio si o si.

   Esto pone arriba de TODAS las pantallas la misma barra, con las 45 pantallas
   agrupadas por para-que sirven. Desde cualquier lado se llega a cualquier
   lado en un clic.

   COMO NO ROMPE NADA

   · No toca el contenido de ninguna pantalla: se agrega al principio del
     <body> y corre el resto 52 px para abajo.
   · Las pantallas de pantalla completa (Panel en vivo, Panel de voley, la
     camara, el pizarron de TV y las de delay) NO la llevan: ahi la barra
     estorba y la velocidad manda.
   · Los grupos y las pantallas salen de las secciones que la portada ya
     tenia. No se invento ninguna pantalla ni se escondio ninguna.
   · Al imprimir, desaparece.

   APAGARLA
       localStorage.setItem('vs_nav','off')   y recargar
   ============================================================================ */
(function(){
  'use strict';
  try{ if(localStorage.getItem('vs_nav') === 'off') return; }catch(e){}
  /* ── LA BARRA NO VA EN UNA PAGINA PUBLICA ──────────────────────────────
     El calendario de la liga lo abre gente de afuera del club, que no tiene
     con que entrar a ninguna de las 45 pantallas. A ellos la barra no les
     sirve para nada y ademas les dibuja el mapa completo del sistema.
     Al que ya entro en ese dispositivo se le muestra igual que siempre. */
  try{ if(window.VB_PUBLICA && !localStorage.getItem('nla_sesion')) return; }catch(e){}
  if(window.__VS_NAV) return; window.__VS_NAV = true;

  var D = {"antena":"<circle cx=\"12\" cy=\"12\" r=\"2.2\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 15.8a5.4 5.4 0 0 0 0-7.6\"/><path d=\"M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 18.6a9.4 9.4 0 0 0 0-13.2\"/>","archivo":"<path d=\"M13.6 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.6l-5.4-5.4Z\"/><path d=\"M13.4 3.4v5.2h5.3\"/>","armado":"<circle cx=\"12\" cy=\"6.6\" r=\"3.4\"/><path d=\"m5.4 20.4 3.4-5.2M18.6 20.4l-3.4-5.2\"/><path d=\"m8.8 15.2 3.2-2 3.2 2\"/>","balanza":"<path d=\"M12 4.2v15.4\"/><path d=\"M8.2 19.6h7.6\"/><path d=\"M4.4 7.6h15.2\"/><path d=\"m4.4 7.6-2.2 5.2a2.6 2.6 0 0 0 4.4 0L4.4 7.6Z\"/><path d=\"m19.6 7.6-2.2 5.2a2.6 2.6 0 0 0 4.4 0l-2.2-5.2Z\"/><circle cx=\"12\" cy=\"5.2\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>","barras":"<path d=\"M4 20h16\"/><rect x=\"5.5\" y=\"11\" width=\"3.4\" height=\"6\"/><rect x=\"10.3\" y=\"7\" width=\"3.4\" height=\"10\"/><rect x=\"15.1\" y=\"13.5\" width=\"3.4\" height=\"3.5\"/>","calendario":"<rect x=\"4\" y=\"5.5\" width=\"16\" height=\"14.5\" rx=\"2\"/><path d=\"M4 10h16\"/><path d=\"M8.5 3.4v3.6M15.5 3.4v3.6\"/>","calendario_dias":"<rect x=\"4\" y=\"5.5\" width=\"16\" height=\"14.5\" rx=\"2\"/><path d=\"M4 10h16\"/><path d=\"M8.5 3.4v3.6M15.5 3.4v3.6\"/><path d=\"M8 13.4h.01M12 13.4h.01M16 13.4h.01M8 16.8h.01M12 16.8h.01\"/>","camara_video":"<rect x=\"3\" y=\"7\" width=\"12.5\" height=\"10\" rx=\"2\"/><path d=\"m15.5 11 5-2.8v7.6l-5-2.8V11Z\"/>","candado":"<rect x=\"4.6\" y=\"10.4\" width=\"14.8\" height=\"10.2\" rx=\"2\"/><path d=\"M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8\"/><circle cx=\"12\" cy=\"15.4\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>","carpeta":"<path d=\"M3.4 18.2V6.4a1.6 1.6 0 0 1 1.6-1.6h4l2 2.4h7.6a1.6 1.6 0 0 1 1.6 1.6v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z\"/>","casa":"<path d=\"m3.4 10.4 8.6-7 8.6 7\"/><path d=\"M5.6 9v10.6a1.4 1.4 0 0 0 1.4 1.4h10a1.4 1.4 0 0 0 1.4-1.4V9\"/><path d=\"M9.8 21v-6.4h4.4V21\"/>","claqueta":"<rect x=\"3.2\" y=\"7.5\" width=\"17.6\" height=\"12.5\" rx=\"2\"/><path d=\"m3.6 11.4 17-1.5\"/><path d=\"M4.2 7.6 8 4.4l3 3.2M11 7.3 14.8 4l3 3.2\"/>","cronometro":"<circle cx=\"12\" cy=\"13.4\" r=\"7.8\"/><path d=\"M12 9.4v4h3\"/><path d=\"M9.4 2.6h5.2\"/><path d=\"m18.8 6.6 1.6-1.6\"/>","diana":"<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.8\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>","enlace":"<path d=\"M9.8 14.2a3.8 3.8 0 0 1 0-5.4l3-3a3.8 3.8 0 0 1 5.4 5.4l-1.4 1.4\"/><path d=\"M14.2 9.8a3.8 3.8 0 0 1 0 5.4l-3 3a3.8 3.8 0 0 1-5.4-5.4l1.4-1.4\"/>","escudo":"<path d=\"M12 3.2 5 6v5.6c0 4.2 2.8 7.5 7 9.2 4.2-1.7 7-5 7-9.2V6l-7-2.8Z\"/>","estetoscopio":"<path d=\"M6 3.2v4.4a4 4 0 0 0 8 0V3.2\"/><path d=\"M6 3.2H4.4M14 3.2h1.6\"/><path d=\"M10 11.6v2.2a4.6 4.6 0 0 0 9.2 0v-1\"/><circle cx=\"19.2\" cy=\"10.4\" r=\"2.2\"/>","guante":"<path d=\"M7.5 20.5v-4.3l-1.6-2.4a2 2 0 0 1 3-2.6l.6.6V5.3a1.6 1.6 0 1 1 3.2 0v4.1\"/><path d=\"M12.7 9.4V7.6a1.6 1.6 0 1 1 3.2 0v2.2\"/><path d=\"M15.9 9.9V9a1.6 1.6 0 1 1 3.1 0v6.3c0 2-.8 3.8-2.1 5.2\"/>","herramientas":"<path d=\"M14.2 6.4a3.8 3.8 0 0 0 5.1 5l-5.1-5Z\"/><path d=\"m13.2 7.4-9 9a2.2 2.2 0 0 0 3.1 3.1l9-9\"/><path d=\"m5.4 5.2 3.2-1.4 2.8 2.8-1.2 3.2-3.2 1.2L4.2 8.2l1.2-3Z\"/>","impacto":"<path d=\"m12 2.6 2.2 4.9 5-1.3-2.1 4.8 4.1 3.2-5 1.4.6 5.2-4.4-2.8-4.4 2.8.6-5.2-5-1.4 4.1-3.2L5.7 6.2l5 1.3L12 2.6Z\"/>","ladrillos":"<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"4.6\" rx=\".8\"/><rect x=\"3.5\" y=\"9.6\" width=\"17\" height=\"4.6\" rx=\".8\"/><rect x=\"3.5\" y=\"14.2\" width=\"17\" height=\"4.6\" rx=\".8\"/><path d=\"M9.5 5v4.6M15 9.6v4.6M9.5 14.2v4.6\"/>","libro":"<path d=\"M4 4.6h5.4A3.2 3.2 0 0 1 12 6.2v13a2.4 2.4 0 0 0-2-1.2H4V4.6Z\"/><path d=\"M20 4.6h-5.4A3.2 3.2 0 0 0 12 6.2v13a2.4 2.4 0 0 1 2-1.2h6V4.6Z\"/>","linea":"<path d=\"M4 20V4\"/><path d=\"M4 20h16\"/><path d=\"m6.5 15.5 3.6-4.2 2.9 2.4 4.9-6\"/><circle cx=\"17.9\" cy=\"7.7\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/>","lupa":"<circle cx=\"10.8\" cy=\"10.8\" r=\"6.6\"/><path d=\"m15.6 15.6 4.6 4.6\"/>","mancuerna":"<path d=\"M3 10.2v3.6M6 8.4v7.2M18 8.4v7.2M21 10.2v3.6\"/><path d=\"M6 12h12\"/>","ojo":"<path d=\"M1.8 12s3.8-7 10.2-7 10.2 7 10.2 7-3.8 7-10.2 7S1.8 12 1.8 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3.2\"/>","pantalla":"<rect x=\"3\" y=\"4.5\" width=\"18\" height=\"12.5\" rx=\"2\"/><path d=\"M8.5 20.5h7M12 17v3.5\"/>","pelicula":"<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M7 6v12M17 6v12\"/><path d=\"M3 10h4M3 14h4M17 10h4M17 14h4\"/>","pelota":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12.4 3c-3.9 3.3-5.4 8.6-3.7 13.4\"/><path d=\"M20.8 9.6c-5 .5-9.3 3.8-11.1 8.6\"/><path d=\"M3.5 14.9c3.6-3.5 8.9-4.9 13.8-3.4\"/>","persona":"<circle cx=\"12\" cy=\"8\" r=\"3.6\"/><path d=\"M4.8 20.4c.6-3.8 3.6-6.2 7.2-6.2s6.6 2.4 7.2 6.2\"/>","personas":"<circle cx=\"9.2\" cy=\"8.2\" r=\"3.2\"/><path d=\"M2.8 20c.6-3.4 3.2-5.6 6.4-5.6s5.8 2.2 6.4 5.6\"/><path d=\"M16.2 5.4a3.2 3.2 0 0 1 0 6.2\"/><path d=\"M17.4 14.8c2.1.6 3.5 2.4 3.9 5.2\"/>","planilla":"<rect x=\"5\" y=\"4.5\" width=\"14\" height=\"16\" rx=\"2\"/><path d=\"M9 4.5a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 4.5v1H9v-1Z\"/><path d=\"M8.6 11h6.8M8.6 15h4.4\"/>","rayo":"<path d=\"M13.4 2.5 5.6 13.2h5.3l-.9 8.3 8.2-10.9h-5.4l.6-8.1Z\"/>","rotar":"<path d=\"M20.2 11.2a8.2 8.2 0 1 1-2.4-5.4\"/><path d=\"M20.4 3.6v4.8h-4.8\"/>","subir":"<path d=\"M12 20V8.4\"/><path d=\"m7.4 12.8 4.6-4.6 4.6 4.6\"/><path d=\"M4.4 4.4h15.2\"/>","tijera":"<circle cx=\"6.4\" cy=\"6.4\" r=\"2.8\"/><circle cx=\"6.4\" cy=\"17.6\" r=\"2.8\"/><path d=\"m8.4 8.4 11.2 9.2M19.6 6.4 8.4 15.6\"/>","trofeo":"<path d=\"M8 4h8v5a4 4 0 0 1-8 0V4Z\"/><path d=\"M8 5.5H5.5A2.5 2.5 0 0 0 5.9 10c.7.3 1.4.4 2.1.4\"/><path d=\"M16 5.5h2.5a2.5 2.5 0 0 1-.4 4.5c-.7.3-1.4.4-2.1.4\"/><path d=\"M12 13v3.5\"/><path d=\"M9 20h6\"/><path d=\"M10 16.5h4L15 20H9l1-3.5Z\"/>","viento":"<path d=\"M3.4 8.4h10a2.8 2.8 0 1 0-2.8-2.8\"/><path d=\"M3.4 12.6h14.2a2.8 2.8 0 1 1-2.8 2.8\"/><path d=\"M3.4 16.8h7.2\"/>"};
  var G = [{"id":"inicio","ic":"casa","n":{"es":"Inicio","en":"Home","de":"Start"},"sub":null,"href":"index.html","items":[]},{"id":"partido","ic":"diana","n":{"es":"Partido","en":"Match","de":"Spiel"},"sub":{"es":"Preparar el proximo","en":"Prepare the next one","de":"Das naechste vorbereiten"},"href":null,"items":[["game_plan.html","Game Plan","Game Plan","Game Plan","diana"],["scouting_rival.html","Scouting del rival","Opponent scouting","Gegner-Scouting","lupa"],["rotaciones.html","Rotaciones","Rotations","Rotationen","rotar"],["comparador.html","Comparador","Comparator","Vergleich","balanza"],["plan_partido.html","Accion por accion","Action by action","Aktion fuer Aktion","planilla"],["Team_Playbook_Nafels.html","Playbook","Playbook","Playbook","libro"],["p2.html","Planilla P-2","P-2 sheet","P-2 Formular","archivo"]]},{"id":"rendimiento","ic":"barras","n":{"es":"Rendimiento","en":"Performance","de":"Leistung"},"sub":{"es":"Los numeros","en":"The numbers","de":"Die Zahlen"},"href":null,"items":[["analisis.html","Analisis del partido","Match analysis","Spielanalyse","barras"],["dashboard.html","Dashboard","Dashboard","Dashboard","linea"],["informe_equipo.html","Informe de equipo","Team report","Teambericht","archivo"],["hm_saque.html","Mapa de saque","Serve map","Aufschlagkarte","rayo"],["hm_recepcion.html","Mapa de recepcion","Reception map","Annahmekarte","escudo"],["hm_ataque.html","Mapa de ataque","Attack map","Angriffskarte","impacto"],["hm_bloqueo.html","Mapa de bloqueo","Block map","Blockkarte","ladrillos"],["hm_defensa.html","Mapa de defensa","Defence map","Abwehrkarte","guante"],["hm_armador.html","Mapa de armado","Setting map","Zuspielkarte","armado"],["armadores.html","Armadores","Setters","Zuspieler","armado"],["high_set.html","High Set","High Set","High Set","pelota"],["nla_stats_table.html","Tabla de la liga","League table","Liga-Tabelle","trofeo"],["historial_voley.html","Historial","History","Verlauf","cronometro"]]},{"id":"plantel","ic":"personas","n":{"es":"Plantel","en":"Squad","de":"Kader"},"sub":{"es":"Jugador por jugador","en":"Player by player","de":"Spieler fuer Spieler"},"href":null,"items":[["equipo.html","Equipo","Team","Team","personas"],["jugador.html","Ficha del jugador","Player profile","Spielerprofil","persona"],["mi_juego.html","Mi juego","My game","Mein Spiel","barras"],["plan_desarrollo.html","Plan de desarrollo","Development plan","Entwicklungsplan","subir"],["objetivos_equipo.html","Objetivos del plantel","Squad objectives","Teamziele","diana"]]},{"id":"video","ic":"claqueta","n":{"es":"Video","en":"Video","de":"Video"},"sub":{"es":"Clips y partidos","en":"Clips and matches","de":"Clips und Spiele"},"href":null,"items":[["cortes.html","Cortes de video","Video clips","Videoclips","tijera"],["sintesis.html","Sintesis del partido","Match synthesis","Spielzusammenfassung","pelicula"],["importar_video.html","Cargar videos","Upload videos","Videos hochladen","subir"],["unir_video.html","Unir videos","Merge videos","Videos zusammenfuegen","enlace"],["pizarron.html","Pizarron (TV)","Whiteboard (TV)","Tafel (TV)","pantalla"]]},{"id":"vivo","ic":"antena","n":{"es":"En vivo","en":"Live","de":"Live"},"sub":{"es":"Durante el partido","en":"During the match","de":"Waehrend des Spiels"},"href":null,"items":[["panel_vivo.html","Scout en vivo","Live scout","Live-Scout","diana"],["panel_voley.html","Panel en vivo","Live panel","Live-Panel","antena"],["velocidades_vivo.html","Velocidades","Serve speeds","Aufschlagtempo","viento"],["camara.html","Camara del partido","Match camera","Spielkamera","camara_video"]]},{"id":"dia","ic":"calendario","n":{"es":"Dia a dia","en":"Day to day","de":"Alltag"},"sub":{"es":"Agenda y fisico","en":"Schedule and fitness","de":"Termine und Fitness"},"href":null,"items":[["calendario.html","Calendario","Calendar","Kalender","calendario"],["horarios.html","Horarios","Schedule","Zeitplan","cronometro"],["prep_fisica.html","Preparacion fisica","Physical prep","Athletik","mancuerna"],["wellness.html","Wellness","Wellness","Wellness","estetoscopio"],["baggerone.html","Baggerone","Baggerone","Baggerone","trofeo"]]},{"id":"dt","ic":"herramientas","n":{"es":"Entrenador","en":"Coach","de":"Trainer"},"sub":{"es":"Cargar y administrar","en":"Load and manage","de":"Laden und verwalten"},"href":null,"items":[["subir_partido.html","Subir partido","Upload match","Spiel hochladen","subir"],["importar_dvw.html","Importar DVW","Import DVW","DVW importieren","carpeta"],["asociar_codigos.html","Asociar codigos","Link codes","Codes zuordnen","enlace"],["alta_jugadores.html","Alta de jugadores","Add players","Spieler anlegen","personas"],["sesiones.html","Sesiones y equipos","Sessions and devices","Sitzungen und Geraete","candado"],["actividad.html","Quien entra y que mira","Who logs in","Wer sich anmeldet","ojo"],["temporadas.html","Temporadas","Seasons","Saisons","calendario_dias"]]}];

  function idioma(){
    var l=''; try{ l = localStorage.getItem('vb_lang') || ''; }catch(e){}
    if(!l){ try{ l = (navigator.language||'').slice(0,2).toLowerCase(); }catch(e){} }
    return (l === 'en' || l === 'de') ? l : 'es';
  }
  function txt(o){ var l = idioma(); return (o && (o[l] || o.es)) || ''; }
  function nom(it){ var l = idioma(); return l === 'en' ? it[2] : l === 'de' ? it[3] : it[1]; }

  function svg(n, cls){
    if(!D[n]) n = 'menu';
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="'+cls+'"' : '') + '>' + D[n] + '</svg>';
  }

  var AQUI = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  function esAqui(h){ return h.toLowerCase().split('?')[0] === AQUI; }

  /* ── la barra ───────────────────────────────────────────────────────── */
  var css = document.createElement('style'); css.id = 'vsn-css';
  css.textContent = "\n:root{ --vsn-h:52px; }\nbody{ padding-top:var(--vsn-h) !important; }\n#vsn{position:fixed;top:0;left:0;right:0;height:var(--vsn-h);z-index:2147482500;\n  display:flex;align-items:center;gap:6px;padding:0 10px;\n  background:rgba(8,9,16,.92);backdrop-filter:blur(18px);\n  border-bottom:1px solid rgba(255,255,255,.08);\n  font-family:'Barlow Condensed',system-ui,sans-serif;color:#E9ECF3;\n  box-shadow:0 10px 30px -22px #000}\n#vsn *{box-sizing:border-box}\n#vsn .marca{display:flex;align-items:center;gap:8px;flex:none;padding-right:10px;\n  margin-right:4px;border-right:1px solid rgba(255,255,255,.09);text-decoration:none;color:inherit}\n#vsn .marca img{width:26px;height:26px;border-radius:50%;object-fit:contain}\n#vsn .marca b{font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:.09em;color:#fff;line-height:1}\n#vsn .marca i{display:block;font-style:normal;font-size:9px;letter-spacing:.17em;color:#8A93A3;margin-top:1px}\n#vsn .grupos{display:flex;align-items:center;gap:2px;flex:1;min-width:0;overflow:hidden}\n#vsn .g{display:flex;align-items:center;gap:7px;height:36px;padding:0 11px;border:0;border-radius:9px;\n  background:none;color:#AEB6C4;font:600 13.5px/1 'Barlow Condensed',system-ui,sans-serif;\n  letter-spacing:.04em;cursor:pointer;white-space:nowrap;transition:background .14s,color .14s}\n#vsn .g svg{width:17px;height:17px;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;\n  stroke-linecap:round;stroke-linejoin:round}\n#vsn .g:hover{background:rgba(255,255,255,.06);color:#fff}\n#vsn .g.on{background:rgba(232,25,44,.14);color:#fff;box-shadow:inset 0 0 0 1px rgba(232,25,44,.34)}\n#vsn .g.aqui{color:#fff}\n#vsn .g.aqui::after{content:'';position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);\n  width:16px;height:2px;border-radius:2px;background:#E8192C}\n#vsn .g{position:relative}\n#vsn .der{display:flex;align-items:center;gap:6px;flex:none}\n#vsn .bb{display:flex;align-items:center;gap:7px;height:34px;padding:0 11px;border-radius:9px;\n  border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.04);color:#9AA3B2;\n  font:600 12.5px/1 'Barlow Condensed',system-ui,sans-serif;cursor:pointer;white-space:nowrap}\n#vsn .bb:hover{color:#fff;border-color:rgba(255,255,255,.22)}\n#vsn .bb svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.8;\n  stroke-linecap:round;stroke-linejoin:round}\n#vsn .bb kbd{font:600 10px/1 'JetBrains Mono',monospace;color:#6C7483;border:1px solid rgba(255,255,255,.14);\n  border-radius:4px;padding:2px 4px}\n#vsn .menu{display:none}\n\n/* el panel de un grupo */\n#vsn-panel{position:fixed;top:var(--vsn-h);left:0;right:0;z-index:2147482400;\n  background:rgba(10,11,19,.975);backdrop-filter:blur(22px);\n  border-bottom:1px solid rgba(255,255,255,.1);box-shadow:0 26px 60px -30px #000;\n  padding:16px 18px 20px;display:none;\n  font-family:'Barlow Condensed',system-ui,sans-serif}\n#vsn-panel.on{display:block}\n#vsn-panel .tit{font:700 10.5px/1 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.2em;\n  color:#E8192C;text-transform:uppercase;margin-bottom:12px}\n#vsn-panel .rej{display:grid;grid-template-columns:repeat(auto-fill,minmax(212px,1fr));gap:7px;\n  max-width:1180px}\n#vsn-panel a{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;\n  text-decoration:none;color:#C9D0DC;border:1px solid transparent;transition:background .12s,border-color .12s}\n#vsn-panel a:hover{background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.09);color:#fff}\n#vsn-panel a.aqui{background:rgba(232,25,44,.12);border-color:rgba(232,25,44,.3);color:#fff}\n#vsn-panel a svg{width:18px;height:18px;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;\n  stroke-linecap:round;stroke-linejoin:round;opacity:.85}\n#vsn-panel a span{font:600 14px/1.15 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.02em}\n#vsn-velo{position:fixed;inset:0;z-index:2147482300;background:rgba(2,3,7,.5);display:none}\n#vsn-velo.on{display:block}\n\n/* el buscador */\n#vsn-busca{position:fixed;top:var(--vsn-h);left:50%;transform:translateX(-50%);z-index:2147482600;\n  width:min(560px,calc(100vw - 24px));background:rgba(12,13,22,.98);backdrop-filter:blur(22px);\n  border:1px solid rgba(255,255,255,.12);border-top:0;border-radius:0 0 14px 14px;\n  box-shadow:0 30px 70px -28px #000;display:none;overflow:hidden;\n  font-family:'Barlow Condensed',system-ui,sans-serif}\n#vsn-busca.on{display:block}\n#vsn-busca input{width:100%;height:50px;padding:0 16px;border:0;outline:0;background:none;\n  color:#fff;font:600 17px/1 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.02em}\n#vsn-busca input::placeholder{color:#6C7483}\n#vsn-busca .res{max-height:46vh;overflow:auto;border-top:1px solid rgba(255,255,255,.08)}\n#vsn-busca .res a{display:flex;align-items:center;gap:11px;padding:10px 16px;text-decoration:none;color:#C9D0DC}\n#vsn-busca .res a svg{width:17px;height:17px;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;\n  stroke-linecap:round;stroke-linejoin:round;opacity:.8}\n#vsn-busca .res a .g2{margin-left:auto;font-size:10.5px;letter-spacing:.14em;color:#6C7483;text-transform:uppercase}\n#vsn-busca .res a.sel,#vsn-busca .res a:hover{background:rgba(232,25,44,.14);color:#fff}\n#vsn-busca .nada{padding:16px;color:#6C7483;font-size:13.5px}\n\n/* telefono y tablet */\n@media (max-width:1100px){\n  #vsn .grupos{display:none}\n  #vsn .menu{display:flex}\n  #vsn .bb .txt{display:none}\n  #vsn-panel{top:var(--vsn-h);bottom:0;overflow:auto;padding-bottom:40px}\n  #vsn-panel .rej{grid-template-columns:1fr 1fr}\n  #vsn-panel .bloque{margin-bottom:20px}\n}\n@media (max-width:560px){\n  #vsn-panel .rej{grid-template-columns:1fr}\n  #vsn .marca i{display:none}\n}\n@media print{ #vsn,#vsn-panel,#vsn-velo,#vsn-busca{display:none !important} body{padding-top:0 !important} }\n";
  (document.head || document.documentElement).appendChild(css);

  var bar = document.createElement('nav'); bar.id = 'vsn';
  var grupos = G.map(function(g){
    var dentro = g.items.some(function(i){ return esAqui(i[0]); }) || (g.href && esAqui(g.href));
    return '<button class="g' + (dentro ? ' aqui' : '') + '" data-g="' + g.id + '">' +
           svg(g.ic) + '<span>' + txt(g.n) + '</span></button>';
  }).join('');

  bar.innerHTML =
    '<a class="marca" href="index.html" title="Inicio">' +
      '<img src="escudo.png" alt="" onerror="this.style.display=\'none\'">' +
      '<span><b>VOLLEY-STATS</b><i>NAFELS</i></span></a>' +
    '<button class="bb menu" data-g="__todo">' + svg('menu') + '<span class="txt">Menu</span></button>' +
    '<div class="grupos">' + grupos + '</div>' +
    '<div class="der">' +
      '<button class="bb" id="vsn-b">' + svg('lupa') + '<span class="txt">Buscar</span><kbd>/</kbd></button>' +
    '</div>';

  var velo = document.createElement('div'); velo.id = 'vsn-velo';
  var panel = document.createElement('div'); panel.id = 'vsn-panel';
  var busca = document.createElement('div'); busca.id = 'vsn-busca';
  busca.innerHTML = '<input type="text" placeholder="' +
    (idioma()==='en' ? 'Which screen are you looking for?' : idioma()==='de' ? 'Welchen Bildschirm suchst du?' : 'Que pantalla buscas?') +
    '" autocomplete="off" spellcheck="false"><div class="res"></div>';

  function montar(){
    if(!document.body) return setTimeout(montar, 20);
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.appendChild(velo);
    document.body.appendChild(panel);
    document.body.appendChild(busca);
    armarIndice();
    enganchar();
  }

  /* ── el panel de cada grupo ─────────────────────────────────────────── */
  function filas(g){
    return '<div class="rej">' + g.items.map(function(i){
      return '<a href="' + i[0] + '"' + (esAqui(i[0]) ? ' class="aqui"' : '') + '>' +
             svg(i[4]) + '<span>' + nom(i) + '</span></a>';
    }).join('') + '</div>';
  }

  function abrir(id){
    var html = '';
    if(id === '__todo'){
      html = G.filter(function(g){ return g.items.length; }).map(function(g){
        return '<div class="bloque"><div class="tit">' + txt(g.n) + '</div>' + filas(g) + '</div>';
      }).join('');
    } else {
      var g = G.filter(function(x){ return x.id === id; })[0];
      if(!g) return;
      if(!g.items.length){ location.href = g.href || 'index.html'; return; }
      html = '<div class="tit">' + txt(g.n) + (g.sub ? ' · ' + txt(g.sub) : '') + '</div>' + filas(g);
    }
    panel.innerHTML = html;
    panel.classList.add('on'); velo.classList.add('on');
    [].forEach.call(bar.querySelectorAll('.g,.menu'), function(b){
      b.classList.toggle('on', b.getAttribute('data-g') === id);
    });
    cerrarBusca();
  }
  function cerrar(){
    panel.classList.remove('on'); velo.classList.remove('on');
    [].forEach.call(bar.querySelectorAll('.g,.menu'), function(b){ b.classList.remove('on'); });
  }

  /* ── el buscador ────────────────────────────────────────────────────── */
  var TODAS = [];
  /* el indice guarda los nombres en los TRES idiomas: el entrenador piensa en
     castellano aunque la app este en ingles, y al reves con los jugadores */
  function armarIndice(){
    TODAS = [];
    G.forEach(function(g){ g.items.forEach(function(i){
      TODAS.push({h:i[0], n:nom(i), ic:i[4], g:txt(g.n),
                  k: sinTildes(i[1]+' '+i[2]+' '+i[3]+' '+txt(g.n)+' '+i[0])});
    }); });
  }

  function sinTildes(s){
    try{ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
    catch(e){ return s.toLowerCase(); }
  }
  function pintarRes(q){
    var r = busca.querySelector('.res');
    var t = sinTildes(q.trim());
    var l = t ? TODAS.filter(function(x){ return x.k.indexOf(t) >= 0; }) : TODAS.slice(0, 10);
    if(!l.length){ r.innerHTML = '<div class="nada">Nada con eso.</div>'; return; }
    r.innerHTML = l.slice(0, 40).map(function(x, k){
      return '<a href="' + x.h + '"' + (k === 0 ? ' class="sel"' : '') + '>' + svg(x.ic) +
             '<span>' + x.n + '</span><span class="g2">' + x.g + '</span></a>';
    }).join('');
  }
  function abrirBusca(){
    cerrar();
    busca.classList.add('on'); velo.classList.add('on');
    pintarRes('');
    var i = busca.querySelector('input'); i.value = ''; setTimeout(function(){ i.focus(); }, 10);
  }
  function cerrarBusca(){ busca.classList.remove('on'); }

  function repintar(){
    [].forEach.call(bar.querySelectorAll('.g'), function(b){
      var g = G.filter(function(x){ return x.id === b.getAttribute('data-g'); })[0];
      if(g){ var s = b.querySelector('span'); if(s) s.textContent = txt(g.n); }
    });
    armarIndice();
    var abierto = bar.querySelector('.g.on,.menu.on');
    if(abierto) abrir(abierto.getAttribute('data-g'));
  }

  /* ── los enganches ──────────────────────────────────────────────────── */
  function enganchar(){
    bar.addEventListener('click', function(e){
      var b = e.target.closest ? e.target.closest('.g,.menu,#vsn-b') : null;
      if(!b) return;
      if(b.id === 'vsn-b'){ abrirBusca(); return; }
      var id = b.getAttribute('data-g');
      if(b.classList.contains('on')) cerrar(); else abrir(id);
    });
    velo.addEventListener('click', function(){ cerrar(); cerrarBusca(); velo.classList.remove('on'); });
    busca.querySelector('input').addEventListener('input', function(){ pintarRes(this.value); });
    busca.addEventListener('keydown', function(e){
      var sel = busca.querySelector('.res a.sel');
      if(e.key === 'Enter' && sel){ e.preventDefault(); location.href = sel.getAttribute('href'); }
      if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        e.preventDefault();
        var todos = [].slice.call(busca.querySelectorAll('.res a'));
        var k = todos.indexOf(sel);
        k = e.key === 'ArrowDown' ? Math.min(todos.length - 1, k + 1) : Math.max(0, k - 1);
        todos.forEach(function(a){ a.classList.remove('sel'); });
        if(todos[k]){ todos[k].classList.add('sel'); todos[k].scrollIntoView({block:'nearest'}); }
      }
    });
    document.addEventListener('keydown', function(e){
      var en = document.activeElement;
      var escribiendo = en && (/INPUT|TEXTAREA|SELECT/.test(en.tagName) || en.isContentEditable);
      if(e.key === '/' && !escribiendo){ e.preventDefault(); abrirBusca(); }
      if(e.key === 'Escape'){ cerrar(); cerrarBusca(); velo.classList.remove('on'); }
    });
    /* si cambian el idioma, se repintan las etiquetas. OJO: aca NO va un
       location.reload() — lang.js dispara 'langchange' tambien al arrancar,
       asi que la pagina se recargaba sola en un bucle sin fin. */
    try{ window.addEventListener('langchange', repintar); }catch(e){}
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

/*[vsl]*/
/* ══════════════════════════════════════════════════════════════════════════
   LA BARRA LATERAL · 2026/27
   Medida sobre la maqueta, no a ojo. Los numeros de abajo salen de contar
   pixeles en la imagen de referencia (1536 x 1024):

     franja de arriba .... alto 88 px, de borde a borde (va ARRIBA del riel)
     riel ................ ancho 171 px, arranca en y = 88
     borde derecho ....... 1 px #0086A8
     fondo del riel ...... #00121F arriba -> #030B17 abajo
     item ................ alto 44 px, sin separacion entre uno y otro
     icono ............... 24 x 24, de x 16 a x 40
     etiqueta ............ arranca en x 61  (Barlow Condensed 500, 16,5 px)
     item activo ......... degradado rojo: #730114 0%, #E40629 14%,
                           #97031B 42%, #3E011B 70%, #0F0512 100%

   COMO NO ROMPE NADA
   · Los botones de grupo se MUEVEN adentro del riel, que es hijo de #vsn:
     el manejador de clics, el buscador y el repintado al cambiar de idioma
     siguen encontrando los mismos nodos.
   · El riel es position:fixed; por eso #vsn no puede llevar backdrop-filter,
     que crearia un marco de referencia y lo dejaria encerrado en la franja.
   · En telefono y tablet (≤1100 px) el riel no aparece y manda el boton de
     menu que nav.js ya traia.

   APAGARLO:  localStorage.setItem('vs_lateral','off')  y recargar
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  try{ if(localStorage.getItem('vs_nav') === 'off') return; }catch(e){}
  try{ if(localStorage.getItem('vs_lateral') === 'off') return; }catch(e){}
  if(window.__VS_LATERAL) return; window.__VS_LATERAL = true;

  var CSS = ''
  + ':root{ --vsl-w:171px; }'
  + 'html:not([data-vs="off"]):root, :root{ --vsn-h:88px; }'
  + 'body{ padding-left:var(--vsl-w) !important; }'

  /* ── la franja de arriba: de borde a borde, con la foto ──────────────── */
  + '#vsn#vsn{ left:0 !important; right:0 !important; height:var(--vsn-h) !important;'
  + '  padding:0 20px !important; border-bottom:0 !important;'
  + '  backdrop-filter:none !important; -webkit-backdrop-filter:none !important;'
  /*  EL FONDO DE LA FRANJA
      En vez de aproximarlo con degradados, sale de la propia referencia:
      vs_franja.jpg es el tramo de red que va entre el subtitulo del club y
      los botones de idioma —430 px sin un solo texto encima—, espejado
      hasta cubrir el ancho. Asi el color, el brillo y el dibujo de la red
      son exactamente los de la maqueta, no una imitacion.                */
  + '  background:'
  /*  La maqueta NO lleva ninguna linea roja debajo de la franja: solo un
      tramo corto a la altura del escudo. La que habia cruzaba los 1536 px. */
  + '   linear-gradient(90deg,rgba(255,23,68,.85) 0%,rgba(249,6,86,.55) 60%,rgba(255,23,68,0) 100%)'
  + '     left bottom / 150px 2px no-repeat,'
  /*  y el lado derecho vuelve a oscurecerse: en la maqueta los botones de
      idioma y la fecha caen sobre fondo casi negro, no sobre la red roja. */
  + '   linear-gradient(90deg,rgba(0,16,24,0) 40%,rgba(0,16,24,.45) 50%,'
  + '     rgba(0,14,22,.86) 60%,rgba(0,12,20,.96) 72%,rgba(0,12,20,.97) 100%),'
  + '   linear-gradient(90deg,#001018 0%,rgba(0,16,24,.98) 20%,rgba(0,18,28,.74) 30%,'
  + '     rgba(0,20,34,.30) 38%,rgba(0,20,34,.06) 46%,rgba(0,20,34,0) 54%),'
  + '   url(\'vs_franja.jpg\') right center / auto 100% no-repeat,'
  + '   #001525 !important;'
  + '  box-shadow:0 14px 38px -26px #000 !important; }'

  /* ── la marca de la franja, medida sobre la maqueta ───────────────────
       escudo .... anillo de 71 px, centro en x 69
       titulo .... altura de mayusculas 34 px, ancho 321 px
       bajada .... 19 px de alto, x 183..517                             */
  + '#vsn#vsn .marca{ gap:0 !important; padding:0 !important; margin:0 !important;'
  + '  border-right:0 !important; align-items:center !important; }'
  + '#vsn#vsn .marca img{ width:62px !important; height:62px !important;'
  + '  border-radius:50% !important; padding:3px !important;'
  + '  border:2px solid rgba(255,23,68,.92) !important;'
  + '  box-shadow:0 0 24px -4px rgba(255,23,68,.8) !important;'
  + '  margin:0 48px 0 14px !important; object-fit:contain !important; }'
  + '#vsn#vsn .marca b{ font:700 37px/1 var(--vsTit) !important;'
  + '  letter-spacing:.105em !important; color:#FFFFFF !important;'
  + '  text-transform:uppercase !important; display:block !important; }'
  + '#vsn#vsn .marca b em{ font-style:normal !important; color:var(--red) !important; }'
  /*  los controles van pegados a la derecha, como en la maqueta: antes
      quedaban amontonados junto al nombre del club.                      */
  + '#vsn#vsn .marca{ margin-right:auto !important; padding-top:10px !important; }'
  + '#vsn#vsn .vs-ctls{ margin-left:auto !important; gap:11px !important; }'
  /* ── los controles de la derecha, medidos sobre la maqueta ───────────
       idiomas ....... tres botones de 36x35, letra de 17 px
       sistema ....... pastilla de 110x35, letra de 16 px
       fecha ......... 15 px                                            */
  + '#vsn#vsn .vs-ctls > .vs-ctl{ height:35px !important; }'
  + '#vsn#vsn #lang-wrap{ gap:0 !important; height:35px !important; }'
  + '#vsn#vsn #lang-wrap button{ min-width:36px !important; height:35px !important;'
  + '  padding:0 9px !important; font:600 17px/1 var(--vsTit) !important;'
  + '  letter-spacing:.06em !important; border-radius:0 !important; }'
  + '#vsn#vsn #lang-wrap button:first-child{ border-radius:8px 0 0 8px !important; }'
  + '#vsn#vsn #lang-wrap button:last-child{ border-radius:0 8px 8px 0 !important; }'
  + '#vsn#vsn .live-badge{ height:35px !important; padding:0 15px !important;'
  + '  border-radius:9px !important; gap:9px !important;'
  + '  font:600 16px/1 var(--vsTit) !important; letter-spacing:.055em !important; }'
  + '#vsn#vsn .live-badge .live-dot{ width:9px !important; height:9px !important; }'
  + '#vsn#vsn #fecha-txt{ font:400 15px/1 var(--vsUI) !important;'
  + '  letter-spacing:.012em !important; color:#C9DCE8 !important; }'
  + '#vsn#vsn .vs-ctls select.vs-ctl,'
  + '#vsn#vsn .vs-ctls a.vs-ctl{ height:35px !important; border-radius:9px !important;'
  + '  font:500 14.5px/1 var(--vsUI) !important; }'
  + '#vsn#vsn .vs-ctls .vs-ava{ width:38px !important; height:38px !important; }'
  + '#vsn#vsn .der{ margin-left:0 !important; }'
  + '#vsn#vsn .marca .vs-msub{ display:block !important; font-style:normal !important;'
  + '  font:500 16px/1 var(--vsUI) !important; letter-spacing:.225em !important;'
  + '  text-transform:uppercase !important; color:var(--cyan) !important;'
  + '  margin-top:7px !important; }'

  /* ── el riel, debajo de la franja ────────────────────────────────────── */
  + '#vsn#vsn .vsl{ position:fixed; left:0; top:var(--vsn-h); bottom:0;'
  + '  width:var(--vsl-w); z-index:2147482520; display:flex; flex-direction:column;'
  + '  overflow:hidden;'
  /*  EL FONDO DEL RIEL
      Medido sobre la maqueta, columna x 115..165: el riel NO es
      transparente. Tiene su propio azul verdoso —(0,15,26) abajo y
      (0,32,46) en el tercio de arriba, donde hay un resplandor— y por eso
      se despega del cuerpo. Dejandolo transparente se veia el fondo casi
      negro de la pagina, (0,4,6), y quedaba apagado.                     */
  + '  background:'
  /*  y el haz rojo que en la maqueta cruza el riel por abajo, de la
      esquina de abajo a la izquierda hacia arriba a la derecha        */
  + '   linear-gradient(137deg, rgba(0,0,0,0) 61.5%, rgba(255,23,68,.13) 63.8%,'
  + '     rgba(255,86,124,.80) 65.2%, rgba(255,23,68,.13) 66.6%, rgba(0,0,0,0) 69%),'
  + '   radial-gradient(135% 40% at 52% 22%, rgba(0,205,245,.20), rgba(0,0,0,0) 74%),'
  + '   radial-gradient(110% 26% at 50% 100%, rgba(0,160,210,.06), rgba(0,0,0,0) 72%),'
  + '   linear-gradient(180deg,#001320 0%,#00121E 48%,#000D18 100%);'
  + '  border-right:1px solid #0086A8; }'
  + '#vsn#vsn .vsl *{ box-sizing:border-box; }'
  + '#vsn#vsn .vsl .grupos{ display:flex !important; flex-direction:column !important;'
  + '  align-items:stretch !important; gap:0 !important; flex:1 1 auto; min-height:0;'
  + '  overflow-x:hidden !important; overflow-y:auto !important; padding:9px 0 0 !important; }'
  + '#vsn#vsn .vsl .g{ display:flex !important; align-items:center !important;'
  + '  justify-content:flex-start !important; gap:21px !important;'
  + '  height:45px !important; min-height:45px !important; padding:0 0 0 16px !important;'
  + '  border-radius:0 !important; white-space:normal !important; text-align:left;'
  + '  font:500 17px/1.1 var(--vsUI,\'Barlow Condensed\',sans-serif) !important;'
  + '  letter-spacing:.005em !important; color:#00D9F5 !important;'
  + '  background:none !important; box-shadow:none !important; position:relative;'
  + '  transition:background .15s ease,color .15s ease; }'
  /*  lang.js envuelve cada etiqueta en un <span> propio, y ese span recibia
      su tipografia de otra regla: heredar la del boton es lo unico que hace
      que el tamaño y la fuente del riel sean los que se piden aca.        */
  + '#vsn#vsn .vsl .g span, #vsn#vsn .vsl .g b, #vsn#vsn .vsl .g i{'
  + '  font:inherit !important; color:inherit !important;'
  + '  letter-spacing:inherit !important; text-transform:none !important; }'
  /*  El dibujo de cada icono no llena su caja: con 24 px de caja el trazo
      mide 17 de alto, y en la maqueta mide 25. La caja se deja en 24 —asi el
      centrado y el hueco hasta la etiqueta no se mueven— y se agranda el
      DIBUJO, que ademas engrosa el trazo igual que en la referencia.      */
  + '#vsn#vsn .vsl .g svg{ width:24px !important; height:24px !important; flex:0 0 auto;'
  + '  color:#FFFFFF !important; stroke-width:1.9 !important; opacity:1 !important;'
  + '  transform:scale(1.38); }'
  + '#vsn#vsn .vsl .g:hover{ background:rgba(0,217,245,.07) !important; color:#FFFFFF !important; }'
  + '#vsn#vsn .vsl .g.aqui, #vsn#vsn .vsl .g.on{ color:#FFFFFF !important;'
  + '  box-shadow:none !important;'
  + '  background:linear-gradient(90deg,#730114 0%,#E40629 14%,#97031B 42%,'
  + '    #3E011B 70%,#0F0512 100%) !important; }'
  + '#vsn#vsn .vsl .g.aqui svg, #vsn#vsn .vsl .g.on svg{ color:#FFFFFF !important; }'
  + '#vsn#vsn .vsl .g.aqui::after{ content:\'\' !important; position:absolute !important;'
  + '  left:0 !important; top:0 !important; bottom:0 !important; right:auto !important;'
  + '  width:3px !important; height:auto !important; transform:none !important;'
  + '  border-radius:0 !important; background:#FF4D6D !important; }'

  /* ── el pie ──────────────────────────────────────────────────────────── */
  /* ── el pie, medido sobre la maqueta (ventana de 1024 px de alto) ─────
       frase ..... CIAN, dos renglones, x 19..145, y 808..835
       raya ...... roja, 3 px, x 11..147, y 845..847
       escudo .... circulo de 85 px, x 34..117, y 862..947
       hueco de abajo ... 77 px                                           */
  + '#vsn#vsn .vsl .vsl-pie{ flex:0 0 auto; padding:0 11px 77px; }'
  + '#vsn#vsn .vsl .vsl-lema{ margin:0 0 2px 8px; max-width:136px;'
  + '  font:600 15px/17px var(--vsTit,\'Barlow Condensed\',sans-serif);'
  + '  letter-spacing:.04em; text-transform:uppercase; color:#00D5F0; }'
  + '#vsn#vsn .vsl .vsl-raya{ height:3px; width:137px; margin:0 0 15px; border-radius:2px;'
  + '  background:linear-gradient(90deg,#F6091E 0%,#FF374D 55%,#EB0621 100%);'
  + '  box-shadow:0 0 12px -2px rgba(255,23,68,.8); }'
  + '#vsn#vsn .vsl .vsl-pie a{ display:block; margin:0 0 0 23px; padding:0;'
  + '  width:85px; height:85px; border-radius:50%; line-height:0;'
  + '  border:2px solid #FF1744;'
  + '  box-shadow:0 0 28px -2px rgba(255,23,68,.75), inset 0 0 18px -6px rgba(255,23,68,.6); }'
  + '#vsn#vsn .vsl .vsl-pie img{ width:100%; height:100%; border-radius:50%;'
  + '  object-fit:contain; }'

  /* ── lo que estaba fijo contra el borde izquierdo ─────────────────────── */
  /*  el escudo flotante de abajo a la izquierda repetia el del pie del
      riel, y la flecha de volver repetia "Inicio" del menu: en la maqueta
      no estan ninguno de los dos.                                        */
  /*  EL ESCUDO PARA VOLVER AL MENU
      Estaba escondido junto con el escudo repetido de lang.js, y con el se
      fue el unico camino de vuelta al inicio que tienen 30 pantallas. No se
      esconde: se corre a la derecha del riel, que es lo que lo tapaba. En la
      portada si sobra —el riel ya tiene el escudo y el boton llevaria a la
      misma pagina—, asi que ahi y solo ahi se oculta.                    */
  + '#vb-volver, #vb-atras, #club-escudo{'
  + '  left:calc(var(--vsl-w) + 14px) !important; z-index:9998 !important; }'
  + 'body.ix-p #vb-volver, body.ix-p #vb-atras, body.ix-p #club-escudo{'
  + '  display:none !important; }'
  + '.savebar{ left:var(--vsl-w) !important; }'
  + '#vsn-panel{ left:var(--vsl-w) !important; }'
  + '#vsn-busca{ left:calc(50% + var(--vsl-w) / 2) !important; }'

  /*  LAS VENTANAS DE PANTALLA COMPLETA DE LOS DOS PANELES
      Son overlays fijos con inset:0, pensados para tapar TODA la pantalla,
      de cuando la barra de arriba no existia. Con la barra nueva -que va
      muy por encima en z-index- el overlay les quedaba por debajo y la
      primera franja se cortaba: en panel vivo, la fila "+ Nuevo partido /
      Abrir .dvw / Sumar al historial" quedaba escondida atras del titulo.
      Se les devuelve la capa que siempre esperaron: arriba de todo. Asi
      vuelven a verse enteras, que es como estaban hechas.
      La ventanita flotante del video (.vdock) y la suelta no se tocan.    */
  + 'body.vsp-vivo .modal:not(.vdock):not(.suelto),'
  + 'body.vsp-vivo .podio-overlay, body.vsp-vivo .cancha-modal,'
  + 'body.vsp-vivo #an-overlay{ z-index:2147482900 !important; }'

  + '@media (max-width:1100px){ :root{ --vsl-w:0px; } #vsn#vsn .vsl{ display:none; } }'
  + '@media print{ #vsn#vsn .vsl{ display:none !important; } body{ padding-left:0 !important; } }';

  function estilo(){
    if(document.getElementById('vsl-css')) return;
    var s = document.createElement('style');
    s.id = 'vsl-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /*  ESTABAN DOS VECES: LA CHAPA Y LA FECHA
      vs_cab.js arma el grupo de la derecha (.vs-ctls) con idiomas, "Sistema
      activo", fecha, categoria, temporadas y usuario, en ese orden —que es
      el de los modelos—. La piel habia sumado su propia chapa y su propia
      fecha por delante, y la original quedaba escondida.                   */
  function unaSola(){
    var bar = document.getElementById('vsn'); if(!bar) return;
    var ctls = bar.querySelector('.vs-ctls');
    if(!ctls) return;
    ['#vs-p-vivo', '.vs-p-fecha'].forEach(function(sel){
      var e = bar.querySelector(sel);
      if(e && !ctls.contains(e)) e.style.display = 'none';
    });
    var f = ctls.querySelector('#fecha-txt, .fecha-txt');
    if(f) f.style.setProperty('display', 'flex', 'important');
  }

  /*  EL IDIOMA ACTIVO NO SE MARCABA
      Los tres botones ES/EN/DE salen sin clase ni aria, asi que la regla que
      los pinta en rojo no encontraba a ninguno y los tres se veian iguales.
      En la maqueta el que esta puesto va con el rojo macizo.              */
  function idiomaActivo(){
    var w = document.getElementById('lang-wrap'); if(!w) return;
    var l = 'es';
    try{ l = (window.getLang && window.getLang()) || localStorage.getItem('vb_lang') || 'es'; }catch(e){}
    l = String(l).slice(0,2).toLowerCase();
    [].forEach.call(w.children, function(b){
      var t = (b.textContent || '').trim().toLowerCase();
      b.classList.toggle('on', t === l);
    });
  }

  function armar(){
    var bar = document.getElementById('vsn');
    if(!bar) return false;
    if(bar.querySelector('.vsl')) return true;
    var grupos = bar.querySelector('.grupos');
    if(!grupos) return false;

    var riel = document.createElement('aside');
    riel.className = 'vsl';

    var pie = document.createElement('div');
    pie.className = 'vsl-pie';
    pie.innerHTML = '<div class="vsl-lema" data-t="Más análisis. Mejores decisiones.">'
                  + 'Más análisis. Mejores decisiones.</div>'
                  + '<div class="vsl-raya"></div>'
                  + '<a href="index.html" title="Inicio">'
                  + '<img src="escudo.png" alt="" onerror="this.style.display=\'none\'"></a>';

    /*  se MUEVE, no se copia: siguen siendo los mismos nodos de nav.js  */
    riel.appendChild(grupos);
    riel.appendChild(pie);
    bar.appendChild(riel);
    return true;
  }

  /*  las dos pantallas del partido: se marcan para que sus ventanas de
      pantalla completa queden por encima de la barra (ver el CSS)       */
  function marcarPagina(){
    try{
      var f = (location.pathname.split('/').pop() || '').toLowerCase();
      if(f === 'panel_vivo.html' || f === 'panel_voley.html')
        document.body.classList.add('vsp-vivo');
    }catch(e){}
  }

  /*  LAS VENTANAS DE PANTALLA COMPLETA, POR ENCIMA DE LA BARRA
      Los dos paneles del partido tienen DECENAS de capas de pantalla
      completa —el inicio, el armado, los planteles, las baterias, el
      video, la tabla, el podio, la cancha— y cada una con su z-index
      propio, de cuando la barra de arriba no existia. Enumerarlas una por
      una era garantia de olvidarse alguna justo el dia del partido.

      Asi que no se enumeran: se reconocen. Una capa de pantalla completa
      es la que esta fija y pegada a los cuatro bordes. A esas, y solo a
      esas, se les sube la capa. Se mide el estilo calculado y no el
      tamanio en pantalla, porque mientras estan cerradas no miden nada.

      Quedan afuera las de la barra misma (empiezan con vs) y los fondos,
      que van a proposito por debajo de todo.                            */
  var CAPA_ALTA = '2147482900';
  function subirCapas(){
    if(!document.body || !document.body.classList.contains('vsp-vivo')) return;
    var bar = document.getElementById('vsn');
    var zBar = 0;
    try{ zBar = parseInt(getComputedStyle(bar).zIndex, 10) || 0; }catch(e){}
    if(!zBar) return;
    [].forEach.call(document.querySelectorAll('body *'), function(e){
      if(e.dataset.vsz === '1') return;
      if(bar && (e === bar || bar.contains(e))) return;
      var id = e.id || '';
      if(id.indexOf('vs') === 0) return;
      if(e.classList && (e.classList.contains('vdock') || e.classList.contains('suelto'))) return;
      var cs;
      try{ cs = getComputedStyle(e); }catch(err){ return; }
      if(cs.position !== 'fixed') return;
      if(cs.top !== '0px' || cs.left !== '0px' || cs.right !== '0px' || cs.bottom !== '0px') return;
      var z = cs.zIndex === 'auto' ? 0 : (parseInt(cs.zIndex, 10) || 0);
      if(z < 1 || z >= zBar) return;      /* los fondos (z negativo) no se tocan */
      e.dataset.vsz = '1';
      e.style.zIndex = CAPA_ALTA;
    });
  }

  function arrancar(){
    estilo();
    marcarPagina();
    [0, 500, 1500, 3200, 6000].forEach(function(ms){
      setTimeout(function(){ try{ subirCapas(); }catch(e){} }, ms);
    });
    [0, 400, 1200, 2600].forEach(function(ms){
      setTimeout(function(){ try{ unaSola(); idiomaActivo(); }catch(e){} }, ms);
    });
    if(armar()) return;
    var i = 0, t = setInterval(function(){
      if(armar() || ++i > 80) clearInterval(t);
    }, 60);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
/*[/vsl]*/
