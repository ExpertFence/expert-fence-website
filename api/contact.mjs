// Vercel Function: receives every website form, emails it to the office via Resend,
// and sends the customer a copy of what they submitted.
// Needs the RESEND_API_KEY environment variable (Vercel > Project > Settings > Environment Variables).
// Replies {"success":"true"} / {"success":"false"} so the existing form scripts work unchanged.

const TO = 'expertfence@expertfence.com';
const FROM = 'Expert Fence Website <website@notify.expertfence.com>';
const ALLOWED_ORIGINS = ['https://www.expertfence.com', 'https://expertfence.com'];
const MAX_ATTACH_BYTES = 3.5 * 1024 * 1024; // stay under Vercel's 4.5 MB request limit

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isEmail = (s) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(s || '').trim());
const reply = (ok, status = ok ? 200 : 500, extra = {}) =>
  Response.json({ success: ok ? 'true' : 'false', ...extra }, { status });

export async function POST(request) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !origin.endsWith('.vercel.app')) return reply(false, 403);
  if (!process.env.RESEND_API_KEY) return reply(false, 500, { message: 'RESEND_API_KEY is not set' });

  let form;
  try { form = await request.formData(); } catch { return reply(false, 400); }

  // Hidden honeypot field: real people leave it empty.
  if (String(form.get('_honey') || '').trim()) return reply(true);

  const subject = String(form.get('_subject') || 'Website form submission').slice(0, 200);
  const replyTo = String(form.get('_replyto') || form.get('Email') || '').trim();

  const rows = [];
  const attachments = [];
  let attachBytes = 0;
  for (const [key, value] of form.entries()) {
    if (key.startsWith('_')) continue;
    if (typeof value === 'object' && value && 'arrayBuffer' in value) {
      if (!value.size || attachBytes + value.size > MAX_ATTACH_BYTES) continue;
      attachBytes += value.size;
      attachments.push({ filename: value.name || key, content: Buffer.from(await value.arrayBuffer()).toString('base64') });
      continue;
    }
    rows.push([key, String(value)]);
  }

  const html =
    `<h2 style="font-family:Arial,sans-serif;color:#1f4d33">${esc(subject)}</h2>` +
    '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    rows.map(([k, v]) => `<tr><th align="left" style="background:#f2f0e9;border:1px solid #e6e3da;white-space:nowrap">${esc(k)}</th>` +
      `<td style="border:1px solid #e6e3da">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('') +
    '</table>' +
    (attachments.length ? `<p style="font-family:Arial,sans-serif">${attachments.length} photo(s) attached.</p>` : '');
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject,
      html,
      text,
      ...(isEmail(replyTo) ? { reply_to: replyTo } : {}),
      ...(attachments.length ? { attachments } : {}),
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return reply(false, 502);
  }

  // Copy for the customer. The office email already went out, so a failure here doesn't fail the request.
  if (isEmail(replyTo)) {
    const es = (request.headers.get('referer') || '').includes('/es/');
    const intro = es
      ? '<p>Gracias por contactar a Expert Fence. Recibimos su solicitud y le responderemos dentro de un día hábil. ¿Lo necesita antes? Llame al <a href="tel:+17037513008">(703) 751-3008</a>.</p><p>Esta es una copia de lo que nos envió:</p>'
      : '<p>Thank you for contacting Expert Fence. We received your request and will get back to you within one business day. Need us sooner? Call <a href="tel:+17037513008">(703) 751-3008</a>.</p><p>Here is a copy of what you sent us:</p>';
    const copy = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Expert Fence <website@notify.expertfence.com>',
        to: [replyTo],
        reply_to: TO,
        subject: (es ? 'Copia de su solicitud — ' : 'Copy of your request — ') + subject,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px">${intro}</div>` + html,
        text: (es ? 'Copia de su solicitud a Expert Fence:\n\n' : 'Copy of your request to Expert Fence:\n\n') + text,
      }),
    });
    if (!copy.ok) console.error('Customer copy failed', copy.status, await copy.text());
  }
  return reply(true);
}
