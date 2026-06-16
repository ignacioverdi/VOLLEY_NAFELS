// NÄFELS VOLEY — Firebase Sync Helper
// Base de datos propia de NÄFELS (creada 14/06/2026)
var FB_URL = 'https://nafels-voley-default-rtdb.firebaseio.com';

function fbKey(path){
  return 'fb_' + path.replace(/[^a-zA-Z0-9]/g, '_');
}

function fbSet(path, value){
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
