@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

echo.
echo  ================================================================
echo     PONER LA BARRA DE NAVEGACION
echo  ================================================================
echo.
echo   Las 45 pantallas en 8 grupos, arriba de todo, en toda la app.
echo   Las de tiempo real no la llevan.
echo.

python -u PONER_BARRA.py --desde-bat

echo.
set "R="
set /p "R=  Lo hago de verdad?  (s = si, cualquier otra tecla = no): "

if /i "%R%"=="s" (
  echo.
  python -u PONER_BARRA.py --desde-bat --si
) else (
  echo.
  echo   No toque nada.
)

echo.
pause
