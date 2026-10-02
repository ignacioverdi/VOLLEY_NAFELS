/* ============================================================================
   objetivos_semanales.js — Näfels
   ----------------------------------------------------------------------------
   EL OBJETIVO NUMERICO DE LA SEMANA, POR JUGADOR Y POR FUNDAMENTO.

   De domingo a domingo. Se calcula solo con lo que ya esta cargado: no hay
   nada que completar a mano, ni un panel donde ponerle numeros a nadie.

   DE DONDE SALE EL NUMERO
     objetivo de la semana = el cierre del domingo pasado + 20% de lo que le
     falta para la bateria, con piso de +1 punto y techo de +4.

     No sale de su propio promedio reciente. Si saliera de ahi, una semana
     mala le bajaria la vara y el sistema terminaria premiando el retroceso.
     La bateria es un valor fijo, puesto de cara al campeonato: el objetivo
     mide CUANTO LE FALTA PARA LLEGAR AHI, no como viene.

     El 20% es el ritmo: cierra el 80% de la distancia en diez semanas.

   CUATRO REGLAS
     1. Se acerca rapido al principio y afina al final (es un porcentaje de
        lo que falta, asi que el salto se achica solo).
     2. Nunca baja. El objetivo de una semana no puede ser menor que el de la
        anterior, aunque haya cerrado peor.
     3. Al llegar cambia de naturaleza: deja de ser «subir» y pasa a ser
        «sostenerlo tres semanas».
     4. Se muestra siempre, con cuantas acciones hay detras. No hay minimo de
        acciones: el jugador tiene que estar preparado para un saque o para
        cincuenta.

   ENTRENAMIENTO Y PARTIDO, SEPARADOS
     Son dos objetivos distintos y nunca se promedian entre si. Un numero que
     junta las dos cosas no le sirve a nadie: son otra cantidad de acciones y
     otra presion.

   COMO SE SUMA UNA SEMANA
     Sumando los CONTADORES crudos de cada sesion y recien al final sacando el
     porcentaje. Promediar los porcentajes de dias distintos daria mal: una
     practica de 3 saques pesaria igual que una de 40. Por eso este archivo
     lee el desglose (sqD, recD, defD, bqD, atqD) y no el porcentaje ya hecho.

   DE DONDE SALEN LOS DATOS
     window.BAT_PARTIDOS   partidos y entrenamientos, sesion por sesion
     window.HIGH_SET_DATA  el ejercicio de armado de alta
     window.OBJETIVOS_CONFIG.metas   las baterias

   Si alguna de las tres no esta, la tarjeta no se dibuja y no pasa nada mas.
   ========================================================================== */
