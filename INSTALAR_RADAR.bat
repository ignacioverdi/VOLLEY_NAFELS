@echo off
chcp 65001 >nul
title Instalar el radar de saque (una sola vez)
cd /d "%~dp0"
echo.
echo  ==================================================
echo     INSTALAR EL RADAR DE SAQUE
echo     Esto se hace UNA SOLA VEZ en esta computadora.
echo  ==================================================
echo.
echo  Voy a instalar cuatro librerias de Python:
echo    numpy        (cuentas)
echo    opencv       (imagenes)
echo    scipy        (el ajuste del vuelo)
echo    onnxruntime  (el modelo que encuentra la pelota)
echo.
echo  Ocupan unos 150 MB en total y tarda un par de minutos.
echo.
pause
echo.
python -m pip install --upgrade pip
python -m pip install numpy opencv-python scipy onnxruntime
echo.
if errorlevel 1 (
  echo  ==================================================
  echo     ALGO FALLO. Fijate el error de arriba.
  echo     Lo mas comun: Python no esta instalado. Se baja
  echo     gratis de python.org y al instalarlo hay que
  echo     marcar "Add Python to PATH".
  echo  ==================================================
) else (
  echo  ==================================================
  echo     LISTO. Ya podes usar MEDIR_SAQUES.bat
  echo  ==================================================
)
echo.
pause
