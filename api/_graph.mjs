// Microsoft Graph helper for the estimating calendar (app-only / client-credentials).
// Vercel env: MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET,
//             CALENDAR_MAILBOX (default expertfence@expertfence.com), CALENDAR_NAME (default "Estimating").
// Files starting with "_" in /api are not exposed as endpoints.

export const TZ = 'Eastern Standard Time'; // Windows zone name Graph uses for America/New_York
export const MAILBOX = process.env.CALENDAR_MAILBOX || 'expertfence@expertfence.com';
export const CALENDAR_NAME = process.env.CALENDAR_NAME || 'Estimating';

// Visit hours: Mon–Fri, 45-minute blocks starting 8:30am, last block starts before 1:00pm.
// Must match blocks() in expert-fence-booking.html.
export const SLOT_MINUTES = 45;
export const DAY_START = 510; // 8:30
export const DAY_END = 780;   // 13:00

export const configured = () =>
  Boolean(process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET);

let token = null;
let tokenExpires = 0;
let calendarId = null;

async function getToken() {
  if (token && Date.now() < tokenExpires - 60_000) return token;
  const res = await fetch(`https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID,
      client_secret: process.env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  token = json.access_token;
  tokenExpires = Date.now() + json.expires_in * 1000;
  return token;
}

export async function graph(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      'Content-Type': 'application/json',
      Prefer: `outlook.timezone="${TZ}"`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Graph ${method} ${path} failed: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// Finds the estimating calendar in the mailbox, creating it the first time.
export async function getCalendarId() {
  if (calendarId) return calendarId;
  const user = encodeURIComponent(MAILBOX);
  const list = await graph(`/users/${user}/calendars?$select=id,name&$top=100`);
  const found = list.value.find((c) => c.name.toLowerCase() === CALENDAR_NAME.toLowerCase());
  calendarId = found
    ? found.id
    : (await graph(`/users/${user}/calendars`, { method: 'POST', body: { name: CALENDAR_NAME, color: 'lightGreen' } })).id;
  return calendarId;
}

// Busy blocks in the estimating calendar between two YYYY-MM-DD dates (inclusive), in Eastern time.
export async function busyBetween(fromDate, toDate) {
  const id = await getCalendarId();
  const user = encodeURIComponent(MAILBOX);
  // calendarView reads these as UTC; pad a day each side so the whole Eastern-time range is covered.
  const shift = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
  const qs = new URLSearchParams({
    startDateTime: `${shift(fromDate, -1)}T00:00:00Z`,
    endDateTime: `${shift(toDate, 1)}T23:59:59Z`,
    $select: 'start,end,showAs,isCancelled',
    $top: '500',
  });
  const busy = [];
  let next = `/users/${user}/calendars/${id}/calendarView?${qs}`;
  while (next) {
    const page = await graph(next);
    for (const e of page.value) {
      if (e.isCancelled || e.showAs === 'free') continue;
      busy.push({ start: e.start.dateTime.slice(0, 16), end: e.end.dateTime.slice(0, 16) });
    }
    next = page['@odata.nextLink'] ? page['@odata.nextLink'].replace('https://graph.microsoft.com/v1.0', '') : null;
  }
  return busy;
}

// "2026-10-12" + 510 → "2026-10-12T08:30"
export const at = (date, minutes) =>
  `${date}T${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const overlaps = (busy, start, end) => busy.some((b) => b.start < end && b.end > start);

export const isValidSlot = (date, minutes) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (day === 0 || day === 6) return false;
  return minutes >= DAY_START && minutes < DAY_END && (minutes - DAY_START) % SLOT_MINUTES === 0;
};
