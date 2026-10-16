/* ══════════════════════════════════════════════════════════════════════════
   wellness_plus.js  ·  EL WELLNESS QUE EXPLICA

   POR QUE EXISTE
   La encuesta preguntaba seis cosas del 1 al 10 y devolvia un porcentaje.
   Dos problemas, y los dos importan:

     1. El numero no significaba nada por si solo. El que duerme siempre 6
        vivia en amarillo; el que duerme 9 y hoy durmio 7 salia en verde. Y
        es al reves: el segundo es el que hay que mirar.

     2. No explicaba nada. "Frescura muscular, 10 = sin dolor" no le dice al
        jugador que esta puntuando ni para que sirve.

   QUE AGREGA
     · EL NORMAL DE CADA UNO. Cada respuesta se compara con el promedio
       propio de las ultimas tres semanas. Lo que avisa no es el numero
       bajo: es la CAIDA respecto de uno mismo.
     · QUE SIGNIFICA CADA PREGUNTA, en una linea, y que es un 1, un 5 y un
       10 escrito con palabras.
     · DONDE DUELE. Un mapa del cuerpo; se toca la zona y se elige cuanto
       molesta. La tendencia —mejora, igual, empeora— la calcula solo,
       comparando con los dias anteriores.
     · DISPONIBILIDAD Y NOTA DEL KINE. El cuerpo tecnico marca si entrena,
       entrena limitado o no entrena, y deja una nota que el jugador VE.
     · LA CARGA QUE YA SE JUNTABA. El RPE se guardaba y no se usaba para
       nada. Con los minutos de la sesion sale la carga (RPE x minutos), la
       semana, la monotonia y la relacion aguda:cronica.
     · EL PARTE DEL DIA. Una solapa para el cuerpo tecnico: quien esta
       disponible, quien no reporto, a quien hay que mirar, y la ficha de
       cada jugador en castellano.

   COMO SE ENGANCHA
   Se carga DESPUES del script de la pagina y vuelve a declarar las pocas
   funciones que cambian (buildQuestions, saveSurvey, maybeLoadExisting,
   renderHist). Sacando la linea del <script>, la pantalla queda exactamente
   como estaba.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── QUE SIGNIFICA CADA PREGUNTA ────────────────────────────────────────
     Las seis claves son las mismas de siempre —sueno, energia, piernas,
     cuerpo, animo, estres— y la escala sigue siendo de 1 a 10. Es a
     proposito: si cambiara cualquiera de las dos cosas, todo lo cargado
     hasta hoy dejaria de poder compararse. Lo que cambia es lo que el
     jugador LEE. */
  var EXPLICA = {
    sueno: {
      lb: 'Sueño', ic: '😴',
      que: 'Cómo dormiste anoche: si te costó, si te despertaste, si te levantaste descansado.',
      uno: 'Casi no pegué un ojo', cinco: 'Dormí, pero me desperté', diez: 'De un tirón, impecable'
    },
    energia: {
      lb: 'Energía', ic: '⚡',
      que: 'Con cuántas ganas y cuánta nafta te levantaste hoy, antes de entrenar.',
      uno: 'Fundido', cinco: 'Normal', diez: 'A full'
    },
    piernas: {
      lb: 'Piernas', ic: '🦵',
      que: 'Cuánto te pesan o te tiran las piernas al subir una escalera o al saltar.',
      uno: 'Durísimas, no saltan', cinco: 'Cargadas pero van', diez: 'Livianas, saltan solas'
    },
    cuerpo: {
      lb: 'Cuerpo', ic: '💪',
      que: 'El resto del cuerpo: hombro, espalda, brazos. Sin contar las piernas.',
      uno: 'Me duele y me condiciona', cinco: 'Alguna molestia', diez: 'Cero molestias'
    },
    animo: {
      lb: 'Ánimo', ic: '🙂',
      que: 'Las ganas de estar hoy acá, con el grupo y con el entrenamiento.',
      uno: 'No tengo ganas', cinco: 'Normal', diez: 'Con todo'
    },
    estres: {
      lb: 'Cabeza', ic: '🧘',
      que: 'Lo de afuera: estudio, trabajo, familia, viajes. Cuánto te está pesando.',
      uno: 'Muy cargado', cinco: 'Algo', diez: 'Tranquilo'
    }
  };
  var RPE_EXPLICA = {
    lb: 'Cuánto costó', ic: '🔥',
    que: 'Lo exigente que SENTISTE la sesión que terminaste. No mide cómo te sentís: mide el trabajo. Se contesta al final.',
    uno: 'Muy suave', cinco: 'Exigente', diez: 'Lo máximo que doy'
  };
  var CLAVES = ['sueno', 'energia', 'piernas', 'cuerpo', 'animo', 'estres'];

  /* ── EL MAPA DEL CUERPO ─────────────────────────────────────────────────
     El dibujo no es mio: es un mapa anatomico de verdad, con cada musculo
     como un poligono aparte. Viene de react-body-highlighter (MIT, (c) 2020
     GV79) y los poligonos estan en wellness_cuerpo.js, tal cual vienen.

     Lo que SI se armo aca es el mapeo a zonas de voley, en castellano y con
     el lado bien puesto. Ojo con eso, que es facil de errar: de FRENTE, lo
     que se ve a la izquierda de la pantalla es el lado DERECHO del jugador;
     de ESPALDAS, es el izquierdo. Un hombro cambiado de lado en el parte
     del kine no es un detalle.

     Los tres niveles estan escritos como los diria el jugador, no en escala
     medica: lo que importa es si puede jugar o no. */
  var NIVELES = [
    { n: 0, lb: '', col: '' },
    { n: 1, lb: 'Molesta',       col: '#fbbf24', ayuda: 'La siento, pero juego igual' },
    { n: 2, lb: 'Me condiciona', col: '#f97316', ayuda: 'Juego, pero no al 100%' },
    { n: 3, lb: 'No puedo',      col: '#ef4444', ayuda: 'Así no puedo entrenar' }
  ];
  function zonas() { try { return (window.WP_CUERPO && window.WP_CUERPO.zonas) || []; } catch (e) { return []; } }
  function zonaDe(k) { var z = zonas(); for (var i = 0; i < z.length; i++) if (z[i].k === k) return z[i]; return null; }
  function nombreZona(k) { var z = zonaDe(k); return z ? z.lb : k; }
  var ZONAS = [];

  var MOL = {};        /* lo que esta marcado AHORA en la pantalla */
  var CARA = 'F';

  /* ══ CUENTAS ════════════════════════════════════════════════════════════ */
  function prom(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  function desvio(a) {
    if (a.length < 2) return 0;
    var m = prom(a);
    return Math.sqrt(prom(a.map(function (v) { return (v - m) * (v - m); })));
  }
  function dias(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }

  function entradas(num) {
    try { return WStore.listAll().filter(function (e) { return e.num === num; }); } catch (e) { return []; }
  }

  /* ── EL NORMAL DE UN JUGADOR ────────────────────────────────────────────
     El promedio propio de las ultimas tres semanas, SIN contar el dia que
     se esta mirando. Tres semanas es la ventana que usan los equipos: lo
     bastante larga para que un mal dia no la mueva, lo bastante corta para
     seguir una puesta a punto.

     Con menos de cuatro registros no se dice nada. Un "estas por debajo de
     tu normal" calculado sobre dos dias no es informacion, es ruido. */
  var MINIMO = 4, VENTANA = 21;
  function normalDe(num, clave, hasta) {
    var hoy = hasta || new Date().toISOString().slice(0, 10);
    var v = entradas(num).filter(function (e) {
      if (!e.date || e.date >= hoy) return false;
      if (dias(e.date, hoy) > VENTANA) return false;
      var x = (clave === 'rpe') ? e.rpe : (e.q && e.q[clave]);
      return typeof x === 'number';
    }).map(function (e) { return (clave === 'rpe') ? e.rpe : e.q[clave]; });
    if (v.length < MINIMO) return null;
    return { m: prom(v), sd: desvio(v), n: v.length };
  }
  function normalPct(num, hasta) {
    var hoy = hasta || new Date().toISOString().slice(0, 10);
    var v = entradas(num).filter(function (e) {
      return e.date && e.date < hoy && dias(e.date, hoy) <= VENTANA && typeof e.pct === 'number';
    }).map(function (e) { return e.pct; });
    if (v.length < MINIMO) return null;
    return { m: prom(v), sd: desvio(v), n: v.length };
  }

  /* Cuanto se corrio hoy respecto de lo suyo.
     El desvio propio manda: a uno que siempre contesta 7 una caida a 6 le
     significa mas que a otro que va de 4 a 9 todos los dias. Cuando casi no
     varia, se mira la diferencia cruda para no gritar por nada. */
  function compara(valor, base) {
    if (!base) return { txt: 'todavía sin referencia', cls: 'neutro', z: 0 };
    var d = valor - base.m;
    var z = base.sd > 0.4 ? d / base.sd : d / 1.2;
    var cls = z <= -1.5 ? 'muy-bajo' : z <= -0.8 ? 'bajo' : z >= 0.8 ? 'alto' : 'normal';
    var txt = cls === 'muy-bajo' ? 'MUY por debajo de tu normal'
      : cls === 'bajo' ? 'por debajo de tu normal'
      : cls === 'alto' ? 'por encima de tu normal'
      : 'como siempre';
    return { txt: txt, cls: cls, z: z, dif: d, base: base.m };
  }
  var COLCLS = { 'muy-bajo': '#ef4444', 'bajo': '#f59e0b', 'normal': '#94a3b8', 'alto': '#22c55e', 'neutro': '#64748b' };

  /* ── LA CARGA ───────────────────────────────────────────────────────────
     Carga de una sesion = RPE x minutos (Foster). Es la forma mas usada de
     medir lo que costo de verdad una sesion, y sale de dos datos que el
     jugador ya tiene en la cabeza al terminar.

     Semana   : la suma de los ultimos 7 dias.
     Monotonia: que tan parecidos son todos los dias entre si. Entrenar
                siempre igual cansa mas que alternar fuerte y suave; arriba
                de 2 se enciende la luz.
     Aguda:cronica: la semana que paso contra el promedio de las cuatro
                ultimas. Subir de golpe es lo que rompe: debajo de 0,8 se
                esta perdiendo forma, arriba de 1,5 el riesgo sube.
     Sin minutos cargados no se inventa nada: se usan 90, que es lo que dura
     una practica, y se avisa que es una estimacion. */
  function cargaSesion(e) {
    if (!e || typeof e.rpe !== 'number') return 0;
    var min = (typeof e.min === 'number' && e.min > 0) ? e.min : 90;
    return e.rpe * min;
  }
  function cargaDe(num, hasta) {
    var hoy = hasta || new Date().toISOString().slice(0, 10);
    var es = entradas(num).filter(function (e) { return e.date && e.date <= hoy; });
    function entre(d1, d2) {   /* dias [hoy-d1, hoy-d2) */
      return es.filter(function (e) { var d = dias(e.date, hoy); return d >= d2 && d < d1; });
    }
    var porDia = {};
    entre(7, 0).forEach(function (e) { porDia[e.date] = (porDia[e.date] || 0) + cargaSesion(e); });
    var sem = Object.keys(porDia).map(function (k) { return porDia[k]; });
    var semana = sem.reduce(function (a, b) { return a + b; }, 0);
    /* la monotonia se cuenta sobre los 7 dias, los de descanso incluidos:
       descansar es justamente lo que la baja */
    var siete = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(hoy); d.setDate(d.getDate() - i);
      siete.push(porDia[d.toISOString().slice(0, 10)] || 0);
    }
    var sd = desvio(siete), mo = sd > 0 ? prom(siete) / sd : 0;
    var cuatro = [];
    for (var s = 0; s < 4; s++) {
      var tot = 0;
      entre(7 * (s + 1), 7 * s).forEach(function (e) { tot += cargaSesion(e); });
      cuatro.push(tot);
    }
    var cronica = prom(cuatro.filter(function (v, i) { return i > 0 || true; }));
    var acwr = cronica > 0 ? semana / cronica : 0;
    var sinMin = entre(7, 0).some(function (e) { return !(typeof e.min === 'number' && e.min > 0); });
    return { semana: Math.round(semana), monotonia: mo, strain: Math.round(semana * mo),
             acwr: acwr, cuatro: cuatro.map(Math.round), estimada: sinMin, sesiones: entre(7, 0).length };
  }
  function leerCarga(c) {
    if (!c || !c.sesiones) return { txt: 'Sin sesiones cargadas esta semana.', col: '#64748b' };
    var av = [];
    if (c.acwr && c.acwr > 1.5) av.push({ t: 'la carga subió de golpe (aguda:crónica ' + c.acwr.toFixed(2) + ')', col: '#ef4444' });
    else if (c.acwr && c.acwr < 0.8 && c.cuatro[1]) av.push({ t: 'viene entrenando bastante menos que las semanas anteriores', col: '#f59e0b' });
    if (c.monotonia > 2) av.push({ t: 'todos los días parecidos (monotonía ' + c.monotonia.toFixed(1) + '): falta un día suave', col: '#f59e0b' });
    if (!av.length) return { txt: 'Carga en orden.', col: '#22c55e' };
    return { txt: av.map(function (a) { return a.t; }).join(' · '), col: av[0].col };
  }

  /* ── MOLESTIAS: COMO VIENE ──────────────────────────────────────────────
     La tendencia no se pregunta: se mira. Se compara el nivel de hoy con el
     ultimo que tenia esa misma zona en los dias anteriores. Preguntarselo
     al jugador seria una pregunta mas para contestar sin pensar. */
  function historiaZona(num, k, hasta) {
    var hoy = hasta || new Date().toISOString().slice(0, 10);
    return entradas(num)
      .filter(function (e) { return e.date && e.date <= hoy && e.mol && typeof e.mol[k] === 'number'; })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }
  function tendenciaZona(num, k, hasta) {
    var h = historiaZona(num, k, hasta);
    if (!h.length) return null;
    var hoyN = h[0].mol[k], prev = null;
    for (var i = 1; i < h.length; i++) { if (h[i].date !== h[0].date) { prev = h[i]; break; } }
    var desde = h[h.length - 1].date;
    var d = dias(desde, h[0].date) + 1;
    if (!prev) return { nivel: hoyN, txt: 'primer día', col: '#94a3b8', dias: d };
    if (hoyN < prev.mol[k]) return { nivel: hoyN, txt: 'mejorando', col: '#22c55e', dias: d };
    if (hoyN > prev.mol[k]) return { nivel: hoyN, txt: 'empeorando', col: '#ef4444', dias: d };
    return { nivel: hoyN, txt: 'igual', col: '#f59e0b', dias: d };
  }
  function molestiasDe(num, fecha) {
    var es = entradas(num).filter(function (e) { return e.date === fecha && e.mol; });
    var out = {};
    es.forEach(function (e) { Object.keys(e.mol).forEach(function (k) { if (e.mol[k] > (out[k] || 0)) out[k] = e.mol[k]; }); });
    return out;
  }

  /* ══ LO QUE PONE EL CUERPO TECNICO ══════════════════════════════════════
     Va en su propia rama. Si estuviera adentro de la encuesta, el jugador
     la pisaria al volver a guardar. */
  var STAFF = {};
  function staffDe(num, fecha) { return (STAFF[num] && STAFF[num][fecha]) || null; }
  function staffGuardar(num, fecha, obj) {
    STAFF[num] = STAFF[num] || {};
    STAFF[num][fecha] = obj;
    try { localStorage.setItem('wellness_staff_naf', JSON.stringify(STAFF)); } catch (e) {}
    try { if (typeof fbSet === 'function') fbSet('wellness_staff/' + num + '/' + fecha, obj); } catch (e) {}
  }
  function staffCargar(cb) {
    try { STAFF = JSON.parse(localStorage.getItem('wellness_staff_naf') || '{}'); } catch (e) { STAFF = {}; }
    if (typeof fbGet !== 'function') { if (cb) cb(); return; }
    try {
      fbGet('wellness_staff', function (d) {
        if (d && typeof d === 'object') {
          STAFF = d;
          try { localStorage.setItem('wellness_staff_naf', JSON.stringify(STAFF)); } catch (e) {}
        }
        if (cb) cb();
      });
    } catch (e) { if (cb) cb(); }
  }
  var DISP = {
    ok:  { lb: 'Entrena', col: '#22c55e' },
    lim: { lb: 'Limitado', col: '#f59e0b' },
    no:  { lb: 'No entrena', col: '#ef4444' }
  };

  window.WP = {
    EXPLICA: EXPLICA, RPE_EXPLICA: RPE_EXPLICA, CLAVES: CLAVES, ZONAS: ZONAS, NIVELES: NIVELES,
    MOL: MOL, normalDe: normalDe, normalPct: normalPct, compara: compara, COLCLS: COLCLS,
    cargaDe: cargaDe, cargaSesion: cargaSesion, leerCarga: leerCarga,
    tendenciaZona: tendenciaZona, molestiasDe: molestiasDe, nombreZona: nombreZona,
    staffDe: staffDe, staffGuardar: staffGuardar, staffCargar: staffCargar, DISP: DISP,
    entradas: entradas, prom: prom, dias: dias,
    cara: function () { return CARA; }, setCara: function (c) { CARA = c; }
  };
})();

