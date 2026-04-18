

## Diagnóstico final — por que NADA funcionou

Olhei a print novamente. O problema é embaraçosamente simples e eu venho ignorando há várias tentativas:

**As seções verdes estão sendo renderizadas como blocos retangulares com `background-color: #26ad97` sólido. Não importa quantos `mask-image`, `::before`, `::after` ou "aurora blobs" eu adicione — o navegador ainda pinta um retângulo verde puro com bordas retas, e o olho humano vê isso ANTES de ver qualquer decoração.**

Todas as abordagens anteriores tentaram *esconder* o retângulo. Nenhuma eliminou o retângulo.

A única solução real é parar de ter um retângulo verde. A cor verde precisa **emergir do fundo preto como uma forma orgânica gigante**, não como uma seção HTML com cor de fundo.

## Nova abordagem — "Ambient Canvas"

Mato a cor de fundo verde de uma vez. O verde vira uma **camada decorativa global no `<body>`** posicionada com `position: fixed` ou camadas absolutas dentro de um container, pintada por radial-gradients gigantes (1200px+) que florescem nas regiões onde as seções MOTOREX existem. As "seções verdes" no HTML viram seções **transparentes** que apenas ocupam o espaço — o verde é pintado *atrás* delas pelo canvas global.

Como o verde nunca tem uma borda retangular (são radial-gradients de 1200px com `transparent 70%`), simplesmente **não existe corte** para acontecer. O preto e o verde se misturam organicamente em todos os pontos do gradiente, e o azul escuro RT (`#0a1628` / navy profundo) entra como uma terceira cor de transição entre os dois.

### Arquitetura visual

```text
       canvas global (position: absolute, full page height)
       ┌────────────────────────────────────────┐
       │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← preto puro
       │ ░░░░░░ navy ░░░░░░░░░░░░░░░░░░░░░░░░░ │
       │ ░░ ▓▓▓ GREEN BLOOM 1400px ▓▓▓ ░░░░░░░ │ ← onde fica MOTOREX
       │ ▓▓▓▓▓▓▓▓▓ #26ad97 ▓▓▓▓▓▓ navy ░░░░░░ │
       │ ░░ ▓▓▓ green dissolve ▓▓▓ ░░░░░░░░░░░ │
       │ ░░░░░░░░░░░░░ navy ░░░░░░░░░░░░░░░░░░ │
       │ ░░ ▓▓▓ GREEN BLOOM 1400px ▓▓▓ ░░░░░░░ │ ← onde fica Contato
       │ ▓▓▓▓▓▓▓▓▓ #26ad97 ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ │
       │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
       └────────────────────────────────────────┘
```

Não existe retângulo. Não existe borda. Existe apenas uma pintura.

### Implementação

**1. Remover completamente `background-color`, `mask-image` e todas as decorações de `.section-motorex-pure`**
- A classe vira só: `color: white` + grid texture sutil. Nada de cor de fundo.

**2. Criar `.ambient-canvas` no `Index.tsx`**
- Wrapper `<div className="relative">` envolvendo a página inteira da home
- Dentro dele, um `<div aria-hidden className="ambient-canvas" />` com `position: absolute; inset: 0; pointer-events: none; z-index: 0;`
- Esse div recebe múltiplos radial-gradients gigantes:
  - 2 blooms verdes `#26ad97` de ~1400px posicionados nas alturas onde ficam as seções MOTOREX (calculados com `calc()` ou `%` baseados em alturas aproximadas, ex: `at 50% 38%` e `at 50% 88%`)
  - 2 blooms navy `hsl(215 60% 12%)` deslocados como halos ao redor dos verdes para criar a transição preto → navy → verde
  - Tudo com `transparent 65-75%` para garantir dissolução total

**3. Conteúdo das seções fica em `z-index: 1`** — texto/cards permanecem nítidos sobre a pintura ambiente.

**4. Remover `.bleed-from-above` e `.bleed-from-below`** — não são mais necessárias, o canvas global resolve tudo.

**5. Adicionar `--rt-navy: 215 60% 10%`** no `:root` como cor intermediária oficial.

### Por que ISSO funciona (diferente das 6 tentativas anteriores)

- **Não existe `background-color` retangular em lugar nenhum** → impossível ter borda reta
- O verde é literalmente uma forma circular pintada → suas bordas são naturalmente curvas e desfocadas
- A transição preto → navy → verde usa 3 cores → muito mais suave que preto → verde direto
- Funciona com qualquer `overflow: hidden` porque tudo vive dentro do wrapper único
- A "seção" HTML continua existindo para layout/spacing, mas é visualmente transparente

### Arquivos a editar

- `src/index.css` — remover background/mask de `.section-motorex-pure`, remover `.bleed-from-*`, adicionar `.ambient-canvas` com os radial-gradients calibrados, adicionar variável `--rt-navy`
- `src/pages/Index.tsx` — envolver conteúdo em wrapper relativo, inserir `<div className="ambient-canvas" />` no topo, garantir `relative z-10` no conteúdo, remover classes `bleed-from-*` aplicadas anteriormente

### Calibração

Vou medir as posições aproximadas das seções MOTOREX em `Index.tsx` (ordem dos blocos) para posicionar os blooms corretamente. Se ficar fora de lugar, ajusto com 1-2 iterações de `at X% Y%`.

