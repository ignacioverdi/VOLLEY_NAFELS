# Música para los videos

## La regla que cambia todo: TikTok e Instagram van SIN música puesta

Si publicás como cuenta de empresa —y vos vendés Volley-Stats, así que sos
empresa— TikTok te muestra solamente la **Commercial Music Library**: un
millón de temas ya licenciados para uso comercial. Cualquier otro tema, los
que suenan en los videos que ves todo el día, te lo silencian o te bajan el
video.

Y eso, que parece una limitación, en realidad te conviene:

1. El tema lo elegís **en la app, al subir**. Es gratis y está licenciado.
2. Un tema que está sonando esa semana **te empuja el alcance**. Un mp3
   pegado adentro del archivo, no: TikTok no lo reconoce como sonido suyo.
3. Si te arrepentís, cambiás el tema sin volver a renderizar nada.

Por eso los cortos de TikTok y los Reels conviene subirlos con el **sonido de
cancha nomás**, y ponerles el tema arriba en la app. El sonido de cancha no es
relleno: el golpe del remate y el grito del banco es lo que hace que la acción
se sienta. Poné el tema al 40-50% y listo.

Para eso corré:

    HACER_PLACAS.bat  ->  opción 1
    (y si querés sin música pegada: --sin-musica)

Instagram funciona igual con Reels: la biblioteca de audio de la app, y las
cuentas de empresa tienen su propia selección.

## YouTube sí lleva la música pegada

Ahí no hay biblioteca al subir, así que el tema va adentro del archivo. Como
el video promociona un producto, el uso es **comercial**: los planes gratuitos
de casi todas las bibliotecas NO lo cubren.

Lo que sirve, de menor a mayor costo:

| Dónde | Qué te da | Cuidado |
|---|---|---|
| **YouTube Audio Library** | Gratis, uso comercial, dentro de YouTube | Solo sirve para YouTube. Es lo más seguro para empezar |
| **Pixabay Music** | Gratis, uso comercial, sin atribución | A veces salta un reclamo de Content ID; se resuelve con el certificado de licencia que te da Pixabay |
| **Uppbeat** | El plan gratis es solo uso personal; el comercial arranca en el plan Pro | Ojo con esto: gratis NO te cubre |
| **Epidemic Sound / Artlist** | Catálogo grande, cubre todas las redes, incluido uso comercial | Es el estándar de los canales de deporte |

Mi recomendación para arrancar: **YouTube Audio Library** para el resumen
largo, y nada pegado en los cortos. Cuando el canal justifique el gasto,
Epidemic Sound y listo el problema para siempre.

## Qué tipo de tema buscar, por sección

No busques "música épica". Buscá por función:

- **Intro y placas de datos** — tempo medio, percusión seca, sin voz.
  Palabras clave: *minimal sports*, *stadium percussion*, *sport drum beat*.
- **Las acciones** — ahí manda el sonido de cancha. La música baja sola con la
  mezcla que ya hace `edicion.py` (cuando hay golpe o grito, el tema cede).
  Buscá: *driving hybrid*, *trailer percussion*, sin melodía marcada.
- **El cierre** — que resuelva y termine. *Uplifting outro*, *brand ending*.

Tres carpetas de Uppbeat que sirven de referencia aunque después compres en
otro lado: *Sports*, *Workout*, *Hip Hop / Trap instrumental*.

## Cómo se lo ponés

Todo lo que dejes en `placas\musica\` (mp3, wav, m4a) entra solo. Un tema por
corto, rotando, y cada uno arranca en un punto distinto del tema para que dos
videos seguidos no suenen igual. Si no hay nada en la carpeta, los videos
salen con el sonido de cancha y ya.

Sugerencia: dejá 4 o 5 temas y no más. Que el canal suene siempre parecido es
parte de la marca.

---

Fuentes: [Commercial Music Library de TikTok](https://ads.tiktok.com/help/article/how-to-use-the-commercial-music-library) ·
[Uppbeat, planes](https://uppbeat.io/pricing) ·
[Uppbeat, categoría Sports](https://uppbeat.io/music/category/sports)
