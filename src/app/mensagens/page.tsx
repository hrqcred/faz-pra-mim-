"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

const avatarGradients = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-blue-400 to-indigo-600",
  "from-cyan-400 to-teal-600",
  "from-emerald-400 to-green-600",
  "from-amber-400 to-orange-600",
];

function avatarGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export default function MensagensPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [conversas, setConversas] = useState<any[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [showLista, setShowLista] = useState(true);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase!
        .from("conversations")
        .select("*, user1:user1_id(id, nome, avatar_url), user2:user2_id(id, nome, avatar_url)")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (data) setConversas(data);
      setLoading(false);
    }

    load();
  }, [router]);

  useEffect(() => {
    if (!conversaAtiva) return;
    const supabase = createClient();
    if (!supabase) return;

    async function loadMessages() {
      const { data } = await supabase!
        .from("messages")
        .select("*, sender:sender_id(nome)")
        .eq("conversation_id", conversaAtiva)
        .order("created_at", { ascending: true });

      if (data) setMensagens(data);
    }

    loadMessages();

    const channel = supabase.channel(`messages:${conversaAtiva}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversaAtiva}`,
      }, (payload) => {
        setMensagens((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversaAtiva]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function getOutro(conversa: any) {
    if (!userId) return { nome: "...", id: "" };
    const outro = conversa.user1?.id === userId ? conversa.user2 : conversa.user1;
    return outro || { nome: "Usuário", id: "" };
  }

  async function enviar() {
    if (!novaMensagem.trim() || !conversaAtiva || !userId) return;
    const supabase = createClient();
    if (!supabase) return;

    const texto = novaMensagem.trim();
    setNovaMensagem("");

    await supabase.from("messages").insert({
      conversation_id: conversaAtiva,
      sender_id: userId,
      texto,
    });

    await supabase.from("conversations").update({
      ultima_mensagem: texto,
      updated_at: new Date().toISOString(),
    }).eq("id", conversaAtiva);
  }

  const conversaSelecionada = conversas.find((c) => c.id === conversaAtiva);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex h-[calc(100vh-140px)] max-w-5xl overflow-hidden px-4 py-4 sm:px-6">
          {/* Conversations list */}
          <div className={`${conversaAtiva && !showLista ? "hidden sm:flex" : "flex"} w-full flex-col border-r border-border sm:w-80`}>
            <div className="border-b border-border p-4">
              <h1 className="text-lg font-bold">Mensagens</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : conversas.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm text-muted">Nenhuma conversa ainda</p>
                  <p className="mt-1 text-xs text-muted">Compre um serviço para iniciar uma conversa</p>
                </div>
              ) : (
                conversas.map((c) => {
                  const outro = getOutro(c);
                  const initials = outro.nome?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setConversaAtiva(c.id); setShowLista(false); }}
                      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors ${
                        conversaAtiva === c.id ? "bg-primary/5" : "hover:bg-background"
                      }`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(outro.nome || "")} text-xs font-bold text-white shadow-md`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{outro.nome}</span>
                          <span className="text-[10px] text-muted">
                            {new Date(c.updated_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted">{c.ultima_mensagem || "Nova conversa"}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!conversaAtiva || showLista ? "hidden sm:flex" : "flex"} flex-1 flex-col`}>
            {conversaSelecionada ? (
              <>
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <button onClick={() => setShowLista(true)} className="text-muted sm:hidden">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  {(() => {
                    const outro = getOutro(conversaSelecionada);
                    const initials = outro.nome?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
                    return (
                      <>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(outro.nome || "")} text-[10px] font-bold text-white`}>
                          {initials}
                        </div>
                        <p className="text-sm font-semibold">{outro.nome}</p>
                      </>
                    );
                  })()}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {mensagens.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          m.sender_id === userId
                            ? "bg-primary text-white"
                            : "bg-surface border border-border"
                        }`}>
                          <p className="text-sm">{m.texto}</p>
                          <p className={`mt-1 text-right text-[10px] ${m.sender_id === userId ? "text-white/60" : "text-muted"}`}>
                            {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && enviar()}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                    <button
                      onClick={enviar}
                      disabled={!novaMensagem.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted">
                {conversas.length > 0 ? "Selecione uma conversa" : "Nenhuma conversa ainda"}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
