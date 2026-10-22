-- Adicionar campos de dados financeiros ao perfil
-- Rodar no SQL Editor do Supabase

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS pix_tipo text CHECK (pix_tipo IN ('cpf', 'email', 'telefone', 'aleatoria')),
  ADD COLUMN IF NOT EXISTS pix_chave text;
