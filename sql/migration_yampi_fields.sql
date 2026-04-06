-- ============================================================
-- MIGRATION: Adicionar campos Yampi às tabelas existentes
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- ============================================================

-- 1. Campos Yampi na tabela products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS yampi_id integer UNIQUE,
  ADD COLUMN IF NOT EXISTS yampi_slug text,
  ADD COLUMN IF NOT EXISTS yampi_sku text,
  ADD COLUMN IF NOT EXISTS yampi_url text,
  ADD COLUMN IF NOT EXISTS synced_at timestamptz;

-- 2. Campo Yampi na tabela product_categories
ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS yampi_id integer UNIQUE;

-- 3. Campos Yampi na tabela product_images
ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS yampi_id integer;

-- Permitir storage_path nulo (imagens externas da Yampi não usam storage)
ALTER TABLE public.product_images
  ALTER COLUMN storage_path DROP NOT NULL;
