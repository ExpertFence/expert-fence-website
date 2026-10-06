// POST /api/book  (JSON) — puts a site visit on the "Estimating" calendar in expertfence@expertfence.com.
// The slot is re-checked against the live calendar first, so two customers can't take the same hour.
// The customer is added as an attendee, so Outlook sends them the invite and any later change or cancellation.
// Replies: 200 {success:"true", eventId} · 409 {success:"false", conflict:true} · 503 {success:"false", live:false}
import { configured, graph, getCalendarId, busyBetween, at, overlaps, isValidSlot, TZ, MAILBOX, SLOT_MINUTES } from './_graph.mjs';

const ALLOWED_ORIGINS = ['https://www.expertfence.com', 'https://expertfence.com'];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isEmail = (s) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(s || '').trim());
const reply = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !origin.endsWith('.vercel.app')) return reply({ success: 'false' }, 403);
  if (!configured()) return reply({ success: 'false', live: false }, 503);

  let b;
  try { b = await request.json(); } catch { return reply({ success: 'false' }, 400); }
  if (String(b._honey || '').trim()) return reply({ success: 'true' });

  const minutes = Number(b.slot);
  if (!isValidSlot(b.date, minutes) || !b.name || !isEmail(b.email)) return reply({ success: 'false', error: 'invalid' }, 400);
  const start = at(b.date, minutes);
  const end = at(b.date, minutes + SLOT_MINUTES);
  if (Date.parse(`${start}:00-05:00`) < Date.now()) return reply({ success: 'false', error: 'past' }, 400);

  try {
    if (overlaps(await busyBetween(b.date, b.date), start, end)) {
      return reply({ success: 'false', conflict: true }, 409);
    }
    const rows = [
      ['Reference', b.ref], ['Visit type', b.type], ['Customer', b.name], ['Company', b.company],
      ['Phone', b.phone], ['Email', b.email], ['Address', b.address], ['Scope', b.scope],
      ['Customer present', b.presence], ['Notes', b.notes], ['Photos', b.photos ? `${b.photos} (in the email request)` : 'None'],
    ].filter(([, v]) => v);
    const event = await graph(`/users/${encodeURIComponent(MAILBOX)}/calendars/${await getCalendarId()}/events`, {
      method: 'POST',
      body: {
        subject: `Site visit — ${b.type || 'Estimate'} — ${b.name}`.slice(0, 250),
        start: { dateTime: `${start}:00`, timeZone: TZ },
        end: { dateTime: `${end}:00`, timeZone: TZ },
        location: b.address ? { displayName: String(b.address).slice(0, 250) } : undefined,
        body: {
          contentType: 'HTML',
          content: '<p>Booked from expertfence.com</p><table cellpadding="4">' +
            rows.map(([k, v]) => `<tr><th align="left">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('') + '</table>',
        },
        attendees: [{ emailAddress: { address: String(b.email).trim(), name: String(b.name).slice(0, 100) }, type: 'required' }],
        categories: ['Website booking'],
        showAs: 'busy',
        isReminderOn: true,
        reminderMinutesBeforeStart: 60,
        transactionId: b.ref ? String(b.ref).slice(0, 100) : undefined, // retried submits don't double-book
      },
    });
    return reply({ success: 'true', eventId: event.id });
  } catch (err) {
    console.error('book', err);
    return reply({ success: 'false', error: 'calendar unavailable' }, 502);
  }
}
