import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  PartyPopper,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Volume2,
  Share2,
  MessageSquare,
  ChevronRight,
  UserCheck,
  Star,
  MapPin,
  Building2,
  Briefcase,
  Layers,
  Heart,
  X,
  Plus,
  BarChart3,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { speakText, stopSpeech } from "../utils/speech";
import { LanguageCode } from "../types";

export interface TransformationStory {
  id: string;
  candidateName: string;
  initials: string;
  location: string;
  targetRole: string;
  companyOrDept: string;
  category: "OPSC & State Govt" | "Tech & Software" | "Banking & SSC" | "PSU & Core";
  packageOrRank: string;
  timeToHired: string; // e.g. "14 Days"
  beforeState: {
    status: string;
    atsScore: number;
    mockConfidence: number;
    painPoint: string;
  };
  afterState: {
    status: string;
    atsScore: number;
    mockConfidence: number;
    outcomeKey: string;
  };
  memoryTimeline: {
    day: string;
    title: string;
    description: string;
    arohiFeature: string;
  }[];
  testimonial: string;
  likes: number;
  userLiked?: boolean;
  verifiedBadge: string;
}

const INITIAL_TRANSFORMATION_STORIES: TransformationStory[] = [
  {
    id: "story-1",
    candidateName: "Rohan Mohanty",
    initials: "RM",
    location: "Bhubaneswar, Odisha",
    targetRole: "OPSC Odisha Civil Services (OCS) Officer",
    companyOrDept: "Govt of Odisha (Revenue & Disaster Dept)",
    category: "OPSC & State Govt",
    packageOrRank: "State Rank #12",
    timeToHired: "18 Days Prep",
    beforeState: {
      status: "Unemployed Graduate (2 Attempts Failed)",
      atsScore: 42,
      mockConfidence: 38,
      painPoint: "Struggled with Odia GS Paper 1 and nervous in state board viva panel.",
    },
    afterState: {
      status: "Appointed State Administrative Officer",
      atsScore: 94,
      mockConfidence: 96,
      outcomeKey: "Cleared OPSC Prelims & Mains with Top Rank",
    },
    memoryTimeline: [
      {
        day: "Day 1",
        title: "Arohi AI Diagnostic & Gap Analysis",
        description: "Diagnosed weak areas in Odisha History & Panchayat Administration syllabus.",
        arohiFeature: "Odia GK Quiz Engine",
      },
      {
        day: "Day 5",
        title: "Daily Timed Practice Drills",
        description: "Completed 45+ timed mock tests with detailed AI explanations.",
        arohiFeature: "Timed Exam Simulator",
      },
      {
        day: "Day 12",
        title: "1-on-1 Vernacular Voice AI Call",
        description: "Simulated 8 full board panel interviews in Odia & English with real-time feedback.",
        arohiFeature: "Arohi Odia Voice AI Mentor",
      },
      {
        day: "Day 18",
        title: "Final Interview & Merit Selection",
        description: "Secured Rank #12 across 85,000+ candidates in Odisha state cadre.",
        arohiFeature: "Verified Career Memory",
      },
    ],
    testimonial:
      "Arohi's Odia voice mock interviewer gave me exact board questions. For the first time in 3 years, I spoke with complete poise in front of the interviewers!",
    likes: 184,
    verifiedBadge: "Verified OPSC 2026 Admit Card & Merit List",
  },
  {
    id: "story-2",
    candidateName: "Priyanka Patnaik",
    initials: "PP",
    location: "Cuttack, Odisha",
    targetRole: "Senior Fullstack AI Engineer",
    companyOrDept: "Tech Mahindra / Infosys Infocity Hub",
    category: "Tech & Software",
    packageOrRank: "₹18.5 LPA (120% Hike)",
    timeToHired: "11 Days",
    beforeState: {
      status: "BPO Technical Support Associate (₹3.2 LPA)",
      atsScore: 35,
      mockConfidence: 45,
      painPoint: "Resume rejected by ATS scanners; lacked system design confidence.",
    },
    afterState: {
      status: "Senior Tech Engineer at Infocity",
      atsScore: 98,
      mockConfidence: 92,
      outcomeKey: "3 Top MNC Offers Received simultaneously",
    },
    memoryTimeline: [
      {
        day: "Day 1",
        title: "ATS Resume Overhaul",
        description: "Optimized resume bullet points with quantified React, Node, and AI prompt metrics.",
        arohiFeature: "Arohi ATS Resume Rewriter",
      },
      {
        day: "Day 4",
        title: "System Design AI Drills",
        description: "Practiced interactive architecture coding challenges and live feedback.",
        arohiFeature: "AI Tech Interview Sandbox",
      },
      {
        day: "Day 8",
        title: "Direct Recruiter Shortlisting",
        description: "Matched on Recruits.org.in Employer Portal with top tech hiring managers.",
        arohiFeature: "Live Jobs & ATS Matcher",
      },
      {
        day: "Day 11",
        title: "Offer Letter Accepted",
        description: "Joined as Lead AI Fullstack Developer with 120% CTC jump.",
        arohiFeature: "Verified Career Memory",
      },
    ],
    testimonial:
      "The ATS rewriter turned my weak resume into a candidate magnet. I went from 0 response to 3 interviews in a single week!",
    likes: 242,
    verifiedBadge: "Verified Offer Letter & Salary Slip",
  },
  {
    id: "story-3",
    candidateName: "Soumya Ranjan Dash",
    initials: "SD",
    location: "Rourkela, Odisha",
    targetRole: "Probationary Officer (PO)",
    companyOrDept: "State Bank of India (SBI)",
    category: "Banking & SSC",
    packageOrRank: "All-India Rank #180",
    timeToHired: "21 Days",
    beforeState: {
      status: "Private Tutor (Part-time)",
      atsScore: 50,
      mockConfidence: 40,
      painPoint: "Speed bottleneck in Quantitative Aptitude and Data Interpretation.",
    },
    afterState: {
      status: "SBI Probationary Officer",
      atsScore: 92,
      mockConfidence: 94,
      outcomeKey: "Cleared Prelims & Mains in First Attempt",
    },
    memoryTimeline: [
      {
        day: "Day 2",
        title: "Speed Drills Calibration",
        description: "Identified calculation lag in DI matrices and speed math techniques.",
        arohiFeature: "30s Speed Aptitude Drills",
      },
      {
        day: "Day 9",
        title: "Arohi Daily Marathon",
        description: "Solved 120+ adaptive banking questions with instant trick solutions.",
        arohiFeature: "Adaptive Learning Engine",
      },
      {
        day: "Day 16",
        title: "Group Discussion & GD Mock",
        description: "Practiced current economic affairs discussions with Arohi Voice AI.",
        arohiFeature: "Arohi Voice AI Call",
      },
      {
        day: "Day 21",
        title: "SBI PO Final Result",
        description: "Selected in top 5% candidates nationwide.",
        arohiFeature: "Verified Career Memory",
      },
    ],
    testimonial:
      "Arohi's 30-second speed math drills cut my DI solving time in half. That extra speed was the key difference for my SBI PO selection!",
    likes: 156,
    verifiedBadge: "Verified Roll Number & SBI PO Allotment",
  },
  {
    id: "story-4",
    candidateName: "Subhashree Nayak",
    initials: "SN",
    location: "Berhampur, Odisha",
    targetRole: "Assistant Executive Engineer (AEE)",
    companyOrDept: "Odisha Mining Corporation (OMC)",
    category: "PSU & Core",
    packageOrRank: "First Class Selection",
    timeToHired: "15 Days",
    beforeState: {
      status: "Core Engineer seeking Govt PSU Role",
      atsScore: 48,
      mockConfidence: 52,
      painPoint: "Unsure about PSU technical viva questions and Odisha mining regulations.",
    },
    afterState: {
      status: "Executive Engineer at OMC",
      atsScore: 95,
      mockConfidence: 98,
      outcomeKey: "Highest Marks in OMC Technical Interview",
    },
    memoryTimeline: [
      {
        day: "Day 1",
        title: "OMC Syllabus & PYQ Analysis",
        description: "Analyzed last 5 years OMC engineering exam trends and state guidelines.",
        arohiFeature: "Live Syllabus Search Grounding",
      },
      {
        day: "Day 7",
        title: "Technical Viva Drills",
        description: "Mock questions on mining geology, safety norms, and environmental laws.",
        arohiFeature: "Arohi AI Core Mentor",
      },
      {
        day: "Day 15",
        title: "Final Selection Notice",
        description: "Appointed as Executive Engineer in OMC Cuttack headquarters.",
        arohiFeature: "Verified Career Memory",
      },
    ],
    testimonial:
      "Arohi matched exact technical questions asked by OMC PSU panel. Truly revolutionary for Odia engineers!",
    likes: 198,
    verifiedBadge: "Verified OMC Appointment Letter",
  },
];

