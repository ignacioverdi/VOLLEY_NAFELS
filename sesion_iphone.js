/* ═══════════════════════════════════════════════════════════════════════════
   sesion_iphone.js — que no pida la contraseña cada vez, en iPhone

   ── QUE HACE, EN UNA LINEA ───────────────────────────────────────────────
   Guarda una copia de la sesión en una cookie, y si al abrir la app la
   sesión no está, la recupera de ahí.

   ── POR QUE ESTA VERSION ES DISTINTA ─────────────────────────────────────
   La anterior hacía tres cosas de más, y cada una podía romper la app:

     · reemplazaba localStorage.setItem, que usa TODO el sistema
     · recargaba la página sola, lo que podía entrar en bucle
     · recorría miles de claves apenas abría

   Esta no hace nada de eso. Solo lee, copia y, si hace falta, restituye.
   Si algo falla, la app sigue funcionando exactamente como sin este archivo.

   ── EL PROBLEMA QUE RESUELVE ─────────────────────────────────────────────
   Safari borra localStorage a los 7 días sin usar el sitio, y también
   cuando el teléfono anda corto de memoria. La sesión vive solo ahí, así
   que al borrarse hay que entrar de nuevo.

   Las cookies sobreviven a eso. Por eso se guarda una copia ahí.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CLAVE = 'nla_sesion';
  var COOKIE = 'vb_ses';

  /* Todo va dentro de try: si el navegador no deja hacer algo, se sigue
     de largo. Este archivo NUNCA debe impedir que la app funcione. */

  function leerCookie() {
    try {
      var m = document.cookie.match(/(?:^|;\s*)vb_ses=([^;]*)/);
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }

  function guardarCookie(txt) {
    try {
      var d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      document.cookie = COOKIE + '=' + encodeURIComponent(txt) +
        ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax' +
        (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
  }

  /* ══ 1. AL ABRIR ══════════════════════════════════════════════════════
     Si la sesión está, se copia a la cookie.
     Si no está pero la cookie la tiene, se la devuelve a su lugar.

     Esto corre ANTES que firebase.js, así que cuando firebase.js busca la
     sesión, ya está donde tiene que estar. */
  try {
    var ses = null;
    try { ses = localStorage.getItem(CLAVE); } catch (e) {}

    if (ses) {
      guardarCookie(ses);                    /* está: se respalda */
    } else {
      var copia = leerCookie();
      if (copia) {
        try {
          var s = JSON.parse(copia);
          /* solo si sirve: tiene con qué renovarse y no es de hace meses */
          if (s && s.refreshToken &&
              (!s.vence || (Date.now() - s.vence) < 60 * 86400000)) {
            localStorage.setItem(CLAVE, copia);
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  /* ══ 2. MIENTRAS SE USA ═══════════════════════════════════════════════
     El token se renueva cada hora. Cada tanto se mira si cambió y se
     actualiza la cookie. Un temporizador liviano, cada 2 minutos, que no
     recorre nada ni bloquea la pantalla. */
  try {
    var ultimo = null;
    setInterval(function () {
      try {
        var v = localStorage.getItem(CLAVE);
        if (v && v !== ultimo) { ultimo = v; guardarCookie(v); }
        if (!v) {
          /* la sesión desapareció mientras la app estaba abierta: se
             restituye desde la cookie, sin recargar ni molestar */
          var c = leerCookie();
          if (c) localStorage.setItem(CLAVE, c);
        }
      } catch (e) {}
    }, 120000);
  } catch (e) {}

  /* ══ 3. AL VOLVER A LA APP ════════════════════════════════════════════
     En iPhone, al cambiar de aplicación y volver, iOS a veces descarta la
     página. Si al volver la sesión no está, se restituye. */
  try {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      try {
        if (!localStorage.getItem(CLAVE)) {
          var c = leerCookie();
          if (c) localStorage.setItem(CLAVE, c);
        }
      } catch (e) {}
    });
  } catch (e) {}
})();

/* © 2025-2026 Volley-Stats · Ignacio Verdi · Software propietario */
