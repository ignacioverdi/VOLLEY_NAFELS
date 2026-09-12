/* ============================================================================
   objetivos.js — Näfels
   Metas del equipo + funciones de las BATERÍAS (diseño y clasificación),
   copiadas 1:1 del dashboard de Näfels, más el MOTOR que calcula las 11
   baterías EN VIVO desde los códigos que se van scouteando.
   El motor es un port fiel de baterias_engine.py (validado contra DataVolley).
   ========================================================================== */

/* ── Metas del equipo (idénticas al dashboard de Näfels) ── */
window.OBJETIVOS_CONFIG = window.OBJETIVOS_CONFIG || {};
/* RESPALDO: la configuracion buena vive en objetivos_config.js.
   Esta copia solo se usa si ese archivo no cargo, para que la pantalla no
   quede sin colores. Antes se asignaba directo y PISABA a la buena, porque
   se carga despues: por eso faltaba el objetivo de defensa aunque el
   archivo central si lo tuviera. */
window.OBJETIVOS_CONFIG = (window.OBJETIVOS_CONFIG && window.OBJETIVOS_CONFIG.metas)
                          ? window.OBJETIVOS_CONFIG : {metas:{
  sq:   {label:'% Saque',   obj:42, min:25,max:55, g2:42, g1:38, y:34},
  rec:  {label:'% Recep.',  obj:62, min:45,max:75, g2:62, g1:58, y:54},
  bqpos:{label:'Blq #+',    obj:43, min:25, max:52, g2:43, g1:37, y:30},
  bqpt: {label:'% Blq #',   obj:23, min:12, max:28, g2:23, g1:20, y:17},
  atqq: {label:'Atq Quick', obj:48, min:35, max:56, g2:48, g1:44, y:40},
  atqhb:{label:'Atq HB',    obj:20, min:8,  max:26, g2:20, g1:16, y:12},
  atqx: {label:'Atq X',     obj:42, min:28, max:50, g2:42, g1:38, y:34},
  atqrp:{label:'Atq R#+',   obj:50, min:32, max:58, g2:50, g1:44, y:38},
  atqri:{label:'Atq R!',    obj:36, min:22, max:44, g2:36, g1:32, y:28},
  atqrm:{label:'Atq R-',    obj:26, min:14, max:34, g2:26, g1:22, y:18},
  atqtr:{label:'Atq TR',    obj:34, min:22, max:42, g2:34, g1:30, y:26}
}};

/* ── Clasificación por color (idéntica al dashboard) ── */
function objClassify(id,val){
  /* El semaforo, medido contra el recorrido real de la liga: del peor equipo
     al mejor. Verde fuerte al llegar al mejor, verde claro en el cuarto de
     arriba, amarillo en la mitad de arriba, rojo en la mitad de abajo.
     Es el mismo criterio que el resto de las pantallas. */
  /* La proteccion evita que reviente si esta funcion corre antes de que
     termine de cargar la configuracion. */
  var m = (window.OBJETIVOS_CONFIG && window.OBJETIVOS_CONFIG.metas[id]) || {};
  var obj = (m.obj != null) ? m.obj : null;
  var piso = (m.min != null) ? m.min : 0;
  if (m.cortesPropios && m.g2 != null) {
    if(val>=m.g2) return{color:'#22c55e',bg:'rgba(34,197,94,.1)',   border:'rgba(34,197,94,.35)',  label:'Objetivo'};
    if(val>=m.g1) return{color:'#86efac',bg:'rgba(134,239,172,.08)',border:'rgba(134,239,172,.3)', label:'Cerca'};
    if(val>=m.y)  return{color:'#fbbf24',bg:'rgba(251,191,36,.1)',  border:'rgba(251,191,36,.3)',  label:'Neutro'};
    return              {color:'#ef4444',bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.3)',   label:'Lejos'};
  }
  var reco = (obj != null && obj > piso) ? ((val - piso) / (obj - piso) * 100) : null;
  if (reco === null) reco = (val >= (m.g2||0)) ? 100 : 0;
  if(reco>=100) return{color:'#22c55e',bg:'rgba(34,197,94,.1)',   border:'rgba(34,197,94,.35)',  label:'Objetivo'};
  if(reco>=75)  return{color:'#86efac',bg:'rgba(134,239,172,.08)',border:'rgba(134,239,172,.3)', label:'Cerca'};
  if(reco>=50)  return{color:'#fbbf24',bg:'rgba(251,191,36,.1)',  border:'rgba(251,191,36,.3)',  label:'Neutro'};
  return              {color:'#ef4444',bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.3)',   label:'Lejos'};
}
function objClassifyVsTeam(val,teamVal){
  if(teamVal===null||teamVal===undefined) return{color:'#64748b',bg:'rgba(100,116,139,.08)',border:'rgba(100,116,139,.2)',label:'—'};
  var d=val-teamVal;
  if(d>=5)  return{color:'#22c55e',bg:'rgba(34,197,94,.1)', border:'rgba(34,197,94,.35)', label:'Sobre equipo'};
  if(d>=0)  return{color:'#86efac',bg:'rgba(134,239,172,.08)',border:'rgba(134,239,172,.3)', label:'Cerca equipo'};
  if(d>=-8) return{color:'#fbbf24',bg:'rgba(251,191,36,.1)', border:'rgba(251,191,36,.3)', label:'Neutro'};
  return {color:'#ef4444',bg:'rgba(239,68,68,.1)', border:'rgba(239,68,68,.3)', label:'Bajo equipo'};
}

