// Customer reviews for Expert Fence Supply (Vercel Function).
//
// How it works:
//  1. Register: the customer gives name + email; we email a sign-in link (proves the email is real).
//  2. Write: with that link the customer can post a review (1–5 stars + text).
//  3. Approve: every new review is emailed to sales@ with a "Review it" link; only approved reviews are public.
//
// Storage: Upstash Redis (same KV_REST_API_URL / KV_REST_API_TOKEN as the lead tracker).
//   review:<id>      JSON review (email kept private)
//   reviews:approved sorted set of ids by creation time
//   reviewer:<email> JSON { name, created, lastLogin }
//   review-wait:<email> rate limit (one review per 12 hours)
// Signing key is derived from RESEND_API_KEY (no extra secret to manage).

import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { checkRequest } from './_spam.mjs';
import { sendMail, wrap, button, esc, isEmail, SITE } from './_mail.mjs';
import { verify } from './_auth.mjs';

const SALES = 'sales@expertfence.com';
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const ok = (extra = {}) => Response.json({ success: 'true', ...extra });
const fail = (message, status = 400) => Response.json({ success: 'false', message }, { status });

async function redis(cmds) {
  if (!URL_ || !TOKEN) throw new Error('Review storage is not connected');
  const res = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const out = await res.json();
  const err = out.find((r) => r.error);
  if (err) throw new Error(`Redis ${err.error}`);
  return out.map((r) => r.result);
}

/* ---------- signed tokens ---------- */
const key = () => createHmac('sha256', 'expert-fence-reviews').update(process.env.RESEND_API_KEY || '').digest();
const b64 = (s) => Buffer.from(s).toString('base64url');
const mac = (s) => createHmac('sha256', key()).update(s).digest('base64url');
function sign(obj, days) { const body = b64(JSON.stringify({ ...obj, x: Date.now() + days * 86_400_000 })); return `${body}.${mac(body)}`; }
function unsign(t) {
  const [body, sig] = String(t || '').split('.');
  if (!body || !sig || !process.env.RESEND_API_KEY) return null;
  const a = Buffer.from(sig), b = Buffer.from(mac(body));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try { const o = JSON.parse(Buffer.from(body, 'base64url').toString()); return o.x > Date.now() ? o : null; } catch { return null; }
}

const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
const publicName = (n) => { const p = clean(n, 60).split(' ').filter(Boolean); return p.length > 1 ? `${p[0]} ${p[p.length - 1][0].toUpperCase()}.` : (p[0] || 'Customer'); };
const pageFor = (lang) => `${SITE}${lang === 'es' ? '/es' : ''}/expert-fence-supply.html`;

/* ---------- GET: public list, or the moderation page ---------- */
export async function GET(request) {
  const u = new URL(request.url);
  if (u.searchParams.get('mod')) return moderationPage(u.searchParams.get('mod'));
  if (u.searchParams.get('admin')) return adminList(request);
  try {
    const [ids] = await redis([['ZRANGE', 'reviews:approved', '0', '199', 'REV']]);
    const vals = ids && ids.length ? await redis(ids.map((id) => ['GET', `review:${id}`])) : [];
    const reviews = vals.filter(Boolean).map((v) => JSON.parse(v)).filter((r) => r.status === 'approved')
      .map(({ id, name, rating, title, text, lang, created, reply }) => ({ id, name, rating, title, text, lang, created, reply: reply && reply.text ? { text: reply.text, at: reply.at } : undefined }));
    const avg = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 0;
    return Response.json({ success: 'true', count: reviews.length, avg, reviews }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  } catch (e) {
    console.error('reviews list', e);
    return Response.json({ success: 'true', count: 0, avg: 0, reviews: [] });
  }
}

/* ---------- POST: register / me / submit / moderate ---------- */
export async function POST(request) {
  let data;
  const type = request.headers.get('content-type') || '';
  try { data = type.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData()); }
  catch { return fail('bad request'); }

  if (data.action === 'moderate') return moderate(data);
  if (String(data.action || '').startsWith('admin')) return adminAction(request, data);

  const req = checkRequest(request);
  if (req.verdict === 'block' || String(data.company_website || '').trim()) { console.log('review spam blocked:', req.reason || 'trap'); return ok(); }

  try {
    if (data.action === 'register') return await register(data);
    if (data.action === 'me') {
      const t = unsign(data.token);
      return t && t.k === 'u' ? ok({ name: t.n, email: t.e }) : fail('signed out', 401);
    }
    if (data.action === 'submit') return await submit(data, req.verdict === 'suspect' ? req.reason : '');
  } catch (e) {
    console.error('reviews', e);
    return fail('server error', 500);
  }
  return fail('unknown action');
}

