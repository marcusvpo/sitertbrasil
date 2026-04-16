

## Reformulação Visual — Degradês Suaves + Carrossel Corrigido

### Diagnóstico
1. **Degradês** atuais usam `h-24` com gradiente abrupto — resultado pesado e artificial.
2. **Carrossel** busca imagens do bucket corretamente via `supabase.storage.from("carrossel").list()`, mas os placeholders Unsplash aparecem porque o bucket pode retornar arquivos ocultos (como `.emptyFolderPlaceholder`). Os cards são pequenos (`basis-[33%]`).
3. **Seções `bg-motorex` puras** criam blocos sólidos demais — precisam de gradientes internos e transições orgânicas.

### Plano

#### 1. Carrossel — Cards maiores + imagens do bucket
- Remover `PLACEHOLDER_IMAGES` — se o bucket estiver vazio, não renderiza.
- Gerar URLs explicitamente para `motorex1.jpg` até `motorex12.jpg` em vez de usar `.list()`.
- Cards maiores: `basis-[90%] sm:basis-[70%] md:basis-[55%] lg:basis-[45%]`.
- Bordas `border-motorex` (#26ad97) com glow `shadow-[0_0_25px_rgba(38,173,151,0.4)]` no card ativo.
- Background: gradiente sutil `bg-gradient-to-b from-background via-motorex/20 to-background` em vez de `bg-motorex` sólido.

#### 2. Degradês suaves — abordagem Awwwards
Substituir todos os blocos `h-24 bg-gradient-to-b` por transições mais longas e orgânicas diretamente nas seções:
- Remover os `<div className="h-24 bg-gradient-to-b ...">` separados.
- Cada seção que antes era `bg-motorex` sólida agora usa `bg-gradient-to-b from-background via-motorex/30 to-background` (ou variações com `via-motorex/15` a `via-motorex/40` conforme contexto).
- Seção Institucional (Home): `bg-gradient-to-b from-motorex/5 via-motorex/25 to-motorex/5` com padding maior (`py-24 md:py-32`).
- Seção Contato Rápido (Home): `bg-gradient-to-b from-background via-motorex/20 to-background`.
- Footer: manter `bg-motorex` sólido (fixo conforme pedido).
- Header: manter `bg-motorex/95` (fixo conforme pedido).

#### 3. Páginas secundárias — mesma filosofia
- **QuemSomos** seção Stats: `bg-gradient-to-b from-background via-motorex/25 to-background` em vez de `bg-motorex`.
- **Depoimentos** CTA: `bg-gradient-to-b from-background via-motorex/30 to-background`.
- **CentralAtendimento** contact cards: gradiente sutil no container.
- Ajustar cores de texto nessas seções (manter legibilidade com `text-white` nas áreas mais escuras e `text-foreground` nas claras).

#### 4. CSS global — utilitário de transição
Adicionar classe `.section-motorex-glow` no `index.css`:
```css
.section-motorex-glow {
  background: linear-gradient(180deg, 
    hsl(0 0% 4%) 0%, 
    hsl(164 64% 41% / 0.18) 30%, 
    hsl(164 64% 41% / 0.25) 50%, 
    hsl(164 64% 41% / 0.18) 70%, 
    hsl(0 0% 4%) 100%
  );
}
```

### Arquivos afetados
- `src/components/HomeCarousel.tsx` — URLs explícitas, cards maiores, bg gradiente
- `src/pages/Index.tsx` — remover divs de transição, aplicar gradientes nas seções
- `src/pages/QuemSomos.tsx` — seção Stats com gradiente suave
- `src/pages/Depoimentos.tsx` — CTA com gradiente suave
- `src/pages/CentralAtendimento.tsx` — gradiente sutil
- `src/index.css` — classe utilitária `.section-motorex-glow`

