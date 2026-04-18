

## Objetivo

Aplicar a abordagem **"Ambient Canvas"** (que resolveu a home) em todas as outras páginas do site, eliminando recortes bruscos entre seções e criando uma pintura contínua verde-água `#26ad97` + navy + preto.

## Páginas a tratar

Inspecionei a lista de páginas. Vou aplicar o canvas em todas as páginas públicas:

1. `/motorex` (Motorex.tsx)
2. `/motorex/:slug` (ProductDetail.tsx)
3. `/quem-somos` (QuemSomos.tsx)
4. `/seja-revendedor` (SejaRevendedor.tsx)
5. `/depoimentos` (Depoimentos.tsx)
6. `/central-atendimento` (CentralAtendimento.tsx)
7. `/parceiros` (Parceiros.tsx) — **mantém o "game HUD aesthetic"** por restrição de memória, NÃO recebe o canvas

**Excluído:** páginas `/parceiros/*` individuais (HeitorMatos, LorenzoRicken, etc.) e admin — preservam estética própria.

## Estratégia

### 1. Refatorar `.ambient-canvas` para ser reutilizável

Hoje a classe tem posições calibradas para a home (`at 50% 38%`, `at 50% 102%`, etc.). Vou criar **variantes**:

- `.ambient-canvas` — variante home (atual, mantida)
- `.ambient-canvas-page` — variante genérica para páginas internas: blooms verdes distribuídos uniformemente ao longo da altura (topo, meio, base) + halos navy, sem depender de posições específicas de seções
- `.ambient-canvas-product` — variante para `/motorex` e `/motorex/:slug`: bloom verde mais concentrado no topo (hero) e base (CTAs), navy no miolo (catálogo)

Cada variante usa o mesmo princípio: radial-gradients gigantes (1200–1400px, `transparent 65–75%`) que florescem organicamente, sem retângulos.

### 2. Estrutura padrão por página

Cada página passa a ter:

```tsx
<div className="relative">
  <div aria-hidden className="ambient-canvas-page" />
  <div className="relative z-10">
    {/* conteúdo existente */}
  </div>
</div>
```

### 3. Remover backgrounds sólidos das seções internas

Preciso varrer cada página e remover/transparentar:
- `bg-background`, `bg-card`, `bg-black` aplicados em `<section>` que causam o recorte
- Manter apenas backgrounds em **cards/componentes pequenos** (glass-card, etc.) — esses não causam seam
- Substituir `bg-motorex` em CTAs grandes por `.section-motorex-pure` (que já é transparente e deixa o canvas pintar)

### 4. Footer

O footer já tem `.footer-painted` com mask orgânico. Como ele aparece em todas as páginas via `Layout`, ele já vai se integrar automaticamente ao novo canvas de cada página (o bloom verde no fim de cada `.ambient-canvas-page` casa com o verde sólido do footer).

## Arquivos a editar

- `src/index.css` — adicionar `.ambient-canvas-page` e `.ambient-canvas-product` com radial-gradients calibrados; manter `.ambient-canvas` da home intacta
- `src/pages/Motorex.tsx` — wrapper + canvas + remover `bg-*` de seções
- `src/pages/ProductDetail.tsx` — wrapper + canvas + remover `bg-*` de seções
- `src/pages/QuemSomos.tsx` — wrapper + canvas + remover `bg-*` de seções
- `src/pages/SejaRevendedor.tsx` — wrapper + canvas + remover `bg-*` de seções
- `src/pages/Depoimentos.tsx` — wrapper + canvas + remover `bg-*` de seções
- `src/pages/CentralAtendimento.tsx` — wrapper + canvas + remover `bg-*` de seções

**NÃO editar:** `Parceiros.tsx`, `parceiros/*`, páginas admin, `Layout.tsx`, `Footer.tsx` (já tratado), `Header.tsx`.

## Calibração

Vou ler cada página antes de aplicar para identificar quais seções têm fundos sólidos problemáticos. Se após aplicar algum bloom ficar mal posicionado em uma página específica, ajusto com 1 iteração de tuning das posições `at X% Y%`.

## Restrições respeitadas

- `/parceiros/*` permanece com estética game HUD (memória `constraints/preservacao-parceiros`)
- Cards internos (glass-card, gradient-border) mantêm seus backgrounds — só seções grandes ficam transparentes
- Cor primordial continua `#26ad97`, navy `hsl(215 60% 10%)` como transição

