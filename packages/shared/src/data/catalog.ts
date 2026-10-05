import type { Product, Store } from '../domain';

// SAMPLE DATA ONLY. chainIds are an indicative guess (large chains usually stock these categories), not verified stock. Not real products, shops or locations. Replace with a real source.
export const products: Product[] = [
  { id: 'p-detergent-gentle', kind: 'detergent', name: { ar: 'منظف لطيف (للتجربة)', en: 'Gentle detergent (sample)' }, forFabrics: ['cotton', 'linen', 'denim', 'polyester', 'nylon', 'synthetic_blend', 'viscose'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], isSponsored: true, description: { ar: 'منظف لطيف للغسيل اليومي، يناسب القطن والأقمشة الصناعية.', en: 'A mild detergent for everyday washing of cotton and synthetics.' }, usage: [
      { ar: 'اتبع الجرعة المكتوبة على العبوة بحسب حجم الحمولة ودرجة اتساخها.', en: 'Follow the dose on the pack for your load size and how dirty it is.' },
      { ar: 'ضعه في الدرج المخصص للمنظف في الغسالة.', en: 'Put it in the detergent drawer of your machine.' },
      { ar: 'لا تزد الجرعة، فالزيادة تترك رواسب وروائح.', en: 'Do not overdose: extra leaves residue and odours.' },
    ] },
  { id: 'p-delicate-wash', kind: 'delicate_wash', name: { ar: 'غسول الأقمشة الرقيقة (للتجربة)', en: 'Delicate fabric wash (sample)' }, forFabrics: ['silk', 'viscose', 'cashmere'], isSample: true, chainIds: ['lulu', 'carrefour', 'sultan', 'nesto', 'hypermax'], description: { ar: 'غسول مخصص للحرير والفيسكوز والأقمشة الرقيقة.', en: 'A wash made for silk, viscose and other delicate fabrics.' }, usage: [
      { ar: 'اغسل على برنامج الأقمشة الحساسة أو يدويًا بماء بارد.', en: 'Wash on a delicate programme or by hand in cold water.' },
      { ar: 'استخدم كمية قليلة بحسب تعليمات العبوة.', en: 'Use a small amount as the pack says.' },
      { ar: 'اشطف القطعة جيدًا.', en: 'Rinse the item thoroughly.' },
    ] },
  { id: 'p-wool-wash', kind: 'wool_wash', name: { ar: 'غسول الصوف (للتجربة)', en: 'Wool wash (sample)' }, forFabrics: ['wool', 'cashmere'], isSample: true, chainIds: ['lulu', 'carrefour', 'sultan', 'nesto', 'hypermax'], description: { ar: 'غسول بتركيبة لطيفة للصوف والكشمير.', en: 'A gentle formula for wool and cashmere.' }, usage: [
      { ar: 'اغسل بماء بارد على برنامج الصوف أو يدويًا.', en: 'Wash in cold water on the wool programme or by hand.' },
      { ar: 'لا تفرك القطعة ولا تعصرها.', en: 'Do not rub or wring the item.' },
      { ar: 'جفّفها وهي مفروشة.', en: 'Dry it flat.' },
    ] },
  { id: 'p-softener', kind: 'softener', name: { ar: 'منعّم ملابس (للتجربة)', en: 'Fabric softener (sample)' }, forFabrics: ['cotton', 'linen', 'polyester', 'synthetic_blend'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], description: { ar: 'منعّم يعطي الملابس نعومة ورائحة.', en: 'A softener that leaves clothes soft and scented.' }, usage: [
      { ar: 'ضعه في الدرج المخصص للمنعّم، وليس مباشرة على الملابس.', en: 'Add it to the softener drawer, never straight onto clothes.' },
      { ar: 'التزم بالجرعة المكتوبة على العبوة.', en: 'Keep to the dose on the pack.' },
    ], caution: { ar: 'تجنّبه مع ملابس الرياضة والمناشف، فهو يقلل الامتصاص ويحبس الرائحة.', en: 'Avoid it on sportswear and towels: it reduces absorbency and traps odour.' } },
  { id: 'p-stain', kind: 'stain_remover', name: { ar: 'مزيل بقع (للتجربة)', en: 'Stain remover (sample)' }, forFabrics: ['cotton', 'linen', 'denim', 'polyester', 'synthetic_blend'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], description: { ar: 'مزيل بقع يُستعمل قبل الغسيل.', en: 'A stain remover used before washing.' }, usage: [
      { ar: 'جرّبه أولًا على مكان خفي في القطعة.', en: 'Test it first on a hidden spot.' },
      { ar: 'ضعه على البقعة واتركه المدة المكتوبة على العبوة.', en: 'Apply it to the stain and leave it for the time on the pack.' },
      { ar: 'ثم اغسل القطعة كالمعتاد.', en: 'Then wash the item as usual.' },
    ], caution: { ar: 'لا تتركه يجف على القماش.', en: 'Do not let it dry on the fabric.' } },
  { id: 'p-bleach-white', kind: 'bleach', name: { ar: 'مبيّض للأبيض (للتجربة)', en: 'Whitening bleach (sample)' }, forFabrics: ['cotton', 'linen', 'polyester'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], description: { ar: 'مبيّض للقطن والكتان الأبيض.', en: 'A bleach for white cotton and linen.' }, usage: [
      { ar: 'استخدم الجرعة المكتوبة على العبوة فقط.', en: 'Use only the dose on the pack.' },
      { ar: 'أضفه في الدرج المخصص للمبيّض أو حسب تعليمات العبوة.', en: 'Add it to the bleach drawer or as the pack directs.' },
    ], caution: { ar: 'لا تستخدمه على الملابس الملوّنة ولا على الحرير والصوف، ولا تخلطه بمنتجات تنظيف أخرى.', en: 'Not for coloured clothes, silk or wool, and never mix it with other cleaning products.' } },
  { id: 'p-bleach-oxygen', kind: 'bleach', name: { ar: 'مبيّض أكسجين لطيف (للتجربة)', en: 'Gentle oxygen bleach (sample)' }, forFabrics: ['cotton', 'linen', 'polyester', 'synthetic_blend'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], description: { ar: 'مبيّض أكسجين ألطف، يناسب الأبيض والملوّن ثابت اللون.', en: 'A gentler oxygen bleach for whites and colourfast items.' }, usage: [
      { ar: 'اتبع الجرعة المكتوبة على العبوة.', en: 'Follow the dose on the pack.' },
      { ar: 'يعمل بشكل أفضل في ماء فاتر.', en: 'It works best in lukewarm water.' },
    ], caution: { ar: 'جرّبه على مكان خفي أولًا، ولا تستخدمه على الحرير والصوف.', en: 'Test on a hidden spot first and do not use it on silk or wool.' } },
  { id: 'p-colour-protect', kind: 'color_care', name: { ar: 'منظف للألوان (للتجربة)', en: 'Colour-care detergent (sample)' }, forFabrics: ['cotton', 'denim', 'polyester', 'synthetic_blend', 'viscose'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], description: { ar: 'منظف يحافظ على ألوان الملابس الملوّنة والداكنة.', en: 'A detergent that helps keep coloured and dark clothes vivid.' }, usage: [
      { ar: 'اتبع الجرعة المكتوبة على العبوة.', en: 'Follow the dose on the pack.' },
      { ar: 'اغسل الملابس الملوّنة مقلوبة بماء بارد.', en: 'Wash coloured clothes inside out in cold water.' },
    ] },
  { id: 'p-colour-catcher', kind: 'color_care', name: { ar: 'مانع انتقال الألوان (للتجربة)', en: 'Colour-run catcher (sample)' }, forFabrics: ['cotton', 'denim', 'polyester', 'synthetic_blend'], isSample: true, chainIds: ['lulu', 'hypermax', 'nesto', 'makkah', 'almeera', 'carrefour', 'sultan'], description: { ar: 'ورقة تمتص الأصباغ السائلة في ماء الغسيل فتحمي بقية الملابس.', en: 'A sheet that soaks up loose dye in the wash to protect other clothes.' }, usage: [
      { ar: 'ضع ورقة واحدة مع كل غسلة.', en: 'Add one sheet to each wash.' },
      { ar: 'استخدم ورقة جديدة في كل مرة.', en: 'Use a fresh sheet every time.' },
    ] },
];

export const stores: Store[] = [
  { id: 's-muscat-1', name: { ar: 'متجر للتجربة ١ — مسقط', en: 'Sample store 1 — Muscat' }, cityId: 'muscat', lat: 23.5933, lng: 58.4066, productIds: ['p-detergent-gentle', 'p-softener', 'p-stain'], isSample: true },
  { id: 's-muscat-2', name: { ar: 'متجر للتجربة ٢ — مسقط', en: 'Sample store 2 — Muscat' }, cityId: 'muscat', lat: 23.6172, lng: 58.5013, productIds: ['p-delicate-wash', 'p-wool-wash', 'p-detergent-gentle'], isSample: true },
  { id: 's-salalah-1', name: { ar: 'متجر للتجربة ١ — صلالة', en: 'Sample store 1 — Salalah' }, cityId: 'salalah', lat: 17.0211, lng: 54.1012, productIds: ['p-detergent-gentle', 'p-softener'], isSample: true },
  { id: 's-sohar-1', name: { ar: 'متجر للتجربة ١ — صحار', en: 'Sample store 1 — Sohar' }, cityId: 'sohar', lat: 24.3561, lng: 56.7302, productIds: ['p-detergent-gentle', 'p-stain', 'p-delicate-wash'], isSample: true },
];
