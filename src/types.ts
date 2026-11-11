export type UserRoleMode = 'candidate' | 'recruiter';

export type LanguageCode = 'en' | 'hi' | 'or' | 'ta' | 'te' | 'kn' | 'mr' | 'gu' | 'bn';

export interface CareerMemory {
  permissionGranted: boolean;
  education: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: string;
  };
  skills: string[];
  certifications: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
  targetRole: string;
  expectedSalaryINR: number; // In LPA (Lakhs Per Annum)
  careerGoals: string;
  experienceYears: number;
  portfolioProjects: {
    title: string;
    techStack: string[];
    description: string;
  }[];
  interviewHistory: {
    id: string;
    role: string;
    date: string;
    score: number;
    feedback: string;
  }[];
  learningProgress: {
    courseTitle: string;
    provider: string;
    progressPercent: number;
  }[];
}

export interface SkillBadge {
  id: string;
  title: string;
  category: 'certification' | 'project' | 'skill_mastery' | 'career_goal';
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  icon: string;
  description: string;
  earnedDate?: string;
  isEarned: boolean;
  progressPercent: number;
  unlockedBy: string;
  goalImpact: string;
  verifiedSkills: string[];
}

export interface CareerScoreBreakdown {
  totalScore: number; // 0-100
  categories: {
    name: string;
    score: number; // max 100
    weight: number;
    impact: string;
  }[];
  improvementActions: {
    id: string;
    title: string;
    potentialScoreIncrease: number;
    category: string;
    actionType: 'resume' | 'skill' | 'interview' | 'certification' | 'project';
  }[];
}

export interface CareerPath {
  title: string;
  fitScore: number;
  description: string;
  marketDemand: 'Ultra High' | 'High' | 'Moderate' | 'Emerging';
  projectedSalaryRangeINR: string;
  transitionTimeline: string;
  keyMilestones: string[];
  recommendedSkillsToAcquire: string[];
  sampleJobTitles: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Remote' | 'Hybrid' | 'Contract';
  experienceRequired: string;
  salaryRangeINR: string;
  postedDate: string;
  requiredSkills: string[];
  description: string;
  aiMatchScore?: number;
  aiMatchReasoning?: string;
  missingSkills?: string[];
}

export interface ATSAnalysisResult {
  atsScore: number; // 0-100
  keyStrengths: string[];
  criticalKeywordGaps: string[];
  formattingImpactScore: number;
  quantifiedAchievementsScore: number;
  suggestedJobRoles: string[];
  rewrittenResumeSummary: string[];
  improvedBulletPoints: {
    original: string;
    improved: string;
    reason: string;
  }[];
}

export interface QuickQuizQuestion {
  id: string;
  question: string;
  category: 'technical' | 'situational' | 'system_design' | 'behavioral';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  keyTakeaway: string;
  timeLimitSeconds: number; // default 30
}

export interface QuickQuizResult {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  averageTimeSeconds: number;
  feedbackSummary: string;
  answers: {
    questionId: string;
    selectedIndex: number | null;
    isCorrect: boolean;
    timeTakenSeconds: number;
  }[];
}

export interface MockInterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'system_design' | 'hr';
  expectedKeyPoints: string[];
  sampleAnswerOverview: string;
  isCurveballFollowUp?: boolean;
  stressTriggerReason?: string;
  unexpectedFollowUps?: string[];
}

export interface ToneAnalysisData {
  confidenceScore: number; // 0-100
  clarityScore: number; // 0-100
  positivityScore: number; // 0-100
  overallToneLabel: string; // e.g., "Assertive & High Confidence", "Warm & Professional", "Slightly Hesitant"
  wordsPerMinute: number; // e.g. 135
  fillerWordsCount: number; // e.g. 2
  detectedFillerWords?: string[]; // e.g. ["um", "you know"]
  pitchInflection: 'Dynamic & Engaging' | 'Steady & Clear' | 'Monotone' | 'Expressive';
  energyLevel: 'High Enthusiasm' | 'Balanced' | 'Low Projection';
  toneImprovementTips: string[];
}

export interface InterviewEvaluation {
  score: number; // 0-100
  clarityScore: number;
  technicalDepthScore: number;
  starAlignmentScore: number;
  strengths: string[];
  improvements: string[];
  sampleIdealResponse: string;
  mentorFeedbackSpeech: string;
  toneAnalysis?: ToneAnalysisData;
  stressResilienceScore?: number;
  composureUnderNoiseScore?: number;
  adaptabilityScore?: number;
  stressRecoveryLabel?: string;
  stressPressureAdvice?: string[];
}

export interface InterviewCalendarEvent {
  id: string;
  title: string;
  organization: string;
  role: string;
  eventType: "mock_interview" | "actual_interview" | "prep_milestone";
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  durationMinutes: number;
  interviewerName?: string;
  locationOrUrl: string;
  reminderTiming: "30_min_before" | "2_hours_before" | "24_hours_before" | "1_day_before";
  prepChecklist: { id: string; text: string; completed: boolean }[];
  focusTopics?: string[];
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
  arohiAdvice?: string;
}

export interface SkillGapAnalysis {
  targetRole: string;
  currentReadinessPercent: number;
  masteredSkills: string[];
  gapSkills: {
    skillName: string;
    importance: 'Critical' | 'High' | 'Nice to have';
    learningDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    timeToMaster: string;
  }[];
  roadmap: {
    phase: string;
    duration: string;
    topics: string[];
    handsOnProject: string;
  }[];
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  type: 'Course' | 'Certification' | 'Internship' | 'Project';
  url: string;
  reason: string;
}

export interface SalaryEstimate {
  targetRole: string;
  location: string;
  entryLevelINR: string;
  midLevelINR: string;
  seniorLevelINR: string;
  leadLevelINR: string;
  topSkillsBoostingPay: { skill: string; boostPercentage: string }[];
  negotiationTips: string[];
  ctcBreakdownGuide: {
    component: string;
    typicalPercentage: string;
    negotiationStrategy: string;
  }[];
}

export interface CandidateFitAnalysis {
  candidateName: string;
  matchScore: number;
  matchHighlights: string[];
  missingCompetencies: string[];
  predictedCultureFit: string;
  suggestedInterviewQuestions: string[];
  recommendedSalaryRangeINR: string;
  interviewSummary: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRoleMode;
  organizationName?: string;
  designation?: string;
  location?: string;
  isVerifiedRecruiter?: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  coverNote?: string;
  appliedDate: string;
  status: 'Received' | 'Shortlisted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Contacted';
}

export interface LiveIndiaJob {
  id: string;
  title: string;
  organization: string;
  sector: 'Government' | 'Private' | 'PSU' | 'Banking';
  categoryTag: string; // e.g. "Central Govt", "State PSC", "Private Tech", "Startups"
  location: string;
  vacanciesOrPositions: string;
  eligibility: string;
  salaryOrPayScale: string;
  lastDateToApply: string;
  officialNotificationUrl: string;
  applyUrl: string;
  selectionProcessOverview: string;
  keySkillsOrSyllabus: string[];
  postedTime: string;
  isHotNotification?: boolean;
  postedByRecruiterEmail?: string;
  isRecruiterFreePost?: boolean;
  contactEmail?: string;
  applicantCount?: number;
  status?: 'Active' | 'Closed';
}

export interface JobAlertSubscription {
  id: string;
  email: string;
  sector: string;
  categoryTag: string;
  location: string;
  keywords: string;
  frequency: 'Instant Push & Email' | 'Daily Digest' | 'Weekly Briefing';
  isActive: boolean;
  createdAt: string;
  lastAlertSentAt?: string;
  matchCount?: number;
}
