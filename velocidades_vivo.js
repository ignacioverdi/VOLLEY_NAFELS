/* ============================================================================
   velocidades_vivo.js — LA VELOCIDAD DEL SAQUE, PEGADA AL SAQUE, EN VIVO
   ----------------------------------------------------------------------------
   DOS PERSONAS, DOS COMPUTADORAS, UNA SOLA VERDAD

   El asistente scoutea en panel_vivo.html. El entrenador lee la pistola y
   tipea el numero aca. Las dos pantallas estan unidas por Firebase: el panel
   publica en 'voley_codes' cada vez que entra una accion —cada 60 ms— y esta
   pagina escucha ese mismo lugar. Es el camino que ya usa
   plan_partido_vivo.js para llenar el Plan de Partido mientras el otro
   scoutea, asi que no se inventa nada: se le cuelga a algo que ya anda.

   POR QUE NO HAY NADA QUE EMPAREJAR
   ---------------------------------
   Cuando el asistente tipea 's04SM-' eso ES el saque: dorsal 04, tipo M,
   valoracion '-'. Llega con su posicion en la lista. La velocidad se le pega
   a ESE, por identidad. No se cruza por hora, ni por orden, ni por jugador.
   No hay nada que estimar y por lo tanto no hay nada que pueda fallar.

   EL ORDEN REAL DE LAS COSAS
   --------------------------
   El entrenador SIEMPRE va adelante: lee la pistola apenas pica la pelota,
   mientras el asistente todavia esta terminando de tipear el saque y la
   recepcion. Asi que la velocidad llega PRIMERO y el saque despues.

   Por eso el numero no se guarda: se pone en una COLA. Cuando entra un saque
   nuestro, se le cuelga la primera velocidad que estaba esperando. Si pican
   dos saques seguidos y el entrenador tipea los dos antes de que entre
   ninguno, la cola los reparte en orden.

   LO QUE LA COLA NO HACE
   ----------------------
   No adivina. Una velocidad que lleva mas de DOS MINUTOS esperando se marca
   en ambar: lo mas probable es que ese saque no se haya cargado nunca —el
   asistente lo deshizo, o se corto la conexion— y colgarsela al saque que
   venga seria ponerle a un jugador la velocidad de otro. Se queda a la vista
   hasta que el entrenador la tire o la pantalla la enganche.

   SI EL ASISTENTE DESHACE
   -----------------------
   El panel saca la accion de la lista. Aca se nota porque el codigo guardado
   ya no esta en esa posicion: la velocidad se suelta y vuelve a la cola, en
   vez de quedar pegada a la accion equivocada.

   SIN SENAL
   ---------
   El gimnasio puede no tener internet —el panel esta hecho para eso—. Si el
   stream no abre, la pantalla lo dice y guarda todo con la hora de cada
   numero. Despues se cruza con el scout por reloj + dorsal + orden.
   ========================================================================== */
