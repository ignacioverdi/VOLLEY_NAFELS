@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
cls
echo.
echo  ==================================================================
echo     GUARDAR LA FOTO DE LAS PANTALLAS
echo  ==================================================================
echo.
echo  Esto toma una foto de como estan las pantallas AHORA, con todo
echo  andando bien. De ahi en mas, cada vez que corras HACER_TODO se
echo  comparan contra esta foto y te avisa si alguna quedo rota.
echo.
echo  Se corre UNA SOLA VEZ. Despues no hay que volver a tocarlo.
echo.
pause
echo.
python CONTROL_PANTALLAS.py --guardar
if errorlevel 9009 (
  echo.
  echo  No encontre Python. Proba con:
  echo      py CONTROL_PANTALLAS.py --guardar
  echo.
  py CONTROL_PANTALLAS.py --guardar
)
echo.
echo  ==================================================================
pause
