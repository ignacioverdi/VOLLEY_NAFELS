@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cls
echo.
echo  ================================================================
echo     ARREGLAR CONTRASTE  -  que el texto gris se lea
echo  ================================================================
echo.
echo   66 de 68 pantallas tenian texto por debajo del minimo legible.
echo   Esto sube los dos grises que lo causaban, solo donde son texto.
echo.
echo   Primero te muestro QUE haria. No escribe nada todavia.
echo.
python -u ARREGLAR_CONTRASTE.py
echo.
set /p R=  Lo hago de verdad?  (s = si, cualquier otra tecla = no):
if /i not "%R%"=="s" goto FIN
echo.
python -u ARREGLAR_CONTRASTE.py --si
:FIN
echo.
pause
