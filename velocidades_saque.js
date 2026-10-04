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

function tieneMedidos(T){
  return !!(T && T.players && T.players.some(function(j){
    return j.role === 'saque' && (j.data || []).some(function(f){
      return f.length > 7 && typeof f[7] === 'number' && f[7] > 0;
    });
  }));
}
function clubPP(){
  var P = global.PP_DATA;
  if (!P) return null;

  /* ══ DE QUE EQUIPO ESTAMOS HABLANDO ═══════════════════════════════════════
     Antes se agarraba "el primero que tenga jugadores con role 'saque'". Eso
     alcanza en el plan de desarrollo y en el dashboard, donde el unico que
     importa es el club. Pero plan_partido.html tiene cargados el club Y TODOS
     LOS RIVALES, y los rivales tambien traen jugadores con role 'saque': ahi
     "el primero" puede ser cualquiera, y la ficha terminaria leyendo la fila
     de un rival.

     Dos arreglos, ninguno de los dos cambia lo que ya funciona:

       1. si la pagina deja dicho el equipo en VEL_SAQUE_CLUB, se usa ese y
          no hay nada que adivinar;
       2. si no lo dice, se prefiere el equipo que REALMENTE tenga saques con
          velocidad medida. Antes, si el primero no tenia ninguna medicion, la
          ficha salia vacia aunque el club si las tuviera. */
  var pedido = global.VEL_SAQUE_CLUB;
  if (pedido && P[pedido] && P[pedido].players) return P[pedido];

  var ks = Object.keys(P), primero = null;
  for (var i = 0; i < ks.length; i++){
    var T = P[ks[i]];
    if (!(T && T.players && T.players.some(function(j){ return j.role === 'saque'; }))) continue;
    if (!primero) primero = T;
    if (tieneMedidos(T)) return T;
  }
  return primero;
}

function hayDatos(){ return !!clubPP(); }

