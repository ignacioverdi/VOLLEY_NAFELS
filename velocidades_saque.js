/* ============================================================================
   velocidades_saque.js — LA VELOCIDAD DEL SAQUE, ACUMULADA
   ----------------------------------------------------------------------------
   La pantalla velocidades_vivo.html muestra lo de HOY, mientras se entrena.
   Esto muestra lo de SIEMPRE: todas las sesiones cargadas, por jugador.

   DE DONDE SALE EL DATO
   ---------------------
   De ningun lado nuevo. Ya esta en plan_partido_data.js, que es lo que arma
   gen_plan_partido.py: cada jugador tiene sus saques uno por uno y, cuando se
   midio, el km/h viene pegado en la fila.

       PP_DATA.<club>.players[]  con role 'saque'
       .data[] = [tipo, zona, destino, valoracion, rally, segundo, sesion, kmh]
                   0      1      2         3         4       5        6     7

   El octavo campo esta solo en los saques medidos. Hoy son los 240 del
   entrenamiento del 29 de septiembre.

   SE CARGA SOLO CUANDO SE MIRA
   ----------------------------
   plan_partido_data.js.enc pesa 710 KB. Cargarlo siempre en la pagina del
   jugador la hacia pasar de 300 KB a mas de un mega, para todos, miren el
   saque o no. Asi que se baja recien cuando se abre la seccion, y el que no
   la abre no paga nada.

   El truco del __D: abrirDatos() recorre TODOS los archivos cifrados que haya
   declarados y los vuelve a abrir. Si se lo llama de nuevo tal cual, vuelve a
   descifrar las baterias enteras al pedo. Por eso se le deja a la vista UN
   solo archivo mientras corre, y despues se le devuelve la lista completa.
   ========================================================================== */
