@echo off
chcp 65001 >nul
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cd /d "%~dp0"
setlocal enabledelayedexpansion
title NAFELS - HACER TODO
color 0B

echo.
echo  ==================================================
echo      NAFELS  -  HACER TODO  (un solo paso)
echo      Partidos + Entrenamientos + Publicar
echo  ==================================================
echo.

REM ===== Verificar Python =====
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] No se encontro Python. No puedo procesar los .dvw.
    echo  Instalalo desde python.org . Igual podes publicar mas abajo.
    echo.
    goto LINKS
)

REM ================= ABRIR LOS DATOS =================
REM  Los datos estan cifrados en el repo. El motor necesita leerlos,
REM  asi que los abrimos antes de procesar y los volvemos a cerrar al final.
if exist "LLAVE.txt" (
    echo  Abriendo los datos del club...
    python descifrar_datos.py
    if errorlevel 1 (
        echo.
        echo  [ERROR] No pude abrir los datos. FRENO aca para no romper nada.
        echo          Revisa el detalle de arriba y avisa antes de seguir.
        echo.
        pause & exit /b 1
    )
    echo.
)

REM ================= PARTIDOS =================
echo  ===================== PARTIDOS =====================
set "DVW_DIR=DVW NAFELS 2026"
set "ANIO=2026"
if exist "DVW NAFELS 2027\*.dvw" set "DVW_DIR=DVW NAFELS 2027"
if exist "DVW NAFELS 2027\*.dvw" set "ANIO=2027"

REM ===================================================================
REM   ETIQUETA DE TEMPORADA  (formato AAAA/AA, con barra)
REM   Los datos se guardan asi:  la 2025/26 = "2025/26",
REM   la 2026/27 = "2026/27".  De la carpeta DVW (ANIO) sale solo.
REM   TEMP_TAG  = etiqueta de la carpeta que se esta procesando.
REM   2026 -> "2025/26"   |   2027 -> "2026/27"
REM ===================================================================
set /a PREV=ANIO-1
set "YY=!ANIO:~2!"
set "TEMP_TAG=!PREV!/!YY!"

REM ===================================================================
REM   TEMPORADA QUE SE MUESTRA EN LA WEB
REM   Hoy la liga en curso es la 2026/27.  Como todavia no hay
REM   partidos cargados, esto deja TODO en 0 (correcto).
REM   Cuando arranque la 2027/28, cambia a "2027/28".
REM ===================================================================
set "TEMPORADA_ACTUAL=2026/27"

if not exist "!DVW_DIR!\*.dvw" (
    echo  [ATENCION] No hay .dvw en "!DVW_DIR!".  SALTEO partidos.
    echo.
    goto ENTRENAMIENTOS
)

echo  Carpeta: "!DVW_DIR!"   ^(temporada !ANIO!^)
echo.
echo  [1/4] Procesando partidos... (puede tardar, NO la cierres)
python update_db_nafels_FULL.py --dvw_dir "!DVW_DIR!" --temporada "!TEMP_TAG!" --output_dir . --filter_temporada "!TEMPORADA_ACTUAL!"
if errorlevel 1 echo      [aviso] Hubo un problema en partidos. Mira el detalle de arriba; sigo igual.
echo.
echo  [2/4] Scouting de rivales...
python gen_scouting.py --dvw_dir "!DVW_DIR!" --output_dir .
REM   El plan de partido se armo aca hasta ahora, pero se movio al final:
REM   necesita la carpeta de entrenamientos, que recien se resuelve mas abajo,
REM   y ademas tiene que correr aunque no haya partidos cargados todavia.
if errorlevel 1 echo      [aviso] Hubo un problema en el scouting. Sigo igual.
echo.
echo  [3/4] Videos destacados (si hay Excel)...
if exist "videos_nafels.xlsx" python build_videos.py videos_nafels.xlsx
echo.

echo.
echo  [4/4] Cortes de video de partidos...
python build_video.py "!DVW_DIR!" datos_video.js VIDEO_DATA
if errorlevel 1 echo      [aviso] Hubo un problema en los cortes de partidos. Sigo igual.
echo.
REM   Las acciones de bloqueo se arman al final: necesitan el video de los
REM   entrenamientos, que recien se genera mas abajo. Corriendo aca solo
REM   alcanzaban a ver los partidos.
echo  [4b/4] Acciones de bloqueo: se arman al final, con las dos fuentes.
if errorlevel 1 echo      [aviso] Problema en bloqueo. Sigo igual.

REM ---- contar cuantos videos quedaron cargados (mensaje claro) ----
set "NVID=0"
if exist "mapa_videos.js" for /f %%C in ('find /c "youtu" ^< mapa_videos.js') do set "NVID=%%C"
echo.
echo      ====================================
echo        VIDEOS CARGADOS EN LA APP:  !NVID!
echo      ====================================
echo      (si esperabas mas, revisa que el mapa_videos.js nuevo este en esta carpeta)
echo.

