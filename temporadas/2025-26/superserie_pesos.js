/* ═══════════════════════════════════════════════════════════════════════════
   superserie_pesos.js — que cada ejercicio de la superserie tenga sus pesos

   ── EL PROBLEMA ──────────────────────────────────────────────────────────
   Cuando el profe arma un ejercicio combinado —"Banco Plano + Fondos"— la
   pantalla lo muestra bien: dice SUPERSERIE, pone dos botones de video y
   avisa "6 + 8 reps".

   Pero abajo hay UNA SOLA fila de pesos:

       REGISTRÁ TU PESO POR SERIE (KG)
       SERIE 1   SERIE 2   SERIE 3   SERIE 4
         60        60        60        60

   Ese 60 no se sabe si es del banco plano o de los fondos. Y son pesos
   completamente distintos: nadie hace fondos con el mismo peso que press
   de banca.

   ── LA SOLUCION ──────────────────────────────────────────────────────────
   Cuando el ejercicio es superserie, la fila se parte en dos, cada una con
   el nombre del movimiento:

       BANCO PLANO
       SERIE 1   SERIE 2   SERIE 3   SERIE 4

       FONDOS
       SERIE 1   SERIE 2   SERIE 3   SERIE 4

   Cuando NO es superserie, no se toca nada: queda exactamente como estaba.

   ── LOS PESOS YA CARGADOS ────────────────────────────────────────────────
   Las claves guardadas tienen esta forma:

       prep_<dorsal>_<idEjercicio>_s<serie>       ej: prep_4_EJ076_s2

   La primera fila sigue usando la clave de siempre, asi que TODO LO QUE YA
   ESTA CARGADO se conserva y aparece donde corresponde. La segunda fila usa
   el id2 del ejercicio, que hasta ahora no se usaba para pesos: arranca
   vacia, como debe.

   Nada se pisa. Nada se pierde.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Los nombres de los dos movimientos, a partir del titulo del ejercicio.
     El profe los escribe separados por " + ". */
  function partirNombre(txt) {
    if (!txt) return null;
    /* El titulo viene con la etiqueta pegada: "Banco Plano + Fondos SUPERSERIE".
       Se saca primero, en los tres idiomas. */
    txt = txt.replace(/\s*(SUPERSERIE|SUPERSET|SUPERSATZ)\s*$/i, '').trim();
    var p = txt.split(/\s+\+\s+/);
    if (p.length < 2) return null;
    return [p[0].trim(), p.slice(1).join(' + ').trim()];
  }

  function esSuperserie(card) {
    try {
      return !!card.querySelector('.ej-badge-super') ||
             /SUPERSERIE|SUPERSET|SUPERSATZ/i.test(card.querySelector('.ej-badges') ?
               card.querySelector('.ej-badges').textContent : '') ||
             /SUPERSERIE|SUPERSET|SUPERSATZ/i.test(card.textContent.slice(0, 220));
    } catch (e) { return false; }
  }

  /* ── Partir la fila de pesos en dos ─────────────────────────────────── */
  function partir(card) {
    if (card.getAttribute('data-super-listo')) return;

    var sec = card.querySelector('.pesos-section');
    if (!sec) return;
    if (!esSuperserie(card)) return;

    var titulo = card.querySelector('.ej-nombre');
    var nombres = partirNombre(titulo ? titulo.textContent : '');
    if (!nombres) return;                 /* no se pudo separar: se deja igual */

    var grid = sec.querySelector('.pesos-grid');
    if (!grid) return;

    var etiqueta = sec.querySelector('.pesos-label');
    var textoEtiqueta = etiqueta ? etiqueta.textContent : 'Registrá tu peso por serie (kg)';

    /* ── La primera fila: se le pone el nombre del primer movimiento ──
       Los casilleros son los MISMOS de siempre, con las mismas claves, asi
       que los pesos ya cargados siguen exactamente donde estaban. */
    if (etiqueta) {
      etiqueta.innerHTML =
        '<span style="color:#2dd4bf;font-weight:700">' + nombres[0] + '</span>' +
        '<span style="opacity:.55"> · ' + textoEtiqueta + '</span>';
    }

    /* ── La segunda fila ─────────────────────────────────────────────── */
    var series = grid.querySelectorAll('.serie-item').length;
    if (!series) return;

    var sec2 = document.createElement('div');
    sec2.className = 'pesos-section pesos-section-2';
    sec2.style.cssText = 'border-top:1px dashed rgba(255,255,255,.10)';

    var html =
      '<div class="pesos-label">' +
        '<span style="color:#a5b4fc;font-weight:700">' + nombres[1] + '</span>' +
        '<span style="opacity:.55"> · ' + textoEtiqueta + '</span>' +
      '</div><div class="pesos-grid">';

    for (var s = 1; s <= series; s++) {
      var num = grid.querySelectorAll('.serie-num')[s - 1];
      html +=
        '<div class="serie-item">' +
          '<div class="serie-num">' + (num ? num.textContent : 'SERIE ' + s) + '</div>' +
          '<input type="number" class="peso-input peso-input-2" placeholder="— kg" ' +
            'min="0" max="500" step="0.5" data-serie="' + s + '">' +
        '</div>';
    }
    html += '</div>';
    sec2.innerHTML = html;

    sec.parentNode.insertBefore(sec2, sec.nextSibling);
    card.setAttribute('data-super-listo', '1');

    conectar(card, sec2);
  }

  /* ── Guardar y recuperar los pesos del segundo ejercicio ────────────── */
  function conectar(card, sec2) {
    /* El id del segundo movimiento sale del boton "Video 2", que ya lo
       lleva. Si no aparece, se arma a partir del primero con el sufijo _b:
       asi nunca choca con la clave del primer ejercicio. */
    var id2 = card.getAttribute('data-id2');
    if (!id2) {
      var base = card.getAttribute('data-id') ||
                 (card.querySelector('.ej-num') ? 'EJ' + card.querySelector('.ej-num').textContent.trim() : 'EJ');
      id2 = base + '_b';
    }

    var num = '';
    try { num = (window.JUGADOR_ACTUAL && window.JUGADOR_ACTUAL.num) || window.NUM_ACTUAL || ''; } catch (e) {}
    if (!num) {
      try { num = (localStorage.getItem('vb_num') || '').trim(); } catch (e) {}
    }

    sec2.querySelectorAll('.peso-input-2').forEach(function (inp) {
      var clave = 'prep_' + num + '_' + id2 + '_s' + inp.getAttribute('data-serie');

      /* lo que ya estuviera cargado */
      try {
        var v = localStorage.getItem(clave);
        if (v !== null && v !== '') inp.value = v;
      } catch (e) {}
      try { if (window.fbGet) fbGet('pesos/' + clave, function (d) {
        if (d !== null && d !== undefined && d !== '' && !inp.value) inp.value = d;
      }); } catch (e) {}

      /* al escribir, se guarda igual que el primero */
      inp.addEventListener('change', function () {
        var val = inp.value.trim();
        try { localStorage.setItem(clave, val); } catch (e) {}
        try { if (window.fbSet) fbSet('pesos/' + clave, val === '' ? null : val); } catch (e) {}
      });
    });
  }

  /* ── Recorrer las tarjetas, y volver a hacerlo cuando cambian ───────── */
  function repasar() {
    document.querySelectorAll('.ejercicio').forEach(partir);
  }

  function arrancar() {
    repasar();
    /* la rutina se redibuja al cambiar de jugador, de mes o de día */
    try {
      new MutationObserver(function () {
        clearTimeout(window.__superT);
        window.__superT = setTimeout(repasar, 250);
      }).observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', function () { setTimeout(arrancar, 800); });
  else setTimeout(arrancar, 800);

  window.__superserieRepasar = repasar;
})();

/* © 2025-2026 Volley-Stats · Ignacio Verdi · Software propietario */
