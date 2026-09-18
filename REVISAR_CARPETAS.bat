@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
cls
python REVISAR_CARPETAS.py
if errorlevel 9009 py REVISAR_CARPETAS.py