async function register(d) {
  const name = clean(d.name, 60), email = clean(d.email, 120).toLowerCase(), lang = d.lang === 'es' ? 'es' : 'en';
  if (name.length < 2 || /https?:|www\.|@/.test(name)) return fail('name');
  if (!isEmail(email)) return fail('email');
  const now = new Date().toISOString();
  const [old] = await redis([['GET', `reviewer:${email}`]]);
  const rec = { ...(old ? JSON.parse(old) : { created: now }), name, lastLogin: now };
  await redis([['SET', `reviewer:${email}`, JSON.stringify(rec)]]);
  const token = sign({ k: 'u', e: email, n: name }, 90);
  const link = `${pageFor(lang)}#reviews/t=${token}`;
  const es = lang === 'es';
  await sendMail({
    to: email,
    subject: es ? 'Confirme su correo para dejar su reseña — Expert Fence Supply' : 'Confirm your email to leave your review — Expert Fence Supply',
    html: wrap(
      `<p>${es ? 'Hola' : 'Hi'} ${esc(name)},</p>` +
      `<p>${es ? 'Gracias por registrarse para dejar una reseña de Expert Fence Supply. Toque el botón para confirmar su correo y escribir su reseña.' : 'Thanks for signing up to review Expert Fence Supply. Tap the button to confirm your email and write your review.'}</p>` +
      `<p>${button(link, es ? 'Confirmar y escribir mi reseña' : 'Confirm & write my review')}</p>` +
      `<p style="font-size:13px;color:#6e756a">${es ? 'El enlace es válido por 90 días. Si usted no pidió esto, ignore este correo.' : 'This link works for 90 days. If you did not ask for this, you can ignore this email.'}</p>`),
    text: (es ? 'Confirme su correo y escriba su reseña: ' : 'Confirm your email and write your review: ') + link,
    replyTo: SALES,
  });
  return ok();
}

async function submit(d, suspectReason) {
  const t = unsign(d.token);
  if (!t || t.k !== 'u') return fail('signed out', 401);
  const rating = Math.round(Number(d.rating));
  const text = String(d.text || '').trim().slice(0, 2000), title = clean(d.title, 100);
  if (!(rating >= 1 && rating <= 5)) return fail('rating');
  if (text.length < 10) return fail('text');
  const [wait] = await redis([['GET', `review-wait:${t.e}`]]);
  if (wait) return fail('wait', 429);
  const id = Date.now().toString(36) + randomBytes(3).toString('hex');
  const review = { id, name: publicName(t.n), fullName: t.n, email: t.e, rating, title, text, lang: d.lang === 'es' ? 'es' : 'en', created: new Date().toISOString(), status: 'pending', flag: suspectReason || undefined };
  await redis([['SET', `review:${id}`, JSON.stringify(review)], ['SET', `review-wait:${t.e}`, '1', 'EX', '43200']]);
  const modLink = `${SITE}/api/reviews?mod=${sign({ k: 'm', id }, 60)}`;
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  await sendMail({
    to: SALES,
    subject: `${suspectReason ? '[Possible spam] ' : ''}NEW REVIEW ${stars} — ${t.n} — waiting for approval`,
    html: wrap(
      `<p><b>New customer review on Expert Fence Supply</b> — it is <b>not public</b> until you approve it.</p>` +
      `<p style="font-size:20px;color:#c07c33;margin:0">${stars}</p>` +
      (title ? `<p style="margin:6px 0 0"><b>${esc(title)}</b></p>` : '') +
      `<p style="white-space:pre-wrap;background:#f2f0e9;padding:12px;border-radius:4px">${esc(text)}</p>` +
      `<p>From: ${esc(t.n)} &lt;${esc(t.e)}&gt; (email confirmed)${suspectReason ? `<br>Spam check: ${esc(suspectReason)}` : ''}</p>` +
      `<p>${button(modLink, 'Review it: publish or reject')}</p>`),
    text: `New review (${rating}/5) from ${t.n} <${t.e}>:\n\n${title ? title + '\n' : ''}${text}\n\nPublish or reject: ${modLink}`,
    replyTo: t.e,
  });
  return ok({ pending: true });
}

