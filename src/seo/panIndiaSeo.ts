// Pan-India & All-9-Indian-Languages SEO Route Registry, Schema.org JSON-LD, Sitemap & HTML Injector
// Shared cleanly between Express (server.ts) and React (src/App.tsx, Footer.tsx).
// Pure TypeScript with zero browser-only globals or binary asset imports.

export const CANONICAL_DOMAIN = "https://recruits.org.in";
export const OG_IMAGE_PATH = "/assets/og-recruits-india.jpg";
export const SITE_NAME = "Recruits.org.in";
export const ORG_NAME = "Quench Research Labs Private Limited";

export type SeoLanguageCode = "en" | "hi" | "or" | "ta" | "te" | "kn" | "mr" | "gu" | "bn";

export interface SeoCourseEntry {
  id: string;
  slug: string;
  title: string;
  duration: string;
  feeINR: number;
  feeDisplay: string;
  category: string;
  summary: string;
  tools: string[];
}

export interface SeoCityEntry {
  slug: string;
  name: string;
  state: string;
  highlights: string;
}

export interface SeoGovtExamEntry {
  slug: string;
  name: string;
  shortName: string;
  region: string;
  highlights: string;
  searchHint: string;
}

export interface SeoJobCategoryEntry {
  slug: string;
  label: string;
  title: string;
  description: string;
  keywords: string[];
  sector: string;
  searchHint: string;
  qualificationHint: string;
}

export interface RegionalLanguageHub {
  code: SeoLanguageCode;
  hreflang: string;
  ogLocale: string;
  nativeName: string;
  englishName: string;
  states: string;
  homeTitle: string;
  homeDescription: string;
  jobsTitle: string;
  jobsDescription: string;
  govtTitle: string;
  govtDescription: string;
  coursesTitle: string;
  coursesDescription: string;
  visibleHeadingHome: string;
  visibleHeadingJobs: string;
  visibleHeadingGovt: string;
  visibleHeadingCourses: string;
  keywords: string[];
}

export interface SeoAutoFilter {
  sector?: string;
  location?: string;
  search?: string;
  qualification?: string;
  courseId?: string;
}

export interface SeoRouteMeta {
  pathname: string;
  canonicalPath: string;
  basePathWithoutLang: string;
  langCode: SeoLanguageCode;
  htmlLang: string;
  ogLocale: string;
  title: string;
  description: string;
  keywords: string[];
  view: "landing" | "workspace";
  engineId: string;
  roleMode: "candidate" | "recruiter";
  sectionLabel: string;
  visibleHeading: string;
  visibleSubtitle: string;
  breadcrumbs: Array<{ name: string; path: string }>;
  hasMultilingualAlternates: boolean;
  autoFilter?: SeoAutoFilter;
  courseSlug?: string;
  citySlug?: string;
  examSlug?: string;
  categorySlug?: string;
}

