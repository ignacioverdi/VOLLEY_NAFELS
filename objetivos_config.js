/* ═══════════════════════════════════════════════════════════════════════════
   LAS FORMULAS, EN UN SOLO LUGAR

   Antes cada pantalla tenia su propia copia de la cuenta: 28 copias repartidas
   en ocho archivos, con nombres de variable distintos en cada una (j.sPunto,
   a.sPunto, t.sPunto, src.Punto, k, pl, bl...). Cambiar un peso obligaba a
   acertarle a las 28. En la practica siempre quedaba alguna afuera, y una
   pantalla mostraba un numero distinto al resto sin que nadie entendiera por
   que. Tres veces seguidas paso lo mismo con el mismo cambio.

   Ahora la cuenta vive aca y todas las pantallas la llaman. Cambiar un peso
   es tocar UN solo lugar.

   Las funciones reciben un objeto con los conteos y devuelven el numero
   redondeado, o null si no hay acciones. Aceptan los distintos nombres que
   usa cada pantalla, asi que sirven tal cual esten los datos.

   ESCALA 0 a 100:  el error vale 0, el ace o la perfecta 100, el neutro 50.
     SAQUE       #  100    /  87,5   +  75    !  50    -  25    =  0
     RECEPCION   #  100    +  75     !  50    -  25    /  12,5  =  0
     DEFENSA     #  100    +  75     !  50    -  25            =  0
     ATAQUE      punto 100, bloqueado y error 0, el resto 50
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  function n(v){ return (typeof v === 'number' && isFinite(v)) ? v : 0; }
  /* Toma el primer nombre que exista: cada pantalla llama distinto al mismo dato. */
  function g(o, nombres){
    for(var i=0;i<nombres.length;i++){
      var v=o[nombres[i]];
      if(v!==undefined && v!==null) return n(v);
    }
    return 0;
  }
  function redondear(x){ return Math.round(x); }

  window.VB_EFF = {
    /* SAQUE: # ace · / free ball · + positivo · ! neutro · - negativo · = error */
    saque: function(o){
      if(!o) return null;
      var T = g(o,['sT','T','tot','total']);
      if(!T) return null;
      var ace  = g(o,['sPunto','Punto','pts','ace','perf','k']);
      var free = g(o,['sVend','Vend','slash','over','sl','bl']);
      var pos  = g(o,['sPos','Pos','plus','pos','pl','p']);
      var ntr  = g(o,['sAdm','Adm','ntr','nt','exc','reg']);
      var neg  = g(o,['sNeg','Neg','neg','ng']);
      return redondear((ace + 0.875*free + 0.75*pos + 0.5*ntr + 0.25*neg)/T*100);
    },
    /* RECEPCION: # perfecta · + positiva · ! neutra · - negativa · / sobrepase · = error */
    recepcion: function(o){
      if(!o) return null;
      var T = g(o,['rT','T','tot','total']);
      if(!T) return null;
      /* 'over' es como llaman al sobrepase armadores y game_plan; sin el,
         esas dos pantallas daban 37 donde el resto daba 59. */
      var perf = g(o,['rPunto','Punto','pts','perf','k']);
      var pos  = g(o,['rPos','Pos','plus','pos','pl','p','mas']);
      var ntr  = g(o,['rAdm','Adm','ntr','nt','exc','reg']);
      var neg  = g(o,['rNeg','Neg','neg','ng']);
      var sob  = g(o,['rVend','Vend','over','ovp','slash','sl','bl']);
      return redondear((perf + 0.75*pos + 0.5*ntr + 0.25*neg + 0.125*sob)/T*100);
    },
    /* DEFENSA: mismo criterio que recepcion, sin sobrepase. */
    defensa: function(o){
      if(!o) return null;
      var T = g(o,['dT','defT','T','tot','total']);
      if(!T) return null;
      var perf = g(o,['dPerf','defPerf','Punto','perf','pt']);
      var buena= g(o,['dBuena','defBuena','Pos','plus','buena','pos']);
      var ntr  = g(o,['dAdm','defAdm','Adm','ntr','reg']);
      var mala = g(o,['dMala','defMala','Neg','neg','mala']);
      return redondear((perf + 0.75*buena + 0.5*ntr + 0.25*mala)/T*100);
    },
    /* ATAQUE: la formula de siempre, la eficacia clasica del voley.
       (punto - bloqueado - error) / total. NO se toco: es un estandar
       mundial y los objetivos de ataque estan calibrados sobre ella.
       Ojo: esta escala NO es la de 0 a 100 de saque y recepcion; el ataque
       puede dar negativo y eso esta bien, asi se mide en todos lados. */
    ataque: function(o){
      if(!o) return null;
      var T = g(o,['aT','T','tot','total']);
      if(!T) return null;
      var pt  = g(o,['aPunto','Punto','pts','k']);
      var blq = g(o,['aVend','Vend','slash','bl']);
      var err = g(o,['aErr','Err','err','e']);
      return redondear((pt - blq - err)/T*100);
    }
  };
})();


