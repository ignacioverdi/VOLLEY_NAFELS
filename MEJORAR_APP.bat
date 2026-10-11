@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
cls
echo.
echo  ================================================================
echo      MEJORAR LA APP
echo  ================================================================
echo.
echo   Dos pasos, los dos reversibles:
echo.
echo     1) ICONOS        cambia los emojis del sistema por los
echo                      iconos propios de Volley-Stats
echo     2) TERMINACIONES scroll, foco, seleccion, toque en el
echo                      telefono y seis detalles mas
echo.
echo   Primero te muestro TODO lo que haria. No escribe nada todavia.
echo.
echo  ----------------------------------------------------------------
python PONER_ICONOS.py
echo  ----------------------------------------------------------------
python PULIR_DETALLES.py
echo  ----------------------------------------------------------------
echo.
set /p R=  Lo hago de verdad?  (s = si, cualquier otra tecla = no):
if /i not "%R%"=="s" goto FIN
echo.
python PONER_ICONOS.py --si
python PULIR_DETALLES.py --si
echo.
echo  ================================================================
echo     Listo. Abri la app y miralo.
echo     Si algo no te gusta, cada archivo tiene su copia:
echo        *.antes_iconos      y      movil.css.antes_pulido
echo  ================================================================
:FIN
echo.
pause
