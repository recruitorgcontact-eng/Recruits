import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Compass,
  ArrowRight,
  Building2,
  FileText,
  PhoneCall,
  GraduationCap,
  Award,
  Globe,
  Building,
  Bot,
  Zap,
  CheckCircle2,
  ChevronDown,
  Layers,
  ChevronRight,
  Maximize2,
  X,
  ShieldCheck,
  Target
} from "lucide-react";
import { UserRoleMode, LanguageCode } from "../types";
import { speakText, stopSpeech } from "../utils/speech";

interface Cinematic3DExperienceProps {
  onEnterWorkspace: (engineId?: string, mode?: UserRoleMode) => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onCloseCinematic?: () => void;
  externalScrollProgress?: number;
}

interface SceneStep {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  engineId?: string;
  bgGradient: string;
  arohiPrompt: string;
  ctaText: string;
}

const SCENES: SceneStep[] = [
  {
    id: "arrival",
    number: 1,
    title: "Arrival: The World's First AI Career Universe",
    tagline: "Earth Orbit • India Glowing Network • Recruit AI Engine",
    description: "Welcome to the future of talent discovery. Travel from space into India's central AI career metropolis where every destination represents a milestone in your professional journey.",
    icon: Globe,
    bgGradient: "from-indigo-950/90 via-slate-950 to-indigo-950/90",
    arohiPrompt: "Namaste! I am Arohi AI. Welcome to the Recruit 3D Career Universe. Scroll down or click any building to explore your future.",
    ctaText: "Begin 3D Exploration ↓"
  },
  {
    id: "aicity",
    number: 2,
    title: "AI Cyber City: The Career Metropolis",
    tagline: "Neon Skyscrapers • Interactive District Portals",
    description: "Fly over the glowing cyber skyline. Each building houses a dedicated intelligence engine powered by Arohi AI — from ATS resume optimization to government job crawlers.",
    icon: Compass,
    engineId: "liveindiajobs",
    bgGradient: "from-purple-950/90 via-slate-950 to-indigo-950/90",
    arohiPrompt: "Explore our 8 central career towers. Click any skyscraper to zoom inside its AI lab.",
    ctaText: "Explore Live Jobs & Towers"
  },
  {
    id: "resumestudio",
    number: 3,
    title: "Resume Studio: Floating Holographic Optimizer",
    tagline: "Instant ATS Analysis • Missing Keyword Injection • PDF Export",
    description: "Step into the floating holographic resume lab. Upload your resume or build a fresh one with 98%+ ATS match scoring and automated formatting.",
    icon: FileText,
    engineId: "resume",
    bgGradient: "from-blue-950/90 via-slate-950 to-indigo-950/90",
    arohiPrompt: "Upload your resume in the Resume Studio to instantly diagnose ATS missing keywords and generate quantified bullet points.",
    ctaText: "Launch Resume Rewriter"
  },
  {
    id: "interviewlab",
    number: 4,
    title: "AI Interview Lab: Holographic Voice Chamber",
    tagline: "1-on-1 Voice Calls • STAR Method Coaching • Odia & Multilingual",
    description: "Take a seat in the futuristic interview pod. Speak naturally in Odia, Hindi, or English. Arohi AI provides real-time acoustic confidence and STAR structure feedback.",
    icon: PhoneCall,
    engineId: "interview",
    bgGradient: "from-amber-950/90 via-slate-950 to-indigo-950/90",
    arohiPrompt: "In the Interview Lab, practice full voice mock calls for OPSC, SSC, and tech corporate rounds with zero judgment.",
    ctaText: "Start Voice Interview Call"
  },
  {
    id: "employerdistrict",
    number: 5,
    title: "Employer District: Glass Corporate Skyscrapers",
    tagline: "Direct Recruiter Vacancies • Zero Commission • Verified Logos",
    description: "Walk through the corporate tech and enterprise financial towers. Connect directly with hiring managers without middleman fees.",
    icon: Building2,
    engineId: "recruiter",
    bgGradient: "from-emerald-950/90 via-slate-950 to-teal-950/90",
    arohiPrompt: "For recruiters and companies, post verified openings for free and use AI candidate fit analysis.",
    ctaText: "Post Jobs / Browse Companies"
  },
  {
    id: "skillsacademy",
    number: 6,
    title: "Skills Academy: Cyber Tech University",
    tagline: "30s Rapid Quizzes • Micro-Skill Badges • Skill Gap Analysis",
    description: "Master React, Node.js, System Design, and General Aptitude through rapid 30-second timed AI quizzes with instant explanations.",
    icon: GraduationCap,
    engineId: "skillmastery",
    bgGradient: "from-violet-950/90 via-slate-950 to-purple-950/90",
    arohiPrompt: "Test your skills in 30-second rapid drills to earn verified skill badges for your candidate profile.",
    ctaText: "Take 30s Rapid Quiz"
  },
  {
    id: "govtzone",
    number: 7,
    title: "Government Career Campus: Digital Secretariat",
    tagline: "OPSC • SSC • UPSC • Banking • Railways • Defence • Odisha Jobs",
    description: "The digital governance hub indexing state and central recruitment drives with verified official notification PDFs and eligibility checks.",
    icon: Building,
    engineId: "liveindiajobs",
    bgGradient: "from-amber-950/90 via-slate-950 to-indigo-950/90",
    arohiPrompt: "Access live notifications for OPSC Odisha Civil Services, OSSC, SSC CGL, and Banking PO.",
    ctaText: "Browse Government Jobs"
  },
  {
    id: "globalcareers",
    number: 8,
    title: "Global Careers Spaceport: Overseas Portals",
    tagline: "USA • Canada • UAE • Singapore • Germany • Remote",
    description: "Choose your global destination portal. Discover international remote engineering, healthcare, and management roles with visa sponsorship guides.",
    icon: Globe,
    engineId: "liveindiajobs",
    bgGradient: "from-cyan-950/90 via-slate-950 to-blue-950/90",
    arohiPrompt: "Explore verified overseas opportunities and remote global tech roles with competitive USD/AED salary benchmarks.",
    ctaText: "Explore Global Opportunities"
  },
  {
    id: "commandcenter",
    number: 9,
    title: "Recruit AI Command Spire: Arohi Central AI",
    tagline: "Conversational Career Navigation • AI Matching Engine",
    description: "The core intelligence tower of the city. Talk with Arohi AI to orchestrate your entire career search through natural language conversation.",
    icon: Bot,
    engineId: "navigator",
    bgGradient: "from-indigo-950/90 via-slate-950 to-purple-950/90",
    arohiPrompt: "Ask me anything: 'Find me a job', 'Build my resume', 'Prepare me for interviews', or 'Estimate my salary'.",
    ctaText: "Open AI Command Assistant"
  },
  {
    id: "successhall",
    number: 10,
    title: "Success Hall & Celebration Plaza",
    tagline: "100,000+ Hired Candidates • Community Milestones",
    description: "Celebrate real career milestones unlocked by candidates across Odisha and Pan-India. Your transformation begins right now.",
    icon: Award,
    bgGradient: "from-amber-950/90 via-slate-950 to-indigo-950/90",
    arohiPrompt: "Your future starts now! Launch your personalized career workspace and claim your next opportunity.",
    ctaText: "🚀 Enter Career Workspace Now"
  }
];

