"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { servicos } from "@/data/servicos";
import { ServicoCard } from "@/components/ServicoCard";

type Ordenacao = "relevancia" | "preco_menor" | "preco_maior" | "nota" | "mais_vendidos" | "novos";

const categorias = ["Todas", "Vídeo Comercial", "Depoimento", "UGC", "VSL", "Narração", "Vídeo Editado"];
const faixasPreco = [
  { label: "Qualquer preço", min: 0, max: Infinity },
  { label: "Até R$ 50", min: 0, max: 50 },
  { label: "R$ 50 - R$ 80", min: 50, max: 80 },
  { label: "R$ 80 - R$ 100", min: 80, max: 100 },
  { label: "Acima de R$ 100", min: 100, max: Infinity },
];
const prazos = ["Qualquer prazo", "Até 2 dias", "Até 3 dias", "Até 5 dias", "Até 7 dias"];
const niveisVendedor = ["Todos", "Novato", "Ativo", "Profissional", "Expert", "Elite"];

function smartSort(servs: typeof servicos, ordenacao: Ordenacao) {
  const arr = [...servs];
  switch (ordenacao) {
    case "preco_menor":
      return arr.sort((a, b) => a.preco - b.preco);
    case "preco_maior":
      return arr.sort((a, b) => b.preco - a.preco);
    case "nota":
      return arr.sort((a, b) => b.vendedor.nota - a.vendedor.nota);
    case "mais_vendidos":
      return arr.sort((a, b) => b.vendedor.vendas - a.vendedor.vendas);
    case "novos":
      return arr.reverse();
    case "relevancia":
    default:
      // Fair discovery: weighted score that gives newer/lower sellers a boost
      return arr.sort((a, b) => {
        const hashA = a.id.split("").reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0);
        const hashB = b.id.split("").reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0);
        const varA = (Math.abs(hashA) % 100) / 100;
        const varB = (Math.abs(hashB) % 100) / 100;
        const scoreA = a.vendedor.nota * 0.4 + (1 / (a.vendedor.vendas + 1)) * 100 * 0.3 + varA * 0.3;
        const scoreB = b.vendedor.nota * 0.4 + (1 / (b.vendedor.vendas + 1)) * 100 * 0.3 + varB * 0.3;
        return scoreB - scoreA;
      });
  }
}

export default function ExplorarPage() {
  const [categoria, setCategoria] = useState("Todas");
  const [faixaPreco, setFaixaPreco] = useState(0);
  const [prazo, setPrazo] = useState("Qualquer prazo");
  const [nivelVendedor, setNivelVendedor] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevancia");
  const [busca, setBusca] = useState("");
  const [showFiltros, setShowFiltros] = useState(false);

  const resultados = useMemo(() => {
    let filtrados = [...servicos];

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      filtrados = filtrados.filter(
        (s) =>
          s.titulo.toLowerCase().includes(termo) ||
          s.descricao.toLowerCase().includes(termo) ||
          s.vendedor.nome.toLowerCase().includes(termo) ||
          s.categoria.toLowerCase().includes(termo)
      );
    }

    if (categoria !== "Todas") {
      filtrados = filtrados.filter((s) => s.categoria === categoria);
    }

    const faixa = faixasPreco[faixaPreco];
    filtrados = filtrados.filter((s) => s.preco >= faixa.min && s.preco <= faixa.max);

    if (prazo !== "Qualquer prazo") {
      const dias = parseInt(prazo.replace(/\D/g, ""));
      filtrados = filtrados.filter((s) => {
        const d = parseInt(s.prazoEntrega.replace(/\D/g, ""));
        return d <= dias;
      });
    }

    if (nivelVendedor !== "Todos") {
      filtrados = filtrados.filter((s) => s.vendedor.nivel === nivelVendedor);
    }

    return smartSort(filtrados, ordenacao);
  }, [categoria, faixaPreco, prazo, nivelVendedor, ordenacao, busca]);

  const filtrosAtivos = [
    categoria !== "Todas" ? categoria : null,
    faixaPreco !== 0 ? faixasPreco[faixaPreco].label : null,
    prazo !== "Qualquer prazo" ? prazo : null,
    nivelVendedor !== "Todos" ? nivelVendedor : null,
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Explorar serviços</h1>
            <p className="mt-1 text-sm text-muted">Descoberta inteligente — todos os vendedores têm chance</p>
          </div>

          {/* Search bar */}
          <div className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por serviço, categoria ou vendedor..."
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                showFiltros || filtrosAtivos.length > 0
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-background"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filtros
              {filtrosAtivos.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {filtrosAtivos.length}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          {showFiltros && (
            <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {categorias.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted">Faixa de preço</label>
                  <select
                    value={faixaPreco}
                    onChange={(e) => setFaixaPreco(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {faixasPreco.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted">Prazo de entrega</label>
                  <select
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {prazos.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted">Nível do vendedor</label>
                  <select
                    value={nivelVendedor}
                    onChange={(e) => setNivelVendedor(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    {niveisVendedor.map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              {filtrosAtivos.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {filtrosAtivos.map((f) => (
                    <span key={f} className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                      {f}
                    </span>
                  ))}
                  <button
                    onClick={() => { setCategoria("Todas"); setFaixaPreco(0); setPrazo("Qualquer prazo"); setNivelVendedor("Todos"); }}
                    className="text-[10px] font-medium text-muted hover:text-foreground"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sort + results count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted">{resultados.length} serviços encontrados</p>
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="relevancia">Relevância (justo)</option>
              <option value="nota">Melhor avaliação</option>
              <option value="mais_vendidos">Mais vendidos</option>
              <option value="preco_menor">Menor preço</option>
              <option value="preco_maior">Maior preço</option>
              <option value="novos">Mais recentes</option>
            </select>
          </div>

          {/* Results grid */}
          {resultados.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resultados.map((s) => (
                <ServicoCard key={s.id} servico={s} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold">Nenhum serviço encontrado</p>
              <p className="mt-1 text-sm text-muted">Tente ajustar os filtros ou buscar por outro termo.</p>
            </div>
          )}

          {/* Fair discovery explanation */}
          <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-2 text-base font-bold">Como funciona a descoberta inteligente</h2>
            <p className="text-sm leading-relaxed text-muted">
              Diferente de outras plataformas que favorecem sempre os mesmos vendedores no topo, o algoritmo da FPM
              usa um sistema de <strong className="text-foreground">descoberta justa</strong>. A ordenação por relevância
              combina nota, histórico e um fator de rotatividade que garante que vendedores novos também apareçam.
              Isso significa mais oportunidades para quem está começando e mais variedade para quem compra.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Qualidade", desc: "40% — nota e avaliações", icone: "⭐" },
                { label: "Oportunidade", desc: "30% — boost para novatos", icone: "🚀" },
                { label: "Variação", desc: "30% — rotatividade natural", icone: "🔄" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl bg-background p-3 text-center">
                  <span className="text-xl">{f.icone}</span>
                  <p className="mt-1 text-xs font-bold">{f.label}</p>
                  <p className="text-[10px] text-muted">{f.desc}</p>
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
