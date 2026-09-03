/* ============================================================================
   datos_seguros.js — abre los datos del club
   ----------------------------------------------------------------------------
   Los archivos de datos estan cifrados en el servidor. La llave vive en
   Firebase y solo la recibe quien inicio sesion. Este archivo:
     1) busca la llave (guardada en el dispositivo, o pidiendosela a Firebase)
     2) descifra los datos y los deja disponibles como siempre
   Para el resto de la app no cambia nada: window.PP_DATA, window.LIGA_DATA,
   etc. quedan igual que antes.
   ============================================================================ */
(function(){
  var GUARDADA = 'club_llave';

  function llaveLocal(){
    try{ return localStorage.getItem(GUARDADA) || ''; }catch(e){ return ''; }
  }

  /* SHA-256 sincronico y compacto (el mismo que usa el cifrador en Python) */
  function sha256(bytes){
    var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
           0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
           0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
           0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
           0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
           0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
           0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
           0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var l=bytes.length, bitLen=l*8;
    var t=new Uint8Array((((l+9)+63)>>6)<<6);
    t.set(bytes); t[l]=0x80;
    var dv=new DataView(t.buffer);
    dv.setUint32(t.length-4, bitLen>>>0, false);
    dv.setUint32(t.length-8, Math.floor(bitLen/4294967296), false);
    var w=new Int32Array(64);
    function rr(x,n){ return (x>>>n)|(x<<(32-n)); }
    for(var i=0;i<t.length;i+=64){
      for(var j=0;j<16;j++) w[j]=dv.getUint32(i+j*4,false);
      for(j=16;j<64;j++){
        var s0=rr(w[j-15],7)^rr(w[j-15],18)^(w[j-15]>>>3);
        var s1=rr(w[j-2],17)^rr(w[j-2],19)^(w[j-2]>>>10);
        w[j]=(w[j-16]+s0+w[j-7]+s1)|0;
      }
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for(j=0;j<64;j++){
        var S1=rr(e,6)^rr(e,11)^rr(e,25), ch=(e&f)^(~e&g);
        var t1=(h+S1+ch+K[j]+w[j])|0;
        var S0=rr(a,2)^rr(a,13)^rr(a,22), mj=(a&b)^(a&c)^(b&c);
        var t2=(S0+mj)|0;
        h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      H[0]=(H[0]+a)|0; H[1]=(H[1]+b)|0; H[2]=(H[2]+c)|0; H[3]=(H[3]+d)|0;
      H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
    }
    var out=new Uint8Array(32), o=new DataView(out.buffer);
    for(i=0;i<8;i++) o.setUint32(i*4, H[i]>>>0, false);
    return out;
  }

  function hexABytes(h){
    var a=new Uint8Array(h.length/2);
    for(var i=0;i<a.length;i++) a[i]=parseInt(h.substr(i*2,2),16);
    return a;
  }
  function contador(n){
    var b=new Uint8Array(8);
    for(var i=7;i>=0;i--){ b[i]=n & 255; n=Math.floor(n/256); }
    return b;
  }
  /* la llave propia de cada archivo (igual que en Python) */
  function claveArchivo(llaveHex, nombre){
    var k=hexABytes(llaveHex);
    var n=[]; var enc=unescape(encodeURIComponent(nombre));
    for(var i=0;i<enc.length;i++) n.push(enc.charCodeAt(i));
    var ent=new Uint8Array(k.length+1+n.length);
    ent.set(k); ent[k.length]=124; ent.set(n, k.length+1);   /* 124 = | */
    return sha256(ent);
  }

  /* ── DESCIFRAR ─────────────────────────────────────────────────────────
     El resultado es EXACTAMENTE el mismo que antes: mismo algoritmo, mismo
     orden, mismos bytes. Lo unico que cambia es como se reparte el trabajo.

     Antes: todo de un tiron. Con un archivo grande, el navegador quedaba
     ocupado varios segundos y la pantalla no respondia — el telefono se
     veia "tildado".

     Ahora: se hace de a pedazos. Cada 64 KB se le devuelve el control al
     navegador un instante, para que pueda dibujar y responder. El total
     tarda casi lo mismo, pero la pantalla nunca se congela.

     Esto no depende del tamaño: funciona igual con 1 MB que con 50. */

  var TROZO = 512;           /* bloques de 32 bytes = 16 KB por vuelta.
                               Mas chico = la pantalla responde mas seguido. */

  function bytesDe(b64){
    var bin = atob(b64), largo = bin.length;
    var datos = new Uint8Array(largo);
    for(var i=0;i<largo;i++) datos[i] = bin.charCodeAt(i);
    return datos;
  }

  /* El nucleo: descifra desde un bloque, durante una cantidad de bloques.
     Devuelve en que bloque quedo, para poder seguir despues. */
  function descifrarTramo(datos, clave, bloqueIni, cuantos){
    var largo = datos.length;
    var bloque = bloqueIni, pos = bloqueIni * 32, hechos = 0;
    while(pos < largo && hechos < cuantos){
      var ent = new Uint8Array(clave.length + 8);
      ent.set(clave); ent.set(contador(bloque), clave.length);
      var f = sha256(ent);
      for(var j=0; j<32 && pos<largo; j++, pos++) datos[pos] ^= f[j];
      bloque++; hechos++;
    }
    return bloque;
  }

  /* Version de siempre: descifra todo de una. Se conserva porque hay
     pantallas que la usan asi, y para archivos chicos es lo mas simple. */
  function descifrar(b64, clave){
    var datos = bytesDe(b64);
    var total = Math.ceil(datos.length / 32);
    descifrarTramo(datos, clave, 0, total);
    return new TextDecoder('utf-8').decode(datos);
  }

  /* Version por pedazos: la que evita que la pantalla se congele.
     Llama a listo(texto) cuando termina. */
  function descifrarDeAPoco(b64, clave, listo){
    var datos = bytesDe(b64);
    var total = Math.ceil(datos.length / 32);
    var bloque = 0;

    /* Si es chico, no vale la pena repartirlo: se hace de una. */
    if(total <= TROZO){
      descifrarTramo(datos, clave, 0, total);
      listo(new TextDecoder('utf-8').decode(datos));
      return;
    }

    (function seguir(){
      bloque = descifrarTramo(datos, clave, bloque, TROZO);
      if(bloque * 32 < datos.length){
        /* setTimeout de 0 le devuelve el control al navegador: puede
           dibujar, responder a un toque, y despues seguimos. */
        setTimeout(seguir, 0);
      } else {
        listo(new TextDecoder('utf-8').decode(datos));
      }
    })();
  }

  /* abre todo lo que haya llegado cifrado */
  /* ── ABRIR LOS DATOS ───────────────────────────────────────────────────
     Las 30 pantallas siguen llamando  abrirDatos()  exactamente igual, y
     sigue devolviendo true/false en el acto. Eso NO cambia.

     Lo que cambia es el reparto:

       · los archivos chicos (menos de 64 KB) se abren al instante, como
         siempre. Son la mayoria, y asi la pantalla tiene sus datos sin
         esperar nada.

       · los archivos grandes se abren de a pedazos, en segundo plano. La
         pantalla no se congela mientras tanto, y cuando cada uno termina
         se avisa con el evento 'datos-listos'.

     Las pantallas que tienen el vigia esperarDatos() se redibujan solas
     cuando llega ese aviso. Las que no lo tienen funcionan igual que
     antes, porque sus archivos son chicos y se abren de una. */
  window.abrirDatos = function(){
    var llave = llaveLocal();
    if(!llave || !window.__D) return false;

    var abiertos = 0, pendientes = [];
    var CHICO = 64 * 1024;      /* en base64, unos 48 KB de datos reales */

    for(var nombre in window.__D){
      var b64 = window.__D[nombre];
/* Una pantalla puede pedir que los archivos grandes se abran DE UNA
         en vez de en segundo plano. Lo usa "Cargar videos", que es una
         herramienta de escritorio: ahi un segundo de espera no molesta,
         y a cambio la lista sale completa a la primera.

         Las pantallas de los jugadores no ponen esa marca, asi que siguen
         abriendo en segundo plano y no se les cuelga el telefono. */
      if(b64 && b64.length > CHICO && !window.__DESCIFRAR_SINCRONO) { pendientes.push(nombre); continue; }
      try{
        (0, eval)(descifrar(b64, claveArchivo(llave, nombre)));
        abiertos++;
      }catch(e){
        try{ console.warn('[datos] no pude abrir', nombre); }catch(_){}
      }
    }

    /* los grandes, de a uno y sin congelar la pantalla */
    pendientes.forEach(function(nombre){
      try{
        descifrarDeAPoco(window.__D[nombre], claveArchivo(llave, nombre),
          function(texto){
            try{
              (0, eval)(texto);
              try{ window.dispatchEvent(new CustomEvent('datos-listos',
                     {detail:{archivo:nombre}})); }catch(_){}
            }catch(e){
              try{ console.warn('[datos] no pude abrir', nombre); }catch(_){}
            }
          });
        abiertos++;
      }catch(e){
        try{ console.warn('[datos] no pude abrir', nombre); }catch(_){}
      }
    });

    return abiertos > 0;
  };

  /* Guarda la llave que llega de Firebase. Si es la primera vez, recarga
     para que las paginas arranquen ya con los datos abiertos. */
  window.guardarLlave = function(llave){
    if(!llave) return;
    var antes = llaveLocal();
    try{ localStorage.setItem(GUARDADA, llave); }catch(e){}
    if(!antes) location.reload();
  };

  window.olvidarLlave = function(){
    try{ localStorage.removeItem(GUARDADA); }catch(e){}
  };
})();
