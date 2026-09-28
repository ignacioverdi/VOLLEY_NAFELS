@echo off
chcp 65001 >nul
title Ayudante de Volley-Stats
cd /d "%~dp0"
python "%~dp0AYUDANTE.py"
if errorlevel 1 (
  echo.
  echo   No arranco Python. Se baja gratis de python.org.
  pause
)
