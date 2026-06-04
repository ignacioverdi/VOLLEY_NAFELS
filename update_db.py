#!/usr/bin/env python3
"""
update_db.py — Sistema automático de actualización de base de datos NLA
=======================================================================
USO:
  python3 update_db.py --dvw_dir /ruta/nuevos_dvw/ --temporada 2026/27
  
El script:
  1. Parsea todos los DVW en el directorio indicado
  2. Agrega las acciones a nla_players_db.json (sin borrar temporadas anteriores)
  3. Regenera nla_full_stats.json con estadísticas actualizadas
  4. Regenera nla_stats_table.html con los nuevos datos
  5. Regenera los heatmaps de cada equipo
  
ESTRUCTURA DE ARCHIVOS:
  nla_players_db.json   — base de datos principal (se actualiza)
  nla_full_stats.json   — estadísticas calculadas (se regenera)
  nla_stats_table.html  — tabla interactiva (se regenera)
  ataque_{equipo}.html  — heatmap ataque por equipo (se regenera)
  saque_{equipo}.html   — heatmap saque por equipo (se regenera)
  recepcion_{equipo}.html — heatmap recepción por equipo (se regenera)
"""

import os, re, json, argparse, shutil
from collections import defaultdict, Counter

# ── CONFIGURACIÓN ─────────────────────────────────────────────────
NLA_TEAMS = ['Amriswil','Chenois','Colombier','Jona','Lausanne',
             'Nafels','Schonenwerd','St Gallen']

TEAM_NORM = {
    'Biogas Volley Näfels (NLA Men)': 'Nafels',
    'Volley NFELS': 'Nafels', 'Volley Nfels': 'Nafels',
    'Volley Amriswil (NLA Men)': 'Amriswil',
    'Volley Schönenwerd (NLA Men)': 'Schonenwerd',
    'Chênois Genève Volleyball (NLA Men)': 'Chenois',
    'Chnois Genve Volleyball': 'Chenois',
    'Colombier Volley (NLA Men)': 'Colombier',
    'STV St Gallen (NLA Men)': 'St Gallen',
    'TSV Jona Volleyball (NLA Men)': 'Jona',
    'TSV Jona Volleyball': 'Jona',
    'Lausanne UC (NLA Men)': 'Lausanne',
    'VBC Sursee (NLB Men)': 'Sursee',
    'Orion Stars': 'Orion', 'CSU Corona Brasov': 'Brasov',
    'Neftohimic 2010 BURGAS': 'Burgas',
    'SCM ZALAU': 'Zalau', 'SCM Zalau': 'Zalau',
}

TEAM_COLORS = {
    'Nafels':'#22c55e','Amriswil':'#3b82f6','Schonenwerd':'#f97316',
    'Chenois':'#818cf8','Colombier':'#f59e0b','Jona':'#06b6d4',
    'Lausanne':'#ec4899','St Gallen':'#94a3b8'
}

ATK_COMBOS = ['X5','V5','X6','V6','X8','V8','X1','X7','XM','X2','XB','XP','XR',
              'X0','V0','XG','XC','XD','PP','X9','XT','X3','X4','XF','CB','CF','CD']
COMBO_IDX  = {c:i for i,c in enumerate(ATK_COMBOS)}
RES_D  = ['#','+','-','/','=','!']; RES_IDX = {r:i for i,r in enumerate(RES_D)}
REC_D  = ['#','+','!','-','/','=','?']; REC_IDX = {r:i for i,r in enumerate(REC_D)}

# ── HELPERS ───────────────────────────────────────────────────────
def norm(name):
    return TEAM_NORM.get(name, name.split('(')[0].strip())

def get_teams(lines):
    in_t=False; tl=[]
    for line in lines[:100]:
        l=line.strip()
        if l=='[3TEAMS]': in_t=True; continue
        if l.startswith('[3') and in_t: break
        if in_t and ';' in l and not l.startswith('['): tl.append(l.split(';'))
    return (tl[0][1].strip() if tl else ''), (tl[1][1].strip() if len(tl)>1 else '')

def get_players(lines, section):
    in_sec=False; players={}
    for line in lines:
        l=line.strip()
        if l==section: in_sec=True; continue
        if l.startswith('[3') and in_sec: break
        if in_sec and ';' in l:
            parts=l.split(';')
            try:
                num=int(parts[1])
                last=parts[9].strip() if len(parts)>9 else ''
                first=parts[10].strip() if len(parts)>10 else ''
                role=parts[12].strip() if len(parts)>12 else ''
                pc=parts[13].strip() if len(parts)>13 else ''
                pm={'1':'OH','2':'OPP','3':'MB','4':'S','L':'L','5':'OH','':'?'}
                pos='L' if role=='L' else pm.get(pc,'?')
                players[num]={'name':f"{first} {last}".strip(),'pos':pos,'num':num}
            except: pass
    return players

