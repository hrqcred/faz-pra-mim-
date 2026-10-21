"use client";

import Link from "next/link";
import { useState } from "react";
import type { Servico } from "@/data/servicos";
import { servicos } from "@/data/servicos";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicoCard } from "@/components/ServicoCard";

const nivelCores: Record<string, string> = {
  Novato: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Ativo: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Profissional: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Expert: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Elite: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

const avaliacoesFake = [
  { nome: "Carlos M.", nota: 5, texto: "Vídeo ficou incrível, entrega super rápida! Recomendo demais.", data: "18 out 2026" },
  { nome: "Amanda S.", nota: 5, texto: "Qualidade profissional, fala natural e ótima edição. Já vou pedir de novo.", data: "15 out 2026" },
  { nome: "Rafael T.", nota: 5, texto: "Fez exatamente o que eu pedi, produto vendeu muito depois do vídeo!", data: "12 out 2026" },
  { nome: "Juliana P.", nota: 4, texto: "Bom trabalho, só demorou um pouquinho a mais do prazo mas ficou bom.", data: "10 out 2026" },
];

export function ServicoDetalheClient({ servico }: { servico: Servico }) {
  const [quantidade, setQuantidade] = useState(1);
  const [tabAtiva, setTabAtiva] = useState<"descricao" | "avaliacoes" | "vendedor">("descricao");

  const similares = servicos
    .filter((s) => s.id !== servico.id && s.categoria === servico.categoria)
    .slice(0, 4);

  const total = servico.preco * quantidade;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-foreground">Início</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-foreground">Catálogo</Link>
            <span>/</span>
            <span className="text-foreground">{servico.categoria}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="mb-4 text-xl font-bold sm:text-2xl">{servico.titulo}</h1>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {servico.vendedor.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{servico.vendedor.nome}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${nivelCores[servico.vendedor.nivel]}`}>
                      {servico.vendedor.nivel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="flex items-center gap-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-amber-400">
                        <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
                      </svg>
                      {servico.vendedor.nota.toFixed(1)}
                    </span>
                    <span>|</span>
                    <span>{servico.vendedor.vendas.toLocaleString("pt-BR")} vendas</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2">
                <div className="col-span-2 flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="text-center">
                    <svg className="mx-auto mb-2 text-primary/40" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                    <p className="text-sm text-muted">Preview do vídeo</p>
                  </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex aspect-video items-center justify-center rounded-lg bg-surface border border-border">
                    <span className="text-xs text-muted">Foto {i}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex gap-1 border-b border-border">
                {([
                  { key: "descricao", label: "Descrição" },
                  { key: "avaliacoes", label: `Avaliações (${avaliacoesFake.length})` },
                  { key: "vendedor", label: "Sobre o vendedor" },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setTabAtiva(tab.key)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                      tabAtiva === tab.key
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {tabAtiva === "descricao" && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted">{servico.descricao}</p>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">O que está incluso</h3>
                    <ul className="space-y-1.5 text-sm text-muted">
                      {["Vídeo gravado com qualidade profissional", "Áudio limpo e masterizado", "Até 1 minuto de duração (600 palavras)", "1 revisão inclusa"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {servico.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tabAtiva === "avaliacoes" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-xl bg-surface border border-border p-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{servico.vendedor.nota.toFixed(1)}</p>
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
                    <div key={i} className="border-b border-border pb-4 last:border-0">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
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
              )}

              {tabAtiva === "vendedor" && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
                      {servico.vendedor.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{servico.vendedor.nome}</h3>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${nivelCores[servico.vendedor.nivel]}`}>
                          {servico.vendedor.nivel}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        Criador de conteúdo profissional. Especialista em vídeos que convertem para marcas e infoprodutores.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <p className="text-lg font-bold">{servico.vendedor.nota.toFixed(1)}</p>
                          <p className="text-xs text-muted">Nota média</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{servico.vendedor.vendas.toLocaleString("pt-BR")}</p>
                          <p className="text-xs text-muted">Vendas</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">95%</p>
                          <p className="text-xs text-muted">Entrega no prazo</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">2h</p>
                          <p className="text-xs text-muted">Tempo de resposta</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-xl border border-border bg-surface p-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted">Preço</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between rounded-lg bg-background p-3">
                  <span className="text-sm text-muted">Entrega em</span>
                  <span className="text-sm font-semibold">{servico.prazoEntrega}</span>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-xs text-muted">Quantidade</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-background"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantidade}</span>
                    <button
                      onClick={() => setQuantidade(quantidade + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-background"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Link
                  href="/cadastro"
                  className="mb-3 block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                >
                  Comprar agora — R$ {total.toFixed(2).replace(".", ",")}
                </Link>

                <button className="mb-4 w-full rounded-xl border border-border py-3 text-center text-sm font-semibold transition-colors hover:bg-background">
                  Falar com vendedor
                </button>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Pagamento 100% protegido
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vendedor só recebe após sua aprovação
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    1 revisão inclusa
                  </div>
                </div>
              </div>
            </div>
          </div>

          {similares.length > 0 && (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="mb-6 text-lg font-bold">Serviços semelhantes</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similares.map((s) => (
                  <ServicoCard key={s.id} servico={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