(function(){
'use strict';

var PASO_PCT = 0.20;   /* cuanto de lo que falta se le pide por semana */
var PASO_MIN = 1;      /* piso del salto, en puntos */
var PASO_MAX = 4;      /* techo del salto, en puntos */
var SOSTENER = 3;      /* semanas seguidas en la bateria = objetivo cumplido */

/* ── Los fundamentos que ve cada puesto ─────────────────────────────────────
   El primero de la lista va grande arriba: es el que mas define ese puesto.
   La defensa la ven todos.                                                  */
var PUESTOS = {
  PUNTA:   ['rec','atqrp','atqri','atqrm','atqhb','atqtr','atqz','def','sq','bqpos'],
  OPUESTO: ['atqrp','atqri','atqrm','atqhb','atqz','atqtr','def','sq','bqpos'],
  CENTRAL: ['bqpos','atqq','atqx','bqpt','atqtr','def','sq'],
  ARMADOR: ['hset','bqpos','bqpt','def','sq'],
  LIBERO:  ['rec','def','hset']
};
var POR_DEFECTO = ['sq','rec','def','atqrp','bqpos'];

/* ── LO QUE SOLO EXISTE EN ENTRENAMIENTO ───────────────────────────────────
   El armado de alta es un ejercicio: en partido no se tipea. Todo lo demas
   existe en los dos lados.

   Esto importa por lo siguiente. En el perfil el jugador elige con el filtro
   si mira partido o entrenamiento, y ese filtro manda: ahi no se toca nada.
   Pero en la PORTADA no hay filtro, y el modo lo elige el programa solo,
   contando en cual de los dos tiene mas fundamentos con datos.

   Al armador esa cuenta le daba partido —tiene bloqueo, bloqueo punto,
   defensa y saque de los partidos contra un solo fundamento de
   entrenamiento— y el armado de alta desaparecia de su tarjeta, aunque
   hubiera armado 21 pelotas la noche anterior. Al libero, que en partido
   solo tiene recepcion y defensa, le daba entrenamiento y si lo veia. Por eso
   pasaba en unos si y en otros no.

   Se arregla en dos lugares: estos fundamentos no votan que modo elegir, y
   cuando el modo lo elige el programa se leen siempre del entrenamiento. Con
   el filtro puesto a mano no cambia nada: si el jugador pidio partido, ve
   partido.                                                                 */
var SOLO_ENTRENAMIENTO = { hset: 1 };

/* ── Como se reconstruye cada fundamento desde los contadores ──────────────
   Todos terminan en num/tot*100. Para el armado de alta se usa el truco de
   sumar (puntos + 2) contra 4 por accion, que da exactamente la misma cuenta
   que el promedio por armado llevado a la escala 0-100.                     */
function atk(k){ return {det:'atqD', sub:k, num:function(d){ return d.p - d.b - d.e; },
                         tot:function(d){ return d.t; }}; }
var CUENTA = {
  sq:   {det:'sqD',  tot:'n_sq',    num:function(d){ return d.p + .875*d.f + .75*d.o + .5*d.n + .25*d.m; }},
  rec:  {det:'recD', tot:'n_rec',   num:function(d){ return d.p + .75*d.o + .5*d.n + .25*d.m + .125*d.s; }},
  def:  {det:'defD', tot:'n_def',   num:function(d){ return d.p + .75*d.o + .5*d.n + .25*d.m; }},
  bqpos:{det:'bqD',  tot:'n_bqpos', num:function(d){ return d.p + d.o; }},
  bqpt: {det:'bqD',  tot:'n_bqpt',  num:function(d){ return d.p; }},
  atqq: atk('q'), atqhb: atk('hb'), atqx: atk('x'), atqrp: atk('rp'),
  atqri: atk('ri'), atqrm: atk('rm'), atqtr: atk('tr'), atqz: atk('z')
};
var HS_PTS = {'#':2,'+':1,'!':0.5,'-':-1,'/':-1.5,'=':-2};

/* Los armados del rival no cuentan. El nombre del club se toma del que viene
   marcado en los datos; si ninguno lo trae, no se filtra por equipo y se
   sigue distinguiendo por jugador, como antes. */
var _clubHS;
function clubHighSet(){
  if(_clubHS !== undefined) return _clubHS;
  var H = window.HIGH_SET_DATA && window.HIGH_SET_DATA.matches;
  var c = window.CLUB || window.CLUB_ACTUAL || 'nafels', hay = false;
  if(H) Object.keys(H).forEach(function(k){
    (H[k].actions || []).forEach(function(a){ if(a.tm === c) hay = true; });
  });
  _clubHS = hay ? c : '';
  return _clubHS;
}

/* ── Fechas ────────────────────────────────────────────────────────────────
   El generador escribe dd/mm/aaaa. Tambien se acepta aaaa-mm-dd por si algun
   archivo viejo viene al reves.                                             */
function aFecha(f){
  if(!f) return null;
  var s = String(f), p;
  p = s.split('/');
  if(p.length === 3) return new Date(+p[2], (+p[1])-1, +p[0]);
  p = s.split('-');
  if(p.length === 3) return new Date(+p[0], (+p[1])-1, +p[2]);
  return null;
}
/* ── DE DOMINGO A DOMINGO ──────────────────────────────────────────────────
   La semana arranca el lunes y CIERRA EL DOMINGO. Puesto al reves —empezando
   el domingo— el partido del fin de semana abriria la semana siguiente en vez
   de cerrar la que se jugo, y el domingo a la mañana el jugador entraria a su
   perfil y veria todo en cero.
   Devuelve el lunes de la semana a la que pertenece esa fecha.             */
function lunesDe(d){
  var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
/* La fecha de hoy. La puerta de atras sirve para probar la pantalla parada en
   otro dia sin tocar el reloj de la maquina; en la app nunca esta puesta. */
function hoy(){
  return window.OBJ_SEM_HOY ? new Date(window.OBJ_SEM_HOY) : new Date();
}
/* lunes = 0 ... domingo = 6 */
function diaSemana(d){ return (d.getDay() + 6) % 7; }
function clave(d){
  return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+d.getDate()).slice(-2);
}
function ddmm(d){ return d.getDate() + '/' + (d.getMonth()+1); }

/* ── Juntar las sesiones de un jugador en semanas ───────────────────────────
   Devuelve una lista ordenada de semanas. Cada una trae el acumulado de la
   semana entera y, ademas, el acumulado dia por dia, que es lo que deja ver
   si la semana viene subiendo o bajando.                                    */
/* ══ EL PERIODO: DIA, SEMANA O MES ═══════════════════════════════════════════
   Todo esto nacio pensado en semanas y sigue siendo lo normal: el objetivo es
   semanal y cierra el domingo. Pero mirar el mismo numero por DIA o por MES
   responde otras preguntas —como vengo hoy, como vengo contra el mes pasado—
   y los datos para eso ya estaban; lo unico que cambiaba era en que cajones se
   agrupaban las sesiones.

   Por eso el recorrido de sesiones es UNO SOLO y el periodo solo decide tres
   cosas: donde empieza cada cajon, en que casillero de adentro cae la sesion,
   y de a cuanto se avanza al rellenar los cajones vacios.

   DIA: las dos sesiones de un mismo dia caen en el mismo cajon. Eso ya pasaba
   —cada sesion caia en su dia de la semana y se sumaban— y aca sigue igual. */
function inicioDe(f, periodo){
  if(periodo === 'dia') return new Date(f.getFullYear(), f.getMonth(), f.getDate());
  if(periodo === 'mes') return new Date(f.getFullYear(), f.getMonth(), 1);
  return lunesDe(f);
}
/* En que casillero DE ADENTRO del cajon cae la sesion. Es lo que despues
   dibuja el grafico de "dia a dia": en la semana son los 7 dias, en el mes los
   dias del mes, y en el dia hay uno solo. */
function casillaDe(f, periodo){
  if(periodo === 'dia') return 0;
  if(periodo === 'mes') return f.getDate() - 1;
  return diaSemana(f);
}
function cuantasCasillas(periodo){
  return periodo === 'dia' ? 1 : (periodo === 'mes' ? 31 : 7);
}
function siguiente(d, periodo){
  var x = new Date(d.getTime());
  if(periodo === 'dia') x.setDate(x.getDate() + 1);
  else if(periodo === 'mes') x.setMonth(x.getMonth() + 1);
  else x.setDate(x.getDate() + 7);
  return x;
}

/* La vista de siempre. Queda como el nombre que usa el resto del archivo. */
function semanas(nombre, modo, id){ return tramos(nombre, modo, id, 'semana'); }

function tramos(nombre, modo, id, periodo){
  periodo = periodo || 'semana';
  var B = window.BAT_PARTIDOS;
  if(!B || !B.meta || !B.ind) return [];
  var porId = {};
  B.ind.forEach(function(m){ porId[String(m.id)] = m; });

  var NCAS = cuantasCasillas(periodo);
  var sem = {};   /* clave del cajon -> {dias:[{num,tot}], num, tot} */
  function caja(k){
    if(!sem[k]){
      var ds = [];
      for(var i=0;i<NCAS;i++) ds.push({num:0, tot:0});
      sem[k] = {k:k, dias:ds, num:0, tot:0, dom:null};
    }
    return sem[k];
  }
  function sumar(k, dia, num, tot){
    var c = caja(k);
    c.dias[dia].num += num; c.dias[dia].tot += tot;
    c.num += num; c.tot += tot;
  }

  if(id === 'hset'){
    var H = window.HIGH_SET_DATA && window.HIGH_SET_DATA.matches;
    /* El armado de alta es un ejercicio de entrenamiento: en partido no hay. */
    if(!H || modo !== 'entrenamiento') return [];
    var cl = clubHighSet();
    var dor = (nombre === null) ? null : dorsalDe(nombre);
    Object.keys(H).forEach(function(cod){
      var s = H[cod] || {};
      var f = aFecha(s.date); if(!f) return;
      var k = clave(inicioDe(f, periodo));
      (s.actions || []).forEach(function(a){
        if(a.skill !== 'E' || a.ty !== 'H') return;
        if(cl && a.tm && a.tm !== cl) return;
        if(nombre !== null){
          if(dor !== null){ if(String(a.num) !== dor) return; }
          else if(!coincide(a.name, nombre) && String(a.num) !== String(nombre)) return;
        }
        var p = HS_PTS[a.ev];
        if(p === undefined) return;
        sumar(k, casillaDe(f, periodo), p + 2, 4);
      });
      var c = sem[k]; if(c) c.dom = inicioDe(f, periodo);
    });
  } else {
    var C = CUENTA[id]; if(!C) return [];
    B.meta.forEach(function(m){
      var tipo = (m.tipo === 'entrenamiento' || m.tipo === 'E') ? 'entrenamiento' : 'partido';
      if(tipo !== modo) return;
      var f = aFecha(m.fecha); if(!f) return;
      var ses = porId[String(m.id)]; if(!ses) return;
      var V = nombre === null ? ses.eq : buscarJug(ses.jug, nombre);
      if(!V) return;
      var det = V[C.det]; if(!det) return;
      if(C.sub) det = det[C.sub];
      if(!det) return;
      var tot = C.sub ? C.tot(det) : (V[C.tot] || 0);
      if(!tot) return;
      var k = clave(inicioDe(f, periodo));
      sumar(k, casillaDe(f, periodo), C.num(det), tot);
      sem[k].dom = inicioDe(f, periodo);
    });
  }

  var llaves = Object.keys(sem).sort();
  if(!llaves.length) return [];
  /* ── LAS SEMANAS SIN NADA TAMBIEN CUENTAN ──────────────────────────────
     Si el jugador no hizo un solo saque esta semana, la semana existe igual:
     su objetivo sigue en pie y lo que tiene que ver es que va en cero de
     cero, no el numero de hace quince dias como si fuera de hoy. Por eso se
     rellenan todas las semanas desde la primera con datos hasta la de hoy,
     aunque esten vacias.                                                  */
  var pk = llaves[0].split('-');
  var cur = new Date(+pk[0], (+pk[1])-1, +pk[2]);
  var fin = inicioDe(hoy(), periodo);
  /* El tope sube con el periodo: en dias, un ano entero son 366 cajones. */
  var TOPE = periodo === 'dia' ? 800 : (periodo === 'mes' ? 60 : 400);
  var guarda = 0;
  while(cur <= fin && guarda++ < TOPE){ caja(clave(cur)).dom = new Date(cur); cur = siguiente(cur, periodo); }

  var out = Object.keys(sem).sort().map(function(k){ return sem[k]; });
  out.forEach(function(c){
    if(!c.dom){ var p = c.k.split('-'); c.dom = new Date(+p[0], (+p[1])-1, +p[2]); }
    c.val = c.tot ? (c.num / c.tot * 100) : null;
    /* acumulado dia a dia: el numero que veria el jugador ese dia */
    var an = 0, at = 0;
    c.acum = c.dias.map(function(d){
      an += d.num; at += d.tot;
      return at ? (an / at * 100) : null;
    });
    c.n = c.tot;
  });
  return out;
}

/* Los nombres del archivo de baterias no siempre traen el dorsal adelante */
function limpiar(s){
  var t = String(s == null ? '' : s).toLowerCase().replace(/^\d+\s*/, '');
  /* sin tildes, para que VAZQUEZ y Vazquez sean el mismo */
  if(t.normalize) t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return t.trim();
}
function mismoNombre(a, b){ return limpiar(a) === limpiar(b); }
/* ══ EL MISMO JUGADOR ESCRITO DE DOS FORMAS ════════════════════════════════
   El plantel dice SCHMID JONAS y el motor de baterias guarda SCHMID JONA,
   porque cada uno toma el nombre de un lado distinto del .dvw. Es el mismo
   jugador. Alcanza con que uno sea el principio del otro —y eso no confunde
   a los dos SCHMID, porque SCHMID ROY no empieza igual que SCHMID JONAS.  */
function parecido(a, b){
  var x = limpiar(a), y = limpiar(b);
  if(!x || !y) return false;
  if(x === y) return true;
  return (x.length > y.length) ? x.indexOf(y) === 0 : y.indexOf(x) === 0;
}
/* Los datos de high set traen el nombre como lo escribio DataVolley, que a
   veces es solo el apellido. Si uno de los dos es una sola palabra, alcanza
   con que coincida el apellido. */
function coincide(a, b){
  var x = limpiar(a), y = limpiar(b);
  if(!x || !y) return false;
  if(x === y) return true;
  if(parecido(a, b)) return true;
  var xs = x.split(' '), ys = y.split(' ');
  /* apellido solo: unicamente si en el plantel no hay dos con ese apellido */
  if(xs.length === 1 || ys.length === 1) return xs[0] === ys[0] && apellidoUnico(xs[0]);
  return false;
}
/* ══ EL APELLIDO SOLO NO ALCANZA ═══════════════════════════════════════════
   En el plantel hay dos SCHMID, Roy y Jona. Buscando por apellido dentro de
   UNA sesion, si ese dia jugo uno solo hay una sola coincidencia y parece
   que acerto: le termina mostrando a Roy los numeros de Jona. Comprobado:
   aparecian dos semanas de recepcion en el perfil de Roy que eran de Jona.

   Por eso el apellido solo se acepta si es unico en TODA la temporada, no
   en la sesion que se esta mirando.                                        */
function apellidoUnico(ap){
  var B = window.BAT_PARTIDOS;
  if(!B || !B.jug) return false;
  var n = 0;
  Object.keys(B.jug).forEach(function(k){ if(limpiar(k).split(' ')[0] === ap) n++; });
  return n === 1;
}
function buscarJug(jug, nombre){
  if(!jug) return null;
  if(jug[nombre]) return jug[nombre];
  var ks = Object.keys(jug), i;
  for(i=0;i<ks.length;i++) if(mismoNombre(ks[i], nombre)) return jug[ks[i]];
  for(i=0;i<ks.length;i++) if(parecido(ks[i], nombre)) return jug[ks[i]];
  var ap = limpiar(nombre).split(' ')[0];
  if(!apellidoUnico(ap)) return null;
  var hits = [];
  for(i=0;i<ks.length;i++) if(limpiar(ks[i]).split(' ')[0] === ap) hits.push(ks[i]);
  return hits.length === 1 ? jug[hits[0]] : null;
}

/* ══ EL HIGH SET SE ATA POR DORSAL ═════════════════════════════════════════
   Los datos del ejercicio traen el nombre como lo escribio DataVolley, que
   muchas veces es solo el apellido —y con dos SCHMID eso no alcanza—. El
   dorsal si es unico, asi que se usa ese y el nombre queda de respaldo.    */
function dorsalDe(nombre){
  var fuentes = [];
  if(window.EQUIPO_DATA && window.EQUIPO_DATA.jugadores) fuentes.push(window.EQUIPO_DATA.jugadores);
  if(window.PLANTEL_NAFELS && window.PLANTEL_NAFELS.jugadores) fuentes.push(window.PLANTEL_NAFELS.jugadores);
  for(var f=0; f<fuentes.length; f++){
    var L = fuentes[f];
    for(var i=0;i<L.length;i++){
      var j = L[i];
      if(j.num == null) continue;
      if(parecido(j.nombre, nombre) || mismoNombre(j.ap, nombre)) return String(j.num);
    }
  }
  if(window._curJug && window._curJug.num != null && parecido(window._curJug.nombre, nombre))
    return String(window._curJug.num);
  if(window.jugador && window.jugador.num != null && parecido(window.jugador.nombre, nombre))
    return String(window.jugador.num);
  return null;
}

/* ── La cuenta del objetivo, semana por semana ─────────────────────────────
   Se recorre toda la historia desde la primera semana con acciones. El
   objetivo de cada semana sale del cierre de la anterior, y nunca baja.     */
function serie(nombre, modo, id, periodo){
  periodo = periodo || 'semana';
  var meta = (window.OBJETIVOS_CONFIG && window.OBJETIVOS_CONFIG.metas[id]) || null;
  var bat  = meta && meta.obj != null ? meta.obj : null;
  var S = tramos(nombre, modo, id, periodo);
  if(!S.length) return {id:id, meta:meta, semanas:[], hay:false};

  var hubo = S.some(function(c){ return c.tot > 0; });
  if(!hubo) return {id:id, meta:meta, semanas:[], hay:false};

  var prev = null, prevObj = null, seguidas = 0, mejor = null, mejorSem = null;
  S.forEach(function(c){
    c.objetivo = null; c.estado = null; c.desde = prev;

    /* ══ CONTRA QUE SE COMPARA, SEGUN EL PERIODO ═══════════════════════════
       SEMANA: el objetivo sube de a poco desde lo que cerro la semana pasada
       hacia la bateria del equipo. Es una escalera, y es lo que le da sentido
       a la racha: cumplir esta semana es superarse a si mismo.

       DIA y MES: no hay escalera. La referencia es DIRECTO la bateria del
       equipo —el norte— y lo que se compara es contra el dia o el mes
       anterior de el mismo. Una escalera diaria daria un objetivo nuevo cada
       dia, movido por el ruido de dos o tres acciones, y no significaria
       nada. */
    if(periodo !== 'semana'){
      if(bat !== null) c.objetivo = Math.round(bat * 10) / 10;
      c.estado = (prev !== null && bat !== null && prev >= bat) ? 'sostener' : 'subir';
      if(c.val !== null){
        if(bat !== null && c.val >= bat) seguidas++; else seguidas = 0;
        prev = c.val;
        if(mejor === null || c.val > mejor){ mejor = c.val; mejorSem = c; }
      }
      c.seguidas = seguidas;
      return;
    }

    if(prev !== null && bat !== null){
      var falta = bat - prev;
      var salto;
      if(falta <= 0){ salto = 0; }
      else {
        salto = falta * PASO_PCT;
        if(salto < PASO_MIN) salto = PASO_MIN;
        if(salto > PASO_MAX) salto = PASO_MAX;
        if(salto > falta) salto = falta;
      }
      var o = prev + salto;
      /* ══ EL OBJETIVO VIVE DENTRO DEL RECORRIDO DE LA LIGA ═══════════════
         El ataque se cuenta como (punto - bloqueado - error) / total, asi que
         una semana de UN solo ataque bloqueado cierra en -100. Sin tope, el
         objetivo de la semana siguiente salia «-29,3», que no significa nada
         para el que lo lee.
         El piso es el min de la bateria: lo que hace el PEOR equipo de la
         liga en ese fundamento. Por abajo de eso no tiene sentido pedir, y
         por arriba de la bateria tampoco. */
      var piso = (meta && meta.min != null) ? meta.min : null;
      if(piso !== null && o < piso) o = piso;
      if(o > bat) o = bat;
      if(prevObj !== null && o < prevObj) o = prevObj;   /* nunca baja */
      c.objetivo = Math.round(o * 10) / 10;
      c.estado = (falta <= 0) ? 'sostener' : 'subir';
      prevObj = c.objetivo;
    }
    if(c.val !== null){
      if(bat !== null && c.val >= bat) seguidas++; else seguidas = 0;
      prev = c.val;
      if(mejor === null || c.val > mejor){ mejor = c.val; mejorSem = c; }
    }
    c.seguidas = seguidas;
  });
  /* ── SEMANAS SEGUIDAS CUMPLIENDO ────────────────────────────────────────
     Cuantas semanas cerradas seguidas, hacia atras, termino en su objetivo o
     arriba. La de esta semana no cuenta: todavia no cerro. Las semanas sin
     acciones cortan la racha? No: no jugo, no fallo. Se saltean.          */
  var racha = 0;
  for(var q = S.length - 2; q >= 0; q--){
    var c2 = S[q];
    if(c2.val === null) continue;
    if(c2.objetivo != null && c2.val >= c2.objetivo) racha++; else break;
  }
  return {id:id, meta:meta, bat:bat, semanas:S, hay:true, mejor:mejor, mejorSem:mejorSem,
          racha:racha, ultima:S[S.length-1], sostenidas:seguidas, periodo:periodo};
}

/* ════════════════════════════════════════════════════════════════════════
   LOS TEXTOS, EN LOS TRES IDIOMAS
   ------------------------------------------------------------------------
   La tarjeta se arma entera aca y lleva data-notr, que es la marca con la que
   lang.js deja un bloque en paz. Sin eso, el traductor por texto pisa las
   frases a medias: cambiaba «partido» por «MATCH» en mitad de una oracion en
   castellano y el resto quedaba sin traducir.

   Las palabras de vóley usan la misma traduccion que el resto de la app
   (Annahme, Aufschlag, Abwehr, Zuspieler), para que un jugador no lea dos
   nombres distintos para lo mismo en dos pantallas.
   ════════════════════════════════════════════════════════════════════════ */
var TXT = {
 es:{
  titulo:'Tu objetivo de la semana', partido:'partido', entrenamiento:'entrenamiento',
  primera:'Primera semana con datos. El objetivo aparece el domingo que viene, cuando haya un cierre del que partir. Por ahora vas en <b style="color:#E2E8F0">%1</b> sobre %2 acciones.',
  sostener:'Sostenerlo %1 semanas', sostenerTxt:'Cerraste arriba de la bater&iacute;a. Van <b>%1 de %2</b>.',
  entera:'La bater&iacute;a entera', enteraTxt:'Ya cerraste una semana en <b>%1</b>%2, as&iacute; que el objetivo no vuelve a bajar de ah&iacute;.',
  semanaDel:' (semana del %1)',
  bateria:'Bater&iacute;a %1', bateriaTxt:'Cerraste la semana pasada en <b>%1</b>.',
  ninguna:'<b style="color:#E2E8F0">Todav&iacute;a no hiciste ninguna</b> esta semana.',
  hoyVas:'Hoy vas en <b>%1</b> <span style="color:#64748B">sobre %2</span>',
  yaEsta:' <b style="color:#22c55e">&middot; ya est&aacute;</b>', faltan:' <span style="color:#7C8AA0">&middot; te faltan %1</span>',
  equipo:'El equipo va en %1',
  pieVacio:'La raya verde es tu objetivo, que cierra el domingo. La punteada azul es c&oacute;mo fue la semana pasada, d&iacute;a por d&iacute;a. Tu l&iacute;nea arranca con la primera acci&oacute;n de esta semana.',
  pie:'La raya verde es el objetivo de la semana, que cierra el domingo. La punteada azul es la semana pasada, d&iacute;a por d&iacute;a, para ver si vas mejor o peor que entonces.',
  resto:'El resto de tus objetivos', de:'de %1', midiendo:'se est&aacute; midiendo',
  sinSemana:'sin acciones esta semana', sinDatos:'sin datos cargados', antes:' &middot; antes %1',
  accion:'%1 acci&oacute;n', acciones:'%1 acciones',
  nada:'Todav&iacute;a no hay acciones cargadas en %1. Los objetivos aparecen solos en cuanto entre la primera sesi&oacute;n.',
  partidos:'partidos', entrenamientos:'entrenamientos',
  dias:['L','M','M','J','V','S','D'],
  diasLargos:['lunes','martes','mi&eacute;rcoles','jueves','viernes','s&aacute;bado','domingo'],
  cierra:'cierra el domingo', racha:'Semanas seguidas cumpliendo',
  perDia:'D&iacute;a', perSem:'Semana', perMes:'Mes',
  cierraDia:'el d&iacute;a de hoy', cierraMes:'cierra a fin de mes',
  rachaDia:'D&iacute;as seguidos en la bater&iacute;a', rachaMes:'Meses seguidos en la bater&iacute;a',
  diaADiaMes:'D&iacute;a a d&iacute;a del mes', esteMes:'este mes', elPasado:'el pasado',
  ayer:'vs ayer', mesPasado:'vs el mes pasado', norte:'bater&iacute;a del equipo',
  faltaPara:'te falta <b>%1</b> para el objetivo de <b>%2</b>', logrado:'&iexcl;logrado!',
  vsDia:'vs el %1 pasado', vsSemana:'vs la semana pasada', igual:'igual que el %1 pasado',
  cerroCorto:'cerr&oacute; %1',
  tJugador:'Jugador', tCumplidos:'objetivos cumplidos',
  tObjetivos:'Objetivos', tPlantel:'Objetivos del plantel',
  tVerTodos:'ver', tDetPlantel:'Todo el plantel en una hoja: qu&eacute; se le pidi&oacute; a cada uno esta semana y c&oacute;mo viene.',
  tIrPlantel:'Ver el plantel &rarr;', tIrMios:'Ver mis objetivos &rarr;',
  tDetOk:'<b>%1</b> vas en <b>%2</b> &middot; ya est&aacute;', tDetFalta:'<b>%1</b> vas en <b>%2</b> &middot; te faltan %3 puntos',
  tArranca:'La semana arranca. Tu objetivo de <b>%1</b> te espera.',
  tSinNada:'Todav&iacute;a no hay nada cargado esta semana.', tCumplidosC:'cumplidos',
  tConAcciones:'<b>%1 jugadores</b> con acciones esta semana',
  tSemana:'semana del %1', tPrimera:'1&ordf; semana', tSinAcc:'sin acciones',
  tLlego:'lleg&oacute; al objetivo', tFalta:'le falta',
  tSinSem:'sin acciones esta semana', tNoCorresponde:'no le corresponde al puesto',
  tChiquito:'el n&uacute;mero chiquito de abajo es sobre cu&aacute;ntas acciones est&aacute; hecho',
  tCerrada:'cerrada', tDe:'de %1', tFaltaN:'falta %1',
  cerroEn:'cerr&oacute; el domingo en %1', batPie:'bater&iacute;a %1',
  diaADia:'D&iacute;a a d&iacute;a de la semana', estaSemana:'esta semana', laPasada:'la pasada',
  objLbl:'objetivo %1', faltaN:'falta %1', sinArranque:'Todav&iacute;a sin acciones esta semana',
  /* ── LO QUE TIENE QUE HACER, DICHO EN ACCIONES ──────────────────────────
     «te falta 7,5 para el objetivo» no le dice a nadie que hacer. «con 2
     acciones buenas mas llegas» si. */
  pObjetivo:'tu objetivo', pBateria:'bater&iacute;a',
  tituloDia:'Tu objetivo de hoy', tituloMes:'Tu objetivo del mes',
  igualAyer:'igual que ayer', igualMes:'igual que el mes pasado',
  cerroPrev:'el anterior cerr&oacute; en %1',
  pPase:'Le pasaste tu objetivo por <b>%1 puntos</b>.',
  pConK:'Con <b class="k">%1 m&aacute;s</b> lleg&aacute;s a tu objetivo de <b>%2</b>.',
  pFalta:'Te faltan <b class="k">%1 puntos</b> para tu objetivo de <b>%2</b>.',
  pBatYa:'Y ya est&aacute;s arriba de la bater&iacute;a del equipo.',
  pBatK:'Con <b class="g">%1 m&aacute;s</b> alcanz&aacute;s la bater&iacute;a del equipo (%2).',
  pBatPts:'Te faltan <b class="g">%1 puntos</b> para la bater&iacute;a del equipo (%2).',
  accB1:'%1 acci&oacute;n buena', accBn:'%1 acciones buenas',
  sesTit:'Sesi&oacute;n por sesi&oacute;n', sesUna:'%1 sesiones', sesHoy:'hoy',
  arranca:'El objetivo se activa el domingo que viene, cuando haya un cierre del que partir'
 },
 en:{
  titulo:'Your goal for the week', partido:'match', entrenamiento:'training',
  primera:'First week with data. The goal appears next Sunday, once there is a close to start from. So far you are at <b style="color:#E2E8F0">%1</b> over %2 actions.',
  sostener:'Hold it for %1 weeks', sostenerTxt:'You closed above the target. That is <b>%1 of %2</b>.',
  entera:'The whole target', enteraTxt:'You already closed a week at <b>%1</b>%2, so the goal never drops below that again.',
  semanaDel:' (week of %1)',
  bateria:'Target %1', bateriaTxt:'You closed last week at <b>%1</b>.',
  ninguna:'<b style="color:#E2E8F0">Nothing yet</b> this week.',
  hoyVas:'Right now you are at <b>%1</b> <span style="color:#64748B">over %2</span>',
  yaEsta:' <b style="color:#22c55e">&middot; done</b>', faltan:' <span style="color:#7C8AA0">&middot; %1 to go</span>',
  equipo:'The team is at %1',
  pieVacio:'The green line is your goal; the week closes on Sunday. The blue dashed line is last week, day by day. Your line starts with this week&rsquo;s first action.',
  pie:'The green line is the goal for the week, which closes on Sunday. The blue dashed line is last week, day by day, to see whether you are ahead or behind.',
  resto:'The rest of your goals', de:'of %1', midiendo:'being measured',
  sinSemana:'no actions this week', sinDatos:'no data loaded', antes:' &middot; before %1',
  accion:'%1 action', acciones:'%1 actions',
  nada:'No actions loaded yet in %1. The goals appear on their own as soon as the first session comes in.',
  partidos:'matches', entrenamientos:'training',
  dias:['M','T','W','T','F','S','S'],
  diasLargos:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  cierra:'closes on Sunday', racha:'Weeks in a row on target',
  perDia:'Day', perSem:'Week', perMes:'Month',
  cierraDia:'today', cierraMes:'closes at month end',
  rachaDia:'Days in a row on the battery', rachaMes:'Months in a row on the battery',
  diaADiaMes:'Day by day of the month', esteMes:'this month', elPasado:'last one',
  ayer:'vs yesterday', mesPasado:'vs last month', norte:'team battery',
  faltaPara:'<b>%1</b> to go for the goal of <b>%2</b>', logrado:'done!',
  vsDia:'vs last %1', vsSemana:'vs last week', igual:'same as last %1',
  cerroCorto:'closed %1',
  tJugador:'Player', tCumplidos:'goals met',
  tObjetivos:'Goals', tPlantel:'Squad goals',
  tVerTodos:'see', tDetPlantel:'The whole squad on one sheet: what each one was asked for this week and how it is going.',
  tIrPlantel:'See the squad &rarr;', tIrMios:'See my goals &rarr;',
  tDetOk:'<b>%1</b> you are at <b>%2</b> &middot; done', tDetFalta:'<b>%1</b> you are at <b>%2</b> &middot; %3 points to go',
  tArranca:'The week is starting. Your <b>%1</b> goal is waiting.',
  tSinNada:'Nothing loaded yet this week.', tCumplidosC:'met',
  tConAcciones:'<b>%1 players</b> with actions this week',
  tSemana:'week of %1', tPrimera:'1st week', tSinAcc:'no actions',
  tLlego:'reached the goal', tFalta:'short',
  tSinSem:'no actions this week', tNoCorresponde:'not part of the position',
  tChiquito:'the small number below is how many actions it is based on',
  tCerrada:'closed', tDe:'of %1', tFaltaN:'%1 to go',
  cerroEn:'closed Sunday at %1', batPie:'target %1',
  diaADia:'Day by day this week', estaSemana:'this week', laPasada:'last week',
  objLbl:'goal %1', faltaN:'%1 to go', sinArranque:'No actions yet this week',
  pObjetivo:'your goal', pBateria:'target',
  tituloDia:'Your goal for today', tituloMes:'Your goal for the month',
  igualAyer:'same as yesterday', igualMes:'same as last month',
  cerroPrev:'the previous one closed at %1',
  pPase:'You beat your goal by <b>%1 points</b>.',
  pConK:'With <b class="k">%1 more</b> you reach your goal of <b>%2</b>.',
  pFalta:'<b class="k">%1 points</b> to go for your goal of <b>%2</b>.',
  pBatYa:'And you are already above the team target.',
  pBatK:'With <b class="g">%1 more</b> you reach the team target (%2).',
  pBatPts:'<b class="g">%1 points</b> to go for the team target (%2).',
  accB1:'%1 good action', accBn:'%1 good actions',
  sesTit:'Session by session', sesUna:'%1 sessions', sesHoy:'today',
  arranca:'The goal switches on next Sunday, once there is a close to start from'
 },
 de:{
  titulo:'Dein Wochenziel', partido:'Spiel', entrenamiento:'Training',
  primera:'Erste Woche mit Daten. Das Ziel erscheint am n&auml;chsten Sonntag, sobald es einen Abschluss als Ausgangspunkt gibt. Bisher stehst du bei <b style="color:#E2E8F0">%1</b> auf %2 Aktionen.',
  sostener:'%1 Wochen halten', sostenerTxt:'Du hast &uuml;ber dem Ziel abgeschlossen. Das sind <b>%1 von %2</b>.',
  entera:'Das ganze Ziel', enteraTxt:'Du hast eine Woche bereits mit <b>%1</b> abgeschlossen%2, darum sinkt das Ziel nicht mehr darunter.',
  semanaDel:' (Woche vom %1)',
  bateria:'Ziel %1', bateriaTxt:'Letzte Woche hast du mit <b>%1</b> abgeschlossen.',
  ninguna:'<b style="color:#E2E8F0">Diese Woche noch keine</b> Aktion.',
  hoyVas:'Aktuell stehst du bei <b>%1</b> <span style="color:#64748B">auf %2</span>',
  yaEsta:' <b style="color:#22c55e">&middot; geschafft</b>', faltan:' <span style="color:#7C8AA0">&middot; noch %1</span>',
  equipo:'Das Team steht bei %1',
  pieVacio:'Die gr&uuml;ne Linie ist dein Ziel; die Woche schliesst am Sonntag. Die blau gestrichelte Linie ist die letzte Woche, Tag f&uuml;r Tag. Deine Linie beginnt mit der ersten Aktion dieser Woche.',
  pie:'Die gr&uuml;ne Linie ist das Wochenziel, die Woche schliesst am Sonntag. Die blau gestrichelte Linie ist die letzte Woche, Tag f&uuml;r Tag, zum Vergleich.',
  resto:'Deine weiteren Ziele', de:'von %1', midiendo:'wird gemessen',
  sinSemana:'diese Woche keine Aktionen', sinDatos:'keine Daten geladen', antes:' &middot; vorher %1',
  accion:'%1 Aktion', acciones:'%1 Aktionen',
  nada:'Noch keine Aktionen in %1 geladen. Die Ziele erscheinen von selbst, sobald die erste Einheit eintrifft.',
  partidos:'Spielen', entrenamientos:'Training',
  dias:['M','D','M','D','F','S','S'],
  diasLargos:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
  cierra:'schliesst am Sonntag', racha:'Wochen in Folge erreicht',
  perDia:'Tag', perSem:'Woche', perMes:'Monat',
  cierraDia:'heute', cierraMes:'schliesst am Monatsende',
  rachaDia:'Tage in Folge auf der Batterie', rachaMes:'Monate in Folge auf der Batterie',
  diaADiaMes:'Tag f&uuml;r Tag im Monat', esteMes:'dieser Monat', elPasado:'der letzte',
  ayer:'vs gestern', mesPasado:'vs letzter Monat', norte:'Batterie des Teams',
  faltaPara:'noch <b>%1</b> bis zum Ziel von <b>%2</b>', logrado:'geschafft!',
  vsDia:'vs. letzten %1', vsSemana:'vs. letzte Woche', igual:'gleich wie letzten %1',
  cerroCorto:'Abschluss %1',
  tJugador:'Spieler', tCumplidos:'Ziele erreicht',
  tObjetivos:'Ziele', tPlantel:'Ziele des Kaders',
  tVerTodos:'ansehen', tDetPlantel:'Der ganze Kader auf einem Blatt: was diese Woche verlangt wurde und wie es l&auml;uft.',
  tIrPlantel:'Kader ansehen &rarr;', tIrMios:'Meine Ziele ansehen &rarr;',
  tDetOk:'<b>%1</b> du stehst bei <b>%2</b> &middot; geschafft', tDetFalta:'<b>%1</b> du stehst bei <b>%2</b> &middot; noch %3 Punkte',
  tArranca:'Die Woche beginnt. Dein Ziel in <b>%1</b> wartet.',
  tSinNada:'Diese Woche noch nichts geladen.', tCumplidosC:'erreicht',
  tConAcciones:'<b>%1 Spieler</b> mit Aktionen diese Woche',
  tSemana:'Woche vom %1', tPrimera:'1. Woche', tSinAcc:'keine Aktionen',
  tLlego:'Ziel erreicht', tFalta:'fehlt noch',
  tSinSem:'diese Woche keine Aktionen', tNoCorresponde:'nicht f&uuml;r diese Position',
  tChiquito:'die kleine Zahl darunter ist die Anzahl Aktionen',
  tCerrada:'abgeschlossen', tDe:'von %1', tFaltaN:'noch %1',
  cerroEn:'Sonntag mit %1 abgeschlossen', batPie:'Ziel %1',
  diaADia:'Tag f&uuml;r Tag diese Woche', estaSemana:'diese Woche', laPasada:'letzte Woche',
  objLbl:'Ziel %1', faltaN:'noch %1', sinArranque:'Diese Woche noch keine Aktionen',
  pObjetivo:'dein Ziel', pBateria:'Batterie',
  tituloDia:'Dein Tagesziel', tituloMes:'Dein Monatsziel',
  igualAyer:'gleich wie gestern', igualMes:'gleich wie letzter Monat',
  cerroPrev:'der vorherige schloss mit %1',
  pPase:'Du hast dein Ziel um <b>%1 Punkte</b> &uuml;bertroffen.',
  pConK:'Mit <b class="k">%1 mehr</b> erreichst du dein Ziel von <b>%2</b>.',
  pFalta:'Noch <b class="k">%1 Punkte</b> bis zu deinem Ziel von <b>%2</b>.',
  pBatYa:'Und du liegst bereits &uuml;ber der Batterie des Teams.',
  pBatK:'Mit <b class="g">%1 mehr</b> erreichst du die Batterie des Teams (%2).',
  pBatPts:'Noch <b class="g">%1 Punkte</b> bis zur Batterie des Teams (%2).',
  accB1:'%1 gute Aktion', accBn:'%1 gute Aktionen',
  sesTit:'Einheit f&uuml;r Einheit', sesUna:'%1 Einheiten', sesHoy:'heute',
  arranca:'Das Ziel startet n&auml;chsten Sonntag, sobald es einen Abschluss als Ausgangspunkt gibt'
 }
};
/* Los nombres de los fundamentos, con las mismas palabras que el resto de la app */
var NOMBRES = {
  sq:   ['Saque','Serve','Aufschlag'],
  rec:  ['Recepci&oacute;n','Reception','Annahme'],
  def:  ['Defensa','Defense','Abwehr'],
  bqpos:['Bloqueo #+','Block #+','Block #+'],
  bqpt: ['Bloqueo #','Block #','Block #'],
  atqq: ['Ataque Central','Middle attack','Angriff Mitte'],
  atqx: ['Ataque R&aacute;pida','Quick attack','Schneller Angriff'],
  atqhb:['Ataque Alta','High-ball attack','Angriff hoch'],
  atqrp:['Ataque R#+','Attack after R#+','Angriff nach R#+'],
  atqri:['Ataque R!','Attack after R!','Angriff nach R!'],
  atqrm:['Ataque R-','Attack after R-','Angriff nach R-'],
  atqtr:['Ataque Transici&oacute;n','Transition attack','Angriff &Uuml;bergang'],
  atqz: ['Ataque Zaguero','Back-row attack','Angriff hinten'],
  hset: ['Armado de Alta','High set','Hohes Zuspiel']
};
/* Los mismos fundamentos, abreviados: en un encabezado de tabla «Ataque
   Transicion» no entra, y con catorce columnas cada caracter cuenta. */
var CORTOS = {
  sq:   ['Saque','Serve','Aufschl.'],
  rec:  ['Recep.','Rec.','Annahme'],
  def:  ['Defensa','Defense','Abwehr'],
  bqpos:['Blq #+','Blk #+','Block #+'],
  bqpt: ['Blq #','Blk #','Block #'],
  atqq: ['Atq Q','Att Q','Angr. Q'],
  atqx: ['Atq X','Att X','Angr. X'],
  atqhb:['Atq Alta','Att High','Angr. hoch'],
  atqrp:['Atq R#+','Att R#+','Angr. R#+'],
  atqri:['Atq R!','Att R!','Angr. R!'],
  atqrm:['Atq R-','Att R-','Angr. R-'],
  atqtr:['Atq Tr','Att Tr','Angr. Tr'],
  atqz: ['Atq Zag','Att Back','Angr. hint.'],
  hset: ['Arm. Alta','High set','Zuspiel']
};
var NOMBRE_PUESTO = {
  PUNTA:   ['punta','outside','aussen'],
  OPUESTO: ['opuesto','opposite','diagonal'],
  CENTRAL: ['central','middle','mitte'],
  ARMADOR: ['armador','setter','zuspieler'],
  LIBERO:  ['l&iacute;bero','libero','libero']
};
function idioma(){
  try{ if(typeof window.getLang === 'function'){ var l = window.getLang(); if(TXT[l]) return l; } }catch(e){}
  return 'es';
}
function T(k){
  var L = TXT[idioma()] || TXT.es;
  var t = (L[k] != null) ? L[k] : TXT.es[k];
  if(typeof t !== 'string') return t;
  for(var i = 1; i < arguments.length; i++) t = t.replace('%' + i, arguments[i]);
  return t;
}
function nombreDe(id, meta){
  var n = NOMBRES[id];
  if(n) return n[{es:0,en:1,de:2}[idioma()]];
  var l = (meta && meta.label) || id;
  return String(l).replace(/^%\s*/,'').replace(/\s*\(\d+\)\s*$/,'').trim();
}
function cuantas(n){ return n === 1 ? T('accion', n) : T('acciones', n); }
function cortoDe(id, meta){
  var c = CORTOS[id];
  return c ? c[{es:0,en:1,de:2}[idioma()]] : nombreDe(id, meta);
}
function puestoTxt(pue){
  var p = NOMBRE_PUESTO[pue];
  return p ? p[{es:0,en:1,de:2}[idioma()]] : String(pue||'').toLowerCase();
}

/* ════════════════════════════════════════════════════════════════════════
   DIBUJO
   ════════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════
   DIBUJO
   ════════════════════════════════════════════════════════════════════════ */
var CSS = ''
+ '.os-wrap{margin:0 0 18px;font-family:"Barlow Condensed",system-ui,sans-serif;-webkit-font-smoothing:antialiased;'
+   'font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1}'
+ '.os-card{background:#0D0E1A;border:1px solid rgba(148,163,184,.16);border-radius:16px;overflow:hidden}'
/* cabecera */
+ '.os-head{padding:13px 16px 11px;border-bottom:1px solid rgba(148,163,184,.12)}'
+ '.os-head .q1{display:flex;align-items:baseline;gap:9px;min-width:0}'
+ '.os-head .dor{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:25px;line-height:1;color:#E8192C;letter-spacing:-.01em}'
+ '.os-head .nom{font-size:22px;font-weight:800;color:#F1F5F9;line-height:1;letter-spacing:.005em;'
+   'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}'
+ '.os-head .cu{display:block;margin:5px 0 0;font-size:12px;letter-spacing:.11em;'
+   'text-transform:uppercase;color:#64748B;font-weight:700;line-height:1.3}'
/* racha */
+ '.os-racha{display:flex;align-items:center;gap:10px;padding:9px 16px;background:rgba(148,163,184,.05);border-bottom:1px solid rgba(148,163,184,.1);font-size:15px;color:#94A3B8}'
+ '.os-racha .pts{margin-left:auto;display:flex;gap:6px}'
+ '.os-racha i{width:9px;height:9px;border-radius:50%;background:rgba(148,163,184,.22);display:block}'
+ '.os-racha i.on{background:#22c55e}'
/* el numero grande */
+ '.os-foco{padding:20px 16px 16px;text-align:center;position:relative;overflow:hidden}'
+ '.os-foco:before{content:"";position:absolute;left:50%;top:-58%;width:130%;height:150%;transform:translateX(-50%);'
+   'background:radial-gradient(ellipse at 50% 42%,rgba(56,189,248,.15),rgba(56,189,248,0) 62%);pointer-events:none}'
+ '.os-foco.ok:before{background:radial-gradient(ellipse at 50% 42%,rgba(34,197,94,.17),rgba(34,197,94,0) 62%)}'
+ '.os-foco>*{position:relative}'
+ '.os-q{font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#7C8AA0;font-weight:700;margin:0 0 6px}'
+ '.os-q b{color:#E2E8F0}'
+ '.os-num{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:82px;line-height:.9;color:#F1F5F9;letter-spacing:-.02em}'
+ '.os-num u{text-decoration:none;font-size:.32em;color:#7C8AA0;margin-left:3px;letter-spacing:0;vertical-align:.22em}'
+ '.os-num.no{color:#475569;font-size:58px}'
+ '.os-num.vas{color:#38BDF8} .os-num.ok{color:#4ADE80}'
+ '.os-sub{font-size:17px;font-weight:500;color:#94A3B8;margin:7px 0 0}'
+ '.os-sub b{color:#E2E8F0}'
+ '.os-sub.ok b,.os-sub.ok{color:#22c55e}'
/* Mas liviana que antes: arriba tiene la pastilla de estado, y dos pastillas
   macizas una debajo de la otra se peleaban por la atencion. */
+ '.os-delta{display:inline-block;margin:9px 0 0;font-size:14.5px;font-weight:700;border-radius:999px;padding:3px 12px}'
+ '.os-delta.up{color:#86efac;background:rgba(34,197,94,.13)}'
+ '.os-delta.dn{color:#fca5a5;background:rgba(248,113,113,.13)}'
+ '.os-delta.eq{color:#94A3B8;background:rgba(148,163,184,.14)}'
/* la barra de recorrido */
+ '.os-bar{margin:9px 16px 0;height:13px;border-radius:7px;background:rgba(148,163,184,.13);position:relative}'
/* ══ EL COLOR DE LA BARRA NO ES ROJO ════════════════════════════════════════
   El rojo es color de ESTADO: dice «esto esta mal». Estaba puesto en la barra
   del propio jugador, asi que su avance se leia como un error aunque estuviera
   arriba del objetivo. Ahora: celeste mientras va en camino, verde cuando
   llego. El rojo del club queda donde corresponde, en el dorsal. */
+ '.os-bar s{position:absolute;left:0;top:0;bottom:0;border-radius:7px;background:linear-gradient(90deg,#0EA5E9,#38BDF8);text-decoration:none}'
+ '.os-bar s.ok{background:linear-gradient(90deg,#16A34A,#22C55E)}'
+ '.os-bar b{position:absolute;top:-4px;bottom:-4px;width:3px;border-radius:2px;background:#22c55e}'
+ '.os-bar b.bat{background:rgba(226,232,240,.55);width:2px;top:-2px;bottom:-2px}'
+ '.os-barpie{display:flex;justify-content:space-between;gap:10px;margin:6px 16px 0;font-size:14px;color:#64748B}'
/* los rotulos arriba de la barra: sin esto las dos marcas son dos rayitas
   mudas y hay que adivinar cual es cual */
+ '.os-rot{position:relative;height:15px;margin:16px 16px 0;font-size:11.5px;letter-spacing:.09em;'
+   'text-transform:uppercase;font-weight:700;white-space:nowrap}'
+ '.os-rot b,.os-rot i{position:absolute;top:0;font-style:normal}'
+ '.os-rot b{color:#22c55e} .os-rot i{color:#CBD5E1}'
/* ── LA PASTILLA DE ESTADO ───────────────────────────────────────────────── */
+ '.os-pill{display:inline-block;margin:10px 0 0;border-radius:999px;padding:5px 15px;font-size:15px;'
+   'font-weight:800;letter-spacing:.05em;text-transform:uppercase;'
+   'background:rgba(56,189,248,.13);border:1px solid rgba(56,189,248,.4);color:#38BDF8}'
+ '.os-pill.ok{background:rgba(34,197,94,.14);border-color:rgba(34,197,94,.45);color:#22c55e}'
/* ── LA FRASE QUE DICE QUE HACER ─────────────────────────────────────────── */
+ '.os-paso{margin:12px 16px 0;font-size:17px;line-height:1.42;color:#CBD5E1;text-align:center}'
+ '.os-paso b{color:#F1F5F9;font-weight:800}'
+ '.os-paso .k{color:#38BDF8}'
+ '.os-paso .g{color:#22c55e}'
/* ── SESION POR SESION ───────────────────────────────────────────────────── */
+ '.os-ses{margin:16px 0 0;padding:14px 16px 10px;border-top:1px solid rgba(148,163,184,.1)}'
+ '.os-sesplot{position:relative;display:flex;align-items:flex-end;gap:6px;height:116px}'
+ '.os-sescol{flex:1 1 0;min-width:0;position:relative;height:100%;display:flex;'
+   'flex-direction:column;justify-content:flex-end;align-items:center}'
/* EL COLOR DICE UNA SOLA COSA: si esa sesion llego al objetivo o no.
   Celeste la que no, verde la que si. Cual es HOY se marca con la tipografia
   —numero mas grande y la fecha en blanco— y no con un tercer color, que
   mezclaba dos cosas distintas en el mismo lugar. */
+ '.os-sescol i{display:block;width:100%;max-width:40px;min-height:4px;border-radius:5px 5px 0 0;'
+   'background:linear-gradient(180deg,#38BDF8,#0284C7);font-style:normal}'
+ '.os-sescol.ok i{background:linear-gradient(180deg,#4ADE80,#16A34A)}'
/* El numero va en una chapita con el fondo de la tarjeta. Con solo una sombra,
   cuando la sesion daba cerca de cero —o negativa, que en ataque pasa— el
   numero caia justo sobre la raya punteada del objetivo y parecia que era el
   rotulo de la raya y no el de la barra. La chapita corta la raya y deja claro
   de quien es el numero. */
+ '.os-sescol u{position:absolute;left:0;right:0;z-index:3;text-decoration:none;'
+   'display:flex;justify-content:center}'
+ '.os-sescol u s{text-decoration:none;display:block;background:#0D0E1A;border-radius:5px;padding:0 5px;'
+   'font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:16px;color:#CBD5E1;letter-spacing:-.01em}'
+ '.os-sescol.hoy u s{color:#F1F5F9;font-size:19px}'
+ '.os-seslin{position:absolute;left:0;right:0;border-top:2px dashed rgba(34,197,94,.65);z-index:2;pointer-events:none}'
+ '.os-sesdias{display:flex;gap:6px;margin:8px 0 0}'
+ '.os-sesdias span{flex:1 1 0;min-width:0;text-align:center;font-size:12px;letter-spacing:.07em;'
+   'text-transform:uppercase;color:#64748B;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
+ '.os-sesdias span.hoy{color:#E2E8F0;font-weight:800}'
+ '.os-sestit{display:flex;align-items:center;gap:12px;margin:0 0 14px;white-space:nowrap}'
+ '.os-sestit h4{margin:0;font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:#7C8AA0;font-weight:700;'
+   'overflow:hidden;text-overflow:ellipsis;min-width:0}'
+ '.os-sestit .lin{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#22c55e;font-weight:800;'
+   'display:flex;align-items:center;gap:6px;margin-left:auto;flex:0 0 auto}'
+ '.os-sestit .lin:before{content:"";display:block;width:18px;border-top:2px dashed #22c55e}'

/* las filas de abajo */
+ /* ══ LOS BOTONES DE FUNDAMENTO ══════════════════════════════════════════
     El grande de arriba lo elegia el programa: el primero del puesto con
     acciones esta semana. Para el armador eso daba BLOQUEO, y si queria ver
     su SAQUE en grande no habia forma: aparecia abajo, chiquito, en la lista.
     Ahora elige el jugador. El que el programa hubiera elegido sigue siendo
     el que viene marcado al abrir. */
  /* Los botones de periodo: mismo molde que los de fundamento, redondeados y
     en otro color, para que se lea de un vistazo que son dos filtros
     distintos y no una fila de ocho botones iguales. */
  '.os-per{display:flex;gap:6px;flex-wrap:wrap;padding:13px 16px 0}'
+ '.os-per button{padding:5px 14px;border-radius:999px;border:1px solid rgba(148,163,184,.18);'
+ 'background:rgba(148,163,184,.06);color:#94A3B8;font-size:12px;font-weight:700;letter-spacing:1px;'
+ 'cursor:pointer;text-transform:uppercase;transition:all .15s;font-family:inherit}'
+ '.os-per button:hover{border-color:rgba(148,163,184,.4);color:#CBD5E1}'
+ '.os-per button.on{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.45);color:#38BDF8}'
+ '.os-fund{display:flex;gap:6px;flex-wrap:wrap;padding:11px 16px 0}'
+ '.os-fund button{padding:5px 12px;border-radius:8px;border:1px solid rgba(148,163,184,.18);'
+ 'background:rgba(148,163,184,.06);color:#94A3B8;font-size:12px;font-weight:700;letter-spacing:.9px;'
+ 'cursor:pointer;text-transform:uppercase;transition:all .15s;font-family:inherit}'
+ '.os-fund button:hover{border-color:rgba(148,163,184,.4);color:#CBD5E1}'
+ '.os-fund button.on{background:rgba(232,25,44,.14);border-color:rgba(232,25,44,.45);color:#F87171}'
+ '.os-fund button.sin{opacity:.45}'
+ '.os-fila{display:flex;align-items:center;gap:11px;padding:11px 16px;border-top:1px solid rgba(148,163,184,.1)}'
+ '.os-fila .l{font-size:17px;color:#CBD5E1;flex:1 1 44%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
+ '.os-fila .b{flex:0 1 26%;height:7px;border-radius:4px;background:rgba(148,163,184,.13);position:relative;min-width:44px}'
+ '.os-fila .b s{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:#38BDF8;text-decoration:none}'
+ '.os-fila .b b{position:absolute;top:-3px;bottom:-3px;width:3px;border-radius:2px;background:#22c55e}'
+ '.os-fila .b b.bat{background:rgba(226,232,240,.45);width:2px;top:-1px;bottom:-1px}'
+ '.os-fila .b s.ok{background:#22c55e}'
+ '.os-fila .r{text-align:right;white-space:nowrap;font-size:14px;color:#64748B;flex:0 0 auto}'
+ '.os-fila .r em{font-style:normal;color:#475569}'
+ '.os-fila .r u{font-family:Anton,"Bebas Neue",system-ui,sans-serif;font-size:23px;text-decoration:none;color:#E2E8F0;margin-right:6px;vertical-align:-1px;letter-spacing:-.01em}'
+ '.os-fila .r u s{text-decoration:none;font-family:inherit;font-size:.56em;color:#7C8AA0;margin-left:2px;vertical-align:.12em}'
+ '.os-fila .r u.ok{color:#22c55e}'
+ '.os-fila .r i{font-style:normal;font-weight:700;margin-left:7px}'
+ '.os-fila .r i.up{color:#86efac} .os-fila .r i.dn{color:#fca5a5}'
+ '.os-eq{margin:0;padding:10px 16px 11px;font-size:15px;color:#64748B;text-align:center;'
+   'border-top:1px solid rgba(148,163,184,.1)}'
+ '.os-vacio{font-size:15px;color:#64748B;padding:14px 16px;line-height:1.45}'
+ '@media(max-width:400px){.os-num{font-size:66px}.os-fila .l{font-size:16px}.os-fila .b{min-width:40px}'
+   '.os-head .cu{font-size:11px;letter-spacing:.08em}'
+   '.os-paso{font-size:16px}.os-sesplot{height:96px}.os-sescol u{font-size:14px}'
+   '.os-sescol.hoy u{font-size:16px}.os-sesdias span{font-size:11px;letter-spacing:.02em}}';

/* ── LA TIPOGRAFIA ─────────────────────────────────────────────────────────
   Anton para los numeros: es la hermana pesada de Bebas Neue, la que ya usa
   la app, asi que no desentona con el resto y al mismo tiempo le da al numero
   grande el peso que tiene en una pantalla de deporte.
   Los numeros van en tabular-nums: sin eso, el 1 es mas angosto que el resto
   y el numero grande se corre de lugar cada vez que cambia. */
function fuente(){
  if(document.getElementById('os-font')) return;
  var l = document.createElement('link');
  l.id = 'os-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(l);
}
function css(){
  fuente();
  if(document.getElementById('os-css')) return;
  var s = document.createElement('style'); s.id = 'os-css'; s.textContent = CSS;
  document.head.appendChild(s);
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function n1(v){ return (Math.round(v*10)/10).toString().replace('.',','); }
function n0(v){ return String(Math.round(v)); }
function fecha_corta(d){ return d.getDate() + '/' + (d.getMonth()+1); }

/* Vazquez Ezequiel -> Vazquez E. */
function nombreCorto(nombre){
  var t = String(nombre || '').trim().split(/\s+/);
  function cap(w){ return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }
  if(!t[0]) return '';
  if(t.length === 1) return cap(t[0]);
  return cap(t[0]) + ' ' + t[1].charAt(0).toUpperCase() + '.';
}

/* ── LAS SESIONES, NO LOS DIAS ───────────────────────────────
   Antes se dibujaban los SIETE DIAS de la semana, de lunes a domingo. Con dos
   o tres entrenamientos por semana, cuatro de esos siete dias estaban vacios:
   la linea se quedaba horizontal y las letras L M M J V S D no significaban
   nada. Eso es exactamente lo que no se entendia.

   Ahora el eje son LAS SESIONES QUE DE VERDAD HUBO. Cada barra es un
   entrenamiento o un partido, con su fecha y su numero escrito arriba. No hay
   huecos porque no se dibujan dias, se dibujan sesiones.

   Dos decisiones que no se tocan:
     1. Las barras arrancan en CERO. Correr la base para «que se note la
        diferencia» hace que dos puntos parezcan el doble que uno. Lo que hay
        que mirar es la raya verde del objetivo cruzando las barras, y eso se
        ve igual.
     2. Con menos de dos sesiones no se dibuja nada. Una barra sola no es una
        tendencia y el numero grande de arriba ya lo dice mejor.            */
function sesiones(cur, r){
  if(!r || !r.semanas || !r.semanas.length) return '';
  /* ══ LAS ULTIMAS SEIS, NO LAS DE ESTA SEMANA ══════════════════════════════
     Probado contra los datos del club: mirando SOLO el cajon actual, de 371
     combinaciones de jugador y fundamento, 268 tenian UNA sola sesion y el
     dibujo no se iba a ver casi nunca —en modo PARTIDO, nunca: una semana
     tiene un partido—. Asi que se recorre hacia atras y se juntan las ultimas
     seis sesiones con acciones, crucen o no el borde de la semana. Es mas
     util: seis puntos son una tendencia y dos no. */
  var ss = [], hy = clave(hoy()), TOPE = 6;
  for(var w = r.semanas.length - 1; w >= 0 && ss.length < TOPE; w--){
    var c = r.semanas[w];
    if(!c || !c.dias || !c.dom) continue;
    for(var i = c.dias.length - 1; i >= 0 && ss.length < TOPE; i--){
      var d = c.dias[i];
      if(!d || !d.tot) continue;
      var f = new Date(c.dom.getFullYear(), c.dom.getMonth(), c.dom.getDate() + i);
      ss.push({f:f, v:d.num / d.tot * 100, n:d.tot, hoy:(clave(f) === hy)});
    }
  }
  ss.reverse();
  if(ss.length < 2) return '';

  /* La raya de referencia es el objetivo de la semana. Cuando todavia no hay
     objetivo —la primera semana con datos— se usa la bateria del equipo, que
     es el norte igual. Sin ninguna de las dos, las barras van sin raya y sin
     color de estado: no hay contra que decir si estuvo bien o mal. */
  var obj = (cur.objetivo != null) ? cur.objetivo : ((r && r.bat != null) ? r.bat : null);
  var esObj = (cur.objetivo != null);
  /* La MISMA escala para las barras y para la raya. Con dos formulas distintas
     una barra de 95 quedaba por debajo de una raya de 93. */
  function alto(v){ return Math.max(3, Math.min(86, v)); }

  /* El rotulo va en el encabezado, no adentro del dibujo: pegado a la raya se
     montaba justo arriba del numero de la ultima sesion, que es el que mas
     importa, y no se leia ninguno de los dos. */
  var o = '<div class="os-ses"><div class="os-sestit"><h4>' + T('sesTit') + '</h4>'
        + (obj == null ? '' : '<b class="lin">'
            + (esObj ? T('objLbl', n1(obj) + '&nbsp;%')
                     : T('pBateria') + ' ' + n1(obj) + '&nbsp;%') + '</b>')
        + '</div>';
  o += '<div class="os-sesplot">';
  if(obj != null){
    o += '<div class="os-seslin" style="bottom:' + alto(obj).toFixed(1) + '%"></div>';
  }
  ss.forEach(function(x){
    var h = alto(x.v);
    var cl = (obj != null && x.v >= obj) ? ' ok' : '';
    if(x.hoy) cl += ' hoy';
    o += '<div class="os-sescol' + cl + '">'
       + '<u style="bottom:calc(' + h.toFixed(1) + '% + 6px)"><s>' + n1(x.v) + '</s></u>'
       + '<i style="height:' + h.toFixed(1) + '%"></i></div>';
  });
  o += '</div><div class="os-sesdias">';
  ss.forEach(function(x){
    o += '<span class="' + (x.hoy ? 'hoy' : '') + '">'
       + (x.hoy ? T('sesHoy') : fecha_corta(x.f)) + '</span>';
  });
  o += '</div></div>';
  return o;
}

/* ── CUANTAS ACCIONES FALTAN, DE VERDAD ────────────────────────────
   «te falta 7,5 para el objetivo» no le dice a nadie que tiene que hacer.
   Cuantas acciones buenas seguidas lo ponen ahi, si.

     val = num / tot * 100.  Con k acciones buenas mas:
     (num + k) / (tot + k) * 100 >= O   =>   k >= (O*tot - 100*num) / (100 - O)

   El armado de alta suma (puntos+2) sobre 4 por accion, asi que ahi cada
   accion vale 4 y la cuenta se divide por ese paso.

   Devuelve null cuando el numero no sirve: objetivo de 100 (no hay k), sin
   acciones todavia, o mas de doce acciones. Doce es, mas o menos, lo que da
   una sesion: arriba de eso el numero deja de ser un paso que se puede dar
   hoy y pasa a desanimar («te faltan 37 recepciones buenas» no empuja a
   nadie). En ese caso la tarjeta dice los puntos que faltan y listo.       */
function cuantasFaltan(cur, id, meta){
  if(meta == null || !cur || !cur.tot) return null;
  if(meta >= 99.5) return null;
  var k = (meta * cur.tot - 100 * cur.num) / (100 - meta);
  if(k <= 0) return 0;
  var paso = (id === 'hset') ? 4 : 1;
  k = Math.ceil(k / paso);
  if(k > 12 || !isFinite(k)) return null;
  return k;
}
function cuantasB(n){ return n === 1 ? T('accB1', n) : T('accBn', n); }

/* La pastilla verde/roja: cuanto mejor o peor va que el mismo dia de la
   semana pasada. Comparar el cierre entero contra un miercoles no diria nada. */
/* ══ EL NaN DEL MODO DIA ═══════════════════════════════════════════════════
   Esta pastilla se escribio cuando el unico periodo era la semana: buscaba el
   acumulado del MISMO dia de la semana pasada, con el indice del dia (0 a 6).
   En DIA el cajon tiene UNA sola casilla, asi que acum[4] no existe, y como la
   guarda era «!== null» —y undefined no es null— se colaba: la resta daba NaN
   y en pantalla aparecia «NaN vs el viernes pasado». En MES pasaba parecido.
   Ahora: en semana sigue comparando contra el mismo dia, y en dia y en mes
   compara contra el cajon anterior entero, que es lo que corresponde. */
function pastilla(S, cur, per){
  per = per || 'semana';
  var prev = null;
  for(var i=S.length-2;i>=0;i--){ if(S[i].tot){ prev = S[i]; break; } }
  if(!prev || cur.val === null) return '';
  var a = null, lbl = '', lblIgual = '';
  if(per === 'semana'){
    var hd = diaSemana(hoy());
    for(var k=hd;k>=0;k--){ if(prev.acum[k] != null){ a = prev.acum[k]; break; } }
    if(a == null) a = prev.val;
    lbl = T('vsDia', T('diasLargos')[hd]);
    lblIgual = T('igual', T('diasLargos')[hd]);
  } else {
    a = prev.val;
    lbl = T(per === 'dia' ? 'ayer' : 'mesPasado');
    lblIgual = T(per === 'dia' ? 'igualAyer' : 'igualMes');
  }
  if(a == null) return '';
  var d = cur.val - a;
  if(!isFinite(d)) return '';
  if(Math.abs(d) < 0.05) return '<span class="os-delta eq">' + lblIgual + '</span>';
  return '<span class="os-delta ' + (d > 0 ? 'up' : 'dn') + '">'
       + (d > 0 ? '&#9650; ' : '&#9660; ') + n1(Math.abs(d)) + ' ' + lbl + '</span>';
}

/* ── LA BARRA ──────────────────────────────────────────────────────────────
   Va del peor al mejor de la liga, que es el recorrido que ya usa el semaforo
   de las baterias en todas las otras pantallas. Puesta de otra manera —del
   cierre del domingo a la bateria— una semana floja dejaba la barra en cero y
   parecia rota.
     rojo (o verde)  donde esta hoy
     marca verde     el objetivo de esta semana
     marca gris      la bateria                                             */
function marcas(r, cur, alto){
  var m = r.meta || {};
  var lo = (m.min != null) ? m.min : 0;
  var hi = (m.max != null) ? m.max : 100;
  if(hi <= lo){ lo = 0; hi = 100; }
  function P(v){ return Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100)); }
  var listo = (cur.objetivo != null && cur.val !== null && cur.val >= cur.objetivo);
  var o = '';
  if(cur.val !== null) o += '<s class="' + (listo ? 'ok' : '') + '" style="width:' + P(cur.val).toFixed(1) + '%"></s>';
  if(r.bat != null && (cur.objetivo == null || Math.abs(r.bat - cur.objetivo) > 0.6))
    o += '<b class="bat" style="left:calc(' + P(r.bat).toFixed(1) + '% - 1px)"></b>';
  if(cur.objetivo != null)
    o += '<b style="left:calc(' + P(cur.objetivo).toFixed(1) + '% - 1.5px)"></b>';
  return o;
}
/* Las dos marcas de la barra eran dos rayitas sin nombre: habia que saber de
   antes cual era el objetivo y cual la bateria. Ahora van rotuladas, y el
   rotulo se ancla al borde cuando la marca queda contra una punta, para que
   no se salga de la tarjeta. */
function barra(r, cur){
  var m = r.meta || {};
  var lo = (m.min != null) ? m.min : 0;
  var hi = (m.max != null) ? m.max : 100;
  if(hi <= lo){ lo = 0; hi = 100; }
  function P(v){ return Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100)); }
  function pos(p){
    if(p < 14) return 'left:0';
    if(p > 86) return 'right:0';
    return 'left:' + p.toFixed(1) + '%;transform:translateX(-50%)';
  }
  var rot = '';
  if(cur.objetivo != null)
    rot += '<b style="' + pos(P(cur.objetivo)) + '">' + T('pObjetivo') + ' ' + n1(cur.objetivo) + '&nbsp;%</b>';
  if(r.bat != null && (cur.objetivo == null || Math.abs(r.bat - cur.objetivo) > 5))
    rot += '<i style="' + pos(P(r.bat)) + '">' + T('pBateria') + ' ' + n0(r.bat) + '&nbsp;%</i>';

  var o = (rot ? '<div class="os-rot">' + rot + '</div>' : '')
        + '<div class="os-bar">' + marcas(r, cur) + '</div>';
  o += '<div class="os-barpie"><span>'
     + (cur.desde == null ? '' : T((r.periodo || 'semana') === 'semana' ? 'cerroEn' : 'cerroPrev', n1(cur.desde) + '&nbsp;%'))
     + '</span><span>' + (cur.n ? cuantas(cur.n) : '') + '</span></div>';
  return o;
}

