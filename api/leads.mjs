// Lead tracker API (sign-in required, see _auth.mjs).
// GET  /api/leads                          → {configured, leads:[...]}
// POST /api/leads {ref, stage?, note?, quote?}      → updates a lead (stage changes are timestamped)
// POST /api/leads {add:{name, phone, email, ...}}   → adds a lead that came in by phone or walk-in
import { verify } from './_auth.mjs';
import { storeConfigured, listLeads, saveLead, getLead, STAGES } from './_store.mjs';

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const clip = (s, n = 300) => String(s ?? '').slice(0, n);

export async function GET(request) {
  if (!verify(request)) return json({ error: 'sign in' }, 401);
  if (!storeConfigured()) return json({ configured: false, leads: [] });
  try { return json({ configured: true, stages: STAGES, leads: await listLeads() }); }
  catch (err) { console.error('leads list', err); return json({ error: 'store unavailable' }, 502); }
}

export async function POST(request) {
  const who = verify(request);
  if (!who) return json({ error: 'sign in' }, 401);
  if (!storeConfigured()) return json({ error: 'not configured' }, 503);
  let b; try { b = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
  const now = new Date().toISOString();
  try {
    if (b.add) {
      const a = b.add;
      if (!a.name) return json({ error: 'name required' }, 400);
      const ref = 'EF-' + now.slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      const lead = await saveLead(ref, {
        source: clip(a.source || 'Phone / walk-in', 60), name: clip(a.name, 100), phone: clip(a.phone, 40), email: clip(a.email, 120),
        address: clip(a.address, 200), service: clip(a.service, 120), notes: clip(a.notes, 2000), lang: a.lang === 'es' ? 'es' : 'en',
        history: [{ t: now, by: who, what: 'Added by hand' }],
      });
      return json({ lead });
    }
    const lead = await getLead(clip(b.ref, 40));
    if (!lead) return json({ error: 'not found' }, 404);
    const patch = { history: [] };
    if (b.stage && STAGES.includes(b.stage) && b.stage !== lead.stage) {
      patch.stage = b.stage;
      patch.history.push({ t: now, by: who, what: `Stage: ${lead.stage} → ${b.stage}` });
      if (b.stage === 'Quote sent') patch.quoteSentAt = now;
      if (b.stage === 'Job complete') patch.completedAt = now;
      if (b.stage === 'Won') patch.wonAt = now;
    }
    if (b.quote !== undefined) { patch.quote = clip(b.quote, 40); patch.history.push({ t: now, by: who, what: `Quote: ${patch.quote}` }); }
    if (b.note) patch.history.push({ t: now, by: who, what: clip(b.note, 1000) });
    if (b.noReview !== undefined) patch.noReview = !!b.noReview;
    // Edit customer details: only these fields, each trimmed and length-capped; changes go in the history.
    if (b.edit && typeof b.edit === 'object') {
      const LIMIT = { name: 100, phone: 40, email: 120, company: 100, address: 200, zip: 10, service: 200, notes: 2000, lang: 2 };
      const changed = [];
      for (const [k, n] of Object.entries(LIMIT)) {
        if (b.edit[k] === undefined) continue;
        let v = clip(String(b.edit[k]).trim(), n);
        if (k === 'lang') v = v === 'es' ? 'es' : 'en';
        if (k === 'email' && v && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v)) return json({ error: 'That email address does not look right.' }, 400);
        if (v !== (lead[k] || (k === 'lang' ? 'en' : ''))) { patch[k] = v; changed.push(k); }
      }
      if (changed.length) patch.history.push({ t: now, by: who, what: `Edited: ${changed.join(', ')}` });
    }
    return json({ lead: await saveLead(lead.ref, patch) });
  } catch (err) { console.error('leads update', err); return json({ error: 'store unavailable' }, 502); }
}
