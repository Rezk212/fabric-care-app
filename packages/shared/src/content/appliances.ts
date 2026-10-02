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
    name: { ar: 'غسالة تحميل أمامي', en: 'Front-load washer' },
    how: { ar: 'بابها في الواجهة وأسطوانتها أفقية، وتدور الملابس داخل الماء وترتفع ثم تسقط برفق.', en: 'Door on the front, horizontal drum; clothes are lifted and dropped through the water.' },
    pros: [
      { ar: 'ألطف على الأقمشة وتوفّر في الماء والكهرباء', en: 'Gentler on fabric and uses less water and power' },
      { ar: 'عصرها أقوى، فيجف الغسيل أسرع', en: 'Stronger spin, so clothes come out drier' },
      { ar: 'يمكن تركيب مجفف فوقها لتوفير المساحة', en: 'Can be stacked under a dryer' },
    ],
    cons: [
      { ar: 'سعرها أعلى وبرامجها أطول', en: 'Costs more and cycles run longer' },
      { ar: 'تحتاج إلى تنظيف إطار الباب بانتظام حتى لا تظهر الروائح', en: 'The door seal needs cleaning to avoid odours' },
    ],
    bestFor: { ar: 'الملابس اليومية والرقيقة (كالدشداشة والعباية)، ولمن يريد خفض فاتورة الماء والكهرباء', en: 'Everyday and delicate clothes (dishdasha, abaya) and households that want lower bills' },
  },
  {
    id: 'top-load-agitator', kind: 'washer',
    name: { ar: 'غسالة تحميل علوي (بعمود تحريك)', en: 'Top-load washer (agitator)' },
    how: { ar: 'تُفتح من الأعلى، وفي وسطها عمود يحرّك الغسيل داخل الماء.', en: 'Opens from the top; a central post agitates clothes through the water.' },
    pros: [
      { ar: 'برامجها أقصر وسعرها غالبًا أقل', en: 'Shorter cycles and usually cheaper' },
      { ar: 'يسهل تحميلها دون انحناء', en: 'Easy to load without bending' },
    ],
    cons: [
      { ar: 'أخشن على الأقمشة، وقد تلتفّ القطع الطويلة على بعضها', en: 'Rougher on fabric and can tangle long items' },
      { ar: 'تستهلك ماءً أكثر وعصرها أضعف', en: 'Uses more water and spins less dry' },
    ],
    bestFor: { ar: 'الأقمشة المتينة كالقطن والمناشف، وغسيل البيت الكثير', en: 'Tough fabrics like cotton and towels, and large household loads' },
  },
  {
    id: 'top-load-impeller', kind: 'washer',
    name: { ar: 'غسالة تحميل علوي (بقرص دوّار)', en: 'Top-load washer (impeller)' },
    how: { ar: 'يدير الغسيل قرص منخفض في قاع الحوض بدل العمود، لذلك هي ألطف من نوع التحريك.', en: 'A low disc at the bottom turns the load instead of a post, so it is gentler than agitator models.' },
    pros: [
      { ar: 'ألطف من نوع التحريك وتتسع أكثر', en: 'Gentler than agitator models and roomier' },
      { ar: 'تحميلها من الأعلى مريح', en: 'Comfortable top loading' },
    ],
    cons: [
      { ar: 'تستهلك ماءً أكثر من الغسالة الأمامية', en: 'Still less water-efficient than front-load' },
      { ar: 'قد تتجعد القطع الطويلة', en: 'Long items may bunch up' },
    ],
    bestFor: { ar: 'من يريد غسالة علوية أرفق بالملابس', en: 'People who want a top-loader that is kinder to clothes' },
  },
  {
    id: 'twin-tub', kind: 'washer',
    name: { ar: 'غسالة نصف أوتوماتيك (حوضان)', en: 'Twin-tub (semi-automatic) washer' },
    how: { ar: 'فيها حوض للغسل وحوض منفصل للعصر، وتنقل الغسيل بينهما بنفسك.', en: 'One tub washes, a second tub spins; you move clothes between them by hand.' },
    pros: [
      { ar: 'الأرخص، ولا تتأثر كثيرًا بانقطاع الماء أو الكهرباء', en: 'Cheapest and copes well with patchy water or power' },
      { ar: 'تغسل حمولة جديدة أثناء عصر السابقة', en: 'Washes a new load while the last one spins' },
    ],
    cons: [
      { ar: 'تحتاج إلى متابعتك ونقل الغسيل بيدك', en: 'Needs hands-on effort' },
      { ar: 'برامجها قليلة وحمايتها للأقمشة محدودة', en: 'Few programs and little fabric protection' },
    ],
    bestFor: { ar: 'من ميزانيته محدودة ويغسل ملابس متينة غير رقيقة', en: 'Tight budgets and sturdy, non-delicate loads' },
  },
  {
    id: 'washer-dryer', kind: 'washer',
    name: { ar: 'غسالة ومجفف في جهاز واحد', en: 'Washer-dryer combo' },
    how: { ar: 'جهاز واحد يغسل ويجفف في الأسطوانة نفسها.', en: 'One machine that washes and dries in the same drum.' },
    pros: [
      { ar: 'يوفر المساحة إن كان المكان ضيقًا', en: 'Saves space in a small home' },
      { ar: 'لا حاجة لنقل الغسيل من جهاز إلى آخر', en: 'No moving laundry between machines' },
    ],
    cons: [
      { ar: 'سعة التجفيف أقل من سعة الغسيل (غالبًا نحو النصف)', en: 'Dry capacity is smaller than wash capacity (often about half)' },
      { ar: 'التجفيف بطيء وقد لا يناسب كل الأقمشة', en: 'Drying is slow and not right for every fabric' },
    ],
    bestFor: { ar: 'الشقق الصغيرة والكميات القليلة من الغسيل', en: 'Small flats and light loads' },
  },
  {
    id: 'vented-dryer', kind: 'dryer',
    name: { ar: 'مجفف بمخرج هواء', en: 'Vented dryer' },
    how: { ar: 'يسخّن الهواء ويدفع الرطوبة إلى الخارج عبر خرطوم تهوية.', en: 'Heats air and blows the moisture outside through a vent hose.' },
    pros: [
      { ar: 'الأرخص سعرًا والأسرع في التجفيف', en: 'Lowest price and fast drying' },
    ],
    cons: [
      { ar: 'يحتاج إلى مخرج هواء نحو الخارج', en: 'Needs a vent to the outdoors' },
      { ar: 'يستهلك كهرباء أكثر، وحرارته قد تضر بالأقمشة الرقيقة', en: 'Highest power use; its heat can harm delicate fabrics' },
    ],
    bestFor: { ar: 'من عنده مخرج هواء ويريد أقل سعر عند الشراء', en: 'Homes with an outside vent and a low purchase budget' },
  },
  {
    id: 'condenser-dryer', kind: 'dryer',
    name: { ar: 'مجفف مكثِّف', en: 'Condenser dryer' },
    how: { ar: 'يحوّل الرطوبة إلى ماء يتجمع في خزان، فلا يحتاج خرطوم تهوية.', en: 'Turns moisture into water collected in a tank, so no vent hose is needed.' },
    pros: [
      { ar: 'يمكن وضعه في أي غرفة', en: 'Can sit in any room' },
    ],
    cons: [
      { ar: 'عليك تفريغ خزان الماء وتنظيف الفلتر باستمرار', en: 'Water tank to empty and filters to clean often' },
      { ar: 'يسخّن الغرفة ويستهلك كهرباء أكثر من المضخة الحرارية', en: 'Warms the room and uses more power than heat-pump' },
    ],
    bestFor: { ar: 'الشقق التي ليس فيها مخرج هواء', en: 'Flats without an outside vent' },
  },
  {
    id: 'heat-pump-dryer', kind: 'dryer',
    name: { ar: 'مجفف بالمضخة الحرارية', en: 'Heat-pump dryer' },
    how: { ar: 'يعيد تدوير الهواء الدافئ بحرارة أقل، فيوفر الكهرباء.', en: 'Recycles warm air at a lower temperature, saving power.' },
    pros: [
      { ar: 'الأوفر في الكهرباء (غالبًا نحو النصف) والألطف على الأقمشة', en: 'Most power-efficient (often about half) and gentlest on fabric' },
    ],
    cons: [
      { ar: 'الأعلى سعرًا ودورته أبطأ', en: 'Highest price and slower cycles' },
    ],
    bestFor: { ar: 'الاستخدام اليومي والأقمشة الرقيقة، ولمن يريد خفض فاتورة الكهرباء مع الوقت', en: 'Daily use, delicate fabrics, and cutting power bills over time' },
  },
];

