import React, { useState } from "react";
import { BarChart2, Sparkles, CheckCircle2, Clock, BookOpen, Loader2, Target } from "lucide-react";
import { CareerMemory, SkillGapAnalysis } from "../../types";

interface SkillGapEngineProps {
  memory: CareerMemory;
}

export const SkillGapEngine: React.FC<SkillGapEngineProps> = ({ memory }) => {
  const [targetRole, setTargetRole] = useState(memory.targetRole || "Senior Cloud Architect & AI Engineer");
  const [loading, setLoading] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapAnalysis | null>(null);

  const handleAnalyzeSkillGap = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          currentSkills: memory.skills,
          experienceYears: memory.experienceYears,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGapAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Error analyzing skill gap:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-violet-600/20">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Skill Gap Analyzer Engine</h2>
            <p className="text-xs text-slate-400">
              Compares your profile with industry requirements and generates a personalized learning roadmap
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Role Benchmark</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Your Current Profile Skills ({memory.skills.length}):</span>
            {memory.skills.map((sk) => (
              <span key={sk} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md font-medium text-[11px]">
                {sk}
              </span>
            ))}
          </div>
        </div>

        <button
          id="btn-run-skill-gap-analysis"
          onClick={handleAnalyzeSkillGap}
          disabled={loading || !targetRole.trim()}
          className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Comparing Industry Competencies...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Analyze Skill Gap & Roadmap
            </>
          )}
        </button>
      </div>

      {gapAnalysis && (
        <div className="space-y-6">
          {/* Readiness Meter */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Target Role Benchmark</span>
              <h3 className="text-xl font-bold text-white">{gapAnalysis.targetRole}</h3>
              <p className="text-xs text-slate-400">Arohi AI identified {gapAnalysis.gapSkills.length} key skill gaps to bridge.</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Current Role Readiness</div>
                <div className="text-3xl font-extrabold text-amber-300">{gapAnalysis.currentReadinessPercent}%</div>
              </div>
            </div>
          </div>

          {/* Gap Skills Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Identified Competency Gaps</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gapAnalysis.gapSkills.map((gap, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{gap.skillName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        gap.importance === "Critical"
                          ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                          : "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                      }`}
                    >
                      {gap.importance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Difficulty: <strong className="text-slate-200">{gap.learningDifficulty}</strong></span>
                    <span className="flex items-center gap-1 text-indigo-300"><Clock className="w-3 h-3" /> {gap.timeToMaster}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Personalized Step-by-Step Execution Roadmap
            </h3>

            <div className="space-y-4">
              {gapAnalysis.roadmap.map((phase, idx) => (
                <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-sm font-bold text-indigo-300">{phase.phase}</span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg">{phase.duration}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">Core Topics to Cover:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.topics.map((top, tIdx) => (
                        <span key={tIdx} className="text-xs bg-slate-900 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-lg">
                          • {top}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-xl text-xs">
                    <span className="font-bold text-amber-300 block mb-0.5">Hands-On Capstone Project:</span>
                    <p className="text-slate-200">{phase.handsOnProject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
