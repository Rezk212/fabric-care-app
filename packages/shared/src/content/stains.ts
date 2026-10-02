import type { Bilingual, FabricType } from '../domain';

export interface StainGuide {
  id: string;
  name: Bilingual;
  icon: string;
  /** Cotton, linen, denim, polyester and similar. */
  sturdy: Bilingual[];
  /** Silk, wool, cashmere, viscose, or unknown fabric. */
  delicate: Bilingual[];
  avoid: Bilingual[];
}

export const stainGuides: StainGuide[] = [
  {
    id: 'coffee-tea',
    name: { ar: 'قهوة أو شاي', en: 'Coffee or tea' },
    icon: 'coffee',
    sturdy: [
      { ar: 'امسح الزائد بقطعة نظيفة دون فرك.', en: 'Blot the excess with a clean cloth; do not rub.' },
      { ar: 'اشطف البقعة بماء بارد من الجهة الخلفية للقماش.', en: 'Rinse from the back of the fabric with cold water.' },
      { ar: 'افرك قليلًا من المنظف على البقعة، واتركه 10 دقائق.', en: 'Work in a little detergent and leave 10 minutes.' },
      { ar: 'اغسل بالبرنامج المعتاد. للأبيض القطني يمكن النقع في مبيّض أكسجين.', en: 'Wash as usual. For white cotton you can soak in an oxygen-based whitener.' },
    ],
    delicate: [
      { ar: 'امسح الزائد برفق ودون فرك.', en: 'Blot the excess gently, no rubbing.' },
      { ar: 'اشطف بماء بارد من الجهة الخلفية للقماش.', en: 'Rinse with cold water from the back.' },
      { ar: 'إن بقي أثر، فالأسلم أخذها إلى التنظيف الجاف.', en: 'If a mark remains, taking it to a dry cleaner is the safer choice.' },
    ],
    avoid: [{ ar: 'لا تستخدم ماءً ساخنًا ولا مجففًا قبل زوال البقعة.', en: 'No hot water or dryer until the stain is gone.' }],
  },
  {
    id: 'oil-ghee',
    name: { ar: 'زيت أو سمن', en: 'Oil or ghee' },
    icon: 'droplet',
    sturdy: [
      { ar: 'امسح الزائد بقطعة نظيفة.', en: 'Blot the excess with a clean cloth.' },
      { ar: 'انثر بيكربونات الصودا أو نشا الذرة على البقعة، واتركه 20 إلى 30 دقيقة ليمتص الدهن.', en: 'Sprinkle baking soda or cornstarch on it and leave 20 to 30 minutes to absorb the grease.' },
      { ar: 'انفضه، ثم افرك سائل غسل الصحون بلطف.', en: 'Brush it off, then gently rub in a little dish soap.' },
      { ar: 'اغسل بأدفأ ماء يسمح به الملصق. تأكد أن البقعة زالت قبل التجفيف.', en: 'Wash in the warmest water the label allows. Check the stain is gone before drying.' },
    ],
    delicate: [
      { ar: 'امسح الزائد، وانثر نشا الذرة واتركه ساعة، ثم انفضه.', en: 'Blot, sprinkle cornstarch, leave an hour, then brush off.' },
      { ar: 'لا تفرك بالماء. خذها إلى التنظيف الجاف وأخبرهم أنها بقعة دهنية.', en: 'Do not rub with water. Take it to a dry cleaner and say it is a grease stain.' },
    ],
    avoid: [{ ar: 'لا تجفّفها بحرارة وفيها أثر، فالحرارة تثبّت الدهن.', en: 'Do not heat-dry with a trace left; heat sets grease.' }],
  },
  {
    id: 'turmeric',
    name: { ar: 'كركم أو بهارات', en: 'Turmeric or spices' },
    icon: 'sun',
    sturdy: [
      { ar: 'اكشط الزائد بملعقة، ولا تفركه.', en: 'Scrape off the excess with a spoon; do not rub.' },
      { ar: 'اشطف بماء بارد من الجهة الخلفية للقماش.', en: 'Rinse with cold water from the back.' },
      { ar: 'افرك سائل غسل الصحون، واتركه 15 دقيقة، ثم اغسل.', en: 'Rub in dish soap, leave 15 minutes, then wash.' },
      { ar: 'إن بقي أثر أصفر على قماش قطني أبيض، فالتجفيف في ضوء الشمس غير المباشر قد يخففه.', en: 'If a yellow trace remains on white cotton, drying in indirect sunlight can fade it.' },
    ],
    delicate: [
      { ar: 'اكشط الزائد واشطف بماء بارد.', en: 'Scrape off the excess and rinse with cold water.' },
      { ar: 'ثم خذها إلى التنظيف الجاف، فالكركم يصعب إزالته.', en: 'Then take it to a dry cleaner; turmeric is hard to remove.' },
    ],
    avoid: [{ ar: 'لا تستخدم مبيّض الكلور، فقد يحوّل لون الكركم إلى بنّي محمر.', en: 'Avoid chlorine bleach; it can turn turmeric reddish-brown.' }],
  },
  {
    id: 'perfume-oud',
    name: { ar: 'عطر أو دهن عود', en: 'Perfume or oud oil' },
    icon: 'wind',
    sturdy: [
      { ar: 'امسح بقطعة نظيفة دون فرك.', en: 'Blot with a clean cloth without rubbing.' },
      { ar: 'دهن العود زيتي: اتبع خطوات الزيت (انثر نشا الذرة ثم سائل الأواني).', en: 'Oud oil is oily: follow the oil steps (cornstarch, then dish soap).' },
      { ar: 'اغسل بالبرنامج المعتاد. إن بقيت الرائحة فانشر القطعة في الهواء بالظل.', en: 'Wash as usual. If the smell lingers, air the garment in the shade.' },
    ],
    delicate: [
      { ar: 'امسح برفق ولا تفرك، وانشر القطعة في الهواء بالظل.', en: 'Blot gently, no rubbing, and air the garment in the shade.' },
      { ar: 'إن كانت البقعة دهنية فخذها إلى التنظيف الجاف.', en: 'If the stain is oily, take it to a dry cleaner.' },
    ],
    avoid: [{ ar: 'لا تفرك البقعة، فهذا يوسّعها.', en: 'Do not rub; it spreads the stain.' }],
  },
  {
    id: 'henna',
    name: { ar: 'حناء', en: 'Henna' },
    icon: 'feather',
    sturdy: [
      { ar: 'اشطف فورًا بكمية وفيرة من الماء البارد من الجهة الخلفية للقماش.', en: 'Rinse straight away with plenty of cold water from the back.' },
      { ar: 'انقعها في ماء فاتر مع منظف نحو ساعة. للأبيض القطني أضف مبيّض أكسجين.', en: 'Soak in lukewarm water with detergent for about an hour. For white cotton add an oxygen-based whitener.' },
      { ar: 'اغسلها بالبرنامج المعتاد. قد تحتاج تكرار النقع.', en: 'Wash as usual. You may need to repeat the soak.' },
    ],
    delicate: [
      { ar: 'اشطف بماء بارد فقط، ولا تستخدم مواد قوية.', en: 'Rinse with cold water only; avoid strong products.' },
      { ar: 'الحناء قد لا تزول تمامًا من الحرير والصوف. خذها إلى التنظيف الجاف.', en: 'Henna may not fully leave silk or wool. Take it to a dry cleaner.' },
    ],
    avoid: [{ ar: 'لا تستخدم حرارة قبل أن تزول البقعة.', en: 'No heat until the stain is gone.' }],
  },
  {
    id: 'ink',
    name: { ar: 'حبر قلم', en: 'Ink (pen)' },
    icon: 'edit-2',
    sturdy: [
      { ar: 'ضع قطعة قماش نظيفة تحت البقعة.', en: 'Put a clean cloth under the stain.' },
      { ar: 'ضع قليلًا من الكحول الطبي على قطنة، واضغط على البقعة دون فرك، وبدّل القطنة كلما اتسخت.', en: 'Dab rubbing alcohol on cotton wool, press on the stain without rubbing, and swap the cotton when it picks up ink.' },
      { ar: 'اشطف بماء بارد، ثم اغسل بالمعتاد.', en: 'Rinse with cold water, then wash as usual.' },
    ],
    delicate: [
      { ar: 'لا تضع كحولًا، فقد يؤذي بعض الأقمشة والأصباغ. خذها إلى التنظيف الجاف.', en: 'Do not use alcohol; it can damage some fabrics and dyes. Take it to a dry cleaner.' },
    ],
    avoid: [{ ar: 'اختبر الكحول أولًا على جزء مخفي.', en: 'Test the alcohol on a hidden spot first.' }],
  },
  {
    id: 'blood',
    name: { ar: 'دم', en: 'Blood' },
    icon: 'heart',
    sturdy: [
      { ar: 'اشطف بماء بارد جدًا من الجهة الخلفية للقماش في أسرع وقت.', en: 'Rinse with very cold water from the back as soon as possible.' },
      { ar: 'انقعها في ماء بارد مع قليل من المنظف.', en: 'Soak in cold water with a little detergent.' },
      { ar: 'اغسلها بماء بارد. إن بقي أثر على قطن أبيض فاختبر قليلًا من ماء الأكسجين 3٪ على جزء مخفي أولًا.', en: 'Wash cold. If a mark remains on white cotton, test a little 3% hydrogen peroxide on a hidden spot first.' },
    ],
    delicate: [
      { ar: 'اشطف بماء بارد برفق فقط.', en: 'Rinse gently with cold water only.' },
      { ar: 'إن بقي أثر فخذها إلى التنظيف الجاف.', en: 'If a mark remains, take it to a dry cleaner.' },
    ],
    avoid: [{ ar: 'لا تستخدم ماءً ساخنًا أبدًا، فهو يثبّت الدم.', en: 'Never use hot water; it sets blood.' }],
  },
  {
    id: 'sweat',
    name: { ar: 'عرق واصفرار', en: 'Sweat and yellowing' },
    icon: 'cloud-drizzle',
    sturdy: [
      { ar: 'اصنع عجينة من المنظف ومبيّض أكسجين وقليل من الماء، وافركها على المنطقة.', en: 'Make a paste of detergent, oxygen-based whitener and a little water; rub it into the area.' },
      { ar: 'اتركها 30 إلى 60 دقيقة.', en: 'Leave 30 to 60 minutes.' },
      { ar: 'اغسل بأدفأ ماء يسمح به الملصق.', en: 'Wash in the warmest water the label allows.' },
    ],
    delicate: [
      { ar: 'رطّب المنطقة برفق بماء بارد ومنظف لطيف للأقمشة الرقيقة.', en: 'Gently dampen the area with cold water and a mild delicates wash.' },
      { ar: 'للاصفرار القديم فالتنظيف الجاف أسلم.', en: 'For old yellowing, dry cleaning is safer.' },
    ],
    avoid: [{ ar: 'لا تستخدم مبيّض الكلور على الأقمشة الصناعية فهو يزيد الاصفرار.', en: 'Avoid chlorine bleach on synthetics; it can worsen yellowing.' }],
  },
  {
    id: 'makeup',
    name: { ar: 'مكياج', en: 'Makeup' },
    icon: 'smile',
    sturdy: [
      { ar: 'ارفع الزائد بقطعة نظيفة دون فرك.', en: 'Lift off the excess with a clean cloth without rubbing.' },
      { ar: 'ضع ماء ميسيلار أو سائل غسل الصحون، وافرك بلطف.', en: 'Apply micellar water or dish soap and rub gently.' },
      { ar: 'اغسل بالبرنامج المعتاد.', en: 'Wash as usual.' },
    ],
    delicate: [
      { ar: 'ارفع الزائد فقط، ثم خذها إلى التنظيف الجاف.', en: 'Lift only the excess, then take it to a dry cleaner.' },
    ],
    avoid: [{ ar: 'لا تفرك، فالمكياج الدهني ينتشر.', en: 'Do not rub; oily makeup spreads.' }],
  },
  {
    id: 'mud-dust',
    name: { ar: 'طين أو غبار', en: 'Mud or dust' },
    icon: 'cloud',
    sturdy: [
      { ar: 'اتركه يجف تمامًا، ثم انفضه أو افركه بفرشاة ناعمة.', en: 'Let it dry fully, then shake or brush it off.' },
      { ar: 'اشطف بماء بارد، ثم اغسل بالمعتاد.', en: 'Rinse in cold water, then wash as usual.' },
    ],
    delicate: [
      { ar: 'انفضه وهو جاف بفرشاة ناعمة جدًا.', en: 'Brush it off dry with a very soft brush.' },
      { ar: 'ثم اغسلها يدويًا بماء بارد وغسول لطيف.', en: 'Then hand wash in cold water with a mild wash.' },
    ],
    avoid: [{ ar: 'لا تفرك الطين وهو رطب، فهذا يدخله في الألياف.', en: 'Do not rub wet mud; it pushes into the fibres.' }],
  },
];

export const DELICATE_FOR_STAINS: FabricType[] = ['silk', 'wool', 'cashmere', 'viscose', 'unknown'];

/** Unknown fabric is treated as delicate: the safe assumption. */
export function stainAdvice(stainId: string, fabric: FabricType) {
  const stain = stainGuides.find((s) => s.id === stainId);
  if (!stain) return undefined;
  const delicate = DELICATE_FOR_STAINS.includes(fabric);
  return { stain, delicate, steps: delicate ? stain.delicate : stain.sturdy, avoid: stain.avoid };
}
