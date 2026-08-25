# -*- coding: utf-8 -*-
"""
Deja los fixtures de H1L y H2L listos para cargar en el calendario.

DE DONDE SALEN
De la web oficial de Swiss Volley, del Game Center de Volley Näfels:

    H1L   Axpo Volley Näfels (1L, M)       20 partidos
    H2L   Axpo Volley Näfels H3 (2L, M)    14 partidos

Los nombres de los rivales y los recintos estan tal cual los publica la
federacion: no se acortan ni se traducen, para que coincidan con lo que ve
el cuerpo tecnico en la web oficial.

QUE HACE ESTE PROGRAMA
Escribe un archivo por categoria dentro de la carpeta del club. Despues, en
el calendario de esa categoria, se aprieta "Importar fixture" y quedan
cargados los partidos.

NO pisa lo que ya haya cargado: el importador del calendario saltea los
partidos repetidos (misma fecha, mismo rival, misma condicion).
"""

import io
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))

NOSOTROS = 'Axpo Volley Näfels'

# ── H1L · Axpo Volley Näfels (1. Liga, M) ────────────────────────────────
H1L = """
2026-10-03|16:00|STV St.Gallen Volleyball|Axpo Volley Näfels|St. Gallen
2026-10-09|20:00|Axpo Volley Näfels|VBC Galina|Näfels
2026-10-11|17:15|Axpo Volley Näfels|VC Smash Winterthur|Näfels
2026-10-24|16:00|Volley Oerlikon|Axpo Volley Näfels|Zürich
2026-10-31|14:00|Pallavolo Kreuzlingen|Axpo Volley Näfels|Kreuzlingen
2026-11-08|16:00|Axpo Volley Näfels|VBC Voléro Zürich|Näfels
2026-11-14|13:00|Axpo Volley Näfels|VBC Schaffhausen|Glarus Nord
2026-11-21|16:00|VBC Andwil-Arnegg|Axpo Volley Näfels|Andwil
2026-11-28|14:00|NNV Volleytalents Rapperswil-Jona|Axpo Volley Näfels|Jona
2026-12-06|13:00|Axpo Volley Näfels|VBC Züri Unterland|Näfels
2026-12-12|15:00|VBC Glaronia|Axpo Volley Näfels|Glarus
2026-12-20|13:00|Axpo Volley Näfels|STV St.Gallen Volleyball|Näfels
2027-01-08|20:00|VBC Galina|Axpo Volley Näfels|Vaduz
2027-01-16|18:30|VC Smash Winterthur|Axpo Volley Näfels|Winterthur
2027-01-23|13:00|Axpo Volley Näfels|Volley Oerlikon|Näfels
2027-01-31|13:00|Axpo Volley Näfels|Pallavolo Kreuzlingen|Näfels
2027-02-06|14:30|VBC Voléro Zürich|Axpo Volley Näfels|Zürich
2027-02-13|16:00|VBC Schaffhausen|Axpo Volley Näfels|Schaffhausen
2027-02-20|13:00|Axpo Volley Näfels|VBC Andwil-Arnegg|Näfels
2027-02-28|13:00|Axpo Volley Näfels|NNV Volleytalents Rapperswil-Jona|Näfels
"""

# ── H2L · Axpo Volley Näfels H3 (2. Liga, M) ─────────────────────────────
H2L = """
2026-10-16|20:30|VBC Chur H1|Axpo Volley Näfels H3|Chur
2026-10-28|20:30|VBC March H1|Axpo Volley Näfels H3|Siebnen
2026-11-03|20:00|Axpo Volley Näfels H3|TSV Jona Volleyball H3|Glarus Nord
2026-11-21|16:00|Volley Pizol H1|Axpo Volley Näfels H3|Bad Ragaz
2026-11-27|20:30|VBC Chur H2|Axpo Volley Näfels H3|Chur
2026-12-01|20:00|Axpo Volley Näfels H3|TSV Jona Volleyball H4|Glarus Nord
2026-12-05|17:00|VBC Pfäffikon H1|Axpo Volley Näfels H3|Pfäffikon SZ
2026-12-11|20:00|Axpo Volley Näfels H3|Volley Pizol H1|Näfels
2027-01-15|20:00|Axpo Volley Näfels H3|VBC March H1|Näfels
2027-02-05|20:15|TSV Jona Volleyball H3|Axpo Volley Näfels H3|Jona
2027-02-12|20:00|Axpo Volley Näfels H3|VBC Pfäffikon H1|Näfels
2027-02-19|20:00|Axpo Volley Näfels H3|VBC Chur H2|Näfels
2027-02-26|20:15|TSV Jona Volleyball H4|Axpo Volley Näfels H3|Jona
2027-02-27|14:00|Axpo Volley Näfels H3|VBC Chur H1|Glarus Nord
"""


