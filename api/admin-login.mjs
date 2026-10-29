// POST /api/admin-login {email} — emails a sign-in link for the lead tracker to an allowed company address.
// Always replies the same way, so the form doesn't reveal which addresses are allowed.
import { ADMIN_EMAILS, makeToken } from './_auth.mjs';
import { sendMail, wrap, button, SITE } from './_mail.mjs';

export async function POST(request) {
  let email = '';
  try { email = String((await request.json()).email || '').trim().toLowerCase(); } catch {}
  if (ADMIN_EMAILS.includes(email)) {
    const link = `${SITE}/admin.html#t=${makeToken(email)}`;
    try {
      await sendMail({
        to: email,
        subject: 'Your Expert Fence lead tracker sign-in link',
        html: wrap(`<p>Click to open the lead tracker. The link works on this device for 30 days.</p><p>${button(link, 'Open the lead tracker')}</p><p style="font-size:13px;color:#6e756a">Didn't ask for this? Ignore this email.</p>`),
        text: `Open the lead tracker: ${link}`,
      });
    } catch (err) { console.error('admin-login', err); }
  }
  return Response.json({ ok: true });
}
