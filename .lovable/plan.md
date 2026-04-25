
## Objetivo

Substituir o link genérico de checkout atual (`https://rtbrasil.yampi.com.br/checkout?items=slug:qty,...` — formato inválido) por **URLs reais de checkout transparente da Yampi**, parametrizadas por `product_id` e `quantity` para cada item do carrinho.

## Estado atual

`src/components/CartDrawer.tsx` hoje monta:

```ts
const buildYampiUrl = (items) =>
  `https://rtbrasil.yampi.com.br/checkout?items=${slug:qty,...}`;
```

→ Esse formato **não é suportado** pela Yampi e provavelmente cai em erro/página vazia.

O schema já está pronto: a tabela `products` tem a coluna `yampi_id` (number) sincronizada pela edge function `sync-yampi`, e o tipo `Product` em `src/types/database.ts` já expõe esse campo.

## Estrutura correta (confirmada pelo usuário)

```
https://rtbrasil.yampi.com.br/checkout/add?product_id=ID1&quantity=Q1&product_id=ID2&quantity=Q2
```

Pares `product_id` + `quantity` se repetem em ordem para múltiplos produtos.

## Mudanças

### 1. `src/components/CartDrawer.tsx`

Reescrever `buildYampiUrl` para usar `URLSearchParams` com chaves repetidas:

```ts
const YAMPI_SUBDOMAIN = "rtbrasil";

const buildYampiCheckoutUrl = (items: { yampiId: number; qty: number }[]) => {
  const params = new URLSearchParams();
  for (const item of items) {
    params.append("product_id", String(item.yampiId));
    params.append("quantity", String(item.qty));
  }
  return `https://${YAMPI_SUBDOMAIN}.yampi.com.br/checkout/add?${params.toString()}`;
};
```

Atualizar `handleCheckout`:

```ts
const handleCheckout = () => {
  const valid = items.filter((i) => i.product.yampi_id);
  const missing = items.filter((i) => !i.product.yampi_id);

  if (valid.length === 0) {
    toast({
      title: "Produto indisponível para checkout",
      description: "Nenhum item possui ID Yampi cadastrado. Sincronize na área admin.",
      variant: "destructive",
    });
    return;
  }

  if (missing.length > 0) {
    toast({
      title: "Alguns itens foram ignorados",
      description: `${missing.length} produto(s) sem ID Yampi não entraram no checkout.`,
    });
  }

  const url = buildYampiCheckoutUrl(
    valid.map((i) => ({ yampiId: i.product.yampi_id!, qty: i.quantity }))
  );
  window.open(url, "_blank");
};
```

### 2. `src/contexts/CartContext.tsx`

Nenhuma mudança estrutural — `CartItem.product` já é `Product & { images? }`, então `yampi_id` já está disponível em runtime (a query `select("*")` em `Motorex.tsx` e `ProductDetail.tsx` traz esse campo).

Ainda assim, vou conferir as queries que populam o carrinho (`Motorex.tsx`, `ProductDetail.tsx`, `AdminVitrine.tsx`/HomeCarousel) para garantir que `select("*")` está em uso e `yampi_id` chega no objeto. Se alguma usar `select` específico, adiciono `yampi_id` à projeção.

### 3. Mensagem ao admin (opcional, mas recomendada)

No `AdminProducts.tsx`, exibir um indicador visual (badge "Sem Yampi ID") nas linhas onde `yampi_id` é null, para que o admin saiba quais produtos precisam de sincronização antes de aparecerem corretamente no checkout. — implementação simples: badge ao lado do nome.

### 4. Verificação do subdomínio

A URL de exemplo do usuário (`https://rt-brasil.pay.yampi.com.br/r/MXCDHR99Z3`) é uma página de **link rápido** (formato `/r/CODE`), diferente do checkout multi-item. O subdomínio do checkout multi-item é o da loja: hoje o código usa `rtbrasil.yampi.com.br`. Vou manter esse subdomínio (já estava em uso) — se estiver errado o usuário corrige em 1 iteração trocando a constante `YAMPI_SUBDOMAIN`.

## Arquivos a editar

- `src/components/CartDrawer.tsx` — nova função `buildYampiCheckoutUrl` + `handleCheckout` validando `yampi_id`
- `src/pages/admin/AdminProducts.tsx` — badge "Sem Yampi ID" para alertar admin (cosmético)
- (verificação) `src/pages/Motorex.tsx`, `src/pages/ProductDetail.tsx`, `src/components/HomeCarousel.tsx` — confirmar que as queries Supabase trazem `yampi_id`

## Fora de escopo

- Não vou alterar a edge function `sync-yampi` (ela já popula `yampi_id`)
- Não vou implementar checkout transparente embedado (iframe/popup Yampi) — apenas o redirect com URL parametrizada, que é o que o usuário pediu
- Não vou criar novo schema/migration — `yampi_id` já existe

## Pós-implementação

Pedirei ao usuário para:
1. Confirmar que os produtos têm `yampi_id` populado (ou rodar "Sincronizar Yampi" no admin)
2. Adicionar 2 produtos diferentes ao carrinho e clicar em "Finalizar Compra"
3. Validar que abre `https://rtbrasil.yampi.com.br/checkout/add?product_id=...&quantity=...&product_id=...&quantity=...` com os itens corretos pré-carregados
