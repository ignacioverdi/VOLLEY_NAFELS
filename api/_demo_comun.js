/* ════════════════════════════════════════════════════════════════════════════
   api/_demo_comun.js — lo que comparten pedir-codigo y validar-codigo
   ----------------------------------------------------------------------------
   Corre en el servidor de Vercel, NO en el navegador. Por eso acá sí puede
   haber un secreto: el visitante nunca ve este archivo.

   QUE SE GUARDA Y QUE NO
   En Firebase se guarda SOLO un resumen ilegible del mail (un hash) y la
   fecha en que empezó la prueba. El mail de verdad no se guarda ahí nunca,
   porque la base del club tiene lectura pública (".read": true en la raíz) y
   una lista de contactos a la vista de cualquiera sería un problema.
   El mail te llega a vos por correo, a MAIL_AVISO: tu bandeja es la lista.

   POR QUE EL REGISTRO NO SE PUEDE PISAR
   La regla de Firebase deja CREAR pero no modificar ni borrar
   (".write": "!data.exists()"). Así nadie se resetea los 5 días borrando su
   propio registro. Y por las dudas el registro va firmado: si alguien lo
   toca, la firma no cierra y se trata como vencido.
   ════════════════════════════════════════════════════════════════════════════ */
import crypto from 'node:crypto';

export const DIAS      = 5;
export const DIGITOS   = 6;
export const POR_IP    = 5;    /* pedidos por IP y por día */

export const FB = (process.env.FIREBASE_DB || 'https://nafels-voley-default-rtdb.firebaseio.com')
                    .replace(/\/+$/, '');

function secreto() {
  var s = process.env.DEMO_SECRET;
  if (!s || s.length < 16) throw new Error('falta DEMO_SECRET');
  return s;
}

export function hmac(txt) {
  return crypto.createHmac('sha256', secreto()).update(String(txt)).digest('hex');
}

/* El mail se normaliza antes de cualquier cosa: MAIL@Club.CH y mail@club.ch
   son la misma persona y no pueden contar como dos pruebas. */
export function normalizar(mail) {
  return String(mail || '').trim().toLowerCase();
}

export function valido(mail) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail) && mail.length <= 120;
}

/* la llave con la que se guarda: ilegible, y sin los caracteres que Firebase
   no admite en una clave ( . $ # [ ] / ) — el hexadecimal no tiene ninguno */
export function llaveDe(mail) { return hmac('mail|' + mail).slice(0, 32); }

/* El código sale del mail y del momento en que arrancó la prueba. No se
   guarda en ningún lado: se vuelve a calcular cuando hace falta. */
export function codigoDe(mail, ini) {
  var h = hmac('codigo|' + mail + '|' + ini);
  var n = parseInt(h.slice(0, 12), 16) % Math.pow(10, DIGITOS);
  return String(n).padStart(DIGITOS, '0');
}

export function firmaDe(llave, ini) { return hmac('reg|' + llave + '|' + ini).slice(0, 24); }

export function vence(ini) { return Number(ini) + DIAS * 86400000; }

/* ── Firebase por REST, desde el servidor ──────────────────────────────── */
export async function leerRegistro(llave) {
  try {
    var r = await fetch(FB + '/demo_acceso/' + llave + '.json', { cache: 'no-store' });
    if (!r.ok) return null;
    var j = await r.json();
    if (!j || !j.ini) return null;
    if (j.sig !== firmaDe(llave, j.ini)) return null;   /* lo tocaron */
    return j;
  } catch (e) { return null; }
}

export async function crearRegistro(llave, ini) {
  var cuerpo = JSON.stringify({ ini: ini, sig: firmaDe(llave, ini) });
  var r = await fetch(FB + '/demo_acceso/' + llave + '.json?print=silent',
                      { method: 'PUT', body: cuerpo });
  return r.ok;
}

/* ── tope por IP, para que nadie use el formulario de mailbomba ────────── */
export function ipDe(req) {
  var h = req.headers || {};
  var x = h['x-forwarded-for'] || h['x-real-ip'] || '';
  return String(x).split(',')[0].trim() || 'sin-ip';
}

export async function ipPasada(req) {
  var dia = new Date().toISOString().slice(0, 10);
  var k = hmac('ip|' + ipDe(req) + '|' + dia).slice(0, 24);
  try {
    var r = await fetch(FB + '/demo_ip/' + k + '.json?shallow=true', { cache: 'no-store' });
    var j = r.ok ? await r.json() : null;
    var n = j ? Object.keys(j).length : 0;
    if (n >= POR_IP) return true;
    await fetch(FB + '/demo_ip/' + k + '/' + crypto.randomUUID().slice(0, 8) + '.json?print=silent',
                { method: 'PUT', body: '1' });
    return false;
  } catch (e) { return false; }   /* si falla el conteo, no se traba a nadie */
}

/* ── el pase que se lleva el navegador ─────────────────────────────────── */
export function armarPase(llave, fin) {
  var cuerpo = llave + '.' + fin;
  return cuerpo + '.' + hmac('pase|' + cuerpo).slice(0, 24);
}

export function leerPase(pase) {
  var p = String(pase || '').split('.');
  if (p.length !== 3) return null;
  if (hmac('pase|' + p[0] + '.' + p[1]).slice(0, 24) !== p[2]) return null;
  var fin = Number(p[1]);
  if (!fin || Date.now() > fin) return null;
  return { llave: p[0], fin: fin };
}

/* ── el correo ─────────────────────────────────────────────────────────── */
export async function mandarMail(para, asunto, html) {
  var key = process.env.RESEND_API_KEY;
  var de  = process.env.MAIL_FROM;
  if (!key || !de) return { ok: false, motivo: 'sin-config' };
  try {
    var r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: de, to: [para], subject: asunto, html: html })
    });
    if (!r.ok) return { ok: false, motivo: 'resend-' + r.status, detalle: (await r.text()).slice(0, 300) };
    return { ok: true };
  } catch (e) { return { ok: false, motivo: 'red', detalle: String(e.message).slice(0, 200) }; }
}

export function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.DEMO_ORIGEN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

export async function cuerpoJSON(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  var txt = '';
  for await (var t of req) txt += t;
  try { return JSON.parse(txt || '{}'); } catch (e) { return {}; }
}
