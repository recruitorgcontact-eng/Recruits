import { CareerMemory, CareerScoreBreakdown } from "../types";
import { DEFAULT_CAREER_MEMORY, INITIAL_CAREER_SCORE } from "../data/mockData";

export const CAREER_MEMORY_STORAGE_KEY = "recruits_arohi_career_memory_v1";
export const CAREER_SCORE_STORAGE_KEY = "recruits_arohi_career_score_v1";

/**
 * Safely normalizes and merges a partial/stored object with DEFAULT_CAREER_MEMORY
 * so missing fields or schema updates never break the application.
 */
export function normalizeCareerMemory(raw: unknown): CareerMemory {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_CAREER_MEMORY };
  }

  const candidate = raw as Partial<CareerMemory>;

  return {
    permissionGranted:
      typeof candidate.permissionGranted === "boolean"
        ? candidate.permissionGranted
        : DEFAULT_CAREER_MEMORY.permissionGranted,
    personalInfo:
      candidate.personalInfo && typeof candidate.personalInfo === "object"
        ? { ...candidate.personalInfo }
        : undefined,
    lastSyncedAt:
      typeof candidate.lastSyncedAt === "string"
        ? candidate.lastSyncedAt
        : new Date().toISOString(),
    education: {
      degree:
        typeof candidate.education?.degree === "string"
          ? candidate.education.degree
          : DEFAULT_CAREER_MEMORY.education.degree,
      field:
        typeof candidate.education?.field === "string"
          ? candidate.education.field
          : DEFAULT_CAREER_MEMORY.education.field,
      institution:
        typeof candidate.education?.institution === "string"
          ? candidate.education.institution
          : DEFAULT_CAREER_MEMORY.education.institution,
      graduationYear:
        typeof candidate.education?.graduationYear === "string"
          ? candidate.education.graduationYear
          : DEFAULT_CAREER_MEMORY.education.graduationYear,
    },
    skills: Array.isArray(candidate.skills)
      ? candidate.skills.filter((s): s is string => typeof s === "string")
      : [...DEFAULT_CAREER_MEMORY.skills],
    certifications: Array.isArray(candidate.certifications)
      ? candidate.certifications.filter((c): c is string => typeof c === "string")
      : [...DEFAULT_CAREER_MEMORY.certifications],
    preferredIndustries: Array.isArray(candidate.preferredIndustries)
      ? candidate.preferredIndustries.filter((i): i is string => typeof i === "string")
      : [...DEFAULT_CAREER_MEMORY.preferredIndustries],
    preferredLocations: Array.isArray(candidate.preferredLocations)
      ? candidate.preferredLocations.filter((l): l is string => typeof l === "string")
      : [...DEFAULT_CAREER_MEMORY.preferredLocations],
    targetRole:
      typeof candidate.targetRole === "string"
        ? candidate.targetRole
        : DEFAULT_CAREER_MEMORY.targetRole,
    expectedSalaryINR:
      typeof candidate.expectedSalaryINR === "number" && !Number.isNaN(candidate.expectedSalaryINR)
        ? candidate.expectedSalaryINR
        : DEFAULT_CAREER_MEMORY.expectedSalaryINR,
    careerGoals:
      typeof candidate.careerGoals === "string"
        ? candidate.careerGoals
        : DEFAULT_CAREER_MEMORY.careerGoals,
    experienceYears:
      typeof candidate.experienceYears === "number" && !Number.isNaN(candidate.experienceYears)
        ? candidate.experienceYears
        : DEFAULT_CAREER_MEMORY.experienceYears,
    portfolioProjects: Array.isArray(candidate.portfolioProjects)
      ? candidate.portfolioProjects
      : [...DEFAULT_CAREER_MEMORY.portfolioProjects],
    interviewHistory: Array.isArray(candidate.interviewHistory)
      ? candidate.interviewHistory
      : [...DEFAULT_CAREER_MEMORY.interviewHistory],
    learningProgress: Array.isArray(candidate.learningProgress)
      ? candidate.learningProgress
      : [...DEFAULT_CAREER_MEMORY.learningProgress],
  };
}

export function loadCareerMemoryFromStorage(): CareerMemory {
  if (typeof window === "undefined") {
    return { ...DEFAULT_CAREER_MEMORY };
  }
  try {
    const raw = window.localStorage.getItem(CAREER_MEMORY_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_CAREER_MEMORY };
    }
    const parsed = JSON.parse(raw);
    return normalizeCareerMemory(parsed);
  } catch (err) {
    console.warn("Failed to read careerMemory from localStorage, using default:", err);
    return { ...DEFAULT_CAREER_MEMORY };
  }
}

export function saveCareerMemoryToStorage(memory: CareerMemory): void {
  if (typeof window === "undefined") return;
  try {
    const payload: CareerMemory = {
      ...memory,
      lastSyncedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CAREER_MEMORY_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to write careerMemory to localStorage:", err);
  }
}

export function resetCareerMemoryInStorage(): CareerMemory {
  const fresh: CareerMemory = {
    ...DEFAULT_CAREER_MEMORY,
    lastSyncedAt: new Date().toISOString(),
  };
  saveCareerMemoryToStorage(fresh);
  return fresh;
}

export function loadCareerScoreFromStorage(): CareerScoreBreakdown {
  if (typeof window === "undefined") {
    return INITIAL_CAREER_SCORE;
  }
  try {
    const raw = window.localStorage.getItem(CAREER_SCORE_STORAGE_KEY);
    if (!raw) return INITIAL_CAREER_SCORE;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.totalScore === "number" &&
      Array.isArray(parsed.categories) &&
      Array.isArray(parsed.improvementActions)
    ) {
      return parsed as CareerScoreBreakdown;
    }
  } catch (err) {
    console.warn("Failed to read careerScore from localStorage:", err);
  }
  return INITIAL_CAREER_SCORE;
}

export function saveCareerScoreToStorage(score: CareerScoreBreakdown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAREER_SCORE_STORAGE_KEY, JSON.stringify(score));
  } catch (err) {
    console.warn("Failed to write careerScore to localStorage:", err);
  }
}