REM ================= ENTRENAMIENTOS =================
:ENTRENAMIENTOS
echo  ================== ENTRENAMIENTOS ==================
set "ENT_DIR="
set "ENT_ANIO=0"
for /d %%D in ("DVW ENTRENAMIENTOS NAFELS *") do (
    set "ENT_NOMBRE=%%D"
    set "ENT_A=!ENT_NOMBRE:DVW ENTRENAMIENTOS NAFELS =!"
    if !ENT_A! GTR !ENT_ANIO! (
        set "ENT_ANIO=!ENT_A!"
        set "ENT_DIR=%%D"
    )
)

if "!ENT_DIR!"=="" (
    echo  No hay carpeta de entrenamientos. SALTEO ^(es normal si no scouteaste practicas^).
    echo.
    goto LINKS
)

set "NDVW=0"
for %%F in ("!ENT_DIR!\*.dvw") do set /a NDVW+=1
if !NDVW!==0 (
    echo  La carpeta "!ENT_DIR!" no tiene .dvw.  SALTEO entrenamientos.
    echo.
    goto LINKS
)

echo  Carpeta: "!ENT_DIR!"   ^(!NDVW! practicas^)
echo.
echo  [1/2] Procesando entrenamientos...
python update_db_entrenamientos_nafels.py --dvw_dir "!ENT_DIR!" --temporada !ENT_ANIO!
if errorlevel 1 echo      [aviso] Las stats de entrenamiento dieron error, pero los cortes igual se generan. Sigo.
echo.
echo  [2/2] Cortes de video de entrenamientos...
python build_video.py "!ENT_DIR!" datos_video_ent.js VIDEO_DATA_ENT ent
if errorlevel 1 echo      [aviso] Hubo un problema en los cortes de entrenamiento. Sigo igual.
echo.

REM ================= VERIFICACION =================
:LINKS

REM ===================================================================
REM   BATERIAS DE LA TEMPORADA EN CURSO
REM   gen_baterias.py no se corria nunca desde aca, y por eso
REM   datos_baterias.js quedaba sin actualizar.
REM
REM   Va DESPUES de :LINKS a proposito: los "goto LINKS" de arriba saltean
REM   partidos o entrenamientos cuando no hay .dvw, y esto tiene que correr
REM   igual. Y va ANTES del cifrado del final, que es lo que gen_baterias.py
REM   necesita para poder leer los datos.
REM
REM   LA CAPSULA 25-26 NO SE TOCA. Es una temporada cerrada: su plan de
REM   partido y sus baterias ya estan generados y no cambian mas. Volver a
REM   armarlos en cada publicacion seria tiempo perdido, y ademas arriesga
REM   pisar datos congelados si algun generador cambia mas adelante.
REM   Si alguna vez hay que rehacerlos, estan los dos .bat sueltos:
REM       REGENERAR_PLAN_2526.bat   y   GENERAR_BATERIAS.bat
REM ===================================================================
echo  ================ BLOQUEO ================
echo.
REM   Toma el video de partidos y el de entrenamientos, y etiqueta cada
REM   bloqueo con su tipo para que el mapa de calor pueda separarlos.
REM Los codigos que usa el club, para poder traducir los archivos que
REM lleguen de otros scouts.
if exist "gen_mis_codigos.py" python gen_mis_codigos.py

python gen_bloqueo.py
if errorlevel 1 echo      [aviso] Problema en las acciones de bloqueo. Sigo igual.
echo.

echo  ============== PLAN DE PARTIDO ==============
echo.
REM   Toma las dos carpetas y etiqueta cada sesion con su tipo, para que la
REM   pagina pueda separar partidos de entrenamientos. Va aca abajo porque
REM   !ENT_DIR! recien existe despues del bloque de entrenamientos, y porque
REM   asi corre aunque la seccion de partidos se haya salteado.
if "!ENT_DIR!"=="" (
    python gen_plan_partido.py --dvw_dir "!DVW_DIR!" --output_dir . --filter_temporada "!TEMPORADA_ACTUAL!"
) else (
    python gen_plan_partido.py --dvw_dir "!DVW_DIR!" --ent_dir "!ENT_DIR!" --output_dir . --filter_temporada "!TEMPORADA_ACTUAL!"
)
if errorlevel 1 echo      [aviso] Problema en el plan de partido. Sigo igual.
echo.

echo  ================= BATERIAS =================
echo.
REM   Las dos carpetas en UNA sola corrida. El generador etiqueta cada sesion
REM   con su tipo y arma tambien el acumulado de cada uno por separado, para
REM   que las pantallas puedan filtrar Partidos / Entrenamientos sin cruzar
REM   datos. El filtro de temporada es el mismo que usa el resto del script.
echo  Baterias de la temporada !TEMPORADA_ACTUAL! (partidos + entrenamientos)...
if "!ENT_DIR!"=="" (
    python gen_baterias.py --partidos "!DVW_DIR!" --temporada "!TEMPORADA_ACTUAL!" --out "datos_baterias.js"
) else (
    python gen_baterias.py --partidos "!DVW_DIR!" --entrenamientos "!ENT_DIR!" --temporada "!TEMPORADA_ACTUAL!" --out "datos_baterias.js"
)
if errorlevel 1 echo      [aviso] Problema en las baterias. Sigo igual.
echo.

