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
  var TOLERANCIA_S  = 0.30;   /* zona muerta: adentro no se toca nada       */
  var SALTO_S       = 2.5;    /* desvio que ya obliga a saltar              */
  var VEL_MIN       = 0.90;
  var VEL_MAX       = 1.10;
  var GANANCIA      = 0.08;   /* cuanto se corrige por segundo de desvio    */
  var PODAR_CADA_MS = 5000;   /* podar seguido bloquea el buffer            */
  var TOPE_S        = 150;    /* por encima de esto se poda SI O SI          */
  var FALLOS_TOPE   = 12;     /* intentos seguidos antes de darlo por muerto */

  /* ── POR QUE HAY UN MARGEN MINIMO ─────────────────────────────────────────
     Medido en banco (40 s de video sintetico, retraso pedido 6 s):

         retraso real: mediana 4,81 s, entre 4,00 y 5,57
         3 esperas del reproductor (los "saltitos") y 2 saltos de tiempo

     Dos cosas: el retraso real quedaba mas de un segundo por debajo del
     pedido, y el reproductor llegaba tan cerca del final del buffer que se
     quedaba sin material y frenaba. Eso es lo que se ve como un tiron.

     El final del buffer no avanza parejo: salta de a 250 ms, cada vez que
     entra un pedacito. Si uno tarda, el que esta reproduciendo lo alcanza.
     Con un margen minimo de algo mas de un segundo nunca lo alcanza.         */
  var MARGEN_MIN_S  = 1.2;

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
    this.ancla      = null;    /* cuanto atras del reloj va el buffer */
    this.stream     = null;    /* el video que llega, por si hay que rearmar */
    this.onMuerto   = null;    /* avisa que dejo de entrar imagen */
    this._finAnt    = -1;
    this._finDesde  = 0;
    this._avisoMuerto = false;
    /* ── LA LIBRETA ────────────────────────────────────────────────────────
       Los saltitos pasan en la cancha, con wifi de gimnasio y el celu
       codificando: en el banco de pruebas no se reproducen. Entonces el motor
       anota lo que le pasa, y despues se lee. Sin esto, "se vio un tiron" no
       se puede arreglar: no se sabe si fue el buffer, la red o el aparato. */
    this.diag = { esperas:0, cuandoEsperas:[], saltos:0, correcciones:0,
                  trozosRechazados:0, podados:0, trozosEnCola:0, arranque:0 };
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
    this.stream = stream;
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

      self.sb.addEventListener('updateend', function () {
        self._podarSiSePaso();
        self._vaciarCola();
      });

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
      /* ── CUANDO SE QUEDA SIN MATERIAL ──────────────────────────────────
         'waiting' es, literal, el saltito: el reproductor llego al final de
         lo que tiene y se queda esperando. Esperar ahi no sirve —vuelve a
         pasar enseguida—, asi que se corre un segundo mas atras y sigue. */
      self.video.addEventListener('waiting', function () {
        if (!self.listo) return;
        self.diag.esperas++;
        if (self.diag.cuandoEsperas.length < 60)
          self.diag.cuandoEsperas.push(+((Date.now() - self.t0) / 1000).toFixed(1));
        var fin = self._fin();
        if (!fin) return;
        /* Solo si de verdad se comio todo lo que habia. Si esta lejos del
           final, la espera es otra cosa y moverlo seria peor. */
        if (fin - self.video.currentTime > 0.6) return;
        var seguro = fin - Math.max(self.retrasoS, MARGEN_MIN_S) - 0.5;
        var ini = 0;
        try { ini = self.sb.buffered.start(0); } catch (e) {}
        if (seguro < ini + 0.2) seguro = ini + 0.2;
        if (seguro < self.video.currentTime) {
          try { self.video.currentTime = seguro; } catch (e) {}
        }
      });

      /* MediaRecorder se puede morir sin decir nada —memoria, calor, la
         pestana al fondo— y hasta ahora no lo miraba nadie: dejaban de entrar
         pedacitos, el video llegaba al final de lo que tenia y quedaba en
         negro para siempre. */
      self.rec.onerror = function () { self._revisarLatido(true); };
      self.rec.onstop  = function () { self._revisarLatido(true); };

      self.rec.start(TROZO_MS);
      self.listo = true;
      self.t0 = Date.now();
      self._avisar('En vivo', 'ok');

      self.video.play().catch(function () {});
      self._corregir();
      self.diag.arranque = Date.now();
      self._libreta = setInterval(function () {
        try { console.log('[video delay]', JSON.stringify(self.resumen())); } catch (e) {}
      }, 30000);
    });

    return true;
  };

  /* Los pedacitos se agregan de a uno: el buffer no acepta dos a la vez. */
  BufferDelay.prototype._vaciarCola = function () {
    if (!this.sb || this.sb.updating || !this.cola.length) return;
    var trozo = this.cola.shift();
    var self = this;
    try {
      this.sb.appendBuffer(trozo);
      this._fallos = 0;
      return;
    } catch (e) {
      /* ── NO PERDER EL PEDACITO ────────────────────────────────────────
         Antes, cuando el buffer estaba lleno, el pedacito ya estaba fuera de
         la cola y nadie lo volvia a poner: se perdia. Un pedacito perdido es
         un hueco en el video, y un hueco se ve como un salto. Ahora vuelve a
         la cola y se reintenta.

         Pero reintentar PARA SIEMPRE es colgarse en silencio: si el buffer
         esta lleno de verdad, cada intento falla igual. Entonces primero se
         poda a la fuerza, y si despues de FALLOS_TOPE sigue sin entrar, se da
         por muerto y se avisa, que es lo unico util que queda. */
      this.cola.unshift(trozo);
      this.diag.trozosRechazados++;
      this._fallos = (this._fallos || 0) + 1;
      try { this._podar(true); } catch (e2) {}
      if (this._fallos >= FALLOS_TOPE) {
        this.diag.bufferLleno = (this.diag.bufferLleno || 0) + 1;
        this._revisarLatido(true);
        return;
      }
      setTimeout(function () { self._vaciarCola(); }, 60);
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
    /* Podar bloquea el buffer mientras dura, y mientras tanto no entran
       pedacitos nuevos. Hacerlo cada 400 ms era parte del problema. */
    var ahora = Date.now();
    if (!urgente && this._ultimoPodado && (ahora - this._ultimoPodado) < PODAR_CADA_MS) return;
    this._ultimoPodado = ahora;
    this.diag.podados++;
    var fin = this._fin();
    var ini;
    try { ini = this.sb.buffered.start(0); } catch (e) { return; }
    var largo = fin - ini;

    /* ══ EL LAZO QUE MATABA TODO ═══════════════════════════════════════════
       La regla "nunca borres lo que se esta viendo" es correcta... hasta que
       el que mira se queda quieto. Y se queda quieto justo cuando llega al
       final del buffer y se queda sin material, que es el caso que importa.

       Ahi se cerraba un lazo del que no se sale:

           el video se traba  ->  currentTime deja de avanzar  ->  el podado
           deja de borrar  ->  el buffer crece sin parar  ->  el navegador
           se queda sin lugar  ->  no entra un pedacito mas  ->  pantalla
           negra, para siempre, aunque el celular siga mandando perfecto.

       A 720p son unos 18 MB por minuto y el navegador corta cerca de los
       150 MB: ocho minutos de buffer sin podar y se acabo. Reconectar no
       arregla nada porque el que esta lleno es el buffer, no la conexion.

       Por eso ahora hay un tope duro: pasado TOPE_S se poda igual, y si el
       que mira queda atras de lo que se borro, se lo mueve. Perder dos
       segundos de retraso es infinitamente mejor que perder la pantalla. */
    var forzar = (largo > TOPE_S);
    var limite = fin - ((urgente || forzar) ? VENTANA_S / 2 : VENTANA_S);
    if (limite <= 0) return;
    if (limite <= ini + 1) return;

    if (!forzar) {
      /* Lo normal: no se borra lo que se esta viendo. */
      if (limite >= this.video.currentTime - 2) limite = this.video.currentTime - 2;
      if (limite <= ini + 1) return;
    } else {
      this.diag.podadosForzados = (this.diag.podadosForzados || 0) + 1;
    }

    try { this.sb.remove(ini, limite); } catch (e) { return; }

    if (forzar && this.video.currentTime < limite + 0.5) {
      try { this.video.currentTime = limite + 0.5; } catch (e) {}
      try { this.video.play().catch(function () {}); } catch (e) {}
      this._avisar('Se solto un pedazo viejo del video para no quedarse sin lugar', 'ok');
    }
  };

  /* Se llama cada vez que el buffer termina una operacion: con datos
     entrando, no con un reloj. Un reloj se frena cuando la pantalla pasa a
     segundo plano —y ahi es justo cuando el buffer crece sin que nadie lo
     mire—, los datos no. */
  BufferDelay.prototype._podarSiSePaso = function () {
    try {
      if (!this.sb || this.sb.updating || !this.sb.buffered.length) return;
      var largo = this._fin() - this.sb.buffered.start(0);
      if (largo > TOPE_S) this._podar(true);
    } catch (e) {}
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
      self._revisarLatido(false);

      /* ── CONTRA QUE SE MIDE EL RETRASO ────────────────────────────────
         Antes el objetivo era "el final del buffer menos el retraso". Ese
         final no es una referencia estable: salta de a 250 ms cada vez que
         entra un pedacito, y ademas se queda atras cuando un pedacito tarda.
         El que reproduce terminaba persiguiendo un blanco que se movia solo,
         corrigiendo todo el tiempo y sin llegar nunca.

         Ahora el objetivo se mide contra el RELOJ, que avanza parejo: a los
         treinta segundos de arrancar, con seis de retraso, hay que estar en
         el segundo veinticuatro. El final del buffer queda solo como techo,
         para no pasarse de largo.                                           */
      var atras = Math.max(self.retrasoS, MARGEN_MIN_S);
      var reloj = (Date.now() - self.t0) / 1000;

      /* El final del buffer esta siempre un poco atras del reloj: lo que tarda
         en grabarse, viajar y pegarse. Ese atraso se mide y se suaviza, en vez
         de usarlo crudo. Asi el objetivo avanza parejo como el reloj, pero
         apuntando a donde el video REALMENTE esta. Sin esto, el retraso que se
         consigue queda medio segundo largo por debajo del pedido. */
      var atrasoBuffer = reloj - fin;
      if (self.ancla == null) self.ancla = atrasoBuffer;
      else self.ancla = self.ancla * 0.94 + atrasoBuffer * 0.06;

      var objetivo = reloj - self.ancla - atras;
      var techo = fin - MARGEN_MIN_S;      /* red de seguridad, no el objetivo */
      if (objetivo > techo) objetivo = techo;
      if (objetivo < 0) objetivo = 0;
      var actual = self.video.currentTime;
      var desvio = objetivo - actual;      /* + = vamos atrasados */

      if (self.video.paused) { self.video.play().catch(function () {}); }

      if (Math.abs(desvio) > SALTO_S) {
        /* Muy lejos: no hay forma suave, se salta. Pasa al cambiar el retraso
           o si el video estuvo detenido un rato. */
        try { self.video.currentTime = objetivo; } catch (e) {}
        self.diag.saltos++;
        self._vel(1);
        return;
      }
      if (Math.abs(desvio) <= TOLERANCIA_S) {
        self._vel(1);
        return;
      }
      /* Cerca: se corrige acelerando o frenando, PROPORCIONAL al desvio.
         Antes era siempre un 5%: recuperar un segundo tardaba veinte, asi que
         el retraso real quedaba lejos del pedido todo el tiempo. Ahora un
         desvio de un segundo se corrige a 8% y se cierra en unos doce. */
      var vel = 1 + desvio * GANANCIA;
      self.diag.correcciones++;
      self.diag.trozosEnCola = self.cola.length;
      self._vel(Math.min(VEL_MAX, Math.max(VEL_MIN, vel)));
    }, 400);
  };

  /* ── EL LATIDO ────────────────────────────────────────────────────────────
     Si el final del buffer no se mueve durante varios segundos, no entra mas
     imagen. Puede ser el celular (se le apago la pantalla y Android le saco la
     camara) o esta misma maquina (el grabador se murio). En los dos casos lo
     que no sirve es quedarse esperando en negro sin decir nada.

     Se avisa UNA vez, se anota en la libreta, y si hay quien sepa rearmarlo
     —video_delay.js— se le avisa para que lo haga.                          */
  var SIN_IMAGEN_S = 8;

  BufferDelay.prototype._revisarLatido = function (yaSeSabe) {
    var fin = this._fin();
    var ahora = Date.now();
    if (!yaSeSabe) {
      if (fin > this._finAnt + 0.05) { this._finAnt = fin; this._finDesde = ahora; this._avisoMuerto = false; return; }
      if (!this._finDesde) { this._finDesde = ahora; return; }
      if ((ahora - this._finDesde) < SIN_IMAGEN_S * 1000) return;
    }
    /* Al morirse el grabador todavia quedan pedacitos en la cola, asi que el
       final del buffer se mueve un poco mas y el aviso se disparaba dos veces
       por el mismo corte. Con un descanso de 15 s, un corte avisa una vez. */
    if (this._avisoMuerto) return;
    if (this._ultimoAviso && (Date.now() - this._ultimoAviso) < 15000) return;
    this._ultimoAviso = Date.now();
    this._avisoMuerto = true;
    this.diag.sinImagen = (this.diag.sinImagen || 0) + 1;
    this.diag.grabador = this.rec ? this.rec.state : 'no hay';
    this._avisar('Hace ' + SIN_IMAGEN_S + ' s que no entra imagen — mira el celular', 'err');
    if (typeof this.onMuerto === 'function') { try { this.onMuerto(); } catch (e) {} }
  };

  /* Cambiar playbackRate tiene costo: el navegador reajusta el decodificado y
     se nota. Si la diferencia es minima, no se toca. */
  BufferDelay.prototype._vel = function (v) {
    try {
      if (Math.abs((this.video.playbackRate || 1) - v) < 0.01) return;
      this.video.playbackRate = v;
    } catch (e) {}
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

  /* Lo que paso, en una linea. Se lee desde la consola del navegador:
         BD.resumen()
     o se mira solo en el log, que se escribe cada 30 segundos. */
  BufferDelay.prototype.resumen = function () {
    var min = (Date.now() - this.t0) / 60000;
    var d = this.diag;
    return {
      minutos: +min.toFixed(1),
      esperas: d.esperas,
      esperasPorMinuto: min > 0.2 ? +(d.esperas / min).toFixed(1) : null,
      cuandoEsperas: d.cuandoEsperas.slice(),
      saltos: d.saltos,
      correcciones: d.correcciones,
      trozosRechazados: d.trozosRechazados,
      podados: d.podados,
      vecesSinImagen: d.sinImagen || 0,
      podadosForzados: d.podadosForzados || 0,
      bufferLleno: d.bufferLleno || 0,
      guardadoAhora: +(this.disponible() || 0).toFixed(1),
      grabador: this.rec ? this.rec.state : 'no hay',
      trozosEnCola: this.cola.length,
      retrasoPedido: this.retrasoS,
      retrasoReal: +(((Date.now() - this.t0) / 1000) - this.video.currentTime).toFixed(2),
      guardadoAtras: +(this.disponible() || 0).toFixed(1),
      velocidad: this.video.playbackRate
    };
  };

  BufferDelay.prototype.parar = function () {
    this.listo = false;
    if (this.corrigiendo) { clearInterval(this.corrigiendo); this.corrigiendo = null; }
    if (this._libreta) { clearInterval(this._libreta); this._libreta = null; }
    try { if (this.rec && this.rec.state !== 'inactive') this.rec.stop(); } catch (e) {}
    try { if (this.ms && this.ms.readyState === 'open') this.ms.endOfStream(); } catch (e) {}
    this.rec = null; this.sb = null; this.ms = null; this.cola = [];
  };

  global.BufferDelay   = BufferDelay;
  global.delaySoportado = function () { return !!mimeSoportado(); };

})(window);
