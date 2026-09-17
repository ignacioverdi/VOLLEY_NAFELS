@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
cls
echo.
python CONTROL_PANTALLAS.py
if errorlevel 9009 py CONTROL_PANTALLAS.py
echo.
pause
