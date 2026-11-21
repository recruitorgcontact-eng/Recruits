import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Globe,
  Loader2,
  Smile,
  Radio,
  CheckCircle2,
  Bot,
  User,
  Heart,
  Newspaper,
  Briefcase,
  ExternalLink,
  TrendingUp,
  MapPin,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { LanguageCode, CareerMemory } from "../types";
import {
  speakText,
  stopSpeech,
  listenToVoiceInput,
  playCallChime,
  detectIndianLanguageFromText,
} from "../utils/speech";
import { ArohiLiveAudioClient } from "../utils/liveAudioClient";

interface ArohiFloatingAgentProps {
  memory?: CareerMemory;
}

export interface DigestJobItem {
  id: string;
  title: string;
  organization: string;
  sector: string;
  matchPercentage: number;
  location: string;
  salary: string;
  deadline: string;
  whyMatched: string;
  applyUrl: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "arohi";
  text: string;
  spokenSummary?: string;
  digestJobs?: DigestJobItem[];
  timestamp: string;
}

export const ArohiFloatingAgent: React.FC<ArohiFloatingAgentProps> = ({
  memory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"call" | "chat">("chat");
  const [language, setLanguage] = useState<LanguageCode>("en");

  // Call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "listening" | "thinking" | "speaking"
  >("idle");
  const [liveUserTranscript, setLiveUserTranscript] = useState("");
  const [liveArohiSubtitle, setLiveArohiSubtitle] = useState("");
  const [bargeInTriggered, setBargeInTriggered] = useState(false);
  const [liveEngineLabel, setLiveEngineLabel] = useState("Aoede Live Audio");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome-01",
      sender: "arohi",
      text: "Namaste! 🙏 I'm Arohi, your personal Career Coach & Guide on Recruits.org.in (Quench Research Labs Private Limited • Powered by arohiai.com). Whether you're preparing for OPSC, UPSC, SSC & Banking exams or aiming for top MNC placements at Tata, Infosys, Wipro, HDFC Bank, or Reliance—I'm right here with you like a supportive elder sister and mentor! Speak or type in Odia, Hindi, or English—I'll answer in your language!",
      spokenSummary:
        "Namaste! I'm Arohi, your career guide on Recruits.org.in. Tell me, how can we start your career preparation today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  // Audio wave animation frames
  const [waveHeights, setWaveHeights] = useState<number[]>([
    12, 28, 45, 20, 35, 50, 24, 38,
  ]);

  const speechRecognitionRef = useRef<any>(null);
  const speechPauseTimerRef = useRef<any>(null);
  const pendingTranscriptRef = useRef<string>("");
  const isCallActiveRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const loadingResponseRef = useRef<boolean>(false);
  const languageRef = useRef<LanguageCode>("en");
  const skipGreetingOnAutoDetectRef = useRef<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);
  const liveClientRef = useRef<ArohiLiveAudioClient | null>(null);
  const liveInputBufferRef = useRef<string>("");
  const liveOutputBufferRef = useRef<string>("");

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    loadingResponseRef.current = loadingResponse;
  }, [loadingResponse]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Language greeting updates when user manually switches dropdown (skipped when auto-detected mid-conversation)
  useEffect(() => {
    if (skipGreetingOnAutoDetectRef.current) {
      skipGreetingOnAutoDetectRef.current = false;
      return;
    }

    const languageGreetings: Record<
      string,
      { text: string; spokenSummary: string }
    > = {
      or: {
        text: "ନମସ୍କାର! 🙏 ମୁଁ ଆରୋହୀ, ଆପଣଙ୍କ ନିଜର କ୍ୟାରିଅର୍ ଦିଦି ଓ ଗାଇଡ୍! ଓଡ଼ିଶାର ଓପିଏସସି, ଓଏସଏସସି ତଥା ସମଗ୍ର ଭାରତର ୟୁପିଏସସି, ଏସଏସସି, ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଏବଂ ଟିସିଏସ୍, ଇନଫୋସିସ୍, ୱିପ୍ରୋ ଭଳି ଟପ୍ କମ୍ପାନୀ ଚାକିରି ପାଇଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବାକୁ ମୁଁ ସଦା ପ୍ରସ୍ତୁତ। ନିଶ୍ଚୟ ପଚାରନ୍ତୁ, ଆଜି ଆମେ କେଉଁଠୁ ଆରମ୍ଭ କରିବା?",
        spokenSummary:
          "ନମସ୍କାର! ମୁଁ ଆରୋହୀ, ଆପଣଙ୍କ ନିଜର କ୍ୟାରିଅର୍ ଗାଇଡ୍। କୁହନ୍ତୁ, ଆଜି ଆମେ କେଉଁ ବିଷୟରେ କଥା ହେବା?",
      },
      hi: {
        text: "नमस्ते जी! 🙏 मैं आरोही हूँ, आपकी अपनी करियर कोच और गाइड! चाहे यूपीएससी, एसएससी, बैंकिंग जैसी सरकारी परीक्षा की तैयारी हो या टीसीएस, इन्फोसिस, विप्रो, एचडीएफसी बैंक जैसी टॉप कंपनियों में प्लेसमेंट—आपकी मेहनत ज़रूर रंग लाएगी। बताइए, आज हम किस लक्ष्य से शुरुआत करें?",
        spokenSummary:
          "नमस्ते जी! मैं आरोही हूँ, आपकी अपनी करियर गाइड। बताइए, आज मैं आपकी क्या मदद कर सकती हूँ?",
      },
      bn: {
        text: "নমস্কার! 🙏 আমি আরোহী, আপনার নিজের ক্যারিয়ার গাইড ও মেন্টর! সরকারি পরীক্ষা হোক বা TCS, Infosys, Wipro-র মতো শীর্ষ সংস্থায় চাকরি—আমি সবসময় আপনার পাশে আছি। বলুন, আজ কীভাবে আপনাকে সাহায্য করতে পারি?",
        spokenSummary: "নমস্কার! আমি আরোহী, আপনার ক্যারিয়ার গাইড। আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
      },
      te: {
        text: "నమస్కారం! 🙏 నేను ఆరోహిని, మీ కెరీర్ గైడ్ మరియు మెంటార్! ప్రభుత్వ ఉద్యోగాలైనా లేదా TCS, Infosys, Wipro వంటి టాప్ కంపెనీల ప్లేస్‌మెంట్స్ అయినా—నేను మీకు తోడుగా ఉంటాను. ఈరోజు మనం ఏ అంశంతో ప్రారంభిద్దాం?",
        spokenSummary: "నమస్కారం! నేను ఆరోహిని, మీ కెరీర్ గైడ్. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      },
      ta: {
        text: "வணக்கம்! 🙏 நான் ஆரோஹி, உங்கள் தொழில் வழிகாட்டி! அரசுத் தேர்வுகள் முதல் TCS, Infosys, Wipro போன்ற முன்னணி நிறுவன வேலைவாய்ப்புகள் வரை உங்களுக்கு வழிகாட்ட நான் தயாராக இருக்கிறேன். இன்று நாம் எதிலிருந்து தொடங்கலாம்?",
        spokenSummary: "வணக்கம்! நான் ஆரோஹி, உங்கள் தொழில் வழிகாட்டி. இன்று நான் உங்களுக்கு எப்படி உதவலாம்?",
      },
      mr: {
        text: "नमस्कार! 🙏 मी आरोही, तुमची स्वतःची करिअर गाईड आणि मेंटॉर! सरकारी परीक्षा असो किंवा TCS, Infosys, Wipro सारख्या टॉप कंपन्यांमधील प्लेसमेंट—मी सदैव तुमच्या सोबत आहे. सांगा, आज आपण कशापासून सुरुवात करायची?",
        spokenSummary: "नमस्कार! मी आरोही, तुमची करिअर गाईड. सांगा, आज मी तुम्हाला कशी मदत करू शकते?",
      },
      gu: {
        text: "નમસ્તે! 🙏 હું આરોહી છું, તમારી પોતાની કારકિર્દી ગાઈડ! સરકારી પરીક્ષાની તૈયારી હોય કે TCS, Infosys, Wipro જેવી ટોચની કંપનીઓમાં પ્લેસમેન્ટ—હું હંમેશા તમારી સાથે છું. કહો, આજે આપણે ક્યાંથી શરૂઆત કરીએ?",
        spokenSummary: "નમસ્તે! હું આરોહી છું, તમારી કારકિર્દી ગાઈડ. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
      },
      kn: {
        text: "ನಮಸ್ಕಾರ! 🙏 ನಾನು ಆರೋಹಿ, ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಕಿ! ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಾಗಲಿ ಅಥವಾ TCS, Infosys, Wipro ದಂತಹ ಉನ್ನತ ಕಂಪನಿಗಳ ಉದ್ಯೋಗವಾಗಲಿ—ನಾನು ಸದಾ ನಿಮ್ಮೊಂದಿಗಿದ್ದೇನೆ. ಹೇಳಿ, ಇಂದು ನಾವು ಯಾವುದರಿಂದ ಪ್ರಾರಂಭಿಸೋಣ?",
        spokenSummary: "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಹಿ, ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಕಿ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
      },
    };

    const selectedGreeting = languageGreetings[language];
    if (selectedGreeting) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${language}-${Date.now()}`,
          sender: "arohi",
          text: selectedGreeting.text,
          spokenSummary: selectedGreeting.spokenSummary,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [language]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingResponse]);

  // Call Duration Timer
  useEffect(() => {
    if (isCallActive) {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
      setCallDuration(0);
      setCallStatus("idle");
      setLiveUserTranscript("");
      setBargeInTriggered(false);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isCallActive]);

  // Animate Voice Waves when speaking or listening
  useEffect(() => {
    let waveInterval: any;
    if (callStatus === "speaking" || callStatus === "listening") {
      waveInterval = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 45) + 10)
        );
      }, 150);
    } else {
      setWaveHeights([12, 16, 12, 16, 12, 16, 12, 16]);
    }
    return () => clearInterval(waveInterval);
  }, [callStatus]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Clean up Live audio client on unmount
  useEffect(() => {
    return () => {
      liveClientRef.current?.stop();
    };
  }, []);

  // Manual or automatic Barge-In handler: immediately pauses Arohi speech & listens to user
  const handleBargeInInterrupt = () => {
    stopSpeech();
    if (liveClientRef.current?.isActive()) {
      liveClientRef.current.interruptPlayback();
      setBargeInTriggered(true);
      setCallStatus("listening");
      return;
    }
    setBargeInTriggered(true);
    setCallStatus("listening");
    startLiveListening();
  };

  // Send Message / Process Speech (auto-detects user's language and answers in that exact language)
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage ?? inputText).trim();
    if (!textToSend || loadingResponseRef.current) return;

    // Immediately pause/stop any ongoing Arohi speech when user speaks or sends a message
    stopSpeech();
    if (speechPauseTimerRef.current) {
      clearTimeout(speechPauseTimerRef.current);
      speechPauseTimerRef.current = null;
    }
    pendingTranscriptRef.current = "";
    setLiveUserTranscript("");
    setBargeInTriggered(false);

    // Auto-detect user's language (Odia, Hindi, English, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada)
    const detectedUserLang = detectIndianLanguageFromText(
      textToSend,
      languageRef.current
    );

    if (detectedUserLang !== languageRef.current) {
      skipGreetingOnAutoDetectRef.current = true;
      languageRef.current = detectedUserLang;
      setLanguage(detectedUserLang);
    }

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInputText("");
    setLoadingResponse(true);
    loadingResponseRef.current = true;
    if (isCallActiveRef.current) setCallStatus("thinking");

    try {
      const res = await fetch("/api/ai/arohi-agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          mode: isCallActiveRef.current ? "voice" : "chat",
          language: detectedUserLang,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
          memory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const serverDetectedLang = (data.detectedLanguage ||
          detectIndianLanguageFromText(
            data.shortSpokenSummary || data.responseText,
            detectedUserLang
          )) as LanguageCode;

        if (serverDetectedLang && serverDetectedLang !== languageRef.current) {
          skipGreetingOnAutoDetectRef.current = true;
          languageRef.current = serverDetectedLang;
          setLanguage(serverDetectedLang);
        }

        const arohiMsg: ChatMessage = {
          id: "arohi-" + Date.now(),
          sender: "arohi",
          text:
            data.responseText ||
            (serverDetectedLang === "or"
              ? "ହଁ ନିଶ୍ଚୟ, ମୁଁ ଆପଣଙ୍କ ସାଙ୍ଗରେ ଅଛି! ଆସନ୍ତୁ ଆମେ ଆଗକୁ ବଢ଼ିବା।"
              : serverDetectedLang === "hi"
              ? "हाँ बिल्कुल जी, मैं आपके साथ हूँ! आइए आगे बढ़ते हैं।"
              : "I'm right here with you! Let's keep moving forward with confidence."),
          spokenSummary: data.shortSpokenSummary || data.responseText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, arohiMsg]);

        // Speak back in the user's language while keeping Barge-In listening active!
        if (isCallActiveRef.current && !isSpeakerMuted) {
          setCallStatus("speaking");
          // Ensure microphone listener stays active while Arohi speaks so user can barge-in anytime
          startLiveListening(serverDetectedLang);
          speakText({
            text: data.shortSpokenSummary || data.responseText,
            language: serverDetectedLang,
            onEnd: () => {
              if (isCallActiveRef.current) {
                setCallStatus("listening");
                startLiveListening(serverDetectedLang);
              }
            },
          });
        }
      }
    } catch (err) {
      console.error("Error talking with Arohi AI:", err);
    } finally {
      setLoadingResponse(false);
      loadingResponseRef.current = false;
      if (isCallActiveRef.current && callStatus === "thinking") {
        setCallStatus("listening");
      }
    }
  };

  // Daily Jobs Digest Handler (Aggregates top 5 jobs based on candidate preferences)
  const handleGenerateDailyJobsDigest = async () => {
    if (loadingResponse) return;

    const userReqMsg: ChatMessage = {
      id: "user-digest-req-" + Date.now(),
      sender: "user",
      text:
        language === "or"
          ? "ମୋର ଆଜିର 'ଡେଲି ଜବ୍ସ ଡାଇଜେଷ୍ଟ' (Top 5 Jobs) ଦେଖାନ୍ତୁ।"
          : language === "hi"
          ? "मुझे मेरा आज का 'डेली जॉब्स डाइजेस्ट' (Top 5 Jobs) दिखाएं।"
          : "Show me my Daily Jobs Digest for today (Top 5 Job Matches)!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userReqMsg]);
    setLoadingResponse(true);

    try {
      const res = await fetch("/api/ai/daily-jobs-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memory,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const arohiDigestMsg: ChatMessage = {
          id: "arohi-digest-" + Date.now(),
          sender: "arohi",
          text:
            data.greeting ||
            "Here is your curated Daily Jobs Digest for today based on your target role and career preferences!",
          spokenSummary: data.spokenSummary || data.greeting,
          digestJobs: data.digestJobs || [],
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, arohiDigestMsg]);

        if (isCallActiveRef.current && !isSpeakerMuted) {
          setCallStatus("speaking");
          startLiveListening(language);
          speakText({
            text: data.spokenSummary || data.greeting,
            language,
            onEnd: () => {
              if (isCallActiveRef.current) {
                setCallStatus("listening");
                startLiveListening(language);
              }
            },
          });
        }
      }
    } catch (err) {
      console.error("Error generating Daily Jobs Digest:", err);
    } finally {
      setLoadingResponse(false);
    }
  };

  // Start Live Voice Call: Gemini Live WebSocket (Aoede) first, automatic Zephyr turn-based fallback
  const handleStartVoiceCall = async () => {
    playCallChime("ring");
    setIsCallActive(true);
    isCallActiveRef.current = true;
    setActiveTab("call");
    setCallStatus("connecting");
    setBargeInTriggered(false);
    setLiveUserTranscript("");
    setLiveArohiSubtitle("");
    liveInputBufferRef.current = "";
    liveOutputBufferRef.current = "";
    setLiveEngineLabel("Connecting Live Audio (Aoede)...");

    const commitBufferedTranscripts = () => {
      const userChunk = liveInputBufferRef.current.trim();
      const arohiChunk = liveOutputBufferRef.current.trim();
      const nowTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (userChunk) {
        liveInputBufferRef.current = "";
        setMessages((prev) => [
          ...prev,
          { id: `live-u-${Date.now()}`, sender: "user", text: userChunk, timestamp: nowTime },
        ]);
      }
      if (arohiChunk) {
        liveOutputBufferRef.current = "";
        setMessages((prev) => [
          ...prev,
          {
            id: `live-a-${Date.now() + 1}`,
            sender: "arohi",
            text: arohiChunk,
            spokenSummary: arohiChunk,
            timestamp: nowTime,
          },
        ]);
      }
    };

    const liveClient = new ArohiLiveAudioClient();
    liveClientRef.current = liveClient;

    const liveConnected = await liveClient.start({
      language: languageRef.current,
      memory,
      callbacks: {
        onModelInfo: (info) => {
          playCallChime("connect");
          setLiveEngineLabel(`Live Voice (${info.voice})`);
        },
        onStatusChange: (status) => {
          if (!isCallActiveRef.current) return;
          if (status === "speaking") setCallStatus("speaking");
          else if (status === "connecting") setCallStatus("connecting");
          else if (status === "thinking") setCallStatus("thinking");
          else if (status === "listening") setCallStatus("listening");
        },
        onInputTranscript: (chunk) => {
          liveInputBufferRef.current = `${liveInputBufferRef.current} ${chunk}`.replace(/\s+/g, " ").trim();
          setLiveUserTranscript(liveInputBufferRef.current);
          const detected = detectIndianLanguageFromText(liveInputBufferRef.current, languageRef.current);
          if (detected !== languageRef.current) {
            skipGreetingOnAutoDetectRef.current = true;
            languageRef.current = detected;
            setLanguage(detected);
          }
        },
        onOutputTranscript: (chunk) => {
          if (liveInputBufferRef.current.trim()) {
            const u = liveInputBufferRef.current.trim();
            liveInputBufferRef.current = "";
            setMessages((prev) => [
              ...prev,
              {
                id: `live-u-${Date.now()}`,
                sender: "user",
                text: u,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }
          liveOutputBufferRef.current = `${liveOutputBufferRef.current} ${chunk}`.replace(/\s+/g, " ").trim();
          setLiveArohiSubtitle(liveOutputBufferRef.current);
        },
        onInterrupted: () => {
          setBargeInTriggered(true);
          commitBufferedTranscripts();
        },
        onTurnComplete: () => {
          commitBufferedTranscripts();
          setBargeInTriggered(false);
        },
        onError: () => {
          // Handled cleanly if connection drops or quota fallback triggers
        },
      },
    });

    if (liveConnected && isCallActiveRef.current) {
      liveClient.setMicMuted(isMutedRef.current);
      liveClient.setSpeakerMuted(isSpeakerMuted);
      return;
    }

    // Fallback to turn-based Zephyr Neural TTS + Continuous STT if Live WS is unavailable
    liveClientRef.current = null;
    if (!isCallActiveRef.current) return;

    setLiveEngineLabel("Zephyr HD Voice (Fallback)");
    playCallChime("connect");
    setCallStatus("speaking");

    const welcomeByLang: Record<string, string> = {
      or: "ନମସ୍କାର! ମୁଁ ଆରୋହୀ, recruits.org.in ରେ ଆପଣଙ୍କ AI କ୍ୟାରିୟର ଓ ପ୍ଲେସମେଣ୍ଟ କୋଚ୍ — କୁହନ୍ତୁ, ଆପଣ କେଉଁ ସ୍କିଲ୍, ଇଣ୍ଟର୍ନଶିପ୍ କିମ୍ବା ଚାକିରି ପାଇଁ ପ୍ରସ୍ତୁତି କରୁଛନ୍ତି?",
      hi: "नमस्ते! मैं आरोही हूँ, recruits.org.in पर आपकी AI करियर और प्लेसमेंट कोच — बताइए आप किस जॉब, इंटर्नशिप या स्किल की तैयारी कर रहे हैं?",
      bn: "নমস্কার! আমি আরোহী, recruits.org.in-এ আপনার AI ক্যারিয়ার ও প্লেসমেন্ট কোচ — বলুন, আপনি কোন স্কিল, ইন্টার্নশিপ বা চাকরির জন্য প্রস্তুতি নিচ্ছেন?",
      en: "Hello! I am Arohi, your AI career and placement coach on recruits.org.in — tell me what role, skill, internship, or job you are aiming for, and let's build your plan together!",
    };
    const currentLang = languageRef.current;
    const welcomeGreeting = welcomeByLang[currentLang] || welcomeByLang.en;

    startLiveListening(currentLang);
    speakText({
      text: welcomeGreeting,
      language: currentLang,
      onEnd: () => {
        if (isCallActiveRef.current) {
          setCallStatus("listening");
          startLiveListening(languageRef.current);
        }
      },
    });
  };

  // End Voice Call
  const handleEndCall = () => {
    playCallChime("disconnect");
    stopSpeech();
    if (liveClientRef.current) {
      liveClientRef.current.stop();
      liveClientRef.current = null;
    }
    if (speechPauseTimerRef.current) {
      clearTimeout(speechPauseTimerRef.current);
      speechPauseTimerRef.current = null;
    }
    pendingTranscriptRef.current = "";
    liveInputBufferRef.current = "";
    liveOutputBufferRef.current = "";
    setLiveUserTranscript("");
    setLiveArohiSubtitle("");
    setBargeInTriggered(false);
    isCallActiveRef.current = false;
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.stop();
      } catch (_e) {
        // Ignore stop notice
      }
      speechRecognitionRef.current = null;
    }
    setIsCallActive(false);
    setCallStatus("idle");
  };

  // Start Continuous Voice Input Recognition with Barge-In & Pause-Debounce
  const startLiveListening = (overrideLang?: LanguageCode) => {
    if (isMutedRef.current || !isCallActiveRef.current) return;

    // Avoid creating duplicate recognition instances if one is already running
    if (speechRecognitionRef.current) {
      return;
    }

    const listenLang = overrideLang || languageRef.current;

    speechRecognitionRef.current = listenToVoiceInput(
      listenLang,
      (transcript, isFinal) => {
        if (!isCallActiveRef.current || isMutedRef.current) return;

        // Instant Barge-In: Pause Arohi immediately when user speaks
        stopSpeech();
        setCallStatus("listening");
        setBargeInTriggered(true);

        const cleanTranscript = transcript.trim();
        if (!cleanTranscript) return;

        pendingTranscriptRef.current = cleanTranscript;
        setLiveUserTranscript(cleanTranscript);

        // Reset pause debounce timer so user can finish their full sentence without mid-sentence cutoff
        if (speechPauseTimerRef.current) {
          clearTimeout(speechPauseTimerRef.current);
        }

        const waitMs = isFinal ? 650 : 1150;
        speechPauseTimerRef.current = setTimeout(() => {
          const finalToSend = pendingTranscriptRef.current.trim();
          if (finalToSend && isCallActiveRef.current && !loadingResponseRef.current) {
            pendingTranscriptRef.current = "";
            handleSendMessage(finalToSend);
          }
        }, waitMs);
      },
      (_err) => {
        speechRecognitionRef.current = null;
      },
      () => {
        speechRecognitionRef.current = null;
        // Automatically keep listening alive throughout the call
        if (isCallActiveRef.current && !isMutedRef.current) {
          setTimeout(() => {
            if (isCallActiveRef.current && !isMutedRef.current && !speechRecognitionRef.current) {
              startLiveListening(languageRef.current);
            }
          }, 250);
        }
      },
      () => {
        // onSpeechStart: Barge-In — pause Arohi speaking the instant user starts talking
        stopSpeech();
        setBargeInTriggered(true);
        setCallStatus("listening");
      }
    );
  };

  // Play Spoken Audio manually
  const handleManualSpeak = (text: string) => {
    const detected = detectIndianLanguageFromText(text, language);
    speakText({
      text,
      language: detected,
    });
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)]">
      {/* FLOATING TRIGGER BUTTON WITH HOVER-ONLY GLASS TOOLTIP (NEVER OBSTRUCTS LECTURE TEXT) */}
      {!isOpen && (
        <div className="flex items-center gap-2.5 group">
          {/* Ask Arohi Floating Glass Pill — reveals smoothly on hover */}
          <div
            className="glass-vision text-white px-3.5 py-2 rounded-full flex items-center gap-2 text-[11px] font-bold cursor-pointer opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-200"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-amber-300 font-extrabold">Ask Arohi</span>
            <span className="text-slate-200 hidden sm:inline">Voice &amp; Chat Coach</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
          </div>

          {/* Apple Intelligence Aurora Ring Trigger Orb */}
          <button
            id="btn-arohi-floating-trigger"
            onClick={() => setIsOpen(true)}
            className="aurora-ring w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 shadow-2xl hover:scale-105 transition duration-300 relative cursor-pointer shrink-0"
            title="Arohi Career AI - Voice Call & Chat Assistant"
          >
            <div className="w-full h-full bg-slate-950/95 backdrop-blur-xl rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                👩‍💼
              </div>
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
            </div>
          </button>
        </div>
      )}

      {/* EXPANDED FROSTED LIQUID GLASS AGENT DRAWER */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[420px] h-[82vh] max-h-[610px] sm:h-[590px] bg-white/82 backdrop-blur-3xl border border-white/85 rounded-[2rem] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_32px_70px_-18px_rgba(15,23,42,0.34)] flex flex-col overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* HEADER */}
          <div className="bg-white/60 backdrop-blur-2xl border-b border-slate-900/8 p-3.5 sm:p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative aurora-ring rounded-full p-0.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 flex items-center justify-center text-white text-sm sm:text-base font-bold">
                  👩‍💼
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 tracking-tight">Arohi AI</h3>
                  <span className="text-[9px] sm:text-[10px] bg-indigo-500/12 text-indigo-700 border border-indigo-300/60 px-2 py-0.5 rounded-full font-bold">
                    Career Coach
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500">
                  Recruits.org.in • Powered by{" "}
                  <a
                    href="https://arohiai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    arohiai.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SECONDARY CONTROL BAR: LANGUAGES & TABS */}
          <div className="bg-white/50 backdrop-blur-xl border-b border-slate-900/8 px-3 sm:px-4 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 shrink-0">
            {/* Call / Chat Tabs & Daily Digest */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <div className="flex bg-slate-900/6 p-0.5 sm:p-1 rounded-full border border-white/80">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeTab === "chat"
                      ? "btn-apple-primary text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Chat
                </button>

                <button
                  onClick={() => {
                    setActiveTab("call");
                    if (!isCallActive) handleStartVoiceCall();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeTab === "call"
                      ? "btn-apple-primary text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Voice Call
                </button>
              </div>

              <button
                onClick={handleGenerateDailyJobsDigest}
                disabled={loadingResponse}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50"
                title="Get Today's 5 Curated Job Matches"
              >
                <Newspaper className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700" /> Daily Digest
              </button>
            </div>

            {/* All 9 Indian Languages Selector (Prioritized Odia, Hindi, Indian English) */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-300 text-[10px] sm:text-[11px]">
              <Globe className="w-3 h-3 text-emerald-600 shrink-0" />
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value as LanguageCode;
                  languageRef.current = newLang;
                  setLanguage(newLang);
                  if (speechRecognitionRef.current) {
                    try {
                      speechRecognitionRef.current.stop();
                    } catch (_err) {
                      // Restart with new language via onend
                    }
                  }
                }}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
                title="Select Indian Voice & Chat Language"
              >
                <option value="or" className="bg-white text-slate-800">ଓଡ଼ିଆ (Odia)</option>
                <option value="hi" className="bg-white text-slate-800">हिंदी (Hindi)</option>
                <option value="en" className="bg-white text-slate-800">English (India)</option>
                <option value="bn" className="bg-white text-slate-800">বাংলা (Bengali)</option>
                <option value="te" className="bg-white text-slate-800">తెలుగు (Telugu)</option>
                <option value="ta" className="bg-white text-slate-800">தமிழ் (Tamil)</option>
                <option value="mr" className="bg-white text-slate-800">मराठी (Marathi)</option>
                <option value="gu" className="bg-white text-slate-800">ગુજરાતી (Gujarati)</option>
                <option value="kn" className="bg-white text-slate-800">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* VOICE CALL TAB VIEW */}
            {activeTab === "call" && (
              <div className="h-full flex flex-col justify-between items-center py-2 text-center space-y-4">
                <div className="space-y-2">
                  <div className="aurora-ring w-22 h-22 rounded-full p-1 mx-auto shadow-2xl relative">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl">
                      👩‍💼
                    </div>
                    {isCallActive && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-extrabold tracking-tight text-slate-950">Arohi AI Voice Call</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {isCallActive
                      ? callStatus === "connecting"
                        ? "Connecting live Gemini voice channel..."
                        : callStatus === "speaking"
                        ? "Arohi is speaking (Speak anytime to interrupt)..."
                        : callStatus === "listening"
                        ? bargeInTriggered
                          ? "Paused for you — Listening to your question..."
                          : "Listening live across all Indian languages..."
                        : callStatus === "thinking"
                        ? "Understanding & replying in your language..."
                        : "Call Active"
                      : "Real-time bidirectional voice across all Indian languages"}
                  </p>

                  {isCallActive && (
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                        <span>{formatTimer(callDuration)}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {liveEngineLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* LIVE RECOGNIZED SPEECH PREVIEW, SUBTITLE OR BARGE-IN INTERRUPT BUTTON */}
                {isCallActive && (
                  <div className="w-full px-3 space-y-2">
                    {liveArohiSubtitle && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-3 py-2 text-xs text-indigo-950 font-medium text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-0.5">
                          Arohi Spoken Caption:
                        </span>
                        {liveArohiSubtitle}
                      </div>
                    )}
                    {liveUserTranscript ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2 text-xs text-emerald-900 font-medium shadow-inner">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                          Hearing You Live:
                        </span>
                        "{liveUserTranscript}"
                      </div>
                    ) : callStatus === "speaking" ? (
                      <button
                        type="button"
                        onClick={handleBargeInInterrupt}
                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                        Interrupt Arohi &amp; Speak Now
                      </button>
                    ) : null}
                  </div>
                )}

                {/* ANIMATED SOUND WAVE VISUALIZER */}
                <div className="flex items-center justify-center gap-1.5 h-12 w-full px-8">
                  {waveHeights.map((h, idx) => (
                    <div
                      key={idx}
                      className="w-2.5 bg-gradient-to-t from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-150 shadow-sm"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>

                {/* QUICK MULTILINGUAL VOICE TOPIC SUGGESTION CHIPS */}
                <div className="w-full space-y-1.5 px-2">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    Tap or Speak in Odia, Hindi, or English
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {[
                      {
                        label: "ଓଡ଼ିଆରେ କଥା ହୁଅନ୍ତୁ (Odia)",
                        prompt: "ନମସ୍କାର ଆରୋହୀ ଦିଦି, ମୋତେ ଓଡ଼ିଶା ସରକାରୀ ଏବଂ କମ୍ପାନୀ ଚାକିରି ବିଷୟରେ ଓଡ଼ିଆରେ କୁହନ୍ତୁ।",
                      },
                      {
                        label: "हिंदी में बात करें (Hindi)",
                        prompt: "नमस्ते आरोही जी, मुझे सरकारी नौकरी और प्राइवेट प्लेसमेंट की तैयारी के बारे में हिंदी में बताइए।",
                      },
                      {
                        label: "Fix Resume ATS",
                        prompt: "How can I improve my Resume ATS Score for MNCs?",
                      },
                      {
                        label: "Salary Negotiation",
                        prompt: "How should I negotiate a higher CTC package?",
                      },
                    ].map((topic) => (
                      <button
                        key={topic.label}
                        onClick={() => {
                          if (!isCallActive) {
                            handleStartVoiceCall();
                            return;
                          }
                          if (liveClientRef.current?.isActive()) {
                            liveClientRef.current.sendTextTurn(topic.prompt);
                            setMessages((prev) => [
                              ...prev,
                              {
                                id: `live-u-${Date.now()}`,
                                sender: "user",
                                text: topic.prompt,
                                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              },
                            ]);
                          } else {
                            handleSendMessage(topic.prompt);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CALL CONTROL BUTTONS */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  {/* Mute Button */}
                  <button
                    onClick={() => {
                      const nextMute = !isMuted;
                      setIsMuted(nextMute);
                      isMutedRef.current = nextMute;
                      liveClientRef.current?.setMicMuted(nextMute);
                      if (nextMute && speechRecognitionRef.current) {
                        try {
                          speechRecognitionRef.current.stop();
                        } catch (_e) {
                          // Ignore
                        }
                        speechRecognitionRef.current = null;
                      } else if (!nextMute && isCallActiveRef.current && !liveClientRef.current?.isActive()) {
                        startLiveListening(languageRef.current);
                      }
                    }}
                    disabled={!isCallActive}
                    className={`p-3.5 rounded-2xl transition cursor-pointer ${
                      isMuted
                        ? "bg-rose-50 text-rose-600 border border-rose-300 shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                    title={isMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Start / End Call Main Button */}
                  {isCallActive ? (
                    <button
                      onClick={handleEndCall}
                      className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
                    >
                      <PhoneOff className="w-5 h-5" /> End Call
                    </button>
                  ) : (
                    <button
                      onClick={handleStartVoiceCall}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <Phone className="w-5 h-5" /> Start Voice Call
                    </button>
                  )}

                  {/* Speaker Mute Button */}
                  <button
                    onClick={() => {
                      const nextSpeakerMute = !isSpeakerMuted;
                      setIsSpeakerMuted(nextSpeakerMute);
                      liveClientRef.current?.setSpeakerMuted(nextSpeakerMute);
                      if (nextSpeakerMute) {
                        stopSpeech();
                      }
                    }}
                    className={`p-3.5 rounded-2xl transition cursor-pointer ${
                      isSpeakerMuted
                        ? "bg-amber-50 text-amber-700 border border-amber-300 shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                    title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
                  >
                    {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* LIVE AI CHAT TAB VIEW */}
            {activeTab === "chat" && (
              <div className="space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-1.5 shadow-md ${
                        msg.sender === "user"
                          ? "btn-apple-primary text-white rounded-br-sm"
                          : "glass-vision text-slate-100 rounded-bl-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                        <span className="font-bold flex items-center gap-1 text-[10px] opacity-80">
                          {msg.sender === "user" ? (
                            <>
                              <User className="w-3 h-3" /> You
                            </>
                          ) : (
                            <>
                              <Bot className="w-3 h-3 text-amber-300" /> Arohi Coach
                            </>
                          )}
                        </span>
                        <span className="text-[9px] opacity-60">{msg.timestamp}</span>
                      </div>

                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                      {/* DAILY JOBS DIGEST RICH CARDS */}
                      {msg.digestJobs && msg.digestJobs.length > 0 && (
                        <div className="mt-2.5 space-y-2 border-t border-slate-800/80 pt-2.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                            <span className="flex items-center gap-1">
                              <Newspaper className="w-3.5 h-3.5" /> Top 5 Job Matches Today
                            </span>
                            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-md text-amber-300 border border-amber-500/40">
                              Curated by Arohi AI
                            </span>
                          </div>

                          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                            {msg.digestJobs.map((job, jIdx) => (
                              <div
                                key={job.id || jIdx}
                                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-2.5 space-y-1.5 transition text-[11px]"
                              >
                                <div className="flex items-start justify-between gap-1.5">
                                  <div>
                                    <h5 className="font-bold text-white text-[11px] leading-tight line-clamp-1">
                                      {job.title}
                                    </h5>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                      {job.organization}
                                    </p>
                                  </div>

                                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">
                                    {job.matchPercentage || 95}% Match
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300">
                                  <span className="flex items-center gap-0.5 text-slate-400">
                                    <MapPin className="w-2.5 h-2.5 text-amber-400" /> {job.location}
                                  </span>
                                  <span className="flex items-center gap-0.5 text-slate-400">
                                    <IndianRupee className="w-2.5 h-2.5 text-emerald-400" /> {job.salary}
                                  </span>
                                </div>

                                {job.whyMatched && (
                                  <p className="text-[10px] text-emerald-300/90 italic bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-900/50">
                                    💡 Arohi Note: {job.whyMatched}
                                  </p>
                                )}

                                <div className="pt-1 flex items-center justify-between text-[10px] border-t border-slate-800/60">
                                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5 text-slate-400" /> Last Date: {job.deadline}
                                  </span>
                                  <a
                                    href={job.applyUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 hover:underline"
                                  >
                                    Apply / Details <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.sender === "arohi" && (
                        <div className="pt-1 flex items-center justify-between text-[10px] border-t border-slate-800">
                          <button
                            onClick={() =>
                              handleManualSpeak(msg.spokenSummary || msg.text)
                            }
                            className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
                          >
                            <Volume2 className="w-3 h-3" /> Listen Voice
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loadingResponse && (
                  <div className="flex items-center gap-2 text-xs text-amber-300 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-fit">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Arohi is thinking your career guidance...
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}
          </div>

          {/* CHAT INPUT FOOTER */}
          {activeTab === "chat" && (
            <div className="p-3 bg-white/65 backdrop-blur-2xl border-t border-slate-900/8 space-y-2 shrink-0">
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
                <button
                  onClick={handleGenerateDailyJobsDigest}
                  className="bg-amber-400/18 hover:bg-amber-400/30 text-amber-950 border border-amber-300/60 px-2.5 py-1 rounded-full shrink-0 transition font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Newspaper className="w-3 h-3 text-amber-700" /> Daily Digest
                </button>

                {[
                  { label: "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି", prompt: "ମୋତେ ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି ବିଷୟରେ କୁହ।" },
                  { label: "UPSC / SSC Prep", prompt: "How to prepare for UPSC Civil Services and SSC CGL?" },
                  { label: "Salary Negotiation", prompt: "How should I negotiate a higher CTC salary offer?" },
                ].map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-full shrink-0 transition shadow-2xs cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={
                    language === "or"
                      ? "ଆରୋହୀଙ୍କୁ ପଚାରନ୍ତୁ..."
                      : language === "hi"
                      ? "आरोही से पूछें..."
                      : "Ask Arohi anything..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-white/90 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 shadow-2xs"
                />

                <button
                  type="button"
                  onClick={handleStartVoiceCall}
                  className="p-2 bg-white/85 hover:bg-white border border-slate-200 text-indigo-600 rounded-full transition cursor-pointer"
                  title="Voice Mode"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim() || loadingResponse}
                  className="p-2 btn-apple-primary text-white rounded-full disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* CORPORATE ATTRIBUTION FOOTER STRIP */}
          <div className="apple-mesh-dark text-slate-300 px-3.5 py-2 text-[10px] flex items-center justify-between border-t border-white/10 shrink-0">
            <span className="truncate">
              By <strong className="text-white font-bold">Quench Research Labs Pvt. Ltd.</strong>
            </span>
            <a
              href="https://arohiai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-extrabold underline shrink-0 ml-2"
            >
              arohiai.com ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
