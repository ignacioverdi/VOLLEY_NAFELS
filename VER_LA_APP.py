# -*- coding: utf-8 -*-
# ============================================================================
#  VER_LA_APP.py — ver la app de esta carpeta, sin publicar nada
#  ---------------------------------------------------------------------------
#  PARA QUE SIRVE
#
#  Para mirar los cambios ANTES de subirlos. Levanta la app desde esta misma
#  carpeta y te la abre en el navegador. Lo que ves es exactamente lo que hay
#  en tu disco, no lo que esta publicado en nafels.volley-stats.com.
#
#  POR QUE NO ALCANZA CON ABRIR index.html HACIENDO DOBLE CLIC
#
#  Varias pantallas piden archivos con fetch() (la tabla de la liga, el
#  historial, el chat). Abriendo el archivo directo, el navegador bloquea esos
#  pedidos por seguridad y esas pantallas quedan vacias. Hace falta servirla,
#  que es lo que hace esto.
#
#  DOS COSAS QUE RESUELVE SOLO
#
#  1. Manda todo con "no guardar en cache". Asi el navegador no te muestra la
#     version de ayer: siempre ves lo que acabas de cambiar.
#  2. La app trae un service worker (sw.js) que guarda las pantallas para poder
#     usarlas en un gimnasio sin wifi. Buenisimo en el gimnasio, pesimo para
#     probar: te deja viendo pantallas viejas. Mientras dura esta vista previa,
#     se sirve un sw.js vacio que ademas limpia lo que habia guardado.
#
#  POR QUE NO PIDE USUARIO Y CLAVE
#
#  La clave de Firebase solo acepta pedidos desde nafels.volley-stats.com.
#  Desde 127.0.0.1 los rechaza, asi que por ahi no se puede entrar.
#
#  Se entra por el camino que la app YA tiene: el modo sin conexion, el mismo
#  que se usa para scoutear en un gimnasio sin wifi. Si hay llave guardada y
#  no hay red, firebase.js entra directo, sin pantalla de ingreso y sin tocar
#  la base del club. Esta vista previa le deja esa llave al navegador (sale de
#  tu LLAVE.txt, no se mueve de esta computadora) y le dice que no hay red.
#
#  CONSECUENCIA IMPORTANTE
#  Lo que toques aca NO se guarda en la base del club: queda solo en este
#  navegador. Es para MIRAR, no para cargar datos.
#
#  Solo escucha en esta computadora (127.0.0.1). No sale a la red.
#
#  COMO SE USA
#      Doble clic en VER_LA_APP.bat
#      Para apagarlo: cerra la ventana negra, o Ctrl+C
#
#  La primera vez te pide usuario y clave: para el navegador 127.0.0.1 es un
#  sitio distinto de nafels.volley-stats.com y no tiene tu sesion guardada.
# ============================================================================
import os, re, sys, socket, threading, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

AQUI = os.path.dirname(os.path.abspath(__file__))
PUERTO_BASE = 8777

SW_VACIO = (
    b"/* vista previa: sin cache */\n"
    b"self.addEventListener('install', function(){ self.skipWaiting(); });\n"
    b"self.addEventListener('activate', function(e){\n"
    b"  e.waitUntil(caches.keys().then(function(k){\n"
    b"    return Promise.all(k.map(function(x){ return caches.delete(x); }));\n"
    b"  }).then(function(){ return self.clients.claim(); }));\n"
    b"});\n"
)


def leer_llave():
    """La llave del club, para entrar sin pasar por Firebase.
       Se lee aca y se le entrega al navegador de ESTA computadora. Nada mas."""
    for nombre in ('LLAVE.txt',):
        ruta = os.path.join(AQUI, nombre)
        if os.path.exists(ruta):
            try:
                t = open(ruta, encoding='utf-8').read().strip()
                if len(t) == 64:
                    return t
            except Exception:
                pass
    return None


LLAVE = leer_llave()

