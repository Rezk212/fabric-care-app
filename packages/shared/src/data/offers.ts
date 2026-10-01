import type { Bilingual } from '../domain';

export type OfferCategory = 'washer' | 'dryer' | 'detergent' | 'softener';

export interface Offer {
  id: string;
  category: OfferCategory;
  title: Bilingual;
  subtitle?: Bilingual;
  badge?: Bilingual;
  advertiser?: string;
  linkUrl?: string;
  isSample?: boolean;
}

// SAMPLE OFFERS ONLY: shown until real offers are added in the dashboard (Supabase `offers` table).
export const sampleOffers: Offer[] = [
  { id: 'sample-washer', category: 'washer', isSample: true, badge: { ar: 'خصم ٢٠٪', en: '20% off' },
    title: { ar: 'خصم على الغسالات أمامية التحميل', en: 'Savings on front-load washers' },
    subtitle: { ar: 'على مختارات من الغسالات الموفّرة للماء', en: 'On selected water-saving models' }, advertiser: 'متجر تجريبي' },
  { id: 'sample-dryer', category: 'dryer', isSample: true, badge: { ar: 'هدية', en: 'Free gift' },
    title: { ar: 'اشترِ مجففًا واحصل على هدية', en: 'Buy a dryer, get a gift' },
    subtitle: { ar: 'طقم تنظيف الفلتر مجانًا مع المجففات المختارة', en: 'Free filter-care kit with selected dryers' }, advertiser: 'متجر تجريبي' },
  { id: 'sample-detergent', category: 'detergent', isSample: true, badge: { ar: '١ + ١', en: '1 + 1' },
    title: { ar: 'منظف الغسيل: اشترِ واحدًا والثاني عليه', en: 'Laundry detergent: buy one, get one' },
    subtitle: { ar: 'عبوة اقتصادية للملابس الملوّنة والبيضاء', en: 'Value pack for coloured and white loads' }, advertiser: 'متجر تجريبي' },
  { id: 'sample-softener', category: 'softener', isSample: true, badge: { ar: 'خصم ١٥٪', en: '15% off' },
    title: { ar: 'منعّم ملابس بحجم العائلة', en: 'Family-size fabric softener' },
    subtitle: { ar: 'رائحة تدوم وملمس أنعم', en: 'Longer-lasting scent, softer feel' }, advertiser: 'متجر تجريبي' },
];
