

## Diagnosis: why every previous attempt failed

Every approach so far has tried to fade the green section *within its own bounding box*:
- `mask-image` → fades green to transparent, but the section ends exactly where the dark section begins → visible seam
- `::before/::after` bleed → killed by `overflow: hidden` on parent (`Layout` / `main`)
- Linear top-to-bottom gradients → look like a flat horizontal stripe, exactly what the user is rejecting

The root cause is architectural, not stylistic. As long as the transition lives **inside the green section**, there will always be a hard boundary. The reference image the user shared earlier shows an organic, painterly bleed — the green color *invades* the dark region in soft, irregular shapes (blobs/auroras), and the dark region *invades* the green with subtle navy patches. There is no straight horizontal line anywhere.

## New approach: the "Aurora Bridge"

Instead of fixing the boundary, I'll **dissolve it entirely** by placing organic, oversized radial blobs *in the dark sections themselves*, anchored to the edge that touches a green section. The green section keeps its pure `#26ad97` body with no fade — its edges stay sharp internally, but the dark section above/below paints organic green/cyan blobs that visually erase the seam.

### Architecture

```text
┌──────────────────────────────┐
│  DARK SECTION (e.g. Vitrine) │
│                              │
│        ░▒▓ green blob ▓▒░    │ ← painted INTO dark section
│   ▒▓██ cyan blob ██▓▒        │   from below, organic shape
├──────────────────────────────┤ ← seam is HERE but invisible
│ ████ PURE #26ad97 ████████   │   because blobs above already
│ ████ (no fade, no mask) ███  │   carry the green color across
│ ████████████████████████████ │
├──────────────────────────────┤ ← same trick on bottom edge
│   ░▒▓ green blob ▓▒░         │
│ DARK SECTION (e.g. Contato)  │
└──────────────────────────────┘
```

The dark page background acts as the canvas. Green doesn't fade — it *leaks* into the dark via independent decorative layers.

### Implementation

**1. Strip ALL fades from `.section-motorex-pure`**
- Remove `mask-image`, remove `::after` gradients
- Section becomes a pure flat `#26ad97` block with the grid texture and existing cyan accents
- Edges are sharp on purpose — the bleed lives outside

**2. Create two new utility classes for the *adjacent dark sections*:**

`.bleed-from-below` — applied to a dark section that sits *above* a green section. Uses an absolutely-positioned `::after` pinned to its bottom edge with `pointer-events: none`, containing 3 staggered radial-gradients in `#26ad97` + a hint of RT cyan, with irregular ellipse shapes and offsets so it never reads as a straight line:

```css
background:
  radial-gradient(ellipse 70% 90% at 25% 100%, hsl(164 64% 41% / 0.55), transparent 60%),
  radial-gradient(ellipse 55% 70% at 75% 100%, hsl(164 64% 41% / 0.40), transparent 65%),
  radial-gradient(ellipse 40% 50% at 50% 110%, hsl(197 100% 35% / 0.20), transparent 70%);
height: 320px; /* generous bleed zone */
```

`.bleed-from-above` — mirrored version for a dark section sitting *below* a green section, blobs pinned to its top edge.

**3. Apply in `Index.tsx`**
- The dark "Vitrine" / section preceding MOTOREX gets `.bleed-from-below`
- The dark section following MOTOREX gets `.bleed-from-above`
- "Contato Rápido" already has no bottom fade (sits before footer) — only needs top bleed handling on the section above it

**4. Why this finally works**
- No straight horizontal line — blobs are elliptical and offset asymmetrically
- The green color physically extends ~300px into dark territory
- Cyan RT accents blend both brand identities
- The pure `#26ad97` body is 100% preserved — zero pixels of fade inside the green section
- Works regardless of `overflow: hidden` on parents, because the bleed lives *inside* the dark section's own box

### Files to edit

- `src/index.css` — remove masks/fades from `.section-motorex-pure`, add `.bleed-from-below` and `.bleed-from-above` utility classes with organic radial-blob `::after`/`::before` pseudo-elements
- `src/pages/Index.tsx` — apply the two new classes to the dark sections immediately above and below each green MOTOREX section

I'll inspect `Index.tsx` once in default mode to identify the exact dark sections that border each green section before applying the classes.

