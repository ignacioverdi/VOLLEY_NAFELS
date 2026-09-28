@echo off
chcp 65001 >nul
title Unir las partes de un partido
cd /d "%~dp0"
python "%~dp0UNIR_VIDEO.py" %*
if errorlevel 1 (
  echo.
  echo   No arranco Python. Se baja gratis de python.org — al instalarlo,
  echo   marca la casilla "Add Python to PATH".
  pause
)
