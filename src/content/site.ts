/**
 * ملف بيانات المؤسسة — كل النصوص والأرقام والصور القابلة للتعديل في مكان واحد.
 * عدّل هنا دون المساس بمكونات التصميم.
 */

export const company = {
  nameAr: 'مؤسسة دلما الجزيرة للمقاولات',
  shortAr: 'دلما الجزيرة',
  nameEn: 'Delma Al Jazeera',
  founded: 2011,
  city: 'الرياض',
  address: 'شارع أبو عبيدة بن الجراح، حي السعادة، الرياض',
  hours: 'السبت إلى الخميس، 8:00 صباحًا – 5:00 مساءً',
  email: 'delmaaljazera@gmail.com',
  website: 'www.delmaaljazeera.com',
  mapsUrl: 'https://maps.app.goo.gl/KB6LsqX2vi9PGAQw7',
  phones: {
    whatsapp: '0509468833',
    primary: '0509468833',
    secondary: '0507237405',
  },
  social: [
    { label: 'إنستغرام', handle: '@factorypvc_wpc', url: 'https://www.instagram.com/factorypvc_wpc' },
    { label: 'تيك توك', handle: '@factorypvc_wpc', url: 'https://www.tiktok.com/@factorypvc_wpc' },
    { label: 'يوتيوب', handle: '@wpc_pvc', url: 'https://www.youtube.com/@wpc_pvc' },
  ],
  sectors: ['الفلل', 'المنازل', 'المشروعات التجارية'],
  serviceArea: {
    install: 'التركيب داخل مدينة الرياض.',
    supply: 'التوريد إلى مختلف مناطق المملكة وفق متطلبات الطلب.',
  },
};

