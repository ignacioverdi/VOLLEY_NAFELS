# Paso a paso

Probado de punta a punta sobre tus 97 `.dvw` de la 25-26 antes de mandártelo.

---

## PARTE 1 · Instalar (una sola vez, 5 minutos)

### 1. Verificá que tengas Python

Abrí una ventana de comandos (tecla Windows, escribí `cmd`, Enter) y poné:

    python --version

Si te contesta algo como `Python 3.12.1`, ya está. Pasá al paso 2.

Si dice *"no se reconoce como un comando"*, andá a **python.org/downloads**, bajalo
e instalalo. **En la primera pantalla del instalador tildá "Add Python to PATH"** —
si no lo tildás, no va a funcionar nada de esto.

### 2. Poné la carpeta en el repo

Copiá la carpeta **`placas`** completa adentro de tu repo `VOLLEY_NAFELS`.
Te tiene que quedar así:

    VOLLEY_NAFELS\
        DVW NAFELS 2027\        <- tus .dvw, como siempre
        baterias_engine.py
        gen_liga_stats.py
        nla_stats.json
        placas\                 <- la nueva
            INSTALAR.bat
            HACER_PLACAS.bat
            seis_placas.py
            fechas.py
            liga.py
            armador.py
            placas2.py
            PASO-A-PASO.md
            LEEME.md

**Tiene que estar adentro del repo**, al lado de `baterias_engine.py`. De ahí
saca los cálculos.

### 3. Doble clic en `INSTALAR.bat`

Tarda dos o tres minutos. Baja Playwright y un Chromium chico (unos 300 MB),
que es lo que dibuja las imágenes. Es la única cosa nueva que se instala.

Cuando diga **"Listo"**, ya está. No se repite nunca más.

---

## PARTE 2 · La primera prueba (ahora, sin esperar al sábado)

Doble clic en **`HACER_PLACAS.bat`**. Se abre este menú:

    1. Una fecha           (el lunes, con los 4 partidos)
    2. Acumulado hasta...  (durante la semana)
    3. Toda la temporada
    4. Ver que fechas detecta
    5. Salir

**Elegí la 4 primero.** Te muestra cómo agrupó los partidos:

    25 fechas detectadas en la carpeta:
      fecha  1  2025-10-11                3 partidos   (finde del 11/10)
      fecha  2  2025-10-19                4 partidos   (finde del 18/10)
      fecha  4  2025-11-01 a 2025-11-02   4 partidos   (finde del 01/11)

Fijate que los sábados y domingos vayan juntos y que cada fecha tenga los
partidos que corresponden. **Si algo no cuadra, mirá la Parte 4.**

Después probá la opción **3** (toda la temporada). Tarda como un minuto porque
lee los 97 partidos. Al terminar se abre sola la carpeta con las seis imágenes.

---

## PARTE 3 · La rutina de cada fecha

**Lunes**, con los partidos del finde ya scouteados:

1. Poné los `.dvw` en `DVW NAFELS 2027`, como hacés siempre.
2. Doble clic en `HACER_PLACAS.bat`.
3. Opción **1**, número de fecha, Enter.
4. Se abre la carpeta con las seis placas.

**Jueves**, para el acumulado:

1. Doble clic en `HACER_PLACAS.bat`.
2. Opción **2**, hasta qué fecha, Enter.

Nada se pisa: cada fecha queda en su propia carpeta.

    placas\salida\26-27\fecha-03\      <- las seis de la fecha 3
    placas\salida\26-27\hasta-03\      <- el acumulado hasta la 3
    placas\salida\26-27\acumulado\     <- toda la temporada

---

## PARTE 4 · Cómo sabe de qué fecha es cada partido

El `.dvw` **no trae el número de fecha adentro**. Sale del nombre del archivo.

### Camino exacto: poné `#NN` en el nombre

    &2026-09-19 #03 AXPO NAFELS vs JONA.dvw

Si el nombre trae `#03`, esa es la fecha. Sin adivinar. **Ya lo empezaste a
hacer: seguí con esa costumbre, es lo único infalible.**

### Camino deducido: por fin de semana

Si no trae `#NN`, agrupa por fin de semana usando la fecha del nombre.
**Sábado y domingo van siempre juntos**, y cada fecha se identifica por su
sábado.

Los partidos de entre semana se enganchan al fin de semana más cercano, porque
son postergados de esa fecha. Sobre tus 95 partidos fechados de la 25-26: el
80% se jugó sábado o domingo, y los de miércoles vienen de a uno o dos, nunca
de a cuatro.

### Si una fecha quedó mal agrupada

Renombrá esos archivos agregándoles `#NN` y volvé a correr. El `#NN` le gana a
todo lo deducido.

Los partidos sin fecha en el nombre (copa, amistosos) no entran en ninguna
fecha, pero sí en el acumulado de temporada.

---

## PARTE 5 · Si algo falla

**"python no se reconoce como un comando"**
No está instalado o no se tildó "Add Python to PATH". Reinstalalo de python.org
tildando esa casilla.

**"No module named playwright"**
Falta correr `INSTALAR.bat`.

**"No encuentro nla_stats.json"**
La carpeta `placas` no está adentro del repo. Movela al lado de
`baterias_engine.py`.

**"No existe la fecha 12 en esa carpeta"**
Te lista las que sí existen. Usá la opción 4 del menú para verlas.

**Salen menos de seis placas**
No hay volumen suficiente para algún fundamento. Con tres partidos jugados
puede pasar. El acumulado siempre da las seis.

---

## Qué hace por dentro

- **No reimplementa ninguna fórmula.** Los cálculos salen de tu
  `baterias_engine.py` y de `nla_stats.json`, que la GitHub Action ya regenera
  con cada `.dvw` que subís.
- **La temporada se detecta sola:** busca la carpeta `DVW ...` con el año más
  alto que tenga archivos, con el mismo criterio de tu `gen_liga_stats.py`.
- **El piso de volumen se adapta:** con tres partidos no exige lo mismo que con
  noventa y siete. Es el mayor entre un piso mínimo y el 40% de la mediana.
  Sin eso, el ranking lo ganaba el que hizo tres acciones y le salieron las tres.

## Para sumar otra liga

Si los `.dvw` de España entran a tu pipeline igual que los suizos:

    python seis_placas.py --carpeta "DVW ESPANA 2027" --temporada 26-27 --fecha 3

Y cambiás el rótulo de la liga en `seis_placas.py`, línea 13.
