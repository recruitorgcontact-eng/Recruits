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
    fallbackLocales: ["or-IN", "hi-IN", "bn-IN", "en-IN"],
    pitch: 1.08, // Warm, melodic Odia elder-sister (Didi/Apa) timbre
    questionPitchBoost: 0.04,
    greetingPitchBoost: 0.03,
    rate: 0.94, // Slightly gentler cadence for clear Odia vowel & retroflex articulation
    neuralPlaybackRate: 0.97,
    volume: 1.0,
    preferredVoiceKeywords: [
      "subhasini",
      "odia",
      "or-in",
      "oriya",
      "swara",
      "tanishaa",
      "neerja",
      "aditi",
      "veena",
    ],
    culturalStylePrompt:
      "Locale: or-IN (Odia, Odisha India). Pitch: +8% warm young Indian female timbre. Rate: 0.94x unhurried, melodic Odia conversational rhythm with soft dental/retroflex articulation, affectionate elder-sister (Didi/Apa) warmth, and natural pauses after 'Namaskar' and 'Nischaya'.",
  },
  hi: {
    locale: "hi-IN",
    fallbackLocales: ["hi-IN", "mr-IN", "en-IN"],
    pitch: 1.06, // Expressive, friendly young Indian female Hindi voice
    questionPitchBoost: 0.04,
    greetingPitchBoost: 0.03,
    rate: 0.96, // Balanced conversational Hindi pacing
    neuralPlaybackRate: 0.98,
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
      "Locale: hi-IN (Hindi, India). Pitch: +6% warm, expressive young Indian female mentor voice. Rate: 0.96x natural conversational Hindi cadence with respectful warmth on 'Namaste ji', 'Bilkul', and 'Zaroor'.",
  },
  en: {
    locale: "en-IN",
    fallbackLocales: ["en-IN", "hi-IN"],
    pitch: 1.05, // Bright, articulate young Indian professional English pitch
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.97, // Crisp, syllable-timed Indian English rhythm
    neuralPlaybackRate: 0.99,
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
      "Locale: en-IN (Indian English). Pitch: +5% bright, relatable young Indian female career coach. Rate: 0.97x natural syllable-timed Indian English prosody with warm inflection on 'Namaste', 'definitely', and 'all the very best'.",
  },
  bn: {
    locale: "bn-IN",
    fallbackLocales: ["bn-IN", "hi-IN", "en-IN"],
    pitch: 1.07,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.03,
    rate: 0.95,
    neuralPlaybackRate: 0.98,
    volume: 1.0,
    preferredVoiceKeywords: ["tanishaa", "bengali", "bn-in", "swara", "neerja"],
    culturalStylePrompt:
      "Locale: bn-IN (Bengali, India). Pitch: +7% sweet, cultured young Indian female mentor voice. Rate: 0.95x warm Bengali cadence.",
  },
  te: {
    locale: "te-IN",
    fallbackLocales: ["te-IN", "en-IN", "hi-IN"],
    pitch: 1.06,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.95,
    neuralPlaybackRate: 0.98,
    volume: 1.0,
    preferredVoiceKeywords: ["shruti", "telugu", "te-in", "neerja", "veena"],
    culturalStylePrompt:
      "Locale: te-IN (Telugu, India). Pitch: +6% warm young Indian female mentor voice. Rate: 0.95x clear, melodic Telugu cadence.",
  },
  ta: {
    locale: "ta-IN",
    fallbackLocales: ["ta-IN", "en-IN", "hi-IN"],
    pitch: 1.05,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.95,
    neuralPlaybackRate: 0.98,
    volume: 1.0,
    preferredVoiceKeywords: ["pallavi", "valluvar", "tamil", "ta-in", "neerja", "veena"],
    culturalStylePrompt:
      "Locale: ta-IN (Tamil, India). Pitch: +5% warm, respectful young Indian female mentor voice. Rate: 0.95x clear Tamil cadence.",
  },
  mr: {
    locale: "mr-IN",
    fallbackLocales: ["mr-IN", "hi-IN", "en-IN"],
    pitch: 1.06,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.96,
    neuralPlaybackRate: 0.98,
    volume: 1.0,
    preferredVoiceKeywords: ["aarohi", "marathi", "mr-in", "swara", "neerja"],
    culturalStylePrompt:
      "Locale: mr-IN (Marathi, India). Pitch: +6% warm young Indian female mentor voice. Rate: 0.96x natural Marathi cadence.",
  },
  gu: {
    locale: "gu-IN",
    fallbackLocales: ["gu-IN", "hi-IN", "en-IN"],
    pitch: 1.06,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.96,
    neuralPlaybackRate: 0.98,
    volume: 1.0,
    preferredVoiceKeywords: ["dhwani", "gujarati", "gu-in", "swara", "neerja"],
    culturalStylePrompt:
      "Locale: gu-IN (Gujarati, India). Pitch: +6% cheerful young Indian female mentor voice. Rate: 0.96x natural Gujarati cadence.",
  },
  kn: {
    locale: "kn-IN",
    fallbackLocales: ["kn-IN", "en-IN", "hi-IN"],
    pitch: 1.06,
    questionPitchBoost: 0.03,
    greetingPitchBoost: 0.02,
    rate: 0.95,
    neuralPlaybackRate: 0.98,
    volume: 1.0,
    preferredVoiceKeywords: ["sapna", "kannada", "kn-in", "neerja", "veena"],
    culturalStylePrompt:
      "Locale: kn-IN (Kannada, India). Pitch: +6% warm, articulate young Indian female mentor voice. Rate: 0.95x clear Kannada cadence.",
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
    /\b(namaskar|mote|darkar|chakiri|kemiti|achanti|karichi|odisha|orisha|btech|odia|khobar|kisa|kana|ghara|mu|aapan|dhanyabad|nischaya|chinta)\b/i;
  return odiaScriptRegex.test(text) || odiaPhoneticRegex.test(text);
};

