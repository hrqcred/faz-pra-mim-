"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Tab = "visao_geral" | "usuarios" | "pedidos" | "financeiro" | "servicos";

const usuariosFake = [
  { nome: "Igor L.", tipo: "vendedor", nivel: "Expert", pedidos: 47, nota: 4.98, status: "ativo" },
  { nome: "Monique F.", tipo: "vendedor", nivel: "Profissional", pedidos: 31, nota: 4.85, status: "ativo" },
  { nome: "Carlos M.", tipo: "comprador", nivel: "VIP", compras: 12, gasto: 580, status: "ativo" },
  { nome: "Amanda R.", tipo: "comprador", nivel: "Premium", compras: 28, gasto: 1420, status: "ativo" },
  { nome: "Felipe T.", tipo: "vendedor", nivel: "Novato", pedidos: 2, nota: 4.5, status: "pendente" },
  { nome: "Juliana S.", tipo: "comprador", nivel: "Frequente", compras: 5, gasto: 220, status: "suspenso" },
];

const pedidosFake = [
  { id: "FPM-A1B2", comprador: "Carlos M.", vendedor: "Igor L.", servico: "Vídeo comercial", valor: 44, status: "em_producao", data: "20 out 2026" },
  { id: "FPM-C3D4", comprador: "Amanda R.", vendedor: "Monique F.", servico: "Depoimento", valor: 55, status: "entregue", data: "18 out 2026" },
  { id: "FPM-E5F6", comprador: "Felipe T.", vendedor: "Jonathan A.", servico: "UGC criativo", valor: 44, status: "disputado", data: "15 out 2026" },
  { id: "FPM-G7H8", comprador: "Juliana S.", vendedor: "Camila R.", servico: "Narração VSL", valor: 60, status: "aprovado", data: "12 out 2026" },
];

const statusCores: Record<string, string> = {
  ativo: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  pendente: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  suspenso: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  em_producao: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  entregue: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400",
  disputado: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  aprovado: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
};

