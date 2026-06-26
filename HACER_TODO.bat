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

REM ================= PARTIDOS =================
echo  ===================== PARTIDOS =====================
set "DVW_DIR=DVW NAFELS 2026"
set "ANIO=2026"
if exist "DVW NAFELS 2027\*.dvw" set "DVW_DIR=DVW NAFELS 2027"
if exist "DVW NAFELS 2027\*.dvw" set "ANIO=2027"

if not exist "!DVW_DIR!\*.dvw" (
    echo  [ATENCION] No hay .dvw en "!DVW_DIR!".  SALTEO partidos.
    echo.
    goto ENTRENAMIENTOS
)

echo  Carpeta: "!DVW_DIR!"   ^(temporada !ANIO!^)
echo.
echo  [1/4] Procesando partidos... (puede tardar, NO la cierres)
python update_db_nafels_FULL.py --dvw_dir "!DVW_DIR!" --temporada !ANIO! --output_dir .
if errorlevel 1 echo      [aviso] Hubo un problema en partidos. Mira el detalle de arriba; sigo igual.
echo.
echo  [2/4] Scouting de rivales...
python gen_scouting.py --dvw_dir "!DVW_DIR!" --output_dir .
if errorlevel 1 echo      [aviso] Hubo un problema en el scouting. Sigo igual.
echo.
echo  [3/4] Videos destacados (si hay Excel)...
if exist "videos_nafels.xlsx" python build_videos.py videos_nafels.xlsx
echo.
echo  [4/4] Cortes de video de partidos...
python build_video.py "!DVW_DIR!" datos_video.js VIDEO_DATA
if errorlevel 1 echo      [aviso] Hubo un problema en los cortes de partidos. Sigo igual.
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

REM ================= VERIFICACION + LINKS =================
:LINKS
echo  ==================================================
echo      VERIFICACION (archivos clave):
if exist "datos_partidos.js" (echo      OK  datos_partidos.js) else (echo      --  falta datos_partidos.js)
if exist "liga_data.js"      (echo      OK  liga_data.js)      else (echo      --  falta liga_data.js)
if exist "scouting_rival.js" (echo      OK  scouting_rival.js) else (echo      --  falta scouting_rival.js)
if exist "datos_video.js"    (echo      OK  datos_video.js)    else (echo      --  falta datos_video.js)
echo  ==================================================
echo.
echo  RECORDATORIO IMPORTANTE:
echo  Si subiste VIDEOS NUEVOS a YouTube, HACELO AHORA:
echo    1) Abri "Cargar Videos", pega los links y genera mapa_videos.js
echo    2) Pone ese mapa_videos.js en esta carpeta
echo  (La ventana espera. Si NO subiste videos nuevos, segui de largo.)
echo.

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
