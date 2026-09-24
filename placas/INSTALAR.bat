@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Instalando lo necesario para las placas y los videos...
echo   (una sola vez, tarda un par de minutos)
echo.
python -m pip install --upgrade pip
python -m pip install playwright
python -m playwright install chromium
echo.
echo   Ahora lo de los videos (yt-dlp, para bajar el tramo de cada accion)
python -m pip install --upgrade yt-dlp
echo.
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo   ----------------------------------------------------------
  echo   FALTA FFMPEG.
  echo   Sin ffmpeg las placas salen igual, pero los videos NO se
  echo   cortan solos: te queda el cortes.txt con set y minuto.
  echo.
  echo   Bajalo de  https://ffmpeg.org/download.html
  echo   y agregalo al PATH de Windows.
  echo   ----------------------------------------------------------
) else (
  echo   ffmpeg: OK
)
echo.
echo   Listo. Ya podes usar HACER_PLACAS.bat
pause
