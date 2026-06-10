@echo off
chcp 65001 >nul
title ARCHIVAR TEMPORADA
color 0A

echo.
echo  ==================================================
echo     ARCHIVAR TEMPORADA  (capsula del tiempo)
echo  ==================================================
echo.
echo  Esto congela el sitio actual en una carpeta para que esa
echo  temporada quede guardada para siempre, intacta.
echo.
echo  IMPORTANTE: corre este .bat en la carpeta del SITIO
echo  (donde estan index.html, temporadas.js, etc.).
echo.

REM --- 1. Pedir la temporada a archivar ---
set "SEASON="
set /p SEASON="  Que temporada vas a archivar? (ej: 2025-26): "
if "%SEASON%"=="" (
    echo.
    echo  [ERROR] No ingresaste ninguna temporada.
    echo.
    pause & exit /b
)

REM --- chequeo minimo: que estemos en la carpeta del sitio ---
if not exist "index.html" (
    echo.
    echo  [ERROR] No veo index.html aca. Corre el .bat dentro de la
    echo          carpeta del sitio (la que subis a GitHub).
    echo.
    pause & exit /b
)

set "DEST=temporadas\%SEASON%"
if exist "%DEST%" (
    echo.
    echo  [ATENCION] Ya existe la carpeta %DEST%.
    set "OW="
    set /p OW="  Sobrescribir esa temporada archivada? (S/N): "
    if /i not "%OW%"=="S" (
        echo  Cancelado. No toque nada.
        echo.
        pause & exit /b
    )
)

echo.
echo  Copiando el sitio actual a  %DEST%  ...

REM robocopy copia TODO el sitio menos las herramientas y carpetas pesadas:
REM   /XD  excluye carpetas:  temporadas (para no copiarse a si misma), .git, etc.
REM   /XF  excluye archivos de herramientas (motor, bats, bases, dvw)
robocopy "." "%DEST%" /E /NFL /NDL /NJH /NJS /NP ^
  /XD "temporadas" ".git" ".github" "node_modules" "DVW*" ^
  /XF "*.py" "*.bat" "*_db.json" "*.dvw" >nul

REM robocopy devuelve 0..7 como EXITO (8+ es error real)
if %ERRORLEVEL% GEQ 8 (
    echo.
    echo  [ERROR] Hubo un problema al copiar. Revisa permisos/espacio.
    echo.
    pause & exit /b
)
echo  Copia lista.

REM --- 2. Registrar la temporada en el menu (temporadas.js) ---
echo.
echo  Registrando la temporada en el menu ...
python actualizar_temporadas.py "%SEASON%" 2>nul
if errorlevel 1 (
    py actualizar_temporadas.py "%SEASON%" 2>nul
)

echo.
echo  ==================================================
echo    LISTO  -  Temporada %SEASON% archivada.
echo  ==================================================
echo.
echo  Ahora subi a GitHub:
echo     - la carpeta  temporadas\%SEASON%
echo     - el archivo  temporadas.js  (se actualizo solo)
echo.
echo  La vas a poder ver desde el boton "Temporadas" del sitio.
echo.
pause
