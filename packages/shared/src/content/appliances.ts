import type { Bilingual } from '../domain';

export interface ApplianceType {
  id: string;
  kind: 'washer' | 'dryer';
  name: Bilingual;
  how: Bilingual;
  pros: Bilingual[];
  cons: Bilingual[];
  bestFor: Bilingual;
}

/**
 * General appliance classes, not brand claims. Written from common product knowledge:
 * worth an expert read before launch, like the rest of the guide content.
 */
export const applianceTypes: ApplianceType[] = [
  {
    id: 'front-load', kind: 'washer',
    name: { ar: 'غسالة أمامية التحميل', en: 'Front-load washer' },
    how: { ar: 'الباب في الواجهة والأسطوانة أفقية، والملابس ترتفع وتسقط داخل الماء.', en: 'Door on the front, horizontal drum; clothes are lifted and dropped through the water.' },
    pros: [
      { ar: 'ألطف على الأقمشة وتستهلك ماءً وكهرباء أقل', en: 'Gentler on fabric and uses less water and power' },
      { ar: 'عصر أقوى فيجف الغسيل أسرع', en: 'Stronger spin, so clothes come out drier' },
      { ar: 'تسمح بوضع دراير فوقها (تركيب عمودي)', en: 'Can be stacked under a dryer' },
    ],
    cons: [
      { ar: 'أغلى ثمنًا وبرنامجها أطول', en: 'Costs more and cycles run longer' },
      { ar: 'تحتاج تنظيف إطار الباب لتجنب الروائح', en: 'The door seal needs cleaning to avoid odours' },
    ],
    bestFor: { ar: 'الملابس اليومية والرقيقة (ثوب، عباءة) والعائلات التي تريد توفيرًا في الفواتير', en: 'Everyday and delicate clothes (dishdasha, abaya) and households that want lower bills' },
  },
  {
    id: 'top-load-agitator', kind: 'washer',
    name: { ar: 'غسالة علوية التحميل (بمحرّك تحريك)', en: 'Top-load washer (agitator)' },
    how: { ar: 'الفتحة من الأعلى وعمود في الوسط يحرّك الغسيل داخل الماء.', en: 'Opens from the top; a central post agitates clothes through the water.' },
    pros: [
      { ar: 'برامج أقصر وأسعارها غالبًا أقل', en: 'Shorter cycles and usually cheaper' },
      { ar: 'سهلة التحميل دون الانحناء', en: 'Easy to load without bending' },
    ],
    cons: [
      { ar: 'أخشن على الأقمشة وقد تلفّ القطع الطويلة', en: 'Rougher on fabric and can tangle long items' },
      { ar: 'تستهلك ماءً أكثر وعصرها أضعف', en: 'Uses more water and spins less dry' },
    ],
    bestFor: { ar: 'الأقمشة القوية كالقطن والمناشف وغسيل البيت الكثير', en: 'Tough fabrics like cotton and towels, and large household loads' },
  },
  {
    id: 'top-load-impeller', kind: 'washer',
    name: { ar: 'غسالة علوية التحميل (بقرص دوّار)', en: 'Top-load washer (impeller)' },
    how: { ar: 'قرص منخفض في قاع الحوض يدير الغسيل بدل العمود، فهي ألطف من نوع التحريك.', en: 'A low disc at the bottom turns the load instead of a post, so it is gentler than agitator models.' },
    pros: [
      { ar: 'ألطف من نوع التحريك وتتسع أكثر', en: 'Gentler than agitator models and roomier' },
      { ar: 'تحميل علوي مريح', en: 'Comfortable top loading' },
    ],
    cons: [
      { ar: 'ما زالت أقل توفيرًا للماء من الأمامية', en: 'Still less water-efficient than front-load' },
      { ar: 'قد تتجعد القطع الطويلة', en: 'Long items may bunch up' },
    ],
    bestFor: { ar: 'من يريد غسالة علوية بلطف أفضل على الملابس', en: 'People who want a top-loader that is kinder to clothes' },
  },
  {
    id: 'twin-tub', kind: 'washer',
    name: { ar: 'غسالة نصف أوتوماتيك (حوضان)', en: 'Twin-tub (semi-automatic) washer' },
    how: { ar: 'حوض للغسل وحوض منفصل للعصر، وتنقل الغسيل بينهما بيدك.', en: 'One tub washes, a second tub spins; you move clothes between them by hand.' },
    pros: [
      { ar: 'الأرخص وتتحمل انقطاع المياه والكهرباء بسهولة', en: 'Cheapest and copes well with patchy water or power' },
      { ar: 'تغسل حمولة جديدة أثناء عصر السابقة', en: 'Washes a new load while the last one spins' },
    ],
    cons: [
      { ar: 'تحتاج جهدًا يدويًا وإشرافًا', en: 'Needs hands-on effort' },
      { ar: 'برامج وحماية أقمشة محدودة', en: 'Few programs and little fabric protection' },
    ],
    bestFor: { ar: 'الميزانية المحدودة والغسيل الثقيل غير الرقيق', en: 'Tight budgets and sturdy, non-delicate loads' },
  },
  {
    id: 'washer-dryer', kind: 'washer',
    name: { ar: 'غسالة مع مجفف في جهاز واحد', en: 'Washer-dryer combo' },
    how: { ar: 'جهاز واحد يغسل ويجفف في الأسطوانة نفسها.', en: 'One machine that washes and dries in the same drum.' },
    pros: [
      { ar: 'يوفر المساحة عند ضيق المكان', en: 'Saves space in a small home' },
      { ar: 'لا تنقل الغسيل بين جهازين', en: 'No moving laundry between machines' },
    ],
    cons: [
      { ar: 'سعة التجفيف أقل من سعة الغسيل (غالبًا نحو النصف)', en: 'Dry capacity is smaller than wash capacity (often about half)' },
      { ar: 'التجفيف بطيء ولا يناسب كل الأقمشة', en: 'Drying is slow and not right for every fabric' },
    ],
    bestFor: { ar: 'الشقق الصغيرة والحمولات القليلة', en: 'Small flats and light loads' },
  },
  {
    id: 'vented-dryer', kind: 'dryer',
    name: { ar: 'مجفف بتهوية (طرد الهواء)', en: 'Vented dryer' },
    how: { ar: 'يسخّن الهواء ويدفع الرطوبة إلى الخارج عبر خرطوم تهوية.', en: 'Heats air and blows the moisture outside through a vent hose.' },
    pros: [
      { ar: 'الأرخص ثمنًا وتجفيفه سريع', en: 'Lowest price and fast drying' },
    ],
    cons: [
      { ar: 'يحتاج مخرجًا للهواء إلى الخارج', en: 'Needs a vent to the outdoors' },
      { ar: 'أعلى استهلاكًا للكهرباء وحرارته قد تضر بالأقمشة الرقيقة', en: 'Highest power use; its heat can harm delicate fabrics' },
    ],
    bestFor: { ar: 'من يتوفر عنده مخرج هواء ويريد أقل تكلفة شراء', en: 'Homes with an outside vent and a low purchase budget' },
  },
  {
    id: 'condenser-dryer', kind: 'dryer',
    name: { ar: 'مجفف مكثِّف', en: 'Condenser dryer' },
    how: { ar: 'يحوّل الرطوبة إلى ماء يتجمع في خزان، فلا يحتاج خرطوم تهوية.', en: 'Turns moisture into water collected in a tank, so no vent hose is needed.' },
    pros: [
      { ar: 'يُركَّب في أي غرفة', en: 'Can sit in any room' },
    ],
    cons: [
      { ar: 'يفرغ خزان الماء ويحتاج تنظيف الفلتر باستمرار', en: 'Water tank to empty and filters to clean often' },
      { ar: 'يسخّن الغرفة ويستهلك كهرباء أكثر من المضخة الحرارية', en: 'Warms the room and uses more power than heat-pump' },
    ],
    bestFor: { ar: 'الشقق التي لا مخرج هواء فيها', en: 'Flats without an outside vent' },
  },
  {
    id: 'heat-pump-dryer', kind: 'dryer',
    name: { ar: 'مجفف بالمضخة الحرارية', en: 'Heat-pump dryer' },
    how: { ar: 'يعيد تدوير الهواء الدافئ بحرارة أقل، فيوفر الكهرباء.', en: 'Recycles warm air at a lower temperature, saving power.' },
    pros: [
      { ar: 'الأوفر للكهرباء (غالبًا نحو النصف) والألطف على الأقمشة', en: 'Most power-efficient (often about half) and gentlest on fabric' },
    ],
    cons: [
      { ar: 'الأغلى ثمنًا وأبطأ في الدورة', en: 'Highest price and slower cycles' },
    ],
    bestFor: { ar: 'الاستخدام اليومي والأقمشة الرقيقة وخفض فاتورة الكهرباء مع الوقت', en: 'Daily use, delicate fabrics, and cutting power bills over time' },
  },
];

export const capacityGuide: Bilingual = {
  ar: 'السعة بالكيلوغرام للغسيل الجاف: 5–7 كجم للفرد أو الزوجين، و8–9 كجم للأسرة الصغيرة، و10 كجم فأكثر للأسر الكبيرة. لا تملأ الأسطوانة أكثر من ثلاثة أرباعها ليبقى للغسيل مجال.',
  en: 'Capacity is the dry weight of clothes: 5–7 kg for one or two people, 8–9 kg for a small family, 10 kg or more for large households. Fill the drum no more than three quarters so clothes have room.',
};