def eff_atk(acts):
    if not acts: return None
    t=len(acts); k=sum(1 for a in acts if a['effect']=='#')
    bl=sum(1 for a in acts if a['effect']=='/'); e=sum(1 for a in acts if a['effect']=='=')
    return round((k-bl-e)/t*100,1)

def eff_srv(acts):
    if not acts: return None
    t=len(acts); k=sum(1 for a in acts if a['effect']=='#')
    pp=sum(1 for a in acts if a['effect']=='+'); sl=sum(1 for a in acts if a['effect']=='/')
    e=sum(1 for a in acts if a['effect']=='=')
    return round((k+0.5*sl+0.25*pp-e)/t*100,1)

def eff_rec(acts):
    if not acts: return None
    t=len(acts); k=sum(1 for a in acts if a['effect']=='#')
    pp=sum(1 for a in acts if a['effect']=='+'); sl=sum(1 for a in acts if a['effect']=='/')
    e=sum(1 for a in acts if a['effect']=='=')
    return round((k+0.5*pp-0.5*sl-e)/t*100,1)

def eff_blk(acts):
    if not acts: return None
    t=len(acts); k=sum(1 for a in acts if a['effect']=='#')
    pos=sum(1 for a in acts if a['effect']=='+')
    return round((k+pos)/t*100,1)

def pct_val(acts, eff):
    if not acts: return None
    return round(sum(1 for a in acts if a['effect']==eff)/len(acts)*100,1)

POS_COMBOS = {
    'OH':  {'X5','V5','XP','XT'},
    'OPP': {'X6','V6','X8','V8','X0','V0','X3','X4'},
    'MB':  {'X1','X7','XM','X2','XG','XC','XD','XB'},
    'S':   {'PP'},
}
POS_ORDER = {'OH':'PUNTA','OPP':'OPUESTO','MB':'CENTRAL','S':'ARMADOR','L':'LIBERO','?':'OTRO'}

def infer_pos(atk_acts):
    if not atk_acts: return '?'
    combos = Counter(a.get('combo','') for a in atk_acts if a.get('combo'))
    scores = {'OH':0,'OPP':0,'MB':0,'S':0}
    for combo, n in combos.most_common(3):
        for pos, pc in POS_COMBOS.items():
            if combo in pc: scores[pos] += n
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else '?'

# ── PARSE DVW (both teams) ────────────────────────────────────────
def parse_dvw_both(fpath, temporada):
    with open(fpath, encoding='utf-8', errors='ignore') as f:
        content = f.read()
    lines = content.split('\n')
    home_raw, away_raw = get_teams(lines)
    home = norm(home_raw); away = norm(away_raw)
    m = re.search(r'(\d{4}-\d{2}-\d{2})', os.path.basename(fpath))
    date = m.group(1) if m else ''
    result = {}

    for team, pfx, section in [(home,'*','[3PLAYERS-H]'),(away,'a','[3PLAYERS-V]')]:
        if not team: continue
        players = get_players(lines, section)
        rival = away if pfx=='*' else home

        idx = content.find('[3SCOUT]\n')
        if idx < 0: continue
        scout = content[idx+9:content.find('\n[3',idx+9)].strip().split('\n')

        atk=defaultdict(list); srv=defaultdict(list)
        rec=defaultdict(list); sets=defaultdict(list); blk=defaultdict(list)
        prev_srv_orig=0; current_atype=0

        for line in scout:
            l=line.strip()
            if len(l)<6: continue
            t=l[0]; code=l[1:]
            try: pnum=int(code[:2])
            except: continue
            skill=code[2].upper() if len(code)>2 else ''
            stype=code[3].upper() if len(code)>3 else ''
            effect=code[4]         if len(code)>4 else ''
            rest=code[5:]          if len(code)>5 else ''
            if skill not in ('S','R','A','E','B','D','F'): continue
            tp=rest.split('~')

            if skill=='A':
                combo=tp[0] if tp else ''; traj=tp[1] if len(tp)>1 else ''
            elif skill in ('S','R'):
                combo=''; traj=tp[3] if len(tp)>3 else ''
            elif skill=='E':
                raw=tp[0] if tp else ''; combo=raw[:2] if len(raw)>=2 else raw
                traj=tp[1] if len(tp)>1 else ''
            else:
                combo=tp[0] if tp else ''; traj=tp[1] if len(tp)>1 else ''

            orig=int(traj[0]) if traj and traj[0].isdigit() else 0
            dest=int(traj[1]) if traj and len(traj)>1 and traj[1].isdigit() else 0
            sc=l.split(';')
            try:
                sp_h=int(sc[9].strip()) if len(sc)>9 and sc[9].strip().isdigit() else 0
                sp_v=int(sc[10].strip()) if len(sc)>10 and sc[10].strip().isdigit() else 0
                setter_pos=sp_h if pfx=='*' else sp_v
            except: setter_pos=0
            try: set_num=int(sc[8].strip()) if len(sc)>8 and sc[8].strip().isdigit() else 1
            except: set_num=1

            if skill=='S':
                prev_srv_orig=orig
                current_atype=0 if t!=pfx else 1
            if t!=pfx: continue

            action={'pnum':pnum,'stype':stype,'effect':effect,'combo':combo,
                    'orig':orig,'dest':dest,'setter_pos':setter_pos,'set_num':set_num,
                    'date':date,'rival':rival,'atype':current_atype,
                    'srv_orig':prev_srv_orig,'temporada':temporada}

            if   skill=='A': atk[pnum].append(action)
            elif skill=='S': srv[pnum].append(action)
            elif skill=='R': rec[pnum].append(action)
            elif skill=='E': sets[pnum].append(action)
            elif skill=='B': blk[pnum].append(action)

        result[team]={'players':players,'atk':dict(atk),'srv':dict(srv),
                      'rec':dict(rec),'sets':dict(sets),'blk':dict(blk)}
    return result, date, home, away