/* ── LA TEMPORADA QUE SE ESTA MOSTRANDO ────────────────────────────────────
   El titulo decia "2026" escrito a mano: al empezar la temporada nueva
   seguia diciendo el año viejo. Ahora lo pregunta.
   Lo busca donde ya esta, en este orden, y si no encuentra nada no muestra
   ningun año en vez de mostrar uno equivocado.
   ────────────────────────────────────────────────────────────────────────── */
window.__TEMP_TITULO = (function () {
  try {
    var t = (window.LIGA_DATA && (window.LIGA_DATA.temporada ||
             window.LIGA_DATA.season)) ||
            (window.TEMPORADA_ACTUAL) ||
            (document.body && document.body.dataset && document.body.dataset.temporada);
    if (t) return ' \u00b7 ' + t;
    var m = (location.pathname.match(/temporadas\/(\d{4}-\d{2})/) || [])[1];
    if (m) return ' \u00b7 ' + m.replace('-', '/');
  } catch (e) {}
  return '';
})();

// objetivos_config.js — NÄFELS Voley
// Configuracion compartida de baterias y objetivos
// Importar en: jugador.html, dashboard.html, historial_voley.html

window./* ── DE DONDE SALEN ESTOS OBJETIVOS ────────────────────────────────────────
   El objetivo de cada fundamento es EL MEJOR DE LA LIGA en ese fundamento,
   medido sobre los 97 partidos de la temporada 25-26.

   No es siempre el mismo equipo, y por eso no alcanzaba con copiar al campeon:

     Saque, recepcion, bloqueo #, y casi todo el ataque   Amriswil
     Bloqueo #+                                           Jona   (45,4 · Amriswil 43,0)
     Ataque tras recepcion negativa                       Schonenwerd (23,0)
     Defensa                                              NAFELS (58,0)

   En defensa el mejor era el propio equipo, asi que el objetivo se subio a 60:
   poner 58 seria pedirles lo que ya hacen y no dejaria nada por delante.

   Los otros dos cortes se reparten entre ese techo y el promedio de la liga,
   asi que el verde claro es "arriba del promedio" y el amarillo "abajo pero
   dentro de lo normal".

   Como referencia, con estos cortes el NAFELS de la 25-26 quedaba en amarillo
   en la mayoria de los fundamentos. Es correcto: no salieron campeones. El
   unico rojo claro era el ataque central, 36,4 contra 54,8 de Amriswil.

   Revisar al final de cada temporada con los partidos nuevos.               */
