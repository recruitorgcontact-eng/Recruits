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
} from "lucide-react";
import { CareerMemory, CourseRecommendation } from "../../types";
import { OFFICIAL_COURSE_MODULES, CourseModuleItem } from "../../data/officialCourseModules";
import { speakText, stopSpeech } from "../../utils/speech";
import { CompanyBrandLogo, FEATURED_MNC_BRANDS } from "../CompanyBrandLogo";

interface LearningAdvisorEngineProps {
  memory: CareerMemory;
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

export const LearningAdvisorEngine: React.FC<LearningAdvisorEngineProps> = ({ memory }) => {
  const [activeTab, setActiveTab] = useState<"programs" | "classroom" | "institutions" | "posters_ai">("programs");

  // Interactive LMS Classroom State (Ready Immediately for all 10 Courses & 50 Modules)
  const [activeClassroomProgramId, setActiveClassroomProgramId] = useState<string>("prog-01-ds-ai");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [classroomSubTab, setClassroomSubTab] = useState<"lesson" | "lab" | "quiz" | "tutoring">("lesson");
  const [completedModulesMap, setCompletedModulesMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("arohi_lms_completed_modules_v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Classroom Voice Narration & AI Professor State
  const [isSpeakingLesson, setIsSpeakingLesson] = useState<boolean>(false);
  const [studentDoubtInput, setStudentDoubtInput] = useState<string>("");
  const [loadingTutorAI, setLoadingTutorAI] = useState<boolean>(false);
  const [tutorResponse, setTutorResponse] = useState<{ explanation: string; keyTakeaways: string[] } | null>(null);

  // Classroom Hands-on Lab State
  const [labSubmissionCode, setLabSubmissionCode] = useState<string>("");
  const [evaluatingLab, setEvaluatingLab] = useState<boolean>(false);
  const [labResult, setLabResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    keyTakeaways: string[];
  } | null>(null);

  // Classroom Module Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // 20% Physical Tutoring Session Booking State
  const [tutoringCenter, setTutoringCenter] = useState<string>("Bhubaneswar Hub (Saheed Nagar / Infocity)");
  const [tutoringSlot, setTutoringSlot] = useState<string>("Saturday Morning (10:00 AM – 1:00 PM IST)");
  const [bookedTutoringSessions, setBookedTutoringSessions] = useState<
    { id: string; programTitle: string; moduleTitle: string; center: string; slot: string }[]
  >([]);

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

  // Reset per-module interactive state when switching program or module
  useEffect(() => {
    if (currentModule) {
      setLabSubmissionCode(currentModule.handsOnLab.starterTemplate);
      setLabResult(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setTutorResponse(null);
      setStudentDoubtInput("");
      stopSpeech();
      setIsSpeakingLesson(false);
    }
  }, [activeClassroomProgramId, activeModuleIndex]);

  const markModuleCompleted = (moduleId: string) => {
    setCompletedModulesMap((prev) => {
      const updated = { ...prev, [moduleId]: true };
      try {
        localStorage.setItem("arohi_lms_completed_modules_v1", JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      return updated;
    });
  };

  const handleLaunchInstantClassroom = (programId: string, moduleIdx = 0) => {
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
    const narrationText = `Welcome to Module ${currentModule.moduleNumber}: ${currentModule.title}, part of ${activeClassroomProgram.title}. ${currentModule.summary}. ${currentModule.lessonNotes}`;
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
    setEvaluatingLab(true);
    try {
      const res = await fetch("/api/ai/course-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "evaluate_lab",
          programTitle: activeClassroomProgram.title,
          moduleTitle: currentModule.title,
          labTask: currentModule.handsOnLab.taskDescription,
          starterTemplate: currentModule.handsOnLab.starterTemplate,
          studentInput: labSubmissionCode,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLabResult(data);
        if (data.passed !== false) {
          markModuleCompleted(currentModule.id);
          showToast(
            `✅ Hands-On Lab Passed (${data.score || 92}/100)! Module ${currentModule.moduleNumber} marked complete.`
          );
        }
      }
    } catch (err) {
      console.error("Lab grading error:", err);
    } finally {
      setEvaluatingLab(false);
    }
  };

  const handleSubmitModuleQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    currentModule.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correctCount++;
    });
    markModuleCompleted(currentModule.id);
    showToast(
      `🎯 Module ${currentModule.moduleNumber} Quiz Completed (${correctCount}/${currentModule.quizQuestions.length} Correct)! Progress saved automatically.`
    );
  };

  const handleBookPhysicalTutoring = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      id: `tut-${Date.now()}`,
      programTitle: activeClassroomProgram.title,
      moduleTitle: `Module ${currentModule.moduleNumber}: ${currentModule.title}`,
      center: tutoringCenter,
      slot: tutoringSlot,
    };
    setBookedTutoringSessions((prev) => [newBooking, ...prev]);
    showToast(
      `🏫 20% Physical Tutoring Lab Session Confirmed at ${tutoringCenter} (${tutoringSlot})!`
    );
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
        handleLaunchInstantClassroom(enrolledProgId, 0);
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070b24] via-[#131842] to-[#1e1145] border border-indigo-500/40 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-indigo-500/30 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase tracking-widest">
                LEARN • WORK • GROW
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold">
                100% Placement Assistance in Top MNCs
              </span>
              <span className="text-[11px] text-indigo-200 font-semibold">
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
          <div className="bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-slate-950/90 border-2 border-amber-400/60 rounded-3xl px-6 py-4 text-center shrink-0 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight leading-none">
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
                className="bg-slate-950/60 border border-indigo-400/25 rounded-2xl p-3 flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shrink-0">
                  <PIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold text-white leading-tight">
                    {pillar.title}
                  </div>
                  <div className="text-[10px] text-indigo-300">{pillar.sub}</div>
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
              sub: "Interactive AI LMS + Faculty Lab Mentorship",
              img: "/src/assets/images/hybrid_classroom_mentorship_1794910028151.jpg",
              action: () => setActiveTab("classroom"),
              cta: "Open Instant Classroom →",
            },
            {
              title: "AI, Data Science & Cloud Innovation Labs",
              sub: "Real Production Projects Co-Designed with MNCs",
              img: "/src/assets/images/track_it_cloud_ai_lab_1794910024883.jpg",
              action: () => setActiveTab("programs"),
              cta: "Explore 10 Programs →",
            },
            {
              title: "100% Campus Placement & Offer Drives",
              sub: "Turn Your Institution into a Talent Powerhouse",
              img: "/src/assets/images/hero_career_graduates_1794910021124.jpg",
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
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-6">
          <button
            onClick={() => setActiveTab("programs")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
              activeTab === "programs"
                ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 border-cyan-300 shadow-lg"
                : "bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>10 Official Training Programs &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab("classroom")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
              activeTab === "classroom"
                ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 border-emerald-300 shadow-lg"
                : "bg-slate-900/80 text-emerald-300 border-emerald-500/40 hover:bg-slate-800"
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Interactive LMS Classroom (Start Learning Now • 50 Modules)</span>
          </button>

          <button
            onClick={() => setActiveTab("institutions")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
              activeTab === "institutions"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 shadow-lg"
                : "bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>For Colleges &amp; Universities (2026–27 Partner Hub)</span>
          </button>

          <button
            onClick={() => setActiveTab("posters_ai")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
              activeTab === "posters_ai"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-400 shadow-lg"
                : "bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Official Brochures &amp; AI Course Advisor</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: 10 OFFICIAL TRAINING PROGRAMS & PRICING CATALOG
         ===================================================================== */}
      {activeTab === "programs" && (
        <div className="space-y-8">
          <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                  Recruits.org.in Official Curriculum • Instant Self-Paced + Mentor LMS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Our 10 Industry-Ready Training Programs (All Modules Ready Immediately)
                </h3>
                <p className="text-xs text-slate-400">
                  Click <strong className="text-emerald-300">&ldquo;Start Learning Now&rdquo;</strong> on any course below to jump straight into Module 1 with interactive notes, code labs, Arohi voice professor &amp; quizzes!
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
                const completedCount = progModules.filter((m) => completedModulesMap[m.id]).length;
                return (
                  <div
                    key={prog.id}
                    className="group bg-gradient-to-r from-slate-900 via-[#111636] to-slate-900 border border-indigo-500/30 hover:border-cyan-400/70 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Number Pill */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 border border-cyan-300/50 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                            {prog.number}
                          </div>
                          {/* Icon Box */}
                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-indigo-500/40 flex items-center justify-center shrink-0">
                            {renderProgramIcon(prog.iconType)}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
                              {prog.category}
                            </span>
                            <h4 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-200 transition">
                              {prog.title}
                            </h4>
                          </div>
                        </div>

                        {/* Price Badge Matching Poster Purple Pill */}
                        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-3.5 py-1.5 rounded-xl border border-purple-300/40 text-right shrink-0 shadow-md">
                          <span className="text-sm sm:text-base font-black block leading-none">
                            {prog.feeINR}
                          </span>
                          <span className="text-[9px] text-purple-100 font-semibold">
                            Full Program
                          </span>
                        </div>
                      </div>

                      {/* Duration & Delivery Badges */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="inline-flex items-center gap-1 bg-slate-950 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-lg font-bold">
                          <Calendar className="w-3 h-3" /> {prog.duration}
                        </span>
                        <span className="bg-indigo-950/80 text-indigo-200 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg font-semibold">
                          80% Digital + 20% Physical
                        </span>
                        <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg font-semibold">
                          {completedCount}/{progModules.length} Modules Completed
                        </span>
                      </div>

                      {/* Key Highlights */}
                      <ul className="space-y-1 text-xs text-slate-300 pl-1">
                        {prog.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Interactive 5-Module Quick Jump Pills */}
                      <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          <span>5 Instant Modules (Click any module to start immediately)</span>
                          <span className="text-emerald-400">Ready Now</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {progModules.map((mod, mIdx) => {
                            const isDone = !!completedModulesMap[mod.id];
                            return (
                              <button
                                key={mod.id}
                                onClick={() => handleLaunchInstantClassroom(prog.id, mIdx)}
                                className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between gap-1.5 transition cursor-pointer ${
                                  isDone
                                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                                    : "bg-slate-900 hover:bg-indigo-950/80 border-slate-800 hover:border-cyan-400/50 text-slate-200"
                                }`}
                              >
                                <span className="truncate">
                                  <strong className="text-cyan-400">M{mod.moduleNumber}:</strong> {mod.title}
                                </span>
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Play className="w-3 h-3 text-cyan-300 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Tools & Instant Start Learning + Enroll CTAs */}
                    <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        {prog.toolsCovered.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLaunchInstantClassroom(prog.id, 0)}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Learning Now</span>
                        </button>

                        <button
                          onClick={() => setSelectedProgram(prog)}
                          className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-400/40 font-extrabold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
                        >
                          <span>Enroll Batch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10 MAJOR PLACEMENT SECTORS GRID FROM POSTERS */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-xl">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                100% Placement Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                Support for Placements in Top MNCs Across Major Sectors
              </h3>
              <p className="text-xs text-slate-400">
                Learn In-Demand Skills. Get Placed. Build Your Career on Recruits.org.in.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {PLACEMENT_SECTORS.map((sec) => {
                const SIcon = sec.icon;
                return (
                  <div
                    key={sec.name}
                    className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition"
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
            <div className="pt-4 border-t border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Featured Top MNCs, Banks &amp; Carriers Hiring Across Our 10 Training Programs:
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Tata • Infosys • Wipro • HDFC Bank • Reliance • Tech Mahindra &amp; 12+ More
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {FEATURED_MNC_BRANDS.map((brand) => (
                  <div
                    key={brand.name}
                    className="bg-white rounded-2xl px-3 py-2 flex flex-col items-center justify-center gap-1 shadow-sm border border-slate-200 h-14"
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
        <div className="space-y-6">
          {/* Course Switcher Bar (All 10 Official Programs Ready Immediately) */}
          <div className="bg-slate-950 border border-indigo-500/40 rounded-3xl p-4 sm:p-5 text-white space-y-3 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  Instant LMS Active • Zero Wait
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Switch Course Anytime (All 10 Programs &amp; 50 Modules Unlocked):
                </span>
              </div>
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View / Print Course Certificate</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {OFFICIAL_10_TRAINING_PROGRAMS.map((prog) => {
                const isSelected = prog.id === activeClassroomProgram.id;
                const mods = OFFICIAL_COURSE_MODULES[prog.id] || [];
                const doneCount = mods.filter((m) => completedModulesMap[m.id]).length;
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setActiveClassroomProgramId(prog.id);
                      setActiveModuleIndex(0);
                      setClassroomSubTab("lesson");
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 border-cyan-300 shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px] font-black">
                      {prog.number}
                    </span>
                    <span>{prog.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-slate-950 text-cyan-300" : "bg-slate-800 text-emerald-300"
                      }`}
                    >
                      {doneCount}/{mods.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Classroom Grid: Left Sidebar (5 Modules + Progress) & Right Lesson Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 4 COLS: MODULE CURRICULUM TREE & PROGRESS */}
            <div className="lg:col-span-4 bg-slate-950 border border-indigo-500/40 rounded-3xl p-5 text-white space-y-5 shadow-2xl">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  Program #{activeClassroomProgram.number} &bull; {activeClassroomProgram.duration}
                </span>
                <h3 className="text-lg font-black text-white leading-snug">
                  {activeClassroomProgram.title}
                </h3>

                {/* Progress Bar */}
                {(() => {
                  const done = activeProgramModules.filter((m) => completedModulesMap[m.id]).length;
                  const pct = Math.round((done / Math.max(1, activeProgramModules.length)) * 100);
                  return (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Course Completion</span>
                        <span className="text-emerald-400 font-black">
                          {done}/{activeProgramModules.length} Modules ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                          style={{ width: `${Math.max(6, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 5 Module List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 block">
                  Course Modules (Click any module to study)
                </span>
                {activeProgramModules.map((mod, idx) => {
                  const isCurrent = idx === activeModuleIndex;
                  const isCompleted = !!completedModulesMap[mod.id];
                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        setActiveModuleIndex(idx);
                        setClassroomSubTab("lesson");
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                        isCurrent
                          ? "bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-cyan-400 shadow-lg"
                          : "bg-slate-900/70 hover:bg-slate-900 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          Module {mod.moduleNumber} &bull; {mod.durationHours}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-300 font-bold">In Progress</span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{mod.summary}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Certificate & Enrollment Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/90 to-purple-950/80 border border-indigo-400/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-300 uppercase">
                    100% Placement Pipeline
                  </span>
                  <span className="text-xs font-black text-white">{activeClassroomProgram.feeINR}</span>
                </div>
                <p className="text-[11px] text-indigo-100 leading-relaxed">
                  Complete all 5 modules to unlock priority MNC interview referrals across 10 major sectors.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" /> Certificate
                  </button>
                  <button
                    onClick={() => setSelectedProgram(activeClassroomProgram)}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-400/40 font-bold text-[11px] rounded-xl transition cursor-pointer"
                  >
                    Register Batch
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT 8 COLS: INTERACTIVE LESSON, HANDS-ON LAB, QUIZ & 20% PHYSICAL TUTORING */}
            <div className="lg:col-span-8 bg-slate-950 border border-indigo-500/40 rounded-3xl p-5 sm:p-7 text-white space-y-6 shadow-2xl">
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase">
                      Module {currentModule.moduleNumber} of {activeProgramModules.length}
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {currentModule.durationHours} ({currentModule.deliverySplit})
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {currentModule.title}
                  </h3>
                </div>

                {/* Voice Narration Button */}
                <button
                  onClick={handleSpeakCurrentLesson}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shrink-0 transition cursor-pointer border ${
                    isSpeakingLesson
                      ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400"
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "lesson", label: "1. Study Notes & Code", icon: BookOpen },
                  { id: "lab", label: "2. Hands-On Practice Lab", icon: Terminal },
                  { id: "quiz", label: "3. Module Mastery Quiz", icon: HelpCircle },
                  { id: "tutoring", label: "4. 20% Physical Tutoring", icon: MapPin },
                ].map((tab) => {
                  const TIcon = tab.icon;
                  const active = classroomSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setClassroomSubTab(tab.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                        active
                          ? "bg-cyan-400 text-slate-950 border-cyan-300 shadow-md font-black"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                      }`}
                    >
                      <TIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUB-TAB 1: STUDY NOTES, CODE WALKTHROUGH & AI PROFESSOR */}
              {classroomSubTab === "lesson" && (
                <div className="space-y-6">
                  {/* Key Concepts Box */}
                  <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Core Concepts Covered in Module {currentModule.moduleNumber}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentModule.keyConcepts.map((concept, i) => (
                        <div
                          key={i}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Structured Lesson Notes */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h4 className="text-sm font-black text-white">
                      Interactive Lecture Notes &amp; Industry Architecture
                    </h4>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {currentModule.lessonNotes}
                    </div>
                  </div>

                  {/* Code / Case Walkthrough */}
                  <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden">
                    <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-300 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        {currentModule.codeOrCaseExample.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-500/30">
                        {currentModule.codeOrCaseExample.language}
                      </span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950/90 overflow-x-auto leading-relaxed">
                      <code>{currentModule.codeOrCaseExample.snippet}</code>
                    </pre>
                    <div className="p-4 bg-indigo-950/30 border-t border-slate-800 text-xs text-indigo-200">
                      <strong className="text-amber-300">Engineering Explanation: </strong>
                      {currentModule.codeOrCaseExample.explanation}
                    </div>
                  </div>

                  {/* Interactive Arohi AI Professor Doubt Solver */}
                  <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-400/40 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
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
                        className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-xl text-[11px] font-bold transition cursor-pointer"
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
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={() => handleAskArohiProfessor()}
                        disabled={loadingTutorAI}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
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
                      <div className="bg-slate-950/90 border border-cyan-400/40 rounded-xl p-4 space-y-2.5 text-xs">
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

                  {/* Next Step CTA Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        markModuleCompleted(currentModule.id);
                        showToast(`✅ Module ${currentModule.moduleNumber} Lecture Marked Completed!`);
                      }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Lecture Complete
                    </button>

                    <button
                      onClick={() => setClassroomSubTab("lab")}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <span>Proceed to Hands-On Lab</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: HANDS-ON PRACTICE LAB (AI AUTO-GRADED) */}
              {classroomSubTab === "lab" && (
                <div className="space-y-5">
                  <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                      Hands-On Capstone Mini-Lab &bull; Module {currentModule.moduleNumber}
                    </span>
                    <h4 className="text-base font-black text-white">
                      {currentModule.handsOnLab.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentModule.handsOnLab.taskDescription}
                    </p>
                    <div className="text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <strong>Deliverable Criteria:</strong> {currentModule.handsOnLab.deliverableCriteria}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-cyan-400" /> Interactive Lab Workspace
                      </span>
                      <button
                        onClick={() => setLabSubmissionCode(currentModule.handsOnLab.starterTemplate)}
                        className="text-[11px] text-cyan-300 hover:underline cursor-pointer"
                      >
                        Reset Reference Solution Template
                      </button>
                    </div>
                    <textarea
                      rows={10}
                      value={labSubmissionCode}
                      onChange={(e) => setLabSubmissionCode(e.target.value)}
                      className="w-full font-mono text-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 text-emerald-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <button
                      onClick={handleEvaluateHandsOnLab}
                      disabled={evaluatingLab}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      {evaluatingLab ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Lab Submission...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Submit Lab for Instant AI Evaluation &amp; Grade
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setClassroomSubTab("quiz")}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-400/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Take Module Mastery Quiz →</span>
                    </button>
                  </div>

                  {labResult && (
                    <div className="bg-emerald-950/40 border border-emerald-400/50 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                          Arohi AI Lab Evaluation Result
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                          Score: {labResult.score}/100 ({labResult.passed ? "PASSED" : "NEEDS REVISION"})
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{labResult.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 3: MODULE MASTERY QUIZ (AUTO-GRADED) */}
              {classroomSubTab === "quiz" && (
                <div className="space-y-5">
                  <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">
                        Module {currentModule.moduleNumber} Mastery Checkpoint Quiz
                      </h4>
                      <p className="text-xs text-slate-400">
                        Answer the 3 questions below to verify your mastery and unlock the next module.
                      </p>
                    </div>
                    {quizSubmitted && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black">
                        Completed ✓
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {currentModule.quizQuestions.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[qIdx];
                      return (
                        <div
                          key={qIdx}
                          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3"
                        >
                          <div className="text-xs sm:text-sm font-extrabold text-white">
                            Q{qIdx + 1}. {q.question}
                          </div>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => {
                              const isChosen = selectedOpt === oIdx;
                              const isCorrect = q.correctIndex === oIdx;
                              let btnStyle =
                                "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-400";
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnStyle =
                                    "bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold";
                                } else if (isChosen && !isCorrect) {
                                  btnStyle = "bg-rose-950/80 border-rose-400 text-rose-200";
                                }
                              } else if (isChosen) {
                                btnStyle = "bg-indigo-950 border-cyan-400 text-white font-bold";
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
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-200">
                              <strong className="text-amber-300">Explanation: </strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitModuleQuiz}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                      >
                        Submit Quiz &amp; Complete Module {currentModule.moduleNumber}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    )}

                    {activeModuleIndex < activeProgramModules.length - 1 && (
                      <button
                        onClick={() => {
                          setActiveModuleIndex((prev) => prev + 1);
                          setClassroomSubTab("lesson");
                        }}
                        className="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                      >
                        <span>Next: Module {currentModule.moduleNumber + 1}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: 20% PHYSICAL TUTORING & MENTOR LAB SCHEDULER */}
              {classroomSubTab === "tutoring" && (
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-400/40 rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                      80% Digital Learning + 20% Physical Tutoring Model
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Book Your 20% Physical Classroom / Mentor Lab Session
                    </h4>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      Every Recruits.org.in program combines 80% interactive digital modules with 20% in-person mentor code reviews, architecture whiteboarding, and mock placement drills.
                    </p>
                  </div>

                  <form onSubmit={handleBookPhysicalTutoring} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Select Physical Tutoring Hub / Campus Center
                      </label>
                      <select
                        value={tutoringCenter}
                        onChange={(e) => setTutoringCenter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Bhubaneswar Hub (Saheed Nagar / Infocity)">
                          Bhubaneswar Hub (Saheed Nagar / Infocity)
                        </option>
                        <option value="Cuttack Regional Mentor Center">Cuttack Regional Mentor Center</option>
                        <option value="Rourkela Technical Campus Hub">Rourkela Technical Campus Hub</option>
                        <option value="Berhampur University Zone Hub">Berhampur University Zone Hub</option>
                        <option value="Sambalpur Western Odisha Hub">Sambalpur Western Odisha Hub</option>
                        <option value="Live 1-on-1 Hybrid Mentor Room (Pan-India)">
                          Live 1-on-1 Hybrid Mentor Room (Pan-India)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        Preferred Weekly 20% Lab Batch Slot
                      </label>
                      <select
                        value={tutoringSlot}
                        onChange={(e) => setTutoringSlot(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Saturday Morning (10:00 AM – 1:00 PM IST)">
                          Saturday Morning (10:00 AM – 1:00 PM IST)
                        </option>
                        <option value="Sunday Afternoon (2:00 PM – 5:00 PM IST)">
                          Sunday Afternoon (2:00 PM – 5:00 PM IST)
                        </option>
                        <option value="Wednesday Evening Lab (6:30 PM – 8:30 PM IST)">
                          Wednesday Evening Lab (6:30 PM – 8:30 PM IST)
                        </option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                      >
                        Confirm 20% Physical Tutoring Lab Slot for Module {currentModule.moduleNumber}
                      </button>
                    </div>
                  </form>

                  {bookedTutoringSessions.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <span className="text-xs font-black text-emerald-400 uppercase">
                        Your Confirmed 20% Physical Tutoring Sessions
                      </span>
                      {bookedTutoringSessions.map((b) => (
                        <div
                          key={b.id}
                          className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{b.moduleTitle}</div>
                            <div className="text-[11px] text-slate-400">
                              {b.center} &bull; {b.slot}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            Seat Reserved ✓
                          </span>
                        </div>
                      ))}
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
                src="/src/assets/images/university_mou_partnership_1794927487846.jpg"
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
                src="/src/assets/images/campus_placement_megadrive_1794927483546.jpg"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Cols: Campus Value Proposition & 10 In-Demand Campus Programs */}
            <div className="lg:col-span-6 bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> For Colleges &amp; Universities
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Turn Your Campus into a{" "}
                  <span className="text-cyan-300">Future-Ready Talent Hub</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Industry-Aligned Training &bull; Real-World Skills &bull; Job-Ready Graduates. Partner with{" "}
                  <strong className="text-amber-300">Recruits.org.in</strong> (Quench Research Labs Private Limited) to deliver real career outcomes for your students.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-purple-300 bg-purple-500/15 border border-purple-500/30 px-4 py-2 rounded-xl">
                  Offer In-Demand Programs on Your Campus (Select for 2026–27)
                </h4>

                <div className="space-y-2">
                  {OFFICIAL_10_TRAINING_PROGRAMS.map((prog) => {
                    const isSelected = selectedCampusPrograms.includes(prog.title);
                    return (
                      <div
                        key={prog.id}
                        onClick={() => toggleCampusProgramSelection(prog.title)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-indigo-950/90 border-cyan-400/70 text-white shadow-md"
                            : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? "bg-cyan-400 border-cyan-300 text-slate-950"
                                : "border-slate-600 bg-slate-950"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-extrabold">{prog.title}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-300 shrink-0">
                          {prog.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Limited Slots Banner matching Poster 1 & 3 */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 via-fuchsia-900/50 to-indigo-900/60 border border-fuchsia-400/40 flex items-center justify-between gap-4">
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
            <div className="lg:col-span-6 bg-slate-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-2xl">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  Institutional MoU &amp; Slot Booking (2026–27)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Partner with Recruits.org.in
                </h3>
                <p className="text-xs text-slate-400">
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
        <div className="space-y-8">
          {/* Official Posters Showcase */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  Official Campaign Collaterals • Quench Research Labs Pvt. Ltd.
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Recruits.org.in Official Training &amp; Institutional Posters
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {OFFICIAL_POSTERS.map((poster) => (
                <div
                  key={poster.id}
                  onClick={() => setLightboxPoster(poster)}
                  className="group bg-slate-900 border border-slate-800 hover:border-amber-400/70 rounded-2xl overflow-hidden shadow-lg transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-950 relative">
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
                    <p className="text-[11px] text-slate-400">{poster.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized AI Learning Path Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Arohi AI Custom Learning Path Advisor</h3>
                <p className="text-xs text-slate-400">
                  Enter your career goal to get AI-curated modules mapped to your profile ({memory.targetRole})
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Primary Learning Goal</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              id="btn-get-learning-recs"
              onClick={handleGetRecommendations}
              disabled={loadingAI}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
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
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-md font-bold uppercase">
                          {rec.type}
                        </span>
                        <span className="text-xs text-slate-400">{rec.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                      <p className="text-xs text-indigo-300 font-semibold">{rec.provider}</p>
                      <p className="text-xs text-slate-300">{rec.reason}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-5 shadow-2xl relative">
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
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div>
                <h4 className="text-sm font-black">{lightboxPoster.title}</h4>
                <p className="text-xs text-slate-400">{lightboxPoster.subtitle}</p>
              </div>
              <button
                onClick={() => setLightboxPoster(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto bg-slate-950 flex justify-center p-2">
              <img
                src={lightboxPoster.imageUrl}
                alt={lightboxPoster.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED COURSE COMPLETION CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div
          onClick={() => setShowCertificateModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-gradient-to-br from-[#090d26] via-[#131842] to-[#1a103c] border-4 border-amber-400/80 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative space-y-6 text-center"
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[11px] font-black uppercase tracking-widest">
                <Award className="w-4 h-4" /> Globally Recognized Certification
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
                is actively completing / has mastered the Industry-Ready Training Program in
              </span>
              <div className="text-lg sm:text-xl font-black text-cyan-300 pt-1">
                {activeClassroomProgram.title}
              </div>
              <p className="text-[11px] text-indigo-200">
                Duration: {activeClassroomProgram.duration} &bull; 80% Digital Learning + 20% Physical Tutoring &bull; 100% Placement Assistance
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
                Verification ID: <strong className="text-white">QRL-REC-{activeClassroomProgram.number}026</strong>
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
          </div>
        </div>
      )}
    </div>
  );
};
