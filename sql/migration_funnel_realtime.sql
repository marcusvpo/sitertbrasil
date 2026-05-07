-- ============================================================
-- MIGRATION: Fase 3 — Tempo Real & Funil
-- Aplicar manualmente no SQL Editor do Supabase
-- ============================================================

-- 1) Eventos do funil (toda interação rastreada)
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id bigserial PRIMARY KEY,
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,        -- pageview | view_product | add_to_cart | begin_checkout | lead | custom
  path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device text,                     -- mobile | tablet | desktop
  product_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON public.funnel_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_funnel_events_session ON public.funnel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_type ON public.funnel_events(event_type);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone insert funnel_events" ON public.funnel_events;
CREATE POLICY "anyone insert funnel_events" ON public.funnel_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admins read funnel_events" ON public.funnel_events;
CREATE POLICY "admins read funnel_events" ON public.funnel_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- 2) Sessões ao vivo (heartbeat 30s)
CREATE TABLE IF NOT EXISTS public.live_sessions (
  session_id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  current_path text,
  device text,
  referrer text,
  utm_source text,
  country text,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_sessions_lastseen ON public.live_sessions(last_seen DESC);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone upsert live_sessions" ON public.live_sessions;
CREATE POLICY "anyone insert live_sessions" ON public.live_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone update live_sessions" ON public.live_sessions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admins read live_sessions" ON public.live_sessions;
CREATE POLICY "admins read live_sessions" ON public.live_sessions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- 3) Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.funnel_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;
