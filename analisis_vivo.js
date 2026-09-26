/* ============================================================================
   analisis_vivo.js — LA BARRA DE ANÁLISIS DEL PANEL EN VIVO
   ----------------------------------------------------------------------------
   QUÉ ES
   La barra horizontal de filtros que tiene Data Volley en su ventana de
   análisis (manual 9.5): elegís equipo, jugador, fundamento, rotación, set y
   fase, y TODO lo que ves abajo se recalcula al instante.

   POR QUÉ EN UN ARCHIVO APARTE
   panel_vivo.html ya pesa casi un mega y es lo que se abre al costado de la
   cancha. Todo lo de acá LEE y DIBUJA: no toca pushCode, ni persist, ni el
   export, ni la caja negra. Si este archivo no carga —o se rompe— el panel
   sigue funcionando exactamente como antes: la ventana de análisis vuelve
   sola a sus dos botones de siempre.

   CÓMO SE ENGANCHA
   El panel ya tenía la parte difícil hecha:
     · anRallies()  agrupa los códigos en rallies (quién sacó, quién recibió,
                    quién ganó, el marcador, el saque, la recepción)
     · anLeer(c)    desarma cada código en equipo, dorsal, fundamento, tipo,
                    valoración, combinación y zonas
     · anRot(r,l)   da la rotación del equipo en ese rally
   Lo único que faltaba era poder filtrar. Así que se envuelve anRallies() —la
   llama un solo lugar en todo el panel, así que es seguro— y los seis bloques
   de análisis que ya existían pasan a estar filtrados sin tocarles una línea.

   QUÉ FILTRA QUÉ
     Equipo · Set · Rotación · Fase  ->  TODO (los seis bloques y la tabla)
     Jugador · Fundamento            ->  la tabla por jugador
   Está dicho en la barra para que nadie tenga que adivinarlo.
   ========================================================================== */
