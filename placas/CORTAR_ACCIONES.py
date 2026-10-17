#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  CORTAR_ACCIONES.py — buscar y cortar lo que quieras de un partido
-------------------------------------------------------------------------------
  Va en la carpeta placas\\, al lado de CORTAR_SETPOINTS.py.
  Doble clic en CORTAR_ACCIONES.bat.

  PARA QUE
  CORTAR_SETPOINTS saca una cosa sola: los set points del 33-31. Este saca
  CUALQUIER cosa del partido que elijas de una lista: los rallies mas largos,
  los aces, los bloqueos, los ataques de un jugador, los puntos de un set.

  COMO ANDA
  Pregunta tres cosas —que partido, que buscar, cuantos— y corta. Los segundos
  salen del scout, igual que en el otro: cada accion del .dvw trae el segundo
  del video y cada punto trae el marcador. Nada escrito a mano.

  LOS CLIPS
  Quedan en  placas\\salida\\supercup\\acciones\\, uno por archivo, numerados y
  con el nombre diciendo que son, en 1080x1920 listos para pegar. No se pegan
  solos: primero se miran y se elige.
===============================================================================
"""
import io, pathlib, re, shutil, subprocess, sys, unicodedata

ANTES_RALLY, DESPUES_RALLY = 2.5, 3.5    # margen cuando se corta un punto entero
ANTES_ACC,   DESPUES_ACC   = 3.5, 3.0    # margen cuando se corta UNA accion
FONDO = '0x07080F'
VERTICAL = True
TOPE = 40                                 # nunca mas de esto, para no llenar el disco

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent if (AQUI.parent / 'DVW NAFELS 2026').is_dir() else AQUI
SALIDA = AQUI / 'salida' / 'supercup' / 'acciones'

SKILL = {'S': 'saque', 'R': 'recepcion', 'A': 'ataque', 'B': 'bloqueo',
         'D': 'defensa', 'E': 'armado', 'F': 'freeball'}


# ══ LEER EL SCOUT ══════════════════════════════════════════════════════════
def leer(p):
    d = io.open(p, encoding='latin-1').read().replace('\r', '')
    sec, cur = {}, None
    for l in d.split('\n'):
        if l.startswith('['):
            cur = l.strip(); sec[cur] = []
        elif cur is not None:
            sec[cur].append(l)
    return sec


def utf(x):
    try: return x.encode('latin-1').decode('utf-8')
    except Exception: return x


def equipos(sec):
    out = []
    for l in sec.get('[3TEAMS]', []):
        if l.strip():
            f = l.split(';')
            out.append(utf(f[1]).replace(' (NLA Men)', '').strip())
        if len(out) == 2:
            break
    return out or ['LOCAL', 'VISITA']


def plantel(sec):
    ros = {'*': {}, 'a': {}}
    for lado, k in (('*', '[3PLAYERS-H]'), ('a', '[3PLAYERS-V]')):
        for l in sec.get(k, []):
            f = l.split(';')
            if len(f) > 10 and f[1].strip().isdigit():
                ape, nom = utf(f[9]).strip(), utf(f[10]).strip()
                ros[lado][int(f[1])] = ((nom[:1] + '. ') if nom else '') + ape
    return ros


def eventos(sec):
    ev = []
    for l in sec.get('[3SCOUT]', []):
        if not l.strip():
            continue
        f = l.split(';'); c = f[0]
        if len(f) < 13 or not f[8].strip().isdigit():
            continue
        t = int(f[12]) if f[12].strip().isdigit() else 0
        st = int(f[8])
        m = re.match(r'^([*a])p(\d{2}):(\d{2})$', c)
        if m:
            ev.append({'k': 'p', 'q': m.group(1), 'L': int(m.group(2)),
                       'V': int(m.group(3)), 's': st, 't': t})
        elif len(c) >= 6 and c[1:3].isdigit():
            ev.append({'k': 'a', 'lado': c[0], 'num': int(c[1:3]), 'sk': c[3],
                       'ev': c[5], 's': st, 't': t})
    return ev


def saque_previo(ev, i):
    for j in range(i - 1, -1, -1):
        if ev[j]['k'] == 'a' and ev[j]['sk'] == 'S':
            return ev[j]['t']
        if ev[j]['k'] == 'p':
            break
    return None


# ══ LAS BUSQUEDAS ══════════════════════════════════════════════════════════
def rallies_largos(ev, eq, ros, cuantos):
    out = []
    for i, e in enumerate(ev):
        if e['k'] != 'p':
            continue
        s = saque_previo(ev, i)
        if s is None:
            continue
        dur = e['t'] - s
        if not (3 <= dur <= 90):
            continue
        out.append({'ini': s, 'fin': e['t'], 'dur': dur, 's': e['s'],
                    'tit': 'set%d_%d-%d_%ds' % (e['s'], e['L'], e['V'], dur)})
    out.sort(key=lambda x: -x['dur'])
    return out[:cuantos]


def por_accion(ev, eq, ros, sk, evs, lado=None, num=None, cuantos=99):
    out = []
    for e in ev:
        if e['k'] != 'a' or e['sk'] != sk or e['ev'] not in evs:
            continue
        if lado and e['lado'] != lado:
            continue
        if num and e['num'] != num:
            continue
        club = eq[0] if e['lado'] == '*' else eq[1]
        quien = ros[e['lado']].get(e['num'], '#%d' % e['num'])
        out.append({'ini': e['t'], 'fin': e['t'], 'dur': 0, 's': e['s'],
                    'tit': 'set%d_%s_%s_%s' % (e['s'], SKILL.get(sk, sk),
                                               club.split()[-1], quien)})
        if len(out) >= cuantos:
            break
    return out


def puntos_del_set(ev, eq, ros, nset, cuantos):
    out = []
    for i, e in enumerate(ev):
        if e['k'] != 'p' or e['s'] != nset:
            continue
        s = saque_previo(ev, i)
        if s is None:
            continue
        out.append({'ini': s, 'fin': e['t'], 'dur': e['t'] - s, 's': nset,
                    'tit': 'set%d_%d-%d' % (nset, e['L'], e['V'])})
        if len(out) >= cuantos:
            break
    return out


# ══ CORTAR ═════════════════════════════════════════════════════════════════
def buscar_dvw(codigo):
    for carpeta in (RAIZ / 'DVW NAFELS 2027', RAIZ / 'DVW NAFELS 2026', RAIZ):
        if not carpeta.is_dir():
            continue
        for f in sorted(carpeta.glob('*.dvw')):
            if codigo.lower() in f.name.lower():
                return f
    return None


def buscar_video(sec, dvw, codigo):
    for l in sec.get('[3VIDEO]', []):
        if '=' in l:
            p = pathlib.Path(l.split('=', 1)[1].strip())
            if p.exists():
                return p
    for base in (pathlib.Path('D:/NLA VIDEOS'), pathlib.Path('E:/NLA VIDEOS'),
                 dvw.parent, RAIZ):
        if not base.is_dir():
            continue
        for p in base.rglob('*' + codigo + '*.mp4'):
            return p
    return None


def limpio(s):
    """'Näfels' -> 'Nafels'. Sin esto la dieresis se perdia y el archivo
       quedaba 'Nfels', que no se entiende de quien es."""
    s = unicodedata.normalize('NFKD', str(s).replace(' ', '-'))
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^A-Za-z0-9._-]', '', s)


def cortar(video, lista, etiqueta):
    SALIDA.mkdir(parents=True, exist_ok=True)
    vf = ('scale=1080:-2,pad=1080:1920:0:(oh-ih)/2:%s' % FONDO) if VERTICAL else 'scale=1080:-2'
    total = 0
    for i, r in enumerate(lista, 1):
        if r['dur'] > 0:
            antes, despues = ANTES_RALLY, DESPUES_RALLY
            largo = r['dur']
        else:
            antes, despues = ANTES_ACC, DESPUES_ACC
            largo = 0
        ini = max(0, r['ini'] - antes)
        dur = largo + antes + despues
        dst = SALIDA / ('%s_%02d_%s.mp4' % (limpio(etiqueta), i, limpio(r['tit'])))
        cmd = ['ffmpeg', '-y', '-loglevel', 'error',
               '-ss', '%.2f' % ini, '-i', str(video), '-t', '%.2f' % dur,
               '-vf', vf, '-r', '30',
               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21',
               '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2',
               str(dst)]
        print('  %-52s %4.1f s' % (dst.name, dur))
        try:
            subprocess.run(cmd, check=True)
            total += dur
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print('     no se pudo cortar:', e)
    return total


def preguntar(txt, por_defecto=''):
    try:
        r = input(txt).strip()
    except EOFError:
        r = ''
    return r or por_defecto


def main():
    print()
    codigo = preguntar('Codigo o parte del nombre del partido [751238]: ', '751238')
    dvw = buscar_dvw(codigo)
    if not dvw:
        print('No encuentro ningun .dvw con "%s".' % codigo); return 1
    print('Scout :', dvw.name)
    sec = leer(dvw); eq = equipos(sec); ros = plantel(sec); ev = eventos(sec)
    print('Partido: %s  vs  %s' % (eq[0], eq[1]))
    print()
    print('  1  Los rallies mas largos')
    print('  2  Los aces')
    print('  3  Los bloqueos punto')
    print('  4  Los ataques punto de un jugador')
    print('  5  Todos los puntos de un set')
    op = preguntar('\nQue busco? [1]: ', '1')

    if op == '2':
        lista = por_accion(ev, eq, ros, 'S', ['#']); etq = 'aces'
    elif op == '3':
        lista = por_accion(ev, eq, ros, 'B', ['#']); etq = 'bloqueos'
    elif op == '4':
        print()
        for lado, nom in (('*', eq[0]), ('a', eq[1])):
            print(' ', nom)
            print('   ', ', '.join('%d %s' % (n, ros[lado][n]) for n in sorted(ros[lado])))
        lado = '*' if preguntar('\nQue equipo, 1=%s  2=%s [1]: ' % (eq[0], eq[1]), '1') != '2' else 'a'
        try:
            num = int(preguntar('Dorsal: ', '0'))
        except ValueError:
            num = 0
        if not num:
            print('Sin dorsal no puedo buscar.'); return 1
        lista = por_accion(ev, eq, ros, 'A', ['#'], lado, num)
        etq = 'ataques_%d' % num
    elif op == '5':
        try:
            n = int(preguntar('Que set, 1 a 5 [4]: ', '4'))
        except ValueError:
            n = 4
        lista = puntos_del_set(ev, eq, ros, n, TOPE); etq = 'set%d' % n
    else:
        lista = rallies_largos(ev, eq, ros, TOPE); etq = 'rallies'

    if not lista:
        print('No encontre nada con eso.'); return 1
    print('\nEncontre %d.' % len(lista))
    try:
        cuantos = int(preguntar('Cuantos corto? [%d]: ' % min(10, len(lista)),
                                str(min(10, len(lista)))))
    except ValueError:
        cuantos = min(10, len(lista))
    lista = lista[:max(1, min(cuantos, TOPE))]

    video = buscar_video(sec, dvw, codigo)
    if not video:
        print('\nNo encuentro el video del partido. Enchufa el disco y volve a correrlo.')
        return 2
    if not shutil.which('ffmpeg'):
        print('\nNo tengo ffmpeg, asi que no puedo cortar solo. Instalalo de ffmpeg.org.')
        return 3
    print('Video :', video)
    print()
    total = cortar(video, lista, etq)
    print()
    print('Listo: %d clips, %d:%02d en total.' % (len(lista), int(total) // 60, int(total) % 60))
    print('Estan en', SALIDA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
