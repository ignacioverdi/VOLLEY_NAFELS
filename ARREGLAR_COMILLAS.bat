@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

echo.
echo  ================================================================
echo     ARREGLAR COMILLAS  -  reparacion urgente
echo  ================================================================
echo.
echo   UNIFICAR_TIPOGRAFIA rompio 3 lugares donde el CSS vive adentro
echo   de una cadena de JavaScript. Uno es el Scout en vivo.
echo.

python -u ARREGLAR_COMILLAS.py --desde-bat

echo.
set "R="
set /p "R=  Lo arreglo?  (s = si, cualquier otra tecla = no): "

if /i "%R%"=="s" (
  echo.
  python -u ARREGLAR_COMILLAS.py --desde-bat --si
) else (
  echo.
  echo   No toque nada.
)

echo.
pause
