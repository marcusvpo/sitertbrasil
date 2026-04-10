

## Performance Optimization Plan — Mobile Focus

### Problem Summary

The site scores **62/100** on mobile performance. The biggest issues are:

1. **ScrollAnimation loads 81 PNG frames (~77MB total)** on every page load — this is the #1 bottleneck
2. **No image optimization** — banners/hero served as full-size JPG/PNG without modern formats, srcset, or sizing
3. **LCP element (logo)** missing `fetchpriority="high"` and explicit dimensions
4. **Render-blocking resources** — Google Fonts loaded synchronously
5. **No code splitting** — all pages imported eagerly in App.tsx
6. **No preconnect hints** for Supabase/Google Fonts origins

### Plan

#### 1. Lazy-load ScrollAnimation (biggest win ~62MB saved)

The scroll animation loads 81 PNGs (~1MB each) immediately on mount. On mobile, this component should be lazy-loaded AND the frames should only start loading when the component enters the viewport.

- Convert `ScrollAnimation` import in `Index.tsx` to `React.lazy()` with `Suspense`
- Inside `ScrollAnimation.tsx`, use `IntersectionObserver` to only begin loading frames when the container is near the viewport
- On mobile (`window.innerWidth < 768`), reduce frames to ~20 (every 4th frame) to cut download by 75%

#### 2. Optimize images in Index.tsx

- Add `fetchpriority="high"` to the hero image (`hero-motocross.jpg`)
- Add explicit `width` and `height` attributes to all `<img>` tags (hero, banners, logos) to prevent CLS
- Convert banner images to use `<picture>` with WebP source and JPG fallback (requires WebP versions in `/public/images/`)
- Add `loading="lazy"` to below-the-fold images (banners, institutional logo)

#### 3. Fix LCP — Header logo

The LCP element is the header logo. Changes to `Header.tsx`:
- Add `fetchpriority="high"` to the logo `<img>`
- Add explicit `width` and `height` attributes
- Add a `<link rel="preload">` in `index.html` for `/images/logo-motorex.png`

#### 4. Eliminate render-blocking Google Fonts

In `index.html`, change the Google Fonts `<link>` to use `media="print" onload="this.media='all'"` pattern, or switch to `font-display: optional` via a preconnect + async load approach:
- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to `<head>`
- Load fonts asynchronously using the `media="print"` swap trick

#### 5. Add preconnect hints

In `index.html`, add:
- `<link rel="preconnect" href="https://rxafivyrobvcsfglovsz.supabase.co">`
- `<link rel="preconnect" href="https://cdn.gpteng.co">`

#### 6. Lazy-load routes (code splitting)

In `App.tsx`, convert non-critical page imports to `React.lazy()`:
- Keep `Index` as eager (homepage)
- Lazy-load: `Motorex`, `ProductDetail`, `SejaRevendedor`, `QuemSomos`, `Parceiros`, all partner pages, `IndiqueCidade`, `Depoimentos`, `CentralAtendimento`, admin pages

This reduces the initial JS bundle significantly (est. savings ~137 KiB).

#### 7. Preload hero image

In `index.html`, add:
```html
<link rel="preload" as="image" href="/images/hero-motocross.jpg">
<link rel="preload" as="image" href="/images/logo-motorex.png">
```

### Files to modify

| File | Changes |
|---|---|
| `index.html` | Preconnect hints, preload hero/logo, async Google Fonts |
| `src/App.tsx` | Lazy imports for all routes except Index |
| `src/pages/Index.tsx` | Lazy-load ScrollAnimation, add fetchpriority/width/height/loading to images |
| `src/components/ScrollAnimation.tsx` | IntersectionObserver gate, reduced frames on mobile |
| `src/components/Header.tsx` | Add fetchpriority="high" and dimensions to logo |

### Expected Impact

- **FCP**: ~3.9s → ~1.5s (async fonts + preloads)
- **LCP**: ~7.9s → ~2.5s (preloaded logo, no render blocking)
- **TTI**: ~7.9s → ~3s (code splitting + deferred animation)
- **Total payload**: ~77MB → ~1MB on initial load (deferred animation frames)
- **Performance score**: 62 → estimated 85-95

