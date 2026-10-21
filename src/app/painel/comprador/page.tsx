"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type StatusPedido = "todos" | "pendente" | "em_producao" | "entregue" | "aprovado";

const statusCores: Record<string, string> = {
  pendente: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  aceito: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  em_producao: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  entregue: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400",
  aprovado: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  aceito: "Aceito",
  em_producao: "Em produção",
  entregue: "Entregue",
  aprovado: "Aprovado",
};

const pedidosFake = [
  { id: "FPM-A1B2", servico: "Vídeo comercial com entrega expressa", vendedor: "Igor L.", valor: 44, status: "em_producao", data: "20 out 2026" },
  { id: "FPM-C3D4", servico: "Depoimento natural para infoproduto", vendedor: "Monique F.", valor: 55, status: "entregue", data: "18 out 2026" },
  { id: "FPM-E5F6", servico: "UGC criativo com cenário clean", vendedor: "Jonathan A.", valor: 44, status: "aprovado", data: "15 out 2026" },
  { id: "FPM-G7H8", servico: "Narração profissional para VSL", vendedor: "Camila R.", valor: 60, status: "pendente", data: "12 out 2026" },
  { id: "FPM-I9J0", servico: "Vídeo com cenário profissional", vendedor: "Brunna L.", valor: 80, status: "aprovado", data: "8 out 2026" },
];

export default function PainelCompradorPage() {
  const [filtro, setFiltro] = useState<StatusPedido>("todos");

  const pedidosFiltrados = filtro === "todos"
    ? pedidosFake
    : pedidosFake.filter((p) => p.status === filtro);

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
              Saldo: R$ 157,00
            </Link>
          </div>

          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total de pedidos", valor: "5" },
              { label: "Em andamento", valor: "2" },
              { label: "Aguardando aprovação", valor: "1" },
              { label: "Total gasto", valor: "R$ 283" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xl font-bold">{s.valor}</p>
                <p className="text-[11px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {(["todos", "pendente", "em_producao", "entregue", "aprovado"] as const).map((s) => (
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
          <div className="space-y-3">
            {pedidosFiltrados.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted">#{p.id}</span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold">{p.servico}</p>
                    <p className="mt-0.5 text-xs text-muted">por {p.vendedor} • {p.data}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      R$ {p.valor.toFixed(2).replace(".", ",")}
                    </span>
                    {p.status === "entregue" && (
                      <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">
                        Aprovar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
