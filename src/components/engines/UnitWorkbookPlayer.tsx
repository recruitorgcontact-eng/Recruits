import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Code,
  Terminal,
  Bug,
  Building2,
  FileCheck2,
  CheckCircle2,
  Lock,
  Clock,
  Loader2,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Layers,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { CourseModuleItem } from "../../data/officialCourseModules";
import {
  StructuredUnit,
  StructuredSession,
  ModuleServerProgress,
  LearnerLmsProgress,
  formatHoursShort,
  PASSING_LAB_SCORE,
  PASSING_QUIZ_PERCENT,
} from "../../utils/lmsCurriculumEngine";
import { speakText, stopSpeech } from "../../utils/speech";

interface UnitWorkbookPlayerProps {
  learnerId: string;
  programTitle: string;
  currentModule: CourseModuleItem;
  currentUnit: StructuredUnit;
  moduleProgress?: ModuleServerProgress;
  pendingSessionSeconds: number;
  onProgressUpdate: (progress: LearnerLmsProgress) => void;
  onActiveSessionChange: (sessionId: string) => void;
  onShowToast: (msg: string) => void;
  onProceedToModuleLab: () => void;
}

export const UnitWorkbookPlayer: React.FC<UnitWorkbookPlayerProps> = ({
  learnerId,
  programTitle,
  currentModule,
  currentUnit,
  moduleProgress,
  pendingSessionSeconds,
  onProgressUpdate,
  onActiveSessionChange,
  onShowToast,
  onProceedToModuleLab,
}) => {
  const [activeSessionIndex, setActiveSessionIndex] = useState<number>(0);
  const [contentCache, setContentCache] = useState<Record<string, any>>({});
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string | null>(null);

  // Per-session interactive states
  const [checkedReadingItems, setCheckedReadingItems] = useState<Record<number, boolean>>({});
  const [microChoice, setMicroChoice] = useState<number | null>(null);
  const [microResult, setMicroResult] = useState<{ passed: boolean; feedback: string; explanation?: string } | null>(null);

  const [drillCode, setDrillCode] = useState<string>("");
  const [showHints, setShowHints] = useState<boolean>(false);
  const [debugDiagnosis, setDebugDiagnosis] = useState<string>("");
  const [debugFixedCode, setDebugFixedCode] = useState<string>("");
  const [vivaAnswers, setVivaAnswers] = useState<Record<string, string>>({});

  const [problemAnswers, setProblemAnswers] = useState<Record<number, number>>({});
  const [problemSubmitted, setProblemSubmitted] = useState<boolean>(false);

  const [submittingSession, setSubmittingSession] = useState<boolean>(false);
  const [gradeFeedback, setGradeFeedback] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
    keyTakeaways?: string[];
  } | null>(null);

  const [signingOffUnit, setSigningOffUnit] = useState<boolean>(false);
  const [unitSignOffMsg, setUnitSignOffMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [speakingChapter, setSpeakingChapter] = useState<boolean>(false);

  const sessions = currentUnit.sessions || [];
  const activeSession: StructuredSession | undefined = sessions[activeSessionIndex] || sessions[0];
  const completedSessionIds = moduleProgress?.completedSessionIds || [];
  const sessionScores = moduleProgress?.sessionScores || {};

  // Reset active session when switching units
  useEffect(() => {
    setActiveSessionIndex(0);
    setUnitSignOffMsg(null);
    stopSpeech();
    setSpeakingChapter(false);
  }, [currentUnit.unitId]);

  // Inform parent so heartbeat logs per-session seconds accurately
  useEffect(() => {
    if (activeSession?.sessionId) {
      onActiveSessionChange(activeSession.sessionId);
    }
  }, [activeSession?.sessionId]);

  // Reset per-session form state & load server-cached/generated session workbook
  useEffect(() => {
    if (!activeSession) return;
    setMicroChoice(null);
    setMicroResult(null);
    setGradeFeedback(null);
    setShowHints(false);
    setProblemAnswers({});
    setProblemSubmitted(false);
    setCheckedReadingItems({});
    setContentError(null);
    stopSpeech();
    setSpeakingChapter(false);

    const existing = contentCache[activeSession.sessionId];
    if (existing) {
      hydrateInteractiveEditors(activeSession.type, existing);
      return;
    }

    let cancelled = false;
    const fetchSessionContent = async () => {
      setLoadingContent(true);
      try {
        const res = await fetch("/api/lms/session/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: activeSession.sessionId,
            sessionType: activeSession.type,
            programTitle,
            moduleTitle: currentModule.title,
            unitTitle: currentUnit.title,
            unitObjectives: currentUnit.objectives,
            allocatedMinutes: activeSession.allocatedMinutes,
            moduleLanguage: currentModule.codeOrCaseExample?.language || "python",
            moduleSummary: currentModule.summary,
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.content) {
          setContentError(data.error || "Unable to load this chapter right now. Please click Retry.");
        } else {
          setContentCache((prev) => ({ ...prev, [activeSession.sessionId]: data.content }));
          hydrateInteractiveEditors(activeSession.type, data.content);
        }
      } catch (_err) {
        if (!cancelled) {
          setContentError("Network error while loading workbook content. Click Retry.");
        }
      } finally {
        if (!cancelled) setLoadingContent(false);
      }
    };

    fetchSessionContent();
    return () => {
      cancelled = true;
    };
  }, [activeSession?.sessionId]);

  const hydrateInteractiveEditors = (type: StructuredSession["type"], content: any) => {
    if (type === "unit_coding_drill") {
      setDrillCode(content?.starterTodoCode || "# TODO: Write your working implementation here\n");
    } else if (type === "debugging_challenge") {
      setDebugFixedCode(content?.brokenCode || "");
      setDebugDiagnosis("");
    } else if (type === "system_design_viva") {
      const init: Record<string, string> = {};
      (content?.vivaQuestions || []).forEach((q: any, i: number) => {
        init[q.id || `vq${i + 1}`] = "";
      });
      setVivaAnswers(init);
    }
  };

  const handleRetryLoadContent = async () => {
    if (!activeSession) return;
    setContentError(null);
    setLoadingContent(true);
    try {
      const res = await fetch("/api/lms/session/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.sessionId,
          sessionType: activeSession.type,
          programTitle,
          moduleTitle: currentModule.title,
          unitTitle: currentUnit.title,
          unitObjectives: currentUnit.objectives,
          allocatedMinutes: activeSession.allocatedMinutes,
          moduleLanguage: currentModule.codeOrCaseExample?.language || "python",
          moduleSummary: currentModule.summary,
          forceRegenerate: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.content) {
        setContentCache((prev) => ({ ...prev, [activeSession.sessionId]: data.content }));
        hydrateInteractiveEditors(activeSession.type, data.content);
      } else {
        setContentError(data.error || "Failed to generate content. Please retry.");
      }
    } catch {
      setContentError("Connection failed. Please retry.");
    } finally {
      setLoadingContent(false);
    }
  };

  const currentContent = activeSession ? contentCache[activeSession.sessionId] : null;

  const isSessionUnlocked = (sIdx: number) => {
    if (sIdx === 0) return true;
    const prev = sessions[sIdx - 1];
    return prev ? completedSessionIds.includes(prev.sessionId) : true;
  };

  const handleSpeakTextbookChapter = () => {
    if (speakingChapter) {
      stopSpeech();
      setSpeakingChapter(false);
      return;
    }
    if (!currentContent) return;
    const text = [
      currentUnit.title,
      currentContent.overview || "",
      ...(currentContent.sections || []).map((s: any) => `${s.heading}. ${s.body}`),
    ]
      .join(". ")
      .slice(0, 2600);
    setSpeakingChapter(true);
    speakText({
      text,
      language: "en",
      onStart: () => setSpeakingChapter(true),
      onEnd: () => setSpeakingChapter(false),
      onError: () => setSpeakingChapter(false),
    });
  };

  const handleVerifyMicroCheck = async (checkObj: { correctIndex: number; explanation?: string }) => {
    if (!activeSession || microChoice === null) return;
    setSubmittingSession(true);
    const isCorrect = microChoice === checkObj.correctIndex;
    try {
      const res = await fetch("/api/lms/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId,
          moduleId: currentModule.id,
          sessionId: activeSession.sessionId,
          sessionType: activeSession.type,
          unitTitle: currentUnit.title,
          programTitle,
          moduleTitle: currentModule.title,
          payload: { isCorrect },
        }),
      });
      const data = await res.json();
      if (data.progress) onProgressUpdate(data.progress);
      setMicroResult({
        passed: Boolean(data.passed),
        feedback: data.feedback || (isCorrect ? "Verified!" : "Try again."),
        explanation: checkObj.explanation,
      });
      if (data.passed) {
        onShowToast(`✅ ${activeSession.shortLabel} passed! Next session unlocked.`);
      }
    } finally {
      setSubmittingSession(false);
    }
  };

  const handleSubmitGradedSession = async () => {
    if (!activeSession || !currentContent) return;
    setSubmittingSession(true);
    setGradeFeedback(null);

    let payload: any = {};
    if (activeSession.type === "unit_coding_drill") {
      payload = {
        code: drillCode,
        taskPrompt: `${currentContent.drillTitle}: ${currentContent.context} Requirements: ${(currentContent.requirements || []).join("; ")}`,
      };
    } else if (activeSession.type === "debugging_challenge") {
      payload = {
        code: debugFixedCode,
        diagnosis: debugDiagnosis,
        taskPrompt: `${currentContent.incidentTitle}: ${currentContent.productionSymptom} Goal: ${currentContent.optimizationGoal}`,
      };
    } else if (activeSession.type === "system_design_viva") {
      payload = {
        caseContext: `${currentContent.enterpriseCaseTitle} — ${currentContent.companyContext}`,
        answers: (currentContent.vivaQuestions || []).map((q: any, i: number) => ({
          prompt: q.prompt,
          answer: vivaAnswers[q.id || `vq${i + 1}`] || "",
        })),
      };
    } else if (activeSession.type === "unit_problem_set") {
      const qs: any[] = currentContent.questions || [];
      let correctCount = 0;
      qs.forEach((q, idx) => {
        if (problemAnswers[idx] === q.correctIndex) correctCount++;
      });
      setProblemSubmitted(true);
      payload = { correctCount, totalQuestions: qs.length };
    }

    try {
      const res = await fetch("/api/lms/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId,
          moduleId: currentModule.id,
          sessionId: activeSession.sessionId,
          sessionType: activeSession.type,
          unitTitle: currentUnit.title,
          programTitle,
          moduleTitle: currentModule.title,
          payload,
        }),
      });
      const data = await res.json();
      if (data.progress) onProgressUpdate(data.progress);
      setGradeFeedback({
        passed: Boolean(data.passed),
        score: Number(data.score || 0),
        feedback: data.feedback || "Evaluation completed.",
        keyTakeaways: data.keyTakeaways || [],
      });
      if (data.passed) {
        onShowToast(`✅ ${activeSession.shortLabel} Verified (${data.score}%)!`);
      }
    } catch {
      setGradeFeedback({
        passed: false,
        score: 0,
        feedback: "Unable to reach grading server. Please retry.",
      });
    } finally {
      setSubmittingSession(false);
    }
  };

  const handleSignOffUnit = async () => {
    setSigningOffUnit(true);
    setUnitSignOffMsg(null);
    try {
      const res = await fetch("/api/lms/unit-checkpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId,
          moduleId: currentModule.id,
          unitId: currentUnit.unitId,
          passed: true,
          requiredUnitSeconds: currentUnit.requiredSeconds,
          requiredSessionIds: sessions.map((s) => s.sessionId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUnitSignOffMsg({ ok: false, text: data.error || "Unit requirements not yet complete." });
      } else {
        if (data.progress) onProgressUpdate(data.progress);
        setUnitSignOffMsg({
          ok: true,
          text: `🎉 Unit ${currentUnit.unitIndex + 1} officially signed off (${currentUnit.allocatedHours}h verified across all 6 sessions)! Next unit is now unlocked.`,
        });
        onShowToast(`✅ ${currentUnit.title} Officially Verified!`);
      }
    } catch {
      setUnitSignOffMsg({ ok: false, text: "Could not verify unit sign-off right now." });
    } finally {
      setSigningOffUnit(false);
    }
  };

  const getSessionIcon = (type: StructuredSession["type"]) => {
    switch (type) {
      case "deep_textbook":
        return BookOpen;
      case "code_walkthrough":
        return Code;
      case "unit_coding_drill":
        return Terminal;
      case "debugging_challenge":
        return Bug;
      case "system_design_viva":
        return Building2;
      case "unit_problem_set":
        return FileCheck2;
    }
  };

  const unitSessionsDoneCount = sessions.filter((s) => completedSessionIds.includes(s.sessionId)).length;
  const unitLoggedSec =
    (moduleProgress?.unitSeconds?.[currentUnit.unitId] || 0) + pendingSessionSeconds;
  const isUnitAlreadySignedOff = (moduleProgress?.completedUnitIds || []).includes(currentUnit.unitId);

  if (!activeSession) return null;

  return (
    <div className="space-y-5">
      {/* ACTIVE UNIT HEADER + 6-SESSION WORKBOOK STEPPER */}
      <div className="glass-vision rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Full {currentUnit.allocatedHours}-Hour Interactive Unit Workbook • 6 Structured Sessions
            </span>
            <h4 className="text-base sm:text-lg font-black text-white tracking-tight">{currentUnit.title}</h4>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-xl glass-vision-inset text-[11px] font-mono tabular-nums font-bold text-cyan-300">
              {unitSessionsDoneCount}/{sessions.length} Sessions Passed
            </span>
            <span className="px-3 py-1 rounded-xl glass-vision-inset text-[11px] font-mono tabular-nums font-bold text-amber-300">
              {formatHoursShort(unitLoggedSec)} / {currentUnit.allocatedHours}h
            </span>
          </div>
        </div>

        {/* 6 Sequential Sessions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {sessions.map((sess, idx) => {
            const SIcon = getSessionIcon(sess.type);
            const done = completedSessionIds.includes(sess.sessionId);
            const unlocked = isSessionUnlocked(idx);
            const active = idx === activeSessionIndex;
            const loggedSessSec =
              (moduleProgress?.sessionSeconds?.[sess.sessionId] || 0) +
              (active ? pendingSessionSeconds : 0);
            const loggedMins = Math.floor(loggedSessSec / 60);

            return (
              <button
                key={sess.sessionId}
                onClick={() => {
                  if (!unlocked) {
                    onShowToast(`🔒 Pass Session ${idx} first to unlock ${sess.shortLabel}.`);
                    return;
                  }
                  setActiveSessionIndex(idx);
                }}
                className={`text-left p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  active
                    ? "bg-gradient-to-br from-cyan-400/20 via-indigo-500/20 to-blue-500/15 border-cyan-400/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_28px_-10px_rgba(34,211,238,0.38)] backdrop-blur-xl"
                    : done
                    ? "bg-emerald-500/12 border-emerald-400/35 hover:border-emerald-300/60 backdrop-blur-lg"
                    : unlocked
                    ? "glass-vision-card"
                    : "glass-vision-inset opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <SIcon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      active ? "text-cyan-300" : done ? "text-emerald-400" : "text-slate-400"
                    }`}
                  />
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : unlocked ? (
                    <span className="text-[9px] font-mono tabular-nums text-amber-300 font-bold">
                      {sess.allocatedMinutes}m
                    </span>
                  ) : (
                    <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] font-extrabold text-white truncate">
                  {sess.shortLabel}
                </div>
                <div className="text-[9px] font-mono tabular-nums text-slate-400">
                  {done && sessionScores[sess.sessionId]
                    ? `Passed (${sessionScores[sess.sessionId]}%)`
                    : `${loggedMins}m / ${sess.allocatedMinutes}m`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SESSION WORKSPACE */}
      <div className="glass-vision rounded-3xl p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-400/15 border border-cyan-300/35 text-cyan-200 text-[10px] font-black uppercase">
                {activeSession.shortLabel} • {activeSession.allocatedMinutes} Minutes Study Allocation
              </span>
              {completedSessionIds.includes(activeSession.sessionId) && (
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-400/15 border border-emerald-400/40 text-emerald-200 text-[10px] font-black uppercase">
                  Session Verified ✓
                </span>
              )}
            </div>
            <h5 className="text-base sm:text-lg font-black text-white tracking-tight">{activeSession.title}</h5>
            <p className="text-xs text-slate-300/80">{activeSession.subtitle}</p>
          </div>

          {activeSession.type === "deep_textbook" && currentContent && (
            <button
              onClick={handleSpeakTextbookChapter}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                speakingChapter
                  ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400"
              }`}
            >
              {speakingChapter ? (
                <>
                  <VolumeX className="w-4 h-4" /> Stop Audio
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Listen to Chapter
                </>
              )}
            </button>
          )}
        </div>

        {/* LOADING / ERROR STATE */}
        {loadingContent && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div className="text-sm font-black text-white">
              Arohi Professor is preparing your full {activeSession.allocatedMinutes}-minute{" "}
              {activeSession.shortLabel} workbook...
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              First-time generation creates comprehensive university-grade sections, diagrams, benchmarks, or labs and caches them permanently on the server.
            </p>
          </div>
        )}

        {!loadingContent && contentError && (
          <div className="bg-rose-950/50 border border-rose-400/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{contentError}</span>
            </div>
            <button
              onClick={handleRetryLoadContent}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Generation
            </button>
          </div>
        )}

        {/* ============================================================
            SESSION 1: DEEP TEXTBOOK CHAPTER & ARCHITECTURE DIAGRAM
           ============================================================ */}
        {!loadingContent && currentContent && activeSession.type === "deep_textbook" && (
          <div className="space-y-6">
            {currentContent.overview && (
              <div className="glass-vision-card rounded-2xl p-4 sm:p-5 border-indigo-400/30 text-xs sm:text-sm text-indigo-100 leading-relaxed">
                <strong className="text-amber-300 block mb-1 text-[11px] uppercase tracking-wider">
                  Executive Study Framing
                </strong>
                {currentContent.overview}
              </div>
            )}

            {/* 4 Full Textbook Sections */}
            <div className="space-y-4">
              {(currentContent.sections || []).map((sec: any, idx: number) => (
                <div
                  key={idx}
                  className="glass-vision-card rounded-2xl p-5 sm:p-6 space-y-3"
                >
                  <h6 className="text-sm sm:text-base font-black text-cyan-300 tracking-tight">{sec.heading}</h6>
                  <div className="text-xs sm:text-sm text-slate-100/90 leading-relaxed whitespace-pre-line">
                    {sec.body}
                  </div>
                  {sec.keyFormulaOrRule && (
                    <div className="p-3.5 rounded-xl glass-vision-inset border-amber-400/30 text-xs text-amber-200 font-mono">
                      <strong className="text-amber-300 font-sans">Key Principle / Rule: </strong>
                      {sec.keyFormulaOrRule}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ASCII Architecture Diagram */}
            {currentContent.architectureDiagramAscii && (
              <div className="glass-vision-inset rounded-2xl border border-cyan-400/25 overflow-hidden">
                <div className="bg-white/[0.04] px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </span>
                    <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider ml-1">
                      System &amp; Memory Architecture Blueprint
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">architecture.spec</span>
                </div>
                <pre className="p-4 text-[11px] sm:text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {currentContent.architectureDiagramAscii}
                </pre>
              </div>
            )}

            {/* Naive vs Enterprise Comparison Table */}
            {Array.isArray(currentContent.comparisonTable) && currentContent.comparisonTable.length > 0 && (
              <div className="overflow-x-auto rounded-2xl glass-vision-inset border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.05] text-cyan-300 uppercase text-[10px] font-black">
                    <tr>
                      <th className="p-3.5 border-b border-white/10">Engineering Dimension</th>
                      <th className="p-3.5 border-b border-white/10 text-rose-300">Naive / Beginner Approach</th>
                      <th className="p-3.5 border-b border-white/10 text-emerald-300">Enterprise Production Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {currentContent.comparisonTable.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-white/[0.03] transition-colors">
                        <td className="p-3.5 font-bold text-white">{row.dimension}</td>
                        <td className="p-3.5 text-slate-300">{row.naiveApproach}</td>
                        <td className="p-3.5 text-emerald-200">{row.enterpriseStandard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Common Pitfalls & Active Study Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(currentContent.commonPitfalls) && (
                <div className="glass-vision-card rounded-2xl p-4 sm:p-5 border-rose-400/25 space-y-2">
                  <h6 className="text-xs font-black uppercase tracking-wider text-rose-300">
                    Production Pitfalls &amp; Mitigations
                  </h6>
                  <ul className="space-y-1.5 text-xs text-slate-200 list-disc pl-4">
                    {currentContent.commonPitfalls.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(currentContent.readingChecklist) && (
                <div className="glass-vision-card rounded-2xl p-4 sm:p-5 border-indigo-400/25 space-y-2">
                  <h6 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Active Study Self-Verification Checklist
                  </h6>
                  <div className="space-y-2">
                    {currentContent.readingChecklist.map((item: string, i: number) => (
                      <label
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedReadingItems[i]}
                          onChange={(e) =>
                            setCheckedReadingItems((prev) => ({ ...prev, [i]: e.target.checked }))
                          }
                          className="mt-0.5 accent-emerald-400"
                        />
                        <span className={checkedReadingItems[i] ? "line-through text-emerald-300" : ""}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Micro-Check */}
            {currentContent.microCheck && (
              <div className="glass-vision-card rounded-2xl p-5 border-emerald-400/30 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                  Session 1 Mastery Verification (Unlock Session 2)
                </span>
                <div className="text-sm font-extrabold text-white">
                  {currentContent.microCheck.question}
                </div>
                <div className="space-y-2">
                  {(currentContent.microCheck.options || []).map((opt: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      onClick={() => setMicroChoice(oIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                        microChoice === oIdx
                          ? "bg-cyan-400/15 border-cyan-400 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          : "glass-vision-inset text-slate-200 hover:border-cyan-400/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {microResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs backdrop-blur-md ${
                      microResult.passed
                        ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200"
                        : "bg-rose-500/15 border-rose-400/50 text-rose-200"
                    }`}
                  >
                    <strong className="block mb-1">{microResult.feedback}</strong>
                    {microResult.passed && microResult.explanation && (
                      <p className="text-slate-100">{microResult.explanation}</p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleVerifyMicroCheck(currentContent.microCheck)}
                    disabled={submittingSession || microChoice === null}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg"
                  >
                    {submittingSession ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Verify Session 1 &amp; Unlock Session 2</span>
                  </button>
                  {completedSessionIds.includes(activeSession.sessionId) && (
                    <button
                      onClick={() => setActiveSessionIndex(1)}
                      className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <span>Next: Session 2 Code Trace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            SESSION 2: NAIVE VS PRODUCTION CODE LAB & BENCHMARKS
           ============================================================ */}
        {!loadingContent && currentContent && activeSession.type === "code_walkthrough" && (
          <div className="space-y-6">
            <div className="text-sm font-black text-amber-300">
              Scenario: {currentContent.scenarioTitle}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="glass-vision-inset border border-rose-400/30 rounded-2xl overflow-hidden">
                <div className="bg-rose-500/12 px-4 py-2.5 border-b border-rose-400/25 text-xs font-black text-rose-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </span>
                    <span>❌ Naive / Bottleneck Implementation</span>
                  </span>
                  <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {currentContent.language}
                  </span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-rose-200 overflow-x-auto leading-relaxed">
                  <code>{currentContent.naiveCode}</code>
                </pre>
              </div>

              <div className="glass-vision-inset border border-emerald-400/30 rounded-2xl overflow-hidden">
                <div className="bg-emerald-500/12 px-4 py-2.5 border-b border-emerald-400/25 text-xs font-black text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </span>
                    <span>✅ Enterprise Production Refactor</span>
                  </span>
                  <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {currentContent.language}
                  </span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{currentContent.productionCode}</code>
                </pre>
              </div>
            </div>

            {/* Benchmarks Table */}
            {Array.isArray(currentContent.benchmarkComparison) && (
              <div className="overflow-x-auto rounded-2xl glass-vision-inset border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.05] text-cyan-300 uppercase text-[10px] font-black">
                    <tr>
                      <th className="p-3.5 border-b border-white/10">Benchmark Metric</th>
                      <th className="p-3.5 border-b border-white/10 text-rose-300">Naive Code</th>
                      <th className="p-3.5 border-b border-white/10 text-emerald-300">Production Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {currentContent.benchmarkComparison.map((b: any, i: number) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="p-3.5 font-bold text-white">{b.metric}</td>
                        <td className="p-3.5 text-rose-200 font-mono tabular-nums">{b.naiveResult}</td>
                        <td className="p-3.5 text-emerald-300 font-mono tabular-nums font-bold">{b.productionResult}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Line-by-Line Trace */}
            {Array.isArray(currentContent.lineByLineTrace) && (
              <div className="space-y-2.5">
                <h6 className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  Line-by-Line Execution &amp; Memory Trace
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentContent.lineByLineTrace.map((t: any, i: number) => (
                    <div
                      key={i}
                      className="glass-vision-card rounded-xl p-4 space-y-1"
                    >
                      <div className="text-xs font-black text-amber-300">{t.block}</div>
                      <p className="text-xs text-slate-200/90 leading-relaxed">{t.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comprehension Check */}
            {currentContent.comprehensionCheck && (
              <div className="glass-vision-card border-emerald-400/30 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                  Session 2 Code-Trace Verification (Unlock Session 3 Coding Drill)
                </span>
                <div className="text-sm font-extrabold text-white">
                  {currentContent.comprehensionCheck.question}
                </div>
                <div className="space-y-2">
                  {(currentContent.comprehensionCheck.options || []).map((opt: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      onClick={() => setMicroChoice(oIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer ${
                        microChoice === oIdx
                          ? "bg-cyan-400/15 border-cyan-400 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          : "glass-vision-inset text-slate-200 hover:border-cyan-400/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {microResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs backdrop-blur-md ${
                      microResult.passed
                        ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200"
                        : "bg-rose-500/15 border-rose-400/50 text-rose-200"
                    }`}
                  >
                    <strong className="block mb-1">{microResult.feedback}</strong>
                    {microResult.passed && microResult.explanation && (
                      <p className="text-slate-100">{microResult.explanation}</p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleVerifyMicroCheck(currentContent.comprehensionCheck)}
                    disabled={submittingSession || microChoice === null}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg"
                  >
                    {submittingSession ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Verify Session 2 &amp; Unlock Session 3</span>
                  </button>
                  {completedSessionIds.includes(activeSession.sessionId) && (
                    <button
                      onClick={() => setActiveSessionIndex(2)}
                      className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <span>Next: Session 3 Coding Drill</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            SESSION 3: GUIDED UNIT HANDS-ON CODING DRILL (TODO SCAFFOLD)
           ============================================================ */}
        {!loadingContent && currentContent && activeSession.type === "unit_coding_drill" && (
          <div className="space-y-5">
            <div className="glass-vision-card border-amber-400/35 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h6 className="text-sm sm:text-base font-black text-white">
                  {currentContent.drillTitle}
                </h6>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-black tabular-nums">
                  Min {PASSING_LAB_SCORE}/100 Required
                </span>
              </div>
              <p className="text-xs text-slate-200/90 leading-relaxed">{currentContent.context}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="glass-vision-inset rounded-xl p-3.5 space-y-1">
                  <strong className="text-cyan-300 block text-[11px] uppercase">Requirements</strong>
                  <ul className="space-y-1 text-slate-200 list-disc pl-4">
                    {(currentContent.requirements || []).map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="glass-vision-inset rounded-xl p-3.5 space-y-1">
                  <strong className="text-emerald-300 block text-[11px] uppercase">Acceptance Criteria</strong>
                  <ul className="space-y-1 text-slate-200 list-disc pl-4">
                    {(currentContent.acceptanceCriteria || []).map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {Array.isArray(currentContent.hints) && currentContent.hints.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHints((p) => !p)}
                  className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHints ? "Hide Mentor Hints" : "Need a nudge? View Progressive Mentor Hints"}</span>
                </button>
                {showHints && (
                  <ul className="mt-2 glass-vision-card border-amber-400/30 rounded-xl p-3.5 space-y-1 text-xs text-amber-100 list-disc pl-6">
                    {currentContent.hints.map((h: string, i: number) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="glass-vision-inset rounded-2xl border border-white/15 overflow-hidden">
              <div className="bg-white/[0.04] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </span>
                  <span className="font-bold text-slate-200 ml-1">
                    Student Implementation Editor (Replace all TODOs with working code)
                  </span>
                </div>
                <button
                  onClick={() => setDrillCode(currentContent.starterTodoCode || "")}
                  className="text-[11px] font-semibold text-cyan-300 hover:underline cursor-pointer"
                >
                  Reset Starter TODO
                </button>
              </div>
              <textarea
                rows={12}
                value={drillCode}
                onChange={(e) => setDrillCode(e.target.value)}
                className="w-full font-mono text-xs bg-transparent p-4 text-emerald-300 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={handleSubmitGradedSession}
                disabled={submittingSession}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                {submittingSession ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Grading Drill...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Drill for Strict AI Review
                  </>
                )}
              </button>
              {completedSessionIds.includes(activeSession.sessionId) && (
                <button
                  onClick={() => setActiveSessionIndex(3)}
                  className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Next: Session 4 Debugging Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            SESSION 4: PRODUCTION BUG & OPTIMIZATION CHALLENGE
           ============================================================ */}
        {!loadingContent && currentContent && activeSession.type === "debugging_challenge" && (
          <div className="space-y-5">
            <div className="glass-vision-card border-rose-400/35 rounded-2xl p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-300">
                  Production Incident Ticket • Root Cause &amp; Fix Required
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[10px] font-black tabular-nums">
                  Min {PASSING_LAB_SCORE}/100
                </span>
              </div>
              <h6 className="text-sm sm:text-base font-black text-white">
                {currentContent.incidentTitle}
              </h6>
              <p className="text-xs text-rose-100 leading-relaxed">{currentContent.productionSymptom}</p>
              <div className="glass-vision-inset rounded-xl p-3.5 space-y-1 text-xs">
                <strong className="text-amber-300 block text-[11px] uppercase">Diagnostic Telemetry Clues</strong>
                <ul className="space-y-1 text-slate-200 list-disc pl-4">
                  {(currentContent.diagnosticClues || []).map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-emerald-300">
                <strong>Optimization Goal: </strong>
                {currentContent.optimizationGoal}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                1. Root-Cause Diagnosis (Explain what caused the failure &amp; why your fix resolves it):
              </label>
              <textarea
                rows={3}
                value={debugDiagnosis}
                onChange={(e) => setDebugDiagnosis(e.target.value)}
                placeholder="Write a sharp 2–3 sentence technical root-cause analysis..."
                className="w-full text-xs glass-vision-inset rounded-xl p-3.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="glass-vision-inset rounded-2xl border border-white/15 overflow-hidden">
              <div className="bg-white/[0.04] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </span>
                  <span className="font-bold text-slate-200 ml-1">
                    2. Fixed Production Code (Repair all bugs below)
                  </span>
                </div>
                <button
                  onClick={() => setDebugFixedCode(currentContent.brokenCode || "")}
                  className="text-[11px] font-semibold text-cyan-300 hover:underline cursor-pointer"
                >
                  Restore Original Broken Code
                </button>
              </div>
              <textarea
                rows={13}
                value={debugFixedCode}
                onChange={(e) => setDebugFixedCode(e.target.value)}
                className="w-full font-mono text-xs bg-transparent p-4 text-amber-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={handleSubmitGradedSession}
                disabled={submittingSession}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                {submittingSession ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Reviewing Bug Fix...
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4" /> Submit Diagnosis &amp; Fix for Grading
                  </>
                )}
              </button>
              {completedSessionIds.includes(activeSession.sessionId) && (
                <button
                  onClick={() => setActiveSessionIndex(4)}
                  className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Session 5 System Design Viva</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            SESSION 5: INDIAN ENTERPRISE SYSTEM DESIGN & 3-Q VIVA
           ============================================================ */}
        {!loadingContent && currentContent && activeSession.type === "system_design_viva" && (
          <div className="space-y-5">
            <div className="glass-vision-card border-indigo-400/35 rounded-2xl p-4 sm:p-5 space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                Indian Enterprise System Design Case Study
              </span>
              <h6 className="text-sm sm:text-base font-black text-white">
                {currentContent.enterpriseCaseTitle}
              </h6>
              <p className="text-xs text-indigo-100 leading-relaxed">{currentContent.companyContext}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(currentContent.scaleConstraints || []).map((sc: string, i: number) => (
                  <span
                    key={i}
                    className="text-[11px] glass-vision-inset border-cyan-400/25 text-cyan-200 px-2.5 py-1 rounded-lg font-semibold"
                  >
                    {sc}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {(currentContent.vivaQuestions || []).map((vq: any, idx: number) => {
                const qKey = vq.id || `vq${idx + 1}`;
                return (
                  <div
                    key={qKey}
                    className="glass-vision-card rounded-2xl p-4 sm:p-5 space-y-2"
                  >
                    <div className="text-xs sm:text-sm font-extrabold text-white">
                      Viva Q{idx + 1}: {vq.prompt}
                    </div>
                    {vq.rubricFocus && (
                      <div className="text-[11px] text-amber-300">
                        Panel Rubric Focus: {vq.rubricFocus}
                      </div>
                    )}
                    <textarea
                      rows={4}
                      value={vivaAnswers[qKey] || ""}
                      onChange={(e) =>
                        setVivaAnswers((prev) => ({ ...prev, [qKey]: e.target.value }))
                      }
                      placeholder="Write a clear, structured engineering response (min 2–3 sentences with trade-offs & metrics)..."
                      className="w-full text-xs glass-vision-inset rounded-xl p-3.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={handleSubmitGradedSession}
                disabled={submittingSession}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                {submittingSession ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Panel Evaluating Viva...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Submit Viva to Arohi Interview Panel
                  </>
                )}
              </button>
              {completedSessionIds.includes(activeSession.sessionId) && (
                <button
                  onClick={() => setActiveSessionIndex(5)}
                  className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Next: Session 6 Problem Set (6 Qs)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            SESSION 6: UNIT TECHNICAL PROBLEM SET (6 TOPIC-SPECIFIC Qs)
           ============================================================ */}
        {!loadingContent && currentContent && activeSession.type === "unit_problem_set" && (
          <div className="space-y-4">
            <div className="glass-vision-card border-indigo-400/25 rounded-xl p-3.5 text-xs text-slate-200">
              <strong className="text-amber-300">Instructions: </strong>
              {currentContent.instructions ||
                `Answer all 6 technical questions carefully. Score >= ${PASSING_QUIZ_PERCENT}% to pass Session 6.`}
            </div>

            <div className="space-y-4">
              {(currentContent.questions || []).map((q: any, qIdx: number) => {
                const chosen = problemAnswers[qIdx];
                return (
                  <div
                    key={qIdx}
                    className="glass-vision-card rounded-2xl p-4 sm:p-5 space-y-3"
                  >
                    <div className="text-xs sm:text-sm font-extrabold text-white">
                      Problem {qIdx + 1}. {q.question}
                    </div>
                    {q.codeContext && String(q.codeContext).trim().length > 0 && (
                      <pre className="p-3.5 rounded-xl glass-vision-inset text-[11px] font-mono text-emerald-300 overflow-x-auto">
                        <code>{q.codeContext}</code>
                      </pre>
                    )}
                    <div className="space-y-2">
                      {(q.options || []).map((opt: string, oIdx: number) => {
                        const isChosen = chosen === oIdx;
                        const isCorrect = q.correctIndex === oIdx;
                        let cls = "glass-vision-inset text-slate-200 hover:border-cyan-400/50";
                        if (problemSubmitted) {
                          if (isCorrect) cls = "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold";
                          else if (isChosen) cls = "bg-rose-500/20 border-rose-400 text-rose-200";
                        } else if (isChosen) {
                          cls = "bg-cyan-400/15 border-cyan-400 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
                        }
                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!problemSubmitted) {
                                setProblemAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                              }
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between gap-2 ${cls}`}
                          >
                            <span>{opt}</span>
                            {problemSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {problemSubmitted && q.explanation && (
                      <div className="p-3 rounded-xl glass-vision-inset text-xs text-cyan-200">
                        <strong className="text-amber-300">Solution Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              {!problemSubmitted ? (
                <button
                  onClick={handleSubmitGradedSession}
                  disabled={submittingSession}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-lg"
                >
                  Submit 6-Question Unit Problem Set
                </button>
              ) : (
                <button
                  onClick={() => {
                    setProblemSubmitted(false);
                    setProblemAnswers({});
                    setGradeFeedback(null);
                  }}
                  className="px-4 py-2 glass-vision-card text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Retry Problem Set
                </button>
              )}
            </div>
          </div>
        )}

        {/* SHARED GRADING FEEDBACK BANNER (Sessions 3, 4, 5, 6) */}
        {gradeFeedback && (
          <div
            className={`rounded-2xl p-4 sm:p-5 space-y-2.5 border backdrop-blur-xl ${
              gradeFeedback.passed
                ? "bg-emerald-500/15 border-emerald-400/50"
                : "bg-rose-500/15 border-rose-400/50"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  gradeFeedback.passed ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {gradeFeedback.passed ? "Session Passed & Verified" : "Revision Required"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black tabular-nums ${
                  gradeFeedback.passed ? "bg-emerald-400 text-slate-950" : "bg-rose-500 text-white"
                }`}
              >
                Score: {gradeFeedback.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed">{gradeFeedback.feedback}</p>
            {gradeFeedback.keyTakeaways && gradeFeedback.keyTakeaways.length > 0 && (
              <ul className="space-y-1 text-xs text-slate-200 pl-4 list-disc">
                {gradeFeedback.keyTakeaways.map((kt, i) => (
                  <li key={i}>{kt}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* OFFICIAL UNIT SIGN-OFF GATE (REQUIRES ALL 6 SESSIONS + VERIFIED UNIT HOURS) */}
      <div className="glass-vision border-emerald-400/30 rounded-3xl p-5 sm:p-6 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
              Unit {currentUnit.unitIndex + 1} Official Sign-Off Gate
            </span>
            <h5 className="text-sm font-black text-white">
              Complete All 6 Workbook Sessions + {currentUnit.allocatedHours}h Active Study to Unlock Next Unit
            </h5>
          </div>
          {isUnitAlreadySignedOff && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black shrink-0">
              Unit Verified ✓
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              unitSessionsDoneCount === sessions.length
                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                : "glass-vision-inset text-slate-200"
            }`}
          >
            <span className="font-bold flex items-center gap-1.5">
              {unitSessionsDoneCount === sessions.length ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
              6 Structured Workbook Sessions
            </span>
            <span className="font-mono tabular-nums font-black">
              {unitSessionsDoneCount}/{sessions.length}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              unitLoggedSec >= currentUnit.requiredSeconds
                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                : "glass-vision-inset text-slate-200"
            }`}
          >
            <span className="font-bold flex items-center gap-1.5">
              {unitLoggedSec >= currentUnit.requiredSeconds ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              )}
              Verified Active Study Hours
            </span>
            <span className="font-mono tabular-nums font-black">
              {formatHoursShort(unitLoggedSec)} / {currentUnit.allocatedHours}h
            </span>
          </div>
        </div>

        {unitSignOffMsg && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold backdrop-blur-md ${
              unitSignOffMsg.ok
                ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200"
                : "bg-amber-500/15 border-amber-400/50 text-amber-200"
            }`}
          >
            {unitSignOffMsg.text}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3 pt-2.5 border-t border-white/10">
          <button
            onClick={handleSignOffUnit}
            disabled={signingOffUnit || isUnitAlreadySignedOff}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            {signingOffUnit ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>
              {isUnitAlreadySignedOff
                ? `Unit ${currentUnit.unitIndex + 1} Signed Off ✓`
                : `Verify & Sign Off Unit ${currentUnit.unitIndex + 1}`}
            </span>
          </button>

          <button
            onClick={onProceedToModuleLab}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <span>Proceed to Module Capstone Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
