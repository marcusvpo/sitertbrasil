

# Plano de Responsividade Mobile - Todas as Páginas

## Resumo
Refatorar o CSS de todas as páginas para abordagem mobile-first, corrigindo sobreposições, alvos de toque quebrados e layouts horizontais que não funcionam em telas < 768px.

---

## Arquivos e Alterações

### 1. Header (`src/components/Header.tsx`)
- Menu mobile já existe (`lg:hidden`). Ajustar padding e garantir que botões de menu/cart tenham min 44x44px de área de toque
- Scroll indicator no mobile: garantir espaçamento adequado

### 2. Página Lorenzo Ricken (`src/pages/parceiros/LorenzoRicken.tsx`)

**Hero Section (linha ~285-358)**
- Reduzir `h-screen` para `min-h-[80vh]` no mobile para evitar corte
- HUD Overlay: esconder ou simplificar no mobile (`hidden md:flex` nos HUD laterais)
- Texto h1: `text-[36px]` base mobile (atualmente `text-[60px]` sem breakpoint adequado)
- Badges row: `flex-col` no mobile em vez de `flex-wrap` para evitar sobreposição
- Hero text alignment: `text-center` no mobile, `text-right` apenas em `md:+`

**Stats Bar (linha ~361-381)**
- Grid `grid-cols-2` já funciona, manter. Reduzir padding: `p-4 md:p-8 lg:p-12`

**Achievements Section (linha ~415-469)**
- Achievement cards: reduzir padding, esconder o year number decorativo no mobile (`hidden md:block`)
- Icon box `w-14 h-14` -> `w-11 h-11 md:w-14 md:h-14` para caber melhor

**Bio/Profile Section (linha ~503-607)**
- Grid `md:grid-cols-5`: já é single-column no mobile. OK
- Stat bars grid `grid-cols-2`: manter, reduzir font sizes
- Botão Instagram: min-height 44px

**Parallax Sections**
- Reduzir `min-h-screen` para `min-h-[60vh] md:min-h-screen` no mobile
- Textos decorativos ("BORN TO RIDE", "FULL THROTTLE", "UNSTOPPABLE"): `text-[28px] md:text-[48px] lg:text-[80px]`

**MOTOREX Section (linha ~671-713)**
- Glass cards row: `flex-col` no mobile em vez de `flex-wrap`
- Garantir padding adequado

**CTA Final (linha ~715-755)**
- Padding: `p-6 md:p-10 lg:p-16`
- Botão: largura total no mobile `w-full md:w-auto`

### 3. Página Heitor Matos (`src/pages/parceiros/HeitorMatos.tsx`)
Aplicar as mesmas mudanças do Lorenzo (estrutura idêntica):
- Hero: h1 font-size mobile, HUD hidden, flex-col badges
- Stats, Achievements, Bio, Parallax, CTA: mesmos ajustes

### 4. Página Parceiros (`src/pages/Parceiros.tsx`)
- Cards grid já responsivo (`grid-cols-1 sm:grid-cols-2`). OK
- CTA "Quer ser parceiro": garantir `px-4` no mobile, botão `w-full sm:w-auto`

### 5. Página Index (`src/pages/Index.tsx`)
- Já usa breakpoints `md:`. Verificar:
  - Banner buttons (linhas 220-235): área de toque mínima 44px, `p-4` -> `p-3`
  - Marquee testimonials: `w-[280px] md:w-[340px]`
  - Contact links: `flex-col md:flex-row` para evitar wrap caótico

### 6. Componentes Compartilhados

**HUDOverlay** (ambos parceiros)
- Esconder no mobile: `hidden md:flex` no container principal
- Ou simplificar para apenas 1 badge no mobile

**ParallaxSection**
- `min-h-[60vh] md:min-h-screen` para não forçar scroll excessivo em mobile

**CheckpointDivider**
- Reduzir quantidade de tire marks no mobile (ou esconder)
- `py-4 md:py-8`

**RoostSpray**
- Reduzir SVG size no mobile: `w-[200px] md:w-[350px]`

---

## Regras Gerais Aplicadas

1. **Mobile-first**: valores base sem prefixo = mobile, `md:` = tablet+, `lg:` = desktop
2. **Touch targets**: todos os botões, links e áreas interativas com `min-h-[44px] min-w-[44px]`
3. **Sem absolute positioning para layout**: elementos decorativos mantêm absolute, conteúdo usa flex column
4. **Sem overflow horizontal**: textos grandes reduzidos, grids em single-column
5. **Font scaling**: h1 `text-[36px] md:text-[60px] lg:text-[100px]+`

---

## Detalhes Técnicos

- Nenhuma dependência nova necessária
- Todas as alterações são via classes Tailwind (responsivas)
- 5 arquivos modificados: `LorenzoRicken.tsx`, `HeitorMatos.tsx`, `Parceiros.tsx`, `Index.tsx`, `Header.tsx`
- Foco principal nos parceiros (maior complexidade visual)