OBJETIVOS_CONFIG={metas:{
  sq:   { label:'% Saque (42)', obj:42, min:25,max:55, g2:42, g1:40, y:37},
  rec:  { label:'% Recepción (60)', obj:60, min:45,max:72, g2:60, g1:59, y:57},
  bqpos:{ label:'% Blq #+ (45)', obj:45, min:25,max:58, g2:45, g1:43, y:39},
  bqpt: { label:'% Blq # (21)', obj:21, min:5,max:32, g2:21, g1:19, y:15},
  atqq: { label:'% Atq Central (55)', obj:55, min:20,max:70, g2:55, g1:48, y:37},
  atqhb:{ label:'% Atq Alta (18)', obj:18, min:-5,max:35, g2:18, g1:15, y:10},
  atqx: { label:'% Atq Rápida (40)', obj:40, min:15,max:55, g2:40, g1:36, y:29},
  atqrp:{ label:'% Atq R#+ (47)', obj:47, min:20,max:62, g2:47, g1:42, y:34},
  atqri:{ label:'% Atq R! (44)', obj:44, min:15,max:58, g2:44, g1:37, y:26},
  atqrm:{ label:'% Atq R- (23)', obj:23, min:0,max:38, g2:23, g1:20, y:14},
  atqtr:{ label:'% Atq Transición (33)', obj:33, min:10,max:46, g2:33, g1:29, y:22},
  def: { label:'% Defensa (60)', obj:60, min:40,max:72, g2:60, g1:56, y:52}
}};

window.currentObjPartido = window.currentObjPartido || 'acumulado';
window.currentObjTipo = window.currentObjTipo || 'partido'; // 'partido' or 'entrenamiento'

function objClassify(id,val){
  var m=window.OBJETIVOS_CONFIG.metas[id];
  if(val>=m.g2) return{color:'#22c55e',bg:'rgba(34,197,94,.1)',   border:'rgba(34,197,94,.35)',  label:'Objetivo'};
  if(val>=m.g1) return{color:'#86efac',bg:'rgba(134,239,172,.08)',border:'rgba(134,239,172,.3)', label:'Cerca'};
  if(val>=m.y)  return{color:'#fbbf24',bg:'rgba(251,191,36,.1)',  border:'rgba(251,191,36,.3)',  label:'Neutro'};
  return              {color:'#ef4444',bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.3)',   label:'Lejos'};
}

