import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Boxes, LayoutGrid, Target, TreePine } from "lucide-react";
import { isFirstVisit, markFirstVisit, loadProgress } from "@/lib/progress";
import { TOTAL_ITEMS } from "@/lib/items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoCraft — Aprenda Reciclagem Combinando Materiais" },
      { name: "description", content: "Jogo educativo de combinações de reciclagem. Descubra como transformar materiais comuns em objetos sustentáveis." },
      { property: "og:title", content: "EcoCraft — Aprenda Reciclagem Combinando Materiais" },
      { property: "og:description", content: "Combine materiais recicláveis e descubra novos objetos sustentáveis." },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Home,
});

function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  return () => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!ctxRef.current) ctxRef.current = new Ctx();
      const ctx = ctxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.1);
    } catch { /* ignore */ }
  };
}

function Home() {
  const [welcome, setWelcome] = useState(false);
  const [percent, setPercent] = useState(0);
  const [found, setFound] = useState(0);
  const click = useClickSound();

  useEffect(() => {
    if (isFirstVisit()) {
      setWelcome(true);
      markFirstVisit();
    }
    const p = loadProgress();
    setPercent(p.percent);
    setFound(p.discovered.length);
  }, []);

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-accent/15 blur-[120px] rounded-full animate-pulse pointer-events-none delay-700" />

      <div className="w-full max-w-lg flex flex-col items-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative group">
          <div className="absolute -inset-6 bg-primary/25 blur-3xl rounded-full group-hover:bg-primary/40 transition-all duration-700 animate-pulse" />
          <img
            src="/game/assets/logo-horizontal.png"
            alt="EcoCraft"
            className="w-44 sm:w-52 md:w-64 max-w-full relative drop-shadow-[0_0_25px_rgba(130,255,145,0.4)] transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="text-center space-y-1 w-full">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Combine. Descubra. <span className="text-primary">Recicle.</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
            Um jogo educativo sobre reciclagem e sustentabilidade.
          </p>
        </div>

        {welcome && (
          <div className="w-full glass rounded-2xl px-4 py-2.5 text-xs text-center border-primary/20 bg-primary/5">
            <p className="font-medium text-foreground/90">
              <span className="text-primary font-bold">Bem-vindo!</span> Explore o menu para começar.
            </p>
          </div>
        )}

        {found > 0 && (
          <div className="w-full glass rounded-2xl px-4 py-3 relative overflow-hidden border-t border-white/20">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-black mb-2">
              <span className="text-primary/60">Progresso</span>
              <span className="text-primary glow-text">{found} / {TOTAL_ITEMS} — {percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/40 border border-white/5 shadow-inner overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_100%] animate-pulse shadow-[0_0_15px_rgba(130,255,145,0.5)] transition-all duration-1000"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        <nav className="grid grid-cols-2 gap-3 md:gap-4 w-full">
          <MenuCard onClick={click} to="/jogar" icon={<Boxes className="w-7 md:w-9 h-7 md:h-9 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />} label="Jogar" primary />
          <MenuCard onClick={click} to="/tutorial" icon={<LayoutGrid className="w-7 md:w-9 h-7 md:h-9 text-primary/80 drop-shadow-[0_0_12px_rgba(130,255,145,0.3)]" />} label="Guia" />
          <MenuCard onClick={click} to="/dashboard" icon={<Target className="w-7 md:w-9 h-7 md:h-9 text-primary/80 drop-shadow-[0_0_12px_rgba(130,255,145,0.3)]" />} label="Status" />
          <MenuCard onClick={click} to="/sobre" icon={<TreePine className="w-7 md:w-9 h-7 md:h-9 text-primary/90 drop-shadow-[0_0_15px_rgba(130,255,145,0.4)]" />} label="Sobre" />
        </nav>
      </div>
    </main>
  );
}

function MenuCard({
  to, icon, label, primary = false, onClick,
}: {
  to: "/jogar" | "/tutorial" | "/dashboard" | "/sobre";
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        "group relative flex flex-col items-center justify-center gap-4 text-center transition-all duration-500 " +
        (primary ? "scale-105" : "")
      }
    >
      <div className={
        "w-full h-28 sm:h-32 md:h-36 glass rounded-[28px] flex flex-col items-center justify-center gap-2 md:gap-3 border-t border-white/20 neo-hover relative overflow-hidden " +
        (primary ? "bg-primary/10 border-primary/40 shadow-[0_0_50px_rgba(130,255,145,0.2)]" : "bg-white/5")
      }>
        <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-primary/40" />
        <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-primary/40" />
        <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-primary/40" />
        <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-primary/40" />

        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
          <div className="relative transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
        </div>

        <div className="space-y-1">
          <span className="block font-black text-xs md:text-sm tracking-[0.2em] uppercase text-white group-hover:text-primary transition-colors">
            {label}
          </span>
          <div className="h-[2px] w-0 group-hover:w-full bg-primary mx-auto transition-all duration-500 shadow-[0_0_10px_var(--primary)]" />
        </div>
      </div>
    </Link>
  );
}
