import { CareerMemory, JobListing, CareerScoreBreakdown, LiveIndiaJob } from "../types";

export const INITIAL_LIVE_INDIA_JOBS: LiveIndiaJob[] = [
  {
    id: "govt-live-01",
    title: "UPSC Civil Services Examination (IAS / IPS / IFS) 2026 Notification",
    organization: "Union Public Service Commission (UPSC)",
    sector: "Government",
    categoryTag: "Central Govt",
    location: "All India (Cadre Posting)",
    vacanciesOrPositions: "1,056 Open Posts",
    eligibility: "Graduate Degree in any discipline from a recognized University",
    salaryOrPayScale: "Pay Level 10 (₹56,100 - ₹1,77,500 + DA & HR)",
    lastDateToApply: "18 August 2026",
    officialNotificationUrl: "https://upsc.gov.in",
    applyUrl: "https://upsconline.nic.in",
    selectionProcessOverview: "Preliminary Examination + Main Written Examination + Personality Test / Interview",
    keySkillsOrSyllabus: ["General Studies", "CSAT", "Indian Polity & Governance", "Current Affairs", "Essay"],
    postedTime: "Live Crawled • 2026 Active Notification",
    isHotNotification: true,
  },
  {
    id: "govt-live-02",
    title: "SBI Probationary Officers (PO) Recruitment 2026",
    organization: "State Bank of India (SBI)",
    sector: "Banking",
    categoryTag: "Banking",
    location: "Pan India Branches",
    vacanciesOrPositions: "2,000 Openings",
    eligibility: "Graduation in any discipline from a recognized university",
    salaryOrPayScale: "Basic Pay ₹41,960 (Total compensation approx ₹8.2 - 12 LPA CTC)",
    lastDateToApply: "25 August 2026",
    officialNotificationUrl: "https://sbi.co.in/careers",
    applyUrl: "https://bank.sbi/web/careers",
    selectionProcessOverview: "Phase-I Preliminary Exam + Phase-II Main Exam + Phase-III Psychometric & Interview",
    keySkillsOrSyllabus: ["Reasoning & Computer Aptitude", "Data Analysis", "General / Economy / Banking Awareness", "English"],
    postedTime: "Live Crawled • Active Registration",
    isHotNotification: true,
  },
  {
    id: "govt-live-03",
    title: "SSC Combined Graduate Level (CGL) Officer Cadre 2026",
    organization: "Staff Selection Commission (SSC)",
    sector: "Government",
    categoryTag: "Central Govt",
    location: "All India Ministries & Depts",
    vacanciesOrPositions: "17,727 Posts",
    eligibility: "Bachelor's Degree from a recognized University",
    salaryOrPayScale: "Pay Level 4 to Pay Level 8 (₹25,500 - ₹1,51,100)",
    lastDateToApply: "12 September 2026",
    officialNotificationUrl: "https://ssc.gov.in",
    applyUrl: "https://ssc.gov.in",
    selectionProcessOverview: "Tier-I CBT + Tier-II CBT + Data Entry Speed Test (DEST)",
    keySkillsOrSyllabus: ["Quantitative Aptitude", "General Intelligence & Reasoning", "General Awareness", "English Comprehension"],
    postedTime: "Live Crawled • Active",
    isHotNotification: true,
  },
  {
    id: "pvt-live-04",
    title: "Senior Full Stack AI & Cloud Architect",
    organization: "TCS Innovation Labs / Tata Consultancy Services",
    sector: "Private",
    categoryTag: "Private Tech",
    location: "Bangalore / Hyderabad / Pune",
    vacanciesOrPositions: "45 Positions",
    eligibility: "B.Tech/B.E/M.Tech with 2-6 years experience in React, Node, Python & Cloud",
    salaryOrPayScale: "₹18 - 28 LPA",
    lastDateToApply: "Rolling Recruitment 2026",
    officialNotificationUrl: "https://www.tcs.com/careers",
    applyUrl: "https://ibegin.tcs.com/iBegin/",
    selectionProcessOverview: "Online Coding Assessment + Technical Interview Rounds + Managerial Evaluation",
    keySkillsOrSyllabus: ["React.js", "TypeScript", "Node.js / Express", "AWS / Azure", "Microservices Architecture"],
    postedTime: "Live Crawled • 1 Day Ago",
    isHotNotification: false,
  },
  {
    id: "govt-live-05",
    title: "RRB Assistant Loco Pilot (ALP) & Technicians 2026",
    organization: "Indian Railways Recruitment Board (RRB)",
    sector: "Government",
    categoryTag: "Central Govt",
    location: "Pan India Railway Zones",
    vacanciesOrPositions: "18,799 Positions",
    eligibility: "Matriculation / SSLC plus ITI or Diploma in Engineering",
    salaryOrPayScale: "Pay Level 2 (Initial Pay ₹19,900 + Allowances)",
    lastDateToApply: "30 August 2026",
    officialNotificationUrl: "https://indianrailways.gov.in",
    applyUrl: "https://www.rrbapply.gov.in",
    selectionProcessOverview: "1st Stage CBT + 2nd Stage CBT + Computer Based Aptitude Test (CBAT) + Document Verification",
    keySkillsOrSyllabus: ["Mathematics", "General Intelligence & Reasoning", "Basic Science & Engineering", "General Awareness"],
    postedTime: "Live Crawled • Active",
    isHotNotification: false,
  },
  {
    id: "pvt-live-06",
    title: "Lead Systems & AI Integration Specialist",
    organization: "Razorpay Software Pvt Ltd",
    sector: "Private",
    categoryTag: "Startups",
    location: "Bangalore / Remote (India)",
    vacanciesOrPositions: "12 Openings",
    eligibility: "2+ Years experience in Distributed Systems, React, Node.js & Financial APIs",
    salaryOrPayScale: "₹24 - 38 LPA + ESOPs",
    lastDateToApply: "Active Intake 2026",
    officialNotificationUrl: "https://razorpay.com/careers",
    applyUrl: "https://razorpay.com/jobs/",
    selectionProcessOverview: "Take-home Architecture Challenge + 2 Deep Tech Interviews + Culture Round",
    keySkillsOrSyllabus: ["TypeScript", "Node.js", "System Design", "Payment Gateways", "LLM Fine-tuning"],
    postedTime: "Live Crawled • Hot Job",
    isHotNotification: true,
  },
  {
    id: "govt-live-07",
    title: "ISRO Scientist / Engineer 'SC' Electronics & Computer Science",
    organization: "Indian Space Research Organisation (ISRO)",
    sector: "PSU",
    categoryTag: "PSU & Defense",
    location: "Bengaluru / Thiruvananthapuram / Sriharikota",
    vacanciesOrPositions: "320 Posts",
    eligibility: "BE/B.Tech in CS/Electronics with First Class (Min 65% aggregate)",
    salaryOrPayScale: "Pay Level 10 (Basic ₹56,100, Gross approx ₹85,000/month)",
    lastDateToApply: "10 September 2026",
    officialNotificationUrl: "https://www.isro.gov.in/Careers.html",
    applyUrl: "https://apps.isro.gov.in",
    selectionProcessOverview: "Written Test (80 Marks) + Technical Interview (100 Marks)",
    keySkillsOrSyllabus: ["Data Structures & Algorithms", "Operating Systems", "Computer Networks", "Embedded Systems"],
    postedTime: "Live Crawled • Premium PSU",
    isHotNotification: true,
  },
  {
    id: "govt-live-08",
    title: "Maharashtra MPSC Subordinate Services Combined Group B & C",
    organization: "Maharashtra Public Service Commission (MPSC)",
    sector: "Government",
    categoryTag: "State PSC",
    location: "Maharashtra State Districts",
    vacanciesOrPositions: "8,169 Openings",
    eligibility: "Degree from a recognized university, Marathi fluency",
    salaryOrPayScale: "Pay Scale S-14 (₹38,600 - ₹1,22,800)",
    lastDateToApply: "05 September 2026",
    officialNotificationUrl: "https://mpsc.gov.in",
    applyUrl: "https://mpsconline.gov.in",
    selectionProcessOverview: "Combined Preliminary Examination + Main Examination",
    keySkillsOrSyllabus: ["Maharashtra History & Geography", "Indian Polity", "General Science", "Mental Ability"],
    postedTime: "Live Crawled • State Govt",
    isHotNotification: false,
  },
];

