/* ═══════════════════════════════════════════════════════════════════════════
   sesion_iphone.js — que no se cierre la sesión en iPhone

   ── EL PROBLEMA ──────────────────────────────────────────────────────────
   En iPhone la app pide usuario y contraseña una y otra vez, y a veces
   muestra "ocurrió un problema varias veces" con la pantalla en blanco.

   Son dos causas distintas:

   1. SAFARI BORRA EL ALMACENAMIENTO
      Safari limpia localStorage a los 7 días sin usar el sitio, y también
      cuando el teléfono anda corto de memoria. La sesión vive SOLO ahí
      (clave "nla_sesion"), así que al borrarse hay que entrar de nuevo.

   2. LA PANTALLA EN BLANCO
      "Ocurrió un problema varias veces" es el aviso de Safari cuando una
      página se queda sin memoria y la recarga sola. prep_fisica es la
      pantalla más pesada —guarda 10 cosas distintas y dibuja la rutina
      entera— y es la que más lo sufre.

   ── QUE HACE ESTE ARCHIVO ────────────────────────────────────────────────
   GUARDA LA SESION EN TRES LUGARES a la vez: localStorage, sessionStorage
   y una cookie de un año. Safari no los borra todos juntos: si limpia uno,
   la sesión se recupera de otro sin que el jugador note nada.

   Y ANTES DE ESCRIBIR, LIMPIA lo viejo: los pesos de temporadas pasadas y
   las copias que ya no se usan. Así el almacenamiento no se llena y Safari
   no tiene motivo para recargar la página.

   ── LO QUE NO HACE ───────────────────────────────────────────────────────
   No toca la seguridad. Es la misma sesión, guardada en más de un lugar.
   La cookie no es accesible desde otro sitio y caduca igual que el token.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CLAVE = 'nla_sesion';
  var COOKIE = 'vb_ses';

  /* ── La cookie ──────────────────────────────────────────────────────── */
  function ponerCookie(txt) {
    try {
      var d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      document.cookie = COOKIE + '=' + encodeURIComponent(txt) +
        ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax' +
        (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
  }

  function leerCookie() {
    try {
      var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function borrarCookie() {
    try { document.cookie = COOKIE + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'; }
    catch (e) {}
  }

  /* ── Guardar en los tres lugares ────────────────────────────────────── */
  function guardar(txt) {
    if (!txt) {
      try { localStorage.removeItem(CLAVE); } catch (e) {}
      try { sessionStorage.removeItem(CLAVE); } catch (e) {}
      borrarCookie();
      return;
    }
    try { localStorage.setItem(CLAVE, txt); } catch (e) {}
    try { sessionStorage.setItem(CLAVE, txt); } catch (e) {}
    ponerCookie(txt);
  }

  /* ── Recuperar de donde haya quedado ────────────────────────────────── */
  function recuperar() {
    var v = null;
    try { v = localStorage.getItem(CLAVE); } catch (e) {}
    if (v) return { txt: v, de: 'localStorage' };

    try { v = sessionStorage.getItem(CLAVE); } catch (e) {}
    if (v) return { txt: v, de: 'sessionStorage' };

    v = leerCookie();
    if (v) return { txt: v, de: 'cookie' };

    return null;
  }

  /* ══ 1. RESCATAR LA SESION AL ABRIR ═══════════════════════════════════
     Si localStorage esta vacio pero la sesion sobrevivio en otro lado, se
     la devuelve a su lugar ANTES de que firebase.js la busque. El jugador
     no ve nada: entra directo. */
  (function rescatar() {
    var hay = null;
    try { hay = localStorage.getItem(CLAVE); } catch (e) {}
    if (hay) { guardar(hay); return; }        /* esta: se replica a los otros */

    var r = recuperar();
    if (!r) return;                            /* no hay sesion en ningun lado */

    try {
      var s = JSON.parse(r.txt);
      /* si el token ya vencio hace mucho, no sirve: que entre de nuevo */
      if (s && s.vence && (Date.now() - s.vence) > 30 * 86400000) return;
      localStorage.setItem(CLAVE, r.txt);
      window.__SESION_RESCATADA = r.de;
    } catch (e) {}
  })();

  /* ══ 2. MANTENER LOS TRES AL DIA ══════════════════════════════════════
     Cada vez que firebase.js renueva el token, se replica a los otros dos
     lugares. Se envuelve setItem porque es donde escribe. */
  (function replicar() {
    try {
      var orig = localStorage.setItem.bind(localStorage);
      localStorage.setItem = function (k, v) {
        orig(k, v);
        if (k === CLAVE) {
          try { sessionStorage.setItem(CLAVE, v); } catch (e) {}
          ponerCookie(v);
        }
      };
      var origDel = localStorage.removeItem.bind(localStorage);
      localStorage.removeItem = function (k) {
        origDel(k);
        if (k === CLAVE) {
          try { sessionStorage.removeItem(CLAVE); } catch (e) {}
          borrarCookie();
        }
      };
    } catch (e) {}
  })();

  /* ══ 3. QUE NO SE LLENE EL ALMACENAMIENTO ═════════════════════════════
     Safari recarga la pagina cuando se queda sin memoria: es el aviso
     "ocurrio un problema varias veces". prep_fisica guarda un peso por
     cada serie de cada ejercicio de cada jugador, y eso se acumula
     temporada tras temporada.

     Se borra lo que ya no sirve: los pesos de mas de dos temporadas atras.
     Los datos de verdad estan en Firebase; esto es solo la copia local
     para abrir rapido. */
  function limpiarViejo() {
    var ahora = new Date();
    var limite = ahora.getFullYear() - 2;
    var borradas = 0;
    try {
      /* Object.keys no siempre funciona sobre localStorage: se recorre por
         indice, que es lo que soportan todos los navegadores. */
      var claves = [];
      for (var i = 0; i < localStorage.length; i++) claves.push(localStorage.key(i));
      claves.forEach(function (k) {
        if (!k) return;
        /* prep_rutina_<num>_<aaaa-mm> de temporadas viejas */
        var m = k.match(/^prep_rutina_\d+_(\d{4})-\d{2}$/);
        if (m && parseInt(m[1], 10) < limite) {
          localStorage.removeItem(k); borradas++;
        }
      });
    } catch (e) {}
    return borradas;
  }

  /* ── Si el almacenamiento se llena, hacer lugar ─────────────────────── */
  function medirYLimpiar() {
    var pesa = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k) continue;
        pesa += k.length + (localStorage.getItem(k) || '').length;
      }
    } catch (e) { return; }

    /* Safari da unos 5 MB por sitio. Al pasar 3,5 se limpia lo viejo,
       antes de que el navegador decida hacerlo por su cuenta —que es
       cuando aparece la pantalla en blanco. */
    if (pesa > 3500000) limpiarViejo();
  }

  try { limpiarViejo(); medirYLimpiar(); } catch (e) {}

  /* ══ 4. NO PERDER LA SESION AL VOLVER A LA APP ════════════════════════
     En iPhone, al cambiar de app y volver, Safari a veces descarta la
     pagina de memoria y la vuelve a cargar. Si en ese momento localStorage
     esta vacio, se rescata otra vez. */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    try {
      if (!localStorage.getItem(CLAVE)) {
        var r = recuperar();
        if (r) localStorage.setItem(CLAVE, r.txt);
      }
    } catch (e) {}
  });

  /* ══ 5. QUE FIREBASE VUELVA A LEER LA SESION ══════════════════════════
     Este archivo carga ANTES que firebase.js y devuelve la sesion a
     localStorage. Pero en la app instalada en la pantalla de inicio eso no
     alcanzaba: firebase.js guarda la sesion en su variable FB_SES apenas
     arranca, y si en ese instante todavia no habia nada, se queda con el
     vacio y muestra el login — aunque un momento despues la sesion ya
     estuviera restaurada.

     En Safari normal no se notaba porque al recargar volvia a leer. En la
     app instalada la pagina no se recarga: se queda en el login.

     Se corrige avisandole a firebase.js que vuelva a mirar. */
  (function avisarAFirebase() {
    var intentos = 0;
    var t = setInterval(function () {
      intentos++;
      if (intentos > 60) { clearInterval(t); return; }      /* 6 segundos */

      /* todavia no cargo firebase.js */
      if (typeof window.FB_SES === 'undefined') return;
      clearInterval(t);

      /* si ya tiene sesion, no hay nada que hacer */
      if (window.FB_SES) return;

      var r = recuperar();
      if (!r) return;

      try {
        var s = JSON.parse(r.txt);
        if (!s || !s.refreshToken) return;
        window.FB_SES = s;
        /* y que se guarde donde corresponde */
        try { localStorage.setItem(CLAVE, r.txt); } catch (e) {}
        window.__SESION_REINYECTADA = r.de;

        /* si la pantalla de login ya se dibujo, se saca: la sesion existe */
        setTimeout(function () {
          try {
            var l = document.getElementById('fb-login');
            if (l && window.FB_SES) location.reload();
          } catch (e) {}
        }, 700);
      } catch (e) {}
    }, 100);
  })();

  /* ══ 6. DEJAR CONSTANCIA DE LO QUE PASO ═══════════════════════════════
     Sin poder tener el telefono en la mano, la unica forma de saber que
     falla es que la propia app lo anote. Se guarda una linea por entrada:
     si tuvo que loguearse, desde donde se abrio y con que iOS.

     No guarda nada personal: ni mail, ni contrasena, ni datos del jugador. */
  function anotar() {
    try {
      var ua = navigator.userAgent || '';
      if (!/iPhone|iPad/.test(ua)) return;          /* solo iPhone */

      var ios = (ua.match(/OS (\d+[_\d]*)/) || [])[1] || '?';
      var dato = {
        cuando: new Date().toISOString().slice(0, 16),
        modo: window.navigator.standalone ? 'app' : 'safari',
        ios: ios.replace(/_/g, '.'),
        pantalla: (location.pathname.split('/').pop() || 'index').replace('.html', ''),
        tenia: {
          local: !!(function () { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } })(),
          sesion: !!(function () { try { return sessionStorage.getItem(CLAVE); } catch (e) { return null; } })(),
          cookie: !!leerCookie()
        },
        rescate: window.__SESION_RESCATADA || window.__SESION_REINYECTADA || null,
        pidio_login: false                          /* se completa abajo */
      };

      setTimeout(function () {
        try {
          dato.pidio_login = !!document.getElementById('fb-login');
          if (window.fbSet) fbSet('diagnostico/' + Date.now(), dato);
        } catch (e) {}
      }, 3500);
    } catch (e) {}
  }
  setTimeout(anotar, 1500);

  window.__sesionDonde = recuperar;
})();

/* © 2025-2026 Volley-Stats · Ignacio Verdi · Software propietario */
