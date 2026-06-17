# 📋 ESTADO DEL PROYECTO — VoleyIQ / Volley Näfels
**Última actualización:** 17/06/2026
**Para:** Ignacio Verdi (Head Coach, Biogas/Axpo Volley Näfels)

> Este es el documento maestro para retomar. Si volvés y no te acordás dónde quedamos,
> empezá por acá. Está todo: lo hecho, lo pendiente y los datos técnicos clave.

---

## 1. QUÉ ES Y DÓNDE VIVE

- **App:** PWA de estadísticas + entrenamiento para el plantel (NLA suiza). Nombre futuro: **VoleyIQ**.
- **Repo (público):** github.com/ignacioverdi/VOLLEY_NAFELS
- **App en vivo:** volley-nafels.vercel.app (Vercel publica solo al hacer push, ~1-2 min).
- **Base de datos:** Firebase RTDB del proyecto `nafels-voley` (wellness, comentarios de clips, etc.).

### Cómo publicar (IMPORTANTE)
- ✅ **`PUBLICAR_EN_GITHUB.bat`** → sube SOLO la web. Es el que usás siempre.
- 🚫 **`ACTUALIZAR_Y_PUBLICAR.bat`** → **NO LO CORRAS hasta septiembre.** Reprocesa los 97 DVW
  viejos, resucita las stats 25-26 y se cuelga si la carpeta de DVW está vacía.
- Después de publicar: **Ctrl+F5** en el navegador para ver los cambios.

---

## 2. LO QUE YA ESTÁ HECHO ✅

### Notificaciones push (OneSignal) — FUNCIONANDO
- PC + iPhone suscriptos y probados.
- Botón flotante "🔔 Activar avisos" en index y perfil del jugador.
- iPhone: requiere instalar la PWA (Compartir → Añadir a inicio) y abrir desde el ícono.

### Revisión "elite" del perfil del jugador — LOS 9 PUNTOS, CERRADOS
1. **Pantalla "HOY"** — wellness del día (marca ✅ si ya lo hizo) + acceso a rutina + chip del próximo rival.
2. **Vista por rol** — el jugador ve solo lo suyo (+ Game Plan, Cortes, Scouting). El staff ve todo.
3. **Glosario** — desplegable que explica EFF, Total, Puntos, Wellness, RPE en criollo.
4. **Tendencia de wellness** — tira de 7 días con flecha ▲▼ en wellness.html.
5. **Tu lectura rápida** — por destreza: EFF + tendencia + frase ("venís subiendo", etc.).
6. **Mis Objetivos** — ya existía (bloque "MI PERFORMANCE VS EQUIPO").
7. **Próximo rival** — chip en HOY que linkea al scouting.
8. **Récords personales** — mejor partido, mejor EFF de ataque, puntos de la temporada.
9. **Video + comentario del coach** — en cortes.html: el coach escribe una nota por clip
   (se guarda en Firebase) y el jugador la ve cuando mira ese clip (a él, solo lectura).

### Pills de stats acumuladas (lo último que hicimos)
- Reemplazamos la barra pobre de "un solo número" por **los 5 pills del dashboard**, por jugador,
  con las fórmulas de EFF idénticas:
  - **Saque:** EFF · Total · Puntos · Errores
  - **Ataque:** EFF · Puntos · Bloqueados · Errores
  - **Recepción:** EFF · Total · Rec.#+ · Rec./=
  - **Bloqueo:** EFF#+ · Total
  - **Defensa:** EFF · Total · Perfectas · Errores (sale del video → carga liviana hoy)

---

## 3. PENDIENTES (no son bugs, dependen de algo externo)

1. **🔔 Recordatorio automático de wellness** — EN SUSPENSO esperando que definas
   **qué días y a qué hora entrenan**. Con eso armo un GitHub Action (cron → OneSignal API)
   y se manda solo. La REST API Key de OneSignal va en GitHub Secrets (la pegás vos, yo no la veo).

2. **🗓️ Septiembre — primer DVW de la 26-27:**
   - Ahí se "encienden" solas todas las features que hoy se ven vacías (lectura, récords, pills, tendencias).
   - Limpieza chica anotada: el parser de DVW (`importar_dvw.html`) todavía tiene variables viejas
     con el nombre "casla" adentro. No molesta, pero conviene limpiarlas cuando haya un DVW real para probar.

3. **📱 Prueba final en vivo** — todo está validado por código y visto en el demo con datos 25-26,
   pero en la 26-27 recién se verá con datos reales. Es el último chequeo natural, no un riesgo.

---

## 4. ARCHIVOS ENTREGADOS (estado)

| Archivo | Qué tiene | Estado |
|---|---|---|
| `jugador.html` | HOY, glosario, lectura, récords, rival, **pills nuevos** | ⚠️ Verificá que la versión con PILLS esté subida (`PUBLICAR_EN_GITHUB.bat`) |
| `wellness.html` | Tendencia de 7 días | ✅ Subido |
| `cortes.html` | Comentario del coach por clip | ✅ Subido |
| `index.html` | Vista por rol | ✅ Subido |
| `jugador_DEMO_2526.html` | **DEMO local** con datos reales 25-26 + selector de jugador | 🧪 NO subir — es tu banco de pruebas, abrir con doble click |

> Todos van a la **raíz** del repo. El DEMO es solo para mirar en tu compu.

---

## 5. DATOS TÉCNICOS CLAVE (para no buscar de nuevo)

- **OneSignal App ID (público):** `e958db4c-8946-401d-9af3-d7c024023da4`
- **OneSignal REST API Key:** SECRETA. Va en GitHub Secrets para la automatización. Nunca en el código.
- **Firebase RTDB:** proyecto `nafels-voley`. Paths usados:
  - Wellness: `wellness/<num>/<fecha>_<sesion>`
  - Comentarios de clips: `clip_notas/<modo>_<partido>_<tiempo>_<num>`
- **Claves internas (localStorage):** se renombraron de `casla_` a `vb_` (vb_role, vb_player_num, vb_pin_skip).
  Hay un "shim" de migración para que nadie pierda sesión.
- **Fórmulas de EFF (las del dashboard, oficiales):**
  - Saque = (Punto + 0.5·Vend + 0.25·Pos − Err) / Total
  - Recepción = (Punto + 0.5·Pos − 0.5·Vend − Err) / Total
  - Ataque = (Punto − Vend − Err) / Total
  - Bloqueo = (Pt + PtPos) / Total
  - Defensa = (Perf + 0.5·Buena − 0.5·Mala − Err) / Total

---

## 6. PARA RETOMAR LA PRÓXIMA VEZ

1. Si venís con **los días de entrenamiento** → cerramos el recordatorio automático de wellness.
2. Si estamos en **septiembre con el primer DVW** → limpieza "casla" del parser + prueba en vivo de todo.
3. Cualquier otra cosa → tenés el contexto completo acá arriba.

🏐 *Quedó prolijo. Hasta la próxima.*
