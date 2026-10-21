"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const nivelCompradorCores: Record<string, string> = {
  Novo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Frequente: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  VIP: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Premium: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

const compradorFake = {
  nome: "Carlos M.",
  avatar: "CM",
  nivel: "VIP",
  nota: 4.9,
  totalCompras: 47,
  membroDesde: "Agosto 2026",
  avaliacoes: [
    { vendedor: "Igor L.", nota: 5, texto: "Comprador excelente! Briefing claro e aprovou rápido. Recomendo.", data: "18 out 2026" },
    { vendedor: "Monique F.", nota: 5, texto: "Muito organizado, mandou tudo certinho. Cliente nota 10.", data: "14 out 2026" },
    { vendedor: "Jonathan A.", nota: 4, texto: "Bom comprador, pediu uma revisão a mais mas tudo dentro do combinado.", data: "10 out 2026" },
    { vendedor: "Brunna L.", nota: 5, texto: "Pagou no prazo e deu feedback construtivo. Excelente trabalhar com ele.", data: "6 out 2026" },
  ],
};

export function CompradorPerfilClient({ compradorId }: { compradorId: string }) {
  const comprador = compradorFake;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {/* Profile header */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-2xl font-bold text-white shadow-xl">
                {comprador.avatar}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <h1 className="text-2xl font-bold">{comprador.nome}</h1>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${nivelCompradorCores[comprador.nivel]}`}>
                    Comprador {comprador.nivel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">Membro desde {comprador.membroDesde}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-6 sm:justify-start">
                  <div>
                    <p className="text-xl font-bold">{comprador.nota.toFixed(1)}</p>
                    <p className="text-xs text-muted">Nota como comprador</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{comprador.totalCompras}</p>
                    <p className="text-xs text-muted">Compras realizadas</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">100%</p>
                    <p className="text-xs text-muted">Pagamento em dia</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">4h</p>
                    <p className="text-xs text-muted">Tempo de aprovação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking bilateral explanation */}
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="mb-2 text-sm font-bold text-primary">Ranking Bilateral FPM</h2>
            <p className="text-sm text-muted">
              No FPM, compradores também são avaliados! Vendedores avaliam se o briefing foi claro,
              se o pagamento foi em dia e se a aprovação foi justa. Compradores bem avaliados ganham
              prioridade nas filas e descontos exclusivos.
            </p>
          </div>

          {/* Reviews from sellers */}
          <section>
            <h2 className="mb-4 text-lg font-bold">O que vendedores dizem sobre {comprador.nome}</h2>
            <div className="space-y-3">
              {comprador.avaliacoes.map((av, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {av.vendedor.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <span className="text-sm font-medium">{av.vendedor}</span>
                        <span className="ml-1 text-[10px] text-muted">(vendedor)</span>
                      </div>
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
