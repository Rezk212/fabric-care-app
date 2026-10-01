import { stores as allStores } from './data/catalog';
import { products as allProducts } from './data/catalog';
import { distanceKm, type LatLng } from './geo';
import type { FabricType, Product, Store } from './domain';

export interface ProductPick {
  product: Product;
  /** Nearest store in the user's city that carries it, if any. */
  store?: Store;
  km?: number;
}

/**
 * Products suited to a fabric, each with the nearest store in the user's city that stocks it.
 * `origin` is the user's coordinates, or the city centre when location was not shared.
 */
export function recommendProducts(
  fabric: FabricType,
  cityId: string,
  origin?: LatLng,
  products: Product[] = allProducts,
  stores: Store[] = allStores,
): ProductPick[] {
  const inCity = stores.filter((s) => s.cityId === cityId);
  const picks = products
    // Bleach is never suggested from a photo: whether it is safe depends on colour and label, which we can't confirm.
    .filter((p) => fabric !== 'unknown' && p.kind !== 'bleach' && p.forFabrics.includes(fabric))
    .map((product) => {
      const carrying = inCity.filter((s) => s.productIds.includes(product.id));
      const ranked = origin
        ? carrying.map((s) => ({ s, km: distanceKm(origin, s) })).sort((a, b) => a.km - b.km)
        : carrying.map((s) => ({ s, km: undefined as number | undefined }));
      const best = ranked[0];
      return { product, store: best?.s, km: best?.km };
    });
  // Sponsored products rank first, but only ever among products that suit the fabric.
  return picks.sort((a, b) => Number(!!b.product.isSponsored) - Number(!!a.product.isSponsored));
}
