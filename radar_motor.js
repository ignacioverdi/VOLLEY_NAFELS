/* ═══════════════════════════════════════════════════════════════════════════
   radar_motor.js — LA CUENTA DEL RADAR DE SAQUE, EN UN SOLO LUGAR

   POR QUE EXISTE ESTE ARCHIVO
   ---------------------------
   La velocidad del saque se calcula en tres pantallas distintas: la pantalla
   propia del radar, el panel en vivo y el panel de voley. La tentacion es
   copiar la formula en las tres. NO. Esta app ya pago ese precio: durante
   meses la eficacia de saque estuvo calculada de seis maneras distintas en
   seis archivos, y los numeros no coincidian entre pantallas.

   Asi que la cuenta vive ACA y nadie la vuelve a escribir. Si algun dia hay
   que cambiar el Cd, la masa de la pelota o la altura de la red, se cambia
   en un lugar y cambia en todos lados.

   QUE HAY ADENTRO
   ---------------
     VB_RADAR.velocidad(...)    de cuadros y metros a km/h
     VB_RADAR.cdQueExplica(...) la inversa, para calibrar contra un radar real
     VB_RADAR.recorrido(...)    la geometria de la cancha en 3 dimensiones
     VB_RADAR.medirFps(...)     cuantos cuadros por segundo tiene un video
     VB_RADAR.cuadroEn(...)     llevar un video a un instante y saber que
                                cuadro quedo, exacto
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
'use strict';

/* ── La pelota, segun el reglamento FIVB ──────────────────────────────── */
var M_PELOTA = 0.270;                          /* kg    */
var R_PELOTA = 0.105;                          /* m     */
var AREA     = Math.PI * R_PELOTA * R_PELOTA;  /* 0,0346 m² */
var KMH      = 3.6;

/* Cd: cuanto la frena el aire. No es un numero de adorno, define el
   resultado. Un saque flotante no gira y arrastra mucho mas que uno con
   rotacion; medido contra un aparato comercial, el flotante da 0,44. */
var CD = { flotante: 0.44, rotacion: 0.25 };

/* Alturas de red reglamentarias */
var RED = { masculino: 2.43, femenino: 2.24, sub17m: 2.35 };

/* Las tasas de cuadros que existen de verdad. Las camaras graban 29,97 y
   59,94 aunque el menu del telefono diga 30 y 60. */
var FPS_CATALOGO = [23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60, 100, 120, 240];

/* ── El aire ──────────────────────────────────────────────────────────── */
function densidadAire(altitud, tempC){
  /* Atmosfera estandar. Näfels esta a 440 m: el aire pesa 5% menos que al
     nivel del mar y eso mueve la cuenta casi 1 km/h. Poco, pero es gratis. */
  var T = (tempC == null ? 20 : tempC) + 273.15;
  var p = 101325 * Math.pow(1 - 2.25577e-5 * (altitud || 0), 5.25588);
  return p / (287.05 * T);
}
function kDe(cd, rho){ return rho * cd * AREA / (2 * M_PELOTA); }

/* ── La cuenta ────────────────────────────────────────────────────────────
   Dividir metros sobre segundos da la velocidad MEDIA del vuelo. Un radar
   no mide eso: mide la velocidad EN EL GOLPE, y la pelota se frena todo el
   camino. En un saque de 80 km/h la diferencia entre las dos cuentas son
   13 km/h, asi que hay que corregir el rozamiento:

       dv/dt = −k·v²          k = ρ·Cd·A / (2m)
       d(t)  = (1/k)·ln(1 + k·v₀·t)
       v₀    = (e^(k·d) − 1) / (k·t)

   Verificado contra un medidor comercial: con d = 10,00 m, t = 542 ms y
   Cd = 0,44 esta formula devuelve 79,4 km/h y el aparato mostraba 79,3.  */
function v0De(d, t, k){
  if (!(d > 0) || !(t > 0)) return null;
  if (!(k > 0)) return d / t;
  return (Math.exp(k * d) - 1) / (k * t);
}

/* La cuenta completa, que es lo que llaman las pantallas.
   Entra: recorrido en metros, cuadros de vuelo, cuadros por segundo, Cd,
   altitud y temperatura. Sale todo lo que hay que mostrar. */
