/* ══════════════════════════════════════════════════════════════════════════
   fixture_auto.js  ·  EL PROXIMO RIVAL SALE DEL CALENDARIO, SIEMPRE
   ══════════════════════════════════════════════════════════════════════════
   EL PROBLEMA QUE RESUELVE
   El proximo rival se guardaba en dos fotos fijas:

     1. proximo_rival.js   el archivo que viaja con la app
     2. el nodo "fixture"  la foto que deja el boton "⭐ Usar este fixture"

   Las dos quedan viejas solas: pasa el partido y siguen diciendo lo mismo.
   Asi, la app anunciaba un rival de hace meses aunque el calendario
   estuviera perfecto.

   QUE HACE
   Toma el proximo rival del CALENDARIO de la app, que es lo que el cuerpo
   tecnico mantiene al dia, y lo deja en window.FIXTURE_DATA. Ya no hay que
   apretar ningun boton ni volver a publicar: se juega el partido y al dia
   siguiente toda la app muestra el que viene.

   NO ROMPE NADA
   - Si el calendario no contesta (sin senal, sin permisos, offline), queda
     exactamente lo que habia antes: proximo_rival.js. Nunca borra ni vacia.
   - Lo unico que hace de mas es correr el archivo hacia adelante: si el
     partido que trae ya se jugo, pasa al primero que falta.
   - Para quien no lo cargue, nada cambia.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  if(window.VB_FIX_AUTO) return;        /* una sola vez por pagina */
  window.VB_FIX_AUTO = true;

  function hoy(){
    var d = new Date();
    return d.getFullYear() + '-' +
           ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
           ('0' + d.getDate()).slice(-2);
  }
  /* El mismo slug que usa el calendario, para que el enlace al game plan
     siga siendo el mismo: "Chênois" -> "chenois". */
  function slug(t){
    return (t || '').toString().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }
  function cond(p){
    var c = (p.condicion || p.cond || '').toString().toLowerCase();
    return c.indexOf('vis') >= 0 ? 'visitante' : 'local';
  }
  /* De una lista de partidos saca el fixture de lo que falta jugar.
     Sirve para los dos formatos: los del calendario (condicion) y los del
     archivo (cond). */
  function derivar(ps){
    if(!ps) return null;
    if(!(ps instanceof Array)){
      try{ ps = Object.keys(ps).map(function(k){ return ps[k]; }); }
      catch(e){ return null; }
    }
    var h = hoy();
    var fut = ps.filter(function(p){ return p && p.fecha && p.fecha >= h && p.rival; })
                .sort(function(a, b){ return a.fecha < b.fecha ? -1 : 1; });
    if(!fut.length) return null;
    var lista = fut.map(function(x){
      return { fecha: x.fecha, rival: x.rival,
               slug: (x.slug || slug(x.rival)), cond: cond(x) };
    });
    return { proximo: lista[0], fixture: lista };
  }
  /* Cada pagina dice como se vuelve a dibujar. Si no define ninguna de las
     dos, no pasa nada: el dato ya quedo puesto para cuando dibuje. */
  function repintar(){
    try{ if(window.pintarProximo)    window.pintarProximo();    }catch(e){}
    try{ if(window.vbFixtureCambio)  window.vbFixtureCambio();  }catch(e){}
  }
  function poner(fx, manda){
    if(!fx || !fx.proximo || !fx.proximo.rival) return false;
    var antes = window.FIXTURE_DATA && window.FIXTURE_DATA.proximo;
    window.FIXTURE_DATA = fx;
    if(manda) window.VB_FIX_CAL = true;   /* el calendario hablo: ya nadie lo pisa */
    if(!antes || antes.fecha !== fx.proximo.fecha || antes.rival !== fx.proximo.rival){
      repintar();
    }
    return true;
  }

  /* ── 1. el archivo, corrido hasta el primer partido que falta ────────── */
  try{
    var F = window.FIXTURE_DATA;
    if(F && F.fixture) poner(derivar(F.fixture), false);
  }catch(e){}

  /* ── 2. el calendario manda ──────────────────────────────────────────── */
  /* fbGet puede no existir todavia: en algunas pantallas este archivo se
     carga antes que firebase.js. Se espera un rato y si no aparece, se deja
     lo del archivo. */
  var intentos = 0;
  (function esperar(){
    if(window.fbGet){
      try{
        fbGet('calendario/partidos', function(ps){
          try{ poner(derivar(ps), true); }catch(e){}
        });
      }catch(e){}
      return;
    }
    if(++intentos > 40) return;          /* 10 segundos y se deja */
    setTimeout(esperar, 250);
  })();
})();
