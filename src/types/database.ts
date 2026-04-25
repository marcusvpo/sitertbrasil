export type AppRole = 'admin' | 'user';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
  yampi_id?: number | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number | null;
  compare_price: number | null;
  category_id: string | null;
  volume: string | null;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Yampi sync fields
  yampi_id?: number | null;
  yampi_slug?: string | null;
  yampi_sku?: string | null;
  yampi_url?: string | null;
  synced_at?: string | null;
  // joined
  category?: ProductCategory;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  external_url?: string | null;
  yampi_id?: number | null;
  url?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  cover_image_path: string | null;
  external_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