function velocidad(op){
  var d = op.d, cuadros = op.cuadros, fps = op.fps;
  if (!(d > 0) || !(cuadros > 0) || !(fps > 0)) return null;
  var t   = cuadros / fps;
  var rho = densidadAire(op.altitud, op.temp);
  var cd  = op.cd > 0 ? op.cd : CD.flotante;
  var v0  = v0De(d, t, kDe(cd, rho));
  if (v0 == null) return null;

  /* El error. Manda el cuadro: a 30 por segundo, equivocarse UN cuadro sobre
     540 ms son 6% —±5 km/h—; a 60 es la mitad. Despues suma el recorrido,
     donde 30 cm sobre 10 m son otro 3%. Se suman en cuadratura porque son
     errores independientes. */
  var eT  = (1 / fps) / t;
  var eD  = 0.30 / d;
  var err = v0 * KMH * Math.sqrt(eT * eT + eD * eD);

  return { kmh: v0 * KMH, err: err, t: t, cuadros: cuadros, d: d,
           media: d / t * KMH, cd: cd, rho: rho, fps: fps };
}

/* La inversa: dado lo que marco un radar de verdad, que Cd lo explica.
   Se resuelve por biseccion porque despejar k de ahi no sale a mano. */
function cdQueExplica(d, t, v0_ms, rho){
  if (!(d > 0) || !(t > 0) || !(v0_ms > 0)) return null;
  if (v0_ms <= d / t) return 0.001;      /* midio menos que la media: sin rozamiento */
  var lo = 0.001, hi = 1.5;
  for (var i = 0; i < 80; i++){
    var mid = (lo + hi) / 2;
    if (v0De(d, t, kDe(mid, rho)) < v0_ms) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/* ── La geometria ─────────────────────────────────────────────────────────
   Eje x: a lo ancho, 0 a 9 m.
   Eje y: DISTANCIA A LA RED. 0 en la red, 9 en la linea de fondo, y mas de
          9 cuando el saltador pega desde atras de la linea, que es lo normal.
   Eje z: altura.
   Por defecto: centro de la cancha, 0,8 m detras de la linea, contacto a
   3,10 m, pasando 15 cm por encima de la red. Eso da 9,81 m; con 2 m de
   corrimiento lateral da 10,02, que es el recorrido tipico de un saque. */
function recorrido(op){
  op = op || {};
  var gx = (op.gx == null) ? 4.5 : op.gx;
  var gy = (op.gy == null) ? 9.8 : op.gy;
  var cx = (op.cx == null) ? gx  : op.cx;
  var zg = (op.zg == null) ? 3.1 : op.zg;
  var zc = ((op.red == null) ? RED.masculino : op.red) + ((op.margen == null) ? 0.15 : op.margen);
  var dx = cx - gx, dy = gy, dz = zc - zg;
  return { d: Math.sqrt(dx*dx + dy*dy + dz*dz), dx: dx, dy: dy, dz: dz, zg: zg, zc: zc };
}

/* ── El motor de cuadros ──────────────────────────────────────────────────
   requestVideoFrameCallback es la unica forma seria de saber que cuadro se
   esta viendo: el navegador avisa cada vez que pinta uno y dice el tiempo
   EXACTO de ese cuadro. Con currentTime a secas uno nunca sabe si el cuadro
   que ve es el que pidio, y ahi se va toda la precision. */
function hayRvfc(v){ return !!(v && typeof v.requestVideoFrameCallback === 'function'); }

function cuadroEn(v, t, listo){
  /* Lleva el video a t y devuelve el tiempo EXACTO del cuadro que quedo.

     ══ EL ORDEN IMPORTA ══════════════════════════════════════════════════
     requestVideoFrameCallback hay que armarlo JUSTO DESPUES de pedir el
     salto, no antes y no al recibir el evento 'seeked':
       · antes  -> puede dispararse con el cuadro VIEJO, el que todavia se
                   esta viendo, y devuelve un tiempo que no es el que se pidio
       · en el 'seeked' -> probado, muchas veces ya paso el cuadro nuevo y el
                   aviso no llega nunca: se queda esperando y contesta con
                   currentTime, que NO esta parado en un borde de cuadro. Con
                   eso la deteccion de cuadros por segundo falla entera.
     Pidiendo el salto y armando el aviso en la misma vuelta, el proximo
     cuadro que se pinta es el de despues del salto, que es el que se quiere.

     Y nunca se cuelga: si el aviso no llega en medio segundo, contesta con
     lo que haya. */
  var contestado = false, reloj = null;
  function contestar(valor){
    if (contestado) return;
    contestado = true;
    clearTimeout(reloj);
    listo(valor);
  }
  try { v.pause(); v.currentTime = t; }
  catch(e){ contestar(null); return; }
  if (hayRvfc(v)) v.requestVideoFrameCallback(function(now, meta){ contestar(meta.mediaTime); });
  reloj = setTimeout(function(){ contestar(v.currentTime); }, 500);
}

function medirFps(v, listo){
  /* ══ NUEVE MUESTRAS, Y SE PRUEBA CONTRA EL CATALOGO ════════════════════
     Se salta a nueve instantes repartidos y se anota el tiempo del cuadro
     que quedo en cada uno. Esos nueve valores SIEMPRE caen justo en un borde
     de cuadro. Entonces, si el video corre a f cuadros por segundo, cada uno
     multiplicado por f tiene que dar un entero. Se prueba f contra la lista
     de valores que existen y gana el que deja los nueve mas cerca de un
     entero. Si ninguno entra, se avisa en vez de inventar un numero.

     ══ POR QUE NO SE MIDE REPRODUCIENDO ═══════════════════════════════════
     La forma obvia —reproducir un segundo y contar los cuadros dibujados—
     esta PROBADA Y NO SIRVE: presentedFrames cuenta los que el navegador
     alcanzo a pintar, y con la maquina cargada se saltea. En la prueba, un
     video de 60 dio 56,6. Como todo el calculo cuelga de este numero, eso
     mete 6% de error en la velocidad sin avisar: el saque de 78 pasa a 73 y
     uno no se entera nunca. */
  if (!hayRvfc(v)){ listo(0, 'sin-rvfc'); return; }
  var dur = v.duration;
  if (!isFinite(dur) || dur <= 0.5){ listo(0, 'sin-duracion'); return; }

  var puntos = [], i;
  for (i = 1; i <= 9; i++) puntos.push(dur * i / 10 + i * 0.00713);  /* desparejos a proposito */
  var muestras = [];
  (function siguiente(n){
    if (n >= puntos.length){ decidir(); return; }
    cuadroEn(v, puntos[n], function(m){
      if (m != null && isFinite(m) && m > 0) muestras.push(m);
      siguiente(n + 1);
    });
  })(0);

  function decidir(){
    if (muestras.length < 4){ listo(0, 'no-pude'); return; }
    var mejor = null, mejorErr = 1e9;
    for (var j = 0; j < FPS_CATALOGO.length; j++){
      var f = FPS_CATALOGO[j], peor = 0;
      for (var q = 0; q < muestras.length; q++){
        var x = muestras[q] * f;
        var e = Math.abs(x - Math.round(x)) / f;      /* el error, en segundos */
        if (e > peor) peor = e;
      }
      if (peor < mejorErr){ mejorErr = peor; mejor = f; }
    }
    /* 0,8 ms de tolerancia: los contenedores guardan los tiempos redondeados
       al milisegundo, asi que ni el valor correcto cae exacto. */
    if (mejor && mejorErr < 0.0008) listo(mejor, 'ok');
    else listo(0, 'variable');
  }
}

/* Para la camara en vivo: los cuadros por segundo los dice la propia pista,
   no hace falta medir nada. */
function fpsDeCamara(stream){
  try {
    var s = stream.getVideoTracks()[0].getSettings();
    return s && s.frameRate ? Math.round(s.frameRate) : 0;
  } catch(e){ return 0; }
}

function redondearFps(f){
  var mejor = FPS_CATALOGO.reduce(function(a,b){
    return Math.abs(b - f) < Math.abs(a - f) ? b : a; });
  return (Math.abs(mejor - f) / f < 0.02) ? mejor : null;
}

global.VB_RADAR = {
  M_PELOTA: M_PELOTA, R_PELOTA: R_PELOTA, AREA: AREA, KMH: KMH,
  CD: CD, RED: RED, FPS_CATALOGO: FPS_CATALOGO,
  densidadAire: densidadAire, kDe: kDe, v0De: v0De,
  velocidad: velocidad, cdQueExplica: cdQueExplica, recorrido: recorrido,
  hayRvfc: hayRvfc, cuadroEn: cuadroEn, medirFps: medirFps,
  fpsDeCamara: fpsDeCamara, redondearFps: redondearFps
};
})(window);
