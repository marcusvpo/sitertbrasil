## Objetivo

1. Corrigir todas as menções de "Honda" para "KTM" na página `/parceiros/marcelo-galiotto` (KTM é parceira da MOTOREX).
2. Melhorar drasticamente a legibilidade dos textos que ficam sobre imagens de fundo (seções `ParallaxSection`) em todas as 5 páginas de parceiros, adicionando um fundo escuro com blur por trás do conteúdo de texto.

## Mudanças

### 1. MarceloGaliotto.tsx — Correção textual

Trocar "Honda" por "KTM" em duas ocorrências:
- Linha 583: `"Pilotando Honda com apoio da..."` → `"Pilotando KTM com apoio da..."`
- Linha 687: `"...para manter sua Honda sempre no limite..."` → `"...para manter sua KTM sempre no limite..."`

### 2. Legibilidade nas seções com imagem de fundo (5 arquivos)

O componente `ParallaxSection` é redefinido localmente em cada página de parceiro:
- `src/pages/parceiros/HeitorMatos.tsx`
- `src/pages/parceiros/LorenzoRicken.tsx`
- `src/pages/parceiros/MarceloGaliotto.tsx`
- `src/pages/parceiros/OtavioOliveira.tsx`
- `src/pages/parceiros/RodrigoGaliotto.tsx`

Em cada um deles, vou adicionar uma camada extra de overlay dentro do `ParallaxSection`, posicionada entre o gradient overlay existente e o conteúdo. Essa camada terá:
- Um gradiente radial escuro centralizado (`rgba(0,0,0,0.65)` no centro, suavizando para transparente nas bordas)
- Um leve `backdrop-filter: blur(4px)` aplicado apenas na área central via mask radial
- Resultado: o texto fica nítido e legível, mas a imagem continua visível ao redor preservando a estética "game HUD"

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 40%, transparent 75%)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    maskImage:
      "radial-gradient(ellipse at center, black 0%, black 35%, transparent 70%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at center, black 0%, black 35%, transparent 70%)",
  }}
/>
```

## Detalhes técnicos

- A estética "motocross game HUD" das páginas `/parceiros/*` é preservada (memória `mem://constraints/preservacao-parceiros`). Nenhum redesign Dark Premium é aplicado.
- A camada nova é puramente visual (`pointer-events-none`), não afeta cliques nem layout.
- O blur radial concentra-se apenas onde os textos aparecem (centro da seção), mantendo as bordas da imagem totalmente visíveis.
- Nenhuma alteração nos textos brancos/cinza existentes — apenas o fundo atrás deles é escurecido.

## Arquivos editados

- `src/pages/parceiros/MarceloGaliotto.tsx` (texto + overlay)
- `src/pages/parceiros/HeitorMatos.tsx` (overlay)
- `src/pages/parceiros/LorenzoRicken.tsx` (overlay)
- `src/pages/parceiros/OtavioOliveira.tsx` (overlay)
- `src/pages/parceiros/RodrigoGaliotto.tsx` (overlay)
