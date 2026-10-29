// GET /api/cron-daily — run every morning by Vercel Cron (see "crons" in vercel.json, ~7 AM Eastern).
//  1. Visit reminders: emails every customer with a site visit TOMORROW (from the Estimating calendar
//     when Microsoft Graph is connected, otherwise from the lead tracker).
//  2. Review requests: emails customers whose job was marked "Job complete" 2+ days ago.
//  3. Office digest to expertfence@: today's visits, new requests nobody has touched, quotes waiting 3+ days.
// Everything is sent at most once per lead / visit (flags kept in the lead tracker store).
import { configured as graphOn, graph, getCalendarId, MAILBOX } from './_graph.mjs';
import { storeConfigured, listLeads, saveLead, getLead } from './_store.mjs';
import { sendMail, wrap, button, esc, isEmail, OFFICE, PHONE, REVIEW_URL, SITE } from './_mail.mjs';

const TZNAME = 'America/New_York';
const ymd = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZNAME, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const longDate = (iso, es) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(es ? 'es-US' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
const hm = (min) => { const h = Math.floor(min / 60), m = min % 60; return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const DAY = 86_400_000;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization') || '';
  const ua = request.headers.get('user-agent') || '';
  if (secret ? auth !== `Bearer ${secret}` : !/vercel-cron/i.test(ua)) return Response.json({ error: 'forbidden' }, { status: 403 });

  const now = new Date();
  const today = ymd(now);
  const tomorrow = ymd(new Date(now.getTime() + DAY));
  const report = { reminders: 0, reviews: 0, errors: [] };
  const leads = storeConfigured() ? await listLeads(500).catch((e) => (report.errors.push('store: ' + e.message), [])) : [];
  const byRef = Object.fromEntries(leads.map((l) => [l.ref, l]));

  // ---------- 1. visits tomorrow (and today, for the digest) ----------
  let visitsTomorrow = [], visitsToday = [];
  if (graphOn()) {
    try {
      const read = async (date) => {
        // calendarView takes UTC; ask for a wide window and keep events whose Eastern start date matches.
        const shift = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
        const qs = new URLSearchParams({ startDateTime: `${shift(date, -1)}T12:00:00Z`, endDateTime: `${shift(date, 1)}T12:00:00Z`, $select: 'subject,start,location,attendees,body,isCancelled', $top: '200' });
        const page = await graph(`/users/${encodeURIComponent(MAILBOX)}/calendars/${await getCalendarId()}/calendarView?${qs}`);
        return page.value.filter((e) => !e.isCancelled && e.start.dateTime.slice(0, 10) === date).map((e) => {
          const t = e.start.dateTime.slice(11, 16).split(':');
          const ref = ((e.body && e.body.content) || '').match(/EF[A-Z]{0,2}-\d{6}-[A-Z0-9]{3,10}/);
          const att = (e.attendees || []).map((a) => a.emailAddress).find((a) => a && isEmail(a.address) && a.address.toLowerCase() !== MAILBOX.toLowerCase());
          return { id: e.id, date, slot: +t[0] * 60 + +t[1], subject: e.subject, address: e.location && e.location.displayName, email: att && att.address, name: att && att.name, ref: ref && ref[0] };
        });
      };
      visitsTomorrow = await read(tomorrow);
      visitsToday = await read(today);
    } catch (e) { report.errors.push('calendar: ' + e.message); }
  } else {
    // Without the live calendar, only visits the office has confirmed (stage "Confirmed") get reminders.
    const fromLeads = (date) => leads.filter((l) => l.visit && l.visit.date === date && l.stage === 'Confirmed')
      .map((l) => ({ id: l.ref, date, slot: l.visit.slot, subject: `Site visit — ${l.name}`, address: l.address, email: l.email, name: l.name, ref: l.ref }));
    visitsTomorrow = fromLeads(tomorrow);
    visitsToday = fromLeads(today);
  }

  for (const v of visitsTomorrow) {
    const lead = (v.ref && byRef[v.ref]) || leads.find((l) => l.email && v.email && l.email.toLowerCase() === v.email.toLowerCase() && l.visit && l.visit.date === v.date);
    if (!v.email || (lead && lead.reminderFor === `${v.date}T${v.slot}`)) continue;
    const es = lead && lead.lang === 'es';
    const when = `${longDate(v.date, es)} ${es ? 'a las' : 'at'} ${hm(v.slot)}`;
    const name = esc((v.name || (lead && lead.name) || '').split(' ')[0]);
    const html = es ? wrap(
      `<p>Hola ${name}:</p><p>Le recordamos su <b>presupuesto gratis de cerca mañana, ${esc(when)}</b>${v.address ? ` en <b>${esc(v.address)}</b>` : ''}. La visita dura de 30 a 45 minutos.</p>` +
      `<p><b>Para aprovechar la visita:</b></p><ul><li>Si tiene el plano o levantamiento de la propiedad, téngalo a mano.</li><li>Si sabe dónde están las esquinas del terreno, márquelas.</li><li>Si tiene HOA, tenga sus reglas de cercas.</li><li>Deje las mascotas adentro mientras recorremos el patio.</li></ul>` +
      `<p>¿Necesita cambiar la hora? Responda a este correo o llame al <a href="tel:+17037513008">${PHONE}</a>.</p>`)
      : wrap(
      `<p>Hi ${name},</p><p>This is a reminder of your <b>free fence estimate tomorrow, ${esc(when)}</b>${v.address ? ` at <b>${esc(v.address)}</b>` : ''}. The visit takes 30 to 45 minutes.</p>` +
      `<p><b>To get the most out of it:</b></p><ul><li>Have your property survey or plat handy if you have one.</li><li>If you know where your property corners are, mark them.</li><li>If you have an HOA, have its fence guidelines ready.</li><li>Keep pets inside while we walk the yard.</li></ul>` +
      `<p>Need a different time? Reply to this email or call <a href="tel:+17037513008">${PHONE}</a>.</p>`);
    try {
      await sendMail({ to: v.email, subject: es ? `Recordatorio: su presupuesto de cerca es mañana, ${hm(v.slot)}` : `Reminder: your fence estimate is tomorrow at ${hm(v.slot)}`, html,
        text: (es ? `Recordatorio: su presupuesto de cerca es mañana, ${when}. ` : `Reminder: your fence estimate is tomorrow, ${when}. `) + `${v.address || ''} ${PHONE}` });
      report.reminders++;
      if (lead) await saveLead(lead.ref, { reminderFor: `${v.date}T${v.slot}`, history: [{ t: now.toISOString(), by: 'automation', what: `Visit reminder emailed for ${when}` }] });
    } catch (e) { report.errors.push(`reminder ${v.email}: ${e.message}`); }
  }

  // ---------- 2. review requests ----------
  for (const l of leads) {
    if (l.stage !== 'Job complete' || l.reviewSentAt || l.noReview || !isEmail(l.email) || !l.completedAt) continue;
    if (now - Date.parse(l.completedAt) < 2 * DAY) continue;
    const es = l.lang === 'es'; const name = esc((l.name || '').split(' ')[0]);
    const html = es ? wrap(
      `<p>Hola ${name}:</p><p>Gracias por confiar en Expert Fence para su proyecto. Esperamos que esté disfrutando su cerca nueva.</p>` +
      `<p>¿Nos haría un favor? Una reseña rápida en Google ayuda a otros vecinos a encontrar un contratista de confianza, y nos ayuda muchísimo como empresa local.</p><p>${button(REVIEW_URL, '★ Dejar una reseña en Google')}</p>` +
      `<p>Si algo no quedó perfecto, responda a este correo primero: queremos arreglarlo.</p>`)
      : wrap(
      `<p>Hi ${name},</p><p>Thank you for trusting Expert Fence with your project. We hope you're enjoying the new fence.</p>` +
      `<p>Would you do us a favor? A quick Google review helps your neighbors find a contractor they can trust, and it means a lot to a local family business.</p><p>${button(REVIEW_URL, '★ Leave a Google review')}</p>` +
      `<p>If anything isn't perfect, reply to this email first. We want to make it right.</p>`);
    try {
      await sendMail({ to: l.email, subject: es ? '¿Cómo quedó su cerca? Cuéntenos' : 'How did your fence turn out?', html, text: `${es ? 'Déjenos una reseña en Google' : 'Leave us a Google review'}: ${REVIEW_URL}` });
      report.reviews++;
      await saveLead(l.ref, { reviewSentAt: now.toISOString(), history: [{ t: now.toISOString(), by: 'automation', what: 'Review request emailed' }] });
    } catch (e) { report.errors.push(`review ${l.email}: ${e.message}`); }
  }

  // ---------- 3. office digest ----------
  const stale = leads.filter((l) => l.stage === 'New' && now - Date.parse(l.created) > 2 * 3600_000);
  const quotes = leads.filter((l) => l.stage === 'Quote sent' && l.quoteSentAt && now - Date.parse(l.quoteSentAt) > 3 * DAY);
  if (visitsToday.length || stale.length || quotes.length || report.reminders || report.reviews || report.errors.length) {
    const row = (cells) => '<tr>' + cells.map((c) => `<td style="border:1px solid #e6e3da;padding:6px 8px">${c}</td>`).join('') + '</tr>';
    const table = (head, rows) => rows.length ? `<table style="border-collapse:collapse;font-size:14px;margin:6px 0 16px"><tr>${head.map((h) => `<th align="left" style="background:#f2f0e9;border:1px solid #e6e3da;padding:6px 8px">${h}</th>`).join('')}</tr>${rows.join('')}</table>` : '<p style="color:#6e756a">None.</p>';
    const days = (iso) => Math.floor((now - Date.parse(iso)) / DAY);
    const html = wrap(
      `<p><b>Good morning — here's today at a glance.</b> <a href="${SITE}/admin.html">Open the lead tracker</a></p>` +
      `<h3 style="margin:14px 0 4px">Site visits today (${visitsToday.length})</h3>` +
      table(['Time', 'Customer', 'Address'], visitsToday.sort((a, b) => a.slot - b.slot).map((v) => row([hm(v.slot), esc(v.name || v.subject || ''), esc(v.address || '')]))) +
      `<h3 style="margin:14px 0 4px">New requests nobody has answered (${stale.length})</h3>` +
      table(['Received', 'Customer', 'Phone', 'What'], stale.map((l) => row([new Date(l.created).toLocaleString('en-US', { timeZone: TZNAME, dateStyle: 'short', timeStyle: 'short' }), esc(l.name), esc(l.phone), esc(l.service || l.source)]))) +
      `<h3 style="margin:14px 0 4px">Quotes waiting 3+ days for an answer (${quotes.length})</h3>` +
      table(['Customer', 'Phone', 'Quote', 'Sent'], quotes.map((l) => row([esc(l.name), esc(l.phone), esc(l.quote || ''), `${days(l.quoteSentAt)} days ago`]))) +
      `<p style="font-size:13px;color:#6e756a">Sent automatically this morning: ${report.reminders} visit reminder(s), ${report.reviews} review request(s).${report.errors.length ? ' Problems: ' + esc(report.errors.join('; ')) : ''}</p>`);
    try { await sendMail({ to: OFFICE, subject: `Today: ${visitsToday.length} visit(s), ${stale.length} new request(s) waiting, ${quotes.length} quote(s) to follow up`, html, text: 'Open the lead tracker: ' + SITE + '/admin.html' }); }
    catch (e) { report.errors.push('digest: ' + e.message); }
  }
  console.log('cron-daily', JSON.stringify(report));
  return Response.json({ ok: true, ...report, store: storeConfigured(), calendar: graphOn() });
}
