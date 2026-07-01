# TRASPASO DE PROYECTO — Nacho (ignacioverdi) · Apps de análisis de vóley

> **Cómo usar este documento:** pegalo (o subilo) al inicio de un chat nuevo para poner al asistente al día con todo el contexto, el estado actual y cómo trabajar. Está escrito para el asistente que continúe.

---

## 0) CÓMO TRABAJAR CON NACHO (leer primero)

- **Quién es:** Nacho, entrenador principal de vóley. Argentino. **No es programador.** Habla directo, a veces en MAYÚSCULAS cuando algo lo frustra. Quiere calidad profesional y honestidad.
- **Idioma:** responder **siempre en español rioplatense/argentino** (vos, che, "quedó bárbaro", etc.).
- **Estilo de trabajo esperado:**
  - Ser honesto sobre límites; no prometer de más ni inventar.
  - **Parchar, no reescribir:** editar lo mínimo necesario, no rehacer archivos enteros.
  - **Validar antes de afirmar** que algo funciona (correr `node --check`, simular, verificar en vivo si se puede).
  - **Entregar solo los archivos que cambiaron**, listos para subir.
  - Un cambio = idealmente **un archivo a swapear** (él está cómodo reemplazando un HTML y publicando).
- **El asistente NO ve la pantalla ni el runtime de Nacho.** Trabaja en clones/sandbox. Para ver el estado real, o pide info, o entra por Claude en Chrome al sitio en vivo.
- **Flujo de publicación de Nacho:** descarga los archivos que le paso → los pone en su carpeta local del repo → corre un `.bat` (`PUBLICAR_EN_GITHUB.bat`) que hace push a GitHub → **Vercel auto-despliega**. Refrescar con **Ctrl+Shift+R**.

---

## 1) LOS DOS PROYECTOS

### A) NÄFELS — "Axpo Volley Näfels" (Suiza, liga NLA)
- **Repo:** `github.com/ignacioverdi/VOLLEY_NAFELS` — **PRIVADO**.
- **Sitio en vivo:** `https://volley-nafels.vercel.app`
- **Temporada:** oct → abr. **8 equipos NLA:** Amriswil, Chênois, Colombier, Jona, Lausanne, **Näfels** (equipo propio), Schönenwerd, St. Gallen.
- **Datos:** en **Firebase** (`calendario/partidos` + `calendario/entrenamientos`). Base de stats DVW: `nla_players_db.json`.
- **Como es privado, el asistente NO puede clonarlo** por bash. Se edita sobre clones/copias que ya tenía o sobre los archivos que Nacho sube. El sitio en vivo sí es público y se puede revisar por Chrome.

### B) CASLA — "San Lorenzo de Almagro / Voley-Stats" (Argentina, División de Honor)
- **Repo:** `github.com/ignacioverdi/Voley-Stats` — **PÚBLICO** (se puede clonar por bash con `git clone`).
- **Equipos en `liga_data.js`:** `casla` (propio) + `boca`, `river`, `velez`, `lomas`, `ciudad`, `untref`, `ferro`, `defensores`, `hacoaj`, `uba`, `campana`.
- **Datos:** `liga_data.js` (client-side, ~2.7MB, `window.LIGA_DATA.teams`), `casla_players_db.json` (~8.6MB), y archivos DVW en carpetas `DVW CASLA 2026/`.
- **Game plan universal:** `game_plan.html?rival=<slug>` arma el plan de cualquier equipo leyendo de `liga_data.js`.

---

## 2) ENTORNO Y LIMITACIONES TÉCNICAS DEL ASISTENTE (importante)

- **Red de bash:** solo permite **github / npm / pypi** (y mirrors). **NO** permite firebaseio ni sitios arbitrarios. → Se pueden clonar repos públicos (CASLA sí; NÄFELS no, es privado).
- **`web_fetch`:** solo abre URLs que ya aparecieron antes en la conversación (por búsqueda o fetch previo). No abre una URL "de memoria".
- **No se puede escribir a Firebase desde el asistente.** La app escribe a Firebase desde el navegador (helper `fbSet`). Por eso, para "cargar datos", se hace un botón en la app que Nacho aprieta (ej. importar fixture).
- **Claude en Chrome** (navegador "Browser 1", Windows) sirve para: revisar el sitio en vivo, e inspeccionar apps JavaScript (ej. la web de la federación suiza). Ojo con estos límites descubiertos:
  - **La salida de base64 por el navegador está BLOQUEADA** (no se pueden sacar bytes de imágenes por ahí).
  - **Descargas múltiples** las bloquea Chrome (hay que apretar "Permitir"); conviene disparar una por una o que el usuario permita.
  - La **salida de `javascript_tool` se trunca** en textos largos (~cientos de chars).
  - Antes de usar el navegador hay que **confirmar con el usuario cuál browser** usar (regla de seguridad).
