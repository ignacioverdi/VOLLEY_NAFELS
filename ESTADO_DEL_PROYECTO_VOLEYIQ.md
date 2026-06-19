# 📋 ESTADO DEL PROYECTO — VoleyIQ (Näfels + Casla)
**Última actualización:** 19/06/2026
**Para:** Ignacio Verdi (Head Coach)

> Documento maestro para retomar en un chat nuevo. Si volvés y no te acordás dónde quedamos,
> empezá por acá. Tenés todo: los dos proyectos, lo hecho, lo pendiente, los bugs que arreglamos
> y los datos técnicos para debuggear.

---

## 0. LOS DOS PROYECTOS

| | **NÄFELS** (principal) | **CASLA / San Lorenzo** |
|---|---|---|
| Repo | github.com/ignacioverdi/VOLLEY_NAFELS | github.com/ignacioverdi/Voley-Stats |
| App en vivo | volley-nafels.vercel.app | (la URL de Vercel la tenés vos) |
| Base de datos | Firebase `nafels-voley` | (la suya) |
| Estado | Más avanzado | Lo estamos poniendo al día con Näfels |

Vercel publica solo al hacer push (~1-2 min). Después de publicar: **Ctrl+F5**.

### Cómo publicar
- **Näfels:** `PUBLICAR_EN_GITHUB.bat` (sube solo la web).
- 🚫 **Näfels:** NO correr `ACTUALIZAR_Y_PUBLICAR.bat` hasta septiembre (reprocesa 97 DVW viejos y se cuelga con la carpeta vacía).
- **Casla:** ver sección 6 (los .bat de datos).

---

## 1. GAME PLAN — página UNIVERSAL (compartida entre los dos)

El `game_plan.html` es **una sola página para todos los rivales**: lee `liga_data.js` y elige
el rival por la URL con `?rival=<slug>`. Calcula todo (recepción, armador, formaciones,
distribución por rotación) desde esos datos. Los dos repos usan la misma página.

**Slugs de rivales en CASLA:** boca, river, velez, lomas, ciudad, untref, ferro, defensores,
hacoaj, uba, campana. (`casla` = equipo propio, se saltea por default.)

### 🐛 Bugs que arreglamos en el Game Plan (en LOS DOS)

**1) Distribución del armador — pelotas que se descartaban.** La página repartía los ataques
por **código de jugada (combo)**, y cuando un ataque no tenía combo (queda como `"?"`) lo
**descartaba**. Resultado: el total decía 49 pero las barras sumaban 23.
- **Fix:** función nueva `gpZonaAtaque()` — usa el combo cuando está (clasifica bien los slides
  tipo X2), y si falta, **cae a la zona de origen del ataque `r[11]`**. Recupera todas las pelotas.
- **Validado exacto** contra DataVolley (Boca P1: z2=11, z3=23, z4=13, z8=1, con puntos y kill% iguales).
- También se arregló el total del encabezado para que **siempre cierre con la suma de las barras**.

**2) Planificación táctica que no cambiaba por rival.** La sección "CÓMO VAMOS A JUGAR" y las
notas por jugador se guardaban en `localStorage` con una clave **sin el rival**, así que lo que
escribías para un rival se mostraba en todos.
- **Fix:** las claves ahora incluyen `GP_RIVAL_SLUG`. Cada rival tiene su plan y sus notas.
- ⚠️ Las notas viejas (clave compartida) no migran — cada rival arranca con su texto auto-generado.

**3) Apellido vs nombre — SOLO CASLA.** Los datos vienen en orden distinto:
- **Casla:** "Apellido Nombre" (ej. `Acosta Sergio`).
- **Näfels:** "Nombre Apellido" (ej. `Ramon Diem`).
La función `ape()` (que saca el apellido) tomaba la última palabra → en Casla devolvía el nombre.
- **Fix (solo Casla):** `ape()` ahora toma todo menos la última palabra (maneja apellidos
  compuestos: `Requejo Borghese Felipe` → "Requejo Borghese"). **Näfels NO se tocó** (ya estaba bien).

---

## 2. SCOUTING DEL RIVAL — Casla

Se portó el diseño nuevo de Näfels (`scouting_rival.html`). Funciona con el `scouting_rival.js`
de Casla. Se llenan: serve, rematadores, recepción, sistema (con receivers), rotaciones.
- ⬜ **Falta "forma reciente"** (compara últimos partidos vs temporada): requiere que
  `gen_scouting.py` genere el campo `recent`. Hoy esa sección no aparece (se oculta sola).

---

## 3. APP DEL JUGADOR (Näfels) — lo hecho

- **Notificaciones push (OneSignal)** funcionando (PC + iPhone suscriptos).
- **Revisión "elite" — los 9 puntos cerrados:** pantalla HOY, vista por rol, glosario,
  tendencia de wellness 7 días, lectura rápida, récords, próximo rival, comentario del coach por
  clip (cortes.html), y "Mi performance vs equipo" (ya existía).
- **Pills de stats acumuladas:** la barra pobre de un solo número se reemplazó por **los 5 pills
  del dashboard** por jugador (Saque / Ataque / Recepción / Bloqueo / Defensa), con las fórmulas
  de EFF idénticas. (La Defensa sale del video; carga liviana hoy, se llena con video en temporada.)