export const detectIndianLanguageFromText = (
  text: string,
  fallbackLanguage: LanguageCode = "en"
): LanguageCode => {
  if (!text) return fallbackLanguage;
  if (isOdiaText(text)) return "or";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0900-\u097F]/.test(text)) {
    return fallbackLanguage === "mr" ? "mr" : "hi";
  }
  return fallbackLanguage;
};

/**
 * Normalizes markdown, Indian currency (₹ / LPA / Crores), exam acronyms (OPSC, UPSC, SSC, IBPS),
 * and inserts subtle conversational breath pauses after Indian greetings for natural cadence.
 */
const applyIndianCulturalProsody = (rawText: string, language: LanguageCode): string => {
  let cleaned = (rawText || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#+\s+/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`{1,3}.*?`{1,3}/g, "")
    .replace(/30-year-old|30-वर्षीय|୩୦ ବର୍ଷୀୟ/gi, "")
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    )
    .replace(/•/g, ", ");

  // Natural pronunciation of domain & Indian career terms
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
    .replace(/\bIBPS\b/g, "I B P S");

  // Add a gentle conversational pause after Indian greetings so Arohi's voice breathes naturally
  if (language === "or") {
    cleaned = cleaned.replace(/ନମସ୍କାର\s*!*/g, "ନମସ୍କାର, ");
  } else if (language === "hi") {
    cleaned = cleaned
      .replace(/नमस्ते जी\s*!*/g, "नमस्ते जी, ")
      .replace(/नमस्ते\s*!*/g, "नमस्ते, ");
  } else if (language === "en") {
    cleaned = cleaned
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
  fallbackOptions: SpeechOptions
) => {
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

  // Apply locale-specific speaking rate adjustment for natural Indian cadence
  const desiredRate = fallbackOptions.rateOverride ?? localeConfig.neuralPlaybackRate;
  audio.playbackRate = Math.max(0.85, Math.min(1.15, desiredRate));

  audio.onplay = () => {
    fallbackOptions.onStart?.();
  };

  audio.onended = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    currentAudioElement = null;
    fallbackOptions.onEnd?.();
  };

  audio.onerror = () => {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    currentAudioElement = null;
    speakWebSpeech(fallbackOptions);
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
      await playBase64Audio(cachedAudio.audioBase64, cachedAudio.mimeType, localeConfig, {
        text: cleanedText,
        language: detectedLanguage,
        pitchOverride,
        rateOverride,
        onStart,
        onEnd,
        onError,
      });
      return;
    } catch (_err) {
      // Fall through to Web Speech if autoplay fails
    }
  }

  // Try Server Gemini 3.8 Neural TTS with Indian locale, pitch, and rate prosody metadata
  try {
    const res = await fetch("/api/ai/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: cleanedText,
        voice: "Aoede",
        language: detectedLanguage,
        locale: localeConfig.locale,
        pitch: pitchOverride ?? localeConfig.pitch,
        rate: rateOverride ?? localeConfig.rate,
        stylePrompt: localeConfig.culturalStylePrompt,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const mimeType = data.mimeType || "audio/wav";
        if (clientTtsCache.size < 100) {
          clientTtsCache.set(cacheKey, { audioBase64: data.audioBase64, mimeType });
        }
        await playBase64Audio(data.audioBase64, mimeType, localeConfig, {
          text: cleanedText,
          language: detectedLanguage,
          pitchOverride,
          rateOverride,
          onStart,
          onEnd,
          onError,
        });
        return;
      }
    }
  } catch (_err) {
    // Seamless fallback to Indian neural browser voice
  }

  // Fallback to Web Speech API with locale-specific pitch, rate, and prosodic intonation
  speakWebSpeech({
    text: cleanedText,
    language: detectedLanguage,
    pitchOverride,
    rateOverride,
    onStart,
    onEnd,
    onError,
  });
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

