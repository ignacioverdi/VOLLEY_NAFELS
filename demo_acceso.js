/* ════════════════════════════════════════════════════════════════════════════
   demo_acceso.js — la puerta de la demo: mail, código, y adentro
   ----------------------------------------------------------------------------
   Solo existe en la copia demo. La app del club no lo lleva.

   Cómo funciona:
     · si hay un pase guardado y el servidor lo da por bueno, no se ve nada
     · si no, tapa la pantalla y pide mail y club; el código llega por correo
     · el pase lo firma el servidor: acá no se puede fabricar ni estirar

   Por qué se pide el código al servidor y no se resuelve en el navegador:
   cualquier cosa que decida el navegador se puede cambiar desde las
   herramientas de desarrollador. La cuenta de los 5 días vive del lado del
   servidor, así que borrar los datos del navegador ya no reinicia nada.

   Si no hay internet, la puerta deja pasar. Es a propósito: es peor perder a
   un entrenador interesado por una conexión mala que dejar entrar a alguien
   sin registrar.
   ════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LLAVE = 'vs_demo_pase';
  var API   = '/api/';

  var TXT = {
    es: { t1:'Probá Volley-Stats', p1:'Dejanos tu mail y te llega un código para entrar. La prueba dura 5 días.',
          mail:'Tu mail', club:'Tu club (opcional)', pedir:'Mandame el código',
          t2:'Revisá tu correo', p2:'Te mandamos un código de 6 números a',
          cod:'Código', entrar:'Entrar', otro:'Usar otro mail', reenviar:'Mandarlo de nuevo',
          yendo:'Mandando…', malMail:'Ese mail no parece correcto',
          malCod:'El código no coincide', vencida:'Esta prueba ya cumplió sus 5 días',
          muchos:'Demasiados pedidos desde acá. Probá más tarde.',
          ups:'No se pudo. Probá de nuevo en un momento.',
          spam:'Si no llega en un minuto, mirá en correo no deseado.',
          yaTenia:'Ya tenías una prueba empezada: te mandamos el mismo código.',
          ok1:'Acepto que guarden mi mail para mandarme el código y para escribirme sobre Volley-Stats.',
          ok2:'Cómo tratamos tus datos', faltaOk:'Te falta tildar la casilla' },
    en: { t1:'Try Volley-Stats', p1:'Leave your email and we send you a code. The trial lasts 5 days.',
          mail:'Your email', club:'Your club (optional)', pedir:'Send me the code',
          t2:'Check your inbox', p2:'We sent a 6-digit code to',
          cod:'Code', entrar:'Enter', otro:'Use another email', reenviar:'Send it again',
          yendo:'Sending…', malMail:'That email does not look right',
          malCod:'The code does not match', vencida:'This trial has reached its 5 days',
          muchos:'Too many requests from here. Try later.',
          ups:'It did not work. Try again in a moment.',
          spam:'If it does not arrive within a minute, check your spam folder.',
          yaTenia:'You already had a trial running: we sent the same code.',
          ok1:'I agree to my email being stored to send me the code and to write to me about Volley-Stats.',
          ok2:'How we handle your data', faltaOk:'Please tick the box' },
    de: { t1:'Volley-Stats testen', p1:'Hinterlasse deine E-Mail, du bekommst einen Code. Der Test dauert 5 Tage.',
          mail:'Deine E-Mail', club:'Dein Verein (optional)', pedir:'Code schicken',
          t2:'Schau in dein Postfach', p2:'Wir haben einen 6-stelligen Code geschickt an',
          cod:'Code', entrar:'Eintreten', otro:'Andere E-Mail', reenviar:'Nochmal schicken',
          yendo:'Wird gesendet…', malMail:'Diese E-Mail sieht nicht richtig aus',
          malCod:'Der Code stimmt nicht', vencida:'Dieser Test hat seine 5 Tage erreicht',
          muchos:'Zu viele Anfragen von hier. Versuche es später.',
          ups:'Hat nicht geklappt. Versuche es gleich nochmal.',
          spam:'Wenn nichts ankommt, schau im Spam-Ordner.',
          yaTenia:'Du hattest schon einen Test: wir haben denselben Code geschickt.',
          ok1:'Ich bin einverstanden, dass meine E-Mail gespeichert wird, um mir den Code zu schicken und mir über Volley-Stats zu schreiben.',
          ok2:'Wie wir deine Daten behandeln', faltaOk:'Bitte das Häkchen setzen' }
  };
  function L() {
    var l = 'es';
    try { if (typeof getLang === 'function') l = getLang(); } catch (e) {}
    try { if (l === 'es' && localStorage.getItem('vb_lang')) l = localStorage.getItem('vb_lang'); } catch (e) {}
    return TXT[l] || TXT.es;
  }

  function guardado() { try { return localStorage.getItem(LLAVE); } catch (e) { return null; } }
  function guardar(p) { try { localStorage.setItem(LLAVE, p); } catch (e) {} }
  function borrar()   { try { localStorage.removeItem(LLAVE); } catch (e) {} }

  async function pedirJSON(ruta, cuerpo) {
    var r = await fetch(API + ruta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    });
    var j = null;
    try { j = await r.json(); } catch (e) {}
    return { estado: r.status, datos: j || {} };
  }

  /* ── la pantalla ───────────────────────────────────────────────────────── */
  var caja, paso = 1, mailPuesto = '', yendo = false;

  function css(el, s) { el.style.cssText = s; }

  function pintar() {
    var t = L();
    caja.innerHTML = '';
    var w = document.createElement('div');
    css(w, 'max-width:400px;width:100%;background:#0d0e1a;border:1px solid rgba(255,255,255,.1);' +
           'border-radius:18px;padding:30px 28px;box-shadow:0 32px 80px rgba(0,0,0,.7);' +
           'font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#e2e8f0');

    var marca = document.createElement('div');
    css(marca, 'font-size:11px;letter-spacing:4px;color:#e8192c;font-weight:800;margin-bottom:16px');
    marca.textContent = 'VOLLEY-STATS';
    w.appendChild(marca);

    var h = document.createElement('div');
    css(h, 'font-size:23px;font-weight:700;line-height:1.25;margin-bottom:8px');
    h.textContent = paso === 1 ? t.t1 : t.t2;
    w.appendChild(h);

    var p = document.createElement('div');
    css(p, 'font-size:14px;line-height:1.55;color:#94a3b8;margin-bottom:20px');
    p.textContent = paso === 1 ? t.p1 : (t.p2 + ' ' + mailPuesto + '. ' + t.spam);
    w.appendChild(p);

    function campo(etq, tipo, id, modo) {
      var l = document.createElement('div');
      css(l, 'font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#475569;margin-bottom:5px');
      l.textContent = etq;
      var i = document.createElement('input');
      i.type = tipo; i.id = id; if (modo) i.inputMode = modo;
      i.autocomplete = (tipo === 'email' ? 'email' : 'off');
      css(i, 'width:100%;box-sizing:border-box;background:rgba(255,255,255,.05);' +
             'border:1px solid rgba(255,255,255,.14);border-radius:10px;color:#e2e8f0;' +
             'font-size:16px;padding:12px 14px;outline:none;margin-bottom:14px');
      i.addEventListener('focus', function () { this.style.borderColor = '#e8192c'; });
      i.addEventListener('blur',  function () { this.style.borderColor = 'rgba(255,255,255,.14)'; });
      w.appendChild(l); w.appendChild(i);
      return i;
    }

    var err = document.createElement('div');
    css(err, 'font-size:13px;color:#f87171;min-height:18px;margin-bottom:10px');
    var aviso = document.createElement('div');
    css(aviso, 'font-size:13px;color:#22c55e;min-height:0;margin-bottom:10px');

    var btn = document.createElement('button');
    css(btn, 'width:100%;padding:14px;border:none;border-radius:11px;background:#e8192c;color:#fff;' +
             'font-weight:700;font-size:16px;cursor:pointer;letter-spacing:.3px');

    function trabar(v) {
      yendo = v; btn.disabled = v; btn.style.opacity = v ? '.6' : '1';
      btn.textContent = v ? t.yendo : (paso === 1 ? t.pedir : t.entrar);
    }

    if (paso === 1) {
      var iMail = campo(t.mail, 'email', 'dm-mail');
      var iClub = campo(t.club, 'text', 'dm-club');

      /* ── La casilla de consentimiento ──────────────────────────────────
         No es decorado: sin esto no se puede guardar el mail de alguien en
         Europa. Arranca DESTILDADA a proposito —una casilla ya tildada no
         vale como consentimiento— y el boton no hace nada hasta que la
         tilden. */
      var okWrap = document.createElement('label');
      css(okWrap, 'display:flex;gap:10px;align-items:flex-start;cursor:pointer;margin:2px 0 16px');
      var okBox = document.createElement('input');
      okBox.type = 'checkbox'; okBox.id = 'dm-ok';
      css(okBox, 'width:17px;height:17px;flex-shrink:0;margin-top:1px;accent-color:#e8192c;cursor:pointer');
      var okTxt = document.createElement('span');
      css(okTxt, 'font-size:12.5px;line-height:1.5;color:#94a3b8');
      okTxt.textContent = t.ok1 + ' ';
      var okLink = document.createElement('a');
      okLink.href = 'https://volley-stats.com/legales.html#privacidad';
      okLink.target = '_blank'; okLink.rel = 'noopener';
      css(okLink, 'color:#e8192c;text-decoration:underline');
      okLink.textContent = t.ok2;
      okLink.addEventListener('click', function (e) { e.stopPropagation(); });
      okTxt.appendChild(okLink);
      okWrap.appendChild(okBox); okWrap.appendChild(okTxt);
      w.appendChild(okWrap);

      w.appendChild(err); w.appendChild(aviso); w.appendChild(btn);
      btn.textContent = t.pedir;
      var mandar = async function () {
        if (yendo) return;
        err.textContent = ''; aviso.textContent = '';
        var m = iMail.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m)) { err.textContent = t.malMail; iMail.focus(); return; }
        if (!okBox.checked) { err.textContent = t.faltaOk; okBox.focus(); return; }
        trabar(true);
        var r;
        try { r = await pedirJSON('demo-pedir', { mail: m, club: iClub.value }); }
        catch (e) { trabar(false); err.textContent = t.ups; return; }
        trabar(false);
        if (r.estado === 429) { err.textContent = t.muchos; return; }
        if (r.estado === 403) { err.textContent = t.vencida; return; }
        if (!r.datos.ok)      { err.textContent = t.ups; return; }
        mailPuesto = m; paso = 2; pintar();
        if (r.datos.yaTenia) {
          var a = caja.querySelector('#dm-aviso'); if (a) a.textContent = L().yaTenia;
        }
        /* modo prueba: sin correo configurado, el código viene en la respuesta */
        if (r.datos.prueba && r.datos.codigo) {
          var c = caja.querySelector('#dm-cod'); if (c) c.value = r.datos.codigo;
          var a2 = caja.querySelector('#dm-aviso');
          if (a2) a2.textContent = 'MODO PRUEBA · código ' + r.datos.codigo;
        }
      };
      btn.addEventListener('click', mandar);
      [iMail, iClub].forEach(function (i) {
        i.addEventListener('keydown', function (e) { if (e.key === 'Enter') mandar(); });
      });
      setTimeout(function () { iMail.focus(); }, 60);

    } else {
      var iCod = campo(t.cod, 'text', 'dm-cod', 'numeric');
      iCod.maxLength = 6;
      css(iCod, iCod.style.cssText + ';letter-spacing:10px;text-align:center;font-size:24px;font-weight:700');
      aviso.id = 'dm-aviso';
      w.appendChild(err); w.appendChild(aviso); w.appendChild(btn);
      btn.textContent = t.entrar;
      var entrar = async function () {
        if (yendo) return;
        err.textContent = '';
        var c = iCod.value.replace(/\D/g, '');
        if (c.length < 4) { err.textContent = t.malCod; return; }
        trabar(true);
        var r;
        try { r = await pedirJSON('demo-validar', { mail: mailPuesto, codigo: c }); }
        catch (e) { trabar(false); err.textContent = t.ups; return; }
        trabar(false);
        if (r.estado === 403 && r.datos.error === 'vencida') { err.textContent = t.vencida; return; }
        if (!r.datos.ok || !r.datos.pase) { err.textContent = t.malCod; return; }
        guardar(r.datos.pase);
        try { window.__DEMO_FIN = r.datos.fin; } catch (e) {}
        cerrar();
      };
      btn.addEventListener('click', entrar);
      iCod.addEventListener('keydown', function (e) { if (e.key === 'Enter') entrar(); });
      setTimeout(function () { iCod.focus(); }, 60);

      var pie = document.createElement('div');
      css(pie, 'display:flex;gap:16px;justify-content:center;margin-top:16px');
      [[t.reenviar, function () { paso = 1; pintar(); }],
       [t.otro,     function () { paso = 1; mailPuesto = ''; pintar(); }]
      ].forEach(function (o) {
        var a = document.createElement('button');
        css(a, 'background:none;border:none;color:#64748b;font-size:13px;cursor:pointer;text-decoration:underline');
        a.textContent = o[0]; a.addEventListener('click', o[1]); pie.appendChild(a);
      });
      w.appendChild(pie);
    }

    caja.appendChild(w);
  }

  function abrir() {
    if (caja) return;
    caja = document.createElement('div');
    caja.id = 'demo-puerta';
    caja.setAttribute('data-notr', '');
    css(caja, 'position:fixed;inset:0;z-index:2147483645;background:rgba(6,8,16,.96);' +
              'display:flex;align-items:center;justify-content:center;padding:22px');
    /* nada de lo de atrás responde mientras la puerta está puesta */
    ['keydown','keypress','keyup','click','mousedown','touchstart'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        if (!document.getElementById('demo-puerta')) return;
        if (caja.contains(e.target)) return;
        e.stopPropagation(); e.preventDefault();
      }, true);
    });
    (document.body || document.documentElement).appendChild(caja);
    pintar();
  }

  function cerrar() {
    try { caja.remove(); } catch (e) {}
    caja = null;
  }

  async function arrancar() {
    var pase = guardado();
    if (pase) {
      try {
        var r = await pedirJSON('demo-validar', { pase: pase });
        if (r.datos && r.datos.ok) { window.__DEMO_FIN = r.datos.fin; return; }
        borrar();
      } catch (e) {
        /* sin internet: se deja pasar, a propósito (ver arriba) */
        return;
      }
    }
    abrir();
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