# ── UPDATE DATABASE ───────────────────────────────────────────────
def update_database(dvw_dir, temporada, db_path='nla_players_db.json'):
    # Load existing DB
    if os.path.exists(db_path):
        with open(db_path) as f: db = json.load(f)
        teams_data = db.get('teams', {})
        games_log  = db.get('games', [])
        existing_dates = {g['file'] for g in games_log}
    else:
        teams_data = {}; games_log = []; existing_dates = set()

    dvw_files = sorted([f for f in os.listdir(dvw_dir) if f.endswith('.dvw')])
    added = 0; skipped = 0

    for fname in dvw_files:
        if fname in existing_dates:
            skipped += 1; continue

        fpath = os.path.join(dvw_dir, fname)
        if os.path.getsize(fpath) < 1000: continue

        try:
            result, date, home, away = parse_dvw_both(fpath, temporada)
        except Exception as e:
            print(f"  ERROR {fname}: {e}"); continue

        for team, data in result.items():
            if team not in teams_data: teams_data[team] = {}
            for num, p in data['players'].items():
                ns = str(num)
                if ns not in teams_data[team]:
                    teams_data[team][ns] = {'info':None,'atk':[],'srv':[],'rec':[],'sets':[],'blk':[]}
                if teams_data[team][ns]['info'] is None:
                    teams_data[team][ns]['info'] = {**p, 'team':team}
            for num, acts in data['atk'].items():
                teams_data[team].setdefault(str(num),{'info':None,'atk':[],'srv':[],'rec':[],'sets':[],'blk':[]})
                teams_data[team][str(num)]['atk'].extend(acts)
            for num, acts in data['srv'].items():
                teams_data[team].setdefault(str(num),{'info':None,'atk':[],'srv':[],'rec':[],'sets':[],'blk':[]})
                teams_data[team][str(num)]['srv'].extend(acts)
            for num, acts in data['rec'].items():
                teams_data[team].setdefault(str(num),{'info':None,'atk':[],'srv':[],'rec':[],'sets':[],'blk':[]})
                teams_data[team][str(num)]['rec'].extend(acts)
            for num, acts in data['blk'].items():
                teams_data[team].setdefault(str(num),{'info':None,'atk':[],'srv':[],'rec':[],'sets':[],'blk':[]})
                teams_data[team][str(num)]['blk'].extend(acts)

        games_log.append({'file':fname,'date':date,'home':home,'away':away,'temporada':temporada})
        added += 1
        if added % 10 == 0: print(f"  Parsed {added} files...")

    db_out = {'teams': teams_data, 'games': games_log}
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(db_out, f, ensure_ascii=False)

    print(f"✓ DB updated: {added} added, {skipped} skipped")
    return teams_data, games_log

