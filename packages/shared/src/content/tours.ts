import type { Bilingual } from '../domain';

/** Slides that play a short scripted demo of the real screen (finger taps, fields fill) instead of an icon. */
export type TourDemo = 'garment' | 'label' | 'label2' | 'analyze' | 'manual';

export interface TourSlide {
  id: string;
  /** When set, the player shows a live demo of that step in place of the icon. */
  demo?: TourDemo;
  /** Feather icon name. */
  icon: string;
  title: Bilingual;
  body: Bilingual;
}

export type TourKey =
  | 'intro' | 'analyze' | 'guide' | 'stores' | 'machines' | 'settings' | 'result'
  | 'garments' | 'stains' | 'symbols' | 'productsGuide' | 'appliancesGuide' | 'product';

/** Guides that appear by themselves, once, for anyone who skipped the first-run tour. */
export const SECTION_TOURS = ['analyze', 'guide', 'stores', 'machines', 'settings', 'result'] as const;

const S = (id: string, icon: string, tAr: string, tEn: string, bAr: string, bEn: string, demo?: TourDemo): TourSlide =>
  ({ id, icon, title: { ar: tAr, en: tEn }, body: { ar: bAr, en: bEn }, ...(demo ? { demo } : {}) });

/** Short, plain walkthroughs: one for the whole app, one per section and one for the main inner screens. */
export const tours: Record<TourKey, TourSlide[]> = {
  intro: [
    S('welcome', 'droplet', 'أهلًا بك في نقاء', 'Welcome to Naqa', 'نساعدك على غسل كل قطعة بالطريقة الصحيحة، خطوة بخطوة.', 'We help you wash every garment the right way, step by step.'),
    S('photos', 'camera', 'صوّر قطعتك', 'Photograph your garment', 'صوّر القطعة، وملصق مواصفاتها، وملصق تعليمات الغسيل، ويقرؤها نقاء لك. وتكفي صورة واحدة لتبدأ.', 'Photograph the garment, its product label and its washing label, and Naqa reads them for you. One photo is enough to start.'),
    S('manual', 'edit-3', 'أو أدخل بياناتك بنفسك', 'Or enter it yourself', 'اختر نوع القطعة، ثم القماش، ثم اللون، وأضف البقع إن وجدت، من قوائم بسيطة وفيها خيار «أخرى» لتكتب ما تريد.', 'Choose the garment, fabric and colour, add any stains, from simple lists with an "Other" option to type your own.'),
    S('plan', 'check-circle', 'خطة غسيل واضحة', 'A clear wash plan', 'تعرف البرنامج ودرجة الحرارة والعصر والتجفيف والكي والمبيّض، وبرنامج غسالتك إن سجّلتها.', 'See the programme, temperature, spin, drying, ironing and bleach, and your machine\'s programme if you added it.'),
    S('tips', 'droplet', 'نصائح وبقع', 'Tips and stains', 'نضيف نصائح خاصة بقطعتك، وخطوات إزالة كل بقعة اخترتها، وتنبيهًا إن كان التنظيف الجاف أنسب.', 'We add tips for your garment, steps to remove each stain you chose, and a note when dry cleaning is the safer choice.'),
    S('products', 'package', 'منتجات تناسب قطعتك', 'Products that suit your garment', 'نقترح منظفات ومنعّمات مناسبة. اضغط أي منتج لترى تفاصيله وطريقة استخدامه وسعره وأقرب فرع يبيعه، ونخبرك إن كان ما تستخدمه حاليًا مناسبًا.', 'We suggest suitable detergents and softeners. Tap one to see details, how to use it, its price and the nearest branch, and we tell you if what you use now is a good fit.'),
    S('stores', 'map-pin', 'المتاجر والعروض', 'Stores and offers', 'أقرب فروع لولو ونيستو وغيرهما بحسب موقعك، وسلايدر العروض في الصفحة الرئيسية، ويمكنك مشاركة أي عرض مع أصدقائك.', 'The nearest Lulu, Nesto and other branches by location, an offers slider on the home page, and you can share any offer with friends.'),
    S('guide', 'book-open', 'دليل العناية', 'Care guide', 'ملابسنا الخليجية، وإزالة البقع، ورموز الغسيل، والمنتجات، وأنواع الغسالات والمجففات ونصائح صيانتها، بلا حاجة إلى صورة.', 'Gulf garments, stain removal, care symbols, products, washer and dryer types and upkeep tips, no photo needed.'),
    S('profile', 'disc', 'أجهزتك وملابسك', 'Your machines and clothes', 'سجّل غسالتك ومجففك (النوع والماركة والموديل وصورة)، والملابس والأقمشة والمنظفات التي تستخدمها، لتناسبك كل التوصيات.', 'Add your washer and dryer (type, brand, model, photo) and the clothes, fabrics and detergents you use, so every tip fits you.'),
    S('limit', 'zap', 'تحليلاتك اليومية', 'Your daily analyses', 'لك عدد من تحليلات الصور مجانًا كل يوم. والإدخال اليدوي والدليل مفتوحان دائمًا بلا حد.', 'You get a number of free photo analyses each day. Manual entry and the guide are always open with no limit.'),
    S('settings', 'settings', 'تحكّم بتجربتك', 'You are in control', 'غيّر اللغة والمظهر والموقع، وتحكّم بالإشعارات، واقرأ الخصوصية والشروط، وشاهد هذه الجولة من جديد، ويمكنك حذف حسابك في أي وقت.', 'Change language, appearance and location, control notifications, read privacy and terms, replay this tour, and delete your account any time.'),
    S('help', 'alert-circle', 'نحن معك دائمًا', 'We are always here', 'في أعلى كل قسم وكل صفحة مهمة علامة (!). اضغط عليها في أي وقت لتعرف كيف تعمل.', 'Every section and main page has a (!) at the top. Tap it any time to see how it works.'),
  ],
  analyze: [
    S('a1', 'camera', 'صورة القطعة', 'Photo of the garment', 'اضغط الخانة الكبيرة وصوّر القطعة كاملة. وتكفي صورة واحدة من الصور الثلاث لتبدأ.', 'Tap the big box and photograph the whole garment. One of the three photos is enough to start.', 'garment'),
    S('a2', 'tag', 'ملصق المواصفات', 'The details label', 'الملصق الأول فيه القماش والمقاس. اضغط خانته وصوّره بوضوح.', 'The first label has the fabric and size. Tap its box and photograph it clearly.', 'label'),
    S('a3', 'file-text', 'ملصق تعليمات الغسيل', 'The washing label', 'الملصق الثاني فيه رموز الغسيل. صوّره ليقرأه نقاء بدقة.', 'The second label has the washing symbols. Photograph it so Naqa reads it accurately.', 'label2'),
    S('a4', 'search', 'ابدأ التحليل', 'Start the analysis', 'اضغط «ابدأ التحليل» وانتظر ثوانٍ قليلة، فتظهر خطة الغسيل مع النصائح والمنتجات المناسبة.', 'Tap "Start analysis" and wait a few seconds for your wash plan with tips and suitable products.', 'analyze'),
    S('a5', 'edit-3', 'أو أدخل البيانات بنفسك', 'Or enter the details yourself', 'اضغط «أدخل البيانات بنفسي» واختر القطعة والقماش واللون. وتظهر لك ملابسك وأقمشتك المسجّلة أولًا.', 'Tap "Enter it myself" and pick the garment, fabric and colour. Your saved clothes and fabrics come first.', 'manual'),
  ],
  result: [
    S('r1', 'sliders', 'خطة الغسيل', 'Your wash plan', 'في الأعلى أنسب برنامج ودرجة حرارة. وتحته التفاصيل: العصر، والتجفيف، والكي، والمبيّض.', 'At the top is the best programme and temperature, then the details: spin, drying, ironing and bleach.'),
    S('r2', 'disc', 'برنامج غسالتك', 'Your machine\'s programme', 'إن سجّلت غسالتك ظهر اسم البرنامج الأقرب على جهازك.', 'If you added your washer, you see the closest programme name on your machine.'),
    S('r3', 'droplet', 'علاج البقع', 'Stain treatment', 'إن اخترت بقعًا فتجد خطوات إزالة كل بقعة، وما يجب تجنّبه.', 'If you chose stains you get the steps to remove each one and what to avoid.'),
    S('r4', 'info', 'نصائح وملاحظات', 'Tips and notes', 'نصائح خاصة بقطعتك، وملاحظات مهمة بحسب اللون والقماش.', 'Tips for your garment and notes based on colour and fabric.'),
    S('r5', 'check-square', 'هل منتجاتك مناسبة؟', 'Do your products suit it?', 'إن سجّلت المنظفات والمنعّمات التي تستخدمها، قلنا لك إن كانت مناسبة لهذه القطعة أم يُفضَّل غيرها.', 'If you saved the detergents and softeners you use, we say whether they suit this garment or something else is better.'),
    S('r6', 'package', 'منتجات وأقرب متجر', 'Products and the nearest store', 'اضغط أي منتج مقترح لترى تفاصيله وسعره وطريقة استخدامه وأقرب فرع. وتأكد من التوفر في المتجر.', 'Tap any suggested product to see details, price, how to use it and the nearest branch. Confirm stock in store.'),
  ],
  guide: [
    S('g1', 'book-open', 'دليل بلا صور', 'A guide with no photos needed', 'اختر القسم الذي تريده وستجد الإجابة بسرعة. وكل صفحة فيها علامة (!) تشرح لك ما فيها.', 'Pick a section and find the answer fast. Each page has a (!) that explains it.'),
    S('g2', 'user', 'ملابسنا', 'Our garments', 'الدشداشة والعباية والغترة والكمّة والمصّر والشيلة، ولكل قطعة نصائح العناية وما يجب تجنّبه.', 'The dishdasha, abaya, ghutra, kumma, mussar and shayla, each with care tips and what to avoid.'),
    S('g3', 'droplet', 'إزالة البقع', 'Stain removal', 'اختر نوع البقعة ثم القماش، وتظهر لك الخطوات المناسبة.', 'Pick the stain and then the fabric to see the right steps.'),
    S('g4', 'tag', 'رموز الغسيل', 'Care symbols', 'معنى كل رمز على ملصق العناية، بالرسم والشرح.', 'What every care-label symbol means, drawn and explained.'),
    S('g5', 'package', 'المنتجات', 'Products', 'المنظفات والمنعّمات والمبيّضات، مقسّمة إلى أقسام. اضغط أي منتج لتفاصيله وأقرب فرع.', 'Detergents, softeners and bleaches in sections. Tap any product for details and the nearest branch.'),
    S('g6', 'settings', 'الغسالات والمجففات', 'Washers and dryers', 'أنواع الغسالات والمجففات برسومها ومزاياها وعيوبها، وكيف تختار السعة، ونصائح صيانة لكل نوع.', 'Washer and dryer types with drawings, pros and cons, how to choose capacity, and upkeep tips for each.'),
  ],
  garments: [
    S('ga1', 'user', 'ملابسنا', 'Our garments', 'اختر قطعة لترى من أي قماش تُصنع غالبًا، وكيف تعتني بها، وما تتجنّبه.', 'Choose a garment to see what it is usually made of, how to care for it and what to avoid.'),
    S('ga2', 'play', 'اعرض خطة الغسيل', 'Show the wash plan', 'في صفحة القطعة زر يفتح لك خطة غسيل جاهزة لها.', 'Each garment page has a button that opens a ready wash plan for it.'),
  ],
  stains: [
    S('st1', 'droplet', 'اختر البقعة', 'Pick the stain', 'اضغط نوع البقعة: قهوة، أو زيت، أو كركم، أو عطر، أو غيرها.', 'Tap the stain: coffee, oil, turmeric, perfume or others.'),
    S('st2', 'layers', 'ثم القماش', 'Then the fabric', 'الأقمشة الرقيقة والمجهولة تُعامل بلطف أكثر، وقد يكون التنظيف الجاف أنسب.', 'Delicate or unknown fabrics are treated more gently, and dry cleaning may be safer.'),
  ],
  symbols: [
    S('sy1', 'tag', 'رموز ملصق العناية', 'Care-label symbols', 'هنا كل رمز بشكله ومعناه: الغسيل، والتبييض، والتجفيف، والكي، والتنظيف الجاف.', 'Every symbol with its shape and meaning: washing, bleaching, drying, ironing and dry cleaning.'),
    S('sy2', 'check', 'اتبع ملصقك دائمًا', 'Always follow your label', 'إذا اختلف الملصق عن نصيحة عامة فالملصق هو المرجع.', 'If your label differs from general advice, the label wins.'),
  ],
  productsGuide: [
    S('pg1', 'package', 'أقسام المنتجات', 'Product sections', 'استخدم الأزرار في الأعلى لتختار: التبييض، أو الألوان، أو المنعّمات، أو منتجات أخرى.', 'Use the buttons at the top to pick bleaching, colour care, softeners or other products.'),
    S('pg2', 'info', 'تفاصيل المنتج', 'Product details', 'اضغط أي منتج لترى وصفه وطريقة استخدامه وسعره وأقرب فرع يبيعه.', 'Tap any product to see its description, how to use it, its price and the nearest branch selling it.'),
  ],
  appliancesGuide: [
    S('ag1', 'disc', 'الغسالات والمجففات', 'Washers and dryers', 'بدّل بين الغسالات والمجففات بالزرين في الأعلى.', 'Switch between washers and dryers with the two buttons at the top.'),
    S('ag2', 'thumbs-up', 'المزايا والعيوب', 'Pros and cons', 'لكل نوع رسم وشرح ومزايا وعيوب وما يناسبه ونصائح صيانته.', 'Each type has a drawing, an explanation, pros and cons, who it suits and upkeep tips.'),
    S('ag3', 'maximize', 'كيف تختار السعة', 'Choosing capacity', 'في آخر الصفحة بطاقة تساعدك على اختيار الحجم المناسب لأسرتك.', 'A card at the end helps you pick the right size for your household.'),
  ],
  product: [
    S('p1', 'info', 'عن المنتج', 'About the product', 'وصفه، والأقمشة التي يناسبها، وطريقة الاستخدام، وأي تنبيه مهم.', 'What it is, the fabrics it suits, how to use it and any important caution.'),
    S('p2', 'tag', 'السعر', 'Price', 'نعرض السعر عندما يزوّدنا به المتجر أو المعلن. وإن لم يظهر فتأكد من المتجر.', 'We show the price when a store or advertiser provides it. If it is missing, check in store.'),
    S('p3', 'map-pin', 'أين تجده', 'Where to find it', 'أقرب الفروع التي تبيع هذا النوع، وزر «الاتجاهات» يفتح الطريق في الخرائط.', 'The nearest branches that sell this kind, and "Directions" opens the route in Maps.'),
  ],
  stores: [
    S('s1', 'navigation', 'حدّد موقعك', 'Set your location', 'اضغط «استخدم موقعي لأقرب فرع»، أو اختر منطقتك من القائمة.', 'Tap "Use my location", or choose your area from the list.'),
    S('s2', 'shopping-bag', 'فروع قريبة', 'Nearby branches', 'نعرض فروع لولو ونيستو وهايبرماكس ومكة والميرة وغيرها بحسب قربها منك، ويمكنك التصفية حسب السلسلة.', 'We list Lulu, Nesto, Hypermax, Makkah, Al Meera and other branches by distance, and you can filter by chain.'),
    S('s3', 'map-pin', 'الاتجاهات', 'Directions', 'اضغط «الاتجاهات» لتفتح الطريق إلى الفرع في الخرائط.', 'Tap "Directions" to open the route to the branch in Maps.'),
    S('s4', 'info', 'ملاحظة', 'A note', 'مواقع الفروع من خرائط مفتوحة يحدّثها متطوعون، فقد ينقص فرع أو يختلف موقعه قليلًا.', 'Branch locations come from open maps kept up to date by volunteers, so a branch may be missing or slightly off.'),
  ],
  machines: [
    S('m1', 'disc', 'أجهزتك', 'Your machines', 'هنا غسالتك ومجففك. أضفهما مرة واحدة لتناسبك التوصيات.', 'Your washer and dryer live here. Add them once so advice fits you.'),
    S('m2', 'edit-2', 'النوع والماركة والموديل', 'Type, brand and model', 'اختر النوع من القائمة (برسومها)، ثم الماركة، ثم اكتب رقم الموديل.', 'Choose the type from the list (with drawings), then the brand, then type the model number.'),
    S('m3', 'camera', 'صورة اختيارية', 'An optional photo', 'يمكنك إضافة صورة للوحة الأزرار أو لملصق الموديل الآن أو في وقت لاحق.', 'You can add a photo of the control panel or model sticker now or later.'),
    S('m4', 'clock', 'آخر تحليلاتك', 'Your recent analyses', 'تجد في آخر الصفحة سجل تحليلاتك الأخيرة، واضغط أي واحد لتراه من جديد.', 'At the bottom is your recent analyses; tap one to see it again.'),
  ],
  settings: [
    S('t1', 'globe', 'اللغة والمظهر', 'Language and appearance', 'غيّر اللغة، واختر المظهر الفاتح أو الداكن أو التلقائي.', 'Change the language and pick light, dark or automatic.'),
    S('t2', 'map-pin', 'موقعك', 'Your location', 'غيّر مدينتك لتظهر لك الفروع القريبة منك.', 'Change your city to see the branches near you.'),
    S('t3', 'disc', 'أجهزتك', 'Your machines', 'عدّل غسالتك ومجففك: النوع والماركة والموديل والصورة.', 'Edit your washer and dryer: type, brand, model and photo.'),
    S('t4', 'user', 'ملابسك وأقمشتك ومنظفاتك', 'Your clothes, fabrics and detergents', 'اختر ما تغسله عادةً وما تستخدمه من منظفات ومنعّمات، لنخبرك إن كانت مناسبة.', 'Pick what you usually wash and the detergents and softeners you use, so we can tell you if they suit.'),
    S('t5', 'bell', 'الإشعارات', 'Notifications', 'فعّل الإشعارات أو أوقفها متى شئت. لن نرسل شيئًا دون موافقتك.', 'Turn notifications on or off any time. We never send anything without your consent.'),
    S('t6', 'shield', 'الحساب والخصوصية', 'Account and privacy', 'اقرأ الخصوصية والشروط وإخلاء المسؤولية، وشارك التطبيق، وشاهد الجولة من جديد، وسجّل الخروج أو احذف حسابك.', 'Read privacy, terms and disclaimer, share the app, replay the tour, sign out or delete your account.'),
  ],
};
