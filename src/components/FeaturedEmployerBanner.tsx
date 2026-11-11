import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  ShieldCheck,
  Star,
  ExternalLink,
  Plus,
  Play,
  Pause,
  ArrowRight,
  X,
  Zap,
  Clock,
  Heart,
  Share2,
  Award,
} from "lucide-react";
import { LiveIndiaJob } from "../types";
import { getStoredFreeJobs } from "../utils/jobStorage";

export interface FeaturedEmployer {
  id: string;
  name: string;
  logoInitials: string;
  logoBgGradient: string;
  industry: string;
  location: string;
  tagline: string;
  activeFreeJobsCount: number;
  featuredRoles: string[];
  salaryRange: string;
  rating: string;
  reviewCount: number;
  responseSpeed: string;
  perks: string[];
  verifiedStatus: string;
  companyOverview: string;
  techStackOrRequirements: string[];
  websiteUrl: string;
  isRecruiterFreePostPartner: boolean;
}

const DEFAULT_FEATURED_EMPLOYERS: FeaturedEmployer[] = [
  {
    id: "emp-1",
    name: "TCS Innovation Labs & Infocity",
    logoInitials: "TCS",
    logoBgGradient: "from-blue-600 to-indigo-700",
    industry: "Enterprise Tech & AI Systems",
    location: "Bhubaneswar / Bangalore / Pune",
    tagline: "Building next-generation cloud architectures and generative AI solutions for global enterprises.",
    activeFreeJobsCount: 12,
    featuredRoles: [
      "Senior Full Stack AI Engineer",
      "Cloud Architect (AWS/Azure)",
      "React & TypeScript Lead",
    ],
    salaryRange: "₹18 - ₹28 LPA",
    rating: "4.8",
    reviewCount: 1420,
    responseSpeed: "< 24 Hours",
    perks: ["Hybrid / Remote", "0% Agency Markup", "Direct HR Interview", "Health & Wellness"],
    verifiedStatus: "Verified Partner • Free Job Posts",
    companyOverview:
      "TCS Innovation Labs at Info Valley Bhubaneswar and Bangalore centers are expanding their core AI and Cloud engineering groups. Directly hiring candidates through Recruits.org.in with zero placement commission.",
    techStackOrRequirements: ["React.js", "TypeScript", "Node.js", "Python", "Docker & K8s"],
    websiteUrl: "https://www.tcs.com/careers",
    isRecruiterFreePostPartner: true,
  },
  {
    id: "emp-2",
    name: "Razorpay Software Pvt Ltd",
    logoInitials: "RZP",
    logoBgGradient: "from-cyan-500 to-blue-600",
    industry: "Fintech & Payment Infrastructure",
    location: "Bangalore / Remote India",
    tagline: "Powering online payments for 10M+ businesses across India with ultra-reliable banking APIs.",
    activeFreeJobsCount: 8,
    featuredRoles: [
      "Lead Distributed Systems Specialist",
      "Fintech Backend Developer",
      "Staff Frontend Engineer",
    ],
    salaryRange: "₹24 - ₹38 LPA + ESOPs",
    rating: "4.9",
    reviewCount: 890,
    responseSpeed: "< 12 Hours",
    perks: ["100% Remote Option", "Generous ESOP Grant", "Top-tier Health Insurance", "Learning Stipend"],
    verifiedStatus: "Direct Recruiter Verified • 0% Fee",
    companyOverview:
      "Razorpay's engineering team crafts frictionless checkout, payout, and credit infrastructure. All job postings on Recruits.org.in are verified direct recruiter listings with fast 48-hour application callbacks.",
    techStackOrRequirements: ["Go / Node.js", "TypeScript", "React", "Kafka", "PostgreSQL"],
    websiteUrl: "https://razorpay.com/careers",
    isRecruiterFreePostPartner: true,
  },
  {
    id: "emp-3",
    name: "Odisha Mining Corporation (OMC)",
    logoInitials: "OMC",
    logoBgGradient: "from-amber-500 to-orange-600",
    industry: "Public Sector Enterprise (Govt of Odisha)",
    location: "Bhubaneswar / Cuttack / State-wide",
    tagline: "Gold category state PSU driving mineral development and technological modernization in Odisha.",
    activeFreeJobsCount: 15,
    featuredRoles: [
      "Assistant Executive Engineer (AEE)",
      "Geology & Mining Specialist",
      "IT Systems Officer",
    ],
    salaryRange: "Pay Level 12 (₹56,100 - ₹1,77,500)",
    rating: "4.7",
    reviewCount: 510,
    responseSpeed: "Official Cadre Intake",
    perks: ["Govt Pension & DA", "Quarters & Medical", "Job Security", "State Cadre Prestige"],
    verifiedStatus: "Official Govt PSU Notification",
    companyOverview:
      "Odisha Mining Corporation is a prime state PSU recruiting core engineers, IT officers, and administrative cadre. Postings are verified directly from official state gazettes.",
    techStackOrRequirements: ["B.Tech / BE Engineering", "Mining Geology", "DBMS & Networks"],
    websiteUrl: "https://omcltd.in",
    isRecruiterFreePostPartner: true,
  },
  {
    id: "emp-4",
    name: "Arohi AI Tech Partners & Startups",
    logoInitials: "AAI",
    logoBgGradient: "from-emerald-500 to-teal-600",
    industry: "AI Services & Vernacular EdTech",
    location: "Bhubaneswar Info Valley / Remote",
    tagline: "Empowering 100,000+ candidates in Odisha & Eastern India with vernacular AI career intelligence.",
    activeFreeJobsCount: 6,
    featuredRoles: [
      "AI Prompt & Speech Engineer",
      "Odia / Vernacular NLP Specialist",
      "Full Stack React / Node Developer",
    ],
    salaryRange: "₹12 - ₹22 LPA",
    rating: "4.9",
    reviewCount: 320,
    responseSpeed: "< 6 Hours",
    perks: ["Flexible Working", "Early-stage Equity", "Direct Founder Mentorship", "AI Sandbox Access"],
    verifiedStatus: "Official Platform Employer",
    companyOverview:
      "Arohi AI Tech Group builds language models and career intelligence tools for job seekers across Odisha. Hiring passionate engineers directly on Recruits.org.in.",
    techStackOrRequirements: ["Gemini AI SDK", "React", "TypeScript", "Python / FastAPI", "WebSockets"],
    websiteUrl: "https://recruits.org.in",
    isRecruiterFreePostPartner: true,
  },
  {
    id: "emp-5",
    name: "Tech Mahindra & Digital Transformation",
    logoInitials: "TM",
    logoBgGradient: "from-purple-600 to-indigo-600",
    industry: "Global IT Services & Consulting",
    location: "Hyderabad / Bangalore / Bhubaneswar",
    tagline: "Connecting connected experiences through innovative 5G, AI, and enterprise IT services.",
    activeFreeJobsCount: 9,
    featuredRoles: [
      "React Native Mobile Lead",
      "Cybersecurity Analyst",
      "DevOps & SRE Engineer",
    ],
    salaryRange: "₹14 - ₹25 LPA",
    rating: "4.6",
    reviewCount: 2100,
    responseSpeed: "< 36 Hours",
    perks: ["Global Client Exposure", "Certification Sponsorship", "Flexible Hours"],
    verifiedStatus: "Verified Direct Employer",
    companyOverview:
      "Tech Mahindra provides digital transformation services worldwide. Partnered with Recruits.org.in to offer zero-cost candidate matching and direct HR interviews.",
    techStackOrRequirements: ["React Native", "Python", "AWS", "Kubernetes", "GraphQL"],
    websiteUrl: "https://techmahindra.com/careers",
    isRecruiterFreePostPartner: true,
  },
];

