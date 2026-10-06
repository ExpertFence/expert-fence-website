// GET /api/geocode?q=6027 Farrington Ave, Alexandria VA
// → {lat, lng, address} using the free US Census geocoder (no key; it doesn't allow browser calls directly).
export async function GET(request) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 200);
  if (q.length < 5) return Response.json({ error: 'address required' }, { status: 400 });

  const url = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?' +
    new URLSearchParams({ address: q, benchmark: 'Public_AR_Current', format: 'json' });
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'expertfence.com fence measuring tool' } });
    const match = (await res.json())?.result?.addressMatches?.[0];
    if (!match) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json(
      { lat: match.coordinates.y, lng: match.coordinates.x, address: match.matchedAddress },
      { headers: { 'Cache-Control': 'public, s-maxage=86400' } },
    );
  } catch (err) {
    console.error('geocode', err);
    return Response.json({ error: 'lookup failed' }, { status: 502 });
  }
}
