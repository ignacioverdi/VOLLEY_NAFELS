/* ============================================================================
   plantel_nafels.js — PLANTEL MAESTRO Axpo Volley Näfels
   ----------------------------------------------------------------------------
   FUENTE ÚNICA del plantel actual. Editá SOLO este archivo cuando cambien
   los jugadores y se actualiza en todo el sitio (login por PIN, panel, etc.).

   Cómo editar:
     - num    : número de camiseta
     - ap     : apellido (en MAYÚSCULAS, como se muestra en los botones)
     - nombre : nombre de pila
     - pos    : ARMADOR | OPUESTO | CENTRAL | PUNTA | LIBERO
     - nac    : nacionalidad
     - (la fecha de nacimiento ya no vive aca: es la clave de cada
        jugador y este archivo se publica. Esta en datos_plantel.js,
        que se cifra. La leen la planilla P-2 y la pantalla de Equipo)
     - altura : en cm
   Si hay dos jugadores con el mismo apellido, distinguilos en "ap"
   (ej: "SCHMID R" y "SCHMID J").
   ========================================================================== */
window.PLANTEL_NAFELS = {
  temporada: "2026-27",
  jugadores: [
    { num: 4,  ap: "VAZQUEZ",     nombre: "Ezequiel", pos: "ARMADOR", nac: "Argentina", altura: 182 },
    { num: 13, ap: "STEIMANN",    nombre: "Yannik",   pos: "ARMADOR", nac: "Suiza", altura: 182 },
    { num: 9,  ap: "NORRIS",      nombre: "James",    pos: "OPUESTO", nac: "EE.UU.", altura: 195 },
    { num: 3,  ap: "SCHWITTER",   nombre: "Tom",      pos: "OPUESTO", nac: "Suiza", altura: 188 },
    { num: 12, ap: "JOHANSSON",   nombre: "Patrik",   pos: "CENTRAL", nac: "Suecia", altura: 204 },
    { num: 7,  ap: "SCHMID R",    nombre: "Roy",      pos: "CENTRAL", nac: "Suiza", altura: 198 },
    { num: 5,  ap: "CLEMENT",     nombre: "Olivier",  pos: "CENTRAL", nac: "Suiza", altura: 203 },
    { num: 1,  ap: "DURDOS",      nombre: "Valentin", pos: "PUNTA",   nac: "Argentina", altura: 184 },
    { num: 11, ap: "BARTHOLET",   nombre: "Christian",pos: "PUNTA",   nac: "Suiza", altura: 187 },
    { num: 17, ap: "ROFFLER",     nombre: "Pascal",   pos: "PUNTA",   nac: "Suiza", altura: 192 },
    { num: 10, ap: "BOGDANOVSKI", nombre: "Dejan",    pos: "PUNTA",   nac: "Suiza", altura: 196 },
    { num: 20, ap: "SCHMID J",    nombre: "Jonas",    pos: "LIBERO",  nac: "Suiza", altura: 178 },
    { num: 2,  ap: "BRUDERER",    nombre: "Gian",     pos: "LIBERO",  nac: "Suiza", altura: null }
  ],
  staff: [
    { rol: "HC", ap: "VERDI",    nombre: "Ignacio",   nac: "Argentina / Italia" },
    { rol: "AC", ap: "AZCOITIA", nombre: "Sebastian", nac: "Argentina / España" }
  ]
};

/* Helpers: lista lista para login/botones (num + nombre en mayúsculas) */
window.PLANTEL_NAFELS.lista = window.PLANTEL_NAFELS.jugadores.map(function (j) {
  return { num: j.num, nombre: j.ap, pos: j.pos };
});

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */
