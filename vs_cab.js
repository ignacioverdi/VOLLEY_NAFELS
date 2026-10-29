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
    /* Si hay un h1 o un h2, ESE es el titulo. Buscar "el texto mas grande"
       fallaba en Horarios: el h1 arranca con <span class="ic">🗓️</span> y el
       emoji, al ser el unico hijo-elemento, ganaba la busqueda; el titulo de
       verdad vive en un nodo de texto suelto, que no es un elemento. */
    var h = cab.querySelector('h1,h2');
    if(h && (h.textContent || '').trim()) return h;

    var mejor = null, max = 0;
    var nodos = cab.querySelectorAll('*');
    for(var i = 0; i < nodos.length; i++){
      var n = nodos[i];
      if(n.children.length) continue;                       /* solo hojas */
      if(n.closest('button,a,select,input,label,textarea')) continue;
      var t = (n.textContent || '').trim();
      if(!t || t.length > 60) continue;
      /* al menos tres letras o numeros: un emoji solo no es un titulo */
      if(t.replace(/[^0-9A-Za-z\u00C0-\u024F]/g, '').length < 3) continue;
      var s = 0;
      try{ s = parseFloat(getComputedStyle(n).fontSize) || 0; }catch(e){}
      if(s > max){ max = s; mejor = n; }
    }
    return mejor;
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

  function arrancar(){
    try{ armar(); }catch(e){}
    /* algunas pantallas dibujan su barra despues de bajar los datos */
    var n = 0, t = setInterval(function(){
      try{ if(!document.querySelector('.vs-cab-tit')) armar(); }catch(e){}
      if(++n > 20) clearInterval(t);
    }, 300);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
