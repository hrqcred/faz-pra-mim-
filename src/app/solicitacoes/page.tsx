"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const categorias = ["Todas", "Vídeo Comercial", "Depoimento", "UGC", "VSL", "Narração", "Vídeo Editado"];

const solicitacoesFake = [
  {
    id: "SOL-001",
    titulo: "Vídeo comercial para suplemento pré-treino",
    descricao: "Preciso de um criativo de 30s mostrando o produto em uso. Tom energético, fundo de academia. Vertical para Instagram Reels.",
    categoria: "Vídeo Comercial",
    orcamento: 60,
    comprador: { nome: "Carlos M.", nivel: "VIP", avatar: "CM" },
    candidaturas: 4,
    prazo: "3 dias",
    data: "21 out 2026",
  },
  {
    id: "SOL-002",
    titulo: "Depoimento feminino para curso de inglês",
    descricao: "Depoimento natural de 45-60s contando como o curso ajudou na carreira. Precisa parecer genuíno, sem roteiro rígido.",
    categoria: "Depoimento",
    orcamento: 50,
    comprador: { nome: "Amanda R.", nivel: "Premium", avatar: "AR" },
    candidaturas: 7,
    prazo: "5 dias",
    data: "20 out 2026",
  },
  {
    id: "SOL-003",
    titulo: "UGC unboxing para skincare coreano",
    descricao: "Vídeo unboxing de kit skincare. Mostrar embalagem, primeiras impressões, textura dos produtos. Luz natural, estilo clean.",
    categoria: "UGC",
    orcamento: 40,
    comprador: { nome: "Fernanda P.", nivel: "Frequente", avatar: "FP" },
    candidaturas: 2,
    prazo: "4 dias",
    data: "19 out 2026",
  },
  {
    id: "SOL-004",
    titulo: "Narração masculina para VSL de finanças",
    descricao: "Narração profissional para VSL de 3 minutos. Tom confiante e didático. Roteiro será fornecido. Entrega em áudio WAV.",
    categoria: "Narração",
    orcamento: 80,
    comprador: { nome: "Rafael D.", nivel: "VIP", avatar: "RD" },
    candidaturas: 5,
    prazo: "2 dias",
    data: "18 out 2026",
  },
  {
    id: "SOL-005",
    titulo: "Edição de vídeo longo para YouTube",
    descricao: "Editar vídeo bruto de 40 min para formato final de ~15 min. Cortes dinâmicos, legendas, transições, trilha. Referência: canal Primo Rico.",
    categoria: "Vídeo Editado",
    orcamento: 120,
    comprador: { nome: "Lucas B.", nivel: "Novo", avatar: "LB" },
    candidaturas: 9,
    prazo: "7 dias",
    data: "17 out 2026",
  },
];

const nivelCores: Record<string, string> = {
  Novo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Frequente: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  VIP: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Premium: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

const avatarGradients = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-blue-400 to-indigo-600",
  "from-cyan-400 to-teal-600",
  "from-emerald-400 to-green-600",
  "from-amber-400 to-orange-600",
];

function avatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export default function SolicitacoesPage() {
  const [catFiltro, setCatFiltro] = useState("Todas");

  const filtradas = catFiltro === "Todas"
    ? solicitacoesFake
    : solicitacoesFake.filter((s) => s.categoria === catFiltro);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Feed de Solicitações</h1>
              <p className="mt-1 text-sm text-muted">Compradores postam o que precisam — vendedores se candidatam</p>
            </div>
            <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20">
              + Nova solicitação
            </button>
          </div>

          {/* Category filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCatFiltro(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  catFiltro === c ? "bg-primary text-white" : "bg-surface border border-border text-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Requests */}
          <div className="space-y-4">
            {filtradas.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {s.categoria}
                      </span>
                      <span className="text-[10px] text-muted">{s.data}</span>
                    </div>

                    <h2 className="text-base font-bold">{s.titulo}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.descricao}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(s.comprador.nome)} text-[8px] font-bold text-white`}>
                          {s.comprador.avatar}
                        </div>
                        <span className="text-xs font-medium">{s.comprador.nome}</span>
                        <span className={`rounded-md px-1 py-0.5 text-[9px] font-semibold ${nivelCores[s.comprador.nivel]}`}>
                          {s.comprador.nivel}
                        </span>
                      </div>
                      <span className="text-xs text-muted">Prazo: {s.prazo}</span>
                      <span className="text-xs text-muted">{s.candidaturas} candidaturas</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted">Orçamento</p>
                      <p className="text-xl font-bold text-primary">R$ {s.orcamento},00</p>
                    </div>
                    <Link
                      href={`/solicitacoes/${s.id}`}
                      className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-md shadow-primary/20"
                    >
                      Me candidatar
                    </Link>
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
