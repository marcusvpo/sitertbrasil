export type AppRole = 'admin' | 'user';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
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
  // joined
  category?: ProductCategory;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  url?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}