export const Cinematic3DExperience: React.FC<Cinematic3DExperienceProps> = ({
  onEnterWorkspace,
  selectedLanguage = "en" as LanguageCode,
  onLanguageChange,
  onCloseCinematic,
  externalScrollProgress,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const overlayScrollRef = useRef<HTMLDivElement | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isSpeakingArohi, setIsSpeakingArohi] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // Mutable ref for smooth 60fps Three.js loop without tearing down WebGL context
  const scrollProgressRef = useRef<number>(0);
  const currentSceneIndexRef = useRef<number>(0);
  const isInternalScrollingRef = useRef<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cityGroupRef = useRef<THREE.Group | null>(null);
  const buildingsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const reqAnimationRef = useRef<number | null>(null);

  const activeScene = SCENES[currentSceneIndex] || SCENES[0];

  // Voice narration handler for scenes
  const handleNarrateScene = (index: number, forceSpeak = false) => {
    if (isAudioMuted && !forceSpeak) return;
    stopSpeech();
    const scene = SCENES[index];
    if (!scene) return;

    setIsSpeakingArohi(true);
    speakText({
      text: scene.arohiPrompt,
      language: selectedLanguage,
      onStart: () => setIsSpeakingArohi(true),
      onEnd: () => setIsSpeakingArohi(false),
      onError: () => setIsSpeakingArohi(false),
    });
  };

  // Sync external GSAP ScrollTrigger progress from HeroLandingPage
  useEffect(() => {
    if (typeof externalScrollProgress !== "number") return;
    const clamped = Math.min(Math.max(externalScrollProgress, 0), 1);
    scrollProgressRef.current = clamped;
    setScrollProgress(clamped);

    const calculatedIndex = Math.min(
      Math.floor(clamped * SCENES.length),
      SCENES.length - 1
    );

    if (calculatedIndex !== currentSceneIndexRef.current) {
      currentSceneIndexRef.current = calculatedIndex;
      setCurrentSceneIndex(calculatedIndex);
      if (!isAudioMuted) {
        handleNarrateScene(calculatedIndex);
      }
    }

    // Sync overlay scroll position gently when driven by page scroll
    if (overlayScrollRef.current && !isInternalScrollingRef.current) {
      const el = overlayScrollRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        el.scrollTop = clamped * maxScroll;
      }
    }
  }, [externalScrollProgress, isAudioMuted]);

  // Internal scroll listener to drive camera position along 3D trajectory
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll <= 0) return;

    isInternalScrollingRef.current = true;
    const progress = Math.min(Math.max(target.scrollTop / maxScroll, 0), 1);
    scrollProgressRef.current = progress;
    setScrollProgress(progress);

    const calculatedIndex = Math.min(
      Math.floor(progress * SCENES.length),
      SCENES.length - 1
    );

    if (calculatedIndex !== currentSceneIndexRef.current) {
      currentSceneIndexRef.current = calculatedIndex;
      setCurrentSceneIndex(calculatedIndex);
      handleNarrateScene(calculatedIndex);
    }

    window.setTimeout(() => {
      isInternalScrollingRef.current = false;
    }, 150);
  };

  // Three.js Initialization and Animation Loop (runs once on mount for stable WebGL lifecycle)
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.014);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 18, 45);
    cameraRef.current = camera;

    // 3. Renderer setup with ACES Filmic tone mapping & SRGB color space
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Studio Warm/Cool Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
    dirLight.position.set(22, 42, 24);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2.4, 90);
    pointLight.position.set(0, 12, -10);
    scene.add(pointLight);

    // 5. Stars Universe Background Particle Field
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 300;
      starPositions[i + 1] = (Math.random() - 0.5) * 300;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.85,
      transparent: true,
      opacity: 0.85,
    });
    const starPoints = new THREE.Points(starsGeo, starMat);
    scene.add(starPoints);

    // 6. 3D Rotating Earth Globe (Scene 1 Object)
    const earthGeo = new THREE.SphereGeometry(8, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.45,
      metalness: 0.35,
      emissive: 0x312e81,
      emissiveIntensity: 0.45,
      wireframe: true,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, 10, -10);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Glowing India Node Arc on Globe
    const indiaPinGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const indiaPinMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const indiaPin = new THREE.Mesh(indiaPinGeo, indiaPinMat);
    indiaPin.position.set(1.5, 3.5, 6.8);
    earthMesh.add(indiaPin);

    // 7. 3D Neon AI City Group (Scene 2-10 Objects)
    const cityGroup = new THREE.Group();
    cityGroup.position.set(0, -15, -40);
    scene.add(cityGroup);
    cityGroupRef.current = cityGroup;

    // Cyber Grid Ground Floor
    const gridHelper = new THREE.GridHelper(130, 34, 0x6366f1, 0x1e293b);
    gridHelper.position.y = 0;
    cityGroup.add(gridHelper);

    // 8 Cyber Skyscrapers representing Recruits.org.in services
    const buildingConfigs = [
      { id: "resumestudio", title: "Resume Studio", engineId: "resume", sceneIdx: 2, color: 0x3b82f6, x: -18, z: -10, height: 16 },
      { id: "interviewlab", title: "AI Interview Lab", engineId: "interview", sceneIdx: 3, color: 0xf59e0b, x: -6, z: -18, height: 22 },
      { id: "employerdistrict", title: "Employer HQ", engineId: "recruiter", sceneIdx: 4, color: 0x10b981, x: 6, z: -18, height: 26 },
      { id: "skillsacademy", title: "Skills Academy", engineId: "skillmastery", sceneIdx: 5, color: 0x8b5cf6, x: 18, z: -10, height: 18 },
      { id: "govtzone", title: "Government Zone", engineId: "liveindiajobs", sceneIdx: 6, color: 0xef4444, x: -14, z: 6, height: 20 },
      { id: "globalcareers", title: "Global Careers", engineId: "liveindiajobs", sceneIdx: 7, color: 0x06b6d4, x: 14, z: 6, height: 22 },
      { id: "commandcenter", title: "AI Command Spire", engineId: "navigator", sceneIdx: 8, color: 0xec4899, x: 0, z: -5, height: 32 },
      { id: "successhall", title: "Success Plaza", engineId: "liveindiajobs", sceneIdx: 9, color: 0x818cf8, x: 0, z: 12, height: 10 },
    ];

    buildingsMapRef.current.clear();
    const interactiveMeshes: THREE.Mesh[] = [];

    buildingConfigs.forEach((cfg) => {
      // Composite multi-part skyscraper group (tower core + stepped crown + beacon)
      const towerGroup = new THREE.Group();
      towerGroup.position.set(cfg.x, 0, cfg.z);

      const bGeo = new THREE.BoxGeometry(6, cfg.height, 6);
      const bMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.22,
        metalness: 0.82,
        emissive: cfg.color,
        emissiveIntensity: 0.28,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(0, cfg.height / 2, 0);
      bMesh.userData = {
        id: cfg.id,
        title: cfg.title,
        engineId: cfg.engineId,
        sceneIdx: cfg.sceneIdx,
        baseEmissive: 0.28,
      };
      towerGroup.add(bMesh);
      interactiveMeshes.push(bMesh);

      // Stepped architectural crown tier
      const crownGeo = new THREE.BoxGeometry(4.2, 2.4, 4.2);
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.45,
        metalness: 0.6,
        emissive: cfg.color,
        emissiveIntensity: 0.45,
      });
      const crownMesh = new THREE.Mesh(crownGeo, crownMat);
      crownMesh.position.set(0, cfg.height + 1.2, 0);
      towerGroup.add(crownMesh);

      // Glowing roof spire beacon
      const beaconGeo = new THREE.ConeGeometry(1.4, 3.8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(0, cfg.height + 4.3, 0);
      towerGroup.add(beaconMesh);

      cityGroup.add(towerGroup);
      buildingsMapRef.current.set(cfg.id, bMesh);
    });

    // Raycaster for interactive 3D Career City skyscraper selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        if (data && typeof data.sceneIdx === "number") {
          setSelectedBuilding(data.title);
          currentSceneIndexRef.current = data.sceneIdx;
          setCurrentSceneIndex(data.sceneIdx);
          const targetProg = data.sceneIdx / (SCENES.length - 1);
          scrollProgressRef.current = targetProg;
          setScrollProgress(targetProg);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    // 8. Animation Render Loop with Exponential Damping Camera Interpolation
    const clock = new THREE.Clock();
    const lookTarget = new THREE.Vector3(0, -10, -25);

    const animate = () => {
      reqAnimationRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Rotate Earth slowly
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += delta * 0.18;
      }

      // Smooth camera motion trajectory based on scrollProgressRef
      if (cameraRef.current) {
        const p = scrollProgressRef.current; // 0 to 1

        // Interpolate camera coordinates from Earth orbit down into the Career Metropolis
        const targetCamX = Math.sin(p * Math.PI * 2) * 14;
        const targetCamY = 20 - p * 16;
        const targetCamZ = 45 - p * 58;

        cameraRef.current.position.x = THREE.MathUtils.damp(
          cameraRef.current.position.x,
          targetCamX,
          4,
          delta
        );
        cameraRef.current.position.y = THREE.MathUtils.damp(
          cameraRef.current.position.y,
          targetCamY,
          4,
          delta
        );
        cameraRef.current.position.z = THREE.MathUtils.damp(
          cameraRef.current.position.z,
          targetCamZ,
          4,
          delta
        );

        lookTarget.set(0, p * 5 - 10, -25);
        cameraRef.current.lookAt(lookTarget);
      }

      // Highlight active scene skyscraper
      const activeSceneObj = SCENES[currentSceneIndexRef.current];
      buildingsMapRef.current.forEach((mesh, id) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isCurrent = activeSceneObj && activeSceneObj.id === id;
        mat.emissiveIntensity = THREE.MathUtils.damp(
          mat.emissiveIntensity,
          isCurrent ? 0.85 : 0.28,
          5,
          delta
        );
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      if (reqAnimationRef.current) cancelAnimationFrame(reqAnimationRef.current);
      starsGeo.dispose();
      starMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      renderer.dispose();
      if (renderer.domElement) {
        renderer.domElement.remove();
      }
    };
  }, []);

  // Jump to specific scene
  const handleJumpToScene = (idx: number) => {
    currentSceneIndexRef.current = idx;
    setCurrentSceneIndex(idx);
    const targetProgress = idx / Math.max(SCENES.length - 1, 1);
    scrollProgressRef.current = targetProgress;
    setScrollProgress(targetProgress);
    if (overlayScrollRef.current) {
      const el = overlayScrollRef.current;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        el.scrollTo({ top: targetProgress * maxScroll, behavior: "smooth" });
      }
    }
    handleNarrateScene(idx, true);
  };

  return (
    <div className="relative w-full h-[85vh] bg-slate-950 rounded-3xl border border-indigo-500/40 text-white shadow-2xl overflow-hidden flex flex-col">
      {/* TOP SCENE NAVIGATION HUD BAR */}
      <div className="z-30 bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 rounded-xl text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black flex items-center gap-2">
              Recruits.org.in 3D AI Career Universe
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                Scene {currentSceneIndex + 1} of {SCENES.length}
              </span>
              {selectedBuilding && (
                <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Tower: {selectedBuilding}
                </span>
              )}
            </h2>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Scroll seamlessly or click any 3D skyscraper / district tab below to fly through the Career Metropolis
            </p>
          </div>
        </div>

        {/* HUD Quick Jump Scene Dots */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {SCENES.map((sc, sIdx) => (
            <button
              key={sc.id}
              onClick={() => handleJumpToScene(sIdx)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentSceneIndex === sIdx
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm scale-105"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
              title={sc.title}
            >
              {sIdx + 1}. {sc.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Audio Narration & Launch Workspace Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isAudioMuted
                ? "bg-slate-800 text-slate-400 border-slate-700"
                : "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
            }`}
            title="Toggle Arohi Voice Narration"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onEnterWorkspace(activeScene.engineId || "liveindiajobs")}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>

          {onCloseCinematic && (
            <button
              onClick={onCloseCinematic}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 cursor-pointer"
              title="Minimize 3D View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER: 3D CANVAS & OVERLAY SCROLL LAYER */}
      <div className="relative flex-1 w-full overflow-hidden flex">
        {/* THREE.JS WEBGL CANVAS BACKGROUND */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-pointer" />

        {/* SCROLLABLE INTERACTIVE STORYLINE OVERLAY LAYER */}
        <div
          ref={overlayScrollRef}
          onScroll={handleScroll}
          className="relative z-10 w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth p-4 sm:p-8 space-y-[40vh]"
        >
          {SCENES.map((scene, idx) => {
            const Icon = scene.icon;
            const isActive = currentSceneIndex === idx;

            return (
              <div
                key={scene.id}
                className="snap-start min-h-[60vh] flex items-center justify-center pointer-events-none"
              >
                <div
                  className={`pointer-events-auto max-w-xl w-full bg-slate-900/90 backdrop-blur-2xl border ${
                    isActive ? "border-amber-400/80 shadow-2xl shadow-indigo-500/20 scale-100" : "border-slate-800 scale-95 opacity-70"
                  } rounded-3xl p-6 transition-all duration-500 space-y-4`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl text-amber-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
                          Scene {scene.number} of 10
                        </span>
                        <h3 className="text-lg font-black text-white">{scene.title}</h3>
                      </div>
                    </div>

                    <span className="text-[10px] bg-slate-950 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 font-bold">
                      {scene.tagline}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {scene.description}
                  </p>

                  {/* Arohi AI Speech Dialogue Box */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-indigo-500/30 flex items-start gap-2.5 text-xs text-indigo-200">
                    <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block font-bold text-[11px]">Arohi AI Voice Narration:</strong>
                      <span className="text-slate-300">{scene.arohiPrompt}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => handleNarrateScene(idx)}
                      className="w-full sm:w-auto px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Listen Arohi Voice
                    </button>

                    <button
                      onClick={() => onEnterWorkspace(scene.engineId || "liveindiajobs")}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{scene.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER SCROLL PROGRESS BAR */}
      <div className="z-30 bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-bold text-slate-300">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> 3D Orbit Camera Position: {(scrollProgress * 100).toFixed(0)}%
        </span>

        {/* Progress Bar Track */}
        <div className="w-48 sm:w-72 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 h-full transition-all duration-200"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <button
          onClick={() => onEnterWorkspace("liveindiajobs")}
          className="text-amber-300 font-extrabold hover:underline cursor-pointer"
        >
          Skip 3D Cinematic & Enter Portal →
        </button>
      </div>
    </div>
  );
};
