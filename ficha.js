/* ══════════════════════════════════════════════════════════════════════════
   MI JUEGO — el dibujo
   --------------------------------------------------------------------------
   Aca no se calcula nada: los numeros los hace gen_ficha.py leyendo los .dvw,
   con la tabla de la liga de nla_full_stats.json. Esta pantalla dibuja.

   QUIEN VE QUE. Si quien entro es un JUGADOR (vb_role='player') ve su propia
   ficha y nada mas: ni selector, ni los numeros de sus companeros. El cuerpo
   tecnico ve el plantel completo. Es la misma regla del resto de la app.

   LOS COLORES, Y POR QUE SON ESOS. Verde #6EE7A0 por encima de lo esperable,
   rojo #FF7C89 por debajo, gris #8A94A6 para la referencia. Medidos: 8.9 de
   separacion bajo deuteranopia (el piso es 8), 30.7 en vision normal, y
   12.2:1 y 7.6:1 de contraste sobre el panel. Y NUNCA van solos: cada numero
   lleva su signo y cada barra esta de un lado del cero. El rojo de la marca
   no se usa como dato en ninguna parte.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

var UP='#6EE7A0', DN='#FF7C89', REF='#8A94A6';

var T={
 es:{ perfil:'MI PERFIL',
  comoQ:'¿de dónde sale este número?',
  comoTot1:'De sumar lo que pusiste en cada fundamento durante toda la temporada:',
  comoTot2:'Y el de cada fundamento, de sumar partido por partido. La cuenta de un partido está abajo, en el gráfico.',
  comoPar1:'Tomemos el {fecha} contra {rival}, que es el que más pesó. Son tres cuentas:',
  comoRec:'RECEPCIÓN · {n} pases · ganaste el {real}% de esos rallies · con esa misma calidad de pase, en esta liga se gana el {esp}% → {n} × ({real} − {esp}) ÷ 100 = <b>{ap}</b>',
  comoAtk:'ATAQUE · {n} ataques · {eff}% de eficacia · los de tu puesto en la NLA están en {liga}% → {n} × ({eff} − {liga}) ÷ 100 = <b>{ap}</b>',
  comoSrv:'SAQUE · {n} saques · {a} aces ({ap_}%) y {e} errores ({ep}%) · tu puesto en la NLA: {la}% de aces y {le}% de errores → {n} × (({ap_} − {la}) + ({le} − {ep})) ÷ 100 = <b>{ap}</b>',
  comoPar2:'Sumadas: {ap} en ese partido.',
  comoPar3:'La unidad es el RALLY. Por eso las tres se pueden sumar, y por eso el total son puntos y no una nota.',
  comoF1:'Cada barra es la suma de ese fundamento en todos los partidos. Lo “esperable” no es un objetivo que puso nadie: sale de los datos de esta liga.',
  comoF2:'RECEPCIÓN · se mira qué calidad tuvo cada pase tuyo y cuántos rallies se ganan EN ESTA LIGA con esa calidad. Si ganaste más de los que se ganan, suma.',
  comoF3:'ATAQUE y SAQUE · se comparan contra el promedio de los jugadores de TU PUESTO en la NLA, no contra tu equipo ni contra todos.',
  comoF4:'BLOQUEO y DEFENSA no entran a propósito: con dos o tres por partido, cualquier número sería ruido. Van como cuenta, que es lo que son.',
  comoL1:'Te comparamos contra los {pos} de la NLA que tienen muestra suficiente, columna contra columna de la tabla oficial de la liga.',
  comoL2:'{lbl} · vos {v}% · el mejor de tu puesto {hi} y el peor {lo} · te deja {p}º de {de}.',
  comoL3:'El puesto es un conteo, no un percentil: con cuatro o siete jugadores por puesto, un percentil daría una precisión que no existe.',
  comoR1:'De tus {n} acciones con video de la temporada: {b} salieron bien y {m} salieron mal.',
  comoR2:'El reel de acá abajo muestra las BUENAS, repartidas por rondas entre lo que de verdad jugaste —un ataque, un bloqueo, un ace, una recepción, y otra vuelta— y dentro de cada una, primero las más recientes. Por eso un líbero ve recepciones y un central no.',
  comoR3:'Las que salieron mal no están acá: se abren desde los botones ▶ de arriba, al lado del número que las está contando.',
  comoR4:'Cada jugada lleva su segundo exacto, leído de la línea del .dvw. No las corta nadie a mano.',
  titMal:'Tu {f} te costó {n} puntos esta temporada.',
  titBien:'Tu {f} le puso {n} puntos al equipo.', verN:'ver las {n}', verPart:'las {n} de este partido',
  verFund:'tus {n} de este fundamento', verMal:'ver los {n} errores', verBien:'ver las {n} buenas',
  sinFuertes:'Todavía no hay nada por encima del promedio con muestra suficiente.',
  sinFlojos:'Nada por debajo del promedio, por ahora.',
  pNota:'Las cifras son la distancia al promedio de los {pos} de la NLA, en la unidad de cada fundamento.',
  h5:'De dónde sale', h5s:'tu temporada, por fundamento',
  h5p:'Las barras de arriba dicen cuánto. Esto dice de qué: cuántos de esos puntos puso cada fundamento en toda la temporada.',
  h5pie:'Sumados dan el número grande del principio.', enPart:'en {n} partidos',
  curva:'cómo viene la temporada',
  cDesde:'de 0 al arrancar, a', aFavor:'A FAVOR', enContra:'EN CONTRA',
  legNeto:'el neto del partido', legCaja:'donde cae la mitad del puesto', legOtros:'cada uno del puesto',
  legPt:'vos', legLiga:'promedio de la liga', legRango:'el rango del puesto',
  legUp:'por encima de lo esperable', legDn:'por debajo', legMa:'tu promedio de los últimos 3',
  fPart:'Partidos', fEnt:'Entrenamiento', pEnc:'{d} sobre el promedio de los {pos}',
  pBaj:'{d} por debajo del promedio de los {pos}',
  aporte:'Aporte de la temporada', pts:'puntos',
  apSub:'Los rallies que ganaste de más —o de menos— que lo esperable para tu puesto en la NLA. No es una nota: son puntos.',
  apNada:'Todavía no hay partidos con muestra suficiente para medirlo. Con el primer partido de la temporada aparece solo.',
  mPart:'partidos', mClips:'jugadas en video', mAtq:'ataques', mRec:'recepciones', mSaq:'saques', mBlq:'bloqueos',
  h1:'Partido por partido', h1s:'tu aporte, en puntos',
  h1p:'Cada barra es un partido. Arriba del cero, los puntos que pusiste de más que lo esperable; abajo, los que faltaron. Pasá el dedo por una barra para ver de dónde salió, o tocala y se abren las jugadas de ese partido.',
  mejor:'tu mejor partido', peor:'el más duro',
  unico:'tu único partido medido',
  h2:'Contra tu puesto en la NLA', h2s:'no contra tu equipo',
  h2p:'El riel va de lo peor a lo mejor que hace ese puesto en la NLA. El punto sos vos, la raya es el promedio de los {pos}, y abajo del nombre dice en qué lugar estás entre los {pos} con muestra.',
  deL:'de', falta:'faltan {n} acciones para poder compararte', sinref:'la liga todavía no tiene suficientes {pos}',
  ligaL:'liga', acc:'acciones', sobre:'sobre {n}',
  h3:'Lo tuyo', fuertes:'Donde estás por encima', flojos:'Donde hay para ganar',
  sinperfil:'Todavía no hay muestra para decirlo. Volvé después de un par de partidos.',
  h4:'Tu reel', h4s:'tus jugadas, no un resumen del equipo',
  h4p:'Salen solas del partido: no las corta nadie. Tocá una y se abre el video en ese segundo exacto.',
  todos:'Todas', fatk:'Ataques punto', fblk:'Bloqueos punto', fsrv:'Saques punto', frec:'Recepciones perfectas',
  verTodas:'▶ Ver las {n} seguidas', verTodasPar:'▶ Ver las {n} de partido', verTodasEnt:'▶ Ver las {n} de entrenamiento', sinreel:'Todavía no hay video cargado de tus partidos.',
  setL:'set', vs:'vs', ent:'entrenamiento',
  rec_l:'Recepción', atk_l:'Ataque', srv_l:'Saque', blk_l:'Bloqueo',
  tabla:'Ver la tabla', tfecha:'Fecha', trival:'Rival', tap:'Aporte',
  pie:'Lo <i>esperable</i> no es un objetivo ni una opinión: en recepción es el porcentaje de rallies que se gana en esta liga con cada calidad de pase; en ataque y saque, el promedio de los jugadores de tu puesto en la NLA. Bloqueo y defensa no entran en el aporte a propósito: con dos o tres por partido, cualquier número sería ruido — van como cuenta, que es lo que son.' },
 en:{ perfil:'MY PROFILE',
  comoQ:'where does this number come from?',
  comoTot1:'From adding up what each skill put in across the whole season:',
  comoTot2:'And each skill, from adding up match by match. One match’s arithmetic is below, in the chart.',
  comoPar1:'Take {fecha} against {rival}, the one that weighed most. Three sums:',
  comoRec:'RECEPTION · {n} passes · you won {real}% of those rallies · with that same pass quality, this league wins {esp}% → {n} × ({real} − {esp}) ÷ 100 = <b>{ap}</b>',
  comoAtk:'ATTACK · {n} attacks · {eff}% efficiency · your position in the NLA sits at {liga}% → {n} × ({eff} − {liga}) ÷ 100 = <b>{ap}</b>',
  comoSrv:'SERVE · {n} serves · {a} aces ({ap_}%) and {e} errors ({ep}%) · your position in the NLA: {la}% aces and {le}% errors → {n} × (({ap_} − {la}) + ({le} − {ep})) ÷ 100 = <b>{ap}</b>',
  comoPar2:'Added up: {ap} in that match.',
  comoPar3:'The unit is the RALLY. That is why the three can be added, and why the total is points and not a rating.',
  comoF1:'Each bar is that skill summed over every match. “Expected” is not a target someone set: it comes out of this league’s own data.',
  comoF2:'RECEPTION · we look at the quality of each of your passes and how many rallies are won IN THIS LEAGUE with that quality. Win more than that, and it adds.',
  comoF3:'ATTACK and SERVE · compared against the average of the players in YOUR POSITION in the NLA, not against your team and not against everyone.',
  comoF4:'BLOCK and DEFENCE are deliberately left out: at two or three per match any number would be noise. They go as a count, which is what they are.',
  comoL1:'You are compared against the NLA {pos} with enough sample, column against column of the league’s own table.',
  comoL2:'{lbl} · you {v}% · the best in your position {hi} and the worst {lo} · that puts you {p}th of {de}.',
  comoL3:'The rank is a count, not a percentile: with four to seven players per position, a percentile would claim a precision that isn’t there.',
  comoR1:'Of your {n} actions on video this season: {b} went well and {m} went badly.',
  comoR2:'The reel below shows the GOOD ones, dealt out in rounds across what you actually played — an attack, a block, an ace, a reception, and round again — and within each, the most recent first. That is why a libero sees receptions and a middle does not.',
  comoR3:'The ones that went badly are not here: they open from the ▶ buttons above, next to the number that is counting them.',
  comoR4:'Each play carries its exact second, read from the .dvw line. Nobody cuts them by hand.',
  titMal:'Your {f} cost {n} points this season.',
  titBien:'Your {f} put {n} points on the board.', verN:'watch the {n}', verPart:'the {n} from this match',
  verFund:'your {n} in this skill', verMal:'watch the {n} errors', verBien:'watch the {n} good ones',
  sinFuertes:'Nothing above the average with enough sample yet.',
  sinFlojos:'Nothing below the average, for now.',
  pNota:'The figures are the distance to the average of the NLA {pos}, in each skill’s own unit.',
  h5:'Where it comes from', h5s:'your season, by skill',
  h5p:'The bars above say how much. This says from what: how many of those points each skill put in across the whole season.',
  h5pie:'Added up, they make the big number at the top.', enPart:'in {n} matches',
  curva:'how the season is going',
  cDesde:'from 0 at the start, to', aFavor:'IN FAVOUR', enContra:'AGAINST',
  legNeto:'the net for the match', legCaja:'where half the position falls', legOtros:'each one in the position',
  legPt:'you', legLiga:'league average', legRango:'the range of the position',
  legUp:'above expected', legDn:'below', legMa:'your 3-match average',
  fPart:'Matches', fEnt:'Training', pEnc:'{d} above the {pos} average',
  pBaj:'{d} below the {pos} average',
  aporte:'Season contribution', pts:'points',
  apSub:'The rallies you won above —or below— what was expected for your position in the NLA. Not a rating: points.',
  apNada:'Not enough sample yet to measure it. It shows up on its own after the first match of the season.',
  mPart:'matches', mClips:'plays on video', mAtq:'attacks', mRec:'receptions', mSaq:'serves', mBlq:'blocks',
  h1:'Match by match', h1s:'your contribution, in points',
  h1p:'Each bar is a match. Above zero, the points you added over what was expected; below, the ones missing. Hold a bar to see where it came from, or tap it and that match’s plays open.',
  mejor:'your best match', peor:'the hardest one',
  unico:'your only measured match',
  h2:'Against your position in the NLA', h2s:'not against your team',
  h2p:'The track runs from the worst to the best that position does in the NLA. The dot is you, the tick is the {pos} average, and under the name it says where you stand among the {pos} with sample.',
  deL:'of', falta:'{n} more actions needed before you can be compared', sinref:'the league does not have enough {pos} yet',
  ligaL:'league', acc:'actions', sobre:'out of {n}',
  h3:'Your profile', fuertes:'Where you are above', flojos:'Where there is room',
  sinperfil:'Not enough sample yet. Come back after a couple of matches.',
  h4:'Your reel', h4s:'your plays, not a team recap',
  h4p:'They come straight out of the match: nobody cuts them. Tap one and the video opens at that exact second.',
  todos:'All', fatk:'Kills', fblk:'Block points', fsrv:'Aces', frec:'Perfect receptions',
  verTodas:'▶ Watch all {n}', verTodasPar:'▶ Watch the {n} from matches', verTodasEnt:'▶ Watch the {n} from training', sinreel:'No video loaded from your matches yet.',
  setL:'set', vs:'vs', ent:'training',
  rec_l:'Reception', atk_l:'Attack', srv_l:'Serve', blk_l:'Block',
  tabla:'See the table', tfecha:'Date', trival:'Opponent', tap:'Contribution',
  pie:'<i>Expected</i> is not a target or an opinion: in reception it is the share of rallies won in this league with each pass quality; in attack and serve, the average of the players in your position in the NLA. Block and defence are deliberately left out of the contribution: at two or three per match any number would be noise — they go as a count, which is what they are.' },
 de:{ perfil:'MEIN PROFIL',
  comoQ:'woher kommt diese Zahl?',
  comoTot1:'Aus der Summe dessen, was jedes Element über die ganze Saison beigetragen hat:',
  comoTot2:'Und jedes Element aus der Summe Spiel für Spiel. Die Rechnung eines Spiels steht unten, bei der Grafik.',
  comoPar1:'Nehmen wir den {fecha} gegen {rival}, das Spiel mit dem größten Gewicht. Drei Rechnungen:',
  comoRec:'ANNAHME · {n} Pässe · du hast {real}% dieser Ballwechsel gewonnen · mit derselben Passqualität gewinnt man in dieser Liga {esp}% → {n} × ({real} − {esp}) ÷ 100 = <b>{ap}</b>',
  comoAtk:'ANGRIFF · {n} Angriffe · {eff}% Effizienz · deine Position in der NLA liegt bei {liga}% → {n} × ({eff} − {liga}) ÷ 100 = <b>{ap}</b>',
  comoSrv:'AUFSCHLAG · {n} Aufschläge · {a} Asse ({ap_}%) und {e} Fehler ({ep}%) · deine Position in der NLA: {la}% Asse und {le}% Fehler → {n} × (({ap_} − {la}) + ({le} − {ep})) ÷ 100 = <b>{ap}</b>',
  comoPar2:'Zusammen: {ap} in diesem Spiel.',
  comoPar3:'Die Einheit ist der BALLWECHSEL. Deshalb lassen sich die drei addieren, und deshalb ist das Ergebnis Punkte und keine Note.',
  comoF1:'Jeder Balken ist dieses Element über alle Spiele summiert. „Erwartbar“ ist kein Ziel, das jemand gesetzt hat: es kommt aus den Daten dieser Liga.',
  comoF2:'ANNAHME · wir schauen die Qualität jedes deiner Pässe an und wie viele Ballwechsel IN DIESER LIGA mit dieser Qualität gewonnen werden. Gewinnst du mehr, zählt es positiv.',
  comoF3:'ANGRIFF und AUFSCHLAG · verglichen mit dem Schnitt der Spieler DEINER POSITION in der NLA, nicht mit deinem Team und nicht mit allen.',
  comoF4:'BLOCK und ABWEHR bleiben bewusst draußen: bei zwei oder drei pro Spiel wäre jede Zahl Rauschen. Sie stehen als Anzahl da.',
  comoL1:'Verglichen wirst du mit den {pos} der NLA mit ausreichender Stichprobe, Spalte gegen Spalte der offiziellen Liga-Tabelle.',
  comoL2:'{lbl} · du {v}% · der Beste deiner Position {hi} und der Schlechteste {lo} · das ergibt Platz {p} von {de}.',
  comoL3:'Der Platz ist eine Zählung, kein Perzentil: bei vier bis sieben Spielern pro Position würde ein Perzentil eine Genauigkeit behaupten, die es nicht gibt.',
  comoR1:'Von deinen {n} Aktionen mit Video in dieser Saison: {b} gelungen und {m} misslungen.',
  comoR2:'Das Reel unten zeigt die GELUNGENEN, rundenweise verteilt über das, was du wirklich gespielt hast — ein Angriff, ein Block, ein Ass, eine Annahme, und wieder von vorn — und darin die neuesten zuerst. Deshalb sieht ein Libero Annahmen und ein Mittelblocker nicht.',
  comoR3:'Die misslungenen stehen nicht hier: sie öffnen sich über die ▶ Knöpfe oben, neben der Zahl, die sie zählt.',
  comoR4:'Jede Aktion trägt ihre exakte Sekunde, gelesen aus der .dvw-Zeile. Niemand schneidet sie von Hand.',
  titMal:'Dein {f} hat dich diese Saison {n} Punkte gekostet.',
  titBien:'Dein {f} hat dem Team {n} Punkte gebracht.', verN:'die {n} ansehen', verPart:'die {n} aus diesem Spiel',
  verFund:'deine {n} in diesem Element', verMal:'die {n} Fehler ansehen', verBien:'die {n} guten ansehen',
  sinFuertes:'Noch nichts über dem Schnitt mit genug Stichprobe.',
  sinFlojos:'Vorerst nichts unter dem Schnitt.',
  pNota:'Die Zahlen sind der Abstand zum Schnitt der {pos} der NLA, in der Einheit des jeweiligen Elements.',
  h5:'Woher es kommt', h5s:'deine Saison, nach Element',
  h5p:'Die Balken oben sagen wie viel. Das hier sagt woraus: wie viele dieser Punkte jedes Element über die ganze Saison beigetragen hat.',
  h5pie:'Zusammengezählt ergeben sie die große Zahl oben.', enPart:'in {n} Spielen',
  curva:'wie die Saison läuft',
  cDesde:'von 0 am Anfang auf', aFavor:'DAFÜR', enContra:'DAGEGEN',
  legNeto:'der Netto-Wert des Spiels', legCaja:'wo die Hälfte der Position liegt', legOtros:'jeder auf dieser Position',
  legPt:'du', legLiga:'Liga-Schnitt', legRango:'die Spanne der Position',
  legUp:'über erwartbar', legDn:'darunter', legMa:'dein Schnitt der letzten 3',
  fPart:'Spiele', fEnt:'Training', pEnc:'{d} über dem Schnitt der {pos}',
  pBaj:'{d} unter dem Schnitt der {pos}',
  aporte:'Saisonbeitrag', pts:'Punkte',
  apSub:'Die Ballwechsel, die du mehr —oder weniger— gewonnen hast als für deine Position in der NLA erwartbar war. Keine Note: Punkte.',
  apNada:'Noch zu wenig Stichprobe. Nach dem ersten Saisonspiel erscheint es von selbst.',
  mPart:'Spiele', mClips:'Aktionen im Video', mAtq:'Angriffe', mRec:'Annahmen', mSaq:'Aufschläge', mBlq:'Blöcke',
  h1:'Spiel für Spiel', h1s:'dein Beitrag, in Punkten',
  h1p:'Jeder Balken ist ein Spiel. Über null die Punkte, die du mehr gebracht hast als erwartbar; darunter die fehlenden. Halte einen Balken für die Aufschlüsselung, oder tippe ihn an und die Aktionen dieses Spiels öffnen sich.',
  mejor:'dein bestes Spiel', peor:'das härteste',
  unico:'dein einziges gemessenes Spiel',
  h2:'Gegen deine Position in der NLA', h2s:'nicht gegen dein Team',
  h2p:'Die Leiste reicht vom schlechtesten bis zum besten Wert dieser Position in der NLA. Der Punkt bist du, der Strich ist der Schnitt der {pos}, und unter dem Namen steht, wo du unter den {pos} mit Stichprobe stehst.',
  deL:'von', falta:'es fehlen {n} Aktionen für einen Vergleich', sinref:'die Liga hat noch nicht genug {pos}',
  ligaL:'Liga', acc:'Aktionen', sobre:'von {n}',
  h3:'Dein Profil', fuertes:'Wo du darüber liegst', flojos:'Wo es zu holen gibt',
  sinperfil:'Noch zu wenig Stichprobe. Komm nach ein paar Spielen wieder.',
  h4:'Dein Reel', h4s:'deine Aktionen, keine Teamzusammenfassung',
  h4p:'Sie kommen direkt aus dem Spiel: niemand schneidet sie. Tippe eine an und das Video öffnet genau an dieser Sekunde.',
  todos:'Alle', fatk:'Angriffspunkte', fblk:'Blockpunkte', fsrv:'Asse', frec:'Perfekte Annahmen',
  verTodas:'▶ Alle {n} ansehen', verTodasPar:'▶ Die {n} aus Spielen ansehen', verTodasEnt:'▶ Die {n} aus dem Training ansehen', sinreel:'Noch kein Video aus deinen Spielen geladen.',
  setL:'Satz', vs:'gegen', ent:'Training',
  rec_l:'Annahme', atk_l:'Angriff', srv_l:'Aufschlag', blk_l:'Block',
  tabla:'Tabelle ansehen', tfecha:'Datum', trival:'Gegner', tap:'Beitrag',
  pie:'<i>Erwartbar</i> ist kein Ziel und keine Meinung: in der Annahme der Anteil gewonnener Ballwechsel in dieser Liga pro Passqualität; im Angriff und Aufschlag der Durchschnitt der Spieler deiner Position in der NLA. Block und Abwehr zählen bewusst nicht zum Beitrag: bei zwei oder drei pro Spiel wäre jede Zahl Rauschen — sie stehen als Anzahl da, und das sind sie.' }
};
var PUESTO={ es:{L:'líberos',OH:'puntas',OPP:'opuestos',MB:'centrales',S:'armadores'},
             en:{L:'liberos',OH:'outside hitters',OPP:'opposites',MB:'middles',S:'setters'},
             de:{L:'Libero',OH:'Außenangreifer',OPP:'Diagonalangreifer',MB:'Mittelblocker',S:'Zuspieler'} };
var ETQ={ es:{atk:'Ataque',rec:'Recepción',ace:'Saque punto',err:'Error de saque',blk:'Bloqueo punto'},
          en:{atk:'Attack',rec:'Reception',ace:'Ace',err:'Service error',blk:'Block point'},
          de:{atk:'Angriff',rec:'Annahme',ace:'Ass',err:'Aufschlagfehler',blk:'Blockpunkt'} };

function idioma(){ var l='es'; try{ l=(typeof getLang==='function'?getLang():'es')||'es'; }catch(e){} return T[l]?l:'es'; }
function L(){ return T[idioma()]; }
function pos2(p){ return (PUESTO[idioma()]||PUESTO.es)[p]||''; }
function etq(k,fb){ return (ETQ[idioma()]||ETQ.es)[k]||fb||k; }
function f(s,o){ return String(s).replace(/\{(\w+)\}/g,function(_,k){ return o&&o[k]!=null?o[k]:''; }); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function sig(n,d){ var v=Number(n)||0; return (v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(d==null?1:d); }
function col(n){ return (Number(n)||0)>=0?UP:DN; }

var D=window.FICHA_DATA, cont=document.getElementById('ficha'),
    sel=document.getElementById('selJug'), tip=document.getElementById('tip');
if(!cont) return;

function miDorsal(){ try{
    if((localStorage.getItem('vb_role')||'').toLowerCase()!=='player') return null;
    var n=parseInt(localStorage.getItem('vb_player_num'),10); return isNaN(n)?null:n;
  }catch(e){ return null; } }
function pedido(){
  /* jugador.html manda ?num=7 para caer directo en la ficha de ese dorsal.
     Si quien entro es un jugador esto no cambia nada: abajo ya se filtra a
     uno solo y el parametro no puede abrir la ficha de otro. */
  try{ var m=/[?&]num=(\d+)/.exec(location.search); return m?parseInt(m[1],10):null; }catch(e){ return null; }
}
var YO=miDorsal(), iSel=0, filtro='todos', PEDIDO=pedido();

