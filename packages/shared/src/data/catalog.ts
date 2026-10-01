import type { Product, Store } from '../domain';

// SAMPLE DATA ONLY. Not real products, shops or locations. Replace with a real source.
export const products: Product[] = [
  { id: 'p-detergent-gentle', kind: 'detergent', name: { ar: 'منظف لطيف (عينة)', en: 'Gentle detergent (sample)' }, forFabrics: ['cotton', 'linen', 'denim', 'polyester', 'nylon', 'synthetic_blend', 'viscose'], isSample: true, isSponsored: true },
  { id: 'p-delicate-wash', kind: 'delicate_wash', name: { ar: 'غسول الأقمشة الرقيقة (عينة)', en: 'Delicate fabric wash (sample)' }, forFabrics: ['silk', 'viscose', 'cashmere'], isSample: true },
  { id: 'p-wool-wash', kind: 'wool_wash', name: { ar: 'غسول الصوف (عينة)', en: 'Wool wash (sample)' }, forFabrics: ['wool', 'cashmere'], isSample: true },
  { id: 'p-softener', kind: 'softener', name: { ar: 'مُنعّم أقمشة (عينة)', en: 'Fabric softener (sample)' }, forFabrics: ['cotton', 'linen', 'polyester', 'synthetic_blend'], isSample: true },
  { id: 'p-stain', kind: 'stain_remover', name: { ar: 'مزيل بقع (عينة)', en: 'Stain remover (sample)' }, forFabrics: ['cotton', 'linen', 'denim', 'polyester', 'synthetic_blend'], isSample: true },
];

export const stores: Store[] = [
  { id: 's-muscat-1', name: { ar: 'متجر تجريبي ١ — مسقط', en: 'Sample store 1 — Muscat' }, cityId: 'muscat', lat: 23.5933, lng: 58.4066, productIds: ['p-detergent-gentle', 'p-softener', 'p-stain'], isSample: true },
  { id: 's-muscat-2', name: { ar: 'متجر تجريبي ٢ — مسقط', en: 'Sample store 2 — Muscat' }, cityId: 'muscat', lat: 23.6172, lng: 58.5013, productIds: ['p-delicate-wash', 'p-wool-wash', 'p-detergent-gentle'], isSample: true },
  { id: 's-salalah-1', name: { ar: 'متجر تجريبي ١ — صلالة', en: 'Sample store 1 — Salalah' }, cityId: 'salalah', lat: 17.0211, lng: 54.1012, productIds: ['p-detergent-gentle', 'p-softener'], isSample: true },
  { id: 's-sohar-1', name: { ar: 'متجر تجريبي ١ — صحار', en: 'Sample store 1 — Sohar' }, cityId: 'sohar', lat: 24.3561, lng: 56.7302, productIds: ['p-detergent-gentle', 'p-stain', 'p-delicate-wash'], isSample: true },
];