/* ── Dibujo de una batería (barra vertical + marca de objetivo) idéntico al dashboard ── */
function objPct(v,mn,mx){return Math.max(0,Math.min(100,(v-mn)/(mx-mn)*100));}
function fmtEff(v){ return (v<0?'-':'')+Math.abs(v)+'%'; }
function objSingleBat(id,val,meta,cls,objLine){
  /* ══ UNA SOLA VERSION, IGUAL EN TODOS LADOS ═══════════════════════════════
     Habia CINCO copias de esta funcion y CUATRO eran distintas entre si:
     algunas con el nombre del fundamento, otras sin el; algunas con el total
     de acciones, otras sin. La bateria se veia de una forma u otra segun por
     que pantalla entraras.

     Esta es la unica version. Si hay que cambiar algo, se cambia aca y vale
     para todas.

     Muestra: el fundamento, el valor, la bateria con la linea del objetivo,
     sobre cuantas acciones esta hecha la cuenta, y el objetivo. */
  var fh = (val!==null) ? objPct(val, meta.min, meta.max) : 0;
  var oh = objPct(objLine, meta.min, meta.max);
  var txt = (val!==null) ? fmtEff(val) : '\u2014';
  var nombre = String(meta.label||'').replace(/\s*\(-?\d+\)\s*$/, '');
  var n = (meta.n!=null) ? meta.n : null;
  var tip = nombre;
  try{
    if(val!==null && meta.obj!=null && meta.min!=null && meta.obj>meta.min){
      var reco = Math.round((val-meta.min)/(meta.obj-meta.min)*100);
      tip = nombre+': '+val+'%'+(n!=null?' sobre '+n+' acciones':'')
          + ' \u00b7 el peor de la liga '+meta.min+'%, el mejor '+meta.obj+'%'
          + ' \u00b7 est\u00e1s al '+reco+'% del recorrido';
    }
  }catch(e){}
  return '<div title="'+tip+'" style="flex:1;min-width:60px;max-width:110px;display:flex;'
    + 'flex-direction:column;align-items:center;gap:3px;padding:7px 3px 6px;'
    + 'border:1px solid '+cls.border+';border-radius:9px;background:'+cls.bg+';'
    + 'position:relative;overflow:hidden;font-family:Barlow Condensed,sans-serif">'
    + '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:'+cls.color+'"></div>'
    + '<div style="font-size:10px;font-weight:800;letter-spacing:.3px;text-transform:uppercase;'
    + 'color:#94a3b8;line-height:1.1;text-align:center;white-space:nowrap;overflow:hidden;'
    + 'text-overflow:ellipsis;max-width:100%">'+nombre+'</div>'
    + '<div style="font-size:22px;font-weight:900;line-height:1;color:'+cls.color+'">'+txt+'</div>'
    + '<div style="width:32px;height:72px;display:flex;flex-direction:column;align-items:center">'
      + '<div style="width:14px;height:5px;border-radius:3px 3px 0 0;background:'+cls.color+';opacity:.7;flex-shrink:0"></div>'
      + '<div style="position:relative;width:32px;flex:1;border-radius:4px;overflow:hidden;border:2px solid '+cls.color+'">'
        + '<div style="position:absolute;inset:0;background:#07080f"></div>'
        + (val!==null ? '<div style="position:absolute;bottom:0;left:0;right:0;height:'+fh+'%;background:'+cls.color+';opacity:.85"></div>' : '')
        + '<div style="position:absolute;left:0;right:0;bottom:'+oh+'%;height:2px;background:#fff;opacity:.85"></div>'
      + '</div>'
    + '</div>'
    + (n!=null ? '<div style="font-size:8px;font-weight:700;color:#8395ac">'+n+' acc.</div>' : '')
    + '<div style="font-size:8px;font-weight:700;color:#64748b">obj '+objLine+'</div>'
    + '</div>';
}

/* ════════════════════════════════════════════════════════════════════
   MOTOR DE BATERÍAS EN VIVO — port fiel de baterias_engine.py
   Calcula las 11 baterías desde los códigos crudos del scout (M.codes).
   ════════════════════════════════════════════════════════════════════ */
