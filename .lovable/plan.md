

## Plano: Carrinho Virtual Profissional

### Arquitetura

Carrinho 100% client-side usando React Context + localStorage para persistência. Sem banco de dados — o carrinho vive no navegador. O botão "Finalizar Compra" gerará uma URL para a Yampi (placeholder por ora, pronto para integração futura).

### Arquivos a criar/editar

**1. `src/contexts/CartContext.tsx`** — Context + Provider
- Estado: array de `{ product: Product, quantity: number }`
- Funções: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getTotal`, `getItemCount`
- Persistência em `localStorage` (key: `rt-brasil-cart`)
- Toast ao adicionar produto

**2. `src/components/CartDrawer.tsx`** — Drawer lateral (Sheet do shadcn)
- Lista de itens com imagem, nome, volume, preço unitário
- Controle de quantidade (+/- com min 1)
- Botão remover item
- Subtotal por item e total geral
- Botão "Finalizar Compra" → placeholder URL Yampi (`https://rtbrasil.yampi.com.br/checkout?items=...`)
- Botão "Continuar Comprando" fecha o drawer
- Estado vazio com ícone + CTA para ir à vitrine
- Animação de entrada lateral

**3. `src/components/CartIcon.tsx`** — Ícone flutuante no Header
- Ícone ShoppingCart com badge de quantidade (animado com scale bounce ao adicionar)
- Abre o CartDrawer ao clicar

**4. Editar `src/components/Header.tsx`**
- Adicionar CartIcon ao lado do CTA "Central de Atendimento" (desktop e mobile)

**5. Editar `src/App.tsx`**
- Envolver com `CartProvider`

**6. Editar `src/pages/Motorex.tsx`**
- Adicionar botão "Adicionar ao Carrinho" em cada card da vitrine (sobreposto na parte inferior do card, aparece no hover)
- `e.preventDefault()` + `e.stopPropagation()` para não navegar ao produto ao clicar no botão

**7. Editar `src/pages/ProductDetail.tsx`**
- Substituir/adicionar botão "Adicionar ao Carrinho" ao lado do WhatsApp
- Seletor de quantidade antes de adicionar

**8. Editar `src/pages/Index.tsx`**
- Adicionar botão "Adicionar ao Carrinho" nos cards de produtos em destaque

### Detalhes do botão Finalizar Compra (Yampi)

O botão gera uma URL no formato:
```
https://rtbrasil.yampi.com.br/checkout?items=SLUG:QTD,SLUG:QTD
```
Placeholder editável — quando o cliente fornecer o formato exato da Yampi, basta trocar a função `buildYampiUrl`.

### UX profissional
- Toast com nome do produto ao adicionar
- Badge animada no ícone do carrinho (pulse ao mudar)
- Drawer com scroll area para muitos itens
- Preços formatados em BRL
- Produtos sem preço mostram "Consulte" e não têm botão de carrinho
- Frete placeholder "Calculado no checkout"

