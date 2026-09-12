/* ============================================================================
   reproductor.js — EL MISMO REPRODUCTOR DEL PLAN DE PARTIDO
   ----------------------------------------------------------------------------
   No es uno nuevo. Es EL DE PLAN DE PARTIDO, sacado de ahi tal cual:
   su HTML, su CSS y sus funciones, sin reescribir una linea.

   Yo habia escrito otro y trajo problemas nuevos: acciones que no coincidian,
   controles que faltaban. Ya teniamos uno que funciona y esta probado hace
   meses; lo correcto era traerlo, no inventar.

   Lo que trae, igual que alla:
       Antes / Despues    cuantos segundos ver de cada lado de la accion
       Velocidad          0.5x  1x  1.5x  2x
       Anterior / Repetir / Siguiente
       Pantalla completa (tecla F)
       La lista de acciones, con tildes para elegir cuales ver
       Guardar la seleccion

   Lo unico que se agrego —porque plan_partido no lo necesita— es la funcion
   de ENTRADA: repAbrir({num, fund, ev, sesion}), que arma los clips desde
   PP_DATA con los mismos indices que usa plan_partido y despues llama a su
   reproductor de siempre.
   ========================================================================== */

(function(){
  'use strict';

  /* ── LAS VARIABLES, IGUAL QUE EN PLAN DE PARTIDO ────────────────────────── */
  var YTP=null, YTReady=false, clips=[], cur=0, loadedVid="", vtimer=null;
  var pre=2, post=8, speed=1, curKey='', VSEL={}, onlyShow=false;
  /* TAGFMT en plan_partido traduce el codigo de la jugada a nombre legible.
     Aca la etiqueta ya viene armada (la fecha de la sesion), asi que va vacio
     y la funcion usa el valor tal cual, que es lo que queremos. */
  var TAGFMT = {};

  /* ── DONDE ESTA CADA DATO — la tabla de ROLECFG de plan_partido ─────────── */
  var CAMPOS = {
    atk: { ev:5, t:7, vid:8, tag:0 },
    sq:  { ev:3, t:5, vid:6, tag:0 },
    rec: { ev:3, t:5, vid:6, tag:0 },
    def: { ev:3, t:5, vid:6, tag:0 },
    blq: { ev:2, t:3, vid:4, tag:0 }
  };
  var ROLES = {
    atk: ['punta','central','opuesto','armador','libero'],
    sq:  ['saque'], rec: ['reception'], def: ['defense'], blq: ['bloqueo']
  };

  /* ── EL VIDEO DE CADA SESION — la logica de ppVid, igual ────────────────── */
  function _info(code){
    try{ if(window.INFO && window.INFO[code]) return window.INFO[code]; }catch(e){}
    try{
      var D = window.PP_DATA || {};
      for(var eq in D){ var I = D[eq] && D[eq].info; if(I && I[code]) return I[code]; }
    }catch(e){}
    return null;
  }
  function _porFecha(inf, M1, M2){
    if(!inf || !inf.date) return '';
    var d = String(inf.date).replace(/\D/g,''); if(d.length!==8) return '';
    var turno = inf.turno || '';
    for(var i=0;i<2;i++){
      var M = (i===0)?M1:M2;
      if(turno && M['ENT'+d+turno]) return M['ENT'+d+turno];
      if(!turno && M['ENT'+d]) return M['ENT'+d];
      var hits=[]; for(var k in M){ if(M[k] && String(k).replace(/\D/g,'')===d) hits.push(k); }
      if(hits.length===1) return M[hits[0]];
    }
    return '';
  }
  function ppVid(code){
    var inf = _info(code);
    var ent = !!(inf && inf.tipo === 'entrenamiento');
    var M1 = (ent ? window.MAPA_VIDEOS_ENT : window.MAPA_VIDEOS) || {};
    var M2 = (ent ? window.MAPA_VIDEOS : window.MAPA_VIDEOS_ENT) || {};
    var u = M1[code] || M2[code] || '';
    if(!u && ent) u = _porFecha(inf, M1, M2);
    if(!u) return '';
    u = String(u);
    var m = u.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (u.length===11 ? u : '');
  }
  function _sesionTxt(code){
    var inf = _info(code);
    if(!inf || !inf.date) return String(code||'').slice(0,12);
    var d = String(inf.date).split('-');
    var t = (d.length===3) ? (d[2]+'/'+d[1]) : inf.date;
    if(inf.turno === 'M') t += ' mañana';
    else if(inf.turno === 'T') t += ' tarde';
    return t;
  }

  /* ── ARMAR LOS CLIPS ────────────────────────────────────────────────────── */
  function repBuscar(f){
    var out=[], C=CAMPOS[f.fund];
    if(!C) return out;
    var roles = ROLES[f.fund] || [];
    var evs = (f.ev==null) ? null : (Array.isArray(f.ev) ? f.ev : [f.ev]);
    var D = window.PP_DATA || {};
    Object.keys(D).forEach(function(eq){
      ((D[eq] && D[eq].players) || []).forEach(function(p){
        if(roles.indexOf(p.role) < 0) return;
        if(f.num && Number(p.num) !== Number(f.num)) return;
        (p.data || []).forEach(function(a){
          if(evs && evs.indexOf(String(a[C.ev])) < 0) return;
          var code = a[C.vid];
          if(f.sesion && String(code) !== String(f.sesion)) return;
          var vid = ppVid(code); if(!vid) return;
          var t = Number(a[C.t]); if(!t && t!==0) return;
          out.push({ vid:vid, t:t, code:code, ses:_sesionTxt(code),
                     name:p.name || ('#'+p.num), num:p.num,
                     ev:String(a[C.ev]||''), tag:_sesionTxt(code), sel:true });
        });
      });
    });
    out.sort(function(x,y){
      return (x.code===y.code) ? x.t-y.t : (String(x.code)<String(y.code)?-1:1);
    });
    return out;
  }


  /* ══ LAS FUNCIONES DE PLAN DE PARTIDO, TAL CUAL ═══════════════════════ */

  function clipId(c){return c.vid+"_"+Math.round(c.t);}

  function firstSel(){for(var i=0;i<clips.length;i++)if(clips[i].sel)return i;return 0;}

  function applySavedSel(){var s=VSEL[curKey];if(s&&s.length){var set={};for(var i=0;i<s.length;i++)set[s[i]]=1;for(var j=0;j<clips.length;j++)clips[j].sel=!!set[clipId(clips[j])];}}

  function saveSel(){if(!clips.length)return;var a=[];for(var i=0;i<clips.length;i++)if(clips[i].sel)a.push(clipId(clips[i]));VSEL[curKey]=a;try{localStorage.setItem("pp_vsel",JSON.stringify(VSEL));}catch(e){}if(typeof fbSet==="function"){fbSet("pp_vsel",VSEL);}var b=document.getElementById("vsavebtn");if(b){b.textContent="✓ Guardado";b.classList.add("saved");setTimeout(function(){b.textContent="💾 Guardar";b.classList.remove("saved");},1500);}}

  function toggleClip(i){if(clips[i]){clips[i].sel=!clips[i].sel;renderList();}}

  function clipAll(on){for(var i=0;i<clips.length;i++)clips[i].sel=!!on;renderList();}

  function toggleOnly(){var vo=document.getElementById("vonly");onlyShow=vo?vo.checked:false;renderList();}

  function renderList(){var sel=0;for(var k=0;k<clips.length;k++)if(clips[k].sel)sel++;var sc=document.getElementById("vselcount");if(sc)sc.textContent=sel+"/"+clips.length;
    document.getElementById("vlist").innerHTML=clips.map(function(c,i){if(onlyShow&&!c.sel)return "";return '<label class="vitem'+(i===cur?" playing":"")+(c.sel?"":" off")+'"><input type="checkbox" '+(c.sel?"checked":"")+' onclick="event.stopPropagation();toggleClip('+i+')"><span class="vlbl" onclick="jump('+i+')">'+(i+1)+". "+(TAGFMT[c.tag]||c.tag)+" "+evLabel(c.ev)+'</span></label>';}).join("");}

  function playCur(){if(!YTReady||!clips.length)return;var a=clips[cur],start=Math.max(0,a.t-pre);if(a.vid!==loadedVid){loadedVid=a.vid;YTP.loadVideoById({videoId:a.vid,startSeconds:start});}else{YTP.seekTo(start,true);var _st=(YTP.getPlayerState?YTP.getPlayerState():-1);if(_st!==1&&_st!==3)YTP.playVideo();}try{YTP.setPlaybackRate(speed);}catch(e){}document.getElementById("vcount").textContent=(cur+1)+" / "+clips.length;renderList();clearInterval(vtimer);var end=a.t+post;vtimer=setInterval(function(){if(YTP&&YTP.getCurrentTime&&YTP.getCurrentTime()>=end){var n=nextSel(cur,1);if(n>=0){cur=n;playCur();}else{clearInterval(vtimer);try{YTP.pauseVideo();}catch(e){}}}},200);}

  function nextClip(){var n=nextSel(cur,1);if(n>=0){cur=n;playCur();}}

  function prevClip(){var n=nextSel(cur,-1);if(n>=0){cur=n;playCur();}}

  function replayCur(){playCur();}

  function togglePlay(){if(!YTP||!YTP.getPlayerState)return;var st=YTP.getPlayerState();if(st===1)YTP.pauseVideo();else YTP.playVideo();}

  function setSpeed(v){speed=parseFloat(v);if(YTP&&YTP.setPlaybackRate){try{YTP.setPlaybackRate(speed);}catch(e){}}}

  function toggleFullV(){
    var el=document.querySelector(".vmain"); if(!el) return;
    if(enPantallaCompleta()){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }
    else { var f=el.requestFullscreen||el.webkitRequestFullscreen; if(f) f.call(el); }
  }

  function closeV(){document.getElementById("vmodal").style.display="none";clearInterval(vtimer);if(YTP&&YTP.pauseVideo)YTP.pauseVideo();}

  /* ══ LAS AUXILIARES QUE USAN ESAS FUNCIONES, TAMBIEN DE PLAN DE PARTIDO ═ */

  function evLabel(ev){if(ev==="#")return'<span class="r-pt">punto</span>';if(ev==="/")return'<span class="r-bl">bloq</span>';if(ev==="=")return'<span class="r-er">error</span>';return ev;}

  function jump(i){cur=i;playCur();}

  function nextSel(from,dir){var i=from;for(var k=0;k<clips.length;k++){i+=dir;if(i<0||i>=clips.length)return -1;if(clips[i].sel)return i;}return -1;}

  function enPantallaCompleta(){return !!(document.fullscreenElement||document.webkitFullscreenElement);}

  /* saveSel en plan_partido sincroniza por Firebase con fbSet. Aca no hace
     falta —la seleccion es personal del jugador— asi que si fbSet no existe
     queda solo en localStorage, que es lo que hace plan_partido igual cuando
     Firebase no esta cargado. */
  function fbSet(){ return null; }

  var REP_CSS = ".vmodal{display:none;position:fixed;inset:0;background:rgba(4,5,9,.8);z-index:99998;align-items:center;justify-content:center;padding:16px}\n.vpanel{background:var(--card);border:1px solid var(--border);border-radius:12px;width:min(1060px,100%);max-height:95vh;overflow:auto}\n.vhead{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--border)}\n.vtitle{font-family:'Bebas Neue',sans-serif;font-size:20px;flex:1;letter-spacing:.02em}\n.vclose{background:var(--card2);color:var(--txt);border:1px solid var(--border);border-radius:7px;width:32px;height:32px;font-size:15px;cursor:pointer}\n.vfilters{display:flex;gap:8px;flex-wrap:wrap;padding:10px 14px;border-bottom:1px solid var(--border)}\n.vplayer{position:relative;width:100%;aspect-ratio:16/9;background:#000}\n.vplayer iframe,.vplayer>div{position:absolute;inset:0;width:100%;height:100%}\n.vshield{position:absolute;inset:0;width:100%;height:100%;z-index:5;cursor:pointer;background:transparent}\n.vmain:fullscreen{background:#000;display:flex;flex-direction:column;justify-content:center}\n.vmain:fullscreen .vplayer{flex:1;min-height:0;aspect-ratio:auto}\n.vmain:fullscreen #ytplayer,.vmain:fullscreen #ytplayer iframe{width:100%!important;height:100%!important}\n.vmain:fullscreen .vctrls{flex:none;background:#0b0e14}\n.vmain:-webkit-full-screen{background:#000;display:flex;flex-direction:column;justify-content:center}\n.vmain:-webkit-full-screen .vplayer{flex:1;min-height:0;aspect-ratio:auto}\n.vmain:-webkit-full-screen #ytplayer iframe{width:100%!important;height:100%!important}\n.vmain:-webkit-full-screen .vctrls{flex:none;background:#0b0e14}\n.vctrls{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:11px 14px;color:var(--mut);font-size:12.5px}\n.vctrls button{background:var(--red);color:#fff;border:none;border-radius:7px;padding:7px 11px;font-family:'Barlow Condensed';font-weight:600;font-size:13px;cursor:pointer}\n.vctrls button.sec{background:var(--card2);color:var(--txt);border:1px solid var(--border)}\n.vctrls .vcount{font-weight:700;color:var(--txt);min-width:52px;text-align:center}\n.vctrls label{display:flex;align-items:center;gap:4px;color:var(--faint)}\n.vctrls input{width:46px;background:var(--card2);color:var(--txt);border:1px solid var(--border);border-radius:6px;padding:4px 6px;font-size:12px}\n.vbody{display:flex;align-items:stretch}\n.vmain{flex:1;min-width:0}\n.vside{width:290px;border-left:1px solid var(--border);display:flex;flex-direction:column;max-height:72vh}\n.vside-head{display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--border)}\n.vside-head b{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:.03em;flex:1}\n.vside-head #vselcount{font-size:12px;color:var(--faint);margin-right:4px}\n.vside-head button{font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--mut);cursor:pointer}\n.vside-head button:hover{border-color:var(--red);color:var(--txt)}\n.vside-head2{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border)}\n.vonly{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--mut);cursor:pointer}\n.vonly input{accent-color:var(--red);cursor:pointer}\n.vlist{display:flex;flex-direction:column;gap:2px;padding:8px;overflow:auto}\n.vbody{flex-direction:column}\n.vside{width:auto;border-left:none;border-top:1px solid var(--border);max-height:230px}\n.vmodal{display:none!important}\n.vmain\"); if(!el) return;\n  if(enPantallaCompleta()){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }";
  var REP_HTML = "<div id=\"vmodal\" class=\"vmodal\" onclick=\"if(event.target===this)closeV()\">\n  <div class=\"vpanel\">\n    <div class=\"vhead\"><div id=\"vtitle\" class=\"vtitle\"></div><button class=\"vclose\" onclick=\"closeV()\">\u2715</button></div>\n    <div class=\"vfilters\" id=\"vfilters\"></div>\n    <div class=\"vbody\">\n      <div class=\"vmain\">\n        <div class=\"vplayer\"><div id=\"ytplayer\"></div><div class=\"vshield\" id=\"vshield\" onclick=\"togglePlay()\" title=\"Click o barra espaciadora: play/pausa\"></div></div>\n        <div class=\"vctrls\">\n          <button class=\"sec\" onclick=\"prevClip()\">\u25c0</button>\n          <button onclick=\"replayCur()\">\u21bb Repetir</button>\n          <button class=\"sec\" onclick=\"nextClip()\">\u25b6</button>\n          <button class=\"sec\" id=\"vfsbtn\" onclick=\"toggleFullV()\" title=\"Pantalla completa (tecla F)\">\u26f6 Pantalla completa</button>\n          <span class=\"vcount\" id=\"vcount\"></span>\n          <label>Vel <select id=\"vspeed\" onchange=\"setSpeed(this.value)\" style=\"width:auto\"><option value=\"0.5\">0.5\u00d7</option><option value=\"1\" selected>1\u00d7</option><option value=\"1.5\">1.5\u00d7</option><option value=\"2\">2\u00d7</option></select></label>\n          <label>Antes <input id=\"vpre\" type=\"number\" value=\"2\" min=\"0\" max=\"20\" onchange=\"pre=+this.value||2\"></label>\n          <label>Despu\u00e9s <input id=\"vpost\" type=\"number\" value=\"8\" min=\"0\" max=\"20\" onchange=\"post=+this.value||8\"></label>\n        </div>\n      </div>\n      <div class=\"vside\">\n        <div class=\"vside-head\"><b>Acciones</b><span id=\"vselcount\"></span><button onclick=\"clipAll(1)\">Todas</button><button onclick=\"clipAll(0)\">Ninguna</button></div>\n        <div class=\"vside-head2\"><button id=\"vsavebtn\" onclick=\"saveSel()\">\ud83d\udcbe Guardar</button><label class=\"vonly\"><input type=\"checkbox\" id=\"vonly\" onchange=\"toggleOnly()\"> Solo seleccionadas</label></div>\n        <div id=\"vlist\" class=\"vlist\"></div>\n      </div>\n    </div>\n  </div>\n</div>";

  /* ══ LA ENTRADA — lo unico nuevo ══════════════════════════════════════════
     Arma los clips y abre el reproductor de siempre. */
  function repAbrir(f){
    clips = repBuscar(f);
    cur = 0;
    _montar();
    var ttl = document.getElementById('vtitle');
    if(ttl) ttl.textContent = (f.titulo || '') + ' \u00b7 ' + clips.length + ' acciones';
    var fil = document.getElementById('vfilters');
    if(fil) fil.style.display = 'none';       /* los filtros son del plan */
    document.getElementById('vmodal').style.display = 'flex';
    if(!clips.length){
      document.getElementById('vlist').innerHTML =
        '<div style="padding:16px;color:#64748b;font-size:12px;line-height:1.6">'
        + 'No hay video de estas acciones.<br>Puede que esa sesión todavía no '
        + 'tenga el video cargado.</div>';
      return;
    }
    curKey = 'rep|' + (f.num||'eq') + '|' + f.fund + '|' + (f.ev||'');
    applySavedSel();
    cur = firstSel();
    renderList();
    _cargarYT();
  }

  /* El HTML y el CSS se inyectan una sola vez. */
  function _montar(){
    if(document.getElementById('vmodal')) return;
    var st = document.createElement('style');
    st.textContent = REP_CSS;
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.innerHTML = REP_HTML;
    document.body.appendChild(d.firstElementChild);
    document.addEventListener('keydown', function(e){
      if(!document.getElementById('vmodal') ||
         document.getElementById('vmodal').style.display !== 'flex') return;
      if(e.key==='Escape'){ closeV(); }
      else if(e.key==='ArrowRight'){ e.preventDefault(); nextClip(); }
      else if(e.key==='ArrowLeft'){ e.preventDefault(); prevClip(); }
      else if(e.key===' '){ e.preventDefault(); togglePlay(); }
      else if(e.key==='f'||e.key==='F'){ toggleFullV(); }
    });
  }

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
    if(YTP){ YTReady=true; playCur(); return; }
    if(!document.getElementById('ytplayer')) return;
    YTP = new YT.Player('ytplayer', {
      height:'100%', width:'100%',
      playerVars:{ controls:1, rel:0, modestbranding:1, playsinline:1 },
      events:{ onReady: function(){ YTReady=true; playCur(); } }
    });
  }

  window.repAbrir=repAbrir; window.repBuscar=repBuscar;
  window.closeV=closeV; window.nextClip=nextClip; window.prevClip=prevClip;
  window.replayCur=replayCur; window.togglePlay=togglePlay; window.setSpeed=setSpeed;
  window.toggleClip=toggleClip; window.clipAll=clipAll; window.saveSel=saveSel;
  window.toggleOnly=toggleOnly; window.toggleFullV=toggleFullV;
  window.repCerrar=closeV;
})();
