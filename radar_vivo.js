/* ═══════════════════════════════════════════════════════════════════════════
   radar_vivo.js — EL RADAR DE SAQUE, ADENTRO DEL PANEL EN VIVO

   QUE RESUELVE
   ------------
   La pantalla radar_saque.html mide bien, pero para usarla en un entrenamiento
   hay que salir del panel, prender otra camara y buscar el saque a mano. Entre
   que hacias todo eso se te pasaban tres saques.

   Esto vive ADENTRO del panel, sobre el video con retraso que ya esta
   corriendo al lado del teclado. No hay que cambiar de pantalla ni prender
   nada: el saque paso hace ocho segundos y todavia esta en el buffer.

   COMO SE USA
   -----------
     · Boton RADAR (o la tecla R) -> se abre encima del video
     · "Ultimo saque" -> rebobina solo hasta donde estuvo
     · 1 en el golpe, 2 en el cruce de red, flechas para afinar
     · Enter guarda

   LO QUE NO HACE, A PROPOSITO
   ---------------------------
   No se queda con el teclado. En esta pantalla se scoutea escribiendo codigos,
   y un radar que se robe las teclas es peor que no tener radar. Solo escucha
   cuando esta abierto, y NUNCA cuando el cursor esta en un campo de texto.

   LA CUENTA
   ---------
   No esta aca. Esta en radar_motor.js, que es el mismo que usa la pantalla
   grande. Un solo lugar, un solo resultado.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
'use strict';

if (!global.VB_RADAR){ try{ console.warn('[radar] falta radar_motor.js'); }catch(e){} return; }
var R = global.VB_RADAR;

var CLAVE      = 'radar_saque_v1';      /* el mismo registro que la pantalla grande */
var CLAVE_CFG  = 'radar_cfg_v1';
var ABIERTO    = false;
var V          = null;                  /* el <video> con retraso                   */
var FPS        = 0;
var MARCA      = { golpe: null, cruce: null };
var ULTIMA     = null;

var CFG = { gx:4.5, gy:9.8, cx:6.5, zg:3.1, red:2.43, margen:0.15,
            cd:R.CD.flotante, altitud:440, temp:20, retro:9 };
try { var g = JSON.parse(localStorage.getItem(CLAVE_CFG) || 'null'); if (g) for (var k in g) CFG[k] = g[k]; } catch(e){}
function guardarCfg(){ try{ localStorage.setItem(CLAVE_CFG, JSON.stringify(CFG)); }catch(e){} }

/* ── el video con retraso de esta pantalla ────────────────────────────── */
function buscarVideo(){
  var v = document.getElementById('vd-delay');
  if (v && v.readyState >= 1) return v;
  return v || null;
}