- **Entrega de archivos:** se dejan en outputs y se presentan; Nacho los sube a mano y corre el `.bat`.

---

## 3) NÄFELS — TODO LO HECHO

### 3.1 Dossier de scouting de AMRISWIL (rival) — ENTREGADO
Análisis táctico completo a partir del scout DVW jugada por jugada (27 partidos de Amriswil, 97 sets; 6 vs Näfels).
- **Archivos:** `scouting_amriswil.html` (diseño dossier profesional) + `scouting_amriswil.md`.
- **Parser propio:** `scout.py` (lee `.dvw`, devuelve acciones con team/player/skill/tempo/combo/score/rotación). Ver sección 6 para el sistema de combos.
- **Métrica clave:** `EFICACIA = (kill − error − bloqueado)/total`, y contextos como filtros (side-out vs contraataque, calidad de pase, cantidad de bloqueadores).
- **Roles Amriswil (verificados):** Armador #11 Jovanović (tit.) / #4 Serramalera (doble cambio) · Opuesto #8 Schalch (tit.) / #5 Boon (2º) · Puntas #7 Goldrin, #6 Höhne, #14 Sunarić · Centrales #9 Hauck, #10 Ureña, #2 Dimov · Líbero #1 Diem.
- **Hallazgos principales:**
  - **Armador:** muy dependiente de las alas (77% punta+opuesto, 21% primer tiempo, pipe 7%). Con **pase malo abandona el medio** (central 4%) → juega alto y previsible a las alas (punta 50%, opuesto 46%). S1–S3 → 1ª opción Goldrin; S4–S6 → Schalch (35–36%). En pelota caliente (20+) se apoya en Schalch (37–40%). Repite tras error solo 26%.
  - **Ataque (eficacia):** Schalch **+38%** (independiente del pase +38/+39, pero **baja en contraataque** +44→+27; ataca 37% de 2ª línea "zaga por 9", va al cruce). Goldrin **+37%** (depende del buen pase, cae a +27 con pase malo). Höhne **+27%** (el ala más floja; el **doble bloqueo lo derrumba** +19). Sunarić **+30%** (se deja **bloquear 16% en doble**; peor receptor). Centrales letales pero bajo volumen: Dimov +59%, Ureña +52%, Hauck +51%.
  - **Saque:** "silent killer" **Hauck** (flotante, 6% error, rompe 24%). Potentes: Schalch (13% ace / 29% error → regala), Sunarić (23% error), Goldrin (9/14, el más controlado y peligroso). En serie cambian la zona, no el tipo.
  - **Recepción:** Diem 61% (líbero), Goldrin 58%, Höhne 54%, **Sunarić 52% (el más flojo, servirle a él)**.
  - **Bloqueo-defensa vs Näfels:** Cabanas #6 y Nikolov #15 les metieron 54% (insistir por ahí). A Hesselholt se lo bloquean bien (20% bloqueado).

### 3.2 Fixture 2026/27 en el calendario — ENTREGADO y DEPLOYADO
- **Fuente:** `fixture_NLA.xlsx` (Nacho lo subió). Parseado → **14 partidos** de la temporada 2026/27 (ida y vuelta con los 7 rivales, del **18/10/2026 al 13/02/2027**).
- **Modelo de dato del partido** (en Firebase `calendario/partidos`): `{id, fecha:'YYYY-MM-DD', hora:'HH:MM', lugar, rival, condicion:'Local'|'Visitante', mapa}`.
- **`calendario.html` modificado con:**
  1. **Botón "⬇️ Importar fixture 2026/27"** (pestaña Partidos): carga los 14 partidos de una, escribiendo a Firebase con `fbSet`. Es idempotente (no duplica; dedupe por fecha+rival+condición).
  2. **Escudos reales** de los 8 clubes al lado de cada equipo (con respaldo de monograma si falta un archivo).
  3. **Diseño del fixture en UNA LÍNEA, profesional:** fecha (día grande + mes + día de semana), escudo + nombre de cada equipo alineados, "vs" al medio, hora + lugar a la derecha, **📍 fijo que abre Google Maps**, **Näfels resaltado en verde**, borde teal si es local / naranja si es visita, hover. **Nombre completo** de los equipos (también en celular, con "…" si no entra).
  - Los entrenamientos quedaron con el diseño anterior (sin tocar).

