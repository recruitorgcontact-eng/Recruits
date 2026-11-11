import React, { useState } from "react";
import { BookOpen, Sparkles, ExternalLink, Award, Code, Briefcase, Loader2 } from "lucide-react";
import { CareerMemory, CourseRecommendation } from "../../types";

interface LearningAdvisorEngineProps {
  memory: CareerMemory;
}

export const LearningAdvisorEngine: React.FC<LearningAdvisorEngineProps> = ({ memory }) => {
  const [goal, setGoal] = useState(memory.careerGoals || "Master Full-Stack AI Engineering & System Architecture");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/learning-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: memory.targetRole,
          gapSkills: memory.skills.slice(0, 4),
          goal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error("Error fetching learning recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "Certification":
        return Award;
      case "Project":
        return Code;
      case "Internship":
        return Briefcase;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Learning Advisor Engine</h2>
            <p className="text-xs text-slate-400">
              Recommends high-return courses, industry certifications, internships, and practice projects
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4">
          <label className="text-xs font-semibold text-slate-300 mb-1 block">Primary Learning Goal</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          id="btn-get-learning-recs"
          onClick={handleGetRecommendations}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Curating High-Impact Learning Modules...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Curate Tailored Learning Recommendations
            </>
          )}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Recommended Learning Assets ({recommendations.length})</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const IconComp = getIconForType(rec.type);

              return (
                <div
                  key={rec.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 text-white shadow-xl transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <IconComp className="w-3 h-3 text-indigo-400" /> {rec.type}
                      </span>
                      <span className="text-xs text-slate-400">{rec.duration}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-indigo-300 font-semibold">{rec.provider}</p>
                    <p className="text-xs text-slate-300">{rec.reason}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Level: <strong className="text-slate-200">{rec.level}</strong></span>
                    <a
                      href={rec.url || "https://recruits.org.in"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition"
                    >
                      Explore Resource <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
