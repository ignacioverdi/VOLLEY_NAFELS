# Revisión a fondo de la app — 26 de septiembre de 2026

Cinco revisiones en paralelo sobre el repo completo (60 pantallas, 35 JS, 130 scripts
de Python), y después una verificación a mano de todo lo grave. Lo que sigue es sólo
lo que confirmé yo mismo corriendo código o leyendo el archivo. Donde no pude
confirmar, lo digo.

---

## Antes que nada: una falsa alarma que conviene descartar

Tres de las cinco revisiones marcaron como **crítico** que tu base de Firebase estaba
abierta al mundo, porque en el repo está este archivo:

    FIREBASE_REGLAS_NAFELS.json
      ".read": true          <- toda la base, sin cuenta
      19 nodos con ".write": true

**No es lo que está puesto.** Lo probé contra tu base de verdad:

| Pedido sin cuenta | Respuesta |
|---|---|
| la raíz de la base | **401 · denegado** |
| el nodo `llave` | **401 · denegado** |
| `wellness` | **401 · denegado** |
| `calendario` | responde (y tiene que responder: lo usa el `.ics`) |

O sea: las reglas que están vivas en la consola son las correctas, y el archivo del
repo es de una versión vieja. Tu llave de cifrado **no** es pública y el wellness del
plantel **no** es público.

**Pero el archivo sigue siendo un peligro**, porque el día que alguien (vos, yo, o vos
dentro de un año) lo abra y lo pegue en la consola de Firebase "para restaurar las
reglas", abre la base entera de un golpe. Hay que borrarlo o reemplazarlo por las
reglas de verdad. Es cinco minutos y saca una bomba de la mesa.

---

# LO GRAVE DE VERDAD

## 1. El cifrado de los `.enc` se puede romper sin la llave — y lo hice

Éste es el hallazgo serio, y no depende de Firebase para nada.

**Qué hace hoy `cifrar_datos.py`:** cada archivo se mezcla con una corriente de bytes
`SHA-256(llave_del_archivo + número_de_bloque)`. La llave del archivo sale de
`SHA-256(LLAVE | nombre_del_archivo)`. No hay ningún número al azar en el medio.

**Qué significa:** para un archivo dado, la corriente de bytes es **siempre la misma**.
Hoy, mañana y el año que viene. Y el repo es público y guarda todas las versiones.

