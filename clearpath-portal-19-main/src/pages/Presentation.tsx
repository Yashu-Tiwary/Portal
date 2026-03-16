import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Home } from "lucide-react";

/* ─── Slide Data ─── */
const slides = [
  {
    id: 1,
    title: "PARIVESH 3.0",
    subtitle: "Role-Based Environmental Clearance System",
    content: [
      "Domain: Workflow Systems · Environmental Governance · GovTech",
      "A unified web portal managing the complete lifecycle of environmental clearance applications",
      "From initial filing → Scrutiny → Meeting documentation → Final MoM publication",
    ],
    accent: "hero",
  },
  {
    id: 2,
    title: "Problem & Objective",
    subtitle: "Why PARIVESH 3.0?",
    content: [
      "🔴  Multiple stakeholders with no unified platform",
      "🔴  Complex documentation handled manually",
      "🔴  Manual meeting preparation causes delays",
      "",
      "🟢  Improve transparency, efficiency & speed",
      "🟢  Digital workflow with role-based access control",
      "🟢  Automated gist generation & MoM finalization",
    ],
    accent: "problem",
  },
  {
    id: 3,
    title: "Core User Roles",
    subtitle: "Strict Role-Based Access Control",
    content: [
      "👤  Admin — Role assignment, master templates, sector parameters",
      "📋  Project Proponent / RQP — Registration, multi-step filing, document upload, fee payment (UPI/QR)",
      "🔍  Scrutiny Team — Document verification, flag deficiencies (EDS), refer to meetings, auto-generate gist",
      "📝  MoM Team — Edit gist, convert to formal Minutes of Meeting, lock finalized MoM",
    ],
    accent: "roles",
  },
  {
    id: 4,
    title: "Workflow Stages",
    subtitle: "Linear Status Progression",
    stages: [
      { label: "Draft", color: "hsl(140, 10%, 55%)" },
      { label: "Submitted", color: "hsl(205, 80%, 50%)" },
      { label: "Under Scrutiny", color: "hsl(40, 90%, 50%)" },
      { label: "EDS", color: "hsl(0, 72%, 51%)" },
      { label: "Referred", color: "hsl(270, 60%, 55%)" },
      { label: "MoM Generated", color: "hsl(152, 50%, 45%)" },
      { label: "Finalized", color: "hsl(152, 45%, 25%)" },
    ],
    accent: "workflow",
  },
  {
    id: 5,
    title: "Technical Stack & Evaluation",
    subtitle: "Implementation Details",
    content: [
      "⚙️  React + TypeScript + Vite + Tailwind CSS",
      "📦  Document export in Word & PDF formats",
      "🔒  Strong data security & role isolation",
      "💳  Payment integration with QR code & UPI",
      "",
      "📊  Evaluation Criteria:",
      "     • Workflow completeness & automation logic",
      "     • UI/UX quality & role-based security",
    ],
    accent: "tech",
  },
];

/* ─── Accent Palettes ─── */
const accentStyles: Record<string, { bg: string; border: string; badge: string }> = {
  hero: { bg: "from-[hsl(152,45%,25%)] to-[hsl(152,35%,14%)]", border: "border-[hsl(45,80%,60%)]", badge: "bg-[hsl(45,80%,60%)] text-[hsl(150,30%,10%)]" },
  problem: { bg: "from-[hsl(0,30%,15%)] to-[hsl(150,20%,7%)]", border: "border-[hsl(0,72%,51%)]", badge: "bg-[hsl(0,72%,51%)] text-white" },
  roles: { bg: "from-[hsl(205,40%,15%)] to-[hsl(150,20%,7%)]", border: "border-[hsl(205,80%,50%)]", badge: "bg-[hsl(205,80%,50%)] text-white" },
  workflow: { bg: "from-[hsl(270,30%,15%)] to-[hsl(150,20%,7%)]", border: "border-[hsl(270,60%,55%)]", badge: "bg-[hsl(270,60%,55%)] text-white" },
  tech: { bg: "from-[hsl(152,45%,20%)] to-[hsl(150,20%,7%)]", border: "border-[hsl(152,50%,45%)]", badge: "bg-[hsl(152,50%,45%)] text-white" },
};

/* ─── Component ─── */
const Presentation = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const slide = slides[current];
  const style = accentStyles[slide.accent] || accentStyles.hero;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, slides.length - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  /* Keyboard nav */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") exitFullscreen();
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); enterFullscreen(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  /* Scale calculation */
  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const { clientWidth: w, clientHeight: h } = containerRef.current;
      setScale(Math.min(w / 1920, h / 1080));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [isFullscreen]);

  /* Fullscreen */
  const enterFullscreen = () => {
    containerRef.current?.requestFullscreen?.();
    setIsFullscreen(true);
  };
  const exitFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setIsFullscreen(false);
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[hsl(150,20%,5%)]">
      {/* Scaled slide */}
      <div
        className="absolute"
        style={{
          width: 1920,
          height: 1080,
          left: "50%",
          top: "50%",
          marginLeft: -960,
          marginTop: -540,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div className={`flex h-full w-full flex-col justify-center bg-gradient-to-br ${style.bg} p-[120px] text-white`}>
          {/* Slide number badge */}
          <span className={`mb-8 w-fit rounded-full px-6 py-2 text-[22px] font-bold ${style.badge}`}>
            Slide {slide.id} / {slides.length}
          </span>

          {/* Title */}
          <h1 className="mb-4 font-serif text-[96px] leading-[1.1] font-bold tracking-tight">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-[36px] font-medium text-white/70">
            {slide.subtitle}
          </p>

          {/* Content or Workflow stages */}
          {"stages" in slide && slide.stages ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                {slide.stages.map((stage, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center rounded-2xl px-8 py-5 text-[26px] font-bold text-white shadow-lg"
                      style={{ backgroundColor: stage.color }}
                    >
                      {stage.label}
                    </div>
                    {i < slide.stages!.length - 1 && (
                      <ChevronRight className="h-10 w-10 text-white/40" />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-8 text-[28px] text-white/50">
                Each stage enforces role-based access — only authorized roles can advance the application.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {slide.content?.map((line, i) =>
                line === "" ? (
                  <li key={i} className="h-4" />
                ) : (
                  <li key={i} className="text-[32px] leading-relaxed text-white/85">
                    {line}
                  </li>
                )
              )}
            </ul>
          )}

          {/* Bottom border accent */}
          <div className={`absolute bottom-0 left-0 h-2 w-full ${style.badge}`} />
        </div>
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-black/60 px-4 py-2 backdrop-blur-md">
        <button onClick={() => navigate("/")} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
          <Home className="h-5 w-5" />
        </button>
        <button onClick={prev} disabled={current === 0} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="min-w-[60px] text-center text-sm text-white/70">{current + 1} / {slides.length}</span>
        <button onClick={next} disabled={current === slides.length - 1} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </button>
        <button onClick={isFullscreen ? exitFullscreen : enterFullscreen} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default Presentation;
