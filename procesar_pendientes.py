#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  procesar_pendientes.py — EL PUENTE ENTRE LA APP Y EL PROCESAMIENTO
-------------------------------------------------------------------------------
  El entrenador arrastra su .dvw en la app y no hace nada más. El archivo queda
  esperando en la base. Este script —que corre en la nube, no en su PC— lo
  levanta, lo procesa y publica el resultado.

  El cliente nunca abre un .bat, nunca instala Python, nunca ve GitHub.

  QUÉ HACE, EN ORDEN
    1. entra a la base con la cuenta del robot
    2. busca partidos en espera
    3. los guarda como .dvw en la carpeta del año
    4. corre procesar.py (el mismo Python de siempre)
    5. avisa a la app que ya está, para que el entrenador lo vea

  El commit y la publicación los hace el flujo de trabajo que lo invoca.

  VARIABLES QUE NECESITA  (como secretos del repositorio)
    FB_URL        la dirección de la base
    FB_KEY        la clave pública del proyecto
    ROBOT_MAIL    cuenta del robot (usuario normal, con permiso de escritura)
    ROBOT_CLAVE   su contraseña
    CLUB_ID       (opcional) si la base guarda varios clubes
===============================================================================
"""
import os, sys, json, time, base64, subprocess, urllib.request, urllib.error

AQUI = os.path.dirname(os.path.abspath(__file__))

FB_URL      = (os.environ.get('FB_URL')     or '').rstrip('/')
FB_KEY      =  os.environ.get('FB_KEY')     or ''
ROBOT_MAIL  =  os.environ.get('ROBOT_MAIL') or ''
ROBOT_CLAVE =  os.environ.get('ROBOT_CLAVE') or ''
CLUB_ID     = (os.environ.get('CLUB_ID')    or '').strip()

RAIZ = ('clubes/%s/' % CLUB_ID) if CLUB_ID else ''
MAX  = 10          # cuántos partidos se procesan por corrida


def llamar(url, datos=None, metodo='GET'):
    cuerpo = json.dumps(datos).encode('utf-8') if datos is not None else None
    pedido = urllib.request.Request(url, data=cuerpo, method=metodo,
                                    headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(pedido, timeout=60) as r:
            t = r.read().decode('utf-8')
            return json.loads(t) if t and t != 'null' else None
    except urllib.error.HTTPError as e:
        print('   [http %s] %s' % (e.code, e.read().decode('utf-8', 'replace')[:200]))
        return {'_error': True}
    except Exception as e:
        print('   [error] %s' % e)
        return {'_error': True}


def entrar():
    """La cuenta del robot es un usuario común de la app: no hace falta ninguna
       llave maestra, y si algún día se compromete se le corta el acceso como
       a cualquier otro."""
    r = llamar('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FB_KEY,
               {'email': ROBOT_MAIL, 'password': ROBOT_CLAVE, 'returnSecureToken': True},
               'POST')
    if not r or '_error' in r or not r.get('idToken'):
        return None
    return r['idToken']


def leer(ruta, tok):
    return llamar('%s/%s%s.json?auth=%s' % (FB_URL, RAIZ, ruta, tok))


def escribir(ruta, valor, tok):
    return llamar('%s/%s%s.json?auth=%s' % (FB_URL, RAIZ, ruta, tok), valor, 'PUT')


def borrar(ruta, tok):
    return llamar('%s/%s%s.json?auth=%s' % (FB_URL, RAIZ, ruta, tok), None, 'DELETE')


def carpeta_del_anio():
    """La misma que usa procesar.py: la del año más alto."""
    import glob, re
    c = [d for d in glob.glob(os.path.join(AQUI, 'DVW*')) if os.path.isdir(d)]
    if not c:
        return None
    return sorted(c, key=lambda d: (re.findall(r'(\d{4})', d) or ['0'])[-1])[-1]


def main():
    if not (FB_URL and FB_KEY and ROBOT_MAIL and ROBOT_CLAVE):
        print('  Faltan los datos de acceso a la base. Nada que hacer.')
        return 0                      # no es un error: el robot simplemente no está configurado

    tok = entrar()
    if not tok:
        print('  No pude entrar a la base con la cuenta del robot.')
        return 1

    pend = leer('pendientes', tok)
    if not pend or '_error' in (pend if isinstance(pend, dict) else {}):
        print('  No hay partidos esperando.')
        return 0

    ids = [k for k in pend.keys()
           if isinstance(pend[k], dict) and pend[k].get('estado') in (None, 'pendiente')]
    if not ids:
        print('  No hay partidos esperando.')
        return 0

    ids.sort(key=lambda k: pend[k].get('subido', 0))
    ids = ids[:MAX]
    destino = carpeta_del_anio()
    if not destino:
        print('  No encuentro la carpeta de partidos.')
        return 1

    print('  %d partido(s) en espera' % len(ids))
    guardados = []
    for k in ids:
        p = pend[k]
        nombre = (p.get('nombre') or (k + '.dvw')).replace('/', '_').replace('\\', '_')
        if not nombre.lower().endswith('.dvw'):
            nombre += '.dvw'
        try:
            crudo = base64.b64decode(p.get('datos') or '')
            if not crudo:
                raise ValueError('archivo vacío')
            with open(os.path.join(destino, nombre), 'wb') as f:
                f.write(crudo)
            guardados.append((k, nombre))
            escribir('pendientes/%s/estado' % k, 'procesando', tok)
            print('     guardado: %-44s %6.0f KB' % (nombre[:44], len(crudo)/1024))
        except Exception as e:
            escribir('pendientes/%s/estado' % k, 'error', tok)
            escribir('pendientes/%s/detalle' % k, 'no pude leer el archivo', tok)
            print('     [error] %s: %s' % (nombre, e))

    if not guardados:
        return 0

    print()
    print('  Procesando...')
    # Si el club tiene carpeta de entrenamientos, se procesan también: para el
    # entrenador es lo mismo, sube un archivo y espera.
    import glob as _g
    cmd = [sys.executable, os.path.join(AQUI, 'procesar.py'), '--json']
    if [d for d in _g.glob(os.path.join(AQUI, '*'))
        if os.path.isdir(d) and 'ENTREN' in os.path.basename(d).upper()]:
        cmd.append('--entrenamientos')
    r = subprocess.run(cmd,
                       cwd=AQUI, capture_output=True, text=True, timeout=3000)
    salida = (r.stdout or '').strip().splitlines()
    resumen = {}
    for l in reversed(salida):
        if l.startswith('{'):
            try: resumen = json.loads(l); break
            except Exception: pass
    print(r.stdout[-1800:] if r.stdout else '')
    ok = (r.returncode == 0) and resumen.get('ok', r.returncode == 0)

    for k, nombre in guardados:
        if ok:
            escribir('pendientes/%s/estado'  % k, 'listo', tok)
            escribir('pendientes/%s/terminado' % k, int(time.time()*1000), tok)
        else:
            escribir('pendientes/%s/estado'  % k, 'error', tok)
            escribir('pendientes/%s/detalle' % k,
                     'el procesamiento falló, avisale al soporte', tok)

    print()
    print('  %s · %d partido(s) · %s s' % ('LISTO' if ok else 'CON ERRORES',
                                           len(guardados), resumen.get('segundos', '?')))
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
