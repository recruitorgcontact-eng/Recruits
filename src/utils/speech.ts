import { LanguageCode } from "../types";

export interface SpeechOptions {
  text: string;
  language?: LanguageCode;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

const LANGUAGE_VOICE_MAP: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  or: "or-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  bn: "bn-IN",
};

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;

export const isOdiaText = (text: string): boolean => {
  if (!text) return false;
  const odiaScriptRegex = /[\u0B00-\u0B7F]/;
  const odiaPhoneticRegex = /\b(namaskar|mote|darkar|chakiri|kemiti|achanti|karichi|odisha|orisha|btech|odia|khobar|kisa|kana|ghara|mu|aapan|dhanyabad)\b/i;
  return odiaScriptRegex.test(text) || odiaPhoneticRegex.test(text);
};

const cleanTextForSpeech = (rawText: string): string => {
  return (rawText || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#+\s+/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`{1,3}.*?`{1,3}/g, "")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const speakText = async ({ text, language = "en", onStart, onEnd, onError }: SpeechOptions) => {
  stopSpeech();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    onEnd?.();
    return;
  }

  // If text contains Odia characters/words, auto-switch language to Odia
  const detectedLanguage = isOdiaText(cleanedText) ? "or" : language;

  // Try Server Gemini Neural TTS first for natural, compassionate, polite, joyful human voice
  try {
    const res = await fetch("/api/ai/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanedText, voice: "Kore", language: detectedLanguage }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const mimeType = data.mimeType || "audio/wav";
        const binaryString = window.atob(data.audioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);
        currentObjectUrl = audioUrl;

        const audio = new Audio(audioUrl);
        currentAudioElement = audio;

        audio.onplay = () => {
          onStart?.();
        };

        audio.onended = () => {
          if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = null;
          }
          currentAudioElement = null;
          onEnd?.();
        };

        audio.onerror = (e) => {
          console.warn("Audio playback notice, using natural browser speech fallback", e);
          if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
            currentObjectUrl = null;
          }
          currentAudioElement = null;
          speakWebSpeech({ text: cleanedText, language: detectedLanguage, onStart, onEnd, onError });
        };

        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn("Server TTS fallback to browser speech synthesis:", err);
  }

  // Fallback to Web Speech API
  speakWebSpeech({ text: cleanedText, language: detectedLanguage, onStart, onEnd, onError });
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

const speakWebSpeech = ({ text, language = "en", onStart, onEnd, onError }: SpeechOptions) => {
  if (!("speechSynthesis" in window)) {
    onError?.("Speech synthesis not supported in this browser.");
    onEnd?.();
    return;
  }

  try {
    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    const langCode = LANGUAGE_VOICE_MAP[language] || "en-IN";
    utterance.lang = langCode;

    // Keep natural unshifted pitch (1.0) and natural conversational cadence (0.98) to prevent robotic vocoder artifacts
    utterance.rate = 0.98;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();

    // Prioritize Online/Natural/Neural voices first so browser fallback never sounds synthetic or robotic
    const naturalVoice =
      voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        const isIndianLang = lang.includes("in") || lang.startsWith("hi") || lang.startsWith("or");
        const isNaturalNeural = name.includes("natural") || name.includes("online") || name.includes("neural");
        const isFemale =
          name.includes("neerja") ||
          name.includes("swara") ||
          name.includes("aditi") ||
          name.includes("raveena") ||
          name.includes("veena") ||
          name.includes("heera") ||
          name.includes("female");
        return isIndianLang && isNaturalNeural && isFemale;
      }) ||
      voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        const isIndianLang = lang.includes("in") || lang.startsWith("hi") || lang.startsWith("or");
        return (
          isIndianLang &&
          (name.includes("neerja") ||
            name.includes("swara") ||
            name.includes("google") ||
            name.includes("natural") ||
            name.includes("neural") ||
            name.includes("veena") ||
            name.includes("aditi"))
        );
      }) ||
      voices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          (name.includes("natural") || name.includes("online") || name.includes("neural") || name.includes("google")) &&
          (name.includes("aria") ||
            name.includes("jenny") ||
            name.includes("sonia") ||
            name.includes("samantha") ||
            name.includes("female") ||
            v.lang.startsWith("en"))
        );
      }) ||
      voices.find((v) => v.lang.startsWith(langCode) || v.lang.startsWith(language));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.warn("Web Speech API notice:", event);
      currentUtterance = null;
      onError?.(event);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
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
