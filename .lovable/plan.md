

## Plano: Corrigir sincronização de imagens via API Yampi

### Problema Raiz
A Edge Function está usando o endpoint errado. A API da Yampi organiza imagens por **SKU**, não por produto. O endpoint correto é:
```
GET /v2/{alias}/catalog/skus/{skuId}/images
```

Além disso, a estrutura de resposta da Yampi retorna URLs dentro de objetos aninhados (ex: `small.url`, `thumb.url`), mas o código atual tenta extrair de campos planos (`img.url`, `img.image_url`), resultando em `null` para todas as imagens.

### Exemplo de resposta da Yampi (conforme documentação)
```text
{
  "data": [
    {
      "id": 123,
      "order": 1,
      "small": { "width": 500, "height": 500, "url": "https://images.yampi.me/..." },
      "thumb": { ... },
      "filter_image_url": "https://..."
    }
  ]
}
```

### Alterações

**1. Edge Function `supabase/functions/sync-yampi/index.ts`**
- Alterar o endpoint de busca de imagens de `/catalog/products/{id}/images` para `/catalog/skus/{skuId}/images`, usando o SKU ID do primeiro SKU de cada produto (já disponível em `yp.skus.data[0]`)
- Incluir `include=images` na query de listagem de produtos como fallback adicional
- Corrigir a extração de URL para buscar na estrutura correta: priorizar `img.small.url`, depois `img.thumb.url`, depois `img.filter_image_url`, e por último tentar campos planos como fallback
- Adicionar log detalhado das URLs extraídas para debug

**2. Frontend — sem alterações necessárias**
O `getProductImageUrl()` em `src/lib/image-utils.ts` e os componentes já suportam `external_url` corretamente. O problema é exclusivamente que as URLs nunca chegam ao banco de dados.

### Detalhes Técnicos

Mudança principal na extração de URL:
```text
// ANTES (não funciona com a estrutura da Yampi):
img.url || img.image_url || img.src || img.thumb

// DEPOIS (compatível com resposta real):
img.small?.url || img.thumb?.url || img.filter_image_url || img.url || img.image_url
```

Mudança no endpoint:
```text
// ANTES:
/v2/{alias}/catalog/products/{productId}/images

// DEPOIS:
/v2/{alias}/catalog/skus/{skuId}/images
```

### Pós-deploy
Após aprovar, será necessário fazer o redeploy da Edge Function via CLI do Supabase e re-executar a sincronização.

