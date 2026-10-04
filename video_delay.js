/* ═══════════════════════════════════════════════════════════════════════
   VIDEO EN VIVO CON DELAY — Receptor para la tablet (dentro de panel_voley).
   - Se conecta por WebRTC al emisor (camara.html) usando Firebase para señalizar.
   - Bufferea el video en memoria (MediaRecorder) y lo reproduce con retraso.
   - Delay configurable (0–25 s) + botón "último punto" (replay del rally cerrado).
   Requiere fbSet/fbGet (firebase.js) ya cargados en la página.
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* Video: usa fbSet/fbGet de firebase.js, que firman con la sesion del usuario.
     Solo si no estuvieran cargados cae al acceso directo (compatibilidad). */
  function videoSet(path, value){
    if(typeof fbSet==='function'){ try{ return fbSet(path, value); }catch(e){} }
    try{ var u=(typeof FB_URL!=='undefined'?FB_URL:'https://nafels-voley-default-rtdb.firebaseio.com'); fetch(u+'/'+path+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)}).catch(function(){}); }catch(e){}
  }
  function videoGet(path, cb){
    if(typeof fbGet==='function'){ try{ return fbGet(path, cb); }catch(e){} }
    try{ var u=(typeof FB_URL!=='undefined'?FB_URL:'https://nafels-voley-default-rtdb.firebaseio.com'); fetch(u+'/'+path+'.json').then(function(r){return r.json();}).then(function(d){cb(d);}).catch(function(){cb(null);}); }catch(e){ cb(null); }
  }


  var ICE = { iceServers:[ {urls:'stun:stun.l.google.com:19302'}, {urls:'stun:stun1.l.google.com:19302'} ] };

  var pc = null;
  var viewerId = null;
  var salaId = null;
  var liveStream = null;        /* stream directo recibido del emisor */
  var recorder = null;          /* MediaRecorder para el buffer con delay */
  var chunks = [];              /* {t, blob} buffer rodante */
  var BUFFER_MAX_MS = 40000;    /* guardamos hasta 40 s hacia atrás */
  var delayMs = 0;              /* delay actual: arranca en 0 (vivo directo) para ver imagen al instante */
  var playTimer = null;
  var connected = false;

  /* ══ QUE PASA CUANDO SE CAE EL WIFI DEL GIMNASIO ═════════════════════════
     Hasta ahora, nada. onconnectionstatechange miraba 'connected' y 'failed'
     y se olvidaba de 'disconnected', que es justo lo que manda el navegador
     cuando la red parpadea un segundo —lo normal en un gimnasio con el wifi
     compartido por todos—. La imagen se congelaba y habia que darse cuenta,
     cerrar, volver a escribir el codigo de sala y esperar. En medio de un set.

     Ahora la conexion se rearma sola. Se espera un poco mas en cada intento
     —3, 6, 12, hasta 20 segundos— para no castigar una red que ya esta
     sufriendo, y el cartel dice en cual va, asi uno sabe si esperar o ir a
     mover el telefono de lugar.

     Si el que cierra es el usuario, no se reintenta nada: queremos() pasa a
     false y los reintentos pendientes se descartan.                         */
  var queremos = false;        /* el usuario pidio estar conectado */
  var reintento = 0;
  var reTimer = null;
  var RE_MAX = 12;

  function programarReintento(motivo){
    if(!queremos) return;
    if(reTimer) return;                    /* ya hay uno en camino */
    if(reintento >= RE_MAX){
      setEstado('Se cortó y no pudo volver después de '+RE_MAX+' intentos. Tocá Conectar.', 'err');
      return;
    }
    reintento++;
    var espera = Math.min(3000 * Math.pow(2, reintento-1), 20000);
    setEstado(motivo+' · reintento '+reintento+' en '+Math.round(espera/1000)+' s…', 'wait');
    reTimer = setTimeout(function(){
      reTimer = null;
      if(!queremos) return;
      var sala = salaId;
      _cerrarConexion();
      if(sala) conectar(sala, true);
    }, espera);
  }

  function $(id){ return document.getElementById(id); }

  /* ══════════════════════════════════════════════════════════════════════════
     LA CAMARA ENCHUFADA A ESTA MISMA COMPUTADORA
     El camino de siempre es: el telefono filma, manda el video por WebRTC a
     traves del wifi del gimnasio, y aca se vuelve a comprimir para poder
     retrasarlo. Son dos compresiones y una red en el medio, y la red del
     gimnasio muchas veces bloquea las conexiones entre dispositivos.

     Con una camara enchufada por USB —una webcam, una capturadora de HDMI, o
     la camara virtual de OBS— no hay nada de eso: el video entra directo, sin
     red y sin la primera compresion. Es como trabajan las apps de delay que
     andan bien, que hacen todo dentro de un solo aparato.

     El resto del motor no cambia: onStreamRecibido() ya recibe un stream y no
     pregunta de donde salio.
     ══════════════════════════════════════════════════════════════════════════ */
  var localStream = null;

  function camaras(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return Promise.resolve([]);
    return navigator.mediaDevices.enumerateDevices().then(function(ds){
      return ds.filter(function(d){ return d.kind === 'videoinput'; });
    }).catch(function(){ return []; });
  }

  function conectarLocal(deviceId){
    queremos = true; reintento = 0; _rearmes = 0;
    if(connected) _cerrarConexion();
    salaId = null; viewerId = null;
    setEstado('Abriendo la cámara…', 'wait');
    var c = { audio:false, video:{ width:{ideal:1920}, height:{ideal:1080}, frameRate:{ideal:60} } };
    if(deviceId) c.video.deviceId = { exact: deviceId };
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      setEstado('Este navegador no deja abrir la cámara.', 'err'); return;
    }
    navigator.mediaDevices.getUserMedia(c).then(function(st){
      localStream = st; liveStream = st; connected = true;
      var t = st.getVideoTracks()[0];
      /* 'motion' le avisa al navegador que esto es deporte: prioriza que no se
         arrastre la imagen antes que el detalle fino de un cuadro quieto. */
      if(t){ try{ t.contentHint = 'motion'; }catch(e){} }
      onStreamRecibido(st);
      _vigilarVida();
    }).catch(function(e){
      var n = (e && e.name) || 'error';
      setEstado(n === 'NotReadableError'
        ? 'La cámara está ocupada por otro programa. Cerrá el que la esté usando y probá de nuevo.'
        : n === 'NotAllowedError'
        ? 'El navegador no dio permiso para la cámara. Permitila y volvé a intentar.'
        : 'No pude abrir la cámara (' + n + ').', 'err');
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LA LINEA QUE DICE CON QUE ESTA ANDANDO
     Sin esto, «se ve mal» y «se traba» son opiniones. El motor ya contaba los
     tirones, las podas forzadas y los pedacitos que no entraron, pero no los
     miraba nadie. Acá se muestran, junto con la resolucion real que entro y
     los megabits con los que se esta comprimiendo.

     Si dice 640×360, el problema esta en la camara o en la red y no hay ajuste
     del grabador que lo arregle. Si los tirones suben solos, el problema es el
     buffer. Son dos caminos distintos y este renglon los separa. */
  var _diagTimer = null;
  function _pintarDiag(){
    var el = $('vd-diag'); if(!el) return;
    var t = liveStream && liveStream.getVideoTracks ? liveStream.getVideoTracks()[0] : null;
    var sg = (t && t.getSettings) ? t.getSettings() : {};
    var d = (BD && BD.diag) ? BD.diag : null;
    var _m = (BD && BD.mime) || _mimeUsado || '';
    var _b = (BD && BD.bitrate) || _bitsCiclos || 0;
    var cod = _m ? String(_m).replace('video/','').replace(/;\s*co/, ' ').replace('decs=','').replace(/"/g,'') : '—';
    var mb = _b ? (_b/1000000).toFixed(0) + ' Mbps' : '—';
    var partes = [];
    partes.push((sg.width||'?') + '×' + (sg.height||'?') + (sg.frameRate ? ' · ' + Math.round(sg.frameRate) + ' fps' : ''));
    partes.push(cod + ' · ' + mb);
    partes.push(BD ? 'buffer continuo' : 'clips de 12 s');
    if(d) partes.push('tirones ' + (d.esperas||0) + ' · podas ' + (d.podadosForzados||0) + ' · perdidos ' + (d.trozosRechazados||0));
    el.textContent = partes.join('   ·   ');
  }
  function _arrancarDiag(){
    if(_diagTimer) clearInterval(_diagTimer);
    _pintarDiag();
    _diagTimer = setInterval(_pintarDiag, 2000);
  }

  /* ══ EL REARME SE AGOTABA Y NO VOLVIA ══════════════════════════════════════
     Si se corta la imagen, el motor se rearma solo, pero el contador llegaba a
     tres y no volvia a cero hasta que alguien tocaba Conectar a mano. En un
     partido de dos horas con tres microcortes, el cuarto dejaba la pantalla en
     negro sin que nadie se enterara.

     Ahora, despues de un minuto y medio seguido con video entrando, el
     presupuesto se repone. Tres cortes en un minuto siguen siendo motivo para
     avisar que algo anda mal; tres cortes repartidos en dos horas no. */
  var _vidaTimer = null;
  function _vigilarVida(){
    if(_vidaTimer) clearTimeout(_vidaTimer);
    _vidaTimer = setTimeout(function(){ _rearmes = 0; _vidaTimer = null; }, 90000);
  }

  /* ── conectar a una sala ── */
  function conectar(sala, esReintento){
    if(!esReintento){ queremos = true; reintento = 0; _rearmes = 0; }
    if(connected) _cerrarConexion();
    salaId = String(sala).trim();
    viewerId = 'v'+Math.floor(Math.random()*1e9);
    setEstado('Conectando a la sala '+salaId+'…', 'wait');

    /* avisar al emisor que queremos conectarnos */
    videoSet('video_signal/'+salaId+'/requests/'+viewerId, { ts:Date.now() });

    pc = new RTCPeerConnection(ICE);
    var myCands = [];
    pc.onicecandidate = function(ev){
      if(ev.candidate){ myCands.push(ev.candidate.toJSON()); videoSet('video_signal/'+salaId+'/offer_cand/'+viewerId, myCands); }
    };
    pc.ontrack = function(ev){
      liveStream = ev.streams[0];
      onStreamRecibido(liveStream);
    };
    pc.onconnectionstatechange = function(){
      var st = pc.connectionState;
      if(st==='connected'){
        connected=true; reintento=0;
        if(reTimer){ clearTimeout(reTimer); reTimer=null; }
        setEstado('Conectado · en vivo', 'ok');
      }
      else if(st==='disconnected'){
        /* Un parpadeo de red: muchas veces vuelve solo en uno o dos segundos.
           Se le da esa chance antes de rearmar todo. */
        connected=false;
        setEstado('Se cortó la señal… esperando que vuelva', 'wait');
        setTimeout(function(){
          if(pc && pc.connectionState==='disconnected') programarReintento('Se perdió la conexión');
        }, 4000);
      }
      else if(st==='failed'){
        connected=false;
        /* ══ EL 90% DE LAS VECES ES LA RED, NO LA SALA ═══════════════════
           El mensaje viejo —"Revisá la sala y el WiFi"— manda a revisar el
           codigo, que casi nunca es el problema. Cuando WebRTC llega a
           'failed' despues de juntar candidatos, lo que pasa es que los dos
           aparatos no se ven entre si: wifi de invitados con los clientes
           aislados, o cada uno en una red distinta. Eso se arregla poniendo
           los dos en la misma red o compartiendo datos del celular, y
           conviene que lo diga el cartel. */
        /* El primer intento se hace callado: muchas veces 'failed' es un
           tropiezo y vuelve enseguida. Del segundo en adelante ya no es
           casualidad, y ahi si conviene decir que es la red. Ponerlo antes
           de programarReintento no servia de nada: el cartel del reintento
           lo tapaba a los milisegundos. */
        programarReintento(reintento >= 1
          ? 'La cámara y esta pantalla no se ven en esta red — poné las dos en la misma WiFi o compartí datos del celular'
          : 'Sin conexión');
      }
    };

    /* esperar la oferta del emisor */
    /* ══ ESPERAR A LA CAMARA SIN RENDIRSE ═══════════════════════════════
       Antes esto probaba 40 veces cada 800 ms y a los 32 segundos se daba
       por vencido para siempre. Pero el orden natural es abrir el panel
       PRIMERO y prender la camara despues, cuando el equipo sale a la
       cancha: a los 32 segundos la camara todavia no empezo y el panel ya
       se rindio, sin que nadie se entere hasta que mira la pantalla.

       Ahora sigue esperando. Pasados los primeros 30 segundos baja el
       ritmo a una consulta cada 3 segundos —para no castigar la red ni la
       base— y el cartel dice que sigue esperando a la camara.             */
    var tries=0, wait=null;
    function _mirar(){
      tries++;
      if(connected || !queremos){ clearInterval(wait); wait=null; return; }
      if(tries===38){
        setEstado('Esperando a que la cámara empiece a transmitir…', 'wait');
        clearInterval(wait);
        wait = setInterval(_mirar, 3000);
      }
      videoGet('video_signal/'+salaId+'/offer/'+viewerId, function(offer){
        if(offer && offer.sdp && !pc.currentRemoteDescription){
          pc.setRemoteDescription(new RTCSessionDescription(offer))
            .then(function(){ return pc.createAnswer(); })
            .then(function(ans){ return pc.setLocalDescription(ans).then(function(){ return ans; }); })
            .then(function(ans){ videoSet('video_signal/'+salaId+'/answer/'+viewerId, {type:ans.type, sdp:ans.sdp}); })
            .catch(function(e){ setEstado('Error al conectar: '+e.message, 'err'); });
        }
      });
      videoGet('video_signal/'+salaId+'/answer_cand/'+viewerId, function(cands){
        if(cands && Array.isArray(cands)){
          cands.forEach(function(c){ try{ pc.addIceCandidate(new RTCIceCandidate(c)); }catch(e){} });
        }
      });
    }
    wait = setInterval(_mirar, 800);
    _espTimer = wait;
  }
  var _espTimer = null;

  /* ═══════════════════════════════════════════════════════════════════
     GRABACIÓN EN CICLOS CERRADOS (para que cada clip sea REPRODUCIBLE).
     El MediaRecorder graba de a un ciclo completo (CICLO_MS). Al cerrarse,
     queda un video WebM válido con su encabezado → se puede reproducir fluido.
     Guardamos los últimos ciclos para delay y para "último punto".
     ═══════════════════════════════════════════════════════════════════ */
  var CICLO_MS = 12000;          /* cada clip dura 12 s */
  var MAX_CICLOS = 5;            /* guardamos los últimos 5 (~60 s hacia atrás) */
  var ciclos = [];              /* [{ini, fin, url, blob}] clips cerrados y reproducibles */
  var cicloBuf = [];            /* pedazos del ciclo en curso */
  var cicloIni = 0;
  var recTimer = null;
  var _mimeUsado = '';          /* con que se esta grabando, para el renglon */
  var _bitsCiclos = 0;
  var rallyMarks = [];          /* timestamps de fin de cada punto (del scout) */
  var _lastRally = -1;

  /* ══ MOTOR NUEVO, CON EL VIEJO DE RESPALDO ═══════════════════════════════
     El metodo de clips de 12 segundos deja un corte en cada empalme, no
     permite elegir el retraso de verdad y se queda esperando cuando un clip
     todavia no cerro. Eso es lo que se siente como que "se traba".

     delay_buffer.js arma un solo video continuo y el retraso es moverse
     dentro de el. Si el navegador no lo soporta, arrancar() devuelve false y
     se sigue con los clips: nadie se queda sin video.                       */
  var BD = null;
  var _rearmes = 0;        /* cuantas veces se rearmo el motor sin exito */

  function onStreamRecibido(stream){
    var vLive = $('vd-live'), vDelay = $('vd-delay');
    if(vLive){
      vLive.srcObject = stream; vLive.muted = true; vLive.setAttribute('playsinline','');
      vLive.play().catch(function(){}); vLive.style.display='block';
    }
    if(vDelay){ vDelay.style.display='none'; }
    setEstado('Conectado · en vivo', 'ok');

    if(typeof BufferDelay === 'function' && vDelay){
      BD = new BufferDelay(vDelay);
      BD.onEstado = setEstado;
      /* ══ SI DEJA DE ENTRAR IMAGEN, SE REARMA SOLO ════════════════════════
         El motor avisa cuando el final del buffer deja de moverse. Eso quiere
         decir que no llega nada: o se murio el grabador de esta maquina, o el
         celular dejo de mandar. Rearmar el motor con el mismo video que ya
         esta llegando cuesta un segundo y arregla el primer caso. Si el que
         no manda es el celular, el cartel lo dice y hay que ir hasta alla.
         Se intenta tres veces y despues se deja de insistir. */
      BD.onMuerto = function(){
        if(_rearmes >= 3){ setEstado('No entra imagen. Fijate el celular: pantalla prendida y transmitiendo.', 'err'); return; }
        _rearmes++;
        setEstado('Se cortó la imagen · rearmando el video con retraso ('+_rearmes+' de 3)…', 'wait');
        setTimeout(function(){
          if(!liveStream) return;
          try{ if(BD){ BD.parar(); } }catch(e){}
          BD = null;
          onStreamRecibido(liveStream);
        }, 500);
      };
      if(BD.arrancar(stream)){
        escucharCierreDeRally();
        _vigilarVida();
        _arrancarDiag();
        return;                      /* motor nuevo andando */
      }
      BD = null;                     /* no se pudo: se sigue como antes */
    }
    iniciarGrabacionEnCiclos(stream);
    escucharCierreDeRally();
    _arrancarDiag();
  }

  /* ══ EL MOTOR VIEJO TAMBIEN MERECE BUENA IMAGEN ═══════════════════════════
     El arreglo del codec y del bitrate estaba solo en delay_buffer.js, o sea
     solo en el motor nuevo. Pero el de clips es el que viene funcionando en la
     cancha, y grababa igual que siempre: VP8 —el codec mas viejo— y los 2,5
     Mbps por defecto del navegador para cualquier resolucion.

     Medido en la notebook del club, misma camara y misma escena: 1,27 Mbps
     como estaba, 6,86 pidiendo 12. Cinco veces mas informacion.

     Ahora los dos motores graban igual de bien. Asi la mejora de imagen no
     depende de cual de los dos este corriendo, y si algun dia hay que volver
     al viejo no se pierde.

     Diferencia con el otro motor: aca el clip se reproduce directo en un
     <video>, no por MediaSource. Entonces lo que hay que preguntar es si el
     elemento lo sabe reproducir, no si MediaSource lo acepta. */
  function _mimeCiclos(){
    if(!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    var v = document.createElement('video');
    /* OJO con el orden, que aca NO es el mismo que en el otro motor.
       El motor nuevo arma un video continuo con MediaSource y ahi mp4 con
       H.264 es lo mejor y esta verificado en la notebook del club.

       Este motor hace otra cosa: guarda cada clip como blob y se lo da
       directo a un <video>. Ese camino con WebM y VP9 es el mas transitado y
       el que menos sorpresas da, y la ganancia grande viene del bitrate, no
       del codec. Como este es el motor que viene funcionando en la cancha, se
       elige lo conservador: VP9 primero. */
    var cand = ['video/webm;codecs=vp9',
                'video/mp4;codecs="avc1.4d402a"',
                'video/mp4;codecs="avc1.42E01E"',
                'video/webm;codecs=vp8',
                'video/webm'];
    for(var i=0;i<cand.length;i++){
      var m = cand[i];
      if(!MediaRecorder.isTypeSupported(m)) continue;
      var puede = '';
      try{ puede = v.canPlayType(m); }catch(e){ puede = ''; }
      if(puede) return m;
    }
    return '';
  }

  /* graba de a ciclos completos; cada ciclo cerrado es un video reproducible */
  function iniciarGrabacionEnCiclos(stream){
    ciclos = []; cicloBuf = [];
    var mime = _mimeCiclos();
    _mimeUsado = mime;
    function nuevoCiclo(){
      if(!stream || !stream.active) return;
      cicloBuf = []; cicloIni = Date.now();
      var rec;
      /* el bitrate sale del alto real del video que esta entrando, igual que
         en el otro motor: 12 Mbps en 1080p, 6 en 720p, 3 abajo */
      var _bits = 6000000;
      try{
        var _t = stream.getVideoTracks()[0];
        var _alto = (_t && _t.getSettings && _t.getSettings().height) || 720;
        _bits = _alto >= 1080 ? 12000000 : _alto >= 720 ? 6000000 : 3000000;
      }catch(e){}
      _bitsCiclos = _bits;
      var _opts = mime ? { mimeType:mime, videoBitsPerSecond:_bits }
                       : { videoBitsPerSecond:_bits };
      try{ rec = new MediaRecorder(stream, _opts); }
      catch(e){
        /* si rechaza el bitrate, antes que quedarse sin video se graba como se pueda */
        try{ rec = new MediaRecorder(stream, mime?{mimeType:mime}:undefined); }
        catch(e2){ return; }
      }
      rec.ondataavailable = function(e){ if(e.data && e.data.size>0) cicloBuf.push(e.data); };
      rec.onstop = function(){
        if(cicloBuf.length){
          var blob = new Blob(cicloBuf, {type:'video/webm'});
          var url = URL.createObjectURL(blob);
          ciclos.push({ ini:cicloIni, fin:Date.now(), url:url, blob:blob });
          while(ciclos.length>MAX_CICLOS){ var viejo=ciclos.shift(); try{ URL.revokeObjectURL(viejo.url); }catch(e){} }
        }
        /* arrancar el siguiente ciclo enseguida */
        if(connected) nuevoCiclo();
      };
      rec.start();
      recorder = rec;
      /* cerrar este ciclo a los CICLO_MS */
      recTimer = setTimeout(function(){ try{ if(rec.state!=='inactive') rec.stop(); }catch(e){} }, CICLO_MS);
    }
    nuevoCiclo();
  }

  /* escuchar cuándo el scout cierra un punto (voley_live.rally sube) */
  function escucharCierreDeRally(){
    if(_ralloTimer) clearInterval(_ralloTimer);
    _ralloTimer = setInterval(function(){
      videoGet('voley_live', function(d){
        if(d && typeof d.rally==='number'){
          if(_lastRally<0){ _lastRally=d.rally; return; }
          if(d.rally>_lastRally){
            _lastRally = d.rally;
            if(BD) BD.marcarPunto();       /* queda marcado DENTRO del video */
            rallyMarks.push(Date.now());   /* acá terminó un punto */
            if(rallyMarks.length>20) rallyMarks.shift();
            var b=$('vd-replay-hint'); if(b){ b.style.display='block'; setTimeout(function(){ b.style.display='none'; },3000); }
          }
        }
      });
    }, 1500);
  }
  var _ralloTimer = null;

  /* ── DELAY CONTINUO: reproducir el ciclo anterior (ya cerrado y fluido) ── */
  function setDelay(seg){
    if(BD){
      var vLive=$('vd-live'), vDelay=$('vd-delay');
      BD.setRetraso(seg);
      /* Con 0 se muestra el directo, que tiene menos latencia todavia. */
      if(vLive)  vLive.style.display  = seg<=0 ? 'block' : 'none';
      if(vDelay) vDelay.style.display = seg<=0 ? 'none'  : 'block';
      var lbl=$('vd-delay-lbl'); if(lbl) lbl.textContent = seg+' s';
      return;
    }
    delayMs = Math.max(0, seg*1000);
    var lbl = $('vd-delay-lbl'); if(lbl) lbl.textContent = seg+' s';
    var vLive=$('vd-live'), vDelay=$('vd-delay');
    if(seg<=0){
      if(playTimer){ clearInterval(playTimer); playTimer=null; }
      if(vLive) vLive.style.display='block';
      if(vDelay){ vDelay.style.display='none'; vDelay.onended=null; }
      setEstado('En vivo', 'ok');
      return;
    }
    setEstado('Delay '+seg+' s · preparando…', 'wait');
    if(playTimer) clearInterval(playTimer);
    /* reproducir en cadena los ciclos ya cerrados, con el atraso pedido */
    playTimer = setInterval(reproducirDelay, 1500);
  }

  /* ── DELAY CONTINUO fluido, sin salto entre ciclos ──
     Un solo video visible. El truco anti-salto: precargamos el siguiente clip
     en un elemento oculto (queda en caché del navegador), así cuando el visible
     termina, el siguiente carga al instante (ya está en memoria). */
  var vdPrecarga = null;

  function _precargar(url){
    if(!url) return;
    if(!vdPrecarga){ vdPrecarga = document.createElement('video'); vdPrecarga.muted=true; vdPrecarga.preload='auto'; vdPrecarga.style.display='none'; }
    if(vdPrecarga.src !== url){ vdPrecarga.src = url; vdPrecarga.load(); }
  }

  function reproducirDelay(){
    if(delayMs<=0) return;
    var vDelay=$('vd-delay'), vLive=$('vd-live');
    if(!vDelay || !ciclos.length) return;
    /* si ya está reproduciendo, no interrumpir */
    if(vDelay.style.display==='block' && !vDelay.paused && !vDelay.ended) return;
    var objetivo = Date.now() - delayMs;
    var idx = -1;
    for(var i=0;i<ciclos.length;i++){ if(ciclos[i].ini<=objetivo && ciclos[i].fin>=objetivo){ idx=i; break; } }
    if(idx<0) idx = 0;
    if(!ciclos[idx]) return;
    if(vLive) vLive.style.display='none';
    vDelay.style.display='block';
    _reproducirCiclo(idx);
  }

  /* reproduce el ciclo idx y encadena con el siguiente al terminar */
  function _reproducirCiclo(idx){
    var v = $('vd-delay');
    if(!v || !ciclos[idx]) return;
    v.srcObject=null;
    v.muted=true; v.setAttribute('playsinline','');
    v.oncanplay = function(){ var p=v.play(); if(p&&p.catch) p.catch(function(){ setTimeout(function(){ if(v.paused) v.play().catch(function(){}); },200); }); };
    v.src = ciclos[idx].url;
    v.load();
    setEstado('Delay '+(delayMs/1000)+' s', 'ok');
    /* precargar el siguiente para que el cambio sea instantáneo */
    if(ciclos[idx+1]) _precargar(ciclos[idx+1].url);
    v.onended = function(){
      if(ciclos[idx+1]){ _reproducirCiclo(idx+1); }
      else {
        /* alcanzamos el presente: seguir con el ciclo más nuevo que aparezca */
        var espera = setInterval(function(){
          if(ciclos[idx+1]){ clearInterval(espera); _reproducirCiclo(idx+1); }
          else if(delayMs<=0){ clearInterval(espera); }
        }, 500);
      }
    };
  }

  function reproducirClip(url, onended){
    var vDelay=$('vd-delay');
    if(!vDelay) return;
    vDelay.srcObject=null;
    vDelay.muted=true;
    vDelay.setAttribute('playsinline','');
    vDelay.onended = function(){ if(onended) try{ onended(); }catch(e){} };
    var intentado=false;
    function arrancar(){
      if(intentado) return; intentado=true;
      var p = vDelay.play();
      if(p && p.catch) p.catch(function(){ intentado=false; setTimeout(function(){ if(vDelay.paused) vDelay.play().catch(function(){}); }, 300); });
    }
    vDelay.oncanplay = arrancar;
    vDelay.onloadeddata = arrancar;
    vDelay.src=url;
    vDelay.load();
    setTimeout(function(){ if(vDelay.paused) arrancar(); }, 500);
  }

  /* ── ÚLTIMO PUNTO: reproducir el clip que contiene el último rally cerrado ── */
  function replayUltimoPunto(segAntes){
    var vDelay=$('vd-delay'), vLive=$('vd-live');
    if(!ciclos.length){ setEstado('Todavía no hay video grabado.', 'wait'); return; }
    /* momento del último punto (si el scout lo marcó); si no, "ahora - 10s" */
    var momento = rallyMarks.length ? rallyMarks[rallyMarks.length-1] : (Date.now()-10000);
    /* buscar el ciclo que contiene ese momento */
    var elegido=null;
    for(var i=0;i<ciclos.length;i++){ if(ciclos[i].ini<=momento && ciclos[i].fin>=momento){ elegido=ciclos[i]; break; } }
    if(!elegido) elegido = ciclos[ciclos.length-1];   /* el más reciente cerrado */
    if(!elegido){ setEstado('El punto todavía se está grabando, probá en un segundo.', 'wait'); return; }

    if(playTimer){ clearInterval(playTimer); playTimer=null; }   /* pausar el delay mientras vemos el replay */
    var lbl=$('vd-estado-replay'); if(lbl) lbl.style.display='block';
    if(vLive) vLive.style.display='none';
    vDelay.style.display='block';
    reproducirClip(elegido.url, function(){
      if(lbl) lbl.style.display='none';
      /* volver a vivo tras el replay */
      if(vLive) vLive.style.display='block';
      vDelay.style.display='none';
    });
  }

  /* El usuario se va: no se reintenta mas nada. */
  function desconectar(){
    queremos = false;
    reintento = 0;
    if(reTimer){ clearTimeout(reTimer); reTimer=null; }
    _cerrarConexion();
    setEstado('Desconectado.', '');
  }

  /* Solo cierra lo tecnico. Lo usa tambien el reintento, que SI quiere
     volver a conectarse enseguida. */
  function _cerrarConexion(){
    connected=false;
    if(playTimer){ clearInterval(playTimer); playTimer=null; }
    if(recTimer){ clearTimeout(recTimer); recTimer=null; }
    if(_ralloTimer){ clearInterval(_ralloTimer); _ralloTimer=null; }
    /* el reloj que espera la oferta de la camara tambien se apaga: si no,
       queda uno nuevo corriendo por cada reintento */
    if(_espTimer){ clearInterval(_espTimer); _espTimer=null; }
    if(recorder && recorder.state!=='inactive'){ try{ recorder.stop(); }catch(e){} }
    recorder=null;
    if(_vidaTimer){ clearTimeout(_vidaTimer); _vidaTimer=null; }
    if(_diagTimer){ clearInterval(_diagTimer); _diagTimer=null; }
    var _dg=$('vd-diag'); if(_dg) _dg.textContent='';
    /* la camara local se apaga de verdad: si no, queda la luz prendida y el
       aparato tomado para cualquier otro programa */
    if(localStream){
      try{ localStream.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      localStream=null;
    }
    if(pc){ try{ pc.close(); }catch(e){} pc=null; }
    if(salaId && viewerId){ videoSet('video_signal/'+salaId+'/requests/'+viewerId, null); }
    ciclos.forEach(function(c){ try{ URL.revokeObjectURL(c.url); }catch(e){} });
    ciclos=[]; cicloBuf=[]; rallyMarks=[]; _lastRally=-1; liveStream=null;
    var vLive=$('vd-live'), vDelay=$('vd-delay');
    if(vLive){ vLive.srcObject=null; vLive.style.display='none'; }
    if(vDelay){ vDelay.src=''; vDelay.srcObject=null; vDelay.style.display='none'; }
    if(BD){ try{ BD.parar && BD.parar(); }catch(e){} BD=null; }
  }

  function setEstado(msg, cls){
    var el=$('vd-estado'); if(!el) return;
    el.textContent=msg; el.className='vd-estado'+(cls?' '+cls:'');
  }

  window.VideoDelay = {
    conectar: conectar,
    conectarLocal: conectarLocal,
    camaras: camaras,
    desconectar: desconectar,
    setDelay: setDelay,
    replayUltimoPunto: replayUltimoPunto,
    estaConectado: function(){ return connected; },
    /* para el recuadro de diagnostico: tirones, podas forzadas y pedacitos
       rechazados. Hasta ahora el motor los contaba y no los miraba nadie. */
    diag: function(){
      var d = (BD && BD.diag) ? BD.diag : null;
      return { motor: BD ? 'buffer' : (connected ? 'ciclos' : 'apagado'),
               mime: (BD && BD.mime) || null,
               bitrate: (BD && BD.bitrate) || null,
               esperas: d ? d.esperas : null,
               podadosForzados: d ? (d.podadosForzados||0) : null,
               trozosRechazados: d ? d.trozosRechazados : null,
               rearmes: _rearmes };
    }
  };
})();
