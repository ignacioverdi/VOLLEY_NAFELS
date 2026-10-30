/* ═══════════════════════════════════════════════════════════════════════════
   vs_cab.js · EL ENCABEZADO DE TODA LA APP
   ---------------------------------------------------------------------------
   QUE PASABA
   Se midieron las 55 pantallas con el navegador, no leyendo el codigo. El
   resultado: 49 tenian encabezado y 7 no; las alturas iban de 27 px a 343 px;
   los titulos usaban 18 tamaños distintos, de 10 px a 58 px; y convivian
   cuatro tipografias —Bebas Neue en 38 pantallas, Barlow Condensed en 8,
   Bricolage Grotesque en 2 y JetBrains Mono, que es una fuente de codigo, en
   una—. Trece encabezados median menos de 50 px, o sea menos que la barra de
   navegacion que tienen encima.

   QUE HACE ESTE ARCHIVO
   Tres cosas que el CSS no puede hacer solo:
     1. Encontrar cual elemento ES el encabezado. Cada pantalla le puso un
        nombre distinto: .page-header, .header, .head, .top, .hdr, .hdr-in o
        un <header> propio.
     2. Encontrar cual texto ES el titulo, para poder unificar su tipografia.
        No hay una clase comun: se busca el texto mas grande de la barra que
        no sea un boton ni un enlace.
     3. Crear la barra en las 7 pantallas que no tienen ninguna, usando el
        <title> de la pagina.

   El alto, la tipografia y la foto los pone vs_estilo.css. Aca solo se marca
   QUIEN es cada cosa.

   APAGARLO SIN DESINSTALAR NADA
       localStorage.setItem('vs_estilo','off')  y recargar.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  try{ if((localStorage.getItem('vs_estilo') || '') === 'off') return; }catch(e){}
  if(window.VS_CAB) return; window.VS_CAB = 1;

  var SEL = 'header,.page-header,.header,.head,.top,.hdr-in,.hdr';
  /* No hay minimo de tamaño: en mi_juego el titulo real medía 10 px y estaba en
   JetBrains Mono. Si se lo descartaba por chico, se le inyectaba OTRO titulo al
   lado y la barra pasaba de 52 px a 103. Vale cualquier texto que no sea un
   control; solo se inyecta cuando no hay ninguno. */

  /* el titulo de la barra */
  function buscarTitulo(cab){
    /* Si hay un h1 o un h2, ESE es el titulo. */
    var h = cab.querySelector('h1,h2');
    if(h && (h.textContent || '').trim()) return h;

    /* Si no, se recorren los NODOS DE TEXTO, no los elementos. En el
       Dashboard el titulo "DASHBOARD ENTRENADOR" es un texto suelto al lado de
       un <i> con el emoji: no es un elemento hoja, asi que buscando elementos
       no aparecia y ganaba el "Actualizado: 29/10/2026" de la otra punta. */
    var cand = [];
    try{
      var w = document.createTreeWalker(cab, NodeFilter.SHOW_TEXT, null, false), n;
      while((n = w.nextNode())){
        var t = (n.nodeValue || '').trim();
        if(!t || t.length > 60) continue;
        /* al menos tres letras o numeros: un emoji solo no es un titulo */
        if(t.replace(/[^0-9A-Za-z\u00C0-\u024F]/g, '').length < 3) continue;
        var p = n.parentElement;
        if(!p || p.closest('button,a,select,input,label,textarea')) continue;
        var s = 0;
        try{ s = parseFloat(getComputedStyle(p).fontSize) || 0; }catch(e){}
        cand.push({ n:n, s:s, t:t });
      }
    }catch(e){}
    cand.sort(function(a, b){ return b.s - a.s; });

    /* El nombre del CLUB no sirve de titulo: en Bienvenida, Comparador y Alta
       de jugadores el texto mas grande de la barra era "NAFELS VOLEY", y un
       encabezado que dice lo mismo en las 55 pantallas no dice nada. Se pasa
       al siguiente candidato; si no queda ninguno, armar() pone el <title>. */
    function esElClub(t){
      var l = t.replace(/[\u00C0-\u024F]/g, function(c){
          return 'AAAAAAACEEEEIIIIDNOOOOO.OUUUUY..aaaaaaaceeeeiiiidnooooo.ouuuuy.y'
            .charAt(c.charCodeAt(0) - 192) || c; })
        .toUpperCase().replace(/[^A-Z]/g, '');
      return /^(AXPO)?(BIOGAS)?(VOLLEY)?NAFELS(VOLEY)?(VOLLEYBALL)?$/.test(l)
          || /^NAFELSVOLEYANALISIS/.test(l);
    }
    /* Pero se descarta SOLO si hay un reemplazo a la altura. En el Manual el
       titulo de portada ES "NAFELS VOLEY" a 58 px, y descartarlo ascendia un
       subtitulo de 14 px: el encabezado perdia su titulo de verdad. Regla: el
       reemplazo tiene que medir al menos el 60% del descartado. Si no lo hay,
       el nombre del club se queda, porque es lo que esa barra realmente dice.  */
    var mejor = null;
    if(cand.length){
      if(!esElClub(cand[0].t)){
        mejor = cand[0].n;
      }else{
        for(var k = 1; k < cand.length; k++){
          if(!esElClub(cand[k].t) && cand[k].s >= cand[0].s * 0.6){ mejor = cand[k].n; break; }
        }
        if(!mejor) mejor = cand[0].n;   /* no hay reemplazo digno: se queda el club */
      }
    }
    if(!mejor) return null;

    /* a un nodo de texto no se le puede poner clase: se lo envuelve */
    try{
      var sp = document.createElement('span');
      mejor.parentNode.insertBefore(sp, mejor);
      sp.appendChild(mejor);
      return sp;
    }catch(e){ return null; }
  }

  /* el nombre de la pantalla, sacado del <title> */
  function nombreDePantalla(){
    var t = (document.title || '').trim();
    /* "Dashboard Entrenador — NAFELS Voley" -> "Dashboard Entrenador" */
    t = t.split('—')[0].split('·')[0].split(' - ')[0].trim();
    return t || 'Volley-Stats';
  }

  /* para las 7 que no tienen barra: se les arma una */
  function crearBarra(){
    var d = document.createElement('div');
    d.className = 'vs-cab vs-cab-nueva';
    var t = document.createElement('div');
    t.className = 'vs-cab-tit';
    t.textContent = nombreDePantalla();
    d.appendChild(t);
    /* debajo de la barra de navegacion, si la pantalla la tiene */
    var nav = document.querySelector('body > nav');
    if(nav && nav.parentNode === document.body) nav.insertAdjacentElement('afterend', d);
    else document.body.insertBefore(d, document.body.firstChild);
    return d;
  }


  /* ═══════════════════════════════════════════════════════════════════════
     UNA SOLA BARRA ARRIBA
     -----------------------------------------------------------------------
     Hasta ahora cada pantalla mostraba DOS encabezados: la barra de menu
     (#vsn, de nav.js) y debajo la banda de marca con el escudo, los idiomas,
     el estado y la fecha. En la referencia hay una sola barra: marca + menu +
     idiomas + estado + fecha + temporada + avatar, y recien despues la banda
     de titulo de la pantalla.

     Aca NO se crea nada nuevo ni se duplica: los controles que ya existian se
     MUDAN enteros adentro de #vsn, con sus ids intactos, asi que lang.js,
     temporadas_menu.js y el reloj de la fecha siguen escribiendo donde
     siempre. En la portada, la banda de marca queda vacia y se esconde.
     ═══════════════════════════════════════════════════════════════════════ */
  function tr(s){
    try{ if(typeof translateString === 'function')
      return translateString(s, (typeof getLang === 'function' ? getLang() : 'es')); }catch(e){}
    return s;
  }
  var AVA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M12 12a4 4 0 100-8 4 4 0 000 8"/><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/></svg>';

  function barraUnica(){
    var vsn = document.getElementById('vsn');
    if(!vsn) return false;
    vsn.classList.add('vs-una');

    /* ── la marca ───────────────────────────────────────────────────────── */
    var m = vsn.querySelector('.marca');
    if(m && !m.dataset.vsUna){
      m.dataset.vsUna = '1';
      var sub = '';
      var cs = document.querySelector('.club-sub');
      if(cs) sub = (cs.textContent || '').trim();
      if(!sub) sub = tr('Sistema de Análisis · NLA Suiza 2026/27');
      var sp = m.querySelector('span');
      if(sp) sp.innerHTML = '<b>NAFELS <em>VOLEY</em></b><i class="vs-msub"></i>';
      var si = m.querySelector('.vs-msub');
      if(si) si.textContent = sub;
    }

    /* ── los controles que ya existen, mudados ──────────────────────────── */
    var der = vsn.querySelector('.der');
    if(der){
      var caja = der.querySelector('.vs-ctls');
      if(!caja){
        caja = document.createElement('span'); caja.className = 'vs-ctls';
        der.insertBefore(caja, der.firstChild);
      }
      ['#lang-wrap', '.live-badge', '#fecha-txt', '.fecha-txt',
       '#catSelGlobal', '#temp-menu-link'].forEach(function(sel){
        var e;
        try{ e = document.querySelector(sel); }catch(err){ return; }
        if(!e || caja.contains(e)) return;
        e.classList.add('vs-ctl');
        /* el boton de temporadas trae estilos propios en linea: se limpian
           para que tome los de la barra y no desentone */
        if(e.id === 'temp-menu-link' || e.id === 'catSelGlobal') e.removeAttribute('style');
        caja.appendChild(e);
      });
      /* lo que quede suelto en un .header-right huerfano (el selector de
         categoria llega solo y se plantaba entre la barra y el titulo) */
      [].slice.call(document.body.children).forEach(function(c){
        if(!c.classList || !c.classList.contains('header-right')) return;
        [].slice.call(c.children).forEach(function(h){ h.classList.add('vs-ctl'); caja.appendChild(h); });
        c.classList.add('vs-huerfano');
      });
      /* el avatar va siempre ultimo, antes del buscador */
      var av = der.querySelector('.vs-ava');
      if(!av){ av = document.createElement('span'); av.className = 'vs-ava';
        av.setAttribute('aria-hidden', 'true'); av.innerHTML = AVA; }
      caja.appendChild(av);
    }

    /* ── la tirita suelta de arriba ─────────────────────────────────────
       Algunas pantallas traen un renglon propio arriba de todo con el boton
       de volver y los idiomas. Los idiomas ya subieron a la barra; lo que
       queda (el volver) se mete adentro de la banda de titulo, como el
       "Volver al Hub" del tablero, y la tirita se esconde. */
    var cab0 = document.querySelector('.vs-cab');
    if(cab0){
      var ant = cab0.previousElementSibling;
      while(ant){
        var sig = ant.previousElementSibling;
        if(ant.id !== 'vsn' && !ant.dataset.vsTira){
          var alto = 0;
          try{ alto = ant.getBoundingClientRect().height; }catch(e){}
          var hijos = [].slice.call(ant.children);
          var soloEnlaces = hijos.length > 0 && hijos.every(function(h){
            return h.tagName === 'A' || h.tagName === 'BUTTON' || h.children.length === 0;
          });
          if(alto > 0 && alto < 64 && soloEnlaces){
            ant.dataset.vsTira = '1';
            hijos.forEach(function(h){ h.classList.add('vs-volver'); cab0.insertBefore(h, cab0.firstChild); });
            ant.classList.add('vs-huerfano');
          } else if(ant.dataset) ant.dataset.vsTira = '0';
        }
        ant = sig;
      }
    }

    /* ── la banda de marca de la portada ya no hace falta ───────────────── */
    var hd = document.querySelector('body > header');
    if(hd && hd.querySelector('.logo-wrap') && !hd.dataset.vsUna){
      hd.dataset.vsUna = '1';
      hd.classList.add('vs-cab-dupe');
    }
    /* en las pantallas de adentro, la columna derecha de la cabecera queda
       vacia: se esconde sola con :empty desde el CSS */
    return true;
  }


  /* ═══════════════════════════════════════════════════════════════════════
     UN SOLO JUEGO DE COLORES EN TODA LA APP
     -----------------------------------------------------------------------
     Cada pantalla se fue armando en su momento con el color que vino a mano:
     el naranja de "Cargar videos", el verde de la barra de progreso, el turquesa
     de los avisos, el violeta de los badges. Nada de eso esta en la referencia.

     No se puede arreglar por CSS: los colores estan escritos a mano adentro de
     cada pantalla, no salen de una variable comun. Aca se MIDE el color que
     termino teniendo cada boton y, si es un acento fuerte que no es el rojo de
     la marca, se lo repinta con el de la app.

     Lo que NO se toca, porque ahi el color es informacion y no decoracion:
     las baterias, las tablas, los graficos, los semaforos de wellness, las
     leyendas y el chip verde de "sistema activo".
     ═══════════════════════════════════════════════════════════════════════ */
  var NO_TOCAR = '#eq-objetivos,table,svg,.live-badge,.vs-leyenda,' +
    '[class*="bat"],[id*="bat"],[class*="semaforo"],[class*="readiness"],[class*="rd-"],' +
    '[class*="chart"],[class*="grafico"],[class*="legend"],[class*="leyenda"],' +
    '[class*="dbat"],#nv-rail,.nv-d-comp,[class*="badge-"],[class*="objetivo"]';

  /* devuelve el tono 0-360 si el color es un acento fuerte; si no, null */
  function tono(col){
    var m = String(col).match(/rgba?\(([^)]+)\)/); if(!m) return null;
    var p = m[1].split(',').map(parseFloat);
    var a = p.length > 3 ? p[3] : 1;
    if(a < 0.5) return null;
    var r = p[0]/255, g = p[1]/255, b = p[2]/255;
    var mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx - mn;
    if(mx < 0.34) return null;   /* oscuro: no es un acento */
    if(d < 0.20) return null;    /* gris o casi */
    var h;
    if(mx === r) h = 60 * (((g - b) / d) % 6);
    else if(mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if(h < 0) h += 360;
    return h;
  }
  /* el rojo y el magenta de la marca, y el cyan, se respetan */
  function esDeLaMarca(h){ return h === null || h >= 326 || h <= 14 || (h >= 180 && h <= 200); }

  function pintarAcentos(){
    var n = 0, cands = [];
    try{
      var els = document.querySelectorAll('button,a');
      for(var i = 0; i < els.length && n < 300; i++){
        var e = els[i];
        if(e.dataset.vsAc) continue;
        try{ if(e.closest(NO_TOCAR)) { e.dataset.vsAc = '0'; continue; } }catch(err){}
        var s = getComputedStyle(e);
        if(s.display === 'none') continue;
        /* SOLO el relleno macizo. El borde y la letra se dejan como estan:
           ahi el margen de error es grande y no vale la pena arriesgar una
           pantalla entera por un detalle. */
        var hb = tono(s.backgroundColor);
        if(hb !== null && !esDeLaMarca(hb)) cands.push({ el:e, h:Math.round(hb/30), p:e.parentElement });
        else e.dataset.vsAc = '0';
      }
      /* VARIOS BOTONES DE COLORES DISTINTOS JUNTOS SON UN CODIGO, NO ADORNO.
         En el panel de scouteo los botones de evaluacion (#, +, !, -, =)
         estan pintados a proposito: cada color dice una cosa. Si en un mismo
         contenedor hay dos o mas acentos de tonos distintos, se deja todo el
         grupo como esta. Un acento solo, o varios del mismo tono, si es
         decoracion y se repinta. */
      var grupos = [];
      cands.forEach(function(c){
        var g = null;
        for(var q = 0; q < grupos.length; q++) if(grupos[q].p === c.p){ g = grupos[q]; break; }
        if(!g){ g = { p: c.p, items: [], tonos: {} }; grupos.push(g); }
        g.items.push(c); g.tonos[c.h] = 1;
      });
      grupos.forEach(function(g){
        var codigo = (g.items.length >= 2 && Object.keys(g.tonos).length >= 2);
        g.items.forEach(function(c){
          if(codigo){ c.el.dataset.vsAc = '0'; return; }
          c.el.dataset.vsAc = '1'; c.el.classList.add('vs-acento'); n++;
        });
      });

      /* Las barras de progreso son el otro caso: una barra de carga es
         decoracion, pero varias barras de colores distintos en la misma
         pantalla son una escala (verde bien / ambar regular / rojo mal) y ahi
         el color ES el dato. Por eso solo se repinta cuando hay pocas y todas
         del mismo tono: eso es una barra de progreso, no una escala. */
      var cand = [], bs = document.querySelectorAll('div,span,i');
      for(var k = 0; k < bs.length && cand.length < 24; k++){
        var b = bs[k];
        if(b.dataset.vsBa || b.children.length) continue;
        try{ if(b.closest(NO_TOCAR)) { b.dataset.vsBa = '0'; continue; } }catch(err){}
        var c = b.getBoundingClientRect();
        if(c.height < 3 || c.height > 16 || c.width < 36) continue;
        var h2 = tono(getComputedStyle(b).backgroundColor);
        if(h2 === null || esDeLaMarca(h2)){ b.dataset.vsBa = '0'; continue; }
        cand.push({ el: b, h: Math.round(h2 / 30) });
      }
      var tonos = {};
      cand.forEach(function(x){ tonos[x.h] = 1; });
      if(cand.length && cand.length <= 4 && Object.keys(tonos).length === 1){
        cand.forEach(function(x){ x.el.dataset.vsBa = '1'; x.el.classList.add('vs-barra'); });
      } else cand.forEach(function(x){ x.el.dataset.vsBa = '0'; });
    }catch(e){}
    return n;
  }

  function armar(){
    var cab = document.querySelector(SEL);
    var creada = false;
    if(!cab){ cab = crearBarra(); creada = true; }
    if(!cab) return;

    cab.classList.add('vs-cab');

    /* MINIMO COMUN, NO MAXIMO. Solo las barras que estan por debajo del piso
       reciben alto y centrado; las que ya miden 80 px o mas conservan su caja
       exacta. En la primera version se les imponia el padding a todas y Game
       Plan bajaba de 103 a 89 y la tabla de la liga de 84 a 64: eso era poner
       un maximo, justo lo contrario de lo acordado. */
    function medir(){
      try{
        var alto = cab.getBoundingClientRect().height;
        /* SOLO SUMA, NUNCA SACA. Con toggle se armaba un vaiven: se agregaba
           la clase, la barra subia a 80, la medicion siguiente veia 80, la
           condicion daba falso y la clase se iba; la barra volvia a 27. */
        if(alto > 0 && alto < 80) cab.classList.add('vs-cab-chica');
        /* Las portadas de documento —el Manual y la Guia de scouteo— son
           bandas de 200 a 340 px pensadas para leerse como tapa. Con el titulo
           a 26 px quedaba MAS CHICO QUE SU PROPIO SUBTITULO. Misma tipografia
           y mismo estilo, escala de tapa. */
        if(alto >= 180) cab.classList.add('vs-cab-portada');
      }catch(e){}
    }
    medir();
    /* Y de nuevo cuando el titulo ya tomo su tamaño nuevo. La tabla de la liga
       medía 84 px con su titulo de 28 y quedaba en 79 con el de 26: un pelo por
       debajo del piso y sin subir, porque cuando se midio todavia estaba alta.
       El cambio de alto llega cuando TERMINA DE CARGAR Bebas Neue, asi que se
       vuelve a medir ahi —un setTimeout corto se adelantaba a la fuente— y una
       vez mas por las dudas. */
    setTimeout(medir, 120);
    try{ if(document.fonts && document.fonts.ready) document.fonts.ready.then(medir); }catch(e){}
    setTimeout(medir, 1200);

    if(!creada && !cab.querySelector('.vs-cab-tit')){
      var t = buscarTitulo(cab);
      if(t){
        t.classList.add('vs-cab-tit');
      }else{
        /* la barra existe pero no tiene titulo —jugador, alta_jugadores y
           mi_juego son asi: solo botones—. Se le pone el nombre de la
           pantalla al principio, para que ninguna quede sin decir que es. */
        var n = document.createElement('div');
        n.className = 'vs-cab-tit vs-cab-tit-puesta';
        n.textContent = nombreDePantalla();
        cab.insertBefore(n, cab.firstChild);
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LOS PANELES
     -----------------------------------------------------------------------
     En la referencia el panel es casi tan negro como la pagina: lo que lo
     separa es un BORDE SUPERIOR CLARO (#545D6C) contra los otros tres
     oscuros (#102935). Medido pixel a pixel. Ese solo detalle es el que le
     da volumen; sin el los paneles se ven planos.

     No hay una clase de panel comun en las 55 pantallas, asi que no se puede
     hacer por CSS. Aca se MIDE cada caja y se le pone .vs-pan solo si ya era
     un panel: borde propio, fondo propio y esquinas redondeadas. Si su borde
     tiene color a proposito —un panel destacado en rojo, por ejemplo— no se
     toca: se compara la saturacion del borde y los de color quedan afuera.  */
  function esNeutro(col){
    var m = String(col).match(/rgba?\(([^)]+)\)/);
    if(!m) return true;
    var p = m[1].split(',').map(parseFloat);
    var r = p[0], g = p[1], b = p[2];
    var max = Math.max(r,g,b), min = Math.min(r,g,b);
    return (max - min) < 42;        /* poca saturacion = borde neutro */
  }
  function pintarPaneles(){
    var cajas;
    try{ cajas = document.querySelectorAll('div,section,article,aside,form'); }catch(e){ return; }
    var n = 0;
    for(var i = 0; i < cajas.length && n < 400; i++){
      var el = cajas[i];
      if(el.dataset.vsPan) continue;
      try{
        if(el.closest('.vs-cab')) continue;
        if(el.closest('table')) continue;
        var s = getComputedStyle(el);
        if(s.display === 'none' || s.position === 'fixed') continue;
        /* Se midieron las pantallas: los paneles no traen borde, traen fondo
           y esquinas redondeadas. Ese es el criterio. Se dejan afuera los
           circulos (radio en %) y las pastillas (radio mayor que media
           altura), que no son paneles. */
        var rr = s.borderTopLeftRadius || '';
        if(rr.indexOf('%') >= 0) continue;
        var rad = parseFloat(rr) || 0;
        if(rad < 8 || rad > 28) continue;
        var bg = s.backgroundColor || '';
        if(!bg || bg === 'transparent' || /rgba\([^)]*,\s*0\s*\)$/.test(bg)) continue;
        var c = el.getBoundingClientRect();
        if(c.width < 190 || c.height < 54) continue;
        if(rad > c.height / 2) continue;
        el.dataset.vsPan = '1';
        el.classList.add('vs-pan');
        n++;
      }catch(e){}
    }
    return n;
  }

  /* el grano: un elemento propio, para no pisarle el ::after a nadie */
  function grano(){
    try{
      if(document.querySelector('.vs-grano')) return;
      var g = document.createElement('i');
      g.className = 'vs-grano'; g.setAttribute('aria-hidden','true');
      document.body.appendChild(g);
    }catch(e){}
  }

  function arrancar(){
    try{ armar(); }catch(e){}
    try{ barraUnica(); }catch(e){}
    try{ grano(); }catch(e){}
    /* nav.js, lang.js y temporadas_menu.js dibujan sus cosas cuando pueden:
       se vuelve a pasar unas veces hasta que esten todas adentro de la barra */
    [250, 800, 1800, 3500].forEach(function(ms){
      setTimeout(function(){ try{ barraUnica(); }catch(e){} }, ms);
    });
    /* los paneles, al cargar y de nuevo cuando la pantalla termino de dibujar */
    try{ pintarPaneles(); }catch(e){}
    try{ pintarAcentos(); }catch(e){}
    [700, 2200, 4500].forEach(function(ms){
      setTimeout(function(){ try{ pintarPaneles(); pintarAcentos(); }catch(e){} }, ms);
    });
    /* las pantallas dibujan botones despues de bajar los datos */
    try{
      var tt = null;
      new MutationObserver(function(){
        clearTimeout(tt); tt = setTimeout(function(){ try{ pintarAcentos(); }catch(e){} }, 300);
      }).observe(document.body, { childList:true, subtree:true });
    }catch(e){}
    /* algunas pantallas dibujan su barra despues de bajar los datos */
    var n = 0, t = setInterval(function(){
      try{ if(!document.querySelector('.vs-cab-tit')) armar(); }catch(e){}
      try{ barraUnica(); }catch(e){}
      if(++n > 20) clearInterval(t);
    }, 300);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
