import { createFileRoute, Link } from "@tanstack/react-router";
import { TreePine } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — EcoCraft" },
      { name: "description", content: "EcoCraft é um jogo educativo de combinações de reciclagem desenvolvido como Projeto A3." },
      { property: "og:title", content: "Sobre — EcoCraft" },
      { property: "og:description", content: "EcoCraft é um jogo educativo de combinações de reciclagem desenvolvido como Projeto A3." },
      { property: "og:url", content: "/sobre" },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <main className="min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <Link to="/" className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors w-fit font-bold border-b border-primary/30 pb-1">
          Voltar ao Sistema
        </Link>

        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic flex items-center gap-3">
          Sobre o <span className="text-primary not-italic">EcoCraft</span> <TreePine className="w-8 h-8 text-primary/60 animate-pulse" />
        </h1>

        <section className="glass rounded-3xl p-6 space-y-4 neo-hover">
          <div className="flex items-start gap-4">
            <div className="w-2 h-12 bg-primary rounded-full flex-shrink-0" />
            <p className="text-sm leading-relaxed text-foreground/90 font-medium">
              O EcoCraft é um ecossistema digital educativo desenvolvido para ensinar a arte da reciclagem. 
              Através de uma interface futurista e mecânicas de combinação, transformamos a educação ambiental 
              em uma experiência tecnológica e lúdica.
            </p>
          </div>
        </section>

        <section className="glass rounded-3xl p-6 space-y-3 neo-hover">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Iniciativa</h2>
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            Desenvolvido como parte do <strong>Projeto A3</strong>, focado em sustentabilidade, 
            consciência ecológica e inovação digital.
          </p>
        </section>

        <section className="glass rounded-3xl p-6 space-y-3 neo-hover">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Tecnologias Utilizadas</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              "Interface React de Alta Performance",
              "Design Futurista com Tailwind CSS",
              "Motor de Jogo em JavaScript Puro",
              "Persistência de Dados em Tempo Real",
              "Arquitetura Mobile-First"
            ].map((tech, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-foreground/70">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_var(--primary)]" />
                {tech}
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-8 opacity-50">
          Eco System · Projeto A3 · 2026
        </footer>
      </div>
    </main>
  );
}
