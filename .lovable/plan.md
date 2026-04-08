

# Overhaul Visual Ultra-Premium — RT Brasil

Refatoração completa da camada visual do site RT Brasil para estética dark premium Awwwards-level, mantendo toda lógica de negócio intacta. Páginas de Parceiros não serão tocadas.

---

## Escopo: 10 arquivos em 6 etapas

---

## ETAPA 1 — CSS Global + Tailwind Config

**`src/index.css`**
- Substituir glassmorphism genérico por sistema dark premium com `bg-[#0a0a0a]`
- Adicionar utilitários CSS puros:
  - `.mesh-gradient` — fundo com radial-gradients sobrepostos ultra-desfocados (ciano + roxo) para volume
  - `.border-beam` — animação de gradiente cônico girando na borda dos botões via `@property` + `conic-gradient`
  - `.card-glare` — pseudo-elemento que segue variáveis CSS `--mx`/`--my` para brilho radial mouse-tracking
  - `.neon-focus` — `box-shadow` difuso em inputs no `:focus-within` (brilho ciano vazando)
  - `.gradient-border` — borda com gradiente usando `mask-composite` para cards de valores
  - `.aurora-bg` — mesh gradient animado com keyframes de posição
  - Partículas CSS (poeira flutuante) via pseudo-elementos animados
- Ajustar `.glass` e `.glass-card` para tons mais escuros (opacidade reduzida, bordas mais sutis)
- Remover `grain-overlay` excessivo

**`tailwind.config.ts`**
- Adicionar keyframes: `border-beam` (rotação 360deg do gradiente cônico), `float-dust` (translate aleatório + fade), `glow-breathe` (pulsação de box-shadow suave)
- Adicionar animações correspondentes
- Manter todas as existentes intactas

---

## ETAPA 2 — Header como Dynamic Island

**`src/components/Header.tsx`**
- Refatorar para "Floating Dynamic Island":
  - Container fixo centralizado com `max-w-fit`, `rounded-full`, fundo `bg-[#0a0a0a]/80 backdrop-blur-2xl`, borda `border border-white/[0.06]`
  - No scroll: diminui padding levemente via transição
  - Item ativo: "pílula" de fundo animada com `layoutId` simulado via CSS (pseudo-elemento com `transition: left, width` baseado no índice ativo calculado com refs)
  - Links com hover que revela underline sutil animado
  - Logo à esquerda, nav pills no centro, CTA "Central de Atendimento" à direita com `border-beam`
- Mobile: overlay fullscreen dark com links centralizados e entrada stagger

---

## ETAPA 3 — Home (`Index.tsx`)

**Hero Section** (substituir seções de título + ScrollAnimation):
- `min-h-screen` com imagem `hero-motocross.jpg` em `position: fixed` para parallax nativo
- Máscara pesada: `bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent`
- Tipografia gigante (clamp 80-140px) com `mix-blend-mode: difference` ou sobre a máscara
- Partículas de poeira CSS flutuando (6-8 divs absolutas com `animation: float-dust`)
- Manter `ScrollAnimation` como seção independente abaixo

**Seção Vitrine** (Featured Products):
- Layout assimétrico: primeiro produto em `col-span-2 row-span-2` (destaque grande), demais em grid normal
- Cada card com efeito `.card-glare` (mouse tracking via `onMouseMove` setando `--mx`/`--my`)
- Imagem com parallax no hover: `group-hover:scale-110` + overlay escuro `group-hover:bg-black/20`
- Fundo com `.mesh-gradient` sutil atrás da seção

**Marquee de Depoimentos**:
- Aplicar `transform: rotate(-2deg)` no container do marquee para efeito dinâmico de pista
- Cards com `.gradient-border`

**Banners (Revendedor, Indique)**:
- Adicionar mesh gradient overlay em vez de gradient simples
- CTAs com `border-beam`

**Contato Rápido**:
- Fundo `bg-[#0a0a0a]` com `.mesh-gradient`, cards de contato com `.gradient-border`

---

## ETAPA 4 — Motorex (Catálogo)

**`src/pages/Motorex.tsx`**
- Barra de filtros: pílulas com estilo neon quando ativas (`bg-primary/10 border border-primary text-primary shadow-[0_0_12px_hsl(197_100%_43.7%/0.3)]`), inativas com `bg-white/5 border-white/10`
- Product cards: adicionar `onMouseMove`/`onMouseLeave` para `.card-glare` (brilho que segue o mouse)
- Skeleton loading: shimmer cintilante via `background: linear-gradient(-90deg, ...)` animado com `@keyframes shimmer`
- Grid mantém 2/3/4 colunas mas com gap maior e fundo `bg-[#0a0a0a]`

