-- ============================================================
-- MIGRATION: SEO Center (Fase 2)
-- Aplicar no SQL Editor do Supabase
-- ============================================================

-- Auditoria SEO
CREATE TABLE IF NOT EXISTS public.seo_audit_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL,
  score int NOT NULL DEFAULT 0,
  checks jsonb NOT NULL DEFAULT '[]'::jsonb,
  title text,
  description text,
  h1_count int,
  has_canonical boolean,
  has_og_image boolean,
  word_count int,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_seo_audit_route_date ON public.seo_audit_results(route, created_at DESC);

ALTER TABLE public.seo_audit_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins manage seo_audit" ON public.seo_audit_results;
CREATE POLICY "admins manage seo_audit" ON public.seo_audit_results
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
