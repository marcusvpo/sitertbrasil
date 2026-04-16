

## Plano de Alterações

### 1. Carrossel de fotos na Home (após hero)
- Criar componente `HomeCarousel.tsx` usando Embla Carousel com autoplay (5s)
- Buscar imagens do bucket Supabase `carrossel` via `supabase.storage.from('carrossel').list()`
- Cards de tamanho uniforme (aspect-ratio 16:9), borda `border-motorex` (#26ad97)
- Efeitos: fade/scale nas transições, glow sutil nos cards, animação de entrada
- Inserir na `Index.tsx` entre a hero e a seção "Produtos em Destaque"

### 2. Mesclagem de cores MOTOREX (#26ad97) no site
- Adicionar backgrounds `bg-motorex` em seções alternadas (Institucional, Contato Rápido, etc.)
- Ajustar textos para `text-white` ou `text-background` nessas seções para contraste
- Manter preto/azul nas demais seções (Hero, Depoimentos, Vitrine)
- Aplicar gradientes de transição entre seções escuras e verdes

### 3. Aumentar logo no Header e Footer
- **Header**: logo `h-8` → `h-10` (normal), `h-6` → `h-8` (scrolled)
- **Footer**: logo `h-10` → `h-14`

### 4. Formulários enviando email para vendas@rtbrasilimport.com.br
- Criar Edge Function `send-contact-form` que recebe os dados do formulário e envia email via `mailto:` link ou integração
- Como não há infraestrutura de email configurada, a abordagem mais simples: usar `mailto:` com dados preenchidos ou configurar envio via Supabase Edge Function
- Alternativa prática: usar `handleSubmit` para montar um `mailto:` link com os dados do formulário e abrir no navegador, ou salvar no banco e notificar
- **Implementação**: Criar tabela `form_submissions` no Supabase para armazenar os envios, e usar Edge Function para enviar email — OU — usar a abordagem simples de `mailto:` URL com dados codificados

### 5. Corrigir WhatsApp em /depoimentos
- Alterar `href` de `https://wa.me/5500000000000` para `https://wa.me/5516997964255`

### 6. Ajustar card de mapa na Home
- Envolver iframe em container com `max-w-2xl mx-auto rounded-2xl overflow-hidden`
- Usar mesma URL de embed do mapa da `CentralAtendimento.tsx` (coordenadas exatas: -21.250251, -48.350347)

### 7. Fundo branco no texto "Distribuidora Oficial MOTOREX no Brasil" na hero
- Adicionar `bg-white/90 text-background px-4 py-1.5 rounded` no `<span>` do subtítulo

### Arquivos afetados
- **Criar**: `src/components/HomeCarousel.tsx`
- **Editar**: `src/pages/Index.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/pages/Depoimentos.tsx`, `src/pages/SejaRevendedor.tsx`, `src/pages/CentralAtendimento.tsx`

### Nota sobre formulários
Para envio real de email, será necessário configurar uma Edge Function ou usar a infraestrutura de email do Lovable. A abordagem mais rápida seria salvar os dados numa tabela Supabase `form_submissions` e usar `mailto:` como fallback, ou configurar email via Lovable Cloud.

