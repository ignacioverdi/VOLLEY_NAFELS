@echo off
chcp 65001 >nul
title Cortar la seleccion de Cortes
cd /d "%~dp0"
python "%~dp0CORTAR_SELECCION.py" %*
if errorlevel 1 (
  echo.
  echo   No arranco Python. Se baja gratis de python.org.
  pause
)
