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
import { speakText, stopSpeech, listenToVoiceInput, playCallChime, isOdiaText } from "../utils/speech";

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
    "idle" | "listening" | "thinking" | "speaking"
  >("idle");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome-01",
      sender: "arohi",
      text: "Namaste! 🙏 I'm Arohi, your personal Career Coach & Guide on Recruits.org.in (Quench Research Labs Private Limited • Powered by arohiai.com). Whether you're preparing for OPSC, UPSC, SSC & Banking exams or aiming for top MNC placements at Tata, Infosys, Wipro, HDFC Bank, or Reliance—I'm right here with you like a supportive elder sister and mentor! How can we start your preparation today?",
      spokenSummary: "Namaste! I'm Arohi, your career guide on Recruits.org.in. Tell me, how can we start your career preparation today?",
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
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);

  // Language greeting updates across all Indian languages (zero age or artificial model mentions)
  useEffect(() => {
    const languageGreetings: Record<
      string,
      { text: string; spokenSummary: string }
    > = {
      or: {
        text: "ନମସ୍କାର! 🙏 ମୁଁ ଆରୋହୀ, ଆପଣଙ୍କ ନିଜର କ୍ୟାରିଅର୍ ଦିଦି ଓ ଗାଇଡ୍! ଓଡ଼ିଶାର OPSC, OSSC ତଥା ସମଗ୍ର ଭାରତର UPSC, SSC, ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଏବଂ TCS, Infosys, Wipro ଭଳି ଟପ୍ କମ୍ପାନୀ ଚାକିରି ପାଇଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବାକୁ ମୁଁ ସଦା ପ୍ରସ୍ତୁତ। ନିଶ୍ଚୟ ପଚାରନ୍ତୁ, ଆଜି ଆମେ କେଉଁଠୁ ଆରମ୍ଭ କରିବା?",
        spokenSummary:
          "ନମସ୍କାର! ମୁଁ ଆରୋହୀ, ଆପଣଙ୍କ ନିଜର କ୍ୟାରିଅର୍ ଗାଇଡ୍। କୁହନ୍ତୁ, ଆଜି ଆମେ କେଉଁ ବିଷୟରେ କଥା ହେବା?",
      },
      hi: {
        text: "नमस्ते जी! 🙏 मैं आरोही हूँ, आपकी अपनी करियर कोच और गाइड! चाहे UPSC, SSC, बैंकिंग जैसी सरकारी परीक्षा की तैयारी हो या TCS, Infosys, Wipro, HDFC Bank जैसी टॉप कंपनियों में प्लेसमेंट—आपकी मेहनत ज़रूर रंग लाएगी। बताइए, आज हम किस लक्ष्य से शुरुआत करें?",
        spokenSummary:
          "नमस्ते जी! मैं आरोही हूँ, आपकी अपनी करियर गाइड। बताइए, आज मैं आपकी क्या मदद कर सकती हूँ?",
      },
      bn: {
        text: "নমস্কার! 🙏 আমি আরোহী, আপনার নিজের ক্যারিয়ার গাইড ও মেন্টর! সরকারি পরীক্ষা হোক বা TCS, Infosys, Wipro-র মতো শীর্ষ সংস্থায় চাকরি—আমি সবসময় আপনার পাশে আছি। বলুন, আজ কীভাবে আপনাকে সাহায্য করতে পারি?",
        spokenSummary: "নমস্কার! আমি আরোহী, আপনার ক্যারিয়ার গাইড। আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
      },
      te: {
        text: "నమస్కారం! 🙏 నేను ఆరోహిని, మీ కెరీర్ గైడ్ మరియు మెంటార్! ప్రభుత్వ ఉద్యోగాలైనా లేదా TCS, Infosys, Wipro వంటి టాప్ కంపెనీల ప్లేస్‌మెంట్స్ అయినా—నేను మీకు తోడుగా ఉంటాను. ఈరోజు మనం ఏ అంశంతో শুরু చేద్దాం?",
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
        spokenSummary: "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಹಿ, ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಕಿ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ സഹಾಯ ಮಾಡಲಿ?",
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

  // Send Message / Process Speech
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim() || loadingResponse) return;

    // Immediately stop any ongoing Arohi speech when user sends a new message
    stopSpeech();

    // Auto-detect Odia language in user input
    const textIsOdia = isOdiaText(textToSend);
    const activeLang: LanguageCode = textIsOdia ? "or" : language;

    if (textIsOdia && language !== "or") {
      setLanguage("or");
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
    if (isCallActive) setCallStatus("thinking");

    try {
      const res = await fetch("/api/ai/arohi-agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          mode: isCallActive ? "voice" : "chat",
          language: activeLang,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
          memory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const responseIsOdia = isOdiaText(data.shortSpokenSummary || data.responseText);
        const replyLang: LanguageCode = responseIsOdia ? "or" : activeLang;

        const arohiMsg: ChatMessage = {
          id: "arohi-" + Date.now(),
          sender: "arohi",
          text:
            data.responseText ||
            (replyLang === "or"
              ? "ମୁଁ ଆପଣଙ୍କ ସହିତ ଅଛି! ଆସନ୍ତୁ ଆମେ ଆଗକୁ ବଢ଼ିବା।"
              : "I'm right here with you! Let's keep moving forward with confidence."),
          spokenSummary: data.shortSpokenSummary || data.responseText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, arohiMsg]);

        // Speak back if in call mode or if speaker is unmuted
        if (isCallActive && !isSpeakerMuted) {
          setCallStatus("speaking");
          speakText({
            text: data.shortSpokenSummary || data.responseText,
            language: replyLang,
            onEnd: () => {
              if (isCallActive) {
                setCallStatus("listening");
                startLiveListening();
              }
            },
          });
        }
      }
    } catch (err) {
      console.error("Error talking with Arohi AI:", err);
    } finally {
      setLoadingResponse(false);
      if (isCallActive && callStatus === "thinking") {
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

        if (isCallActive && !isSpeakerMuted) {
          setCallStatus("speaking");
          speakText({
            text: data.spokenSummary || data.greeting,
            language,
            onEnd: () => {
              if (isCallActive) {
                setCallStatus("listening");
                startLiveListening();
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

  // Start Live Voice Call
  const handleStartVoiceCall = () => {
    playCallChime("ring");
    setIsCallActive(true);
    setActiveTab("call");
    setCallStatus("speaking");

    setTimeout(() => {
      playCallChime("connect");
      // Welcome Call Greeting Speech across Indian languages
      const welcomeByLang: Record<string, string> = {
        or: "ନମସ୍କାର! ମୁଁ ଆରୋହୀ, ଆପଣଙ୍କ କ୍ୟାରିଅର୍ ଗାଇଡ୍। ଆପଣଙ୍କ ସହ କଥା ହୋଇ ବହୁତ ଖୁସି ଲାଗିଲା! କୁହନ୍ତୁ, ଆଜି ଆପଣଙ୍କ କ୍ୟାରିଅର୍ ପାଇଁ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
        hi: "नमस्ते जी! मैं आरोही हूँ, आपकी अपनी करियर गाइड। आपसे बात करके बहुत खुशी हुई! बताइए, आज हम आपकी तैयारी में कैसे आगे बढ़ें?",
        bn: "নমস্কার! আমি আরোহী, আপনার ক্যারিয়ার গাইড। আপনার সাথে কথা বলে খুব ভালো লাগছে! বলুন, আজ কীভাবে সাহায্য করতে পারি?",
        te: "నమస్కారం! నేను ఆరోహిని, మీ కెరీర్ గైడ్. మీతో మాట్లాడటం చాలా సంతోషంగా ఉంది! ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
        ta: "வணக்கம்! நான் ஆரோஹி, உங்கள் தொழில் வழிகாட்டி. உங்களுடன் பேசுவதில் மிக்க மகிழ்ச்சி! இன்று நான் உங்களுக்கு எப்படி உதவலாம்?",
        mr: "नमस्कार! मी आरोही, तुमची करिअर गाईड. तुमच्याशी बोलून खूप आनंद झाला! सांगा, आज मी तुम्हाला कशी मदत करू शकते?",
        gu: "નમસ્તે! હું આરોહી છું, તમારી કારકિર્દી ગાઈડ. તમારી સાથે વાત કરીને ખૂબ આનંદ થયો! આજે હું તમને કેવી રીતે મદદ કરી શકું?",
        kn: "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಹಿ, ನಿಮ್ಮ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಕಿ. ನಿಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಲು ತುಂಬಾ ಸಂತೋಷವಾಗಿದೆ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
        en: "Namaste! I'm Arohi, your personal career guide on Recruits.org.in. It is so wonderful speaking with you! Tell me, how can I help with your exams or job placements today?",
      };
      const welcomeGreeting = welcomeByLang[language] || welcomeByLang.en;

      speakText({
        text: welcomeGreeting,
        language,
        onEnd: () => {
          setCallStatus("listening");
          startLiveListening();
        },
      });
    }, 400);
  };

  // End Voice Call
  const handleEndCall = () => {
    playCallChime("disconnect");
    stopSpeech();
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsCallActive(false);
    setCallStatus("idle");
  };

  // Start Voice Input Recognition
  const startLiveListening = () => {
    if (isMuted) return;

    speechRecognitionRef.current = listenToVoiceInput(
      language,
      (transcript, isFinal) => {
        // Interruption: Pause/stop Arohi speech as soon as user speaks
        stopSpeech();
        if (transcript.trim() && (isFinal || transcript.length > 20)) {
          handleSendMessage(transcript);
        }
      },
      (err) => {
        console.warn("Speech recognition notice:", err);
        if (isCallActive && callStatus !== "thinking") {
          setCallStatus("idle");
        }
      },
      () => {
        if (isCallActive && callStatus === "listening") {
          // Can restart listening loop if needed
        }
      },
      () => {
        // onSpeechStart: pause speaking instantly
        stopSpeech();
        setCallStatus("listening");
      }
    );
  };

  // Play Spoken Audio manually
  const handleManualSpeak = (text: string) => {
    speakText({
      text,
      language,
    });
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)]">
      {/* FLOATING TRIGGER BUTTON WITH ASK ME TAG */}
      {!isOpen && (
        <div className="flex items-center gap-2 sm:gap-3 group">
          {/* Ask Me Floating Badge */}
          <div
            className="bg-slate-900 border border-emerald-500/80 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-2xl flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold animate-bounce cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-300 font-extrabold">Ask Me!</span>
            <span className="text-slate-300 hidden sm:inline">Talk with Arohi AI Coach</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Trigger Circular Avatar Button */}
          <button
            id="btn-arohi-floating-trigger"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 rounded-full p-0.5 shadow-2xl hover:scale-105 transition duration-300 relative group cursor-pointer shrink-0"
            title="Arohi Career AI - Voice Call & Chat Assistant"
          >
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative overflow-hidden">
              {/* Smiling Female Avatar Graphic */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-emerald-400 flex items-center justify-center text-slate-900 font-extrabold text-base sm:text-lg shadow-inner">
                👩‍💼
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
          </button>
        </div>
      )}

      {/* EXPANDED FLOATING AGENT DRAWER / MODAL */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[420px] h-[82vh] max-h-[600px] sm:h-[580px] bg-white border border-slate-200 rounded-3xl text-slate-900 shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* HEADER */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-emerald-400 flex items-center justify-center text-slate-900 text-sm sm:text-base font-bold shadow-md">
                  👩‍💼
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Arohi AI</h3>
                  <span className="text-[9px] sm:text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-300 px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                    Indian Career Coach
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
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-200/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SECONDARY CONTROL BAR: LANGUAGES & TABS */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 shrink-0">
            {/* Call / Chat Tabs & Daily Digest */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <div className="flex bg-slate-200/80 p-0.5 sm:p-1 rounded-xl border border-slate-300">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1 ${
                    activeTab === "chat"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Chat
                </button>

                <button
                  onClick={() => {
                    setActiveTab("call");
                    if (!isCallActive) handleStartVoiceCall();
                  }}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1 ${
                    activeTab === "call"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
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
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
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
              <div className="h-full flex flex-col justify-between items-center py-4 text-center space-y-6">
                <div className="space-y-2">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-1 mx-auto shadow-2xl relative">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl">
                      👩‍💼
                    </div>
                    {isCallActive && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900">Arohi AI Voice Call</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {isCallActive
                      ? callStatus === "speaking"
                        ? "Arohi is speaking..."
                        : callStatus === "listening"
                        ? "Listening to you live..."
                        : callStatus === "thinking"
                        ? "Crafting advice..."
                        : "Call Active"
                      : "Ready to start friendly voice conversation"}
                  </p>

                  {isCallActive && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                      <span>{formatTimer(callDuration)}</span>
                    </div>
                  )}
                </div>

                {/* ANIMATED SOUND WAVE VISUALIZER */}
                <div className="flex items-center justify-center gap-1.5 h-14 w-full px-8">
                  {waveHeights.map((h, idx) => (
                    <div
                      key={idx}
                      className="w-2.5 bg-gradient-to-t from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-150 shadow-sm"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>

                {/* QUICK VOICE TOPIC SUGGESTION CHIPS */}
                <div className="w-full space-y-1.5 px-2">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    Quick Voice Topics
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {[
                      "OPSC & Govt Jobs Strategy",
                      "Fix my Resume ATS Score",
                      "30s Tech Quick Quiz",
                      "Salary CTC Negotiation",
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          if (!isCallActive) handleStartVoiceCall();
                          handleSendMessage(topic);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CALL CONTROL BUTTONS */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
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
                    onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
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
                          ? "bg-emerald-600 text-white rounded-br-none"
                          : "bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none"
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
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2 shrink-0">
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                <button
                  onClick={handleGenerateDailyJobsDigest}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg shrink-0 transition font-bold flex items-center gap-1"
                >
                  <Newspaper className="w-3 h-3 text-amber-700" /> 📰 Daily Digest
                </button>

                {[
                  { label: "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି", prompt: "ମୋତେ ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି ବିଷୟରେ କୁହ।" },
                  { label: "UPSC / SSC Prep", prompt: "How to prepare for UPSC Civil Services and SSC CGL?" },
                  { label: "Salary Negotiation", prompt: "How should I negotiate a higher CTC salary offer?" },
                ].map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0 transition shadow-sm"
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
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                />

                <button
                  type="button"
                  onClick={handleStartVoiceCall}
                  className="p-2 bg-slate-200 hover:bg-slate-300 text-amber-700 rounded-xl transition"
                  title="Voice Mode"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim() || loadingResponse}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* CORPORATE ATTRIBUTION FOOTER STRIP */}
          <div className="bg-slate-900 text-slate-300 px-3 py-1.5 text-[10px] flex items-center justify-between border-t border-slate-800 shrink-0">
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
