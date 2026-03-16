-- ============================================================
-- RT BRASIL MARKETPLACE - FULL DATABASE SETUP
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- ============================================================

-- 1. ENUM DE ROLES
create type public.app_role as enum ('admin', 'user');

-- 2. TABELA DE ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- 3. FUNÇÃO SECURITY DEFINER PARA CHECAR ROLE
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 4. RLS POLICIES PARA USER_ROLES
create policy "Users can read own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can manage all roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5. TABELA DE CATEGORIAS
create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.product_categories enable row level security;

create policy "Anyone can read categories"
  on public.product_categories for select
  to anon, authenticated
  using (true);

create policy "Admins can manage categories"
  on public.product_categories for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 6. TABELA DE PRODUTOS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10,2),
  compare_price numeric(10,2),
  category_id uuid references public.product_categories(id) on delete set null,
  volume text,
  badge text,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.products enable row level security;

create policy "Anyone can read active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage products"
  on public.products for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 7. TABELA DE IMAGENS DOS PRODUTOS
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  storage_path text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.product_images enable row level security;

create policy "Anyone can read product images"
  on public.product_images for select
  to anon, authenticated
  using (true);

create policy "Admins can manage product images"
  on public.product_images for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 8. FUNÇÃO PARA ATUALIZAR updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- 9. STORAGE BUCKET "products" (público)
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- 10. RLS STORAGE - qualquer um pode ler, admin pode gerenciar
create policy "Public read products bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'products');

create policy "Admins can upload to products bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete from products bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products' and public.has_role(auth.uid(), 'admin'));

-- 11. CATEGORIAS INICIAIS
insert into public.product_categories (name, slug, sort_order) values
  ('Motor', 'motor', 1),
  ('Transmissão', 'transmissao', 2),
  ('Suspensão', 'suspensao', 3),
  ('Limpeza', 'limpeza', 4),
  ('Corrente', 'corrente', 5);

-- ============================================================
-- APÓS EXECUTAR TUDO ACIMA, CRIE UM USUÁRIO ADMIN:
-- 1. Vá em Authentication > Users > Add User
-- 2. Crie um usuário com email/senha
-- 3. Copie o UUID do usuário criado
-- 4. Execute:
--    INSERT INTO public.user_roles (user_id, role) 
--    VALUES ('SEU-UUID-AQUI', 'admin');
-- ============================================================