# ── CALCULATE STATS ───────────────────────────────────────────────
def calculate_stats(teams_data, temporada_filter=None):
    players = []
    team_stats_out = []

    for team in NLA_TEAMS:
        td = teams_data.get(team, {})
        all_atk=[]; all_srv=[]; all_rec=[]; all_blk=[]

        for num_str, pd in td.items():
            info = pd.get('info') or {}
            if not info: continue

            # Filter by temporada if specified
            atk = [a for a in pd.get('atk',[]) if not temporada_filter or a.get('temporada')==temporada_filter]
            srv = [a for a in pd.get('srv',[]) if not temporada_filter or a.get('temporada')==temporada_filter]
            rec = [a for a in pd.get('rec',[]) if not temporada_filter or a.get('temporada')==temporada_filter]
            blk_acts = [a for a in pd.get('blk',[]) if not temporada_filter or a.get('temporada')==temporada_filter]

            if len(atk)+len(srv)+len(rec)+len(blk_acts) < 20: continue

            all_atk.extend(atk); all_srv.extend(srv)
            all_rec.extend(rec); all_blk.extend(blk_acts)

            pos = info.get('pos','?')
            if pos=='?':
                pos = infer_pos(atk)
            pos_label = POS_ORDER.get(pos, pos)

            atk_so=[a for a in atk if a.get('atype',0)==0]
            atk_tr=[a for a in atk if a.get('atype',0)==1]
            srv_q=[a for a in srv if a.get('stype','')=='Q']
            srv_m=[a for a in srv if a.get('stype','')=='M']

            players.append({
                'team':team,'num':int(num_str),'name':info.get('name','').strip(),
                'pos':pos,'pos_label':pos_label,'temporada':temporada_filter or 'all',
                'atk_tot':len(atk),'atk_eff':eff_atk(atk),
                'atk_so_eff':eff_atk(atk_so),'atk_tr_eff':eff_atk(atk_tr),
                'atk_k':pct_val(atk,'#'),'atk_e':pct_val(atk,'='),'atk_bl':pct_val(atk,'/'),
                'srv_tot':len(srv),'srv_eff':eff_srv(srv),
                'srv_q_eff':eff_srv(srv_q),'srv_m_eff':eff_srv(srv_m),
                'srv_ace':pct_val(srv,'#'),'srv_e':pct_val(srv,'='),
                'srv_q_tot':len(srv_q),'srv_m_tot':len(srv_m),
                'rec_tot':len(rec),'rec_eff':eff_rec(rec),
                'rec_perf':pct_val(rec,'#'),'rec_pos':pct_val(rec,'+'),
                'rec_neg':pct_val(rec,'/'),'rec_e':pct_val(rec,'='),
                'blk_tot':len(blk_acts),'blk_eff':eff_blk(blk_acts),
                'blk_k':pct_val(blk_acts,'#'),'blk_pos':pct_val(blk_acts,'+'),
            })

        team_stats_out.append({
            'team':team,'temporada':temporada_filter or 'all',
            'atk_eff':eff_atk(all_atk),'srv_eff':eff_srv(all_srv),
            'rec_eff':eff_rec(all_rec),'blk_eff':eff_blk(all_blk),
            'atk_tot':len(all_atk),'srv_tot':len(all_srv),
            'rec_tot':len(all_rec),'blk_tot':len(all_blk),
        })

    return players, team_stats_out

