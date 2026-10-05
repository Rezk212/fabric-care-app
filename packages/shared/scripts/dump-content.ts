// Prints every piece of care advice in the app as JSON, so an expert can review it in a spreadsheet.
import {
  applianceMaintenance, applianceTypes, baselineRecommendation, capacityGuide, careProductAdvice, colorOptions, fabricFamilies, fabricOptions,
  generalMaintenance, garmentGroups, gulfGarments, privacyPolicy, products, stainGuides, symbolGuide, termsOfUse, wardrobeItems,
  CHECK_LABEL_NOTE, dictionaries, type CareAdviceInput, type FabricType,
} from '../src/index';

type Row = { ref: string; section: string; item: string; ar: string; en: string };
const sheets: Record<string, Row[]> = {};
const add = (sheet: string, ref: string, section: string, item: string, ar: string, en: string) => (sheets[sheet] ??= []).push({ ref, section, item, ar, en });

// Gulf garments
for (const g of gulfGarments) {
  add('الملابس الخليجية', `${g.id}.fabric`, 'القماش المعتاد', g.name.ar, g.fabricNote.ar, g.fabricNote.en);
  g.tips.forEach((t, i) => add('الملابس الخليجية', `${g.id}.tip${i + 1}`, 'نصيحة', g.name.ar, t.ar, t.en));
  g.avoid.forEach((t, i) => add('الملابس الخليجية', `${g.id}.avoid${i + 1}`, 'تجنّب', g.name.ar, t.ar, t.en));
}
// Stains
for (const s of stainGuides) {
  s.sturdy.forEach((t, i) => add('إزالة البقع', `${s.id}.sturdy${i + 1}`, 'قماش متين (قطن، جينز، بوليستر…)', s.name.ar, t.ar, t.en));
  s.delicate.forEach((t, i) => add('إزالة البقع', `${s.id}.delicate${i + 1}`, 'قماش رقيق أو غير معروف', s.name.ar, t.ar, t.en));
  s.avoid.forEach((t, i) => add('إزالة البقع', `${s.id}.avoid${i + 1}`, 'تجنّب', s.name.ar, t.ar, t.en));
}
// Symbols
symbolGuide.forEach((s, i) => add('رموز الغسيل', `symbol${i + 1}`, `${s.kind}${s.banned ? ' (ممنوع)' : ''}`, `المستوى ${s.level ?? '-'}`, s.text.ar, s.text.en));
// Appliances
for (const a of applianceTypes) {
  const kind = a.kind === 'washer' ? 'غسالة' : 'مجفف';
  add('الغسالات والمجففات', `${a.id}.how`, `${kind}: كيف تعمل`, a.name.ar, a.how.ar, a.how.en);
  a.pros.forEach((t, i) => add('الغسالات والمجففات', `${a.id}.pro${i + 1}`, `${kind}: ميزة`, a.name.ar, t.ar, t.en));
  a.cons.forEach((t, i) => add('الغسالات والمجففات', `${a.id}.con${i + 1}`, `${kind}: عيب`, a.name.ar, t.ar, t.en));
  add('الغسالات والمجففات', `${a.id}.best`, `${kind}: الأنسب لـ`, a.name.ar, a.bestFor.ar, a.bestFor.en);
  (applianceMaintenance[a.id] ?? []).forEach((t, i) => add('الغسالات والمجففات', `${a.id}.maint${i + 1}`, `${kind}: صيانة`, a.name.ar, t.ar, t.en));
}
add('الغسالات والمجففات', 'capacity', 'اختيار السعة', 'عام', capacityGuide.ar, capacityGuide.en);
generalMaintenance.forEach((t, i) => add('الغسالات والمجففات', `general${i + 1}`, 'صيانة عامة', 'كل الأجهزة', t.ar, t.en));
// Garment list and per-garment handling
const groupName = (id: string) => garmentGroups.find((g) => g.id === id)?.name.ar ?? id;
for (const w of wardrobeItems) {
  const flags = [w.delicate ? 'يُعامل برفق (برنامج رقيق، عصر منخفض، بلا مجفف)' : '', w.dryClean ? 'التنظيف الجاف هو الأنسب' : '', w.maxTemp ? `حرارة لا تتجاوز ${w.maxTemp}°م` : ''].filter(Boolean).join(' · ');
  add('القطع', `${w.id}.rule`, groupName(w.group), w.name.ar, `الأقمشة الشائعة: ${w.fabrics.join('، ')}${flags ? ' | ' + flags : ''}`, `Usual fabrics: ${w.fabrics.join(', ')}${flags ? ' | ' + flags : ''}`);
  if (w.note) add('القطع', `${w.id}.note`, groupName(w.group), w.name.ar, w.note.ar, w.note.en);
}
// Fabrics and how each is treated
const familyName = (id: string) => fabricFamilies.find((f) => f.id === id)?.name.ar ?? id;
for (const f of fabricOptions) add('الأقمشة', f.id, familyName(f.family), f.name.ar, `يُعامل كقماش من نوع: ${f.fabric}${f.noMachine ? ' (لا يُغسل بالغسالة)' : ''}`, `Treated as: ${f.fabric}${f.noMachine ? ' (not machine washable)' : ''}`);
// Colours
for (const c of colorOptions) add('الألوان', c.id, c.maxTemp ? `حرارة لا تتجاوز ${c.maxTemp}°م` : 'بلا حد إضافي', c.name.ar, c.note.ar, c.note.en);
// Baseline wash rules (the most safety-critical sheet)
const types: FabricType[] = ['cotton', 'linen', 'wool', 'silk', 'polyester', 'nylon', 'denim', 'cashmere', 'viscose', 'synthetic_blend', 'unknown'];
const levelAr: Record<string, string> = { none: 'بدون', low: 'منخفض', medium: 'متوسط', high: 'مرتفع' };
const programAr: Record<string, string> = { delicate: 'الأقمشة الحساسة', wool: 'الصوف', synthetics: 'الأقمشة الصناعية', cottons: 'القطن', quick: 'سريع', hand_wash: 'يدوي' };
for (const f of types) {
  const r = baselineRecommendation(f);
  add('قواعد الغسيل الأساسية', `rule.${f}`, 'الإعداد الافتراضي لكل قماش', f,
    `البرنامج: ${programAr[r.program]} | الحرارة: ${r.temperature}°م | العصر: ${levelAr[r.spin]} | مجفف: ${r.tumbleDry ? 'مسموح' : 'ممنوع'} | الكي: ${levelAr[r.iron]} | مبيّض: ${r.bleachAllowed ? 'مسموح' : 'ممنوع'}`,
    `program ${r.program}; ${r.temperature}°C; spin ${r.spin}; tumble ${r.tumbleDry}; iron ${r.iron}; bleach ${r.bleachAllowed}`);
}
// Detergent / softener advice, generated from the real rules
const scenarios: { name: string; input: CareAdviceInput }[] = [
  { name: 'حرير + مسحوق', input: { fabric: 'silk', detergents: ['det_powder'], softeners: [] } },
  { name: 'حرير + منظف بالإنزيمات', input: { fabric: 'silk', detergents: ['det_bio'], softeners: [] } },
  { name: 'حرير + غسول رقيق', input: { fabric: 'silk', detergents: ['det_delicate'], softeners: [] } },
  { name: 'صوف + منظف سائل فقط', input: { fabric: 'wool', detergents: ['det_liquid'], softeners: [] } },
  { name: 'قطن داكن + مسحوق', input: { fabric: 'cotton', colorId: 'dark', detergents: ['det_powder'], softeners: [] } },
  { name: 'قطن داكن + سائل', input: { fabric: 'cotton', colorId: 'dark', detergents: ['det_liquid'], softeners: [] } },
  { name: 'قطن أبيض + مسحوق', input: { fabric: 'cotton', colorId: 'white', detergents: ['det_powder'], softeners: [] } },
  { name: 'ملابس رضّع + منظف عادي', input: { fabric: 'cotton', garmentId: 'baby-clothes', detergents: ['det_liquid'], softeners: [] } },
  { name: 'ملابس رضّع + منظف أطفال', input: { fabric: 'cotton', garmentId: 'baby-clothes', detergents: ['det_baby'], softeners: [] } },
  { name: 'ملابس رياضية + منعّم', input: { fabric: 'polyester', garmentId: 'sportswear', detergents: [], softeners: ['sof_liquid'] } },
  { name: 'مناشف + منعّم', input: { fabric: 'cotton', garmentId: 'towels', detergents: [], softeners: ['sof_liquid'] } },
  { name: 'منظف يدوي فقط في الغسالة', input: { fabric: 'cotton', program: 'cottons', detergents: ['det_handwash'], softeners: [] } },
];
for (const sc of scenarios) {
  const out = careProductAdvice(sc.input);
  add('المنظفات والمنعّمات', `advice.${sc.name}`, 'حالة افتراضية', sc.name, out.map((l) => `${l.tone === 'good' ? '✔' : '⚠'} ${l.text.ar}`).join('\n') || '(لا نصيحة)', out.map((l) => `${l.tone === 'good' ? '✔' : '⚠'} ${l.text.en}`).join('\n') || '(no advice)');
}
// Products
for (const p of products) {
  if (p.description) add('المنتجات', `${p.id}.about`, 'الوصف', p.name.ar, p.description.ar, p.description.en);
  (p.usage ?? []).forEach((u, i) => add('المنتجات', `${p.id}.use${i + 1}`, 'طريقة الاستخدام', p.name.ar, u.ar, u.en));
  if (p.caution) add('المنتجات', `${p.id}.caution`, 'تنبيه', p.name.ar, p.caution.ar, p.caution.en);
  add('المنتجات', `${p.id}.fabrics`, 'يناسب الأقمشة', p.name.ar, p.forFabrics.join('، '), p.forFabrics.join(', '));
}
// Generic notes added when the plan is tailored to the user's choices (see applyDetails)
const gen: [string, string, string][] = [
  ['dryclean', 'قطعة يُفضَّل تنظيفها جافًا', 'التنظيف الجاف هو الأنسب لهذه القطعة. وإن كان الملصق يسمح بالغسل فاتبعه بدقة.|Dry cleaning is the safe choice for this garment. If the label allows washing, follow it exactly.'],
  ['noMachine', 'جلد أو سويد', 'لا يُغسل الجلد والسويد في الغسالة. نظّفهما عند مختص أو بمنتج مخصص لهما.|Leather and suede are not machine washable. Use a specialist cleaner or a dedicated product.'],
  ['stains', 'وجود بقع', 'عالج البقع قبل الغسيل (الخطوات أدناه)، ولا تعرّض القطعة للحرارة قبل أن تزول البقع تمامًا.|Treat the stains before washing (steps below) and do not heat-dry until they are fully gone.'],
  ['unknownColour', 'لون كتبه المستخدم', 'لا نعرف لون القطعة بالضبط، فعاملناها معاملة الألوان الزاهية احتياطًا.|We do not know the exact colour, so we treated it like a strong dye to be safe.'],
];
for (const [ref, item, both] of gen) { const [ar, en] = both.split('|'); add('رسائل وتنبيهات', `plan.${ref}`, 'ملاحظة تُضاف إلى الخطة', item, ar, en); }
const ui: [string, string, string, string][] = [
  ['guide.delicateWarn', 'تنبيه قماش رقيق', dictionaries.ar.guide.delicateWarn, dictionaries.en.guide.delicateWarn],
  ['guide.testFirst', 'تنبيه التجربة', dictionaries.ar.guide.testFirst, dictionaries.en.guide.testFirst],
  ['result.lowConfidence', 'ثقة منخفضة', dictionaries.ar.result.lowConfidence, dictionaries.en.result.lowConfidence],
  ['result.otherStainBody', 'بقعة أخرى', dictionaries.ar.result.otherStainBody, dictionaries.en.result.otherStainBody],
  ['settings.disclaimer', 'تنبيه في الإعدادات', dictionaries.ar.settings.disclaimer, dictionaries.en.settings.disclaimer],
  ['guide.checkLabel', 'تنبيه أسفل صفحات الدليل', CHECK_LABEL_NOTE.ar, CHECK_LABEL_NOTE.en],
];
for (const [ref, item, ar, en] of ui) add('رسائل وتنبيهات', ref, 'نص في التطبيق', item, ar, en);

// Legal text (needs a lawyer, not a laundry expert)
privacyPolicy.forEach((s, i) => add('النصوص القانونية', `privacy${i + 1}`, 'سياسة الخصوصية', s.title.ar, s.body.ar, s.body.en));
termsOfUse.forEach((s, i) => add('النصوص القانونية', `terms${i + 1}`, 'شروط الاستخدام', s.title.ar, s.body.ar, s.body.en));

console.log(JSON.stringify(sheets));
