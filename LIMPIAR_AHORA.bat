@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

echo.
echo  ================================================================
echo     LIMPIAR LA CARPETA
echo  ================================================================
echo.
echo   Primero te muestro QUE borraria. No borra nada todavia.
echo.

python -u LIMPIAR_AHORA.py --desde-bat
if errorlevel 9009 (
  echo.
  echo   No encontre Python. Instalalo desde python.org y volve a probar.
  echo.
  pause
  exit /b
)

echo.
set "R="
set /p "R=  Lo borro de verdad?  (s = si, cualquier otra tecla = no): "

if /i "%R%"=="s" (
  echo.
  python -u LIMPIAR_AHORA.py --desde-bat --si
) else (
  echo.
  echo   No toque nada.
)

echo.
pause
