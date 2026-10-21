"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { servicos } from "@/data/servicos";

function PedidoForm() {
  const searchParams = useSearchParams();
  const servicoId = searchParams.get("servico") ?? "1";
  const servico = servicos.find((s) => s.id === servicoId) ?? servicos[0];

  const [quantidade, setQuantidade] = useState(1);
  const [briefing, setBriefing] = useState("");
  const [etapa, setEtapa] = useState<"briefing" | "pagamento" | "confirmado">("briefing");

  const total = servico.preco * quantidade;
  const taxaFpm = total * 0.1;
  const totalFinal = total + taxaFpm;

  if (etapa === "confirmado") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Pedido confirmado!</h1>
        <p className="mt-3 text-sm text-muted">
          Seu pedido #FPM-{Date.now().toString(36).toUpperCase()} foi enviado para {servico.vendedor.nome}.
          Você será notificado quando o vendedor aceitar.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/painel/comprador" className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
            Ver meus pedidos
          </Link>
          <Link href="/catalogo" className="text-sm font-medium text-primary hover:underline">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">
        {etapa === "briefing" ? "Detalhar pedido" : "Pagamento"}
      </h1>

      {/* Steps */}
      <div className="mb-8 flex items-center gap-2">
        {["Briefing", "Pagamento", "Confirmação"].map((step, i) => {
          const active = (etapa === "briefing" && i === 0) || (etapa === "pagamento" && i === 1);
          const done = (etapa === "pagamento" && i === 0);
          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done ? "bg-primary text-white" : active ? "bg-primary text-white" : "bg-border text-muted"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${active || done ? "font-semibold" : "text-muted"}`}>{step}</span>
              {i < 2 && <div className={`h-px flex-1 ${done ? "bg-primary" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {etapa === "briefing" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {servico.vendedor.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{servico.titulo}</p>
                    <p className="text-xs text-muted">por {servico.vendedor.nome}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Quantidade</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-background">-</button>
                  <span className="w-8 text-center text-sm font-semibold">{quantidade}</span>
                  <button onClick={() => setQuantidade(quantidade + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-background">+</button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Briefing do pedido</label>
                <textarea
                  value={briefing}
                  onChange={(e) => setBriefing(e.target.value)}
                  placeholder="Descreva exatamente o que você precisa: produto, tom de voz, duração, formato (vertical/horizontal), se precisa de roteiro, etc."
                  rows={6}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-primary"
                  required
                />
                <p className="mt-1 text-[11px] text-muted">Quanto mais detalhado, melhor o resultado.</p>
              </div>

              <button
                onClick={() => setEtapa("pagamento")}
                disabled={!briefing.trim()}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Continuar para pagamento
              </button>
            </div>
          )}

          {etapa === "pagamento" && (
            <div className="space-y-4">
              <button onClick={() => setEtapa("briefing")} className="mb-2 flex items-center gap-1 text-xs text-muted hover:text-foreground">
                ← Voltar ao briefing
              </button>

              {/* Pix */}
              <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M17.7 6.3c-1.2-1.2-3.1-1.2-4.2 0L12 7.8l-1.5-1.5c-1.2-1.2-3.1-1.2-4.2 0L4.8 7.8c-1.2 1.2-1.2 3.1 0 4.2L12 19.2l7.2-7.2c1.2-1.2 1.2-3.1 0-4.2l-1.5-1.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Pix</p>
                    <p className="text-xs text-muted">Aprovação instantânea</p>
                  </div>
                  <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </div>
              </div>

              {/* Carteira */}
              <div className="rounded-xl border border-border bg-surface p-5 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Créditos FPM</p>
                    <p className="text-xs text-muted">Saldo: R$ 0,00</p>
                  </div>
                </div>
              </div>

              {/* QR Code placeholder */}
              <div className="rounded-xl border border-border bg-surface p-6 text-center">
                <div className="mx-auto mb-3 flex h-40 w-40 items-center justify-center rounded-xl bg-background">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`h-6 w-6 rounded-sm ${Math.random() > 0.4 ? "bg-foreground" : "bg-background"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-semibold">Escaneie o QR Code</p>
                <p className="mt-1 text-xs text-muted">ou copie o código Pix abaixo</p>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    readOnly
                    value="00020126580014br.gov.bcb.pix0136fpm-fazpramim..."
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted"
                  />
                  <button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">
                    Copiar
                  </button>
                </div>
              </div>

              <button
                onClick={() => setEtapa("confirmado")}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
              >
                Já paguei — confirmar pedido
              </button>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-bold">Resumo do pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{servico.titulo.slice(0, 30)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Quantidade</span>
                <span>{quantidade}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Taxa FPM (10%)</span>
                <span>R$ {taxaFpm.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {totalFinal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Pagamento em escrow
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Entrega em {servico.prazoEntrega}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PedidoNovoPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense>
          <PedidoForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
