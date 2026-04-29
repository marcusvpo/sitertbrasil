-- ============================================================
-- Migration: Newsletter Submissions
-- Aplicar em: Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.newsletter_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  telefone text NOT NULL,
  cupom_enviado boolean NOT NULL DEFAULT false,
  email_enviado_at timestamptz,
  status text NOT NULL DEFAULT 'novo', -- novo | enviado | exportado_substack
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created_at
  ON public.newsletter_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email
  ON public.newsletter_submissions (email);

ALTER TABLE public.newsletter_submissions ENABLE ROW LEVEL SECURITY;

-- Visitantes podem se inscrever
DROP POLICY IF EXISTS "anyone can insert newsletter"
  ON public.newsletter_submissions;
CREATE POLICY "anyone can insert newsletter"
  ON public.newsletter_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Anon pode checar se um email já existe (necessário para a lógica do popup)
DROP POLICY IF EXISTS "anyone can check email existence"
  ON public.newsletter_submissions;
CREATE POLICY "anyone can check email existence"
  ON public.newsletter_submissions FOR SELECT
  TO anon, authenticated USING (true);

-- Admins podem atualizar (mudar status, marcar exportado)
DROP POLICY IF EXISTS "admins can update newsletter"
  ON public.newsletter_submissions;
CREATE POLICY "admins can update newsletter"
  ON public.newsletter_submissions FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem deletar
DROP POLICY IF EXISTS "admins can delete newsletter"
  ON public.newsletter_submissions;
CREATE POLICY "admins can delete newsletter"
  ON public.newsletter_submissions FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));
