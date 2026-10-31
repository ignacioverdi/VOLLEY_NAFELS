/* ══════════════════════════════════════════════════════════════════════════
   PLAN DE PARTIDO · COLUMNA DE RESUMEN

   La pantalla ya mostraba las seis canchas del armador, pero para sacar una
   conclusion habia que mirar las seis y sumar de cabeza: cual es su zona
   preferida, cual le rinde, que rotacion carga mas.

   Esto agrega, al costado de las canchas, tres bloques que leen EXACTAMENTE
   los mismos armados que estan dibujados —el mismo armador, el mismo filtro
   de fase, recepcion, llamada y partidos— y los resumen:

     · Resumen general      — armados y % de punto, con el anillo
     · Tipos de distribucion— cuanto va a cada zona (y por llamada)
     · Claves del armador   — las cuatro lineas que uno diria en la charla

   No inventa ningun numero: todo sale de armRallies(), la misma funcion que
   dibuja las canchas. Si no hay datos, la columna no aparece.

   El armado del DOM es no destructivo: envuelve #armgrid en una caja de dos
   columnas y cuelga el <aside> al lado. No toca el render original ni los
   doble-click de video.                                                     */
(function () {
  'use strict';

  function T(s) { try { return (window.tr && window.tr(s)) || s; } catch (e) { return s; } }
  function $(id) { return document.getElementById(id); }

  /* ── el estilo, acotado a lo nuevo ────────────────────────────────────── */
  var CSS = [
    '.pp-dos{display:grid;grid-template-columns:minmax(0,1fr) 332px;gap:16px;align-items:start}',
    '.pp-dos>#armgrid{grid-column:1;grid-row:1;grid-template-columns:repeat(2,minmax(0,1fr))}',
    '.pp-dos>#pp-res{grid-column:2;grid-row:1}',
    '.pp-dos>#blqaviso{grid-column:1/-1}',
    '@media(max-width:1180px){.pp-dos{grid-template-columns:minmax(0,1fr)}',
    '  .pp-dos>#armgrid{grid-column:1/-1}.pp-dos>#pp-res{grid-column:1/-1;grid-row:auto}}',
    '#pp-res{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.pp-card{background:var(--card2,#000F1B);border:1px solid var(--border,#102935);',
    '  border-top-color:var(--border2,#1A3F52);border-radius:14px;padding:13px 14px 14px}',
    '.pp-h{font-family:var(--vsTit,inherit);font-size:11px;font-weight:700;letter-spacing:.16em;',
    '  text-transform:uppercase;color:var(--mut,#8FA8BE);margin:0 0 10px;display:flex;',
    '  align-items:center;gap:8px}',
    '.pp-h::before{content:"";width:3px;height:12px;border-radius:2px;background:var(--red,#FF0A4E);flex:0 0 auto}',
    '.pp-ring{display:flex;align-items:center;gap:14px}',
    '.pp-ring svg{flex:0 0 auto}',
    '.pp-ring .rl{min-width:0}',
    '.pp-ring .rl b{display:block;font-family:var(--vsTit,inherit);font-size:13px;font-weight:700;color:var(--txt,#EBF4F7);line-height:1.25}',
    '.pp-ring .rl i{display:block;font-style:normal;font-size:11px;color:var(--mut,#8FA8BE);line-height:1.5}',
    '.pp-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}',
    '.pp-kpis div{background:rgba(0,207,255,.045);border:1px solid var(--border,#102935);',
    '  border-radius:9px;padding:7px 6px;text-align:center}',
    '.pp-kpis b{display:block;font-family:var(--vsNum,inherit);font-size:17px;font-weight:700;color:var(--txt,#EBF4F7);line-height:1.1}',
    '.pp-kpis i{display:block;font-style:normal;font-size:9.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--mut,#8FA8BE);margin-top:2px}',
    '.pp-bar{margin:0 0 9px}',
    '.pp-bar:last-child{margin-bottom:0}',
    '.pp-bar .bl{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:4px}',
    '.pp-bar .bl span{font-size:11.5px;font-weight:600;color:var(--mut2,#B4D2E4);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pp-bar .bl b{font-family:var(--vsNum,inherit);font-size:11.5px;font-weight:700;color:var(--txt,#EBF4F7);flex:0 0 auto}',
    '.pp-bar .bt{height:7px;border-radius:4px;background:var(--h0,#171826);overflow:hidden}',
    '.pp-bar .bf{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--redd,#A8062F),var(--red,#FF0A4E));min-width:2px}',
    '.pp-keys{list-style:none;margin:0;padding:0}',
    '.pp-keys li{display:flex;flex-wrap:wrap;align-items:baseline;gap:5px;padding:7px 0;',
    '  border-bottom:1px solid rgba(16,41,53,.75);font-size:12px;line-height:1.5;color:var(--mut2,#B4D2E4)}',
    '.pp-keys li>*{margin:0}',
    '.pp-keys li .kl{color:var(--mut,#8FA8BE)}',
    '.pp-keys li .kl::after{content:":"}',
    '.pp-keys li em{font-style:normal;font-family:var(--vsNum,inherit);color:var(--mut2,#B4D2E4)}',
    '.pp-keys li:last-child{border-bottom:0;padding-bottom:0}',
    '.pp-keys li::before{content:"";flex:0 0 auto;width:5px;height:5px;align-self:center;border-radius:50%;background:var(--cyan,#00CFFF);margin-right:4px}',
    '.pp-keys li b{color:var(--txt,#EBF4F7);font-weight:700}',
    '.pp-keys li.warn::before{background:var(--amber,#E0A32F)}',
    '.pp-vacio{font-size:12px;color:var(--mut,#8FA8BE);padding:4px 0}'
  ].join('\n');

  function estilo() {
    if ($('pp-piel-css')) return;
    var s = document.createElement('style');
    s.id = 'pp-piel-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── el anillo ────────────────────────────────────────────────────────── */
  function anillo(pct, col) {
    var d = 86, r = 34, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return '<svg width="' + d + '" height="' + d + '" viewBox="0 0 ' + d + ' ' + d + '" aria-hidden="true">'
      + '<circle cx="43" cy="43" r="' + r + '" fill="none" stroke="rgba(23,24,38,.9)" stroke-width="8"/>'
      + '<circle cx="43" cy="43" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="8"'
      + ' stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '"'
      + ' stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 43 43)"/>'
      + '<text x="43" y="47" text-anchor="middle" font-size="21" font-weight="700"'
      + ' fill="#EBF4F7" font-family="var(--vsNum,sans-serif)">' + pct + '%</text></svg>';
  }

  /* ── los numeros: salen de armRallies(), igual que las canchas ────────── */
  function medir() {
    var Tm = window.armTeam;
    if (!Tm || !Tm.setters || !Tm.setters.length) return null;
    if (typeof window.armRallies !== 'function') return null;
    var st = Tm.setters[window.armSetIdx] || Tm.setters[0];
    if (!st) return null;
    /*  mismo recorte de partidos que hace renderArmador  */
    try {
      if (window.MSEL && window.MATCHES && MSEL.size < MATCHES.length) {
        st = Object.assign({}, st, {
          s: (st.s || []).filter(function (r) {
            var m = (Tm.matches || [])[r[12]];
            return m && MSEL.has(window.armMidDe(m));
          })
        });
      }
    } catch (e) {}

    var POS = [4, 3, 2, 5, 6, 1];
    var sin = [];
    try { sin = window.armRallies(st, 0); } catch (e) { sin = []; }
    if (sin.length) POS = POS.concat([0]);

    var tot = 0, pts = 0, zc = {}, zp = {}, cc = {}, porRot = [];
    var COMB = window.GP_COMBOS || [];
    POS.forEach(function (pos) {
      var rows;
      try { rows = window.armRallies(st, pos); } catch (e) { rows = []; }
      porRot.push({ pos: pos, n: rows.length });
      rows.forEach(function (r) {
        tot++;
        if (r[9] === 0) pts++;
        var z = 0;
        try { z = window.gpGetZone(COMB[r[8]] || '', r[11], r[6]); } catch (e) { z = 0; }
        if (z > 0) { zc[z] = (zc[z] || 0) + 1; if (r[9] === 0) zp[z] = (zp[z] || 0) + 1; }
        if (r[5] >= 0) cc[r[5]] = (cc[r[5]] || 0) + 1;
      });
    });
    if (!tot) return null;
    return { st: st, tot: tot, pts: pts, zc: zc, zp: zp, cc: cc, porRot: porRot };
  }

  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }

  function barras(m) {
    var CALLS = (window.GPL && window.GPL.calls) || [];
    var filas = [];
    var ks = Object.keys(m.cc);
    if (CALLS.length && ks.length) {
      filas = ks.map(function (k) {
        return { lb: CALLS[k] || ('K?' + k), n: m.cc[k] };
      });
    } else {
      filas = Object.keys(m.zc).map(function (z) { return { lb: 'Z' + z, n: m.zc[z] }; });
    }
    filas.sort(function (a, b) { return b.n - a.n; });
    filas = filas.slice(0, 6);
    var mx = filas.length ? filas[0].n : 1;
    return filas.map(function (f) {
      return '<div class="pp-bar"><div class="bl"><span>' + f.lb + '</span><b>'
        + pct(f.n, m.tot) + '% · ' + f.n + '</b></div>'
        + '<div class="bt"><div class="bf" style="width:' + Math.round(f.n / mx * 100) + '%"></div></div></div>';
    }).join('');
  }

  /*  Cada frase traducible va en su PROPIO <span>: el traductor de la app
      recorre los nodos de texto y solo reconoce el que es exactamente una
      entrada del diccionario. Mezclada con numeros en el mismo nodo
      —"53% de punto en 53 armados"— no la reconocia y quedaba en castellano. */
  function F(s) { return '<span>' + T(s) + '</span>'; }
  function K(s) { return '<span class="kl">' + T(s) + '</span>'; }
  function N(s) { return '<em>' + s + '</em>'; }

  function claves(m) {
    var L = [], CALLS = (window.GPL && window.GPL.calls) || [];
    var zs = Object.keys(m.zc).sort(function (a, b) { return m.zc[b] - m.zc[a]; });
    if (zs.length) {
      L.push(K('Zona más usada') + '<b>Z' + zs[0] + '</b>' + N('· ' + pct(m.zc[zs[0]], m.tot) + '%')
        + F('de los armados'));
    }
    /*  el mejor rendimiento solo se dice con muestra suficiente: con cuatro
        pelotas un 100% no significa nada.                                   */
    var mejores = zs.filter(function (z) { return m.zc[z] >= 8; })
      .sort(function (a, b) { return pct(m.zp[b] || 0, m.zc[b]) - pct(m.zp[a] || 0, m.zc[a]); });
    if (mejores.length) {
      var z = mejores[0];
      L.push(K('Más punto') + '<b>Z' + z + '</b>' + N('· ' + pct(m.zp[z] || 0, m.zc[z]) + '%')
        + F('de punto en') + N(m.zc[z]) + F('armados'));
    }
    var rot = m.porRot.filter(function (r) { return r.pos > 0; })
      .sort(function (a, b) { return b.n - a.n; })[0];
    if (rot && rot.n) {
      L.push(K('Rotación más cargada') + '<b>P' + rot.pos + '</b>' + N('· ' + rot.n) + F('armados'));
    }
    var ks = Object.keys(m.cc).sort(function (a, b) { return m.cc[b] - m.cc[a]; });
    if (CALLS.length && ks.length) {
      L.push(K('Llamada más usada') + '<b>' + (CALLS[ks[0]] || ('K?' + ks[0])) + '</b>'
        + N('· ' + pct(m.cc[ks[0]], m.tot) + '%'));
    }
    var html = L.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    if (m.tot < 40) {
      html += '<li class="warn">' + F('Muestra chica') + N('(' + m.tot + ')') + '<em>—</em>'
        + F('tomar los porcentajes con cuidado') + '</li>';
    }
    return html || '<div class="pp-vacio">' + F('Sin datos para este filtro') + '.</div>';
  }

  /* ── el armado del DOM, una sola vez ──────────────────────────────────── */
  function caja() {
    var grid = $('armgrid');
    if (!grid) return null;
    var box = $('pp-dos');
    if (!box) {
      box = document.createElement('div');
      box.id = 'pp-dos'; box.className = 'pp-dos';
      grid.parentNode.insertBefore(box, grid);
      box.appendChild(grid);
    }
    var res = $('pp-res');
    if (!res) {
      res = document.createElement('aside');
      res.id = 'pp-res';
      box.appendChild(res);
    }
    return res;
  }

  function pintar() {
    estilo();
    var sec = $('armsec');
    var res = caja();
    if (!res) return;
    if (sec && sec.classList.contains('hidden')) { res.style.display = 'none'; return; }
    var m = medir();
    if (!m) { res.style.display = 'none'; return; }
    res.style.display = '';

    var kp = pct(m.pts, m.tot);
    var col = kp >= 45 ? 'var(--green,#2BBF72)' : (kp >= 33 ? 'var(--red,#FF0A4E)' : 'var(--amber,#E0A32F)');
    var nRot = m.porRot.filter(function (r) { return r.pos > 0 && r.n; }).length;
    var nom = '';
    try { nom = window.apeArm ? window.apeArm(m.st.name) : (m.st.name || ''); } catch (e) { nom = m.st.name || ''; }

    res.innerHTML =
      '<div class="pp-card"><div class="pp-h">' + T('Resumen general') + '</div>'
      + '<div class="pp-ring">' + anillo(kp, col)
      + '<div class="rl"><b>' + nom + '</b>'
      + '<i>' + T('punto directo sobre lo armado') + '</i>'
      + '<i>' + T('con el filtro de arriba') + '</i></div></div>'
      + '<div class="pp-kpis">'
      + '<div><b>' + m.tot + '</b><i>' + T('armados') + '</i></div>'
      + '<div><b>' + m.pts + '</b><i>' + T('puntos') + '</i></div>'
      + '<div><b>' + nRot + '</b><i>' + T('rotaciones') + '</i></div>'
      + '</div></div>'
      + '<div class="pp-card"><div class="pp-h">' + T('Tipos de distribución') + '</div>'
      + (barras(m) || '<div class="pp-vacio">' + T('Sin datos para este filtro') + '.</div>') + '</div>'
      + '<div class="pp-card"><div class="pp-h">' + T('Claves del armador') + '</div>'
      + '<ul class="pp-keys">' + claves(m) + '</ul></div>';
  }

  /* ── engancharse al render original sin reemplazarlo ──────────────────── */
  function enganchar() {
    if (typeof window.renderArmador !== 'function' || window.renderArmador.__pp) return false;
    var orig = window.renderArmador;
    var nuevo = function () {
      var r = orig.apply(this, arguments);
      try { pintar(); } catch (e) {}
      return r;
    };
    nuevo.__pp = true;
    window.renderArmador = nuevo;
    return true;
  }

  function arrancar() {
    estilo();
    if (!enganchar()) {
      var i = 0, t = setInterval(function () {
        if (enganchar() || ++i > 60) clearInterval(t);
      }, 250);
    }
    try { if (typeof window.renderArmador === 'function' && $('armgrid')) window.renderArmador(); } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
  /*  los datos cifrados llegan despues: el mismo aviso que usa la pagina  */
  try { window.addEventListener('datos-listos', function () { setTimeout(pintar, 120); }); } catch (e) {}
})();
