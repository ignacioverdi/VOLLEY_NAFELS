# ====================================================================
#  VIGILAR Y PUBLICAR  -  Volley-Stats
#
#  Mira la carpeta de los .dvw. Cuando llega uno nuevo espera a que
#  dejen de llegar (por defecto 15 minutos, para que entre toda la
#  fecha) y despues hace TODO solo: las placas, la revision, los
#  videos y los textos.
#
#  Abris la compu el lunes y esta hecho.
#
#  Para dejarlo andando: clic derecho -> "Ejecutar con PowerShell",
#  y dejalo abierto. O ponelo en el inicio de Windows.
# ====================================================================

# --- CONFIG -------------------------------------------------------
# Minutos de silencio antes de arrancar. Si los 4 partidos llegan de
# a uno, conviene que sea mas alto que el rato entre archivo y archivo.
$EsperaMinutos = 15
# Videos tambien en vertical (historias / reels): $true o $false
$Vertical      = $false
# ------------------------------------------------------------------

$ErrorActionPreference = "Continue"
$placas = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $placas
$repo = Split-Path -Parent $placas
$log  = Join-Path $placas "auto.log"

function Escribir($txt) {
  $linea = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $txt
  Write-Host $linea
  Add-Content -Path $log -Value $linea
}

# la carpeta de .dvw mas nueva del repo, con el mismo criterio que los scripts
$carpeta = Get-ChildItem -Path $repo -Directory |
  Where-Object { $_.Name -like "DVW *" -and $_.Name -notlike "*ENTREN*" -and $_.Name -notlike "*HIGH SET*" } |
  Where-Object { (Get-ChildItem $_.FullName -Filter *.dvw -ErrorAction SilentlyContinue).Count -gt 0 } |
  Sort-Object Name -Descending | Select-Object -First 1

if (-not $carpeta) {
  Escribir "ERROR: no encuentro ninguna carpeta 'DVW ...' con archivos .dvw en $repo"
  Read-Host "Enter para salir"
  exit
}

Escribir "Vigilando: $($carpeta.FullName)"
Escribir "Espera de $EsperaMinutos minutos sin archivos nuevos antes de publicar."
Escribir "Dejalo abierto. Ctrl+C para cortar."

# firma de lo que ya esta, para no rehacer lo de antes al arrancar
function Firma {
  (Get-ChildItem $carpeta.FullName -Filter *.dvw -ErrorAction SilentlyContinue |
    Sort-Object Name | ForEach-Object { "$($_.Name)|$($_.Length)" }) -join ";"
}

$ultima      = Firma
$hechaPara   = $ultima
$cambioEn    = $null

while ($true) {
  Start-Sleep -Seconds 30
  $ahora = Firma

  if ($ahora -ne $ultima) {
    $ultima   = $ahora
    $cambioEn = Get-Date
    Escribir "Llego un archivo nuevo. Espero $EsperaMinutos minutos por si vienen mas."
    continue
  }

  if ($null -eq $cambioEn) { continue }
  if (((Get-Date) - $cambioEn).TotalMinutes -lt $EsperaMinutos) { continue }
  if ($ahora -eq $hechaPara) { $cambioEn = $null; continue }

  $fecha = (& python seis_placas.py --ultima 2>$null | Select-Object -Last 1).Trim()
  if (-not $fecha -or $fecha -eq "0") {
    Escribir "No pude saber que fecha es. Lo hago a mano con HACER_PLACAS.bat."
    $cambioEn = $null
    continue
  }

  Escribir "Arranco la fecha $fecha."
  if ($Vertical) { & python publicar.py --fecha $fecha --vertical }
  else           { & python publicar.py --fecha $fecha }
  $code = $LASTEXITCODE

  if ($code -eq 0) { Escribir "Fecha $fecha lista, sin avisos." }
  elseif ($code -eq 1) { Escribir "Fecha $fecha lista, PERO con avisos: mira REVISION.txt antes de publicar." }
  else { Escribir "Fecha $fecha: algo fallo (codigo $code)." }

  $hechaPara = $ahora
  $cambioEn  = $null
}
