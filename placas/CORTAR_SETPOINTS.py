#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
  CORTAR_SETPOINTS.py — los nueve set points del 33-31, cortados del video
-------------------------------------------------------------------------------
  Va en la carpeta placas\\, al lado de clips.py.
  Se corre con doble clic en CORTAR_SETPOINTS.bat.

  QUE HACE
  Lee el .dvw de la final del 12/04/2026, saca SOLO las pelotas que fueron
  set point —el que estaba a un punto de ganar el set y lo que paso despues—
  y corta cada una del video del partido. Tambien corta el punto que cerro el
  partido, en el quinto.

  Deja los clips sueltos en  placas\\salida\\supercup\\setpoints\\, numerados y
  con el marcador en el nombre, para poder mirarlos y decidir cuales van.
  NO los pega: eso se hace despues, con los que elijas.

  DE DONDE SALE CADA SEGUNDO
  Del propio scout. Cada accion del .dvw trae el segundo del video, y cada
  punto trae el marcador. El rally va del SAQUE al PUNTO; antes y despues se
  agrega el margen de abajo. No hay un solo tiempo puesto a mano.

  SI ALGO FALTA
  Si no esta el video, o no esta ffmpeg, el script NO corta nada y te dice
  cual de las dos cosas falta. Igual escribe la lista en CORTES.txt, asi se
  puede cortar a mano desde la pantalla de Cortes de la app.
