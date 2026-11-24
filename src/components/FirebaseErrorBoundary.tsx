import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface FirebaseErrorBoundaryProps {
  children: React.ReactNode;
}

interface FirebaseErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class FirebaseErrorBoundary extends React.Component<
  FirebaseErrorBoundaryProps,
  FirebaseErrorBoundaryState
> {
  declare props: Readonly<FirebaseErrorBoundaryProps>;
  declare setState: (
    state:
      | FirebaseErrorBoundaryState
      | Partial<FirebaseErrorBoundaryState>
      | ((prevState: Readonly<FirebaseErrorBoundaryState>) => FirebaseErrorBoundaryState)
  ) => void;
  state: FirebaseErrorBoundaryState = { hasError: false, errorMessage: "" };

  constructor(props: FirebaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): FirebaseErrorBoundaryState {
    let readable = error?.message || "An unexpected error occurred.";
    try {
      const parsed = JSON.parse(readable);
      if (parsed && typeof parsed.error === "string") {
        if (parsed.error.toLowerCase().includes("quota exceeded")) {
          readable =
            "Daily database quota limit reached. Quotas reset automatically tomorrow. Meanwhile, candidates can still apply directly via WhatsApp (+91 93379 52401).";
        } else if (parsed.error.toLowerCase().includes("permission")) {
          readable =
            "Database permission check rejected this request. Please verify your admin Google account or try submitting again.";
        } else {
          readable = parsed.error;
        }
      }
    } catch {
      // Keep original message if not JSON
    }
    return { hasError: true, errorMessage: readable };
  }

  componentDidCatch(error: Error) {
    console.error("FirebaseErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-6 text-slate-900 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-950">
                Application Module Interrupted
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {this.state.errorMessage}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: "" })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <a
              href="https://wa.me/919337952401?text=Hello%20Recruits.org.in%2C%20I%20want%20to%20apply%20for%20the%20Chennai%20ITI%20Manufacturing%20Hiring%20%2B%203-Year%20Diploma%20Programme."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              Apply via WhatsApp (+91 93379 52401)
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
