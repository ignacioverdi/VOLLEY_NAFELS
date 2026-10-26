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
          noVa:'Tu navegador no puede grabar la pantalla. Probá en una computadora con Chrome.' },
    en: { btn:'⏺ Record mp4', tit:'Records the checked clips and downloads them as one file',
          sinClips:'Check at least one clip with video.',
          pidiendo:'Choose "This tab" in the browser dialog…',
          cancelado:'Recording cancelled.',
          grabando:'Recording {i} of {n} — {seg}s',
          cerrando:'Closing the file…',
          listo:'Done: {arch}',
          sinPestana:'You shared a window, not the tab: it will record the whole screen.',
          nada:'Nothing was recorded. Try again.',
          noVa:'Your browser cannot record the screen. Try on a computer with Chrome.' },
    de: { btn:'⏺ mp4 aufnehmen', tit:'Nimmt die markierten Clips auf und lädt sie als eine Datei',
          sinClips:'Mindestens einen Clip mit Video markieren.',
          pidiendo:'Wähle „Dieser Tab" im Browser-Dialog…',
          cancelado:'Aufnahme abgebrochen.',
          grabando:'Nehme {i} von {n} auf — {seg}s',
          cerrando:'Datei wird geschlossen…',
          listo:'Fertig: {arch}',
          sinPestana:'Du hast ein Fenster statt des Tabs geteilt: es wird der ganze Bildschirm aufgenommen.',
          nada:'Es wurde nichts aufgenommen. Nochmal versuchen.',
          noVa:'Dein Browser kann den Bildschirm nicht aufnehmen. Probiere es an einem Computer mit Chrome.' }
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
    caja.style.cssText = previo + sep +
      'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);' +
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

  /* ── EL BOTON ─────────────────────────────────────────────────────────
     Al lado de los que ya estan. Si el navegador no puede grabar —el
     celular— no se dibuja: mejor que no este a que este y no haga nada. */
  function poner() {
    if (document.getElementById('vbGrabar')) return;
    var ref = document.getElementById('expCsv');
    if (!ref || !ref.parentNode) return;
    if (!puede() || !formato()) return;
    var t = L();

    var b = document.createElement('button');
    b.id = 'vbGrabar'; b.type = 'button';
    b.title = t.tit; b.textContent = t.btn;
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
