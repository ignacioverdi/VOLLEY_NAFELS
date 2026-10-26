// ───────────────────────────────────────────────────────────────────────────
//  grabar_clip.js — EL CLIP, EN .MP4, SIN SERVIDOR Y SIN INSTALAR NADA
//
//  El problema: la pagina reproduce el partido desde YouTube, y YouTube no
//  entrega el archivo. Nunca. Te presta un reproductor adentro de un iframe
//  que el navegador aisla a proposito, asi que no hay un solo byte de video
//  que se pueda leer, ni con ffmpeg adentro del navegador ni con nada.
//
//  La salida es la misma que usa la Herramienta Recortes de Windows: no leer
//  el archivo, leer la PANTALLA. El navegador tiene esa puerta desde hace
//  anos —getDisplayMedia, la que usan Meet y Loom— y lo que entrega son los
//  pixeles ya dibujados, vengan de donde vengan. Por eso funciona sobre el
//  iframe de YouTube, y por eso pide permiso cada vez.
//
//  Entonces: el recorte se arma en la computadora del jugador, no hay
//  servidor, no hay disco externo, no hay nada prendido del otro lado y no
//  hay nada que instalar.
//
//  LO QUE NO PUEDE, dicho de frente:
//   · Solo en computadora. En el navegador del celular esa puerta no existe.
//   · El navegador pregunta que compartir CADA vez. Es regla de seguridad,
//     no se puede guardar la respuesta. Un clic extra por grabacion.
//   · Graba en tiempo real: un punto de 12 segundos tarda 12 segundos.
//   · Sale la calidad que se ve en pantalla. Por eso, mientras graba, el
//     reproductor se agranda a pantalla completa y despues vuelve solo.
//
//  Depende de window.VBCortes, que cortes.html exporta con tres cosas: que
//  clips estan tildados, el reproductor de YouTube y el cartel de avisos.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  var TXT = {
    es: { btn:'⏺ Grabar mp4', tit:'Graba los clips tildados y te los baja en un archivo',
          sinClips:'Tildá al menos un clip con video.',
          pidiendo:'Elegí "Esta pestaña" en el cuadro del navegador…',
          cancelado:'Grabación cancelada.',
          grabando:'Grabando {i} de {n} — {seg}s',
          cerrando:'Cerrando el archivo…',
          listo:'Listo: {arch}',
          sinPestana:'Compartiste una ventana y no la pestaña: grabo igual, pero sale la pantalla entera.',
          nada:'No se grabó nada. Probá de nuevo.',
          noVa:'Tu navegador no puede grabar la pantalla. Probá en una computadora con Chrome.',
          noPuedo:'⤓ Para bajar el clip, abrí esta página en una computadora con Chrome o Edge.',
          soloWebm:'Tu navegador graba en .webm y no en .mp4: puede que Instagram no lo acepte. Con Chrome o Edge sale en mp4.',
          celBtn:'▶ Pantalla completa',
          celTit:'Pone la jugada a pantalla completa para grabarla con el teléfono',
          celPie:'Desde el celular se graba con el grabador de pantalla del teléfono.',
          celCargando:'Preparando la jugada…',
          celPaso1:'Poné el teléfono de costado y prendé la grabación de pantalla de tu celular.',
          celPaso1b:'En iPhone está en el Centro de Control. En Android, en los ajustes rápidos.',
          celEmpezar:'Ya la prendí — empezar',
          celFin:'Listo. Apagá la grabación y recortá las puntas en Fotos.',
          celCerrar:'Cerrar' },
    en: { btn:'⏺ Record mp4', tit:'Records the checked clips and downloads them as one file',
          sinClips:'Check at least one clip with video.',
          pidiendo:'Choose "This tab" in the browser dialog…',
          cancelado:'Recording cancelled.',
          grabando:'Recording {i} of {n} — {seg}s',
          cerrando:'Closing the file…',
          listo:'Done: {arch}',
          sinPestana:'You shared a window, not the tab: it will record the whole screen.',
          nada:'Nothing was recorded. Try again.',
          noVa:'Your browser cannot record the screen. Try on a computer with Chrome.',
          noPuedo:'⤓ To download the clip, open this page on a computer with Chrome or Edge.',
          soloWebm:'Your browser records .webm, not .mp4: Instagram may reject it. Chrome or Edge record mp4.',
          celBtn:'▶ Full screen',
          celTit:'Plays the action full screen so you can record it with the phone',
          celPie:'On a phone, record it with your phone screen recorder.',
          celCargando:'Getting the action ready…',
          celPaso1:'Turn the phone sideways and start your phone screen recording.',
          celPaso1b:'On iPhone it is in Control Centre. On Android, in the quick settings.',
          celEmpezar:'Started — go',
          celFin:'Done. Stop the recording and trim the ends in Photos.',
          celCerrar:'Close' },
    de: { btn:'⏺ mp4 aufnehmen', tit:'Nimmt die markierten Clips auf und lädt sie als eine Datei',
          sinClips:'Mindestens einen Clip mit Video markieren.',
          pidiendo:'Wähle „Dieser Tab" im Browser-Dialog…',
          cancelado:'Aufnahme abgebrochen.',
          grabando:'Nehme {i} von {n} auf — {seg}s',
          cerrando:'Datei wird geschlossen…',
          listo:'Fertig: {arch}',
          sinPestana:'Du hast ein Fenster statt des Tabs geteilt: es wird der ganze Bildschirm aufgenommen.',
          nada:'Es wurde nichts aufgenommen. Nochmal versuchen.',
          noVa:'Dein Browser kann den Bildschirm nicht aufnehmen. Probiere es an einem Computer mit Chrome.',
          noPuedo:'⤓ Zum Herunterladen des Clips diese Seite an einem Computer mit Chrome oder Edge öffnen.',
          soloWebm:'Dein Browser nimmt .webm statt .mp4 auf: Instagram akzeptiert das evtl. nicht. Chrome oder Edge nehmen mp4 auf.',
          celBtn:'▶ Vollbild',
          celTit:'Spielt die Aktion im Vollbild, zum Aufnehmen mit dem Handy',
          celPie:'Am Handy mit der Bildschirmaufnahme des Telefons aufnehmen.',
          celCargando:'Aktion wird vorbereitet…',
          celPaso1:'Handy quer halten und die Bildschirmaufnahme des Telefons starten.',
          celPaso1b:'Beim iPhone im Kontrollzentrum, bei Android in den Schnelleinstellungen.',
          celEmpezar:'Läuft — los',
          celFin:'Fertig. Aufnahme stoppen und die Enden in Fotos kürzen.',
          celCerrar:'Schliessen' }
  };
  function L() {
    var l = 'es';
    try { if (typeof getLang === 'function') l = getLang(); } catch (e) {}
    return TXT[l] || TXT.es;
  }

  /* ── ¿PUEDE ESTE NAVEGADOR? ───────────────────────────────────────────
     Tres cosas, y las tres o ninguna: leer la pantalla, grabar lo leido y
     dibujar en un lienzo para recortar. En el celular falta la primera. */
  function puede() {
    try {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) &&
             typeof MediaRecorder !== 'undefined' &&
             !!document.createElement('canvas').captureStream;
    } catch (e) { return false; }
  }

  /* El mejor formato que soporte, en orden. El mp4 va primero porque es el
     que Instagram y WhatsApp aceptan sin chistar; el webm queda de red por
     si algun dia se abre en un navegador que no grabe mp4. */
  function formato() {
    var ops = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2',
               'video/mp4;codecs=avc1', 'video/mp4',
               'video/webm;codecs=h264', 'video/webm;codecs=vp9', 'video/webm'];
    for (var i = 0; i < ops.length; i++) {
      try { if (MediaRecorder.isTypeSupported(ops[i])) return ops[i]; } catch (e) {}
    }
    return '';
  }

  /* Escapar, porque los textos van adentro de innerHTML. Son textos
     nuestros, pero un modulo que arma HTML sin escapar es una puerta que
     tarde o temprano alguien empuja. */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function aviso(t) {
    try { if (window.VBCortes && VBCortes.aviso) VBCortes.aviso(t, !!t); } catch (e) {}
  }
  function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ── EL NOMBRE DEL ARCHIVO ────────────────────────────────────────────
     Que se entienda en la carpeta de Descargas tres semanas despues. */
  function limpio(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 28);
  }
  function nombre(clips, ext) {
    var c = clips[0];
    var base = clips.length > 1
      ? (limpio(c.jugador || 'clips') + '_' + clips.length + '_acciones')
      : (limpio(c.jugador || 'clip') + '_' + limpio(c.accion) + '_' + limpio(c.partido));
    return 'VolleyStats_' + base + '.' + ext;
  }

  /* ── PANTALLA COMPLETA MIENTRAS GRABA ─────────────────────────────────
     La grabacion sale con la calidad que se ve. Si el reproductor mide 600
     pixeles en la pagina, el clip sale de 600 pixeles. Asi que se agranda a
     toda la ventana mientras dura, y despues vuelve exactamente a como
     estaba: se guardan los estilos que tenia puestos y se reponen.

     NO se mueve de lugar en el HTML a proposito: mover un iframe lo hace
     recargar, y YouTube arrancaria de cero. Solo se le cambia el estilo. */
  function agrandar(caja) {
    var tenia = caja.hasAttribute('style');
    var previo = caja.getAttribute('style') || '';
    var sep = (previo && previo.trim().slice(-1) !== ';') ? ';' : '';
    /* La caja se agranda MANTENIENDO 16:9, al mayor tamano que entre en la
       ventana, y queda centrada. Asi el reproductor la llena entera y no
       quedan bandas negras adentro: el recorte es la caja y punto, sin
       tener que adivinar donde cae el video dentro del iframe. */
    /* Se centra con margin:auto y NO con transform. Un elemento con
       transform se vuelve el marco de referencia de todo lo que tenga
       position:fixed adentro, y el panel de instrucciones del celular
       quedaria encerrado en la franja del video en vez de tapar la
       pantalla. */
    caja.style.cssText = previo + sep +
      'position:fixed;left:0;right:0;top:0;bottom:0;margin:auto;' +
      'width:min(100vw,calc(100vh * 16 / 9));height:min(100vh,calc(100vw * 9 / 16));' +
      'max-width:none;max-height:none;min-width:0;z-index:2147483000;' +
      'background:#000;margin:0;border-radius:0;aspect-ratio:16/9';
    return function () {
      if (tenia && previo) caja.setAttribute('style', previo);
      else caja.removeAttribute('style');
    };
  }

  /* El rectangulo a recortar. Como agrandar() deja la caja en 16:9 exacto,
     el video la llena entera y el recorte es la caja misma. Igual se corta
     el 16:9 centrado por si alguna vez la caja no lo fuera: cuesta tres
     lineas y evita que salgan bandas negras. */
  function rectVideo(caja) {
    var r = caja.getBoundingClientRect();
    var w = r.width, h = r.height;
    if (Math.abs(w / h - 16 / 9) < 0.01) return { x: r.left, y: r.top, w: w, h: h };
    if (w / h > 16 / 9) { var w2 = h * 16 / 9; return { x: r.left + (w - w2) / 2, y: r.top, w: w2, h: h }; }
    var h2 = w * 9 / 16;  return { x: r.left, y: r.top + (h - h2) / 2, w: w, h: h2 };
  }

  /* Cuanto se acerca la imagen en el formato vertical. 1 = el clip entero. */
  var ZOOM_9_16 = 1.5;

  /* ── LOS SEGUNDOS QUE NO SE GRABAN ────────────────────────────────────
     YouTube muestra el titulo del video arriba a la izquierda cada vez que
     se salta a otro segundo, y tarda unos tres en borrarse. En un reel esos
     son justo los segundos que mira todo el mundo.

     Asi que el video arranca ANTES de la accion y la grabacion recien
     empieza cuando llega al punto: el cartel se desvanece durante esa
     entrada, que no queda en el archivo. De paso se come el salto del
     buscador, asi que el clip empieza con la pelota ya en movimiento. */
  var ENTRADA = 3.2;

  var grabando = false;

  async function grabar(vertical) {
    if (grabando) return;
    var t = L();
    var VB = window.VBCortes;
    if (!VB || typeof VB.clips !== 'function') return;

    var clips = [];
    try { clips = VB.clips() || []; } catch (e) { clips = []; }
    clips = clips.filter(function (c) { return c && c.video && c.fin_seg > c.inicio_seg; });
    if (!clips.length) { aviso(t.sinClips); setTimeout(function(){aviso('');}, 3000); return; }

    var pl = VB.player && VB.player();
    var caja = VB.caja && VB.caja();
    if (!pl || !pl.seekTo || !caja) { aviso(t.nada); return; }

    var mime = formato();
    if (!mime) { aviso(t.noVa); return; }

    grabando = true;
    var stream = null, devolver = null, rafId = 0, rec = null;
    try {
      aviso(t.pidiendo);
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 }, audio: true, preferCurrentTab: true
      });
    } catch (e) {
      grabando = false; aviso(t.cancelado);
      setTimeout(function(){aviso('');}, 2500);
      return;
    }

    try {
      var vtrack = stream.getVideoTracks()[0];
      var st = (vtrack.getSettings && vtrack.getSettings()) || {};
      var esPestana = (st.displaySurface === 'browser');
      if (!esPestana) aviso(t.sinPestana);

      /* el video que trae la pantalla, para poder dibujarlo recortado */
      var fuente = document.createElement('video');
      fuente.srcObject = stream; fuente.muted = true; fuente.playsInline = true;
      await fuente.play();
      await esperar(250);

      devolver = agrandar(caja);
      await esperar(400);                 /* que el reproductor se reacomode */

      var lienzo = document.createElement('canvas');
      lienzo.width  = vertical ? 1080 : 1280;
      lienzo.height = vertical ? 1920 : 720;
      var g = lienzo.getContext('2d');

      /* De la pantalla capturada a la pagina: la pestana se captura entera,
         asi que un pixel de la pagina es 'escala' pixeles del video. */
      var anchoCap = fuente.videoWidth || st.width || window.innerWidth;
      var escala = anchoCap / window.innerWidth;

      var negro = true;                   /* tapa los saltos entre clips */
      function pintar() {
        rafId = requestAnimationFrame(pintar);
        g.fillStyle = '#000';
        g.fillRect(0, 0, lienzo.width, lienzo.height);
        if (negro || !fuente.videoWidth) return;
        var r = esPestana ? rectVideo(caja)
                          : { x:0, y:0, w:window.innerWidth, h:window.innerHeight };
        var sx = Math.max(0, r.x * escala), sy = Math.max(0, r.y * escala);
        var sw = Math.min(fuente.videoWidth - sx,  r.w * escala);
        var sh = Math.min(fuente.videoHeight - sy, r.h * escala);
        if (sw <= 0 || sh <= 0) return;
        if (!vertical) { g.drawImage(fuente, sx, sy, sw, sh, 0, 0, lienzo.width, lienzo.height); return; }
        /* vertical: el clip centrado sobre negro, y nada mas.
           Hubo una version con el mismo clip ampliado y borroso de fondo,
           que es como se ven muchos reels. Se saco: arriba y abajo quedaba
           una mancha movida que le robaba la atencion a la jugada. El
           negro no compite con nada y es el mismo fondo que tiene la app
           de Instagram cuando reproduce. */
        /* ── EL ACERCAMIENTO ──────────────────────────────────────────
           Un 16:9 metido en un 9:16 ocupa un tercio del alto y los
           jugadores quedan diminutos. Se recorta el centro y se agranda:
           con 1,5 los jugadores se leen y siguen entrando las dos lineas
           laterales, la red y la jugada entera. Lo que se pierde a los
           costados es tribuna y cancha vacia. Comprobado sobre un clip
           real del partido con St Gallen. */
        var zw = sw / ZOOM_9_16, zh = sh / ZOOM_9_16;
        var zx = sx + (sw - zw) / 2, zy = sy + (sh - zh) / 2;
        var alto = Math.round(1080 * 9 / 16);
        g.drawImage(fuente, zx, zy, zw, zh, 0, (1920 - alto) / 2, 1080, alto);
      }
      pintar();

      var salida = lienzo.captureStream(30);
      stream.getAudioTracks().forEach(function (a) { salida.addTrack(a); });

      /* ── UNA SOLA PIEZA ───────────────────────────────────────────────
         Nada de pedirle pedazos cada tanto. En .webm los pedazos se pegan
         y queda un archivo valido, pero en .mp4 no: el primero trae el
         encabezado y los demas son fragmentos sueltos. Pegados dan un
         archivo que el navegador reproduce y que despues ningun editor
         —ni Instagram— abre. Se pide todo junto al cerrar. */
      var trozos = [];
      rec = new MediaRecorder(salida, { mimeType: mime, videoBitsPerSecond: 6000000 });
      rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
      var cerrado = new Promise(function (res) { rec.onstop = res; });
      /* OJO: no se arranca todavia. Se arranca cuando el primer clip ya
         esta en su segundo y andando, asi el archivo no empieza con dos
         segundos de negro mientras YouTube busca y carga. */
      var arranco = false;

      /* ── LOS CLIPS, UNO DETRAS DEL OTRO ─────────────────────────────
         Se espera a que el reproductor este DE VERDAD en el segundo pedido
         antes de levantar el negro: si no, el clip empieza con el salto. */
      var corte = false;
      stream.getVideoTracks()[0].addEventListener('ended', function () { corte = true; });

      for (var i = 0; i < clips.length && !corte; i++) {
        var c = clips[i];
        negro = true;
        var desde = Math.max(0, c.inicio_seg - ENTRADA);
        try {
          if (pl.getVideoData && (pl.getVideoData().video_id !== c.video)) {
            pl.loadVideoById({ videoId: c.video, startSeconds: desde });
          } else { pl.seekTo(desde, true); }
          pl.playVideo();
          if (pl.setPlaybackRate) pl.setPlaybackRate(1);
        } catch (e) {}

        /* Se espera a que el video pase la entrada y llegue al segundo de
           la accion. El tope contempla la entrada entera mas lo que tarde
           en cargar; si se vence igual se graba, que es mejor que no hacer
           nada. */
        var t0 = Date.now(), tope = (ENTRADA + 8) * 1000;
        while (Date.now() - t0 < tope) {
          await esperar(100);
          var ahora = 0;
          try { ahora = pl.getCurrentTime ? pl.getCurrentTime() : 0; } catch (e) {}
          var est = 1; try { est = pl.getPlayerState ? pl.getPlayerState() : 1; } catch (e) {}
          if (est === 1 && ahora >= c.inicio_seg - 0.10) break;
        }
        if (!arranco) { rec.start(); arranco = true; }
        negro = false;

        while (!corte) {
          await esperar(100);
          var cur = 0;
          try { cur = pl.getCurrentTime ? pl.getCurrentTime() : 0; } catch (e) { break; }
          var queda = Math.max(0, Math.ceil(c.fin_seg - cur));
          aviso(t.grabando.replace('{i}', i + 1).replace('{n}', clips.length).replace('{seg}', queda));
          if (cur >= c.fin_seg) break;
        }
      }
      negro = true;
      await esperar(220);

      if (!arranco) { aviso(t.nada); setTimeout(function(){aviso('');}, 4000); return; }
      aviso(t.cerrando);
      try { rec.stop(); } catch (e) {}
      await cerrado;
      cancelAnimationFrame(rafId); rafId = 0;

      /* El formato que SALIO, no el que se pidio: el navegador puede
         haber elegido otro codec adentro del mismo envase. */
      var real = (rec.mimeType || mime);
      var ext = real.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
      var blob = new Blob(trozos, { type: real.split(';')[0] });
      try { window.vbGrabarUltimo = { pedido: mime, real: real, bytes: 0 }; } catch (e) {}
      if (!blob.size) { aviso(t.nada); return; }
      try { window.vbGrabarUltimo.bytes = blob.size; } catch (e) {}
      var arch = nombre(clips, ext);
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = arch;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      aviso(t.listo.replace('{arch}', arch));
      setTimeout(function(){aviso('');}, 6000);
    } catch (e) {
      try { console.error('[grabar]', e); } catch (_) {}
      aviso(L().nada);
      setTimeout(function(){aviso('');}, 4000);
    } finally {
      grabando = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (devolver) { try { devolver(); } catch (e) {} }
      try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {}
      try { stream.getTracks().forEach(function (x) { x.stop(); }); } catch (e) {}
      try { if (window.VBCortes && VBCortes.player && VBCortes.player().pauseVideo) VBCortes.player().pauseVideo(); } catch (e) {}
    }
  }
  window.vbGrabarClip = grabar;

  /* ══ DESDE EL CELULAR ═══════════════════════════════════════════════════
     En el telefono la puerta de grabar pantalla no existe —ni en Chrome de
     Android ni en Safari de iPhone— y no hay forma de programarla.

     Pero el telefono TRAE su propio grabador de pantalla, y ese si graba
     cualquier cosa. Asi que la app hace la parte que el jugador no puede
     hacer solo: deja la jugada a pantalla completa, sin controles y sin el
     cartel de YouTube, y la arranca recien cuando el ya esta grabando.

     El orden importa: la entrada —los segundos en que YouTube muestra el
     titulo— se reproduce ANTES de avisarle que empiece, y la jugada queda
     congelada en su primer cuadro esperandolo. Asi lo que el graba arranca
     limpio, y lo unico que le queda por hacer es recortar las puntas. */
  var enCel = false;

  /* El panel va por encima del reproductor. No alcanza con el z-index: el
     iframe de YouTube se pinta aparte y en algunos navegadores se queda
     arriba igual. Asi que mientras el panel esta puesto, la caja deja de
     recibir toques —pointer-events:none— y los clics llegan si o si. */
  function tocableCaja(si) {
    try {
      var VB = window.VBCortes, c = VB && VB.caja && VB.caja();
      if (c) c.style.pointerEvents = si ? '' : 'none';
    } catch (e) {}
  }

  function panelCel(html) {
    var d = document.getElementById('vb-cel');
    if (!d) {
      d = document.createElement('div');
      d.id = 'vb-cel';
      d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;' +
        'align-items:center;justify-content:center;padding:22px;text-align:center;' +
        'background:rgba(4,5,10,.93);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);' +
        'color:#e8e8f0;font-family:inherit;font-size:15px;line-height:1.5;' +
        /* explicito: el panel cuelga de la caja, y a la caja se le apagan
           los toques mientras esto esta puesto. Sin esto lo hereda y los
           botones del panel no se pueden tocar. */
        'pointer-events:auto';
      /* Va COLGADO DE LA CAJA, no del body. Cuando el navegador pone algo a
         pantalla completa deja de dibujar todo lo que no cuelgue de ese
         elemento: puesto en el body, el panel estaba en la pagina, medía
         bien y no se veia ni se podia tocar. Costo una hora encontrarlo. */
      var dueno = null;
      try { dueno = window.VBCortes && window.VBCortes.caja && window.VBCortes.caja(); } catch (e) {}
      (dueno || document.body).appendChild(d);
    }
    d.innerHTML = html;
    d.style.display = html ? 'flex' : 'none';
    tocableCaja(!html);
    return d;
  }
  function cerrarPanel() {
    var d = document.getElementById('vb-cel');
    if (d) d.style.display = 'none';
    tocableCaja(true);
  }

  async function verEnCel() {
    if (enCel) return;
    var t = L(), VB = window.VBCortes;
    if (!VB) return;
    var clips = [];
    try { clips = (VB.clips() || []).filter(function (c) { return c && c.video && c.fin_seg > c.inicio_seg; }); }
    catch (e) { clips = []; }
    if (!clips.length) { aviso(t.sinClips); setTimeout(function(){aviso('');}, 3000); return; }

    var pl = VB.player && VB.player(), caja = VB.caja && VB.caja();
    if (!pl || !pl.seekTo || !caja) return;

    enCel = true;
    var devolver = agrandar(caja);
    try { if (caja.requestFullscreen) caja.requestFullscreen().catch(function(){}); } catch (e) {}
    try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function(){}); } catch (e) {}

    function salir() {
      enCel = false;
      cerrarPanel();
      try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen(); } catch (e) {}
      try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
      try { pl.pauseVideo && pl.pauseVideo(); } catch (e) {}
      tocableCaja(true);
      try { devolver(); } catch (e) {}   /* ultimo: repone el estilo tal cual estaba */
    }

    var boton = 'display:inline-block;margin-top:16px;padding:13px 22px;border-radius:12px;' +
                'border:0;background:#E8192C;color:#fff;font:inherit;font-size:16px;font-weight:700;cursor:pointer';
    panelCel('<div>' + esc(t.celCargando) + '</div>');

    /* la entrada, con el panel tapando: el cartel de YouTube se desvanece aca */
    var c0 = clips[0];
    try { pl.loadVideoById ? pl.loadVideoById({ videoId: c0.video, startSeconds: Math.max(0, c0.inicio_seg - ENTRADA) })
                           : pl.seekTo(Math.max(0, c0.inicio_seg - ENTRADA), true);
          pl.playVideo(); } catch (e) {}
    var t0 = Date.now();
    while (Date.now() - t0 < (ENTRADA + 8) * 1000) {
      await esperar(100);
      var ah = 0; try { ah = pl.getCurrentTime ? pl.getCurrentTime() : 0; } catch (e) {}
      if (ah >= c0.inicio_seg - 0.10) break;
    }
    try { pl.pauseVideo && pl.pauseVideo(); } catch (e) {}

    var d = panelCel('<div style="max-width:460px">' +
      '<div style="font-size:17px;font-weight:700;margin-bottom:8px">' + esc(t.celPaso1) + '</div>' +
      '<div style="font-size:13px;opacity:.75">' + esc(t.celPaso1b) + '</div>' +
      '<button type="button" id="vb-cel-go" style="' + boton + '">' + esc(t.celEmpezar) + '</button>' +
      '<div><button type="button" id="vb-cel-x" style="margin-top:14px;background:none;border:0;' +
      'color:#94a3b8;font:inherit;font-size:13px;text-decoration:underline;cursor:pointer">' +
      esc(t.celCerrar) + '</button></div></div>');

    var seguir = new Promise(function (res) {
      d.querySelector('#vb-cel-go').onclick = function () { res(true); };
      d.querySelector('#vb-cel-x').onclick  = function () { res(false); };
    });
    if (!(await seguir)) { salir(); return; }

    cerrarPanel();
    for (var i = 0; i < clips.length && enCel; i++) {
      var c = clips[i];
      if (i > 0) {
        try { pl.seekTo(Math.max(0, c.inicio_seg), true); } catch (e) {}
      }
      try { pl.playVideo(); } catch (e) {}
      while (enCel) {
        await esperar(100);
        var cur = 0; try { cur = pl.getCurrentTime ? pl.getCurrentTime() : 0; } catch (e) { break; }
        if (cur >= c.fin_seg) break;
      }
    }
    try { pl.pauseVideo && pl.pauseVideo(); } catch (e) {}
    if (!enCel) return;

    var d2 = panelCel('<div style="max-width:460px"><div style="font-size:17px;font-weight:700">' +
      esc(t.celFin) + '</div><button type="button" id="vb-cel-x2" style="' + boton + '">' +
      esc(t.celCerrar) + '</button></div>');
    d2.querySelector('#vb-cel-x2').onclick = salir;
  }
  window.vbVerEnCel = verEnCel;

  /* ── EL BOTON ─────────────────────────────────────────────────────────
     Al lado de los que ya estan. Si el navegador no puede grabar —el
     celular— no se dibuja: mejor que no este a que este y no haga nada. */
  function poner() {
    if (document.getElementById('vbGrabar') || document.getElementById('vbNoPuedo')) return;
    var ref = document.getElementById('expCsv');
    if (!ref || !ref.parentNode) return;
    var t = L();

    /* ── SI ESTE APARATO NO PUEDE ─────────────────────────────────────
       En el celular la puerta de grabar pantalla no existe, y en algun
       navegador de escritorio tampoco. Antes no se dibujaba nada y el
       jugador se quedaba buscando un boton que nadie le iba a explicar
       por que no esta. Ahora, en su lugar, dice que hacer. */
    if (!puede() || !formato()) {
      var cel = document.createElement('button');
      cel.id = 'vbNoPuedo'; cel.type = 'button';
      cel.setAttribute('data-notr', '');
      cel.title = t.celTit;
      cel.textContent = t.celBtn;
      cel.addEventListener('click', function () { verEnCel(); });
      ref.parentNode.insertBefore(cel, ref);

      var n = document.createElement('span');
      n.id = 'vbCelPie';
      n.setAttribute('data-notr', '');
      n.textContent = t.celPie;
      n.style.cssText = 'font-size:11px;color:var(--muted,#94a3b8);opacity:.85;' +
                        'line-height:1.35;max-width:300px';
      ref.parentNode.insertBefore(n, ref);
      return;
    }

    /* graba, pero no en mp4: se avisa en el globito, no se esconde nada */
    var webm = formato().indexOf('mp4') < 0;

    var b = document.createElement('button');
    b.id = 'vbGrabar'; b.type = 'button';
    b.title = webm ? (t.tit + ' — ' + t.soloWebm) : t.tit;
    b.textContent = webm ? t.btn.replace('mp4', 'webm') : t.btn;
    b.setAttribute('data-notr', '');
    b.addEventListener('click', function () { grabar(document.getElementById('vbVert').checked); });

    var lab = document.createElement('label');
    lab.id = 'vbVertLab';
    lab.setAttribute('data-notr', '');
    lab.style.cssText = 'display:inline-flex;align-items:center;gap:5px;font-size:11px;' +
                        'color:var(--muted);cursor:pointer;margin-left:2px';
    lab.innerHTML = '<input type="checkbox" id="vbVert" style="margin:0"> 9:16';
    lab.title = 'Vertical para historias y reels';

    ref.parentNode.insertBefore(b, ref);
    ref.parentNode.insertBefore(lab, ref);
  }

  function arrancar() {
    try { poner(); } catch (e) {}
    /* la barra se redibuja sola cuando cambian los filtros */
    setInterval(function () { try { poner(); } catch (e) {} }, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
