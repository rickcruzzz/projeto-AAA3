import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Play, RotateCcw, Trophy, Sparkles, Layers, AlertTriangle } from "lucide-react";
import { loadProgress, resetProgress, type Progress } from "@/lib/progress";
import { ITEMS, TIER_LABEL, RARITY_LABEL, TOTAL_ITEMS, type Rarity } from "@/lib/items";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu Progresso — EcoCraft" },
      { name: "description", content: "Acompanhe seus materiais descobertos, pontuação eco e raridades coletadas no EcoCraft." },
      { property: "og:title", content: "Meu Progresso — EcoCraft" },
      { property: "og:description", content: "Acompanhe seus materiais descobertos, pontuação eco e raridades no EcoCraft." },
      { property: "og:url", content: "/dashboard" },
    ],
  }),
  component: DashboardPage,
});

const RARITY_COLOR: Record<Rarity, string> = {
  common: "bg-gray-400 text-gray-900",
  uncommon: "bg-emerald-400 text-emerald-950",
  rare: "bg-blue-400 text-blue-950",
  epic: "bg-purple-400 text-purple-950",
};

function DashboardPage() {
  const [p, setP] = useState<Progress | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    setP(loadProgress());
  }, []);

  function refresh() {
    setP(loadProgress());
  }

  function confirmReset() {
    resetProgress();
    refresh();
    setResetOpen(false);
  }

  if (!p) return null;


  return (
    <main className="min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-pulse pointer-events-none delay-700" />

      <div className="max-w-md mx-auto flex flex-col gap-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link to="/" className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors w-fit font-bold border-b border-primary/30 pb-1">
          Voltar ao Sistema
        </Link>

        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
          Meu <span className="text-primary not-italic">Progresso</span>
        </h1>

        <section className="glass rounded-[40px] p-8 neo-hover">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Descobertas</div>
              <div className="text-4xl font-extrabold text-primary">
                {p.discovered.length}<span className="text-xl text-muted-foreground">/{TOTAL_ITEMS}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Concluído</div>
              <div className="text-2xl font-bold">{p.percent}%</div>
            </div>
          </div>
          <div className="mt-3 h-3 rounded-full bg-background/60 overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${p.percent}%` }} />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={null} label="Pontos eco" value={p.ecoPoints} />
          <Stat icon={null} label="Recorde" value={p.bestSession} />
        </div>

        <section className="glass rounded-[32px] p-8 neo-hover">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3 inline-flex items-center gap-2">
            Por tier
          </h2>
          <div className="space-y-3">
            {(["primary", "intermediate", "advanced"] as const).map((tier) => {
              const { found, total } = p.byTier[tier];
              const pct = total ? Math.round((found / total) * 100) : 0;
              return (
                <div key={tier}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{TIER_LABEL[tier]}</span>
                    <span className="text-muted-foreground">{found}/{total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass rounded-[32px] p-8 neo-hover">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Por raridade</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(RARITY_LABEL) as Rarity[]).map((r) => (
              <div key={r} className="flex items-center justify-between rounded-lg border border-border bg-background/30 px-3 py-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${RARITY_COLOR[r]}`}>{RARITY_LABEL[r]}</span>
                <span className="font-bold">{p.byRarity[r]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[32px] p-8 neo-hover">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Itens descobertos</h2>
          {p.discovered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum item descoberto ainda. Toque em <strong>Continuar jogando</strong> abaixo.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {p.discovered.map((id) => {
                const it = ITEMS[id];
                if (!it) return null;
                return (
                  <div key={id} className="aspect-square rounded-lg border border-border bg-background/40 flex items-center justify-center p-1" title={it.name}>
                    <img src={it.image} alt={it.name} className="w-full h-full object-contain" />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex gap-2">
          <Link
            to="/jogar"
            className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-bold inline-flex items-center justify-center gap-2 shadow-[var(--shadow-glow)]"
          >
            Continuar jogando
          </Link>
          <button
            onClick={() => setResetOpen(true)}
            className="rounded-xl border border-destructive/60 text-destructive bg-card/60 px-4 py-3 font-semibold inline-flex items-center gap-2 hover:bg-destructive/10 transition-colors"
            aria-label="Resetar progresso"
          >
            <RotateCcw className="w-4 h-4" /> Resetar
          </button>
        </div>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="glass border-destructive/30 rounded-3xl">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 w-14 h-14 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-xl">Reiniciar Progresso?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Isso apagará permanentemente todas as suas descobertas, pontos eco e recordes. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, resetar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-[24px] p-6 neo-hover">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">{icon} {label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
