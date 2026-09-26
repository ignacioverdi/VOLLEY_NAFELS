# Análisis completo — 26 de septiembre de 2026

Tres revisiones en paralelo sobre el repo entero, y después verifiqué a mano todo lo
grave. Cada número de acá sale de un comando, no de una estimación. Lo que no pude
confirmar, lo digo.

Está dividido en cuatro partes:

1. **Lo urgente** — dos cosas, una peligrosa y una rota hoy
2. **Automatización y sincronización**
3. **Los tres idiomas**
4. **Panel en Vivo contra Data Volley 4**, punto por punto

---

# 1 · LO URGENTE

## 1.1 `ACTUALIZAR_NAFELS.bat` te borra el motor. Un doble clic.

Ése es el hallazgo más importante de todo el análisis.

Ese `.bat` pesa 161 KB y **1.544 de sus 1.622 líneas son un motor viejo escrito en
base64**. Lo que hace al arrancar, antes que nada:

```
línea   11   REM === 1) Reconstruir el generador desde el base64 embebido ===
línea   13   echo IyEvdXNyL2Jpbi9lbnYg...  >> "_gen_nafels.b64"
   (1.544 líneas de esas)
línea 1560   powershell ... WriteAllText('update_db_nafels_FULL.py', FromBase64String(...))
```

O sea: **escribe ese motor viejo encima de `update_db_nafels_FULL.py`**, que es el
corazón del sistema.

Lo decodifiqué y lo comparé con el que tenés hoy:

```
motor embebido en el .bat  :  1.700 líneas    88 KB    41 funciones
motor de hoy en la carpeta :  2.702 líneas   143 KB    56 funciones
                              ───────────────────────────────────
                             1.002 líneas y 15 funciones menos
```

Las quince funciones que desaparecerían no son detalles. Entre ellas:

| Función | Qué hace |
|---|---|
| `temporada_del_partido`, `_temp_filtro_de_argv` | separar las temporadas — sin esto se mezcla 25-26 con 26-27 |
| `_unificar_por_nombre` | unir al jugador que cambió de dorsal. Es el `[unificado] Minchev Valentin: el #7 absorbe al #55` que viste hoy en pantalla |
| `_puestos_corregidos` | corregir armadores y líberos mal declarados |
| `competencia_del_dvw`, `filter_teams_data`, `slug_equipo`, `nombre_corto` | filtrar por competencia y emparejar los nombres de los clubes |
| `_leer_dvw`, `_sin_tildes`, `eff_dig`, `_es_maquina`, … | el resto |

**Por qué existe:** fue el instalador original. Servía para crear el motor la primera
vez. Desde entonces el motor se arregló mil líneas y el `.bat` se quedó con la foto
vieja.

**Por qué es peligroso ahora:** `ACTUALIZAR_TODO.bat`, en su línea 28, **te manda a
correrlo**: *"Corre una vez ACTUALIZAR_NAFELS.bat (genera ese motor) y volve."* Un día
que algo falle, vas a hacer exactamente eso.

**Qué haría:** borrarlo. El motor está versionado en git, así que si alguna vez se
pierde se recupera con un `git checkout`. Y sacar esa línea 28 de `ACTUALIZAR_TODO.bat`.
Si te da cosa borrarlo, renombralo a `_NO_USAR_ACTUALIZAR_NAFELS.bat.viejo` y listo.

*(Si alguna vez se corrió, se nota: el motor pasa a tener 1.700 líneas. Hoy tiene 2.702,
así que no se corrió.)*

## 1.2 La tabla de la liga y el chat están rotos en la web, ahora

Lo probé contra tu sitio en vivo:

```
https://nafels.volley-stats.com/nla_stats.json       ->  404
https://nafels.volley-stats.com/nla_full_stats.json  ->  404
```

Los dos archivos están en `.vercelignore` (líneas 42-43), así que no se publican. Pero
las pantallas los piden con `fetch()`:

