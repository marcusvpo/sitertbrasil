
## Visão geral

1. Nova tabela `newsletter_submissions` no Supabase (SQL para você executar).
2. Popup de newsletter na tela `/blog` com formulário (Nome, Email, Telefone) e mensagem de agradecimento.
3. Lógica para não exibir o popup para quem já se inscreveu (localStorage + checagem no banco por email).
4. Nova tela `/admin/leads` com 3 abas: **Revendedores**, **Fale Conosco**, **Newsletter**.
5. Edge Function `send-newsletter-welcome` que dispara email com o cupom **NEWS10** + link Substack assim que um novo registro entra na tabela.
6. Investigação do Substack API → recomendação abaixo.

---

## ⚠️ Sobre a API do Substack — Importante

O **Substack NÃO possui API pública oficial** para inscrever assinantes externamente. O que existe:

- **Importação manual via CSV**: você exporta os emails coletados e importa no painel do Substack (Settings → Import subscribers). Funciona, mas é manual.
- **API não-oficial (substack-api no GitHub)**: usada por terceiros para *ler* posts. **Não permite criar subscribers** de forma confiável (precisa de cookies de sessão, quebra com frequência, viola ToS).
- **RSS do Substack**: útil só para *exibir* posts no seu site, não para inscrever ninguém.

**Minha recomendação:** Coletamos o email no **nosso banco** (fonte da verdade), enviamos o cupom pelo nosso email transacional, e periodicamente você exporta um CSV da tela `/admin/leads → Newsletter` e importa no Substack manualmente (5 minutos, 1x por semana). Isso é mais confiável do que depender de scraping.

→ Vou adicionar um botão **"Exportar CSV"** na aba Newsletter do admin justamente para facilitar essa importação no Substack.

---

## 1. SQL para você executar no Supabase

Vou gerar um arquivo `sql/migration_newsletter_submissions.sql` no projeto com este conteúdo (para você rodar no SQL Editor do Supabase):

```sql
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
CREATE POLICY "anyone can insert newsletter"
  ON public.newsletter_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Anon pode checar se um email já existe (para a lógica do popup)
CREATE POLICY "anyone can check email existence"
  ON public.newsletter_submissions FOR SELECT
  TO anon, authenticated USING (true);

-- Admins podem atualizar/deletar
CREATE POLICY "admins can update newsletter"
  ON public.newsletter_submissions FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));
```

> Nota: a policy de SELECT pública é necessária para o popup checar duplicidade pelo email antes de inserir. Os campos sensíveis (telefone, nome) ficam expostos via API, mas como a chave é o email (que o usuário já fornece para checar), o risco é baixo. Se preferir mais privacidade, posso trocar por uma RPC `check_newsletter_email_exists(email)` SECURITY DEFINER que só retorna boolean — me avise.

---

## 2. Popup Newsletter no `/blog`

**Componente novo:** `src/components/NewsletterPopup.tsx`

Comportamento:
- Aparece após **8 segundos** na página `/blog` (delay para não ser intrusivo).
- **Não aparece** se:
  - `localStorage.getItem('newsletter_subscribed') === 'true'` (já assinou neste device), OU
  - `localStorage.getItem('newsletter_dismissed_at')` for menor que 7 dias atrás (fechou recentemente).
- Modal centralizado com a estética **Dark Premium** (preto `#0a0a0a`, accent ciano `#009DDF`, Oswald headings, botões com `btn-clip`).
- Banner visual no topo do modal (gradiente + ícone de envelope).

**Conteúdo do popup:**
- Título: "ENTRE NA NEWSLETTER MOTOREX"
- Texto: *"Inscreva-se e receba conteúdo exclusivo de motocross, lubrificação e novidades. Como boas-vindas, ganhe **10% OFF** na sua primeira compra com o cupom **NEWS10**."*
- Campos: Nome, Email, Telefone (validação Zod: nome 2-100 chars, email válido, telefone 10-15 dígitos).
- Botão "QUERO MEU CUPOM".
- Após submit → tela de agradecimento dentro do modal: *"Obrigado, [Nome]! 🎉 Em instantes você receberá o cupom **NEWS10** no seu email. Confira também a caixa de spam."* + botão fechar.

**Lógica de submit:**
1. Valida com Zod.
2. Verifica se email já existe (`select count from newsletter_submissions where email = ?`).
3. Se existir → mostra "Você já está inscrito! 😊" e marca localStorage.
4. Se novo → insert, marca localStorage `newsletter_subscribed=true`, e a edge function dispara o email automaticamente (via webhook do Supabase, ver seção 4).
5. Mostra tela de agradecimento.