/* ── la caja ──────────────────────────────────────────────────────────── */
var CSS = ''
+ '#rdr-btn{position:fixed;right:26px;bottom:206px;z-index:99990;width:52px;height:52px;border-radius:50%;'
+ 'border:1px solid rgba(206,124,24,.5);background:rgba(206,124,24,.16);color:#CE7C18;font-size:21px;'
+ 'cursor:pointer;backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}'
+ '#rdr-btn:hover{background:rgba(206,124,24,.3)}'
+ '#rdr-btn.on{background:#CE7C18;color:#0b0b10}'
+ '#rdr{position:fixed;inset:0;z-index:99991;background:rgba(4,5,9,.82);display:none;'
+ 'align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(10px)}'
+ '#rdr.on{display:flex}'
+ '#rdr .caja{background:#0D0E1A;border:1px solid rgba(255,255,255,.1);border-radius:14px;'
+ 'width:min(1180px,100%);max-height:96vh;overflow:auto;'
+ "font-family:'Barlow Condensed',sans-serif;color:#E2E8F0}"
+ '#rdr .cab{display:flex;align-items:center;gap:10px;padding:11px 15px;border-bottom:1px solid rgba(255,255,255,.07)}'
+ "#rdr .cab b{font-family:'Bebas Neue',sans-serif;font-size:21px;letter-spacing:.03em;flex:1;font-weight:400}"
+ '#rdr .cerrar{background:#111220;border:1px solid rgba(255,255,255,.14);color:#E2E8F0;border-radius:7px;'
+ 'width:32px;height:32px;font-size:15px;cursor:pointer}'
+ '#rdr .cuerpo{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:14px;padding:14px}'
+ '@media(max-width:900px){#rdr .cuerpo{grid-template-columns:1fr}}'
+ '#rdr .escena{position:relative;background:#000;border-radius:10px;overflow:hidden;aspect-ratio:16/9}'
+ '#rdr .escena canvas{position:absolute;inset:0;width:100%;height:100%}'
/* el numero grande, encima del video, como el aparato que se ve en la foto */
+ '#rdr .grande{position:absolute;left:0;right:0;bottom:0;padding:14px 18px;'
+ 'background:linear-gradient(0deg,rgba(4,5,9,.92),rgba(4,5,9,0));text-align:center;pointer-events:none}'
+ '#rdr .grande .rot{font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#CE7C18}'
+ "#rdr .grande .n{font-family:'Bebas Neue',sans-serif;font-size:76px;line-height:.92;color:#CE7C18;"
+ 'text-shadow:0 3px 22px rgba(0,0,0,.9)}'
+ '#rdr .grande .n small{font-size:21px;color:#94a3b8;margin-left:6px}'
+ '#rdr .grande .sub{font-size:13px;color:#94a3b8}'
+ '#rdr .fila{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}'
+ "#rdr button.b{background:#111220;color:#E2E8F0;border:1px solid rgba(255,255,255,.14);border-radius:8px;"
+ "padding:8px 12px;font-weight:700;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:14px}"
+ '#rdr button.b:hover{border-color:#CE7C18}'
+ '#rdr button.b.pri{background:#CE7C18;border-color:#CE7C18;color:#0b0b10;font-weight:800}'
+ '#rdr button.b.g1{background:rgba(34,197,94,.14);border-color:rgba(34,197,94,.5);color:#22C55E}'
+ '#rdr button.b.g2{background:rgba(6,182,212,.14);border-color:rgba(6,182,212,.5);color:#06B6D4}'
+ '#rdr .marcas{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}'
+ '#rdr .m{border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:8px 10px;background:#111220}'
+ '#rdr .m.on{border-color:#CE7C18;background:rgba(206,124,24,.1)}'
+ '#rdr .m .t{font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;color:#64748b}'
+ "#rdr .m .v{font-family:'Bebas Neue',sans-serif;font-size:18px}"
+ '#rdr .lado{font-size:13px}'
+ '#rdr .lado .s{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;margin:12px 0 6px}'
+ '#rdr label{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0;color:#64748b}'
+ "#rdr input,#rdr select{background:#111220;color:#E2E8F0;border:1px solid rgba(255,255,255,.14);"
+ "border-radius:6px;padding:5px 7px;font-family:'Barlow Condensed',sans-serif;font-size:13.5px;width:120px;text-align:right}"
+ '#rdr .nota{font-size:12px;color:#64748b;line-height:1.5;border-left:2px solid rgba(255,255,255,.14);'
+ 'padding-left:8px;margin-top:8px}'
+ '#rdr .nota.mal{border-color:#EF4444;color:#fca5a5}'
+ '#rdr .lista{max-height:190px;overflow:auto;margin-top:6px;font-size:13px}'
+ '#rdr .lista div{display:flex;justify-content:space-between;gap:8px;padding:3px 0;'
+ 'border-bottom:1px solid rgba(255,255,255,.04)}'
+ "#rdr .lista b{font-family:'Bebas Neue',sans-serif;font-size:16px;color:#CE7C18;font-weight:400}";

