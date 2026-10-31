/* ============================================================================
   wellness_equipo.js — BIENESTAR DEL EQUIPO
   ----------------------------------------------------------------------------
   QUE ES
   La pantalla del cuerpo tecnico: quien llega bien, quien viene cargado y a
   quien hay que mirar hoy. Reemplaza la tabla de la pestaña "Equipo" por el
   tablero de la maqueta, con los MISMOS datos que ya se guardaban.

   DE DONDE SALE CADA NUMERO — ninguno es inventado
   · Estado general .... el % de la encuesta del dia (el que ya calculaba
                         la pantalla: las seis respuestas contra el normal
                         de ese jugador, no contra el del equipo).
   · Carga ............. RPE x minutos, la formula de Foster. Ya estaba en
                         wellness_plus.js y no se mostraba en ningun lado.
   · Aguda:cronica ..... la semana que paso contra el promedio de las cuatro
                         ultimas. Es el indicador de riesgo de lesion mas
                         usado: debajo de 0,8 se pierde forma, arriba de 1,5
                         el riesgo sube.
   · Monotonia ......... que tan parecidos son los dias entre si.
   · Recuperacion ...... sueño, energia y piernas de los ultimos siete dias.
   · Sueño ............. las horas que cargo cada uno. Si nadie cargo horas,
                         el panel lo dice en vez de poner un numero.
   · Estres ............ la pregunta "cuanto te pesa lo de afuera".
   · Molestias ......... el mapa del cuerpo, con su tendencia.
   · Disponibilidad .... lo que puso el cuerpo tecnico en el parte del dia.
   · Clima ............. Open-Meteo para Näfels. Es la unica cosa que viene
                         de afuera; si no contesta, la tira se esconde sola.
   · Proximo partido ... el fixture real (proximo_rival.js).

   LO QUE NO ESTA, Y POR QUE
   La maqueta tenia un panel de HRV (variabilidad cardiaca). Eso necesita una
   pulsera o un reloj que lo mida y el plantel no usa ninguno, asi que no hay
   de donde sacarlo. En ese lugar va la curva del estado general de los
   ultimos siete dias, que si es un dato de verdad.
   ========================================================================== */
