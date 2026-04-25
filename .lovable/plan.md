## Confirmações importantes

1. **Lovable Cloud NÃO será usado.** Não vou rodar nenhuma migration via Lovable Cloud. Apenas vou **criar o arquivo `sql/migration_blog_posts.sql`** exatamente como está no patch. Você executa manualmente no painel do Supabase.
2. **Clonagem literal.** Vou aplicar cada hunk do `.patch` byte-a-byte. Nenhuma linha será reinterpretada, reformatada ou "melhorada". O resultado final dos arquivos tocados será idêntico ao commit `0aadaece`.

## Como vou garantir fidelidade ao patch

- Vou ler o patch já copiado em `/tmp/modificacoes.patch` e processar arquivo por arquivo.
- Para arquivos **novos** (criados pelo patch): escrevo o conteúdo exato extraído do patch.
- Para arquivos **modificados**: aplico cada hunk exatamente nos mesmos números de linha e com o mesmo conteúdo final.
- Após aplicar tudo, rodo `git apply --check` mental (diff manual) lendo cada arquivo modificado e comparando com o patch para garantir que nada divergiu.

## Escopo (idêntico ao patch)

### Arquivos novos
- `sql/migration_blog_posts.sql` — schema do blog (tabela `blog_posts` + bucket `blog` + RLS). **Você executa manualmente.**
- `src/pages/Blog.tsx` — listagem pública
- `src/pages/admin/AdminBlog.tsx` — lista no admin
- `src/pages/admin/AdminBlogForm.tsx` — formulário criar/editar com upload de capa

### Arquivos modificados
- `src/index.css` — base colors `0 0% 4%` → `0 0% 7%` (background, secondary, sidebar) + sigmoid ramps em `.section-motorex-pure::after` e `.section-motorex-glow-intense::after`
- `src/types/database.ts` — tipo `BlogPost`
- `src/lib/image-utils.ts` — helper `getBlogCoverUrl`
- `src/components/Header.tsx` — item "Blog" no menu
- `src/components/AdminLayout.tsx` — item "Blog" no sidebar admin
- `src/components/Footer.tsx` — reverter de `.footer-painted` para `bg-background`
- `src/pages/Index.tsx` — remover `section-motorex-no-bottom-fade` da seção "Contato Rápido"
- `src/App.tsx` — rotas `/blog`, `/admin/blog`, `/admin/blog/new`, `/admin/blog/:id`

## Entrega

Ao final, te entrego:
- Todos os arquivos clonados do patch.
- O arquivo `sql/migration_blog_posts.sql` pronto para você colar no SQL Editor do Supabase.
- Confirmação de que o build passa (`vite build`).

**Nada de Lovable Cloud. Nada de execução de SQL pela minha parte.**