# ── BUILD HEATMAPS ────────────────────────────────────────────────
def build_heatmaps(teams_data, template_dir='.', output_dir='.', temporada_filter=None):
    """Build ataque/saque/recepcion heatmaps for each NLA team."""
    for team in NLA_TEAMS:
        if team == 'Nafels': continue
        td = teams_data.get(team, {})
        if not td: continue

        slug = team.lower().replace(' ','_')

        # Collect rivals
        rivals_set = set()
        for pd in td.values():
            for a in pd.get('atk',[]):
                rivals_set.add(a.get('rival',''))
        rivals_list = sorted(r for r in rivals_set if r)
        rival_idx = {r:i for i,r in enumerate(rivals_list)}

        BASE = {'rivals':rivals_list,'games':[],'combos':ATK_COMBOS}
        atk_players={}; srv_players={}; rec_players={}

        for num_str, pd in td.items():
            info = pd.get('info') or {}
            name = info.get('name','')
            num  = int(num_str)
            atk = [a for a in pd.get('atk',[]) if not temporada_filter or a.get('temporada')==temporada_filter]
            srv = [a for a in pd.get('srv',[]) if not temporada_filter or a.get('temporada')==temporada_filter]
            rec = [a for a in pd.get('rec',[]) if not temporada_filter or a.get('temporada')==temporada_filter]

            if atk:
                rows=[[rival_idx.get(a.get('rival',''),0),0,a.get('set_num',1),1,a.get('atype',0),
                       COMBO_IDX.get(a.get('combo',''),-1),RES_IDX.get(a.get('effect','='),4),
                       a.get('orig',0),a.get('dest',0),6,-1] for a in atk]
                atk_players[num_str]={'name':name,'num':num,'a':rows}

            if srv:
                st_list=list(dict.fromkeys('S'+a.get('stype','Q') for a in srv)) or ['SQ','SM']
                st_idx={s:i for i,s in enumerate(st_list)}
                rows=[[rival_idx.get(a.get('rival',''),0),0,a.get('set_num',1),1,
                       st_idx.get('S'+a.get('stype','Q'),0),RES_IDX.get(a.get('effect','='),4),
                       a.get('orig',0),a.get('dest',0)] for a in srv]
                srv_players[num_str]={'name':name,'num':num,'stypes':st_list,'s':rows}

            if rec:
                rt_list=list(dict.fromkeys('R'+a.get('stype','M') for a in rec)) or ['RM','RQ']
                rt_idx={r:i for i,r in enumerate(rt_list)}
                rows=[[rival_idx.get(a.get('rival',''),0),0,a.get('set_num',1),1,
                       rt_idx.get('R'+a.get('stype','M'),0),REC_IDX.get(a.get('effect','-'),3),
                       a.get('orig',0),a.get('dest',0)] for a in rec]
                rec_players[num_str]={'name':name,'num':num,'rtypes':rt_list,'r':rows}

        display = team.upper()
        SUBS=[('CASLA VOLEY',f'{display} VOLEY'),('CASLA Voley',f'{display} Voley'),
              ('San Lorenzo',display),('SAN LORENZO',display),
              ('División de Honor 2026','NLA Suiza'),('División de Honor','NLA Suiza'),
              ('DHM 2026','NLA 2025/26'),('<script src="chat.js"></script>',''),
              ('ataque_casla.html',f'ataque_{slug}.html'),
              ('saque_casla.html',f'saque_{slug}.html'),
              ('recepcion_casla.html',f'recepcion_{slug}.html'),
              ('armador_casla.html',f'armador_{slug}.html'),
              ("'casla_role'","'liga_role'"),("'casla_pin_skip'","'liga_pin_skip'")]

        for skill, src, raw_data, out in [
            ('ataque',    'casla_src_ataque_casla.html',    {**BASE,'players':atk_players}, f'ataque_{slug}.html'),
            ('saque',     'casla_src_saque_casla.html',     {**BASE,'players':srv_players}, f'saque_{slug}.html'),
            ('recepcion', 'casla_src_recepcion_casla.html', {**BASE,'players':rec_players}, f'recepcion_{slug}.html'),
        ]:
            src_path = os.path.join(template_dir, src)
            if not os.path.exists(src_path): continue
            with open(src_path, encoding='utf-8') as f: html = f.read()
            for old, new in SUBS: html = html.replace(old, new)
            import re as re2
            new_raw = 'var RAW=' + json.dumps(raw_data, ensure_ascii=False) + ';'
            old_raw = re2.search(r'var RAW=\{.*?\};', html, re2.DOTALL)
            if old_raw: html = html[:old_raw.start()] + new_raw + html[old_raw.end():]
            out_path = os.path.join(output_dir, out)
            with open(out_path, 'w', encoding='utf-8') as f: f.write(html)

        print(f"  ✓ {team}: 3 heatmaps")

# ── BUILD STATS TABLE ─────────────────────────────────────────────
def build_stats_table(players, teams, output_path='nla_stats_table.html'):
    """Build the interactive HTML stats table."""
    tpl_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nla_stats_template.html')
    with open(tpl_path, encoding='utf-8') as f:
        template = f.read()

    js_data = f"var PLAYERS={json.dumps(players,ensure_ascii=False)};\nvar TEAMS={json.dumps(teams,ensure_ascii=False)};\n"
    temporadas = sorted(set(p.get('temporada','') for p in players if p.get('temporada') and p.get('temporada')!='all'))

    html = template.replace('/*__DATA_PLACEHOLDER__*/', js_data)
    opts = ''.join(f'<option>{t}</option>' for t in temporadas)
    html = html.replace('<!--__TEMPORADAS__-->', opts)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"   ✓ Stats table: {os.path.getsize(output_path)//1024}KB")

