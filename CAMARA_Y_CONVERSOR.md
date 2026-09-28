# Cómo filmar y cómo convertir — para que el radar mida los 54 saques

Son **dos cosas distintas** y las dos tienen que estar bien. Si una falla, la
otra no la salva.

1. **La cámara** decide cuántos píxeles y cuántos cuadros existen.
2. **El conversor de DataVolley** decide cuántos de esos sobreviven.

Hoy las dos están en el peor punto: la cámara graba **60i** (entrelazado) y el
conversor tira todo a **1280×720 a 2000 kbps**.

---

# A · La cámara — Sony HDR-CX675

## Paso a paso

**1.** Prender la cámara y tocar **MENU** (el botón en la pantalla táctil).

**2.** Entrar en **Calidad/Tamaño imagen**.

**3.** **Formato de grabación / Formato archivo**

| Opción | Qué es | Cuándo |
|---|---|---|
| **AVCHD** | archivos `.MTS`, los mismos de siempre | **elegir esta** |
| XAVC S HD | `.MP4` a 50 Mbps, el mejor | solo si hay tarjeta SDXC U3 **y** se probó antes en DataVolley |

Para el miércoles: **AVCHD**. No es momento de estrenar un formato que
DataVolley capaz no abre.

**4.** **Modo GRAB** → poner en **PS**.

| Modo | Qué graba |
|---|---|
| **PS** | **1920×1080 60p · 28 Mbps** ← esta |
| FX | 1920×1080 · 24 Mbps |
| FH | 1920×1080 · 17 Mbps |
| HQ | **1440×1080** · 9 Mbps ← no es Full HD |
| LP | **1440×1080** · 5 Mbps ← peor todavía |

Ojo con HQ y LP: dicen "1080" pero graban **1440 de ancho**, no 1920. Píxeles
estirados. Si hoy está ahí, ese es medio problema resuelto solo con moverlo.

**5.** **Imág. p. segundo** → cambiar de **60i** a **60p**.

Esta es la pantalla que me mandaste. Si **60p aparece en gris**, es porque el
Modo GRAB no está en PS: volvé al paso 4, ponelo en PS y volvé acá.

**6.** Salir a **MENU → Cámara/Micrófono** y revisar tres cosas:

| Ajuste | Ponerlo en | Por qué |
|---|---|---|
| **Obturador lento automático** | **Desactivado** | con la luz del gimnasio baja el obturador a 1/30 y la pelota sale como una raya de 40 cm. Es el que más ensucia la imagen. |
| **SteadyShot** | **Desactivado** (está en trípode) | el modo activo recorta y mueve el encuadre solo. Si el encuadre se mueve, la calibración deja de valer a mitad del partido. |
| **Zoom digital** | **Desactivado** | inventa píxeles, no los agrega |

**7.** Tarjeta. En PS son **~12,5 GB por hora** → un partido de 90 minutos son
**unos 19 GB**. Que entre, y que esté vacía.

## Lo que NO hay que tocar

Mismo lugar, misma altura, mismo trípode, **mismo zoom**. Si cambiás dos cosas
a la vez, después no se sabe cuál sirvió — y el encuadre es justo lo que me
deja comparar contra Rottenburg.

## Por qué 60p y no 60i

En 60i cada cuadro son en realidad dos fotos tomadas con 1/60 de segundo de
diferencia, mezcladas en tiras. Una pelota rápida aparece **dos veces, corrida**,
dentro del mismo cuadro. Se puede separar (mi cortador ya lo hace), pero cada
mitad tiene la mitad de las líneas: media resolución vertical.

En 60p son 60 fotos enteras por segundo. El doble de puntos por vuelo, todos
limpios. Es gratis y es el cambio más grande de todos.

---

# B · El conversor de DataVolley

La pantalla que me mandaste, la de **Convertir**.

## Paso a paso

**1.** En **Output**, cambiar de `MP4 HD - 1280x720 2000kbps` a:

| Opción | Veredicto |
|---|---|
| **Same as source** | **la mejor.** No recomprime: deja el video como salió de la cámara |
| **MP4 FHD - 1920x1080 4000kbps** | **la segunda.** Si "Same as source" queda muy pesado para scoutear |
| MP4 HD - 1280x720 2000kbps | **la de ahora. Es la que está tirando la mitad de los píxeles** |
| MP4 SD 852×480 · XviD 720×576 / 720×480 | ni mirarlas |

**2.** **Destildar `Use Speed Optimization`.**

Lo dice la propia ventana en amarillo: *"The quality is a little lower"*. Se
convierte más lento una vez; el video queda mejor para siempre.

## Cuál de las dos elegir

Probá primero **Same as source**. Si DataVolley se pone lento para saltar de
acción en acción, pasá a **MP4 FHD 1920×1080 4000kbps** — ahí ya estás en Full
HD igual, que es lo que importa.

## Lo que cambia en números

| | hoy | con FHD 4000 | con Same as source |
|---|---|---|---|
| ancho de la pelota en el fondo lejano | ~5 px | ~7,5 px | ~7,5 px |
| bitrate | 2,0 Mbps | 4,0 | 28 |
| puntos por vuelo (con 60p) | 8-10 | 16-20 | 16-20 |

Los 5 píxeles de hoy son el techo del que te hablé: lo que me da la escala de
la trayectoria es cuánto se curva por la gravedad, y esa curva mide 2 o 3
píxeles — el mismo tamaño que el ruido. Con 7,5 píxeles y sin la compresión
borroneando, pasan a ser 6 u 8. Ahí el fondo lejano debería entrar.

---

# C · La prueba de 2 minutos, antes del partido

No el miércoles a la mañana. **Antes.**

1. Filmar **30 segundos** en el gimnasio con los ajustes nuevos.
2. Pasar el archivo a la compu.
3. Abrirlo en DataVolley y convertirlo con la opción nueva.
4. Que se vea y se pueda saltar de acción en acción sin trabarse.

Si eso funciona, el miércoles no hay sorpresas. Si no, hay tiempo de volver a
AVCHD FH o a la opción FHD 4000, que también sirven.

---

# D · Después del partido

Lo de siempre: el **`.dvw`** y el video. Si Sebastián puede, que arrastre el
`.dvw` sobre **`CORTAR_SAQUES.bat`** y me mande los archivos por set — eso corta
del video bueno directamente y ya trae el mapa de qué saque es cada clip.

Si el video convertido quedó en "Same as source", cortar de ahí está perfecto.
Si quedó en FHD 4000, mejor apuntar el cortador **al archivo original de la
cámara**: los tiempos del `.dvw` sirven igual, porque la conversión no corta ni
mueve nada, solo recomprime.

---

# El resumen de una línea

**Cámara: AVCHD · Modo GRAB PS · 60p · obturador lento AUTO desactivado.
Conversor: "Same as source" y destildar Speed Optimization.**

Con eso se pasa de 5 píxeles de pelota a 7,5 y de 8 puntos por vuelo a 16. Los
26 saques del fondo lejano que hoy no puedo medir son exactamente lo que esto
ataca.