VISTA = """<script>
/* vista previa local — lo inyecta VER_LA_APP.py, no existe en la app */
(function(){
  try{
    localStorage.setItem('club_llave', '@@LLAVE@@');
    localStorage.setItem('vb_role', 'coach');
  }catch(e){}
  /* sin red: firebase.js entra directo y no toca la base del club */
  try{ Object.defineProperty(navigator,'onLine',{get:function(){return false;},configurable:true}); }catch(e){}
  var CORTE = /(firebaseio\.com|identitytoolkit|securetoken|onesignal|firebaseinstallations)/i;
  var f = window.fetch;
  if(f){ window.fetch = function(r,o){
    var u = (r && r.url) ? r.url : r;
    if(CORTE.test(String(u))) return Promise.resolve(new Response('null',{status:200,headers:{'Content-Type':'application/json'}}));
    return f.apply(this, arguments); }; }
  var ab = XMLHttpRequest.prototype.open, en = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(m,u){ this.__corte = CORTE.test(String(u)); return ab.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function(){ if(this.__corte) return; return en.apply(this, arguments); };
  try{ if(navigator.serviceWorker){ navigator.serviceWorker.register = function(){ return Promise.reject(new Error('vista previa')); }; } }catch(e){}

  function cartel(){
    if(document.getElementById('vp-cartel')) return;
    var d = document.createElement('div');
    d.id = 'vp-cartel';
    d.innerHTML = '<b>VISTA PREVIA</b><span>tu carpeta, sin publicar \u00b7 nada de lo que toques se guarda</span>' +
                  '<button aria-label="Cerrar">&times;</button>';
    var s = document.createElement('style');
    s.textContent = '#vp-cartel{position:fixed;right:10px;top:8px;z-index:2147483000;' +
      'display:flex;align-items:center;gap:10px;max-width:calc(100vw - 20px);padding:7px 9px 7px 11px;' +
      'background:rgba(8,10,18,.93);border:1px solid rgba(255,255,255,.14);border-radius:999px;' +
      "font-family:'Barlow Condensed',system-ui,sans-serif;font-size:12.5px;color:#E9ECF3;" +
      'box-shadow:0 14px 36px -14px #000}' +
      '#vp-cartel b{background:#E8192C;color:#fff;border-radius:999px;padding:3px 9px;font-size:10px;letter-spacing:.14em}' +
      '#vp-cartel span{color:#959DAC;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '#vp-cartel button{background:none;border:0;color:#6B7280;font-size:16px;cursor:pointer;line-height:1;padding:0 3px}' +
      '@media(max-width:620px){#vp-cartel span{display:none}}';
    document.head.appendChild(s); document.body.appendChild(d);
    d.querySelector('button').onclick = function(){ d.remove(); };
    d.style.transition = 'opacity .6s ease';
    setTimeout(function(){ if(d.parentNode) d.style.opacity = '.22'; }, 5000);
    d.onmouseenter = function(){ d.style.opacity = '1'; };
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cartel);
  else cartel();
})();
</script>"""

RX_HEAD = re.compile(rb'<head[^>]*>', re.I)

# ── LA BARRA NUEVA, SOLO EN LA VISTA PREVIA ────────────────────────────────
# nav.js existe en la carpeta pero NINGUNA pantalla lo llama: ni un archivo
# tuyo fue modificado. La vista previa se lo agrega al vuelo, en memoria, para
# que puedas probarla. Si cerras esta ventana, no queda rastro.
# Las de tiempo real no la llevan: ahi la barra estorba.
SIN_BARRA = {'panel_vivo.html', 'panel_voley.html', 'velocidades_vivo.html',
             'pantalla_delay.html', 'prueba_delay.html', 'camara.html',
             'pizarron.html', 'modelo_completo.html', 'revisar.html'}
BARRA = b'<script src="nav.js" defer></script>'


