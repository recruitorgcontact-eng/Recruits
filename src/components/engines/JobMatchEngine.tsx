import React, { useState } from "react";
import { Briefcase, Sparkles, MapPin, DollarSign, Building, CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import { CareerMemory, JobListing } from "../../types";
import { INITIAL_JOB_LISTINGS } from "../../data/mockData";

interface JobMatchEngineProps {
  memory: CareerMemory;
  onApplyWithAI: (jobTitle: string) => void;
}

export const JobMatchEngine: React.FC<JobMatchEngineProps> = ({ memory, onApplyWithAI }) => {
  const [jobListings, setJobListings] = useState<JobListing[]>(INITIAL_JOB_LISTINGS);
  const [matching, setMatching] = useState(false);
  const [customJobSearch, setCustomJobSearch] = useState("");

  const handleRunAIJobMatch = async () => {
    setMatching(true);
    try {
      const res = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateProfile: memory,
          jobs: jobListings,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.matchedJobs && Array.isArray(data.matchedJobs)) {
          setJobListings(data.matchedJobs);
        }
      }
    } catch (err) {
      console.error("Error matching jobs:", err);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Job Match Engine</h2>
              <p className="text-xs text-slate-400">
                Skills-first & project-fit matching algorithm powered by Arohi AI on Recruits.org.in
              </p>
            </div>
          </div>

          <button
            id="btn-run-job-match"
            onClick={handleRunAIJobMatch}
            disabled={matching}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 shrink-0"
          >
            {matching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Deep AI Matching...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Re-Match My Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Snapshot Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div>
            <span className="text-slate-400">Target Role:</span>{" "}
            <strong className="text-white">{memory.targetRole}</strong>
          </div>
          <div>
            <span className="text-slate-400">Skills ({memory.skills.length}):</span>{" "}
            <span className="text-indigo-300 font-medium">{memory.skills.slice(0, 4).join(", ")} +more</span>
          </div>
          <div>
            <span className="text-slate-400">Target Salary:</span>{" "}
            <strong className="text-amber-300">₹{memory.expectedSalaryINR} LPA</strong>
          </div>
        </div>
      </div>

      {/* Job Listings List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200">
          Matched Opportunities ({jobListings.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {jobListings.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-white shadow-xl transition space-y-4"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{job.title}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-indigo-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" /> {job.salaryRangeINR}
                    </span>
                  </div>
                </div>

                {job.aiMatchScore && (
                  <div className="bg-indigo-950/80 border border-indigo-700/60 p-3 rounded-xl flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-indigo-300">AI Match Score</div>
                      <div className="text-xl font-extrabold text-amber-300">{job.aiMatchScore}%</div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

              {/* AI Reasoning Box */}
              {job.aiMatchReasoning && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Arohi Match Analysis
                  </div>
                  <p className="text-xs text-slate-300">{job.aiMatchReasoning}</p>

                  {job.missingSkills && job.missingSkills.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Missing Skills to Acquire:</span>
                      {job.missingSkills.map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-amber-950/60 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded text-[10px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((sk, sIdx) => {
                    const isMatched = memory.skills.some((s) => s.toLowerCase() === sk.toLowerCase());
                    return (
                      <span
                        key={sIdx}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                          isMatched
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {isMatched && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                        {sk}
                      </span>
                    );
                  })}
                </div>

                <button
                  id={`btn-apply-job-${job.id}`}
                  onClick={() => onApplyWithAI(job.title)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" /> Optimize & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
