"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  nome: string;
  tipo: string;
  bio: string | null;
  avatar_url: string | null;
  nivel_vendedor: string;
  nivel_comprador: string;
  nota_media: number;
  total_vendas: number;
  total_compras: number;
  cpf: string | null;
  pix_tipo: string | null;
  pix_chave: string | null;
  created_at: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [cpf, setCpf] = useState("");
  const [pixTipo, setPixTipo] = useState("");
  const [pixChave, setPixChave] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setEmail(user.email || "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (prof) {
        setProfile(prof);
        setNome(prof.nome);
        setBio(prof.bio || "");
        setCpf(prof.cpf || "");
        setPixTipo(prof.pix_tipo || "");
        setPixChave(prof.pix_chave || "");
      }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("saldo")
        .eq("user_id", user.id)
        .single();

      if (wallet) setSaldo(wallet.saldo);
      setLoading(false);
    });
  }, [router]);

  const handleSave = async () => {
    const supabase = createClient();
    if (!supabase || !profile) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        nome,
        bio: bio || null,
        cpf: cpf || null,
        pix_tipo: pixTipo || null,
        pix_chave: pixChave || null,
      })
      .eq("id", profile.id);

    if (error) {
      setMensagem("Erro ao salvar. Tente novamente.");
    } else {
      setProfile({ ...profile, nome, bio, cpf, pix_tipo: pixTipo, pix_chave: pixChave });
      setMensagem("Perfil atualizado!");
      setEditando(false);
    }
    setSaving(false);
    setTimeout(() => setMensagem(""), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createClient();
    if (!supabase || !profile) return;

    const ext = file.name.split(".").pop();
    const filePath = `avatars/${profile.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMensagem("Erro ao enviar foto. Tente novamente.");
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", profile.id);

    setProfile({ ...profile, avatar_url: urlData.publicUrl + "?t=" + Date.now() });
    setMensagem("Foto atualizada!");
    setTimeout(() => setMensagem(""), 3000);
  };

  const nivelLabel = profile?.tipo === "vendedor" ? profile.nivel_vendedor : profile?.nivel_comprador;
  const nivelCores: Record<string, string> = {
    Novato: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    Novo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    Ativo: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    Frequente: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    Profissional: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    VIP: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    Expert: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    Premium: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    Elite: "bg-primary/10 text-primary",
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted text-sm">Carregando perfil...</p>
        </main>
        <Footer />
      </>
    );
  }

  const initials = profile?.nome
    ? profile.nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          {mensagem && (
            <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              mensagem.includes("Erro")
                ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                : "bg-primary/10 text-primary"
            }`}>
              {mensagem}
            </div>
          )}

          {/* Profile card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="relative group">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.nome}
                    className="h-24 w-24 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary border-2 border-border">
                    {initials}
                  </div>
                )}
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                {editando ? (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted">Nome</label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        maxLength={200}
                        placeholder="Conte um pouco sobre você..."
                        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      <p className="mt-0.5 text-right text-[10px] text-muted">{bio.length}/200</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-3">
                      <p className="mb-2 text-xs font-semibold text-muted">Dados financeiros (para saques)</p>
                      <div className="space-y-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted">CPF</label>
                          <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted">Tipo de chave Pix</label>
                          <select
                            value={pixTipo}
                            onChange={(e) => setPixTipo(e.target.value)}
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                          >
                            <option value="">Selecione...</option>
                            <option value="cpf">CPF</option>
                            <option value="email">E-mail</option>
                            <option value="telefone">Telefone</option>
                            <option value="aleatoria">Chave aleatória</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted">Chave Pix</label>
                          <input
                            type="text"
                            value={pixChave}
                            onChange={(e) => setPixChave(e.target.value)}
                            placeholder="Sua chave Pix"
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        {saving ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        onClick={() => {
                          setEditando(false);
                          setNome(profile?.nome || "");
                          setBio(profile?.bio || "");
                          setCpf(profile?.cpf || "");
                          setPixTipo(profile?.pix_tipo || "");
                          setPixChave(profile?.pix_chave || "");
                        }}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <h1 className="text-xl font-bold">{profile?.nome}</h1>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${nivelCores[nivelLabel || "Novo"]}`}>
                        {nivelLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{email}</p>
                    <p className="mt-0.5 text-xs text-muted capitalize">{profile?.tipo}</p>
                    {profile?.bio && (
                      <p className="mt-2 text-sm">{profile.bio}</p>
                    )}
                    {profile?.pix_chave && (
                      <div className="mt-3 rounded-lg border border-border bg-background px-3 py-2">
                        <p className="text-[10px] font-medium text-muted">Chave Pix ({profile.pix_tipo})</p>
                        <p className="text-xs font-semibold">{profile.pix_chave}</p>
                      </div>
                    )}
                    <button
                      onClick={() => setEditando(true)}
                      className="mt-3 rounded-lg border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-background"
                    >
                      Editar perfil
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold text-primary">R$ {saldo.toFixed(2).replace(".", ",")}</p>
              <p className="text-[11px] text-muted">Saldo</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold">{profile?.nota_media?.toFixed(1) || "0.0"}</p>
              <p className="text-[11px] text-muted">Avaliação</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold">{profile?.total_vendas || 0}</p>
              <p className="text-[11px] text-muted">Vendas</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-2xl font-bold">{profile?.total_compras || 0}</p>
              <p className="text-[11px] text-muted">Compras</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-bold">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/carteira"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Carteira</p>
                  <p className="text-[11px] text-muted">Depositar ou sacar</p>
                </div>
              </a>
              <a
                href="/mensagens"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Mensagens</p>
                  <p className="text-[11px] text-muted">Ver conversas</p>
                </div>
              </a>
              <a
                href={profile?.tipo === "vendedor" ? "/painel/vendedor" : "/painel/comprador"}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Meus Pedidos</p>
                  <p className="text-[11px] text-muted">Acompanhar pedidos</p>
                </div>
              </a>
              <a
                href="/catalogo"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .414.336.75.75.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Catálogo</p>
                  <p className="text-[11px] text-muted">Encontrar serviços</p>
                </div>
              </a>
            </div>
          </div>

          {/* Member since */}
          <p className="mt-8 text-center text-xs text-muted">
            Membro desde {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
              : "—"}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
