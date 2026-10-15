@echo off
chcp 65001 >nul
title Sacar el calendario de los respaldos
cd /d "%~dp0"
echo.
echo  ============================================================
echo   SACAR EL CALENDARIO DE LOS RESPALDOS
echo  ============================================================
echo.
echo   Abre los respaldos diarios y deja calendario_respaldo.js
echo   con todos los partidos que alguna vez estuvieron en el
echo   calendario, con su hora, su lugar y su mapa.
echo.
echo   No toca Firebase ni el calendario. Del respaldo abre SOLO
echo   los partidos: nada del plantel.
echo.
python RECUPERAR_CALENDARIO.py
echo.
pause
