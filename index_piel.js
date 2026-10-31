/* ============================================================================
   index_piel.js — LA PORTADA, CON EL MODELO NUEVO
   ----------------------------------------------------------------------------
   QUE HACE
   La portada ya tenia dos capas encima (nv-piel y nv-portada) que reordenaban
   las tarjetas originales en paneles. Este archivo NO vuelve a empezar: toma
   lo que esas capas ya armaron y lo lleva a la forma de la maqueta nueva.

     1. El hero deja de decir "datos que generan decisiones" y pasa a ser el
        proximo rival, con el boton grande de Plan de partido. Los tres
        destinos —Game Plan, Playbook y Detalle— son las MISMAS tarjetas que
        la pantalla ya tenia: no se inventa ningun vinculo.
     2. Las tarjetas de las cuatro secciones pasan de mosaico a renglon con
        flecha. Eso es casi todo CSS: el <a> y su href no se tocan.
     3. Herramientas del entrenador pasa a ocupar el ancho completo.
     4. Abajo: el carrusel del fixture y el contador del proximo partido,
        los dos con el fixture real (proximo_rival.js / fixture_auto.js).

   SI ESTE ARCHIVO NO CARGA, la portada queda como estaba. Todo lo que hace
   es mover y vestir lo que ya existia.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__VS_IX) return; window.__VS_IX = true;

  function T(s) { try { return (window.tr && window.tr(s)) || s; } catch (e) { return s; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ico(n) { return (window.VSP && VSP.ico) ? VSP.ico(n) : ''; }
  function $(id) { return document.getElementById(id); }

  var MES3 = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  var DIA3 = ['dom','lun','mar','mié','jue','vie','sáb'];

  function fixture() {
    var F = window.FIXTURE_DATA;
    return (F && F.fixture) ? F.fixture.slice() : [];
  }
  function proximos(n) {
    var hoy = new Date().toISOString().slice(0, 10);
    var l = fixture().filter(function (q) { return q.fecha >= hoy; });
    return l.length ? l.slice(0, n) : fixture().slice(-n);
  }

  /* ══ 1 · EL HERO ═══════════════════════════════════════════════════════ */
  function hero() {
    var h = $('nv-hero'); if (!h) return;
    var txt = h.querySelector('.txt'); if (!txt || txt.dataset.ix === '1') return;
    txt.dataset.ix = '1';

    /*  los tres destinos salen de las tarjetas que la pantalla ya tenia  */
    function link(slugs, porDefecto) {
      var a = null;
      slugs.some(function (s) {
        a = document.querySelector('#nv-rival a[href^="' + s + '"], a.card[href^="' + s + '"]');
        return !!a;
      });
      return a ? a.getAttribute('href') : porDefecto;
    }
    var hGame = link(['game_plan'], 'game_plan.html');
    var hPlay = link(['Team_Playbook_Nafels'], 'Team_Playbook_Nafels.html');
    var hPlan = link(['plan_partido'], 'plan_partido.html');

    var p = proximos(1)[0];
    var rival = p ? p.rival : '';

    txt.innerHTML =
      '<div class="ix-k"><span>' + T('El próximo') + '</span> <b>' + T('rival') + '</b></div>' +
      '<h2><span class="ix-h1">' + T('Todo para llegar preparado') + '</span><br>' +
        '<span class="ix-h2">' + T('al partido') + '</span></h2>' +
      '<div class="ix-cta">' +
        '<a class="ix-boton" href="' + esc(hGame) + '">' + T('Abrir plan de partido') + ico('flecha') + '</a>' +
        '<a class="ix-tarj" href="' + esc(hPlay) + '">' + ico('personas') +
          '<span><b>' + T('Equipo') + '</b>' + T('Playbook') + '</span>' + ico('chevron') + '</a>' +
        '<a class="ix-tarj" href="' + esc(hPlan) + '">' + ico('nota') +
          '<span><b>' + T('Detalle') + '</b>' + T('imprimible') + '</span>' + ico('chevron') + '</a>' +
      '</div>';

    if (!h.querySelector('.ix-lema')) {
      var l = document.createElement('div'); l.className = 'ix-lema';
      l.innerHTML = '<span>' + T('Analizar') + '</span><span>' + T('Planificar') + '</span>' +
                    '<span>' + T('Competir') + '</span>';
      h.appendChild(l);
    }
    h.classList.add('ix-hero');
    /*  el rotulo viejo de la derecha ("analisis / estrategia / rendimiento")
        se encimaba con el lema nuevo  */
    [].forEach.call(h.children, function (e) {
      if (e === txt || e.classList.contains('ix-lema')) return;
      if (/^(bg|lux|shade)$/.test(e.className)) return;   /* el arte de fondo se queda */
      if ((e.textContent || '').trim()) e.classList.add('ix-oculto');
    });
    if (rival) h.setAttribute('data-rival', rival);
  }

  /* ══ 2 · LAS TARJETAS, EN RENGLON ══════════════════════════════════════
     Solo se marca el <a>: el href, el texto y el icono quedan como estaban.
     El resto lo hace vs_piel.css. */
  function renglones() {
    [].forEach.call(document.querySelectorAll('.nv-tile'), function (c) {
      if (c.dataset.ixr === '1') return;
      c.dataset.ixr = '1';
      c.classList.add('ix-fila');
      if (!c.querySelector('.ix-fl')) {
        var f = document.createElement('span'); f.className = 'ix-fl';
        f.innerHTML = ico('chevron');
        c.appendChild(f);
      }
    });
  }

  /* ══ 3 · EL ORDEN DE LA PAGINA ═════════════════════════════════════════
     En vez de pelear con las filas que arma nv-portada, se toman los paneles
     que ya existen y se los pone en el orden de la maqueta:

        las cuatro secciones, una al lado de la otra
        herramientas del entrenador, a todo el ancho
        fixture + contador
        el buscador de pantallas

     Los paneles son los mismos de antes: cambia donde estan colgados. */
  function acomodar() {
    var zona = $('nv-zona'); if (!zona) return;

    /*  lo que sobra: el proximo rival (ahora esta en el hero), el fixture
        viejo (lo reemplaza el carrusel) y el contador viejo del encabezado  */
    ['nv-rival', 'nv-fixp', 'countdown-bar'].forEach(function (id) {
      var e = $(id); if (e) e.classList.add('ix-oculto');
    });

    /*  el buscador de pantallas vive adentro del panel del rival: se rescata  */
    var hub = $('hub-top');
    if (hub && !$('ix-hub')) {
      var caja = document.createElement('div'); caja.id = 'ix-hub'; caja.className = 'ix-hub';
      caja.appendChild(hub);
      zona.appendChild(caja);
    }

    /*  las cuatro secciones  */
    var secs = [].filter.call(zona.querySelectorAll('.nv-pan'), function (p) {
      return p.id !== 'nv-rival' && p.id !== 'nv-fixp' && p.id !== 'nv-coachp' &&
             !p.classList.contains('vs-p-pan') && !p.closest('.ix-rowSec');
    });
    if (secs.length) {
      var fs = $('ix-rowSec');
      if (!fs) { fs = document.createElement('div'); fs.id = 'ix-rowSec'; fs.className = 'ix-rowSec'; }
      secs.forEach(function (p) { p.style.flex = ''; fs.appendChild(p); });
      zona.appendChild(fs);
    }

    /*  cuantas columnas adentro de cada panel: dos si tiene seis o mas  */
    [].forEach.call(zona.querySelectorAll('.nv-gt'), function (g) {
      if (g.id === 'nv-coach' || g.id === 'nv-coach-mas') return;
      var n = g.children.length;
      g.style.gridTemplateColumns = (n >= 6 ? 'repeat(2,minmax(0,1fr))' : '1fr');
    });

    /*  herramientas del entrenador, a todo el ancho  */
    var pC = $('nv-coachp');
    if (pC) {
      var fd = $('ix-rowDT');
      if (!fd) { fd = document.createElement('div'); fd.id = 'ix-rowDT'; fd.className = 'ix-rowDT'; }
      if (pC.parentNode !== fd) { pC.style.flex = ''; fd.appendChild(pC); }
      zona.appendChild(fd);
      var mas = $('nv-coach-mas'); if (mas) mas.classList.add('abierto');
      var ver = pC.querySelector('.nv-pv'); if (ver) ver.style.display = 'none';
      if (!pC.querySelector('.ix-sub')) {
        var sub = document.createElement('div'); sub.className = 'ix-sub';
        sub.textContent = T('Todo lo que necesitás, en un solo lugar.');
        var ph = pC.querySelector('.nv-ph');
        if (ph) ph.insertAdjacentElement('afterend', sub);
      }
    }

    /*  los envoltorios que quedaron sin ningun panel adentro  */
    [].forEach.call(zona.children, function (e) {
      if (/^(ix-|nv-rowA)/.test(e.id || e.className)) return;
      if (!e.querySelector('.nv-pan, .card, input, button')) e.classList.add('ix-oculto');
    });

    /*  y al final el fixture, el contador y el buscador  */
    var ab = $('ix-abajo'); if (ab) zona.appendChild(ab);
    var hb = $('ix-hub');   if (hb) zona.appendChild(hb);
  }

  /* ══ 4 · EL FIXTURE Y EL CONTADOR ══════════════════════════════════════ */
  var CD = null;
  function abajo() {
    var zona = $('nv-zona'); if (!zona || $('ix-abajo')) return;
    var fila = document.createElement('div'); fila.id = 'ix-abajo'; fila.className = 'ix-rowFX';
    fila.innerHTML =
      '<section class="vs-p-pan ix-fx"><div class="vs-p-pan-cab">' +
        '<span class="vs-p-ico">' + ico('calendario') + '</span>' +
        '<span class="t">' + T('Fixture') + ' · NLA ' + T('Suiza') + ' 2026/27</span>' +
        '<a class="der" href="calendario.html">' + T('Ver todo') + '</a></div>' +
        '<div class="vs-p-pan-cuerpo"><button type="button" class="ix-fle izq" aria-label="' + T('Anterior') + '">' +
          ico('chevron') + '</button><div class="ix-fxw" id="ix-fxw"></div>' +
          '<button type="button" class="ix-fle der2" aria-label="' + T('Siguiente') + '">' + ico('chevron') + '</button>' +
        '</div></section>' +
      '<section class="vs-p-pan ix-cd"><div class="vs-p-pan-cab">' +
        '<span class="vs-p-ico">' + ico('reloj') + '</span>' +
        '<span class="t">' + T('Próximo partido') + '</span></div>' +
        '<div class="vs-p-pan-cuerpo" id="ix-cd"></div></section>';
    zona.appendChild(fila);

    pintarFixture();
    pintarContador();
    if (CD) clearInterval(CD);
    CD = setInterval(pintarContador, 1000);

    var w = $('ix-fxw');
    fila.querySelector('.ix-fle.izq').addEventListener('click', function () { w.scrollBy({ left: -250, behavior: 'smooth' }); });
    fila.querySelector('.ix-fle.der2').addEventListener('click', function () { w.scrollBy({ left: 250, behavior: 'smooth' }); });
  }

  function escudo(slug) {
    return '<img src="escudos/' + esc(slug) + '.png" alt="" ' +
           'onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),' +
           '{className:\'ix-esc-x\',textContent:\'' + esc(String(slug || '?').slice(0, 2).toUpperCase()) + '\'}))">';
  }

  function pintarFixture() {
    var w = $('ix-fxw'); if (!w) return;
    var l = proximos(6);
    var F = window.FIXTURE_DATA && window.FIXTURE_DATA.fixture;
    w.innerHTML = l.map(function (q) {
      var d = new Date(q.fecha + 'T12:00:00');
      var loc = q.cond === 'local';
      var j = F ? F.indexOf(q) + 1 : 0;
      return '<a class="ix-pt" href="calendario.html">' +
        '<div class="fe">' + T(DIA3[d.getDay()]) + '. ' +
          ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear() +
          ' <b>18:00</b></div>' +
        '<div class="eq">' +
          '<span class="e">' + escudo(loc ? 'nafels' : q.slug) + '</span>' +
          '<span class="n">' + esc(loc ? 'Näfels' : q.rival) + '</span>' +
          '<span class="vs">vs</span>' +
          '<span class="n">' + esc(loc ? q.rival : 'Näfels') + '</span>' +
          '<span class="e">' + escudo(loc ? q.slug : 'nafels') + '</span>' +
        '</div>' +
        '<div class="li">NLA' + (j ? ' · ' + T('Jornada') + ' ' + j : '') + '</div>' +
      '</a>';
    }).join('') || '<div class="we-vacio">' + T('Todavía no hay partidos cargados') + '</div>';
  }

  function pintarContador() {
    var c = $('ix-cd'); if (!c) return;
    var p = proximos(1)[0];
    if (!p) { c.innerHTML = '<div class="we-vacio">' + T('Todavía no hay partidos cargados') + '</div>'; return; }
    var d = new Date(p.fecha + 'T18:00:00');
    var ms = d - new Date();
    var neg = ms < 0; if (neg) ms = 0;
    var dd = Math.floor(ms / 86400000),
        hh = Math.floor(ms / 3600000) % 24,
        mm = Math.floor(ms / 60000) % 60,
        ss = Math.floor(ms / 1000) % 60;
    function caja(v, t) {
      return '<span class="ix-cdc"><b>' + ('0' + v).slice(-2) + '</b><i>' + t + '</i></span>';
    }
    var loc = p.cond === 'local';
    /*  la cabecera solo se rehace cuando cambia el partido: si no, el
        contador parpadearia una vez por segundo  */
    if (c.dataset.p !== p.fecha + p.slug) {
      c.dataset.p = p.fecha + p.slug;
      c.innerHTML =
        '<div class="ix-cdj">' +
          '<span class="e">' + escudo('nafels') + '</span>' +
          '<span class="n">Näfels</span><span class="vs">vs</span>' +
          '<span class="n">' + esc(p.rival) + '</span>' +
          '<span class="e">' + escudo(p.slug) + '</span>' +
        '</div>' +
        '<div class="ix-cdf">' + ico('calendario') + '<span>' +
          T(DIA3[d.getDay()]) + '. ' + ('0' + d.getDate()).slice(-2) + '.' +
          ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear() + ' · 18:00</span></div>' +
        '<div class="ix-cdf">' + ico('diana') + '<span>' + T(loc ? 'Local' : 'Visitante') + '</span></div>' +
        '<div class="ix-cdr" id="ix-cdr"></div>';
    }
    var r = $('ix-cdr');
    if (r) r.innerHTML = neg
      ? '<span class="ix-cdya">' + T('¡Hoy se juega!') + '</span>'
      : caja(dd, T('días')) + caja(hh, T('horas')) + caja(mm, T('min')) + caja(ss, T('seg'));
  }

  /* ══ 5 · EL PIE ════════════════════════════════════════════════════════ */
  function pie() {
    if (window.VSP && VSP.pie) VSP.pie(VSP.t({
      es: 'Más análisis. Mejores decisiones.',
      en: 'More analysis. Better decisions.',
      de: 'Mehr Analyse. Bessere Entscheidungen.' }));
  }

  /* ══ ARRANQUE ══════════════════════════════════════════════════════════
     nv-portada-js arma los paneles despues de que carguen los datos, asi que
     se reintenta hasta que la zona exista. Cada paso se marca y no se repite. */
  var intentos = 0;
  function todo() {
    try { document.body.classList.add('vs-p', 'ix-p'); } catch (e) {}
    try { hero(); } catch (e) {}
    try { renglones(); } catch (e) {}
    try { if ($('nv-zona')) abajo(); } catch (e) {}
    try { acomodar(); } catch (e) {}
    try { pie(); } catch (e) {}
    /*  nv-portada arma los paneles cuando llegan los datos, que puede ser
        varios segundos despues. Se reintenta 40 veces (13 s) y encima queda
        un vigia por si algo se dibuja todavia mas tarde.                  */
    if (++intentos < 40) setTimeout(todo, 320);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', todo);
  else todo();

  /*  el vigia: cualquier tarjeta nueva se convierte en renglon sola  */
  try {
    new MutationObserver(function () {
      try { renglones(); } catch (e) {}
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  /*  cuando fixture_auto.js pisa el calendario, se redibuja  */
  var antes = window.vbFixtureCambio;
  window.vbFixtureCambio = function () {
    try { if (typeof antes === 'function') antes(); } catch (e) {}
    try { pintarFixture(); pintarContador(); hero(); } catch (e) {}
  };
})();
