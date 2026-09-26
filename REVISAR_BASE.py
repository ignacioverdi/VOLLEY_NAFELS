#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  REVISAR_BASE.py — EL FRENO DE MANO ANTES DE PUBLICAR
-------------------------------------------------------------------------------
  QUE HACE
    Compara la base que se acaba de generar con la ultima que se publico, y
    FRENA si perdio partidos.

  POR QUE
    El motor tiene una regla: si un partido que esta en la base no aparece en
    la carpeta de .dvw, rehace la base entera desde cero. Es correcto cuando
    se borro un partido a proposito. Pero si la carpeta quedo vacia o
    renombrada por un descuido, la base se rehace SIN NADA, se cifra vacia y
    se publica. La web queda en blanco y nadie se entera hasta que alguien la
    abre.

    Este chequeo es la ultima red: una base que encoge no se publica.

  COMO LO SABE
    Le pide a git la version anterior del archivo y cuenta los partidos de
    las dos. No necesita nada mas: ni internet, ni la llave, ni Firebase.

  QUE DEVUELVE
    0  -> todo bien (crecio, quedo igual, o es la primera vez)
    1  -> la base encogio: NO publicar

  SE PUEDE SALTEAR
    python REVISAR_BASE.py --igual-publico
    Solo si sabes por que encogio (borraste partidos a proposito).
===============================================================================
"""
import io
import json
import os
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = 'nla_players_db.json'


def _cuantos(txt):
    """Partidos que tiene una base, leida de su texto JSON."""
    try:
        d = json.loads(txt)
    except Exception:
        return None
    for clave in ('games_log', 'games', 'partidos'):
        v = d.get(clave)
        if isinstance(v, list):
            return len(v)
    return None


def _de_git(ruta):
    """El contenido de un archivo tal como quedo en el ultimo commit."""
    try:
        r = subprocess.run(['git', 'show', 'HEAD:' + ruta],
                           cwd=AQUI, capture_output=True)
        return r.stdout if r.returncode == 0 else None
    except Exception:
        return None


def _version_publicada():
    """La base que se publico la vez pasada.

    En el repo la base viaja CIFRADA (nla_players_db.json.enc): el .json en
    claro solo existe en la maquina, entre descifrar y cifrar. Asi que se
    busca primero la version en claro —por si algun dia deja de cifrarse— y
    si no esta, se descifra la del commit con la llave del club.

    Si falta la llave, no se puede comparar y el chequeo se saltea: es
    preferible no frenar que frenar por una razon equivocada."""
    crudo = _de_git(BASE)
    if crudo:
        return crudo.decode('utf-8', 'replace')

    enc = _de_git(BASE + '.enc')
    if not enc:
        return None
    try:
        import re
        import descifrar_datos
        llave = descifrar_datos.llave_guardada(AQUI)
        if not llave:
            return None
        m = re.search(r'\["([^"]+)"\]="(.*?)";', enc.decode('utf-8', 'replace'), re.S)
        if not m:
            return None
        return descifrar_datos.descifrar(m.group(2), llave, m.group(1))
    except Exception:
        return None


def main():
    saltear = '--igual-publico' in sys.argv

    ruta = os.path.join(AQUI, BASE)
    if not os.path.exists(ruta):
        # cifrada o inexistente: este chequeo no aplica
        print('  (no encontre %s sin cifrar: salteo el chequeo)' % BASE)
        return 0

    ahora = _cuantos(io.open(ruta, encoding='utf-8', errors='replace').read())
    if ahora is None:
        print('  (no pude contar los partidos de la base: salteo el chequeo)')
        return 0

    viejo_txt = _version_publicada()
    if viejo_txt is None:
        print('  Base: %d partido(s). No hay version anterior con que comparar.' % ahora)
        return 0

    antes = _cuantos(viejo_txt)
    if antes is None:
        print('  Base: %d partido(s). La version anterior no se pudo leer.' % ahora)
        return 0

    if ahora >= antes:
        print('  Base: %d partido(s) (antes habia %d). Todo bien.' % (ahora, antes))
        return 0

    print()
    print('  ' + '=' * 66)
    print('     LA BASE ENCOGIO: %d partido(s) contra %d de la vez pasada' % (ahora, antes))
    print('  ' + '=' * 66)
    print()
    print('     Se perdieron %d partido(s). Las causas mas comunes:' % (antes - ahora))
    print()
    print('       - la carpeta de .dvw esta vacia o se renombro')
    print('       - se movieron los .dvw a otra carpeta')
    print('       - se creo la carpeta de la temporada que viene, todavia vacia')
    print()
    print('     Los .dvw NO se tocaron: estan donde estaban.')
    print('     Revisa la carpeta de partidos y volve a correr HACER_TODO.')
    print()
    print('     Si los borraste a proposito y esta bien que encoja:')
    print('       python REVISAR_BASE.py --igual-publico')
    print()
    if saltear:
        print('     (--igual-publico: sigo igual, como pediste)')
        print()
        return 0
    return 1


if __name__ == '__main__':
    sys.exit(main())
