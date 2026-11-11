import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Sparkles,
  Volume2,
  Loader2,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MessageSquare,
  Award,
  Building2,
  Target,
  Send,
  X,
  UserCheck,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { CareerMemory, LanguageCode } from "../../types";
import { speakText } from "../../utils/speech";

interface CareerMentorEngineProps {
  memory: CareerMemory;
  selectedLanguage: LanguageCode;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
}

export interface MentorProfile {
  id: string;
  name: string;
  designation: string;
  organization: string;
  experienceYears: number;
  domain: string;
  location: string;
  matchPercentage: number;
  sharedInterests: string[];
  bio: string;
  availability: string;
  sessionTypes: string[];
  verifiedStatus: boolean;
  avatarColor?: string;
}

const FALLBACK_MENTORS: MentorProfile[] = [
  {
    id: "mentor-1",
    name: "Vikramaditya Roy",
    designation: "Principal AI Architect & Tech Fellow",
    organization: "Google India & ex-Microsoft",
    experienceYears: 16,
    domain: "Tech & AI",
    location: "Bengaluru, Karnataka",
    matchPercentage: 97,
    sharedInterests: [
      "AI Systems Architecture",
      "Transition to Staff/Principal Level",
      "₹60+ LPA Compensation Growth",
    ],
    bio: "Guiding senior developers into AI leadership roles. Helped 40+ engineers transition into AI/ML Lead positions across India and US tech hubs.",
    availability: "Saturdays (10 AM - 2 PM IST)",
    sessionTypes: ["30-Min 1-on-1 Strategy", "System Design & Portfolio Review", "Mock Executive Interview"],
    verifiedStatus: true,
    avatarColor: "from-purple-600 to-indigo-600",
  },
  {
    id: "mentor-2",
    name: "Dr. Ananya Mukherjee, IAS",
    designation: "Senior Director (E-Governance)",
    organization: "Ministry of Electronics & IT (MeitY)",
    experienceYears: 18,
    domain: "Government & Public Sector",
    location: "New Delhi, Delhi",
    matchPercentage: 94,
    sharedInterests: [
      "Public Sector Tech Modernization",
      "UPSC / SSC Executive Mentorship",
      "Govt Tech Recruitment",
    ],
    bio: "Pioneer in national e-governance platforms. Mentors mid-career professionals and young aspirants targeting top government technology & administration roles.",
    availability: "Sundays (4 PM - 7 PM IST)",
    sessionTypes: ["30-Min Govt Career Strategy", "UPSC / PSU Interview Prep", "Public Policy Mentorship"],
    verifiedStatus: true,
    avatarColor: "from-amber-500 to-orange-600",
  },
  {
    id: "mentor-3",
    name: "Rajesh S. Nair",
    designation: "Chief Information Security Officer (CISO)",
    organization: "State Bank of India (SBI Group)",
    experienceYears: 20,
    domain: "Banking & Finance",
    location: "Mumbai, Maharashtra",
    matchPercentage: 92,
    sharedInterests: [
      "FinTech & Cyber Risk Architecture",
      "IBPS / Banking Executive Fast-Track",
      "Scalable Banking Tech",
    ],
    bio: "Over 20 years leading digital transformation in India's banking sector. Specializes in mentoring tech professionals moving into banking leadership.",
    availability: "Saturdays (3 PM - 6 PM IST)",
    sessionTypes: ["30-Min Banking Tech Strategy", "FinTech Career Roadmap", "Executive Resume Review"],
    verifiedStatus: true,
    avatarColor: "from-cyan-600 to-blue-700",
  },
  {
    id: "mentor-4",
    name: "Priya Sundaram",
    designation: "VP of Product & Co-founder",
    organization: "HyperAI Labs (Scaleup)",
    experienceYears: 12,
    domain: "Startups & Product",
    location: "Hyderabad, Telangana",
    matchPercentage: 95,
    sharedInterests: [
      "Generative AI Product Roadmap",
      "0-to-1 Startup Engineering",
      "Equity & Founder Guidance",
    ],
    bio: "Ex-Flipkart Product Lead, currently building LLM-based developer tools. Passionate about guiding engineers into product management and founding teams.",
    availability: "Wednesdays & Sundays (7 PM - 9 PM IST)",
    sessionTypes: ["30-Min Product Strategy Call", "Startup Career Fast-Track", "Portfolio & Demo Pitch Review"],
    verifiedStatus: true,
    avatarColor: "from-emerald-500 to-teal-700",
  },
];