- **`nla_stats_table.html:630`** pide `nla_stats.json`. Cuando falla muestra, textual:
  *"No se pudo cargar nla_stats.json — verificá que esté publicado en la raíz del sitio."*
  Eso es lo que ve hoy cualquiera que abra la tabla de la liga.
- **`chat_nafels.js:135`** pide `nla_full_stats.json` y, al fallar, se queda con las
  listas vacías. El chat sigue abriendo pero **no sabe nada de ningún jugador**.

Y el robot nocturno (`actualizar-liga.yml`, 05:00 UTC) recalcula ese archivo todas las
noches **para nada**: lo genera, lo commitea, y Vercel no lo publica.

Lo curioso es que tu propio `.vercelignore` lo avisa. La línea 40 dice: *"OJO:
nla_full_stats.json lo pide el CHAT con fetch(). Si el chat deja de…"* — la nota quedó
escrita y el archivo quedó excluido igual.

**Qué haría:** sacar las dos líneas del `.vercelignore`. Los dos archivos juntos son
estadísticas agregadas de toda la liga, que es lo menos sensible que hay (vos mismo lo
anotaste así en `cifrar_datos.py`). Es un cambio de dos líneas y arregla dos pantallas.

Si preferís que no se publiquen, entonces hay que sacar esas dos pantallas del menú,
porque hoy prometen algo que no puede funcionar.

---

# 2 · AUTOMATIZACIÓN Y SINCRONIZACIÓN

## El mapa, de punta a punta

```
   ORIGEN                        PROCESO                        PUBLICACIÓN

 ① Sebastián scoutea      ──►  exporta .dvw  ──┐
   en Data Volley 4                             │
                                                │
 ② Panel en Vivo          ──►  exporta .dvw  ──┤
   (partido)                                    │
                                                ├──► A. lo dejás en la carpeta
 ③ Panel en Vivo          ──►  exporta .dvw  ──┤       y corrés HACER_TODO.bat
   (entrenamiento)                              │       ↓
                                                │    procesa todo + cifra + git push
 ④ subir_partido.html     ──►  Firebase        │       ↓
   (desde el celular)          'pendientes'  ──┘    Vercel publica en 1-2 min
                                    ↓
                             B. el robot de GitHub
                                cada 10 minutos
                                procesar_pendientes.py
                                    ↓
                                escribe el .dvw en la carpeta,
                                procesa y hace push
                                    ↓
                                Vercel publica

   + C. robot nocturno (05:00 UTC): recalcula la tabla de la liga
        …que hoy no se publica (ver 1.2)
```

**Los dos caminos automáticos funcionan** — el historial de git del 25/09 muestra a los
dos robots trabajando. Y desde hoy a la mañana, el camino A trae primero lo del robot
antes de procesar, así que ya no se pisan.

## Qué está automatizado y qué no

**Automatizado de verdad:** subir un partido desde el celular y que aparezca solo en la
web · procesar partidos y entrenamientos · generar las 5 páginas de heatmaps por club ·
cifrar antes de publicar · el respaldo de la base de entrenamientos · los tres controles
de calidad antes de publicar · los dos robots.

**Sigue siendo manual:** correr `HACER_TODO` (un doble clic) · cargar los links de
YouTube de cada video · cargar el plantel del rival · anotar tiempos y cambios durante
el partido · revisar los avisos de los controles.

De eso, lo único que vale la pena automatizar es el plantel de los rivales: se puede
importar una vez por temporada desde la web de la federación. El resto es de a un clic
y está bien así.

## Dónde se puede desincronizar

Los mismos datos viven en muchos lados. Los casos que el usuario ve:

| Puede quedar viejo | Cómo se nota | Estado |
|---|---|---|
| El `.dvw` está y la base no lo tiene | el partido no aparece en la web | **arreglado hoy** (HACER_TODO trae primero) |
| La caché del navegador contra lo publicado | ves la versión de ayer | resuelto: el service worker pide a la red primero |
| Los datos cifrados contra los `.js` en claro | "no pude abrir este archivo" | ojo con `ACTUALIZAR_FACIL.bat` — ver abajo |
| Firebase contra el navegador sin señal | lo que cargaste sin señal se pierde | **sin resolver** (está en el informe anterior) |
| La tabla de la liga contra el sitio | error en pantalla | **roto hoy** (punto 1.2) |

