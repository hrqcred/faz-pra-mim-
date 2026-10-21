import { Suspense } from "react";
import { CompradorPerfilClient } from "./CompradorPerfilClient";

async function CompradorContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompradorPerfilClient compradorId={id} />;
}

export default function CompradorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <CompradorContent params={params} />
    </Suspense>
  );
}
