// NÄFELS VOLEY — Firebase Sync Helper
// Base de datos propia de NÄFELS (creada 14/06/2026)
var FB_URL = 'https://nafels-voley-default-rtdb.firebaseio.com';

function fbKey(path){
  return 'fb_' + path.replace(/[^a-zA-Z0-9]/g, '_');
}

// ── PERMISOS DE EDICIÓN POR ROL ───────────────────────────────
// El JUGADOR (vb_role='player') no puede modificar contenido del staff.
// El staff — entrenador ('coach'), asistente ('at') y preparador físico ('pf') —
// y quien no inició sesión, SÍ pueden editar (misma convención que el resto de la app).
// El JUGADOR (vb_role='player') SOLO puede modificar sus propios datos:
// pesos, RM, historial de pesos, wellness y sus comentarios de preparación física.
// TODO lo demás (calendario, horarios, rutinas, notas del staff, juegos, etc.) queda bloqueado.
var VB_PLAYER_PATHS = ['wellness','pesos','rm','prep_hist','notas','obs'];
function vbEsJugador(){
  try{ return (localStorage.getItem('vb_role')||'').toLowerCase() === 'player'; }catch(e){ return false; }
}
function vbEdicionBloqueada(path){
  if(!vbEsJugador()) return false;                  // staff o sin login → puede editar todo
  var p = String(path||'');
  for(var i=0;i<VB_PLAYER_PATHS.length;i++){
    var s = VB_PLAYER_PATHS[i];
    if(p === s || p.indexOf(s + '/') === 0) return false;  // dato propio del jugador → permitido
  }
  return true;                                      // cualquier otra cosa → bloqueada para el jugador
}

function fbSet(path, value){
  if(vbEdicionBloqueada(path)){ try{ console.warn('[permisos] escritura bloqueada para jugador:', path); }catch(e){} return; }
  try{ localStorage.setItem(fbKey(path), JSON.stringify(value)); }catch(e){}
  fetch(FB_URL + '/' + path + '.json', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(value)
  }).catch(function(){});
}

function fbGet(path, callback){
  fetch(FB_URL + '/' + path + '.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data !== null && data !== undefined){
        try{ localStorage.setItem(fbKey(path), JSON.stringify(data)); }catch(e){}
        callback(data);
      } else {
        var local = localStorage.getItem(fbKey(path));
        callback(local ? JSON.parse(local) : null);
      }
    })
    .catch(function(){
      var local = localStorage.getItem(fbKey(path));
      callback(local ? JSON.parse(local) : null);
    });
}

function fbPush(path, value){
  if(vbEdicionBloqueada(path)){ try{ console.warn('[permisos] escritura bloqueada para jugador:', path); }catch(e){} return; }
  try{
    var arr = JSON.parse(localStorage.getItem(fbKey(path)) || '[]');
    arr.push(value);
    localStorage.setItem(fbKey(path), JSON.stringify(arr));
  }catch(e){}
  fetch(FB_URL + '/' + path + '.json', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(value)
  }).catch(function(){});
}

/* © 2025-2026 Ignacio Verdi · NAFELS VOLEY · Software propietario - Todos los derechos reservados */

// ── CAPA VISUAL DE PERMISOS (jugador = solo lectura) ──────────
// Se ejecuta en todas las páginas que cargan firebase.js.
// Editores = staff (coach / at / pf) y quien no inició sesión. Jugador = solo lectura.
(function(){
  function esEditor(){
    try{ return (localStorage.getItem('vb_role')||'').toLowerCase() !== 'player'; }catch(e){ return true; }
  }
  window.VB_esEditor = esEditor;
  // Oculta/deshabilita todo lo marcado como solo-editor y muestra un chip de "solo lectura"
  window.VB_aplicarPermisos = function(root){
    if(esEditor()) return;
    root = root || document;
    try{
      var sel = root.querySelectorAll('[data-solo-editor], .solo-editor');
      for(var i=0;i<sel.length;i++){ sel[i].style.display='none'; try{ sel[i].setAttribute('disabled','disabled'); }catch(e){} }
    }catch(e){}
  };
  function chip(){
    if(esEditor()) return;
    // no duplicar si la página ya muestra el cartel de jugador (index)
    if(document.getElementById('vb-readonly-chip') || document.getElementById('vbSalirJug')) return;
    try{
      var c=document.createElement('div');
      c.id='vb-readonly-chip'; c.textContent='🔒 Jugador · solo lectura';
      c.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99999;background:rgba(15,23,42,.92);color:#e2e8f0;border:1px solid rgba(148,163,184,.35);border-radius:999px;padding:6px 12px;font-family:system-ui,Arial,sans-serif;font-size:12px;letter-spacing:.3px;box-shadow:0 4px 14px rgba(0,0,0,.35);pointer-events:none;';
      document.body.appendChild(c);
    }catch(e){}
  }
  function init(){ window.VB_aplicarPermisos(document); chip(); }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
