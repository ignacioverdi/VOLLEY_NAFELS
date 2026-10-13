@echo off
chcp 65001 >nul
title MI JUEGO - instalar
echo.
echo  ==================================================
echo    MI JUEGO  (la pantalla del jugador)
echo  ==================================================
echo.
echo  Esto agrega una pantalla nueva: el aporte de cada jugador
echo  partido a partido, contra su puesto en la liga, y su reel.
echo  Deja una copia .antes_ficha de cada archivo que toca.
echo.
pause
echo.
python PONER_FICHA.py --si --desde-bat
echo.
pause
