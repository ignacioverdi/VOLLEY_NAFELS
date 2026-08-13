@echo off
chcp 65001 >nul
cd /d "%~dp0"
set GIT_MERGE_AUTOEDIT=no
echo.
echo  ==================================================
echo     PUBLICAR EN GITHUB
echo     (Vercel actualiza la web sola en 1-2 minutos)
echo  ==================================================
echo.
git --version >nul 2>&1
if errorlevel 1 goto NOGIT
if not exist ".git" goto NOREPO
echo  Guardando y subiendo TODOS los cambios a GitHub...
echo  (La PRIMERA vez puede abrirse el navegador para iniciar sesion en GitHub.)
echo.
REM ===================================================================
REM   SELLAR LA VERSION ANTES DE SUBIR
REM
REM   El navegador guarda los .js y .css para no bajarlos cada vez, y sin
REM   una señal no se entera de que cambiaron: un jugador puede quedarse
REM   MESES con la app de hace semanas, reportando errores ya corregidos.
REM
REM   Esto le agrega ?v=<fecha> a cada archivo en las paginas, asi el
REM   navegador lo toma como distinto y lo baja de nuevo. Los archivos en
REM   si no se tocan.
REM ===================================================================
if exist "sellar_version.py" (
    python sellar_version.py
    echo.
)

git add -A
git commit -m "Actualizacion %DATE%"
git pull --no-rebase --no-edit -X ours
git push
echo.
echo  ==================================================
echo     Si arriba NO ves errores en rojo, se publico OK.
echo     En 1-2 minutos la app online queda actualizada.
echo  ==================================================
echo.
pause
goto FIN

:NOGIT
echo  [ERROR] No tenes Git instalado.
echo  Instalalo gratis: https://git-scm.com/download/win
echo.
pause
goto FIN

:NOREPO
echo  [ATENCION] Esta carpeta no esta conectada a GitHub.
echo  Tenes que correr esto DENTRO de la carpeta VOLLEY_NAFELS
echo  (la que bajaste con DESCARGAR_PROYECTO.bat).
echo.
pause
goto FIN

:FIN
