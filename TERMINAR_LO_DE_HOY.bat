@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo  ======================================================================
echo     TERMINAR LO DEL 2 DE OCTUBRE
echo  ======================================================================
echo.
echo   Esto hace los tres pasos que no se pueden hacer desde el asistente:
echo.
echo     1. Pone los dos flujos nuevos en .github\workflows
echo        (esa carpeta esta protegida y no se puede escribir desde afuera)
echo.
echo     2. Aparta los archivos que se dan de baja.
echo        NO los borra: los mueve a la carpeta  _PARA_BORRAR
echo        Cuando veas que todo anda, borras esa carpeta y listo.
echo.
echo     3. Saca del repositorio las dos revisiones viejas.
echo        El archivo queda en tu PC: solo deja de subirse.
echo.
echo   No publica nada. Eso lo hace HACER_TODO despues.
echo.
set "SEGUIR="
set /p "SEGUIR=  Sigo? (S/N): "
if /i not "!SEGUIR!"=="S" goto FIN

echo.
echo  ---------------------------------------------------------------------
echo   1. Los flujos
echo  ---------------------------------------------------------------------
if not exist ".github\workflows\." mkdir ".github\workflows"
call :MOVER "_workflows_nuevos\procesar-partidos.yml" ".github\workflows\procesar-partidos.yml"
call :MOVER "_workflows_nuevos\respaldo-firebase.yml" ".github\workflows\respaldo-firebase.yml"
if exist "_workflows_nuevos" rmdir "_workflows_nuevos" 2>nul

echo.
echo  ---------------------------------------------------------------------
echo   2. Lo que se da de baja
echo  ---------------------------------------------------------------------
if not exist "_PARA_BORRAR\." mkdir _PARA_BORRAR
call :APARTAR "radar_saque.html"
call :APARTAR "radar_motor.js"
call :APARTAR "radar_vivo.js"
call :APARTAR "MEDIR_SAQUES.py"
call :APARTAR "MEDIR_SAQUES.bat"
call :APARTAR "INSTALAR_RADAR.bat"
call :APARTAR "reproductor.js"
call :APARTAR "saque_jugador.html"
call :APARTAR "recepcion_jugador.html"
call :APARTAR "ataque_jugador.html"
if exist "radar\." (
    move /y radar "_PARA_BORRAR\radar" >nul 2>&1
    if exist "_PARA_BORRAR\radar\." ( echo     apartada    carpeta radar ) else ( echo     [ojo] no pude mover la carpeta radar )
) else (
    echo     ya no estaba  carpeta radar
)

echo.
echo  ---------------------------------------------------------------------
echo   3. Las revisiones, fuera del repositorio
echo  ---------------------------------------------------------------------
git --version >nul 2>&1
if errorlevel 1 (
    echo     [ojo] no encuentro git: este paso lo tenes que hacer a mano.
    goto RESUMEN
)
if not exist ".git" (
    echo     [ojo] aca no hay repositorio: salteo este paso.
    goto RESUMEN
)
call :DESUBIR "REVISION_APP_2026-09-26.md"
call :DESUBIR "ANALISIS_COMPLETO_2026-09-26.md"

:RESUMEN
echo.
echo  ======================================================================
echo     LISTO LO QUE PODIA HACER ESTE ARCHIVO
echo  ======================================================================
echo.
echo   AHORA, EN ESTE ORDEN:
echo.
echo     a) Corre HACER_TODO  (no alcanza con PUBLICAR: hace falta que cifre,
echo        porque hay un archivo nuevo que tiene que salir cifrado).
echo.
echo     b) Cuando termine, abri la planilla P-2 y fijate que cada jugador
echo        tenga su fecha de nacimiento.
echo.
echo     c) Si las fechas estan, corre:   python SACAR_NACIM.py
echo        y volve a publicar. Ese es el ultimo paso del arreglo mas
echo        importante: la fecha de nacimiento deja de ser publica.
echo.
echo     d) Cuando veas que todo anda bien, borra la carpeta _PARA_BORRAR.
echo.
set "AHORA="
set /p "AHORA=  Corro HACER_TODO ahora? (S/N): "
if /i "!AHORA!"=="S" (
    echo.
    call "HACER_TODO.bat"
)
goto FIN

:MOVER
if exist %1 (
    move /y %1 %2 >nul 2>&1
    if exist %2 ( echo     puesto      %~nx2 ) else ( echo     [ojo] no pude mover %~nx1 )
) else (
    if exist %2 ( echo     ya estaba   %~nx2 ) else ( echo     [ojo] no encuentro %~nx1 )
)
exit /b 0

:APARTAR
if exist %1 (
    move /y %1 _PARA_BORRAR >nul 2>&1
    if exist %1 ( echo     [ojo] no pude mover %~nx1 ) else ( echo     apartado    %~nx1 )
) else (
    echo     ya no estaba  %~nx1
)
exit /b 0

:DESUBIR
if exist %1 (
    git rm --cached %1 >nul 2>&1
    if errorlevel 1 ( echo     ya estaba fuera  %~nx1 ) else ( echo     fuera del repo   %~nx1 )
) else (
    echo     ya no esta       %~nx1
)
exit /b 0

:FIN
echo.
pause
