// Spam checks shared by /api/contact and /api/book. (Files starting with "_" are not public endpoints.)
//
// verdict:
//   'block'   — certainly a bot: dropped silently (the bot is told it worked, so it doesn't retry or adapt)
//   'suspect' — probably spam: delivered to the office with "[Possible spam]" in the subject, no customer copy
//   'ok'      — delivered normally
// A real customer is never silently dropped for anything ambiguous; ambiguous cases are only flagged.

const ALLOWED = ['https://www.expertfence.com', 'https://expertfence.com'];
const MIN_SECONDS = 3;                      // nobody fills in a fence request in under 3 seconds
const SPAM_WORDS = /\b(seo|backlinks?|guest post|first page of google|rank(ing)? (on|in) google|google ranking|web ?design(er)?|website (design|redesign|development)|app development|lead generation|digital marketing|marketing agency|social media marketing|crypto|bitcoin|forex|casino|betting|viagra|cialis|loan offer|business loan|funding offer|merchant cash|virtual assistant|outsourc\w*|bulk email|email list|unsubscribe)\b/i;
const FOREIGN_SCRIPT = /[Ѐ-ӿ؀-ۿ฀-๿぀-ヿ一-鿿가-힯]/; // Cyrillic, Arabic, Thai, Japanese, Chinese, Korean
const URL_RE = /(https?:\/\/|www\.)\S+/gi;

function sig(s) { let x = 7; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 1000003; return x.toString(36); }

/** Request-level checks: where the request came from and how it was sent. */
export function checkRequest(request) {
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const fromSite = (u) => ALLOWED.some((a) => u.startsWith(a)) || /^https:\/\/[\w-]+\.vercel\.app/.test(u);
  // Browsers always send Origin (or at least Referer) on a form POST; scripts posting directly usually send neither.
  if (!origin && !referer) return { verdict: 'block', reason: 'no origin or referer' };
  if (origin && !fromSite(origin)) return { verdict: 'block', reason: 'foreign origin ' + origin };
  if (!origin && !fromSite(referer)) return { verdict: 'block', reason: 'foreign referer' };

  const token = request.headers.get('x-ef-form') || '';
  const [stamp, s, human, secs] = token.split('.');
  if (!stamp || s !== sig(stamp)) return { verdict: 'suspect', reason: 'no form token' }; // e.g. script blocked: flag, never drop
  if (Number(secs) < MIN_SECONDS) return { verdict: 'block', reason: `sent ${secs}s after page load` };
  if (human !== '1') return { verdict: 'suspect', reason: 'no typing or taps on the page' };
  return { verdict: 'ok' };
}

/** Content checks on the submitted fields: [[name, value], ...] plus the raw trap field. */
export function checkContent(rows, trapValue) {
  if (String(trapValue || '').trim()) return { verdict: 'block', reason: 'trap field filled' };
  const get = (re) => (rows.find(([k]) => re.test(k)) || [, ''])[1];
  const name = String(get(/^(name|customer|full ?name|nombre)$/i));
  const all = rows.map(([, v]) => v).join('\n');
  if (/https?:\/\/|www\.|@/.test(name)) return { verdict: 'block', reason: 'link or email in name' };
  if (name.length > 80) return { verdict: 'block', reason: 'name too long' };
  // Links are expected only in our own generated fields (the drawing link, Google Maps link).
  const userText = rows.filter(([k]) => !/^(open the drawing|satellite|calendar|reference)/i.test(k)).map(([, v]) => v).join('\n');
  const links = (userText.match(URL_RE) || []).length;
  if (links >= 3) return { verdict: 'block', reason: `${links} links` };
  if (FOREIGN_SCRIPT.test(all)) return { verdict: 'suspect', reason: 'non-Latin script' };
  if (SPAM_WORDS.test(userText)) return { verdict: 'suspect', reason: 'sales-pitch wording' };
  if (links >= 1) return { verdict: 'suspect', reason: 'contains a link' };
  return { verdict: 'ok' };
}

/** The stricter of two verdicts. */
export function worst(a, b) {
  const rank = { ok: 0, suspect: 1, block: 2 };
  return rank[a.verdict] >= rank[b.verdict] ? a : b;
}
