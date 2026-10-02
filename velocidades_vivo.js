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
var DESDE  = null;    /* cuantos saques ya habia cuando se abrio la pantalla */
var ATRAS  = false;   /* true = tambien se miden los que ya estaban */
var ELEGIDO= null;    /* i de un saque marcado a mano, para el proximo numero */
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

  /* ══ LA LINEA DE LARGADA ═══════════════════════════════════════════════
     Cuando esta pantalla se abre a mitad del entrenamiento, el panel ya tiene
     cargados todos los saques de antes —en la primera prueba eran SETENTA—.
     Sin esta marca, el primer numero que se tipeaba se le pegaba al saque 1,
     el de hace una hora, porque la cola reparte desde el mas viejo sin
     velocidad. Y el jugador que estaba sacando en ese momento se quedaba sin
     el suyo.

     Asi que lo que ya estaba cuando se abrio NO entra en el reparto: queda a
     la vista, en gris, y si de verdad se los quiere medir hay un boton que
     los abre. Lo normal es que no: esos saques ya pasaron. */
  if (DESDE === null) DESDE = nuevos.length;

  SAQUES = nuevos;
  repartir();
  guardar();
  pintar();
}

/* ── darle a cada saque sin velocidad la primera que esta esperando ───── */
function repartir(){
  /* un saque marcado a mano se lleva el proximo numero, pase lo que pase */
  if (ELEGIDO !== null && COLA.length){
    for (var e = 0; e < SAQUES.length; e++){
      if (SAQUES[e].i === ELEGIDO){ poner(SAQUES[e], COLA.shift()); break; }
    }
    ELEGIDO = null;
  }
  var inicio = (ATRAS || DESDE === null) ? 0 : DESDE;
  for (var i = inicio; i < SAQUES.length && COLA.length; i++){
    if (SAQUES[i].kmh != null) continue;
    poner(SAQUES[i], COLA.shift());
  }
}
function poner(s, v){
  if (v.sinMedir){ s.kmh = 0; s.sinMedir = true; }
  else { s.kmh = v.kmh; s.sinMedir = false; }
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

/* ── DE QUIEN VA A SER EL QUE VIENE ───────────────────────────────────────
   No hace falta cargar a mano quienes estan ni cuantos saca cada uno: la
   rueda se lee sola de lo que ya paso. En la tanda de saque los jugadores se
   turnan, asi que si los ultimos fueron 5 10 3 7 17 13 y antes tambien fueron
   5 10 3 7 17 13, el que viene es el 5.

   Es una AYUDA para que el entrenador se de cuenta si se desincronizo, no una
   decision: la velocidad se le pega igual al saque que publique el panel, se
   haya adivinado bien o mal. Si la rueda no se repite, no se muestra nada. */
function proximo(){
  var n = SAQUES.length;
  if (n < 4) return null;
  var ult = SAQUES.map(function(s){ return s.num; });
  for (var L = 3; L <= 8; L++){
    if (n < L * 2) break;
    var ok = true;
    for (var k = 0; k < L; k++){
      if (ult[n-1-k] !== ult[n-1-k-L]){ ok = false; break; }
    }
    if (ok){
      var num = ult[n-L];
      return { num:num, ap: APE[String(num)] || '' };
    }
  }
  return null;
}

/* ══ PINTAR ══════════════════════════════════════════════════════════════ */
/* ── FLOTANTE Y POTENCIA SON DOS SAQUES DISTINTOS ─────────────────────────
   El quinto caracter del codigo dice con que saco: M y H son flotante, Q y T
   potencia. Juntarlos en un solo promedio no sirve: un jugador que flota a 60
   y salta a 95 queda con un 77 que no describe ninguno de los dos saques.   */
var TIPO = { M:'flo', H:'flo', Q:'pot', T:'pot' };
var TIPO_NOM = { flo:'Flotante', pot:'Potencia', otro:'Otro' };
function tipoDe(t){ return TIPO[t] || 'otro'; }

var VALS = ['#', '+', '!', '-', '/', '='];
var CLASE = {'#':'val1','+':'val2','!':'val3','-':'val4','/':'val5','=':'val6'};

function pintar(){
  pintarCola(); pintarLista(); pintarTabla(); pintarDetalle(); pintarProximo();
}
function pintarProximo(){
  var e = document.getElementById('viene'); if (!e) return;
  if (ELEGIDO !== null){
    var el = null;
    for (var k = 0; k < SAQUES.length; k++) if (SAQUES[k].i === ELEGIDO) el = SAQUES[k];
    e.innerHTML = el ? ('<b class="marc">el próximo número va al saque de <u>' + el.num + ' '
                        + (el.ap || '') + '</u></b>') : '';
    return;
  }
  var p = proximo();
  e.innerHTML = p ? ('deberia sacar <b>' + p.num + ' ' + (p.ap || '') + '</b>') : '';
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
    var viejo = (!ATRAS && DESDE !== null && SAQUES.indexOf(s) < DESDE);
    var kk = s.sinMedir ? '<span class="k no">sin medir</span>'
           : (s.kmh != null ? '<span class="k">' + n1(s.kmh) + '<s>km/h</s></span>'
                            : '<span class="k no">' + (viejo ? 'de antes' : '—') + '</span>');
    return '<div class="sq' + (k === 0 ? ' nuevo' : '') + (viejo ? ' viejo' : '')
         + (s.i === ELEGIDO ? ' marcado' : '') + '" data-i="' + s.i + '">'
         + '<span class="n">' + (s.num >= 0 ? s.num : '?') + '</span>'
         + '<span class="ap">' + (s.ap || '') + '</span>'
         + '<span class="v ' + (CLASE[s.val] || '') + '">' + (s.val || '') + '</span>'
         + kk + '</div>';
  }).join('');
  var c = document.getElementById('cnt');
  if (c){
    /* El denominador son los saques que ESTA pantalla tiene que medir: los que
       entraron desde que se abrio, mas cualquiera de los de antes que se haya
       medido a mano. Sin esta cuenta salia "2 de 1". */
    var base = (ATRAS || DESDE === null) ? 0 : DESDE;
    var con = 0, deben = SAQUES.length - base;
    SAQUES.forEach(function(s, k){
      var medido = (s.kmh != null && !s.sinMedir);
      if (medido) con++;
      if (medido && k < base) deben++;
    });
    c.textContent = con + ' de ' + deben + ' con velocidad'
                  + (base ? ('  ·  ' + base + ' de antes') : '');
  }
  var ba = document.getElementById('b-atras');
  if (ba) ba.style.display = (!ATRAS && DESDE) ? '' : 'none';
}
function pintarTabla(){
  var t = document.getElementById('tabla'); if (!t) return;
  var porJ = {};
  SAQUES.forEach(function(s){
    if (s.kmh == null || s.sinMedir || s.num < 0) return;
    var k = s.num;
    if (!porJ[k]) porJ[k] = { num:s.num, ap:s.ap, todo:{tot:[], v:{}}, tipos:{} };
    var J = porJ[k], tp = tipoDe(s.tipo);
    if (!J.tipos[tp]) J.tipos[tp] = { tot:[], v:{} };
    J.todo.tot.push(s.kmh);
    (J.todo.v[s.val] = J.todo.v[s.val] || []).push(s.kmh);
    J.tipos[tp].tot.push(s.kmh);
    (J.tipos[tp].v[s.val] = J.tipos[tp].v[s.val] || []).push(s.kmh);
  });
  var filas = Object.keys(porJ).map(function(k){ return porJ[k]; })
    .sort(function(a,b){ return a.num - b.num; });

  var h = '<tr><th class="izq">Jugador</th><th>Saque</th><th class="gen">General</th>'
        + VALS.map(function(v){
            return '<th class="' + CLASE[v] + '">' + (v === '=' ? 'error' : v) + '</th>'; }).join('')
        + '</tr>';
  if (!filas.length){
    h += '<tr><td colspan="9" class="izq" style="color:#475569">Cuando entre el primer saque con velocidad aparece acá.</td></tr>';
    t.innerHTML = h; return;
  }
  filas.forEach(function(f){
    var tps = Object.keys(f.tipos);
    /* la fila TODOS solo tiene sentido si el jugador saco de las dos formas:
       con un solo tipo repetiria exactamente la misma linea */
    var lineas = [];
    if (tps.length > 1) lineas.push({ nom:'Todos', d:f.todo, fuerte:true });
    tps.sort().forEach(function(tp){ lineas.push({ nom:TIPO_NOM[tp], d:f.tipos[tp], fuerte:(tps.length === 1) }); });

    lineas.forEach(function(L, k){
      h += '<tr class="' + (k === 0 ? 'primera' : '') + (L.fuerte ? ' fuerte' : '') + '">';
      h += '<td class="izq j">' + (k === 0 ? ('<b>' + f.num + '</b>' + (f.ap || '')) : '') + '</td>';
      h += '<td class="tp">' + L.nom + '</td>';
      h += celda(L.d.tot, 'gen');
      VALS.forEach(function(v){ h += celda(L.d.v[v] || [], ''); });
      h += '</tr>';
    });
  });
  t.innerHTML = h;
}
function celda(a, cls){
  if (!a || !a.length) return '<td class="vacio ' + cls + '">·</td>';
  var m = mediana(a), flojo = a.length < 3;
  return '<td class="' + cls + '"><span class="kk"' + (flojo ? ' style="color:#64748B"' : '') + '>'
       + n1(m) + '</span><span class="nn">' + a.length + '</span></td>';
}

