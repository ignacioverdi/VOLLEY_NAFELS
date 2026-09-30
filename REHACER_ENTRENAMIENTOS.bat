@echo off
REM ============================================================================
REM  REHACER_ENTRENAMIENTOS.bat
REM ----------------------------------------------------------------------------
REM  Vuelve a generar SOLO la parte de entrenamientos, para que la distribucion
REM  del armador tome el turno (manana / tarde) de cada sesion.
REM
REM  Hace los mismos pasos que HACER_TODO, en el mismo orden:
REM     1. abrir los datos          (descifrar_datos.py)
REM     2. procesar entrenamientos  (update_db_entrenamientos_nafels.py)
REM     3. revisar que los turnos quedaron bien (CHEQUEAR_TURNOS.py)
REM     4. cerrar los datos         (cifrar_datos.py)
REM
REM  Lo que NO hace, a proposito:
REM     - no toca GitHub, ni para traer ni para publicar: eso lo decide el
REM       entrenador con PUBLICAR_EN_GITHUB.bat
REM     - no pregunta nada: no se queda esperando a nadie
REM     - cierra los datos SIEMPRE, aunque algo falle en el medio, para no
REM       dejar la carpeta con los datos del club en claro
REM
REM  Deja todo lo que imprimio en REHACER_ENTRENAMIENTOS.log
REM ============================================================================
cd /d "%~dp0"
set "LOG=%~dp0REHACER_ENTRENAMIENTOS.log"
REM Los motores imprimen tildes y un tilde de OK. Cuando la salida va a un
REM archivo en vez de a la pantalla, Windows usa una tabla vieja que no los
REM tiene y Python se corta con UnicodeEncodeError justo al terminar. Con
REM esto la salida va en UTF-8 y no se corta. Solo vale para esta ventana.
set "PYTHONIOENCODING=utf-8"
set "PYTHONUTF8=1"
chcp 65001 >nul
>"%LOG%" echo ===== REHACER ENTRENAMIENTOS =====
>>"%LOG%" echo Arranco: %DATE% %TIME%

REM La carpeta de practicas. Si hubiera mas de una, queda la ultima, que por
REM orden alfabetico es la del anio mas nuevo.
set "ENT_DIR="
for /d %%D in ("DVW ENTRENAMIENTOS NAFELS *") do set "ENT_DIR=%%D"
if not defined ENT_DIR goto SINCARPETA

REM El anio sale del nombre de la carpeta: son los ultimos 4 caracteres.
set "ENT_ANIO=%ENT_DIR:~-4%"
>>"%LOG%" echo Carpeta: "%ENT_DIR%"   temporada %ENT_ANIO%
>>"%LOG%" echo.

>>"%LOG%" echo --- 1/4  abriendo los datos ---
if not exist "LLAVE.txt" goto SINLLAVE
python descifrar_datos.py >>"%LOG%" 2>&1
if errorlevel 1 goto NOABRIO
goto PROCESAR

:SINLLAVE
>>"%LOG%" echo [ATENCION] no encuentro LLAVE.txt: los datos ya estaban en claro.
goto PROCESAR

:NOABRIO
>>"%LOG%" echo [ERROR] no pude abrir los datos. Freno aca y los vuelvo a cerrar.
goto CERRAR

:PROCESAR
>>"%LOG%" echo.
>>"%LOG%" echo --- 2/4  procesando entrenamientos ---
python update_db_entrenamientos_nafels.py --dvw_dir "%ENT_DIR%" --temporada %ENT_ANIO% >>"%LOG%" 2>&1
if errorlevel 1 >>"%LOG%" echo [ATENCION] el motor de entrenamientos devolvio error. Segui leyendo arriba.

>>"%LOG%" echo.
>>"%LOG%" echo --- 3/4  revisando los turnos ---
if exist "CHEQUEAR_TURNOS.py" python CHEQUEAR_TURNOS.py >>"%LOG%" 2>&1

:CERRAR
>>"%LOG%" echo.
>>"%LOG%" echo --- 4/4  cerrando los datos ---
if not exist "LLAVE.txt" goto FIN
python cifrar_datos.py >>"%LOG%" 2>&1
if errorlevel 1 >>"%LOG%" echo [ERROR] no pude cerrar los datos. NO PUBLIQUES hasta revisar esto.
goto FIN

:SINCARPETA
>>"%LOG%" echo [ERROR] no hay ninguna carpeta "DVW ENTRENAMIENTOS NAFELS *". No hice nada.

:FIN
>>"%LOG%" echo.
>>"%LOG%" echo Termino: %DATE% %TIME%
>>"%LOG%" echo ===== LISTO =====
exit
