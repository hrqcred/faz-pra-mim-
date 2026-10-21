import { notFound } from "next/navigation";
import { servicos } from "@/data/servicos";
import { ServicoDetalheClient } from "./ServicoDetalheClient";

export function generateStaticParams() {
  return servicos.map((s) => ({ id: s.id }));
}

export default async function ServicoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servico = servicos.find((s) => s.id === id);

  if (!servico) notFound();

  return <ServicoDetalheClient servico={servico} />;
}
