"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicoCard } from "@/components/ServicoCard";
import { servicos, categorias, tagsPopulares } from "@/data/servicos";

type Ordenacao = "relevancia" | "preco-asc" | "preco-desc" | "vendas" | "nota";

export default function CatalogoPage() {
  const [categoria, setCategoria] = useState("Todos");
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevancia");
  const [busca, setBusca] = useState("");

  const toggleTag = (tag: string) => {
    setTagsSelecionadas((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resultado = useMemo(() => {
    let filtrados = [...servicos];

    if (categoria !== "Todos") {
      filtrados = filtrados.filter((s) => s.categoria === categoria);
    }

    if (tagsSelecionadas.length > 0) {
      filtrados = filtrados.filter((s) =>
        tagsSelecionadas.some((tag) => s.tags.includes(tag))
      );
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      filtrados = filtrados.filter(
        (s) =>
          s.titulo.toLowerCase().includes(termo) ||
          s.descricao.toLowerCase().includes(termo) ||
          s.vendedor.nome.toLowerCase().includes(termo) ||
          s.tags.some((t) => t.toLowerCase().includes(termo))
      );
    }

    switch (ordenacao) {
      case "preco-asc":
        filtrados.sort((a, b) => a.preco - b.preco);
        break;
      case "preco-desc":
        filtrados.sort((a, b) => b.preco - a.preco);
        break;
      case "vendas":
        filtrados.sort((a, b) => b.vendedor.vendas - a.vendedor.vendas);
        break;
      case "nota":
        filtrados.sort((a, b) => b.vendedor.nota - a.vendedor.nota);
        break;
      default:
        filtrados.sort((a, b) => {
          if (a.destaque && !b.destaque) return -1;
          if (!a.destaque && b.destaque) return 1;
          return b.vendedor.vendas - a.vendedor.vendas;
        });
    }

    return filtrados;
  }, [categoria, tagsSelecionadas, ordenacao, busca]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Catálogo de serviços
            </h1>
            <p className="mt-1 text-sm text-muted">
              {resultado.length} serviço{resultado.length !== 1 && "s"}{" "}
              encontrado{resultado.length !== 1 && "s"}
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por serviço, vendedor ou tag..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          {/* Filters row */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoria(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    categoria === cat
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted outline-none"
            >
              <option value="relevancia">Relevância</option>
              <option value="vendas">Mais vendidos</option>
              <option value="nota">Melhor nota</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
            </select>
          </div>

          {/* Tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            {tagsPopulares.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                  tagsSelecionadas.includes(tag)
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
            {tagsSelecionadas.length > 0 && (
              <button
                onClick={() => setTagsSelecionadas([])}
                className="rounded-full px-3 py-1 text-[11px] font-medium text-red-500 hover:text-red-600"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Grid */}
          {resultado.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resultado.map((s) => (
                <ServicoCard key={s.id} servico={s} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold">
                Nenhum serviço encontrado
              </p>
              <p className="mt-1 text-sm text-muted">
                Tente mudar os filtros ou a busca
              </p>
              <button
                onClick={() => {
                  setCategoria("Todos");
                  setTagsSelecionadas([]);
                  setBusca("");
                }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