function lista(){ var J=(D&&D.jugadores)||[];
  return YO===null ? J : J.filter(function(j){ return j.num===YO; }); }

/* ── el globito ────────────────────────────────────────────────────────── */
function globo(ev,html){
  if(!html){ tip.className=''; return; }
  tip.innerHTML=html; tip.className='on';
  var r=tip.getBoundingClientRect();
  var x=Math.min(Math.max(8, ev.clientX-r.width/2), innerWidth-r.width-8);
  var y=ev.clientY-r.height-14; if(y<8) y=ev.clientY+20;
  tip.style.left=x+'px'; tip.style.top=y+'px';
}
addEventListener('scroll',function(){ tip.className=''; },{passive:true});

/* ══ EL VIDEO, QUE ES LO QUE NADIE MAS TIENE ═════════════════════════════
   Cada numero de esta pantalla sabe cuales son SUS jugadas. Tocar el saque
   del 09/10 abre esos cuatro saques, uno atras del otro, en el segundo
   exacto. Eso no sale de un grafico mejor: sale de que el .dvw guarda el
   segundo de cada accion y nosotros lo guardamos tambien.

   Los clips de entrenamiento y los de partido viven en archivos distintos
   —datos_video y datos_video_ent— y cortes.html abre uno a la vez, asi que
   una lista mezclada deja la mitad sin encontrar. Por eso se separa siempre
   y, si hay de los dos, mandan los de partido.                             */
