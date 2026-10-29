// Estimating areas by ZIP code, used to keep each day's site visits close together.
// Two visits in DIFFERENT areas need one free 45-minute block between them for the drive;
// visits in the same area can be back to back. Must match regionOf() in the booking pages.
const AREAS = [
  ['DC', /^20[0-5]/],                      // Washington, DC
  ['MD-Montgomery', /^20[89]/],            // Bethesda, Silver Spring, Rockville, Gaithersburg, Potomac
  ['MD-PG', /^20[67]/],                    // Prince George's, Southern Maryland
  ['VA-Inner', /^22[23]/],                 // Arlington, Alexandria
  ['VA-Fairfax', /^22[01]/],               // Fairfax County, Falls Church, Vienna, McLean
  ['VA-Outer', /^(201|22[4-7])/],          // Loudoun, Prince William, Stafford, Fauquier
];
export const regionOf = (zip) => { const z = String(zip || '').trim(); if (!/^\d{5}/.test(z)) return ''; const a = AREAS.find(([, re]) => re.test(z)); return a ? a[0] : ''; };
export const zipFrom = (text) => { const m = String(text || '').match(/\b(2\d{4})(?:-\d{4})?\b(?!.*\b2\d{4}\b)/); return m ? m[1] : ''; };

/** True when [start,end) (minutes) is too close to a visit in another area that day. */
export function travelConflict(busy, region, start, end, gap = 45) {
  if (!region) return false;
  return busy.some((b) => b.region && b.region !== region && b.s < end + gap && b.e > start - gap);
}
