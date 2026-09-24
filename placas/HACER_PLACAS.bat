@echo off
chcp 65001 >nul
cd /d "%~dp0"
:menu
cls
echo.
echo   ================================================
echo    PLACAS - Volley-Stats
echo   ================================================
echo.
echo    1. Una fecha           (lunes, con los 4 partidos)
echo    2. Acumulado hasta...  (durante la semana)
echo    3. Toda la temporada
echo    4. Ver que fechas detecta
echo    5. Salir
echo.
set /p OP=  Opcion: 
echo.
if "%OP%"=="1" goto una
if "%OP%"=="2" goto hasta
if "%OP%"=="3" goto todo
if "%OP%"=="4" goto listar
if "%OP%"=="5" exit /b 0
goto menu

:una
set /p F=  Numero de fecha: 
python seis_placas.py --fecha %F%
goto fin

:hasta
set /p F=  Acumulado hasta la fecha: 
python seis_placas.py --hasta %F%
goto fin

:todo
python seis_placas.py
goto fin

:listar
python seis_placas.py --listar
echo.
pause
goto menu

:fin
if errorlevel 1 (
  echo.
  echo   ALGO FALLO. Revisa el mensaje de arriba.
  pause
  goto menu
)
echo.
start "" "salida"
pause
goto menu
