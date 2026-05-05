-- ============================================================
-- MIGRATION: Plataforma Admin (Fase 1) — CRM, Funil, SEO
-- Aplicar manualmente no SQL Editor do Supabase
-- ============================================================

-- 1) STATUS unificado por lead (linka qualquer submission por id)
CREATE TABLE IF NOT EXISTS public.lead_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,           -- 'revendedor' | 'contato' | 'newsletter'
  source_id uuid NOT NULL,        -- id na tabela de origem
  status text NOT NULL DEFAULT 'novo', -- novo|contatado|qualificado|convertido|perdido
  score int NOT NULL DEFAULT 0,
  assigned_to uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, source_id)
);
CREATE INDEX IF NOT EXISTS idx_lead_status_status ON public.lead_status(status);
ALTER TABLE public.lead_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins manage lead_status" ON public.lead_status;
CREATE POLICY "admins manage lead_status" ON public.lead_status
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 2) Notas livres do CRM
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id uuid NOT NULL,
  author_id uuid REFERENCES auth.users(id),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lookup ON public.lead_notes(source, source_id, created_at DESC);
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins manage lead_notes" ON public.lead_notes;
CREATE POLICY "admins manage lead_notes" ON public.lead_notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 3) Eventos de timeline (interações, mudanças de status, e-mails enviados)
CREATE TABLE IF NOT EXISTS public.lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id uuid NOT NULL,
  event_type text NOT NULL,      -- created|status_change|note_added|email_sent|whatsapp_sent
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_events_lookup ON public.lead_events(source, source_id, created_at DESC);
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins manage lead_events" ON public.lead_events;
CREATE POLICY "admins manage lead_events" ON public.lead_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 4) View unificada de leads (todas as origens)
CREATE OR REPLACE VIEW public.leads_unified AS
SELECT
  r.id,
  'revendedor'::text AS source,
  r.nome,
  r.email,
  r.whatsapp AS phone,
  r.empresa AS extra,
  r.created_at,
  COALESCE(s.status, 'novo') AS status,
  COALESCE(s.score, 0) AS score
FROM public.revendedor_submissions r
LEFT JOIN public.lead_status s ON s.source='revendedor' AND s.source_id=r.id
UNION ALL
SELECT
  c.id,
  'contato'::text,
  c.nome, c.email, c.whatsapp,
  c.mensagem,
  c.created_at,
  COALESCE(s.status,'novo'),
  COALESCE(s.score,0)
FROM public.contato_submissions c
LEFT JOIN public.lead_status s ON s.source='contato' AND s.source_id=c.id
UNION ALL
SELECT
  n.id,
  'newsletter'::text,
  n.nome, n.email, n.telefone,
  NULL,
  n.created_at,
  COALESCE(s.status,'novo'),
  COALESCE(s.score,0)
FROM public.newsletter_submissions n
LEFT JOIN public.lead_status s ON s.source='newsletter' AND s.source_id=n.id;

-- 5) SEO overrides (Fase 2 — já criado para evitar nova migration depois)
CREATE TABLE IF NOT EXISTS public.seo_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL UNIQUE,
  title text,
  description text,
  og_image text,
  keywords text,
  noindex boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read seo" ON public.seo_overrides;
CREATE POLICY "anyone can read seo" ON public.seo_overrides
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins manage seo" ON public.seo_overrides;
CREATE POLICY "admins manage seo" ON public.seo_overrides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 6) Redirects 301
CREATE TABLE IF NOT EXISTS public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read redirects" ON public.redirects;
CREATE POLICY "anyone can read redirects" ON public.redirects
  FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admins manage redirects" ON public.redirects;
CREATE POLICY "admins manage redirects" ON public.redirects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 7) Eventos de funil / pageviews (Fase 3)
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,    -- pageview|product_view|add_to_cart|checkout_init|lead_submit
  path text,
  product_id uuid,
  utm_source text, utm_medium text, utm_campaign text,
  referrer text, device text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_funnel_session ON public.funnel_events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_type_date ON public.funnel_events(event_type, created_at DESC);
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can insert funnel" ON public.funnel_events;
CREATE POLICY "anyone can insert funnel" ON public.funnel_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admins read funnel" ON public.funnel_events;
CREATE POLICY "admins read funnel" ON public.funnel_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 8) Sessões ao vivo (heartbeat)
CREATE TABLE IF NOT EXISTS public.live_sessions (
  session_id text PRIMARY KEY,
  path text,
  device text,
  country text,
  last_seen timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone upsert live" ON public.live_sessions;
CREATE POLICY "anyone upsert live" ON public.live_sessions
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- 9) Cache de queries do GA4 / Search Console
CREATE TABLE IF NOT EXISTS public.analytics_cache (
  cache_key text PRIMARY KEY,
  payload jsonb NOT NULL,
  expires_at timestamptz NOT NULL
);
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins read cache" ON public.analytics_cache;
CREATE POLICY "admins read cache" ON public.analytics_cache
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- 10) Realtime nas tabelas de leads/eventos
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.revendedor_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contato_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_submissions;
