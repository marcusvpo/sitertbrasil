-- ============================================================
-- BLOG POSTS — tabela + storage bucket + policies
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- 1. TABELA
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  cover_image_path text,
  external_url text not null,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.blog_posts enable row level security;

-- 2. RLS — leitura pública dos posts ativos; admin manda em tudo
create policy "Anyone can read active blog posts"
  on public.blog_posts for select
  to anon, authenticated
  using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage blog posts"
  on public.blog_posts for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 3. BUCKET para imagens de capa
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

-- 4. STORAGE POLICIES
create policy "Anyone can read blog images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog');

create policy "Admins can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and public.has_role(auth.uid(), 'admin'));