export const REGIONAL_LANGUAGE_HUBS: RegionalLanguageHub[] = [
  {
    code: "hi",
    hreflang: "hi-in",
    ogLocale: "hi_IN",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    states: "UP, Bihar, MP, Rajasthan, Delhi NCR, Haryana, Jharkhand, Uttarakhand",
    homeTitle: "Recruits.org.in हिन्दी — सरकारी नौकरी 2026, प्राइवेट जॉब व प्लेसमेंट कोर्स",
    homeDescription:
      "भारत में 1,00,000+ सरकारी नौकरी (UPSC, SSC, रेलवे, बैंकिंग), प्राइवेट जॉब, फ्री ATS रिज्यूमे चेकर और 10 प्लेसमेंट कोर्स। हिंदी में Arohi वॉइस इंटरव्यू।",
    jobsTitle: "सरकारी व प्राइवेट जॉब वैकेंसी 2026 (हिन्दी) | Recruits.org.in",
    jobsDescription:
      "दिल्ली NCR, यूपी, बिहार, राजस्थान, एमपी और पूरे भारत में नई भर्ती, फ्रेशर जॉब, घर बैठे काम (WFH) और MNC वैकेंसी सीधे अप्लाई करें।",
    govtTitle: "सरकारी नौकरी 2026 — UPSC, SSC, रेलवे, बैंकिंग व राज्य भर्ती | Recruits.org.in",
    govtDescription:
      "लेटेस्ट सरकारी रिजल्ट और नई भर्ती 2026: UPSC, SSC CGL/CHSL, RRB रेलवे, IBPS/SBI बैंक, UPPSC, BPSC, MPPSC, RPSC और पुलिस भर्ती।",
    coursesTitle: "100% प्लेसमेंट ट्रेनिंग कोर्स 2026 (AI, Data Science, Cloud) | Recruits.org.in",
    coursesDescription:
      "AI, डेटा साइंस, साइबर सिक्योरिटी, क्लाउड DevOps और फाइनेंस के 10 सर्टिफाइड ट्रेनिंग प्रोग्राम — 80% डिजिटल + 20% फिजिकल मेंटरिंग।",
    visibleHeadingHome: "सरकारी नौकरी, प्राइवेट जॉब और वेरिफाइड ट्रेनिंग — पूरे भारत के लिए",
    visibleHeadingJobs: "भारत में नई सरकारी व प्राइवेट जॉब वैकेंसी 2026",
    visibleHeadingGovt: "सरकारी नौकरी 2026 — केंद्र व राज्य भर्ती अलर्ट",
    visibleHeadingCourses: "10 वेरिफाइड प्लेसमेंट ट्रेनिंग कोर्स (हिन्दी सपोर्ट)",
    keywords: [
      "सरकारी नौकरी 2026",
      "नई भर्ती",
      "प्राइवेट जॉब वैकेंसी",
      "घर बैठे काम",
      "फ्रेशर जॉब",
      "sarkari naukri",
      "free job alert hindi",
      "फ्री रिज्यूमे चेकर",
      "SSC रेलवे भर्ती",
    ],
  },
  {
    code: "or",
    hreflang: "or-in",
    ogLocale: "or_IN",
    nativeName: "ଓଡ଼ିଆ",
    englishName: "Odia",
    states: "Odisha (Bhubaneswar, Cuttack, Rourkela, Berhampur, Sambalpur)",
    homeTitle: "Recruits.org.in ଓଡ଼ିଆ — ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି 2026, ପ୍ରାଇଭେଟ ଜବ୍ ଓ ଟ୍ରେନିଂ",
    homeDescription:
      "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି (OPSC, OSSC, OMC, OPTCL), ଭୁବନେଶ୍ୱର IT ଓ ପ୍ରାଇଭେଟ ଚାକିରି, ଫ୍ରି ATS ରିଜ୍ୟୁମେ ଏବଂ 10 ପ୍ଲେସମେଣ୍ଟ କୋର୍ସ। ଓଡ଼ିଆରେ Arohi ମକ୍ ଇଣ୍ଟରଭ୍ୟୁ।",
    jobsTitle: "ଓଡ଼ିଶା ନିଯୁକ୍ତି ଖବର 2026 — ଭୁବନେଶ୍ୱର IT ଓ ପ୍ରାଇଭେଟ ଚାକିରି | Recruits.org.in",
    jobsDescription:
      "ଭୁବନେଶ୍ୱର ଇନଫୋସିଟି, କଟକ, ରାଉରକେଲା ଏବଂ ସମଗ୍ର ଭାରତରେ ଫ୍ରେଶର ଓ ଅଭିଜ୍ଞ ପ୍ରାର୍ଥୀଙ୍କ ପାଇଁ ଭେରିଫାଏଡ୍ ଚାକିରି ସୁଯୋଗ।",
    govtTitle: "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି 2026 — OPSC, OSSC, UPSC ଓ ରେଳବାଇ | Recruits.org.in",
    govtDescription:
      "OPSC OAS, OSSC, OMC, ଓଡ଼ିଶା ପୋଲିସ, SSC, ରେଳବାଇ ଏବଂ ବ୍ୟାଙ୍କିଂ ସରକାରୀ ନିଯୁକ୍ତି ବିଜ୍ଞପ୍ତି ଓ ଫ୍ରି ଓଡ଼ିଆ GK ପ୍ରସ୍ତୁତି।",
    coursesTitle: "ଭେରିଫାଏଡ୍ ପ୍ଲେସମେଣ୍ଟ ଟ୍ରେନିଂ କୋର୍ସ (AI, Data Science) | Recruits.org.in",
    coursesDescription:
      "ଭୁବନେଶ୍ୱର ଓ ଅନଲାଇନରେ 10ଟି ଇଣ୍ଡଷ୍ଟ୍ରି ଟ୍ରେନିଂ ପ୍ରୋଗ୍ରାମ — 80% ଡିଜିଟାଲ୍ + 20% ଫିଜିକାଲ୍ ମେଣ୍ଟରିଂ ସହ 100% ପ୍ଲେସମେଣ୍ଟ ସହାୟତା।",
    visibleHeadingHome: "ଓଡ଼ିଶା ଓ ଭାରତର ସର୍ବଶ୍ରେଷ୍ଠ ଚାକିରି ଏବଂ ପ୍ଲେସମେଣ୍ଟ ପ୍ଲାଟଫର୍ମ",
    visibleHeadingJobs: "ଓଡ଼ିଶା ଏବଂ ଭାରତରେ ଲାଟେଷ୍ଟ ସରକାରୀ ଓ ପ୍ରାଇଭେଟ ଚାକିରି 2026",
    visibleHeadingGovt: "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି 2026 — OPSC, OSSC ଓ କେନ୍ଦ୍ର ନିଯୁକ୍ତି",
    visibleHeadingCourses: "10ଟି ଭେରିଫାଏଡ୍ ପ୍ଲେସମେଣ୍ଟ ଟ୍ରେନିଂ କୋର୍ସ",
    keywords: [
      "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି 2026",
      "OPSC ନିଯୁକ୍ତି",
      "OSSC ଚାକିରି",
      "ଭୁବନେଶ୍ୱର ପ୍ରାଇଭେଟ ଚାକିରି",
      "ଓଡ଼ିଶା ନିଯୁକ୍ତି ଖବର",
      "Odisha govt jobs",
      "Bhubaneswar IT jobs",
    ],
  },
  {
    code: "ta",
    hreflang: "ta-in",
    ogLocale: "ta_IN",
    nativeName: "தமிழ்",
    englishName: "Tamil",
    states: "Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem)",
    homeTitle: "Recruits.org.in தமிழ் — தமிழ்நாடு அரசு வேலைவாய்ப்பு 2026 & சென்னை ஐடி வேலை",
    homeDescription:
      "TNPSC அரசு வேலைவாய்ப்பு, சென்னை & கோவை ஐடி வேலைகள், வீட்டில் இருந்து வேலை, இலவச ATS ரெஸ்யூம் மற்றும் 10 வேலைவாய்ப்பு பயிற்சிகள்.",
    jobsTitle: "தமிழ்நாடு & சென்னை வேலை வாய்ப்பு 2026 — IT & Fresher | Recruits.org.in",
    jobsDescription:
      "சென்னை, கோயம்புத்தூர், மதுரை மற்றும் இந்தியா முழுவதும் MNC, ஐடி மற்றும் பிரஷர் வேலை வாய்ப்புகளுக்கு நேரடியாக விண்ணப்பிக்கவும்.",
    govtTitle: "தமிழ்நாடு அரசு வேலைவாய்ப்பு 2026 — TNPSC, SSC, ரயில்வே | Recruits.org.in",
    govtDescription:
      "TNPSC Group 1/2/4, வங்கி, ரயில்வே RRB, SSC மற்றும் மத்திய அரசு வேலைவாய்ப்பு அறிவிப்புகள் & இலவச தமிழ் மாதிரி நேர்காணல்.",
    coursesTitle: "வேலைவாய்ப்பு உத்தரவாத பயிற்சிகள் — AI, Data Science, Cloud | Recruits.org.in",
    coursesDescription:
      "AI, டேட்டா சயின்ஸ், சைபர் செக்யூரிட்டி மற்றும் கிளவுட் DevOps 10 சான்றிதழ் பயிற்சிகள் — 100% வேலைவாய்ப்பு வழிகாட்டுதல்.",
    visibleHeadingHome: "தமிழ்நாடு மற்றும் இந்தியாவின் முன்னணி வேலைவாய்ப்பு & பயிற்சி தளம்",
    visibleHeadingJobs: "தமிழ்நாடு & இந்தியா புதிய வேலை வாய்ப்புகள் 2026",
    visibleHeadingGovt: "தமிழ்நாடு அரசு வேலைவாய்ப்பு 2026 — TNPSC & மத்திய அரசு",
    visibleHeadingCourses: "10 வேலைவாய்ப்பு சான்றிதழ் பயிற்சித் திட்டங்கள்",
    keywords: [
      "தமிழ்நாடு அரசு வேலைவாய்ப்பு 2026",
      "TNPSC வேலைவாய்ப்பு",
      "சென்னை வேலை வாய்ப்பு",
      "வீட்டில் இருந்து வேலை",
      "ஐடி வேலை வாய்ப்பு",
      "Chennai fresher jobs",
    ],
  },
  {
    code: "te",
    hreflang: "te-in",
    ogLocale: "te_IN",
    nativeName: "తెలుగు",
    englishName: "Telugu",
    states: "Telangana & Andhra Pradesh (Hyderabad, Visakhapatnam, Vijayawada, Warangal)",
    homeTitle: "Recruits.org.in తెలుగు — ప్రభుత్వ ఉద్యోగాలు 2026 & హైదరాబాద్ ఐటీ జాబ్స్",
    homeDescription:
      "APPSC, TSPSC ప్రభుత్వ ఉద్యోగాలు, హైదరాబాద్ & వైజాగ్ సాఫ్ట్‌వేర్ జాబ్స్, వర్క్ ఫ్రమ్ హోమ్, ఫ్రీ ATS రెజ్యూమే మరియు 10 ప్లేస్‌మెంట్ కోర్సులు.",
    jobsTitle: "హైదరాబాద్ & తెలుగు రాష్ట్రాల ఉద్యోగాలు 2026 — IT & Fresher | Recruits.org.in",
    jobsDescription:
      "హైదరాబాద్ HITEC సిటీ, విశాఖపట్నం, విజయవాడలో సాఫ్ట్‌వేర్, ఫ్రెషర్, వర్క్ ఫ్రమ్ హోమ్ మరియు MNC ఉద్యోగాలకు నేరుగా అప్లై చేయండి.",
    govtTitle: "ప్రభుత్వ ఉద్యోగాలు 2026 — APPSC, TSPSC, SSC, రైల్వే & బ్యాంక్ | Recruits.org.in",
    govtDescription:
      "తాజా APPSC, TSPSC, UPSC, SSC, RRB రైల్వే మరియు బ్యాంకింగ్ నోటిఫికేషన్లు & తెలుగులో ఫ్రీ Arohi వాయిస్ మాక్ ఇంటర్వ్యూ.",
    coursesTitle: "ప్లేస్‌మెంట్ ట్రైనింగ్ కోర్సులు — AI, Data Science & Cloud | Recruits.org.in",
    coursesDescription:
      "AI, డేటా సైన్స్, సైబర్ సెక్యూరిటీ, క్లౌడ్ DevOps లో 10 వెరిఫైడ్ కోర్సులు — 100% ప్లేస్‌మెంట్ అసిస్టెన్స్ తో.",
    visibleHeadingHome: "తెలంగాణ, ఆంధ్రప్రదేశ్ & భారతదేశం అంతటా ఉద్యోగాలు మరియు ట్రైనింగ్",
    visibleHeadingJobs: "హైదరాబాద్ & ఆల్ ఇండియా లేటెస్ట్ జాబ్స్ 2026",
    visibleHeadingGovt: "ప్రభుత్వ ఉద్యోగాలు 2026 — APPSC, TSPSC & సెంట్రల్ గవర్నమెంట్",
    visibleHeadingCourses: "10 వెరిఫైడ్ ప్లేస్‌మెంట్ ట్రైనింగ్ ప్రోగ్రామ్స్",
    keywords: [
      "ప్రభుత్వ ఉద్యోగాలు 2026",
      "హైదరాబాద్ ఉద్యోగాలు",
      "APPSC TSPSC నోటిఫికేషన్",
      "వర్క్ ఫ్రమ్ హోమ్ జాబ్స్",
      "ఫ్రెషర్ సాఫ్ట్‌వేర్ జాబ్స్",
      "Hyderabad IT jobs",
    ],
  },
  {
    code: "mr",
    hreflang: "mr-in",
    ogLocale: "mr_IN",
    nativeName: "मराठी",
    englishName: "Marathi",
    states: "Maharashtra (Mumbai, Pune, Nagpur, Nashik, Thane)",
    homeTitle: "Recruits.org.in मराठी — सरकारी नोकरी 2026, महाभरती व पुणे/मुंबई जॉब्स",
    homeDescription:
      "MPSC महाभरती, पुणे व मुंबई IT/BFSI नोकरी, फ्रेशर्स जॉब्स, फ्री ATS रिझ्युमे चेकर आणि 10 प्लेसमेंट कोर्सेस. मराठीत Arohi मॉक इंटरव्ह्यू.",
    jobsTitle: "पुणे, मुंबई व महाराष्ट्र जॉब व्हॅकन्सी 2026 | Recruits.org.in",
    jobsDescription:
      "मुंबई, पुणे, नागपूर आणि भारतभरात IT, बँकिंग, फ्रेशर आणि वर्क फ्रॉम होम नोकरीसाठी थेट अर्ज करा.",
    govtTitle: "सरकारी नोकरी 2026 — MPSC महाभरती, SSC, रेल्वे व बँकिंग | Recruits.org.in",
    govtDescription:
      "MPSC राज्यसेवा, पोलीस भरती, SSC, रेल्वे RRB आणि केंद्र सरकारच्या नोकरी जाहिराती आणि मोफत सराव चाचण्या.",
    coursesTitle: "प्लेसमेंट ट्रेनिंग कोर्सेस 2026 — AI, Data Science & Cloud | Recruits.org.in",
    coursesDescription:
      "AI, डेटा सायन्स, सायबर सिक्युरिटी आणि क्लाउड DevOps चे 10 प्रमाणित कोर्सेस — 100% प्लेसमेंट सहाय्यासह.",
    visibleHeadingHome: "महाराष्ट्र आणि भारतातील नोकरी, महाभरती व ट्रेनिंग हब",
    visibleHeadingJobs: "मुंबई, पुणे व ऑल इंडिया जॉब व्हॅकन्सी 2026",
    visibleHeadingGovt: "सरकारी नोकरी 2026 — MPSC महाभरती व केंद्र शासन",
    visibleHeadingCourses: "10 व्हेरिफाईड प्लेसमेंट ट्रेनिंग कोर्सेस",
    keywords: [
      "सरकारी नोकरी 2026",
      "महाभरती",
      "पुणे जॉब व्हॅकन्सी",
      "मुंबई नोकरी",
      "MPSC भरती 2026",
      "फ्रेशर्ससाठी नोकरी",
    ],
  },
  {
    code: "bn",
    hreflang: "bn-in",
    ogLocale: "bn_IN",
    nativeName: "বাংলা",
    englishName: "Bengali",
    states: "West Bengal & Tripura (Kolkata, Howrah, Siliguri, Durgapur)",
    homeTitle: "Recruits.org.in বাংলা — সরকারি চাকরি ২০২৬, কলকাতা প্রাইভেট জব ও ট্রেনিং",
    homeDescription:
      "WBPSC সরকারি চাকরি, কলকাতা সল্টলেক IT ও প্রাইভেট চাকরি, কর্মসংস্থান খবর, ফ্রি ATS রিজিউম ও 10টি প্লেসমেন্ট কোর্স। বাংলায় Arohi মক ইন্টারভিউ।",
    jobsTitle: "কলকাতা ও পশ্চিমবঙ্গ চাকরির খবর ২০২৬ — IT ও ফ্রেশার | Recruits.org.in",
    jobsDescription:
      "কলকাতা সেক্টর V, হাওড়া, শিলিগুড়ি এবং সমগ্র ভারতে ফ্রেশার, ওয়ার্ক ফ্রম হোম ও MNC চাকরিতে সরাসরি আবেদন করুন।",
    govtTitle: "সরকারি চাকরি ২০২৬ — WBPSC, SSC, রেলওয়ে ও ব্যাংকিং | Recruits.org.in",
    govtDescription:
      "WBPSC, WBCS, SSC, রেলওয়ে RRB, ব্যাংকিং এবং কেন্দ্রীয় সরকারি চাকরির বিজ্ঞপ্তি ও ফ্রি বাংলা ইন্টারভিউ প্রস্তুতি।",
    coursesTitle: "ভেরিফায়েড প্লেসমেন্ট কোর্স — AI, Data Science ও Cloud | Recruits.org.in",
    coursesDescription:
      "AI, ডেটা সায়েন্স, সাইবার সিকিউরিটি এবং ক্লাউড DevOps এর 10টি সার্টিফায়েড কোর্স — 100% প্লেসমেন্ট সহায়তাসহ।",
    visibleHeadingHome: "পশ্চিমবঙ্গ ও ভারতের চাকরি, কর্মসংস্থান এবং প্লেসমেন্ট প্ল্যাটফর্ম",
    visibleHeadingJobs: "কলকাতা ও অল ইন্ডিয়া লেটেস্ট চাকরির খবর ২০২৬",
    visibleHeadingGovt: "সরকারি চাকরি ২০২৬ — WBPSC, SSC ও রেলওয়ে নিয়োগ",
    visibleHeadingCourses: "10টি ভেরিফায়েড প্লেসমেন্ট ট্রেনিং কোর্স",
    keywords: [
      "সরকারি চাকরি ২০২৬",
      "কলকাতা প্রাইভেট চাকরি",
      "WBPSC নিয়োগ",
      "কর্মসংস্থান খবর",
      "বাড়ি থেকে কাজ",
      "Kolkata IT jobs",
    ],
  },
  {
    code: "gu",
    hreflang: "gu-in",
    ogLocale: "gu_IN",
    nativeName: "ગુજરાતી",
    englishName: "Gujarati",
    states: "Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar)",
    homeTitle: "Recruits.org.in ગુજરાતી — સરકારી ભરતી 2026, અમદાવાદ/સુરત નોકરી અને ટ્રેનિંગ",
    homeDescription:
      "GPSC સરકારી ભરતી, અમદાવાદ GIFT City, સુરત અને વડોદરા પ્રાઇવેટ જોબ, ફ્રી ATS રિઝ્યુમ ચેકર અને 10 પ્લેસમેન્ટ કોર્સ.",
    jobsTitle: "અમદાવાદ, સુરત અને ગુજરાત જોબ વેકેન્સી 2026 | Recruits.org.in",
    jobsDescription:
      "અમદાવાદ, સુરત, વડોદરા અને સમગ્ર ભારતમાં ફ્રેશર, IT, ફાઇનાન્સ અને વર્ક ફ્રોમ હોમ નોકરી માટે સીધી અરજી કરો.",
    govtTitle: "સરકારી ભરતી 2026 — GPSC, SSC, રેલવે અને બેંકિંગ | Recruits.org.in",
    govtDescription:
      "તાજેતરની GPSC, GSSSB, UPSC, SSC, રેલવે અને બેંકિંગ ભરતી જાહેરાતો અને ગુજરાતીમાં ફ્રી Arohi મોક ઇન્ટરવ્યુ.",
    coursesTitle: "પ્લેસમેન્ટ ટ્રેનિંગ કોર્સ — AI, Data Science અને ફાઇનાન્સ | Recruits.org.in",
    coursesDescription:
      "AI, ડેટા સાયન્સ, સાયબર સિક્યોરિટી અને ઇન્વેસ્ટમેન્ટ બેંકિંગના 10 સર્ટિફાઇડ કોર્સ — 100% પ્લેસમેન્ટ સહાય સાથે.",
    visibleHeadingHome: "ગુજરાત અને ભારતનું અગ્રણી નોકરી અને પ્લેસમેન્ટ પ્લેટફોર્મ",
    visibleHeadingJobs: "અમદાવાદ, સુરત અને ઓલ ઇન્ડિયા નોકરી 2026",
    visibleHeadingGovt: "સરકારી ભરતી 2026 — GPSC અને કેન્દ્ર સરકાર નોકરી",
    visibleHeadingCourses: "10 વેરિફાઇડ પ્લેસમેન્ટ ટ્રેનિંગ કોર્સ",
    keywords: [
      "સરકારી ભરતી 2026",
      "અમદાવાદ નોકરી",
      "સુરત નોકરી",
      "GPSC ભરતી",
      "પ્રાઇવેટ જોબ ગુજરાત",
      "ફ્રેશર નોકરી",
    ],
  },
  {
    code: "kn",
    hreflang: "kn-in",
    ogLocale: "kn_IN",
    nativeName: "ಕನ್ನಡ",
    englishName: "Kannada",
    states: "Karnataka (Bengaluru, Mysuru, Mangaluru, Hubballi)",
    homeTitle: "Recruits.org.in ಕನ್ನಡ — ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ 2026 & ಬೆಂಗಳೂರು ಐಟಿ ಜಾಬ್ಸ್",
    homeDescription:
      "KPSC ಸರ್ಕಾರಿ ಉದ್ಯೋಗ, ಬೆಂಗಳೂರು ಐಟಿ ಮತ್ತು ಫ್ರೆಶರ್ ಜಾಬ್ಸ್, ಉಚಿತ ATS ರೆಸ್ಯೂಮ್ ಚೆಕರ್ ಮತ್ತು 10 ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಕೋರ್ಸ್‌ಗಳು.",
    jobsTitle: "ಬೆಂಗಳೂರು & ಕರ್ನಾಟಕ ಉದ್ಯೋಗ ಅವಕಾಶ 2026 — IT & Fresher | Recruits.org.in",
    jobsDescription:
      "ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಮಂಗಳೂರು ಮತ್ತು ಭಾರತದಾದ್ಯಂತ MNC, ಐಟಿ, ಫ್ರೆಶರ್ ಮತ್ತು ವರ್ಕ್ ಫ್ರಮ್ ಹೋಮ್ ಉದ್ಯೋಗಗಳಿಗೆ ನೇರವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
    govtTitle: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ 2026 — KPSC, UPSC, SSC & ರೈಲ್ವೆ | Recruits.org.in",
    govtDescription:
      "ಇತ್ತೀಚಿನ KPSC, KAS, ಪೊಲೀಸ್, SSC, ರೈಲ್ವೆ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ನೇಮಕಾತಿ ಅಧಿಸೂಚನೆಗಳು & ಕನ್ನಡದಲ್ಲಿ ಉಚಿತ Arohi ಮಾಕ್ ಇಂಟರ್ವ್ಯೂ.",
    coursesTitle: "ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಟ್ರೈನಿಂಗ್ ಕೋರ್ಸ್‌ಗಳು — AI, Data Science & Cloud | Recruits.org.in",
    coursesDescription:
      "AI, ಡೇಟಾ ಸೈನ್ಸ್, ಸೈಬರ್ ಸೆಕ್ಯುರಿಟಿ ಮತ್ತು ಕ್ಲೌಡ್ DevOps ನಲ್ಲಿ 10 ವೆರಿಫೈಡ್ ಕೋರ್ಸ್‌ಗಳು — 100% ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಬೆಂಬಲದೊಂದಿಗೆ.",
    visibleHeadingHome: "ಕರ್ನಾಟಕ ಮತ್ತು ಭಾರತದ ಪ್ರಮುಖ ಉದ್ಯೋಗ ಹಾಗೂ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ವೇದಿಕೆ",
    visibleHeadingJobs: "ಬೆಂಗಳೂರು & ಆಲ್ ಇಂಡಿಯಾ ಹೊಸ ಉದ್ಯೋಗಾವಕಾಶಗಳು 2026",
    visibleHeadingGovt: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ 2026 — KPSC & ಕೇಂದ್ರ ನೇಮಕಾತಿ",
    visibleHeadingCourses: "10 ವೆರಿಫೈಡ್ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಟ್ರೈನಿಂಗ್ ಕೋರ್ಸ್‌ಗಳು",
    keywords: [
      "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ 2026",
      "ಬೆಂಗಳೂರು ಉದ್ಯೋಗ ಅವಕಾಶ",
      "KPSC ನೇಮಕಾತಿ",
      "ಫ್ರೆಶರ್ ಐಟಿ ಜಾಬ್ಸ್",
      "Bengaluru fresher jobs",
    ],
  },
];

