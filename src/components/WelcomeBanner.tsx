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
    "Hi, I'm Arohi, your personal career companion on Recruits.org.in. Built on arohiai.com by Quench Research Labs Private Limited, I'm here to guide you at every stage of your career.";

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
    <div className="relative overflow-hidden glass-apple rounded-[2rem] p-6 sm:p-8 text-slate-900 mb-6 group">
      {/* Subtle Luminous Ambient Glows */}
      <div className="absolute -top-32 -right-24 w-96 h-96 bg-gradient-to-br from-sky-400/18 via-indigo-400/16 to-purple-400/10 rounded-full blur-[90px] pointer-events-none group-hover:opacity-100 transition duration-700" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-300/14 via-rose-300/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/75 backdrop-blur-xl border border-white/90 text-indigo-700 text-[11px] font-bold px-3.5 py-1 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              Recruits.org.in • Powered by{" "}
              <a
                href="https://arohiai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-extrabold hover:text-indigo-950"
              >
                Arohi
              </a>{" "}
              (Quench Research Labs Pvt. Ltd.)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.035em] text-slate-950 font-sans leading-[1.1]">
            {roleMode === "candidate" ? (
              <>
                Where India Trains.{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                  Where India Gets Hired.
                </span>
              </>
            ) : (
              <>
                Next-Gen{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                  Recruiter &amp; Talent Intelligence
                </span>
              </>
            )}
          </h1>

          <div className="bg-white/60 backdrop-blur-xl border border-white/85 rounded-2xl p-4 sm:p-5 relative shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_18px_-6px_rgba(79,70,229,0.5)] text-white">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-2.5">
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                  "{introQuote}"
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <button
                    id="btn-voice-intro"
                    onClick={handlePlayVoiceIntro}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-white/85 hover:bg-white text-indigo-700 border border-indigo-200/80 px-3.5 py-1.5 rounded-full transition-all shadow-2xs cursor-pointer hover:-translate-y-0.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    {isSpeaking ? "Speaking Arohi Intro..." : "Listen to Arohi Voice Intro"}
                  </button>
                  <span className="text-[11px] text-slate-500 font-medium">
                    English, Hindi, Odia &amp; 6 Regional Languages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Frosted Glass Tiles */}
        <div className="w-full lg:w-auto grid grid-cols-2 gap-3 shrink-0">
          <button
            id="btn-quick-skillmastery"
            onClick={() => onSelectEngine("skillmastery")}
            className="glass-apple-card flex flex-col items-start p-4 rounded-2xl text-left group hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/12 border border-amber-400/30 flex items-center justify-center mb-2">
              <Trophy className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Skill Mastery</span>
            <span className="text-[10px] text-slate-500 font-medium">Earned Badges &amp; Goals</span>
          </button>

          <button
            id="btn-quick-nav"
            onClick={() => onSelectEngine("navigator")}
            className="glass-apple-card flex flex-col items-start p-4 rounded-2xl text-left group hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/12 border border-indigo-400/30 flex items-center justify-center mb-2">
              <Compass className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Career Navigator</span>
            <span className="text-[10px] text-slate-500 font-medium">Find ideal paths</span>
          </button>

          <button
            id="btn-quick-resume"
            onClick={() => onSelectEngine("resume")}
            className="glass-apple-card flex flex-col items-start p-4 rounded-2xl text-left group hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-500/12 border border-violet-400/30 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Resume AI</span>
            <span className="text-[10px] text-slate-500 font-medium">ATS Score &amp; Rewrite</span>
          </button>

          <button
            id="btn-quick-interview"
            onClick={() => onSelectEngine("interview")}
            className="glass-apple-card flex flex-col items-start p-4 rounded-2xl text-left group hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/12 border border-emerald-400/30 flex items-center justify-center mb-2">
              <Video className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">Interview Coach</span>
            <span className="text-[10px] text-slate-500 font-medium">Mock &amp; Tone Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
