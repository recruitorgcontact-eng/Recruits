import React, { useState } from "react";
import { UserRoleMode, LanguageCode, CareerMemory, CareerScoreBreakdown } from "./types";
import { DEFAULT_CAREER_MEMORY, INITIAL_CAREER_SCORE } from "./data/mockData";
import { Header } from "./components/Header";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { EngineSelector } from "./components/EngineSelector";
import { CareerScoreCard } from "./components/CareerScoreCard";
import { CareerMemoryModal } from "./components/CareerMemoryModal";
import { HeroLandingPage } from "./components/HeroLandingPage";

import { CareerNavigatorEngine } from "./components/engines/CareerNavigatorEngine";
import { CareerPathVisualizerEngine } from "./components/engines/CareerPathVisualizerEngine";
import { JobMatchEngine } from "./components/engines/JobMatchEngine";
import { ResumeIntelligenceEngine } from "./components/engines/ResumeIntelligenceEngine";
import { InterviewCoachEngine } from "./components/engines/InterviewCoachEngine";
import { SkillGapEngine } from "./components/engines/SkillGapEngine";
import { LearningAdvisorEngine } from "./components/engines/LearningAdvisorEngine";
import { SalaryIntelligenceEngine } from "./components/engines/SalaryIntelligenceEngine";
import { CareerMentorEngine } from "./components/engines/CareerMentorEngine";
import { RecruiterAssistantEngine } from "./components/engines/RecruiterAssistantEngine";
import { LiveIndiaJobsEngine } from "./components/engines/LiveIndiaJobsEngine";
import { SkillMastery } from "./components/SkillMastery";
import { ArohiFloatingAgent } from "./components/ArohiFloatingAgent";
import { AuthModal } from "./components/AuthModal";
import { stopSpeech } from "./utils/speech";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "workspace">("landing");
  const [roleMode, setRoleMode] = useState<UserRoleMode>("candidate");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const [activeEngineId, setActiveEngineId] = useState<string>("liveindiajobs");

  const [careerMemory, setCareerMemory] = useState<CareerMemory>(DEFAULT_CAREER_MEMORY);
  const [careerScore, setCareerScore] = useState<CareerScoreBreakdown>(INITIAL_CAREER_SCORE);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRoleMode>("candidate");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);

  const handleStopSpeech = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const handleRoleModeChange = (newMode: UserRoleMode) => {
    setRoleMode(newMode);
    if (newMode === "recruiter") {
      setActiveEngineId("recruiter");
    } else {
      setActiveEngineId("navigator");
    }
  };

  const handleRefreshScore = async () => {
    setIsCalculatingScore(true);
    try {
      const res = await fetch("/api/ai/career-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memory: careerMemory }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.careerScore) {
          setCareerScore(data.careerScore);
        }
      }
    } catch (err) {
      console.error("Error refreshing career score:", err);
    } finally {
      setIsCalculatingScore(false);
    }
  };

  const renderActiveEngine = () => {
    switch (activeEngineId) {
      case "liveindiajobs":
        return <LiveIndiaJobsEngine memory={careerMemory} />;
      case "pathvisualizer":
        return (
          <CareerPathVisualizerEngine
            memory={careerMemory}
            selectedLanguage={selectedLanguage}
            onUpdateMemory={(updated) => {
              setCareerMemory(updated);
              handleRefreshScore();
            }}
          />
        );
      case "skillmastery":
        return (
          <SkillMastery
            memory={careerMemory}
            onUpdateMemory={(updated) => {
              setCareerMemory(updated);
              handleRefreshScore();
            }}
            onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
          />
        );
      case "navigator":
        return (
          <CareerNavigatorEngine
            memory={careerMemory}
            selectedLanguage={selectedLanguage}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        );
      case "jobmatch":
        return (
          <JobMatchEngine
            memory={careerMemory}
            onApplyWithAI={(jobTitle) => {
              setActiveEngineId("resume");
            }}
          />
        );
      case "resume":
        return (
          <ResumeIntelligenceEngine
            memory={careerMemory}
            onUpdateMemory={(updated) => {
              setCareerMemory(updated);
              handleRefreshScore();
            }}
          />
        );
      case "interview":
        return (
          <InterviewCoachEngine
            memory={careerMemory}
            selectedLanguage={selectedLanguage}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        );
      case "skillgap":
        return <SkillGapEngine memory={careerMemory} />;
      case "learning":
        return <LearningAdvisorEngine memory={careerMemory} />;
      case "salary":
        return <SalaryIntelligenceEngine memory={careerMemory} />;
      case "mentor":
        return (
          <CareerMentorEngine
            memory={careerMemory}
            selectedLanguage={selectedLanguage}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        );
      case "recruiter":
        return <RecruiterAssistantEngine memory={careerMemory} />;
      default:
        return (
          <CareerNavigatorEngine
            memory={careerMemory}
            selectedLanguage={selectedLanguage}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-amber-50/70 text-slate-800 font-sans antialiased selection:bg-indigo-600 selection:text-white pb-20 relative overflow-x-hidden">
      {/* Ambient colorful background light halos */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-200/40 via-purple-200/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Header */}
      <Header
        roleMode={roleMode}
        onRoleModeChange={handleRoleModeChange}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        careerScore={careerScore}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        onOpenScoreModal={() => setIsScoreModalOpen(true)}
        isSpeaking={isSpeaking}
        onStopSpeech={handleStopSpeech}
        currentView={currentView}
        onToggleView={setCurrentView}
        onOpenAuthModal={(role) => {
          if (role) setAuthInitialRole(role);
          setIsAuthModalOpen(true);
        }}
        onOpenRecruiterJobPosting={() => {
          setRoleMode("recruiter");
          setActiveEngineId("recruiter");
          setCurrentView("workspace");
        }}
        onNavigateToEngine={(engineId) => {
          setActiveEngineId(engineId);
          setCurrentView("workspace");
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {currentView === "landing" ? (
          <HeroLandingPage
            onEnterWorkspace={(engineId, mode) => {
              if (mode) handleRoleModeChange(mode);
              if (engineId) setActiveEngineId(engineId);
              setCurrentView("workspace");
            }}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        ) : (
          <>
            {/* Welcome Hero Quote & Quick Launch */}
            <WelcomeBanner
              roleMode={roleMode}
              selectedLanguage={selectedLanguage}
              onSelectEngine={(id) => setActiveEngineId(id)}
              isSpeaking={isSpeaking}
              setIsSpeaking={setIsSpeaking}
            />

            {/* Specialized AI Engine Navigation Tabs */}
            <EngineSelector
              activeEngineId={activeEngineId}
              onSelectEngine={(id) => setActiveEngineId(id)}
              roleMode={roleMode}
            />

            {/* Render Selected Engine Module in Bright Ultra-Clean Glass Shell */}
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">{renderActiveEngine()}</div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <CareerScoreCard
        careerScore={careerScore}
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        onSelectEngine={(id) => setActiveEngineId(id)}
        onRefreshScore={handleRefreshScore}
        isCalculating={isCalculatingScore}
      />

      <CareerMemoryModal
        memory={careerMemory}
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onSaveMemory={(updated) => {
          setCareerMemory(updated);
          handleRefreshScore();
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authInitialRole}
        onAuthSuccess={(profile) => {
          if (profile.role === "recruiter") {
            setRoleMode("recruiter");
            setActiveEngineId("recruiter");
            setCurrentView("workspace");
          } else {
            setRoleMode("candidate");
            if (profile.name) {
              setCareerMemory((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, fullName: profile.name },
              }));
            }
          }
        }}
      />

      {/* Floating Arohi AI Agent with Call & Chat Capacity (Bottom-Right) */}
      <ArohiFloatingAgent memory={careerMemory} />
    </div>
  );
}
