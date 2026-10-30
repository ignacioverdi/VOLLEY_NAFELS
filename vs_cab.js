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
      return /^(AXPO)?(BIOGAS)?(VOLLEY)?NAFELS(VOLEY|VOLLEY|VOLLEYBALL)?$/.test(l)
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
      /*  el nombre real del club: AXPO VOLLEY NAFELS, con la dieresis.
          La ultima palabra va en rojo, igual que los titulos de las bandas. */
      if(sp) sp.innerHTML = '<b>AXPO VOLLEY <em>N\u00c4FELS</em></b><i class="vs-msub"></i>';
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
      /*  Un solo renglon para todos los "volver". Antes cada enlace absorbido
          ocupaba una fila entera y en el panel en vivo quedaban tres rotulos
          apilados arriba del titulo —"CAT", "Dashboard" y "HUB"—, uno debajo
          del otro. Ahora van todos en la misma linea, y lo que no es un
          enlace (un rotulo suelto como "CAT") no sube: se esconde.        */
      var fila = cab0.querySelector('.vs-fila-volver');
      if(!fila){
        fila = document.createElement('span');
        fila.className = 'vs-fila-volver';
        cab0.insertBefore(fila, cab0.firstChild);
      }
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
            hijos.forEach(function(h){
              if(h.tagName !== 'A' && h.tagName !== 'BUTTON') return;  /* rotulos sueltos, no */
              h.classList.add('vs-volver'); fila.appendChild(h);
            });
            ant.classList.add('vs-huerfano');
          } else if(ant.dataset) ant.dataset.vsTira = '0';
        }
        ant = sig;
      }
      /*  y el "volver" que la pantalla ya traia adentro de la banda se suma
          al mismo renglon en vez de inventar otro                         */
      [].slice.call(cab0.children).forEach(function(h){
        if(h === fila || h.parentNode !== cab0) return;
        if(h.tagName !== 'A' && h.tagName !== 'BUTTON') return;
        var tx = (h.textContent || '').trim();
        if(!/^[\u2190\u2039\u25C2<]/.test(tx) || tx.length > 28) return;
        h.classList.add('vs-volver'); fila.appendChild(h);
      });
      fila.style.display = fila.children.length ? '' : 'none';
    }

    /* ── la banda de marca de la portada ya no hace falta ───────────────── */
    var hd = document.querySelector('body > header');
    if(hd && hd.querySelector('.logo-wrap') && !hd.dataset.vsUna){
      hd.dataset.vsUna = '1';
      hd.classList.add('vs-cab-dupe');
      /*  y deja de ser banda de titulo: si no, la regla general de .vs-cab la
          vuelve a mostrar y la portada queda con dos encabezados  */
      hd.classList.remove('vs-cab', 'vs-cab-chica', 'vs-cab-portada');
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
    '[class~="bat"],[class*="bat-"],[class*="bats"],[class*="bateria"],[id*="bateria"],' +
    '[id^="bat-"],[id*="dbat"],[class*="semaforo"],[class*="readiness"],[class*="rd-"],' +
    '[class*="chart"],[class*="grafico"],[class*="legend"],[class*="leyenda"],' +
    '[class*="dbat"],#nv-rail,.nv-d-comp,[class*="badge-"],[class*="objetivo"]';

  /* devuelve el tono 0-360 si el color es un acento fuerte; si no, null */
  /*   minA: cuanto relleno hace falta para considerarlo un color. Por defecto
       medio: un boton macizo. Con 0.05 entran tambien los botones "teñidos",
       los del panel en vivo, que van pintados al 10-16% de opacidad: el tono
       esta igual en el rgb, lo unico que cambia es cuanto se ve.            */
  function tono(col, minA){
    var m = String(col).match(/rgba?\(([^)]+)\)/); if(!m) return null;
    var p = m[1].split(',').map(parseFloat);
    var a = p.length > 3 ? p[3] : 1;
    if(a < (minA === undefined ? 0.5 : minA)) return null;
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
  /*   soloRojo: para los BOTONES, de la marca es unicamente el rojo y el
       magenta. El cian entra en la paleta para un haz o un filete, pero un
       boton celeste al lado de uno rojo sigue siendo de otra app.          */
  function esDeLaMarca(h, soloRojo){
    if(h === null) return true;
    if(h >= 326 || h <= 14) return true;
    if(soloRojo) return false;
    return (h >= 180 && h <= 200);
  }

  /* un boton "elegido" es el de la pestaña activa: lleva el relleno rojo */
  function elegido(e){
    try{
      if(e.getAttribute('aria-pressed') === 'true' || e.getAttribute('aria-selected') === 'true') return true;
      var c = ' ' + (e.className || '') + ' ';
      return / on | activo | active | sel | selected | current /.test(c);
    }catch(err){ return false; }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     QUE SE VEA EL FONDO
     Varias pantallas pintan su contenedor principal de negro liso y tapan la
     trama de la app: las luces rojas, la cuadricula y los haces en diagonal
     quedan debajo y no se ven. Si ese relleno es practicamente el mismo negro
     del fondo, sacarlo no cambia nada salvo dejar pasar la trama.
     ═══════════════════════════════════════════════════════════════════════ */
  function casiNegro(col){
    var m = String(col).match(/rgba?\(([^)]+)\)/); if(!m) return false;
    var p = m[1].split(',').map(parseFloat);
    if(p.length > 3 && p[3] < 0.5) return false;
    return (p[0] * 0.299 + p[1] * 0.587 + p[2] * 0.114) < 26;
  }
  function opaco(col){
    var m = String(col).match(/rgba?\(([^)]+)\)/); if(!m) return false;
    var p = m[1].split(',').map(parseFloat);
    return !(p.length > 3 && p[3] < 0.92);
  }
  /*   Un cajon es "tapa" si ocupa casi todo el ancho, es alto, esta pintado de
       un negro liso y no tiene ni borde ni esquinas redondeadas: eso no es un
       panel, es el fondo de la pantalla puesto a mano. Un panel —con su borde
       y sus esquinas— no se toca nunca.                                     */
  /*   Lo que todavia no se midio bien —la pantalla aun no abrio, el estilo no
       llego— no se descarta de una: se lo vuelve a mirar unas pasadas.      */
  function luego(e){
    var v = +(e.dataset.vsTapV || 0);
    if(v >= 6) e.dataset.vsTap = '0'; else e.dataset.vsTapV = v + 1;
  }
  function destapar(){
    try{
      var anchoV = window.innerWidth || 1200;
      /*  Tambien lo que cuelga de <html> fuera del body: la pantalla de
          acceso se dibuja ahi y quedaba negra lisa.                        */
      var els = document.querySelectorAll('body > *,body > * > *,body > * > * > *,' +
        'html > div,html > div > *,html > section,html > main');
      for(var i = 0; i < els.length && i < 600; i++){
        var e = els[i];
        if(e.dataset.vsTap) continue;
        if(e.id === 'vsn' || e.closest('.vs-cab')) { e.dataset.vsTap = '0'; continue; }
        if(e.classList.contains('vs-pan')) { e.dataset.vsTap = '0'; continue; }
        /*  el video, el lienzo y las imagenes no son fondo: no se tocan  */
        if(/^(VIDEO|CANVAS|IMG|IFRAME|SVG|OBJECT|EMBED|PICTURE)$/.test(e.tagName)){
          e.dataset.vsTap = '0'; continue; }
        var s2 = getComputedStyle(e);
        if(s2.backgroundImage && s2.backgroundImage !== 'none') { luego(e); continue; }
        if(parseFloat(s2.borderTopWidth) > 0 || parseFloat(s2.borderLeftWidth) > 0 ||
           parseFloat(s2.borderBottomWidth) > 0 || parseFloat(s2.borderRightWidth) > 0){
          e.dataset.vsTap = '0'; continue; }
        if(parseFloat(s2.borderTopLeftRadius) > 4) { e.dataset.vsTap = '0'; continue; }
        var r = e.getBoundingClientRect();
        if(r.width < anchoV * 0.84 || r.height < 260) { luego(e); continue; }
        if(!casiNegro(s2.backgroundColor)) { luego(e); continue; }
        /*  Lo que esta fijo a la pantalla —la pantalla de inicio del panel en
            vivo, por ejemplo— tapa a proposito lo que hay detras: ahi no se
            puede volver transparente sin dejar ver lo de abajo. A ese se le
            pinta la misma trama del fondo encima, que es lo que se buscaba. */
        if(s2.position === 'fixed'){
          if(!opaco(s2.backgroundColor)) { e.dataset.vsTap = '0'; continue; }
          e.dataset.vsTap = '1'; e.classList.add('vs-fondo'); continue;
        }
        e.dataset.vsTap = '1'; e.classList.add('vs-transp');
      }
    }catch(e){}
  }

  /* los haces de luz en diagonal, los mismos de la portada */
  function haces(){
    try{
      if(document.querySelector('.vs-haz')) return;
      ['a','b','c','d','e'].forEach(function(k){
        var i = document.createElement('i');
        i.className = 'vs-haz ' + k; i.setAttribute('aria-hidden', 'true');
        document.body.appendChild(i);
      });
    }catch(e){}
  }

  function pintarAcentos(){
    var n = 0, cands = [];
    try{
      /*  la pestaña elegida cambia sola: se refresca en cada pasada  */
      var ya = document.querySelectorAll('[data-vs-ac="1"]');
      for(var y = 0; y < ya.length; y++){
        var on = elegido(ya[y]);
        /*  solo se escribe si cambio: si no, cada pasada mueve el atributo y
            despierta al observador para nada                               */
        if(on === ya[y].classList.contains('vs-acento-on')) continue;
        ya[y].classList.toggle('vs-acento-on', on);
        ya[y].classList.toggle('vs-acento', !on);
      }
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
        /*  lo mio no se repinta a si mismo  */
        var cn = ' ' + String(e.className || '') + ' ';
        if(/ (nv|vs)-/.test(cn)){ e.dataset.vsAc = '0'; continue; }
        var hb = tono(s.backgroundColor, 0.05);
        if(hb !== null && !esDeLaMarca(hb, true)){ cands.push({ el:e, h:Math.round(hb/30), p:e.parentElement }); }
        else {
          /*  Muchas pantallas le ponen el color al boton recien cuando la
              pestaña se activa. Si se descarta en la primera pasada no se
              repinta nunca, asi que se lo vuelve a mirar unas cuantas veces
              antes de darlo por neutro.                                     */
          var vz = +(e.dataset.vsAcV || 0);
          if(vz >= 6) e.dataset.vsAc = '0'; else e.dataset.vsAcV = vz + 1;
        }
      }
      /* TODOS LOS BOTONES PASAN A NEGRO CON ROJO.
         La unica excepcion son los del teclado de scouteo: ahi el color ES el
         dato (#, +, !, -, =, /) y se reconocen porque su texto tiene una o dos
         letras. Todo lo que diga una palabra es navegacion o accion, y va con
         la piel de la app: fondo oscuro, borde y letra en rojo. El que esta
         elegido va con el relleno rojo, como en la portada. */
      /*  Los de una o dos letras: si hay TRES O MAS juntos en el mismo cajon
          es el teclado de scouteo (#, +, !, -, =, /) y ahi el color ES el
          dato, no se toca. Uno solo —el "?" de ayuda— es un boton como
          cualquier otro y va con la piel de la app.                       */
      var grupos = {}, seq = 0;
      cands.forEach(function(c){
        c.t = (c.el.textContent || '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '').trim();
        if(!(c.t.length > 0 && c.t.length < 3)) return;
        var p = c.p;
        if(!p){ c.g = 0; return; }
        if(!p.__vsG) p.__vsG = ++seq;
        c.g = p.__vsG;
        grupos[c.g] = (grupos[c.g] || 0) + 1;
      });
      cands.forEach(function(c){
        if(c.g && grupos[c.g] >= 3){ c.el.dataset.vsAc = '0'; return; }
        c.el.dataset.vsAc = '1';
        c.el.classList.add(elegido(c.el) ? 'vs-acento-on' : 'vs-acento');
        n++;
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
      /*  Las tiritas de degradado: finitas, anchas y con algun color fuera de
          la marca (el violeta y el azul que venian de otra paleta). Eso es
          adorno, no dato, y va en rojo. Un degradado alto o angosto —una
          tarjeta, un grafico— no entra aca.                                */
      try{
        var ti = document.querySelectorAll('div,span,i,hr,p');
        for(var z = 0; z < ti.length && z < 1200; z++){
          var t = ti[z];
          if(t.dataset.vsTi) continue;
          try{ if(t.closest(NO_TOCAR)) { t.dataset.vsTi = '0'; continue; } }catch(err){}
          var bi = getComputedStyle(t).backgroundImage || '';
          if(bi.indexOf('linear-gradient') < 0) { t.dataset.vsTi = '0'; continue; }
          var rc = t.getBoundingClientRect();
          if(rc.height < 1 || rc.height > 7 || rc.width < 120) { t.dataset.vsTi = '0'; continue; }
          var cols = bi.match(/rgba?\([^)]+\)/g) || [], ajeno = false;
          for(var w = 0; w < cols.length; w++){
            var hh = tono(cols[w]);
            if(hh !== null && !esDeLaMarca(hh)){ ajeno = true; break; }
          }
          if(!ajeno) { t.dataset.vsTi = '0'; continue; }
          t.dataset.vsTi = '1'; t.classList.add('vs-tirita');
        }
      }catch(err){}

      var tonos = {};
      cand.forEach(function(x){ tonos[x.h] = 1; });
      if(cand.length && cand.length <= 4 && Object.keys(tonos).length === 1){
        cand.forEach(function(x){ x.el.dataset.vsBa = '1'; x.el.classList.add('vs-barra'); });
      } else cand.forEach(function(x){ x.el.dataset.vsBa = '0'; });
    }catch(e){}
    return n;
  }

  /*  la banda de marca de la portada no sirve como banda de titulo  */
  function elegirCab(){
    var l = document.querySelectorAll(SEL);
    for(var i = 0; i < l.length; i++){
      if(l[i].classList.contains('vs-cab-dupe')) continue;
      if(l[i].dataset && l[i].dataset.vsUna === '1') continue;
      return l[i];
    }
    return null;
  }
  function armar(){
    var cab = elegirCab();
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
    /*  Las pantallas de proyeccion (el video con retardo) van a pantalla
        completa sobre la pared: una barra fija arriba taparia la imagen. Esas
        llevan data-vs-barra="no" en el <body> y reciben todo lo demas —el
        fondo, los haces, los paneles y los botones— pero ninguna barra.     */
    var SIN_BARRA = false;
    try{ SIN_BARRA = document.body.getAttribute('data-vs-barra') === 'no'; }catch(e){}
    if(!SIN_BARRA){
      try{ armar(); }catch(e){}
      try{ barraUnica(); }catch(e){}
    }
    try{ grano(); }catch(e){}
    /* nav.js, lang.js y temporadas_menu.js dibujan sus cosas cuando pueden:
       se vuelve a pasar unas veces hasta que esten todas adentro de la barra */
    if(!SIN_BARRA) [250, 800, 1800, 3500].forEach(function(ms){
      setTimeout(function(){ try{ barraUnica(); }catch(e){} }, ms);
    });
    /* los paneles, al cargar y de nuevo cuando la pantalla termino de dibujar */
    try{ haces(); }catch(e){}
    try{ destapar(); }catch(e){}
    try{ pintarPaneles(); }catch(e){}
    try{ pintarAcentos(); }catch(e){}
    [700, 2200, 4500].forEach(function(ms){
      setTimeout(function(){ try{ destapar(); pintarPaneles(); pintarAcentos(); }catch(e){} }, ms);
    });
    /* las pantallas dibujan botones despues de bajar los datos */
    try{
      var tt = null;
      /*  Varias pantallas tienen paneles que recien aparecen cuando se abre
          una pestaña: no se agregan al documento, se les saca el display:none.
          Por eso ademas de los hijos se miran class, style y hidden. Los
          data-* quedan afuera a proposito, que son los que escribe este
          mismo archivo y lo despertarian solo.                             */
      new MutationObserver(function(){
        clearTimeout(tt); tt = setTimeout(function(){ try{ destapar(); pintarAcentos(); }catch(e){} }, 300);
      }).observe(document.body, { childList:true, subtree:true, attributes:true,
        attributeFilter:['class','style','hidden','open','aria-selected','aria-pressed'] });
    }catch(e){}
    /* algunas pantallas dibujan su barra despues de bajar los datos */
    var n = 0, t = setInterval(function(){
      if(SIN_BARRA){ clearInterval(t); return; }
      try{ if(!document.querySelector('.vs-cab-tit')) armar(); }catch(e){}
      try{ barraUnica(); }catch(e){}
      if(++n > 20) clearInterval(t);
    }, 300);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
