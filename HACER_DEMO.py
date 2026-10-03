# -*- coding: utf-8 -*-
# ============================================================================
#  HACER_DEMO.py — arma la demo publica de Volley-Stats
#  ---------------------------------------------------------------------------
#  QUE HACE
#
#  Genera, al lado de esta carpeta, una copia de la app preparada para que
#  cualquiera la use sin clave, sin romper nada y sin tocar los datos reales:
#
#      STATS VOLEY APP\
#      |- VOLLEY_NAFELS\        <- tu app. NO SE TOCA. Ni un archivo.
#      \- DEMO VOLLEY-STATS\    <- lo que genera esto. Se borra y se rehace.
#
#  COMO LOGRA QUE NO SE ROMPA NADA
#
#  1. Los datos se vuelven a cifrar con una llave DISTINTA (LLAVE_DEMO.txt).
#     La llave de la demo viaja publica dentro de demo_guard.js, y por eso no
#     puede ser la tuya: con la tuya, cualquiera abriria los datos reales de
#     Nafels bajandolos del sitio de verdad.
#
#  2. La app arranca en MODO SIN CONEXION. No es un invento: es el modo que ya
#     existe para scoutear en un gimnasio sin wifi. Si hay llave guardada y no
#     hay red, firebase.js entra directo, sin pantalla de ingreso, y no hace
#     una sola llamada a la base. Ahi esta todo resuelto de una: no hay login,
#     no se puede escribir en la base del club, y nadie ve el chat ni manda
#     notificaciones.
#
#  3. Por las dudas, demo_guard.js ademas bloquea a mano cualquier pedido a
#     Firebase o OneSignal que algun archivo haga por su cuenta.
#
#  Lo que el visitante toca (cargar un wellness, escribir una nota) se guarda
#  solo en SU navegador. No lo ve nadie mas y se borra al limpiar los datos.
#
#  USO
#      Doble clic en HACER_DEMO.bat   (o: python HACER_DEMO.py)
#      Despues: subir la carpeta DEMO VOLLEY-STATS a Vercel como proyecto nuevo
# ============================================================================
import os, re, sys, json, shutil, hashlib, base64, secrets, fnmatch

AQUI   = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

# ── EL RECORTE ──────────────────────────────────────────────────────────────
# Que se muestra y que no en la demo vive en DEMO_RECORTE.py, al lado de este
# archivo. Esta separado a proposito: es la parte que vas a querer tocar (un
# partido mas, una pantalla menos) sin meterte con el motor de la demo.
# Si falta, la demo se arma igual pero COMPLETA, y se avisa fuerte.
try:
    import DEMO_RECORTE as RECORTE
except Exception as _e:
    RECORTE = None
    _ERROR_RECORTE = str(_e)
DESTINO = os.path.join(os.path.dirname(AQUI), 'DEMO VOLLEY-STATS')

# ── QUE SE COPIA Y QUE NO ───────────────────────────────────────────────────
# Mismo criterio que .vercelignore, mas lo que una demo publica no necesita.
CARPETAS_FUERA = {
    '.git', '.github', '__pycache__', 'node_modules', '_respaldo',
    'claude outputs', 'placas', 'manos bloqueo', 'demo volley-stats',
}
ARCHIVOS_FUERA = [
    '*.py', '*.bat', '*.ps1', '*.dvw', '*.antes', '*.bak', '*.json.bak',
    '*.log', '*.pptx', '*.pdf', '*.xlsx', '*.sq', '*.md', '*.txt',
    'LLAVE*.txt', 'nla_players_db.json', 'nla_players_db.json.enc',
    'entrenamientos_nafels_db.json', 'entrenamientos_nafels_db.json.bak',
    'modelo_completo.html', 'diagnostico.txt', '_gen_nafels.b64',
    '.vercelignore', '.gitignore', '.gitattributes',
    'error consola.png', 'analisis superpuesto.png',
    # El calendario es del club: en una demo publica no va.
    # Las funciones de la puerta (api/demo-*.js y api/_demo_comun.js) SI van.
    'calendario.js',
]
# lo unico que se copia: extensiones que la app realmente sirve
EXT_OK = {'.html','.js','.css','.json','.enc','.png','.jpg','.jpeg','.gif',
          '.svg','.ico','.webp','.ttf','.woff','.woff2','.mp4','.webmanifest'}

# ── EL CIFRADO, IGUAL QUE EN descifrar_datos.py ─────────────────────────────
def flujo(llave_bytes, largo):
    salida, n = bytearray(), 0
    while len(salida) < largo:
        salida += hashlib.sha256(llave_bytes + n.to_bytes(8, 'big')).digest()
        n += 1
    return salida[:largo]

