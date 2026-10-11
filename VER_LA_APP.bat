@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
title VISTA PREVIA - Volley-Stats
python -u VER_LA_APP.py
echo.
pause