function clipsDe(j, f){
  var C=(j&&j.clips)||[];
  return C.filter(function(c){
    if(f.sk && c.sk!==f.sk) return false;
    if(f.b!=null && c.b!==f.b) return false;
    if(f.fecha && c.fecha!==f.fecha) return false;
    if(f.mc && c.mc!==f.mc) return false;
    if(f.tipo && c.tipo!==f.tipo) return false;
    return true;
  });
}
/* Cuantos clips entran en una lista. No es un capricho de diseno: la lista
   viaja en la direccion, y 119 clips arman una direccion de cinco mil
   caracteres que algunos navegadores cortan por la mitad. Treinta son cinco
   minutos de video, que es mas de lo que nadie mira de una sentada. */
var TOPE_CLIPS=30;
function linkClips(cl){
  if(!cl||!cl.length) return null;
  cl = cl.slice().sort(function(a,b){ return (b.fecha||'').localeCompare(a.fecha||'') || a.t-b.t; })
         .slice(0,TOPE_CLIPS);
  var par=cl.filter(function(c){ return c.tipo!=='entrenamiento'; });
  var usa = par.length ? par : cl;
  var ent = usa[0].tipo==='entrenamiento';
  return 'cortes.html?modo='+(ent?'ent':'partido')+'&clips='+encodeURIComponent(
    usa.map(function(c){ return c.mc+'-'+c.t+'-'+('0'+c.num).slice(-2); }).join(';'));
}
function verBtn(cl, texto, clase){
  var u=linkClips(cl);
  if(!u) return '';
  return '<a class="ver '+(clase||'')+'" href="'+esc(u)+'">'
    +'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.6 10 6l-7 4.4z"/></svg>'
    +esc(f(texto,{n:Math.min(cl.length,TOPE_CLIPS)}))+'</a>';
}

