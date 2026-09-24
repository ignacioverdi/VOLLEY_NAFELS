@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Instalando lo necesario para generar las placas...
echo   (una sola vez, tarda un par de minutos)
echo.
python -m pip install --upgrade pip
python -m pip install playwright
python -m playwright install chromium
echo.
echo   Listo. Ya podes usar HACER_PLACAS.bat
pause
