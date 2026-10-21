"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicoCard } from "@/components/ServicoCard";
import type { Servico } from "@/data/servicos";

const nivelCores: Record<string, string> = {
  Novato: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Ativo: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Profissional: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Expert: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Elite: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

const avatarGradients = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-blue-400 to-indigo-600",
  "from-cyan-400 to-teal-600",
  "from-emerald-400 to-green-600",
  "from-amber-400 to-orange-600",
  "from-red-400 to-rose-600",
  "from-fuchsia-400 to-pink-600",
  "from-sky-400 to-blue-600",
  "from-lime-400 to-emerald-600",
];

function avatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

type Vendedor = Servico["vendedor"];

const avaliacoesFake = [
  { nome: "Pedro H.", nota: 5, texto: "Trabalho impecável, o vídeo ficou perfeito pro meu produto!", data: "19 out 2026" },
  { nome: "Mariana C.", nota: 5, texto: "Entregou antes do prazo com qualidade excelente. Super recomendo!", data: "16 out 2026" },
  { nome: "Lucas S.", nota: 4, texto: "Bom trabalho, só pedi uma revisão menor mas ficou ótimo.", data: "13 out 2026" },
  { nome: "Ana B.", nota: 5, texto: "Profissional demais, já é a terceira vez que compro. Nunca decepciona.", data: "9 out 2026" },
  { nome: "Felipe R.", nota: 5, texto: "Melhor vendedor da plataforma! Vídeo converteu absurdamente.", data: "5 out 2026" },
];

export function VendedorPerfilClient({
  vendedor,
  servicos,
}: {
  vendedor: Vendedor;
  servicos: Servico[];
  vendedorId: string;
}) {
  const totalVendas = servicos.reduce((sum, s) => sum + s.vendedor.vendas, 0);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Profile header */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(vendedor.nome)} text-3xl font-bold text-white shadow-xl`}>
                {vendedor.avatar}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <h1 className="text-2xl font-bold">{vendedor.nome}</h1>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${nivelCores[vendedor.nivel]}`}>
                    {vendedor.nivel}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  Criador de conteúdo profissional. Especialista em vídeos que convertem para marcas, infoprodutores e e-commerces. Qualidade profissional garantida.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-6 sm:justify-start">
                  <div>
                    <p className="text-xl font-bold">{vendedor.nota.toFixed(1)}</p>
                    <p className="text-xs text-muted">Nota média</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{totalVendas.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted">Vendas totais</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{servicos.length}</p>
                    <p className="text-xs text-muted">Serviços ativos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">97%</p>
                    <p className="text-xs text-muted">Entrega no prazo</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">1h</p>
                    <p className="text-xs text-muted">Tempo de resposta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-bold">Serviços de {vendedor.nome}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicos.map((s) => (
                <ServicoCard key={s.id} servico={s} />
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="mb-4 text-lg font-bold">Avaliações recentes</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{vendedor.nota.toFixed(1)}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill="currentColor" className="text-amber-400">
                        <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted">{avaliacoesFake.length} avaliações</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = avaliacoesFake.filter((a) => a.nota === n).length;
                    const pct = (count / avaliacoesFake.length) * 100;
                    return (
                      <div key={n} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-muted">{n}</span>
                        <div className="h-2 flex-1 rounded-full bg-border">
                          <div className="h-2 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-muted">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {avaliacoesFake.map((av, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {av.nome.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium">{av.nome}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: av.nota }).map((_, j) => (
                          <svg key={j} width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="text-amber-400">
                            <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted">{av.data}</span>
                  </div>
                  <p className="text-sm text-muted">{av.texto}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