/* ══════════════════════════════════════════════════════════════════════════
   LA PANTALLA
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var W = window.WP;

  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function hoyISO() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function jugadores() { try { return (window.PLANTEL_NAFELS && window.PLANTEL_NAFELS.jugadores) || []; } catch (e) { return []; } }
  function apellido(num) { var j = jugadores().filter(function (x) { return x.num === num; })[0]; return j ? (j.ap || ('#' + num)) : ('#' + num); }
  function esStaff() { try { return (localStorage.getItem('vb_role') || '').toLowerCase() !== 'player'; } catch (e) { return true; } }
  function numJugador() { try { return window.jugadorConectado ? window.jugadorConectado() : null; } catch (e) { return null; } }

  /* ── LAS PREGUNTAS, CON LO QUE SIGNIFICAN ───────────────────────────── */
  window.buildQuestions = function () {
    var h = '';
    W.CLAVES.forEach(function (k) { h += unaPregunta(k, W.EXPLICA[k]); });
    h += '<div class="wp-sep"></div>';
    h += '<div class="wp-extra">'
      + '<label class="fld">¿Cuántas horas dormiste?</label>'
      + '<input type="number" id="wp-horas" min="0" max="14" step="0.5" placeholder="ej. 7.5">'
      + '<div class="wp-mini">Opcional. Las horas y cómo dormiste no son lo mismo: 8 horas malas son 8 horas malas.</div>'
      + '</div>';
    h += unaPregunta('rpe', W.RPE_EXPLICA);
    h += '<div class="wp-extra">'
      + '<label class="fld">¿Cuántos minutos duró?</label>'
      + '<input type="number" id="wp-min" min="0" max="300" step="5" placeholder="ej. 90">'
      + '<div class="wp-mini">Con esto el esfuerzo pasa a ser carga de verdad: RPE × minutos. Si lo dejás vacío se estiman 90.</div>'
      + '</div>';
    el('questions').innerHTML = h;
    W.CLAVES.concat(['rpe']).forEach(function (k) { window.onSlide(k); });
  };

  function unaPregunta(k, x) {
    return '<div class="q wp-q">'
      + '<div class="q-hd"><div class="q-lb"><span class="ic">' + x.ic + '</span>' + x.lb
      + '<div class="wp-que">' + esc(x.que) + '</div></div>'
      + '<div class="q-val" id="v-' + k + '">5</div></div>'
      + '<input type="range" min="1" max="10" value="5" id="r-' + k + '" oninput="onSlide(\'' + k + '\')">'
      + '<div class="wp-anclas"><span><b>1</b> ' + esc(x.uno) + '</span>'
      + '<span><b>5</b> ' + esc(x.cinco) + '</span>'
      + '<span><b>10</b> ' + esc(x.diez) + '</span></div>'
      + '<div class="wp-vs" id="vs-' + k + '"></div>'
      + '</div>';
  }

  /* al mover el slider, decirle ahi mismo como viene contra lo suyo */
  var onSlideOrig = window.onSlide;
  window.onSlide = function (k) {
    onSlideOrig(k);
    var num = numActual(), v = +el('r-' + k).value, caja = el('vs-' + k);
    if (!caja) return;
    var base = W.normalDe(num, k, fechaActual());
    if (!base) { caja.innerHTML = '<span style="color:#64748b">Tu normal se arma con unos días más de respuestas.</span>'; return; }
    var c = W.compara(v, base);
    caja.innerHTML = '<span style="color:' + W.COLCLS[c.cls] + '">' + c.txt + '</span>'
      + '<span style="color:#64748b"> · tu normal: ' + base.m.toFixed(1) + '</span>';
  };

  function numActual() { var y = numJugador(); if (y !== null && y !== undefined) return y; var s = el('selJug'); return s ? +s.value : 0; }
  function fechaActual() { var f = el('selFecha'); return (f && f.value) || hoyISO(); }

  /* ── EL MAPA DEL CUERPO, EN PANTALLA ──────────────────────────────── */
  var SEL = null;          /* la zona que el jugador acaba de tocar */
  function NIV() { return window.WP.NIVELES; }
  function zonaDe(k) {
    var z = (window.WP_CUERPO && window.WP_CUERPO.zonas) || [];
    for (var i = 0; i < z.length; i++) if (z[i].k === k) return z[i];
    return null;
  }

  function cuerpoSVG(cara) {
    var C = window.WP_CUERPO;
    if (!C) return '<div class="wp-mini">No se pudo cargar el mapa del cuerpo.</div>';
    var s = '<svg viewBox="0 0 100 222" class="wp-svg" role="img" aria-label="Mapa del cuerpo">';
    /* la cabeza es parte del dibujo y no se marca */
    (C.cabeza[cara] || []).forEach(function (p) { s += '<polygon points="' + p + '" class="wp-cab"/>'; });
    C.zonas.forEach(function (z) {
      var ps = z[cara] || [];
      if (!ps.length) return;
      var n = W.MOL[z.k] || 0;
      var cls = 'wp-zona' + (n ? ' n' + n : '') + (SEL === z.k ? ' sel' : '');
      s += '<g class="' + cls + '" data-k="' + z.k + '" tabindex="0" role="button" aria-label="' + esc(z.lb) + '">';
      ps.forEach(function (p) { s += '<polygon points="' + p + '"/>'; });
      s += '<title>' + esc(z.lb) + (n ? ' · ' + NIV()[n].lb : '') + '</title></g>';
    });
    return s + '</svg>';
  }

  function pintarMapa() {
    var c = el('wp-mapa'); if (!c) return;
    var cara = W.cara(), N = NIV();
    var h = '<div class="wp-caras">'
      + '<button type="button" class="chip' + (cara === 'F' ? ' on' : '') + '" data-cara="F">Frente</button>'
      + '<button type="button" class="chip' + (cara === 'E' ? ' on' : '') + '" data-cara="E">Espalda</button>'
      + '</div>'
      + '<div class="wp-cuerpo">' + cuerpoSVG(cara) + '</div>';

    /* ══ PRIMERO LA ZONA, DESPUES CUANTO ════════════════════════════════
       Antes cada toque subia un nivel. En un celular, con zonas chicas,
       eso es marcar cosas sin querer: se toca, se pasa de largo y hay que
       dar cuatro toques para apagarla. Ahora el toque solo ELIGE la zona y
       el nivel se aprieta aparte, con el nombre delante. */
    if (SEL) {
      var act = W.MOL[SEL] || 0, z = zonaDe(SEL);
      h += '<div class="wp-sel"><div class="wp-sel-ti">' + esc(z ? z.lb : SEL) + '</div><div class="wp-sel-bs">'
        + N.slice(1).map(function (n) {
            return '<button type="button" class="wp-nv' + (act === n.n ? ' on' : '') + '" data-n="' + n.n + '"'
              + ' style="--c:' + n.col + '"><b>' + n.lb + '</b><em>' + esc(n.ayuda) + '</em></button>'; }).join('')
        + (act ? '<button type="button" class="wp-nv wp-quitar" data-n="0"><b>Quitar</b><em>Ya no me duele</em></button>' : '')
        + '</div></div>';
    } else {
      h += '<div class="wp-mini wp-ayuda">Tocá la zona que te molesta. Si no te duele nada, no toques nada: está perfecto así.</div>';
    }

    h += '<div class="wp-leyenda">'
      + N.slice(1).map(function (n) {
          return '<span><i style="background:' + n.col + '"></i><b>' + n.lb + '</b> <em>' + esc(n.ayuda) + '</em></span>'; }).join('')
      + '</div><div class="wp-listamol" id="wp-listamol"></div>';
    c.innerHTML = h;

    [].forEach.call(c.querySelectorAll('[data-cara]'), function (b) {
      b.onclick = function () { W.setCara(b.getAttribute('data-cara')); SEL = null; pintarMapa(); };
    });
    [].forEach.call(c.querySelectorAll('.wp-zona'), function (g) {
      function tocar(ev) {
        if (ev) ev.preventDefault();
        var k = g.getAttribute('data-k');
        SEL = (SEL === k) ? null : k;
        pintarMapa();
        var s = el('wp-sel-ancla'); if (s) s.scrollIntoView({ block: 'nearest' });
      }
      g.onclick = tocar;
      g.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') tocar(e); };
    });
    [].forEach.call(c.querySelectorAll('.wp-nv'), function (b) {
      b.onclick = function () {
        var n = +b.getAttribute('data-n');
        if (n) W.MOL[SEL] = n; else delete W.MOL[SEL];
        SEL = null; pintarMapa();
      };
    });

    var marcadas = Object.keys(W.MOL);
    el('wp-listamol').innerHTML = marcadas.length
      ? '<div class="wp-bl-ti" style="font-size:14px;margin-top:4px">Lo que marcaste</div>'
        + marcadas.map(function (k) {
            var n = W.MOL[k], z = zonaDe(k);
            var otra = z && !((z[W.cara()] || []).length);
            return '<div class="wp-molfila"><i style="background:' + N[n].col + '"></i>'
              + esc(z ? z.lb : k) + ' <b style="color:' + N[n].col + '">' + N[n].lb + '</b>'
              + (otra ? '<span class="wp-mini" style="margin:0"> · se ve del otro lado</span>' : '')
              + '<button type="button" class="wp-x" data-k="' + k + '" aria-label="Quitar">✕</button></div>'; }).join('')
      : '';
    [].forEach.call(c.querySelectorAll('.wp-x'), function (b) {
      b.onclick = function () { delete W.MOL[b.getAttribute('data-k')]; pintarMapa(); };
    });
  }

  /* ── GUARDAR ────────────────────────────────────────────────────────── */
  window.saveSurvey = function () {
    var sel = el('selJug'); var num = +sel.value;
    var yo = numJugador(); if (yo !== null && yo !== undefined) num = yo;
    var j = jugadores().filter(function (x) { return x.num === num; })[0];
    if (!j) { alert('Elegí un jugador.'); return; }
    var date = fechaActual();
    var q = {}, suma = 0;
    W.CLAVES.forEach(function (k) { var v = +el('r-' + k).value; q[k] = v; suma += v; });
    var rpe = +el('r-rpe').value;
    var pct = Math.round(suma / W.CLAVES.length * 10);

    /* el normal se calcula ANTES de guardar: si no, el dia de hoy entraria
       en su propio promedio y se taparia solo */
    var antes = {}; W.CLAVES.forEach(function (k) { antes[k] = W.normalDe(num, k, date); });
    var baseP = W.normalPct(num, date);

    var e = { num: num, ap: j.ap, nombre: j.nombre, pos: j.pos, date: date, sesion: window.curSes || 'Pelota',
              q: q, rpe: rpe, pct: pct, ts: Date.now() };
    var ho = el('wp-horas'), mi = el('wp-min');
    if (ho && ho.value !== '') e.horas = +ho.value;
    if (mi && mi.value !== '') e.min = +mi.value;
    if (Object.keys(W.MOL).length) e.mol = JSON.parse(JSON.stringify(W.MOL));

    WStore.save(e);
    devolucion(e, antes, baseP);
    window.renderHist();
    try { if (window.wpPintarParte) window.wpPintarParte(); } catch (x) {}
  };

  /* ── LA DEVOLUCION: CONTRA VOS MISMO ────────────────────────────────── */
  function devolucion(e, antes, baseP) {
    var caja = el('cardResult'); if (!caja) return;
    var c = W.compara(e.pct, baseP);
    var col = baseP ? W.COLCLS[c.cls] : '#94a3b8';

    var movs = W.CLAVES.map(function (k) { return { k: k, c: W.compara(e.q[k], antes[k]) }; })
      .filter(function (x) { return antes[x.k]; })
      .sort(function (a, b) { return a.c.z - b.c.z; });
    var peor = movs[0], mejor = movs[movs.length - 1];

    var h = '<div class="result">'
      + '<div class="muted" style="font-size:11px;letter-spacing:2px;text-transform:uppercase">Tu wellness de hoy</div>'
      + '<div class="big" id="resPct" style="color:' + col + '">' + e.pct + '%</div>';
    if (baseP) {
      h += '<div class="fb" style="color:' + col + '">' + c.txt + '</div>'
        + '<div class="wp-mini" style="margin-top:2px">Tu normal de las últimas 3 semanas es '
        + Math.round(baseP.m) + '% · sobre ' + baseP.n + ' respuestas</div>';
    } else {
      h += '<div class="fb" style="color:#94a3b8">Todavía no tenés suficientes días cargados para comparar.</div>'
        + '<div class="wp-mini" style="margin-top:2px">Con 4 respuestas ya te digo cómo venís contra vos mismo.</div>';
    }
    if (peor && peor.c.z <= -0.8) {
      h += '<div class="wp-dest" style="border-color:' + W.COLCLS[peor.c.cls] + '55">'
        + '<b style="color:' + W.COLCLS[peor.c.cls] + '">' + W.EXPLICA[peor.k].ic + ' ' + W.EXPLICA[peor.k].lb
        + ' es lo que más te bajó</b><br><span class="wp-mini">' + e.q[peor.k] + '/10 · tu normal '
        + peor.c.base.toFixed(1) + '</span></div>';
    } else if (mejor && mejor.c.z >= 0.8) {
      h += '<div class="wp-dest" style="border-color:#22c55e55"><b style="color:#22c55e">'
        + W.EXPLICA[mejor.k].ic + ' ' + W.EXPLICA[mejor.k].lb + ' es lo mejor que traés hoy</b></div>';
    }
    var mols = Object.keys(W.MOL);
    if (mols.length) {
      h += '<div class="wp-dest" style="border-color:#f9731655"><b style="color:#f97316">Marcaste '
        + mols.length + ' zona' + (mols.length > 1 ? 's' : '') + '</b><br><span class="wp-mini">'
        + mols.map(function (k) { return esc(W.nombreZona(k)); }).join(' · ')
        + ' — el cuerpo técnico lo ve en el parte de hoy.</span></div>';
    }
    var st = W.staffDe(e.num, e.date);
    if (st && st.disp) {
      h += '<div class="wp-dest" style="border-color:' + W.DISP[st.disp].col + '55"><b style="color:'
        + W.DISP[st.disp].col + '">' + W.DISP[st.disp].lb + '</b>'
        + (st.nota ? '<br><span class="wp-mini">' + esc(st.nota) + '</span>' : '') + '</div>';
    }
    h += '<div style="margin-top:12px"><a href="prep_fisica.html" style="color:var(--acc);font-size:13px;font-weight:700;text-decoration:none">Ver tu preparación física →</a></div></div>';
    caja.innerHTML = h;
    caja.style.display = 'block';
    caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── PRECARGAR LO DE HOY ────────────────────────────────────────────── */
  window.maybeLoadExisting = function () {
    var num = numActual(), date = fechaActual(), ses = window.curSes || 'Pelota';
    var ex = WStore.listAll().filter(function (e) { return e.num === num && e.date === date && e.sesion === ses; })[0];
    W.CLAVES.concat(['rpe']).forEach(function (k) {
      var v = ex ? (k === 'rpe' ? ex.rpe : (ex.q && ex.q[k])) : 5;
      if (v == null) v = 5;
      var r = el('r-' + k); if (r) { r.value = v; window.onSlide(k); }
    });
    var ho = el('wp-horas'), mi = el('wp-min');
    if (ho) ho.value = (ex && ex.horas != null) ? ex.horas : '';
    if (mi) mi.value = (ex && ex.min != null) ? ex.min : '';
    Object.keys(W.MOL).forEach(function (k) { delete W.MOL[k]; });
    if (ex && ex.mol) Object.keys(ex.mol).forEach(function (k) { W.MOL[k] = ex.mol[k]; });
    pintarMapa();
    pintarAviso();
  };

  /* lo que el cuerpo tecnico le dejo dicho, arriba de todo */
  function pintarAviso() {
    var c = el('wp-aviso'); if (!c) return;
    var st = W.staffDe(numActual(), fechaActual());
    if (!st || !st.disp) { c.style.display = 'none'; c.innerHTML = ''; return; }
    c.style.display = 'block';
    c.innerHTML = '<div class="wp-aviso" style="border-color:' + W.DISP[st.disp].col + '66">'
      + '<b style="color:' + W.DISP[st.disp].col + '">' + W.DISP[st.disp].lb + '</b>'
      + (st.nota ? '<div class="wp-mini" style="margin-top:3px">' + esc(st.nota) + '</div>' : '')
      + '</div>';
  }
  window.wpPintarAviso = pintarAviso;
  window.wpPintarMapa = pintarMapa;
})();

