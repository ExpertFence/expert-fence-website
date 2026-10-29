// Lead storage for the lead tracker, reminders and review requests (Upstash Redis REST API).
// Vercel > Storage > Upstash for Redis > Connect to project adds KV_REST_API_URL and KV_REST_API_TOKEN
// (older integrations: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Without them every call is a
// no-op and the website keeps working exactly as before (leads still arrive by email).
//
// Data: "lead:<ref>" = JSON lead, sorted set "leads" = refs by creation time (ms).

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const storeConfigured = () => Boolean(URL_ && TOKEN);

export const STAGES = ['New', 'Confirmed', 'Visit done', 'Quote sent', 'Won', 'Job complete', 'Lost', 'Spam'];

async function redis(cmds) {
  const res = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error(`Redis ${res.status} ${await res.text()}`);
  const out = await res.json();
  const err = out.find((r) => r.error);
  if (err) throw new Error(`Redis ${err.error}`);
  return out.map((r) => r.result);
}

export async function getLead(ref) {
  if (!storeConfigured() || !ref) return null;
  const [v] = await redis([['GET', `lead:${ref}`]]);
  return v ? JSON.parse(v) : null;
}

/** Creates or merges a lead. `history` entries are appended, never replaced. */
export async function saveLead(ref, patch) {
  if (!storeConfigured() || !ref) return null;
  const old = (await getLead(ref)) || { ref, created: new Date().toISOString(), stage: 'New', history: [] };
  const lead = { ...old, ...patch, ref, history: [...(old.history || []), ...(patch.history || [])] };
  lead.updated = new Date().toISOString();
  await redis([
    ['SET', `lead:${ref}`, JSON.stringify(lead)],
    ['ZADD', 'leads', 'NX', String(Date.parse(lead.created)), ref],
  ]);
  return lead;
}

/** Newest first. */
export async function listLeads(limit = 300) {
  if (!storeConfigured()) return [];
  const [refs] = await redis([['ZRANGE', 'leads', '0', String(limit - 1), 'REV']]);
  if (!refs || !refs.length) return [];
  const vals = await redis(refs.map((r) => ['GET', `lead:${r}`]));
  return vals.filter(Boolean).map((v) => JSON.parse(v));
}
