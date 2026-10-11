/* ============================================================================
   iconos.js — los iconos propios de Volley-Stats
   ----------------------------------------------------------------------------
   POR QUE EXISTE

   La app usaba emojis como iconos: 1.561 en 44 pantallas. El emoji NO lo
   dibuja la app, lo dibuja el sistema operativo. El mismo signo sale distinto
   en Windows, en iPhone y en Android, y en algunos ni sale. En un producto
   que se le vende a un club, eso es lo que mas rapido lo delata.

   Esto los reemplaza por 85 iconos propios, dibujados sobre la misma grilla
   de 24x24, con el mismo grosor de trazo, y pintados con el color del texto
   que los rodea. Se ven igual en todos lados.

   COMO NO ROMPE NADA

   1. El emoji NO se borra: queda en el texto, invisible y sin ocupar lugar.
      Asi, cualquier codigo que lea .textContent o .innerText sigue leyendo
      exactamente lo mismo que antes, y el traductor (lang.js) sigue
      encontrando sus frases.
   2. No toca <option>, <select>, <textarea>, <input>, ni nada editable:
      ahi un SVG no se puede dibujar.
   3. No toca los cuadrados de color de las leyendas, las banderas, ni las
      caras del wellness: esos NO son iconos, son dato.
   4. Mira el contenido que aparece despues (la app arma casi todo con
      JavaScript), pero de a tandas y sin apurar al navegador.

   APAGARLO
       localStorage.setItem('vs_iconos','off')   y recargar
   ============================================================================ */
