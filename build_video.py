# -*- coding: utf-8 -*-
"""
build_video.py - Lee los .dvw de una carpeta y arma el archivo de VIDEO (cortes).
Saca el SEGUNDO de video de cada accion del DVW (igual que el original).
MERGE SEGURO: nunca pisa lo que ya estaba; preserva las entradas existentes y
solo agrega los partidos/sesiones nuevos.

Uso:
  python build_video.py "DVW NAFELS 2026" datos_video.js VIDEO_DATA
  python build_video.py "DVW ENTRENAMIENTOS NAFELS 2026" datos_video_ent.js VIDEO_DATA_ENT ent
"""
import os,re,sys,json,glob

COMBOS = json.loads(r'''{"PP":"Setter tip","V0":"High set in 5","V5":"High set in 4","V6":"High set in 2","V8":"High set in 1","VB":"High Pipe set to 6-1","VP":"High Pipe","VR":"High Pipe set to 6-5","X0":"Shoot in 5","X1":"Quick","X2":"X2","X3":"Mezza da posto 2","X4":"Mezza dietro","X5":"Shoot in 4","X6":"Shoot in 2","X7":"Quick lower set","X8":"Shoot in 1","X9":"Mezza davanti dopo 7","XB":"Pipe set to 6-1","XL":"XL","XM":"Quick in 3","XP":"Pipe","XR":"Pipe set to 6-5"}''')
SK={'S':'Saque','R':'Recepción','A':'Ataque','B':'Bloqueo','D':'Defensa','E':'Armado','F':'Freeball'}

def is_naf(n): return bool(re.search(r'n[aä]fels|biogas',n or '',re.I))
def clean_team(n):
    n=re.sub(r'\(NLA[^)]*\)','',n or ''); n=re.sub(r'\b(Volley|Volleyball|TSV|VBC|TV)\b','',n,flags=re.I)
    return re.sub(r'\s+',' ',n).strip()

def parse_dvw(path, ent=False):
    txt=open(path,encoding='latin-1',errors='ignore').read()
    def sec(a,b):
        m=re.search(r'\['+a+r'\](.*?)(?:\['+b+r'\]|\Z)',txt,re.S); return m.group(1) if m else ''
    teams=[l.split(';')[1] for l in sec('3TEAMS','3MORE').strip().splitlines()[:2] if ';' in l]
    if len(teams)<2: return None
    side='home' if is_naf(teams[0]) else ('visiting' if is_naf(teams[1]) else None)
    if not side: return None
    opp=clean_team(teams[1] if side=='home' else teams[0]) or 'Entrenamiento'
    sidech='*' if side=='home' else 'a'
    psec=sec('3PLAYERS-H','3PLAYERS-V') if side=='home' else sec('3PLAYERS-V','3ATTACKCOMBINATION')
    players=[]; pmap={}
    for l in psec.strip().splitlines():
        p=l.split(';')
        if len(p)>9 and p[1].strip().isdigit():
            num='%02d'%int(p[1]); name=(p[9] or '').strip().split()[0] if p[9].strip() else num
            if num not in pmap: pmap[num]=name; players.append([num,name])
    base=os.path.basename(path)
    mcode=re.search(r'(\d{6})',base); mdate=re.search(r'(\d{4}-\d{2}-\d{2})',base)
    date=mdate.group(1) if mdate else ''
    if mcode: code=mcode.group(1)
    elif ent and date: code='ENT'+date.replace('-','')
    elif ent: code='ENT_'+re.sub(r'[^A-Za-z0-9]','',base)[:12]
    else: return None   # partido sin codigo de 6 digitos -> se ignora (igual que el original)
    actions=[]
    scout=txt.split('[3SCOUT]')[-1]
    for l in scout.strip().splitlines():
        c=l.split(';'); code0=c[0]
        m=re.match(r'^%s(\d{2})([SRABDEF])'%re.escape(sidech),code0)
        if not m: continue
        num,sk=m.group(1),m.group(2)
        if num not in pmap: continue
        try: t=int(c[12])
        except: continue
        ev=code0[5] if len(code0)>5 else ''
        a={'t':t,'num':num,'name':pmap[num],'skill':sk,'sk':SK.get(sk,sk),'ev':ev,'set':c[8] if len(c)>8 else ''}
        if sk=='A':
            cb=code0[6:8]
            if cb and cb[0] in 'XVPC' and '~' not in cb: a['acomb']=cb
        actions.append(a)
    if ent: opp='Entrenamiento'
    return code,{'opponent':opp,'date':date,'side':side,'players':players,'actions':actions}

def load_existing(path, glob_name):
    if not os.path.isfile(path): return {}
    try:
        t=open(path,encoding='utf-8').read()
        m=re.search(r'window\.'+glob_name+r'\s*=\s*(\{.*\})\s*;?\s*$',t,re.S)
        if m: return (json.loads(m.group(1)).get('matches') or {})
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
    # MERGE: preservar lo existente tal cual, agregar solo lo nuevo
    agregados=0
    for code,m in nuevos.items():
        if code not in existentes:
            existentes[code]=m; agregados+=1
    data={'combos':COMBOS,'matches':existentes}
    with open(out,'w',encoding='utf-8') as f:
        f.write('window.'+glob_name+' = '+json.dumps(data,ensure_ascii=False)+';\n')
    tot=sum(len(m['actions']) for m in existentes.values())
    print('  '+out+': '+str(len(existentes))+' total ('+str(agregados)+' nuevos), '+str(tot)+' acciones con su segundo')

# © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados
