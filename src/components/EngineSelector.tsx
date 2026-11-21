import React from "react";
import {
  Compass,
  GitFork,
  Briefcase,
  FileText,
  Mic,
  BarChart2,
  BookOpen,
  DollarSign,
  Lightbulb,
  Building2,
  Award,
  Globe,
  Trophy,
} from "lucide-react";
import { UserRoleMode } from "../types";

export interface EngineOption {
  id: string;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  candidateOnly?: boolean;
  recruiterOnly?: boolean;
}

export const ENGINES: EngineOption[] = [
  {
    id: "liveindiajobs",
    label: "Live India Jobs Crawl",
    shortDesc: "Govt & Private Notifications",
    icon: Globe,
  },
  {
    id: "pathvisualizer",
    label: "Career Path Visualizer",
    shortDesc: "Interactive D3 Trajectories",
    icon: GitFork,
    candidateOnly: true,
  },
  {
    id: "navigator",
    label: "Career Navigator",
    shortDesc: "Personalized Career Paths",
    icon: Compass,
    candidateOnly: true,
  },
  {
    id: "skillmastery",
    label: "Skill Mastery Badges",
    shortDesc: "Earned Badges & Goal Progress",
    icon: Trophy,
    candidateOnly: true,
  },
  {
    id: "jobmatch",
    label: "AI Job Match",
    shortDesc: "Skills & Project Matching",
    icon: Briefcase,
  },
  {
    id: "resume",
    label: "Resume Intelligence",
    shortDesc: "ATS Score & 1-Click Rewrite",
    icon: FileText,
    candidateOnly: true,
  },
  {
    id: "interview",
    label: "Interview Coach",
    shortDesc: "Voice Mock & STAR Feedback",
    icon: Mic,
    candidateOnly: true,
  },
  {
    id: "skillgap",
    label: "Skill Gap Analyzer",
    shortDesc: "Target Role & Roadmap",
    icon: BarChart2,
    candidateOnly: true,
  },
  {
    id: "learning",
    label: "Learning Advisor",
    shortDesc: "Courses, Certs & Projects",
    icon: BookOpen,
    candidateOnly: true,
  },
  {
    id: "salary",
    label: "Salary Intelligence",
    shortDesc: "CTC Estimates & Negotiation",
    icon: DollarSign,
  },
  {
    id: "mentor",
    label: "Career Mentor",
    shortDesc: "5-Yr Strategy & Promotions",
    icon: Lightbulb,
    candidateOnly: true,
  },
  {
    id: "recruiter",
    label: "Recruiter Assistant",
    shortDesc: "Match Top Candidates & Fit",
    icon: Building2,
    recruiterOnly: true,
  },
];

interface EngineSelectorProps {
  activeEngineId: string;
  onSelectEngine: (id: string) => void;
  roleMode: UserRoleMode;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  activeEngineId,
  onSelectEngine,
  roleMode,
}) => {
  const visibleEngines = ENGINES.filter((engine) => {
    if (roleMode === "recruiter") {
      return !engine.candidateOnly || engine.id === "recruiter" || engine.id === "jobmatch" || engine.id === "salary";
    }
    return !engine.recruiterOnly;
  });

  return (
    <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max glass-apple p-1.5 rounded-2xl">
        {visibleEngines.map((engine) => {
          const Icon = engine.icon;
          const isActive = activeEngineId === engine.id;

          return (
            <button
              key={engine.id}
              id={`tab-engine-${engine.id}`}
              onClick={() => onSelectEngine(engine.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? "btn-apple-primary text-white border border-white/25"
                  : "bg-white/45 hover:bg-white/85 text-slate-700 hover:text-slate-950 border border-transparent hover:border-white/90"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-indigo-500/10 text-indigo-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="leading-tight tracking-tight">{engine.label}</span>
                <span
                  className={`text-[10px] font-medium leading-tight mt-0.5 ${
                    isActive ? "text-indigo-100/95" : "text-slate-500"
                  }`}
                >
                  {engine.shortDesc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
