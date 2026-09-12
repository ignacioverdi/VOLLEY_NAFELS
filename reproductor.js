/* ============================================================================
   reproductor.js — EL MINI REPRODUCTOR, UNO SOLO PARA TODO EL SISTEMA
   ----------------------------------------------------------------------------
   Para que existe
   ---------------
   El jugador ve un numero —"18 errores de recepcion"— y quiere ver esas 18
   pelotas. No un video entero: esas.

   plan_partido.html ya tenia un reproductor asi, pero escrito adentro de esa
   pagina y atado a sus variables. Copiarlo al dashboard y a analisis habria
   dejado tres versiones, que es exactamente el problema que venimos peleando
   todo el dia: se arregla una, quedan dos mal.

   Asi que esta aca, solo, y lo usan todas.

   De donde salen los clips
   ------------------------
   NO se guarda nada nuevo. datos_video.js y datos_video_ent.js ya tienen
   CADA accion con jugador, fundamento, valoracion, tipo, set, segundo y
   video: 51.710 acciones, el 98% del total. Se filtra lo que se pide y listo.

   Duplicar ese dato habria sido crear una segunda fuente de la verdad y, tarde
   o temprano, una queda vieja.

   Como se usa
   -----------
       repAbrir({
         titulo: 'BARTHOLET · errores de recepción',
         num: 11,            // numero de camiseta (0 o null = todo el equipo)
         skill: 'R',         // S saque · R recepcion · A ataque · B bloqueo · D defensa
         ev: '=',            // la valoracion; puede ser una lista: ['#','+']
         tipo: 'E',          // 'P' partidos · 'E' entrenamientos · null los dos
         sesion: 'ENT20260911'   // opcional: una sesion puntual
       });
   ========================================================================== */

