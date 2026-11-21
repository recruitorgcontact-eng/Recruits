import { LanguageCode } from "../types";

export interface SpeechOptions {
  text: string;
  language?: LanguageCode;
  pitchOverride?: number;
  rateOverride?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface IndianLocaleVoiceConfig {
  locale: string;
  fallbackLocales: string[];
  pitch: number;
  questionPitchBoost: number;
  greetingPitchBoost: number;
  rate: number;
  neuralPlaybackRate: number;
  volume: number;
  preferredVoiceKeywords: string[];
  culturalStylePrompt: string;
}

/**
 * Culturally nuanced Indian locale speech configuration for Arohi Career Coach.
 * Tuned specifically for Indian English (en-IN), Hindi (hi-IN), Odia (or-IN),
 * and regional Indian languages with syllable-timed pacing and warm feminine pitch.
 */
export const INDIAN_SPEECH_LOCALE_CONFIG: Record<LanguageCode, IndianLocaleVoiceConfig> = {
  or: {
    locale: "or-IN",
    fallbackLocales: ["or-IN", "bn-IN", "hi-IN", "en-IN"],
    pitch: 1.06, // Warm, natural Odia elder-sister (Didi/Apa) timbre
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.96, // Smooth, natural Odia conversational cadence
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: [
      "subhasini",
      "odia",
      "or-in",
      "oriya",
      "tanishaa",
      "swara",
      "neerja",
      "aditi",
      "veena",
    ],
    culturalStylePrompt:
      "Locale: or-IN (Odia, Odisha India). Pitch: +6% warm young Odia female timbre. Rate: 0.96x natural, melodic Odia conversational rhythm with soft dental/retroflex articulation, affectionate elder-sister (Didi/Apa) warmth, and natural pauses after 'Namaskar' and 'Nischaya'.",
  },
  hi: {
    locale: "hi-IN",
    fallbackLocales: ["hi-IN", "mr-IN", "en-IN"],
    pitch: 1.05, // Expressive, natural young Indian female Hindi voice
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.98, // Balanced conversational Hindi pacing
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: [
      "swara",
      "aditi",
      "google हिन्दी",
      "kalpana",
      "lekha",
      "hi-in",
      "neerja",
      "raveena",
      "veena",
    ],
    culturalStylePrompt:
      "Locale: hi-IN (Hindi, India). Pitch: +5% warm, expressive young Indian female mentor voice. Rate: 0.98x natural conversational Hindi cadence with respectful warmth on 'Namaste ji', 'Bilkul', and 'Zaroor'.",
  },
  en: {
    locale: "en-IN",
    fallbackLocales: ["en-IN", "hi-IN"],
    pitch: 1.04, // Bright, articulate young Indian professional English pitch
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.98, // Crisp, syllable-timed Indian English rhythm
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: [
      "neerja",
      "raveena",
      "veena",
      "aditi",
      "heera",
      "kavya",
      "ananya",
      "google english (india)",
      "india",
      "en-in",
    ],
    culturalStylePrompt:
      "Locale: en-IN (Indian English). Pitch: +4% bright, relatable young Indian female career coach. Rate: 0.98x natural syllable-timed Indian English prosody with warm inflection on 'Namaste', 'definitely', and 'all the very best'.",
  },
  bn: {
    locale: "bn-IN",
    fallbackLocales: ["bn-IN", "hi-IN", "en-IN"],
    pitch: 1.06,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97,
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: ["tanishaa", "bengali", "bn-in", "swara", "neerja"],
    culturalStylePrompt:
      "Locale: bn-IN (Bengali, India). Pitch: +6% sweet, cultured young Indian female mentor voice. Rate: 0.97x warm Bengali cadence.",
  },
  te: {
    locale: "te-IN",
    fallbackLocales: ["te-IN", "en-IN", "hi-IN"],
    pitch: 1.05,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97,
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: ["shruti", "telugu", "te-in", "neerja", "veena"],
    culturalStylePrompt:
      "Locale: te-IN (Telugu, India). Pitch: +5% warm young Indian female mentor voice. Rate: 0.97x clear, melodic Telugu cadence.",
  },
  ta: {
    locale: "ta-IN",
    fallbackLocales: ["ta-IN", "en-IN", "hi-IN"],
    pitch: 1.05,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97,
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: ["pallavi", "valluvar", "tamil", "ta-in", "neerja", "veena"],
    culturalStylePrompt:
      "Locale: ta-IN (Tamil, India). Pitch: +5% warm, respectful young Indian female mentor voice. Rate: 0.97x clear Tamil cadence.",
  },
  mr: {
    locale: "mr-IN",
    fallbackLocales: ["mr-IN", "hi-IN", "en-IN"],
    pitch: 1.05,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97,
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: ["aarohi", "marathi", "mr-in", "swara", "neerja"],
    culturalStylePrompt:
      "Locale: mr-IN (Marathi, India). Pitch: +5% warm young Indian female mentor voice. Rate: 0.97x natural Marathi cadence.",
  },
  gu: {
    locale: "gu-IN",
    fallbackLocales: ["gu-IN", "hi-IN", "en-IN"],
    pitch: 1.05,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97,
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: ["dhwani", "gujarati", "gu-in", "swara", "neerja"],
    culturalStylePrompt:
      "Locale: gu-IN (Gujarati, India). Pitch: +5% cheerful young Indian female mentor voice. Rate: 0.97x natural Gujarati cadence.",
  },
  kn: {
    locale: "kn-IN",
    fallbackLocales: ["kn-IN", "en-IN", "hi-IN"],
    pitch: 1.05,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97,
    neuralPlaybackRate: 1.0,
    volume: 1.0,
    preferredVoiceKeywords: ["sapna", "kannada", "kn-in", "neerja", "veena"],
    culturalStylePrompt:
      "Locale: kn-IN (Kannada, India). Pitch: +5% warm, articulate young Indian female mentor voice. Rate: 0.97x clear Kannada cadence.",
  },
};

const LANGUAGE_VOICE_MAP: Record<LanguageCode, string> = {
  en: INDIAN_SPEECH_LOCALE_CONFIG.en.locale,
  hi: INDIAN_SPEECH_LOCALE_CONFIG.hi.locale,
  or: INDIAN_SPEECH_LOCALE_CONFIG.or.locale,
  ta: INDIAN_SPEECH_LOCALE_CONFIG.ta.locale,
  te: INDIAN_SPEECH_LOCALE_CONFIG.te.locale,
  kn: INDIAN_SPEECH_LOCALE_CONFIG.kn.locale,
  mr: INDIAN_SPEECH_LOCALE_CONFIG.mr.locale,
  gu: INDIAN_SPEECH_LOCALE_CONFIG.gu.locale,
  bn: INDIAN_SPEECH_LOCALE_CONFIG.bn.locale,
};

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let activeSpeechRequestId = 0;
let cachedBrowserVoices: SpeechSynthesisVoice[] = [];
const clientTtsCache = new Map<string, { audioBase64: string; mimeType: string }>();

// Preload browser voices asynchronously so Indian locale voices (en-IN, hi-IN, or-IN) are ready immediately
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const loadVoices = () => {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) {
      cachedBrowserVoices = v;
    }
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const isOdiaText = (text: string): boolean => {
  if (!text) return false;
  const odiaScriptRegex = /[\u0B00-\u0B7F]/;
  const odiaPhoneticRegex =
    /\b(namaskar|mote|darkar|chakiri|kemiti|achanti|karichi|karibi|odisha|orisha|odia|khobar|kisa|kana|ghara|mu|aapan|apana|dhanyabad|nischaya|chinta|kuhantu|kuha|kipari|kebe|kou|didi|apa|pai|katha|bisayare|sahajya|bhal)\b/i;
  return odiaScriptRegex.test(text) || odiaPhoneticRegex.test(text);
};

export const isHindiText = (text: string): boolean => {
  if (!text) return false;
  const hindiScriptRegex = /[\u0900-\u097F]/;
  const hindiPhoneticRegex =
    /\b(namaste|mujhe|mera|meri|mere|kya|kaise|kaisi|chahiye|naukri|sarkari|taiyari|batao|bataiye|bataye|madad|karna|karen|karu|hai|hain|mein|aur|accha|bahut|dhanyawad|shukriya|zaroor|bilkul|aap|hum|kahan|kab|kyun|koi|abhi|milegi|milega|padhai|pariksha)\b/i;
  return hindiScriptRegex.test(text) || hindiPhoneticRegex.test(text);
};

export const detectIndianLanguageFromText = (
  text: string,
  fallbackLanguage: LanguageCode = "en"
): LanguageCode => {
  if (!text) return fallbackLanguage;
  const trimmed = text.trim();

  // 1. Explicit language switch requests
  if (/\b(speak in odia|talk in odia|odia re|oriya|ଓଡ଼ିଆରେ|ओड़िया में)\b/i.test(trimmed)) return "or";
  if (/\b(speak in hindi|talk in hindi|hindi mein|हिंदी में|हिन्दी में)\b/i.test(trimmed)) return "hi";
  if (/\b(speak in english|talk in english|in english please|इंग्लिश में|ଇଂରାଜୀରେ)\b/i.test(trimmed)) return "en";

  // 2. Native Indian scripts
  if (/[\u0B00-\u0B7F]/.test(trimmed)) return "or";
  if (/[\u0980-\u09FF]/.test(trimmed)) return "bn";
  if (/[\u0C00-\u0C7F]/.test(trimmed)) return "te";
  if (/[\u0B80-\u0BFF]/.test(trimmed)) return "ta";
  if (/[\u0A80-\u0AFF]/.test(trimmed)) return "gu";
  if (/[\u0C80-\u0CFF]/.test(trimmed)) return "kn";
  if (/[\u0900-\u097F]/.test(trimmed)) {
    if (/\b(आहे|कसे|तुम्ही|मला|माझ्या|सांगा|करू)\b/.test(trimmed) || fallbackLanguage === "mr") {
      return "mr";
    }
    return "hi";
  }

  // 3. Spoken / Romanized Odia or Hindi
  if (isOdiaText(trimmed)) return "or";
  if (isHindiText(trimmed)) return "hi";

  // 4. Clear English sentence check (if user switched back to English during a Hindi/Odia session)
  const englishWordsRegex =
    /\b(what|how|when|where|which|can|could|should|would|please|tell|help|give|show|prepare|job|jobs|resume|interview|salary|course|courses|exam|company|about|my|for|the|in|is|are)\b/i;
  const words = trimmed.split(/\s+/);
  const englishMatches = words.filter((w) => englishWordsRegex.test(w)).length;
  if (englishMatches >= 2 && /^[a-zA-Z0-9\s.,?!'"-]+$/.test(trimmed)) {
    return "en";
  }

  return fallbackLanguage;
};

/**
 * Normalizes markdown, Indian currency (₹ / LPA / Crores), and exam/company acronyms
 * into native Odia script (when language === 'or'), native Devanagari (when language === 'hi'),
 * or Indian English phonetics so TTS never switches into a robotic cross-script reader.
 */
const applyIndianCulturalProsody = (rawText: string, language: LanguageCode): string => {
  let cleaned = (rawText || "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_#`~]+/g, "")
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
      ""
    )
    .replace(/•/g, ", ");

  if (language === "or") {
    cleaned = cleaned
      .replace(/recruits\.org\.in/gi, "ରିକ୍ରୁଟ୍ସ ଡଟ୍ ଓଆରଜି ଡଟ୍ ଇନ୍")
      .replace(/arohiai\.com/gi, "ଆରୋହୀ ଏଆଇ ଡଟ୍ କମ୍")
      .replace(/\bOPSC\b/gi, "ଓପିଏସସି")
      .replace(/\bOSSC\b/gi, "ଓଏସଏସସି")
      .replace(/\bOSSSC\b/gi, "ଓଏସଏସଏସସି")
      .replace(/\bUPSC\b/gi, "ୟୁପିଏସସି")
      .replace(/\bSSC\b/gi, "ଏସଏସସି")
      .replace(/\bIBPS\b/gi, "ଆଇବିପିଏସ୍")
      .replace(/\bSBI\b/gi, "ଏସବିଆଇ")
      .replace(/\bRRB\b/gi, "ଆରଆରବି")
      .replace(/\bTCS\b/gi, "ଟିସିଏସ୍")
      .replace(/\bInfosys\b/gi, "ଇନଫୋସିସ୍")
      .replace(/\bWipro\b/gi, "ୱିପ୍ରୋ")
      .replace(/\bHDFC\s*Bank\b/gi, "ଏଚଡିଏଫସି ବ୍ୟାଙ୍କ୍")
      .replace(/\bHDFC\b/gi, "ଏଚଡିଏଫସି")
      .replace(/\bReliance\b/gi, "ରିଲାଏନ୍ସ")
      .replace(/\bTech\s*Mahindra\b/gi, "ଟେକ୍ ମହିନ୍ଦ୍ରା")
      .replace(/\bNALCO\b/gi, "ନାଲକୋ")
      .replace(/\bOMC\b/gi, "ଓଏମସି")
      .replace(/\bPSU\b/gi, "ପିଏସୟୁ")
      .replace(/\bMNC\b/gi, "ଏମଏନସି")
      .replace(/\bATS\b/gi, "ଏଟିଏସ୍")
      .replace(/\bAI\b/gi, "ଏଆଇ")
      .replace(/\bB\.?Tech\b/gi, "ବି-ଟେକ୍")
      .replace(/\bM\.?Tech\b/gi, "ଏମ୍-ଟେକ୍")
      .replace(/₹\s*(\d+(?:\.\d+)?)\s*LPA/gi, "$1 ଲକ୍ଷ ଟଙ୍କା ବାର୍ଷିକ")
      .replace(/\b(\d+(?:\.\d+)?)\s*LPA\b/gi, "$1 ଲକ୍ଷ ଟଙ୍କା ବାର୍ଷିକ")
      .replace(/₹\s*([\d,]+)/g, "$1 ଟଙ୍କା")
      .replace(/ନମସ୍କାର\s*!*/g, "ନମସ୍କାର, ");
  } else if (language === "hi") {
    cleaned = cleaned
      .replace(/recruits\.org\.in/gi, "रिक्रूट्स डॉट ओआरजी डॉट इन")
      .replace(/arohiai\.com/gi, "आरोही एआई डॉट कॉम")
      .replace(/\bOPSC\b/gi, "ओपीएससी")
      .replace(/\bOSSC\b/gi, "ओएसएससी")
      .replace(/\bUPSC\b/gi, "यूपीएससी")
      .replace(/\bSSC\b/gi, "एसएससी")
      .replace(/\bIBPS\b/gi, "आईबीपीएस")
      .replace(/\bSBI\b/gi, "एसबीआई")
      .replace(/\bRRB\b/gi, "आरआरबी")
      .replace(/\bTCS\b/gi, "टीसीएस")
      .replace(/\bInfosys\b/gi, "इन्फोसिस")
      .replace(/\bWipro\b/gi, "विप्रो")
      .replace(/\bHDFC\s*Bank\b/gi, "एचडीएफसी बैंक")
      .replace(/\bHDFC\b/gi, "एचडीएफसी")
      .replace(/\bReliance\b/gi, "रिलायंस")
      .replace(/\bTech\s*Mahindra\b/gi, "टेक महिंद्रा")
      .replace(/\bNALCO\b/gi, "नालको")
      .replace(/\bPSU\b/gi, "पीएसयू")
      .replace(/\bMNC\b/gi, "एमएनसी")
      .replace(/\bATS\b/gi, "एटीएस")
      .replace(/\bAI\b/gi, "एआई")
      .replace(/\bB\.?Tech\b/gi, "बीटेक")
      .replace(/\bM\.?Tech\b/gi, "एमटेक")
      .replace(/₹\s*(\d+(?:\.\d+)?)\s*LPA/gi, "$1 लाख रुपये सालाना")
      .replace(/\b(\d+(?:\.\d+)?)\s*LPA\b/gi, "$1 लाख रुपये सालाना")
      .replace(/₹\s*([\d,]+)/g, "$1 रुपये")
      .replace(/नमस्ते जी\s*!*/g, "नमस्ते जी, ")
      .replace(/नमस्ते\s*!*/g, "नमस्ते, ");
  } else {
    cleaned = cleaned
      .replace(/recruits\.org\.in/gi, "Recruits dot org dot in")
      .replace(/arohiai\.com/gi, "Arohi A I dot com")
      .replace(/₹\s*(\d+(?:\.\d+)?)\s*-\s*₹?\s*(\d+(?:\.\d+)?)\s*LPA/gi, "$1 to $2 Lakhs Per Annum")
      .replace(/₹\s*(\d+(?:\.\d+)?)\s*LPA/gi, "$1 Lakhs Per Annum")
      .replace(/\b(\d+(?:\.\d+)?)\s*LPA\b/gi, "$1 Lakhs Per Annum")
      .replace(/₹\s*([\d,]+)/g, "$1 Rupees")
      .replace(/\bB\.?E\.?\s*\/\s*B\.?Tech\b/gi, "B E or B Tech")
      .replace(/\bB\.?Tech\b/gi, "B Tech")
      .replace(/\bM\.?Tech\b/gi, "M Tech")
      .replace(/\bOPSC\b/g, "O P S C")
      .replace(/\bOSSC\b/g, "O S S C")
      .replace(/\bUPSC\b/g, "U P S C")
      .replace(/\bIBPS\b/g, "I B P S")
      .replace(/\bNamaste\s*&\s*Hello\s*!*/gi, "Namaste, ")
      .replace(/\bNamaste\s*!*/gi, "Namaste, ")
      .replace(/\bNamaskar\s*!*/gi, "Namaskar, ");
  }

  return cleaned.replace(/\s+/g, " ").trim();
};

const selectBestIndianVoice = (
  voices: SpeechSynthesisVoice[],
  localeConfig: IndianLocaleVoiceConfig
): SpeechSynthesisVoice | undefined => {
  if (!voices || voices.length === 0) return undefined;

  const targetLocaleLower = localeConfig.locale.toLowerCase();
  const targetLangPrefix = targetLocaleLower.split("-")[0];

  // 1. Priority match: voice matching target locale/prefix AND one of the preferred Indian female voice keywords
  for (const keyword of localeConfig.preferredVoiceKeywords) {
    const matched = voices.find((v) => {
      const name = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase().replace("_", "-");
      const langMatches = vLang === targetLocaleLower || vLang.startsWith(targetLangPrefix);
      return langMatches && name.includes(keyword);
    });
    if (matched) return matched;
  }

  // 2. Neural / Natural voice in the exact Indian locale (e.g., or-IN, hi-IN, en-IN)
  const exactLocaleNeural = voices.find((v) => {
    const name = v.name.toLowerCase();
    const vLang = v.lang.toLowerCase().replace("_", "-");
    const langMatches = vLang === targetLocaleLower || vLang.startsWith(targetLangPrefix);
    const isNeural =
      name.includes("natural") || name.includes("online") || name.includes("neural") || name.includes("google");
    return langMatches && isNeural;
  });
  if (exactLocaleNeural) return exactLocaleNeural;

  // 3. Any voice in the fallback Indian locales list with preferred Indian female keywords
  for (const fbLocale of localeConfig.fallbackLocales) {
    const fbLower = fbLocale.toLowerCase();
    const fbPrefix = fbLower.split("-")[0];
    for (const keyword of localeConfig.preferredVoiceKeywords) {
      const matched = voices.find((v) => {
        const name = v.name.toLowerCase();
        const vLang = v.lang.toLowerCase().replace("_", "-");
        return (vLang === fbLower || vLang.startsWith(fbPrefix)) && name.includes(keyword);
      });
      if (matched) return matched;
    }
    const anyFbLocale = voices.find((v) => {
      const vLang = v.lang.toLowerCase().replace("_", "-");
      return vLang === fbLower || vLang.startsWith(fbPrefix);
    });
    if (anyFbLocale) return anyFbLocale;
  }

  // 4. Final fallback: any Indian regional/English voice (-IN)
  return voices.find((v) => v.lang.toLowerCase().replace("_", "-").endsWith("-in"));
};

const playBase64Audio = async (
  audioBase64: string,
  mimeType: string,
  localeConfig: IndianLocaleVoiceConfig,
  fallbackOptions: SpeechOptions,
  requestId: number
) => {
  if (requestId !== activeSpeechRequestId) return;

  const binaryString = window.atob(audioBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
  const audioUrl = URL.createObjectURL(blob);
  currentObjectUrl = audioUrl;

  const audio = new Audio(audioUrl);
  currentAudioElement = audio;

  const desiredRate = fallbackOptions.rateOverride ?? localeConfig.neuralPlaybackRate;
  audio.playbackRate = Math.max(0.9, Math.min(1.12, desiredRate));

  audio.onplay = () => {
    if (requestId !== activeSpeechRequestId) {
      stopSpeech();
      return;
    }
    fallbackOptions.onStart?.();
  };

  audio.onended = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    currentAudioElement = null;
    if (requestId === activeSpeechRequestId) {
      fallbackOptions.onEnd?.();
    }
  };

  audio.onerror = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    currentAudioElement = null;
    if (requestId === activeSpeechRequestId) {
      speakWebSpeech(fallbackOptions, requestId);
    }
  };

  await audio.play();
};

export const speakText = async ({
  text,
  language = "en",
  pitchOverride,
  rateOverride,
  onStart,
  onEnd,
  onError,
}: SpeechOptions) => {
  stopSpeech();
  const requestId = ++activeSpeechRequestId;

  const detectedLanguage: LanguageCode = detectIndianLanguageFromText(text, language);
  const localeConfig =
    INDIAN_SPEECH_LOCALE_CONFIG[detectedLanguage] || INDIAN_SPEECH_LOCALE_CONFIG.en;

  const cleanedText = applyIndianCulturalProsody(text, detectedLanguage);
  if (!cleanedText) {
    onEnd?.();
    return;
  }

  const cacheKey = `${localeConfig.locale}|${cleanedText.slice(0, 320)}`;

  const cachedAudio = clientTtsCache.get(cacheKey);
  if (cachedAudio) {
    try {
      await playBase64Audio(
        cachedAudio.audioBase64,
        cachedAudio.mimeType,
        localeConfig,
        {
          text: cleanedText,
          language: detectedLanguage,
          pitchOverride,
          rateOverride,
          onStart,
          onEnd,
          onError,
        },
        requestId
      );
      return;
    } catch (_err) {
      // Fall through if autoplay fails
    }
  }

  // Request Server Neural TTS (Gemini 3.8 TTS + Cloud Indian Neural TTS fallback)
  try {
    const res = await fetch("/api/ai/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: cleanedText,
        voice: "Zephyr",
        language: detectedLanguage,
        locale: localeConfig.locale,
        pitch: pitchOverride ?? localeConfig.pitch,
        rate: rateOverride ?? localeConfig.rate,
        stylePrompt: "Warm, melodious, friendly, and expressive conversational speaker",
      }),
    });

    // If user barged in while TTS was loading, abort immediately
    if (requestId !== activeSpeechRequestId) {
      return;
    }

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64 && requestId === activeSpeechRequestId) {
        const mimeType = data.mimeType || "audio/wav";
        if (clientTtsCache.size < 100) {
          clientTtsCache.set(cacheKey, { audioBase64: data.audioBase64, mimeType });
        }
        await playBase64Audio(
          data.audioBase64,
          mimeType,
          localeConfig,
          {
            text: cleanedText,
            language: detectedLanguage,
            pitchOverride,
            rateOverride,
            onStart,
            onEnd,
            onError,
          },
          requestId
        );
        return;
      }
    }
  } catch (_err) {
    // Seamless fallback to Indian neural browser voice
  }

  if (requestId !== activeSpeechRequestId) {
    return;
  }

  // Fallback to Web Speech API with continuous single-utterance prosody (no artificial gaps)
  speakWebSpeech(
    {
      text: cleanedText,
      language: detectedLanguage,
      pitchOverride,
      rateOverride,
      onStart,
      onEnd,
      onError,
    },
    requestId
  );
};