## Los `.bat` que hacen casi lo mismo

Tenés siete y sólo dos hacen falta:

| Archivo | Veredicto |
|---|---|
| **`HACER_TODO.bat`** | **el bueno.** Descifra, procesa todo, controla, cifra, publica |
| **`PUBLICAR_EN_GITHUB.bat`** | útil: publicar sin reprocesar |
| `ACTUALIZAR_NAFELS.bat` | **borralo** (punto 1.1) |
| `ACTUALIZAR_TODO.bat` | no descifra antes: trabaja sobre datos que no existen y el resultado se tira |
| `ACTUALIZAR_FACIL.bat` | lo mismo, y además puede vaciar los links de video de una temporada |
| `SUBIR_AHORA.bat` | duplicado de PUBLICAR_EN_GITHUB |
| `LIMPIAR_REPO.bat` | borra los `*.bak`, que son el único respaldo automático que tenés |

Tener cinco botones que hacen casi lo mismo con distinto grado de corrección es, en sí,
un riesgo: el día que uno falle vas a probar con otro.

## Los controles de calidad

| Control | Qué mira | Estado |
|---|---|---|
| `AUDITAR.py` | que las acciones de los `.dvw` estén todas en los datos | **arreglado hoy**: ya no avisa de más |
| `VERIFICAR_DATOS.py` | que cada pantalla encuentre los archivos que pide | funciona bien |
| `CONTROL_PANTALLAS.py` | que ninguna pantalla se publique cortada | funciona bien, nació de un incidente real |
| `REVISAR_ANTES_DE_PUBLICAR.py` | chequeos previos | funciona |

Lo que **ningún control mira**: que la base no encoja de una corrida a la otra. Es el
freno que falta, y es el que te salvaría del escenario del robot que mencioné en el
informe anterior.

---

# 3 · LOS TRES IDIOMAS

**Respuesta corta: no, no se traduce toda la app.** El HTML está bien —81% global, y
casi 100% en las pantallas que usa un jugador—. El problema es todo lo que no es HTML.

El diccionario, eso sí, está impecable y hay que decirlo: **3.089 entradas, y ni una
sola sin inglés ni sin alemán**. Busqué específicamente el caso peor —alemán que en
realidad es castellano disfrazado, que parece traducido y no lo está— y hay **cero
casos**. Los términos de vóley en alemán están bien elegidos.

## Las cinco cosas que hacen que un jugador suizo-alemán se cruce con castellano

**1. La pantalla de entrar está en castellano y no se puede traducir.** Verificado:
`firebase.js:579` la inyecta con `document.documentElement.appendChild(d)`, o sea
**hermana del `<body>`, no hija**. Y `lang.js:4274` observa y recorre sólo
`document.body`. El traductor no la ve, y nunca la va a ver. La cargan **54 de las 60
pantallas**: es literalmente lo primero que ve todo jugador. Dice *"Entra una sola vez
en este dispositivo"*, *"TU NUMERO O TU MAIL"*, *"Si no tenes codigo, pediselo al
cuerpo tecnico"*.

**2. La app arranca en castellano para todo el mundo.** `lang.js:346`:

```js
return (LANGS.indexOf(l) >= 0) ? l : 'es';      // no mira el idioma del celular
```

Un jugador de Näfels con el teléfono en alemán abre la app y la ve en castellano hasta
que encuentre el selector. Lo irónico: **la detección del navegador ya está escrita seis
veces en el repo** (en BIENVENIDA, en el chat, en los cuatro `hm_*`) y justo no está en
el motor central. Es una línea.

**3. La elección de idioma de la bienvenida se tira a la basura.** `BIENVENIDA.html`
guarda en `bienvenida_idioma` y **no tiene ni una mención a `vb_lang`** (verificado: 0).
El jugador nuevo llega, elige *Deutsch*, entra a la app… y la app está en castellano.
La primera decisión que toma se pierde. Es una línea.

