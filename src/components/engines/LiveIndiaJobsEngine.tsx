import React, { useState, useEffect } from "react";
import {
  Globe,
  Sparkles,
  Search,
  Building,
  MapPin,
  Calendar,
  Award,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  RefreshCw,
  Zap,
  Bookmark,
  Share2,
  BookOpen,
  Bell,
  BellRing,
  Mail,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Send,
  ShieldCheck,
  Check,
  Clock,
  Radio,
  X,
  TrendingUp,
  BarChart3,
  CalendarDays,
  PieChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { LiveIndiaJob, CareerMemory, JobAlertSubscription } from "../../types";
import { INITIAL_LIVE_INDIA_JOBS } from "../../data/mockData";
import { getStoredFreeJobs, submitCandidateApplication, getStoredUserProfile, saveFreeJob } from "../../utils/jobStorage";
import { FeaturedEmployerBanner } from "../FeaturedEmployerBanner";

const SECTOR_30_DAY_TREND_DATA = [
  { date: "Jun 25", Government: 120, Private: 210, Banking: 85, PSU: 45, Total: 460 },
  { date: "Jun 28", Government: 135, Private: 225, Banking: 90, PSU: 50, Total: 500 },
  { date: "Jul 01", Government: 150, Private: 240, Banking: 110, PSU: 60, Total: 560 },
  { date: "Jul 04", Government: 140, Private: 260, Banking: 105, PSU: 55, Total: 560 },
  { date: "Jul 07", Government: 165, Private: 280, Banking: 125, PSU: 70, Total: 640 },
  { date: "Jul 10", Government: 180, Private: 310, Banking: 130, PSU: 75, Total: 695 },
  { date: "Jul 13", Government: 175, Private: 295, Banking: 140, PSU: 80, Total: 690 },
  { date: "Jul 16", Government: 210, Private: 330, Banking: 155, PSU: 90, Total: 785 },
  { date: "Jul 19", Government: 225, Private: 350, Banking: 160, PSU: 95, Total: 830 },
  { date: "Jul 22", Government: 240, Private: 380, Banking: 175, PSU: 110, Total: 905 },
  { date: "Jul 25", Government: 265, Private: 410, Banking: 190, PSU: 125, Total: 990 },
];

interface LiveIndiaJobsEngineProps {
  memory: CareerMemory;
  onApplyOrPrepWithAI?: (jobTitle: string, sector: string) => void;
}

const DEFAULT_ALERTS: JobAlertSubscription[] = [
  {
    id: "alert-01",
    email: "recruit.org.contact@gmail.com",
    sector: "Government",
    categoryTag: "Central Govt",
    location: "All India",
    keywords: "UPSC, SSC, Railway, IAS",
    frequency: "Instant Push & Email",
    isActive: true,
    createdAt: "2026-07-20",
    lastAlertSentAt: "Today at 08:30 AM",
    matchCount: 3,
  },
  {
    id: "alert-02",
    email: "recruit.org.contact@gmail.com",
    sector: "Private",
    categoryTag: "Private Tech",
    location: "Bengaluru, Karnataka",
    keywords: "AI, Full Stack, React, Engineer",
    frequency: "Daily Digest",
    isActive: true,
    createdAt: "2026-07-22",
    lastAlertSentAt: "Yesterday at 06:00 PM",
    matchCount: 2,
  },
];

export const LiveIndiaJobsEngine: React.FC<LiveIndiaJobsEngineProps> = ({
  memory,
  onApplyOrPrepWithAI,
}) => {
  // State
  const [jobs, setJobs] = useState<LiveIndiaJob[]>(INITIAL_LIVE_INDIA_JOBS);
  const [loading, setLoading] = useState(false);
  const [chartViewStyle, setChartViewStyle] = useState<"area" | "bar">("area");

  // Filters
  const [selectedSector, setSelectedSector] = useState<string>("All"); // "All" | "Government" | "Private" | "Banking" | "PSU"
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stateLocation, setStateLocation] = useState("All India");
  const [qualification, setQualification] = useState("Any");

  const [aiPrepModalJob, setAiPrepModalJob] = useState<LiveIndiaJob | null>(null);

  // Candidate Direct Apply Modal State
  const [applyDirectJob, setApplyDirectJob] = useState<LiveIndiaJob | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantNote, setApplicantNote] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // Load custom free jobs posted by recruiters
  const loadJobsWithCustomFreePosts = () => {
    const customFreeJobs = getStoredFreeJobs();
    const activeCustom = customFreeJobs.filter((j) => j.status !== "Closed");
    const customIds = new Set(activeCustom.map((j) => j.id));
    const baseList = INITIAL_LIVE_INDIA_JOBS.filter((j) => !customIds.has(j.id));
    setJobs([...activeCustom, ...baseList]);
  };

  useEffect(() => {
    loadJobsWithCustomFreePosts();
    const handleJobsUpdated = () => loadJobsWithCustomFreePosts();
    window.addEventListener("arohi_jobs_updated", handleJobsUpdated);
    return () => window.removeEventListener("arohi_jobs_updated", handleJobsUpdated);
  }, []);

  // Pre-fill user profile if signed in
  useEffect(() => {
    const user = getStoredUserProfile();
    if (user) {
      setApplicantName(user.name || "");
      setApplicantEmail(user.email || "");
      setApplicantPhone(user.phone || "");
    }
  }, [applyDirectJob]);

  // Job Alerts State
  const [alerts, setAlerts] = useState<JobAlertSubscription[]>(() => {
    try {
      const saved = localStorage.getItem("arohi_job_alerts");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load saved job alerts:", e);
    }
    return DEFAULT_ALERTS;
  });

  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Alert Dispatch Preview Modal
  const [dispatchedAlertData, setDispatchedAlertData] = useState<{
    alert: JobAlertSubscription;
    matchedJobs: LiveIndiaJob[];
    dispatchedTime: string;
  } | null>(null);

  // New Alert Form Fields
  const [newEmail, setNewEmail] = useState("recruit.org.contact@gmail.com");
  const [newSector, setNewSector] = useState("Government");
  const [newCategoryTag, setNewCategoryTag] = useState("Central Govt");
  const [newLocation, setNewLocation] = useState("All India");
  const [newKeywords, setNewKeywords] = useState("");
  const [newFrequency, setNewFrequency] = useState<
    "Instant Push & Email" | "Daily Digest" | "Weekly Briefing"
  >("Instant Push & Email");

  useEffect(() => {
    try {
      localStorage.setItem("arohi_job_alerts", JSON.stringify(alerts));
    } catch (e) {
      console.warn("Error saving job alerts:", e);
    }
  }, [alerts]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Employer Free Job Posting Modal State
  const [showPostFreeJobModal, setShowPostFreeJobModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postCompany, setPostCompany] = useState("");
  const [postSector, setPostSector] = useState<"Private" | "Government" | "PSU" | "Banking">("Private");
  const [postLocation, setPostLocation] = useState("Bangalore / Remote");
  const [postSalary, setPostSalary] = useState("₹12 - 22 LPA");
  const [postVacancies, setPostVacancies] = useState("5 Positions");
  const [postEligibility, setPostEligibility] = useState("B.Tech / MCA / Equivalent Graduate");
  const [postApplyUrl, setPostApplyUrl] = useState("https://recruits.org.in/apply-direct");
  const [postContactEmail, setPostContactEmail] = useState("careers@company.com");
  const [postSkills, setPostSkills] = useState("React, Node.js, TypeScript, AI APIs");

  const handleCreateFreeJobPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postCompany.trim()) {
      alert("Please enter a job title and company name.");
      return;
    }

    const newJob: LiveIndiaJob = {
      id: `free-job-${Date.now()}`,
      title: postTitle.trim(),
      organization: postCompany.trim(),
      sector: postSector,
      categoryTag: postSector === "Private" ? "Private Tech" : "Govt & PSU",
      location: postLocation.trim() || "Pan India",
      vacanciesOrPositions: postVacancies.trim() || "Multiple Positions",
      eligibility: postEligibility.trim() || "Graduate Degree",
      salaryOrPayScale: postSalary.trim() || "Competitive Salary",
      lastDateToApply: "30 August 2026",
      officialNotificationUrl: postApplyUrl.trim() || "https://recruits.org.in",
      applyUrl: postApplyUrl.trim() || "https://recruits.org.in",
      selectionProcessOverview: "Direct HR Shortlisting -> Technical Interview -> Offer",
      keySkillsOrSyllabus: postSkills.split(",").map((s) => s.trim()).filter(Boolean),
      postedTime: "Just Posted • 0% Fee",
      isRecruiterFreePost: true,
      contactEmail: postContactEmail.trim(),
      status: "Active",
      applicantCount: 0,
    };

    saveFreeJob(newJob);
    setShowPostFreeJobModal(false);
    triggerToast(`🎉 Free Job Post created for ${postCompany}! Published to Candidates.`);

    // Reset Form
    setPostTitle("");
    setPostCompany("");
  };

  const CATEGORY_QUICK_FILTERS = [
    { label: "All India", category: "All" },
    { label: "📢 Recruiter Free Posts", category: "Recruiter Postings" },
    { label: "Central Govt (UPSC/SSC/RRB)", category: "Central Govt" },
    { label: "State PSCs", category: "State PSC" },
    { label: "Banking & Financial (SBI/IBPS)", category: "Banking" },
    { label: "Private Tech & IT", category: "Private Tech" },
    { label: "AI Startups & Product", category: "Startups" },
    { label: "PSU & Defense (ISRO/DRDO)", category: "PSU & Defense" },
  ];

  const handleCrawlLiveJobs = async (
    overrideQuery?: string,
    overrideSector?: string
  ) => {
    setLoading(true);
    const activeQuery =
      overrideQuery !== undefined ? overrideQuery : searchQuery;
    const activeSector =
      overrideSector !== undefined ? overrideSector : selectedSector;

    try {
      const res = await fetch("/api/ai/live-jobs-crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: activeSector,
          category: selectedCategory,
          searchQuery:
            activeQuery || "Latest open job recruitment notifications India 2026",
          stateLocation,
          qualification,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (
          data.liveJobs &&
          Array.isArray(data.liveJobs) &&
          data.liveJobs.length > 0
        ) {
          setJobs(data.liveJobs);
          triggerToast("✨ Live Web Crawl Completed! Jobs updated.");
        }
      }
    } catch (err) {
      console.error("Error crawling live jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  const filteredJobs = jobs.filter((job) => {
    if (
      selectedSector !== "All" &&
      job.sector.toLowerCase() !== selectedSector.toLowerCase()
    ) {
      return false;
    }
    if (selectedCategory === "Recruiter Postings") {
      if (!job.isRecruiterFreePost) return false;
    } else if (
      selectedCategory !== "All" &&
      job.categoryTag.toLowerCase() !== selectedCategory.toLowerCase() &&
      !job.categoryTag
        .toLowerCase()
        .includes(selectedCategory.toLowerCase())
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        job.title.toLowerCase().includes(q) ||
        job.organization.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.keySkillsOrSyllabus.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (stateLocation !== "All India") {
      if (
        !job.location.toLowerCase().includes(stateLocation.toLowerCase()) &&
        !job.location.toLowerCase().includes("all india") &&
        !job.location.toLowerCase().includes("pan india")
      ) {
        return false;
      }
    }
    return true;
  });

  // Handle Add New Alert Subscription
  const handleSaveNewAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    const created: JobAlertSubscription = {
      id: "alert-" + Date.now(),
      email: newEmail.trim(),
      sector: newSector,
      categoryTag: newCategoryTag,
      location: newLocation,
      keywords: newKeywords.trim() || "All Keywords",
      frequency: newFrequency,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      matchCount: 0,
    };

    setAlerts((prev) => [created, ...prev]);
    setShowCreateAlertModal(false);
    triggerToast(`🔔 Job Alert created for ${newSector} (${newLocation})!`);
  };

  // Quick subscribe to current active filter view
  const handleQuickSubscribeCurrentFilter = () => {
    setNewSector(selectedSector === "All" ? "Government" : selectedSector);
    setNewCategoryTag(selectedCategory === "All" ? "Central Govt" : selectedCategory);
    setNewLocation(stateLocation);
    setNewKeywords(searchQuery);
    setShowCreateAlertModal(true);
  };

  const handleToggleAlertStatus = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    triggerToast("Job alert status updated.");
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    triggerToast("Job alert deleted.");
  };

  // Test & Dispatch Alert push notification
  const handleRunAlertDispatch = (alertItem: JobAlertSubscription) => {
    const matches = jobs.filter((job) => {
      if (
        alertItem.sector !== "All" &&
        job.sector.toLowerCase() !== alertItem.sector.toLowerCase()
      ) {
        return false;
      }
      if (
        alertItem.categoryTag !== "All" &&
        !job.categoryTag
          .toLowerCase()
          .includes(alertItem.categoryTag.toLowerCase())
      ) {
        return false;
      }
      if (
        alertItem.location !== "All India" &&
        !job.location
          .toLowerCase()
          .includes(alertItem.location.toLowerCase()) &&
        !job.location.toLowerCase().includes("all india")
      ) {
        return false;
      }
      if (
        alertItem.keywords &&
        alertItem.keywords !== "All Keywords"
      ) {
        const kwList = alertItem.keywords
          .toLowerCase()
          .split(",")
          .map((k) => k.trim());
        const matchesKw = kwList.some(
          (kw) =>
            job.title.toLowerCase().includes(kw) ||
            job.organization.toLowerCase().includes(kw) ||
            job.keySkillsOrSyllabus.some((s) => s.toLowerCase().includes(kw))
        );
        if (!matchesKw) return false;
      }
      return true;
    });

    const matchedList = matches.length > 0 ? matches : jobs.slice(0, 3);

    // Update alert's last sent timestamp
    const nowStr = `Just now (${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })})`;

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertItem.id
          ? { ...a, lastAlertSentAt: nowStr, matchCount: matchedList.length }
          : a
      )
    );

    setDispatchedAlertData({
      alert: alertItem,
      matchedJobs: matchedList,
      dispatchedTime: new Date().toLocaleString(),
    });
  };

  const activeAlertsCount = alerts.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/80 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <BellRing className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Live All-India Jobs Crawling Portal</h2>
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Web Crawling Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time aggregation of Government notifications (UPSC, SSC, Railways, Banking, State PSCs) & Private sector career openings across India
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Job Alerts Button */}
              <button
                id="btn-open-job-alerts"
                onClick={() => setShowAlertsModal(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-500/10 shrink-0 cursor-pointer"
              >
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>Job Alerts Subscriptions</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] px-2 py-0.5 rounded-full">
                  {activeAlertsCount} Active
                </span>
              </button>

              {/* Crawl Live Jobs Button */}
              <button
                id="btn-crawl-live-jobs"
                onClick={() => handleCrawlLiveJobs()}
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Crawling Open Notifications...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 text-emerald-200" /> Crawl Live Web Jobs Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search & Multi-Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job title, dept (e.g. UPSC, SBI, TCS, Railway, React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCrawlLiveJobs();
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <select
                value={stateLocation}
                onChange={(e) => setStateLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="All India">Location: All India</option>
                <option value="Delhi">Delhi / NCR</option>
                <option value="Bangalore">Bengaluru, Karnataka</option>
                <option value="Maharashtra">Maharashtra / Mumbai / Pune</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
                <option value="Tamil Nadu">Tamil Nadu / Chennai</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal / Kolkata</option>
              </select>
            </div>

            <div>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Any">Qualification: Any</option>
                <option value="Graduate">Graduate (BA/B.Sc/B.Com)</option>
                <option value="B.Tech / BE">B.Tech / BE Engineering</option>
                <option value="10th/12th Pass">10th / 12th Pass</option>
                <option value="Post Graduate">Post Graduate / M.Tech / MBA</option>
              </select>
            </div>
          </div>

          {/* Sector Toggle Tabs & Subscribe Quick Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "All", label: "All Sectors" },
                { id: "Government", label: "🏛️ Govt Sector" },
                { id: "Private", label: "💻 Private Sector" },
                { id: "Banking", label: "🏦 Banking & Finance" },
                { id: "PSU", label: "⚡ PSUs & Defense" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedSector(tab.id);
                    handleCrawlLiveJobs(searchQuery, tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedSector === tab.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleQuickSubscribeCurrentFilter}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-emerald-400" /> Subscribe Alert to Current View
              </button>

              <span className="text-xs text-slate-400">
                Showing <strong className="text-amber-300">{filteredJobs.length}</strong> live notices
              </span>
            </div>
          </div>

          {/* Category Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Filters:</span>
            {CATEGORY_QUICK_FILTERS.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat.category);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  selectedCategory === cat.category
                    ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/80 font-bold"
                    : "bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED EMPLOYERS CAROUSEL BANNER */}
      <FeaturedEmployerBanner
        onSelectEmployer={(empName) => {
          setSearchQuery(empName);
          triggerToast(`🔍 Filtered live openings for ${empName}`);
        }}
        onPostJobClick={() => setShowPostFreeJobModal(true)}
        onViewAllFreeJobs={() => {
          setSelectedCategory("Recruiter Postings");
          triggerToast("📢 Showing all 0% Commission Recruiter Free Job Posts");
        }}
      />

      {/* 30-DAY SECTOR TREND CHART (RECHARTS) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  30-Day Job Posting Trend by Sector
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  +24.8% Growth
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualizing recruitment notification volume across Govt, Tech, Banking & PSUs (Last 30 Days)
              </p>
            </div>
          </div>

          {/* Controls: Area vs Bar Toggle */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartViewStyle("area")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                chartViewStyle === "area"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Area Trend
            </button>
            <button
              onClick={() => setChartViewStyle("bar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                chartViewStyle === "bar"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Bar Comparison
            </button>
          </div>
        </div>

        {/* Sector Metric Highlights Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Govt Sector (UPSC/SSC)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-amber-400">265</span>
              <span className="text-[10px] text-emerald-400 font-bold">+28%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Private Tech & IT</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-emerald-400">410</span>
              <span className="text-[10px] text-emerald-400 font-bold">+32%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Banking & IBPS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-cyan-400">190</span>
              <span className="text-[10px] text-emerald-400 font-bold">+18%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">PSUs & Defense</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-indigo-400">125</span>
              <span className="text-[10px] text-emerald-400 font-bold">+15%</span>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewStyle === "area" ? (
              <AreaChart data={SECTOR_30_DAY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGovt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPrivate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBanking" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPSU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Area type="monotone" dataKey="Government" stroke="#f59e0b" fillOpacity={1} fill="url(#colorGovt)" />
                <Area type="monotone" dataKey="Private" stroke="#10b981" fillOpacity={1} fill="url(#colorPrivate)" />
                <Area type="monotone" dataKey="Banking" stroke="#06b6d4" fillOpacity={1} fill="url(#colorBanking)" />
                <Area type="monotone" dataKey="PSU" stroke="#6366f1" fillOpacity={1} fill="url(#colorPSU)" />
              </AreaChart>
            ) : (
              <BarChart data={SECTOR_30_DAY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Bar dataKey="Government" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Private" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Banking" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PSU" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300" /> Active India Job Notifications ({filteredJobs.length})
          </h3>

          {loading && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Live Crawling Web Portals...
            </span>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <Globe className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-200">No active job matches found for current filter</h4>
            <p className="text-xs max-w-md mx-auto">
              Click below to launch an instant live web crawl search for "{searchQuery || "all India open notifications"}".
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => handleCrawlLiveJobs()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Trigger Live AI Crawl
              </button>
              <button
                onClick={handleQuickSubscribeCurrentFilter}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition inline-flex items-center gap-2"
              >
                <Bell className="w-3.5 h-3.5" /> Create Alert for this Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const isGovt = job.sector === "Government" || job.sector === "PSU";
              const isBank = job.sector === "Banking";

              return (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-white shadow-xl transition space-y-4 relative overflow-hidden"
                >
                  {/* Card Header Tag Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                          isGovt
                            ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                            : isBank
                            ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/60"
                            : "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
                        }`}
                      >
                        {job.sector} Sector
                      </span>

                      <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {job.categoryTag}
                      </span>

                      {job.isHotNotification && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          🔥 Hot 2026 Opening
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-400" /> {job.postedTime}
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white leading-snug">{job.title}</h4>
                    <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {job.organization}
                    </p>
                  </div>

                  {/* Key Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <strong className="text-slate-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {job.location}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Vacancies / Posts</span>
                      <strong className="text-amber-300 mt-0.5 block">{job.vacanciesOrPositions}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Pay Scale / CTC</span>
                      <strong className="text-emerald-300 mt-0.5 block">{job.salaryOrPayScale}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Last Date to Apply</span>
                      <strong className="text-rose-300 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-400 shrink-0" /> {job.lastDateToApply}
                      </strong>
                    </div>
                  </div>

                  {/* Eligibility & Selection Process */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold">Eligibility Criteria:</span>{" "}
                      <span className="text-slate-200">{job.eligibility}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold">Selection Process:</span>{" "}
                      <span className="text-slate-300">{job.selectionProcessOverview}</span>
                    </div>
                  </div>

                  {/* Required Skills / Syllabus Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Key Syllabus / Tech Stack:</span>
                    {job.keySkillsOrSyllabus.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={job.officialNotificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" /> Official Notification <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        Apply Online <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {job.isRecruiterFreePost && (
                        <button
                          onClick={() => {
                            setApplyDirectJob(job);
                            setApplySuccess(false);
                          }}
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" /> Direct Apply to Employer
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setAiPrepModalJob(job)}
                      className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Arohi AI Preparation Plan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JOB ALERTS MANAGEMENT MODAL */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-3xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Job Alert Notifications Center
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold uppercase">
                      Live Push Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Subscribe to customized job categories & locations to receive push notifications and instant email alerts whenever new jobs are crawled.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAlertsModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subscriptions List & Action Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Active Alert Subscriptions ({alerts.length})
                </h4>

                <button
                  onClick={() => setShowCreateAlertModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create New Job Alert
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-3">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">You have no active job alert subscriptions configured.</p>
                  <button
                    onClick={() => setShowCreateAlertModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Set Up Your First Alert
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alertItem) => (
                    <div
                      key={alertItem.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        alertItem.isActive
                          ? "bg-slate-950 border-slate-800 hover:border-amber-500/40"
                          : "bg-slate-950/50 border-slate-900 opacity-60"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-amber-300">
                              {alertItem.sector} Sector • {alertItem.categoryTag}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md">
                              {alertItem.location}
                            </span>
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-md">
                              {alertItem.frequency}
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>Sending alerts to <strong className="text-slate-200">{alertItem.email}</strong></span>
                          </div>

                          {alertItem.keywords && (
                            <div className="text-[11px] text-slate-400">
                              Keywords: <code className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-800">{alertItem.keywords}</code>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAlertStatus(alertItem.id)}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            title="Toggle Alert Active State"
                          >
                            {alertItem.isActive ? (
                              <>
                                <ToggleRight className="w-6 h-6 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-6 h-6 text-slate-600" />
                                <span className="text-[10px] text-slate-500 font-bold">Paused</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteAlert(alertItem.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete Subscription"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Dispatch Action & Status */}
                      <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> Last Alert Sent: {alertItem.lastAlertSentAt || "Never"}
                        </span>

                        <button
                          onClick={() => handleRunAlertDispatch(alertItem)}
                          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-amber-300" /> Test Dispatch Alert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAlertsModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW JOB ALERT MODAL */}
      {showCreateAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNewAlert}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-lg w-full space-y-5 shadow-2xl relative"
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 rounded-xl text-white">
                  <BellPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Set Up Custom Job Alert</h3>
                  <p className="text-xs text-slate-400">Receive instant notifications for live openings</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateAlertModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="name@domain.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Sector</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Government">Government Sector</option>
                    <option value="Private">Private Sector</option>
                    <option value="Banking">Banking & Finance</option>
                    <option value="PSU">PSU & Defense</option>
                    <option value="All">All Sectors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category Tag</label>
                  <select
                    value={newCategoryTag}
                    onChange={(e) => setNewCategoryTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Central Govt">Central Govt (UPSC/SSC)</option>
                    <option value="State PSC">State PSCs</option>
                    <option value="Banking">Banking (SBI/IBPS)</option>
                    <option value="Private Tech">Private Tech & IT</option>
                    <option value="Startups">Startups</option>
                    <option value="PSU & Defense">PSU & Defense</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Location</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All India">All India / Pan India</option>
                    <option value="Delhi">Delhi / NCR</option>
                    <option value="Bangalore">Bengaluru, Karnataka</option>
                    <option value="Maharashtra">Maharashtra / Mumbai / Pune</option>
                    <option value="Hyderabad">Hyderabad, Telangana</option>
                    <option value="Tamil Nadu">Tamil Nadu / Chennai</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Alert Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Instant Push & Email">Instant Push & Email</option>
                    <option value="Daily Digest">Daily Digest</option>
                    <option value="Weekly Briefing">Weekly Briefing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Keywords (Optional)</label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. IAS, Railway, React, Full Stack"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateAlertModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" /> Activate Alert Subscription
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DISPATCHED ALERT PREVIEW MODAL */}
      {dispatchedAlertData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/60 rounded-3xl p-6 text-white max-w-2xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header Badge */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                  <BellRing className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Simulated Job Alert Dispatched!</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold">
                      Email & Push Sent
                    </span>
                  </div>
                  <p className="text-xs text-amber-300">
                    To: {dispatchedAlertData.alert.email} • Sent at {dispatchedAlertData.dispatchedTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDispatchedAlertData(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Body Simulation */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-900">
                <span>Subject: 🎯 [Recruits.org.in Alert] {dispatchedAlertData.matchedJobs.length} New Openings Matched Your Profile</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <p className="text-slate-300 leading-relaxed">
                Hello Candidate, your active Job Alert for <strong>{dispatchedAlertData.alert.sector} Sector</strong> (
                <strong>{dispatchedAlertData.alert.location}</strong>) detected <strong>{dispatchedAlertData.matchedJobs.length}</strong> new recruitment notifications in our live crawl:
              </p>

              {/* Matched Items */}
              <div className="space-y-2.5 pt-1">
                {dispatchedAlertData.matchedJobs.map((mJob) => (
                  <div
                    key={mJob.id}
                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-100">{mJob.title}</h5>
                      <p className="text-[11px] text-indigo-300">{mJob.organization} • {mJob.salaryOrPayScale}</p>
                      <span className="text-[10px] text-rose-300">Last Date: {mJob.lastDateToApply}</span>
                    </div>

                    <a
                      href={mJob.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-md shadow-emerald-600/20"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDispatchedAlertData(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arohi AI Preparation Plan Modal for Selected Job */}
      {aiPrepModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-2xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl text-white">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Arohi AI Preparation & Strategy Plan</h3>
                  <p className="text-xs text-indigo-300">{aiPrepModalJob.title}</p>
                </div>
              </div>

              <button
                onClick={() => setAiPrepModalJob(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-300 block">Organization & Sector Overview:</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>{aiPrepModalJob.organization}</strong> ({aiPrepModalJob.sector} Sector) is offering{" "}
                  <strong>{aiPrepModalJob.vacanciesOrPositions}</strong> with pay scale of{" "}
                  <strong>{aiPrepModalJob.salaryOrPayScale}</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 block">Recommended Preparation Timeline & Strategy:</span>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Stage 1 (Weeks 1-2):</strong> Master core syllabus subjects:{" "}
                      {aiPrepModalJob.keySkillsOrSyllabus.join(", ")}.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Stage 2 (Weeks 3-4):</strong> Practice mock examination papers & mock interviews using Arohi's Voice Interview Coach.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Stage 3 (Final Phase):</strong> Ensure registration before{" "}
                      <strong className="text-rose-300">{aiPrepModalJob.lastDateToApply}</strong> on official portal ({aiPrepModalJob.officialNotificationUrl}).
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/60 space-y-2">
                <span className="font-bold text-indigo-300 block">Arohi Profile Fit Analysis:</span>
                <p className="text-slate-200">
                  Your current profile degree (<strong>{memory.education.degree}</strong>) matches the eligibility requirement (
                  <strong>{aiPrepModalJob.eligibility}</strong>). Use Arohi's Resume Engine to tailor your resume specifically for this opening.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <a
                href={aiPrepModalJob.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                Proceed to Apply Online <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE DIRECT APPLICATION MODAL */}
      {applyDirectJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ✨ Direct Application to Employer
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{applyDirectJob.title}</h3>
                <p className="text-xs text-slate-500">{applyDirectJob.organization} • {applyDirectJob.location}</p>
              </div>

              <button
                onClick={() => setApplyDirectJob(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-extrabold text-emerald-950">🎉 Application Submitted Directly!</h4>
                <p className="text-xs text-emerald-800">
                  Your candidate profile and details have been transmitted directly to <strong>{applyDirectJob.organization}</strong> ({applyDirectJob.contactEmail || "Recruiter Direct"}).
                </p>
                <button
                  onClick={() => setApplyDirectJob(null)}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700 transition"
                >
                  Close & Continue Job Search
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!applicantName.trim() || !applicantEmail.trim()) return;

                  submitCandidateApplication({
                    jobId: applyDirectJob.id,
                    jobTitle: applyDirectJob.title,
                    companyName: applyDirectJob.organization,
                    candidateName: applicantName.trim(),
                    candidateEmail: applicantEmail.trim(),
                    candidatePhone: applicantPhone.trim(),
                    coverNote: applicantNote.trim(),
                  });

                  setApplySuccess(true);
                  loadJobsWithCustomFreePosts();
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone / Mobile Number</label>
                  <input
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brief Cover Note / Pitch</label>
                  <textarea
                    rows={2}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="Tell the recruiter why you are a great fit for this position..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Attached Profile Degree: <strong>{memory.education.degree}</strong></span>
                  <span className="text-emerald-700 font-bold">{memory.skills.length} Skills Attached</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-extrabold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Submit Direct Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST FREE JOB MODAL FOR EMPLOYERS */}
      {showPostFreeJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/40">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Post Free Job as Employer</h3>
                  <span className="text-[11px] text-emerald-400 font-bold">0% Commission • Instant Candidate Reach</span>
                </div>
              </div>
              <button
                onClick={() => setShowPostFreeJobModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFreeJobPostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Job Title / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack React Developer"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Solutions"
                    value={postCompany}
                    onChange={(e) => setPostCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sector / Category</label>
                  <select
                    value={postSector}
                    onChange={(e) => setPostSector(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Private">Private Sector / Tech</option>
                    <option value="Government">Government Sector</option>
                    <option value="PSU">PSU & Defense</option>
                    <option value="Banking">Banking & Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore / Remote"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Salary Range / CTC</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12 - 20 LPA"
                    value={postSalary}
                    onChange={(e) => setPostSalary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Positions / Vacancies</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Positions"
                    value={postVacancies}
                    onChange={(e) => setPostVacancies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">HR Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. hr@company.com"
                    value={postContactEmail}
                    onChange={(e) => setPostContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                  value={postSkills}
                  onChange={(e) => setPostSkills(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostFreeJobModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl border border-amber-300 transition cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Publish Free Job Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon Component for Create Alert modal header
function BellPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <line x1="18" y1="8" x2="18" y2="14" />
      <line x1="15" y1="11" x2="21" y2="11" />
    </svg>
  );
}
