/* ════════════════════════════════════════════════════════════════════════════
   api/demo-validar.js — revisa el código y entrega el pase
   ----------------------------------------------------------------------------
   POST { mail, codigo }  →  { ok:true, pase, fin }      (entra)
   POST { pase }          →  { ok:true, fin }            (sigue adentro)

   El pase va firmado con el secreto del servidor. El navegador lo guarda,
   pero no lo puede fabricar ni estirarle la fecha: sin el secreto, la firma
   no cierra.
   ════════════════════════════════════════════════════════════════════════════ */
import { normalizar, valido, llaveDe, codigoDe, vence, leerRegistro,
         armarPase, leerPase, cors, cuerpoJSON } from './_demo_comun.js';
import crypto from 'node:crypto';

/* comparar sin filtrar por el tiempo que tarda */
function igual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'metodo' }); return; }

  let datos;
  try { datos = await cuerpoJSON(req); }
  catch (e) { res.status(400).json({ ok: false, error: 'cuerpo' }); return; }

  try {
    /* ── ya tiene pase: solo se confirma que siga vivo ── */
    if (datos.pase) {
      const p = leerPase(datos.pase);
      if (!p) { res.status(403).json({ ok: false, error: 'pase' }); return; }
      res.status(200).json({ ok: true, fin: p.fin });
      return;
    }

    /* ── primera entrada: mail + código ── */
    const mail = normalizar(datos.mail);
    const cod  = String(datos.codigo || '').replace(/\D/g, '');
    if (!valido(mail) || cod.length < 4) { res.status(400).json({ ok: false, error: 'datos' }); return; }

    const llave = llaveDe(mail);
    const reg = await leerRegistro(llave);
    if (!reg) { res.status(404).json({ ok: false, error: 'sinregistro' }); return; }

    const fin = vence(reg.ini);
    if (Date.now() > fin) { res.status(403).json({ ok: false, error: 'vencida' }); return; }

    if (!igual(cod, codigoDe(mail, reg.ini))) {
      res.status(403).json({ ok: false, error: 'codigo' });
      return;
    }

    res.status(200).json({ ok: true, pase: armarPase(llave, fin), fin: fin });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'servidor', detalle: String(e.message).slice(0, 120) });
  }
}
