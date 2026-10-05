import type { Bilingual, FabricType, Locale } from '../domain';
import type { ColorId } from './wardrobe';

export type CareKind = 'detergent' | 'softener';
export type CareTrait = 'powder' | 'liquid' | 'capsule' | 'bio' | 'delicate' | 'wool' | 'colour' | 'baby' | 'bar' | 'whites' | 'handwash' | 'sheet';

export interface CareProductOption {
  id: string;
  kind: CareKind;
  group: 'type' | 'brand';
  name: Bilingual;
  traits: CareTrait[];
}

const O = (id: string, kind: CareKind, group: 'type' | 'brand', ar: string, en: string, traits: CareTrait[] = []): CareProductOption =>
  ({ id, kind, group, name: { ar, en }, traits });

/**
 * What the user already uses at home. Types describe the product; brands are just names to pick
 * (no logos or photos) and carry no claims about the product.
 */
export const careProductOptions: CareProductOption[] = [
  O('det_powder', 'detergent', 'type', 'مسحوق غسيل', 'Washing powder', ['powder']),
  O('det_liquid', 'detergent', 'type', 'منظف سائل', 'Liquid detergent', ['liquid']),
  O('det_capsule', 'detergent', 'type', 'كبسولات أو أقراص غسيل', 'Capsules or pods', ['capsule', 'liquid']),
  O('det_bio', 'detergent', 'type', 'منظف بالإنزيمات (بيو)', 'Biological (enzyme) detergent', ['bio']),
  O('det_whites', 'detergent', 'type', 'منظف مخصص للأبيض', 'Detergent for whites', ['whites']),
  O('det_colour', 'detergent', 'type', 'منظف مخصص للألوان', 'Colour-care detergent', ['colour', 'liquid']),
  O('det_delicate', 'detergent', 'type', 'غسول للأقمشة الرقيقة', 'Delicate wash', ['delicate', 'liquid']),
  O('det_wool', 'detergent', 'type', 'غسول الصوف', 'Wool wash', ['wool', 'delicate', 'liquid']),
  O('det_baby', 'detergent', 'type', 'منظف للأطفال (لطيف وخالٍ من العطور)', 'Baby detergent (mild, fragrance-free)', ['baby', 'liquid']),
  O('det_bar', 'detergent', 'type', 'صابون غسيل (قطعة)', 'Laundry bar soap', ['bar']),
  O('det_handwash', 'detergent', 'type', 'منظف للغسيل اليدوي (رغوته كثيرة)', 'Hand-wash detergent (high foam)', ['handwash']),
  O('det_ariel', 'detergent', 'brand', 'أرييل (Ariel)', 'Ariel'),
  O('det_tide', 'detergent', 'brand', 'تايد (Tide)', 'Tide'),
  O('det_persil', 'detergent', 'brand', 'برسيل (Persil)', 'Persil'),
  O('det_omo', 'detergent', 'brand', 'أومو (OMO)', 'OMO'),
  O('det_surf', 'detergent', 'brand', 'سيرف إكسل (Surf Excel)', 'Surf Excel'),
  O('sof_liquid', 'softener', 'type', 'منعّم سائل', 'Liquid softener', ['liquid']),
  O('sof_concentrate', 'softener', 'type', 'منعّم مركّز', 'Concentrated softener', ['liquid']),
  O('sof_sheets', 'softener', 'type', 'أوراق منعّم للمجفف', 'Dryer sheets', ['sheet']),
  O('sof_beads', 'softener', 'type', 'حبيبات معطّرة للغسيل', 'Scent booster beads', []),
  O('sof_baby', 'softener', 'type', 'منعّم للأطفال (خالٍ من العطور)', 'Baby softener (fragrance-free)', ['baby']),
  O('sof_comfort', 'softener', 'brand', 'كومفورت (Comfort)', 'Comfort'),
  O('sof_downy', 'softener', 'brand', 'داوني (Downy)', 'Downy'),
  O('sof_lenor', 'softener', 'brand', 'لينور (Lenor)', 'Lenor'),
];

export const careGroupNames: Record<'type' | 'brand', Bilingual> = {
  type: { ar: 'حسب النوع', en: 'By type' },
  brand: { ar: 'حسب الماركة', en: 'By brand' },
};

export interface CareAdviceLine { tone: 'good' | 'warn'; text: Bilingual }

