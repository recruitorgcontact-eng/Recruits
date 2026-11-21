import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowRight,
  PhoneCall,
  Bot,
  Briefcase,
  FileText,
  Video,
  Award,
  Zap,
  Building2,
  UserCheck,
  ShieldCheck,
  Compass,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Flame,
  Star,
  Globe,
  Radio,
  Volume2,
  Play,
  RotateCcw,
  Target,
  BarChart3,
  Search,
  MessageSquare,
  Send,
  Layers,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Clock,
  RefreshCw,
  Newspaper,
  Lightbulb,
  ExternalLink,
  Trophy,
  PartyPopper,
  Heart,
  ThumbsUp,
  Plus,
  X,
  Share2,
  Building,
  Code,
  Landmark,
  Pickaxe,
  BookOpen,
  Grid,
} from "lucide-react";
import { UserRoleMode, LanguageCode } from "../types";
import { speakText, stopSpeech, isOdiaText } from "../utils/speech";
import { CareerSuccessWall } from "./CareerSuccessWall";
import {
  OFFICIAL_10_TRAINING_PROGRAMS,
  PLACEMENT_SECTORS,
  OFFICIAL_POSTERS,
} from "./engines/LearningAdvisorEngine";
import { CompanyBrandLogo, FEATURED_MNC_BRANDS } from "./CompanyBrandLogo";
import { BRANDING_IMAGES } from "../utils/brandingImages";

gsap.registerPlugin(ScrollTrigger);

interface HeroLandingPageProps {
  onEnterWorkspace: (engineId?: string, mode?: UserRoleMode) => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export interface SuccessMilestone {
  id: string;
  userInitials: string;
  location: string;
  title: string;
  category: "Govt Jobs" | "Tech & Corporate" | "ATS Resume" | "Mock Interview";
  featureUsed: string;
  quote: string;
  metric: string;
  timeAgo: string;
  congratulations: number;
  userCongratulated?: boolean;
}

const INITIAL_COMMUNITY_MILESTONES: SuccessMilestone[] = [
  {
    id: "m-1",
    userInitials: "Priya S.",
    location: "Bhubaneswar, Odisha",
    title: "Cleared OPSC Civil Services 2026 Prelims",
    category: "Govt Jobs",
    featureUsed: "Odia GK & GS Quiz Engine",
    quote: "Practiced 60+ daily timed mock quizzes on Arohi AI. Scored 144/200 on General Studies Paper 1!",
    metric: "State Rank #18",
    timeAgo: "6 mins ago",
    congratulations: 42,
  },
  {
    id: "m-2",
    userInitials: "Anish M.",
    location: "Cuttack, Odisha",
    title: "Hired as Lead React Developer at TCS Infocity",
    category: "Tech & Corporate",
    featureUsed: "Arohi ATS Resume Rewriter",
    quote: "Rewrote my resume bullet points using Arohi ATS optimizer. Landed 3 interview calls within 48 hours!",
    metric: "₹16.5 LPA Package",
    timeAgo: "18 mins ago",
    congratulations: 89,
  },
  {
    id: "m-3",
    userInitials: "Subhashree K.",
    location: "Rourkela, Odisha",
    title: "Shortlisted for OMC Assistant Manager (Mining)",
    category: "Govt Jobs",
    featureUsed: "1-on-1 Voice AI Mock Call",
    quote: "The live Odia voice mock interview gave me total confidence for the board panel question round.",
    metric: "Interview Cleared",
    timeAgo: "34 mins ago",
    congratulations: 65,
  },
  {
    id: "m-4",
    userInitials: "Rakesh P.",
    location: "Berhampur, Odisha",
    title: "Selected for SBI Probationary Officer (PO)",
    category: "Govt Jobs",
    featureUsed: "30s Speed Aptitude Drills",
    quote: "Daily math and reasoning drills improved my calculation speed by 35%. Essential for SBI banking cutoff!",
    metric: "All-India Rank #210",
    timeAgo: "1 hour ago",
    congratulations: 112,
  },
  {
    id: "m-5",
    userInitials: "Deepak & Team",
    location: "Info Valley, Bhubaneswar",
    title: "Recruited 4 Full Stack Engineers in 3 Days",
    category: "Tech & Corporate",
    featureUsed: "Recruits.org.in Employer Portal",
    quote: "Posted verified vacancies with zero commission fees and shortlisted AI-matched candidates instantly.",
    metric: "4 Hired (Zero Cost)",
    timeAgo: "2 hours ago",
    congratulations: 53,
  },
  {
    id: "m-6",
    userInitials: "Pooja N.",
    location: "Sambalpur, Odisha",
    title: "Resume ATS Score Boosted from 42% to 94%",
    category: "ATS Resume",
    featureUsed: "ATS Match & Keyword Injector",
    quote: "Identified missing tech keywords and quantified impact bullets. Got selected by Infosys & Mindtree!",
    metric: "3 MNC Offers",
    timeAgo: "3 hours ago",
    congratulations: 77,
  },
];

const LIVE_TICKER_JOBS = [
  { id: "opsc-2026", title: "OPSC Odisha Civil Services 2026", dept: "Govt of Odisha", loc: "Bhubaneswar", type: "Govt", badge: "HOT 🔥" },
  { id: "omc-eng", title: "Odisha Mining Corp (OMC) Engineers", dept: "Public Sector", loc: "Cuttack / State-wide", type: "PSU", badge: "New" },
  { id: "hc-aso", title: "Odisha High Court ASO Recruitment", dept: "Judiciary", loc: "Cuttack", type: "Govt", badge: "URGENT" },
  { id: "ssc-cgl", title: "SSC CGL 2026 Pan-India", dept: "Staff Selection Commission", loc: "Pan-India", type: "Central Govt", badge: "Popular" },
  { id: "tcs-dev", title: "TCS / Infosys Full Stack Developer", dept: "Tech IT", loc: "Bhubaneswar / Remote", type: "Private", badge: "High Pay" },
];

export const HeroLandingPage: React.FC<HeroLandingPageProps> = ({
  onEnterWorkspace,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isPlayingVoiceDemo, setIsPlayingVoiceDemo] = useState(false);
  const [demoVoiceLang, setDemoVoiceLang] = useState<LanguageCode>("or");

  // GSAP ScrollTrigger Refs
  const landingRootRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLDivElement | null>(null);
  const heroGridRef = useRef<HTMLDivElement | null>(null);
  const heroStatsRef = useRef<HTMLDivElement | null>(null);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState<string | null>(null);

  // 10s AI Career Readiness Calculator State
  const [calcGoal, setCalcGoal] = useState<string>("opsc");
  const [calcDegree, setCalcDegree] = useState<string>("B.Tech / B.E.");
  const [calcExperience, setCalcExperience] = useState<string>("Fresher (0-1 yrs)");
  const [calcResult, setCalcResult] = useState<{
    score: number;
    title: string;
    strengths: string[];
    gaps: string[];
  } | null>(null);

  // Industry Pulse State
  const [pulseCategory, setPulseCategory] = useState<string>("All");
  const [isFetchingPulse, setIsFetchingPulse] = useState<boolean>(false);
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const [pulseData, setPulseData] = useState<{
    lastUpdated: string;
    trendingTopics: string[];
    articles: {
      id: string;
      title: string;
      summary: string;
      category: string;
      source: string;
      date: string;
      impact: string;
      tags: string[];
      actionableInsight: string;
    }[];
  }>({
    lastUpdated: "July 2026 Live Feeds",
    trendingTopics: [
      "OPSC OCS Civil Services 2026",
      "Bhubaneswar AI & Full Stack Tech Hub",
      "SSC CGL Pan-India Officer Exams",
      "Banking PO & Specialist Officer Drives",
    ],
    articles: [
      {
        id: "pulse-1",
        title: "OPSC Odisha Civil Services 2026 Notification & Syllabus Updates",
        summary:
          "Odisha Public Service Commission has streamlined application deadlines and updated key syllabus modules for Civil Services posts across Odisha state cadres.",
        category: "Govt & Public Sector",
        source: "OPSC Official Portal",
        date: "Today",
        impact: "High Impact",
        tags: ["OPSC", "Odisha Govt", "Civil Services"],
        actionableInsight:
          "Begin Odisha GK and General Studies paper practice early on Arohi AI's Quiz engine.",
      },
      {
        id: "pulse-2",
        title: "Bhubaneswar & Cuttack Tech Corridor Sees 35% Rise in Fullstack & AI Jobs",
        summary:
          "Leading IT service majors and product startups are scaling tech hubs in Infocity & Info Valley Bhubaneswar, increasing hiring for React, Node, and AI prompt engineering roles.",
        category: "Tech & Corporate",
        source: "Tech Career India",
        date: "Recent",
        impact: "Trending",
        tags: ["Bhubaneswar", "Tech Jobs", "AI Roles"],
        actionableInsight:
          "Add AI and modern fullstack frameworks to your resume using Arohi ATS Resume Rewriter.",
      },
      {
        id: "pulse-3",
        title: "SSC CGL 2026 & RRB Railway Officer Vacancies Announced",
        summary:
          "Staff Selection Commission and Railway Recruitment Boards release combined recruitment drives with over 20,000+ non-technical and technical officer posts.",
        category: "Banking & SSC",
        source: "PIB Govt Notifications",
        date: "Today",
        impact: "High Impact",
        tags: ["SSC CGL", "Railways", "Central Govt"],
        actionableInsight:
          "Verify your age and qualification eligibility on Recruits.org.in's Live Jobs engine.",
      },
      {
        id: "pulse-4",
        title: "Odia & Vernacular Speech Demands Surge for Public Sector Interviews",
        summary:
          "Interviews for state level officer roles now place heavy emphasis on vernacular communication clarity, structured STAR responses, and local governance awareness.",
        category: "Skill Trends",
        source: "Arohi Talent Insights",
        date: "Just In",
        impact: "High Impact",
        tags: ["Soft Skills", "Odia Speech", "Interview Prep"],
        actionableInsight:
          "Practice full 1-on-1 Odia voice mock calls with Arohi AI Career Mentor.",
      },
    ],
  });

  const fetchPulseData = async (cat: string) => {
    setIsFetchingPulse(true);
    setPulseCategory(cat);
    try {
      const res = await fetch("/api/ai/industry-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat, language: selectedLanguage }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.articles && data.articles.length > 0) {
          setPulseData(data);
        }
      }
    } catch (err) {
      console.warn("Pulse fetch error:", err);
    } finally {
      setIsFetchingPulse(false);
    }
  };

