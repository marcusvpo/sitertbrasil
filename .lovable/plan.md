Vou corrigir a integração do carrinho para usar o campo correto da Yampi: o `token` do SKU/produto, não `slug`, não SKU interno como `MT-1`, e não o ID numérico.

Plano de execução:

1. Criar suporte ao Token de Compra da Yampi
   - Adicionar o campo `yampi_purchase_token` no tipo `Product`.
   - Criar um arquivo SQL manual, por exemplo `sql/migration_yampi_purchase_token.sql`, com:
     - `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS yampi_purchase_token text;`
   - Não vou executar migration nem usar Lovable Cloud. O SQL ficará pronto para você executar manualmente no Supabase.

2. Corrigir a sincronização da Yampi
   - Atualizar `supabase/functions/sync-yampi/index.ts` para ler o campo `token` retornado pela API de SKUs da Yampi.
   - A documentação da Yampi confirma que `GET /catalog/skus`/SKUs contém:
     - `sku`: código interno/legível, exemplo `MT-1`
     - `token`: token de compra, exemplo esperado como `M2NH6IHYID`
     - `purchase_url`
   - O sync passará a salvar `sku.token` em `products.yampi_purchase_token`.

3. Corrigir a URL final do carrinho
   - Atualizar `src/components/CartDrawer.tsx` para usar exclusivamente `product.yampi_purchase_token` no checkout.
   - A URL gerada ficará exatamente no padrão:

```text
https://rt-brasil.pay.yampi.com.br/r/M2NH6IHYID:1,MXCDHR99Z3:2
```

   - O formato será:

```text
https://rt-brasil.pay.yampi.com.br/r/{TOKEN_DE_COMPRA}:{QUANTIDADE},{TOKEN_DE_COMPRA}:{QUANTIDADE}
```

   - Não haverá fallback para `yampi_slug`, porque isso foi justamente o erro que gerou URLs como `motorex-power-brake-clean:1`.
   - Também não haverá fallback para `yampi_sku`, porque isso geraria códigos como `MT-1`, que você confirmou estar incorreto.

4. Ajustar mensagens de erro
   - Se algum produto ainda não tiver `yampi_purchase_token`, o carrinho vai avisar claramente que falta o Token de Compra da Yampi e que é necessário sincronizar novamente após executar o SQL.

5. Validação
   - Rodar uma checagem/build para garantir que TypeScript e Vite compilam.
   - Resultado esperado: ao finalizar compra, produtos com tokens salvos geram exatamente URLs como:

```text
https://rt-brasil.pay.yampi.com.br/r/M2NH6IHYID:1,MXCDHR99Z3:2
```

Observação importante:
- Depois da alteração, será necessário executar manualmente o SQL no Supabase e rodar novamente a sincronização Yampi no admin para popular `yampi_purchase_token` nos produtos já existentes.