Botão "X" para fechar grava `newsletter_dismissed_at` no localStorage.

---

## 3. Tela `/admin/leads`

**Arquivo novo:** `src/pages/admin/AdminLeads.tsx`
**Rota:** adicionar em `src/App.tsx` → `<Route path="/admin/leads" element={<AdminLeads />} />`
**Sidebar:** adicionar item em `src/components/AdminLayout.tsx` (ícone `Users` do lucide-react, label "Leads", entre Vitrine e Categorias).

**Layout:**
- Header com título "Leads & Cadastros" + contador total.
- 3 cards no topo com totais de cada fonte (Revendedores: X | Fale Conosco: Y | Newsletter: Z).
- **Tabs** (`@/components/ui/tabs`):
  - **Revendedores**: tabela com Nome, Empresa, Email, WhatsApp, Status, Data. Ações: mudar status (dropdown novo/contatado/convertido/descartado).
  - **Fale Conosco**: tabela com Nome, Email, WhatsApp, Mensagem (truncada, expand on click), Status, Data.
  - **Newsletter**: tabela com Nome, Email, Telefone, "Cupom Enviado" (✓/✗), Data. Botão **"Exportar CSV"** no canto superior direito que baixa todos os emails em formato compatível com a importação do Substack (`email,first_name`).
- Busca global por nome/email em cada tab.
- Filtro por status.
- Paginação simples (20 por página).
- Ordenação por data desc por padrão.

Cada tab usa React Query para buscar do Supabase com refetch automático.

---

## 4. Edge Function `send-newsletter-welcome`

**Arquivo novo:** `supabase/functions/send-newsletter-welcome/index.ts`

**Trigger:** Webhook do Supabase Database → `newsletter_submissions` INSERT → invoca esta function.

> Você precisará configurar o webhook no painel Supabase (Database → Webhooks → Create) apontando para esta função. Vou deixar instruções claras no chat após implementar.

**O que faz:**
1. Recebe payload com `record` (linha inserida).
2. Valida que tem email/nome.
3. Envia email HTML via **Lovable Emails** (infra padrão do projeto, sem precisar de API key externa).
   - **Pré-requisito:** Domínio de email configurado em Lovable Cloud → Emails. Se ainda não estiver, vou guiar o setup no momento da implementação.
4. Email contém:
   - Saudação personalizada (Olá [Nome]).
   - Cupom em destaque: **NEWS10** — 10% OFF na primeira compra.
   - CTA "Visitar nossa Substack" → https://substack.com/@rtbrasilmotorex
   - CTA "Ver produtos MOTOREX" → /motorex
   - Nota: "Use o cupom no checkout. Válido para uma compra por cliente."
5. Após envio bem-sucedido, atualiza `cupom_enviado=true` e `email_enviado_at=now()` na tabela.

Template visual segue o **Dark Premium** (mas com background branco no email body, regra obrigatória do email infra).

---

## 5. Arquivos editados/criados

**Novos:**
- `sql/migration_newsletter_submissions.sql` (você executa manualmente)
- `src/components/NewsletterPopup.tsx`
- `src/pages/admin/AdminLeads.tsx`
- `supabase/functions/send-newsletter-welcome/index.ts`
- `supabase/functions/_shared/transactional-email-templates/newsletter-welcome.tsx` (se Lovable Emails for usado)

**Editados:**
- `src/App.tsx` — adicionar rota `/admin/leads` e lazy import.
- `src/components/AdminLayout.tsx` — adicionar item "Leads" na sidebar.
- `src/pages/Blog.tsx` — montar o `<NewsletterPopup />` no final do JSX.
- `src/types/database.ts` — adicionar interfaces `RevendedorSubmission`, `ContatoSubmission`, `NewsletterSubmission`.

---

## Resumo do que você precisa fazer manualmente

1. **Executar o SQL** que vou gerar em `sql/migration_newsletter_submissions.sql` no SQL Editor do Supabase.
2. **Configurar o webhook** no Supabase (Database → Webhooks) para chamar `send-newsletter-welcome` em INSERT na tabela. Vou te passar a URL exata após o deploy.
3. **Configurar domínio de email** em Lovable Cloud → Emails (se ainda não tiver). Vou abrir o diálogo de setup automaticamente quando chegar nessa etapa.
4. **Importação no Substack**: 1x por semana, baixar CSV no /admin/leads → Newsletter e importar no painel Substack.

Quer que eu prossiga? Algum ajuste no fluxo (ex: mudar tempo do popup, adicionar campo, trocar a SELECT pública por RPC mais privada)?
