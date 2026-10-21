import { notFound } from "next/navigation";
import { servicos } from "@/data/servicos";
import { VendedorPerfilClient } from "./VendedorPerfilClient";

const vendedoresUnicos = Array.from(
  new Map(servicos.map((s) => [s.vendedor.nome, s.vendedor])).values()
);

export function generateStaticParams() {
  return vendedoresUnicos.map((_, i) => ({ id: String(i + 1) }));
}

export default async function VendedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = parseInt(id) - 1;
  const vendedor = vendedoresUnicos[idx];

  if (!vendedor) notFound();

  const servicosDoVendedor = servicos.filter((s) => s.vendedor.nome === vendedor.nome);

  return <VendedorPerfilClient vendedor={vendedor} servicos={servicosDoVendedor} vendedorId={id} />;
}
