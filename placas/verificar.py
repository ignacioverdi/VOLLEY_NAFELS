#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Chequeo antes de publicar. Se corre solo desde HACER_PLACAS.bat.

Tres cosas que no se ven mirando el PNG y que arruinan una publicación:

  1. DESBORDE — la placa mide 1080x1350 fijo y el navegador recorta lo que
     sobra sin avisar. Un pie de dos renglones que pasa a tres tapa el
     dibujo, y en el PNG parece que "quedó apretado". Acá se mide de verdad,
     con la página liberada, y se compara el borde del dibujo contra el
     texto de arriba y el de abajo.

  2. COHERENCIA CON LA APP — las placas cortan K1 y transición con la misma
     definición que update_db_nafels_FULL.py (la fase que scoutea
     DataVolley). Si algún día uno de los dos cambia, el mismo jugador
     tendría dos números distintos según dónde se lo mire, y eso es lo peor
     que nos puede pasar. Acá se comparan jugador por jugador contra
     nla_stats.json.

  3. MUESTRA — avisa si la fecha tiene pocos partidos o pocos equipos como
     para decir "de la fecha" sin exagerar.

Uso:
    python verificar.py --repo .. --fecha 3
"""
import argparse, json, pathlib, sys

import fechas, liga, placas2, seis_placas

# Se mide la caja que ocupan TODOS los hijos de la zona del dibujo, no el
# primero. La tabla y las seis canchitas devuelven varios bloques (la línea
# del filtro, la leyenda, el dibujo), y midiendo solo el primero el chequeo
# decía que sobraban 700 píxeles mientras la placa se estaba cortando.
MEDIDA = """() => {
  const r = s => { const e = document.querySelector(s);
                   return e ? e.getBoundingClientRect() : null; };
  const arriba = r('.bj') || r('h1');
  const abajo  = r('.pi') || r('.ct');
  const hijos  = [...document.querySelectorAll('.zn>*')];
  let top = Infinity, bot = -Infinity;
  for (const h of hijos) { const b = h.getBoundingClientRect();
                           if (b.height || b.width) { top = Math.min(top, b.top);
                                                      bot = Math.max(bot, b.bottom); } }
  if (!hijos.length || top === Infinity) { const z = r('.zn'); top = z.top; bot = z.bottom; }
  document.body.style.height = 'auto';
  document.body.style.overflow = 'visible';
  // el ancho tambien: una tabla que se pasa del margen no se ve cortada en
  // el PNG, se ve apretada contra el borde, y eso no lo cazaba nadie
  let ancho = 0;
  for (const e of document.querySelectorAll('.zn *')) {
    const b = e.getBoundingClientRect();
    if (b.width) ancho = Math.max(ancho, b.right);
  }
  return {arriba: Math.round(top - arriba.bottom),
          abajo:  Math.round(abajo.top - bot),
          derecha: Math.round(document.body.clientWidth - 56 - ancho),
          alto:   Math.round(document.body.getBoundingClientRect().height)};
}"""


def desborde(piezas):
    from playwright.sync_api import sync_playwright
    tmp = pathlib.Path('_verificar.html')
    malas = []
    with sync_playwright() as pw:
        b = placas2._navegador(pw)
        pg = b.new_page(viewport={'width': 1080, 'height': 1350})
        for p in piezas:
            # la portada y el cierre no tienen zona de dibujo ni bajada: no
            # hay nada que se pueda pisar y la medición no aplica
            if p.get('tipo') in ('apertura', 'cierre', 'portada'):
                continue
            tmp.write_text(placas2.render(p), encoding='utf-8')
            pg.goto(tmp.resolve().as_uri())
            pg.wait_for_timeout(250)
            m = pg.evaluate(MEDIDA)
            mal = (m['arriba'] < 8 or m['abajo'] < 8 or m['alto'] > 1352
                   or m.get('derecha', 0) < -2)
            print('   %-14s arriba %4d  abajo %4d  derecha %4d  alto %4d   %s'
                  % (p['slug'], m['arriba'], m['abajo'],
                     m.get('derecha', 0), m['alto'],
                     'SE PISA' if mal else 'ok'))
            if mal:
                malas.append(p['slug'])
        b.close()
    tmp.unlink(missing_ok=True)
    return malas


def coherencia(repo, carpeta, temporada, archivos):
    """K1 y transición de las placas contra los de nla_stats.json."""
    try:
        d = json.loads((pathlib.Path(repo) / 'nla_stats.json').read_text(encoding='utf-8'))
    except (OSError, ValueError):
        print('   no encuentro nla_stats.json, salteo el contraste')
        return []
    M = {(p['team'], '%02d' % p['num']): p
         for p in d.get('players', []) if p.get('temporada') == temporada}
    if not M:
        print('   nla_stats.json todavía no tiene la temporada %s, salteo' % temporada)
        return []
    EQ = liga.leer(repo, carpeta, archivos)
    ok, malas = 0, []
    for (eq, dor), p in sorted(M.items()):
        J = EQ.get(eq, {}).get('jug', {}).get(dor)
        if not J or not J['ataque']['T']:
            continue
        mio = (J['atk_k1']['T'], J['atk_k2']['T'])
        suyo = (p.get('atk_so_tot') or 0, p.get('atk_tr_tot') or 0)
        if mio == suyo:
            ok += 1
        else:
            malas.append('%s #%s: placa %d/%d, app %d/%d'
                         % (eq, dor, mio[0], mio[1], suyo[0], suyo[1]))
    print('   %d jugadores coinciden con la app, %d difieren' % (ok, len(malas)))
    for x in malas:
        print('      ' + x)
    return malas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='..')
    ap.add_argument('--carpeta', default='')
    ap.add_argument('--temporada', default='')
    ap.add_argument('--fecha', default='')
    a = ap.parse_args()

    if not a.carpeta or not a.temporada:
        c, t = seis_placas.detectar(a.repo)
        if not c:
            raise SystemExit('No encuentro la carpeta de .dvw. Pasá --repo.')
        a.carpeta = a.carpeta or c
        a.temporada = a.temporada or t

    ruta = pathlib.Path(a.repo) / a.carpeta
    archivos, grupos, _ = fechas.archivos_de(ruta, a.fecha or None, None)
    if archivos is None:
        raise SystemExit('No existe la fecha %s.' % a.fecha)

    rotulo = ('Fecha %s · %s' % (a.fecha, a.temporada)) if a.fecha \
        else ('Temporada %s' % a.temporada)
    piezas = seis_placas.construir(a.repo, a.carpeta, a.temporada, rotulo, archivos)

    print()
    print('1. Que nada se pise ni se corte')
    malas = desborde(piezas)

    print()
    print('2. Que las placas digan lo mismo que la app')
    dif = coherencia(a.repo, a.carpeta, a.temporada, archivos)

    print()
    print('3. La muestra')
    eqs = set()
    for p in piezas:
        for f in p.get('filas', []):
            if 'equipo' in f:
                eqs.add(f['equipo'])
    n_eq = len(eqs) or None
    print('   %d partidos%s' % (len(archivos),
                                (', %d equipos' % n_eq) if n_eq else ''))
    if len(archivos) < 3:
        print('   OJO: con menos de 3 partidos yo no diría "de la fecha".')
    if n_eq and n_eq < 6:
        print('   OJO: solo %d equipos. Los "mejores de la fecha" van a salir '
              'casi todos de los mismos clubes.' % n_eq)

    print()
    if malas or dif:
        print('HAY ALGO PARA REVISAR ANTES DE PUBLICAR.')
        return 1
    print('Todo en orden: %d placas listas para publicar.' % len(piezas))
    return 0


if __name__ == '__main__':
    sys.exit(main())