/** يحوّل رقمًا سعوديًا محليًا (05xxxxxxxx) إلى صيغة دولية */
export const intl = (n: string) => '966' + n.replace(/^0/, '');
export const telHref = (n: string) => `tel:+${intl(n)}`;
export const waHref = (n: string, text?: string) => `https://wa.me/${intl(n)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** إظهار الأسعار: الأسعار المذكورة في البروفايل منشورة، لكن لم يُؤكَّد اعتمادها الحالي — فعّلها بعد التأكيد */
export const showPrices = false;

export const nav = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about/', label: 'من نحن' },
  {
    href: '/products/', label: 'منتجاتنا وخدماتنا',
    children: [
      { href: '/products/wpc-doors/', label: 'أبواب WPC' },
      { href: '/products/upvc/', label: 'أبواب وشبابيك UPVC' },
      { href: '/products/aluminium-glass/', label: 'الألمنيوم والزجاج والواجهات' },
    ],
  },
  { href: '/works/', label: 'أعمالنا' },
  { href: '/catalogue/', label: 'كتالوج الألوان' },
  { href: '/contact/', label: 'تواصل معنا' },
];

export type Img = { src: string; alt: string; w: number; h: number };
const im = (src: string, alt: string, w: number, h: number): Img => ({ src, alt, w, h });

export const images = {
  hero: im('showroom-hall', 'صالة عرض أبواب WPC في معرض دلما الجزيرة بالرياض', 1600, 1068),
  showroomWide: im('showroom-wide', 'نماذج أبواب WPC بألوان مختلفة في المعرض', 1600, 1068),
  showroomCorner: im('showroom-corner', 'أبواب WPC معروضة في معرض المؤسسة', 1600, 1068),
  hq: im('hq-building', 'مبنى مقر مؤسسة دلما الجزيرة في حي السعادة بالرياض', 1800, 1013),
  hqSign: im('hq-sign', 'لوحة مؤسسة دلما الجزيرة على واجهة المقر', 1800, 1013),
};

export const services = [
  {
    slug: 'wpc-doors', no: '01', title: 'أبواب WPC وPVC',
    lead: 'تصاميم متنوعة للمساحات الداخلية وفق المقاسات والمواصفات المطلوبة.',
    image: im('showroom-1', 'باب WPC بلون رمادي في المعرض', 1068, 1600),
  },
  {
    slug: 'upvc', no: '02', title: 'أبواب وشبابيك UPVC',
    lead: 'حلول متعددة للنوافذ والأبواب، بخيارات تناسب المساحات السكنية والتجارية.',
    image: im('upvc-casement-wood', 'شباك UPVC مفصلي بلون خشبي', 1206, 1085),
  },
  {
    slug: 'aluminium-glass', no: '03', title: 'الألمنيوم والزجاج والواجهات',
    lead: 'حلول للأبواب والنوافذ والواجهات المعمارية باستخدام أنظمة الألمنيوم والزجاج.',
    image: im('alu-structure', 'واجهة زجاجية بنظام الاستركشر', 736, 736),
  },
];

export const why = [
  { no: '01', title: 'التصنيع في الرياض', text: 'تصنيع الأبواب والنوافذ وفق المقاسات والمواصفات المعتمدة، مع الاهتمام بجودة التنفيذ.' },
  { no: '02', title: 'خبرة منذ 2011', text: 'خبرة ممتدة في الأبواب والنوافذ وحلول الألمنيوم والزجاج للمساحات السكنية والتجارية.' },
  { no: '03', title: 'عروض أسعار واضحة', text: 'نوضّح المنتجات والمقاسات والمواصفات والتكاليف في عرض السعر وفق متطلبات المشروع.' },
  { no: '04', title: 'تركيب متخصص', text: 'خدمة التركيب داخل مدينة الرياض، مع إمكانية التوريد إلى مختلف مناطق المملكة.' },
  { no: '05', title: 'متابعة بعد البيع', text: 'نستقبل استفسارات العملاء المتعلقة بالمنتجات والخدمات بعد التركيب.' },
  { no: '06', title: 'معرض للاطلاع على الخيارات', text: 'نماذج المنتجات والألوان متاحة للاطلاع في معرضنا بحي السعادة في الرياض.' },
];

export const steps = [
  { no: '01', title: 'طلب عرض السعر', text: 'تواصل معنا عبر الهاتف أو واتساب، وأرسل تفاصيل المنتج والصور والمقاسات المتاحة.' },
  { no: '02', title: 'المقاسات والمواصفات', text: 'تحديد نوع المنتج واللون والزجاج والإكسسوارات والمقاسات المطلوبة.' },
  { no: '03', title: 'التصنيع أو التجهيز', text: 'تجهيز المنتجات وفق المواصفات والمقاسات المعتمدة، بحسب نوع الخدمة.' },
  { no: '04', title: 'التوريد والتركيب', text: 'التوريد إلى الوجهة المتفق عليها، والتركيب داخل مدينة الرياض.' },
];

export type Product = { name: string; use: string; price?: string; image: Img; note?: string };

export const wpc = {
  title: 'أبواب WPC',
  kicker: 'WPC DOORS',
  intro: 'خيارات متعددة من التصاميم والألوان، بخصائص تلائم المساحات الداخلية والمناطق المعرّضة للرطوبة، وفق مواصفات كل موديل.',
  hero: im('showroom-wide', 'أبواب WPC بألوان متعددة في معرض المؤسسة', 1600, 1068),
  models: [
    { name: 'باب سادة', use: 'الحمامات والغرف الرطبة', price: '870 ريال', image: im('wpc-plain-white', 'باب WPC سادة باللون الأبيض', 634, 1183) },
    { name: 'باب حفر', use: 'مداخل الغرف والفلل', price: '985 ريال', image: im('wpc-carved', 'باب WPC حفر بلون كريمي', 462, 1186) },
    { name: 'باب مع زجاج', use: 'الصالات والممرات', price: '1,100 ريال', image: im('wpc-glass', 'باب WPC بفتحات زجاج', 1082, 2400) },
    { name: 'باب ديكور بارز', use: 'التصاميم الداخلية للفلل', price: '1,200 ريال', image: im('wpc-decor', 'باب WPC بخطوط ديكور بارزة', 535, 1197) },
  ] as Product[],
  specs: [
    { label: 'امتصاص الماء', value: '≤ 1%' },
    { label: 'معدل مقاومة البكتيريا', value: '≥ 99%' },
    { label: 'انبعاث الفورمالديهايد', value: 'E1' },
  ],
  specsSource: 'من نشرة البيانات الفنية — الموديل KM45، المعيار QB/T 2463.2-2018',
  details: [
    im('wpc-corner', 'مقطع زاوية باب WPC يوضح الإطار والمقبض', 861, 1150),
    im('wpc-profile', 'مقطع قطاع إطار WPC', 1339, 654),
    im('wpc-double', 'باب WPC مع منور علوي', 668, 1198),
  ],
  gallery: [
    im('showroom-2', 'باب WPC بلون جوزي داكن في المعرض', 1068, 1600),
    im('showroom-3', 'باب WPC رمادي في المعرض', 1068, 1600),
    im('showroom-5', 'باب WPC بلون خشبي داكن', 1068, 1600),
    im('showroom-6', 'باب WPC بلون فاتح', 1068, 1600),
  ],
};

export const upvc = {
  title: 'أبواب وشبابيك UPVC',
  kicker: 'UPVC WINDOWS & DOORS',
  intro: 'أبواب وشبابيك UPVC بتصاميم متعددة، وتختلف خصائص العزل الحراري والصوتي بحسب مواصفات المنتج والزجاج وطريقة التركيب.',
  hero: im('upvc-sliding-door', 'باب UPVC سحّاب بزجاج كبير', 1800, 1350),
  models: [
    { name: 'شباك مفصلي', use: 'لغرف النوم والصالات', price: 'حسب المقاس', image: im('upvc-casement', 'شباك UPVC مفصلي بلون خشبي', 1206, 1785) },
    { name: 'شباك سحّاب', use: 'للشرفات والفتحات الكبيرة', price: 'حسب المقاس', image: im('upvc-sliding', 'شباك UPVC سحّاب', 1206, 669) },
    { name: 'باب شرائح', use: 'للشرفات والحدائق', price: '1,300 ريال', image: im('upvc-panel-door', 'باب UPVC بشرائح', 600, 800) },
    { name: 'باب زجاج', use: 'أبواب مزودة بزجاج', price: '1,400 ريال', image: im('upvc-glass-door', 'باب UPVC مزود بزجاج', 1082, 2400) },
  ] as Product[],
  systems: [
    'شبابيك مفصلية وسحّابة ومقوّسة.',
    'سحّاب بقناتين أو ثلاث قنوات (117 مم).',
    'نظام الفتح المزدوج Tilt & Turn.',
  ],
  gallery: [
    im('upvc-arch', 'شباك UPVC مقوّس', 1206, 1318),
    im('upvc-arch-sliding', 'شباك UPVC سحّاب بإطار مقوّس', 1206, 895),
    im('upvc-arch-pair', 'شباكان UPVC مقوّسان', 1206, 895),
    im('upvc-arch-tall', 'شبابيك UPVC طويلة مقوّسة', 1206, 1599),
    im('upvc-tilt', 'شباك UPVC بنظام قلاب', 1206, 1599),
    im('upvc-window-row', 'صف شبابيك UPVC', 520, 390),
  ],
};

export const aluminium = {
  title: 'الألمنيوم والزجاج والواجهات',
  kicker: 'ALUMINIUM & GLASS',
  intro: 'حلول للواجهات والأبواب والنوافذ. الأسعار حسب المقاسات والمخططات والمواصفات المعتمدة لكل مشروع.',
  hero: im('alu-structure', 'واجهة زجاجية معمارية بنظام الاستركشر', 736, 736),
  items: [
    { no: '01', title: 'واجهات الاستركشر والسبايدر', text: 'زجاج شفاف أو عاكس أو ملوّن بحسب متطلبات المشروع.' },
    { no: '02', title: 'أبواب الألمنيوم الزجاجية', text: 'تشطيبات متنوعة، مع خيارات لأنظمة الإغلاق.' },
    { no: '03', title: 'شبابيك الألمنيوم', text: 'مفصلية وسحّابة، بزجاج مفرد أو مزدوج حسب الطلب.' },
    { no: '04', title: 'زجاج السيكوريت', text: 'سماكات وتجهيزات تناسب الاستخدام والمواصفات المعتمدة.' },
    { no: '05', title: 'واجهات الكلادينج', text: 'تكسية الواجهات الخارجية بمظهر معماري معاصر.' },
  ],
};

/** كتالوج ألوان WPC — الأكواد P01–P19 كما وردت في كتالوج المؤسسة */
export const colors = Array.from({ length: 19 }, (_, i) => `P${String(i + 1).padStart(2, '0')}`);

/** نماذج من الأعمال والمنتجات — صور حقيقية من ملفات المؤسسة، بلا أسماء مشروعات */
export const works: (Img & { tag: string })[] = [
  { ...im('work-wpc-1', 'باب WPC مركّب في ممر داخلي', 1082, 2400), tag: 'أبواب WPC' },
  { ...im('upvc-sliding-door', 'باب UPVC سحّاب بواجهة زجاجية', 1800, 1350), tag: 'UPVC' },
  { ...im('work-wpc-4', 'باب WPC بفتحات زجاج مركّب', 1082, 2400), tag: 'أبواب WPC' },
  { ...im('upvc-arch', 'شباك UPVC مقوّس مركّب', 1206, 1318), tag: 'UPVC' },
  { ...im('work-wpc-3', 'باب WPC بلون خشبي داكن مركّب', 650, 1156), tag: 'أبواب WPC' },
  { ...im('alu-structure', 'واجهة زجاجية بنظام الاستركشر', 736, 736), tag: 'الألمنيوم والزجاج' },
  { ...im('work-wpc-2', 'باب WPC رمادي مركّب', 1085, 2400), tag: 'أبواب WPC' },
  { ...im('upvc-glass-door', 'باب UPVC مزود بزجاج مركّب', 1082, 2400), tag: 'UPVC' },
  { ...im('upvc-arch-tall', 'شبابيك UPVC طويلة مقوّسة', 1206, 1599), tag: 'UPVC' },
  { ...im('showroom-corner', 'أبواب WPC في المعرض', 1600, 1068), tag: 'المعرض' },
  { ...im('upvc-panel-door', 'باب UPVC بشرائح مركّب', 600, 800), tag: 'UPVC' },
  { ...im('showroom-4', 'باب WPC في المعرض', 1068, 1600), tag: 'المعرض' },
];

/** القيادة والإدارة — أضف أعضاء جددًا في القائمة دون تعديل التصميم */
export type Leader = { name: string; role: string; photo?: Img; bio?: string };
export const leadership: Leader[] = [
  {
    name: 'عبدالرحمن بن منصور القحطاني',
    role: 'رئيس المؤسسة',
    photo: im('leader-abdulrahman', 'عبدالرحمن بن منصور القحطاني، رئيس مؤسسة دلما الجزيرة', 546, 683),
    bio: undefined, // نبذة معتمدة تضاف هنا لاحقًا
  },
];

export const quoteServices = [
  'أبواب WPC',
  'أبواب PVC',
  'شبابيك UPVC',
  'أبواب UPVC',
  'واجهات الاستركشر والسبايدر',
  'أبواب أو شبابيك ألمنيوم',
  'زجاج السيكوريت',
  'واجهات الكلادينج',
  'أخرى',
];
