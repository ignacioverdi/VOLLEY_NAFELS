# RESUMEN COMPLETO — App de Scouting de Vóley (Näfels + CASLA)
### Para retomar en el próximo chat sin perder contexto

---

## 1. QUIÉN ES NACHO Y CÓMO TRABAJAR

**Nacho (Ignacio Verdi, usuario `ignacioverdi`)** — Head coach de vóley, argentino, nivel internacional. Español argentino, directo, usa MAYÚSCULAS cuando enfatiza. NO es programador. Él publica/despliega los archivos a los repos él mismo.

**Reglas de oro (aprendidas a los golpes en sesiones previas):**
- **HONESTIDAD CRÍTICA.** Nunca inventar métricas, manuales ni datos. Validar TODO contra archivos reales (DVW/.sq) y render (jsdom). Cuando no estás seguro, DECILO. Nacho ya me cazó varias veces afirmando haber verificado cosas que no había verificado.
- **PARCHEA, no reescribas.** Entregar archivos modificados vía `present_files`.
- **Cuando Nacho da un ejemplo que funciona (DataVolley), IMITALO FIEL.** No lo "mejores" con ideas propias. Inventá solo cuando te lo pide explícitamente.
- **Cuando hay un generador oficial en Python, PORTALO 1:1 y verificá contra su salida.** Un valor de analítica equivocado es PEOR que uno vacío.
- El SCOUT (panel_vivo) se usa en **PC con teclado completo**, igual que DataVolley — NO en tablet. La TABLET solo VE resultados en panel_voley. Usar teclas exactas de DataVolley (ENTER/INS/DEL). Nacho también quiere Backspace (tecla arriba de Enter) para borrar rápido/universal.

---

## 2. LAS DOS APPS (gemelas pero SEPARADAS)

**NÄFELS** (club suizo, NLA):
- Repo: `github.com/ignacioverdi/VOLLEY_NAFELS` (PÚBLICO)
- Deploy: `volley-nafels.vercel.app`
- Firebase: `nafels-voley`
- Código de partido: **6 dígitos**
- `index.html` title "NAFELS VOLEY"
- `panel_vivo` title "Panel en Vivo — Scouting de partido"
- `panel_voley` title "Stats Entrenamiento"
- `objetivos.js` = 12KB

**CASLA** (San Lorenzo, Argentina):
- Repo: `github.com/ignacioverdi/Voley-Stats`
- Deploy: `voley-stats-iota.vercel.app`
- Firebase: `casla-voley`
- Código de partido: **5 dígitos**
- `index.html` title "CASLA VOLEY"
- `panel_vivo` title "Scout en Vivo — CASLA"
- `panel_voley` title "Panel en Vivo — CASLA"
- `objetivos.js` = 17KB
- `plan_partido.html` tiene lógica PROPIA (mapa_videos, slugs argentinos)

**CRÍTICO: los dos `objetivos.js` NO son intercambiables. Los parches se aplican POR CLUB, no se copian.** Verificar título de cada archivo antes de entregar para no confundir clubes.

---

## 3. ENTORNO Y GOTCHAS TÉCNICOS

- **El contenedor SE RESETEA entre tareas.** Hay que re-clonar:
  - Näfels: `cd /tmp && git clone -q --depth 1 https://github.com/ignacioverdi/VOLLEY_NAFELS naf2`
  - CASLA: `git clone -q --depth 1 https://github.com/ignacioverdi/Voley-Stats casla2`
- **Manual DataVolley 4** extraído en `/tmp/dv4.txt` (~248.850 chars).
- **VALIDACIÓN = jsdom** en `/tmp/casla_test`. Patrón: quitar `<script src>` tags, `runScripts:"dangerously"`, en `beforeParse` stubear `w.fetch`, `w.fbSet`, `w.fbGet`, `w.confirm=()=>true`, `w.prompt=()=>...`, `w.localStorage` mock.
  - Para tests de panel_voley: inline objetivos.js (renderBaterias/bateriasVivo viven ahí): `h.replace(/<script src="objetivos.js"[^>]*><\/script>/,"<script>"+obj+"</script>")`.
  - **ERRORES CONOCIDOS de jsdom (NO son bugs de producción, IGNORAR):** "addEventListener null", "objClassify is not defined", "renderBaterias is not defined" (este último solo si no se inlineó objetivos.js).
