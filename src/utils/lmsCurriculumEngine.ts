import { CourseModuleItem } from "../data/officialCourseModules";

export type UnitSessionType =
  | "deep_textbook"
  | "code_walkthrough"
  | "unit_coding_drill"
  | "debugging_challenge"
  | "system_design_viva"
  | "unit_problem_set";

export interface StructuredSession {
  sessionIndex: number;
  sessionId: string;
  type: UnitSessionType;
  shortLabel: string;
  title: string;
  subtitle: string;
  allocatedMinutes: number;
  requiredSeconds: number;
}

export interface StructuredUnit {
  unitIndex: number;
  unitId: string;
  title: string;
  unitType: "concept" | "architecture_code" | "capstone_prep";
  allocatedHours: number;
  requiredSeconds: number;
  objectives: string[];
  sessions: StructuredSession[];
  checkQuestion: string;
  checkOptions: string[];
  correctOptionIndex: number;
}

export interface ModuleServerProgress {
  moduleId: string;
  digitalSecondsLogged: number;
  unitSeconds: Record<string, number>;
  completedUnitIds: string[];
  sessionSeconds?: Record<string, number>;
  completedSessionIds?: string[];
  sessionScores?: Record<string, number>;
  labScore: number | null;
  labPassed: boolean;
  labSubmittedAt?: string;
  quizBestScorePercent: number | null;
  quizPassed: boolean;
  quizAttempts: number;
  quizCooldownUntil?: number;
  physicalBookingId?: string;
  physicalCenter?: string;
  physicalSlot?: string;
  physicalHoursCredited: number;
  physicalVerified: boolean;
  physicalVerifiedAt?: string;
  completedAt?: string;
}

export interface LearnerLmsProgress {
  learnerId: string;
  dailySecondsByDate: Record<string, number>;
  modules: Record<string, ModuleServerProgress>;
  updatedAt: string;
}

export interface ModuleGateStatus {
  totalHours: number;
  digitalRequiredHours: number;
  digitalRequiredSeconds: number;
  physicalRequiredHours: number;
  digitalLoggedSeconds: number;
  digitalLoggedHours: number;
  physicalCreditedHours: number;
  totalLoggedHours: number;
  gate1TimeMet: boolean;
  gate2LabPassed: boolean;
  gate3QuizPassed: boolean;
  gate4PhysicalVerified: boolean;
  allGatesPassed: boolean;
  completionPercent: number;
}

export const DAILY_STUDY_CAP_HOURS = 6;
export const DAILY_STUDY_CAP_SECONDS = DAILY_STUDY_CAP_HOURS * 3600;
export const PASSING_LAB_SCORE = 75;
export const PASSING_QUIZ_PERCENT = 75;
export const IDLE_TIMEOUT_SECONDS = 120;

/**
 * Parses duration string like "36 Hours" or "32 Hours" into a numeric hour count.
 */
export function parseModuleHours(durationHoursStr: string): number {
  const match = String(durationHoursStr || "").match(/(\d+(?:\.\d+)?)/);
  const parsed = match ? parseFloat(match[1]) : 36;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 36;
}

/**
 * Splits a module's total hours into strict 80% Digital LMS hours + 20% Physical Tutoring Lab hours.
 */
export function getModuleHourSplit(durationHoursStr: string) {
  const totalHours = parseModuleHours(durationHoursStr);
  const digitalRequiredHours = Number((totalHours * 0.8).toFixed(1));
  const physicalRequiredHours = Number((totalHours - digitalRequiredHours).toFixed(1));
  const digitalRequiredSeconds = Math.round(digitalRequiredHours * 3600);
  return {
    totalHours,
    digitalRequiredHours,
    physicalRequiredHours,
    digitalRequiredSeconds,
  };
}

/**
 * Deterministically breaks each 30-40h official course module into 6 multi-hour structured digital units
 * whose allocated hours sum exactly to the module's 80% Digital LMS requirement.
 */
