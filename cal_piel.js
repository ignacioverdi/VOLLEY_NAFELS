/* ============================================================================
   cal_piel.js — EL CALENDARIO, CON EL MODELO NUEVO
   ----------------------------------------------------------------------------
   No reescribe el calendario: toma los controles que ya existen y los acomoda
   como la maqueta —las dos vistas arriba, las acciones a la derecha, los
   filtros en su fila— y agrega la columna de PROXIMOS EVENTOS, que sale de
   buildEventsMap(), la misma funcion que ya dibuja la grilla del mes.
   Si este archivo no carga, el calendario queda como estaba.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__VS_CAL) return; window.__VS_CAL = true;

  function T(s) { try { return (window.tr && window.tr(s)) || s; } catch (e) { return s; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ico(n) { return (window.VSP && VSP.ico) ? VSP.ico(n) : ''; }
  function $(id) { return document.getElementById(id); }

  var DIA3 = ['dom','lun','mar','mié','jue','vie','sáb'];
  var MES3 = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  /* ══ 1 · LA BANDA ══════════════════════════════════════════════════════ */
  function hero() {
    var h = document.querySelector('.header'); if (!h || h.dataset.cal === '1') return;
    h.dataset.cal = '1';
    h.innerHTML =
      '<div class="vs-p-hero-izq">' +
        '<a href="index.html" class="vs-p-volver">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:14px;height:14px;stroke:currentColor;' +
          'fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round">' +
          '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/></svg>' +
          '<span data-t="Volver">' + T('Volver') + '</span></a>' +
        '<div class="vs-p-tit vs-cab-tit">' + T('Calendario') + '</div>' +
        '<div class="vs-p-sub">AXPO VOLLEY NÄFELS</div>' +
      '</div>';
  }

  /* ══ 2 · LAS DOS BARRAS ════════════════════════════════════════════════
     Arriba: las dos vistas a la izquierda y las acciones a la derecha.
     Abajo : los filtros, los atajos de carga y el rango.
     Los botones son los MISMOS: solo cambian de caja.                     */
  var ACCIONES = ['cal-sub-btn', 'add-btn', 'import-btn', 'recuperar-btn'];
  var ATAJOS   = ['import-gym-btn', 'import-xmas-btn', 'import-volley-btn', 'import-filzbach-btn'];

  function barras() {
    var wrap = $('wrap'); if (!wrap) return;
    var vt = document.querySelector('.view-toggle');
    if (!vt || vt.dataset.cal === '1') return;
    vt.dataset.cal = '1';

    var b1 = document.createElement('div'); b1.className = 'cal-bar'; b1.id = 'cal-bar1';
    vt.parentNode.insertBefore(b1, vt);
    b1.appendChild(vt);
    var der = document.createElement('div'); der.className = 'der'; b1.appendChild(der);
    /*  los dos de "usar fixture" y "archivar" no tienen id: se buscan por
        lo que hacen, que es lo unico estable                              */
    [].forEach.call(document.querySelectorAll('[onclick^="usarFixture"],[onclick^="archivarTemporada"]'),
      function (b) { der.appendChild(b); });
    ACCIONES.forEach(function (id) { var e = $(id); if (e) der.appendChild(e); });

    var b2 = document.createElement('div'); b2.className = 'cal-bar'; b2.id = 'cal-bar2';
    b1.insertAdjacentElement('afterend', b2);
    var tabs = document.querySelector('#lista-view .tabs');
    if (tabs) b2.appendChild(tabs);
    var at = document.createElement('div'); at.className = 'atajos'; b2.appendChild(at);
    ATAJOS.forEach(function (id) { var e = $(id); if (e) at.appendChild(e); });
    var der2 = document.createElement('div'); der2.className = 'der'; b2.appendChild(der2);
    var rt = document.querySelector('.range-toggle');
    if (rt) der2.appendChild(rt);
    [].forEach.call(document.querySelectorAll('#btn-hoy,[onclick^="planMove"],[onclick^="planHoy"]'),
      function (b) { der2.appendChild(b); });
  }

  /* ══ 3 · LA COLUMNA DE PROXIMOS EVENTOS ════════════════════════════════ */
  function proximos() {
    var pv = $('plan-view'); if (!pv) return;
    if (!$('cal-prox')) {
      var caja = document.createElement('section');
      caja.id = 'cal-prox'; caja.className = 'vs-p-pan cal-prox';
      caja.innerHTML =
        '<div class="vs-p-pan-cab"><span class="vs-p-ico">' + ico('calendario') + '</span>' +
        '<span class="t">' + T('Próximos eventos') + '</span></div>' +
        '<div class="vs-p-pan-cuerpo" id="cal-prox-b"></div>';
      var grid = $('plan-grid');
      if (grid && grid.parentNode) {
        var fila = document.createElement('div'); fila.className = 'cal-dos'; fila.id = 'cal-dos';
        grid.parentNode.insertBefore(fila, grid);
        fila.appendChild(grid); fila.appendChild(caja);
      } else { pv.appendChild(caja); }
    }
    pintarProximos();
  }

  function pintarProximos() {
    var c = $('cal-prox-b'); if (!c) return;
    var map = null;
    try { map = (typeof buildEventsMap === 'function') ? buildEventsMap() : null; } catch (e) {}
    if (!map) { c.innerHTML = '<div class="we-vacio">' + T('Todavía no hay nada cargado') + '</div>'; return; }
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    var l = [];
    Object.keys(map).sort().forEach(function (y) {
      var d = new Date(y + 'T12:00:00');
      if (d < hoy) return;
      (map[y] || []).forEach(function (ev) { l.push({ y: y, d: d, ev: ev }); });
    });
    l = l.slice(0, 7);
    if (!l.length) { c.innerHTML = '<div class="we-vacio">' + T('No hay eventos próximos') + '</div>'; return; }
    c.innerHTML = l.map(function (x) {
      var e = x.ev.e, part = x.ev.type === 'p';
      var cl = part ? 'p' : (typeof esEvento === 'function' && esEvento(e.tipo) ? 'ev' : 'e');
      var tit = part ? (T('Partido')) : esc(e.tipo || T('Entrenamiento'));
      var sub = part ? esc(e.rival || '') : esc(e.lugar || 'Näfels');
      return '<div class="cal-px ' + cl + '">' +
        '<span class="f"><i>' + T(DIA3[x.d.getDay()]) + '</i><b>' + x.d.getDate() + '</b>' +
          '<i>' + T(MES3[x.d.getMonth()]) + '</i></span>' +
        '<span class="ic">' + ico(part ? 'diana' : (cl === 'e' ? 'mancuerna' : 'pelota')) + '</span>' +
        '<span class="tx"><b>' + (e.hora ? esc(e.hora) + ' · ' : '') + tit + '</b>' +
          (sub ? '<span>' + sub + '</span>' : '') + '</span></div>';
    }).join('') +
    '<p class="we-nota">' + ico('info') + ' ' + T('Tocá un evento para editarlo') + '</p>';
  }

  /* ══ 4 · ARRANQUE ══════════════════════════════════════════════════════ */
  var n = 0;
  function todo() {
    try { document.body.classList.add('vs-p', 'cal-p'); } catch (e) {}
    try { hero(); } catch (e) {}
    try { barras(); } catch (e) {}
    try { proximos(); } catch (e) {}
    try {
      if (window.VSP && VSP.pie && !$('vs-p-pie')) VSP.pie(VSP.t({
        es: 'Más análisis. Mejores decisiones.',
        en: 'More analysis. Better decisions.',
        de: 'Mehr Analyse. Bessere Entscheidungen.' }));
    } catch (e) {}
    if (++n < 30) setTimeout(todo, 350);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', todo);
  else todo();

  /*  cuando el calendario se vuelve a dibujar, la columna se actualiza  */
  ['renderPlan', 'render', 'setView', 'setRange'].forEach(function (f) {
    var orig = window[f];
    if (typeof orig !== 'function') return;
    window[f] = function () {
      var r = orig.apply(this, arguments);
      try { proximos(); } catch (e) {}
      return r;
    };
  });
})();
