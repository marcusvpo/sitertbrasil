

# Integração Yampi API — Plano de Implementação

## Pré-requisito: Adicionar Secrets
Antes de qualquer código, precisamos adicionar 3 secrets ao projeto:
- `YAMPI_ALIAS` = `rt-brasil`
- `YAMPI_TOKEN` = `MuvmgVQzg0fBLIrLxRJWblU1Csazsfq5FA5xX8FR`
- `YAMPI_SECRET_KEY` = `sk_EQcPIdrapSu01G24KPvwJHLUr426hOvofWSY3`

---

## Alterações

### 1. Migration — Adicionar campos Yampi às tabelas existentes
```sql
ALTER TABLE public.products
  ADD COLUMN yampi_id integer UNIQUE,
  ADD COLUMN yampi_slug text,
  ADD COLUMN yampi_sku text,
  ADD COLUMN yampi_url text,
  ADD COLUMN synced_at timestamptz;

ALTER TABLE public.product_categories
  ADD COLUMN yampi_id integer UNIQUE;

ALTER TABLE public.product_images
  ADD COLUMN external_url text,
  ADD COLUMN yampi_id integer;
```

### 2. Edge Function: `supabase/functions/sync-yampi/index.ts`
- Valida JWT do admin via `getClaims()`
- Busca produtos da Yampi: `GET /v2/rt-brasil/catalog/products?include=skus,images,categories&limit=100`
- Upsert categorias por `yampi_id`
- Upsert produtos mapeando: name, slug, description, price (de `skus[0].price_sale`), compare_price, is_active
- Upsert imagens usando `external_url` (URLs da Yampi, sem copiar para Storage)
- Retorna contagem de criados/atualizados
- CORS headers incluídos

### 3. Tipos: `src/types/database.ts`
Adicionar campos `yampi_id`, `yampi_slug`, `yampi_sku`, `yampi_url`, `synced_at` ao `Product`, e `external_url` ao `ProductImage`.

### 4. Helper `getImageUrl` — 6 arquivos
Atualizar para priorizar `external_url` quando presente:
```ts
const getImageUrl = (img: ProductImage) =>
  img.external_url || `${SUPABASE_URL}/storage/v1/object/public/products/${img.storage_path}`;
```
Arquivos: `Index.tsx`, `Motorex.tsx`, `ProductDetail.tsx`, `CartDrawer.tsx`, `AdminProducts.tsx`, `AdminProductForm.tsx`

### 5. Admin: Botão "Sincronizar Yampi" em `AdminProducts.tsx`
- Botão no header ao lado de "Novo Produto"
- Chama `supabase.functions.invoke("sync-yampi")`
- Loading state + toast com resultado
- Invalida query após sucesso

### 6. CartDrawer: Checkout URL com `yampi_slug`
```ts
const yampiItems = items.map((i) => ({
  slug: i.product.yampi_slug || i.product.slug,
  qty: i.quantity
}));
```

---

## Resumo de Arquivos

| Arquivo | Ação |
|---------|------|
| Migration (campos yampi) | Criar |
| `supabase/functions/sync-yampi/index.ts` | Criar |
| `src/types/database.ts` | Editar |
| `src/pages/admin/AdminProducts.tsx` | Editar (botão sync + getImageUrl) |
| `src/pages/Index.tsx` | Editar (getImageUrl) |
| `src/pages/Motorex.tsx` | Editar (getImageUrl) |
| `src/pages/ProductDetail.tsx` | Editar (getImageUrl) |
| `src/components/CartDrawer.tsx` | Editar (getImageUrl + yampi_slug) |
| `src/pages/admin/AdminProductForm.tsx` | Editar (getImageUrl) |

