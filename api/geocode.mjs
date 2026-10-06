// GET /api/geocode?q=6027 Farrington Ave 22304
// → {matches:[{lat, lng, address}, ...]} — up to 5, best first.
// Tries the US Census geocoder (exact street addresses), then OpenStreetMap Nominatim
// (forgiving: partial addresses, place names), biased to the DC/MD/VA service area.
// Both are free and keyless; neither allows browser calls directly, hence this proxy.
const DMV_VIEWBOX = '-78.6,39.75,-76.2,38.2'; // left,top,right,bottom
const UA = 'expertfence.com fence measuring tool (expertfence@expertfence.com)';
const json = (body, status = 200) =>
  Response.json(body, { status, headers: status === 200 ? { 'Cache-Control': 'public, s-maxage=86400' } : {} });

async function census(q) {
  const url = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?' +
    new URLSearchParams({ address: q, benchmark: 'Public_AR_Current', format: 'json' });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const matches = (await res.json())?.result?.addressMatches || [];
  return matches.slice(0, 5).map((m) => ({ lat: m.coordinates.y, lng: m.coordinates.x, address: m.matchedAddress }));
}

async function osm(q) {
  const url = 'https://nominatim.openstreetmap.org/search?' + new URLSearchParams({
    q, format: 'jsonv2', limit: '5', countrycodes: 'us', viewbox: DMV_VIEWBOX, addressdetails: '0',
  });
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.expertfence.com/' } });
  const rows = await res.json();
  return (Array.isArray(rows) ? rows : []).map((r) => ({
    lat: +r.lat, lng: +r.lon, address: r.display_name.replace(/, United States$/, ''),
  }));
}

export async function GET(request) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 200);
  if (q.length < 5) return json({ error: 'address required', matches: [] }, 400);
  try {
    let matches = await census(q).catch(() => []);
    if (!matches.length) matches = await osm(q).catch(() => []);
    return json({ matches });
  } catch (err) {
    console.error('geocode', err);
    return json({ error: 'lookup failed', matches: [] }, 502);
  }
}
