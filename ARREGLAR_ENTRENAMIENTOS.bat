@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
cls
python ARREGLAR_ENTRENAMIENTOS.py
if errorlevel 9009 py ARREGLAR_ENTRENAMIENTOS.py
pause
