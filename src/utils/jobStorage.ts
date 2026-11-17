import { LiveIndiaJob, UserProfile, JobApplication } from "../types";

const CUSTOM_JOBS_KEY = "arohi_custom_free_jobs";
const USER_PROFILE_KEY = "arohi_user_auth_profile";
const APPLICATIONS_KEY = "arohi_job_applications";

// Pull persisted jobs and applications from the backend server into localStorage cache
export async function syncPlatformDataFromServer(): Promise<void> {
  try {
    const [jobsRes, appsRes] = await Promise.all([
      fetch("/api/platform/jobs"),
      fetch("/api/platform/applications"),
    ]);

    if (jobsRes.ok) {
      const jobsData = await jobsRes.json();
      if (Array.isArray(jobsData.jobs) && jobsData.jobs.length > 0) {
        const localJobs = getStoredFreeJobs();
        const serverIds = new Set(jobsData.jobs.map((j: LiveIndiaJob) => j.id));
        const merged = [
          ...jobsData.jobs,
          ...localJobs.filter((j) => !serverIds.has(j.id)),
        ];
        localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event("arohi_jobs_updated"));
      }
    }

    if (appsRes.ok) {
      const appsData = await appsRes.json();
      if (Array.isArray(appsData.applications) && appsData.applications.length > 0) {
        const localApps = getJobApplications();
        const serverAppIds = new Set(appsData.applications.map((a: JobApplication) => a.id));
        const mergedApps = [
          ...appsData.applications,
          ...localApps.filter((a) => !serverAppIds.has(a.id)),
        ];
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(mergedApps));
        window.dispatchEvent(new Event("arohi_jobs_updated"));
      }
    }
  } catch (err) {
    // Silent fallback to local cache if offline
  }
}

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

// Save a new free posted job (persists to both localStorage and backend server)
export function saveFreeJob(job: LiveIndiaJob): LiveIndiaJob[] {
  const existing = getStoredFreeJobs();
  const updated = [job, ...existing.filter((j) => j.id !== job.id)];
  try {
    localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("arohi_jobs_updated"));
    fetch("/api/platform/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job }),
    }).catch(() => {});
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
    fetch(`/api/platform/jobs/${encodeURIComponent(jobId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
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
    fetch(`/api/platform/jobs/${encodeURIComponent(jobId)}`, {
      method: "DELETE",
    }).catch(() => {});
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

    fetch("/api/platform/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application: newApp }),
    }).catch(() => {});
  } catch (err) {
    console.error("Error saving job application:", err);
  }
  return newApp;
}
