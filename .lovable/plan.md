# Plano Aprovado — Plataforma Admin RT Brasil

Decisões finais incorporadas:
- **GA4**: service account recebido (`ga4-api-viewer@rt-brasil-import.iam.gserviceaccount.com`). Será salva como secret `GA4_SERVICE_ACCOUNT_JSON` na primeira ação da Fase 3.
- **PageSpeed / Slack**: removidos do escopo.
- **Roles**: usuário único `admin` com acesso total. Sem multi-role por enquanto (mantém `user_roles` + `has_role()` atual; sem página de gestão de usuários).

---

## Fase 1 — Fundação (começa agora)

1. **Reestruturar `AdminLayout`**
   - Sidebar agrupada: Dashboard / Marketing & SEO / Leads & Funil / Produtos / Analytics / Conteúdo.
   - Header com seletor global de período (7d/30d/90d/custom) via Context.

2. **Bloquear cadastro de produtos** (`AdminProducts.tsx`)
   - Remover botão "Novo Produto" e rota `/admin/products/new`.
   - Edição local restrita: apenas `is_active`, `is_featured`, `sort_order`, `badge`, SEO meta (title/description). Nome/preço/imagens vêm da Yampi.
   - Painel de status da sync: última execução, contagem, alertas.
   - Botão "Sincronizar Yampi" mantido + cron diário (pg_cron → `sync-yampi`).

3. **Dashboard Visão Geral** (dados Supabase reais já disponíveis)
   - KPIs: total de leads (período), novos leads hoje, conversão de formulários, produtos ativos, últimas sincronizações.
   - Gráfico de leads por dia (recharts).
   - Feed em tempo real (Supabase Realtime) de novos leads.
   - Top categorias / produtos mais vistos (após instrumentação).

4. **CRM-lite de Leads**
   - View `leads_unified` consolidando `revendedor_submissions`, `contato_submissions`, `newsletter_submissions`.
   - Tabelas novas: `lead_status`, `lead_notes`, `lead_events`.
   - Kanban (`@dnd-kit`): Novo → Contatado → Qualificado → Convertido → Perdido.
   - Detalhe do lead com timeline + notas + ações rápidas (WhatsApp, e-mail via Resend).
   - Lead scoring simples (origem + recência).
   - Export CSV filtrado.

---

## Fase 2 — SEO Center

- Tabela `seo_overrides` (route → title/description/og_image/keywords) lida pelo `<SEO />`.
- Editor de metas com preview "Como aparece no Google".
- Sitemap manager (visualizar/regenerar via edge function `regenerate-sitemap`).
- Tabela `redirects` (301) + middleware no `App.tsx`.
- Edge function `seo-audit` (semanal): checa title/desc/H1/canonical/OG/alt por rota → score 0–100.
- Status de Schema.org por página.

---

## Fase 3 — Analytics Reais (GA4 + Search Console + Yampi)

1. **Salvar secret** `GA4_SERVICE_ACCOUNT_JSON` (conteúdo do JSON anexado).
2. Edge function `ga4-query`: aquisição, comportamento, conversões, top pages, top sources. Cache 5min em `analytics_cache`.
3. Edge function `gsc-query`: top queries, posição média, CTR, impressões (mesma service account, precisa adicioná-la como usuário em search.google.com/search-console).
4. Edge function `yampi-orders`: pedidos, ticket médio, top produtos vendidos, abandono.
5. **Tempo Real**: hook `useTrack` no front grava pageviews/eventos em `funnel_events` + tabela `live_sessions` (heartbeat 30s) com Supabase Realtime → Live View.
6. **Funil de Conversão**: Visitante → Produto → Add Cart → Checkout → Lead, com drop-off %, segmentado por fonte/dispositivo/UTM.

**Ação sua nesta fase**: adicionar `ga4-api-viewer@rt-brasil-import.iam.gserviceaccount.com` como **Viewer** na propriedade GA4 (`G-08Y01NMKEB`) em analytics.google.com → Admin → Property Access Management. E também como usuário no Search Console.

---

## Fase 4 — CMS

- Migrar `Glossário`, `Guia`, `FAQ` para tabelas (`glossary_terms`, `guides`, `faqs`) com CRUD admin (TipTap rich-text).
- CRUD de banners da home (`home_banners`).
- Blog com SEO fields por post.

---

## Stack & Tabelas

**Novas migrations**: `seo_overrides`, `redirects`, `seo_audit_results`, `lead_status`, `lead_notes`, `lead_events`, `funnel_events`, `live_sessions`, `analytics_cache`, `glossary_terms`, `guides`, `faqs`, `home_banners`. View: `leads_unified`.

**Novas Edge Functions**: `sync-yampi-cron`, `seo-audit`, `regenerate-sitemap`, `ga4-query`, `gsc-query`, `yampi-orders`, `lead-notify`.

**Libs novas**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@tiptap/react` + extensions, `googleapis` (Deno) para GA4.

**Mantido**: React + TS + Tailwind + shadcn + Supabase + recharts + react-query.

---

Começo agora pela **Fase 1**. Confirma e eu sigo. (A Fase 3 só funciona após você adicionar a service account no GA4 + Search Console — me avisa quando estiver pronto.)