export const SEO_COURSES: SeoCourseEntry[] = [
  {
    id: "prog-01-ds-ai",
    slug: "data-science-ai",
    title: "Data Science & Artificial Intelligence",
    duration: "8–10 Months",
    feeINR: 79999,
    feeDisplay: "₹79,999",
    category: "Flagship AI & Data",
    summary:
      "End-to-end Machine Learning, Deep Learning, MLOps & Neural Networks with 80% verified digital hours, 20% physical mentoring, and 100% placement assistance.",
    tools: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "SQL", "MLOps"],
  },
  {
    id: "prog-02-genai-agents",
    slug: "generative-ai-agents",
    title: "Generative AI & AI Agent Development",
    duration: "5–6 Months",
    feeINR: 59999,
    feeDisplay: "₹59,999",
    category: "Next-Gen AI Engineering",
    summary:
      "Master LLM fine-tuning, RAG pipelines, vector databases, and autonomous multi-agent systems with verified project labs and MNC placement support.",
    tools: ["Gemini API", "LangGraph", "Vector DBs", "RAG", "TypeScript", "Python"],
  },
  {
    id: "prog-03-cybersecurity",
    slug: "cybersecurity-ethical-hacking",
    title: "Cybersecurity & Ethical Hacking",
    duration: "7–9 Months",
    feeINR: 69999,
    feeDisplay: "₹69,999",
    category: "Security & Defense",
    summary:
      "Offensive penetration testing, VAPT, SOC operations, and cloud security with live cyber range simulations and BFSI/IT placement pipelines.",
    tools: ["Kali Linux", "Metasploit", "Burp Suite", "Wireshark", "SIEM", "Zero-Trust"],
  },
  {
    id: "prog-04-cloud-devops",
    slug: "cloud-engineering-devops",
    title: "Cloud Engineering & DevOps",
    duration: "6–8 Months",
    feeINR: 59999,
    feeDisplay: "₹59,999",
    category: "Cloud & Infrastructure",
    summary:
      "Multi-cloud architecture across AWS, GCP, and Azure with Kubernetes orchestration, Terraform IaC, and CI/CD production deployments.",
    tools: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
  },
  {
    id: "prog-05-big-data",
    slug: "big-data-cloud-analytics",
    title: "Big Data Engineering & Cloud Analytics",
    duration: "6–8 Months",
    feeINR: 64999,
    feeDisplay: "₹64,999",
    category: "Data Engineering",
    summary:
      "Distributed data pipelines, real-time Kafka streaming, Apache Spark, Snowflake, and enterprise data lakehouse engineering.",
    tools: ["Apache Spark", "Kafka", "Snowflake", "Airflow", "Databricks", "BigQuery"],
  },
  {
    id: "prog-06-digital-marketing",
    slug: "digital-marketing-ai-growth",
    title: "Digital Marketing & AI-Powered Growth",
    duration: "6 Months",
    feeINR: 49999,
    feeDisplay: "₹49,999",
    category: "Growth & Marketing",
    summary:
      "AI-driven performance marketing, programmatic SEO, GA4 attribution, paid acquisition funnels, and agency/MNC placement support.",
    tools: ["GA4", "Google Ads", "Meta Ads", "HubSpot", "SEMrush", "CRO"],
  },
  {
    id: "prog-07-investment-banking",
    slug: "investment-banking-financial-analytics",
    title: "Investment Banking & Financial Analytics",
    duration: "6 Months",
    feeINR: 49999,
    feeDisplay: "₹49,999",
    category: "BFSI & Finance",
    summary:
      "Financial modeling, DCF & LBO valuation, M&A analytics, equity research, and Python for quantitative finance in Indian BFSI firms.",
    tools: ["Financial Modeling", "DCF & LBO", "Python for Finance", "Power BI", "Equity Valuation"],
  },
  {
    id: "prog-08-ds-business",
    slug: "data-science-business-decision-making",
    title: "Data Science for Business Decision-Making",
    duration: "3–4 Months",
    feeINR: 34999,
    feeDisplay: "₹34,999",
    category: "Executive & Management",
    summary:
      "Fast-track predictive analytics, Power BI & Tableau dashboards, KPI forecasting, and executive data storytelling for analysts and managers.",
    tools: ["Power BI", "Tableau", "Advanced Excel", "SQL", "Predictive Analytics"],
  },
  {
    id: "prog-09-ds-certification",
    slug: "data-science-professional-certification",
    title: "Data Science Professional Certification",
    duration: "8 Months",
    feeINR: 59999,
    feeDisplay: "₹59,999",
    category: "Professional Certification",
    summary:
      "Statistical foundations, exploratory data analysis, production ML deployment, and audited capstone portfolios with hybrid mentoring.",
    tools: ["Python", "Pandas", "Statistical Modeling", "SQL", "Machine Learning", "Git"],
  },
  {
    id: "prog-10-ds-engineers",
    slug: "data-science-for-engineers",
    title: "Data Science for Engineers",
    duration: "8 Months",
    feeINR: 69999,
    feeDisplay: "₹69,999",
    category: "Engineering Specialization",
    summary:
      "Production ML systems, FastAPI inference services, scalable algorithms, and system design tailored for CSE, ECE, Mechanical, and Civil engineers.",
    tools: ["Python", "FastAPI", "Docker", "System Design", "Deep Learning", "Cloud ML"],
  },
];

