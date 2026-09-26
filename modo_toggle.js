/* ============================================================================
   modo_toggle.js  —  el cartelito de PARTIDO / ENTRENAMIENTO
   ----------------------------------------------------------------------------
   POR QUE EXISTE
   Varias pantallas cambian de base de datos segun el modo: en ENTRENAMIENTO
   leen las sesiones internas y en PARTIDO los partidos de la liga. El modo se
   guarda en el navegador y queda pegado. Si quedo en entrenamiento y abris
   armadores.html esperando los partidos, ves una pantalla casi vacia y parece
   que la app esta rota. Paso de verdad el 26/09/2026.

   Este cartel dice en cual estas y deja cambiar de uno a otro.

   DONDE VA
   Abajo a la izquierda, al lado del escudo del club. La version anterior era
   una barra arriba en el medio y se superponia con el selector de idioma: por
   eso la habian sacado del dashboard. Abajo no molesta a nadie, y corrido 68px
   tampoco tapa el escudo.

   Se muestra en las paginas que lo incluyen, que son las que cambian con el
   modo: armadores.html, game_plan.html y dashboard.html. Una pagina que no
   dependa del modo simplemente no carga este archivo.
   ============================================================================ */
(function () {
  'use strict';

  var LLAVE = 'vb_modo';

  function modo() {
    try { return localStorage.getItem(LLAVE) || 'partido'; } catch (e) { return 'partido'; }
  }
  function cambiar(m) {
    try { localStorage.setItem(LLAVE, m); } catch (e) {}
    location.reload();
  }

  /* Si la pagina carga este archivo, es porque cambia segun el modo: el
     cartel se muestra y listo. Antes esto lo adivinaba mirando si existia
     LIGA_DATA_ENT o window.__MODO, y fallaba distinto en cada pantalla
     porque no todas dejan esas variables a la vista. La lista de paginas
     que lo incluyen es el control; no hace falta otro. */

  var TXT = {
    es: { p:'PARTIDO', e:'ENTRENAMIENTO', cambiar:'Tocá para cambiar' },
    en: { p:'MATCH',   e:'TRAINING',      cambiar:'Tap to switch' },
    de: { p:'SPIEL',   e:'TRAINING',      cambiar:'Zum Wechseln tippen' }
  };
  function L() {
    var l = 'es';
    try { if (typeof getLang === 'function') l = getLang(); } catch (e) {}
    return TXT[l] || TXT.es;
  }

  function pintar() {
    if (document.getElementById('vb-modo-chip')) return;

    var m = modo(), ent = (m === 'entrenamiento'), t = L();
    /* ámbar para entrenamiento, verde para partido: se distingue de un vistazo
       sin tener que leer */
    var col = ent ? '#f59e0b' : '#22c55e';

    var c = document.createElement('button');
    c.id = 'vb-modo-chip';
    c.setAttribute('data-notr', '');
    c.title = t.cambiar;
    c.style.cssText =
      /* al lado del escudo del club, que esta fijo en left:12 bottom:12 con
         46px de lado. Encimarlo tapaba el escudo. */
      'position:fixed;left:68px;bottom:14px;z-index:2147480000;' +
      'display:flex;align-items:center;gap:7px;cursor:pointer;' +
      'background:rgba(13,14,26,.92);border:1px solid ' + col + '55;' +
      'border-radius:9px;padding:6px 11px;backdrop-filter:blur(8px);' +
      'font-family:Barlow Condensed,system-ui,-apple-system,sans-serif;' +
      'box-shadow:0 6px 18px rgba(0,0,0,.4)';

    var punto = document.createElement('span');
    punto.style.cssText = 'width:7px;height:7px;border-radius:50%;background:' + col + ';flex-shrink:0';

    var txt = document.createElement('span');
    txt.style.cssText = 'font-size:11px;font-weight:800;letter-spacing:1.5px;color:' + col;
    txt.textContent = ent ? t.e : t.p;

    var flecha = document.createElement('span');
    flecha.style.cssText = 'font-size:10px;color:#64748b;margin-left:1px';
    flecha.textContent = '⇄';

    c.appendChild(punto); c.appendChild(txt); c.appendChild(flecha);
    c.addEventListener('click', function () { cambiar(ent ? 'partido' : 'entrenamiento'); });
    (document.body || document.documentElement).appendChild(c);
  }

  /* se pinta tarde a propósito: LIGA_DATA_ENT lo dejan los .enc, que tardan */
  function arrancar() { pintar(); setTimeout(pintar, 900); setTimeout(pintar, 2500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
