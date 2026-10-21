"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { servicos } from "@/data/servicos";

type TabRanking = "vendedores" | "compradores";

const nivelVendedorCores: Record<string, string> = {
  Novato: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Ativo: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Profissional: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Expert: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Elite: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

const nivelCompradorCores: Record<string, string> = {
  Novo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Frequente: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  VIP: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Premium: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

const avatarGradients = [
  "from-rose-400 to-pink-600", "from-violet-400 to-purple-600",
  "from-blue-400 to-indigo-600", "from-cyan-400 to-teal-600",
  "from-emerald-400 to-green-600", "from-amber-400 to-orange-600",
  "from-red-400 to-rose-600", "from-fuchsia-400 to-pink-600",
  "from-sky-400 to-blue-600", "from-lime-400 to-emerald-600",
];

function avatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

const vendedoresRank = Array.from(
  new Map(servicos.map((s) => [s.vendedor.nome, s.vendedor])).values()
).sort((a, b) => b.vendas - a.vendas);

const compradoresRank = [
  { nome: "Carlos M.", avatar: "CM", nivel: "Premium", nota: 4.95, compras: 134 },
  { nome: "Amanda R.", avatar: "AR", nivel: "Premium", nota: 4.9, compras: 98 },
  { nome: "Felipe T.", avatar: "FT", nivel: "VIP", nota: 4.85, compras: 76 },
  { nome: "Juliana S.", avatar: "JS", nivel: "VIP", nota: 4.8, compras: 63 },
  { nome: "Marcos L.", avatar: "ML", nivel: "Frequente", nota: 4.75, compras: 45 },
  { nome: "Beatriz C.", avatar: "BC", nivel: "Frequente", nota: 4.7, compras: 38 },
  { nome: "Lucas P.", avatar: "LP", nivel: "Frequente", nota: 4.65, compras: 31 },
  { nome: "Renata F.", avatar: "RF", nivel: "Novo", nota: 4.6, compras: 12 },
  { nome: "Diego A.", avatar: "DA", nivel: "Novo", nota: 4.5, compras: 8 },
  { nome: "Camila V.", avatar: "CV", nivel: "Novo", nota: 4.4, compras: 3 },
];

const nivelInfo = {
  vendedores: [
    { nivel: "Novato", req: "0-10 vendas", cor: "bg-zinc-400", beneficio: "Acesso básico à plataforma" },
    { nivel: "Ativo", req: "11-100 vendas", cor: "bg-blue-400", beneficio: "Badge no perfil, prioridade no feed" },
    { nivel: "Profissional", req: "101-500 vendas", cor: "bg-purple-400", beneficio: "Destaque no catálogo, suporte prioritário" },
    { nivel: "Expert", req: "501-2000 vendas", cor: "bg-amber-400", beneficio: "Selo verificado, taxa reduzida" },
    { nivel: "Elite", req: "2000+ vendas", cor: "bg-emerald-400", beneficio: "Destaque na home, taxa mínima, convites exclusivos" },
  ],
  compradores: [
    { nivel: "Novo", req: "0-5 compras", cor: "bg-zinc-400", beneficio: "Acesso básico" },
    { nivel: "Frequente", req: "6-30 compras", cor: "bg-blue-400", beneficio: "Prioridade na fila de vendedores" },
    { nivel: "VIP", req: "31-80 compras", cor: "bg-purple-400", beneficio: "5% de desconto, suporte prioritário" },
    { nivel: "Premium", req: "80+ compras", cor: "bg-amber-400", beneficio: "10% desconto, gerente dedicado, acesso antecipado" },
  ],
};

export default function RankingPage() {
  const [tab, setTab] = useState<TabRanking>("vendedores");

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="mb-2 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Ranking Bilateral</h1>
            <p className="mt-2 text-sm text-muted">
              No FPM, vendedores E compradores são avaliados. Todo mundo tem reputação.
            </p>
          </div>

          {/* Diferencial badge */}
          <div className="mx-auto mb-8 max-w-lg rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-xs font-semibold text-primary">Diferencial FPM</p>
            <p className="mt-1 text-sm text-muted">
              Diferente de outras plataformas, aqui o comprador também recebe nota.
              Vendedores preferem trabalhar com compradores bem avaliados!
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex justify-center gap-2">
            <button
              onClick={() => setTab("vendedores")}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                tab === "vendedores" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface border border-border text-muted"
              }`}
            >
              Top Vendedores
            </button>
            <button
              onClick={() => setTab("compradores")}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                tab === "compradores" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface border border-border text-muted"
              }`}
            >
              Top Compradores
            </button>
          </div>

          {/* Levels explanation */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-5">
            <h3 className="mb-3 text-sm font-bold">Níveis de {tab === "vendedores" ? "Vendedor" : "Comprador"}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {nivelInfo[tab].map((n) => (
                <div key={n.nivel} className="flex items-start gap-3 rounded-lg bg-background p-3">
                  <div className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${n.cor}`} />
                  <div>
                    <p className="text-sm font-semibold">{n.nivel}</p>
                    <p className="text-[11px] text-muted">{n.req}</p>
                    <p className="mt-0.5 text-[11px] text-primary">{n.beneficio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs text-muted">
                    <th className="py-3 pl-4 pr-2 text-left font-medium">#</th>
                    <th className="px-2 py-3 text-left font-medium">Usuário</th>
                    <th className="px-2 py-3 text-left font-medium">Nível</th>
                    <th className="px-2 py-3 text-right font-medium">Nota</th>
                    <th className="px-2 py-3 pr-4 text-right font-medium">
                      {tab === "vendedores" ? "Vendas" : "Compras"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tab === "vendedores"
                    ? vendedoresRank.map((v, i) => (
                        <tr key={v.nome} className="border-b border-border last:border-0 transition-colors hover:bg-background">
                          <td className="py-3 pl-4 pr-2">
                            {i < 3 ? (
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                                i === 0 ? "bg-amber-400" : i === 1 ? "bg-zinc-400" : "bg-amber-700"
                              }`}>
                                {i + 1}
                              </span>
                            ) : (
                              <span className="pl-1.5 text-muted">{i + 1}</span>
                            )}
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(v.nome)} text-[10px] font-bold text-white`}>
                                {v.avatar}
                              </div>
                              <span className="font-medium">{v.nome}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${nivelVendedorCores[v.nivel]}`}>
                              {v.nivel}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right">
                            <span className="flex items-center justify-end gap-0.5">
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="text-amber-400">
                                <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
                              </svg>
                              {v.nota.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-2 py-3 pr-4 text-right font-semibold">
                            {v.vendas.toLocaleString("pt-BR")}
                          </td>
                        </tr>
                      ))
                    : compradoresRank.map((c, i) => (
                        <tr key={c.nome} className="border-b border-border last:border-0 transition-colors hover:bg-background">
                          <td className="py-3 pl-4 pr-2">
                            {i < 3 ? (
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                                i === 0 ? "bg-amber-400" : i === 1 ? "bg-zinc-400" : "bg-amber-700"
                              }`}>
                                {i + 1}
                              </span>
                            ) : (
                              <span className="pl-1.5 text-muted">{i + 1}</span>
                            )}
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(c.nome)} text-[10px] font-bold text-white`}>
                                {c.avatar}
                              </div>
                              <span className="font-medium">{c.nome}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${nivelCompradorCores[c.nivel]}`}>
                              {c.nivel}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right">
                            <span className="flex items-center justify-end gap-0.5">
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="text-amber-400">
                                <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
                              </svg>
                              {c.nota.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-2 py-3 pr-4 text-right font-semibold">
                            {c.compras}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
