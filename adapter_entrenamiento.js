/* ============================================================
   adapter_entrenamiento.js  —  puente ENTRENAMIENTOS_* -> PARTIDOS_*
   ------------------------------------------------------------
   Se carga SOLO en modo entrenamiento y SOLO despues de
   datos_entrenamientos.js (y de datos_historial_ent.js /
   datos_recepcion_ent.js si la pagina los usa).

   En modo entrenamiento la pagina NO carga datos_partidos.js,
   asi que aca exponemos las variables PARTIDOS_* (las que el
   codigo de cada pagina ya usa) tomando los valores de las
   ENTRENAMIENTOS_*. El codigo de las paginas no se toca:
   simplemente "ve" los datos de entrenamiento bajo el nombre
   que ya conoce.

   Asignamos sobre el objeto global (window). Como en este modo
   NO existe ninguna 'const PARTIDOS_*' (datos_partidos.js no se
   cargo), las referencias sueltas a PARTIDOS_* de cada pagina
   resuelven a estas propiedades globales.
   ============================================================ */
(function (G) {
  function pick(name, def) { return (typeof G[name] !== 'undefined') ? G[name] : def; }

  G.PARTIDOS_GENERADO   = pick('ENTRENAMIENTOS_GENERADO',   '');
  G.PARTIDOS_TOTAL      = pick('ENTRENAMIENTOS_TOTAL',      0);
  G.PARTIDOS_META       = pick('ENTRENAMIENTOS_META',       []);
  G.PARTIDOS_JUGADORES  = pick('ENTRENAMIENTOS_JUGADORES',  []);
  G.PARTIDOS_INDIVIDUAL = pick('ENTRENAMIENTOS_INDIVIDUAL', []);
  G.PARTIDOS_EQUIPO_OBJ = pick('ENTRENAMIENTOS_EQUIPO_OBJ', {});
  G.PARTIDOS_ARMADOR    = pick('ENTRENAMIENTOS_ARMADOR',    {});
  G.PARTIDOS_TRANSICION = pick('ENTRENAMIENTOS_TRANSICION', {});
  G.PARTIDOS_VIDEOS     = pick('ENTRENAMIENTOS_VIDEOS',     []);

  if (G.HISTORIAL_DATA_ENT)       G.HISTORIAL_DATA       = G.HISTORIAL_DATA_ENT;
  if (G.RECEPCION_RIVAL_DATA_ENT) G.RECEPCION_RIVAL_DATA = G.RECEPCION_RIVAL_DATA_ENT;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
