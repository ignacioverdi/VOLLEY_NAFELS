@echo off
chcp 65001 >nul
title PUBLICAR EN GITHUB
color 0A
cd /d "%~dp0"
echo.
echo  ==================================================
echo     PUBLICAR CAMBIOS EN GITHUB
echo     (Vercel actualiza la app sola en 1-2 minutos)
echo  ==================================================
echo.
git --version >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] No tenes Git instalado.  https://git-scm.com/download/win
  pause ^& exit /b
)
if not exist ".git" (
  echo  [ATENCION] Esta carpeta todavia no esta conectada a GitHub.
  echo  Corre primero (una sola vez):  CONECTAR_GITHUB.bat
  echo.
  pause ^& exit /b
)
echo  Guardando y subiendo TODOS los cambios...
git add -A
for /f "tokens=*" %%D in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm\""') do set "FECHA=%%D"
git commit -m "Actualizacion %FECHA%"
if errorlevel 1 (
  echo  (No habia cambios nuevos para subir.)
  echo.
  pause ^& exit /b
)
git push
if errorlevel 1 (
  echo.
  echo  [ATENCION] No se pudo subir. Revisa tu conexion o tu sesion de GitHub.
  echo.
  pause ^& exit /b
)
echo.
echo  ==================================================
echo     LISTO. Cambios publicados en GitHub.
echo     En 1-2 minutos la app online queda actualizada.
echo  ==================================================
echo.
pause
