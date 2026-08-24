/* ═══════════════════════════════════════════════════════════════════════════
   categorias_club.js — LAS CATEGORIAS QUE TIENE ESTE CLUB

   Un club puede tener un solo equipo o toda la estructura formativa. Cada
   categoria es un equipo distinto: sus partidos, sus jugadoras y sus numeros
   no se mezclan con los de otra —el porcentaje de ataque de una Sub-16 al
   lado del de Primera no significa nada—.

   ── COMO SE USA ──────────────────────────────────────────────────────────
   Si el club tiene UNA sola categoria, se deja como esta: la app no muestra
   ningun selector y todo funciona como siempre.

   Si tiene varias, se escriben aca:

       window.CATEGORIAS_CLUB = ['Primera', 'Sub-21', 'Sub-18', 'Sub-16'];

   Desde ese momento:
     · al subir un partido se elige a que categoria pertenece
     · cada una guarda sus datos por separado
     · la app deja cambiar de categoria con un clic

   La primera de la lista es la que se abre por defecto.
   ═══════════════════════════════════════════════════════════════════════════ */

window.CATEGORIAS_CLUB = ['Primera', 'H1L', 'H2L'];

/* ── LAS CARPETAS DE PARTIDOS DE CADA UNA ──────────────────────────────────
   Primera no lleva marca: su carpeta es la de siempre.

       Primera    DVW NAFELS 2027
       H1L        DVW NAFELS H1L 2027
       H2L        DVW NAFELS H2L 2027

   Si una carpeta no existe o esta vacia, esa categoria se saltea con un
   aviso: no hace falta crearlas hasta que tengas partidos.
   ────────────────────────────────────────────────────────────────────────── */

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario */
