#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  PONER_FICHA.py — instala MI JUEGO, la pantalla del jugador
-------------------------------------------------------------------------------
  Por defecto NO toca nada: muestra lo que haria. Para aplicarlo de verdad:

      PONER_FICHA.bat          (o)       python PONER_FICHA.py --si

  De cada archivo que cambia deja una copia  <archivo>.antes_ficha  antes de
  escribir. Se puede correr dos veces: si ya esta puesto, avisa y no hace nada.

  ── QUE ES ──────────────────────────────────────────────────────────────────

  Una pantalla nueva, mi_juego.html, que le contesta al jugador cuatro cosas
  que hoy no tiene en ningun lado:

      1. Cuanto aporto en la temporada, en PUNTOS y no en una nota: los
         rallies que gano de mas —o de menos— que lo esperable para su puesto
         en la NLA. Es el mismo motor del informe de equipo, mirado jugador
         por jugador.
      2. Partido por partido, con el promedio movil de los ultimos tres
         encima: la tendencia, en las mismas unidades y en el mismo eje.
      3. Contra los de SU PUESTO en la liga —no contra sus companeros, que es
         la comparacion que no sirve para nada—, con el riel de lo peor a lo
         mejor que hace ese puesto y su lugar entre los que tienen muestra.
      4. Su reel: sus propias jugadas, cada una con el segundo de video.

  Lo que NO hace: no inventa un numero. Si no hay muestra, lo dice y no
  dibuja. Si la liga todavia no tiene suficientes jugadores de ese puesto,
  tambien lo dice.

  ── QUIEN VE QUE ────────────────────────────────────────────────────────────

  Si quien entro es un JUGADOR (vb_role='player'), ve su ficha y nada mas: no
  hay selector y los numeros de sus companeros no se dibujan. El cuerpo
  tecnico ve el plantel completo. Es la misma regla del resto de la app.

  ── QUE TOCA, Y POR QUE ─────────────────────────────────────────────────────

  1) cifrar_datos.py y descifrar_datos.py
                     agrega 'datos_ficha.js' a las dos listas. Sin esto el
                     archivo se publicaria EN CLARO en un repositorio publico,
                     con el rendimiento de cada jugador adentro.
                     Tiene que estar en las DOS: si solo esta en la de cifrar,
                     HACER_TODO no lo puede volver a abrir y queda congelado.

  2) HACER_TODO.bat  agrega la corrida de gen_ficha.py, DESPUES de las
                     estadisticas de la liga: la referencia por puesto sale de
                     nla_full_stats.json, que lo escribe ese paso. Corrido
                     antes, la comparacion contra la liga saldria vacia.

  3) jugador.html    un cartel arriba que lleva a la pantalla nueva, llevando
                     el dorsal en el link.

  4) index.html      una segunda tarjeta al lado de "Mi Perfil", solo para el
                     que entra como jugador.

  5) nav.js          la pantalla nueva en el menu, en el grupo Plantel.

  6) LIMPIAR_AHORA.py  aprende a borrar las copias .antes_ficha, como ya hace
                     con las demas.

  Ninguno de los seis cambia una linea de lo que ya funcionaba: son seis
  agregados. Si alguno no encuentra su lugar exacto, ese se saltea y los
  otros se hacen igual.