function tarjeta(r, modo, eqSerie, nombre, dorsal){
  var cur = r.ultima;
  var per = r.periodo || 'semana';
  var hd = diaSemana(hoy());
  var o = '<div class="os-card">';

  /* El encabezado dice de que periodo se esta hablando. Sin esto, mirando el
     mes seguia diciendo "cierra el domingo" y confundia. */
  var cierre = per === 'dia' ? T('cierraDia') : (per === 'mes' ? T('cierraMes') : T('cierra'));
  o += '<div class="os-head"><div class="q1">'
     + (dorsal ? '<span class="dor">' + esc(dorsal) + '</span>' : '')
     + '<span class="nom">' + esc(nombreCorto(nombre)) + '</span></div>'
     + '<span class="cu">' + T('diasLargos')[hd] + ' &middot; ' + cierre + '</span></div>';

  /* la racha: en semana son semanas cumpliendo su objetivo; en dia y en mes,
     dias o meses seguidos llegando a la bateria del equipo */
  if(r.racha !== undefined && cur.objetivo != null){
    var pts = '';
    for(var i=0;i<5;i++) pts += '<i class="' + (i < r.racha ? 'on' : '') + '"></i>';
    var lblRacha = per === 'dia' ? T('rachaDia') : (per === 'mes' ? T('rachaMes') : T('racha'));
    o += '<div class="os-racha">' + lblRacha + '<span class="pts">' + pts + '</span></div>';
  }

  var logro = (cur.n > 0 && cur.objetivo != null && cur.val !== null && cur.val >= cur.objetivo);
  o += '<div class="os-foco' + (logro ? ' ok' : '') + '">'
     + '<p class="os-q">' + T(per === 'dia' ? 'tituloDia' : (per === 'mes' ? 'tituloMes' : 'titulo'))
     + ' &middot; <b>' + nombreDe(r.id, r.meta) + '</b>'
     + ' <span style="color:#475569">&middot; ' + T(modo === 'partido' ? 'partido' : 'entrenamiento') + '</span></p>';

  if(cur.n === 0){
    o += '<div class="os-num no">&mdash;</div>'
       + '<p class="os-sub">' + T('sinArranque')
       + (cur.desde == null ? '' : ' &middot; ' + T(per === 'semana' ? 'cerroEn' : 'cerroPrev', n1(cur.desde) + '&nbsp;%')) + '</p>';
  } else {
    /* ══ EL NUMERO LLEVA EL % PEGADO Y EL COLOR DEL ESTADO ═════════════════
       Un «62,5» suelto no se sabe si son puntos, acciones o por ciento. Y el
       color: celeste mientras va en camino, verde cuando llego. Nunca rojo,
       que es lo que estaba y hacia leer su propio avance como un error. */
    o += '<div class="os-num ' + (cur.objetivo == null ? '' : (logro ? 'ok' : 'vas')) + '">'
       + n1(cur.val) + '<u>%</u></div>';
    if(cur.objetivo == null){
      o += '<p class="os-sub">' + cuantas(cur.n) + ' &middot; ' + T('arranca') + '</p>';
    } else {
      o += '<div><span class="os-pill' + (logro ? ' ok' : '') + '">'
         + (logro ? '&#10003; ' + T('logrado') : T('objLbl', n1(cur.objetivo) + '&nbsp;%')) + '</span></div>';
    }
    o += pastilla(r.semanas, cur, per);
  }
  o += '</div>';

  /* ══ EL PASO SIGUIENTE, EN ACCIONES ══════════════════════════════════════
     Una sola cosa por vez. Si todavia no llego al objetivo, el paso es el
     objetivo. Si ya lo paso, el paso pasa a ser la bateria del equipo, que es
     el norte. Las dos juntas confunden: son dos metas distintas al mismo
     tiempo y el jugador no sabe cual mirar. */
  if(cur.n > 0 && cur.val !== null){
    var paso = '';
    if(cur.objetivo == null){
      var k0 = (r.bat == null) ? null : cuantasFaltan(cur, r.id, r.bat);
      if(k0 > 0) paso = T('pBatK', cuantasB(k0), n1(r.bat) + '&nbsp;%');
      else if(r.bat != null && cur.val >= r.bat) paso = T('pBatYa').replace('Y ya', 'Ya');
    } else if(!logro){
      var k = cuantasFaltan(cur, r.id, cur.objetivo);
      paso = (k > 0) ? T('pConK', cuantasB(k), n1(cur.objetivo) + '&nbsp;%')
                     : T('pFalta', n1(cur.objetivo - cur.val), n1(cur.objetivo) + '&nbsp;%');
    } else {
      paso = T('pPase', n1(cur.val - cur.objetivo));
      if(r.bat != null){
        if(cur.val >= r.bat){ paso += ' ' + T('pBatYa'); }
        else {
          var kb = cuantasFaltan(cur, r.id, r.bat);
          paso += ' ' + ((kb > 0) ? T('pBatK', cuantasB(kb), n1(r.bat) + '&nbsp;%')
                                  : T('pBatPts', n1(r.bat - cur.val), n1(r.bat) + '&nbsp;%'));
        }
      }
    }
    if(paso) o += '<p class="os-paso">' + paso + '</p>';
  }

  o += barra(r, cur);

  /* Sesion por sesion. Se dibuja solo si hubo dos o mas; la propia funcion
     devuelve vacio cuando no, asi que en DIA (un solo cajon) no sale nada. */
  o += sesiones(cur, r);
  if(eqSerie && eqSerie.ultima && eqSerie.ultima.val !== null){
    o += '<p class="os-eq">' + T('equipo', n1(eqSerie.ultima.val) + '&nbsp;%') + '</p>';
  }
  return o;   /* el cierre del os-card lo pone render(), despues de las filas */
}

