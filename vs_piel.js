/* ============================================================================
   vs_piel.js — las piezas de la piel nueva que necesitan javascript
   ----------------------------------------------------------------------------
   QUE HACE
   1. Le pone la clase "vs-p" al <body>, que es la llave que enciende todo
      vs_piel.css. Si este archivo no corre, la pantalla queda como estaba.
   2. Agrega a la barra de arriba el chip verde "SISTEMA ACTIVO" y la fecha
      de hoy, en el idioma elegido, como en la maqueta.
   3. Dibuja la banda de pie con el escudo, el lema y el pulso.
   4. Deja a mano el juego de iconos (VSP.ico) y el anillo de porcentaje
      (VSP.anillo), que son las dos piezas que las cuatro pantallas repiten.

   POR QUE NO ROMPE NADA
   · No toca el contenido de ninguna pantalla ni escucha ninguna tecla.
   · Todo lo que agrega lleva clase "vs-p-", que vs_cab.js ya saltea cuando
     reparte los acentos rojos.
   · Si algo falla, falla solo: cada paso va en su propio try.
   ========================================================================== */
(function () {
  'use strict';
  if (window.VSP) return;

  /* ── los iconos ─────────────────────────────────────────────────────────
     Mismo trazo que los de la barra: 24x24, sin relleno, 1.8 de grosor. */
  var D = {
    personas : '<circle cx="9.2" cy="8.2" r="3.2"/><path d="M2.8 20c.6-3.4 3.2-5.6 6.4-5.6s5.8 2.2 6.4 5.6"/><path d="M16.2 5.4a3.2 3.2 0 0 1 0 6.2"/><path d="M17.4 14.8c2.1.6 3.5 2.4 3.9 5.2"/>',
    persona  : '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.4c.6-3.8 3.6-6.2 7.2-6.2s6.6 2.4 7.2 6.2"/>',
    lupa     : '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.6 15.6 4.6 4.6"/>',
    flecha   : '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    volver   : '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
    chevron  : '<path d="m9 5 7 7-7 7"/>',
    bajar    : '<path d="m5 9 7 7 7-7"/>',
    subir    : '<path d="m5 15 7-7 7 7"/>',
    play     : '<path d="M8 5.2v13.6L19 12 8 5.2Z"/>',
    calendario: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16"/><path d="M8.5 3.4v3.6M15.5 3.4v3.6"/>',
    mancuerna: '<path d="M3 10.2v3.6M6 8.4v7.2M18 8.4v7.2M21 10.2v3.6"/><path d="M6 12h12"/>',
    pulso    : '<path d="M3 12h3.4l2-5.4 3.4 11 2.6-7 1.8 3.4H21"/>',
    corazon  : '<path d="M12 20.4S3.8 15.2 3.8 9.6A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.2 2.8c0 5.6-8.2 10.8-8.2 10.8Z"/>',
    nube     : '<path d="M6.8 18.4a4.4 4.4 0 0 1-.4-8.8 5.8 5.8 0 0 1 11.2 1.4 3.7 3.7 0 0 1-.6 7.4H6.8Z"/>',
    gota     : '<path d="M12 3.2s5.4 6 5.4 9.6a5.4 5.4 0 0 1-10.8 0C6.6 9.2 12 3.2 12 3.2Z"/>',
    viento   : '<path d="M3.4 8.4h10a2.8 2.8 0 1 0-2.8-2.8"/><path d="M3.4 12.6h14.2a2.8 2.8 0 1 1-2.8 2.8"/><path d="M3.4 16.8h7.2"/>',
    medidor  : '<circle cx="12" cy="12" r="8.6"/><path d="m12 12 3.6-3"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    luna     : '<path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6Z"/>',
    rayo     : '<path d="M13.4 2.5 5.6 13.2h5.3l-.9 8.3 8.2-10.9h-5.4l.6-8.1Z"/>',
    barras   : '<path d="M4 20h16"/><rect x="5.5" y="11" width="3.4" height="6"/><rect x="10.3" y="7" width="3.4" height="10"/><rect x="15.1" y="13.5" width="3.4" height="3.5"/>',
    linea    : '<path d="M4 20V4"/><path d="M4 20h16"/><path d="m6.5 15.5 3.6-4.2 2.9 2.4 4.9-6"/>',
    nota     : '<rect x="5" y="4.5" width="14" height="16" rx="2"/><path d="M8.6 10h6.8M8.6 14h4.4M8.6 17.4h3"/>',
    lapiz    : '<path d="M16.4 3.6a2.3 2.3 0 0 1 3.2 3.2L8.4 18H5.2v-3.2L16.4 3.6Z"/>',
    aviso    : '<path d="M12 4.2 2.8 20h18.4L12 4.2Z"/><path d="M12 10v4.2M12 17.2h.01"/>',
    info     : '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.2M12 7.8h.01"/>',
    ok       : '<circle cx="12" cy="12" r="8.6"/><path d="m8.4 12.2 2.6 2.6 4.6-5.2"/>',
    foco     : '<path d="M9.4 18.2h5.2"/><path d="M10 21h4"/><path d="M12 3.2a5.6 5.6 0 0 1 3.4 10c-.5.4-.8 1-.8 1.6v.4H9.4v-.4c0-.6-.3-1.2-.8-1.6A5.6 5.6 0 0 1 12 3.2Z"/>',
    reloj    : '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.2 1.9"/>',
    copiar   : '<rect x="8.6" y="8.6" width="11" height="11" rx="2"/><path d="M15.4 5.4H6.4a2 2 0 0 0-2 2v9"/>',
    basura   : '<path d="M4.6 6.6h14.8"/><path d="M8.4 6.6V4.8a1.4 1.4 0 0 1 1.4-1.4h4.4a1.4 1.4 0 0 1 1.4 1.4v1.8"/><path d="M6.6 6.6 7.4 20a1.4 1.4 0 0 0 1.4 1.3h6.4a1.4 1.4 0 0 0 1.4-1.3l.8-13.4"/>',
    mover    : '<path d="M8 6 4.4 9.6 8 13.2"/><path d="M4.4 9.6h15.2"/><path d="m16 10.8 3.6 3.6L16 18"/><path d="M19.6 14.4H4.4"/>',
    guardar  : '<path d="M5.4 4.4h10.2l3 3v12.2H5.4V4.4Z"/><path d="M8.4 4.4v5h6v-5"/><path d="M8.4 19.6v-5.4h7.2v5.4"/>',
    refrescar: '<path d="M20.2 11.2a8.2 8.2 0 1 1-2.4-5.4"/><path d="M20.4 3.6v4.8h-4.8"/>',
    diana    : '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    escudo   : '<path d="M12 3.2 5 6v5.6c0 4.2 2.8 7.5 7 9.2 4.2-1.7 7-5 7-9.2V6l-7-2.8Z"/>',
    pelota   : '<circle cx="12" cy="12" r="9"/><path d="M12.4 3c-3.9 3.3-5.4 8.6-3.7 13.4"/><path d="M20.8 9.6c-5 .5-9.3 3.8-11.1 8.6"/><path d="M3.5 14.9c3.6-3.5 8.9-4.9 13.8-3.4"/>',
    mas      : '<path d="M12 5v14M5 12h14"/>',
    puntos   : '<circle cx="12" cy="5.4" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="18.6" r="1.4" fill="currentColor" stroke="none"/>',
    engranaje: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.2a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.2-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>'
  };

  function ico(n, cls) {
    var p = D[n] || D.info;
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + p + '</svg>';
  }

  function idioma() {
    try { if (window.getLang) return window.getLang() || 'es'; } catch (e) {}
    var l = ''; try { l = localStorage.getItem('vb_lang') || ''; } catch (e) {}
    return (l === 'en' || l === 'de') ? l : 'es';
  }
  function t(o) { var l = idioma(); return (o && (o[l] || o.es)) || ''; }

  /* ── la fecha de hoy, escrita como la escribe cada idioma ──────────────── */
  function fechaHoy() {
    var l = idioma(), loc = l === 'en' ? 'en-GB' : l === 'de' ? 'de-CH' : 'es-ES';
    try {
      return new Date().toLocaleDateString(loc,
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return ''; }
  }

  /* ── 1 · encender la piel ─────────────────────────────────────────────── */
  function encender() {
    if (!document.body) return setTimeout(encender, 20);
    document.body.classList.add('vs-p');
  }

  /* ── 2 · el chip "SISTEMA ACTIVO" y la fecha, en la barra de arriba ─────
     Van donde la barra ya pone el selector de idioma, para no inventar un
     lugar nuevo. Si la barra todavia no existe, se espera; si nunca llega
     (una pantalla sin barra), no pasa nada. */
  var intentos = 0;
  function barra() {
    var der = document.querySelector('#vsn .der');
    if (!der) {
      if (++intentos > 60) return;         /* 6 segundos y se deja de buscar */
      return setTimeout(barra, 100);
    }
    if (document.getElementById('vs-p-vivo')) return;
    var fe = document.createElement('span');
    fe.className = 'vs-p-fecha'; fe.id = 'vs-p-fecha';
    fe.textContent = fechaHoy();
    var ch = document.createElement('span');
    ch.className = 'vs-p-vivo'; ch.id = 'vs-p-vivo';
    ch.textContent = t({ es: 'Sistema activo', en: 'System active', de: 'System aktiv' });
    der.insertBefore(fe, der.firstChild);
    der.insertBefore(ch, der.firstChild);
  }

  /* ── 3 · la banda de pie ───────────────────────────────────────────────
     El pulso es el mismo trazo del electro de la maqueta: plano, un latido,
     y despues plano otra vez. */
  var PULSO = '<svg viewBox="0 0 96 28" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0 14h14l3-9 4 18 4-13 3 6 3-2h65"/></svg>';

  function pie(lema) {
    if (!document.body || document.getElementById('vs-p-pie')) return;
    var f = document.createElement('footer');
    f.id = 'vs-p-pie'; f.className = 'vs-p-pie';
    f.innerHTML =
      '<span class="pulso">' + PULSO + '</span>' +
      '<span class="lema">' + (lema || '') + '</span>' +
      '<img class="esc" src="escudo_dark.png" alt="" ' +
        'onerror="this.onerror=null;this.src=\'escudo.png\'">';
    document.body.appendChild(f);
  }

  /* ── 4 · el anillo de porcentaje ───────────────────────────────────────
     Se arma con dos circulos y un dash: nada de librerias. "pct" va de 0 a
     100; "col" es el color del arco; "d" el diametro y "g" el grosor. */
  function anillo(pct, op) {
    op = op || {};
    var d = op.d || 92, g = op.g || 9, r = (d - g) / 2, c = 2 * Math.PI * r;
    var v = Math.max(0, Math.min(100, +pct || 0));
    var col = op.col || 'var(--p-verde)';
    return '<div class="vs-p-anillo" style="width:' + d + 'px;height:' + d + 'px">' +
      '<svg width="' + d + '" height="' + d + '">' +
        '<circle class="pista" cx="' + d / 2 + '" cy="' + d / 2 + '" r="' + r + '" stroke-width="' + g + '"/>' +
        '<circle class="arco" cx="' + d / 2 + '" cy="' + d / 2 + '" r="' + r + '" stroke-width="' + g + '"' +
          ' stroke="' + col + '" stroke-dasharray="' + (c * v / 100).toFixed(1) + ' ' + c.toFixed(1) + '"/>' +
      '</svg>' +
      '<span class="medio"><span><b>' + (op.txt != null ? op.txt : v + '%') + '</b>' +
        (op.sub ? '<i>' + op.sub + '</i>' : '') + '</span></span>' +
    '</div>';
  }

  /* el color que le toca a un valor segun el semaforo de siempre */
  function semaforo(v, bueno, medio) {
    v = +v || 0;
    if (v >= (bueno != null ? bueno : 75)) return 'var(--p-verde)';
    if (v >= (medio != null ? medio : 55)) return 'var(--p-ambar)';
    return 'var(--red)';
  }

  window.VSP = {
    ico: ico, D: D, anillo: anillo, semaforo: semaforo,
    pie: pie, idioma: idioma, t: t, fechaHoy: fechaHoy, PULSO: PULSO
  };

  encender();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', barra);
  } else { barra(); }
})();
