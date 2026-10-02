import type { Bilingual, FabricType, GarmentAnalysis, Locale, Temperature } from '../domain';
import { stainGuides } from './stains';

export type GarmentGroupId = 'gulf' | 'tops' | 'bottoms' | 'dresses' | 'outer' | 'underwear' | 'sport' | 'kids' | 'home' | 'accessories';

export const garmentGroups: { id: GarmentGroupId; name: Bilingual }[] = [
  { id: 'gulf', name: { ar: 'الملابس الخليجية والتقليدية', en: 'Gulf and traditional wear' } },
  { id: 'tops', name: { ar: 'القمصان والبلوزات', en: 'Tops' } },
  { id: 'bottoms', name: { ar: 'البناطيل والتنانير', en: 'Bottoms' } },
  { id: 'dresses', name: { ar: 'الفساتين والبدلات', en: 'Dresses and suits' } },
  { id: 'outer', name: { ar: 'المعاطف والجاكيتات', en: 'Coats and jackets' } },
  { id: 'underwear', name: { ar: 'الملابس الداخلية والنوم', en: 'Underwear and sleepwear' } },
  { id: 'sport', name: { ar: 'الرياضة والسباحة', en: 'Sport and swim' } },
  { id: 'kids', name: { ar: 'الأطفال والرضّع', en: 'Kids and babies' } },
  { id: 'home', name: { ar: 'المفروشات والبيت', en: 'Bedding and home' } },
  { id: 'accessories', name: { ar: 'الإكسسوارات', en: 'Accessories' } },
];

export interface WardrobeItem {
  id: string;
  group: GarmentGroupId;
  name: Bilingual;
  /** Fabrics this garment is most often made of; they are offered first. */
  fabrics: FabricType[];
  /** Matches an entry of `gulfGarments` whose tips are shown on the result. */
  tipId?: string;
  /** Gentle handling: delicate programme, low spin, no tumble dry. */
  delicate?: boolean;
  /** Never recommend hotter than this. */
  maxTemp?: Temperature;
  /** Dry cleaning is the safe default. */
  dryClean?: boolean;
  note?: Bilingual;
}

const W = (id: string, group: GarmentGroupId, ar: string, en: string, fabrics: FabricType[], extra: Partial<WardrobeItem> = {}): WardrobeItem =>
  ({ id, group, name: { ar, en }, fabrics, ...extra });

