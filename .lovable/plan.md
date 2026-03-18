

## Plano: Efeitos Premium — Glassmorphism, Liquid Glass, Clip-Path Buttons, Sliding Testimonials & Hero Image

### 1. CSS Global — Glassmorphism & Liquid Glass Utilities (`src/index.css`)

Add reusable utility classes:
- `.glass` — `backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg`
- `.glass-card` — glassmorphism for dark cards with subtle glow border
- `.liquid-glass` — animated gradient border + frosted glass + subtle color-shifting animation (hue-rotate keyframe)
- `.btn-clip` — CSS `clip-path: polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)` for geometric diagonal-cut buttons
- Grain/noise overlay utility via CSS pseudo-element (`.grain-overlay`)

### 2. Tailwind Config (`tailwind.config.ts`)

Add keyframes:
- `marquee` — continuous horizontal slide for testimonial carousel
- `shimmer` — subtle shine sweep for cards
- `hue-shift` — background hue rotation for liquid glass effect
- `grain` — translateX/Y jitter for animated grain texture

### 3. Button Component (`src/components/ui/button.tsx`)

Apply `btn-clip` class to default and primary variants (the clip-path polygon with 12px diagonal cuts on top-right and bottom-left). Remove `rounded-md` from those variants since clip-path defines the shape.

### 4. Spacing & Typography Adjustments (global)

- All `h1` headlines: `text-[42px] md:text-[64px]` (scaled proportions)
- Section padding: `py-8 md:py-16` (reduced from py-16/py-24) — compact professional feel
- Container max-width remains `1400px`

### 5. Index.tsx — Major Visual Upgrades

**Hero section**: Reduce padding, apply scaled headline sizes.

**Hero Image Section** (NEW — between institutional and revendedor banner):
- Full-width `hero-motocross.jpg` with:
  - Animated grain overlay (CSS `::before` with noise SVG filter + `grain` animation)
  - `backdrop-blur-sm` on a frosted overlay strip with text
  - Parallax-style `bg-fixed bg-cover`

**Testimonials → Sliding Carousel**:
- Replace static grid with infinite horizontal marquee (duplicate the array, use `animate-marquee` CSS)
- Cards get `.glass-card` styling
- Hover pauses animation (`hover:animation-play-state: paused` via group)

**Product cards**: Add `.glass-card` border treatment, shimmer on hover

**Banner sections**: Add liquid glass overlay to CTA buttons

### 6. All Pages — Apply Consistent Effects

**Header.tsx**: Apply `.glass` to the sticky header (frosted glass navbar)

**Cards everywhere** (QuemSomos stats, CentralAtendimento contact cards, Depoimentos): Apply `.glass-card` with the shimmer hover effect

**All primary buttons site-wide**: Get clip-path via the updated Button component

**CartDrawer.tsx**: Apply `.glass` to the drawer background

### 7. Depoimentos.tsx — Sliding Animation

Replace the static grid with the same infinite horizontal marquee pattern (2 rows, opposite directions for visual richness). Each card gets glass styling.

### Files Modified
1. `src/index.css` — glass utilities, grain overlay, btn-clip, marquee
2. `tailwind.config.ts` — marquee, shimmer, hue-shift, grain keyframes
3. `src/components/ui/button.tsx` — clip-path on default/primary variants
4. `src/pages/Index.tsx` — hero image section, sliding testimonials, spacing, glass cards
5. `src/components/Header.tsx` — glass navbar
6. `src/pages/Depoimentos.tsx` — sliding carousel layout
7. `src/pages/QuemSomos.tsx` — glass cards, spacing
8. `src/pages/CentralAtendimento.tsx` — glass cards, spacing
9. `src/pages/Motorex.tsx` — glass filter bar, spacing
10. `src/pages/ProductDetail.tsx` — spacing adjustments
11. `src/pages/SejaRevendedor.tsx` — spacing
12. `src/pages/IndiqueCidade.tsx` — spacing
13. `src/pages/NotFound.tsx` — spacing
14. `src/components/CartDrawer.tsx` — glass background
15. `src/components/Footer.tsx` — spacing

