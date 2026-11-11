import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  GitFork,
  Sparkles,
  TrendingUp,
  Award,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  Loader2,
  Layers,
  ArrowRight,
  Zap,
  Target,
  Download,
  Info,
  X,
  ShieldCheck,
  Compass,
  Building,
  UserCheck
} from "lucide-react";
import { CareerMemory, LanguageCode } from "../../types";
import { speakText } from "../../utils/speech";

export interface PathNode {
  id: string;
  level: number; // 0, 1, 2, 3
  title: string;
  type: "current" | "technical_growth" | "leadership" | "founder_pivot" | "lateral_shift";
  yoe: string;
  salaryINR: string;
  feasibilityScore: number; // e.g. 85%
  difficulty: "Current Baseline" | "Low Challenge" | "Moderate Challenge" | "High-Impact Pivot";
  keyGaps: string[];
  topSkills: string[];
  actionPlan: string[];
  arohiMentorTip: string;
  // D3 internal layout positions
  x?: number;
  y?: number;
}

export interface PathLink {
  source: string; // Node ID
  target: string; // Node ID
  label?: string;
  timeline?: string;
  probability?: string;
}

export interface CareerPathGraphData {
  graphTitle: string;
  industryDomain: string;
  nodes: PathNode[];
  links: PathLink[];
}

interface CareerPathVisualizerEngineProps {
  memory: CareerMemory;
  selectedLanguage?: LanguageCode;
  onUpdateMemory?: (updated: CareerMemory) => void;
}

