@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
echo.
echo  ==========================================================
echo     UNIFICAR TIPOGRAFIA  -  de diez familias a cuatro
echo  ==========================================================
echo.
echo   Primero te muestro QUE haria, sin tocar nada.
echo.
python UNIFICAR_TIPOGRAFIA.py
echo.
set /p R=  Lo hago de verdad?  (s = si, cualquier otra tecla = no):
if /i not "%R%"=="s" goto FIN
echo.
python UNIFICAR_TIPOGRAFIA.py --si
:FIN
echo.
pause
