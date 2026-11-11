import React, { useState } from "react";
import { Compass, Sparkles, TrendingUp, Calendar, CheckCircle2, ArrowRight, Loader2, Volume2 } from "lucide-react";
import { CareerMemory, CareerPath, LanguageCode } from "../../types";
import { speakText } from "../../utils/speech";

interface CareerNavigatorEngineProps {
  memory: CareerMemory;
  selectedLanguage: LanguageCode;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
}

export const CareerNavigatorEngine: React.FC<CareerNavigatorEngineProps> = ({
  memory,
  selectedLanguage,
  isSpeaking,
  setIsSpeaking,
}) => {
  const [education, setEducation] = useState(memory.education.degree || "B.Tech CS");
  const [interests, setInterests] = useState(memory.preferredIndustries.join(", ") || "AI, Fintech, Web Architecture");
  const [strengths, setStrengths] = useState(memory.skills.slice(0, 5).join(", ") || "React, TypeScript, Node.js");
  const [currentRole, setCurrentRole] = useState(memory.targetRole || "Software Developer");
  const [targetGoal, setTargetGoal] = useState(memory.careerGoals || "Transition into high-impact AI/Cloud Lead role");
  
  const [loading, setLoading] = useState(false);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);

  const handleNavigate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education,
          interests,
          strengths,
          currentRole,
          targetGoal,
          experienceYears: memory.experienceYears,
          language: selectedLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCareerPaths(data.paths || []);
      }
    } catch (err) {
      console.error("Error generating career paths:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakPath = (path: CareerPath) => {
    const speech = `Career Path: ${path.title}. Demand: ${path.marketDemand}. Projected Salary: ${path.projectedSalaryRangeINR}. Key Milestones include: ${path.keyMilestones.join(", ")}.`;
    setIsSpeaking(true);
    speakText({
      text: speech,
      language: selectedLanguage,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Career Navigator Engine</h2>
            <p className="text-xs text-slate-400">
              Arohi AI maps optimal career trajectories based on your education, strengths, and market demand
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Current Role / Education Stage</label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Education Background</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Key Technical & Soft Strengths</label>
            <input
              type="text"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Preferred Domain & Industry</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Long-Term Career Aspiration</label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          id="btn-generate-navigation"
          onClick={handleNavigate}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Mapping Career Trajectories...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Strategic Career Pathways
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {careerPaths.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Recommended Strategic Pathways
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {careerPaths.map((path, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-white shadow-xl transition relative group"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg">
                        Option #{index + 1}
                      </span>
                      <h4 className="text-lg font-bold text-white">{path.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{path.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSpeakPath(path)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl transition"
                      title="Listen to Arohi audio advice"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div className="text-right bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Match Fit</div>
                      <div className="text-sm font-extrabold text-amber-300">{path.fitScore}%</div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Market Demand</span>
                    <span className="text-xs font-bold text-emerald-400">{path.marketDemand}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Projected Salary (INR)</span>
                    <span className="text-xs font-bold text-amber-300">{path.projectedSalaryRangeINR}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Estimated Transition</span>
                    <span className="text-xs font-bold text-indigo-300">{path.transitionTimeline}</span>
                  </div>
                </div>

                {/* Key Milestones */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Milestone Execution Roadmap
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {path.keyMilestones.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills to acquire */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-2 font-medium">Recommended Tech Stack:</span>
                  {path.recommendedSkillsToAcquire.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] bg-indigo-950/60 text-indigo-200 border border-indigo-800/60 px-2 py-0.5 rounded-md font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
