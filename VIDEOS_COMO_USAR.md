# 🎬 CÓMO CARGAR LOS VIDEOS

## El flujo (3 pasos)

### 1. Llenás el Excel
Abrís `videos_casla.xlsx` (o `videos_nafels.xlsx`).
- Tiene **una solapa por equipo** (River, Boca, UBA, etc.)
- Cada solapa viene **pre-llenada** con todos los jugadores y sus combos (ataques y saques)
- Buscás la solapa del equipo y pegás el link de YouTube en la columna verde **video_url**
- Las filas que dejás vacías no tendrán video (el botón queda atenuado)

### 2. Convertís el Excel a videos.js
```bash
python3 build_videos.py videos_casla.xlsx
```
Esto genera `videos.js` con todos los videos cargados.

### 3. Subís videos.js al repo
Subís el `videos.js` generado junto al `game_plan.html`.
Listo: el botón 🎬 de cada combo que tenga video se enciende solo.

## Cómo funciona
- El video se asocia a: EQUIPO + JUGADOR (número) + TIPO (ataque/saque) + COMBO
- Los videos viven en YouTube (no ocupan espacio en el repo)
- Al tocar 🎬 se abre el video en una pestaña nueva
- Funciona igual en los dos sistemas (CASLA y Nafels)

## Formato de los links
Cualquier link de YouTube sirve:
- https://youtu.be/abc123
- https://youtube.com/watch?v=abc123

## Para actualizar
Cargás más videos en el Excel → corrés build_videos.py → subís el videos.js nuevo.
El Excel es tu "base de datos" de videos, lo tenés siempre.

## NOTA
Si más adelante querés varios videos por combo, o que se reproduzcan
embebidos (sin salir a YouTube), se puede agregar. Por ahora: 1 video por combo, abre en YouTube.