function _batNuevo(){
  var na=function(){return {'#':0,'/':0,'=':0,'T':0};};
  return {S:{'#':0,'+':0,'/':0,'=':0,'T':0},
          R:{'#':0,'+':0,'/':0,'=':0,'T':0},
          B:{'#':0,'+':0,'T':0},
          Aall:na(), cent:na(), alta:na(), rap:na(),
          rp:na(), ri:na(), rm:na(), tr:na()};
}
/* calcula acumuladores por jugador para un lado ('*' local, 'a' visitante) */
function calcBaterias(codes, side){
  var pl={};
  var get=function(num){ if(!pl[num]) pl[num]=_batNuevo(); return pl[num]; };
  var last_rec=null, rec_valida=false;
  for(var i=0;i<codes.length;i++){
    var l=(codes[i].c||'').trim();
    if(l.length<5) continue;
    var pfx=l[0]; var body=l.slice(1).split(';')[0];
    if(body.length<5 || !/^\d\d/.test(body)) continue;
    var num=body.slice(0,2), skill=body[2], res=body[4];
    if(skill==='S'){
      last_rec=null; rec_valida=false;
      if(pfx===side){ var P=get(num); P.S.T++; if(res in P.S) P.S[res]++; }
    } else if(skill==='R' && pfx===side){
      last_rec=res; rec_valida=true;
      var Pr=get(num); Pr.R.T++; if(res in Pr.R) Pr.R[res]++;
    } else if(skill==='F' && pfx===side){
      /* ══ EL FREE BALL CIERRA LA FASE DE RECEPCION ════════════════════════
         Un ataque que sale de un free ball es TRANSICION: el side-out es lo
         que viene de recibir el SAQUE del rival. Esta linea era invisible
         para el motor y arrastraba la recepcion anterior del mismo punto. */
      last_rec=null; rec_valida=false;
    } else if(pfx!==side && (skill==='A'||skill==='D'||skill==='E'||skill==='B')){
      rec_valida=false;
    } else if(skill==='B' && pfx===side){
      var Pb=get(num); Pb.B.T++; if(res in Pb.B) Pb.B[res]++;
    } else if(skill==='A' && pfx===side){
      var tipo=body[3];  /* Q=central · H=alta · T=rápida */
      var cat;
      if(last_rec!==null && rec_valida){
        rec_valida=false;
        cat = (last_rec==='#'||last_rec==='+')?'rp' : last_rec==='!'?'ri' : last_rec==='-'?'rm' : 'tr';
      } else cat='tr';
      var Pa=get(num);
      Pa.Aall.T++; if(res in Pa.Aall) Pa.Aall[res]++;
      if(tipo==='Q'){ Pa.cent.T++; if(res in Pa.cent) Pa.cent[res]++; }
      else if(tipo==='T'){ Pa.rap.T++; if(res in Pa.rap) Pa.rap[res]++; }
      else if(tipo==='H'){ Pa.alta.T++; if(res in Pa.alta) Pa.alta[res]++; }
      Pa[cat].T++; if(res in Pa[cat]) Pa[cat][res]++;
    }
  }
  /* equipo = suma de todos */
  var eq=_batNuevo();
  Object.keys(pl).forEach(function(n){
    var P=pl[n];
    Object.keys(P).forEach(function(sec){
      Object.keys(P[sec]).forEach(function(k){ eq[sec][k]+=P[sec][k]; });
    });
  });
  pl['__EQUIPO__']=eq;
  return pl;
}
/* Redondeo bancario (igual que round() de Python): .5 va al par más cercano.
   Necesario para que los números coincidan EXACTO con el dashboard oficial. */
function roundPy(x){
  var r=Math.round(x);
  if(Math.abs(x-Math.trunc(x))===0.5){ r=2*Math.round(x/2); }
  return r;
}
/* acumuladores -> 11 baterías en % (fórmulas exactas del engine) */
function batToPcts(P){
  var atk=function(d){ return d.T ? roundPy((d['#']-d['/']-d['='])/d.T*100) : null; };
  var S=P.S, R=P.R, B=P.B;
  return {
    sq:    S.T ? roundPy((S['#']+0.5*S['/']+0.25*S['+']-S['='])/S.T*100) : null,
    rec:   R.T ? roundPy((R['#']+0.5*R['+']-0.5*R['/']-R['='])/R.T*100) : null,
    bqpos: B.T ? roundPy((B['#']+B['+'])/B.T*100) : null,
    bqpt:  B.T ? roundPy(B['#']/B.T*100) : null,
    atqq:  atk(P.cent),
    atqhb: atk(P.alta),
    atqx:  atk(P.rap),
    atqrp: atk(P.rp),
    atqri: atk(P.ri),
    atqrm: atk(P.rm),
    atqtr: atk(P.tr)
  };
}
/* API para el panel: dado el lado, devuelve {jugadores:{num:vals}, equipo:vals} */
window.bateriasVivo = function(codes, side){
  var acum = calcBaterias(codes||[], side);
  var out = {jugadores:{}, equipo:null};
  Object.keys(acum).forEach(function(num){
    var v = batToPcts(acum[num]);
    if(num==='__EQUIPO__') out.equipo=v; else out.jugadores[num]=v;
  });
  return out;
};