/** Garments and their common variants. Users can still type their own through "Other". */
export const wardrobeItems: WardrobeItem[] = [
  // Gulf and traditional
  W('dishdasha-white', 'gulf', 'دشداشة بيضاء', 'White dishdasha / thobe', ['synthetic_blend', 'polyester', 'cotton'], { tipId: 'dishdasha-white' }),
  W('dishdasha-colour', 'gulf', 'دشداشة ملوّنة', 'Coloured dishdasha / thobe', ['synthetic_blend', 'polyester', 'cotton'], { tipId: 'dishdasha-colour' }),
  W('abaya', 'gulf', 'عباية', 'Abaya', ['polyester', 'nylon', 'viscose', 'silk'], { tipId: 'abaya', delicate: true }),
  W('shayla', 'gulf', 'شيلة', 'Shayla', ['polyester', 'viscose', 'cotton'], { tipId: 'shayla', delicate: true }),
  W('hijab', 'gulf', 'حجاب / إيشارب', 'Hijab / headscarf', ['viscose', 'polyester', 'cotton', 'silk'], { delicate: true }),
  W('ghutra', 'gulf', 'غترة', 'Ghutra', ['cotton', 'synthetic_blend'], { tipId: 'ghutra' }),
  W('kumma', 'gulf', 'كمة', 'Kumma (Omani cap)', ['cotton'], { tipId: 'kumma', delicate: true }),
  W('mussar', 'gulf', 'مصر', 'Mussar (turban)', ['wool', 'cotton', 'cashmere'], { tipId: 'mussar', delicate: true }),
  W('bisht', 'gulf', 'بشت', 'Bisht (cloak)', ['wool', 'silk', 'synthetic_blend'], { dryClean: true }),
  W('jalabiya', 'gulf', 'جلابية / قفطان', 'Jalabiya / kaftan', ['cotton', 'polyester', 'viscose'], { delicate: true }),
  W('women-thobe', 'gulf', 'ثوب نسائي مطرّز', 'Embroidered women\'s thobe', ['polyester', 'viscose', 'silk'], { delicate: true, dryClean: true,
    note: { ar: 'التطريز والخرز يتلفان بسهولة في الغسالة.', en: 'Embroidery and beads are easily damaged in a machine.' } }),
  W('sirwal', 'gulf', 'سروال', 'Sirwal', ['cotton', 'synthetic_blend']),
  W('wizar', 'gulf', 'وزار / إزار', 'Wizar / izar', ['cotton']),
  // Tops
  W('tshirt', 'tops', 'تيشيرت', 'T-shirt', ['cotton', 'polyester', 'synthetic_blend']),
  W('polo', 'tops', 'بولو', 'Polo shirt', ['cotton', 'polyester']),
  W('shirt', 'tops', 'قميص', 'Shirt', ['cotton', 'linen', 'polyester', 'synthetic_blend']),
  W('blouse', 'tops', 'بلوزة', 'Blouse', ['viscose', 'polyester', 'silk', 'cotton'], { delicate: true }),
  W('sweater', 'tops', 'سويتر / كنزة', 'Sweater / jumper', ['wool', 'cotton', 'synthetic_blend', 'cashmere'], { delicate: true, maxTemp: 30,
    note: { ar: 'جفّفه مفروشًا ولا تعلّقه حتى لا يتمدد.', en: 'Dry it flat rather than hanging so it does not stretch.' } }),
  W('cardigan', 'tops', 'كارديجان', 'Cardigan', ['wool', 'cotton', 'synthetic_blend', 'cashmere'], { delicate: true, maxTemp: 30 }),
  W('hoodie', 'tops', 'هودي', 'Hoodie', ['cotton', 'polyester', 'synthetic_blend']),
  W('sweatshirt', 'tops', 'سويت شيرت', 'Sweatshirt', ['cotton', 'polyester']),
  W('tank-top', 'tops', 'فنيلة بدون أكمام', 'Tank top', ['cotton', 'polyester', 'synthetic_blend']),
  // Bottoms
  W('jeans', 'bottoms', 'جينز', 'Jeans', ['denim'], { maxTemp: 30, note: { ar: 'اغسله مقلوبًا ليبقى لونه.', en: 'Turn inside out to keep the colour.' } }),
  W('trousers', 'bottoms', 'بنطلون', 'Trousers', ['cotton', 'polyester', 'synthetic_blend', 'wool']),
  W('formal-trousers', 'bottoms', 'بنطلون رسمي', 'Dress trousers', ['wool', 'polyester', 'synthetic_blend']),
  W('shorts', 'bottoms', 'شورت', 'Shorts', ['cotton', 'polyester', 'denim']),
  W('skirt', 'bottoms', 'تنورة', 'Skirt', ['polyester', 'viscose', 'cotton'], { delicate: true }),
  W('leggings', 'bottoms', 'ليقنز', 'Leggings', ['synthetic_blend', 'nylon', 'cotton'], { maxTemp: 30 }),
  W('joggers', 'bottoms', 'بنطلون رياضي', 'Joggers / tracksuit trousers', ['cotton', 'polyester']),
  // Dresses and suits
  W('dress', 'dresses', 'فستان', 'Dress', ['polyester', 'viscose', 'cotton', 'silk'], { delicate: true }),
  W('evening-dress', 'dresses', 'فستان سهرة', 'Evening dress', ['silk', 'polyester', 'viscose'], { delicate: true, dryClean: true }),
  W('suit-jacket', 'dresses', 'جاكيت بدلة', 'Suit jacket', ['wool', 'polyester', 'synthetic_blend'], { dryClean: true }),
  W('blazer', 'dresses', 'بليزر', 'Blazer', ['wool', 'polyester', 'cotton'], { dryClean: true }),
  W('waistcoat', 'dresses', 'صدرية', 'Waistcoat', ['wool', 'polyester'], { dryClean: true }),
  // Coats and jackets
  W('coat', 'outer', 'معطف', 'Coat', ['wool', 'polyester'], { dryClean: true }),
  W('jacket', 'outer', 'جاكيت', 'Jacket', ['nylon', 'polyester', 'cotton'], { delicate: true }),
  W('down-jacket', 'outer', 'جاكيت منفوخ', 'Down / puffer jacket', ['nylon', 'polyester'], { delicate: true, maxTemp: 30,
    note: { ar: 'اتبع الملصق بدقة، وجفّفه جيدًا وحرّكه ليعود الحشو منتفشًا.', en: 'Follow the label closely, dry it fully and fluff it so the filling recovers.' } }),
  W('raincoat', 'outer', 'معطف مطر', 'Raincoat', ['nylon', 'polyester'], { delicate: true, maxTemp: 30,
    note: { ar: 'لا تستخدم المنعّم، فهو يضعف عزل الماء.', en: 'Skip the softener; it weakens water repellency.' } }),
  // Underwear and sleepwear
  W('underwear', 'underwear', 'ملابس داخلية', 'Underwear', ['cotton', 'synthetic_blend'], { maxTemp: 40 }),
  W('bra', 'underwear', 'حمالة صدر', 'Bra', ['nylon', 'synthetic_blend'], { delicate: true, maxTemp: 30,
    note: { ar: 'ضعها في كيس غسيل شبكي لتحفظ شكلها.', en: 'Put it in a mesh wash bag to keep its shape.' } }),
  W('socks', 'underwear', 'جوارب', 'Socks', ['cotton', 'synthetic_blend']),
  W('undershirt', 'underwear', 'فنيلة', 'Undershirt', ['cotton']),
  W('pyjamas', 'underwear', 'بيجامة', 'Pyjamas', ['cotton', 'polyester', 'viscose']),
  W('nightgown', 'underwear', 'قميص نوم', 'Nightgown', ['viscose', 'silk', 'cotton', 'polyester'], { delicate: true }),
  // Sport and swim
  W('sportswear', 'sport', 'ملابس رياضية', 'Sportswear', ['polyester', 'nylon', 'synthetic_blend'], { maxTemp: 30,
    note: { ar: 'لا تستخدم المنعّم، فهو يسدّ مسام القماش ويحبس الرائحة.', en: 'Skip the softener; it clogs the fabric and traps odour.' } }),
  W('swimwear', 'sport', 'ملابس سباحة', 'Swimwear', ['nylon', 'synthetic_blend'], { delicate: true, maxTemp: 30,
    note: { ar: 'اشطفها بماء عذب بعد البحر أو المسبح، وتجنّب العصر الشديد.', en: 'Rinse in fresh water after sea or pool and avoid hard wringing.' } }),
  // Kids and babies
  W('baby-clothes', 'kids', 'ملابس حديثي الولادة', 'Baby clothes', ['cotton'], { maxTemp: 40,
    note: { ar: 'استخدم منظفًا لطيفًا خاليًا من العطور، واشطفها جيدًا.', en: 'Use a mild, fragrance-free detergent and rinse thoroughly.' } }),
  W('school-uniform', 'kids', 'زي مدرسي', 'School uniform', ['cotton', 'polyester', 'synthetic_blend']),
  W('kids-clothes', 'kids', 'ملابس أطفال', 'Kids\' clothes', ['cotton', 'polyester', 'synthetic_blend']),
  // Bedding and home
  W('bed-sheets', 'home', 'شراشف', 'Bed sheets', ['cotton', 'linen', 'polyester']),
  W('duvet-cover', 'home', 'غطاء لحاف', 'Duvet cover', ['cotton', 'polyester', 'linen']),
  W('pillowcase', 'home', 'غطاء مخدة', 'Pillowcase', ['cotton', 'polyester', 'silk']),
  W('towels', 'home', 'مناشف', 'Towels', ['cotton'], { note: { ar: 'اغسلها وحدها، ولا تستخدم المنعّم كثيرًا حتى لا تفقد امتصاصها.', en: 'Wash them alone and go easy on softener so they stay absorbent.' } }),
  W('blanket', 'home', 'بطانية', 'Blanket', ['polyester', 'wool', 'cotton'], { delicate: true,
    note: { ar: 'الأغطية الكبيرة تحتاج مساحة في الأسطوانة، فتأكد أن سعتها تكفي.', en: 'Big items need room in the drum, so check your machine\'s capacity.' } }),
  W('curtains', 'home', 'ستائر', 'Curtains', ['polyester', 'cotton', 'linen'], { delicate: true }),
  W('tablecloth', 'home', 'مفرش طاولة', 'Tablecloth', ['cotton', 'linen', 'polyester']),
  // Accessories
  W('scarf', 'accessories', 'وشاح / سكارف', 'Scarf', ['silk', 'wool', 'viscose', 'cotton'], { delicate: true }),
  W('gloves', 'accessories', 'قفازات', 'Gloves', ['wool', 'cashmere', 'synthetic_blend'], { delicate: true, maxTemp: 30 }),
  W('cap', 'accessories', 'قبعة / كاب', 'Cap / hat', ['cotton', 'polyester'], { delicate: true,
    note: { ar: 'يفضّل الغسل اليدوي، وجفّفها على شكل قالب حتى تحتفظ بشكلها.', en: 'Hand wash if you can, and dry it on a form to keep its shape.' } }),
];

