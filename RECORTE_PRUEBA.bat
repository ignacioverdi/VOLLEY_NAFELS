@echo off
chcp 65001 >nul
title Sacar una muestra del video
cd /d "%~dp0"
python "%~dp0RECORTE_PRUEBA.py" %*
if errorlevel 1 (
  echo.
  echo   No arranco Python. Se baja gratis de python.org.
  pause
)
