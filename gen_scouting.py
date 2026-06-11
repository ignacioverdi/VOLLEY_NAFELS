#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_scouting.py — Genera scouting_rival.js (dossier de TODOS los rivales de la liga)
desde los .dvw acumulados. Reusa el parser del motor grande (update_db_nafels_FULL.py),
asi el scouting siempre queda consistente y se actualiza con cada fecha nueva.

USO:
  python gen_scouting.py --dvw_dir "DVW NAFELS 2026"
  (si no se pasa --dvw_dir, busca .dvw en la carpeta actual)

Salida: scouting_rival.js  (window.SCOUTING_RIVAL = {...})
"""
import sys, os, re, json, glob, argparse
from collections import defaultdict, Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import update_db_nafels_FULL as eng

MIN_MATCHES = 5            # equipos con menos partidos no se muestran
MIN_ATK_PLAYER = 15        # ataques minimos para listar a un rematador
MIN_REC_PLAYER = 15        # recepciones minimas para listar a un receptor
POS_ES = {'OH':'Punta','OPP':'Opuesto','MB':'Central','S':'Armador','L':'Líbero','?':'—'}
GZONE = {'1':'Z1','2':'Z1','9':'Z1','6':'Z6','3':'Z6','8':'Z6','5':'Z5','4':'Z5','7':'Z5'}

def ipct(n, d): return round(n/d*100) if d else 0
def rint(x):    return round(x) if x is not None else 0
def hit(acts):
    """Rendimiento de ataque (kills - errores)/total — para SO/TR."""
    if not acts: return 0
    k = sum(1 for a in acts if a['effect']=='#')
    e = sum(1 for a in acts if a['effect']=='=')
    return round((k-e)/len(acts)*100)

def display_name(raw):
    """Quita el sufijo de liga: 'Volley Amriswil (NLA Men)' -> 'Volley Amriswil'."""
    return re.sub(r'\s*\([^)]*\)\s*$', '', raw).strip()

def top_zones(actions, key, n=4):
    c = Counter(a[key] for a in actions if a.get(key))
    tot = sum(c.values()) or 1
    return [{'k':str(z),'n':cnt,'pct':ipct(cnt,tot)} for z,cnt in c.most_common(n)]

def walk_attacks(content, pfx):
    """Lista de ataques del equipo (en orden), cada uno con 'so' (side-out real):
    side-out = primer ataque tras NUESTRA recepcion, sin que el rival intervenga
    (A/D/E/B) en el medio. Igual definicion que el motor de baterias."""
    content = content.replace('\r\n','\n')
    idx = content.find('[3SCOUT]\n')
    if idx < 0: return []
    scout = content[idx+9:content.find('\n[3', idx+9)].strip().split('\n')
    out = []; rec_valida = False; last_rq = ''; last_orig = ''; last_by = 0
    for line in scout:
        l = line.strip()
        if len(l) < 6: continue
        t = l[0]; code = l[1:]
        try: pnum = int(code[:2])
        except: continue
        skill = code[2].upper() if len(code) > 2 else ''
        if skill == 'S':
            rec_valida = False; last_rq = ''; last_orig = ''; last_by = 0; continue
        if t == pfx and skill == 'R':
            rec_valida = True
            last_rq = code[4] if len(code) > 4 else ''
            rrest = code[5:] if len(code) > 5 else ''
            rtp = rrest.split('~')
            rtraj = rtp[3] if len(rtp) > 3 else ''
            last_orig = rtraj[0] if rtraj and rtraj[0].isdigit() else ''
            last_by = pnum
            continue
        if t != pfx and skill in ('A','D','E','B'):
            rec_valida = False; continue
        if t != pfx: continue
        if skill != 'A': continue
        effect = code[4] if len(code) > 4 else ''
        rest = code[5:] if len(code) > 5 else ''
        tp = rest.split('~')
        combo = tp[0] if tp else ''; traj = tp[1] if len(tp) > 1 else ''
        orig = int(traj[0]) if traj and traj[0].isdigit() else 0
        dest = int(traj[1]) if traj and len(traj) > 1 and traj[1].isdigit() else 0
        sc = l.split(';')
        try:
            sp_h = int(sc[9].strip()) if len(sc) > 9 and sc[9].strip().isdigit() else 0
            sp_v = int(sc[10].strip()) if len(sc) > 10 and sc[10].strip().isdigit() else 0
            spos = sp_h if pfx=='*' else sp_v
        except: spos = 0
        so = rec_valida
        rq = last_rq if rec_valida else ''
        rfrom = GZONE.get(last_orig, '') if rec_valida else ''
        rby = last_by if rec_valida else 0
        rec_valida = False
        out.append({'_pnum':pnum,'effect':effect,'combo':eng.normalize_combo(combo),
                    'orig':orig,'dest':dest,'setter_pos':spos,'so':so,'rq':rq,
                    'rec_from':rfrom,'rec_by':rby})
    return out

# ── acumular acciones por NOMBRE DE EQUIPO tal cual aparece en el dvw ──
def collect():
    teams = defaultdict(lambda: {'atk':[], 'srv':[], 'rec':[], 'sets':[],
                                 'players':{}, 'files':set(), 'matchinfo':[]})
    files = sorted(glob.glob(os.path.join(DVW_DIR, '*.dvw')))
    for fp in files:
        with open(fp, encoding='utf-8', errors='ignore') as f:
            content = f.read()
        lines = content.replace('\r\n','\n').split('\n')
        rh, ra = eng.get_teams(lines)
        dh, da = display_name(rh), display_name(ra)
        try:
            result, date, nh, na = eng.parse_dvw_both(fp, '2026')
        except Exception as e:
            print('  ERROR %s: %s' % (os.path.basename(fp), e)); continue
        # mapear nombre normalizado -> nombre display de este archivo
        norm2disp = {eng.norm(rh): dh, eng.norm(ra): da}
        for nteam, data in result.items():
            disp = norm2disp.get(nteam, nteam)
            T = teams[disp]
            T['files'].add(os.path.basename(fp))
            for num, p in data['players'].items():
                T['players'][num] = p
            for sk in ('srv','rec','sets'):
                src = data['srv'] if sk=='srv' else data['rec'] if sk=='rec' else data['sets']
                for num, acts in src.items():
                    for a in acts:
                        a['_pnum'] = num
                    T[sk].extend(acts)
            pfx = '*' if eng.norm(rh)==nteam else 'a'
            # ataque: walker propio con side-out preciso
            T['atk'].extend(walk_attacks(content, pfx))
            T['matchinfo'].append({'fp':fp, 'pfx':pfx, 'home': pfx=='*'})
    return teams

# ── rotaciones: pasa por los dvw del equipo, lee el lineup y arma front-row ──
def rotations_for(team, apellido_of):
    """Devuelve {r: [apellido_z4, apellido_z3, apellido_z2]} (front row mas comun por rotacion)."""
    front_counter = {r: Counter() for r in range(1,7)}
    for mi in team['matchinfo']:
        with open(mi['fp'], encoding='utf-8', errors='ignore') as f:
            content = f.read().replace('\r\n','\n')
        i = content.find('[3SCOUT]\n')
        if i < 0: continue
        scout = content[i+9:content.find('\n[3', i+9)].strip().split('\n')
        pfx = mi['pfx']; home = mi['home']
        for line in scout:
            l = line.strip()
            sc = l.split(';')
            if len(sc) < 26: continue
            if not l or l[0] != pfx: continue
            # zona del setter = setter_pos (campo 9 home / 10 visita)
            try:
                sp = int(sc[9].strip()) if home else int(sc[10].strip())
            except: continue
            if sp < 1 or sp > 6: continue
            lineup = sc[14:20] if home else sc[20:26]   # jersey en zona (idx+1)
            if len(lineup) < 6: continue
            # front row = zonas 4,3,2 = indices 3,2,1
            front = (lineup[3], lineup[2], lineup[1])
            front_counter[sp][front] += 1
    out = {}
    for r in range(1,7):
        if not front_counter[r]: out[r] = []; continue
        best = front_counter[r].most_common(1)[0][0]
        out[r] = [apellido_of(j) for j in best]
    return out

def build_team(disp, team):
    atk, srv, rec, sets = team['atk'], team['srv'], team['rec'], team['sets']
    nfiles = len(team['files'])
    def apellido_of(jersey):
        try: p = team['players'].get(int(jersey))
        except: p = None
        return (p['apellido'] if p else str(jersey)) or str(jersey)

    # ── SAQUE ──
    s_tot = len(srv)
    s_ace = sum(1 for a in srv if a['effect']=='#')
    s_err = sum(1 for a in srv if a['effect']=='=')
    serve = {'tot':s_tot,'ace':s_ace,'acepct':ipct(s_ace,s_tot),'errpct':ipct(s_err,s_tot),
             'eff':ipct(s_ace,s_tot)-ipct(s_err,s_tot),'zones':top_zones(srv,'dest',4)}

    # ── ATAQUE (equipo + por rematador) ──
    a_tot = len(atk)
    a_kill= sum(1 for a in atk if a['effect']=='#')
    a_err = sum(1 for a in atk if a['effect']=='=')
    a_blk = sum(1 for a in atk if a['effect']=='/')
    players = []
    by_pl = defaultdict(list)
    for a in atk: by_pl[a['_pnum']].append(a)
    for num, acts in by_pl.items():
        if len(acts) < MIN_ATK_PLAYER: continue
        pos = eng.infer_pos(acts)
        if pos == '?':
            dp = (team['players'].get(num) or {}).get('pos','?')
            pos = dp if dp in POS_ES else '?'
        so = [a for a in acts if a.get('so')]
        tr = [a for a in acts if not a.get('so')]
        combos = top_zones(acts, 'combo', 3)
        ozs = top_zones(acts, 'orig', 3)
        origen = ', '.join('Z%s %d%%' % (z['k'], z['pct']) for z in ozs[:2])
        players.append({
            'name': apellido_of(num), 'pos': POS_ES.get(pos, pos),
            'tot': len(acts), 'eff': rint(eng.eff_atk(acts)),
            'killpct': ipct(sum(1 for a in acts if a['effect']=='#'), len(acts)),
            'combos': combos, 'origen': origen,
            'so_eff': hit(so), 'so_n': len(so),
            'tr_eff': hit(tr), 'tr_n': len(tr),
        })
    players.sort(key=lambda x:-x['tot'])
    attack = {'tot':a_tot,'kill':a_kill,'killpct':ipct(a_kill,a_tot),'eff':rint(eng.eff_atk(atk)),
              'errpct':ipct(a_err,a_tot),'blkpct':ipct(a_blk,a_tot),'players':players}

    # ── ARMADO ──
    set_tot = len(sets)
    by_set = Counter(a['_pnum'] for a in sets)
    main = {'name':'—','tot':0,'pct':0}
    if by_set:
        mnum, mcnt = by_set.most_common(1)[0]
        main = {'name':apellido_of(mnum),'tot':mcnt,'pct':ipct(mcnt,set_tot)}
    calls = top_zones(sets, 'combo', 6)
    set_zones = top_zones(sets, 'dest', 4)
    setd = {'tot':set_tot,'main':main,'calls':calls,'zones':set_zones}

    # ── RECEPCION ──
    r_tot = len(rec)
    r_pos = sum(1 for a in rec if a['effect'] in ('#','+'))
    r_err = sum(1 for a in rec if a['effect']=='=')
    weak = []
    by_rec = defaultdict(list)
    for a in rec: by_rec[a['_pnum']].append(a)
    for num, acts in by_rec.items():
        if len(acts) < MIN_REC_PLAYER: continue
        pos = sum(1 for a in acts if a['effect'] in ('#','+'))
        err = sum(1 for a in acts if a['effect']=='=')
        weak.append({'name':apellido_of(num),'tot':len(acts),
                     'pospct':ipct(pos,len(acts)),'errpct':ipct(err,len(acts))})
    weak.sort(key=lambda x:(x['pospct'], -x['errpct']))   # peores primero
    recep = {'tot':r_tot,'pospct':ipct(r_pos,r_tot),'errpct':ipct(r_err,r_tot),'weak':weak}

    # ── ROTACIONES (S1..S6) ──
    fronts = rotations_for(team, apellido_of)
    rotations = []
    for r in range(1,7):
        ra = [a for a in atk if a.get('setter_pos')==r]
        if not ra:
            rotations.append(None); continue
        so = [a for a in ra if a.get('so')]
        dc = Counter(a['_pnum'] for a in ra)
        dist = [{'name':apellido_of(n),'pct':ipct(c,len(ra))} for n,c in dc.most_common(3)]
        rotations.append({
            'r': r, 'atk': len(ra), 'eff': rint(eng.eff_atk(ra)),
            'so_eff': hit(so), 'so_n': len(so),
            'dist': dist, 'front': fronts.get(r, []),
        })

    # ── EN SISTEMA vs FUERA DE SISTEMA (sobre el ataque de side-out) ──
    def sysblock(subset):
        if not subset:
            return {'n':0,'eff':0,'dist':[],'combos':[]}
        dc = Counter(a['_pnum'] for a in subset)
        dist = [{'name':apellido_of(n),'pct':ipct(c,len(subset))} for n,c in dc.most_common(4)]
        return {'n':len(subset),'eff':hit(subset),'dist':dist,'combos':top_zones(subset,'combo',4)}
    so_atk = [a for a in atk if a.get('so')]
    insys  = [a for a in so_atk if a.get('rq') in ('#','+')]
    outsys = [a for a in so_atk if a.get('rq') in ('-','/')]
    sistema = {'insys':sysblock(insys),'outsys':sysblock(outsys)}

    # ── DISTRIBUCION DEL ARMADOR SEGUN DESDE DONDE RECIBE (z1/z6/z5) ──
    by_zone = {}
    for z in ('Z1','Z6','Z5'):
        by_zone[z] = sysblock([a for a in so_atk if a.get('rec_from')==z])
    sistema['by_zone'] = by_zone

    # ── DISTRIBUCION DEL ARMADOR SEGUN QUIEN RECIBE (filtro) ──
    rec_groups = defaultdict(list)
    for a in so_atk:
        if a.get('rec_by'): rec_groups[a['rec_by']].append(a)
    receivers = []
    for num, sub in rec_groups.items():
        if len(sub) < MIN_REC_PLAYER: continue
        b = sysblock(sub)
        receivers.append({'num':num,'name':apellido_of(num),'n':len(sub),
                          'eff':b['eff'],'dist':b['dist'],'combos':b['combos']})
    receivers.sort(key=lambda x:-x['n'])
    sistema['receivers'] = receivers

    return {'matches':nfiles,'serve':serve,'attack':attack,'set':setd,'recep':recep,
            'rotations':rotations,'sistema':sistema}

def main():
    teams = collect()
    out = {}
    for disp, team in teams.items():
        if len(team['files']) < MIN_MATCHES: continue
        out[disp] = build_team(disp, team)
    # ordenar por cantidad de partidos (desc)
    out = dict(sorted(out.items(), key=lambda kv:-kv[1]['matches']))
    js = 'window.SCOUTING_RIVAL = ' + json.dumps(out, ensure_ascii=False) + ';\n'
    path = os.path.join(OUTPUT_DIR, 'scouting_rival.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(js)
    print('  \u2713 scouting_rival.js  (%d equipos, %dKB)' % (len(out), os.path.getsize(path)//1024))

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description='Genera scouting_rival.js desde los .dvw')
    ap.add_argument('--dvw_dir', default='.', help='Carpeta con los .dvw (default: actual)')
    ap.add_argument('--output_dir', default='.', help='Donde escribir scouting_rival.js')
    a = ap.parse_args()
    DVW_DIR = a.dvw_dir
    OUTPUT_DIR = a.output_dir
    if not glob.glob(os.path.join(DVW_DIR, '*.dvw')):
        print('  [ATENCION] No hay .dvw en "%s"' % DVW_DIR); sys.exit(1)
    print('Generando scouting desde %s ...' % DVW_DIR)
    main()
