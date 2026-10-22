"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const tipoCores: Record<string, string> = {
  deposito: "text-primary bg-primary/10",
  compra: "text-red-500 bg-red-50 dark:bg-red-950/30",
  venda: "text-primary bg-primary/10",
  saque: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  taxa: "text-zinc-500 bg-zinc-50 dark:bg-zinc-800",
  reembolso: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
};

const tipoLabels: Record<string, string> = {
  deposito: "Depósito",
  compra: "Compra",
  venda: "Venda",
  saque: "Saque",
  taxa: "Taxa",
  reembolso: "Reembolso",
};

export default function CarteiraPage() {
  const router = useRouter();
  const [saldo, setSaldo] = useState<number>(0);
  const [saldoPendente, setSaldoPendente] = useState<number>(0);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [valorDeposito, setValorDeposito] = useState("");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [walletRes, txRes] = await Promise.all([
        supabase!.from("wallets").select("saldo, saldo_pendente").eq("user_id", user.id).single(),
        supabase!.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);

      if (walletRes.data) {
        setSaldo(Number(walletRes.data.saldo));
        setSaldoPendente(Number(walletRes.data.saldo_pendente));
      }
      if (txRes.data) setTransacoes(txRes.data);
      setLoading(false);
    }

    load();
  }, [router]);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="mb-6 text-2xl font-bold">Carteira FPM</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Saldo card */}
              <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-white shadow-xl shadow-primary/20">
                <p className="text-sm opacity-80">Saldo disponível</p>
                <p className="mt-1 text-4xl font-bold">R$ {saldo.toFixed(2).replace(".", ",")}</p>
                {saldoPendente > 0 && (
                  <p className="mt-1 text-sm opacity-70">
                    + R$ {saldoPendente.toFixed(2).replace(".", ",")} pendente
                  </p>
                )}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => document.getElementById("deposito-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm hover:bg-white/30"
                  >
                    Adicionar créditos
                  </button>
                </div>
              </div>

              {/* Quick deposit */}
              <div id="deposito-section" className="mb-8 rounded-2xl border border-border bg-surface p-5">
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
                    disabled={!valorDeposito || Number(valorDeposito) < 5}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    Gerar Pix
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-muted">Valor mínimo: R$ 5,00. O crédito é adicionado automaticamente após confirmação do pagamento.</p>
              </div>

              {/* Transactions */}
              <div>
                <h2 className="mb-4 text-sm font-bold">Histórico de transações</h2>
                {transacoes.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-surface py-12 text-center">
                    <p className="text-sm text-muted">Nenhuma transação ainda</p>
                    <p className="mt-1 text-xs text-muted">Adicione créditos para começar a comprar</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {transacoes.map((t) => (
                      <div key={t.id} className="flex items-center justify-between border-b border-border px-5 py-4 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${tipoCores[t.tipo] || "bg-zinc-100 text-zinc-600"}`}>
                            {tipoLabels[t.tipo] || t.tipo}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{t.descricao || tipoLabels[t.tipo]}</p>
                            <p className="text-[11px] text-muted">{formatDate(t.created_at)}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${Number(t.valor) > 0 ? "text-primary" : "text-red-500"}`}>
                          {Number(t.valor) > 0 ? "+" : ""}R$ {Math.abs(Number(t.valor)).toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