(function(){
  'use strict';
  try{ if(localStorage.getItem('vs_iconos') === 'off') return; }catch(e){}
  if(window.__VS_ICONOS) return; window.__VS_ICONOS = true;

  var D = {
  adelante:'<path d="m3.6 6.4 7 5.6-7 5.6V6.4Z"/><path d="m12.6 6.4 7 5.6-7 5.6V6.4Z"/>',
  alerta:'<path d="M10.3 3.9 2.1 18a1.9 1.9 0 0 0 1.7 2.9h16.4a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z"/><path d="M12 9.4v4.2"/><circle cx="12" cy="17.2" r="1.1" fill="currentColor" stroke="none"/>',
  altavoz:'<path d="M4.4 9.4h3.2L12 5.4v13.2l-4.4-4H4.4V9.4Z"/><path d="M15.6 9.6a3.6 3.6 0 0 1 0 4.8"/><path d="M18.2 7a7.2 7.2 0 0 1 0 10"/>',
  antena:'<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 15.8a5.4 5.4 0 0 0 0-7.6"/><path d="M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 18.6a9.4 9.4 0 0 0 0-13.2"/>',
  archivo:'<path d="M13.6 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.6l-5.4-5.4Z"/><path d="M13.4 3.4v5.2h5.3"/>',
  archivo_editar:'<path d="M13.6 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h4.6"/><path d="M13.4 3.4v5.2h5.3"/><path d="m18.2 13.4 2.4 2.4-4.6 4.6H13.6v-2.4l4.6-4.6Z"/>',
  armado:'<circle cx="12" cy="6.6" r="3.4"/><path d="m5.4 20.4 3.4-5.2M18.6 20.4l-3.4-5.2"/><path d="m8.8 15.2 3.2-2 3.2 2"/>',
  atras:'<path d="m20.4 6.4-7 5.6 7 5.6V6.4Z"/><path d="m11.4 6.4-7 5.6 7 5.6V6.4Z"/>',
  bajar:'<path d="M12 3.6v11.6"/><path d="m7.4 10.8 4.6 4.6 4.6-4.6"/><path d="M4.4 19.6h15.2"/>',
  balanza:'<path d="M12 4.2v15.4"/><path d="M8.2 19.6h7.6"/><path d="M4.4 7.6h15.2"/><path d="m4.4 7.6-2.2 5.2a2.6 2.6 0 0 0 4.4 0L4.4 7.6Z"/><path d="m19.6 7.6-2.2 5.2a2.6 2.6 0 0 0 4.4 0l-2.2-5.2Z"/><circle cx="12" cy="5.2" r="1.3" fill="currentColor" stroke="none"/>',
  barra_pesas:'<path d="M2.8 9.6v4.8M5.6 7.6v8.8M18.4 7.6v8.8M21.2 9.6v4.8"/><path d="M5.6 12h12.8"/>',
  barras:'<path d="M4 20h16"/><rect x="5.5" y="11" width="3.4" height="6"/><rect x="10.3" y="7" width="3.4" height="10"/><rect x="15.1" y="13.5" width="3.4" height="3.5"/>',
  bateria:'<rect x="2.6" y="7.6" width="16.4" height="8.8" rx="2"/><path d="M21.4 10.6v2.8"/><path d="M5.6 10.6v2.8M9 10.6v2.8M12.4 10.6v2.8"/>',
  caja:'<path d="M20.6 8.4v7.2a1.8 1.8 0 0 1-.9 1.6l-6.8 3.8a1.8 1.8 0 0 1-1.8 0l-6.8-3.8a1.8 1.8 0 0 1-.9-1.6V8.4a1.8 1.8 0 0 1 .9-1.6l6.8-3.8a1.8 1.8 0 0 1 1.8 0l6.8 3.8a1.8 1.8 0 0 1 .9 1.6Z"/><path d="m3.6 7.6 8.4 4.6 8.4-4.6M12 21v-8.8"/>',
  calculadora:'<rect x="5" y="2.8" width="14" height="18.4" rx="2"/><rect x="7.8" y="5.8" width="8.4" height="3.4" rx=".8"/><path d="M8.4 13h.01M12 13h.01M15.6 13h.01M8.4 17h.01M12 17h.01M15.6 17h.01"/>',
  calendario:'<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16"/><path d="M8.5 3.4v3.6M15.5 3.4v3.6"/>',
  calendario_dias:'<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16"/><path d="M8.5 3.4v3.6M15.5 3.4v3.6"/><path d="M8 13.4h.01M12 13.4h.01M16 13.4h.01M8 16.8h.01M12 16.8h.01"/>',
  camara_video:'<rect x="3" y="7" width="12.5" height="10" rx="2"/><path d="m15.5 11 5-2.8v7.6l-5-2.8V11Z"/>',
  camcorder:'<rect x="3" y="7.5" width="11.5" height="9" rx="1.8"/><path d="m14.5 11 6-3v8l-6-3v-2Z"/><circle cx="7" cy="12" r="2.1"/>',
  campana:'<path d="M12 3.2a6 6 0 0 0-6 6c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4a6 6 0 0 0-6-6Z"/><path d="M13.9 19a2.2 2.2 0 0 1-3.8 0"/>',
  candado:'<rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/><circle cx="12" cy="15.4" r="1.3" fill="currentColor" stroke="none"/>',
  carpeta:'<path d="M3.4 18.2V6.4a1.6 1.6 0 0 1 1.6-1.6h4l2 2.4h7.6a1.6 1.6 0 0 1 1.6 1.6v9.4a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6Z"/>',
  carpeta_abierta:'<path d="M3.2 8.4V6.2a1.6 1.6 0 0 1 1.6-1.6h4l2 2.4h6.6a1.6 1.6 0 0 1 1.6 1.6v1.2"/><path d="M3.2 8.4h17.4l-2 9.6a1.6 1.6 0 0 1-1.6 1.2H5a1.6 1.6 0 0 1-1.6-1.4L3.2 8.4Z"/>',
  casa:'<path d="m3.4 10.4 8.6-7 8.6 7"/><path d="M5.6 9v10.6a1.4 1.4 0 0 0 1.4 1.4h10a1.4 1.4 0 0 0 1.4-1.4V9"/><path d="M9.8 21v-6.4h4.4V21"/>',
  claqueta:'<rect x="3.2" y="7.5" width="17.6" height="12.5" rx="2"/><path d="m3.6 11.4 17-1.5"/><path d="M4.2 7.6 8 4.4l3 3.2M11 7.3 14.8 4l3 3.2"/>',
  cohete:'<path d="M12 2.8c3.2 2.4 5 6 5 10.2l-2.4 2.6H9.4L7 13c0-4.2 1.8-7.8 5-10.2Z"/><circle cx="12" cy="9.6" r="1.8"/><path d="M9.4 15.6 7 18.6l2.6.6M14.6 15.6l2.4 3-2.6.6"/><path d="M12 18.4v2.8"/>',
  comentario:'<path d="M20.4 11.6a7.6 7.6 0 0 1-8.2 7.6c-1 0-2-.2-2.9-.5l-5.7 1.7 1.7-5.1a7.6 7.6 0 0 1 6.9-11.3 7.6 7.6 0 0 1 8.2 7.6Z"/>',
  cronometro:'<circle cx="12" cy="13.4" r="7.8"/><path d="M12 9.4v4h3"/><path d="M9.4 2.6h5.2"/><path d="m18.8 6.6 1.6-1.6"/>',
  diana:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  enchufe:'<path d="M8.4 2.8v5.4M15.6 2.8v5.4"/><path d="M5.6 8.2h12.8v3.2a6.4 6.4 0 0 1-12.8 0V8.2Z"/><path d="M12 17.8v3.4"/>',
  engranaje:'<circle cx="12" cy="12" r="3.2"/><path d="M19.6 14.6a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.8 1.8 0 1 1-3.6 0V20a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.8 1.8 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9H4a1.8 1.8 0 1 1 0-3.6h.2a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4V4a1.8 1.8 0 1 1 3.6 0v.2a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.8 1.8 0 1 1 0 3.6H20a1.5 1.5 0 0 0-1.4.9Z"/>',
  enlace:'<path d="M9.8 14.2a3.8 3.8 0 0 1 0-5.4l3-3a3.8 3.8 0 0 1 5.4 5.4l-1.4 1.4"/><path d="M14.2 9.8a3.8 3.8 0 0 1 0 5.4l-3 3a3.8 3.8 0 0 1-5.4-5.4l1.4-1.4"/>',
  escoba:'<path d="M18.4 18.8H9.2L4.6 14.2a1.7 1.7 0 0 1 0-2.4l7.2-7.2a1.7 1.7 0 0 1 2.4 0l5.8 5.8a1.7 1.7 0 0 1 0 2.4l-6.2 6.2"/><path d="m8 11.6 6.6 6.6"/>',
  escudo:'<path d="M12 3.2 5 6v5.6c0 4.2 2.8 7.5 7 9.2 4.2-1.7 7-5 7-9.2V6l-7-2.8Z"/>',
  estetoscopio:'<path d="M6 3.2v4.4a4 4 0 0 0 8 0V3.2"/><path d="M6 3.2H4.4M14 3.2h1.6"/><path d="M10 11.6v2.2a4.6 4.6 0 0 0 9.2 0v-1"/><circle cx="19.2" cy="10.4" r="2.2"/>',
  estrella:'<path d="m12 3.2 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.2Z"/>',
  foto:'<rect x="3" y="6.5" width="18" height="13" rx="2"/><path d="m8.5 6.5 1.3-2.2h4.4l1.3 2.2"/><circle cx="12" cy="13" r="3.6"/>',
  fuego:'<path d="M12 21c3.3 0 5.8-2.3 5.8-5.4 0-3.9-3.4-5.6-3.4-9.3 0-1-.3-2-1-2.9-.2 2.5-1.6 3.7-3.1 5.2C8.5 10.3 6.2 12 6.2 15.6 6.2 18.7 8.7 21 12 21Z"/><path d="M12 21c1.6 0 2.8-1.2 2.8-2.8 0-1.9-1.7-2.9-1.7-4.7-.9 1-2.4 2-2.4 4.1 0 1.8 1.1 3.4 1.3 3.4Z"/>',
  globo:'<circle cx="12" cy="12" r="8.8"/><path d="M3.2 12h17.6"/><path d="M12 3.2c2.3 2.4 3.6 5.5 3.6 8.8s-1.3 6.4-3.6 8.8c-2.3-2.4-3.6-5.5-3.6-8.8s1.3-6.4 3.6-8.8Z"/>',
  guante:'<path d="M7.5 20.5v-4.3l-1.6-2.4a2 2 0 0 1 3-2.6l.6.6V5.3a1.6 1.6 0 1 1 3.2 0v4.1"/><path d="M12.7 9.4V7.6a1.6 1.6 0 1 1 3.2 0v2.2"/><path d="M15.9 9.9V9a1.6 1.6 0 1 1 3.1 0v6.3c0 2-.8 3.8-2.1 5.2"/>',
  guardar:'<path d="M5 4.4h11.2L19.6 8v11.6a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6V6a1.6 1.6 0 0 1 1.6-1.6Z"/><path d="M7.6 4.4v5.2h7.6V4.4"/><rect x="7.2" y="13.4" width="9.6" height="7.8" rx="1"/>',
  herramientas:'<path d="M14.2 6.4a3.8 3.8 0 0 0 5.1 5l-5.1-5Z"/><path d="m13.2 7.4-9 9a2.2 2.2 0 0 0 3.1 3.1l9-9"/><path d="m5.4 5.2 3.2-1.4 2.8 2.8-1.2 3.2-3.2 1.2L4.2 8.2l1.2-3Z"/>',
  impacto:'<path d="m12 2.6 2.2 4.9 5-1.3-2.1 4.8 4.1 3.2-5 1.4.6 5.2-4.4-2.8-4.4 2.8.6-5.2-5-1.4 4.1-3.2L5.7 6.2l5 1.3L12 2.6Z"/>',
  impresora:'<path d="M7 8.6V3.4h10v5.2"/><rect x="3.4" y="8.6" width="17.2" height="7.6" rx="2"/><path d="M7 13.4h10v7.2H7v-7.2Z"/>',
  institucion:'<path d="m3.4 9.4 8.6-5.6 8.6 5.6"/><path d="M4.8 9.4v9.2M9.6 9.4v9.2M14.4 9.4v9.2M19.2 9.4v9.2"/><path d="M3.2 20.6h17.6"/>',
  ladrillos:'<rect x="3.5" y="5" width="17" height="4.6" rx=".8"/><rect x="3.5" y="9.6" width="17" height="4.6" rx=".8"/><rect x="3.5" y="14.2" width="17" height="4.6" rx=".8"/><path d="M9.5 5v4.6M15 9.6v4.6M9.5 14.2v4.6"/>',
  lapiz:'<path d="m16.4 3.6 4 4L8.2 19.8l-5 1 1-5L16.4 3.6Z"/><path d="m14.6 5.4 4 4"/>',
  libro:'<path d="M4 4.6h5.4A3.2 3.2 0 0 1 12 6.2v13a2.4 2.4 0 0 0-2-1.2H4V4.6Z"/><path d="M20 4.6h-5.4A3.2 3.2 0 0 0 12 6.2v13a2.4 2.4 0 0 1 2-1.2h6V4.6Z"/>',
  linea:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="m6.5 15.5 3.6-4.2 2.9 2.4 4.9-6"/><circle cx="17.9" cy="7.7" r="1.1" fill="currentColor" stroke="none"/>',
  lupa:'<circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.6 15.6 4.6 4.6"/>',
  mancuerna:'<path d="M3 10.2v3.6M6 8.4v7.2M18 8.4v7.2M21 10.2v3.6"/><path d="M6 12h12"/>',
  mano_1:'<path d="M6.4 13.2v-1.4a1.7 1.7 0 0 1 1.7-1.7h7.8a1.7 1.7 0 0 1 1.7 1.7v2.6a6.4 6.4 0 0 1-6.4 6.4H10a4 4 0 0 1-3.2-1.6l-2.4-3.2a1.7 1.7 0 0 1 2.6-2.1l1 1.2"/><path d="M10.4 10.1V4.4a1.7 1.7 0 1 1 3.4 0v5.7"/>',
  mano_2:'<path d="M6.4 13.2v-1.4a1.7 1.7 0 0 1 1.7-1.7h7.8a1.7 1.7 0 0 1 1.7 1.7v2.6a6.4 6.4 0 0 1-6.4 6.4H10a4 4 0 0 1-3.2-1.6l-2.4-3.2a1.7 1.7 0 0 1 2.6-2.1l1 1.2"/><path d="M9.4 10.1 8.2 4.6a1.7 1.7 0 1 1 3.3-.7l1.1 5.3"/><path d="m14.6 10.1 1.2-5.5a1.7 1.7 0 1 0-3.3-.7l-1.1 5.3"/>',
  mano_abierta:'<path d="M6.6 13.4v-1.6a1.7 1.7 0 0 1 1.7-1.7h7.4a1.7 1.7 0 0 1 1.7 1.7v2.6a6.4 6.4 0 0 1-6.4 6.4h-.8a4 4 0 0 1-3.2-1.6l-2.6-3.4a1.7 1.7 0 0 1 2.6-2.1l1 1.2"/><path d="M8.6 10.1V6.2a1.4 1.4 0 1 1 2.8 0v3.9"/><path d="M12.6 10.1V5.2a1.4 1.4 0 1 1 2.8 0v4.9"/><path d="M16.2 10.1V7a1.4 1.4 0 1 1 2.8 0v4.8"/>',
  mano_cuernos:'<path d="M6.4 13.2v-1.4a1.7 1.7 0 0 1 1.7-1.7h7.8a1.7 1.7 0 0 1 1.7 1.7v2.6a6.4 6.4 0 0 1-6.4 6.4H10a4 4 0 0 1-3.2-1.6l-2.4-3.2a1.7 1.7 0 0 1 2.6-2.1l1 1.2"/><path d="M8.6 10.1V4.6a1.6 1.6 0 1 1 3.2 0v5.5"/><path d="M15.4 10.1V4.6a1.6 1.6 0 1 1 3.2 0v5.5"/>',
  mano_puno:'<path d="M5.6 13.6v-2.2a1.7 1.7 0 0 1 1.7-1.7h9.4a1.7 1.7 0 0 1 1.7 1.7v3a6.4 6.4 0 0 1-6.4 6.4h-1.2a4 4 0 0 1-3.2-1.6l-2.6-3.4a1.7 1.7 0 0 1 2.6-2.1l1.2 1.4"/><path d="M9.6 9.7V8a1.6 1.6 0 0 1 3.2 0v1.7"/>',
  manzana:'<path d="M15.6 7.4c-1.3 0-2.2.7-3.6.7s-2.4-.7-3.7-.7c-2.3 0-4.5 2-4.5 5.5 0 3.4 2.6 8.1 4.8 8.1 1.1 0 1.8-.7 3.4-.7s2.1.7 3.3.7c2.3 0 4.7-4.5 4.7-8 0-3.6-2.2-5.6-4.4-5.6Z"/><path d="M12.4 5.2c.8-1 1.3-2.2 1.2-3.4-1.2.1-2.4.7-3.1 1.6-.7.8-1.2 2-1.1 3.1 1.3.1 2.3-.5 3-1.3Z"/>',
  medalla:'<circle cx="12" cy="15" r="5.6"/><path d="M12 12.6l.9 1.9 2 .3-1.5 1.4.4 2.1-1.8-1-1.8 1 .4-2.1L9.1 14.8l2-.3.9-1.9Z"/><path d="M8.4 10.2 5.6 3.4h12.8l-2.8 6.8"/>',
  nuevo:'<path d="M8.6 3.4 10 7.4l4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4 1.4-4Z"/><path d="m16.8 12.4.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z"/>',
  obra:'<path d="M12 3.2 5.8 19.2h12.4L12 3.2Z"/><path d="M9.4 10.4h5.2M7.8 15h8.4"/><path d="M3.6 20.8h16.8"/>',
  ojo:'<path d="M1.8 12s3.8-7 10.2-7 10.2 7 10.2 7-3.8 7-10.2 7S1.8 12 1.8 12Z"/><circle cx="12" cy="12" r="3.2"/>',
  pantalla:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 17v3.5"/>',
  pausa:'<rect x="6.6" y="4.6" width="3.8" height="14.8" rx="1.2"/><rect x="13.6" y="4.6" width="3.8" height="14.8" rx="1.2"/>',
  pelicula:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6v12M17 6v12"/><path d="M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  pelota:'<circle cx="12" cy="12" r="9"/><path d="M12.4 3c-3.9 3.3-5.4 8.6-3.7 13.4"/><path d="M20.8 9.6c-5 .5-9.3 3.8-11.1 8.6"/><path d="M3.5 14.9c3.6-3.5 8.9-4.9 13.8-3.4"/>',
  persona:'<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.4c.6-3.8 3.6-6.2 7.2-6.2s6.6 2.4 7.2 6.2"/>',
  personas:'<circle cx="9.2" cy="8.2" r="3.2"/><path d="M2.8 20c.6-3.4 3.2-5.6 6.4-5.6s5.8 2.2 6.4 5.6"/><path d="M16.2 5.4a3.2 3.2 0 0 1 0 6.2"/><path d="M17.4 14.8c2.1.6 3.5 2.4 3.9 5.2"/>',
  pin:'<path d="M12 21.2s7-5.6 7-11.2a7 7 0 1 0-14 0c0 5.6 7 11.2 7 11.2Z"/><circle cx="12" cy="10" r="2.8"/>',
  planilla:'<rect x="5" y="4.5" width="14" height="16" rx="2"/><path d="M9 4.5a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 4.5v1H9v-1Z"/><path d="M8.6 11h6.8M8.6 15h4.4"/>',
  pregunta:'<circle cx="12" cy="12" r="9"/><path d="M9.4 9.4a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.7-2.6 2.7"/><circle cx="12" cy="16.8" r="1.1" fill="currentColor" stroke="none"/>',
  prohibido:'<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  rayo:'<path d="M13.4 2.5 5.6 13.2h5.3l-.9 8.3 8.2-10.9h-5.4l.6-8.1Z"/>',
  robot:'<rect x="4" y="8" width="16" height="11.6" rx="2.4"/><path d="M12 4.2v3.8"/><circle cx="12" cy="3.2" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="13.2" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="13.2" r="1.3" fill="currentColor" stroke="none"/><path d="M9.6 16.8h4.8"/>',
  rotar:'<path d="M20.2 11.2a8.2 8.2 0 1 1-2.4-5.4"/><path d="M20.4 3.6v4.8h-4.8"/>',
  senal:'<path d="M4 18.6v-3M9.3 18.6v-6.4M14.7 18.6v-9.8M20 18.6V5.4"/>',
  subir:'<path d="M12 20V8.4"/><path d="m7.4 12.8 4.6-4.6 4.6 4.6"/><path d="M4.4 4.4h15.2"/>',
  tacho:'<path d="M4.4 6.6h15.2"/><path d="M9.2 6.6V4.8a1.4 1.4 0 0 1 1.4-1.4h2.8a1.4 1.4 0 0 1 1.4 1.4v1.8"/><path d="M6.4 6.6 7.3 19a1.8 1.8 0 0 0 1.8 1.6h5.8a1.8 1.8 0 0 0 1.8-1.6l.9-12.4"/><path d="M10.4 10.4v6M13.6 10.4v6"/>',
  teclas:'<rect x="2.6" y="6" width="18.8" height="12" rx="2"/><path d="M6.4 9.6h.01M10 9.6h.01M13.6 9.6h.01M17.2 9.6h.01M6.4 12.6h.01M17.2 12.6h.01"/><path d="M9 15.4h6"/>',
  termometro:'<path d="M14 14.2V5a2 2 0 1 0-4 0v9.2a4.4 4.4 0 1 0 4 0Z"/><circle cx="12" cy="17.6" r="1.6" fill="currentColor" stroke="none"/>',
  tijera:'<circle cx="6.4" cy="6.4" r="2.8"/><circle cx="6.4" cy="17.6" r="2.8"/><path d="m8.4 8.4 11.2 9.2M19.6 6.4 8.4 15.6"/>',
  tilde:'<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.8 2.8L16 9.6"/>',
  trofeo:'<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 5.5H5.5A2.5 2.5 0 0 0 5.9 10c.7.3 1.4.4 2.1.4"/><path d="M16 5.5h2.5a2.5 2.5 0 0 1-.4 4.5c-.7.3-1.4.4-2.1.4"/><path d="M12 13v3.5"/><path d="M9 20h6"/><path d="M10 16.5h4L15 20H9l1-3.5Z"/>',
  versus:'<path d="m8.8 6-4.9 6 4.9 6"/><path d="m15.2 6 4.9 6-4.9 6"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  viento:'<path d="M3.4 8.4h10a2.8 2.8 0 1 0-2.8-2.8"/><path d="M3.4 12.6h14.2a2.8 2.8 0 1 1-2.8 2.8"/><path d="M3.4 16.8h7.2"/>',
  vivo:'<circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><path d="M6.8 6.8a7.4 7.4 0 0 0 0 10.4M17.2 17.2a7.4 7.4 0 0 0 0-10.4"/>'
  };
  var MAPA = {'🏐':'pelota','🏆':'trofeo','📊':'barras','📈':'linea','📉':'linea','📋':'planilla','📅':'calendario','🗓':'calendario_dias','🎯':'diana','⚡':'rayo','🛡':'escudo','💥':'impacto','🧱':'ladrillos','🧤':'guante','🎱':'armado','🔥':'fuego','🎬':'claqueta','🎥':'camara_video','📹':'camcorder','📺':'pantalla','🎞':'pelicula','📸':'foto','💪':'mancuerna','🏋':'barra_pesas','🩺':'estetoscopio','👤':'persona','👥':'personas','🧑':'personas','🤝':'personas','⚖':'balanza','🔍':'lupa','🔗':'enlace','📂':'carpeta_abierta','📁':'carpeta','📄':'archivo','📝':'archivo_editar','✏':'lapiz','✎':'lapiz','✍':'lapiz','🗑':'tacho','💾':'guardar','⬇':'bajar','📥':'bajar','⬆':'subir','📤':'subir','🔄':'rotar','🔔':'campana','🔒':'candado','🔐':'candado','⚙':'engranaje','🛠':'herramientas','🌐':'globo','📍':'pin','📡':'antena','💨':'viento','🔋':'bateria','🚀':'cohete','📖':'libro','🏠':'casa','👁':'ojo','❓':'pregunta','⚠':'alerta','✅':'tilde','⛔':'prohibido','🚧':'obra','🆕':'nuevo','⭐':'estrella','📦':'caja','🔴':'vivo','⏩':'adelante','⏪':'atras','⏸':'pausa','⏱':'cronometro','🧮':'calculadora','🧹':'escoba','🖨':'impresora','🆚':'versus','🤖':'robot','🍎':'manzana','🔤':'teclas','⌨':'teclas','🔊':'altavoz','📶':'senal','🥇':'medalla','🥈':'medalla','🥉':'medalla','🏛':'institucion','💬':'comentario','🔌':'enchufe','🌡':'termometro','✂':'tijera','☝':'mano_1','✌':'mano_2','✊':'mano_puno','🖐':'mano_abierta','🤚':'mano_abierta','🤘':'mano_cuernos'};

  /* los que NO se tocan, a proposito */
  var NO_TOCAR = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|OPTGROUP|SVG|TITLE|CODE|PRE|NOSCRIPT)$/;
  var RX = new RegExp('(' + Object.keys(MAPA).map(function(e){
      return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')\\uFE0F?', 'g');

  var estilo = '.vs-i{display:inline-flex;align-items:center;justify-content:center;' +
    'width:1.12em;height:1.12em;vertical-align:-.18em;flex:none;position:relative}' +
    '.vs-i>svg{width:100%;height:100%;display:block;stroke:currentColor;fill:none;' +
    'stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
    '.vs-i>i{position:absolute;width:1px;height:1px;overflow:hidden;' +
    'clip:rect(0 0 0 0);white-space:nowrap;font-style:normal}';

  function ponerEstilo(){
    if(document.getElementById('vs-i-css')) return;
    var raiz = document.head || document.documentElement; if(!raiz) return;
    var s = document.createElement('style'); s.id = 'vs-i-css'; s.textContent = estilo;
    raiz.appendChild(s);
  }

  function svg(nombre, emoji){
    var w = document.createElement('span');
    w.className = 'vs-i';
    w.setAttribute('data-vsi','1');
    w.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                  D[nombre] + '</svg><i>' + emoji + '</i>';
    return w;
  }

  function sirve(nodo){
    var p = nodo.parentNode;
    if(!p || p.nodeType !== 1) return false;
    if(p.getAttribute && p.getAttribute('data-vsi')) return false;
    while(p && p.nodeType === 1){
      if(NO_TOCAR.test(p.nodeName)) return false;
      if(p.isContentEditable) return false;
      if(p.getAttribute && p.getAttribute('data-sin-iconos') !== null) return false;
      p = p.parentNode;
    }
    return true;
  }

  function pasar(raiz){
    if(!raiz || !document.body) return;
    var w, lista = [], n;
    try{ w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); }catch(e){ return; }
    while((n = w.nextNode())){
      var t = n.nodeValue;
      if(!t) continue;
      RX.lastIndex = 0;
      if(!RX.test(t)) continue;
      if(!sirve(n)) continue;
      lista.push(n);
      if(lista.length > 600) break;      /* nunca de golpe: la pantalla manda */
    }
    for(var i = 0; i < lista.length; i++) cambiar(lista[i]);
  }

  function cambiar(nodo){
    var t = nodo.nodeValue, frag = document.createDocumentFragment(), ult = 0, m;
    RX.lastIndex = 0;
    while((m = RX.exec(t)) !== null){
      var nombre = MAPA[m[1]];
      if(!nombre || !D[nombre]) continue;
      if(m.index > ult) frag.appendChild(document.createTextNode(t.slice(ult, m.index)));
      frag.appendChild(svg(nombre, m[0]));
      ult = m.index + m[0].length;
    }
    if(!frag.childNodes.length) return;
    if(ult < t.length) frag.appendChild(document.createTextNode(t.slice(ult)));
    if(nodo.parentNode) nodo.parentNode.replaceChild(frag, nodo);
  }

  /* ── lo que aparece despues ──────────────────────────────────────────────
     La app arma casi todo con JavaScript, asi que la mayoria de los iconos
     no existen cuando la pagina termina de cargar. Se mira lo que se agrega,
     pero juntando los avisos y trabajando cuando el navegador esta libre. */
  var pendientes = [], timer = null;
  var descansar = window.requestIdleCallback || function(f){ return setTimeout(function(){ f(); }, 60); };

  function agendar(){
    if(timer) return;
    timer = setTimeout(function(){
      timer = null;
      var cola = pendientes; pendientes = [];
      (function tanda(){
        descansar(function(){
          var fin = Math.min(cola.length, 40);
          for(var i = 0; i < fin; i++){
            if(cola[i].isConnected !== false) pasar(cola[i]);
          }
          cola = cola.slice(fin);
          if(cola.length) tanda();
        }, {timeout: 400});
      })();
    }, 140);
  }

  function mirar(){
    if(!window.MutationObserver || !document.body) return;
    new MutationObserver(function(ms){
      for(var i = 0; i < ms.length; i++){
        var ns = ms[i].addedNodes;
        for(var j = 0; j < ns.length; j++){
          var n = ns[j];
          if(n.nodeType === 1){
            if(n.getAttribute && n.getAttribute('data-vsi')) continue;
            pendientes.push(n);
          } else if(n.nodeType === 3 && n.parentNode){
            pendientes.push(n.parentNode);
          }
        }
      }
      if(pendientes.length) agendar();
    }).observe(document.body, {childList:true, subtree:true});
  }

  function arrancar(){
    if(!document.body) return setTimeout(arrancar, 20);
    ponerEstilo();
    pasar(document.body);
    mirar();
  }

  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
