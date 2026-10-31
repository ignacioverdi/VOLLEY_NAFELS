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
