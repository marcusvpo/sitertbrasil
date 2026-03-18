

## Site RT Brasil — Distribuidora Oficial MOTOREX

Site institucional premium com estética motocross de alta performance, focado em geração de leads e vitrine de produtos.

### Etapa 1 — Fundação (Design System + Layout Base)
- Configurar paleta de cores da marca: Preto RT #111111, Azul Ciano #009DDF, Branco #FFFFFF em variáveis CSS HSL
- Configurar tipografia: fonte condensada bold para headlines (Oswald) + fonte legível para corpo (Inter)
- Copiar logo RT Brasil + MOTOREX para o projeto
- Criar componente Header com logo, menu principal (Home, Motorex, Seja um Revendedor, Quem Somos, Parceiros, Indique sua Cidade, Depoimentos, Central de Atendimento) + menu hambúrguer mobile
- Criar componente Footer com logo, links do menu, dados de contato (WhatsApp, e-mail, endereço) e link Instagram
- Configurar rotas para todas as 7 páginas

### Etapa 2 — Página Home (completa)
- **Hero principal**: fundo escuro #111111, headline forte "PERFORMANCE MÁXIMA PARA QUEM VIVE O MOTOCROSS", subheadline sobre distribuidora oficial, CTA primário "Quero ser revendedor" e CTA secundário "Conhecer produtos MOTOREX"
- **Bloco produtos destaque**: 4 cards de best-sellers (Cross Power 2T, Top Speed 15W50, etc.) com imagem, nome, categoria, selo "MAIS VENDIDOS", botão "Ver detalhes"
- **Bloco institucional resumido**: 2-3 parágrafos sobre RT Brasil + MOTOREX, bullet points (qualidade, performance, rendimento, preço, pronta entrega), CTA "Saiba mais"
- **Chamada revendedores + indicação**: dois blocos lado a lado com texto e botões para cada formulário
- **Carrossel de depoimentos**: 3-4 depoimentos com estrelas e nomes
- **Logos de parceiros/fabricantes**: linha de logos
- **Bloco contato rápido**: WhatsApp, e-mail, Instagram + botão "Central de Atendimento"

### Etapa 3 — Página Motorex (Vitrine de Produtos)
- Hero curto com fundo escuro + headline "LINHA COMPLETA DE LUBRIFICANTES E PRODUTOS MOTOREX"
- Barra de filtros: categorias (Óleos de Motor, Transmissão, Suspensão, Limpeza, Corrente, Outros), filtro de volume (1L, 5L, 25L, 60L), campo de busca
- Grade responsiva de cards de produto (3 col desktop, 2 tablet, 1 mobile) com categoria, nome, volume, selo, botão "Quero revender" e botão "Detalhes" (modal)
- Bloco institucional MOTOREX (história, títulos FIM, qualidade)

### Etapa 4 — Página Seja um Revendedor
- Hero institucional com fundo claro, título e subheadline
- Bloco institucional detalhado com texto extenso + bullets de vantagens
- Cards "Por que escolher MOTOREX?" (qualidade, performance, rendimento, preço)
- Bloco "Pronta entrega" (entrega 1-2 dias)
- Formulário com campos: Nome Completo, Nome da Empresa, E-mail, WhatsApp, checkbox consentimento — validação + mensagem de sucesso

### Etapa 5 — Página Quem Somos
- Hero com imagem de pista/loja, título "QUEM SOMOS"
- Bloco "Sobre a RT Brasil" com texto institucional organizado
- Bloco "Por que escolher MOTOREX?" (reutilizar componente)
- Bloco "História e tecnologia MOTOREX" (100+ anos, títulos FIM)
- CTAs duplos: "Quero ser revendedor" + "Indicar minha cidade"
- Espaço para vídeo incorporado (YouTube/Vimeo)

### Etapa 6 — Página Parceiros
- Hero curto com título "PARCEIROS RT BRASIL"
- Seção "Pilotos Parceiros": grade de cards com foto, nome, @Instagram, tag "Piloto", link para `/parceiros/nome-do-piloto`
- Seção "Revendedores Parceiros": cards com nome da loja, cidade/estado, botão "Saiba mais"
- Formulário para novos parceiros: Nome, Empresa, E-mail, Confirmação de E-mail, WhatsApp, checkbox consentimento

### Etapa 7 — Páginas de Formulário (Indique sua Cidade + Central de Atendimento)
- **Indique sua Cidade**: título, texto introdutório, formulário (Nome, WhatsApp, Nome da Cidade, Nome do Lojista, Contato do Lojista) + mensagem de sucesso
- **Central de Atendimento**: 4 cards de contato (WhatsApp, E-mail, Instagram, Endereço com links funcionais), formulário genérico (Nome, E-mail, WhatsApp, campo de texto "Como podemos te ajudar?") + mensagem de sucesso, mapa Google Maps incorporado

### Etapa 8 — Página Depoimentos
- Carrossel autoplay com navegação manual (setas + dots)
- Cada slide: texto do depoimento, nome, identificação, avaliação em estrelas (1-5)
- 3 depoimentos iniciais (André Ferreira, Carla Nunes, João Marques) + espaço para mais

### Diretrizes transversais
- Design mobile-first, totalmente responsivo
- Seções alternando fundo escuro (#111111 com texto branco) e fundo branco (texto #111111 com destaques #009DDF)
- Headlines em caixa alta, tipografia forte condensada
- Componentes reutilizáveis: ProductCard, TestimonialCard, PartnerCard, ContactForm, WhyMotorexCards
- Dados de produtos e parceiros estruturados em arrays/objetos para futura integração com backend (Supabase)
- SEO: títulos otimizados, meta descriptions, H1 único por página