function objClassifyVsTeam(val,teamVal){
  if(teamVal===null||teamVal===undefined) return{color:'#64748b',bg:'rgba(100,116,139,.08)',border:'rgba(100,116,139,.2)',label:'—'};
  var d=val-teamVal;
  if(d>=5)  return{color:'#22c55e',bg:'rgba(34,197,94,.1)',   border:'rgba(34,197,94,.35)',  label:'Sobre equipo'};
  if(d>=0)  return{color:'#86efac',bg:'rgba(134,239,172,.08)',border:'rgba(134,239,172,.3)', label:'Cerca equipo'};
  if(d>=-8) return{color:'#fbbf24',bg:'rgba(251,191,36,.1)',  border:'rgba(251,191,36,.3)',  label:'Neutro'};
  return         {color:'#ef4444',bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.3)',   label:'Bajo equipo'};
}
function objCalcVals(nombreJugador){
  // Use per-partido data if selected
  if(false){ // handled above with INDIVIDUAL_SRC
    var pd = null;
    if(pd){
      if(nombreJugador){
        // Find jugador in this partido by name
        var nmC2 = nombreJugador.replace(/^\d+\s*/,'').toLowerCase();
        var pj2 = pd.jugadores ? pd.jugadores.find(function(x){
          if(!x.nombre) return false;
          var xC2 = x.nombre.replace(/^\d+\s*/,'').toLowerCase();
          return xC2 === nmC2 || xC2.split(' ')[0] === nmC2.split(' ')[0];
        }) : null;
        if(pj2 && pj2.objetivos && Object.keys(pj2.objetivos).length > 0) return pj2.objetivos;
      } else {
        // Equipo for this partido
        if(pd.equipo_obj && Object.keys(pd.equipo_obj).length > 0) return pd.equipo_obj;
        if(pd.objetivos && pd.objetivos['__equipo__']) return pd.objetivos['__equipo__'];
      }
    }
  }
  // Acumulado - use entrenamientos or partidos based on tipo
  var JUGADORES_SRC = window.currentObjTipo==='entrenamiento'
    ? (typeof ENTRENAMIENTOS_JUGADORES!=='undefined' ? ENTRENAMIENTOS_JUGADORES : null)
    : (typeof PARTIDOS_JUGADORES!=='undefined' ? PARTIDOS_JUGADORES : null);
  var INDIVIDUAL_SRC = window.currentObjTipo==='entrenamiento'
    ? (typeof ENTRENAMIENTOS_INDIVIDUAL!=='undefined' ? ENTRENAMIENTOS_INDIVIDUAL : null)
    : (typeof PARTIDOS_INDIVIDUAL!=='undefined' ? PARTIDOS_INDIVIDUAL : null);
  var EQUIPO_SRC = window.currentObjTipo==='entrenamiento'
    ? (typeof ENTRENAMIENTOS_EQUIPO_OBJ!=='undefined' ? ENTRENAMIENTOS_EQUIPO_OBJ : null)
    : (typeof PARTIDOS_EQUIPO_OBJ!=='undefined' ? PARTIDOS_EQUIPO_OBJ : null);

  // Per-sesion if selected
  if(INDIVIDUAL_SRC && window.currentObjPartido !== 'acumulado'){
    var pd2 = INDIVIDUAL_SRC.find(function(p){ return p.nombre === currentObjPartido; });
    if(pd2){
      if(nombreJugador){
        var nmC3 = nombreJugador.replace(/^\d+\s*/,'').toLowerCase();
        var pj3 = pd2.jugadores ? pd2.jugadores.find(function(x){
          if(!x.nombre) return false;
          var xC3 = x.nombre.replace(/^\d+\s*/,'').toLowerCase();
          return xC3 === nmC3 || xC3.split(' ')[0] === nmC3.split(' ')[0];
        }) : null;
        if(pj3 && pj3.objetivos && Object.keys(pj3.objetivos).length>0) return pj3.objetivos;
      } else {
        if(pd2.equipo_obj && Object.keys(pd2.equipo_obj).length>0) return pd2.equipo_obj;
      }
    }
  }

  // Acumulado from datos_partidos.js or datos_entrenamientos.js
  if(JUGADORES_SRC && nombreJugador){
    var nmClean = nombreJugador.replace(/^\d+\s*/,'').toLowerCase();
    var pj = JUGADORES_SRC.find(function(x){
      if(!x.nombre) return false;
      var xClean = x.nombre.replace(/^\d+\s*/,'').toLowerCase();
      var nmApellido = nmClean.split(' ')[0];
      var xApellido  = xClean.split(' ')[0];
      return xClean === nmClean || nmApellido === xApellido;
    });
    if(pj && pj.objetivos && Object.keys(pj.objetivos).length > 0){
      return pj.objetivos;
    }
    // Found source but no data for this jugador — return nulls instead of falling to DVW
    if(window.currentObjTipo === 'entrenamiento'){
      return {sq:null,rec:null,bqpos:null,bqpt:null,atqq:null,atqhb:null,
              atqx:null,atqrp:null,atqri:null,atqrm:null,atqtr:null};
    }
  }
  // Equipo acumulado
  if(EQUIPO_SRC && !nombreJugador && Object.keys(EQUIPO_SRC).length > 0){
    return EQUIPO_SRC;
  }
  // If entrenamiento mode and no data found, return nulls (don't show fake data)
  if(window.currentObjTipo === 'entrenamiento'){
    return {sq:null,rec:null,bqpos:null,bqpt:null,atqq:null,atqhb:null,
            atqx:null,atqrp:null,atqri:null,atqrm:null,atqtr:null};
  }
  // Fallback: calculate from HISTORIAL_DATA (DVW)
  var D=window.HISTORIAL_DATA;
  if(!D){
    if(nombreJugador) return {sq:-5,rec:29,bqpos:38,bqpt:18,atqq:41,atqhb:14,atqx:34,atqrp:42,atqri:27,atqrm:19,atqtr:28};
    return {sq:-5,rec:29,bqpos:38,bqpt:18,atqq:null,atqhb:14,atqx:null,atqrp:null,atqri:null,atqrm:null,atqtr:null};
  }
  var a={sT:0,sPunto:0,sPos:0,sVend:0,sErr:0,rT:0,rPunto:0,rPos:0,rVend:0,rErr:0,
         aT:0,aPunto:0,aVend:0,aErr:0,bT:0,bPt:0,bPtPos:0,mbT:0,mbPt:0,mbVnd:0,mbErr:0};
  var CENT=[2,10,15,17];
  D.entrenamientos.forEach(function(s){
    s.jugadores.forEach(function(j){
      if(j.n==='TOTALES EQUIPO') return;
      if(nombreJugador&&j.n!==nombreJugador) return;
      a.sT+=j.sT||0;a.sPunto+=j.sPunto||0;a.sPos+=j.sPos||0;a.sVend+=j.sVend||0;a.sErr+=j.sErr||0;
      a.rT+=j.rT||0;a.rPunto+=j.rPunto||0;a.rPos+=j.rPos||0;a.rVend+=j.rVend||0;a.rErr+=j.rErr||0;
      a.aT+=j.aT||0;a.aPunto+=j.aPunto||0;a.aVend+=j.aVend||0;a.aErr+=j.aErr||0;
      a.bT+=j.bT||0;a.bPt+=j.bPt||0;a.bPtPos+=j.bPtPos||0;
      if(!nombreJugador&&CENT.indexOf(j.c)>=0){a.mbT+=j.aT||0;a.mbPt+=j.aPunto||0;a.mbVnd+=j.aVend||0;a.mbErr+=j.aErr||0;}
    });
  });
  var v={};
  v.sq   =a.sT>0?VB_EFF.saque(a):null;
  v.rec  =a.rT>0?VB_EFF.recepcion(a):null;
  v.bqpos=a.bT>0?Math.round((a.bPt+a.bPtPos)/a.bT*100):null;
  v.bqpt =a.bT>0?Math.round(a.bPt/a.bT*100):null;
  v.atqhb=a.mbT>0?Math.round((a.mbPt-a.mbVnd-a.mbErr)/a.mbT*100):null;
  return v;
}

