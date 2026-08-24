@echo off
chcp 65001 >nul
title Volley-Stats - Volver la 2025-26 al backup que funcionaba

echo.
echo  ==================================================
echo      VOLVER LA TEMPORADA 2025-26
echo      al backup del 12/08 que funcionaba
echo  ==================================================
echo.
echo   Trae SOLO lo que usa el navegador: las pantallas,
echo   los datos y las imagenes.
echo   NO toca las carpetas DVW ni los programas .py.
echo.

set "ORIGEN=C:\Users\User\Desktop\NAFELS-RESPALDO\temporadas\2025-26"
set "DESTINO=temporadas\2025-26"

if not exist "%ORIGEN%" (
  echo   No encuentro el backup en:
  echo   %ORIGEN%
  echo.
  pause
  exit /b 1
)
if not exist "%DESTINO%" (
  echo   No encuentro "%DESTINO%". Corre esto dentro de VOLLEY_NAFELS.
  echo.
  pause
  exit /b 1
)

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

echo   [1/4] Guardando el estado actual en "%SEG%"...
mkdir "%SEG%" 2>nul
for %%E in (html js json enc png css) do (
  copy /Y "%DESTINO%\*.%%E" "%SEG%\" >nul 2>&1
)
echo         listo - no se pierde nada.
echo.

REM ?? 2. Traer las pantallas y los datos del backup ??????????????????
echo   [2/4] Trayendo pantallas y datos del backup...
for %%E in (html js json enc png css) do (
  copy /Y "%ORIGEN%\*.%%E" "%DESTINO%\" >nul 2>&1
)
echo         pantallas y datos: listo.
echo.

REM ?? 3. Las fotos de los jugadores ??????????????????????????????????
echo   [3/4] Trayendo las fotos y las imagenes...
if exist "%ORIGEN%\fotos" (
  xcopy "%ORIGEN%\fotos" "%DESTINO%\fotos\" /E /I /H /Y /Q >nul
  echo         fotos      listo
) else (
  echo         fotos      no estaban en el backup
)
if exist "%ORIGEN%\imagenes" (
  xcopy "%ORIGEN%\imagenes" "%DESTINO%\imagenes\" /E /I /H /Y /Q >nul
  echo         imagenes   listo
)
if exist "%ORIGEN%\escudos" (
  xcopy "%ORIGEN%\escudos" "%DESTINO%\escudos\" /E /I /H /Y /Q >nul
  echo         escudos    listo
)
echo.

REM ?? 4. Publicar ????????????????????????????????????????????????????
echo   [4/4] Subir a GitHub? (S/N)
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
echo      ventana normal podrias ver la vieja igual.
echo.
echo      Fijate en el heatmap de ataque:
echo        - el plantel de la 25-26 (no el de la 26-27)
echo        - el boton VER LOS VIDEOS
echo        - las fotos de los jugadores
echo.
echo      Lo anterior quedo guardado en "%SEG%"
echo  ==================================================
echo.
pause
