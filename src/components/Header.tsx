import React, { useState, useEffect } from "react";
import {
  Sparkles,
  UserCheck,
  Building2,
  Globe,
  Database,
  VolumeX,
  Award,
  Home,
  Layers,
  User,
  PlusCircle,
  LogIn,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { UserRoleMode, LanguageCode, CareerScoreBreakdown, UserProfile } from "../types";
import { getStoredUserProfile } from "../utils/jobStorage";

interface HeaderProps {
  roleMode: UserRoleMode;
  onRoleModeChange: (mode: UserRoleMode) => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  careerScore: CareerScoreBreakdown;
  onOpenMemoryModal: () => void;
  onOpenScoreModal: () => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
  currentView?: "landing" | "workspace";
  onToggleView?: (view: "landing" | "workspace") => void;
  onOpenAuthModal?: (initialRole?: UserRoleMode) => void;
  onOpenRecruiterJobPosting?: () => void;
  onNavigateToEngine?: (engineId: string) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी" },
  { code: "or", label: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", label: "Kannada", nativeName: "କన్నଡ" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
  { code: "gu", label: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা" },
];

export const Header: React.FC<HeaderProps> = ({
  roleMode,
  onRoleModeChange,
  selectedLanguage,
  onLanguageChange,
  careerScore,
  onOpenMemoryModal,
  onOpenScoreModal,
  isSpeaking,
  onStopSpeech,
  currentView = "landing",
  onToggleView,
  onOpenAuthModal,
  onOpenRecruiterJobPosting,
  onNavigateToEngine,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(getStoredUserProfile());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthUpdated = () => {
      setUserProfile(getStoredUserProfile());
    };
    window.addEventListener("arohi_user_auth_updated", handleAuthUpdated);
    return () => window.removeEventListener("arohi_user_auth_updated", handleAuthUpdated);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (engineId?: string) => {
    if (engineId && onNavigateToEngine) {
      onNavigateToEngine(engineId);
    } else {
      onToggleView?.("landing");
    }
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 text-slate-900 px-4 sm:px-6 py-2.5 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Platform Title */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => handleNavClick()}
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20 tracking-tighter">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
                RECRUITS.ORG.IN
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide -mt-0.5">
              AI Employment Ecosystem • Recruits.org.in
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs font-bold text-slate-700">
          <button
            onClick={() => handleNavClick("liveindiajobs")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Jobs
          </button>
          <button
            onClick={() => handleNavClick("liveindiajobs")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Government Jobs
          </button>
          <button
            onClick={() => handleNavClick("jobmatch")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Companies
          </button>
          <button
            onClick={() => handleNavClick("navigator")}
            className="hover:text-blue-600 transition cursor-pointer flex items-center gap-1"
          >
            <span>Career AI</span>
            <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
              New
            </span>
          </button>
          <button
            onClick={() => handleNavClick("resume")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Resume Builder
          </button>
          <button
            onClick={() => handleNavClick("skillmastery")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Skill Tests
          </button>
          <button
            onClick={() => handleNavClick("learning")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Courses
          </button>
          <button
            onClick={() => handleNavClick("salary")}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Right Header Controls: Theme + Login + Register + Score + Hamburger Menu */}
        <div className="flex items-center gap-2">
          {/* Quick Score Badge */}
          {roleMode === "candidate" && (
            <button
              id="btn-career-score-pill-header"
              onClick={() => {
                onOpenScoreModal();
                closeMenu();
              }}
              className="hidden md:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              title="View Career Score"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Score: <strong className="text-amber-950 font-black">{careerScore.totalScore}</strong></span>
            </button>
          )}

          {/* User Sign In / Register Buttons matching mockup */}
          {userProfile ? (
            <button
              onClick={() => {
                onOpenAuthModal?.(userProfile.role);
                closeMenu();
              }}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[90px]">{userProfile.name}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onOpenAuthModal?.(roleMode);
                  closeMenu();
                }}
                className="text-xs font-extrabold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenAuthModal?.(roleMode);
                  closeMenu();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

          {/* Audio Voice Mute Indicator */}
          {isSpeaking && (
            <button
              onClick={onStopSpeech}
              className="flex items-center gap-1 bg-rose-500/20 border border-rose-500/40 text-rose-700 px-2.5 py-1.5 rounded-xl text-xs font-bold animate-pulse cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mute Voice</span>
            </button>
          )}

          {/* ☰ THREE BAR MENU BUTTON */}
          <button
            id="btn-header-hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer border ${
              isMenuOpen
                ? "bg-indigo-600 text-white border-indigo-700 shadow-indigo-600/30"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? (
              <>
                <X className="w-4 h-4 text-white" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-indigo-600" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* EXPANDABLE MENU DRAWER / DROPDOWN PANEL */}
      {isMenuOpen && (
        <div className="max-w-7xl mx-auto mt-3 pt-4 pb-2 border-t border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 bg-slate-50/90 rounded-2xl border border-slate-200/90 shadow-lg">
            
            {/* Section 1: Portal Navigation */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Portal Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onToggleView?.("landing");
                    closeMenu();
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    currentView === "landing"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <Home className="w-4 h-4" /> Home
                </button>
                <button
                  onClick={() => {
                    onToggleView?.("workspace");
                    closeMenu();
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    currentView === "workspace"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <Layers className="w-4 h-4" /> AI Workspace
                </button>
              </div>
            </div>

            {/* Section 2: Account Role Mode */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Role Mode
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onRoleModeChange("candidate");
                    closeMenu();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    roleMode === "candidate"
                      ? "bg-indigo-50 text-indigo-900 border-indigo-300 font-black shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" /> Candidate / Job Seeker
                  </span>
                  {roleMode === "candidate" && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </button>
                <button
                  onClick={() => {
                    onRoleModeChange("recruiter");
                    closeMenu();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    roleMode === "recruiter"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-black shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Recruiter / Employer
                  </span>
                  {roleMode === "recruiter" && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                </button>
              </div>
            </div>

            {/* Section 3: Employer & Account Actions */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Account & Hiring
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onOpenRecruiterJobPosting?.();
                    closeMenu();
                  }}
                  className="flex items-center justify-between p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold transition shadow-xs cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> + Post Free Job Opening
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>

                {userProfile ? (
                  <button
                    onClick={() => {
                      onOpenAuthModal?.(userProfile.role);
                      closeMenu();
                    }}
                    className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-300"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" /> Account: {userProfile.name}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuthModal?.(roleMode);
                      closeMenu();
                    }}
                    className="flex items-center justify-between p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-extrabold transition cursor-pointer border border-indigo-200"
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4 text-indigo-600" /> Sign Up / Log In
                    </span>
                    <ChevronRight className="w-4 h-4 text-indigo-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Section 4: Intelligence & Language Settings */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Career Score & Language
              </span>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onOpenScoreModal();
                      closeMenu();
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-600" /> Score: {careerScore.totalScore}/100
                  </button>
                  <button
                    onClick={() => {
                      onOpenMemoryModal();
                      closeMenu();
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-indigo-600" /> Memory
                  </button>
                </div>

                {/* Multilingual Selector */}
                <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs">
                  <Globe className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      onLanguageChange(e.target.value as LanguageCode);
                    }}
                    className="bg-transparent text-xs text-slate-900 focus:outline-none cursor-pointer font-bold w-full"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-white text-slate-900 font-medium">
                        {lang.nativeName} ({lang.label})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
