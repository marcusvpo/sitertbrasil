

# Criar Página do Parceiro Rodrigo Galiotto

## Resumo
Criar a landing page completa do parceiro Rodrigo Galiotto seguindo a mesma estrutura/UI das páginas de Heitor Matos e Lorenzo Ricken, adicionar à listagem de parceiros e registrar a rota no App.tsx.

---

## Imagens Disponíveis (bucket `parceiros/rodrigo/`)
- `rodrigocard.png` — card na listagem
- `rodrigoRT.png` — hero principal
- `foto1.jpg`, `foto2.jpg`, `foto3.jpg` — seções parallax
- `foto4.jpg`, `foto5.jpg` — seções parallax adicionais (UNSTOPPABLE + MOTOREX)

Todas as 7 imagens serão utilizadas na página.

---

## Informações do Piloto (pesquisadas)

**Rodrigo Galiotto** — Natural de Flores da Cunha, RS. Piloto de Motocross e Velocross com mais de 15 anos de carreira. Número #720. Instagram: @galiotto.720.

**Conquistas confirmadas:**
- 4x Campeão Gaúcho de Motocross (MX3/MX4)
- Campeão Sul Brasileiro MX3 (2024)
- Campeão Sul Brasileiro Intermediária MX1 (2024)
- Campeão Sul Brasileiro VX (Velocross)
- 3º lugar MX4 — Brasileiro de Motocross 2025
- Tricampeão Regional de Motocross (2017, 2018, 2019)
- Top 10 Brasileiro de Motocross por 4 anos consecutivos
- 4 vitórias na abertura do Campeonato Pro Honda 2025
- Campeão Gaúcho de Velocross

**Bio:** Piloto veterano e resiliente, Rodrigo compete nas categorias MX3, MX4, Intermediária MX1 e Velocross. Pilota Honda com apoio familiar (irmão Marcello também é piloto). Representa a força do motocross gaúcho no cenário nacional.

**Stats RPG:**
- Velocidade: 88 | Técnica: 92 | Resistência: 95 | Coragem: 90

---

## Arquivos e Alterações

### 1. Novo arquivo: `src/pages/parceiros/RodrigoGaliotto.tsx`
- Copiar estrutura completa do LorenzoRicken.tsx (760 linhas)
- Adaptar `img()` para `parceiros/rodrigo/`
- Hero com `rodrigoRT.png`, número `#720`, Instagram `@galiotto.720`
- HUD: "Piloto Ativo", "MX · 450cc", RaceNumberPlate "720"
- Achievements array com 9 conquistas listadas acima
- Stats Bar: 12 títulos, 🥇 medalhas, 3 modalidades (MX/INT MX/VX), MX4 categoria
- Parallax sections usando foto1→foto5 na ordem, com textos decorativos adaptados:
  - "BORN TO RIDE" / Since 2010
  - "FULL THROTTLE" / Max Power
  - "UNSTOPPABLE" / Next Level
  - Seção MOTOREX com foto3.jpg
- Bio section: texto biográfico pesquisado, foto de perfil = rodrigoRT.png
- CTA final com nome "Rodrigo"

### 2. Editar: `src/pages/Parceiros.tsx`
- Adicionar Rodrigo ao array `partners[]`:
  ```
  { name: "Rodrigo Galiotto", slug: "rodrigo-galiotto", image: rodrigo/rodrigocard.png, role: "Piloto de Motocross & Velocross", instagram: "@galiotto.720", titles: 12, topAchievement: "4x Campeão Gaúcho MX" }
  ```

### 3. Editar: `src/App.tsx`
- Importar `RodrigoGaliotto` do novo arquivo
- Adicionar rota `/parceiros/rodrigo-galiotto`

---

## Detalhes Técnicos
- Mesma UI, efeitos e componentes internos (FloatingIcons, DustParticles, RoostSpray, HUDOverlay, CheckpointDivider, ParallaxSection, Counter, SpeedLines, RaceNumberPlate, HUDCorners)
- Mobile-first responsivo (já aplicado no template base)
- 3 arquivos modificados/criados
- Nenhuma dependência nova

