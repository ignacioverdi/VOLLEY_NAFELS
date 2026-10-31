/* ══════════════════════════════════════════════════════════════════════════
   PANEL VOLEY · SOLO LO VISUAL

   Esta pantalla es la herramienta de partido: no se toca NADA de como
   funciona. Este archivo no cambia un solo manejador, no mueve un boton de
   lugar y no renombra ningun id. Hace dos cosas y nada mas:

     1. La franja de OBJETIVOS DE EQUIPO estaba pegada a los dos bordes de la
        pantalla: el rotulo de la izquierda y la ultima columna —"% armado de
        alta"— quedaban cortados. Ahora lleva el mismo margen lateral que el
        resto del contenido (24 px, el de #main-content) y entra completa.

     2. El titulo del encabezado queda a la escala de las demas pantallas, con
        su linea chiquita arriba, y "VOLEY" pasa del violeta —que venia de
        otra app— al cian de la casa.

   Si algo de esto no gusta, se borra el <script> y la pantalla vuelve exacta
   a como estaba: no hay nada mas que deshacer.                              */
(function () {
  'use strict';

  function T(s) { try { return (window.tr && window.tr(s)) || s; } catch (e) { return s; } }

  var CSS = [
    /* 1 · la franja de objetivos, con el mismo margen que el contenido */
    '#objetivos-panel{padding-left:24px!important;padding-right:24px!important;box-sizing:border-box!important}',
    '@media(max-width:700px){#objetivos-panel{padding-left:12px!important;padding-right:12px!important}}',
    /* 2 · el titulo a la escala de la casa */
    'header.hdr .htit{display:flex!important;flex-direction:column!important;',
    '  align-items:flex-start!important;justify-content:center!important;gap:2px!important;',
    '  font-family:var(--vsTit,"Barlow Condensed",sans-serif)!important;font-size:26px!important;',
    '  font-weight:700!important;letter-spacing:.045em!important;line-height:1.02!important;',
    '  color:#fff!important}',
    'header.hdr .htit>.pv-ceja{font-family:var(--vsUI,inherit)!important;font-size:9.5px!important;',
    '  font-weight:700!important;letter-spacing:.22em!important;text-transform:uppercase!important;',
    '  color:var(--mut,#8FA8BE)!important;line-height:1.2!important;white-space:nowrap}',
    'header.hdr .htit>.pv-ceja em{font-style:normal;color:var(--cyan,#00CFFF)}',
    'header.hdr .htit>.pv-nom{display:block;white-space:nowrap}',
    'header.hdr .htit span{color:var(--cyan,#00CFFF)!important}'
  ].join('\n');

  function estilo() {
    if (document.getElementById('pv-piel-css')) return;
    var s = document.createElement('style');
    s.id = 'pv-piel-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /*  La ceja va ADENTRO del titulo, no como hermano: el encabezado es un
      flex y un hermano nuevo se pondria al lado, no arriba. Asi sigue
      habiendo un solo hijo donde antes habia uno.                          */
  function ceja() {
    var t = document.querySelector('header.hdr .htit');
    if (!t || t.querySelector('.pv-ceja')) return;
    var nom = document.createElement('span');
    nom.className = 'pv-nom';
    while (t.firstChild) nom.appendChild(t.firstChild);
    var c = document.createElement('span');
    c.className = 'pv-ceja';
    c.innerHTML = '<em>NÄFELS</em> · <span class="pv-ceja-t">' + T('Panel en vivo') + '</span>';
    t.appendChild(c);
    t.appendChild(nom);
  }

  function arrancar() {
    estilo();
    try { ceja(); } catch (e) {}
    /*  el encabezado lo reacomodan vs_cab.js y pv-vivo: se reintenta  */
    [400, 1200, 2600].forEach(function (ms) {
      setTimeout(function () { try { estilo(); ceja(); } catch (e) {} }, ms);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
