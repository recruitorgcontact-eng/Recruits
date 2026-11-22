import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  ExternalLink,
  Award,
  Code,
  Briefcase,
  Loader2,
  GraduationCap,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Laptop,
  Users,
  Layers,
  TrendingUp,
  Landmark,
  Heart,
  Truck,
  Zap,
  Globe,
  Calendar,
  ArrowRight,
  X,
  Check,
  Bot,
  Cpu,
  Lock,
  Cloud,
  Database,
  PieChart,
  Wrench,
  Sprout,
  ShoppingBag,
  Factory,
  Image as ImageIcon,
  Play,
  Volume2,
  VolumeX,
  Terminal,
  HelpCircle,
  MapPin,
  Printer,
  Clock,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { CareerMemory, CourseRecommendation } from "../../types";
import { OFFICIAL_COURSE_MODULES, CourseModuleItem } from "../../data/officialCourseModules";
import { speakText, stopSpeech } from "../../utils/speech";
import { CompanyBrandLogo, FEATURED_MNC_BRANDS } from "../CompanyBrandLogo";
import { BRANDING_IMAGES, getProgramCoverImage } from "../../utils/brandingImages";
import {
  buildStructuredUnitsForModule,
  computeModuleGateStatus,
  createStudentLabScaffold,
  validateMeaningfulLabEffort,
  isModuleUnlocked,
  formatDurationHMS,
  formatHoursShort,
  DAILY_STUDY_CAP_HOURS,
  DAILY_STUDY_CAP_SECONDS,
  PASSING_LAB_SCORE,
  PASSING_QUIZ_PERCENT,
  IDLE_TIMEOUT_SECONDS,
  LearnerLmsProgress,
  ModuleServerProgress,
} from "../../utils/lmsCurriculumEngine";
import { UnitWorkbookPlayer } from "./UnitWorkbookPlayer";

interface LearningAdvisorEngineProps {
  memory: CareerMemory;
  initialProgramId?: string;
}

export interface OfficialTrainingProgram {
  number: number;
  id: string;
  title: string;
  duration: string;
  feeINR: string;
  category: string;
  highlights: string[];
  toolsCovered: string[];
  iconType: "ai" | "genai" | "cyber" | "cloud" | "bigdata" | "marketing" | "finance" | "bizds" | "certds" | "engds";
}

export const OFFICIAL_10_TRAINING_PROGRAMS: OfficialTrainingProgram[] = [
  {
    number: 1,
    id: "prog-01-ds-ai",
    title: "Data Science & Artificial Intelligence",
    duration: "8–10 Months",
    feeINR: "₹79,999",
    category: "Flagship AI & Data",
    highlights: [
      "End-to-end Machine Learning, Deep Learning & Neural Networks",
      "80% Digital Learning + 20% Physical Tutoring with Industry Mentors",
      "100% Placement Assistance in Top MNCs",
    ],
    toolsCovered: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "SQL", "MLOps"],
    iconType: "ai",
  },
  {
    number: 2,
    id: "prog-02-genai-agents",
    title: "Generative AI & AI Agent Development",
    duration: "5–6 Months",
    feeINR: "₹59,999",
    category: "Next-Gen AI Engineering",
    highlights: [
      "LLM Fine-Tuning, RAG Pipelines & Autonomous Multi-Agent Systems",
      "Hands-on Enterprise AI Projects powered by ArohiAI.com & Gemini APIs",
      "Globally Recognized Certification & MNC Placement Support",
    ],
    toolsCovered: ["Gemini API", "LangGraph", "Vector DBs", "RAG", "TypeScript", "Python"],
    iconType: "genai",
  },
  {
    number: 3,
    id: "prog-03-cybersecurity",
    title: "Cybersecurity & Ethical Hacking",
    duration: "7–9 Months",
    feeINR: "₹69,999",
    category: "Security & Defense",
    highlights: [
      "Offensive Penetration Testing, VAPT, SOC Operations & Cloud Security",
      "Live Cyber Range Simulations & Red/Blue Team Exercises",
      "Direct Placement Pipeline in BFSI, IT & Government Cyber Wings",
    ],
    toolsCovered: ["Kali Linux", "Metasploit", "Burp Suite", "Wireshark", "SIEM", "Zero-Trust"],
    iconType: "cyber",
  },
  {
    number: 4,
    id: "prog-04-cloud-devops",
    title: "Cloud Engineering & DevOps",
    duration: "6–8 Months",
    feeINR: "₹59,999",
    category: "Cloud & Infrastructure",
    highlights: [
      "Multi-Cloud Architecture (AWS, GCP, Azure) & High-Availability Systems",
      "Automated CI/CD Pipelines, Kubernetes Orchestration & IaC",
      "Hands-on Production Deployment Projects",
    ],
    toolsCovered: ["AWS / GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions"],
    iconType: "cloud",
  },
  {
    number: 5,
    id: "prog-05-big-data",
    title: "Big Data Engineering & Cloud Analytics",
    duration: "6–8 Months",
    feeINR: "₹64,999",
    category: "Data Engineering",
    highlights: [
      "Distributed Data Processing, Real-Time Streaming & Data Lakehouses",
      "Enterprise ETL/ELT Architecture for Petabyte-Scale Workloads",
      "Industry Mentorship & 100% Placement Assistance",
    ],
    toolsCovered: ["Apache Spark", "Kafka", "Snowflake", "Airflow", "Databricks", "BigQuery"],
    iconType: "bigdata",
  },
  {
    number: 6,
    id: "prog-06-digital-marketing",
    title: "Digital Marketing & AI-Powered Growth",
    duration: "6 Months",
    feeINR: "₹49,999",
    category: "Growth & Marketing",
    highlights: [
      "AI-Driven Performance Marketing, Programmatic SEO & Conversion Funnels",
      "Generative AI Content Engines, Ad Attribution & Growth Analytics",
      "Live Brand Campaigns & Agency/MNC Placement Support",
    ],
    toolsCovered: ["GA4", "Meta/Google Ads", "AI Copy/Video", "HubSpot", "SEMrush", "CRO"],
    iconType: "marketing",
  },
  {
    number: 7,
    id: "prog-07-investment-banking",
    title: "Investment Banking & Financial Analytics",
    duration: "To be Confirmed",
    feeINR: "₹49,999",
    category: "BFSI & Finance",
    highlights: [
      "Financial Modeling, M&A Valuation, Equity Research & Risk Analytics",
      "Quantitative Portfolio Analysis & Algorithmic Financial Reporting",
      "Targeted Placement Assistance for BFSI & Global Investment Firms",
    ],
    toolsCovered: ["Financial Modeling", "DCF & LBO", "Python for Finance", "PowerBI", "Bloomberg Concepts"],
    iconType: "finance",
  },
  {
    number: 8,
    id: "prog-08-ds-business",
    title: "Data Science for Business Decision-Making",
    duration: "3–4 Months",
    feeINR: "₹34,999",
    category: "Executive & Management",
    highlights: [
      "Fast-track Predictive Analytics, Executive BI & Data Storytelling",
      "KPI Forecasting, Customer Churn Modeling & Revenue Optimization",
      "Ideal for Aspiring Product Managers, Analysts & Business Leaders",
    ],
    toolsCovered: ["Power BI", "Tableau", "Advanced Excel", "SQL", "Predictive Analytics"],
    iconType: "bizds",
  },
  {
    number: 9,
    id: "prog-09-ds-certification",
    title: "Data Science Professional Certification",
    duration: "8 Months",
    feeINR: "₹59,999",
    category: "Professional Certification",
    highlights: [
      "Rigorous Statistical Foundations, Exploratory Analysis & ML Deployment",
      "80% Digital + 20% Physical Classroom Mentoring with Capstone Portfolio",
      "Globally Recognized Certification by Recruits.org.in & ArohiAI.com",
    ],
    toolsCovered: ["Python", "Pandas", "Statistical Modeling", "SQL", "Machine Learning", "Git"],
    iconType: "certds",
  },
  {
    number: 10,
    id: "prog-10-ds-engineers",
    title: "Data Science for Engineers",
    duration: "8 Months",
    feeINR: "₹69,999",
    category: "Engineering Specialization",
    highlights: [
      "Production-Grade ML Systems, Scalable Algorithms & System Design",
      "Bridging Core Engineering (CSE/ECE/Mech/Civil) with Applied AI",
      "100% Placement Assistance across Top IT, Core & R&D MNCs",
    ],
    toolsCovered: ["Python", "C++ / FastAPI", "Docker", "System Design", "Deep Learning", "Cloud ML"],
    iconType: "engds",
  },
];

