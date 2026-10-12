@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title LA LECTURA DEL PARTIDO - generar los datos
echo.
echo  ==================================================
echo    LA LECTURA DEL PARTIDO - generar los datos
echo  ==================================================
echo.
echo  Lee los .dvw, arma la lectura de cada partido y la cifra.
echo  Hace SOLO eso: no toca nada mas de la app.
echo.

if not exist "gen_lectura.py" (
    echo  [ERROR] No encuentro gen_lectura.py en esta carpeta.
    echo.
    pause
    exit /b 1
)

REM La misma carpeta y la misma temporada que usa HACER_TODO.bat
set "DVW_DIR=DVW NAFELS 2026"
if exist "DVW NAFELS 2027\*.dvw" set "DVW_DIR=DVW NAFELS 2027"
set "TEMPORADA_ACTUAL=2026/27"

echo  Carpeta: "!DVW_DIR!"
echo.
python gen_lectura.py --dvw_dir "!DVW_DIR!" --temporada "!TEMPORADA_ACTUAL!" --out "datos_lectura.js"
if errorlevel 1 (
    echo.
    echo  [ERROR] No pude armar la lectura. No cifro nada.
    echo.
    pause
    exit /b 1
)
echo.

if not exist "LLAVE.txt" (
    echo  [ATENCION] No hay LLAVE.txt: dejo datos_lectura.js SIN cifrar.
    echo             NO publiques asi.
    echo.
    pause
    exit /b 1
)

echo  Cifrando...
python cifrar_datos.py
if errorlevel 1 (
    echo.
    echo  [ERROR] No pude cifrar. Fijate el detalle de arriba.
    echo.
    pause
    exit /b 1
)
echo.
echo  Listo. Ahora:
echo     VER_LA_APP.bat          para mirarlo
echo     PUBLICAR_EN_GITHUB.bat  para subirlo
echo.
pause
