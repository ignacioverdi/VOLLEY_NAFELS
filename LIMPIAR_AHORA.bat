@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cls
echo.
echo  ================================================================
echo     LIMPIAR LA CARPETA
echo  ================================================================
echo.
echo   Primero te muestro QUE borraria. No borra nada todavia.
echo.
python -u LIMPIAR_AHORA.py
echo.
set /p R=  Lo borro de verdad?  (s = si, cualquier otra tecla = no):
if /i not "%R%"=="s" goto FIN
echo.
python -u LIMPIAR_AHORA.py --si
:FIN
echo.
pause