/* ---------- moderation: GET shows the review + buttons (safe from link scanners), POST acts ---------- */
async function loadForMod(token) {
  const m = unsign(token);
  if (!m || m.k !== 'm') return null;
  const [v] = await redis([['GET', `review:${m.id}`]]);
  return v ? JSON.parse(v) : null;
}
const html = (body) => new Response(
  `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Review moderation — Expert Fence Supply</title>` +
  `<style>body{font-family:Arial,sans-serif;background:#F5FCF0;color:#16301D;margin:0;padding:40px 18px}.c{max-width:620px;margin:auto;background:#fff;border-radius:18px;padding:28px;box-shadow:0 8px 28px rgba(14,39,22,.1)}h1{font-size:22px;margin:0 0 14px}.s{color:#c07c33;font-size:22px}.t{white-space:pre-wrap;background:#F5FCF0;padding:14px;border-radius:10px}button{font:bold 15px Arial;padding:12px 22px;border-radius:999px;border:0;cursor:pointer;margin:6px 8px 0 0}.a{background:#173D22;color:#A8E07F}.r{background:#f3dcd7;color:#8a2a1a}.st{font-weight:bold;color:#3F8F2E}</style></head>` +
  `<body><div class="c">${body}</div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

async function moderationPage(token) {
  let r; try { r = await loadForMod(token); } catch { r = null; }
  if (!r) return html('<h1>This link is not valid or has expired.</h1>');
  return html(
    `<h1>Customer review</h1><div class="s">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>` +
    (r.title ? `<p><b>${esc(r.title)}</b></p>` : '') + `<div class="t">${esc(r.text)}</div>` +
    `<p>From ${esc(r.fullName)} &lt;${esc(r.email)}&gt; — shown publicly as <b>${esc(r.name)}</b></p>` +
    `<p>Status: <span class="st">${esc(r.status)}</span></p>` +
    `<form method="post" action="/api/reviews"><input type="hidden" name="action" value="moderate"><input type="hidden" name="mod" value="${esc(token)}">` +
    `<button class="a" name="do" value="approve">Publish on the website</button><button class="r" name="do" value="reject">Reject</button></form>`);
}

async function moderate(d) {
  let r; try { r = await loadForMod(d.mod); } catch { r = null; }
  if (!r) return html('<h1>This link is not valid or has expired.</h1>');
  const approve = d.do === 'approve';
  r.status = approve ? 'approved' : 'rejected';
  r.moderated = new Date().toISOString();
  const cmds = [['SET', `review:${r.id}`, JSON.stringify(r)]];
  cmds.push(approve ? ['ZADD', 'reviews:approved', String(Date.parse(r.created)), r.id] : ['ZREM', 'reviews:approved', r.id]);
  await redis(cmds);
  return html(approve
    ? `<h1>✓ Published</h1><p>The review from <b>${esc(r.name)}</b> is now live on <a href="${SITE}/expert-fence-supply.html#reviews">Expert Fence Supply → Reviews</a>.</p><p>Changed your mind? Use the same email link to reject it.</p>`
    : `<h1>Rejected</h1><p>The review from <b>${esc(r.name)}</b> will not be shown. You can still publish it later from the same email link.</p>`);
}

/* ---------- admin (sign-in via /api/admin-login, see _auth.mjs) ---------- */
const noStore = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
async function allReviewIds() {
  const ids = new Set(); let cursor = '0', n = 0;
  do {
    const [res] = await redis([['SCAN', cursor, 'MATCH', 'review:*', 'COUNT', '500']]);
    cursor = String(res[0]); (res[1] || []).forEach((k) => ids.add(k.slice(7))); n++;
  } while (cursor !== '0' && n < 20);
  return [...ids];
}
async function adminList(request) {
  if (!verify(request)) return noStore({ error: 'sign in' }, 401);
  try {
    const ids = await allReviewIds();
    const vals = ids.length ? await redis(ids.map((id) => ['GET', `review:${id}`])) : [];
    const reviews = vals.filter(Boolean).map((v) => JSON.parse(v)).sort((a, b) => b.created.localeCompare(a.created));
    return noStore({ success: 'true', reviews });
  } catch (e) { console.error('reviews admin list', e); return noStore({ error: 'store unavailable' }, 502); }
}
async function adminAction(request, d) {
  const who = verify(request);
  if (!who) return noStore({ error: 'sign in' }, 401);
  const id = clean(d.id, 40);
  const [v] = await redis([['GET', `review:${id}`]]);
  if (!v) return noStore({ error: 'not found' }, 404);
  const r = JSON.parse(v), now = new Date().toISOString();
  if (d.action === 'adminDelete') {
    await redis([['DEL', `review:${id}`], ['ZREM', 'reviews:approved', id]]);
    return noStore({ success: 'true', deleted: id });
  }
  if (d.action === 'adminStatus') {
    const approve = d.status === 'approved';
    r.status = approve ? 'approved' : 'hidden'; r.moderated = now; r.moderatedBy = who;
    await redis([['SET', `review:${id}`, JSON.stringify(r)], approve ? ['ZADD', 'reviews:approved', String(Date.parse(r.created)), id] : ['ZREM', 'reviews:approved', id]]);
    return noStore({ success: 'true', review: r });
  }
  if (d.action === 'adminReply') {
    const text = String(d.text || '').trim().slice(0, 2000);
    if (text) r.reply = { text, at: now, by: who }; else delete r.reply;
    await redis([['SET', `review:${id}`, JSON.stringify(r)]]);
    return noStore({ success: 'true', review: r });
  }
  return noStore({ error: 'unknown action' }, 400);
}