### 3.3 Escudos reales de los clubes — RESUELTO
- **De dónde salieron:** de la web de la federación suiza `volleyball.ch/de/game-center` (liga NLA masculina, temporada 2026/27, `i_league=7088`). Es una app JavaScript (Next.js): los logos se cargan por API, no están en el HTML → se obtuvieron **por Claude en Chrome** leyendo el DOM.
- Los sitios de los clubes bloquean acceso automático (robots) y Wikipedia solo tiene el escudo del **pueblo**, no del club. Por eso se usó la federación vía navegador.
- Nacho terminó **subiendo los 8 PNG al chat**; se procesaron a **200×200 transparente** y se renombraron a: `nafels.png`, `amriswil.png`, `lausanne.png`, `stgallen.png`, `jona.png`, `chenois.png`, `schoenenwerd.png`, `colombier.png`.
- Van en una carpeta **`escudos/`** en la raíz del repo (al lado de `calendario.html`). El código busca `escudos/<nombre>.png`.

### 3.4 BUG resuelto — escudos anidados
- Síntoma: en el sitio salían los **monogramas** en vez de los logos.
- Causa (diagnosticada en vivo por Chrome): al descomprimir el zip, los archivos quedaron **anidados** en `escudos/escudos/*.png` en vez de `escudos/*.png`.
- Solución: dejar los 8 PNG **sueltos** dentro de `escudos/` (sin subcarpeta, sin zip). También se dejó una versión de `calendario.html` que tolera ambas ubicaciones (respaldo a `escudos/escudos/`). **Resuelto y confirmado por Nacho.**

---

## 4) CASLA — TODO LO HECHO

### 4.1 Selector de rival en el Game Plan — ENTREGADO
- **Problema:** empezaban los playoffs y **no se podía elegir sobre qué equipo hacer el game plan**. El `game_plan.html` es universal (arma el plan de cualquier rival vía `?rival=<slug>` leyendo `liga_data.js`), pero **no tenía selector**: si no venía rival en la URL, agarraba el primero de la lista, que era **`casla` (el equipo propio)** — un bug.
- **Arreglo (en `game_plan.html`):**
  1. **Selector de rival** en el header (un `<select id="rival-select">`) que lista los **11 rivales** (Boca, Campana, Ciudad, Defensores, Ferro, Hacoaj, Lomas, River, UBA, Untref, Vélez) ordenados alfabéticamente. Al elegir uno, recarga con `?rival=<slug>` y arma su game plan. Sirve para cualquier rival de playoff.
  2. **Fix del default:** ahora nunca cae en `casla`; si no hay rival, arranca en un rival de verdad.
- Estado: entregado; Nacho lo iba a probar/publicar.

### 4.2 Pendiente menor detectado (no tocado)
- El header de `game_plan.html` todavía dice **"Volley Näfels"** y **"NLA Suiza 2026/27"** — quedó del template del otro proyecto. Ofrecí ajustarlo a CASLA / liga argentina; Nacho no lo pidió aún.

---

## 5) DETALLES TÉCNICOS CLAVE (para no re-descubrir)

### NÄFELS — `calendario.html`
- Lee/escribe Firebase con helpers `fbGet(path, cb)` / `fbSet(path, arr)` (definidos en `firebase.js`). Paths: `calendario/partidos`, `calendario/entrenamientos`.
- Estructuras JS dentro del archivo:
  - `CLUBS` = mapa nombre→{ab (sigla), c (color)} para monogramas.
  - `ESCUDOS` = mapa nombre→`'escudos/<archivo>.png'`.
  - `crestHTML(name)` (viejo, monograma) y **`fxCrest(name)`** (el del fixture en una línea; usa `<img>` con respaldo a carpeta anidada y monograma si falla).
  - `fxDate(f)` = de `'YYYY-MM-DD'` saca {día, mes abrev, día de semana} (i18n es/en/de con `calT()`).
  - `FIXTURE` = array embebido con los 14 partidos.
  - `importFixture()` = carga el fixture a Firebase (idempotente).
  - `renderList()` = para **partidos** usa la fila `.fx` (una línea); para **entrenamientos** usa la `.entry` de siempre.
- CSS del fixture: clases `.fx`, `.fx-date`, `.fx-home/.fx-away` (`.us` = Näfels en verde), `.fx-cr` (escudo, `.mono` = monograma), `.fx-vs`, `.fx-meta`, `.fx-time`, `.fx-venue`, `.fx-map`. Responsive < 600px.

