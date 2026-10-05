// Vercel Function: receives every website form and emails it to the office via Resend.
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
  return reply(true);
}
