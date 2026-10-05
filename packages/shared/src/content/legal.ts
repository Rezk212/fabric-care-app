import type { Bilingual } from '../domain';

export interface LegalSection { title: Bilingual; body: Bilingual }

/** Where users reach the owner. Replace before publishing. */
export const CONTACT_EMAIL = 'support@example.com';

/**
 * DRAFT legal text describing what the app actually does today. It is not legal advice:
 * have a qualified person review it, and fill in the owner's details, before publishing to the stores.
 */
export const privacyPolicy: LegalSection[] = [
  { title: { ar: 'ما نجمعه', en: 'What we collect' },
    body: { ar: 'بريدك الإلكتروني أو حساب Google عند التسجيل. الصور التي تختارها (القطعة أو ملصق العناية أو لوحة الغسالة) لتحليلها. نتائج التحليل وغسالاتك المحفوظة وعدد التحليلات اليومي. المدينة التي تختارها، وموقعك التقريبي إن سمحت به.', en: 'Your email or Google account when you sign up. The photos you choose (garment, care label, machine panel) so they can be analysed. Your analysis results, saved machines and daily analysis count. The city you pick, and your approximate location if you allow it.' } },
  { title: { ar: 'كيف نستخدمه', en: 'How we use it' },
    body: { ar: 'لتحليل الصور وتقديم توصيات الغسيل، ولحفظ سجلك، ولتطبيق حد الاستخدام اليومي، ولعرض أقرب المتاجر. لا نبيع بياناتك. العروض المموّلة تُعرض بوضوح بعلامة "برعاية" ولا تغيّر نصائح الغسيل.', en: 'To analyse photos and give wash advice, keep your history, apply the daily usage limit and show nearby stores. We do not sell your data. Sponsored offers are clearly labelled and never change wash advice.' } },
  { title: { ar: 'الجهات التي تعالج بياناتك', en: 'Services that process data' },
    body: { ar: 'الصور تُرسل إلى مزوّد الذكاء الاصطناعي المضبوط في الخادم (حاليًا Anthropic) لتحليلها فقط. الحسابات والبيانات المحفوظة تُخزَّن لدى Supabase. للبحث عن الفروع القريبة تُرسل إحداثياتك التقريبية إلى خدمة خرائط مفتوحة (OpenStreetMap/Photon).', en: 'Photos are sent to the AI provider configured on our server (currently Anthropic) only to be analysed. Accounts and saved data are stored with Supabase. To find nearby branches, your approximate coordinates are sent to an open map service (OpenStreetMap/Photon).' } },
  { title: { ar: 'مدة الاحتفاظ بالبيانات وحقوقك', en: 'Retention and your rights' },
    body: { ar: 'نحتفظ بنتائج تحليلاتك وغسالاتك حتى تحذف حسابك. يمكنك حذف حسابك وكل بياناته في أي وقت من الإعدادات. يمكنك إيقاف إذن الموقع من إعدادات هاتفك.', en: 'We keep your results and machines until you delete your account. You can delete your account and all its data any time in Settings. You can turn off location access in your phone settings.' } },
  { title: { ar: 'التواصل', en: 'Contact' },
    body: { ar: `لأي سؤال عن خصوصيتك: ${CONTACT_EMAIL}`, en: `Questions about your privacy: ${CONTACT_EMAIL}` } },
];

export const termsOfUse: LegalSection[] = [
  { title: { ar: 'إرشاد وليس ضمانًا', en: 'Guidance, not a guarantee' },
    body: { ar: 'توصيات نقاء إرشادية، وقد يخطئ تحليل الصور. اتبع دائمًا ملصق العناية في القطعة وتعليمات الجهة المصنِّعة. لا نتحمل تلف ملابس أو أجهزة ناتجًا عن الاعتماد على التوصيات.', en: 'Naqa\'s advice is guidance and photo analysis can be wrong. Always follow the garment\'s care label and the manufacturer\'s instructions. We are not liable for damage to clothes or appliances from relying on it.' } },
  { title: { ar: 'حد الاستخدام', en: 'Usage limit' },
    body: { ar: 'عدد التحليلات اليومية محدود في الخطة المجانية، ويتجدد يوميًا بتوقيت عُمان.', en: 'Daily analyses are limited on the free plan and reset each day (Oman time).' } },
  { title: { ar: 'المتاجر والعروض والمنتجات', en: 'Stores, offers and products' },
    body: { ar: 'مواقع الفروع من خرائط مفتوحة وقد تكون غير دقيقة. توفر المنتجات تقريبي ويجب التأكد داخل المتجر. العروض من معلنين وتحمل علامة "برعاية". الأسعار والتفاصيل مسؤولية المعلن.', en: 'Branch locations come from open maps and may be inaccurate. Product availability is indicative: confirm in store. Offers come from advertisers and are labelled "Sponsored". Prices and details are the advertiser\'s responsibility.' } },
  { title: { ar: 'استخدامك للتطبيق', en: 'Your use of the app' },
    body: { ar: 'لا ترفع صورًا غير لائقة أو لا تملك حق استخدامها، ولا تحاول تعطيل الخدمة أو تجاوز حدودها. يجوز إيقاف الحسابات المخالفة.', en: 'Do not upload inappropriate images or ones you have no right to use, and do not try to disrupt the service or bypass its limits. Accounts that break these rules may be suspended.' } },
];

