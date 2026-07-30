/* ============================================================================
   datos_equipo_2025-26.js — EL PLANTEL QUE JUGÓ ESTA TEMPORADA
   ----------------------------------------------------------------------------
   ESTE ARCHIVO ES DE UNA TEMPORADA ARCHIVADA. No tiene nada que ver con el
   plantel actual del club, que vive en la carpeta principal.

   ── POR QUÉ EXISTE ─────────────────────────────────────────────────────────
   Al archivar la temporada se copió el plantel que estaba en uso ese día, no
   el que jugó. Por eso la cápsula mostraba a los jugadores de la temporada
   siguiente sobre los datos de esta — y varios sin foto, porque las fotos que
   hay son las de los que sí jugaron.

   El plantel de verdad estaba guardado en el propio archivo de DataVolley
   (4370.sq), con nombre y apellido de cada uno. De ahí salieron estos doce.

   ── LOS PUESTOS ────────────────────────────────────────────────────────────
   Deducidos de lo que hizo cada uno en la cancha, sobre 14 partidos:
   más del 30% de armados → armador; mucha recepción y casi sin ataque →
   líbero; mucho bloqueo y poca recepción → central; recepción alta → punta;
   el resto, con ataque alto → opuesto.

   ── LAS FOTOS ──────────────────────────────────────────────────────────────
   Los doce números coinciden exactamente con las doce fotos que hay en la
   carpeta. Esa es la confirmación de que este es el plantel correcto.
   ============================================================================ */
window.EQUIPO_DATA = {
  temporada: "2025-26",
  jugadores: [
    { num: 1,  nombre: "DEECKE",      pos: "ARMADOR", foto: "fotos/01.jpg", pais: "\uD83C\uDDE8\uD83C\uDDED", altura: "", edad: 0 },
    { num: 3,  nombre: "SCHWITTER",   pos: "OPUESTO", foto: "fotos/03.jpg", pais: "\uD83C\uDDE8\uD83C\uDDED", altura: "", edad: 0 },
    { num: 4,  nombre: "VAZQUEZ",     pos: "ARMADOR", foto: "fotos/04.jpg", pais: "\uD83C\uDDE6\uD83C\uDDF7", altura: "", edad: 0 },
    { num: 5,  nombre: "HESSELHOLT",  pos: "CENTRAL", foto: "fotos/05.jpg", pais: "\uD83C\uDDE9\uD83C\uDDF0", altura: "", edad: 0 },
    { num: 6,  nombre: "CABANAS",     pos: "OPUESTO", foto: "fotos/06.jpg", pais: "", altura: "", edad: 0 },
    { num: 7,  nombre: "SCHMID R",    pos: "CENTRAL", foto: "fotos/07.jpg", pais: "\uD83C\uDDE8\uD83C\uDDED", altura: "", edad: 0 },
    { num: 8,  nombre: "PETER",       pos: "LIBERO",  foto: "fotos/08.jpg", pais: "\uD83C\uDDE8\uD83C\uDDED", altura: "", edad: 0 },
    { num: 9,  nombre: "BROCH",       pos: "PUNTA",   foto: "fotos/09.jpg", pais: "", altura: "", edad: 0 },
    { num: 10, nombre: "BOGDANOVSKI", pos: "PUNTA",   foto: "fotos/10.jpg", pais: "\uD83C\uDDE8\uD83C\uDDED", altura: "", edad: 0 },
    { num: 11, nombre: "BARTHOLET",   pos: "PUNTA",   foto: "fotos/11.jpg", pais: "\uD83C\uDDE8\uD83C\uDDED", altura: "", edad: 0 },
    { num: 14, nombre: "FIGUEIREDO",  pos: "PUNTA",   foto: "fotos/14.jpg", pais: "", altura: "", edad: 0 },
    { num: 15, nombre: "NIKOLOV",     pos: "CENTRAL", foto: "fotos/15.jpg", pais: "", altura: "", edad: 0 }
  ],
  staff: [
    { nombre: "IGNACIO VERDI", rol: "Head Coach", icon: "\uD83D\uDCCB" },
    { nombre: "PREP. FISICO",  rol: "Strength & Conditioning", icon: "\uD83D\uDCAA" }
  ]
};

/* Los nombres de pila, por si alguna pantalla los quiere:
   1 Linus · 3 Tom · 4 Ezequiel · 5 Joachim · 6 Denis · 7 Roy
   8 Jonas · 9 Nathan · 10 Dejan · 11 Christian · 14 Manuel · 15 Risto */
