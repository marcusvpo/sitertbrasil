# Plano de Ação SEO — RT Brasil MOTOREX (Aprovado)

Decisões confirmadas:
- Pré-render: **react-snap** (grátis)
- OG image: **eu componho** a partir dos assets existentes
- Conteúdo (pillar/glossário/categorias): **autorizado eu rascunhar** com base em referências MOTOREX
- Calculadora de óleo: **adiada** (sem tabela de compatibilidade — fica para fase futura quando você levantar os dados)
- Domínio: **rtbrasilimport.com.br** já conectado via Lovable hosting

> Observação técnica: como o site roda em Lovable hosting (não Vercel), o `vercel.json` não tem efeito. SPA routing já é nativo. O `sitemap.xml` será gerado **em build time** como arquivo estático (script Node lendo Supabase + rotas) e gravado em `public/sitemap.xml` — solução mais simples e robusta que edge function. Vou remover o `vercel.json` que ficou pendente.

---

## SPRINT 1 — Fundação SEO On-Page (PR único)

### 1.1 Sistema de meta tags dinâmicas
- Instalar `react-helmet-async`, envolver app com `<HelmetProvider>`.
- Criar `src/components/SEO.tsx` reutilizável: title, description, canonical, og:title, og:description, og:image, og:type, og:url, twitter card, robots.
- Criar `src/lib/seo-config.ts` com defaults (site name, base URL `https://www.rtbrasilimport.com.br`, OG default).

### 1.2 Aplicar `<SEO />` em todas as páginas públicas
Títulos otimizados (≤60 chars) e descrições (≤155 chars) únicos para:
- `/` Home: `Motorex: Motocross, Trilha e Enduro | RT Brasil`
- `/motorex` catálogo
- `/motorex/:slug` produto (dinâmico do Supabase: nome + categoria + preço)
- `/quem-somos`, `/seja-revendedor`, `/parceiros`, `/depoimentos`, `/blog`, `/central-atendimento`
- `/blog/:slug` post (title/description/og:image do post)
- `/parceiros/:piloto` cada página dos pilotos

### 1.3 Atualizar `index.html`
- Title/description fallback novos.
- Substituir `og:image` da Lovable pela imagem oficial composta (item 1.7).
- Adicionar `<link rel="canonical">` base.

### 1.4 JSON-LD Organization + LocalBusiness (na Home)
Componente injeta script com: nome, CNPJ 00.913.926/0001-78, endereço completo, telefone, e-mail, fundação, logo, sameAs (Instagram), areaServed Brasil.

### 1.5 JSON-LD Product (em `/motorex/:slug`)
Schema Product com name, image, description, brand=MOTOREX, sku, offers (price BRL, availability InStock, priceValidUntil).

### 1.6 JSON-LD BlogPosting + BreadcrumbList
- BlogPosting em `/blog/:slug`.
- BreadcrumbList em `/motorex`, `/motorex/:slug`, `/blog/:slug`, `/parceiros/:slug`.
- Componente visual `<Breadcrumbs />` opcional (recomendo para UX + SEO).

### 1.7 OG Image oficial (composta por mim)
Vou compor `public/images/og-default.jpg` 1200x630 usando logo MOTOREX + foto motocross do hero + faixa cyan da identidade. Salvo no repo.

### 1.8 Alt text auditado
Varredura em Index, Motorex, ProductDetail, Blog, HomeCarousel, banners, NewsletterPopup. Produtos do banco usam `nome + categoria` como alt automaticamente.

### 1.9 Fix slug "suspencao" → "suspensao"
- Migration SQL atualizando o slug da categoria.
- Adicionar redirect client-side em `App.tsx` (rota `/motorex/categoria/suspencao` → 301 visual via `<Navigate replace>`).

---

## SPRINT 2 — Discoverability (sitemap + robots)

### 2.1 Sitemap.xml gerado em build
- Script `scripts/generate-sitemap.mjs` que:
  - Lê produtos ativos e posts publicados via cliente Supabase.
  - Inclui rotas estáticas (home, motorex, quem-somos, blog, parceiros, pilotos individuais, central-atendimento, depoimentos, seja-revendedor).
  - Gera `public/sitemap.xml` com `<lastmod>`, `<changefreq>`, `<priority>`.
- Rodar via `prebuild` no `package.json`.

### 2.2 robots.txt
Atualizar `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://www.rtbrasilimport.com.br/sitemap.xml
```

