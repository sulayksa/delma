/**
 * Optional server endpoint for quote requests — runs as a Cloudflare Pages Function at /api/quote
 * (only when the site is deployed on Cloudflare Pages; GitHub Pages cannot run server code).
 *
 * Sends the request by e-mail through Resend (https://resend.com), attachments included.
 * Environment variables (Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY   — Resend API key (secret)
 *   QUOTE_TO         — recipient, e.g. delmaaljazera@gmail.com
 *   QUOTE_FROM       — verified sender, e.g. "Delma Website <quotes@your-domain>"
 * Then build the site with NEXT_PUBLIC_QUOTE_ENDPOINT=/api/quote
 */
interface Env { RESEND_API_KEY: string; QUOTE_TO: string; QUOTE_FROM: string }
const MAX_FILES = 5, MAX_BYTES = 10 * 1024 * 1024;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.RESEND_API_KEY || !env.QUOTE_TO || !env.QUOTE_FROM) return json({ ok: false, error: 'not-configured' }, 503);
  let fd: FormData;
  try { fd = await request.formData(); } catch { return json({ ok: false, error: 'bad-request' }, 400); }
  if (fd.get('website')) return json({ ok: true }); // honeypot
  const get = (k: string) => String(fd.get(k) ?? '').trim().slice(0, 2000);
  const name = get('name'), phone = get('phone'), service = get('service'), city = get('city'), details = get('details'), sizes = get('sizes');
  if (name.length < 2 || !/^05\d{8}$/.test(phone) || !service || city.length < 2 || details.length < 10) return json({ ok: false, error: 'invalid' }, 422);

  const files = fd.getAll('files').filter((f): f is File => f instanceof File).slice(0, MAX_FILES);
  const attachments = [];
  for (const f of files) {
    if (f.size > MAX_BYTES) return json({ ok: false, error: 'file-too-large' }, 413);
    const buf = new Uint8Array(await f.arrayBuffer());
    let bin = ''; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    attachments.push({ filename: f.name, content: btoa(bin) });
  }
  const rows = [['الاسم', name], ['الجوال', phone], ['الخدمة', service], ['المدينة', city], ['المقاسات', sizes || '—'], ['التفاصيل', details]];
  const html = `<div dir="rtl" style="font-family:sans-serif"><h2>طلب عرض سعر من الموقع</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table></div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.QUOTE_FROM, to: [env.QUOTE_TO], subject: `طلب عرض سعر — ${service} — ${name}`, html, attachments }),
  });
  if (!r.ok) return json({ ok: false, error: 'mail-failed' }, 502);
  return json({ ok: true });
};