def clave_archivo(llave_hex, nombre, nonce=b''):
    ent = bytes.fromhex(llave_hex) + b'|' + nombre.encode('utf-8')
    if nonce:
        ent += b'|' + nonce
    return hashlib.sha256(ent).digest()

def descifrar(b64, llave_hex, nombre):
    """Abre los dos formatos.

    Los datos del club ahora se cifran con un numero al azar por archivo
    ("2:<hexa>:<base64>"). La demo los LEE para volver a cifrarlos con su
    propia llave, asi que tiene que entender ese formato o se queda sin datos.

    Lo que la demo ESCRIBE sigue en el formato de antes a proposito: su llave
    viaja publica dentro de demo_guard.js, asi que el numero al azar no
    agregaria nada, y asi no hay que tocar demo_guard.js ni las funciones de
    api/.
    """
    nonce = b''
    if b64.startswith('2:'):
        _, hx, b64 = b64.split(':', 2)
        nonce = bytes.fromhex(hx)
    mezcla = base64.b64decode(b64)
    k = clave_archivo(llave_hex, nombre, nonce)
    return bytes(a ^ b for a, b in zip(mezcla, flujo(k, len(mezcla)))).decode('utf-8')

def cifrar(texto, llave_hex, nombre):
    datos = texto.encode('utf-8')
    k = clave_archivo(llave_hex, nombre)
    return base64.b64encode(bytes(a ^ b for a, b in zip(datos, flujo(k, len(datos))))).decode('ascii')

# El .enc es un .js que define window.__D["archivo"]="<base64>";
RX_ENC = re.compile(r'^(.*?\["[^"]+"\]=")(.*)(";\s*)$', re.S)

def envoltura(texto_enc):
    m = RX_ENC.match(texto_enc)
    if not m:
        raise ValueError('formato .enc inesperado')
    return m.group(1), m.group(2), m.group(3)

# ── LAS LLAVES ──────────────────────────────────────────────────────────────
def llave(ruta, crear=False):
    if os.path.exists(ruta):
        t = open(ruta, encoding='utf-8').read().strip()
        if len(t) == 64:
            return t
        if not crear:
            return None
    if not crear:
        return None
    t = secrets.token_hex(32)
    open(ruta, 'w', encoding='utf-8').write(t)
    return t

