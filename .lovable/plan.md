

# Criar Página do Parceiro Otavio Oliveira

## Resumo
Criar landing page completa do parceiro Otavio Oliveira seguindo a mesma estrutura/UI dos outros parceiros, registrar rota e adicionar à listagem.

---

## Informações do Piloto

**Otavio Oliveira** — Natural de Ilicínea, MG. Número #05. Instagram: @otaviooliveira05. Pilota KTM 350 SX-F. Guia de trilhas off-road na região de Ilicínea, Minas Gerais. Também atua na compra e revenda de motos off-road. Perfil diferenciado dos demais parceiros: foco em trilhas e enduro, além do motocross.

**Perfil (baseado nas informações fornecidas):**
- Piloto de Motocross e Trilhas Off-Road
- KTM 350 SX-F — piloto número #05
- Guia de trilhas em Ilicínea, MG
- Compra e revenda de motos off-road
- Embaixador da cultura off-road mineira

**Stats RPG:**
- Velocidade: 82 | Técnica: 88 | Resistência: 90 | Coragem: 94

---

## Arquivos e Alterações

### 1. Novo arquivo: `src/pages/parceiros/OtavioOliveira.tsx`
- Copiar estrutura do RodrigoGaliotto.tsx como base
- Adaptar `img()` para `parceiros/otavio/`
- Hero com `otavioRT.png`, número `#05`, Instagram `@otaviooliveira05`
- HUD: "Piloto Ativo", "MX · KTM 350", RaceNumberPlate "05"
- Achievements adaptados ao perfil de trilheiro/piloto:
  - Guia de Trilhas Ilicínea MG
  - Piloto KTM 350 SX-F
  - Especialista Off-Road / Revenda de motos
  - Embaixador RT Brasil em Minas Gerais
- Stats Bar: títulos e medalhas adaptados ao perfil
- Parallax sections usando foto1→foto5 na mesma ordem
- Bio sobre o perfil de piloto/guia/revendedor de motos off-road
- CTA final com nome "Otavio"

### 2. Editar: `src/pages/Parceiros.tsx`
- Adicionar Otavio ao array `partners[]`:
  - name: "Otavio Oliveira", slug: "otavio-oliveira", image: otavio/otaviocard.png
  - role: "Piloto de Motocross & Trilhas", instagram: "@otaviooliveira05", titles adaptados, topAchievement: "Guia Off-Road Ilicínea MG"

### 3. Editar: `src/App.tsx`
- Importar `OtavioOliveira`
- Adicionar rota `/parceiros/otavio-oliveira`

---

## Detalhes Técnicos
- Mesma UI, efeitos e componentes internos (FloatingIcons, DustParticles, RoostSpray, HUDOverlay, etc.)
- Mobile-first responsivo já aplicado no template base
- 3 arquivos modificados/criados
- Nenhuma dependência nova
- Todas as 7 imagens do bucket `parceiros/otavio/` utilizadas

