@echo off
chcp 65001 >nul
title Cortar los set points del 33-31
cd /d "%~dp0"
echo.
echo  ==================================================
echo    LOS SET POINTS DEL 33-31, CORTADOS
echo  ==================================================
echo.
echo  Corta del video del partido las pelotas que fueron
echo  set point, una por archivo, para poder mirarlas y
echo  elegir cuales van al video final.
echo.
pause
echo.
python CORTAR_SETPOINTS.py
echo.
pause