class Manejador(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=AQUI, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def _html_con_vista(self):
        """Devuelve los bytes de la pagina con el script de la vista previa
           metido como el PRIMERO del <head>, o None si no corresponde."""
        if not LLAVE:
            return None
        ruta = self.translate_path(self.path)
        if os.path.isdir(ruta):
            ruta = os.path.join(ruta, 'index.html')
        if not ruta.lower().endswith('.html') or not os.path.isfile(ruta):
            return None
        try:
            crudo = open(ruta, 'rb').read()
        except Exception:
            return None
        m = RX_HEAD.search(crudo)
        if not m:
            return None
        trozo = VISTA.replace('@@LLAVE@@', LLAVE).encode('utf-8')
        extra = b''
        hay_barra = os.path.exists(os.path.join(AQUI, 'nav.js'))
        if hay_barra and os.path.basename(ruta).lower() not in SIN_BARRA and b'nav.js' not in crudo:
            extra = b'\n' + BARRA
        return crudo[:m.end()] + b'\n' + trozo + extra + crudo[m.end():]

    def do_GET(self):
        cuerpo = self._html_con_vista()
        if cuerpo is not None:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(cuerpo)))
            self.end_headers()
            self.wfile.write(cuerpo)
            return
        if self.path.split('?')[0].lower() in ('/sw.js', '/onesignalsdkworker.js'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
            self.send_header('Content-Length', str(len(SW_VACIO)))
            self.end_headers()
            self.wfile.write(SW_VACIO)
            return
        return super().do_GET()

    def log_message(self, *a):
        pass          # sin el chorro de lineas por cada archivo


def puerto_libre(desde):
    for p in range(desde, desde + 25):
        s = socket.socket()
        try:
            s.bind(('127.0.0.1', p))
            s.close()
            return p
        except OSError:
            s.close()
    return None


def main():
    if not os.path.exists(os.path.join(AQUI, 'index.html')):
        print('\n   No encuentro index.html en esta carpeta. Poneme al lado de la app.\n')
        return 1

    puerto = puerto_libre(PUERTO_BASE)
    if not puerto:
        print('\n   No pude encontrar un puerto libre. Cerra otras ventanas negras y proba de nuevo.\n')
        return 1

    url = 'http://127.0.0.1:%d/index.html' % puerto

    print()
    print('  ' + '=' * 64)
    print('     VISTA PREVIA DE LA APP  —  lo que hay en ESTA carpeta')
    print('  ' + '=' * 64)
    print()
    print('     %s' % url)
    print()
    print('     Esto NO es nafels.volley-stats.com. Es tu disco, ahora mismo.')
    print('     Sin cache y sin service worker: ves los cambios al toque.')
    print()
    if LLAVE:
        print('     Entra sola, sin usuario ni clave: usa el modo sin conexion')
        print('     que la app ya tiene para el gimnasio.')
        print()
        print('     OJO 1: lo que toques aca NO se guarda en la base del club.')
        print('             Es para MIRAR. Para cargar datos, la app de siempre.')
        print()
        print('     OJO 2: lo que vive en la base del club (calendario, wellness,')
        print('             notas, chat) va a salir VACIO, porque no hay conexion.')
        print('             Las estadisticas estan todas: esas viven en los archivos.')
    else:
        print('     [aviso] No encontre LLAVE.txt, asi que te va a pedir clave,')
        print('     y Firebase la va a rechazar desde 127.0.0.1. Avisame.')
    print()
    if os.path.exists(os.path.join(AQUI, 'nav.js')):
        print('     NOVEDAD: estas viendo la BARRA DE NAVEGACION nueva.')
        print('     Arriba de todo, las 45 pantallas en 8 grupos. Apreta / para buscar.')
        print('     No se instalo nada: la barra se agrega al vuelo, solo aca.')
        print()
    print('     Para apagarlo: cerra esta ventana, o Ctrl+C')
    print('  ' + '-' * 64)
    print()

    threading.Timer(1.2, lambda: webbrowser.open(url)).start()

    srv = ThreadingHTTPServer(('127.0.0.1', puerto), Manejador)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('\n   Listo, apagado.\n')
    finally:
        srv.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