export interface FabricOption {
  id: string;
  /** What the care rules treat it as. Lookalikes map to the safest matching type. */
  fabric: FabricType;
  name: Bilingual;
  /** Shown first for everyone; the rest are tucked under "more fabrics". */
  basic?: boolean;
  /** Not for the machine: the plan says so. */
  noMachine?: boolean;
}

export const fabricOptions: FabricOption[] = [
  { id: 'cotton', fabric: 'cotton', basic: true, name: { ar: 'قطن', en: 'Cotton' } },
  { id: 'linen', fabric: 'linen', basic: true, name: { ar: 'كتان', en: 'Linen' } },
  { id: 'wool', fabric: 'wool', basic: true, name: { ar: 'صوف', en: 'Wool' } },
  { id: 'silk', fabric: 'silk', basic: true, name: { ar: 'حرير', en: 'Silk' } },
  { id: 'polyester', fabric: 'polyester', basic: true, name: { ar: 'بوليستر', en: 'Polyester' } },
  { id: 'nylon', fabric: 'nylon', basic: true, name: { ar: 'نايلون', en: 'Nylon' } },
  { id: 'denim', fabric: 'denim', basic: true, name: { ar: 'جينز (دنيم)', en: 'Denim' } },
  { id: 'cashmere', fabric: 'cashmere', basic: true, name: { ar: 'كشمير', en: 'Cashmere' } },
  { id: 'viscose', fabric: 'viscose', basic: true, name: { ar: 'فيسكوز / رايون', en: 'Viscose / rayon' } },
  { id: 'synthetic_blend', fabric: 'synthetic_blend', basic: true, name: { ar: 'خليط صناعي (قطن مع بوليستر)', en: 'Synthetic blend (cotton-polyester)' } },
  { id: 'satin', fabric: 'viscose', name: { ar: 'ساتان', en: 'Satin' } },
  { id: 'chiffon', fabric: 'viscose', name: { ar: 'شيفون', en: 'Chiffon' } },
  { id: 'velvet', fabric: 'viscose', name: { ar: 'مخمل / قطيفة', en: 'Velvet' } },
  { id: 'modal', fabric: 'viscose', name: { ar: 'مودال / بامبو', en: 'Modal / bamboo' } },
  { id: 'fleece', fabric: 'polyester', name: { ar: 'فليس (صوف صناعي)', en: 'Fleece' } },
  { id: 'acrylic', fabric: 'synthetic_blend', name: { ar: 'أكريليك', en: 'Acrylic' } },
  { id: 'elastane', fabric: 'synthetic_blend', name: { ar: 'ليكرا / سبانديكس', en: 'Elastane / spandex' } },
  { id: 'leather', fabric: 'unknown', noMachine: true, name: { ar: 'جلد / سويد', en: 'Leather / suede' } },
];

