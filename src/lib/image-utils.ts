import type { ProductImage } from "@/types/database";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";

export const getProductImageUrl = (img: ProductImage): string =>
  img.external_url || `${SUPABASE_URL}/storage/v1/object/public/products/${img.storage_path}`;