const statusLabels: Record<string, string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  suspenso: "Suspenso",
  em_producao: "Em produção",
  entregue: "Entregue",
  disputado: "Disputado",
  aprovado: "Aprovado",
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("visao_geral");

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="mt-1 text-sm text-muted">Gestão completa da plataforma FPM</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
            {([
              ["visao_geral", "Visão Geral"],
              ["usuarios", "Usuários"],
              ["pedidos", "Pedidos"],
              ["financeiro", "Financeiro"],
              ["servicos", "Serviços"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                  tab === key ? "bg-primary text-white" : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Visão Geral */}
          {tab === "visao_geral" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Usuários ativos", valor: "1.247", variacao: "+12%", cor: "text-primary" },
                  { label: "Pedidos este mês", valor: "342", variacao: "+8%", cor: "text-primary" },
                  { label: "Volume transacionado", valor: "R$ 18.540", variacao: "+15%", cor: "text-primary" },
                  { label: "Taxa FPM arrecadada", valor: "R$ 1.854", variacao: "+15%", cor: "text-primary" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xl font-bold">{s.valor}</p>
                    <p className="text-[11px] text-muted">{s.label}</p>
                    <p className={`mt-1 text-[10px] font-semibold ${s.cor}`}>{s.variacao} vs mês anterior</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-3 text-sm font-bold">Pedidos por status</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Em produção", pct: 35, cor: "bg-purple-500" },
                      { label: "Entregues", pct: 28, cor: "bg-cyan-500" },
                      { label: "Aprovados", pct: 25, cor: "bg-emerald-500" },
                      { label: "Pendentes", pct: 8, cor: "bg-amber-500" },
                      { label: "Disputados", pct: 4, cor: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-24 text-xs text-muted">{item.label}</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-background">
                          <div className={`h-2 rounded-full ${item.cor}`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-xs font-semibold">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-3 text-sm font-bold">Distribuição de vendedores</h3>
                  <div className="space-y-2">
                    {[
                      { nivel: "Elite", qtd: 3, cor: "bg-amber-500" },
                      { nivel: "Expert", qtd: 12, cor: "bg-purple-500" },
                      { nivel: "Profissional", qtd: 38, cor: "bg-blue-500" },
                      { nivel: "Ativo", qtd: 85, cor: "bg-emerald-500" },
                      { nivel: "Novato", qtd: 156, cor: "bg-zinc-400" },
                    ].map((item) => (
                      <div key={item.nivel} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.cor}`} />
                          <span className="text-xs">{item.nivel}</span>
                        </div>
                        <span className="text-xs font-semibold">{item.qtd} vendedores</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="mb-3 text-sm font-bold">Atividade recente</h3>
                <div className="space-y-3">
                  {[
                    { acao: "Novo vendedor cadastrado", detalhe: "Felipe T. — aguardando aprovação", tempo: "2 min atrás" },
                    { acao: "Disputa aberta", detalhe: "Pedido #FPM-E5F6 — comprador insatisfeito", tempo: "15 min atrás" },
                    { acao: "Saque solicitado", detalhe: "Igor L. — R$ 200,00 via Pix", tempo: "1h atrás" },
                    { acao: "Pedido aprovado", detalhe: "#FPM-G7H8 — pagamento liberado para Camila R.", tempo: "3h atrás" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{a.acao}</p>
                        <p className="text-xs text-muted">{a.detalhe}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted">{a.tempo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Usuários */}
          {tab === "usuarios" && (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background text-left text-xs text-muted">
                      <th className="px-4 py-3 font-medium">Usuário</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Nível</th>
                      <th className="px-4 py-3 font-medium">Atividade</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFake.map((u) => (
                      <tr key={u.nome} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium">{u.nome}</td>
                        <td className="px-4 py-3 capitalize text-muted">{u.tipo}</td>
                        <td className="px-4 py-3">{u.nivel}</td>
                        <td className="px-4 py-3 text-muted">
                          {u.tipo === "vendedor"
                            ? `${u.pedidos} pedidos • ⭐ ${u.nota}`
                            : `${(u as any).compras} compras • R$ ${(u as any).gasto}`}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[u.status]}`}>
                            {statusLabels[u.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="rounded-lg border border-border px-2 py-1 text-[10px] hover:bg-background">Ver</button>
                            {u.status === "pendente" && (
                              <button className="rounded-lg bg-primary px-2 py-1 text-[10px] text-white">Aprovar</button>
                            )}
                            {u.status === "ativo" && (
                              <button className="rounded-lg border border-red-200 px-2 py-1 text-[10px] text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30">Suspender</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pedidos */}
          {tab === "pedidos" && (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background text-left text-xs text-muted">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Serviço</th>
                      <th className="px-4 py-3 font-medium">Comprador</th>
                      <th className="px-4 py-3 font-medium">Vendedor</th>
                      <th className="px-4 py-3 font-medium">Valor</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFake.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-mono text-xs text-muted">#{p.id}</td>
                        <td className="px-4 py-3 font-medium">{p.servico}</td>
                        <td className="px-4 py-3 text-muted">{p.comprador}</td>
                        <td className="px-4 py-3 text-muted">{p.vendedor}</td>
                        <td className="px-4 py-3 font-semibold text-primary">R$ {p.valor},00</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[p.status]}`}>
                            {statusLabels[p.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="rounded-lg border border-border px-2 py-1 text-[10px] hover:bg-background">Detalhes</button>
                            {p.status === "disputado" && (
                              <button className="rounded-lg bg-red-500 px-2 py-1 text-[10px] text-white">Mediar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financeiro */}
          {tab === "financeiro" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Receita total (taxas)", valor: "R$ 1.854" },
                  { label: "Saques pendentes", valor: "R$ 2.340" },
                  { label: "Em escrow", valor: "R$ 4.120" },
                  { label: "Disputas em aberto", valor: "R$ 44" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xl font-bold">{s.valor}</p>
                    <p className="text-[11px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="mb-4 text-sm font-bold">Saques pendentes</h3>
                <div className="space-y-3">
                  {[
                    { vendedor: "Igor L.", valor: 200, metodo: "Pix", data: "21 out 2026" },
                    { vendedor: "Monique F.", valor: 150, metodo: "Pix", data: "20 out 2026" },
                    { vendedor: "Jonathan A.", valor: 90, metodo: "Pix", data: "19 out 2026" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{s.vendedor}</p>
                        <p className="text-xs text-muted">{s.metodo} • {s.data}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">R$ {s.valor},00</span>
                        <button className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white">Aprovar</button>
                        <button className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-muted">Recusar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Serviços */}
          {tab === "servicos" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { cat: "Vídeo Comercial", qtd: 8, pedidos: 124 },
                  { cat: "Depoimento", qtd: 5, pedidos: 87 },
                  { cat: "UGC", qtd: 4, pedidos: 63 },
                  { cat: "VSL", qtd: 2, pedidos: 41 },
                  { cat: "Narração", qtd: 1, pedidos: 18 },
                  { cat: "Vídeo Editado", qtd: 3, pedidos: 29 },
                ].map((c) => (
                  <div key={c.cat} className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-sm font-bold">{c.cat}</p>
                    <p className="mt-1 text-xs text-muted">{c.qtd} serviços ativos • {c.pedidos} pedidos</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