# ── MAIN ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Update NLA volleyball database from DVW files')
    parser.add_argument('--dvw_dir',    required=True,  help='Directory with new DVW files')
    parser.add_argument('--temporada',  default='2025/26', help='Season label (e.g. 2026/27)')
    parser.add_argument('--db_path',    default='nla_players_db.json', help='Database file path')
    parser.add_argument('--output_dir', default='.',    help='Output directory for HTML files')
    parser.add_argument('--template_dir', default='.', help='Directory with CASLA template HTML files')
    parser.add_argument('--filter_temporada', default=None, help='Show only this season in stats (default: all)')
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"NLA DATABASE UPDATE — {args.temporada}")
    print(f"{'='*60}\n")

    # Step 1: Update DB
    print("1. Parsing DVW files...")
    teams_data, games_log = update_database(args.dvw_dir, args.temporada, args.db_path)

    # Step 2: Calculate stats
    print("\n2. Calculating stats...")
    t_filter = args.filter_temporada or args.temporada
    players, teams = calculate_stats(teams_data, t_filter)
    stats_path = os.path.join(args.output_dir, 'nla_full_stats.json')
    with open(stats_path, 'w') as f:
        json.dump({'players':players,'teams':teams,'temporada':t_filter}, f, ensure_ascii=False)
    print(f"   ✓ {len(players)} players, {len(teams)} teams")

    # Step 3: Build heatmaps
    print("\n3. Building heatmaps...")
    build_heatmaps(teams_data, args.template_dir, args.output_dir, t_filter)

    # Step 4: Build stats table
    print("\n4. Building stats table...")
    table_path = os.path.join(args.output_dir, 'nla_stats_table.html')
    build_stats_table(players, teams, table_path)

    print(f"\n{'='*60}")
    print(f"✓ DONE — {len(games_log)} total games in DB")
    print(f"{'='*60}\n")


# ═══════════════════════════════════════════════════════════════════
# GENERADORES DE DATOS PARA PÁGINAS (historial, partidos)
# ═══════════════════════════════════════════════════════════════════

# Roster Nafels (posiciones + nombres oficiales)
NAFELS_ROSTER = {
    1:'LIBERO',2:'PUNTA',3:'PUNTA',4:'ARMADOR',5:'CENTRAL',6:'OPUESTO',
    7:'CENTRAL',8:'LIBERO',9:'PUNTA',10:'CENTRAL',11:'PUNTA',14:'OPUESTO',15:'CENTRAL',
}
NAFELS_NAMES = {
    1:'DEECKE',2:'CORZO',3:'SCHWITTER',4:'VAZQUEZ',5:'HESSELHOLT',6:'DENIS CABANAS',
    7:'SCHMID',8:'PETER',9:'BROCH',10:'BOGDANOVSKI',11:'BARTHOLET',14:'FIGUEIREDO',15:'NIKOLOV',
}
POS_COLOR = {'CENTRAL':'#f97316','OPUESTO':'#818cf8','PUNTA':'#22c55e','ARMADOR':'#f59e0b','LIBERO':'#06b6d4'}

def parse_set_scores(content):
    """Extract final set scores from [3SET]. Field index 4 = final score (e.g. 25-17)."""
    idx = content.find('[3SET]')
    if idx < 0: return []
    end = content.find('[3', idx+6)
    block = content[idx+6:end].strip().split('\n')
    sets = []
    for line in block:
        parts = line.split(';')
        if len(parts) >= 5:
            final = parts[4].strip()
            m = re.match(r'(\d+)\s*-\s*(\d+)', final)
            if m: sets.append((int(m.group(1)), int(m.group(2))))
    return sets

def calc_match_skill(acts, skill_type):
    """Per-match skill stats using confirmed EFF formulas."""
    t=len(acts)
    if t==0: return {'T':0,'Eff':0,'Punto':0,'Pos':0,'Adm':0,'Neg':0,'Err':0,'Vend':0}
    k=sum(1 for a in acts if a['effect']=='#'); pp=sum(1 for a in acts if a['effect']=='+')
    exc=sum(1 for a in acts if a['effect']=='!'); sl=sum(1 for a in acts if a['effect']=='/')
    e=sum(1 for a in acts if a['effect']=='='); minus=sum(1 for a in acts if a['effect']=='-')
    if   skill_type=='a': eff=round((k-sl-e)/t*100)
    elif skill_type=='s': eff=round((k+0.5*sl+0.25*pp-e)/t*100)
    elif skill_type=='r': eff=round((k+0.5*pp-0.5*sl-e)/t*100)
    else: eff=0
    return {'T':t,'Eff':eff,'Punto':k,'Pos':pp,'Adm':exc,'Neg':sl,'Err':e,'Vend':minus}

