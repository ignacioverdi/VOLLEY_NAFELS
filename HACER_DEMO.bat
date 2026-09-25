@echo off
chcp 65001 >nul
title Volley-Stats - armar la demo publica
cd /d "%~dp0"
echo.
echo   Armando la demo publica...
echo   (tu app no se toca: la demo se genera en una carpeta aparte)
echo.
python HACER_DEMO.py
if errorlevel 1 (
  echo.
  echo   Algo salio mal. No subas la demo hasta revisarlo.
  pause
)
