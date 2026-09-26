@echo off
chcp 65001 >nul
cd /d "%~dp0"
REM ===========================================================================
REM   ESTE .BAT ESTA DESACTIVADO A PROPOSITO — 26/09/2026
REM ---------------------------------------------------------------------------
REM   Lo que hacia: traia adentro una copia vieja del motor, guardada en
REM   base64 (1.544 lineas del archivo), y la escribia ENCIMA de
REM   update_db_nafels_FULL.py.
REM
REM   Era el instalador original: servia para crear el motor la primera vez.
REM   Desde entonces el motor se arreglo mucho y este .bat se quedo con la
REM   foto vieja. Medido el 26/09/2026:
REM
REM       el motor guardado aca adentro :  1.700 lineas   41 funciones
REM       el motor de la carpeta        :  2.702 lineas   56 funciones
REM
REM   Un doble clic borraba 1.002 lineas y 15 funciones, entre ellas las que
REM   separan las temporadas y la que une al jugador que cambio de dorsal.
REM
REM   El contenido viejo quedo en _respaldo_26sep\ y ademas esta en el
REM   historial de git, asi que no se perdio nada.
REM ===========================================================================
echo.
echo  ==================================================
echo      ESTE PROGRAMA ESTA DESACTIVADO
echo  ==================================================
echo.
echo   Borraba el motor del sistema y lo reemplazaba por una
echo   version vieja. No hace falta para nada: para procesar
echo   todo y publicar, usa HACER_TODO.bat
echo.
echo   (el detalle esta en ANALISIS_COMPLETO_2026-09-26.md)
echo.
pause
exit /b 0
