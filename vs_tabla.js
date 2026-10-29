/* ═══════════════════════════════════════════════════════════════════════════
   vs_tabla.js · LA TABLA DE LA APP
   ---------------------------------------------------------------------------
   QUE HACE
   Le da a las tablas de datos el mismo lenguaje que el resto de la app: cada
   fila es una tarjeta, los encabezados van una sola vez arriba, los numeros en
   monoespaciada de ancho fijo, un hilo vertical entre quien es y cuanto hizo,
   todos los numeros del mismo cuerpo, y UN solo acento:
   la fila que tocas se enciende en rojo entera.

   POR QUE EN JAVASCRIPT Y NO SOLO EN CSS
   Tres cosas no se pueden hacer con CSS: saber donde termina la identidad y
   empiezan los datos (cambia si la tabla tiene puesto o no), reconocer la
   fila de totales, y volver a armar todo cuando la pantalla redibuja la tabla
   al ordenar o filtrar.

   SIN BARRAS
   La version anterior dibujaba una barrita debajo de cada numero. En una
   columna de conteos (remates, errores) la barra mide partidos jugados, no
   calidad: quien jugo mas se veia mejor. Se fueron, y si quedo alguna del
   paso anterior, esta funcion la borra.

   DONDE SE METE Y DONDE NO
   Solo en tablas de datos: necesitan <thead>, 3 columnas o mas y 3 filas o
   mas. Una tabla de maquetado o de dos filas queda intacta. Tampoco toca
   nada adentro de un elemento con la clase .vs-no-tabla.

   APAGARLO SIN DESINSTALAR NADA
       localStorage.setItem('vs_estilo','off')  y recargar.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  try{ if((localStorage.getItem('vs_estilo')||'') === 'off') return; }catch(e){}

  var MIN_COLS = 3, MIN_FILAS = 3;
  /* la ultima fila es un cierre y no una jugadora solo si lo dice entera */
  /* "TOTALES", pero tambien "TOTALES EQUIPO" y "PROMEDIO GENERAL" */
  var RX_TOT = new RegExp('^(totales?|suma|promedios?|media|avg)(\\s+\\S+)?[\\s:.]*$', 'i');

  function limpio(el){ return ((el && el.textContent) || '').replace(/ /g,' ').trim(); }

  function esRanking(filas){
    /* la primera columna es un puesto si en TODAS las filas es un numero corto */
    for(var i = 0; i < filas.length; i++){
      var c = filas[i].children[0]; if(!c) return false;
      if(!/^[0-9]{1,3}$/.test(limpio(c))) return false;
    }
    return true;
  }

  /* pone una clase en una columna entera (cuerpo + encabezado) y la saca de
     las demas, para que al redibujar no queden marcas viejas */
  function columna(T, filas, idx, cls){
    [].slice.call(T.querySelectorAll('td.' + cls + ', th.' + cls))
      .forEach(function(x){ x.classList.remove(cls); });
    if(idx < 0) return;
    filas.forEach(function(tr){ var td = tr.cells[idx]; if(td) td.classList.add(cls); });
    var ths = T.tHead ? [].slice.call(T.tHead.rows[T.tHead.rows.length - 1].cells) : [];
    if(ths[idx]) ths[idx].classList.add(cls);
  }

  function armar(T){
    var cuerpo = T.tBodies && T.tBodies[0]; if(!cuerpo) return;
    var todas = [].slice.call(cuerpo.rows).filter(function(tr){ return tr.cells.length >= MIN_COLS; });
    if(todas.length < MIN_FILAS) return;

    T.classList.add('vs-tabla');
    var w = T.closest('.table-wrap') || T.closest('.tabla-wrap') || T.parentElement;
    if(w && w !== document.body) w.classList.add('vs-tablaw');

    /* la fila de totales: solo la ultima, y solo si se llama asi */
    todas.forEach(function(tr){ tr.classList.remove('vs-tot'); });
    var filas = todas, ult = todas[todas.length - 1];
    if(RX_TOT.test(limpio(ult.cells[0]))){
      ult.classList.add('vs-tot');
      if(todas.length - 1 >= MIN_FILAS) filas = todas.slice(0, -1);
    }

    var rank = esRanking(filas);
    T.classList.toggle('vs-conpuesto', rank);
    var prim = rank ? 1 : 0;              /* la columna del nombre */

    /* el color del club pasa del nombre a un punto; el punto solo aparece si
       el club TIENE color propio (en la tabla del plantel no hay) */
    filas.forEach(function(tr){
      var n = tr.cells[prim] && tr.cells[prim].querySelector('.t-name');
      if(!n || n.dataset.vsClub) return;
      n.dataset.vsClub = '1';
      var c = (n.getAttribute('style') || '').match(/color\s*:\s*([^;]+)/);
      if(c){ n.style.setProperty('--club', c[1].trim()); n.dataset.club = '1'; }
    });

    /* las barras de la version anterior se van */
    [].slice.call(T.querySelectorAll('.vs-bar')).forEach(function(b){ b.remove(); });
    [].slice.call(T.querySelectorAll('td.vs-neg')).forEach(function(td){ td.classList.remove('vs-neg'); });
    /* y la columna protagonista tambien: ahora todos los numeros miden igual */
    [].slice.call(T.querySelectorAll('.vs-hero')).forEach(function(td){ td.classList.remove('vs-hero'); });

    var nCols = filas[0].cells.length;

    /* el corte: el hilo entre quien es y cuanto hizo */
    columna(T, todas, (prim + 1 < nCols ? prim + 1 : -1), 'vs-corte');

    /* la columna por la que esta ordenada */
    var idx = -1;
    filas.forEach(function(tr){
      [].slice.call(tr.cells).forEach(function(td, i){
        if(td.classList.contains('active-col') || td.classList.contains('vs-orden')) idx = i;
      });
    });
    var ths = T.tHead ? [].slice.call(T.tHead.rows[T.tHead.rows.length - 1].cells) : [];
    ths.forEach(function(th, i){ th.classList.toggle('vs-orden', i === idx); });

    /* tocar una fila la enciende; volver a tocarla la apaga */
    if(!T.dataset.vsClick){
      T.dataset.vsClick = '1';
      T.addEventListener('click', function(ev){
        if(ev.target.closest('a,button,input,select,label')) return;   /* los controles siguen siendo suyos */
        var tr = ev.target.closest('tr');
        if(!tr || !cuerpo.contains(tr) || tr.classList.contains('vs-tot')) return;
        var ya = tr.classList.contains('vs-sel');
        [].slice.call(T.querySelectorAll('tr.vs-sel')).forEach(function(x){ x.classList.remove('vs-sel'); });
        if(!ya) tr.classList.add('vs-sel');
      });
    }
  }

  function candidatas(){
    return [].slice.call(document.querySelectorAll('table')).filter(function(T){
      if(T.closest('.vs-no-tabla')) return false;
      if(!T.tHead) return false;
      var b = T.tBodies && T.tBodies[0];
      return !!b && b.rows.length >= MIN_FILAS;
    });
  }

  var pendiente = null;
  function repasar(){
    if(pendiente) return;
    pendiente = setTimeout(function(){
      pendiente = null;
      try{ candidatas().forEach(armar); }catch(e){}
    }, 120);
  }

  function arrancar(){
    repasar();
    /* las tablas se vuelven a dibujar al ordenar y al filtrar: se vigila */
    try{
      new MutationObserver(function(muts){
        for(var i = 0; i < muts.length; i++){
          var t = muts[i].target;
          if(t && t.closest && t.closest('table')) { repasar(); return; }
        }
      }).observe(document.body, { childList:true, subtree:true });
    }catch(e){}
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