export const CareerMentorEngine: React.FC<CareerMentorEngineProps> = ({
  memory,
  selectedLanguage,
  isSpeaking,
  setIsSpeaking,
}) => {
  const [activeTab, setActiveTab] = useState<"ai_mentor" | "mentorship_connect">("ai_mentor");

  // AI Mentor QA State
  const [query, setQuery] = useState(
    "How do I position myself for a Senior Lead promotion or a successful transition into an AI Startup in 12 months?"
  );
  const [loading, setLoading] = useState(false);
  const [mentorAdvice, setMentorAdvice] = useState<string | null>(null);

  // Mentorship Connect State
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [mentors, setMentors] = useState<MentorProfile[]>(FALLBACK_MENTORS);
  const [fetchingMentors, setFetchingMentors] = useState(false);
  const [matchOverview, setMatchOverview] = useState<string | null>(
    "Arohi matched 4 senior industry leaders in India sharing your target role, system architecture goals, and compensation trajectory."
  );

  // Booking Modal State
  const [bookingMentor, setBookingMentor] = useState<MentorProfile | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("2026-08-01");
  const [preferredTime, setPreferredTime] = useState<string>("11:00 AM IST");
  const [candidateNote, setCandidateNote] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingRefId, setBookingRefId] = useState<string>("");

  const QUICK_QUESTIONS = [
    "Should I pursue an MBA / GATE / Higher Studies or stay in tech?",
    "How do I transition from Full-Stack Developer to AI Solutions Architect?",
    "How to negotiate a 40%+ salary hike during career switch?",
    "What is the best 5-year roadmap to achieve ₹50+ LPA CTC in India?",
  ];

  const handleAskMentor = async (questionToAsk?: string) => {
    const activeQuery = questionToAsk || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setMentorAdvice(null);
    try {
      const res = await fetch("/api/ai/career-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: activeQuery,
          memory,
          language: selectedLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMentorAdvice(data.mentorAdvice);

        if (data.mentorAdvice) {
          setIsSpeaking(true);
          speakText({
            text: data.mentorAdvice.slice(0, 300) + "...",
            language: selectedLanguage,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }
      }
    } catch (err) {
      console.error("Error asking career mentor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMentors = async (domainFilterOverride?: string) => {
    setFetchingMentors(true);
    const domainToUse = domainFilterOverride !== undefined ? domainFilterOverride : selectedDomain;
    try {
      const res = await fetch("/api/ai/mentorship-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memory,
          domainFilter: domainToUse,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mentors && data.mentors.length > 0) {
          setMentors(data.mentors);
        }
        if (data.matchOverview) {
          setMatchOverview(data.matchOverview);
        }
      }
    } catch (err) {
      console.error("Failed to fetch mentorship matches:", err);
    } finally {
      setFetchingMentors(false);
    }
  };

  const handleOpenBookingModal = (mentor: MentorProfile) => {
    setBookingMentor(mentor);
    setSelectedSessionType(mentor.sessionTypes[0] || "30-Min 1-on-1 Strategy");
    setCandidateNote(
      `Hi ${mentor.name}, I am currently aiming for a ${memory.targetRole || "Senior AI Role"} and would love your guidance on career roadmap and system design.`
    );
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    const refId = "REC-MENTOR-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRefId(refId);
    setBookingConfirmed(true);
  };

  const filteredMentors =
    selectedDomain === "All Domains"
      ? mentors
      : mentors.filter((m) => m.domain.toLowerCase().includes(selectedDomain.toLowerCase()) || selectedDomain.includes(m.domain));

  return (
    <div className="space-y-6">
      {/* HEADER WITH SUB-TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 rounded-2xl text-white shadow-lg shadow-purple-600/20">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Arohi Career Mentor & Mentorship Connect</h2>
              <p className="text-xs text-slate-400">
                1-on-1 AI Strategy, Executive Career Roadmaps, and Senior Industry Mentor Matching
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("ai_mentor")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "ai_mentor"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Arohi AI Advisor
            </button>

            <button
              onClick={() => {
                setActiveTab("mentorship_connect");
                if (mentors === FALLBACK_MENTORS) {
                  handleFetchMentors();
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "mentorship_connect"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" /> Mentorship Connect
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: AROHI AI CAREER ADVISOR */}
      {activeTab === "ai_mentor" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            {/* Quick Question Chips */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Quick Mentor Topics:</span>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(q);
                      handleAskMentor(q);
                    }}
                    className="text-xs bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl transition text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-3">
              <textarea
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Arohi Career AI anything regarding career growth, promotions, higher education, or long-term strategy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />

              <button
                id="btn-ask-career-mentor"
                onClick={() => handleAskMentor()}
                disabled={loading || !query.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Arohi Career AI Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Seek Mentor Guidance
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advice Display */}
          {mentorAdvice && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Arohi Career Mentor Response
                </span>

                <button
                  onClick={() => {
                    setIsSpeaking(true);
                    speakText({
                      text: mentorAdvice,
                      language: selectedLanguage,
                      onStart: () => setIsSpeaking(true),
                      onEnd: () => setIsSpeaking(false),
                      onError: () => setIsSpeaking(false),
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Read Mentor Speech
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed space-y-3 whitespace-pre-line">
                {mentorAdvice}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENTORSHIP CONNECT (SENIOR PROFESSIONALS MATCHING) */}
      {activeTab === "mentorship_connect" && (
        <div className="space-y-6">
          {/* Candidate Profile Memory Snapshot & Recalculate */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <UserCheck className="w-4 h-4" /> Career Memory Benchmarked
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    Live Match
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {matchOverview}
                </p>
              </div>

              <button
                onClick={() => handleFetchMentors()}
                disabled={fetchingMentors}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 shrink-0"
              >
                {fetchingMentors ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Matching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Refresh AI Mentor Matches
                  </>
                )}
              </button>
            </div>

            {/* Stored Candidate Memory Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-400" /> Target Role
                </span>
                <p className="font-bold text-slate-100">{memory.targetRole || "Full Stack AI Engineer"}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" /> Key Skills
                </span>
                <p className="font-semibold text-slate-200 line-clamp-1">
                  {memory.primarySkills && memory.primarySkills.length > 0
                    ? memory.primarySkills.slice(0, 3).join(", ")
                    : "React, Node.js, Python, System Architecture"}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 text-indigo-400" /> Career Goals
                </span>
                <p className="font-semibold text-slate-200 line-clamp-1">
                  {memory.careerGoals && memory.careerGoals.length > 0
                    ? memory.careerGoals[0]
                    : "Reach Staff/Lead Architect CTC levels"}
                </p>
              </div>
            </div>

            {/* Domain Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-semibold mr-1">Filter Sector:</span>
              {[
                "All Domains",
                "Tech & AI",
                "Government & Public Sector",
                "Banking & Finance",
                "Startups & Product",
              ].map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    setSelectedDomain(domain);
                    handleFetchMentors(domain);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedDomain === domain
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between space-y-4 transition"
              >
                <div className="space-y-3">
                  {/* Header: Avatar, Name, Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${
                          m.avatarColor || "from-purple-600 to-indigo-600"
                        } flex items-center justify-center text-white font-extrabold text-base shadow-md`}
                      >
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-bold text-white">{m.name}</h4>
                          {m.verifiedStatus && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Senior Mentor" />
                          )}
                        </div>
                        <p className="text-xs text-purple-300 font-medium">{m.designation}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" /> {m.organization} • {m.experienceYears} Yrs Exp
                        </p>
                      </div>
                    </div>

                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0">
                      {m.matchPercentage}% Match
                    </span>
                  </div>

                  {/* Shared Career Interests Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Shared Career Interests & Goals:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sharedInterests.map((interest, iIdx) => (
                        <span
                          key={iIdx}
                          className="bg-purple-950/80 text-purple-200 border border-purple-800/60 text-[10px] px-2 py-0.5 rounded-lg font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    "{m.bio}"
                  </p>

                  {/* Availability */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Availability: {m.availability}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => handleOpenBookingModal(m)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Request 1-on-1 Mentorship
                </button>
              </div>
            ))}
          </div>

          {/* BOOKING MODAL */}
          {bookingMentor && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-lg w-full space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setBookingMentor(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {!bookingConfirmed ? (
                  <>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                      <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Request 1-on-1 Mentorship</h3>
                        <p className="text-xs text-slate-400">
                          Connect with {bookingMentor.name} ({bookingMentor.designation})
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Select Session Type */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 mb-1 block">
                          Select Session Type
                        </label>
                        <div className="space-y-1.5">
                          {bookingMentor.sessionTypes.map((st, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSessionType(st)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                                selectedSessionType === st
                                  ? "bg-purple-600 text-white border-purple-500"
                                  : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300 mb-1 block">Preferred Date</label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 mb-1 block">Time Slot</label>
                          <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="10:00 AM IST">10:00 AM IST</option>
                            <option value="11:30 AM IST">11:30 AM IST</option>
                            <option value="03:00 PM IST">03:00 PM IST</option>
                            <option value="05:00 PM IST">05:00 PM IST</option>
                            <option value="07:30 PM IST">07:30 PM IST</option>
                          </select>
                        </div>
                      </div>

                      {/* Message / Topic Note */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 mb-1 block">
                          Message / Career Goal Summary for Mentor
                        </label>
                        <textarea
                          rows={3}
                          value={candidateNote}
                          onChange={(e) => setCandidateNote(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Send Session Request
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">Mentorship Request Sent!</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Your request for <strong className="text-amber-300">{selectedSessionType}</strong> has been transmitted to{" "}
                        <strong className="text-purple-300">{bookingMentor.name}</strong>.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Booking Reference:</span>
                        <span className="font-mono font-bold text-emerald-400">{bookingRefId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date & Time:</span>
                        <span className="font-semibold text-slate-200">{preferredDate} at {preferredTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-amber-300 font-bold">Pending Mentor Acceptance</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingMentor(null)}
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Close & Return to Mentors
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
