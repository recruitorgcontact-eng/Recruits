import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BarChart3,
  Flame,
  Volume2,
  VolumeX,
  Lightbulb,
  ShieldAlert,
  Brain,
  Check,
} from "lucide-react";
import { QuickQuizQuestion, QuickQuizResult, LanguageCode } from "../types";
import { speakText, stopSpeech } from "../utils/speech";

interface QuickQuizProps {
  selectedLanguage?: LanguageCode;
  onQuizComplete?: (result: QuickQuizResult) => void;
}

const DEFAULT_QUIZ_QUESTIONS: QuickQuizQuestion[] = [
  {
    id: "qq-1",
    question: "When designing a high-throughput distributed cache to handle 100K reads/sec, which strategy best mitigates the Cache Stampede (Thundering Herd) problem?",
    category: "system_design",
    options: [
      "Increase cache TTL dynamically for all keys",
      "Use Probabilistic Early Expiration (e.g. XFetch) or Mutex Locking on cache miss",
      "Switch from Redis to Memcached for higher RAM throughput",
      "Bypass cache completely and use read-replicas"
    ],
    correctAnswerIndex: 1,
    explanation: "Cache Stampede occurs when many concurrent requests miss cache simultaneously after key expiration. Using probabilistic early expiration or mutex locks ensures only ONE worker computes the cache miss while others wait or receive stale data safely.",
    keyTakeaway: "Always use Mutex Locks or Probabilistic Expiration for hot cache keys to protect DBs from sudden traffic spikes.",
    timeLimitSeconds: 30
  },
  {
    id: "qq-2",
    question: "In React 18+, why should updating component state directly inside the body of a functional component be strictly avoided?",
    category: "technical",
    options: [
      "It causes JavaScript syntax compilation errors",
      "It triggers an immediate re-render on every render loop, causing infinite re-render cycles",
      "React state is read-only and cannot be updated without a custom hook",
      "It disables Server-Side Rendering (SSR) compatibility"
    ],
    correctAnswerIndex: 1,
    explanation: "Updating state in the component body runs on every single render execution. Updating state schedules a re-render, which runs the component body again, causing an unhandled infinite render loop and crashing browser memory.",
    keyTakeaway: "State setters must only be invoked inside event handlers (e.g. onClick) or inside useEffect with proper dependencies.",
    timeLimitSeconds: 30
  },
  {
    id: "qq-3",
    question: "Situational STAR scenario: A critical production API endpoint latency spikes from 80ms to 4,500ms during peak hours. What is your FIRST immediate action as lead engineer?",
    category: "situational",
    options: [
      "Immediately rewrite the entire database schema to PostgreSQL partitions",
      "Check APM metrics/logs to isolate the bottleneck (e.g., slow queries, connection pool saturation) and apply mitigation (e.g., rate-limiting or scaling)",
      "Blame the junior developer who opened a PR yesterday",
      "Disable all user authentication to decrease request payload size"
    ],
    correctAnswerIndex: 1,
    explanation: "In production incidents, rapid triage via telemetry (APM, logs, trace spans) precedes any code changes. Isolating the root bottleneck (e.g. DB connection exhaustion) allows quick mitigation (scaling workers, adding circuit breakers) before permanent bug fixes.",
    keyTakeaway: "Diagnose with telemetry first, mitigate impact second, apply long-term refactor third.",
    timeLimitSeconds: 30
  },
  {
    id: "qq-4",
    question: "Which database indexing principle is crucial for optimizing composite multi-column indexes (e.g., INDEX(status, created_at, user_id)) in SQL?",
    category: "technical",
    options: [
      "Leftmost Prefix Rule: Queries must filter on the indexed columns starting from the leftmost column in order to utilize the index",
      "Alphabetical Ordering Rule: Columns in composite indexes must always be listed alphabetically",
      "Random Scan Rule: Composite indexes ignore column order automatically",
      "Primary Key Rule: Composite indexes can only contain primary keys"
    ],
    correctAnswerIndex: 0,
    explanation: "The Leftmost Prefix Rule dictates that a B-tree composite index (A, B, C) can be used for queries filtering on (A), (A, B), or (A, B, C), but CANNOT be used for queries filtering solely on (B) or (C).",
    keyTakeaway: "Order composite index columns by query equality filters first, followed by range/sort filters.",
    timeLimitSeconds: 30
  },
  {
    id: "qq-5",
    question: "Situational Leadership: A cross-functional team member pushes back on adopting strict API schemas and TypeScript types, claiming 'it slows down rapid prototyping'. How do you respond?",
    category: "situational",
    options: [
      "Force them to use it by revoking their Git merge permissions",
      "Demonstrate concrete trade-offs: early compile-time bug detection saves 10x debugging hours in QA, and offer auto-generated type tools to reduce overhead",
      "Agree with them and drop all type checking across the entire product",
      "Escalate directly to executive management without discussing with the teammate"
    ],
    correctAnswerIndex: 1,
    explanation: "Effective technical leadership relies on objective trade-off analysis and empathetic onboarding. Showing how auto-generated OpenAPI types reduce boilerplate while catching bugs early resolves friction constructively.",
    keyTakeaway: "Align team standards around developer velocity + system quality rather than dogmatic enforcement.",
    timeLimitSeconds: 30
  }
];