export const DEFAULT_CAREER_MEMORY: CareerMemory = {
  permissionGranted: true,
  education: {
    degree: "B.Tech in Computer Science & Engineering",
    field: "Software Development & Data Systems",
    institution: "IIT Bombay / NIT Surathkal",
    graduationYear: "2023",
  },
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "Python",
    "SQL / PostgreSQL",
    "Tailwind CSS",
    "RESTful APIs",
    "Git & GitHub",
  ],
  certifications: [
    "AWS Certified Cloud Practitioner",
    "Google Data Analytics Certificate",
  ],
  preferredIndustries: ["Fintech", "Artificial Intelligence", "SaaS", "E-commerce"],
  preferredLocations: ["Bangalore", "Hyderabad", "Remote (India)", "Gurgaon / Noida"],
  targetRole: "Full Stack Engineer / AI Specialist",
  expectedSalaryINR: 18, // 18 LPA
  experienceYears: 2,
  careerGoals: "Transition into a Senior Full-Stack AI Engineer role at a high-growth fintech or AI startup, leads architectural modules, and achieve ₹28+ LPA in 2 years.",
  portfolioProjects: [
    {
      title: "Fintech Real-Time Analytics Dashboard",
      techStack: ["React", "TypeScript", "Node.js", "WebSockets", "Tailwind"],
      description: "Built high-frequency transaction monitor processing 5,000+ events/sec with sub-50ms latency.",
    },
    {
      title: "AI Resume Parser & Skill Extractor",
      techStack: ["Python", "Gemini API", "FastAPI", "React"],
      description: "Automated extraction of technical skills and education details from PDF resumes with 96% precision.",
    },
  ],
  interviewHistory: [
    {
      id: "int-1",
      role: "Full Stack Developer",
      date: "2026-06-15",
      score: 82,
      feedback: "Strong technical depth on Async Node.js. Improve structured STAR storytelling for behavioral questions.",
    },
  ],
  learningProgress: [
    {
      courseTitle: "System Design for High Scalability",
      provider: "Arohi Career Academy",
      progressPercent: 65,
    },
  ],
};