function fila(r){
  var o = '<div class="os-fila"><span class="l">' + nombreDe(r.id, r.meta) + '</span>';
  if(!r.hay || !r.ultima || r.ultima.n === 0){
    /* Sin acciones esta semana se muestra el cierre del domingo, que es el
       dato que le sirve: de ahi arranca. Antes decia «sin acciones esta
       semana» en cada fila y el renglon entero se iba en eso; en un telefono
       el nombre del fundamento quedaba cortado. */
    var c = (r.hay && r.ultima && r.ultima.desde != null)
            ? '<em>' + T('cerroCorto', n1(r.ultima.desde) + '&nbsp;%') + '</em>'
            : '<em>' + ((r.hay && r.ultima) ? T('sinSemana') : T('sinDatos')) + '</em>';
    o += '<span class="b">' + ((r.hay && r.ultima) ? marcas(r, r.ultima) : '') + '</span>'
       + '<span class="r">' + c + '</span></div>';
    return o;
  }
  var cur = r.ultima, v = cur.val, obj = cur.objetivo;
  var listo = (obj != null && v >= obj);
  o += '<span class="b">' + marcas(r, cur) + '</span>';
  o += '<span class="r"><u class="' + (listo ? 'ok' : '') + '">' + n1(v) + '<s>%</s></u>'
     + (obj == null ? T('midiendo') : (listo ? T('logrado') : T('faltaN', n1(obj - v) + '&nbsp;%')));
  var d = (cur.desde == null) ? null : v - cur.desde;
  if(d !== null && Math.abs(d) >= 0.05){
    o += '<i class="' + (d > 0 ? 'up' : 'dn') + '">' + (d > 0 ? '&#9650;' : '&#9660;') + n1(Math.abs(d)) + '</i>';
  }
  o += '</span></div>';
  return o;
}

