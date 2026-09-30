@echo off
chcp 65001 >nul
title Medir la velocidad de los saques
cd /d "%~dp0"
python "%~dp0MEDIR_SAQUES.py" %*
if errorlevel 1 (
  echo.
  echo   No arranco Python. Se baja gratis de python.org — al instalarlo,
  echo   marca la casilla "Add Python to PATH".
  pause
)
