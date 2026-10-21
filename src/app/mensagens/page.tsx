"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

interface Conversa {
  id: string;
  nome: string;
  avatar: string;
  ultimaMensagem: string;
  tempo: string;
  naoLidas: number;
  online: boolean;
}

interface Mensagem {
  id: string;
  de: "eu" | "outro";
  texto: string;
  hora: string;
}

const conversasFake: Conversa[] = [
  { id: "1", nome: "Igor L.", avatar: "IL", ultimaMensagem: "O vídeo ficou pronto! Vou enviar aqui.", tempo: "2 min", naoLidas: 2, online: true },
  { id: "2", nome: "Amanda R.", avatar: "AR", ultimaMensagem: "Perfeito, pode começar a produção.", tempo: "1h", naoLidas: 0, online: true },
  { id: "3", nome: "Jonathan A.", avatar: "JA", ultimaMensagem: "Aceito sim! Me manda o briefing completo.", tempo: "3h", naoLidas: 1, online: false },
  { id: "4", nome: "Camila R.", avatar: "CR", ultimaMensagem: "Obrigada pela avaliação! 🙏", tempo: "1 dia", naoLidas: 0, online: false },
  { id: "5", nome: "Monique F.", avatar: "MF", ultimaMensagem: "Consigo entregar até quinta, tudo bem?", tempo: "2 dias", naoLidas: 0, online: false },
];

const mensagensFake: Record<string, Mensagem[]> = {
  "1": [
    { id: "m1", de: "eu", texto: "Oi Igor, tudo bem? Queria saber como está o vídeo.", hora: "14:20" },
    { id: "m2", de: "outro", texto: "Fala! Tudo certo, estou finalizando a edição agora.", hora: "14:22" },
    { id: "m3", de: "outro", texto: "Ficou muito bom, acho que vai gostar do resultado.", hora: "14:22" },
    { id: "m4", de: "eu", texto: "Ótimo! Mal posso esperar pra ver 😄", hora: "14:25" },
    { id: "m5", de: "outro", texto: "O vídeo ficou pronto! Vou enviar aqui.", hora: "14:30" },
  ],
  "2": [
    { id: "m1", de: "outro", texto: "Oi! Vi que você fez uma solicitação de depoimento.", hora: "10:00" },
    { id: "m2", de: "eu", texto: "Sim! Preciso de algo bem natural, estilo conversa.", hora: "10:05" },
    { id: "m3", de: "outro", texto: "Entendi perfeitamente. Posso gravar amanhã.", hora: "10:08" },
    { id: "m4", de: "eu", texto: "Perfeito, pode começar a produção.", hora: "10:10" },
  ],
  "3": [
    { id: "m1", de: "eu", texto: "Oi Jonathan! Vi que você faz UGC, tem interesse nesse pedido?", hora: "09:00" },
    { id: "m2", de: "outro", texto: "Aceito sim! Me manda o briefing completo.", hora: "12:30" },
  ],
};

export default function MensagensPage() {
  const [conversaAtiva, setConversaAtiva] = useState<string | null>("1");
  const [novaMensagem, setNovaMensagem] = useState("");
  const [showLista, setShowLista] = useState(true);

  const mensagens = conversaAtiva ? mensagensFake[conversaAtiva] ?? [] : [];
  const conversaSelecionada = conversasFake.find((c) => c.id === conversaAtiva);

  const enviar = () => {
    if (!novaMensagem.trim()) return;
    setNovaMensagem("");
  };

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
              {conversasFake.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setConversaAtiva(c.id); setShowLista(false); }}
                  className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors ${
                    conversaAtiva === c.id ? "bg-primary/5" : "hover:bg-background"
                  }`}
                >
                  <div className="relative">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(c.nome)} text-xs font-bold text-white shadow-md`}>
                      {c.avatar}
                    </div>
                    {c.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{c.nome}</span>
                      <span className="text-[10px] text-muted">{c.tempo}</span>
                    </div>
                    <p className="truncate text-xs text-muted">{c.ultimaMensagem}</p>
                  </div>
                  {c.naoLidas > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {c.naoLidas}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${!conversaAtiva || showLista ? "hidden sm:flex" : "flex"} flex-1 flex-col`}>
            {conversaSelecionada ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <button onClick={() => setShowLista(true)} className="text-muted sm:hidden">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <div className="relative">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(conversaSelecionada.nome)} text-[10px] font-bold text-white`}>
                      {conversaSelecionada.avatar}
                    </div>
                    {conversaSelecionada.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{conversaSelecionada.nome}</p>
                    <p className="text-[10px] text-muted">{conversaSelecionada.online ? "Online" : "Offline"}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {mensagens.map((m) => (
                      <div key={m.id} className={`flex ${m.de === "eu" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          m.de === "eu"
                            ? "bg-primary text-white"
                            : "bg-surface border border-border"
                        }`}>
                          <p className="text-sm">{m.texto}</p>
                          <p className={`mt-1 text-right text-[10px] ${m.de === "eu" ? "text-white/60" : "text-muted"}`}>
                            {m.hora}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input */}
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
                Selecione uma conversa para começar
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
