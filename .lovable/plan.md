

## Plano de Redesign Completo — RT Brasil / MOTOREX

### Resumo

Reestruturar toda a experiência visual do site: reposicionar a animação scroll, remover overlays dos banners, adicionar animações profissionais (scroll-triggered fade-ins, parallax, hover effects), e completar todas as páginas pendentes (Quem Somos, Depoimentos, Central de Atendimento melhorada). Parceiros fica como placeholder conforme solicitado.

---

### 1. Animações e Infraestrutura Visual

**tailwind.config.ts** — Adicionar keyframes profissionais:
- `fade-up`: translateY(40px) + opacity 0→1
- `fade-in-left` / `fade-in-right`: translateX(±60px) + opacity
- `scale-in`: scale(0.9) → 1
- `blur-in`: blur(10px) → 0 + opacity
- `slide-up`: para contadores/números

**Novo componente `AnimateOnScroll.tsx`** — Wrapper com IntersectionObserver que aplica animação quando o elemento entra na viewport. Props: `animation`, `delay`, `threshold`. Reutilizável em todo o site.

---

### 2. ScrollAnimation — Redimensionar e Reposicionar

**ScrollAnimation.tsx**:
- Reduzir altura de `81 * 5vh` (405vh!) para `81 * 2.5vh` (~200vh) — animação mais curta e dinâmica
- Mudar sticky de `top-0` para `top-16 md:top-20` (compensar navbar fixa)
- Reduzir altura do canvas sticky de `h-screen` para `h-[70vh]` com `rounded-lg` e margem lateral
- Adicionar leve sombra/glow ao redor do canvas

**Index.tsx** — Nova estrutura da Hero:
```text
┌─────────────────────────────────────┐
│  "Distribuidora Oficial MOTOREX"    │  ← tag pequena
│  "Performance Máxima Para Quem      │  ← h1 grande
│   Vive o Motocross"                 │
├─────────────────────────────────────┤
│                                     │
│    [ SCROLL ANIMATION CANVAS ]      │  ← animação aqui, menor
│                                     │
├─────────────────────────────────────┤
│  "Lubrificantes e produtos..."      │  ← subtítulo
│  [Quero ser revendedor] [Produtos]  │  ← CTAs
└─────────────────────────────────────┘
```

---

### 3. Banners — Remover Overlays, Respeitar Imagens

Em **TODAS** as páginas com banners (Index, Motorex, SejaRevendedor, QuemSomos, IndiqueCidade):
- **Remover** `bg-secondary/60` e `bg-secondary/40` overlays escuros
- **Remover** textos/títulos sobrepostos nos banners — as imagens já têm texto
- Manter apenas um botão CTA discreto no canto inferior com um leve gradient de baixo pra cima (`bg-gradient-to-t from-black/40 to-transparent`) apenas na faixa inferior (~80px)
- Banner Motorex: remover o h1 "Produtos MOTOREX" de cima do banner

---

### 4. Index.tsx — Redesign Completo

Cada seção envolvida por `<AnimateOnScroll>`:

- **Hero**: Título + animação + subtítulo/CTAs (conforme estrutura acima)
- **Produtos em Destaque**: Cards com hover scale + shadow + border glow. Animação staggered (delay incremental)
- **RT Brasil + MOTOREX (Institucional)**: Imagem com parallax leve. Lista de benefícios com ícones animados on-scroll
- **Banners Revendedor / Indique**: Imagem limpa, sem overlay pesado, apenas gradient sutil na base com botão
- **Depoimentos**: Cards com hover lift + animação staggered
- **Contato Rápido**: Ícones com hover rotate + color transition

---

### 5. Páginas Completas

**QuemSomos.tsx** — Página institucional real:
- Banner limpo (sem overlay)
- Seção "Nossa História" com timeline vertical animada (ano + milestone)
- Seção "MOTOREX no Mundo" com números/counters animados (100+ anos, 60+ países, etc.)
- Seção "Nossos Valores" com grid de ícones + texto
- CTA final para "Seja Revendedor"

**Depoimentos.tsx** — Página completa:
- Header com título estilizado
- Grid de cards de depoimentos (dados hardcoded por ora — 6-9 depoimentos)
- Cada card com avatar placeholder, stars, citação, nome/role
- Animação staggered on-scroll
- CTA "Tem um depoimento? Entre em contato"

**CentralAtendimento.tsx** — Upgrade:
- Banner/header visual (sem a foto, usar bg-secondary com pattern decorativo)
- Cards de contato com hover animations (lift + border glow)
- Formulário com labels estilizados, inputs com focus ring animado
- Mapa placeholder ou seção de endereço com ícone grande

**NotFound.tsx** — Redesign no estilo do site (bg-secondary, fonte Oswald, botão styled)

---

### 6. Header — Micro-interações

- Link ativo: underline animada (width 0→100%)
- Hover: slight translateY bounce
- Mobile menu: slide-in com stagger nos items

---

### 7. Footer — Polish

- Adicionar hover underline nos links
- Separar seções com linhas sutis
- Adicionar animação fade-up on-scroll

---

### Detalhes Técnicos

- **Nenhum pacote novo** — apenas Tailwind animations + IntersectionObserver nativo
- O componente `AnimateOnScroll` usa `useRef` + `IntersectionObserver` com `threshold: 0.1` e aplica classes CSS
- Todas as animações são CSS puras via keyframes no Tailwind config
- Banners mantêm `w-full h-auto block` para preservar proporções originais
- A animação ScrollAnimation mantém a lógica de canvas/frames, apenas reduz dimensões

### Arquivos modificados
1. `tailwind.config.ts` — novos keyframes
2. `src/components/AnimateOnScroll.tsx` — novo
3. `src/components/ScrollAnimation.tsx` — redimensionar
4. `src/components/Header.tsx` — micro-animações
5. `src/components/Footer.tsx` — polish
6. `src/pages/Index.tsx` — redesign completo
7. `src/pages/Motorex.tsx` — remover overlay do banner
8. `src/pages/QuemSomos.tsx` — página completa
9. `src/pages/SejaRevendedor.tsx` — remover overlay
10. `src/pages/IndiqueCidade.tsx` — remover overlay
11. `src/pages/Depoimentos.tsx` — página completa
12. `src/pages/CentralAtendimento.tsx` — upgrade visual
13. `src/pages/NotFound.tsx` — redesign
14. `src/pages/ProductDetail.tsx` — animações nos elementos

