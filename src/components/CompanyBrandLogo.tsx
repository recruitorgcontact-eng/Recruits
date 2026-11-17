import React from "react";

export interface FeaturedBrandItem {
  id: string;
  name: string;
  shortName: string;
  sector: string;
  searchQuery: string;
  openings: string;
  tagline: string;
}

export const FEATURED_MNC_BRANDS: FeaturedBrandItem[] = [
  {
    id: "tata",
    name: "TATA / TCS",
    shortName: "TATA",
    sector: "Private",
    searchQuery: "TCS",
    openings: "1,420+ Jobs",
    tagline: "Tata Consultancy Services & Tata Group",
  },
  {
    id: "infosys",
    name: "Infosys",
    shortName: "Infosys",
    sector: "Private",
    searchQuery: "Infosys",
    openings: "980+ Jobs",
    tagline: "Navigate Your Next • Digital & AI",
  },
  {
    id: "wipro",
    name: "Wipro",
    shortName: "wipro",
    sector: "Private",
    searchQuery: "Wipro",
    openings: "740+ Jobs",
    tagline: "Ambitions Realized • Cloud & Cyber",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    shortName: "HDFC BANK",
    sector: "Banking",
    searchQuery: "HDFC",
    openings: "1,150+ Jobs",
    tagline: "India's Leading Private Sector Bank",
  },
  {
    id: "reliance",
    name: "Reliance Industries",
    shortName: "Reliance",
    sector: "Private",
    searchQuery: "Reliance",
    openings: "890+ Jobs",
    tagline: "Jio, Retail, Energy & Digital Services",
  },
  {
    id: "techmahindra",
    name: "Tech Mahindra",
    shortName: "Tech Mahindra",
    sector: "Private",
    searchQuery: "Tech Mahindra",
    openings: "620+ Jobs",
    tagline: "Scale at Speed • 5G, AI & Enterprise",
  },
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    sector: "Banking",
    searchQuery: "SBI",
    openings: "3,400+ Jobs",
    tagline: "PO, Specialist Officer & Junior Associates",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    shortName: "ICICI Bank",
    sector: "Banking",
    searchQuery: "ICICI",
    openings: "830+ Jobs",
    tagline: "Corporate Banking, FinTech & Risk",
  },
  {
    id: "lt",
    name: "Larsen & Toubro",
    shortName: "L&T",
    sector: "Private",
    searchQuery: "L&T",
    openings: "540+ Jobs",
    tagline: "L&T Construction, Mindtree & Tech Services",
  },
  {
    id: "amazon",
    name: "Amazon India",
    shortName: "amazon",
    sector: "Private",
    searchQuery: "Amazon",
    openings: "670+ Jobs",
    tagline: "AWS Cloud, SDE & Operations",
  },
  {
    id: "accenture",
    name: "Accenture",
    shortName: "Accenture",
    sector: "Private",
    searchQuery: "Accenture",
    openings: "1,280+ Jobs",
    tagline: "Strategy, Consulting, Data & AI",
  },
  {
    id: "deloitte",
    name: "Deloitte India",
    shortName: "Deloitte.",
    sector: "Private",
    searchQuery: "Deloitte",
    openings: "510+ Jobs",
    tagline: "Advisory, Risk, Cyber & Financial Analytics",
  },
  {
    id: "cognizant",
    name: "Cognizant",
    shortName: "Cognizant",
    sector: "Private",
    searchQuery: "Cognizant",
    openings: "790+ Jobs",
    tagline: "Intuition Engineered • Digital Systems",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    shortName: "Flipkart",
    sector: "Private",
    searchQuery: "Flipkart",
    openings: "410+ Jobs",
    tagline: "E-Commerce, Supply Chain & AI Labs",
  },
  {
    id: "adani",
    name: "Adani Group",
    shortName: "adani",
    sector: "Private",
    searchQuery: "Adani",
    openings: "480+ Jobs",
    tagline: "Ports, Green Energy, Infra & Logistics",
  },
  {
    id: "nalco",
    name: "NALCO & OMC",
    shortName: "NALCO",
    sector: "PSU",
    searchQuery: "NALCO",
    openings: "610+ Jobs",
    tagline: "Navratna PSU & Odisha Mining Corp",
  },
  {
    id: "hcl",
    name: "HCLTech",
    shortName: "HCLTech",
    sector: "Private",
    searchQuery: "HCL",
    openings: "690+ Jobs",
    tagline: "Supercharging Progress • Cloud & Engineering",
  },
  {
    id: "zoho",
    name: "Zoho Corp",
    shortName: "ZOHO",
    sector: "Private",
    searchQuery: "Zoho",
    openings: "350+ Jobs",
    tagline: "Enterprise SaaS & Product Engineering",
  },
];