(function () {
  'use strict';
  if (window.WEQ) return;

  function T(s) { try { return (window.tr && window.tr(s)) || s; } catch (e) { return s; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ico(n) { return (window.VSP && VSP.ico) ? VSP.ico(n) : ''; }
  function hoyISO() { return new Date().toISOString().slice(0, 10); }
  function dias(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
  function prom(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }

  /* ── EL PLANTEL ─────────────────────────────────────────────────────── */
  function plantel() {
    var P = window.PLANTEL_NAFELS;
    return (P && P.jugadores) ? P.jugadores.slice() : [];
  }
  function fotoDe(num) {
    var n = parseInt(num, 10);
    return (n > 0) ? ('fotos/' + (n < 10 ? '0' : '') + n + '.jpg') : '';
  }

  /* ── LAS ENTRADAS DE UN JUGADOR, DE LA MAS NUEVA A LA MAS VIEJA ─────── */
  function entradas(num) {
    try {
      if (window.WStore && WStore.listByPlayer) return WStore.listByPlayer(num) || [];
    } catch (e) {}
    return [];
  }
  function ultimosDias(es, n, hasta) {
    var h = hasta || hoyISO();
    return es.filter(function (e) {
      if (!e.date || e.date > h) return false;
      var d = dias(e.date, h);
      return d >= 0 && d < n;
    });
  }

  /* ══ LAS METRICAS DE UN JUGADOR ════════════════════════════════════════ */
  function metricas(num, hasta) {
    var h = hasta || hoyISO();
    var es = entradas(num);
    var u7 = ultimosDias(es, 7, h);
    var hoy = es.filter(function (e) { return e.date === h; });
    var ref = hoy.length ? hoy : (u7.length ? [u7[0]] : []);

    var m = { num: num, hay: !!es.length, dia: ref.length ? ref[0].date : null };

    /* estado general: el % que ya calcula la encuesta */
    m.pct = ref.length ? Math.round(prom(ref.map(function (e) { return e.pct || 0; }))) : null;

    /* carga, aguda:cronica y monotonia: el motor que ya existia */
    try { m.carga = (window.WP && WP.cargaDe) ? WP.cargaDe(num, h) : null; } catch (e) { m.carga = null; }

    /* recuperacion: sueño, energia y piernas de la semana, de 0 a 100 */
    var tres = u7.map(function (e) {
      var q = e.q || {};
      var v = [q.sueno, q.energia, q.piernas].filter(function (x) { return typeof x === 'number'; });
      return v.length ? prom(v) : null;
    }).filter(function (x) { return x !== null; });
    m.recup = tres.length ? Math.round(prom(tres) * 10) : null;

    /* ── LO QUE TRAE EL WHOOP ────────────────────────────────────────
       Tres numeros opcionales que el jugador copia de su reloj. Cuando
       estan, mandan sobre los estimados: el sueño medido le gana a las
       horas a ojo, y el recovery del Whoop le gana al que calculo yo con
       las tres preguntas. Cuando no estan, todo sigue como antes.      */
    function delWhoop(k) {
      return u7.map(function (e) { return e.whoop && e.whoop[k]; })
               .filter(function (x) { return typeof x === 'number' && isFinite(x) && x > 0; });
    }
    var wRec = delWhoop('rec'), wHrv = delWhoop('hrv'), wHs = delWhoop('hs');
    m.wRec  = wRec.length ? Math.round(prom(wRec)) : null;
    m.wHrv  = wHrv.length ? Math.round(prom(wHrv)) : null;
    m.wHrvN = wHrv.length;
    m.hayWhoop = !!(wRec.length || wHrv.length || wHs.length);
    /* el HRV dia por dia, para la curva */
    m.serieHrv = [];

    /* horas de sueño: las del Whoop si estan, si no las que escribio */
    var hs = (wHs.length ? wHs : u7.map(function (e) { return e.horas; }))
               .filter(function (x) { return typeof x === 'number' && x > 0; });
    m.horas = hs.length ? Math.round(prom(hs) * 10) / 10 : null;
    m.horasN = hs.length;
    m.horasMedidas = wHs.length > 0;

    /* estres: la pregunta va al reves (10 = tranquilo), asi que se da vuelta */
    var st = u7.map(function (e) { return (e.q || {}).estres; })
               .filter(function (x) { return typeof x === 'number'; });
    m.estres = st.length ? Math.round((10 - prom(st)) * 10) : null;

    /* animo */
    var an = u7.map(function (e) { return (e.q || {}).animo; })
               .filter(function (x) { return typeof x === 'number'; });
    m.animo = an.length ? Math.round(prom(an) * 10) / 10 : null;

    /* molestias de hoy */
    try { m.mol = (window.WP && WP.molestiasDe) ? WP.molestiasDe(num, h) : {}; } catch (e) { m.mol = {}; }
    m.molMax = 0;
    Object.keys(m.mol || {}).forEach(function (k) { if (m.mol[k] > m.molMax) m.molMax = m.mol[k]; });

    /* lo que dijo el cuerpo tecnico */
    try { m.parte = (window.WP && WP.staffDe) ? WP.staffDe(num, h) : null; } catch (e) { m.parte = null; }

    m.serie  = serie7(es, h);
    m.serieHrv = m.serie.map(function (d) {
      var dd = es.filter(function (e) { return e.date === d.f && e.whoop && e.whoop.hrv > 0; });
      return { f: d.f, et: d.et, v: dd.length ? Math.round(prom(dd.map(function (e) { return e.whoop.hrv; }))) : null };
    });
    m.riesgo = riesgoDe(m);
    m.estado = estadoDe(m);
    return m;
  }

  /* ── EL RIESGO DE LESION ────────────────────────────────────────────────
     No es una opinion: se arma con los tres indicadores que la bibliografia
     de carga usa, mas lo que el jugador marco en el mapa del cuerpo.
         aguda:cronica  por encima de 1,5  es el salto de carga que rompe
         monotonia      por encima de 2    es entrenar siempre igual
         molestia       nivel 2 limita, nivel 3 no deja entrenar
     Si no hay datos suficientes devuelve null y el panel lo dice. */
  function riesgoDe(m) {
    var c = m.carga;
    if ((!c || !c.sesiones) && !m.molMax && m.wRec == null) return null;
    var r = 8;
    if (c && c.acwr) {
      if (c.acwr > 1.5) r += 45;
      else if (c.acwr > 1.3) r += 24;
      else if (c.acwr < 0.8 && c.cuatro && c.cuatro[1]) r += 14;
    }
    if (c && c.monotonia > 2) r += 14;
    if (m.molMax >= 3) r += 40;
    else if (m.molMax === 2) r += 22;
    else if (m.molMax === 1) r += 8;
    if (m.pct !== null && m.pct < 55) r += 12;
    /*  el recovery del Whoop: debajo de 34 es la zona roja del reloj  */
    if (m.wRec !== null && m.wRec !== undefined) {
      if (m.wRec < 34) r += 20;
      else if (m.wRec < 50) r += 10;
      else if (m.wRec >= 67) r -= 8;
    }
    return Math.max(0, Math.min(100, Math.round(r)));
  }
  function nivelRiesgo(r) {
    if (r === null) return { k: 'sin', t: T('Sin datos'), col: 'var(--p-txt3)' };
    if (r < 30) return { k: 'bajo',  t: T('Bajo'),     col: 'var(--p-verde)' };
    if (r < 55) return { k: 'medio', t: T('Moderado'), col: 'var(--p-ambar)' };
    if (r < 75) return { k: 'alto',  t: T('Alto'),     col: '#FF7A3C' };
    return { k: 'critico', t: T('Muy alto'), col: 'var(--red)' };
  }

  /* ── EL SEMAFORO DEL JUGADOR ────────────────────────────────────────── */
  function estadoDe(m) {
    if (m.pct === null) return { k: 'sin', t: T('Sin cargar'), col: 'var(--p-txt3)' };
    if (m.parte && m.parte.disp === 'no')  return { k: 'critico', t: T('No entrena'), col: 'var(--red)' };
    if (m.parte && m.parte.disp === 'lim') return { k: 'riesgo',  t: T('Limitado'),   col: 'var(--p-ambar)' };
    if (m.pct < 55 || (m.riesgo !== null && m.riesgo >= 75) || m.molMax >= 3)
      return { k: 'critico', t: T('Crítico'), col: 'var(--red)' };
    if (m.pct < 70 || (m.riesgo !== null && m.riesgo >= 55) || m.molMax === 2)
      return { k: 'riesgo', t: T('Riesgo'), col: 'var(--p-ambar)' };
    return { k: 'optimo', t: T('Bien'), col: 'var(--p-verde)' };
  }

  /* ── LA SERIE DE SIETE DIAS (carga por dia y estado general) ────────── */
  function serie7(es, hasta) {
    var h = hasta || hoyISO(), out = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(h + 'T12:00:00'); d.setDate(d.getDate() - i);
      var f = d.toISOString().slice(0, 10);
      var dd = es.filter(function (e) { return e.date === f; });
      var carga = 0;
      dd.forEach(function (e) {
        try { carga += (window.WP && WP.cargaSesion) ? WP.cargaSesion(e) : 0; } catch (x) {}
      });
      out.push({
        f: f, et: f.slice(8) + '/' + f.slice(5, 7),
        carga: Math.round(carga),
        pct: dd.length ? Math.round(prom(dd.map(function (e) { return e.pct || 0; }))) : null
      });
    }
    return out;
  }

  window.WEQ = {
    T: T, esc: esc, ico: ico, hoyISO: hoyISO, prom: prom, dias: dias,
    plantel: plantel, fotoDe: fotoDe, entradas: entradas, ultimosDias: ultimosDias,
    metricas: metricas, riesgoDe: riesgoDe, nivelRiesgo: nivelRiesgo,
    estadoDe: estadoDe, serie7: serie7
  };
})();

/* ============================================================================
   LA PANTALLA
   ========================================================================== */
(function () {
  'use strict';
  var W = window.WEQ; if (!W) return;
  var T = W.T, esc = W.esc, ico = W.ico;

  var ELEGIDO = null;        /* dorsal del jugador abierto */
  var SOLAPA  = 'resumen';
  var CLIMA   = null;        /* lo que contesto Open-Meteo, o null */

  function hasta() {
    var e = document.getElementById('eqFecha');
    return (e && e.value) || W.hoyISO();
  }

  /* ══ 1 · LA TIRA DE CONDICIONES ════════════════════════════════════════ */
  var CIELO = {
    0:['Despejado','Clear','Klar','sol'], 1:['Mayormente despejado','Mostly clear','Meist klar','sol'],
    2:['Parcialmente nublado','Partly cloudy','Teils bewölkt','nube'], 3:['Nublado','Overcast','Bedeckt','nube'],
    45:['Niebla','Fog','Nebel','nube'], 48:['Niebla','Fog','Nebel','nube'],
    51:['Llovizna','Drizzle','Nieselregen','gota'], 53:['Llovizna','Drizzle','Nieselregen','gota'],
    55:['Llovizna','Drizzle','Nieselregen','gota'], 61:['Lluvia','Rain','Regen','gota'],
    63:['Lluvia','Rain','Regen','gota'], 65:['Lluvia fuerte','Heavy rain','Starkregen','gota'],
    71:['Nieve','Snow','Schnee','gota'], 73:['Nieve','Snow','Schnee','gota'], 75:['Nieve','Snow','Schnee','gota'],
    80:['Chaparrones','Showers','Schauer','gota'], 81:['Chaparrones','Showers','Schauer','gota'],
    82:['Chaparrones','Showers','Schauer','gota'], 95:['Tormenta','Thunderstorm','Gewitter','rayo']
  };
  function cielo(c) {
    var l = (window.VSP && VSP.idioma) ? VSP.idioma() : 'es';
    var e = CIELO[c] || ['—','—','—','nube'];
    return { txt: l === 'en' ? e[1] : l === 'de' ? e[2] : e[0], ic: e[3] };
  }

  /*  Näfels, Glarus. Open-Meteo no pide clave ni manda nada nuestro.  */
  function traerClima(cb) {
    if (CLIMA !== null) return cb(CLIMA);
    var u = 'https://api.open-meteo.com/v1/forecast?latitude=47.1&longitude=9.067' +
            '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code' +
            '&timezone=Europe%2FZurich';
    /*  Con tiempo limite: si la API no contesta en 6 segundos se deja de
        esperar y la tira se arma sin el clima. Nunca frena la pantalla.  */
    var corta = null, ctrl = null;
    try { ctrl = new AbortController(); corta = setTimeout(function () { ctrl.abort(); }, 6000); } catch (e) {}
    try {
      fetch(u, ctrl ? { signal: ctrl.signal } : undefined)
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (corta) clearTimeout(corta);
          CLIMA = (d && d.current) ? d.current : false; cb(CLIMA);
        })
        .catch(function () { if (corta) clearTimeout(corta); CLIMA = false; cb(false); });
    } catch (e) { CLIMA = false; cb(false); }
  }

  function proximoPartido() {
    var F = window.FIXTURE_DATA;
    if (!F || !F.fixture) return null;
    var h = W.hoyISO();
    var p = F.fixture.filter(function (x) { return x.fecha >= h; })[0] || F.proximo;
    if (!p) return null;
    var i = F.fixture.indexOf(p);
    return { rival: p.rival, cond: p.cond, fecha: p.fecha, jornada: i >= 0 ? i + 1 : null };
  }

  function dato(ic, rot, val, sub) {
    return '<div class="we-dato"><span class="we-ic">' + ico(ic) + '</span>' +
      '<div><div class="rot">' + esc(rot) + '</div>' +
      '<div class="val">' + val + '</div>' +
      (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div></div>';
  }

  function pintarCondiciones() {
    var el = document.getElementById('we-cond'); if (!el) return;
    var p = proximoPartido();
    var filaPartido = p
      ? dato('calendario', T('Próximo partido'),
             esc(p.rival) + ' <span class="chico">' +
             (p.cond === 'local' ? T('local') : T('visitante')) + '</span>',
             (p.jornada ? T('Jornada') + ' ' + p.jornada + ' · ' : '') + p.fecha.split('-').reverse().join('/'))
      : '';

    traerClima(function (c) {
      var h = '';
      function hay(v) { return typeof v === 'number' && isFinite(v); }
      if (c && hay(c.temperature_2m)) {
        var ci = cielo(c.weather_code);
        h += dato(ci.ic, T('Condiciones actuales'),
                  Math.round(c.temperature_2m) + '°C <span class="chico">' + esc(ci.txt) + '</span>',
                  'Näfels, ' + T('Suiza'));
        if (hay(c.relative_humidity_2m)) h += dato('gota',    T('Humedad'), Math.round(c.relative_humidity_2m) + '%');
        if (hay(c.wind_speed_10m))       h += dato('viento',  T('Viento'),  Math.round(c.wind_speed_10m) + ' km/h');
        if (hay(c.surface_pressure))     h += dato('medidor', T('Presión'), Math.round(c.surface_pressure) + ' hPa');
      }
      h += filaPartido;
      el.innerHTML = h;
      el.style.display = h ? '' : 'none';
    });
  }

  /* ══ 2 · LA TIRA DE JUGADORES ══════════════════════════════════════════ */
  function anilloChico(pct, col) {
    var d = 40, g = 4, r = (d - g) / 2, c = 2 * Math.PI * r;
    var v = Math.max(0, Math.min(100, pct || 0));
    return '<span class="we-an"><svg width="' + d + '" height="' + d + '">' +
      '<circle cx="20" cy="20" r="' + r + '" fill="none" stroke="rgba(99,216,238,.14)" stroke-width="' + g + '"/>' +
      '<circle cx="20" cy="20" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + g +
        '" stroke-linecap="round" stroke-dasharray="' + (c * v / 100).toFixed(1) + ' ' + c.toFixed(1) +
        '" transform="rotate(-90 20 20)"/></svg><b>' + (pct === null ? '—' : pct) + '</b></span>';
  }

  function pintarTira() {
    var el = document.getElementById('we-tira'); if (!el) return;
    var h = hasta();
    var ms = W.plantel().map(function (j) { var m = W.metricas(j.num, h); m.j = j; return m; });
    /*  primero los que hay que mirar: peor estado arriba  */
    ms.sort(function (a, b) {
      var o = { critico: 0, riesgo: 1, optimo: 2, sin: 3 };
      return (o[a.estado.k] - o[b.estado.k]) || ((a.pct === null) - (b.pct === null)) || (a.pct - b.pct);
    });
    if (ELEGIDO === null && ms.length) ELEGIDO = ms[0].num;

    var vis = ms.slice(0, 5);
    el.innerHTML = vis.map(function (m) {
      var j = m.j;
      return '<button type="button" class="we-jt' + (m.num === ELEGIDO ? ' on' : '') + '" data-num="' + m.num + '">' +
        '<span class="fo"><img src="' + W.fotoDe(m.num) + '" alt="" ' +
          'onerror="this.parentElement.innerHTML=\'<b>' + m.num + '</b>\'"></span>' +
        '<span class="tx"><b>' + esc(j.nombre ? j.nombre.charAt(0) + '. ' + j.ap : j.ap) + '</b>' +
          '<i>#' + m.num + ' · ' + esc(j.pos || '') + '</i></span>' +
        anilloChico(m.pct, m.estado.col) +
        (m.pct === null ? '' :
          '<span class="es" style="color:' + m.estado.col + '">' + esc(m.estado.t) + '</span>') +
        '<span class="fl">' + ico('chevron') + '</span></button>';
    }).join('') +
    '<button type="button" class="we-jt todos" id="we-todos">' + ico('personas') +
      '<span>' + T('Ver todos') + '</span></button>';

    el.querySelectorAll('.we-jt[data-num]').forEach(function (b) {
      b.addEventListener('click', function () {
        ELEGIDO = +b.getAttribute('data-num'); SOLAPA = 'resumen'; pintar();
      });
    });
    var vt = document.getElementById('we-todos');
    if (vt) vt.addEventListener('click', function () { SOLAPA = 'plantel'; pintar(); });
  }

  /* ══ 3 · LA COLUMNA DEL JUGADOR ════════════════════════════════════════ */
  var SOLAPAS = [
    ['resumen',  'Resumen',      'Summary',   'Übersicht'],
    ['carga',    'Carga',        'Load',      'Belastung'],
    ['recup',    'Recuperación', 'Recovery',  'Erholung'],
    ['molest',   'Molestias',    'Niggles',   'Beschwerden'],
    ['hist',     'Historial',    'History',   'Verlauf']
  ];
  function tsol(s) {
    var l = (window.VSP && VSP.idioma) ? VSP.idioma() : 'es';
    return l === 'en' ? s[2] : l === 'de' ? s[3] : s[1];
  }

  function fila(ic, rot, val, col, pct) {
    return '<div class="we-fila"><span class="we-ic chico">' + ico(ic) + '</span>' +
      '<span class="rot">' + esc(rot) + '</span>' +
      '<span class="val" style="color:' + (col || 'var(--p-txt2)') + '">' + val + '</span>' +
      (pct == null ? '' : '<span class="bar"><i style="width:' + Math.max(0, Math.min(100, pct)) +
        '%;background:' + (col || 'var(--p-cyan)') + '"></i></span>') + '</div>';
  }

  function textoCarga(c) {
    if (!c || !c.sesiones) return { t: T('Sin sesiones'), col: 'var(--p-txt3)', pct: null };
    var s = c.semana;
    var col = 'var(--p-verde)', t = T('Normal');
    if (c.acwr > 1.5)      { col = 'var(--red)';     t = T('Alta'); }
    else if (c.acwr > 1.3) { col = 'var(--p-ambar)'; t = T('Subiendo'); }
    else if (c.acwr && c.acwr < 0.8) { col = 'var(--p-ambar)'; t = T('Baja'); }
    return { t: t, col: col, pct: Math.min(100, Math.round(s / 30)), n: s };
  }

  function panelJugador() {
    var el = document.getElementById('we-jug'); if (!el) return;
    var j = W.plantel().filter(function (x) { return x.num === ELEGIDO; })[0];
    if (!j) { el.innerHTML = ''; return; }
    var m = W.metricas(ELEGIDO, hasta());
    var nr = W.nivelRiesgo(m.riesgo);
    var tc = textoCarga(m.carga);

    var cab =
      '<div class="we-cabjug">' +
        '<span class="fo"><img src="' + W.fotoDe(j.num) + '" alt="" ' +
          'onerror="this.parentElement.innerHTML=\'<b>' + j.num + '</b>\'"></span>' +
        '<div class="nm"><b>' + esc((j.nombre ? j.nombre.charAt(0) + '. ' : '') + j.ap) + '</b>' +
          '<i>#' + j.num + ' · ' + esc(j.pos || '') + '</i></div>' +
        '<div class="pc">' +
          (window.VSP ? VSP.anillo(m.pct || 0, { d: 62, g: 7, col: m.estado.col,
             txt: (m.pct === null ? '—' : m.pct) }) : '') +
          '<span class="lb"><i>' + T('Estado general') + '</i><b style="color:' + m.estado.col + '">' +
            esc(m.estado.t) + '</b></span>' +
        '</div>' +
      '</div>';

    var tabs = '<div class="vs-p-tabs chico">' + SOLAPAS.map(function (s) {
      return '<button type="button" class="' + (SOLAPA === s[0] ? 'on' : '') + '" data-sol="' + s[0] + '">' +
        esc(tsol(s)) + '</button>';
    }).join('') + '</div>';

    var cuerpo = '';
    if (SOLAPA === 'carga')       cuerpo = cuerpoCarga(m);
    else if (SOLAPA === 'recup')  cuerpo = cuerpoRecup(m);
    else if (SOLAPA === 'molest') cuerpo = cuerpoMolestias(m);
    else if (SOLAPA === 'hist')   cuerpo = cuerpoHistorial(m);
    else                          cuerpo = cuerpoResumen(m, tc, nr);

    el.innerHTML = '<section class="vs-p-pan">' + cab + tabs +
      '<div class="vs-p-pan-cuerpo">' + cuerpo + '</div></section>';

    el.querySelectorAll('[data-sol]').forEach(function (b) {
      b.addEventListener('click', function () { SOLAPA = b.getAttribute('data-sol'); panelJugador(); });
    });
  }

  function cuerpoResumen(m, tc, nr) {
    var h = '<div class="we-rot">' + T('Estadísticas generales') + '</div>';
    h += fila('mancuerna', T('Carga de entrenamiento'), tc.t + (tc.n ? ' <i>' + tc.n + ' UA</i>' : ''), tc.col, tc.pct);
    var rc = (m.wRec !== null && m.wRec !== undefined) ? m.wRec : m.recup;
    var rcW = (m.wRec !== null && m.wRec !== undefined);
    h += fila('corazon',   T('Estado de recuperación'),
              rc === null ? T('Sin datos') : rc + '%' + (rcW ? ' <i>Whoop</i>' : ''),
              rc === null ? 'var(--p-txt3)' : (rc >= 67 ? 'var(--p-verde)' : rc >= 34 ? 'var(--p-ambar)' : 'var(--red)'),
              rc);
    if (m.wHrv !== null && m.wHrv !== undefined)
      h += fila('pulso', T('HRV (variabilidad cardíaca)'), m.wHrv + ' ms', 'var(--p-cyan)', null);
    h += fila('aviso', T('Riesgo de lesión'),
              m.riesgo === null ? T('Sin datos') : nr.t, nr.col, m.riesgo);
    h += fila('luna', T('Sueño promedio'),
              m.horas === null ? T('Nadie cargó horas')
                               : m.horas + ' h' + (m.horasMedidas ? ' <i>Whoop</i>' : ''),
              m.horas === null ? 'var(--p-txt3)' : (m.horas >= 7.5 ? 'var(--p-verde)' : m.horas >= 6.5 ? 'var(--p-ambar)' : 'var(--red)'),
              m.horas === null ? null : Math.min(100, Math.round(m.horas / 9 * 100)));
    h += fila('rayo', T('Estrés percibido'),
              m.estres === null ? T('Sin datos') : m.estres + '%',
              m.estres === null ? 'var(--p-txt3)' : (m.estres <= 35 ? 'var(--p-verde)' : m.estres <= 55 ? 'var(--p-ambar)' : 'var(--red)'),
              m.estres);
    h += fila('escudo', T('Molestias'),
              m.molMax ? (m.molMax >= 3 ? T('No puede entrenar') : m.molMax === 2 ? T('Lo limita') : T('Leve'))
                       : T('Ninguna'),
              m.molMax >= 3 ? 'var(--red)' : m.molMax === 2 ? 'var(--p-ambar)' : m.molMax === 1 ? '#FF7A3C' : 'var(--p-verde)',
              m.molMax ? m.molMax / 3 * 100 : 0);

    var obs = (m.parte && m.parte.nota) ? m.parte.nota : '';
    h += '<div class="we-obs"><div class="we-rot">' + T('Observaciones') + '</div>' +
         '<p>' + (obs ? esc(obs) : T('El cuerpo técnico no dejó nota para este día.')) + '</p></div>';
    return h;
  }

  function cuerpoCarga(m) {
    var c = m.carga;
    if (!c || !c.sesiones) return vacio(T('Todavía no hay sesiones cargadas esta semana.'));
    var h = '<div class="we-rot">' + T('Últimos 7 días') + '</div>';
    h += fila('barras',    T('Carga de la semana'), c.semana + ' UA', 'var(--p-cyan)', Math.min(100, c.semana / 30));
    h += fila('linea',     T('Aguda : crónica'),
              c.acwr ? c.acwr.toFixed(2) : '—',
              !c.acwr ? 'var(--p-txt3)' : c.acwr > 1.5 ? 'var(--red)' : c.acwr < 0.8 ? 'var(--p-ambar)' : 'var(--p-verde)',
              c.acwr ? Math.min(100, c.acwr / 2 * 100) : null);
    h += fila('refrescar', T('Monotonía'),
              c.monotonia ? c.monotonia.toFixed(1) : '—',
              c.monotonia > 2 ? 'var(--p-ambar)' : 'var(--p-verde)',
              c.monotonia ? Math.min(100, c.monotonia / 3 * 100) : null);
    h += fila('reloj',     T('Sesiones'), c.sesiones, 'var(--p-txt2)', null);
    if (c.estimada) h += '<p class="we-nota">' + T('Alguna sesión no tenía los minutos cargados: se estimaron 90.') + '</p>';
    try {
      var L = window.WP && WP.leerCarga ? WP.leerCarga(c) : null;
      if (L) h += '<p class="we-nota" style="color:' + L.col + '">' + esc(L.txt) + '</p>';
    } catch (e) {}
    return h;
  }

  function cuerpoRecup(m) {
    var es = W.ultimosDias(W.entradas(m.num), 7, hasta());
    if (!es.length) return vacio(T('No cargó la encuesta en los últimos 7 días.'));
    var CL = [['sueno','Sueño','Sleep','Schlaf'],['energia','Energía','Energy','Energie'],
              ['piernas','Piernas','Legs','Beine'],['cuerpo','Cuerpo','Body','Körper'],
              ['animo','Ánimo','Mood','Stimmung'],['estres','Cabeza','Head','Kopf']];
    var h = '<div class="we-rot">' + T('Promedio de la semana') + '</div>';
    CL.forEach(function (k) {
      var v = es.map(function (e) { return (e.q || {})[k[0]]; })
                .filter(function (x) { return typeof x === 'number'; });
      if (!v.length) return;
      var p = W.prom(v), pc = Math.round(p * 10);
      h += fila('corazon', tsol(k), p.toFixed(1) + ' / 10',
                pc >= 70 ? 'var(--p-verde)' : pc >= 50 ? 'var(--p-ambar)' : 'var(--red)', pc);
    });
    return h;
  }

  function cuerpoMolestias(m) {
    var ks = Object.keys(m.mol || {}).filter(function (k) { return m.mol[k] > 0; });
    if (!ks.length) return vacio(T('No marcó ninguna molestia.'));
    var NIV = [T('Leve'), T('Lo limita'), T('No puede entrenar')];
    var COL = ['#FF7A3C', 'var(--p-ambar)', 'var(--red)'];
    var h = '';
    ks.forEach(function (k) {
      var n = m.mol[k], nom = k, tend = null;
      try { nom = (window.WP && WP.nombreZona) ? WP.nombreZona(k) : k; } catch (e) {}
      try { tend = (window.WP && WP.tendenciaZona) ? WP.tendenciaZona(m.num, k, hasta()) : null; } catch (e) {}
      h += fila('escudo', nom, NIV[n - 1] + (tend ? ' <i>· ' + esc(tend.txt) + '</i>' : ''),
                COL[n - 1], n / 3 * 100);
    });
    return h;
  }

  function cuerpoHistorial(m) {
    var es = W.entradas(m.num).slice(0, 12);
    if (!es.length) return vacio(T('Todavía no cargó ninguna encuesta.'));
    var h = '<table class="vs-p-tabla chica"><thead><tr>' +
      '<th>' + T('Fecha') + '</th><th>' + T('Sesión') + '</th><th>RPE</th><th>' + T('Estado') + '</th></tr></thead><tbody>';
    es.forEach(function (e) {
      var p = e.pct || 0;
      var col = p >= 70 ? 'var(--p-verde)' : p >= 55 ? 'var(--p-ambar)' : 'var(--red)';
      h += '<tr><td>' + e.date.slice(8) + '/' + e.date.slice(5, 7) + '</td>' +
           '<td>' + esc(e.sesion || '—') + '</td>' +
           '<td>' + (typeof e.rpe === 'number' ? e.rpe : '—') + '</td>' +
           '<td style="color:' + col + ';font-weight:700">' + p + '%</td></tr>';
    });
    return h + '</tbody></table>';
  }

  function vacio(t) { return '<div class="we-vacio">' + esc(t) + '</div>'; }

  /* ══ 4 · LA COLUMNA DEL MEDIO ══════════════════════════════════════════ */

  /*  El grafico de carga: una barra por dia y la linea del promedio de las
      cuatro semanas. Las dos cosas estan en la misma unidad (UA = RPE x
      minutos), asi que comparten el mismo eje: nunca dos escalas.          */
  function graficoCarga(m) {
    var s = m.serie, c = m.carga;
    var max = Math.max(10, Math.max.apply(null, s.map(function (d) { return d.carga; })));
    var cron = (c && c.cuatro && c.cuatro.length) ? W.prom(c.cuatro.filter(function (v) { return v > 0; })) / 7 : 0;
    var W1 = 460, H = 150, pb = 26, pl = 34;
    var bw = (W1 - pl - 10) / s.length;
    var y = function (v) { return H - pb - (v / max) * (H - pb - 12); };

    var barras = s.map(function (d, i) {
      var x = pl + i * bw + bw * 0.22, w = bw * 0.56;
      var alto = Math.max(d.carga > 0 ? 3 : 0, (H - pb) - y(d.carga));
      return (d.carga > 0
        ? '<rect x="' + x.toFixed(1) + '" y="' + y(d.carga).toFixed(1) + '" width="' + w.toFixed(1) +
          '" height="' + alto.toFixed(1) + '" rx="3" fill="url(#weG)"/>'
        : '') +
        '<text class="ejx" x="' + (pl + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 9) + '">' + d.et + '</text>';
    }).join('');

    var linea = cron > 0
      ? '<line x1="' + pl + '" y1="' + y(cron).toFixed(1) + '" x2="' + (W1 - 8) + '" y2="' + y(cron).toFixed(1) +
        '" stroke="var(--p-cyan)" stroke-width="2" stroke-dasharray="5 4" opacity=".9"/>' +
        '<text class="ejy" x="' + (W1 - 10) + '" y="' + (y(cron) - 6).toFixed(1) + '" text-anchor="end">' +
        T('promedio crónico') + '</text>'
      : '';

    return '<svg class="we-graf" viewBox="0 0 ' + W1 + ' ' + H + '" preserveAspectRatio="none" role="img" ' +
      'aria-label="' + T('Carga por día de los últimos 7 días') + '">' +
      '<defs><linearGradient id="weG" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#FF2E58"/><stop offset="1" stop-color="#8A0624"/></linearGradient></defs>' +
      '<line x1="' + pl + '" y1="' + (H - pb) + '" x2="' + (W1 - 8) + '" y2="' + (H - pb) +
        '" stroke="rgba(99,216,238,.18)" stroke-width="1"/>' +
      '<text class="ejy" x="4" y="16">' + max + '</text>' +
      '<text class="ejy" x="4" y="' + (H - pb) + '">0</text>' +
      barras + linea + '</svg>';
  }

  /*  La curva de la derecha. Si el jugador carga el HRV de su Whoop, se
      dibuja el HRV —que es lo que pedia la maqueta—. Si no, se dibuja el
      estado general, que es el dato que siempre esta. Nunca se inventa.   */
  function curvaEstado(m, hrv) {
    var s = hrv
      ? m.serieHrv.filter(function (d) { return d.v !== null; }).map(function (d) { return { pct: d.v }; })
      : m.serie.filter(function (d) { return d.pct !== null; });
    if (s.length < 2) return '<div class="we-vacio chico">' + T('Faltan días cargados para la curva.') + '</div>';
    var W1 = 300, H = 92, pl = 26, pb = 18;
    var tope = hrv ? Math.max(20, Math.ceil(Math.max.apply(null, s.map(function (p) { return p.pct; })) / 10) * 10 * 1.15) : 100;
    var y = function (v) { return H - pb - (v / tope) * (H - pb - 10); };
    var col = hrv ? 'var(--p-cyan)' : 'var(--p-verde)';
    var x = function (i) { return pl + i * ((W1 - pl - 10) / Math.max(1, s.length - 1)); };
    var d = s.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.pct).toFixed(1); }).join(' ');
    var pts = s.map(function (p, i) {
      return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.pct).toFixed(1) + '" r="3.4" fill="' + col + '"/>';
    }).join('');
    return '<svg class="we-graf chico" viewBox="0 0 ' + W1 + ' ' + H + '" role="img" ' +
      'aria-label="' + T('Estado general de los últimos días') + '">' +
      '<text class="ejy" x="2" y="14">' + Math.round(tope) + '</text><text class="ejy" x="2" y="' + (H - pb) + '">0</text>' +
      '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' + pts + '</svg>';
  }

  function panelMedio() {
    var el = document.getElementById('we-med'); if (!el) return;
    var m = W.metricas(ELEGIDO, hasta());
    var h = '';

    h += '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico">' + ico('mancuerna') + '</span>' +
      '<span class="t">' + T('Carga de entrenamiento') + '</span>' +
      '<span class="der">' + T('Últimos 7 días') + ' · UA</span></div>' +
      '<div class="vs-p-pan-cuerpo">' +
        (m.carga && m.carga.sesiones ? graficoCarga(m)
          : '<div class="we-vacio">' + T('Sin sesiones cargadas esta semana.') + '</div>') +
      '</div></section>';

    var hs = m.horas;
    var hayHrv = m.serieHrv && m.serieHrv.filter(function (d) { return d.v !== null; }).length >= 2;
    h += '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico cyan">' + ico('luna') + '</span>' +
      '<span class="t">' + (hayHrv ? T('Sueño y recuperación') : T('Sueño y estado')) + '</span>' +
      (m.hayWhoop ? '<span class="der">Whoop</span>' : '') + '</div>' +
      '<div class="vs-p-pan-cuerpo we-dos">' +
        '<div class="we-media">' +
          (window.VSP ? VSP.anillo(hs === null ? 0 : Math.min(100, hs / 9 * 100),
            { d: 92, g: 9, col: hs === null ? 'var(--p-txt3)' : (hs >= 7.5 ? 'var(--p-verde)' : 'var(--p-ambar)'),
              txt: hs === null ? '—' : hs + 'h' }) : '') +
          '<span class="pie">' + (hs === null
            ? T('Nadie cargó las horas')
            : (m.horasMedidas ? T('Medido por el Whoop') : T('Promedio de {0} noches').replace('{0}', m.horasN))) + '</span>' +
        '</div>' +
        '<div class="we-media ancha"><div class="we-rot">' +
          (hayHrv ? T('HRV (variabilidad cardíaca)') : T('Estado general, día a día')) + '</div>' +
          curvaEstado(m, hayHrv) +
          (hayHrv ? '<p class="we-nota">' + T('Promedio {0} ms en {1} días').replace('{0}', m.wHrv).replace('{1}', m.wHrvN) + '</p>' : '') +
        '</div>' +
      '</div></section>';

    var e = m.estres;
    h += '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico">' + ico('rayo') + '</span>' +
      '<span class="t">' + T('Estrés y bienestar') + '</span></div>' +
      '<div class="vs-p-pan-cuerpo we-dos">' +
        '<div class="we-media">' +
          (window.VSP ? VSP.anillo(e === null ? 0 : e, { d: 92, g: 9,
            col: e === null ? 'var(--p-txt3)' : (e <= 35 ? 'var(--p-verde)' : e <= 55 ? 'var(--p-ambar)' : 'var(--red)'),
            txt: e === null ? '—' : e + '%' }) : '') +
          '<span class="pie">' + T('Nivel de estrés') + '</span>' +
        '</div>' +
        '<div class="we-media ancha">' +
          fila('corazon', T('Ánimo'), m.animo === null ? T('Sin datos') : m.animo.toFixed(1) + ' / 10',
               m.animo === null ? 'var(--p-txt3)' : (m.animo >= 7 ? 'var(--p-verde)' : m.animo >= 5 ? 'var(--p-ambar)' : 'var(--red)'),
               m.animo === null ? null : m.animo * 10) +
          fila('ok', T('Recuperación'), m.recup === null ? T('Sin datos') : m.recup + '%',
               m.recup === null ? 'var(--p-txt3)' : (m.recup >= 70 ? 'var(--p-verde)' : 'var(--p-ambar)'), m.recup) +
        '</div>' +
      '</div></section>';

    el.innerHTML = h;
  }

  /* ══ 5 · LA COLUMNA DE LA DERECHA ══════════════════════════════════════ */
  function todasLasMetricas() {
    var h = hasta();
    return W.plantel().map(function (j) { var m = W.metricas(j.num, h); m.j = j; return m; });
  }

  function panelDerecha() {
    var el = document.getElementById('we-der'); if (!el) return;
    var ms = todasLasMetricas();
    var conDato = ms.filter(function (m) { return m.pct !== null; });
    var opt = conDato.filter(function (m) { return m.estado.k === 'optimo'; }).length;
    var rie = conDato.filter(function (m) { return m.estado.k === 'riesgo'; }).length;
    var cri = conDato.filter(function (m) { return m.estado.k === 'critico'; }).length;
    var tot = ms.length;
    var pc  = conDato.length ? Math.round(opt / conDato.length * 100) : 0;

    var h = '';
    /* ── resumen del equipo ─────────────────────────────────────────── */
    h += '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico">' + ico('personas') + '</span>' +
      '<span class="t">' + T('Resumen del equipo') + '</span></div>' +
      '<div class="vs-p-pan-cuerpo we-res">' +
        (window.VSP ? VSP.anillo(pc, { d: 104, g: 11, col: 'var(--p-verde)', txt: pc + '%' }) : '') +
        '<div class="tx"><b>' + T('Jugadores en estado óptimo') + '</b>' +
          '<span>' + opt + ' / ' + (conDato.length || 0) + '</span>' +
          (conDato.length < tot
            ? '<i>' + T('{0} sin cargar la encuesta').replace('{0}', tot - conDato.length) + '</i>' : '') +
        '</div>' +
        '<ul class="ley">' +
          '<li><span class="p" style="background:var(--p-verde)"></span>' + T('Óptimo') + '<b>' + opt + '</b></li>' +
          '<li><span class="p" style="background:var(--p-ambar)"></span>' + T('En riesgo') + '<b>' + rie + '</b></li>' +
          '<li><span class="p" style="background:var(--red)"></span>' + T('Crítico') + '<b>' + cri + '</b></li>' +
        '</ul>' +
      '</div></section>';

    /* ── alertas: salen de los datos, una por motivo ────────────────── */
    var av = [];
    ms.forEach(function (m) {
      var nom = (m.j.nombre ? m.j.nombre.charAt(0) + '. ' : '') + m.j.ap;
      if (m.molMax >= 3)
        av.push({ n: nom, num: m.num, ic: 'aviso', col: 'var(--red)', t: T('Marcó que no puede entrenar.') });
      else if (m.molMax === 2)
        av.push({ n: nom, num: m.num, ic: 'aviso', col: 'var(--p-ambar)', t: T('Una molestia lo está limitando.') });
      if (m.carga && m.carga.acwr > 1.5)
        av.push({ n: nom, num: m.num, ic: 'linea', col: 'var(--red)',
                  t: T('La carga subió de golpe (aguda:crónica {0}).').replace('{0}', m.carga.acwr.toFixed(2)) });
      else if (m.carga && m.carga.monotonia > 2)
        av.push({ n: nom, num: m.num, ic: 'refrescar', col: 'var(--p-ambar)',
                  t: T('Todos los días parecidos (monotonía {0}): falta un día suave.').replace('{0}', m.carga.monotonia.toFixed(1)) });
      if (m.pct !== null && m.pct < 55)
        av.push({ n: nom, num: m.num, ic: 'corazon', col: 'var(--red)',
                  t: T('Viene muy por debajo de su normal ({0}%).').replace('{0}', m.pct) });
      if (m.wRec !== null && m.wRec !== undefined && m.wRec < 34)
        av.push({ n: nom, num: m.num, ic: 'corazon', col: 'var(--red)',
                  t: T('Whoop en rojo: {0}% de recovery.').replace('{0}', m.wRec) });
      if (m.horas !== null && m.horas < 6.5)
        av.push({ n: nom, num: m.num, ic: 'luna', col: 'var(--p-ambar)',
                  t: T('Durmiendo poco: {0} h de promedio.').replace('{0}', m.horas) });
    });
    var orden = { 'var(--red)': 0, 'var(--p-ambar)': 1 };
    av.sort(function (a, b) { return (orden[a.col] || 2) - (orden[b.col] || 2); });

    h += '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico">' + ico('aviso') + '</span>' +
      '<span class="t">' + T('Alertas y avisos') + '</span>' +
      (av.length ? '<span class="der">' + av.length + '</span>' : '') + '</div>' +
      '<div class="vs-p-pan-cuerpo">' +
        (av.length
          ? '<ul class="we-lista">' + av.slice(0, 6).map(function (a) {
              return '<li data-num="' + a.num + '"><span class="we-ic chico" style="color:' + a.col + '">' +
                ico(a.ic) + '</span><span class="tx"><b style="color:' + a.col + '">' + esc(a.n) + '</b>' +
                '<span>' + esc(a.t) + '</span></span>' + ico('chevron') + '</li>';
            }).join('') + '</ul>' +
            (av.length > 6 ? '<p class="we-nota">' + T('y {0} más').replace('{0}', av.length - 6) + '</p>' : '')
          : '<div class="we-vacio">' + T('Ninguna alerta hoy. El plantel viene en orden.') + '</div>') +
      '</div></section>';

    /* ── recomendaciones: lo que se desprende de esas alertas ───────── */
    var rec = [];
    var subio = ms.filter(function (m) { return m.carga && m.carga.acwr > 1.5; });
    var mono  = ms.filter(function (m) { return m.carga && m.carga.monotonia > 2; });
    var duele = ms.filter(function (m) { return m.molMax >= 2; });
    var duerme= ms.filter(function (m) { return m.horas !== null && m.horas < 6.5; });
    if (subio.length) rec.push({ ic: 'mancuerna', t:
      T('Bajar el volumen de salto a: {0}').replace('{0}',
        subio.map(function (m) { return m.j.ap + ' (#' + m.num + ')'; }).join(', ')) });
    if (mono.length) rec.push({ ic: 'refrescar', t:
      T('Meter un día claramente suave: {0} viene entrenando siempre al mismo nivel.').replace('{0}',
        mono.map(function (m) { return m.j.ap; }).join(', ')) });
    if (duele.length) rec.push({ ic: 'escudo', t:
      T('Mantener el protocolo de recuperación con {0}.').replace('{0}',
        duele.map(function (m) { return m.j.ap + ' (#' + m.num + ')'; }).join(', ')) });
    if (duerme.length) rec.push({ ic: 'luna', t:
      T('Hablar el descanso con {0}: vienen durmiendo menos de 6:30.').replace('{0}',
        duerme.map(function (m) { return m.j.ap; }).join(', ')) });
    var sinCargar = ms.filter(function (m) { return m.pct === null; });
    if (sinCargar.length) rec.push({ ic: 'nota', t:
      T('Recordarle la encuesta a {0}.').replace('{0}',
        sinCargar.map(function (m) { return m.j.ap; }).join(', ')) });

    h += '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico">' + ico('foco') + '</span>' +
      '<span class="t">' + T('Recomendaciones') + '</span></div>' +
      '<div class="vs-p-pan-cuerpo">' +
        (rec.length
          ? '<ul class="we-lista chica">' + rec.map(function (r) {
              return '<li><span class="we-ic chico">' + ico(r.ic) + '</span>' +
                     '<span class="tx"><span>' + esc(r.t) + '</span></span></li>';
            }).join('') + '</ul>'
          : '<div class="we-vacio">' + T('Nada para corregir hoy.') + '</div>') +
      '<p class="we-nota">' + T('Salen de la carga, las molestias y el sueño que cargó cada uno. No son una indicación médica.') + '</p>' +
      '</div></section>';

    el.innerHTML = h;
    el.querySelectorAll('.we-lista li[data-num]').forEach(function (li) {
      li.addEventListener('click', function () {
        ELEGIDO = +li.getAttribute('data-num'); SOLAPA = 'resumen'; pintar();
      });
    });
  }

  /* ══ 6 · LA TABLA DEL PLANTEL ENTERO ═══════════════════════════════════ */
  function panelPlantel() {
    var ms = todasLasMetricas();
    ms.sort(function (a, b) {
      var o = { critico: 0, riesgo: 1, optimo: 2, sin: 3 };
      return (o[a.estado.k] - o[b.estado.k]) || ((b.pct || 0) - (a.pct || 0));
    });
    var h = '<table class="vs-p-tabla"><thead><tr>' +
      '<th>' + T('Jugador') + '</th><th>' + T('Puesto') + '</th><th>' + T('Estado') + '</th>' +
      '<th>' + T('Carga') + '</th><th>A:C</th><th>' + T('Sueño') + '</th>' +
      '<th>' + T('Riesgo') + '</th><th>' + T('Molestias') + '</th></tr></thead><tbody>';
    ms.forEach(function (m) {
      var nr = W.nivelRiesgo(m.riesgo);
      h += '<tr data-num="' + m.num + '" style="cursor:pointer">' +
        '<td><b>#' + m.num + ' ' + esc(m.j.ap) + '</b></td>' +
        '<td>' + esc(m.j.pos || '') + '</td>' +
        '<td style="color:' + m.estado.col + ';font-weight:700">' +
          (m.pct === null ? '—' : m.pct + '%') + ' · ' + esc(m.estado.t) + '</td>' +
        '<td>' + (m.carga && m.carga.sesiones ? m.carga.semana : '—') + '</td>' +
        '<td>' + (m.carga && m.carga.acwr ? m.carga.acwr.toFixed(2) : '—') + '</td>' +
        '<td>' + (m.horas === null ? '—' : m.horas + ' h') + '</td>' +
        '<td style="color:' + nr.col + '">' + esc(nr.t) + '</td>' +
        '<td>' + (m.molMax ? '●'.repeat(m.molMax) : '—') + '</td></tr>';
    });
    h += '</tbody></table>';
    var el = document.getElementById('we-jug');
    el.innerHTML = '<section class="vs-p-pan"><div class="vs-p-pan-cab">' +
      '<span class="vs-p-ico">' + ico('personas') + '</span>' +
      '<span class="t">' + T('Todo el plantel') + '</span>' +
      '<button type="button" class="vs-p-btn" id="we-volver" style="margin-left:auto;height:30px">' +
        T('Volver al jugador') + '</button></div>' +
      '<div class="vs-p-pan-cuerpo">' + h + '</div></section>';
    el.querySelectorAll('tr[data-num]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        ELEGIDO = +tr.getAttribute('data-num'); SOLAPA = 'resumen'; pintar();
      });
    });
    var v = document.getElementById('we-volver');
    if (v) v.addEventListener('click', function () { SOLAPA = 'resumen'; pintar(); });
  }

  /* ══ 7 · DIBUJAR TODO ══════════════════════════════════════════════════ */
  function pintar() {
    if (!document.getElementById('we-tira')) return;
    pintarTira();
    if (SOLAPA === 'plantel') panelPlantel(); else panelJugador();
    panelMedio();
    panelDerecha();
  }

  /* ══ 8 · ARMAR LA PANTALLA ═════════════════════════════════════════════ */
  function montar() {
    var v = document.getElementById('view-eq');
    if (!v || document.getElementById('we-tira')) return;

    /*  Los filtros que ya existian se conservan: son controles que andan.
        Se los mete en la barra de la piel nueva en vez de borrarlos.      */
    var vieja = v.querySelector('.card');
    var filtros = vieja ? vieja.querySelector('.row2') : null;

    var nuevo = document.createElement('div');
    nuevo.id = 'we-todo';
    nuevo.innerHTML =
      '<div class="we-cond" id="we-cond" style="display:none"></div>' +
      '<div class="we-tira" id="we-tira"></div>' +
      '<div class="we-grid">' +
        '<div class="we-col" id="we-jug"></div>' +
        '<div class="we-col" id="we-med"></div>' +
        '<div class="we-col" id="we-der"></div>' +
      '</div>';

    if (vieja) {
      v.insertBefore(nuevo, vieja);
      vieja.style.display = 'none';          /* la tabla vieja queda de respaldo */
      if (filtros) {
        var caja = document.createElement('div');
        caja.className = 'vs-p-barra we-filtros';
        caja.appendChild(filtros);
        v.insertBefore(caja, nuevo);
      }
    } else {
      v.appendChild(nuevo);
    }

    ['eqFecha', 'eqPeriodo', 'eqSes'].forEach(function (id) {
      var e = document.getElementById(id);
      if (e) e.addEventListener('change', function () { pintar(); });
    });

    pintarCondiciones();
    pintar();
  }

  /*  renderTeam() es la que la pagina llama al abrir la pestaña. Se la
      envuelve: sigue haciendo lo suyo (la tabla vieja, escondida) y despues
      dibuja el tablero nuevo.                                              */
  function enganchar() {
    var orig = window.renderTeam;
    window.renderTeam = function () {
      try { if (typeof orig === 'function') orig.apply(this, arguments); } catch (e) {}
      try { montar(); pintar(); } catch (e) { try { console.warn('[wellness equipo]', e); } catch (x) {} }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enganchar);
  else enganchar();

  window.WEQ.pintar = pintar;
  window.WEQ.montar = montar;
})();
