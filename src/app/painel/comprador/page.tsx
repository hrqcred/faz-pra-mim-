"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

type StatusPedido = "todos" | "pendente" | "aceito" | "em_producao" | "entregue" | "aprovado";

const statusCores: Record<string, string> = {
  pendente: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  aceito: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  em_producao: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  entregue: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400",
  aprovado: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  disputado: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  cancelado: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  aceito: "Aceito",
  em_producao: "Em produção",
  entregue: "Entregue",
  aprovado: "Aprovado",
  disputado: "Em disputa",
  cancelado: "Cancelado",
};

export default function PainelCompradorPage() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<StatusPedido>("todos");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [ordersRes, walletRes] = await Promise.all([
        supabase!.from("orders").select("*, vendedor:vendedor_id(nome)").eq("comprador_id", user.id).order("created_at", { ascending: false }),
        supabase!.from("wallets").select("saldo").eq("user_id", user.id).single(),
      ]);

      if (ordersRes.data) setPedidos(ordersRes.data);
      if (walletRes.data) setSaldo(Number(walletRes.data.saldo));
      setLoading(false);
    }

    load();
  }, [router]);

  const pedidosFiltrados = filtro === "todos"
    ? pedidos
    : pedidos.filter((p) => p.status === filtro);

  const stats = {
    total: pedidos.length,
    andamento: pedidos.filter((p) => ["pendente", "aceito", "em_producao"].includes(p.status)).length,
    aprovacao: pedidos.filter((p) => p.status === "entregue").length,
    gasto: pedidos.reduce((sum, p) => sum + Number(p.valor_total || 0), 0),
  };

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Meus pedidos</h1>
              <p className="mt-1 text-sm text-muted">Acompanhe seus pedidos em tempo real</p>
            </div>
            <Link href="/carteira" className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-background">
              Saldo: R$ {saldo.toFixed(2).replace(".", ",")}
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Total de pedidos", valor: String(stats.total) },
                  { label: "Em andamento", valor: String(stats.andamento) },
                  { label: "Aguardando aprovação", valor: String(stats.aprovacao) },
                  { label: "Total gasto", valor: `R$ ${stats.gasto.toFixed(2).replace(".", ",")}` },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-xl font-bold">{s.valor}</p>
                    <p className="text-[11px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="mb-4 flex flex-wrap gap-2">
                {(["todos", "pendente", "aceito", "em_producao", "entregue", "aprovado"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFiltro(s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      filtro === s ? "bg-primary text-white" : "bg-surface border border-border text-muted"
                    }`}
                  >
                    {s === "todos" ? "Todos" : statusLabels[s]}
                  </button>
                ))}
              </div>

              {/* Orders list */}
              {pedidosFiltrados.length === 0 ? (
                <div className="rounded-xl border border-border bg-surface py-12 text-center">
                  <p className="text-sm text-muted">
                    {pedidos.length === 0 ? "Você ainda não fez nenhum pedido" : "Nenhum pedido com esse filtro"}
                  </p>
                  {pedidos.length === 0 && (
                    <Link href="/catalogo" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
                      Explorar catálogo
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {pedidosFiltrados.map((p) => (
                    <div key={p.id} className="rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/30">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted">#{p.codigo}</span>
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[p.status] || ""}`}>
                              {statusLabels[p.status] || p.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-semibold">{p.titulo}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            por {p.vendedor?.nome || "Vendedor"} • {formatDate(p.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-primary">
                            R$ {Number(p.valor_total).toFixed(2).replace(".", ",")}
                          </span>
                          {p.status === "entregue" && (
                            <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">
                              Aprovar
                            </button>
                          )}
                          <Link
                            href={`/mensagens`}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-background"
                          >
                            Chat
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
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