function montar(){
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  var b = document.createElement('button');
  b.id = 'rdr-btn'; b.title = 'Radar de saque (R)'; b.innerHTML = '⚡';
  b.onclick = alternar;
  document.body.appendChild(b);

  var d = document.createElement('div');
  d.id = 'rdr';
  d.innerHTML = ''
   + '<div class="caja">'
   + '<div class="cab"><b>RADAR DE SAQUE</b><span id="rdr-est" style="font-size:12px;color:#64748b"></span>'
   + '<button class="cerrar" onclick="VB_RADAR_VIVO.cerrar()">×</button></div>'
   + '<div class="cuerpo">'
   + '<div>'
   +   '<div class="escena"><canvas id="rdr-lienzo"></canvas>'
   +     '<div class="grande"><div class="rot">Velocidad en el golpe</div>'
   +     '<div class="n" id="rdr-kmh">—<small>km/h</small></div>'
   +     '<div class="sub" id="rdr-sub">marcá el golpe y el cruce de red</div></div>'
   +   '</div>'
   +   '<div class="fila">'
   +     '<button class="b pri" onclick="VB_RADAR_VIVO.ultimo()">↺ Último saque</button>'
   +     '<button class="b" onclick="VB_RADAR_VIVO.mover(-30)">−30</button>'
   +     '<button class="b" onclick="VB_RADAR_VIVO.mover(-1)">◀</button>'
   +     '<button class="b" onclick="VB_RADAR_VIVO.mover(1)">▶</button>'
   +     '<button class="b" onclick="VB_RADAR_VIVO.mover(30)">+30</button>'
   +     '<button class="b g1" onclick="VB_RADAR_VIVO.marcar(1)">1 · Golpe</button>'
   +     '<button class="b g2" onclick="VB_RADAR_VIVO.marcar(2)">2 · Cruce</button>'
   +     '<button class="b" onclick="VB_RADAR_VIVO.limpiar()">Borrar</button>'
   +   '</div>'
   +   '<div class="marcas">'
   +     '<div class="m" id="rdr-m1"><div class="t">1 · Golpe</div><div class="v" id="rdr-m1v">—</div></div>'
   +     '<div class="m" id="rdr-m2"><div class="t">2 · Cruce de red</div><div class="v" id="rdr-m2v">—</div></div>'
   +   '</div>'
   +   '<div class="fila">'
   +     '<select id="rdr-quien" style="flex:1;min-width:140px;text-align:left"></select>'
   +     '<input type="text" id="rdr-nota" placeholder="nota" style="flex:1;min-width:90px;text-align:left">'
   +     '<button class="b pri" onclick="VB_RADAR_VIVO.guardar()">Guardar (Enter)</button>'
   +   '</div>'
   +   '<div class="nota" id="rdr-nota-res"></div>'
   + '</div>'
   + '<div class="lado">'
   +   '<div class="s">Recorrido de la pelota</div>'
   +   '<label>Sale desde la red a<input type="number" id="rdr-gy" step="0.1" min="7" max="13"></label>'
   +   '<label>Se corre de lado<input type="number" id="rdr-dx" step="0.1" min="-6" max="6"></label>'
   +   '<label>Altura del golpe<input type="number" id="rdr-zg" step="0.05" min="1.8" max="4"></label>'
   +   '<label>Altura de la red<select id="rdr-red">'
   +     '<option value="2.43">2,43 masc.</option><option value="2.24">2,24 fem.</option>'
   +     '<option value="2.35">2,35 sub-17</option></select></label>'
   +   '<div class="nota" id="rdr-rec"></div>'
   +   '<div class="s">Aire</div>'
   +   '<label>Tipo de saque<select id="rdr-cd">'
   +     '<option value="0.44">Flotante</option><option value="0.25">Con rotación</option></select></label>'
   +   '<label>Altitud<input type="number" id="rdr-alt" step="10" min="0" max="3000"></label>'
   +   '<div class="s">Medidos hoy</div>'
   +   '<div class="lista" id="rdr-lista"></div>'
   + '</div>'
   + '</div></div>';
  document.body.appendChild(d);

  ['rdr-gy','rdr-dx','rdr-zg','rdr-red','rdr-cd','rdr-alt'].forEach(function(id){
    document.getElementById(id).addEventListener('input', leerCfg);
    document.getElementById(id).addEventListener('change', leerCfg);
  });
  pintarCfg(); cargarPlantel(); pintarLista();
}

function pintarCfg(){
  document.getElementById('rdr-gy').value  = CFG.gy;
  document.getElementById('rdr-dx').value  = (CFG.cx - CFG.gx).toFixed(1);
  document.getElementById('rdr-zg').value  = CFG.zg;
  document.getElementById('rdr-red').value = CFG.red;
  document.getElementById('rdr-cd').value  = CFG.cd;
  document.getElementById('rdr-alt').value = CFG.altitud;
  pintarRecorrido();
}
function leerCfg(){
  function n(id, d){ var v = parseFloat(document.getElementById(id).value); return isFinite(v) ? v : d; }
  CFG.gy = n('rdr-gy', 9.8); CFG.zg = n('rdr-zg', 3.1);
  CFG.cx = CFG.gx + n('rdr-dx', 2); CFG.red = n('rdr-red', 2.43);
  CFG.cd = n('rdr-cd', 0.44);  CFG.altitud = n('rdr-alt', 440);
  guardarCfg(); pintarRecorrido(); calcular();
}
function pintarRecorrido(){
  var r = R.recorrido(CFG);
  document.getElementById('rdr-rec').innerHTML = 'La pelota recorre <b style="color:#E2E8F0">'
    + r.d.toFixed(2) + ' m</b> desde el golpe hasta la red.';
}