function puestoDe(nombre){
  var fuentes = [];
  if(window.EQUIPO_DATA && window.EQUIPO_DATA.jugadores) fuentes.push(window.EQUIPO_DATA.jugadores);
  if(window.PLANTEL_NAFELS && window.PLANTEL_NAFELS.jugadores) fuentes.push(window.PLANTEL_NAFELS.jugadores);
  for(var f=0; f<fuentes.length; f++){
    var L = fuentes[f];
    for(var i=0;i<L.length;i++){
      var j = L[i];
      var nm = j.nombre || j.ap || '';
      if(parecido(nm, nombre) || mismoNombre((j.ap||''), nombre)){
        if(j.pos) return String(j.pos).toUpperCase();
      }
    }
  }
  if(window._curJug && window._curJug.pos) return String(window._curJug.pos).toUpperCase();
  if(window.jugador && window.jugador.pos) return String(window.jugador.pos).toUpperCase();
  return '';
}

/* ══ QUIEN ENTRO, CUANDO NO LO DICE LA PANTALLA ════════════════════════════
   El perfil del jugador ya deja el nombre en _objNombre. La portada no: ahi
   lo unico que hay es el numero de camiseta con el que inicio sesion. Se
   busca en el plantel y listo. Si el que entro no es un jugador —el cuerpo
   tecnico— no devuelve nada y la tarjeta no se dibuja.                     */