const DEFAULT_GRAPH: CareerPathGraphData = {
  graphTitle: "Full Stack AI Engineer to Chief Technology Officer Roadmap",
  industryDomain: "AI & SaaS",
  nodes: [
    {
      id: "node-0",
      level: 0,
      title: "Full Stack AI Engineer",
      type: "current",
      yoe: "3-5 YOE",
      salaryINR: "₹18 - 28 LPA",
      feasibilityScore: 100,
      difficulty: "Current Baseline",
      keyGaps: [],
      topSkills: ["React.js", "Node.js", "TypeScript", "Gemini API", "PostgreSQL"],
      actionPlan: [
        "Optimize microservices API response latency below 100ms",
        "Publish technical case study on Gemini LLM integration"
      ],
      arohiMentorTip: "Focus on mastering system design and cloud cost optimization."
    },
    {
      id: "node-1a",
      level: 1,
      title: "Senior AI Systems Architect",
      type: "technical_growth",
      yoe: "5-7 YOE",
      salaryINR: "₹32 - 48 LPA",
      feasibilityScore: 88,
      difficulty: "Moderate Challenge",
      keyGaps: ["Vector DB Indexing", "RAG Pipeline Optimization", "Distributed Caching"],
      topSkills: ["Pinecone / Qdrant", "PyTorch", "Kubernetes", "GraphQL", "Redis"],
      actionPlan: [
        "Architect enterprise multi-agent workflow system",
        "Lead team technical code reviews & architecture RFCs"
      ],
      arohiMentorTip: "Demonstrate technical leadership by mentoring junior SDEs and driving design reviews."
    },
    {
      id: "node-1b",
      level: 1,
      title: "Engineering Manager - AI Platform",
      type: "leadership",
      yoe: "6-8 YOE",
      salaryINR: "₹35 - 52 LPA",
      feasibilityScore: 78,
      difficulty: "Moderate Challenge",
      keyGaps: ["Agile Workforce Planning", "Engineering Hiring", "OKRs & Budgeting"],
      topSkills: ["Team Leadership", "Agile Roadmap", "Performance Coaching", "Vendor Management"],
      actionPlan: [
        "Take ownership of quarterly sprint planning and team delivery KPIs",
        "Partner with HR for recruiter interviews and tech screening"
      ],
      arohiMentorTip: "Shift mindset from writing code to empowering your team and removing execution blockers."
    },
    {
      id: "node-2a",
      level: 2,
      title: "Principal AI Architect & Fellow",
      type: "technical_growth",
      yoe: "8-11 YOE",
      salaryINR: "₹55 - 85 LPA",
      feasibilityScore: 82,
      difficulty: "High-Impact Pivot",
      keyGaps: ["Custom Model Fine-Tuning", "Multi-Region Cloud Resilience", "Patent Filing"],
      topSkills: ["Distributed Training", "MLOps Infrastructure", "GCP Vertex AI", "Rust / C++"],
      actionPlan: [
        "File intellectual property patents for novel AI orchestration models",
        "Speak at national tech symposiums and represent company tech vision"
      ],
      arohiMentorTip: "Drive multi-million dollar business impact through innovative technical architecture."
    },
    {
      id: "node-2b",
      level: 2,
      title: "Director of Engineering (SaaS & AI)",
      type: "leadership",
      yoe: "9-12 YOE",
      salaryINR: "₹65 - 95 LPA",
      feasibilityScore: 75,
      difficulty: "High-Impact Pivot",
      keyGaps: ["Cross-Department P&L", "Executive Stakeholder Alignment", "Global Team Scale"],
      topSkills: ["P&L Management", "Strategic Resource Allocation", "Enterprise SaaS", "Executive Comm"],
      actionPlan: [
        "Manage engineering budget exceeding ₹10+ Crores",
        "Scale engineering organization from 20 to 50+ engineers across squads"
      ],
      arohiMentorTip: "Align tech initiatives directly with corporate revenue and retention goals."
    },
    {
      id: "node-2c",
      level: 2,
      title: "Founding AI Engineer / Co-Founder",
      type: "founder_pivot",
      yoe: "6-10 YOE",
      salaryINR: "₹25 - 60 LPA + Equity",
      feasibilityScore: 70,
      difficulty: "High-Impact Pivot",
      keyGaps: ["Product Market Fit", "Venture Capital Fundraising", "Go-To-Market Strategy"],
      topSkills: ["Rapid Prototyping", "Pitch Deck Design", "Customer Discovery", "Full Stack MVP"],
      actionPlan: [
        "Validate B2B SaaS pain points with 50+ potential enterprise design partners",
        "Build alpha prototype and apply to Y Combinator / Indian startup incubators"
      ],
      arohiMentorTip: "High risk with massive potential upside. Ensure early customer validation before full commitment."
    },
    {
      id: "node-3a",
      level: 3,
      title: "VP of Engineering & Global Tech",
      type: "leadership",
      yoe: "12-15 YOE",
      salaryINR: "₹1.1 - 1.8 Cr LPA",
      feasibilityScore: 72,
      difficulty: "High-Impact Pivot",
      keyGaps: ["Board Room Presentation", "Global M&A Integration", "Compliance & SOC2"],
      topSkills: ["Global Workforce Scaling", "Board Reporting", "Strategic M&A", "Cloud Security"],
      actionPlan: [
        "Report directly to C-suite and Board of Directors on tech roadmaps",
        "Oversee security audits, SOC2 Type II, and enterprise SLA guarantees"
      ],
      arohiMentorTip: "Focus on corporate vision, organizational culture, and high-stakes strategic execution."
    },
    {
      id: "node-3b",
      level: 3,
      title: "Chief Technology Officer (CTO)",
      type: "leadership",
      yoe: "14-18+ YOE",
      salaryINR: "₹1.5 - 2.5+ Cr LPA + Equity",
      feasibilityScore: 68,
      difficulty: "High-Impact Pivot",
      keyGaps: ["Enterprise Digital Transformation", "Public Market IPO Prep", "Brand Evangelism"],
      topSkills: ["Corporate Strategy", "Investor Relations", "Ecosystem Building", "P&L Ownership"],
      actionPlan: [
        "Define company's 5-year technology vision and AI moat",
        "Drive technology innovation that powers company's core market evaluation"
      ],
      arohiMentorTip: "The ultimate technology leadership milestone. You bridge business strategy and technical excellence."
    }
  ],
  links: [
    { source: "node-0", target: "node-1a", label: "Tech Specialist Track", timeline: "12-18 Months", probability: "88%" },
    { source: "node-0", target: "node-1b", label: "Management Track", timeline: "18-24 Months", probability: "78%" },
    { source: "node-0", target: "node-2c", label: "Startup Pivot", timeline: "6-12 Months", probability: "65%" },
    { source: "node-1a", target: "node-2a", label: "Individual Contributor Peak", timeline: "2-3 Years", probability: "82%" },
    { source: "node-1b", target: "node-2b", label: "Director Progression", timeline: "2-3 Years", probability: "76%" },
    { source: "node-2a", target: "node-3b", label: "Chief Architect to CTO", timeline: "3-5 Years", probability: "70%" },
    { source: "node-2b", target: "node-3a", label: "VP Engineering", timeline: "3-4 Years", probability: "74%" },
    { source: "node-3a", target: "node-3b", label: "Executive Board Promotion", timeline: "2-3 Years", probability: "80%" }
  ]
};

