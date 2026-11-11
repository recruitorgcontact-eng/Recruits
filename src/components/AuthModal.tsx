import React, { useState } from "react";
import {
  X,
  User,
  Building2,
  Mail,
  Lock,
  Phone,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { UserRoleMode, UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRoleMode;
  onAuthSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = "candidate",
  onAuthSuccess,
}) => {
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [role, setRole] = useState<UserRoleMode>(initialRole);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in email and password.");
      return;
    }

    if (authMode === "signup") {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (role === "recruiter" && !organizationName.trim()) {
        setErrorMsg("Please enter your company / organization name.");
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: name || (authMode === "login" ? email.split("@")[0] : "User"),
        email: email.trim(),
        role: role,
        organizationName: role === "recruiter" ? (organizationName || "Recruit Org Partner") : undefined,
        designation: role === "recruiter" ? (designation || "Hiring Manager") : undefined,
        phone: phone || "+91 9876543210",
        location: location || "India",
        createdAt: new Date().toISOString(),
        isVerifiedRecruiter: role === "recruiter",
      };

      // Save to localStorage
      localStorage.setItem("arohi_user_auth_profile", JSON.stringify(newProfile));

      setSuccessMsg(
        authMode === "signup"
          ? `🎉 Welcome aboard! Successfully signed up as ${role === "recruiter" ? "Recruiter / Employer" : "Candidate / User"}.`
          : `✅ Successfully logged in as ${newProfile.name}.`
      );

      setTimeout(() => {
        onAuthSuccess(newProfile);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Recruits.org.in Authentication
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {authMode === "signup" ? "Create Account" : "Log In to Platform"}
          </h2>
          <p className="text-xs text-slate-500">
            {role === "recruiter"
              ? "Post free live job openings & find top candidate matches"
              : "Discover jobs, get ATS score & talk with Arohi AI Coach"}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setRole("candidate")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              role === "candidate"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Candidate / User
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              role === "recruiter"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Recruiter / Employer
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={role === "recruiter" ? "e.g. Priya Sharma" : "e.g. Rahul Verma"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>
          )}

          {authMode === "signup" && role === "recruiter" && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Company / Organization Name <span className="text-emerald-600">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Consultancy Services / Tech Innovators Pvt Ltd"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Designation / Role Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Lead Talent Acquisition / HR Manager"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder={role === "recruiter" ? "hr@company.com" : "rahul@gmail.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {authMode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-xs font-extrabold text-white transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              role === "recruiter"
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-90"
            }`}
          >
            <span>
              {loading
                ? "Processing..."
                : authMode === "signup"
                ? role === "recruiter"
                  ? "Sign Up as Recruiter / Employer"
                  : "Sign Up as Candidate / User"
                : "Log In to Account"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Signup and Login */}
        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {authMode === "signup" ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Sign Up Now
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
