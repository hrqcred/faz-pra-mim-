-- ============================================
-- FPM - FazPraMim | Schema Completo Supabase
-- ============================================
-- Rodar no SQL Editor do Supabase (supabase.com > projeto > SQL Editor)
-- Ordem importa: tabelas pai primeiro, depois filhas

-- ============================================
-- 1. PERFIS (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null default 'comprador' check (tipo in ('comprador', 'vendedor', 'admin')),
  avatar_url text,
  bio text,
  nivel_vendedor text default 'Novato' check (nivel_vendedor in ('Novato', 'Ativo', 'Profissional', 'Expert', 'Elite')),
  nivel_comprador text default 'Novo' check (nivel_comprador in ('Novo', 'Frequente', 'VIP', 'Premium')),
  nota_media numeric(3,2) default 0,
  total_vendas integer default 0,
  total_compras integer default 0,
  status text default 'ativo' check (status in ('ativo', 'pendente', 'suspenso')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfil público para leitura"
  on public.profiles for select using (true);

create policy "Usuário edita próprio perfil"
  on public.profiles for update using (auth.uid() = id);

create policy "Inserir perfil no cadastro"
  on public.profiles for insert with check (auth.uid() = id);

-- Trigger: criar perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Usuário'),
    coalesce(new.raw_user_meta_data->>'tipo', 'comprador')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. CARTEIRA / WALLET
-- ============================================
create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  saldo numeric(12,2) default 0 check (saldo >= 0),
  saldo_pendente numeric(12,2) default 0 check (saldo_pendente >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.wallets enable row level security;

create policy "Ver própria carteira"
  on public.wallets for select using (auth.uid() = user_id);

create policy "Criar carteira própria"
  on public.wallets for insert with check (auth.uid() = user_id);

-- Trigger: criar carteira ao criar perfil
create or replace function public.handle_new_profile_wallet()
returns trigger as $$
begin
  insert into public.wallets (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created_wallet
  after insert on public.profiles
  for each row execute function public.handle_new_profile_wallet();

-- ============================================
-- 3. TRANSAÇÕES (depósitos, compras, saques, vendas)
-- ============================================
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tipo text not null check (tipo in ('deposito', 'compra', 'venda', 'saque', 'taxa', 'reembolso')),
  valor numeric(12,2) not null,
  descricao text,
  referencia_id uuid,
  status text default 'concluido' check (status in ('pendente', 'concluido', 'cancelado')),
  gateway_id text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Ver próprias transações"
  on public.transactions for select using (auth.uid() = user_id);

-- ============================================
-- 4. SERVIÇOS (anúncios dos vendedores)
-- ============================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  vendedor_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descricao text not null,
  preco numeric(10,2) not null check (preco > 0),
  prazo_entrega text not null,
  categoria text not null,
  tags text[] default '{}',
  capa_url text,
  destaque boolean default false,
  ativo boolean default true,
  total_vendas integer default 0,
  nota_media numeric(3,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.services enable row level security;

create policy "Serviços ativos são públicos"
  on public.services for select using (ativo = true);

create policy "Vendedor gerencia próprios serviços"
  on public.services for all using (auth.uid() = vendedor_id);

-- ============================================
-- 5. PEDIDOS
-- ============================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  comprador_id uuid not null references public.profiles(id),
  vendedor_id uuid not null references public.profiles(id),
  service_id uuid references public.services(id),
  titulo text not null,
  briefing text,
  valor numeric(10,2) not null,
  taxa_fpm numeric(10,2) not null default 0,
  valor_total numeric(10,2) not null,
  status text not null default 'pendente' check (status in ('pendente', 'aceito', 'em_producao', 'entregue', 'aprovado', 'disputado', 'cancelado')),
  arquivo_entrega text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Comprador vê próprios pedidos"
  on public.orders for select using (auth.uid() = comprador_id);

create policy "Vendedor vê pedidos recebidos"
  on public.orders for select using (auth.uid() = vendedor_id);

create policy "Comprador cria pedido"
  on public.orders for insert with check (auth.uid() = comprador_id);

create policy "Participantes atualizam pedido"
  on public.orders for update using (auth.uid() in (comprador_id, vendedor_id));

-- ============================================
-- 6. AVALIAÇÕES
-- ============================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  avaliador_id uuid not null references public.profiles(id),
  avaliado_id uuid not null references public.profiles(id),
  nota integer not null check (nota between 1 and 5),
  comentario text,
  tipo text not null check (tipo in ('comprador_avalia_vendedor', 'vendedor_avalia_comprador')),
  created_at timestamptz default now(),
  unique(order_id, tipo)
);

alter table public.reviews enable row level security;

create policy "Avaliações são públicas"
  on public.reviews for select using (true);

create policy "Participante cria avaliação"
  on public.reviews for insert with check (auth.uid() = avaliador_id);

-- ============================================
-- 7. CONVERSAS E MENSAGENS (Chat)
-- ============================================
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  user1_id uuid not null references public.profiles(id),
  user2_id uuid not null references public.profiles(id),
  ultima_mensagem text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.conversations enable row level security;

create policy "Participante vê conversa"
  on public.conversations for select using (auth.uid() in (user1_id, user2_id));

create policy "Participante cria conversa"
  on public.conversations for insert with check (auth.uid() in (user1_id, user2_id));

create policy "Participante atualiza conversa"
  on public.conversations for update using (auth.uid() in (user1_id, user2_id));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  texto text not null,
  lida boolean default false,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Participante vê mensagens"
  on public.messages for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and auth.uid() in (c.user1_id, c.user2_id)
    )
  );

create policy "Participante envia mensagem"
  on public.messages for insert with check (auth.uid() = sender_id);

-- ============================================
-- 8. SOLICITAÇÕES (comprador pede proposta)
-- ============================================
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  comprador_id uuid not null references public.profiles(id),
  titulo text not null,
  descricao text not null,
  categoria text not null,
  orcamento numeric(10,2),
  prazo text,
  status text default 'aberta' check (status in ('aberta', 'fechada', 'cancelada')),
  total_candidaturas integer default 0,
  created_at timestamptz default now()
);

alter table public.requests enable row level security;

create policy "Solicitações abertas são públicas"
  on public.requests for select using (status = 'aberta');

create policy "Comprador gerencia solicitações"
  on public.requests for all using (auth.uid() = comprador_id);

create table public.request_proposals (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  vendedor_id uuid not null references public.profiles(id),
  mensagem text not null,
  valor numeric(10,2) not null,
  prazo text,
  status text default 'pendente' check (status in ('pendente', 'aceita', 'recusada')),
  created_at timestamptz default now(),
  unique(request_id, vendedor_id)
);

alter table public.request_proposals enable row level security;

create policy "Comprador vê propostas da sua solicitação"
  on public.request_proposals for select using (
    exists (
      select 1 from public.requests r
      where r.id = request_id and r.comprador_id = auth.uid()
    )
  );

create policy "Vendedor vê e cria próprias propostas"
  on public.request_proposals for all using (auth.uid() = vendedor_id);

-- ============================================
-- 9. PAGAMENTOS (gateway SyncPay / Pix)
-- ============================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  tipo text not null check (tipo in ('deposito', 'saque')),
  valor numeric(12,2) not null check (valor > 0),
  status text default 'pendente' check (status in ('pendente', 'pago', 'expirado', 'cancelado')),
  gateway text default 'syncpay',
  gateway_payment_id text,
  gateway_qrcode text,
  gateway_pix_key text,
  expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

create policy "Ver próprios pagamentos"
  on public.payments for select using (auth.uid() = user_id);

-- ============================================
-- 10. ÍNDICES PARA PERFORMANCE
-- ============================================
create index idx_services_categoria on public.services(categoria);
create index idx_services_vendedor on public.services(vendedor_id);
create index idx_services_destaque on public.services(destaque) where destaque = true;
create index idx_orders_comprador on public.orders(comprador_id);
create index idx_orders_vendedor on public.orders(vendedor_id);
create index idx_orders_status on public.orders(status);
create index idx_transactions_user on public.transactions(user_id);
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_reviews_avaliado on public.reviews(avaliado_id);
create index idx_payments_user on public.payments(user_id);
create index idx_payments_status on public.payments(status) where status = 'pendente';

-- ============================================
-- 11. FUNÇÃO: atualizar updated_at automaticamente
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger tr_wallets_updated_at before update on public.wallets
  for each row execute function public.update_updated_at();

create trigger tr_services_updated_at before update on public.services
  for each row execute function public.update_updated_at();

create trigger tr_orders_updated_at before update on public.orders
  for each row execute function public.update_updated_at();

create trigger tr_conversations_updated_at before update on public.conversations
  for each row execute function public.update_updated_at();

-- ============================================
-- 12. REALTIME (habilitar para chat e pedidos)
-- ============================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.conversations;