export type ColorId = 'white' | 'light' | 'dark' | 'bright' | 'multi';

export interface ColorOption {
  id: ColorId;
  name: Bilingual;
  swatch: string[];
  maxTemp?: Temperature;
  note: Bilingual;
}

export const colorOptions: ColorOption[] = [
  { id: 'white', swatch: ['#FFFFFF'], name: { ar: 'أبيض', en: 'White' },
    note: { ar: 'اغسله مع الأبيض فقط حتى لا يأخذ لونًا من غيره.', en: 'Wash with whites only so it does not pick up colour.' } },
  { id: 'light', swatch: ['#CFE3F5'], name: { ar: 'فاتح (كريمي، بيج، باستيل)', en: 'Light (cream, beige, pastel)' }, maxTemp: 40,
    note: { ar: 'اغسله مع الألوان الفاتحة فقط.', en: 'Wash with light colours only.' } },
  { id: 'dark', swatch: ['#1B2233'], name: { ar: 'داكن (أسود، كحلي، رمادي غامق)', en: 'Dark (black, navy, charcoal)' }, maxTemp: 30,
    note: { ar: 'اغسله مقلوبًا مع الملابس الداكنة، وجفّفه بعيدًا عن الشمس المباشرة كي لا يبهت.', en: 'Turn it inside out, wash with darks and dry away from direct sun so it does not fade.' } },
  { id: 'bright', swatch: ['#E5483B'], name: { ar: 'ألوان زاهية (أحمر، أزرق ساطع، أخضر)', en: 'Bright (red, vivid blue, green)' }, maxTemp: 30,
    note: { ar: 'اغسله وحده في الغسلات الأولى فقد يسيل لونه، ولا تتركه منقوعًا طويلًا. ورقة حماية الألوان تفيد.', en: 'Wash it alone for the first washes as the dye can run, and do not soak it long. A colour-catcher sheet helps.' } },
  { id: 'multi', swatch: ['#E5483B', '#F2A93B', '#3347D6'], name: { ar: 'متعدد الألوان أو مطبوع', en: 'Multicolour or printed' }, maxTemp: 30,
    note: { ar: 'اغسله بماء بارد مع ألوان مشابهة، ويُفضَّل استخدام ورقة حماية الألوان.', en: 'Wash cold with similar colours; a colour-catcher sheet is wise.' } },
];

