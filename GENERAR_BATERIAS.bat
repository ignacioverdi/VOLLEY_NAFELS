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
echo  [3/4] Baterias de los entrenamientos - 26-27...
python gen_baterias.py "DVW ENTRENAMIENTOS NAFELS 2026" "datos_baterias.js"
echo.
echo  [4/4] Protegiendo los datos...
python cifrar_datos.py
echo.
echo  ==================================================
echo      LISTO. Ahora publica con PUBLICAR_EN_GITHUB
echo  ==================================================
pause
