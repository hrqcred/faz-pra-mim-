-- ============================================
-- FPM - FazPraMim: Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Perfis de usuário (estende auth.users)
create table public.perfis (
  id uuid references auth.users on delete cascade primary key,
  nome text not null,
  tipo text not null check (tipo in ('comprador', 'vendedor')),
  avatar_url text,
  bio text,
  cpf_cnpj text,
  nivel_vendedor text default 'Novato' check (nivel_vendedor in ('Novato', 'Ativo', 'Profissional', 'Expert', 'Elite')),
  nivel_comprador text default 'Novo' check (nivel_comprador in ('Novo', 'Frequente', 'VIP', 'Premium')),
  nota_media_vendedor numeric(3,2) default 0,
  nota_media_comprador numeric(3,2) default 0,
  total_vendas integer default 0,
  total_compras integer default 0,
  saldo numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- Serviços oferecidos
create table public.servicos (
  id uuid default gen_random_uuid() primary key,
  vendedor_id uuid references public.perfis(id) on delete cascade not null,
  titulo text not null,
  descricao text not null,
  preco numeric(10,2) not null,
  prazo_entrega text not null,
  categoria text not null,
  tags text[] default '{}',
  ativo boolean default true,
  destaque boolean default false,
  total_vendas integer default 0,
  nota_media numeric(3,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pedidos
create table public.pedidos (
  id uuid default gen_random_uuid() primary key,
  comprador_id uuid references public.perfis(id) not null,
  servico_id uuid references public.servicos(id) not null,
  vendedor_id uuid references public.perfis(id) not null,
  quantidade integer default 1,
  valor_total numeric(10,2) not null,
  status text default 'pendente' check (status in ('pendente', 'aceito', 'em_producao', 'entregue', 'aprovado', 'revisao', 'cancelado', 'disputa')),
  briefing text,
  arquivo_entrega text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Avaliações bilaterais
create table public.avaliacoes (
  id uuid default gen_random_uuid() primary key,
  pedido_id uuid references public.pedidos(id) not null,
  avaliador_id uuid references public.perfis(id) not null,
  avaliado_id uuid references public.perfis(id) not null,
  tipo text not null check (tipo in ('comprador_para_vendedor', 'vendedor_para_comprador')),
  nota integer not null check (nota >= 1 and nota <= 5),
  comentario text,
  created_at timestamptz default now(),
  unique(pedido_id, tipo)
);

-- Mensagens do chat
create table public.mensagens (
  id uuid default gen_random_uuid() primary key,
  pedido_id uuid references public.pedidos(id),
  remetente_id uuid references public.perfis(id) not null,
  destinatario_id uuid references public.perfis(id) not null,
  conteudo text not null,
  lida boolean default false,
  created_at timestamptz default now()
);

-- Carteira / transações
create table public.transacoes (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfis(id) not null,
  tipo text not null check (tipo in ('deposito', 'compra', 'venda', 'saque', 'reembolso')),
  valor numeric(10,2) not null,
  descricao text,
  pedido_id uuid references public.pedidos(id),
  created_at timestamptz default now()
);

-- Solicitações do feed
create table public.solicitacoes (
  id uuid default gen_random_uuid() primary key,
  comprador_id uuid references public.perfis(id) not null,
  titulo text not null,
  descricao text not null,
  orcamento numeric(10,2),
  categoria text,
  status text default 'aberta' check (status in ('aberta', 'em_andamento', 'fechada')),
  created_at timestamptz default now()
);

-- Candidaturas a solicitações
create table public.candidaturas (
  id uuid default gen_random_uuid() primary key,
  solicitacao_id uuid references public.solicitacoes(id) on delete cascade not null,
  vendedor_id uuid references public.perfis(id) not null,
  mensagem text,
  preco_proposto numeric(10,2),
  aceita boolean default false,
  created_at timestamptz default now(),
  unique(solicitacao_id, vendedor_id)
);

-- RLS (Row Level Security)
alter table public.perfis enable row level security;
alter table public.servicos enable row level security;
alter table public.pedidos enable row level security;
alter table public.avaliacoes enable row level security;
alter table public.mensagens enable row level security;
alter table public.transacoes enable row level security;
alter table public.solicitacoes enable row level security;
alter table public.candidaturas enable row level security;

-- Políticas: perfis
create policy "Perfis visíveis publicamente" on public.perfis for select using (true);
create policy "Usuários editam próprio perfil" on public.perfis for update using (auth.uid() = id);
create policy "Inserir perfil próprio" on public.perfis for insert with check (auth.uid() = id);

-- Políticas: serviços
create policy "Serviços visíveis publicamente" on public.servicos for select using (true);
create policy "Vendedor gerencia seus serviços" on public.servicos for insert with check (auth.uid() = vendedor_id);
create policy "Vendedor atualiza seus serviços" on public.servicos for update using (auth.uid() = vendedor_id);
create policy "Vendedor deleta seus serviços" on public.servicos for delete using (auth.uid() = vendedor_id);

-- Políticas: pedidos
create policy "Ver próprios pedidos" on public.pedidos for select using (auth.uid() = comprador_id or auth.uid() = vendedor_id);
create policy "Comprador cria pedido" on public.pedidos for insert with check (auth.uid() = comprador_id);
create policy "Participantes atualizam pedido" on public.pedidos for update using (auth.uid() = comprador_id or auth.uid() = vendedor_id);

-- Políticas: avaliações
create policy "Avaliações visíveis publicamente" on public.avaliacoes for select using (true);
create policy "Avaliador cria avaliação" on public.avaliacoes for insert with check (auth.uid() = avaliador_id);

-- Políticas: mensagens
create policy "Ver próprias mensagens" on public.mensagens for select using (auth.uid() = remetente_id or auth.uid() = destinatario_id);
create policy "Enviar mensagem" on public.mensagens for insert with check (auth.uid() = remetente_id);
create policy "Marcar como lida" on public.mensagens for update using (auth.uid() = destinatario_id);

-- Políticas: transações
create policy "Ver próprias transações" on public.transacoes for select using (auth.uid() = usuario_id);

-- Políticas: solicitações
create policy "Solicitações visíveis publicamente" on public.solicitacoes for select using (true);
create policy "Comprador cria solicitação" on public.solicitacoes for insert with check (auth.uid() = comprador_id);
create policy "Comprador atualiza solicitação" on public.solicitacoes for update using (auth.uid() = comprador_id);

-- Políticas: candidaturas
create policy "Ver candidaturas da solicitação" on public.candidaturas for select using (true);
create policy "Vendedor se candidata" on public.candidaturas for insert with check (auth.uid() = vendedor_id);

-- Trigger: criar perfil ao registrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfis (id, nome, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', 'Usuário'),
    coalesce(new.raw_user_meta_data->>'tipo', 'comprador')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