/* ── Render de las baterías: fila Jugador vs fila Equipo (diseño del dashboard) ── */
function renderBaterias(containerId, jugVals, eqVals, titulo, rivalVals){
  var el=document.getElementById(containerId); if(!el) return;
  var metas=window.OBJETIVOS_CONFIG.metas;
  var rows=[];
  if(jugVals) rows.push({label:'Jugador',vals:jugVals,isJug:true});   /* solo si hay jugador elegido */
  rows.push({label:'Equipo',vals:eqVals||{},isJug:false});
  /* si viene el rival, se agrega una línea abajo para comparar (se clasifica sobre sus propios objetivos) */
  if(rivalVals){ rows.push({label:'__SEP__',vals:{},isJug:false,sep:true}); rows.push({label:'Rival',vals:rivalVals||{},isJug:false,esRival:true}); }
  var html='<div style="font-family:Barlow Condensed,sans-serif;padding:4px 0 8px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">'
    +'<div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#64748b">'+(titulo||'BATERÍAS')+'</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    /* La leyenda decia "Sobre equipo" / "Bajo equipo" porque el jugador se
       comparaba contra su propio equipo. Ahora se compara contra el objetivo,
       igual que la fila del equipo, asi que dice lo mismo que las demas. */
    +[['#22c55e','Objetivo'],['#86efac','Cerca'],['#fbbf24','Neutro'],['#ef4444','Lejos']].map(function(x){
      return'<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#64748b"><div style="width:7px;height:7px;border-radius:50%;background:'+x[0]+'"></div>'+x[1]+'</div>';
    }).join('')+'</div></div>'
    /* ══ SE SACO LA FILA DE ENCABEZADO ══════════════════════════════════════
       Repetia el nombre y el objetivo de cada fundamento arriba de las
       tarjetas —"% SAQUE (42)" y "42%"— y las tarjetas YA los muestran: el
       nombre arriba y "obj 42" abajo. Todo escrito dos veces, y una fila
       entera de alto sin agregar nada.

       ESTE ES EL CUARTO ARCHIVO con el mismo codigo repetido: ya estaba en
       dashboard.html y dos veces en objetivos_config.js. Al arreglar los
       otros tres el encabezado seguia apareciendo, porque el que dibuja
       esta pantalla es este. */
    ;
  rows.forEach(function(row){
    if(row.sep){ html+='<div style="height:1px;background:rgba(255,255,255,.1);margin:10px 0 12px"></div>'; return; }
    var lblColor = row.esRival ? '#f87171' : '#94a3b8';
    html+='<div style="display:flex;align-items:center;gap:8px;width:100%;margin-bottom:8px">'
      +'<div style="width:64px;flex-shrink:0;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:'+lblColor+';text-align:right;padding-right:8px">'+row.label+'</div>'
      +Object.keys(metas).map(function(id){
        var m=metas[id], val=row.vals[id]!==undefined && row.vals[id]!==null ? row.vals[id] : null;
        var cls, objLine;
        if(row.isJug){
          /* ══ EL OBJETIVO ES UNO SOLO, EL DEL EQUIPO ═══════════════════════════════
   Antes al jugador se lo comparaba contra el promedio de SU EQUIPO DE
   ESE DIA. Por eso el objetivo del jugador CAMBIABA todos los dias: si
   el equipo recibia bien, la vara subia; si recibia mal, bajaba.

   Eso rompe la idea de objetivo. El objetivo lo fija el cuerpo tecnico
   una vez y no se mueve, pase lo que pase en un entrenamiento suelto.

   Y traia un problema peor: un jugador podia estar "sobre el equipo" y
   aun asi lejos del objetivo. El verde decia que estaba bien cuando no
   lo estaba.

   Ahora las dos filas, jugador y equipo, se miden contra el MISMO
   objetivo. */
          cls=val!==null?objClassify(id,val):{color:'#334155',bg:'rgba(51,65,85,.08)',border:'rgba(51,65,85,.2)',label:'—'}; objLine=m.obj;
        } else {
          cls=val!==null?objClassify(id,val):{color:'#334155',bg:'rgba(51,65,85,.08)',border:'rgba(51,65,85,.2)',label:'—'};
          objLine=m.obj;
        }
        return objSingleBat(id,val,m,cls,objLine);
      }).join('')+'</div>';
  });
  html+='</div>';
  el.innerHTML=html;
}
