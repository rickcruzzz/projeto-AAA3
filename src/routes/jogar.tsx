import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, GraduationCap, Leaf, ShieldCheck } from "lucide-react";
import { isGameMessage } from "@/lib/game-messages";
import { loadProgress } from "@/lib/progress";

export const Route = createFileRoute("/jogar")({
  head: () => ({
    meta: [
      { title: "Jogar — EcoCraft" },
      { name: "description", content: "Combine materiais recicláveis e descubra novos itens sustentáveis." },
      { property: "og:title", content: "Jogar — EcoCraft" },
      { property: "og:description", content: "Combine materiais recicláveis e descubra novos itens sustentáveis." },
      { property: "og:url", content: "/jogar" },
    ],
  }),
  component: JogarPage,
});

type Stage = "splash" | "loading" | "playing";

const TEAM: { name: string; ra: string }[] = [
  { name: "Daniel Brito São Pedro", ra: "12726131485" },
  { name: "Guilherme Mascarenhas de Andrade", ra: "12726117983" },
  { name: "Wendel Batista de Jesus", ra: "12725125671" },
  { name: "Davi Santana Santos Miranda", ra: "12726118656" },
  { name: "Gabriel Santos Ferreira", ra: "12726123501" },
  { name: "Alysson Brito de Oliveira", ra: "12726124164" },
  { name: "Orlando Henrique Bastos da Cruz", ra: "1272515070" },
];

const LOADING_STEPS = [
  "Calibrando módulo de reciclagem",
  "Carregando catálogo de materiais",
  "Sintetizando combinações sustentáveis",
  "Inicializando motor EcoCraft",
];

function JogarPage() {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [stage, setStage] = useState<Stage>("splash");

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!isGameMessage(e.data)) return;
      if (e.data.type === "ecocraft:back-to-menu") {
        navigate({ to: "/" });
      } else if (e.data.type === "ecocraft:discovery") {
        loadProgress();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {(stage === "loading" || stage === "playing") && (
        <iframe
          ref={iframeRef}
          src="/game/index.html"
          title="EcoCraft"
          allow="autoplay; fullscreen"
          className="absolute inset-0 w-full h-full border-0 block"
        />
      )}
      {stage === "splash" && <WelcomeSplash onEnter={() => setStage("loading")} />}
      {stage === "loading" && <GameLoader onDone={() => setStage("playing")} />}
    </div>
  );
}

function WelcomeSplash({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      role="dialog"
      aria-label="Bem-vindo ao EcoCraft"
      className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-500"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, rgba(46, 206, 51, 0.18), transparent 60%), radial-gradient(circle at 100% 100%, rgba(21, 73, 107, 0.35), transparent 65%), linear-gradient(160deg, #061611 0%, #0a1f17 55%, #04110b 100%)",
      }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(130,255,145,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(130,255,145,.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative min-h-full flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-5xl">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-white/[0.03] backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-foreground/80 hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Voltar
            </Link>
            <div aria-hidden />

          </div>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
            {/* Left: hero */}
            <div className="text-center lg:text-left">
              <img
                src="/game/assets/logo-horizontal.png"
                alt="EcoCraft"
                className="w-48 md:w-64 mx-auto lg:mx-0 drop-shadow-[0_0_40px_rgba(130,255,145,0.35)] mb-6"
              />
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.05] mb-4">
                Bem-vindo ao <br className="hidden md:block" />
                <span className="text-primary glow-text">EcoCraft</span>
              </h1>
              <p className="text-foreground/70 text-sm md:text-base max-w-md mx-auto lg:mx-0 mb-6 leading-relaxed">
                Plataforma educacional gamificada de combinação de materiais recicláveis,
                desenvolvida no contexto da disciplina de IHC &amp; UX.
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                <Pill icon={<GraduationCap className="w-3 h-3" />} label="Turma A3" />
                <Pill icon={<Leaf className="w-3 h-3" />} label="Sustentabilidade" />
                <Pill icon={<ShieldCheck className="w-3 h-3" />} label="IHC / UX" />
              </div>

              <button
                onClick={onEnter}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.25em] shadow-[0_0_40px_rgba(130,255,145,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                Iniciar Experiência
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>

            {/* Right: team panel */}
            <div className="glass rounded-3xl p-6 md:p-7 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-bold">Equipe</div>
                  <h2 className="text-lg md:text-xl font-black text-white mt-1">Integrantes do Projeto</h2>
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-bold border border-white/10 rounded-full px-3 py-1">
                  {TEAM.length} membros
                </div>
              </div>
              <ul className="divide-y divide-white/5 relative">
                {TEAM.map((m, i) => (
                  <li key={m.ra} className="flex items-center gap-3 py-2.5">
                    <span className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 border border-primary/30 text-primary text-[11px] font-black flex items-center justify-center tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{m.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/50 font-mono">
                        RA {m.ra}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            A3 — IHC &amp; UX · EcoCraft © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/70">
      {icon}
      {label}
    </span>
  );
}

function GameLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 2600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 2.2);
      const pct = Math.round(eased * 100);
      setProgress(pct);
      setStepIdx(Math.min(LOADING_STEPS.length - 1, Math.floor((pct / 100) * LOADING_STEPS.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      role="status"
      aria-label="Carregando EcoCraft"
      className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-in fade-in duration-300"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, rgba(46,206,51,0.18), transparent 60%), linear-gradient(160deg, #04110b 0%, #061611 60%, #020806 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(130,255,145,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(130,255,145,.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md text-center">
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin"
            style={{ animationDuration: "1.2s" }}
          />
          <div className="absolute inset-3 rounded-full bg-primary/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(130,255,145,0.35)]">
            <Leaf className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(130,255,145,0.7)]" />
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-[0.4em] text-primary/80 font-bold mb-2">
          EcoCraft Engine
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-6">
          Carregando jogo de <span className="text-primary glow-text">sustentabilidade</span>
        </h2>

        <div className="relative h-2 rounded-full bg-black/50 border border-white/5 overflow-hidden shadow-inner mb-3">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/70 via-primary to-primary/70 shadow-[0_0_15px_rgba(130,255,145,0.6)] transition-[width] duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] font-bold mb-8">
          <span className="text-foreground/60 truncate pr-2">{LOADING_STEPS[stepIdx]}…</span>
          <span className="text-primary tabular-nums">{progress}%</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {LOADING_STEPS.map((_, i) => (
            <div
              key={i}
              className={
                "h-1 rounded-full transition-colors duration-300 " +
                (i <= stepIdx ? "bg-primary shadow-[0_0_8px_rgba(130,255,145,0.6)]" : "bg-white/10")
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