---

## 4. PENDIENTES

1. **🔔 Recordatorio automático de wellness** (Näfels): en suspenso hasta que definas
   **qué días y a qué hora entrenan**. Con eso se arma un GitHub Action (cron → OneSignal API).
   La REST API Key de OneSignal va en GitHub Secrets (la pegás vos, no la ve nadie más).
2. **🗓️ Septiembre (Näfels):** cuando entre el primer DVW se "encienden" lectura, récords, pills,
   tendencias. Limpieza chica anotada: el parser `importar_dvw.html` tiene variables viejas con el
   nombre "casla" (inofensivas, limpiarlas cuando haya un DVW real para probar).
3. **📊 Scouting Casla:** actualizar `gen_scouting.py` para que genere `recent` (forma reciente).
4. **✅ Verificación final:** agarrar un game plan de Näfels y chequear que los totales cierren y
   los apellidos salgan bien (chequeo natural, no urgente).

---

## 5. CHECKLIST para verificar un Game Plan (cualquiera de los dos)

1. **Totales que cierran:** en cualquier rotación, el "X pelotas" del encabezado = suma de las barras.
2. **Apellidos:** Näfels → apellidos (Diem, Boon); Casla → apellidos (Acosta, Coto).
3. **Cambia por rival:** entrá a 2 rivales distintos y fijate que "CÓMO VAMOS A JUGAR" sea distinto.
4. **El número grande:** compará una rotación contra tu DataVolley (como hicimos con Boca).

---

## 6. PIPELINE DE DATOS / .BAT (Casla)

Dos análisis, **dos .bat distintos** — los dos leen los `.dvw` de la carpeta **`DVW CASLA 2026`**:

- 🎯 **Game Plan** → **`correr_casla.bat`** (corre `update_db_casla.py`) → genera `liga_data.js`
  (+ `casla_stats_table.html`, `datos_partidos.js`, `videos.js`, `proximo_rival.js`).
- 🔍 **Scouting** → **`ACTUALIZAR_SCOUTING_CASLA.bat`** (corre `gen_scouting.py`) → genera `scouting_rival.js`.

⚠️ Los .bat **solo cuentan los partidos cuyos `.dvw` están en la carpeta**. Si un rival figura con
menos PJ de los reales, faltan `.dvw` en la carpeta (no es bug del .bat).
❌ **No usar `correr.bat`** (es el sistema viejo de un archivo por rival).

Después de correr: subir esos archivos a Voley-Stats → Ctrl+F5.

---

## 7. DATOS TÉCNICOS (para no buscar de nuevo)

- **OneSignal App ID (público):** `e958db4c-8946-401d-9af3-d7c024023da4`
- **OneSignal REST API Key:** SECRETA → va en GitHub Secrets. Nunca en el código.
- **Firebase RTDB (Näfels):** proyecto `nafels-voley`. Paths:
  - Wellness: `wellness/<num>/<fecha>_<sesion>`
  - Comentarios de clips: `clip_notas/<modo>_<partido>_<tiempo>_<num>`
- **Claves localStorage:** se renombraron de `casla_` a `vb_` (con shim de migración, sin perder sesión).

### Esquema del "rally" del armador (en `liga_data.js`, clave para debug)
Cada entrada `r` del armador (`team.setters[0].s`) es un array:
`r[6]`=rotación · `r[7]`=calidad de recepción (0=#, 2=+, 9=transición) · `r[8]`=índice de combo
(-1 si no hay) · `r[9]`=resultado · `r[10]`=zona destino del ataque · **`r[11]`=zona de ORIGEN del ataque**.

### Fórmulas de EFF (las del dashboard, oficiales)
- Saque = (Punto + 0.5·Vend + 0.25·Pos − Err) / Total
- Recepción = (Punto + 0.5·Pos − 0.5·Vend − Err) / Total
- Ataque = (Punto − Vend − Err) / Total
- Bloqueo = (Pt + PtPos) / Total
- Defensa = (Perf + 0.5·Buena − 0.5·Mala − Err) / Total

### Formato de nombres (¡distinto en cada uno!)
- **Casla:** "Apellido Nombre" → `ape()` toma todo menos la última palabra.
- **Näfels:** "Nombre Apellido" → `ape()` toma la última palabra.

---

## 8. LIMITACIONES CONOCIDAS

- **El navegador (extensión Chrome) no conectó en toda la sesión** → no pude verificar en vivo;
  todo se validó por código y datos. El chequeo final visual lo hacés vos con Ctrl+F5.
- **Este chat quedó casi lleno** (la ventana de contexto se mide en ~100 "imágenes" de capacidad).
  Por eso conviene **seguir en un chat nuevo** — empezá pegando este documento.

---

## 9. PARA RETOMAR

1. Si traés **los días de entrenamiento** → cerramos el recordatorio automático de wellness.
2. Si es **septiembre con el primer DVW** → se enciende todo + limpieza "casla" del parser.
3. **Casla scouting** → actualizar `gen_scouting.py` para la "forma reciente".
4. Cualquier número que no cierre → traémelo y lo desarmamos (como Boca P1).

🏐 *Dos proyectos al día, bugs cazados de raíz, todo documentado. Hasta la próxima.*
