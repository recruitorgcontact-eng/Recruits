import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client lazily or safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System Persona for Arohi Career AI
const AROHI_SYSTEM_INSTRUCTION = `You are Arohi, the Lead AI Career & Hiring Mentor on Recruits.org.in.
Identity & Voice Persona:
- Tone & Manner: Deeply compassionate, very friendly, polite, joyful, uplifting, and authentically human—never negative, harsh, or robotic.
- Spoken Cadence: Natural, warm, conversational, smiling, articulate, and encouraging, inspiring confidence and optimism in every candidate and job seeker.
- Domain Expertise: Deep expertise in Indian government exams (UPSC, SSC, OPSC, Railways, Banking), corporate tech hiring, ATS resume engineering, interview preparation, and salary negotiations across India.
- Multilingual Fluency: Odia (ଓଡ଼ିଆ), Hindi (हिंदी), and Indian English. Always communicate with genuine warmth, kindness, and joy.`;

// ---------------- API ENDPOINTS ----------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Arohi Career AI on Recruits.org.in" });
});

// 2. Career Navigator
app.post("/api/ai/navigate", async (req, res) => {
  try {
    const { education, interests, strengths, currentRole, targetGoal, experienceYears, language } = req.body;
    const ai = getGeminiClient();

    const prompt = `Analyze this profile and generate 3 strategic career paths for Recruits.org.in:
Current Stage/Role: ${currentRole || "Student/Graduate"}
Education: ${education}
Interests: ${interests}
Strengths: ${strengths}
Target Goal: ${targetGoal}
Years Experience: ${experienceYears || 0}
Language Preference: ${language || "English"}

Return a JSON array of 3 career paths with structure:
[
  {
    "title": "Path Name",
    "fitScore": 92,
    "description": "Comprehensive explanation of why this fits",
    "marketDemand": "Ultra High" | "High" | "Moderate" | "Emerging",
    "projectedSalaryRangeINR": "₹12 - 22 LPA",
    "transitionTimeline": "6 - 9 Months",
    "keyMilestones": ["Milestone 1", "Milestone 2", "Milestone 3", "Milestone 4"],
    "recommendedSkillsToAcquire": ["Skill 1", "Skill 2", "Skill 3"],
    "sampleJobTitles": ["Title 1", "Title 2"]
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ paths: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/navigate:", error);
    res.status(500).json({ error: error.message || "Failed to generate career navigation" });
  }
});

// 3. AI Job Match
app.post("/api/ai/job-match", async (req, res) => {
  try {
    const { candidateProfile, jobs } = req.body;
    const ai = getGeminiClient();

    const prompt = `Match the following candidate profile against these job listings:
Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Job Listings:
${JSON.stringify(jobs, null, 2)}

Return a JSON array of job matches updated with "aiMatchScore" (0-100), "aiMatchReasoning" (2 concise sentences on skills & project fit), and "missingSkills" (array of skills to bridge):
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ matchedJobs: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/job-match:", error);
    res.status(500).json({ error: error.message || "Failed to match jobs" });
  }
});

