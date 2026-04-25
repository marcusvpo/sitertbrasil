-- ============================================================
-- MIGRATION: Adicionar Token de Compra Yampi (purchase token)
-- Execute manualmente no SQL Editor do Supabase Dashboard
-- ============================================================
--
-- O Token de Compra é um ID alfanumérico único da Yampi (ex: M2NH6IHYID)
-- usado para construir URLs de checkout no formato:
--   https://{loja}.pay.yampi.com.br/r/{TOKEN}:{QTD},{TOKEN}:{QTD}
--
-- Ele é retornado pela API da Yampi no campo `token` de cada SKU
-- (GET /catalog/skus -> data[].token).

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS yampi_purchase_token text;
