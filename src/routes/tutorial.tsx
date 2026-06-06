import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ITEMS, TOTAL_ITEMS } from "@/lib/items";
import { markTutorialSeen } from "@/lib/progress";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Como Jogar — EcoCraft" },
      { name: "description", content: "Aprenda a combinar materiais recicláveis e descobrir todos os itens do EcoCraft." },
      { property: "og:title", content: "Como Jogar — EcoCraft" },
      { property: "og:description", content: "Aprenda a combinar materiais recicláveis e descobrir todos os itens do EcoCraft." },
      { property: "og:url", content: "/tutorial" },
    ],
  }),
  component: TutorialPage,
});

type Slide = {
  title: string;
  body: React.ReactNode;
};

function img(id: string) {
  const it = ITEMS[id];
  if (!it) return null;
  return <img key={id} src={it.image} alt={it.name} className="w-12 h-12 object-contain" />;
}

const PRIMARY_IDS = ["papel", "papelao", "garrafa-plastico", "vidro", "metal", "madeira"];

const SLIDES: Slide[] = [
  {
    title: "Objetivo",
    body: (
      <>
        <p>
          Descubra todos os <strong>{TOTAL_ITEMS} materiais</strong> combinando os itens primários iniciais.
        </p>
        <div className="mt-4 grid grid-cols-6 gap-2 justify-items-center">
          {PRIMARY_IDS.map((id) => img(id))}
        </div>
      </>
    ),
  },
  {
    title: "Arraste para combinar",
    body: (
      <>
        <p>Segure um item e arraste para perto de outro. Se a combinação for válida, eles se transformam em um novo material.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          {img("papel")}
          <span className="text-2xl text-accent font-bold">+</span>
          {img("papel")}
          <span className="text-2xl text-accent font-bold">→</span>
          {img("papel-reciclado")}
        </div>
      </>
    ),
  },
  {
    title: "Misture o mesmo tier",
    body: (
      <>
        <p><strong>Primário + Primário</strong> = Intermediário</p>
        <div className="my-3 flex items-center justify-center gap-3">
          {img("garrafa-plastico")} <span className="text-accent font-bold">+</span> {img("garrafa-plastico")} <span className="text-accent font-bold">→</span> {img("plastico-triturado")}
        </div>
        <p><strong>Intermediário + Intermediário</strong> = Avançado</p>
        <div className="my-3 flex items-center justify-center gap-3">
          {img("papel-reciclado")} <span className="text-accent font-bold">+</span> {img("plastico-triturado")} <span className="text-accent font-bold">→</span> {img("brinquedo-ecologico")}
        </div>
        <p className="text-sm text-muted-foreground">Tiers diferentes não combinam.</p>
      </>
    ),
  },
  {
    title: "Raridade e pontos",
    body: (
      <>
        <p>Cada item descoberto vale pontos eco e tem uma raridade:</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Badge color="bg-gray-400">Comum</Badge>
          <Badge color="bg-emerald-400">Incomum</Badge>
          <Badge color="bg-blue-400">Raro</Badge>
          <Badge color="bg-purple-400">Épico</Badge>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Quanto mais raro o material, mais pontos vale.</p>
      </>
    ),
  },
  {
    title: "Controles do jogo",
    body: (
      <>
        <p>Durante a partida você tem acesso a:</p>
        <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
          <li><strong>Reiniciar</strong> — limpa o canvas mantendo as descobertas.</li>
          <li><strong>Dica</strong> — sugere uma combinação possível.</li>
          <li><strong>Tutorial</strong> — abre este guia novamente.</li>
          <li><strong>Menu</strong> — volta para a tela inicial.</li>
        </ul>
      </>
    ),
  },
];

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-2 py-1">
      <span className={`w-3 h-3 rounded ${color}`} />
      <span>{children}</span>
    </span>
  );
}

function TutorialPage() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  function finish() {
    markTutorialSeen();
    navigate({ to: "/jogar" });
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-pulse pointer-events-none delay-700" />

      <div className="w-full max-w-md flex flex-col gap-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors w-fit font-bold border-b border-primary/30 pb-1">
            Menu
          </Link>
          <button onClick={finish} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors w-fit font-bold border-b border-white/10 pb-1">
            Pular
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
          Como <span className="text-primary not-italic">Jogar</span>
        </h1>

        <div className="flex gap-1">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-colors ${idx <= i ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <article className="glass rounded-[40px] p-8 min-h-[360px] relative overflow-hidden neo-hover">
          <h2 className="text-xl font-bold text-primary mb-3">{slide.title}</h2>
          <div className="text-foreground/90 space-y-2">{slide.body}</div>
        </article>

        <div className="flex gap-2">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="flex-1 rounded-xl border border-border bg-card/60 py-3 font-semibold disabled:opacity-40 inline-flex items-center justify-center gap-1"
          >
            Anterior
          </button>
          {last ? (
            <button
              onClick={finish}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-bold inline-flex items-center justify-center gap-1 shadow-[var(--shadow-glow)]"
            >
              Começar
            </button>
          ) : (
            <button
              onClick={() => setI((v) => Math.min(SLIDES.length - 1, v + 1))}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-bold inline-flex items-center justify-center gap-1"
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