# ── demo_guard.js ───────────────────────────────────────────────────────────
GUARD = r'''/* ============================================================================
   demo_guard.js — lo unico que separa la demo publica de la app real
   ----------------------------------------------------------------------------
   Lo genera HACER_DEMO.py. No se edita a mano: se pisa en cada corrida.

   Hace cuatro cosas, en este orden, antes que cualquier otro script:

     1. deja guardada la llave de la DEMO (no la del club) para que los datos
        se abran solos, sin pasar por la pantalla de ingreso
     2. finge que no hay conexion, que es como firebase.js entra sin pedir
        clave y sin tocar la base (el mismo camino del gimnasio sin wifi)
     3. corta de raiz cualquier pedido a Firebase, OneSignal o Google que
        algun archivo intente por su cuenta
     4. pone el cartel de DEMO

   Consecuencia: el visitante puede tocar todo. Lo que escriba queda en SU
   navegador y no sale de ahi.
   ============================================================================ */
(function(){
  var LLAVE = '@@LLAVE@@';

  /* 1 · la llave de la demo y el rol de cuerpo tecnico */
  try{
    localStorage.setItem('club_llave', LLAVE);
    localStorage.setItem('vb_role', 'coach');
  }catch(e){}

  /* 2 · sin conexion: firebase.js entra directo y no llama a la base */
  try{
    Object.defineProperty(navigator, 'onLine', {get:function(){ return false; }, configurable:true});
  }catch(e){}

  /* 3 · el corte de raiz. Lo de arriba deberia alcanzar; esto es por si
         algun archivo pide algo por su cuenta, sin pasar por firebase.js */
  var PROHIBIDO = /(firebaseio\.com|identitytoolkit|securetoken|onesignal|firebaseinstallations|googleapis\.com\/identitytoolkit)/i;
  function bloqueado(u){ try{ return PROHIBIDO.test(String(u)); }catch(e){ return false; } }

  var fetchReal = window.fetch;
  if(fetchReal){
    window.fetch = function(rec, opt){
      var u = (rec && rec.url) ? rec.url : rec;
      if(bloqueado(u)){
        return Promise.resolve(new Response('null', {status:200, headers:{'Content-Type':'application/json'}}));
      }
      return fetchReal.apply(this, arguments);
    };
  }
  var abrirReal = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u){
    this.__demoCortado = bloqueado(u);
    return abrirReal.apply(this, arguments);
  };
  var enviarReal = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(){
    if(this.__demoCortado) return;
    return enviarReal.apply(this, arguments);
  };
  if(window.EventSource){
    var ESReal = window.EventSource;
    window.EventSource = function(u, o){
      if(bloqueado(u)) return {close:function(){}, addEventListener:function(){}, onmessage:null, onerror:null};
      return new ESReal(u, o);
    };
  }
  /* el service worker de la app cachea para el gimnasio; en una demo que se
     rehace seguido eso deja pantallas viejas dando vueltas */
  try{
    if(navigator.serviceWorker){
      navigator.serviceWorker.register = function(){ return Promise.reject(new Error('demo')); };
      navigator.serviceWorker.getRegistrations().then(function(rs){
        rs.forEach(function(r){ r.unregister(); });
      }).catch(function(){});
    }
  }catch(e){}

  /* 4 · el cartel */
  function cartel(){
    if(document.getElementById('demo-cartel')) return;
    var d = document.createElement('div');
    d.id = 'demo-cartel';
    d.innerHTML =
      '<span class="dm-p">DEMO</span>' +
      '<span class="dm-t">Datos reales de la NLA · nada de lo que toques se guarda</span>' +
      '<a class="dm-a" href="https://volley-stats.com" target="_blank" rel="noopener">Quiero la de mi club</a>' +
      '<button class="dm-x" aria-label="Cerrar">&times;</button>';
    var s = document.createElement('style');
    s.textContent =
      '#demo-cartel{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147483000;' +
      'display:flex;align-items:center;gap:12px;max-width:calc(100vw - 24px);' +
      'background:rgba(10,12,22,.94);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);' +
      'border-radius:999px;padding:8px 10px 8px 12px;box-shadow:0 18px 44px -18px #000;' +
      "font-family:'Poppins',system-ui,sans-serif;font-size:12.5px;color:#E9ECF3}" +
      '#demo-cartel .dm-p{font-weight:800;letter-spacing:.14em;font-size:10px;color:#fff;' +
      'background:#E8192C;border-radius:999px;padding:4px 9px;flex:none}' +
      '#demo-cartel .dm-t{color:#9AA3B2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '#demo-cartel .dm-a{flex:none;font-weight:600;color:#fff;background:rgba(232,25,44,.18);' +
      'border:1px solid rgba(232,25,44,.45);border-radius:999px;padding:5px 12px;text-decoration:none}' +
      '#demo-cartel .dm-a:hover{background:#E8192C}' +
      '#demo-cartel .dm-x{flex:none;background:none;border:0;color:#6B7280;font-size:17px;' +
      'cursor:pointer;line-height:1;padding:0 4px}' +
      '@media(max-width:640px){#demo-cartel .dm-t{display:none}}';
    document.head.appendChild(s);
    document.body.appendChild(d);
    d.querySelector('.dm-x').onclick = function(){ d.remove(); };
  }
  /* 5 · el sello. No impide una captura —nada lo impide— pero toda captura
         sale con la fecha, la hora y un codigo de visita. Sirve para saber de
         donde salio una imagen que aparezca dando vueltas, y para que el que
         piense en llevarsela sepa que queda marcada. */
  function sello(){
    if(document.getElementById('demo-sello')) return;
    var cod = '';
    try{ cod = sessionStorage.getItem('demo_cod') || ''; }catch(e){}
    if(!cod){
      cod = Math.random().toString(36).slice(2, 6).toUpperCase();
      try{ sessionStorage.setItem('demo_cod', cod); }catch(e){}
    }
    var f = new Date(), dd = function(n){ return (n < 10 ? '0' : '') + n; };
    var cuando = dd(f.getDate()) + '/' + dd(f.getMonth() + 1) + '/' + f.getFullYear() +
                 ' ' + dd(f.getHours()) + ':' + dd(f.getMinutes());
    var d = document.createElement('div');
    d.id = 'demo-sello';
    d.textContent = 'DEMO · volley-stats.com · ' + cuando + ' · ' + cod;
    var s = document.createElement('style');
    s.textContent =
      '#demo-sello{position:fixed;left:10px;bottom:8px;z-index:2147482000;pointer-events:none;' +
      "font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.09em;" +
      'color:rgba(255,255,255,.26);text-shadow:0 1px 2px rgba(0,0,0,.8);user-select:none}' +
      '@media print{#demo-sello{color:#666;position:fixed}}' +
      '@media(max-width:560px){#demo-sello{font-size:8px;left:6px;bottom:4px}}';
    document.head.appendChild(s);
    document.body.appendChild(d);
  }

  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', function(){ cartel(); sello(); });
  else { cartel(); sello(); }
})();
'''