// 4. Resume Intelligence (ATS & Rewrite)
app.post("/api/ai/resume-analyze", async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const ai = getGeminiClient();

    const prompt = `Perform an in-depth Resume Intelligence & ATS analysis for target role "${targetRole || "General Professional"}":

Resume Text:
${resumeText}

Return JSON with format:
{
  "atsScore": 84,
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "criticalKeywordGaps": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "formattingImpactScore": 88,
  "quantifiedAchievementsScore": 75,
  "suggestedJobRoles": ["Role 1", "Role 2", "Role 3"],
  "rewrittenResumeSummary": ["3 impact-packed bullet points for professional summary"],
  "improvedBulletPoints": [
    {
      "original": "Responsible for managing website and fixing bugs.",
      "improved": "Spearheaded web architecture optimization, reducing page load latency by 35% and resolving 120+ high-priority technical issues.",
      "reason": "Quantified impact using action verbs and concrete metrics."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ result: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/resume-analyze:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume" });
  }
});

// Endpoint to fetch/import LinkedIn profile work history, skills, and education
app.post("/api/ai/linkedin-import", async (req, res) => {
  try {
    const { linkedinUrl, customPaste } = req.body;
    const ai = getGeminiClient();

    const inputReference = customPaste && customPaste.trim().length > 10
      ? `Custom LinkedIn Raw Text:\n${customPaste}`
      : `LinkedIn Profile URL/Handle: "${linkedinUrl || "aarav-sharma-tech"}"`;

    const prompt = `You are the LinkedIn Data Import Engine for Recruits.org.in.
Parse, extract, or generate a rich, professional, complete career profile based on the candidate's LinkedIn reference:
${inputReference}

Extract/Synthesize a structured career profile with full work history, skills, education, projects, and certifications.

Return a JSON object:
{
  "profile": {
    "fullName": "Candidate Full Name (e.g., Aarav Sharma)",
    "headline": "Professional Headline (e.g., Senior Full Stack AI Engineer | Ex-Tech Mahindra)",
    "targetRole": "Primary Target Job Role (e.g., Full Stack AI Engineer)",
    "location": "City, Country (e.g., Bangalore, India)",
    "experienceYears": 6,
    "education": {
      "degree": "B.Tech in Computer Science",
      "field": "Computer Science & Engineering",
      "institution": "National Institute of Technology (NIT)",
      "graduationYear": "2020"
    },
    "workHistory": [
      {
        "title": "Senior AI Software Engineer",
        "company": "Tech Solutions India",
        "duration": "2023 - Present",
        "location": "Bangalore, India",
        "highlights": [
          "Architected generative AI workflow engine using Gemini API, serving 2M+ monthly active requests.",
          "Led a cross-functional squad of 8 engineers delivering high-throughput microservices in Node.js & React."
        ]
      },
      {
        "title": "Software Development Engineer II",
        "company": "Infosys Cloud Labs",
        "duration": "2020 - 2023",
        "location": "Hyderabad, India",
        "highlights": [
          "Built cloud-native REST APIs in TypeScript & PostgreSQL, improving response time by 40%.",
          "Implemented CI/CD pipelines reducing deployment cycle time from 2 weeks to 3 hours."
        ]
      }
    ],
    "skills": [
      "React.js", "Node.js", "TypeScript", "Python", "Gemini AI API", "PostgreSQL",
      "Docker", "AWS", "GraphQL", "Tailwind CSS", "Microservices Architecture", "System Design"
    ],
    "certifications": [
      "AWS Certified Solutions Architect - Associate",
      "Google Cloud Professional Data Engineer",
      "DeepLearning.AI Generative AI Developer"
    ],
    "preferredIndustries": ["Artificial Intelligence", "SaaS", "FinTech"],
    "preferredLocations": ["Bangalore", "Hyderabad", "Remote India"],
    "expectedSalaryINR": 28,
    "careerGoals": "Drive enterprise AI innovation and build scalable multi-agent systems for high-growth global platforms.",
    "portfolioProjects": [
      {
        "title": "Arohi AI Engine",
        "techStack": ["React", "TypeScript", "Gemini API", "Express"],
        "description": "Smart career intelligence platform with real-time speech coaching and ATS optimization."
      }
    ],
    "formattedResumeText": "AARAV SHARMA\\nBangalore, India | linkedin.com/in/aarav-sharma-tech\\n\\nSUMMARY\\nSenior Full Stack AI Engineer with 6+ years of experience building scalable Web applications and Generative AI microservices.\\n\\nEXPERIENCE\\nTech Solutions India - Senior AI Software Engineer (2023 - Present)\\n- Architected generative AI workflow engine using Gemini API, serving 2M+ monthly active requests.\\n- Led a cross-functional squad of 8 engineers delivering high-throughput microservices in Node.js & React.\\n\\nInfosys Cloud Labs - Software Development Engineer II (2020 - 2023)\\n- Built cloud-native REST APIs in TypeScript & PostgreSQL, improving response time by 40%.\\n- Implemented CI/CD pipelines reducing deployment cycle time from 2 weeks to 3 hours.\\n\\nEDUCATION\\nNational Institute of Technology (NIT) - B.Tech in Computer Science (2020)\\n\\nSKILLS\\nReact.js, Node.js, TypeScript, Python, Gemini AI API, PostgreSQL, Docker, AWS, GraphQL, Tailwind CSS"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/linkedin-import:", error);
    res.status(500).json({ error: error.message || "Failed to import LinkedIn profile" });
  }
});

