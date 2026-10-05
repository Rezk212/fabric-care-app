import type { Bilingual } from '../domain';

export interface TourSlide {
  id: string;
  /** Feather icon name. */
  icon: string;
  title: Bilingual;
  body: Bilingual;
}

export type TourKey = 'intro' | 'analyze' | 'guide' | 'stores' | 'machines' | 'settings';
export const SECTION_TOURS = ['analyze', 'guide', 'stores', 'machines', 'settings'] as const;

const S = (id: string, icon: string, tAr: string, tEn: string, bAr: string, bEn: string): TourSlide =>
  ({ id, icon, title: { ar: tAr, en: tEn }, body: { ar: bAr, en: bEn } });

/** Short, plain walkthroughs: one for the whole app, one per section. */
export const tours: Record<TourKey, TourSlide[]> = {
  intro: [
    S('welcome', 'droplet', 'أهلًا بك في نقاء', 'Welcome to Naqa', 'نساعدك على غسل كل قطعة بالطريقة الصحيحة، خطوة بخطوة.', 'We help you wash every garment the right way, step by step.'),
    S('photos', 'camera', 'صوّر قطعتك', 'Photograph your garment', 'صوّر القطعة وملصق المواصفات وملصق تعليمات الغسيل، ويقرؤها نقاء لك.', 'Photograph the garment, its product label and its washing label, and Naqa reads them for you.'),
    S('manual', 'edit-3', 'أو أدخل بياناتك بنفسك', 'Or enter it yourself', 'اختر نوع القطعة والقماش واللون والبقع من قوائم بسيطة، وستصلك خطة الغسيل.', 'Pick the garment, fabric, colour and stains from simple lists and get your wash plan.'),
    S('plan', 'check-circle', 'خطة غسيل واضحة', 'A clear wash plan', 'تعرف البرنامج ودرجة الحرارة والعصر والكي، مع نصائح تناسب قطعتك.', 'See the programme, temperature, spin and ironing, with tips for your garment.'),
    S('stores', 'map-pin', 'تسوّق بذكاء', 'Shop smart', 'اعرف أقرب فرع لولو أو نيستو أو غيرهما، وتابع أحدث العروض.', 'Find the nearest Lulu, Nesto and other branches, and follow the latest offers.'),
    S('guide', 'book-open', 'دليل العناية', 'Care guide', 'إجابات سريعة عن الملابس الخليجية والبقع ورموز الغسيل والغسالات.', 'Quick answers on Gulf garments, stains, care symbols and washing machines.'),
    S('help', 'alert-circle', 'نحن معك دائمًا', 'We are always here', 'في أعلى كل قسم علامة (!). اضغط عليها في أي وقت لتعرف كيف يعمل هذا القسم.', 'Every section has a (!) at the top. Tap it any time to see how that section works.'),
  ],
  analyze: [
    S('a1', 'camera', 'أضف الصور', 'Add photos', 'صوّر القطعة كاملة، ثم ملصق المواصفات، ثم ملصق تعليمات الغسيل. تكفي صورة واحدة لتبدأ.', 'Photograph the whole garment, then the product label and the washing label. One photo is enough to start.'),
    S('a2', 'edit-3', 'أو أدخل البيانات بنفسك', 'Or enter the details yourself', 'اضغط «أدخل البيانات بنفسي»، واختر القطعة ثم القماش ثم اللون، وأضف البقع إن وجدت.', 'Tap "Enter it myself", then choose the garment, fabric and colour, and add any stains.'),
    S('a3', 'check-circle', 'اضغط ابدأ', 'Press start', 'تظهر لك خطة الغسيل مع نصائح ومنتجات مناسبة. وإن لم تعرف القماش فستجده على الملصق.', 'You get your wash plan with tips and suitable products. If you do not know the fabric, look on the label.'),
    S('a4', 'zap', 'تحليلاتك اليومية', 'Your daily analyses', 'العدد الظاهر أعلى الصفحة هو ما تبقى لك اليوم، ويتجدد كل يوم.', 'The number at the top is what you have left today, and it renews every day.'),
  ],
  guide: [
    S('g1', 'book-open', 'دليل بلا صور', 'A guide with no photos needed', 'اختر القسم الذي تريده وستجد الإجابة بسرعة.', 'Pick a section and find the answer fast.'),
    S('g2', 'user', 'ملابسنا والبقع والرموز', 'Garments, stains and symbols', 'خطوات العناية بالدشداشة والعباية وغيرهما، وإزالة كل بقعة، ومعنى كل رمز على الملصق.', 'Care steps for the dishdasha, abaya and more, how to remove each stain, and what each label symbol means.'),
    S('g3', 'settings', 'المنتجات والأجهزة', 'Products and machines', 'تعرّف على أنواع الغسالات والمجففات، وعلى المنظفات والمنعّمات وأين تجدها.', 'Learn about washer and dryer types, and about detergents and softeners and where to find them.'),
  ],
  stores: [
    S('s1', 'navigation', 'حدّد موقعك', 'Set your location', 'اضغط «استخدم موقعي لأقرب فرع»، أو اختر منطقتك من القائمة.', 'Tap "Use my location", or choose your area from the list.'),
    S('s2', 'shopping-bag', 'فروع قريبة', 'Nearby branches', 'نعرض فروع لولو ونيستو وهايبرماكس وغيرها بحسب قربها منك، ويمكنك التصفية حسب السلسلة.', 'We list Lulu, Nesto, Hypermax and other branches by distance, and you can filter by chain.'),
    S('s3', 'map-pin', 'الاتجاهات', 'Directions', 'اضغط «الاتجاهات» لتفتح الطريق إلى الفرع في الخرائط.', 'Tap "Directions" to open the route to the branch in Maps.'),
  ],
  machines: [
    S('m1', 'disc', 'أجهزتك', 'Your machines', 'هنا غسالتك ومجففك. أضفهما مرة واحدة لتناسبك التوصيات.', 'Your washer and dryer live here. Add them once so advice fits you.'),
    S('m2', 'edit-2', 'النوع والماركة والموديل', 'Type, brand and model', 'اختر النوع من القائمة، ثم الماركة، ثم اكتب رقم الموديل.', 'Choose the type from the list, then the brand, then type the model number.'),
    S('m3', 'camera', 'صورة اختيارية', 'An optional photo', 'يمكنك إضافة صورة للوحة الأزرار أو لملصق الموديل الآن أو في وقت لاحق.', 'You can add a photo of the control panel or model sticker now or later.'),
  ],
  settings: [
    S('t1', 'globe', 'اللغة والمظهر', 'Language and appearance', 'غيّر اللغة، واختر المظهر الفاتح أو الداكن أو التلقائي.', 'Change the language and pick light, dark or automatic.'),
    S('t2', 'user', 'بياناتك', 'Your details', 'عدّل موقعك وأجهزتك وملابسك وأقمشتك والمنظفات التي تستخدمها.', 'Update your location, machines, clothes, fabrics and the detergents you use.'),
    S('t3', 'shield', 'الخصوصية والإشعارات', 'Privacy and notifications', 'تحكّم بالإشعارات، واقرأ الشروط وإخلاء المسؤولية، ويمكنك حذف حسابك في أي وقت.', 'Control notifications, read the terms and disclaimer, and delete your account any time.'),
  ],
};
