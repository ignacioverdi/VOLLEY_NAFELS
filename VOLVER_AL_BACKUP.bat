@echo off
chcp 65001 >nul
title Volley-Stats - Volver la 2025-26 al backup que funcionaba

echo.
echo  ==================================================
echo      VOLVER LA TEMPORADA 2025-26
echo      al backup del 12/08 que funcionaba
echo  ==================================================
echo.

set "ORIGEN=C:\Users\User\Desktop\NAFELS-RESPALDO\temporadas\2025-26"
set "DESTINO=temporadas\2025-26"

if not exist "%ORIGEN%" (
  echo   No encuentro el backup en:
  echo   %ORIGEN%
  echo.
  echo   Si esta en otro lado, avisame la ruta.
  echo.
  pause
  exit /b 1
)

if not exist "%DESTINO%" (
  echo   No encuentro "%DESTINO%".
  echo   Corre este programa dentro de VOLLEY_NAFELS.
  echo.
  pause
  exit /b 1
)

echo   Origen : %ORIGEN%
echo   Destino: %DESTINO%
echo.

REM ?? 1. Guardar lo que hay ahora ????????????????????????????????????
set "SEG=_ROTO-2025-26"
if exist "%SEG%" (
  set /a I=2
  :BUSCAR
  if exist "%SEG%-%I%" (
    set /a I+=1
    goto BUSCAR
  )
  set "SEG=%SEG%-%I%"
)

echo   [1/3] Guardando el estado actual en "%SEG%"...
xcopy "%DESTINO%" "%SEG%\" /E /I /H /Y /Q >nul
echo         listo - no se pierde nada.
echo.

REM ?? 2. Traer la carpeta buena, entera ??????????????????????????????
echo   [2/3] Trayendo la temporada del backup...
rmdir /S /Q "%DESTINO%"
xcopy "%ORIGEN%" "%DESTINO%\" /E /I /H /Y /Q >nul
if errorlevel 1 (
  echo         FALLO la copia. Devuelvo lo anterior.
  xcopy "%SEG%" "%DESTINO%\" /E /I /H /Y /Q >nul
  echo         El estado quedo como estaba. Avisame.
  echo.
  pause
  exit /b 1
)

for /f %%N in ('dir /b /s "%DESTINO%" 2^>nul ^| find /c /v ""') do set CANT=%%N
echo         %CANT% archivo(s) restaurado(s).
echo.

REM ?? 3. Publicar ????????????????????????????????????????????????????
echo   [3/3] Subir a GitHub? (S/N)
set /p Q="        "
if /I not "%Q%"=="S" goto FIN

findstr /C:"_ROTO-" .gitignore >nul 2>&1
if errorlevel 1 (
  echo.>> .gitignore
  echo _ROTO-*/>> .gitignore
  echo _ANTES-*/>> .gitignore
)
git rm -r --cached "temporadas/2025-26/_ANTES-DE-RECUPERAR-" >nul 2>&1
git add -A
git commit -m "Volver la temporada 2025-26 al backup que funcionaba"
git pull --no-edit
git push

:FIN
echo.
echo  ==================================================
echo      LISTO
echo.
echo      Abri la 2025-26 en una ventana de INCOGNITO.
echo      La app guarda copias por su cuenta y en una
echo      ventana normal podrias seguir viendo la vieja.
echo.
echo      Fijate en el heatmap de ataque:
echo        - el plantel tiene que ser el de la 25-26
echo        - VER LOS VIDEOS tiene que abrir los clips
echo        - las fotos de los jugadores
echo.
echo      Lo que estaba roto quedo guardado en "%SEG%"
echo  ==================================================
echo.
pause