/** Colour to assume when the user types their own: treat it like a strong dye, the cautious choice. */
export const OTHER_COLOUR: ColorId = 'bright';

export interface GarmentDetails {
  garmentId?: string;
  garmentOther?: string;
  fabricOptionId?: string;
  fabricOther?: string;
  colorId?: ColorId;
  colorOther?: string;
  stains?: string[];
  stainOther?: string;
}

export const OTHER = '__other';
export const UNKNOWN_FABRIC = '__unknown';

export function hasStains(d: GarmentDetails): boolean {
  return (d.stains?.length ?? 0) > 0 || Boolean(d.stainOther?.trim());
}

/** Fabric the care rules should use for what the user picked. */
export function fabricFromDetails(d: GarmentDetails): FabricType {
  return fabricOptions.find((f) => f.id === d.fabricOptionId)?.fabric ?? 'unknown';
}

/** Fabric options in the order to show: the garment's usual fabrics first, then the rest of the basic ones, then the less common. */
export function orderedFabricOptions(garmentId: string | undefined) {
  const item = wardrobeItems.find((g) => g.id === garmentId);
  const basics = fabricOptions.filter((f) => f.basic);
  const common = item ? basics.filter((f) => item.fabrics.includes(f.fabric)) : [];
  const rest = basics.filter((f) => !common.includes(f));
  const more = fabricOptions.filter((f) => !f.basic);
  return { common, rest, more };
}