const speakWebSpeech = ({
  text,
  language = "en",
  pitchOverride,
  rateOverride,
  onStart,
  onEnd,
  onError,
}: SpeechOptions) => {
  if (!("speechSynthesis" in window)) {
    onError?.("Speech synthesis not supported in this browser.");
    onEnd?.();
    return;
  }

  try {
    const detectedLanguage = detectIndianLanguageFromText(text, language);
    const localeConfig =
      INDIAN_SPEECH_LOCALE_CONFIG[detectedLanguage] || INDIAN_SPEECH_LOCALE_CONFIG.en;
    const cleanText = applyIndianCulturalProsody(text, detectedLanguage);

    const voices =
      cachedBrowserVoices.length > 0
        ? cachedBrowserVoices
        : window.speechSynthesis.getVoices();
    const chosenVoice = selectBestIndianVoice(voices, localeConfig);

    // Split text into conversational sentence breath-groups so each phrase receives natural Indian pitch/rate inflection
    const rawSegments = cleanText
      .split(/(?<=[.!?।॥])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const segments = rawSegments.length > 0 ? rawSegments : [cleanText];

    let currentIdx = 0;

    const speakNextSegment = () => {
      if (currentIdx >= segments.length) {
        currentUtterance = null;
        onEnd?.();
        return;
      }

      const segment = segments[currentIdx];
      const utterance = new SpeechSynthesisUtterance(segment);
      currentUtterance = utterance;

      utterance.lang = chosenVoice?.lang || localeConfig.locale;
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Dynamic Indian prosodic pitch & rate adjustments based on sentence intent (greeting, question, or guidance)
      const isGreetingSegment =
        currentIdx === 0 &&
        /^(namaste|namaskar|ନମସ୍କାର|नमस्ते|নমস্কার|నమస్కారం|வணக்கம்|नमस्कार|નમસ્તે|ನಮಸ್ಕಾರ)/i.test(
          segment
        );
      const isQuestionSegment = segment.endsWith("?");

      let computedPitch = pitchOverride ?? localeConfig.pitch;
      if (isGreetingSegment) {
        computedPitch += localeConfig.greetingPitchBoost;
      } else if (isQuestionSegment) {
        computedPitch += localeConfig.questionPitchBoost;
      }

      const computedRate =
        rateOverride ??
        (isGreetingSegment ? Math.max(0.9, localeConfig.rate - 0.02) : localeConfig.rate);

      utterance.pitch = Number(computedPitch.toFixed(2));
      utterance.rate = Number(computedRate.toFixed(2));
      utterance.volume = localeConfig.volume;

      if (currentIdx === 0) {
        utterance.onstart = () => {
          onStart?.();
        };
      }

      utterance.onend = () => {
        currentIdx += 1;
        speakNextSegment();
      };

      utterance.onerror = (event) => {
        console.warn("Web Speech API notice:", event);
        currentUtterance = null;
        onError?.(event);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextSegment();
  } catch (err) {
    console.error("Speech Synthesis failure:", err);
    onError?.(err);
    onEnd?.();
  }
};

export const stopSpeech = () => {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
};

// Speech recognition helper
export const listenToVoiceInput = (
  language: LanguageCode,
  onResult: (text: string, isFinal?: boolean) => void,
  onError?: (err: string) => void,
  onEnd?: () => void,
  onSpeechStart?: () => void
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Voice speech recognition is not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = LANGUAGE_VOICE_MAP[language] || "or-IN";

  recognition.onspeechstart = () => {
    // Interruption: Pause/stop Arohi from speaking immediately as soon as user starts speaking
    stopSpeech();
    onSpeechStart?.();
  };

  recognition.onsoundstart = () => {
    stopSpeech();
  };

  recognition.onresult = (event: any) => {
    // Whenever user speech is detected, pause ongoing assistant speech
    stopSpeech();

    let transcript = "";
    let isFinal = false;

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isFinal = true;
      }
    }

    if (transcript.trim()) {
      onResult(transcript, isFinal);
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
