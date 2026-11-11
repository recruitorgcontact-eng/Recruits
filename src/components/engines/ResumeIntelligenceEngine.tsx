import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Download,
  FileDown,
  CheckSquare,
  Linkedin,
  X,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  Globe,
  Building,
  UserCheck,
  ExternalLink,
  Layers
} from "lucide-react";
import { CareerMemory, ATSAnalysisResult } from "../../types";
import { SAMPLE_RESUME_TEXT } from "../../data/mockData";
import { exportToPDF, exportToDOCX } from "../../utils/resumeExporter";

interface LinkedInImportedProfile {
  fullName: string;
  headline?: string;
  targetRole?: string;
  location?: string;
  experienceYears?: number;
  education?: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: string;
  };
  workHistory?: {
    title: string;
    company: string;
    duration: string;
    location?: string;
    highlights?: string[];
  }[];
  skills?: string[];
  certifications?: string[];
  preferredIndustries?: string[];
  preferredLocations?: string[];
  expectedSalaryINR?: number;
  careerGoals?: string;
  portfolioProjects?: {
    title: string;
    techStack: string[];
    description: string;
  }[];
  formattedResumeText?: string;
}

interface ResumeIntelligenceEngineProps {
  memory: CareerMemory;
  onUpdateMemory?: (updated: CareerMemory) => void;
}

