@echo off
chcp 65001 >nul
title DETALLES - idioma y el armado de alta
echo.
echo  ==================================================
echo    LOS DETALLES ANOTADOS
echo  ==================================================
echo.
echo  1) Idioma: 97 claves nuevas en lang.js. Con la app en ingles
echo     quedaban 125 frases en castellano; despues quedan 3, y las
echo     tres ya estaban en ingles. En aleman, ninguna.
echo.
echo  2) El guion del panel de objetivos: gen_baterias.py no contaba
echo     el armado de alta, por eso esa bateria no tenia numero.
echo.
echo  3) El partido repetido de St Gallen se mueve a _repetidos.
echo.
echo  Deja una copia .antes_detalles de cada archivo que toca.
echo.
pause
echo.
python ARREGLAR_DETALLES.py --si --desde-bat
echo.
pause