function nombreDelQueEntro(){
  var num = null;
  try{ num = localStorage.getItem('casla_player_num') || localStorage.getItem('vb_player_num'); }catch(e){}
  if(!num) return null;
  var fuentes = [];
  if(window.EQUIPO_DATA && window.EQUIPO_DATA.jugadores) fuentes.push(window.EQUIPO_DATA.jugadores);
  if(window.PLANTEL_NAFELS && window.PLANTEL_NAFELS.jugadores) fuentes.push(window.PLANTEL_NAFELS.jugadores);
  for(var f=0; f<fuentes.length; f++){
    var L = fuentes[f];
    for(var i=0;i<L.length;i++){
      if(String(L[i].num) === String(num)){
        var nm = L[i].nombre || L[i].ap;
        if(nm) return nm;
      }
    }
  }
  return null;
}
/* ── QUE MODO MUESTRA LA PORTADA ───────────────────────────────────────────
   El perfil del jugador tiene su propio filtro de partido/entrenamiento. La
   portada no, asi que elige sola: el modo que esta semana tenga MAS
   fundamentos con acciones. Al principio ponia partido siempre que hubiera
   uno, y el lunes despues de un partido eso dejaba la portada en blanco
   —cuatro acciones sueltas y ningun objetivo con numero— mientras la semana
   de entrenamiento estaba llena. Nunca se mezclan los dos: se elige uno.   */