**4. El traductor pisa 50 datos con su etiqueta.** Elementos que tienen `data-t` y que
el JavaScript rellena con un dato; 200 ms después el observer los reescribe con la
traducción fija. El peor caso, verificado en el código:

```js
<span id="nm-h" data-t="LOCAL">  →  document.getElementById('nm-h').textContent = M.home.name
```

En alemán, **el nombre del equipo en el marcador en vivo se convierte en "HEIM"**. Y el
visitante en "GAST". Lo mismo con la ficha del rival en `armadores` y `game_plan` (queda
el título traducido y desaparece el rival), el contador de sesiones del dashboard y el
cartel de estado de `prep_builder`. Sólo pasa en inglés y alemán, porque el observer
arranca con `if(lang==='es') return` — o sea que **el error es invisible para vos y le
pega justo a los que necesitan la traducción**.

**5. Los 104 carteles de `alert` y `confirm` están en castellano fijo.** No pasan por el
traductor porque no están en el DOM. Los más molestos: *"¿Guardar este scout en
«Partidos» antes de cerrarlo?"*, *"Tenés cambios sin guardar"*, *"No pude guardar el
corte. ¿Tenés permiso de cuerpo técnico?"*

## Lo demás

- **466 frases que el JavaScript escribe en pantalla** no están en el diccionario (de
  666 en total; el 30% sí está). Concentradas en `panel_vivo` (102), `prep_builder` (38),
  `alta_jugadores` (31).
- **97 `title` y `placeholder` en castellano.** 45 son los globitos de ayuda de la barra
  del scout.
- **Los decimales llevan punto en los tres idiomas.** En alemán el punto es separador de
  miles: una eficiencia de `12.5` se puede leer como 125. Hay 29 `toFixed()` y ningún
  formateo por idioma.
- **Las fechas van en formato argentino** en 19 archivos. En alemán se espera
  `dd.mm.yyyy`. Tres pantallas sí lo hacen bien (`index`, `importar_dvw`, `informe`) y
  el patrón correcto ya está escrito ahí para copiar.
- **Los días de la semana abreviados no están en el diccionario.** `Lun`, `Mié`, `Dom`
  se quedan en castellano en los tres idiomas. Los meses completos sí están.
- **24 pantallas no tienen selector de idioma**, entre ellas `wellness.html` y
  `jugador.html`, que son justo donde más vive un jugador y adonde caen directo desde
  una notificación.
- **`recuperar.html` no carga `lang.js`.** Es la pantalla de rescate de un scout perdido,
  se llega desde el panel en vivo, y está 100% en castellano. Si Sebastián la necesita
  en medio de un partido, la necesita en alemán.
- **`modelo_completo.html`** (el Modelo de Formación de las inferiores) está trabado en
  `LANG="es"` y tiene alemán a medias adentro que nadie puede alcanzar. Para un club
  suizo-alemán, ése es un documento que debería leerse en alemán.

## Por dónde empezaría

**Una tarde, todo de una línea:** el idioma del navegador como default · que BIENVENIDA
guarde `vb_lang` · `lang.js` en `recuperar.html` · las 14 frases de ayuda que faltan en
el diccionario · los listeners de cambio de idioma que faltan.

**Después:** la pantalla de entrar (un archivo, ~60 líneas, pero es la puerta) · los 50
que el traductor pisa · el envoltorio para los `alert` · fechas y decimales por un
helper único.

---

# 4 · PANEL EN VIVO CONTRA DATA VOLLEY 4

Comparado contra el manual oficial (`DVWin4_HandBook_Eng.pdf`, capítulos 2.5, 2.6 y
4.1-4.12) y contra archivos `.dvw` que generó el propio Data Volley y están en tu repo.

## El titular

**El panel es una réplica mucho más fiel de lo que yo esperaba.** El número que mejor lo
resume, medido sobre tu partido de ayer contra un partido scouteado en Data Volley por
otro scout:

