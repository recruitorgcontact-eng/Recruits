import React, { useState } from "react";
import { DollarSign, Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { CareerMemory, SalaryEstimate } from "../../types";

interface SalaryIntelligenceEngineProps {
  memory: CareerMemory;
}

export const SalaryIntelligenceEngine: React.FC<SalaryIntelligenceEngineProps> = ({ memory }) => {
  const [role, setRole] = useState(memory.targetRole || "Full Stack AI Engineer");
  const [location, setLocation] = useState("Bangalore / Remote India");
  const [yearsExperience, setYearsExperience] = useState(memory.experienceYears || 2);
  const [loading, setLoading] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryEstimate | null>(null);

  const handleFetchSalaryData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/salary-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          location,
          yearsExperience,
          skills: memory.skills,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSalaryData(data.salaryData);
      }
    } catch (err) {
      console.error("Error fetching salary intelligence:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Salary Intelligence & Negotiation Engine</h2>
            <p className="text-xs text-slate-400">
              Real-time compensation benchmarks, CTC breakdown guides, and negotiation strategies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Location / Market</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Experience Years</label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
            />
          </div>
        </div>

        <button
          id="btn-fetch-salary-intel"
          onClick={handleFetchSalaryData}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 hover:from-amber-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Calculating Compensation Benchmarks...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" /> Fetch Salary Benchmarks & Negotiation Guide
            </>
          )}
        </button>
      </div>

      {salaryData && (
        <div className="space-y-6">
          {/* Salary Ranges Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200">Market CTC Bands ({salaryData.location})</h3>
              <span className="text-xs text-amber-300 font-bold">Target Role: {salaryData.targetRole}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Entry Level (0-2 Yrs)</span>
                <span className="text-lg font-bold text-indigo-300">{salaryData.entryLevelINR}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 text-center space-y-1 relative">
                <span className="text-[10px] text-amber-300 block uppercase font-semibold">Mid Level (2-5 Yrs)</span>
                <span className="text-xl font-extrabold text-amber-300">{salaryData.midLevelINR}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full absolute -top-2 left-1/2 -translate-x-1/2">
                  Your Tier
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Senior Level (5-8 Yrs)</span>
                <span className="text-lg font-bold text-emerald-300">{salaryData.seniorLevelINR}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Lead / Principal</span>
                <span className="text-lg font-bold text-purple-300">{salaryData.leadLevelINR}</span>
              </div>
            </div>
          </div>

          {/* CTC Components Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200">CTC Component Breakdown & Negotiation Leverage</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {salaryData.ctcBreakdownGuide.map((comp, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{comp.component}</span>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {comp.typicalPercentage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{comp.negotiationStrategy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Negotiation Tips */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Arohi Negotiation Strategy Blueprint
            </h3>
            <ul className="space-y-2">
              {salaryData.negotiationTips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
