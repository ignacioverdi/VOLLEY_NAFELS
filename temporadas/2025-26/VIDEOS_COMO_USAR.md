# 🎬 CÓMO FUNCIONAN LOS CORTES DE VIDEO (Partidos y Entrenamientos)

> Esta guía sirve para que cualquiera del cuerpo técnico pueda dejar andando los videos.
> El sistema **corta los videos solo**: usa el segundo de cada acción que ya viene
> adentro del archivo `.dvw` de DataVolley. Vos solo cargás **un link por partido/entreno**.

---

## 🧠 La idea en una frase
DataVolley (cuando scouteás **con el video cargado**) le pone a cada acción el **segundo**
en el que pasó. El sistema toma ese segundo + el **link de YouTube** del partido y arma los
**cortes**: el jugador se elige a sí mismo y cada acción abre el video justo en ese momento.

**Entonces hacen falta 2 cosas:**
1. El **`.dvw`** scouteado en DataVolley **con el video** (de ahí salen los segundos).
2. El **link de YouTube** del partido/entreno (lo pegás vos en *Cargar Videos*).

---

## 🏐 PARTIDOS — paso a paso

1. **Scouteás el partido en DataVolley con el video cargado.** (Es lo de siempre; es lo que pone el segundo a cada acción.)
2. Ponés el `.dvw` en la carpeta **`DVW NAFELS <año>`** (ej. `DVW NAFELS 2026`).
3. Subís el video del partido a **YouTube** en modo **"No listado"** y copiás el link.
4. Doble clic en **`ACTUALIZAR_FACIL.bat`** -> arma stats, scouting **y** los cortes (corre `build_video.py`).
5. Abrís **Cargar Videos** (botón del Hub) -> solapa **🏐 Partidos**.
   - Pegás el link en la fila del partido. Aparece la **miniatura** para confirmar que es el correcto.
   - (Atajo: *Pegado masivo* — pegás todos los links juntos, del más viejo al más nuevo, y se asignan por fecha.)
6. Apretás **"Generar archivo de links"** -> se descarga **`mapa_videos.js`** -> lo ponés en la carpeta del repo.
7. Doble clic en **`PUBLICAR_EN_GITHUB.bat`**.
8. ✅ Listo. El jugador entra a **Cortes de Video** (Hub), se elige, y ve sus acciones — cada una abre el video en su segundo.

> Los partidos **nuevos aparecen solos** en la lista de *Cargar Videos* cada vez que corrés `ACTUALIZAR_FACIL.bat`.

---

## 🏋️ ENTRENAMIENTOS — exactamente igual

1. **Scouteás el entreno en DataVolley con el video cargado.** ⚠️ **Esto es obligatorio para tener cortes** (es de donde salen los segundos). Si lo scouteás "en vivo" con el panel, tenés las **estadísticas sí, pero los cortes no**.
2. Ponés el `.dvw` del entreno en la carpeta **`DVW ENTRENAMIENTOS NAFELS <año>`** (ej. `DVW ENTRENAMIENTOS NAFELS 2027`). Si la carpeta no existe, la creás.
3. Subís el video del entreno a **YouTube** ("No listado") y copiás el link.
4. Doble clic en **`correr_entrenamientos_nafels.bat`** -> arma stats **y** cortes del entreno.
5. Abrís **Cargar Videos** -> solapa **🏋️ Entrenamientos** -> pegás el link de ese día -> **"Generar archivo de links"** -> se descarga **`mapa_videos_ent.js`** -> lo ponés en el repo.
6. Doble clic en **`PUBLICAR_EN_GITHUB.bat`**.
7. ✅ El jugador entra a **Cortes de Video -> solapa 🏋️ Entrenamientos** y ve sus acciones del entreno, igual que un partido.

---

## 📁 Qué archivo hace qué (por si hay que tocar algo)

| Archivo | Para qué sirve |
|---|---|
| `build_video.py` | El generador. Lee los `.dvw` y saca el segundo de cada acción. Lo corren los `.bat` solos. **No lo toques.** |
| `datos_video.js` | Los cortes de **partidos** (acciones + segundos). Lo arma `ACTUALIZAR_FACIL.bat`. |
| `datos_video_ent.js` | Los cortes de **entrenamientos**. Lo arma `correr_entrenamientos_nafels.bat`. |
| `mapa_videos.js` | Los **links** de YouTube de partidos. Lo generás en *Cargar Videos -> Partidos*. |
| `mapa_videos_ent.js` | Los **links** de YouTube de entrenamientos. Lo generás en *Cargar Videos -> Entrenamientos*. |
| `importar_video.html` | La página **Cargar Videos** (donde pegás los links; tiene las 2 solapas). |
| `cortes.html` | El **visor** donde el jugador mira sus cortes (tiene las 2 solapas). |

---

## ⚠️ La regla de oro
Para que un partido o entreno tenga **cortes de video**, tiene que estar **scouteado en
DataVolley con el video cargado**. De ahí salen los segundos. Sin eso, tenés las
estadísticas, pero los cortes no pueden saltar al momento de cada acción.

## Formato de los links
Cualquier link de YouTube sirve: `https://youtu.be/abc123` o `https://youtube.com/watch?v=abc123`.
Los videos viven en YouTube (no ocupan espacio en el repo).