function modoConAcciones(nombre){
  var pue = puestoDe(nombre);
  var ids = PUESTOS[pue] || POR_DEFECTO;
  var mejor = 'entrenamiento', cuenta = -1;
  ['entrenamiento', 'partido'].forEach(function(md){
    var n = 0;
    ids.forEach(function(id){
      if(SOLO_ENTRENAMIENTO[id]) return;      /* no vota: solo existe de un lado */
      var r = serie(nombre, md, id);
      if(r.hay && r.ultima && r.ultima.n > 0 && r.ultima.objetivo != null) n++;
    });
    if(n > cuenta){ cuenta = n; mejor = md; }
  });
  return mejor;
}

function render(){
  var cont = document.getElementById('obj-semana');
  if(!cont) return;
  if(!window.OBJETIVOS_CONFIG || !window.OBJETIVOS_CONFIG.metas || !window.BAT_PARTIDOS){
    cont.innerHTML = ''; return;
  }
  css();
  var nombre = window._objNombre || (window._curJug && (window._curJug.nombre || window._curJug.ap))
            || nombreDelQueEntro();
  if(!nombre){ cont.innerHTML = ''; return; }
  /* En el perfil manda el filtro de la pantalla. En la portada no hay filtro,
     asi que se elige solo: el modo que tenga acciones esta semana, y si los
     dos tienen, el partido, que es lo que acaba de pasar. */
  var modo = window._objTipo ? (window._objTipo === 'entrenamiento' ? 'entrenamiento' : 'partido')
                             : modoConAcciones(nombre);
  var pue  = puestoDe(nombre);
  var ids  = PUESTOS[pue] || POR_DEFECTO;

  /* Con el filtro puesto a mano manda el filtro. Cuando el modo lo eligio el
     programa, los fundamentos de entrenamiento se leen de entrenamiento
     aunque el resto de la tarjeta este en partido. */
  var auto = !window._objTipo;
  function modoDe(id){ return (auto && SOLO_ENTRENAMIENTO[id]) ? 'entrenamiento' : modo; }
  var per = window._objPeriodo || 'semana';
  var rs = ids.map(function(id){ return serie(nombre, modoDe(id), id, per); });
  var conDatos = rs.filter(function(r){ return r.hay; });
  if(!conDatos.length){
    cont.innerHTML = '<div class="os-wrap" data-notr><div class="os-card"><div class="os-vacio">'
      + T('nada', T(modo === 'partido' ? 'partidos' : 'entrenamientos')) + '</div></div></div>';
    return;
  }
  /* El grande de arriba es el primero de su puesto con acciones ESTA semana.
     Si todavia no hizo ninguna de ninguno, va el primero que tenga historia,
     para que igual vea su objetivo. */
  var auto_head = conDatos.filter(function(r){ return r.ultima && r.ultima.n > 0; })[0] || conDatos[0];

  /* ══ CUAL VA EN GRANDE ════════════════════════════════════════════════════
     Manda el boton que toco el jugador. Si no toco ninguno —o si el que eligio
     no tiene datos en el modo que esta mirando, por ejemplo saque en un
     entrenamiento donde no saco— vuelve a mandar el automatico, para que
     nunca quede la pantalla en blanco. */
  var elegido = conDatos.filter(function(r){ return r.id === window._objFund; })[0];
  var head = elegido || auto_head;
  var resto = rs.filter(function(r){ return r !== head; });

  /* ══ DIA / SEMANA / MES ═════════════════════════════════════════════════
     La semana va al medio porque es la de siempre y la unica con objetivo
     propio que sube. El dia es para mirar de cerca y el mes de lejos. */
  var periodos = '<div class="os-per">' + [['dia','perDia'],['semana','perSem'],['mes','perMes']]
    .map(function(par){
      return '<button type="button" class="' + (per === par[0] ? 'on' : '') + '"'
           + ' onclick="window.OBJ_SEMANA.periodo(\'' + par[0] + '\')">' + T(par[1]) + '</button>';
    }).join('') + '</div>';

  var botones = '<div class="os-fund">' + rs.map(function(r){
      var vacio = !r.hay;
      return '<button type="button" class="' + (r === head ? 'on' : '') + (vacio ? ' sin' : '')
           + '" onclick="window.OBJ_SEMANA.fundamento(\'' + r.id + '\')">'
           + cortoDe(r.id, r.meta) + '</button>';
    }).join('') + '</div>';

  var html = '<div class="os-wrap" data-notr>'
           + periodos
           + botones
           + tarjeta(head, modoDe(head.id), serie(null, modoDe(head.id), head.id, per), nombre, dorsalDe(nombre))
           + resto.map(fila).join('')
           + '</div></div>';
  cont.innerHTML = html;
}