def generate_team_pages_data(dvw_dir, team_name, output_dir='.', temporada='2025/26'):
    """Generate datos_historial.js + datos_partidos.js for a specific team from DVW."""
    from datetime import datetime
    files = sorted([f for f in os.listdir(dvw_dir) if f.endswith('.dvw')])

    games = []
    for fname in files:
        with open(os.path.join(dvw_dir,fname), encoding='utf-8', errors='ignore') as f:
            content = f.read()
        lines = content.split('\n')
        home_raw, away_raw = get_teams(lines)
        home = norm(home_raw); away = norm(away_raw)
        if team_name not in (home, away): continue

        sets = parse_set_scores(content)
        m = re.search(r'(\d{4}-\d{2}-\d{2})', fname)
        date = m.group(1) if m else ''
        team_home = home == team_name
        rival = away if team_home else home

        tsets=0; rsets=0; set_strings=[]
        for h,a in sets:
            th = h if team_home else a; tr = a if team_home else h
            set_strings.append(f"{th}-{tr}")
            if th>tr: tsets+=1
            else: rsets+=1
        if tsets+rsets==0: continue

        games.append({'file':fname,'date':date,'rival':rival,'team_home':team_home,
                       'tsets':tsets,'rsets':rsets,'result':'V' if tsets>rsets else 'D',
                       'set_strings':set_strings,'content_path':os.path.join(dvw_dir,fname)})

    # HISTORIAL entries (per match player stats)
    historial = []
    for g in sorted(games, key=lambda x:x['date']):
        if not g['date']: continue
        with open(g['content_path'], encoding='utf-8', errors='ignore') as f:
            content = f.read()
        lines = content.split('\n')
        home_raw,_ = get_teams(lines)
        team_home = norm(home_raw)==team_name
        pfx = '*' if team_home else 'a'
        section = '[3PLAYERS-H]' if team_home else '[3PLAYERS-V]'
        players = get_players(lines, section)

        idx = content.find('[3SCOUT]\n')
        scout = content[idx+9:content.find('\n[3',idx+9)].strip().split('\n')
        pa = defaultdict(lambda: {'a':[],'s':[],'r':[],'b':[]})
        for line in scout:
            l=line.strip()
            if len(l)<6 or l[0]!=pfx: continue
            code=l[1:]
            try: pn=int(code[:2])
            except: continue
            sk=code[2].upper() if len(code)>2 else ''
            ef=code[4] if len(code)>4 else ''
            if sk=='A': pa[pn]['a'].append({'effect':ef})
            elif sk=='S': pa[pn]['s'].append({'effect':ef})
            elif sk=='R': pa[pn]['r'].append({'effect':ef})
            elif sk=='B': pa[pn]['b'].append({'effect':ef})

        jugs=[]
        for pn, acts in pa.items():
            s=calc_match_skill(acts['s'],'s'); r=calc_match_skill(acts['r'],'r'); a=calc_match_skill(acts['a'],'a')
            bk=sum(1 for x in acts['b'] if x['effect']=='#'); bp=sum(1 for x in acts['b'] if x['effect']=='+')
            bT=len(acts['b']); bEff=round((bk+bp)/bT*100) if bT else 0
            if s['T']+r['T']+a['T']+bT<1: continue
            nm = NAFELS_NAMES.get(pn, players.get(pn,{}).get('name','').split()[-1] if players.get(pn,{}).get('name') else str(pn))
            jugs.append({'c':pn,'n':nm,
                's'+'T':s['T'],'sEff':s['Eff'],'sPunto':s['Punto'],'sPos':s['Pos'],'sNeg':s['Neg'],'sErr':s['Err'],'sAdm':s['Adm'],'sVend':s['Vend'],
                'rT':r['T'],'rEff':r['Eff'],'rPunto':r['Punto'],'rPos':r['Pos'],'rNeg':r['Neg'],'rErr':r['Err'],'rAdm':r['Adm'],'rVend':r['Vend'],
                'aT':a['T'],'aEff':a['Eff'],'aPunto':a['Punto'],'aPos':a['Pos'],'aNeg':a['Neg'],'aErr':a['Err'],'aAdm':a['Adm'],'aVend':a['Vend'],
                'bT':bT,'bPt':bk,'bPtPos':bp,'bEff':bEff})
        historial.append({'fecha':'/'.join(reversed(g['date'].split('-'))),'tipo':'P','rival':g['rival'],
            'resultado':{'nafels':g['tsets'],'rival':g['rsets'],'sets':g['set_strings']},'jugadores':jugs})

    now = datetime.now().strftime('%d/%m/%Y, %H:%M:%S')
    hist_js = 'window.HISTORIAL_DATA = ' + json.dumps({'generado':now,'entrenamientos':historial}, ensure_ascii=False, indent=2) + ';\n'
    with open(os.path.join(output_dir,'datos_historial.js'),'w',encoding='utf-8') as f: f.write(hist_js)

    # ── DATOS_PARTIDOS.JS (ataques, saques, recepciones por jugador acumulado) ──
    if os.path.exists('nla_players_db.json'):
        with open('nla_players_db.json') as f: _db = json.load(f)
    else:
        _db = {'teams':{}}
    team_db = _db['teams'].get(team_name, {})

    def _combo_origin(combo, orig):
        M={'X5':4,'V5':4,'X6':2,'V6':2,'X8':9,'V8':9,'X1':3,'X7':3,'XM':3,'X2':3,'XP':8,'X4':4,'X3':2}
        return M.get(combo, orig if orig else 3)
    def _eff(acts, kind):
        t=len(acts)
        if not t: return 0
        k=sum(1 for a in acts if a['effect']=='#'); pp=sum(1 for a in acts if a['effect']=='+')
        sl=sum(1 for a in acts if a['effect']=='/'); e=sum(1 for a in acts if a['effect']=='=')
        if kind=='a': return round((k-sl-e)/t*100)
        if kind=='s': return round((k+0.5*sl+0.25*pp-e)/t*100)
        if kind=='r': return round((k+0.5*pp-0.5*sl-e)/t*100)
        return 0
    def _dist(acts):
        dc=Counter(a.get('dest',0) for a in acts if a.get('dest')); tot=sum(dc.values())
        return [{'z':z,'pct':round(n/tot*100)} for z,n in dc.most_common() if z and tot]

    partidos_jug=[]
    for ns, pd in team_db.items():
        num=int(ns); info=pd.get('info') or {}
        atk=pd.get('atk',[]); srv=pd.get('srv',[]); rec=pd.get('rec',[])
        if len(atk)+len(srv)+len(rec)<5: continue
        pos_label=NAFELS_ROSTER.get(num,'OTRO')
        name=NAFELS_NAMES.get(num, info.get('name','').split()[-1] if info.get('name') else str(num))
        cg=defaultdict(list)
        for a in atk:
            if a.get('combo'): cg[a['combo']].append(a)
        ataques=[{'cod':c,'orig':_combo_origin(c,acts[0].get('orig',0)),'tot':len(acts),'eff':_eff(acts,'a'),'destinos':_dist(acts)} for c,acts in sorted(cg.items(),key=lambda x:-len(x[1])) if len(acts)>=2]
        sg=defaultdict(list)
        for a in srv: sg['S'+a.get('stype','Q')].append(a)
        saques=[{'cod':st,'orig':acts[0].get('orig',0),'tot':len(acts),'eff':_eff(acts,'s'),'destinos':_dist(acts)} for st,acts in sorted(sg.items(),key=lambda x:-len(x[1])) if len(acts)>=2]
        rg=defaultdict(list)
        for a in rec: rg['R'+a.get('stype','M')].append(a)
        recepciones=[{'cod':rt,'orig':acts[0].get('orig',0),'tot':len(acts),'eff':_eff(acts,'r'),'destinos':_dist(acts)} for rt,acts in sorted(rg.items(),key=lambda x:-len(x[1])) if len(acts)>=2]
        partidos_jug.append({'num':num,'nombre':f"{num} {name.title()}",'pos':pos_label,'color':POS_COLOR.get(pos_label,'#64748b'),'info':{},'ataques':ataques,'saques':saques,'recepciones':recepciones})
    partidos_jug.sort(key=lambda x:x['num'])

    partidos_meta=[{'nombre':g['rival'],'rival':g['rival'],'fecha':'/'.join(reversed(g['date'].split('-'))),'torneo':f'NLA Suiza {temporada}','resultado':g['result'],'sets_nafels':str(g['tsets']),'sets_rival':str(g['rsets'])} for g in sorted(games,key=lambda x:x['date']) if g['date']]

    pjs = f'// datos_partidos.js — {now}\n'
    pjs += f'const PARTIDOS_GENERADO = "{now}";\n'
    pjs += f'const PARTIDOS_TOTAL = {len(partidos_meta)};\n'
    pjs += 'const PARTIDOS_META = ' + json.dumps(partidos_meta, ensure_ascii=False, indent=2) + ';\n'
    pjs += 'const PARTIDOS_JUGADORES = ' + json.dumps(partidos_jug, ensure_ascii=False, indent=2) + ';\n'
    with open(os.path.join(output_dir,'datos_partidos.js'),'w',encoding='utf-8') as f: f.write(pjs)

    return len(historial), len(games)