/* ══ Partidos y entrenamientos no se cruzan ═══════════════════════════════
   Cada pantalla guarda el filtro con un nombre y una codificacion distinta:
   el dashboard usa EQ_FILTRO con 'P' y 'E', el analisis FILTRO_TIPO igual, y
   el perfil del jugador _objTipo con 'partido' y 'entrenamiento'. Esta funcion
   las lee todas y devuelve siempre lo mismo, para que la separacion no dependa
   de que pantalla la pregunta.

   Devuelve null cuando el filtro esta en "Todos": ahi el acumulado es la suma
   de las dos cosas, que es como se venia usando. */
function batTipoActual(){
  function _norm(v){
    if(v===null || v===undefined) return null;
    v = String(v).toLowerCase();
    if(v==='p' || v==='partido'  || v==='partidos')       return 'partido';
    if(v==='e' || v==='entrenamiento' || v==='entrenamientos') return 'entrenamiento';
    return null;   /* 'todos' o cualquier otra cosa */
  }
  /* El ORDEN importa. EQ_FILTRO y FILTRO_TIPO tienen un valor explicito para
     "todos"; _objTipo no —en el analisis queda en 'partido' aunque el filtro
     este en Todos—, asi que se mira ultimo y solo donde los otros no existen.
     Manda la primera variable que exista en la pagina, incluso si dice todos. */
  try{
    if(window.EQ_FILTRO   !== undefined) return _norm(window.EQ_FILTRO);
    if(window.FILTRO_TIPO !== undefined) return _norm(window.FILTRO_TIPO);
    if(window._objTipo    !== undefined) return _norm(window._objTipo);
    /* Ultimo recurso: el filtro compartido de filtro_tipo.js, para las
       pantallas que no tienen variable propia (ranking, por ejemplo). */
    if(typeof window.vbTipoLargo === 'function') return window.vbTipoLargo();
  }catch(e){}
  return null;
}

