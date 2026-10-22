import type { Servico } from "@/data/servicos";
import Link from "next/link";

const nivelCores: Record<string, string> = {
  Novato: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Ativo: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  Profissional:
    "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  Expert:
    "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Elite:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

const avatarGradients = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-blue-400 to-indigo-600",
  "from-cyan-400 to-teal-600",
  "from-emerald-400 to-green-600",
  "from-amber-400 to-orange-600",
  "from-red-400 to-rose-600",
  "from-fuchsia-400 to-pink-600",
  "from-sky-400 to-blue-600",
  "from-lime-400 to-emerald-600",
];

function avatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export function ServicoCard({ servico }: { servico: Servico }) {
  return (
    <Link
      href={`/catalogo/${servico.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:shadow-lg hover:border-primary/30"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        {servico.capaImg ? (
          <img
            src={servico.capaImg}
            alt={servico.titulo}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="text-center">
              {servico.vendedor.fotoUrl ? (
                <img
                  src={servico.vendedor.fotoUrl}
                  alt={servico.vendedor.nome}
                  className="mx-auto mb-2 h-16 w-16 rounded-full object-cover shadow-lg"
                  loading="lazy"
                />
              ) : (
                <div className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(servico.vendedor.nome)} text-xl font-bold text-white shadow-lg`}>
                  {servico.vendedor.avatar}
                </div>
              )}
              <p className="text-xs font-medium text-foreground">{servico.vendedor.nome}</p>
            </div>
          </div>
        )}
        {servico.destaque && (
          <span className="absolute right-3 top-3 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Destaque
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
          {servico.vendedor.fotoUrl ? (
            <img src={servico.vendedor.fotoUrl} alt="" className="h-5 w-5 rounded-full object-cover" loading="lazy" />
          ) : (
            <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(servico.vendedor.nome)} text-[8px] font-bold text-white`}>
              {servico.vendedor.avatar}
            </div>
          )}
          <span className="text-[11px] font-medium text-white">{servico.vendedor.nome}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {servico.titulo}
        </h3>

        <div className="mb-3 flex items-center gap-2">
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
              nivelCores[servico.vendedor.nivel]
            }`}
          >
            {servico.vendedor.nivel}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-muted">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              className="text-amber-400"
            >
              <path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.2L6 9.4 2.4 11.3l.7-4.2L0 4.2l4.2-.6z" />
            </svg>
            {servico.vendedor.nota.toFixed(1)}
          </span>
          <span className="text-xs text-muted">
            {servico.vendedor.vendas.toLocaleString("pt-BR")} vendas
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {servico.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background px-2 py-0.5 text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              A partir de
            </p>
            <p className="text-lg font-bold text-primary">
              R$ {servico.preco.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <p className="rounded-md bg-background px-2 py-1 text-xs text-muted">
            {servico.prazoEntrega}
          </p>
        </div>
      </div>
    </Link>
  );
}
