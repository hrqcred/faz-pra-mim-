"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const statusCores: Record<string, string> = {
  pendente: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  aceito: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  em_producao: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  entregue: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400",
  aprovado: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
};

const statusLabels: Record<string, string> = {
  pendente: "Novo pedido",
  aceito: "Aceito",
  em_producao: "Em produção",
  entregue: "Entregue",
  aprovado: "Aprovado",
};

const pedidosFake = [
  { id: "FPM-K1L2", comprador: "Carlos M.", nivelComprador: "VIP", servico: "Vídeo comercial com entrega expressa", valor: 44, status: "pendente", data: "21 out 2026", briefing: "Preciso de um vídeo de 30s para anúncio de suplemento..." },
  { id: "FPM-M3N4", comprador: "Amanda R.", nivelComprador: "Premium", servico: "Depoimento pessoal", valor: 55, status: "em_producao", data: "19 out 2026", briefing: "Depoimento natural sobre curso de marketing..." },
  { id: "FPM-O5P6", comprador: "Felipe T.", nivelComprador: "VIP", servico: "UGC criativo", valor: 44, status: "entregue", data: "17 out 2026", briefing: "Vídeo unboxing de skincare..." },
  { id: "FPM-Q7R8", comprador: "Juliana S.", nivelComprador: "Frequente", servico: "Vídeo comercial", valor: 44, status: "aprovado", data: "14 out 2026", briefing: "Criativo para loja de roupas..." },
];

const nivelCompradorCores: Record<string, string> = {
  Novo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Frequente: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  VIP: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Premium: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

export default function PainelVendedorPage() {
  const [filtro, setFiltro] = useState("todos");
  const saldoDisponivel = 342;
  const saldoPendente = 99;

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
              <h1 className="text-2xl font-bold">Painel do vendedor</h1>
              <p className="mt-1 text-sm text-muted">Gerencie seus pedidos e ganhos</p>
            </div>
            <Link href="/carteira" className="flex items-center gap-3 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-background">
              <span>Disponível: <strong className="text-primary">R$ {saldoDisponivel},00</strong></span>
              <span className="text-muted">|</span>
              <span>Pendente: <strong className="text-amber-500">R$ {saldoPendente},00</strong></span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pedidos este mês", valor: "12" },
              { label: "Faturamento", valor: "R$ 540" },
              { label: "Nota média", valor: "4.95" },
              { label: "Taxa de entrega", valor: "97%" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xl font-bold">{s.valor}</p>
                <p className="text-[11px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {["todos", "pendente", "em_producao", "entregue", "aprovado"].map((s) => (
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

          {/* Orders */}
          <div className="space-y-3">
            {pedidosFiltrados.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted">#{p.id}</span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusCores[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold">{p.servico}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-muted">Comprador: {p.comprador}</span>
                      <span className={`rounded-md px-1 py-0.5 text-[9px] font-semibold ${nivelCompradorCores[p.nivelComprador]}`}>
                        {p.nivelComprador}
                      </span>
                    </div>
                    {p.status === "pendente" && (
                      <div className="mt-2 rounded-lg bg-background p-3 text-xs text-muted">
                        <span className="font-semibold text-foreground">Briefing:</span> {p.briefing}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      R$ {p.valor.toFixed(2).replace(".", ",")}
                    </span>
                    {p.status === "pendente" && (
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">
                          Aceitar
                        </button>
                        <button className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted hover:bg-background">
                          Recusar
                        </button>
                      </div>
                    )}
                    {p.status === "em_producao" && (
                      <button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">
                        Entregar
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