function renderObjetivos(cid,extra){
  var el=document.getElementById(cid); if(!el) return;
  var metas=window.OBJETIVOS_CONFIG.metas;
  /* Los numeros del equipo. Se usa objGetVals —que lee del archivo de
     baterias, con el detalle partido por partido— y solo se cae a objCalcVals
     si esa no esta. Antes se usaba siempre la vieja, y el dashboard mostraba
     valores distintos a los del analisis para la misma sesion. */
  var base = (typeof objGetVals === 'function') ? objGetVals(null) : objCalcVals(null);
  var vals = Object.assign({}, base, extra||{});
  var html='<div style="font-family:Barlow Condensed,sans-serif;padding:4px 0 8px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">'
    +'<div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#64748b">OBJETIVOS DEL EQUIPO'+(window.__TEMP_TITULO||'')+'</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    +[['#22c55e','Objetivo'],['#86efac','Cerca'],['#fbbf24','Neutro'],['#ef4444','Lejos']].map(function(x){
      return'<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#64748b"><div style="width:7px;height:7px;border-radius:50%;background:'+x[0]+'"></div>'+x[1]+'</div>';
    }).join('')+'</div></div>'
    /* ══ TODO EN UNA FILA, PARA QUE ENTRE EN EL TELEVISOR ══════════════════
       Antes habia DOS filas: una con el nombre y el objetivo, y abajo otra
       con la bateria. Sumaban mas de 200px de alto y en la tele habia que
       subir y bajar la pagina para ver los doce.

       Ademas el objetivo salia repetido: la etiqueta ya dice "% Saque (42)"
       y justo abajo aparecia otra vez "42%".

       Ahora es UNA sola tarjeta por fundamento, con el nombre arriba, el
       numero grande y la bateria. Entra todo en una pantalla.            */
    +'<div style="display:flex;gap:6px;width:100%;flex-wrap:nowrap">'
    +Object.keys(metas).map(function(id){
      var m=metas[id],val=vals[id]!==undefined?vals[id]:null;
      var cls=val!==null?objClassify(id,val):{color:'#334155',bg:'rgba(51,65,85,.08)',border:'rgba(51,65,85,.2)',label:'—'};
      return objSingleBat(id,val,m,cls,m.obj);
    }).join('')+'</div></div>';
  el.innerHTML=html;
}
function objPct(v,mn,mx){return Math.max(0,Math.min(100,(v-mn)/(mx-mn)*100));}
function fmtEff(v){ return (v<0?'-':'')+Math.abs(v)+'%'; }
function objSingleBat(id,val,meta,cls,objLine){
  /* Tarjeta compacta: nombre, numero y bateria, todo junto. Sin repetir el
     objetivo, que ya va en el nombre. Pensada para que los doce fundamentos
     entren en una pantalla de televisor sin scrollear. */
  var fh = (val!==null) ? objPct(val, meta.min, meta.max) : 0;
  var oh = objPct(objLine, meta.min, meta.max);
  var txt = (val!==null) ? fmtEff(val) : '—';
  var nombre = String(meta.label||'').replace(/\s*\(-?\d+\)\s*$/, '');   /* el (42) sobra */

  return '<div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;'
      + 'gap:3px;padding:7px 3px 6px;border:1px solid '+cls.border+';border-radius:9px;'
      + 'background:'+cls.bg+';position:relative;overflow:hidden;font-family:Barlow Condensed,sans-serif">'
      + '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:'+cls.color+'"></div>'

      /* nombre del fundamento, en una linea */
      + '<div style="font-size:9.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;'
      + 'color:#94a3b8;line-height:1.1;text-align:center;white-space:nowrap;overflow:hidden;'
      + 'text-overflow:ellipsis;max-width:100%" title="'+nombre+'">'+nombre+'</div>'

      /* el numero, que es lo que se lee de lejos */
      + '<div style="font-size:20px;font-weight:900;line-height:1;color:'+cls.color+'">'+txt+'</div>'

      /* la bateria, mas baja que antes */
      + '<div style="width:26px;height:40px;display:flex;flex-direction:column;align-items:center">'
        + '<div style="width:11px;height:4px;border-radius:2px 2px 0 0;background:'+cls.color+';opacity:.7;flex-shrink:0"></div>'
        + '<div style="position:relative;width:26px;flex:1;border-radius:3px;overflow:hidden;border:2px solid '+cls.color+'">'
          + '<div style="position:absolute;inset:0;background:#07080f"></div>'
          + (val!==null ? '<div style="position:absolute;bottom:0;left:0;right:0;height:'+fh+'%;background:'+cls.color+';opacity:.85"></div>' : '')
          /* la marca blanca del objetivo */
          + '<div style="position:absolute;left:0;right:0;bottom:'+oh+'%;height:2px;background:#fff;opacity:.85"></div>'
        + '</div>'
      + '</div>'

      /* el objetivo, chiquito: la referencia sin robar protagonismo */
      + '<div style="font-size:8.5px;font-weight:700;color:#64748b;letter-spacing:.3px">'
      + 'obj ' + objLine + '</div>'
      + '</div>';
}
function renderObjetivos(cid,extra){
  var el=document.getElementById(cid); if(!el) return;
  var metas=window.OBJETIVOS_CONFIG.metas;
  var vals=Object.assign({},typeof objGetVals!=="undefined"?objGetVals(null):objCalcVals(null),extra||{});
  var html='<div style="font-family:Barlow Condensed,sans-serif;padding:4px 0 8px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">'
    +'<div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#64748b">OBJETIVOS DEL EQUIPO'+(window.__TEMP_TITULO||'')+'</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    +[['#22c55e','Objetivo'],['#86efac','Cerca'],['#fbbf24','Neutro'],['#ef4444','Lejos']].map(function(x){
      return'<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#64748b"><div style="width:7px;height:7px;border-radius:50%;background:'+x[0]+'"></div>'+x[1]+'</div>';
    }).join('')+'</div></div>'
    +'<div style="display:flex;gap:8px;width:100%;margin-bottom:4px;align-items:flex-end">'
    +Object.keys(metas).map(function(id){return '<div style="flex:1;min-width:60px;max-width:110px;text-align:center;padding:4px 5px">'
        +'<div style="font-size:10px;font-weight:800;color:#e2e8f0;letter-spacing:0.5px;text-transform:uppercase;line-height:1.3;word-break:break-word">'+metas[id].label+'</div>'
        +'<div style="font-size:10px;color:#22c55e;font-weight:700;margin-top:3px">'+metas[id].obj+'%</div>'
        +'</div>';}).join('')
    +'</div><div style="display:flex;gap:8px;width:100%">'
    +Object.keys(metas).map(function(id){
      var m=metas[id],val=vals[id]!==undefined?vals[id]:null;
      var cls=val!==null?objClassify(id,val):{color:'#334155',bg:'rgba(51,65,85,.08)',border:'rgba(51,65,85,.2)',label:'—'};
      return objSingleBat(id,val,m,cls,m.obj);
    }).join('')+'</div></div>';
  el.innerHTML=html;
}