/* ══ EL TITULAR ══════════════════════════════════════════════════════════
   Lo primero que se lee no es un numero: es una frase. Sale sola de los
   datos —el fundamento que mas puntos se llevo y el que mas puso— y cada una
   abre las jugadas que la prueban. Si la pantalla afirma que el saque costo
   catorce puntos, el jugador tiene que poder ver esos saques.             */
function nomFund(k){ var t=L(); return {rec:t.rec_l, atk:t.atk_l, srv:t.srv_l}[k]||k; }
function titulares(j){
  var t=L(), P=(j.partidos||[]).filter(function(p){ return p.rec||p.atk||p.srv; });
  if(!P.length) return '';
  var su={rec:0,atk:0,srv:0}, hay={rec:0,atk:0,srv:0};
  P.forEach(function(p){ ['rec','atk','srv'].forEach(function(k){
    if(p[k]&&p[k].ap!=null){ su[k]+=p[k].ap; hay[k]++; } }); });
  var ks=['rec','atk','srv'].filter(function(k){ return hay[k]; });
  if(!ks.length) return '';
  var peor=ks.slice().sort(function(a,b){ return su[a]-su[b]; })[0];
  var mejor=ks.slice().sort(function(a,b){ return su[b]-su[a]; })[0];
  var out='';
  if(su[peor] <= -1.5){
    var mal=clipsDe(j,{sk:peor,b:0});
    out+='<a class="tit mal'+(mal.length?'':' sinvideo')+'" '
      +(mal.length?'href="'+esc(linkClips(mal))+'"':'')+'>'
      +'<b>'+f(t.titMal,{f:nomFund(peor).toLowerCase(), n:Math.round(Math.abs(su[peor]))})+'</b>'
      +(mal.length?'<span class="tv"><svg viewBox="0 0 12 12"><path d="M3 1.6 10 6l-7 4.4z"/></svg>'
        +f(t.verN,{n:Math.min(mal.length,TOPE_CLIPS)})+'</span>':'')+'</a>';
  }
  if(mejor!==peor && su[mejor] >= 1.5){
    var bien=clipsDe(j,{sk:mejor,b:1});
    out+='<a class="tit bien'+(bien.length?'':' sinvideo')+'" '
      +(bien.length?'href="'+esc(linkClips(bien))+'"':'')+'>'
      +'<b>'+f(t.titBien,{f:nomFund(mejor).toLowerCase(), n:Math.round(su[mejor])})+'</b>'
      +(bien.length?'<span class="tv"><svg viewBox="0 0 12 12"><path d="M3 1.6 10 6l-7 4.4z"/></svg>'
        +f(t.verN,{n:Math.min(bien.length,TOPE_CLIPS)})+'</span>':'')+'</a>';
  }
  return out ? '<div class="tits">'+out+'</div>' : '';
}

/* ══ 1 · EL ENCABEZADO ════════════════════════════════════════════════════
   El dorsal gigante de fondo es el mismo recurso que ya usa jugador.html: la
   pantalla nueva no inventa un idioma propio, habla el de la app.          */
var SEQ=0;
function acumulada(j, ancho, alto){
  var P=(j.partidos||[]).filter(function(p){ return p.rec||p.atk||p.srv; });
  if(P.length<2) return '';
  var ac=[0], su=0;
  P.forEach(function(p){ su+=Number(p.aporte)||0; ac.push(su); });
  var hi=Math.max.apply(null,ac.concat([0])), lo=Math.min.apply(null,ac.concat([0]));
  var pad=Math.max((hi-lo)*0.2,0.5); hi+=pad; lo-=pad;
  var ML=2, MR=2, MT=12, MB=12, pw=ancho-ML-MR, ph=alto-MT-MB;
  var X=function(i){ return ML+pw*i/(ac.length-1); };
  var Y=function(v){ return MT+(hi-v)/(hi-lo)*ph; };
  var fin=ac[ac.length-1], c=col(fin), id='ac'+(SEQ++);
  var linea=ac.map(function(v,i){ return (i?'L':'M')+X(i).toFixed(1)+','+Y(v).toFixed(1); }).join('');
  var area=linea+'L'+X(ac.length-1).toFixed(1)+','+Y(0).toFixed(1)+'L'+X(0).toFixed(1)+','+Y(0).toFixed(1)+'Z';
  return '<svg class="acum" viewBox="0 0 '+ancho+' '+alto+'" preserveAspectRatio="none" aria-hidden="true">'
    +'<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1">'
    +'<stop offset="0" stop-color="'+c+'" stop-opacity=".34"/>'
    +'<stop offset="1" stop-color="'+c+'" stop-opacity="0"/></linearGradient></defs>'
    +'<line x1="'+ML+'" x2="'+(ancho-MR)+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)
    +'" stroke="rgba(255,255,255,.22)" stroke-width="1" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/>'
    +'<path class="acArea" d="'+area+'" fill="url(#'+id+')"/>'
    +'<path class="acLin" d="'+linea+'" fill="none" stroke="'+c+'" stroke-width="2" stroke-linejoin="round" '
    +'stroke-linecap="round" vector-effect="non-scaling-stroke"/>'
    +'<circle class="acPt" cx="'+X(ac.length-1).toFixed(1)+'" cy="'+Y(fin).toFixed(1)+'" r="3.4" fill="'+c+'"/>'
    +'</svg>';
}
function hero(j){
  var t=L(), ap=j.aporte_total, tt=j.tot||{}, m=[];
  function mini(l,v){ if(v) m.push('<span><b>'+v+'</b><s>'+l+'</s></span>'); }
  mini(t.mPart,(j.partidos||[]).length); mini(t.mAtq,tt.atk_n); mini(t.mRec,tt.rec_n);
  mini(t.mSaq,tt.srv_n); mini(t.mBlq,tt.blk_n); mini(t.mClips,j.n_clips);
  var cifra = ap===null ? '<b style="color:'+REF+'">–</b>'
    : '<b class="cuenta" style="color:'+col(ap)+'" data-v="'+ap+'">'+sig(ap)+'</b>';
  var curva = acumulada(j, 320, 112);
  var club = (D&&D.club) || '';
  return '<div class="hero">'
    +'<div class="dorsal" aria-hidden="true">'+esc(j.num)+'</div>'
    +'<div class="hero-id">'
      +'<div class="foto" id="foto-jug" data-num="'+esc(j.num)+'"><span>'+esc(j.num)+'</span></div>'
      +'<div class="quien"><h1>'+esc(j.nombre)+'</h1>'
        +'<div class="meta"><em>'+esc(j.pos_lbl)+'</em>'+(club?'<i>'+esc(club)+'</i>':'')
        +(D&&D.temporada?'<i>'+esc(D.temporada)+'</i>':'')+'</div></div>'
      +'<img class="escudo" src="escudo.png" alt="" onerror="this.remove()">'
    +'</div>'
    +titulares(j)
    +'<div class="hero-g">'
    +'<div class="cifra"><i>'+t.aporte+' · '+t.pts+'</i>'+cifra
    +'<em>'+(ap===null?t.apNada:t.apSub)+'</em></div>'
    +(curva?'<div class="curva"><u>'+t.curva+'</u>'+curva
      +'<span class="cpie">'+f(t.cDesde,{n:(j.partidos||[]).length})
      +' <b style="color:'+col(ap)+'">'+sig(ap)+'</b></span></div>':'<div></div>')
    +'</div>'+comoTotal(j)+'<div class="mini">'+m.join('')+'</div></div>';
}

/* La foto, por orden de preferencia:
     1. datos_fotos.js, que FOTOS_JUGADORES.py arma solo desde las fotos
        oficiales del club. Nadie carga nada: estan ahi desde el dia que las
        mando el fotografo.
     2. la del alta, por Firebase, que es de donde salia en jugador.html y
        sigue mandando si alguien cargo una a mano.
     3. el dorsal, que es lo que habia antes.
   Primero la 1 porque es instantanea —ya vino con la pagina— y Firebase
   tarda. Si despues llega una del alta, pisa a la automatica: el que se
   tomo el trabajo de subir una tiene razon por sobre el automatismo. */