export function buildStructuredUnitsForModule(mod: CourseModuleItem): StructuredUnit[] {
  const { digitalRequiredHours } = getModuleHourSplit(mod.durationHours);
  const concepts = mod.keyConcepts && mod.keyConcepts.length > 0 ? mod.keyConcepts : [mod.title];

  // Build 6 structured units: 4 core concept deep dives + 1 architecture/code lab walkthrough + 1 synthesis & assessment prep
  const rawTitles: Array<{
    title: string;
    unitType: StructuredUnit["unitType"];
    weight: number;
    objectives: string[];
  }> = [
    {
      title: `Unit 1: Core Foundations — ${concepts[0] || mod.title}`,
      unitType: "concept",
      weight: 0.18,
      objectives: [
        `Deconstruct theoretical & mathematical foundations of ${concepts[0] || mod.title}`,
        "Analyze real Indian enterprise production constraints & failure modes",
        "Complete active comprehension checkpoint before advancing to Unit 2",
      ],
    },
    {
      title: `Unit 2: Applied Engineering — ${concepts[1] || "Core Workflow Patterns"}`,
      unitType: "concept",
      weight: 0.18,
      objectives: [
        `Master applied workflows for ${concepts[1] || "scalable system implementation"}`,
        "Compare baseline naive implementations against production-grade benchmarks",
        "Document edge-case handling & performance trade-offs",
      ],
    },
    {
      title: `Unit 3: Production Architecture — ${concepts[2] || "Optimization & Reliability"}`,
      unitType: "concept",
      weight: 0.18,
      objectives: [
        `Design fault-tolerant workflows covering ${concepts[2] || "quality & reliability standards"}`,
        "Apply industry QA, validation, and audit instrumentation",
        "Map architecture decisions to MNC technical interview rubrics",
      ],
    },
    {
      title: `Unit 4: Enterprise Scaling — ${concepts[3] || "Deployment & Governance"}`,
      unitType: "concept",
      weight: 0.16,
      objectives: [
        `Operationalize ${concepts[3] || "enterprise deployment"} under strict latency/accuracy SLAs`,
        "Audit security, compliance, and cost-optimization levers",
        "Prepare technical defense notes for 20% physical mentor review",
      ],
    },
    {
      title: `Unit 5: Code & Case Study Deep-Dive — ${mod.codeOrCaseExample.title}`,
      unitType: "architecture_code",
      weight: 0.16,
      objectives: [
        `Trace every line of "${mod.codeOrCaseExample.title}" (${mod.codeOrCaseExample.language})`,
        "Identify bottlenecks, edge conditions, and refactoring opportunities",
        "Bridge directly into the graded Hands-On Capstone Mini-Lab",
      ],
    },
    {
      title: `Unit 6: Capstone Synthesis, Lab Readiness & Exam Review`,
      unitType: "capstone_prep",
      weight: 0.14,
      objectives: [
        `Synthesize all core pillars of Module ${mod.moduleNumber}: ${mod.title}`,
        "Validate portfolio deliverable criteria before timed proctored assessment",
        "Prepare whiteboard architecture brief for 20% physical mentor lab",
      ],
    },
  ];

  // Allocate exact hours summing to digitalRequiredHours, and split each ~5h unit into 6 full interactive sessions
  let allocatedRunning = 0;
  return rawTitles.map((item, idx) => {
    const isLast = idx === rawTitles.length - 1;
    const hours = isLast
      ? Number(Math.max(1, digitalRequiredHours - allocatedRunning).toFixed(1))
      : Number((digitalRequiredHours * item.weight).toFixed(1));
    allocatedRunning = Number((allocatedRunning + hours).toFixed(1));

    const focusConcept = concepts[idx % concepts.length] || mod.title;
    const unitId = `${mod.id}-u${idx + 1}`;
    const totalUnitMins = Math.round(hours * 60);
    const sessions = buildSessionsForUnit(unitId, focusConcept, totalUnitMins);

    return {
      unitIndex: idx,
      unitId,
      title: item.title,
      unitType: item.unitType,
      allocatedHours: hours,
      requiredSeconds: Math.round(hours * 3600),
      objectives: item.objectives,
      sessions,
      checkQuestion: `Active Study Verification (Unit ${idx + 1}): Which engineering practice is mandatory when applying "${focusConcept}" in production?`,
      checkOptions: [
        "Validate assumptions against real edge cases, measure quantitative metrics, and document reproducible steps",
        "Skip verification and rely purely on default unvalidated configurations",
        "Avoid logging, testing, or profiling until after production incidents occur",
      ],
      correctOptionIndex: 0,
    };
  });
}

/**
 * Splits a multi-hour Unit (~4–5.5 hours) into 6 concrete, university-grade interactive learning sessions
 * totaling the exact allocated minutes of that unit.
 */