export const CareerPathVisualizerEngine: React.FC<CareerPathVisualizerEngineProps> = ({
  memory,
  selectedLanguage = "en" as LanguageCode,
  onUpdateMemory
}) => {
  const [graphData, setGraphData] = useState<CareerPathGraphData>(DEFAULT_GRAPH);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    memory.preferredIndustries[0] || "AI & SaaS"
  );
  const [selectedStrategy, setSelectedStrategy] = useState<string>(
    "Rapid Technical Specialist Track"
  );
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(DEFAULT_GRAPH.nodes[1]);
  const [isSpeakingAdvice, setIsSpeakingAdvice] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Generate dynamic AI Career Path Graph
  const handleGenerateAiGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/career-path-visualizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRole: memory.targetRole || "Software Developer",
          targetIndustry: selectedIndustry,
          experienceYears: memory.experienceYears,
          skills: memory.skills,
          trajectoryStrategy: selectedStrategy
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.nodes.length > 0) {
          setGraphData(data);
          setSelectedNode(data.nodes[0] || null);
        }
      }
    } catch (err) {
      console.error("Error generating career path graph:", err);
    } finally {
      setLoading(false);
    }
  };

  // Speak Arohi advice
  const handleSpeakMentorTip = (node: PathNode) => {
    const textToSpeak = `Arohi Mentor Guidance for ${node.title}: ${node.arohiMentorTip} Expected salary range is ${node.salaryINR}, with a transition feasibility of ${node.feasibilityScore} percent.`;
    setIsSpeakingAdvice(true);
    speakText({
      text: textToSpeak,
      language: selectedLanguage,
      onStart: () => setIsSpeakingAdvice(true),
      onEnd: () => setIsSpeakingAdvice(false),
      onError: () => setIsSpeakingAdvice(false)
    });
  };

  // Render D3 Graph
  useEffect(() => {
    if (!svgRef.current || !graphData || !graphData.nodes) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous rendering

    const width = 1000;
    const height = 550;

    // Filter nodes by salary if filter applied
    const nodes = graphData.nodes.filter((n) => {
      if (minSalaryFilter <= 0) return true;
      // extract upper number from salary string
      const match = n.salaryINR.match(/\d+/g);
      if (match && match.length > 0) {
        const val = parseInt(match[match.length - 1], 10);
        return val >= minSalaryFilter;
      }
      return true;
    });

    const validNodeIds = new Set(nodes.map((n) => n.id));
    const links = graphData.links.filter(
      (l) => validNodeIds.has(l.source) && validNodeIds.has(l.target)
    );

    // Group nodes by level (0, 1, 2, 3)
    const levelGroups: { [level: number]: PathNode[] } = { 0: [], 1: [], 2: [], 3: [] };
    nodes.forEach((node) => {
      const lvl = node.level ?? 0;
      if (!levelGroups[lvl]) levelGroups[lvl] = [];
      levelGroups[lvl].push(node);
    });

    // Calculate position X & Y for each node
    const levelXMap: { [lvl: number]: number } = {
      0: 100,
      1: 340,
      2: 620,
      3: 880
    };

    Object.keys(levelGroups).forEach((lvlStr) => {
      const lvl = parseInt(lvlStr, 10);
      const group = levelGroups[lvl];
      const count = group.length;
      const x = levelXMap[lvl] || 100 + lvl * 250;

      group.forEach((node, idx) => {
        const totalSpan = height - 120;
        const spacing = totalSpan / Math.max(count, 1);
        const startY = 80 + (totalSpan - spacing * (count - 1)) / 2;
        node.x = x;
        node.y = startY + idx * spacing;
      });
    });

    // SVG Defs for gradients, glow filters, markers
    const defs = svg.append("defs");

    // Glow Filter
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Node Gradients
    const currentGrad = defs.append("linearGradient").attr("id", "grad-current").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    currentGrad.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1");
    currentGrad.append("stop").attr("offset", "100%").attr("stop-color", "#8b5cf6");

    const techGrad = defs.append("linearGradient").attr("id", "grad-tech").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    techGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0ea5e9");
    techGrad.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb");

    const leaderGrad = defs.append("linearGradient").attr("id", "grad-leader").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    leaderGrad.append("stop").attr("offset", "0%").attr("stop-color", "#f59e0b");
    leaderGrad.append("stop").attr("offset", "100%").attr("stop-color", "#d97706");

    const founderGrad = defs.append("linearGradient").attr("id", "grad-founder").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    founderGrad.append("stop").attr("offset", "0%").attr("stop-color", "#ec4899");
    founderGrad.append("stop").attr("offset", "100%").attr("stop-color", "#be185d");

    // Container Group with Zoom & Pan
    const container = svg.append("g").attr("class", "d3-container");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.2])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom as any);

    // Render Vertical Level Milestone Guides
    const levelTitles = ["Baseline", "Horizon 1 (1-2Y)", "Horizon 2 (3-5Y)", "Peak Horizon (5-8Y+)"];
    [0, 1, 2, 3].forEach((lvl) => {
      const x = levelXMap[lvl];
      container
        .append("line")
        .attr("x1", x)
        .attr("y1", 30)
        .attr("x2", x)
        .attr("y2", height - 30)
        .attr("stroke", "#334155")
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-width", 1)
        .attr("opacity", 0.4);

      container
        .append("rect")
        .attr("x", x - 60)
        .attr("y", 10)
        .attr("width", 120)
        .attr("height", 22)
        .attr("rx", 6)
        .attr("fill", "#0f172a")
        .attr("stroke", "#334155");

      container
        .append("text")
        .attr("x", x)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .text(levelTitles[lvl]);
    });

    // Create Link Map for quick node position lookup
    const nodeById = new Map<string, PathNode>();
    nodes.forEach((n) => nodeById.set(n.id, n));

    // Render Curved Connecting Links
    const linkGroup = container.append("g").attr("class", "links");

    links.forEach((link) => {
      const sourceNode = nodeById.get(link.source);
      const targetNode = nodeById.get(link.target);

      if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
        const sx = sourceNode.x + 90; // right edge of source box
        const sy = sourceNode.y;
        const tx = targetNode.x - 90; // left edge of target box
        const ty = targetNode.y;

        const path = d3.path();
        path.moveTo(sx, sy);
        const dx = (tx - sx) / 2;
        path.bezierCurveTo(sx + dx, sy, tx - dx, ty, tx, ty);

        // Draw background link line
        linkGroup
          .append("path")
          .attr("d", path.toString())
          .attr("fill", "none")
          .attr("stroke", "#475569")
          .attr("stroke-width", 2)
          .attr("opacity", 0.6);

        // Draw animated glowing flow link
        linkGroup
          .append("path")
          .attr("d", path.toString())
          .attr("fill", "none")
          .attr("stroke", "#6366f1")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "6,6")
          .attr("opacity", 0.9)
          .append("animate")
          .attr("attributeName", "stroke-dashoffset")
          .attr("from", "24")
          .attr("to", "0")
          .attr("dur", "2s")
          .attr("repeatCount", "indefinite");

        // Link Label Pill
        if (link.timeline || link.probability) {
          const mx = (sx + tx) / 2;
          const my = (sy + ty) / 2;

          linkGroup
            .append("rect")
            .attr("x", mx - 35)
            .attr("y", my - 10)
            .attr("width", 70)
            .attr("height", 18)
            .attr("rx", 5)
            .attr("fill", "#020617")
            .attr("stroke", "#334155")
            .attr("stroke-width", 0.8);

          linkGroup
            .append("text")
            .attr("x", mx)
            .attr("y", my + 3)
            .attr("text-anchor", "middle")
            .attr("fill", "#a7f3d0")
            .attr("font-size", "9px")
            .attr("font-weight", "bold")
            .text(`${link.timeline || ""} ${link.probability ? "(" + link.probability + ")" : ""}`);
        }
      }
    });

    // Render Interactive Role Nodes
    const nodeGroup = container.append("g").attr("class", "nodes");

    nodes.forEach((node) => {
      if (!node.x || !node.y) return;

      const isSelected = selectedNode?.id === node.id;
      const boxW = 180;
      const boxH = 75;

      const g = nodeGroup
        .append("g")
        .attr("transform", `translate(${node.x - boxW / 2}, ${node.y - boxH / 2})`)
        .attr("class", "cursor-pointer transition-all duration-200")
        .on("click", () => {
          setSelectedNode(node);
        });

      // Fill Gradient based on type
      let fillGradient = "url(#grad-tech)";
      let borderStroke = "#38bdf8";
      if (node.type === "current") {
        fillGradient = "url(#grad-current)";
        borderStroke = "#818cf8";
      } else if (node.type === "leadership") {
        fillGradient = "url(#grad-leader)";
        borderStroke = "#fbbf24";
      } else if (node.type === "founder_pivot") {
        fillGradient = "url(#grad-founder)";
        borderStroke = "#f472b6";
      }

      // Outer Glow or Highlight Box
      if (isSelected) {
        g.append("rect")
          .attr("x", -4)
          .attr("y", -4)
          .attr("width", boxW + 8)
          .attr("height", boxH + 8)
          .attr("rx", 16)
          .attr("fill", "none")
          .attr("stroke", "#f59e0b")
          .attr("stroke-width", 2.5)
          .attr("filter", "url(#glow)");
      }

      // Main Node Card Background
      g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", boxW)
        .attr("height", boxH)
        .attr("rx", 12)
        .attr("fill", "#090d16")
        .attr("stroke", isSelected ? "#f59e0b" : borderStroke)
        .attr("stroke-width", isSelected ? 2 : 1.2)
        .attr("class", "hover:opacity-90");

      // Top Accent Pill Header
      g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", boxW)
        .attr("height", 20)
        .attr("rx", 12)
        .attr("fill", fillGradient);

      // Category Pill Title Text
      g.append("text")
        .attr("x", 10)
        .attr("y", 13)
        .attr("fill", "#ffffff")
        .attr("font-size", "9px")
        .attr("font-weight", "900")
        .text(node.type.toUpperCase().replace("_", " "));

      // Feasibility Score Badge on right
      g.append("text")
        .attr("x", boxW - 10)
        .attr("y", 13)
        .attr("text-anchor", "end")
        .attr("fill", "#ffffff")
        .attr("font-size", "9px")
        .attr("font-weight", "900")
        .text(`${node.feasibilityScore}% Fit`);

      // Main Role Title (Truncated if long)
      const displayTitle =
        node.title.length > 22 ? node.title.substring(0, 20) + "..." : node.title;

      g.append("text")
        .attr("x", 10)
        .attr("y", 38)
        .attr("fill", "#f8fafc")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .text(displayTitle);

      // Sub-metrics: Salary Tag & YOE
      g.append("text")
        .attr("x", 10)
        .attr("y", 56)
        .attr("fill", "#fbbf24")
        .attr("font-size", "10px")
        .attr("font-weight", "800")
        .text(node.salaryINR);

      g.append("text")
        .attr("x", boxW - 10)
        .attr("y", 56)
        .attr("text-anchor", "end")
        .attr("fill", "#94a3b8")
        .attr("font-size", "9px")
        .text(node.yoe);

      // Selected Pointer Indicator
      if (isSelected) {
        g.append("circle")
          .attr("cx", boxW / 2)
          .attr("cy", boxH + 6)
          .attr("r", 4)
          .attr("fill", "#f59e0b");
      }
    });
  }, [graphData, minSalaryFilter, selectedNode]);

  // Zoom controls
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.25);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.8);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const handleApplyNodeAsTarget = (node: PathNode) => {
    if (onUpdateMemory) {
      const updated: CareerMemory = {
        ...memory,
        targetRole: node.title
      };
      onUpdateMemory(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-indigo-500 via-purple-600 to-amber-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Interactive Career Path Visualizer
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-extrabold">
                  D3 Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Arohi AI maps multi-tier potential growth trajectories, role transitions, and skill requirements for your industry domain
              </p>
            </div>
          </div>

          <button
            id="btn-generate-d3-graph"
            onClick={handleGenerateAiGraph}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Arohi Generating Trajectory Graph...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Refresh AI Career Graph
              </>
            )}
          </button>
        </div>

        {/* Interactive Controls & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <label className="text-slate-300 font-bold mb-1 block">Target Industry Domain</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="AI & SaaS">AI & SaaS Software</option>
              <option value="FinTech & Digital Payments">FinTech & Digital Payments</option>
              <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
              <option value="E-Commerce & Digital Commerce">E-Commerce & Digital Commerce</option>
              <option value="HealthTech & Biotech">HealthTech & Biotech</option>
              <option value="Government & PSU Tech">Government & PSU Tech</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold mb-1 block">Trajectory Growth Strategy</label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Rapid Technical Specialist Track">Rapid Technical Specialist (IC Peak)</option>
              <option value="Engineering Management & Leadership Track">Engineering Management & Leadership</option>
              <option value="Startup CTO & Founder Track">Startup CTO & Founder Track</option>
              <option value="Product & Executive Strategy Pivot">Product & Executive Strategy Pivot</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold mb-1 block">
              Min Target CTC Filter: {minSalaryFilter > 0 ? `≥ ₹${minSalaryFilter} LPA` : "Show All Roles"}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* D3 VISUALIZER GRAPH CANVAS BOX */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Canvas Toolbar Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-400" /> {graphData.graphTitle}
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
              {graphData.industryDomain}
            </span>
          </div>

          {/* Zoom / Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-500 pl-2 hidden sm:inline">
              Scroll or Drag Canvas to Pan / Click Node to Inspect
            </span>
          </div>
        </div>

        {/* SVG Render Container */}
        <div className="w-full overflow-hidden rounded-2xl bg-[#030712] border border-slate-800/60 relative">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 550"
            className="w-full h-[480px] sm:h-[550px] cursor-grab active:cursor-grabbing select-none"
          />
        </div>

        {/* Selected Node Quick Legend / Inspector Banner */}
        {selectedNode && (
          <div className="mt-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 text-white shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/50 rounded-xl text-indigo-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Selected Node Inspection:
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      {selectedNode.feasibilityScore}% Transition Fit
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{selectedNode.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSpeakMentorTip(selectedNode)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Listen Advice
                </button>
                <button
                  onClick={() => handleApplyNodeAsTarget(selectedNode)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Target className="w-4 h-4" /> Set as Target Goal
                </button>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Estimated CTC Band (INR)</span>
                <span className="text-sm font-extrabold text-amber-300 mt-0.5 block">{selectedNode.salaryINR}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Typical Experience Horizon</span>
                <span className="text-sm font-extrabold text-indigo-300 mt-0.5 block">{selectedNode.yoe}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Transition Difficulty</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">{selectedNode.difficulty}</span>
              </div>
            </div>

            {/* Skill Gaps & Tech Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              {selectedNode.keyGaps && selectedNode.keyGaps.length > 0 && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-extrabold text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Key Skill Gaps to Bridge:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedNode.keyGaps.map((gap, gIdx) => (
                      <span key={gIdx} className="bg-rose-950/80 text-rose-200 border border-rose-800/60 px-2 py-0.5 rounded-md text-[10px]">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.topSkills && selectedNode.topSkills.length > 0 && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-extrabold text-indigo-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" /> Required Tech Stack & Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedNode.topSkills.map((sk, sIdx) => (
                      <span key={sIdx} className="bg-indigo-950/80 text-indigo-200 border border-indigo-800/60 px-2 py-0.5 rounded-md text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Action Plan */}
            {selectedNode.actionPlan && selectedNode.actionPlan.length > 0 && (
              <div className="space-y-1.5 text-xs pt-1">
                <span className="font-extrabold text-slate-200 block">Immediate 90-Day Transition Action Plan:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedNode.actionPlan.map((act, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Arohi AI Strategic Advice Box */}
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-950 p-3 rounded-xl border border-amber-500/30 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-300 block">Arohi Mentor Strategic Advice:</span>
                <p className="text-slate-300 leading-relaxed mt-0.5">{selectedNode.arohiMentorTip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
