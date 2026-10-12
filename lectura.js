/* ============================================================================
   lectura.js — LA LECTURA DEL PARTIDO
   ----------------------------------------------------------------------------
   Dibuja, arriba de las tablas de analisis.html, lo que el partido dice.

   ── POR QUE EXISTE ────────────────────────────────────────────────────────
   La pantalla de analisis muestra ocho tablas por partido. Todas correctas,
   todas necesarias — y ninguna contesta la pregunta con la que uno abre la
   pantalla: QUE PASO. Eso lo tenia que armar el entrenador en la cabeza,
   cruzando numeros a mano, cada vez.

   Esto lo contesta en cuatro bloques, en el orden en que se piensa un
   partido:

       EL MARGEN   cuanto deberia haber salido el partido, y cuanto salio
       DONDE       en que set y en que rotacion se fue
       QUE         que fundamento costo mas puntos, medido en puntos
       QUIEN       quien rindio por encima o por debajo de lo suyo

   Los numeros los calcula gen_lectura.py desde los .dvw y llegan en
   datos_lectura.js. Aca no se calcula nada: se dibuja y se escribe. Si el
   archivo no esta, esta pantalla queda exactamente como estaba.

   ── POR QUE EL TEXTO VIVE ACA Y NO EN EL GENERADOR ────────────────────────
   Porque la app es trilingue y el cuerpo tecnico de Nafels no lee espanol.
   El generador manda un CODIGO con sus numeros —'muy_bloqueado', 17, 17.3%,
   8.2%, 98— y la frase se arma aca en el idioma que tenga puesto la app, con
   window.getLang(). Cuando se cambia de idioma se redibuja sola.

   ── COMO SE ENGANCHA ──────────────────────────────────────────────────────
   No modifica ninguna funcion de la pagina: ENVUELVE las que ya existen
   (activarPartidoBtns, selectPartido, selectPartidoFiltrado) para enterarse
   de que partido se eligio, y dibuja en un div propio insertado arriba de
   las pestanias. Es la misma tecnica que ya usa analisis.html para refrescar
   las baterias. Todo lo que dibuja va dentro de un try/catch: si algo falla,
   la pantalla queda intacta.

   Para apagarlo:   localStorage.setItem('vs_lectura','off')
   ============================================================================ */
