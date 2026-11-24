import React, { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  X,
  Download,
  Search,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  LogOut,
  ShieldCheck,
  Trash2,
  Check,
  Loader2,
  Lock,
} from "lucide-react";
import {
  ADMIN_OWNER_EMAIL,
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogleAdmin,
  signOutFirebase,
} from "../firebase";

export type ApplicationStatus =
  | "new"
  | "contacted"
  | "certificate_received"
  | "shortlisted"
  | "joined"
  | "rejected";

export interface ItiApplicationRecord {
  id: string;
  applicationRef: string;
  fullName: string;
  mobileNumber: string;
  aadhaarNumber: string;
  aadhaarMasked: string;
  qualification: "ITI" | "12th Pass" | "10th Pass";
  itiTrade: string;
  homeState: string;
  district: string;
  collegeName: string;
  consentAccepted: boolean;
  programSlug: string;
  status: ApplicationStatus;
  whatsappShared: boolean;
  adminNotes: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

interface ItiAdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "certificate_received", label: "Certificate Received" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "joined", label: "Joined" },
  { value: "rejected", label: "Not Eligible" },
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "text-blue-700 bg-blue-50 border-blue-200",
  contacted: "text-amber-700 bg-amber-50 border-amber-200",
  certificate_received: "text-indigo-700 bg-indigo-50 border-indigo-200",
  shortlisted: "text-emerald-700 bg-emerald-50 border-emerald-200",
  joined: "text-teal-800 bg-teal-50 border-teal-200",
  rejected: "text-slate-600 bg-slate-100 border-slate-200",
};

