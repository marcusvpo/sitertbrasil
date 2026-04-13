-- ============================================================
-- HOTFIX: Corrigir overflow dos IDs da Yampi
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- Erro corrigido: value "2801572591" is out of range for type integer
-- ============================================================

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

ALTER TABLE public.product_images
  ALTER COLUMN storage_path DROP NOT NULL;