- **Directorio de entrega:** `/mnt/user-data/outputs/`. Copias con nombre: `panel_vivo_NAFELS.html`, `panel_voley_NAFELS.html`, `objetivos_NAFELS.js`, `plan_partido_NAFELS.html`, `plan_partido_vivo_NAFELS.js` (y equivalentes _CASLA). **Deben renombrarse a los nombres planos al subir a cada repo.**
- CASLA vive en `/mnt/user-data/outputs/CASLA_ENTREGA/`.

### ACCESO A CHROME (navegador de Nacho)
- Tools `claude-in-chrome`. deviceId: `e2da327b-9ec8-4cbd-b492-2ff7c55a38a7` ("Browser 1", Windows, isLocal).
- Flujo: `select_browser` → `tabs_context_mcp{createIfEmpty:true}` → navigate/screenshot.
- **Las capturas NO se renderizan visualmente para mí.** Usar `javascript_tool` (action:'javascript_exec', text:...) para inspeccionar DOM/consola en su lugar. ESTA es la forma confiable de debuggear en vivo.
- `javascript_tool` BLOQUEA código que contenga URLs/query-strings ("Cookie/query string data"). Evitar imprimir `function.toString()` con URLs; filtrar/slicear.
- Error persistente inofensivo en consola: `panel_voley.html:1739 addEventListener null`.

---

## 4. FORMATO DE CÓDIGO DataVolley 4 (verificado contra manual)

**Código:** equipo(`*`=local/`a`=rival) + num(2 díg) + skill + type + eval.
- **SKILLS:** S(saque) R(recepción) A(ataque) B(bloqueo) D(defensa) E(armado/sEt) F(freeball).
- **TYPES:** H M Q T U N O.
- **EVALS:** `#`(punto/perfecto) `+`(positivo) `!`(admiración) `-`(negativo) `/`(vendida) `=`(error).
- **§4.1.3 Código extendido = 3 chars:** tipo de golpe + jugadores(bloqueo) + código especial. Se muestra en AZUL en la ventana de modificación.
- **§4.5.2 edición:** cursor sobre código + ENTER o doble-click abre ventana de modificación; INS inserta-antes; DEL borra-con-confirmación.
- **§4.9 Sustituciones:** botón "+" al lado del equipo, dos listas (SALE izq / ENTRA der), se pueden encadenar.
- **§4.10 cerrar set:** mensaje de confirmación + duración del set en minutos (va a Notas del Partido, NO al último campo de [3SET] que es siempre el objetivo de puntos 25/15).
- **§4.12 Práctica/Entrenamiento:** botón [Practice] en ventana del rival; scouteás tu propio equipo; [New Drill] con marcador inicial.

### FORMATO TIPEABLE (CRÍTICO — muy importante)
La barra acepta la forma CORTA tipeada, NO la interna del DVW. Para convertir un código del archivo DVW a tipeable: **tomar todo ANTES del primer `~`**.
- DVW `*15SM-~~~56C~~~00` → tipeable `*15SM-`
- DVW `a11EQ#K1C~3A~~~00` → tipeable `a11EQ#K1C`
- DVW `a09AQ-X1~38CH1~00F` → tipeable `a09AQ-X1`
- **NUNCA pasarle a Nacho el formato interno con `~~~` — NO entra en la barra.** (Ya cometí este error dos veces; verificar SIEMPRE que los códigos entren vía commit() antes de pasárselos).
- Los códigos auto (`*P04`, `*z5`, `ap00:01`, `**1set`) los genera el scout solo — NO se tipean. Los cambios de jugador (`ac14:06`) se hacen con el botón Cambio, NO se tipean.

---

## 5. EL PARTIDO DE PRUEBA

