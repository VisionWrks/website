// ─────────────────────────────────────────────
//  VisionWorks — Site Content
//  Edit this file to add/update/remove entries.
//  No need to touch index.html.
// ─────────────────────────────────────────────

const SERVICES = [
    {
        en: { title: "AI & Vision",   desc: "Defect detection, facial recognition, and smart employee management." },
        ar: { title: "الذكاء الاصطناعي", desc: "اكتشاف العيوب، التعرف على الوجوه، وإدارة الموظفين الذكية." }
    },
    {
        en: { title: "Automation",    desc: "PLC logic, conveyor systems, and custom 3D printing." },
        ar: { title: "الأتمتة",       desc: "منطق PLC، أنظمة أحزمة النقل، والطباعة ثلاثية الأبعاد." }
    },
    {
        en: { title: "Integration",   desc: "Bluetooth extensions, driver integration, and torque detection." },
        ar: { title: "تكامل الأنظمة", desc: "توسعة البلوتوث، تكامل برامج التشغيل، وقياس العزم." }
    },
    {
        en: { title: "Hardware",      desc: "Real-time monitoring, high-accuracy sensors, and power management." },
        ar: { title: "الأجهزة",       desc: "مراقبة لحظية، حساسات عالية الدقة، وإدارة الطاقة." }
    },
];

const PORTFOLIO = [
    {
        logo: "media/logo-autocool.jpg",
        client: "Autocool",
        url: "https://www.autocool-egypt.com/",
        en: { tag: "Automotive Manufacturing", title: "AI Assembly Inspection — Jeep W4", desc: "Deployed QumraOne AI camera on the Jeep W4 assembly line with Cleco wireless screwdriver integration, achieving 95%+ inspection accuracy and real-time torque verification." },
        ar: { tag: "تصنيع السيارات",            title: "فحص التجميع بالذكاء الاصطناعي — Jeep W4", desc: "نشر كاميرا QumraOne على خط تجميع Jeep W4 مع دمج مفكات Cleco اللاسلكية، مع تحقيق دقة فحص تتجاوز 95% والتحقق الفوري من عزم الشد." }
    },
    {
        logo: "media/logo-juhayna.png",
        client: "Juhayna",
        url: "https://www.juhayna.com/",
        en: { tag: "Food & Beverage",           title: "Tomato Production Line Inspection", desc: "Deployed an AI-powered visual inspection system on Juhayna's tomato processing line to automatically detect and reject defective tomatoes in real time, improving product quality and reducing manual sorting effort." },
        ar: { tag: "الغذاء والمشروبات",          title: "فحص خط إنتاج الطماطم",              desc: "نشر نظام فحص بصري مدعوم بالذكاء الاصطناعي على خط معالجة الطماطم في جهينة، للكشف التلقائي عن الطماطم المعيبة وفرزها في الوقت الفعلي، مما يحسن جودة المنتج ويقلل جهد الفرز اليدوي." }
    },
    {
        logo: "media/logo-mrc.png",
        client: "Misr Radiology Center",
        url: "https://www.misrradiologycenter.com/",
        en: { tag: "Healthcare",                title: "Reception Crowdedness KPI Monitoring", desc: "Installed an AI-powered KPI monitoring system at Misr Radiology Center to measure and track reception area crowdedness in real time, enabling management to optimize patient flow and reduce wait times." },
        ar: { tag: "الرعاية الصحية",             title: "مراقبة مؤشرات الأداء لازدحام الاستقبال", desc: "تركيب نظام مراقبة مؤشرات أداء مدعوم بالذكاء الاصطناعي في مركز مصر للأشعة لقياس ومتابعة ازدحام منطقة الاستقبال في الوقت الفعلي، مما يمكّن الإدارة من تحسين تدفق المرضى وتقليل أوقات الانتظار." }
    },
];

const TUTORIALS = [
    {
        embed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7442202342114017280?compact=1",
        en: { title: "QumraOne in Action", desc: "See how QumraOne AI camera performs visual inspection on a real automotive assembly line." },
        ar: { title: "QumraOne في العمل", desc: "شاهد كيف تؤدي كاميرا QumraOne بالذكاء الاصطناعي الفحص البصري على خط تجميع سيارات حقيقي." }
    },
    {
        embed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7441111127868039168?compact=1",
        en: { title: "QumraOne in Action", desc: "See how QumraOne AI camera performs visual inspection on a real automotive assembly line." },
        ar: { title: "QumraOne في العمل", desc: "شاهد كيف تؤدي كاميرا QumraOne بالذكاء الاصطناعي الفحص البصري على خط تجميع سيارات حقيقي." }
    },
];

// ─────────────────────────────────────────────
//  LinkedIn Posts
//  Two formats supported:
//
//  1. EMBEDDED POST (auto-updates from LinkedIn):
//     { embed: "https://www.linkedin.com/embed/feed/update/urn:li:activity:XXXXX" }
//
//  2. TEXT CARD (manual content, bilingual):
//     { href: "https://linkedin.com/...", en: "English text", ar: "Arabic text" }
//
//  How to get an embed URL:
//    1. Open the LinkedIn post
//    2. Click ••• menu → "Embed this post"
//    3. Copy the src URL from the iframe code
//    4. Paste it as the "embed" value below
//
//  Tip: Embedded posts show live likes/comments and look native!
// ─────────────────────────────────────────────
const POSTS = [
    // Embedded post example - auto-syncs with LinkedIn
    {
        embed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7462456991873966080"
    },
    {
        embed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7449728745159995392"
    },
    {
        embed: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7437373275476992000"
    },
    // Text card examples - manual content with bilingual support
    {
        href: "https://www.linkedin.com/company/vision-works-ltd/",
        en: "A key milestone in automotive parts inspection and assembly in Egypt 🇪🇬🚗. The QumraOne AI camera is now fully integrated with Cleco wireless screwdrivers, enabling combined visual inspection and tightening torque verification directly on the assembly line.",
        ar: "محطة مهمة في مجال فحص الأجزاء وعمليات تجميع السيارات في مصر 🇪🇬🚗. تم دمج كاميرا الذكاء الاصطناعي QumraOne بشكل كامل مع مفكات Cleco اللاسلكية، مما يتيح الفحص البصري والتحقق من عزم الشد في آنٍ واحد مباشرة على خط التجميع."
    },
    {
        href: "https://www.linkedin.com/company/vision-works-ltd/",
        en: "We're proud to announce the successful finalization of the parts inspection system for Jeep W4 🚗✅. The solution has achieved a success rate exceeding 95%, effectively supervising and enhancing the quality of human operators during the assembly and inspection process.",
        ar: "نفخر بالإعلان عن الانتهاء بنجاح من نظام فحص الأجزاء الخاص بسيارة Jeep W4 🚗✅. حقق النظام معدل نجاح يتجاوز 95%، مع قدرته على مراقبة جودة أداء المشغلين البشريين وتحسينها أثناء عمليات التجميع والفحص."
    },
];
