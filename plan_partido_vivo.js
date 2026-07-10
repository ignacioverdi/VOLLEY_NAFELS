/* ============================================================================
   plan_partido_vivo.js — Alimenta el Plan de Partido con el SCOUT EN VIVO.
   ----------------------------------------------------------------------------
   El plan de partido normalmente lee window.PP_DATA (de plan_partido_data.js,
   generado desde los DVW ya cargados). Este archivo construye ese mismo PP_DATA
   a partir de los códigos que publica el Scout en Vivo por Firebase (voley_codes),
   con EXACTAMENTE el mismo algoritmo que gen_plan_partido.py, para que el plan
   se llene solo mientras se scoutea, sin traer datos de partidos viejos.

   Portado 1:1 del generador oficial y verificado contra su salida.
   ========================================================================== */
(function(){
  var TYPE = {Q:'pot', T:'pot', M:'flo', H:'flo'};

  /* parsea la lista de códigos [{c, set, t}] de un lado y arma D (atk/srv/rec) */
  function walk(codes, pfx, mid, names, libSet){
    var D = {atk:{}, srv:{}, rec:{}, set:{}, app:{}};
    var push = function(o,k,v){ (o[k]=o[k]||[]).push(v); };
    var curset=null, lastsv=['',''], recv=false, rq='', rby=0, recz='', rally=0;
    for(var i=0;i<codes.length;i++){
      var row = codes[i];
      var c = (row.c||'').trim();
      if(c.length<4) continue;
      var sk = c[3], team = c[0], code = c.slice(1);
      var tsv = (row.t!=null && !isNaN(row.t)) ? (row.t|0) : 0;
      var pnum = parseInt(code.slice(0,2),10); if(isNaN(pnum)) pnum=-1;
      if(team===pfx && pnum>=0) D.app[pnum]=(D.app[pnum]||0)+1;

      if(sk==='S'){
        var st = row.set!=null ? String(row.set) : '';
        if(st!==curset){ curset=st; rally=0; }
        rally++;
        var tpS = code.slice(5).split('~'); var trajS = tpS.length>3?tpS[3]:'';
        var oz = (trajS && /[0-9]/.test(trajS[0]))?trajS[0]:'';
        var dz = (trajS.length>1 && /[0-9]/.test(trajS[1]))?trajS[1]:'';
        lastsv = [TYPE[code[3]]||'otro', oz];
        if(team===pfx && pnum>=0)
          push(D.srv, pnum, [TYPE[code[3]]||'otro', oz, dz, code.length>4?code[4]:'', rally-1, tsv, mid]);
        recv=false; rq=''; rby=0; recz='';
        continue;
      }
      if(sk==='E' && team===pfx && pnum>=0) D.set[pnum]=(D.set[pnum]||0)+1;
      if(sk==='R' && team===pfx){
        rq = code.length>4?code[4]:''; rby=pnum; recv=true;
        var tpR = code.slice(5).split('~'); var trajR = tpR.length>3?tpR[3]:'';
        recz = (trajR && /[0-9]/.test(trajR[0]))?trajR[0]:'';
        var landz = (trajR.length>1 && /[0-9]/.test(trajR[1]))?trajR[1]:'';
        push(D.rec, pnum, [lastsv[0], lastsv[1], landz, rq, rally-1, tsv, mid]);
        continue;
      }
      if(team!==pfx && (sk==='A'||sk==='D'||sk==='E'||sk==='B')){ recv=false; continue; }
      if(team===pfx && sk==='A'){
        var tpA = code.slice(5).split('~'); var tr = tpA.length>1?tpA[1]:'';
        push(D.atk, pnum, [ tpA[0],
          (recv && (rq==='#'||rq==='+'))?'g':(recv && (rq==='!'||rq==='-'))?'b':'o',
          (recv && rby===pnum)?1:0, recv?recz:'', tr.length>1?tr[1]:'',
          code.length>4?code[4]:'', tr.length>3?tr[3]:'', tsv, mid, recv?rby:0 ]);
        recv=false;
      }
    }
    /* pasar claves a string, como el python */
    ['atk','srv','rec'].forEach(function(k){
      var o={}; Object.keys(D[k]).forEach(function(n){ o[String(n)]=D[k][n]; }); D[k]=o;
    });
    D.names = names; D.lib_set = libSet;
    return D;
  }

  function classify(D, num){
    if(D.lib_set.has(num)) return 'Líbero';
    var atk = D.atk[String(num)]||[];
    var combos = {}; atk.forEach(function(a){ combos[a[0]]=(combos[a[0]]||0)+1; });
    var tot = atk.length, sets = D.set[num]||0;
    if(sets>tot && sets>20) return 'Armador';
    if(tot<5) return 'Sub';
    var sum=function(ks){ var s=0; ks.forEach(function(c){ s+=combos[c]||0; }); return s; };
    var quick=sum(['X1','X2','X7','XM','X3','X4']);
    var pos2 =sum(['X6','X8','V6','V8']);
    var pos4 =sum(['X5','V5','XP','X0']);
    var m=Math.max(quick,pos2,pos4);
    return m===quick?'Central':m===pos2?'Opuesto':'Punta';
  }
  function apellido(nm){ nm=(nm||'').trim(); var p=nm?nm.split(/\s+/).pop():'?'; return p.slice(0,14); }
  function domcombo(D,num){
    var atk=D.atk[String(num)]||[]; var c={},best='',bn=0;
    atk.forEach(function(a){ c[a[0]]=(c[a[0]]||0)+1; if(c[a[0]]>bn){bn=c[a[0]];best=a[0];} });
    return best;
  }
  function domserve(D,num){
    var srv=D.srv[String(num)]||[]; var pot=0,flo=0;
    srv.forEach(function(a){ if(a[0]==='pot')pot++; else if(a[0]==='flo')flo++; });
    return pot>=flo?'potencia':'flotado';
  }

  /* construye PP_DATA[slug] para UN lado scouteado */
  function buildTeam(codes, pfx, mid, names, libArr, teamName){
    var libSet = new Set(libArr||[]);
    var D = walk(codes, pfx, mid, names, libSet);
    var cnt=function(kind,num){ return (D[kind][String(num)]||[]).length; };
    var pos={};
    Object.keys(names).forEach(function(n){ pos[+n]=classify(D,+n); });
    var byAtk=function(a,b){ return cnt('atk',b)-cnt('atk',a); };
    var puntas=Object.keys(pos).map(Number).filter(function(n){return pos[n]==='Punta';}).sort(byAtk);
    var centr =Object.keys(pos).map(Number).filter(function(n){return pos[n]==='Central';}).sort(byAtk);
    var opues =Object.keys(pos).map(Number).filter(function(n){return pos[n]==='Opuesto';}).sort(byAtk);
    var servers=Object.keys(pos).map(Number).filter(function(n){return pos[n]!=='Líbero' && cnt('srv',n)>=1;})
                 .sort(function(a,b){return cnt('srv',b)-cnt('srv',a);}).slice(0,12);
    var receiv =Object.keys(pos).map(Number).filter(function(n){return cnt('rec',n)>=1;})
                 .sort(function(a,b){return cnt('rec',b)-cnt('rec',a);}).slice(0,6);
    var players=[];
    var add=function(prefix,num,role,data,read){
      players.push({id:prefix+num, num:num, name:apellido(names[num]||''),
        pos:pos[num]||'—', role:role, total:data.length, read:read, data:data});
    };
    puntas.slice(0,4).forEach(function(n){ var d=D.atk[String(n)]||[]; if(d.length) add('a',n,'punta',d,'Combo principal: '+domcombo(D,n)+'.'); });
    centr.slice(0,3).forEach(function(n){ var d=D.atk[String(n)]||[]; if(d.length) add('a',n,'central',d,'Primer tiempo: '+domcombo(D,n)+'.'); });
    opues.slice(0,2).forEach(function(n){ var d=D.atk[String(n)]||[]; if(d.length) add('a',n,'opuesto',d,'Combo principal: '+domcombo(D,n)+'.'); });
    servers.forEach(function(n){ add('s',n,'saque',D.srv[String(n)]||[],'Saque '+domserve(D,n)+'.'); });
    receiv.forEach(function(n){ add('r',n,'reception',D.rec[String(n)]||[], pos[n]==='Líbero'?'Líbero.':'Receptor.'); });
    return {name:teamName||'En vivo', players:players, info:{}};
  }

  /* API pública: arma PP_DATA desde los datos publicados por el Scout en Vivo.
     liveData = { codes:[{c,set,t}], mid, home:{name,names,lib}, away:{...}, scoutedSide } */
  window.buildPlanVivo = function(liveData){
    if(!liveData || !liveData.codes) return null;
    var mid = liveData.mid || 'vivo';
    var PP = {};
    ['home','away'].forEach(function(side){
      var meta = liveData[side]; if(!meta) return;
      var pfx = side==='home' ? '*' : 'a';
      var slug = side; /* clave estable */
      PP[slug] = buildTeam(liveData.codes, pfx, mid, meta.names||{}, meta.lib||[], meta.name);
    });
    return PP;
  };
})();
