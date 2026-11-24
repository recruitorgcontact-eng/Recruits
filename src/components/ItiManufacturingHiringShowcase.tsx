import React, { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { ItiAdminLeadsModal } from "./ItiAdminLeadsModal";

const WHATSAPP_NUMBER_DISPLAY = "+91 93379 52401";
const WHATSAPP_NUMBER_RAW = "919337952401";

const CAREER_STEPS = [
  {
    num: "01",
    title: "Learn",
    detail: "Industry-linked 3-Year Diploma in Manufacturing Engineering",
  },
  {
    num: "02",
    title: "Earn",
    detail: "₹15,880 – ₹16,800 monthly stipend starting Month 1",
  },
  {
    num: "03",
    title: "Grow",
    detail: "Practical On-the-Job Training (OJT) in a leading plant",
  },
  {
    num: "04",
    title: "Succeed",
    detail: "Long-term engineering & production career path",
  },
];

const MONTH_ONE_BENEFITS = [
  "₹15,880 – ₹16,800 Monthly Stipend",
  "₹3,000 Joining Advance (after joining)",
  "DA — Dearness Allowance",
  "TA — Travel Allowance",
  "ESI — Medical Benefits",
  "PF — Provident Fund",
  "Insurance Coverage",
  "Canteen, Facilities & Paid Leave",
];

const ITI_TRADES = [
  "Fitter",
  "Electrician",
  "Welder",
  "Turner",
  "Machinist",
  "Motor Mechanic Vehicle (MMV)",
  "Diesel Mechanic",
  "Electronic Mechanic",
  "Wireman",
  "Tool & Die Maker",
  "Instrument Mechanic",
  "COPA",
  "Other ITI Trade",
];

const INDIAN_STATES = [
  "Odisha",
  "Tamil Nadu",
  "Bihar",
  "Jharkhand",
  "West Bengal",
  "Uttar Pradesh",
  "Andhra Pradesh",
  "Telangana",
  "Madhya Pradesh",
  "Chhattisgarh",
  "Maharashtra",
  "Karnataka",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "Assam",
  "Punjab",
  "Haryana",
  "Uttarakhand",
  "Himachal Pradesh",
  "Delhi NCR",
  "Jammu & Kashmir",
  "Goa",
  "Tripura",
  "Other State / UT",
];

type QualificationType = "ITI" | "12th Pass" | "10th Pass";

interface SubmittedApplicationSummary {
  applicationRef: string;
  fullName: string;
  mobileNumber: string;
  aadhaarMasked: string;
  qualification: QualificationType;
  itiTrade: string;
  homeState: string;
  district: string;
  collegeName: string;
}

function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function generateApplicationRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const randomVals = new Uint32Array(6);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randomVals);
    for (let i = 0; i < 6; i++) {
      code += chars[randomVals[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `REC-ITI-2026-${code}`;
}

export const ItiManufacturingHiringShowcase: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaarDisplay, setAadhaarDisplay] = useState("");
  const [qualification, setQualification] = useState<QualificationType>("ITI");
  const [itiTrade, setItiTrade] = useState("Fitter");
  const [homeState, setHomeState] = useState("");
  const [district, setDistrict] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedApplicationSummary | null>(null);

  // Admin Leads modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const buildWhatsappCertUrl = (summary?: SubmittedApplicationSummary | null) => {
    if (summary) {
      const qualLine =
        summary.qualification === "ITI" && summary.itiTrade
          ? `ITI (${summary.itiTrade})`
          : summary.qualification;
      const lines = [
        "Namaste Recruits.org.in Hiring Team,",
        "I have just applied for the 1,500+ Chennai Manufacturing Hiring + 3-Year Diploma Programme.",
        "",
        `Application ID: ${summary.applicationRef}`,
        `Name: ${summary.fullName}`,
        `Mobile: +91 ${summary.mobileNumber}`,
        `Aadhaar (Last 4): ${summary.aadhaarMasked}`,
        `Qualification: ${qualLine}`,
        `Location: ${summary.district}, ${summary.homeState}`,
        summary.collegeName ? `ITI / School: ${summary.collegeName}` : "",
        "",
        "I am attaching my ITI Certificate / Marksheet copy here for verification.",
      ].filter(Boolean);
      return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
        lines.join("\n")
      )}`;
    }

    const fallbackMsg =
      "Namaste Recruits.org.in Hiring Team, I want to share my ITI Certificate copy and apply for the Chennai Manufacturing Hiring + 3-Year Diploma Programme (₹15,880 - ₹16,800/month stipend).";
    return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(
      fallbackMsg
    )}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = fullName.trim().slice(0, 100);
    const cleanMobile = mobileNumber.replace(/\D/g, "").slice(0, 10);
    const cleanAadhaar = aadhaarDisplay.replace(/\D/g, "").slice(0, 12);
    const cleanState = homeState.trim().slice(0, 60);
    const cleanDistrict = district.trim().slice(0, 80);
    const cleanCollege = collegeName.trim().slice(0, 140);
    const cleanTrade = qualification === "ITI" ? itiTrade.trim().slice(0, 80) : "";

    // Synchronized verbatim with firebase-blueprint.json & firestore.rules
    if (cleanName.length < 2) {
      setFormError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!/^[6-9][0-9]{9}$/.test(cleanMobile)) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^[2-9][0-9]{11}$/.test(cleanAadhaar)) {
      setFormError(
        "Please enter a valid 12-digit Aadhaar number (12 digits, cannot start with 0 or 1)."
      );
      return;
    }
    if (cleanState.length < 2) {
      setFormError("Please select your home state.");
      return;
    }
    if (cleanDistrict.length < 2) {
      setFormError("Please enter your district or city.");
      return;
    }
    if (!consentAccepted) {
      setFormError("Please accept the voluntary verification consent to submit.");
      return;
    }

    const applicationRef = generateApplicationRef();
    const aadhaarMasked = `XXXX-XXXX-${cleanAadhaar.slice(8, 12)}`;
    const docPath = `itiApplications/${applicationRef}`;

    setSubmitting(true);
    try {
      await setDoc(doc(db, "itiApplications", applicationRef), {
        applicationRef,
        fullName: cleanName,
        mobileNumber: cleanMobile,
        aadhaarNumber: cleanAadhaar,
        aadhaarMasked,
        qualification,
        itiTrade: cleanTrade,
        homeState: cleanState,
        district: cleanDistrict,
        collegeName: cleanCollege,
        consentAccepted: true,
        programSlug: "iti-manufacturing-diploma-chennai",
        status: "new",
        whatsappShared: false,
        adminNotes: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitted({
        applicationRef,
        fullName: cleanName,
        mobileNumber: cleanMobile,
        aadhaarMasked,
        qualification,
        itiTrade: cleanTrade,
        homeState: cleanState,
        district: cleanDistrict,
        collegeName: cleanCollege,
      });
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("permission")) {
        try {
          handleFirestoreError(err, OperationType.CREATE, docPath);
        } catch {
          // Structured diagnostics logged; show user-friendly message
        }
        setFormError(
          "We could not verify your submission format. Please double-check your 12-digit Aadhaar and 10-digit mobile number, or apply directly via WhatsApp (+91 93379 52401)."
        );
      } else if (msg.toLowerCase().includes("quota")) {
        setFormError(
          "High application volume right now. Please tap the WhatsApp button below (+91 93379 52401) to submit immediately."
        );
      } else {
        setFormError(
          "Network issue while saving your application. Please try again or send your details on WhatsApp (+91 93379 52401)."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetFormForNextCandidate = () => {
    setSubmitted(null);
    setFullName("");
    setMobileNumber("");
    setAadhaarDisplay("");
    setQualification("ITI");
    setItiTrade("Fitter");
    setDistrict("");
    setCollegeName("");
    setFormError(null);
  };

  return (
    <section
      id="iti-manufacturing-hiring"
      aria-labelledby="iti-hiring-heading"
      className="relative z-20 rounded-[2rem] overflow-hidden border border-slate-900/15 bg-[#0B1221] shadow-[0_28px_64px_-24px_rgba(11,18,33,0.45)]"
    >
      {/* Subtle architectural luminance layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* LEFT 7 COLUMNS: EXECUTIVE PROGRAMME SHOWCASE & OFFICIAL BROCHURES */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between gap-7">
          <div className="space-y-6">
            {/* Unboxed Clean Kicker Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-300 tracking-wide">
                <span>Featured Hiring Drive</span>
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
                <span className="text-white/90">1,500+ Manufacturing Openings</span>
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
                <span className="text-sky-300">Chennai, Tamil Nadu</span>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Lock className="w-3 h-3 text-amber-300" />
                <span>Admin Leads</span>
              </button>
            </div>

            {/* Primary Headline & Stipend Offer */}
            <div className="space-y-3">
              <h2
                id="iti-hiring-heading"
                className="text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold tracking-tight leading-[1.12] text-white text-balance"
              >
                Industry Hiring + 3-Year Diploma in Manufacturing Engineering
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed max-w-2xl">
                Start earning from the <strong className="text-amber-300 font-semibold">first month itself</strong> while completing an industry-linked 3-Year Manufacturing Diploma with On-the-Job Training (OJT) at a leading manufacturing company in Chennai. Open to{" "}
                <strong className="text-white font-semibold">10th, 12th, and ITI</strong> candidates across India.
              </p>
            </div>

            {/* Quantified Offer Metrics Row (Tabular Numerals) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/10">
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-amber-300 tabular-nums tracking-tight">
                  ₹15,880–16,800
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Monthly Stipend (Month 1)
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-white tabular-nums tracking-tight">
                  1,500+
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Manufacturing Roles
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-300 tabular-nums tracking-tight">
                  ₹3,000
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Joining Advance*
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-sky-300 tabular-nums tracking-tight">
                  10th · 12th · ITI
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Eligibility Criteria
                </div>
              </div>
            </div>

            {/* 01 - 04 Career Progression */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CAREER_STEPS.map((step) => (
                <div key={step.num} className="space-y-1">
                  <div className="text-xs font-semibold text-amber-300 tabular-nums">
                    {step.num}. {step.title}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Month-1 Employee Benefits */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-200 tracking-wide">
                Job &amp; Employee Benefits Starting From Month 1
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-300">
                {MONTH_ONE_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: FAST STUDENT REGISTRATION CARD */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
          {submitted ? (
            /* POST-SUBMIT CONFIRMATION + INSTANT WHATSAPP ITI CERTIFICATE HANDOFF */
            <div className="space-y-5 my-auto py-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Application Saved to Recruits.org.in</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  Registration Confirmed
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong className="text-slate-900">{submitted.fullName}</strong>. Your application for the Chennai Manufacturing Hiring + 3-Year Diploma drive has been recorded.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Application ID</span>
                  <span className="font-mono font-bold text-slate-950 tabular-nums">
                    {submitted.applicationRef}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mobile Number</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    +91 {submitted.mobileNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Aadhaar (Masked)</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {submitted.aadhaarMasked}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Qualification</span>
                  <span className="font-semibold text-slate-900">
                    {submitted.qualification}
                    {submitted.itiTrade ? ` · ${submitted.itiTrade}` : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-900">
                    {submitted.district}, {submitted.homeState}
                  </span>
                </div>
              </div>

              {/* Mandatory Next Step: Share ITI Certificate via WhatsApp */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-950">
                    Step 2: Share Your ITI Certificate on WhatsApp
                  </h4>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Tap below to open WhatsApp with your Application ID pre-filled, then attach your ITI certificate or marksheet photo/PDF for priority shortlisting.
                  </p>
                </div>

                <a
                  href={buildWhatsappCertUrl(submitted)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-3 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Send ITI Certificate on WhatsApp ({WHATSAPP_NUMBER_DISPLAY})</span>
                </a>
              </div>

              <button
                type="button"
                onClick={resetFormForNextCandidate}
                className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 transition cursor-pointer"
              >
                Register Another Candidate
              </button>
            </div>
          ) : (
            /* FAST-TRACK APPLICATION FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500">
                  Direct Registration · Zero Application Fee
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  Apply for 1,500+ Chennai Openings
                </h3>
                <p className="text-xs text-slate-600">
                  Submit your details in 45 seconds. Share your ITI certificate on WhatsApp right after applying.
                </p>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="iti-full-name"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Full Name (as per Aadhaar) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="iti-full-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter candidate full name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />
              </div>

              {/* Mobile + Aadhaar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="iti-mobile"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-950/10 overflow-hidden">
                    <span className="pl-3 pr-2 text-xs font-bold text-slate-500 select-none">
                      +91
                    </span>
                    <input
                      id="iti-mobile"
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) =>
                        setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="10-digit number"
                      className="w-full bg-transparent pr-3 py-2.5 text-sm text-slate-950 tabular-nums placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="iti-aadhaar"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Aadhaar Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="iti-aadhaar"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={14}
                    value={aadhaarDisplay}
                    onChange={(e) => setAadhaarDisplay(formatAadhaarInput(e.target.value))}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-950 tabular-nums placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  />
                </div>
              </div>

              {/* Qualification Segmented Control */}
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-800">
                  Qualification <span className="text-rose-600">*</span>
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
                  {(["ITI", "12th Pass", "10th Pass"] as QualificationType[]).map(
                    (qual) => (
                      <button
                        key={qual}
                        type="button"
                        onClick={() => setQualification(qual)}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                          qualification === qual
                            ? "bg-slate-950 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-950"
                        }`}
                      >
                        {qual}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Dynamic ITI Trade Selector */}
              {qualification === "ITI" && (
                <div className="space-y-1">
                  <label
                    htmlFor="iti-trade"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    ITI Trade <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="iti-trade"
                    value={itiTrade}
                    onChange={(e) => setItiTrade(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 cursor-pointer"
                  >
                    {ITI_TRADES.map((trade) => (
                      <option key={trade} value={trade}>
                        {trade}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Home State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="iti-state"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Home State <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="iti-state"
                    required
                    value={homeState}
                    onChange={(e) => setHomeState(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 cursor-pointer"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="iti-district"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    District / City <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="iti-district"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Cuttack, Chennai"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                  />
                </div>
              </div>

              {/* Optional ITI College / School Name */}
              <div className="space-y-1">
                <label
                  htmlFor="iti-college"
                  className="block text-xs font-semibold text-slate-800"
                >
                  ITI College / School Name{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="iti-college"
                  type="text"
                  maxLength={140}
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Enter your ITI institute or school name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />
              </div>

              {/* Voluntary Consent */}
              <label className="flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                />
                <span>
                  I voluntarily submit my Aadhaar and mobile details to{" "}
                  <strong className="text-slate-900">Recruits.org.in</strong> for
                  Chennai Manufacturing Hiring + 3-Year Diploma verification and
                  onboarding communication.
                </span>
              </label>

              {/* Primary Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Direct WhatsApp Certificate Copy Option */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Have your ITI certificate ready?</span>
                </span>
                <a
                  href={buildWhatsappCertUrl(null)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 transition whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp ({WHATSAPP_NUMBER_DISPLAY})</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* PROTECTED ADMIN LEADS MODAL */}
      <ItiAdminLeadsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </section>
  );
};
