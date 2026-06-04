#!/usr/bin/env python3
"""
build_videos.py — Convierte el Excel de videos en videos.js para el game plan.

Uso:
    python3 build_videos.py videos_casla.xlsx
    python3 build_videos.py videos_nafels.xlsx

Genera videos.js (subir al repo junto al game_plan.html).
El game plan lo lee y enciende el botón 🎬 de cada combo que tenga video.
"""
import sys, json, re
from openpyxl import load_workbook

def yt_normalize(url):
    """Normaliza distintos formatos de YouTube a un embed-friendly URL."""
    url = (url or '').strip()
    if not url: return ''
    # Aceptar youtu.be, watch?v=, embed, o cualquier link http
    return url

def build(xlsx_path):
    wb = load_workbook(xlsx_path, data_only=True)
    # Estructura: videos[slug_equipo][num][tipo][combo] = url
    videos = {}
    count = 0
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        rows = list(ws.iter_rows(min_row=2, values_only=True))
        for r in rows:
            if not r or len(r) < 6: continue
            equipo, num, jugador, tipo, combo, url = r[0], r[1], r[2], r[3], r[4], r[5]
            if not url or not str(url).strip(): continue
            if not equipo or num is None or not combo: continue
            slug = str(equipo).lower().replace(' ', '_')
            num = str(int(num)) if isinstance(num,(int,float)) else str(num).strip()
            tipo = str(tipo).strip().lower()
            combo = str(combo).strip().upper()
            url = yt_normalize(str(url))
            videos.setdefault(slug, {}).setdefault(num, {}).setdefault(tipo, {})[combo] = url
            count += 1
    
    js = 'window.VIDEOS_DATA = ' + json.dumps(videos, ensure_ascii=False) + ';\n'
    with open('videos.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print(f"✓ videos.js generado: {count} videos cargados")
    for slug, players in videos.items():
        n = sum(len(c) for p in players.values() for c in p.values())
        print(f"   {slug}: {n} videos")
    return count

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python3 build_videos.py videos_casla.xlsx")
        sys.exit(1)
    build(sys.argv[1])
