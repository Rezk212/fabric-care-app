import { distanceKm, matchChain, omanChains, type Chain, type LatLng } from '@naqa/shared';

export interface Branch extends LatLng {
  id: string;
  name: string;
  chain: Chain;
  km: number;
  address?: string;
}

const ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const cache = new Map<string, { at: number; data: Branch[] }>();
const RADIUS_M = 60_000;

function query(o: LatLng) {
  const rx = omanChains.map((c) => c.match.source).join('|');
  const around = `(around:${RADIUS_M},${o.lat},${o.lng})`;
  const kinds = '["shop"~"supermarket|department_store|wholesale|convenience"]';
  return `[out:json][timeout:25];(`
    + `nwr${kinds}["name"~"${rx}",i]${around};`
    + `nwr${kinds}["name:ar"~"${rx}",i]${around};`
    + `nwr${kinds}["brand"~"${rx}",i]${around};`
    + `);out center tags 300;`;
}

/** Real branches of the trusted chains near a point, nearest first. Throws when offline. */
export async function fetchBranches(origin: LatLng): Promise<Branch[]> {
  const key = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 6 * 3600_000) return hit.data;

  let json: any;
  let lastError: unknown;
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, { method: 'POST', body: `data=${encodeURIComponent(query(origin))}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      if (!res.ok) throw new Error(`overpass ${res.status}`);
      json = await res.json();
      break;
    } catch (e) { lastError = e; }
  }
  if (!json) throw lastError ?? new Error('overpass failed');

  const seen = new Set<string>();
  const out: Branch[] = [];
  for (const el of json.elements ?? []) {
    const tags = el.tags ?? {};
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;
    const chain = matchChain(tags.name, tags['name:en'], tags['name:ar'], tags.brand);
    if (!chain) continue;
    const id = `${el.type}${el.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const address = [tags['addr:street'], tags['addr:suburb'] ?? tags['addr:city']].filter(Boolean).join(', ') || undefined;
    out.push({ id, name: tags['name:en'] ?? tags.name ?? chain.name.en, chain, lat, lng, km: distanceKm(origin, { lat, lng }), address });
  }
  out.sort((a, b) => a.km - b.km);
  cache.set(key, { at: Date.now(), data: out });
  return out;
}