// Web Audio API Chime Sound Generators for Super Natural Call Feeling
export const playCallChime = (type: "ring" | "connect" | "disconnect") => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "ring") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "connect") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.4);
    } else if (type === "disconnect") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    console.warn("Audio Context Sound Effect notice:", err);
  }
};

const speakWebSpeech = (
  {
    text,
    language = "en",
    pitchOverride,
    rateOverride,
    onStart,
    onEnd,
    onError,
  }: SpeechOptions,
  requestId: number
) => {
  if (!("speechSynthesis" in window)) {
    onError?.("Speech synthesis not supported in this browser.");
    onEnd?.();
    return;
  }

  try {
    if (requestId !== activeSpeechRequestId) return;

    const detectedLanguage = detectIndianLanguageFromText(text, language);
    const localeConfig =
      INDIAN_SPEECH_LOCALE_CONFIG[detectedLanguage] || INDIAN_SPEECH_LOCALE_CONFIG.en;
    const cleanText = applyIndianCulturalProsody(text, detectedLanguage);

    const voices =
      cachedBrowserVoices.length > 0
        ? cachedBrowserVoices
        : window.speechSynthesis.getVoices();
    const chosenVoice = selectBestIndianVoice(voices, localeConfig);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    utterance.lang = chosenVoice?.lang || localeConfig.locale;
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    const computedPitch = pitchOverride ?? localeConfig.pitch;
    const computedRate = rateOverride ?? localeConfig.rate;

    utterance.pitch = Number(computedPitch.toFixed(2));
    utterance.rate = Number(computedRate.toFixed(2));
    utterance.volume = localeConfig.volume;

    utterance.onstart = () => {
      if (requestId !== activeSpeechRequestId) {
        window.speechSynthesis.cancel();
        return;
      }
      onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      if (requestId === activeSpeechRequestId) {
        onEnd?.();
      }
    };

    utterance.onerror = (event) => {
      currentUtterance = null;
      if (requestId === activeSpeechRequestId) {
        onError?.(event);
        onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Speech Synthesis failure:", err);
    onError?.(err);
    onEnd?.();
  }
};

export const isCurrentlySpeaking = (): boolean => {
  if (currentAudioElement && !currentAudioElement.paused) {
    return true;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking) {
    return true;
  }
  return false;
};

export const stopSpeech = () => {
  activeSpeechRequestId += 1;
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
};

export type VoiceInputCallback = (
  text: string,
  isFinal?: boolean,
  details?: {
    finalChunk: string;
    interimChunk: string;
    fullSessionTranscript: string;
  }
) => void;

// Continuous Speech Recognition helper with instant Barge-In support
export const listenToVoiceInput = (
  language: LanguageCode,
  onResult: VoiceInputCallback,
  onError?: (err: string) => void,
  onEnd?: () => void,
  onSpeechStart?: () => void
) => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Voice speech recognition is not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = LANGUAGE_VOICE_MAP[language] || "en-IN";

  recognition.onspeechstart = () => {
    // Instant Barge-In: Pause/stop Arohi immediately as soon as user starts speaking
    stopSpeech();
    onSpeechStart?.();
  };

  recognition.onsoundstart = () => {
    if (isCurrentlySpeaking()) {
      stopSpeech();
      onSpeechStart?.();
    }
  };

  recognition.onresult = (event: any) => {
    // Immediately interrupt Arohi if she is speaking when user words are recognized
    stopSpeech();
    onSpeechStart?.();

    let interimChunk = "";
    let finalChunk = "";
    let fullSessionTranscript = "";

    for (let i = 0; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      fullSessionTranscript += piece + (event.results[i].isFinal ? " " : "");
      if (i >= event.resultIndex) {
        if (event.results[i].isFinal) {
          finalChunk += piece + " ";
        } else {
          interimChunk += piece;
        }
      }
    }

    const latestSegment = (finalChunk || interimChunk).trim();
    const cleanedFull = fullSessionTranscript.replace(/\s+/g, " ").trim();
    const hasFinal = Boolean(finalChunk.trim());

    if (latestSegment || cleanedFull) {
      onResult(latestSegment || cleanedFull, hasFinal, {
        finalChunk: finalChunk.trim(),
        interimChunk: interimChunk.trim(),
        fullSessionTranscript: cleanedFull,
      });
    }
  };

  recognition.onerror = (event: any) => {
    onError?.(event.error || "Speech recognition error");
  };

  recognition.onend = () => {
    onEnd?.();
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn("Speech recognition start warning:", err);
  }

  return recognition;
};