(function (global) {
'use strict';

var ESPERA_AMBAR = 120000;   /* ms que puede esperar una velocidad antes de dudar */
var LS_KEY = 'vel_vivo_v1';

var SAQUES = [];      /* [{i, c, num, ap, tipo, val, set, t, kmh}] los saques nuestros */
var COLA   = [];      /* [{kmh, ts}] velocidades esperando saque */
var CODES  = [];      /* la ultima lista cruda recibida */
var LADO   = null;    /* '*' o 'a': cual de los dos lados es el nuestro */
var ULTIMO = null;    /* para deshacer: {tipo:'pega'|'cola', ...} */

/* ── los jugadores, para poner el apellido ────────────────────────────── */
function plantel(){
  var P = global.PLANTEL_NAFELS;
  var m = {};
  if (P && P.jugadores) P.jugadores.forEach(function(j){ m[String(j.num)] = j.ap || ''; });
  return m;
}
var APE = {};

/* ── leer un codigo ───────────────────────────────────────────────────────
   Formato DataVolley, el mismo que parsea plan_partido_vivo.js:
     *  04  S  M  -
     |   |  |  |  +-- valoracion:  # + ! - / =
     |   |  |  +----- tipo: M flotante · Q/T potencia · H
     |   |  +-------- fundamento: S saque, R recepcion, A ataque...
     |   +----------- dorsal
     +--------------- lado: '*' local, 'a' visitante                        */
function esSaque(c){ return typeof c === 'string' && c.length >= 6 && c[3] === 'S'; }
function leer(c, i, row){
  var num = parseInt(c.slice(1, 3), 10);
  return { i:i, c:c, num:isNaN(num) ? -1 : num, lado:c[0],
           ap: APE[String(num)] || '', tipo:c[4] || '', val:c[5] || '',
           set:(row && row.set) || '', t:(row && row.t) || 0, kmh:null };
}

/* ── cual lado es el nuestro ──────────────────────────────────────────────
   En un entrenamiento los dos lados son el club, asi que da igual y se toman
   los dos. En un partido se elige el lado cuyos dorsales coinciden con el
   plantel: es mas confiable que el nombre del equipo, que el scout escribe a
   mano y a veces viene como "PRUEBA".                                     */
function elegirLado(codes){
  var cuenta = {'*':0, 'a':0}, tot = {'*':0, 'a':0};
  codes.forEach(function(row){
    var c = (row.c || '').trim();
    if (c.length < 4) return;
    var l = c[0]; if (l !== '*' && l !== 'a') return;
    var n = parseInt(c.slice(1, 3), 10);
    tot[l]++;
    if (!isNaN(n) && APE[String(n)]) cuenta[l]++;
  });
  var p = {'*': tot['*'] ? cuenta['*']/tot['*'] : 0, 'a': tot['a'] ? cuenta['a']/tot['a'] : 0};
  /* si los dos lados son nuestros (entrenamiento), no se filtra */
  if (p['*'] > 0.6 && p['a'] > 0.6) return null;
  if (p['*'] >= p['a'] && p['*'] > 0.3) return '*';
  if (p['a'] > p['*'] && p['a'] > 0.3) return 'a';
  return null;
}

/* ── llega una lista nueva de codigos ─────────────────────────────────── */
function alLlegar(d){
  if (!d || !d.codes || !d.codes.length) return;
  CODES = d.codes;
  APE = plantel();
  LADO = elegirLado(CODES);

  var nuevos = [];
  CODES.forEach(function(row, i){
    var c = (row.c || '').trim();
    if (!esSaque(c)) return;
    if (LADO && c[0] !== LADO) return;
    nuevos.push(leer(c, i, row));
  });

  /* ══ LO QUE YA TENIA VELOCIDAD, LA CONSERVA ═══════════════════════════
     Se busca por POSICION Y CODIGO a la vez. Si el asistente deshizo una
     accion, la lista se corrio y en esa posicion hay otro codigo: entonces
     esa velocidad NO es de este saque y se suelta, en vez de quedar pegada
     al que no es. */
  var viejos = {};
  SAQUES.forEach(function(s){ if (s.kmh != null) viejos[s.i + '|' + s.c] = s.kmh; });
  var sueltas = [];
  var vistos = {};
  nuevos.forEach(function(s){
    var k = s.i + '|' + s.c;
    if (viejos[k] != null){ s.kmh = viejos[k]; vistos[k] = 1; }
  });
  Object.keys(viejos).forEach(function(k){
    if (!vistos[k]) sueltas.push({ kmh: viejos[k], ts: Date.now() });
  });
  if (sueltas.length) COLA = sueltas.concat(COLA);

  SAQUES = nuevos;
  repartir();
  guardar();
  pintar();
}

/* ── darle a cada saque sin velocidad la primera que esta esperando ───── */
function repartir(){
  for (var i = 0; i < SAQUES.length && COLA.length; i++){
    if (SAQUES[i].kmh != null) continue;
    var v = COLA.shift();
    if (v.sinMedir){ SAQUES[i].kmh = 0; SAQUES[i].sinMedir = true; }
    else SAQUES[i].kmh = v.kmh;
  }
}

/* ── guardar: Firebase para que quede con la sesion, y local por las dudas ── */
function guardar(){
  var v = {};
  SAQUES.forEach(function(s){ if (s.kmh != null && !s.sinMedir) v[s.i] = { c:s.c, kmh:s.kmh }; });
  var paq = { ts:new Date().toISOString(), v:v,
              cola: COLA.map(function(x){ return { kmh:x.kmh, ts:x.ts, sinMedir:!!x.sinMedir }; }) };
  try { localStorage.setItem(LS_KEY, JSON.stringify(paq)); } catch(e){}
  try { if (typeof global.fbSet === 'function') global.fbSet('voley_kmh', paq); } catch(e){}
}
function recuperar(){
  try {
    var p = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (p && p.cola && p.cola.length) COLA = p.cola.slice();
  } catch(e){}
}

/* ── la mediana, no el promedio ───────────────────────────────────────────
   Un saque mal medido —la pistola agarro a alguien caminando— mueve el
   promedio de la fila entera. La mediana no se entera.                    */
function mediana(a){
  if (!a.length) return null;
  var b = a.slice().sort(function(x,y){ return x-y; });
  var m = b.length >> 1;
  return b.length % 2 ? b[m] : (b[m-1] + b[m]) / 2;
}
function n1(v){ return (Math.round(v*10)/10).toString().replace('.', ','); }

/* ══ PINTAR ══════════════════════════════════════════════════════════════ */
var VALS = ['#', '+', '!', '-', '/', '='];
var CLASE = {'#':'val1','+':'val2','!':'val3','-':'val4','/':'val5','=':'val6'};

function pintar(){
  pintarCola(); pintarLista(); pintarTabla();
}
function pintarCola(){
  var e = document.getElementById('cola'); if (!e) return;
  var ahora = Date.now();
  e.innerHTML = COLA.map(function(v){
    var viejo = (ahora - v.ts) > ESPERA_AMBAR;
    return '<i class="' + (viejo ? 'viejo' : '') + '">'
         + (v.sinMedir ? '—' : n1(v.kmh)) + '</i>';
  }).join('');
  var p = document.getElementById('pend');
  if (p) p.textContent = COLA.length ? (COLA.length + (COLA.length === 1 ? ' esperando saque' : ' esperando saque')) : '';
}
function pintarLista(){
  var e = document.getElementById('lista'); if (!e) return;
  var ult = SAQUES.slice(-14).reverse();
  if (!ult.length){ e.innerHTML = '<div style="padding:15px;color:#475569">Todavía no entró ningún saque.</div>'; return; }
  e.innerHTML = ult.map(function(s, k){
    var kk = s.sinMedir ? '<span class="k no">sin medir</span>'
           : (s.kmh != null ? '<span class="k">' + n1(s.kmh) + '<s>km/h</s></span>'
                            : '<span class="k no">—</span>');
    return '<div class="sq' + (k === 0 ? ' nuevo' : '') + '">'
         + '<span class="n">' + (s.num >= 0 ? s.num : '?') + '</span>'
         + '<span class="ap">' + (s.ap || '') + '</span>'
         + '<span class="v ' + (CLASE[s.val] || '') + '">' + (s.val || '') + '</span>'
         + kk + '</div>';
  }).join('');
  var c = document.getElementById('cnt');
  if (c){
    var con = SAQUES.filter(function(s){ return s.kmh != null && !s.sinMedir; }).length;
    c.textContent = con + ' de ' + SAQUES.length + ' con velocidad';
  }
}
function pintarTabla(){
  var t = document.getElementById('tabla'); if (!t) return;
  var porJ = {};
  SAQUES.forEach(function(s){
    if (s.kmh == null || s.sinMedir || s.num < 0) return;
    var k = s.num;
    if (!porJ[k]) porJ[k] = { num:s.num, ap:s.ap, v:{} };
    (porJ[k].v[s.val] = porJ[k].v[s.val] || []).push(s.kmh);
  });
  var filas = Object.keys(porJ).map(function(k){ return porJ[k]; })
    .sort(function(a,b){ return a.num - b.num; });
  var h = '<tr><th>Jugador</th>' + VALS.map(function(v){
        return '<th class="' + CLASE[v] + '">' + (v === '=' ? 'error' : v) + '</th>'; }).join('') + '</tr>';
  if (!filas.length){
    h += '<tr><td colspan="7" style="color:#475569;text-align:left">Cuando entre el primer saque con velocidad aparece acá.</td></tr>';
  }
  filas.forEach(function(f){
    h += '<tr><td class="j"><b>' + f.num + '</b>' + (f.ap || '') + '</td>';
    VALS.forEach(function(v){
      var a = f.v[v] || [];
      if (!a.length){ h += '<td class="vacio">·</td>'; return; }
      var m = mediana(a);
      var flojo = a.length < 3;
      h += '<td><span class="kk"' + (flojo ? ' style="color:#64748B"' : '') + '>' + n1(m) + '</span>'
         + '<span class="nn">' + a.length + '</span></td>';
    });
    h += '</tr>';
  });
  t.innerHTML = h;
}

/* ══ TECLADO Y BOTONES ═══════════════════════════════════════════════════ */
function encolar(kmh, sinMedir){
  COLA.push({ kmh:kmh, ts:Date.now(), sinMedir:!!sinMedir });
  ULTIMO = { tipo:'cola' };
  repartir(); guardar(); pintar();
}
function deshacer(){
  /* primero se saca de la cola; si no hay nada esperando, se despega la
     ultima velocidad que si quedo pegada a un saque */
  if (COLA.length){ COLA.pop(); ULTIMO = null; guardar(); pintar(); return; }
  for (var i = SAQUES.length - 1; i >= 0; i--){
    if (SAQUES[i].kmh != null){ SAQUES[i].kmh = null; SAQUES[i].sinMedir = false;
      guardar(); pintar(); return; }
  }
}
function arrancar(){
  APE = plantel();
  recuperar();
  pintar();

  var inp = document.getElementById('kmh');
  if (inp){
    inp.focus();
    inp.addEventListener('keydown', function(ev){
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      var txt = (inp.value || '').trim().replace(',', '.');
      var v = parseFloat(txt);
      inp.value = '';
      if (!isFinite(v) || v <= 0 || v > 200){ aviso('Ese número no es una velocidad.'); return; }
      encolar(v, false);
      aviso('');
    });
  }
  var bs = document.getElementById('b-sin');
  if (bs) bs.addEventListener('click', function(){ encolar(0, true); if (inp) inp.focus(); });
  var bu = document.getElementById('b-undo');
  if (bu) bu.addEventListener('click', function(){ deshacer(); if (inp) inp.focus(); });
  var bb = document.getElementById('b-borrar');
  if (bb) bb.addEventListener('click', function(){
    if (!COLA.length) return;
    if (!confirm('¿Tirar las ' + COLA.length + ' velocidades que están esperando saque?')) return;
    COLA = []; guardar(); pintar(); if (inp) inp.focus();
  });

  /* el reloj de la cola: lo que espera mucho se pone ambar solo */
  setInterval(pintarCola, 5000);

  conectar();
}
function aviso(t){
  var e = document.getElementById('pista');
  if (e) e.innerHTML = t || 'Escribí el número y Enter. No esperes a que entre el saque.';
}
function estado(txt, clase){
  var p = document.getElementById('pt'), e = document.getElementById('est');
  if (p) p.className = 'punto' + (clase ? ' ' + clase : '');
  if (e) e.textContent = txt;
}
function conectar(){
  if (typeof global.fbStream !== 'function'){
    estado('sin conexión con el panel — se guarda igual', 'no');
    return;
  }
  var corte = global.fbStream('voley_codes', function(d){
    estado('conectado al panel', 'on');
    try { alLlegar(d); } catch(e){ try{ console.error('[vel]', e); }catch(_){} }
  });
  if (!corte) estado('sin conexión con el panel — se guarda igual', 'no');
  else estado('esperando el panel…', '');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
else arrancar();

/* para poder probarla sin panel y sin Firebase */
global.VEL_VIVO = { alLlegar:alLlegar, encolar:encolar, deshacer:deshacer,
                    estado:function(){ return { saques:SAQUES, cola:COLA }; } };

})(window);
