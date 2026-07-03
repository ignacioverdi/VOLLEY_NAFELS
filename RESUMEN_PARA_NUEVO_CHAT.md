# RESUMEN PARA CONTINUAR EN UN NUEVO CHAT — Proyecto Plan de Partido (Näfels + CASLA)

> Pegá este resumen al inicio de un chat nuevo. Le da a un asistente todo el contexto para seguir sin repetir nada. Escrito por el asistente que viene trabajando con Nacho.

---

## 1) QUIÉN ES NACHO Y CÓMO TRABAJAR CON ÉL
- **Nacho = Ignacio Verdi**, entrenador de vóley profesional. Dirige en **Näfels** (Suiza, liga NLA) y en **CASLA / San Lorenzo** (Argentina). Habla en **español argentino**, directo, usa MAYÚSCULAS cuando enfatiza. **No es programador** pero trabaja a nivel internacional y quiere resultados **rigurosos y HONESTOS**.
- **Reglas de oro al trabajar:** PARCHEAR, no reescribir. VALIDAR antes de afirmar que algo funciona (idealmente render real, no solo sintaxis). Entregar SOLO los archivos que cambian con `present_files`. Nunca inventar métricas ni datos. Si algo puede estar mal targeteado, CONFIRMAR el objetivo antes de un laburo grande (se frustra, con razón, si se arregla lo que no era).
- Le gusta que le **cuentes qué vas a hacer antes** en tareas grandes, y que le **verifiques en vivo** después de publicar.

## 2) LAS DOS APPS (repos, deploy, datos)
**NÄFELS**
- Repo GitHub: `github.com/ignacioverdi/VOLLEY_NAFELS` (público). Deploy: **volley-nafels.vercel.app**
- DVW: carpeta `DVW NAFELS 2026` (~97 archivos). Código de partido = **6 dígitos** (ej. 636639), sale del nombre del archivo.
- Archivos clave: `plan_partido.html`, `plan_partido_data.js` (window.PP_DATA), `liga_data.js` (window.LIGA_DATA), `mapa_videos.js` (window.MAPA_VIDEOS), `game_plan.html` (referencia del armador), `index.html`, `chat_nafels.js`, `lang.js`.

**CASLA**
- Repo GitHub: `github.com/ignacioverdi/Voley-Stats` (público). Deploy: **voley-stats-iota.vercel.app**
- DVW: carpeta `DVW CASLA 2026` (**66 archivos = torneo completo**, 12 equipos, ida y vuelta). Código = **5 dígitos** (10100+), coincide con el código interno del DVW ([3MATCH]) y con las claves de mapa_videos.
- 12 equipos (id→slug): 516→defensores, 585→river, 541→hacoaj, 540→campana, 542→lomas, 584→boca, 509→ciudad, **586→sanlorenzo** (en liga_data el slug es **casla**), 545→untref, 511→ferro, 544→uba, 587→velez.
- Archivos clave: iguales que Näfels + `chat.js`, `game_plan.html`, `importar_video.html` (carga videos → genera mapa_videos.js).

## 3) FLUJO DE PUBLICACIÓN (lado de Nacho)
Suma DVW nuevos → corre el .bat de "hacer todo" (`ACTUALIZAR_Y_PUBLICAR` en Näfels / `HACER_TODO` en CASLA) que **regenera liga_data.js y demás**, y publica a GitHub → Vercel auto-deploya (~1-2 min) → **Ctrl+F5** por cache.
- **OJO IMPORTANTE:** el `plan_partido_data.js` **NO lo genera el bat de Nacho** (lo generan MIS scripts). Cada vez que suma DVW, el armador (liga_data) se actualiza solo, pero las **canchas de jugadores del plan de partido necesitan regenerar `plan_partido_data.js` aparte** y subirlo a mano. `mapa_videos.js` tampoco lo toca el bat (se maneja desde `importar_video.html`).