export const PAN_INDIA_CITIES: SeoCityEntry[] = [
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", highlights: "IT, AI, Cloud, Startups & Global Capability Centres" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", highlights: "Software Engineering, Pharma, FinTech & Cloud Hubs" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", highlights: "BFSI, Investment Banking, Media, Consulting & Tech" },
  { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi / Noida / Gurugram", highlights: "Central Govt, MNCs, Consulting, SaaS & Startups" },
  { slug: "pune", name: "Pune", state: "Maharashtra", highlights: "IT Services, Automotive Engineering, Cybersecurity & Product Firms" },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", highlights: "SaaS, Manufacturing, FinTech, Core Engineering & IT" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", highlights: "IT Sector V, BFSI, PSU Headquarters & Analytics" },
  { slug: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", highlights: "Infocity IT Parks, OPSC/State Govt, Mining PSUs & Startups" },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", highlights: "GIFT City FinTech, Pharma, Industrial & IT" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", highlights: "IT Parks, Digital Growth, State Govt & E-Commerce" },
  { slug: "chandigarh", name: "Chandigarh", state: "Chandigarh / Mohali", highlights: "IT Park, Banking, Telecom & North India Campus Drives" },
  { slug: "kochi", name: "Kochi", state: "Kerala", highlights: "Infopark Software, Cloud, Logistics & Marine Tech" },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", highlights: "Super Corridor IT, Analytics, Startups & Finance" },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", highlights: "UPPSC Govt Services, Banking, IT City & Healthcare" },
  { slug: "patna", name: "Patna", state: "Bihar", highlights: "BPSC Govt Jobs, Banking, EdTech & Emerging IT" },
  { slug: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", highlights: "Defence PSUs, Steel/Ports, IT SEZ & Analytics" },
  { slug: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", highlights: "Core Engineering, Manufacturing, SaaS & IT" },
  { slug: "surat", name: "Surat", state: "Gujarat", highlights: "Industrial Operations, Finance, E-Commerce & IT" },
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra", highlights: "MIHAN IT SEZ, Logistics, Power & Public Sector" },
  { slug: "guwahati", name: "Guwahati", state: "Assam", highlights: "North-East Govt, Oil & Gas PSUs, Banking & Tech" },
  { slug: "bhopal", name: "Bhopal", state: "Madhya Pradesh", highlights: "MPPSC, Engineering PSUs, BHEL & Software" },
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand", highlights: "Mining & Heavy Engineering PSUs, State Govt & IT" },
  { slug: "dehradun", name: "Dehradun", state: "Uttarakhand", highlights: "ONGC/Defence R&D, IT Park & State Services" },
  { slug: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", highlights: "Technopark IT, Space/ISRO Ecosystem & AI" },
];

export const PAN_INDIA_JOB_CATEGORIES: SeoJobCategoryEntry[] = [
  {
    slug: "work-from-home",
    label: "Work From Home Jobs India",
    title: "Work From Home & Remote Jobs in India 2026 | Recruits.org.in",
    description:
      "Apply to verified Work From Home (WFH) and remote jobs across India in IT, AI, customer success, analytics, finance & digital marketing.",
    keywords: ["work from home jobs India", "remote jobs India 2026", "WFH fresher jobs", "online jobs India", "घर बैठे काम"],
    sector: "Private",
    searchHint: "Remote",
    qualificationHint: "Any",
  },
  {
    slug: "freshers",
    label: "Fresher Jobs India 2026",
    title: "Fresher Jobs in India 2026 — Off-Campus & MNC Drives | Recruits.org.in",
    description:
      "Latest fresher jobs & 2026 off-campus drives at TCS, Infosys, Wipro, HDFC Bank, Reliance & top Indian startups with free ATS resume scoring.",
    keywords: ["fresher jobs in India", "off campus drive 2026", "MNC fresher jobs", "entry level jobs India", "TCS Infosys hiring"],
    sector: "All",
    searchHint: "Fresher",
    qualificationHint: "Any Graduate",
  },
  {
    slug: "btech-freshers",
    label: "B.Tech / BE Engineering Jobs",
    title: "B.Tech & BE Fresher Jobs in India 2026 — IT, AI & PSU | Recruits.org.in",
    description:
      "Explore verified B.Tech / BE engineering openings in Software, AI/ML, Cloud DevOps, Core Engineering & GATE PSUs across India.",
    keywords: ["B.Tech fresher jobs India", "BE software engineer jobs", "engineering graduate jobs", "CSE ECE mechanical jobs"],
    sector: "All",
    searchHint: "Engineer",
    qualificationHint: "B.Tech / B.E.",
  },
  {
    slug: "graduate-govt-jobs",
    label: "Graduate Govt Jobs",
    title: "Any Graduate Govt Jobs in India 2026 — UPSC, SSC, Bank | Recruits.org.in",
    description:
      "Complete list of verified Central & State Government jobs for any graduate: UPSC, SSC CGL, IBPS PO, SBI, Railways NTPC & State PSCs.",
    keywords: ["graduate govt jobs India", "any graduate sarkari naukri", "degree holder govt vacancy 2026"],
    sector: "Government",
    searchHint: "Graduate",
    qualificationHint: "Any Graduate",
  },
  {
    slug: "12th-pass-govt-jobs",
    label: "12th & 10th Pass Govt Jobs",
    title: "12th Pass & 10th Pass Govt Jobs India 2026 — SSC, RRB | Recruits.org.in",
    description:
      "Apply to verified 10th & 12th pass Central and State Govt vacancies: SSC CHSL, MTS, Railway Group D/ALP, Defence Agniveer & State Police.",
    keywords: ["12th pass govt jobs 2026", "10th pass railway jobs", "SSC CHSL MTS vacancy", "sarkari naukri 12th pass"],
    sector: "Government",
    searchHint: "SSC",
    qualificationHint: "12th Pass",
  },
  {
    slug: "it-software-jobs",
    label: "IT & Software Engineer Jobs",
    title: "IT & Software Engineer Jobs in India 2026 — AI & Cloud | Recruits.org.in",
    description:
      "Find high-paying Full-Stack, Python, React, AI/ML, Data Science, Cybersecurity & Cloud DevOps jobs across India's top tech hubs.",
    keywords: ["IT jobs India 2026", "software engineer jobs India", "AI ML developer jobs", "full stack jobs Bengaluru Hyderabad"],
    sector: "Private",
    searchHint: "Software",
    qualificationHint: "B.Tech / B.E.",
  },
  {
    slug: "mba-finance-jobs",
    label: "MBA, B.Com & Finance Jobs",
    title: "MBA, B.Com & Investment Banking Jobs India 2026 | Recruits.org.in",
    description:
      "Explore verified openings in Investment Banking, Financial Analytics, Consulting, Product Management & BFSI leadership across India.",
    keywords: ["MBA jobs India", "investment banking jobs India", "B.Com fresher jobs", "BFSI finance careers"],
    sector: "Banking",
    searchHint: "Finance",
    qualificationHint: "MBA / PG",
  },
  {
    slug: "banking-finance",
    label: "Banking & FinTech Jobs",
    title: "Banking & FinTech Jobs in India 2026 — SBI, IBPS, HDFC | Recruits.org.in",
    description:
      "Public sector bank exams (SBI, IBPS, RBI, NABARD) and private banking careers at HDFC, ICICI, Axis & leading Indian FinTechs.",
    keywords: ["banking jobs India 2026", "SBI IBPS recruitment", "HDFC ICICI careers", "FinTech jobs India"],
    sector: "Banking",
    searchHint: "Bank",
    qualificationHint: "Any Graduate",
  },
  {
    slug: "diploma-engineering",
    label: "Diploma & ITI Core Jobs",
    title: "Diploma & ITI Engineering Jobs India 2026 — PSU & Core | Recruits.org.in",
    description:
      "Verified Junior Engineer (JE), Railways ALP/Technician, PSU Apprenticeship, Manufacturing & Core Plant jobs for Diploma & ITI holders.",
    keywords: ["diploma engineering jobs India", "ITI govt jobs 2026", "SSC JE RRB JE", "PSU technician vacancy"],
    sector: "PSU",
    searchHint: "Junior Engineer",
    qualificationHint: "Diploma / ITI",
  },
  {
    slug: "walk-in-interviews",
    label: "Walk-In Interviews Today",
    title: "Walk-In Interview Drives Today Across India 2026 | Recruits.org.in",
    description:
      "Track verified direct walk-in interviews and campus hiring drives in Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Delhi NCR & Bhubaneswar.",
    keywords: ["walk in interview today India", "direct hiring drives", "fresher walk in Bengaluru Pune Chennai"],
    sector: "Private",
    searchHint: "Drive",
    qualificationHint: "Any",
  },
];

export const PAN_INDIA_GOVT_EXAMS: SeoGovtExamEntry[] = [
  { slug: "upsc", name: "UPSC Civil Services & Central Govt Jobs", shortName: "UPSC", region: "All India", highlights: "IAS, IPS, IFS, CAPF, CDS, NDA & Engineering Services", searchHint: "UPSC" },
  { slug: "ssc", name: "SSC CGL, CHSL, MTS & JE Vacancies", shortName: "SSC", region: "All India", highlights: "Central Ministries, Income Tax, CBI, Audit & Junior Engineer", searchHint: "SSC" },
  { slug: "railways-rrb", name: "RRB Railways NTPC, ALP & Group D Jobs", shortName: "RRB Railways", region: "All India", highlights: "Indian Railways Technical, Non-Technical & Officer Cadres", searchHint: "Railway" },
  { slug: "banking-ibps-sbi", name: "IBPS PO, SBI PO, Clerk & RBI Jobs", shortName: "Banking", region: "All India", highlights: "Public Sector Banks, SBI, NABARD, SEBI & RBI Grade B", searchHint: "Bank" },
  { slug: "psu-gate", name: "PSU Jobs (ONGC, NTPC, ISRO, DRDO, BHEL)", shortName: "PSU & GATE", region: "All India", highlights: "Maharatna & Navratna Public Sector Engineering & Management", searchHint: "PSU" },
  { slug: "defence", name: "Indian Army, Navy, Air Force & DRDO Jobs", shortName: "Defence", region: "All India", highlights: "NDA, CDS, AFCAT, Agniveer & Defence Research", searchHint: "Defence" },
  { slug: "opsc-odisha", name: "OPSC & OSSC Odisha Govt Jobs", shortName: "OPSC Odisha", region: "Odisha", highlights: "OAS, OMC, OPTCL, Odisha Police & State Secretariat", searchHint: "OPSC" },
  { slug: "uppsc", name: "UPPSC & UPSSSC Uttar Pradesh Govt Jobs", shortName: "UPPSC", region: "Uttar Pradesh", highlights: "PCS, RO/ARO, Lekhpal & State Engineering Services", searchHint: "UPPSC" },
  { slug: "bpsc", name: "BPSC Bihar Public Service Jobs", shortName: "BPSC", region: "Bihar", highlights: "Bihar Administrative Service, Teachers & Technical Cadres", searchHint: "BPSC" },
  { slug: "mpsc", name: "MPSC Maharashtra Govt Jobs", shortName: "MPSC", region: "Maharashtra", highlights: "Rajyaseva, PSI/STI/ASO & State Engineering", searchHint: "MPSC" },
  { slug: "tnpsc", name: "TNPSC Tamil Nadu Govt Jobs", shortName: "TNPSC", region: "Tamil Nadu", highlights: "Group 1, Group 2, Group 4 & VAO Recruitment", searchHint: "TNPSC" },
  { slug: "kpsc", name: "KPSC Karnataka Govt Jobs", shortName: "KPSC", region: "Karnataka", highlights: "KAS Gazetted Probationers, FDA/SDA & Engineering", searchHint: "KPSC" },
  { slug: "wbpsc", name: "WBPSC West Bengal Govt Jobs", shortName: "WBPSC", region: "West Bengal", highlights: "WBCS Executive, Miscellaneous & Clerkship", searchHint: "WBPSC" },
  { slug: "rpsc", name: "RPSC Rajasthan Govt Jobs", shortName: "RPSC", region: "Rajasthan", highlights: "RAS, RTS, Assistant Professor & State Cadres", searchHint: "RPSC" },
  { slug: "mppsc", name: "MPPSC Madhya Pradesh Govt Jobs", shortName: "MPPSC", region: "Madhya Pradesh", highlights: "State Service Exam, Forest Service & Technical Posts", searchHint: "MPPSC" },
  { slug: "gpsc", name: "GPSC Gujarat Govt Jobs", shortName: "GPSC", region: "Gujarat", highlights: "Class 1 & 2 Administrative, Police & Engineering", searchHint: "GPSC" },
];

export const CORE_ENGINE_ROUTES: Array<{
  path: string;
  engineId: string;
  roleMode: "candidate" | "recruiter";
  label: string;
  title: string;
  description: string;
  keywords: string[];
}> = [
  {
    path: "/jobs",
    engineId: "liveindiajobs",
    roleMode: "candidate",
    label: "Live India Jobs",
    title: "Live Jobs in India 2026 — Govt, PSU & Top MNC | Recruits.org.in",
    description:
      "Search 100,000+ verified Government, PSU, IT, BFSI, and MNC jobs across Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, Chennai & Bhubaneswar.",
    keywords: ["jobs in India", "latest jobs 2026", "MNC fresher jobs India", "live job vacancies", "jobs near me", "Recruits.org.in"],
  },
  {
    path: "/govt-jobs",
    engineId: "liveindiajobs",
    roleMode: "candidate",
    label: "Govt Jobs India",
    title: "Govt Jobs India 2026 — UPSC, SSC, RRB, Banking & State PSC",
    description:
      "Explore verified Central & State Government vacancies: UPSC, SSC, Railways RRB, SBI/IBPS Banking, PSUs, OPSC, UPPSC, BPSC, MPSC & TNPSC.",
    keywords: ["govt jobs India", "sarkari naukri 2026", "sarkari result", "free job alert", "UPSC jobs", "SSC CGL", "OPSC recruitment", "railway jobs"],
  },
  {
    path: "/courses",
    engineId: "learning",
    roleMode: "candidate",
    label: "Training & Placement Programs",
    title: "10 Verified Placement Training Programs in India | Recruits.org.in",
    description:
      "Master AI, Data Science, Cybersecurity, Cloud DevOps & Finance with 80% verified digital hours, 20% physical mentoring, and 100% placement support.",
    keywords: ["job guarantee courses India", "AI Data Science course India", "placement training programs", "verified LMS India"],
  },
  {
    path: "/ats-resume-checker",
    engineId: "resume",
    roleMode: "candidate",
    label: "Free ATS Resume Checker",
    title: "Free ATS Resume Checker & Rewriter India | Recruits.org.in",
    description:
      "Score and rewrite your resume for Indian MNC & startup ATS systems in seconds. Import LinkedIn profiles and boost interview shortlists for free.",
    keywords: ["free ATS resume checker India", "ATS resume score free", "AI resume rewriter", "CV optimizer India"],
  },
  {
    path: "/mock-interview",
    engineId: "interview",
    roleMode: "candidate",
    label: "Voice Mock Interview Lab",
    title: "Free AI Voice Mock Interview in 9 Indian Languages | Recruits.org.in",
    description:
      "Practice live HR, technical, and UPSC/OPSC board mock interviews with Arohi in English, Hindi, Odia, Tamil, Telugu, Kannada, Marathi, Gujarati & Bengali.",
    keywords: ["AI mock interview free India", "voice mock interview", "UPSC interview prep", "technical interview practice"],
  },
  {
    path: "/career-roadmap",
    engineId: "pathvisualizer",
    roleMode: "candidate",
    label: "Career Path Visualizer",
    title: "Interactive Career Roadmap & Path Visualizer | Recruits.org.in",
    description:
      "Visualize step-by-step career progressions, skills, certifications, and salary trajectories across tech, government, and corporate roles in India.",
    keywords: ["career roadmap India", "career path visualizer", "IT career progression", "career planner"],
  },
  {
    path: "/career-navigator",
    engineId: "navigator",
    roleMode: "candidate",
    label: "Career Navigator",
    title: "Arohi Career Navigator — Personalized Strategy | Recruits.org.in",
    description:
      "Get a personalized action plan for Indian corporate hiring, campus placements, or government exams with Arohi on Recruits.org.in.",
    keywords: ["career guidance India", "AI career counselor", "campus placement prep", "Arohi career navigator"],
  },
  {
    path: "/job-match",
    engineId: "jobmatch",
    roleMode: "candidate",
    label: "MNC Job Match",
    title: "Smart MNC & Company Job Matching Engine India | Recruits.org.in",
    description:
      "Match your skills directly with active hiring drives at TCS, Infosys, Wipro, HDFC Bank, Reliance, Tech Mahindra, and high-growth Indian startups.",
    keywords: ["MNC job match India", "TCS Infosys Wipro jobs", "direct company hiring", "fresher drives India"],
  },
  {
    path: "/skill-gap-analyzer",
    engineId: "skillgap",
    roleMode: "candidate",
    label: "Skill Gap Analyzer",
    title: "Free Role-Based Skill Gap Analyzer India | Recruits.org.in",
    description:
      "Identify exact technical and domain skill gaps between your current profile and target high-paying roles across India with curated learning sprints.",
    keywords: ["skill gap analysis tool", "career skill assessment India", "tech skills roadmap"],
  },
  {
    path: "/skill-mastery",
    engineId: "skillmastery",
    roleMode: "candidate",
    label: "GK & Skill Mastery Quizzes",
    title: "30s Speed Aptitude, GK & Skill Mastery Drills | Recruits.org.in",
    description:
      "Sharpen quantitative aptitude, coding logic, and UPSC/OPSC/SSC General Studies with daily timed quizzes and verifiable skill mastery badges.",
    keywords: ["aptitude quiz India", "OPSC GK quiz", "SSC mock drill", "coding assessment prep"],
  },
  {
    path: "/salary-intelligence",
    engineId: "salary",
    roleMode: "candidate",
    label: "India Salary & CTC Intelligence",
    title: "India Salary & CTC Benchmark Calculator 2026 | Recruits.org.in",
    description:
      "Compare real-time Indian CTC packages by role, city, and experience level, plus get tailored salary negotiation scripts for MNC offers.",
    keywords: ["India salary calculator", "CTC to in hand India", "IT CTC benchmark India", "salary negotiation script"],
  },
  {
    path: "/career-mentor",
    engineId: "mentor",
    roleMode: "candidate",
    label: "Executive Career Mentor",
    title: "Arohi Career Mentor — Growth & Higher Ed Advice | Recruits.org.in",
    description:
      "Ask Arohi strategic questions about role switches, promotions, MBA/MS/GATE decisions, and long-term career acceleration in India.",
    keywords: ["career mentor India", "career switch advice", "higher education guidance India"],
  },
  {
    path: "/recruiters",
    engineId: "recruiter",
    roleMode: "recruiter",
    label: "Free Recruiter Job Posting",
    title: "100% Free Job Posting Site in India for Recruiters | Recruits.org.in",
    description:
      "Post unlimited jobs for free in India. Screen candidates faster and connect directly with verified graduates, campus batches, and experienced talent.",
    keywords: ["free job posting site India", "hire freshers India", "free recruiter portal", "campus recruitment partner"],
  },
  {
    path: "/post-job-free",
    engineId: "recruiter",
    roleMode: "recruiter",
    label: "Post a Job Free",
    title: "Post Jobs Free in India — Zero Commission Hiring | Recruits.org.in",
    description:
      "Publish verified openings across India with zero listing fees. Reach pre-trained graduates and active job seekers instantly on Recruits.org.in.",
    keywords: ["post job free India", "free employer job board", "zero fee recruitment India"],
  },
];

export const PAN_INDIA_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "What is Recruits.org.in?",
    answer:
      "Recruits.org.in, built by Quench Research Labs Private Limited and powered by Arohi (arohiai.com), is India's integrated job search, verified placement training, and free recruiter hiring platform covering Government exams, PSUs, and top MNC drives across all Indian states.",
  },
  {
    question: "Are the job listings and ATS resume tools free for candidates across India?",
    answer:
      "Yes. Searching 100,000+ Government and Private MNC vacancies, checking and optimizing ATS resumes, taking 30-second aptitude/GK drills, and practicing voice mock interviews with Arohi are accessible for candidates across India.",
  },
  {
    question: "How do the 10 verified training and placement programs work?",
    answer:
      "Each of the 10 programs (including Data Science & AI, Generative AI & Agents, Cybersecurity, Cloud & DevOps, Big Data, Digital Marketing, and Investment Banking) follows a strict 80% verified digital curriculum + 20% physical mentor tutoring model with anti-idle study tracking, graded coding labs, proctored exams, and 100% placement assistance.",
  },
  {
    question: "Can companies and colleges post jobs or partner for campus placements for free?",
    answer:
      "Yes. Recruiters and employers across India can publish job openings 100% free with zero middleman fees, and universities or colleges can register directly through the Institutional Partnership hub.",
  },
  {
    question: "Which Indian languages are supported for job search, voice mock interviews, and career guidance?",
    answer:
      "Recruits.org.in and Arohi support 9 Indian languages: English, Hindi, Odia, Tamil, Telugu, Kannada, Marathi, Gujarati, and Bengali — enabling students from Tier-1, Tier-2, and Tier-3 cities across India to search and prepare comfortably.",
  },
];

export const FEATURED_PAN_INDIA_JOB_POSTINGS = [
  {
    title: "Software Engineer — Full Stack & AI Systems",
    company: "TCS / Top IT MNC Partner Network",
    city: "Bengaluru",
    state: "Karnataka",
    minSalaryINR: 800000,
    maxSalaryINR: 1800000,
    employmentType: "FULL_TIME",
    description:
      "Build scalable cloud and generative AI web applications for enterprise clients across India. Open to trained graduates and experienced engineers.",
  },
  {
    title: "Data Scientist & Machine Learning Engineer",
    company: "Infosys / Enterprise Analytics Hiring Drive",
    city: "Hyderabad",
    state: "Telangana",
    minSalaryINR: 900000,
    maxSalaryINR: 2200000,
    employmentType: "FULL_TIME",
    description:
      "Design production ML models, vectorized Python pipelines, and analytics platforms with verified placement support on Recruits.org.in.",
  },
  {
    title: "Cloud DevOps & Cybersecurity Analyst",
    company: "Wipro / BFSI & Cloud Security Partner",
    city: "Pune",
    state: "Maharashtra",
    minSalaryINR: 750000,
    maxSalaryINR: 1650000,
    employmentType: "FULL_TIME",
    description:
      "Manage AWS/GCP Kubernetes infrastructure, CI/CD automation, and SOC security audits for high-availability banking and enterprise workloads.",
  },
  {
    title: "Assistant Manager & Graduate Officer (State & Central Govt Prep)",
    company: "UPSC / SSC / OPSC / Banking & PSU Recruitment Tracker",
    city: "Bhubaneswar",
    state: "Odisha",
    minSalaryINR: 600000,
    maxSalaryINR: 1400000,
    employmentType: "FULL_TIME",
    description:
      "Direct notification tracker, GK mock drills, and board interview preparation for Central Government, PSU, Banking, and State PSC vacancies across India.",
  },
];

export function normalizePathname(rawPathname: string): string {
  const withoutQuery = (rawPathname || "/").split("?")[0].split("#")[0];
  if (!withoutQuery || withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/+$/, "").toLowerCase();
}

export function getEnginePath(engineId: string, roleMode?: "candidate" | "recruiter"): string {
  if (roleMode === "recruiter" || engineId === "recruiter") return "/recruiters";
  const match = CORE_ENGINE_ROUTES.find((r) => r.engineId === engineId);
  return match ? match.path : "/jobs";
}

export function resolveSeoRoute(rawPathname: string): SeoRouteMeta {
  const pathname = normalizePathname(rawPathname);

  // 0. Check Native Regional Language Prefixed Routes: /hi, /hi/jobs, /hi/govt-jobs, /hi/courses (and or, ta, te, mr, bn, gu, kn)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 1) {
    const langHub = REGIONAL_LANGUAGE_HUBS.find((h) => h.code === segments[0]);
    if (langHub) {
      const subPath = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "/";
      if (subPath === "/") {
        return {
          pathname,
          canonicalPath: `/${langHub.code}`,
          basePathWithoutLang: "/",
          langCode: langHub.code,
          htmlLang: langHub.hreflang,
          ogLocale: langHub.ogLocale,
          title: langHub.homeTitle,
          description: langHub.homeDescription,
          keywords: [...langHub.keywords, "Recruits.org.in", "Arohi", langHub.englishName],
          view: "landing",
          engineId: "liveindiajobs",
          roleMode: "candidate",
          sectionLabel: `${langHub.nativeName} (${langHub.englishName})`,
          visibleHeading: langHub.visibleHeadingHome,
          visibleSubtitle: langHub.homeDescription,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: `${langHub.nativeName} (${langHub.englishName})`, path: `/${langHub.code}` },
          ],
          hasMultilingualAlternates: true,
        };
      }
      if (subPath === "/jobs") {
        return {
          pathname,
          canonicalPath: `/${langHub.code}/jobs`,
          basePathWithoutLang: "/jobs",
          langCode: langHub.code,
          htmlLang: langHub.hreflang,
          ogLocale: langHub.ogLocale,
          title: langHub.jobsTitle,
          description: langHub.jobsDescription,
          keywords: [...langHub.keywords, "jobs in India", "Recruits.org.in"],
          view: "workspace",
          engineId: "liveindiajobs",
          roleMode: "candidate",
          sectionLabel: `${langHub.nativeName} Jobs`,
          visibleHeading: langHub.visibleHeadingJobs,
          visibleSubtitle: `${langHub.states} — ${langHub.jobsDescription}`,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: langHub.nativeName, path: `/${langHub.code}` },
            { name: "Jobs", path: `/${langHub.code}/jobs` },
          ],
          hasMultilingualAlternates: true,
          autoFilter: { sector: "All", location: "All India" },
        };
      }
      if (subPath === "/govt-jobs") {
        return {
          pathname,
          canonicalPath: `/${langHub.code}/govt-jobs`,
          basePathWithoutLang: "/govt-jobs",
          langCode: langHub.code,
          htmlLang: langHub.hreflang,
          ogLocale: langHub.ogLocale,
          title: langHub.govtTitle,
          description: langHub.govtDescription,
          keywords: [...langHub.keywords, "govt jobs India", "sarkari naukri", "Recruits.org.in"],
          view: "workspace",
          engineId: "liveindiajobs",
          roleMode: "candidate",
          sectionLabel: `${langHub.nativeName} Govt Jobs`,
          visibleHeading: langHub.visibleHeadingGovt,
          visibleSubtitle: langHub.govtDescription,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: langHub.nativeName, path: `/${langHub.code}` },
            { name: "Govt Jobs", path: `/${langHub.code}/govt-jobs` },
          ],
          hasMultilingualAlternates: true,
          autoFilter: { sector: "Government", location: "All India" },
        };
      }
      if (subPath === "/courses") {
        return {
          pathname,
          canonicalPath: `/${langHub.code}/courses`,
          basePathWithoutLang: "/courses",
          langCode: langHub.code,
          htmlLang: langHub.hreflang,
          ogLocale: langHub.ogLocale,
          title: langHub.coursesTitle,
          description: langHub.coursesDescription,
          keywords: [...langHub.keywords, "placement courses India", "Recruits.org.in"],
          view: "workspace",
          engineId: "learning",
          roleMode: "candidate",
          sectionLabel: `${langHub.nativeName} Courses`,
          visibleHeading: langHub.visibleHeadingCourses,
          visibleSubtitle: langHub.coursesDescription,
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: langHub.nativeName, path: `/${langHub.code}` },
            { name: "Courses", path: `/${langHub.code}/courses` },
          ],
          hasMultilingualAlternates: true,
        };
      }
    }
  }

  // 1. Homepage (English / Pan-India Default)
  if (pathname === "/") {
    return {
      pathname: "/",
      canonicalPath: "/",
      basePathWithoutLang: "/",
      langCode: "en",
      htmlLang: "en-IN",
      ogLocale: "en_IN",
      title: "Recruits.org.in — Where India Trains & Gets Hired",
      description:
        "Search 100,000+ Govt & MNC jobs across India, complete 10 verified placement courses, check ATS resumes, and post jobs free on Recruits.org.in.",
      keywords: [
        "Recruits.org.in",
        "jobs in India",
        "govt jobs India 2026",
        "sarkari naukri",
        "free job alert",
        "work from home jobs India",
        "fresher jobs India",
        "MNC jobs India",
        "placement training programs India",
        "free ATS resume checker India",
        "AI mock interview India",
        "free job posting site India",
        "campus placements India",
        "सरकारी नौकरी 2026",
        "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି",
        "Arohi",
        "Quench Research Labs",
      ],
      view: "landing",
      engineId: "liveindiajobs",
      roleMode: "candidate",
      sectionLabel: "Home",
      visibleHeading: "Where India Trains. Where India Gets Hired.",
      visibleSubtitle:
        "100,000+ Live Govt & MNC Opportunities • 10 Rigorous Placement Programs • 9 Indian Languages • Powered by Arohi",
      breadcrumbs: [{ name: "Home", path: "/" }],
      hasMultilingualAlternates: true,
    };
  }

  // 2. Exact Core Engine Routes
  const coreMatch = CORE_ENGINE_ROUTES.find((r) => r.path === pathname);
  if (coreMatch) {
    const isMultilingualEligible =
      coreMatch.path === "/jobs" || coreMatch.path === "/govt-jobs" || coreMatch.path === "/courses";
    return {
      pathname,
      canonicalPath: coreMatch.path,
      basePathWithoutLang: coreMatch.path,
      langCode: "en",
      htmlLang: "en-IN",
      ogLocale: "en_IN",
      title: coreMatch.title,
      description: coreMatch.description,
      keywords: [...coreMatch.keywords, "Recruits.org.in", "India careers", "Arohi"],
      view: "workspace",
      engineId: coreMatch.engineId,
      roleMode: coreMatch.roleMode,
      sectionLabel: coreMatch.label,
      visibleHeading: coreMatch.label,
      visibleSubtitle: coreMatch.description,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: coreMatch.label, path: coreMatch.path },
      ],
      hasMultilingualAlternates: isMultilingualEligible,
      autoFilter:
        coreMatch.path === "/govt-jobs"
          ? { sector: "Government", location: "All India" }
          : coreMatch.path === "/jobs"
          ? { sector: "All", location: "All India" }
          : undefined,
    };
  }

  // 3. Individual Training Course Route: /courses/:slug
  if (pathname.startsWith("/courses/")) {
    const slug = pathname.replace("/courses/", "");
    const course = SEO_COURSES.find((c) => c.slug === slug);
    if (course) {
      return {
        pathname,
        canonicalPath: `/courses/${course.slug}`,
        basePathWithoutLang: `/courses/${course.slug}`,
        langCode: "en",
        htmlLang: "en-IN",
        ogLocale: "en_IN",
        title: `${course.title} Course (${course.feeDisplay}) | Recruits.org.in`,
        description: `${course.summary.slice(0, 152)}`,
        keywords: [
          course.title,
          `${course.title} course India`,
          `${course.title} with placement`,
          ...course.tools,
          "Recruits.org.in",
          "verified training India",
        ],
        view: "workspace",
        engineId: "learning",
        roleMode: "candidate",
        sectionLabel: course.title,
        visibleHeading: `${course.title} (${course.feeDisplay} • ${course.duration})`,
        visibleSubtitle: course.summary,
        courseSlug: course.slug,
        autoFilter: { courseId: course.id },
        breadcrumbs: [
          { name: "Home", path: "/" },
          { name: "Training Programs", path: "/courses" },
          { name: course.title, path: `/courses/${course.slug}` },
        ],
        hasMultilingualAlternates: false,
      };
    }
  }

  // 4. High-Volume Qualification & Job Category Hubs: /jobs/:categorySlug
  if (pathname.startsWith("/jobs/")) {
    const subSlug = pathname.replace("/jobs/", "");
    const category = PAN_INDIA_JOB_CATEGORIES.find((c) => c.slug === subSlug);
    if (category) {
      return {
        pathname,
        canonicalPath: `/jobs/${category.slug}`,
        basePathWithoutLang: `/jobs/${category.slug}`,
        langCode: "en",
        htmlLang: "en-IN",
        ogLocale: "en_IN",
        title: category.title,
        description: category.description,
        keywords: [...category.keywords, "Recruits.org.in", "jobs in India"],
        view: "workspace",
        engineId: "liveindiajobs",
        roleMode: "candidate",
        sectionLabel: category.label,
        visibleHeading: `${category.label} — Live Verified Vacancies`,
        visibleSubtitle: category.description,
        categorySlug: category.slug,
        autoFilter: {
          sector: category.sector,
          location: "All India",
          search: category.searchHint,
          qualification: category.qualificationHint,
        },
        breadcrumbs: [
          { name: "Home", path: "/" },
          { name: "India Jobs", path: "/jobs" },
          { name: category.label, path: `/jobs/${category.slug}` },
        ],
        hasMultilingualAlternates: false,
      };
    }

    // 5. City Job Hub Route: /jobs/:citySlug
    const city = PAN_INDIA_CITIES.find((c) => c.slug === subSlug);
    if (city) {
      return {
        pathname,
        canonicalPath: `/jobs/${city.slug}`,
        basePathWithoutLang: `/jobs/${city.slug}`,
        langCode: "en",
        htmlLang: "en-IN",
        ogLocale: "en_IN",
        title: `Jobs in ${city.name} 2026 — IT, MNC & Govt | Recruits.org.in`,
        description: `Apply to verified fresher & experienced jobs in ${city.name}, ${city.state}. Top openings in ${city.highlights} plus free ATS resume check.`,
        keywords: [
          `jobs in ${city.name}`,
          `fresher jobs ${city.name}`,
          `IT jobs ${city.name}`,
          `govt jobs ${city.state}`,
          `MNC hiring ${city.name}`,
          "Recruits.org.in",
        ],
        view: "workspace",
        engineId: "liveindiajobs",
        roleMode: "candidate",
        sectionLabel: `Jobs in ${city.name}`,
        visibleHeading: `Jobs in ${city.name}, ${city.state} (2026)`,
        visibleSubtitle: `Live verified openings across ${city.highlights} — zero middleman fees.`,
        citySlug: city.slug,
        autoFilter: { sector: "All", location: city.name, search: "" },
        breadcrumbs: [
          { name: "Home", path: "/" },
          { name: "India Jobs", path: "/jobs" },
          { name: `Jobs in ${city.name}`, path: `/jobs/${city.slug}` },
        ],
        hasMultilingualAlternates: false,
      };
    }
  }

  // 6. Govt Exam Hub Route: /govt-jobs/:examSlug
  if (pathname.startsWith("/govt-jobs/")) {
    const examSlug = pathname.replace("/govt-jobs/", "");
    const exam = PAN_INDIA_GOVT_EXAMS.find((e) => e.slug === examSlug);
    if (exam) {
      return {
        pathname,
        canonicalPath: `/govt-jobs/${exam.slug}`,
        basePathWithoutLang: `/govt-jobs/${exam.slug}`,
        langCode: "en",
        htmlLang: "en-IN",
        ogLocale: "en_IN",
        title: `${exam.shortName} Jobs & Prep 2026 (${exam.region}) | Recruits.org.in`,
        description: `Latest ${exam.name} notifications, free GK & aptitude drills, and board mock interviews covering ${exam.highlights}.`,
        keywords: [
          exam.shortName,
          exam.name,
          `${exam.shortName} recruitment 2026`,
          `govt jobs ${exam.region}`,
          "sarkari naukri India",
          "Recruits.org.in",
        ],
        view: "workspace",
        engineId: "liveindiajobs",
        roleMode: "candidate",
        sectionLabel: `${exam.shortName} Recruitment`,
        visibleHeading: `${exam.name} (2026)`,
        visibleSubtitle: `${exam.region} • Covering ${exam.highlights} with free GK drills & voice board prep.`,
        examSlug: exam.slug,
        autoFilter: {
          sector: exam.slug === "banking-ibps-sbi" ? "Banking" : exam.slug === "psu-gate" ? "PSU" : "Government",
          location: exam.region === "All India" ? "All India" : exam.region,
          search: exam.searchHint,
        },
        breadcrumbs: [
          { name: "Home", path: "/" },
          { name: "Govt Jobs India", path: "/govt-jobs" },
          { name: exam.shortName, path: `/govt-jobs/${exam.slug}` },
        ],
        hasMultilingualAlternates: false,
      };
    }
  }

  // Fallback to Home metadata
  return resolveSeoRoute("/");
}

