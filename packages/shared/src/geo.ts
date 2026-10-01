export interface LatLng { lat: number; lng: number }

/** Great-circle distance in kilometres. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function sortByDistance<T extends LatLng>(from: LatLng, items: T[]): (T & { km: number })[] {
  return items
    .map((i) => ({ ...i, km: distanceKm(from, i) }))
    .sort((x, y) => x.km - y.km);
}