function ponerFoto(){
  var caja=document.getElementById('foto-jug');
  if(!caja) return;
  var num=caja.getAttribute('data-num'), nn=('0'+num).slice(-2);
  function pone(v){
    if(typeof v!=='string' || v.indexOf('data:image')!==0) return;
    caja.innerHTML='<img src="'+v+'" alt="">';
    caja.classList.add('con');
  }
  try{ pone((window.FOTOS_JUGADORES||{})[nn]); }catch(e){}
  if(typeof fbGet!=='function') return;
  var cat='Primera';
  try{ cat=(window.categoriaActual&&window.categoriaActual())||((window.CATEGORIAS_CLUB||[])[0])||'Primera'; }catch(e){}
  var listo=false;
  try{ fbGet('jugador_foto/'+cat+'/'+nn, function(v){ if(!listo){ listo=true; pone(v); } }); }catch(e){}
  setTimeout(function(){ listo=true; }, 4000);
}

/* ══ 2 · EL GRAFICO: PARTIDO POR PARTIDO ════════════════════════════════
   CADA BARRA ES UN PARTIDO Y ESTA PARTIDA EN TRES. Antes era una barra lisa
   con el neto, y para saber de donde salia ese neto habia que pasar el dedo
   por encima. Ahora se ve de una: lo que puso la recepcion, lo que puso el
   ataque y lo que puso el saque, apilados hacia arriba los que sumaron y
   hacia abajo los que restaron, con una marca blanca en el NETO del partido.

   EL SIGNO NO LO DICE EL COLOR, LO DICE EL LADO. Por eso los colores quedan
   libres para la unica cosa que solo el color puede decir: que fundamento
   fue. Arriba del cero el fondo esta apenas tenido de verde y abajo de rojo,
   asi que el "me fue bien / me fue mal" se lee sin leer nada.

   Medido: verde, dorado y azul quedan a 8.2 de distancia bajo deuteranopia
   (el piso es 8) y a 15.3 o mas en vision normal, los tres sobre 3:1 de
   contraste contra el panel. Y no van solos: cada segmento esta separado por
   un corte de 1px, cada barra esta de un lado del cero, y el detalle numero
   por numero esta escrito en la tabla de abajo.                            */
var PAR=[];
var SK={rec:'#1C85A8', atk:'#12A86A', srv:'#B8841A'};
var TREND='#8A6FD8';
function anchoGraf(){
  var w=(cont&&cont.clientWidth)||360;
  return Math.max(258, Math.round(w-60));
}
function rectPath(x,w,ya,yb,rArriba,rAbajo){
  /* Rectangulo con las esquinas redondeadas SOLO del lado del dato: la punta
     se redondea 4px y el lado que apoya en el cero queda recto. */
  var r=4, top=Math.min(ya,yb), h=Math.abs(yb-ya);
  if(h<0.6) return '';
  var rt=rArriba?Math.min(r,h,w/2):0, rb=rAbajo?Math.min(r,h,w/2):0;
  return 'M'+(x+rt)+','+top
    +'h'+(w-2*rt)+(rt?'a'+rt+','+rt+' 0 0 1 '+rt+','+rt:'')
    +'v'+(h-rt-rb)+(rb?'a'+rb+','+rb+' 0 0 1 '+(-rb)+','+rb:'')
    +'h'+(-(w-2*rb))+(rb?'a'+rb+','+rb+' 0 0 1 '+(-rb)+','+(-rb):'')
    +'v'+(-(h-rt-rb))+(rt?'a'+rt+','+rt+' 0 0 1 '+rt+','+(-rt):'')+'z';
}
function partesDe(p){
  return [['rec', p.rec&&p.rec.ap!=null?p.rec.ap:0],
          ['atk', p.atk&&p.atk.ap!=null?p.atk.ap:0],
          ['srv', p.srv&&p.srv.ap!=null?p.srv.ap:0]];
}
function barras(j){
  var t=L();
  PAR=(j.partidos||[]).filter(function(p){ return p.rec||p.atk||p.srv; });
  var n=PAR.length;
  if(!n) return '<div class="panel"><div class="vacio">'+t.apNada+'</div></div>';

  var W=anchoGraf(), chico=W<520, id=SEQ++;
  var H=chico?244:252, ML=chico?34:44, MR=chico?12:16, MT=chico?32:34, MB=34;
  var pw=W-ML-MR, ph=H-MT-MB;

  var nets=PAR.map(function(p){ return Number(p.aporte)||0; });
  var dmax=Math.max.apply(null,nets.concat([0])), dmin=Math.min.apply(null,nets.concat([0]));
  var pad=Math.max((dmax-dmin)*0.17, 0.8), hi=dmax+pad, lo=dmin-pad;
  var Y=function(v){ return MT+(hi-v)/(hi-lo)*ph; };
  var band=Math.min(pw/n,88), usado=band*n, off=ML+(pw-usado)/2;
  var bw=Math.max(7,Math.min(24,band-10));
  var X=function(i){ return off+band*i+band/2; };
  var y0=Y(0);
  var vs=PAR.map(function(p){ return Number(p.aporte)||0; });
  var mejI=0, peoI=0;
  vs.forEach(function(v,i){ if(v>vs[mejI])mejI=i; if(v<vs[peoI])peoI=i; });

  var s='<svg class="cht" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" '
   +'preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(t.h1+': '+n+' '+t.mPart)+'">'
   +'<defs>'
   +'<linearGradient id="zu'+id+'" x1="0" y1="0" x2="0" y2="1">'
   +'<stop offset="0" stop-color="'+UP+'" stop-opacity="0"/><stop offset="1" stop-color="'+UP+'" stop-opacity=".07"/></linearGradient>'
   +'<linearGradient id="zd'+id+'" x1="0" y1="0" x2="0" y2="1">'
   +'<stop offset="0" stop-color="'+DN+'" stop-opacity=".05"/><stop offset="1" stop-color="'+DN+'" stop-opacity="0"/></linearGradient>'
   +'<linearGradient id="tr'+id+'" x1="0" y1="0" x2="0" y2="1">'
   +'<stop offset="0" stop-color="'+TREND+'" stop-opacity=".20"/><stop offset="1" stop-color="'+TREND+'" stop-opacity="0"/></linearGradient>'
   /* Las barras no son un color plano: van de su tono pleno en la punta del
      dato a un 72% en el cero. Es poco, y es la diferencia entre una barra
      dibujada y una barra impresa. */
   +'<linearGradient id="bu'+id+'" x1="0" y1="0" x2="0" y2="1">'
   +'<stop offset="0" stop-color="'+UP+'"/><stop offset="1" stop-color="'+UP+'" stop-opacity=".62"/></linearGradient>'
   +'<linearGradient id="bd'+id+'" x1="0" y1="0" x2="0" y2="1">'
   +'<stop offset="0" stop-color="'+DN+'" stop-opacity=".62"/><stop offset="1" stop-color="'+DN+'"/></linearGradient>'
   +'</defs>';

  s+='<rect x="'+ML+'" y="'+MT+'" width="'+pw+'" height="'+Math.max(0,y0-MT).toFixed(1)+'" fill="url(#zu'+id+')"/>'
    +'<rect x="'+ML+'" y="'+y0.toFixed(1)+'" width="'+pw+'" height="'+Math.max(0,MT+ph-y0).toFixed(1)+'" fill="url(#zd'+id+')"/>';

  var paso=Math.max(1,Math.round((hi-lo)/5));
  for(var g=Math.ceil(lo/paso)*paso; g<=hi; g+=paso){
    if(Math.abs(g)<1e-9) continue;
    s+='<line class="gr" x1="'+ML+'" x2="'+(W-MR)+'" y1="'+Y(g).toFixed(1)+'" y2="'+Y(g).toFixed(1)+'"/>'
      +'<text class="ax" x="'+(ML-7)+'" y="'+(Y(g)+3).toFixed(1)+'" text-anchor="end">'
      +(g>0?'+':'−')+Math.abs(g)+'</text>';
  }
  s+='<line class="g0" x1="'+ML+'" x2="'+(W-MR)+'" y1="'+y0.toFixed(1)+'" y2="'+y0.toFixed(1)+'"/>'
    +'<text class="ax" x="'+(ML-7)+'" y="'+(y0+3).toFixed(1)+'" text-anchor="end">0</text>'
    /* A la derecha y no a la izquierda: abajo a la izquierda estan las fechas
       del eje y las dos cosas se pisaban. */
    +'<text class="zn" x="'+(W-MR)+'" y="'+(MT-13)+'" text-anchor="end">'+esc(t.aFavor)+'</text>'
    +'<text class="zn" x="'+(W-MR)+'" y="'+(MT+ph+15)+'" text-anchor="end">'+esc(t.enContra)+'</text>';

  PAR.forEach(function(p,i){
    var v=vs[i], x=X(i)-bw/2, c=col(v);
    s+='<path class="b" d="'+rectPath(x.toFixed(1),bw.toFixed(1),y0.toFixed(1),Y(v).toFixed(1),v>0,v<0)
      +'" fill="url(#b'+(v>0?'u':'d')+id+')"/>'
      +(function(){
         /* La barra no es un dibujo: es la puerta a ese partido. Tocarla abre
            las jugadas de ese dia, en el segundo exacto. */
         var cl=clipsDe(j,{mc:p.mc}), u=cl.length?linkClips(cl):null;
         var r='<rect class="hit" x="'+(off+band*i).toFixed(1)+'" y="'+MT+'" width="'+band.toFixed(1)
           +'" height="'+ph+'" data-i="'+i+'" tabindex="0" role="button" aria-label="'
           +esc(p.fecha_app+' '+t.vs+' '+p.rival+': '+sig(v)
                +(cl.length?' \u00b7 '+f(t.verPart,{n:Math.min(cl.length,TOPE_CLIPS)}):''))+'"></rect>';
         return u ? '<a class="hitl" href="'+esc(u)+'">'+r+'</a>' : r;
       })();
  });

  var hayMa=n>=4, ma=[];
  if(hayMa){
    vs.forEach(function(_,i){
      var a=vs.slice(Math.max(0,i-2),i+1), su=0;
      a.forEach(function(x){ su+=x; }); ma.push(su/a.length);
    });
    var lin=ma.map(function(v,i){ return (i?'L':'M')+X(i).toFixed(1)+','+Y(v).toFixed(1); }).join('');
    s+='<path d="'+lin+'L'+X(n-1).toFixed(1)+','+y0.toFixed(1)+'L'+X(0).toFixed(1)+','+y0.toFixed(1)
      +'Z" fill="url(#tr'+id+')"/><path class="ln" d="'+lin+'"/>'
      +'<circle cx="'+X(n-1).toFixed(1)+'" cy="'+Y(ma[n-1]).toFixed(1)+'" r="5" fill="'+TREND
      +'" stroke="#0D1020" stroke-width="2"/>';
  }

  if(n>=3){
    [[mejI,-14],[peoI,22]].forEach(function(e){
      var i=e[0], v=vs[i]; if(!v) return;
      var x=Math.max(ML+18,Math.min(W-MR-18,X(i)));
      s+='<text class="et" x="'+x.toFixed(1)+'" y="'+(Y(v)+e[1]).toFixed(1)+'" text-anchor="middle" fill="'
        +col(v)+'">'+sig(v)+'</text>';
    });
  }

  var prev='';
  PAR.forEach(function(p,i){
    var d=(p.fecha_app||'').slice(0,5);
    if(d===prev) return; prev=d;
    s+='<text class="ax" x="'+X(i).toFixed(1)+'" y="'+(H-12)+'" text-anchor="middle">'+esc(d)+'</text>';
  });
  s+='</svg>';

  var leyenda='<div class="leg">'
    +'<span><i style="background:'+UP+'"></i>'+esc(t.legUp)+'</span>'
    +'<span><i style="background:'+DN+'"></i>'+esc(t.legDn)+'</span>'
    +(hayMa?'<span><u style="background:'+TREND+'"></u>'+esc(t.legMa)+'</span>':'')+'</div>';

  function extremo(i,lbl){ return '<span><b style="color:'+col(vs[i])+'">'+sig(vs[i])+'</b>'
      +esc(lbl)+' · '+esc(corto(PAR[i].rival))+'</span>'; }
  var extremos='<div class="extremos">'
    +(mejI===peoI ? extremo(mejI,t.unico) : extremo(mejI,t.mejor)+extremo(peoI,t.peor))+'</div>';

  var tabla='<details><summary>'+t.tabla+'</summary><div class="tscroll"><table class="tabla"><thead><tr><th>'
   +t.tfecha+'</th><th>'+t.trival+'</th><th>'+t.rec_l+'</th><th>'+t.atk_l+'</th><th>'+t.srv_l+'</th><th>'
   +t.tap+'</th></tr></thead><tbody>'
   +PAR.map(function(p){ function c(x){ return (x&&x.ap!=null)?sig(x.ap):'–'; }
      return '<tr><td>'+esc(p.fecha_app)+'</td><td>'+esc(corto(p.rival))+'</td><td>'+c(p.rec)+'</td><td>'
        +c(p.atk)+'</td><td>'+c(p.srv)+'</td><td style="color:'+col(p.aporte)+';font-weight:700">'
        +sig(p.aporte)+'</td></tr>'; }).join('')
   +'</tbody></table></div></details>';

  return '<div class="panel">'+s+leyenda+extremos+comoPartido(j)+tabla+'</div>';
}
function corto(r){
  /* "VOLLEY AMRISWIL 2026/27" en una tarjeta de 150px entra en tres lineas y
     deja de ser un nombre. Se le saca la temporada y el "VOLLEY" de adelante,
     que no distingue a nadie en esta liga. */
  var x=String(r||'').replace(/\s*\d{4}\s*\/\s*\d{2,4}\s*$/,'').replace(/^VOLLEY\s+/i,'').trim();
  return x||String(r||'');
}
function globoPartido(p){
  var t=L();
  var h='<div class="tk">'+esc(p.fecha_app)+' · '+t.vs+' '+esc(corto(p.rival))+'</div>'
       +'<div class="tv" style="color:'+col(p.aporte)+'">'+sig(p.aporte)+'</div>';
  function fila(k,l,x,ex){ if(!x||x.ap==null) return '';
    return '<div class="tr"><em style="background:'+SK[k]+'"></em>'+l
      +(ex?' <span style="color:var(--mut)">'+ex+'</span>':'')
      +'<b style="color:'+col(x.ap)+'">'+sig(x.ap)+'</b></div>'; }
  h+=fila('rec',t.rec_l,p.rec,p.rec?(p.rec.real+'% / '+p.rec.esp+'%'):'');
  h+=fila('atk',t.atk_l,p.atk,p.atk?(p.atk.eff+'% / '+p.atk.liga+'%'):'');
  h+=fila('srv',t.srv_l,p.srv,p.srv?(p.srv.ace+'✓ '+p.srv.err+'✗'):'');
  if(p.blk&&p.blk.pt) h+='<div class="tr"><em style="background:'+REF+'"></em>'+t.blk_l+'<b>'+p.blk.pt+'</b></div>';
  return h;
}