/* ══════════════════════════════════════════════════════════════════════════
   EL HISTORIAL DEL JUGADOR Y EL PARTE DEL CUERPO TECNICO
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var W = window.WP;
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function hoyISO() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function jugadores() { try { return (window.PLANTEL_NAFELS && window.PLANTEL_NAFELS.jugadores) || []; } catch (e) { return []; } }
  function esStaff() { try { return (localStorage.getItem('vb_role') || '').toLowerCase() !== 'player'; } catch (e) { return true; } }
  function col(p) { return p >= 85 ? '#22c55e' : p >= 70 ? '#4ade80' : p >= 55 ? '#f59e0b' : '#ef4444'; }

  /* ── HISTORIAL ──────────────────────────────────────────────────────── */
  var histOrig = window.renderHist;
  window.renderHist = function () {
    histOrig();
    var sel = el('selJug'); if (!sel) return;
    var num = +sel.value, out = el('histOut');
    if (!out) return;
    var hoy = hoyISO();
    var extra = '';

    var base = W.normalPct(num, hoy);
    if (base) {
      extra += '<div class="wp-bloque"><div class="wp-bl-ti">Tu normal</div>'
        + '<div class="wp-mini">Promedio propio de las últimas 3 semanas: <b style="color:' + col(Math.round(base.m)) + '">'
        + Math.round(base.m) + '%</b> sobre ' + base.n + ' respuestas. Es contra esto que se mide tu día, no contra el 100.</div></div>';
    }

    var c = W.cargaDe(num, hoy), lec = W.leerCarga(c);
    if (c.sesiones) {
      extra += '<div class="wp-bloque"><div class="wp-bl-ti">Tu carga</div>'
        + '<div class="wp-cargas">'
        + caja('Esta semana', c.semana.toLocaleString('es-AR'), '#e2e8f0', 'RPE × minutos, últimos 7 días')
        + caja('Monotonía', c.monotonia ? c.monotonia.toFixed(1) : '—', c.monotonia > 2 ? '#f59e0b' : '#22c55e', 'Arriba de 2: todos los días iguales')
        + caja('Aguda:crónica', c.acwr ? c.acwr.toFixed(2) : '—', (c.acwr > 1.5 || (c.acwr && c.acwr < 0.8)) ? '#f59e0b' : '#22c55e', 'Esta semana contra el promedio de 4')
        + '</div>'
        + '<div class="wp-mini" style="color:' + lec.col + ';margin-top:6px">' + esc(lec.txt) + '</div>'
        + (c.estimada ? '<div class="wp-mini">Alguna sesión no tiene los minutos cargados: ahí se estimaron 90.</div>' : '')
        + '</div>';
    }

    var mols = W.molestiasDe(num, hoy);
    if (Object.keys(mols).length) {
      extra += '<div class="wp-bloque"><div class="wp-bl-ti">Tus molestias de hoy</div>'
        + Object.keys(mols).map(function (k) {
            var t = W.tendenciaZona(num, k, hoy), n = mols[k];
            return '<div class="wp-molfila"><i style="background:' + W.NIVELES[n].col + '"></i>'
              + esc(W.nombreZona(k)) + ' · <b style="color:' + W.NIVELES[n].col + '">' + W.NIVELES[n].lb + '</b>'
              + (t ? ' · <span style="color:' + t.col + '">' + t.txt + '</span><span class="wp-mini"> (' + t.dias + ' día' + (t.dias > 1 ? 's' : '') + ')</span>' : '')
              + '</div>'; }).join('')
        + '</div>';
    }
    if (extra) out.insertAdjacentHTML('afterbegin', extra);
  };
  function caja(t, v, c, ayuda) {
    return '<div class="wp-caja"><div class="wp-caja-t">' + esc(t) + '</div>'
      + '<div class="wp-caja-v" style="color:' + c + '">' + v + '</div>'
      + '<div class="wp-caja-a">' + esc(ayuda) + '</div></div>';
  }

  /* ── EL PARTE DEL DIA ───────────────────────────────────────────────── */
  function fechaParte() { var f = el('wp-fecha'); return (f && f.value) || hoyISO(); }

  function filaDe(num, fecha) {
    var es = W.entradas(num).filter(function (e) { return e.date === fecha; });
    var pct = null;
    if (es.length) pct = Math.round(W.prom(es.map(function (e) { return e.pct; })));
    var base = W.normalPct(num, fecha);
    var cmp = (pct != null && base) ? W.compara(pct, base) : null;
    var mols = W.molestiasDe(num, fecha);
    var peorMol = 0; Object.keys(mols).forEach(function (k) { if (mols[k] > peorMol) peorMol = mols[k]; });
    var st = W.staffDe(num, fecha);
    var carga = W.cargaDe(num, fecha);
    /* prioridad: primero lo que impide entrenar, despues el cuerpo, despues
       la caida contra uno mismo, y al final la carga */
    var p = 0;
    if (st && st.disp === 'no') p += 100;
    if (st && st.disp === 'lim') p += 60;
    p += peorMol * 18;
    if (cmp) p += Math.max(0, -cmp.z) * 14;
    if (carga.acwr > 1.5) p += 10;
    if (pct == null) p += 1;                       /* no reporto: va al final, pero se ve */
    return { num: num, ap: apel(num), pct: pct, cmp: cmp, mols: mols, peorMol: peorMol,
             st: st, carga: carga, prio: p, reporto: pct != null, es: es };
  }
  function apel(num) { var j = jugadores().filter(function (x) { return x.num === num; })[0]; return j ? (j.ap || ('#' + num)) : ('#' + num); }

  window.wpPintarParte = function () {
    var cont = el('wp-parte'); if (!cont) return;
    var fecha = fechaParte();
    var filas = jugadores().map(function (j) { return filaDe(j.num, fecha); });

    var entrena = filas.filter(function (f) { return !f.st || f.st.disp === 'ok' || !f.st.disp; }).length;
    var lim = filas.filter(function (f) { return f.st && f.st.disp === 'lim'; }).length;
    var no = filas.filter(function (f) { return f.st && f.st.disp === 'no'; }).length;
    var sin = filas.filter(function (f) { return !f.reporto; });

    /* 'entrena' ya sale de filtrar los limitados y los que no entrenan: si
       encima se los restaba, quedaban descontados dos veces */
    var h = '<div class="wp-conteo">'
      + conteo(entrena, 'Entrenan', '#22c55e')
      + conteo(lim, 'Limitados', '#f59e0b')
      + conteo(no, 'No entrenan', '#ef4444')
      + conteo(sin.length, 'Sin reportar', '#64748b')
      + '</div>';

    if (sin.length) {
      h += '<div class="wp-bloque"><div class="wp-bl-ti">Todavía no reportaron</div>'
        + '<div class="wp-mini">' + sin.map(function (f) { return esc(f.ap); }).join(' · ') + '</div></div>';
    }

    var atencion = filas.filter(function (f) { return f.prio >= 14 && f.reporto; })
                        .sort(function (a, b) { return b.prio - a.prio; });
    h += '<div class="wp-bloque"><div class="wp-bl-ti">Requiere atención</div>';
    h += atencion.length
      ? atencion.map(function (f) { return tarjeta(f, fecha, true); }).join('')
      : '<div class="wp-mini">Nadie en rojo hoy. El plantel llega bien.</div>';
    h += '</div>';

    var resto = filas.filter(function (f) { return atencion.indexOf(f) < 0; })
                     .sort(function (a, b) { return (b.pct || -1) - (a.pct || -1); });
    h += '<div class="wp-bloque"><div class="wp-bl-ti">El resto del plantel</div>'
      + resto.map(function (f) { return tarjeta(f, fecha, false); }).join('') + '</div>';

    cont.innerHTML = h;
    enganchar(cont, fecha);
  };
  function conteo(n, lb, c) {
    return '<div class="wp-cont"><div class="wp-cont-n" style="color:' + c + '">' + Math.max(0, n) + '</div>'
      + '<div class="wp-cont-l">' + lb + '</div></div>';
  }

  /* ── LA FICHA DE CADA JUGADOR, EN CASTELLANO ────────────────────────── */
  function tarjeta(f, fecha, abierta) {
    var c = f.cmp, lec = W.leerCarga(f.carga);
    var cabeza = '<div class="wp-tj-hd">'
      + '<b>' + esc(f.ap) + '</b>'
      + (f.pct != null ? '<span class="wp-tj-pct" style="color:' + col(f.pct) + '">' + f.pct + '%</span>'
                       : '<span class="wp-tj-pct" style="color:#64748b">sin reportar</span>')
      + (c ? '<span class="wp-tj-vs" style="color:' + W.COLCLS[c.cls] + '">' + c.txt + '</span>' : '')
      + (f.st && f.st.disp ? '<span class="wp-pill" style="background:' + W.DISP[f.st.disp].col + '22;color:'
            + W.DISP[f.st.disp].col + ';border-color:' + W.DISP[f.st.disp].col + '55">' + W.DISP[f.st.disp].lb + '</span>' : '')
      + '</div>';

    var cuerpo = '';
    if (f.reporto) {
      var e = f.es[0];
      var movs = W.CLAVES.map(function (k) {
        var b = W.normalDe(f.num, k, fecha);
        return { k: k, v: e.q ? e.q[k] : null, c: b ? W.compara(e.q[k], b) : null };
      });
      cuerpo += '<div class="wp-items">' + movs.map(function (m) {
        var cc = m.c ? W.COLCLS[m.c.cls] : '#94a3b8';
        return '<span class="wp-item" title="' + esc(W.EXPLICA[m.k].que) + '">'
          + W.EXPLICA[m.k].ic + ' ' + W.EXPLICA[m.k].lb
          + ' <b style="color:' + cc + '">' + (m.v != null ? m.v : '—') + '</b>'
          + (m.c && m.c.base != null ? '<em>/' + m.c.base.toFixed(1) + '</em>' : '') + '</span>'; }).join('') + '</div>';
      var bajos = movs.filter(function (m) { return m.c && m.c.z <= -0.8; });
      if (bajos.length) {
        cuerpo += '<div class="wp-frase">Lo que le bajó contra lo suyo: '
          + bajos.map(function (m) { return '<b>' + W.EXPLICA[m.k].lb.toLowerCase() + '</b>'; }).join(', ') + '.</div>';
      }
      if (e.horas != null) cuerpo += '<div class="wp-mini">Durmió ' + e.horas + ' h.</div>';
    } else {
      cuerpo += '<div class="wp-mini">No cargó la encuesta de este día.</div>';
    }

    var ks = Object.keys(f.mols);
    if (ks.length) {
      cuerpo += '<div class="wp-frase"><b>Molestias:</b> ' + ks.map(function (k) {
        var t = W.tendenciaZona(f.num, k, fecha), n = f.mols[k];
        return '<span style="color:' + W.NIVELES[n].col + '">' + esc(W.nombreZona(k)) + ' (' + W.NIVELES[n].lb.toLowerCase() + ')</span>'
          + (t ? '<span style="color:' + t.col + '"> ' + t.txt + ', ' + t.dias + 'd</span>' : ''); }).join(' · ') + '</div>';
    }
    if (f.carga.sesiones) {
      cuerpo += '<div class="wp-frase"><b>Carga:</b> ' + f.carga.semana.toLocaleString('es-AR')
        + ' esta semana · monotonía ' + (f.carga.monotonia ? f.carga.monotonia.toFixed(1) : '—')
        + ' · aguda:crónica ' + (f.carga.acwr ? f.carga.acwr.toFixed(2) : '—')
        + ' <span style="color:' + lec.col + '">— ' + esc(lec.txt) + '</span></div>';
    }
    if (f.st && f.st.nota) {
      cuerpo += '<div class="wp-frase"><b>Nota del cuerpo técnico:</b> ' + esc(f.st.nota) + '</div>';
    }
    if (esStaff()) {
      cuerpo += '<div class="wp-staff" data-num="' + f.num + '">'
        + '<div class="wp-disp">'
        + ['ok', 'lim', 'no'].map(function (d) {
            var on = f.st && f.st.disp === d;
            return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-d="' + d + '">' + W.DISP[d].lb + '</button>'; }).join('')
        + '</div>'
        + '<input type="text" class="wp-nota" placeholder="Nota para el jugador: por qué, y qué sí puede hacer" value="'
        + esc(f.st && f.st.nota ? f.st.nota : '') + '">'
        + '</div>';
    }

    return '<details class="wp-tj"' + (abierta ? ' open' : '') + '><summary>' + cabeza + '</summary>' + cuerpo + '</details>';
  }

  function enganchar(cont, fecha) {
    [].forEach.call(cont.querySelectorAll('.wp-staff'), function (box) {
      var num = +box.getAttribute('data-num');
      var nota = box.querySelector('.wp-nota');
      [].forEach.call(box.querySelectorAll('[data-d]'), function (b) {
        b.onclick = function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          var anterior = W.staffDe(num, fecha) || {};
          var d = b.getAttribute('data-d');
          if (anterior.disp === d) d = '';          /* volver a tocar lo quita */
          W.staffGuardar(num, fecha, { disp: d, nota: nota ? nota.value : (anterior.nota || ''), ts: Date.now() });
          window.wpPintarParte();
        };
      });
      if (nota) {
        nota.onclick = function (ev) { ev.stopPropagation(); };
        nota.onchange = function () {
          var a = W.staffDe(num, fecha) || {};
          W.staffGuardar(num, fecha, { disp: a.disp || '', nota: nota.value, ts: Date.now() });
        };
      }
    });
  }

  /* ── ARRANQUE ───────────────────────────────────────────────────────── */
  function arrancar() {
    var f = el('wp-fecha'); if (f && !f.value) f.value = hoyISO();
    if (f) f.onchange = window.wpPintarParte;
    var tabP = el('tab-parte');
    if (tabP && !esStaff()) tabP.style.display = 'none';
    /* ══ VOLVER A DIBUJAR LAS PREGUNTAS ═══════════════════════════════
       El script de la pantalla ya corrio y ya dibujo las preguntas con el
       formato viejo: este archivo se carga DESPUES. Se vuelven a dibujar
       una vez, ahora con lo que significa cada una, y se recarga lo que el
       jugador hubiera contestado hoy. */
    try { window.buildQuestions(); } catch (e) {}
    try { window.maybeLoadExisting(); } catch (e) {}
    try { window.renderHist(); } catch (e) {}
    try { window.wpPintarMapa(); } catch (e) {}
    W.staffCargar(function () {
      try { window.wpPintarParte(); } catch (e) {}
      try { window.wpPintarAviso(); } catch (e) {}
    });
    try { window.wpPintarParte(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(arrancar, 60); });
  else setTimeout(arrancar, 60);
})();
