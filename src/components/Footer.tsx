import React from "react";
import {
  Sparkles,
  Globe,
  ShieldCheck,
  Building2,
  Mail,
  ExternalLink,
  Award,
  Briefcase,
  FileText,
  PhoneCall,
  Compass,
  Bot,
} from "lucide-react";
import { UserRoleMode } from "../types";

interface FooterProps {
  onNavigateToEngine: (engineId: string, role?: UserRoleMode) => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToEngine,
  onNavigateHome,
}) => {
  return (
    <footer className="mt-16 apple-mesh-dark text-slate-300 border-t border-white/12 relative overflow-hidden">
      {/* Top Frosted Promotional Banner for ArohiAI.com */}
      <div className="border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_28px_-8px_rgba(99,102,241,0.55)] shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400/15 text-amber-300 border border-amber-300/30 px-2.5 py-0.5 rounded-full">
                  Flagship AI Ecosystem
                </span>
                <span className="text-xs font-semibold text-sky-300">
                  Quench Research Labs Private Limited
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white mt-1">
                Experience Next-Gen Conversational &amp; Enterprise AI at{" "}
                <a
                  href="https://arohiai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 underline decoration-amber-400/60 hover:text-amber-200 transition"
                >
                  arohiai.com
                </a>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Arohi AI powers intelligent voice coaching, resume diagnostics, and autonomous talent matching across Recruits.org.in.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://arohiai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 hover:brightness-105 text-slate-950 font-extrabold text-xs rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_12px_26px_-10px_rgba(251,191,36,0.55)] flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span>Visit arohiai.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://recruits.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 glass-vision-card text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>recruits.org.in</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 relative z-10">
        {/* Column 1: Brand & Corporate Identity (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white font-extrabold text-xl flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-6px_rgba(79,70,229,0.5)]">
              R
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
                RECRUITS.ORG.IN
              </span>
              <span className="text-[11px] text-amber-300 font-semibold">
                Powered by arohiai.com
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            India&apos;s premier multilingual AI Career, Skilling &amp; Campus Placement Ecosystem. Connecting job seekers with verified Government (OPSC, SSC, UPSC, Railways, Banking) and top MNC opportunities with zero middleman fees.
          </p>

          <div className="p-4 glass-vision-card rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Quench Research Labs Private Limited</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Corporate Owner &amp; R&amp;D Lab behind <strong className="text-slate-200">recruits.org.in</strong> and <strong className="text-amber-300">arohiai.com</strong>. Building sovereign AI platforms for employment, education, and enterprise intelligence.
            </p>
          </div>
        </div>

        {/* Column 2: Career AI Engines (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white/90">
            Career &amp; Job Engines
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigateToEngine("liveindiajobs")}
                className="text-slate-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span>Live Govt &amp; Private Jobs</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("resume")}
                className="text-slate-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>ATS Resume Intelligence &amp; LinkedIn Import</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("pathvisualizer")}
                className="text-slate-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-violet-400" />
                <span>D3 Interactive Career Path Visualizer</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("interview")}
                className="text-slate-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Arohi AI Voice Mock Interview Lab</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("skillmastery")}
                className="text-slate-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-pink-400" />
                <span>30s Rapid Skill Mastery &amp; GK Quiz</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Arohi AI & Employer Services (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white/90">
            Arohi AI &amp; Employers
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a
                href="https://arohiai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 font-bold transition flex items-center gap-1.5"
              >
                <span>ArohiAI.com Platform</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("recruiter", "recruiter")}
                className="text-slate-400 hover:text-emerald-300 transition cursor-pointer text-left"
              >
                100% Free Employer Job Posting
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("navigator")}
                className="text-slate-400 hover:text-white transition cursor-pointer text-left"
              >
                Arohi Career Navigator
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("salary")}
                className="text-slate-400 hover:text-white transition cursor-pointer text-left"
              >
                Salary &amp; CTC Intelligence
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateToEngine("learning")}
                className="text-slate-400 hover:text-white transition cursor-pointer text-left"
              >
                Learning &amp; Upskilling Academy
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Corporate & Contact Info (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white/90">
            Corporate Information
          </h4>
          <div className="glass-vision-card rounded-2xl p-4 space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Registered Company Name
              </span>
              <strong className="text-white font-extrabold">
                Quench Research Labs Private Limited
              </strong>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Platforms
              </span>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <a
                  href="https://recruits.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-300 hover:underline font-bold"
                >
                  recruits.org.in
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href="https://arohiai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:underline font-bold"
                >
                  arohiai.com
                </a>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Support &amp; Inquiries
              </span>
              <a
                href="mailto:recruit.org.contact@gmail.com"
                className="text-slate-300 hover:text-white flex items-center gap-1.5 mt-0.5 font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>recruit.org.contact@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:inline" />
            <span>
              &copy; {new Date().getFullYear()}{" "}
              <strong className="text-white font-bold">
                Quench Research Labs Private Limited
              </strong>
              . All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span>
              Flagship Portals:{" "}
              <a
                href="https://recruits.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-white font-bold"
              >
                Recruits.org.in
              </a>{" "}
              &amp;{" "}
              <a
                href="https://arohiai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-white font-bold"
              >
                ArohiAI.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
