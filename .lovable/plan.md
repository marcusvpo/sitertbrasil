

## Plano de Alterações

### 1. Remover Scroll Animation da Home
- Remover o `<Suspense>` + `<ScrollAnimation />` (linhas 132-135 de `Index.tsx`)
- Remover o lazy import do `ScrollAnimation` (linha 6)

### 2. Adicionar CNPJ em dados de contato
Adicionar "Rt Brasil Importação e Comércio - CNPJ: 00.913.926/0001-78" em:
- **`Footer.tsx`**: Na linha de copyright, junto ao nome RT Brasil
- **`QuemSomos.tsx`**: Na seção intro, abaixo da descrição
- **`Index.tsx`**: Na seção "Contato Rápido"

### 3. Cor MOTOREX (#26ad97) em mais elementos
Alterar a cor de vários botões e textos de `text-primary`/`bg-primary` para `text-motorex`/`bg-motorex`:
- **Preços dos produtos** em `Motorex.tsx` e `ProductDetail.tsx` e cards da home
- **Texto das categorias** (pills ativas) em `Motorex.tsx`
- **Botões CTA**: "Saiba mais", "Cadastre-se agora", "Ver todos os depoimentos", "Central de Atendimento" em `Index.tsx`
- **Botões de documentação** em `ProductDocumentation.tsx` (já parcialmente feito)

### 4. Descrição do produto ao lado direito com scroll fixo
Reestruturar `ProductDetail.tsx`:
- Mover `short_description` e `description` da coluna esquerda para a coluna direita
- Posicioná-los entre o `ProductRating` e o card de preço/carrinho
- Envolver a descrição em um bloco com `max-h-[300px] overflow-y-auto` para scroll interno
- O card de preço/ações permanece sticky abaixo da descrição

### 5. Timeline roadmap em QuemSomos
Substituir o layout atual (sticky panel + scroll items) por um **roadmap vertical** com:
- Linha central vertical com pontos/dots conectados
- Itens alternando esquerda/direita (desktop) ou todos à direita (mobile)
- Ano destacado no dot/node, texto ao lado
- Remover o sticky panel que está desalinhado

### Arquivos afetados
- `src/pages/Index.tsx` — remover animation, adicionar CNPJ, cor motorex nos botões
- `src/components/Footer.tsx` — adicionar CNPJ
- `src/pages/QuemSomos.tsx` — adicionar CNPJ, refazer timeline como roadmap
- `src/pages/ProductDetail.tsx` — mover descrição para coluna direita com scroll
- `src/pages/Motorex.tsx` — cor motorex nos preços e categorias