/** Public link to the app. Leave empty until the app is published, then paste the store link (or a smart link) here. */
export const APP_LINK = '';

/** Bump when the terms, privacy policy or disclaimer change in a way users must accept again. */
export const CONSENT_VERSION = '2026-10-01';

/** DRAFT disclaimer: have a lawyer review it, like the other legal text, before publishing. */
export const disclaimer: LegalSection[] = [
  { title: { ar: 'إرشاد عام فقط', en: 'General guidance only' },
    body: { ar: 'النصائح والخطط في نقاء مكتوبة بحسب معلومات عامة عن الأقمشة والغسيل، وهي للإرشاد فقط. وهي ليست بديلًا عن ملصق العناية في قطعتك ولا عن تعليمات الجهة المصنِّعة للقطعة أو الغسالة أو المنتج، وعند أي اختلاف فالمرجع هو الملصق والتعليمات.', en: 'The advice and plans in Naqa are based on general knowledge about fabrics and laundry and are for guidance only. They do not replace your garment\'s care label or the instructions of the maker of the garment, machine or product. If they differ, the label and the maker\'s instructions win.' } },
  { title: { ar: 'لا ضمان للنتائج', en: 'No guarantee of results' },
    body: { ar: 'لا نضمن نتيجة أي غسيل أو إزالة بقعة. ولا نتحمل أي تلف يلحق بالملابس أو الأجهزة، ولا أي خسارة أو ضرر ينتج عن اتباع النصائح أو الاعتماد عليها، إلى أقصى حد يسمح به القانون.', en: 'We do not guarantee the outcome of any wash or stain removal. To the fullest extent the law allows, we are not liable for damage to clothes or appliances, or any loss or harm, resulting from following or relying on the advice.' } },
  { title: { ar: 'تحليل الصور بالذكاء الاصطناعي', en: 'AI photo analysis' },
    body: { ar: 'قد يخطئ الذكاء الاصطناعي في تحديد القماش أو قراءة الملصق. تحقق دائمًا من ملصق العناية بنفسك قبل الغسل.', en: 'AI can misjudge a fabric or misread a label. Always check the care label yourself before washing.' } },
  { title: { ar: 'سلامتك أنت', en: 'Your safety' },
    body: { ar: 'جرّب أي منتج على مكان خفي أولًا، واتبع تحذيرات العبوة، ولا تخلط المبيّضات أو المنظفات ببعضها، وأبعد المواد الكيميائية عن الأطفال. قد تسبب بعض المنتجات تهيجًا في الجلد أو العين أو التنفس.', en: 'Test any product on a hidden spot first, follow the pack\'s warnings, never mix bleaches or cleaners, and keep chemicals away from children. Some products can irritate skin, eyes or breathing.' } },
  { title: { ar: 'المنتجات والأسعار والمتاجر', en: 'Products, prices and stores' },
    body: { ar: 'معلومات المنتجات والأسعار والفروع والتوفر تقريبية وقد تتغير أو تتأخر. تأكد من المتجر. والعروض تأتي من معلنين وتحمل علامة «برعاية»، والسعر والتفاصيل مسؤولية المعلن.', en: 'Product, price, branch and availability information is approximate and may change or lag. Confirm with the store. Offers come from advertisers and are labelled "Sponsored"; price and details are the advertiser\'s responsibility.' } },
  { title: { ar: 'تحديث المحتوى', en: 'Content updates' },
    body: { ar: 'قد نعدّل النصائح والمحتوى في أي وقت دون إشعار. وإن رأيت معلومة غير صحيحة فنرجو أن تُبلغنا بها.', en: 'We may change the advice and content at any time without notice. If you see something wrong, please tell us.' } },
];