## 4) ENTORNO DEL SANDBOX Y GOTCHAS (críticos)
- `/home/claude/casla_v` = clon CASLA con `.git`. Para traer lo último: **`cd /home/claude/casla_v && git fetch origin && git reset --hard origin/main`**. (Mi copia se desactualiza; Nacho actualiza en su máquina y publica.)
- `/tmp/naf_repo` = clon fresco de Näfels (`git clone https://github.com/ignacioverdi/VOLLEY_NAFELS.git`). `/home/claude/nafels` es un clon VIEJO/incompleto — no confiar.
- **Red de bash:** solo github/npm/pypi. NO llega a vercel. `web_fetch` solo funciona con URLs que vinieron de una búsqueda (NO sirve para vercel privado). Para archivos actuales → clonar/pull del repo.
- **Navegador (claude-in-chrome):** conecta al Chrome de NACHO. `javascript_tool` es CONFIABLE; los **screenshots son inestables** (timeouts de 4 min). Navegar a un dominio nuevo pide **permiso de Nacho** ("Permission denied by user" si está afuera). Los screenshots del navegador **NO se ven en el chat de Nacho**.
- **VALIDACIÓN GOLD-STANDARD = jsdom.** Está instalado en `/tmp/casla_test/node_modules`. Se renderiza el HTML con la data inline (reemplazando los `<script src>` por el contenido) + un `window.MAPA_VIDEOS` mock, y se chequea el DOM (canchas, filtros, selects, etc.). Es más confiable que el navegador. Ejemplos de test en `/tmp/casla_test/` y `/tmp/naf_test/`.
- **Entrega:** archivos a `/mnt/user-data/outputs/` + `present_files`.

## 5) ESTRUCTURA DE DATOS (PP_DATA) Y DEL ARMADOR
- `plan_partido.html` carga: `liga_data.js` (armador) + `plan_partido_data.js` (PP_DATA) + `mapa_videos.js` + chat + lang.
- **PP_DATA** = `{slug:{name, info:{codigo:{opp,date,res,yt}}, players:[{id,num,name,pos,role,total,read,data:[[...]]}]}}`. Roles: `punta/central/opuesto` (ataque), `saque`, `reception`.
- **Filas de acción:**
  - Ataque: `[combo, phase, moment, recQ, zona, eval, sub, timestamp(7), matchcode(8), receptor(9)]`
  - Saque: `[tipo, oz, dz, eval, moment, timestamp(5), matchcode(6)]`
  - Recepción: `[tipo, oz, zonaCaida, rq, moment, timestamp(5), matchcode(6)]`
- **ROLECFG (índices que lee el HTML):** ataque `{court:4, evIdx:5, subIdx:6, tIdx:7, vIdx:8, tagIdx:0}` (punta además tiene filtro **Recibe idx:9**); saque `{court:2, evIdx:3, tIdx:5, vIdx:6, tagIdx:0}`; recepción `{court:2, evIdx:3, tIdx:5, vIdx:6}`.
- **Armador** (usa LIGA_DATA, no PP_DATA): `GPL.teams[slug].setters[i].s` = filas de **19 campos**. Índices usados: `r[5]`=llamada, `r[6]`=rotación/setter_pos, `r[8]`=combo (índice en `GPL.combos`), `r[9]`=resultado (0=punto), `r[11]`=origen, `r[12]`=match_idx, `r[13]/r[14]`=timestamps, `r[15]`=zona de recepción, `r[16]`=nº del receptor. `gpGetZone(combo, orig, setter_pos)` calcula la zona destino (misma convención que game_plan). **ARM_SLUG** mapea slug de PP_DATA → slug de LIGA_DATA (en CASLA `sanlorenzo→casla`, el resto igual).

## 6) GENERADORES DE DATOS
- **CASLA:** `/tmp/gen_casla.py` (DVW → `/tmp/allteams_casla.json`) + `/tmp/build_pp_casla.py` (→ `/mnt/user-data/outputs/plan_partido_data.js`).
  - `gen_casla.py`: TEAMS_MAP con los 12 equipos, lee DVW en **latin-1**, normaliza `\r\n`, matchcode = 5 dígitos del nombre, y en el ataque agrega el **receptor (rby) como idx 9**. `build_pp_casla.py`: clasifica roles (punta/central/opuesto/armador/líbero), **incluye TODOS los ataques** (no filtra por combo — clave para no perder los partidos con notación de combos distinta) y arma window.PP_DATA.
  - Correr: `cd /home/claude/casla_v && python3 /tmp/gen_casla.py && python3 /tmp/build_pp_casla.py`
- **NÄFELS:** para el receptor NO regeneré todo (riesgo). **Post-proceso** el `plan_partido_data.js` deployado: re-parseo los DVW → lookup `(matchcode, timestamp, atacante) → receptor` → le agrego `a[9]` a cada ataque. (Los generadores base gen_allteams+build_pp de Näfels se extrajeron del transcript `/mnt/transcripts/2026-07-02-04-08-09-plan-partido-nafels-scouting.txt`.)