/* ── abrir y cerrar ───────────────────────────────────────────────────── */
function alternar(){ ABIERTO ? cerrar() : abrir(); }

function abrir(){
  V = buscarVideo();
  if (!V){ aviso('No encuentro el video con retraso. Abrí primero el video del panel.', true);
           document.getElementById('rdr').classList.add('on'); ABIERTO = true; return; }
  ABIERTO = true;
  document.getElementById('rdr').classList.add('on');
  document.getElementById('rdr-btn').classList.add('on');
  /* El video del panel sigue siendo el mismo elemento: lo dibujamos en un
     canvas para no sacarlo de su lugar y no romper el panel de atras. */
  V.pause();
  dibujarLazo();
  if (!FPS){
    var st = V.srcObject || (V.captureStream && null);
    var f = 0;
    try { if (V.srcObject) f = R.fpsDeCamara(V.srcObject); } catch(e){}
    if (f){ FPS = f; est('cámara a ' + FPS + ' cuadros/s'); }
    else {
      est('midiendo los cuadros/s…');
      R.medirFps(V, function(fps, motivo){
        if (fps > 0){ FPS = fps; est(FPS + ' cuadros/s'); }
        else { FPS = 0; aviso('No pude saber los cuadros por segundo de este video. '
             + (motivo === 'variable' ? 'Parece de cuadro variable.' : ''), true); }
        calcular();
      });
    }
  } else est(FPS + ' cuadros/s');
  pintarMarcas(); calcular();
}
function cerrar(){
  ABIERTO = false;
  document.getElementById('rdr').classList.remove('on');
  document.getElementById('rdr-btn').classList.remove('on');
  /* Se devuelve el video al vivo: el panel tiene que seguir andando. */
  try { V && V.play().catch(function(){}); } catch(e){}
}
function est(t){ var e = document.getElementById('rdr-est'); if (e) e.textContent = t; }
function aviso(t, mal){
  var e = document.getElementById('rdr-nota-res');
  if (!e) return;
  e.className = 'nota' + (mal ? ' mal' : ''); e.innerHTML = t;
}

/* ── el video, dibujado en el canvas, y en que cuadro estamos ─────────────
   Un solo lazo hace las dos cosas: pinta el cuadro en el canvas y anota su
   tiempo exacto. requestVideoFrameCallback avisa cada vez que el navegador
   pinta un cuadro y dice DE QUE CUADRO se trata, asi que sirve para las dos.
   Con requestAnimationFrame habria que preguntar aparte por currentTime, que
   NO esta parado en un borde de cuadro. */
var lazo   = null;
var MEDIA  = 0;     /* tiempo exacto del cuadro que se esta viendo */
var CUADRO = 0;     /* y su numero                                 */

function dibujarLazo(){
  var c = document.getElementById('rdr-lienzo');
  if (!c || !V) return;
  function pinta(now, meta){
    if (!ABIERTO){ lazo = null; return; }
    if (meta && meta.mediaTime != null){
      MEDIA = meta.mediaTime;
      if (FPS > 0) CUADRO = Math.round(MEDIA * FPS);
    }
    if (V.videoWidth){
      if (c.width !== V.videoWidth){ c.width = V.videoWidth; c.height = V.videoHeight; }
      try { c.getContext('2d').drawImage(V, 0, 0); } catch(e){}
    }
    lazo = R.hayRvfc(V) ? V.requestVideoFrameCallback(pinta)
                        : requestAnimationFrame(function(){ pinta(); });
  }
  if (!lazo) pinta();
}

/* ── moverse ──────────────────────────────────────────────────────────────
   En que cuadro estamos NO se deduce de currentTime: se pregunta. El motor
   lleva el video al instante pedido y devuelve el tiempo del cuadro que QUEDO
   mostrando, que no siempre es el que uno pidio —el navegador a veces cae en
   el de al lado—. Guardando el que quedo de verdad, lo que se marca es
   siempre el cuadro que se ve en pantalla. Probado: deduciendolo de
   currentTime, pedir el cuadro 100 devolvia 101, y un cuadro de corrimiento
   a 60 por segundo son 2,5 km/h. */
function cuadroActual(){ return (V && FPS > 0) ? CUADRO : null; }