**La prueba, corrida hoy:** en el historial de GitHub, `mapa_videos_ent.js` quedó una
vez subido en claro (commit `b669fb4`) y también en su versión `.enc`. Con ese par
saqué la corriente de bytes, se la apliqué al **`.enc` de hoy, el que está vivo en
producción**, y salió esto:

    /* Links de YouTube (codigo del dvw -> link). Generado en Cargar Videos. */
    window.MAPA_VIDEOS_ENT = {
      "ENT20260903": "https://youtu.be/sGFl_TO2iEE",
      "ENT20260904": "https://youtu.be/-0-4Ouw4D68",
      ...

Sin la llave. Sin cuenta. Sólo con lo que está público en GitHub.

Y no hace falta ni ese golpe de suerte: los scripts que generan los datos también están
en el repo, y escriben cabeceras fijas (`// datos_partidos.js — <fecha>`,
`const PARTIDOS_GENERADO = "..."`). Con una cabecera conocida se recupera la corriente
byte a byte de cualquier archivo.

**Qué queda expuesto así:** el plan de partido, el scouting de rivales, los planteles,
la base de jugadores de la liga, los links de video. Todo lo que hoy considerás
protegido por el cifrado.

**El arreglo.** Cambiar a cifrado con número al azar por archivo **y por versión**:
AES-GCM, que el navegador ya trae de fábrica (`crypto.subtle`) y Python también
(`cryptography`). El número al azar va adelante del archivo, en claro — así tiene que
ser — y con eso dos versiones del mismo archivo ya no comparten nada. Es el cambio más
importante de toda esta lista. Toca `cifrar_datos.py`, `descifrar_datos.py` y
`datos_seguros.js`, y hay que recifrar todo una vez.

**Ojo con un detalle:** aunque lo arreglemos, **lo que ya está publicado en el historial
de GitHub sigue siendo recuperable para siempre**. Git no olvida. Así que el arreglo
protege de acá en adelante, no para atrás. Si hay algo del pasado que te preocupa de
verdad, eso se resuelve rotando la llave *y* sabiendo que las versiones viejas ya
están afuera.

## 2. El robot de GitHub puede vaciar la base del club solo, cada 10 minutos

Confirmado leyendo las tres piezas:

- `procesar.py` elige **la carpeta `DVW *` del año más alto** y no comprueba que tenga
  partidos adentro.
- `update_db_nafels_FULL.py:786` — si un partido que está en la base no está en la
  carpeta, **borra toda la base y la rehace desde cero**. Sin copia previa.
- `.github/workflows/procesar-partidos.yml` corre `*/10 * * * *` y termina con
  `git push`, sin ningún control de que el resultado tenga datos.

**El escenario:** creás `DVW NAFELS 2028` vacía para tenerla lista, o renombrás la
carpeta activa, o movés un `.dvw` de lugar. A los diez minutos, sin que toques nada: el
robot elige esa carpeta, la base queda vacía, se cifra vacía y se publica. La web queda
en blanco.

**Los tres frenos que hay que poner** (media hora entre los tres):

1. En `procesar.py`: si la carpeta no tiene ni un `.dvw`, cortar y no tocar nada.
2. En `update_db_nafels_FULL.py`: copiar la base a `.bak` antes de reescribirla. El
   motor de entrenamientos ya lo hace — es copiar esa línea.
3. En el workflow, antes de publicar: si la base nueva tiene menos partidos que la
   anterior, **fallar**. Éste solo te salva aunque fallen los otros dos.

## 3. No existe ningún respaldo de Firebase. Ninguno.

Busqué en los dos workflows, en los 130 `.py` y en los 40 `.bat`: **no hay un solo
script que baje la base**. Lo que vive únicamente ahí y desaparece si alguien lo borra:

wellness de todo el plantel · pesos, RM y evolución de cada jugador · las rutinas del
PF · las notas entre jugador y profe · el calendario y el fixture · usuarios, roles y
dorsales · el cuerpo técnico · los `.dvw` subidos desde la app que todavía no se
procesaron.

Los `.dvw` sí están a salvo: 122 versionados en git. Eso está bien pensado y es lo que
hace que casi todo lo demás sea reconstruible. Pero lo de arriba no sale de ningún
`.dvw`.

**El arreglo:** un workflow nuevo que una vez por día baje la base entera, la cifre y
la commitee en `respaldos/`. Con dos reglas que importan más que el respaldo en sí:
cifrarlo (tiene datos personales) y **fallar si el volcado pesa menos de la mitad que
el del día anterior** — un respaldo que guarda una base vacía es peor que no tener
respaldo. Lo puedo armar en una hora.

## 4. La llave: si se pierde el archivo, `cifrar_datos.py` inventa una nueva en silencio

`cifrar_datos.py:94` — si no encuentra `LLAVE.txt`, genera una llave nueva y sigue como
si nada. Entonces: clonás el repo en una máquina nueva (donde `LLAVE.txt` no está,
porque está en el `.gitignore`, bien), corrés el `.bat`, y termina con la mitad de los
datos cifrados con la llave A y la otra mitad con la B. En la app se ve como
"no pude abrir este archivo" y nada más.

Lo bueno: **hay tres copias de la llave** — tu PC, el secreto `LLAVE_DATOS` de GitHub, y
el nodo `llave` de Firebase. Eso está bien. Lo malo: no está escrito en ningún lado.

**Arreglo:** que `cifrar_datos.py` **nunca** genere una llave si ya hay `.enc` en la
carpeta (que corte y diga "traé LLAVE.txt"), y un `TRAER_LLAVE.bat` que la baje de
Firebase. Más un papel que diga dónde están las tres copias.

---

# LO QUE SE ROMPE HOY, EN USO NORMAL

## 5. El panel muestra números inventados como si fueran del jugador

`panel_voley.html:486` tiene valores de demo puestos a mano (`sq:-5, rec:29, bqpos:38…`)
para cuando no hay datos cargados. Y **`panel_voley.html` no carga nunca
`datos_historial.js`** (verificado: cero referencias). Así que esos números son
*siempre* los que se muestran.

Tocás cualquier jugador → se abre "MI PERFORMANCE VS EQUIPO" con -5% saque, 29%
recepción, 41% quick… **iguales para los 12 jugadores, todos los días.** Y se leen como
si fueran reales.

Esto lo pondría primero de todo si no fuera que los tres de arriba pueden hacer perder
datos. Arreglo: cargar `datos_historial.js` en esa pantalla y borrar el bloque de demo.

## 6. El freno de seguridad corta a mitad de partido

`firebase.js:427` corta la app a los **1200 pedidos**. El comentario que está tres
líneas más arriba dice *"5000 deja pasar el uso normal con margen de sobra"*. Alguien
bajó el número y no tocó el comentario.

El panel en vivo hace **3 escrituras por acción**. Un partido real de tu carpeta
(`NAFELS vs JONA`, 19/09) tiene 780 acciones → el corte llega alrededor de la acción
400, **en pleno tercer set**. Desde ahí el panel del compañero queda congelado, el plan
de partido en vivo deja de llenarse y la copia en la nube deja de subir. El único aviso
es una línea en la consola. El scouteo local sigue bien, así que nadie se entera hasta
que termina el partido.

**Arreglo: poner 5000, como dice el comentario.** Es cambiar un número.

## 7. Un código mal tipeado se marca en verde y se pierde

`scout_vivo.js:167` decide si el código está bien mirando **sólo la primera letra**
(s/r/a/b), no si se aplicó. Lo probé con el parser de verdad:

    ax14u   -> OK, aplicada=1   (bien)
    ax14w   -> OK, aplicada=0   <- valoración inválida, y sale verde
    sz14    -> OK, aplicada=0
    ax14    -> OK, aplicada=0   <- le falta la valoración

El asistente tipea `ax14w` en vez de `ax14u`, ve el ✓ verde, sigue. Ese ataque no se
cuenta nunca, y como queda guardado con estado OK, cada vez que se rehace el partido se
vuelve a descartar. **No hay forma de recuperarlo.**

Arreglo: `estado: (aplicadas>0 ? 'OK' : 'REVISAR')`. Una línea.

## 8. "Nueva sesión" borra la sesión anterior del mismo día

`scout_vivo.js:243` guarda con la clave `vb_scout_<fecha>`. Al tocar NUEVA, la sesión
nueva tiene **la misma fecha, o sea la misma clave**. Entrenamiento a la mañana,
entrenamiento a la tarde: a la primera acción de la tarde, la mañana desapareció. Y el
cartel promete *"Se guarda la actual con su fecha"*.

Arreglo: que la clave lleve también la hora de inicio.

## 9. Dos service workers peleándose: se cortan las notificaciones

`panel_vivo.html:8443` registra `sw.js`. Pero `onesignal_push.js` registra
`OneSignalSDKWorker.js` en el mismo lugar, y entra **uno solo**. El propio
`index.html:1468` lo explica: *"Por eso ya NO registramos sw.js por separado"* — se
saneó el index y quedó el panel.

Entonces: abrís el inicio (queda OneSignal, con los avisos) → abrís el panel en vivo
(lo reemplaza sw.js, **se cortan los avisos push**) → volvés al inicio (vuelve
OneSignal). Ping-pong cada vez que navegás.

Arreglo: **borrar esa línea de `panel_vivo.html`.** `OneSignalSDKWorker.js` ya tiene
adentro toda la lógica de funcionamiento sin señal.

## 10. La temporada archivada escribe sobre la temporada en curso

`temporadas/2025-26/firebase.js` apunta a la misma base y usa las mismas rutas. La
pieza que debería separarlas (`fbRuta()`) **no está definida en ningún archivo del
repo** — sólo se la llama con un `typeof fbRuta === 'function'` que siempre da falso.

Entrás a la cápsula 2025-26 a mirar el año pasado: el calendario que ves es el de
2026-27. Si tocás algo (una nota, un wellness, una rutina), **pisás la temporada
actual**. Hay 13 pantallas archivadas que escriben.

Arreglo: que el `firebase.js` de cada temporada archivada sea de sólo lectura (que
`fbSet` no haga nada). Es lo más simple y lo más seguro.

## 11. Lo que se carga sin señal no se sube nunca, y después se borra

Dos cosas encadenadas en `firebase.js`:

- **No hay cola de reenvío.** Busqué `cola`, `pendiente`, `reintent`, `queue`: no
  existe nada que reintente cuando vuelve la señal. Lo escrito queda sólo en el
  navegador.
- **Peor:** la primera vez que esa pantalla vuelve a pedir ese dato con conexión, la
  respuesta del servidor **pisa la copia local**. El trabajo hecho sin señal se borra,
  sin aviso.

Y el cartel dice *"Sin señal · se guarda igual"*, y `COMO_SCOUTEAR_SIN_INTERNET.txt`
dice *"se sube cuando vuelve la señal"*. Eso hoy es falso.

Arreglo en dos tiempos: **hoy**, cambiar el cartel para que diga la verdad ("guardado en
esta compu, hay que exportar"). **Después**, la cola de reenvío de verdad, que es medio
día de trabajo.

## 12. Guardar una lista pisa lo que cargó el otro

`fbSet` escribe el objeto entero (`PUT`), no el pedacito que cambió. Los que guardan
listas completas: el calendario de partidos, el de entrenamientos, el fixture, el
cuerpo técnico, los horarios de la semana, las tablas de Baggerone.

Vos cargás tres partidos desde la tablet. Sebastián tiene el calendario abierto desde
hace veinte minutos, agrega uno y guarda: **los tres tuyos se borran del servidor.**
Nadie ve un error.

Arreglo: un `fbUpdate` con `PATCH` para las listas, y una regla de oro que hoy no está:
**nunca escribir una lista vacía**.

## 13. Archivar temporada dice "Listo" aunque no haya guardado nada

`calendario.html:1089` — dos escrituras sueltas, ninguna espera a la otra, y el
`alert('Listo')` sale siempre. Sin señal: no se guardó nada y dice Listo. Si la primera
falla y la segunda funciona: **los partidos se borran del calendario y no quedan en
ningún lado.** El cartel dice explícitamente *"NO se borran: se guardan aparte"*.

Arreglo: encadenar — borrar sólo después de que el archivo se guardó de verdad.

## 14. Los eventos de varios días terminan un día antes — en Suiza

`calendario.html:958` suma el día sobre una fecha local y después la pasa a UTC.
Probado:

    Europe/Zurich        -> DTEND: 20261225   (debería ser el 26)
    America/Buenos_Aires -> DTEND: 20261226   (bien)

Las vacaciones de Navidad del 20 al 25 se exportan al calendario terminando el 24.
**En Argentina anda bien y en Suiza no**, que es justo donde se usa.

## 15. La separación por categoría del jugador no funciona

`firebase.js:100` es `function _fbCategoriaJugador(){ return; }` — desactivada. Nadie
escribe `vb_player_cat` en ningún lado del repo, sólo se lee. Resultado: **un jugador
de H1L o H2L ve el plantel, el wellness y el calendario de Primera.**

Y hay un segundo agujero: `selector_categoria.js` se carga **antes** que `firebase.js`,
así que cuando decide la categoría todavía no sabe quién es el usuario y trata a todos
como cuerpo técnico. Un jugador que abra `dashboard.html?cat=H1L` ve los datos de H1L.

Está documentado en tres lugares como si funcionara. O se enciende, o hay que sacar la
promesa.

---

# PERMISOS: la promesa de la web, medida contra el código

En la web decís, textual: *"Cada jugador ve únicamente sus propios datos y los de su
categoría. Sólo el cuerpo técnico accede a todo y puede modificar."*

**Hoy eso no se cumple del lado del navegador.** El rol vive en `localStorage.vb_role` y
todos los chequeos lo leen de ahí, así que un jugador que abra la consola y escriba
`localStorage.setItem('vb_role','coach')` pasa a ver y a poder tocar los botones de
cuerpo técnico. El servidor sigue mandando (por eso lo del punto 0 importa tanto), pero
la app no lo frena.

Y además, sin tocar nada:

- `wellness.html` y `prep_fisica.html` bajan **el nodo de wellness entero**, no el del
  jugador. La pestaña "Equipo" muestra la tabla de todo el plantel.
- `prep_fisica.html` dibuja un botón por cada jugador y deja abrir a cualquiera: su
  rutina, sus kilos, su historial y la nota del PF. **Cero chequeo de rol en toda la
  pantalla.**
- `jugador.html?num=3` abre el perfil del 3. Lo mismo `ataque_jugador`,
  `saque_jugador`, `recepcion_jugador`.
- `sesiones.html` se abre escribiendo la URL y tiene un botón "cerrar todas" que **echa
  a todo el cuerpo técnico de todos sus dispositivos** y les borra la llave. El único
  control es un cartel que dice "¿Tenés permiso?" después de intentarlo.
- `diagnostico.html` **ni siquiera pide entrar** y muestra el plan de partido.
- `alta_jugadores.html` se abre sin ser nadie, y las contraseñas de los jugadores son
  **su fecha de nacimiento** (8 dígitos).

Ninguna pantalla del repo tiene un portero de verdad: las ocho que mencionan el rol
sólo apagan botones. Lo que decide qué se ve es la lista de tarjetas del inicio, que
esconde links pero no cierra páginas.

**Qué haría, en este orden:**

1. Un portero de tres líneas al principio de cada pantalla de cuerpo técnico: si el rol
   no es coach, redirigir al inicio. No es seguridad de verdad (el rol sigue estando en
   el navegador), pero corta el 99% de los casos: el jugador curioso que escribe una URL.
2. Que `wellness` y `prep_fisica` pidan `wellness/<mi número>` en vez del nodo entero.
3. Cambiar las contraseñas por fecha de nacimiento. Es lo más fácil de adivinar que hay.
4. La seguridad de verdad son las reglas de Firebase, y ahí no puedo ver lo que está
   puesto. Lo que sí sé: tu base **no** es pública. Lo que habría que confirmar en la
   consola es si un jugador cualquiera puede *escribir* en `wellness` de otro, o en
   `roles`. Si puede escribir en `roles`, se hace coach para siempre.

---

# PESO Y VELOCIDAD (el celular al costado de la cancha)

Todo medido, no estimado.

| Pantalla | Hoy baja | Se puede dejar en | Qué hay que hacer |
|---|---|---|---|
| `jugador.html` | **5.707 KB** | 1.069 KB | borrar 3 links rotos + no cargar los `.enc` grandes al arranque |
| `dashboard.html` | **3.498 KB** | 795 KB | diferir `datos_entrenamientos` (1,4 MB) |
| `plan_partido.html` | 1.976 KB | 983 KB | diferir dos `.enc` |
| `analisis.html` | 1.870 KB | 644 KB | minificar el historial |
| `panel_vivo.html` | 1.686 KB | 1.147 KB | sacar las fuentes a archivos sueltos |
| `index.html` | 867 KB | 399 KB | partir `lang.js` |
| `wellness.html` | 726 KB | 258 KB | partir `lang.js` |

**Las tres que con menos trabajo dan más:**

**1. `lang.js` — 467 KB de más en 53 pantallas.** El archivo pesa 524 KB y el 91% es el
diccionario de inglés y alemán. Y en la línea 4183 está esto:

    if(lang==='es'||!text) return text;

O sea: **si el usuario está en español, esos 479 KB se bajan, se procesan y no se usan
nunca.** Y español es lo que sale por defecto. Cortando el archivo en dos y cargando el
segundo sólo si el idioma no es español: de 524 KB a 45 KB. En 53 pantallas.

**2. `datos_historial.js` — 203 KB de más, en 10 pantallas.** Está guardado con
sangrías, como JSON "lindo". Minificado pasa de 337 KB a 129 KB. Es agregarle
`separators=(',',':')` al `json.dumps` del script que lo escribe. **Una línea.**

**3. `jugador.html` pide 3 archivos que no existen.** `datos_video_ent_25-26`, `27-28` y
`28-29` — verificado, no están. Cada uno es un viaje de ida y vuelta al 404 que frena la
pantalla antes de seguir. Son tres líneas para borrar. Y la pantalla en total baja
5,7 MB, de los cuales 3,3 MB hay que descifrar en el teléfono: unos **3 a 4 segundos de
celular clavado** antes de ver nada.

**Lo más importante para el gimnasio, aunque cueste un poco más:** el service worker usa
"red primero, sin límite de tiempo". Eso anda bien con señal y anda bien sin señal
(salta enseguida al guardado). Pero el caso real del gimnasio es el tercero —**señal
mala**— y ahí el pedido no falla: se queda colgado esperando, con la copia guardada al
lado. Hacen falta ~10 líneas: correr el pedido contra un reloj de 2-3 segundos y usar la
copia guardada si no llegó. Y agregar `panel_vivo.html`, `plan_partido.html`,
`wellness.html` y `dashboard.html` a la lista de lo que se guarda por adelantado —hoy
ninguna está, así que si llegás al gimnasio sin señal y abrís el panel, te aparece la
pantalla de inicio.

**Del celular:** `panel_vivo.html` tiene 174 textos de menos de 14px (el número de zona
de la cancha está en **7px**) y 19 botones de menos de 44px de alto (varios de 26px),
más 56 globitos de ayuda que en una pantalla táctil no se ven nunca. Es la pantalla que
usás de pie, con una mano, durante un punto. `wellness.html` tiene dos tablas de siete
columnas sin contenedor, así que mete scroll horizontal en toda la página.

Aparte: hay **3 MB de imágenes** en el repo que ninguna pantalla usa (`error consola.png`,
`FONDOCAMISETA.png`, `foto 2.png`…) y que Vercel copia en cada publicación. Con el
problema de cuota que tuviste el 18/09, es una línea en `.vercelignore`.

---

# LO QUE ESTÁ BIEN, Y NO ES POCO

Para que la foto no quede injusta:

- **Los 122 `.dvw` versionados en git.** Es la mejor decisión del proyecto: la materia
  prima está a salvo y casi todo lo demás se reconstruye.
- **Las reglas de Firebase que están vivas** están bien puestas, mucho mejor que el
  archivo del repo.
- **La demo pública está bien hecha.** Llave distinta, y `HACER_DEMO.py` **verifica
  activamente** que la llave del club no aparezca en ningún archivo y que los `.enc` de
  la demo no se abran con la llave del club. El guard se puede saltear desde la consola
  —es JavaScript—, pero aunque se saltee no llega a nada del club real.
- **`recuperar.html`**, la caja negra de 12 fotos y el respaldo en IndexedDB: tres redes
  de contención reales para el scout en vivo.
- **`CONTROL_PANTALLAS.py`**, que compara cada pantalla contra la última versión buena y
  avisa si encogió. Nació de un incidente real y sigue trabajando.
- **`HACER_TODO.bat` frena** si falla el cifrado, con el cartel "NO PUBLIQUES".
- La llave nunca va al repo, y hay tres copias.
- El `api/calendario.js` está limpio: sólo lee el nodo público, no acepta nada del
  cliente, y ante un fallo devuelve un calendario vacío válido en vez de romper.

---

# POR DÓNDE EMPEZAR

**Esta semana, y son todos chicos:**

1. Poner 5000 en `firebase.js:427` *(un número)*
2. Borrar el `register('./sw.js')` de `panel_vivo.html:8443` *(una línea)*
3. Arreglar el estado del scout en `scout_vivo.js:167` *(una línea)*
4. Borrar los 3 `.enc` que no existen de `jugador.html` *(tres líneas)*
5. Cargar `datos_historial.js` en `panel_voley.html` y borrar los números de demo
6. Borrar o corregir `FIREBASE_REGLAS_NAFELS.json`
7. Los tres frenos del robot (carpeta vacía · `.bak` · no publicar una base más chica)
8. Cambiar el cartel de "sin señal" para que diga la verdad

**Después, por orden de importancia:**

9. El respaldo diario de Firebase *(una hora)*
10. El cifrado con número al azar *(medio día, y hay que recifrar todo una vez)*
11. El portero de rol en las pantallas de cuerpo técnico *(un día)*
12. Partir `lang.js` y minificar `datos_historial.js` *(una tarde, y se nota en todas
    las pantallas)*
13. El reloj en el service worker *(un rato, y es lo que más cambia la vida en el
    gimnasio)*
14. La cola de reenvío sin señal *(medio día)*

Decime por dónde arrancamos y lo hago. Los ocho de la primera lista los puedo dejar
hechos de una sentada.