export const INITIAL_JOB_LISTINGS: JobListing[] = [
  {
    id: "job-101",
    title: "Senior Full Stack AI Engineer",
    company: "FintechPulse India",
    location: "Bangalore (Hybrid)",
    type: "Full-time",
    experienceRequired: "2 - 4 Years",
    salaryRangeINR: "₹20 - 32 LPA",
    postedDate: "2 days ago",
    requiredSkills: ["React", "TypeScript", "Node.js", "Python", "Gemini API", "System Design"],
    description: "Build next-generation algorithmic payment routing and AI assistant experiences for 10M+ Indian merchants.",
    aiMatchScore: 92,
    aiMatchReasoning: "Strong overlap in React, TypeScript, and Python. Your Fintech analytics project closely matches their core platform stack.",
    missingSkills: ["Kubernetes", "System Design"],
  },
  {
    id: "job-102",
    title: "Backend Specialist - Distributed Systems",
    company: "CloudScale India",
    location: "Hyderabad / Remote",
    type: "Remote",
    experienceRequired: "1 - 3 Years",
    salaryRangeINR: "₹18 - 26 LPA",
    postedDate: "Just now",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
    description: "Scale high-throughput API gateways and microservices for enterprise cloud infrastructure across South Asia.",
    aiMatchScore: 88,
    aiMatchReasoning: "Excellent fit for your backend Node.js and SQL skills. High salary upside with remote flexibility.",
    missingSkills: ["Redis", "Docker"],
  },
  {
    id: "job-103",
    title: "Frontend Lead - Next.js & UI Engineering",
    company: "Zeno SaaS Platform",
    location: "Gurgaon, NCR",
    type: "Full-time",
    experienceRequired: "2 - 5 Years",
    salaryRangeINR: "₹22 - 35 LPA",
    postedDate: "3 days ago",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Web Performance", "State Management"],
    description: "Lead UI engineering for high-converting customer workspace tools built for global enterprise clients.",
    aiMatchScore: 85,
    aiMatchReasoning: "Your Tailwind CSS and React component proficiency matches 90% of their UI mandates.",
    missingSkills: ["Next.js SSR", "Web Vitals"],
  },
];

