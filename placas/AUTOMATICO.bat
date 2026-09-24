@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Dejando el vigilador andando. No cierres esta ventana.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0VIGILAR_Y_PUBLICAR.ps1"
pause
