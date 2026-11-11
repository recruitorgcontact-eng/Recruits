import React, { useState, useEffect } from "react";
import {
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  DollarSign,
  Loader2,
  UserCheck,
  PlusCircle,
  FileText,
  MapPin,
  Calendar,
  Layers,
  Send,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  Users,
  ExternalLink,
  ShieldCheck,
  Eye,
  Megaphone,
} from "lucide-react";
import { CandidateFitAnalysis, CareerMemory, LiveIndiaJob, UserProfile, JobApplication } from "../../types";
import {
  getStoredUserProfile,
  getStoredFreeJobs,
  saveFreeJob,
  toggleJobStatus,
  deleteFreeJob,
  getJobApplications,
} from "../../utils/jobStorage";
import { AuthModal } from "../AuthModal";

interface RecruiterAssistantEngineProps {
  memory: CareerMemory;
}

export const RecruiterAssistantEngine: React.FC<RecruiterAssistantEngineProps> = ({ memory }) => {
  const [activeTab, setActiveTab] = useState<"post_job" | "my_jobs" | "ai_matcher">("post_job");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUserProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Posted Free Jobs State
  const [postedJobs, setPostedJobs] = useState<LiveIndiaJob[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Free Job Posting Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(currentUser?.organizationName || "");
  const [sector, setSector] = useState<'Private' | 'Government' | 'PSU' | 'Banking'>("Private");
  const [categoryTag, setCategoryTag] = useState("Private Tech");
  const [jobType, setJobType] = useState<"Full-time" | "Remote" | "Hybrid" | "Contract">("Full-time");
  const [location, setLocation] = useState("Bangalore / Remote");
  const [vacancies, setVacancies] = useState("5 Positions");
  const [eligibility, setEligibility] = useState("B.Tech / MCA / Equivalent Graduate degree");
  const [salary, setSalary] = useState("₹8 - 15 LPA CTC");
  const [lastDate, setLastDate] = useState("30 August 2026");
  const [applyUrl, setApplyUrl] = useState("https://recruits.org.in/apply-direct");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "careers@company.com");
  const [skills, setSkills] = useState("React, Node.js, TypeScript, AI APIs");
  const [description, setDescription] = useState(
    "Looking for energetic, ambitious software engineers to build high-scale web products. Great growth opportunities, collaborative team environment, competitive compensation."
  );
  const [selectionProcess, setSelectionProcess] = useState("Online Resume Shortlisting -> Technical Interview -> HR Round");

  const [postSuccess, setPostSuccess] = useState(false);

  // AI Matcher state
  const [jobDescription, setJobDescription] = useState(
    "Senior Full Stack AI Engineer: Looking for a developer with 2+ years experience in React, TypeScript, Node.js, and LLM integrations."
  );
  const [matcherLoading, setMatcherLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CandidateFitAnalysis | null>(null);

  // Refresh Jobs & Applications
  const refreshData = () => {
    setPostedJobs(getStoredFreeJobs());
    setApplications(getJobApplications());
  };

  useEffect(() => {
    refreshData();
    const handleJobsUpdated = () => refreshData();
    window.addEventListener("arohi_jobs_updated", handleJobsUpdated);
    return () => window.removeEventListener("arohi_jobs_updated", handleJobsUpdated);
  }, []);

  useEffect(() => {
    if (currentUser?.organizationName && !company) {
      setCompany(currentUser.organizationName);
    }
    if (currentUser?.email && !contactEmail) {
      setContactEmail(currentUser.email);
    }
  }, [currentUser]);

  const handlePostFreeJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const newJob: LiveIndiaJob = {
      id: `recruiter-job-${Date.now()}`,
      title: title.trim(),
      organization: company.trim(),
      sector: sector,
      categoryTag: categoryTag,
      location: location,
      vacanciesOrPositions: vacancies,
      eligibility: eligibility,
      salaryOrPayScale: salary,
      lastDateToApply: lastDate,
      officialNotificationUrl: applyUrl.startsWith("http") ? applyUrl : `https://${applyUrl}`,
      applyUrl: applyUrl.startsWith("http") ? applyUrl : `https://${applyUrl}`,
      selectionProcessOverview: selectionProcess,
      keySkillsOrSyllabus: skills.split(",").map((s) => s.trim()).filter(Boolean),
      postedTime: "Live Recruiter Free Post",
      isHotNotification: true,
      postedByRecruiterEmail: currentUser?.email || contactEmail,
      isRecruiterFreePost: true,
      contactEmail: contactEmail,
      applicantCount: 0,
      status: "Active",
    };

    saveFreeJob(newJob);
    setPostSuccess(true);

    // Reset Form
    setTitle("");
    setDescription("");

    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab("my_jobs");
    }, 1500);
  };

  const handleToggleStatus = (jobId: string, currentStatus?: "Active" | "Closed") => {
    const nextStatus = currentStatus === "Closed" ? "Active" : "Closed";
    toggleJobStatus(jobId, nextStatus);
    refreshData();
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteFreeJob(jobId);
      refreshData();
    }
  };

  const handleAnalyzeCandidate = async () => {
    setMatcherLoading(true);
    try {
      const res = await fetch("/api/ai/recruiter-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          candidateProfiles: [memory],
          action: "match_candidates",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.result);
      }
    } catch (err) {
      console.error("Error in recruiter assistant:", err);
    } finally {
      setMatcherLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole="recruiter"
        onAuthSuccess={(profile) => {
          setCurrentUser(profile);
          setCompany(profile.organizationName || "");
          setContactEmail(profile.email);
        }}
      />

      {/* RECRUITER HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 rounded-2xl text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {currentUser?.organizationName || "Recruiter & Employer Portal"}
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Free Live Job Posting Facility
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Post unlimited free live job openings • Reach signed-up candidates • AI candidate skill evaluation
              </p>
            </div>
          </div>

          {/* User Status / Sign Up CTA */}
          <div>
            {currentUser && currentUser.role === "recruiter" ? (
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-4 rounded-2xl border border-slate-200">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{currentUser.organizationName}</span>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Switch / Edit Profile
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4" /> Sign Up as Recruiter
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 pt-4 flex-wrap">
          <button
            onClick={() => setActiveTab("post_job")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "post_job"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <PlusCircle className="w-4 h-4" /> 📢 Post Free Live Job
          </button>

          <button
            onClick={() => setActiveTab("my_jobs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "my_jobs"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Briefcase className="w-4 h-4" /> 📋 My Posted Jobs ({postedJobs.length})
          </button>

          <button
            onClick={() => setActiveTab("ai_matcher")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "ai_matcher"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> 🤖 AI Candidate Evaluator
          </button>
        </div>
      </div>

      {/* TAB 1: POST FREE LIVE JOB FORM */}
      {activeTab === "post_job" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-slate-900 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-600" /> Free Job Posting Facility (Instant Live)
              </h3>
              <p className="text-xs text-slate-500">
                Jobs posted here immediately appear on the Candidate Live Jobs Feed across India!
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              100% Free • No Credit Card
            </span>
          </div>

          {postSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>🚀 Job Published Successfully! It is now live on the platform for candidates to apply.</span>
            </div>
          )}

          <form onSubmit={handlePostFreeJob} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Job Opening Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack Engineer / Executive Officer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company / Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services / Razorpay / Tech Startup"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Private">Private Industry</option>
                  <option value="Government">Government / Public</option>
                  <option value="PSU">PSU / Central Dept</option>
                  <option value="Banking">Banking & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Private Tech, Startups, Central Govt"
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore / Bhubaneswar / All India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vacancies / Openings</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Open Positions"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Salary / Compensation (INR)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹10 - 18 LPA or ₹40,000 / month"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Application Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. 30 August 2026 / Rolling"
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Eligibility / Education</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech / Graduate in any discipline with 1+ yrs experience"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript, SQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Application URL or Apply Link</label>
                <input
                  type="text"
                  placeholder="e.g. https://company.com/careers/apply"
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recruiter Contact Email</label>
                <input
                  type="email"
                  placeholder="e.g. hr@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Job Description</label>
              <textarea
                rows={3}
                placeholder="Describe key responsibilities, team culture, and role expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selection Process Overview</label>
              <input
                type="text"
                placeholder="e.g. Resume Screening -> Technical Round -> HR Discussion"
                value={selectionProcess}
                onChange={(e) => setSelectionProcess(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" /> Publish Live Free Job Posting
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: MY POSTED FREE JOBS */}
      {activeTab === "my_jobs" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-slate-900 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" /> My Live Free Job Postings ({postedJobs.length})
              </h3>
              <p className="text-xs text-slate-500">Manage status, view candidate applicants, or remove listings</p>
            </div>

            <button
              onClick={() => setActiveTab("post_job")}
              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Post New Job
            </button>
          </div>

          {postedJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No Jobs Posted Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use our 100% Free Live Job Posting facility to publish your open positions and start attracting top Indian talent today!
              </p>
              <button
                onClick={() => setActiveTab("post_job")}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Post Your First Free Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {postedJobs.map((job) => (
                <div key={job.id} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                          Recruiter Direct Post
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            job.status === "Closed"
                              ? "bg-slate-200 text-slate-700 border-slate-300"
                              : "bg-indigo-100 text-indigo-800 border-indigo-300"
                          }`}
                        >
                          {job.status || "Active"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{job.postedTime}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{job.title}</h4>
                      <p className="text-xs text-slate-600 font-semibold">{job.organization} • {job.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
                      >
                        {job.status === "Closed" ? (
                          <>
                            <ToggleLeft className="w-4 h-4 text-slate-400" /> Re-Open
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" /> Mark Closed
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Salary CTC</span>
                      <strong className="text-slate-900 font-bold">{job.salaryOrPayScale}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Open Positions</span>
                      <strong className="text-slate-900 font-bold">{job.vacanciesOrPositions}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Deadline</span>
                      <strong className="text-slate-900 font-bold">{job.lastDateToApply}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Candidate Applicants</span>
                      <strong className="text-indigo-600 font-extrabold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {job.applicantCount || 0} Applied
                      </strong>
                    </div>
                  </div>

                  {/* Required Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.keySkillsOrSyllabus.map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-lg font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI CANDIDATE EVALUATOR */}
      {activeTab === "ai_matcher" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-slate-900 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl text-white shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">AI Candidate Evaluator & Skill Matcher</h3>
                <p className="text-xs text-slate-500">
                  Runs Arohi AI deep skill analysis against registered platform candidate profiles
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
              <label className="text-xs font-bold text-slate-700 block uppercase">Enter Job Description / Requisition</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 leading-relaxed font-medium"
              />

              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span>Evaluating Signed-Up Candidate: <strong className="text-slate-900 font-bold">Rahul Sharma ({memory.education.degree})</strong></span>
                <span className="text-emerald-700 font-bold">{memory.skills.length} Skills Logged</span>
              </div>
            </div>

            <button
              onClick={handleAnalyzeCandidate}
              disabled={matcherLoading || !jobDescription.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {matcherLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Evaluating Candidate Fit...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" /> Analyze Candidate Fit & Generate Questions
                </>
              )}
            </button>
          </div>

          {analysis && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-slate-900 shadow-md space-y-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Candidate Fit Analysis</span>
                  <h4 className="text-xl font-extrabold text-slate-900">{analysis.candidateName || "Rahul Sharma"}</h4>
                  <p className="text-xs text-slate-600 mt-1">{analysis.interviewSummary}</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center shrink-0">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Match Quality Score</div>
                  <div className="text-3xl font-black text-emerald-700">{analysis.matchScore}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strong Match Highlights
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {analysis.matchHighlights.map((hl, idx) => (
                      <li key={idx}>• {hl}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Missing Competencies / Gaps
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {analysis.missingCompetencies.map((gap, idx) => (
                      <li key={idx}>• {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" /> Suggested Interview Questions for Recruiter
                </h5>
                <div className="space-y-2">
                  {analysis.suggestedInterviewQuestions.map((q, idx) => (
                    <div key={idx} className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200 text-xs text-indigo-950 font-medium">
                      <strong className="text-indigo-800">Q{idx + 1}:</strong> "{q}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