function formatAadhaarSpaced(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatDateTime(ts?: Timestamp | null): string {
  if (!ts || typeof ts.toDate !== "function") return "Just now";
  return ts.toDate().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function csvEscape(val: string | boolean): string {
  const str = String(val ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const ItiAdminLeadsModal: React.FC<ItiAdminLeadsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [leads, setLeads] = useState<ItiApplicationRecord[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [revealedAadhaarIds, setRevealedAadhaarIds] = useState<Record<string, boolean>>({});
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isVerifiedAdmin = Boolean(
    user &&
      user.emailVerified &&
      user.email?.toLowerCase() === ADMIN_OWNER_EMAIL.toLowerCase()
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Only attach onSnapshot listener when modal is open, auth is ready, and verified admin is logged in
  useEffect(() => {
    if (!isOpen || !authReady || !isVerifiedAdmin) {
      setLeads([]);
      setLoadingLeads(false);
      return;
    }

    setLoadingLeads(true);
    setRuntimeError(null);
    const path = "itiApplications";
    const q = query(collection(db, path), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const rows: ItiApplicationRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ItiApplicationRecord, "id">),
        }));
        setLeads(rows);
        setLoadingLeads(false);
      },
      (err) => {
        setLoadingLeads(false);
        setRuntimeError(
          err?.message || "Unable to load student applications from Firestore."
        );
        try {
          handleFirestoreError(err, OperationType.LIST, path);
        } catch {
          // Structured error logged by handleFirestoreError; surfaced cleanly in UI
        }
      }
    );

    return () => unsub();
  }, [isOpen, authReady, isVerifiedAdmin]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const filteredLeads = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return leads.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.fullName.toLowerCase().includes(q) ||
        item.mobileNumber.includes(q) ||
        item.applicationRef.toLowerCase().includes(q) ||
        item.homeState.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        (item.itiTrade || "").toLowerCase().includes(q) ||
        (item.collegeName || "").toLowerCase().includes(q)
      );
    });
  }, [leads, searchTerm, statusFilter]);

  const summaryCounts = useMemo(() => {
    return {
      total: leads.length,
      newCount: leads.filter((l) => l.status === "new").length,
      certReceived: leads.filter(
        (l) => l.whatsappShared || l.status === "certificate_received"
      ).length,
      shortlisted: leads.filter(
        (l) => l.status === "shortlisted" || l.status === "joined"
      ).length,
    };
  }, [leads]);

  const handleAdminSignIn = async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithGoogleAdmin();
    } catch (err: any) {
      setAuthError(err?.message || "Google sign-in was cancelled or blocked.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleUpdateLead = async (
    lead: ItiApplicationRecord,
    patch: Partial<Pick<ItiApplicationRecord, "status" | "whatsappShared" | "adminNotes">>
  ) => {
    setSavingId(lead.id);
    setRuntimeError(null);
    const docPath = `itiApplications/${lead.id}`;
    try {
      const nextNotes =
        patch.adminNotes !== undefined
          ? patch.adminNotes.trim().slice(0, 500)
          : lead.adminNotes;
      await updateDoc(doc(db, "itiApplications", lead.id), {
        status: patch.status ?? lead.status,
        whatsappShared: patch.whatsappShared ?? lead.whatsappShared,
        adminNotes: nextNotes,
        updatedAt: serverTimestamp(),
      });
      setSavedNoticeId(lead.id);
      setTimeout(() => {
        setSavedNoticeId((prev) => (prev === lead.id ? null : prev));
      }, 1800);
    } catch (err: any) {
      setRuntimeError(err?.message || "Failed to update application.");
      try {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      } catch {
        // Logged
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    setSavingId(leadId);
    setRuntimeError(null);
    const docPath = `itiApplications/${leadId}`;
    try {
      await deleteDoc(doc(db, "itiApplications", leadId));
      setConfirmDeleteId(null);
    } catch (err: any) {
      setRuntimeError(err?.message || "Failed to delete application.");
      try {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      } catch {
        // Logged
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Application Ref",
      "Submitted At",
      "Full Name",
      "Mobile Number",
      "Aadhaar Number",
      "Qualification",
      "ITI Trade",
      "District",
      "Home State",
      "ITI College / School",
      "Status",
      "ITI Cert Received on WhatsApp",
      "Admin Notes",
    ];

    const rows = filteredLeads.map((l) => [
      l.applicationRef,
      formatDateTime(l.createdAt),
      l.fullName,
      `+91 ${l.mobileNumber}`,
      formatAadhaarSpaced(l.aadhaarNumber),
      l.qualification,
      l.itiTrade || "-",
      l.district,
      l.homeState,
      l.collegeName || "-",
      l.status,
      l.whatsappShared ? "Yes" : "No",
      l.adminNotes || "",
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) => row.map((cell) => csvEscape(cell)).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `recruits-iti-chennai-leads-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="iti-admin-modal-title"
    >
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Recruits.org.in Admin Vault · Firestore Cloud Sync</span>
            </div>
            <h2
              id="iti-admin-modal-title"
              className="text-lg font-bold text-slate-950 tracking-tight truncate mt-0.5"
            >
              Chennai ITI Manufacturing Hiring — Student Applications
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <button
                type="button"
                onClick={() => signOutFirebase()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Admin Panel"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {!authReady ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
              <span className="text-sm font-medium">Checking admin session…</span>
            </div>
          ) : !user ? (
            <div className="max-w-md mx-auto py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-950">
                  Restricted Admin Access
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Student Aadhaar and mobile records are strictly isolated. Sign in
                  with your verified owner Google account (
                  <span className="font-semibold text-slate-900">
                    {ADMIN_OWNER_EMAIL}
                  </span>
                  ) to view, update, and export leads.
                </p>
              </div>
              {authError && (
                <p className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {authError}
                </p>
              )}
              <button
                type="button"
                onClick={handleAdminSignIn}
                disabled={authBusy}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 text-sm font-semibold transition cursor-pointer disabled:opacity-60"
              >
                {authBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>Sign in with Google Admin</span>
              </button>
            </div>
          ) : !isVerifiedAdmin ? (
            <div className="max-w-md mx-auto py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-950">
                  Access Denied for {user.email}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Only the verified Recruits.org.in owner account (
                  <span className="font-semibold text-slate-900">
                    {ADMIN_OWNER_EMAIL}
                  </span>
                  ) can read candidate PII records. Please sign out and switch
                  accounts.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdminSignIn}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 text-sm font-semibold transition cursor-pointer"
              >
                Switch Google Account
              </button>
            </div>
          ) : (
            <>
              {/* Verified Admin Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-xs font-medium text-slate-500">
                    Total Applications
                  </div>
                  <div className="text-2xl font-bold text-slate-950 tabular-nums mt-1">
                    {summaryCounts.total}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-xs font-medium text-slate-500">
                    New / Uncalled
                  </div>
                  <div className="text-2xl font-bold text-blue-700 tabular-nums mt-1">
                    {summaryCounts.newCount}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-xs font-medium text-slate-500">
                    ITI Cert Received
                  </div>
                  <div className="text-2xl font-bold text-indigo-700 tabular-nums mt-1">
                    {summaryCounts.certReceived}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-xs font-medium text-slate-500">
                    Shortlisted / Joined
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                    {summaryCounts.shortlisted}
                  </div>
                </div>
              </div>

              {/* Search, Status Filter, CSV Export */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, mobile, Ref ID, district, ITI trade, college…"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "all" | ApplicationStatus)
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
                  >
                    <option value="all">All Statuses ({leads.length})</option>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={filteredLeads.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold transition cursor-pointer disabled:opacity-40 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV ({filteredLeads.length})</span>
                  </button>
                </div>
              </div>

              {runtimeError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
                  {runtimeError}
                </div>
              )}

              {/* Leads List */}
              {loadingLeads ? (
                <div className="py-16 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                  <span>Loading live Firestore applications…</span>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 rounded-xl space-y-1.5">
                  <p className="text-sm font-semibold text-slate-800">
                    No applications match this filter yet
                  </p>
                  <p className="text-xs text-slate-500">
                    New student registrations from the homepage appear here
                    automatically in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => {
                    const isRevealed = Boolean(revealedAadhaarIds[lead.id]);
                    const draftNote =
                      editingNotes[lead.id] !== undefined
                        ? editingNotes[lead.id]
                        : lead.adminNotes;
                    const noteChanged = draftNote !== lead.adminNotes;
                    const whatsappFollowupUrl = `https://wa.me/91${lead.mobileNumber}?text=${encodeURIComponent(
                      `Namaste ${lead.fullName}, this is the Recruits.org.in Hiring Team regarding your Chennai 3-Year Manufacturing Diploma + Job application (${lead.applicationRef}). Please share your ITI / Marksheet copy here to confirm your joining slot.`
                    )}`;

                    return (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-950">
                                {lead.fullName}
                              </h4>
                              <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                                {lead.applicationRef}
                              </span>
                              <span className="text-xs text-slate-400">·</span>
                              <span className="text-xs text-slate-500">
                                {formatDateTime(lead.createdAt)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
                              <span className="font-semibold tabular-nums">
                                Mobile: +91 {lead.mobileNumber}
                              </span>
                              <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                                <span>
                                  Aadhaar:{" "}
                                  {isRevealed
                                    ? formatAadhaarSpaced(lead.aadhaarNumber)
                                    : lead.aadhaarMasked}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRevealedAadhaarIds((prev) => ({
                                      ...prev,
                                      [lead.id]: !prev[lead.id],
                                    }))
                                  }
                                  className="text-slate-500 hover:text-slate-900 transition cursor-pointer"
                                  title={
                                    isRevealed
                                      ? "Mask Aadhaar number"
                                      : "Reveal full Aadhaar number"
                                  }
                                >
                                  {isRevealed ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </span>
                              <span>
                                {lead.qualification}
                                {lead.itiTrade ? ` (${lead.itiTrade})` : ""}
                              </span>
                              <span>
                                {lead.district}, {lead.homeState}
                              </span>
                              {lead.collegeName && (
                                <span className="text-slate-500">
                                  College: {lead.collegeName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Contact + Status Controls */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <a
                              href={`tel:+91${lead.mobileNumber}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                            <a
                              href={whatsappFollowupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <select
                              value={lead.status}
                              disabled={savingId === lead.id}
                              onChange={(e) =>
                                handleUpdateLead(lead, {
                                  status: e.target.value as ApplicationStatus,
                                })
                              }
                              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none ${
                                STATUS_STYLES[lead.status] || STATUS_STYLES.new
                              }`}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Notes + Certificate Checkbox + Delete */}
                        <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2.5">
                          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={Boolean(lead.whatsappShared)}
                              disabled={savingId === lead.id}
                              onChange={(e) =>
                                handleUpdateLead(lead, {
                                  whatsappShared: e.target.checked,
                                })
                              }
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                            />
                            <span>ITI Cert Received on WhatsApp</span>
                          </label>

                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={500}
                              value={draftNote}
                              onChange={(e) =>
                                setEditingNotes((prev) => ({
                                  ...prev,
                                  [lead.id]: e.target.value,
                                }))
                              }
                              placeholder="Add call follow-up note (joining date, document status)…"
                              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                            />
                            {noteChanged && (
                              <button
                                type="button"
                                disabled={savingId === lead.id}
                                onClick={() =>
                                  handleUpdateLead(lead, { adminNotes: draftNote })
                                }
                                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer whitespace-nowrap"
                              >
                                Save Note
                              </button>
                            )}
                            {savedNoticeId === lead.id && !noteChanged && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                                <Check className="w-3.5 h-3.5" />
                                Saved
                              </span>
                            )}
                          </div>

                          <div className="shrink-0">
                            {confirmDeleteId === lead.id ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={savingId === lead.id}
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer"
                                >
                                  Confirm Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(lead.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