export function resolveBrandKey(rawName: string): string {
  const s = (rawName || "").toLowerCase();
  if (s.includes("tata") || s.includes("tcs")) return "tata";
  if (s.includes("infosys")) return "infosys";
  if (s.includes("wipro")) return "wipro";
  if (s.includes("hdfc")) return "hdfc";
  if (s.includes("reliance") || s.includes("jio")) return "reliance";
  if (s.includes("tech mahindra") || s.includes("techm")) return "techmahindra";
  if (s.includes("sbi") || s.includes("state bank") || s.includes("ibps") || s.includes("rbi") || s.includes("banking")) return "sbi";
  if (s.includes("icici")) return "icici";
  if (s.includes("l&t") || s.includes("larsen") || s.includes("ltimindtree")) return "lt";
  if (s.includes("amazon") || s.includes("aws")) return "amazon";
  if (s.includes("adani")) return "adani";
  if (s.includes("accenture")) return "accenture";
  if (s.includes("deloitte")) return "deloitte";
  if (s.includes("cognizant")) return "cognizant";
  if (s.includes("flipkart")) return "flipkart";
  if (s.includes("hcl")) return "hcl";
  if (s.includes("zoho")) return "zoho";
  if (s.includes("razorpay")) return "razorpay";
  if (s.includes("nalco") || s.includes("omc") || s.includes("mining") || s.includes("steel") || s.includes("coal")) return "nalco";
  if (s.includes("railway") || s.includes("rrb") || s.includes("irctc")) return "railway";
  if (s.includes("opsc") || s.includes("ossc") || s.includes("osssc") || s.includes("odisha")) return "odishagovt";
  if (s.includes("upsc") || s.includes("ssc") || s.includes("psc") || s.includes("civil service") || s.includes("teaching") || s.includes("kvs")) return "upsc";
  if (s.includes("police") || s.includes("defence") || s.includes("drdo") || s.includes("isro") || s.includes("army")) return "defence";
  if (s.includes("arohi") || s.includes("recruits") || s.includes("quench")) return "arohi";
  return "generic";
}

interface CompanyBrandLogoProps {
  name: string;
  size?: "sm" | "md" | "lg" | "banner";
  className?: string;
}

