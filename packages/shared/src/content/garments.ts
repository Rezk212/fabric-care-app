import type { Bilingual, FabricType } from '../domain';

/**
 * Gulf garments with careful, general care notes. These are starting points, not a substitute for the
 * garment's own care label: the app always says so. Review wording with someone who launders these daily.
 */
export interface GulfGarment {
  id: string;
  name: Bilingual;
  /** Feather icon name. */
  icon: string;
  /** Fabric these are most commonly made of; the user can change it on the result screen. */
  fabric: FabricType;
  fabricNote: Bilingual;
  tips: Bilingual[];
  avoid: Bilingual[];
}

export const gulfGarments: GulfGarment[] = [
  {
    id: 'dishdasha-white',
    name: { ar: 'دشداشة بيضاء', en: 'White dishdasha / thobe' },
    icon: 'user',
    fabric: 'synthetic_blend',
    fabricNote: {
      ar: 'غالبًا قماش من البوليستر أو خليط قطن وبوليستر. راجع ملصق العناية.',
      en: 'Often polyester or a cotton-polyester blend. Check the label.',
    },
    tips: [
      { ar: 'اغسلها وحدها أو مع الأبيض فقط، حتى لا تأخذ لونًا من غيرها.', en: 'Wash alone or with whites only so it does not pick up colour.' },
      { ar: 'عالج الياقة والأكمام قبل الغسيل: افرك قليلًا من المنظف على البقع، واتركه 15 دقيقة.', en: 'Pre-treat collar and cuffs: rub in a little detergent and leave 15 minutes.' },
      { ar: 'للاصفرار من العرق أو الغبار: انقعها في ماء فاتر مع مبيّض أكسجين، ثم اغسلها.', en: 'For yellowing from sweat or dust: soak in lukewarm water with an oxygen-based whitener, then wash.' },
      { ar: 'اكوِها وهي رطبة قليلًا على حرارة متوسطة، فتزول التجاعيد بسهولة.', en: 'Iron while slightly damp on medium heat; creases come out easily.' },
    ],
    avoid: [
      { ar: 'لا تستخدم مبيّض الكلور على الأقمشة الصناعية أو المطرزة، وقد يُصفّرها.', en: 'Avoid chlorine bleach on synthetic or embroidered fabric; it can yellow it.' },
      { ar: 'لا تتركها مبللة في سلة الغسيل.', en: 'Do not leave it damp in the laundry basket.' },
    ],
  },
  {
    id: 'dishdasha-colour',
    name: { ar: 'دشداشة ملوّنة', en: 'Coloured dishdasha / thobe' },
    icon: 'user',
    fabric: 'synthetic_blend',
    fabricNote: {
      ar: 'غالبًا خليط صناعي. في أول غسلات قد يخرج بعض اللون.',
      en: 'Often a synthetic blend. Some dye may bleed in the first washes.',
    },
    tips: [
      { ar: 'اغسلها مقلوبة بماء بارد إلى فاتر مع منظف مخصص للألوان.', en: 'Wash inside out in cold to lukewarm water with a colour-safe detergent.' },
      { ar: 'اغسل أول مرة وحدها، فقد يخرج منها اللون.', en: 'Wash it alone the first time; dye may bleed.' },
      { ar: 'جفّفها في الظل. الشمس المباشرة تُبهت الألوان.', en: 'Dry in the shade. Direct sun fades colour.' },
    ],
    avoid: [
      { ar: 'لا تستخدم المبيّض.', en: 'Do not use bleach.' },
      { ar: 'لا تغسلها مع الأبيض.', en: 'Do not wash with whites.' },
    ],
  },
  {
    id: 'abaya',
    name: { ar: 'عباية سوداء', en: 'Black abaya' },
    icon: 'moon',
    fabric: 'polyester',
    fabricNote: {
      ar: 'كثير من العبايات من أقمشة صناعية ناعمة (كريب أو نيدا). راجع ملصق العناية.',
      en: 'Many abayas are soft synthetics (crepe or nida). Check the label.',
    },
    tips: [
      { ar: 'اغسلها مقلوبة في كيس غسيل شبكي، بماء بارد (30°م) وبرنامج لطيف.', en: 'Wash inside out in a mesh bag, cold (30°C), gentle cycle.' },
      { ar: 'استخدم منظفًا للملابس الداكنة حتى لا يبهت اللون.', en: 'Use a detergent made for dark clothes to reduce fading.' },
      { ar: 'جفّفها في الظل معلّقة على علاقة، ولا تعصرها بقوة.', en: 'Dry in the shade on a hanger; do not wring hard.' },
      { ar: 'للكي: اكوِها مقلوبة على حرارة منخفضة، أو استخدم البخار فقط.', en: 'To iron: inside out on low heat, or just steam it.' },
      { ar: 'إن كان عليها خرز أو تطريز، اغسلها يدويًا بلطف.', en: 'If it has beads or embroidery, hand wash gently.' },
    ],
    avoid: [
      { ar: 'لا تستخدم المبيّض ولا الماء الساخن.', en: 'No bleach and no hot water.' },
      { ar: 'لا تضعها في المجفف الآلي.', en: 'Do not tumble dry.' },
    ],
  },
  {
    id: 'ghutra',
    name: { ar: 'غترة / شماغ', en: 'Ghutra / shemagh' },
    icon: 'flag',
    fabric: 'cotton',
    fabricNote: {
      ar: 'غالبًا قطن. الشماغ الأحمر والأبيض قد يخرج منه اللون.',
      en: 'Usually cotton. A red-and-white shemagh can bleed dye.',
    },
    tips: [
      { ar: 'الشماغ الملوّن: اغسله وحده بماء بارد في أول مرات.', en: 'Coloured shemagh: wash alone in cold water for the first few washes.' },
      { ar: 'الغترة البيضاء: اغسلها مع الأبيض، وعالج الأطراف المتّسخة قبل الغسيل.', en: 'White ghutra: wash with whites and pre-treat dirty edges.' },
      { ar: 'اكوِها وهي رطبة قليلًا لتثبيت الطيّات.', en: 'Iron while slightly damp to set the folds.' },
    ],
    avoid: [
      { ar: 'لا تنقعها طويلًا مع الأبيض، فقد يتسرّب اللون.', en: 'Do not soak long with whites; dye can transfer.' },
    ],
  },
  {
    id: 'kumma',
    name: { ar: 'كمّة مطرّزة', en: 'Embroidered kumma cap' },
    icon: 'award',
    fabric: 'cotton',
    fabricNote: {
      ar: 'قطن مع تطريز. التطريز يتأثر بالفرك والحرارة.',
      en: 'Cotton with embroidery. The stitching suffers from rubbing and heat.',
    },
    tips: [
      { ar: 'اغسلها يدويًا بماء بارد وصابون لطيف، ودون فرك التطريز.', en: 'Hand wash in cool water with mild soap, without rubbing the embroidery.' },
      { ar: 'اضغطها بين منشفتين لسحب الماء، ولا تعصرها.', en: 'Press between two towels to remove water; do not wring.' },
      { ar: 'جفّفها مفروشة على منشفة، وشكّلها بيدك وهي رطبة.', en: 'Dry flat on a towel and reshape by hand while damp.' },
    ],
    avoid: [
      { ar: 'لا تضعها في الغسالة ولا المجفف.', en: 'Not in the washing machine or dryer.' },
      { ar: 'لا تستخدم المبيّض.', en: 'No bleach.' },
    ],
  },
  {
    id: 'mussar',
    name: { ar: 'مصر عُماني', en: 'Omani mussar (turban)' },
    icon: 'layers',
    fabric: 'wool',
    fabricNote: {
      ar: 'قد يكون صوفًا أو باشمينا أو خليطًا، وبه أهداب. غير مؤكد، فراجع ملصق العناية.',
      en: 'May be wool, pashmina or a blend, with fringes. Not certain, so check the label.',
    },
    tips: [
      { ar: 'إن كان الملصق يقول "تنظيف جاف" فاتبعها.', en: 'If the label says dry clean, follow it.' },
      { ar: 'للغسيل اليدوي: ماء بارد وغسول للصوف، وحركة لطيفة دون فرك.', en: 'To hand wash: cold water and wool wash, gentle movement, no rubbing.' },
      { ar: 'جفّفه مفروشًا، وأزل التجاعيد بالبخار من بعيد.', en: 'Dry flat and remove creases with steam from a distance.' },
    ],
    avoid: [
      { ar: 'لا تعصره ولا تعلّقه وهو مبلل، فيتمدد.', en: 'Do not wring or hang it wet; it will stretch.' },
      { ar: 'لا تضعه في المجفف.', en: 'Do not tumble dry.' },
    ],
  },
  {
    id: 'shayla',
    name: { ar: 'شيلة / حجاب شيفون', en: 'Shayla / chiffon hijab' },
    icon: 'wind',
    fabric: 'polyester',
    fabricNote: {
      ar: 'الشيفون عادةً بوليستر خفيف تنسحب خيوطه بسهولة.',
      en: 'Chiffon is usually light polyester that snags easily.',
    },
    tips: [
      { ar: 'ضعها في كيس غسيل شبكي، وبرنامج لطيف بماء بارد.', en: 'Put in a mesh bag; gentle cycle, cold water.' },
      { ar: 'انشرها دون عصر، ولا تعلقها بمشبك يترك أثرًا.', en: 'Hang without wringing and avoid pegs that leave marks.' },
      { ar: 'اكوِها على حرارة منخفضة فوق قطعة قماش رقيقة.', en: 'Iron on low heat over a thin cloth.' },
    ],
    avoid: [
      { ar: 'لا تغسلها مع ملابس بسحّابات أو أزرار.', en: 'Do not wash with items that have zips or buttons.' },
    ],
  },
];

/** Shown on every garment/stain page. */
export const CHECK_LABEL_NOTE: Bilingual = {
  ar: 'نصائح عامة. اتبع ملصق العناية في قطعتك أولًا.',
  en: 'General advice. Always follow your garment\'s own care label first.',
};
