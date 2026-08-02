@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ==================================================
echo      REGENERAR EL PLAN DE PARTIDO DE LA 25-26
echo  ==================================================
echo.
echo  Vuelve a armar el plan de partido de la capsula con la
echo  zona de ORIGEN del ataque, que hace falta para ver en
echo  que zona te bloquean.
echo.
echo  HACER_TODO no lo regenera porque apunta a la 2026/27,
echo  donde todavia no hay partidos jugados.
echo.
echo  Solo toca plan_partido_data.js de la capsula. Nada mas.
echo.
pause

echo.
echo  [1/3] Abriendo los datos...
python descifrar_datos.py
echo.

echo  [2/3] Armando el plan de partido de la 2025/26...
python gen_plan_partido.py --dvw_dir "DVW NAFELS 2026" --output_dir "temporadas\2025-26" --filter_temporada "2025/26"
echo.

echo  [3/3] Protegiendo los datos de nuevo...
python cifrar_datos.py
echo.

echo  ==================================================
echo      LISTO
echo.
echo      Ahora publica con PUBLICAR_EN_GITHUB.bat
echo  ==================================================
pause
