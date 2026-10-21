"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Entrar no FPM</h1>
            <p className="mt-2 text-sm text-muted">
              Acesse sua conta para comprar ou vender
            </p>
          </div>

          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                required
              />
              <div className="mt-1.5 text-right">
                <span className="text-xs text-primary hover:underline cursor-pointer">
                  Esqueceu a senha?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-background"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar com Google
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            Não tem conta?{" "}
            <Link href="/cadastro" className="font-semibold text-primary hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
