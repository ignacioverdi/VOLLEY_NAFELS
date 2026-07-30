"""
===============================================================================
  arreglar_armador.py — LA SOLAPA DE ARMADO
-------------------------------------------------------------------------------
  Doble clic. Trabaja sobre plan_partido.html y jugador.html de esta carpeta.

  ── QUÉ ARREGLA ─────────────────────────────────────────────────────────────

  1) LA SOLAPA DE ARMADO NO ENCONTRABA AL EQUIPO
     Al traer la pantalla del otro club, el reemplazo de nombres cambió la
     clave pero no el valor:

         ARM_SLUG = { ..., nafels: "casla", ... }
                            └ la clave  └ el valor, del otro club

     La pantalla hace  LIGA_DATA.teams[valor]  y buscaba un equipo que en este
     club no existe. Encima quedaron los doce equipos de la otra liga.

     Ahora la tabla se arma sola con los equipos que hay de verdad en los
     datos: la clave y el valor son el mismo nombre, que es lo que corresponde.

  2) EL ACCESO DECÍA "DISTRIBUCIÓN"
     En el perfil, el acceso a la solapa de armado se llamaba "Distribución".
     Pasa a decir "Armado", que es como lo llama todo el resto de la app.

  Queda una copia .antes-armador de cada archivo.
===============================================================================
"""
import os
import re
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))

print()
print('  ' + '=' * 62)
print('     LA SOLAPA DE ARMADO')
print('  ' + '=' * 62)
print()

hechos = []

# ══ 1 · la tabla de equipos del armador ═════════════════════════════════════
p = os.path.join(AQUI, 'plan_partido.html')
if not os.path.exists(p):
    print('  No encuentro plan_partido.html.')
else:
    s = open(p, encoding='utf-8', errors='replace').read()
    m = re.search(r'var ARM_SLUG\s*=\s*\{[^;]*?\};', s, re.S)
    if not m:
        m = re.search(r'ARM_SLUG\s*=\s*\{[^;]*?\};', s, re.S)

    if m and 'ARM_SLUG = (function' not in s:
        viejo = m.group(0)
        # qué decía antes, para poder mostrarlo
        pares = re.findall(r'(\w+)\s*:\s*"([^"]+)"', viejo)
        malos = [(k, v) for k, v in pares if k != v]

        NUEVO = '''var ARM_SLUG = (function(){
  /* Con qué nombre figura cada equipo en los datos del armador.
     Antes iba una tabla escrita a mano, y al traer esta pantalla de otro club
     el reemplazo de nombres la dejó apuntando a equipos que acá no existen.
     Ahora sale de los propios datos: la clave y el valor son el mismo nombre. */
  var m = {};
  try {
    var t = (window.LIGA_DATA && window.LIGA_DATA.teams) || {};
    Object.keys(t).forEach(function(k){ m[k] = k; });
  } catch(e) {}
  try {
    var p = window.PP_DATA || {};
    Object.keys(p).forEach(function(k){
      if(m[k]) return;
      /* si el plan lo llama distinto, se busca la clave que le corresponde */
      var lk = String(k).toLowerCase().replace(/[^a-z0-9]/g, '');
      var t2 = (window.LIGA_DATA && window.LIGA_DATA.teams) || {};
      var enc = Object.keys(t2).filter(function(x){
        var xk = String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
        return xk === lk || xk.indexOf(lk) >= 0 || lk.indexOf(xk) >= 0;
      })[0];
      m[k] = enc || k;
    });
  } catch(e) {}
  return m;
})();'''
        s = s.replace(viejo, NUEVO, 1)
        if not os.path.exists(p + '.antes-armador'):
            shutil.copy2(p, p + '.antes-armador')
        open(p, 'w', encoding='utf-8').write(s)
        hechos.append('la tabla de equipos del armador')
        if malos:
            print('     estaba mal apuntado:')
            for k, v in malos[:4]:
                print('        %s  ->  "%s"   (deberia ser "%s")' % (k, v, k))
            print()
    elif 'ARM_SLUG = (function' in s:
        print('     la tabla del armador ya estaba bien')

# ══ 2 · el nombre del acceso ════════════════════════════════════════════════
p2 = os.path.join(AQUI, 'jugador.html')
if not os.path.exists(p2):
    print('  No encuentro jugador.html.')
else:
    s2 = open(p2, encoding='utf-8', errors='replace').read()
    if "title:'Distribuci" in s2:
        s2 = re.sub(r"title:'Distribuci[^']*'", "title:'Armado'", s2)
        if not os.path.exists(p2 + '.antes-armador'):
            shutil.copy2(p2, p2 + '.antes-armador')
        open(p2, 'w', encoding='utf-8').write(s2)
        hechos.append('el acceso ahora dice "Armado"')
    else:
        print('     el acceso ya decia "Armado"')

print()
if hechos:
    for h in hechos:
        print('     ' + h)
    print()
    print('  Listo. Se guardo una copia .antes-armador.')
    print()
    print('  Publica desde la carpeta principal del club.')
else:
    print('  No habia nada que arreglar.')
print()
input('  Enter para cerrar...')
