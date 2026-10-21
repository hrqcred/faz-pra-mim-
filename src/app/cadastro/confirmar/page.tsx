import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ConfirmarPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Verifique seu e-mail</h1>
          <p className="mt-3 text-sm text-muted">
            Enviamos um link de confirmação para o seu e-mail.
            Clique no link para ativar sua conta.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Ir para login
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
