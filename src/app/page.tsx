import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicoCard } from "@/components/ServicoCard";
import { servicos } from "@/data/servicos";

const destaques = servicos.filter((s) => s.destaque).slice(0, 4);

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Nova plataforma no ar
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Vídeos que{" "}
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  vendem
                </span>
                , feitos
                <br />
                pra você.
              </h1>
              <p className="mb-8 text-lg text-muted sm:text-xl">
                Criativos, VSLs e depoimentos em vídeo com entrega rápida.
                <br className="hidden sm:block" />O marketplace onde quem compra
                e quem vende tem valor.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/catalogo"
                  className="w-full rounded-xl bg-primary px-8 py-3.5 text-center font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                >
                  Ver serviços disponíveis
                </Link>
                <Link
                  href="#como-funciona"
                  className="w-full rounded-xl border border-border px-8 py-3.5 text-center font-semibold transition-colors hover:bg-surface sm:w-auto"
                >
                  Como funciona
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold sm:text-3xl">20+</p>
                <p className="text-xs text-muted sm:text-sm">
                  Serviços disponíveis
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold sm:text-3xl">24h</p>
                <p className="text-xs text-muted sm:text-sm">
                  Entrega mais rápida
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold sm:text-3xl">100%</p>
                <p className="text-xs text-muted sm:text-sm">
                  Pagamento protegido
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Destaques */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Em destaque</h2>
              <p className="mt-1 text-sm text-muted">
                Os serviços mais procurados da plataforma
              </p>
            </div>
            <Link
              href="/catalogo"
              className="hidden text-sm font-medium text-primary hover:underline sm:block"
            >
              Ver todos &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destaques.map((s) => (
              <ServicoCard key={s.id} servico={s} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/catalogo"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos os serviços &rarr;
            </Link>
          </div>
        </section>

        {/* Como funciona */}
        <section
          id="como-funciona"
          className="border-y border-border bg-surface"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Como funciona
            </h2>
            <p className="mb-12 text-center text-sm text-muted">
              Simples, rápido e seguro para os dois lados
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Escolha o serviço",
                  desc: "Navegue pelo catálogo, filtre por categoria, preço, tags e prazo de entrega.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  ),
                },
                {
                  step: "02",
                  title: "Faça o pedido",
                  desc: "Envie os detalhes do que precisa. Converse com o vendedor pelo chat.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  ),
                },
                {
                  step: "03",
                  title: "Receba o vídeo",
                  desc: "O vendedor entrega no prazo combinado. Você aprova ou pede revisão.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  ),
                },
                {
                  step: "04",
                  title: "Avalie dos dois lados",
                  desc: "Comprador avalia vendedor E vendedor avalia comprador. Ranking justo.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl bg-background p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-primary"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <p className="mb-1 font-mono text-xs text-muted">
                    {item.step}
                  </p>
                  <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ranking */}
        <section id="ranking" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Ranking que funciona dos dois lados
          </h2>
          <p className="mb-12 text-center text-sm text-muted">
            Diferente de outras plataformas, aqui comprador e vendedor têm
            reputação
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                Ranking do Vendedor
              </h3>
              <div className="space-y-3">
                {[
                  {
                    nivel: "Novato",
                    req: "0–5 vendas",
                    cor: "bg-zinc-200 dark:bg-zinc-700",
                  },
                  {
                    nivel: "Ativo",
                    req: "6–30 vendas + nota ≥4.5",
                    cor: "bg-blue-200 dark:bg-blue-800",
                  },
                  {
                    nivel: "Profissional",
                    req: "31–100 vendas + nota ≥4.7",
                    cor: "bg-purple-200 dark:bg-purple-800",
                  },
                  {
                    nivel: "Expert",
                    req: "101–500 vendas + nota ≥4.8",
                    cor: "bg-amber-200 dark:bg-amber-800",
                  },
                  {
                    nivel: "Elite",
                    req: "500+ vendas + nota ≥4.9 + 95% entrega no prazo",
                    cor: "bg-emerald-200 dark:bg-emerald-800",
                  },
                ].map((item) => (
                  <div
                    key={item.nivel}
                    className="flex items-center gap-3 rounded-lg bg-surface p-3"
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${item.cor}`}
                    />
                    <span className="w-24 text-sm font-semibold">
                      {item.nivel}
                    </span>
                    <span className="text-xs text-muted">{item.req}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
                Ranking do Comprador
              </h3>
              <div className="space-y-3">
                {[
                  {
                    nivel: "Novo",
                    req: "0–2 compras",
                    cor: "bg-zinc-200 dark:bg-zinc-700",
                  },
                  {
                    nivel: "Frequente",
                    req: "3–15 compras + avalia ≥80%",
                    cor: "bg-sky-200 dark:bg-sky-800",
                  },
                  {
                    nivel: "VIP",
                    req: "16–50 compras + avalia ≥90%",
                    cor: "bg-amber-200 dark:bg-amber-800",
                  },
                  {
                    nivel: "Premium",
                    req: "50+ compras + avalia 100% + ticket médio alto",
                    cor: "bg-rose-200 dark:bg-rose-800",
                  },
                ].map((item) => (
                  <div
                    key={item.nivel}
                    className="flex items-center gap-3 rounded-lg bg-surface p-3"
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${item.cor}`}
                    />
                    <span className="w-24 text-sm font-semibold">
                      {item.nivel}
                    </span>
                    <span className="text-xs text-muted">{item.req}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-accent/10 p-3">
                <p className="text-xs text-muted">
                  <strong className="text-foreground">
                    Comprador Premium
                  </strong>{" "}
                  ganha selo exclusivo, prioridade no atendimento e descontos
                  em serviços selecionados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
              Pronto pra começar?
            </h2>
            <p className="mb-8 text-muted">
              Encontre o vídeo perfeito para sua campanha ou comece a vender
              seus criativos.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/catalogo"
                className="w-full rounded-xl bg-primary px-8 py-3.5 text-center font-semibold text-white shadow-lg shadow-primary/20 sm:w-auto"
              >
                Quero comprar um vídeo
              </Link>
              <Link
                href="#"
                className="w-full rounded-xl border border-border px-8 py-3.5 text-center font-semibold sm:w-auto"
              >
                Quero vender meus vídeos
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
