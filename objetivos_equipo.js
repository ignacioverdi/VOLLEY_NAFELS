/* ============================================================================
   objetivos_equipo.js — Näfels
   ----------------------------------------------------------------------------
   TODO EL PLANTEL EN UNA HOJA: expectativa contra realidad.

   Una fila por jugador, una columna por fundamento. En cada casilla el numero
   de esta semana arriba y el objetivo abajo, con el color diciendo si llega o
   no. Lo que el jugador ve de a uno en su perfil, el entrenador lo ve todo
   junto y puede barrer la semana de un vistazo.

   Las cuentas NO se hacen aca: salen de objetivos_semanales.js, el mismo motor
   que dibuja la tarjeta del jugador. Si los dos numeros no coincidieran, seria
   porque hay dos cuentas; por eso hay una sola.
   ========================================================================== */
(function(){
'use strict';

var OS = window.OBJ_SEMANA;
var COLS = ['sq','rec','def','bqpos','bqpt','atqq','atqx','atqhb','atqrp','atqri','atqrm','atqtr','atqz','hset'];
/* Los textos salen del mismo diccionario que la tarjeta del jugador. Tener
   dos seria tener dos verdades, y algun dia dirian cosas distintas. */
function T(){ return OS.T.apply(null, arguments); }
var CSS = ''
+ '.oe{font-family:"Barlow Condensed",system-ui,sans-serif;font-variant-numeric:tabular-nums}'
+ '.oe-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 14px}'
+ '.oe-bt{font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;'
+   'padding:7px 14px;border-radius:9px;cursor:pointer;border:1px solid rgba(148,163,184,.2);'
+   'background:rgba(148,163,184,.06);color:#94A3B8}'
+ '.oe-bt.on{background:rgba(232,25,44,.12);border-color:rgba(232,25,44,.45);color:#E8192C}'
+ '.oe-sel{background:#0D0E1A;color:#E2E8F0;border:1px solid rgba(148,163,184,.2);border-radius:9px;'
+   'padding:7px 10px;font-family:inherit;font-size:14px;font-weight:700}'
+ '.oe-sem{margin-left:auto;font-size:14px;color:#64748B;letter-spacing:.06em;text-transform:uppercase;font-weight:700}'
+ '.oe-res{background:#0D0E1A;border:1px solid rgba(148,163,184,.16);border-radius:13px;padding:14px 16px;margin:0 0 14px;'
+   'display:flex;align-items:center;gap:14px;flex-wrap:wrap}'
+ '.oe-res .big{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:40px;line-height:.9;color:#F1F5F9;letter-spacing:-.02em}'
+ '.oe-res .tx{font-size:16px;color:#94A3B8;line-height:1.35}'
+ '.oe-res .tx b{color:#E2E8F0}'
+ '.oe-res .med{flex:1 1 180px;min-width:150px;height:10px;border-radius:5px;background:rgba(148,163,184,.14);position:relative;overflow:hidden}'
+ '.oe-res .med s{position:absolute;left:0;top:0;bottom:0;background:#22c55e;text-decoration:none;border-radius:5px}'
+ '.oe-sc{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid rgba(148,163,184,.16);border-radius:13px;background:#0D0E1A}'
+ '.oe-t{border-collapse:separate;border-spacing:0;width:100%;min-width:980px}'
+ '.oe-t th,.oe-t td{padding:0;text-align:center;vertical-align:middle}'
+ '.oe-t thead th{position:sticky;top:0;background:#0D0E1A;z-index:2;padding:10px 6px 9px;font-size:11px;'
+   'letter-spacing:.05em;text-transform:uppercase;color:#7C8AA0;font-weight:700;white-space:nowrap;font-size:10px;'
+   'border-bottom:1px solid rgba(148,163,184,.18)}'
+ '.oe-t .jug{position:sticky;left:0;background:#0D0E1A;z-index:3;text-align:left;padding:9px 11px;min-width:158px;'
+   'border-right:1px solid rgba(148,163,184,.14)}'
+ '.oe-t thead .jug{z-index:4}'
+ '.oe-t tbody tr:nth-child(even) td{background:rgba(148,163,184,.035)}'
+ '.oe-t tbody tr:nth-child(even) .jug{background:#101223}'
+ '.oe-t tbody td{border-bottom:1px solid rgba(148,163,184,.08)}'
+ '.oe-n{display:flex;align-items:baseline;gap:7px}'
+ '.oe-n .d{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:19px;color:#E8192C;min-width:22px;letter-spacing:-.01em}'
+ '.oe-n .m{font-size:17px;font-weight:700;color:#F1F5F9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
+ '.oe-n .p{font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:#64748B;font-weight:700;margin-left:auto;padding-left:8px}'
+ '.oe-cnt{display:flex;align-items:center;gap:8px;margin:3px 0 0}'
+ '.oe-cnt s{flex:1;height:5px;border-radius:3px;background:rgba(148,163,184,.16);position:relative;text-decoration:none}'
+ '.oe-cnt s i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:#22c55e}'
+ '.oe-cnt em{font-style:normal;font-size:13px;color:#7C8AA0;font-weight:700}'
+ '.oe-c{display:block;padding:6px 3px;line-height:1.05;border-radius:7px;margin:2px}'
+ '.oe-c u{display:block;text-decoration:none;font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:18px;letter-spacing:-.01em}'
/* El % va pegado al numero y chiquito, igual que en la tarjeta del jugador:
   un «12,5» suelto no se sabe si son puntos, acciones o por ciento. */
+ '.oe-c u s{text-decoration:none;font-family:"Barlow Condensed",system-ui,sans-serif;font-size:11px;'
+   'font-weight:700;letter-spacing:0;opacity:.6;margin-left:1px}'
+ '.oe-c b{display:block;font-weight:600;font-size:11px;margin-top:1px;color:#64748B;opacity:.9}'
+ '.oe-c i{display:block;font-style:normal;font-size:11px;margin-top:2px;opacity:.75}'
+ '.oe-c.ok{background:rgba(34,197,94,.13)} .oe-c.ok u{color:#4ade80} .oe-c.ok i{color:#4ade80}'
+ '.oe-c.no{background:rgba(232,25,44,.1)} .oe-c.no u{color:#fb7185} .oe-c.no i{color:#fb7185}'
+ '.oe-c.sin u{color:#475569;font-size:17px} .oe-c.sin i{color:#3f4a5c}'
+ '.oe-c.na{color:#2b3342;font-size:15px}'
+ '.oe-pie{margin:12px 2px 0;font-size:14px;color:#64748B;line-height:1.5;display:flex;gap:16px;flex-wrap:wrap;align-items:center}'
+ '.oe-pie span{display:flex;align-items:center;gap:6px}'
+ '.oe-pie s{width:14px;height:14px;border-radius:4px;display:block;text-decoration:none}'
+ '@media(max-width:560px){.oe-t .jug{min-width:142px}.oe-n .p{display:none}}';

function css(){
  if(document.getElementById('oe-css')) return;
  var s = document.createElement('style'); s.id = 'oe-css'; s.textContent = CSS;
  document.head.appendChild(s);
  if(!document.getElementById('oe-font')){
    var l = document.createElement('link'); l.id = 'oe-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(l);
  }
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function n1(v){ return (Math.round(v*10)/10).toString().replace('.',','); }
function corto(nombre){
  var t = String(nombre||'').trim().split(/\s+/);
  function cap(w){ return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase(); }
  if(!t[0]) return '';
  return t.length === 1 ? cap(t[0]) : cap(t[0]) + ' ' + t[1].charAt(0).toUpperCase() + '.';
}
function plantel(){
  var L = (window.EQUIPO_DATA && window.EQUIPO_DATA.jugadores)
       || (window.PLANTEL_NAFELS && window.PLANTEL_NAFELS.jugadores) || [];
  return L.slice().map(function(j){
    return {num:j.num, nombre:j.nombre || j.ap, pos:String(j.pos||'').toUpperCase()};
  }).filter(function(j){ return j.nombre; });
}
function dd(x){ return x.getDate() + '/' + (x.getMonth()+1); }
function rango(){
  var l = OS.lunesDe(OS.hoy()), f = new Date(l); f.setDate(f.getDate()+6);
  return dd(l) + ' - ' + dd(f);
}

/* ── QUE SEMANA SE MIRA ────────────────────────────────────────────────────
   Por defecto, la ultima que tenga algo cargado. El lunes a la mañana la
   semana nueva esta vacia y abrir la pantalla en cero no le sirve a nadie:
   lo que el entrenador quiere ver ese dia es como cerro la que termino.
   El desplegable deja moverse igual.                                       */
function semanasConDatos(){
  var B = window.BAT_PARTIDOS;
  var v = {};
  ((B && B.meta) || []).forEach(function(m){
    var p = String(m.fecha||'').split(/[-\/]/);
    if(p.length !== 3) return;
    var f = (p[0].length === 4) ? new Date(+p[0], (+p[1])-1, +p[2])
                                : new Date(+p[2], (+p[1])-1, +p[0]);
    v[OS.clave(OS.lunesDe(f))] = 1;
  });
  v[OS.clave(OS.lunesDe(new Date()))] = 1;
  return Object.keys(v).sort().reverse();
}
function ultimaConDatos(){
  var L = semanasConDatos();
  for(var i = 0; i < L.length; i++){
    var p = L[i].split('-');
    var d = new Date(+p[0], (+p[1])-1, +p[2]); d.setDate(d.getDate()+6);
    window.OBJ_SEM_HOY = OS.clave(d);
    var hay = plantel().some(function(j){
      return (OS.PUESTOS[j.pos] || []).some(function(id){
        var r = OS.serie(j.nombre, modo, id);
        return r.hay && r.ultima && r.ultima.n > 0;
      });
    });
    if(hay) return L[i];
  }
  return L[0] || OS.clave(OS.lunesDe(new Date()));
}

var modo = 'entrenamiento';
var semana = null;

/* Todos estos fundamentos se miden en por ciento, asi que el numero lleva el
   % pegado y los dos renglones de abajo tambien: «falta 29,5» no dice si son
   puntos, acciones o por ciento, y la version del jugador ya lo llevaba.
   El unico numero SIN % es el chiquito de todo abajo, que es la cantidad de
   acciones sobre las que esta hecho. */
function pc(v){ return n1(v) + '<s>%</s>'; }
function pcTxt(v){ return n1(v) + '&nbsp;%'; }

function celda(r){
  if(!r || !r.hay) return '<td><span class="oe-c na">&middot;</span></td>';
  var c = r.ultima;
  if(!c || c.n === 0){
    return '<td><span class="oe-c sin"><u>&mdash;</u><i>'
         + (c && c.desde != null ? T('cerroCorto', pcTxt(c.desde)) : T('tSinAcc')) + '</i></span></td>';
  }
  if(c.objetivo == null){
    return '<td><span class="oe-c sin"><u>' + pc(c.val) + '</u><i>' + T('tPrimera') + '</i></span></td>';
  }
  var ok = c.val >= c.objetivo;
  /* Al lado del numero, sobre cuantas acciones esta hecho: un 100% de una
     accion y uno de treinta no son lo mismo, y sin esto se leen igual. */
  return '<td><span class="oe-c ' + (ok ? 'ok' : 'no') + '"><u>' + pc(c.val) + '</u>'
       + '<i>' + (ok ? T('tDe', pcTxt(c.objetivo)) : T('tFaltaN', pcTxt(c.objetivo - c.val))) + '</i>'
       + '<b>' + c.n + '</b></span></td>';
}

function opcionesSemana(){
  var act = OS.clave(OS.lunesDe(OS.hoy()));
  return semanasConDatos().map(function(k){
    var p = k.split('-'), l = new Date(+p[0], (+p[1])-1, +p[2]);
    var f = new Date(l); f.setDate(f.getDate()+6);
    return '<option value="' + k + '"' + (k === act ? ' selected' : '') + '>'
         + dd(l) + ' - ' + dd(f) + '</option>';
  }).join('');
}
function pintar(){
  var cont = document.getElementById('obj-equipo');
  if(!cont || !OS || !window.BAT_PARTIDOS || !window.OBJETIVOS_CONFIG) return;
  css();
  /* pararse en la semana elegida: el motor mira siempre «hasta hoy» */
  if(semana === null) semana = ultimaConDatos();
  var pk = semana.split('-'), fin = new Date(+pk[0], (+pk[1])-1, +pk[2]);
  fin.setDate(fin.getDate() + 6);
  window.OBJ_SEM_HOY = OS.clave(fin);
  var P = plantel();
  var filas = P.map(function(j){
    var suyos = (OS.PUESTOS[j.pos] || []);
    var rs = {}, cump = 0, tot = 0;
    COLS.forEach(function(id){
      if(suyos.indexOf(id) < 0){ rs[id] = null; return; }
      var r = OS.serie(j.nombre, modo, id);
      rs[id] = r;
      if(r.hay && r.ultima && r.ultima.n > 0 && r.ultima.objetivo != null){
        tot++; if(r.ultima.val >= r.ultima.objetivo) cump++;
      }
    });
    return {j:j, rs:rs, cump:cump, tot:tot};
  }).filter(function(f){
    /* los que no tienen ni una accion cargada en todo el año no entran */
    return COLS.some(function(id){ return f.rs[id] && f.rs[id].hay; });
  });

  /* primero los que mas lejos estan de cumplir: es donde hay que mirar */
  filas.sort(function(a,b){
    var pa = a.tot ? a.cump/a.tot : -1, pb = b.tot ? b.cump/b.tot : -1;
    if(pa !== pb) return pa - pb;
    return b.tot - a.tot;
  });

  var C = filas.reduce(function(s,f){ return s + f.cump; }, 0);
  var Tt = filas.reduce(function(s,f){ return s + f.tot; }, 0);
  var pc = Tt ? C/Tt*100 : 0;

  var h = '<div class="oe" data-notr>';
  h += '<div class="oe-bar">'
     + '<button type="button" class="oe-bt' + (modo==='entrenamiento'?' on':'') + '" data-m="entrenamiento">'
     + T('entrenamiento') + '</button>'
     + '<button type="button" class="oe-bt' + (modo==='partido'?' on':'') + '" data-m="partido">'
     + T('partido') + '</button>'
     + '<select class="oe-sel" id="oe-sem">' + opcionesSemana() + '</select>'
     + '<span class="oe-sem">' + T('tSemana', rango()) + '</span></div>';

  h += '<div class="oe-res"><span class="big">' + C + '<span style="color:#475569">/' + Tt + '</span></span>'
     + '<span class="tx">' + T('tCumplidos') + '<br>' + T('tConAcciones', filas.length) + '</span>'
     + '<span class="med"><s style="width:' + pc.toFixed(0) + '%"></s></span></div>';

  h += '<div class="oe-sc"><table class="oe-t"><thead><tr><th class="jug">' + T('tJugador') + '</th>'
     + COLS.map(function(id){ return '<th>' + OS.cortoDe(id) + '</th>'; }).join('') + '</tr></thead><tbody>';
  filas.forEach(function(f){
    var p = f.tot ? f.cump/f.tot*100 : 0;
    h += '<tr><td class="jug"><div class="oe-n"><span class="d">' + esc(f.j.num) + '</span>'
       + '<span class="m">' + esc(corto(f.j.nombre)) + '</span>'
       + '<span class="p">' + OS.puestoTxt(f.j.pos) + '</span></div>'
       + '<div class="oe-cnt"><s><i style="width:' + p.toFixed(0) + '%"></i></s>'
       + '<em>' + f.cump + '/' + f.tot + '</em></div></td>';
    COLS.forEach(function(id){ h += celda(f.rs[id]); });
    h += '</tr>';
  });
  h += '</tbody></table></div>';

  h += '<p class="oe-pie">'
     + '<span><s style="background:rgba(34,197,94,.35)"></s><i data-t="lleg&oacute; al objetivo" style="font-style:normal">lleg&oacute; al objetivo</i></span>'
     + '<span><s style="background:rgba(232,25,44,.3)"></s><i data-t="le falta" style="font-style:normal">le falta</i></span>'
     + '<span><s style="background:rgba(148,163,184,.18)"></s><i data-t="sin acciones esta semana" style="font-style:normal">sin acciones esta semana</i></span>'
+ '<span style="color:#64748B" data-t="el n&uacute;mero chiquito de abajo es sobre cu&aacute;ntas acciones est&aacute; hecho">el n&uacute;mero chiquito de abajo es sobre cu&aacute;ntas acciones est&aacute; hecho</span>'
     + '<span><s style="background:transparent;border:1px solid rgba(148,163,184,.25)"></s>no le corresponde al puesto</span>'
     + '</p></div>';
  cont.innerHTML = h;
  cont.querySelectorAll('.oe-bt').forEach(function(b){
    b.addEventListener('click', function(){ modo = b.getAttribute('data-m'); semana = null; pintar(); });
  });
  var sel = document.getElementById('oe-sem');
  if(sel) sel.addEventListener('change', function(){ semana = sel.value; pintar(); });
}
window.OBJ_EQUIPO = {pintar:pintar, setModo:function(m){ modo = m; pintar(); }};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(pintar,0); });
else setTimeout(pintar, 0);
})();
