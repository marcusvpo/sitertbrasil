

# Criar Landing Page do Lorenzo Ricken

## Resumo
Criar a página dedicada ao parceiro Lorenzo Ricken seguindo exatamente a mesma estrutura, UI, efeitos e componentes da página do Heitor Matos. Adicionar o card na página de Parceiros e configurar a rota.

## Informacoes do Lorenzo (pesquisa)
- **Nome**: Lorenzo Ricken
- **Instagram**: @lorenzorr16
- **Numero de placa**: #16
- **Origem**: Rio Fortuna, Santa Catarina
- **Idade**: ~11 anos (nascido ~2014/2015)
- **Inicio**: Começou a andar de moto aos 4 anos, primeira competição aos 5
- **Equipe**: PowerHusky / Itaminas
- **Categoria atual**: 85cc / MXJr (2026)

**Titulos (~8 conquistas):**
1. Campeão Brasileiro MX 50cc (2022)
2. Campeão Arena Cross 50cc (2022)
3. Bicampeão Catarinense MX (2021-2022)
4. Bicampeão Brasileiro MX (2022-2023)
5. Bicampeão Arena Cross (2022-2023)
6. Campeão Arena Cross 65cc (2024)
7. Copa Latino-Americana de Minicross (representante Brasil)
8. Arena Cross 65cc 2025 (favorito/vencedor)

## Alteracoes

### 1. Criar `src/pages/parceiros/LorenzoRicken.tsx`
- Copiar estrutura completa do HeitorMatos.tsx
- Substituir todas as referencias:
  - Imagens: `parceiros/lorenzo/` (lorenzoRT.png, foto1.jpg, foto2.jpg, foto3.jpg, lorenzopng.png)
  - Nome: Lorenzo Ricken
  - Instagram: @lorenzorr16, link para instagram.com/lorenzorr16
  - Numero da placa: #16 (em vez de #300)
  - HUD category: MX · 85cc
  - Achievements: lista dos 8 titulos acima
  - Stats bar: 8 titulos, 1 modalidade, MX categoria
  - Bio: texto adaptado sobre o Lorenzo (catarinense de Rio Fortuna, comecou aos 4, equipe PowerHusky/Itaminas)
  - Textos decorativos: manter "BORN TO RIDE" e "FULL THROTTLE"
  - "Since 2019" (primeira competicao aos 5 anos)
  - CTA final: manter referencia a MOTOREX

### 2. Atualizar `src/pages/Parceiros.tsx`
- Adicionar Lorenzo ao array `partners[]`:
  - name: "Lorenzo Ricken"
  - slug: "lorenzo-ricken"
  - image: lorenzocard.png
  - role: "Piloto de Motocross"
  - instagram: "@lorenzorr16"
  - titles: 8
  - topAchievement: "Bicampeão Brasileiro MX"

### 3. Atualizar `src/App.tsx`
- Importar LorenzoRicken component
- Adicionar rota `/parceiros/lorenzo-ricken`

## Detalhes tecnicos
- Reutilizar todos os componentes internos (FloatingIcons, DustParticles, RaceNumberPlate, HUDCorners, HUDOverlay, CheckpointDivider, ParallaxSection, Counter, SpeedLines, RoostSpray) - copiados dentro do arquivo como no Heitor
- Imagens servidas do mesmo bucket Supabase: `parceiros/lorenzo/`
- Mesma estrutura de nomes de arquivo: lorenzoRT.png (hero), foto1.jpg, foto2.jpg, foto3.jpg (parallax)

