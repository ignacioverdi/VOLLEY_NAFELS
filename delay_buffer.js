/* ═══════════════════════════════════════════════════════════════════════════
   BUFFER DE VIDEO CON RETRASO — motor continuo

   POR QUE SE HIZO DE NUEVO
   ------------------------
   La version anterior grababa CLIPS SUELTOS de 12 segundos y los reproducia
   uno atras del otro. Eso trae tres problemas que no se pueden arreglar
   ajustando numeros:

     1. Un corte visible cada 12 segundos, en el empalme de un clip al
        siguiente. Justo ahi puede pasar la jugada que querias ver.
     2. El retraso no se puede elegir de verdad. Si pedis 5 segundos, lo que
        obtenes es "el clip anterior", que segun el momento son 12 o 24.
     3. Si un clip todavia no termino de cerrarse, el video se queda quieto
        esperando. Eso es lo que se siente como "se traba".

   COMO FUNCIONA AHORA
   -------------------
   Un solo video, un solo flujo continuo. Se graba en pedacitos de 250 ms y se
   van pegando dentro del mismo buffer del navegador (MediaSource), asi que
   para el reproductor es UN video que crece por el final, no muchos archivos.

   El retraso se logra mirando un poco mas atras dentro de ese mismo video: si
   el buffer ya tiene hasta el segundo 30 y pediste 8 de retraso, se reproduce
   el segundo 22. Cambiar el retraso es moverse dentro del mismo video, no
   cambiar de archivo. Por eso no hay empalmes ni esperas.

   PARA QUE NO SE VAYA DERIVANDO
   -----------------------------
   Un video reproduciendo siempre se atrasa o se adelanta un poco. En vez de
   corregir con saltos —que se ven feos— se acelera o se frena apenas la
   reproduccion, entre 0,95 y 1,05. A esa velocidad el ojo no lo nota y el
   retraso se mantiene clavado. Solo se salta si la diferencia es tan grande
   que ya no se puede recuperar suavemente.

   SI EL NAVEGADOR NO PUEDE
   ------------------------
   arrancar() devuelve false y quien lo llama sigue con el metodo viejo. No
   deja a nadie sin video.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var TROZO_MS      = 250;    /* cada cuanto se corta un pedacito           */
  var VENTANA_S     = 90;     /* cuanto se guarda hacia atras               */
  var TOLERANCIA_S  = 0.35;   /* desvio que se corrige con velocidad        */
  var SALTO_S       = 2.5;    /* desvio que ya obliga a saltar              */
  var VEL_MIN       = 0.95;
  var VEL_MAX       = 1.05;

  function mimeSoportado() {
    var candidatos = [
      'video/webm;codecs=vp8',
      'video/webm;codecs="vp8,opus"',
      'video/webm',
      'video/mp4;codecs="avc1.42E01E"'
    ];
    for (var i = 0; i < candidatos.length; i++) {
      var m = candidatos[i];
      var grabable = (typeof MediaRecorder !== 'undefined') &&
                     MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m);
      var reproducible = (typeof MediaSource !== 'undefined') &&
                         MediaSource.isTypeSupported && MediaSource.isTypeSupported(m);
      if (grabable && reproducible) return m;
    }
    return null;
  }

  function BufferDelay(video) {
    this.video      = video;
    this.mime       = null;
    this.ms         = null;
    this.sb         = null;
    this.rec        = null;
    this.cola       = [];
    this.listo      = false;
    this.retrasoS   = 0;
    this.corrigiendo= null;
    this.marcas     = [];      /* momentos en que se cerro un punto */
    this.t0         = 0;
    this.onEstado   = null;
  }

  BufferDelay.prototype._avisar = function (txt, tipo) {
    if (typeof this.onEstado === 'function') { try { this.onEstado(txt, tipo); } catch (e) {} }
  };

  /* Devuelve false si este navegador no puede: quien llama sigue como antes. */
  BufferDelay.prototype.arrancar = function (stream) {
    var self = this;
    this.mime = mimeSoportado();
    if (!this.mime || !stream) return false;
    if (typeof MediaSource === 'undefined') return false;

    try {
      this.ms = new MediaSource();
      this.video.src = URL.createObjectURL(this.ms);
      this.video.muted = true;
      this.video.playsInline = true;
    } catch (e) { return false; }

    this.ms.addEventListener('sourceopen', function () {
      try {
        self.sb = self.ms.addSourceBuffer(self.mime);
        /* 'sequence' hace que los pedacitos se peguen uno detras del otro sin
           importar la marca de tiempo que traiga cada uno. Sin esto, los
           trozos de MediaRecorder pueden quedar desordenados o con huecos. */
        self.sb.mode = 'sequence';
      } catch (e) { self._avisar('Este navegador no puede armar el buffer', 'err'); return; }

      self.sb.addEventListener('updateend', function () { self._vaciarCola(); });

      try {
        self.rec = new MediaRecorder(stream, { mimeType: self.mime });
      } catch (e) { self._avisar('No se puede grabar en este formato', 'err'); return; }

      self.rec.ondataavailable = function (ev) {
        if (!ev.data || !ev.data.size) return;
        ev.data.arrayBuffer().then(function (buf) {
          self.cola.push(buf);
          self._vaciarCola();
        }).catch(function () {});
      };
      self.rec.start(TROZO_MS);
      self.listo = true;
      self.t0 = Date.now();
      self._avisar('En vivo', 'ok');

      self.video.play().catch(function () {});
      self._corregir();
    });

    return true;
  };

  /* Los pedacitos se agregan de a uno: el buffer no acepta dos a la vez. */
  BufferDelay.prototype._vaciarCola = function () {
    if (!this.sb || this.sb.updating || !this.cola.length) return;
    var trozo = this.cola.shift();
    try { this.sb.appendBuffer(trozo); }
    catch (e) {
      /* Si se lleno, se tira lo mas viejo y se reintenta. */
      try { this._podar(true); } catch (e2) {}
    }
  };

  BufferDelay.prototype._fin = function () {
    try {
      if (!this.sb || !this.sb.buffered.length) return 0;
      return this.sb.buffered.end(this.sb.buffered.length - 1);
    } catch (e) { return 0; }
  };

  BufferDelay.prototype._podar = function (urgente) {
    if (!this.sb || this.sb.updating) return;
    var fin = this._fin();
    var limite = fin - (urgente ? VENTANA_S / 2 : VENTANA_S);
    if (limite <= 0) return;
    var ini;
    try { ini = this.sb.buffered.start(0); } catch (e) { return; }
    if (limite <= ini + 1) return;
    /* Nunca se borra lo que se esta viendo. */
    if (limite >= this.video.currentTime - 2) limite = this.video.currentTime - 2;
    if (limite <= ini + 1) return;
    try { this.sb.remove(ini, limite); } catch (e) {}
  };

  /* El corazon: mantener la distancia pedida sin que se note. */
  BufferDelay.prototype._corregir = function () {
    var self = this;
    if (this.corrigiendo) clearInterval(this.corrigiendo);
    this.corrigiendo = setInterval(function () {
      if (!self.listo || !self.sb) return;
      var fin = self._fin();
      if (!fin) return;

      self._podar(false);

      var objetivo = fin - self.retrasoS;
      if (objetivo < 0) objetivo = 0;
      var actual = self.video.currentTime;
      var desvio = objetivo - actual;      /* + = vamos atrasados */

      if (self.video.paused) { self.video.play().catch(function () {}); }

      if (Math.abs(desvio) > SALTO_S) {
        /* Muy lejos: no hay forma suave, se salta. Pasa al cambiar el retraso
           o si el video estuvo detenido un rato. */
        try { self.video.currentTime = objetivo; } catch (e) {}
        self.video.playbackRate = 1;
        return;
      }
      if (Math.abs(desvio) <= TOLERANCIA_S) {
        self.video.playbackRate = 1;
        return;
      }
      /* Cerca: se corrige acelerando o frenando un poquito. */
      var vel = 1 + (desvio > 0 ? 0.05 : -0.05);
      self.video.playbackRate = Math.min(VEL_MAX, Math.max(VEL_MIN, vel));
    }, 400);
  };

  BufferDelay.prototype.setRetraso = function (segundos) {
    this.retrasoS = Math.max(0, segundos || 0);
    var fin = this._fin();
    if (!fin) return;
    var objetivo = Math.max(0, fin - this.retrasoS);
    try { this.video.currentTime = objetivo; } catch (e) {}
    this._avisar(this.retrasoS ? ('Retraso ' + this.retrasoS + ' s') : 'En vivo', 'ok');
  };

  /* Cuanto hay guardado hacia atras: sirve para no dejar pedir 60 s de
     retraso cuando recien hay 10 grabados. */
  BufferDelay.prototype.disponible = function () {
    try {
      if (!this.sb || !this.sb.buffered.length) return 0;
      return this._fin() - this.sb.buffered.start(0);
    } catch (e) { return 0; }
  };

  /* Se llama cuando el scout cierra un punto. Guarda el momento DENTRO del
     video, no la hora del reloj: asi el replay cae siempre donde tiene que
     caer, sin importar el retraso que este puesto. */
  BufferDelay.prototype.marcarPunto = function () {
    var t = this._fin();
    if (!t) return;
    this.marcas.push(t);
    if (this.marcas.length > 40) this.marcas.shift();
  };

  /* Vuelve al ultimo punto cerrado, arrancando unos segundos antes. */
  BufferDelay.prototype.verUltimoPunto = function (antes) {
    if (!this.marcas.length) return false;
    var t = this.marcas[this.marcas.length - 1] - (antes || 8);
    var ini = 0;
    try { ini = this.sb.buffered.start(0); } catch (e) {}
    if (t < ini) t = ini;
    try { this.video.currentTime = t; this.video.play().catch(function () {}); } catch (e) { return false; }
    /* Queda reproduciendo desde ahi; el retraso se recalcula solo. */
    this.retrasoS = Math.max(0, this._fin() - t);
    this._avisar('Repitiendo el ultimo punto', 'ok');
    return true;
  };

  BufferDelay.prototype.parar = function () {
    this.listo = false;
    if (this.corrigiendo) { clearInterval(this.corrigiendo); this.corrigiendo = null; }
    try { if (this.rec && this.rec.state !== 'inactive') this.rec.stop(); } catch (e) {}
    try { if (this.ms && this.ms.readyState === 'open') this.ms.endOfStream(); } catch (e) {}
    this.rec = null; this.sb = null; this.ms = null; this.cola = [];
  };

  global.BufferDelay   = BufferDelay;
  global.delaySoportado = function () { return !!mimeSoportado(); };

})(window);