===============================================================================
"""
import io, os, pathlib, re, shutil, subprocess, sys

# ── lo que se toca ─────────────────────────────────────────────────────────
ANTES, DESPUES = 2.5, 3.5      # segundos antes del saque y despues del punto
ANTES_CORTO = 4.0              # los rallies de menos de 3 s arrancan antes
FONDO = '0x07080F'             # el negro de las placas, para las franjas
VERTICAL = True                # 1080x1920 con el video al medio
PARTIDO = '751238'             # el codigo del partido en el nombre del .dvw

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent if (AQUI.parent / 'DVW NAFELS 2026').is_dir() else AQUI
SALIDA = AQUI / 'salida' / 'supercup' / 'setpoints'


# ══ EL SCOUT ═══════════════════════════════════════════════════════════════
def buscar_dvw():
    for carpeta in (RAIZ / 'DVW NAFELS 2026', RAIZ / 'DVW NAFELS 2027', RAIZ):
        if not carpeta.is_dir():
            continue
        for f in carpeta.glob('*.dvw'):
            if PARTIDO in f.name:
                return f
    return None


def leer(p):
    d = io.open(p, encoding='latin-1').read().replace('\r', '')
    sec, cur = {}, None
    for l in d.split('\n'):
        if l.startswith('['):
            cur = l.strip(); sec[cur] = []
        elif cur is not None:
            sec[cur].append(l)
    return sec


def buscar_video(sec, dvw):
    """Primero lo que dice el scout; si la carpeta se renombro, se busca el
       mp4 por el codigo del partido en los discos donde suelen estar."""
    for l in sec.get('[3VIDEO]', []):
        if '=' in l:
            p = pathlib.Path(l.split('=', 1)[1].strip())
            if p.exists():
                return p
    for base in (pathlib.Path('D:/NLA VIDEOS'), pathlib.Path('E:/NLA VIDEOS'),
                 dvw.parent, RAIZ):
        if not base.is_dir():
            continue
        for p in base.rglob('*' + PARTIDO + '*.mp4'):
            return p
    return None


def rallies(sec):
    """Los set points del set 4 y el punto que cerro el partido.

       Set point = antes de jugarse la pelota, uno de los dos esta a UN punto
       de ganar el set: 24 o mas Y arriba en el marcador. A 24-24 no esta
       ninguno, por eso se pide la diferencia."""
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
            ev.append({'k': 'a', 'sk': c[3], 's': st, 't': t})

    def saque(i):
        for j in range(i - 1, -1, -1):
            if ev[j]['k'] == 'a' and ev[j]['sk'] == 'S':
                return ev[j]['t']
            if ev[j]['k'] == 'p':
                break
        return None

    out, prev = [], (0, 0)
    for i, e in enumerate(ev):
        if e['k'] != 'p' or e['s'] != 4:
            continue
        L, V = prev
        de = None
        if L >= 24 and L - V >= 1: de = 'NAFELS'
        elif V >= 24 and V - L >= 1: de = 'AMRISWIL'
        if de:
            s = saque(i)
            if s is not None:
                gana = 'NAFELS' if e['q'] == '*' else 'AMRISWIL'
                out.append({'ini': s, 'fin': e['t'], 'antes': '%d-%d' % (L, V),
                            'despues': '%d-%d' % (e['L'], e['V']),
                            'de': de, 'gana': gana,
                            'que': 'convierte' if de == gana else 'lo salva ' + gana})
            prev = (e['L'], e['V'])
            continue
        prev = (e['L'], e['V'])

    ult = [i for i, e in enumerate(ev) if e['k'] == 'p' and e['s'] == 5]
    if ult:
        i = ult[-1]; e = ev[i]; s = saque(i)
        if s is not None:
            out.append({'ini': s, 'fin': e['t'], 'antes': 'set 5',
                        'despues': '%d-%d' % (e['L'], e['V']),
                        'de': 'PARTIDO', 'gana': 'AMRISWIL',
                        'que': 'el punto del partido'})
    return out


# ══ EL CORTE ═══════════════════════════════════════════════════════════════
def nombre(i, r):
    def limpio(s):
        return re.sub(r'[^A-Za-z0-9-]', '', s.replace(' ', '-'))
    if r['de'] == 'PARTIDO':
        return '%02d_FINAL_%s.mp4' % (i, limpio(r['despues']))
    return '%02d_%s_SP-%s_%s.mp4' % (i, limpio(r['antes']), limpio(r['de']),
                                     limpio(r['que']))


def cortar(video, lista):
    SALIDA.mkdir(parents=True, exist_ok=True)
    vf = ('scale=1080:-2,pad=1080:1920:0:(oh-ih)/2:%s' % FONDO) if VERTICAL else 'scale=1080:-2'
    hechos = []
    for i, r in enumerate(lista, 1):
        largo = r['fin'] - r['ini']
        antes = ANTES_CORTO if largo < 3 else ANTES
        ini = max(0, r['ini'] - antes)
        dur = largo + antes + DESPUES
        dst = SALIDA / nombre(i, r)
        cmd = ['ffmpeg', '-y', '-loglevel', 'error',
               '-ss', '%.2f' % ini, '-i', str(video), '-t', '%.2f' % dur,
               '-vf', vf, '-r', '30',
               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21',
               '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2',
               str(dst)]
        print('  %-44s %4.1f s' % (dst.name, dur))
        try:
            subprocess.run(cmd, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print('     no se pudo cortar:', e)
            continue
        if dst.exists() and dst.stat().st_size > 0:
            hechos.append((dst, dur))
    return hechos


def main():
    dvw = buscar_dvw()
    if not dvw:
        print('No encuentro el .dvw del partido %s.' % PARTIDO)
        return 1
    print('Scout :', dvw.name)
    sec = leer(dvw)
    lista = rallies(sec)
    print('Pelotas de set point encontradas:', len(lista))

    SALIDA.mkdir(parents=True, exist_ok=True)
    txt = ['LOS SET POINTS DEL CUARTO SET (33-31) + EL PUNTO DEL PARTIDO',
           'Partido %s - %s' % (PARTIDO, dvw.name), '']
    for i, r in enumerate(lista, 1):
        largo = r['fin'] - r['ini']
        txt.append('%02d  %-8s  set point de %-9s  %-18s  video %d:%02d -> %d:%02d  (%ds)'
                   % (i, r['antes'], r['de'], r['que'],
                      r['ini'] // 60, r['ini'] % 60, r['fin'] // 60, r['fin'] % 60, largo))
    (SALIDA / 'CORTES.txt').write_text('\n'.join(txt) + '\n', encoding='utf-8')
    print('Lista escrita en', SALIDA / 'CORTES.txt')

    video = buscar_video(sec, dvw)
    if not video:
        print()
        print('No encuentro el video del partido. Enchufa el disco y volve a correrlo.')
        print('(La lista ya quedo escrita, se puede cortar a mano desde la app.)')
        return 2
    print('Video :', video)
    if not shutil.which('ffmpeg'):
        print()
        print('No tengo ffmpeg, asi que no puedo cortar solo.')
        print('Instalalo de ffmpeg.org y volve a correr: la lista ya esta.')
        return 3

    print()
    hechos = cortar(video, lista)
    total = sum(d for _, d in hechos)
    print()
    print('Listo: %d clips, %d:%02d en total.' % (len(hechos), int(total) // 60, int(total) % 60))
    print('Estan en', SALIDA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
