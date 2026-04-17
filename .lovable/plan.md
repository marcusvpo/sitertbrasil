

## Carrossel "Lojas Parceiras" — Home + Página Parceiros

### Objetivo
Criar uma seção com carrossel infinito (marquee) exibindo logos de 22 lojas parceiras, com link para o site de cada uma, presente tanto na Home quanto em `/parceiros`.

### Componente novo: `src/components/LojasParceirasCarousel.tsx`

**Comportamento:**
- Marquee horizontal com auto-scroll contínuo (CSS `@keyframes` infinito, sem pulos).
- Pausa no hover.
- Direção: esquerda → direita (ou vice-versa, padrão LTR).
- Loop perfeito duplicando a lista de logos (técnica clássica de marquee CSS).
- Cada card é um `<a target="_blank" rel="noopener noreferrer">` linkando para o site da loja.

**Layout dos cards (uniformes):**
- Tamanho fixo: `w-[180px] h-[100px]` (proporção ~16:9, compatível com logos horizontais e quadradas).
- Fundo branco `bg-white` com border `border-motorex/20`, `rounded-lg`.
- Logo dentro com `object-contain` + `padding` interno (p-4) → garante imagem completa, sem corte/escala forçada.
- Hover: leve scale + glow cyan sutil + tooltip com nome da loja e cidade.

**Header da seção:**
- Tag (Oswald uppercase): "Rede de Revendedores"
- Título: "Lojas que confiam na **RT Brasil**" (RT Brasil em cyan)
- Subtítulo: "Revendedores oficiais MOTOREX em todo o Brasil"

### Dados (array dentro do componente)

Array de 22 objetos `{ nome, cidade, uf, url, logo }`.

**Observações importantes sobre os dados fornecidos:**
1. `logo-spinellioffroad` está sem extensão — vou assumir `.png` (confirmar visualmente após).
2. `Mercado MX` e `MotoX MX1` têm a mesma URL (`mercadomx.com.br`) — vou manter conforme passado.
3. URLs do Instagram serão tratadas igual (target=_blank).

### URL das imagens
```ts
const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const getLogoUrl = (file: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/parceiros/lojas-logos/${file}`;
```

### CSS (em `src/index.css`)
Adicionar keyframe `marquee` para scroll horizontal infinito:
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 60s linear infinite;
}
.animate-marquee:hover { animation-play-state: paused; }
```

Container usa `flex w-max` com a lista duplicada (`[...lojas, ...lojas]`) para loop sem corte. Wrapper externo com `overflow-hidden` e máscara fade nas bordas (`mask-image: linear-gradient(...)`).

### Integração

**`src/pages/Index.tsx`:** inserir `<LojasParceirasCarousel />` entre seções existentes — sugestão: logo após `HomeCarousel` (galeria MOTOREX) e antes do CTA final. Confirmo localização final ao implementar lendo o arquivo.

**`src/pages/Parceiros.tsx`:** inserir antes do bloco CTA "Quer ser um parceiro RT Brasil?". Mantém a estética de game preservada (constraint do projeto) — o carrossel é uma seção independente com estilo Dark Premium, separada visualmente por padding generoso.

### Arquivos afetados
- `src/components/LojasParceirasCarousel.tsx` (novo)
- `src/index.css` (keyframe marquee + classe `.animate-marquee`)
- `src/pages/Index.tsx` (importar + inserir seção)
- `src/pages/Parceiros.tsx` (importar + inserir seção)

### Pontos a validar pós-implementação
- Logo `spinellioffroad` carrega (extensão correta?).
- Logos com fundos transparentes (.png/.webp) ficam legíveis no card branco.
- Logos `.jpg/.jpeg` (com fundo próprio) não destoam visualmente.
- Performance do marquee em mobile (60s loop é suave).