interface FeaturedEmployerBannerProps {
  onSelectEmployer?: (employerName: string) => void;
  onPostJobClick?: () => void;
  onViewAllFreeJobs?: () => void;
}

export const FeaturedEmployerBanner: React.FC<FeaturedEmployerBannerProps> = ({
  onSelectEmployer,
  onPostJobClick,
  onViewAllFreeJobs,
}) => {
  const [employers, setEmployers] = useState<FeaturedEmployer[]>(
    DEFAULT_FEATURED_EMPLOYERS
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedSpotlightEmployer, setSelectedSpotlightEmployer] =
    useState<FeaturedEmployer | null>(null);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with user custom posted free jobs from localStorage
  useEffect(() => {
    const customFreeJobs: LiveIndiaJob[] = getStoredFreeJobs();
    if (customFreeJobs.length > 0) {
      // Extract unique organizations from recruiter free postings
      const customEmployersMap = new Map<string, FeaturedEmployer>();

      customFreeJobs.forEach((job, idx) => {
        if (!customEmployersMap.has(job.organization)) {
          const initials = job.organization
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 3)
            .toUpperCase();

          customEmployersMap.set(job.organization, {
            id: `custom-emp-${idx}-${Date.now()}`,
            name: job.organization,
            logoInitials: initials || "EMP",
            logoBgGradient: "from-amber-500 via-emerald-600 to-indigo-700",
            industry: `${job.sector} Sector Employer`,
            location: job.location,
            tagline: `Recruiter active posting on Recruits.org.in with 0% commission: ${job.title}`,
            activeFreeJobsCount: 1,
            featuredRoles: [job.title],
            salaryRange: job.salaryOrPayScale,
            rating: "5.0",
            reviewCount: 42,
            responseSpeed: "< 12 Hours",
            perks: ["0% Commission Post", "Direct Recruiter Contact", "Verified Vacancy"],
            verifiedStatus: "Direct Recruiter Free Post",
            companyOverview: `Active direct recruiter recruitment by ${job.organization}. Requirements: ${job.eligibility}`,
            techStackOrRequirements: job.keySkillsOrSyllabus || ["Key Skills Required"],
            websiteUrl: job.applyUrl || job.officialNotificationUrl || "#",
            isRecruiterFreePostPartner: true,
          });
        } else {
          const existing = customEmployersMap.get(job.organization)!;
          existing.activeFreeJobsCount += 1;
          if (!existing.featuredRoles.includes(job.title)) {
            existing.featuredRoles.push(job.title);
          }
        }
      });

      const newCustomEmployerList = Array.from(customEmployersMap.values());
      setEmployers([...newCustomEmployerList, ...DEFAULT_FEATURED_EMPLOYERS]);
    }
  }, []);

  // Auto Rotation Timer
  useEffect(() => {
    if (isAutoPlaying && employers.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % employers.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, employers.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % employers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + employers.length) % employers.length);
  };

  const currentEmp = employers[currentIndex] || DEFAULT_FEATURED_EMPLOYERS[0];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden my-6">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER ROW */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide uppercase">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              Featured Direct Employers
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 0% Commission / Free Job Posts
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Top Hiring Companies & Tech Hubs
          </h3>
          <p className="text-xs text-slate-300">
            Organizations actively recruiting on Recruits.org.in with verified direct HR responses and zero middleman fees.
          </p>
        </div>

        {/* TOP RIGHT CONTROLS & RECRUITER CTA */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* POST A FREE JOB BUTTON */}
          <button
            onClick={onPostJobClick}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Post Free Job as Employer</span>
          </button>

          {/* PAUSE / PLAY AUTO CAROUSEL TOGGLE */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl transition cursor-pointer"
            title={isAutoPlaying ? "Pause Auto Carousel" : "Play Auto Carousel"}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* NEXT / PREV BUTTONS */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl transition cursor-pointer"
              aria-label="Previous Employer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl transition cursor-pointer"
              aria-label="Next Employer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CAROUSEL SLIDE CARD */}
      <div className="relative z-10 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEmp.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-5 shadow-xl relative"
          >
            {/* MAIN SLIDE BODY */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* LEFT: COMPANY IDENTITY & HIGHLIGHTS */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentEmp.logoBgGradient} flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shrink-0 border border-white/20`}
                  >
                    {currentEmp.logoInitials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                        {currentEmp.name}
                      </h4>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {currentEmp.verifiedStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-0.5 flex-wrap">
                      <span className="text-amber-300 font-bold">{currentEmp.industry}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {currentEmp.location}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {currentEmp.rating} ({currentEmp.reviewCount} Reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* TAGLINE */}
                <p className="text-xs sm:text-sm text-slate-200 italic bg-slate-900/80 p-3 rounded-xl border-l-2 border-amber-400 leading-relaxed font-normal">
                  "{currentEmp.tagline}"
                </p>

                {/* FEATURED ROLES BADGES */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wide block">
                    Actively Recruiting Positions ({currentEmp.activeFreeJobsCount} Open):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentEmp.featuredRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-950/90 text-indigo-200 border border-indigo-500/30 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Briefcase className="w-3 h-3 text-amber-300" /> {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: METRICS, PERKS & QUICK ACTIONS */}
              <div className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shrink-0">
                <div className="space-y-2 border-b border-slate-800 pb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Compensation Band:</span>
                    <strong className="text-amber-300 font-black text-sm">{currentEmp.salaryRange}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">HR Response Speed:</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {currentEmp.responseSpeed}
                    </span>
                  </div>
                </div>

                {/* PERKS LIST */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                    Hiring Perks:
                  </span>
                  <ul className="text-xs space-y-1 text-slate-300 font-medium">
                    {currentEmp.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <Zap className="w-3 h-3 text-amber-300 shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      if (onSelectEmployer) onSelectEmployer(currentEmp.name);
                      if (onViewAllFreeJobs) onViewAllFreeJobs();
                    }}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>View Jobs ({currentEmp.activeFreeJobsCount})</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <button
                    onClick={() => setSelectedSpotlightEmployer(currentEmp)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Company Spotlight</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CAROUSEL INDICATOR DOTS & QUICK THUMBNAILS */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                {employers.map((emp, idx) => (
                  <button
                    key={emp.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 border ${
                      idx === currentIndex
                        ? "bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {emp.logoInitials} • {emp.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 font-semibold shrink-0">
                <span className="text-amber-300 font-bold">{currentIndex + 1}</span> / {employers.length} Employers
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SPOTLIGHT MODAL */}
      <AnimatePresence>
        {selectedSpotlightEmployer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-white shadow-2xl relative"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedSpotlightEmployer.logoBgGradient} flex items-center justify-center text-slate-950 font-black text-base shadow`}
                  >
                    {selectedSpotlightEmployer.logoInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {selectedSpotlightEmployer.name}
                    </h3>
                    <span className="text-xs text-amber-300 font-bold">
                      {selectedSpotlightEmployer.industry}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSpotlightEmployer(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-300 uppercase tracking-wide mb-1">
                    Company Overview & Hiring Commitment
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {selectedSpotlightEmployer.companyOverview}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold block mb-1">Locations</span>
                    <span className="text-white font-semibold">{selectedSpotlightEmployer.location}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold block mb-1">Fee Model</span>
                    <span className="text-emerald-400 font-extrabold">0% Candidate & Recruiter Fee</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-300 uppercase tracking-wide mb-1">
                    Core Tech Stack & Requirements
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSpotlightEmployer.techStackOrRequirements.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-bold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedSpotlightEmployer(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectEmployer) onSelectEmployer(selectedSpotlightEmployer.name);
                      setSelectedSpotlightEmployer(null);
                      if (onViewAllFreeJobs) onViewAllFreeJobs();
                    }}
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border border-amber-300 transition cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <span>View Openings ({selectedSpotlightEmployer.activeFreeJobsCount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
