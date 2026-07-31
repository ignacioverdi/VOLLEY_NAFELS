/* ============================================================================
   plantel_nafels.js — PLANTEL DE LA TEMPORADA 2025-26
   ----------------------------------------------------------------------------
   ESTE ARCHIVO ES DE UNA TEMPORADA ARCHIVADA. No se edita para el equipo
   actual: el plantel en uso vive en el plantel_nafels.js de la carpeta
   principal del club.

   ── DE DÓNDE SALE ──────────────────────────────────────────────────────────
   De los propios partidos de la temporada. Los números, los apellidos y quién
   fue líbero salen del bloque de jugadores de cada .dvw; el puesto se dedujo
   de lo que hizo cada uno en la cancha, sobre 14 partidos:

       más del 30% de armados          -> ARMADOR
       mucha recepción y casi sin ataque -> LIBERO
       mucho bloqueo y poca recepción  -> CENTRAL
       recepción alta                  -> PUNTA
       el resto, con ataque alto       -> OPUESTO

   ── POR QUÉ HIZO FALTA ─────────────────────────────────────────────────────
   Al archivar la temporada se copió el plantel que estaba en uso ese día, no
   el que jugó. Por eso la cápsula mostraba los jugadores de la temporada
   siguiente sobre los datos de esta.

   Los nombres de pila, la nacionalidad, la fecha de nacimiento y la altura no
   están en los .dvw: se completan a mano si hacen falta.
   ============================================================================ */
window.PLANTEL_NAFELS = {
  temporada: "2025-26",
  jugadores: [
    { num: 4,  ap: "VAZQUEZ",     nombre: "Ezequiel", pos: "ARMADOR", nac: "Argentina", nacim: "07/03/2004", altura: 182 },
    { num: 1,  ap: "DEECKE",      nombre: "Linus",         pos: "ARMADOR", nac: "", nacim: "", altura: 0 },
    { num: 6,  ap: "CABANAS",     nombre: "Denis",    pos: "OPUESTO", nac: "", nacim: "", altura: 0 },
    { num: 5,  ap: "HESSELHOLT",  nombre: "Joachim",         pos: "CENTRAL", nac: "", nacim: "", altura: 0 },
    { num: 15, ap: "NIKOLOV",     nombre: "Risto",         pos: "CENTRAL", nac: "", nacim: "", altura: 0 },
    { num: 7,  ap: "SCHMID R",    nombre: "Roy",      pos: "CENTRAL", nac: "Suiza", nacim: "17/05/2002", altura: 198 },
    { num: 14, ap: "FIGUEIREDO",  nombre: "Manuel",         pos: "PUNTA",   nac: "", nacim: "", altura: 0 },
    { num: 9,  ap: "BROCH",       nombre: "Nathan",         pos: "PUNTA",   nac: "", nacim: "", altura: 0 },
    { num: 11, ap: "BARTHOLET",   nombre: "Christian",pos: "PUNTA",   nac: "Suiza", nacim: "", altura: 0 },
    { num: 10, ap: "BOGDANOVSKI", nombre: "Dejan",    pos: "PUNTA",   nac: "Suiza", nacim: "", altura: 0 },
    { num: 3,  ap: "SCHWITTER",   nombre: "Tom",      pos: "OPUESTO", nac: "Suiza", nacim: "30/07/2005", altura: 188 },
    { num: 8,  ap: "PETER",       nombre: "Jonas",         pos: "LIBERO",  nac: "", nacim: "", altura: 0 }
  ]
};

/* Los que estuvieron en la lista pero casi no jugaron esa temporada:
   #2 Feuz · #12 Mathias · #13 Bruderer · #17 Campbell · #21 Gabriel
   #22 Giustiniano · #98 Corzo · #99 Jucker
   No se incluyen porque no tienen foto ni minutos suficientes. Si hiciera
   falta que aparezcan, se agregan a la lista de arriba. */
