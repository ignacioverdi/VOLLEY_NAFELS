/* ═══════════════════════════════════════════════════════════════════════════
   vs_tabla.js · LA TABLA DE LA APP
   ---------------------------------------------------------------------------
   QUE HACE
   Le da a las tablas de datos el mismo lenguaje que el resto de la app:
   tinta blanca, cero semaforo, una barrita debajo de cada numero que dice
   donde esta esa fila respecto de las demas en esa columna, y UN solo acento:
   la fila que tocas se enciende en rojo entera.

   POR QUE EN JAVASCRIPT Y NO SOLO EN CSS
   Tres cosas no se pueden hacer con CSS: medir el maximo de cada columna para
   dibujar la barra, pasar el color del club del nombre a un punto, y volver a
   armar todo cuando la pantalla redibuja la tabla al ordenar o filtrar.

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
  var RX_NUM = new RegExp('([-+]?[0-9]+(?:[.,][0-9]+)?)\\s*%');
  var RX_SOLO = new RegExp('^[-+]?[0-9]+(?:[.,][0-9]+)?$');

  function num(td){
    var t = (td.textContent || '').replace(/ /g, ' ').trim();
    var m = t.match(RX_NUM);
    if(m) return parseFloat(String(m[1]).replace('+','').replace(',','.'));
    /* un numero pelado tambien sirve, pero solo si la celda es ESE numero y
       nada mas: asi un "(455)" suelto o un año no se cuelan como dato. */
    var s = t.replace(/\s/g,'');
    if(RX_SOLO.test(s)) return parseFloat(s.replace('+','').replace(',','.'));
    return null;
  }

  function esRanking(filas){
    /* la primera columna es un puesto si en todas las filas es un numero corto */
    for(var i = 0; i < filas.length; i++){
      var c = filas[i].children[0]; if(!c) return false;
      var t = (c.textContent || '').trim();
      if(!/^[0-9]{1,3}$/.test(t)) return false;
    }
    return true;
  }

  function armar(T){
    var cuerpo = T.tBodies && T.tBodies[0]; if(!cuerpo) return;
    var filas = [].slice.call(cuerpo.rows).filter(function(tr){ return tr.cells.length >= MIN_COLS; });
    if(filas.length < MIN_FILAS) return;

    T.classList.add('vs-tabla');
    var w = T.closest('.table-wrap') || T.parentElement;
    if(w && w !== document.body) w.classList.add('vs-tablaw');

    var rank = esRanking(filas);
    T.classList.toggle('vs-conpuesto', rank);
    var prim = rank ? 1 : 0;              /* columna del nombre */

    /* el color del club pasa del nombre a un punto */
    filas.forEach(function(tr){
      var n = tr.cells[prim] && tr.cells[prim].querySelector('.t-name');
      if(n && !n.dataset.vsClub){
        var c = (n.getAttribute('style') || '').match(/color\s*:\s*([^;]+)/);
        if(c) n.style.setProperty('--club', c[1].trim());
        n.dataset.vsClub = '1';
      }
    });

    /* una barra por columna numerica */
    var nCols = filas[0].cells.length;
    for(var c = prim + 1; c < nCols; c++){
      var tds = [], vs = [];
      for(var i = 0; i < filas.length; i++){
        var td = filas[i].cells[c]; if(!td) continue;
        var v = num(td);
        if(v !== null){ tds.push([td, v]); vs.push(v); }
      }
      /* si mas de un tercio de la columna no es numero, no es columna de dato */
      if(vs.length < Math.max(2, Math.ceil(filas.length * 0.66))){
        for(var k = 0; k < filas.length; k++){
          var q = filas[k].cells[c], b0 = q && q.querySelector('.vs-bar');
          if(b0) b0.remove();
        }
        continue;
      }
      var mx = Math.max.apply(null, vs), mn = Math.min.apply(null, vs);
      var rango = (mx - mn) || 1, lo = mn - rango * 0.30, hi = mx + rango * 0.04;
      tds.forEach(function(p){
        var td = p[0], v = p[1];
        var pct = Math.max(5, Math.min(100, Math.round((v - lo) / (hi - lo) * 100)));
        td.classList.toggle('vs-neg', v < 0);
        var b = td.querySelector('.vs-bar');
        if(!b){ b = document.createElement('i'); b.className = 'vs-bar'; b.innerHTML = '<s></s>'; td.appendChild(b); }
        b.firstChild.style.width = pct + '%';
      });
    }

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
        if(!tr || !cuerpo.contains(tr)) return;
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