export function buildHreflangAlternates(
  meta: SeoRouteMeta,
  baseUrl: string = CANONICAL_DOMAIN
): Array<{ hreflang: string; href: string }> {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  if (!meta.hasMultilingualAlternates) {
    const canonical = `${cleanBase}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`;
    return [
      { hreflang: meta.htmlLang.toLowerCase(), href: canonical },
      { hreflang: "x-default", href: canonical },
    ];
  }

  const suffix = meta.basePathWithoutLang === "/" ? "" : meta.basePathWithoutLang;
  const enHref = `${cleanBase}${suffix || "/"}`;
  const list: Array<{ hreflang: string; href: string }> = [
    { hreflang: "en-in", href: enHref },
    ...REGIONAL_LANGUAGE_HUBS.map((hub) => ({
      hreflang: hub.hreflang,
      href: `${cleanBase}/${hub.code}${suffix}`,
    })),
    { hreflang: "x-default", href: enHref },
  ];
  return list;
}

export function buildStructuredDataGraph(meta: SeoRouteMeta, baseUrl: string = CANONICAL_DOMAIN): Record<string, any> {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const pageUrl = `${cleanBase}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`;
  const ogImageUrl = `${cleanBase}${OG_IMAGE_PATH}`;
  const todayIso = new Date().toISOString().split("T")[0];
  const validThroughIso = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const graph: Record<string, any>[] = [
    {
      "@type": "Organization",
      "@id": `${cleanBase}/#organization`,
      name: SITE_NAME,
      legalName: ORG_NAME,
      url: cleanBase,
      logo: {
        "@type": "ImageObject",
        url: ogImageUrl,
        width: 1280,
        height: 720,
      },
      email: "recruit.org.contact@gmail.com",
      sameAs: ["https://recruits.org.in", "https://arohiai.com"],
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      description:
        "India's verified job search, 180-hour placement training, and zero-fee recruiter hiring platform across 9 Indian languages, powered by Arohi (Quench Research Labs Private Limited).",
    },
    {
      "@type": "WebSite",
      "@id": `${cleanBase}/#website`,
      url: cleanBase,
      name: SITE_NAME,
      alternateName: "Recruits India",
      description: "Where India Trains. Where India Gets Hired.",
      inLanguage: ["en-IN", "hi-IN", "or-IN", "ta-IN", "te-IN", "kn-IN", "mr-IN", "gu-IN", "bn-IN"],
      publisher: { "@id": `${cleanBase}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${cleanBase}/jobs?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${cleanBase}/#webapp`,
      name: `${SITE_NAME} Career & Placement Platform`,
      url: pageUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      inLanguage: ["en-IN", "hi-IN", "or-IN", "ta-IN", "te-IN", "kn-IN", "mr-IN", "gu-IN", "bn-IN"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      provider: { "@id": `${cleanBase}/#organization` },
      featureList: [
        "100,000+ Live Government, PSU & Private MNC Jobs Across India",
        "10 Verified Placement Training Programs (80% Digital + 20% Physical Mentoring)",
        "Free ATS Resume Score Checker & LinkedIn Optimizer",
        "Live Voice Mock Interview Lab in 9 Indian Languages",
        "100% Free Employer Job Posting & Campus Placement Hub",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: meta.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${cleanBase}${crumb.path === "/" ? "/" : crumb.path}`,
      })),
    },
  ];

  // Course Schema
  if (meta.courseSlug) {
    const course = SEO_COURSES.find((c) => c.slug === meta.courseSlug);
    if (course) {
      graph.push({
        "@type": "Course",
        name: course.title,
        description: course.summary,
        url: `${cleanBase}/courses/${course.slug}`,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          sameAs: cleanBase,
        },
        educationalCredentialAwarded: "Verified Industry Certification with Audited Study Hours",
        timeRequired: course.duration,
        inLanguage: meta.htmlLang,
        offers: {
          "@type": "Offer",
          category: "Paid",
          priceCurrency: "INR",
          price: course.feeINR,
          availability: "https://schema.org/InStock",
          url: `${cleanBase}/courses/${course.slug}`,
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "blended",
          courseWorkload: "PT180H",
        },
      });
    }
  } else if (meta.basePathWithoutLang === "/" || meta.basePathWithoutLang === "/courses") {
    graph.push({
      "@type": "ItemList",
      name: "Recruits.org.in 10 Verified Placement Training Programs",
      numberOfItems: SEO_COURSES.length,
      itemListElement: SEO_COURSES.map((course, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Course",
          name: course.title,
          description: course.summary,
          url: `${cleanBase}/courses/${course.slug}`,
          provider: {
            "@type": "Organization",
            name: SITE_NAME,
            sameAs: cleanBase,
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: course.feeINR,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    });
  }

  // Google for Jobs JobPosting Schema
  if (
    meta.basePathWithoutLang === "/" ||
    meta.basePathWithoutLang === "/jobs" ||
    meta.basePathWithoutLang === "/govt-jobs" ||
    meta.citySlug ||
    meta.examSlug ||
    meta.categorySlug
  ) {
    const cityEntry = meta.citySlug ? PAN_INDIA_CITIES.find((c) => c.slug === meta.citySlug) : undefined;
    const categoryEntry = meta.categorySlug
      ? PAN_INDIA_JOB_CATEGORIES.find((c) => c.slug === meta.categorySlug)
      : undefined;

    const jobsToEmit = cityEntry
      ? [
          {
            title: `Fresher & Experienced Hiring Drive — ${cityEntry.name} (${cityEntry.highlights})`,
            company: "Verified MNC & Enterprise Employers on Recruits.org.in",
            city: cityEntry.name,
            state: cityEntry.state,
            minSalaryINR: 500000,
            maxSalaryINR: 1800000,
            employmentType: "FULL_TIME",
            description: `Direct hiring openings in ${cityEntry.name}, ${cityEntry.state} across ${cityEntry.highlights}. Zero middleman fees on Recruits.org.in.`,
          },
          ...FEATURED_PAN_INDIA_JOB_POSTINGS.slice(0, 2),
        ]
      : categoryEntry
      ? [
          {
            title: `${categoryEntry.label} — Pan-India Verified Hiring 2026`,
            company: "Verified Indian Employers & Govt Recruitment Network",
            city: "Bengaluru",
            state: "India",
            minSalaryINR: 450000,
            maxSalaryINR: 1800000,
            employmentType: "FULL_TIME",
            description: categoryEntry.description,
          },
          ...FEATURED_PAN_INDIA_JOB_POSTINGS.slice(0, 2),
        ]
      : FEATURED_PAN_INDIA_JOB_POSTINGS;

    for (const job of jobsToEmit) {
      graph.push({
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: todayIso,
        validThrough: validThroughIso,
        employmentType: job.employmentType,
        directApply: true,
        ...(meta.categorySlug === "work-from-home"
          ? {
              jobLocationType: "TELECOMMUTE",
              applicantLocationRequirements: { "@type": "Country", name: "India" },
            }
          : {}),
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
          sameAs: cleanBase,
          logo: ogImageUrl,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressRegion: job.state,
            addressCountry: "IN",
          },
        },
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.minSalaryINR,
            maxValue: job.maxSalaryINR,
            unitText: "YEAR",
          },
        },
      });
    }
  }

  // FAQPage Schema
  if (
    meta.basePathWithoutLang === "/" ||
    meta.basePathWithoutLang === "/jobs" ||
    meta.basePathWithoutLang === "/govt-jobs" ||
    meta.basePathWithoutLang === "/courses" ||
    meta.canonicalPath === "/recruiters"
  ) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: PAN_INDIA_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function escapeHtmlAttr(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeJsonLdString(obj: Record<string, any>): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export function injectSeoIntoHtml(
  rawHtml: string,
  pathname: string,
  baseUrl: string = CANONICAL_DOMAIN
): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const meta = resolveSeoRoute(pathname);
  const canonicalUrl = `${cleanBase}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`;
  const ogImageUrl = `${cleanBase}${OG_IMAGE_PATH}`;
  const jsonLd = safeJsonLdString(buildStructuredDataGraph(meta, cleanBase));
  const alternates = buildHreflangAlternates(meta, cleanBase);

  const titleEsc = escapeHtmlAttr(meta.title);
  const descEsc = escapeHtmlAttr(meta.description);
  const keywordsEsc = escapeHtmlAttr(meta.keywords.join(", "));
  const canonicalEsc = escapeHtmlAttr(canonicalUrl);
  const ogImgEsc = escapeHtmlAttr(ogImageUrl);

  const hreflangTags = alternates
    .map((a) => `    <link rel="alternate" hreflang="${escapeHtmlAttr(a.hreflang)}" href="${escapeHtmlAttr(a.href)}" />`)
    .join("\n");

  const seoHeadBlock = `<!-- RECRUITS_SEO_START -->
    <title>${titleEsc}</title>
    <meta name="description" content="${descEsc}" />
    <meta name="keywords" content="${keywordsEsc}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="${escapeHtmlAttr(ORG_NAME)}" />
    <meta name="geo.region" content="IN" />
    <meta name="geo.placename" content="India" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="canonical" href="${canonicalEsc}" />
${hreflangTags}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtmlAttr(SITE_NAME)}" />
    <meta property="og:locale" content="${escapeHtmlAttr(meta.ogLocale)}" />
    <meta property="og:url" content="${canonicalEsc}" />
    <meta property="og:title" content="${titleEsc}" />
    <meta property="og:description" content="${descEsc}" />
    <meta property="og:image" content="${ogImgEsc}" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta property="og:image:alt" content="${titleEsc}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${titleEsc}" />
    <meta name="twitter:description" content="${descEsc}" />
    <meta name="twitter:image" content="${ogImgEsc}" />
    <meta name="twitter:image:alt" content="${titleEsc}" />
    <script id="recruits-seo-jsonld" type="application/ld+json">${jsonLd}</script>
    <!-- RECRUITS_SEO_END -->`;

  let output = rawHtml.replace(/<html\s+lang="[^"]*"/i, `<html lang="${escapeHtmlAttr(meta.htmlLang)}"`);

  const markerRegex = /<!-- RECRUITS_SEO_START -->[\s\S]*?<!-- RECRUITS_SEO_END -->/;
  if (markerRegex.test(output)) {
    output = output.replace(markerRegex, seoHeadBlock);
  } else {
    output = output.replace("</head>", `${seoHeadBlock}\n  </head>`);
  }

  return output;
}

export function generateRobotsTxt(baseUrl: string = CANONICAL_DOMAIN): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return [
    "# Robots.txt for Recruits.org.in — Pan-India & 9-Language Jobs, Verified Training & Free Hiring",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /ws/",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: LinkedInBot",
    "Allow: /",
    "",
    "User-agent: WhatsApp",
    "Allow: /",
    "",
    `Sitemap: ${cleanBase}/sitemap.xml`,
    "",
  ].join("\n");
}

export function generateSitemapXml(
  baseUrl: string = CANONICAL_DOMAIN,
  liveRecruiterJobs: Array<{ id?: string; title?: string; location?: string }> = []
): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const lastmod = new Date().toISOString().split("T")[0];

  const entries: Array<{ loc: string; changefreq: string; priority: string }> = [
    { loc: `${cleanBase}/`, changefreq: "daily", priority: "1.0" },
  ];

  // Core Platform & Free Tools
  for (const r of CORE_ENGINE_ROUTES) {
    entries.push({
      loc: `${cleanBase}${r.path}`,
      changefreq: r.path.includes("job") ? "daily" : "weekly",
      priority:
        r.path === "/jobs" || r.path === "/govt-jobs" || r.path === "/courses" || r.path === "/recruiters"
          ? "0.95"
          : "0.85",
    });
  }

  // 8 Regional Language Hubs x 4 Core Pages = 32 Multilingual Pan-India URLs
  for (const hub of REGIONAL_LANGUAGE_HUBS) {
    entries.push({ loc: `${cleanBase}/${hub.code}`, changefreq: "daily", priority: "0.95" });
    entries.push({ loc: `${cleanBase}/${hub.code}/jobs`, changefreq: "daily", priority: "0.90" });
    entries.push({ loc: `${cleanBase}/${hub.code}/govt-jobs`, changefreq: "daily", priority: "0.90" });
    entries.push({ loc: `${cleanBase}/${hub.code}/courses`, changefreq: "weekly", priority: "0.85" });
  }

  // 10 Verified Placement Courses
  for (const course of SEO_COURSES) {
    entries.push({
      loc: `${cleanBase}/courses/${course.slug}`,
      changefreq: "weekly",
      priority: "0.90",
    });
  }

  // 10 High-Volume Qualification & WFH Category Hubs
  for (const cat of PAN_INDIA_JOB_CATEGORIES) {
    entries.push({
      loc: `${cleanBase}/jobs/${cat.slug}`,
      changefreq: "daily",
      priority: "0.90",
    });
  }

  // 24 Major Indian Cities
  for (const city of PAN_INDIA_CITIES) {
    entries.push({
      loc: `${cleanBase}/jobs/${city.slug}`,
      changefreq: "daily",
      priority: "0.85",
    });
  }

  // 16 Central & State Govt Exam Hubs
  for (const exam of PAN_INDIA_GOVT_EXAMS) {
    entries.push({
      loc: `${cleanBase}/govt-jobs/${exam.slug}`,
      changefreq: "daily",
      priority: "0.85",
    });
  }

  // Ensure any freshly posted city hubs from recruiter jobs are also represented via /jobs?q=... if needed
  const seen = new Set(entries.map((e) => e.loc));
  for (const j of liveRecruiterJobs.slice(0, 25)) {
    const locStr = String(j?.location || "").toLowerCase();
    for (const city of PAN_INDIA_CITIES) {
      if (locStr.includes(city.name.toLowerCase())) {
        const u = `${cleanBase}/jobs/${city.slug}`;
        if (!seen.has(u)) {
          seen.add(u);
          entries.push({ loc: u, changefreq: "daily", priority: "0.85" });
        }
      }
    }
  }

  const urlNodes = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeHtmlAttr(e.loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>\n`;
}