/* ══ 2b · DE DONDE SALE ══════════════════════════════════════════════════
   Las barras de arriba contestan "cuanto"; esto contesta "de que".

   Se mide por TEMPORADA y no partido por partido a proposito. En un partido
   suelto un jugador tiene veinte ataques: el reparto entre recepcion, ataque
   y saque ahi es casi todo ruido. Sumada la temporada, el reparto si quiere
   decir algo — y es la pregunta que de verdad se hace el que mira su ficha:
   "mi -12 ¿de donde salio?".

   Se probo meter esto adentro de las barras de arriba, apilado. Quedaba una
   columna de colores donde lo mas dificil de encontrar era justamente el
   numero del partido. Un grafico que esconde su dato principal para mostrar
   un dato secundario esta mal armado, por lindo que sea.                   */
function deDonde(j){
  var t=L(), P=(j.partidos||[]).filter(function(p){ return p.rec||p.atk||p.srv; });
  if(!P.length) return '';
  var su={rec:0,atk:0,srv:0}, hay={rec:0,atk:0,srv:0};
  P.forEach(function(p){ partesDe(p).forEach(function(e){
      var x=p[e[0]]; if(x&&x.ap!=null){ su[e[0]]+=x.ap; hay[e[0]]++; } }); });
  var filas=[['rec',t.rec_l],['atk',t.atk_l],['srv',t.srv_l]].filter(function(e){ return hay[e[0]]; });
  if(!filas.length) return '';
  var tope=1;
  filas.forEach(function(e){ tope=Math.max(tope,Math.abs(su[e[0]])); });
  tope*=1.12;
  return '<div class="panel"><div class="dd">'+filas.map(function(e){
    var v=su[e[0]], c=col(v), an=Math.abs(v)/tope*50;
    var est = v>=0 ? 'left:50%;width:'+an.toFixed(1)+'%;border-radius:0 4px 4px 0'
                   : 'right:50%;width:'+an.toFixed(1)+'%;border-radius:4px 0 0 4px';
    /* Si la barra se come casi toda la mitad, el numero no entra afuera y se
       cortaba contra el borde. En ese caso entra ADENTRO de la barra, en
       oscuro: los tres colores estan sobre 3:1 contra el panel, asi que un
       texto casi negro encima tiene contraste de sobra. */
    var dentro = an>30, lab;
    if(dentro) lab = (v>=0 ? 'left:50%;' : 'right:50%;')+'width:'+an.toFixed(1)
               +'%;color:#0A0D18;text-align:'+(v>=0?'right':'left')+';padding:0 8px';
    else lab = (v>=0 ? 'left:'+(50+an).toFixed(1)+'%;margin-left:9px'
                     : 'right:'+(50+an).toFixed(1)+'%;margin-right:9px')+';color:'+c;
    /* El boton abre lo que la barra esta diciendo: si el fundamento resto,
       los errores; si sumo, las buenas. */
    var cl=clipsDe(j,{sk:e[0], b: v>=0?1:0});
    return '<div class="ddrow"><b>'+esc(e[1])+'<s>'+f(t.enPart,{n:hay[e[0]]})+'</s>'
      +verBtn(cl, v>=0?t.verBien:t.verMal)+'</b>'
      +'<div class="ddt"><div class="ddcero"></div>'
      +'<div class="ddbar" style="'+est+';background:'+c+'"></div>'
      +'<div class="ddval'+(dentro?' adentro':'')+'" style="'+lab+'">'+sig(v)+'</div></div></div>';
  }).join('')+'</div><div class="ddpie">'+esc(t.h5pie)+'</div>'+comoFund(j)+'</div>';
}

