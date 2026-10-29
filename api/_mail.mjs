// Small helpers shared by the reminder, review and admin-login emails (Resend).
export const OFFICE = 'expertfence@expertfence.com';
export const FROM = 'Expert Fence <website@notify.expertfence.com>';
export const PHONE = '(703) 751-3008';
export const REVIEW_URL = 'https://g.page/r/Cef39bttPF9cEBM/review';
export const SITE = 'https://www.expertfence.com';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const isEmail = (s) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(s || '').trim());

export async function sendMail({ to, subject, html, text, replyTo = OFFICE, from = FROM }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, html, text, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status} ${await res.text()}`);
  return res.json();
}

/** Branded wrapper for customer emails. */
export const wrap = (inner) =>
  `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#12150f;max-width:560px">` +
  `<p style="font-family:Arial Black,Arial,sans-serif;font-size:18px;color:#1f4d33;margin:0 0 14px">EXPERT FENCE</p>${inner}` +
  `<p style="margin-top:22px;padding-top:14px;border-top:1px solid #e6e3da;font-size:13px;color:#6e756a">Expert Fence · 6027 Farrington Avenue, Alexandria, VA 22304 · <a href="tel:+17037513008" style="color:#1f4d33">${PHONE}</a> · <a href="${SITE}" style="color:#1f4d33">expertfence.com</a></p></div>`;

export const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#c07c33;color:#fff;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:3px">${label}</a>`;
