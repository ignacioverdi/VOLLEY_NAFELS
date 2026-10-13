@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title MI JUEGO - actualizar los datos
echo.
echo  ==================================================
echo    MI JUEGO - actualizar los datos
echo  ==================================================
echo.
echo  Esto rehace datos_ficha.js desde los .dvw y lo deja cifrado.
echo  No toca ninguna pantalla: solo los datos.
echo.

REM  Los .enc hay que abrirlos antes o gen_ficha no encuentra la tabla
REM  de la liga, que viaja cifrada como todo lo demas.
python descifrar_datos.py
if errorlevel 1 (
    echo  [ERROR] No pude abrir los datos cifrados. Reviso la llave y volve a probar.
    echo.
    pause
    exit /b 1
)
echo.

set "DVW_DIR=DVW NAFELS 2026"
if exist "DVW NAFELS 2027\*.dvw" set "DVW_DIR=DVW NAFELS 2027"
set "ENT_DIR="
if exist "DVW ENTRENAMIENTOS NAFELS 2026\*.dvw" set "ENT_DIR=DVW ENTRENAMIENTOS NAFELS 2026"
echo  Partidos:        "!DVW_DIR!"
if "!ENT_DIR!"=="" (echo  Entrenamientos:  no hay) else (echo  Entrenamientos:  "!ENT_DIR!")
echo.

if "!ENT_DIR!"=="" (
    python gen_ficha.py --dvw_dir "!DVW_DIR!" --out "datos_ficha.js"
) else (
    python gen_ficha.py --dvw_dir "!DVW_DIR!" --ent_dir "!ENT_DIR!" --out "datos_ficha.js"
)
if errorlevel 1 (
    echo.
    echo  [ERROR] No se pudo armar datos_ficha.js.
    echo.
    pause
    exit /b 1
)
echo.

python cifrar_datos.py
echo.
echo  ==================================================
if exist "datos_ficha.js.enc" (echo    OK  datos_ficha.js.enc) else (echo    --  falta datos_ficha.js.enc)
echo  ==================================================
echo.
echo  Ahora: VER_LA_APP.bat para mirarlo, y despues PUBLICAR_EN_GITHUB.bat
echo.
pause
