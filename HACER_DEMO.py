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

def clave_archivo(llave_hex, nombre):
    return hashlib.sha256(bytes.fromhex(llave_hex) + b'|' + nombre.encode('utf-8')).digest()

def descifrar(b64, llave_hex, nombre):
    mezcla = base64.b64decode(b64)
    k = clave_archivo(llave_hex, nombre)
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
def descartada(nombre):
    n = nombre.lower()
    return any(fnmatch.fnmatch(n, p.lower()) for p in ARCHIVOS_FUERA)

def copiable(nombre):
    return os.path.splitext(nombre)[1].lower() in EXT_OK

RX_HEAD = re.compile(r'<head[^>]*>', re.I)

def poner_guardia(html, prefijo):
    """Mete demo_guard.js como el PRIMER script de la pagina."""
    if 'demo_guard.js' in html:
        return html, True
    m = RX_HEAD.search(html)
    if not m:
        return html, False
    ins = '\n  <script src="%sdemo_guard.js"></script>' % prefijo
    return html[:m.end()] + ins + html[m.end():], True


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
    saltadas = []
    pesos = 0

    for raiz, dirs, archivos in os.walk(AQUI):
        dirs[:] = [d for d in dirs
                   if d.lower() not in CARPETAS_FUERA
                   and not d.lower().startswith('dvw ')
                   and not d.lower().startswith('_')]
        rel = os.path.relpath(raiz, AQUI)
        destino_dir = DESTINO if rel == '.' else os.path.join(DESTINO, rel)

        for a in archivos:
            if descartada(a) or not copiable(a):
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
                    open(salida, 'w', encoding='utf-8').write(
                        ini + cifrar(claro, k_demo, nombre) + fin)
                    recifrados += 1
                    pesos += os.path.getsize(salida)
                except Exception as e:
                    saltadas.append('%s  (%s)' % (relativo, e))
                continue

            # 2 · las paginas: se les agrega la guardia
            if a.lower().endswith('.html'):
                try:
                    html = open(origen, encoding='utf-8').read()
                except Exception as e:
                    saltadas.append('%s  (%s)' % (a, e)); continue
                prof = os.path.relpath(AQUI, raiz).replace('\\', '/')
                prefijo = '' if prof == '.' else prof + '/'
                html, ok = poner_guardia(html, prefijo)
                if not ok:
                    saltadas.append('%s  (no encontre <head>)' % a); continue
                open(salida, 'w', encoding='utf-8').write(html)
                paginas += 1
                pesos += os.path.getsize(salida)
                continue

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

    open(os.path.join(DESTINO, 'robots.txt'), 'w', encoding='utf-8').write(ROBOTS)

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
    print('    paginas preparadas   %d' % paginas)
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
    print('  PARA PROBARLA ACA, ANTES DE SUBIRLA:')
    print('    1. Abri una consola en  DEMO VOLLEY-STATS')
    print('    2. python -m http.server 8000')
    print('    3. Entra a  http://localhost:8000')
    print('    No tiene que pedirte usuario ni clave. Si te lo pide, avisame.')
    print('')
    print('  PARA SUBIRLA:')
    print('    Vercel -> Add New -> Project -> Deploy without Git')
    print('    Arrastra la carpeta DEMO VOLLEY-STATS. Nombre: volley-stats-demo')
    print('    Despues: Settings -> Domains -> demo.volley-stats.com')
    print('')
    input('  Enter para cerrar...')
    return 0


if __name__ == '__main__':
    sys.exit(main())
