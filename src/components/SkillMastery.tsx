import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  Trophy,
  Star,
  Cpu,
  Database,
  Cloud,
  Code,
  Target,
  ArrowUpRight,
  Plus,
  Download,
  Share2,
  Layers,
  Check,
  RefreshCw,
  X,
  ChevronRight,
  FileCode,
  Globe,
} from "lucide-react";
import { CareerMemory, SkillBadge } from "../types";

interface SkillMasteryProps {
  memory: CareerMemory;
  onUpdateMemory?: (updated: CareerMemory) => void;
  onOpenMemoryModal?: () => void;
}

export const SkillMastery: React.FC<SkillMasteryProps> = ({
  memory,
  onUpdateMemory,
  onOpenMemoryModal,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeBadgeModal, setActiveBadgeModal] = useState<SkillBadge | null>(null);
  const [showAddBadgeModal, setShowAddBadgeModal] = useState<boolean>(false);

  // Form state for claiming a new badge/certification/project
  const [claimType, setClaimType] = useState<"certification" | "project" | "skill">("certification");
  const [claimTitle, setClaimTitle] = useState("");
  const [claimIssuerOrTech, setClaimIssuerOrTech] = useState("");
  const [claimDescription, setClaimDescription] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  // Generate dynamic badges from memory
  const getDerivedBadges = (): SkillBadge[] => {
    const badges: SkillBadge[] = [];

    // 1. Badges derived from Certifications
    memory.certifications.forEach((cert, idx) => {
      if (cert.toLowerCase().includes("aws") || cert.toLowerCase().includes("cloud")) {
        badges.push({
          id: `badge-cert-aws-${idx}`,
          title: "Cloud Infrastructure Specialist",
          category: "certification",
          tier: "Diamond",
          icon: "Cloud",
          description: "Demonstrated advanced proficiency in cloud computing, architecture, and microservices hosting.",
          earnedDate: "Certified 2026",
          isEarned: true,
          progressPercent: 100,
          unlockedBy: cert,
          goalImpact: "+25% Cloud System System Architecture Readiness for Target Role",
          verifiedSkills: ["AWS", "Cloud Architecture", "EC2 / S3", "IAM Security"],
        });
      } else if (cert.toLowerCase().includes("google") || cert.toLowerCase().includes("analytics") || cert.toLowerCase().includes("data")) {
        badges.push({
          id: `badge-cert-gda-${idx}`,
          title: "Data Analytics Vanguard",
          category: "certification",
          tier: "Platinum",
          icon: "Database",
          description: "Mastered data modeling, ETL pipelines, SQL queries, and statistical intelligence.",
          earnedDate: "Certified 2026",
          isEarned: true,
          progressPercent: 100,
          unlockedBy: cert,
          goalImpact: "+20% Data Processing Readiness for Target Role",
          verifiedSkills: ["SQL", "Data Pipelines", "BigQuery", "Data Visualization"],
        });
      } else {
        badges.push({
          id: `badge-cert-generic-${idx}`,
          title: cert,
          category: "certification",
          tier: "Gold",
          icon: "Award",
          description: `Professional certification verified in ${cert}.`,
          earnedDate: "Verified",
          isEarned: true,
          progressPercent: 100,
          unlockedBy: cert,
          goalImpact: "+15% Domain Credibility",
          verifiedSkills: ["Professional Certification", "Domain Mastery"],
        });
      }
    });

    // 2. Badges derived from Completed Portfolio Projects
    memory.portfolioProjects.forEach((proj, idx) => {
      const isAI = proj.title.toLowerCase().includes("ai") || proj.techStack.some(t => t.toLowerCase().includes("gemini") || t.toLowerCase().includes("python") || t.toLowerCase().includes("llm"));
      const isFintech = proj.title.toLowerCase().includes("fintech") || proj.title.toLowerCase().includes("analytics") || proj.title.toLowerCase().includes("real-time");

      if (isFintech) {
        badges.push({
          id: `badge-proj-fintech-${idx}`,
          title: "High-Frequency Real-Time Engineer",
          category: "project",
          tier: "Diamond",
          icon: "Zap",
          description: "Engineered sub-50ms latency event processors and real-time transaction pipelines.",
          earnedDate: "Completed Project",
          isEarned: true,
          progressPercent: 100,
          unlockedBy: `Project: ${proj.title}`,
          goalImpact: "+30% High-Scale Systems Readiness (Target Salary Tier: ₹24-28+ LPA)",
          verifiedSkills: proj.techStack.length ? proj.techStack : ["WebSockets", "Node.js", "Performance Optimization"],
        });
      } else if (isAI) {
        badges.push({
          id: `badge-proj-ai-${idx}`,
          title: "Generative AI Systems Specialist",
          category: "project",
          tier: "Platinum",
          icon: "Cpu",
          description: "Implemented LLM integration, prompt engineering, and automated document NLP extractors.",
          earnedDate: "Completed Project",
          isEarned: true,
          progressPercent: 100,
          unlockedBy: `Project: ${proj.title}`,
          goalImpact: "+35% AI Lead Readiness for Target Role",
          verifiedSkills: proj.techStack.length ? proj.techStack : ["Python", "Gemini API", "NLP"],
        });
      } else {
        badges.push({
          id: `badge-proj-gen-${idx}`,
          title: `Architect: ${proj.title}`,
          category: "project",
          tier: "Gold",
          icon: "Code",
          description: proj.description || "Delivered full end-to-end software module.",
          earnedDate: "Completed Project",
          isEarned: true,
          progressPercent: 100,
          unlockedBy: `Project: ${proj.title}`,
          goalImpact: "+15% Practical Build Readiness",
          verifiedSkills: proj.techStack,
        });
      }
    });

    // 3. Badges derived from Core Skill Stack
    if (memory.skills.includes("React") && memory.skills.includes("TypeScript")) {
      badges.push({
        id: "badge-skill-frontend-master",
        title: "Frontend Engineering Maestro",
        category: "skill_mastery",
        tier: "Platinum",
        icon: "FileCode",
        description: "Proven expertise crafting responsive, accessible, and high-performance React & TypeScript applications.",
        earnedDate: "Mastered",
        isEarned: true,
        progressPercent: 100,
        unlockedBy: "React + TypeScript Skill Proficiency",
        goalImpact: "+20% UI/UX & Client Systems Mastery",
        verifiedSkills: ["React", "TypeScript", "Tailwind CSS", "State Management"],
      });
    }

    if (memory.skills.includes("Node.js") || memory.skills.includes("Express") || memory.skills.includes("Python")) {
      badges.push({
        id: "badge-skill-backend-architect",
        title: "Backend Services & API Architect",
        category: "skill_mastery",
        tier: "Gold",
        icon: "Layers",
        description: "Capable of designing RESTful APIs, asynchronous services, and secure backend microservices.",
        earnedDate: "Mastered",
        isEarned: true,
        progressPercent: 100,
        unlockedBy: "Node.js / Express / Python Stack",
        goalImpact: "+25% Server Architecture Capability",
        verifiedSkills: ["Node.js", "Express", "RESTful APIs", "Server Security"],
      });
    }

    // 4. Milestone & Goal Badges (In Progress or Unlocked)
    badges.push({
      id: "badge-goal-role-mastery",
      title: `${memory.targetRole || "Senior Engineer"} Target Mastery`,
      category: "career_goal",
      tier: "Diamond",
      icon: "Trophy",
      description: `Ultimate career milestone for achieving readiness as a ${memory.targetRole || "Senior AI Engineer"} with expected target ₹${memory.expectedSalaryINR || 18} LPA.`,
      isEarned: badges.length >= 5,
      progressPercent: Math.min(100, Math.round((badges.length / 6) * 100)),
      unlockedBy: `Career Goal: ${memory.targetRole}`,
      goalImpact: `Direct Alignment with ₹${memory.expectedSalaryINR || 18} LPA Target Goal`,
      verifiedSkills: ["Full-Stack Engineering", "AI Integration", "System Architecture", "Behavioral Leadership"],
    });

    badges.push({
      id: "badge-goal-interview-ace",
      title: "Voice Interview Elite Competency",
      category: "career_goal",
      tier: "Gold",
      icon: "Flame",
      description: "Successfully passed Arohi Voice Mock Interviews with high clarity and STAR behavioral scores.",
      earnedDate: memory.interviewHistory.length ? "Verified Mock History" : undefined,
      isEarned: memory.interviewHistory.some((i) => i.score >= 80),
      progressPercent: memory.interviewHistory.some((i) => i.score >= 80) ? 100 : 65,
      unlockedBy: "Arohi Interview Coach Evaluation > 80%",
      goalImpact: "+20% Hiring Manager Interview Conversion Rate",
      verifiedSkills: ["STAR Method", "Behavioral Communication", "System Design Defense"],
    });

    return badges;
  };

  const allBadges = getDerivedBadges();
  const earnedCount = allBadges.filter((b) => b.isEarned).length;
  const totalCount = allBadges.length;
  const overallMasteryPercent = Math.min(100, Math.round((earnedCount / Math.max(totalCount, 1)) * 100));

  const filteredBadges = allBadges.filter((b) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "earned") return b.isEarned;
    if (selectedFilter === "certifications") return b.category === "certification";
    if (selectedFilter === "projects") return b.category === "project";
    if (selectedFilter === "skills") return b.category === "skill_mastery";
    if (selectedFilter === "goals") return b.category === "career_goal";
    return true;
  });

  const renderBadgeIcon = (iconName: string, tier: string, isEarned: boolean) => {
    const iconClass = `w-6 h-6 ${isEarned ? "text-white" : "text-slate-500"}`;
    switch (iconName) {
      case "Cloud":
        return <Cloud className={iconClass} />;
      case "Database":
        return <Database className={iconClass} />;
      case "Zap":
        return <Zap className={iconClass} />;
      case "Cpu":
        return <Cpu className={iconClass} />;
      case "FileCode":
        return <FileCode className={iconClass} />;
      case "Layers":
        return <Layers className={iconClass} />;
      case "Trophy":
        return <Trophy className={iconClass} />;
      case "Flame":
        return <Flame className={iconClass} />;
      case "Code":
        return <Code className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const getTierGradient = (tier: string, isEarned: boolean) => {
    if (!isEarned) return "from-slate-900 to-slate-950 border-slate-800 text-slate-500";
    switch (tier) {
      case "Diamond":
        return "from-cyan-500/20 via-sky-600/10 to-indigo-600/20 border-cyan-500/50 text-cyan-200 shadow-cyan-500/10";
      case "Platinum":
        return "from-emerald-500/20 via-teal-600/10 to-emerald-700/20 border-emerald-500/50 text-emerald-200 shadow-emerald-500/10";
      case "Gold":
        return "from-amber-500/20 via-yellow-600/10 to-amber-700/20 border-amber-500/50 text-amber-200 shadow-amber-500/10";
      default:
        return "from-indigo-500/20 via-slate-800 to-indigo-900/20 border-indigo-500/50 text-indigo-200 shadow-indigo-500/10";
    }
  };

  const getTierBadgePill = (tier: string) => {
    switch (tier) {
      case "Diamond":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "Platinum":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Gold":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const handleMintNewBadge = () => {
    if (!claimTitle.trim()) return;

    setIsMinting(true);
    setTimeout(() => {
      let updatedMemory = { ...memory };

      if (claimType === "certification") {
        if (!updatedMemory.certifications.includes(claimTitle.trim())) {
          updatedMemory.certifications = [...updatedMemory.certifications, claimTitle.trim()];
        }
      } else if (claimType === "project") {
        const tech = claimIssuerOrTech.split(",").map((s) => s.trim()).filter(Boolean);
        updatedMemory.portfolioProjects = [
          ...updatedMemory.portfolioProjects,
          {
            title: claimTitle.trim(),
            techStack: tech.length ? tech : ["TypeScript", "React"],
            description: claimDescription.trim() || "Verified portfolio project contribution.",
          },
        ];
      } else if (claimType === "skill") {
        if (!updatedMemory.skills.includes(claimTitle.trim())) {
          updatedMemory.skills = [...updatedMemory.skills, claimTitle.trim()];
        }
      }

      if (onUpdateMemory) {
        onUpdateMemory(updatedMemory);
      }

      setIsMinting(false);
      setShowAddBadgeModal(false);
      setClaimTitle("");
      setClaimIssuerOrTech("");
      setClaimDescription("");
    }, 800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-amber-500/20 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-white">Skill Mastery & Earned Badges</h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Career Profile Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated proof-of-work badges unlocked by verified certifications, completed projects, and skill stack
            </p>
          </div>
        </div>

        {/* Claim / Add Badge CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-mint-new-badge"
            onClick={() => setShowAddBadgeModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Cert / Project Badge
          </button>
        </div>
      </div>

      {/* OVERALL MASTERY & CAREER GOAL ALIGNMENT METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress gauge 1 */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="6"
                className="text-amber-400 transition-all duration-1000"
                fill="transparent"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * overallMasteryPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-black text-amber-300">{overallMasteryPercent}%</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Overall Skill Mastery</span>
            <h4 className="text-sm font-bold text-white mt-0.5">{earnedCount} of {totalCount} Badges Unlocked</h4>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Level 4 Advanced Practitioner</p>
          </div>
        </div>

        {/* Progress gauge 2 */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Target Role Readiness</span>
            <span className="text-emerald-400 font-black">{memory.targetRole || "Senior AI Engineer"}</span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(30, overallMasteryPercent + 15))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Goal: ₹{memory.expectedSalaryINR || 18} LPA Target</span>
            <span className="text-amber-300 font-semibold">
              {Math.min(100, Math.max(30, overallMasteryPercent + 15))}% Qualified
            </span>
          </div>
        </div>

        {/* Breakdown Summary */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-around text-center">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Certifications</span>
            <span className="text-lg font-black text-amber-400">{memory.certifications.length}</span>
            <span className="text-[10px] text-slate-500 block">Verified</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Projects</span>
            <span className="text-lg font-black text-cyan-400">{memory.portfolioProjects.length}</span>
            <span className="text-[10px] text-slate-500 block">Completed</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Skills</span>
            <span className="text-lg font-black text-emerald-400">{memory.skills.length}</span>
            <span className="text-[10px] text-slate-500 block">In Stack</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <span className="text-xs text-slate-400 font-semibold mr-1">Filter Badges:</span>
        {[
          { id: "all", label: `All (${allBadges.length})` },
          { id: "earned", label: `Earned (${earnedCount})` },
          { id: "certifications", label: "Certifications" },
          { id: "projects", label: "Projects" },
          { id: "skills", label: "Skill Stack" },
          { id: "goals", label: "Career Milestones" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedFilter === tab.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* BADGES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const gradientClass = getTierGradient(badge.tier, badge.isEarned);
          const tierPillClass = getTierBadgePill(badge.tier);

          return (
            <div
              key={badge.id}
              onClick={() => setActiveBadgeModal(badge)}
              className={`bg-gradient-to-b ${gradientClass} border rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg relative flex flex-col justify-between group`}
            >
              {/* Badge Top Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl border ${badge.isEarned ? "bg-slate-900/90 border-slate-700" : "bg-slate-900/50 border-slate-800"}`}>
                    {renderBadgeIcon(badge.icon, badge.tier, badge.isEarned)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tierPillClass}`}>
                      {badge.tier}
                    </span>

                    {badge.isEarned ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Earned
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-300/90 line-clamp-2 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Badge Footer Details */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[170px] text-slate-300 font-medium">Source: {badge.unlockedBy}</span>
                  <span className="text-amber-300 font-bold flex items-center gap-0.5">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Verified Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {badge.verifiedSkills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="bg-slate-950/80 text-slate-300 border border-slate-800 text-[10px] px-2 py-0.5 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {badge.verifiedSkills.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1">+{badge.verifiedSkills.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL FOR SELECTED BADGE */}
      {activeBadgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveBadgeModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                {renderBadgeIcon(activeBadgeModal.icon, activeBadgeModal.tier, activeBadgeModal.isEarned)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${getTierBadgePill(activeBadgeModal.tier)}`}>
                    {activeBadgeModal.tier} Badge
                  </span>
                  {activeBadgeModal.isEarned && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold">
                      ✓ Verified Active
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">{activeBadgeModal.title}</h3>
                <p className="text-xs text-slate-400">Credential Source: {activeBadgeModal.unlockedBy}</p>
              </div>
            </div>

            {/* Description & Impact */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Badge Overview</span>
                <p className="text-slate-200 leading-relaxed">{activeBadgeModal.description}</p>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-800/40 p-3.5 rounded-2xl space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Target Career Goal Impact</span>
                <p className="text-emerald-200 font-semibold">{activeBadgeModal.goalImpact}</p>
              </div>

              {/* Verified Skills */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">
                  Verified Skills & Tech Stack Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeBadgeModal.verifiedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-xl text-xs font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Credential ID */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verifiable Credential Hash:</span>
                <code className="text-amber-300 font-mono">RECRUIT-BDG-2026-{activeBadgeModal.id.toUpperCase()}</code>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveBadgeModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM / MINT NEW BADGE MODAL */}
      {showAddBadgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddBadgeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Mint & Claim Skill Mastery Badge</h3>
                <p className="text-xs text-slate-400">Log new certification or portfolio project to unlock badges</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Badge Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "certification", label: "Certification" },
                    { id: "project", label: "Project" },
                    { id: "skill", label: "Skill Stack" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setClaimType(t.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        claimType === t.id
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">
                  {claimType === "certification" ? "Certification Title" : claimType === "project" ? "Project Name" : "Skill Name"}
                </label>
                <input
                  type="text"
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder={
                    claimType === "certification"
                      ? "e.g., Azure AI Engineer Associate"
                      : claimType === "project"
                      ? "e.g., Distributed Vector Search Engine"
                      : "e.g., Kubernetes / Docker"
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">
                  {claimType === "certification" ? "Issuing Provider" : "Tech Stack (Comma Separated)"}
                </label>
                <input
                  type="text"
                  value={claimIssuerOrTech}
                  onChange={(e) => setClaimIssuerOrTech(e.target.value)}
                  placeholder={claimType === "certification" ? "e.g., Microsoft / AWS / Coursera" : "e.g., React, Python, Rust, Docker"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {claimType === "project" && (
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Project Summary</label>
                  <textarea
                    rows={2}
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    placeholder="Brief description of key achievements or architecture..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            <button
              id="btn-confirm-mint-badge"
              onClick={handleMintNewBadge}
              disabled={isMinting || !claimTitle.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
            >
              {isMinting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credential & Minting Badge...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" /> Verify & Mint Skill Mastery Badge
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