---

## ETAPA 5 — Quem Somos

**`src/pages/QuemSomos.tsx`**
- Timeline como Sticky Scroll: layout `grid grid-cols-1 md:grid-cols-2`
  - Coluna esquerda: `sticky top-20` com ano gigante + ícone, muda conforme scroll (via Intersection Observer nos itens da direita)
  - Coluna direita: itens normais com espaçamento grande (`py-32`) para dar espaço de scroll
- Grid de Valores: cada card com `.gradient-border` (borda gradiente iluminada via mask-composite)
- Stats: números com glow sutil atrás (`text-shadow`)
- Fundo geral `bg-[#0a0a0a]` com `.mesh-gradient`

---

## ETAPA 6 — Páginas de Formulário (Revendedor, Indique, Atendimento, Depoimentos)

**`SejaRevendedor.tsx`, `IndiqueCidade.tsx`, `CentralAtendimento.tsx`**:
- Headers com `.mesh-gradient` escuro
- Formulários em card com fundo `bg-white/[0.03]`, borda `border-white/[0.08]`
- Inputs com `.neon-focus`: no `focus-within`, brilho ciano difuso (`box-shadow: 0 0 20px hsl(197 100% 43.7% / 0.15)`)
- Botão submit com `border-beam`
- Cards de contato (CentralAtendimento) com `.gradient-border`

**`Depoimentos.tsx`**:
- Marquee com `transform: rotate(-2deg)` igual à Home
- Cards com `.gradient-border`
- CTA final com `.mesh-gradient` no fundo

**`ProductDetail.tsx`**:
- Glow radial atrás da imagem principal (`absolute, radial-gradient ciano, blur-3xl, opacity-20`)
- Gallery com fundo `bg-[#0a0a0a]`, thumbnails com borda neon quando ativas
- Price box com `.gradient-border`
- Botão "Adicionar ao Carrinho" com `border-beam`

**`Footer.tsx`**:
- Fundo `bg-[#050505]`, borda top super sutil
- Links com hover underline animado

---

## Componentes auxiliares a criar

1. **`src/components/GlareCard.tsx`** — Wrapper que aplica mouse tracking glare via `onMouseMove`, exporta para uso em Motorex e Index
2. **`src/components/BorderBeamButton.tsx`** — Wrapper do Button com animação de borda giratória (ou integrado via classe CSS `.border-beam` no `index.css`)

---

## Arquivos modificados/criados

| Arquivo | Ação |
|---------|------|
| `src/index.css` | Reescrever utilidades visuais |
| `tailwind.config.ts` | Adicionar keyframes/animações |
| `src/components/Header.tsx` | Reescrever JSX (Dynamic Island) |
| `src/pages/Index.tsx` | Reescrever JSX (Hero imersivo + vitrine assimétrica) |
| `src/pages/Motorex.tsx` | Reescrever JSX (filtros neon + glare cards + shimmer) |
| `src/pages/QuemSomos.tsx` | Reescrever JSX (sticky scroll timeline) |
| `src/pages/SejaRevendedor.tsx` | Reescrever JSX (formulário premium) |
| `src/pages/IndiqueCidade.tsx` | Reescrever JSX (formulário premium) |
| `src/pages/CentralAtendimento.tsx` | Reescrever JSX (formulário + cards premium) |
| `src/pages/Depoimentos.tsx` | Reescrever JSX (marquee inclinado + gradient borders) |
| `src/pages/ProductDetail.tsx` | Reescrever JSX (glow + gallery premium) |
| `src/components/Footer.tsx` | Reescrever JSX (dark premium) |

---

## O que NÃO será alterado

- `src/pages/Parceiros.tsx` e todo `/parceiros/*`
- Toda lógica de negócio: hooks, queries, CartContext, Supabase, react-query
- Componentes UI base do shadcn (button, input, etc.) — apenas classes aplicadas nos consumidores
- Rotas do App.tsx
- Admin pages
- ScrollAnimation.tsx (mantido como seção na Home)

---

## Execução

Devido ao volume de código, a implementação será feita em 3 blocos:
1. **Bloco A**: CSS + Tailwind + Header + Footer (infraestrutura visual)
2. **Bloco B**: Index + Motorex + ProductDetail (páginas de produto)
3. **Bloco C**: QuemSomos + SejaRevendedor + IndiqueCidade + CentralAtendimento + Depoimentos

