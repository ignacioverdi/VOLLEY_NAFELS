@echo off
cd /d "%~dp0"
echo.
echo  ==================================================
echo      ACTUALIZAR LOS DATOS DE VIDEO (CORTES)
echo  ==================================================
echo.
echo  Rehace datos_video de los partidos y de los
echo  entrenamientos leyendo los .dvw.
echo.
echo  Hace falta correrlo una vez por este arreglo:
echo  la COMBINACION de cada ataque (QUICK IN 4, PIPE,
echo  HIGH IN 4...) se guardaba solo si el codigo
echo  empezaba con X/V/P/C. Este club tipea con la otra
echo  familia -W4, G4, Y8- y se perdian 681 ataques de
echo  702. Sin ese dato, el editor de cortes no puede
echo  separar el ataque por jugada.
echo.
echo  De aca en mas, HACER_TODO ya lo hace solo.
echo.
pause
echo.
echo  [1/4] Abriendo los datos...
python descifrar_datos.py
echo.
echo  [2/4] Video de los PARTIDOS...
python build_video.py "DVW NAFELS 2027" datos_video.js VIDEO_DATA
echo.
echo  [3/4] Video de los ENTRENAMIENTOS...
python build_video.py "DVW ENTRENAMIENTOS NAFELS 2026" datos_video_ent.js VIDEO_DATA_ENT ent
echo.
echo  [4/4] Protegiendo los datos...
python cifrar_datos.py
echo.
echo  ==================================================
echo      LISTO. Ahora publica con PUBLICAR_EN_GITHUB
echo  ==================================================
pause
