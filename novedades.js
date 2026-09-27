/* ════════════════════════════════════════════════════════════════════════
   NAFELS VOLEY · LA CAMPANA DE NOVEDADES
   ------------------------------------------------------------------------
   Para que el jugador que abre la app sepa, de una, que hay algo nuevo
   para mirar: entrenamientos y partidos cargados, objetivos o foco de la
   semana que le pusiste, y cambios en el calendario.

   TRES DECISIONES QUE CONVIENE ENTENDER ANTES DE TOCAR ESTE ARCHIVO
   ------------------------------------------------------------------------
   1) NADIE ESCRIBE AVISOS. La campana no lee una lista de avisos que haya
      que cargar a mano: mira los datos que ya estan y se da cuenta sola.
      Asi no hay forma de olvidarse de avisar, y no hay una pantalla mas
      que mantener.

   2) SE COMPARA POR FIRMA, NO POR FECHA. Guardar "la ultima vez que
      entraste" y mostrar lo posterior no sirve: si le cargas un objetivo
      hoy y el ya entro hoy, no se entera hasta manana. En vez de eso se
      guarda una FIRMA de cada fuente -por ejemplo "13 entrenamientos y 4
      partidos"- y si la firma cambio, hay algo nuevo. Ademas la
      diferencia de numeros dice CUANTO ("2 entrenamientos nuevos").

      Por eso la firma de los entrenamientos NO incluye la fecha de
      generado: ese sello cambia cada vez que se corre HACER_TODO aunque
      no haya una sesion nueva, y la campana estaria prendida siempre.

   3) LO VISTO SE GUARDA EN EL APARATO, no en la base. Un jugador solo
      puede escribir en seis caminos de Firebase (wellness, pesos, rm,
      prep_hist, notas, obs), asi que guardarlo en la base seria pelear
      con las reglas. Y ademas es lo correcto: "ya lo vi" es de cada
      telefono, no de la cuenta.

   LA CAMPANA SOLO APARECE SI HAY ALGO NUEVO. Cuando no hay nada, no se
   dibuja: asi el boton no es un adorno mas, es una senal.

   Se carga desde el final de ayuda.js, que ya esta en las 28 pantallas.

   (c) 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  if(window.__VB_NOV) return; window.__VB_NOV = 1;

  /* ── Pantallas donde la campana estorba ──────────────────────────────
     El panel en vivo y la camara se usan durante el partido, con el
     entrenador apurado: ahi no va a aparecer nada. */
  var ARCH = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var EXCLUIR = ['panel_vivo.html','panel_voley.html','camara.html','pizarron.html',
                 'recuperar.html','prueba_delay.html','diagnostico.html','revisar.html'];
  if(EXCLUIR.indexOf(ARCH) >= 0) return;

  /* ── Idioma ──────────────────────────────────────────────────────────
     Mismo patron que el plan de desarrollo: textos propios del archivo,
     sin tocar lang.js, que pesa medio mega. */
  var LANG = 'es';
  try{ LANG = (typeof getLang === 'function') ? getLang() : (localStorage.getItem('vb_lang') || 'es'); }catch(e){}
  if(['es','en','de'].indexOf(LANG) < 0) LANG = 'es';

  var UI = {
    es:{ tit:'Novedades', nada:'Nada nuevo por ahora', visto:'Listo, lo vi',
         ent:function(n){ return n + (n===1 ? ' entrenamiento nuevo' : ' entrenamientos nuevos'); },
         par:function(n){ return n + (n===1 ? ' partido nuevo' : ' partidos nuevos'); },
         entSub:'Ya están las estadísticas',
         parSub:'Ya están las estadísticas',
         obj:function(n){ return n + (n===1 ? ' objetivo nuevo' : ' objetivos nuevos'); },
         objSub:'En tu plan de desarrollo',
         foco:'Nuevo foco de la semana', focoSub:'Tu entrenador marcó en qué enfocarte',
         cal:'Cambios en el calendario', calSub:'Hay partidos o entrenamientos nuevos',
         abrir:'Abrir' },
    en:{ tit:'What’s new', nada:'Nothing new right now', visto:'Got it',
         ent:function(n){ return n + (n===1 ? ' new training' : ' new trainings'); },
         par:function(n){ return n + (n===1 ? ' new match' : ' new matches'); },
         entSub:'The stats are in', parSub:'The stats are in',
         obj:function(n){ return n + (n===1 ? ' new goal' : ' new goals'); },
         objSub:'In your development plan',
         foco:'New focus of the week', focoSub:'Your coach set what to focus on',
         cal:'Calendar changes', calSub:'New matches or trainings',
         abrir:'Open' },
    de:{ tit:'Neuigkeiten', nada:'Nichts Neues im Moment', visto:'Alles klar',
         ent:function(n){ return n + (n===1 ? ' neues Training' : ' neue Trainings'); },
         par:function(n){ return n + (n===1 ? ' neues Spiel' : ' neue Spiele'); },
         entSub:'Die Statistiken sind da', parSub:'Die Statistiken sind da',
         obj:function(n){ return n + (n===1 ? ' neues Ziel' : ' neue Ziele'); },
         objSub:'In deinem Entwicklungsplan',
         foco:'Neuer Fokus der Woche', focoSub:'Dein Trainer hat den Fokus gesetzt',
         cal:'Änderungen im Kalender', calSub:'Neue Spiele oder Trainings',
         abrir:'Öffnen' }
  };
  function L(){ return UI[LANG] || UI.es; }

  /* ── Quien esta mirando ──────────────────────────────────────────────
     El numero de camiseta puede tardar: firebase.js lo trae de la base y
     recien ahi avisa con el evento 'vb-rol-listo'. Por eso se vuelve a
     mirar cuando llega. */
  function rol(){ try{ return (localStorage.getItem('vb_role')||'').toLowerCase(); }catch(e){ return ''; } }
  function mio(){ try{ return (localStorage.getItem('vb_player_num')||'').trim(); }catch(e){ return ''; } }
  function esJugador(){ return rol() === 'player'; }

  /* ── Lo visto, guardado en el aparato ────────────────────────────────
     Una firma y un numero por fuente. Si el aparato no deja guardar
     -navegacion privada- la campana simplemente no molesta mas de una vez
     por carga, que es lo menos malo que puede pasar. */
  var CLAVE = 'vb_novedades_v1';
  function leerVisto(){
    try{ return JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; }catch(e){ return {}; }
  }
  function guardarVisto(o){
    try{ localStorage.setItem(CLAVE, JSON.stringify(o)); }catch(e){}
  }
  var VISTO = leerVisto();

  /* ════════════════════════════════════════════════════════════════════
     LAS FUENTES
     Cada una avisa con cb({sig, n, ...}) o con cb(null) si no pudo.
     ════════════════════════════════════════════════════════════════════ */

  /* ── 1) Entrenamientos y partidos ────────────────────────────────────
     La pantalla del jugador y el menu ya cargan datos_historial.js: ahi
     sale gratis. En las demas no se carga -son 350 KB- asi que se pide el
     archivo UNA sola vez por publicacion: primero un HEAD, que devuelve
     solo los encabezados, y si la fecha del archivo es la misma que la
     guardada, no se baja nada. */
  var URL_HIST = 'datos_historial.js';
  function deObjeto(H){
    var e=0, p=0;
    (H.entrenamientos || []).forEach(function(s){ if(s && s.tipo === 'P') p++; else if(s) e++; });
    return {e:e, p:p};
  }
  function deTexto(t){
    var re = /"fecha":\s*"(\d\d\/\d\d\/\d{4})",\s*"tipo":\s*"([EP])"/g, m, e=0, p=0;
    while((m = re.exec(t))){ if(m[2] === 'P') p++; else e++; }
    return {e:e, p:p};
  }
  function fuenteSesiones(cb){
    try{
      if(window.HISTORIAL_DATA && window.HISTORIAL_DATA.entrenamientos){
        return cb(deObjeto(window.HISTORIAL_DATA));
      }
    }catch(e){}
    if(typeof fetch !== 'function') return cb(null);

    var guardado = null;
    try{ guardado = JSON.parse(localStorage.getItem('vb_nov_hist') || 'null'); }catch(e){}

    function bajar(sello){
      fetch(URL_HIST).then(function(r){ return r.ok ? r.text() : null; })
        .then(function(t){
          if(!t) return cb(guardado ? guardado.d : null);
          var d = deTexto(t);
          try{ localStorage.setItem('vb_nov_hist', JSON.stringify({v:sello, d:d})); }catch(e){}
          cb(d);
        })
        .catch(function(){ cb(guardado ? guardado.d : null); });
    }

    fetch(URL_HIST, {method:'HEAD'}).then(function(r){
      var sello = (r.headers.get('last-modified') || r.headers.get('etag') || '');
      if(sello && guardado && guardado.v === sello) return cb(guardado.d);
      bajar(sello);
    }).catch(function(){ bajar(''); });
  }

  /* ── 2) El plan de desarrollo del jugador ────────────────────────────
     Solo para jugadores: al entrenador no le sirve que le avisen de los
     objetivos que acaba de cargar el mismo.
     La firma junta cuantos objetivos hay y cuales estan en el foco, asi
     que cambiar el foco cuenta como novedad aunque no haya objetivos
     nuevos. */
  function fuentePlan(cb){
    var num = mio();
    if(!esJugador() || !num || typeof fbGet !== 'function') return cb(null);
    var contestado = false;
    fbGet('plan_desarrollo/' + num, function(d){
      var items = (d && d.items) || [];
      var foco = items.filter(function(i){ return i && i.foco; })
                      .map(function(i){ return i.id; }).sort().join(',');
      var r = {n:items.length, foco:foco};
      contestado = true;
      cb(r);
    });
    /* fbGet contesta por callback y puede no contestar nunca si no hay red */
    setTimeout(function(){ if(!contestado) cb(null); }, 4000);
  }

  /* ── 3) El calendario ────────────────────────────────────────────────
     Cada partido y cada entrenamiento del calendario trae un id que es el
     momento en que se creo. El mas alto, mas la cantidad, alcanza para
     saber si alguien agrego o saco algo. */
  function fuenteCalendario(cb){
    if(typeof fbGet !== 'function') return cb(null);
    var faltan = 2, tot = 0, ultimo = 0, hubo = false;
    function trozo(d){
      var l = Array.isArray(d) ? d : (d ? Object.keys(d).map(function(k){ return d[k]; }) : []);
      l.forEach(function(x){
        if(!x) return;
        hubo = true; tot++;
        var id = parseInt(x.id, 10);
        if(id > ultimo) ultimo = id;
      });
    }
    var listo = false;
    function fin(){
      if(listo) return; listo = true;
      cb(hubo ? {n:tot, ultimo:ultimo} : null);
    }
    fbGet('calendario/partidos', function(d){ trozo(d); if(--faltan <= 0) fin(); });
    fbGet('calendario/entrenamientos', function(d){ trozo(d); if(--faltan <= 0) fin(); });
    setTimeout(fin, 4000);
  }

  /* ════════════════════════════════════════════════════════════════════
     JUNTAR TODO Y DECIDIR QUE ES NOVEDAD
     ════════════════════════════════════════════════════════════════════ */
  var NOV = [];      /* lo que se va a mostrar */
  var FIRMAS = {};   /* lo que se guarda cuando dice "lo vi" */

  function sumar(icono, color, titulo, bajada, url){
    NOV.push({ic:icono, col:color, t:titulo, s:bajada, u:url});
  }

  function juntar(){
    var pendientes = 3;
    function unaMenos(){ if(--pendientes <= 0) pintar(); }

    fuenteSesiones(function(d){
      if(d){
        var sig = d.e + '/' + d.p;
        FIRMAS.ses = sig;
        var ant = VISTO.ses;
        if(ant && ant.sig !== sig){
          var de = d.e - (ant.e || 0), dp = d.p - (ant.p || 0);
          if(dp > 0) sumar('🏐', '#0B84C4', L().par(dp), L().parSub, 'historial_voley.html');
          if(de > 0) sumar('🏋', '#0E9F6E', L().ent(de), L().entSub, 'historial_voley.html');
          /* si bajaron numeros -se borro una sesion- no se avisa nada,
             pero la firma se actualiza igual al marcar como visto */
        }
        FIRMAS.sesD = {sig:sig, e:d.e, p:d.p};
      }
      unaMenos();
    });

    fuentePlan(function(d){
      if(d){
        var sig = d.n + '|' + d.foco;
        var ant = VISTO.plan;
        if(ant && ant.sig !== sig){
          var dn = d.n - (ant.n || 0);
          if(dn > 0) sumar('🎯', '#CE7C18', L().obj(dn), L().objSub,
                           'plan_desarrollo.html?num=' + mio());
          if(d.foco && d.foco !== (ant.foco || ''))
            sumar('★', '#f59e0b', L().foco, L().focoSub,
                  'plan_desarrollo.html?num=' + mio());
        }
        FIRMAS.planD = {sig:sig, n:d.n, foco:d.foco};
      }
      unaMenos();
    });

    fuenteCalendario(function(d){
      if(d){
        var sig = d.n + '@' + d.ultimo;
        var ant = VISTO.cal;
        if(ant && ant.sig !== sig)
          sumar('📅', '#8B5CF6', L().cal, L().calSub, 'calendario.html');
        FIRMAS.calD = {sig:sig, n:d.n, ultimo:d.ultimo};
      }
      unaMenos();
    });
  }

  /* La PRIMERA vez que alguien abre la app no hay firmas guardadas: si se
     mostrara todo como nuevo, la campana arrancaria gritando. Se guarda el
     estado de arranque en silencio y se avisa desde la proxima. */
  function primeraVez(){
    return !VISTO.ses && !VISTO.plan && !VISTO.cal;
  }

  /* ════════════════════════════════════════════════════════════════════
     EL BOTON Y EL PANEL
     Las cuatro esquinas de abajo ya estan ocupadas (el chat, el signo de
     pregunta de la ayuda, el escudo y el cartel de avisos), asi que la
     campana va en la misma columna del chat, un escalon mas arriba.
     ════════════════════════════════════════════════════════════════════ */
  function estilos(){
    if(document.getElementById('vb-nov-css')) return;
    var st = document.createElement('style');
    st.id = 'vb-nov-css';
    st.textContent =
      '#vb-nov-btn{position:fixed;right:26px;bottom:138px;width:42px;height:42px;border-radius:50%;' +
        'background:#0d0e1a;border:1px solid rgba(255,255,255,.14);color:#e2e8f0;font-size:19px;' +
        'display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:8998;' +
        'box-shadow:0 4px 14px rgba(0,0,0,.45)}' +
      '#vb-nov-btn:hover{border-color:#E8192C}' +
      '#vb-nov-pt{position:absolute;top:-3px;right:-3px;min-width:18px;height:18px;border-radius:9px;' +
        'background:#E8192C;color:#fff;font-size:11px;font-weight:800;line-height:18px;text-align:center;' +
        'padding:0 4px;font-family:Arial,Helvetica,sans-serif}' +
      '#vb-nov-pan{position:fixed;right:26px;bottom:188px;width:290px;max-width:calc(100vw - 40px);' +
        'background:#0d0e1a;border:1px solid rgba(255,255,255,.10);border-radius:14px;z-index:8998;' +
        'box-shadow:0 10px 34px rgba(0,0,0,.6);overflow:hidden;' +
        'font-family:"Barlow Condensed",system-ui,sans-serif;color:#e2e8f0}' +
      '#vb-nov-pan .nh{display:flex;align-items:center;padding:11px 14px;border-bottom:1px solid rgba(255,255,255,.07);' +
        'font-family:"Bebas Neue","Barlow Condensed",sans-serif;font-size:15px;letter-spacing:2px}' +
      '#vb-nov-pan .nx{margin-left:auto;color:#64748b;cursor:pointer;font-size:16px;line-height:1;padding:2px 4px}' +
      '#vb-nov-pan .nx:hover{color:#e2e8f0}' +
      '#vb-nov-pan a.ni{display:flex;gap:10px;align-items:flex-start;padding:11px 14px;text-decoration:none;' +
        'color:inherit;border-bottom:1px solid rgba(255,255,255,.05)}' +
      '#vb-nov-pan a.ni:last-of-type{border-bottom:none}' +
      '#vb-nov-pan a.ni:hover{background:rgba(255,255,255,.04)}' +
      '#vb-nov-pan .nic{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;' +
        'justify-content:center;font-size:14px;flex-shrink:0}' +
      '#vb-nov-pan .ncol{flex:1;min-width:0}' +
      '#vb-nov-pan .nt{display:block;font-size:13.5px;font-weight:700;line-height:1.25}' +
      '#vb-nov-pan .ns{display:block;font-size:11.5px;color:#64748b;margin-top:2px;line-height:1.25}' +
      '#vb-nov-pan .nv{display:block;width:100%;background:none;border:none;border-top:1px solid rgba(255,255,255,.07);' +
        'color:#64748b;font-family:inherit;font-size:12px;font-weight:700;padding:10px;cursor:pointer;letter-spacing:.5px}' +
      '#vb-nov-pan .nv:hover{color:#e2e8f0}' +
      '@media print{#vb-nov-btn,#vb-nov-pan{display:none}}' +
      '@media(max-width:420px){#vb-nov-btn{right:20px;bottom:132px;width:38px;height:38px;font-size:17px}' +
        '#vb-nov-pan{right:20px;bottom:178px}}';
    document.head.appendChild(st);
  }

  function marcarVisto(){
    if(FIRMAS.sesD)  VISTO.ses  = FIRMAS.sesD;
    if(FIRMAS.planD) VISTO.plan = FIRMAS.planD;
    if(FIRMAS.calD)  VISTO.cal  = FIRMAS.calD;
    guardarVisto(VISTO);
    cerrar();
    var b = document.getElementById('vb-nov-btn');
    if(b && b.parentNode) b.parentNode.removeChild(b);
  }

  function cerrar(){
    var p = document.getElementById('vb-nov-pan');
    if(p && p.parentNode) p.parentNode.removeChild(p);
    document.removeEventListener('click', afuera, true);
  }
  function afuera(ev){
    var p = document.getElementById('vb-nov-pan'), b = document.getElementById('vb-nov-btn');
    if(p && !p.contains(ev.target) && b && !b.contains(ev.target)) cerrar();
  }

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }

  function abrir(){
    if(document.getElementById('vb-nov-pan')){ cerrar(); return; }
    var p = document.createElement('div');
    p.id = 'vb-nov-pan';
    p.setAttribute('data-notr', '');   /* que el traductor no pise los numeros */
    var h = '<div class="nh">' + esc(L().tit) + '<span class="nx" id="vb-nov-x">✕</span></div>';
    NOV.forEach(function(n){
      h += '<a class="ni" href="' + esc(n.u) + '">' +
             '<span class="nic" style="background:' + n.col + '22;color:' + n.col + '">' + n.ic + '</span>' +
             '<span class="ncol"><span class="nt">' + esc(n.t) + '</span>' +
             '<span class="ns">' + esc(n.s) + '</span></span></a>';
    });
    h += '<button class="nv" id="vb-nov-v">' + esc(L().visto) + '</button>';
    p.innerHTML = h;
    document.body.appendChild(p);
    document.getElementById('vb-nov-x').onclick = cerrar;
    document.getElementById('vb-nov-v').onclick = marcarVisto;
    /* al entrar a una novedad se da por vista, sin borrar las otras */
    Array.prototype.forEach.call(p.querySelectorAll('a.ni'), function(a){
      a.addEventListener('click', function(){
        if(FIRMAS.sesD)  VISTO.ses  = FIRMAS.sesD;
        if(FIRMAS.planD) VISTO.plan = FIRMAS.planD;
        if(FIRMAS.calD)  VISTO.cal  = FIRMAS.calD;
        guardarVisto(VISTO);
      });
    });
    setTimeout(function(){ document.addEventListener('click', afuera, true); }, 0);
  }

  function pintar(){
    /* la primera vez se guarda el estado en silencio */
    if(primeraVez()){
      if(FIRMAS.sesD)  VISTO.ses  = FIRMAS.sesD;
      if(FIRMAS.planD) VISTO.plan = FIRMAS.planD;
      if(FIRMAS.calD)  VISTO.cal  = FIRMAS.calD;
      guardarVisto(VISTO);
      return;
    }
    if(!NOV.length) return;              /* sin novedades no se dibuja nada */
    if(document.getElementById('vb-nov-btn')) return;
    estilos();
    var b = document.createElement('div');
    b.id = 'vb-nov-btn';
    b.title = L().tit;
    b.innerHTML = '🔔<span id="vb-nov-pt">' + NOV.length + '</span>';
    b.onclick = abrir;
    document.body.appendChild(b);
  }

  /* ── Arranque ────────────────────────────────────────────────────────
     Se espera un momento para no competir con lo que la pantalla esta
     dibujando, y se vuelve a mirar si el numero de camiseta llega tarde
     desde la base. */
  var arrancado = false;
  function arrancar(){
    if(arrancado) return; arrancado = true;
    try{ juntar(); }catch(e){ /* la campana nunca rompe la pantalla */ }
  }
  function alCargar(){ setTimeout(arrancar, 1200); }

  try{
    window.addEventListener('vb-rol-listo', function(){
      if(arrancado) return;
      setTimeout(arrancar, 300);
    });
  }catch(e){}

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', alCargar);
  else alCargar();

  /* por si alguna vez se quiere abrir desde otro lado */
  window.vbNovedades = function(){ if(NOV.length) abrir(); };
})();
