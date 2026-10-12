@echo off
chcp 65001 >nul
title LA LECTURA DEL PARTIDO - instalar
echo.
echo  ==================================================
echo    LA LECTURA DEL PARTIDO
echo  ==================================================
echo.
echo  Esto agrega la lectura arriba de Analisis del partido.
echo  Deja una copia .antes_lectura de cada archivo que toca.
echo.
pause
echo.
python PONER_LECTURA.py --si --desde-bat
echo.
pause
