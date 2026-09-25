@echo off
chcp 65001 >nul
title Volley-Stats - probar la demo antes de subirla
cd /d "%~dp0"

set "CARPETA=..\DEMO VOLLEY-STATS"
if not exist "%CARPETA%\index.html" (
  echo.
  echo   No encuentro la demo.
  echo   Corre primero HACER_DEMO.bat
  echo.
  pause
  exit /b 1
)

echo.
echo   ================================================================
echo   Abriendo la demo en tu navegador...
echo   ================================================================
echo.
echo   QUE TENES QUE VER:
echo     - entra DIRECTO, sin pedirte usuario ni clave
echo     - abajo, el cartel rojo que dice DEMO
echo     - los numeros y los heat maps, completos
echo.
echo   QUE VA A ESTAR VACIO (es asi a proposito):
echo     - wellness, notas y chat: no hay base de datos detras
echo.
echo   Cuando termines de mirar, cerra esta ventana.
echo.

cd /d "%CARPETA%"
start "" http://localhost:8000
python -m http.server 8000
