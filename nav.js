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
  if(window.__VS_NAV) return; window.__VS_NAV = true;

  var D = {"antena":"<circle cx=\"12\" cy=\"12\" r=\"2.2\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 15.8a5.4 5.4 0 0 0 0-7.6\"/><path d=\"M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 18.6a9.4 9.4 0 0 0 0-13.2\"/>","archivo":"<path d=\"M13.6 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.6l-5.4-5.4Z\"/><path d=\"M13.4 3.4v5.2h5.3\"/>","armado":"<circle cx=\"12\" cy=\"6.6\" r=\"3.4\"/><path d=\"m5.4 20.4 3.4-5.2M18.6 20.4l-3.4-5.2\"/><path d=\"m8.8 15.2 3.2-2 3.2 2\"/>","balanza":"<path d=\"M12 4.2v15.4\"/><path d=\"M8.2 19.6h7.6\"/><path d=\"M4.4 7.6h15.2\"/><path d=\"m4.4 7.6-2.2 5.2a2.6 2.6 0 0 0 4.4 0L4.4 7.6Z\"/><path d=\"m19.6 7.6-2.2 5.2a2.6 2.6 0 0 0 4.4 0l-2.2-5.2Z\"/><circle cx=\"12\" cy=\"5.2\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>","barras":"<path d=\"M4 20h16\"/><rect x=\"5.5\" y=\"11\" width=\"3.4\" height=\"6\"/><rect x=\"10.3\" y=\"7\" width=\"3.4\" height=\"10\"/><rect x=\"15.1\" y=\"13.5\" width=\"3.4\" height=\"3.5\"/>","calendario":"<rect x=\"4\" y=\"5.5\" width=\"16\" height=\"14.5\" rx=\"2\"/><path d=\"M4 10h16\"/><path d=\"M8.5 3.4v3.6M15.5 3.4v3.6\"/>","calendario_dias":"<rect x=\"4\" y=\"5.5\" width=\"16\" height=\"14.5\" rx=\"2\"/><path d=\"M4 10h16\"/><path d=\"M8.5 3.4v3.6M15.5 3.4v3.6\"/><path d=\"M8 13.4h.01M12 13.4h.01M16 13.4h.01M8 16.8h.01M12 16.8h.01\"/>","camara_video":"<rect x=\"3\" y=\"7\" width=\"12.5\" height=\"10\" rx=\"2\"/><path d=\"m15.5 11 5-2.8v7.6l-5-2.8V11Z\"/>","candado":"<rect x=\"4.6\" y=\"10.4\" width=\"14.8\" height=\"10.2\" rx=\"2\"/><path d=\"M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8\"/><circle cx=\"12\" cy=\"15.4\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>","carpeta":"<path d=\"M3.4 18.2V6.4a1.6 1.6 0 0 1 1.6-1.6h4l2 2.4h7.6a1.6 1.6 0 0 1 1.6 1.6v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z\"/>","casa":"<path d=\"m3.4 10.4 8.6-7 8.6 7\"/><path d=\"M5.6 9v10.6a1.4 1.4 0 0 0 1.4 1.4h10a1.4 1.4 0 0 0 1.4-1.4V9\"/><path d=\"M9.8 21v-6.4h4.4V21\"/>","claqueta":"<rect x=\"3.2\" y=\"7.5\" width=\"17.6\" height=\"12.5\" rx=\"2\"/><path d=\"m3.6 11.4 17-1.5\"/><path d=\"M4.2 7.6 8 4.4l3 3.2M11 7.3 14.8 4l3 3.2\"/>","cronometro":"<circle cx=\"12\" cy=\"13.4\" r=\"7.8\"/><path d=\"M12 9.4v4h3\"/><path d=\"M9.4 2.6h5.2\"/><path d=\"m18.8 6.6 1.6-1.6\"/>","diana":"<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.8\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>","enlace":"<path d=\"M9.8 14.2a3.8 3.8 0 0 1 0-5.4l3-3a3.8 3.8 0 0 1 5.4 5.4l-1.4 1.4\"/><path d=\"M14.2 9.8a3.8 3.8 0 0 1 0 5.4l-3 3a3.8 3.8 0 0 1-5.4-5.4l1.4-1.4\"/>","escudo":"<path d=\"M12 3.2 5 6v5.6c0 4.2 2.8 7.5 7 9.2 4.2-1.7 7-5 7-9.2V6l-7-2.8Z\"/>","estetoscopio":"<path d=\"M6 3.2v4.4a4 4 0 0 0 8 0V3.2\"/><path d=\"M6 3.2H4.4M14 3.2h1.6\"/><path d=\"M10 11.6v2.2a4.6 4.6 0 0 0 9.2 0v-1\"/><circle cx=\"19.2\" cy=\"10.4\" r=\"2.2\"/>","guante":"<path d=\"M7.5 20.5v-4.3l-1.6-2.4a2 2 0 0 1 3-2.6l.6.6V5.3a1.6 1.6 0 1 1 3.2 0v4.1\"/><path d=\"M12.7 9.4V7.6a1.6 1.6 0 1 1 3.2 0v2.2\"/><path d=\"M15.9 9.9V9a1.6 1.6 0 1 1 3.1 0v6.3c0 2-.8 3.8-2.1 5.2\"/>","herramientas":"<path d=\"M14.2 6.4a3.8 3.8 0 0 0 5.1 5l-5.1-5Z\"/><path d=\"m13.2 7.4-9 9a2.2 2.2 0 0 0 3.1 3.1l9-9\"/><path d=\"m5.4 5.2 3.2-1.4 2.8 2.8-1.2 3.2-3.2 1.2L4.2 8.2l1.2-3Z\"/>","impacto":"<path d=\"m12 2.6 2.2 4.9 5-1.3-2.1 4.8 4.1 3.2-5 1.4.6 5.2-4.4-2.8-4.4 2.8.6-5.2-5-1.4 4.1-3.2L5.7 6.2l5 1.3L12 2.6Z\"/>","ladrillos":"<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"4.6\" rx=\".8\"/><rect x=\"3.5\" y=\"9.6\" width=\"17\" height=\"4.6\" rx=\".8\"/><rect x=\"3.5\" y=\"14.2\" width=\"17\" height=\"4.6\" rx=\".8\"/><path d=\"M9.5 5v4.6M15 9.6v4.6M9.5 14.2v4.6\"/>","libro":"<path d=\"M4 4.6h5.4A3.2 3.2 0 0 1 12 6.2v13a2.4 2.4 0 0 0-2-1.2H4V4.6Z\"/><path d=\"M20 4.6h-5.4A3.2 3.2 0 0 0 12 6.2v13a2.4 2.4 0 0 1 2-1.2h6V4.6Z\"/>","linea":"<path d=\"M4 20V4\"/><path d=\"M4 20h16\"/><path d=\"m6.5 15.5 3.6-4.2 2.9 2.4 4.9-6\"/><circle cx=\"17.9\" cy=\"7.7\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/>","lupa":"<circle cx=\"10.8\" cy=\"10.8\" r=\"6.6\"/><path d=\"m15.6 15.6 4.6 4.6\"/>","mancuerna":"<path d=\"M3 10.2v3.6M6 8.4v7.2M18 8.4v7.2M21 10.2v3.6\"/><path d=\"M6 12h12\"/>","ojo":"<path d=\"M1.8 12s3.8-7 10.2-7 10.2 7 10.2 7-3.8 7-10.2 7S1.8 12 1.8 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3.2\"/>","pantalla":"<rect x=\"3\" y=\"4.5\" width=\"18\" height=\"12.5\" rx=\"2\"/><path d=\"M8.5 20.5h7M12 17v3.5\"/>","pelicula":"<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M7 6v12M17 6v12\"/><path d=\"M3 10h4M3 14h4M17 10h4M17 14h4\"/>","pelota":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12.4 3c-3.9 3.3-5.4 8.6-3.7 13.4\"/><path d=\"M20.8 9.6c-5 .5-9.3 3.8-11.1 8.6\"/><path d=\"M3.5 14.9c3.6-3.5 8.9-4.9 13.8-3.4\"/>","persona":"<circle cx=\"12\" cy=\"8\" r=\"3.6\"/><path d=\"M4.8 20.4c.6-3.8 3.6-6.2 7.2-6.2s6.6 2.4 7.2 6.2\"/>","personas":"<circle cx=\"9.2\" cy=\"8.2\" r=\"3.2\"/><path d=\"M2.8 20c.6-3.4 3.2-5.6 6.4-5.6s5.8 2.2 6.4 5.6\"/><path d=\"M16.2 5.4a3.2 3.2 0 0 1 0 6.2\"/><path d=\"M17.4 14.8c2.1.6 3.5 2.4 3.9 5.2\"/>","planilla":"<rect x=\"5\" y=\"4.5\" width=\"14\" height=\"16\" rx=\"2\"/><path d=\"M9 4.5a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 4.5v1H9v-1Z\"/><path d=\"M8.6 11h6.8M8.6 15h4.4\"/>","rayo":"<path d=\"M13.4 2.5 5.6 13.2h5.3l-.9 8.3 8.2-10.9h-5.4l.6-8.1Z\"/>","rotar":"<path d=\"M20.2 11.2a8.2 8.2 0 1 1-2.4-5.4\"/><path d=\"M20.4 3.6v4.8h-4.8\"/>","subir":"<path d=\"M12 20V8.4\"/><path d=\"m7.4 12.8 4.6-4.6 4.6 4.6\"/><path d=\"M4.4 4.4h15.2\"/>","tijera":"<circle cx=\"6.4\" cy=\"6.4\" r=\"2.8\"/><circle cx=\"6.4\" cy=\"17.6\" r=\"2.8\"/><path d=\"m8.4 8.4 11.2 9.2M19.6 6.4 8.4 15.6\"/>","trofeo":"<path d=\"M8 4h8v5a4 4 0 0 1-8 0V4Z\"/><path d=\"M8 5.5H5.5A2.5 2.5 0 0 0 5.9 10c.7.3 1.4.4 2.1.4\"/><path d=\"M16 5.5h2.5a2.5 2.5 0 0 1-.4 4.5c-.7.3-1.4.4-2.1.4\"/><path d=\"M12 13v3.5\"/><path d=\"M9 20h6\"/><path d=\"M10 16.5h4L15 20H9l1-3.5Z\"/>","viento":"<path d=\"M3.4 8.4h10a2.8 2.8 0 1 0-2.8-2.8\"/><path d=\"M3.4 12.6h14.2a2.8 2.8 0 1 1-2.8 2.8\"/><path d=\"M3.4 16.8h7.2\"/>"};
  var G = [{"id":"inicio","ic":"casa","n":{"es":"Inicio","en":"Home","de":"Start"},"sub":null,"href":"index.html","items":[]},{"id":"partido","ic":"diana","n":{"es":"Partido","en":"Match","de":"Spiel"},"sub":{"es":"Preparar el proximo","en":"Prepare the next one","de":"Das naechste vorbereiten"},"href":null,"items":[["game_plan.html","Game Plan","Game Plan","Game Plan","diana"],["scouting_rival.html","Scouting del rival","Opponent scouting","Gegner-Scouting","lupa"],["rotaciones.html","Rotaciones","Rotations","Rotationen","rotar"],["comparador.html","Comparador","Comparator","Vergleich","balanza"],["plan_partido.html","Accion por accion","Action by action","Aktion fuer Aktion","planilla"],["Team_Playbook_Nafels.html","Playbook","Playbook","Playbook","libro"],["p2.html","Planilla P-2","P-2 sheet","P-2 Formular","archivo"]]},{"id":"rendimiento","ic":"barras","n":{"es":"Rendimiento","en":"Performance","de":"Leistung"},"sub":{"es":"Los numeros","en":"The numbers","de":"Die Zahlen"},"href":null,"items":[["analisis.html","Analisis del partido","Match analysis","Spielanalyse","barras"],["dashboard.html","Dashboard","Dashboard","Dashboard","linea"],["informe_equipo.html","Informe de equipo","Team report","Teambericht","archivo"],["hm_saque.html","Mapa de saque","Serve map","Aufschlagkarte","rayo"],["hm_recepcion.html","Mapa de recepcion","Reception map","Annahmekarte","escudo"],["hm_ataque.html","Mapa de ataque","Attack map","Angriffskarte","impacto"],["hm_bloqueo.html","Mapa de bloqueo","Block map","Blockkarte","ladrillos"],["hm_defensa.html","Mapa de defensa","Defence map","Abwehrkarte","guante"],["hm_armador.html","Mapa de armado","Setting map","Zuspielkarte","armado"],["armadores.html","Armadores","Setters","Zuspieler","armado"],["high_set.html","High Set","High Set","High Set","pelota"],["nla_stats_table.html","Tabla de la liga","League table","Liga-Tabelle","trofeo"],["historial_voley.html","Historial","History","Verlauf","cronometro"]]},{"id":"plantel","ic":"personas","n":{"es":"Plantel","en":"Squad","de":"Kader"},"sub":{"es":"Jugador por jugador","en":"Player by player","de":"Spieler fuer Spieler"},"href":null,"items":[["equipo.html","Equipo","Team","Team","personas"],["jugador.html","Ficha del jugador","Player profile","Spielerprofil","persona"],["plan_desarrollo.html","Plan de desarrollo","Development plan","Entwicklungsplan","subir"],["objetivos_equipo.html","Objetivos del plantel","Squad objectives","Teamziele","diana"]]},{"id":"video","ic":"claqueta","n":{"es":"Video","en":"Video","de":"Video"},"sub":{"es":"Clips y partidos","en":"Clips and matches","de":"Clips und Spiele"},"href":null,"items":[["cortes.html","Cortes de video","Video clips","Videoclips","tijera"],["sintesis.html","Sintesis del partido","Match synthesis","Spielzusammenfassung","pelicula"],["importar_video.html","Cargar videos","Upload videos","Videos hochladen","subir"],["unir_video.html","Unir videos","Merge videos","Videos zusammenfuegen","enlace"],["pizarron.html","Pizarron (TV)","Whiteboard (TV)","Tafel (TV)","pantalla"]]},{"id":"vivo","ic":"antena","n":{"es":"En vivo","en":"Live","de":"Live"},"sub":{"es":"Durante el partido","en":"During the match","de":"Waehrend des Spiels"},"href":null,"items":[["panel_vivo.html","Scout en vivo","Live scout","Live-Scout","diana"],["panel_voley.html","Panel en vivo","Live panel","Live-Panel","antena"],["velocidades_vivo.html","Velocidades","Serve speeds","Aufschlagtempo","viento"],["camara.html","Camara del partido","Match camera","Spielkamera","camara_video"]]},{"id":"dia","ic":"calendario","n":{"es":"Dia a dia","en":"Day to day","de":"Alltag"},"sub":{"es":"Agenda y fisico","en":"Schedule and fitness","de":"Termine und Fitness"},"href":null,"items":[["calendario.html","Calendario","Calendar","Kalender","calendario"],["horarios.html","Horarios","Schedule","Zeitplan","cronometro"],["prep_fisica.html","Preparacion fisica","Physical prep","Athletik","mancuerna"],["wellness.html","Wellness","Wellness","Wellness","estetoscopio"],["baggerone.html","Baggerone","Baggerone","Baggerone","trofeo"]]},{"id":"dt","ic":"herramientas","n":{"es":"Entrenador","en":"Coach","de":"Trainer"},"sub":{"es":"Cargar y administrar","en":"Load and manage","de":"Laden und verwalten"},"href":null,"items":[["subir_partido.html","Subir partido","Upload match","Spiel hochladen","subir"],["importar_dvw.html","Importar DVW","Import DVW","DVW importieren","carpeta"],["asociar_codigos.html","Asociar codigos","Link codes","Codes zuordnen","enlace"],["alta_jugadores.html","Alta de jugadores","Add players","Spieler anlegen","personas"],["sesiones.html","Sesiones y equipos","Sessions and devices","Sitzungen und Geraete","candado"],["actividad.html","Quien entra y que mira","Who logs in","Wer sich anmeldet","ojo"],["temporadas.html","Temporadas","Seasons","Saisons","calendario_dias"]]}];

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
