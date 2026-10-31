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

  /*  LA PANTALLA, COMO LA MAQUETA
      Estas reglas viven aca y no en vs_piel.css porque plan_partido.html no
      carga esa hoja: se inyectan con la misma etiqueta <style> que ya usaba
      el resumen del armador, asi no hace falta tocar la pagina.          */
  var CSS2 = `/*  6d · DETALLE POR ACCIONES (PLAN DE PARTIDO), SOBRE LA MAQUETA
      chip de volver .. 177 x 25, borde cian, letra chica espaciada
      titulo .......... alto de letra 33 px, la ultima palabra en rojo,
                        con el galon rojo inclinado a la izquierda
      bajada .......... 13 px, muy espaciada, en cian apagado
      lema ............ tres renglones a la derecha, arriba del chip rojo
      filtros ......... cada uno en su caja: rotulo chico arriba y el
                        control abajo, con borde; "Filtrar" en rojo
      pestanas ........ una sola barra con rayas finas entre las solapas,
                        la abierta con el relleno rojo                     */
html:not([data-vs="off"]) body.pp-p .masthead{
  display:flex!important;align-items:flex-start!important;gap:20px!important;
  padding:16px 24px 18px 30px!important;margin:0 0 12px!important;
  border:1px solid var(--p-borde)!important;border-radius:14px!important;
  border-bottom:1px solid var(--p-borde)!important;
  min-height:128px!important;position:relative!important;overflow:hidden!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-izq{
  flex:1 1 auto!important;min-width:0!important;position:relative!important;z-index:2!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-der{
  order:9!important;margin-left:auto!important;position:relative!important;z-index:2!important;
  display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:12px!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-volver{
  display:inline-flex!important;align-items:center!important;gap:9px!important;
  height:25px!important;padding:0 13px!important;margin:0 0 11px!important;
  border:1px solid var(--p-borde2)!important;border-radius:7px!important;
  background:rgba(0,16,26,.72)!important;color:#9FD2E2!important;
  font:600 11.5px/1 var(--vsUI)!important;letter-spacing:.14em!important;
  text-transform:uppercase!important;text-decoration:none!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-volver:hover{
  border-color:var(--p-cyan)!important;color:#FFFFFF!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-h1{
  position:relative!important;padding-left:26px!important;
  font:700 46px/1 var(--vsTit)!important;letter-spacing:.012em!important;
  color:#FFFFFF!important;margin:0 0 9px!important;text-transform:uppercase!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-h1 .rj{color:var(--red)!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-h1::before{
  content:''!important;position:absolute!important;left:0!important;top:4px!important;
  width:7px!important;height:36px!important;transform:skewX(-14deg)!important;
  background:linear-gradient(180deg,#FF1744,#B8002D)!important;
  box-shadow:0 0 14px -2px rgba(255,23,68,.75)!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-baja{
  padding-left:26px!important;
  font:600 13px/1 var(--vsUI)!important;letter-spacing:.17em!important;
  text-transform:uppercase!important;color:#6FAFC8!important;margin:0 0 7px!important}
html:not([data-vs="off"]) body.pp-p .masthead .sub{
  padding-left:26px!important;font:400 12.5px/1 var(--vsUI)!important;
  color:#8FA9BA!important;margin:0!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-lema{
  display:flex!important;flex-direction:column!important;align-items:flex-end!important;
  gap:4px!important;text-align:right!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-lema span{
  font:600 11.5px/1 var(--vsUI)!important;letter-spacing:.21em!important;
  text-transform:uppercase!important;color:#9FD2E2!important}
html:not([data-vs="off"]) body.pp-p .masthead .pp-lema span:nth-child(2){color:#00D9F5!important}
html:not([data-vs="off"]) body.pp-p .masthead .leyenda{margin:0!important}
html:not([data-vs="off"]) body.pp-p .masthead .leyenda > summary{
  display:inline-flex!important;align-items:center!important;
  height:25px!important;padding:0 14px!important;list-style:none!important;
  border:1px solid var(--red)!important;border-radius:6px!important;
  background:rgba(255,23,68,.08)!important;color:#FF5C7A!important;
  font:700 11px/1 var(--vsUI)!important;letter-spacing:.14em!important;
  text-transform:uppercase!important;cursor:pointer!important}
html:not([data-vs="off"]) body.pp-p .masthead .leyenda > summary::-webkit-details-marker{display:none!important}

/*  la barra de filtros  */
html:not([data-vs="off"]) body.pp-p .matchbar{
  display:flex!important;align-items:flex-end!important;gap:17px!important;
  flex-wrap:wrap!important;padding:13px 20px 15px!important;margin:0 0 12px!important;
  border:1px solid var(--p-borde)!important;border-radius:12px!important;
  background:linear-gradient(180deg,#000D18,#00070F)!important}
html:not([data-vs="off"]) body.pp-p .matchbar .pp-campo{
  display:flex!important;flex-direction:column!important;gap:6px!important;
  min-width:0!important}
html:not([data-vs="off"]) body.pp-p .matchbar .pp-ctrls{
  display:flex!important;align-items:center!important;gap:9px!important;
  flex-wrap:nowrap!important}
html:not([data-vs="off"]) body.pp-p .matchbar .mlab{
  font:600 10.5px/1 var(--vsUI)!important;letter-spacing:.17em!important;
  text-transform:uppercase!important;color:#6FA3BB!important;margin:0!important}
html:not([data-vs="off"]) body.pp-p .matchbar .pp-ctrls > *{
  height:40px!important;min-height:40px!important;margin:0!important;
  padding:0 13px!important;box-sizing:border-box!important;
  border:1px solid var(--p-borde2)!important;border-radius:8px!important;
  background:var(--p-hueco)!important;color:#EAF4FA!important;
  font:500 13.5px/38px var(--vsUI)!important;display:inline-flex!important;
  align-items:center!important}
html:not([data-vs="off"]) body.pp-p .matchbar .pp-hint{
  margin-left:auto!important;align-self:center!important;
  font:500 12.5px/1 var(--vsUI)!important;color:#8FA9BA!important}

/*  las pestanas: una barra sola con rayas finas  */
html:not([data-vs="off"]) body.pp-p #tabsbar{
  display:flex!important;align-items:center!important;gap:0!important;
  padding:0!important;margin:0 0 14px!important;
  border:1px solid var(--p-borde)!important;border-radius:11px!important;
  background:linear-gradient(180deg,#000D18,#00070F)!important;overflow:hidden!important}
html:not([data-vs="off"]) body.pp-p #tabsbar .ptab{
  flex:1 1 0!important;min-width:0!important;
  display:flex!important;align-items:center!important;justify-content:center!important;
  gap:11px!important;height:45px!important;padding:0 10px!important;margin:0!important;
  border:0!important;border-left:1px solid rgba(0,217,245,.20)!important;
  border-radius:0!important;background:transparent!important;
  color:#BBD7E6!important;font:600 12.5px/1 var(--vsUI)!important;
  letter-spacing:.055em!important;text-transform:uppercase!important;
  white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
  box-shadow:none!important;cursor:pointer!important}
html:not([data-vs="off"]) body.pp-p #tabsbar .ptab:first-of-type{border-left:0!important}
html:not([data-vs="off"]) body.pp-p #tabsbar .ptab .pp-ti{
  flex:0 0 20px!important;display:flex!important;align-items:center!important}
html:not([data-vs="off"]) body.pp-p #tabsbar .ptab .pp-ti svg{
  width:20px!important;height:20px!important;stroke:currentColor!important;
  color:currentColor!important;stroke-width:1.6!important}
html:not([data-vs="off"]) body.pp-p #tabsbar .ptab.active,
html:not([data-vs="off"]) body.pp-p #tabsbar .ptab.on{
  background:linear-gradient(180deg,#FF0A3C,#B00428)!important;color:#FFFFFF!important;
  border-left-color:transparent!important;
  box-shadow:0 0 26px -10px rgba(255,10,60,.9)!important}
html:not([data-vs="off"]) body.pp-p #tabsbar #tabteam,
html:not([data-vs="off"]) body.pp-p #tabsbar #focusSel{
  flex:0 0 auto!important;height:45px!important;margin:0!important;
  border:0!important;border-right:1px solid rgba(0,217,245,.20)!important;
  border-radius:0!important;background:transparent!important}`;

  function estilo() {
    if ($('pp-piel-css')) return;
    var s = document.createElement('style');
    s.id = 'pp-piel-css'; s.textContent = CSS + '\n' + CSS2;
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


  /* ══ LA BANDA, LOS CAMPOS Y LAS PESTANAS, COMO LA MAQUETA ══════════════
     No se reescribe la pantalla: se toman los mismos nodos que ya existen
     —el encabezado, los filtros y las pestanas— y se los acomoda en las
     cajas de la maqueta. Si algo no esta, se saltea y la pantalla queda
     como estaba.                                                          */
  /*  esta pantalla no carga vs_piel.js, asi que los dibujos viajan aca.
      Son los MISMOS trazados que usa iconos.js en el resto de la app.   */
  var DIB = {
    armado:   '<circle cx="12" cy="6.6" r="3.4"/><path d="m5.4 20.4 3.4-5.2M18.6 20.4l-3.4-5.2"/><path d="m8.8 15.2 3.2-2 3.2 2"/>',
    rayo:     '<path d="M13.4 2.5 5.6 13.2h5.3l-.9 8.3 8.2-10.9h-5.4l.6-8.1Z"/>',
    diana:    '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    personas: '<circle cx="9.2" cy="8.2" r="3.2"/><path d="M2.8 20c.6-3.4 3.2-5.6 6.4-5.6s5.8 2.2 6.4 5.6"/><path d="M16.2 5.4a3.2 3.2 0 0 1 0 6.2"/><path d="M17.4 14.8c2.1.6 3.5 2.4 3.9 5.2"/>',
    escudo:   '<path d="M12 3.2 5 6v5.6c0 4.2 2.8 7.5 7 9.2 4.2-1.7 7-5 7-9.2V6l-7-2.8Z"/>',
    barras:   '<path d="M4 20h16"/><rect x="5.5" y="11" width="3.4" height="6"/><rect x="10.3" y="7" width="3.4" height="10"/><rect x="15.1" y="13.5" width="3.4" height="3.5"/>',
    persona:  '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.4c.6-3.8 3.6-6.2 7.2-6.2s6.6 2.4 7.2 6.2"/>'
  };
  function icoP(n) {
    var d = DIB[n] || DIB.diana;
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"' +
           ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  }

  /*  el titulo de la maqueta es el de la pestana abierta  */
  function tituloActivo() {
    var a = document.querySelector('#tabsbar .ptab.active, #tabsbar .ptab.on');
    var t = a ? (a.textContent || '').trim() : '';
    return t || T('Plan de partido');
  }
  function pintarTitulo() {
    var h = document.querySelector('.masthead .pp-h1'); if (!h) return;
    var t = tituloActivo().toUpperCase();
    /*  la ultima palabra va en rojo, como en la maqueta  */
    var i = t.lastIndexOf(' ');
    h.innerHTML = '';
    var b1 = document.createElement('span');
    b1.textContent = i > 0 ? t.slice(0, i + 1) : t;
    h.appendChild(b1);
    if (i > 0) {
      var b2 = document.createElement('span');
      b2.className = 'rj'; b2.textContent = t.slice(i + 1);
      h.appendChild(b2);
    }
  }

  function banda() {
    var m = document.querySelector('.masthead');
    if (!m || m.dataset.pp === '1') return;
    m.dataset.pp = '1';
    var h1 = m.querySelector('h1');
    var sub = m.querySelector('.sub');
    var ley = m.querySelector('.leyenda');

    var izq = document.createElement('div'); izq.className = 'pp-izq';
    var chip = document.createElement('a');
    chip.className = 'pp-volver'; chip.href = 'index.html';
    chip.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:14px;height:14px;' +
      'stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round">' +
      '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/></svg><span>' + T('Plan de partido') + '</span>';
    izq.appendChild(chip);
    var tit = document.createElement('div'); tit.className = 'pp-h1';
    izq.appendChild(tit);
    var baj = document.createElement('div'); baj.className = 'pp-baja';
    baj.textContent = T('Distribución') + ' · ' + T('Direcciones') + ' · ' +
                      T('Zonas') + ' · ' + T('Bloqueo');
    izq.appendChild(baj);
    if (sub) izq.appendChild(sub);

    var der = document.createElement('div'); der.className = 'pp-der';
    var lema = document.createElement('div'); lema.className = 'pp-lema';
    lema.innerHTML = '<span>' + T('Analizar') + '</span><span>' + T('Planificar') +
                     '</span><span>' + T('Competir') + '</span>';
    der.appendChild(lema);
    if (ley) der.appendChild(ley);

    if (h1) h1.remove();
    var eb = m.querySelector('.eyebrow'); if (eb) eb.remove();
    m.insertBefore(der, m.firstChild);
    m.insertBefore(izq, m.firstChild);
    pintarTitulo();
  }

  /*  cada filtro en su caja, con el rotulo arriba  */
  function campos() {
    var bar = document.querySelector('.matchbar');
    if (!bar || bar.dataset.pp === '1') return;
    bar.dataset.pp = '1';
    var hijos = [].slice.call(bar.children);
    var caja = null;
    hijos.forEach(function (e) {
      if (e.classList && e.classList.contains('mlab')) {
        caja = document.createElement('div'); caja.className = 'pp-campo';
        bar.insertBefore(caja, e);
        caja.appendChild(e);
        var fila = document.createElement('div'); fila.className = 'pp-ctrls';
        caja.appendChild(fila);
        caja = fila;
        return;
      }
      if (e.id === 'mhint') { e.classList.add('pp-hint'); caja = null; return; }
      if (caja) caja.appendChild(e);
    });
  }

  /*  un icono para cada pestana, como en la maqueta  */
  var ICOTAB = [
    [/armador|setter|zuspiel/i, 'armado'],
    [/ataque|attack|angriff/i,  'rayo'],
    [/saque|serve|aufschlag/i,  'diana'],
    [/recep/i,                  'personas'],
    [/defensa|defen/i,          'escudo'],
    [/bloqueo|block/i,          'barras'],
    [/jugador|player|spieler/i, 'persona']
  ];
  var ICOTAB_DEF = 'diana';
  function pestanas() {
    var barra = $('tabsbar'); if (!barra) return;
    [].forEach.call(barra.querySelectorAll('.ptab'), function (b) {
      if (b.dataset.pp === '1') return;
      b.dataset.pp = '1';
      var t = (b.textContent || '').trim();
      var n = ICOTAB_DEF;
      for (var i = 0; i < ICOTAB.length; i++) { if (ICOTAB[i][0].test(t)) { n = ICOTAB[i][1]; break; } }
      var sp = document.createElement('span'); sp.className = 'pp-ti';
      sp.innerHTML = icoP(n);
      b.insertBefore(sp, b.firstChild);
    });
    if (!barra.dataset.pp) {
      barra.dataset.pp = '1';
      barra.addEventListener('click', function () { setTimeout(pintarTitulo, 60); });
    }
  }

  function vestir() {
    try { document.body.classList.add('pp-p'); } catch (e) {}
    try { banda(); } catch (e) {}
    try { campos(); } catch (e) {}
    try { pestanas(); } catch (e) {}
    try { pintarTitulo(); } catch (e) {}
  }

  function arrancar() {
    estilo();
    vestir();
    var v = 0, tv = setInterval(function () { vestir(); if (++v > 24) clearInterval(tv); }, 350);
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

/* ══════════════════════════════════════════════════════════════════════════
   PLAN DE PARTIDO · LA CANCHA EN PERSPECTIVA  (maquetas 4 y 5)

   Hasta ahora cada rotacion y cada jugador mostraban sus nueve zonas como
   nueve cuadraditos planos. La maqueta las muestra sobre una cancha vista
   desde atras: trapecio en perspectiva, la red arriba con las dos antenas,
   la linea de ataque, y el calor de cada zona pintado adentro del dibujo.

   Esto NO vuelve a calcular nada. Agarra las mismas nueve celdas que ya
   dibujo la pagina —con su color de calor, su numero y su doble-clic de
   video— y las recorta con clip-path sobre el trapecio. El dato es el mismo;
   cambia donde se apoya.

   La flecha de cada zona mide lo que dice el numero: largo proporcional al
   porcentaje que ya esta escrito en la celda. No hay ningun dato nuevo.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /*  LA FORMA DEL TRAPECIO, MEDIDA SOBRE LA MAQUETA
      En 4_armador.png la cancha de una ficha va de x215 a x416 abajo y de
      x233 a x393 arriba: 160/201 = .796 de ancho arriba. Alto 135 sobre
      201 de ancho = .67. La linea de ataque cae a .467 del alto.          */
  var ARRIBA = 0.796;          /* ancho del borde de arriba (red) */
  /*  DOS CANCHAS DISTINTAS, COMO CORRESPONDE
      El armador reparte a SEIS puestos: tres adelante (4-3-2) y tres
      atras (5-6-1). Las zonas 7-8-9 del scout son esos mismos tres de
      atras, mas profundos: 7 con 5, 8 con 6, 9 con 1. Por eso la cancha
      del armador tiene seis cuadrantes y se suman los pares.
      Donde CAE la pelota -ataque, saque, recepcion, defensa, bloqueo- si
      son nueve zonas de verdad, y esas canchas van de a nueve.          */
  var FILAS9 = [0, 0.30, 0.60, 1];
  var FILAS6 = [0, 0.44, 1];
  var FILAS  = FILAS9;
  /*  en orden ARMZ (4,3,2,7,8,9,5,6,1): que celda se come a cual        */
  var PARES = [[3, 6], [4, 7], [5, 8]];

  function pt(fy, fx) {                 /* fx 0..1 de izquierda a derecha  */
    var w = ARRIBA + (1 - ARRIBA) * fy;
    return [(0.5 - w / 2 + fx * w) * 100, fy * 100];
  }
  function poli(f, c, F) {              /* fila f, columna c (0..2)        */
    F = F || FILAS;
    var y0 = F[f], y1 = F[f + 1];
    var a = pt(y0, c / 3), b = pt(y0, (c + 1) / 3),
        d = pt(y1, (c + 1) / 3), e = pt(y1, c / 3);
    return [a, b, d, e];
  }
  function centro(p) {
    var x = 0, y = 0; p.forEach(function (q) { x += q[0]; y += q[1]; });
    return [x / 4, y / 4];
  }
  function clip(p) {
    return 'polygon(' + p.map(function (q) {
      return q[0].toFixed(2) + '% ' + q[1].toFixed(2) + '%';
    }).join(',') + ')';
  }

  /*  EL DIBUJO DE ATRAS: red, antenas, lineas y el resplandor rojo         */
  function svgFondo() {
    var P = function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); };
    var cuatro = P(pt(0,0)) + ' ' + P(pt(0,1)) + ' ' + P(pt(1,1)) + ' ' + P(pt(1,0));
    return '<svg class="pp-cv" viewBox="0 0 100 100" preserveAspectRatio="none">'
      + '<defs><radialGradient id="ppG" cx="50%" cy="-4%" r="86%">'
      + '<stop offset="0" stop-color="#FF2B5E" stop-opacity=".52"/>'
      + '<stop offset=".38" stop-color="#C0003A" stop-opacity=".20"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
      + '<polygon points="' + cuatro + '" fill="#01080F"/>'
      + '<polygon points="' + cuatro + '" fill="url(#ppG)"/>'
      + '</svg>';
  }

  function svgFrente(F) {
    var P = function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); };
    var cuatro = P(pt(0,0)) + ' ' + P(pt(0,1)) + ' ' + P(pt(1,1)) + ' ' + P(pt(1,0));
    var s = '<svg class="pp-cv" viewBox="0 0 100 100" preserveAspectRatio="none">'
      + '<defs><linearGradient id="ppD" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#FF4D73" stop-opacity=".92"/>'
      + '<stop offset="1" stop-color="#FF2B5E" stop-opacity=".22"/></linearGradient></defs>';
    [1, 2].forEach(function (c) {
      s += '<line x1="' + pt(0, c/3)[0].toFixed(2) + '" y1="0" x2="' + pt(1, c/3)[0].toFixed(2)
         + '" y2="100" stroke="url(#ppD)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>';
    });
    for (var f = 1; f < F.length - 1; f++) {
      s += '<line x1="' + pt(F[f], 0)[0].toFixed(2) + '" y1="' + (F[f]*100).toFixed(2)
         + '" x2="' + pt(F[f], 1)[0].toFixed(2) + '" y2="' + (F[f]*100).toFixed(2)
         + '" stroke="#DCEFFA" stroke-opacity="' + (f > 1 ? '.30' : '.62')
         + '" stroke-width="1.1" vector-effect="non-scaling-stroke"/>';
    }
    s += '<polygon points="' + cuatro + '" fill="none" stroke="#EAF7FF" stroke-opacity=".92"'
       + ' stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>';
    var x0 = pt(0, 0)[0], x1 = pt(0, 1)[0];
    s += '<i class="pp-red" style="left:' + x0.toFixed(2) + '%;width:' + (x1 - x0).toFixed(2) + '%"></i>'
       + '<i class="pp-ant" style="left:' + x0.toFixed(2) + '%"></i>'
       + '<i class="pp-ant" style="left:' + x1.toFixed(2) + '%"></i>';
    return s;
  }

  /*  JUNTA DOS ZONAS EN UNA SOLA CELDA
      7 con 5, 8 con 6, 9 con 1: es el mismo puesto de atras, mas o menos
      profundo. Manda la que tiene mas acciones -se queda con su doble-clic
      de video- y se le suman las del par. Si la otra tambien tiene, el
      titulo lo aclara: no se esconde nada.                              */
  function juntar(a, b) {
    var na = contar(a), nb = contar(b);
    var jefe = nb > na ? b : a, otro = nb > na ? a : b;
    var nj = Math.max(na, nb), no = Math.min(na, nb), tot = na + nb;
    if (!tot) { otro.style.display = 'none'; return jefe; }
    var pa = porc(a), pb = porc(b), ka = punto(a), kb = punto(b);
    var n = jefe.querySelector('.cn-n'), p = jefe.querySelector('.cn-p');
    if (!n) {                                   /* el jefe venia vacio    */
      jefe.innerHTML = otro.innerHTML;
      n = jefe.querySelector('.cn-n'); p = jefe.querySelector('.cn-p');
    }
    if (n) n.textContent = tot;
    if (p) p.textContent = (pa + pb) + '% · '
      + Math.round((ka * na + kb * nb) / (tot || 1)) + '%';
    jefe.title = (no > 0)
      ? 'Suma de las dos zonas de atrás de esta columna (' + tot
        + ' en total). El video abre la de ' + nj + '.'
      : '';
    otro.style.display = 'none';
    return jefe;
  }
  function contar(c) { var e = c.querySelector('.cn-n'); return e ? (parseInt(e.textContent, 10) || 0) : 0; }
  function porc(c)   { var e = c.querySelector('.cn-p'), m = e && e.textContent.match(/(\d+)\s*%/); return m ? +m[1] : 0; }
  function punto(c)  { var e = c.querySelector('.cn-p'), m = e && e.textContent.match(/·\s*(\d+)\s*%/); return m ? +m[1] : 0; }

  /*  CONVIERTE LA GRILLA EN LA CANCHA  (seis o nueve cuadrantes)        */
  function cancha(g, seis) {
    if (!g || g.dataset.ppc === '1') return;
    var cel = [].slice.call(g.children).filter(function (e) {
      return /(^|\s)cell(\s|$)/.test(e.className || '');
    });
    if (cel.length !== 9) return;
    g.dataset.ppc = '1';
    g.classList.add('pp-ch');
    if (seis) g.classList.add('pp-ch6');
    var F = seis ? FILAS6 : FILAS9;
    var bg = document.createElement('div');
    bg.className = 'pp-bg'; bg.innerHTML = svgFondo();
    g.insertBefore(bg, g.firstChild);

    var vivas;
    if (seis) {
      vivas = [cel[0], cel[1], cel[2]];
      PARES.forEach(function (par) { vivas.push(juntar(cel[par[0]], cel[par[1]])); });
    } else {
      vivas = cel;
    }

    var flechas = [];
    vivas.forEach(function (c, i) {
      var f = Math.floor(i / 3), col = i % 3;
      var p = poli(f, col, F), ce = centro(p);
      var fondoViejo = c.style.background || '';
      c.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;'
        + 'clip-path:' + clip(p) + ';-webkit-clip-path:' + clip(p) + ';'
        + 'background:' + flojo(fondoViejo) + ';border:0;border-radius:0;'
        + 'min-width:0;padding:0;margin:0';
      var hijos = [].slice.call(c.children);
      if (hijos.length) {
        var lab = document.createElement('span');
        lab.className = 'pp-lab';
        lab.style.left = ce[0].toFixed(2) + '%';
        lab.style.top  = ce[1].toFixed(2) + '%';
        hijos.forEach(function (h) { lab.appendChild(h); });
        c.appendChild(lab);
        var txt = (lab.textContent || '').match(/(\d+)\s*%/);
        var pct = txt ? +txt[1] : 0;
        /*  el largo se corta dentro de su propia fila: una flecha que se
            sale de la zona apunta a otra zona y miente.                  */
        var alto = (F[f + 1] - F[f]) * 100 * 0.46;
        if (pct > 0) flechas.push([ce[0], ce[1], pct, alto]);
      }
    });
    var fg = document.createElement('div');
    fg.className = 'pp-fg';
    fg.innerHTML = svgFrente(F) + flechas.map(function (f) {
      return '<i class="pp-fl" style="left:' + f[0].toFixed(2) + '%;top:' + (f[1] - 2.2).toFixed(2)
        + '%;height:' + Math.min(f[3], 3.5 + f[2] * 0.40).toFixed(1) + '%;opacity:'
        + Math.min(.95, .34 + f[2] / 42).toFixed(2) + '"></i>';
    }).join('');
    g.appendChild(fg);
  }

  /*  EL CALOR, MAS FLOJO
      La maqueta pinta la cancha casi a oscuras y deja que mande el rojo de
      la red. El color por zona que ya usaba la pagina sigue estando -asi se
      reconoce de que zona se habla- pero a menos de la mitad de fuerza.    */
  function flojo(bg) {
    if (!bg) return 'transparent';
    /*  Sobre la cancha la zona ya se reconoce por DONDE esta: el arcoiris
        de nueve colores era para una grilla suelta, aca sobra y pelea con
        el rojo de la maqueta. Queda una sola escala roja, con la misma
        fuerza que traia cada celda.                                      */
    var m = bg.match(/rgba\([^)]*?,\s*([0-9.]+)\)/);
    if (!m) return 'transparent';
    var a = Math.min(0.30, (+m[1]) * 0.40);
    return 'rgba(255,43,94,' + a.toFixed(3) + ')';
  }

  /*  LOS NUMEROS AL COSTADO DE LA CANCHA
      Los dos salen de las mismas celdas que estan dibujadas: la suma de
      acciones y el % de punto pesado por esas acciones. Nada nuevo.      */
  function lado(g) {
    var card = g.closest ? g.closest('.armrot') : null;
    if (!card || card.dataset.ppl === '1') return;
    card.dataset.ppl = '1';
    var tot = 0, pun = 0, cab = card.querySelector('.rt span'), rot = null;
    if (cab) {
      var mm = (cab.textContent || '').trim().match(/^(\d+)\s+\S+$/);
      if (mm) { rot = +mm[1]; cab.style.display = 'none'; }
    }
    [].forEach.call(g.querySelectorAll('.pp-lab'), function (l) {
      var n = (l.querySelector('.cn-n') || {}).textContent;
      var p = (l.querySelector('.cn-p') || {}).textContent || '';
      var v = parseInt(n, 10); if (!(v > 0)) return;
      var m = p.match(/·\s*(\d+)\s*%/);
      tot += v; if (m) pun += v * (+m[1]) / 100;
    });
    if (!tot) return;
    var env = document.createElement('div'); env.className = 'pp-cw';
    g.parentNode.insertBefore(env, g); env.appendChild(g);
    var d = document.createElement('div'); d.className = 'pp-lado';
    d.innerHTML = '<div><u data-t="Armados">Armados</u><b>' + (rot != null ? rot : tot) + '</b></div>'
                + '<div><u data-t="% de punto">% de punto</u><b>'
                + Math.round(pun / tot * 100) + '%</b></div>';
    env.appendChild(d);
  }

  function canchas() {
    [].forEach.call(document.querySelectorAll('.armcourt'), function (g) {
      try { cancha(g, true); lado(g); } catch (e) {}
    });
    [].forEach.call(document.querySelectorAll('.courtbox .court'), function (g) {
      try { cancha(g, false); } catch (e) {}
    });
  }

  /* ── EL ESTILO ──────────────────────────────────────────────────────── */
  var CSS = [
    '.pp-ch{position:relative!important;display:block!important;width:100%;',
    '  aspect-ratio:200/152;padding:0!important;gap:0!important;overflow:visible}',
    '.pp-ch6{aspect-ratio:201/135}',
    '.pp-bg,.pp-fg{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none}',
    '.pp-fg{z-index:4}',
    /*  la ficha: cancha a la izquierda, numeros a la derecha              */
    '.pp-cw{display:flex;align-items:stretch;gap:9px;margin-top:6px}',
    '.pp-cw>.pp-ch{flex:1 1 auto;min-width:0}',
    '.pp-lado{position:relative;flex:0 0 66px;display:flex;flex-direction:column;',
    '  justify-content:center;gap:10px;padding-left:10px}',
    '.pp-lado::before{content:"";position:absolute;left:0;top:6%;bottom:6%;width:1.5px;border-radius:1px;',
    '  background:linear-gradient(180deg,rgba(255,43,94,0),#FF2B5E 22%,#FF2B5E 78%,rgba(255,43,94,0))}',
    '.pp-lado u{display:block;font-style:normal;text-decoration:none;font-size:10.5px;',
    '  font-weight:600;color:#6FD8F0;line-height:1.2;letter-spacing:.01em}',
    '.pp-lado b{display:block;font-family:var(--vsNum,inherit);font-size:17px;font-weight:700;',
    '  color:#EEF7FB;line-height:1.15;margin-top:1px}',
    '.pp-cv{position:absolute;left:0;top:0;width:100%;height:100%;display:block}',
    '.pp-red{position:absolute;top:0;height:7.5px;transform:translateY(-4px);',
    '  background:repeating-linear-gradient(90deg,rgba(220,243,253,.48) 0 1px,transparent 1px 3.6px),',
    '    repeating-linear-gradient(0deg,rgba(220,243,253,.26) 0 1px,transparent 1px 3.6px),',
    '    linear-gradient(180deg,rgba(214,240,252,.30),rgba(214,240,252,.06));',
    '  border-top:2px solid rgba(232,249,255,.95);pointer-events:none}',
    '.pp-ant{position:absolute;top:0;width:3.4px;height:17px;transform:translate(-1.7px,-11px);',
    '  background:linear-gradient(180deg,#A6F2FF,#00C4F0);border-radius:2px;',
    '  box-shadow:0 0 9px rgba(0,208,246,.85);pointer-events:none}',
    '.pp-ch .cell{box-shadow:none!important}',
    '.pp-ch .cell::after{content:"";position:absolute;inset:0;pointer-events:none;',
    '  background:linear-gradient(180deg,rgba(255,255,255,.025),transparent 55%)}',
    '.pp-lab{position:absolute;transform:translate(-50%,-50%);display:flex;',
    '  flex-direction:column;align-items:center;justify-content:center;line-height:1.05;',
    '  white-space:nowrap;pointer-events:none;z-index:3;text-shadow:0 1px 3px rgba(0,0,0,.85)}',
    '.pp-ch .cn-n{font-family:var(--vsNum,inherit);font-size:17px;font-weight:700;line-height:1.02}',
    '.pp-ch .cn-p{font-size:10px;font-weight:600;opacity:.92;letter-spacing:.02em}',
    /*  las canchas de nueve usan .zn (el rotulo de zona) y .cn (el numero) */
    '.pp-ch .zn{font-size:9.5px;font-weight:700;letter-spacing:.06em;opacity:.78;line-height:1.1}',
    '.pp-ch .cn{font-family:var(--vsNum,inherit);font-size:16px;font-weight:700;line-height:1.08}',
    '.pp-fl{position:absolute;width:0;transform:translate(-50%,-100%);pointer-events:none;z-index:2;',
    '  border-left:1.6px solid #FF2B5E;filter:drop-shadow(0 0 4px rgba(255,43,94,.6))}',
    '.pp-fl::before{content:"";position:absolute;left:-4.2px;top:-1px;border:4px solid transparent;',
    '  border-bottom-color:#FF4D73;border-top:0}',
    /*  la ficha de rotacion, con su chapita numerada como la maqueta      */
    '.pp-p .armrot .rt{align-items:center}',
    '.pp-nb{flex:0 0 auto;width:21px;height:21px;border-radius:50%;display:inline-flex;',
    '  align-items:center;justify-content:center;font-family:var(--vsNum,inherit);font-size:11px;',
    '  font-weight:700;color:#FFE9EE;border:1.6px solid #FF2B5E;',
    '  box-shadow:0 0 9px rgba(255,43,94,.45) inset,0 0 7px rgba(255,43,94,.30);margin-right:7px}'
  ].join('');

  function estilo() {
    if (document.getElementById('pp2-css')) return;
    var s = document.createElement('style'); s.id = 'pp2-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /*  la chapita numerada delante del titulo de cada rotacion              */
  function chapas() {
    [].forEach.call(document.querySelectorAll('.armrot .rt'), function (rt) {
      if (rt.dataset.ppn === '1') return;
      rt.dataset.ppn = '1';
      var n = (rt.textContent || '').match(/P\s*(\d)/);
      var b = document.createElement('em');
      b.className = 'pp-nb'; b.textContent = n ? n[1] : '\u00b7';
      rt.insertBefore(b, rt.firstChild);
    });
  }

  function pintar2() {
    estilo();
    try { canchas(); } catch (e) {}
    try { chapas(); } catch (e) {}
  }
  window.__pp2 = pintar2;

  /*  se vuelve a dibujar cada vez que la pagina rehace una grilla          */
  function mirar() {
    if (!window.MutationObserver || !document.body) return;
    var t = null;
    new MutationObserver(function () {
      clearTimeout(t); t = setTimeout(pintar2, 90);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function arrancar() { pintar2(); mirar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

/* ══════════════════════════════════════════════════════════════════════════
   PLAN DE PARTIDO · LA TIRA DE LA SECUENCIA Y LA COLUMNA DE LA DERECHA

   Dos cosas de la maqueta que faltaban:

   1) La tira de abajo con las seis fases del punto. No es decoracion: cada
      numero que TIENE pantalla propia lleva a su solapa, y el que esta
      mirando queda encendido. Las fases sin pantalla (contraataque) se ven
      apagadas a proposito, no se inventa un link que no existe.

   2) La columna de la derecha pasa a la forma de la maqueta: el anillo con
      su tabla al lado, y las barras con el nombre a la izquierda, la barra
      en el medio y el numero a la derecha, todo en un renglon.

   Ningun numero cambia. Es la misma columna que ya calculaba pp_piel.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  /*  las seis fases de la maqueta, con la solapa que le corresponde a cada
      una. null = esa fase no tiene pantalla propia todavia.               */
  var FASES = [
    ['Recepción',   'recepcion'],
    ['Colocación',  'armador'],
    ['Ataque',      'ataque'],
    ['Bloqueo',     'bloqueo'],
    ['Defensa',     'defensa'],
    ['Contraataque', null]
  ];

  var CSS = [
    '#pp-tira{margin:16px 0 4px;background:linear-gradient(180deg,#00121E,#000C16);',
    '  border:1px solid rgba(0,217,245,.30);border-radius:14px;padding:13px 16px 12px;',
    '  display:flex;align-items:center;gap:18px;flex-wrap:wrap}',
    '#pp-tira .tt{display:flex;align-items:center;gap:9px;flex:0 0 auto}',
    '#pp-tira .tt i{width:25px;height:25px;border-radius:50%;border:1.6px solid #FF2B5E;',
    '  display:flex;align-items:center;justify-content:center;',
    '  box-shadow:0 0 10px rgba(255,43,94,.35)}',
    '#pp-tira .tt i svg{width:11px;height:11px;fill:#FF4D73}',
    '#pp-tira .tt b{font-family:var(--vsTit,inherit);font-size:11.5px;font-weight:700;',
    '  letter-spacing:.17em;text-transform:uppercase;color:#D9E9F2}',
    '#pp-pasos{flex:1 1 380px;display:flex;align-items:flex-start;min-width:280px;',
    '  position:relative;padding-top:2px}',
    '#pp-pasos .ps{flex:1 1 0;display:flex;flex-direction:column;align-items:center;',
    '  gap:6px;position:relative;background:none;border:0;padding:0;cursor:default}',
    '#pp-pasos .ps[data-ir]{cursor:pointer}',
    '#pp-pasos .ps::before{content:"";position:absolute;top:12px;left:50%;right:-50%;height:1.6px;',
    '  background:linear-gradient(90deg,#FF2B5E,rgba(255,43,94,.45));z-index:0}',
    '#pp-pasos .ps:last-child::before{background:linear-gradient(90deg,rgba(64,150,200,.75),rgba(64,150,200,0))}',
    '#pp-pasos .ps u{position:relative;z-index:1;width:25px;height:25px;border-radius:50%;',
    '  display:flex;align-items:center;justify-content:center;text-decoration:none;',
    '  font-family:var(--vsNum,inherit);font-size:12px;font-weight:700;color:#CFE6F2;',
    '  background:#00121E;border:1.6px solid rgba(120,180,215,.65)}',
    '#pp-pasos .ps s{text-decoration:none;font-size:11px;color:#8FA8BE;white-space:nowrap}',
    '#pp-pasos .ps.on u{background:#FF2B5E;border-color:#FF2B5E;color:#fff;',
    '  box-shadow:0 0 0 4px rgba(255,43,94,.18),0 0 12px rgba(255,43,94,.55)}',
    '#pp-pasos .ps.on s{color:#FF6B8A;font-weight:700}',
    '#pp-pasos .ps[data-ir]:hover u{border-color:#FF2B5E;color:#fff}',
    '#pp-bts{flex:0 0 auto;display:flex;gap:10px;margin-left:auto}',
    '#pp-bts button{display:inline-flex;align-items:center;gap:8px;background:rgba(0,20,33,.55);',
    '  border:1px solid rgba(90,165,205,.45);border-radius:9px;padding:10px 15px;cursor:pointer;',
    '  font-family:var(--vsTit,inherit);font-size:11.5px;font-weight:700;letter-spacing:.13em;',
    '  text-transform:uppercase;color:#E3F1F8}',
    '#pp-bts button:hover{border-color:#FF2B5E;color:#fff}',
    '#pp-bts button[disabled]{opacity:.38;cursor:not-allowed}',
    '#pp-bts button svg{width:14px;height:14px;flex:0 0 auto}',
    /*  la columna de la derecha, con la forma de la maqueta               */
    '.pp-card:has(>.pp-ring){display:grid;grid-template-columns:auto minmax(140px,1fr);',
    '  column-gap:16px;align-items:center}',
    '.pp-card>.pp-h{grid-column:1/-1}',
    '.pp-card>.pp-ring{grid-column:1}',
    '.pp-card>.pp-kpis{grid-column:2;display:block;margin-top:0}',
    '.pp-card>.pp-kpis>div{display:flex;flex-direction:row-reverse;align-items:baseline;',
    '  justify-content:space-between;gap:10px;background:none;border:0;border-radius:0;',
    '  padding:7px 0;text-align:left;border-bottom:1px solid rgba(90,150,185,.16)}',
    '.pp-card>.pp-kpis>div:last-child{border-bottom:0}',
    '.pp-card>.pp-kpis>div b{font-size:13.5px;flex:0 0 auto}',
    '.pp-card>.pp-kpis>div i{font-size:11.5px;letter-spacing:0;text-transform:none;margin-top:0;',
    '  color:#9FB8CC;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pp-bar{display:grid;grid-template-columns:minmax(74px,auto) minmax(60px,1fr) 40px;',
    '  align-items:center;column-gap:11px;margin:0 0 7px}',
    '.pp-bar .bl{display:contents}',
    '.pp-bar .bl span{grid-column:1;margin:0;font-size:11.5px}',
    '.pp-bar .bl b{grid-column:3;text-align:right;font-size:11.5px}',
    '.pp-bar .bt{grid-column:2;height:9px;border-radius:5px}',
    '.pp-bar .bf{border-radius:5px}'
  ].join('');

  function estilo() {
    if ($('pp3-css')) return;
    var s = document.createElement('style'); s.id = 'pp3-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  var PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg>';
  var ICO = {
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
         + ' stroke-linecap="round" stroke-linejoin="round"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>',
    lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
         + ' stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    full:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
         + ' stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/></svg>'
  };

  function seccion() {
    var t = (typeof window.solapaActiva === 'function') ? window.solapaActiva() : 'armador';
    return t === 'armador' ? $('armsec') : $('tab-' + t);
  }

  /*  VER VIDEO: dispara el MISMO control que ya existe en la pantalla.
      En las solapas de zonas es el "Ver todo" de la primera ficha; en la
      del armador, la celda con mas acciones que tenga video. Si no hay
      ninguno, el boton queda apagado: no se abre una ventana vacia.      */
  function controlVideo() {
    var s = seccion(); if (!s) return null;
    var vt = s.querySelector('button.vtodo, [onclick*="openZone"]');
    if (vt) return vt;
    var mejor = null, max = -1;
    [].forEach.call(s.querySelectorAll('.cell.vid'), function (c) {
      var n = parseInt((c.querySelector('.cn-n') || {}).textContent, 10) || 0;
      if (n > max) { max = n; mejor = c; }
    });
    return mejor;
  }

  function verVideo() {
    var e = controlVideo(); if (!e) return;
    if (e.tagName === 'BUTTON') e.click();
    else { var f = e.getAttribute('ondblclick'); if (f) { try { (new Function(f)).call(e); } catch (x) {} } }
  }

  function irAFiltros() {
    var b = document.querySelector('#filtrosbar, .filtrosbar, #tabsbar');
    if (!b) return;
    b.scrollIntoView({ behavior: 'smooth', block: 'center' });
    b.style.transition = 'box-shadow .35s';
    b.style.boxShadow = '0 0 0 2px rgba(255,43,94,.55)';
    setTimeout(function () { b.style.boxShadow = ''; }, 1100);
  }

  function pantallaCompleta() {
    var s = seccion(); if (!s) return;
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    var f = s.requestFullscreen || s.webkitRequestFullscreen;
    if (f) try { f.call(s); } catch (e) {}
  }

  function construir() {
    if ($('pp-tira')) return $('pp-tira');
    var ancla = $('armsec'); if (!ancla || !ancla.parentNode) return null;
    var d = document.createElement('div'); d.id = 'pp-tira';
    var pasos = FASES.map(function (f, i) {
      return '<button class="ps" type="button"' + (f[1] ? ' data-ir="' + f[1] + '"' : '')
        + '><u>' + (i + 1) + '</u><s data-t="' + f[0] + '">' + f[0] + '</s></button>';
    }).join('');
    d.innerHTML =
        '<div class="tt"><i>' + PLAY + '</i><b data-t="Secuencia de juego">Secuencia de juego</b></div>'
      + '<div id="pp-pasos">' + pasos + '</div>'
      + '<div id="pp-bts">'
      + '<button type="button" id="pp-bv" title="Abre el video que ya tiene esta pantalla">'
      +   ICO.video + '<span data-t="Ver video">Ver video</span></button>'
      + '<button type="button" id="pp-ba" title="Lleva a los filtros de arriba">'
      +   ICO.lista + '<span data-t="Acciones">Acciones</span></button>'
      + '<button type="button" id="pp-bf" title="Agranda esta sección a pantalla completa">'
      +   ICO.full + '<span data-t="Pantalla completa">Pantalla completa</span></button>'
      + '</div>';
    /*  la tira va despues de la ultima seccion, nunca adentro de una  */
    var ult = ancla.parentNode.lastElementChild;
    ancla.parentNode.appendChild(d);
    d.querySelector('#pp-bv').addEventListener('click', verVideo);
    d.querySelector('#pp-ba').addEventListener('click', irAFiltros);
    d.querySelector('#pp-bf').addEventListener('click', pantallaCompleta);
    [].forEach.call(d.querySelectorAll('.ps[data-ir]'), function (b) {
      b.addEventListener('click', function () {
        if (typeof window.setTab === 'function') window.setTab(b.dataset.ir);
        setTimeout(marcar, 60);
      });
    });
    return d;
  }

  function marcar() {
    var d = $('pp-tira'); if (!d) return;
    var t = (typeof window.solapaActiva === 'function') ? window.solapaActiva() : '';
    [].forEach.call(d.querySelectorAll('.ps'), function (b) {
      b.classList.toggle('on', b.dataset.ir === t);
    });
    var bv = $('pp-bv'); if (bv) bv.disabled = !controlVideo();
  }

  function engancharTab() {
    if (typeof window.setTab !== 'function' || window.setTab.__pp3) return false;
    var o = window.setTab;
    var n = function () { var r = o.apply(this, arguments); setTimeout(marcar, 40); return r; };
    n.__pp3 = true; window.setTab = n;
    return true;
  }

  function arrancar() {
    estilo();
    if (construir()) marcar();
    engancharTab();
    var i = 0, t = setInterval(function () {
      estilo();
      if (construir()) marcar();
      engancharTab();
      if (++i > 40) clearInterval(t);
    }, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