(function(){
  var YTP = null, YTListo = false, clips = [], cur = 0, vidCargado = '';
  var antes = 3, despues = 2, velocidad = 1, reloj = null, pausado = false;

  /* ── LOS CLIPS ──────────────────────────────────────────────────────────── */

  function _fuentes(tipo){
    var F = [];
    try{ if(tipo !== 'E' && window.VIDEO_DATA)     F.push(window.VIDEO_DATA); }catch(e){}
    try{ if(tipo !== 'P' && window.VIDEO_DATA_ENT) F.push(window.VIDEO_DATA_ENT); }catch(e){}
    return F;
  }

  /* Recorre las dos fuentes y devuelve las acciones que piden, ordenadas. */
  function repBuscar(f){
    var out = [], evs = null;
    if(f.ev != null) evs = Array.isArray(f.ev) ? f.ev.slice() : [f.ev];

    /* La estructura real del archivo, confirmada en build_video.py:
         VIDEO_DATA = { matches:{ codigo:{date, teams, players, actions:[...]} },
                        links:{ codigo:'idDeYouTube' } }
       Las acciones y el video estan SEPARADOS: las primeras en 'matches', el
       link en 'links', emparejados por el codigo del partido. */
    _fuentes(f.tipo).forEach(function(FUENTE){
      var partidos = FUENTE.matches || FUENTE.partidos || {};
      var links    = FUENTE.links || {};
      Object.keys(partidos).forEach(function(pid){
        if(f.sesion && String(pid) !== String(f.sesion)) return;
        var P = partidos[pid] || {};
        var lk = links[pid];
        var vid = (typeof lk === 'string') ? lk : (lk && (lk.vid || lk.id || lk.yt)) || '';
        /* Un id de YouTube son 11 caracteres; si vino una URL, se recorta. */
        if(vid && vid.length > 11){
          var mm = vid.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
          vid = mm ? mm[1] : vid;
        }
        var acciones = P.actions || P.acciones || [];
        if(!vid || !acciones.length) return;
        acciones.forEach(function(a){
          /* 'tm' dice de que equipo es la accion: las de los dos lados viven
             en la misma lista. Sin este filtro se mezclaban con el rival. */
          if(f.tm && String(a.tm||'') !== String(f.tm)) return;
          if(f.num && Number(a.num) !== Number(f.num)) return;
          if(f.skill && String(a.skill||a.sk||'') !== f.skill) return;
          if(evs && evs.indexOf(String(a.ev||'')) < 0) return;
          if(f.ty && String(a.ty||'') !== f.ty) return;
          out.push({ vid: vid, t: Number(a.t)||0, num: a.num,
                     name: a.name||'', ev: a.ev||'', set: a.set||'',
                     tm: a.tm||'', pid: pid });
        });
      });
    });
    out.sort(function(x,y){ return (x.pid===y.pid) ? x.t-y.t : (x.pid<y.pid?-1:1); });
    return out;
  }

  /* ── LA PANTALLA ────────────────────────────────────────────────────────── */

  function _hhmmss(s){
    s = Math.max(0, Math.round(s));
    var h = Math.floor(s/3600), m = Math.floor(s%3600/60), g = s%60;
    return (h ? h+':' : '') + (m<10&&h?'0':'')+m + ':' + (g<10?'0':'') + g;
  }

  function repCerrar(){
    try{ clearInterval(reloj); }catch(e){}
    try{ if(YTP && YTP.stopVideo) YTP.stopVideo(); }catch(e){}
    var v = document.getElementById('rep-caja');
    if(v) v.remove();
    document.removeEventListener('keydown', _teclas);
    clips = []; cur = 0; vidCargado = '';
  }

  function _teclas(e){
    if(e.key === 'Escape'){ repCerrar(); return; }
    if(e.key === 'ArrowRight'){ e.preventDefault(); repSiguiente(); }
    if(e.key === 'ArrowLeft'){  e.preventDefault(); repAnterior(); }
    if(e.key === ' '){ e.preventDefault(); repPausa(); }
  }

  function repAbrir(f){
    repCerrar();
    clips = repBuscar(f);
    cur = 0;

    if(!clips.length){
      _pintar(f.titulo || 'Video', '<div style="padding:26px 16px;text-align:center;color:#64748b;'
        + 'font-size:13px;line-height:1.6">No hay video de estas acciones.<br>'
        + '<span style="font-size:11.5px">Puede que esa sesión todavía no tenga el video cargado.</span></div>', true);
      return;
    }
    _pintar(f.titulo || 'Video', _armarCuerpo(), false);
    _cargarYT();
  }

  function _armarCuerpo(){
    return ''
     + '<div id="rep-yt" style="width:100%;aspect-ratio:16/9;background:#000;border-radius:9px;'
     +      'overflow:hidden"></div>'
     + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;'
     +      'margin-top:9px">'
     +   '<button onclick="repAnterior()" style="'+_btn()+'">\u25c0</button>'
     +   '<button onclick="repPausa()" id="rep-pausa" style="'+_btn()+';flex:1">Pausar</button>'
     +   '<button onclick="repRepetir()" style="'+_btn()+'">\u21ba</button>'
     +   '<button onclick="repSiguiente()" style="'+_btn()+'">\u25b6</button>'
     + '</div>'
     + '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;'
     +      'font-size:11px;color:#64748b">'
     +   '<span id="rep-cuenta">1 / '+clips.length+'</span>'
     +   '<span>'
     +     'velocidad '
     +     [0.5,0.75,1].map(function(v){
            return '<button onclick="repVel('+v+')" id="rep-v'+String(v).replace('.','_')+'" style="'
              + 'background:none;border:none;color:'+(v===1?'#e2e8f0':'#64748b')+';font-size:11px;'
              + 'cursor:pointer;padding:0 3px;font-weight:'+(v===1?'800':'400')+'">'+v+'\u00d7</button>';
          }).join('')
     +   '</span>'
     + '</div>'
     + '<div id="rep-lista" style="margin-top:9px;max-height:132px;overflow:auto;'
     +      'border-top:1px solid rgba(148,163,184,.14);padding-top:7px"></div>';
  }

  function _btn(){
    return 'padding:7px 10px;background:rgba(148,163,184,.12);border:1px solid rgba(148,163,184,.2);'
         + 'border-radius:7px;color:#cbd5e1;font-size:12px;font-weight:700;cursor:pointer;'
         + 'font-family:inherit';
  }

  function _pintar(titulo, cuerpo, soloCerrar){
    var html = ''
     + '<div id="rep-caja" style="position:fixed;inset:0;z-index:9500;display:flex;'
     +      'align-items:center;justify-content:center;background:rgba(2,6,23,.86);padding:14px">'
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
    var c = document.createElement('div');
    c.innerHTML = html;
    var nodo = c.firstChild;
    nodo.addEventListener('click', function(e){ if(e.target === nodo) repCerrar(); });
    document.body.appendChild(nodo);
    document.addEventListener('keydown', _teclas);
  }

  /* ── YOUTUBE ────────────────────────────────────────────────────────────── */

  function _cargarYT(){
    if(window.YT && window.YT.Player){ _crearPlayer(); return; }
    if(!document.getElementById('rep-yt-api')){
      var s = document.createElement('script');
      s.id = 'rep-yt-api';
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    var antes_cb = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function(){
      try{ if(typeof antes_cb === 'function') antes_cb(); }catch(e){}
      _crearPlayer();
    };
  }

  function _crearPlayer(){
    var caja = document.getElementById('rep-yt');
    if(!caja) return;
    YTP = new YT.Player('rep-yt', {
      height:'100%', width:'100%',
      playerVars:{ controls:1, rel:0, modestbranding:1, playsinline:1 },
      events:{ onReady: function(){ YTListo = true; repIr(0); } }
    });
  }

  /* ── LOS CONTROLES ──────────────────────────────────────────────────────── */

  function repIr(i){
    if(!clips.length) return;
    cur = Math.max(0, Math.min(clips.length-1, i));
    var a = clips[cur], inicio = Math.max(0, a.t - antes);
    if(!YTListo || !YTP) return;
    if(a.vid !== vidCargado){
      vidCargado = a.vid;
      YTP.loadVideoById({ videoId:a.vid, startSeconds:inicio });
    } else {
      YTP.seekTo(inicio, true);
      YTP.playVideo();
    }
    try{ YTP.setPlaybackRate(velocidad); }catch(e){}
    pausado = false;
    var bp = document.getElementById('rep-pausa'); if(bp) bp.textContent = 'Pausar';
    var c = document.getElementById('rep-cuenta');
    if(c) c.textContent = (cur+1) + ' / ' + clips.length;
    _lista();
    /* Corta al final del clip y pasa al siguiente. */
    clearInterval(reloj);
    var fin = a.t + despues;
    reloj = setInterval(function(){
      try{
        if(!YTP || !YTP.getCurrentTime) return;
        if(YTP.getCurrentTime() >= fin){
          clearInterval(reloj);
          if(cur < clips.length-1) repIr(cur+1);
          else YTP.pauseVideo();
        }
      }catch(e){}
    }, 200);
  }

  function repSiguiente(){ repIr(cur+1); }
  function repAnterior(){  repIr(cur-1); }
  function repRepetir(){   repIr(cur); }
  function repPausa(){
    if(!YTP) return;
    try{
      if(pausado){ YTP.playVideo(); pausado = false; }
      else { YTP.pauseVideo(); pausado = true; clearInterval(reloj); }
      var b = document.getElementById('rep-pausa');
      if(b) b.textContent = pausado ? 'Seguir' : 'Pausar';
    }catch(e){}
  }
  function repVel(v){
    velocidad = v;
    try{ if(YTP) YTP.setPlaybackRate(v); }catch(e){}
    [0.5,0.75,1].forEach(function(x){
      var b = document.getElementById('rep-v'+String(x).replace('.','_'));
      if(b){ b.style.color = (x===v) ? '#e2e8f0' : '#64748b';
             b.style.fontWeight = (x===v) ? '800' : '400'; }
    });
  }

  function _lista(){
    var L = document.getElementById('rep-lista');
    if(!L) return;
    L.innerHTML = clips.map(function(a,i){
      var act = (i===cur);
      return '<div onclick="repIr('+i+')" style="display:flex;align-items:center;gap:8px;'
        + 'padding:4px 7px;border-radius:6px;cursor:pointer;font-size:11.5px;'
        + 'background:'+(act?'rgba(148,163,184,.14)':'transparent')+';'
        + 'color:'+(act?'#e2e8f0':'#94a3b8')+'">'
        + '<span style="min-width:20px;color:#64748b">'+(i+1)+'</span>'
        + '<span style="flex:1">'+(a.name||('#'+a.num))+'</span>'
        + (a.set ? '<span style="color:#64748b">set '+a.set+'</span>' : '')
        + '<span style="color:#64748b;min-width:52px;text-align:right">'+_hhmmss(a.t)+'</span>'
        + '</div>';
    }).join('');
    var act = L.children[cur];
    if(act && act.scrollIntoView) act.scrollIntoView({block:'nearest'});
  }

  /* ── LO QUE VE EL RESTO DEL SISTEMA ─────────────────────────────────────── */
  window.repAbrir     = repAbrir;
  window.repBuscar    = repBuscar;
  window.repCerrar    = repCerrar;
  window.repIr        = repIr;
  window.repSiguiente = repSiguiente;
  window.repAnterior  = repAnterior;
  window.repRepetir   = repRepetir;
  window.repPausa     = repPausa;
  window.repVel       = repVel;
})();