export const ResumeIntelligenceEngine: React.FC<ResumeIntelligenceEngineProps> = ({ memory, onUpdateMemory }) => {
  const [candidateName, setCandidateName] = useState("Aarav Sharma");
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [targetRole, setTargetRole] = useState(memory.targetRole || "Full Stack AI Engineer");
  const [loading, setLoading] = useState(false);
  const [exportingType, setExportingType] = useState<"pdf" | "docx" | null>(null);
  const [appliedRewrites, setAppliedRewrites] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // LinkedIn Import Modal & State
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [linkedinInput, setLinkedinInput] = useState("https://www.linkedin.com/in/aarav-sharma-tech");
  const [customPasteText, setCustomPasteText] = useState("");
  const [importingLinkedIn, setImportingLinkedIn] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<LinkedInImportedProfile | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  const triggerImportToast = (msg: string) => {
    setImportSuccessMessage(msg);
    setTimeout(() => setImportSuccessMessage(null), 5000);
  };

  const handleFetchLinkedInProfile = async (overrideUrl?: string) => {
    const urlToUse = overrideUrl || linkedinInput;
    setImportingLinkedIn(true);
    setPreviewProfile(null);

    try {
      const res = await fetch("/api/ai/linkedin-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedinUrl: urlToUse,
          customPaste: customPasteText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setPreviewProfile(data.profile);
        }
      }
    } catch (err) {
      console.error("Error importing LinkedIn profile:", err);
    } finally {
      setImportingLinkedIn(false);
    }
  };

  const handleApplyLinkedInDataToMemory = () => {
    if (!previewProfile) return;

    // Build updated career memory
    const existingSkills = memory.skills || [];
    const newSkills = previewProfile.skills || [];
    const mergedSkills = Array.from(new Set([...existingSkills, ...newSkills]));

    const updatedMemory: CareerMemory = {
      ...memory,
      targetRole: previewProfile.targetRole || previewProfile.headline || targetRole,
      experienceYears: previewProfile.experienceYears || memory.experienceYears,
      skills: mergedSkills,
      education: previewProfile.education || memory.education,
      certifications: previewProfile.certifications || memory.certifications,
      preferredIndustries: previewProfile.preferredIndustries || memory.preferredIndustries,
      preferredLocations: previewProfile.preferredLocations || memory.preferredLocations,
      expectedSalaryINR: previewProfile.expectedSalaryINR || memory.expectedSalaryINR,
      careerGoals: previewProfile.careerGoals || memory.careerGoals,
      portfolioProjects: previewProfile.portfolioProjects && previewProfile.portfolioProjects.length > 0
        ? previewProfile.portfolioProjects
        : memory.portfolioProjects,
    };

    if (onUpdateMemory) {
      onUpdateMemory(updatedMemory);
    }

    // Populate local resume & inputs
    if (previewProfile.fullName) {
      setCandidateName(previewProfile.fullName);
    }
    if (previewProfile.targetRole) {
      setTargetRole(previewProfile.targetRole);
    }
    if (previewProfile.formattedResumeText) {
      setResumeText(previewProfile.formattedResumeText);
      setAppliedRewrites(false);
    }

    setShowLinkedInModal(false);
    triggerImportToast(
      `🎉 Successfully imported LinkedIn profile for ${previewProfile.fullName || "Candidate"}! ${mergedSkills.length} skills & ${previewProfile.workHistory?.length || 0} work experiences synced to Career Memory.`
    );
  };

  const handleAnalyzeResume = async () => {
    setLoading(true);
    setAppliedRewrites(false);
    try {
      const res = await fetch("/api/ai/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data.result);
      }
    } catch (err) {
      console.error("Error analyzing resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImprovedText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApplyAllRewrites = () => {
    if (!analysisResult) return;
    let updatedText = resumeText;
    analysisResult.improvedBulletPoints.forEach((item) => {
      if (item.original && item.improved && updatedText.includes(item.original)) {
        updatedText = updatedText.replace(item.original, item.improved);
      }
    });
    setResumeText(updatedText);
    setAppliedRewrites(true);
  };

  const handleExportPDF = async () => {
    setExportingType("pdf");
    try {
      exportToPDF({
        candidateName,
        targetRole,
        resumeText,
        analysisResult,
      });
    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setTimeout(() => setExportingType(null), 1000);
    }
  };

  const handleExportDOCX = async () => {
    setExportingType("docx");
    try {
      await exportToDOCX({
        candidateName,
        targetRole,
        resumeText,
        analysisResult,
      });
    } catch (err) {
      console.error("Failed to export DOCX:", err);
    } finally {
      setTimeout(() => setExportingType(null), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {importSuccessMessage && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span className="text-xs font-bold">{importSuccessMessage}</span>
          </div>
          <button
            onClick={() => setImportSuccessMessage(null)}
            className="p-1 hover:bg-white/20 rounded-lg text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resume Intelligence Engine</h2>
              <p className="text-xs text-slate-400">
                ATS Score Scanner, Keyword Gap Detection, 1-Click Rewriter & Export to PDF / DOCX
              </p>
            </div>
          </div>

          {/* Action Buttons: 1-Click LinkedIn Import + Export PDF / DOCX */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-import-linkedin"
              onClick={() => setShowLinkedInModal(true)}
              className="px-4 py-2 bg-[#0a66c2] hover:bg-[#084e96] text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer border border-blue-400/30"
            >
              <Linkedin className="w-4 h-4 fill-current shrink-0" />
              <span>Import from LinkedIn</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exportingType === "pdf"}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              title="Export as PDF"
            >
              {exportingType === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Export PDF
            </button>

            <button
              onClick={handleExportDOCX}
              disabled={exportingType === "docx"}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              title="Export as DOCX Word Document"
            >
              {exportingType === "docx" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
              Export DOCX
            </button>
          </div>
        </div>

        {/* Target Role & Input Area */}
        <div className="space-y-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Role for ATS Benchmarking</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Resume Content</label>
              <button
                onClick={() => {
                  setResumeText(SAMPLE_RESUME_TEXT);
                  setAppliedRewrites(false);
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
              >
                Reset to Sample Resume
              </button>
            </div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        <button
          id="btn-run-resume-analysis"
          onClick={handleAnalyzeResume}
          disabled={loading || !resumeText.trim()}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-amber-500 hover:from-amber-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Scanning ATS Compatibility...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" /> Run Resume Intelligence Scan & Rewrite
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
              <div className="text-5xl font-extrabold text-amber-300">{analysisResult.atsScore}%</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">ATS Compatibility Score</div>
              <div className="text-[10px] text-slate-400">Target Role: {targetRole}</div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </span>
              <ul className="space-y-1">
                {analysisResult.keyStrengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span> {str}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Critical Keyword Gaps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.criticalKeywordGaps.map((gap, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-md font-medium"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Improved Bullet Points & Direct Integration */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" /> AI Quantified Bullet Point Rewriter
              </h3>

              <button
                onClick={handleApplyAllRewrites}
                disabled={appliedRewrites}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  appliedRewrites
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-md"
                }`}
              >
                {appliedRewrites ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Rewrites Applied to Draft!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Apply All Rewrites to Resume Draft
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {analysisResult.improvedBulletPoints.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs">
                    <span className="text-slate-400 font-semibold block mb-0.5">Original Bullet:</span>
                    <p className="text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">{item.original}</p>
                  </div>

                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-amber-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> High-Impact AI Rewritten Bullet:
                      </span>
                      <button
                        onClick={() => handleCopyImprovedText(item.improved, idx)}
                        className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white transition bg-indigo-950/80 border border-indigo-700/60 px-2 py-1 rounded-md"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Bullet
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-white font-medium bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-lg leading-relaxed">
                      {item.improved}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    <strong>Why this works:</strong> {item.reason}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Export Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Ready to send to recruiters or apply on Recruits.org.in?
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" /> Export as PDF
                </button>
                <button
                  onClick={handleExportDOCX}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                >
                  <FileDown className="w-4 h-4" /> Export as DOCX
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINKEDIN IMPORT MODAL */}
      {showLinkedInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-[#0a66c2]/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl space-y-5 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0a66c2] text-white rounded-xl shadow-lg shadow-blue-600/30">
                  <Linkedin className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Import Career History from LinkedIn</h3>
                  <p className="text-xs text-slate-400">Auto-fetch work experience, skills, and education into Career Memory</p>
                </div>
              </div>
              <button
                onClick={() => setShowLinkedInModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* LinkedIn Profile Input & One-Click Presets */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  LinkedIn Profile URL or Handle
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Linkedin className="w-4 h-4 text-[#0a66c2] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={linkedinInput}
                      onChange={(e) => setLinkedinInput(e.target.value)}
                      placeholder="e.g. https://www.linkedin.com/in/aarav-sharma-tech"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#0a66c2]"
                    />
                  </div>

                  <button
                    id="btn-fetch-linkedin-profile"
                    onClick={() => handleFetchLinkedInProfile()}
                    disabled={importingLinkedIn || !linkedinInput.trim()}
                    className="px-4 py-2.5 bg-[#0a66c2] hover:bg-[#084e96] text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-blue-600/30 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {importingLinkedIn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Fetching...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Fetch Profile
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1-Click Demo Profiles */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider block">
                  ⚡ 1-Click Fast Sync Demo Profiles:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLinkedinInput("https://linkedin.com/in/aarav-sharma-tech");
                      handleFetchLinkedInProfile("https://linkedin.com/in/aarav-sharma-tech");
                    }}
                    className="p-2 bg-slate-900 hover:bg-blue-950/50 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition cursor-pointer text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-blue-300 block">Aarav Sharma</span>
                    <span className="text-[10px] text-slate-400 block truncate">Full Stack AI Eng (6 yrs)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLinkedinInput("https://linkedin.com/in/priya-patel-data");
                      handleFetchLinkedInProfile("https://linkedin.com/in/priya-patel-data");
                    }}
                    className="p-2 bg-slate-900 hover:bg-blue-950/50 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition cursor-pointer text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-blue-300 block">Priya Patel</span>
                    <span className="text-[10px] text-slate-400 block truncate">Senior Data Architect (8 yrs)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLinkedinInput("https://linkedin.com/in/rahul-verma-backend");
                      handleFetchLinkedInProfile("https://linkedin.com/in/rahul-verma-backend");
                    }}
                    className="p-2 bg-slate-900 hover:bg-blue-950/50 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition cursor-pointer text-xs group"
                  >
                    <span className="font-bold text-white group-hover:text-blue-300 block">Rahul Verma</span>
                    <span className="text-[10px] text-slate-400 block truncate">Backend SDE Lead (5 yrs)</span>
                  </button>
                </div>
              </div>

              {/* Optional Custom Paste Dropdown */}
              <details className="text-xs text-slate-400">
                <summary className="cursor-pointer hover:text-slate-200 transition font-medium">
                  Or paste raw text from your LinkedIn Profile PDF / About section
                </summary>
                <div className="mt-2 space-y-2">
                  <textarea
                    rows={4}
                    value={customPasteText}
                    onChange={(e) => setCustomPasteText(e.target.value)}
                    placeholder="Paste text copied from your LinkedIn Experience, Skills, or About section..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-[#0a66c2]"
                  />
                  <button
                    onClick={() => handleFetchLinkedInProfile("custom-paste")}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition"
                  >
                    Extract from Pasted Text
                  </button>
                </div>
              </details>
            </div>

            {/* EXTRACTED PROFILE PREVIEW CARD */}
            {previewProfile && (
              <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-4 space-y-4 shadow-xl">
                {/* Profile Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0a66c2] to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg">
                      {previewProfile.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                        {previewProfile.fullName}
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">
                          LinkedIn Verified
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300 font-medium">{previewProfile.headline}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-500" /> {previewProfile.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-500" /> {previewProfile.experienceYears} Years Exp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work History Section */}
                {previewProfile.workHistory && previewProfile.workHistory.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Work History ({previewProfile.workHistory.length} Positions)
                    </span>
                    <div className="space-y-2">
                      {previewProfile.workHistory.map((work, wIdx) => (
                        <div key={wIdx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white">{work.title}</span>
                            <span className="text-[10px] text-slate-400">{work.duration}</span>
                          </div>
                          <span className="text-[11px] text-blue-400 font-bold block mb-1">{work.company}</span>
                          {work.highlights && work.highlights.length > 0 && (
                            <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                              {work.highlights.map((h, hIdx) => (
                                <li key={hIdx}>{h}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Skills */}
                {previewProfile.skills && previewProfile.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Extracted Skills ({previewProfile.skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewProfile.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-blue-950/80 text-blue-200 border border-blue-800/60 text-[11px] px-2.5 py-0.5 rounded-lg font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {previewProfile.education && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white block">{previewProfile.education.degree} in {previewProfile.education.field}</span>
                        <span className="text-slate-400 text-[11px]">{previewProfile.education.institution}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{previewProfile.education.graduationYear}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewProfile(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Clear Preview
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-linkedin-import"
                    onClick={handleApplyLinkedInDataToMemory}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" /> Confirm & Auto-Populate Career Memory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


