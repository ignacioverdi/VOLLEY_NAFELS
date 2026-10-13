@echo off
chcp 65001 >nul
title LAS CARAS DEL PLANTEL
echo.
echo  ==================================================
echo    LAS CARAS DEL PLANTEL
echo  ==================================================
echo.
echo  Lee las fotos oficiales de la carpeta del club y las deja
echo  listas para la app. No hay que cargar ninguna a mano.
echo.
echo  Las fotos tienen que llamarse con el dorsal adelante:
echo     01_Nombre_Apellido.jpg
echo.
pause
echo.
python FOTOS_JUGADORES.py --desde-bat
echo.
pause
