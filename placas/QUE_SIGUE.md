# Qué sigue

Tres cosas que rompí y arreglé mientras no estabas, y después lo que
propongo, ordenado por lo que más te devuelve.

---

## Lo que ya está arreglado (bajate el zip)

### 1 · La placa de rotaciones se iba a romper en la primera fecha real

Es lo más importante de todo esto. La probé con cinco equipos y se cortaba.
Con seis y con ocho, peor. Nunca lo vimos porque el amistoso tenía tres.

**En la primera fecha real de la NLA son ocho.** La placa iba a salir con
media tabla afuera.

La rehice: ahora va **una sola línea por equipo** —escudo, nombre, las seis
rotaciones, side-out y break— en vez de dos bloques apilados. Entran los
ocho con aire de sobra. Y de yapa quedó mejor de leer: las rotaciones de
todos los equipos quedan alineadas en columna, así comparás el P1 de los
ocho de un vistazo, que antes era imposible.

### 2 · `verificar.py` no miraba el ancho

Solo chequeaba que la placa no se cortara para abajo. Una tabla que se pasa
del margen lateral no se corta: queda apretada contra el borde, y eso no lo
cazaba nadie. Me pasó justo con la de rotaciones nueva. Ahora mide las dos
cosas y lo reporta en la misma línea.

### 3 · Los nombres de los ocho clubes

El heurístico adivinaba bien pero *casi siempre* no alcanza para algo que se
publica. Ahora los ocho de la NLA están escritos, resueltos por el mismo
slug con el que se encuentra el escudo:

    NÄFELS · AMRISWIL · CHÊNOIS · COLOMBIER
    JONA · LAUSANNE · SCHÖNENWERD · ST. GALLEN

Los probé con doce formas distintas de escribirlos (con sponsor, con
abreviatura, con y sin acento) y salen los doce bien. Si alguno no te gusta,
está en `marcador.py`, arriba de todo, en `POR_SLUG`.

### 4 · Lo viejo se borra antes de escribir lo nuevo

Me lo pediste sobre el final y tenías razón: **ya te estaba pasando.** Al
agregar la portada y el cierre, las placas se renumeraron —`1-saque` pasó a
ser `3-saque`— así que en tu carpeta conviven las viejas y las nuevas, sin
manera de saber cuál es la buena.

Ahora cada paso borra lo suyo antes de escribir, y te dice cuánto borró:

    [1/4] Placas
       (borré 28 archivos de la corrida anterior que ya no van)

Qué borra cada paso:

| Paso | Borra |
|---|---|
| Placas | los PNG de la fecha y los de historias, los textos |
| Videos | los recortes de acciones (se vuelven a cortar igual) |
| Redes | los videos de YouTube y de TikTok |

**Rehacer redes (opción 7) NO borra los recortes**, porque volver a bajarlos
cuesta media hora. Eso es a propósito.

Y dos redes de seguridad: solo borra adentro de una carpeta que se llame
`fecha-NN`, `hasta-NN` o `acumulado` —si le pasás cualquier otra ruta no
hace nada— y solo borra lo que genera él. Si dejaste un archivo tuyo ahí
adentro, no lo toca.

### 5 · Ya no hace falta escribir el número de fecha

`fechas.ultima()` detecta la última que hay en la carpeta, y `--fecha ultima`
la usa. El lunes la última fecha es siempre la del domingo. Si querés, en el
`.bat` cambiás la línea para que Enter vacío sea "la última".

---

## Lo que propongo, por orden

### PRIMERO — Subir a YouTube solo (una tarde de trabajo, gratis)

Es el más fácil de los tres automatismos y el que ya aprobaste.

Números que verifiqué: la API de YouTube da **10.000 unidades por día** y
cada subida cuesta **1.600**, o sea **seis videos por día**. Vos subís uno
por semana. Sobra.

Lo que hace falta: una cuenta de Google Cloud (gratis), activar la YouTube
Data API v3, y autorizar **una sola vez** desde tu máquina. Después el
sistema sube el resumen con su título, su descripción y sus capítulos —que
ya se generan— sin que toques nada.

**Riesgo bajo.** Si falla, el archivo queda igual en la carpeta.

### SEGUNDO — La placa por partido, con foto (medio día)

Esto es el salto visual que quedó pendiente. Una placa por partido en vez de
las cuatro juntas, con un cuadro del video de fondo, oscurecido, y el
marcador enorme encima. Es exactamente lo que postea cualquier club.

Lo bueno: **no hace falta IA ni banco de imágenes.** `clips.py` ya baja los
partidos enteros para cortar las acciones. Saco un fotograma de la mejor
jugada de cada partido antes de borrar el video y lo uso de fondo. Material
real, del partido real.

Y te da cuatro piezas más para publicar, cada una compartible por el club
que la protagoniza — que es como te empiezan a seguir los otros siete.

### TERCERO — Instagram solo (posible, pero con trámite)

Lo verifiqué y **se puede**, con condiciones:

| | |
|---|---|
| Cuenta | Tiene que ser **Business**, no Creator |
| Permisos | Dos, y cada uno pasa por revisión de Meta |
| Revisión | **2 a 4 semanas**, con video mostrando el flujo |
| Límite | 100 publicaciones por día. Te sobra |
| Carrusel | Sí, de imágenes. Reels, uno por uno |

O sea: técnicamente resuelto, pero hay que bancarse el trámite con Meta. Yo
lo dejaría para cuando el canal ya esté caminando y publicar a mano te
empiece a molestar de verdad. Antes de eso, el trámite no se justifica.

### CUARTO — El acumulado de media temporada

La opción 2 (`--hasta`) ya existe y funciona, pero nunca la miramos con
ojos de contenido. Con seis o siete fechas encima, el acumulado es una
publicación distinta y más fuerte que la semanal: ahí los números ya no son
de una tarde, son de verdad. Y es el momento donde el siete ideal empieza a
significar algo.

No hay que programar casi nada. Hay que decidir **cuándo** se publica y con
qué texto, y eso lo pensamos juntos cuando llegues a la fecha 6.

### QUINTO — Alemán

Está a un diccionario de distancia. Copiar el bloque `'en'` de `idioma.py`,
traducirlo, llamarlo `'de'`. Dos horas.

La pregunta no es técnica: **¿te conviene un canal en inglés o dos canales,
uno por idioma?** Un canal en inglés le habla a toda Suiza y al mundo. Dos
canales es el doble de trabajo de publicación para un público que ya te
entiende en inglés. Yo arrancaría con uno y partiría solo si el alemán
empieza a pedirlo el público de Näfels.

---

## Dos cosas que NO haría

**Un bot que publique en TikTok.** La API de publicación de TikTok no está
abierta como la de Instagram, y aunque lo estuviera, en TikTok el tema
musical se elige al subir y eso es la mitad del alcance. Ahí tu minuto vale.

**Más placas por fecha.** Once ya es el límite de lo que alguien mira de
corrido. Si aparece una idea nueva buena, que reemplace a una, no que se
sume.

---

## Antes de la primera fecha real, acordate

1. Borrar `placas/historial.json` (tiene el amistoso como fecha 3)
2. Sacar los tres `.dvw` del amistoso de `DVW NAFELS 2027`
3. Dejar cuatro o cinco temas en `placas/musica/`
4. Decidir si la placa 10 (rotaciones) va pública: le dice a los rivales
   dónde sacarle a cada equipo

---

*Fuentes: [YouTube Data API v3 — cuotas](https://www.getphyllo.com/post/youtube-api-limits-how-to-calculate-api-usage-cost-and-fix-exceeded-api-quota) ·
[Instagram, publicar por API](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/)*
