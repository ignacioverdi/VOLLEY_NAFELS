// ───────────────────────────────────────────────────────────────────────────
//  volver_inicio.js — EL ESCUDO PARA VOLVER AL MENU
//
//  De 52 pantallas, 30 no tenian ninguna forma de volver al inicio: el
//  jugador entraba y quedaba atrapado, con el boton de atras del navegador
//  como unica salida. En el celular, instalada como app, ese boton a veces ni
//  aparece.
//
//  Este archivo dibuja un escudo fijo abajo a la izquierda que lleva al menu.
//  Se agrega con una sola linea en cada pagina, asi no hay que tocar el HTML
//  de cada una ni mantener 30 copias del mismo boton.
//
//  Lo que NO hace:
//   · no aparece en el propio index (seria un boton hacia si mismo)
//   · no aparece en BIENVENIDA, que es la pagina publica de instalacion
//   · no pisa nada: se dibuja encima, sin tocar el contenido de la pagina
// ───────────────────────────────────────────────────────────────────────────
(function () {
  var aqui = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (aqui === '' || aqui === 'index.html' || aqui === 'bienvenida.html') return;

  // Dentro de una temporada archivada (temporadas/AAAA-AA/) el inicio esta
  // dos carpetas mas arriba.
  var enCapsula = /\/temporadas\/\d{4}-\d{2}\//.test(location.pathname);
  var destino = enCapsula ? '../../index.html' : 'index.html';

  var TXT = {
    es: 'Volver al inicio',
    en: 'Back to home',
    de: 'Zurück zum Start'
  };
  /* El boton de ATRAS es otra cosa que el escudo: el escudo lleva SIEMPRE al
     menu, y atras lleva a la pantalla de la que venis. Desde el plan de
     partido de un rival, "atras" es el plan, no el inicio: el escudo te hacia
     empezar de cero y volver a elegir todo de nuevo.
     Instalada como app en el celular no hay boton de atras del navegador, asi
     que sin esto no habia ninguna forma de retroceder un paso. */
  var TXT_ATRAS = {
    es: 'Atrás',
    en: 'Back',
    de: 'Zurück'
  };
  function _idioma() {
    try { return (typeof getLang === 'function') ? getLang() : 'es'; }
    catch (e) { return 'es'; }
  }
  function texto() { return TXT[_idioma()] || TXT.es; }
  function textoAtras() { return TXT_ATRAS[_idioma()] || TXT_ATRAS.es; }

  /* ══ ATRAS ════════════════════════════════════════════════════════════
     Va encima del escudo, mismo tamano y mismo estilo, para que se lean como
     un par. Se dibuja SIEMPRE —tambien cuando el escudo lo pone lang.js—
     porque son dos destinos distintos.

     Si la pagina se abrio directo (link compartido, acceso directo del
     celular) no hay a donde volver: ahi lleva al inicio, que es lo unico
     cierto. history.back() en ese caso no hace nada y el boton pareceria
     roto. */
  function hayDeDonde() {
    try {
      if (history.length > 1) return true;
      return !!document.referrer && document.referrer.indexOf(location.origin) === 0;
    } catch (e) { return false; }
  }
  function dibujarAtras() {
    if (document.getElementById('vb-atras')) return;
    if (!document.body) return;
    var b = document.createElement('a');
    b.id = 'vb-atras';
    b.href = destino;
    b.title = textoAtras();
    b.setAttribute('aria-label', textoAtras());
    b.style.cssText =
      'position:fixed;left:14px;bottom:74px;z-index:9998;' +
      'width:52px;height:52px;border-radius:50%;' +
      'display:flex;align-items:center;justify-content:center;' +
      'background:rgba(15,16,32,.92);border:1px solid rgba(255,255,255,.14);' +
      'box-shadow:0 4px 18px rgba(0,0,0,.45);backdrop-filter:blur(6px);' +
      '-webkit-backdrop-filter:blur(6px);text-decoration:none;color:#e2e8f0;' +
      'font-size:25px;line-height:1;font-family:system-ui,sans-serif;' +
      'transition:transform .15s ease,border-color .15s ease';
    b.textContent = '\u2190';
    b.onmouseenter = function () {
      b.style.transform = 'scale(1.07)';
      b.style.borderColor = 'rgba(232,25,44,.55)';
    };
    b.onmouseleave = function () {
      b.style.transform = 'scale(1)';
      b.style.borderColor = 'rgba(255,255,255,.14)';
    };
    b.onclick = function (e) {
      if (!hayDeDonde()) return;          /* sin historial: se va al inicio */
      e.preventDefault();
      history.back();
    };
    document.body.appendChild(b);
  }

  function dibujar() {
    dibujarAtras();
    if (document.getElementById('vb-volver')) return;

    // ══ NO DIBUJAR DOS VECES EL MISMO BOTON ══════════════════════════════
    // lang.js ya pone un escudo para volver al inicio, con id 'club-escudo',
    // en left:12 bottom:12. Este archivo ponia otro en left:14 bottom:14.
    //
    // Dos pixeles de diferencia: se veian los DOS circulos, uno asomando por
    // debajo del otro. Quedaba feo y confundia, porque parecia otro logo.
    //
    // Cada archivo revisaba solo SU propio boton, asi que ninguno se enteraba
    // del otro. Si el de lang.js ya esta, este no hace nada.
    if (document.getElementById('club-escudo')) return;

    if (!document.body) return;

    var a = document.createElement('a');
    a.id = 'vb-volver';
    a.href = destino;
    a.title = texto();
    a.setAttribute('aria-label', texto());
    a.style.cssText =
      'position:fixed;left:14px;bottom:14px;z-index:9998;' +
      'width:52px;height:52px;border-radius:50%;' +
      'display:flex;align-items:center;justify-content:center;' +
      'background:rgba(15,16,32,.92);border:1px solid rgba(255,255,255,.14);' +
      'box-shadow:0 4px 18px rgba(0,0,0,.45);backdrop-filter:blur(6px);' +
      '-webkit-backdrop-filter:blur(6px);text-decoration:none;' +
      'transition:transform .15s ease,border-color .15s ease';
    a.onmouseenter = function () {
      a.style.transform = 'scale(1.07)';
      a.style.borderColor = 'rgba(232,25,44,.55)';
    };
    a.onmouseleave = function () {
      a.style.transform = 'scale(1)';
      a.style.borderColor = 'rgba(255,255,255,.14)';
    };

    var img = document.createElement('img');
    img.src = (enCapsula ? '../../' : '') + 'escudo.png';
    img.alt = '';
    img.style.cssText = 'width:36px;height:36px;object-fit:contain;display:block';
    // Si el club no tiene escudo cargado, queda una flecha en vez de un hueco.
    img.onerror = function () {
      a.removeChild(img);
      var s = document.createElement('span');
      s.textContent = '⌂';
      s.style.cssText = 'font-size:24px;color:#e2e8f0;line-height:1';
      a.appendChild(s);
    };
    a.appendChild(img);
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dibujar);
  } else {
    dibujar();
  }
  // al cambiar de idioma se actualiza el texto del tooltip
  /* lang.js dispara 'langchange'; 'vb-lang' quedo de una version vieja y
     por eso el globito seguia en castellano aunque la pantalla estuviera
     en ingles. Se escuchan los dos, y ademas se repasa al ratito por si
     este archivo se dibujo antes de que lang.js eligiera idioma. */
  function _retocar() {
    var a = document.getElementById('vb-volver');
    if (a) { a.title = texto(); a.setAttribute('aria-label', texto()); }
    var b = document.getElementById('vb-atras');
    if (b) { b.title = textoAtras(); b.setAttribute('aria-label', textoAtras()); }
  }
  window.addEventListener('langchange', _retocar);
  window.addEventListener('vb-lang', _retocar);
  setTimeout(_retocar, 700);
  setTimeout(_retocar, 2000);
})();