```
                              Panel (AXP-FRE, 4 sets)   Data Volley (CHE-JONA, 3 sets)
acciones de jugador                    875                        701
acciones por punto                    5,21                       5,12
ataques con combinación             100 %                          —
```

La densidad de scouteo del panel es igual o mejor que la de un archivo profesional. Y
Data Volley 4 abre sus archivos sin quejarse: el de ayer tiene
`LASTCHANGE-PRG: Data Volley / Release 4.03.22 / Professional`, o sea que DV4 lo abrió,
lo procesó y lo volvió a guardar.

## A · El código de scouteo (manual 4.1) — paridad completa

Todos los campos del código de Data Volley están implementados, leídos al tipear y
escritos en el `.dvw`: equipo, dorsal (incluido `-1` = jugador desconocido), fundamento,
tipo de golpe, evaluación, las 78 combinaciones de ataque, zona de origen y destino,
subzona, destinatario del armado, el código extendido completo (tipos de golpe,
bloqueadores, quién recibe) y los "special codes" — y éstos **dependen de fundamento y
evaluación a la vez**, como manda el manual: no te ofrece "error de cuerpo" en una
recepción positiva.

Encima tiene tolerancias que Data Volley no tiene: acepta la evaluación después de las
zonas (`4SQ15#` = `4SQ#15`) y guarda el código en la forma estándar; y el código
compuesto ("dot coding") está implementado con reglas que el propio código anota con el
porcentaje con que las verificaron contra los 97 archivos.

**Lo único que Data Volley tiene y el panel no, en el código:**
1. Coordenadas exactas de trayectoria (3 puntos con el mouse). El panel deja el campo en
   blanco **a propósito y documentado**: *"preferimos un campo en blanco a un dato falso"*.
   Es la decisión correcta.
2. El interruptor zona/cono.
3. Marcar como error un carácter que no interpreta.

De ese tercero sale un hallazgo chico pero real: **4 de los 875 códigos de ayer tienen
basura pegada** y nadie se enteró — `a09SQ-~~~12~~~~SM`, `a11SQ!~~~66~~~~SQ`,
`a91SM=~~~53~~~~Q`, `a08AT#W4~49BH2~#`. Son errores de tipeo que el parser absorbe en
silencio. Data Volley los marcaría.

## B, C · La ventana y los comandos

**Los 14 comandos del manual 4.6 están todos, con el mismo nombre**: `NOTES`, `LIST`,
`LINEUP`, `INV`, `ROT`, `UPDATE`, `VER`, `END`, `P`, `S`, `T`, `C` (simple y doble).
`REPORT` y `STOP` están reconocidos pero sólo avisan.

Faltan dos alias que el manual también acepta: `FORM` (por `LINEUP`) y `AGGIO` (por
`UPDATE`). Son dos líneas.

**Sanciones:** las busqué en todo el manual y **no existen como comando en Data Volley
tampoco**. No es una falta del panel.

**Lo que el panel muestra mientras scouteás y Data Volley no:** el decodificador en vivo
del código que estás tipeando desarmado campo por campo, las tablas de eficiencia de los
dos equipos siempre a la vista, el análisis en vivo, las canchitas clicables para
origen/destino, y el ajuste automático del tamaño de letra para que un rally largo entre
en la caja.

**Lo que falta:** la cancha chica en la lista de códigos para ver la rotación de cada
acción. El panel **ya guarda ese dato** (`hl`/`al` por código), sólo no lo dibuja — y ya
tiene la función que dibuja exactamente eso.

## D · Puntos, rotaciones, cambios y tiempos — los lleva bien

Contrastado contra tu archivo de ayer:

- **168 líneas de punto.** Los parciales finales suman 44+39+47+38 = **168 exacto**. El
  marcador no se desfasó en cuatro sets.
- **137 rotaciones**, escritas sólo cuando la zona cambió — que es exactamente lo que
  hace Data Volley.
- **10 líneas de armador en cancha**, con el sufijo `>LUp` igual que el archivo genuino.
  Y si sale el armador en un cambio, **el panel pregunta quién arma** en vez de adivinar.