# ── El gimnasio y su ubicacion, de la ficha de cada partido ──────────────
# La federacion publica el recinto con enlace a Google Maps en la ficha
# del partido, no en la lista. El codigo es un Plus Code, el mismo
# formato que ya usa el calendario del club.
SALAS = {'h1l': {'2026-10-03': ('Sporthalle Schönenwegen 1-2', '8FVFC88X+RW'), '2026-10-09': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2026-10-11': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2026-10-24': ('Sportanlage Schauenberg', '8FVCCG76+F5'), '2026-10-31': ('Turnhalle Remisberg 1-2', '8FVFJ5QM+8W'), '2026-11-08': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2026-11-14': ('Obererlen 1-2', '8FVF33W9+P2'), '2026-11-21': ('Doppelturnhalle Ebnet 1-3', '8FVFC7R8+6Q'), '2026-11-28': ('Grünfeld 3 (Ost)', '8FVC6RCV+RJ'), '2026-12-06': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2026-12-12': ('Kantonsschule 1-3 (A-C)', '8FVF23V8+F9'), '2026-12-20': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2027-01-08': ('Sporthalle Mühleholz 2', '8FVF5G44+79'), '2027-01-16': ('Zinzikon 1-2', '8FVCGQ93+C9'), '2027-01-23': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2027-01-31': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2027-02-06': ('Im Birch 1-3', '8FVCCG8R+G4'), '2027-02-13': ('Sporthalle BBZ Mühlental', '8FVCMJXJ+WF'), '2027-02-20': ('Linthhalle SGU 1-3', '8FVF4358+77'), '2027-02-28': ('Novalishalle, Lintharena SGU', '8FVF4348+93')},
           'h2l': {'2026-10-16': ('Sportanlage Sand 1', '8FRFRGWQ+6Q'), '2026-10-28': ('Sek1 March Siebnen 1-2', '8FVC5WJ2+JC'), '2026-11-03': ('Obererlen 1-2', '8FVF33W9+P2'), '2026-11-21': ('Sporthalle Badrieb 1', '8FVF2F7W+V3'), '2026-11-27': ('Sportanlage Sand 1', '8FRFRGWQ+6Q'), '2026-12-01': ('Obererlen 1-2', '8FVF33W9+P2'), '2026-12-05': ('Steg 1-2', '8FVC5QXP+PH'), '2026-12-11': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2027-01-15': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2027-02-05': ('Grünfeld 2 (Mitte)', '8FVC6RCV+RJ'), '2027-02-12': ('Novalishalle, Lintharena SGU', '8FVF4348+93'), '2027-02-19': ('Linthhalle SGU 1-3', '8FVF4358+77'), '2027-02-26': ('Grünfeld 1 (West)', '8FVC6RCV+RJ'), '2027-02-27': ('Obererlen 1-2', '8FVF33W9+P2')}}

MAPA = 'https://www.google.com/maps/search/?api=1&query='

def leer(bloque, cat):
    """Del texto de la federacion al formato del calendario."""
    salida = []
    for linea in bloque.strip().splitlines():
        linea = linea.strip()
        if not linea:
            continue
        fecha, hora, local, visita, lugar = linea.split('|')
        # Somos locales si nuestro nombre esta en la columna de local. Se
        # compara por el prefijo porque en 2L el equipo se llama "... H3".
        somos_local = local.startswith(NOSOTROS)
        sala, code = SALAS.get(cat, {}).get(fecha, ('', ''))
        if not sala:
            sala = lugar
        # "Novalishalle, Lintharena SGU, Näfels": el gimnasio y la ciudad
        completo = (sala + ', ' + lugar) if (sala and lugar and lugar not in sala) else (sala or lugar)
        salida.append({
            'fecha': fecha,
            'hora': hora,
            'rival': visita if somos_local else local,
            'condicion': 'Local' if somos_local else 'Visitante',
            'lugar': completo,
            'mapa': (MAPA + code.replace('+', '%2B')) if code else '',
        })
    return salida


def escribir(partidos, ruta, titulo):
    filas = ',\n'.join(
        "  {fecha:'%s',hora:'%s',rival:'%s',condicion:'%s',lugar:'%s',mapa:'%s'}" % (
            p['fecha'], p['hora'],
            p['rival'].replace("'", "\\'"),
            p['condicion'],
            p['lugar'].replace("'", "\\'"),
            p['mapa'])
        for p in partidos)

    txt = ('/* Fixture %s — temporada 2026/27\n'
           '   Tal como lo publica Swiss Volley en el Game Center de\n'
           '   Volley Näfels. %d partidos.\n'
           '   Lo carga el boton "Importar fixture" del calendario. */\n'
           'var FIXTURE=[\n%s\n];\n') % (titulo, len(partidos), filas)
    io.open(ruta, 'w', encoding='utf-8').write(txt)


def main():
    print()
    print('  ' + '=' * 62)
    print('     FIXTURES DE NÄFELS  ·  TEMPORADA 2026/27')
    print('  ' + '=' * 62)
    print()

    for bloque, cat, titulo in ((H1L, 'H1L', 'H1L · Axpo Volley Näfels (1. Liga)'),
                                (H2L, 'H2L', 'H2L · Axpo Volley Näfels H3 (2. Liga)')):
        p = leer(bloque, cat.lower())
        ruta = os.path.join(AQUI, 'fixture_%s.js' % cat.lower())
        escribir(p, ruta, titulo)

        loc = sum(1 for x in p if x['condicion'] == 'Local')
        print('  %s' % titulo)
        print('  ' + '-' * 60)
        print('     %d partidos  ·  %d de local  ·  %d de visitante'
              % (len(p), loc, len(p) - loc))
        print('     %d con gimnasio y mapa' % sum(1 for x in p if x['mapa']))
        print('     del %s al %s' % (p[0]['fecha'], p[-1]['fecha']))
        print('     -> fixture_%s.js' % cat.lower())
        print()

    print('  ' + '-' * 62)
    print('     COMO CARGARLOS')
    print()
    print('     1. Abri el calendario de la categoria en la app')
    print('     2. Aprieta "Importar fixture"')
    print('     3. Revisa y guarda')
    print()
    print('     Los partidos repetidos se saltean solos: si volves a')
    print('     importar, no se duplica nada.')
    print()
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    finally:
        try:
            input('  Enter para cerrar...')
        except Exception:
            pass