export const capacityGuide: Bilingual = {
  ar: 'تُقاس السعة بوزن الملابس وهي جافة: من ٥ إلى ٧ كجم للفرد أو الزوجين، ومن ٨ إلى ٩ كجم للأسرة الصغيرة، و١٠ كجم فأكثر للأسر الكبيرة. لا تملأ الأسطوانة بأكثر من ثلاثة أرباعها ليبقى للملابس مجال للحركة.',
  en: 'Capacity is the dry weight of clothes: 5–7 kg for one or two people, 8–9 kg for a small family, 10 kg or more for large households. Fill the drum no more than three quarters so clothes have room.',
};

/** Upkeep tips per type. General guidance: the owner's manual for the exact model always wins. */
export const applianceMaintenance: Record<string, Bilingual[]> = {
  'front-load': [
    { ar: 'امسح إطار الباب المطاطي بعد الغسيل وأبقِ الباب مفتوحًا قليلًا ليجف', en: 'Wipe the door seal after washing and leave the door ajar to dry' },
    { ar: 'نظّف درج المنظفات شهريًا', en: 'Clean the detergent drawer monthly' },
    { ar: 'شغّل برنامج تنظيف الأسطوانة، أو غسلة فارغة بماء ساخن، كل شهر أو شهرين', en: 'Run a drum-clean or hot empty cycle every month or two' },
  ],
  'top-load-agitator': [
    { ar: 'امسح الحوض والحافة من الرواسب مرة في الشهر', en: 'Wipe the tub and rim of residue monthly' },
    { ar: 'نظّف فلتر الوبر إن وُجد', en: 'Clean the lint filter if your model has one' },
    { ar: 'اترك الغطاء مفتوحًا بعد الاستعمال ليتهوّى الحوض', en: 'Leave the lid open after use to air out' },
  ],
  'top-load-impeller': [
    { ar: 'امسح الحوض والحافة من الرواسب مرة في الشهر', en: 'Wipe the tub and rim of residue monthly' },
    { ar: 'نظّف فلتر الوبر إن وُجد', en: 'Clean the lint filter if your model has one' },
    { ar: 'اترك الغطاء مفتوحًا بعد الاستعمال ليتهوّى الحوض', en: 'Leave the lid open after use to air out' },
  ],
  'twin-tub': [
    { ar: 'أفرغ الماء وجفّف الحوضين بعد كل استعمال', en: 'Drain and dry both tubs after each use' },
    { ar: 'نظّف شبكة الوبر بعد كل غسلة', en: 'Clean the lint net after each wash' },
    { ar: 'لا تتجاوز الحمولة المحددة لحوض العصر', en: 'Do not exceed the stated load in the spin tub' },
  ],
  'washer-dryer': [
    { ar: 'نظّف الفلتر وإطار الباب بانتظام', en: 'Clean the filter and door seal regularly' },
    { ar: 'لا تملأ الأسطوانة عند التجفيف، فسعتها للتجفيف أقل من سعتها للغسيل', en: 'Do not fill the drum for drying: dry capacity is lower than wash capacity' },
    { ar: 'شغّل برنامج تنظيف الأسطوانة بين فترة وأخرى', en: 'Run a drum-clean cycle now and then' },
  ],
  'vented-dryer': [
    { ar: 'نظّف فلتر الوبر بعد كل دورة', en: 'Clean the lint filter after every cycle' },
    { ar: 'نظّف خرطوم التهوية ومخرج الهواء مرتين في السنة لتقليل خطر الحريق', en: 'Clear the vent hose and outlet twice a year to reduce fire risk' },
    { ar: 'لا تجفّف قطعًا عليها بقع زيت أو مواد قابلة للاشتعال', en: 'Never dry items stained with oil or flammable substances' },
  ],
  'condenser-dryer': [
    { ar: 'أفرغ خزان الماء بعد كل دورة', en: 'Empty the water tank after every cycle' },
    { ar: 'نظّف فلتر الوبر بعد كل دورة، والمكثِّف وفق دليل الجهاز', en: 'Clean the lint filter every cycle and the condenser as the manual says' },
    { ar: 'اترك حول الجهاز مساحة للتهوية', en: 'Leave space around the machine for airflow' },
  ],
  'heat-pump-dryer': [
    { ar: 'نظّف فلتر الوبر بعد كل دورة', en: 'Clean the lint filter after every cycle' },
    { ar: 'نظّف فلتر المبادل الحراري وفق دليل الجهاز', en: 'Clean the heat-exchanger filter as the manual says' },
    { ar: 'أفرغ خزان الماء إن لم يكن موصولًا بالتصريف', en: 'Empty the water tank unless it drains by hose' },
  ],
};

export const generalMaintenance: Bilingual[] = [
  { ar: 'لا تُكثر من المنظف، فالزيادة تترك رواسب وروائح', en: 'Do not overdose detergent: excess leaves residue and odours' },
  { ar: 'أفرغ الجيوب وأغلق السحّابات قبل الغسيل', en: 'Empty pockets and close zips before washing' },
  { ar: 'ثبّت الجهاز على أرض مستوية لتقليل الاهتزاز', en: 'Level the machine on the floor to cut vibration' },
  { ar: 'إن ظهر عطل أو رمز خطأ، فراجع دليل الجهاز أو الوكيل المعتمد', en: 'For faults or error codes, check the manual or the authorised dealer' },
];
