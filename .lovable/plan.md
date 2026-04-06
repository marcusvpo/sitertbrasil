

# Criar Página do Parceiro Marcelo "Tchelo" Galiotto

## Resumo
Criar landing page completa seguindo a mesma estrutura dos outros parceiros, registrar rota e adicionar ao listing.

---

## Informações do Piloto (pesquisadas)

**Marcelo "Tchelo" Galiotto** — Natural de Flores da Cunha, RS. Irmão de Rodrigo Galiotto. Número #110. Instagram: @tchelo110. Piloto de Motocross com carreira sólida no cenário gaúcho e sul-brasileiro. Trabalha na empresa da família junto com o irmão.

**Conquistas confirmadas:**
- 1x Campeão Sul Brasileiro de Motocross
- 2x Campeão Gaúcho de Motocross
- 9x Campeão Regional de Motocross
- Dobradinha com o irmão Rodrigo no Campeonato Regional 2018

**Bio:** Marcelo e Rodrigo treinam juntos diariamente, trocam dicas de velocidade, mas na pista "é cada um por si". Marcelo é o mais dominante no cenário regional, com 9 títulos consecutivos. Pilota Honda com apoio da estrutura familiar Galiotto.

**Stats RPG:**
- Velocidade: 85 | Técnica: 90 | Resistência: 88 | Coragem: 92

---

## Arquivos e Alterações

### 1. Novo arquivo: `src/pages/parceiros/MarceloGaliotto.tsx`
- Copiar estrutura do RodrigoGaliotto.tsx como base
- Adaptar `img()` para `parceiros/marcelo/`
- Hero com `marceloRT.png`, número `#110`, Instagram `@tchelo110`
- HUD: "Piloto Ativo", "MX · 450cc", RaceNumberPlate "110"
- Achievements: 4 conquistas (1x Sul Brasileiro, 2x Gaúcho, 9x Regional, Dobradinha Regional 2018)
- Stats Bar: 12 títulos, medalhas, MX categoria
- Parallax sections usando foto1→foto5 na mesma ordem
- Bio com texto sobre a dupla de irmãos e domínio regional
- CTA final com nome "Marcelo"

### 2. Editar: `src/pages/Parceiros.tsx`
- Adicionar Marcelo ao array `partners[]`:
  - name: "Marcelo Galiotto", slug: "marcelo-galiotto", image: marcelo/marcelocard.png
  - role: "Piloto de Motocross", instagram: "@tchelo110", titles: 12, topAchievement: "9x Campeão Regional"

### 3. Editar: `src/App.tsx`
- Importar `MarceloGaliotto`
- Adicionar rota `/parceiros/marcelo-galiotto`

---

## Detalhes Técnicos
- Mesma UI, efeitos e componentes internos (FloatingIcons, DustParticles, RoostSpray, HUDOverlay, etc.)
- Mobile-first responsivo já aplicado no template base
- 3 arquivos modificados/criados
- Nenhuma dependência nova
- Todas as 7 imagens do bucket `parceiros/marcelo/` utilizadas