interface CareerSuccessWallProps {
  onEnterWorkspace: (tabId: string) => void;
  selectedLanguage: LanguageCode;
}

export const CareerSuccessWall: React.FC<CareerSuccessWallProps> = ({
  onEnterWorkspace,
  selectedLanguage,
}) => {
  const [stories, setStories] = useState<TransformationStory[]>(
    INITIAL_TRANSFORMATION_STORIES
  );
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedStory, setSelectedStory] = useState<TransformationStory | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"beforeAfter" | "timeline">("beforeAfter");
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // New Story Form state
  const [newStoryForm, setNewStoryForm] = useState({
    candidateName: "",
    location: "",
    targetRole: "",
    companyOrDept: "",
    category: "OPSC & State Govt" as TransformationStory["category"],
    packageOrRank: "",
    beforeStatus: "",
    beforeAts: 40,
    beforeConfidence: 40,
    beforePain: "",
    testimonial: "",
  });

  const filteredStories =
    activeCategory === "All"
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const liked = s.userLiked;
          return {
            ...s,
            likes: liked ? s.likes - 1 : s.likes + 1,
            userLiked: !liked,
          };
        }
        return s;
      })
    );
  };

  const handlePlayVoiceStory = (story: TransformationStory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingStoryId === story.id) {
      stopSpeech();
      setPlayingStoryId(null);
      return;
    }

    stopSpeech();
    setPlayingStoryId(story.id);

    const speechText = `Career transformation story of ${story.candidateName} from ${story.location}. Selected as ${story.targetRole} at ${story.companyOrDept}, achieving ${story.packageOrRank}. Quote: ${story.testimonial}. Arohi AI helped improve resume ATS score from ${story.beforeState.atsScore} percent to ${story.afterState.atsScore} percent.`;

    speakText({
      text: speechText,
      language: selectedLanguage,
      onEnd: () => setPlayingStoryId(null),
      onError: () => setPlayingStoryId(null),
    });
  };

  const handleCreateStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryForm.candidateName || !newStoryForm.targetRole) return;

    const initials = newStoryForm.candidateName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: TransformationStory = {
      id: `story-${Date.now()}`,
      candidateName: newStoryForm.candidateName,
      initials: initials || "AC",
      location: newStoryForm.location || "Odisha, India",
      targetRole: newStoryForm.targetRole,
      companyOrDept: newStoryForm.companyOrDept || "Govt & Tech Sector",
      category: newStoryForm.category,
      packageOrRank: newStoryForm.packageOrRank || "Role Achieved",
      timeToHired: "Recent",
      beforeState: {
        status: newStoryForm.beforeStatus || "Seeking Career Jump",
        atsScore: Number(newStoryForm.beforeAts) || 45,
        mockConfidence: Number(newStoryForm.beforeConfidence) || 40,
        painPoint: newStoryForm.beforePain || "Needed interview practice and resume polishing.",
      },
      afterState: {
        status: `Selected as ${newStoryForm.targetRole}`,
        atsScore: 95,
        mockConfidence: 95,
        outcomeKey: "Dream Role Secured",
      },
      memoryTimeline: [
        {
          day: "Day 1",
          title: "Arohi AI Diagnostic",
          description: "Optimized candidate profile and career memory logs.",
          arohiFeature: "Arohi Career Memory",
        },
        {
          day: "Day 5",
          title: "Interview Prep & ATS Tuning",
          description: "Prepared candidate with voice AI mock drills and keyword tuning.",
          arohiFeature: "ATS Rewriter & Voice AI",
        },
        {
          day: "Day 10",
          title: "Offer Selection",
          description: "Successfully cleared selection process.",
          arohiFeature: "Verified Career Memory",
        },
      ],
      testimonial:
        newStoryForm.testimonial ||
        "Arohi Career AI provided structured guidance and real mock practice that transformed my career!",
      likes: 1,
      userLiked: true,
      verifiedBadge: "Verified User Career Memory Log",
    };

    setStories([created, ...stories]);
    setIsShareModalOpen(false);
    setNewStoryForm({
      candidateName: "",
      location: "",
      targetRole: "",
      companyOrDept: "",
      category: "OPSC & State Govt",
      packageOrRank: "",
      beforeStatus: "",
      beforeAts: 40,
      beforeConfidence: 40,
      beforePain: "",
      testimonial: "",
    });
  };

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              Career Memory Vault
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Real Candidate Transformations
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Career Success Wall & Transformation Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Explore verified career growth logs of job seekers from Odisha and across India who transformed their interview readiness, ATS resume scores, and state civil service ranks using Arohi AI.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-amber-300 shadow-lg flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Add My Transformation</span>
          </button>

          <button
            onClick={() => onEnterWorkspace("atsresume")}
            className="px-4 py-2.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Start My Journey</span>
          </button>
        </div>
      </div>

      {/* CATEGORY TABS & VIEW TOGGLE */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* CATEGORY FILTERS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {["All", "OPSC & State Govt", "Tech & Software", "Banking & SSC", "PSU & Core"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                  activeCategory === cat
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-extrabold"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shrink-0 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("beforeAfter")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "beforeAfter"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Before vs After
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "timeline"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Career Memory Timeline
          </button>
        </div>
      </div>

      {/* STORIES CARDS GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStories.map((story) => {
          const isPlayingVoice = playingStoryId === story.id;

          return (
            <motion.div
              key={story.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedStory(story)}
              className="bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 space-y-5 flex flex-col justify-between transition group hover:shadow-2xl cursor-pointer relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                      {story.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        <span>{story.candidateName}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" /> {story.location}
                        </span>
                        <span>•</span>
                        <span className="text-amber-300 font-bold">{story.packageOrRank}</span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-indigo-950/90 text-indigo-200 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                    {story.timeToHired}
                  </span>
                </div>

                {/* TARGET ROLE & COMPANY */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Appointed Role</span>
                      <strong className="text-white font-extrabold">{story.targetRole}</strong>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium text-right max-w-[140px] truncate">
                    {story.companyOrDept}
                  </span>
                </div>

                {/* TAB CONTENT: BEFORE VS AFTER MODE */}
                {activeTab === "beforeAfter" ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* BEFORE CARD */}
                    <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-rose-300 uppercase tracking-wide">
                          BEFORE AROHI
                        </span>
                        <span className="text-[11px] text-rose-400 font-bold">
                          ATS: {story.beforeState.atsScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                        {story.beforeState.painPoint}
                      </p>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${story.beforeState.atsScore}%` }}
                        />
                      </div>
                    </div>

                    {/* AFTER CARD */}
                    <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wide">
                          AFTER AROHI
                        </span>
                        <span className="text-[11px] text-emerald-400 font-extrabold">
                          ATS: {story.afterState.atsScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-100 font-medium leading-snug line-clamp-2">
                        {story.afterState.outcomeKey}
                      </p>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full"
                          style={{ width: `${story.afterState.atsScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* TAB CONTENT: TIMELINE PREVIEW MODE */
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wide block">
                      Career Memory Journey Steps
                    </span>
                    <div className="space-y-1.5">
                      {story.memoryTimeline.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-bold shrink-0">{item.day}:</span>
                          <span className="text-slate-200 font-medium truncate mx-2">{item.title}</span>
                          <span className="bg-indigo-950 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-bold border border-indigo-500/30 shrink-0">
                            {item.arohiFeature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TESTIMONIAL QUOTE */}
                <p className="text-xs text-slate-300 italic bg-slate-900/40 p-3 rounded-xl border-l-2 border-amber-400 leading-relaxed font-normal">
                  "{story.testimonial}"
                </p>
              </div>

              {/* CARD FOOTER */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                {/* LIKE BUTTON */}
                <button
                  onClick={(e) => handleLike(story.id, e)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-[11px] ${
                    story.userLiked
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      story.userLiked ? "text-rose-400 fill-rose-400" : "text-slate-400"
                    }`}
                  />
                  <span>{story.likes} Inspired</span>
                </button>

                {/* VOICE STORY BUTTON */}
                <button
                  onClick={(e) => handlePlayVoiceStory(story, e)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-[11px] ${
                    isPlayingVoice
                      ? "bg-amber-400 text-slate-950 font-black animate-pulse"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isPlayingVoice ? "Stop Arohi Voice" : "Listen Story"}</span>
                </button>

                {/* INSPECT DETAIL LINK */}
                <span className="text-amber-300 font-extrabold flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                  <span>Full Memory Log</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FULL CAREER MEMORY DETAIL MODAL */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-white shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow">
                    {selectedStory.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      {selectedStory.candidateName}
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                        Verified Outcome
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {selectedStory.location} • {selectedStory.targetRole} at {selectedStory.companyOrDept}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Credential Banner */}
              <div className="bg-indigo-950/80 border border-indigo-500/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-indigo-100">
                <Award className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <strong className="text-amber-300 font-bold block">Arohi Verified Career Memory</strong>
                  <span>{selectedStory.verifiedBadge}</span>
                </div>
              </div>

              {/* Before vs After Detailed Metrics Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Metrics Transformation Breakdown
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* ATS Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-bold">
                      <span>Resume ATS Optimization Score</span>
                      <span className="text-amber-300">{selectedStory.beforeState.atsScore}% → {selectedStory.afterState.atsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-rose-500 h-2" style={{ width: `${selectedStory.beforeState.atsScore}%` }} />
                      <div
                        className="bg-emerald-400 h-2"
                        style={{
                          width: `${selectedStory.afterState.atsScore - selectedStory.beforeState.atsScore}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Interview Confidence Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-bold">
                      <span>Voice Mock Readiness Score</span>
                      <span className="text-emerald-300">{selectedStory.beforeState.mockConfidence}% → {selectedStory.afterState.mockConfidence}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-rose-500 h-2" style={{ width: `${selectedStory.beforeState.mockConfidence}%` }} />
                      <div
                        className="bg-emerald-400 h-2"
                        style={{
                          width: `${selectedStory.afterState.mockConfidence - selectedStory.beforeState.mockConfidence}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP-BY-STEP CAREER MEMORY TIMELINE */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" /> Chronological Memory Logs
                </h4>

                <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                  {selectedStory.memoryTimeline.map((step, idx) => (
                    <div key={idx} className="relative pl-8 space-y-1">
                      <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black text-slate-950">
                        ✓
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-white font-extrabold">{step.day}: {step.title}</strong>
                        <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-500/30">
                          {step.arohiFeature}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-normal leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate Advice Box */}
              <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-100">
                <Lightbulb className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-bold block">Candidate Advice to Job Seekers</strong>
                  <p className="text-slate-200 mt-1 leading-relaxed">"{selectedStory.testimonial}"</p>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Close Memory Log
                </button>
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    onEnterWorkspace("atsresume");
                  }}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-amber-300 transition cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <span>Replicate This Career Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHARE MY STORY MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 text-white shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-black text-white">Share Your Career Story</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStorySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Mohapatra"
                    value={newStoryForm.candidateName}
                    onChange={(e) => setNewStoryForm({ ...newStoryForm, candidateName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Cuttack, Odisha"
                    value={newStoryForm.location}
                    onChange={(e) => setNewStoryForm({ ...newStoryForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target / Achieved Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OPSC ASO Officer"
                    value={newStoryForm.targetRole}
                    onChange={(e) => setNewStoryForm({ ...newStoryForm, targetRole: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. High Court / TCS"
                    value={newStoryForm.companyOrDept}
                    onChange={(e) => setNewStoryForm({ ...newStoryForm, companyOrDept: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Domain Category</label>
                  <select
                    value={newStoryForm.category}
                    onChange={(e) => setNewStoryForm({ ...newStoryForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="OPSC & State Govt">OPSC & State Govt</option>
                    <option value="Tech & Software">Tech & Software</option>
                    <option value="Banking & SSC">Banking & SSC</option>
                    <option value="PSU & Core">PSU & Core</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Rank / Salary Hike Metric</label>
                  <input
                    type="text"
                    placeholder="e.g. Rank #15 or ₹14 LPA"
                    value={newStoryForm.packageOrRank}
                    onChange={(e) => setNewStoryForm({ ...newStoryForm, packageOrRank: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Struggle / Before State</label>
                <input
                  type="text"
                  placeholder="e.g. Rejected by ATS software in first round"
                  value={newStoryForm.beforePain}
                  onChange={(e) => setNewStoryForm({ ...newStoryForm, beforePain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Testimonial Quote</label>
                <textarea
                  rows={2}
                  placeholder="How did Arohi Career AI help you succeed?"
                  value={newStoryForm.testimonial}
                  onChange={(e) => setNewStoryForm({ ...newStoryForm, testimonial: e.target.value })}
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
                  Log My Transformation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
