/* ═══════════════════════════════════════════════════════════════════════
   VIDEO EN VIVO CON DELAY — Receptor para la tablet (dentro de panel_voley).
   - Se conecta por WebRTC al emisor (camara.html) usando Firebase para señalizar.
   - Bufferea el video en memoria (MediaRecorder) y lo reproduce con retraso.
   - Delay configurable (0–25 s) + botón "último punto" (replay del rally cerrado).
   Requiere fbSet/fbGet (firebase.js) ya cargados en la página.
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var ICE = { iceServers:[ {urls:'stun:stun.l.google.com:19302'}, {urls:'stun:stun1.l.google.com:19302'} ] };

  var pc = null;
  var viewerId = null;
  var salaId = null;
  var liveStream = null;        /* stream directo recibido del emisor */
  var recorder = null;          /* MediaRecorder para el buffer con delay */
  var chunks = [];              /* {t, blob} buffer rodante */
  var BUFFER_MAX_MS = 40000;    /* guardamos hasta 40 s hacia atrás */
  var delayMs = 8000;           /* delay actual (8 s por defecto, tipo DataVolley) */
  var playTimer = null;
  var connected = false;

  function $(id){ return document.getElementById(id); }

  /* ── conectar a una sala ── */
  function conectar(sala){
    if(connected) desconectar();
    salaId = String(sala).trim();
    viewerId = 'v'+Math.floor(Math.random()*1e9);
    setEstado('Conectando a la sala '+salaId+'…', 'wait');

    /* avisar al emisor que queremos conectarnos */
    fbSet('video_signal/'+salaId+'/requests/'+viewerId, { ts:Date.now() });

    pc = new RTCPeerConnection(ICE);
    var myCands = [];
    pc.onicecandidate = function(ev){
      if(ev.candidate){ myCands.push(ev.candidate.toJSON()); fbSet('video_signal/'+salaId+'/offer_cand/'+viewerId, myCands); }
    };
    pc.ontrack = function(ev){
      liveStream = ev.streams[0];
      onStreamRecibido(liveStream);
    };
    pc.onconnectionstatechange = function(){
      if(pc.connectionState==='connected'){ connected=true; setEstado('Conectado · en vivo', 'ok'); }
      else if(pc.connectionState==='failed'){ setEstado('No se pudo conectar. Revisá la sala y el WiFi.', 'err'); }
    };

    /* esperar la oferta del emisor */
    var tries=0;
    var wait = setInterval(function(){
      tries++;
      if(tries>40 || connected){ clearInterval(wait); if(!connected && tries>40) setEstado('El emisor no respondió. ¿La cámara está transmitiendo?', 'err'); return; }
      fbGet('video_signal/'+salaId+'/offer/'+viewerId, function(offer){
        if(offer && offer.sdp && !pc.currentRemoteDescription){
          pc.setRemoteDescription(new RTCSessionDescription(offer))
            .then(function(){ return pc.createAnswer(); })
            .then(function(ans){ return pc.setLocalDescription(ans).then(function(){ return ans; }); })
            .then(function(ans){ fbSet('video_signal/'+salaId+'/answer/'+viewerId, {type:ans.type, sdp:ans.sdp}); })
            .catch(function(e){ setEstado('Error al conectar: '+e.message, 'err'); });
        }
      });
      fbGet('video_signal/'+salaId+'/answer_cand/'+viewerId, function(cands){
        if(cands && Array.isArray(cands)){
          cands.forEach(function(c){ try{ pc.addIceCandidate(new RTCIceCandidate(c)); }catch(e){} });
        }
      });
    }, 800);
  }

  /* ── al recibir el stream: arrancar el buffer con delay ── */
  function onStreamRecibido(stream){
    var vLive = $('vd-live');
    if(vLive){ vLive.srcObject = stream; vLive.play().catch(function(){}); }

    /* grabamos en pedacitos para poder reproducir con retraso */
    chunks = [];
    try{
      var mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
      recorder = new MediaRecorder(stream, { mimeType:mime, videoBitsPerSecond: 2500000 });
      recorder.ondataavailable = function(e){
        if(e.data && e.data.size>0){
          chunks.push({ t:Date.now(), blob:e.data });
          /* podar lo viejo */
          var lim = Date.now() - BUFFER_MAX_MS;
          while(chunks.length && chunks[0].t < lim) chunks.shift();
        }
      };
      recorder.start(500);   /* un chunk cada 0.5 s */
      arrancarReproduccionConDelay();
    }catch(e){
      /* si MediaRecorder falla, al menos mostramos el vivo directo */
      setEstado('Conectado (sin delay: este navegador no soporta buffer).', 'ok');
    }
  }

  /* ── reproducir el buffer con el delay elegido ── */
  function arrancarReproduccionConDelay(){
    var vDelay = $('vd-delay');
    if(!vDelay) return;
    if(playTimer) clearInterval(playTimer);
    var ultimoServido = 0;
    playTimer = setInterval(function(){
      if(delayMs<=0){ return; }  /* delay 0 = se ve el vivo directo (otro elemento) */
      var objetivo = Date.now() - delayMs;
      /* juntar los chunks hasta el momento objetivo y reproducirlos */
      var relevantes = chunks.filter(function(c){ return c.t <= objetivo && c.t > ultimoServido; });
      if(relevantes.length){
        var blob = new Blob(relevantes.map(function(c){return c.blob;}), {type:'video/webm'});
        var url = URL.createObjectURL(blob);
        var prev = vDelay.src;
        vDelay.src = url;
        vDelay.play().catch(function(){});
        ultimoServido = relevantes[relevantes.length-1].t;
        if(prev) setTimeout(function(){ URL.revokeObjectURL(prev); }, 2000);
      }
    }, 1000);
  }

  /* ── cambiar el delay ── */
  function setDelay(seg){
    delayMs = Math.max(0, seg*1000);
    var lbl = $('vd-delay-lbl'); if(lbl) lbl.textContent = seg+' s';
    var vLive = $('vd-live'), vDelay = $('vd-delay');
    /* con delay 0 mostramos el vivo directo; con delay>0, el buffer */
    if(seg<=0){
      if(vLive) vLive.style.display='block';
      if(vDelay) vDelay.style.display='none';
    }else{
      if(vLive) vLive.style.display='none';
      if(vDelay) vDelay.style.display='block';
    }
  }

  /* ── replay del último punto: reproduce los últimos N segundos ── */
  function replayUltimoPunto(segAntes){
    segAntes = segAntes || 12;
    var vDelay = $('vd-delay');
    if(!vDelay || !chunks.length){ return; }
    var desde = Date.now() - (segAntes*1000);
    var relevantes = chunks.filter(function(c){ return c.t >= desde; });
    if(!relevantes.length) return;
    var blob = new Blob(relevantes.map(function(c){return c.blob;}), {type:'video/webm'});
    var url = URL.createObjectURL(blob);
    /* pausar la reproducción con delay mientras vemos el replay */
    var eraDelay = delayMs;
    delayMs = -1;   /* frenar el loop de delay */
    if($('vd-live')) $('vd-live').style.display='none';
    vDelay.style.display='block';
    vDelay.src = url;
    vDelay.currentTime = 0;
    vDelay.play().catch(function(){});
    var lbl=$('vd-estado-replay'); if(lbl){ lbl.style.display='block'; }
    vDelay.onended = function(){
      if(lbl) lbl.style.display='none';
      delayMs = (eraDelay>0?eraDelay:8000);   /* volver al modo delay */
      URL.revokeObjectURL(url);
      vDelay.onended = null;
    };
  }

  function desconectar(){
    connected=false;
    if(playTimer) clearInterval(playTimer);
    if(recorder && recorder.state!=='inactive'){ try{ recorder.stop(); }catch(e){} }
    if(pc){ try{ pc.close(); }catch(e){} pc=null; }
    if(salaId && viewerId){ fbSet('video_signal/'+salaId+'/requests/'+viewerId, null); }
    chunks=[]; liveStream=null;
    var vLive=$('vd-live'), vDelay=$('vd-delay');
    if(vLive) vLive.srcObject=null;
    if(vDelay) vDelay.src='';
    setEstado('Desconectado.', '');
  }

  function setEstado(msg, cls){
    var el=$('vd-estado'); if(!el) return;
    el.textContent=msg; el.className='vd-estado'+(cls?' '+cls:'');
  }

  /* API pública */
  window.VideoDelay = {
    conectar: conectar,
    desconectar: desconectar,
    setDelay: setDelay,
    replayUltimoPunto: replayUltimoPunto,
    estaConectado: function(){ return connected; }
  };
})();