===============================================================================
"""
import os
import sys
import shutil
import hashlib

AQUI = os.path.dirname(os.path.abspath(__file__))
APLICAR = ('--si' in sys.argv)
DESDE_BAT = ('--desde-bat' in sys.argv)

NUEVOS = ['gen_ficha.py', 'ficha.js', 'mi_juego.html']


def leer(nombre):
    """Se lee en binario y se pasa a texto a mano para NO tocar los finales de
    linea: los .bat de Windows dejan de funcionar si se les cambian."""
    with open(os.path.join(AQUI, nombre), 'rb') as f:
        return f.read().decode('utf-8', 'surrogateescape')


def escribir(nombre, txt):
    ruta = os.path.join(AQUI, nombre)
    copia = ruta + '.antes_ficha'
    if not os.path.exists(copia):
        shutil.copy2(ruta, copia)
    with open(ruta, 'wb') as f:
        f.write(txt.encode('utf-8', 'surrogateescape'))


def md5(nombre):
    with open(os.path.join(AQUI, nombre), 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()


# ── 1) las dos listas de cifrado ────────────────────────────────────────────
def cambio_lista(s):
    if "'datos_ficha.js'" in s:
        return None, 'ya estaba'
    for anc in ("    'datos_lectura.js',\n", "    'datos_informe.js',\n"):
        if anc in s:
            return s.replace(anc, anc +
                             "    # Mi juego: el rendimiento de cada jugador del plantel,\n"
                             "    # partido por partido. Viaja cifrado como el resto.\n"
                             "    'datos_ficha.js',\n", 1), 'agregado a la lista'
    return None, "no encontre donde engancharlo (ni datos_lectura.js ni datos_informe.js)"


# ── 2) HACER_TODO.bat ───────────────────────────────────────────────────────
# Se escribe SIN finales de linea y despues se arman con los que ya tenga el
# archivo: HACER_TODO.bat de Nafels esta guardado con finales de Unix y
# funciona asi, de modo que meterle lineas de Windows lo dejaria mezclado.
LINEAS_BAT = [
    "REM ===================================================================",
    "REM   MI JUEGO  (la pantalla del jugador)",
    "REM",
    "REM   Va DESPUES de las estadisticas de la liga a proposito: la",
    "REM   referencia por puesto (cuanto rinde un punta, un central o un",
    "REM   armador en la NLA) sale de nla_full_stats.json, que lo escribe",
    "REM   el paso de arriba. Corrido antes, la comparacion contra la liga",
    "REM   saldria vacia y nadie se enteraria.",
    "REM ===================================================================",
    "echo  ==================== MI JUEGO ====================",
    "echo.",
    "if \"!ENT_DIR!\"==\"\" (",
    "    python gen_ficha.py --dvw_dir \"!DVW_DIR!\" --temporada \"!TEMPORADA_ACTUAL!\" --out \"datos_ficha.js\"",
    ") else (",
    "    python gen_ficha.py --dvw_dir \"!DVW_DIR!\" --ent_dir \"!ENT_DIR!\" --temporada \"!TEMPORADA_ACTUAL!\" --out \"datos_ficha.js\"",
    ")",
    "if errorlevel 1 echo      [aviso] Problema armando Mi juego. Sigo igual.",
    "if errorlevel 1 set \"FALLOS=!FALLOS!|Problema armando Mi juego.\"",
    "if errorlevel 1 set /a NFALLOS+=1",
    "echo.",
    "",
]


def cambio_hacer_todo(s):
    if 'gen_ficha.py' in s:
        return None, 'ya estaba'
    fin = '\r\n' if '\r\n' in s else '\n'

    def L(ls):
        return fin.join(ls) + fin

    anc = L(['if errorlevel 1 set /a NFALLOS+=1', 'echo.', '',
             'echo  ==================================================',
             'echo      VERIFICACION (archivos clave):'])
    if s.count(anc) != 1:
        return None, ('no encontre el final del bloque de la liga (aparece %d veces)' % s.count(anc))
    corte = L(['if errorlevel 1 set /a NFALLOS+=1', 'echo.', ''])
    resto = L(['echo  ==================================================',
               'echo      VERIFICACION (archivos clave):'])
    return s.replace(anc, corte + L(LINEAS_BAT) + resto, 1), 'bloque agregado despues de la liga'


# ── 3) el cartel en jugador.html ────────────────────────────────────────────
ANC_JUG = '<div class="qs-bar" id="quick-stats" style="display:none;"></div>'
CARTEL = '''
<!-- MI JUEGO: el link a la pantalla nueva. Se dibuja solo si existe el
     archivo; si alguien borra mi_juego.html, el cartel no aparece y
     jugador.html sigue funcionando igual que antes. -->
<a id="ir-mi-juego" href="mi_juego.html" style="display:none;align-items:center;gap:12px;
   margin:10px 14px 0;padding:13px 15px;border-radius:13px;text-decoration:none;
   border:1px solid rgba(232,25,44,.34);background:linear-gradient(90deg,rgba(232,25,44,.13),rgba(232,25,44,.03));
   color:#E9ECF3">
  <span style="font-size:21px;line-height:1">📊</span>
  <span style="flex:1;min-width:0">
    <b style="display:block;font-family:'Barlow Condensed',sans-serif;font-size:16px;
       font-weight:700;letter-spacing:.4px" data-t="MI JUEGO">MI JUEGO</b>
    <s style="display:block;text-decoration:none;font-size:12px;color:#8A94A6;margin-top:2px"
       data-t="Tu aporte partido a partido y contra la liga">Tu aporte partido a partido y contra la liga</s>
  </span>
  <span style="color:#E8192C;font-size:17px">→</span>
</a>
<script>
(function(){
  /* El dorsal viaja en el link para que la pantalla abra directo en el
     jugador que se esta mirando. Si no hay dorsal, abre con el selector. */
  try{
    var a=document.getElementById('ir-mi-juego'); if(!a) return;
    var n=(new URLSearchParams(location.search)).get('num');
    if(!n){ try{ n=localStorage.getItem('vb_player_num')||''; }catch(e){} }
    if(n) a.href='mi_juego.html?num='+encodeURIComponent(n);
    a.style.display='flex';
  }catch(e){}
})();
</script>'''


def cambio_jugador(s):
    if 'ir-mi-juego' in s:
        return None, 'ya estaba'
    if s.count(ANC_JUG) != 1:
        return None, 'no encontre la barra de stats una sola vez (aparece %d veces)' % s.count(ANC_JUG)
    fin = '\r\n' if '\r\n' in s else '\n'
    return s.replace(ANC_JUG, ANC_JUG + CARTEL.replace('\n', fin), 1), 'cartel agregado arriba'


# ── 4) la tarjeta en index.html ─────────────────────────────────────────────
ANC_IDX = '      firstGrid.insertBefore(a, firstGrid.firstChild);'
TARJETA = '''
      /* MI JUEGO, al lado de Mi Perfil. Misma regla: solo para el que entra
         como jugador, y con el dorsal en el link. */
      var b = document.createElement('a');
      b.className = 'card'; b.href = 'mi_juego.html?num='+encodeURIComponent(num);
      b.style.cssText = '--card-color:#E8192C;grid-column:1/-1';
      b.innerHTML =
        '<div class="card-glow"></div>'+
        '<div class="card-top">'+
          '<div class="card-icon" style="background:rgba(232,25,44,.1);border-color:rgba(232,25,44,.22)">📊</div>'+
          '<div class="card-badge" style="background:rgba(232,25,44,.1);color:#E8192C;border:1px solid rgba(232,25,44,.22)">Nuevo</div>'+
        '</div>'+
        '<div class="card-body">'+
          '<div class="card-title" style="color:#E8192C">Mi juego</div>'+
          '<div class="card-desc">Tu aporte partido a partido, contra tu puesto en la liga, y tus jugadas en video.</div>'+
        '</div>'+
        '<div class="card-arrow" style="color:#E8192C">→</div>';
      firstGrid.insertBefore(b, firstGrid.firstChild);'''


def cambio_index(s):
    if 'mi_juego.html' in s:
        return None, 'ya estaba'
    if s.count(ANC_IDX) != 1:
        return None, 'no encontre el bloque de la tarjeta Mi Perfil (aparece %d veces)' % s.count(ANC_IDX)
    fin = '\r\n' if '\r\n' in s else '\n'
    return s.replace(ANC_IDX, ANC_IDX + TARJETA.replace('\n', fin), 1), 'tarjeta agregada en la portada'


# ── 5) el menu ──────────────────────────────────────────────────────────────
ANC_NAV = '["jugador.html","Ficha del jugador","Player profile","Spielerprofil","persona"]'
NUE_NAV = ANC_NAV + ',["mi_juego.html","Mi juego","My game","Mein Spiel","barras"]'


def cambio_nav(s):
    if 'mi_juego.html' in s:
        return None, 'ya estaba'
    if s.count(ANC_NAV) != 1:
        return None, 'no encontre la entrada de jugador.html (aparece %d veces)' % s.count(ANC_NAV)
    return s.replace(ANC_NAV, NUE_NAV, 1), 'agregado al menu, en Plantel'


# ── 6) la limpieza ──────────────────────────────────────────────────────────
def cambio_limpiar(s):
    if 'antes_ficha' in s:
        return None, 'ya estaba'
    hechos = 0
    a = "'*.antes_comillas'"
    if s.count(a) == 1:
        s = s.replace(a, a + ", '*.antes_lectura', '*.antes_ficha'", 1); hechos += 1
    b = "'.antes_comillas'"
    if s.count(b) == 1:
        s = s.replace(b, b + ", '.antes_lectura', '.antes_ficha'", 1); hechos += 1
    if not hechos:
        return None, 'no encontre las listas de copias'
    return s, 'aprendio a borrar las copias .antes_ficha'


CAMBIOS = [
    ('cifrar_datos.py', cambio_lista),
    ('descifrar_datos.py', cambio_lista),
    ('HACER_TODO.bat', cambio_hacer_todo),
    ('jugador.html', cambio_jugador),
    ('index.html', cambio_index),
    ('nav.js', cambio_nav),
    ('LIMPIAR_AHORA.py', cambio_limpiar),
]


def main():
    print('')
    print('=' * 68)
    print('  MI JUEGO — la pantalla del jugador' + ('' if APLICAR else '   (prueba: no escribo nada)'))
    print('=' * 68)
    print('')

    faltan = [n for n in NUEVOS if not os.path.exists(os.path.join(AQUI, n))]
    if faltan:
        print('  [ERROR] faltan estos archivos en la carpeta: ' + ', '.join(faltan))
        print('          Copialos primero y volve a correr esto.')
        return 1
    for n in NUEVOS:
        print('  ok   %-22s %s' % (n, md5(n)))
    print('')

    hechos = 0
    for nombre, fn in CAMBIOS:
        ruta = os.path.join(AQUI, nombre)
        if not os.path.exists(ruta):
            print('  --   %-22s no esta en la carpeta, lo salteo' % nombre)
            continue
        try:
            s = leer(nombre)
        except Exception as e:
            print('  !!   %-22s no lo pude leer: %s' % (nombre, e))
            continue
        nuevo, motivo = fn(s)
        if nuevo is None:
            print('  --   %-22s %s' % (nombre, motivo))
            continue
        if APLICAR:
            escribir(nombre, nuevo)
            print('  OK   %-22s %s' % (nombre, motivo))
        else:
            print('  ->   %-22s %s' % (nombre, motivo))
        hechos += 1

    print('')
    if not APLICAR:
        print('  Nada se escribio. Para aplicarlo de verdad: PONER_FICHA.bat')
    elif hechos:
        print('  Listo: %d archivos cambiados (quedo una copia .antes_ficha de cada uno).' % hechos)
        print('')
        print('  AHORA, para que aparezca:')
        print('     1) ACTUALIZAR_FICHA.bat     genera y cifra los datos')
        print('     2) VER_LA_APP.bat           miralo antes de publicar')
        print('     3) PUBLICAR_EN_GITHUB.bat')
    else:
        print('  No habia nada que hacer: ya estaba todo puesto.')
    print('')
    return 0


if __name__ == '__main__':
    try:
        r = main()
    except Exception:
        import traceback
        traceback.print_exc()
        r = 1
    if not DESDE_BAT:
        try:
            input('\n  (enter para cerrar) ')
        except Exception:
            pass
    sys.exit(r)