(function () {
  'use strict';

  /* ── LOS TEXTOS, EN LOS TRES IDIOMAS ──────────────────────────────────────
     El módulo se traduce solo. No toca lang.js a propósito: ese archivo tiene
     el alemán del club ya revisado y verificado, y meterle 25 frases nuevas
     era arriesgar lo que ya funciona para ganar nada. Acá son 25 palabras que
     empiezan y terminan en este archivo, y la barra va marcada data-notr para
     que el motor de idiomas la deje en paz y no traduzca dos veces. */
  var TXT = {
    es: { eq:'Equipo', ju:'Jugador', fu:'Fundamento', ro:'Rotación', se:'Set',
          todo:'Todo', recib:'SIDE OUT', sacan:'TRANSITION', limpiar:'Limpiar',
          todos:'Todos', todas:'Todas', local:'Local', visit:'Visitante',
          S:'Saque', R:'Recepción', A:'Ataque', B:'Bloqueo', D:'Defensa',
          E:'Armado', F:'Freeball',
          tot:'Tot', pos:'Pos%', efi:'Efic%',
          val:'Valoración', tip:'Tipo', mapa:'La cancha',
          desde:'Desde', cae:'Dónde cae', salta:'Dónde salta el bloqueador',
          sSaca:'Desde dónde saca', sRecibe:'Desde dónde le sacan',
          sAtaca:'Desde dónde ataca', sRival:'Desde dónde ataca el rival',
          dDefiende:'Dónde la levanta', red:'RED', zona:'Zona',
          sinZona:'Este fundamento no lleva zonas.',
          combis:'Combinaciones de ataque', llamadas:'Llamadas del armador',
          cuantas:'Cant', reparto:'Reparto', kill:'Punto%', errores:'Error%',
          sinCombi:'En estas acciones no quedó ninguna combinación escrita.',
          sinLlam:'En estos puntos no quedó ninguna llamada escrita.',
          notaCombi:'El reparto es sobre los ataques que quedan con los filtros de arriba. La valoración no filtra acá a propósito: la gracia es ver cómo termina cada combinación.',
          notaLlam:'Cada llamada se mide por el ataque que vino después, en el mismo punto y del mismo equipo. Sólo filtran equipo, rotación, set y fase.',
          sigue:'Ataques',
          verVideo:'Ver el video', sinVideo:'No hay video cargado. Igual vas a ver la lista.',
          clicNum:'Tocá cualquier número para ver esas acciones en el video.',
          tResumen:'Resumen', tJug:'Jugadores', tCancha:'La cancha', tAtaque:'Ataque',
          tComp:'Comparar', tDir:'Direcciones',
          direcciones:'Por dónde pasa la pelota', pelotas:'pelotas',
          lRinde:'Rinde', lNoRinde:'No rinde', lNormal:'Parejo o pocas pelotas',
          lGrosor:'El grosor es la cantidad', promedio:'Promedio del equipo:',
          sinDir:'Para dibujar las direcciones hacen falta la zona de origen y la de destino. En estas acciones no están las dos.',
          notaDir:'Una flecha por cada camino de la pelota. El grosor es cuántas pelotas fueron por ahí; el color, si ese camino rinde más o menos que el promedio del equipo en ese fundamento. Tocá una flecha para ver esas pelotas.',
          soloTop:'Se dibujan los {n} caminos más usados para que se lea.',
          guardados:'Análisis guardados', guardar:'Guardar este', ponerNombre:'Nombre…',
          ok:'Listo', borrar:'Borrar', yaHay:'Ya hay uno con ese nombre. Se reemplaza.',
          nadaQueGuardar:'Poné al menos un filtro antes de guardar.',
          comparar:'Comparar', porSets:'Sets', porRot:'Rotaciones', porEq:'Equipos',
          elPunto:'Cómo termina el punto', gAcierto:'Ganamos · acierto',
          gError:'Ganamos · error de ellos', pAcierto:'Perdimos · acierto de ellos',
          pError:'Perdimos · error nuestro', total:'Total', sinCerrar:'Sin cerrar',
          ultimos:'Quién cierra el punto', aFavor:'A favor', enContra:'En contra', saldo:'Saldo',
          trasRec:'Qué arma según la recepción',
          notaPunto:'Quién ganó cada punto sale del marcador. El punto se le acredita al # del que ganó y, si no hubo, al error del que perdió. Filtran equipo, rotación, set y fase; jugador, fundamento, tipo y valoración no, porque el punto es del equipo.',
          notaUlt:'A favor: el punto que ganó con esa acción. En contra: el error con el que lo perdió.',
          notaTras:'Las filas son la recepción y las columnas lo que armó después, en el mismo punto. Debajo de cada cantidad, el punto% del ataque que siguió.',
          sinRec:'En estos puntos no hay recepciones con ataque después.',
          notaComp:'Cada casilla: cuántas pelotas y qué rindieron. Positividad en saque, recepción, defensa y freeball; eficiencia en ataque y bloqueo. La columna que se compara no se filtra.',
          verAtaque:'Mostrando el ataque. Elegí otro fundamento arriba para cambiarlo.',
          clicZona:'Tocá una zona para filtrar por ella. Tocala de nuevo para soltarla.',
          porFund:'Por fundamento', porJug:'por jugador',
          ptsDe:'de', puntos:'puntos', acciones:'acciones',
          vacio:'Con estos filtros no quedó ninguna acción.',
          nota:'Jugador y fundamento filtran la tabla de arriba. Equipo, rotación, set y fase filtran todo.' },
    de: { eq:'Team', ju:'Spieler', fu:'Element', ro:'Rotation', se:'Satz',
          todo:'Alles', recib:'SIDE OUT', sacan:'TRANSITION', limpiar:'Zurücksetzen',
          todos:'Alle', todas:'Alle', local:'Heim', visit:'Gast',
          S:'Aufschlag', R:'Annahme', A:'Angriff', B:'Block', D:'Abwehr',
          E:'Zuspiel', F:'Freeball',
          tot:'Ges', pos:'Pos%', efi:'Eff%',
          val:'Bewertung', tip:'Art', mapa:'Das Feld',
          desde:'Von', cae:'Wo er landet', salta:'Wo geblockt wird',
          sSaca:'Von wo aufgeschlagen wird', sRecibe:'Von wo aufgeschlagen wird',
          sAtaca:'Von wo angegriffen wird', sRival:'Von wo der Gegner angreift',
          dDefiende:'Wo abgewehrt wird', red:'NETZ', zona:'Zone',
          sinZona:'Dieses Element hat keine Zonen.',
          combis:'Angriffskombinationen', llamadas:'Zuspielansagen',
          cuantas:'Anz', reparto:'Anteil', kill:'Punkt%', errores:'Fehler%',
          sinCombi:'In diesen Aktionen wurde keine Kombination notiert.',
          sinLlam:'In diesen Punkten wurde keine Ansage notiert.',
          notaCombi:'Der Anteil bezieht sich auf die Angriffe, die nach den Filtern oben übrig bleiben. Die Bewertung filtert hier bewusst nicht.',
          notaLlam:'Jede Ansage wird am Angriff gemessen, der im selben Punkt folgte. Es filtern nur Team, Rotation, Satz und Phase.',
          sigue:'Angriffe',
          verVideo:'Video ansehen', sinVideo:'Kein Video geladen. Die Liste siehst du trotzdem.',
          clicNum:'Auf eine Zahl tippen, um diese Aktionen im Video zu sehen.',
          tResumen:'Übersicht', tJug:'Spieler', tCancha:'Das Feld', tAtaque:'Angriff',
          tComp:'Vergleich', tDir:'Richtungen',
          direcciones:'Wohin der Ball geht', pelotas:'Bälle',
          lRinde:'Bringt', lNoRinde:'Bringt nichts', lNormal:'Neutral oder wenige Bälle',
          lGrosor:'Die Dicke ist die Anzahl', promedio:'Team-Durchschnitt:',
          sinDir:'Für die Richtungen braucht es Start- und Zielzone. In diesen Aktionen fehlt eine davon.',
          notaDir:'Ein Pfeil pro Weg des Balls. Die Dicke ist die Anzahl; die Farbe zeigt, ob dieser Weg über oder unter dem Team-Durchschnitt liegt. Pfeil antippen für die Bälle.',
          soloTop:'Es werden die {n} häufigsten Wege gezeigt.',
          guardados:'Gespeicherte Analysen', guardar:'Diese speichern', ponerNombre:'Name…',
          ok:'Fertig', borrar:'Löschen', yaHay:'Es gibt schon eine mit dem Namen. Sie wird ersetzt.',
          nadaQueGuardar:'Erst einen Filter setzen, dann speichern.',
          comparar:'Vergleich', porSets:'Sätze', porRot:'Rotationen', porEq:'Teams',
          elPunto:'Wie der Punkt endet', gAcierto:'Gewonnen · eigener Punkt',
          gError:'Gewonnen · Fehler des Gegners', pAcierto:'Verloren · Punkt des Gegners',
          pError:'Verloren · eigener Fehler', total:'Gesamt', sinCerrar:'Offen',
          ultimos:'Wer den Punkt beendet', aFavor:'Dafür', enContra:'Dagegen', saldo:'Saldo',
          trasRec:'Zuspiel nach der Annahme',
          notaPunto:'Wer den Punkt gewann, kommt vom Spielstand. Der Punkt zählt für das # des Gewinners, sonst für den Fehler des Verlierers. Es filtern Team, Rotation, Satz und Phase.',
          notaUlt:'Die letzte Aktion jedes Punktes. Dafür: damit gewonnen. Dagegen: damit verloren.',
          notaTras:'Zeilen: die Annahme. Spalten: was danach gespielt wurde. Darunter Punkt% des folgenden Angriffs.',
          sinRec:'In diesen Punkten gibt es keine Annahme mit folgendem Angriff.',
          notaComp:'Jede Zelle: wie viele Bälle und was sie gebracht haben. Positivität bei Aufschlag, Annahme, Abwehr und Freeball; Effizienz bei Angriff und Block.',
          verAtaque:'Angriff wird gezeigt. Oben ein anderes Element wählen.',
          clicZona:'Zone antippen, um danach zu filtern. Nochmal antippen zum Lösen.',
          porFund:'Nach Element', porJug:'nach Spieler',
          ptsDe:'von', puntos:'Punkten', acciones:'Aktionen',
          vacio:'Mit diesen Filtern bleibt keine Aktion übrig.',
          nota:'Spieler und Element filtern die Tabelle oben. Team, Rotation, Satz und Phase filtern alles.' },
    en: { eq:'Team', ju:'Player', fu:'Skill', ro:'Rotation', se:'Set',
          todo:'All', recib:'SIDE OUT', sacan:'TRANSITION', limpiar:'Clear',
          todos:'All', todas:'All', local:'Home', visit:'Away',
          S:'Serve', R:'Reception', A:'Attack', B:'Block', D:'Dig',
          E:'Set', F:'Freeball',
          tot:'Tot', pos:'Pos%', efi:'Eff%',
          val:'Evaluation', tip:'Type', mapa:'The court',
          desde:'From', cae:'Where it lands', salta:'Where the block jumps',
          sSaca:'Serving from', sRecibe:'Served from',
          sAtaca:'Attacking from', sRival:'Opponent attacks from',
          dDefiende:'Dug in', red:'NET', zona:'Zone',
          sinZona:'This skill carries no zones.',
          combis:'Attack combinations', llamadas:'Setter calls',
          cuantas:'Qty', reparto:'Share', kill:'Kill%', errores:'Error%',
          sinCombi:'No combination was written in these actions.',
          sinLlam:'No setter call was written in these points.',
          notaCombi:'The share is over the attacks left by the filters above. Evaluation does not filter here on purpose.',
          notaLlam:'Each call is measured by the attack that followed it, same point, same team. Only team, rotation, set and phase filter here.',
          sigue:'Attacks',
          verVideo:'Watch the video', sinVideo:'No video loaded. You will still get the list.',
          clicNum:'Tap any number to watch those actions on video.',
          tResumen:'Overview', tJug:'Players', tCancha:'The court', tAtaque:'Attack',
          tComp:'Compare', tDir:'Directions',
          direcciones:'Where the ball goes', pelotas:'balls',
          lRinde:'Pays off', lNoRinde:'Does not', lNormal:'Even or few balls',
          lGrosor:'Thickness is the count', promedio:'Team average:',
          sinDir:'Directions need both the starting and the landing zone. These actions do not have both.',
          notaDir:'One arrow per path of the ball. Thickness is how many went that way; colour says whether that path is above or below the team average for that skill. Tap an arrow for those balls.',
          soloTop:'Showing the {n} most used paths so it stays readable.',
          guardados:'Saved analyses', guardar:'Save this one', ponerNombre:'Name…',
          ok:'Done', borrar:'Delete', yaHay:'One with that name exists. It will be replaced.',
          nadaQueGuardar:'Set at least one filter before saving.',
          comparar:'Compare', porSets:'Sets', porRot:'Rotations', porEq:'Teams',
          elPunto:'How the point ends', gAcierto:'Won · our point',
          gError:'Won · their error', pAcierto:'Lost · their point',
          pError:'Lost · our error', total:'Total', sinCerrar:'Open',
          ultimos:'Who ends the point', aFavor:'For', enContra:'Against', saldo:'Net',
          trasRec:'What the setter runs after reception',
          notaPunto:'Who won each point comes from the score. The point is credited to the winner\'s # or, failing that, to the loser\'s error. Team, rotation, set and phase filter here.',
          notaUlt:'The last action of each point. For: it won the point. Against: it lost it.',
          notaTras:'Rows: the reception. Columns: what was run next. Below each count, the kill% of the attack that followed.',
          sinRec:'No receptions with a following attack in these points.',
          notaComp:'Each cell: how many balls and how they went. Positivity for serve, reception, dig and freeball; efficiency for attack and block.',
          verAtaque:'Showing attack. Pick another skill above to change it.',
          clicZona:'Tap a zone to filter by it. Tap again to release.',
          porFund:'By skill', porJug:'by player',
          ptsDe:'of', puntos:'points', acciones:'actions',
          vacio:'No action left with these filters.',
          nota:'Player and skill filter the table above. Team, rotation, set and phase filter everything.' }
  };
  function L(){
    var l = 'es';
    try { l = (typeof getLang === 'function') ? getLang() : 'es'; } catch(e){}
    return TXT[l] || TXT.es;
  }

  /* Si el panel no está (o todavía no cargó), no hacemos nada. */
  if (typeof window === 'undefined') return;

  var AV = {
    lado: 'home',
    jug: '',      /* dorsal, '' = todos            */
    fund: '',     /* S R A B D E F, '' = todos     */
    rot: '',      /* 1..6, '' = todas              */
    set: '',      /* 1..5, '' = todos              */
    fase: '',     /* 'so' side out · 'bp' transition · '' todo */
    tipo: '',     /* letras del tipo, p.ej. 'MH' = flotado. '' = todos */
    ev: '',       /* # + ! - / = ,  '' = todas        */
    zi: '',       /* zona de origen,  '' = todas      */
    zf: ''        /* zona de destino, '' = todas      */
  };
  window.AV = AV;

  var SK = ['S','R','A','B','D','E','F'];
  function FUNDS(){ var t = L(); return SK.map(function(k){ return [k, t[k]]; }); }
  var EV = ['#','+','!','-','/','='];

  /* ── LOS TIPOS ────────────────────────────────────────────────────────────
     Las agrupaciones de letras son EXACTAMENTE las de ST_TIPOS en el panel
     (M y H flotado, Q y T potencia), que ya estan verificadas contra los
     datos del club y contra el dashboard. Aca solo se les pone el nombre en
     los tres idiomas; si el panel cambiara sus letras, se cambian aca igual. */
  var TIPOS = {
    es: { S:[['MH','Flotado'],['QT','Potencia']], R:[['MH','Flotado'],['QT','Potencia']],
          A:[['H','Alta'],['Q','Rápida'],['T','Tensa'],['M','Media']] },
    de: { S:[['MH','Flatter']  ,['QT','Sprung']],  R:[['MH','Flatter'],['QT','Sprung']],
          A:[['H','Hoch'],['Q','Schnell'],['T','Flach'],['M','Halbhoch']] },
    en: { S:[['MH','Float']    ,['QT','Jump']],    R:[['MH','Float'],['QT','Jump']],
          A:[['H','High'],['Q','Quick'],['T','Tense'],['M','Half']] }
  };
  function tiposDe(sk){
    var l = 'es';
    try { l = (typeof getLang === 'function') ? getLang() : 'es'; } catch(e){}
    return ((TIPOS[l] || TIPOS.es)[sk]) || [];
  }

  /* ── LAS ZONAS, COMO ESTAN EN LA CANCHA ───────────────────────────────────
     Numeracion del manual, media cancha vista desde afuera, la red arriba:
           4  3  2      <- la fila pegada a la red
           7  8  9
           5  6  1      <- el fondo
     Las dos medias canchas se dibujan al lado, cada una derecha y con su
     color: son dos dibujos distintos, no una cancha partida al medio. */
  var CERCA = [['4','3','2'], ['7','8','9'], ['5','6','1']];

  /* que significan zi y zf en cada fundamento, y de que lado cae cada uno.
     'p' = campo propio, 'r' = campo rival. Sale de como el panel arma la cola:
       S  saco desde mi fondo            -> cae en el campo rival
       R  me sacan desde su fondo        -> cae en mi campo
       A  ataco desde mi campo           -> cae en el campo rival
       D  el rival ataca desde su campo  -> lo levanto en mi campo
       B  no tiene origen: la zona es donde salto el bloqueador, en mi campo */
  var ZONAS = {
    S: { zi:'p', zf:'r' },
    R: { zi:'r', zf:'p' },
    A: { zi:'p', zf:'r' },
    D: { zi:'r', zf:'p' },
    B: { zi:'',  zf:'p' },
    E: null, F: null
  };

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function nom(num, lado){
    try { return (typeof nombreDe === 'function') ? (nombreDe(num, lado) || '') : ''; }
    catch (e) { return ''; }
  }

  /* ── EL FILTRO ────────────────────────────────────────────────────────────
     Sobre los rallies, que es la unidad con la que trabajan todos los bloques.

     Fase: las dos mitades del juego, con el nombre que usa todo el mundo y
     que no se traduce en ningun idioma.
       · SIDE OUT   = mi equipo recibe el saque (el complejo K1)
       · TRANSITION = mi equipo saca, y todo lo que viene despues: bloqueo,
                      defensa y contraataque (el complejo K2)
     Son dos cosas distintas y se miran distinto: en side out se mide cuanto
     rendis con la pelota servida; en transition, cuanto convertis jugando. */
  AV.filtrar = function (rs) {
    var l = AV.lado;
    return (rs || []).filter(function (r) {
      if (AV.set && String(r.set) !== String(AV.set)) return false;
      if (AV.fase === 'so' && r.recibe !== l) return false;
      if (AV.fase === 'bp' && r.saca   !== l) return false;
      if (AV.rot) {
        var rr = 0;
        try { rr = (typeof anRot === 'function') ? anRot(r, l) : 0; } catch (e) { rr = 0; }
        if (String(rr) !== String(AV.rot)) return false;
      }
      return true;
    });
  };

  /* Las acciones del equipo elegido, ya filtradas por jugador y fundamento. */
  AV.acciones = function (rs) {
    var out = [];
    (rs || []).forEach(function (r) {
      (r.acciones || []).forEach(function (a) {
        if (!a || a.lado !== AV.lado) return;
        if (AV.jug  && String(a.num) !== String(AV.jug)) return;
        if (AV.fund && a.sk !== AV.fund) return;
        /* el tipo viene agrupado: 'MH' quiere decir M o H */
        if (AV.tipo && AV.tipo.indexOf(a.tipo) < 0) return;
        if (AV.ev   && a.ev !== AV.ev) return;
        if (AV.zi   && String(a.zi) !== String(AV.zi)) return;
        if (AV.zf   && String(a.zf) !== String(AV.zf)) return;
        out.push(a);
      });
    });
    return out;
  };


  /* ── LOS VIDEOS ──────────────────────────────────────────────────────────
     El panel ya tenia el reproductor de acciones entero hecho —rvAbrir(),
     con corte antes y despues, velocidad, lista y flechas— pero no lo
     llamaba nadie: quedo escrito y sin enganchar. Esto lo engancha.

     Cada numero de las tablas guarda las acciones que lo formaron en
     AV._lotes. Al tocarlo se arma la lista de clips con el formato que pide
     rvAbrir: {i, t, cod, set}. El 'i' es la posicion del codigo en M.codes,
     que es lo que el reproductor usa para ubicarse.

     Si no hay video cargado el reproductor lo dice y muestra igual la lista
     de acciones, que ya es util por si sola. */
  AV._lotes = {};
  AV._lote = 0;

  function lote(acc) {
    if (!acc || !acc.length) return '';
    var id = ++AV._lote;
    AV._lotes[id] = acc;
    return id;
  }
  function numClic(n, acc, extra, cls) {
    var td = '<td' + (cls ? ' class="' + cls + '"' : '') + '>';
    if (!n) return td + '<span class="num">·</span></td>';
    var id = lote(acc);
    if (!id) return td + '<span class="num">' + n + (extra || '') + '</span></td>';
    return td + '<span class="num clic" onclick="AV.ver(' + id + ')" title="' +
           esc(L().verVideo) + '">' + n + (extra || '') + '</span></td>';
  }

  AV.ver = function (id) {
    var acc = AV._lotes[id];
    if (!acc || !acc.length) return;
    var clips = [], codes = [];
    try { codes = (typeof M !== 'undefined' && M && M.codes) ? M.codes : []; } catch (e) { codes = []; }
    acc.forEach(function (a) {
      var c = a._c;
      if (!c) return;
      var i = codes.indexOf(c);
      if (i < 0) return;
      clips.push({ i:i, t:(c.t || 0), cod:String(c.c || ''), set:a.set });
    });
    if (!clips.length) { try { toast(L().sinVideo, true); } catch (e) {} return; }
    var t = L();
    var tit = [ (AV.jug ? '#' + AV.jug + ' ' + nom(AV.jug, AV.lado) : ''),
                (AV.fund ? (t[AV.fund] || '') : ''),
                (AV.rot ? t.ro + ' P' + AV.rot : ''),
                (AV.set ? t.se + ' ' + AV.set : '') ].filter(Boolean).join(' · ');
    try { rvAbrir(clips, tit || t.mapa); }
    catch (e) { try { toast(L().sinVideo, true); } catch (e2) {} }
  };

  /* ── LA TABLA POR JUGADOR Y FUNDAMENTO ───────────────────────────────────
     Es el "Analysis by player, skill and rotation" del manual 9.5.2. Las
     cuentas son las mismas que ya usa el panel en sus tablas, para que los
     números no discutan entre pantallas:
       positividad = (# + +)  / total      (y el / del saque, que es punto)
       eficiencia  = (# - errores) / total */
  function filaDe(rot, acc, sk) {
    var n = acc.length;
    if (!n) return '';
    var c = {}, porEv = {};
    EV.forEach(function (e) {
      porEv[e] = acc.filter(function (a) { return a.ev === e; });
      c[e] = porEv[e].length;
    });
    var usaPos = 'SRDF'.indexOf(sk) >= 0;
    var pos = c['#'] + c['+'] + (sk === 'S' ? c['/'] : 0);
    var err = c['='] + (['A','B'].indexOf(sk) >= 0 ? c['/'] : 0);
    var posP = Math.round(pos / n * 100);
    var efP  = Math.round((c['#'] - err) / n * 100);
    return '<tr><td class="k">' + esc(rot) + '</td>' +
           numClic(n, acc) +
           EV.map(function (e) { return numClic(c[e], porEv[e]); }).join('') +
           '<td><span class="num pos">' + (usaPos ? posP + '%' : '·') + '</span></td>' +
           '<td><span class="num ' + (efP < 0 ? 'neg' : 'pos') + '">' +
             (usaPos ? '·' : efP + '%') + '</span></td></tr>';
  }

  AV.tabla = function (rs) {
    var acc = AV.acciones(rs);
    if (!acc.length) {
      return '<div class="av-vacio">' + esc(L().vacio) + '</div>';
    }
    var t = L();
    var cab = '<tr><th class="k"></th><th>' + esc(t.tot) + '</th>' +
              EV.map(function (e) { return '<th>' + e + '</th>'; }).join('') +
              '<th>' + esc(t.pos) + '</th><th>' + esc(t.efi) + '</th></tr>';
    var cuerpo = '';

    if (AV.jug) {
      /* un jugador: una fila por fundamento */
      FUNDS().forEach(function (f) {
        cuerpo += filaDe(f[1], acc.filter(function (a) { return a.sk === f[0]; }), f[0]);
      });
    } else if (AV.fund) {
      /* un fundamento: una fila por jugador */
      var nums = [];
      acc.forEach(function (a) { if (nums.indexOf(a.num) < 0) nums.push(a.num); });
      nums.sort(function (x, y) { return x - y; });
      nums.forEach(function (nu) {
        var q = nom(nu, AV.lado);
        cuerpo += filaDe('#' + nu + (q ? ' ' + q : ''),
                         acc.filter(function (a) { return a.num === nu; }), AV.fund);
      });
    } else {
      /* todo: una fila por fundamento, como el informe de siempre */
      FUNDS().forEach(function (f) {
        cuerpo += filaDe(f[1], acc.filter(function (a) { return a.sk === f[0]; }), f[0]);
      });
    }
    if (!cuerpo) return '<div class="av-vacio">' + esc(t.vacio) + '</div>';

    var tit = AV.jug ? ('#' + AV.jug + ' ' + nom(AV.jug, AV.lado))
            : (AV.fund ? (t[AV.fund] || '') + ' · ' + t.porJug
                       : t.porFund);
    return '<div class="an-s av-tabla" data-notr><h4>' + esc(tit) + '</h4>' +
           '<table class="st">' + cab + cuerpo + '</table></div>';
  };


  /* ── EL MAPA DE LA CANCHA ────────────────────────────────────────────────
     Las dos mitades, con la red en el medio y el campo lejano espejado para
     que el dibujo sea fisicamente correcto: el 4 de uno queda enfrente del 2
     del otro. El numero de la zona va escrito en cada casilla, asi que aunque
     alguien lea el dibujo al reves el dato sigue siendo el mismo.

     Cada casilla dice cuantas pelotas y que rindieron, con la misma cuenta
     que la tabla de arriba: positividad en saque, recepcion, defensa y
     freeball; eficiencia en ataque y bloqueo. Tocarla filtra por esa zona. */

  function celdaZona(z, lista, cual, sk, maxN, rgb) {
    var n = lista.length;
    var t = L();
    if (!n) {
      return '<div class="av-z vacia"><span class="zn">' + esc(z) + '</span></div>';
    }
    rgb = rgb || '56,189,248';
    var c = {};
    EV.forEach(function (e) { c[e] = lista.filter(function (a) { return a.ev === e; }).length; });
    var usaPos = 'SRDF'.indexOf(sk) >= 0;
    var pos = c['#'] + c['+'] + (sk === 'S' ? c['/'] : 0);
    var err = c['='] + (['A','B'].indexOf(sk) >= 0 ? c['/'] : 0);
    var v = usaPos ? Math.round(pos / n * 100) : Math.round((c['#'] - err) / n * 100);
    /* con menos de 3 pelotas el porcentaje no dice nada: se muestra igual,
       pero apagado, para que nadie lea un -100% de una sola bola como un dato */
    var col = n < 3 ? 'poco' : (v >= 45 ? 'ok' : (v >= 20 ? 'med' : 'mal'));
    /* el fondo marca el VOLUMEN, el numero de abajo marca el RENDIMIENTO:
       asi se ve de un vistazo por donde pasa el juego y donde rinde */
    var peso = maxN ? (0.10 + 0.55 * (n / maxN)) : 0.10;
    var act = (String(AV[cual]) === String(z)) ? ' on' : '';
    /* tocar la casilla filtra por la zona; el triangulito de la esquina abre
       esas mismas pelotas en el video, sin tocar el filtro */
    var id = lote(lista);
    return '<div class="av-z' + act + '" style="background:rgba(' + rgb + ',' + peso.toFixed(2) + ')"' +
           ' onclick="AV.zona(\'' + cual + '\',\'' + esc(z) + '\')"' +
           ' title="' + esc(t.zona + ' ' + z + ' · ' + n) + '">' +
           '<span class="zn">' + esc(z) + '</span>' +
           (id ? '<span class="zv" title="' + esc(t.verVideo) + '"' +
                 ' onclick="event.stopPropagation();AV.ver(' + id + ')">&#9654;</span>' : '') +
           '<span class="zc">' + n + '</span>' +
           '<span class="zp ' + col + '">' + v + '%</span></div>';
  }

  /* Una media cancha, en la orientacion de siempre: la red arriba.

     Antes las dos iban una encima de la otra y la de enfrente espejada, para
     que quedaran fisicamente alineadas. Puestas al lado ya no son una cancha
     partida sino dos dibujos aparte —que es como las muestra el Data en sus
     zone charts—, asi que cada una va derecha y se lee sola. Ocupa la mitad
     de alto y se comparan de un vistazo. */
  function grilla(acc, cual, sk, rgb) {
    var porZona = {}, maxN = 0;
    acc.forEach(function (a) {
      var z = a[cual]; if (!z) return;
      (porZona[z] = porZona[z] || []).push(a);
    });
    Object.keys(porZona).forEach(function (z) { if (porZona[z].length > maxN) maxN = porZona[z].length; });
    var h = '<div class="av-media">';
    CERCA.forEach(function (f, i) {
      h += '<div class="av-fila' + (i === 0 ? ' pegada' : '') + '">';
      f.forEach(function (z) { h += celdaZona(z, porZona[z] || [], cual, sk, maxN, rgb); });
      h += '</div>';
    });
    return h + '</div>';
  }

  AV.mapa = function (rs) {
    var t = L();
    /* sin fundamento elegido el mapa muestra el ataque, que es el que todos
       miran primero; se avisa abajo para que nadie crea que es "todo" */
    var sk = AV.fund || 'A';
    var z = ZONAS[sk];
    if (!z) {
      return '<div class="an-s av-mapa" data-notr><h4>' + esc(t.mapa) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinZona) + '</div></div>';
    }

    /* Las acciones del mapa: las mismas de la tabla, pero de este fundamento
       aunque arriba diga "Todos".

       Cada media cancha se dibuja SIN su propio filtro de zona pero CON el de
       la otra. Asi, si tocas la zona 4 de origen, la mitad de arriba te
       muestra donde caen los ataques que salen de la 4 —que es justo lo que
       uno quiere ver— y la de abajo te sigue mostrando todos los origenes,
       con la 4 marcada, para poder cambiar de opinion sin soltar el filtro. */
    function accPara(cual) {
      var gF = AV.fund, gI = AV.zi, gD = AV.zf;
      AV.fund = sk;
      if (cual === 'zi') AV.zi = ''; else AV.zf = '';
      var r = AV.acciones(rs);
      AV.fund = gF; AV.zi = gI; AV.zf = gD;
      return r;
    }

    var rotOrigen = sk === 'S' ? t.sSaca : sk === 'R' ? t.sRecibe
                  : sk === 'A' ? t.sAtaca : sk === 'D' ? t.sRival : '';
    var rotDestino = sk === 'B' ? t.salta : sk === 'D' ? t.dDefiende : t.cae;

    /* Dos colores, uno por cancha, para que no haya que leer el rotulo para
       saber cual es cual: de donde SALE la pelota en naranja, donde TERMINA
       en celeste. Es la misma idea del rojo/azul de siempre, con los dos
       tonos que ya usa la app (--warn y --k-zone). */
    var ROJO = '249,115,22', AZUL = '56,189,248';

    var bloques = [];
    if (z.zi) bloques.push({ cual:'zi', rot:rotOrigen,  rgb:ROJO });
    bloques.push({ cual:'zf', rot:rotDestino, rgb:AZUL });

    var h = '<div class="an-s av-mapa" data-notr><h4>' + esc(t.mapa) + '</h4>' +
            '<div class="av-canchas' + (bloques.length > 1 ? ' dos' : '') + '">';
    bloques.forEach(function (bl) {
      h += '<div class="av-cancha">' +
           '<div class="av-rot" style="color:rgb(' + bl.rgb + ')">' + esc(bl.rot) + '</div>' +
           '<div class="av-redline">' + esc(t.red) + '</div>' +
           grilla(accPara(bl.cual), bl.cual, sk, bl.rgb) +
           '</div>';
    });
    h += '</div><div class="av-nota">' +
         (AV.fund ? '' : esc(t.verAtaque) + ' ') + esc(t.clicZona) + '</div></div>';
    return h;
  };


  /* ── LAS COMBINACIONES Y LAS LLAMADAS ────────────────────────────────────
     Los dos datos que el panel ya venia guardando en cada codigo y que nadie
     mostraba: la combinacion del ataque (W4, Y8, G4...) y la llamada del
     armador (K1, K2...).

     Los nombres NO se inventan: salen de COMBOS y CALLS, que ya estan en el
     panel y son los mismos que van al .dvw en [3ATTACKCOMBINATION] y
     [3SETTERCALL]. Son los nombres que escribio el propio scout, asi que el
     entrenador lee "Rapida en 4" y no "W4". */

  function nombreCombo(c) {
    try { if (typeof COMBOS !== 'undefined' && COMBOS[c] && COMBOS[c].d) return COMBOS[c].d; } catch (e) {}
    /* CALL_DESC es la tabla que el panel escribe en [3SETTERCALL] al exportar;
       CALLS es solo la lista de codigos y repite el codigo como nombre, asi
       que se descarta cuando no agrega nada. */
    try { if (typeof CALL_DESC !== 'undefined' && CALL_DESC[c]) return CALL_DESC[c]; } catch (e) {}
    try { if (typeof CALLS !== 'undefined' && CALLS[c] && CALLS[c] !== c) return CALLS[c]; } catch (e) {}
    return '';
  }

  /* la misma cuenta que la tabla y que el mapa, para que nada discuta */
  function rinde(acc, sk) {
    var n = acc.length, c = {};
    EV.forEach(function (e) { c[e] = acc.filter(function (a) { return a.ev === e; }).length; });
    var err = c['='] + (['A','B'].indexOf(sk) >= 0 ? c['/'] : 0);
    return { n:n, pt:c['#'], err:err,
             kill: n ? Math.round(c['#'] / n * 100) : 0,
             erp:  n ? Math.round(err / n * 100) : 0,
             efi:  n ? Math.round((c['#'] - err) / n * 100) : 0 };
  }
  function pinta(v, bueno, malo) {
    return '<span class="num ' + (v >= bueno ? 'pos' : (v <= malo ? 'neg' : '')) + '">' + v + '%</span>';
  }
  /* al reves: en el error, poco es bueno */
  function pintaErr(v) {
    return '<span class="num ' + (v <= 10 ? 'pos' : (v >= 25 ? 'neg' : '')) + '">' + v + '%</span>';
  }

  AV.combis = function (rs) {
    var t = L();
    /* siempre ataque, y sin el filtro de valoracion: lo que se quiere ver es
       justamente como termina cada combinacion */
    var gF = AV.fund, gE = AV.ev;
    AV.fund = 'A'; AV.ev = '';
    var acc = AV.acciones(rs);
    AV.fund = gF; AV.ev = gE;

    var por = {};
    acc.forEach(function (a) { if (a.llam) (por[a.llam] = por[a.llam] || []).push(a); });
    var claves = Object.keys(por).sort(function (x, y) { return por[y].length - por[x].length; });
    if (!claves.length) {
      return '<div class="an-s av-combi" data-notr><h4>' + esc(t.combis) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinCombi) + '</div></div>';
    }
    var tot = acc.length || 1;
    var h = '<div class="an-s av-combi" data-notr><h4>' + esc(t.combis) + '</h4><table class="st">' +
            '<tr><th class="k"></th><th>' + esc(t.cuantas) + '</th><th>' + esc(t.reparto) + '</th>' +
            '<th>' + esc(t.kill) + '</th><th>' + esc(t.errores) + '</th><th>' + esc(t.efi) + '</th></tr>';
    claves.forEach(function (k) {
      var r = rinde(por[k], 'A'), nm = nombreCombo(k);
      h += '<tr><td class="k"><b>' + esc(k) + '</b>' + (nm ? ' <i>' + esc(nm) + '</i>' : '') + '</td>' +
           numClic(r.n, por[k]) +
           '<td><span class="num">' + Math.round(r.n / tot * 100) + '%</span></td>' +
           '<td>' + pinta(r.kill, 45, 20) + '</td>' +
           '<td>' + pintaErr(r.erp) + '</td>' +
           '<td>' + pinta(r.efi, 35, 10) + '</td></tr>';
    });
    return h + '</table><div class="av-nota">' + esc(t.notaCombi) + '</div></div>';
  };

  AV.llamadas = function (rs) {
    var t = L();
    /* Cada armado con llamada se junta con el ataque que vino despues en el
       mismo punto y del mismo equipo. Es como lo mira el Data: la llamada no
       vale por si sola, vale por lo que termino pasando. */
    var por = {};
    (rs || []).forEach(function (r) {
      var acc = r.acciones || [];
      for (var i = 0; i < acc.length; i++) {
        var a = acc[i];
        if (!a || a.sk !== 'E' || !a.llam) continue;
        if (a.lado !== AV.lado) continue;
        if (AV.jug && String(a.num) !== String(AV.jug)) continue;
        var sig = null;
        for (var j = i + 1; j < acc.length; j++) {
          if (acc[j].sk === 'A' && acc[j].lado === a.lado) { sig = acc[j]; break; }
          if (acc[j].lado !== a.lado) break;   /* la pelota paso al otro lado */
        }
        var e = (por[a.llam] = por[a.llam] || { n:0, atk:[] });
        e.n++;
        if (sig) e.atk.push(sig);
      }
    });
    var claves = Object.keys(por).sort(function (x, y) { return por[y].n - por[x].n; });
    if (!claves.length) {
      return '<div class="an-s av-combi" data-notr><h4>' + esc(t.llamadas) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinLlam) + '</div></div>';
    }
    var h = '<div class="an-s av-combi" data-notr><h4>' + esc(t.llamadas) + '</h4><table class="st">' +
            '<tr><th class="k"></th><th>' + esc(t.cuantas) + '</th><th>' + esc(t.sigue) + '</th>' +
            '<th>' + esc(t.kill) + '</th><th>' + esc(t.errores) + '</th><th>' + esc(t.efi) + '</th></tr>';
    claves.forEach(function (k) {
      var r = rinde(por[k].atk, 'A'), nm = nombreCombo(k);
      h += '<tr><td class="k"><b>' + esc(k) + '</b>' + (nm ? ' <i>' + esc(nm) + '</i>' : '') + '</td>' +
           '<td><span class="num">' + por[k].n + '</span></td>' +
           numClic(r.n, por[k].atk) +
           (r.n ? ('<td>' + pinta(r.kill, 45, 20) + '</td><td>' + pintaErr(r.erp) +
                   '</td><td>' + pinta(r.efi, 35, 10) + '</td>')
                : '<td><span class="num">·</span></td><td><span class="num">·</span></td><td><span class="num">·</span></td>') +
           '</tr>';
    });
    return h + '</table><div class="av-nota">' + esc(t.notaLlam) + '</div></div>';
  };


  /* ── LOS ANALISIS GUARDADOS ──────────────────────────────────────────────
     El "analysis group" del Data: una combinacion de filtros con nombre, que
     se abre con un clic. "Recepcion de Bartholet en P1 en side out" se arma
     una vez y despues es un boton.

     Se guardan en el navegador de cada uno, con save()/load(), que son las
     mismas del panel: si el navegador no deja guardar, save() devuelve false
     y se avisa, en vez de fallar en silencio. */
  var LLAVE_G = 'av_guardados';
  var CAMPOS = ['lado','jug','fund','tipo','ev','rot','set','fase','zi','zf'];

  function leerGuardados() {
    try { if (typeof load === 'function') return load(LLAVE_G, []) || []; } catch (e) {}
    try { return JSON.parse(localStorage.getItem(LLAVE_G) || '[]'); } catch (e) { return []; }
  }
  function escribirGuardados(l) {
    try { if (typeof save === 'function') return save(LLAVE_G, l); } catch (e) {}
    try { localStorage.setItem(LLAVE_G, JSON.stringify(l)); return true; } catch (e) { return false; }
  }

  AV.hayFiltro = function () {
    return CAMPOS.some(function (k) { return k !== 'lado' && AV[k]; });
  };

  AV.guardar = function () {
    var t = L();
    var inp = document.getElementById('av-nom');
    var nom = inp ? String(inp.value || '').trim().slice(0, 40) : '';
    if (!nom) { if (inp) inp.focus(); return; }
    var l = leerGuardados().filter(function (g) { return g.n !== nom; });
    var f = {};
    CAMPOS.forEach(function (k) { f[k] = AV[k]; });
    l.unshift({ n:nom, f:f });
    if (l.length > 24) l = l.slice(0, 24);
    if (!escribirGuardados(l)) { try { toast('No se pudo guardar', true); } catch (e) {} }
    AV._abriendo = false;
    AV.pintar();
  };

  AV.aplicar = function (i) {
    var g = leerGuardados()[i];
    if (!g || !g.f) return;
    CAMPOS.forEach(function (k) { AV[k] = g.f[k] || ''; });
    if (!AV.lado) AV.lado = 'home';
    try { window.AN_LADO = AV.lado; } catch (e) {}
    AV.pintar();
  };

  AV.borrar = function (i) {
    var l = leerGuardados();
    l.splice(i, 1);
    escribirGuardados(l);
    AV.pintar();
  };

  AV.nombrar = function () {
    var t = L();
    if (!AV.hayFiltro()) { try { toast(t.nadaQueGuardar, true); } catch (e) {} return; }
    AV._abriendo = true;
    AV.pintar();
    var inp = document.getElementById('av-nom');
    if (inp) inp.focus();
  };

  AV.chips = function () {
    var t = L(), l = leerGuardados();
    var h = '<div class="av-guard">';
    l.forEach(function (g, i) {
      h += '<span class="av-chip" onclick="AV.aplicar(' + i + ')" title="' + esc(t.guardados) + '">' +
           esc(g.n) +
           '<b onclick="event.stopPropagation();AV.borrar(' + i + ')" title="' + esc(t.borrar) + '">&times;</b>' +
           '</span>';
    });
    if (AV._abriendo) {
      h += '<span class="av-nuevo"><input id="av-nom" placeholder="' + esc(t.ponerNombre) +
           '" maxlength="40" onkeydown="if(event.key===\'Enter\')AV.guardar()">' +
           '<button onclick="AV.guardar()">' + esc(t.ok) + '</button></span>';
    } else {
      h += '<button class="av-mas" onclick="AV.nombrar()">+ ' + esc(t.guardar) + '</button>';
    }
    return h + '</div>';
  };



  /* ── COMO TERMINA EL PUNTO (manual 9.5.6) ────────────────────────────────
     Cada punto se cierra con una accion: un # del que gana o un = del que
     pierde. Lo verifique sobre el partido entero: la ultima accion explica
     166 de los 168 puntos. Los que no cierran —una A! suelta, por ejemplo—
     van a su propia fila "Sin cerrar", que no se inventa nada y las cuentas
     siguen dando.

     Las cuatro columnas son las cuatro maneras de que termine un punto:
       ganamos por acierto nuestro · ganamos por error de ellos
       perdimos por acierto de ellos · perdimos por error nuestro
     Que es exactamente la pregunta del entrenador: ¿ganamos jugando o
     ganamos esperando que se equivoquen? */

  /* A quien se le acredita el punto.

     OJO CON ESTO, que es donde se equivoca cualquiera: la ultima accion del
     punto NO es la que lo gana. Si nosotros rematamos y hacemos el punto, el
     scout igual escribe la defensa fallada del rival, asi que el codigo que
     queda ultimo es un D= de ellos. Clasificar por el ultimo codigo daba
     "ganamos porque ellos se equivocaron" en 63 puntos de 168, cuando en
     realidad muchos eran remates nuestros.

     La regla correcta, que es la de cualquier planilla de voley:
       · si el que GANO el punto tiene un # en ese punto, el punto es de ese #
       · si no, el punto se lo dio el error del que perdio
     Y quien gano no se deduce: sale de r.gano, que viene del codigo de punto
     (*p12:10), o sea del marcador. Por eso las columnas de ganados siempre
     dan exactamente los puntos del partido. */
  function cierre(r) {
    if (!r || !r.gano) return null;
    var acc = r.acciones || [], gana = r.gana || r.gano;
    var pierde = (gana === 'home') ? 'away' : 'home';
    var W = null, E = null;
    for (var i = acc.length - 1; i >= 0; i--) {
      var a = acc[i];
      if (!a) continue;
      /* la recepcion y el armado no hacen el punto aunque lleven #: una
         recepcion perfecta es perfecta, no es un punto. Solo cuentan los
         fundamentos que de verdad pueden cerrar un rally. */
      if (!W && a.lado === gana && a.ev === '#' && 'SABDF'.indexOf(a.sk) >= 0) W = a;
      if (!E && a.lado === pierde &&
          (a.ev === '=' || (a.ev === '/' && (a.sk === 'A' || a.sk === 'B')))) E = a;
    }
    if (W) return { gana:gana, sk:W.sk, lado:gana,   acierto:true,  a:W };
    if (E) return { gana:gana, sk:E.sk, lado:pierde, acierto:false, a:E };
    return null;
  }

  AV.punto = function (rs) {
    var t = L(), l = AV.lado;
    var fil = {}, sinCerrar = 0, tot = [0,0,0,0];
    (rs || []).forEach(function (r) {
      var c = cierre(r);
      if (!c) { sinCerrar++; return; }
      var col = (c.gana === l)
        ? (c.acierto ? 0 : 1)     /* ganamos: acierto nuestro / error de ellos */
        : (c.acierto ? 2 : 3);    /* perdimos: acierto de ellos / error nuestro */
      var f = (fil[c.sk] = fil[c.sk] || [0,0,0,0,[],[],[],[]]);
      f[col]++; tot[col]++;
      f[4 + col].push(c.a);
    });
    var claves = SK.filter(function (k) { return fil[k]; });
    if (!claves.length && !sinCerrar) return '';

    var h = '<div class="an-s av-punto" data-notr><h4>' + esc(t.elPunto) + '</h4><table class="st">' +
            '<tr><th class="k"></th><th>' + esc(t.gAcierto) + '</th><th>' + esc(t.gError) + '</th>' +
            '<th>' + esc(t.pAcierto) + '</th><th>' + esc(t.pError) + '</th></tr>';
    claves.forEach(function (k) {
      var f = fil[k];
      h += '<tr><td class="k">' + esc(t[k]) + '</td>' +
           [0,1,2,3].map(function (i) {
             return numClic(f[i], f[4 + i], '', i < 2 ? 'bien' : 'mal');
           }).join('') + '</tr>';
    });
    h += '<tr class="av-tot"><td class="k">' + esc(t.total) + '</td>' +
         tot.map(function (n) { return '<td><span class="num">' + (n || '·') + '</span></td>'; }).join('') +
         '</tr>';
    h += '</table>';
    if (sinCerrar) h += '<div class="av-nota">' + esc(t.sinCerrar) + ': ' + sinCerrar + '</div>';
    return h + '<div class="av-nota">' + esc(t.notaPunto) + '</div></div>';
  };

  /* ── QUIEN CIERRA EL PUNTO (manual 9.5.13) ───────────────────────────────
     El ultimo golpe de cada punto, por jugador. A favor es el punto que se
     gano con esa accion; en contra, el que se perdio. El saldo es la resta:
     quien suma y quien regala. */
  AV.ultimos = function (rs) {
    var t = L(), l = AV.lado, por = {};
    (rs || []).forEach(function (r) {
      var c = cierre(r);
      if (!c || c.a.lado !== l) return;
      var e = (por[c.a.num] = por[c.a.num] || { a:[], c:[] });
      if (c.acierto) e.a.push(c.a); else e.c.push(c.a);
    });
    var nums = Object.keys(por).sort(function (x, y) {
      return (por[y].a.length + por[y].c.length) - (por[x].a.length + por[x].c.length);
    });
    if (!nums.length) return '';
    var h = '<div class="an-s av-punto" data-notr><h4>' + esc(t.ultimos) + '</h4><table class="st">' +
            '<tr><th class="k"></th><th>' + esc(t.aFavor) + '</th><th>' + esc(t.enContra) + '</th>' +
            '<th>' + esc(t.saldo) + '</th></tr>';
    nums.forEach(function (n) {
      var q = nom(n, l), sal = por[n].a.length - por[n].c.length;
      h += '<tr><td class="k">#' + esc(n) + (q ? ' ' + esc(q) : '') + '</td>' +
           numClic(por[n].a.length, por[n].a, '', 'bien') +
           numClic(por[n].c.length, por[n].c, '', 'mal') +
           '<td><span class="num ' + (sal > 0 ? 'pos' : (sal < 0 ? 'neg' : '')) + '">' +
             (sal > 0 ? '+' : '') + sal + '</span></td></tr>';
    });
    return h + '</table><div class="av-nota">' + esc(t.notaUlt) + '</div></div>';
  };

  /* ── QUE ARMA SEGUN LA RECEPCION (manual 9.5.9) ──────────────────────────
     La pregunta de todo entrenador antes de un partido: con recepcion
     perfecta, ¿a quien va? ¿y cuando la recepcion se complica?
     Filas: como vino la recepcion. Columnas: la combinacion que se armo
     despues, en el mismo punto. Debajo de cada cantidad, el punto% de ese
     ataque, que es lo que dice si la eleccion salio bien. */
  AV.trasRec = function (rs) {
    var t = L(), l = AV.lado;
    var EVR = ['#','+','!','-'];
    var por = {}, combos = {};
    (rs || []).forEach(function (r) {
      var acc = r.acciones || [];
      for (var i = 0; i < acc.length; i++) {
        var a = acc[i];
        if (!a || a.sk !== 'R' || a.lado !== l) continue;
        if (EVR.indexOf(a.ev) < 0) continue;
        var atk = null;
        for (var j = i + 1; j < acc.length; j++) {
          if (acc[j].sk === 'A' && acc[j].lado === l) { atk = acc[j]; break; }
          if (acc[j].lado !== l) break;
        }
        if (!atk) continue;
        var c = atk.llam || '·';
        combos[c] = (combos[c] || 0) + 1;
        ((por[a.ev] = por[a.ev] || {})[c] = (por[a.ev][c] || [])).push(atk);
        break;   /* la primera recepcion del punto es la que manda */
      }
    });
    var cols = Object.keys(combos).sort(function (x, y) { return combos[y] - combos[x]; }).slice(0, 7);
    if (!cols.length) {
      return '<div class="an-s av-punto" data-notr><h4>' + esc(t.trasRec) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinRec) + '</div></div>';
    }
    var h = '<div class="an-s av-punto" data-notr><h4>' + esc(t.trasRec) + '</h4><table class="st">' +
            '<tr><th class="k"></th>' +
            cols.map(function (c) {
              var nm = nombreCombo(c);
              return '<th title="' + esc(nm) + '">' + esc(c) + '</th>';
            }).join('') + '<th>' + esc(t.total) + '</th></tr>';
    EVR.forEach(function (ev) {
      if (!por[ev]) return;
      var totF = [];
      h += '<tr><td class="k"><b class="av-ev-s">' + esc(ev) + '</b></td>';
      cols.forEach(function (c) {
        var lst = (por[ev][c] || []);
        totF = totF.concat(lst);
        if (!lst.length) { h += '<td><span class="num">·</span></td>'; return; }
        var k = Math.round(lst.filter(function (x) { return x.ev === '#'; }).length / lst.length * 100);
        var col = lst.length < 3 ? 'poco' : (k >= 45 ? 'ok' : (k >= 20 ? 'med' : 'mal'));
        h += numClic(lst.length, lst, '<i class="cp ' + col + '">' + k + '%</i>', 'cc');
      });
      h += numClic(totF.length, totF, '', 'k') + '</tr>';
    });
    return h + '</table><div class="av-nota">' + esc(t.notaTras) + '</div></div>';
  };

  /* ── LA COMPARACION ──────────────────────────────────────────────────────
     Los mismos numeros, uno al lado del otro. Tres maneras de cortarlo:
       · por sets        -> como se fue moviendo el partido
       · por rotaciones  -> donde se gana y donde se sufre
       · por equipos     -> nosotros contra ellos, con los mismos filtros
     La columna que se esta comparando no se filtra: si mirás por sets, el
     selector de Set se ignora en este bloque, que es lo unico que tiene
     sentido. Todo lo demas sigue filtrando. */
  AV.comp = 'set';

  AV.verComp = function (m) { AV.comp = m; AV.pintar(); };

  function celdaComp(acc, sk) {
    var n = acc.length;
    if (!n) return '<td><span class="num">·</span></td>';
    var c = {};
    EV.forEach(function (e) { c[e] = acc.filter(function (a) { return a.ev === e; }).length; });
    var usaPos = 'SRDF'.indexOf(sk) >= 0;
    var pos = c['#'] + c['+'] + (sk === 'S' ? c['/'] : 0);
    var err = c['='] + (['A','B'].indexOf(sk) >= 0 ? c['/'] : 0);
    var v = usaPos ? Math.round(pos / n * 100) : Math.round((c['#'] - err) / n * 100);
    var col = n < 3 ? 'poco' : (v >= 45 ? 'ok' : (v >= 20 ? 'med' : 'mal'));
    return numClic(n, acc, '<i class="cp ' + col + '">' + v + '%</i>', 'cc');
  }

  AV.comparar = function (rsTodo) {
    var t = L();
    var modo = AV.comp;

    /* las columnas y, para cada una, como se eligen sus rallies */
    var cols = [];
    if (modo === 'eq') {
      var M_ = {}; try { M_ = (typeof M !== 'undefined' && M) ? M : {}; } catch (e) {}
      cols = [ { et:(M_.home && M_.home.name) || t.local, lado:'home' },
               { et:(M_.away && M_.away.name) || t.visit, lado:'away' } ];
    } else if (modo === 'rot') {
      for (var i = 1; i <= 6; i++) cols.push({ et:'P' + i, rot:String(i) });
    } else {
      var sets = [];
      (rsTodo || []).forEach(function (r) { if (sets.indexOf(r.set) < 0) sets.push(r.set); });
      sets.sort();
      sets.forEach(function (x) { cols.push({ et:t.se + ' ' + x, set:String(x) }); });
    }
    if (!cols.length) return '';

    /* para cada columna, las acciones: se suelta el filtro de la dimension
       que se compara y se respetan todos los demas */
    var datos = cols.map(function (cl) {
      var g = {}; CAMPOS.forEach(function (k) { g[k] = AV[k]; });
      /* comparando equipos se suelta el jugador: el 11 de uno no es el 11
         del otro, y dejarlo puesto compararia dos personas distintas */
      if (modo === 'eq')  { AV.lado = cl.lado; AV.jug = ''; }
      if (modo === 'rot') { AV.rot = cl.rot; }
      if (modo === 'set') { AV.set = cl.set; }
      var acc = AV.acciones(AV.filtrar(AV.todos()));
      CAMPOS.forEach(function (k) { AV[k] = g[k]; });
      return acc;
    });

    var botones = [['set', t.porSets], ['rot', t.porRot], ['eq', t.porEq]].map(function (x) {
      return '<button class="av-f' + (modo === x[0] ? ' on' : '') +
             '" onclick="AV.verComp(\'' + x[0] + '\')">' + esc(x[1]) + '</button>';
    }).join('');

    var h = '<div class="an-s av-comp" data-notr><div class="av-comphd">' +
            '<h4>' + esc(t.comparar) + '</h4><div class="av-fase">' + botones + '</div></div>' +
            '<table class="st"><tr><th class="k"></th>' +
            cols.map(function (cl) { return '<th>' + esc(cl.et) + '</th>'; }).join('') + '</tr>';

    var hubo = false;
    SK.forEach(function (sk) {
      var fila = datos.map(function (acc) {
        return acc.filter(function (a) { return a.sk === sk; });
      });
      if (!fila.some(function (x) { return x.length; })) return;
      hubo = true;
      h += '<tr><td class="k">' + esc(L()[sk]) + '</td>' +
           fila.map(function (acc) { return celdaComp(acc, sk); }).join('') + '</tr>';
    });
    if (!hubo) return '';
    return h + '</table><div class="av-nota">' + esc(t.notaComp) + '</div></div>';
  };

  /* ── LA BARRA ─────────────────────────────────────────────────────────── */
  function opt(v, txt, sel) {
    return '<option value="' + esc(v) + '"' + (String(sel) === String(v) ? ' selected' : '') +
           '>' + esc(txt) + '</option>';
  }

  AV.barra = function (rsTodo) {
    /* OJO: en panel_vivo.html el partido es "let M", asi que existe como M
       pero NO como window.M. Por eso se lee por nombre, no por window. */
    var M_ = {};
    try { M_ = (typeof M !== 'undefined' && M) ? M : {}; } catch (e) { M_ = {}; }
    var t = L();
    var nomLoc = (M_.home && M_.home.name) || t.local;
    var nomVis = (M_.away && M_.away.name) || t.visit;

    /* los dorsales que de verdad aparecen, no el plantel entero */
    var nums = [];
    (rsTodo || []).forEach(function (r) {
      (r.acciones || []).forEach(function (a) {
        if (a && a.lado === AV.lado && nums.indexOf(a.num) < 0) nums.push(a.num);
      });
    });
    nums.sort(function (x, y) { return x - y; });

    var sets = [];
    (rsTodo || []).forEach(function (r) { if (sets.indexOf(r.set) < 0) sets.push(r.set); });
    sets.sort();

    var h = '<div class="av-bar" data-notr>';
    h += '<label>' + esc(t.eq) + '<select onchange="AV.set_(\'lado\',this.value)">' +
           opt('home', nomLoc, AV.lado) + opt('away', nomVis, AV.lado) + '</select></label>';

    h += '<label>' + esc(t.ju) + '<select onchange="AV.set_(\'jug\',this.value)">' + opt('', t.todos, AV.jug);
    nums.forEach(function (n) {
      var q = nom(n, AV.lado);
      h += opt(n, '#' + n + (q ? ' ' + q : ''), AV.jug);
    });
    h += '</select></label>';

    h += '<label>' + esc(t.fu) + '<select onchange="AV.set_(\'fund\',this.value)">' + opt('', t.todos, AV.fund);
    FUNDS().forEach(function (f) { h += opt(f[0], f[1], AV.fund); });
    h += '</select></label>';

    /* El tipo depende del fundamento: el saque es flotado o potencia, el
       ataque es alta, rapida, tensa o media, y el resto no lleva tipo util.
       Por eso el selector aparece solo cuando hay algo para elegir. */
    var tps = AV.fund ? tiposDe(AV.fund) : [];
    if (tps.length) {
      h += '<label>' + esc(t.tip) + '<select onchange="AV.set_(\'tipo\',this.value)">' + opt('', t.todos, AV.tipo);
      tps.forEach(function (x) { h += opt(x[0], x[1], AV.tipo); });
      h += '</select></label>';
    }

    /* La valoracion va con el simbolo pelado a proposito: el mismo signo
       significa distinto en cada fundamento (la / en ataque es bloqueado y
       en bloqueo es invasion), asi que ponerle un nombre unico seria
       mentir. Abajo de la barra se muestra el significado exacto. */
    h += '<label>' + esc(t.val) + '<select class="av-ev" onchange="AV.set_(\'ev\',this.value)">' + opt('', t.todas, AV.ev);
    EV.forEach(function (e) { h += opt(e, e, AV.ev); });
    h += '</select></label>';

    h += '<label>' + esc(t.ro) + '<select onchange="AV.set_(\'rot\',this.value)">' + opt('', t.todas, AV.rot);
    for (var i = 1; i <= 6; i++) h += opt(i, 'P' + i, AV.rot);
    h += '</select></label>';

    h += '<label>' + esc(t.se) + '<select onchange="AV.set_(\'set\',this.value)">' + opt('', t.todos, AV.set);
    sets.forEach(function (s) { h += opt(s, t.se + ' ' + s, AV.set); });
    h += '</select></label>';

    h += '<div class="av-fase">' +
         ['', 'so', 'bp'].map(function (f, i) {
           var r = [t.todo, t.recib, t.sacan][i];
           return '<button class="av-f' + (AV.fase === f ? ' on' : '') +
                  '" onclick="AV.set_(\'fase\',\'' + f + '\')">' + esc(r) + '</button>';
         }).join('') + '</div>';

    h += '<button class="av-limpiar" onclick="AV.limpiar()">' + esc(t.limpiar) + '</button>';
    h += '</div>';
    return h;
  };

  AV.resumen = function (rsTodo, rsFil) {
    var acc = AV.acciones(rsFil), t = L();
    var partes = [];
    if (AV.set)  partes.push(t.se + ' ' + AV.set);
    if (AV.rot)  partes.push(t.ro + ' P' + AV.rot);
    if (AV.fase) partes.push(AV.fase === 'so' ? t.recib : t.sacan);
    if (AV.jug)  partes.push('#' + AV.jug);
    if (AV.fund) partes.push(t[AV.fund] || '');
    if (AV.tipo) {
      var nt = tiposDe(AV.fund).filter(function (x) { return x[0] === AV.tipo; })[0];
      if (nt) partes.push(nt[1]);
    }
    if (AV.ev)   partes.push(AV.ev);
    if (AV.zi)   partes.push(t.desde + ' ' + AV.zi);
    if (AV.zf)   partes.push(t.zona + ' ' + AV.zf);
    var nota = '<div class="av-nota">' +
               ((AV.jug || AV.fund) ? esc(t.nota) + ' ' : '') + esc(t.clicNum) + '</div>';
    /* el significado exacto del simbolo, tal cual lo dice el manual: sale de
       EVAL_MEAN, que ya esta en el panel y ya esta revisado. Solo aparece
       cuando hay fundamento y valoracion elegidos, que es cuando no hay
       ninguna ambiguedad sobre que quiere decir. */
    var signo = '';
    if (AV.fund && AV.ev) {
      try {
        var m = EVAL_MEAN[AV.fund] && EVAL_MEAN[AV.fund][AV.ev];
        if (m) signo = '<div class="av-signo"><b>' + esc(AV.ev) + '</b> ' + esc(m) + '</div>';
      } catch (e) { signo = ''; }
    }
    return '<div class="av-res"><b>' + rsFil.length + '</b> ' + esc(t.ptsDe) + ' ' + (rsTodo || []).length +
           ' ' + esc(t.puntos) + ' &middot; <b>' + acc.length + '</b> ' + esc(t.acciones) +
           (partes.length ? ' &middot; <i>' + esc(partes.join(' · ')) + '</i>' : '') +
           '</div>' + signo + nota;
  };

  AV.set_ = function (k, v) {
    AV[k] = v;
    /* al cambiar de equipo, el jugador elegido ya no existe de ese lado */
    if (k === 'lado') { AV.jug = ''; try { window.AN_LADO = v; } catch (e) {} }
    /* al cambiar de fundamento, el tipo y las zonas del anterior no aplican */
    if (k === 'fund') { AV.tipo = ''; AV.zi = ''; AV.zf = ''; }
    AV.pintar();
  };
  /* tocar una zona la filtra; tocarla de nuevo la suelta */
  AV.zona = function (cual, z) {
    AV[cual] = (String(AV[cual]) === String(z)) ? '' : String(z);
    AV.pintar();
  };
  AV.limpiar = function () {
    AV.jug = ''; AV.fund = ''; AV.rot = ''; AV.set = ''; AV.fase = '';
    AV.tipo = ''; AV.ev = ''; AV.zi = ''; AV.zf = '';
    AV._abriendo = false;
    AV.pintar();
  };



  /* ── LAS DIRECCIONES (manual 9.5.5) ──────────────────────────────────────
     El Directions Chart del Data dibuja UNA LINEA POR GOLPE: con 92 ataques
     quedan 92 lineas cruzadas, un ovillo que hay que mirar un rato para
     sacarle algo. En el propio manual se ve (pagina 122).

     Aca se dibuja UNA FLECHA POR CAMINO: todas las pelotas que fueron de la
     misma zona a la misma zona se juntan en una sola flecha.
       · el GROSOR es cuantas pelotas fueron por ahi
       · el COLOR es como rindieron: verde rinde, rojo no
       · el rojo va ademas PUNTEADO, para que no dependa del color: hay
         entrenadores que no distinguen verde de rojo y el dato tiene que
         entenderse igual
       · el NUMERO va escrito encima, asi que la cantidad nunca depende del
         grosor solo
       · y tocando la flecha salen esas pelotas en el video
     92 ataques quedan en unas quince flechas que se leen de un vistazo.

     La cancha va entera, con la red en el medio, porque una trayectoria
     cruza de un campo al otro. El campo de enfrente va espejado para que
     quede fisicamente alineado: el 4 de uno enfrente del 2 del otro. */

  var DC = { w:252, h:504, c:84 };           /* 3 col x 6 fil de 84 px */

  /* fila y columna de cada zona. Cerca (campo propio) abajo, lejos arriba y
     espejado. Las filas globales van 0..5 de arriba hacia abajo. */
  var FILA_LEJOS = [['1','6','5'], ['9','8','7'], ['2','3','4']];
  var FILA_CERCA = [['4','3','2'], ['7','8','9'], ['5','6','1']];

  function centro(z, lado) {
    var filas = (lado === 'r') ? FILA_LEJOS : FILA_CERCA;
    var base  = (lado === 'r') ? 0 : 3;
    for (var f = 0; f < 3; f++) {
      var c = filas[f].indexOf(String(z));
      if (c >= 0) return { x:(c + 0.5) * DC.c, y:(base + f + 0.5) * DC.c };
    }
    return null;
  }

  /* Una flecha. Sale y llega ACORTADA hacia adentro de la casilla, no desde
     el centro exacto: de la zona 4 salen cinco caminos distintos y, si todos
     arrancan en el mismo punto, se pisan. Acortando en la direccion de cada
     uno se abren solas en abanico, que es lo que hace el Data a mano. */
  function flecha(x1, y1, x2, y2, grueso, color, punteado, id, tit) {
    var dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx*dx + dy*dy) || 1;
    var ux = dx/d, uy = dy/d;
    var pl = Math.max(6, grueso * 2.2);
    var bx = x2 - ux*pl, by = y2 - uy*pl;
    var px = -uy, py = ux, pw = pl * 0.5;
    var punta = [ x2 + ',' + y2,
                  (bx + px*pw).toFixed(1) + ',' + (by + py*pw).toFixed(1),
                  (bx - px*pw).toFixed(1) + ',' + (by - py*pw).toFixed(1) ].join(' ');
    var g = '<g class="av-fl"' + (id ? ' onclick="AV.ver(' + id + ')"' : '') + '>';
    if (tit) g += '<title>' + esc(tit) + '</title>';
    /* una linea invisible y gorda debajo: el dedo en el celular no acierta
       una flecha de dos pixeles */
    g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
         '" stroke="transparent" stroke-width="15"/>';
    g += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) +
         '" stroke="' + color + '" stroke-width="' + grueso.toFixed(2) + '" stroke-linecap="round"' +
         (punteado ? ' stroke-dasharray="' + (grueso*2.6).toFixed(1) + ' ' + (grueso*2.1).toFixed(1) + '"' : '') +
         '/>';
    g += '<polygon points="' + punta + '" fill="' + color + '"/>';
    return g + '</g>';
  }
  function rotulo(x, y, texto) {
    var an = 7 + String(texto).length * 5;
    return '<g class="av-flr"><rect x="' + (x - an/2).toFixed(1) + '" y="' + (y - 7.5).toFixed(1) +
           '" width="' + an + '" height="15" rx="4"/>' +
           '<text class="av-fltxt" x="' + x.toFixed(1) + '" y="' + (y + 3.6).toFixed(1) + '">' +
           esc(texto) + '</text></g>';
  }

  AV.direcciones = function (rs) {
    var t = L();
    var sk = AV.fund || 'A';
    var z = ZONAS[sk];
    if (!z || !z.zi) {
      return '<div class="an-s av-dir" data-notr><h4>' + esc(t.direcciones) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinDir) + '</div></div>';
    }

    var gF = AV.fund; AV.fund = sk;
    var acc = AV.acciones(rs);
    AV.fund = gF;

    /* se juntan por camino: misma zona de salida y misma de llegada */
    var pares = {};
    acc.forEach(function (a) {
      if (!a.zi || !a.zf) return;
      var k = a.zi + '>' + a.zf;
      (pares[k] = pares[k] || []).push(a);
    });
    var claves = Object.keys(pares).sort(function (x, y) { return pares[y].length - pares[x].length; });
    if (!claves.length) {
      return '<div class="an-s av-dir" data-notr><h4>' + esc(t.direcciones) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinDir) + '</div></div>';
    }
    var TOPE = 16, cortado = claves.length > TOPE;
    claves = claves.slice(0, TOPE);
    var maxN = pares[claves[0]].length;

    var usaPos = 'SRDF'.indexOf(sk) >= 0;
    var VERDE = '#4ade80', ROJO = '#f87171', GRIS = '#7b8bb5';

    /* ── EL COLOR ES CONTRA EL PROMEDIO DEL PROPIO EQUIPO ───────────────────
       Con un corte fijo el saque salia todo rojo: el equipo saca 6% de
       positividad, asi que CUALQUIER direccion quedaba debajo del corte y el
       color no decia nada. La pregunta util no es "¿este camino es bueno?"
       sino "¿este camino rinde mas o menos que lo que este equipo rinde
       normalmente?". Asi que el verde y el rojo se miden contra el promedio
       del conjunto que se esta mirando, con un margen para que una diferencia
       chica no pinte nada. Es un diverger con el gris en el medio. */
    function rinde(lst) {
      var n = lst.length; if (!n) return 0;
      var cc = {};
      EV.forEach(function (e) { cc[e] = lst.filter(function (a) { return a.ev === e; }).length; });
      var pos = cc['#'] + cc['+'] + (sk === 'S' ? cc['/'] : 0);
      var err = cc['='] + (['A','B'].indexOf(sk) >= 0 ? cc['/'] : 0);
      return usaPos ? Math.round(pos/n*100) : Math.round((cc['#'] - err)/n*100);
    }
    var base = rinde(acc.filter(function (a) { return a.zi && a.zf; }));
    var MARGEN = 6;   /* seis puntos de diferencia para pintar algo */

    /* la cancha */
    var g = '';
    for (var f = 0; f < 6; f++) for (var c = 0; c < 3; c++) {
      g += '<rect class="av-cz" x="' + (c*DC.c) + '" y="' + (f*DC.c) + '" width="' + DC.c +
           '" height="' + DC.c + '"/>';
      var zz = (f < 3 ? FILA_LEJOS[f] : FILA_CERCA[f-3])[c];
      g += '<text class="av-cn" x="' + (c*DC.c + 6) + '" y="' + (f*DC.c + 14) + '">' + zz + '</text>';
    }
    /* las lineas de 3 m y la red */
    g += '<line class="av-c3" x1="0" y1="' + (DC.c*2) + '" x2="' + DC.w + '" y2="' + (DC.c*2) + '"/>';
    g += '<line class="av-c3" x1="0" y1="' + (DC.c*4) + '" x2="' + DC.w + '" y2="' + (DC.c*4) + '"/>';
    g += '<line class="av-cred" x1="0" y1="' + (DC.c*3) + '" x2="' + DC.w + '" y2="' + (DC.c*3) + '"/>';

    /* Las flechas de menor a mayor, para que las gordas queden encima; y los
       rotulos TODOS AL FINAL, si no cada flecha nueva tapa el numero de la
       anterior. */
    var rotulos = '', cuantos = {};
    claves.slice().reverse().forEach(function (k) {
      var lst = pares[k], n = lst.length;
      var pa = k.split('>');
      var o = centro(pa[0], z.zi), d = centro(pa[1], z.zf);
      if (!o || !d) return;
      var v = rinde(lst);
      var col = (n < 3) ? GRIS
              : (v >= base + MARGEN ? VERDE : (v <= base - MARGEN ? ROJO : GRIS));
      var mal = (col === ROJO);
      var grueso = 1.3 + 4.0 * Math.sqrt(n / maxN);

      /* el abanico: se entra hacia adentro de la casilla en la direccion de
         este camino, asi dos caminos distintos no arrancan en el mismo pixel */
      var dx = d.x - o.x, dy = d.y - o.y, dd = Math.sqrt(dx*dx + dy*dy) || 1;
      var ux = dx/dd, uy = dy/dd;
      var x1 = o.x + ux * DC.c * 0.30, y1 = o.y + uy * DC.c * 0.30;
      var x2 = d.x - ux * DC.c * 0.26, y2 = d.y - uy * DC.c * 0.26;

      g += flecha(x1, y1, x2, y2, grueso, col, mal, lote(lst),
                  pa[0] + ' → ' + pa[1] + ' · ' + n + ' ' + t.pelotas + ' · ' + v + '%');
      /* El numero cerca de la salida, donde las flechas ya estan abiertas.
         Y escalonado: de una misma zona salen varios caminos y, a la misma
         altura, los numeros se encimarian unos con otros. */
      var i = (cuantos[pa[0]] = (cuantos[pa[0]] || 0) + 1) - 1;
      var fr = 0.20 + (i % 4) * 0.115;
      rotulos += rotulo(x1 + (x2-x1)*fr, y1 + (y2-y1)*fr, String(n));
    });
    g += rotulos;

    var svg = '<svg class="av-svg" viewBox="0 0 ' + DC.w + ' ' + DC.h + '" width="' + DC.w +
              '" height="' + DC.h + '" role="img">' + g + '</svg>';

    var leyenda = '<div class="av-ley">' +
      '<div><span class="av-ls" style="background:' + VERDE + '"></span>' + esc(t.lRinde) + '</div>' +
      '<div><span class="av-ls pun" style="background:' + ROJO + '"></span>' + esc(t.lNoRinde) + '</div>' +
      '<div><span class="av-ls" style="background:' + GRIS + '"></span>' + esc(t.lNormal) + '</div>' +
      '<div class="av-lg"><span class="av-lf"></span>' + esc(t.lGrosor) + '</div>' +
      '<div class="av-lb">' + esc(t.promedio) + ' <b>' + base + '%</b></div>' +
      '</div>';

    return '<div class="an-s av-dir" data-notr><h4>' + esc(t.direcciones) + '</h4>' +
           '<div class="av-dirwrap">' + svg + leyenda + '</div>' +
           '<div class="av-nota">' + esc(t.notaDir) +
           (cortado ? ' ' + esc(t.soloTop.replace('{n}', TOPE)) : '') +
           (AV.fund ? '' : ' ' + esc(t.verAtaque)) + '</div></div>';
  };

  /* ── LAS SOLAPAS ─────────────────────────────────────────────────────────
     El Data agrupa sus analisis en un menu: Jugador, Fundamento, Rotacion,
     Zona, Direcciones, Puntos, Combinaciones... Poner todo uno abajo del otro
     era manejable con seis bloques; con quince es un scroll interminable.

     Aca va la misma idea pero al reves: en vez de un menu con submenus donde
     hay que saber de antemano lo que uno busca, cinco solapas con el nombre
     de lo que se ve. El que nunca uso el Data entiende "La cancha" y
     "Jugadores" sin que nadie le explique nada.

     Cambiar de solapa no recalcula nada: los cinco paneles ya estan dibujados
     y solo se muestra uno. Por eso es instantaneo. */
  AV.tab = 'resumen';

  var TABS = [['resumen','tResumen'], ['jug','tJug'], ['cancha','tCancha'],
              ['dir','tDir'], ['ataque','tAtaque'], ['comp','tComp']];

  function panel(id, html) {
    if (!html) return '';
    return '<div class="av-pane" data-av-pane="' + id + '">' + html + '</div>';
  }

  AV.solapas = function () {
    var t = L();
    return '<div class="av-tabs">' + TABS.map(function (x) {
      return '<button class="av-tab' + (AV.tab === x[0] ? ' on' : '') +
             '" data-av-tab="' + x[0] + '" onclick="AV.verTab(\'' + x[0] + '\')">' +
             esc(t[x[1]]) + '</button>';
    }).join('') + '</div>';
  };

  AV.verTab = function (id) {
    AV.tab = id;
    try {
      var hay = false;
      [].forEach.call(document.querySelectorAll('[data-av-pane]'), function (el) {
        var on = el.getAttribute('data-av-pane') === id;
        el.style.display = on ? '' : 'none';
        if (on) hay = true;
      });
      [].forEach.call(document.querySelectorAll('.av-tab'), function (b) {
        b.className = 'av-tab' + (b.getAttribute('data-av-tab') === id ? ' on' : '');
      });
      /* si la solapa quedo vacia —por ejemplo, filtros que no dejan nada—
         no se deja la pantalla en blanco: vuelve al resumen */
      if (!hay && id !== 'resumen') AV.verTab('resumen');
    } catch (e) {}
  };

  /* ── EL ENGANCHE ─────────────────────────────────────────────────────────
     Se envuelve anRallies() para que todo lo de abajo quede filtrado sin
     tocar ninguno de los seis bloques que ya existían. En todo el panel esa
     función se llama en UN solo lugar (dentro de renderAnalisis), así que
     envolverla no puede afectar a nada más: lo verifiqué antes de escribir
     esto. */
  var _rallies = null, _dentro = false;

  AV.todos = function () {
    try { return _rallies ? _rallies() : []; } catch (e) { return []; }
  };

  AV.pintar = function () {
    try {
      if (typeof renderAnalisis === 'function') renderAnalisis();
    } catch (e) { /* si algo falla, la ventana queda como estaba */ }
  };

  AV.instalar = function () {
    if (AV._puesto) return;
    if (typeof window.anRallies !== 'function' || typeof window.renderAnalisis !== 'function') return;

    /* Se envuelve anLeer para colgarle a cada accion el codigo del que
       salio. La propiedad va como NO enumerable a proposito: no aparece en
       Object.keys ni en JSON.stringify, asi que nada de lo que ya funciona
       se entera de que esta ahi. anLeer se llama en un solo lugar del panel,
       adentro de anRallies. */
    if (typeof window.anLeer === 'function' && !AV._leerPuesto) {
      var _leer = window.anLeer;
      window.anLeer = function (c) {
        var o = _leer.apply(this, arguments);
        if (o && typeof o === 'object') {
          try { Object.defineProperty(o, '_c', { value:c, enumerable:false, configurable:true }); }
          catch (e) {}
        }
        return o;
      };
      AV._leerPuesto = true;
    }

    _rallies = window.anRallies;
    window.anRallies = function () {
      var todo = _rallies();
      if (_dentro) return todo;         /* llamadas internas: sin filtrar */
      return AV.filtrar(todo);
    };

    var _render = window.renderAnalisis;
    window.renderAnalisis = function () {
      var r;
      try { r = _render.apply(this, arguments); }
      catch (e) { return; }
      try { AV.decorar(); } catch (e) { /* la barra es un extra: nunca frena el análisis */ }
      return r;
    };

    /* los dos botones viejos (equipo y actualizar) los reemplaza la barra */
    AV._puesto = true;
  };

  AV.decorar = function () {
    var cont = document.getElementById('an-cont');
    if (!cont) return;

    /* la fila vieja de botones: la barra hace las dos cosas y más */
    var viejo = document.getElementById('an-lado');
    if (viejo && viejo.parentNode) viejo.parentNode.style.display = 'none';

    AV._lotes = {}; AV._lote = 0;   /* se rearman en cada dibujado */
    _dentro = true;
    var todo = AV.todos();
    _dentro = false;
    var fil = AV.filtrar(todo);

    var caja = document.getElementById('av-bar');
    if (!caja) {
      caja = document.createElement('div');
      caja.id = 'av-bar';
      caja.setAttribute('data-notr', '');   /* ya viene traducido de arriba */
      cont.parentNode.insertBefore(caja, cont);
    }
    caja.innerHTML = AV.barra(todo) + AV.chips() + AV.resumen(todo, fil) + AV.solapas();

    /* la tabla arriba de todo, que es donde se mira primero, y abajo la
       cancha; los bloques de siempre quedan despues, intactos */
    if (todo.length) {
      /* lo que dibujo el panel de siempre entra al Resumen tal cual, sin
         tocarle una linea: sigue siendo el mismo HTML */
      var viejo = cont.innerHTML;
      cont.innerHTML =
          panel('resumen', AV.punto(fil) + viejo)
        + panel('jug',     AV.tabla(fil) + AV.ultimos(fil))
        + panel('cancha',  AV.mapa(fil))
        + panel('dir',     AV.direcciones(fil))
        + panel('ataque',  AV.combis(fil) + AV.trasRec(fil) + AV.llamadas(fil))
        + panel('comp',    AV.comparar(todo));
      AV.verTab(AV.tab);
    }
  };

  /* los estilos, acá adentro: el panel no se entera */
  var CSS = ''
    + '#av-bar{margin:6px 0 10px}'
    /* ── LAS SOLAPAS ───────────────────────────────────────────────────── */
    + '.av-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-top:10px;'
    +   'border-bottom:1px solid var(--b);padding-bottom:0}'
    + '.av-tab{background:transparent;border:0;border-bottom:2px solid transparent;'
    +   'color:var(--mut);padding:8px 13px;font-size:12px;font-family:inherit;'
    +   'font-weight:700;cursor:pointer;letter-spacing:.3px;margin-bottom:-1px}'
    + '.av-tab:hover{color:var(--fg,#e8edf5)}'
    + '.av-tab.on{color:var(--k-zone,#38bdf8);border-bottom-color:var(--k-zone,#38bdf8)}'
    + '.av-pane{padding-top:4px}'
    /* ── TODO CENTRADO Y JUNTO ─────────────────────────────────────────────
       Las tablas se estiraban a todo el ancho de la ventana: el nombre del
       jugador quedaba a la izquierda del todo y su eficiencia a mil pixeles
       a la derecha, asi que habia que recorrer la pantalla con el dedo para
       leer una fila. Con el ancho limitado las columnas quedan juntas y la
       fila se lee de un vistazo; los numeros van centrados en su columna y
       solo la primera columna —los nombres— queda a la izquierda, que es
       como se leen los nombres. */
    /* el ancho se ajusta a cuantas columnas tiene cada tabla: una de cuatro
       columnas estirada a 940 px queda tan desparramada como la de diez */
    + '.av-tabla,.av-comp{max-width:940px}'
    + '.av-combi{max-width:760px}'
    + '.av-punto{max-width:680px}'
    + '.av-tabla table.st,.av-punto table.st,.av-combi table.st,.av-comp table.st{'
    +   'width:100%;table-layout:auto}'
    + '.av-tabla table.st th,.av-punto table.st th,.av-combi table.st th,'
    +   '.av-comp table.st th{text-align:center}'
    + '.av-tabla table.st td,.av-punto table.st td,.av-combi table.st td,'
    +   '.av-comp table.st td{text-align:center}'
    + '.av-tabla table.st th.k,.av-punto table.st th.k,.av-combi table.st th.k,'
    +   '.av-comp table.st th.k{text-align:left}'
    + '.av-tabla table.st td.k,.av-punto table.st td.k,.av-combi table.st td.k,'
    +   '.av-comp table.st td.k{text-align:left;width:1%;white-space:nowrap;padding-right:18px}'
    + '.av-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end;'
    +   'padding:9px 10px;background:var(--card2);border:1px solid var(--b);border-radius:10px}'
    + '.av-bar label{display:flex;flex-direction:column;gap:4px;font-size:10px;'
    +   'letter-spacing:.8px;text-transform:uppercase;color:var(--mut);font-weight:700}'
    + '.av-bar select{background:var(--card);color:var(--fg,#e8edf5);border:1px solid var(--b);'
    +   'border-radius:7px;padding:6px 8px;font-size:12px;font-family:inherit;min-width:104px;'
    +   'min-height:32px}'
    + '.av-fase{display:flex;gap:0;border:1px solid var(--b);border-radius:7px;overflow:hidden}'
    + '.av-f{background:var(--card);color:var(--mut);border:0;border-right:1px solid var(--b);'
    +   'padding:8px 11px;font-size:11px;font-family:inherit;cursor:pointer;min-height:32px}'
    + '.av-f:last-child{border-right:0}'
    + '.av-f.on{background:var(--k-zone,#38bdf8);color:#04121c;font-weight:800}'
    + '.av-limpiar{margin-left:auto;align-self:center;background:transparent;color:var(--mut);'
    +   'border:1px solid var(--b);border-radius:7px;padding:8px 12px;font-size:11px;'
    +   'font-family:inherit;cursor:pointer;min-height:32px}'
    + '.av-res{margin-top:7px;font-size:11px;color:var(--mut);letter-spacing:.3px}'
    + '.av-res b{color:var(--fg,#e8edf5)}'
    + '.av-res i{color:var(--k-zone,#38bdf8);font-style:normal}'
    + '.av-tabla h4{margin:0 0 6px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-vacio{padding:14px 0;color:var(--mut);font-size:12px}'
    + '.av-tabla table.st td.k{color:var(--fg,#e8edf5);font-weight:600}'
    + '.av-tabla table.st td .num{color:var(--fg,#e8edf5)}'
    + '.av-tabla table.st td .num.pos{color:var(--ok,#22c55e)}'
    + '.av-tabla table.st td .num.neg{color:var(--bad,#ef4444)}'
    + '.av-tabla table.st th{color:var(--mut)}'
    + '.av-nota{margin-top:5px;font-size:10px;color:var(--dim);letter-spacing:.2px}'
    + '.av-combi h4{margin:0 0 6px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-combi table.st td.k{color:var(--fg,#e8edf5);font-weight:600;white-space:nowrap}'
    + '.av-combi table.st td.k b{font-family:monospace;color:var(--k-zone,#38bdf8);margin-right:6px}'
    + '.av-combi table.st td.k i{font-style:normal;color:var(--mut);font-weight:400;font-size:11px}'
    + '.av-combi table.st th{color:var(--mut)}'
    + '.av-combi table.st td .num{color:var(--fg,#e8edf5)}'
    + '.av-combi table.st td .num.pos{color:var(--ok,#22c55e)}'
    + '.av-combi table.st td .num.neg{color:var(--bad,#ef4444)}'
    + 'span.num.clic{cursor:pointer;border-bottom:1px dotted rgba(56,189,248,.5)}'
    + 'span.num.clic:hover{color:var(--k-zone,#38bdf8);border-bottom-color:var(--k-zone,#38bdf8)}'
    + '.av-z .zv{position:absolute;top:2px;right:4px;font-size:9px;color:var(--mut);'
    +   'cursor:pointer;opacity:0;transition:opacity .12s}'
    + '.av-z:hover .zv{opacity:.8}'
    + '.av-z .zv:hover{color:var(--k-zone,#38bdf8);opacity:1}'
    /* ── EL REPRODUCTOR ──────────────────────────────────────────────────
       El panel lo tenia escrito pero sin usar, y por eso tambien sin estilo:
       sus clases .mbox y .mhead no existen en ninguna hoja. Se les da acá el
       mismo aspecto que a las demas ventanas del panel, y solo dentro de
       #m-repro, para no tocarle el estilo a nada mas. */
    + '#m-repro.open{z-index:200}'
    + '#m-repro .mbox{background:var(--sur,#0f172a);border:1px solid var(--b2,#1e293b);'
    +   'border-radius:16px;width:100%;max-height:86vh;overflow:auto;'
    +   'box-shadow:0 18px 50px rgba(0,0,0,.55)}'
    + '#m-repro .mhead{display:flex;justify-content:space-between;align-items:center;'
    +   'gap:10px;padding:13px 14px 10px;border-bottom:1px solid var(--b);'
    +   "font-family:'Barlow Condensed',inherit;font-weight:800;letter-spacing:1.5px;"
    +   'font-size:17px;text-transform:uppercase}'
    + '.av-punto h4{margin:0 0 6px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-punto table.st td.k{color:var(--fg,#e8edf5);font-weight:600;white-space:nowrap}'
    + '.av-punto table.st th{color:var(--mut);font-size:9.5px}'
    + '.av-punto table.st td .num{color:var(--fg,#e8edf5)}'
    + '.av-punto table.st td.bien .num{color:var(--ok,#22c55e)}'
    + '.av-punto table.st td.mal .num{color:var(--bad,#ef4444)}'
    + '.av-punto table.st td.cc .num{color:var(--fg,#e8edf5)}'
    + '.av-punto td.cc .num{color:var(--fg,#e8edf5)}'
    + '.av-punto td.cc i.cp{display:block;font-style:normal;font-size:10px;font-weight:700}'
    + '.av-punto td.cc i.cp.ok{color:var(--ok,#22c55e)}'
    + '.av-punto td.cc i.cp.med{color:var(--warn,#f59e0b)}'
    + '.av-punto td.cc i.cp.mal{color:var(--bad,#ef4444)}'
    + '.av-punto td.cc i.cp.poco{color:var(--mut)}'
    + '.av-punto tr.av-tot td{border-top:1px solid var(--b)}'
    + '.av-punto tr.av-tot .num{color:var(--mut);font-weight:800}'
    + '.av-punto .av-dim,.av-punto .num.av-dim{color:var(--mut)}'
    + '.av-punto .av-ev-s{font-family:monospace;font-size:15px;color:var(--k-zone,#38bdf8)}'
    + '.av-punto table.st td .num.pos{color:var(--ok,#22c55e)}'
    + '.av-punto table.st td .num.neg{color:var(--bad,#ef4444)}'
    + '.av-comphd{display:flex;align-items:center;gap:10px;margin:0 0 7px;flex-wrap:wrap}'
    + '.av-comphd h4{margin:0;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-comp table.st td.k{color:var(--fg,#e8edf5);font-weight:600}'
    + '.av-comp table.st th{color:var(--mut)}'
    + '.av-comp td.cc .num{color:var(--fg,#e8edf5)}'
    + '.av-comp td.cc i.cp{display:block;font-style:normal;font-size:10px;font-weight:700;'
    +   'margin-top:1px}'
    + '.av-comp td.cc i.cp.ok{color:var(--ok,#22c55e)}'
    + '.av-comp td.cc i.cp.med{color:var(--warn,#f59e0b)}'
    + '.av-comp td.cc i.cp.mal{color:var(--bad,#ef4444)}'
    + '.av-comp td.cc i.cp.poco{color:var(--mut)}'
    + '.av-guard{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-top:7px}'
    + '.av-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;font-size:11px;'
    +   'border:1px solid var(--b);border-radius:20px;background:var(--card2);cursor:pointer;'
    +   'color:var(--fg,#e8edf5)}'
    + '.av-chip:hover{border-color:var(--k-zone,#38bdf8)}'
    + '.av-chip b{color:var(--mut);font-weight:700;font-size:13px;line-height:1}'
    + '.av-chip b:hover{color:var(--bad,#ef4444)}'
    + '.av-mas{background:transparent;border:1px dashed var(--b);border-radius:20px;'
    +   'padding:4px 10px;font-size:11px;font-family:inherit;color:var(--mut);cursor:pointer}'
    + '.av-mas:hover{color:var(--k-zone,#38bdf8);border-color:var(--k-zone,#38bdf8)}'
    + '.av-nuevo{display:inline-flex;gap:4px;align-items:center}'
    + '.av-nuevo input{background:var(--card);color:var(--fg,#e8edf5);border:1px solid var(--b);'
    +   'border-radius:20px;padding:4px 10px;font-size:11px;font-family:inherit;width:190px}'
    + '.av-nuevo button{background:var(--k-zone,#38bdf8);color:#04121c;border:0;border-radius:20px;'
    +   'padding:5px 12px;font-size:11px;font-weight:800;font-family:inherit;cursor:pointer}'
    + '.av-signo{margin-top:5px;font-size:11px;color:var(--mut)}'
    + '.av-signo b{font-family:monospace;font-size:13px;color:var(--k-zone,#38bdf8);margin-right:5px}'
    + '.av-bar select.av-ev{min-width:76px;font-family:monospace;font-size:12px}'
    + '.av-mapa h4{margin:0 0 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    /* ── LAS DIRECCIONES ────────────────────────────────────────────────── */
    + '.av-dirwrap{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap}'
    + '.av-svg{display:block;background:var(--card2);border:1px solid var(--b);border-radius:8px}'
    + '.av-cz{fill:none;stroke:var(--b);stroke-width:1}'
    + '.av-cn{fill:var(--fg,#e8edf5);opacity:.3;font-size:10px;font-weight:700;'
    +   'font-family:inherit}'
    + '.av-c3{stroke:var(--b2,rgba(255,255,255,.14));stroke-width:1.5}'
    + '.av-cred{stroke:var(--fg,#e8edf5);stroke-width:2.5;opacity:.75}'
    + '.av-fl{cursor:pointer}'
    + '.av-fl:hover line,.av-fl:hover polygon{filter:brightness(1.35)}'
    + '.av-flr{pointer-events:none}'
    + '.av-flr rect{fill:#0d0d18;opacity:.88}'
    + '.av-fltxt{fill:var(--fg,#e8edf5);font-size:9.5px;font-weight:800;text-anchor:middle;'
    +   'font-family:inherit;pointer-events:none}'
    + '.av-ley{display:flex;flex-direction:column;gap:7px;font-size:11px;color:var(--mut);'
    +   'padding-top:4px}'
    + '.av-ley div{display:flex;align-items:center;gap:7px}'
    + '.av-ls{width:26px;height:4px;border-radius:2px;flex:none}'
    + '.av-ls.pun{background-image:linear-gradient(90deg,currentColor 0 0);'
    +   'mask:repeating-linear-gradient(90deg,#000 0 6px,transparent 6px 10px);'
    +   '-webkit-mask:repeating-linear-gradient(90deg,#000 0 6px,transparent 6px 10px)}'
    + '.av-lg{margin-top:2px}'
    + '.av-lb{margin-top:6px;padding-top:7px;border-top:1px solid var(--b);'
    +   'font-size:11px;color:var(--mut)}'
    + '.av-lb b{color:var(--fg,#e8edf5)}'
    + '.av-lf{width:26px;height:9px;flex:none;background:var(--mut);'
    +   'clip-path:polygon(0 40%,100% 0,100% 100%,0 60%)}'
    + '.av-canchas{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start}'
    + '.av-canchas .av-cancha{flex:1 1 255px;max-width:340px;min-width:225px}'
    + '.av-rot{font-size:9.5px;letter-spacing:.9px;text-transform:uppercase;'
    +   'font-weight:800;margin:0 0 3px}'
    + '.av-redline{font-size:8px;letter-spacing:3px;color:var(--mut);text-align:center;'
    +   'border-bottom:2px solid var(--b2,#1e293b);padding-bottom:2px;margin-bottom:3px}'
    + '.av-media{display:flex;flex-direction:column;gap:3px;margin-bottom:4px}'
    + '.av-fila{display:flex;gap:3px}'
    + '.av-z{flex:1;min-height:50px;border:1px solid var(--b);border-radius:6px;position:relative;'
    +   'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;'
    +   'cursor:pointer;transition:border-color .12s}'
    + '.av-z:hover{border-color:rgba(255,255,255,.45)}'
    + '.av-z.vacia{background:transparent;cursor:default;opacity:.45}'
    + '.av-z.on{border-color:var(--k-zone,#38bdf8);box-shadow:inset 0 0 0 1px var(--k-zone,#38bdf8)}'
    + '.av-z .zn{position:absolute;top:3px;left:5px;font-size:10px;color:var(--fg,#e8edf5);'
    +   'opacity:.55;font-weight:700}'
    + '.av-z .zp.poco{color:var(--mut)}'
    + '.av-z .zc{font-size:16px;font-weight:800;color:var(--fg,#e8edf5);line-height:1}'
    + '.av-z .zp{font-size:10px;font-weight:700}'
    + '.av-z .zp.ok{color:var(--ok,#22c55e)}'
    + '.av-z .zp.med{color:var(--warn,#f59e0b)}'
    + '.av-z .zp.mal{color:var(--bad,#ef4444)}'
    + '.av-red{text-align:center;font-size:9px;letter-spacing:3px;color:var(--mut);'
    +   'border-top:2px solid var(--b);margin:2px 0 9px;padding-top:4px}'
    + '@media(max-width:700px){.av-bar select{min-width:88px}.av-limpiar{margin-left:0}}';

  function estilos() {
    if (document.getElementById('av-css')) return;
    var st = document.createElement('style');
    st.id = 'av-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function arrancar() {
    try { estilos(); AV.instalar(); } catch (e) { /* nunca molesta al panel */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
