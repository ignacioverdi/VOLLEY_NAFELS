@echo off
setlocal
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
chcp 65001 >nul
title ARCHIVAR TEMPORADA
color 0A
cd /d "%~dp0"

echo.
echo  ==================================================
echo     ARCHIVAR TEMPORADA  -  capsula del tiempo
echo  ==================================================
echo.
echo  Congela el sitio actual en una carpeta para que esa
echo  temporada quede guardada para siempre, intacta.
echo.

if not exist "index.html" goto NOSITE

set "SEASON="
set /p SEASON=  Que temporada vas a archivar [ej 2025-26]: 
if not defined SEASON goto NOSEASON

set "DEST=temporadas\%SEASON%"
if exist "%DEST%" goto EXISTE
goto COPIAR

:EXISTE
echo.
echo  [ATENCION] Ya existe la carpeta %DEST%.
set "OW="
set /p OW=  Sobrescribir esa temporada archivada [S/N]: 
if /i "%OW%"=="S" goto COPIAR
echo  Cancelado. No se toco nada.
goto FIN

:COPIAR
echo.
echo  Copiando el sitio actual a  %DEST%  ...
robocopy "." "%DEST%" /E /NFL /NDL /NJH /NJS /NP /XD "temporadas" ".git" ".github" "node_modules" /XF "*.py" "*.bat" "*_db.json" "*.dvw" >nul
if %ERRORLEVEL% GEQ 8 goto COPYERR
echo  Copia lista.
echo.
echo  Registrando la temporada en el menu ...
python actualizar_temporadas.py "%SEASON%" 2>nul
if errorlevel 1 py actualizar_temporadas.py "%SEASON%" 2>nul
echo.
echo  ==================================================
echo     LISTO  -  Temporada %SEASON% archivada.
echo  ==================================================
echo.
echo  Ahora corre PUBLICAR_EN_GITHUB.bat para subir:
echo     - la carpeta  temporadas\%SEASON%
echo     - el archivo  temporadas.js  - se actualizo solo
echo.
echo  La vas a poder ver desde el boton Temporadas del sitio.
goto FIN

:NOSITE
echo.
echo  [ERROR] No veo index.html en esta carpeta.
echo  Copia este .bat a la carpeta del sitio y corrilo ahi.
goto FIN

:NOSEASON
echo.
echo  [ERROR] No escribiste ninguna temporada.
goto FIN

:COPYERR
echo.
echo  [ERROR] Hubo un problema al copiar. Revisa permisos o espacio.
goto FIN

:FIN
echo.
pause