REM ===================================================================
REM   EL INFORME DE EQUIPO
REM
REM   Cambio de saque, breakpoint y sus valores ESPERADOS: cuanto
REM   deberia sacar el equipo dada la calidad con la que recibe. Eso es
REM   lo que convierte un numero en un diagnostico.
REM
REM   La referencia de cada calidad de recepcion se calcula con los .dvw
REM   de TODA la liga cargada, no con numeros de otro campeonato: el
REM   nivel cambia cuanto rinde cada tipo de pase.
REM ===================================================================
echo  ================= INFORME DE EQUIPO =================
echo.
python gen_informe.py --dvw_dir "!DVW_DIR!" --temporada "!TEMPORADA_ACTUAL!" --out "datos_informe.js"
if errorlevel 1 echo      [aviso] Problema armando el informe. Sigo igual.
echo.

echo  ==================================================
echo      VERIFICACION (archivos clave):
if exist "datos_partidos.js"     (echo      OK  datos_partidos.js)            else (echo      --  falta datos_partidos.js)
if exist "liga_data.js"          (echo      OK  liga_data.js)                 else (echo      --  falta liga_data.js)
if exist "scouting_rival.js"     (echo      OK  scouting_rival.js)            else (echo      --  falta scouting_rival.js)
if exist "datos_video_*.js"      (echo      OK  datos_video [por temporada])  else (echo      --  falta datos_video)
if exist "datos_baterias.js"     (echo      OK  datos_baterias.js)            else (echo      --  falta datos_baterias.js)
echo  ==================================================
echo.


REM ================= TEMPORADAS ARCHIVADAS =================
REM Una temporada archivada esta cerrada: sus pantallas NO tienen que
REM depender de los archivos de la carpeta principal, que es la temporada
REM en curso. Cuando esos archivos se actualizan, la temporada vieja se
REM rompe: muestra el plantel equivocado y no puede abrir sus videos.
REM Paso con NAFELS: 38 pantallas de la 2025-26 cargaban firebase.js y
REM datos_seguros.js de la raiz. Esto lo revisa en cada corrida.
if exist "temporadas" (
  if exist "SOLTAR_TEMPORADAS.py" (
    python SOLTAR_TEMPORADAS.py --si
  )
)

REM ===================================================================
REM   CONTROL DE CALIDAD
REM
REM   Va ANTES de cifrar: es el unico momento en que los datos estan
REM   legibles. Corriendolo despues, el auditor no puede abrir liga_data
REM   ni comparar los equipos entre archivos, y esa parte de la revision
REM   se pierde justo cuando mas importa.
REM ===================================================================
echo.
echo  ================= CONTROL DE CALIDAD =================
if exist "AUDITAR.py" python AUDITAR.py --sin-pausa
if exist "VERIFICAR_DATOS.py" python VERIFICAR_DATOS.py --sin-pausa
echo.

REM ================= CERRAR LOS DATOS =================
if exist "LLAVE.txt" (
    echo  Protegiendo los datos antes de publicar...
    python cifrar_datos.py
    if errorlevel 1 (
        echo.
        echo  [ERROR] No pude cifrar. NO PUBLIQUES: los datos irian en claro.
        echo.
        pause & exit /b 1
    )
    echo.
) else (
    echo  [ATENCION] No encuentro LLAVE.txt: los datos se publicarian SIN cifrar.
    echo.
)

REM ================= PUBLICAR =================
set "RESP="
set /p "RESP=Queres PUBLICAR a GitHub ahora? (S/N): "
if /i "!RESP!"=="S" goto PUBLICAR
echo.
echo  OK, NO se publico. Cuando quieras, volve a correr este bat.
echo.
pause
goto FIN

:PUBLICAR
echo.
git --version >nul 2>&1
if errorlevel 1 goto NOGIT
if not exist ".git" goto NOREPO
set GIT_MERGE_AUTOEDIT=no
echo  Subiendo a GitHub... (la primera vez puede pedir login)
git add -A
git commit -m "Actualizacion %DATE%"
git pull --no-rebase --no-edit -X ours
git push
echo.
echo  ==================================================
echo      Si arriba NO hay errores en rojo, se publico OK.
echo      En 1-2 minutos la web queda actualizada.
echo      Para verla: abri la web y apreta Ctrl+Shift+R
echo  ==================================================
echo.
pause
goto FIN

:NOGIT
echo.
echo  [ERROR] No tenes Git instalado: https://git-scm.com/download/win
echo.
pause
goto FIN

:NOREPO
echo.
echo  [ATENCION] Esta carpeta no esta conectada a GitHub.
echo  Corre esto DENTRO de la carpeta VOLLEY_NAFELS.
echo.
pause
goto FIN

:FIN
endlocal