# ── el parche a firebase.js ─────────────────────────────────────────────────
# Se reemplaza _fbArrancar entera. Es la funcion que decide entre "entrar" y
# "pedir usuario y clave". En la demo entra siempre, en modo sin conexion.
FB_NUEVA = '''function _fbArrancar(){
  /* DEMO: la app no tiene con quien hablar. FB_OFF hace que fbGet lea del
     navegador y que fbSet y fbPush no salgan a ningun lado. No hay pantalla
     de ingreso porque nunca se llama a _fbPantalla. */
  if(_fbListo) return _fbListo;
  FB_OFF = true;
  FB_SES = null;
  _fbListo = Promise.resolve(true);
  return _fbListo;
}
_fbArrancar();'''

ONESIGNAL_NUEVA = '''/* DEMO: sin notificaciones. El original pide permiso al visitante y lo
   suscribe a los avisos del club, que no es lo que queres en una demo. */
window.OneSignal = window.OneSignal || [];
window.pushRegistrar = function(){};
window.pushEstado = function(){ return false; };
'''

SW_NUEVO = '''/* DEMO: sin cache. La demo se rehace seguido y el service worker del
   gimnasio dejaba pantallas viejas dando vueltas. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
'''

ROBOTS = '''# La demo no compite con volley-stats.com en Google.
User-agent: *
Disallow: /
'''

# ── UTILIDADES ──────────────────────────────────────────────────────────────
def recortada(nombre_archivo):
    """True si el recorte dice que este archivo no va a la demo."""
    if not RECORTE:
        return False
    base = nombre_archivo
    sin = base[:-4] if base.endswith('.enc') else base
    for patron in RECORTE.EXCLUIR:
        if fnmatch.fnmatch(base, patron) or fnmatch.fnmatch(sin, patron):
            return True
    return False


def descartada(nombre):
    n = nombre.lower()
    return any(fnmatch.fnmatch(n, p.lower()) for p in ARCHIVOS_FUERA)

def copiable(nombre):
    return os.path.splitext(nombre)[1].lower() in EXT_OK

RX_HEAD = re.compile(r'<head[^>]*>', re.I)

def poner_guardia(html, prefijo):
    """Mete los scripts de la demo como los PRIMEROS de la pagina.

    demo_guard.js  llave de la demo, corte de red, sello de visita
    demo_acceso.js la puerta: mail -> codigo por correo -> 5 dias
    demo_tope.js   tope de 100 codigos, marca de agua, nada se baja
    demo_tour.js   la visita guiada (se muestra sola en la portada)

    El orden importa: acceso antes que tope, porque el tope lee la fecha de
    vencimiento que deja la puerta (window.__DEMO_FIN).
    """
    if 'demo_guard.js' in html:
        return html, True
    m = RX_HEAD.search(html)
    if not m:
        return html, False
    ins = ''
    for f in ('demo_guard.js', 'demo_acceso.js', 'demo_tope.js', 'demo_tour.js'):
        ins += '\n  <script src="%s%s"></script>' % (prefijo, f)
    return html[:m.end()] + ins + html[m.end():], True


# ── EL TITULO DE LA PESTANA ─────────────────────────────────────────────────
# Todas las paginas de la app llevan el nombre del club en el <title>, que es
# lo que se lee en la pestana del navegador y lo que muestra Google. En la
# demo eso tiene que decir Volley-Stats: la demo es la cara del producto.
#
# Se cambia SOLO el primer <title> que aparece antes de <body>, que es el de
# verdad. Hay tres paginas (armadores, game_plan, jugador) que ademas escriben
# "<title>...</title>" dentro de JavaScript para las ventanitas de video: esos
# no se tocan, porque son codigo, no el titulo de la pagina.
TITULO_DEMO = 'Volley-Stats \u2014 Demo'
RX_TITULO = re.compile(r'<title\b[^>]*>.*?</title>', re.S | re.I)

def poner_titulo(html):
    """Devuelve (html, cambiado)."""
    corte = html.lower().find('<body')
    if corte < 0:
        corte = len(html)
    m = RX_TITULO.search(html)
    if not m or m.start() >= corte:
        return html, False
    return html[:m.start()] + '<title>' + TITULO_DEMO + '</title>' + html[m.end():], True


