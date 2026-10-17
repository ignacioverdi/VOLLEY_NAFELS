@echo off
chcp 65001 >nul
title Buscar y cortar acciones de un partido
cd /d "%~dp0"
echo.
echo  ==================================================
echo    BUSCAR Y CORTAR ACCIONES
echo  ==================================================
echo.
echo  Te pregunta que partido y que buscar, y corta los
echo  clips sueltos en salida\supercup\acciones.
echo.
python CORTAR_ACCIONES.py
echo.
pause
