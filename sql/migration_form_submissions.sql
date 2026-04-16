-- ============================================================
-- Migration: Tabelas para armazenar envios de formulários
-- Aplicar em: Supabase SQL Editor
-- ============================================================

-- 1) Tabela para cadastro de Revendedores (/seja-revendedor)
CREATE TABLE IF NOT EXISTS public.revendedor_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  empresa text,
  email text NOT NULL,
  whatsapp text,
  consentimento boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'novo', -- novo | contatado | convertido | descartado
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revendedor_created_at
  ON public.revendedor_submissions (created_at DESC);

ALTER TABLE public.revendedor_submissions ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante (anon) pode ENVIAR um cadastro
DROP POLICY IF EXISTS "anyone can insert revendedor"
  ON public.revendedor_submissions;
CREATE POLICY "anyone can insert revendedor"
  ON public.revendedor_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Apenas admins podem LER os envios
DROP POLICY IF EXISTS "admins can read revendedor"
  ON public.revendedor_submissions;
CREATE POLICY "admins can read revendedor"
  ON public.revendedor_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem ATUALIZAR (mudar status)
DROP POLICY IF EXISTS "admins can update revendedor"
  ON public.revendedor_submissions;
CREATE POLICY "admins can update revendedor"
  ON public.revendedor_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));


-- 2) Tabela para Fale Conosco (/central-atendimento)
CREATE TABLE IF NOT EXISTS public.contato_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  whatsapp text,
  mensagem text NOT NULL,
  status text NOT NULL DEFAULT 'novo', -- novo | respondido | arquivado
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contato_created_at
  ON public.contato_submissions (created_at DESC);

ALTER TABLE public.contato_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can insert contato"
  ON public.contato_submissions;
CREATE POLICY "anyone can insert contato"
  ON public.contato_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admins can read contato"
  ON public.contato_submissions;
CREATE POLICY "admins can read contato"
  ON public.contato_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins can update contato"
  ON public.contato_submissions;
CREATE POLICY "admins can update contato"
  ON public.contato_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