export function buildSessionsForUnit(
  unitId: string,
  focusConcept: string,
  totalUnitMinutes: number
): StructuredSession[] {
  const defs: Array<{
    type: UnitSessionType;
    shortLabel: string;
    title: string;
    subtitle: string;
    weight: number;
  }> = [
    {
      type: "deep_textbook",
      shortLabel: "S1 • Textbook",
      title: `Session 1: Deep Textbook Chapter & Architecture`,
      subtitle: `Multi-section theory, formulas, ASCII architecture diagram & comparison matrix for ${focusConcept}`,
      weight: 0.18,
    },
    {
      type: "code_walkthrough",
      shortLabel: "S2 • Code Trace",
      title: `Session 2: Naive vs. Production Code Lab & Benchmarks`,
      subtitle: `Side-by-side enterprise refactor, latency/memory benchmarks & line-by-line execution trace`,
      weight: 0.18,
    },
    {
      type: "unit_coding_drill",
      shortLabel: "S3 • Coding Drill",
      title: `Session 3: Guided Unit Hands-On Coding Drill`,
      subtitle: `Write real working code from a unit-specific TODO scaffold & pass strict >=75/100 grading`,
      weight: 0.2,
    },
    {
      type: "debugging_challenge",
      shortLabel: "S4 • Debugging",
      title: `Session 4: Production Bug & Optimization Challenge`,
      subtitle: `Diagnose a failing production snippet, fix root-cause defects & explain engineering trade-offs`,
      weight: 0.16,
    },
    {
      type: "system_design_viva",
      shortLabel: "S5 • Design Viva",
      title: `Session 5: Enterprise System Design & Mentor Viva`,
      subtitle: `Solve a real Indian enterprise scale scenario & pass 3 deep architectural viva questions`,
      weight: 0.15,
    },
    {
      type: "unit_problem_set",
      shortLabel: "S6 • Problem Set",
      title: `Session 6: Unit Technical Problem Set (6 Questions)`,
      subtitle: `Topic-specific code tracing, edge-case & architecture exam (>=75% to sign off Unit)`,
      weight: 0.13,
    },
  ];

  let minsUsed = 0;
  return defs.map((d, sIdx) => {
    const isLast = sIdx === defs.length - 1;
    const allocatedMinutes = isLast
      ? Math.max(20, totalUnitMinutes - minsUsed)
      : Math.max(25, Math.round(totalUnitMinutes * d.weight));
    minsUsed += allocatedMinutes;

    return {
      sessionIndex: sIdx,
      sessionId: `${unitId}-s${sIdx + 1}`,
      type: d.type,
      shortLabel: d.shortLabel,
      title: d.title,
      subtitle: d.subtitle,
      allocatedMinutes,
      requiredSeconds: allocatedMinutes * 60,
    };
  });
}

/**
 * Converts a pre-solved lab template into a genuine student TODO scaffold so learners cannot
 * click Submit immediately without writing real code/work.
 */
export function createStudentLabScaffold(mod: CourseModuleItem): string {
  const raw = (mod.handsOnLab?.starterTemplate || "").trim();
  const lines = raw.split("\n");
  if (lines.length <= 4) {
    return `# Module ${mod.moduleNumber} Hands-On Lab: ${mod.handsOnLab.title}
# Task: ${mod.handsOnLab.taskDescription}
# Deliverable Criteria: ${mod.handsOnLab.deliverableCriteria}

# TODO: Write your complete, production-ready implementation below.
# Pre-filled solutions are disabled to ensure authentic skill mastery.
`;
  }

  // Keep function signature / imports (first ~3 non-empty lines) and replace implementation body with structured TODOs
  const headerLines = lines.slice(0, Math.min(4, lines.length));
  return `${headerLines.join("\n")}
    # ==========================================================
    # TODO (Student Implementation Required — Minimum 75/100):
    # Task: ${mod.handsOnLab.taskDescription}
    # Criteria: ${mod.handsOnLab.deliverableCriteria}
    # ----------------------------------------------------------
    # Step 1: Validate inputs & handle missing/edge values
    # Step 2: Implement core domain logic cleanly without shortcuts
    # Step 3: Return verified output matching deliverable criteria
    # ==========================================================
    pass
`;
}

