"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AvaliarPage() {
  const [notaVendedor, setNotaVendedor] = useState(0);
  const [hoverVendedor, setHoverVendedor] = useState(0);
  const [comentarioVendedor, setComentarioVendedor] = useState("");

  const [notaComprador, setNotaComprador] = useState(0);
  const [hoverComprador, setHoverComprador] = useState(0);
  const [comentarioComprador, setComentarioComprador] = useState("");

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  const StarSelector = ({
    nota,
    hover,
    setNota,
    setHover,
  }: {
    nota: number;
    hover: number;
    setNota: (n: number) => void;
    setHover: (n: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setNota(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 12 12"
            fill="currentColor"
            className={i <= (hover || nota) ? "text-amber-400" : "text-border"}
          >
            <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
          </svg>
        </button>
      ))}
    </div>
  );

  if (enviado) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Avaliações enviadas!</h1>
            <p className="mt-3 text-sm text-muted">
              Obrigado por avaliar. Suas avaliações ajudam a comunidade FPM a crescer com confiança.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Avaliar pedido</h1>
            <p className="mt-2 text-sm text-muted">
              No FPM, ambos os lados avaliam. Isso garante confiança pra todo mundo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Comprador avalia vendedor */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Comprador → Vendedor
                </span>
              </div>
              <h2 className="mb-1 text-sm font-bold">Como foi o trabalho do vendedor?</h2>
              <p className="mb-4 text-xs text-muted">Avalie a qualidade, comunicação e cumprimento do prazo.</p>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-white">
                  IL
                </div>
                <div>
                  <p className="text-sm font-semibold">Igor L.</p>
                  <p className="text-xs text-muted">Vídeo comercial com entrega expressa</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-muted">Sua nota</label>
                <StarSelector nota={notaVendedor} hover={hoverVendedor} setNota={setNotaVendedor} setHover={setHoverVendedor} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Comentário</label>
                <textarea
                  value={comentarioVendedor}
                  onChange={(e) => setComentarioVendedor(e.target.value)}
                  placeholder="Como foi sua experiência com o vendedor?"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Vendedor avalia comprador */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  Vendedor → Comprador
                </span>
              </div>
              <h2 className="mb-1 text-sm font-bold">Como foi trabalhar com o comprador?</h2>
              <p className="mb-4 text-xs text-muted">Avalie clareza do briefing, comunicação e aprovação da entrega.</p>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white">
                  CM
                </div>
                <div>
                  <p className="text-sm font-semibold">Carlos M.</p>
                  <p className="text-xs text-muted">Comprador VIP • 47 compras</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-muted">Sua nota</label>
                <StarSelector nota={notaComprador} hover={hoverComprador} setNota={setNotaComprador} setHover={setHoverComprador} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Comentário</label>
                <textarea
                  value={comentarioComprador}
                  onChange={(e) => setComentarioComprador(e.target.value)}
                  placeholder="Como foi trabalhar com o comprador?"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={notaVendedor === 0 || notaComprador === 0}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-50"
            >
              Enviar avaliações
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
