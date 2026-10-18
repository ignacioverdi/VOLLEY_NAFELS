/* ============================================================================
   FILTRO PRETEMPORADA / OFICIAL  —  para todo el sistema
   ----------------------------------------------------------------------------
   Los amistosos de preparacion viven en la misma carpeta que los partidos que
   cuentan —y esta bien que asi sea, nadie quiere andar moviendo archivos— pero
   mezclados ensucian cualquier promedio: cuatro amistosos contra equipos de
   otra categoria mueven la eficacia de la temporada entera.

   Game Plan ya separaba por fase. Esto hace lo mismo para las pantallas que
   trabajan con sesiones (dashboard y analisis), con un solo criterio y una
   sola fuente: fases_temporada.json.

   VALORES:  'todo' | 'PRE' (pretemporada) | 'OF' (oficial)

   DE DONDE SALE, en este orden:
     1. el parametro ?fase= de la direccion  (asi viaja en un link)
     2. lo ultimo que se eligio, guardado en el navegador
     3. 'todo'

   Mientras fases_temporada.json no termine de cargar, NO se filtra nada y la
   barra no aparece: una pantalla a medias es peor que una sin el filtro.
   Si una temporada no figura en el archivo, todos sus partidos cuentan como
   oficiales y la barra tampoco aparece. O sea: no agregar nada es exactamente
   como funcionaba antes.
   ========================================================================== */
