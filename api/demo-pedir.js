/* ════════════════════════════════════════════════════════════════════════════
   api/demo-pedir.js — el visitante deja su mail y le llega el código
   ----------------------------------------------------------------------------
   POST { mail, club }  →  { ok: true, yaTenia: false }

   Qué pasa acá:
     1. se revisa el mail y el tope de pedidos por IP del día
     2. si es la primera vez, se anota la fecha de arranque (empiezan los 5 días)
        si ya se había registrado, NO se reinicia nada: se le manda el mismo
        código de siempre — así "5 días" son 5 días de verdad
     3. se le manda el código
     4. te llega a vos un aviso con el mail y el club: esa es tu lista
   ════════════════════════════════════════════════════════════════════════════ */
import { DIAS, normalizar, valido, llaveDe, codigoDe, vence,
         leerRegistro, crearRegistro, ipPasada, mandarMail,
         cors, cuerpoJSON } from './_demo_comun.js';

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

function mailDelCodigo(codigo, quedan) {
  return '<div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;max-width:460px;margin:0 auto;padding:8px">' +
    '<div style="font-size:12px;letter-spacing:4px;color:#e8192c;font-weight:800">VOLLEY-STATS</div>' +
    '<h2 style="font-size:21px;margin:14px 0 6px">Tu código para la demo</h2>' +
    '<p style="color:#555;font-size:15px;line-height:1.55;margin:0 0 18px">' +
      'Escribilo en la pantalla de la demo. Vale ' + quedan + ' días.</p>' +
    '<div style="font-size:38px;font-weight:800;letter-spacing:12px;text-align:center;' +
      'padding:18px;background:#f4f5f8;border-radius:12px;color:#0d0e1a">' + codigo + '</div>' +
    '<p style="color:#888;font-size:13px;line-height:1.6;margin:20px 0 0">' +
      'Si no pediste esto, podés ignorar el mensaje: sin el código nadie entra.</p>' +
    '</div>';
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'metodo' }); return; }

  let datos;
  try { datos = await cuerpoJSON(req); }
  catch (e) { res.status(400).json({ ok: false, error: 'cuerpo' }); return; }

  const mail = normalizar(datos.mail);
  const club = String(datos.club || '').trim().slice(0, 80);
  if (!valido(mail)) { res.status(400).json({ ok: false, error: 'mail' }); return; }

  try {
    if (await ipPasada(req)) { res.status(429).json({ ok: false, error: 'muchos' }); return; }

    const llave = llaveDe(mail);
    let reg = await leerRegistro(llave);
    let yaTenia = !!reg;

    if (!reg) {
      const ini = Date.now();
      const bien = await crearRegistro(llave, ini);
      if (!bien) { res.status(500).json({ ok: false, error: 'guardar' }); return; }
      reg = { ini: ini };
    }

    const fin = vence(reg.ini);
    if (Date.now() > fin) { res.status(403).json({ ok: false, error: 'vencida' }); return; }

    const quedan = Math.max(1, Math.ceil((fin - Date.now()) / 86400000));
    const codigo = codigoDe(mail, reg.ini);

    const envio = await mandarMail(mail, 'Tu código para la demo de Volley-Stats',
                                   mailDelCodigo(codigo, quedan));

    /* el aviso para vos: es la lista de contactos, va a tu bandeja */
    const aviso = process.env.MAIL_AVISO;
    if (aviso && envio.ok) {
      await mandarMail(aviso, 'Demo: ' + mail,
        '<p style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.7">' +
        '<b>Mail:</b> ' + esc(mail) + '<br>' +
        '<b>Club:</b> ' + (esc(club) || '—') + '<br>' +
        '<b>Cuándo:</b> ' + new Date().toISOString().replace('T', ' ').slice(0, 16) + '<br>' +
        '<b>Estado:</b> ' + (yaTenia ? 'ya se había registrado, pidió el código de nuevo'
                                     : 'primera vez') + '</p>');
    }

    /* MODO PRUEBA: sin servicio de correo configurado, el código vuelve en la
       respuesta para poder probar todo el camino sin comprar nada. Se prende
       a mano con DEMO_MODO_PRUEBA=1 para que no se escape en producción. */
    if (!envio.ok) {
      if (process.env.DEMO_MODO_PRUEBA === '1') {
        res.status(200).json({ ok: true, yaTenia: yaTenia, prueba: true, codigo: codigo });
        return;
      }
      res.status(500).json({ ok: false, error: 'correo', detalle: envio.motivo });
      return;
    }

    res.status(200).json({ ok: true, yaTenia: yaTenia, quedan: quedan });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'servidor', detalle: String(e.message).slice(0, 120) });
  }
}