### CASLA — `game_plan.html`
- Carga `liga_data.js` → `window.LIGA_DATA` con `.teams` (slug → {name, rivals, atk, ...}).
- Rival elegido por `?rival=<slug>`; si no, primer equipo **que no sea `casla`**.
- El selector se puebla desde `LIGA_DATA.teams` (excluye `casla`) y al cambiar hace `location.search='?rival='+slug`.
- Otros archivos relevantes: `game_plans.js` (lista de planes pre-generados), `game_plan_<equipo>.html` (páginas estáticas por rival), `gp_builder.py` / `actualizar_gameplan.py` (builders), `scouting_rival.js`.

---

## 6) SISTEMA DVW Y VOCABULARIO DE NACHO (referencia para scouting)

**Parser:** `scout.py`. Cada acción trae: team (H/V), player, skill (S=saque, R=recepción, E=armado, A=ataque, B=bloqueo, D=defensa, F=freeball), tempo, ev (evaluación # + ! - / =), combo, set, score y las rotaciones (lineups).

**Evaluaciones:** `#` perfecto/punto · `+` positivo · `!` ok · `-` malo · `/` (en ataque = bloqueado) · `=` error. **La evaluación del saque es inversa a la recepción** (saque + = recepción rival mala).

**Vocabulario de combos de Nacho = "[tiempo] POR [zona]":**
- **1er tiempo central:** `X1` (adelante), `XM` (centro), `X2` (atrás), `X7`=SHOOT. *(Los códigos `K1/K2/KM/K7…` son **llamadas del armador**, NO ataques → excluir.)*
- **Corrida / slide:** `CB, CF, CS, XS` (y `KS`).
- **Punta (zona 4):** `X5` = rápida por 4 · `V5` = alta por 4.
- **Opuesto (zona 2):** `X6` = rápida por 2 · `V6` = alta por 2 (`X4, XO, XQ, X3` = rápidas por 2).
- **Pipe (zaga centro):** SOLO `XP, XB, XR, VP` (≈7%). *(No incluye V5/V6/V8 — error corregido en su momento.)*
- **Zaga por 9 ("D"):** `X8, V8` = opuesto de 2ª línea.
- **Zaga por 7 ("A"):** `X0, V0`.
- **Volcada/toque del armador:** `PP`.

**Código de ataque — dígito de bloqueadores:** el número que sigue a la letra de tipo de golpe (H=fuerte, P=finta, S=suave) es la **cantidad de bloqueadores**: 0-1 = sin/simple, 2 = doble, 3+ = masivo. (Se validó que a mayor dígito, baja el kill y sube el bloqueado.)

**Saque:** `Q` = potencia (salto), `M` = flotante.

**Ojo con nombres de archivo DVW:** los códigos de equipo en el nombre del archivo son **poco confiables** (ej. "BIO" = Näfels). Usar el mapeo real (en la NÄFELS DB, `games[].file` da el mapeo confiable).

---

## 7) ESTADO ACTUAL (a la fecha del traspaso)

- **NÄFELS · Calendario:** ✅ deployado y funcionando. Fixture 2026/27 (14 partidos) importable con botón, **diseño en una línea**, **escudos reales** cargando, 📍 a Google Maps, nombres completos. Bug de carpeta anidada **resuelto**.
- **NÄFELS · Dossier Amriswil:** ✅ entregado (HTML + MD).
- **CASLA · Game plan:** ✅ selector de rival + fix de default entregado; Nacho lo estaba probando/publicando.

---

## 8) PENDIENTES E IDEAS A FUTURO

- **NÄFELS:** cuando empiecen a jugarse los partidos, **mostrar el resultado/marcador** en el calendario y buscar la forma de que **se actualice solo (automático)**. ← lo próximo que quiere Nacho.
- **NÄFELS (opcional):** separador visual entre **ida y vuelta** en el fixture; escudos también en la vista **Planificación** (grilla).
- **CASLA (opcional):** corregir el header del `game_plan.html` de "Volley Näfels / NLA Suiza" a CASLA / liga argentina.
- **General:** seguir afinando el dossier/scouting con el vocabulario de Nacho; filtrar análisis a subconjuntos de partidos si lo pide.

---

*Fin del traspaso. Si algo de acá no coincide con lo que Nacho dice en el chat nuevo, gana lo que diga Nacho (esto es una foto del estado, puede haber avanzado).*