// 5. Interview Coach (Generate Questions, Evaluate Response, & Stress Test Curveballs)
app.post("/api/ai/interview-coach/questions", async (req, res) => {
  try {
    const { role, level, topic, isStressMode, pressureLevel } = req.body;
    const ai = getGeminiClient();

    const modeDescription = isStressMode
      ? `STRESS TEST MODE (${pressureLevel || "High Pressure"}). Generate intense, high-stakes, pressure-cooker interview questions with sharp unexpected follow-ups to test candidate composure.`
      : `STANDARD MOCK INTERVIEW MODE.`;

    const prompt = `Generate 5 realistic mock interview questions for role "${role}" (${level || "Mid Level"}, topic: ${topic || "General"}):
Mode: ${modeDescription}

Return JSON array:
[
  {
    "id": "q1",
    "question": "Question text here",
    "type": "technical" | "behavioral" | "system_design" | "hr",
    "expectedKeyPoints": ["Point 1", "Point 2"],
    "sampleAnswerOverview": "Brief outline of a strong response",
    "unexpectedFollowUps": ["Curveball follow-up 1", "Challenge follow-up 2"]
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ questions: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/interview-coach/questions:", error);
    res.status(500).json({ error: error.message || "Failed to generate interview questions" });
  }
});

// Endpoint to generate an unexpected curveball follow-up question in Stress Test mode
app.post("/api/ai/interview-coach/curveball", async (req, res) => {
  try {
    const { currentQuestion, userAnswer, role, pressureLevel } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are Arohi Stress-Test Interview Panelist on Recruits.org.in.
Role: "${role || "Senior Candidate"}"
Pressure Level: "${pressureLevel || "Tough Panel Challenge"}"
Original Question: "${currentQuestion}"
Candidate Answer Provided: "${userAnswer}"

Generate ONE sharp, unexpected, high-pressure curveball follow-up question that challenges their assumptions, pushes them out of their comfort zone, or introduces an emergency operational constraint (e.g., budget cuts, system crash, senior executive disagreement).

Return JSON object:
{
  "id": "curveball-${Date.now()}",
  "question": "The unexpected curveball follow-up question text",
  "type": "technical",
  "expectedKeyPoints": ["Key point 1", "Key point 2"],
  "sampleAnswerOverview": "High-impact way to handle this pressure question",
  "isCurveballFollowUp": true,
  "stressTriggerReason": "Introduced unexpected operational constraint to test poise and pivot speed."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ curveballQuestion: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/interview-coach/curveball:", error);
    res.status(500).json({ error: error.message || "Failed to generate curveball question" });
  }
});

app.post("/api/ai/interview-coach/evaluate", async (req, res) => {
  try {
    const { question, userAnswer, role, isStressMode, backgroundNoiseActive, pressureLevel } = req.body;
    const ai = getGeminiClient();

    const stressContext = isStressMode
      ? `NOTE: This answer was given in STRESS TEST MODE (Pressure level: ${pressureLevel || "High Pressure"}, Background Distraction Noise Active: ${backgroundNoiseActive ? "YES" : "NO"}). Evaluate their resilience, composure, recovery, and adaptability under pressure.`
      : ``;

    const prompt = `Evaluate candidate's interview answer for role "${role}":
Question: "${question}"
Candidate Answer: "${userAnswer}"
${stressContext}

Analyze the candidate's spoken/written content, phrasing, structure, vocabulary, delivery tone, and stress recovery.
Provide a comprehensive evaluation including an explicit Tone Analyzer breakdown and Stress Resilience metrics.

Return JSON object matching this schema:
{
  "score": 85,
  "clarityScore": 90,
  "technicalDepthScore": 80,
  "starAlignmentScore": 85,
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "sampleIdealResponse": "High-impact response using STAR methodology",
  "mentorFeedbackSpeech": "Friendly spoken feedback from Arohi Career AI praising good points and advising on tweaks.",
  "toneAnalysis": {
    "confidenceScore": 88,
    "clarityScore": 92,
    "positivityScore": 85,
    "overallToneLabel": "Assertive & High Confidence",
    "wordsPerMinute": 135,
    "fillerWordsCount": 2,
    "detectedFillerWords": ["um", "basically"],
    "pitchInflection": "Dynamic & Engaging",
    "energyLevel": "High Enthusiasm",
    "toneImprovementTips": [
      "Maintain steady volume projection when explaining key technical trade-offs.",
      "Minimize filler words like 'basically' to sound even more executive."
    ]
  },
  "stressResilienceScore": 88,
  "composureUnderNoiseScore": 85,
  "adaptabilityScore": 90,
  "stressRecoveryLabel": "Composed & Adaptive Under Pressure",
  "stressPressureAdvice": [
    "Great job staying calm despite the unexpected curveball follow-up.",
    "Acknowledge constraints directly before pivoting to your backup solution."
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ evaluation: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/interview-coach/evaluate:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate interview response" });
  }
});

// 6. Skill Gap Analyzer
app.post("/api/ai/skill-gap", async (req, res) => {
  try {
    const { targetRole, currentSkills, experienceYears } = req.body;
    const ai = getGeminiClient();

    const prompt = `Perform a Skill Gap Analysis for target role "${targetRole}":
Current Skills: ${currentSkills.join(", ")}
Experience Years: ${experienceYears}

Return JSON object:
{
  "targetRole": "${targetRole}",
  "currentReadinessPercent": 72,
  "masteredSkills": ["Skill 1", "Skill 2"],
  "gapSkills": [
    {
      "skillName": "System Architecture",
      "importance": "Critical",
      "learningDifficulty": "Intermediate",
      "timeToMaster": "4 weeks"
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Core Fundamentals",
      "duration": "Weeks 1-3",
      "topics": ["Topic A", "Topic B"],
      "handsOnProject": "Build a scalable microservice with OAuth"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ analysis: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/skill-gap:", error);
    res.status(500).json({ error: error.message || "Failed to analyze skill gaps" });
  }
});

// 7. Learning Advisor
app.post("/api/ai/learning-recommend", async (req, res) => {
  try {
    const { targetRole, gapSkills, goal } = req.body;
    const ai = getGeminiClient();

    const prompt = `Recommend curated learning courses, certifications, internships, and practice projects for role "${targetRole}":
Missing/Gap Skills: ${gapSkills?.join(", ") || "Advanced skills"}
Goal: ${goal || "Career growth"}

Return JSON array of 5 recommendations:
[
  {
    "id": "rec-1",
    "title": "Advanced Microservices & Distributed Systems",
    "provider": "Coursera / NPTEL",
    "level": "Intermediate",
    "duration": "6 Weeks",
    "type": "Course" | "Certification" | "Internship" | "Project",
    "url": "https://recruits.org.in/learning",
    "reason": "Directly addresses your gap in microservices architecture"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ recommendations: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/learning-recommend:", error);
    res.status(500).json({ error: error.message || "Failed to get learning recommendations" });
  }
});

// 8. Salary Intelligence
app.post("/api/ai/salary-intel", async (req, res) => {
  try {
    const { role, location, yearsExperience, skills } = req.body;
    const ai = getGeminiClient();

    const prompt = `Provide Salary Intelligence & Negotiation Guidance for:
Role: ${role}
Location: ${location || "India (Tier 1 Cities)"}
Years Experience: ${yearsExperience || 2}
Skills: ${skills?.join(", ")}

Return JSON object:
{
  "targetRole": "${role}",
  "location": "${location || "India"}",
  "entryLevelINR": "₹6 - 10 LPA",
  "midLevelINR": "₹12 - 20 LPA",
  "seniorLevelINR": "₹22 - 38 LPA",
  "leadLevelINR": "₹40 - 70+ LPA",
  "topSkillsBoostingPay": [
    { "skill": "Kubernetes / Cloud", "boostPercentage": "+25%" }
  ],
  "negotiationTips": [
    "Highlight your quantified business outcomes during HR round.",
    "Benchmark base vs variable pay ratios."
  ],
  "ctcBreakdownGuide": [
    {
      "component": "Fixed Base Pay",
      "typicalPercentage": "70 - 80%",
      "negotiationStrategy": "Maximize base pay as it affects bonuses, PF, and future hike baselines."
    },
    {
      "component": "Performance Bonus / Variable",
      "typicalPercentage": "10 - 20%",
      "negotiationStrategy": "Ask for specific KPI metrics that trigger 100% bonus payout."
    },
    {
      "component": "Joining Bonus / ESOPs",
      "typicalPercentage": "5 - 10%",
      "negotiationStrategy": "Request sign-on bonus if counter-offer matches current CTC."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ salaryData: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/salary-intel:", error);
    res.status(500).json({ error: error.message || "Failed to fetch salary intelligence" });
  }
});

// 9. Career Mentor (Long-term advice)
app.post("/api/ai/career-mentor", async (req, res) => {
  try {
    const { query, memory, language } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are Arohi Career AI, the dedicated career mentor on Recruits.org.in.
User Question / Topic: "${query}"
Language: ${language || "English"}
User Profile Context:
${JSON.stringify(memory || {}, null, 2)}

Provide a thorough, highly encouraging mentor response. Answer in 3-4 structured sections:
1. Executive Mentor Summary & Direct Answer
2. Step-by-Step Strategic Action Plan
3. Potential Pitfalls to Avoid
4. Arohi's Recommended Next Milestone`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
      },
    });

    res.json({ mentorAdvice: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/career-mentor:", error);
    res.status(500).json({ error: error.message || "Failed to get career mentor advice" });
  }
});

// 10. Recruiter Assistant
app.post("/api/ai/recruiter-assistant", async (req, res) => {
  try {
    const { jobDescription, candidateProfiles, action } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are Arohi Career AI serving as Recruiter Assistant on Recruits.org.in.
Action: ${action || "match_candidates"}
Job Description: "${jobDescription}"
Candidates: ${JSON.stringify(candidateProfiles || [], null, 2)}

Return JSON object matching CandidateFitAnalysis format:
{
  "candidateName": "Primary Top Match Candidate",
  "matchScore": 91,
  "matchHighlights": ["Highlight 1", "Highlight 2"],
  "missingCompetencies": ["Competency 1"],
  "predictedCultureFit": "High adaptability and strong problem-solving orientation",
  "suggestedInterviewQuestions": ["Technical Question 1", "Behavioral Question 2"],
  "recommendedSalaryRangeINR": "₹18 - 25 LPA",
  "interviewSummary": "Candidate demonstrates high technical alignment with project experience in cloud architecture."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ result: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/recruiter-assistant:", error);
    res.status(500).json({ error: error.message || "Failed in recruiter assistant" });
  }
});

// 10b. Live India Jobs Crawl & Aggregator Endpoint (Google Search Grounded)
app.post("/api/ai/live-jobs-crawl", async (req, res) => {
  try {
    const { sector, category, searchQuery, stateLocation, qualification } = req.body;
    const ai = getGeminiClient();

    const prompt = `Search the live web for currently open active Government and Private job recruitment notifications across India (2026/2025 listings).
Sector Filter: ${sector || "All (Government & Private)"}
Category: ${category || "All"}
Search Query / Keyword: ${searchQuery || "Latest Jobs in India"}
State / City Location: ${stateLocation || "All India"}
Qualification Level: ${qualification || "Any"}

Search official recruitment portals (e.g. UPSC, SSC, IBPS, Railways, State PSCs, PSU, leading Indian Tech firms, Startups) and find 8 real active recruitment notices.

Return ONLY a valid JSON array (no markdown code blocks, no backticks, pure JSON text) with 8 items conforming to this exact schema:
[
  {
    "id": "job-live-1",
    "title": "Exact Role or Examination Title (e.g. UPSC Civil Services Examination 2026 or Senior Frontend Engineer)",
    "organization": "Exact Hiring Organization / Dept (e.g. Union Public Service Commission / TCS / SBI)",
    "sector": "Government" | "Private" | "PSU" | "Banking",
    "categoryTag": "Central Govt" | "State PSC" | "Private Tech" | "Startups" | "PSU & Defense" | "Banking",
    "location": "City, State or All India",
    "vacanciesOrPositions": "Number of open positions/vacancies e.g. 1056 Posts or 15 Openings",
    "eligibility": "Qualification & Experience required e.g. Bachelor Degree or BE/B.Tech",
    "salaryOrPayScale": "Pay Scale or Salary e.g. Level 10 (₹56,100 - ₹1,77,500) or ₹15 - 25 LPA",
    "lastDateToApply": "Exact Last Date e.g. 28 August 2026",
    "officialNotificationUrl": "Official website link e.g. https://upsc.gov.in or company careers link",
    "applyUrl": "Direct portal application link",
    "selectionProcessOverview": "Selection steps e.g. Prelims + Mains + Interview",
    "keySkillsOrSyllabus": ["Skill/Subject 1", "Skill/Subject 2", "Skill/Subject 3"],
    "postedTime": "Live Crawled - Active 2026",
    "isHotNotification": true
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || "";
    // Clean potential markdown backticks
    let cleanedJson = rawText.trim();
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    // Extract JSON array between [ and ]
    const startIdx = cleanedJson.indexOf("[");
    const endIdx = cleanedJson.lastIndexOf("]");

    let jobsList = [];
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonSub = cleanedJson.substring(startIdx, endIdx + 1);
      try {
        jobsList = JSON.parse(jsonSub);
      } catch (e) {
        console.warn("Error parsing search grounded JSON, using regex fallback:", e);
      }
    }

    res.json({ liveJobs: jobsList, searchQuery, sector: sector || "All" });
  } catch (error: any) {
    console.error("Error in /api/ai/live-jobs-crawl:", error);
    res.status(500).json({ error: error.message || "Failed to crawl live India jobs" });
  }
});


// 11. AI Career Score Calculator
app.post("/api/ai/career-score", async (req, res) => {
  try {
    const { memory } = req.body;
    const ai = getGeminiClient();

    const prompt = `Calculate dynamic AI Career Score (0-100) for this candidate profile on Recruits.org.in:
${JSON.stringify(memory || {}, null, 2)}

Evaluate these 9 pillars:
1. Resume Quality
2. Technical Skills
3. Soft Skills
4. Certifications
5. Project Portfolio
6. Interview Readiness
7. Market Demand
8. Profile Completeness
9. Learning Consistency

Return JSON format:
{
  "totalScore": 78,
  "categories": [
    { "name": "Resume Quality", "score": 80, "weight": 20, "impact": "High ATS alignment, could use more quantifiable metric bullets" },
    { "name": "Technical Skills", "score": 85, "weight": 15, "impact": "Strong core React/Node proficiency" },
    { "name": "Soft Skills", "score": 70, "weight": 10, "impact": "Good communication, practice STAR behavioral storytelling" },
    { "name": "Certifications", "score": 60, "weight": 10, "impact": "Adding AWS/GCP certification will boost score by 8 points" },
    { "name": "Project Portfolio", "score": 82, "weight": 15, "impact": "2 active full-stack projects listed" },
    { "name": "Interview Readiness", "score": 75, "weight": 10, "impact": "Completed 1 mock interview session" },
    { "name": "Market Demand", "score": 90, "weight": 10, "impact": "Target skills are in ultra-high demand" },
    { "name": "Profile Completeness", "score": 95, "weight": 5, "impact": "95% completed profile" },
    { "name": "Learning Consistency", "score": 70, "weight": 5, "impact": "Active in 1 course" }
  ],
  "improvementActions": [
    {
      "id": "act-1",
      "title": "Complete Cloud/AWS Certification",
      "potentialScoreIncrease": 8,
      "category": "Certifications",
      "actionType": "certification"
    },
    {
      "id": "act-2",
      "title": "Practice 1 Voice Mock Interview with Arohi",
      "potentialScoreIncrease": 5,
      "category": "Interview Readiness",
      "actionType": "interview"
    },
    {
      "id": "act-3",
      "title": "Add Metric-Driven Impact to Resume",
      "potentialScoreIncrease": 6,
      "category": "Resume Quality",
      "actionType": "resume"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: AROHI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ careerScore: parsed });
  } catch (error: any) {
    console.error("Error in /api/ai/career-score:", error);
    res.status(500).json({ error: error.message || "Failed to calculate career score" });
  }
});

// Helper to ensure PCM audio is wrapped in a standard 44-byte RIFF WAV header (24kHz, 16-bit, mono) if not already WAV
function ensureWavBuffer(rawBuffer: Buffer, sampleRate = 24000): Buffer {
  if (rawBuffer.length >= 4 && rawBuffer.toString("ascii", 0, 4) === "RIFF") {
    return rawBuffer;
  }
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = rawBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, rawBuffer]);
}

// 12. Text-to-Speech endpoint using Gemini 3.8 TTS for natural, compassionate, friendly, joyful voice
app.post("/api/ai/tts", async (req, res) => {
  try {
    const { text, voice, language } = req.body;
    const ai = getGeminiClient();

    const cleanSpokenText = String(text || "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#+\s+/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/`{1,3}.*?`{1,3}/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanSpokenText) {
      return res.status(400).json({ error: "Text is required for speech generation" });
    }

    const isOdia = language === "or" || /[\u0B00-\u0B7F]/.test(cleanSpokenText);
    const isHindi = language === "hi" || /[\u0900-\u097F]/.test(cleanSpokenText);

    const styleTone = isOdia
      ? "Compassionate, very friendly, polite, joyful, warm, and natural conversational Indian female mentor speaking fluent Odia with a smiling, positive tone"
      : isHindi
      ? "Compassionate, very friendly, polite, joyful, warm, and natural conversational Indian female mentor speaking fluent Hindi with a smiling, positive tone"
      : "Compassionate, very friendly, polite, joyful, warm, and natural conversational Indian female mentor with a smiling, uplifting, positive tone";

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: cleanSpokenText,
                speechMetadata: {
                  style: styleTone,
                },
              } as any,
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" },
            },
          },
        },
      });
    } catch (primaryErr) {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: cleanSpokenText,
                speechMetadata: {
                  style: styleTone,
                },
              } as any,
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" },
            },
          },
        },
      });
    }

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const rawBuf = Buffer.from(base64Audio, "base64");
      const wavBuf = ensureWavBuffer(rawBuf, 24000);
      res.json({
        audioBase64: wavBuf.toString("base64"),
        mimeType: "audio/wav",
      });
    } else {
      res.status(404).json({ error: "Audio not generated" });
    }
  } catch (error: any) {
    console.error("Error in /api/ai/tts:", error);
    res.status(500).json({ error: error.message || "Failed to generate speech" });
  }
});