export const CompanyBrandLogo: React.FC<CompanyBrandLogoProps> = ({
  name,
  size = "md",
  className = "",
}) => {
  const key = resolveBrandKey(name);

  // Full wordmark banner mode (used in Featured Companies grids & Placement Partner walls)
  if (size === "banner") {
    switch (key) {
      case "tata":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="TATA / TCS">
            <svg viewBox="0 0 44 36" className="w-8 h-7 shrink-0">
              <ellipse cx="22" cy="18" rx="20" ry="15" fill="none" stroke="#0066B2" strokeWidth="2.8" />
              <path d="M9 12 H35 V16 H25 V29 H19 V16 H9 Z" fill="#0066B2" />
            </svg>
            <div className="leading-none text-left">
              <span className="font-serif font-black tracking-widest text-sm text-[#0066B2] block">TATA</span>
              <span className="text-[9px] font-extrabold text-pink-600 tracking-wider block">TCS</span>
            </div>
          </div>
        );

      case "infosys":
        return (
          <div className={`flex items-center justify-center gap-1.5 ${className}`} title="Infosys">
            <svg viewBox="0 0 120 34" className="h-7 w-auto">
              <circle cx="14" cy="17" r="9" fill="#007CC3" opacity="0.15" />
              <circle cx="14" cy="17" r="5" fill="#007CC3" />
              <text x="27" y="23" fill="#007CC3" fontFamily="sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5">
                Infosys
              </text>
            </svg>
          </div>
        );

      case "wipro":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="Wipro">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0">
              <circle cx="18" cy="6" r="3" fill="#E31837" />
              <circle cx="27" cy="10" r="3" fill="#F7941D" />
              <circle cx="30" cy="19" r="3" fill="#FFF200" />
              <circle cx="25" cy="28" r="3" fill="#00A651" />
              <circle cx="15" cy="30" r="3" fill="#0072BC" />
              <circle cx="7" cy="23" r="3" fill="#662D91" />
              <circle cx="8" cy="12" r="3" fill="#EC008C" />
              <circle cx="18" cy="18" r="4.5" fill="#2E3192" />
            </svg>
            <span className="font-sans font-black text-base tracking-tight text-[#2E3192]">wipro</span>
          </div>
        );

      case "hdfc":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="HDFC Bank">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0">
              <rect x="2" y="2" width="32" height="32" rx="3" fill="#ED232A" />
              <rect x="8" y="8" width="20" height="20" fill="#FFFFFF" />
              <rect x="16" y="2" width="4" height="32" fill="#FFFFFF" />
              <rect x="2" y="16" width="32" height="4" fill="#FFFFFF" />
              <rect x="12" y="12" width="12" height="12" fill="#004C8F" />
            </svg>
            <div className="leading-none text-left">
              <span className="font-sans font-black text-xs text-[#004C8F] block tracking-tight">HDFC</span>
              <span className="font-sans font-extrabold text-[10px] text-[#ED232A] block tracking-wider">BANK</span>
            </div>
          </div>
        );

      case "reliance":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="Reliance Industries">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0">
              <circle cx="18" cy="18" r="16" fill="#D97706" opacity="0.15" />
              <path
                d="M18 4 C24 12, 29 17, 24 27 C21 31, 15 31, 12 27 C7 17, 12 12, 18 4 Z"
                fill="#DC2626"
              />
              <path
                d="M18 11 C21 16, 23 20, 20 26 C18 28, 16 26, 18 18 Z"
                fill="#FBBF24"
              />
            </svg>
            <div className="leading-none text-left">
              <span className="font-serif font-black text-sm text-[#B91C1C] block">Reliance</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-amber-700 block">Industries</span>
            </div>
          </div>
        );

      case "techmahindra":
        return (
          <div className={`flex items-center justify-center gap-1.5 ${className}`} title="Tech Mahindra">
            <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
              <path d="M4 26 L16 6 L28 26 H21 L16 16 L11 26 Z" fill="#E31837" />
            </svg>
            <div className="leading-none text-left">
              <span className="font-sans font-extrabold text-[10px] text-slate-700 block">TECH</span>
              <span className="font-sans font-black text-xs text-[#E31837] block tracking-tight">mahindra</span>
            </div>
          </div>
        );

      case "sbi":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="State Bank of India">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0">
              <circle cx="18" cy="18" r="16" fill="#00B5EF" />
              <circle cx="18" cy="14" r="5" fill="#FFFFFF" />
              <rect x="16" y="16" width="4" height="18" fill="#FFFFFF" />
            </svg>
            <div className="leading-none text-left">
              <span className="font-sans font-black text-sm text-[#1E3A8A] block">SBI</span>
              <span className="text-[8px] font-bold text-[#0088CC] uppercase block">State Bank</span>
            </div>
          </div>
        );

      case "icici":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="ICICI Bank">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0">
              <circle cx="18" cy="18" r="16" fill="#97144D" />
              <path d="M12 26 L18 8 L24 26 H19 L18 19 L15 26 Z" fill="#F37021" />
              <circle cx="18" cy="11" r="2.5" fill="#FFFFFF" />
            </svg>
            <div className="leading-none text-left">
              <span className="font-sans font-black text-xs text-[#97144D] italic block">ICICI</span>
              <span className="font-sans font-extrabold text-[10px] text-[#F37021] block">BANK</span>
            </div>
          </div>
        );

      case "lt":
        return (
          <div className={`flex items-center justify-center gap-2 ${className}`} title="Larsen & Toubro">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#0054A6" strokeWidth="3" />
              <path d="M10 11 V24 H19 M19 13 H27 M23 13 V24" stroke="#0054A6" strokeWidth="3" fill="none" />
            </svg>
            <div className="leading-none text-left">
              <span className="font-serif font-black text-sm text-[#0054A6] block">L&amp;T</span>
              <span className="text-[8px] font-bold text-slate-600 uppercase block">Group</span>
            </div>
          </div>
        );

      case "amazon":
        return (
          <div className={`flex items-center justify-center ${className}`} title="Amazon">
            <svg viewBox="0 0 110 36" className="h-7 w-auto">
              <text x="10" y="21" fill="#111827" fontFamily="sans-serif" fontWeight="900" fontSize="20">
                amazon
              </text>
              <path d="M18 26 Q50 35 84 25" fill="none" stroke="#FF9900" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M79 23 L86 25 L82 30" fill="none" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </div>
        );

      case "adani":
        return (
          <div className={`flex items-center justify-center ${className}`} title="Adani Group">
            <svg viewBox="0 0 100 34" className="h-7 w-auto">
              <defs>
                <linearGradient id="adaniGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0066B3" />
                  <stop offset="50%" stopColor="#662D91" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
              </defs>
              <text x="12" y="24" fill="url(#adaniGrad)" fontFamily="sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">
                adani
              </text>
            </svg>
          </div>
        );

      case "accenture":
        return (
          <div className={`flex items-center justify-center ${className}`} title="Accenture">
            <svg viewBox="0 0 120 36" className="h-7 w-auto">
              <path d="M58 4 L68 9 L58 14" fill="none" stroke="#A100FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="8" y="29" fill="#1E1B4B" fontFamily="sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5">
                accenture
              </text>
            </svg>
          </div>
        );

      case "deloitte":
        return (
          <div className={`flex items-center justify-center ${className}`} title="Deloitte">
            <svg viewBox="0 0 115 34" className="h-7 w-auto">
              <text x="8" y="24" fill="#0F172A" fontFamily="sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5">
                Deloitte
              </text>
              <circle cx="96" cy="21" r="4" fill="#86BC25" />
            </svg>
          </div>
        );

      case "cognizant":
        return (
          <div className={`flex items-center justify-center gap-1.5 ${className}`} title="Cognizant">
            <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
              <polygon points="4,16 16,4 22,10 10,22" fill="#0033A0" />
              <polygon points="10,22 22,10 28,16 16,28" fill="#00A3E0" />
            </svg>
            <span className="font-sans font-black text-xs text-[#0033A0] tracking-tight">Cognizant</span>
          </div>
        );

      case "flipkart":
        return (
          <div className={`flex items-center justify-center gap-1.5 ${className}`} title="Flipkart">
            <svg viewBox="0 0 34 34" className="w-7 h-7 shrink-0">
              <rect x="3" y="5" width="28" height="26" rx="6" fill="#FFE500" />
              <path d="M12 5 C12 1, 22 1, 22 5" fill="none" stroke="#2874F0" strokeWidth="2.5" />
              <text x="11" y="25" fill="#2874F0" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="20">
                f
              </text>
            </svg>
            <span className="font-sans font-black italic text-sm text-[#2874F0]">Flipkart</span>
          </div>
        );

      case "hcl":
        return (
          <div className={`flex items-center justify-center ${className}`} title="HCLTech">
            <span className="font-sans font-black italic text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#0066B3] to-[#6C2C91]">
              HCLTech
            </span>
          </div>
        );

      case "zoho":
        return (
          <div className={`flex items-center justify-center gap-0.5 ${className}`} title="Zoho Corp">
            {[
              { ch: "Z", bg: "bg-red-600" },
              { ch: "O", bg: "bg-emerald-600" },
              { ch: "H", bg: "bg-blue-600" },
              { ch: "O", bg: "bg-amber-500" },
            ].map((b, i) => (
              <span
                key={i}
                className={`w-5 h-5 ${b.bg} text-white font-black text-[10px] rounded flex items-center justify-center shadow-2xs`}
              >
                {b.ch}
              </span>
            ))}
          </div>
        );

      case "nalco":
        return (
          <div className={`flex items-center justify-center gap-1.5 ${className}`} title="NALCO / OMC">
            <svg viewBox="0 0 34 34" className="w-7 h-7 shrink-0">
              <polygon points="17,2 31,10 31,24 17,32 3,24 3,10" fill="#991B1B" stroke="#F59E0B" strokeWidth="2" />
              <text x="8" y="21" fill="#FDE68A" fontFamily="sans-serif" fontWeight="900" fontSize="11">
                PSU
              </text>
            </svg>
            <div className="leading-none text-left">
              <span className="font-sans font-black text-xs text-[#991B1B] block">NALCO</span>
              <span className="text-[8px] font-bold text-amber-700 uppercase block">&amp; OMC</span>
            </div>
          </div>
        );

      default:
        break;
    }
  }

  // Compact Square / Avatar Emblem Mode (for Job Cards, Government Cards, Carousels)
  const dimClass =
    size === "sm"
      ? "w-8 h-8 rounded-lg"
      : size === "lg"
      ? "w-14 h-14 rounded-2xl"
      : "w-10 h-10 rounded-xl";

  switch (key) {
    case "tata":
      return (
        <div
          className={`${dimClass} bg-[#0066B2] text-white flex items-center justify-center shrink-0 shadow-md border border-blue-300/40 ${className}`}
          title="TATA / TCS"
        >
          <svg viewBox="0 0 40 34" className="w-3/4 h-3/4">
            <ellipse cx="20" cy="17" rx="17" ry="13" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
            <path d="M9 12 H31 V15.5 H22.5 V26 H17.5 V15.5 H9 Z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case "infosys":
      return (
        <div
          className={`${dimClass} bg-[#007CC3] text-white flex flex-col items-center justify-center shrink-0 shadow-md border border-cyan-300/40 ${className}`}
          title="Infosys"
        >
          <span className="font-sans font-black text-[10px] tracking-tight leading-none">Infosys</span>
        </div>
      );

    case "wipro":
      return (
        <div
          className={`${dimClass} bg-white flex items-center justify-center shrink-0 shadow-md border border-indigo-200 ${className}`}
          title="Wipro"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <circle cx="18" cy="6" r="3" fill="#E31837" />
            <circle cx="27" cy="10" r="3" fill="#F7941D" />
            <circle cx="30" cy="19" r="3" fill="#F59E0B" />
            <circle cx="25" cy="28" r="3" fill="#00A651" />
            <circle cx="15" cy="30" r="3" fill="#0072BC" />
            <circle cx="7" cy="23" r="3" fill="#662D91" />
            <circle cx="8" cy="12" r="3" fill="#EC008C" />
            <circle cx="18" cy="18" r="4.5" fill="#2E3192" />
          </svg>
        </div>
      );

    case "hdfc":
      return (
        <div
          className={`${dimClass} bg-white flex items-center justify-center shrink-0 shadow-md border border-red-200 ${className}`}
          title="HDFC Bank"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <rect x="2" y="2" width="32" height="32" rx="3" fill="#ED232A" />
            <rect x="8" y="8" width="20" height="20" fill="#FFFFFF" />
            <rect x="16" y="2" width="4" height="32" fill="#FFFFFF" />
            <rect x="2" y="16" width="32" height="4" fill="#FFFFFF" />
            <rect x="12" y="12" width="12" height="12" fill="#004C8F" />
          </svg>
        </div>
      );

    case "reliance":
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-red-700 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-300/40 ${className}`}
          title="Reliance Industries"
        >
          <svg viewBox="0 0 36 36" className="w-3/4 h-3/4">
            <path
              d="M18 4 C24 12, 29 17, 24 27 C21 31, 15 31, 12 27 C7 17, 12 12, 18 4 Z"
              fill="#FDE68A"
            />
            <path d="M18 11 C21 16, 23 20, 20 26 C18 28, 16 26, 18 18 Z" fill="#DC2626" />
          </svg>
        </div>
      );

    case "techmahindra":
      return (
        <div
          className={`${dimClass} bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md border border-red-500/40 ${className}`}
          title="Tech Mahindra"
        >
          <svg viewBox="0 0 32 32" className="w-3/4 h-3/4">
            <path d="M4 26 L16 6 L28 26 H21 L16 16 L11 26 Z" fill="#E31837" />
          </svg>
        </div>
      );

    case "sbi":
      return (
        <div
          className={`${dimClass} bg-[#00B5EF] text-white flex items-center justify-center shrink-0 shadow-md border border-cyan-200/40 ${className}`}
          title="SBI / Banking"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <circle cx="18" cy="18" r="15" fill="#00B5EF" />
            <circle cx="18" cy="14" r="5" fill="#FFFFFF" />
            <rect x="16" y="16" width="4" height="17" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case "icici":
      return (
        <div
          className={`${dimClass} bg-[#97144D] text-white flex items-center justify-center shrink-0 shadow-md border border-orange-300/40 ${className}`}
          title="ICICI Bank"
        >
          <svg viewBox="0 0 36 36" className="w-3/4 h-3/4">
            <path d="M10 27 L18 7 L26 27 H20 L18 18 L14 27 Z" fill="#F37021" />
            <circle cx="18" cy="10" r="2.5" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case "lt":
      return (
        <div
          className={`${dimClass} bg-[#0054A6] text-white flex items-center justify-center shrink-0 shadow-md border border-blue-300/40 ${className}`}
          title="Larsen & Toubro"
        >
          <span className="font-serif font-black text-xs">L&amp;T</span>
        </div>
      );

    case "razorpay":
      return (
        <div
          className={`${dimClass} bg-[#072654] text-white flex items-center justify-center shrink-0 shadow-md border border-cyan-400/40 ${className}`}
          title="Razorpay"
        >
          <svg viewBox="0 0 32 32" className="w-3/4 h-3/4">
            <polygon points="10,26 18,6 25,6 17,26" fill="#3395FF" />
            <polygon points="6,26 11,14 17,14 12,26" fill="#38BDF8" />
          </svg>
        </div>
      );

    case "odishagovt":
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-amber-500 to-orange-700 text-slate-950 flex items-center justify-center shrink-0 shadow-md border border-amber-300 ${className}`}
          title="Government of Odisha (OPSC / OSSC)"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#FFFBEB" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="5" fill="#FFFBEB" />
            <path d="M18 4 V32 M4 18 H32 M8 8 L28 28 M28 8 L8 28" stroke="#FFFBEB" strokeWidth="1.8" />
          </svg>
        </div>
      );

    case "upsc":
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-indigo-900 to-slate-900 text-amber-300 flex items-center justify-center shrink-0 shadow-md border border-amber-400/60 ${className}`}
          title="Central Govt Commission (UPSC / SSC)"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <path d="M12 26 H24 L22 12 H14 Z" fill="#FBBF24" />
            <circle cx="18" cy="9" r="3.5" fill="#FDE68A" />
            <rect x="9" y="26" width="18" height="3.5" rx="1" fill="#F59E0B" />
          </svg>
        </div>
      );

    case "railway":
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-red-700 to-rose-900 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-300/50 ${className}`}
          title="Indian Railways (RRB)"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <circle cx="18" cy="18" r="13" fill="none" stroke="#FDE68A" strokeWidth="2.5" />
            <rect x="11" y="11" width="14" height="12" rx="2" fill="#FFFFFF" />
            <circle cx="14" cy="25" r="2" fill="#FBBF24" />
            <circle cx="22" cy="25" r="2" fill="#FBBF24" />
          </svg>
        </div>
      );

    case "defence":
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-emerald-800 to-slate-900 text-amber-300 flex items-center justify-center shrink-0 shadow-md border border-emerald-400/40 ${className}`}
          title="Defence / Police / DRDO / ISRO"
        >
          <svg viewBox="0 0 36 36" className="w-4/5 h-4/5">
            <path d="M18 4 L30 9 V18 C30 25 24 30 18 32 C12 30 6 25 6 18 V9 Z" fill="#10B981" fillOpacity="0.25" stroke="#FBBF24" strokeWidth="2.2" />
            <polygon points="18,10 20,16 26,16 21,20 23,26 18,22 13,26 15,20 10,16 16,16" fill="#FBBF24" />
          </svg>
        </div>
      );

    case "nalco":
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-amber-600 to-red-800 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-300/50 ${className}`}
          title="NALCO / OMC / PSU"
        >
          <span className="font-sans font-black text-[10px] tracking-wider">PSU</span>
        </div>
      );

    case "arohi":
      return (
        <div
          className={`${dimClass} bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-300/50 ${className}`}
          title="Recruits.org.in • Arohi AI"
        >
          <span className="font-sans font-black text-xs">R✦</span>
        </div>
      );

    default: {
      const initials = (name || "CO")
        .split(/[\s&()-]+/)
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div
          className={`${dimClass} bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md border border-indigo-300/40 ${className}`}
          title={name}
        >
          {initials}
        </div>
      );
    }
  }
};