/* ══ 3 · CONTRA EL PUESTO EN LA LIGA ═════════════════════════════════════
   Esto era una raya con un punto, y una raya con un punto no dice donde esta
   parado nadie. Ahora se dibuja EL PUESTO ENTERO: una marquita por cada
   jugador de ese puesto en la NLA, la franja donde cae la mitad del medio
   —del primer al tercer cuartil—, el promedio como una raya, y encima el
   jugador. Asi se ve de un vistazo lo que el ranking solo no cuenta: si el
   puesto esta todo junto y hay dos decimas entre el primero y el ultimo, o
   si hay un abismo y el esta del lado malo.

   El punto y la raya del promedio quedan a 4.5 bajo protanopia, asi que no se
   distinguen por color: se distinguen por FORMA —un circulo con anillo contra
   una linea vertical— y el valor va escrito al lado del punto.             */
function anclaje(pct){
  var tx=Math.max(0,Math.min(100,(pct-8)/84*100));
  return 'left:'+pct.toFixed(1)+'%;transform:translateX(-'+tx.toFixed(0)+'%)';
}
function filasLiga(j){
  var t=L(), F=j.liga||[];
  if(!F.length) return '';
  var h='<div class="panel"><div class="leg">'
   +'<span><i class="uvos"></i>'+esc(t.legPt)+'</span>'
   +'<span><u class="uliga"></u>'+esc(t.legLiga)+'</span>'
   +'<span><u class="ucaja"></u>'+esc(t.legCaja)+'</span>'
   +'<span><u class="uotro"></u>'+esc(t.legOtros)+'</span></div><div class="liga">';
  F.forEach(function(r){
    var lbl=etq(r.k,r.lbl);
    var skV = {atk:'atk', rec:'rec', ace:'srv', err:'srv', blk:'blk'}[r.k];
    var clV = skV ? clipsDe(j,{sk:skV, b: r.k==='err'?0:1}) : [];
    var cab='<div class="lcab"><b>'+esc(lbl)+'</b><s>'+f(t.sobre,{n:r.n})+' '+t.acc+'</s>'
      +(r.puesto?'<span class="lrank"><i>'+r.puesto+'º</i> '+t.deL+' '+r.de+'</span>':'')
      +verBtn(clV, r.k==='err'?t.verMal:t.verBien)+'</div>';
    if(r.puesto && r.lo!=null && r.hi!=null){
      var lo=r.lo, hi=r.hi, rg=(hi-lo)||1;
      var px=function(v){ return Math.max(0,Math.min(100,(v-lo)/rg*100)); };
      var arriba = r.mas_mejor===false ? (r.v<r.liga) : (r.v>r.liga);
      var c=arriba?UP:DN, pv=px(r.v), pl=px(r.liga);
      var caja='';
      if(r.q1!=null && r.q3!=null && r.q3>r.q1){
        caja='<div class="caja" style="left:'+px(r.q1).toFixed(1)+'%;width:'
            +(px(r.q3)-px(r.q1)).toFixed(1)+'%"></div>';
      }
      var otros=(r.vals||[]).map(function(v){
        return '<div class="otro" style="left:'+px(v).toFixed(1)+'%"></div>'; }).join('');
      h+='<div class="lrow">'+cab+'<div class="track">'
       +'<div class="riel"></div>'+caja+otros
       +'<div class="cap" style="left:0"></div><div class="cap" style="left:100%"></div>'
       +(pv>5?'<div class="ext" style="left:0">'+lo+'</div>':'')
       +(pv<95?'<div class="ext" style="right:0">'+hi+'</div>':'')
       +'<div class="tick" style="left:'+pl.toFixed(1)+'%"><s style="'+anclaje(pl)+'">'+r.liga+'</s></div>'
       +'<div class="pt" style="left:'+pv.toFixed(1)+'%;background:'+c+';box-shadow:0 0 0 3px var(--card),0 0 14px '+c+'66"></div>'
       +'<div class="pv" style="'+anclaje(pv)+';color:'+c+'">'+r.v+'%</div>'
       +'</div></div>';
    } else {
      var nota = r.sin_ref ? f(t.sinref,{pos:pos2(j.pos)}) : f(t.falta,{n:r.falta});
      h+='<div class="lrow">'+cab+'<div class="falta"><b>'+(r.v==null?'–':r.v+'%')+'</b>'+esc(nota)+'</div></div>';
    }
  });
  return h+'</div>'+comoLiga(j)+'</div>';
}

/* ══ 4 · FUERTES Y FLOJOS ════════════════════════════════════════════════
   Va ULTIMO y no primero a proposito: es la conclusion, y una conclusion
   antes de la evidencia es una opinion. Arriba estan los numeros; aca estan
   escritos en dos columnas, lo que sobra y lo que falta, para el que cierra
   la pantalla sin leer un grafico.                                         */
function perfil(j){
  var t=L(), P=j.perfil||{fuertes:[],flojos:[]};
  var F=P.fuertes||[], D=P.flojos||[];
  if(!F.length && !D.length) return '<div class="panel"><div class="vacio">'+t.sinperfil+'</div></div>';
  function col_(arr,bien){
    var c=bien?UP:DN;
    return '<div class="pcol"><h3 style="--ac:'+c+'">'+esc(bien?t.fuertes:t.flojos)+'</h3>'
      +(arr.length?arr.map(function(x){
        return '<div class="prow"><u style="background:'+c+'"></u>'
          +'<b>'+esc(etq(x.k,x.lbl))+'</b>'
          +'<em style="color:'+c+'">'+(bien?'+':'\u2212')+Math.abs(x.d).toFixed(1)+'</em>'
          +'<s>'+x.puesto+'\u00ba '+t.deL+' '+x.de+'</s></div>'; }).join('')
        : '<div class="pnada">'+esc(bien?t.sinFuertes:t.sinFlojos)+'</div>')
      +'</div>';
  }
  return '<div class="perf">'+col_(F,1)+col_(D,0)+'</div>'
    +'<p class="pnota">'+f(t.pNota,{pos:pos2(j.pos)})+'</p>';
}

/* ══ 5 · EL REEL ═════════════════════════════════════════════════════════ */
var SKCOL={atk:'#6EE7A0', blk:'#6B7BF5', srv:'#F5C451', rec:'#53C6E0'};
function reel(j){
  var t=L(), R=j.reel||[];
  if(!R.length) return '<div class="panel"><div class="vacio">'+t.sinreel+'</div></div>';
  var nom={atk:t.fatk,blk:t.fblk,srv:t.fsrv,rec:t.frec};
  var cuenta={};
  R.forEach(function(c){ cuenta[c.sk]=(cuenta[c.sk]||0)+1; cuenta[c.tipo]=(cuenta[c.tipo]||0)+1; });
  var botones=[['todos',t.todos,R.length]];
  ['atk','blk','srv','rec'].forEach(function(k){ if(cuenta[k]) botones.push([k,nom[k],cuenta[k]]); });
  if(cuenta['entrenamiento'] && cuenta['partido']) botones.push(['entrenamiento',t.fEnt,cuenta['entrenamiento']]);
  var V=R.filter(function(c){ return filtro==='todos'||c.sk===filtro||c.tipo===filtro; });
  var h=comoReel(j)+'<div class="reelbar">'+botones.map(function(b){
      return '<button type="button" data-f="'+b[0]+'" class="'+(filtro===b[0]?'on':'')+'">'
        +esc(b[1])+'<em>'+b[2]+'</em></button>'; }).join('')+'</div>';
  var VV=V.slice(0,12);
  /* Tocar una tarjeta abre la lista ENTERA arrancando por esa jugada, no
     esa sola. Antes abria un clip y el video duraba cuatro segundos: parecia
     roto. Ahora la tarjeta es "desde aca para adelante". */
  h+='<div class="reel">'+VV.map(function(c,iv){
      var desde=V.slice(V.indexOf(c)).concat(V.slice(0,V.indexOf(c)));
      var ref=(c.tipo==='partido') ? (t.vs+' '+corto(c.rival)) : t.ent;
      var fe=(c.fecha||'').split('-').reverse().slice(0,2).join('/');
      return '<a class="clip" href="'+esc(link(desde))+'">'
        +'<u><i style="background:'+(SKCOL[c.sk]||REF)+'"></i>'+esc(nom[c.sk]||'')+'</u>'
        +'<b>'+esc(ref)+'</b><s>'+esc(fe)+' · '+t.setL+' '+c.set+'</s></a>'; }).join('')+'</div>';
  /* El boton de "verlas seguidas" va por separado para partido y para
     entrenamiento. No es un capricho: cortes.html abre UN archivo de video a
     la vez —datos_video para los partidos, datos_video_ent para las
     practicas— asi que una lista mezclada le dejaba la mitad de los clips
     sin encontrar. Medido: 53 de 290 caian afuera. */
  var vp=V.filter(function(c){ return c.tipo!=='entrenamiento'; });
  var ve=V.filter(function(c){ return c.tipo==='entrenamiento'; });
  var sueltos=[];
  if(vp.length>1) sueltos.push([vp, (ve.length?t.verTodasPar:t.verTodas)]);
  if(ve.length>1) sueltos.push([ve, (vp.length?t.verTodasEnt:t.verTodas)]);
  if(sueltos.length) h+='<div class="verFila">'+sueltos.map(function(g){
      return '<a class="verTodo" href="'+esc(link(g[0]))+'">'+f(g[1],{n:g[0].length})+'</a>'; }).join('')+'</div>';
  return h;
}
function link(cl){ return linkClips(cl) || '#'; }

