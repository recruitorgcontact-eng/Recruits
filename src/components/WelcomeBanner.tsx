import React from "react";
import { Sparkles, Volume2, Mic, Bot, Compass, FileText, Video, Target, ArrowRight, Trophy } from "lucide-react";
import { UserRoleMode, LanguageCode } from "../types";
import { speakText } from "../utils/speech";

interface WelcomeBannerProps {
  roleMode: UserRoleMode;
  selectedLanguage: LanguageCode;
  onSelectEngine: (engineId: string) => void;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  roleMode,
  selectedLanguage,
  onSelectEngine,
  isSpeaking,
  setIsSpeaking,
}) => {
  const introQuote =
    "Hi, I'm Arohi Career AI, your personal career companion on Recruits.org.in. I specialize in careers, hiring, skills, learning, and professional growth. Built on the Arohi AI platform, I'm here to guide you at every stage of your career.";

  const handlePlayVoiceIntro = () => {
    setIsSpeaking(true);
    speakText({
      text: introQuote,
      language: selectedLanguage,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="relative overflow-hidden bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-md mb-8 group">
      {/* Background Subtle Ambient Lights */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition duration-700" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition duration-700" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3.5 py-1 rounded-full backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Recruits.org.in Intelligence Engine
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 font-sans leading-tight">
            {roleMode === "candidate" ? (
              <>
                Your Dedicated <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">AI Career Officer</span>
              </>
            ) : (
              <>
                Next-Gen <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">Recruiter & Talent Intelligence</span>
              </>
            )}
          </h1>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 relative shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md text-white">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-sans font-medium">
                  "{introQuote}"
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    id="btn-voice-intro"
                    onClick={handlePlayVoiceIntro}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-300 px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-700" />
                    {isSpeaking ? "Speaking Arohi Intro..." : "Listen to Arohi Voice Intro"}
                  </button>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Supports English, Hindi & 6 Regional Languages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="w-full lg:w-auto grid grid-cols-2 gap-2.5 shrink-0">
          <button
            id="btn-quick-skillmastery"
            onClick={() => onSelectEngine("skillmastery")}
            className="flex flex-col items-start p-3.5 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 rounded-2xl transition-all duration-200 text-left group shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-amber-950">Skill Mastery</span>
            <span className="text-[10px] text-amber-800 font-medium">Earned Badges & Goals</span>
          </button>

          <button
            id="btn-quick-nav"
            onClick={() => onSelectEngine("navigator")}
            className="flex flex-col items-start p-3.5 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 rounded-2xl transition-all duration-200 text-left group shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <Compass className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-indigo-950">Career Navigator</span>
            <span className="text-[10px] text-indigo-700 font-medium">Find ideal paths</span>
          </button>

          <button
            id="btn-quick-resume"
            onClick={() => onSelectEngine("resume")}
            className="flex flex-col items-start p-3.5 bg-purple-50/80 hover:bg-purple-100 border border-purple-200 rounded-2xl transition-all duration-200 text-left group shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <FileText className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-purple-950">Resume AI</span>
            <span className="text-[10px] text-purple-700 font-medium">ATS Score & Rewrite</span>
          </button>

          <button
            id="btn-quick-interview"
            onClick={() => onSelectEngine("interview")}
            className="flex flex-col items-start p-3.5 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-all duration-200 text-left group shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <Video className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-emerald-950">Interview Coach</span>
            <span className="text-[10px] text-emerald-700 font-medium">Mock & Tone Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
