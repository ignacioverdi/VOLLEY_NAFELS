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
echo    1. HACER TODO de una fecha
echo       (placas + revision + videos + textos)
echo.
echo    2. Acumulado hasta...   (durante la semana)
echo    3. Toda la temporada
echo    4. Ver que fechas detecta
echo    5. Solo revisar una fecha
echo    6. Solo las placas, sin video  (mas rapido)
echo    7. Salir
echo.
set /p OP=  Opcion: 
echo.
if "%OP%"=="1" goto todo_fecha
if "%OP%"=="2" goto hasta
if "%OP%"=="3" goto temporada
if "%OP%"=="4" goto listar
if "%OP%"=="5" goto revisar
if "%OP%"=="6" goto solo_placas
if "%OP%"=="7" exit /b 0
goto menu

:todo_fecha
set /p F=  Numero de fecha: 
echo.
set /p V=  Videos tambien en vertical para historias? (S/N): 
if /i "%V%"=="S" (
  python publicar.py --fecha %F% --vertical
) else (
  python publicar.py --fecha %F%
)
goto fin

:hasta
set /p F=  Acumulado hasta la fecha: 
python publicar.py --hasta %F% --sin-video
goto fin

:temporada
python publicar.py --sin-video
goto fin

:listar
python seis_placas.py --listar
echo.
pause
goto menu

:revisar
set /p F=  Numero de fecha a revisar: 
python verificar.py --fecha %F%
echo.
pause
goto menu

:solo_placas
set /p F=  Numero de fecha: 
python publicar.py --fecha %F% --sin-video
goto fin

:fin
if errorlevel 2 (
  echo.
  echo   ALGO FALLO. Revisa el mensaje de arriba.
  pause
  goto menu
)
echo.
start "" "salida"
pause
goto menu
