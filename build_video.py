# -*- coding: utf-8 -*-
"""
build_video.py - Lee los .dvw de una carpeta y arma el archivo de VIDEO (cortes).
Saca el SEGUNDO de video de cada accion del DVW.

ABANICO (v2): extrae las acciones de LOS DOS equipos de cada partido (no solo Nafels),
etiquetando cada accion con su equipo (campo 'tm' = slug, ej. 'nafels','amriswil').
Asi el editor de cortes permite elegir CUALQUIER equipo de la liga.

MERGE SEGURO: preserva las entradas existentes y solo agrega los partidos nuevos.
Si el archivo previo es de la version vieja (sin 'v':2), regenera todo de cero
automaticamente (para que el abanico aplique a los partidos ya cargados).

Uso:
  python build_video.py "DVW NAFELS 2026" datos_video.js VIDEO_DATA
  python build_video.py "DVW ENTRENAMIENTOS NAFELS 2026" datos_video_ent.js VIDEO_DATA_ENT ent
"""
import os,re,sys,json,glob,unicodedata

DATA_VERSION = 2

def fix_enc(x):
    # Los DVW pueden venir en UTF-8 leido como latin-1 (mojibake "NÃ¤fels"). Lo corrige.
    if x and 'Ã' in x:
        try: return x.encode('latin-1').decode('utf-8')
        except: return x
    return x

COMBOS = json.loads(r'''{"PP":"Setter tip","V0":"High set in 5","V5":"High set in 4","V6":"High set in 2","V8":"High set in 1","VB":"High Pipe set to 6-1","VP":"High Pipe","VR":"High Pipe set to 6-5","X0":"Shoot in 5","X1":"Quick","X2":"X2","X3":"Mezza da posto 2","X4":"Mezza dietro","X5":"Shoot in 4","X6":"Shoot in 2","X7":"Quick lower set","X8":"Shoot in 1","X9":"Mezza davanti dopo 7","XB":"Pipe set to 6-1","XL":"XL","XM":"Quick in 3","XP":"Pipe","XR":"Pipe set to 6-5"}''')
SK={'S':'Saque','R':'Recepción','A':'Ataque','B':'Bloqueo','D':'Defensa','E':'Armado','F':'Freeball'}

# Mapeo de nombres de equipo del DVW -> nombre canonico (igual que update_db_nafels_FULL.py)
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

def is_naf(n): return bool(re.search(r'n[aä]fels|biogas',n or '',re.I))

def norm_team(name):
    name=fix_enc(name or '')
    if name in TEAM_NORM: return TEAM_NORM[name]
    n=re.sub(r'\(NLA[^)]*\)|\(NLB[^)]*\)','',name)
    n=re.sub(r'\b(Volley|Volleyball|TSV|VBC|TV)\b','',n,flags=re.I)
    n=re.sub(r'\s+',' ',n).split('(')[0].strip()
    return n or 'Equipo'

def slugify(name):
    n=unicodedata.normalize('NFKD',name or '').encode('ascii','ignore').decode('ascii')
    return re.sub(r'\s+','_',n.lower().strip())

