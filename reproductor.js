/* ============================================================================
   reproductor.js — EL MINI REPRODUCTOR
   ----------------------------------------------------------------------------
   Por que esta version
   --------------------
   La primera la escribi yo recorriendo VIDEO_DATA a mi manera, y mostraba
   cualquier accion: no era la que el jugador habia tocado.

   plan_partido YA TIENE todo esto resuelto y probado. Asi que esta version no
   inventa nada: usa exactamente sus datos y su misma forma de leerlos.

   De donde sale cada cosa — tal cual en plan_partido
   --------------------------------------------------
     PP_DATA[equipo].players    cada jugador con su lista de acciones en .data
     MAPA_VIDEOS / _ENT         el link de YouTube por codigo de partido
     ROLECFG                    en que posicion de cada accion esta cada dato

   Cada accion es un ARRAY, no un objeto, y la posicion de los campos cambia
   segun el fundamento. Eso es lo que yo no habia entendido:

       ataque      evaluacion en [5]  ·  segundo en [7]   ·  partido en [8]
       saque       evaluacion en [3]  ·  segundo en [5]   ·  partido en [6]
       recepcion   evaluacion en [3]  ·  segundo en [5]   ·  partido en [6]
       defensa     evaluacion en [3]  ·  segundo en [5]   ·  partido en [6]
       bloqueo     evaluacion en [2]  ·  segundo en [3]   ·  partido en [4]

   Leyendo el campo equivocado salian acciones que no tenian nada que ver.

   Como se usa
   -----------
       repAbrir({ titulo:'...', num:11, fund:'rec', ev:'=' });

       fund: 'sq' saque · 'rec' recepcion · 'def' defensa
             'blq' bloqueo · 'atk' ataque
   ========================================================================== */

(function(){

  /* ── DONDE ESTA CADA DATO, POR FUNDAMENTO ───────────────────────────────── */
  var CAMPOS = {
    atk: { ev:5, t:7, vid:8, tag:0 },
    sq:  { ev:3, t:5, vid:6, tag:0 },
    rec: { ev:3, t:5, vid:6, tag:0 },
    def: { ev:3, t:5, vid:6, tag:0 },
    blq: { ev:2, t:3, vid:4, tag:0 }
  };
  /* que 'role' de PP_DATA corresponde a cada fundamento */
  var ROLES = {
    atk: ['punta','central','opuesto','armador','libero'],
    sq:  ['saque'],
    rec: ['reception'],
    def: ['defense'],
    blq: ['bloqueo']
  };

  var YTP=null, listo=false, clips=[], cur=0, vidCargado='';
  var antes=2, despues=8, velocidad=1, reloj=null, pausado=false;

  /* ══ EL VIDEO DE CADA SESION ═══════════════════════════════════════════════
     Esto es lo que yo habia hecho mal. El codigo del partido que traen las
     acciones y la clave del mapa de videos NO COINCIDEN:

         la accion dice     E2026-09-10-20260910AXPE
         el mapa tiene      ENT20260910T

     Yo buscaba la clave tal cual y no encontraba nada, asi que caia en
     cualquier video. plan_partido ya tenia esto resuelto: empareja por FECHA
     y por TURNO. Esta es su misma logica, copiada tal cual.

     El turno importa: el 08/09 hubo dos sesiones, y sin mirarlo las acciones
     de la mañana se llevaban el video de la tarde.

     Y si hay varias sesiones ese dia y no se sabe cual, NO SE ADIVINA: es
     preferible que no abra nada a que muestre una jugada equivocada. */

  function _info(code){
    /* INFO vive en TEAMS[TEAM].info dentro de plan_partido. Desde afuera se
       arma igual, desde PP_DATA. */
    try{
      if(window.INFO && window.INFO[code]) return window.INFO[code];
    }catch(e){}
    try{
      var D = window.PP_DATA || {};
      for(var eq in D){
        var I = D[eq] && D[eq].info;
        if(I && I[code]) return I[code];
      }
    }catch(e){}
    return null;
  }

  function _porFecha(inf, M1, M2){
    if(!inf || !inf.date) return '';
    var d = String(inf.date).replace(/\D/g,'');
    if(d.length !== 8) return '';
    var turno = inf.turno || '';
    for(var i=0;i<2;i++){
      var M = (i===0) ? M1 : M2;
      if(turno && M['ENT'+d+turno]) return M['ENT'+d+turno];
      if(!turno && M['ENT'+d])      return M['ENT'+d];
      var hits = [];
      for(var k in M){ if(M[k] && String(k).replace(/\D/g,'') === d) hits.push(k); }
      if(hits.length === 1) return M[hits[0]];
      /* varias ese dia y sin turno: no se adivina */
    }
    return '';
  }

  function _vid(code){
    var inf = _info(code);
    var ent = !!(inf && inf.tipo === 'entrenamiento');
    var M1 = (ent ? window.MAPA_VIDEOS_ENT : window.MAPA_VIDEOS) || {};
    var M2 = (ent ? window.MAPA_VIDEOS : window.MAPA_VIDEOS_ENT) || {};
    var u = M1[code] || M2[code] || '';
    if(!u && ent) u = _porFecha(inf, M1, M2);
    if(!u && !inf){
      /* sin info, se intenta igual por si el codigo ya es una clave del mapa */
      u = (window.MAPA_VIDEOS_ENT||{})[code] || (window.MAPA_VIDEOS||{})[code] || '';
    }
    if(!u) return '';
    u = String(u);
    var m = u.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (u.length === 11 ? u : '');
  }

  /* ── BUSCAR LAS ACCIONES ────────────────────────────────────────────────── */
  function repBuscar(f){
    var out = [];
    var C = CAMPOS[f.fund];
    if(!C) return out;
    var roles = ROLES[f.fund] || [];
    var evs = f.ev == null ? null : (Array.isArray(f.ev) ? f.ev : [f.ev]);

    var D = window.PP_DATA || {};
    Object.keys(D).forEach(function(eq){
      /* si se pidio un equipo, solo ese */
      if(f.equipo && String(eq) !== String(f.equipo)) return;
      var P = (D[eq] && D[eq].players) || [];
      P.forEach(function(p){
        if(roles.indexOf(p.role) < 0) return;
        if(f.num && Number(p.num) !== Number(f.num)) return;
        (p.data || []).forEach(function(a){
          if(evs && evs.indexOf(String(a[C.ev])) < 0) return;
          var code = a[C.vid];
          var vid = _vid(code);
          if(!vid) return;
          var t = Number(a[C.t]);
          if(!t && t !== 0) return;
          out.push({ vid:vid, t:t, code:code,
                     name:p.name || ('#'+p.num), num:p.num,
                     ev:String(a[C.ev]||''), tag:String(a[C.tag]||'') });
        });
      });
    });
    /* por partido y despues por minuto: se ven en el orden en que pasaron */
    out.sort(function(x,y){
      return (x.code === y.code) ? x.t - y.t : (String(x.code) < String(y.code) ? -1 : 1);
    });
    return out;
  }

  /* ── LA PANTALLA ────────────────────────────────────────────────────────── */
  function _hms(s){
    s = Math.max(0, Math.round(s));
    var h=Math.floor(s/3600), m=Math.floor(s%3600/60), g=s%60;
    return (h?h+':':'') + ((m<10&&h)?'0':'')+m + ':' + (g<10?'0':'') + g;
  }

  function repCerrar(){
    try{ clearInterval(reloj); }catch(e){}
    try{ if(YTP && YTP.stopVideo) YTP.stopVideo(); }catch(e){}
    var v=document.getElementById('rep-caja'); if(v) v.remove();
    document.removeEventListener('keydown', _teclas);
    clips=[]; cur=0; vidCargado='';
  }
  function _teclas(e){
    if(e.key==='Escape'){ repCerrar(); return; }
    if(e.key==='ArrowRight'){ e.preventDefault(); repIr(cur+1); }
    if(e.key==='ArrowLeft'){  e.preventDefault(); repIr(cur-1); }
    if(e.key===' '){ e.preventDefault(); repPausa(); }
  }

  function repAbrir(f){
    repCerrar();
    clips = repBuscar(f);
    cur = 0;
    if(!clips.length){
      _pintar(f.titulo||'Video',
        '<div style="padding:24px 14px;text-align:center;color:#64748b;font-size:13px;'
        + 'line-height:1.6">No hay video de estas acciones.<br>'
        + '<span style="font-size:11.5px">Puede que esa sesión todavía no tenga el '
        + 'video cargado en Cargar Videos.</span></div>');
      return;
    }
    _pintar(f.titulo||'Video', _cuerpo());
    _cargarYT();
  }

  function _btn(){
    return 'padding:7px 10px;background:rgba(148,163,184,.12);border:1px solid rgba(148,163,184,.2);'
         + 'border-radius:7px;color:#cbd5e1;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit';
  }

  function _cuerpo(){
    return ''
     + '<div id="rep-yt" style="width:100%;aspect-ratio:16/9;background:#000;border-radius:9px;overflow:hidden"></div>'
     + '<div style="display:flex;gap:7px;margin-top:9px">'
     +   '<button onclick="repIr(cur-1)" style="'+_btn()+'">\u25c0</button>'
     +   '<button onclick="repPausa()" id="rep-pausa" style="'+_btn()+';flex:1">Pausar</button>'
     +   '<button onclick="repIr(cur)" style="'+_btn()+'">\u21ba</button>'
     +   '<button onclick="repIr(cur+1)" style="'+_btn()+'">\u25b6</button>'
     + '</div>'
     + '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:11px;color:#64748b">'
     +   '<span id="rep-cuenta">1 / '+clips.length+'</span>'
     +   '<span>velocidad '
     +     [0.5,0.75,1].map(function(v){
            return '<button onclick="repVel('+v+')" id="rep-v'+String(v).replace('.','_')+'" '
              + 'style="background:none;border:none;font-size:11px;cursor:pointer;padding:0 3px;'
              + 'color:'+(v===1?'#e2e8f0':'#64748b')+';font-weight:'+(v===1?'800':'400')+'">'+v+'\u00d7</button>';
          }).join('')
     +   '</span>'
     + '</div>'
     + '<div id="rep-lista" style="margin-top:9px;max-height:130px;overflow:auto;'
     +      'border-top:1px solid rgba(148,163,184,.14);padding-top:7px"></div>';
  }

  function _pintar(titulo, cuerpo){
    var html = ''
     + '<div id="rep-caja" style="position:fixed;inset:0;z-index:9500;display:flex;align-items:center;'
     +      'justify-content:center;background:rgba(2,6,23,.86);padding:14px">'
     + '<div style="background:#0f172a;border:1px solid rgba(148,163,184,.25);border-radius:14px;'
     +      'max-width:560px;width:100%;max-height:92vh;overflow:auto;'
     +      'box-shadow:0 22px 60px rgba(0,0,0,.7);font-family:Barlow Condensed,sans-serif">'
     +   '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;'
     +        'padding:11px 14px;border-bottom:1px solid rgba(148,163,184,.16)">'
     +     '<div style="font-size:12.5px;font-weight:800;letter-spacing:.5px;color:#e2e8f0;'
     +          'text-transform:uppercase">'+titulo+'</div>'
     +     '<button onclick="repCerrar()" style="background:none;border:none;color:#64748b;'
     +        'font-size:22px;line-height:1;cursor:pointer;padding:0 3px">&times;</button>'
     +   '</div>'
     +   '<div style="padding:12px 14px 14px">'+cuerpo+'</div>'
     + '</div></div>';
    var c=document.createElement('div'); c.innerHTML=html;
    var n=c.firstChild;
    n.addEventListener('click', function(e){ if(e.target===n) repCerrar(); });
    document.body.appendChild(n);
    document.addEventListener('keydown', _teclas);
  }

  /* ── YOUTUBE ────────────────────────────────────────────────────────────── */
  function _cargarYT(){
    if(window.YT && window.YT.Player){ _player(); return; }
    if(!document.getElementById('rep-yt-api')){
      var s=document.createElement('script');
      s.id='rep-yt-api'; s.src='https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function(){
      try{ if(typeof prev==='function') prev(); }catch(e){}
      _player();
    };
  }
  function _player(){
    if(!document.getElementById('rep-yt')) return;
    YTP = new YT.Player('rep-yt', {
      height:'100%', width:'100%',
      playerVars:{ controls:1, rel:0, modestbranding:1, playsinline:1 },
      events:{ onReady: function(){ listo=true; repIr(0); } }
    });
  }

  /* ── CONTROLES ──────────────────────────────────────────────────────────── */
  function repIr(i){
    if(!clips.length) return;
    cur = Math.max(0, Math.min(clips.length-1, i));
    var a = clips[cur], ini = Math.max(0, a.t - antes);
    if(!listo || !YTP) return;
    if(a.vid !== vidCargado){
      vidCargado = a.vid;
      YTP.loadVideoById({ videoId:a.vid, startSeconds:ini });
    } else {
      YTP.seekTo(ini, true); YTP.playVideo();
    }
    try{ YTP.setPlaybackRate(velocidad); }catch(e){}
    pausado=false;
    var bp=document.getElementById('rep-pausa'); if(bp) bp.textContent='Pausar';
    var c=document.getElementById('rep-cuenta');
    if(c) c.textContent=(cur+1)+' / '+clips.length;
    _lista();
    clearInterval(reloj);
    var fin = a.t + despues;
    reloj = setInterval(function(){
      try{
        if(!YTP || !YTP.getCurrentTime) return;
        if(YTP.getCurrentTime() >= fin){
          clearInterval(reloj);
          if(cur < clips.length-1) repIr(cur+1); else YTP.pauseVideo();
        }
      }catch(e){}
    }, 200);
  }
  function repPausa(){
    if(!YTP) return;
    try{
      if(pausado){ YTP.playVideo(); pausado=false; }
      else { YTP.pauseVideo(); pausado=true; clearInterval(reloj); }
      var b=document.getElementById('rep-pausa');
      if(b) b.textContent = pausado ? 'Seguir' : 'Pausar';
    }catch(e){}
  }
  function repVel(v){
    velocidad=v;
    try{ if(YTP) YTP.setPlaybackRate(v); }catch(e){}
    [0.5,0.75,1].forEach(function(x){
      var b=document.getElementById('rep-v'+String(x).replace('.','_'));
      if(b){ b.style.color=(x===v)?'#e2e8f0':'#64748b'; b.style.fontWeight=(x===v)?'800':'400'; }
    });
  }
  function _lista(){
    var L=document.getElementById('rep-lista'); if(!L) return;
    L.innerHTML = clips.map(function(a,i){
      var act=(i===cur);
      return '<div onclick="repIr('+i+')" style="display:flex;align-items:center;gap:8px;'
        + 'padding:4px 7px;border-radius:6px;cursor:pointer;font-size:11.5px;'
        + 'background:'+(act?'rgba(148,163,184,.14)':'transparent')+';'
        + 'color:'+(act?'#e2e8f0':'#94a3b8')+'">'
        + '<span style="min-width:20px;color:#64748b">'+(i+1)+'</span>'
        + '<span style="flex:1">'+a.name+'</span>'
        + (a.tag ? '<span style="color:#64748b">'+a.tag+'</span>' : '')
        + '<span style="color:#64748b;min-width:50px;text-align:right">'+_hms(a.t)+'</span>'
        + '</div>';
    }).join('');
    var e=L.children[cur];
    if(e && e.scrollIntoView) e.scrollIntoView({block:'nearest'});
  }

  window.repAbrir=repAbrir; window.repBuscar=repBuscar; window.repCerrar=repCerrar;
  window.repIr=repIr; window.repPausa=repPausa; window.repVel=repVel;
  Object.defineProperty(window,'cur',{get:function(){return cur;},configurable:true});
})();