function renderObjetivosJugador(cid,nombre,extra){
  var el=document.getElementById(cid); if(!el) return;
  var metas=window.OBJETIVOS_CONFIG.metas;
  /* Los numeros del jugador, de la misma fuente que el resto. */
  var _bj = (typeof objGetVals === 'function') ? objGetVals(nombre) : objCalcVals(nombre);
  var jugVals=Object.assign({},_bj,extra||{});
  var eqVals=(typeof objGetVals === 'function') ? objGetVals(null) : objCalcVals(null);
  var rows=[{label:'Jugador',vals:jugVals,isJug:true},{label:'Equipo',vals:eqVals,isJug:false}];
  var html='<div style="font-family:Barlow Condensed,sans-serif;padding:4px 0 8px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">'
    +'<div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#64748b">MI PERFORMANCE VS EQUIPO</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    +[['#22c55e','Sobre equipo'],['#86efac','Cerca'],['#fbbf24','Neutro'],['#ef4444','Bajo equipo']].map(function(x){
      return'<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:#64748b"><div style="width:7px;height:7px;border-radius:50%;background:'+x[0]+'"></div>'+x[1]+'</div>';
    }).join('')+'</div></div>'
    +'<div style="display:flex;gap:8px;width:100%;margin-bottom:4px;align-items:flex-end">'
    +'<div style="width:64px;flex-shrink:0"></div>'
    +Object.keys(metas).map(function(id){return '<div style="flex:1;min-width:60px;max-width:110px;text-align:center;padding:4px 5px">'
        +'<div style="font-size:10px;font-weight:800;color:#e2e8f0;letter-spacing:0.5px;text-transform:uppercase;line-height:1.3;word-break:break-word">'+metas[id].label+'</div>'
        +'<div style="font-size:10px;color:#22c55e;font-weight:700;margin-top:3px">'+metas[id].obj+'%</div>'
        +'</div>';}).join('')
    +'</div>';
  rows.forEach(function(row){
    html+='<div style="display:flex;align-items:center;gap:8px;width:100%;margin-bottom:8px">'
      +'<div style="width:64px;flex-shrink:0;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;text-align:right;padding-right:8px">'+row.label+'</div>'
      +Object.keys(metas).map(function(id){
        var m=metas[id],val=row.vals[id]!==undefined?row.vals[id]:null;
        var cls,objLine;
        if(row.isJug){
          var eq=eqVals[id]!==undefined?eqVals[id]:null;
          cls=val!==null?objClassifyVsTeam(val,eq):{color:'#334155',bg:'rgba(51,65,85,.08)',border:'rgba(51,65,85,.2)',label:'—'};
          objLine=eq!==null?eq:m.obj;
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
function buildObjSubfiltro(nombreJugador){
  var row = document.getElementById('obj-partido-row');
  if(!row) return;
  if(typeof PARTIDOS_META === 'undefined'){ row.style.display='none'; return; }
  row.innerHTML = '';
  row.style.display = 'flex';

  // Label
  var lbl = document.createElement('span');
  lbl.style.cssText = 'font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;align-self:center;margin-right:4px';
  lbl.textContent = 'VER:';
  row.appendChild(lbl);

  // Acumulado button
  var b = document.createElement('button');
  b.className = 'obj-sfbtn' + (currentObjPartido==='acumulado'?' on':'');
  b.textContent = 'Acumulado';
  b.onclick = function(){
    window.window.currentObjPartido = 'acumulado';
    document.querySelectorAll('.obj-sfbtn').forEach(function(x){x.classList.remove('on');});
    b.classList.add('on');
    renderObjetivosJugador('objetivos-jugador', nombreJugador);
  };
  row.appendChild(b);

  // Per-partido buttons
  PARTIDOS_META.forEach(function(m){
    var btn = document.createElement('button');
    btn.className = 'obj-sfbtn' + (window.currentObjPartido===m.nombre?' on':'');
    var label = m.rival||m.nombre;
    if(m.resultado) label += ' ('+m.resultado+')';
    btn.textContent = label;
    btn.onclick = function(){
      window.currentObjPartido = m.nombre;
      document.querySelectorAll('.obj-sfbtn').forEach(function(x){x.classList.remove('on');});
      btn.classList.add('on');
      renderObjetivosJugador('objetivos-jugador', nombreJugador);
    };
    row.appendChild(btn);
  });
}
function setObjTipo(tipo, btn){
  window.currentObjTipo = tipo;
  window.window.currentObjPartido = 'acumulado';
  document.querySelectorAll('.obj-tfbtn').forEach(function(b){
    b.classList.remove('on','partido','ent');
  });
  btn.classList.add('on', tipo==='partido'?'partido':'ent');
  // Rebuild subfiltro for this tipo
  var currentJugNombre = null;
  var titleEl = document.querySelector('.player-name-title');
  if(titleEl) currentJugNombre = titleEl.dataset.nombre;
  buildObjSubfiltro(currentJugNombre || '');
  renderObjetivosJugador('objetivos-jugador', currentJugNombre || '');
}
