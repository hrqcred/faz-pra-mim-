"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const transacoesFake = [
  { tipo: "deposito", valor: 100, descricao: "Depósito via Pix", data: "20 out 2026" },
  { tipo: "compra", valor: -44, descricao: "Pedido #FPM-A1B2C3 - Vídeo comercial", data: "19 out 2026" },
  { tipo: "deposito", valor: 200, descricao: "Depósito via Pix", data: "15 out 2026" },
  { tipo: "compra", valor: -55, descricao: "Pedido #FPM-D4E5F6 - Depoimento natural", data: "14 out 2026" },
  { tipo: "compra", valor: -44, descricao: "Pedido #FPM-G7H8I9 - UGC criativo", data: "10 out 2026" },
];

const tipoCores: Record<string, string> = {
  deposito: "text-primary bg-primary/10",
  compra: "text-red-500 bg-red-50 dark:bg-red-950/30",
  venda: "text-primary bg-primary/10",
  saque: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
};

const tipoLabels: Record<string, string> = {
  deposito: "Depósito",
  compra: "Compra",
  venda: "Venda",
  saque: "Saque",
};

export default function CarteiraPage() {
  const [valorDeposito, setValorDeposito] = useState("");
  const saldo = 157;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="mb-6 text-2xl font-bold">Carteira FPM</h1>

          {/* Saldo card */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-white shadow-xl shadow-primary/20">
            <p className="text-sm opacity-80">Saldo disponível</p>
            <p className="mt-1 text-4xl font-bold">R$ {saldo.toFixed(2).replace(".", ",")}</p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm hover:bg-white/30">
                Adicionar créditos
              </button>
              <button className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm hover:bg-white/20">
                Sacar
              </button>
            </div>
          </div>

          {/* Quick deposit */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-bold">Adicionar créditos via Pix</h2>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[50, 100, 200].map((v) => (
                <button
                  key={v}
                  onClick={() => setValorDeposito(String(v))}
                  className={`rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                    valorDeposito === String(v)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  R$ {v},00
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">R$</span>
                <input
                  type="number"
                  value={valorDeposito}
                  onChange={(e) => setValorDeposito(e.target.value)}
                  placeholder="Outro valor"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                disabled={!valorDeposito}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Gerar Pix
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div>
            <h2 className="mb-4 text-sm font-bold">Histórico de transações</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              {transacoesFake.map((t, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border px-5 py-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${tipoCores[t.tipo]}`}>
                      {tipoLabels[t.tipo]}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t.descricao}</p>
                      <p className="text-[11px] text-muted">{t.data}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${t.valor > 0 ? "text-primary" : "text-red-500"}`}>
                    {t.valor > 0 ? "+" : ""}R$ {Math.abs(t.valor).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