function pedirDatos(listo){
  if (hayDatos()){ listo(true); return; }
  esperando.push(listo);
  if (estado === 'cargando') return;
  estado = 'cargando';

  /* ══ DE UNA, NO DE A PEDAZOS ═══════════════════════════════════════════
     datos_seguros.js abre los archivos de mas de 64 KB en segundo plano, de a
     pedazos, para no congelar la pantalla. Para los datos que una pagina
     necesita al arrancar eso esta bien. Para este caso, no.

     Medido en el dashboard: el archivo tardo VEINTINUEVE SEGUNDOS en abrirse,
     porque esa pantalla esta descifrando al mismo tiempo 1,65 MB de
     entrenamientos y el reparto por pedazos los hace pelear entre si. Con la
     espera cortada a los 25 segundos, el boton terminaba diciendo que no pudo.

     El mismo archivo, abierto DE UNA con __DESCIFRAR_SINCRONO —la marca que
     ya usa "Cargar videos"— tarda 62 ms. Bloquea esos 62 ms y listo.

     El vigia de abajo queda igual por si algo cambia: si el camino directo no
     dejara los datos puestos, se sigue esperando el aviso en segundo plano,
     ahora con un minuto de paciencia en vez de 25 segundos. */
  function abrir(){
    try {
      var todo = global.__D || {};
      if (!todo[ARCH]){ fin(false); return; }
      var antes = global.__DESCIFRAR_SINCRONO;
      global.__D = {}; global.__D[ARCH] = todo[ARCH];
      global.__DESCIFRAR_SINCRONO = true;
      try { global.abrirDatos(); }
      finally { global.__D = todo; global.__DESCIFRAR_SINCRONO = antes; }
      if (hayDatos()){ fin(true); return; }
      var t0 = Date.now();
      function mirar(){ if (hayDatos()){ limpiar(); fin(true); } }
      function limpiar(){
        clearInterval(vigia);
        try{ global.removeEventListener('datos-listos', mirar); }catch(e){}
      }
      try{ global.addEventListener('datos-listos', mirar); }catch(e){}
      var vigia = setInterval(function(){
        if (hayDatos()){ limpiar(); fin(true); }
        else if (Date.now() - t0 > 60000){ limpiar(); fin(false); }
      }, 300);
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
/* Cuando la tabla se corre de costado, la primera columna —el nombre de la
   fila— se queda quieta: si no, uno termina mirando numeros sin saber de
   que fila son. El fondo tiene que ser opaco, igual que el del marco. */
+ '.vs-scroll .vs-t th.izq,.vs-scroll .vs-t td.izq{position:sticky;left:0;background:#0D0E1A;'
+   'box-shadow:1px 0 0 rgba(148,163,184,.10)}'
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
+ '.vs-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}'
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
  var filas = _vsFiltrar((j.data || []).filter(function(f){
    return f.length > 7 && typeof f[7] === 'number' && f[7] > 0;
  }));
  return { num:j.num, name:j.name, saques:filas };
}


/* ══ SOLO LA SESION QUE SE ESTA MIRANDO ═══════════════════════════════════════
   Esta tabla mostraba SIEMPRE todos los saques medidos, pasara lo que pasara
   arriba. Con el partido contra VCS elegido en el dashboard seguian saliendo
   los 240 saques del entrenamiento del 29 de septiembre, que es el unico dia
   que se midio con radar.

   La sesion elegida la sabe batSesionIds() —la misma que usan las baterias—,
   pero devuelve el id del archivo de baterias, y aca cada saque viene marcado
   con el id del plan de partido. Son dos nomenclaturas distintas para la
   misma sesion:
       baterias        E2026-09-29-AXPONAFELS
       plan de partido E2026-09-29-PRAAXPONAFEL
   Lo unico que comparten, y que identifica la sesion, es la letra del tipo y
   la fecha: E2026-09-29. Por eso se compara eso.

   Dos sesiones el mismo dia —pasa con los entrenamientos de mañana y tarde—
   no se pueden separar: ningun de los dos archivos escribe el turno de la
   misma forma. En ese caso se muestran las dos y el pie de la tabla lo dice.

   Si la pantalla no eligio nada, o no tiene baterias cargadas, no se filtra y
   queda todo como estaba. */
function _vsClave(id){
  var m = String(id || '').match(/^([EP])(\d{4}-\d{2}-\d{2})/);
  return m ? (m[1] + m[2]) : '';
}
function sesionesPedidas(){
  try{
    if (typeof global.batSesionIds !== 'function') return null;
    var ids = global.batSesionIds();
    if (!ids || !ids.length) return null;
    var set = {}, hay = false;
    ids.forEach(function(id){
      var m = (typeof global.batMetaDe === 'function') ? global.batMetaDe(id) : null;
      var k = _vsClave(m ? m.id : id);
      if (!k && m && m.fecha){
        k = ((m.tipo === 'entrenamiento' || m.tipo === 'E') ? 'E' : 'P') + String(m.fecha).slice(0, 10);
      }
      if (k){ set[k] = 1; hay = true; }
    });
    return hay ? set : null;
  }catch(e){ return null; }
}
function _vsFiltrar(filas){
  var S = sesionesPedidas();
  if (!S) return filas;
  return filas.filter(function(f){ return !!S[_vsClave(f[6])]; });
}
/* como se llama la sesion elegida, para decirlo en pantalla */
function _vsRotulo(){
  try{
    if (typeof global.batSesionIds !== 'function') return '';
    var ids = global.batSesionIds();
    if (!ids || !ids.length) return '';
    if (ids.length > 1) return ids.length + ' sesiones elegidas';
    var m = (typeof global.batMetaDe === 'function') ? global.batMetaDe(ids[0]) : null;
    if (!m) return '';
    var f = String(m.fecha || '');
    if (/^\d{4}-\d{2}-\d{2}/.test(f)) f = f.slice(8,10) + '/' + f.slice(5,7) + '/' + f.slice(0,4);
    var q = (m.tipo === 'entrenamiento' || m.tipo === 'E') ? 'el entrenamiento' : 'el partido vs ' + (m.rival || '');
    return q + ' del ' + f;
  }catch(e){ return ''; }
}
/* cuantas sesiones de las baterias caen el mismo dia que la elegida */
function _vsDiaCompartido(){
  try{
    if (typeof global.batSesionIds !== 'function' || typeof global.batMetaDe !== 'function') return false;
    var ids = global.batSesionIds();
    if (!ids || ids.length !== 1) return false;
    var m = global.batMetaDe(ids[0]);
    return !!(m && typeof global.batMismoDia === 'function' && global.batMismoDia(m) > 1);
  }catch(e){ return false; }
}
/* los dias que SI tienen saques medidos, para avisar bien cuando no hay */
function _vsDiasMedidos(){
  var dias = {};
  sacadores().forEach(function(j){
    (j.data || []).forEach(function(f){
      if (f.length > 7 && typeof f[7] === 'number' && f[7] > 0){
        var k = _vsClave(f[6]); if (k) dias[k] = 1;
      }
    });
  });
  return Object.keys(dias).sort().map(function(k){
    return k.slice(9,11) + '/' + k.slice(6,8) + '/' + k.slice(1,5);
  });
}
function _vsSinSesion(caja){
  var rot = _vsRotulo();
  var dias = _vsDiasMedidos();
  var h = '<div class="vs-nada">No hay saques con velocidad medida en ' + (rot || 'la sesión elegida') + '.';
  if (dias.length) h += '<br><span style="opacity:.75">Hay radar en: ' + dias.join(' · ') + '.</span>';
  h += '</div>';
  caja.innerHTML = h;
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
    if (J && sesionesPedidas()){ _vsSinSesion(caja); return; }
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

  /* La tabla tiene ocho columnas: en un telefono no entra. Se corre de costado
     ELLA SOLA, dentro de su marco, para que el numero grande y el consejo —que
     es lo que de verdad hay que leer— se queden quietos. */
  h += '<div class="vs-scroll"><table class="vs-t"><tr><th class="izq">Saque</th><th class="gen">General</th>'
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
  h += '</table></div>';
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
    var f = _vsFiltrar((j.data || []).filter(function(x){ return x.length > 7 && typeof x[7] === 'number' && x[7] > 0; }));
    return { num:j.num, name:j.name, g:agrupar(f), n:f.length };
  }).filter(function(x){ return x.n > 0; })
    .sort(function(a,b){ return (mediana(b.g.tot)||0) - (mediana(a.g.tot)||0); });

  if (!L.length){
    if (sesionesPedidas()){ _vsSinSesion(caja); return; }
    caja.innerHTML = '<div class="vs-nada">Todavía no hay saques con velocidad medida.</div>';
    return;
  }
  var h = '<div class="vs-scroll"><table class="vs-t"><tr><th class="izq">Jugador</th><th class="gen">General</th>'
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
  h += '</table></div>';
  var _rot = _vsRotulo();
  h += '<p class="vs-pie">' + (_rot ? 'Solo <b>' + _rot + '</b>. ' : 'Todas las sesiones medidas. ')
     + 'Ordenado por velocidad habitual. <b>En punto</b> y <b>en error</b> son las dos '
     + 'columnas que más dicen: si un jugador erra más rápido de lo que acierta, está sacando de más.'
     + (_vsDiaCompartido() ? ' Ese día hubo más de una sesión y los dos archivos no guardan el turno igual, así que se muestran las dos.' : '')
     + '</p>';
  caja.innerHTML = h;
}

global.VEL_SAQUE = { pedirDatos:pedirDatos, hayDatos:hayDatos, deJugador:deJugador,
                     hayMedidos:function(){ return tieneMedidos(clubPP()); },
                     pintarJugador:pintarJugador, pintarPlantel:pintarPlantel,
                     mediana:mediana, sacadores:sacadores,
                     sesionesPedidas:sesionesPedidas, rotulo:_vsRotulo };

})(window);