def parse_dvw(path, ent=False):
    txt=open(path,encoding='latin-1',errors='ignore').read()
    def sec(a,b):
        m=re.search(r'\['+a+r'\](.*?)(?:\['+b+r'\]|\Z)',txt,re.S); return m.group(1) if m else ''
    teamlines=[l.split(';')[1] for l in sec('3TEAMS','3MORE').strip().splitlines()[:2] if ';' in l]
    if len(teamlines)<2: return None
    home_name=norm_team(teamlines[0]); away_name=norm_team(teamlines[1])
    home_slug=slugify(home_name); away_slug=slugify(away_name)

    base=os.path.basename(path)
    mcode=re.search(r'(\d{6})',base); mdate=re.search(r'(\d{4}-\d{2}-\d{2})',base)
    date=mdate.group(1) if mdate else ''
    if mcode: code=mcode.group(1)
    elif ent and date: code='ENT'+date.replace('-','')
    elif ent: code='ENT_'+re.sub(r'[^A-Za-z0-9]','',base)[:12]
    else: return None   # partido sin codigo de 6 digitos -> se ignora

    scout=txt.split('[3SCOUT]')[-1]
    scout_lines=scout.strip().splitlines()

    # Los dos lados del partido: home (codigo '*') y visiting (codigo 'a')
    sides=[('*', sec('3PLAYERS-H','3PLAYERS-V'), home_slug, home_name),
           ('a', sec('3PLAYERS-V','3ATTACKCOMBINATION'), away_slug, away_name)]

    players={}      # slug -> [[num,name], ...]
    actions=[]      # acciones de AMBOS equipos, cada una con 'tm'
    teams_meta={}   # slug -> nombre lindo (para el selector y las etiquetas)

    for sidech, psec, tslug, tname in sides:
        pmap={}; plist=[]
        for l in psec.strip().splitlines():
            p=l.split(';')
            if len(p)>9 and p[1].strip().isdigit():
                num='%02d'%int(p[1]); name=fix_enc((p[9] or '').strip().split()[0]) if p[9].strip() else num
                if num not in pmap: pmap[num]=name; plist.append([num,name])
        if not plist: continue
        teams_meta[tslug]=tname
        seen={n[0] for n in players.get(tslug,[])}
        players.setdefault(tslug,[])
        for n in plist:
            if n[0] not in seen: players[tslug].append(n); seen.add(n[0])
        for l in scout_lines:
            c=l.split(';'); code0=c[0]
            m=re.match(r'^%s(\d{2})([SRABDEF])'%re.escape(sidech),code0)
            if not m: continue
            num,sk=m.group(1),m.group(2)
            if num not in pmap: continue
            try: t=int(c[12])
            except: continue
            ev=code0[5] if len(code0)>5 else ''
            a={'t':t,'num':num,'name':pmap[num],'skill':sk,'sk':SK.get(sk,sk),
               'ev':ev,'set':c[8] if len(c)>8 else '','tm':tslug}
            if sk=='A':
                cb=code0[6:8]
                if cb and cb[0] in 'XVPC' and '~' not in cb: a['x']=cb
            elif sk in ('S','R'):
                tp=code0[4] if len(code0)>4 else ''
                if tp and tp.isalpha(): a['x']=tp
            actions.append(a)

    if not actions: return None  # partido sin acciones con segundo -> se ignora

    return code,{'home':home_slug,'away':away_slug,'homeName':home_name,'awayName':away_name,
                 'date':date,'teams':teams_meta,'players':players,'actions':actions}

def load_existing(path, glob_name):
    if not os.path.isfile(path): return {}
    try:
        t=open(path,encoding='utf-8').read()
        m=re.search(r'window\.'+glob_name+r'\s*=\s*(\{.*\})\s*;?\s*$',t,re.S)
        if not m: return {}
        d=json.loads(m.group(1))
        if d.get('v')!=DATA_VERSION:
            print('  (archivo previo de version vieja: regenero todo para el abanico)')
            return {}
        return d.get('matches') or {}
    except Exception as e:
        print('  (aviso: no pude leer el archivo previo, lo regenero):',e)
    return {}

def build(folder, ent=False):
    matches={}
    for f in sorted(glob.glob(os.path.join(folder,'*.dvw'))):
        r=parse_dvw(f, ent=ent)
        if r and r[0] and r[0] not in matches: matches[r[0]]=r[1]
    return matches

if __name__=='__main__':
    if len(sys.argv)<2:
        print('Uso: python build_video.py "CARPETA" [salida.js] [GLOBAL] [ent]'); sys.exit(1)
    folder=sys.argv[1]
    out=sys.argv[2] if len(sys.argv)>2 else 'datos_video.js'
    glob_name=sys.argv[3] if len(sys.argv)>3 else 'VIDEO_DATA'
    ent=('ent' in sys.argv[4:]) if len(sys.argv)>4 else False
    if not os.path.isdir(folder):
        print('  (no existe la carpeta '+folder+', no genero '+out+')'); sys.exit(0)
    nuevos=build(folder, ent=ent)
    existentes=load_existing(out, glob_name)
    agregados=0
    for code,m in nuevos.items():
        if code not in existentes:
            existentes[code]=m; agregados+=1
    # Hornear los links de mapa_videos(.js/_ent.js) ADENTRO (a prueba de cache)
    mapa_file = 'mapa_videos_ent.js' if ent else 'mapa_videos.js'
    mapa_glob = 'MAPA_VIDEOS_ENT' if ent else 'MAPA_VIDEOS'
    links = {}
    if os.path.isfile(mapa_file):
        try:
            mt = open(mapa_file, encoding='utf-8').read()
            mm = re.search(r'window\.'+mapa_glob+r'\s*=\s*(\{.*?\})\s*;', mt, re.S)
            if mm:
                for k, v in json.loads(mm.group(1)).items():
                    if v: links[k] = v
        except Exception as e:
            print('  (aviso: no pude leer '+mapa_file+':', e, ')')
    data={'v':DATA_VERSION,'combos':COMBOS,'matches':existentes,'links':links}
    with open(out,'w',encoding='utf-8') as f:
        f.write('window.'+glob_name+' = '+json.dumps(data,ensure_ascii=False)+';\n')
    tot=sum(len(m['actions']) for m in existentes.values())
    print('  '+out+': '+str(len(existentes))+' total ('+str(agregados)+' nuevos), '+str(tot)+' acciones con su segundo')

# © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados
