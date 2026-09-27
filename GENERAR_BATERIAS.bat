@echo off
cd /d "%~dp0"
echo.
echo  ==================================================
echo      GENERAR LAS BATERIAS
echo  ==================================================
echo.
echo  HACER_TODO no corre gen_baterias.py, y por eso el
echo  archivo datos_baterias.js quedaba vacio.
echo.
echo  Este armado hace las dos temporadas.
echo.
pause
echo.
echo  [1/4] Abriendo los datos...
python descifrar_datos.py
echo.
echo  [2/4] Baterias de los partidos - capsula 25-26...
python gen_baterias.py "DVW NAFELS 2026" "temporadas\2025-26\datos_baterias.js"
echo.
echo  [3/4] Baterias de la 26-27: PARTIDOS + ENTRENAMIENTOS...
echo.
echo       Antes esta linea mandaba SOLO la carpeta de entrenamientos, y
echo       como pisa datos_baterias.js, los partidos de la temporada nunca
echo       entraban: en la ficha del jugador el filtro PARTIDO quedaba vacio
echo       y el acumulado no los contaba. El motor acepta las dos carpetas
echo       en una sola corrida y las separa por tipo el solo.
echo.
python gen_baterias.py --partidos "DVW NAFELS 2027" --entrenamientos "DVW ENTRENAMIENTOS NAFELS 2026" --out "datos_baterias.js"
echo.
echo  [4/4] Protegiendo los datos...
python cifrar_datos.py
echo.
echo  ==================================================
echo      LISTO. Ahora publica con PUBLICAR_EN_GITHUB
echo  ==================================================
pause
