@echo off
chcp 65001 >nul
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cd /d "%~dp0"
echo.
echo  ==================================================
echo     NAFELS - ACTUALIZAR Y PUBLICAR (con respaldo)
echo  ==================================================
echo.
REM -- Temporada ACTUAL = 2027 (26-27). La 2026 (=25-26) ya quedo
REM    archivada en la capsula; NO se procesa para no re-llenar el sitio.
set "DVW_DIR=DVW NAFELS 2027"
set "ANIO=2027"
if not exist "DVW NAFELS 2027\*.dvw" goto SIN_PARTIDOS_NUEVOS
echo  Carpeta de partidos: "%DVW_DIR%"   (temporada %ANIO%)
echo.

REM ============================================================
REM  [0/5] RESPALDO de seguridad antes de tocar nada
REM ============================================================
echo  [0/5] Respaldando archivos actuales en _RESPALDO\ ...
if not exist "_RESPALDO" mkdir "_RESPALDO"
for %%F in (liga_data.js nla_stats_table.html nla_full_stats.json scouting_rival.js datos_video.js videos.js proximo_rival.js game_plan.html) do (
  if exist "%%F" copy /Y "%%F" "_RESPALDO\%%F" >nul
)
echo      Respaldo listo.
echo.

REM ============================================================
REM  [1/5] Procesar partidos (liga_data + estadisticas + heatmaps)
REM ============================================================
echo  [1/5] Procesando partidos... (NO la cierres)
python update_db_nafels_FULL.py --dvw_dir "%DVW_DIR%" --temporada %ANIO% --output_dir .
if errorlevel 1 goto ERROR_PROCESO
echo.

REM ============================================================
REM  [2/5] Scouting de rivales
REM ============================================================
echo  [2/5] Scouting de rivales...
python gen_scouting.py --dvw_dir "%DVW_DIR%" --output_dir .
python gen_plan_partido.py --dvw_dir "%DVW_DIR%" --output_dir .
if errorlevel 1 goto ERROR_PROCESO
echo.

REM ============================================================
REM  [3/5] Cortes de video
REM ============================================================
echo  [3/5] Cortes de video...
python build_video.py "%DVW_DIR%" datos_video.js VIDEO_DATA
if exist "videos_nafels.xlsx" python build_videos.py videos_nafels.xlsx
echo.

REM ============================================================
REM  [4/5] CHEQUEO DE SANIDAD antes de publicar
REM        Si algo quedo roto, restaura el respaldo y NO sube nada.
REM ============================================================
echo  [4/5] Verificando que no se haya roto nada...

REM -- Estadisticas: deben tener el panel de jugadores Y los datos --
findstr /C:"panel-jugadores" "nla_stats_table.html" >nul 2>&1
if errorlevel 1 goto ROTO_STATS
findstr /C:"PLAYERS=" "nla_stats_table.html" >nul 2>&1
if errorlevel 1 goto ROTO_STATS

REM -- liga_data: debe tener los datos del game plan --
findstr /C:"LIGA_DATA" "liga_data.js" >nul 2>&1
if errorlevel 1 goto ROTO_LIGA

REM -- scouting: debe tener datos --
findstr /C:"SCOUTING" "scouting_rival.js" >nul 2>&1
if errorlevel 1 goto ROTO_SCOUT

echo      OK: estadisticas, game plan y scouting estan sanos.
echo.

REM ============================================================
REM  [5/5] Publicar en GitHub
REM ============================================================
echo  [5/5] Publicando en GitHub...
git --version >nul 2>&1
if errorlevel 1 goto NOGIT
if not exist ".git" goto NOREPO
set GIT_MERGE_AUTOEDIT=no
git add -A
git commit -m "Actualizacion %DATE%"
git pull --no-rebase --no-edit -X ours
git push
goto FIN_OK


REM ============================================================
REM  MANEJO DE ERRORES (restaura respaldo y NO publica)
REM ============================================================
:ROTO_STATS
echo.
echo  [ABORTADO] La tabla de ESTADISTICAS quedo rota.
echo             Restaurando la version anterior...
copy /Y "_RESPALDO\nla_stats_table.html" "nla_stats_table.html" >nul
if exist "_RESPALDO\nla_full_stats.json" copy /Y "_RESPALDO\nla_full_stats.json" "nla_full_stats.json" >nul
goto ABORTADO

:ROTO_LIGA
echo.
echo  [ABORTADO] liga_data.js (game plan) quedo roto.
echo             Restaurando la version anterior...
copy /Y "_RESPALDO\liga_data.js" "liga_data.js" >nul
goto ABORTADO

:ROTO_SCOUT
echo.
echo  [ABORTADO] scouting_rival.js quedo roto.
echo             Restaurando la version anterior...
copy /Y "_RESPALDO\scouting_rival.js" "scouting_rival.js" >nul
goto ABORTADO

:ERROR_PROCESO
echo.
echo  [ABORTADO] Un generador fallo (ver el error arriba).
echo             NO se publico nada. Tus archivos siguen como estaban.
echo             (Las copias de seguridad estan en _RESPALDO\ )
goto FIN_ERR

:ABORTADO
echo.
echo  ==================================================
echo     SE DETUVO. NO se publico nada online.
echo     Se restauro la version anterior que funcionaba.
echo     Copias de seguridad en: _RESPALDO\
echo  ==================================================
goto FIN_ERR

:NOGIT
echo  [ERROR] Git no esta instalado.
goto FIN_ERR
:NOREPO
echo  [ERROR] Esta carpeta no es el repo (falta .git).
goto FIN_ERR

:SIN_PARTIDOS_NUEVOS
echo.
echo  ============================================================
echo    La carpeta "DVW NAFELS 2027" esta VACIA.
echo    La temporada 26-27 todavia no tiene partidos cargados.
echo.
echo    NO se actualiza nada (a proposito), para no volver a llenar
echo    el sitio con los datos viejos de la 25-26, que ya estan
echo    guardados en su capsula (menu "Temporadas").
echo.
echo    Cuando tengas los primeros DVW de la 26-27, ponelos en la
echo    carpeta "DVW NAFELS 2027" y volve a correr este .bat.
echo  ============================================================
echo.
pause
exit /b 0

:FIN_OK
echo.
echo  ==================================================
echo     LISTO. Todo verificado y publicado online.
echo  ==================================================
echo.
pause
exit /b 0

:FIN_ERR
echo.
pause
exit /b 1