/* ══ ¿DE DONDE SALE ESTE NUMERO? ═════════════════════════════════════════
   Debajo de cada numero hay un desplegable con la cuenta hecha, con SUS
   numeros y no con un ejemplo inventado. No es una ayuda al costado: es
   parte del dato. Un numero que el jugador no puede rastrear hasta una
   accion que recuerda no es un dato, es una nota que le pusieron.          */
function como(t, lineas){
  return '<details class="como"><summary>'+esc(t)+'</summary><div class="comoc">'
    + lineas.filter(Boolean).join('') + '</div></details>';
}
function eq(txt){ return '<p class="eqn">'+txt+'</p>'; }
function pp(txt){ return '<p>'+txt+'</p>'; }
function num(v,d){ var x=Number(v)||0; return (x<0?'−':'')+Math.abs(x).toFixed(d==null?1:d); }

function peorPartido(j){
  var P=(j.partidos||[]).filter(function(p){ return p.rec||p.atk||p.srv; });
  if(!P.length) return null;
  return P.reduce(function(a,b){ return Math.abs(b.aporte)>Math.abs(a.aporte)?b:a; });
}
function sumaFund(j){
  var su={rec:0,atk:0,srv:0}, hay={rec:0,atk:0,srv:0};
  (j.partidos||[]).forEach(function(p){ ['rec','atk','srv'].forEach(function(k){
    if(p[k]&&p[k].ap!=null){ su[k]+=p[k].ap; hay[k]++; } }); });
  return {su:su, hay:hay};
}

/* el de la cifra grande: la suma por fundamento */
function comoTotal(j){
  var t=L(), S=sumaFund(j), ks=['rec','atk','srv'].filter(function(k){ return S.hay[k]; });
  if(!ks.length || j.aporte_total===null) return '';
  var piezas=ks.map(function(k){ return sig(S.su[k])+' '+nomFund(k).toLowerCase(); }).join('   ');
  return como(t.comoQ, [
    pp(t.comoTot1),
    eq(piezas+'  =  <b>'+sig(j.aporte_total)+'</b>'),
    pp(t.comoTot2)
  ]);
}

/* el del grafico de partidos: la cuenta de UN partido, el mas grueso */
function comoPartido(j){
  var t=L(), p=peorPartido(j);
  if(!p) return '';
  var L1=null,L2=null,L3=null;
  if(p.rec) L1=eq(f(t.comoRec,{n:p.rec.n, real:num(p.rec.real), esp:num(p.rec.esp), ap:sig(p.rec.ap)}));
  if(p.atk&&p.atk.ap!=null) L2=eq(f(t.comoAtk,{n:p.atk.n, eff:num(p.atk.eff), liga:num(p.atk.liga), ap:sig(p.atk.ap)}));
  if(p.srv&&p.srv.ap!=null) L3=eq(f(t.comoSrv,{n:p.srv.n, a:p.srv.ace, ap_:num(p.srv.ace_pct), la:num(p.srv.liga_ace),
                                               e:p.srv.err, ep:num(p.srv.err_pct), le:num(p.srv.liga_err), ap:sig(p.srv.ap)}));
  return como(t.comoQ, [
    pp(f(t.comoPar1,{fecha:esc(p.fecha_app), rival:esc(corto(p.rival))})),
    L1, L2, L3,
    eq('<b>'+f(t.comoPar2,{ap:sig(p.aporte)})+'</b>'),
    pp(t.comoPar3)
  ]);
}

/* el de "de donde sale": que quiere decir esperable en cada fundamento */
function comoFund(j){
  var t=L();
  return como(t.comoQ, [
    pp(t.comoF1), pp(t.comoF2), pp(t.comoF3), pp(t.comoF4)
  ]);
}

/* el de la liga: contra quien y como sale el puesto */
function comoLiga(j){
  var t=L(), F=(j.liga||[]).filter(function(r){ return r.puesto; });
  var ej=F[0];
  return como(t.comoQ, [
    pp(f(t.comoL1,{pos:pos2(j.pos)})),
    ej?eq(f(t.comoL2,{lbl:etq(ej.k,ej.lbl), v:ej.v, p:ej.puesto, de:ej.de, lo:ej.lo, hi:ej.hi})):null,
    pp(t.comoL3)
  ]);
}

/* el del reel: como se eligen las jugadas */
function comoReel(j){
  var t=L();
  return como(t.comoQ, [
    pp(f(t.comoR1,{n:(j.clips||[]).length, b:j.n_clips, m:j.n_mal})),
    pp(t.comoR2), pp(t.comoR3), pp(t.comoR4)
  ]);
}

/* ══ LA ENTRADA ══════════════════════════════════════════════════════════
   Una sola animacion orquestada y no efectos sueltos: el numero grande se
   arma, las barras crecen desde el cero y la curva se dibuja. Dura menos de
   un segundo y pasa una sola vez.

   Si el telefono pide menos movimiento —prefers-reduced-motion— no se anima
   nada y todo aparece puesto. No es cortesia: a algunas personas el
   movimiento les marea de verdad.                                          */
function animarEntrada(){
  var quieto=false;
  try{ quieto=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  var n=cont.querySelector('.cuenta');
  if(n && !quieto){
    var fin=parseFloat(n.getAttribute('data-v'))||0, t0=0, dur=850;
    var paso=function(ts){
      if(!t0) t0=ts;
      var p=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-p,3);
      n.textContent = p<1 ? sig(fin*e) : sig(fin);
      if(p<1) requestAnimationFrame(paso);
    };
    n.textContent=sig(0); requestAnimationFrame(paso);
  }
  if(quieto){ cont.classList.add('quieto'); return; }
  cont.classList.remove('entrando');
  void cont.offsetWidth;
  cont.classList.add('entrando');
}

/* ══ ARMAR LA PANTALLA ═══════════════════════════════════════════════════ */
function sec(h,s,p,cuerpo){
  return '<div class="sec"><div class="sec-h"><h2>'+h+'</h2>'+(s?'<span>'+s+'</span>':'')+'</div>'
    +(p?'<p class="sec-p">'+p+'</p>':'')+cuerpo+'</div>';
}
function pintar(){
  var J=lista(), t=L();
  if(!J.length){ cont.innerHTML='<div class="hero"><div class="vacio">'
      +'Todavía no hay datos cargados.</div></div>'; sel.style.display='none'; return; }
  if(iSel>=J.length) iSel=0;
  if(PEDIDO!=null){
    J.forEach(function(x,i){ if(x.num===PEDIDO) iSel=i; });
    PEDIDO=null;
  }
  if(iSel>=J.length) iSel=0;
  var j=J[iSel];
  if(YO!==null || J.length<2){ sel.style.display='none'; }
  else {
    sel.style.display='';
    sel.innerHTML=J.map(function(x,i){ return '<option value="'+i+'"'+(i===iSel?' selected':'')+'>#'+x.num+' '+esc(x.nombre)+'</option>'; }).join('');
  }
  cont.innerHTML = hero(j)
    + sec(t.h1, t.h1s, t.h1p, barras(j))
    + (function(d){ return d? sec(t.h5, t.h5s, t.h5p, d) : ''; })(deDonde(j))
    + sec(t.h2, t.h2s, f(t.h2p,{pos:pos2(j.pos)}), filasLiga(j))
    + sec(t.h3, '', '', perfil(j))
    + sec(t.h4, t.h4s, t.h4p, reel(j))
    + '<p class="pie">'+t.pie+'</p>';

  ponerFoto();
  animarEntrada();
  cont.querySelectorAll('.cht .hit').forEach(function(b){
    var p=PAR[+b.getAttribute('data-i')];
    function on(ev){ globo(ev, globoPartido(p)); }
    b.addEventListener('pointermove',on);
    b.addEventListener('pointerenter',on);
    b.addEventListener('pointerleave',function(){ globo(null); });
    b.addEventListener('focus',function(){
      var r=b.getBoundingClientRect();
      globo({clientX:r.left+r.width/2, clientY:r.top+8}, globoPartido(p)); });
    b.addEventListener('blur',function(){ globo(null); });
  });
  cont.querySelectorAll('.reelbar button').forEach(function(b){
    b.onclick=function(){ filtro=b.dataset.f; pintar(); };
  });
}
sel.onchange=function(){ iSel=+sel.value; filtro='todos'; pintar(); };
addEventListener('langchange', function(){ setTimeout(pintar,10); });
/* El grafico se dibuja a la medida del cajon, asi que al girar el telefono o
   al cambiar el ancho hay que volver a dibujarlo. Se espera a que el usuario
   deje de mover la ventana para no redibujar sesenta veces por segundo. */
var _rz=null, _w=0;
addEventListener('resize', function(){
  if(Math.abs(innerWidth-_w)<24) return;
  clearTimeout(_rz); _rz=setTimeout(function(){ _w=innerWidth; pintar(); },180);
});
addEventListener('datos-listos', function(){ D=window.FICHA_DATA; setTimeout(pintar,20); });

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',arranque);
else arranque();
function arranque(){
  D=window.FICHA_DATA;
  try{ pintar(); }catch(e){ try{ console.warn('[ficha]',e); }catch(_){} }
  setTimeout(function(){ if(!D&&window.FICHA_DATA){ D=window.FICHA_DATA; pintar(); } },900);
}
})();
