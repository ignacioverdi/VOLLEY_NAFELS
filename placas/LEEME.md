# Placas de la fecha

Seis placas de Instagram por fecha, una por fundamento, con los datos de la
liga que ya están en este repo. Sale de los mismos `.dvw` que subís siempre.

## Instalar (una sola vez)

Doble clic en **INSTALAR.bat**. Tarda un par de minutos: baja Playwright y un
Chromium chico, que es lo que dibuja las imágenes.

Si no tenés Python, instalalo antes desde python.org y tildá
*"Add Python to PATH"* en la primera pantalla.

## Cada fecha

1. Poné los `.dvw` de la fecha en la carpeta `DVW NAFELS <año>`, como siempre.
2. Doble clic en **HACER_PLACAS.bat**. Se abre un menú:

       1. Una fecha           (el lunes, con los 4 partidos)
       2. Acumulado hasta...  (durante la semana)
       3. Toda la temporada
       4. Ver qué fechas detecta

3. Elegís, te pregunta el número, y se abre sola la carpeta con las imágenes.

## De dónde saca de qué fecha es cada partido

El `.dvw` **no trae el número de fecha adentro**. Sale del nombre del archivo,
y hay dos caminos:

**1. Si el nombre trae `#03`, esa es la fecha.** Exacto, sin adivinar.
Es lo que ya empezaste a hacer con `&2026-09-19 #03 AXPO NAFELS vs JONA.dvw`.
**Seguí con esa costumbre: es lo único infalible.**

**2. Si no lo trae, se agrupa por fin de semana:** sábado y domingo van siempre
juntos, y cada fecha se identifica por su sábado.

Los partidos de entre semana se enganchan al fin de semana más cercano, porque
son postergados de esa fecha, no fechas propias. Sobre los 95 `.dvw` fechados de
la 25-26: el 80% se jugó sábado o domingo, y los de miércoles vienen de a uno o
dos.

Antes de generar nada, usá la opción **4** del menú para ver cómo quedaron
agrupadas. Si algo no cuadra, renombrá ese archivo con `#NN` y listo.

Los partidos sin fecha en el nombre (copa, amistosos) no entran en ninguna
fecha, pero sí en el acumulado de temporada.

## Dónde quedan

    placas/salida/26-27/fecha-03/
        A-saque.png
        B-recepcion.png
        C-armado.png
        D-ataque.png
        E-bloqueo.png
        F-equipo-ideal.png

**No se pisa nada**: cada fecha tiene su carpeta. En febrero podés armar "el
mejor de la primera rueda" sin reprocesar, y si sale un número raro sabés de
qué fecha vino.

Para la temporada acumulada, dejá la fecha vacía y apretá Enter: queda en
`salida/26-27/acumulado/`.

## Qué hace por dentro

- La temporada la detecta sola: busca la carpeta `DVW ...` con el año más alto
  que tenga archivos. Mismo criterio que `gen_liga_stats.py`.
- Los cálculos salen de `baterias_engine.py` y de `nla_stats.json`, que es lo
  que ya genera la GitHub Action. **No se reimplementa ninguna fórmula.**
- El piso de volumen se adapta: con tres partidos jugados no exige lo mismo que
  con noventa y siete. Es el mayor entre un piso mínimo y el 40% de la mediana.

## Para sumar otra liga

Si los `.dvw` de la liga española entran a tu pipeline igual que los suizos,
solo hay que pasarle la carpeta:

    python seis_placas.py --carpeta "DVW ESPANA 2027" --temporada 26-27 --fecha 3

Y cambiar el rótulo de la liga en `seis_placas.py`, línea 13.
