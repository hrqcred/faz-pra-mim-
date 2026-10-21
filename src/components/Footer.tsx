import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                F
              </span>
              <span className="font-bold">FazPraMim</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              O marketplace de vídeos criativos com ranking justo para quem
              compra e quem vende.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogo" className="text-muted hover:text-foreground">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="text-muted hover:text-foreground">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="#ranking" className="text-muted hover:text-foreground">
                  Ranking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Para vendedores
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted">Criar serviço</span>
              </li>
              <li>
                <span className="text-muted">Encontrar projetos</span>
              </li>
              <li>
                <span className="text-muted">Dicas de gravação</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Suporte
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted">Central de ajuda</span>
              </li>
              <li>
                <span className="text-muted">Termos de uso</span>
              </li>
              <li>
                <span className="text-muted">Privacidade</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          FPM — FazPraMim &copy; 2026. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
