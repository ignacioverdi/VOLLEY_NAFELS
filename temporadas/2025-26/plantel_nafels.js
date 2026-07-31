/* ============================================================================
   plantel_nafels.js — EL PLANTEL DE LA TEMPORADA 2025-26
   ----------------------------------------------------------------------------
   TEMPORADA ARCHIVADA. Este archivo no se edita para el equipo actual: el
   plantel en uso vive en la carpeta principal del club.

   ── DE DÓNDE SALE CADA DATO ────────────────────────────────────────────────
   Los doce son los que jugaron, verificado sobre los 97 partidos de la
   temporada. Sus fotos están en la carpeta y sus números coinciden uno a uno.

       el número y el apellido    de los propios .dvw
       el nombre de pila          de nla_players_db.json, la base de la liga
       el puesto                  de lo que hizo cada uno en la cancha
       la nacionalidad, la fecha
       de nacimiento y la altura  de los que siguen en el club esta temporada

   ── LOS QUE NO SIGUIERON ───────────────────────────────────────────────────
   De Deecke, Hesselholt, Cabanas, Peter, Broch, Figueiredo y Nikolov no
   quedaron esos datos en ningún archivo: no están en el plantel actual ni en
   la base de la liga, que sólo guarda nombre y número.

   Se dejan en blanco. Se completan a mano abriendo este archivo con el Bloc de
   notas: es una línea por jugador.

   ── CUÁNTO JUGÓ CADA UNO ───────────────────────────────────────────────────
   Sobre los 97 partidos, en acciones registradas:

       Vazquez 3142 · Figueiredo 2059 · Cabanas 1902 · Broch 1227
       Nikolov 1067 · Peter 989 · Hesselholt 866 · Bartholet 715
       Deecke 241 · Schmid 177 · Bogdanovski 162 · Schwitter 22
   ============================================================================ */
window.PLANTEL_NAFELS = {
  temporada: "2025-26",
  jugadores: [
    { num: 4,  ap: "VAZQUEZ",     nombre: "Ezequiel",  pos: "ARMADOR", nac: "Argentina", nacim: "07/03/2004", altura: 182, foto: "fotos/04.jpg" },
    { num: 1,  ap: "DEECKE",      nombre: "Linus",     pos: "ARMADOR", nac: "",          nacim: "",           altura: 0,   foto: "fotos/01.jpg" },
    { num: 6,  ap: "CABANAS",     nombre: "Denis",     pos: "OPUESTO", nac: "",          nacim: "",           altura: 0,   foto: "fotos/06.jpg" },
    { num: 3,  ap: "SCHWITTER",   nombre: "Tom",       pos: "OPUESTO", nac: "Suiza",     nacim: "30/07/2005", altura: 188, foto: "fotos/03.jpg" },
    { num: 5,  ap: "HESSELHOLT",  nombre: "Joachim",   pos: "CENTRAL", nac: "",          nacim: "",           altura: 0,   foto: "fotos/05.jpg" },
    { num: 15, ap: "NIKOLOV",     nombre: "Risto",     pos: "CENTRAL", nac: "",          nacim: "",           altura: 0,   foto: "fotos/15.jpg" },
    { num: 7,  ap: "SCHMID R",    nombre: "Roy",       pos: "CENTRAL", nac: "Suiza",     nacim: "17/05/2002", altura: 198, foto: "fotos/07.jpg" },
    { num: 14, ap: "FIGUEIREDO",  nombre: "Manuel",    pos: "PUNTA",   nac: "",          nacim: "",           altura: 0,   foto: "fotos/14.jpg" },
    { num: 9,  ap: "BROCH",       nombre: "Nathan",    pos: "PUNTA",   nac: "",          nacim: "",           altura: 0,   foto: "fotos/09.jpg" },
    { num: 11, ap: "BARTHOLET",   nombre: "Christian", pos: "PUNTA",   nac: "Suiza",     nacim: "11/04/2004", altura: 187, foto: "fotos/11.jpg" },
    { num: 10, ap: "BOGDANOVSKI", nombre: "Dejan",     pos: "PUNTA",   nac: "Suiza",     nacim: "22/05/2006", altura: 196, foto: "fotos/10.jpg" },
    { num: 8,  ap: "PETER",       nombre: "Jonas",     pos: "LIBERO",  nac: "",          nacim: "",           altura: 0,   foto: "fotos/08.jpg" }
  ],
  staff: [
    { nombre: "IGNACIO VERDI", rol: "Head Coach", icon: "\uD83D\uDCCB" }
  ]
};

/* El mismo plantel con los nombres que usan las otras pantallas. Es la misma
   lista: se publica de las tres formas para que la encuentre cualquiera, sin
   tener que tocarles el código. */
window.EQUIPO_DATA = {
  temporada: "2025-26",
  jugadores: window.PLANTEL_NAFELS.jugadores.map(function (j) {
    return { num: j.num, nombre: j.ap, pos: j.pos, foto: j.foto,
             pais: j.nac, altura: j.altura, edad: 0 };
  }),
  staff: window.PLANTEL_NAFELS.staff
};
window.CASLA_JUGADORES  = window.EQUIPO_DATA.jugadores;
window.NAFELS_JUGADORES = window.EQUIPO_DATA.jugadores;
