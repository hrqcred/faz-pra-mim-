"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

type TipoConta = "comprador" | "vendedor";

export default function CadastroPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoConta>("comprador");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, tipo },
      },
    });

    if (error) {
      setErro(error.message === "User already registered"
        ? "Este e-mail já está cadastrado."
        : error.message);
      setLoading(false);
      return;
    }

    router.push("/cadastro/confirmar");
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Criar sua conta</h1>
            <p className="mt-2 text-sm text-muted">
              Comece a comprar ou vender vídeos criativos
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("comprador")}
              className={`rounded-xl border-2 p-4 text-center transition-all ${
                tipo === "comprador"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold">Comprador</p>
              <p className="mt-0.5 text-[11px] text-muted">Quero contratar vídeos</p>
            </button>
            <button
              type="button"
              onClick={() => setTipo("vendedor")}
              className={`rounded-xl border-2 p-4 text-center transition-all ${
                tipo === "vendedor"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <p className="text-sm font-semibold">Vendedor</p>
              <p className="mt-0.5 text-[11px] text-muted">Quero vender meus vídeos</p>
            </button>
          </div>

          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Confirmar senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a senha"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-primary"
                required
                minLength={6}
              />
            </div>

            <label className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                checked={aceitaTermos}
                onChange={(e) => setAceitaTermos(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                required
              />
              <span className="text-xs text-muted">
                Li e aceito os{" "}
                <span className="text-primary underline">Termos de Uso</span> e a{" "}
                <span className="text-primary underline">Política de Privacidade</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Criando conta..." : `Criar conta como ${tipo}`}
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
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