function irACuadro(n, listo){
  if (!V || !(FPS > 0)){ if (listo) listo(null); return; }
  /* al centro del cuadro: pedir el borde exacto deja al navegador eligiendo
     entre dos cuadros, y a veces elige el otro */
  R.cuadroEn(V, (Math.max(0, n) + 0.5) / FPS, function(m){
    if (m != null && isFinite(m)){ MEDIA = m; CUADRO = Math.round(m * FPS); }
    est('cuadro ' + CUADRO);
    if (listo) listo(CUADRO);
  });
}
function mover(n){
  var c = cuadroActual();
  if (c == null){ if (V) V.currentTime += n / 30; return; }
  irACuadro(c + n);
}

/* Rebobina hasta donde estuvo el ultimo saque. El buffer del panel guarda
   90 segundos, asi que con el retraso puesto en 8 y unos segundos mas de
   margen, el saque siempre esta ahi. */
function ultimo(){
  if (!V) return;
  var t = V.currentTime - (CFG.retro || 9);
  var piso = 0;
  try { if (V.buffered && V.buffered.length) piso = V.buffered.start(0); } catch(e){}
  try { V.pause(); V.currentTime = Math.max(piso, t); } catch(e){}
  limpiar();
  est('rebobinado ' + (CFG.retro || 9) + ' s — buscá el golpe con ◀ ▶');
}

/* ── marcar ───────────────────────────────────────────────────────────── */
function marcar(cual){
  var c = cuadroActual();
  if (c == null){ aviso('Falta saber los cuadros por segundo.', true); return; }
  if (cual === 1) MARCA.golpe = c; else MARCA.cruce = c;
  pintarMarcas(); calcular();
}
function limpiar(){ MARCA.golpe = MARCA.cruce = null; ULTIMA = null; pintarMarcas(); calcular(); }
function pintarMarcas(){
  var a = MARCA.golpe, b = MARCA.cruce;
  document.getElementById('rdr-m1v').textContent = a == null ? '—' : ('cuadro ' + a);
  document.getElementById('rdr-m2v').textContent = b == null ? '—' : ('cuadro ' + b);
  document.getElementById('rdr-m1').className = 'm' + (a != null ? ' on' : '');
  document.getElementById('rdr-m2').className = 'm' + (b != null ? ' on' : '');
}

/* ── la cuenta: toda del motor, ninguna formula aca ───────────────────── */
function calcular(){
  var kmh = document.getElementById('rdr-kmh'), sub = document.getElementById('rdr-sub');
  if (MARCA.golpe == null || MARCA.cruce == null || !(FPS > 0)){
    ULTIMA = null;
    kmh.innerHTML = '—<small>km/h</small>';
    sub.textContent = 'marcá el golpe y el cruce de red';
    return;
  }
  var cuadros = MARCA.cruce - MARCA.golpe;
  if (cuadros <= 0){
    ULTIMA = null;
    kmh.innerHTML = '—<small>km/h</small>';
    sub.textContent = 'el cruce va DESPUÉS del golpe';
    aviso('Las dos marcas están al revés: primero el golpe, después la red.', true);
    return;
  }
  var r = R.recorrido(CFG);
  var v = R.velocidad({ d:r.d, cuadros:cuadros, fps:FPS, cd:CFG.cd,
                        altitud:CFG.altitud, temp:CFG.temp });
  if (!v) return;
  ULTIMA = v;
  kmh.innerHTML = v.kmh.toFixed(1) + '<small>km/h</small>';
  sub.textContent = '± ' + v.err.toFixed(1) + '  ·  ' + cuadros + ' cuadros  ·  '
                  + Math.round(v.t * 1000) + ' ms  ·  ' + r.d.toFixed(2) + ' m';
  if (cuadros < 8)
    aviso('Solo ' + cuadros + ' cuadros de vuelo: un cuadro de error ya mueve el resultado un '
        + Math.round(100 / cuadros) + '%. Tomalo como orientativo.', true);
  else
    aviso('Media del vuelo ' + v.media.toFixed(1) + ' km/h; en el golpe salía a '
        + v.kmh.toFixed(1) + '. La diferencia es lo que le come el aire.');
}