  const heroResumeInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingHeroResume, setIsUploadingHeroResume] = useState(false);

  const handleLaunchJobSearchWithFilter = (opts: {
    query?: string;
    sector?: string;
    category?: string;
    location?: string;
  }) => {
    try {
      sessionStorage.setItem("arohi_job_search_handoff", JSON.stringify(opts));
    } catch (e) {
      // ignore storage errors
    }
    onEnterWorkspace("liveindiajobs");
  };

  const handleHeroResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHeroResume(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const resultStr = String(reader.result || "");
        const base64Data = resultStr.includes(",") ? resultStr.split(",")[1] : resultStr;
        const res = await fetch("/api/ai/parse-resume-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type || "application/pdf",
            base64Data,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          sessionStorage.setItem(
            "arohi_uploaded_resume_payload",
            JSON.stringify({ data, fileName: file.name })
          );
        }
      } catch (err) {
        console.error("Hero resume upload error:", err);
      } finally {
        setIsUploadingHeroResume(false);
        if (heroResumeInputRef.current) heroResumeInputRef.current.value = "";
        onEnterWorkspace("resume");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchPulseData("All");
  }, []);

  // GSAP ScrollTrigger Top-to-Bottom Cinematic Transition into Interactive Career City
  useEffect(() => {
    if (!landingRootRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hero Content Parallax & Depth Transition as user scrolls toward the Career City
      if (heroSectionRef.current && heroTitleRef.current && heroGridRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        heroTl
          .to(
            heroTitleRef.current,
            {
              y: -36,
              scale: 0.96,
              opacity: 0.4,
              ease: "none",
            },
            0
          )
          .to(
            heroGridRef.current,
            {
              y: -20,
              ease: "none",
            },
            0
          );

        if (heroStatsRef.current) {
          heroTl.to(
            heroStatsRef.current,
            {
              y: -14,
              ease: "none",
            },
            0
          );
        }
      }

      // Progressive ScrollTrigger Reveal for Downstream Landing Page Sections
      const scrollSections = gsap.utils.toArray<HTMLElement>(".gsap-scroll-section");
      scrollSections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { y: 44, opacity: 0.15 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.4,
            },
          }
        );
      });
    }, landingRootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleReadArticleSummary = (article: any) => {
    if (activeReadingId === article.id) {
      stopSpeech();
      setActiveReadingId(null);
      return;
    }

    stopSpeech();
    setActiveReadingId(article.id);

    const speechText = `Industry Pulse update from ${article.source}: ${article.title}. ${article.summary}. Arohi recommendation: ${article.actionableInsight}`;

    speakText({
      text: speechText,
      language: selectedLanguage,
      onEnd: () => setActiveReadingId(null),
      onError: () => setActiveReadingId(null),
    });
  };

  // Community Success Ticker State
  const [milestones, setMilestones] = useState<SuccessMilestone[]>(INITIAL_COMMUNITY_MILESTONES);
  const [milestoneFilter, setMilestoneFilter] = useState<string>("All");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeReadingMilestoneId, setActiveReadingMilestoneId] = useState<string | null>(null);

  // Form state for user submitted milestone
  const [newMilestoneForm, setNewMilestoneForm] = useState({
    userInitials: "",
    location: "",
    title: "",
    category: "Govt Jobs" as "Govt Jobs" | "Tech & Corporate" | "ATS Resume" | "Mock Interview",
    featureUsed: "",
    quote: "",
    metric: "",
  });

  const handleCongratulate = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isCongratulated = m.userCongratulated;
          return {
            ...m,
            congratulations: isCongratulated ? m.congratulations - 1 : m.congratulations + 1,
            userCongratulated: !isCongratulated,
          };
        }
        return m;
      })
    );
  };

  const handleReadMilestone = (m: SuccessMilestone) => {
    if (activeReadingMilestoneId === m.id) {
      stopSpeech();
      setActiveReadingMilestoneId(null);
      return;
    }

    stopSpeech();
    setActiveReadingMilestoneId(m.id);

    const speechText = `Community Success Milestone by ${m.userInitials} from ${m.location}. Achievement: ${m.title}. Highlight: ${m.metric}. Quote: ${m.quote}.`;

    speakText({
      text: speechText,
      language: selectedLanguage,
      onEnd: () => setActiveReadingMilestoneId(null),
      onError: () => setActiveReadingMilestoneId(null),
    });
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneForm.title || !newMilestoneForm.userInitials) return;

    const newItem: SuccessMilestone = {
      id: `user-m-${Date.now()}`,
      userInitials: newMilestoneForm.userInitials || "Anonymous Candidate",
      location: newMilestoneForm.location || "Odisha, India",
      title: newMilestoneForm.title,
      category: newMilestoneForm.category,
      featureUsed: newMilestoneForm.featureUsed || "Arohi AI Career Assistant",
      quote: newMilestoneForm.quote || "Arohi Career AI helped me land my dream role!",
      metric: newMilestoneForm.metric || "Career Milestone Unlocked",
      timeAgo: "Just Now",
      congratulations: 1,
      userCongratulated: true,
    };

    setMilestones([newItem, ...milestones]);
    setIsShareModalOpen(false);
    setNewMilestoneForm({
      userInitials: "",
      location: "",
      title: "",
      category: "Govt Jobs",
      featureUsed: "",
      quote: "",
      metric: "",
    });
  };

  const handleTestArohiVoice = (langOverride?: LanguageCode) => {
    const lang = langOverride || demoVoiceLang;
    if (isPlayingVoiceDemo) {
      stopSpeech();
      setIsPlayingVoiceDemo(false);
      return;
    }

    setIsPlayingVoiceDemo(true);

    let sampleText = "Namaste! I am Arohi, your personal AI career coach on Recruits.org.in. How can I guide your job search today?";
    if (lang === "or") {
      sampleText = "ନମସ୍କାର! 🙏 ମୁଁ ଆରୋହୀ, Recruits.org.in ରେ ଆପଣଙ୍କ କ୍ୟାରିଅର୍ ସାଥୀ। OPSC, ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି ଏବଂ ପ୍ରାଇଭେଟ୍ ଆପ୍ଲିକେସନ୍ ପାଇଁ ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବାକୁ ପ୍ରସ୍ତୁତ!";
    } else if (lang === "hi") {
      sampleText = "नमस्ते! 🙏 मैं आपकी एआई करियर कोच आरोही हूँ। Recruits.org.in पर आपकी जॉब और करियर तैयारी में सहायता करने के लिए मैं तैयार हूँ!";
    }

    speakText({
      text: sampleText,
      language: lang,
      onEnd: () => setIsPlayingVoiceDemo(false),
      onError: () => setIsPlayingVoiceDemo(false),
    });
  };

  const runQuickReadinessCheck = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 82;
    let title = "High Civil & Technical Readiness";
    let strengths = ["Strong Academic Background", "Odia & English Fluency", "Eligible for State Level Exams"];
    let gaps = ["ATS Resume Keyword Tuning Needed", "Mock Voice Interview Practice Recommended"];

    if (calcGoal === "opsc") {
      score = 88;
      title = "High State Civil Service Potential";
      strengths = ["Eligible for OPSC / OSSC Officer Posts", "Clear Syllabus Alignment", "High Verbal Readiness"];
      gaps = ["General Knowledge Quiz Tuning", "Current Affairs Speed Practice"];
    } else if (calcGoal === "tech") {
      score = 85;
      title = "Strong Software & IT Profile";
      strengths = ["In-demand Degree Credentials", "High Aptitude Base", "Eligible for IT Recruiter Posts"];
      gaps = ["Add DSA / Full Stack Keywords on Resume", "Practice 30s Rapid Technical Quiz"];
    } else if (calcGoal === "banking") {
      score = 79;
      title = "Promising Banking Officer Candidate";
      strengths = ["Quantitative Aptitude Ready", "Multi-lingual Fluency", "Verified Eligibility"];
      gaps = ["Speed Calculation Tuning", "Mock Interview Voice Call"];
    }

    setCalcResult({ score, title, strengths, gaps });
  };

  return (
    <div ref={landingRootRef} className="space-y-12 pb-16">
      {/* HERO SECTION MATCHING MOCKUP WITH GSAP PARALLAX */}
      <section ref={heroSectionRef} className="space-y-8 will-change-transform">
        {/* HERO HEADER + HIGH-VISIBILITY REAL CAREER PHOTOGRAPHY SHOWCASE */}
        <div ref={heroTitleRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2 will-change-transform">
          {/* Left 7 Cols: Brand Headline & Value Proposition */}
          <div className="lg:col-span-7 glass-apple rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between space-y-5 text-left relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-sky-400/16 via-indigo-400/14 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3.5 relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/75 backdrop-blur-xl border border-white/90 text-indigo-700 text-[11px] font-bold px-3.5 py-1 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  Powered by{" "}
                  <a
                    href="https://arohiai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-700 underline font-extrabold hover:text-indigo-950"
                  >
                    arohiai.com
                  </a>{" "}
                  • Quench Research Labs Private Limited
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.035em] leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                  RECRUITS.ORG.IN
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-extrabold text-slate-950 tracking-[-0.025em] leading-snug">
                  India&apos;s Smartest AI Job Search, Skilling &amp; Campus Placement Hub
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                Connect directly with verified Government vacancies (UPSC, SSC, OPSC, Railways, Banking), Top MNC career drives (Tata, Infosys, Wipro, HDFC Bank, Reliance, Tech Mahindra), and 10 Industry-Ready Training Programs with 100% Placement Assistance.
              </p>
            </div>

            {/* Quick Proof Metrics Row */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-900/8 relative z-10">
              <div>
                <span className="text-lg sm:text-2xl font-extrabold text-blue-600 tabular-nums tracking-tight block">100,000+</span>
                <span className="text-[11px] text-slate-500 font-semibold">Verified Live Jobs</span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-extrabold text-emerald-600 tabular-nums tracking-tight block">100%</span>
                <span className="text-[11px] text-slate-500 font-semibold">Placement Assistance</span>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-extrabold text-indigo-600 tabular-nums tracking-tight block">10 Programs</span>
                <span className="text-[11px] text-slate-500 font-semibold">50 Modules Ready Now</span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Real-World Indian Graduates & Placement Photography Banner */}
          <div
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="lg:col-span-5 relative rounded-[2rem] overflow-hidden border border-white/75 shadow-[0_22px_50px_-16px_rgba(15,23,42,0.28)] group cursor-pointer min-h-[260px] sm:min-h-[300px] bg-slate-950"
          >
            <img
              src={BRANDING_IMAGES.heroCareerGraduates}
              alt="Confident Indian graduates and professionals holding placement offer letters at modern tech park campus"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/35 to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <span className="bg-slate-950/60 backdrop-blur-xl text-amber-300 border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Learn • Work • Grow
              </span>
              <span className="bg-emerald-400/90 backdrop-blur-md text-slate-950 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">
                2026–27 Drives Open
              </span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
              <div className="text-xs font-semibold text-sky-300">
                Real Career Outcomes Across India &amp; Odisha
              </div>
              <h3 className="text-base sm:text-lg font-extrabold leading-snug tracking-tight">
                From Campus Skilling to Top MNC &amp; Government Offer Letters
              </h3>
              <div className="flex items-center justify-between text-[11px] text-slate-200 pt-1">
                <span>Explore Verified Placement Drives &amp; Courses</span>
                <span className="font-extrabold text-amber-300 flex items-center gap-1">
                  Enter Hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* HERO MAIN CONTENT GRID */}
        <div ref={heroGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start will-change-transform">
          {/* LEFT 8 COLS: SEARCH BAR + TRENDING TAGS + CATEGORY CARDS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SEARCH CARD CONTAINER */}
            <div className="glass-apple rounded-3xl p-4 sm:p-5 space-y-4">
              {/* INPUT ROW */}
              <div className="relative flex flex-col md:flex-row items-center gap-2 bg-white/75 backdrop-blur-xl rounded-2xl p-2 border border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200/60 transition">
                <Search className="w-5 h-5 text-indigo-600 ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLaunchJobSearchWithFilter({
                        query: searchQuery,
                        location: searchLocation || undefined,
                      });
                    }
                  }}
                  placeholder="Search Jobs, Companies, Skills or Government Vacancies..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none px-2 py-1.5"
                />

                {/* SEARCH ACTION PILLS INSIDE INPUT BOX */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => onEnterWorkspace("navigator")}
                    className="flex items-center gap-1 bg-white/85 hover:bg-indigo-50 border border-slate-200/80 text-slate-700 hover:text-indigo-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Search</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsListening(!isListening);
                      if (!isListening) {
                        speakText({
                          text: "Searching jobs with Voice. Speak your query now.",
                          language: selectedLanguage,
                        });
                      }
                    }}
                    className={`flex items-center gap-1 border px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                      isListening
                        ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                        : "bg-white/85 hover:bg-white border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Voice</span>
                  </button>

                  <input
                    ref={heroResumeInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
                    onChange={handleHeroResumeFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => heroResumeInputRef.current?.click()}
                    disabled={isUploadingHeroResume}
                    className="flex items-center gap-1 bg-white/85 hover:bg-violet-50 border border-slate-200/80 hover:border-violet-300 text-slate-700 hover:text-violet-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-60"
                  >
                    <FileText className="w-3.5 h-3.5 text-violet-600" />
                    <span>{isUploadingHeroResume ? "Parsing Resume..." : "Upload Resume"}</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextLoc =
                        searchLocation === "Odisha"
                          ? "All India"
                          : "Odisha";
                      setSearchLocation(nextLoc);
                    }}
                    className="flex items-center gap-1 bg-white/85 hover:bg-white border border-slate-200/80 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{searchLocation || "Location"}</span>
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS BELOW SEARCH BAR */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={() =>
                    handleLaunchJobSearchWithFilter({
                      query: searchQuery,
                      location: searchLocation || undefined,
                    })
                  }
                  className="btn-apple-primary text-white font-bold text-sm px-8 py-2.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Jobs</span>
                </button>

                <button
                  onClick={() => onEnterWorkspace("navigator")}
                  className="bg-white/80 hover:bg-white backdrop-blur-xl text-slate-900 border border-white/95 font-bold text-sm px-7 py-2.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_20px_-8px_rgba(15,23,42,0.12)] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Ask Recruit AI</span>
                </button>

                <button
                  onClick={() => {
                    sessionStorage.setItem("arohi_learning_tab_handoff", "classroom");
                    onEnterWorkspace("learning");
                  }}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/85 hover:bg-emerald-100/90 backdrop-blur-md border border-emerald-300/60 px-4 py-2.5 rounded-full transition cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Start 10 Courses Free Preview →</span>
                </button>
              </div>
            </div>

            {/* 🔥 TRENDING JOBS TAG STRIP */}
            <div className="glass-apple rounded-3xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Trending Jobs
                </span>
                <button
                  onClick={() => onEnterWorkspace("liveindiajobs")}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  View All &gt;
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  "Government Teacher",
                  "Railway Jobs",
                  "Bank PO",
                  "Odisha Mining",
                  "Work From Home",
                  "Data Analyst",
                  "Software Engineer",
                  "Nursing",
                  "Police",
                  "Defence",
                  "AI Engineer"
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleLaunchJobSearchWithFilter({ query: tag });
                    }}
                    className="flex items-center gap-1.5 bg-white/70 hover:bg-white border border-white/90 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition shadow-2xs cursor-pointer"
                  >
                    <TrendingUp className="w-3 h-3 text-indigo-400" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 14 CATEGORY GRID CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                { title: "Government Jobs", sector: "Government", query: "", icon: Building, color: "text-blue-600 bg-blue-50/90 border-blue-200/70" },
                { title: "Private Jobs", sector: "Private", query: "", icon: Briefcase, color: "text-emerald-600 bg-emerald-50/90 border-emerald-200/70" },
                { title: "Remote Jobs", sector: "All", query: "Remote", icon: Globe, color: "text-purple-600 bg-purple-50/90 border-purple-200/70" },
                { title: "Internships", sector: "All", query: "Intern", icon: GraduationCap, color: "text-amber-600 bg-amber-50/90 border-amber-200/70" },
                { title: "Walk-ins", sector: "Private", query: "Direct", icon: UserCheck, color: "text-pink-600 bg-pink-50/90 border-pink-200/70" },
                { title: "Part-time", sector: "All", query: "Flexible", icon: Clock, color: "text-teal-600 bg-teal-50/90 border-teal-200/70" },
                { title: "Freelance", sector: "Private", query: "Project", icon: Zap, color: "text-violet-600 bg-violet-50/90 border-violet-200/70" },
                { title: "IT Jobs", sector: "Private", query: "Software", icon: Code, color: "text-cyan-600 bg-cyan-50/90 border-cyan-200/70" },
                { title: "Healthcare", sector: "All", query: "Health", icon: Heart, color: "text-rose-600 bg-rose-50/90 border-rose-200/70" },
                { title: "Engineering", sector: "All", query: "Engineer", icon: Layers, color: "text-orange-600 bg-orange-50/90 border-orange-200/70" },
                { title: "Banking", sector: "Banking", query: "Bank", icon: Landmark, color: "text-indigo-600 bg-indigo-50/90 border-indigo-200/70" },
                { title: "Mining", sector: "All", query: "Mining", icon: Pickaxe, color: "text-amber-700 bg-amber-50/90 border-amber-200/70" },
                { title: "Education", sector: "Government", query: "Teacher", icon: BookOpen, color: "text-emerald-600 bg-emerald-50/90 border-emerald-200/70" },
                { title: "View All Categories", sector: "All", query: "", icon: Grid, color: "text-slate-600 bg-slate-100/90 border-slate-200/70" },
              ].map((cat) => {
                const IconComponent = cat.icon || Building;
                return (
                  <button
                    key={cat.title}
                    onClick={() =>
                      handleLaunchJobSearchWithFilter({
                        sector: cat.sector,
                        query: cat.query,
                      })
                    }
                    className="glass-apple-card p-3.5 rounded-2xl hover:-translate-y-0.5 text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className={`p-2.5 rounded-xl border ${cat.color} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {cat.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT 4 COLS: MEET RECRUIT AI FLOATING GLASS CARD */}
          <div className="lg:col-span-4 glass-apple rounded-3xl p-5 space-y-4 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-blue-400/18 via-indigo-400/14 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 border-b border-slate-900/8 pb-3.5 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_22px_-6px_rgba(79,70,229,0.5)]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950 tracking-tight">
                  Meet Recruit AI
                </h3>
                <p className="text-xs font-semibold text-indigo-600">
                  Your Personal Career Adviser
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS LIST */}
            <div className="space-y-2 relative z-10">
              {[
                { title: "Create Resume", icon: FileText, engine: "resume" },
                { title: "Career Guidance", icon: Compass, engine: "navigator" },
                { title: "Interview Practice", icon: PhoneCall, engine: "interview" },
                { title: "Salary Prediction", icon: BarChart3, engine: "salary" },
                { title: "Resume Score", icon: Award, engine: "resume" },
                { title: "AI Match %", icon: Zap, engine: "jobmatch" },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => onEnterWorkspace(item.engine)}
                    className="w-full flex items-center justify-between p-2.5 bg-white/65 hover:bg-white rounded-2xl border border-white/90 hover:border-indigo-300/70 text-xs font-bold text-slate-800 transition cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-indigo-500/10 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <ItemIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>

            {/* CHAT CTA BUTTON */}
            <button
              onClick={() => onEnterWorkspace("navigator")}
              className="w-full py-3 btn-apple-primary text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer relative z-10"
            >
              <span>Chat with Recruit AI →</span>
            </button>

            <div className="pt-2 border-t border-slate-900/8 text-center relative z-10">
              <a
                href="https://arohiai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-indigo-700 hover:text-indigo-950 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Powered by arohiai.com • Quench Research Labs</span>
              </a>
            </div>
          </div>
        </div>

        {/* KEY STATS BANNER ROW */}
        <div ref={heroStatsRef} className="glass-apple rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center will-change-transform">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 tabular-nums tracking-tight block">5 Million+</span>
            <strong className="text-xs font-bold text-slate-900 block">Jobs</strong>
            <p className="text-[11px] text-slate-500">Updated every minute</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums tracking-tight block">200,000+</span>
            <strong className="text-xs font-bold text-slate-900 block">Employers</strong>
            <p className="text-[11px] text-slate-500">Trusted by top companies</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-600 tabular-nums tracking-tight block">1 Million+</span>
            <strong className="text-xs font-bold text-slate-900 block">Candidates</strong>
            <p className="text-[11px] text-slate-500">Building successful careers</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 tabular-nums tracking-tight block">98%</span>
            <strong className="text-xs font-bold text-slate-900 block">AI Matching Accuracy</strong>
            <p className="text-[11px] text-slate-500">Smart. Accurate. Reliable.</p>
          </div>
        </div>

        {/* 4 CONNECTED REAL-WORLD CAREER TRACK VISUAL CARDS */}
        <div className="glass-apple rounded-3xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950">
                Explore Career Pathways by Real Industry &amp; Sector
              </h3>
              <p className="text-xs text-slate-500">
                Connected pathways linking live recruitment drives, AI interview prep, and hands-on training
              </p>
            </div>
            <button
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer self-start sm:self-auto"
            >
              Explore All Career Tracks &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Civil Services & Govt. Administration",
                subtitle: "UPSC • SSC • OPSC • State Secretariat",
                stats: "18,400+ Active Posts",
                img: BRANDING_IMAGES.trackGovtCivilServices,
                actionLabel: "View Govt. Vacancies",
                onClick: () => handleLaunchJobSearchWithFilter({ sector: "Government", query: "UPSC" }),
              },
              {
                title: "IT, AI & Data Science MNCs",
                subtitle: "TCS • Infosys • Wipro • Tech Mahindra",
                stats: "42,000+ Tech Roles",
                img: BRANDING_IMAGES.trackItCloudAiLab,
                actionLabel: "Browse Tech & AI Jobs",
                onClick: () => handleLaunchJobSearchWithFilter({ sector: "Private", query: "Software" }),
              },
              {
                title: "Banking, BFSI & Financial Analytics",
                subtitle: "SBI • HDFC Bank • ICICI • IBPS PO",
                stats: "14,200+ Banking Jobs",
                img: BRANDING_IMAGES.trackBankingFinanceHub,
                actionLabel: "Explore Banking Drives",
                onClick: () => handleLaunchJobSearchWithFilter({ sector: "Banking", query: "Bank" }),
              },
              {
                title: "Indian Railways, NALCO, OMC & Core PSUs",
                subtitle: "RRB NTPC • Navratna PSUs • L&T Core",
                stats: "19,800+ Core Posts",
                img: BRANDING_IMAGES.coreEngineeringPsuRailway,
                actionLabel: "Explore Railway & PSU Jobs",
                onClick: () => handleLaunchJobSearchWithFilter({ sector: "Government", query: "Railway" }),
              },
              {
                title: "Cloud Architecture, Cybersecurity & DevOps",
                subtitle: "AWS • Azure • Ethical Hacking • SOC Labs",
                stats: "11,600+ Cloud Roles",
                img: BRANDING_IMAGES.cybersecurityCloudCommand,
                actionLabel: "View Cloud & Cyber Roles",
                onClick: () => handleLaunchJobSearchWithFilter({ sector: "Private", query: "Cloud" }),
              },
              {
                title: "80% Digital + 20% Physical Skilling",
                subtitle: "10 Programs • 50 Instant Modules",
                stats: "100% Placement Support",
                img: BRANDING_IMAGES.hybridClassroomMentorship,
                actionLabel: "Start Learning Immediately",
                onClick: () => {
                  sessionStorage.setItem("arohi_learning_tab_handoff", "classroom");
                  onEnterWorkspace("learning");
                },
              },
            ].map((track) => (
              <div
                key={track.title}
                onClick={track.onClick}
                className="group rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={track.img}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                    {track.stats}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[10px] font-bold text-cyan-300">{track.subtitle}</div>
                    <h4 className="text-sm font-black text-white leading-snug mt-0.5">
                      {track.title}
                    </h4>
                  </div>
                </div>
                <div className="p-3 bg-slate-950 text-xs font-bold text-amber-300 flex items-center justify-between border-t border-slate-800">
                  <span>{track.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED COMPANIES & TOP CARRIERS / BRANDS SHOWCASE */}
        <div className="glass-apple rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950">
                  Featured Top Brands, Carriers &amp; Hiring Companies
                </h3>
                <span className="bg-emerald-500/12 text-emerald-800 border border-emerald-300/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Logos • Active Drives
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any brand logo (Tata, Infosys, Wipro, HDFC Bank, Reliance, Tech Mahindra &amp; more) to filter live verified job openings immediately.
              </p>
            </div>
            <button
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer self-start sm:self-auto"
            >
              View All 18+ Hiring Brands &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 items-stretch">
            {FEATURED_MNC_BRANDS.map((company) => (
              <div
                key={company.name}
                onClick={() =>
                  handleLaunchJobSearchWithFilter({
                    sector: company.sector,
                    query: company.searchQuery,
                  })
                }
                className="glass-apple-card p-3 rounded-2xl flex flex-col items-center justify-between gap-2 cursor-pointer hover:-translate-y-0.5 group"
              >
                <div className="h-11 flex items-center justify-center w-full">
                  <CompanyBrandLogo name={company.name} size="banner" />
                </div>
                <div className="w-full pt-1.5 border-t border-slate-900/8 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-500 truncate max-w-[95px]">
                    {company.tagline}
                  </span>
                  <span className="font-extrabold text-indigo-700 bg-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white px-1.5 py-0.5 rounded-md transition shrink-0">
                    {company.openings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRENDING GOVERNMENT JOBS & PUBLIC AGENCIES SECTION */}
        <div className="glass-apple rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950">
                Trending Government Agencies &amp; PSU Recruitments
              </h3>
              <p className="text-xs text-slate-500">
                Official Central &amp; Odisha State recruitment boards with verified emblems and live notifications
              </p>
            </div>
            <button
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Browse All Government Vacancies &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { agency: "UPSC", query: "UPSC", title: "Civil Services & Defense", vacancies: "124 Vacancies", badge: "New", badgeColor: "bg-blue-100 text-blue-700" },
              { agency: "SSC", query: "SSC", title: "CGL, CHSL & Selection", vacancies: "256 Vacancies", badge: "New", badgeColor: "bg-blue-100 text-blue-700" },
              { agency: "Railway", query: "Railway", title: "RRB NTPC & Technical", vacancies: "12,450 Vacancies", badge: "Hot", badgeColor: "bg-orange-100 text-orange-700" },
              { agency: "Banking", query: "SBI", title: "SBI, IBPS PO & Clerk", vacancies: "8,932 Vacancies", badge: "Hot", badgeColor: "bg-orange-100 text-orange-700" },
              { agency: "Odisha Govt.", query: "OPSC", title: "OPSC, OSSC & OSSSC", vacancies: "5,320 Vacancies", badge: "New", badgeColor: "bg-blue-100 text-blue-700" },
              { agency: "NALCO & OMC", query: "NALCO", title: "Navratna & State PSU", vacancies: "2,450 Vacancies", badge: "PSU", badgeColor: "bg-amber-100 text-amber-800" },
              { agency: "Defence / DRDO", query: "DRDO", title: "Defense Research & Armed Forces", vacancies: "3,210 Vacancies", badge: "Popular", badgeColor: "bg-purple-100 text-purple-700" },
              { agency: "Teaching", query: "Teacher", title: "KVS, NVS & High School", vacancies: "6,543 Vacancies", badge: "Hot", badgeColor: "bg-orange-100 text-orange-700" },
            ].map((govt) => (
              <div
                key={govt.agency}
                onClick={() =>
                  handleLaunchJobSearchWithFilter({
                    sector: govt.agency === "Banking" ? "Banking" : govt.agency.includes("NALCO") ? "PSU" : "Government",
                    query: govt.query,
                  })
                }
                className="bg-slate-50 hover:bg-blue-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2.5 transition cursor-pointer hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CompanyBrandLogo name={govt.agency} size="sm" />
                    <span className="font-black text-sm text-slate-900">{govt.agency}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${govt.badgeColor}`}>
                    {govt.badge}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">{govt.title}</p>
                  <span className="text-xs font-bold text-slate-900 block mt-1">{govt.vacancies}</span>
                </div>
                <div className="pt-2 text-xs font-bold text-blue-600 flex items-center justify-between border-t border-slate-200/60">
                  <span>Apply Now</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGH-IMPACT REAL-WORLD CAMPUS PLACEMENT MEGADRIVE, AI INTERVIEW STUDIO & UNIVERSITY PARTNERSHIP GALLERY */}
      <section className="gsap-scroll-section glass-apple rounded-[2rem] p-6 sm:p-8 space-y-6 will-change-transform">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900/8 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
              Recruits.org.in National Talent &amp; Placement Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-[-0.025em]">
              Where Campus Skilling Meets Real Corporate &amp; Government Careers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              From grand campus placement megadrives and university MoU partnerships to 1-on-1 AI interview studios—explore how students, job seekers, and institutions succeed on Recruits.org.in.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="px-5 py-2.5 btn-apple-primary text-white font-bold text-xs rounded-full cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Live Placement Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left 7 Cols: Grand Campus Placement Megadrive & Career Expo */}
          <div
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="lg:col-span-7 group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 min-h-[320px] sm:min-h-[380px] cursor-pointer shadow-md hover:shadow-xl transition"
          >
            <img
              src={BRANDING_IMAGES.campusPlacementMegadrive}
              alt="Grand Campus Placement Megadrive and Career Expo with top MNC recruiters"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                National Placement Drives
              </span>
              <span className="bg-slate-950/80 backdrop-blur-sm text-white border border-white/20 text-[10px] font-bold px-3 py-1 rounded-md">
                Tata • Infosys • Wipro • HDFC • Reliance
              </span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
              <h3 className="text-lg sm:text-2xl font-black leading-snug">
                Grand Campus Placement Megadrives &amp; Direct MNC Recruitment Expos
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                Connect directly with verified hiring managers from top IT, Banking, Core Engineering, and Public Sector enterprises with zero middleman fees.
              </p>
              <div className="pt-1 flex items-center gap-4 text-xs font-extrabold text-amber-300">
                <span className="flex items-center gap-1">
                  Browse Active Megadrives <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: 2 Stacked Visual Spotlights (AI Interview Studio + University MoU Partnership) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div
              onClick={() => onEnterWorkspace("interview")}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 h-44 sm:h-[180px] cursor-pointer shadow-md hover:shadow-xl transition"
            >
              <img
                src={BRANDING_IMAGES.aiInterviewCoachingStudio}
                alt="1-on-1 AI Voice Mock Interview and Coaching Studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider block">
                  Multilingual Voice Interview Studio
                </span>
                <h4 className="text-sm sm:text-base font-black leading-snug">
                  Practice 1-on-1 HR &amp; Technical Board Interviews in English, Hindi &amp; Odia
                </h4>
                <span className="text-[11px] font-bold text-amber-300 inline-flex items-center gap-1">
                  Enter Interview Studio <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div
              onClick={() => {
                sessionStorage.setItem("arohi_learning_tab_handoff", "institutions");
                onEnterWorkspace("learning");
              }}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 h-44 sm:h-[180px] cursor-pointer shadow-md hover:shadow-xl transition"
            >
              <img
                src={BRANDING_IMAGES.universityMouPartnership}
                alt="University and College Campus Talent Hub MoU Partnership"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  For Colleges &amp; Universities • 2026–27 Academic Year
                </span>
                <h4 className="text-sm sm:text-base font-black leading-snug">
                  Partner with Recruits.org.in to Make Your Institution a Talent Powerhouse
                </h4>
                <span className="text-[11px] font-bold text-cyan-300 inline-flex items-center gap-1">
                  Book Campus Partnership Slot <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE HOT JOB TICKER SPOTLIGHT */}
      <section className="gsap-scroll-section glass-apple rounded-3xl p-4 sm:p-5 space-y-3 will-change-transform">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/12 text-rose-700 border border-rose-300/60 rounded-full font-extrabold text-[11px]">
              <Flame className="w-3.5 h-3.5 text-rose-600" /> LIVE JOB SPOTLIGHT
            </span>
            <span className="text-slate-500 font-medium hidden sm:inline">Crawling verified government &amp; employer feeds:</span>
          </div>

          <button
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            View All 100,000+ Jobs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {LIVE_TICKER_JOBS.map((job) => (
            <div
              key={job.id}
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="glass-apple-card p-3.5 rounded-2xl cursor-pointer group space-y-1.5 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-[10px] gap-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <CompanyBrandLogo name={job.dept} size="sm" className="w-6 h-6 rounded-md" />
                  <span className="font-bold text-slate-600 uppercase truncate">{job.dept}</span>
                </div>
                <span className="bg-amber-400/20 text-amber-900 font-bold px-1.5 py-0.5 rounded-md text-[9px] border border-amber-300/60 shrink-0">
                  {job.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 line-clamp-1">
                {job.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.loc}</span>
                <span className="text-indigo-600 font-bold">Match &amp; Apply →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10-SECOND AI CAREER READINESS CALCULATOR WIDGET */}
      <section className="gsap-scroll-section apple-mesh-dark rounded-[2rem] p-6 sm:p-8 text-white border border-white/15 shadow-[0_28px_60px_-20px_rgba(6,9,23,0.7)] space-y-6 will-change-transform relative overflow-hidden">
        <div className="max-w-3xl space-y-2 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/12 px-3 py-1 rounded-full border border-amber-300/30">
            Interactive AI Diagnostic Tool
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.025em] text-white">
            Instant 10-Second Career Readiness &amp; Eligibility Check
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/80">
            Select your target career stream to get instant AI fit forecasting before applying.
          </p>
        </div>

        <form onSubmit={runQuickReadinessCheck} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end glass-vision p-4 sm:p-5 rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase mb-1">Target Career Goal</label>
            <select
              value={calcGoal}
              onChange={(e) => setCalcGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
            >
              <option value="opsc">Odisha Govt / OPSC Civil Officer</option>
              <option value="tech">Software & IT Engineering (Corporate)</option>
              <option value="banking">Banking & Central Govt (SSC/RRB)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase mb-1">Qualification / Degree</label>
            <select
              value={calcDegree}
              onChange={(e) => setCalcDegree(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
            >
              <option value="B.Tech / B.E.">B.Tech / B.E. / Technical</option>
              <option value="Graduate (BA/BSc/BCom)">Graduate (BA / BSc / BCom)</option>
              <option value="Post Graduate (MA/MTech/MBA)">Post Graduate (MA / MBA / MTech)</option>
              <option value="+2 / Diploma">+2 / Higher Secondary / Diploma</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-200 uppercase mb-1">Experience Level</label>
            <select
              value={calcExperience}
              onChange={(e) => setCalcExperience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
            >
              <option value="Fresher (0-1 yrs)">Fresher (0 - 1 Years)</option>
              <option value="Experienced (2-5 yrs)">Experienced (2 - 5 Years)</option>
              <option value="Senior (5+ yrs)">Senior Professional (5+ Years)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" /> Calculate Readiness
            </button>
          </div>
        </form>

        {/* CALCULATOR DIAGNOSTIC DISPLAY */}
        {calcResult && (
          <div className="bg-slate-900/95 border border-amber-400/40 rounded-2xl p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Arohi Diagnostic Score</span>
                <h3 className="text-lg font-black text-white">{calcResult.title}</h3>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-2xl font-black text-amber-300">{calcResult.score}</span>
                <span className="text-xs text-slate-400 font-bold">/ 100 Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl space-y-2">
                <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths Identified
                </span>
                <ul className="space-y-1 text-slate-300 pl-5 list-disc">
                  {calcResult.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl space-y-2">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" /> Key Recommendations to Reach 100%
                </span>
                <ul className="space-y-1 text-slate-300 pl-5 list-disc">
                  {calcResult.gaps.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => onEnterWorkspace("resume")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
              >
                Fix ATS Resume Now
              </button>

              <button
                onClick={() => onEnterWorkspace("liveindiajobs")}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                Browse Matching Jobs →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* INTELLIGENT BENTO GRID */}
      <section className="gsap-scroll-section space-y-6 will-change-transform">
        <div className="text-center sm:text-left space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 bg-white/75 backdrop-blur-xl px-3.5 py-1 rounded-full border border-white/90 shadow-2xs inline-block">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.025em] text-slate-950">
            Integrated Career &amp; Hiring Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CARD 1: LIVE INDIA JOBS ENGINE */}
          <div
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="group glass-apple-card rounded-3xl p-6 hover:-translate-y-1 cursor-pointer space-y-4 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-8px_rgba(79,70,229,0.5)] group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Real-time Crawler
                </span>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight mt-0.5">Live Govt &amp; Private Jobs</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Verified notification feeds for OPSC, SSC, Banking, Railways, and direct recruiter job postings with zero commission direct application.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900/8 flex items-center justify-between text-xs font-extrabold text-indigo-600 group-hover:text-indigo-800">
              <span>Explore Live Jobs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 2: AROHI VOICE & MOCK INTERVIEW */}
          <div
            onClick={() => onEnterWorkspace("interview")}
            className="group glass-apple-card rounded-3xl p-6 hover:-translate-y-1 cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-8px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Voice Call &amp; Odia Speech
                </span>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight mt-0.5">Arohi AI Voice Mentor</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  1-on-1 voice calls in Odia, Hindi, or English. STAR interview coaching, voice interruption detection, and acoustic confidence analysis.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900/8 flex items-center justify-between text-xs font-extrabold text-amber-600 group-hover:text-amber-800">
              <span>Start Voice Practice</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 3: ATS RESUME INTELLIGENCE */}
          <div
            onClick={() => onEnterWorkspace("resume")}
            className="group glass-apple-card rounded-3xl p-6 hover:-translate-y-1 cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-8px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  ATS Score Optimizer
                </span>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight mt-0.5">Resume Rewriter &amp; PDF Generator</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Upload your resume to get instant ATS match diagnostics, missing keyword additions, formatting fixes, and professional PDF export.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900/8 flex items-center justify-between text-xs font-extrabold text-emerald-600 group-hover:text-emerald-800">
              <span>Fix Resume ATS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 4: 30s TECHNICAL & GK QUIZ */}
          <div
            onClick={() => onEnterWorkspace("skillmastery")}
            className="group glass-apple-card rounded-3xl p-6 hover:-translate-y-1 cursor-pointer space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-8px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Micro-Skill Mastery
                </span>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight mt-0.5">30s Rapid Technical Quiz</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Test your skills in JavaScript, React, Odisha GK, General Aptitude, and Verbal Reasoning with instant AI explanations.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900/8 flex items-center justify-between text-xs font-extrabold text-violet-600 group-hover:text-violet-800">
              <span>Take Quick Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 5: EMPLOYER & RECRUITER PORTAL */}
          <div
            onClick={() => onEnterWorkspace("recruiter", "recruiter")}
            className="group glass-apple-card rounded-3xl p-6 hover:-translate-y-1 cursor-pointer space-y-4 flex flex-col justify-between md:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 max-w-lg">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-emerald-800 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-8px_rgba(15,23,42,0.5)] group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6 text-emerald-300" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Free Employer Service
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-950 tracking-tight mt-0.5">100% Free Job Postings for Employers</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Recruiters &amp; organizations can post job vacancies for free, track direct candidate applications, and use Arohi AI to rank candidate resumes automatically.
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">₹0 Fee</span>
                <span className="block text-[10px] text-slate-500 font-bold">Zero Commission</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900/8 flex items-center justify-between text-xs font-extrabold text-slate-900 group-hover:text-emerald-700">
              <span>Post Job as Employer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL INDUSTRY-READY TRAINING PROGRAMS & INSTITUTIONAL CAMPUS PARTNER ECOSYSTEM (2026–27) */}
      <section className="gsap-scroll-section apple-mesh-dark border border-white/15 rounded-[2rem] p-6 sm:p-8 md:p-10 text-white space-y-8 shadow-[0_32px_70px_-20px_rgba(5,8,22,0.75)] relative overflow-hidden will-change-transform">
        {/* Header & Hybrid Delivery Pillars */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/12 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-[11px] font-bold tracking-wider uppercase">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                Recruits.org.in • Learn • Work • Grow
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wider uppercase">
                <Award className="w-3.5 h-3.5" />
                100% Placement Assistance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200 text-xs font-black tracking-wider uppercase">
                80% Digital + 20% Physical Tutoring
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Industry-Ready{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-300">
                Training Programs
              </span>{" "}
              &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Campus Talent Hub
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              High-Demand Skills • AI-Powered Learning • Real Career Opportunities. Master industry-aligned curricula with{" "}
              <strong className="text-white">80% Digital Learning + 20% Physical Tutoring</strong>, hands-on projects, industry mentorship, globally recognized certification, and{" "}
              <strong className="text-amber-300">100% Placement Assistance in Top MNCs</strong> across 10 major sectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sessionStorage.setItem("arohi_learning_tab_handoff", "programs");
                onEnterWorkspace("learning");
              }}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer border border-indigo-400/30"
            >
              <GraduationCap className="w-4 h-4" /> Explore All 10 Courses
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem("arohi_learning_tab_handoff", "institutions");
                onEnterWorkspace("learning");
              }}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" /> For Colleges & Universities (2026–27)
            </button>
          </div>
        </div>

        {/* 5 Core Delivery Pillars Strip (Directly from Poster) */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "80% Digital Learning", sub: "AI-Powered Interactive LMS", icon: Globe },
            { label: "20% Physical Tutoring", sub: "Classroom & Lab Mentorship", icon: UserCheck },
            { label: "Hands-on Projects", sub: "Production Capstone Builds", icon: Code },
            { label: "Industry Mentorship", sub: "1-on-1 Senior Practitioners", icon: Sparkles },
            { label: "Globally Recognized", sub: "Verified Career Certificate", icon: ShieldCheck },
          ].map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-3.5 flex items-center gap-3 hover:border-cyan-400/50 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white leading-snug">{pillar.label}</div>
                  <div className="text-[10px] text-indigo-200/80">{pillar.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* REAL-WORLD HYBRID CLASSROOM & LAB MENTORSHIP VISUAL SHOWCASE */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4">
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden min-h-[190px] bg-slate-900">
            <img
              src={BRANDING_IMAGES.hybridClassroomMentorship}
              alt="80% Digital Learning + 20% Physical Classroom Tutoring on Recruits.org.in"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                Hybrid Learning Model in Action
              </span>
              <p className="text-xs sm:text-sm font-black leading-snug">
                80% Interactive Digital LMS + 20% Physical Faculty &amp; Lab Mentorship
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-3 p-1">
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold text-cyan-300">
                Immediate Self-Paced + Mentor-Guided Execution
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Every Student Can Start Learning Module 1 Immediately Upon Selection
              </h3>
              <p className="text-xs text-indigo-100/85 leading-relaxed">
                No waiting for batch dates to begin—unlock 50 pre-built interactive modules across all 10 programs with AI Voice Professor explanations in English, Hindi &amp; Odia, real-time code/case-study lab grading, and weekend physical classroom tutoring.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-sm font-black text-emerald-300 block tabular-nums">50 Modules</span>
                <span className="text-[10px] text-slate-400">Pre-Loaded &amp; Live</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-sm font-black text-amber-300 block tabular-nums">80% + 20%</span>
                <span className="text-[10px] text-slate-400">Digital + Physical Lab</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
                <span className="text-sm font-black text-cyan-300 block tabular-nums">100% Assist</span>
                <span className="text-[10px] text-slate-400">MNC Placement Drives</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Numbered Training Programs Grid (Exact Poster Layout 1–5 Left, 6–10 Right) */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-300" />
              Our 10 Official Training Programs (Click any course to enroll)
            </span>
            <span className="text-[11px] text-indigo-200 font-semibold">
              EMI & Institutional Batch Scholarships Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {OFFICIAL_10_TRAINING_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                onClick={() => {
                  sessionStorage.setItem("arohi_learning_program_handoff", prog.id);
                  sessionStorage.setItem("arohi_learning_tab_handoff", "classroom");
                  onEnterWorkspace("learning");
                }}
                className="group glass-vision-card rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 border border-white/25 shadow">
                    {prog.number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-sky-300 transition truncate">
                      {prog.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-indigo-200/80 mt-0.5 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" /> {prog.duration}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-300 font-bold">5 Modules Ready • Start Immediately</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/35 text-emerald-300 text-[10px] font-bold uppercase">
                    <Play className="w-2.5 h-2.5 fill-current" /> Start Now
                  </span>
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-extrabold text-xs sm:text-sm tabular-nums shadow-sm">
                    {prog.feeINR}
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 group-hover:text-sky-300 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 100% Placement Assistance Across 10 Major Sectors */}
        <div className="relative z-10 glass-vision rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide">
                  100% Placement Assistance • Support for Placements in Top MNCs
                </h3>
                <p className="text-xs text-slate-300">
                  Direct hiring pipelines and placement drives across 10 major industry sectors
                </p>
              </div>
            </div>
            <button
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="text-xs font-extrabold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              View Open Sector Jobs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {PLACEMENT_SECTORS.map((sec) => {
              const SecIcon = sec.icon;
              return (
                <div
                  key={sec.name}
                  onClick={() => {
                    sessionStorage.setItem("arohi_learning_tab_handoff", "programs");
                    onEnterWorkspace("learning");
                  }}
                  className="bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-amber-400/40 rounded-xl p-2.5 flex items-center gap-2 transition cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${sec.color}`}>
                    <SecIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-extrabold text-white leading-tight">{sec.name}</div>
                </div>
              );
            })}
          </div>

          {/* Top MNC Placement Partner Brand Logos Strip */}
          <div className="pt-3 border-t border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Top MNC &amp; Enterprise Hiring Partners Recruiting Recruits.org.in Graduates:
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                Click any brand to view active roles
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {FEATURED_MNC_BRANDS.slice(0, 12).map((brand) => (
                <div
                  key={brand.name}
                  onClick={() =>
                    handleLaunchJobSearchWithFilter({
                      sector: brand.sector,
                      query: brand.searchQuery,
                    })
                  }
                  className="bg-white hover:bg-amber-50 border border-slate-200 rounded-xl px-2.5 py-2 flex items-center justify-center transition cursor-pointer hover:scale-[1.02] shadow-sm h-11"
                >
                  <CompanyBrandLogo name={brand.name} size="banner" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOR COLLEGES & UNIVERSITIES (2026–27 ACADEMIC YEAR PARTNER CALLOUT + 3 OFFICIAL POSTERS) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-950/90 border border-fuchsia-500/40 rounded-2xl p-5 sm:p-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200 text-[11px] font-black uppercase tracking-wider">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              For Colleges & Universities • Limited 2026–27 Slots
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              Make Your Institution India’s Next{" "}
              <span className="text-cyan-300">Talent Powerhouse</span> — Turn Your Campus into a{" "}
              <span className="text-amber-300">Future-Ready Talent Hub</span>
            </h3>

            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Partner with <strong className="text-white">Recruits.org.in</strong> (A Strategic Skilling & Placement Partner for Educational Institutions by{" "}
              <strong className="text-amber-300">Quench Research Labs Private Limited</strong>) to deliver real career outcomes, 80% Digital + 20% Physical Campus Tutoring, and 100% Placement Assistance for your graduating batches.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  sessionStorage.setItem("arohi_learning_tab_handoff", "institutions");
                  onEnterWorkspace("learning");
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                Reserve 2026–27 Campus Partnership Slot <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem("arohi_learning_tab_handoff", "posters_ai");
                  onEnterWorkspace("learning");
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-indigo-400/40 text-indigo-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                View Official Brochures & Posters
              </button>
            </div>
          </div>

          {/* 3 Official Uploaded Posters Preview Strip */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2.5">
            {OFFICIAL_POSTERS.map((poster) => (
              <div
                key={poster.id}
                onClick={() => {
                  sessionStorage.setItem("arohi_learning_tab_handoff", "posters_ai");
                  onEnterWorkspace("learning");
                }}
                className="group relative rounded-xl overflow-hidden border border-indigo-400/40 hover:border-amber-300 cursor-pointer shadow-lg bg-slate-950 aspect-[3/4]"
                title={poster.title}
              >
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-2">
                  <span className="text-[9px] font-black text-amber-300 uppercase leading-tight line-clamp-1">
                    {poster.subtitle}
                  </span>
                  <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                    {poster.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER SUCCESS WALL COMPONENT */}
      <CareerSuccessWall
        onEnterWorkspace={(tabId) => onEnterWorkspace(tabId)}
        selectedLanguage={selectedLanguage}
      />

      {/* COMMUNITY SUCCESS TICKER & MILESTONES SECTION */}
      <section className="gsap-scroll-section apple-mesh-dark border border-white/15 rounded-[2rem] p-6 sm:p-8 md:p-10 text-white space-y-6 shadow-[0_32px_70px_-20px_rgba(5,8,22,0.7)] relative overflow-hidden will-change-transform">
        {/* TOP CONTINUOUS MARQUEE RUNNING TICKER STRIP */}
        <div className="relative z-10 glass-vision rounded-2xl p-3 overflow-hidden flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-500/40 shrink-0 text-xs font-black tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            LIVE PLACEMENTS
          </div>

          <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-6 text-xs text-slate-200 font-medium py-0.5">
            {milestones.map((m) => (
              <div key={`ticker-${m.id}`} className="inline-flex items-center gap-2 shrink-0 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="font-extrabold text-amber-300">{m.userInitials} ({m.location.split(',')[0]}):</span>
                <span className="text-white font-bold">{m.title}</span>
                <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30 font-bold">{m.metric}</span>
                <span className="text-slate-400 text-[10px]">({m.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>

        {/* HEADER ROW */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold tracking-wide uppercase">
                <PartyPopper className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                Community Victory Wall
              </span>
              <span className="text-xs text-slate-400 font-medium">12,450+ Verified Career Milestones</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Community Success & Job Placements
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Live, anonymized exam clearances, corporate offers, and ATS resume improvements achieved by candidates using Arohi Career AI.
            </p>
          </div>

          {/* SHARE YOUR SUCCESS BUTTON */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg border border-amber-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Share Your Success Story</span>
          </button>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {["All", "Govt Jobs", "Tech & Corporate", "ATS Resume", "Mock Interview"].map((cat) => (
            <button
              key={cat}
              onClick={() => setMilestoneFilter(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                milestoneFilter === cat
                  ? "bg-emerald-400 text-slate-950 border-emerald-300 shadow-md font-extrabold"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {cat === "All" ? "All Milestones" : cat}
            </button>
          ))}
        </div>

        {/* MILESTONE CARDS GRID */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones
            .filter((m) => milestoneFilter === "All" || m.category === milestoneFilter)
            .map((m) => {
              const isReading = activeReadingMilestoneId === m.id;

              return (
                <div
                  key={m.id}
                  className="glass-vision-card rounded-2xl p-5 space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* USER HEADER */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow">
                          {m.userInitials.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                            {m.userInitials}
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" /> {m.location}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium">{m.timeAgo}</span>
                    </div>

                    {/* MILESTONE TITLE & HIGHLIGHT BADGE */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] px-2 py-0.5 rounded-full font-black">
                          {m.metric}
                        </span>
                        <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {m.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {m.title}
                      </h3>
                    </div>

                    {/* USER QUOTE */}
                    <p className="text-xs text-slate-300 italic bg-slate-900/80 p-3 rounded-xl border-l-2 border-emerald-400 leading-relaxed font-normal">
                      "{m.quote}"
                    </p>

                    {/* AROHI FEATURE TAG */}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Feature used: <strong className="text-indigo-200 font-semibold">{m.featureUsed}</strong></span>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    {/* CONGRATULATE BUTTON */}
                    <button
                      onClick={() => handleCongratulate(m.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-[11px] ${
                        m.userCongratulated
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          m.userCongratulated ? "text-rose-400 fill-rose-400" : "text-slate-400"
                        }`}
                      />
                      <span>{m.congratulations} Celebrate</span>
                    </button>

                    {/* LISTEN TO STORY BUTTON */}
                    <button
                      onClick={() => handleReadMilestone(m)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-[11px] ${
                        isReading
                          ? "bg-emerald-500 text-slate-950 animate-pulse font-black"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isReading ? "Stop Arohi" : "Listen"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* SHARE MILESTONE MODAL */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 text-white shadow-2xl relative animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <h3 className="text-lg font-black text-white">Share Your Success Milestone</h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMilestoneSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Your Name / Initials *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh K."
                      value={newMilestoneForm.userInitials}
                      onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, userInitials: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Location / District</label>
                    <input
                      type="text"
                      placeholder="e.g. Bhubaneswar, Odisha"
                      value={newMilestoneForm.location}
                      onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Milestone Achievement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cleared OPSC Civil Services 2026 Mains Exam"
                    value={newMilestoneForm.title}
                    onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category</label>
                    <select
                      value={newMilestoneForm.category}
                      onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Govt Jobs">Govt Jobs (OPSC/SSC)</option>
                      <option value="Tech & Corporate">Tech & Corporate</option>
                      <option value="ATS Resume">ATS Resume Rewrite</option>
                      <option value="Mock Interview">Mock Interview Win</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Key Result / Metric Highlight</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12 LPA Package or Rank #15"
                      value={newMilestoneForm.metric}
                      onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, metric: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Arohi AI Feature That Helped You</label>
                  <input
                    type="text"
                    placeholder="e.g. Odia Voice AI Call or Daily Timed Quiz"
                    value={newMilestoneForm.featureUsed}
                    onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, featureUsed: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Short Quote / Advice for Fellow Candidates</label>
                  <textarea
                    rows={2}
                    placeholder="Share a quick tip or reflection..."
                    value={newMilestoneForm.quote}
                    onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, quote: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border border-amber-300 transition cursor-pointer shadow-lg"
                  >
                    Publish Success Story
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* INDUSTRY PULSE SECTION (GROUNDED REAL-TIME NEWS & TRENDS) */}
      <section className="gsap-scroll-section apple-mesh-dark border border-white/15 rounded-[2rem] p-6 sm:p-8 md:p-10 text-white space-y-6 shadow-[0_32px_70px_-20px_rgba(5,8,22,0.7)] relative overflow-hidden will-change-transform">
        {/* HEADER ROW */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/12 pb-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wide uppercase">
                <Newspaper className="w-3.5 h-3.5 text-amber-300" />
                Live Grounded Search Engine
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> {pulseData.lastUpdated}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Industry Pulse & Job Market News
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Search-grounded career intelligence, state recruitment updates (OPSC, OSSC), central exam alerts, and IT hiring trends across India.
            </p>
          </div>

          {/* REFRESH LIVE NEWS BUTTON */}
          <button
            onClick={() => fetchPulseData(pulseCategory)}
            disabled={isFetchingPulse}
            className="px-4 py-2.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl border border-indigo-400/30 flex items-center justify-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-white ${isFetchingPulse ? "animate-spin" : ""}`} />
            <span>{isFetchingPulse ? "Grounding Search..." : "Refresh Live News"}</span>
          </button>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {["All", "Govt & Public Sector", "Tech & Corporate", "Banking & SSC", "Skill Trends"].map((cat) => (
            <button
              key={cat}
              onClick={() => fetchPulseData(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                pulseCategory === cat
                  ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-extrabold"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TRENDING TOPIC BADGES */}
        {pulseData.trendingTopics && pulseData.trendingTopics.length > 0 && (
          <div className="relative z-10 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center flex-wrap gap-2 text-xs">
            <span className="font-bold text-amber-300 text-[11px] flex items-center gap-1 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trending Feeds:
            </span>
            {pulseData.trendingTopics.map((topic, i) => (
              <span
                key={i}
                className="bg-indigo-950/70 text-indigo-200 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[11px] font-medium"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}

        {/* ARTICLES GRID */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {pulseData.articles.map((article) => {
            const isReading = activeReadingId === article.id;
            const categoryBg =
              article.category === "Govt & Public Sector"
                ? "bg-amber-500/20 text-amber-200 border-amber-500/40"
                : article.category === "Tech & Corporate"
                ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/40"
                : article.category === "Banking & SSC"
                ? "bg-rose-500/20 text-rose-200 border-rose-500/40"
                : "bg-emerald-500/20 text-emerald-200 border-emerald-500/40";

            return (
              <div
                key={article.id}
                className="glass-vision-card rounded-2xl p-5 space-y-3.5 flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  {/* TOP ROW: CATEGORY + SOURCE + DATE */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border ${categoryBg}`}>
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* SUMMARY */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {article.summary}
                  </p>

                  {/* AROHI AI ACTIONABLE INSIGHT BOX */}
                  {article.actionableInsight && (
                    <div className="bg-indigo-950/50 border border-indigo-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-indigo-100">
                      <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong className="text-amber-300 font-extrabold block text-[11px] uppercase tracking-wide">
                          Arohi AI Recommendation
                        </strong>
                        <span className="text-slate-200 font-medium">{article.actionableInsight}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  {/* AUDIO SUMMARY BUTTON */}
                  <button
                    onClick={() => handleReadArticleSummary(article)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-[11px] ${
                      isReading
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isReading ? "Stop Arohi Voice" : "Listen to Summary"}</span>
                  </button>

                  {/* EXPLORE JOBS LINK */}
                  <button
                    onClick={() => onEnterWorkspace("liveindiajobs")}
                    className="text-amber-300 font-extrabold hover:text-amber-200 flex items-center gap-1 transition text-[11px]"
                  >
                    <span>Match Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA SECTION */}
      <section className="gsap-scroll-section apple-mesh-dark border border-white/15 rounded-[2rem] p-8 sm:p-12 text-center space-y-6 shadow-[0_32px_70px_-20px_rgba(5,8,22,0.72)] text-white relative overflow-hidden will-change-transform">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quench Research Labs Private Limited • Flagship Ecosystem</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white">
            Ready to Accelerate Your Career on Recruits.org.in?
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100/85">
            Join candidates and employers advancing with Arohi AI Career &amp; Talent Intelligence (<a href="https://arohiai.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline font-bold hover:text-amber-200">arohiai.com</a>), developed by <strong className="text-white">Quench Research Labs Private Limited</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="px-8 py-4 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 hover:brightness-105 text-slate-950 font-extrabold text-sm sm:text-base rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_18px_36px_-12px_rgba(251,191,36,0.55)] flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Enter AI Career Portal Workspace</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>

          <a
            href="https://arohiai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 glass-vision-card text-amber-300 font-extrabold text-sm sm:text-base rounded-full flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explore ArohiAI.com</span>
          </a>
        </div>
      </section>
    </div>
  );
};