/* ── SAQUE POR SAQUE ──────────────────────────────────────────────────────
   La tabla de arriba resume; esto muestra el detalle, que es lo que sirve
   para mirar con el jugador al lado: cada saque suyo en orden, con cuanto
   salio, como salio y con que saque lo hizo. La F y la P chiquitas distinguen
   flotante de potencia sin ocupar una columna. */
function pintarDetalle(){
  var e = document.getElementById('detalle'); if (!e) return;
  var porJ = {};
  SAQUES.forEach(function(s){
    if (s.kmh == null || s.sinMedir || s.num < 0) return;
    (porJ[s.num] = porJ[s.num] || { num:s.num, ap:s.ap, l:[] }).l.push(s);
  });
  var filas = Object.keys(porJ).map(function(k){ return porJ[k]; })
    .sort(function(a,b){ return a.num - b.num; });
  if (!filas.length){ e.innerHTML = '<div class="nada">Acá va cada saque, uno por uno.</div>'; return; }
  e.innerHTML = filas.map(function(f){
    var vs = f.l.map(function(s){ return s.kmh; });
    return '<div class="dj">'
      + '<div class="dj-cab"><b>' + f.num + '</b><span>' + (f.ap || '') + '</span>'
      + '<em>' + f.l.length + (f.l.length === 1 ? ' saque' : ' saques')
      + ' · mediana ' + n1(mediana(vs)) + ' · máx ' + n1(Math.max.apply(null, vs)) + '</em></div>'
      + '<div class="dj-l">' + f.l.map(function(s){
          return '<i class="' + (CLASE[s.val] || '') + '" title="' + (s.val || '') + '">'
               + n1(s.kmh) + '<u>' + (tipoDe(s.tipo) === 'pot' ? 'P' : (tipoDe(s.tipo) === 'flo' ? 'F' : '')) + '</u>'
               + '<s>' + (s.val || '') + '</s></i>'; }).join('')
      + '</div></div>';
  }).join('');
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
  /* ── MARCAR UN SAQUE A MANO ──────────────────────────────────────────
     La cola va en orden y eso cubre el 99% del tiempo. Pero si por lo que sea
     se desacomoda —mediste uno y entraron dos— tocando el renglon se le pone
     el proximo numero a ESE saque, sin tener que vaciar nada. */
  var lista = document.getElementById('lista');
  if (lista) lista.addEventListener('click', function(ev){
    var fila = ev.target; 
    while (fila && fila !== lista && !fila.hasAttribute('data-i')) fila = fila.parentNode;
    if (!fila || fila === lista) return;
    var i = parseInt(fila.getAttribute('data-i'), 10);
    ELEGIDO = (ELEGIDO === i) ? null : i;
    repartir(); guardar(); pintar();
    var k = document.getElementById('kmh'); if (k) k.focus();
  });

  var ba = document.getElementById('b-atras');
  if (ba) ba.addEventListener('click', function(){
    ATRAS = true; repartir(); guardar(); pintar();
    var k = document.getElementById('kmh'); if (k) k.focus();
  });

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
                    estado:function(){ return { saques:SAQUES, cola:COLA, desde:DESDE, elegido:ELEGIDO }; } };

})(window);
