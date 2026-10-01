import type { Bilingual, Product } from '../domain';

export type ProductCategory = 'bleach' | 'colors' | 'softeners' | 'other';

export const productCategories: { id: ProductCategory; name: Bilingual }[] = [
  { id: 'bleach', name: { ar: 'منتجات التبييض', en: 'Bleaching' } },
  { id: 'colors', name: { ar: 'منتجات الألوان', en: 'Colour care' } },
  { id: 'softeners', name: { ar: 'منعّمات الملابس', en: 'Fabric softeners' } },
  { id: 'other', name: { ar: 'منتجات أخرى', en: 'Other products' } },
];

export function categoryOf(kind: Product['kind']): ProductCategory {
  if (kind === 'bleach') return 'bleach';
  if (kind === 'color_care') return 'colors';
  if (kind === 'softener') return 'softeners';
  return 'other';
}
