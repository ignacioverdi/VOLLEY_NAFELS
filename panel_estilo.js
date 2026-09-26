/* ════════════════════════════════════════════════════════════════════════════
   panel_estilo.js — el rediseño del Panel en Vivo
   ----------------------------------------------------------------------------
   Va en su propio archivo A PROPOSITO, igual que analisis_vivo.js: solo lee,
   reacomoda y pinta. Si este archivo no carga, el panel queda exactamente
   como estaba. No hay una sola linea de panel_vivo.html que dependa de el.

   QUE CAMBIA, Y POR QUE

   1. LA BARRA DE ARRIBA. Habia 19 botones iguales: "Analisis", que se toca
      cada set, pesaba lo mismo que "Como se usa", que se toca una vez en la
      vida. Ahora quedan afuera el marcador y tres cosas; el resto se agrupa
      en un menu POR CUANDO SE USA: antes del partido, mientras scouteas,
      despues. Los botones no se recrean: se MUEVEN, con su onclick puesto,
      asi que siguen haciendo exactamente lo mismo.

   2. EL MARCADOR. Estaba en su propia franja, alto y con poca informacion.
      Ahora entra en la misma barra: se mira de reojo y no se come una franja
      entera de pantalla.

   3. LAS ROTACIONES. Eran cuadraditos con un punto. Ahora se leen: la red
      dibujada arriba, la fila de red mas clara que el fondo, el armador
      marcado y el numero grande.

   4. COMO VENIMOS. El panel tenia media pantalla vacia y habia que abrir el
      analisis para saber como venia el partido. Ahora hay un cuadro fijo con
      side-out, break point, eficacia de ataque y quien esta cerrando los
      puntos, que se actualiza solo mientras scouteas. Los numeros salen de
      anRallies(), la MISMA fuente que usa la ventana de analisis, asi que no
      pueden decir cosas distintas.

   Los colores salieron de un validador de daltonismo y contraste: los dos
   equipos se distinguen con delta-E 23 (con 8 ya alcanza). Donde hay verde y
   rojo —que es el par mas dificil— el numero va SIEMPRE al lado, nunca el
   color solo.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── los tres momentos del partido ────────────────────────────────────
     La clasificacion es por la funcion que llama el boton, no por su texto:
     el texto cambia con el idioma, la funcion no. */
  var MOMENTOS = {
    antes: ['openSetup', 'abrirEquipos', 'abrirCombos', 'toggleObj', 'abrirPlanPreparado',
            'openConfig', 'abrirAyuda'],
    vivo:  ['abrirAnalisis', 'closeSet', 'flotReset', 'nuevoSetAmistoso'],
    luego: ['abrirExportMode', 'abrirVideo', 'abrirVideoVivo', 'traerSesion', 'abrirPartidos',
            'abrirPlan']
  };
  /* lo que queda afuera del menu, a mano */
  var AFUERA = ['abrirAnalisis', 'closeSet'];

  var TXT = {
    es: { antes:'ANTES DEL PARTIDO', vivo:'MIENTRAS SCOUTEÁS', luego:'DESPUÉS',
          antesD:'Se toca una vez y no se vuelve', vivoD:'Análisis y Cerrar set están afuera, a mano',
          luegoD:'Cuando terminó el partido', mas:'Más', menu:'Todo lo demás',
          venimos:'CÓMO VENIMOS', cierran:'QUIÉN ESTÁ CERRANDO',
          so:'SIDE-OUT', bp:'BREAK POINT', ef:'EFICACIA DE ATAQUE',
          de:'de', nada:'Todavía no hay puntos cargados.',
          leyenda:'Verde: puntos que hizo. Roja: puntos que regaló. El número es el saldo.',
          rotTit:'ROTACIONES EN CANCHA', nosotros:'LOCAL', ellos:'VISITANTE',
          red:'RED', saca:'saca',
          atajos:'ATAJOS AL ANÁLISIS',
          atArmT:'Reparto del armador', atArmS:'con recepción # o +',
          atSoT:'Side out por la {z}', atSoS:'el saque entró por esa columna',
          atDirT:'Direcciones de ataque', atDirS:'por dónde pasa la pelota',
          notaAtajos:'Cada atajo deja los filtros puestos y abre el análisis donde corresponde. Las columnas son las tres calles de la cancha: la 1 son las zonas 1, 9 y 2; la 6 son la 6, la 8 y la 3; la 5 son la 5, la 7 y la 4.',
          masAcc:'Más' },
    en: { antes:'BEFORE THE MATCH', vivo:'WHILE YOU SCOUT', luego:'AFTERWARDS',
          antesD:'Touched once and never again', vivoD:'Analysis and Close set are outside, at hand',
          luegoD:'When the match is over', mas:'More', menu:'Everything else',
          venimos:'HOW WE ARE DOING', cierran:'WHO IS CLOSING',
          so:'SIDE-OUT', bp:'BREAK POINT', ef:'ATTACK EFFICIENCY',
          de:'of', nada:'No points loaded yet.',
          leyenda:'Green: points won. Red: points given away. The number is the balance.',
          rotTit:'ROTATIONS ON COURT', nosotros:'HOME', ellos:'AWAY',
          red:'NET', saca:'serving',
          atajos:'ANALYSIS SHORTCUTS',
          atArmT:'Setter distribution', atArmS:'on reception # or +',
          atSoT:'Side out down the {z}', atSoS:'the serve came into that column',
          atDirT:'Attack directions', atDirS:'where the ball goes',
          notaAtajos:'Each shortcut sets the filters and opens the analysis on the right screen. The columns are the three lanes of the court: the 1 is zones 1, 9 and 2; the 6 is 6, 8 and 3; the 5 is 5, 7 and 4.',
          masAcc:'More' },
    de: { antes:'VOR DEM SPIEL', vivo:'WÄHREND DU SCOUTEST', luego:'DANACH',
          antesD:'Einmal angetippt, nie wieder', vivoD:'Analyse und Satz schliessen sind draussen, griffbereit',
          luegoD:'Wenn das Spiel vorbei ist', mas:'Mehr', menu:'Alles andere',
          venimos:'WIE WIR STEHEN', cierran:'WER PUNKTET',
          so:'SIDE-OUT', bp:'BREAK POINT', ef:'ANGRIFFSEFFIZIENZ',
          de:'von', nada:'Noch keine Punkte geladen.',
          leyenda:'Grün: erzielte Punkte. Rot: verschenkte Punkte. Die Zahl ist die Bilanz.',
          rotTit:'ROTATIONEN AUF DEM FELD', nosotros:'HEIM', ellos:'GAST',
          red:'NETZ', saca:'Aufschlag',
          atajos:'SCHNELLZUGRIFF',
          atArmT:'Zuspielverteilung', atArmS:'bei Annahme # oder +',
          atSoT:'Side out über die {z}', atSoS:'der Aufschlag kam in diese Spalte',
          atDirT:'Angriffsrichtungen', atDirS:'wo der Ball durchgeht',
          notaAtajos:'Jeder Schnellzugriff setzt die Filter und öffnet die Analyse auf dem passenden Bildschirm. Die Spalten sind die drei Bahnen des Feldes: die 1 sind die Zonen 1, 9 und 2; die 6 sind 6, 8 und 3; die 5 sind 5, 7 und 4.',
          masAcc:'Mehr' }
  };
  function L() {
    var l = 'es';
    try { if (typeof getLang === 'function') l = getLang(); } catch (e) {}
    return TXT[l] || TXT.es;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c];
    });
  }

  /* ══ 1 · LA HOJA DE ESTILO ═══════════════════════════════════════════ */
  function estilo() {
    if (document.getElementById('pe-css')) return;
    var s = document.createElement('style');
    s.id = 'pe-css';
    s.textContent = [
      /* la barra: una sola franja, con el marcador adentro */
      '.top{height:58px;padding:0 14px;gap:12px;align-items:center;background:#0E1120;',
      '  border-bottom:1px solid rgba(255,255,255,.07)}',
      '.top h1{font-size:0;width:0;overflow:hidden;margin:0;padding:0}',
      '.pe-vivo{display:flex;align-items:center;gap:8px;flex-shrink:0}',
      '.pe-vivo i{width:6px;height:6px;border-radius:50%;background:#E8192C;display:block;',
      '  animation:pe-lat 2.4s ease-in-out infinite}',
      '@keyframes pe-lat{0%,100%{opacity:1}50%{opacity:.35}}',
      '.pe-vivo b{font-family:"Barlow Condensed",sans-serif;font-size:11px;font-weight:800;',
      '  letter-spacing:2.5px;color:#E8192C}',
      '.pe-sep{width:1px;height:24px;background:rgba(255,255,255,.09);flex-shrink:0}',

      /* el marcador, metido en la barra */
      '.board{background:none;border:none;padding:0;margin:0;gap:14px;flex-grow:1;',
      '  justify-content:center;min-width:0}',
      '.board .tside{background:none;border:none;padding:0;gap:10px;flex:0 1 auto;min-width:0}',
      '.board .tname{font-family:"Barlow Condensed",sans-serif;font-size:14px;font-weight:700;',
      '  letter-spacing:1.4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}',
      '.board .tmeta{display:none}',
      '.board .pts{font-family:"Bebas Neue",sans-serif;font-size:36px;line-height:.82}',
      '.board .spacer{display:none}',
      '.board .setbox{background:none;border:none;padding:0 4px;flex-shrink:0}',
      '.board .setnum{font-family:"Barlow Condensed",sans-serif;font-size:10px;font-weight:700;',
      '  letter-spacing:2px;color:#5C6880}',
      '.board .sets{font-family:"Barlow Condensed",sans-serif;font-size:12px;font-weight:700;color:#8A93A8}',
      '.board .serveball{width:7px;height:7px}',

      /* los botones que quedan afuera */
      '.top .tbtn{height:34px;padding:0 14px;border-radius:9px;font-family:"Barlow Condensed",sans-serif;',
      '  font-size:12.5px;font-weight:700;letter-spacing:1px;white-space:nowrap;max-width:none}',
      /* un solo boton rojo: el que se toca todo el tiempo. "Cerrar set" es
         importante pero se toca cuatro veces por partido, y ademas cierra
         algo: que no grite mas que el otro. */
      '.top .tbtn.pri{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);',
      '  color:#C3CBD9;font-weight:700}',
      '.top .tbtn.pri:hover{border-color:rgba(232,25,44,.55);color:#FF6B79}',
      '#pe-analisis{background:#E8192C;border:none;color:#fff;font-weight:800}',
      '#pe-analisis:hover{background:#FF2A3E}',

      /* el menú */
      '.pe-mas{position:relative;flex-shrink:0}',
      '#pe-mas-btn{height:34px;padding:0 13px;border:1px solid rgba(232,25,44,.45);border-radius:9px;',
      '  background:rgba(232,25,44,.12);color:#FF6B79;font-family:"Barlow Condensed",sans-serif;',
      '  font-size:12.5px;font-weight:700;letter-spacing:1px;display:flex;align-items:center;gap:6px}',
      '#pe-panel{position:absolute;right:0;top:42px;z-index:900;width:min(92vw,720px);display:none;',
      '  background:#0E1120;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;',
      '  box-shadow:0 26px 70px rgba(0,0,0,.65)}',
      '#pe-panel.abierto{display:block}',
      '.pe-grupo{margin-bottom:16px}.pe-grupo:last-child{margin-bottom:0}',
      '.pe-gtit{display:flex;align-items:center;gap:7px;margin-bottom:3px}',
      '.pe-gtit i{width:5px;height:5px;border-radius:50%;display:block}',
      '.pe-gtit b{font-family:"Barlow Condensed",sans-serif;font-size:11px;font-weight:800;letter-spacing:2px}',
      '.pe-gsub{font-size:12px;color:#5C6880;margin-bottom:9px}',
      '.pe-gbtns{display:flex;flex-wrap:wrap;gap:6px}',
      '#pe-panel .tbtn{height:32px;padding:0 12px;max-width:none;font-size:12px}',

      /* las rotaciones, legibles */
      '.rot{gap:5px}',
      '.rot .zone{min-height:52px;border-radius:9px;background:rgba(255,255,255,.022);',
      '  border:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;',
      '  align-items:center;justify-content:center;gap:1px;position:relative}',
      /* la fila de red (las tres primeras) va mas clara: se lee donde esta la red */
      '.rot .zone:nth-child(-n+3){background:rgba(255,255,255,.055)}',
      '.rot .zn{position:absolute;top:4px;left:6px;font-family:"Barlow Condensed",sans-serif;',
      '  font-size:9px;font-weight:700;color:#4A5468}',
      '.rot .pn{font-family:"Bebas Neue",sans-serif;font-size:23px;line-height:.9;color:#E7EBF3}',
      '.rot .zone.setter{background:rgba(232,25,44,.13);border-color:rgba(232,25,44,.45)}',
      '.rot .zone.setter .pn{color:#FF6B79}',
      '.rot .zone.serving{box-shadow:inset 0 0 0 1px rgba(78,212,154,.5)}',
      '.pe-red{height:3px;border-radius:2px;margin:0 0 6px;',
      '  background:linear-gradient(90deg,rgba(255,255,255,.05),rgba(255,255,255,.32),rgba(255,255,255,.05))}',

      /* Las columnas se estiran. Antes quedaban pegadas arriba (align-items
         start) y media pantalla quedaba negra por debajo. */
      '.wrap{align-items:stretch}',
      '.wrap > .col{min-height:0}',
      '.wrap > .col > .pane:last-child{flex-grow:1}',

      /* el cuadro de "cómo venimos" */
      '#pe-pulso .pe-fila{margin-bottom:12px}#pe-pulso .pe-fila:last-child{margin-bottom:0}',
      '.pe-flbl{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:5px}',
      '.pe-flbl span{font-family:"Barlow Condensed",sans-serif;font-size:12px;font-weight:700;',
      '  letter-spacing:.8px;color:#9AA3B5}',
      '.pe-fval{font-family:"Bebas Neue",sans-serif;font-size:24px;line-height:.85}',
      '.pe-fdet{font-family:"Barlow Condensed",sans-serif;font-size:11px;font-weight:700;color:#4A5468;margin-left:6px}',
      '.pe-bar{height:5px;border-radius:3px;background:rgba(255,255,255,.05);overflow:hidden}',
      '.pe-bar i{display:block;height:100%;border-radius:3px}',
      '.pe-cj{display:flex;align-items:center;gap:9px;margin-bottom:8px}',
      '.pe-cnum{font-family:"Bebas Neue",sans-serif;font-size:16px;color:#5C6880;width:24px;flex-shrink:0}',
      '.pe-cnom{font-size:12.5px;font-weight:600;color:#C3CBD9;flex-shrink:0;max-width:78px;',
      '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.pe-cbar{flex-grow:1;display:flex;gap:2px;align-items:center;min-width:0}',
      '.pe-cbar i{height:14px;display:block}',
      '.pe-csal{font-family:"Bebas Neue",sans-serif;font-size:17px;width:32px;text-align:right;flex-shrink:0}',
      '.pe-nota{margin-top:11px;padding-top:10px;border-top:1px solid rgba(255,255,255,.06);',
      '  font-size:11.5px;line-height:1.5;color:#6B7488}',


      /* ── EL INTERRUPTOR DE EQUIPO ─────────────────────────────────── */
      '.pe-lados{display:flex;gap:4px;margin:0 0 9px}',
      '.pe-lb{flex:1 1 0;min-width:0;padding:4px 6px;border-radius:7px;cursor:pointer;',
      '  background:transparent;border:1px solid var(--b,rgba(255,255,255,.1));',
      '  color:var(--mut,#7b87a3);font-size:9.5px;font-weight:800;letter-spacing:.8px;',
      '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:inherit}',
      '.pe-lb:hover{border-color:rgba(255,255,255,.28)}',
      /* el elegido lleva el color de su equipo: el mismo de la cancha */
      '.pe-lb.on:first-child{background:rgba(206,124,24,.16);border-color:#CE7C18;color:#E8A045}',
      '.pe-lb.on:last-child{background:rgba(11,132,196,.16);border-color:#0B84C4;color:#4FB3E8}',
      '#pe-cierran h3{display:flex;align-items:baseline;gap:7px}',
      '.pe-cq{font-style:normal;font-size:9px;font-weight:800;letter-spacing:1px;',
      '  margin-left:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:105px}',
      '.pe-cq-h{color:#CE7C18}',
      '.pe-cq-a{color:#0B84C4}',

      /* ── LA CANCHA UNICA ──────────────────────────────────────────────
         El de arriba gira 180 grados para quedar enfrentado; cada
         casillero gira otros 180 para que el numero se lea bien. El HTML
         no se toca: renderRot() sigue escribiendo donde siempre. */
      '#pe-cancha h3{margin:0 0 7px}',
      '#pe-cancha .pe-eq{margin:3px 0 2px}',
      '#pe-cancha .pe-eq b{font-size:10px;font-weight:800;letter-spacing:1.4px;',
      '  display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#pe-cancha .pe-eq-h b{color:#CE7C18}',
      '#pe-cancha .pe-eq-a b{color:#0B84C4}',
      /* los cuatro botones en una fila entera y del mismo ancho: apretados
         contra el nombre del equipo no entraban y se partian en tres filas */
      '#pe-cancha .pe-bot{display:flex;gap:3px;margin:0 0 5px}',
      '#pe-cancha .pe-bot button{flex:1 1 0;min-width:0;font-size:9px;padding:3px 2px;',
      '  line-height:1.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#pe-cancha .pe-ring{display:block}',
      /* OJO: esto arregla algo que YA estaba mal. .zone tiene aspect-ratio,
         y como la altura se la daba el contenedor, cada casillero terminaba
         midiendo 62px de ancho dentro de una grilla de 116px: la columna de
         las zonas 2 y 1 se salia del cuadro y quedaba tapada por el panel
         del medio. Aca la cancha ocupa el ancho entero y la altura es fija,
         asi que no se sale nada. Solo aplica dentro de #pe-cancha: no toco
         ninguna otra pantalla. */
      '#pe-cancha .rot{max-width:none;width:100%;margin:0;gap:4px}',
      /* el min-height de 52px sale de movil.css, pensado para tocar con el
         dedo. Aca son dos canchas en una columna angosta: 40px sigue siendo
         comodo de tocar y devuelve casi 50px de alto a la columna. */
      '#pe-cancha .rot .zone{aspect-ratio:auto;height:40px;min-height:0}',
      '#pe-cancha .rot .zn{font-size:9px}',
      '#pe-cancha .rot .pn{font-size:15px;font-weight:800}',
      '#pe-cancha .pe-arriba .rot{transform:rotate(180deg)}',
      '#pe-cancha .pe-arriba .rot .zone{transform:rotate(180deg)}',
      '#pe-cancha .pe-redline{display:flex;align-items:center;gap:7px;margin:3px 0}',
      '#pe-cancha .pe-redline i{flex:1 1 auto;height:2px;border-radius:2px;',
      '  background:linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.4),rgba(255,255,255,.08))}',
      '#pe-cancha .pe-redline s{text-decoration:none;font-size:8px;font-weight:700;',
      '  letter-spacing:2.2px;color:var(--mut,#7b87a3)}',

      /* ── LA BARRA DE ACCIONES DEL SET ─────────────────────────────── */
      '.pe-accmas{position:relative;display:inline-block}',
      '#pe-acc-btn{white-space:nowrap}',
      '#pe-acc-panel{display:none;position:absolute;right:0;top:calc(100% + 6px);',
      '  min-width:190px;padding:8px;border-radius:11px;z-index:900;',
      '  background:#0d1220;border:1px solid rgba(255,255,255,.12);',
      '  box-shadow:0 16px 40px rgba(0,0,0,.6)}',
      '#pe-acc-panel.abierto{display:flex;flex-wrap:wrap;gap:5px}',
      '#pe-acc-panel button,#pe-acc-panel select{margin:0}',
      '.pe-acc-pri{border-color:rgba(232,25,44,.45)!important;color:#ff8d98!important}',

      /* ── LOS ATAJOS AL ANALISIS ───────────────────────────────────── */
      '#pe-atajos{margin-top:12px;padding-top:11px;',
      '  border-top:1px solid var(--b,rgba(255,255,255,.08))}',
      '.pe-atit{font-size:10px;font-weight:800;letter-spacing:1.8px;',
      '  color:var(--mut,#7b87a3);margin-bottom:8px}',
      /* en dos columnas: cinco botones en fila se hacen ilegibles, y uno
         abajo del otro comen toda la altura que acabamos de ganar */
      '.pe-alist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}',
      '.pe-at{display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer;',
      '  padding:9px 11px;border-radius:9px;font-family:inherit;',
      '  background:rgba(255,255,255,.028);border:1px solid var(--b,rgba(255,255,255,.08));',
      '  transition:border-color .12s,background .12s}',
      '.pe-at:hover{background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.2)}',
      '.pe-aic{flex:0 0 auto;width:26px;height:26px;border-radius:7px;border:1px solid;',
      '  display:flex;align-items:center;justify-content:center;',
      '  font-size:12px;font-weight:800;line-height:1}',
      '.pe-atx{min-width:0}',
      '.pe-atx b{display:block;font-size:12px;font-weight:600;color:var(--fg,#e8edf5);',
      '  line-height:1.25}',
      '.pe-atx i{display:block;font-style:normal;font-size:10px;color:var(--mut,#7b87a3);',
      '  margin-top:2px;line-height:1.3}',
      '.pe-anota{margin-top:9px;font-size:10px;color:var(--mut,#7b87a3);opacity:.8;',
      '  line-height:1.5}',
      '@media(max-width:820px){.pe-alist{grid-template-columns:1fr}}',
      /* en telefono la barra se parte en dos filas y el marcador manda */
      '@media(max-width:820px){',
      '  .top{height:auto;flex-wrap:wrap;padding:8px 10px;gap:8px}',
      '  .board{order:-1;width:100%;flex-basis:100%}',
      '  .board .pts{font-size:30px}',
      '  .top .tbtn{height:32px;padding:0 11px;font-size:12px}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ══ 2 · AGRUPAR LA BARRA ════════════════════════════════════════════ */
  function fnDe(b) {
    var o = b.getAttribute('onclick') || '';
    var m = o.match(/([A-Za-z_$][\w$]*)\s*\(/);
    return m ? m[1] : '';
  }
  function momentoDe(fn) {
    for (var k in MOMENTOS) if (MOMENTOS[k].indexOf(fn) >= 0) return k;
    return 'luego';   /* lo que no conozco va al cajón de después, nunca se pierde */
  }

  function agrupar() {
    var top = document.querySelector('.top');
    if (!top || document.getElementById('pe-mas-btn')) return;
    var t = L();

    /* el cartel de EN VIVO, en lugar del título */
    var h1 = top.querySelector('h1');
    if (h1 && !document.querySelector('.pe-vivo')) {
      var v = document.createElement('div');
      v.className = 'pe-vivo'; v.setAttribute('data-notr', '');
      v.innerHTML = '<i></i><b>EN VIVO</b>';
      top.insertBefore(v, h1.nextSibling);
      var sp = document.createElement('div'); sp.className = 'pe-sep';
      top.insertBefore(sp, v.nextSibling);
    }

    /* el marcador entra en la barra */
    var board = document.querySelector('.board');
    if (board && board.parentNode !== top) {
      var sp2 = top.querySelector('.spacer');
      top.insertBefore(board, sp2 || null);
    }

    /* el menú */
    var caja = document.createElement('div');
    caja.className = 'pe-mas'; caja.setAttribute('data-notr', '');
    var btn = document.createElement('button');
    btn.id = 'pe-mas-btn'; btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span>' + esc(t.mas) + '</span><span style="font-size:14px;line-height:1">&#8943;</span>';
    var panel = document.createElement('div');
    panel.id = 'pe-panel';
    caja.appendChild(btn); caja.appendChild(panel);
    top.appendChild(caja);

    var COL = { antes: '#8B5CF6', vivo: '#0E9F6E', luego: '#0B84C4' };
    var cajas = {};
    ['antes', 'vivo', 'luego'].forEach(function (k) {
      var g = document.createElement('div');
      g.className = 'pe-grupo';
      g.innerHTML = '<div class="pe-gtit"><i style="background:' + COL[k] + '"></i>' +
                    '<b style="color:' + COL[k] + '">' + esc(t[k]) + '</b></div>' +
                    '<div class="pe-gsub">' + esc(t[k + 'D']) + '</div>' +
                    '<div class="pe-gbtns"></div>';
      panel.appendChild(g);
      cajas[k] = g.querySelector('.pe-gbtns');
    });

    /* Los botones se MUEVEN, no se copian: conservan su onclick y su id, así
       que todo lo que el panel ya hacía con ellos sigue funcionando. */
    var botones = [].slice.call(top.querySelectorAll('.tbtn'));
    botones.forEach(function (b) {
      var fn = fnDe(b);
      if (AFUERA.indexOf(fn) >= 0) {
        if (fn === 'abrirAnalisis') b.id = b.id || 'pe-analisis';
        return;
      }
      cajas[momentoDe(fn)].appendChild(b);
    });
    /* las rayitas separadoras ya no separan nada */
    [].slice.call(top.querySelectorAll('.tbsep')).forEach(function (s) { s.style.display = 'none'; });
    /* el menú queda último */
    top.appendChild(caja);

    ['antes', 'vivo', 'luego'].forEach(function (k) {
      if (!cajas[k].children.length) cajas[k].parentNode.style.display = 'none';
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var ab = panel.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', ab ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!caja.contains(e.target)) {
        panel.classList.remove('abierto');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { panel.classList.remove('abierto'); btn.setAttribute('aria-expanded','false'); }
    });
  }

  /* ══ 3 · LA RED ARRIBA DE CADA ROTACIÓN ══════════════════════════════ */
  function redes() {
    ['rot-h', 'rot-a'].forEach(function (id) {
      var r = document.getElementById(id);
      if (!r || !r.parentNode) return;
      if (r.previousElementSibling && r.previousElementSibling.classList.contains('pe-red')) return;
      var d = document.createElement('div');
      d.className = 'pe-red'; d.setAttribute('data-notr', '');
      r.parentNode.insertBefore(d, r);
    });
  }

  /* ══ 4 · CÓMO VENIMOS ════════════════════════════════════════════════
     Los números salen de anRallies(), que es la misma fuente de la ventana
     de análisis. Si esa función no está, el cuadro no se dibuja y listo. */
  function cierre(r) {
    if (!r || !r.gano) return null;
    var acc = r.acciones || [], gana = r.gano;
    var pierde = (gana === 'home') ? 'away' : 'home';
    var W = null, E = null;
    for (var i = acc.length - 1; i >= 0; i--) {
      var a = acc[i]; if (!a) continue;
      if (!W && a.lado === gana && a.ev === '#' && 'SABDF'.indexOf(a.sk) >= 0) W = a;
      if (!E && a.lado === pierde && (a.ev === '=' || (a.ev === '/' && (a.sk === 'A' || a.sk === 'B')))) E = a;
    }
    /* anLeer() devuelve el dorsal en .num */
    if (W) return { jug: W.num, lado: gana, aFavor: true };
    if (E) return { jug: E.num, lado: pierde, aFavor: false };
    return null;
  }

  /* ── DE QUE EQUIPO SON ESTOS NUMEROS ─────────────────────────────────
     El cuadro miraba siempre al local. Pero la mitad de lo que un entrenador
     quiere saber en vivo es del rival: si ELLOS estan haciendo side-out, si
     el que cierra los puntos es siempre el mismo. Ahora se cambia con un
     boton y los dos cuadros —"como venimos" y "quien esta cerrando"— siguen
     al mismo.

     Arranca en el local, y si la ventana de analisis ya tenia elegido un
     lado, arranca con ese. De ahi en mas manda el boton. */
  var PE_LADO = null;
  function ladoPulso() {
    if (PE_LADO) return PE_LADO;
    try { if (window.AV && AV.lado) return (PE_LADO = AV.lado); } catch (e) {}
    return (PE_LADO = 'home');
  }
  window.peLado = function (l) {
    PE_LADO = (l === 'away') ? 'away' : 'home';
    try { pintarPulso(); } catch (e) {}
  };

  function calcular() {
    var rs;
    try { rs = anRallies(); } catch (e) { return null; }
    if (!rs || !rs.length) return null;

    var lado = ladoPulso();

    var soTot = 0, soGan = 0, bpTot = 0, bpGan = 0, atk = 0, pts = 0, err = 0;
    var porJug = {};

    rs.forEach(function (r) {
      if (r.recibe === lado) { soTot++; if (r.gano === lado) soGan++; }
      if (r.saca === lado)   { bpTot++; if (r.gano === lado) bpGan++; }
      (r.acciones || []).forEach(function (a) {
        if (a.lado !== lado || a.sk !== 'A') return;
        atk++;
        if (a.ev === '#') pts++;
        else if (a.ev === '=' || a.ev === '/') err++;
      });
      var c = cierre(r);
      if (c && c.lado === lado && c.jug) {
        var j = porJug[c.jug] || (porJug[c.jug] = { num: c.jug, a: 0, e: 0 });
        if (c.aFavor) j.a++; else j.e++;
      }
    });

    var lista = Object.keys(porJug).map(function (k) { return porJug[k]; });
    lista.forEach(function (j) { j.saldo = j.a - j.e; });
    lista.sort(function (x, y) { return y.saldo - x.saldo || y.a - x.a; });

    return {
      so: { n: soGan, t: soTot, pct: soTot ? Math.round(soGan / soTot * 100) : 0 },
      bp: { n: bpGan, t: bpTot, pct: bpTot ? Math.round(bpGan / bpTot * 100) : 0 },
      ef: { n: pts, t: atk, pct: atk ? Math.round((pts - err) / atk * 100) : 0 },
      jug: lista.slice(0, 5)
    };
  }

  /* nombreDe() necesita el lado para buscar en el plantel correcto, y si no
     hay plantel cargado devuelve el propio numero. En ese caso no se muestra
     nada: seria el dorsal repetido dos veces. */
  function nombreDeJug(num, lado) {
    try {
      if (typeof nombreDe === 'function') {
        var n = nombreDe(num, lado);
        if (n && String(n) !== String(num)) return n;
      }
    } catch (e) {}
    return '';
  }

  /* Solo el apellido: "BARTHOLET CHRISTIAN" no entra en la columna y salia
     cortado a la mitad. En la cancha a nadie se lo llama por el nombre. */
  function apellido(q) {
    q = String(q || '').trim();
    if (!q) return '';
    var p = q.split(/\s+/);
    return (p.length > 1 && p[0].length >= 3) ? p[0] : q;
  }

  /* Los botones llevan el NOMBRE del equipo, no "local" y "visitante": en
     el banco uno piensa en Freiburg, no en "el visitante". */
  function interruptorLado() {
    var t = L(), l = ladoPulso();
    return '<div class="pe-lados">' +
      ['home', 'away'].map(function (k) {
        var nom = nombreEq(k, k === 'home' ? t.nosotros : t.ellos);
        return '<button type="button" class="pe-lb' + (l === k ? ' on' : '') +
               '" onclick="peLado(\'' + k + '\')" title="' + esc(nom) + '">' +
               esc(nom) + '</button>';
      }).join('') + '</div>';
  }

  function pintarPulso() {
    var pane = document.getElementById('pe-pulso');
    if (!pane) return;
    var t = L(), d = calcular();
    if (!d) {
      pane.innerHTML = '<h3 data-notr>' + esc(t.venimos) + '</h3>' + interruptorLado() +
                       '<div style="font-size:12.5px;color:#6B7488;padding:6px 2px">' + esc(t.nada) + '</div>';
      return;
    }
    function fila(lbl, v, det, col, ancho) {
      return '<div class="pe-fila"><div class="pe-flbl"><span>' + esc(lbl) + '</span>' +
             '<span><b class="pe-fval" style="color:' + col + '">' + v + '</b>' +
             '<b class="pe-fdet">' + esc(det) + '</b></span></div>' +
             '<div class="pe-bar"><i style="width:' + ancho + '%;background:' + col + '"></i></div></div>';
    }
    var h = '<h3 data-notr>' + esc(t.venimos) + '</h3>' + interruptorLado();
    h += fila(t.so, d.so.pct + '%', d.so.n + ' ' + t.de + ' ' + d.so.t,
              d.so.pct >= 60 ? '#0E9F6E' : d.so.pct >= 45 ? '#CE7C18' : '#DC2A5A', Math.min(100, d.so.pct));
    h += fila(t.bp, d.bp.pct + '%', d.bp.n + ' ' + t.de + ' ' + d.bp.t,
              d.bp.pct >= 40 ? '#0E9F6E' : d.bp.pct >= 25 ? '#CE7C18' : '#DC2A5A', Math.min(100, d.bp.pct));
    h += fila(t.ef, d.ef.pct + '%', d.ef.n + ' ' + t.de + ' ' + d.ef.t,
              d.ef.pct >= 25 ? '#0E9F6E' : d.ef.pct >= 10 ? '#CE7C18' : '#DC2A5A',
              Math.min(100, Math.max(0, d.ef.pct) * 2));
    pane.innerHTML = h;

    var lado = ladoPulso();
    var pj = document.getElementById('pe-cierran');
    if (!pj) return;
    var quien = '<h3 data-notr>' + esc(t.cierran) +
                '<i class="pe-cq pe-cq-' + (lado === 'home' ? 'h' : 'a') + '">' +
                esc(nombreEq(lado, lado === 'home' ? t.nosotros : t.ellos)) + '</i></h3>';
    if (!d.jug.length) { pj.innerHTML = quien; return; }
    var max = Math.max.apply(null, d.jug.map(function (j) { return j.a + j.e; })) || 1;
    var c = quien;
    d.jug.forEach(function (j) {
      var sal = (j.saldo > 0 ? '+' : '') + j.saldo;
      c += '<div class="pe-cj"><span class="pe-cnum">' + esc(j.num) + '</span>' +
           '<span class="pe-cnom">' + esc(apellido(nombreDeJug(j.num, lado))) + '</span>' +
           '<span class="pe-cbar">' +
             '<i style="width:' + (j.a / max * 100).toFixed(1) + '%;background:#0E9F6E;border-radius:3px 0 0 3px"></i>' +
             '<i style="width:' + (j.e / max * 100).toFixed(1) + '%;background:#DC2A5A;border-radius:0 3px 3px 0"></i>' +
           '</span>' +
           '<b class="pe-csal" style="color:' + (j.saldo >= 0 ? '#0E9F6E' : '#DC2A5A') + '">' + sal + '</b></div>';
    });
    c += '<div class="pe-nota">' + esc(t.leyenda) + '</div>';
    pj.innerHTML = c;
  }

  function panelesPulso() {
    if (document.getElementById('pe-pulso')) return;
    /* va en la tercera columna, al lado de "Acciones del set" */
    var cols = document.querySelectorAll('.wrap > .col');
    var col = cols[cols.length - 1];
    if (!col) return;
    ['pe-pulso', 'pe-cierran'].forEach(function (id) {
      var p = document.createElement('div');
      p.className = 'pane'; p.id = id; p.setAttribute('data-notr', '');
      col.appendChild(p);
    });
  }

  /* ══ 5 · UNA SOLA CANCHA CON LOS DOS EQUIPOS ═════════════════════════
     Habia dos cuadros iguales, uno sobre otro, que entre los dos se comian
     380px de alto de la columna izquierda para decir seis numeros cada uno.
     Y estaban al derecho los dos, asi que el 4 de uno quedaba arriba del 4
     del otro, cuando en la cancha real el 4 de uno esta enfrente del 2 del
     otro.

     Ahora es UNA cancha: el visitante arriba, la red, nosotros abajo. El de
     arriba se gira 180 grados con CSS —y cada casillero se gira otros 180
     para que el numero no quede cabeza abajo—, asi que el dibujo queda
     fisicamente bien SIN tocar el orden del HTML. Eso importa: renderRot()
     sigue escribiendo en los mismos .pn de siempre y no se entera de nada.

     Los .rot no se copian: se MUEVEN, con su id puesto. */
  function unaCancha() {
    if (document.getElementById('pe-cancha')) return;
    var rh = document.getElementById('rot-h'), ra = document.getElementById('rot-a');
    if (!rh || !ra) return;
    var pH = rh.closest ? rh.closest('.pane') : null;
    var pA = ra.closest ? ra.closest('.pane') : null;
    if (!pH || !pA || pH === pA) return;
    var t = L();

    var caja = document.createElement('div');
    caja.className = 'pane'; caja.id = 'pe-cancha'; caja.setAttribute('data-notr', '');
    caja.innerHTML =
      '<h3>' + esc(t.rotTit) + '</h3>' +
      '<div class="pe-eq pe-eq-a"><b></b></div>' +
      '<div class="pe-bot" id="pe-bot-a"></div>' +
      '<div class="pe-ring pe-arriba"></div>' +
      '<div class="pe-redline"><i></i><s>' + esc(t.red) + '</s><i></i></div>' +
      '<div class="pe-ring pe-abajo"></div>' +
      '<div class="pe-bot" id="pe-bot-h"></div>' +
      '<div class="pe-eq pe-eq-h"><b></b></div>';
    pH.parentNode.insertBefore(caja, pH);

    pintarNombresEq();

    /* las canchas, movidas tal cual */
    caja.querySelector('.pe-arriba').appendChild(ra);
    caja.querySelector('.pe-abajo').appendChild(rh);

    /* y los botones de cada equipo, al lado de su nombre */
    [[pA, 'pe-bot-a'], [pH, 'pe-bot-h']].forEach(function (par) {
      var destino = document.getElementById(par[1]);
      [].slice.call(par[0].querySelectorAll('button')).forEach(function (b) {
        if (b.classList.contains('fbtn')) return;   /* el de "ventana aparte" no viene */
        destino.appendChild(b);
      });
    });
    pH.style.display = 'none';
    pA.style.display = 'none';
  }

  /* El nombre de cada equipo. Va aparte y se llama en cada vuelta porque
     cuando la pagina abre todavia no hay partido: si se escribiera una sola
     vez, los dos lados quedarian con el nombre del club para siempre, y al
     traer otro partido tampoco cambiarian. */
  function nombreEq(cual, porDefecto) {
    try {
      var o = (typeof M !== 'undefined' && M) ? M[cual] : null;
      var v = o && (o.nombre || o.name || o.n);
      if (v && String(v).trim()) return String(v).trim();
    } catch (e) {}
    return porDefecto;
  }
  function pintarNombresEq() {
    var caja = document.getElementById('pe-cancha');
    if (!caja) return;
    var t = L();
    [['.pe-eq-a b', 'away', t.ellos], ['.pe-eq-h b', 'home', t.nosotros]].forEach(function (x) {
      var e = caja.querySelector(x[0]); if (!e) return;
      var v = nombreEq(x[1], x[2]);
      if (e.textContent !== v) e.textContent = v;
    });
  }

  /* ══ 6 · LA BARRA DE "ACCIONES DEL SET" ══════════════════════════════
     Ocho botones chiquitos en una sola fila: en una pantalla de 1500px el
     ultimo —"Deshacer codigo", que es el que MAS se toca— se salia del
     borde y no se podia ni ver. Mismo criterio que arriba: los tres que se
     usan cada punto quedan afuera, el resto pasa a un menu.

     Los botones se mueven con su onclick puesto. */
  var ACC_AFUERA = ['undoLast', 'undoRally', 'buscarCodigo'];

  function barraAcciones() {
    if (document.getElementById('pe-acc-btn')) return;
    var cab = null;
    [].slice.call(document.querySelectorAll('.pane > h3')).forEach(function (h) {
      if (h.querySelector('#codes-h')) cab = h;
    });
    if (!cab) return;
    var t = L();

    var caja = document.createElement('span');
    caja.className = 'pe-accmas'; caja.setAttribute('data-notr', '');
    var btn = document.createElement('button');
    btn.id = 'pe-acc-btn'; btn.type = 'button'; btn.className = 'hbtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = esc(t.masAcc) + ' &#8943;';
    var pan = document.createElement('div');
    pan.id = 'pe-acc-panel';
    caja.appendChild(btn); caja.appendChild(pan);

    var mueve = [].slice.call(cab.querySelectorAll('button.hbtn, select.hsel'));
    cab.appendChild(caja);
    mueve.forEach(function (b) {
      if (b === btn) return;
      var fn = fnDe(b);
      if (b.tagName === 'BUTTON' && ACC_AFUERA.indexOf(fn) >= 0) {
        /* el que mas se usa, primero de los que quedan afuera */
        if (fn === 'undoLast') { b.classList.add('pe-acc-pri'); cab.insertBefore(b, caja); }
        return;
      }
      pan.appendChild(b);
    });
    /* el orden de los que quedaron afuera: deshacer codigo, deshacer punto, buscar */
    ['undoLast', 'undoRally', 'buscarCodigo'].forEach(function (fn) {
      var b = [].slice.call(cab.children).filter(function (x) { return fnDe(x) === fn; })[0];
      if (b) cab.insertBefore(b, caja);
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var ab = pan.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', ab ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!caja.contains(e.target)) {
        pan.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ══ 7 · LOS ATAJOS AL ANÁLISIS ══════════════════════════════════════
     Acá había un rectángulo de 190px de negro, y después la lista de lo
     último cargado —que estaba bien, pero repetía lo que ya muestra la
     columna de la derecha.

     Lo que de verdad hace falta en ese lugar es llegar rápido a las cuatro
     preguntas que uno se hace en cada tiempo muerto. Cada botón deja los
     filtros puestos y abre el análisis en la pantalla que corresponde: un
     toque en vez de siete.

     Los atajos son datos, no código: para agregar uno se agrega una línea
     acá y nada más. */
  var ATAJOS = [
    { k:'arm', tab:'arm', erec:'#+',
      ico:'&#9679;', col:'#8B5CF6' },
    { k:'so1', tab:'jug', fase:'so', zrec:'1', ico:'1', col:'#0E9F6E' },
    { k:'so6', tab:'jug', fase:'so', zrec:'6', ico:'6', col:'#0E9F6E' },
    { k:'so5', tab:'jug', fase:'so', zrec:'5', ico:'5', col:'#0E9F6E' },
    { k:'dir', tab:'dir', fund:'A', ico:'&#8599;', col:'#0B84C4' }
  ];

  function textoAtajo(a) {
    var t = L();
    if (a.k === 'arm') return { tit:t.atArmT, sub:t.atArmS };
    if (a.k === 'dir') return { tit:t.atDirT, sub:t.atDirS };
    return { tit:t.atSoT.replace('{z}', a.zrec), sub:t.atSoS.replace('{z}', a.zrec) };
  }

  function panelAtajos() {
    if (document.getElementById('pe-atajos')) return;
    var w = document.querySelector('.wrap');
    if (!w) return;
    var medio = null;
    [].slice.call(w.children).forEach(function (c) {
      if (c.querySelector && c.querySelector('.scoutbar')) medio = c;
    });
    if (!medio) return;
    var d = document.createElement('div');
    d.id = 'pe-atajos'; d.setAttribute('data-notr', '');
    medio.appendChild(d);
  }

  function pintarAtajos() {
    var d = document.getElementById('pe-atajos');
    if (!d) return;
    var t = L();
    /* se redibuja solo si cambio el idioma: no tiene datos adentro */
    var firma = t.atajos;
    if (d.getAttribute('data-firma') === firma) return;
    d.setAttribute('data-firma', firma);

    var h = '<div class="pe-atit">' + esc(t.atajos) + '</div><div class="pe-alist">';
    ATAJOS.forEach(function (a) {
      var x = textoAtajo(a);
      var cfg = { tab:a.tab };
      ['erec', 'zrec', 'fase', 'fund'].forEach(function (k) { if (a[k]) cfg[k] = a[k]; });
      h += '<button type="button" class="pe-at" onclick=\'AV.atajo(' +
             JSON.stringify(cfg).replace(/'/g, '&#39;') + ')\'>' +
             '<span class="pe-aic" style="color:' + a.col + ';border-color:' + a.col + '33;' +
               'background:' + a.col + '1f">' + a.ico + '</span>' +
             '<span class="pe-atx"><b>' + esc(x.tit) + '</b><i>' + esc(x.sub) + '</i></span>' +
           '</button>';
    });
    h += '</div><div class="pe-anota">' + esc(t.notaAtajos) + '</div>';
    d.innerHTML = h;
  }

  /* ══ ARRANQUE ════════════════════════════════════════════════════════ */
  function arrancar() {
    try { estilo(); }        catch (e) { try { console.error('[estilo]', e); } catch (_) {} }
    try { agrupar(); }       catch (e) { try { console.error('[barra]', e); } catch (_) {} }
    try { redes(); }         catch (e) { try { console.error('[red]', e); } catch (_) {} }
    try { panelesPulso(); pintarPulso(); }
    catch (e) { try { console.error('[pulso]', e); } catch (_) {} }
    try { unaCancha(); pintarNombresEq(); }
    catch (e) { try { console.error('[cancha]', e); } catch (_) {} }
    try { barraAcciones(); } catch (e) { try { console.error('[acciones]', e); } catch (_) {} }
    try { panelAtajos(); pintarAtajos(); }
    catch (e) { try { console.error('[atajos]', e); } catch (_) {} }

    /* se repinta con lo que vas cargando. Medio segundo alcanza: no es un
       videojuego y no vale la pena hacer trabajar al navegador de más. */
    setInterval(function () {
      try { redes(); pintarPulso(); pintarAtajos(); pintarNombresEq(); } catch (e) {}
    }, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
