@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

echo.
echo  ================================================================
echo     MEJORAR LAS TABLAS DE ESTADISTICA
echo  ================================================================
echo.
echo   Analisis, Dashboard, Informe de equipo, Baggerone.
echo   No cambia ningun numero: cambia como se leen.
echo.

python -u MEJORAR_TABLAS.py --desde-bat

echo.
set "R="
set /p "R=  Lo hago de verdad?  (s = si, cualquier otra tecla = no): "

if /i "%R%"=="s" (
  echo.
  python -u MEJORAR_TABLAS.py --desde-bat --si
) else (
  echo.
  echo   No toque nada.
)

echo.
pause
