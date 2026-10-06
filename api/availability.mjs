// GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
// → {live:true, busy:[{start:"2026-10-12T08:30", end:"2026-10-12T09:15"}, ...]} in Eastern time,
//   read live from the "Estimating" calendar, so anything the team adds, moves or deletes in Outlook shows here.
// → {live:false} when the Microsoft Graph settings aren't in Vercel yet (the page then takes requests only).
import { configured, busyBetween } from './_graph.mjs';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request) {
  const url = new URL(request.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!DATE.test(from || '') || !DATE.test(to || '') || to < from) {
    return Response.json({ error: 'from and to must be YYYY-MM-DD' }, { status: 400 });
  }
  if (!configured()) return Response.json({ live: false });

  try {
    const busy = await busyBetween(from, to);
    return Response.json(
      { live: true, busy },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' } },
    );
  } catch (err) {
    console.error('availability', err);
    return Response.json({ live: false, error: 'calendar unavailable' }, { status: 502 });
  }
}