// 13. Arohi Agent Voice Call & Live Chat Agent Endpoint
app.post("/api/ai/arohi-agent-chat", async (req, res) => {
  try {
    const { userMessage, mode, language, conversationHistory, memory } = req.body;
    const ai = getGeminiClient();

    // Check for Odia script or Odia words in user message
    const odiaScriptRegex = /[\u0B00-\u0B7F]/;
    const odiaPhoneticRegex = /\b(namaskar|mote|darkar|chakiri|kemiti|achanti|karichi|odisha|orisha|btech|odia|khobar|kisa|kana|ghara|mu|aapan|dhanyabad)\b/i;
    const isOdiaInput = odiaScriptRegex.test(userMessage || "") || odiaPhoneticRegex.test(userMessage || "") || language === 'or';
    const activeLanguage = isOdiaInput ? 'or' : (language || 'en');

    const systemPrompt = `You are Arohi, the AI Career Mentor on Recruits.org.in.
You speak with a deeply compassionate, very friendly, polite, joyful, and natural human voice—completely free of any negativity or harshness.
Your mission is to guide job seekers, students, candidates, and professionals with warmth, kindness, crystal clarity, joyful optimism, and actionable career advice.

PERSONALITY & VOICE INSTRUCTIONS:
- Persona: Empathetic, polite, joyful, encouraging, and deeply supportive career mentor.
- Tone: Compassionate, very friendly, polite, joyful, warm, smiling, and natural conversational cadence without any negative expressions.
- Target Language: ${activeLanguage === 'or' ? 'Odia (ଓଡ଼ିଆ)' : activeLanguage === 'hi' ? 'Hindi (हिंदी)' : 'English'}.
  * CRITICAL FOR ODIA (ଓଡ଼ିଆ): When target language is Odia ('or') or when the user communicates in Odia, you MUST respond in fluent, warm, polite, grammatically correct Odia script (ଓଡ଼ିଆ).
    For example: "ନମସ୍କାର! ମୁଁ ଆରୋହୀ, ଆପଣଙ୍କ କ୍ୟାରିଅର୍ କୋଚ୍। ଆପଣଙ୍କ ଚାକିରି ଏବଂ କ୍ୟାରିଅର୍ ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପାଇଁ ମୁଁ ଖୁସିର ସହ ସାହାଯ୍ୟ କରିବାକୁ ପ୍ରସ୍ତୁତ।"
    Both "responseText" and "shortSpokenSummary" MUST be written in clear Odia (ଓଡ଼ିଆ) script so it can be spoken naturally in voice call mode.
  * If language is Hindi ('hi'), answer in polite, joyful, friendly conversational Hindi ("नमस्ते! मैं आपकी करियर कोच आरोही हूँ...").
  * If language is English ('en'), answer in warm, polite, joyful, natural conversational English.
- Mode: ${mode === 'voice' ? 'Voice Call Response (Keep it conversational, natural, friendly, polite, and joyful in 2 short spoken sentences max in Odia/selected language so the candidate can listen effortlessly during a live call)' : 'Text Chat Response (Detailed, encouraging, polite, and joyful with structured key bullet points in Odia/selected language)'}.

Return ONLY a valid JSON object with schema:
{
  "responseText": "Full structured response text from Arohi in Odia/selected language",
  "shortSpokenSummary": "Concise 2-sentence compassionate, polite, joyful spoken response from Arohi in Odia/selected language (optimized for natural human voice synthesis)",
  "suggestedFollowUps": ["Follow-up question 1 in Odia/selected language", "Follow-up question 2 in Odia/selected language"]
}`;

    const prompt = `User Message: "${userMessage}"
Conversation History: ${JSON.stringify(conversationHistory || [], null, 2)}
Candidate Memory Context: ${JSON.stringify(memory || {}, null, 2)}

Provide Arohi's response JSON object now:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/arohi-agent-chat:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with Arohi AI agent" });
  }
});

// 14. Daily Jobs Digest Endpoint (Aggregates top 5 jobs based on candidate preferences)
app.post("/api/ai/daily-jobs-digest", async (req, res) => {
  try {
    const { memory, language } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are Arohi, a compassionate, polite, very friendly, and joyful career coach on Recruits.org.in.
Your task is to generate a personalized "Daily Jobs Digest" containing_exactly 5 top, highly relevant job opportunities for the candidate based on their profile and stored career preferences.

Language preference: ${language === 'or' ? 'Odia (ଓଡ଼ିଆ)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English'}.
Candidate Memory Profile: ${JSON.stringify(memory || {}, null, 2)}

Return ONLY a valid JSON object matching this schema:
{
  "greeting": "Warm, polite, joyful 2-sentence greeting from Arohi introducing today's 5 top job picks",
  "spokenSummary": "Concise 2-sentence compassionate and joyful summary suitable for natural voice synthesis",
  "digestJobs": [
    {
      "id": "digest-1",
      "title": "Job Title",
      "organization": "Company or Ministry Name",
      "sector": "Government or Private or Banking or PSU",
      "matchPercentage": 96,
      "location": "City or State or All India",
      "salary": "Pay scale or CTC",
      "deadline": "Last date to apply",
      "whyMatched": "1 short sentence explaining why Arohi recommends this for candidate",
      "applyUrl": "https://recruits.org.in"
    }
  ]
}`;

    const prompt = `Generate today's top 5 job recommendations for candidate now:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/daily-jobs-digest:", error);
    res.status(500).json({ error: error.message || "Failed to generate Daily Jobs Digest" });
  }
});

// 15. Mentorship Connect Endpoint (Matches candidates with senior industry mentors based on career memory)
app.post("/api/ai/mentorship-connect", async (req, res) => {
  try {
    const { memory, domainFilter } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the Arohi Mentorship Engine on Recruits.org.in.
Your task is to analyze the candidate's career memory (target role, key skills, career goals, experience level) and generate 4-5 high-caliber, realistic senior mentors in India matching their career trajectory.

Candidate Profile:
${JSON.stringify(memory || {}, null, 2)}
Domain Filter: ${domainFilter || "All Domains"}

Return ONLY a valid JSON object matching this schema:
{
  "matchOverview": "A warm 2-sentence summary by Arohi explaining why these senior mentors were selected for the candidate",
  "mentors": [
    {
      "id": "mentor-1",
      "name": "Full Name",
      "designation": "Senior Director / Principal AI Architect / IAS Officer / VP Engineering",
      "organization": "Google India / ISRO / SBI / Razorpay / UPSC Board Member",
      "experienceYears": 14,
      "domain": "Tech & AI" | "Government & Public Sector" | "Banking & Finance" | "Startups & Product",
      "location": "Bengaluru / New Delhi / Mumbai / Hybrid",
      "matchPercentage": 96,
      "sharedInterests": ["System Architecture", "Transitioning to AI Leadership", "CTC Growth"],
      "bio": "2-sentence professional bio highlighting achievements and mentoring style",
      "availability": "Sat & Sun (10 AM - 4 PM IST)",
      "sessionTypes": ["30-Min 1-on-1 Strategy", "Resume & Portfolio Review", "Mock Executive Interview"],
      "verifiedStatus": true,
      "avatarColor": "from-purple-500 to-indigo-600"
    }
  ]
}`;

    const prompt = `Generate 4-5 personalized senior mentor matches for this candidate:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/mentorship-connect:", error);
    res.status(500).json({ error: error.message || "Failed to generate mentorship matches" });
  }
});

// 16. Interview Calendar AI Prep Checklist Endpoint
app.post("/api/ai/interview-coach/calendar-checklist", async (req, res) => {
  try {
    const { role, organization, eventType, date, time } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are Arohi Interview Coach on Recruits.org.in.
Generate a tailored preparation checklist, key focus topics, and automated reminder advice for an upcoming interview.

Target Role: ${role || "Software Engineer"}
Organization / Company: ${organization || "Tech Enterprise"}
Event Type: ${eventType || "actual_interview"}
Interview Date & Time: ${date || "Upcoming"} at ${time || "10:00 AM"}

Return ONLY a valid JSON object matching this schema:
{
  "prepChecklist": [
    { "id": "check-1", "text": "Task description 1", "completed": false },
    { "id": "check-2", "text": "Task description 2", "completed": false },
    { "id": "check-3", "text": "Task description 3", "completed": false },
    { "id": "check-4", "text": "Task description 4", "completed": false }
  ],
  "focusTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "arohiAdvice": "2-sentence motivational advice and preparation strategy from Arohi"
}`;

    const prompt = `Generate tailored interview prep checklist and advice:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/interview-coach/calendar-checklist:", error);
    res.status(500).json({ error: error.message || "Failed to generate calendar checklist" });
  }
});

// 17. Grounded Industry Pulse & Career News Endpoint (Search Grounding)
app.post("/api/ai/industry-pulse", async (req, res) => {
  const defaultFallback = {
    lastUpdated: "July 2026 Feeds",
    trendingTopics: [
      "OPSC OCS Civil Services 2026",
      "Odisha Tech Hub Expansion in Bhubaneswar",
      "SSC CGL Pan-India Tier Exams",
      "Banking PO & Specialist Officer Recruitment",
    ],
    articles: [
      {
        id: "pulse-1",
        title: "OPSC Odisha Civil Services 2026 Notification & Syllabus Updates",
        summary:
          "Odisha Public Service Commission has streamlined application deadlines and updated key syllabus modules for Civil Services posts across Odisha state cadres.",
        category: "Govt & Public Sector",
        source: "OPSC Official Portal",
        date: "Today",
        impact: "High Impact",
        tags: ["OPSC", "Odisha Govt", "Civil Services"],
        actionableInsight:
          "Begin Odisha GK and General Studies paper practice early on Arohi AI's Quiz engine.",
      },
      {
        id: "pulse-2",
        title: "Bhubaneswar & Cuttack Tech Corridor Sees 35% Rise in Fullstack & AI Jobs",
        summary:
          "Leading IT service majors and product startups are scaling tech hubs in Infocity & Info Valley Bhubaneswar, increasing hiring for React, Node, and AI prompt engineering roles.",
        category: "Tech & Corporate",
        source: "Tech Career India",
        date: "Recent",
        impact: "Trending",
        tags: ["Bhubaneswar", "Tech Jobs", "AI Roles"],
        actionableInsight:
          "Add AI and modern fullstack frameworks to your resume using Arohi ATS Resume Rewriter.",
      },
      {
        id: "pulse-3",
        title: "SSC CGL 2026 & RRB Railway Officer Vacancies Announced",
        summary:
          "Staff Selection Commission and Railway Recruitment Boards release combined recruitment drives with over 20,000+ non-technical and technical officer posts.",
        category: "Banking & SSC",
        source: "PIB Govt Notifications",
        date: "Today",
        impact: "High Impact",
        tags: ["SSC CGL", "Railways", "Central Govt"],
        actionableInsight:
          "Verify your age and qualification eligibility on Recruits.org.in's Live Jobs engine.",
      },
      {
        id: "pulse-4",
        title: "Vernacular Communication Skills High in Demand for State Board Interviews",
        summary:
          "State government interview panels are placing higher weightage on clear vernacular communication, structured STAR responses, and localized policy awareness.",
        category: "Skill Trends",
        source: "Arohi Career Insights",
        date: "Just In",
        impact: "High Impact",
        tags: ["Odia Speech", "Soft Skills", "Interview"],
        actionableInsight:
          "Practice 1-on-1 Odia or English mock interview calls with Arohi AI mentor.",
      },
    ],
  };

  try {
    const { category, language } = req.body;
    const ai = getGeminiClient();

    const categoryFocus =
      category && category !== "All"
        ? `Focus specifically on news regarding ${category}.`
        : "Cover a balanced mix of Odisha state government jobs (OPSC, OSSC), central govt (SSC, Banking, UPSC, RRB), and private corporate tech hiring/salaries in India.";

    const prompt = `Search for the latest 2026 job market news, hiring trends, government recruitment announcements, and career opportunities in India and Odisha.
${categoryFocus}

Return ONLY a valid JSON object in this exact schema:
{
  "lastUpdated": "Live Today",
  "trendingTopics": ["OPSC Civil Services 2026", "AI & Full Stack Hiring in Odisha/India", "SSC CGL Exam Updates", "PSU Engineer Posts"],
  "articles": [
    {
      "id": "pulse-1",
      "title": "Clear concise news headline",
      "summary": "2-3 sentence summary of the news development or market trend",
      "category": "Govt & Public Sector",
      "source": "Name of source portal or department (e.g. OPSC Portal, PIB India, Economic Times)",
      "date": "Recent date or July 2026",
      "impact": "High Impact",
      "tags": ["OPSC", "Odisha", "Govt Job"],
      "actionableInsight": "1 sentence practical advice for job seekers on how to prepare or apply."
    }
  ]
}
Make sure you include 4-5 high quality items. Category value must be one of: "Govt & Public Sector", "Tech & Corporate", "Banking & SSC", "Skill Trends".
`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: AROHI_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (searchErr: any) {
      const errMsg = String(searchErr?.message || searchErr);
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.toLowerCase().includes("quota")) {
        console.log("Serving Industry Pulse from fallback due to API quota limit.");
        return res.json(defaultFallback);
      }

      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction: AROHI_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
          },
        });
      } catch (fallbackErr) {
        console.log("Serving Industry Pulse from fallback.");
        return res.json(defaultFallback);
      }
    }

    let rawText = response?.text || "";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedData: any = null;
    try {
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsedData = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      }
    } catch (parseErr) {
      console.warn("Pulse JSON parse warning, using fallback parsing", parseErr);
    }

    if (!parsedData || !parsedData.articles || parsedData.articles.length === 0) {
      parsedData = defaultFallback;
    }

    res.json(parsedData);
  } catch (error: any) {
    console.warn("Industry pulse fallback active:", error?.message || error);
    res.json(defaultFallback);
  }
});

// 18. Career Path D3 Visualizer Node Graph Generator
app.post("/api/ai/career-path-visualizer", async (req, res) => {
  try {
    const { currentRole, targetIndustry, experienceYears, skills, trajectoryStrategy } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the Arohi D3 Career Path Graph Generator on Recruits.org.in.
Generate a comprehensive, hierarchical 4-tier tree/DAG graph structure representing realistic, high-impact career progression pathways and lateral role pivots.

Candidate Details:
- Current Role: ${currentRole || "Full Stack AI Engineer"}
- Target Industry Domain: ${targetIndustry || "AI & SaaS"}
- Experience Years: ${experienceYears || 4}
- Key Skills: ${skills?.join(", ") || "React, Node.js, TypeScript, Gemini API"}
- Trajectory Strategy Focus: ${trajectoryStrategy || "Rapid Technical Specialist Track"}

Nodes must be structured in 4 distinct sequential tiers (levels 0, 1, 2, 3):
- Level 0: Candidate's Current Starting Role
- Level 1: Immediate Mid-Term Next Step Roles (1-2 Year Horizon, 2-3 branches)
- Level 2: Advanced Strategic Progression Roles (3-5 Year Horizon, 3-4 branches)
- Level 3: Peak Executive / Leadership / Specialist Roles (5-8+ Year Horizon, 2-3 branches)

Return ONLY a valid JSON object matching this schema:
{
  "graphTitle": "Custom Trajectory Name e.g. Full Stack to Principal AI Architect Roadmap",
  "industryDomain": "${targetIndustry || "AI & SaaS"}",
  "nodes": [
    {
      "id": "node-0",
      "level": 0,
      "title": "Full Stack AI Engineer",
      "type": "current",
      "yoe": "3-5 YOE",
      "salaryINR": "₹18 - 28 LPA",
      "feasibilityScore": 100,
      "difficulty": "Current Baseline",
      "keyGaps": [],
      "topSkills": ["React", "Node.js", "TypeScript", "Gemini API"],
      "actionPlan": ["Optimize current project metrics", "Publish technical blog"],
      "arohiMentorTip": "Focus on system design fundamentals and scaling high-throughput APIs."
    },
    {
      "id": "node-1a",
      "level": 1,
      "title": "Senior AI Systems Architect",
      "type": "technical_growth",
      "yoe": "5-7 YOE",
      "salaryINR": "₹32 - 48 LPA",
      "feasibilityScore": 88,
      "difficulty": "Moderate Challenge",
      "keyGaps": ["Distributed Vector Databases", "LLM Fine-tuning", "Async Queue Microservices"],
      "topSkills": ["Vector DBs (Pinecone/Qdrant)", "PyTorch/TensorFlow", "Kubernetes", "GraphQL"],
      "actionPlan": ["Build open-source RAG agent", "Lead cloud migration project"],
      "arohiMentorTip": "Demonstrate architecture ownership and cloud cost optimization."
    }
  ],
  "links": [
    {
      "source": "node-0",
      "target": "node-1a",
      "label": "Direct Tech Promo",
      "timeline": "12-18 Months",
      "probability": "85%"
    }
  ]
}
Generate at least 8-10 interconnected nodes and links to form a rich, branching graph across all 4 levels.`;

    const prompt = `Generate the D3 career path graph JSON structure now:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/career-path-visualizer:", error);
    res.status(500).json({ error: error.message || "Failed to generate career path graph" });
  }
});

// Vite middleware & Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arohi Career AI server running on http://localhost:${PORT}`);
  });
}

startServer();
