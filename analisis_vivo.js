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
          tPlan:'Planilla', tGraf:'Gráficos', tArm:'El armador',
          distArm:'Distribución del armador', todasRot:'Todas', reparto2:'del total',
          notaArm:'Una cancha por rotación, con el armador en esa posición. En cada zona: cuántas pelotas fue, qué porcentaje del reparto de esa rotación, y abajo cuánto rindió ese ataque. Tocá una zona para ver esas pelotas.',
          sinArm:'Todavía no hay ataques con zona de salida para repartir.',
          armadorEs:'Armador', pelotasRot:'pelotas',
          evolucion:'Cómo se fue el set', ventaja:'Ventaja', parciales:'Parciales',
          notaGraf:'La diferencia de puntos a lo largo de cada set. Arriba de la línea vamos ganando, abajo perdiendo. Las marcas son los parciales de 8, 16 y 21. Tocá cualquier punto para ver esa jugada.',
          sinGraf:'Todavía no hay puntos para dibujar.',
          planilla:'La planilla', porJug:'Por jugador', porRot:'Por rotación', porSet:'Por set',
          mostrar:'Mostrar', bajar:'Bajar en Excel', filas:'Filas',
          cTot:'Tot', cAce:'Ace', cErr:'Err', cPunto:'Pto', cBloq:'Bloq', cPos:'Pos%',
          cEfi:'Efic%', cPer:'Perf', cGan:'Ganados', cSaldo:'Saldo', gPuntos:'Puntos', cBP:'BP', cSO:'SO',
          cExc:'Exc%', totalEq:'TOTAL', opErr:'Error rival',
          enCancha:'En cancha', rotRival:'Armador rival en', quitarTodos:'Ninguno',
          tBusc:'Buscar',
          buscar:'Buscar en los códigos', buscarPh:'Escribí parte de un código: *11A · W4 · AT# · a13',
          encontradas:'encontradas', verTodas:'Ver todas', jugadaAJugada:'Jugada por jugada',
          ganoPunto:'Ganó', nadaEncontrado:'Ningún código tiene eso.',
          notaBusc:'La búsqueda mira TODOS los códigos del partido, sin los filtros de arriba: si buscás un código es porque lo querés encontrar. La lista de abajo sí respeta los filtros.',
          notaJugadas:'Cada punto con su marcador y cómo terminó. Tocá uno para verlo entero en el video.',
          excel:'Excel', imprimir:'Imprimir', filtros:'Filtros', sinFiltro:'Partido completo',
          nadaQueBajar:'En esta solapa no hay tablas para bajar.',
          notaCancha:'Elegí uno o más jugadores y quedan sólo los puntos en los que estaban los seis en cancha a la vez. «Armador rival en» deja sólo los puntos con el armador de ellos en esa posición.',
          efArm:'Armado', ordenar:'Ordenar por', oFund:'Fundamento', oJug:'Jugador', oRot:'Rotación',
          sinE:'En este fundamento no hay armado antes.',
          notaTot:'Abajo el total del equipo. «Error rival» son los puntos que ganamos sin hacer nada: su error de saque, de ataque, de bloqueo o de defensa.',
          notaBP:'BP y SO son el saldo de puntos —ganados menos perdidos— en transition y en side out. Dicen si un jugador suma cuando sacamos, cuando recibimos, o en las dos.',
          notaPlan:'Armá la planilla que necesites: elegí las filas y qué fundamentos mostrar. Respeta todos los filtros de arriba y cualquier número se toca para ver el video.',
          sinPlan:'Con estos filtros no quedó nada para la planilla.',
          reglas:'Sólo cuando…', agregarR:'+ Agregar condición', quitarR:'Quitar',
          rAntes:'justo antes hubo', rDesp:'justo después hubo',
          rAAntes:'antes en el punto hubo', rADesp:'después en el punto hubo',
          rEn:'en el punto hubo', rNoEn:'en el punto NO hubo',
          rNos:'nuestro', rEllos:'del rival', rCualq:'de cualquiera',
          rY:'Y', rO:'O', rCualqJ:'cualquiera', rCualqF:'cualquier fundamento',
          rCualqV:'cualquier valoración',
          notaReglas:'Cada condición mira el punto alrededor de la acción. Con Y tienen que cumplirse todas; con O alcanza una. Filtran las acciones, igual que jugador y fundamento.',
          avanzado:'Filtro avanzado', sets2:'Sets', setsG:'Ganados', setsP:'Perdidos',
          fila:'Fila', filaD:'Delantera', filaZ:'Zaguera',
          tramo:'Tramo del set', desde:'desde', hasta:'hasta',
          marcador:'Marcador', mEmpate:'Empatados', mGana:'Vamos ganando',
          mPierde:'Vamos perdiendo', mCerca:'Diferencia 1 o 2', mLejos:'Diferencia 3 o más',
          mFinal:'Los dos en 20 o más', primeraT:'Sólo el primer contraataque',
          cerrar2:'Ocultar',
          direcciones:'Por dónde pasa la pelota', pelotas:'pelotas',
          lRinde:'Rinde', lNoRinde:'No rinde', lNormal:'Parejo o pocas pelotas',
          lGrosor:'El grosor es la cantidad', promedio:'Promedio del equipo:', lCalor:'El fondo es dónde cae',
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
          tPlan:'Tabelle', tGraf:'Grafiken', tArm:'Zuspiel',
          distArm:'Zuspielverteilung', todasRot:'Alle', reparto2:'vom Gesamt',
          notaArm:'Ein Feld pro Rotation. Je Zone: Anzahl, Anteil an der Verteilung dieser Rotation und darunter der Ertrag des Angriffs.',
          sinArm:'Noch keine Angriffe mit Startzone.',
          armadorEs:'Zuspieler', pelotasRot:'Bälle',
          evolucion:'Satzverlauf', ventaja:'Vorsprung', parciales:'Zwischenstände',
          notaGraf:'Die Punktedifferenz im Satzverlauf. Über der Linie in Führung, darunter im Rückstand. Die Marken sind die Zwischenstände 8, 16 und 21.',
          sinGraf:'Noch keine Punkte zum Zeichnen.',
          planilla:'Die Tabelle', porJug:'Nach Spieler', porRot:'Nach Rotation', porSet:'Nach Satz',
          mostrar:'Anzeigen', bajar:'Als Excel laden', filas:'Zeilen',
          cTot:'Ges', cAce:'Ass', cErr:'Feh', cPunto:'Pkt', cBloq:'Block', cPos:'Pos%',
          cEfi:'Eff%', cPer:'Perf', cGan:'Gewonnen', cSaldo:'Saldo', gPuntos:'Punkte', cBP:'BP', cSO:'SO',
          cExc:'Exz%', totalEq:'GESAMT', opErr:'Gegnerfehler',
          enCancha:'Auf dem Feld', rotRival:'Gegn. Zuspieler auf', quitarTodos:'Keiner',
          tBusc:'Suche',
          buscar:'In den Codes suchen', buscarPh:'Teil eines Codes: *11A · W4 · AT# · a13',
          encontradas:'gefunden', verTodas:'Alle ansehen', jugadaAJugada:'Punkt für Punkt',
          ganoPunto:'Gewann', nadaEncontrado:'Kein Code enthält das.',
          notaBusc:'Die Suche geht über ALLE Codes des Spiels, ohne die Filter oben.',
          notaJugadas:'Jeder Punkt mit Spielstand und Ausgang. Antippen für das ganze Video.',
          excel:'Excel', imprimir:'Drucken', filtros:'Filter', sinFiltro:'Ganzes Spiel',
          nadaQueBajar:'In diesem Tab gibt es keine Tabellen.',
          notaCancha:'Spieler wählen: es bleiben nur Punkte, in denen sie gleichzeitig auf dem Feld waren.',
          efArm:'Zuspiel', ordenar:'Sortieren nach', oFund:'Element', oJug:'Spieler', oRot:'Rotation',
          sinE:'Bei diesem Element gibt es kein Zuspiel davor.',
          notaTot:'Unten die Teamsumme. «Gegnerfehler» sind Punkte ohne eigene Aktion.',
          notaBP:'BP und SO sind der Punktesaldo in Transition und im Side Out.',
          notaPlan:'Die Tabelle selbst zusammenstellen: Zeilen und Elemente wählen. Alle Filter oben gelten, und jede Zahl öffnet das Video.',
          sinPlan:'Mit diesen Filtern bleibt nichts für die Tabelle.',
          reglas:'Nur wenn…', agregarR:'+ Bedingung', quitarR:'Entfernen',
          rAntes:'direkt davor war', rDesp:'direkt danach war',
          rAAntes:'vorher im Punkt war', rADesp:'danach im Punkt war',
          rEn:'im Punkt war', rNoEn:'im Punkt war NICHT',
          rNos:'eigen', rEllos:'gegnerisch', rCualq:'egal wer',
          rY:'UND', rO:'ODER', rCualqJ:'egal wer', rCualqF:'egal welches Element',
          rCualqV:'egal welche Bewertung',
          notaReglas:'Jede Bedingung prüft den Punkt rund um die Aktion. Mit UND müssen alle zutreffen, mit ODER genügt eine.',
          avanzado:'Erweiterter Filter', sets2:'Sätze', setsG:'Gewonnen', setsP:'Verloren',
          fila:'Reihe', filaD:'Vorne', filaZ:'Hinten',
          tramo:'Satzabschnitt', desde:'von', hasta:'bis',
          marcador:'Spielstand', mEmpate:'Gleichstand', mGana:'In Führung',
          mPierde:'Im Rückstand', mCerca:'1 oder 2 Punkte', mLejos:'3 oder mehr',
          mFinal:'Beide ab 20', primeraT:'Nur erster Gegenangriff',
          cerrar2:'Ausblenden',
          direcciones:'Wohin der Ball geht', pelotas:'Bälle',
          lRinde:'Bringt', lNoRinde:'Bringt nichts', lNormal:'Neutral oder wenige Bälle',
          lGrosor:'Die Dicke ist die Anzahl', promedio:'Team-Durchschnitt:', lCalor:'Der Hintergrund ist, wo er landet',
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
          tPlan:'Worksheet', tGraf:'Charts', tArm:'The setter',
          distArm:'Setter distribution', todasRot:'All', reparto2:'of total',
          notaArm:'One court per rotation. In each zone: how many balls, the share of that rotation, and below the efficiency of that attack.',
          sinArm:'No attacks with a starting zone yet.',
          armadorEs:'Setter', pelotasRot:'balls',
          evolucion:'How the set went', ventaja:'Lead', parciales:'Partials',
          notaGraf:'The point difference through each set. Above the line you are ahead, below behind. The marks are the 8, 16 and 21 partials. Tap any point for that rally.',
          sinGraf:'No points to draw yet.',
          planilla:'The worksheet', porJug:'By player', porRot:'By rotation', porSet:'By set',
          mostrar:'Show', bajar:'Download for Excel', filas:'Rows',
          cTot:'Tot', cAce:'Ace', cErr:'Err', cPunto:'Pt', cBloq:'Blk', cPos:'Pos%',
          cEfi:'Eff%', cPer:'Perf', cGan:'Won', cSaldo:'Net', gPuntos:'Points', cBP:'BP', cSO:'SO',
          cExc:'Exc%', totalEq:'TOTAL', opErr:'Opp. error',
          enCancha:'On court', rotRival:'Their setter in', quitarTodos:'None',
          tBusc:'Search',
          buscar:'Search the codes', buscarPh:'Part of a code: *11A · W4 · AT# · a13',
          encontradas:'found', verTodas:'Watch all', jugadaAJugada:'Point by point',
          ganoPunto:'Won', nadaEncontrado:'No code contains that.',
          notaBusc:'The search looks at ALL codes of the match, ignoring the filters above.',
          notaJugadas:'Every rally with its score and how it ended. Tap one to watch it whole.',
          excel:'Excel', imprimir:'Print', filtros:'Filters', sinFiltro:'Whole match',
          nadaQueBajar:'No tables to download in this tab.',
          notaCancha:'Pick players: only rallies where they were all on court at once are kept.',
          efArm:'Set', ordenar:'Order by', oFund:'Skill', oJug:'Player', oRot:'Rotation',
          sinE:'This skill has no set before it.',
          notaTot:'Team totals at the bottom. «Opp. error» are points won without an action of ours.',
          notaBP:'BP and SO are the point balance in transition and in side out.',
          notaPlan:'Build the worksheet you need: pick the rows and which skills to show. It respects every filter above, and any number opens the video.',
          sinPlan:'Nothing left for the worksheet with these filters.',
          reglas:'Only when…', agregarR:'+ Add condition', quitarR:'Remove',
          rAntes:'right before there was', rDesp:'right after there was',
          rAAntes:'earlier in the rally there was', rADesp:'later in the rally there was',
          rEn:'in the rally there was', rNoEn:'in the rally there was NO',
          rNos:'ours', rEllos:'theirs', rCualq:'either team',
          rY:'AND', rO:'OR', rCualqJ:'anyone', rCualqF:'any skill',
          rCualqV:'any evaluation',
          notaReglas:'Each condition looks at the rally around the action. With AND all must hold; with OR one is enough.',
          avanzado:'Advanced filter', sets2:'Sets', setsG:'Won', setsP:'Lost',
          fila:'Row', filaD:'Front', filaZ:'Back',
          tramo:'Part of the set', desde:'from', hasta:'to',
          marcador:'Score', mEmpate:'Tied', mGana:'Ahead',
          mPierde:'Behind', mCerca:'1 or 2 apart', mLejos:'3 or more apart',
          mFinal:'Both at 20 or more', primeraT:'First transition only',
          cerrar2:'Hide',
          direcciones:'Where the ball goes', pelotas:'balls',
          lRinde:'Pays off', lNoRinde:'Does not', lNormal:'Even or few balls',
          lGrosor:'Thickness is the count', promedio:'Team average:', lCalor:'The shading is where it lands',
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
    zf: '',       /* zona de destino, '' = todas      */
    /* los del filtro avanzado (manual 9.5, "Advanced filter") */
    sres: '',     /* '' todos · 'g' sets ganados · 'p' perdidos */
    fila: '',     /* '' todas · 'd' delantera · 'z' zaguera     */
    d1: '', d2: '',   /* tramo del set: del punto d1 al d2      */
    marc: '',     /* '' · 'eq' · 'gana' · 'pierde' · 'cerca' · 'lejos' · 'final' */
    pt1: false,   /* solo el primer contraataque del punto      */
    pFilas: 'jug',            /* la planilla: filas por jugador/rotacion/set */
    pCols: 'S,R,A,B,P',       /* que fundamentos muestra                    */
    reglas: [],               /* el motor de reglas (manual 9.5, Code filter) */
    regY: true,               /* true = todas (Y) · false = alguna (O)       */
    earm: '',                 /* efecto del armado que precede (VolleyStation) */
    enc: [],                  /* jugadores que tienen que estar en cancha    */
    rotR: '',                 /* rotacion del armador RIVAL                  */
    orden: 'fund'             /* como se agrupa la tabla: fund · jug · rot   */
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
  /* ── EL MARCADOR ANTES DE CADA PUNTO ─────────────────────────────────────
     anRallies guarda el marcador DESPUES del punto (el codigo *p12:10 se
     escribe al cerrarlo). Para filtrar por "cuando ibamos perdiendo por 3"
     hace falta el marcador con el que se JUGO ese punto, que es el del punto
     anterior del mismo set. Se calcula una vez por dibujado y se cuelga de
     cada rally como propiedad no enumerable, igual que el codigo de cada
     accion: nada de lo que ya existe se entera. */
  function marcar(rs) {
    var antesH = 0, antesA = 0, setAct = null;
    var finSet = {};
    (rs || []).forEach(function (r) {
      if (r.set !== setAct) { setAct = r.set; antesH = 0; antesA = 0; }
      try {
        Object.defineProperty(r, '_mh', { value:antesH, enumerable:false, configurable:true });
        Object.defineProperty(r, '_ma', { value:antesA, enumerable:false, configurable:true });
      } catch (e) {}
      antesH = r.ptsH; antesA = r.ptsA;
      finSet[r.set] = [r.ptsH, r.ptsA];
    });
    /* quien gano cada set, con el marcador del ultimo punto de ese set */
    var gano = {};
    Object.keys(finSet).forEach(function (st) {
      gano[st] = (finSet[st][0] > finSet[st][1]) ? 'home' : 'away';
    });
    (rs || []).forEach(function (r) {
      try { Object.defineProperty(r, '_gs', { value:gano[r.set], enumerable:false, configurable:true }); }
      catch (e) {}
    });
    return rs;
  }
  AV.marcar = marcar;

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
      /* ── EL ARMADOR RIVAL Y LOS JUGADORES EN CANCHA ─────────────────────
         Las dos cosas salen de datos que ya viajan en cada codigo y que
         nadie estaba usando: la rotacion del otro equipo (columnas 9 y 10
         del .dvw) y las dos alineaciones completas (columnas 14 a 25).

         "Armador rival en 2" es la pregunta de scouting de siempre: contra
         que rotacion de ellos rendimos mejor. Y "en cancha" contesta la otra:
         con este seis adentro, ¿como nos fue? */
      if (AV.rotR) {
        var otro = (l === 'home') ? 'away' : 'home';
        var rr2 = 0;
        try { rr2 = (typeof anRot === 'function') ? anRot(r, otro) : 0; } catch (e) { rr2 = 0; }
        if (String(rr2) !== String(AV.rotR)) return false;
      }
      if (AV.enc && AV.enc.length) {
        var a0 = (r.acciones || [])[0];
        var lu = null;
        try { lu = a0 && a0._c ? (l === 'home' ? a0._c.hl : a0._c.al) : null; } catch (e) { lu = null; }
        if (!lu || !lu.some(Boolean)) return false;
        for (var q2 = 0; q2 < AV.enc.length; q2++) {
          if (lu.indexOf(Number(AV.enc[q2])) < 0) return false;
        }
      }
      /* ── el filtro avanzado ──────────────────────────────────────────── */
      if (AV.sres) {
        var g = r._gs;
        if (!g) return false;
        if (AV.sres === 'g' && g !== l) return false;
        if (AV.sres === 'p' && g === l) return false;
      }
      if (AV.d1 || AV.d2) {
        /* el tramo se mide con el marcador mas alto de los dos, que es como
           uno piensa el momento del set: "del 20 al 25" */
        var m = Math.max(r._mh || 0, r._ma || 0);
        if (AV.d1 !== '' && m < Number(AV.d1)) return false;
        if (AV.d2 !== '' && m > Number(AV.d2)) return false;
      }
      if (AV.marc) {
        var mios  = (l === 'home') ? (r._mh || 0) : (r._ma || 0);
        var dellos = (l === 'home') ? (r._ma || 0) : (r._mh || 0);
        var dif = mios - dellos, ad = Math.abs(dif);
        if (AV.marc === 'eq'     && dif !== 0) return false;
        if (AV.marc === 'gana'   && dif <= 0) return false;
        if (AV.marc === 'pierde' && dif >= 0) return false;
        if (AV.marc === 'cerca'  && !(ad === 1 || ad === 2)) return false;
        if (AV.marc === 'lejos'  && ad < 3) return false;
        if (AV.marc === 'final'  && !(mios >= 20 && dellos >= 20)) return false;
      }
      return true;
    });
  };

  /* Las acciones del equipo elegido, ya filtradas por jugador y fundamento. */
  AV.acciones = function (rs) {
    var out = [];
    (rs || []).forEach(function (r) {
      /* "Sólo el primer contraataque" (manual 9.5, Only first transition):
         en los puntos que sacamos nosotros, se queda con las acciones hasta
         el primer ataque nuestro inclusive. Sirve para saber cuánto break
         point se saca con la primera pelota, sin que lo tapen los rallies
         largos. */
      var acts = r.acciones || [];
      if (AV.pt1) {
        if (r.saca !== AV.lado) return;
        var corte = -1;
        for (var i = 0; i < acts.length; i++) {
          if (acts[i] && acts[i].sk === 'A' && acts[i].lado === AV.lado) { corte = i; break; }
        }
        acts = (corte >= 0) ? acts.slice(0, corte + 1) : acts;
      }
      acts.forEach(function (a, _i) {
        if (!a || a.lado !== AV.lado) return;
        if (!pasaReglas(r.acciones || [], (r.acciones || []).indexOf(a))) return;
        if (AV.jug  && String(a.num) !== String(AV.jug)) return;
        if (AV.fund && a.sk !== AV.fund) return;
        /* el tipo viene agrupado: 'MH' quiere decir M o H */
        if (AV.tipo && AV.tipo.indexOf(a.tipo) < 0) return;
        if (AV.ev   && a.ev !== AV.ev) return;
        if (AV.zi   && String(a.zi) !== String(AV.zi)) return;
        if (AV.zf   && String(a.zf) !== String(AV.zf)) return;
        /* Delantera o zaguera, por la zona desde donde salio el golpe.
           Manual 9.5: "Attack row - front row / back row". Las zonas 4, 3 y 2
           son la red; 7, 8 y 9 son los ataques de zaguero. */
        /* ── EFECTO DEL ARMADO (de VolleyStation) ────────────────────────
           Filtra por como vino el armado que precedio a esta accion, dentro
           del mismo punto y del mismo equipo. Sirve para separar lo que el
           atacante resuelve de lo que le dan: un 10% de eficacia con armado
           perfecto y un 10% con armado forzado no son el mismo jugador.

           Lo que NO se puede hacer es el "Set from zone 3" de VolleyStation:
           en estos codigos el armado no lleva zona (187 de 187 vacias), asi
           que no hay de donde sacarla. Cuando el scout la escriba, se agrega. */
        if (AV.earm) {
          var lst2 = r.acciones || [], idx = lst2.indexOf(a), arm = null;
          for (var q = idx - 1; q >= 0; q--) {
            var y = lst2[q];
            if (!y) continue;
            if (y.lado !== a.lado) break;
            if (y.sk === 'E') { arm = y; break; }
          }
          if (!arm || arm.ev !== AV.earm) return;
        }
        if (AV.fila && a.zi) {
          var del = ('432'.indexOf(String(a.zi)) >= 0);
          if (AV.fila === 'd' && !del) return;
          if (AV.fila === 'z' &&  del) return;
        } else if (AV.fila && !a.zi) { return; }
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

    /* ── EL TERCER ORDENAMIENTO (manual 9.5.2) ─────────────────────────────
       El Data ofrece la misma tabla ordenada de tres maneras, y dice que lo
       unico que cambia es el orden en que se presentan los datos:
         por jugador    -> jugador / fundamento / rotacion
         por fundamento -> fundamento / jugador / rotacion
         por rotacion   -> rotacion / jugador / fundamento
       Faltaba la tercera. Aca se elige con un selector arriba de la tabla en
       vez de con tres entradas distintas del menu, que es lo mismo con un
       paso menos. */
    if (AV.orden === 'rot') {
      for (var rr = 1; rr <= 6; rr++) {
        (function (rr) {
          var gR = AV.rot; AV.rot = String(rr);
          var accR = AV.acciones(AV.filtrar(AV.todos()));
          AV.rot = gR;
          if (!accR.length) return;
          cuerpo += '<tr class="av-grp"><td class="k" colspan="11">P' + rr +
                    ' <i>' + accR.length + ' ' + esc(t.acciones) + '</i></td></tr>';
          if (AV.fund) {
            var nums2 = [];
            accR.forEach(function (a) { if (nums2.indexOf(a.num) < 0) nums2.push(a.num); });
            nums2.sort(function (x, y) { return x - y; });
            nums2.forEach(function (nu) {
              var q = nom(nu, AV.lado);
              cuerpo += filaDe('#' + nu + (q ? ' ' + q : ''),
                               accR.filter(function (a) { return a.num === nu; }), AV.fund);
            });
          } else {
            FUNDS().forEach(function (f) {
              cuerpo += filaDe(f[1], accR.filter(function (a) { return a.sk === f[0]; }), f[0]);
            });
          }
        })(rr);
      }
    } else if (AV.orden === 'jug' && !AV.jug) {
      /* por jugador: cada jugador con sus fundamentos debajo */
      var nums3 = [];
      acc.forEach(function (a) { if (nums3.indexOf(a.num) < 0) nums3.push(a.num); });
      nums3.sort(function (x, y) { return x - y; });
      nums3.forEach(function (nu) {
        var accJ = acc.filter(function (a) { return a.num === nu; });
        var q = nom(nu, AV.lado);
        cuerpo += '<tr class="av-grp"><td class="k" colspan="11">#' + nu + (q ? ' ' + esc(q) : '') +
                  ' <i>' + accJ.length + ' ' + esc(t.acciones) + '</i></td></tr>';
        FUNDS().forEach(function (f) {
          cuerpo += filaDe(f[1], accJ.filter(function (a) { return a.sk === f[0]; }), f[0]);
        });
      });
    } else if (AV.jug) {
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

    var porOrden = { fund:t.porFund, jug:t.porJug, rot:t.porRot };
    var tit = AV.jug ? ('#' + AV.jug + ' ' + nom(AV.jug, AV.lado))
            : (AV.fund ? (t[AV.fund] || '') + ' · ' +
                         (AV.orden === 'rot' ? t.oRot : t.porJug).toLowerCase()
                       : (porOrden[AV.orden] || t.porFund));
    var sel = AV.jug ? '' :
      ('<div class="av-orden"><span>' + esc(t.ordenar) + '</span>' +
       [['fund', t.oFund], ['jug', t.oJug], ['rot', t.oRot]].map(function (x) {
         return '<button class="av-plb' + (AV.orden === x[0] ? ' on' : '') +
                '" onclick="AV.set_(\'orden\',\'' + x[0] + '\')">' + esc(x[1]) + '</button>';
       }).join('') + '</div>');
    return '<div class="an-s av-tabla" data-notr><h4>' + esc(tit) + '</h4>' + sel +
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
  var CAMPOS = ['lado','jug','fund','tipo','ev','rot','set','fase','zi','zf',
                'sres','fila','d1','d2','marc','pt1','reglas','regY','earm','orden','enc','rotR'];

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


  /* ── EL MOTOR DE REGLAS (manual 9.5, "Code filter") ──────────────────────
     Es la herramienta mas potente del Data y la mas dificil de usar: te abre
     una ventana donde armas reglas con siete tipos —"it is previous", "it is
     successive", "it is included in the rally", "it is not included", "it is
     equal", "it is in previous ball possession", "it is in successive ball
     possession"— hasta diez a la vez, unidas con AND, OR o una formula a
     mano. Potentisimo. Nadie que recien empieza lo toca.

     Aca es lo mismo escrito como se habla:

         Solo cuando   [justo antes hubo]  [del rival]  [Recepcion]  [#]

     Las cuatro opciones cubren lo mismo que las siete del Data: "justo antes"
     y "justo despues" son previous y successive; "en el punto" y "en el punto
     NO" cubren included, not included y las dos de ball possession, porque el
     equipo ya se elige en la propia condicion; y "es igual" es la barra de
     filtros de arriba, que ya existe.

     Las condiciones filtran ACCIONES, igual que jugador y fundamento. */

  function coincideReg(x, g) {
    if (!x) return false;
    if (g.lado === 'p' && x.lado !== AV.lado) return false;
    if (g.lado === 'r' && x.lado === AV.lado) return false;
    if (g.jug && String(x.num) !== String(g.jug)) return false;
    if (g.sk  && x.sk !== g.sk) return false;
    if (g.ev  && x.ev !== g.ev) return false;
    return true;
  }

  /* ¿esta accion pasa las reglas? acts es la lista del punto, i su posicion */
  function pasaReglas(acts, i) {
    var gs = AV.reglas || [];
    if (!gs.length) return true;
    var res = gs.map(function (g) {
      if (g.cuando === 'antes')  return coincideReg(acts[i-1], g);
      if (g.cuando === 'desp')   return coincideReg(acts[i+1], g);
      /* "antes en el punto" y "despues en el punto" no estan en el Data, y
         son las que la gente quiere de verdad. Ejemplo del propio manual:
         "todos los ataques rapidos despues de la recepcion del libero". Con
         "justo antes" da CERO, porque justo antes del ataque esta el ARMADO,
         no la recepcion. Mirando todo lo anterior del punto, funciona. */
      if (g.cuando === 'aantes') {
        for (var k = 0; k < i; k++) if (coincideReg(acts[k], g)) return true;
        return false;
      }
      if (g.cuando === 'adesp') {
        for (var k2 = i + 1; k2 < acts.length; k2++) if (coincideReg(acts[k2], g)) return true;
        return false;
      }
      var hay = acts.some(function (x, k) { return k !== i && coincideReg(x, g); });
      if (g.cuando === 'noen') return !hay;
      return hay;
    });
    return AV.regY ? res.every(Boolean) : res.some(Boolean);
  }

  AV.masRegla = function () {
    AV.reglas = (AV.reglas || []).concat([{ cuando:'aantes', lado:'', jug:'', sk:'', ev:'' }]);
    AV._avAbierto = true;
    AV.pintar();
  };
  AV.menosRegla = function (i) {
    AV.reglas.splice(i, 1);
    AV.pintar();
  };
  AV.setRegla = function (i, k, v) {
    if (!AV.reglas[i]) return;
    AV.reglas[i][k] = v;
    AV.pintar();
  };
  AV.setY = function (v) { AV.regY = !!v; AV.pintar(); };

  AV.verReglas = function (rsTodo) {
    var t = L();
    var gs = AV.reglas || [];
    var nums = [];
    (rsTodo || []).forEach(function (r) {
      (r.acciones || []).forEach(function (a) { if (a && nums.indexOf(a.num) < 0) nums.push(a.num); });
    });
    nums.sort(function (x, y) { return x - y; });

    var h = '<div class="av-reg"><div class="av-reghd">' +
            '<span>' + esc(t.reglas) + '</span>';
    if (gs.length > 1) {
      h += '<div class="av-fase av-regyo">' +
           '<button class="av-f' + (AV.regY ? ' on' : '') + '" onclick="AV.setY(true)">' + esc(t.rY) + '</button>' +
           '<button class="av-f' + (!AV.regY ? ' on' : '') + '" onclick="AV.setY(false)">' + esc(t.rO) + '</button>' +
           '</div>';
    }
    h += '</div>';

    gs.forEach(function (g, i) {
      h += '<div class="av-regfila">' +
        '<select onchange="AV.setRegla(' + i + ',\'cuando\',this.value)">' +
          opt('antes', t.rAntes, g.cuando) + opt('aantes', t.rAAntes, g.cuando) +
          opt('desp', t.rDesp, g.cuando) + opt('adesp', t.rADesp, g.cuando) +
          opt('en', t.rEn, g.cuando) + opt('noen', t.rNoEn, g.cuando) + '</select>' +
        '<select onchange="AV.setRegla(' + i + ',\'lado\',this.value)">' +
          opt('', t.rCualq, g.lado) + opt('p', t.rNos, g.lado) + opt('r', t.rEllos, g.lado) + '</select>' +
        '<select onchange="AV.setRegla(' + i + ',\'jug\',this.value)">' +
          opt('', t.rCualqJ, g.jug) +
          nums.map(function (n) { return opt(n, '#' + n, g.jug); }).join('') + '</select>' +
        '<select onchange="AV.setRegla(' + i + ',\'sk\',this.value)">' +
          opt('', t.rCualqF, g.sk) +
          FUNDS().map(function (f) { return opt(f[0], f[1], g.sk); }).join('') + '</select>' +
        '<select class="av-ev" onchange="AV.setRegla(' + i + ',\'ev\',this.value)">' +
          opt('', t.rCualqV, g.ev) +
          EV.map(function (e) { return opt(e, e, g.ev); }).join('') + '</select>' +
        '<button class="av-regx" onclick="AV.menosRegla(' + i + ')" title="' + esc(t.quitarR) +
          '">&times;</button>' +
        '</div>';
    });

    h += '<button class="av-mas" onclick="AV.masRegla()">' + esc(t.agregarR) + '</button>';
    if (gs.length) h += '<div class="av-nota">' + esc(t.notaReglas) + '</div>';
    return h + '</div>';
  };

  /* ── EL FILTRO AVANZADO (manual 9.5, "Advanced filter") ──────────────────
     Va plegado: son cinco cosas que no se usan todos los dias, y la barra de
     arriba ya tiene siete selectores. Cuando hay algo puesto se abre solo y
     el boton queda marcado, para que nadie mire numeros filtrados creyendo
     que son del partido entero. */
  AV.hayAvanzado = function () {
    return !!(AV.sres || AV.fila || AV.d1 !== '' || AV.d2 !== '' || AV.marc || AV.pt1 ||
              AV.earm || AV.rotR || (AV.enc && AV.enc.length) ||
              (AV.reglas && AV.reglas.length));
  };

  AV.avanzado = function () {
    var t = L();
    var abierto = AV._avAbierto || AV.hayAvanzado();
    var h = '<div class="av-avwrap">' +
            '<button class="av-mas av-avbtn' + (AV.hayAvanzado() ? ' on' : '') +
            '" onclick="AV.verAv()">' + (abierto ? '▾ ' : '▸ ') + esc(t.avanzado) + '</button>';
    if (!abierto) return h + '</div>';

    h += '<div class="av-avcaja"><div class="av-av">';
    h += '<label>' + esc(t.sets2) + '<select onchange="AV.set_(\'sres\',this.value)">' +
         opt('', t.todos, AV.sres) + opt('g', t.setsG, AV.sres) + opt('p', t.setsP, AV.sres) +
         '</select></label>';

    h += '<label>' + esc(t.fila) + '<select onchange="AV.set_(\'fila\',this.value)">' +
         opt('', t.todas, AV.fila) + opt('d', t.filaD, AV.fila) + opt('z', t.filaZ, AV.fila) +
         '</select></label>';

    h += '<label>' + esc(t.tramo) +
         '<span class="av-dos">' +
         '<input type="number" min="0" max="40" placeholder="' + esc(t.desde) + '" value="' +
           esc(AV.d1) + '" onchange="AV.set_(\'d1\',this.value)">' +
         '<input type="number" min="0" max="40" placeholder="' + esc(t.hasta) + '" value="' +
           esc(AV.d2) + '" onchange="AV.set_(\'d2\',this.value)">' +
         '</span></label>';

    h += '<label>' + esc(t.marcador) + '<select onchange="AV.set_(\'marc\',this.value)">' +
         opt('', t.todo, AV.marc) + opt('eq', t.mEmpate, AV.marc) +
         opt('gana', t.mGana, AV.marc) + opt('pierde', t.mPierde, AV.marc) +
         opt('cerca', t.mCerca, AV.marc) + opt('lejos', t.mLejos, AV.marc) +
         opt('final', t.mFinal, AV.marc) + '</select></label>';

    h += '<label>' + esc(t.rotRival) + '<select onchange="AV.set_(\'rotR\',this.value)">' +
         opt('', t.todas, AV.rotR);
    for (var rv = 1; rv <= 6; rv++) h += opt(rv, 'P' + rv, AV.rotR);
    h += '</select></label>';

    h += '<label>' + esc(t.efArm) + '<select class="av-ev" onchange="AV.set_(\'earm\',this.value)">' +
         opt('', t.todos, AV.earm) +
         EV.map(function (e) { return opt(e, e, AV.earm); }).join('') + '</select></label>';

    h += '<label class="av-chk"><input type="checkbox"' + (AV.pt1 ? ' checked' : '') +
         ' onchange="AV.set_(\'pt1\',this.checked)">' + esc(t.primeraT) + '</label>';
    h += '</div>';

    /* los dorsales que estuvieron en cancha alguna vez, como botones */
    var enCancha = [];
    (AV.todos() || []).forEach(function (r) {
      var a0 = (r.acciones || [])[0];
      var lu = null;
      try { lu = a0 && a0._c ? (AV.lado === 'home' ? a0._c.hl : a0._c.al) : null; } catch (e) {}
      (lu || []).forEach(function (n) { if (n && enCancha.indexOf(n) < 0) enCancha.push(n); });
    });
    enCancha.sort(function (x, y) { return x - y; });
    if (enCancha.length) {
      h += '<div class="av-canc"><span>' + esc(t.enCancha) + '</span>' +
        enCancha.map(function (n) {
          var on = (AV.enc || []).indexOf(n) >= 0;
          var q = nom(n, AV.lado);
          return '<button class="av-plb' + (on ? ' on' : '') + '" title="' + esc(q) +
                 '" onclick="AV.tocarEnc(' + n + ')">' + n + '</button>';
        }).join('') +
        ((AV.enc && AV.enc.length)
          ? '<button class="av-mas" onclick="AV.set_(\'enc\',[])">' + esc(t.quitarTodos) + '</button>'
          : '') +
        '</div>';
    }

    h += AV.verReglas(AV.todos()) + '</div>';
    return h;
  };

  AV.tocarEnc = function (n) {
    var l = (AV.enc || []).slice();
    var i = l.indexOf(n);
    if (i >= 0) l.splice(i, 1); else l.push(n);
    AV.enc = l;
    AV.pintar();
  };

  AV.verAv = function () {
    AV._avAbierto = !(AV._avAbierto || AV.hayAvanzado());
    AV.pintar();
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
    if (AV.sres) partes.push(AV.sres === 'g' ? t.setsG : t.setsP);
    if (AV.fila) partes.push(AV.fila === 'd' ? t.filaD : t.filaZ);
    if (AV.d1 !== '' || AV.d2 !== '')
      partes.push(t.tramo + ' ' + (AV.d1 === '' ? '0' : AV.d1) + '-' + (AV.d2 === '' ? '∞' : AV.d2));
    if (AV.marc) partes.push({eq:t.mEmpate, gana:t.mGana, pierde:t.mPierde,
                              cerca:t.mCerca, lejos:t.mLejos, final:t.mFinal}[AV.marc] || '');
    if (AV.pt1)  partes.push(t.primeraT);
    if (AV.earm) partes.push(t.efArm + ' ' + AV.earm);
    if (AV.rotR) partes.push(t.rotRival + ' P' + AV.rotR);
    if (AV.enc && AV.enc.length) partes.push(t.enCancha + ' ' + AV.enc.join('+'));
    if (AV.reglas && AV.reglas.length)
      partes.push(t.reglas.replace('…','') + ' (' + AV.reglas.length + ')');
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
    AV.sres = ''; AV.fila = ''; AV.d1 = ''; AV.d2 = ''; AV.marc = ''; AV.pt1 = false;
    AV.reglas = []; AV.regY = true; AV.earm = ''; AV.enc = []; AV.rotR = '';
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

    /* ── EL CALOR, DEBAJO DE LAS FLECHAS ───────────────────────────────────
       Un mapa de calor y una flecha contestan cosas distintas: el calor dice
       DONDE cae la pelota, la flecha dice DE DONDE SALIO la que cayo ahi. El
       calor solo pierde el par origen-destino, que es justamente el dato; las
       flechas solas cuestan mas de leer cuando uno quiere ver la zona mas
       castigada de un vistazo.

       Asi que van las dos cosas en el mismo dibujo: el fondo de cada casilla
       pintado por cuanta pelota cae ahi, y las flechas encima. Una sola
       imagen y las dos lecturas.

       Nota sobre la resolucion: el .dvw guarda tambien SUBZONA (A, B, C, D
       dentro de cada zona), que permitiria un calor cuatro veces mas fino.
       En este partido la subzona esta escrita en el 24% de los ataques y en
       el 1% de los saques, asi que dibujarla seria pintar un cuarto de las
       pelotas como si fueran todas. Cuando el scout la escriba siempre, se
       hace y queda mejor que cualquiera de los dos programas. */
    var calor = {}, maxCal = 0;
    acc.forEach(function (a) {
      if (!a.zi || !a.zf) return;
      calor[a.zf] = (calor[a.zf] || 0) + 1;
    });
    Object.keys(calor).forEach(function (z) { if (calor[z] > maxCal) maxCal = calor[z]; });

    var g = '';
    for (var f = 0; f < 6; f++) for (var c = 0; c < 3; c++) {
      var zz = (f < 3 ? FILA_LEJOS[f] : FILA_CERCA[f-3])[c];
      /* solo se pinta el campo donde CAE la pelota */
      var esDestino = (z.zf === 'r') ? (f < 3) : (f >= 3);
      var n = esDestino ? (calor[zz] || 0) : 0;
      var op = (n && maxCal) ? (0.06 + 0.34 * (n / maxCal)) : 0;
      if (op) {
        g += '<rect x="' + (c*DC.c) + '" y="' + (f*DC.c) + '" width="' + DC.c +
             '" height="' + DC.c + '" fill="#38bdf8" opacity="' + op.toFixed(3) + '"/>';
      }
      g += '<rect class="av-cz" x="' + (c*DC.c) + '" y="' + (f*DC.c) + '" width="' + DC.c +
           '" height="' + DC.c + '"/>';
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
      '<div class="av-lg"><span class="av-lc"></span>' + esc(t.lCalor) + '</div>' +
      '<div class="av-lb">' + esc(t.promedio) + ' <b>' + base + '%</b></div>' +
      '</div>';

    return '<div class="an-s av-dir" data-notr><h4>' + esc(t.direcciones) + '</h4>' +
           '<div class="av-dirwrap">' + svg + leyenda + '</div>' +
           '<div class="av-nota">' + esc(t.notaDir) +
           (cortado ? ' ' + esc(t.soloTop.replace('{n}', TOPE)) : '') +
           (AV.fund ? '' : ' ' + esc(t.verAtaque)) + '</div></div>';
  };


  /* ── LA PLANILLA (manual 9.5.8, "Worksheet") ─────────────────────────────
     El Worksheet del Data es una planilla PROGRAMABLE: celdas vacias donde el
     entrenador escribe formulas algebraicas, con un asistente de formulas,
     funciones matematicas y macros. Es potentisimo y no lo usa casi nadie:
     hay que aprender un lenguaje de formulas para sacarle algo.

     Lo que la gente de verdad quiere del Worksheet es una sola cosa: "armame
     la tabla que YO necesito". Asi que eso es lo que hay aca, sin lenguaje:
     se elige que va en las filas —jugadores, rotaciones o sets— y que
     fundamentos aparecen como columnas. Respeta todos los filtros de arriba,
     cualquier numero se toca para ver el video, y se baja en un archivo que
     abre Excel.

     Lo que NO tiene, y lo digo para que nadie lo busque: formulas propias,
     funciones matematicas y macros. Si alguna vez hace falta una cuenta que
     no este, se agrega como columna de verdad y no como formula escrita a
     mano, que es donde el Data se vuelve inmanejable. */

  var COLS = [
    ['S', 'S', ['cTot','cAce','cErr','cPos']],
    ['R', 'R', ['cTot','cPer','cErr','cPos','cExc']],
    ['A', 'A', ['cTot','cPunto','cBloq','cErr','cEfi']],
    ['B', 'B', ['cTot','cPunto','cErr']],
    ['D', 'D', ['cTot','cPos']],
    ['E', 'E', ['cTot']],
    /* ── DE VOLLEYSTATION: BP Y SO ─────────────────────────────────────────
       VolleyStation parte los puntos de cada jugador en break point y side
       out (su manual, 4.2: "BP - Points won or lost break point · pS - Points
       won or lost side out"). Ni el Data ni nosotros lo teniamos, y es una
       pregunta que un entrenador se hace todo el tiempo: este jugador, ¿suma
       cuando sacamos nosotros o solo cuando recibimos?
       Aca va como saldo —ganados menos perdidos— en cada fase. */
    ['P', 'P', ['cGan','cErr','cSaldo','cBP','cSO']]
  ];

  function colsOn() {
    var l = String(AV.pCols || '').split(',');
    return COLS.filter(function (c) { return l.indexOf(c[0]) >= 0; });
  }

  /* las celdas de un fundamento para una lista de acciones */
  function celdasSk(acc, sk, campos) {
    var n = acc.length;
    var c = {}, por = {};
    EV.forEach(function (e) {
      por[e] = acc.filter(function (a) { return a.ev === e; });
      c[e] = por[e].length;
    });
    var pos = c['#'] + c['+'] + (sk === 'S' ? c['/'] : 0);
    var err = c['='] + (['A','B'].indexOf(sk) >= 0 ? c['/'] : 0);
    var out = [];
    campos.forEach(function (k) {
      if (k === 'cTot')   out.push([n, acc]);
      else if (k === 'cAce' || k === 'cPunto' || k === 'cPer') out.push([c['#'], por['#']]);
      else if (k === 'cErr')  out.push([c['='], por['=']]);
      else if (k === 'cBloq') out.push([c['/'], por['/']]);
      else if (k === 'cPos')  out.push([n ? Math.round(pos/n*100) + '%' : null, null]);
      /* Exc% es de VolleyStation: Pos% mete # y +, Exc% cuenta solo las
         perfectas. Separadas dicen cosas distintas: un equipo puede recibir
         muy positivo y perfecto casi nunca, y el armador lo sufre. */
      else if (k === 'cExc')  out.push([n ? Math.round(c['#']/n*100) + '%' : null, null]);
      else if (k === 'cEfi')  out.push([n ? Math.round((c['#'] - err)/n*100) + '%' : null, null]);
      else out.push([null, null]);
    });
    return out;
  }

  /* ── las filas ──────────────────────────────────────────────────────────
     Cada fila es un conjunto de puntos y, dentro, sus acciones. Con eso
     alcanza para las tres maneras de partir la planilla. */
  function filasPlan(rs) {
    var l = AV.lado, out = [];
    if (AV.pFilas === 'rot') {
      for (var i = 1; i <= 6; i++) {
        (function (i) {
          var sub = (rs || []).filter(function (r) {
            var rr = 0;
            try { rr = (typeof anRot === 'function') ? anRot(r, l) : 0; } catch (e) {}
            return String(rr) === String(i);
          });
          if (sub.length) out.push({ et:'P' + i, rs:sub, num:null });
        })(i);
      }
    } else if (AV.pFilas === 'set') {
      var sets = [];
      (rs || []).forEach(function (r) { if (sets.indexOf(r.set) < 0) sets.push(r.set); });
      sets.sort();
      sets.forEach(function (st) {
        out.push({ et:L().se + ' ' + st, num:null,
                   rs:(rs || []).filter(function (r) { return r.set === st; }) });
      });
    } else {
      /* por jugador: los dorsales que aparecen de verdad */
      var nums = [];
      AV.acciones(rs).forEach(function (a) { if (nums.indexOf(a.num) < 0) nums.push(a.num); });
      nums.sort(function (x, y) { return x - y; });
      nums.forEach(function (nu) {
        var q = nom(nu, l);
        out.push({ et:'#' + nu + (q ? ' ' + q : ''), rs:rs, num:nu });
      });
    }
    return out;
  }

  /* las acciones de una fila, de un fundamento */
  function accFila(fila, sk) {
    var gF = AV.fund, gJ = AV.jug;
    AV.fund = sk;
    if (fila.num !== null && fila.num !== undefined) AV.jug = fila.num;
    var r = AV.acciones(fila.rs);
    AV.fund = gF; AV.jug = gJ;
    return r;
  }

  /* los puntos ganados y los errores que se le acreditan a una fila */
  function puntosFila(fila) {
    var l = AV.lado, gan = [], err = [], bp = 0, so = 0;
    (fila.rs || []).forEach(function (r) {
      var c = cierre(r);
      if (!c || c.a.lado !== l) return;
      if (fila.num !== null && fila.num !== undefined && String(c.a.num) !== String(fila.num)) return;
      var signo = c.acierto ? 1 : -1;
      if (c.acierto) gan.push(c.a); else err.push(c.a);
      /* en que fase paso: sacabamos nosotros (transition) o recibiamos */
      if (r.saca === l) bp += signo; else so += signo;
    });
    return [gan, err, bp, so];
  }

  AV.planilla = function (rs) {
    var t = L();
    var cols = colsOn();
    var filas = filasPlan(rs);

    /* los controles */
    var ctrl = '<div class="av-plctrl">' +
      '<label>' + esc(t.filas) + '<select onchange="AV.set_(\'pFilas\',this.value)">' +
        opt('jug', t.porJug, AV.pFilas) + opt('rot', t.porRot, AV.pFilas) +
        opt('set', t.porSet, AV.pFilas) + '</select></label>' +
      '<div class="av-plsk"><span>' + esc(t.mostrar) + '</span>' +
        COLS.map(function (c) {
          var on = String(AV.pCols || '').split(',').indexOf(c[0]) >= 0;
          var nm = (c[0] === 'P') ? t.gPuntos : t[c[0]];
          return '<button class="av-plb' + (on ? ' on' : '') +
                 '" onclick="AV.colPlan(\'' + c[0] + '\')">' + esc(nm) + '</button>';
        }).join('') + '</div>' +
      '<button class="av-mas av-baja" onclick="AV.bajarPlan()">&#8681; ' + esc(t.bajar) + '</button>' +
      '</div>';

    if (!filas.length || !cols.length) {
      return '<div class="an-s av-plan" data-notr><h4>' + esc(t.planilla) + '</h4>' + ctrl +
             '<div class="av-vacio">' + esc(t.sinPlan) + '</div></div>';
    }

    /* dos filas de encabezado: el fundamento arriba y sus columnas abajo */
    var h1 = '<tr><th class="k" rowspan="2"></th>', h2 = '<tr>';
    cols.forEach(function (c) {
      var nm = (c[0] === 'P') ? t.gPuntos : t[c[0]];
      h1 += '<th class="grp" colspan="' + c[2].length + '">' + esc(nm) + '</th>';
      c[2].forEach(function (k) { h2 += '<th>' + esc(t[k]) + '</th>'; });
    });
    h1 += '</tr>'; h2 += '</tr>';

    var cuerpo = '', plano = [];
    filas.forEach(function (f) {
      var fila = '<tr><td class="k">' + esc(f.et) + '</td>';
      var linea = [f.et];
      cols.forEach(function (c) {
        if (c[0] === 'P') {
          var pe = puntosFila(f), sal = pe[0].length - pe[1].length;
          var sg = function (v) {
            return '<td><span class="num ' + (v > 0 ? 'pos' : (v < 0 ? 'neg' : '')) + '">' +
                   (v > 0 ? '+' : '') + v + '</span></td>';
          };
          fila += numClic(pe[0].length, pe[0], '', 'bien') +
                  numClic(pe[1].length, pe[1], '', 'mal') +
                  sg(sal) + sg(pe[2]) + sg(pe[3]);
          linea.push(pe[0].length, pe[1].length, sal, pe[2], pe[3]);
          return;
        }
        var acc = accFila(f, c[0]);
        celdasSk(acc, c[0], c[2]).forEach(function (cel) {
          if (cel[1]) { fila += numClic(cel[0], cel[1]); }
          else { fila += '<td><span class="num">' + (cel[0] == null || cel[0] === 0 ? '·' : cel[0]) + '</span></td>'; }
          linea.push(cel[0] == null ? '' : cel[0]);
        });
      });
      cuerpo += fila + '</tr>';
      plano.push(linea);
    });

    /* ── EL TOTAL DEL EQUIPO Y EL ERROR RIVAL ────────────────────────────
       VolleyStation cierra su tabla de equipo con la suma de todas las
       columnas y una de mas: "Op. Err.", los puntos ganados sin que nadie
       nuestro hiciera nada, porque se equivoco el rival. En un partido
       parejo esa columna explica media diferencia y no aparece en ninguna
       fila de jugador, asi que sin ella las filas no suman el partido. */
    var todoF = { et:t.totalEq, rs:rs, num:null };
    var filaT = '<tr class="av-pltot"><td class="k">' + esc(t.totalEq) + '</td>';
    var lineaT = [t.totalEq];
    cols.forEach(function (c) {
      if (c[0] === 'P') {
        var pe = puntosFila(todoF), sal = pe[0].length - pe[1].length;
        var sg = function (v) {
          return '<td><span class="num ' + (v > 0 ? 'pos' : (v < 0 ? 'neg' : '')) + '">' +
                 (v > 0 ? '+' : '') + v + '</span></td>';
        };
        filaT += numClic(pe[0].length, pe[0], '', 'bien') +
                 numClic(pe[1].length, pe[1], '', 'mal') + sg(sal) + sg(pe[2]) + sg(pe[3]);
        lineaT.push(pe[0].length, pe[1].length, sal, pe[2], pe[3]);
        return;
      }
      var accT = accFila(todoF, c[0]);
      celdasSk(accT, c[0], c[2]).forEach(function (cel) {
        if (cel[1]) { filaT += numClic(cel[0], cel[1]); }
        else { filaT += '<td><span class="num">' + (cel[0] == null || cel[0] === 0 ? '·' : cel[0]) + '</span></td>'; }
        lineaT.push(cel[0] == null ? '' : cel[0]);
      });
    });
    cuerpo += filaT + '</tr>';
    plano.push(lineaT);

    /* los puntos que ganamos porque se equivocaron ellos */
    if (String(AV.pCols || '').indexOf('P') >= 0) {
      var opE = [];
      (rs || []).forEach(function (r) {
        var c = cierre(r);
        if (c && !c.acierto && c.a.lado !== AV.lado) opE.push(c.a);
      });
      var vacias = 0;
      cols.forEach(function (c) { vacias += (c[0] === 'P') ? 0 : c[2].length; });
      cuerpo += '<tr class="av-plop"><td class="k">' + esc(t.opErr) + '</td>' +
                (vacias ? '<td colspan="' + vacias + '"></td>' : '') +
                numClic(opE.length, opE, '', 'bien') +
                '<td colspan="4"></td></tr>';
      plano.push([t.opErr, opE.length]);
    }

    /* el encabezado plano, para el archivo */
    var cab = [''];
    cols.forEach(function (c) {
      var nm = (c[0] === 'P') ? t.gPuntos : t[c[0]];
      c[2].forEach(function (k) { cab.push(nm + ' ' + t[k]); });
    });
    AV._plan = [cab].concat(plano);

    return '<div class="an-s av-plan" data-notr><h4>' + esc(t.planilla) + '</h4>' + ctrl +
           '<div class="av-plscroll"><table class="st av-pltab">' + h1 + h2 + cuerpo + '</table></div>' +
           '<div class="av-nota">' + esc(t.notaPlan) + ' ' + esc(t.notaTot) +
           (String(AV.pCols || '').indexOf('P') >= 0 ? ' ' + esc(t.notaBP) : '') +
           '</div></div>';
  };

  AV.colPlan = function (k) {
    var l = String(AV.pCols || '').split(',').filter(Boolean);
    var i = l.indexOf(k);
    if (i >= 0) l.splice(i, 1); else l.push(k);
    AV.pCols = l.join(',');
    AV.pintar();
  };

  /* el archivo: CSV con punto y coma y BOM, que es lo que abre Excel en
     castellano y en aleman sin preguntar nada ni romper los acentos */
  AV.bajarPlan = function () {
    var d = AV._plan || [];
    if (!d.length) return;
    var txt = d.map(function (f) {
      return f.map(function (x) {
        var v = (x == null) ? '' : String(x);
        return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(';');
    }).join('\r\n');
    try {
      var blob = new Blob(['\ufeff' + txt], { type:'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'planilla.csv';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    } catch (e) { try { toast('No se pudo bajar', true); } catch (e2) {} }
  };



  /* ── LA DISTRIBUCION DEL ARMADOR ─────────────────────────────────────────
     Una cancha chica por rotacion, con el armador en esa posicion, y en cada
     zona de ataque cuanta pelota fue por ahi. Es el informe que todo
     entrenador mira antes de jugar contra alguien: "cuando el armador esta en
     1, ¿a quien le da?".

     Son las MISMAS seis zonas desde las que se ataca: 4, 3 y 2 en la red, y
     7, 8 y 9 de zaguero. Las de fondo (5, 6, 1) no se dibujan porque de ahi
     no se ataca nunca, y dejar tres casillas vacias en cada una de las seis
     canchas era ocupar media pantalla con nada.

     VolleyStation hace algo parecido y lo mezcla con las direcciones en un
     informe de 18 canchas (su manual, 4.2). Aca va separado: el reparto es
     una pregunta y las direcciones son otra, y mezcladas no se lee ninguna.

     Tres numeros por zona, que son los tres que hacen falta:
       · cuantas pelotas fueron
       · que parte del reparto de esa rotacion es
       · cuanto rindio ese ataque
     Y se toca para ver el video. */

  var AR = [['4','3','2'], ['7','8','9']];

  function canchaArm(acc, etiqueta, tot) {
    var t = L();
    var por = {}, maxN = 0;
    acc.forEach(function (a) { if (a.zi) (por[a.zi] = por[a.zi] || []).push(a); });
    Object.keys(por).forEach(function (z) { if (por[z].length > maxN) maxN = por[z].length; });

    var h = '<div class="av-arcaja">' +
            '<div class="av-arrot"><b>' + esc(etiqueta) + '</b> ' +
              '<span>' + acc.length + ' ' + esc(t.pelotasRot) + '</span></div>' +
            '<div class="av-arred">' + esc(t.red) + '</div><div class="av-armedia">';
    AR.forEach(function (f) {
      h += '<div class="av-arfila">';
      f.forEach(function (z) {
        var lst = por[z] || [], n = lst.length;
        if (!n) { h += '<div class="av-az vacia"><span class="zn">' + z + '</span></div>'; return; }
        var cc = {};
        EV.forEach(function (e) { cc[e] = lst.filter(function (a) { return a.ev === e; }).length; });
        var err = cc['='] + cc['/'];
        var ef = Math.round((cc['#'] - err) / n * 100);
        var col = n < 3 ? 'poco' : (ef >= 35 ? 'ok' : (ef >= 10 ? 'med' : 'mal'));
        var peso = maxN ? (0.10 + 0.55 * (n / maxN)) : 0.10;
        var pct = tot ? Math.round(n / tot * 100) : 0;
        var id = lote(lst);
        h += '<div class="av-az" style="background:rgba(56,189,248,' + peso.toFixed(2) + ')"' +
             (id ? ' onclick="AV.ver(' + id + ')"' : '') +
             ' title="' + esc(t.zona + ' ' + z + ' · ' + n + ' · ' + pct + '%') + '">' +
             '<span class="zn">' + z + '</span>' +
             '<span class="zpc">' + pct + '%</span>' +
             '<span class="zc">' + n + '</span>' +
             '<span class="zp ' + col + '">' + ef + '%</span></div>';
      });
      h += '</div>';
    });
    return h + '</div></div>';
  }

  AV.armador = function (rs) {
    var t = L(), l = AV.lado;

    /* siempre ataque: el reparto del armador es a donde van los ataques */
    var gF = AV.fund; AV.fund = 'A';
    var todo = AV.acciones(rs).filter(function (a) { return a.zi; });
    AV.fund = gF;

    if (!todo.length) {
      return '<div class="an-s av-arm" data-notr><h4>' + esc(t.distArm) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinArm) + '</div></div>';
    }

    /* ── EL ORDEN DE LAS SEIS CANCHAS ──────────────────────────────────────
       No van 1, 2, 3, 4, 5, 6 sino puestas COMO ESTAN EN LA CANCHA:

             P4  P3  P2      <- la fila de la red
             P5  P6  P1      <- el fondo

       El nombre de la rotacion ES la posicion del armador, asi que ponerlas
       en ese orden hace que el dibujo coincida con lo que el entrenador ve
       desde el banco: no hay que traducir nada. El total va aparte, a un
       costado, para no meterse en esa figura. */
    var ORDEN = ['4','3','2','5','6','1'];

    var canchaRot = function (i) {
      var gR = AV.rot, gF2 = AV.fund;
      AV.rot = String(i); AV.fund = 'A';
      var sub = AV.acciones(AV.filtrar(rs)).filter(function (a) { return a.zi; });
      AV.rot = gR; AV.fund = gF2;
      return sub;
    };

    var h = '<div class="an-s av-arm" data-notr><h4>' + esc(t.distArm) + '</h4>' +
            '<div class="av-armwrap">';

    h += '<div class="av-armtot">' + canchaArm(todo, t.todasRot, todo.length) + '</div>';

    h += '<div class="av-armgrid">';
    ORDEN.forEach(function (i) {
      var sub = canchaRot(i);
      h += sub.length ? canchaArm(sub, 'P' + i, sub.length)
                      : '<div class="av-arcaja av-arvacia"><div class="av-arrot"><b>P' + i + '</b></div></div>';
    });
    h += '</div></div>';

    return h + '<div class="av-nota">' + esc(t.notaArm) + '</div></div>';
  };

  /* ── LOS GRAFICOS (manual 9.5.11, "Chart Analysis") ──────────────────────
     Un grafico por set con la DIFERENCIA de puntos, no con los dos marcadores
     por separado. Dos lineas subiendo juntas no dicen nada: hay que restarlas
     con la vista. Una sola linea alrededor del cero se lee sola —arriba
     vamos ganando, abajo perdiendo— y las rachas saltan a la cara.

     Las marcas verticales son los parciales de 8, 16 y 21, que es como los
     anota VolleyStation en su informe de partido y como los mira cualquier
     entrenador: si a los 8 ya ibas cinco abajo, el set se fue temprano.

     Y cada punto se toca para ver esa jugada, que es lo que uno quiere hacer
     justo cuando ve la caida. */

  var GF = { w:250, h:150, mx:6, my:12 };

  AV.graficos = function (rs) {
    var t = L(), l = AV.lado;
    var sets = [];
    (rs || []).forEach(function (r) { if (sets.indexOf(r.set) < 0) sets.push(r.set); });
    sets.sort();
    if (!sets.length) {
      return '<div class="an-s av-graf" data-notr><h4>' + esc(t.evolucion) + '</h4>' +
             '<div class="av-vacio">' + esc(t.sinGraf) + '</div></div>';
    }

    var VERDE = '#4ade80', ROJO = '#f87171';

    /* ── UNA SOLA ESCALA PARA LOS CUATRO ───────────────────────────────────
       Si cada set se dibuja con su propia escala, un set perdido por 2 y otro
       perdido por 12 salen con la misma pinta y los graficos, que estan al
       lado justamente para compararse, mienten. Asi que la escala sale del
       partido entero. Y no se centra el cero a la fuerza: si nunca se fue
       arriba de +1, no tiene sentido gastar media caja en dibujar el vacio,
       se usa el maximo y el minimo de verdad con un margen. */
    var topA = 0, topB = 0;
    (rs || []).forEach(function (r) {
      var d = ((l === 'home') ? r.ptsH : r.ptsA) - ((l === 'home') ? r.ptsA : r.ptsH);
      if (d > topA) topA = d;
      if (d < topB) topB = d;
    });
    topA = Math.max(1, topA + 1); topB = Math.min(-1, topB - 1);

    var h = '<div class="an-s av-graf" data-notr><h4>' + esc(t.evolucion) + '</h4><div class="av-grafs">';

    sets.forEach(function (st) {
      var pts = (rs || []).filter(function (r) { return r.set === st; });
      if (!pts.length) return;

      /* la diferencia despues de cada punto, desde nuestro lado */
      var dif = [], finH = 0, finA = 0;
      pts.forEach(function (r) {
        var mios = (l === 'home') ? r.ptsH : r.ptsA;
        var dellos = (l === 'home') ? r.ptsA : r.ptsH;
        dif.push({ d:mios - dellos, r:r, m:Math.max(r.ptsH, r.ptsA) });
        finH = r.ptsH; finA = r.ptsA;
      });

      var n = dif.length;
      var W = GF.w - GF.mx*2, H = GF.h - GF.my*2;
      var x = function (i) { return GF.mx + (n <= 1 ? W/2 : (i/(n-1)) * W); };
      var y = function (d) { return GF.my + H - ((d - topB) / (topA - topB)) * H; };
      var y0 = y(0);

      /* el area partida en cero: arriba verde, abajo roja */
      var arriba = 'M' + x(0).toFixed(1) + ',' + y0.toFixed(1);
      dif.forEach(function (p, i) { arriba += ' L' + x(i).toFixed(1) + ',' + y(p.d).toFixed(1); });
      arriba += ' L' + x(n-1).toFixed(1) + ',' + y0.toFixed(1) + ' Z';

      var g = '';
      /* dos clips: uno para lo de arriba del cero y otro para lo de abajo */
      var uid = 'g' + st + '_' + Math.floor(Math.random()*100000);
      g += '<defs>' +
           '<clipPath id="' + uid + 'a"><rect x="0" y="0" width="' + GF.w + '" height="' + y0.toFixed(1) + '"/></clipPath>' +
           '<clipPath id="' + uid + 'b"><rect x="0" y="' + y0.toFixed(1) + '" width="' + GF.w + '" height="' + GF.h + '"/></clipPath>' +
           '</defs>';
      g += '<path d="' + arriba + '" fill="' + VERDE + '" opacity=".20" clip-path="url(#' + uid + 'a)"/>';
      g += '<path d="' + arriba + '" fill="' + ROJO  + '" opacity=".20" clip-path="url(#' + uid + 'b)"/>';

      /* los parciales de 8, 16 y 21 */
      [8, 16, 21].forEach(function (p) {
        var i = -1;
        for (var k = 0; k < n; k++) { if (dif[k].m >= p) { i = k; break; } }
        if (i < 0) return;
        g += '<line class="av-gp" x1="' + x(i).toFixed(1) + '" y1="' + GF.my +
             '" x2="' + x(i).toFixed(1) + '" y2="' + (GF.h - GF.my) + '"/>' +
             '<text class="av-gpt" x="' + x(i).toFixed(1) + '" y="' + (GF.my - 3) + '">' + p + '</text>';
      });

      g += '<line class="av-g0" x1="' + GF.mx + '" y1="' + y0.toFixed(1) +
           '" x2="' + (GF.w - GF.mx) + '" y2="' + y0.toFixed(1) + '"/>';

      /* la linea */
      var d2 = dif.map(function (p, i) {
        return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(p.d).toFixed(1);
      }).join(' ');
      g += '<path class="av-gl" d="' + d2 + '"/>';

      /* los puntos, tocables. Solo se dibuja el circulo cada tantos para no
         llenar de bolitas, pero el area de toque cubre todo */
      dif.forEach(function (p, i) {
        var lot = lote((p.r.acciones || []).filter(function (a) { return a.lado === l; }));
        var tit = p.r.ptsH + '-' + p.r.ptsA + ' · ' + (p.d > 0 ? '+' : '') + p.d;
        g += '<g class="av-gpt2"' + (lot ? ' onclick="AV.ver(' + lot + ')"' : '') + '>' +
             '<title>' + esc(tit) + '</title>' +
             '<rect x="' + (x(i)-4).toFixed(1) + '" y="' + GF.my + '" width="8" height="' + H + '" fill="transparent"/>' +
             (i === n-1 ? '<circle class="av-gc" cx="' + x(i).toFixed(1) + '" cy="' + y(p.d).toFixed(1) + '" r="3"/>' : '') +
             '</g>';
      });

      var miosF = (l === 'home') ? finH : finA, ellosF = (l === 'home') ? finA : finH;
      h += '<div class="av-gcaja">' +
           '<div class="av-grot"><b>' + esc(t.se + ' ' + st) + '</b> ' +
             '<span class="' + (miosF > ellosF ? 'ok' : 'mal') + '">' + miosF + '-' + ellosF + '</span></div>' +
           '<svg class="av-gsvg" viewBox="0 0 ' + GF.w + ' ' + GF.h + '" width="' + GF.w +
             '" height="' + GF.h + '" role="img">' + g +
             '<text class="av-gej" x="3" y="' + (GF.my + 7) + '">+' + topA + '</text>' +
             '<text class="av-gej" x="3" y="' + (GF.h - GF.my - 1) + '">' + topB + '</text>' +
             '</svg></div>';
    });

    return h + '</div><div class="av-nota">' + esc(t.notaGraf) + '</div></div>';
  };



  /* ── LA BUSQUEDA (manual 9.6) ────────────────────────────────────────────
     El Data parte esto en cuatro entradas de menu —Busqueda Libre, Statistics
     Search, Rotations Search y Busqueda Avanzada— pero tres de las cuatro son
     lo mismo que la barra de filtros de arriba, que ya esta y filtra todo a
     la vez. La que faltaba de verdad es la LIBRE: escribir un pedazo de
     codigo y encontrarlo.

     Y abajo va el punto por punto (manual 9.7.3, "Play by Play"): cada punto
     con su marcador, como termino y quien lo gano, tocable para ver el rally
     entero en el video. Es la lista que uno recorre entre set y set.

     La busqueda NO usa los filtros de arriba a proposito: si alguien escribe
     un codigo es porque lo quiere encontrar, no porque quiera encontrarlo
     sólo si ademas pasa seis filtros. La lista de puntos sí los respeta. */

  AV.q = '';

  AV.buscarTxt = function (v) {
    AV.q = String(v || '');
    try {
      var caja = document.getElementById('av-res-busc');
      if (caja) {
        /* si esto se llamo desde afuera y no tecleando, la cajita de texto
           quedaria mostrando lo anterior: se la pone al dia */
        var inp = document.getElementById('av-q');
        if (inp && inp.value !== AV.q) inp.value = AV.q;
        caja.innerHTML = AV.resultados();
        return;
      }
    } catch (e) {}
    AV.pintar();
  };

  AV.resultados = function () {
    var t = L();
    var q = AV.q.trim().toUpperCase();
    if (!q) return '';
    var codes = [];
    try { codes = (typeof M !== 'undefined' && M && M.codes) ? M.codes : []; } catch (e) {}

    var hits = [];
    codes.forEach(function (c, i) {
      if (!c || c.k !== 'play' || !c.c) return;
      if (String(c.c).toUpperCase().indexOf(q) < 0) return;
      hits.push({ i:i, t:(c.t || 0), cod:String(c.c), set:c.set });
    });

    if (!hits.length) return '<div class="av-vacio">' + esc(t.nadaEncontrado) + '</div>';

    AV._hits = hits;
    var h = '<div class="av-bres"><b>' + hits.length + '</b> ' + esc(t.encontradas) +
            ' <button class="av-mas" onclick="AV.verHits()">&#9654; ' + esc(t.verTodas) + '</button></div>';
    h += '<div class="av-blista">';
    hits.slice(0, 200).forEach(function (x, k) {
      h += '<div class="av-bfila" onclick="AV.verHit(' + k + ')">' +
           '<span class="s">' + esc(t.se + ' ' + (x.set || '-')) + '</span>' +
           '<span class="c">' + esc(x.cod) + '</span>' +
           '<span class="m">' + esc(hhmm(x.t)) + '</span></div>';
    });
    if (hits.length > 200) h += '<div class="av-nota">+' + (hits.length - 200) + '</div>';
    return h + '</div>';
  };

  function hhmm(seg) {
    seg = Math.max(0, Math.round(seg || 0));
    var m = Math.floor(seg / 60), g = seg % 60;
    return m + ':' + (g < 10 ? '0' : '') + g;
  }

  AV.verHits = function () {
    if (!AV._hits || !AV._hits.length) return;
    try { rvAbrir(AV._hits.slice(), AV.q.toUpperCase()); } catch (e) {}
  };
  AV.verHit = function (k) {
    if (!AV._hits || !AV._hits[k]) return;
    try { rvAbrir([AV._hits[k]], AV._hits[k].cod); } catch (e) {}
  };

  /* ── PUNTO POR PUNTO ──────────────────────────────────────────────────── */
  AV.jugadas = function (rs) {
    var t = L(), l = AV.lado;
    if (!rs || !rs.length) return '';
    var codes = [];
    try { codes = (typeof M !== 'undefined' && M && M.codes) ? M.codes : []; } catch (e) {}

    var h = '<div class="an-s av-jug2" data-notr><h4>' + esc(t.jugadaAJugada) + '</h4>' +
            '<div class="av-jlista">';
    rs.forEach(function (r) {
      var c = cierre(r);
      var quien = r.gano === l ? 'gana' : 'pierde';
      var comoC = c ? ((c.acierto ? '' : '') + (L()[c.sk] || '')) : '';
      /* el nombre solo si aporta algo: los rivales suelen venir sin plantel
         cargado y nombreDe devuelve el propio dorsal, asi que quedaba "#22 22" */
      var nn = c ? (nom(c.a.num, c.a.lado) || '') : '';
      if (nn && String(nn).trim() === String(c.a.num)) nn = '';
      var quienN = c ? ('#' + c.a.num + (nn ? ' ' + nn : '')) : '';
      /* los clips del punto entero: todas sus acciones, de los dos equipos */
      var todas = (r.acciones || []).map(function (a) {
        var cc = a._c; if (!cc) return null;
        var i = codes.indexOf(cc);
        return i < 0 ? null : { i:i, t:(cc.t || 0), cod:String(cc.c || ''), set:a.set };
      }).filter(Boolean);
      var id = todas.length ? lote(r.acciones || []) : 0;
      h += '<div class="av-jfila ' + quien + '"' +
           (todas.length ? ' onclick="AV.verRally(' + (r.ptsH || 0) + ',' + (r.ptsA || 0) + ',' + r.set + ')"' : '') + '>' +
           '<span class="s">' + esc(t.se + ' ' + r.set) + '</span>' +
           '<span class="p">' + (r.ptsH || 0) + '-' + (r.ptsA || 0) + '</span>' +
           '<span class="q">' + esc(comoC) + '</span>' +
           '<span class="n">' + esc(quienN) + '</span>' +
           '<span class="g">' + (r.gano === l ? '+' : '−') + '</span>' +
           '</div>';
    });
    return h + '</div><div class="av-nota">' + esc(t.notaJugadas) + '</div></div>';
  };

  /* abre el punto entero en el reproductor */
  AV.verRally = function (ph, pa, st) {
    var codes = [], rs = [];
    try { codes = (typeof M !== 'undefined' && M && M.codes) ? M.codes : []; } catch (e) {}
    try { rs = AV.todos(); } catch (e) {}
    var r = rs.filter(function (x) {
      return x.set === st && x.ptsH === ph && x.ptsA === pa;
    })[0];
    if (!r) return;
    var clips = (r.acciones || []).map(function (a) {
      var cc = a._c; if (!cc) return null;
      var i = codes.indexOf(cc);
      return i < 0 ? null : { i:i, t:(cc.t || 0), cod:String(cc.c || ''), set:a.set };
    }).filter(Boolean);
    if (!clips.length) return;
    try { rvAbrir(clips, L().se + ' ' + st + ' · ' + ph + '-' + pa); } catch (e) {}
  };

  AV.busqueda = function (rs) {
    var t = L();
    var h = '<div class="an-s av-busc" data-notr><h4>' + esc(t.buscar) + '</h4>' +
            '<input class="av-binput" id="av-q" value="' + esc(AV.q) + '" placeholder="' +
              esc(t.buscarPh) + '" oninput="AV.buscarTxt(this.value)">' +
            '<div id="av-res-busc">' + AV.resultados() + '</div>' +
            '<div class="av-nota">' + esc(t.notaBusc) + '</div></div>';
    return h + AV.jugadas(rs);
  };

  /* ── BAJAR E IMPRIMIR CUALQUIER ANALISIS ─────────────────────────────────
     El Data tiene, en el menu de cada analisis, "Export" a Excel e "Imprimir
     con vista previa". Aca son dos botones al lado de las solapas y valen
     para LA SOLAPA QUE ESTES MIRANDO, con los filtros puestos.

     El archivo sale en CSV con punto y coma y BOM: es lo que abre Excel en
     castellano y en aleman de un doble clic, sin asistente de importacion y
     sin romper los acentos. Un .xlsx de verdad obligaria a meter una libreria
     entera en el panel, que es lo que justamente no queremos.

     Al imprimir se arma una cabecera con el partido, el marcador y los
     filtros que estan puestos, porque una hoja de numeros sin decir de que
     partido y con que filtros es papel tirado. */

  function tablasVisibles() {
    var pane = document.querySelector('[data-av-pane="' + AV.tab + '"]');
    if (!pane) return [];
    return [].slice.call(pane.querySelectorAll('table.st'));
  }

  function tituloDe(tb) {
    var caja = tb.closest ? tb.closest('.an-s') : null;
    var h = caja ? caja.querySelector('h4') : null;
    return h ? h.textContent.trim() : '';
  }

  AV.textoFiltros = function () {
    var caja = document.getElementById('av-bar');
    var r = caja ? caja.querySelector('.av-res') : null;
    return r ? r.innerText.replace(/\s+/g, ' ').trim() : '';
  };

  AV.excel = function () {
    var t = L();
    var tbs = tablasVisibles();
    if (!tbs.length) { try { toast(t.nadaQueBajar, true); } catch (e) {} return; }

    var lineas = [];
    var M_ = {}; try { M_ = (typeof M !== 'undefined' && M) ? M : {}; } catch (e) {}
    lineas.push([ ((M_.home && M_.home.name) || '') + ' - ' + ((M_.away && M_.away.name) || '') ]);
    lineas.push([ AV.textoFiltros() ]);
    lineas.push([]);

    tbs.forEach(function (tb) {
      var tit = tituloDe(tb);
      if (tit) lineas.push([tit]);
      [].slice.call(tb.querySelectorAll('tr')).forEach(function (tr) {
        var fila = [].slice.call(tr.querySelectorAll('th,td')).map(function (c) {
          return c.innerText.replace(/\s+/g, ' ').trim();
        });
        lineas.push(fila);
      });
      lineas.push([]);
    });

    var txt = lineas.map(function (f) {
      return f.map(function (x) {
        var v = (x == null) ? '' : String(x);
        return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }).join(';');
    }).join('\r\n');

    try {
      var blob = new Blob(['\ufeff' + txt], { type:'text/csv;charset=utf-8;' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'analisis-' + AV.tab + '.csv';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    } catch (e) { try { toast('No se pudo bajar', true); } catch (e2) {} }
  };

  AV.imprimir = function () {
    var t = L();
    var M_ = {}; try { M_ = (typeof M !== 'undefined' && M) ? M : {}; } catch (e) {}
    var cab = document.getElementById('av-print');
    if (!cab) {
      cab = document.createElement('div');
      cab.id = 'av-print';
      var cont = document.getElementById('an-cont');
      if (cont && cont.parentNode) cont.parentNode.insertBefore(cab, cont);
    }
    var sets = (M_.parciales || []).join('  ·  ');
    var nombreTab = (TABS.filter(function (x) { return x[0] === AV.tab; })[0] || ['', ''])[1];
    cab.innerHTML =
      '<div class="pcab"><b>' + esc((M_.home && M_.home.name) || '') + '</b> ' +
        ((M_.home && M_.home.sets) || 0) + ' - ' + ((M_.away && M_.away.sets) || 0) +
        ' <b>' + esc((M_.away && M_.away.name) || '') + '</b></div>' +
      (sets ? '<div class="ppar">' + esc(sets) + '</div>' : '') +
      '<div class="pfil"><b>' + esc(t[nombreTab] || '') + '</b> · ' +
        esc(AV.textoFiltros() || t.sinFiltro) + '</div>';
    try { window.print(); } catch (e) {}
  };

  AV.barraAcc = function () {
    var t = L();
    return '<div class="av-acc">' +
      '<button class="av-mas" onclick="AV.excel()">&#8681; ' + esc(t.excel) + '</button>' +
      '<button class="av-mas" onclick="AV.imprimir()">&#9113; ' + esc(t.imprimir) + '</button>' +
      '</div>';
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
              ['dir','tDir'], ['ataque','tAtaque'], ['comp','tComp'],
              ['arm','tArm'], ['graf','tGraf'], ['plan','tPlan'], ['busc','tBusc']];

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
    }).join('') + AV.barraAcc() + '</div>';
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
      var todo = marcar(_rallies());
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
    var todo = marcar(AV.todos());
    _dentro = false;
    var fil = AV.filtrar(todo);

    var caja = document.getElementById('av-bar');
    if (!caja) {
      caja = document.createElement('div');
      caja.id = 'av-bar';
      caja.setAttribute('data-notr', '');   /* ya viene traducido de arriba */
      cont.parentNode.insertBefore(caja, cont);
    }
    caja.innerHTML = AV.barra(todo) + AV.avanzado() + AV.chips() +
                     AV.resumen(todo, fil) + AV.solapas();

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
        + panel('comp',    AV.comparar(todo))
        + panel('arm',     AV.armador(fil))
        + panel('graf',    AV.graficos(fil))
        + panel('plan',    AV.planilla(fil))
        + panel('busc',    AV.busqueda(fil));
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
    /* ── LA BUSQUEDA Y EL PUNTO POR PUNTO ─────────────────────────────────── */
    + '.av-busc h4,.av-jug2 h4{margin:0 0 8px;font-size:11px;letter-spacing:1px;'
    +   'text-transform:uppercase;color:var(--k-zone,#38bdf8)}'
    + '.av-binput{width:100%;max-width:520px;background:var(--card);color:var(--fg,#e8edf5);'
    +   'border:1px solid var(--b);border-radius:8px;padding:10px 12px;font-size:13px;'
    +   'font-family:ui-monospace,monospace}'
    + '.av-binput:focus{outline:0;border-color:var(--k-zone,#38bdf8)}'
    + '.av-bres{margin:10px 0 6px;font-size:12px;color:var(--mut);display:flex;'
    +   'align-items:center;gap:10px}'
    + '.av-bres b{color:var(--fg,#e8edf5);font-size:14px}'
    + '.av-blista,.av-jlista{max-width:560px;max-height:320px;overflow:auto;'
    +   'border:1px solid var(--b);border-radius:8px}'
    + '.av-bfila,.av-jfila{display:flex;gap:10px;align-items:center;padding:6px 10px;'
    +   'font-size:12px;cursor:pointer;border-bottom:1px solid var(--b)}'
    + '.av-bfila:last-child,.av-jfila:last-child{border-bottom:0}'
    + '.av-bfila:hover,.av-jfila:hover{background:var(--card2)}'
    + '.av-bfila .s,.av-jfila .s{color:var(--mut);min-width:44px;font-size:11px}'
    + '.av-bfila .c{font-family:ui-monospace,monospace;color:var(--fg,#e8edf5);flex:1}'
    + '.av-bfila .m{color:var(--mut);font-size:11px}'
    + '.av-jfila .p{font-family:ui-monospace,monospace;color:var(--fg,#e8edf5);min-width:50px}'
    + '.av-jfila .q{color:var(--mut);min-width:78px;font-size:11px}'
    + '.av-jfila .n{color:var(--mut);flex:1;font-size:11px;overflow:hidden;'
    +   'text-overflow:ellipsis;white-space:nowrap}'
    + '.av-jfila .g{font-weight:800;min-width:14px;text-align:center}'
    + '.av-jfila.gana .g{color:var(--ok,#22c55e)}'
    + '.av-jfila.pierde .g{color:var(--bad,#ef4444)}'
    + '.av-jug2{margin-top:16px}'
    + '.av-acc{margin-left:auto;display:flex;gap:5px;align-items:center;padding-bottom:5px}'
    + '.av-acc .av-mas{padding:5px 11px}'
    + '#av-print{display:none}'
    /* ── LA HOJA IMPRESA ───────────────────────────────────────────────────
       Se imprime SOLO la solapa que se esta mirando, con una cabecera que
       dice de que partido es y con que filtros. Todo lo demas del panel —la
       cancha, la lista de codigos, los botones— se esconde: si no, salen
       ocho hojas de cosas que nadie pidio. Los colores se fuerzan a tinta
       oscura sobre blanco, porque el tema del panel es negro y en papel
       saldria una mancha. */
    + '@media print{'
    +   'body>*{display:none!important}'
    +   '#m-analisis{display:block!important;position:static!important;background:#fff!important;'
    +     'padding:0!important;inset:auto!important;z-index:auto!important}'
    +   '#m-analisis .sheet{background:#fff!important;border:0!important;max-width:none!important;'
    +     'max-height:none!important;overflow:visible!important;padding:0!important;'
    +     'box-shadow:none!important}'
    +   '#m-analisis h2,#m-analisis .sub,#av-bar .av-bar,#av-bar .av-avwrap,#av-bar .av-guard,'
    +     '#av-bar .av-tabs,.av-acc,.av-nota,.av-vacio{display:none!important}'
    +   '#av-bar .av-res{display:none!important}'
    +   '#m-analisis .modal,#m-analisis button,#m-analisis select,#m-analisis input{display:none!important}'
    +   '.av-orden,.av-plctrl,.av-ley,.av-guard,.av-canc,.av-reg{display:none!important}'
    +   '#av-print{display:block!important;margin:0 0 14px;color:#000}'
    +   '#av-print .pcab{font-size:17px;font-weight:800;letter-spacing:.5px}'
    +   '#av-print .ppar{font-size:11px;color:#444;margin-top:2px}'
    +   '#av-print .pfil{font-size:11px;color:#222;margin-top:6px;padding-top:6px;'
    +     'border-top:1px solid #bbb}'
    +   '.av-pane{color:#000}'
    +   '.an-s h4,.av-tabla h4,.av-punto h4,.av-combi h4,.av-comp h4,.av-plan h4,'
    +     '.av-graf h4,.av-arm h4,.av-dir h4,.av-mapa h4{color:#000!important}'
    +   'table.st th{color:#444!important}'
    +   'table.st td,table.st td .num,table.st td.k{color:#000!important}'
    +   'table.st td .num.pos,table.st td.bien .num,.cp.ok,.zp.ok{color:#137333!important}'
    +   'table.st td .num.neg,table.st td.mal .num,.cp.mal,.zp.mal{color:#a50e0e!important}'
    +   '.av-z,.av-az{border-color:#999!important}'
    +   '.av-svg,.av-gsvg{background:#fff!important;border-color:#999!important}'
    +   '.av-cz{stroke:#bbb!important}.av-cn{fill:#000!important;opacity:.55!important}'
    +   '.av-cred,.av-g0,.av-gl{stroke:#000!important;opacity:1!important}'
    +   '.av-fltxt{fill:#000!important}.av-flr rect{fill:#fff!important;opacity:.9!important}'
    +   '.av-gej,.av-gpt{fill:#555!important}'
    +   '@page{margin:14mm}'
    + '}'
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
    + '.av-orden{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:0 0 9px}'
    + '.av-orden>span{font-size:10px;letter-spacing:.8px;text-transform:uppercase;'
    +   'color:var(--mut);font-weight:700;margin-right:4px}'
    + '.av-tabla tr.av-grp td{padding-top:11px;color:var(--k-zone,#38bdf8);font-weight:800;'
    +   'letter-spacing:.5px;text-align:left}'
    + '.av-tabla tr.av-grp td i{font-style:normal;color:var(--mut);font-weight:400;'
    +   'font-size:11px;margin-left:7px}'
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
    /* ── LA PLANILLA ──────────────────────────────────────────────────── */
    + '.av-plan h4{margin:0 0 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-plctrl{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin-bottom:10px}'
    + '.av-plctrl label{display:flex;flex-direction:column;gap:4px;font-size:10px;'
    +   'letter-spacing:.8px;text-transform:uppercase;color:var(--mut);font-weight:700}'
    + '.av-plctrl select{background:var(--card);color:var(--fg,#e8edf5);border:1px solid var(--b);'
    +   'border-radius:7px;padding:6px 8px;font-size:12px;font-family:inherit;min-height:32px}'
    + '.av-plsk{display:flex;flex-wrap:wrap;gap:4px;align-items:center}'
    + '.av-plsk>span{font-size:10px;letter-spacing:.8px;text-transform:uppercase;'
    +   'color:var(--mut);font-weight:700;margin-right:3px}'
    + '.av-plb{background:transparent;border:1px solid var(--b);border-radius:20px;'
    +   'padding:5px 11px;font-size:11px;font-family:inherit;color:var(--mut);cursor:pointer}'
    + '.av-plb.on{background:var(--k-zone,#38bdf8);border-color:var(--k-zone,#38bdf8);'
    +   'color:#04121c;font-weight:800}'
    + '.av-baja{margin-left:auto;align-self:center}'
    + '.av-plscroll{overflow-x:auto;padding-bottom:4px}'
    + '.av-pltab{min-width:100%;width:auto}'
    + '.av-pltab th,.av-pltab td{text-align:center;white-space:nowrap;padding-left:7px;padding-right:7px}'
    + '.av-pltab th.k,.av-pltab td.k{text-align:left;white-space:nowrap;padding-right:16px}'
    + '.av-pltab td.k{color:var(--fg,#e8edf5);font-weight:600}'
    + '.av-pltab th{color:var(--mut);font-size:9.5px}'
    + '.av-pltab th.grp{color:var(--k-zone,#38bdf8);font-size:10px;letter-spacing:1px;'
    +   'border-bottom:1px solid var(--b);padding-bottom:3px}'
    + '.av-pltab td .num{color:var(--fg,#e8edf5)}'
    + '.av-pltab td.bien .num{color:var(--ok,#22c55e)}'
    + '.av-pltab td.mal .num{color:var(--bad,#ef4444)}'
    + '.av-pltab td .num.pos{color:var(--ok,#22c55e)}'
    + '.av-pltab td .num.neg{color:var(--bad,#ef4444)}'
    + '.av-pltab tr.av-pltot td{border-top:1px solid var(--b2,#1e293b);padding-top:9px}'
    + '.av-pltab tr.av-pltot td.k{color:var(--k-zone,#38bdf8);font-weight:800;letter-spacing:.6px}'
    + '.av-pltab tr.av-pltot .num{font-weight:800}'
    + '.av-pltab tr.av-plop td.k{color:var(--mut);font-weight:600}'
    /* ── LOS GRAFICOS ─────────────────────────────────────────────────── */
    + '.av-graf h4{margin:0 0 10px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-grafs{display:flex;flex-wrap:wrap;gap:14px}'
    + '.av-gcaja{flex:0 0 auto}'
    + '.av-grot{font-size:11px;color:var(--mut);margin-bottom:3px;letter-spacing:.4px}'
    + '.av-grot b{color:var(--fg,#e8edf5);font-weight:700;margin-right:5px}'
    + '.av-grot .ok{color:var(--ok,#22c55e);font-weight:800}'
    + '.av-grot .mal{color:var(--bad,#ef4444);font-weight:800}'
    + '.av-gsvg{display:block;background:var(--card2);border:1px solid var(--b);border-radius:8px}'
    + '.av-g0{stroke:var(--fg,#e8edf5);stroke-width:1.2;opacity:.45}'
    + '.av-gp{stroke:var(--b2,rgba(255,255,255,.14));stroke-width:1;stroke-dasharray:2 3}'
    + '.av-gpt{fill:var(--mut);font-size:8px;text-anchor:middle;font-family:inherit}'
    + '.av-gl{fill:none;stroke:var(--fg,#e8edf5);stroke-width:2;stroke-linejoin:round;'
    +   'stroke-linecap:round;opacity:.92}'
    + '.av-gc{fill:var(--fg,#e8edf5)}'
    + '.av-gej{fill:var(--mut);font-size:8px;font-family:inherit;opacity:.8}'
    + '.av-gpt2{cursor:pointer}'
    + '.av-gpt2:hover rect{fill:rgba(255,255,255,.07)}'
    + '.av-avcaja{margin-top:8px;padding:9px 10px;background:var(--card2);'
    +   'border:1px solid var(--b);border-radius:10px}'
    + '.av-avcaja .av-av{margin-top:0;padding:0;background:transparent;border:0;border-radius:0}'
    + '.av-canc{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:10px;'
    +   'padding-top:9px;border-top:1px solid var(--b)}'
    + '.av-canc>span{font-size:10px;letter-spacing:.8px;text-transform:uppercase;'
    +   'color:var(--mut);font-weight:700;margin-right:4px}'
    + '.av-canc .av-plb{min-width:34px;padding:5px 8px;font-weight:700}'
    + '.av-canc .av-mas{margin-left:6px;padding:4px 10px}'
    + '.av-reg{margin-top:11px;padding-top:10px;border-top:1px solid var(--b)}'
    + '.av-reghd{display:flex;align-items:center;gap:10px;margin-bottom:7px}'
    + '.av-reghd>span{font-size:10px;letter-spacing:.8px;text-transform:uppercase;'
    +   'color:var(--mut);font-weight:700}'
    + '.av-regyo .av-f{padding:5px 10px;min-height:26px}'
    + '.av-regfila{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-bottom:5px}'
    + '.av-regfila select{background:var(--card);color:var(--fg,#e8edf5);border:1px solid var(--b);'
    +   'border-radius:7px;padding:5px 7px;font-size:11.5px;font-family:inherit;min-height:30px}'
    + '.av-regx{background:transparent;border:1px solid var(--b);border-radius:7px;'
    +   'color:var(--mut);width:30px;height:30px;font-size:15px;cursor:pointer;line-height:1}'
    + '.av-regx:hover{color:var(--bad,#ef4444);border-color:var(--bad,#ef4444)}'
    /* ── LA DISTRIBUCION DEL ARMADOR ──────────────────────────────────── */
    + '.av-arm h4{margin:0 0 10px;font-size:11px;letter-spacing:1px;text-transform:uppercase;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-armwrap{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-start}'
    + '.av-armtot{padding-right:20px;border-right:1px solid var(--b)}'
    + '.av-armgrid{display:grid;grid-template-columns:repeat(3,186px);gap:10px 12px}'
    + '.av-arvacia{opacity:.4}'
    + '@media(max-width:820px){.av-armtot{padding-right:0;border-right:0;'
    +   'padding-bottom:14px;border-bottom:1px solid var(--b)}'
    +   '.av-armgrid{grid-template-columns:repeat(2,minmax(150px,186px))}}'
    + '.av-arcaja{flex:0 0 auto;width:186px}'
    + '.av-arrot{font-size:11px;color:var(--mut);margin-bottom:3px}'
    + '.av-arrot b{color:var(--fg,#e8edf5);font-weight:800;margin-right:6px;font-size:12px}'
    + '.av-arred{font-size:7.5px;letter-spacing:3px;color:var(--mut);text-align:center;'
    +   'border-bottom:2px solid var(--b2,#1e293b);padding-bottom:2px;margin-bottom:3px}'
    + '.av-armedia{display:flex;flex-direction:column;gap:3px}'
    + '.av-arfila{display:flex;gap:3px}'
    + '.av-az{flex:1;min-height:56px;border:1px solid var(--b);border-radius:6px;position:relative;'
    +   'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;'
    +   'cursor:pointer;transition:border-color .12s}'
    + '.av-az:hover{border-color:rgba(255,255,255,.45)}'
    + '.av-az.vacia{background:transparent;cursor:default;opacity:.4}'
    + '.av-az .zn{position:absolute;top:3px;left:5px;font-size:9.5px;color:var(--fg,#e8edf5);'
    +   'opacity:.5;font-weight:700}'
    + '.av-az .zpc{position:absolute;top:3px;right:5px;font-size:9.5px;font-weight:800;'
    +   'color:var(--k-zone,#38bdf8)}'
    + '.av-az .zc{font-size:17px;font-weight:800;color:var(--fg,#e8edf5);line-height:1;margin-top:5px}'
    + '.av-az .zp{font-size:9.5px;font-weight:700;margin-top:1px}'
    + '.av-az .zp.ok{color:var(--ok,#22c55e)}'
    + '.av-az .zp.med{color:var(--warn,#f59e0b)}'
    + '.av-az .zp.mal{color:var(--bad,#ef4444)}'
    + '.av-az .zp.poco{color:var(--mut)}'
    + '.av-avwrap{margin-top:8px}'
    + '.av-avbtn.on{color:var(--k-zone,#38bdf8);border-color:var(--k-zone,#38bdf8);'
    +   'border-style:solid}'
    + '.av-av{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-top:8px;'
    +   'padding:9px 10px;background:var(--card2);border:1px solid var(--b);border-radius:10px}'
    + '.av-av label{display:flex;flex-direction:column;gap:4px;font-size:10px;'
    +   'letter-spacing:.8px;text-transform:uppercase;color:var(--mut);font-weight:700}'
    + '.av-av select,.av-av input[type=number]{background:var(--card);color:var(--fg,#e8edf5);'
    +   'border:1px solid var(--b);border-radius:7px;padding:6px 8px;font-size:12px;'
    +   'font-family:inherit;min-height:32px}'
    + '.av-av select{min-width:120px}'
    + '.av-dos{display:flex;gap:5px}'
    + '.av-dos input{width:72px}'
    + '.av-av label.av-chk{flex-direction:row;align-items:center;gap:7px;text-transform:none;'
    +   'letter-spacing:0;font-size:11.5px;font-weight:600;color:var(--fg,#e8edf5);'
    +   'min-height:32px;cursor:pointer}'
    + '.av-av label.av-chk input{width:16px;height:16px;accent-color:var(--k-zone,#38bdf8);'
    +   'cursor:pointer}'
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
    + '.av-lc{width:26px;height:11px;flex:none;border-radius:3px;'
    +   'background:linear-gradient(90deg,rgba(56,189,248,.06),rgba(56,189,248,.4))}'
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