# ── LA MARCA DE LA DEMO ─────────────────────────────────────────────────────
# La demo vive en demo.volley-stats.com: es la cara del producto, no la del
# club. Por eso el icono de la pestana, el icono de instalacion y el escudo
# del encabezado tienen que ser los de Volley-Stats, aunque los datos que se
# muestren adentro sean los de Nafels.
#
# Los archivos salen de la carpeta de la web de venta, que es la unica fuente
# de la marca. No se copian a VOLLEY_NAFELS a proposito: ese repositorio es
# del club y no tiene por que llevar la marca del producto adentro.
MARCA = os.path.join(os.path.dirname(AQUI), 'WEB VOLLEY-STATS', 'marca', 'app')

MARCA_PARES = [
    ('icon-180.png',          'icon-180.png'),
    ('icon-192.png',          'icon-192.png'),
    ('icon-512.png',          'icon-512.png'),
    ('icon-maskable-512.png', 'icon-maskable-512.png'),
    ('escudo-volley-stats.png', 'escudo.png'),
]

MANIFIESTO_DEMO = {
    "name": "Volley-Stats — Demo",
    "short_name": "Volley-Stats",
    "description": "Demo publica de Volley-Stats: scouting en vivo, analisis y video para clubes de voley.",
    "lang": "es",
    "start_url": "./index.html",
    "scope": "./",
    "display": "standalone",
    "orientation": "any",
    "background_color": "#07080F",
    "theme_color": "#07080F",
    "icons": [
        {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ],
}

def poner_marca():
    """Cambia el escudo del club por el de Volley-Stats en la copia de la demo.

    Devuelve (cuantos, aviso). Si falta la carpeta de la marca no corta nada:
    avisa y sigue, porque una demo con el icono equivocado igual sirve y es
    peor quedarse sin demo.
    """
    if not os.path.isdir(MARCA):
        return 0, 'no encontre %s' % MARCA
    puestos, faltan = 0, []
    for origen, destino in MARCA_PARES:
        o = os.path.join(MARCA, origen)
        if not os.path.exists(o):
            faltan.append(origen); continue
        shutil.copy2(o, os.path.join(DESTINO, destino))
        puestos += 1
    mani = os.path.join(DESTINO, 'manifest.json')
    try:
        with open(mani, 'w', encoding='utf-8') as f:
            json.dump(MANIFIESTO_DEMO, f, ensure_ascii=False, indent=2)
        puestos += 1
    except Exception as e:
        faltan.append('manifest.json (%s)' % e)
    return puestos, ('faltan: ' + ', '.join(faltan)) if faltan else ''


def main():
    print('')
    print('  ' + '=' * 64)
    print('  HACER_DEMO — la demo publica de Volley-Stats')
    print('  ' + '=' * 64)
    print('')

    # ── las dos llaves ──────────────────────────────────────────────────────
    k_real = llave(os.path.join(AQUI, 'LLAVE.txt'))
    if not k_real:
        print('  No encuentro LLAVE.txt (o esta incompleta).')
        print('  Sin la llave del club no se pueden abrir los datos para copiarlos.')
        print('')
        input('  Enter para cerrar...')
        return 1
    ruta_demo = os.path.join(AQUI, 'LLAVE_DEMO.txt')
    nueva = not os.path.exists(ruta_demo)
    k_demo = llave(ruta_demo, crear=True)
    if k_demo == k_real:
        print('  LLAVE_DEMO.txt no puede ser igual a LLAVE.txt. Borrala y volve a correr.')
        input('  Enter para cerrar...')
        return 1
    print('  Llave del club   : ...%s  (se queda en tu PC)' % k_real[-6:])
    print('  Llave de la demo : ...%s  %s' % (k_demo[-6:], '(recien creada)' if nueva else ''))
    print('')

    # ── carpeta limpia ──────────────────────────────────────────────────────
    if os.path.exists(DESTINO):
        shutil.rmtree(DESTINO)
    os.makedirs(DESTINO)
    print('  Destino: %s' % DESTINO)
    print('')
    print('  Copiando la app...')

    copiados = recifrados = paginas = 0
    recortados = carteles = 0
    saltadas = []
    pesos = 0

    for raiz, dirs, archivos in os.walk(AQUI):
        _fuera = set(CARPETAS_FUERA)
        if RECORTE:
            _fuera |= set(x.lower() for x in RECORTE.CARPETAS_EXCLUIR)
        dirs[:] = [d for d in dirs
                   if d.lower() not in _fuera
                   and not d.lower().startswith('dvw ')
                   and not d.lower().startswith('_')]
        rel = os.path.relpath(raiz, AQUI)
        destino_dir = DESTINO if rel == '.' else os.path.join(DESTINO, rel)

        for a in archivos:
            if descartada(a) or not copiable(a):
                continue
            if recortada(a):
                recortados += 1
                continue
            os.makedirs(destino_dir, exist_ok=True)
            origen = os.path.join(raiz, a)
            salida = os.path.join(destino_dir, a)

            # 1 · los datos: se abren con la llave del club y se vuelven a
            #     cerrar con la de la demo. El original no se toca nunca.
            #
            #     OJO CON EL NOMBRE: cifrar_datos.py deriva la llave de cada
            #     archivo con su RUTA RELATIVA, no con su nombre suelto. Para
            #     los de la raiz da igual, pero los de temporadas/ se llaman
            #     'temporadas/2025-26/datos_equipo.js'. Usar el nombre pelado
            #     da una llave distinta y el archivo no abre.
            if a.endswith('.enc'):
                relativo = os.path.relpath(origen, AQUI).replace(os.sep, '/')
                nombre = relativo[:-4]
                try:
                    txt = open(origen, encoding='utf-8').read()
                    ini, b64, fin = envoltura(txt)
                    claro = descifrar(b64, k_real, nombre)
                    if RECORTE:
                        claro = RECORTE.podar(nombre, claro)
                        if claro is None:
                            recortados += 1
                            continue
                    open(salida, 'w', encoding='utf-8').write(
                        ini + cifrar(claro, k_demo, nombre) + fin)
                    recifrados += 1
                    pesos += os.path.getsize(salida)
                except Exception as e:
                    saltadas.append('%s  (%s)' % (relativo, e))
                continue

            # 2 · las paginas: se les agrega la guardia
            if a.lower().endswith('.html'):
                prof = os.path.relpath(AQUI, raiz).replace('\\', '/')
                prefijo = '' if prof == '.' else prof + '/'
                es_cartel = bool(RECORTE and a in RECORTE.CARTEL)
                if es_cartel:
                    # la pagina sigue existiendo: el que mira la demo tiene
                    # que VER que la funcion esta, no encontrarse un 404.
                    # Lleva la guardia como cualquier otra, asi la puerta de
                    # registro vale tambien aca y el control final no tiene
                    # que hacer excepciones.
                    html = RECORTE.pagina_cartel(a, prefijo)
                    carteles += 1
                else:
                    try:
                        html = open(origen, encoding='utf-8').read()
                    except Exception as e:
                        saltadas.append('%s  (%s)' % (a, e)); continue
                html, ok = poner_guardia(html, prefijo)
                if not ok:
                    saltadas.append('%s  (no encontre <head>)' % a); continue
                if not es_cartel:
                    html, _tit = poner_titulo(html)
                    # y los nombres: el plantel y los rivales estan escritos a
                    # mano en muchas paginas (titulos, encabezados, data-t).
                    # Se cambian aca, con la misma tabla que los datos, para
                    # que la pantalla y el dato digan lo mismo.
                    if RECORTE:
                        html = RECORTE.renombrar(html)
                open(salida, 'w', encoding='utf-8').write(html)
                paginas += 1
                pesos += os.path.getsize(salida)
                continue

            # 3 · el resto. Los de texto pasan por el recorte igual que los
            #     cifrados: ahi viven el plantel, el historial y el fixture.
            if RECORTE and a.lower().endswith(('.js', '.json')):
                try:
                    txt = open(origen, encoding='utf-8').read()
                    rel_j = os.path.relpath(origen, AQUI).replace(os.sep, '/')
                    txt = RECORTE.podar(rel_j, txt)
                    if txt is None:
                        recortados += 1
                        continue
                    open(salida, 'w', encoding='utf-8').write(txt)
                    copiados += 1
                    pesos += os.path.getsize(salida)
                    continue
                except Exception as e:
                    saltadas.append('%s  (recorte: %s)' % (a, e))
            shutil.copy2(origen, salida)
            copiados += 1
            pesos += os.path.getsize(salida)

    # ── los tres archivos que cambian de verdad ─────────────────────────────
    print('')
    print('  Preparando el modo demo...')

    open(os.path.join(DESTINO, 'demo_guard.js'), 'w', encoding='utf-8').write(
        GUARD.replace('@@LLAVE@@', k_demo))
    print('    demo_guard.js                     llave, corte de red y sello de visita')

    fb = os.path.join(DESTINO, 'firebase.js')
    if os.path.exists(fb):
        txt = open(fb, encoding='utf-8').read()
        ini = txt.find('function _fbArrancar(){')
        fin = txt.find('_fbArrancar();', ini)
        if ini < 0 or fin < 0:
            print('')
            print('  [PARE] No pude ubicar _fbArrancar en firebase.js.')
            print('  Cambio el archivo desde la ultima vez. Avisame y lo reviso:')
            print('  sin este parche la demo pide usuario y clave.')
            print('')
            input('  Enter para cerrar...')
            return 1
        txt = txt[:ini] + FB_NUEVA + txt[fin + len('_fbArrancar();'):]
        open(fb, 'w', encoding='utf-8').write(txt)
        print('    firebase.js                       entra sin clave, no toca la base')

    for nombre, contenido in (('onesignal_push.js', ONESIGNAL_NUEVA), ('sw.js', SW_NUEVO)):
        if os.path.exists(os.path.join(DESTINO, nombre)):
            open(os.path.join(DESTINO, nombre), 'w', encoding='utf-8').write(contenido)
            print('    %-34s%s' % (nombre, 'sin notificaciones' if 'one' in nombre else 'sin cache'))

    if RECORTE and getattr(RECORTE, 'TOUR', None):
        open(os.path.join(DESTINO, 'demo_tour.js'), 'w', encoding='utf-8').write(RECORTE.TOUR)
        print('    demo_tour.js                      la visita guiada de la portada')

    open(os.path.join(DESTINO, 'robots.txt'), 'w', encoding='utf-8').write(ROBOTS)

    if RECORTE is None:
        print('')
        print('  [PARE] No encontre DEMO_RECORTE.py (%s).' % _ERROR_RECORTE)
        print('  Sin ese archivo la demo sale COMPLETA: con el plantel real,')
        print('  el scouting de los rivales y el playbook del club adentro.')
        print('  Pone DEMO_RECORTE.py al lado de este archivo y volve a correr.')
        print('')
        input('  Enter para cerrar...')
        return 1

    puestos_marca, aviso_marca = poner_marca()
    if aviso_marca:
        print('    [OJO] marca de Volley-Stats: %s' % aviso_marca)
    if puestos_marca:
        print('    icono y escudo                    %d archivos: la demo lleva la marca Volley-Stats'
              % puestos_marca)

    # ── la puerta de registro ───────────────────────────────────────────────
    # demo_acceso.js y demo_tope.js se copian como cualquier .js. Aca solo se
    # avisa si falta alguno, porque sin ellos la demo queda abierta de par en
    # par y es mejor enterarse ahora que despues.
    faltan = [f for f in ('demo_acceso.js', 'demo_tope.js')
              if not os.path.exists(os.path.join(DESTINO, f))]
    if faltan:
        print('')
        print('  [OJO] Faltan en la demo: %s' % ', '.join(faltan))
        print('  Sin eso no hay registro ni tope: cualquiera escautea sin limite.')
    else:
        print('    demo_acceso.js                    mail, codigo por correo, 5 dias')
        print('    demo_tope.js                      tope de 100, marca de agua, no se baja nada')

    api_ok = [f for f in ('_demo_comun.js', 'demo-pedir.js', 'demo-validar.js')
              if os.path.exists(os.path.join(DESTINO, 'api', f))]
    print('    api/                              %d de 3 funciones' % len(api_ok))

    # ── que LLAVE_DEMO.txt no se publique con la app ────────────────────────
    # No es secreta (viaja dentro de demo_guard.js), pero es un archivo interno
    # y no tiene por que estar colgado del sitio de Nafels ni en el repo.
    for ign in ('.gitignore', '.vercelignore'):
        ruta = os.path.join(AQUI, ign)
        if not os.path.exists(ruta):
            continue
        try:
            txt = open(ruta, encoding='utf-8').read()
            if 'LLAVE_DEMO.txt' in txt:
                continue
            if not txt.endswith('\n'):
                txt += '\n'
            txt += '\n# La llave de la demo publica (la crea HACER_DEMO.py)\nLLAVE_DEMO.txt\n'
            open(ruta, 'w', encoding='utf-8').write(txt)
            print('    %-34sle agregue LLAVE_DEMO.txt' % ign)
        except Exception:
            pass

    # ── control final: que no se haya colado nada ────────────────────────────
    print('')
    print('  Revisando antes de darlo por bueno...')
    problemas = []

    for mal in ('LLAVE.txt', 'LLAVE_DEMO.txt'):
        if os.path.exists(os.path.join(DESTINO, mal)):
            problemas.append('se colo %s en la demo' % mal)

    sin_guardia = []
    for raiz, dirs, archivos in os.walk(DESTINO):
        for a in archivos:
            if a.lower().endswith('.html'):
                try:
                    if 'demo_guard.js' not in open(os.path.join(raiz, a), encoding='utf-8').read():
                        sin_guardia.append(a)
                except Exception:
                    pass
    if sin_guardia:
        problemas.append('%d pagina(s) sin la guardia: %s'
                         % (len(sin_guardia), ', '.join(sin_guardia[:5])))

    # que la llave del club no aparezca en NINGUN archivo de texto de la demo
    for raiz, dirs, archivos in os.walk(DESTINO):
        for a in archivos:
            if os.path.splitext(a)[1].lower() not in ('.js', '.html', '.json', '.txt', '.enc'):
                continue
            try:
                if k_real in open(os.path.join(raiz, a), encoding='utf-8', errors='ignore').read():
                    problemas.append('la llave del club aparece en %s' % a)
            except Exception:
                pass

    # que un .enc de la demo NO se pueda abrir con la llave del club
    muestra = None
    for raiz, dirs, archivos in os.walk(DESTINO):
        for a in archivos:
            if a.endswith('.enc') and os.path.getsize(os.path.join(raiz, a)) > 400:
                muestra = os.path.join(raiz, a); break
        if muestra: break
    if muestra:
        nombre = os.path.relpath(muestra, DESTINO).replace(os.sep, '/')[:-4]
        txt = open(muestra, encoding='utf-8').read()
        _, b64, _ = envoltura(txt)
        try:
            descifrar(b64, k_real, nombre)
            problemas.append('los datos de la demo se abren con la llave del club')
        except Exception:
            pass                      # perfecto: con la llave del club no abre
        try:
            descifrar(b64, k_demo, nombre)
        except Exception:
            problemas.append('los datos de la demo NO se abren con la llave de la demo')

    if saltadas:
        problemas.append('%d archivo(s) de datos no se pudieron abrir' % len(saltadas))

    print('')
    print('  ' + '-' * 64)
    if problemas:
        print('  HAY PROBLEMAS. No subas esto todavia:')
        for p in problemas:
            print('    - %s' % p)
    else:
        print('  Todo en orden.')
    print('  ' + '-' * 64)
    print('')
    print('    paginas preparadas   %d  (%d son cartel)' % (paginas, carteles))
    print('    archivos recortados  %d  (no viajan a la demo)' % recortados)
    for _av in (getattr(RECORTE, 'AVISOS', None) or []):
        print('    [OJO] %s' % _av)
    print('    datos recifrados     %d' % recifrados)
    print('    otros archivos       %d' % copiados)
    print('    peso total           %.1f MB' % (pesos / 1048576.0))
    if saltadas:
        print('')
        print('    [ATENCION] no pude con %d archivo(s). Esas pantallas van a' % len(saltadas))
        print('    quedar vacias en la demo. Pasame esta lista:')
        for s in saltadas[:10]:
            print('      %s' % s)
    print('')
    # ── QUE HACER AHORA ────────────────────────────────────────────────────
    #  Ojo con el orden. Desde que la demo lleva puerta de registro, subirla
    #  sin la cuenta de correo y sin las reglas de Firebase la deja INUTIL: al
    #  visitante le pide el mail y despues le vuelve un error al pedir el
    #  codigo. Es peor que la demo abierta de antes.
    print('  ANTES DE SUBIRLA — esto va una sola vez, y es obligatorio:')
    print('')
    print('    La demo ahora tiene puerta: pide mail y manda un codigo. Si')
    print('    subis sin preparar el servidor, el visitante queda trabado')
    print('    afuera. Los pasos estan en LEEME_DEMO_REGISTRO.txt:')
    print('')
    print('      1. Firebase -> Realtime Database -> Reglas')
    print('         pegar FIREBASE_REGLAS_NAFELS.json      (sin esto no anda)')
    print('      2. Vercel, proyecto volley-stats-demo -> Settings ->')
    print('         Environment Variables:  DEMO_SECRET  y  DEMO_MODO_PRUEBA=1')
    print('      3. Cuando quieras que el codigo salga por mail de verdad:')
    print('         cuenta en resend.com, cargar RESEND_API_KEY, MAIL_FROM y')
    print('         MAIL_AVISO, y SACAR DEMO_MODO_PRUEBA.')
    print('')
    print('    Con DEMO_MODO_PRUEBA=1 el codigo no se manda: aparece en la')
    print('    pantalla. Sirve para probar el circuito entero sin gastar nada.')
    print('')
    print('  PARA SUBIRLA:')
    print('    Doble clic en  PUBLICAR_DEMO.bat')
    print('    (esta en STATS VOLEY APP, al lado de las carpetas)')
    print('')
    print('    Va derecho al proyecto volley-stats-demo que ya existe: no crea')
    print('    proyectos nuevos y no hay que tocar el dominio. La primera vez')
    print('    se enlaza solo y despues no pregunta mas nada.')
    print('')
    input('  Enter para cerrar...')
    return 0


if __name__ == '__main__':
    sys.exit(main())