/* Mostrar el recuadro y avisarle a la tira que ahora son CUATRO, para que se
   reparta el ancho entre los cuatro en una sola fila. Sin esto el nuevo caia
   en un segundo renglon, abajo de todo, con los tres de arriba a medio llenar. */
function mostrar(caja){
  caja.style.display = '';
  try{
    var tb = document.getElementById('tablero');
    if(tb) tb.classList.add('con-obj');
  }catch(e){}
}

/* ── LA TARJETA DE ACCESO EN LA PORTADA ────────────────────────────────────
   El hueco lo deja index.html, escondido y con id="tb-objetivos". Aca se
   llena y recien ahi se muestra: si los datos no abren, no aparece nada y la
   portada queda como siempre.

   Es una tarjeta del mismo tamanio que «Proximo partido» y va primera. Antes
   habia probado meterlo como un numero mas adentro de «Como venimos» y no
   servia: para encontrarlo habia que saber que estaba.                     */
function tarjetaPortada(){
  var caja = document.getElementById('tb-objetivos');
  if(!caja || caja.getAttribute('data-os') === '1' || !listo()) return;

  var num = document.getElementById('tb-obj-n');
  var det = document.getElementById('tb-obj-d');
  var ir  = document.getElementById('tb-obj-ir');
  var nombre = window._objNombre || nombreDelQueEntro();

  if(!nombre){
    /* cuerpo tecnico: la hoja con todo el plantel */
    caja.setAttribute('data-os', '1');
    caja.setAttribute('href', 'objetivos_equipo.html');
    caja.querySelector('.tb-lbl').innerHTML = T('tPlantel');
    if(num){ num.className = 'tb-obj-n'; num.innerHTML = '<span style="font-size:.6em">' + T('tVerTodos') + '</span>'; }
    if(det) det.innerHTML = T('tDetPlantel');
    if(ir)  ir.innerHTML = T('tIrPlantel');
    mostrar(caja);
    return;
  }

  var modo = modoConAcciones(nombre);
  var pue  = puestoDe(nombre);
  var ids  = PUESTOS[pue] || POR_DEFECTO;
  var cump = 0, tot = 0, rs = [];
  ids.forEach(function(id){
    var r = serie(nombre, modo, id);
    rs.push(r);
    if(r.hay && r.ultima && r.ultima.n > 0 && r.ultima.objetivo != null){
      tot++; if(r.ultima.val >= r.ultima.objetivo) cump++;
    }
  });
  caja.setAttribute('data-os', '1');
  caja.setAttribute('href', 'jugador.html');
  if(ir) ir.innerHTML = T('tIrMios');

  if(!tot){
    /* la semana todavia no arranco: se muestra igual, con el objetivo que le
       toca, porque eso es justamente lo que tiene que ir a hacer */
    var con = rs.filter(function(r){ return r.hay && r.ultima && r.ultima.objetivo != null; })[0];
    if(num){ num.className = 'tb-obj-n'; num.innerHTML = con ? (n1(con.ultima.objetivo) + '<s>%</s>') : '&mdash;'; }
    if(det){
      det.innerHTML = con
        ? T('tArranca', nombreDe(con.id, con.meta)) 
        : T('tSinNada');
    }
    mostrar(caja);
    return;
  }

  /* el que va primero en su puesto y tiene acciones esta semana */
  var head = rs.filter(function(r){ return r.hay && r.ultima && r.ultima.n > 0 && r.ultima.objetivo != null; })[0];
  if(num){
    num.className = 'tb-obj-n' + (cump === tot ? '' : ' falta');
    num.innerHTML = cump + '<s>/' + tot + '</s>';
  }
  if(det && head){
    var c = head.ultima;
    det.innerHTML = c.val >= c.objetivo
      ? T('tDetOk', nombreDe(head.id, head.meta), n1(c.val) + '&nbsp;%')
      : T('tDetFalta', nombreDe(head.id, head.meta), n1(c.val) + '&nbsp;%', n1(c.objetivo - c.val));
  }
  mostrar(caja);
}

/* ── Enganche ───────────────────────────────────────────────────────────────
   No se toca ninguna funcion de la pantalla: se envuelve la que ya redibuja
   las baterias, asi el cambio de partido/entrenamiento arrastra a esta
   tarjeta sin que haya que acordarse de llamarla.

   Y SE ESPERA A QUE LOS DATOS ESTEN ABIERTOS. datos_baterias.js.enc pesa
   240 KB, y datos_seguros.js abre los archivos grandes EN SEGUNDO PLANO para
   no congelar el telefono: cuando termina cada uno avisa con el evento
   'datos-listos'. Dibujar una sola vez al cargar la pagina era dibujar antes
   de que existiera window.BAT_PARTIDOS, y la tarjeta no aparecia nunca en la
   portada. Ahora se escucha ese aviso y ademas se reintenta un rato por si
   el aviso no llega.                                                        */
function listo(){
  return !!(window.BAT_PARTIDOS && window.OBJETIVOS_CONFIG && window.OBJETIVOS_CONFIG.metas);
}
function pintarTodo(){
  try{ render(); }catch(e){ if(window.console) console.warn('[obj-semana]', e); }
  try{ tarjetaPortada(); }catch(e){ if(window.console) console.warn('[obj-semana]', e); }
}
function enganchar(){
  if(typeof window.objRenderBaterias === 'function' && !window.objRenderBaterias._os){
    var orig = window.objRenderBaterias;
    var envuelta = function(){
      var r = orig.apply(this, arguments);
      pintarTodo();
      return r;
    };
    envuelta._os = true;
    window.objRenderBaterias = envuelta;
  }
  pintarTodo();
  /* Se sigue intentando hasta que esten las DOS cosas: los datos abiertos y
     el hueco de la pastilla dibujado. El hueco lo pone hbTop(), que corre
     cuando quiere, asi que cortar apenas llegan los datos dejaba la pastilla
     en blanco. */
  var intentos = 0, hechos = 0;
  var t = setInterval(function(){
    intentos++;
    var hay = listo();
    var hueco = document.getElementById('tb-objetivos');
    if(hay) pintarTodo();
    if(hay && (hueco || intentos > 12)) hechos++;
    if(hechos >= 3 || intentos > 60) clearInterval(t);   /* 24 segundos y se deja */
  }, 400);
  try{
    window.addEventListener('datos-listos', function(){ setTimeout(pintarTodo, 0); });
  }catch(e){}
  /* Y un vigia, por si el tablero se redibuja mucho despues: cuando aparece
     un hueco de pastilla sin marcar, se llena. */
  try{
    if(window.MutationObserver && document.body){
      var esperando = false;
      new MutationObserver(function(){
        if(esperando) return;
        var a = document.getElementById('tb-objetivos');
        if(!a || a.getAttribute('data-os') === '1') return;
        esperando = true;
        setTimeout(function(){ esperando = false;
          try{ tarjetaPortada(); }catch(e){} }, 60);
      }).observe(document.body, {childList:true, subtree:true});
    }
  }catch(e){}
}
/* La llaman los botones de DIA / SEMANA / MES. */
function periodo(p){
  window._objPeriodo = (p === 'semana') ? null : p;   /* semana es lo normal */
  try{ render(); }catch(e){}
}

/* La llaman los botones de fundamento desde el HTML que dibuja render(). */
function fundamento(id){
  window._objFund = (window._objFund === id) ? null : id;   /* tocar el mismo, vuelve al automatico */
  try{ render(); }catch(e){}
}

window.OBJ_SEMANA = {render:render, fundamento:fundamento, periodo:periodo, pastilla:tarjetaPortada, serie:serie, semanas:semanas, PUESTOS:PUESTOS, CUENTA:CUENTA,
                     /* plan_desarrollo.html la llama para dejar marcado el boton
                        —PARTIDO o ENTRENAMIENTO— que corresponde al abrir. No
                        estaba exportada, asi que la llamada caia en el catch y
                        la pagina abria sin ninguno de los dos marcado. */
                     modoConAcciones:modoConAcciones,
                     /* la tabla del cuerpo tecnico usa el mismo diccionario:
                        si hubiera dos, un dia dirian cosas distintas */
                     T:T, idioma:idioma, nombreDe:nombreDe, cortoDe:cortoDe,
                     puestoTxt:puestoTxt, lunesDe:lunesDe, hoy:hoy, clave:clave};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(enganchar, 0); });
else setTimeout(enganchar, 0);
})();
