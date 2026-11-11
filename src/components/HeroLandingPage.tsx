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
import { Cinematic3DExperience } from "./Cinematic3DExperience";

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
  const [show3DCinematic, setShow3DCinematic] = useState<boolean>(true);
  const [cityScrollProgress, setCityScrollProgress] = useState<number>(0);

  // GSAP ScrollTrigger Refs for Top-to-Bottom Cinematic Transition
  const landingRootRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLDivElement | null>(null);
  const heroGridRef = useRef<HTMLDivElement | null>(null);
  const heroStatsRef = useRef<HTMLDivElement | null>(null);
  const transitionHorizonRef = useRef<HTMLDivElement | null>(null);
  const careerCitySectionRef = useRef<HTMLElement | null>(null);
  const careerCityViewportRef = useRef<HTMLDivElement | null>(null);

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

      // 2. Cinematic Portal Horizon Bridge Expansion
      if (transitionHorizonRef.current) {
        gsap.fromTo(
          transitionHorizonRef.current,
          { opacity: 0.5, scale: 0.94, y: 24 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: transitionHorizonRef.current,
              start: "top 90%",
              end: "center 55%",
              scrub: 0.5,
            },
          }
        );
      }

      // 3. Seamless Entry & Camera Flythrough Scrub for the Interactive 3D Career City
      if (show3DCinematic && careerCitySectionRef.current && careerCityViewportRef.current) {
        gsap.fromTo(
          careerCityViewportRef.current,
          {
            scale: 0.92,
            y: 56,
            opacity: 0.65,
          },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: careerCitySectionRef.current,
              start: "top 88%",
              end: "top 25%",
              scrub: 0.6,
            },
          }
        );

        ScrollTrigger.create({
          trigger: careerCitySectionRef.current,
          start: "top 65%",
          end: "bottom 20%",
          scrub: 0.5,
          onUpdate: (self) => {
            setCityScrollProgress(self.progress);
          },
        });
      }

      // 4. Progressive ScrollTrigger Reveal for Downstream Landing Page Sections
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
  }, [show3DCinematic]);

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
        {/* HERO HEADER */}
        <div ref={heroTitleRef} className="text-center space-y-2 pt-2 will-change-transform">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-blue-600 tracking-tight">
            RECRUIT
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            India's Smartest Job Search Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Find Jobs. Hire Talent. Build Careers. Powered by Artificial Intelligence.
          </p>
        </div>

        {/* HERO MAIN CONTENT GRID */}
        <div ref={heroGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start will-change-transform">
          {/* LEFT 8 COLS: SEARCH BAR + TRENDING TAGS + CATEGORY CARDS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SEARCH CARD CONTAINER */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200/80 space-y-4">
              {/* INPUT ROW */}
              <div className="relative flex flex-col md:flex-row items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                <Search className="w-5 h-5 text-blue-600 ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onEnterWorkspace("liveindiajobs");
                    }
                  }}
                  placeholder="Search Jobs, Companies, Skills or Government Vacancies..."
                  className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none px-2 py-1.5"
                />

                {/* SEARCH ACTION PILLS INSIDE INPUT BOX */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => onEnterWorkspace("navigator")}
                    className="flex items-center gap-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
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
                    className={`flex items-center gap-1 border px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer ${
                      isListening
                        ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Voice</span>
                  </button>

                  <button
                    onClick={() => onEnterWorkspace("resume")}
                    className="flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Upload Resume</span>
                  </button>

                  <button
                    onClick={() => {
                      setSearchLocation("Bhubaneswar / India");
                    }}
                    className="flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{searchLocation || "Location"}</span>
                  </button>
                </div>
              </div>

              {/* ACTION BUTTONS BELOW SEARCH BAR */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => onEnterWorkspace("liveindiajobs")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-8 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Jobs</span>
                </button>

                <button
                  onClick={() => onEnterWorkspace("navigator")}
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-extrabold text-sm px-8 py-2.5 rounded-full shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Ask Recruit AI</span>
                </button>

                <button
                  onClick={() => {
                    setShow3DCinematic(true);
                    careerCitySectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2.5 rounded-full transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>3D Career City ↓</span>
                </button>
              </div>
            </div>

            {/* 🔥 TRENDING JOBS TAG STRIP */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Trending Jobs
                </span>
                <button
                  onClick={() => onEnterWorkspace("liveindiajobs")}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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
                      onEnterWorkspace("liveindiajobs");
                    }}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition cursor-pointer"
                  >
                    <TrendingUp className="w-3 h-3 text-slate-400" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 14 CATEGORY GRID CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                { title: "Government Jobs", icon: Building, color: "text-blue-600 bg-blue-50 border-blue-200" },
                { title: "Private Jobs", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                { title: "Remote Jobs", icon: Globe, color: "text-purple-600 bg-purple-50 border-purple-200" },
                { title: "Internships", icon: GraduationCap, color: "text-amber-600 bg-amber-50 border-amber-200" },
                { title: "Walk-ins", icon: UserCheck, color: "text-pink-600 bg-pink-50 border-pink-200" },
                { title: "Part-time", icon: Clock, color: "text-teal-600 bg-teal-50 border-teal-200" },
                { title: "Freelance", icon: Zap, color: "text-violet-600 bg-violet-50 border-violet-200" },
                { title: "IT Jobs", icon: Code, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
                { title: "Healthcare", icon: Heart, color: "text-rose-600 bg-rose-50 border-rose-200" },
                { title: "Engineering", icon: Layers, color: "text-orange-600 bg-orange-50 border-orange-200" },
                { title: "Banking", icon: Landmark, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                { title: "Mining", icon: Pickaxe, color: "text-amber-700 bg-amber-50 border-amber-200" },
                { title: "Education", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                { title: "View All Categories", icon: Grid, color: "text-slate-600 bg-slate-100 border-slate-200" },
              ].map((cat) => {
                const IconComponent = cat.icon || Building;
                return (
                  <button
                    key={cat.title}
                    onClick={() => onEnterWorkspace("liveindiajobs")}
                    className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className={`p-2.5 rounded-xl border ${cat.color} group-hover:scale-110 transition`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 leading-tight">
                      {cat.title}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* RIGHT 4 COLS: MEET RECRUIT AI FLOATING CARD */}
          <div className="lg:col-span-4 bg-gradient-to-b from-blue-50/80 via-white to-indigo-50/50 rounded-2xl p-5 border border-blue-200/90 shadow-lg space-y-4">
            <div className="flex items-center gap-3 border-b border-blue-100 pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Meet Recruit AI
                </h3>
                <p className="text-xs font-bold text-blue-600">
                  Your Personal Career Adviser
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS LIST */}
            <div className="space-y-2">
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
                    className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-blue-50/80 rounded-xl border border-slate-200/80 hover:border-blue-300 text-xs font-bold text-slate-800 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-blue-100/60 rounded-lg text-blue-600">
                        <ItemIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* CHAT CTA BUTTON */}
            <button
              onClick={() => onEnterWorkspace("navigator")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-full shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Chat with Recruit AI →</span>
            </button>
          </div>
        </div>

        {/* KEY STATS BANNER ROW */}
        <div ref={heroStatsRef} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 grid grid-cols-2 md:grid-cols-4 gap-6 text-center will-change-transform">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">5 Million+</span>
            <strong className="text-xs font-bold text-slate-800 block">Jobs</strong>
            <p className="text-[11px] text-slate-500">Updated every minute</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">200,000+</span>
            <strong className="text-xs font-bold text-slate-800 block">Employers</strong>
            <p className="text-[11px] text-slate-500">Trusted by top companies</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 block">1 Million+</span>
            <strong className="text-xs font-bold text-slate-800 block">Candidates</strong>
            <p className="text-[11px] text-slate-500">Building successful careers</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 block">98%</span>
            <strong className="text-xs font-bold text-slate-800 block">AI Matching Accuracy</strong>
            <p className="text-[11px] text-slate-500">Smart. Accurate. Reliable.</p>
          </div>
        </div>

        {/* FEATURED COMPANIES ROW */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Featured Companies
            </h3>
            <button
              onClick={() => onEnterWorkspace("jobmatch")}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View All Companies &gt;
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 items-center">
            {[
              { name: "TATA", font: "font-serif tracking-widest font-black text-slate-900" },
              { name: "Infosys", font: "font-sans font-black text-blue-600" },
              { name: "wipro", font: "font-mono font-bold text-purple-600" },
              { name: "HDFC BANK", font: "font-sans font-extrabold text-slate-900" },
              { name: "Reliance", font: "font-serif font-black text-red-600" },
              { name: "Tech Mahindra", font: "font-sans font-black text-red-700" },
              { name: "amazon", font: "font-sans font-black text-amber-600" },
              { name: "adani", font: "font-sans font-black text-blue-800" },
              { name: "L&T", font: "font-serif font-black text-slate-800" },
            ].map((company) => (
              <div
                key={company.name}
                onClick={() => onEnterWorkspace("jobmatch")}
                className="bg-slate-50 hover:bg-blue-50 border border-slate-200/80 p-3 rounded-xl text-center flex items-center justify-center transition cursor-pointer hover:scale-105 h-12"
              >
                <span className={`text-xs ${company.font}`}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TRENDING GOVERNMENT JOBS SECTION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Trending Government Jobs
            </h3>
            <button
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Browse All Government Vacancies &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { agency: "UPSC", title: "Civil Services & Defense", vacancies: "124 Vacancies", badge: "New", badgeColor: "bg-blue-100 text-blue-700" },
              { agency: "SSC", title: "CGL, CHSL & Selection", vacancies: "256 Vacancies", badge: "New", badgeColor: "bg-blue-100 text-blue-700" },
              { agency: "Railway", title: "RRB NTPC & Technical", vacancies: "12,450 Vacancies", badge: "Hot", badgeColor: "bg-orange-100 text-orange-700" },
              { agency: "Banking", title: "SBI, IBPS PO & Clerk", vacancies: "8,932 Vacancies", badge: "Hot", badgeColor: "bg-orange-100 text-orange-700" },
              { agency: "Odisha Govt.", title: "OPSC, OSSC & OSSSC", vacancies: "5,320 Vacancies", badge: "New", badgeColor: "bg-blue-100 text-blue-700" },
              { agency: "State PSC", title: "Assistant Section Officer", vacancies: "2,450 Vacancies", badge: "Closing Soon", badgeColor: "bg-amber-100 text-amber-800" },
              { agency: "Police", title: "SI, Constable & Excise", vacancies: "3,210 Vacancies", badge: "Popular", badgeColor: "bg-purple-100 text-purple-700" },
              { agency: "Teaching", title: "KVS, NVS & High School", vacancies: "6,543 Vacancies", badge: "Hot", badgeColor: "bg-orange-100 text-orange-700" },
            ].map((govt) => (
              <div
                key={govt.agency}
                onClick={() => onEnterWorkspace("liveindiajobs")}
                className="bg-slate-50 hover:bg-blue-50/60 p-4 rounded-xl border border-slate-200/80 space-y-2 transition cursor-pointer hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{govt.agency}</span>
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

      {/* CINEMATIC SCROLL HORIZON BRIDGE INTO INTERACTIVE 3D CAREER CITY */}
      <div
        ref={transitionHorizonRef}
        className="relative rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-950 to-indigo-950 p-6 sm:p-8 text-center text-white border border-indigo-500/30 shadow-2xl overflow-hidden will-change-transform"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
        <div className="max-w-2xl mx-auto space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive 3D Career Metropolis</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Transitioning Into the Recruits.org.in 3D AI Career City
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Scroll down to descend from orbit into 8 interactive AI Career Towers—or click any building to enter its live engine.
          </p>
          <div className="pt-1 flex items-center justify-center gap-3">
            <button
              onClick={() => setShow3DCinematic(!show3DCinematic)}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>{show3DCinematic ? "Minimize 3D City Viewport" : "Expand 3D City Viewport"}</span>
            </button>
            <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
              Scroll Trajectory: {(cityScrollProgress * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* GSAP SCROLLTRIGGER INTERACTIVE 3D CAREER CITY SECTION */}
      {show3DCinematic && (
        <section ref={careerCitySectionRef} className="relative will-change-transform">
          <div ref={careerCityViewportRef} className="will-change-transform">
            <Cinematic3DExperience
              onEnterWorkspace={onEnterWorkspace}
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              onCloseCinematic={() => setShow3DCinematic(false)}
              externalScrollProgress={cityScrollProgress}
            />
          </div>
        </section>
      )}

      {/* LIVE HOT JOB TICKER SPOTLIGHT */}
      <section className="gsap-scroll-section bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 will-change-transform">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-black text-[11px]">
              <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" /> LIVE JOB SPOTLIGHT
            </span>
            <span className="text-slate-500 font-medium hidden sm:inline">Crawling verified government & employer feeds:</span>
          </div>

          <button
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All 100,000+ Jobs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {LIVE_TICKER_JOBS.map((job) => (
            <div
              key={job.id}
              onClick={() => onEnterWorkspace("liveindiajobs")}
              className="p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-300 rounded-xl transition cursor-pointer group space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500 uppercase">{job.dept}</span>
                <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[9px] border border-amber-300">
                  {job.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 line-clamp-1">
                {job.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.loc}</span>
                <span className="text-indigo-600 font-bold">Match & Apply →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10-SECOND AI CAREER READINESS CALCULATOR WIDGET */}
      <section className="gsap-scroll-section bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-700/50 shadow-xl space-y-6 will-change-transform">
        <div className="max-w-3xl space-y-2 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-300/30">
            ⚡ Interactive AI Diagnostic Tool
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Instant 10-Second Career Readiness & Eligibility Check
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200">
            Select your target career stream to get instant AI fit forecasting before applying.
          </p>
        </div>

        <form onSubmit={runQuickReadinessCheck} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
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
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Integrated Career & Hiring Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CARD 1: LIVE INDIA JOBS ENGINE */}
          <div
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl space-y-4 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Real-time Crawler
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">Live Govt & Private Jobs</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Verified notification feeds for OPSC, SSC, Banking, Railways, and direct recruiter job postings with zero commission direct application.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-indigo-600 group-hover:text-indigo-800">
              <span>Explore Live Jobs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 2: AROHI VOICE & MOCK INTERVIEW */}
          <div
            onClick={() => onEnterWorkspace("interview")}
            className="group bg-white border border-slate-200 hover:border-amber-500 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Voice Call & Odia Speech
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">Arohi AI Voice Mentor</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  1-on-1 voice calls in Odia, Hindi, or English. STAR interview coaching, voice interruption detection, and acoustic confidence analysis.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-amber-600 group-hover:text-amber-800">
              <span>Start Voice Practice</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 3: ATS RESUME INTELLIGENCE */}
          <div
            onClick={() => onEnterWorkspace("resume")}
            className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ATS Score Optimizer
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">Resume Rewriter & PDF Generator</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Upload your resume to get instant ATS match diagnostics, missing keyword additions, formatting fixes, and professional PDF export.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-600 group-hover:text-emerald-800">
              <span>Fix Resume ATS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 4: 30s TECHNICAL & GK QUIZ */}
          <div
            onClick={() => onEnterWorkspace("skillmastery")}
            className="group bg-white border border-slate-200 hover:border-purple-500 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">
                  Micro-Skill Mastery
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">30s Rapid Technical Quiz</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Test your skills in JavaScript, React, Odisha GK, General Aptitude, and Verbal Reasoning with instant AI explanations.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-purple-600 group-hover:text-purple-800">
              <span>Take Quick Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 5: EMPLOYER & RECRUITER PORTAL */}
          <div
            onClick={() => onEnterWorkspace("recruiter", "recruiter")}
            className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-xl space-y-4 flex flex-col justify-between md:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 max-w-lg">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/20 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-emerald-300" />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Free Employer Service
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-2">100% Free Job Postings for Employers</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Recruiters & organizations can post job vacancies for free, track direct candidate applications, and use Arohi AI to rank candidate resumes automatically.
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-2xl font-black text-emerald-700">₹0 Fee</span>
                <span className="block text-[10px] text-slate-500 font-bold">Zero Commission</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-900 group-hover:text-emerald-700">
              <span>Post Job as Employer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* CAREER SUCCESS WALL COMPONENT */}
      <CareerSuccessWall
        onEnterWorkspace={(tabId) => onEnterWorkspace(tabId)}
        selectedLanguage={selectedLanguage}
      />

      {/* COMMUNITY SUCCESS TICKER & MILESTONES SECTION */}
      <section className="gsap-scroll-section bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 text-white space-y-6 shadow-2xl relative overflow-hidden will-change-transform">
        {/* Glowing Orbs Background */}
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP CONTINUOUS MARQUEE RUNNING TICKER STRIP */}
        <div className="relative z-10 bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-3 overflow-hidden shadow-inner flex items-center gap-3">
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
                  className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition group hover:shadow-xl"
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
      <section className="gsap-scroll-section bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 text-white space-y-6 shadow-2xl relative overflow-hidden will-change-transform">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER ROW */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
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
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between transition group hover:shadow-xl"
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
      <section className="gsap-scroll-section bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 border border-indigo-700 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl text-white relative overflow-hidden will-change-transform">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Accelerate Your Career on Recruits.org.in?
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200">
            Join candidates and employers advancing with Arohi AI Career & Talent Intelligence.
          </p>
        </div>

        <div className="flex justify-center relative z-10">
          <button
            onClick={() => onEnterWorkspace("liveindiajobs")}
            className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl border border-amber-300 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <span>Enter AI Career Portal Workspace</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </section>
    </div>
  );
};