(function(){
  'use strict';
  var CLAVE = 'vb_fase';
  var TABLA = null;          /* lo de fases_temporada.json, cuando llegue */

  function _norm(v){
    if(v===null || v===undefined) return null;
    v = String(v).trim().toLowerCase();
    if(v==='pre' || v==='pretemporada')            return 'PRE';
    if(v==='of'  || v==='ofi' || v==='oficial')    return 'OF';
    if(v==='todo'|| v==='todos' || v==='all')      return 'todo';
    return null;
  }

  /* La fecha puede venir como 2026-10-17 o como 17/10/2026: las dos formas
     andan dando vueltas por el sistema. Se devuelve siempre aaaa-mm-dd. */
  function _iso(f){
    var s = String(f==null?'':f).trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(m) return m[1]+'-'+m[2]+'-'+m[3];
    m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if(m) return m[3]+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[1]).slice(-2);
    return '';
  }

  /* De julio a junio: un partido de septiembre de 2026 es de la 2026/27. */
  function _temporadaDe(iso){
    var y = parseInt(iso.slice(0,4),10), mes = parseInt(iso.slice(5,7),10);
    if(!y) return '';
    var a = (mes>=7) ? y : (y-1);
    return a + '/' + ('0'+((a+1)%100)).slice(-2);
  }

  /* 'PRE' | 'OF'. Sin tabla, o sin temporada cargada, todo es oficial: asi
     nada se esconde por un archivo que no llego. */
  window.vbFaseDe = function(fecha){
    if(!TABLA) return 'OF';
    var iso = _iso(fecha); if(!iso) return 'OF';
    var cfg = TABLA[_temporadaDe(iso)];
    if(!cfg || !cfg.oficial_desde) return 'OF';
    return (iso < String(cfg.oficial_desde)) ? 'PRE' : 'OF';
  };

  window.vbFaseListo = function(){ return !!TABLA; };

  window.vbFase = function(){
    try{ var u=_norm(new URLSearchParams(location.search).get('fase')); if(u) return u; }catch(e){}
    try{ var g=_norm(localStorage.getItem(CLAVE)); if(g) return g; }catch(e){}
    return 'todo';
  };

  window.vbSetFase = function(v){
    var f = _norm(v) || 'todo';
    try{ localStorage.setItem(CLAVE, f); }catch(e){}
    try{
      var u = new URL(location.href);
      if(f==='todo') u.searchParams.delete('fase'); else u.searchParams.set('fase', f);
      history.replaceState(null, '', u.toString());
    }catch(e){}
    _pintar();
    try{ if(typeof window.vbAlCambiarFase === 'function') window.vbAlCambiarFase(f); }catch(e){}
  };

  /* Deja una lista de sesiones con solo las de la fase elegida.
     getFecha dice de donde sacar la fecha de cada una; por defecto, .fecha */
  window.vbFiltrarPorFase = function(lista, getFecha){
    var f = window.vbFase();
    if(!TABLA || !lista || !lista.length || f==='todo') return lista || [];
    var g = getFecha || function(s){ return s && s.fecha; };
    return lista.filter(function(s){ return window.vbFaseDe(g(s)) === f; });
  };

  /* ¿Vale la pena mostrar la barra? Solo si hay algo de pretemporada: sin
     nada que separar, un filtro mas es ruido. */
  window.vbHayPre = function(lista, getFecha){
    if(!TABLA || !lista || !lista.length) return false;
    var g = getFecha || function(s){ return s && s.fecha; };
    for(var i=0;i<lista.length;i++) if(window.vbFaseDe(g(lista[i]))==='PRE') return true;
    return false;
  };

  /* Suma ?fase= a un link, para que la eleccion viaje al hacer clic. */
  window.vbLinkFase = function(href){
    var f = window.vbFase();
    if(!href || f==='todo') return href;
    return href + (href.indexOf('?')>=0 ? '&' : '?') + 'fase=' + f;
  };

  /* ── La barra de botones ─────────────────────────────────────────────── */
  var OPCIONES = [['todo','Todo'],['PRE','Pretemporada'],['OF','Oficial']];

  function _pintar(){
    var f = window.vbFase();
    var bs = document.querySelectorAll('[data-vbfase]');
    for(var i=0;i<bs.length;i++){
      var on = bs[i].getAttribute('data-vbfase') === f;
      bs[i].style.background  = on ? 'rgba(232,25,44,.16)' : 'transparent';
      bs[i].style.borderColor = on ? 'rgba(232,25,44,.55)' : 'rgba(148,163,184,.25)';
      bs[i].style.color       = on ? '#fca5a5' : '#94a3b8';
      bs[i].style.fontWeight  = on ? '800' : '600';
    }
  }
  window.vbPintarFase = _pintar;

  /* destino: id o elemento donde colgarla. lista/getFecha: para decidir si
     corresponde mostrarla. Si ya existe, solo se repinta. */
  window.vbBarraFase = function(destino, lista, getFecha){
    if(!TABLA) return false;
    if(lista && !window.vbHayPre(lista, getFecha)) return false;
    var ya = document.querySelector('[data-vbfase]');
    if(ya){ _pintar(); return true; }
    var cont = destino ? ((typeof destino==='string')
        ? (document.getElementById(destino) || document.querySelector(destino))
        : destino) : null;
    if(!cont) return false;
    var caja = document.createElement('span');
    caja.id = 'vb-barra-fase';
    caja.style.cssText = 'display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap;'+
      'margin-left:10px;font-family:Barlow Condensed,Arial,sans-serif;vertical-align:middle';
    var lbl = document.createElement('span');
    lbl.textContent = 'COMPETENCIA';
    lbl.style.cssText = 'font-size:10px;letter-spacing:2px;color:#64748b;margin-right:2px';
    caja.appendChild(lbl);
    OPCIONES.forEach(function(o){
      var b = document.createElement('button');
      b.type='button';
      b.setAttribute('data-vbfase', o[0]);
      b.textContent = o[1];
      b.style.cssText = 'cursor:pointer;border:1px solid;border-radius:8px;padding:5px 12px;'+
        'font-size:12px;letter-spacing:1px;text-transform:uppercase;background:transparent;font-family:inherit';
      b.onclick = function(){ window.vbSetFase(o[0]); };
      caja.appendChild(b);
    });
    cont.appendChild(caja);
    _pintar();
    return true;
  };

  /* ── La tabla de fases ───────────────────────────────────────────────── */
  function _cargar(){
    try{
      fetch('fases_temporada.json', {cache:'no-cache'})
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(j){
          if(!j || typeof j!=='object') return;
          var t={};
          Object.keys(j).forEach(function(k){
            if(k.charAt(0)==='_') return;          /* _leeme y notas */
            if(j[k] && j[k].oficial_desde) t[k]=j[k];
          });
          TABLA = t;
          try{ if(typeof window.vbAlLlegarFases==='function') window.vbAlLlegarFases(); }catch(e){}
        })
        .catch(function(){});
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', _cargar);
  else _cargar();
})();
