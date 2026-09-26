/* ══════════════════════════════════════════════════════════════════════
   demo_tope.js — los límites de la versión DEMO
   ----------------------------------------------------------------------
   Este archivo SOLO existe en la copia demo. La app del club no lo lleva,
   así que no puede romper nada de lo que usa Näfels.

   Lo que hace, y por qué:

     1) TOPE DE 100 CÓDIGOS. Se puede escautear un set entero y ver cómo
        funciona todo. Al llegar a 100 aparece un cartel que invita a
        hablar, en vez de un "no se puede" seco.

     2) NADA SALE. Se bloquea cualquier descarga: el .dvw, el .sq, el CSV
        para el editor, el respaldo de emergencia, y la impresión. Se
        puede probar la herramienta; no se puede usar como herramienta.
        Es un solo enganche: toda descarga del sistema termina en un
        <a download="..."> al que le hacen click. Se intercepta ahí, así
        no hay que tocar ni una línea de las páginas y ningún camino
        nuevo se escapa.

     3) CINCO DÍAS. La primera vez que se abre en esa computadora se
        anota la fecha. A los 5 días la demo deja de andar.

     4) MARCA DE AGUA fija, para que no sirva para presentarlo en otro
        club como propio.

   HONESTIDAD: esto corre en el navegador. Alguien que sepa lo saltea
   abriendo las herramientas de desarrollador. No es una caja fuerte:
   es lo que evita que la demo se use de herramienta gratis por alguien
   que no se va a poner a leer JavaScript.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var TOPE  = 100;      /* códigos permitidos */
  var DIAS  = 5;        /* desde la primera apertura EN ESA COMPUTADORA */
  var LLAVE = 'vs_demo_inicio';
  var CONTACTO = 'ignacio.verdi@gmail.com';

  /* ── idioma: la demo también se muestra en alemán e inglés ──────── */
  var TXT = {
    es: { titulo:'Hasta acá llega la demo',
          tope:'La versión de prueba deja escautear 100 códigos: un set entero, con todos los análisis funcionando.',
          vencida:'Esta prueba ya cumplió sus '+DIAS+' días.',
          seguir:'¿Lo seguimos con tu equipo? Escribime y lo armamos.',
          bajar:'En la demo no se pueden bajar archivos',
          imprimir:'En la demo no se puede imprimir',
          marca:'DEMO' },
    en: { titulo:'This is as far as the demo goes',
          tope:'The trial lets you scout 100 codes: a full set, with every analysis working.',
          vencida:'This trial has reached its '+DIAS+' days.',
          seguir:'Want to keep going with your team? Get in touch.',
          bajar:'Downloads are disabled in the demo',
          imprimir:'Printing is disabled in the demo',
          marca:'DEMO' },
    de: { titulo:'Bis hierhin reicht die Demo',
          tope:'Die Testversion erlaubt 100 Codes: ein ganzer Satz, mit allen Analysen.',
          vencida:'Diese Testversion hat ihre '+DIAS+' Tage erreicht.',
          seguir:'Weitermachen mit deinem Team? Melde dich.',
          bajar:'In der Demo sind Downloads deaktiviert',
          imprimir:'In der Demo ist Drucken deaktiviert',
          marca:'DEMO' }
  };
  function L() {
    var l = 'es';
    try { if (typeof getLang === 'function') l = getLang(); } catch (e) {}
    return TXT[l] || TXT.es;
  }

  /* ── 3) los cinco días ──────────────────────────────────────────────
     La fecha de vencimiento la pone el SERVIDOR cuando el visitante entra
     con su código (demo_acceso.js la deja en window.__DEMO_FIN, sacada de
     un pase firmado). Por eso borrar los datos del navegador ya no reinicia
     nada: el reloj corre contra el mail, no contra la computadora.

     Si por lo que sea no hay pase —una demo armada sin la puerta, o una
     prueba local— se cae al reloj viejo del navegador, que es mejor que
     ningún límite. */
  function finServidor() {
    try { if (window.__DEMO_FIN && Number(window.__DEMO_FIN) > 0) return Number(window.__DEMO_FIN); }
    catch (e) {}
    return 0;
  }
  function inicioLocal() {
    var v = null;
    try { v = localStorage.getItem(LLAVE); } catch (e) {}
    if (!v) {
      v = String(Date.now());
      try { localStorage.setItem(LLAVE, v); } catch (e) {}
    }
    return parseInt(v, 10) || Date.now();
  }
  function fin() {
    var f = finServidor();
    return f || (inicioLocal() + DIAS * 86400000);
  }
  function vencida()    { return Date.now() >= fin(); }
  function diasQuedan() { return Math.max(0, Math.ceil((fin() - Date.now()) / 86400000)); }

  /* ── el cartel ──────────────────────────────────────────────────── */
  /* Los z-index van arriba de 2147483000, que es el que usa la pantalla
     de ingreso de la app: si empatan, el cartel queda tapado. */
  var puesto = false;
  function pared(motivo) {
    if (puesto) return;
    puesto = true;
    var t = L();
    var d = document.createElement('div');
    d.id = 'demo-pared';
    d.setAttribute('data-notr', '');
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483630;background:rgba(6,8,16,.93);' +
      'backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px';
    d.innerHTML =
      '<div style="max-width:440px;width:100%;background:#0d0e1a;border:1px solid rgba(255,255,255,.1);' +
        'border-radius:18px;padding:30px 28px;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.7);' +
        'font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#e2e8f0">' +
        '<div style="font-size:11px;letter-spacing:4px;color:#e8192c;font-weight:800;margin-bottom:14px">VOLLEY-STATS</div>' +
        '<div style="font-size:24px;font-weight:700;line-height:1.25;margin-bottom:12px">' + t.titulo + '</div>' +
        '<div style="font-size:15px;line-height:1.55;color:#94a3b8;margin-bottom:8px">' + motivo + '</div>' +
        '<div style="font-size:15px;line-height:1.55;color:#cbd5e1;margin-bottom:22px">' + t.seguir + '</div>' +
        '<a href="mailto:' + CONTACTO + '?subject=Volley-Stats" ' +
          'style="display:inline-block;padding:13px 26px;border-radius:11px;background:#e8192c;color:#fff;' +
          'text-decoration:none;font-weight:700;font-size:15px;letter-spacing:.3px">' + CONTACTO + '</a>' +
      '</div>';
    /* se come el teclado y el mouse: no se sigue escauteando por atrás */
    ['keydown', 'keypress', 'keyup', 'click', 'mousedown', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        if (!document.getElementById('demo-pared')) return;
        if (d.contains(e.target)) return;      /* el botón de contacto sí */
        e.stopPropagation(); e.preventDefault();
      }, true);
    });
    (document.body || document.documentElement).appendChild(d);
  }

  /* ── 2) que no salga nada ───────────────────────────────────────── */
  function aviso(msg) {
    try { if (typeof toast === 'function') { toast(msg, true); return; } } catch (e) {}
    var n = document.createElement('div');
    n.setAttribute('data-notr', '');
    n.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:2147483640;' +
      'background:#e8192c;color:#fff;padding:11px 20px;border-radius:10px;font-weight:700;font-size:14px;' +
      'font-family:system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5)';
    n.textContent = msg;
    (document.body || document.documentElement).appendChild(n);
    setTimeout(function () { try { n.remove(); } catch (e) {} }, 3200);
  }

  function cerrarSalidas() {
    /* TODA descarga del sistema pasa por un <a download="..."> al que se
       le hace click. Un solo enganche los tapa a todos, incluso los que
       se agreguen mañana. Los <input type=file> (importar) no llevan
       'download', asi que siguen andando: entrar no es el problema. */
    try {
      var orig = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (this.hasAttribute && this.hasAttribute('download')) { aviso(L().bajar); return; }
        return orig.apply(this, arguments);
      };
    } catch (e) {}
    /* y el que baja sin click, con el atributo puesto a mano */
    try {
      var origSet = HTMLAnchorElement.prototype.setAttribute;
      HTMLAnchorElement.prototype.setAttribute = function (n, v) {
        return origSet.call(this, n, v);
      };
    } catch (e) {}
    try { window.print = function () { aviso(L().imprimir); }; } catch (e) {}
    /* el atajo Ctrl+P / Cmd+P */
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault(); e.stopPropagation(); aviso(L().imprimir);
      }
    }, true);
  }

  /* ── 4) la marca de agua ────────────────────────────────────────── */
  function marca() {
    if (document.getElementById('demo-marca')) return;
    var m = document.createElement('div');
    m.id = 'demo-marca';
    m.setAttribute('data-notr', '');
    m.style.cssText = 'position:fixed;right:12px;bottom:10px;z-index:2147483620;pointer-events:none;' +
      'font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:10px;font-weight:800;' +
      'letter-spacing:3px;color:rgba(232,25,44,.5);border:1px solid rgba(232,25,44,.28);' +
      'border-radius:6px;padding:3px 9px;background:rgba(6,8,16,.55)';
    m.textContent = L().marca + ' · ' + diasQuedan() + 'd';
    (document.body || document.documentElement).appendChild(m);
  }

  /* ── 1) el tope de códigos ──────────────────────────────────────── */
  function cuantosCodigos() {
    /* M se declara con let arriba de todo en panel_vivo.html: vive en el
       ambito global pero NO cuelga de window, por eso se lee pelado. */
    try { if (typeof M !== 'undefined' && M && M.codes) return M.codes.length; } catch (e) {}
    try { if (window.M && window.M.codes) return window.M.codes.length; } catch (e) {}
    return -1;   /* esta pantalla no escautea */
  }

  function vigilar() {
    setInterval(function () {
      if (vencida()) { pared(L().vencida); return; }
      var n = cuantosCodigos();
      if (n >= 0 && n >= TOPE) pared(L().tope);
      var m = document.getElementById('demo-marca');
      if (m) m.textContent = L().marca + ' · ' + diasQuedan() + 'd';
    }, 500);
  }

  function arrancar() {
    cerrarSalidas();
    marca();
    /* Se espera un momento a que demo_acceso.js confirme el pase con el
       servidor. Sin esta espera, el primer segundo se juzga con el reloj
       del navegador y podría aparecer el cartel de vencida sin motivo. */
    setTimeout(function () {
      if (vencida()) { pared(L().vencida); return; }
      vigilar();
    }, 1200);
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