- Cierre de set: si decís que no, **cancela el fin de jugada anterior** — exactamente lo
  que describe el manual.
- Cambios: valida el tope, el dorsal repetido, y **rechaza el cambio de líbero** porque
  no es sustitución y no gasta cambios.

**Dos huecos, y los dos son de uso, no de código:**

1. **En cuatro sets de Liga Nacional A no se anotó ni un tiempo ni un cambio.** Cero
   líneas `*T` y cero `*c`. El panel los soporta perfecto, los botones están y validan
   todo; nadie los usó. El manual 4.9 explica por qué importa: sin los tiempos, Data
   Volley no arma bien la sincronización del video, y sin los cambios el análisis por
   rotación queda cojo.
2. El panel no pregunta los minutos del set al cerrarlo. Ver el punto siguiente.

## E · Entrenamiento — está, y en dos cosas es mejor

Tiene modo práctica, drills con marcador inicial, escribe la marca `**Drill` con las 27
columnas copiadas del archivo que hace Data Volley, y **en entrenamiento el set no se
cierra solo a los 25** porque un drill puede jugarse a tablero abierto. Además guarda una
copia de seguridad antes de cada drill nuevo.

Falta el `Alt+F` para cambiar el foco de cancha y el ícono distintivo en la lista.

## F · Lo que el panel tiene y Data Volley no

Verificado en el código, no de memoria:

1. **Corre en cualquier dispositivo, sin licencia y sin Windows.** DV4 pide Windows 8.1
   y licencia.
2. **Publicación en vivo por internet** al panel de análisis (DV tiene el Web Client,
   pero pide Java instalado y está pensado para la red del estadio).
3. **Video en vivo con delay regulable de 0 a 25 segundos**, conectándose desde otro
   dispositivo con un código de 4 dígitos.
4. **Mini reproductor por batería**: tocás "18 errores de recepción" y ves esas 18, con
   6 segundos antes y 4 después. Entre set y set eso es oro, y no tiene equivalente en
   Data Volley durante el partido.
5. **Caja negra doble**: 12 fotos en un almacén y 30 en otro, separadas a propósito
   porque el 09/09 falló uno y se llevó el respaldo con él. Si el guardado falla, salta
   una alarma visible y baja el archivo solo.
6. **Traer la sesión del otro dispositivo** y **unir dos copias del mismo partido**.
7. **Fin de jugada automático** con un código terminal: ahorra teclas en cada punto.
8. **Exporta en Windows-1252 desde el navegador** — 34 de tus 97 archivos viejos tienen
   los nombres rotos ("ChÃªnois GenÃ¨ve") por este problema, y el panel lo evita.
9. **Importa `.dvw`** y reconstruye todo.
10. **Preset de teclado español**, porque las teclas `ì è ù ò` del manual no existen en
    un teclado castellano. El manual ni lo contempla.
11. **Un chequeo que el manual no tiene:** que el que saca sea el de zona 1 del equipo
    que tiene el saque. Una rotación corrida arruina el partido entero y no se nota hasta
    el otro día. De los ocho chequeos propios del panel, ése es el más valioso.

**Lo que Data Volley tiene y el panel no, dicho de una:** informe impreso periodístico,
coordenadas exactas, captura de video desde placa, streaming, planilla electrónica y los
capítulos de análisis. Nada de eso se usa durante un partido, salvo el informe.

## G · Fidelidad del archivo — un error concreto

Escribe las 15 secciones del formato en el orden correcto, con las 78 combinaciones, las
18 llamadas de armador, y **1.202 líneas con su segundo de video** (o sea que la
sincronización se usa de verdad).

**Pero hay un campo mal**, y lo verifiqué contra tus propios archivos:

```
[3SET], última columna

  archivos hechos por Data Volley :  36 ; 34 ; 33      <- minutos que duró cada set
  archivo hecho por el panel      :  25 ; 25 ; 25 ; 25  <- el objetivo de puntos
```

El manual 4.10 lo confirma: *"insert the total duration of the set in minutes"*. El panel
escribe ahí el objetivo de puntos (25, 25, 25, 15). Que el quinto set dé 15 es
casualidad.