(function (global) {
'use strict';

var ARCH = 'plan_partido_data.js';
var ENC  = 'plan_partido_data.js.enc';
var estado = 'nada';          /* nada | cargando | listo | error */
var esperando = [];

function clubPP(){
  var P = global.PP_DATA;
  if (!P) return null;
  /* el club es el unico que trae players con role 'saque' */
  var ks = Object.keys(P);
  for (var i = 0; i < ks.length; i++){
    var T = P[ks[i]];
    if (T && T.players && T.players.some(function(j){ return j.role === 'saque'; })) return T;
  }
  return null;
}

function hayDatos(){ return !!clubPP(); }

function pedirDatos(listo){
  if (hayDatos()){ listo(true); return; }
  esperando.push(listo);
  if (estado === 'cargando') return;
  estado = 'cargando';

  function abrir(){
    try {
      var todo = global.__D || {};
      if (!todo[ARCH]){ fin(false); return; }
      global.__D = {}; global.__D[ARCH] = todo[ARCH];
      try { global.abrirDatos(); } finally { global.__D = todo; }
      /* los archivos grandes se abren en segundo plano y avisan al terminar */
      if (hayDatos()){ fin(true); return; }
      var t0 = Date.now();
      var vigia = setInterval(function(){
        if (hayDatos()){ clearInterval(vigia); fin(true); }
        else if (Date.now() - t0 > 25000){ clearInterval(vigia); fin(false); }
      }, 250);
    } catch(e){ fin(false); }
  }
  function fin(ok){
    estado = ok ? 'listo' : 'error';
    var l = esperando; esperando = [];
    l.forEach(function(f){ try{ f(ok); }catch(e){} });
  }

  if (global.__D && global.__D[ARCH]) { abrir(); return; }
  var s = document.createElement('script');
  s.src = ENC;
  s.onload  = abrir;
  s.onerror = function(){ fin(false); };
  document.head.appendChild(s);
}

/* ── EL ESTILO VIAJA CON EL MODULO ────────────────────────────────────────
   Se mete solo la primera vez que se dibuja algo. Asi la misma tabla se puede
   colgar en el plan de desarrollo o en el dashboard sin copiar CSS en cada
   pagina, que es como se terminan viendo distinto en cada una. */
var CSS = ''
+ '.vs-foco{text-align:center;padding:16px 14px 4px}'
+ '.vs-num{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:62px;line-height:.9;color:#38BDF8;letter-spacing:-.02em}'
+ '.vs-num u{text-decoration:none;font-size:.26em;color:#7C8AA0;margin-left:5px;vertical-align:.3em;letter-spacing:0}'
+ '.vs-sub{margin:6px 0 0;font-size:15px;color:#94A3B8}'
+ '.vs-sub b{color:#E2E8F0}'
+ '.vs-cons{margin:12px auto 2px;max-width:560px;font-size:16.5px;line-height:1.42;color:#CBD5E1;'
+   'border-radius:11px;padding:10px 14px;border:1px solid}'
+ '.vs-cons b{color:#fff}'
+ '.vs-cons.bajar{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.35)}'
+ '.vs-cons.subir{background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.35)}'
+ '.vs-cons.igual{background:rgba(148,163,184,.08);border-color:rgba(148,163,184,.22)}'
+ 'table.vs-t{width:100%;border-collapse:collapse;font-size:16px;margin:14px 0 0;'
+   'font-family:"Barlow Condensed",system-ui,sans-serif;font-variant-numeric:tabular-nums}'
+ '.vs-t th,.vs-t td{padding:6px 8px;text-align:center;border-bottom:1px solid rgba(148,163,184,.07)}'
+ '.vs-t th{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#7C8AA0;font-weight:700}'
+ '.vs-t th.izq,.vs-t td.izq{text-align:left;padding-left:14px}'
+ '.vs-t tr.fuerte td .kk{color:#fff}'
+ '.vs-t td.j{color:#CBD5E1;white-space:nowrap}'
+ '.vs-t td.j b{font-family:Anton,sans-serif;color:#E8192C;margin-right:6px}'
+ '.vs-t td.tp{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#94A3B8;white-space:nowrap}'
+ '.vs-t tr.fuerte td.tp{color:#E2E8F0;font-weight:700}'
+ '.vs-t th.gen,.vs-t td.gen{background:rgba(148,163,184,.05)}'
+ '.vs-t th.gen{color:#CBD5E1}'
+ '.vs-t td .kk{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:19px;color:#F1F5F9;display:block;line-height:1}'
+ '.vs-t td.gen .kk{font-size:22px}'
+ '.vs-t td .nn{font-size:12px;color:#64748B}'
+ '.vs-t td.vacio{color:#2B3648}'
+ '.vs1{color:#4ADE80}.vs2{color:#86EFAC}.vs3{color:#CBD5E1}.vs4{color:#FBBF24}.vs5{color:#FB923C}.vs6{color:#F87171}'
+ '.vs-pie{margin:10px 14px 12px;font-size:13px;color:#64748B;line-height:1.5}'
+ '.vs-pie b{color:#94A3B8}'
+ '.vs-nada{padding:16px 14px;color:#475569;font-size:15px;line-height:1.5}'
+ '@media(max-width:560px){.vs-num{font-size:50px}.vs-t{font-size:14px}'
+   '.vs-t th,.vs-t td{padding:5px 4px}.vs-t td .kk{font-size:17px}}';
function estilo(){
  if (document.getElementById('vs-css')) return;
  var e = document.createElement('style'); e.id = 'vs-css'; e.textContent = CSS;
  document.head.appendChild(e);
}

/* ── los saques medidos de un jugador ────────────────────────────────── */
function limpiar(x){
  var t = String(x == null ? '' : x).toLowerCase().replace(/^\d+\s*/, '');
  if (t.normalize) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return t.trim();
}
function parecido(a, b){
  var x = limpiar(a), y = limpiar(b);
  if (!x || !y) return false;
  if (x === y) return true;
  return (x.length > y.length) ? x.indexOf(y) === 0 : y.indexOf(x) === 0;
}
function sacadores(){
  var T = clubPP();
  if (!T) return [];
  return T.players.filter(function(j){ return j.role === 'saque'; });
}
function deJugador(quien){
  var L = sacadores(), j = null;
  for (var i = 0; i < L.length; i++){
    if (quien != null && String(L[i].num) === String(quien)){ j = L[i]; break; }
    if (parecido(L[i].name, quien)){ j = L[i]; break; }
  }
  if (!j) return null;
  var filas = (j.data || []).filter(function(f){
    return f.length > 7 && typeof f[7] === 'number' && f[7] > 0;
  });
  return { num:j.num, name:j.name, saques:filas };
}

/* ── cuentas ─────────────────────────────────────────────────────────── */
function mediana(a){
  if (!a || !a.length) return null;
  var b = a.slice().sort(function(x,y){ return x-y; });
  var m = b.length >> 1;
  return b.length % 2 ? b[m] : (b[m-1] + b[m]) / 2;
}
function n1(v){ return (Math.round(v*10)/10).toString().replace('.', ','); }
function n0(v){ return String(Math.round(v)); }

var VALS = ['#', '+', '!', '-', '/', '='];
var CLASE = {'#':'vs1','+':'vs2','!':'vs3','-':'vs4','/':'vs5','=':'vs6'};
var TNOM  = { flo:'Flotante', pot:'Potencia', otro:'Otro' };

function agrupar(filas){
  var g = { tot:[], v:{}, tipos:{} };
  filas.forEach(function(f){
    var tp = f[0] || 'otro', val = f[3] || '', k = f[7];
    g.tot.push(k);
    (g.v[val] = g.v[val] || []).push(k);
    if (!g.tipos[tp]) g.tipos[tp] = { tot:[], v:{} };
    g.tipos[tp].tot.push(k);
    (g.tipos[tp].v[val] = g.tipos[tp].v[val] || []).push(k);
  });
  return g;
}

/* ══ LA FRASE QUE LE SIRVE AL SACADOR ═══════════════════════════════════════
   El numero por si solo no ensena nada. Lo que ensena es la comparacion entre
   la velocidad con la que mete el punto y la velocidad con la que la tira
   afuera. Si erra MAS RAPIDO de lo que acierta, se esta pasando de
   revoluciones y el camino es bajar un cambio. Si acierta mas rapido de lo
   que erra, el riesgo le esta rindiendo y puede apretar.

   Hace falta un minimo de saques de cada lado: con dos aces y un error esto
   diria cualquier cosa. */
function consejo(g){
  var ace = g.v['#'] || [], err = g.v['='] || [];
  if (ace.length < 4 || err.length < 4) return null;
  var a = mediana(ace), e = mediana(err), d = e - a;
  if (d >= 3)  return { tono:'bajar', txt:'Los que errás salen <b>' + n1(d) + ' km/h más rápido</b> que los que terminan en punto. Ahí hay saques de más.' };
  if (d <= -3) return { tono:'subir', txt:'Los que terminan en punto salen <b>' + n1(-d) + ' km/h más rápido</b> que los que errás. El riesgo te está rindiendo.' };
  return { tono:'igual', txt:'Metés punto y errás <b>a la misma velocidad</b>. Lo que define no es cuánto le pegás.' };
}

/* ══ LA FICHA DEL JUGADOR ════════════════════════════════════════════════ */
function pintarJugador(caja, quien){
  if (!caja) return;
  estilo();
  var J = deJugador(quien);
  if (!J || !J.saques.length){
    caja.innerHTML = '<div class="vs-nada">Todavía no hay saques tuyos con velocidad medida. '
                   + 'Aparecen solos en cuanto se cargue una sesión con la pistola.</div>';
    return;
  }
  var g = agrupar(J.saques);
  var med = mediana(g.tot), mx = Math.max.apply(null, g.tot);
  var c = consejo(g);

  var h = '<div class="vs-foco">'
        + '<div class="vs-num">' + n1(med) + '<u>km/h</u></div>'
        + '<p class="vs-sub">tu velocidad habitual &middot; máximo <b>' + n1(mx) + '</b>'
        + ' &middot; sobre ' + g.tot.length + ' saques medidos</p>'
        + (c ? '<p class="vs-cons ' + c.tono + '">' + c.txt + '</p>' : '')
        + '</div>';

  h += '<table class="vs-t"><tr><th class="izq">Saque</th><th class="gen">General</th>'
     + VALS.map(function(v){ return '<th class="' + CLASE[v] + '">' + (v === '=' ? 'error' : v) + '</th>'; }).join('')
     + '</tr>';
  var tps = Object.keys(g.tipos);
  var lineas = [];
  if (tps.length > 1) lineas.push({ nom:'Todos', d:g, fuerte:true });
  tps.sort().forEach(function(tp){ lineas.push({ nom:TNOM[tp] || tp, d:g.tipos[tp], fuerte:(tps.length === 1) }); });
  lineas.forEach(function(L){
    h += '<tr class="' + (L.fuerte ? 'fuerte' : '') + '"><td class="izq tp">' + L.nom + '</td>';
    h += celda(L.d.tot, 'gen');
    VALS.forEach(function(v){ h += celda(L.d.v[v] || [], ''); });
    h += '</tr>';
  });
  h += '</table>';
  h += '<p class="vs-pie">El número es la <b>mediana</b>: un saque mal medido no te mueve la fila. '
     + 'Debajo, sobre cuántos saques está hecho. Con menos de 3 va en gris.</p>';
  caja.innerHTML = h;
}
function celda(a, cls){
  if (!a || !a.length) return '<td class="vacio ' + cls + '">·</td>';
  var m = mediana(a), flojo = a.length < 3;
  return '<td class="' + cls + '"><span class="kk"' + (flojo ? ' style="color:#64748B"' : '') + '>'
       + n1(m) + '</span><span class="nn">' + a.length + '</span></td>';
}

/* ══ TODO EL PLANTEL, PARA EL CUERPO TECNICO ════════════════════════════ */
function pintarPlantel(caja){
  if (!caja) return;
  estilo();
  var L = sacadores().map(function(j){
    var f = (j.data || []).filter(function(x){ return x.length > 7 && typeof x[7] === 'number' && x[7] > 0; });
    return { num:j.num, name:j.name, g:agrupar(f), n:f.length };
  }).filter(function(x){ return x.n > 0; })
    .sort(function(a,b){ return (mediana(b.g.tot)||0) - (mediana(a.g.tot)||0); });

  if (!L.length){
    caja.innerHTML = '<div class="vs-nada">Todavía no hay saques con velocidad medida.</div>';
    return;
  }
  var h = '<table class="vs-t"><tr><th class="izq">Jugador</th><th class="gen">General</th>'
        + '<th>Flotante</th><th>Potencia</th><th class="vs1">en punto</th><th class="vs6">en error</th>'
        + '<th>Máx</th></tr>';
  L.forEach(function(x){
    var g = x.g;
    h += '<tr><td class="izq j"><b>' + x.num + '</b>' + (x.name || '') + '</td>';
    h += celda(g.tot, 'gen');
    h += celda((g.tipos.flo || {}).tot || [], '');
    h += celda((g.tipos.pot || {}).tot || [], '');
    h += celda(g.v['#'] || [], '');
    h += celda(g.v['='] || [], '');
    h += '<td><span class="kk">' + n1(Math.max.apply(null, g.tot)) + '</span></td></tr>';
  });
  h += '</table>';
  h += '<p class="vs-pie">Ordenado por velocidad habitual. <b>En punto</b> y <b>en error</b> son las dos '
     + 'columnas que más dicen: si un jugador erra más rápido de lo que acierta, está sacando de más.</p>';
  caja.innerHTML = h;
}

global.VEL_SAQUE = { pedirDatos:pedirDatos, hayDatos:hayDatos, deJugador:deJugador,
                     pintarJugador:pintarJugador, pintarPlantel:pintarPlantel,
                     mediana:mediana, sacadores:sacadores };

})(window);
