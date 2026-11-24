import React, { useState, useEffect } from "react";
import { UserRoleMode, LanguageCode, CareerMemory, CareerScoreBreakdown } from "./types";
import {
  CAREER_MEMORY_STORAGE_KEY,
  CAREER_SCORE_STORAGE_KEY,
  loadCareerMemoryFromStorage,
  saveCareerMemoryToStorage,
  loadCareerScoreFromStorage,
  saveCareerScoreToStorage,
  normalizeCareerMemory,
} from "./utils/careerMemoryStorage";
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
import { Footer } from "./components/Footer";
import { stopSpeech } from "./utils/speech";
import { getEnginePath, resolveSeoRoute } from "./seo/panIndiaSeo";
import { applyClientSeoMetadata } from "./utils/seoClient";

export default function App() {
  const initialRoute =
    typeof window !== "undefined" ? resolveSeoRoute(window.location.pathname) : resolveSeoRoute("/");

  const [currentView, setCurrentView] = useState<"landing" | "workspace">(initialRoute.view);
  const [roleMode, setRoleMode] = useState<UserRoleMode>(initialRoute.roleMode);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(initialRoute.langCode);
  const [activeEngineId, setActiveEngineId] = useState<string>(initialRoute.engineId);
  const [activePath, setActivePath] = useState<string>(initialRoute.canonicalPath);
  const activeRouteMeta = resolveSeoRoute(activePath);

  const [careerMemory, setCareerMemory] = useState<CareerMemory>(() =>
    loadCareerMemoryFromStorage()
  );
  const [careerScore, setCareerScore] = useState<CareerScoreBreakdown>(() =>
    loadCareerScoreFromStorage()
  );

  // Persist careerMemory to LocalStorage whenever it changes
  useEffect(() => {
    saveCareerMemoryToStorage(careerMemory);
  }, [careerMemory]);

  // Persist careerScore to LocalStorage whenever it changes
  useEffect(() => {
    saveCareerScoreToStorage(careerScore);
  }, [careerScore]);

  // Keep careerMemory and careerScore synchronized across multiple browser tabs
  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === CAREER_MEMORY_STORAGE_KEY && event.newValue) {
        try {
          setCareerMemory(normalizeCareerMemory(JSON.parse(event.newValue)));
        } catch (err) {
          console.warn("Error parsing cross-tab careerMemory update:", err);
        }
      } else if (event.key === CAREER_SCORE_STORAGE_KEY && event.newValue) {
        try {
          const parsedScore = JSON.parse(event.newValue);
          if (parsedScore && typeof parsedScore.totalScore === "number") {
            setCareerScore(parsedScore);
          }
        } catch (err) {
          console.warn("Error parsing cross-tab careerScore update:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRoleMode>("candidate");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);

  // Sync client-side SEO head tags, language & JSON-LD with current URL and handle browser Back/Forward
  const navigateToCleanPath = (targetPath: string, replace = false) => {
    const resolved = resolveSeoRoute(targetPath);
    setCurrentView(resolved.view);
    setRoleMode(resolved.roleMode);
    setActiveEngineId(resolved.engineId);
    setActivePath(resolved.canonicalPath);
    if (resolved.langCode) {
      setSelectedLanguage(resolved.langCode);
    }
    if (typeof window !== "undefined") {
      if (window.location.pathname !== resolved.canonicalPath) {
        if (replace) {
          window.history.replaceState({}, "", resolved.canonicalPath);
        } else {
          window.history.pushState({}, "", resolved.canonicalPath);
        }
      }
      applyClientSeoMetadata(resolved.canonicalPath);
    }
  };

  const navigateToEngineRoute = (engineId: string, modeOverride?: UserRoleMode) => {
    const resolvedRole = modeOverride || (engineId === "recruiter" ? "recruiter" : roleMode);
    const nextPath = getEnginePath(engineId, resolvedRole);
    setRoleMode(resolvedRole);
    setActiveEngineId(engineId);
    setCurrentView("workspace");
    setActivePath(nextPath);
    if (typeof window !== "undefined") {
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
      applyClientSeoMetadata(nextPath);
    }
  };

  useEffect(() => {
    applyClientSeoMetadata(activePath);
    if (activePath === "/iti-manufacturing-hiring-chennai" && typeof window !== "undefined") {
      setTimeout(() => {
        document
          .getElementById("iti-manufacturing-hiring")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [activePath]);

  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveSeoRoute(window.location.pathname);
      setCurrentView(resolved.view);
      setRoleMode(resolved.roleMode);
      setActiveEngineId(resolved.engineId);
      setActivePath(resolved.canonicalPath);
      if (resolved.langCode) {
        setSelectedLanguage(resolved.langCode);
      }
      applyClientSeoMetadata(resolved.canonicalPath);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleStopSpeech = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const handleRoleModeChange = (newMode: UserRoleMode) => {
    setRoleMode(newMode);
    const nextEngine = newMode === "recruiter" ? "recruiter" : "navigator";
    setActiveEngineId(nextEngine);
    if (currentView === "workspace") {
      const nextPath = getEnginePath(nextEngine, newMode);
      setActivePath(nextPath);
      if (typeof window !== "undefined" && window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
    }
  };

  const handleRefreshScore = async (memoryOverride?: CareerMemory) => {
    const targetMemory = memoryOverride || careerMemory;
    setIsCalculatingScore(true);
    try {
      const res = await fetch("/api/ai/career-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memory: targetMemory }),
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
        return (
          <LiveIndiaJobsEngine
            memory={careerMemory}
            initialFilter={activeRouteMeta.autoFilter}
          />
        );
      case "pathvisualizer":
        return (
          <CareerPathVisualizerEngine
            memory={careerMemory}
            selectedLanguage={selectedLanguage}
            onUpdateMemory={(updated) => {
              setCareerMemory(updated);
              handleRefreshScore(updated);
            }}
          />
        );
      case "skillmastery":
        return (
          <SkillMastery
            memory={careerMemory}
            onUpdateMemory={(updated) => {
              setCareerMemory(updated);
              handleRefreshScore(updated);
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
              handleRefreshScore(updated);
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
            onUpdateMemory={(updated) => {
              setCareerMemory(updated);
              handleRefreshScore(updated);
            }}
          />
        );
      case "skillgap":
        return <SkillGapEngine memory={careerMemory} />;
      case "learning":
        return (
          <LearningAdvisorEngine
            memory={careerMemory}
            initialProgramId={activeRouteMeta.autoFilter?.courseId}
          />
        );
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
    <div className="min-h-screen apple-mesh-light text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white pb-20 relative overflow-x-hidden">
      {/* Layered Luminous Mesh Halos for Authentic Liquid Glass Refraction */}
      <div className="fixed -top-24 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-b from-sky-300/25 via-indigo-300/20 to-transparent blur-[110px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-32 w-[560px] h-[560px] bg-gradient-to-tr from-violet-300/25 via-fuchsia-200/20 to-sky-200/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 -left-24 w-[520px] h-[520px] bg-gradient-to-tr from-amber-200/25 via-rose-200/18 to-indigo-200/20 rounded-full blur-[130px] pointer-events-none -z-10" />

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
        onToggleView={(view) => {
          if (view === "landing") {
            navigateToCleanPath("/");
          } else {
            navigateToEngineRoute(activeEngineId);
          }
        }}
        onOpenAuthModal={(role) => {
          if (role) setAuthInitialRole(role);
          setIsAuthModalOpen(true);
        }}
        onOpenRecruiterJobPosting={() => {
          navigateToCleanPath("/post-job-free");
        }}
        onNavigateToEngine={(engineId) => {
          navigateToEngineRoute(engineId);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {currentView === "landing" ? (
          <HeroLandingPage
            onEnterWorkspace={(engineId, mode) => {
              const targetEngine = engineId || (mode === "recruiter" ? "recruiter" : activeEngineId);
              navigateToEngineRoute(targetEngine, mode);
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
              onSelectEngine={(id) => navigateToEngineRoute(id)}
              isSpeaking={isSpeaking}
              setIsSpeaking={setIsSpeaking}
            />

            {/* Specialized AI Engine Navigation Tabs */}
            <EngineSelector
              activeEngineId={activeEngineId}
              onSelectEngine={(id) => navigateToEngineRoute(id)}
              roleMode={roleMode}
            />

            {/* Route-Matched SEO Breadcrumb & Context Bar (1-to-1 DOM Alignment for Pan-India City, Exam, Course & Regional Hubs) */}
            {(activeRouteMeta.citySlug ||
              activeRouteMeta.examSlug ||
              activeRouteMeta.categorySlug ||
              activeRouteMeta.courseSlug ||
              activeRouteMeta.langCode !== "en") && (
              <div className="mb-4 glass-apple-card rounded-2xl px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold text-slate-500">
                    {activeRouteMeta.breadcrumbs.map((crumb, idx) => (
                      <React.Fragment key={crumb.path}>
                        {idx > 0 && <span className="text-slate-400">/</span>}
                        <a
                          href={crumb.path}
                          onClick={(e) => {
                            if (!e.metaKey && !e.ctrlKey && e.button === 0) {
                              e.preventDefault();
                              navigateToCleanPath(crumb.path);
                            }
                          }}
                          className={
                            idx === activeRouteMeta.breadcrumbs.length - 1
                              ? "text-indigo-700 font-bold"
                              : "hover:text-slate-900 transition"
                          }
                        >
                          {crumb.name}
                        </a>
                      </React.Fragment>
                    ))}
                  </nav>
                  <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950">
                    {activeRouteMeta.visibleHeading}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {activeRouteMeta.visibleSubtitle}
                  </p>
                </div>
              </div>
            )}

            {/* Render Selected Engine Module in Frosted Apple Liquid Glass Shell */}
            <div className="glass-apple rounded-[2rem] p-4 sm:p-6 lg:p-7 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -top-36 -left-36 w-96 h-96 bg-gradient-to-br from-indigo-400/12 via-sky-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-gradient-to-tl from-purple-400/10 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">{renderActiveEngine()}</div>
            </div>
          </>
        )}
      </main>

      {/* Global Corporate Footer (Quench Research Labs Private Limited & ArohiAI.com) */}
      <Footer
        onNavigateToEngine={(engineId, role) => {
          navigateToEngineRoute(engineId, role);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateHome={() => {
          navigateToCleanPath("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigatePath={(path) => {
          navigateToCleanPath(path);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Modals */}
      <CareerScoreCard
        careerScore={careerScore}
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        onSelectEngine={(id) => navigateToEngineRoute(id)}
        onRefreshScore={handleRefreshScore}
        isCalculating={isCalculatingScore}
      />

      <CareerMemoryModal
        memory={careerMemory}
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onSaveMemory={(updated) => {
          setCareerMemory(updated);
          handleRefreshScore(updated);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authInitialRole}
        onAuthSuccess={(profile) => {
          if (profile.role === "recruiter") {
            navigateToEngineRoute("recruiter", "recruiter");
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