export const PLACEMENT_SECTORS = [
  { name: "IT & Software", icon: Laptop, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { name: "BFSI (Banking & Finance)", icon: Landmark, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { name: "Manufacturing & Industrial", icon: Factory, color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  { name: "Retail & E-commerce", icon: ShoppingBag, color: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
  { name: "Healthcare & Life Sciences", icon: Heart, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  { name: "Agriculture & AgriTech", icon: Sprout, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { name: "Logistics & Supply Chain", icon: Truck, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { name: "Energy & Utilities", icon: Zap, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { name: "Government & Public Sector", icon: Building2, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
  { name: "And More Global Sectors...", icon: Globe, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
];

export const OFFICIAL_POSTERS = [
  {
    id: "poster-programs-pricing",
    title: "Industry-Ready Training Programs & Pricing (10 Courses)",
    subtitle: "80% Digital + 20% Physical Tutoring • 100% Placement Assistance",
    imageUrl: "/assets/aistudio/WhatsApp_Image_2026-11-04_at_6.32.30_PM_0296805e.jpeg",
  },
  {
    id: "poster-institution-powerhouse",
    title: "Make Your Institution India's Next Talent Powerhouse",
    subtitle: "Strategic Skilling & Placement Partner for Educational Institutions (2026–27)",
    imageUrl: "/assets/aistudio/36_54d174c1.jpeg",
  },
  {
    id: "poster-campus-hub",
    title: "For Colleges & Universities: Turn Your Campus into a Future-Ready Talent Hub",
    subtitle: "Be an Early Partner • Limited Campus Slots for 2026–27 Academic Year",
    imageUrl: "/assets/aistudio/23_ece3218f.jpeg",
  },
];

export const LearningAdvisorEngine: React.FC<LearningAdvisorEngineProps> = ({
  memory,
  initialProgramId,
}) => {
  const [activeTab, setActiveTab] = useState<"programs" | "classroom" | "institutions" | "posters_ai">(
    initialProgramId ? "classroom" : "programs"
  );

  // Interactive Time-Enforced LMS Classroom State (Server-Authoritative across all 10 Courses & 50 Modules)
  const [activeClassroomProgramId, setActiveClassroomProgramId] = useState<string>(
    initialProgramId || "prog-01-ds-ai"
  );
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(0);
  const [classroomSubTab, setClassroomSubTab] = useState<"lesson" | "lab" | "quiz" | "tutoring">("lesson");

  useEffect(() => {
    if (initialProgramId) {
      setActiveClassroomProgramId(initialProgramId);
      setActiveModuleIndex(0);
      setActiveUnitIndex(0);
      setActiveTab("classroom");
    }
  }, [initialProgramId]);

  // Stable persistent learner identifier for server-side study hour ledger
  const [learnerId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem("arohi_lms_learner_id_v2");
      if (existing) return existing;
      const generated = `learner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem("arohi_lms_learner_id_v2", generated);
      return generated;
    } catch {
      return "learner-session";
    }
  });

  const [lmsProgress, setLmsProgress] = useState<LearnerLmsProgress>({
    learnerId: "learner-session",
    dailySecondsByDate: {},
    modules: {},
    updatedAt: "",
  });
  const [todayCreditedSeconds, setTodayCreditedSeconds] = useState<number>(0);
  const [dailyCapReached, setDailyCapReached] = useState<boolean>(false);

  // Active Anti-Idle Focus Session State
  const [isFocusPaused, setIsFocusPaused] = useState<boolean>(false);
  const [pauseReason, setPauseReason] = useState<string | null>(null);
  const [pendingSessionSeconds, setPendingSessionSeconds] = useState<number>(0);
  const lastActivityTsRef = React.useRef<number>(Date.now());
  const pendingDeltaRef = React.useRef<number>(0);
  const activeModuleIdRef = React.useRef<string>("");
  const activeUnitIdRef = React.useRef<string>("");
  const activeSessionIdRef = React.useRef<string>("");
  const digitalRequiredSecRef = React.useRef<number>(103680);

  // Classroom Voice Narration & AI Professor State
  const [isSpeakingLesson, setIsSpeakingLesson] = useState<boolean>(false);
  const [studentDoubtInput, setStudentDoubtInput] = useState<string>("");
  const [loadingTutorAI, setLoadingTutorAI] = useState<boolean>(false);
  const [tutorResponse, setTutorResponse] = useState<{ explanation: string; keyTakeaways: string[] } | null>(null);

  // Classroom Hands-on Lab State (Student TODO Scaffold — Never Pre-Solved)
  const [labSubmissionCode, setLabSubmissionCode] = useState<string>("");
  const [labValidationError, setLabValidationError] = useState<string | null>(null);
  const [evaluatingLab, setEvaluatingLab] = useState<boolean>(false);
  const [labResult, setLabResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    keyTakeaways: string[];
  } | null>(null);

  // Timed Proctored Module Mastery Exam State
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(1200);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResultSummary, setQuizResultSummary] = useState<{
    scorePercent: number;
    passed: boolean;
    error?: string;
  } | null>(null);

  // 20% Physical Tutoring Session Booking & Mentor PIN Verification State
  const [tutoringCenter, setTutoringCenter] = useState<string>("Bhubaneswar Hub (Saheed Nagar / Infocity)");
  const [tutoringSlot, setTutoringSlot] = useState<string>("Saturday Morning (10:00 AM – 1:00 PM IST)");
  const [bookingPhysical, setBookingPhysical] = useState<boolean>(false);
  const [mentorPinInput, setMentorPinInput] = useState<string>("");
  const [verifyingPin, setVerifyingPin] = useState<boolean>(false);
  const [pinFeedback, setPinFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Certificate Modal State
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Student Enrollment Modal State
  const [selectedProgram, setSelectedProgram] = useState<OfficialTrainingProgram | null>(null);
  const [studentName, setStudentName] = useState(memory.personalInfo?.fullName || "");
  const [studentEmail, setStudentEmail] = useState("student@example.com");
  const [studentPhone, setStudentPhone] = useState("+91 9876543210");
  const [studentCollegeOrCity, setStudentCollegeOrCity] = useState("Bhubaneswar, Odisha");
  const [learningModePref, setLearningModePref] = useState("Hybrid (80% Digital + 20% Physical Tutoring)");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Institutional Partnership Form State (2026-27)
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("Engineering / Technical College");
  const [contactPersonName, setContactPersonName] = useState("");
  const [designation, setDesignation] = useState("Training & Placement Officer (TPO) / Dean");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialPhone, setOfficialPhone] = useState("");
  const [campusCityState, setCampusCityState] = useState("Bhubaneswar, Odisha");
  const [studentBatchSize, setStudentBatchSize] = useState("250 - 500 Students");
  const [selectedCampusPrograms, setSelectedCampusPrograms] = useState<string[]>([
    "Data Science & Artificial Intelligence",
    "Generative AI & AI Agent Development",
    "Cloud Engineering & DevOps",
  ]);
  const [submittingPartnership, setSubmittingPartnership] = useState(false);
  const [partnerships, setPartnerships] = useState<any[]>([]);

  // Poster Lightbox State
  const [lightboxPoster, setLightboxPoster] = useState<(typeof OFFICIAL_POSTERS)[0] | null>(null);

  // AI Custom Learning Recommendations State
  const [goal, setGoal] = useState(memory.careerGoals || "Master Generative AI, Data Science & Cloud Architecture");
  const [loadingAI, setLoadingAI] = useState(false);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const activeClassroomProgram =
    OFFICIAL_10_TRAINING_PROGRAMS.find((p) => p.id === activeClassroomProgramId) ||
    OFFICIAL_10_TRAINING_PROGRAMS[0];
  const activeProgramModules: CourseModuleItem[] =
    OFFICIAL_COURSE_MODULES[activeClassroomProgram.id] || OFFICIAL_COURSE_MODULES["prog-01-ds-ai"];
  const currentModule: CourseModuleItem =
    activeProgramModules[activeModuleIndex] || activeProgramModules[0];
  const currentModuleUnits = React.useMemo(
    () => buildStructuredUnitsForModule(currentModule),
    [currentModule]
  );
  const currentUnit = currentModuleUnits[activeUnitIndex] || currentModuleUnits[0];
  const currentModuleProgress: ModuleServerProgress | undefined = lmsProgress.modules[currentModule.id];
  const currentGateStatus = computeModuleGateStatus(currentModule, currentModuleProgress);

  // Program-level verified audit metrics
  const programAudit = React.useMemo(() => {
    let totalRequiredHours = 0;
    let totalVerifiedHours = 0;
    let completedModulesCount = 0;
    const perModule = activeProgramModules.map((m) => {
      const gs = computeModuleGateStatus(m, lmsProgress.modules[m.id]);
      totalRequiredHours += gs.totalHours;
      totalVerifiedHours += gs.totalLoggedHours;
      if (gs.allGatesPassed) completedModulesCount++;
      return { mod: m, gate: gs };
    });
    const allModulesVerified =
      activeProgramModules.length > 0 && completedModulesCount === activeProgramModules.length;
    return {
      totalRequiredHours: Number(totalRequiredHours.toFixed(1)),
      totalVerifiedHours: Number(totalVerifiedHours.toFixed(2)),
      completedModulesCount,
      totalModulesCount: activeProgramModules.length,
      allModulesVerified,
      perModule,
    };
  }, [activeProgramModules, lmsProgress.modules]);

  useEffect(() => {
    activeModuleIdRef.current = currentModule.id;
    activeUnitIdRef.current = currentUnit.unitId;
    digitalRequiredSecRef.current = currentGateStatus.digitalRequiredSeconds;
  }, [currentModule.id, currentUnit.unitId, currentGateStatus.digitalRequiredSeconds]);

  // Load server-authoritative LMS progress ledger on mount
  useEffect(() => {
    fetch(`/api/lms/progress?learnerId=${encodeURIComponent(learnerId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.progress) {
          setLmsProgress(d.progress);
          setTodayCreditedSeconds(d.todaySeconds || 0);
          setDailyCapReached(Boolean(d.dailyCapReached));
        }
      })
      .catch(() => {});
  }, [learnerId]);

  // Reset per-module interactive state when switching program or module
  useEffect(() => {
    if (currentModule) {
      setActiveUnitIndex(0);
      setLabSubmissionCode(createStudentLabScaffold(currentModule));
      setLabValidationError(null);
      setLabResult(null);
      setExamStarted(false);
      setExamSecondsLeft(1200);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResultSummary(null);
      setTutorResponse(null);
      setStudentDoubtInput("");
      setMentorPinInput("");
      setPinFeedback(null);
      stopSpeech();
      setIsSpeakingLesson(false);
    }
  }, [activeClassroomProgramId, activeModuleIndex]);

  // Active Focus Anti-Idle Study Timer + Server Heartbeat Sync (runs ONLY in classroom when focused & active)
  useEffect(() => {
    if (activeTab !== "classroom") return;

    const recordActivity = () => {
      lastActivityTsRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsFocusPaused(true);
        setPauseReason("Browser tab switched or minimized — study timer paused automatically.");
      }
    };

    window.addEventListener("mousemove", recordActivity, { passive: true });
    window.addEventListener("keydown", recordActivity, { passive: true });
    window.addEventListener("scroll", recordActivity, { passive: true });
    window.addEventListener("click", recordActivity, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const flushHeartbeatToServer = async () => {
      const delta = pendingDeltaRef.current;
      if (delta < 10) return;
      pendingDeltaRef.current = 0;
      setPendingSessionSeconds(0);
      try {
        const res = await fetch("/api/lms/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerId,
            moduleId: activeModuleIdRef.current,
            unitId: activeUnitIdRef.current,
            sessionId: activeSessionIdRef.current,
            deltaSeconds: delta,
            digitalRequiredSeconds: digitalRequiredSecRef.current,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.progress) setLmsProgress(data.progress);
          if (typeof data.todaySeconds === "number") setTodayCreditedSeconds(data.todaySeconds);
          setDailyCapReached(Boolean(data.dailyCapReached));
        }
      } catch (_err) {
        // Re-credit unsynced delta on transient network hiccup
        pendingDeltaRef.current = Math.min(30, pendingDeltaRef.current + delta);
      }
    };

    const tick = setInterval(() => {
      if (document.hidden) {
        setIsFocusPaused(true);
        setPauseReason("Tab inactive — return to the classroom to log verified study hours.");
        return;
      }
      const idleSec = Math.floor((Date.now() - lastActivityTsRef.current) / 1000);
      if (idleSec >= IDLE_TIMEOUT_SECONDS) {
        setIsFocusPaused(true);
        setPauseReason("No interaction detected for 2 minutes — confirm active focus to resume.");
        return;
      }
      if (isFocusPaused || dailyCapReached) return;

      pendingDeltaRef.current += 1;
      setPendingSessionSeconds(pendingDeltaRef.current);

      if (pendingDeltaRef.current >= 15) {
        flushHeartbeatToServer();
      }
    }, 1000);

    return () => {
      clearInterval(tick);
      window.removeEventListener("mousemove", recordActivity);
      window.removeEventListener("keydown", recordActivity);
      window.removeEventListener("scroll", recordActivity);
      window.removeEventListener("click", recordActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeTab, isFocusPaused, dailyCapReached, learnerId]);

  // Timed Proctored Exam Countdown Timer
  useEffect(() => {
    if (!examStarted || quizSubmitted) return;
    if (examSecondsLeft <= 0) {
      handleSubmitModuleQuiz();
      return;
    }
    const t = setInterval(() => {
      setExamSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [examStarted, quizSubmitted, examSecondsLeft]);

  const handleResumeStudyFocus = () => {
    lastActivityTsRef.current = Date.now();
    setIsFocusPaused(false);
    setPauseReason(null);
  };

  const handleLaunchClassroom = (programId: string, moduleIdx = 0) => {
    const mods = OFFICIAL_COURSE_MODULES[programId] || [];
    const unlocked = isModuleUnlocked(mods, moduleIdx, lmsProgress.modules);
    if (!unlocked) {
      showToast(
        `🔒 Module ${moduleIdx + 1} is locked. Complete all 4 verification gates in Module ${moduleIdx} first.`
      );
      setActiveClassroomProgramId(programId);
      setActiveModuleIndex(Math.max(0, moduleIdx - 1));
      setClassroomSubTab("lesson");
      setActiveTab("classroom");
      return;
    }
    setActiveClassroomProgramId(programId);
    setActiveModuleIndex(moduleIdx);
    setClassroomSubTab("lesson");
    setActiveTab("classroom");
  };

  const handleSpeakCurrentLesson = () => {
    if (isSpeakingLesson) {
      stopSpeech();
      setIsSpeakingLesson(false);
      return;
    }
    const narrationText = `Module ${currentModule.moduleNumber}: ${currentModule.title}, ${currentUnit.title}. ${currentModule.summary}. ${currentModule.lessonNotes}`;
    setIsSpeakingLesson(true);
    speakText({
      text: narrationText,
      language: "en",
      onStart: () => setIsSpeakingLesson(true),
      onEnd: () => setIsSpeakingLesson(false),
      onError: () => setIsSpeakingLesson(false),
    });
  };

  const handleAskArohiProfessor = async (customPrompt?: string) => {
    setLoadingTutorAI(true);
    try {
      const res = await fetch("/api/ai/course-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "deep_dive",
          programTitle: activeClassroomProgram.title,
          moduleTitle: currentModule.title,
          lessonSummary: currentModule.summary,
          studentInput:
            customPrompt ||
            studentDoubtInput.trim() ||
            `Provide a deep-dive explanation and top MNC interview questions for ${currentModule.title}.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTutorResponse({
          explanation: data.explanation,
          keyTakeaways: data.keyTakeaways || [],
        });
      }
    } catch (err) {
      console.error("AI Tutor error:", err);
    } finally {
      setLoadingTutorAI(false);
    }
  };

  const handleEvaluateHandsOnLab = async () => {
    setLabValidationError(null);
    const scaffold = createStudentLabScaffold(currentModule);
    const check = validateMeaningfulLabEffort(labSubmissionCode, scaffold);
    if (!check.valid) {
      setLabValidationError(check.reason || "Please write a complete solution before submitting.");
      return;
    }

    setEvaluatingLab(true);
    try {
      const res = await fetch("/api/ai/course-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "evaluate_lab",
          programTitle: activeClassroomProgram.title,
          moduleTitle: currentModule.title,
          moduleId: currentModule.id,
          learnerId,
          labTask: currentModule.handsOnLab.taskDescription,
          deliverableCriteria: currentModule.handsOnLab.deliverableCriteria,
          studentInput: labSubmissionCode,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLabResult(data);
        if (data.progress) {
          setLmsProgress(data.progress);
        }
        if (data.passed) {
          showToast(
            `✅ Gate 2 Passed! Hands-On Lab scored ${data.score}/100 (>= ${PASSING_LAB_SCORE} required).`
          );
        } else {
          showToast(
            `⚠️ Lab scored ${data.score}/100 — Minimum ${PASSING_LAB_SCORE}/100 required to pass Gate 2.`
          );
        }
      }
    } catch (err) {
      console.error("Lab grading error:", err);
    } finally {
      setEvaluatingLab(false);
    }
  };

  const handleSubmitModuleQuiz = async () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    currentModule.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correctCount++;
    });

    try {
      const res = await fetch("/api/lms/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId,
          moduleId: currentModule.id,
          correctCount,
          totalQuestions: currentModule.quizQuestions.length,
        }),
      });
      const data = await res.json();
      if (data.progress) setLmsProgress(data.progress);

      if (!res.ok) {
        setQuizResultSummary({
          scorePercent: 0,
          passed: false,
          error: data.error || "Exam cooldown active.",
        });
        return;
      }

      setQuizResultSummary({
        scorePercent: data.scorePercent,
        passed: Boolean(data.passed),
      });

      if (data.passed) {
        showToast(
          `🎯 Gate 3 Passed! Proctored Exam Score: ${data.scorePercent}% (>= ${PASSING_QUIZ_PERCENT}% required).`
        );
      } else {
        showToast(
          `⚠️ Exam Score: ${data.scorePercent}%. Minimum ${PASSING_QUIZ_PERCENT}% required — 15-min review cooldown started.`
        );
      }
    } catch (_err) {
      setQuizResultSummary({
        scorePercent: Math.round((correctCount / Math.max(1, currentModule.quizQuestions.length)) * 100),
        passed: false,
        error: "Could not save exam attempt to server. Please retry.",
      });
    }
  };

  const handleBookPhysicalTutoring = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingPhysical(true);
    setPinFeedback(null);
    try {
      const res = await fetch("/api/lms/physical-lab/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId,
          moduleId: currentModule.id,
          programTitle: activeClassroomProgram.title,
          moduleTitle: `Module ${currentModule.moduleNumber}: ${currentModule.title}`,
          center: tutoringCenter,
          slot: tutoringSlot,
          physicalRequiredHours: currentGateStatus.physicalRequiredHours,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.progress) setLmsProgress(data.progress);
        showToast(
          `🏫 20% Physical Lab Slot Reserved (${data.booking?.bookingId}). Complete your ${currentGateStatus.physicalRequiredHours}h mentor session and enter the Mentor PIN to verify Gate 4.`
        );
      }
    } catch (_err) {
      showToast("Unable to book physical lab slot right now.");
    } finally {
      setBookingPhysical(false);
    }
  };

  const handleVerifyMentorPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingPin(true);
    setPinFeedback(null);
    try {
      const res = await fetch("/api/lms/physical-lab/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerId,
          moduleId: currentModule.id,
          mentorPin: mentorPinInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPinFeedback({ ok: false, text: data.error || "Invalid Mentor PIN." });
      } else {
        if (data.progress) setLmsProgress(data.progress);
        setPinFeedback({
          ok: true,
          text: `Gate 4 Verified! ${data.physicalHoursCredited}h Physical Mentor Lab officially credited.`,
        });
        showToast(`✅ 20% Physical Tutoring (${data.physicalHoursCredited}h) Verified!`);
      }
    } catch (_err) {
      setPinFeedback({ ok: false, text: "Verification failed. Please retry." });
    } finally {
      setVerifyingPin(false);
    }
  };

  useEffect(() => {
    // Check if HeroLandingPage requested a specific tab or instant program classroom handoff
    try {
      const handoffProg = sessionStorage.getItem("arohi_learning_program_handoff");
      const handoffTab = sessionStorage.getItem("arohi_learning_tab_handoff");
      if (handoffProg) {
        sessionStorage.removeItem("arohi_learning_program_handoff");
        setActiveClassroomProgramId(handoffProg);
        setActiveModuleIndex(0);
        setActiveTab("classroom");
      } else if (
        handoffTab === "institutions" ||
        handoffTab === "programs" ||
        handoffTab === "posters_ai" ||
        handoffTab === "classroom"
      ) {
        sessionStorage.removeItem("arohi_learning_tab_handoff");
        setActiveTab(handoffTab);
      }
    } catch (e) {
      // ignore
    }

    // Load existing enrollments and campus partnerships from backend
    fetch("/api/platform/course-enrollments")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.enrollments) setEnrollments(d.enrollments);
      })
      .catch(() => {});

    fetch("/api/platform/campus-partnerships")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.partnerships) setPartnerships(d.partnerships);
      })
      .catch(() => {});
  }, []);

  const handleStudentEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !studentName.trim() || !studentPhone.trim()) return;
    setEnrolling(true);

    try {
      const res = await fetch("/api/platform/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollment: {
            programId: selectedProgram.id,
            programNumber: selectedProgram.number,
            programTitle: selectedProgram.title,
            duration: selectedProgram.duration,
            feeINR: selectedProgram.feeINR,
            studentName: studentName.trim(),
            studentEmail: studentEmail.trim(),
            studentPhone: studentPhone.trim(),
            locationOrCollege: studentCollegeOrCity.trim(),
            learningMode: learningModePref,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enrollments) setEnrollments(data.enrollments);
        const enrolledProgId = selectedProgram.id;
        showToast(
          `🎉 Enrolled in "${selectedProgram.title}"! Launching Module 1 in your Interactive LMS Classroom now...`
        );
        setSelectedProgram(null);
        handleLaunchClassroom(enrolledProgId, 0);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleCampusProgramSelection = (title: string) => {
    setSelectedCampusPrograms((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleCampusPartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim() || !contactPersonName.trim() || !officialPhone.trim()) return;
    setSubmittingPartnership(true);

    try {
      const res = await fetch("/api/platform/campus-partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnership: {
            institutionName: institutionName.trim(),
            institutionType,
            contactPersonName: contactPersonName.trim(),
            designation: designation.trim(),
            officialEmail: officialEmail.trim(),
            officialPhone: officialPhone.trim(),
            campusCityState: campusCityState.trim(),
            studentBatchSize,
            programsRequested: selectedCampusPrograms,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.partnerships) setPartnerships(data.partnerships);
        showToast(
          `🏛️ 2026–27 Priority Campus Partnership Slot Reserved for "${institutionName}"! Quench Research Labs Institutional Team will connect with ${contactPersonName}.`
        );
        setInstitutionName("");
        setContactPersonName("");
        setOfficialEmail("");
      }
    } catch (err) {
      console.error("Campus partnership submit error:", err);
    } finally {
      setSubmittingPartnership(false);
    }
  };

  const handleGetRecommendations = async () => {
    setLoadingAI(true);
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
      setLoadingAI(false);
    }
  };

  const renderProgramIcon = (type: OfficialTrainingProgram["iconType"]) => {
    switch (type) {
      case "ai":
        return <Cpu className="w-5 h-5 text-cyan-300" />;
      case "genai":
        return <Bot className="w-5 h-5 text-purple-300" />;
      case "cyber":
        return <Lock className="w-5 h-5 text-emerald-300" />;
      case "cloud":
        return <Cloud className="w-5 h-5 text-sky-300" />;
      case "bigdata":
        return <Database className="w-5 h-5 text-amber-300" />;
      case "marketing":
        return <TrendingUp className="w-5 h-5 text-pink-300" />;
      case "finance":
        return <Landmark className="w-5 h-5 text-indigo-300" />;
      case "bizds":
        return <PieChart className="w-5 h-5 text-teal-300" />;
      case "certds":
        return <Award className="w-5 h-5 text-yellow-300" />;
      case "engds":
        return <Wrench className="w-5 h-5 text-orange-300" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-emerald-300/40 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-extrabold">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="p-1 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HERO BANNER MATCHING THE 3 OFFICIAL POSTERS */}
      <div className="relative overflow-hidden rounded-[2rem] apple-mesh-dark border border-white/15 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-300/35 text-cyan-200 text-[11px] font-black uppercase tracking-widest backdrop-blur-md">
                LEARN • WORK • GROW
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/35 text-amber-200 text-[11px] font-extrabold backdrop-blur-md">
                100% Placement Assistance in Top MNCs
              </span>
              <span className="text-[11px] text-indigo-200/90 font-semibold">
                Recruits.org.in • Powered by ArohiAI.com
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {activeTab === "institutions" ? (
                <>
                  Make Your Institution{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300">
                    India&apos;s Next Talent Powerhouse
                  </span>
                </>
              ) : (
                <>
                  Industry-Ready{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-300">
                    Training Programs &amp; Campus Skilling
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
              High-Demand Skills &bull; AI-Powered Learning &bull; Real Career Opportunities &bull; A Strategic Skilling &amp; Placement Partner for Students, Colleges &amp; Universities.
            </p>
          </div>

          {/* 100% Placement Gold Crest Badge */}
          <div className="glass-vision-card border-amber-400/50 rounded-3xl px-6 py-4 text-center shrink-0">
            <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight leading-none tabular-nums">
              100%
            </div>
            <div className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mt-1">
              Placement Assistance
            </div>
            <div className="text-[10px] font-bold text-amber-200/90 mt-1 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              Support in Top MNCs Across 10+ Sectors
            </div>
          </div>
        </div>

        {/* 6 CORE DELIVERY PILLARS STRIP FROM POSTERS */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          {[
            { icon: BookOpen, title: "Industry-Ready Curriculum", sub: "Co-designed with MNCs" },
            { icon: Laptop, title: "80% Digital + 20% Physical", sub: "Hybrid Tutoring Model" },
            { icon: Layers, title: "Hands-on Projects", sub: "Real Production Capstone" },
            { icon: Users, title: "Industry Mentorship", sub: "1-on-1 Expert Guidance" },
            { icon: Award, title: "Globally Recognized", sub: "Verified Certification" },
            { icon: Briefcase, title: "Placement Support", sub: "Top MNCs & Sectors" },
          ].map((pillar, idx) => {
            const PIcon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-vision-card rounded-2xl p-3 flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-cyan-400/15 border border-cyan-300/30 text-cyan-300 shrink-0">
                  <PIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-white leading-tight">
                    {pillar.title}
                  </div>
                  <div className="text-[10px] text-indigo-200/80">{pillar.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* REAL-WORLD SKILLING, HYBRID CLASSROOM & PLACEMENT PHOTOGRAPHY STRIP */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {[
            {
              title: "80% Digital + 20% Physical Classroom",
              sub: "Interactive Verified LMS + Faculty Lab Mentorship",
              img: BRANDING_IMAGES.hybridClassroomMentorship,
              action: () => setActiveTab("classroom"),
              cta: "Open Verified LMS Classroom →",
            },
            {
              title: "Generative AI, Data Science & Cloud Labs",
              sub: "Real Production Projects Co-Designed with MNCs",
              img: BRANDING_IMAGES.genaiNeuralPrism,
              action: () => setActiveTab("programs"),
              cta: "Explore 10 Programs →",
            },
            {
              title: "100% Campus Placement & Day-One Offers",
              sub: "Turn Your Institution into a Talent Powerhouse",
              img: BRANDING_IMAGES.placementOfferMilestone,
              action: () => setActiveTab("institutions"),
              cta: "Partner for 2026–27 →",
            },
          ].map((card) => (
            <div
              key={card.title}
              onClick={card.action}
              className="group relative h-40 rounded-2xl overflow-hidden border border-indigo-400/30 hover:border-cyan-400 cursor-pointer shadow-lg bg-slate-950"
            >
              <img
                src={card.img}
                alt={card.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-300 block">{card.sub}</span>
                  <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                    {card.title}
                  </h4>
                </div>
                <span className="text-[10px] font-extrabold text-amber-300 shrink-0 group-hover:underline">
                  {card.cta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATION TABS */}
        <div className="relative z-10 pt-6">
          <div className="glass-vision-inset p-1.5 rounded-2xl inline-flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("programs")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === "programs"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-200/70 shadow-lg"
                  : "bg-white/[0.04] text-slate-200 border-white/10 hover:bg-white/[0.10]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>10 Official Training Programs &amp; Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab("classroom")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === "classroom"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 border-emerald-200/70 shadow-lg"
                  : "bg-emerald-400/10 text-emerald-300 border-emerald-400/30 hover:bg-emerald-400/15"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Verified LMS Classroom (50 Time-Enforced Modules)</span>
            </button>

            <button
              onClick={() => setActiveTab("institutions")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === "institutions"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-200/70 shadow-lg"
                  : "bg-white/[0.04] text-slate-200 border-white/10 hover:bg-white/[0.10]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Colleges &amp; Universities (2026–27 Partner Hub)</span>
            </button>

            <button
              onClick={() => setActiveTab("posters_ai")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === "posters_ai"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300/70 shadow-lg"
                  : "bg-white/[0.04] text-slate-200 border-white/10 hover:bg-white/[0.10]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Official Brochures &amp; AI Course Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: 10 OFFICIAL TRAINING PROGRAMS & PRICING CATALOG
         ===================================================================== */}
      {activeTab === "programs" && (
        <div className="space-y-8">
          <div className="apple-mesh-dark border border-white/15 rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                  Recruits.org.in Official Curriculum • Time-Enforced Hybrid LMS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Our 10 Industry-Ready Training Programs (Strict Curriculum Hours)
                </h3>
                <p className="text-xs text-slate-400">
                  Every module enforces real active study hours (80% Digital + 20% Mentor PIN Physical Lab), authentic TODO hands-on labs, and proctored mastery exams. Modules unlock sequentially.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("institutions")}
                className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shrink-0"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                <span>Bring These Programs to Your College →</span>
              </button>
            </div>

            {/* 2-COLUMN NUMBERED PROGRAM GRID MATCHING POSTER 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {OFFICIAL_10_TRAINING_PROGRAMS.map((prog) => {
                const progModules = OFFICIAL_COURSE_MODULES[prog.id] || [];
                const progStatuses = progModules.map((m) =>
                  computeModuleGateStatus(m, lmsProgress.modules[m.id])
                );
                const completedCount = progStatuses.filter((gs) => gs.allGatesPassed).length;
                const totalReqHrs = progStatuses.reduce((acc, gs) => acc + gs.totalHours, 0);
                const totalLogHrs = Number(
                  progStatuses.reduce((acc, gs) => acc + gs.totalLoggedHours, 0).toFixed(1)
                );
                return (
                  <div
                    key={prog.id}
                    className="group glass-vision-card rounded-2xl overflow-hidden flex flex-col justify-between gap-4"
                  >
                    {/* Bespoke Editorial Course Cover Header */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-950 border-b border-white/10">
                      <img
                        src={getProgramCoverImage(prog.iconType)}
                        alt={prog.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/15" />
                      <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-cyan-300/60 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md tabular-nums">
                            {prog.number}
                          </div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-200 bg-slate-950/70 backdrop-blur-md border border-white/15 px-2.5 py-0.5 rounded-full">
                            {prog.category}
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white px-3 py-1 rounded-xl border border-white/25 text-right shrink-0 shadow-lg">
                          <span className="text-sm font-black block leading-none tabular-nums">
                            {prog.feeINR}
                          </span>
                          <span className="text-[9px] text-purple-100 font-semibold">
                            Full Program
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                          {renderProgramIcon(prog.iconType)}
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-200 transition leading-tight line-clamp-1">
                          {prog.title}
                        </h4>
                      </div>
                    </div>

                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col justify-between gap-4 flex-1">
                    <div className="space-y-3">

                      {/* Duration & Delivery Badges */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="inline-flex items-center gap-1 glass-vision-inset text-amber-300 border-amber-400/30 px-2.5 py-0.5 rounded-lg font-bold tabular-nums">
                          <Calendar className="w-3 h-3" /> {prog.duration} ({totalReqHrs}h)
                        </span>
                        <span className="bg-indigo-500/15 text-indigo-200 border border-indigo-400/30 px-2.5 py-0.5 rounded-lg font-semibold">
                          80% Digital + 20% Physical
                        </span>
                        <span className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-lg font-semibold tabular-nums">
                          {completedCount}/{progModules.length} Verified &bull; {totalLogHrs}h/{totalReqHrs}h
                        </span>
                      </div>

                      {/* Key Highlights */}
                      <ul className="space-y-1 text-xs text-slate-200/90 pl-1">
                        {prog.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Sequential 5-Module Curriculum Track */}
                      <div className="glass-vision-inset rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          <span>5 Sequential Time-Enforced Modules</span>
                          <span className="text-amber-300">4-Gate Verified</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {progModules.map((mod, mIdx) => {
                            const gs = progStatuses[mIdx];
                            const isDone = gs.allGatesPassed;
                            const unlocked = isModuleUnlocked(progModules, mIdx, lmsProgress.modules);
                            return (
                              <button
                                key={mod.id}
                                onClick={() => handleLaunchClassroom(prog.id, mIdx)}
                                className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer ${
                                  isDone
                                    ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                                    : unlocked
                                    ? "bg-white/[0.05] hover:bg-cyan-400/15 border-white/10 hover:border-cyan-400/50 text-slate-100"
                                    : "bg-white/[0.02] border-white/[0.06] text-slate-500 hover:border-white/15"
                                }`}
                              >
                                <span className="truncate">
                                  <strong className={unlocked ? "text-cyan-300" : "text-slate-500"}>
                                    M{mod.moduleNumber}:
                                  </strong>{" "}
                                  {mod.title} ({mod.durationHours})
                                </span>
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : unlocked ? (
                                  <Play className="w-3 h-3 text-cyan-300 shrink-0" />
                                ) : (
                                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Tools & Start Learning + Enroll CTAs */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        {prog.toolsCovered.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-white/[0.06] text-slate-200 border border-white/10 px-2 py-0.5 rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLaunchClassroom(prog.id, 0)}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Enter LMS Classroom</span>
                        </button>

                        <button
                          onClick={() => setSelectedProgram(prog)}
                          className="px-3.5 py-2 bg-white/[0.07] hover:bg-white/[0.14] text-cyan-200 border border-cyan-300/35 font-extrabold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
                        >
                          <span>Enroll Batch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10 MAJOR PLACEMENT SECTORS GRID FROM POSTERS */}
          <div className="apple-mesh-dark border border-white/15 rounded-[2rem] p-6 sm:p-8 text-white space-y-5 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-300/30">
                100% Placement Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                Support for Placements in Top MNCs Across Major Sectors
              </h3>
              <p className="text-xs text-slate-300">
                Learn In-Demand Skills. Get Placed. Build Your Career on Recruits.org.in.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {PLACEMENT_SECTORS.map((sec) => {
                const SIcon = sec.icon;
                return (
                  <div
                    key={sec.name}
                    className="glass-vision-card rounded-2xl p-4 flex flex-col items-center text-center gap-2"
                  >
                    <div className={`p-3 rounded-2xl border ${sec.color}`}>
                      <SIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-white leading-snug">
                      {sec.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Top MNC Placement Partner Brand Logos Showcase */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Featured Top MNCs, Banks &amp; Carriers Hiring Across Our 10 Training Programs:
                </span>
                <span className="text-[11px] text-slate-300 font-semibold">
                  Tata • Infosys • Wipro • HDFC Bank • Reliance • Tech Mahindra &amp; 12+ More
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {FEATURED_MNC_BRANDS.map((brand) => (
                  <div
                    key={brand.name}
                    className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 flex flex-col items-center justify-center gap-1 shadow-md border border-white/60 h-14"
                  >
                    <CompanyBrandLogo name={brand.name} size="banner" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1.5: INTERACTIVE LMS CLASSROOM (IMMEDIATE SELF-PACED + AI PROFESSOR)
         ===================================================================== */}
      {activeTab === "classroom" && (
        <div className="apple-mesh-dark border border-white/15 rounded-[2rem] p-4 sm:p-6 space-y-6 shadow-2xl">
          {/* Course Switcher Bar (Time-Enforced Accredited LMS) */}
          <div className="glass-vision rounded-3xl p-4 sm:p-5 text-white space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/15 border border-cyan-300/35 text-cyan-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Strict Time-Enforced LMS • Server-Verified Hours
                </span>
                <span className="text-xs font-bold text-slate-200">
                  Select Program (Modules Unlock Sequentially After All 4 Gates Pass):
                </span>
              </div>
              <button
                onClick={() => setShowCertificateModal(true)}
                className={`px-3.5 py-1.5 font-black text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer border transition ${
                  programAudit.allModulesVerified
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 border-amber-300"
                    : "glass-vision-card text-amber-300 border-amber-400/35"
                }`}
              >
                {programAudit.allModulesVerified ? (
                  <Award className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span className="tabular-nums">
                  {programAudit.allModulesVerified
                    ? "View / Print Verified Certificate"
                    : `Certificate Audit (${programAudit.completedModulesCount}/${programAudit.totalModulesCount} Verified)`}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {OFFICIAL_10_TRAINING_PROGRAMS.map((prog) => {
                const isSelected = prog.id === activeClassroomProgram.id;
                const mods = OFFICIAL_COURSE_MODULES[prog.id] || [];
                const doneCount = mods.filter(
                  (m) => computeModuleGateStatus(m, lmsProgress.modules[m.id]).allGatesPassed
                ).length;
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setActiveClassroomProgramId(prog.id);
                      setActiveModuleIndex(0);
                      setClassroomSubTab("lesson");
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-200/80 shadow-lg"
                        : "glass-vision-card text-slate-200"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-950/35 flex items-center justify-center text-[10px] font-black tabular-nums">
                      {prog.number}
                    </span>
                    <span>{prog.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                        isSelected ? "bg-slate-950/85 text-cyan-300" : "bg-white/10 text-emerald-300"
                      }`}
                    >
                      {doneCount}/{mods.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIVE ANTI-IDLE VERIFIED STUDY TIMER & DAILY INTEGRITY CAP HUD */}
          <div className="glass-vision border-cyan-400/30 rounded-3xl p-4 sm:p-5 text-white space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {dailyCapReached ? (
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                ) : isFocusPaused ? (
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 shrink-0">
                    <PauseCircle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {dailyCapReached
                        ? "Daily 6-Hour Study Integrity Cap Reached"
                        : isFocusPaused
                        ? "Active Study Timer Paused (Anti-Idle Protection)"
                        : "Verified Active Study Session — Logging to Server"}
                    </span>
                    {!isFocusPaused && !dailyCapReached && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Heartbeat Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-200/85 mt-0.5">
                    {dailyCapReached
                      ? `You have logged the maximum ${DAILY_STUDY_CAP_HOURS} verified study hours for today. Return tomorrow to continue building genuine curriculum hours.`
                      : isFocusPaused
                      ? pauseReason || "Stay active on the classroom tab to log real curriculum hours."
                      : `Studying Module ${currentModule.moduleNumber} (${currentUnit.title}). Switching tabs or 2 min of inactivity pauses time logging automatically.`}
                  </p>
                </div>
              </div>

              {isFocusPaused && !dailyCapReached && (
                <button
                  onClick={handleResumeStudyFocus}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer shrink-0"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Confirm Focus &amp; Resume Timer</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Digital 80% Study Hours */}
              <div className="glass-vision-inset rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-cyan-300">Gate 1: Digital Study (80%)</span>
                  <span className="font-black text-white tabular-nums">
                    {currentGateStatus.digitalRequiredHours}h Required
                  </span>
                </div>
                <div className="text-base font-black font-mono tabular-nums text-emerald-300">
                  {formatDurationHMS(
                    Math.min(
                      currentGateStatus.digitalRequiredSeconds,
                      currentGateStatus.digitalLoggedSeconds + pendingSessionSeconds
                    )
                  )}
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((currentGateStatus.digitalLoggedSeconds + pendingSessionSeconds) /
                            Math.max(1, currentGateStatus.digitalRequiredSeconds)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Physical 20% Mentor Lab Hours */}
              <div className="glass-vision-inset rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300">Gate 4: Physical Mentor Lab (20%)</span>
                  <span className="font-black text-white tabular-nums">
                    {currentGateStatus.physicalRequiredHours}h Required
                  </span>
                </div>
                <div className="text-base font-black font-mono tabular-nums text-amber-200">
                  {currentGateStatus.physicalCreditedHours}h / {currentGateStatus.physicalRequiredHours}h
                </div>
                <div className="text-[10px] text-slate-300/80 font-semibold">
                  {currentGateStatus.gate4PhysicalVerified
                    ? "Verified via Official Mentor Attendance PIN ✓"
                    : currentModuleProgress?.physicalBookingId
                    ? `Booked (${currentModuleProgress.physicalBookingId}) • Awaiting Mentor PIN`
                    : "Not yet booked — Schedule in Tab 4"}
                </div>
              </div>

              {/* Daily Integrity Cap Meter */}
              <div className="glass-vision-inset rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-purple-300">Daily Pacing Cap (Anti-Rush)</span>
                  <span className="font-black text-white tabular-nums">{DAILY_STUDY_CAP_HOURS}h / Day Max</span>
                </div>
                <div className="text-base font-black font-mono tabular-nums text-purple-200">
                  {formatHoursShort(
                    Math.min(DAILY_STUDY_CAP_SECONDS, todayCreditedSeconds + pendingSessionSeconds)
                  )}{" "}
                  / {DAILY_STUDY_CAP_HOURS}h 00m
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((todayCreditedSeconds + pendingSessionSeconds) / DAILY_STUDY_CAP_SECONDS) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Classroom Grid: Left Sidebar (5 Modules + 4-Gate Checklist) & Right Lesson Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 4 COLS: MODULE CURRICULUM TREE & 4-GATE VERIFICATION CHECKLIST */}
            <div className="lg:col-span-4 glass-vision rounded-3xl p-5 text-white space-y-5">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                  Program #{activeClassroomProgram.number} &bull; {activeClassroomProgram.duration}
                </span>
                <h3 className="text-lg font-black text-white leading-snug tracking-tight">
                  {activeClassroomProgram.title}
                </h3>

                {/* Verified Program Hours Progress Bar */}
                {(() => {
                  const pct =
                    programAudit.totalRequiredHours > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (programAudit.totalVerifiedHours / programAudit.totalRequiredHours) * 100
                          )
                        )
                      : 0;
                  return (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold">Verified Program Hours</span>
                        <span className="text-emerald-300 font-black tabular-nums">
                          {programAudit.totalVerifiedHours}h / {programAudit.totalRequiredHours}h ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                          style={{ width: `${Math.max(2, pct)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-300/80 font-semibold tabular-nums">
                        {programAudit.completedModulesCount}/{programAudit.totalModulesCount} Modules Passed All 4 Gates
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ACTIVE MODULE 4-GATE VERIFICATION CHECKLIST */}
              <div className="glass-vision-card border-indigo-400/25 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Module {currentModule.moduleNumber} Mandatory 4-Gate Audit
                  </span>
                  <span className="text-[10px] font-black text-cyan-300 tabular-nums">
                    {currentGateStatus.completionPercent}%
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    {
                      ok: currentGateStatus.gate1TimeMet,
                      label: `Gate 1: Digital Hours (${currentGateStatus.digitalLoggedHours}h / ${currentGateStatus.digitalRequiredHours}h)`,
                    },
                    {
                      ok: currentGateStatus.gate2LabPassed,
                      label: `Gate 2: Hands-On Lab (${
                        currentModuleProgress?.labScore !== null &&
                        currentModuleProgress?.labScore !== undefined
                          ? `${currentModuleProgress.labScore}/100`
                          : `Min ${PASSING_LAB_SCORE}/100`
                      })`,
                    },
                    {
                      ok: currentGateStatus.gate3QuizPassed,
                      label: `Gate 3: Proctored Exam (${
                        currentModuleProgress?.quizBestScorePercent !== null &&
                        currentModuleProgress?.quizBestScorePercent !== undefined
                          ? `${currentModuleProgress.quizBestScorePercent}%`
                          : `Min ${PASSING_QUIZ_PERCENT}%`
                      })`,
                    },
                    {
                      ok: currentGateStatus.gate4PhysicalVerified,
                      label: `Gate 4: 20% Physical PIN (${currentGateStatus.physicalCreditedHours}h / ${currentGateStatus.physicalRequiredHours}h)`,
                    },
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                        g.ok
                          ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                          : "glass-vision-inset text-slate-200"
                      }`}
                    >
                      {g.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-semibold leading-tight tabular-nums">{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Sequential Module List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200 block">
                  Sequential Modules (Complete M1 → Unlock M2)
                </span>
                {activeProgramModules.map((mod, idx) => {
                  const isCurrent = idx === activeModuleIndex;
                  const gs = computeModuleGateStatus(mod, lmsProgress.modules[mod.id]);
                  const unlocked = isModuleUnlocked(activeProgramModules, idx, lmsProgress.modules);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleLaunchClassroom(activeClassroomProgram.id, idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                        isCurrent
                          ? "bg-gradient-to-r from-cyan-400/18 via-indigo-500/20 to-blue-500/15 border-cyan-400/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_12px_28px_-12px_rgba(34,211,238,0.35)] backdrop-blur-xl"
                          : unlocked
                          ? "glass-vision-card"
                          : "glass-vision-inset opacity-70 hover:opacity-95"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          Module {mod.moduleNumber} &bull; {mod.durationHours}
                        </span>
                        {gs.allGatesPassed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : unlocked ? (
                          <span className="text-[10px] text-amber-300 font-bold tabular-nums">
                            {gs.totalLoggedHours}h / {gs.totalHours}h ({gs.completionPercent}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full font-bold">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-slate-300/80 line-clamp-2">
                        {unlocked
                          ? mod.summary
                          : `Complete all 4 verification gates in Module ${mod.moduleNumber - 1} to unlock.`}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Certificate & Enrollment Card */}
              <div className="p-4 rounded-2xl glass-vision-card border-indigo-400/35 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-300 uppercase">
                    100% Placement Pipeline
                  </span>
                  <span className="text-xs font-black text-white tabular-nums">{activeClassroomProgram.feeINR}</span>
                </div>
                <p className="text-[11px] text-indigo-100/90 leading-relaxed">
                  Complete 100% verified hours &amp; all 4 gates across all 5 modules to unlock your official Recruits.org.in certificate &amp; MNC referrals.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="py-2 px-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-[11px] rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow"
                  >
                    {programAudit.allModulesVerified ? (
                      <Award className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                    <span>Audit / Cert</span>
                  </button>
                  <button
                    onClick={() => setSelectedProgram(activeClassroomProgram)}
                    className="py-2 px-3 bg-white/[0.08] hover:bg-white/[0.15] text-cyan-200 border border-cyan-300/35 font-bold text-[11px] rounded-xl transition cursor-pointer"
                  >
                    Register Batch
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT 8 COLS: MULTI-UNIT CURRICULUM, TODO LAB, PROCTORED EXAM & MENTOR PIN PHYSICAL LAB */}
            <div className="lg:col-span-8 glass-vision rounded-3xl p-5 sm:p-7 text-white space-y-6">
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-400/15 border border-cyan-300/35 text-cyan-200 text-[11px] font-black uppercase">
                      Module {currentModule.moduleNumber} of {activeProgramModules.length}
                    </span>
                    <span className="text-xs text-amber-300 font-bold tabular-nums">
                      {currentModule.durationHours} ({currentGateStatus.digitalRequiredHours}h Digital +{" "}
                      {currentGateStatus.physicalRequiredHours}h Physical)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentModule.title}
                  </h3>
                </div>

                {/* Voice Narration Button */}
                <button
                  onClick={handleSpeakCurrentLesson}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shrink-0 transition cursor-pointer border shadow-lg ${
                    isSpeakingLesson
                      ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                      : "btn-apple-primary text-white border-white/25"
                  }`}
                >
                  {isSpeakingLesson ? (
                    <>
                      <VolumeX className="w-4 h-4" /> Stop Arohi Voice Professor
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" /> Listen to Arohi Professor
                    </>
                  )}
                </button>
              </div>

              {/* 4 Classroom Mode Sub-Tabs */}
              <div className="glass-vision-inset p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "lesson",
                    label: "1. 6-Unit Curriculum",
                    icon: BookOpen,
                    done: currentGateStatus.gate1TimeMet,
                  },
                  {
                    id: "lab",
                    label: "2. Graded TODO Lab",
                    icon: Terminal,
                    done: currentGateStatus.gate2LabPassed,
                  },
                  {
                    id: "quiz",
                    label: "3. Proctored Exam",
                    icon: HelpCircle,
                    done: currentGateStatus.gate3QuizPassed,
                  },
                  {
                    id: "tutoring",
                    label: "4. 20% Mentor PIN",
                    icon: MapPin,
                    done: currentGateStatus.gate4PhysicalVerified,
                  },
                ].map((tab) => {
                  const TIcon = tab.icon;
                  const active = classroomSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setClassroomSubTab(tab.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        active
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-200/80 shadow-lg font-black"
                          : "bg-white/[0.04] hover:bg-white/[0.10] text-slate-200 border-white/10"
                      }`}
                    >
                      <TIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                      {tab.done && (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            active ? "text-slate-950" : "text-emerald-400"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* SUB-TAB 1: 6 STRUCTURED MULTI-HOUR UNITS, DEEP UNIVERSITY LECTURES & CHECKPOINT */}
              {classroomSubTab === "lesson" && (
                <div className="space-y-6">
                  {/* 6 Structured Multi-Hour Digital Units Selector */}
                  <div className="glass-vision-card border-cyan-400/25 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-300" />
                        6 Structured Multi-Hour Digital Units ({currentGateStatus.digitalRequiredHours}h Total)
                      </h4>
                      <span className="text-[11px] font-bold text-slate-300 tabular-nums">
                        {(currentModuleProgress?.completedUnitIds || []).length}/{currentModuleUnits.length} Units Signed Off
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {currentModuleUnits.map((unit, uIdx) => {
                        const completedUnits = currentModuleProgress?.completedUnitIds || [];
                        const unitDone = completedUnits.includes(unit.unitId);
                        const unitUnlocked =
                          uIdx === 0 || completedUnits.includes(currentModuleUnits[uIdx - 1].unitId);
                        const isSelectedUnit = uIdx === activeUnitIndex;
                        const serverUnitSec = currentModuleProgress?.unitSeconds?.[unit.unitId] || 0;
                        const displayedUnitSec =
                          serverUnitSec + (isSelectedUnit ? pendingSessionSeconds : 0);

                        return (
                          <button
                            key={unit.unitId}
                            onClick={() => {
                              if (!unitUnlocked) {
                                showToast(
                                  `🔒 Complete Unit ${uIdx} study hours & checkpoint to unlock Unit ${uIdx + 1}.`
                                );
                                return;
                              }
                              setActiveUnitIndex(uIdx);
                            }}
                            className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                              isSelectedUnit
                                ? "bg-gradient-to-br from-cyan-400/18 via-indigo-500/20 to-blue-500/15 border-cyan-400/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_12px_28px_-12px_rgba(34,211,238,0.35)] backdrop-blur-xl"
                                : unitDone
                                ? "bg-emerald-500/12 border-emerald-400/35 text-emerald-100"
                                : unitUnlocked
                                ? "glass-vision-card"
                                : "glass-vision-inset opacity-55"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 text-[10px] font-black">
                              <span className={unitUnlocked ? "text-cyan-300 tabular-nums" : "text-slate-500 tabular-nums"}>
                                UNIT {uIdx + 1} &bull; {unit.allocatedHours}h
                              </span>
                              {unitDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : unitUnlocked ? (
                                <Clock className="w-3 h-3 text-amber-300 shrink-0" />
                              ) : (
                                <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] font-bold text-white line-clamp-2 leading-snug">
                              {unit.title.replace(/^Unit \d+:\s*/, "")}
                            </div>
                            <div className="text-[10px] text-slate-300/80 font-mono tabular-nums flex items-center justify-between gap-1">
                              <span>
                                {formatHoursShort(displayedUnitSec)} / {unit.allocatedHours}h
                              </span>
                              <span className="text-cyan-300/90">
                                {(unit.sessions || []).filter((s) =>
                                  (currentModuleProgress?.completedSessionIds || []).includes(s.sessionId)
                                ).length}
                                /{(unit.sessions || []).length} S
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* FULL 6-SESSION INTERACTIVE MULTI-HOUR UNIT WORKBOOK PLAYER */}
                  <UnitWorkbookPlayer
                    learnerId={learnerId}
                    programTitle={activeClassroomProgram.title}
                    currentModule={currentModule}
                    currentUnit={currentUnit}
                    moduleProgress={currentModuleProgress}
                    pendingSessionSeconds={pendingSessionSeconds}
                    onProgressUpdate={(updated) => setLmsProgress(updated)}
                    onActiveSessionChange={(sid) => {
                      activeSessionIdRef.current = sid;
                    }}
                    onShowToast={showToast}
                    onProceedToModuleLab={() => setClassroomSubTab("lab")}
                  />

                  {/* Key Concepts Box */}
                  <div className="glass-vision-card border-indigo-400/25 rounded-2xl p-4 sm:p-5 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Core Concepts Covered in Module {currentModule.moduleNumber}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentModule.keyConcepts.map((concept, i) => (
                        <div
                          key={i}
                          className="glass-vision-inset rounded-xl p-3 flex items-start gap-2 text-xs text-slate-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Structured Lesson Notes */}
                  <div className="glass-vision-card rounded-2xl p-5 space-y-3">
                    <h4 className="text-sm font-black text-white">
                      Interactive Lecture Notes &amp; Industry Architecture
                    </h4>
                    <div className="text-xs sm:text-sm text-slate-100/90 leading-relaxed whitespace-pre-line">
                      {currentModule.lessonNotes}
                    </div>
                  </div>

                  {/* Code / Case Walkthrough */}
                  <div className="glass-vision-inset border border-cyan-400/25 rounded-2xl overflow-hidden">
                    <div className="bg-white/[0.04] px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        </span>
                        <span className="text-xs font-black text-cyan-300 flex items-center gap-2 ml-1">
                          <Code className="w-4 h-4" />
                          {currentModule.codeOrCaseExample.title}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold bg-white/[0.06] text-indigo-200 px-2.5 py-0.5 rounded border border-white/10">
                        {currentModule.codeOrCaseExample.language}
                      </span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{currentModule.codeOrCaseExample.snippet}</code>
                    </pre>
                    <div className="p-4 bg-indigo-500/10 border-t border-white/10 text-xs text-indigo-100">
                      <strong className="text-amber-300">Engineering Explanation: </strong>
                      {currentModule.codeOrCaseExample.explanation}
                    </div>
                  </div>

                  {/* Interactive Arohi AI Professor Doubt Solver */}
                  <div className="glass-vision-card border-indigo-400/35 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            Ask Arohi AI Professor (24x7 Instant Doubt Clearing)
                          </h4>
                          <p className="text-[11px] text-indigo-200">
                            Ask any question about {currentModule.title} or generate MNC interview questions
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleAskArohiProfessor(
                            `Give me top 3 MNC interview questions and answers for ${currentModule.title}`
                          )
                        }
                        disabled={loadingTutorAI}
                        className="px-3 py-1.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-200 border border-amber-300/40 rounded-xl text-[11px] font-bold transition cursor-pointer"
                      >
                        ✨ Generate MNC Interview Q&amp;A
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={studentDoubtInput}
                        onChange={(e) => setStudentDoubtInput(e.target.value)}
                        placeholder={`Ask a doubt on Module ${currentModule.moduleNumber} (e.g., How is this used in production?)...`}
                        className="flex-1 glass-vision-inset rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={() => handleAskArohiProfessor()}
                        disabled={loadingTutorAI}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
                      >
                        {loadingTutorAI ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> Ask Arohi Professor
                          </>
                        )}
                      </button>
                    </div>

                    {tutorResponse && (
                      <div className="glass-vision-inset border-cyan-400/35 rounded-xl p-4 space-y-2.5 text-xs">
                        <p className="text-slate-100 leading-relaxed">{tutorResponse.explanation}</p>
                        {tutorResponse.keyTakeaways.length > 0 && (
                          <ul className="space-y-1 text-cyan-200 pl-4 list-disc">
                            {tutorResponse.keyTakeaways.map((kt, i) => (
                              <li key={i}>{kt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: HANDS-ON PRACTICE LAB (AUTHENTIC TODO SCAFFOLD + STRICT >=75% AI GRADING) */}
              {classroomSubTab === "lab" && (
                <div className="space-y-5">
                  <div className="glass-vision-card border-amber-400/35 rounded-2xl p-5 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                        Gate 2 • Authentic Hands-On Lab &bull; Module {currentModule.moduleNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border tabular-nums ${
                          currentGateStatus.gate2LabPassed
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
                            : "bg-amber-500/15 text-amber-300 border-amber-400/40"
                        }`}
                      >
                        {currentGateStatus.gate2LabPassed
                          ? `Gate 2 Passed (${currentModuleProgress?.labScore}/100) ✓`
                          : `Minimum ${PASSING_LAB_SCORE}/100 Required`}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white">
                      {currentModule.handsOnLab.title}
                    </h4>
                    <p className="text-xs text-slate-200/90 leading-relaxed">
                      {currentModule.handsOnLab.taskDescription}
                    </p>
                    <div className="text-[11px] text-cyan-200 glass-vision-inset p-3 rounded-xl">
                      <strong>Deliverable Criteria:</strong> {currentModule.handsOnLab.deliverableCriteria}
                    </div>
                  </div>

                  <div className="glass-vision-inset border border-white/15 rounded-2xl overflow-hidden">
                    <div className="bg-white/[0.04] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        </span>
                        <span className="font-bold text-slate-200 flex items-center gap-1.5 ml-1">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Student Lab Workspace (Write Real Code — Pre-Solved Solutions Disabled)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setLabSubmissionCode(createStudentLabScaffold(currentModule));
                          setLabValidationError(null);
                        }}
                        className="text-[11px] font-semibold text-cyan-300 hover:underline cursor-pointer shrink-0"
                      >
                        Reset TODO Scaffold
                      </button>
                    </div>
                    <textarea
                      rows={12}
                      value={labSubmissionCode}
                      onChange={(e) => {
                        setLabSubmissionCode(e.target.value);
                        if (labValidationError) setLabValidationError(null);
                      }}
                      className="w-full font-mono text-xs bg-transparent p-4 text-emerald-300 focus:outline-none"
                    />
                  </div>

                  {labValidationError && (
                    <div className="bg-rose-500/15 border border-rose-400/50 backdrop-blur-md rounded-2xl p-4 flex items-start gap-2.5 text-xs text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-100 block">Submission Blocked:</strong>
                        {labValidationError}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <button
                      onClick={handleEvaluateHandsOnLab}
                      disabled={evaluatingLab}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      {evaluatingLab ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Grading Implementation...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Submit Implementation for Strict AI Grading
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setClassroomSubTab("quiz")}
                      className="px-4 py-2.5 glass-vision-card text-cyan-200 border-cyan-300/35 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Timed Proctored Exam →</span>
                    </button>
                  </div>

                  {labResult && (
                    <div
                      className={`rounded-2xl p-5 space-y-3 border backdrop-blur-xl ${
                        labResult.passed
                          ? "bg-emerald-500/15 border-emerald-400/50"
                          : "bg-rose-500/15 border-rose-400/50"
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span
                          className={`text-xs font-black uppercase tracking-wider ${
                            labResult.passed ? "text-emerald-300" : "text-rose-300"
                          }`}
                        >
                          Arohi Technical Grader Verdict
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full font-black text-xs tabular-nums ${
                            labResult.passed
                              ? "bg-emerald-400 text-slate-950"
                              : "bg-rose-500 text-white"
                          }`}
                        >
                          Score: {labResult.score}/100 ({labResult.passed ? "PASSED GATE 2" : "NEEDS REVISION"})
                        </span>
                      </div>
                      <p className="text-xs text-slate-100 leading-relaxed">{labResult.feedback}</p>
                      {labResult.keyTakeaways && labResult.keyTakeaways.length > 0 && (
                        <ul className="space-y-1 text-xs text-slate-200 pl-4 list-disc">
                          {labResult.keyTakeaways.map((kt, idx) => (
                            <li key={idx}>{kt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 3: TIMED PROCTORED MODULE MASTERY EXAM (>=75% PASS GATE + 15-MIN COOLDOWN) */}
              {classroomSubTab === "quiz" && (
                <div className="space-y-5">
                  <div className="glass-vision-card border-indigo-400/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                        Gate 3 • Timed Proctored Assessment &bull; Min {PASSING_QUIZ_PERCENT}% Required
                      </span>
                      <h4 className="text-sm font-black text-white">
                        Module {currentModule.moduleNumber} Mastery Examination
                      </h4>
                      <p className="text-xs text-slate-300/85">
                        20-minute countdown timer. Failed attempts trigger a mandatory 15-minute review cooldown.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {examStarted && !quizSubmitted && (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono tabular-nums text-xs font-black flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {String(Math.floor(examSecondsLeft / 60)).padStart(2, "0")}:
                          {String(examSecondsLeft % 60).padStart(2, "0")}
                        </span>
                      )}
                      {currentGateStatus.gate3QuizPassed && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black tabular-nums">
                          Gate 3 Passed ({currentModuleProgress?.quizBestScorePercent}%) ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {!examStarted && !quizSubmitted ? (
                    <div className="glass-vision-card border-indigo-400/35 rounded-2xl p-6 text-center space-y-4">
                      <ShieldCheck className="w-10 h-10 text-cyan-300 mx-auto" />
                      <div className="space-y-1 max-w-lg mx-auto">
                        <h5 className="text-base font-black text-white">
                          Ready for Module {currentModule.moduleNumber} Proctored Examination?
                        </h5>
                        <p className="text-xs text-slate-200/90 leading-relaxed">
                          You have <strong>20 minutes</strong> to complete all{" "}
                          {currentModule.quizQuestions.length} graded questions. Scoring below{" "}
                          <strong>{PASSING_QUIZ_PERCENT}%</strong> locks retakes for 15 minutes so you can revise the curriculum units.
                        </p>
                      </div>

                      {currentModuleProgress?.quizCooldownUntil &&
                      currentModuleProgress.quizCooldownUntil > Date.now() ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-400/50 text-rose-200 text-xs font-bold">
                          <Clock className="w-4 h-4 text-rose-400" />
                          <span className="tabular-nums">
                            Mandatory Review Cooldown Active — Retake available in{" "}
                            {Math.ceil((currentModuleProgress.quizCooldownUntil - Date.now()) / 60000)} min
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setExamSecondsLeft(1200);
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            setQuizResultSummary(null);
                            setExamStarted(true);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer inline-flex items-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Start Timed Proctored Exam (20:00)</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {currentModule.quizQuestions.map((q, qIdx) => {
                          const selectedOpt = quizAnswers[qIdx];
                          return (
                            <div
                              key={qIdx}
                              className="glass-vision-card rounded-2xl p-4 sm:p-5 space-y-3"
                            >
                              <div className="text-xs sm:text-sm font-extrabold text-white">
                                Q{qIdx + 1}. {q.question}
                              </div>
                              <div className="space-y-2">
                                {q.options.map((opt, oIdx) => {
                                  const isChosen = selectedOpt === oIdx;
                                  const isCorrect = q.correctIndex === oIdx;
                                  let btnStyle =
                                    "glass-vision-inset text-slate-200 hover:border-cyan-400/50";
                                  if (quizSubmitted) {
                                    if (isCorrect) {
                                      btnStyle =
                                        "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold";
                                    } else if (isChosen && !isCorrect) {
                                      btnStyle = "bg-rose-500/20 border-rose-400 text-rose-200";
                                    }
                                  } else if (isChosen) {
                                    btnStyle = "bg-cyan-400/15 border-cyan-400 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]";
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => {
                                        if (!quizSubmitted) {
                                          setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                                        }
                                      }}
                                      className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                                    >
                                      <span>{opt}</span>
                                      {quizSubmitted && isCorrect && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {quizSubmitted && (
                                <div className="p-3 rounded-xl glass-vision-inset text-xs text-cyan-200">
                                  <strong className="text-amber-300">Explanation: </strong>
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {quizResultSummary && (
                        <div
                          className={`p-4 rounded-2xl border text-xs font-bold backdrop-blur-md ${
                            quizResultSummary.passed
                              ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200"
                              : "bg-rose-500/15 border-rose-400/50 text-rose-200"
                          }`}
                        >
                          {quizResultSummary.error ? (
                            <span>{quizResultSummary.error}</span>
                          ) : quizResultSummary.passed ? (
                            <span>
                              ✅ Exam Passed with {quizResultSummary.scorePercent}%! Gate 3 is now officially verified on the server.
                            </span>
                          ) : (
                            <span>
                              ⚠️ Exam Score: {quizResultSummary.scorePercent}% (Minimum {PASSING_QUIZ_PERCENT}% required). Review the explanations above — a 15-minute cooldown applies before your next attempt.
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                        {!quizSubmitted ? (
                          <button
                            onClick={handleSubmitModuleQuiz}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                          >
                            Submit Proctored Exam for Official Grade
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setExamStarted(false);
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizResultSummary(null);
                            }}
                            className="px-4 py-2.5 glass-vision-card text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Back to Exam Gate
                          </button>
                        )}

                        {activeModuleIndex < activeProgramModules.length - 1 && (
                          <button
                            onClick={() =>
                              handleLaunchClassroom(activeClassroomProgram.id, activeModuleIndex + 1)
                            }
                            className={`px-5 py-3 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer ${
                              currentGateStatus.allGatesPassed
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950"
                                : "glass-vision-inset text-slate-400"
                            }`}
                          >
                            {currentGateStatus.allGatesPassed ? (
                              <>
                                <span>Unlock Next: Module {currentModule.moduleNumber + 1}</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Complete All 4 Gates to Unlock M{currentModule.moduleNumber + 1}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SUB-TAB 4: 20% PHYSICAL TUTORING & MENTOR ATTENDANCE PIN VERIFICATION */}
              {classroomSubTab === "tutoring" && (
                <div className="space-y-5">
                  <div className="glass-vision-card border-indigo-400/35 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                        Gate 4 • 20% Physical Tutoring Attendance ({currentGateStatus.physicalRequiredHours}h Required)
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border tabular-nums ${
                          currentGateStatus.gate4PhysicalVerified
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
                            : "bg-amber-500/15 text-amber-300 border-amber-400/40"
                        }`}
                      >
                        {currentGateStatus.gate4PhysicalVerified
                          ? `${currentGateStatus.physicalCreditedHours}h Verified ✓`
                          : "Mentor PIN Verification Required"}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Book &amp; Verify Your 20% Physical Classroom / Mentor Lab ({currentGateStatus.physicalRequiredHours} Hours)
                    </h4>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      Booking a slot reserves your seat only. Your {currentGateStatus.physicalRequiredHours} physical hours are officially credited to Gate 4 ONLY after attending the live/in-person mentor lab and entering your faculty&apos;s 6-digit Attendance PIN.
                    </p>
                  </div>

                  <form onSubmit={handleBookPhysicalTutoring} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-200 mb-1">
                        Select Physical Tutoring Hub / Campus Center
                      </label>
                      <select
                        value={tutoringCenter}
                        onChange={(e) => setTutoringCenter(e.target.value)}
                        className="w-full glass-vision-inset rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option className="bg-slate-900" value="Bhubaneswar Hub (Saheed Nagar / Infocity)">
                          Bhubaneswar Hub (Saheed Nagar / Infocity)
                        </option>
                        <option className="bg-slate-900" value="Cuttack Regional Mentor Center">Cuttack Regional Mentor Center</option>
                        <option className="bg-slate-900" value="Rourkela Technical Campus Hub">Rourkela Technical Campus Hub</option>
                        <option className="bg-slate-900" value="Berhampur University Zone Hub">Berhampur University Zone Hub</option>
                        <option className="bg-slate-900" value="Sambalpur Western Odisha Hub">Sambalpur Western Odisha Hub</option>
                        <option className="bg-slate-900" value="Live 1-on-1 Hybrid Mentor Room (Pan-India)">
                          Live 1-on-1 Hybrid Mentor Room (Pan-India)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-200 mb-1">
                        Preferred Weekly 20% Lab Batch Slot
                      </label>
                      <select
                        value={tutoringSlot}
                        onChange={(e) => setTutoringSlot(e.target.value)}
                        className="w-full glass-vision-inset rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option className="bg-slate-900" value="Saturday Morning (10:00 AM – 1:00 PM IST)">
                          Saturday Morning (10:00 AM – 1:00 PM IST)
                        </option>
                        <option className="bg-slate-900" value="Sunday Afternoon (2:00 PM – 5:00 PM IST)">
                          Sunday Afternoon (2:00 PM – 5:00 PM IST)
                        </option>
                        <option className="bg-slate-900" value="Wednesday Evening Lab (6:30 PM – 8:30 PM IST)">
                          Wednesday Evening Lab (6:30 PM – 8:30 PM IST)
                        </option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={bookingPhysical}
                        className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        {bookingPhysical ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Reserving Lab Seat...
                          </>
                        ) : (
                          <span>
                            Reserve 20% Physical Lab Seat for Module {currentModule.moduleNumber} (
                            {currentGateStatus.physicalRequiredHours}h)
                          </span>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Server-Tracked Physical Booking & 6-Digit Mentor Attendance PIN Verification */}
                  {currentModuleProgress?.physicalBookingId && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="glass-vision-card border-indigo-400/35 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-black text-white font-mono">
                            Booking ID: {currentModuleProgress.physicalBookingId}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            {currentModuleProgress.physicalCenter} &bull; {currentModuleProgress.physicalSlot}
                          </div>
                        </div>
                        {currentGateStatus.gate4PhysicalVerified ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-black shrink-0">
                            Attendance Verified ({currentGateStatus.physicalCreditedHours}h) ✓
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black shrink-0">
                            Pending Mentor PIN Verification
                          </span>
                        )}
                      </div>

                      {!currentGateStatus.gate4PhysicalVerified && (
                        <form
                          onSubmit={handleVerifyMentorPin}
                          className="glass-vision-card border-cyan-400/35 rounded-2xl p-5 space-y-3"
                        >
                          <div className="flex items-center gap-2 text-xs font-black text-cyan-300">
                            <KeyRound className="w-4 h-4 text-amber-300" />
                            <span>Enter 6-Digit Mentor Attendance PIN (Issued at Center / Live Session)</span>
                          </div>
                          <p className="text-[11px] text-slate-300/85">
                            Your Recruits.org.in faculty mentor will share your unique 6-digit verification PIN upon completing your {currentGateStatus.physicalRequiredHours}-hour architecture &amp; lab review.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={mentorPinInput}
                              onChange={(e) => setMentorPinInput(e.target.value.replace(/\D/g, ""))}
                              placeholder="Enter 6-digit Mentor PIN (e.g., 482910)"
                              className="flex-1 glass-vision-inset rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-cyan-400"
                            />
                            <button
                              type="submit"
                              disabled={verifyingPin || mentorPinInput.length < 6}
                              className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-lg"
                            >
                              {verifyingPin ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-4 h-4" /> Verify Attendance PIN
                                </>
                              )}
                            </button>
                          </div>
                          {pinFeedback && (
                            <div
                              className={`p-3 rounded-xl border text-xs font-semibold backdrop-blur-md ${
                                pinFeedback.ok
                                  ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200"
                                  : "bg-rose-500/15 border-rose-400/50 text-rose-200"
                              }`}
                            >
                              {pinFeedback.text}
                            </div>
                          )}
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: FOR COLLEGES & UNIVERSITIES (2026-27 INSTITUTIONAL PARTNER HUB)
         ===================================================================== */}
      {activeTab === "institutions" && (
        <div className="space-y-8">
          {/* Executive University MoU & Campus Placement Megadrive Photography Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-indigo-500/40 shadow-xl bg-slate-950">
              <img
                src={BRANDING_IMAGES.universityMouPartnership}
                alt="University Deans and Corporate Leaders signing Campus Talent Hub MoU"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  2026–27 Academic Year Institutional MoU
                </span>
                <h4 className="text-base sm:text-lg font-black leading-snug">
                  Strategic Skilling &amp; Placement Partnerships for Colleges &amp; Universities
                </h4>
              </div>
            </div>

            <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-indigo-500/40 shadow-xl bg-slate-950">
              <img
                src={BRANDING_IMAGES.campusPlacementMegadrive}
                alt="Grand Campus Placement Megadrive and MNC Recruitment Expo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider block">
                  100% Placement Assistance Across 10 Major Sectors
                </span>
                <h4 className="text-base sm:text-lg font-black leading-snug">
                  Bring Top MNC Recruitment Drives &amp; Industry Mentors Directly to Your Campus
                </h4>
              </div>
            </div>
          </div>

          <div className="apple-mesh-dark border border-white/15 rounded-[2rem] p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start shadow-2xl">
            {/* Left 6 Cols: Campus Value Proposition & 10 In-Demand Campus Programs */}
            <div className="lg:col-span-6 glass-vision rounded-3xl p-6 sm:p-8 text-white space-y-6">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-300/35 text-amber-200 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> For Colleges &amp; Universities
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Turn Your Campus into a{" "}
                  <span className="text-cyan-300">Future-Ready Talent Hub</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200/90">
                  Industry-Aligned Training &bull; Real-World Skills &bull; Job-Ready Graduates. Partner with{" "}
                  <strong className="text-amber-300">Recruits.org.in</strong> (Quench Research Labs Private Limited) to deliver real career outcomes for your students.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-purple-200 bg-purple-500/15 border border-purple-400/30 px-4 py-2 rounded-xl">
                  Offer In-Demand Programs on Your Campus (Select for 2026–27)
                </h4>

                <div className="space-y-2">
                  {OFFICIAL_10_TRAINING_PROGRAMS.map((prog) => {
                    const isSelected = selectedCampusPrograms.includes(prog.title);
                    return (
                      <div
                        key={prog.id}
                        onClick={() => toggleCampusProgramSelection(prog.title)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-cyan-400/15 border-cyan-400/70 text-white shadow-md"
                            : "glass-vision-card text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? "bg-cyan-400 border-cyan-300 text-slate-950"
                                : "border-white/25 bg-white/5"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-extrabold">{prog.title}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-300 shrink-0 tabular-nums">
                          {prog.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Limited Slots Banner matching Poster 1 & 3 */}
              <div className="p-4 rounded-2xl glass-vision-card border-fuchsia-400/35 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                    Be an Early Partner
                  </span>
                  <h5 className="text-sm font-black text-white">
                    Limited Institution Partnership Slots for 2026–27 Academic Year
                  </h5>
                  <p className="text-[11px] text-purple-200">
                    Includes Campus Co-Branded Center of Excellence + Arohi AI Placement Portal.
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-amber-300 shrink-0" />
              </div>
            </div>

            {/* Right 6 Cols: 2026-27 Institutional Partnership Reservation Form */}
            <div className="lg:col-span-6 glass-vision border-amber-400/35 rounded-3xl p-6 sm:p-8 text-white space-y-5">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  Institutional MoU &amp; Slot Booking (2026–27)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                  Partner with Recruits.org.in
                </h3>
                <p className="text-xs text-slate-300/85">
                  For Vice-Chancellors, Principals, Deans, Directors &amp; Training and Placement Officers (TPOs).
                </p>
              </div>

              <form onSubmit={handleCampusPartnershipSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    College / University / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. Kalinga Institute / CET Bhubaneswar / Ravenshaw University"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Institution Type</label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Engineering / Technical College">Engineering / Technical College</option>
                      <option value="State / Private University">State / Private University</option>
                      <option value="Management / MBA Institute">Management / MBA Institute</option>
                      <option value="Degree / Science & Commerce College">Degree / Science &amp; Commerce College</option>
                      <option value="Autonomous / Polytechnic Institute">Autonomous / Polytechnic Institute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Target Student Batch Size</label>
                    <select
                      value={studentBatchSize}
                      onChange={(e) => setStudentBatchSize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="100 - 250 Students">100 - 250 Students</option>
                      <option value="250 - 500 Students">250 - 500 Students</option>
                      <option value="500 - 1,500 Students">500 - 1,500 Students</option>
                      <option value="1,500+ Campus-Wide">1,500+ Campus-Wide</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactPersonName}
                      onChange={(e) => setContactPersonName(e.target.value)}
                      placeholder="e.g. Dr. S. K. Mohanty"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Head - Training & Placement"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="tpo@college.edu.in"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={officialPhone}
                      onChange={(e) => setOfficialPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Campus City &amp; State</label>
                    <input
                      type="text"
                      value={campusCityState}
                      onChange={(e) => setCampusCityState(e.target.value)}
                      placeholder="Bhubaneswar, Odisha"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-cyan-300 block mb-1">
                    Selected Campus Programs ({selectedCampusPrograms.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCampusPrograms.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] bg-indigo-950 text-indigo-200 border border-indigo-500/30 px-2 py-0.5 rounded-md font-semibold"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingPartnership}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-fuchsia-600 hover:from-amber-300 hover:to-fuchsia-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingPartnership ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Reserving 2026–27 Campus Partnership Slot...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Reserve 2026–27 Institution Partnership Slot »
                    </>
                  )}
                </button>
              </form>

              {partnerships.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                    Recently Reserved Campus Partnership Slots ({partnerships.length})
                  </span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {partnerships.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-white font-bold block">{p.institutionName}</strong>
                          <span className="text-[10px] text-slate-400">
                            {p.campusCityState} &bull; {p.studentBatchSize}
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: OFFICIAL POSTERS GALLERY & AI COURSE RECOMMENDER
         ===================================================================== */}
      {activeTab === "posters_ai" && (
        <div className="apple-mesh-dark border border-white/15 rounded-[2rem] p-4 sm:p-6 space-y-6 shadow-2xl">
          {/* Official Posters Showcase */}
          <div className="glass-vision rounded-3xl p-6 sm:p-8 text-white space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  Official Campaign Collaterals • Quench Research Labs Pvt. Ltd.
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                  Recruits.org.in Official Training &amp; Institutional Posters
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {OFFICIAL_POSTERS.map((poster) => (
                <div
                  key={poster.id}
                  onClick={() => setLightboxPoster(poster)}
                  className="group glass-vision-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-950/80 relative">
                    <img
                      src={poster.imageUrl}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition">
                      {poster.title}
                    </h4>
                    <p className="text-[11px] text-slate-300/85">{poster.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized AI Learning Path Generator */}
          <div className="glass-vision rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 btn-apple-primary rounded-2xl text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Arohi AI Custom Learning Path Advisor</h3>
                <p className="text-xs text-slate-300/85">
                  Enter your career goal to get AI-curated modules mapped to your profile ({memory.targetRole})
                </p>
              </div>
            </div>

            <div className="glass-vision-inset rounded-2xl p-4">
              <label className="text-xs font-semibold text-slate-200 mb-1 block">Primary Learning Goal</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              id="btn-get-learning-recs"
              onClick={handleGetRecommendations}
              disabled={loadingAI}
              className="w-full py-3 btn-apple-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Arohi AI Curating High-Impact Learning Modules...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" /> Curate Tailored Learning Recommendations
                </>
              )}
            </button>

            {recommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="glass-vision-card rounded-2xl p-5 text-white space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-200 border border-indigo-400/35 px-2.5 py-0.5 rounded-md font-bold uppercase">
                          {rec.type}
                        </span>
                        <span className="text-xs text-slate-300">{rec.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                      <p className="text-xs text-cyan-300 font-semibold">{rec.provider}</p>
                      <p className="text-xs text-slate-200/90">{rec.reason}</p>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        Level: <strong className="text-white">{rec.level}</strong>
                      </span>
                      <button
                        onClick={() => setActiveTab("programs")}
                        className="text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Match Official Program <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENT ENROLLMENT MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="apple-mesh-dark border border-cyan-300/40 rounded-[2rem] p-6 sm:p-8 max-w-lg w-full text-white space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                Program #{selectedProgram.number} &bull; {selectedProgram.duration}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">{selectedProgram.title}</h3>
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-purple-600 text-white text-xs font-black px-3 py-0.5 rounded-lg">
                  Fee: {selectedProgram.feeINR}
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  100% Placement Assistance Included
                </span>
              </div>
            </div>

            <form onSubmit={handleStudentEnrollSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">College / City / Organization</label>
                <input
                  type="text"
                  value={studentCollegeOrCity}
                  onChange={(e) => setStudentCollegeOrCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Preferred Tutoring Format</label>
                <select
                  value={learningModePref}
                  onChange={(e) => setLearningModePref(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Hybrid (80% Digital + 20% Physical Tutoring)">
                    Hybrid (80% Digital + 20% Physical Tutoring)
                  </option>
                  <option value="100% Live Online + Mentorship">100% Live Online + Mentorship</option>
                  <option value="On-Campus College Batch">On-Campus College Batch</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={enrolling}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming Enrollment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Confirm Enrollment &amp; Get Brochure
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POSTER LIGHTBOX MODAL */}
      {lightboxPoster && (
        <div
          onClick={() => setLightboxPoster(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full glass-vision rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 text-white">
              <div>
                <h4 className="text-sm font-black">{lightboxPoster.title}</h4>
                <p className="text-xs text-slate-300">{lightboxPoster.subtitle}</p>
              </div>
              <button
                onClick={() => setLightboxPoster(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto bg-slate-950/60 flex justify-center p-3">
              <img
                src={lightboxPoster.imageUrl}
                alt={lightboxPoster.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* STRICTLY AUDITED COURSE COMPLETION CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div
          onClick={() => setShowCertificateModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-2xl w-full apple-mesh-dark border-2 rounded-[2rem] p-6 sm:p-9 text-white shadow-2xl relative space-y-6 ${
              programAudit.allModulesVerified ? "border-amber-400/75 text-center" : "border-white/20"
            }`}
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!programAudit.allModulesVerified ? (
              <div className="space-y-5">
                <div className="space-y-2 text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 text-[11px] font-black uppercase tracking-widest">
                    <Lock className="w-3.5 h-3.5" /> Official Curriculum Audit Gate — Certificate Locked
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeClassroomProgram.title}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Recruits.org.in issues verified certifications ONLY after 100% of required curriculum hours and all 4 verification gates are audited on our server across all {programAudit.totalModulesCount} modules.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Total Verified Curriculum Hours
                    </div>
                    <div className="text-lg font-black text-cyan-300 font-mono">
                      {programAudit.totalVerifiedHours}h / {programAudit.totalRequiredHours}h
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Fully Verified Modules
                    </div>
                    <div className="text-lg font-black text-amber-300 font-mono">
                      {programAudit.completedModulesCount} / {programAudit.totalModulesCount} Modules
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {programAudit.perModule.map(({ mod, gate }) => (
                    <div
                      key={mod.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-extrabold text-white">
                          M{mod.moduleNumber}: {mod.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Hours: {gate.totalLoggedHours}h / {gate.totalHours}h
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            gate.gate1TimeMet
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          }`}
                        >
                          Time {gate.gate1TimeMet ? "✓" : "✗"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            gate.gate2LabPassed
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          }`}
                        >
                          Lab {gate.gate2LabPassed ? "✓" : "✗"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            gate.gate3QuizPassed
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          }`}
                        >
                          Exam {gate.gate3QuizPassed ? "✓" : "✗"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            gate.gate4PhysicalVerified
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          }`}
                        >
                          PIN {gate.gate4PhysicalVerified ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-indigo-500/30 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Complete remaining hours &amp; gates to unlock Print / PDF issuance.
                  </span>
                  <button
                    disabled
                    className="px-4 py-2 bg-slate-800 text-slate-500 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" /> Print Locked
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[11px] font-black uppercase tracking-widest">
                    <Award className="w-4 h-4" /> Server-Audited Official Certification
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-1">
                    Recruits.org.in
                  </h3>
                  <p className="text-xs font-bold text-indigo-200">
                    An Initiative of Quench Research Labs Private Limited &bull; Powered by arohiai.com
                  </p>
                </div>

                <div className="py-5 px-4 bg-slate-950/70 border border-indigo-400/30 rounded-2xl space-y-2">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block">
                    This is to certify that
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300">
                    {studentName || memory.personalInfo?.fullName || "Verified Candidate Scholar"}
                  </div>
                  <span className="text-xs text-slate-300 block">
                    has officially completed 100% ({programAudit.totalVerifiedHours} Verified Hours) of the Industry-Ready Training Program in
                  </span>
                  <div className="text-lg sm:text-xl font-black text-cyan-300 pt-1">
                    {activeClassroomProgram.title}
                  </div>
                  <p className="text-[11px] text-indigo-200">
                    Duration: {activeClassroomProgram.duration} &bull; 80% Verified Digital + 20% Mentor-PIN Physical Labs &bull; All 5 Modules Passed
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {activeClassroomProgram.toolsCovered.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] bg-indigo-950 text-indigo-200 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-300">
                  <div>
                    Verification ID: <strong className="text-white">QRL-REC-{activeClassroomProgram.number}026-VERIFIED</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
