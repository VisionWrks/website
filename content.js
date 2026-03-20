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
        logo: "logo-autocool.jpg",
        client: "Autocool",
        url: "https://www.autocool-egypt.com/",
        en: { tag: "Automotive Manufacturing", title: "AI Assembly Inspection — Jeep W4", desc: "Deployed QumraOne AI camera on the Jeep W4 assembly line with Cleco wireless screwdriver integration, achieving 95%+ inspection accuracy and real-time torque verification." },
        ar: { tag: "تصنيع السيارات",            title: "فحص التجميع بالذكاء الاصطناعي — Jeep W4", desc: "نشر كاميرا QumraOne على خط تجميع Jeep W4 مع دمج مفكات Cleco اللاسلكية، مع تحقيق دقة فحص تتجاوز 95% والتحقق الفوري من عزم الشد." }
    },
    {
        logo: "logo-juhayna.png",
        client: "Juhayna",
        url: "https://www.juhayna.com/",
        en: { tag: "Food & Beverage",           title: "Production Line Visual Inspection", desc: "Add description of work done with Juhayna here." },
        ar: { tag: "الغذاء والمشروبات",          title: "الفحص البصري لخط الإنتاج",          desc: "أضف وصف العمل المنجز مع جهينة هنا." }
    },
    {
        logo: "logo-mrc.png",
        client: "Misr Radiology Center",
        url: "https://www.misrradiologycenter.com/",
        en: { tag: "Healthcare",                title: "AI-Powered Radiology Support",      desc: "Add description of work done with Misr Radiology Center here." },
        ar: { tag: "الرعاية الصحية",             title: "دعم الأشعة بالذكاء الاصطناعي",      desc: "أضف وصف العمل المنجز مع مركز مصر للأشعة هنا." }
    },
];

// To add a new post:
//   1. Copy one block below
//   2. Paste it at the top of the array (newest first)
//   3. Fill in href, en (English text), and ar (Arabic text)
const POSTS = [
    {
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7437373275476992000",
        en: "We're excited to share another milestone in our collaboration with Autocool as we kick off a second AI initiative focused on bus HVAC systems inspection 🚍🤖. Following the successful demo of the QumraOne AI camera on the W4 assembly line, we have now started training a new visual inspection model dedicated to Bus HVAC units.",
        ar: "يسعدنا الإعلان عن بدء العمل على مشروع جديد لفحص أنظمة تكييف الحافلات باستخدام تقنيات الذكاء الاصطناعي، وذلك ضمن تعاوننا المستمر مع شركة أوتوكول 🚍🤖. بدأ فريقنا الآن مرحلة تدريب نموذج فحص بصري مخصص لوحدات تكييف الحافلات."
    },
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
