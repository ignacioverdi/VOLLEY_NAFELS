@echo off
chcp 65001 >nul
title Que tenia el calendario cada dia
cd /d "%~dp0"
echo.
echo  ============================================================
echo   QUE TENIA EL CALENDARIO CADA DIA
echo  ============================================================
echo.
echo   Lee los respaldos diarios y muestra, dia por dia, que
echo   partidos tenia el calendario y cuales se agregaron o se
echo   fueron. Del respaldo se saca SOLO el calendario: nada del
echo   plantel se abre ni se guarda.
echo.
python VER_CALENDARIO_VIEJO.py
echo.
echo  ------------------------------------------------------------
echo   El resumen quedo en  respaldos\CALENDARIO_POR_DIA.txt
echo   Ese archivo solo tiene fechas y rivales: se puede mandar.
echo.
pause