export const QuickQuiz: React.FC<QuickQuizProps> = ({
  selectedLanguage = "en" as LanguageCode,
  onQuizComplete,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [quizQuestions, setQuizQuestions] = useState<QuickQuizQuestion[]>(DEFAULT_QUIZ_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [audioReadoutEnabled, setAudioReadoutEnabled] = useState<boolean>(false);

  // User answers record
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedIndex: number | null; isCorrect: boolean; timeTakenSeconds: number }[]
  >([]);

  const timerRef = useRef<any>(null);
  const currentQuestion = quizQuestions[currentIdx];

  // Timer logic for 30-second countdown
  useEffect(() => {
    if (quizFinished || isAnswerSubmitted) return;

    setTimeLeft(currentQuestion?.timeLimitSeconds || 30);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isAnswerSubmitted, quizFinished]);

  // Handle timeout when 30s expires
  const handleTimeOut = () => {
    if (isAnswerSubmitted || quizFinished) return;
    setIsAnswerSubmitted(true);

    const timeTaken = currentQuestion?.timeLimitSeconds || 30;
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

    const newRecord = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
      timeTakenSeconds: timeTaken,
    };

    setUserAnswers((prev) => [...prev, newRecord]);

    if (audioReadoutEnabled) {
      speakText({
        text: `Time's up! The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`,
        language: selectedLanguage,
      });
    }
  };

  // Submit current question choice
  const handleSelectOption = (optIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsAnswerSubmitted(true);
    const timeTaken = (currentQuestion.timeLimitSeconds || 30) - timeLeft;
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

    const newRecord = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
      timeTakenSeconds: timeTaken,
    };

    setUserAnswers((prev) => [...prev, newRecord]);

    if (audioReadoutEnabled) {
      speakText({
        text: isCorrect
          ? "Correct! Excellent choice."
          : `Incorrect. The optimal answer is: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`,
        language: selectedLanguage,
      });
    }
  };

  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
    } else {
      setQuizFinished(true);
      calculateAndSendResult();
    }
  };

  // Calculate final scorecard result
  const calculateAndSendResult = () => {
    const totalQ = quizQuestions.length;
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const scorePct = Math.round((correctCount / totalQ) * 100);
    const avgTime = Math.round(
      userAnswers.reduce((acc, curr) => acc + curr.timeTakenSeconds, 0) / (totalQ || 1)
    );

    let feedback = "Solid technical foundations. Keep refining system architecture trade-offs!";
    if (scorePct >= 80) {
      feedback = "Outstanding Executive Level mastery! High accuracy and rapid response speed.";
    } else if (scorePct < 60) {
      feedback = "Good practice effort! Focus on situational STAR frameworks and composite database index rules.";
    }

    const result: QuickQuizResult = {
      totalQuestions: totalQ,
      correctCount,
      scorePercentage: scorePct,
      averageTimeSeconds: avgTime,
      feedbackSummary: feedback,
      answers: userAnswers,
    };

    if (onQuizComplete) {
      onQuizComplete(result);
    }
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizFinished(false);
    setUserAnswers([]);
    setTimeLeft(30);
  };

  // Filter questions by category
  const handleCategoryFilterChange = (cat: string) => {
    setCategoryFilter(cat);
    let filtered = DEFAULT_QUIZ_QUESTIONS;
    if (cat !== "all") {
      filtered = DEFAULT_QUIZ_QUESTIONS.filter((q) => q.category === cat);
    }
    setQuizQuestions(filtered.length > 0 ? filtered : DEFAULT_QUIZ_QUESTIONS);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizFinished(false);
    setUserAnswers([]);
    setTimeLeft(30);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-lg space-y-6">
      {/* TOP BAR & CATEGORY SELECTOR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 rounded-2xl text-white shadow-md">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">30-Second Interview Quick Quiz</h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-600" /> Rapid Fire Evaluation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Test technical depth & situational decision-making under real 30s pressure
            </p>
          </div>
        </div>

        {/* Action Controls & Category Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            {["all", "technical", "situational", "system_design"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryFilterChange(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat === "all" ? "All Domains" : cat.replace("_", " ")}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAudioReadoutEnabled(!audioReadoutEnabled)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              audioReadoutEnabled
                ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
            title="Toggle Voice Readout"
          >
            {audioReadoutEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* QUIZ IN PROGRESS VIEW */}
      {!quizFinished && currentQuestion && (
        <div className="space-y-5">
          {/* QUESTION HEADER & 30S TIMER BAR */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" /> Question {currentIdx + 1} of {quizQuestions.length}
              </span>

              {/* 30-Second Countdown Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-extrabold text-xs border transition-all ${
                  timeLeft <= 10
                    ? "bg-rose-100 text-rose-800 border-rose-300 animate-bounce"
                    : "bg-amber-100 text-amber-900 border-amber-300"
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s remaining</span>
              </div>
            </div>

            {/* Visual Timer Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? "bg-rose-500" : "bg-gradient-to-r from-amber-500 to-indigo-600"
                }`}
                style={{ width: `${(timeLeft / (currentQuestion.timeLimitSeconds || 30)) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug pt-1">
              {currentQuestion.question}
            </h4>
          </div>

          {/* OPTIONS LIST */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOpt = currentQuestion.correctAnswerIndex === optIdx;

              let optionStyle = "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50";

              if (isAnswerSubmitted) {
                if (isCorrectOpt) {
                  optionStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-md";
                } else if (isSelected && !isCorrectOpt) {
                  optionStyle = "bg-rose-50 border-rose-400 text-rose-950";
                } else {
                  optionStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold shadow-md";
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-2xl border text-left transition duration-200 flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isAnswerSubmitted && isCorrectOpt
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : isAnswerSubmitted && isSelected && !isCorrectOpt
                        ? "bg-rose-600 border-rose-500 text-white"
                        : isSelected
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "border-slate-300 bg-slate-100 text-slate-700"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed flex-1">{optionText}</span>

                  {isAnswerSubmitted && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* SUBMIT OR NEXT BUTTON & INSTANT EXPLANATION BREAKDOWN */}
          {!isAnswerSubmitted ? (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                {selectedOption === currentQuestion.correctAnswerIndex ? (
                  <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Correct Answer (+1 Point)
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1.5 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                    <XCircle className="w-4 h-4 text-rose-700" /> Incorrect Answer
                  </span>
                )}
              </div>

              {/* Detailed Explanation Breakdown */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" /> Explanation Breakdown
                </h5>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Key Takeaway */}
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-indigo-950 font-bold">Executive Key Takeaway:</strong>
                  <span>{currentQuestion.keyTakeaway}</span>
                </div>
              </div>

              {/* Next Question Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentIdx + 1 < quizQuestions.length ? "Next 30s Question" : "View Final Quiz Scorecard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINAL SCORECARD BREAKDOWN VIEW */}
      {quizFinished && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">Quiz Completed!</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                30-Second Rapid Evaluation Summary & Performance Breakdown
              </p>
            </div>

            {/* Scorecard Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Accuracy Score</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {Math.round((userAnswers.filter((a) => a.isCorrect).length / quizQuestions.length) * 100)}%
                </div>
                <span className="text-[10px] text-slate-500">
                  {userAnswers.filter((a) => a.isCorrect).length} / {quizQuestions.length} Correct
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Average Response Pace</span>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                  {Math.round(
                    userAnswers.reduce((acc, curr) => acc + curr.timeTakenSeconds, 0) / (quizQuestions.length || 1)
                  )}s
                </div>
                <span className="text-[10px] text-slate-500">Per Question (30s Limit)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Evaluation Level</span>
                <div className="text-base font-extrabold text-emerald-700 pt-1">
                  {userAnswers.filter((a) => a.isCorrect).length >= 4 ? "Executive Ready" : "Proficient Developer"}
                </div>
                <span className="text-[10px] text-emerald-800 font-bold">Arohi AI Scorecard</span>
              </div>
            </div>

            {/* Arohi AI Executive Feedback Summary */}
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-left space-y-1.5">
              <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Arohi Coach Feedback
              </h5>
              <p className="text-xs sm:text-sm text-indigo-950">
                {userAnswers.filter((a) => a.isCorrect).length >= 4
                  ? "Outstanding speed and technical precision under 30-second constraints! You demonstrated solid mastery over cache stampede mitigation, leftmost index rules, and situational incident response."
                  : "Good effort under time pressure! Review leftmost prefix indexing rules and mutex locking patterns to sharpen your high-throughput system design answers."}
              </p>
            </div>
          </div>

          {/* PER-QUESTION DETAILED REVIEW LIST */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" /> Detailed Question Breakdown
            </h4>

            <div className="space-y-3">
              {quizQuestions.map((q, idx) => {
                const userAns = userAnswers.find((a) => a.questionId === q.id);
                const isCorrect = userAns?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-extrabold text-slate-400">Q{idx + 1}.</span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{q.question}</h5>
                      </div>
                      {isCorrect ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3 text-emerald-700" /> Correct
                        </span>
                      ) : (
                        <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-3 h-3 text-rose-700" /> Missed
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-700 pt-1">
                      <div>
                        <strong className="text-slate-500">Optimal Answer:</strong>{" "}
                        <span className="text-emerald-800 font-semibold">{q.options[q.correctAnswerIndex]}</span>
                      </div>
                      <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RESTART BUTTON */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-600 hover:opacity-90 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry 30s Quick Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