(function () {
  'use strict';

  try {
    if (localStorage.getItem('vs_lectura') === 'off') return;
  } catch (e) {}

  /* ── Los colores ────────────────────────────────────────────────────────
     Tres y nada mas: verde lo que esta por encima de lo esperable, rojo lo
     que esta por debajo, ambar lo que avisa. El rojo de la marca (#E8192C)
     NO se usa como dato: medido en OKLab esta a 4.9 de distancia del rojo
     semantico, o sea que a ojo son el mismo color, y si el rojo significara
     dos cosas distintas en la misma pantalla el color dejaria de ser dato.
     Queda solo en el borde de arriba del panel, como identidad. */
  var VERDE = '#3FB950';
  var ROJO  = '#F0566A';
  var AMBAR = '#F5A524';

  /* ══ LOS TEXTOS ═══════════════════════════════════════════════════════════
     Un bloque por idioma. Los {nombres} se reemplazan con los numeros que
     manda el generador. El aleman va sin acentos (ae, oe, ue, ss) como el
     resto de la app. */
  var T = {
    es: {
      titulo: 'LA LECTURA',
      acumulado: 'acumulado de la temporada',
      informe: 'Informe de equipo →',
      eti_margen: 'EL MARGEN',
      eti_temporada: 'LA TEMPORADA · {n} PARTIDOS',
      eti_sets: 'DONDE · SET POR SET',
      eti_rot: 'DONDE · ROTACION POR ROTACION',
      eti_que: 'QUE · LO QUE COSTO PUNTOS',
      eti_quien: 'QUIEN',
      ap_ataque: 'ATAQUE EN CAMBIO DE SAQUE',
      ap_saque: 'SAQUE Y BLOQUEO',
      ap_det: '{real}% real · {esp}% esperable · {n} {uni}',
      uni_rec: 'recepciones', uni_srv: 'saques',
      gano: 'Se gano', perdio: 'Se perdio', empate: 'Empate en puntos',
      margen_1: '{res} {a}–{b} ({m} en puntos). Por como se recibio y por como recibio {rival} los saques, el partido daba {esp}: ',
      margen_t: 'En {np} partidos: {a} puntos a favor y {b} en contra ({m}). Por como se recibio y por como recibieron los rivales los saques, la temporada daba {esp}: ',
      margen_igual: 'salio lo que tenia que salir.',
      margen_mas: 'se saco {d} mas de lo esperable.',
      margen_menos: 'se dejaron {d} puntos en el camino.',
      set: 'SET {n}', rec_corto: 'rec',
      set_clave: 'El set {set} se fue {dif}; en los demas sets el promedio fue {prom}.',
      rot_clave: 'En {rot} se cambio de saque {so}% contra {prom}% en el resto de las rotaciones: cuesta {costo} puntos.',
      puntos: 'PUNTOS',
      ver: '▶ ver {n} jugadas', ver1: '▶ ver la jugada',
      th_rec: 'RECEPCION', th_n_rec: 'REC', th_so: 'SO%', th_esp: 'ESPERABLE', th_dif: 'DIF',
      th_atk: 'ATAQUE', th_n_atk: 'ATQ', th_eff: 'EFF%', th_pt: 'PT', th_err: 'ERR', th_blo: 'BLO',
      pie: 'Lo <i>esperable</i> no es un objetivo ni una opinion: es el porcentaje de rallies que se gana en esta liga con cada calidad de recepcion, calculado con todos los partidos cargados de la temporada {t} — {tabla} — aplicado a las recepciones que de verdad hubo.',
      cal: { '#': 'perfecta', '+': 'positiva' },
      h: {
        rec_no_convertida: ['Con recepcion {cal_n} se gano {real}% de los rallies; en la liga se gana {liga}%',
                            '{n} recepciones {cal}, {g} rallies ganados'],
        bloqueo_no_convirtio: ['Cuando el rival recibio mal gano {real}% de los rallies igual; con esas recepciones la liga gana {esp}%',
                               '{n} recepciones flojas del rival (!, -, /) y {g} rallies suyos — el saque cumplio, el bloqueo y la defensa no'],
        bloqueo_convirtio: ['Cuando el rival recibio mal solo gano {real}% de los rallies; con esas recepciones la liga gana {esp}%',
                            '{n} recepciones flojas del rival (!, -, /) — el bloqueo y la defensa las convirtieron'],
        saque_error_alto: ['Se erraron {err} saques, el {pct}% del total; en la liga se erra {liga}%',
                           '{err} errores en {n} saques, con {aces} de punto'],
        saque_error_bajo: ['Se saco con {pct}% de error contra {liga}% de la liga, y {aces} saques de punto',
                           '{err} errores en {n} saques'],
        contraataque_bajo: ['El contraataque rindio {eff_tr}% de eficacia contra {eff_so}% del ataque tras recepcion',
                            '{n_tr} pelotas de contraataque y {n_so} tras recepcion'],
        muy_bloqueado: ['El rival bloqueo {blo} remates, el {pct}% de los ataques; en la liga se bloquea el {liga}%',
                        '{blo} bloqueados en {n} ataques'],
        recepcion_floja: ['Se recibio {pos}% positivo contra {liga}% de la liga, y eso baja el cambio de saque esperable a {esp}%',
                          '{n} recepciones: {perf}% perfectas, {err}% erradas — con la calidad promedio de la liga el esperable seria {esp_liga}%'],
        recepcion_buena: ['Se recibio {pos}% positivo contra {liga}% de la liga',
                          '{n} recepciones, {perf}% perfectas'],
        saque_sin_presion: ['El saque dejo al rival recibir {pos}% positivo; en la liga se recibe {liga}%',
                            '{n} recepciones del rival: con esa comodidad le corresponde ganar {esp}% de los rallies — sin presion de saque el bloqueo no tiene con que'],
        saque_con_presion: ['El saque dejo al rival recibir solo {pos}% positivo; en la liga se recibe {liga}%',
                            '{n} recepciones del rival, incomodo en {incomodo}% de ellas']
      }
    },
    en: {
      titulo: 'THE READING',
      acumulado: 'season to date',
      informe: 'Team report →',
      eti_margen: 'THE MARGIN',
      eti_temporada: 'THE SEASON · {n} MATCHES',
      eti_sets: 'WHERE · SET BY SET',
      eti_rot: 'WHERE · ROTATION BY ROTATION',
      eti_que: 'WHAT · WHAT COST POINTS',
      eti_quien: 'WHO',
      ap_ataque: 'ATTACK IN SIDE-OUT',
      ap_saque: 'SERVE AND BLOCK',
      ap_det: '{real}% actual · {esp}% expected · {n} {uni}',
      uni_rec: 'receptions', uni_srv: 'serves',
      gano: 'Won', perdio: 'Lost', empate: 'Level on points',
      margen_1: '{res} {a}–{b} ({m} on points). Given how the team received and how {rival} received the serves, the match was worth {esp}: ',
      margen_t: 'Across {np} matches: {a} points for and {b} against ({m}). Given how the team received and how the opponents received the serves, the season was worth {esp}: ',
      margen_igual: 'it came out exactly as expected.',
      margen_mas: '{d} more than expected.',
      margen_menos: '{d} points left on the table.',
      set: 'SET {n}', rec_corto: 'rec',
      set_clave: 'Set {set} went {dif}; in the other sets the average was {prom}.',
      rot_clave: 'In {rot} side-out was {so}% against {prom}% in the other rotations: it costs {costo} points.',
      puntos: 'POINTS',
      ver: '▶ see {n} plays', ver1: '▶ see the play',
      th_rec: 'RECEPTION', th_n_rec: 'REC', th_so: 'SO%', th_esp: 'EXPECTED', th_dif: 'DIFF',
      th_atk: 'ATTACK', th_n_atk: 'ATT', th_eff: 'EFF%', th_pt: 'PT', th_err: 'ERR', th_blo: 'BLK',
      pie: '<i>Expected</i> is not a target or an opinion: it is the share of rallies won in this league with each reception quality, computed from every match loaded for the {t} season — {tabla} — applied to the receptions that actually happened.',
      cal: { '#': 'perfect', '+': 'positive' },
      h: {
        rec_no_convertida: ['With {cal_n} reception only {real}% of the rallies were won; the league wins {liga}%',
                            '{n} {cal} receptions, {g} rallies won'],
        bloqueo_no_convirtio: ['When the opponent received badly they still won {real}% of the rallies; with those receptions the league wins {esp}%',
                               '{n} poor opponent receptions (!, -, /) and {g} rallies for them — the serve did its job, the block and defence did not'],
        bloqueo_convirtio: ['When the opponent received badly they only won {real}% of the rallies; with those receptions the league wins {esp}%',
                            '{n} poor opponent receptions (!, -, /) — the block and defence converted them'],
        saque_error_alto: ['{err} serves were missed, {pct}% of the total; the league misses {liga}%',
                           '{err} errors in {n} serves, with {aces} aces'],
        saque_error_bajo: ['Served at {pct}% error against the league’s {liga}%, with {aces} aces',
                           '{err} errors in {n} serves'],
        contraataque_bajo: ['Transition attack hit {eff_tr}% efficiency against {eff_so}% after reception',
                            '{n_tr} transition balls and {n_so} after reception'],
        muy_bloqueado: ['The opponent blocked {blo} spikes, {pct}% of the attacks; the league blocks {liga}%',
                        '{blo} blocked out of {n} attacks'],
        recepcion_floja: ['Reception was {pos}% positive against the league’s {liga}%, which drops the expected side-out to {esp}%',
                          '{n} receptions: {perf}% perfect, {err}% errors — with league-average quality the expectation would be {esp_liga}%'],
        recepcion_buena: ['Reception was {pos}% positive against the league’s {liga}%',
                          '{n} receptions, {perf}% perfect'],
        saque_sin_presion: ['The serve let the opponent receive {pos}% positive; the league receives {liga}%',
                            '{n} opponent receptions: at that comfort they are expected to win {esp}% of the rallies — with no serve pressure the block has nothing to work with'],
        saque_con_presion: ['The serve let the opponent receive only {pos}% positive; the league receives {liga}%',
                            '{n} opponent receptions, uncomfortable on {incomodo}% of them']
      }
    },
    de: {
      titulo: 'DIE LESART',
      acumulado: 'Saison bisher',
      informe: 'Teambericht →',
      eti_margen: 'DIE DIFFERENZ',
      eti_temporada: 'DIE SAISON · {n} SPIELE',
      eti_sets: 'WO · SATZ FUER SATZ',
      eti_rot: 'WO · ROTATION FUER ROTATION',
      eti_que: 'WAS · WAS PUNKTE GEKOSTET HAT',
      eti_quien: 'WER',
      ap_ataque: 'ANGRIFF IM SIDE-OUT',
      ap_saque: 'AUFSCHLAG UND BLOCK',
      ap_det: '{real}% real · {esp}% erwartbar · {n} {uni}',
      uni_rec: 'Annahmen', uni_srv: 'Aufschlaege',
      gano: 'Gewonnen', perdio: 'Verloren', empate: 'Punktgleich',
      margen_1: '{res} {a}–{b} ({m} Punkte). Nach der eigenen Annahme und der Annahme von {rival} war das Spiel {esp} wert: ',
      margen_t: 'In {np} Spielen: {a} Punkte dafuer und {b} dagegen ({m}). Nach der eigenen Annahme und der Annahme der Gegner war die Saison {esp} wert: ',
      margen_igual: 'genau wie erwartbar.',
      margen_mas: '{d} mehr als erwartbar.',
      margen_menos: '{d} Punkte liegen geblieben.',
      set: 'SATZ {n}', rec_corto: 'Ann',
      set_clave: 'Satz {set} ging {dif} aus; in den uebrigen Saetzen lag der Durchschnitt bei {prom}.',
      rot_clave: 'In {rot} lag der Side-Out bei {so}% gegen {prom}% in den anderen Rotationen: das kostet {costo} Punkte.',
      puntos: 'PUNKTE',
      ver: '▶ {n} Aktionen ansehen', ver1: '▶ Aktion ansehen',
      th_rec: 'ANNAHME', th_n_rec: 'ANN', th_so: 'SO%', th_esp: 'ERWARTBAR', th_dif: 'DIFF',
      th_atk: 'ANGRIFF', th_n_atk: 'ANG', th_eff: 'EFF%', th_pt: 'PKT', th_err: 'FEH', th_blo: 'BLK',
      pie: '<i>Erwartbar</i> ist kein Ziel und keine Meinung: es ist der Anteil gewonnener Ballwechsel in dieser Liga pro Annahmequalitaet, berechnet aus allen geladenen Spielen der Saison {t} — {tabla} — angewendet auf die tatsaechlich gespielten Annahmen.',
      cal: { '#': 'perfekter', '+': 'positiver' },
      h: {
        rec_no_convertida: ['Nach {cal_n} Annahme wurden nur {real}% der Ballwechsel gewonnen; in der Liga {liga}%',
                            '{n} Annahmen {cal}, {g} gewonnene Ballwechsel'],
        bloqueo_no_convirtio: ['Bei schlechter Annahme gewann der Gegner trotzdem {real}% der Ballwechsel; mit solchen Annahmen gewinnt die Liga {esp}%',
                               '{n} schwache Annahmen des Gegners (!, -, /) und {g} Ballwechsel fuer ihn — der Aufschlag hat funktioniert, Block und Abwehr nicht'],
        bloqueo_convirtio: ['Bei schlechter Annahme gewann der Gegner nur {real}% der Ballwechsel; mit solchen Annahmen gewinnt die Liga {esp}%',
                            '{n} schwache Annahmen des Gegners (!, -, /) — Block und Abwehr haben sie verwertet'],
        saque_error_alto: ['{err} Aufschlagfehler, {pct}% aller Aufschlaege; in der Liga {liga}%',
                           '{err} Fehler bei {n} Aufschlaegen, dazu {aces} Asse'],
        saque_error_bajo: ['Aufschlag mit {pct}% Fehlerquote gegen {liga}% der Liga, dazu {aces} Asse',
                           '{err} Fehler bei {n} Aufschlaegen'],
        contraataque_bajo: ['Der Angriff aus der Transition traf {eff_tr}% Effizienz gegen {eff_so}% nach Annahme',
                            '{n_tr} Transitionsbaelle und {n_so} nach Annahme'],
        muy_bloqueado: ['Der Gegner blockte {blo} Schlaege, {pct}% der Angriffe; in der Liga werden {liga}% geblockt',
                        '{blo} geblockt bei {n} Angriffen'],
        recepcion_floja: ['Annahme {pos}% positiv gegen {liga}% der Liga, das senkt den erwartbaren Side-Out auf {esp}%',
                          '{n} Annahmen: {perf}% perfekt, {err}% Fehler — mit Liga-Durchschnittsqualitaet waeren {esp_liga}% erwartbar'],
        recepcion_buena: ['Annahme {pos}% positiv gegen {liga}% der Liga',
                          '{n} Annahmen, {perf}% perfekt'],
        saque_sin_presion: ['Der Aufschlag liess den Gegner {pos}% positiv annehmen; in der Liga {liga}%',
                            '{n} Annahmen des Gegners: bei dieser Bequemlichkeit sind {esp}% gewonnene Ballwechsel zu erwarten — ohne Aufschlagdruck hat der Block keine Chance'],
        saque_con_presion: ['Der Aufschlag liess den Gegner nur {pos}% positiv annehmen; in der Liga {liga}%',
                            '{n} Annahmen des Gegners, unbequem bei {incomodo}% davon']
      }
    }
  };

  function L() {
    var l = 'es';
    try { l = (typeof window.getLang === 'function' ? window.getLang() : 'es') || 'es'; } catch (e) {}
    return T[l] || T.es;
  }
  function fmt(tpl, d) {
    return String(tpl).replace(/\{(\w+)\}/g, function (_, k) {
      return (d && d[k] != null) ? d[k] : '';
    });
  }

  /* ── El estilo ─────────────────────────────────────────────────────────── */
  var CSS = [
    /* El panel ocupa el ancho de la pantalla, pero el CONTENIDO va limitado:
       una barra de 2000px de ancho no se lee mejor que una de 760, y una
       linea de texto de ese largo se lee peor. En la pantalla grande el
       espacio vacio molesta mas que la falta de espacio. */
    '#vs-lectura{border:1px solid var(--border,rgba(255,255,255,.08));border-top:2px solid #E8192C;',
    '  background:var(--card,#0d0e1a);border-radius:12px;padding:16px 16px 6px;margin:0 0 18px;',
    '  scroll-margin-top:120px}',
    '#vs-lectura .lec-hdr{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:14px}',
    '#vs-lectura .lec-tit{font-family:"Bebas Neue",Impact,sans-serif;font-size:21px;letter-spacing:1.5px;',
    '  color:var(--txt,#e2e8f0);line-height:1}',
    '#vs-lectura .lec-sub{font-size:11px;color:var(--mut,#94a3b8);letter-spacing:.4px}',
    '#vs-lectura .lec-link{margin-left:auto;font-size:11px;color:#818cf8;text-decoration:none;',
    '  border:1px solid rgba(129,140,248,.35);border-radius:999px;padding:4px 11px;white-space:nowrap}',
    '#vs-lectura .lec-link:hover{background:rgba(129,140,248,.12)}',
    '#vs-lectura .lec-eti{font-size:9px;letter-spacing:1.8px;color:var(--mut,#94a3b8);font-weight:700;',
    '  margin:18px 0 8px;display:flex;align-items:center;gap:8px}',
    '#vs-lectura .lec-eti:before{content:"";width:3px;height:11px;background:#E8192C;border-radius:2px;display:inline-block}',
    '#vs-lectura .lec-eti.p{margin-top:0}',
    '#vs-lectura .lec-frase{font-size:15px;line-height:1.5;color:var(--txt,#e2e8f0);margin-bottom:12px;max-width:72ch}',
    '#vs-lectura .lec-frase b{font-weight:800}',
    '#vs-lectura .lec-ap{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,320px));gap:10px;justify-content:start}',
    '#vs-lectura .ap{border:1px solid var(--border,rgba(255,255,255,.07));border-radius:10px;padding:11px 13px;',
    '  background:var(--card2,#111220)}',
    '#vs-lectura .ap-t{font-size:9px;letter-spacing:1.4px;color:var(--mut,#94a3b8);font-weight:700;margin-bottom:6px}',
    '#vs-lectura .ap-n{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:27px;font-weight:700;',
    '  line-height:1;font-variant-numeric:tabular-nums}',
    '#vs-lectura .ap-d{font-size:11px;color:var(--mut,#94a3b8);margin-top:5px;font-variant-numeric:tabular-nums}',
    '#vs-lectura .ap-bar{height:4px;border-radius:2px;background:rgba(255,255,255,.07);margin-top:9px;',
    '  overflow:hidden;position:relative}',
    '#vs-lectura .ap-bar i{position:absolute;top:0;bottom:0;border-radius:2px}',
    '#vs-lectura .lec-barras{display:grid;gap:5px;max-width:720px}',
    '#vs-lectura .bf{display:grid;grid-template-columns:58px 1fr 118px;gap:9px;align-items:center;font-size:11px}',
    '#vs-lectura .bf-k{color:var(--mut,#94a3b8);letter-spacing:.8px;font-weight:700;white-space:nowrap}',
    '#vs-lectura .bf-b{height:13px;background:rgba(255,255,255,.05);border-radius:3px;position:relative}',
    '#vs-lectura .bf-b i{position:absolute;top:0;bottom:0;border-radius:3px}',
    '#vs-lectura .bf-b u{position:absolute;top:-2px;bottom:-2px;width:1px;background:rgba(255,255,255,.22);left:50%}',
    '#vs-lectura .bf-v{color:var(--txt,#e2e8f0);font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}',
    '#vs-lectura .lec-nota{font-size:12.5px;color:var(--txt,#e2e8f0);margin-top:9px;line-height:1.45;max-width:78ch;',
    '  border-left:2px solid ' + AMBAR + ';padding-left:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
    '#vs-lectura .lec-nota .h-v{margin-top:0}',
    '#vs-lectura .h{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;padding:10px 0;max-width:860px;',
    '  border-top:1px solid var(--border,rgba(255,255,255,.06))}',
    '#vs-lectura .h.p{border-top:0}',
    '#vs-lectura .h-c{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:17px;font-weight:700;',
    '  text-align:right;font-variant-numeric:tabular-nums;line-height:1.2}',
    '#vs-lectura .h-c s{display:block;font-size:8px;letter-spacing:1px;color:var(--mut,#94a3b8);',
    '  text-decoration:none;font-weight:700;font-family:inherit}',
    '#vs-lectura .h-t{font-size:13.5px;line-height:1.45;color:var(--txt,#e2e8f0)}',
    '#vs-lectura .h-d{font-size:11px;color:var(--mut,#94a3b8);margin-top:3px;line-height:1.4}',
    '#vs-lectura .h-v{display:inline-block;margin-top:6px;font-size:10.5px;color:#06b6d4;text-decoration:none;',
    '  border:1px solid rgba(6,182,212,.35);border-radius:999px;padding:3px 9px;white-space:nowrap}',
    '#vs-lectura .h-v:hover{background:rgba(6,182,212,.12)}',
    '#vs-lectura .lec-tab{width:auto;border-collapse:collapse;font-size:12px;margin-top:2px}',
    '#vs-lectura .lec-tab th{font-size:9px;letter-spacing:1.1px;color:var(--mut,#94a3b8);font-weight:700;',
    '  text-align:right;padding:4px 9px;border-bottom:1px solid var(--border2,rgba(255,255,255,.12));white-space:nowrap}',
    '#vs-lectura .lec-tab th:first-child,#vs-lectura .lec-tab td:first-child{text-align:left}',
    '#vs-lectura .lec-tab td{padding:5px 9px;text-align:right;color:var(--txt,#e2e8f0);',
    '  font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border,rgba(255,255,255,.05));white-space:nowrap}',
    '#vs-lectura .lec-dos{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,440px));gap:24px;justify-content:start}',
    '#vs-lectura .lec-pie{font-size:10px;color:var(--mut,#94a3b8);margin:16px 0 8px;line-height:1.5;max-width:110ch}',
    '@media (max-width:560px){#vs-lectura{padding:13px 12px 4px}',
    '  #vs-lectura .bf{grid-template-columns:50px 1fr 96px;font-size:10.5px}',
    '  #vs-lectura .lec-frase{font-size:14px}#vs-lectura .ap-n{font-size:24px}}',
    '@media print{#vs-lectura .lec-link,#vs-lectura .h-v{display:none}}'
  ].join('\n');

  function ponerCSS() {
    if (document.getElementById('vs-lectura-css')) return;
    var s = document.createElement('style');
    s.id = 'vs-lectura-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ── Utilidades ────────────────────────────────────────────────────────── */
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function firma(s) {
    return String(s == null ? '' : s).toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
  function signo(n, dec) {
    var v = Number(n) || 0;
    return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(dec == null ? 1 : dec);
  }
  function col(n) { return (Number(n) || 0) >= 0 ? VERDE : ROJO; }

  /* El link al video. cortes.html espera  codigo-segundo-dorsal  separados
     por punto y coma; el codigo del partido lo trae la lectura. */
  function linkClips(mc, cl) {
    if (!mc || !cl || !cl.length) return '';
    return 'cortes.html?modo=partido&clips=' + encodeURIComponent(
      cl.map(function (c) { return mc + '-' + c[0] + '-' + c[1]; }).join(';'));
  }
  function botonVideo(mc, cl) {
    var u = linkClips(mc, cl), t = L();
    if (!u) return '';
    return '<a class="h-v" href="' + esc(u) + '">' +
      (cl.length === 1 ? t.ver1 : fmt(t.ver, { n: cl.length })) + '</a>';
  }

  /* ── EL MARGEN ─────────────────────────────────────────────────────────── */
  function bloqueMargen(X, eti, rival, np) {
    var t = L(), dif = X.margen - X.margen_esp;
    var res = X.margen > 0 ? t.gano : X.margen < 0 ? t.perdio : t.empate;
    var cola = Math.abs(dif) < 2 ? t.margen_igual
      : dif > 0 ? fmt(t.margen_mas, { d: '<b style="color:' + VERDE + '">' + signo(dif) + '</b>' })
                : fmt(t.margen_menos, { d: '<b style="color:' + ROJO + '">' + Math.abs(dif).toFixed(1) + '</b>' });
    var frase = '<div class="lec-frase">' + fmt(np ? t.margen_t : t.margen_1, {
      res: '<b style="color:' + col(X.margen) + '">' + res + '</b>',
      a: X.puntos, b: X.puntos_rival, m: signo(X.margen, 0), np: np,
      rival: esc(rival || ''), esp: '<b>' + signo(X.margen_esp) + '</b>'
    }) + cola + '</div>';

    function tarjeta(tit, ap, real, esp, n, uni) {
      var pc = Math.max(0, Math.min(100, Number(real) || 0));
      var pe = Math.max(0, Math.min(100, Number(esp) || 0));
      var a = Math.min(pc, pe), b = Math.max(pc, pe);
      return '<div class="ap"><div class="ap-t">' + tit + '</div>' +
        '<div class="ap-n" style="color:' + col(ap) + '">' + signo(ap) + '</div>' +
        '<div class="ap-d">' + fmt(t.ap_det, { real: real, esp: esp, n: n, uni: uni }) + '</div>' +
        '<div class="ap-bar"><i style="left:0;width:' + a + '%;background:rgba(255,255,255,.18)"></i>' +
        '<i style="left:' + a + '%;width:' + (b - a) + '%;background:' + col(ap) + '"></i></div></div>';
    }

    return '<div class="lec-eti p">' + eti + '</div>' + frase + '<div class="lec-ap">' +
      tarjeta(t.ap_ataque, X.ap_ataque, X.so, X.so_esp, X.so_n, t.uni_rec) +
      tarjeta(t.ap_saque, X.ap_saque, X.bp, X.bp_esp, X.bp_n, t.uni_srv) + '</div>';
  }

  /* ── DONDE ─────────────────────────────────────────────────────────────── */
  function bloqueDonde(dd, mc) {
    if (!dd) return '';
    var t = L(), h = '';
    if (dd.sets && dd.sets.length) {
      var tope = 1;
      dd.sets.forEach(function (s) { tope = Math.max(tope, Math.abs(s.dif)); });
      h += '<div class="lec-eti">' + t.eti_sets + '</div><div class="lec-barras">';
      dd.sets.forEach(function (s) {
        var w = Math.abs(s.dif) / tope * 50, neg = s.dif < 0;
        h += '<div class="bf"><div class="bf-k">' + fmt(t.set, { n: s.set }) + '</div>' +
          '<div class="bf-b"><u></u><i style="' + (neg ? 'right:50%;' : 'left:50%;') +
          'width:' + w.toFixed(1) + '%;background:' + col(s.dif) + '"></i></div>' +
          '<div class="bf-v">' + s.pf + '–' + s.pc + ' · ' + t.th_so.replace('%', '') +
          ' ' + (s.so == null ? '–' : s.so + '%') + '</div></div>';
      });
      h += '</div>';
      if (dd.set_clave) {
        h += '<div class="lec-nota"><span>' + esc(fmt(t.set_clave, {
          set: dd.set_clave.set, dif: signo(dd.set_clave.dif, 0), prom: signo(dd.set_clave.prom)
        })) + '</span></div>';
      }
    }
    if (dd.rot && dd.rot.length) {
      var max = 1;
      dd.rot.forEach(function (r) { if (r.so != null) max = Math.max(max, r.so); });
      h += '<div class="lec-eti">' + t.eti_rot + '</div><div class="lec-barras">';
      dd.rot.forEach(function (r) {
        var peor = dd.rot_clave && dd.rot_clave.rot === r.rot;
        h += '<div class="bf"><div class="bf-k">' + esc(r.rot) + '</div>' +
          '<div class="bf-b"><i style="left:0;width:' + ((r.so || 0) / max * 100).toFixed(1) +
          '%;background:' + (peor ? ROJO : 'rgba(255,255,255,.22)') + '"></i></div>' +
          '<div class="bf-v">' + (r.so == null ? '–' : r.so + '%') + ' · ' +
          r.so_n + ' ' + t.rec_corto + '</div></div>';
      });
      h += '</div>';
      if (dd.rot_clave) {
        h += '<div class="lec-nota"><span>' + esc(fmt(t.rot_clave, {
          rot: dd.rot_clave.rot, so: dd.rot_clave.so, prom: dd.rot_clave.prom, costo: dd.rot_clave.costo
        })) + '</span>' + botonVideo(mc, dd.rot_clave.clips) + '</div>';
      }
    }
    return h;
  }

  /* ── QUE ───────────────────────────────────────────────────────────────── */
  function bloqueQue(H, mc) {
    if (!H || !H.length) return '';
    var t = L();
    var h = '<div class="lec-eti">' + t.eti_que + '</div>';
    H.forEach(function (x, i) {
      var plantilla = t.h[x.cod];
      if (!plantilla) return;
      var d = {};
      for (var k in (x.d || {})) d[k] = x.d[k];
      if (d.cal) d.cal_n = (t.cal[d.cal] || d.cal);
      var bueno = x.tipo === 'bueno';
      h += '<div class="h' + (i === 0 ? ' p' : '') + '"><div class="h-c" style="color:' +
        (bueno ? VERDE : ROJO) + '">' + (bueno ? '+' : '−') + Math.abs(x.costo).toFixed(1) +
        '<s>' + t.puntos + '</s></div><div><div class="h-t">' + esc(fmt(plantilla[0], d)) + '</div>' +
        '<div class="h-d">' + esc(fmt(plantilla[1], d)) + '</div>' + botonVideo(mc, x.clips) + '</div></div>';
    });
    return h;
  }

  /* ── QUIEN ─────────────────────────────────────────────────────────────── */
  function bloqueQuien(Q, mc) {
    if (!Q || ((!Q.recepcion || !Q.recepcion.length) && (!Q.ataque || !Q.ataque.length))) return '';
    var t = L();
    var h = '<div class="lec-eti">' + t.eti_quien + '</div><div class="lec-dos">';
    if (Q.recepcion && Q.recepcion.length) {
      h += '<div><table class="lec-tab"><thead><tr><th>' + t.th_rec + '</th><th>' + t.th_n_rec +
        '</th><th>' + t.th_so + '</th><th>' + t.th_esp + '</th><th>' + t.th_dif + '</th><th></th></tr></thead><tbody>';
      Q.recepcion.forEach(function (j) {
        h += '<tr><td>' + esc(j.nombre) + '</td><td>' + j.n + '</td><td>' +
          (j.so == null ? '–' : j.so + '%') + '</td><td style="color:var(--mut,#94a3b8)">' +
          (j.so_esp == null ? '–' : j.so_esp + '%') + '</td><td style="color:' +
          (j.dif == null ? 'var(--mut,#94a3b8)' : col(j.dif)) + ';font-weight:700">' +
          (j.dif == null ? '–' : signo(j.dif)) + '</td><td>' +
          botonVideo(mc, j.clips) + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    if (Q.ataque && Q.ataque.length) {
      h += '<div><table class="lec-tab"><thead><tr><th>' + t.th_atk + '</th><th>' + t.th_n_atk +
        '</th><th>' + t.th_eff + '</th><th>' + t.th_pt + '</th><th>' + t.th_err + '</th><th>' +
        t.th_blo + '</th><th></th></tr></thead><tbody>';
      Q.ataque.forEach(function (j) {
        h += '<tr><td>' + esc(j.nombre) + '</td><td>' + j.n + '</td><td style="color:' + col(j.eff) +
          ';font-weight:700">' + (j.eff == null ? '–' : j.eff + '%') + '</td><td>' + j.pt +
          '</td><td>' + j.err + '</td><td>' + j.blo + '</td><td>' + botonVideo(mc, j.clips) + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    return h + '</div>';
  }

  function pie(D) {
    var t = L(), r = D.referencia || {};
    var ks = ['#', '+', '!', '-', '/'].filter(function (k) { return r[k] != null; });
    if (!ks.length) return '';
    return '<div class="lec-pie">' + fmt(t.pie, {
      t: esc(D.temporada || ''),
      tabla: ks.map(function (k) { return '<b>' + esc(k) + '</b> ' + r[k] + '%'; }).join(' · ')
    }) + '</div>';
  }

  /* ── Que partido se esta mirando ───────────────────────────────────────── */
  function partidoElegido(D) {
    var idx = window.PARTIDO_IDX;
    if (idx == null) return undefined;                 /* todavia no eligio nada */
    var ses = (window.DATA && window.DATA.entrenamientos) ? window.DATA.entrenamientos[idx] : null;
    if (idx < 0 || !ses) return null;                  /* la tarjeta ACUMULADO */
    if ((ses.tipo || 'P') !== 'P') return undefined;   /* un entrenamiento no se lee asi */
    var f = String(ses.fecha || ''), r = firma(ses.rival);
    var cand = (D.partidos || []).filter(function (p) { return p.fecha_app === f; });
    if (!cand.length) return undefined;
    var el = cand[0];
    if (cand.length > 1) {
      /* Mismo dia, mas de un partido: desempata el nombre del rival. Los .dvw
         lo escriben distinto segun el año ("VOLLEY AMRISWIL 2026/27" contra
         "Amriswil"), asi que se compara por dentro y no por igualdad. */
      var ex = cand.filter(function (p) {
        var pr = firma(p.rival);
        return pr === r || (r && pr.indexOf(r) >= 0) || (pr && r.indexOf(pr) >= 0);
      });
      if (!ex.length) return undefined;
      el = ex[0];
    }
    /* El nombre que muestra la app es el corto y es el que el entrenador
       conoce; el del .dvw trae el patrocinador y el año. */
    return { p: el, rival: ses.rival || el.rival };
  }

  /* ── Dibujar ───────────────────────────────────────────────────────────── */
  var caja = null;

  function laCaja() {
    if (caja && caja.parentNode) return caja;
    caja = document.getElementById('vs-lectura');
    if (caja) return caja;
    var ancla = document.getElementById('tabs-equipo') || document.getElementById('tabs');
    if (!ancla || !ancla.parentNode) return null;
    caja = document.createElement('div');
    caja.id = 'vs-lectura';
    caja.style.display = 'none';
    ancla.parentNode.insertBefore(caja, ancla);
    return caja;
  }

  function pintar() {
    var D = window.LECTURA_DATA;
    if (!D) return;
    var c = laCaja();
    if (!c) return;
    var t = L();
    var sel = partidoElegido(D);
    var html = '', sub = '';
    if (sel === null) {
      var TT = D.temporada_lectura;
      if (TT && TT.libro) {
        html = bloqueMargen(TT.libro, fmt(t.eti_temporada, { n: TT.partidos }), '', TT.partidos) +
               bloqueDonde(TT.donde, '') + bloqueQue(TT.que, '') + pie(D);
        sub = t.acumulado;
      }
    } else if (sel) {
      var p = sel.p;
      html = bloqueMargen(p.libro, t.eti_margen, sel.rival) +
             bloqueDonde(p.donde, p.mc) + bloqueQue(p.que, p.mc) +
             bloqueQuien(p.quien, p.mc) + pie(D);
      sub = esc(D.propio) + ' vs ' + esc(sel.rival) + ' · ' + esc(p.fecha_app) +
            ' · ' + esc(p.sets);
    }
    if (!html) { c.style.display = 'none'; c.innerHTML = ''; return; }
    c.innerHTML = '<div class="lec-hdr"><div class="lec-tit">' + t.titulo + '</div>' +
      '<div class="lec-sub">' + sub + '</div>' +
      '<a class="lec-link" href="informe_equipo.html">' + t.informe + '</a></div>' + html;
    c.style.display = 'block';
  }

  function pintarSeguro() {
    try { pintar(); } catch (e) { try { console.warn('[lectura]', e); } catch (_) {} }
  }

  /* Engancharse a lo que ya existe, sin cambiarlo. */
  function enganchar() {
    ['activarPartidoBtns', 'selectPartido', 'selectPartidoFiltrado', 'setVista', 'setFiltroTipo']
      .forEach(function (n) {
        var orig = window[n];
        if (typeof orig !== 'function' || orig.__lec) return;
        var env = function () {
          var r = orig.apply(this, arguments);
          setTimeout(pintarSeguro, 30);
          return r;
        };
        env.__lec = 1;
        window[n] = env;
      });
  }

  function arrancar() {
    ponerCSS();
    enganchar();
    pintarSeguro();
    /* Los datos cifrados grandes se abren en segundo plano: cuando llega el
       aviso, se vuelve a dibujar. */
    window.addEventListener('datos-listos', function () { setTimeout(pintarSeguro, 20); });
    /* Al cambiar de idioma se reescribe en el acto. Ojo: lang.js dispara este
       mismo evento al cargar, asi que esto NO puede recargar la pagina —
       seria un bucle. Solo redibuja. */
    window.addEventListener('langchange', function () { setTimeout(pintarSeguro, 10); });
    /* La pagina engancha sus propias funciones despues del DOMContentLoaded:
       dos intentos espaciados alcanzan para no quedar afuera. */
    setTimeout(enganchar, 300);
    setTimeout(function () { enganchar(); pintarSeguro(); }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
