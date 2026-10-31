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
  /*  la llave: el mismo trazado que iconos.js usa para "herramientas"  */
  var LLAVE = '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0' +
    'l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91' +
    'a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>';
  var CHINCHE = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21.2c4.3-4.3 6.5-7.6 6.5-10.2a6.5 6.5 0 1 0-13 0c0 2.6 2.2 5.9 6.5 10.2z"/>' +
    '<circle cx="12" cy="10.6" r="2.5"/></svg>';
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
        '<a class="ix-boton" href="' + esc(hGame) + '">' + T('Abrir plan de partido') + ico('chevron') + '</a>' +
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

  /*  titulo del panel -> bajada. Las frases son las de la maqueta.  */
  /*  La llave es el titulo del panel SIN TILDES y en minuscula, en los tres
      idiomas: con la app en ingles el titulo dice "MY PERFORMANCE" y antes no
      lo encontraba, asi que tres de las cuatro bajadas no salian.           */
  var R1 = 'Analiza. Mejora. Evoluciona.';
  var R2 = 'Rendimiento dentro y fuera de la cancha.';
  var R3 = 'Organiza. Planifica. Cumple.';
  var R4 = 'Estudia. Analiza. Decide.';
  var BAJADAS = {
    'mi rendimiento': R1, 'my performance': R1, 'meine leistung': R1,
    'fisico y bienestar': R2, 'fitness & wellbeing': R2, 'physis & wohlbefinden': R2,
    'agenda': R3, 'kalender': R3,
    'video y juego': R4, 'video & game': R4, 'video & spiel': R4
  };
  function sinTildes(t) {
    return String(t || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }
  /*  "SOLO DT" detras del titulo de Herramientas, como en la maqueta.  */
  function soloDT(zona) {
    if (!zona) return;
    var t = null;
    [].forEach.call(zona.querySelectorAll('.nv-pt'), function (e) {
      if (/herramientas/i.test(sinTildes(e.textContent))) t = e;
    });
    if (!t) return;
    /*  el icono del panel: en la maqueta es una llave, no el escudo. Es el
        mismo dibujo que usa iconos.js para "herramientas".                */
    try {
      var ph = t.closest ? t.closest('.nv-ph') : null;
      var pic = ph && ph.querySelector('.nv-pic svg');
      if (pic && pic.getAttribute('data-vs-llave') !== '1') {
        pic.setAttribute('data-vs-llave', '1');
        pic.innerHTML = LLAVE;
      }
    } catch (e) {}
    if (t.querySelector('.ix-solodt')) return;
    var s = document.createElement('span');
    s.className = 'ix-solodt';
    s.textContent = '· ' + T('Solo DT');
    t.appendChild(s);
  }

  /*  LAS FICHAS ALTAS
      En los paneles con pocos accesos la ficha se estira para llenar el
      panel. En la maqueta, cuando eso pasa el icono y el texto crecen con
      ella: no queda letra chica adentro de un cuadro grande. Se mide el
      alto de verdad y se marca la ficha; el tamaño lo pone la hoja.      */
  function altas(zona) {
    if (!zona) return;
    [].forEach.call(zona.querySelectorAll('#ix-rowSec a.card, #ix-rowDT a.card'), function (c) {
      var h = 0;
      try { h = c.getBoundingClientRect().height; } catch (e) { return; }
      if (!h) return;
      c.classList.toggle('ix-alta', h >= 62);
    });
  }

  /*  LOS ICONOS DE LA MAQUETA
      La app dibuja el icono a partir del emoji que trae cada acceso, asi
      que salian uno por otro: "Horarios" con un almanaque en vez de un
      reloj, "Wellness" con un estetoscopio en vez de un loto, y el panel
      de Fisico con una linea de pulso sola en vez del corazon.
      Aca estan dibujados los MISMOS de la maqueta, sobre la misma grilla
      de 24x24 y con el mismo grosor de trazo que el resto de la app, y se
      le pone a cada acceso el que le corresponde por su nombre. Si un
      nombre no figura en la lista, se queda con el que ya tenia.        */
  var DIB = {
    diana: '<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4.3"/>' +
           '<circle cx="11" cy="13" r="1" fill="currentColor" stroke="none"/>' +
           '<path d="m13.9 10.1 5.9-5.9"/><path d="M15.4 4.2h4.6v4.6"/>',
    personas: '<circle cx="9" cy="8" r="3.4"/>' +
           '<path d="M2.8 20.2c.5-3.6 3.1-6 6.2-6s5.7 2.4 6.2 6"/>' +
           '<path d="M16.4 5.2a3.4 3.4 0 0 1 0 6.3"/>' +
           '<path d="M17.6 14.6c2.2.7 3.6 2.6 4 5.6"/>',
    pin: '<path d="M12 21.4c4.4-4.6 6.6-8 6.6-10.6a6.6 6.6 0 1 0-13.2 0c0 2.6 2.2 6 6.6 10.6Z"/>' +
           '<circle cx="12" cy="10.6" r="2.6"/>',
    trofeo: '<path d="M7.4 3.6h9.2v5.6a4.6 4.6 0 0 1-9.2 0V3.6Z"/>' +
           '<path d="M7.4 5.6H4.8a2.6 2.6 0 0 0 2.6 2.8"/>' +
           '<path d="M16.6 5.6h2.6a2.6 2.6 0 0 1-2.6 2.8"/>' +
           '<path d="M12 13.8v3.2"/><path d="M8.4 20.4h7.2"/>' +
           '<path d="M9.8 17h4.4v3.4H9.8z"/>',
    monitor: '<rect x="2.8" y="4.2" width="18.4" height="12.6" rx="2"/>' +
           '<path d="M8.6 20.6h6.8"/><path d="M12 16.8v3.8"/>',
    documento: '<path d="M13.6 2.8H6.8a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10.4a2 2 0 0 0 2-2V8.4l-5.6-5.6Z"/>' +
           '<path d="M13.4 3v5.4h5.4"/><path d="M8.6 13h6.8M8.6 16.6h6.8"/>',
    lupa: '<circle cx="10.6" cy="10.6" r="6.8"/><path d="m15.6 15.6 4.8 4.8"/>',
    mancuerna: '<path d="M1.4 9v6M5.6 4.2v15.6M18.4 4.2v15.6M22.6 9v6"/><path d="M5.6 12h12.8"/>',
    loto: '<path d="M12 20.4c-2.1 0-3.8-3.3-3.8-7.3S10.4 3.4 12 3.4s3.8 5.7 3.8 9.7-1.7 7.3-3.8 7.3Z"/>' +
           '<path d="M12 20.4c-3.7.8-7.6-2.1-8.9-6 3.3-1.6 7-.4 8.9 2.3"/>' +
           '<path d="M12 20.4c3.7.8 7.6-2.1 8.9-6-3.3-1.6-7-.4-8.9 2.3"/>',
    calendario: '<rect x="3.6" y="5" width="16.8" height="15.4" rx="2.2"/>' +
           '<path d="M3.6 9.8h16.8"/><path d="M8.2 2.8v4M15.8 2.8v4"/>' +
           '<path d="M7.8 13.4h.01M12 13.4h.01M16.2 13.4h.01M7.8 16.8h.01M12 16.8h.01"/>',
    reloj: '<circle cx="12" cy="12" r="8.8"/><path d="M12 6.6V12l3.8 2.3"/>',
    tijera: '<circle cx="6.2" cy="6.2" r="2.8"/><circle cx="6.2" cy="17.8" r="2.8"/>' +
           '<path d="M20.4 4 8.7 15.7M14.4 14.4l6 5.6M8.7 8.3l2.9 2.9"/>',
    claqueta: '<rect x="2.6" y="8.8" width="18.8" height="11.6" rx="2"/>' +
           '<path d="M2.6 8.8 4.4 3.6l17 1.8-1.4 3.4"/>' +
           '<path d="m7.6 4 -1.5 4.6M12.4 4.5l-1.5 4.3M17.2 5l-1.5 3.8"/>',
    corazon: '<path d="M20.4 5.8a5.1 5.1 0 0 0-7.3 0L12 6.9l-1.1-1.1a5.1 5.1 0 1 0-7.3 7.3l1.1 1.1L12 21.2l7.3-7l1.1-1.1a5.1 5.1 0 0 0 0-7.3Z"/>' +
           '<path d="M3.9 12.4h3.3l1.5-2.8 2.4 5.2 1.7-3.2h3.2"/>',
    barras: '<path d="M4.2 20.4h15.6"/>' +
           '<path d="M6.9 18V13.4M11.4 18V9.8M15.9 18v-6"/>' +
           '<path d="m6.3 10.6 4.8-4.4 3 2.3 5.4-4.6"/><path d="M15.7 3.6h3.8v3.8"/>',
    play: '<circle cx="12" cy="12" r="9.1"/><path d="m9.7 7.6 6.6 4.4-6.6 4.4V7.6Z"/>'
  };
  /*  nombre del acceso -> dibujo. Las tres lenguas en la misma linea.  */
  var MAPA = [
    [/plan de desarrollo|development plan|entwicklungsplan/, 'diana'],
    [/heat ?map/, 'pin'],
    [/dashboard|panel del entrenador/, 'monitor'],
    [/informe|report|bericht/, 'documento'],
    [/an[aá]lisis detallado|detailed analysis|analisis$|analysis$|analyse$/, 'lupa'],
    [/liga|league|statistik/, 'trofeo'],
    [/baggerone|ranking/, 'trofeo'],
    [/equipo|mannschaft|^team/, 'personas'],
    [/preparaci[oó]n f[ií]sica|physical prep|athletiktraining/, 'mancuerna'],
    [/wellness|bienestar|wohlbefinden/, 'loto'],
    [/calendario|calendar|kalender/, 'calendario'],
    [/horario|schedule|stundenplan/, 'reloj'],
    [/corte|clip/, 'tijera'],
    [/s[ií]ntesis|synthesis|zusammenfassung/, 'claqueta'],
    [/high set/, 'diana']
  ];
  /*  y el icono de cada panel  */
  var MAPA_PAN = [
    [/rendimiento|performance|leistung/, 'barras'],
    [/f[ií]sico|physis|fitness/, 'corazon'],
    [/agenda|kalender/, 'calendario'],
    [/video/, 'play']
  ];
  function pintarIcono(caja, nombre) {
    if (!caja) return;
    var sv = caja.querySelector('svg'); if (!sv) return;
    if (sv.getAttribute('data-vs-ico') === nombre) return;
    sv.setAttribute('data-vs-ico', nombre);
    sv.setAttribute('fill', 'none');
    sv.setAttribute('stroke', 'currentColor');
    sv.setAttribute('stroke-linecap', 'round');
    sv.setAttribute('stroke-linejoin', 'round');
    sv.innerHTML = DIB[nombre];
  }
  function buscar(lista, txt) {
    var t = sinTildes(txt);
    for (var i = 0; i < lista.length; i++) if (lista[i][0].test(t)) return lista[i][1];
    return null;
  }
  function iconos(zona) {
    if (!zona) return;
    [].forEach.call(zona.querySelectorAll('#ix-rowSec a.card, #ix-rowDT a.card'), function (c) {
      var t = c.querySelector('.card-title');
      var n = buscar(MAPA, t ? t.textContent : c.textContent);
      if (n) pintarIcono(c.querySelector('.card-icon'), n);
    });
    [].forEach.call(zona.querySelectorAll('.nv-ph'), function (ph) {
      var t = ph.querySelector('.nv-pt'); if (!t) return;
      var n = buscar(MAPA_PAN, t.textContent);
      if (n) pintarIcono(ph.querySelector('.nv-pic'), n);
    });
  }

  function bajadas(zona) {
    if (!zona) return;
    [].forEach.call(zona.querySelectorAll('.nv-ph'), function (ph) {
      var t = ph.querySelector('.nv-pt');
      if (!t) return;
      var frase = BAJADAS[sinTildes(t.textContent)];
      if (!frase) return;
      if (ph.querySelector('.ix-sub')) return;
      /*  el titulo y la bajada van juntos en una columna, a la derecha del
          icono: por eso se envuelven en vez de colgar la bajada del .nv-ph */
      var caja = document.createElement('span');
      caja.className = 'ix-ptxt';
      t.parentNode.insertBefore(caja, t);
      caja.appendChild(t);
      var sub = document.createElement('span');
      sub.className = 'ix-sub';
      sub.textContent = T(frase);
      caja.appendChild(sub);
    });
  }

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

    /*[ix-bajadas]*/
    /*  LA BAJADA DE CADA PANEL
        En la maqueta, debajo del titulo de cada panel va una linea corta en
        cian. Se busca por el TITULO que ya tiene el panel, no por posicion:
        si manana se agrega o se saca un panel, cada uno sigue encontrando
        la suya y el que no tenga, no muestra ninguna.                      */
    bajadas(zona);
    soloDT(zona);
    iconos(zona);
    altas(zona);

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
        '<span class="t"><b>' + T('Fixture') + '</b> · NLA ' + T('Suiza') + ' 2026/27</span>' +
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

  /*  El nombre del archivo no siempre es igual al slug del fixture:
      el calendario dice "schonenwerd" y el escudo se llama
      "schoenenwerd.png". Esta tabla empareja los que no coinciden.     */
  var ESC_ALIAS = { schonenwerd: 'schoenenwerd', schoenenwerd: 'schoenenwerd' };
  function escudo(slug) {
    /*  el escudo propio ya vive en la app: escudo.png  */
    if (slug === 'nafels') return '<img src="escudo.png" alt="">';
    slug = ESC_ALIAS[String(slug || '').toLowerCase()] || slug;
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
          '<span class="e' + (loc ? ' pro' : '') + '">' + escudo(loc ? 'nafels' : q.slug) + '</span>' +
          '<span class="nn">' +
            '<span class="n">' + esc(loc ? 'Näfels' : q.rival) + '</span>' +
            '<span class="vs">vs</span>' +
            '<span class="n">' + esc(loc ? q.rival : 'Näfels') + '</span>' +
          '</span>' +
          '<span class="e' + (loc ? '' : ' pro') + '">' + escudo(loc ? q.slug : 'nafels') + '</span>' +
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
        '<div class="ix-cdf">' + CHINCHE + '<span>' + T(loc ? 'Local' : 'Visitante') + '</span></div>' +
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
