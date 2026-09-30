@echo off
chcp 65001 >nul
title Velocidades de saque
cd /d "%~dp0"
REM Arrastra el .dvw sobre este archivo.
REM   La primera vez te arma la planilla para cargar los km/h.
REM   La segunda vez la lee y deja el .json que despues levanta HACER_TODO.
python "%~dp0VELOCIDADES.py" %*
if errorlevel 1 (
  echo.
  echo   No arranco Python. Se baja gratis de python.org — al instalarlo,
  echo   marca la casilla "Add Python to PATH".
  pause
)
