-- ============================================================
-- MIGRATION: Adicionar campos Yampi às tabelas existentes
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- ============================================================

-- 1. Campos Yampi na tabela products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS yampi_id bigint,
  ADD COLUMN IF NOT EXISTS yampi_slug text,
  ADD COLUMN IF NOT EXISTS yampi_sku text,
  ADD COLUMN IF NOT EXISTS yampi_url text,
  ADD COLUMN IF NOT EXISTS synced_at timestamptz;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'yampi_id'
      AND data_type = 'integer'
  ) THEN
    ALTER TABLE public.products
      ALTER COLUMN yampi_id TYPE bigint USING yampi_id::bigint;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
      AND conname = 'products_yampi_id_key'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_yampi_id_key UNIQUE (yampi_id);
  END IF;
END $$;

-- 2. Campo Yampi na tabela product_categories
ALTER TABLE public.product_categories
  ADD COLUMN IF NOT EXISTS yampi_id bigint;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'product_categories'
      AND column_name = 'yampi_id'
      AND data_type = 'integer'
  ) THEN
    ALTER TABLE public.product_categories
      ALTER COLUMN yampi_id TYPE bigint USING yampi_id::bigint;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.product_categories'::regclass
      AND conname = 'product_categories_yampi_id_key'
  ) THEN
    ALTER TABLE public.product_categories
      ADD CONSTRAINT product_categories_yampi_id_key UNIQUE (yampi_id);
  END IF;
END $$;

-- 3. Campos Yampi na tabela product_images
ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS yampi_id bigint;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'product_images'
      AND column_name = 'yampi_id'
      AND data_type = 'integer'
  ) THEN
    ALTER TABLE public.product_images
      ALTER COLUMN yampi_id TYPE bigint USING yampi_id::bigint;
  END IF;
END $$;

-- Permitir storage_path nulo (imagens externas da Yampi não usam storage)
ALTER TABLE public.product_images
  ALTER COLUMN storage_path DROP NOT NULL;
