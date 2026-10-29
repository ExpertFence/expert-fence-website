// Vercel Function: receives every website form, emails it to the office via Resend,
// and sends the customer a copy of what they submitted.
// Needs the RESEND_API_KEY environment variable (Vercel > Project > Settings > Environment Variables).
// Replies {"success":"true"} / {"success":"false"} so the existing form scripts work unchanged.

import { checkRequest, checkContent, worst } from './_spam.mjs';
import { saveLead } from './_store.mjs';

const TO = 'expertfence@expertfence.com';
const FROM = 'Expert Fence Website <website@notify.expertfence.com>';
const REVIEW_URL = 'https://g.page/r/Cef39bttPF9cEBM/review'; // Google Business Profile "write a review" link
const MAX_ATTACH_BYTES = 3.5 * 1024 * 1024; // stay under Vercel's 4.5 MB request limit

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isEmail = (s) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(s || '').trim());
const reply = (ok, status = ok ? 200 : 500, extra = {}) =>
  Response.json({ success: ok ? 'true' : 'false', ...extra }, { status });

export async function POST(request) {
  // Spam screening (see _spam.mjs). Certain bots get a fake "success" so they don't retry.
  const reqCheck = checkRequest(request);
  if (reqCheck.verdict === 'block') { console.log('spam blocked:', reqCheck.reason); return reply(true); }
  if (!process.env.RESEND_API_KEY) return reply(false, 500, { message: 'RESEND_API_KEY is not set' });

  let form;
  try { form = await request.formData(); } catch { return reply(false, 400); }

  let subject = String(form.get('_subject') || 'Website form submission').slice(0, 200);
  const replyTo = String(form.get('_replyto') || form.get('Email') || '').trim();

  const rows = [];
  const attachments = [];
  let attachBytes = 0;
  for (const [key, value] of form.entries()) {
    if (key.startsWith('_')) continue;
    if (key === 'company_website') continue;   // spam trap, never shown to people
    if (typeof value === 'object' && value && 'arrayBuffer' in value) {
      if (!value.size || attachBytes + value.size > MAX_ATTACH_BYTES) continue;
      attachBytes += value.size;
      attachments.push({ filename: value.name || key, content: Buffer.from(await value.arrayBuffer()).toString('base64') });
      continue;
    }
    rows.push([key, String(value)]);
  }

  const verdict = worst(reqCheck, checkContent(rows, String(form.get('company_website') || form.get('_honey') || '')));
  if (verdict.verdict === 'block') { console.log('spam blocked:', verdict.reason); return reply(true); }
  const suspect = verdict.verdict === 'suspect';
  if (suspect) console.log('possible spam:', verdict.reason);

  if (suspect) {
    subject = '[Possible spam] ' + subject;
    rows.push(['Spam check', 'Flagged as possible spam: ' + verdict.reason + '. No copy was sent to the sender.']);
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
  if (isEmail(replyTo) && !suspect) {
    const es = (request.headers.get('referer') || '').includes('/es/');
    const intro = es
      ? '<p>Gracias por contactar a Expert Fence. Recibimos su solicitud y le responderemos dentro de un día hábil. ¿Lo necesita antes? Llame al <a href="tel:+17037513008">(703) 751-3008</a>.</p><p>Esta es una copia de lo que nos envió:</p>'
      : '<p>Thank you for contacting Expert Fence. We received your request and will get back to you within one business day. Need us sooner? Call <a href="tel:+17037513008">(703) 751-3008</a>.</p><p>Here is a copy of what you sent us:</p>';
    const review = es
      ? ['¿Ya trabajamos juntos antes? Una reseña en Google ayuda a otros vecinos a encontrarnos.', 'Déjenos una reseña en Google']
      : ['Worked with us before? A Google review helps your neighbors find us.', 'Leave us a Google review'];
    const reviewHtml =
      `<div style="font-family:Arial,sans-serif;font-size:14px;margin-top:22px;padding-top:16px;border-top:1px solid #e6e3da">` +
      `<p style="margin:0 0 10px">${review[0]}</p>` +
      `<a href="${REVIEW_URL}" style="display:inline-block;background:#c07c33;color:#fff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:3px">★ ${review[1]}</a></div>`;
    const copy = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Expert Fence <website@notify.expertfence.com>',
        to: [replyTo],
        reply_to: TO,
        subject: (es ? 'Copia de su solicitud — ' : 'Copy of your request — ') + subject,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px">${intro}</div>` + html + reviewHtml,
        text: (es ? 'Copia de su solicitud a Expert Fence:\n\n' : 'Copy of your request to Expert Fence:\n\n') + text +
          `\n\n${review[0]}\n${review[1]}: ${REVIEW_URL}`,
      }),
    });
    if (!copy.ok) console.error('Customer copy failed', copy.status, await copy.text());
  }

  // Lead tracker (only when the Upstash store is connected; never fails the request).
  try { await recordLead(form, rows, subject, replyTo, request, suspect); } catch (err) { console.error('lead store', err); }
  return reply(true);
}

// Saves the request as a lead for the tracker, reminders and review requests.
// Machine-readable booking fields arrive as "_visitDate" (YYYY-MM-DD), "_visitSlot" (minutes after midnight)
// and "_zip"; underscore fields never appear in the emails.
async function recordLead(form, rows, subject, email, request, suspect) {
  const pick = (...names) => {
    for (const n of names) { const r = rows.find(([k]) => k.toLowerCase() === n.toLowerCase()); if (r && r[1] && r[1] !== '—') return r[1]; }
    return '';
  };
  const ref = pick('Reference') || 'EF-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  const booked = /^Booked on the Estimating calendar/.test(pick('Calendar'));
  const visitDate = String(form.get('_visitDate') || '');
  const visitSlot = Number(form.get('_visitSlot'));
  const now = new Date().toISOString();
  await saveLead(ref, {
    source: subject.replace(/^\[Possible spam\]\s*/, '').split(' — ')[0].slice(0, 80),
    subject: subject.slice(0, 200),
    name: pick('Name', 'Customer').slice(0, 100),
    email: email.slice(0, 120),
    phone: pick('Phone').slice(0, 40),
    company: pick('Company').slice(0, 100),
    address: pick('Property Address', 'Address', 'Property').slice(0, 200),
    zip: String(form.get('_zip') || pick('ZIP') || '').slice(0, 10),
    service: pick('Service', 'Fence Finder result', 'Visit Type', 'Selections', 'Fence type', 'Enquiry Type').slice(0, 200),
    notes: pick('Details', 'Notes', 'Anything else?', 'Message').slice(0, 2000),
    lang: (request.headers.get('referer') || '').includes('/es/') ? 'es' : 'en',
    page: (request.headers.get('referer') || '').replace(/^https?:\/\/[^/]+/, '').slice(0, 120),
    ...(/^\d{4}-\d{2}-\d{2}$/.test(visitDate) && Number.isFinite(visitSlot) ? { visit: { date: visitDate, slot: visitSlot, booked } } : {}),
    stage: suspect ? 'Spam' : (booked ? 'Confirmed' : 'New'),
    history: [{ t: now, by: 'website', what: suspect ? 'Received (flagged as possible spam)' : (booked ? 'Booked online, on the calendar' : 'Received') }],
  });
}