**Consecuencia:** en cualquier informe de Data Volley, todos tus sets duran 25 minutos.

Campos que quedan vacíos y Data Volley completa solo al reabrir el archivo (o sea, hoy
no molestan): fase del punto, número de video, color de camiseta, id de partido.
Campos que quedan vacíos y nadie arregla: la hora de reloj de cada acción (**la función
ya existe y ya se usa para los drills**: es una línea), entrenador y asistente, duración
total del partido.

Y un detalle: **7 de los 15 jugadores de Freiburg salieron como `auto1`…`auto7`** porque
el plantel del rival no estaba cargado. No es un problema del panel: no tenía de dónde
sacar los nombres.

## H · Qué mejoraría del panel, en orden

### Sin tocar una línea de código

1. **Anotar tiempos y cambios durante el partido.** Los botones ya están. Sin los
   tiempos, la sincronización del video de Data Volley queda mal.
2. **Cargar el plantel del rival antes del partido.** Diez minutos, y los informes
   dejan de tener `auto1`…`auto7`.

### Cambios de una línea, riesgo bajo

3. **La hora de reloj en cada acción.** Reemplazar el `''` de la columna 8 por
   `_horaDVW(c.t)`, función que ya existe. Hoy esa columna está vacía, así que no puede
   romper nada.
4. **Los alias `FORM` y `AGGIO`.** Dos comandos que hoy no hacen nada.
5. **Codepage `1252` en vez de `65001`.** Antes de tocarlo conviene probar: exportar un
   partido con un nombre acentuado y abrirlo en Data Volley tal cual sale del panel. Si
   se ve bien, no hace falta cambiar nada.

### Poco trabajo, buen retorno

6. **Los minutos del set.** Dos opciones: dejarlo vacío (un carácter — Data Volley
   mostrará el dato en blanco en vez de mal), o preguntarlos al cerrar el set como hace
   Data Volley (media hora, y el dato queda bien). Yo iría por la segunda, pero probando
   con cuatro sets de un amistoso antes de instalar.
7. **Avisar cuando un carácter cae en los personalizados.** Cazaría los 4 errores de
   tipeo de ayer en el momento. Es un aviso más, del mismo tipo que los ocho que ya hay.
8. **La cancha chica en la lista de códigos.** El dato ya se guarda y la función que lo
   dibuja ya existe.

### No lo haría

- **Coordenadas exactas de trayectoria.** En un partido en vivo de primera no lo hace
  nadie, ni en Data Volley. Sería rediseñar la carga de datos para un análisis que no se
  usa.
- **Informe impreso.** Ya tenés Tablas, Análisis, Baterías y el Plan de partido en vivo,
  todo en pantalla y actualizándose solo.
- **Streaming, captura desde placa, planilla electrónica.** Dependen de hardware y de
  Windows. El video con delay ya cubre la necesidad real.

---

# CÓMO LO ORDENARÍA

**Esta semana:**

1. Borrar `ACTUALIZAR_NAFELS.bat` y sacar la línea 28 de `ACTUALIZAR_TODO.bat` *(5 min)*
2. Sacar los dos `.json` del `.vercelignore` — arregla la tabla de la liga y el chat *(2 min)*
3. Las cuatro líneas de idioma: navegador por defecto, `vb_lang` en BIENVENIDA,
   `lang.js` en `recuperar.html`, las frases de ayuda que faltan *(una tarde)*
4. La hora de reloj y los alias del panel *(3 líneas)*

**Después, por valor:**

5. La pantalla de entrar en tres idiomas — es lo primero que ve cada jugador
6. Los 50 elementos que el traductor pisa (el "HEIM" en el marcador)
7. Los minutos del set
8. Limpiar los `.bat` que sobran
9. El freno que impide publicar una base más chica que la anterior

Todo lo de la primera lista lo puedo dejar hecho y probado, como lo de hoy: probando
antes, mostrándote el resultado, y con los originales guardados al lado.
