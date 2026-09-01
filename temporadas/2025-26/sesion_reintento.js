/* ═══════════════════════════════════════════════════════════════════════════
   sesion_reintento.js — no cerrar la sesión al primer tropiezo

   ── EL PROBLEMA ──────────────────────────────────────────────────────────
   Al abrir la app, firebase.js renueva el token. Si esa renovación falla,
   hace esto:

       .catch(function(){ ... _fbGuardarSes(null); pedir(); })

   Es decir: BORRA LA SESION y pide usuario y contraseña. Al primer fallo,
   sin reintentar.

   En una computadora casi nunca se nota. En un iPhone sí: cuando se abre la
   app desde la pantalla de inicio, el teléfono todavía está despertando la
   red. Ese primer pedido sale antes de que haya conexión y falla — no
   porque la sesión sea inválida, sino porque no había red todavía.

   Resultado: el jugador entra una vez, cierra la app, la vuelve a abrir y
   le pide la contraseña de nuevo. Exactamente lo que estaba pasando.

   ── LA SOLUCION ──────────────────────────────────────────────────────────
   Se envuelve la renovación para que, si falla, ESPERE Y REINTENTE en vez
   de rendirse: tres intentos, separados por 1, 2 y 4 segundos.

   Solo si los tres fallan se considera que la sesión de verdad no sirve.
   Y aun así, se distingue "no hay red" —donde no se borra nada— de
   "el token es inválido", que es el único caso en que corresponde pedir
   la contraseña otra vez.

   ── POR QUE VA APARTE ────────────────────────────────────────────────────
   Para no tocar firebase.js, que es el archivo más delicado del sistema.
   Este envuelve una sola función y no cambia nada más.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function esperar(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  /* Se espera a que firebase.js defina la función, y ahí se envuelve. */
  var intentos = 0;
  var reloj = setInterval(function () {
    intentos++;
    if (intentos > 60) { clearInterval(reloj); return; }   /* 6 segundos y basta */

    if (typeof window._fbRefrescar !== 'function') return;
    if (window.__REFRESCAR_ENVUELTO) { clearInterval(reloj); return; }
    clearInterval(reloj);
    window.__REFRESCAR_ENVUELTO = true;

    var original = window._fbRefrescar;

    window._fbRefrescar = function () {
      var esperas = [0, 1000, 2000, 4000];   /* cuatro intentos en total */

      function probar(n) {
        return (n === 0 ? Promise.resolve() : esperar(esperas[n]))
          .then(function () { return original(); })
          .catch(function (err) {
            /* ── Sin red: no se toca la sesión ──────────────────────────
               Si el teléfono no tiene conexión, el token no se puede
               renovar, pero eso NO significa que la sesión sea inválida.
               Cerrarla sería castigar a alguien por estar en un gimnasio
               sin señal. */
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
              throw err;
            }

            if (n < esperas.length - 1) return probar(n + 1);

            /* Se agotaron los intentos. Solo ahora se deja pasar el error,
               que es lo que hace que firebase.js pida la contraseña. */
            throw err;
          });
      }

      return probar(0);
    };
  }, 100);
})();

/* © 2025-2026 Volley-Stats · Ignacio Verdi · Software propietario */
