// Sign-in for the lead tracker: a link emailed to an allowed company address, valid 30 days.
// The signing key is derived from the existing RESEND_API_KEY, so there is no extra secret to manage;
// rotating the Resend key signs everyone out.
import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'expertfence@expertfence.com,admin@expertfence.com,sales@expertfence.com')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

const key = () => createHmac('sha256', 'expert-fence-lead-tracker').update(process.env.RESEND_API_KEY || '').digest();
const b64 = (s) => Buffer.from(s).toString('base64url');
const mac = (s) => createHmac('sha256', key()).update(s).digest('base64url');

export function makeToken(email, days = 30) {
  const body = b64(JSON.stringify({ e: email, x: Date.now() + days * 86_400_000 }));
  return `${body}.${mac(body)}`;
}

/** Returns the signed-in email, or null. Reads "Authorization: Bearer <token>". */
export function verify(request) {
  if (!process.env.RESEND_API_KEY) return null;
  const t = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const [body, sig] = t.split('.');
  if (!body || !sig) return null;
  const a = Buffer.from(sig), b = Buffer.from(mac(body));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(body, 'base64url').toString());
    return x > Date.now() && ADMIN_EMAILS.includes(e) ? e : null;
  } catch { return null; }
}
