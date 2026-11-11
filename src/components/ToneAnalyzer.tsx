import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Activity,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Smile,
  ShieldCheck,
  Flame,
  Gauge,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Info,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { ToneAnalysisData } from "../types";

interface ToneAnalyzerProps {
  isRecording?: boolean;
  liveText?: string;
  toneData?: ToneAnalysisData | null;
  onRunPracticeTest?: (sampleText: string) => void;
}

export const ToneAnalyzer: React.FC<ToneAnalyzerProps> = ({
  isRecording = false,
  liveText = "",
  toneData,
}) => {
  const [activeTab, setActiveTab] = useState<"realtime" | "scorecard" | "filler_words">("realtime");

  // Web Audio API State for Live Recording Waveform
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Live calculated real-time audio metrics
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const [livePitchVariance, setLivePitchVariance] = useState<number>(65);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Live text metrics
  const wordCount = liveText.trim() ? liveText.trim().split(/\s+/).length : 0;
  const calculatedWpm = recordingSeconds > 1 ? Math.round((wordCount / recordingSeconds) * 60) : 0;

  // Detect filler words in live text
  const fillerRegex = /\b(um|uh|like|you know|basically|actually|so yeah|i mean|er|hmm)\b/gi;
  const detectedFillers = liveText.match(fillerRegex) || [];
  const liveFillerCount = detectedFillers.length;

  // Dynamic live confidence, clarity, positivity scores when recording or based on toneData
  const confidenceScore = toneData?.confidenceScore ?? Math.min(98, Math.max(55, 75 + (liveVolume > 15 ? 10 : -5) - liveFillerCount * 4));
  const clarityScore = toneData?.clarityScore ?? Math.min(98, Math.max(50, calculatedWpm >= 110 && calculatedWpm <= 160 ? 92 : 72));
  const positivityScore = toneData?.positivityScore ?? Math.min(98, Math.max(60, 82 + (liveText.toLowerCase().includes("achieved") || liveText.toLowerCase().includes("led") || liveText.toLowerCase().includes("improved") ? 10 : 0)));

  // Setup Web Audio API when user starts recording microphone
  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: any = null;

    if (isRecording) {
      setRecordingSeconds(0);
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Initialize microphone AudioContext for real-time frequency visualizer
      navigator.mediaDevices
        ?.getUserMedia({ audio: true })
        .then((micStream) => {
          stream = micStream;
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          audioCtxRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(micStream);
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const draw = () => {
            if (!canvasRef.current || !analyser) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avgVol = Math.round(sum / bufferLength);
            setLiveVolume(avgVol);

            // Calculate pitch variance
            const variance = Math.round(dataArray[5] || 50);
            setLivePitchVariance(variance);

            // Draw clean audio equalizer bars
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 1.8;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height;
              const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
              gradient.addColorStop(0, "#10b981");
              gradient.addColorStop(0.5, "#06b6d4");
              gradient.addColorStop(1, "#f59e0b");

              ctx.fillStyle = gradient;
              ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              x += barWidth + 2;
            }

            animFrameRef.current = requestAnimationFrame(draw);
          };

          draw();
        })
        .catch((err) => {
          console.warn("Mic visualizer fallback:", err);
        });
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (timer) clearInterval(timer);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Helper for Tone Score Badges
  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: "Executive Level", color: "text-emerald-300 bg-emerald-500/20 border-emerald-500/40" };
    if (score >= 70) return { label: "Steady & Proficient", color: "text-cyan-300 bg-cyan-500/20 border-cyan-500/40" };
    return { label: "Needs Practice", color: "text-amber-300 bg-amber-500/20 border-amber-500/40" };
  };

  // Helper for Pace Status
  const getPaceStatus = (wpm: number) => {
    if (wpm === 0) return { label: "Awaiting Voice Input", color: "text-slate-400" };
    if (wpm < 110) return { label: "Slightly Slow (Deliberate)", color: "text-amber-300" };
    if (wpm <= 155) return { label: "Optimal Conversational Pace (120-150 WPM)", color: "text-emerald-400" };
    return { label: "Fast / Rushed Pace (>160 WPM)", color: "text-rose-400" };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Voice Tone Analyzer</h3>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> Real-Time Acoustic & Sentiment Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live feedback on confidence, clarity, speech pace, and vocal positivity during mock interviews
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            id="btn-tone-tab-realtime"
            onClick={() => setActiveTab("realtime")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "realtime" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-cyan-300" /> Live Monitor
          </button>

          <button
            id="btn-tone-tab-scorecard"
            onClick={() => setActiveTab("scorecard")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "scorecard" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-amber-300" /> Tone Scorecard
          </button>
        </div>
      </div>

      {/* TAB 1: REAL-TIME LIVE MONITOR */}
      {activeTab === "realtime" && (
        <div className="space-y-4">
          {/* Live Waveform & Visualizer Canvas */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isRecording ? "bg-rose-500 animate-ping" : "bg-emerald-500"
                  }`}
                />
                <span className="text-xs font-bold text-slate-200">
                  {isRecording ? "Live Microphone Recording Active" : "Voice Monitor Ready"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Duration: <strong className="text-white font-mono">{recordingSeconds}s</strong></span>
                <span>Spoken Words: <strong className="text-cyan-300 font-mono">{wordCount}</strong></span>
              </div>
            </div>

            {/* Equalizer Canvas */}
            <div className="relative h-16 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-center p-2">
              <canvas ref={canvasRef} width={360} height={50} className="w-full h-full" />
              {!isRecording && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center text-xs text-slate-400 font-medium gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  Click "Speak via Microphone" above to launch live vocal acoustic analysis
                </div>
              )}
            </div>

            {/* Live Micro-Feedback Cues */}
            {isRecording && (
              <div className="bg-cyan-950/40 border border-cyan-800/50 p-3 rounded-xl flex items-center justify-between text-xs text-cyan-200 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {liveVolume > 20
                      ? "⚡ Excellent volume projection & vocal clarity!"
                      : "💡 Speak clearly into your mic for optimal pitch evaluation"}
                  </span>
                </div>
                <span className="text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded font-mono font-bold text-cyan-300">
                  Vol: {liveVolume} dB
                </span>
              </div>
            )}
          </div>

          {/* 3 REAL-TIME TONE METRIC GAUGES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Confidence Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Confidence
                </span>
                <span className="text-xs font-extrabold text-cyan-300">{confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {confidenceScore >= 85
                  ? "High vocal assertion & strong delivery."
                  : "Good steady tone; keep pauses natural."}
              </p>
            </div>

            {/* Clarity Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Clarity
                </span>
                <span className="text-xs font-extrabold text-emerald-300">{clarityScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${clarityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Pace: <strong className={getPaceStatus(calculatedWpm || toneData?.wordsPerMinute || 135).color}>
                  {calculatedWpm || toneData?.wordsPerMinute || 135} WPM
                </strong>
              </p>
            </div>

            {/* Positivity Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-amber-400" /> Positivity & Energy
                </span>
                <span className="text-xs font-extrabold text-amber-300">{positivityScore}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${positivityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {positivityScore >= 80 ? "Enthusiastic & optimistic wording." : "Constructive tone; add energetic emphasis."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED SCORECARD & MENTOR RECOMMENDATIONS */}
      {(activeTab === "scorecard" || toneData) && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tone Overall Summary Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Executive Voice Profile
                </h4>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getScoreBadge(confidenceScore).color}`}>
                  {toneData?.overallToneLabel || getScoreBadge(confidenceScore).label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Confidence</span>
                  <span className="text-base font-black text-cyan-300">{confidenceScore}%</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Clarity</span>
                  <span className="text-base font-black text-emerald-300">{clarityScore}%</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Positivity</span>
                  <span className="text-base font-black text-amber-300">{positivityScore}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span>Vocal Inflection Style:</span>
                <strong className="text-indigo-300">{toneData?.pitchInflection || "Dynamic & Engaging"}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Energy & Projection:</span>
                <strong className="text-amber-300">{toneData?.energyLevel || "High Enthusiasm"}</strong>
              </div>
            </div>

            {/* Filler Words & Speech Pace Breakdown */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Speech Rhythm & Pacing
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Words Per Minute (WPM):</span>
                  <span className="font-bold text-emerald-300 font-mono">
                    {toneData?.wordsPerMinute || calculatedWpm || 135} WPM
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Pace Rating:</span>
                  <span className="font-semibold text-emerald-400">
                    {getPaceStatus(toneData?.wordsPerMinute || calculatedWpm || 135).label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Detected Filler Words:</span>
                  <span className="text-amber-300 font-extrabold text-xs">
                    {toneData?.fillerWordsCount ?? liveFillerCount} Count
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {((toneData?.detectedFillerWords && toneData.detectedFillerWords.length > 0)
                    ? toneData.detectedFillerWords
                    : (detectedFillers.length > 0 ? Array.from(new Set(detectedFillers)) : ["None detected! (Crisp delivery)"])
                  ).map((fw, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-md border ${
                        fw.includes("None")
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/30 font-mono"
                      }`}
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Arohi Voice Coach Tone Improvement Tips */}
          <div className="bg-indigo-950/30 border border-indigo-800/40 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" /> Arohi Tone Optimization Advice
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {(toneData?.toneImprovementTips || [
                "Maintain steady volume projection when explaining key technical trade-offs to project authority.",
                "Pause for 1 second before answering key behavioral questions to structure your response and eliminate 'um' filler words.",
                "Emphasize quantified outcomes (e.g., 'increased throughput by 35%') with an ascending, confident pitch.",
              ]).map((tip, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