/**
 * Checks whether the student actually authored substantial code/work beyond the untouched TODO scaffold.
 */
export function validateMeaningfulLabEffort(submission: string, scaffold: string): { valid: boolean; reason?: string } {
  const cleanSub = submission.trim();
  const cleanScaffold = scaffold.trim();
  if (!cleanSub || cleanSub.length < 60) {
    return { valid: false, reason: "Submission is too short. Write a complete implementation addressing all lab requirements." };
  }
  if (cleanSub === cleanScaffold) {
    return { valid: false, reason: "You submitted the unmodified TODO starter scaffold. Please implement the required solution before submitting." };
  }

  // Strip comments and blank lines to verify real authored lines exist
  const nonCommentLines = cleanSub
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("//") && !l.startsWith("/*") && !l.startsWith("*") && l !== "pass");

  if (nonCommentLines.length < 4) {
    return {
      valid: false,
      reason: "Please write at least 4 lines of functional implementation (excluding comments and 'pass') to qualify for AI lab grading.",
    };
  }
  return { valid: true };
}

/**
 * Computes the strict 4-gate completion status for any module based on server-backed progress.
 */
export function computeModuleGateStatus(
  mod: CourseModuleItem,
  progress?: ModuleServerProgress
): ModuleGateStatus {
  const { totalHours, digitalRequiredHours, physicalRequiredHours, digitalRequiredSeconds } =
    getModuleHourSplit(mod.durationHours);

  const digitalLoggedSeconds = Math.min(
    digitalRequiredSeconds,
    Math.max(0, Math.floor(progress?.digitalSecondsLogged || 0))
  );
  const digitalLoggedHours = Number((digitalLoggedSeconds / 3600).toFixed(2));
  const physicalCreditedHours = progress?.physicalVerified
    ? physicalRequiredHours
    : Number(Math.min(physicalRequiredHours, progress?.physicalHoursCredited || 0).toFixed(2));
  const totalLoggedHours = Number((digitalLoggedHours + physicalCreditedHours).toFixed(2));

  const gate1TimeMet = digitalLoggedSeconds >= digitalRequiredSeconds;
  const gate2LabPassed = Boolean(progress?.labPassed && (progress?.labScore ?? 0) >= PASSING_LAB_SCORE);
  const gate3QuizPassed = Boolean(progress?.quizPassed && (progress?.quizBestScorePercent ?? 0) >= PASSING_QUIZ_PERCENT);
  const gate4PhysicalVerified = Boolean(progress?.physicalVerified);

  const allGatesPassed = gate1TimeMet && gate2LabPassed && gate3QuizPassed && gate4PhysicalVerified;

  // Weighted completion percentage: 50% digital study hours, 15% lab, 15% timed exam, 20% physical mentor lab
  const timeFraction = digitalRequiredSeconds > 0 ? Math.min(1, digitalLoggedSeconds / digitalRequiredSeconds) : 0;
  const completionPercent = Math.round(
    timeFraction * 50 +
      (gate2LabPassed ? 15 : 0) +
      (gate3QuizPassed ? 15 : 0) +
      (gate4PhysicalVerified ? 20 : 0)
  );

  return {
    totalHours,
    digitalRequiredHours,
    digitalRequiredSeconds,
    physicalRequiredHours,
    digitalLoggedSeconds,
    digitalLoggedHours,
    physicalCreditedHours,
    totalLoggedHours,
    gate1TimeMet,
    gate2LabPassed,
    gate3QuizPassed,
    gate4PhysicalVerified,
    allGatesPassed,
    completionPercent,
  };
}

/**
 * Sequential prerequisite rule: Module 1 (idx 0) is always unlocked.
 * Module N (idx > 0) unlocks ONLY when Module N-1 has passed ALL 4 verification gates.
 */
export function isModuleUnlocked(
  programModules: CourseModuleItem[],
  moduleIndex: number,
  progressMap: Record<string, ModuleServerProgress>
): boolean {
  if (moduleIndex <= 0) return true;
  const prevModule = programModules[moduleIndex - 1];
  if (!prevModule) return true;
  const prevStatus = computeModuleGateStatus(prevModule, progressMap[prevModule.id]);
  return prevStatus.allGatesPassed;
}

export function formatDurationHMS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return `${hrs}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
}

export function formatHoursShort(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  return `${hrs}h ${String(mins).padStart(2, "0")}m`;
}
