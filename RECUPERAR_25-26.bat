@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title Volley-Stats - Recuperar la temporada 2025-26

echo.
echo  ==================================================
echo      RECUPERAR LA TEMPORADA 2025-26
echo      (heatmaps, videos y plantel)
echo  ==================================================
echo.

set "T=temporadas\2025-26"
set "R=%T%\_RESPALDO"

if not exist "%T%" (
  echo   No encuentro la carpeta "%T%".
  echo   Corre este programa dentro de VOLLEY_NAFELS.
  echo.
  pause
  exit /b 1
)

if not exist "%R%" (
  echo   No encuentro el respaldo "%R%".
  echo   Sin el no puedo recuperar. Avisame.
  echo.
  pause
  exit /b 1
)

REM ?? 1. Guardar el estado actual, por si acaso ??????????????????????
set "FECHA=%DATE:~6,4%%DATE:~3,2%%DATE:~0,2%-%TIME:~0,2%%TIME:~3,2%"
set "FECHA=%FECHA: =0%"
set "SEG=%T%\_ANTES-DE-RECUPERAR-%FECHA%"

echo   [1/3] Guardando el estado actual en:
echo         %SEG%
mkdir "%SEG%" 2>nul
for %%F in (datos_video liga_data scouting_rival) do (
  if exist "%T%\%%F.js"     copy /Y "%T%\%%F.js"     "%SEG%\" >nul
  if exist "%T%\%%F.js.enc" copy /Y "%T%\%%F.js.enc" "%SEG%\" >nul
)
echo         listo - nada se pierde.
echo.

REM ?? 2. Traer el respaldo bueno ?????????????????????????????????????
echo   [2/3] Recuperando desde el respaldo...
set /a N=0
for %%F in (datos_video liga_data scouting_rival) do (
  if exist "%R%\%%F.js.enc" (
    copy /Y "%R%\%%F.js.enc" "%T%\%%F.js.enc" >nul
    if exist "%T%\%%F.js" del /Q "%T%\%%F.js"
    echo         %%F.js.enc  recuperado
    set /a N+=1
  ) else (
    if exist "%R%\%%F.js" (
      copy /Y "%R%\%%F.js" "%T%\%%F.js" >nul
      if exist "%T%\%%F.js.enc" del /Q "%T%\%%F.js.enc"
      echo         %%F.js      recuperado
      set /a N+=1
    ) else (
      echo         %%F         NO estaba en el respaldo
    )
  )
)
echo.
echo         %N% archivo(s) recuperado(s).
echo.

REM ?? 3. Publicar ????????????????????????????????????????????????????
echo   [3/3] Subir a GitHub para que se vea en la web?
set /p SUBIR="        (S/N): "
if /I not "%SUBIR%"=="S" goto FIN

git add -A
git commit -m "Recuperar temporada 2025-26 (heatmaps y videos)"
git pull --no-edit
git push

:FIN
echo.
echo  ==================================================
echo      LISTO
echo.
echo      Abri la temporada 2025-26 en la web y apreta
echo      Ctrl+Shift+R para que el navegador no use la
echo      version vieja que tiene guardada.
echo.
echo      Fijate en:
echo        - el heatmap de ataque (que aparezca el
echo          plantel de la 25-26, no el de la 26-27)
echo        - el boton VER LOS VIDEOS
echo.
echo      Si algo sigue mal, el estado anterior quedo en
echo      %SEG%
echo  ==================================================
echo.
pause
