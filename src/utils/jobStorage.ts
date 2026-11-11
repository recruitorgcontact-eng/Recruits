import { LiveIndiaJob, UserProfile, JobApplication } from "../types";

const CUSTOM_JOBS_KEY = "arohi_custom_free_jobs";
const USER_PROFILE_KEY = "arohi_user_auth_profile";
const APPLICATIONS_KEY = "arohi_job_applications";

// Get saved user profile
export function getStoredUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading stored user profile:", err);
    return null;
  }
}

// Get custom recruiter-posted free jobs
export function getStoredFreeJobs(): LiveIndiaJob[] {
  try {
    const raw = localStorage.getItem(CUSTOM_JOBS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading custom free jobs:", err);
    return [];
  }
}

// Save a new free posted job
export function saveFreeJob(job: LiveIndiaJob): LiveIndiaJob[] {
  const existing = getStoredFreeJobs();
  const updated = [job, ...existing];
  try {
    localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(updated));
    // Dispatch window event so candidate live job engine updates instantly
    window.dispatchEvent(new Event("arohi_jobs_updated"));
  } catch (err) {
    console.error("Error saving free job:", err);
  }
  return updated;
}

// Toggle job active status
export function toggleJobStatus(jobId: string, status: "Active" | "Closed"): LiveIndiaJob[] {
  const existing = getStoredFreeJobs();
  const updated = existing.map((j) => (j.id === jobId ? { ...j, status } : j));
  try {
    localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("arohi_jobs_updated"));
  } catch (err) {
    console.error("Error toggling job status:", err);
  }
  return updated;
}

// Delete a posted job
export function deleteFreeJob(jobId: string): LiveIndiaJob[] {
  const existing = getStoredFreeJobs();
  const updated = existing.filter((j) => j.id !== jobId);
  try {
    localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("arohi_jobs_updated"));
  } catch (err) {
    console.error("Error deleting free job:", err);
  }
  return updated;
}

// Get candidate applications
export function getJobApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Candidate submits application for a job
export function submitCandidateApplication(app: Omit<JobApplication, "id" | "appliedDate" | "status">): JobApplication {
  const newApp: JobApplication = {
    ...app,
    id: `app-${Date.now()}`,
    appliedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    status: "Under Review",
  };
  const existing = getJobApplications();
  const updated = [newApp, ...existing];
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));

    // Also update applicant count on the job
    const jobs = getStoredFreeJobs();
    const updatedJobs = jobs.map((j) =>
      j.id === app.jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j
    );
    localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(updatedJobs));

    window.dispatchEvent(new Event("arohi_jobs_updated"));
  } catch (err) {
    console.error("Error saving job application:", err);
  }
  return newApp;
}
