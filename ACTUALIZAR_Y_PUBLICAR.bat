@echo off
chcp 65001 >nul
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cd /d "%~dp0"
echo.
echo  ==================================================
echo     NAFELS - ACTUALIZAR Y PUBLICAR (todo de una)
echo  ==================================================
echo.
set "DVW_DIR=DVW NAFELS 2026"
set "ANIO=2026"
if exist "DVW NAFELS 2027\*.dvw" set "DVW_DIR=DVW NAFELS 2027"
if exist "DVW NAFELS 2027\*.dvw" set "ANIO=2027"
echo  Carpeta de partidos: "%DVW_DIR%"   (temporada %ANIO%)
echo.
echo  [1/4] Procesando partidos... (NO la cierres)
python update_db_nafels_FULL.py --dvw_dir "%DVW_DIR%" --temporada %ANIO% --output_dir .
echo.
echo  [2/4] Scouting de rivales...
python gen_scouting.py --dvw_dir "%DVW_DIR%" --output_dir .
echo.
echo  [3/4] Cortes de video...
python build_video.py "%DVW_DIR%" datos_video.js VIDEO_DATA
if exist "videos_nafels.xlsx" python build_videos.py videos_nafels.xlsx
echo.
echo  [4/4] Publicando en GitHub...
git --version >nul 2>&1
if errorlevel 1 goto NOGIT
if not exist ".git" goto NOREPO
git add -A
git commit -m "Actualizacion %DATE%"
git push
goto FIN
:NOGIT
echo  [ERROR] Git no esta instalado.
goto FIN
:NOREPO
echo  [ERROR] Esta carpeta no es el repo (falta .git).
goto FIN
:FIN
echo.
echo  ==================================================
echo     LISTO. Si no hubo errores, ya esta todo online.
echo  ==================================================
echo.
pause
