import { distanceKm, matchChain, type Chain, type LatLng } from '@naqa/shared';

export interface Branch extends LatLng {
  id: string;
  name: string;
  chain: Chain;
  km: number;
  address?: string;
}

const cache = new Map<string, { at: number; data: Branch[] }>();
const RADIUS_KM = 40;
/** One quick search per chain (fast, indexed) instead of one heavy scan of the whole map. */
const SEARCHES: { chainId: string; q: string }[] = [
  { chainId: 'lulu', q: 'Lulu Hypermarket' },
  { chainId: 'hypermax', q: 'Hypermax' },
  { chainId: 'nesto', q: 'Nesto Hypermarket' },
  { chainId: 'makkah', q: 'Makkah Hypermarket' },
  { chainId: 'almeera', q: 'Al Meera' },
  { chainId: 'carrefour', q: 'Carrefour' },
  { chainId: 'sultan', q: 'Sultan Center' },
  { chainId: 'ramez', q: 'Ramez' },
];

async function searchOne(q: string, o: LatLng): Promise<any[]> {
  const dLat = RADIUS_KM / 111;
  const dLng = RADIUS_KM / (111 * Math.cos((o.lat * Math.PI) / 180));
  const bbox = [o.lng - dLng, o.lat - dLat, o.lng + dLng, o.lat + dLat].join(',');
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=40&bbox=${bbox}`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12_000);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`photon ${res.status}`);
    return (await res.json()).features ?? [];
  } finally { clearTimeout(timer); }
}

/** Real branches of the trusted chains near a point, nearest first. Throws when every search fails. */
export async function fetchBranches(origin: LatLng): Promise<Branch[]> {
  const key = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.data;

  const results = await Promise.allSettled(SEARCHES.map((s) => searchOne(s.q, origin)));
  const errors = results.flatMap((r) => (r.status === 'rejected' ? [String(r.reason?.message ?? r.reason)] : []));
  if (errors.length === results.length) throw new Error([...new Set(errors)].join(' | '));

  const seen = new Set<string>();
  const out: Branch[] = [];
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const f of r.value) {
      const p = f.properties ?? {};
      const [lng, lat] = f.geometry?.coordinates ?? [];
      if (lat == null || lng == null) continue;
      const chain = matchChain(p.name);
      if (!chain) continue;
      const id = `${p.osm_type}${p.osm_id}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const address = [p.street, p.district ?? p.city].filter(Boolean).join(', ') || undefined;
      const km = distanceKm(origin, { lat, lng });
      if (km > RADIUS_KM) continue;
      out.push({ id, name: p.name, chain, lat, lng, km, address });
    }
  }
  out.sort((a, b) => a.km - b.km);
  cache.set(key, { at: Date.now(), data: out });
  return out;
}