**Näfels vs Amriswil · 2026-04-12** (Näfels local).
- Archivo: `/tmp/naf/DVW NAFELS 2026/&2026-04-12 751238 BIO-AMRI(VM).dvw`
- Resultado: **3-2** (25-20, 18-25, 17-25, 33-31, 15-12). Partidazo de 5 sets.
- 2532 líneas de scout. 1318 acciones tipeables, 221 puntos.
- Estructura parseada en `/tmp/partido.json`. Códigos tipeables en `/tmp/tipeable.txt`.
- **Formación inicial:** NÄFELS `15,5,4,6,14,9` setter 9 (aunque el DVW muestra armador rotando; el titular real es #4 Vazquez). AMRISWIL `11,7,9,1,8,14` setter 1 (titular real #11 Bartholet).
- Näfels aparece como "Biogas Volley Näfels" / "Volley NÄFELS".
- **Rosters:** Näfels: 1 Deecke, 4 Vazquez, 5 Hesselholt, 6 Cabanas, 9 Broch, 11 Bartholet, 14 Figueiredo, 15 Nikolov... Amriswil: 1 Diem, 7 Goldrin, 8 Schalch, 9 Hauck, 11 Jovanovic, 14 Jukic...
- Näfels vs Amriswil hay 6 partidos en el repo; el 12-04 es el último.

### Listado de prueba que se le pasó a Nacho (12 puntos, formato CORTO, verificado 71/71 entran):
```
P1: *15SM- a14RM+ a11EQ#K1C a09AQ-X1 *05BQ+ *15DQ# *04EM#K7F *05AM/X9 a08BM#
P2: a07SQ+ *09RQ- *04ET# *09AT+X5 a09BT/ *08DT+ *14EH# *06AH#V6 a14BH! a01DH=
P3: *06SM# a07RM=
P4: *06SM- a07RM+ a11ET#K7F a14AT#X5 *06DT=
P5: a09SM+ *08RM- *14EH# *09AH+V5 a08BH/ *08DH+ *04AO# a10BO=
P6: *09SM- a07RM+ a11ET#K7F a14AT=X5
P7: *09SM- a07RM+ a11EQ#K1C a10AQ#X1
P8: a08SQ+ *09RQ- *04EQ#K7C *05AQ-X7 a10BQ+ a08DQ+ a01EH# a14AH-V5 *04BH+ *06DH+ *04ET# *14AT-X5 a11BT+ a14DT# a11ET#K7B a08AT#X8 *14BT=
P9: a08SQ- *09RQ+ *04ET#K1F *14AT#X5 a08DT=
P10: *05SM# a07RM=
P11: *05SM! a01RM! a11EQ#K7C a10AQ#XM
P12: a14SQ=
```

---

## 6. ARQUITECTURA DE LOS ARCHIVOS CLAVE

- **`panel_vivo.html`** (~486KB Näfels / ~480KB CASLA) — SCOUT EN VIVO (PC). Motor completo del código DV4, edición, sustituciones, tabla de partidos, baterías, modo entrenamiento, publica a Firebase `voley_codes`.
- **`panel_voley.html`** (~404KB / ~402KB) — panel de ANÁLISIS (tablet), lee en vivo de Firebase. Tiene: Podio, Objetivos, Baterías, Tabla, TV, y 5 botones de análisis (Distribución armador, Direcciones ataque, Direcciones saque, Zonas recepción, Plan de partido).
- **`plan_partido.html`** (~53KB) — Plan de partido con 4 solapas (Armador/Ataque/Saque/Recepción), alimentado en vivo vía `?vivo=1`.
- **`plan_partido_vivo.js`** (~13KB) — transforma códigos en vivo → estructura del plan. Expone `window.buildPlanVivo(liveData)`.
- **`objetivos.js`** (12KB Näfels / 17KB CASLA) — motor de baterías (bateriasVivo/renderBaterias/roundPy) + metas.

### FLUJO DE DATOS EN VIVO
`Scout (panel_vivo)` publica a Firebase `voley_codes` = `{ts, mid, codes:[{c,set,t,zh,za}], home:{name,names,lib,setter}, away:{...}}`.
`panel_voley` y `plan_partido?vivo=1` leen `voley_codes` de Firebase y refrescan.

### Fuentes Python (en el repo, `/tmp/naf2/`):
- `gp_builder.py`, `update_db.py` (generador de setters/game plan — FUENTE DE VERDAD del armador), `gen_plan_partido.py` (formato viejo del plan), `baterias_engine.py`.
- `liga_data.js` en `/tmp/naf2/temporadas/2025-26/` tiene setters POBLADOS con arrays `.s` reales.

---

## 7. TEST HARNESS (`/tmp/casla_test`, jsdom) — 468 TESTS, 0 FALLOS

Bancos: reg tauto ver srv comp audit2 hunt2 setrst pref edicion hunt4 lib2 lib3 orden set5 verifica atajos sq sq2 sqw equipos cmds manual133 tablas video extendido roster.
Integración: `todos.js` (75218/75218 códigos 100%), `secuencia8.js` (16280/16280), `multi.js` (16232 rotaciones). Baterías 1001/1001 vs Python. Armador 124/124 vs Python.
Regresión estándar: `node todos.js | grep idénticos` y loop de los 26 bancos.

---

## 8. TODO LO COMPLETADO (histórico + esta sesión)

### Sesiones previas (ver transcript viejo):
- Backspace fast-delete en scout (borra último/seleccionado sin confirmación, o letras si tipeás).
- Tabla de partidos (§9): `pv_partidos` lista múltiples partidos. Botón "📂 Partidos" → tabla (fecha/equipos/resultado/acciones), Abrir, checkbox+trash rojo con confirmación. "Nuevo partido" y "Cerrar" (guarda en lista, no destruye).
- Alineación a teclas DataVolley: ENTER modifica seleccionado, INS inserta-antes, DEL borra-con-confirmación, doble-click edita.
- Panel refresh sync: DESACTIVADO smartReload (hacía location.reload cada 4s y sacaba al usuario del menú). Scout incrementa `_rallyN` en endRally() y publica `voley_live.rally`. Tablet refresca heavy solo cuando cierra punto (`_lastRally`).
- panel_voley reorg: de 12 a 10 botones. ELIMINADO sistema viejo de baterías con VALORES DEMO FANTASMA (objCalcVals con {sq:-5,rec:29...} hardcodeados). Marcador tipo tablero. abrirPlan IN-APP (modal+iframe).
- Código extendido en ventana de edición (§4.1.3): #e-extendido con 3 selectores (ext-hit/ext-plr/ext-spec). syncExtendido() + aplicarExtendido() + fmtConTail().
- Modo Partido/Entrenamiento (§4.12): setModo(), reflejarModo(), nuevoDrill().

### ESTA SESIÓN (la más reciente):
1. **panel_voley — barra reorganizada:** Podio, Objetivos, Baterías, Tabla, TV, separador, y 5 de análisis. Sacados: Baterías duplicada, Reset, Historial, Game Plan.
2. **Marcador tipo tablero** en panel_voley (mk-hn/mk-hp/mk-ap/mk-an/mk-hs/mk-as/mk-set) con abreviaturas 3 letras. Y marcador compacto en el header (hs-hn/hs-hp... "NAF 12-9 AMR S2"), reemplazando el viejo "puntos equipo".
3. **Línea del RIVAL en la hoja de baterías:** renderBaterias() acepta 5º param `rivalVals`. Muestra Jugador / Equipo / separador / Rival (rival en rojo). renderBateriasPanel calcula el rival (lado opuesto). Se llena en vivo.
4. **Baterías de "Objetivos de equipo" (las del inicio):** renombradas a "OBJETIVOS DE EQUIPO" (sin año 2026). Ahora usan bateriasVivo (motor real) en vez de objCalcVals (fantasma). Formato renderBaterias. Se refrescan en vivo. renderBaterias omite fila "Jugador" si jugVals es null.
5. **Botones de análisis a 2 filas sin emoji** (clase hbtn2): "Distribución/armador", "Direcciones/ataque", "Direcciones/saque", "Zonas/recepción", "Plan de/partido". Barra más corta.
6. **Selector de idioma** movido ARRIBA al lado del "← Dashboard" (barra sticky superior), fuera del header principal.
7. **Alineación de baterías:** las etiquetas (nombre+% verde) ahora tienen mismo flex/min-width/max-width/padding (0 5px, max-width:110px) que las baterías → centradas exactas sobre su batería.
8. **BUG BATERÍAS EN SCOUT (panel_vivo) ARREGLADO:** había DOS funciones abrirBaterias (1644 modal m-bat + 3487 modal m-baterias) y DOS `id="bat-cont"` duplicados. La segunda pisaba a la primera pero renderizaba en el contenedor equivocado (oculto) → no aparecían baterías. Se ELIMINÓ el sistema viejo (modal m-bat + funciones renderBat/setBatSide/pintarBotonesBatEquipo/cargarSelectorJug + var _batSide). Quedó 1 abrirBaterias + 1 bat-cont. Verificado: con 1 código muestra baterías (46537 chars).
9. **BUG SOLAPA ARMADOR EN VIVO ARREGLADO (lo más reciente y grande):**
   - **Diagnóstico:** el plan tiene DOS generadores. Ataque/Saque/Recepción leen `TEAMS[TEAM].players` (que el vivo SÍ alimenta → funcionan: saque 1310 chars, recepción 667 chars, ataque 172 chars=poco). El ARMADOR lee `GPL.teams[ARM_SLUG[TEAM]].setters` (formato Game Plan que el vivo NO alimentaba). `ARM_SLUG['home']=undefined` → armTeam=null → sección escondida → VACÍA.
   - **Solución:** Porté `parse_setter_rallies` + `detectar_armadores` + serialización del array `.s` (19 campos) de `update_db.py` a `plan_partido_vivo.js`. Nuevo módulo con: CALL_LIST, CALL_IDX, RES_IDX, GP_COMBO_LIST/IDX, detectarArmadoresVivo(), parseSetterRalliesVivo(), rallyToS(), buildSettersVivo().
   - buildPlanVivo ahora también llena `window.LIGA_DATA.teams['home'/'away']` con `{name, setters, setter, matches, atk/srv/rec vacíos}`.
   - renderArmador (plan_partido.html): en vivo usa `slug=TEAM` directo (no ARM_SLUG).
   - **setter_pos:** el Python lo saca de cols 9/10 del DVW. El scout YA guardaba `zh`/`za` (zona de cada armador) en pushCode — solo faltaba PUBLICARLO. Ahora publica `zh`/`za` con cada código, y también el `setter` configurado. El port usa zh (local) / za (rival).
   - detectarArmadoresVivo prioriza el setter configurado (como el rol '5' del Python).
   - **VERIFICADO CONTRA PYTHON: 124/124 armados IDÉNTICOS** para el setter titular #4 (Vazquez) en el partido completo. Detecta Näfels #4/#14, Amriswil #11/#1.

### El array `.s` del setter (19 campos, para referencia):
`[0]=ridx(0 en vivo) [1]=0 [2]=set_num [3]=1 [4]=atype(fase 0=SO/1=TR) [5]=CALL_IDX[call] [6]=setter_pos [7]=RES_IDX[rec_quality] [8]=COMBO_IDX[atk_combo] [9]=RES_IDX[atk_result] [10]=atk_dest [11]=atk_orig [12]=match_idx(0 en vivo) [13]=t_start [14]=t_atk [15]=rec_zone [16]=rec_num [17]=atk_num [18]=rec_type]`
- CALL_LIST=['K1','K7','KM','K2','KC','KP','KE','KB','KO','KS']
- RES_IDX={'#':0,'/':1,'+':2,'!':3,'=':4,'-':5}
- GP_COMBO_LIST=["X5","V5","X1","XM","XC","XD","X2","X7","CB","CF","V3","X6","V6","X8","V8","XB","XR","XP","VB","VR","VP","JJ","P2","PP","PR","V0","X0","X3","X4","X9","XA","XL","XO","XT"]

---

## 9. ESTADO ACTUAL / BACKLOG / PENDIENTES

### Recién entregado (esperando que Nacho suba y pruebe):
- Solapa Armador en vivo (6 archivos: panel_vivo + plan_partido + plan_partido_vivo, x2 clubes). **Los 3 archivos de cada club van JUNTOS** (scout publica zh/za, plan lee slug, vivo arma distribución). Si sube solo uno, no anda.

### PENDIENTES:
- **Solapa ATAQUE muestra poco contenido** (172 chars, solo headers). Investigar por qué — puede necesitar más ataques o un fix menor. NO se investigó a fondo todavía.
- **Dos pruebas del mundo real que solo Nacho puede hacer:** (1) scout → exportar .dvw → abrir en DataVolley; (2) exportar equipo .sq → importar en DataVolley (chequear acentos — el panel escribe UTF-8; si sale con caracteres raros, cambiar a latin-1).
- Código viejo de baterías/reload comentado pero inofensivo.

### Estado del motor (última verificación): **75.218 códigos idénticos (100%), 468 tests / 0 fallos.**

---

## 10. TÍTULOS PARA NO CONFUNDIR CLUBES (verificar antes de entregar)
- panel_vivo_NAFELS: "Panel en Vivo — Scouting de partido"
- panel_voley_NAFELS: "Stats Entrenamiento"
- panel_vivo_CASLA: "Scout en Vivo — CASLA"
- panel_voley_CASLA: "Panel en Vivo — CASLA"

---

## 11. CÓMO RE-ARMAR EL ENTORNO AL EMPEZAR UN CHAT NUEVO
```bash
# 1. Clonar repos
cd /tmp && git clone -q --depth 1 https://github.com/ignacioverdi/VOLLEY_NAFELS naf2
cd /tmp && git clone -q --depth 1 https://github.com/ignacioverdi/Voley-Stats casla2
# 2. El manual está en /tmp/dv4.txt (si no, extraerlo del PDF del repo)
# 3. Los DVW de prueba en /tmp/naf/DVW NAFELS 2026/ (si no, están en el repo naf2 o los sube Nacho)
# 4. Test harness en /tmp/casla_test (re-crear los .js de test si el contenedor se reseteó)
# 5. Chrome: select_browser deviceId e2da327b-9ec8-4cbd-b492-2ff7c55a38a7
```