## 7) FEATURES YA HECHAS (en AMBAS apps, quedaron funcionalmente iguales)
En las canchas de jugador: **Mín. pelotas por jugador** (saque/ataque, oculta zonas por debajo del mínimo), **filtros en una línea**, **Resultado multi-selección** con botones **Todos/Ninguno**, **doble-click en zona → video** de la jugada. En el ataque, filtro **Recibe** (por quién recibió, puntas/líberos por nombre). **Notas editables** por jugador (contenteditable, se guardan en localStorage del navegador). El armador tiene todos los filtros en **desplegables en una línea**: Fase, Recepción (#+/!−), **Recep. desde por zona** (Z1=1·9·2, Z6=6·8·3, Z5=5·7·4), **Recibe** (por jugador vía r[16]), Llamada. En saque, la etiqueta del "+" dice **"Positivo"** (antes "rompe").
- **Diferencias por diseño entre apps:** CASLA usa video **en vivo** vía `mapa_videos.js` + `ppVid()` y offset de clip **-2/+8 seg**, y **combo dinámico** (por la notación mezclada de algunos scouts). Näfels usa el `yt` **horneado** en INFO y offset 7/3, y combos fijos (su data es consistente).
- **index.html de Näfels:** el script "vista por rol" ocultaba el plan de partido a los jugadores; se **agregó `plan_partido.html` a la lista SHOW** para que lo vean todos.
- **Manual de Näfels** (`MANUAL_NAFELS_VOLEY.html`): se agregó la sección ★ "El Plan de Partido, en detalle".

## 8) PENDIENTES / ABIERTO
- **CASLA — combos raros:** ~23 de los 66 partidos fueron scouteados con otra notación de combos (W4/G4/Y8/J1…) que significan lo mismo que los estándar (W4=Rápida en 4 ≈ X5=Shoot in 4, G4=Alta en 4 ≈ V5, etc.). **Nacho los va corrigiendo en DataVolley a medida que necesita esos scouts.** Como el generador incluye TODOS los ataques, no se pierde nada mientras tanto. (Si querés unificar sin re-scoutear, se puede normalizar por la definición del [3ATTACKCOMBINATION].)
- **CASLA — video:** van **3 partidos cargados** (códigos 10151/10156/10164, todos de Campana). Nacho carga más desde `importar_video.html` → genera `mapa_videos.js`. El plan de partido ya lee esos links en vivo.
- **CASLA — video del ARMADOR:** no engancha porque `liga_data.js` de CASLA NO guarda el `code` del partido en su lista de `matches` (solo fecha/rival). Habría que agregarlo en `update_db_casla.py`. El video de las canchas de jugador SÍ anda.
- **CASLA — index.html:** falta chequear si tiene el mismo gateo por rol que ocultaba el plan de partido (como Näfels). Si sí, agregar `plan_partido.html` a su lista de vista de jugador.
- **Notas editables:** son **por navegador** (localStorage), no se publican ni se comparten. Si Nacho quiere notas compartidas/publicadas, es otro mecanismo (guardarlas en un archivo de datos).
- **Timing del video:** el clip cae según el timestamp del DVW; requiere que el video de YouTube arranque en el primer saque. Si cae corrido, se ajusta con offset.

## 9) ARCHIVOS DE TRABAJO ACTUALES (en el sandbox)
- `/tmp/pp_naf.html` = plan_partido.html **final de Näfels**.
- `/tmp/pp_casla2.html` = plan_partido.html **final de CASLA**.
- `/tmp/gen_casla.py`, `/tmp/build_pp_casla.py` = generadores de la data CASLA (con receptor).
- `/tmp/naf_repo` = clon fresco de Näfels. `/home/claude/casla_v` = clon CASLA (git, hacer `git reset --hard origin/main` para actualizar).
- Últimos entregables en `/mnt/user-data/outputs/`: `plan_partido.html`, `plan_partido_data.js`, `index.html`, `MANUAL_NAFELS_VOLEY.html`.

## 10) CÓMO SEGUIR (checklist rápido para el asistente nuevo)
1. Si Nacho pide cambios en el plan de partido: laburar sobre `/tmp/pp_naf.html` (Näfels) o `/tmp/pp_casla2.html` (CASLA). Si están viejos, clonar/pull del repo para tener lo publicado.
2. Validar SIEMPRE con jsdom (data inline + mock mapa_videos) antes de entregar.
3. Si toca la DATA (nueva feature que usa un campo nuevo en las acciones): regenerar. CASLA con gen_casla+build_pp; Näfels post-procesando desde DVW.
4. Entregar a outputs + present_files. Recordarle a Nacho: qué archivos subir, PUBLICAR + Ctrl+F5.
5. Cuando publica, verificar en vivo con `javascript_tool` (los screenshots fallan). Si cambia algo en una app, ofrecer replicarlo en la otra para que no se despeguen.
