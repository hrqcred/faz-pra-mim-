"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

type Tab = "visao_geral" | "usuarios" | "pedidos" | "financeiro";

const statusCores: Record<string, string> = {
  ativo: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  pendente: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  suspenso: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  em_producao: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  entregue: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400",
  disputado: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  aprovado: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  aceito: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  cancelado: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  concluido: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
};

const statusLabels: Record<string, string> = {
  ativo: "Ativo", pendente: "Pendente", suspenso: "Suspenso",
  em_producao: "Em produção", entregue: "Entregue", disputado: "Disputado",
  aprovado: "Aprovado", aceito: "Aceito", cancelado: "Cancelado", concluido: "Concluído",
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("visao_geral");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<any>(null);

  const checkAuth = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: profile } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
    if (profile?.tipo !== "admin") {
      router.push("/");
      return;
    }
    setAuthorized(true);
  }, [router]);

  const loadTab = useCallback(async (t: Tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?tab=${t}`);
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => { if (authorized) loadTab(tab); }, [authorized, tab, loadTab]);

  async function adminAction(body: any) {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    loadTab(tab);
  }

  if (!authorized) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="mt-1 text-sm text-muted">Gestão completa da plataforma FPM</p>
          </div>

          <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
            {([
              ["visao_geral", "Visão Geral"],
              ["usuarios", "Usuários"],
              ["pedidos", "Pedidos"],
              ["financeiro", "Financeiro"],
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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {tab === "visao_geral" && data?.stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Usuários ativos", valor: String(data.stats.totalUsers) },
                      { label: "Pedidos este mês", valor: String(data.stats.ordersThisMonth) },
                      { label: "Volume transacionado", valor: `R$ ${Number(data.stats.volumeThisMonth).toFixed(2).replace(".", ",")}` },
                      { label: "Taxa FPM arrecadada", valor: `R$ ${Number(data.stats.taxaTotal).toFixed(2).replace(".", ",")}` },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xl font-bold">{s.valor}</p>
                        <p className="text-[11px] text-muted">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {data.statusCount && Object.keys(data.statusCount).length > 0 && (
                    <div className="rounded-xl border border-border bg-surface p-5">
                      <h3 className="mb-3 text-sm font-bold">Pedidos por status</h3>
                      <div className="space-y-2">
                        {Object.entries(data.statusCount).map(([status, count]) => {
                          const pct = data.totalOrders > 0 ? (Number(count) / data.totalOrders) * 100 : 0;
                          return (
                            <div key={status} className="flex items-center gap-3">
                              <span className="w-24 text-xs text-muted">{statusLabels[status] || status}</span>
                              <div className="flex-1 overflow-hidden rounded-full bg-background">
                                <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-8 text-right text-xs font-semibold">{String(count)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {data.totalOrders === 0 && (
                    <div className="rounded-xl border border-border bg-surface p-8 text-center">
                      <p className="text-sm text-muted">Nenhum pedido registrado ainda</p>
                      <p className="mt-1 text-xs text-muted">Os dados aparecerão conforme os clientes fizerem pedidos</p>
                    </div>
                  )}
                </div>
              )}

              {tab === "usuarios" && (
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                  {data?.usuarios?.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-muted">Nenhum usuário cadastrado</div>
                  ) : (
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
                          {data?.usuarios?.map((u: any) => (
                            <tr key={u.id} className="border-b border-border last:border-0">
                              <td className="px-4 py-3 font-medium">{u.nome}</td>
                              <td className="px-4 py-3 capitalize text-muted">{u.tipo}</td>
                              <td className="px-4 py-3">{u.tipo === "vendedor" ? u.nivel_vendedor : u.nivel_comprador}</td>
                              <td className="px-4 py-3 text-muted">
                                {u.tipo === "vendedor"
                                  ? `${u.total_vendas} vendas • ${Number(u.nota_media).toFixed(1)}`
                                  : `${u.total_compras} compras`}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[u.status] || ""}`}>
                                  {statusLabels[u.status] || u.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  {u.status === "pendente" && (
                                    <button
                                      onClick={() => adminAction({ action: "update_user_status", userId: u.id, status: "ativo" })}
                                      className="rounded-lg bg-primary px-2 py-1 text-[10px] text-white"
                                    >
                                      Aprovar
                                    </button>
                                  )}
                                  {u.status === "ativo" && u.tipo !== "admin" && (
                                    <button
                                      onClick={() => adminAction({ action: "update_user_status", userId: u.id, status: "suspenso" })}
                                      className="rounded-lg border border-red-200 px-2 py-1 text-[10px] text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                                    >
                                      Suspender
                                    </button>
                                  )}
                                  {u.status === "suspenso" && (
                                    <button
                                      onClick={() => adminAction({ action: "update_user_status", userId: u.id, status: "ativo" })}
                                      className="rounded-lg bg-emerald-500 px-2 py-1 text-[10px] text-white"
                                    >
                                      Reativar
                                    </button>
                                  )}
                                  {u.tipo !== "admin" && (
                                    <button
                                      onClick={() => adminAction({ action: "set_admin", userId: u.id })}
                                      className="rounded-lg border border-border px-2 py-1 text-[10px] hover:bg-background"
                                    >
                                      Tornar Admin
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {tab === "pedidos" && (
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                  {data?.pedidos?.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-muted">Nenhum pedido registrado</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-background text-left text-xs text-muted">
                            <th className="px-4 py-3 font-medium">Código</th>
                            <th className="px-4 py-3 font-medium">Serviço</th>
                            <th className="px-4 py-3 font-medium">Comprador</th>
                            <th className="px-4 py-3 font-medium">Vendedor</th>
                            <th className="px-4 py-3 font-medium">Valor</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.pedidos?.map((p: any) => (
                            <tr key={p.id} className="border-b border-border last:border-0">
                              <td className="px-4 py-3 font-mono text-xs text-muted">#{p.codigo}</td>
                              <td className="max-w-[200px] truncate px-4 py-3 font-medium">{p.titulo}</td>
                              <td className="px-4 py-3 text-muted">{p.comprador?.nome || "—"}</td>
                              <td className="px-4 py-3 text-muted">{p.vendedor?.nome || "—"}</td>
                              <td className="px-4 py-3 font-semibold text-primary">
                                R$ {Number(p.valor_total).toFixed(2).replace(".", ",")}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[p.status] || ""}`}>
                                  {statusLabels[p.status] || p.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  {p.status === "disputado" && (
                                    <>
                                      <button
                                        onClick={() => adminAction({ action: "update_order_status", orderId: p.id, status: "aprovado" })}
                                        className="rounded-lg bg-primary px-2 py-1 text-[10px] text-white"
                                      >
                                        Resolver p/ comprador
                                      </button>
                                      <button
                                        onClick={() => adminAction({ action: "update_order_status", orderId: p.id, status: "cancelado" })}
                                        className="rounded-lg bg-red-500 px-2 py-1 text-[10px] text-white"
                                      >
                                        Cancelar
                                      </button>
                                    </>
                                  )}
                                  {p.status === "pendente" && (
                                    <button
                                      onClick={() => adminAction({ action: "update_order_status", orderId: p.id, status: "cancelado" })}
                                      className="rounded-lg border border-red-200 px-2 py-1 text-[10px] text-red-500"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {tab === "financeiro" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { label: "Receita (taxas)", valor: `R$ ${Number(data?.taxaTotal || 0).toFixed(2).replace(".", ",")}` },
                      { label: "Em escrow (pendente)", valor: `R$ ${Number(data?.escrow || 0).toFixed(2).replace(".", ",")}` },
                      { label: "Saques pendentes", valor: String(data?.saquesPendentes?.length || 0) },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                        <p className="text-xl font-bold">{s.valor}</p>
                        <p className="text-[11px] text-muted">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {data?.saquesPendentes?.length > 0 && (
                    <div className="rounded-xl border border-border bg-surface p-5">
                      <h3 className="mb-4 text-sm font-bold">Saques pendentes</h3>
                      <div className="space-y-3">
                        {data.saquesPendentes.map((s: any) => (
                          <div key={s.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                            <div>
                              <p className="text-sm font-medium">{s.descricao || "Saque"}</p>
                              <p className="text-xs text-muted">{new Date(s.created_at).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <span className="font-semibold text-primary">
                              R$ {Math.abs(Number(s.valor)).toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data?.transacoes?.length > 0 && (
                    <div className="rounded-xl border border-border bg-surface p-5">
                      <h3 className="mb-4 text-sm font-bold">Últimas transações</h3>
                      <div className="space-y-2">
                        {data.transacoes.slice(0, 15).map((t: any) => (
                          <div key={t.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${statusCores[t.status] || "bg-zinc-100 text-zinc-600"}`}>
                                {t.tipo}
                              </span>
                              <span className="text-xs text-muted">{t.descricao || t.tipo}</span>
                            </div>
                            <span className={`text-xs font-bold ${Number(t.valor) > 0 ? "text-primary" : "text-red-500"}`}>
                              {Number(t.valor) > 0 ? "+" : ""}R$ {Math.abs(Number(t.valor)).toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!data?.transacoes || data.transacoes.length === 0) && (
                    <div className="rounded-xl border border-border bg-surface p-8 text-center">
                      <p className="text-sm text-muted">Nenhuma transação registrada</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