export interface CareAdviceInput {
  fabric: FabricType;
  colorId?: ColorId;
  garmentId?: string;
  program?: string;
  detergents: string[];
  softeners: string[];
}

const DELICATE_FABRICS: FabricType[] = ['silk', 'wool', 'cashmere', 'viscose'];
const NO_SOFTENER_GARMENTS = ['sportswear', 'swimwear', 'raincoat', 'towels'];

/**
 * Compares what the user already owns with what this garment needs, so the app can say "yours is fine" or
 * "consider a different one". It only looks at product types, never at brand claims, and says nothing when
 * the user has not listed any products.
 */
export function careProductAdvice(i: CareAdviceInput): CareAdviceLine[] {
  const mine = careProductOptions.filter((o) => i.detergents.includes(o.id));
  const sofs = careProductOptions.filter((o) => i.softeners.includes(o.id));
  const has = (t: CareTrait) => mine.some((o) => o.traits.includes(t));
  const out: CareAdviceLine[] = [];
  if (mine.length === 0 && sofs.length === 0) return out;
  const L = (tone: 'good' | 'warn', ar: string, en: string) => out.push({ tone, text: { ar, en } });

  if (mine.length > 0) {
    const machineProduct = mine.some((o) => !o.traits.includes('handwash') && !o.traits.includes('bar'));
    if (!machineProduct && i.program && i.program !== 'hand_wash') {
      L('warn', 'منظفاتك المذكورة للغسيل اليدوي، ورغوتها كثيرة وقد تضر بالغسالة. استخدم منظفًا مخصصًا للغسالات عند الغسيل الآلي.',
        'The products you listed are for hand washing and foam heavily, which can trouble a machine. Use a machine detergent for machine washing.');
    }
    if (DELICATE_FABRICS.includes(i.fabric)) {
      if (has('delicate') || has('wool') || has('baby')) L('good', 'منظفك الحالي مناسب لهذا القماش الرقيق.', 'What you use suits this delicate fabric.');
      else if (has('bio') || has('powder') || has('whites') || has('bar')) L('warn', 'المساحيق والمنظفات الإنزيمية قد تتلف الحرير والصوف وتجعلهما خشنين. الأنسب غسول مخصص للأقمشة الرقيقة (أو للصوف).', 'Powders and enzyme detergents can damage silk and wool and leave them rough. A delicate wash (or wool wash) is the better choice.');
      else L('warn', 'منظفك قد يناسب قطعًا عادية، لكن لهذا القماش الرقيق الأفضل غسول مخصص للأقمشة الرقيقة.', 'What you use may be fine for everyday items, but for this delicate fabric a dedicated delicate wash is better.');
    }
    const darkish = i.colorId === 'dark' || i.colorId === 'bright' || i.colorId === 'multi';
    if (darkish) {
      if (has('colour') || has('liquid') || has('capsule')) L('good', 'المنظف السائل أو المخصص للألوان مناسب لهذه القطعة الملوّنة.', 'A liquid or colour-care detergent suits this coloured item.');
      else L('warn', 'المسحوق والمنظف المخصص للأبيض قد يبهّتان الألوان أو يتركان أثرًا أبيض على الداكن. الأنسب منظف سائل أو مخصص للألوان.', 'Powder and detergents made for whites can fade colours or leave white marks on darks. A liquid or colour-care detergent is better.');
    } else if (i.colorId === 'white' && (has('powder') || has('whites') || has('bio') || has('liquid'))) {
      L('good', 'منظفك مناسب للملابس البيضاء.', 'What you use is fine for whites.');
    }
    if (i.garmentId === 'baby-clothes') {
      if (has('baby')) L('good', 'منظف الأطفال الذي تستخدمه مناسب لهذه القطعة.', 'Your baby detergent suits this item.');
      else L('warn', 'لملابس الرضّع يُفضَّل منظف لطيف خالٍ من العطور.', 'For baby clothes a mild, fragrance-free detergent is best.');
    }
  }
  if (sofs.length > 0 && i.garmentId && NO_SOFTENER_GARMENTS.includes(i.garmentId)) {
    L('warn', 'تجنّب المنعّم مع هذه القطعة، فهو يقلل الامتصاص أو العزل أو يحبس الرائحة.', 'Skip the softener with this item: it reduces absorbency or water repellency, or traps odour.');
  }
  return out;
}

export const careProductName = (id: string, locale: Locale) => careProductOptions.find((o) => o.id === id)?.name[locale];