/* ── guardar ──────────────────────────────────────────────────────────── */
function cargarPlantel(){
  var sel = document.getElementById('rdr-quien');
  var h = '<option value="">— sin jugador —</option>';
  var P = global.PLANTEL_NAFELS;
  if (P && P.jugadores) P.jugadores.forEach(function(j){
    h += '<option value="' + j.num + '|' + j.ap + '">#' + j.num + ' ' + j.ap + '</option>'; });
  sel.innerHTML = h;
}
function leerReg(){ try{ return JSON.parse(localStorage.getItem(CLAVE) || '[]') || []; }catch(e){ return []; } }
function guardar(){
  if (!ULTIMA){ aviso('Todavía no hay una medición para guardar.', true); return; }
  var q = (document.getElementById('rdr-quien').value || '|').split('|');
  var reg = leerReg();
  var fila = { fecha:new Date().toISOString(), num:q[0]||'', ap:q[1]||'',
               nota:document.getElementById('rdr-nota').value || '',
               kmh:+ULTIMA.kmh.toFixed(1), err:+ULTIMA.err.toFixed(1),
               ms:Math.round(ULTIMA.t*1000), cuadros:ULTIMA.cuadros,
               d:+ULTIMA.d.toFixed(2), media:+ULTIMA.media.toFixed(1),
               cd:+ULTIMA.cd.toFixed(3), fps:ULTIMA.fps, origen:'vivo' };
  reg.unshift(fila);
  try{ localStorage.setItem(CLAVE, JSON.stringify(reg)); }catch(e){}

  /* Si el scouting en vivo esta andando en esta misma pantalla, se le pega
     la velocidad al ULTIMO saque que se codifico. Asi el km/h no queda en
     una planilla aparte: viaja con la accion. */
  var pegado = pegarAlScouting(fila);
  document.getElementById('rdr-nota').value = '';
  limpiar(); pintarLista();
  est('guardado' + (pegado ? ' y pegado al saque codificado' : ''));
}
function pegarAlScouting(fila){
  try {
    if (!global.SCOUT || typeof global.SCOUT.acciones !== 'function') return false;
    var acc = global.SCOUT.acciones();
    if (!acc || !acc.length) return false;
    for (var i = acc.length - 1; i >= 0; i--){
      if (acc[i] && acc[i].k === 'S'){
        if (fila.num && String(acc[i].c) !== String(fila.num)) return false;  /* no es ese saque */
        acc[i].kmh = fila.kmh;
        acc[i].kmh_err = fila.err;
        return true;
      }
    }
  } catch(e){}
  return false;
}
function pintarLista(){
  var reg = leerReg(), e = document.getElementById('rdr-lista');
  if (!e) return;
  if (!reg.length){ e.innerHTML = '<div style="color:#475569;border:none">Todavía ninguno.</div>'; return; }
  e.innerHTML = reg.slice(0, 14).map(function(m){
    return '<div><span>' + (m.ap ? ('#' + m.num + ' ' + m.ap) : '—')
         + (m.nota ? (' <span style="color:#475569">' + String(m.nota).replace(/[<>&]/g,'') + '</span>') : '')
         + '</span><b>' + m.kmh.toFixed(1) + '</b></div>';
  }).join('');
}

/* ── teclado: SOLO cuando esta abierto y fuera de los campos ──────────────
   En esta pantalla se scoutea escribiendo. Un radar que se quede con las
   teclas hace mas dano del que arregla. */
document.addEventListener('keydown', function(ev){
  var t = (ev.target.tagName || '').toLowerCase();
  var escribiendo = (t === 'input' || t === 'select' || t === 'textarea' || ev.target.isContentEditable);
  if (!ABIERTO){
    /* R abre el radar, pero nunca mientras se escribe un codigo */
    if (!escribiendo && (ev.key === 'r' || ev.key === 'R') && !ev.ctrlKey && !ev.metaKey && !ev.altKey){
      abrir(); ev.preventDefault();
    }
    return;
  }
  if (ev.key === 'Escape'){ cerrar(); ev.preventDefault(); return; }
  if (escribiendo) return;
  if (ev.key === '1'){ marcar(1); ev.preventDefault(); }
  else if (ev.key === '2'){ marcar(2); ev.preventDefault(); }
  else if (ev.key === 'ArrowLeft'){ mover(ev.shiftKey ? -10 : -1); ev.preventDefault(); }
  else if (ev.key === 'ArrowRight'){ mover(ev.shiftKey ? 10 : 1); ev.preventDefault(); }
  else if (ev.key === 'Enter'){ guardar(); ev.preventDefault(); }
  else if (ev.key === 'u' || ev.key === 'U'){ ultimo(); ev.preventDefault(); }
}, true);

/* ── arranque ─────────────────────────────────────────────────────────── */
function arrancar(){
  if (document.getElementById('rdr')) return;
  montar();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
else arrancar();

global.VB_RADAR_VIVO = { abrir:abrir, cerrar:cerrar, alternar:alternar, marcar:marcar,
                         mover:mover, limpiar:limpiar, guardar:guardar, ultimo:ultimo,
                         irA:irACuadro, cuadro:cuadroActual };
})(window);