export const INITIAL_CAREER_SCORE: CareerScoreBreakdown = {
  totalScore: 78,
  categories: [
    { name: "Resume Quality", score: 80, weight: 20, impact: "Good structure; add 3 quantifiable metric bullets to boost ATS rank." },
    { name: "Technical Skills", score: 86, weight: 15, impact: "Solid core React/Node proficiency." },
    { name: "Soft Skills", score: 72, weight: 10, impact: "Practice STAR technique during mock interviews." },
    { name: "Certifications", score: 65, weight: 10, impact: "Cloud certification will unlock +8 points." },
    { name: "Project Portfolio", score: 84, weight: 15, impact: "2 active projects; adding a live deployed link boosts score." },
    { name: "Interview Readiness", score: 75, weight: 10, impact: "1 mock interview logged; practice voice mock interview." },
    { name: "Market Demand", score: 90, weight: 10, impact: "Full Stack & AI skills are in peak market demand." },
    { name: "Profile Completeness", score: 95, weight: 5, impact: "Profile information is 95% filled." },
    { name: "Learning Consistency", score: 70, weight: 5, impact: "Currently enrolled in 1 active learning path." },
  ],
  improvementActions: [
    {
      id: "act-1",
      title: "Practice Voice Mock Interview with Arohi Coach",
      potentialScoreIncrease: 6,
      category: "Interview Readiness",
      actionType: "interview",
    },
    {
      id: "act-2",
      title: "Optimize Resume with Metric-Driven AI Bullet Points",
      potentialScoreIncrease: 8,
      category: "Resume Quality",
      actionType: "resume",
    },
    {
      id: "act-3",
      title: "Acquire Cloud System Architecture Certification",
      potentialScoreIncrease: 7,
      category: "Certifications",
      actionType: "certification",
    },
  ],
};

export const SAMPLE_RESUME_TEXT = `NAME: Rahul Sharma
EMAIL: rahul.sharma@example.com | PHONE: +91 98765 43210 | LOCATION: Bangalore, India
LINKEDIN: linkedin.com/in/rahulsharma-tech | GITHUB: github.com/rahulsharma-dev

SUMMARY:
Software Engineer with 2 years of experience building web applications using React, TypeScript, Node.js, and SQL. Interested in full-stack development, AI applications, and cloud systems.

WORK EXPERIENCE:
Software Engineer | TechVerse Solutions (July 2023 - Present)
- Developed user interface components using React and Tailwind CSS for client dashboard.
- Worked on Node.js backend services and integrated REST APIs.
- Fixed database performance issues and wrote SQL queries.
- Participated in daily agile standups and code reviews.

Junior Developer Intern | CodeLabs India (Jan 2023 - June 2023)
- Assisted in building front-end screens and handling bug fixes.
- Created documentation for API endpoints.

EDUCATION:
B.Tech in Computer Science and Engineering | Grade: 8.4/10 | Graduated 2023

SKILLS:
Languages & Frameworks: JavaScript, TypeScript, React, Node.js, Python, Express.js, SQL, HTML/CSS.
Tools & Platforms: Git, Postman, AWS Basics, VS Code.`;