### 2.3 Remover `vercel.json`
Não faz nada no Lovable hosting — limpeza.

---

## SPRINT 3 — Pré-render (react-snap)

### 3.1 Setup react-snap
- Instalar `react-snap` + Puppeteer.
- Configurar `package.json`:
  - `"postbuild": "react-snap"`
  - Bloco `"reactSnap"` com lista de rotas (estáticas + dinâmicas vindas do Supabase via script auxiliar).
- Ajustar `src/main.tsx` para usar `hydrateRoot` quando detectar HTML pré-renderizado.
- Garantir compatibilidade com Helmet (react-helmet-async já suporta).

### 3.2 Tratamento de rotas dinâmicas
- Pré-gerar HTML de cada produto e cada post do blog (lista vinda do Supabase no momento do build).
- Páginas admin e checkout ficam fora do snap.

### 3.3 Validação
- Verificar que Googlebot recebe HTML completo (View Source mostra meta tags + conteúdo).
- Testar via Rich Results Test do Google após deploy.

---

## SPRINT 4 — Conteúdo Estratégico (eu rascunho, você revisa)

Pesquiso referências oficiais MOTOREX (motorex.com), Motul, Manual do Motocross, FIM, e documentação técnica antes de redigir.

### 4.1 Pillar Page — `/guia/qual-oleo-motocross-trilha-enduro`
- 2.500-3.000 palavras estruturadas: hero + índice ancorado + seções (4T vs 2T, viscosidade, JASO, normas, marcas).
- Tabela responsiva por marca de moto: KTM, Husqvarna, Honda CRF, Yamaha YZ/WR, Kawasaki KX, GasGas, Beta, Sherco.
- CTAs cruzados para produtos do catálogo.
- Schema `Article` + `FAQPage` (FAQs no fim).

### 4.2 Glossário Técnico — `/glossario`
Termos com âncoras: JASO MA / MA2, API SP/SN, viscosidade SAE 10W40/15W50/5W40, base sintética PAO/Ester, base mineral, base semi-sintética, ZDDP, ponto de fulgor, NLGI (graxa), DOT (fluido de freio), Motul vs Motorex (comparativo neutro), additive package. Schema `DefinedTerm` + `DefinedTermSet`.

### 4.3 Headers descritivos por categoria
Em `/motorex` (filtro por categoria), bloco intro 400-600 palavras antes do grid:
- Óleo de motor 4T
- Óleo de motor 2T
- Suspensão (fork oil, shock oil)
- Corrente (lubrificantes/limpadores)
- Limpeza e manutenção
- Fluidos (freio, refrigeração)

### 4.4 Página de marca MOTOREX Suíça
Reformular `/quem-somos` adicionando seção "MOTOREX — Tecnologia Suíça desde 1917": história, fábrica em Langenthal, certificações, parcerias FIM/MotoGP, diferenciação no mercado brasileiro. Schema `Brand`.

### 4.5 FAQ Page — `/faq`
Perguntas comuns coletadas dos formulários e CTAs. Schema `FAQPage` (Rich Result no Google).

---

## SPRINT 5 — Calculadora de Óleo (ADIADA)

Aguarda você reunir tabela de compatibilidade marca/modelo/ano → SKU recomendado. Quando tiver, eu construo a UI interativa em `/calculadora-oleo`.

---

## FORA DO MEU ALCANCE — Você precisa fazer

1. **Google Search Console** — verificar `rtbrasilimport.com.br`, submeter `https://www.rtbrasilimport.com.br/sitemap.xml`. Posso te passar o passo a passo.
2. **Google Analytics 4** — criar property, me enviar o `G-XXXXXXX` que eu instalo no `index.html`.
3. **Google Business Profile** — cadastrar a empresa em Jaboticabal-SP (impacta SEO local).
4. **Bing Webmaster Tools** — opcional, mesmo sitemap.
5. **Backlinks** — solicitar listagem em motorex.com (parceiros internacionais), associações de motociclismo, parceiros revendedores.
6. **Revisão dos conteúdos** que eu rascunhar nos sprints 4.1-4.5 antes de publicar.
7. **Tabela da calculadora de óleo** (quando quiser destravar Sprint 5).

---

## Ordem de execução

Vou rodar Sprint 1 → 2 → 3 → 4 em sequência, fazendo commits por sprint para você acompanhar. Sprint 4 pode ser pausado/aprovado por página antes de seguir.

**Pronto para começar pelo Sprint 1 assim que você aprovar este plano.**
