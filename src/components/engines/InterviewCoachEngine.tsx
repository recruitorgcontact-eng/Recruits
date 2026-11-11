import React, { useState, useEffect } from "react";
import {
  Mic,
  Video,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Send,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Bell,
  MapPin,
  Building2,
  Download,
  X,
  FileText,
  AlertCircle,
  Play,
  CheckSquare,
  Square,
  ChevronRight,
  Bookmark,
  Users,
  Activity,
  Gauge,
  Zap,
  Flame,
  ShieldAlert,
  Radio,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { CareerMemory, MockInterviewQuestion, InterviewEvaluation, LanguageCode, InterviewCalendarEvent } from "../../types";
import { speakText, listenToVoiceInput, stopSpeech } from "../../utils/speech";
import { ToneAnalyzer } from "../ToneAnalyzer";
import { QuickQuiz } from "../QuickQuiz";
import { stressNoiseEngine, NoiseType } from "../../utils/audioNoiseSynthesizer";

interface InterviewCoachEngineProps {
  memory: CareerMemory;
  selectedLanguage: LanguageCode;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
}

const INITIAL_CALENDAR_EVENTS: InterviewCalendarEvent[] = [
  {
    id: "evt-1",
    title: "Google India - Senior AI Lead Technical Round",
    organization: "Google India",
    role: "Senior AI Engineer",
    eventType: "actual_interview",
    date: "2026-08-04",
    time: "10:30 AM IST",
    durationMinutes: 60,
    interviewerName: "Dr. Arvind Sharma (Principal Director)",
    locationOrUrl: "Google Meet / Bangalore Office",
    reminderTiming: "24_hours_before",
    status: "upcoming",
    focusTopics: [
      "LLM Fine-Tuning & Quantization",
      "RAG Architecture & Vector Indexing",
      "System Design for 10M QPS",
    ],
    prepChecklist: [
      { id: "c1", text: "Review System Design notes on Distributed Caching & Redis", completed: true },
      { id: "c2", text: "Practice STAR story for LLM latency optimization project", completed: false },
      { id: "c3", text: "Complete 1 Mock Interview session with Arohi AI Coach", completed: false },
      { id: "c4", text: "Test webcam, microphone, and internet connection 30 min before", completed: false },
    ],
    notes: "Focus on explaining trade-offs between accuracy and latency in large model deployments.",
    arohiAdvice: "Google interviewers appreciate structured problem-solving. Always state your assumptions first before jumping into architecture.",
  },
  {
    id: "evt-2",
    title: "UPSC CSE Personality Test Mock Practice",
    organization: "UPSC Board / Arohi AI",
    role: "Civil Services Officer",
    eventType: "mock_interview",
    date: "2026-08-02",
    time: "03:00 PM IST",
    durationMinutes: 45,
    interviewerName: "Arohi Govt Executive Panel",
    locationOrUrl: "Recruits.org.in Voice Mock Room",
    reminderTiming: "2_hours_before",
    status: "upcoming",
    focusTopics: [
      "Current Affairs & E-Governance Projects",
      "Odisha & Regional Public Policy",
      "Administrative Ethics & Decision Making",
    ],
    prepChecklist: [
      { id: "c10", text: "Revise DAF (Detailed Application Form) answers", completed: true },
      { id: "c11", text: "Review key government initiatives in MeitY and Digital India", completed: false },
      { id: "c12", text: "Practice calm, articulate voice delivery with Arohi AI Coach", completed: false },
    ],
    notes: "Focus on concise, balanced answers without extreme bias.",
    arohiAdvice: "Maintain a composed tone. If unsure about a fact, politely acknowledge it rather than guessing.",
  },
  {
    id: "evt-3",
    title: "SBI Specialist Officer (IT) Final Board Interview",
    organization: "State Bank of India (SBI)",
    role: "IT Specialist Officer (Scale II)",
    eventType: "actual_interview",
    date: "2026-08-10",
    time: "11:00 AM IST",
    durationMinutes: 30,
    interviewerName: "SBI Central Recruitment Board",
    locationOrUrl: "SBI Local Head Office, Mumbai / Hybrid",
    reminderTiming: "24_hours_before",
    status: "upcoming",
    focusTopics: [
      "Core Banking Solutions (CBS) Security",
      "Cyber Threat Assessment & RBI Compliance",
      "High-Availability Financial Transaction Processing",
    ],
    prepChecklist: [
      { id: "c20", text: "Download and print Interview Call Letter & Identity Cards", completed: false },
      { id: "c21", text: "Prepare 2-minute self-introduction tailored to Banking IT", completed: false },
      { id: "c22", text: "Revise RBI Cyber Security Framework guidelines", completed: false },
    ],
    notes: "Highlight experience with secure microservices and zero-downtime database migrations.",
    arohiAdvice: "Emphasize security compliance and transaction reliability; those are top priorities for SBI IT interviewers.",
  },
];

export const InterviewCoachEngine: React.FC<InterviewCoachEngineProps> = ({
  memory,
  selectedLanguage,
  isSpeaking,
  setIsSpeaking,
}) => {
  const [activeTab, setActiveTab] = useState<"voice_mock" | "quick_quiz" | "tone_analyzer" | "interview_calendar">("voice_mock");

  // Voice Mock Interview Room State
  const [role, setRole] = useState(memory.targetRole || "Full Stack AI Engineer");
  const [level, setLevel] = useState("Mid Level");
  const [topic, setTopic] = useState("Technical & System Architecture");

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [userAnswer, setUserAnswer] = useState("");
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  // Interview Calendar State
  const [calendarEvents, setCalendarEvents] = useState<InterviewCalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [calendarFilter, setCalendarFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newRole, setNewRole] = useState(memory.targetRole || "Senior AI Engineer");
  const [newEventType, setNewEventType] = useState<"mock_interview" | "actual_interview" | "prep_milestone">("actual_interview");
  const [newDate, setNewDate] = useState("2026-08-08");
  const [newTime, setNewTime] = useState("10:00 AM IST");
  const [newLocation, setNewLocation] = useState("Google Meet / Online");
  const [newReminder, setNewReminder] = useState<"30_min_before" | "2_hours_before" | "24_hours_before" | "1_day_before">("24_hours_before");
  const [newNotes, setNewNotes] = useState("");
  const [generatingAiChecklist, setGeneratingAiChecklist] = useState(false);

  // Stress Test Mode State
  const [isStressMode, setIsStressMode] = useState<boolean>(false);
  const [pressureLevel, setPressureLevel] = useState<"High Pressure" | "Tough Panel" | "Curveball Rapid Fire">("High Pressure");
  const [isNoiseActive, setIsNoiseActive] = useState<boolean>(false);
  const [noiseType, setNoiseType] = useState<NoiseType>("office");
  const [noiseVolume, setNoiseVolume] = useState<number>(0.25);
  const [loadingCurveball, setLoadingCurveball] = useState<boolean>(false);

  // Background Noise audio controller
  const toggleBackgroundNoise = (overrideType?: NoiseType) => {
    const typeToUse = overrideType || noiseType;
    if (overrideType && overrideType !== noiseType) {
      setNoiseType(overrideType);
    }
    if (isNoiseActive && !overrideType) {
      stressNoiseEngine.stopNoise();
      setIsNoiseActive(false);
    } else {
      stressNoiseEngine.startNoise(typeToUse, noiseVolume);
      setIsNoiseActive(true);
    }
  };

  useEffect(() => {
    if (isNoiseActive) {
      stressNoiseEngine.setVolume(noiseVolume);
    }
  }, [noiseVolume]);

  useEffect(() => {
    return () => {
      stressNoiseEngine.stopNoise();
    };
  }, []);

  const handleGenerateQuestions = async (roleOverride?: string, topicOverride?: string) => {
    const roleToUse = roleOverride || role;
    const topicToUse = topicOverride || topic;

    setLoadingQuestions(true);
    setEvaluation(null);
    setUserAnswer("");
    try {
      const res = await fetch("/api/ai/interview-coach/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleToUse,
          level,
          topic: topicToUse,
          isStressMode,
          pressureLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
        setCurrentQIndex(0);
        if (data.questions && data.questions.length > 0) {
          speakQuestion(data.questions[0].question);
        }
      }
    } catch (err) {
      console.error("Error generating interview questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const speakQuestion = (qText: string) => {
    setIsSpeaking(true);
    speakText({
      text: `Question ${currentQIndex + 1}: ${qText}`,
      language: selectedLanguage,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleTriggerCurveballFollowUp = async () => {
    if (!questions[currentQIndex]) return;
    setLoadingCurveball(true);
    try {
      const res = await fetch("/api/ai/interview-coach/curveball", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentQuestion: questions[currentQIndex].question,
          userAnswer: userAnswer || "Candidate gave preliminary initial response under high pressure.",
          role,
          pressureLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const cbQ: MockInterviewQuestion = data.curveballQuestion;
        if (cbQ && cbQ.question) {
          const updatedQuestions = [...questions];
          updatedQuestions.splice(currentQIndex + 1, 0, cbQ);
          setQuestions(updatedQuestions);
          setCurrentQIndex(currentQIndex + 1);
          setUserAnswer("");
          setEvaluation(null);

          if (isNoiseActive) {
            stressNoiseEngine.playPaChime();
          }

          speakQuestion(`PANEL CURVEBALL CHALLENGE: ${cbQ.question}`);
        }
      }
    } catch (err) {
      console.error("Error triggering curveball follow-up:", err);
    } finally {
      setLoadingCurveball(false);
    }
  };

  const handleToggleMic = () => {
    if (isListeningMic) {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      setIsListeningMic(false);
    } else {
      setIsListeningMic(true);
      const rec = listenToVoiceInput(
        selectedLanguage,
        (transcript) => {
          setUserAnswer(transcript);
        },
        (err) => {
          console.warn("Mic error:", err);
          setIsListeningMic(false);
        },
        () => {
          setIsListeningMic(false);
        }
      );
      setRecognitionInstance(rec);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim() || !questions[currentQIndex]) return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/ai/interview-coach/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQIndex].question,
          userAnswer,
          role,
          isStressMode,
          backgroundNoiseActive: isNoiseActive,
          pressureLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const evalData: InterviewEvaluation = data.evaluation;
        setEvaluation(evalData);

        if (evalData.mentorFeedbackSpeech) {
          setIsSpeaking(true);
          speakText({
            text: evalData.mentorFeedbackSpeech,
            language: selectedLanguage,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setUserAnswer("");
      setEvaluation(null);
      speakQuestion(questions[nextIdx].question);
    }
  };

  // CALENDAR FUNCTIONS
  const handleToggleChecklistItem = (eventId: string, checkId: string) => {
    setCalendarEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            prepChecklist: evt.prepChecklist.map((item) =>
              item.id === checkId ? { ...item, completed: !item.completed } : item
            ),
          };
        }
        return evt;
      })
    );
  };

  const handleAddCalendarEvent = async () => {
    if (!newTitle.trim() || !newOrg.trim()) return;

    setGeneratingAiChecklist(true);

    let generatedChecklist = [
      { id: "c1", text: "Review key domain concepts & technical resume projects", completed: false },
      { id: "c2", text: "Prepare STAR framework answers for top leadership scenarios", completed: false },
      { id: "c3", text: "Complete 1 practice session in Arohi Voice Mock Room", completed: false },
    ];
    let focusTopics = ["System Architecture", "Behavioral Leadership", "Domain Problem Solving"];
    let arohiAdvice = "Stay confident and structure your responses clearly.";

    try {
      const res = await fetch("/api/ai/interview-coach/calendar-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: newRole,
          organization: newOrg,
          eventType: newEventType,
          date: newDate,
          time: newTime,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.prepChecklist) generatedChecklist = data.prepChecklist;
        if (data.focusTopics) focusTopics = data.focusTopics;
        if (data.arohiAdvice) arohiAdvice = data.arohiAdvice;
      }
    } catch (err) {
      console.error("Error generating calendar checklist:", err);
    } finally {
      setGeneratingAiChecklist(false);
    }

    const newEvent: InterviewCalendarEvent = {
      id: "evt-" + Date.now(),
      title: newTitle,
      organization: newOrg,
      role: newRole,
      eventType: newEventType,
      date: newDate,
      time: newTime,
      durationMinutes: 45,
      locationOrUrl: newLocation,
      reminderTiming: newReminder,
      status: "upcoming",
      prepChecklist: generatedChecklist,
      focusTopics,
      notes: newNotes,
      arohiAdvice,
    };

    setCalendarEvents((prev) => [newEvent, ...prev]);
    setShowAddModal(false);
    // Reset form
    setNewTitle("");
    setNewOrg("");
    setNewNotes("");
  };

  const exportIcsCalendarFile = (evt: InterviewCalendarEvent) => {
    const dateFormatted = evt.date.replace(/-/g, "");
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Recruits.org.in//Interview Calendar//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${evt.title} (${evt.organization})`,
      `DESCRIPTION:${evt.notes || "Interview scheduled via Recruits.org.in Interview Coach"}`,
      `LOCATION:${evt.locationOrUrl}`,
      `DTSTART:${dateFormatted}T100000Z`,
      `DTEND:${dateFormatted}T110000Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${evt.title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLaunchMockPractice = (evt: InterviewCalendarEvent) => {
    setRole(evt.role);
    setTopic("Technical & System Architecture");
    setActiveTab("voice_mock");
    handleGenerateQuestions(evt.role, "Technical & System Architecture");
  };

  const filteredEvents = calendarEvents.filter((evt) => {
    if (calendarFilter === "all") return true;
    if (calendarFilter === "actual") return evt.eventType === "actual_interview";
    if (calendarFilter === "mock") return evt.eventType === "mock_interview";
    if (calendarFilter === "milestones") return evt.eventType === "prep_milestone";
    return true;
  });

  const nextUpcomingEvent = calendarEvents.find((evt) => evt.status === "upcoming");

  return (
    <div className="space-y-6">
      {/* HEADER WITH SUB-TAB TOGGLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Voice Interview Coach & Interview Calendar</h2>
              <p className="text-xs text-slate-400">
                Practice AI Voice Mock Sessions, Track Interview Schedules & Receive Automated Preparation Reminders
              </p>
            </div>
          </div>

          {/* Sub-Tab Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="tab-voice-mock"
              onClick={() => setActiveTab("voice_mock")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "voice_mock"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-300" /> Voice Mock Room
            </button>

            <button
              id="tab-quick-quiz"
              onClick={() => setActiveTab("quick_quiz")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "quick_quiz"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" /> 30s Quick Quiz
            </button>

            <button
              id="tab-tone-analyzer"
              onClick={() => setActiveTab("tone_analyzer")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "tone_analyzer"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-300" /> Tone Analyzer
            </button>

            <button
              id="tab-interview-calendar"
              onClick={() => setActiveTab("interview_calendar")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "interview_calendar"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-amber-300" /> Interview Calendar
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: VOICE MOCK INTERVIEW ROOM */}
      {activeTab === "voice_mock" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            {/* Setup Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Experience Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="Entry Level (0-2 Yrs)">Entry Level (0-2 Yrs)</option>
                  <option value="Mid Level (2-5 Yrs)">Mid Level (2-5 Yrs)</option>
                  <option value="Senior Level (5+ Yrs)">Senior Level (5+ Yrs)</option>
                  <option value="Lead / Managerial">Lead / Managerial</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Focus Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="Technical & System Architecture">Technical & System Architecture</option>
                  <option value="STAR Behavioral & Soft Skills">STAR Behavioral & Soft Skills</option>
                  <option value="System Design & Scalability">System Design & Scalability</option>
                  <option value="HR & Culture Fit">HR & Culture Fit</option>
                </select>
              </div>
            </div>

            {/* STRESS TEST MODE TOGGLE & CONFIGURATION BANNER */}
            <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
              isStressMode
                ? "bg-gradient-to-r from-rose-950/60 via-slate-950 to-amber-950/60 border-rose-500/50 shadow-lg shadow-rose-950/30"
                : "bg-slate-950/60 border-slate-800"
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isStressMode
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">High-Pressure Stress Test Mode</h4>
                      {isStressMode && (
                        <span className="bg-rose-500/20 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-500/40">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Simulate unexpected panel curveballs & intermittent ambient noise to build real-world interview resilience.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isStressMode}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        setIsStressMode(enabled);
                        if (enabled && !isNoiseActive) {
                          toggleBackgroundNoise("office");
                        } else if (!enabled && isNoiseActive) {
                          stressNoiseEngine.stopNoise();
                          setIsNoiseActive(false);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
              </div>

              {/* Stress Test Settings when enabled */}
              {isStressMode && (
                <div className="pt-2 border-t border-rose-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold mb-1 block">Pressure Intensity Level</label>
                    <select
                      value={pressureLevel}
                      onChange={(e) => setPressureLevel(e.target.value as any)}
                      className="w-full bg-slate-900 border border-rose-500/30 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-400"
                    >
                      <option value="High Pressure">High Pressure (Tough Questions & Noise)</option>
                      <option value="Tough Panel">Tough Board Panel (Aggressive Interjections)</option>
                      <option value="Curveball Rapid Fire">Curveball Rapid Fire (Continuous Pivots)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-rose-500/30 text-[11px] text-rose-200">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Panel will introduce unexpected follow-ups and background noise during your response.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="btn-start-mock-interview"
              onClick={() => handleGenerateQuestions()}
              disabled={loadingQuestions}
              className={`w-full py-3 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer ${
                isStressMode
                  ? "bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-600/30"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20"
              }`}
            >
              {loadingQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Preparing Arohi Mock Interview Stage...
                </>
              ) : isStressMode ? (
                <>
                  <Flame className="w-4 h-4 text-amber-200 animate-pulse" /> Launch High-Pressure Stress Test Session
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-emerald-300" /> Start Standard Mock Interview Session
                </>
              )}
            </button>
          </div>

          {/* Active Mock Interview Room */}
          {questions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6">
              {/* INTERMITTENT BACKGROUND NOISE CONTROL SIMULATOR PANEL */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleBackgroundNoise()}
                      className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                        isNoiseActive
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {isNoiseActive ? <Radio className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                      <span className="text-xs font-extrabold">
                        {isNoiseActive ? "Ambient Sound Active" : "Enable Noise Simulation"}
                      </span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      Simulates intermittent background distraction during voice response
                    </span>
                  </div>

                  {/* Noise Volume Slider */}
                  {isNoiseActive && (
                    <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="range"
                        min="0.05"
                        max="0.6"
                        step="0.05"
                        value={noiseVolume}
                        onChange={(e) => setNoiseVolume(parseFloat(e.target.value))}
                        className="w-20 accent-amber-400 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-300 font-bold">{Math.round(noiseVolume * 100)}%</span>
                    </div>
                  )}
                </div>

                {/* Soundscape Type Selectors */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Soundscapes:</span>
                  <button
                    onClick={() => toggleBackgroundNoise("office")}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition border cursor-pointer ${
                      noiseType === "office" && isNoiseActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    🏢 Corporate Open-Office
                  </button>
                  <button
                    onClick={() => toggleBackgroundNoise("cafe")}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition border cursor-pointer ${
                      noiseType === "cafe" && isNoiseActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    ☕ Busy Tech Cafe
                  </button>
                  <button
                    onClick={() => toggleBackgroundNoise("announcement")}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition border cursor-pointer ${
                      noiseType === "announcement" && isNoiseActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    ✈️ PA Announcement Chime
                  </button>
                  <button
                    onClick={() => toggleBackgroundNoise("static")}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition border cursor-pointer ${
                      noiseType === "static" && isNoiseActive
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    ⚡ Line Dropouts & Static
                  </button>

                  {isNoiseActive && (
                    <button
                      onClick={() => stressNoiseEngine.playPaChime()}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-xl text-[10px] font-bold border border-slate-800 transition cursor-pointer ml-auto"
                    >
                      🔔 Test PA Chime
                    </button>
                  )}
                </div>
              </div>

              {/* Room Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">{questions[currentQIndex]?.type} Question</span>
                  {questions[currentQIndex]?.isCurveballFollowUp && (
                    <span className="text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Panel Curveball
                    </span>
                  )}
                </div>

                <button
                  onClick={() => speakQuestion(questions[currentQIndex].question)}
                  className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Re-play Audio
                </button>
              </div>

              {/* CURVEBALL ALERT BANNER IF CURRENT QUESTION IS A CURVEBALL */}
              {questions[currentQIndex]?.isCurveballFollowUp && (
                <div className="bg-rose-950/70 border border-rose-500/50 p-4 rounded-2xl flex items-start gap-3 text-rose-200 shadow-xl">
                  <div className="p-2 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30 shrink-0">
                    <Flame className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-rose-300 uppercase tracking-wide">
                        UNEXPECTED PANEL CURVEBALL
                      </span>
                      <span className="text-[10px] bg-rose-500/30 text-rose-100 px-2 py-0.5 rounded-full font-bold">
                        STRESS CHALLENGE
                      </span>
                    </div>
                    <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                      {questions[currentQIndex]?.stressTriggerReason ||
                        "The interview panel introduced an unexpected follow-up constraint. State your core logic calmly."}
                    </p>
                  </div>
                </div>
              )}

              {/* Question Text */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white leading-relaxed">
                  "{questions[currentQIndex]?.question}"
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] text-slate-400">
                  <span>Expected Key Themes:</span>
                  {questions[currentQIndex]?.expectedKeyPoints?.map((pt, pIdx) => (
                    <span key={pIdx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Your Response (Type or Speak into Microphone)
                  </label>
                  <button
                    onClick={handleToggleMic}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      isListeningMic
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    {isListeningMic ? "Recording Audio... (Click to Stop)" : "Speak via Microphone"}
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Click microphone or type your answer using the STAR method (Situation, Task, Action, Result)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    id="btn-trigger-stress-curveball"
                    onClick={handleTriggerCurveballFollowUp}
                    disabled={loadingCurveball}
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/30 disabled:opacity-50 cursor-pointer"
                  >
                    {loadingCurveball ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Panel Interjecting...
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 text-amber-200" /> Trigger Panel Curveball
                      </>
                    )}
                  </button>

                  <button
                    id="btn-evaluate-interview-ans"
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Answer...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" /> Evaluate Response
                      </>
                    )}
                  </button>
                </div>

                {/* Embedded Live Tone Analyzer Panel */}
                <div className="pt-2">
                  <ToneAnalyzer
                    isRecording={isListeningMic}
                    liveText={userAnswer}
                    toneData={evaluation?.toneAnalysis}
                  />
                </div>
              </div>

              {/* Evaluation Scorecard */}
              {evaluation && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-emerald-500 rounded-xl text-white font-extrabold text-xl">
                        {evaluation.score}/100
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Arohi Feedback Evaluation</h4>
                        <p className="text-xs text-slate-400">Response & Composure Analysis</p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
                        Clarity: <strong className="text-indigo-300">{evaluation.clarityScore}%</strong>
                      </span>
                      <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
                        Depth: <strong className="text-emerald-300">{evaluation.technicalDepthScore}%</strong>
                      </span>
                      <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
                        STAR: <strong className="text-amber-300">{evaluation.starAlignmentScore}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* HIGH PRESSURE STRESS RESILIENCE SCORECARD PANEL */}
                  {(isStressMode || evaluation.stressResilienceScore !== undefined) && (
                    <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-rose-500/30 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-extrabold text-white">Stress Test Resilience Metrics</span>
                        </div>
                        <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {evaluation.stressRecoveryLabel || "Composed & Adaptive"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[11px] block">Pressure Resilience</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-extrabold text-rose-300">
                              {evaluation.stressResilienceScore || 88}%
                            </span>
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-rose-500 h-full rounded-full"
                                style={{ width: `${evaluation.stressResilienceScore || 88}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[11px] block">Composure Under Noise</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-extrabold text-amber-300">
                              {evaluation.composureUnderNoiseScore || 85}%
                            </span>
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-400 h-full rounded-full"
                                style={{ width: `${evaluation.composureUnderNoiseScore || 85}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[11px] block">Adaptability & Pivot</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-extrabold text-emerald-300">
                              {evaluation.adaptabilityScore || 90}%
                            </span>
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-400 h-full rounded-full"
                                style={{ width: `${evaluation.adaptabilityScore || 90}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {evaluation.stressPressureAdvice && evaluation.stressPressureAdvice.length > 0 && (
                        <div className="text-[11px] text-slate-300 space-y-1 pt-1">
                          <span className="font-bold text-rose-300 block">Pressure Handling Feedback:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                            {evaluation.stressPressureAdvice.map((adv, aIdx) => (
                              <li key={aIdx}>{adv}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-emerald-400 block mb-1">Strengths:</span>
                      <ul className="space-y-1 text-slate-300">
                        {evaluation.strengths.map((s, idx) => (
                          <li key={idx}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-amber-400 block mb-1">Areas for Improvement:</span>
                      <ul className="space-y-1 text-slate-300">
                        {evaluation.improvements.map((imp, idx) => (
                          <li key={idx}>• {imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-indigo-950/30 border border-indigo-800/40 p-3.5 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-indigo-300 block">Ideal STAR Response Outline:</span>
                    <p className="text-slate-200 leading-relaxed">{evaluation.sampleIdealResponse}</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      id="btn-next-interview-q"
                      onClick={handleNextQuestion}
                      disabled={currentQIndex >= questions.length - 1}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      Next Question <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 30S QUICK QUIZ VIEW */}
      {activeTab === "quick_quiz" && (
        <div className="space-y-6">
          <QuickQuiz selectedLanguage={selectedLanguage} />
        </div>
      )}

      {/* TAB 3: STANDALONE TONE ANALYZER VIEW */}
      {activeTab === "tone_analyzer" && (
        <div className="space-y-6">
          <ToneAnalyzer
            isRecording={isListeningMic}
            liveText={userAnswer}
            toneData={evaluation?.toneAnalysis}
          />
        </div>
      )}

      {/* TAB 3: INTERVIEW CALENDAR & REMINDERS */}
      {activeTab === "interview_calendar" && (
        <div className="space-y-6">
          {/* Automated Reminder Alert Banner */}
          {nextUpcomingEvent && (
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/40 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-2xl shrink-0">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                      Upcoming Interview Reminder
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-md border border-amber-500/30 font-bold">
                      {nextUpcomingEvent.date} @ {nextUpcomingEvent.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {nextUpcomingEvent.title} ({nextUpcomingEvent.organization})
                  </h4>
                  {nextUpcomingEvent.arohiAdvice && (
                    <p className="text-xs text-amber-200/90 italic mt-1">
                      💡 Arohi Preparation Tip: "{nextUpcomingEvent.arohiAdvice}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => exportIcsCalendarFile(nextUpcomingEvent)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" /> Export iCal
                </button>

                {nextUpcomingEvent.eventType === "mock_interview" && (
                  <button
                    onClick={() => handleLaunchMockPractice(nextUpcomingEvent)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Practice Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Metrics & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block">Total Events</span>
                  <span className="text-lg font-bold text-white">{calendarEvents.length}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block">Job Interviews</span>
                  <span className="text-lg font-bold text-amber-400">
                    {calendarEvents.filter((e) => e.eventType === "actual_interview").length}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">Mock Sessions</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {calendarEvents.filter((e) => e.eventType === "mock_interview").length}
                  </span>
                </div>
              </div>

              <button
                id="btn-add-interview-event"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Schedule Interview / Mock
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Filter View:</span>
              {[
                { id: "all", label: "All Events" },
                { id: "actual", label: "Job Interviews" },
                { id: "mock", label: "Mock Practice" },
                { id: "milestones", label: "Prep Milestones" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCalendarFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                    calendarFilter === tab.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 text-white shadow-xl space-y-4 transition"
              >
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${
                          evt.eventType === "actual_interview"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : evt.eventType === "mock_interview"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                        }`}
                      >
                        {evt.eventType === "actual_interview"
                          ? "🎯 Job Interview"
                          : evt.eventType === "mock_interview"
                          ? "🎙️ Mock Practice"
                          : "📌 Prep Milestone"}
                      </span>

                      <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Bell className="w-2.5 h-2.5 text-amber-400" /> Reminder: {evt.reminderTiming.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{evt.title}</h3>
                    <p className="text-xs text-slate-300 font-medium">{evt.organization} • {evt.role}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => exportIcsCalendarFile(evt)}
                      className="p-2 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Download .ics Calendar Sync"
                    >
                      <Download className="w-3.5 h-3.5" /> iCal
                    </button>

                    {evt.eventType === "mock_interview" && (
                      <button
                        onClick={() => handleLaunchMockPractice(evt)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Launch Practice
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Date & Time</span>
                      <span className="font-bold text-slate-200">{evt.date} @ {evt.time}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Location / Platform</span>
                      <span className="font-semibold text-slate-200 line-clamp-1">{evt.locationOrUrl}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Interviewer / Board</span>
                      <span className="font-semibold text-slate-200 line-clamp-1">
                        {evt.interviewerName || "Board Panel"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Focus Topics */}
                {evt.focusTopics && evt.focusTopics.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Key Preparation Focus Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {evt.focusTopics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="bg-slate-950 text-indigo-300 border border-indigo-900/60 text-[10px] px-2.5 py-0.5 rounded-lg font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive AI Preparation Checklist */}
                <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-400" /> AI Tailored Preparation Checklist
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {evt.prepChecklist.filter((c) => c.completed).length} / {evt.prepChecklist.length} Tasks Done
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {evt.prepChecklist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleToggleChecklistItem(evt.id, item.id)}
                        className={`w-full flex items-start gap-2 text-left p-2 rounded-xl transition cursor-pointer text-xs ${
                          item.completed
                            ? "bg-emerald-950/30 text-slate-400 line-through border border-emerald-900/30"
                            : "bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD / SCHEDULE INTERVIEW MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-lg w-full space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Schedule Interview & Reminders</h3>
                    <p className="text-xs text-slate-400">
                      Sync upcoming job interviews or set up structured voice mock sessions
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Interview Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Google Senior AI Engineer Technical Round"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Organization / Board</label>
                      <input
                        type="text"
                        value={newOrg}
                        onChange={(e) => setNewOrg(e.target.value)}
                        placeholder="e.g., Google India / UPSC"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Target Role</label>
                      <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Event Type</label>
                      <select
                        value={newEventType}
                        onChange={(e: any) => setNewEventType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="actual_interview">🎯 Job Interview</option>
                        <option value="mock_interview">🎙️ Mock Practice</option>
                        <option value="prep_milestone">📌 Prep Milestone</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Automated Reminder</label>
                      <select
                        value={newReminder}
                        onChange={(e: any) => setNewReminder(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="30_min_before">30 Min Before</option>
                        <option value="2_hours_before">2 Hours Before</option>
                        <option value="24_hours_before">24 Hours Before</option>
                        <option value="1_day_before">1 Day Before</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1 block">Time</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        placeholder="e.g., 10:30 AM IST"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Location / Meeting URL</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g., Google Meet / Office Address"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Key Preparation Notes</label>
                    <textarea
                      rows={2}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="e.g., Focus on system design, distributed caching, and leadership questions..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddCalendarEvent}
                  disabled={generatingAiChecklist || !newTitle.trim() || !newOrg.trim()}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  {generatingAiChecklist ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Arohi Generating AI Checklist...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" /> Save & Generate AI Prep Checklist
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
