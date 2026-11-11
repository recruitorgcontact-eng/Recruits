import React from "react";
import { Award, Zap, CheckCircle2, ArrowRight, X, Sparkles, RefreshCw } from "lucide-react";
import { CareerScoreBreakdown } from "../types";

interface CareerScoreCardProps {
  careerScore: CareerScoreBreakdown;
  isOpen: boolean;
  onClose: () => void;
  onSelectEngine: (engineId: string) => void;
  onRefreshScore: () => void;
  isCalculating: boolean;
}

export const CareerScoreCard: React.FC<CareerScoreCardProps> = ({
  careerScore,
  isOpen,
  onClose,
  onSelectEngine,
  onRefreshScore,
  isCalculating,
}) => {
  if (!isOpen) return null;

  const getActionEngine = (actionType: string) => {
    switch (actionType) {
      case "interview":
        return "interview";
      case "resume":
        return "resume";
      case "certification":
      case "skill":
        return "skillgap";
      case "project":
        return "learning";
      default:
        return "navigator";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-score-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Career Score Intelligence</h2>
            <p className="text-xs text-slate-400">
              Dynamic multi-pillar rating calculated by Arohi Career AI
            </p>
          </div>
        </div>

        {/* Big Meter Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-purple-500/20 border-4 border-amber-500/50 shadow-inner">
              <span className="text-4xl font-extrabold text-amber-300">{careerScore.totalScore}</span>
              <span className="text-xs text-slate-400 absolute bottom-3">out of 100</span>
            </div>
            <button
              id="btn-recalculate-score"
              onClick={onRefreshScore}
              disabled={isCalculating}
              className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? "animate-spin" : ""}`} />
              {isCalculating ? "Calculating..." : "Recalculate AI Score"}
            </button>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Actionable Score Booster Plan
            </h3>
            <p className="text-xs text-slate-400">
              Arohi Career AI identified {careerScore.improvementActions.length} high-impact actions to boost your score to {Math.min(100, careerScore.totalScore + 15)}+:
            </p>

            <div className="space-y-2">
              {careerScore.improvementActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                      +{action.potentialScoreIncrease} pts
                    </span>
                    <span className="text-xs text-slate-200 font-medium">{action.title}</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectEngine(getActionEngine(action.actionType));
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Fix Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pillars Breakdown */}
        <h3 className="text-sm font-semibold text-slate-200 mb-3">9-Pillar Career Score Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {careerScore.categories.map((cat, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{cat.name}</span>
                <span className="font-bold text-indigo-300">{cat.score}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{cat.impact}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            id="btn-close-score-footer"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