const TEMPS: Temperature[] = [20, 30, 40, 60, 90];

/**
 * Tailors a wash plan to what the user told us: garment type, colour and stains. It can only make advice
 * safer (cooler, gentler, no heat on stains); the fabric's baseline rules stay the starting point.
 */
export function applyDetails(a: GarmentAnalysis, d: GarmentDetails, locale: Locale): GarmentAnalysis {
  const rec = { ...a.recommendation, notes: [...a.recommendation.notes] };
  const add = (b?: Bilingual) => { if (b) rec.notes.push(b[locale]); };
  const item = wardrobeItems.find((g) => g.id === d.garmentId);
  const colour = colorOptions.find((c) => c.id === (d.colorId ?? (d.colorOther ? OTHER_COLOUR : undefined)));
  const fab = fabricOptions.find((f) => f.id === d.fabricOptionId);

  const cap = Math.min(...[colour?.maxTemp, item?.maxTemp].filter((n): n is Temperature => n != null), 90);
  if (rec.temperature > cap) rec.temperature = ([...TEMPS].reverse().find((t) => t <= cap) ?? 20) as Temperature;

  if (item?.delicate || item?.dryClean) {
    if (rec.program === 'cottons' || rec.program === 'synthetics' || rec.program === 'quick') rec.program = 'delicate';
    if (rec.spin === 'medium' || rec.spin === 'high') rec.spin = 'low';
    rec.tumbleDry = false;
  }
  if (item?.dryClean) add({ ar: 'الأفضل التنظيف الجاف لهذه القطعة. إن كان الملصق يسمح بالغسل، فاتبعه حرفيًا.', en: 'Dry cleaning is the safe choice for this garment. If the label allows washing, follow it exactly.' });
  add(item?.note);
  if (fab?.noMachine) {
    rec.tumbleDry = false;
    rec.bleachAllowed = false;
    add({ ar: 'لا يُغسل الجلد والسويد بالغسالة. نظّفه عند مختص أو بمنتج مخصص.', en: 'Leather and suede are not machine washable. Use a specialist cleaner or a dedicated product.' });
  }
  add(colour?.note);
  if (d.colorOther && !d.colorId) add({ ar: 'لا نعرف لونك بالضبط، فعاملناه معاملة الألوان الزاهية احتياطًا.', en: 'We do not know your exact colour, so we treated it like a strong dye to be safe.' });
  if (hasStains(d)) {
    rec.tumbleDry = false;
    add({ ar: 'عالج البقع قبل الغسيل (التفاصيل أدناه)، ولا تجفّفها بحرارة قبل أن تزول تمامًا.', en: 'Treat the stains before washing (steps below) and do not heat-dry until they are fully gone.' });
  }
  return { ...a, recommendation: rec };
}

/** Name to show for the garment, including one the user typed. */
export function garmentLabel(d: GarmentDetails, locale: Locale): string | undefined {
  if (d.garmentOther?.trim()) return d.garmentOther.trim();
  return wardrobeItems.find((g) => g.id === d.garmentId)?.name[locale];
}
export function fabricLabel(d: GarmentDetails, locale: Locale): string | undefined {
  if (d.fabricOther?.trim()) return d.fabricOther.trim();
  return fabricOptions.find((f) => f.id === d.fabricOptionId)?.name[locale];
}
export function colourLabel(d: GarmentDetails, locale: Locale): string | undefined {
  if (d.colorOther?.trim()) return d.colorOther.trim();
  return colorOptions.find((c) => c.id === d.colorId)?.name[locale];
}
export const stainIds = (d: GarmentDetails) => (d.stains ?? []).filter((id) => stainGuides.some((s) => s.id === id));
