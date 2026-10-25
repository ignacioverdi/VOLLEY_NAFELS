// ───────────────────────────────────────────────────────────────────────────
//  volver_panel.js — LA FLECHA PARA VOLVER, EN TODAS LAS VENTANAS DEL PANEL
//
//  Panel Voley abre nueve ventanas distintas —analisis, tabla, podio,
//  objetivos, baterias, plan, video, la ficha de un jugador— y cada una
//  traia su propio boton de cerrar, en un lugar distinto y, en las largas,
//  arriba de todo: si estabas al final de la tabla tenias que subir hasta
//  arriba para salir. La ficha del jugador directamente no tenia ninguno.
//
//  Esto pone UNA flecha, siempre en el mismo lugar, siempre a la vista,
//  en la ventana que este abierta. Al tocarla se cierra esa ventana —con
//  su propia funcion, para que su estado quede como ella espera— y volves
//  al panel. Lo mismo con la tecla Escape y con el boton de atras del
//  telefono, que antes te sacaba de la app entera.
//
//  Y de paso: mientras una ventana esta abierta se vuelve a dibujar con
//  cada dato que llega, igual que el panel. Antes se dibujaban una sola
//  vez, al abrirlas, y se quedaban congeladas mientras Sebastian seguia
//  scouteando.
//
//  Lo que NO hace: no saca ni mueve ningun boton de los que ya estaban.
//  Los "Cerrar" de cada ventana siguen funcionando igual.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  /* Cada ventana con su funcion de cierre —la que ya existe— y el pintor
     que la rehace cuando llegan datos nuevos. 'empuja' es para las que
     tienen su contenido pegado arriba: se les baja el techo para que la
     flecha no les tape el titulo. Las que son un modal con marco propio
     (plan, video) no lo necesitan. */
  var VENTANAS = [
    { id:'an-overlay', cerrar:'cerrarAnalisis', pintar:'renderAnalisis', empuja:true  },
    { id:'tabla',      cerrar:'toggleTabla',    pintar:'renderTabla',    empuja:true  },
    { id:'podio',      cerrar:'togglePodio',    pintar:'renderPodio',    empuja:true  },
    { id:'obj',        cerrar:'toggleObj',      pintar:'updateObj',      empuja:true  },
    { id:'bat',        cerrar:'toggleBat',      pintar:'cargarBatJugV',  empuja:true  },
    { id:'jug-det',    cerrar:'closeJugDetail', pintar:null,             empuja:true  },
    { id:'m-baterias', cerrar:'cerrarBaterias', pintar:null,             empuja:false },
    { id:'m-plan',     cerrar:'cerrarPlan',     pintar:null,             empuja:false },
    { id:'m-video',    cerrar:'cerrarVideo',    pintar:null,             empuja:false }
  ];

  var TXT = { es:'Volver', en:'Back', de:'Zurück' };
  function idioma() {
    try { return (typeof getLang === 'function') ? getLang() : 'es'; }
    catch (e) { return 'es'; }
  }
  function texto() { return TXT[idioma()] || TXT.es; }

  function visible(el) {
    if (!el) return false;
    try { return el.getClientRects().length > 0; } catch (e) { return false; }
  }

  /* La ventana de arriba de la pila. Como no hay registro de en que orden
     se abrieron, manda el z-index; a igualdad, la ultima de la lista. */
  function abierta() {
    var arriba = null, z = -1;
    for (var i = 0; i < VENTANAS.length; i++) {
      var el = document.getElementById(VENTANAS[i].id);
      if (!visible(el)) continue;
      var zz = 0;
      try { zz = parseInt(getComputedStyle(el).zIndex, 10) || 0; } catch (e) {}
      if (zz >= z) { z = zz; arriba = { v:VENTANAS[i], el:el }; }
    }
    return arriba;
  }

  function estilo() {
    if (document.getElementById('vp-css')) return;
    var s = document.createElement('style');
    s.id = 'vp-css';
    s.textContent = [
      /* por encima de todo: las ventanas mas altas estan en 9999 */
      '#vp-atras{position:fixed;top:12px;left:12px;z-index:10050;display:none;',
      '  align-items:center;gap:7px;padding:8px 14px 8px 11px;border-radius:999px;',
      '  border:1px solid rgba(255,255,255,.14);background:rgba(16,17,28,.92);',
      '  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);',
      '  color:#e8e8f0;font-family:inherit;font-size:12px;font-weight:700;',
      '  letter-spacing:.4px;cursor:pointer;line-height:1;',
      '  box-shadow:0 4px 16px rgba(0,0,0,.45)}',
      '#vp-atras.on{display:flex}',
      '#vp-atras:hover{background:rgba(96,165,250,.18);border-color:rgba(96,165,250,.45);color:#60a5fa}',
      '#vp-atras b{font-size:15px;font-weight:800;line-height:1;margin-top:-1px}',
      /* el techo que se le baja a la ventana abierta para no taparle nada */
      '.vp-techo{padding-top:62px!important}',
      '@media(max-width:700px){#vp-atras{top:8px;left:8px;padding:7px 12px 7px 9px;font-size:11px}',
      '  .vp-techo{padding-top:54px!important}}'
    ].join('');
    document.head.appendChild(s);
  }

  function boton() {
    var b = document.getElementById('vp-atras');
    if (b) return b;
    b = document.createElement('button');
    b.id = 'vp-atras';
    b.type = 'button';
    b.setAttribute('data-notr', '');
    b.innerHTML = '<b>&#8592;</b><span></span>';
    b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); window.vpVolver(); };
    (document.body || document.documentElement).appendChild(b);
    return b;
  }

  /* ══ ATRAS DEL TELEFONO ═══════════════════════════════════════════════
     Instalada como app no hay boton de atras del navegador, y el del
     telefono cerraba la app entera en vez de cerrar la ventana. Se mete
     una parada en el historial cuando se abre una ventana y se saca
     cuando se cierra, asi "atras" cierra la ventana y nada mas. */
  var enPila = false, saltando = false;

  function ponerParada() {
    if (enPila) return;
    try { history.pushState({ vpVentana:1 }, ''); enPila = true; } catch (e) {}
  }
  function sacarParada() {
    if (!enPila) return;
    enPila = false; saltando = true;
    try { history.back(); } catch (e) { saltando = false; }
  }

  window.addEventListener('popstate', function () {
    if (saltando) { saltando = false; return; }
    enPila = false;
    var a = abierta();
    if (a) cerrarVentana(a);
  });

  function cerrarVentana(a) {
    var f = window[a.v.cerrar];
    if (typeof f === 'function') { try { f(); } catch (e) {} }
    /* red de seguridad: si su funcion no la cerro, se cierra a mano */
    if (visible(a.el)) {
      try { a.el.classList.remove('open'); a.el.style.display = 'none'; } catch (e) {}
    }
    try { a.el.classList.remove('vp-techo'); } catch (e) {}
  }

  window.vpVolver = function () {
    var a = abierta();
    if (!a) return;
    if (enPila) { sacarParada(); }   /* el popstate la cierra */
    cerrarVentana(a);
    repasar();
  };

  /* ══ EL REPASO ════════════════════════════════════════════════════════
     Las ventanas se abren desde funciones distintas y ninguna avisa. En
     vez de tocar las nueve, se mira el estado cada poco: es una lectura
     de getClientRects, no cuesta nada. */
  var ultima = null;
  function repasar() {
    var a = abierta();
    var b = boton();
    var id = a ? a.v.id : null;

    if (id !== ultima) {
      /* se le saca el techo a la que dejo de estar arriba */
      VENTANAS.forEach(function (v) {
        if (v.id === id) return;
        var el = document.getElementById(v.id);
        if (el) el.classList.remove('vp-techo');
      });
      ultima = id;
    }

    if (a) {
      if (a.v.empuja) a.el.classList.add('vp-techo');
      b.classList.add('on');
      var sp = b.lastChild; if (sp && sp.textContent !== texto()) sp.textContent = texto();
      ponerParada();
    } else {
      b.classList.remove('on');
      if (enPila) sacarParada();
    }
  }

  /* ══ QUE SE ACTUALICEN SOLAS ══════════════════════════════════════════
     render() es lo que el panel llama con cada dato nuevo. Se le cuelga
     el repintado de la ventana que este abierta, que es exactamente lo
     que ya hacia el panel al cargar datos nuevos por script, pero solo
     ahi. */
  function engancharRender() {
    if (window._vpRender) return;
    var _r = window.render;
    if (typeof _r !== 'function') return;
    window._vpRender = true;
    window.render = function () {
      var x;
      try { x = _r.apply(this, arguments); }
      catch (e) { repintar(); throw e; }
      repintar();
      return x;
    };
  }
  function repintar() {
    VENTANAS.forEach(function (v) {
      if (!v.pintar) return;
      var el = document.getElementById(v.id);
      if (!visible(el)) return;
      var f = window[v.pintar];
      if (typeof f === 'function') { try { f(); } catch (e) {} }
    });
  }

  function arrancar() {
    try { estilo(); boton(); } catch (e) {}
    try { engancharRender(); } catch (e) {}
    /* por si render() todavia no existia cuando cargo este archivo */
    var intentos = 0;
    var t = setInterval(function () {
      try { engancharRender(); } catch (e) {}
      if (window._vpRender || ++intentos > 40) clearInterval(t);
    }, 250);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' && e.keyCode !== 27) return;
      if (!abierta()) return;
      e.preventDefault();
      window.vpVolver();
    });

    setInterval(function () { try { repasar(); } catch (e) {} }, 250);
    try { repasar(); } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
