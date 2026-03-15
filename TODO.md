# Living World Website Rebuild — Build Plan

> **Theme**: Spirited Away train scene / Solarpunk terrarium
> **Mood**: Serene, meditative, warm golden-hour light, water everywhere, gentle motion
> **Rule**: Content is sacred — do not touch page text, blog posts, publications, or project descriptions.

---

## Phase 0: Foundation & Assets

- [ ] **0.1** Create `/assets/world/` directory for all living-world assets (sprites, CSS, JS)
- [ ] **0.2** Create pixel art cloud sprites (3–4 variants, varying sizes) as PNG or CSS box-shadow art
- [ ] **0.3** Create pixel cat sprite sheet (16×16, 4-frame walk cycle, idle frame, left/right)
- [ ] **0.4** Create additional critter sprites (bird fly-by, sleeping fox, frog near water)
- [ ] **0.5** Create pixel grass/ground tileset strip (repeating horizontal tile)
- [ ] **0.6** Create pixel flower and mushroom decorations for ground strip
- [ ] **0.7** Choose and integrate fonts — soft rounded heading font (Nunito/Quicksand) + clean reading font

## Phase 1: Sky Layer

- [ ] **1.1** Replace body/page background with warm golden-hour sky gradient (peach top → soft blue mid → horizon glow)
- [ ] **1.2** Add pixel cloud elements as absolutely-positioned divs/spans with slow `translateX` CSS animation (infinite loop, varying speeds for parallax depth)
- [ ] **1.3** Ensure clouds loop seamlessly (re-enter from opposite side)
- [ ] **1.4** Add 5–6 clouds at different vertical positions and sizes (closer = larger + faster, distant = smaller + slower)

## Phase 2: Water Layer

- [ ] **2.1** Create water section covering lower ~40% of viewport background — bright Ghibli blue (#3BAFDA → #62C4E0)
- [ ] **2.2** Add gentle CSS wave animation at the water surface (layered sine-wave keyframes with pseudo-elements)
- [ ] **2.3** Add sky reflection in water (flipped gradient, reduced opacity)
- [ ] **2.4** Build sunshine sparkle system — small JS module that spawns/fades tiny gold-white dots randomly on the water surface
- [ ] **2.5** Ensure water has subtle horizontal drift animation to feel alive

## Phase 3: Ground Strip & Sprites

- [ ] **3.1** Position pixel-art grass strip at a fixed/sticky layer above the water line
- [ ] **3.2** Scatter pixel flowers and small decorations along the ground strip
- [ ] **3.3** Implement cat sprite animator — CSS `steps()` for walk cycle frames
- [ ] **3.4** Write small JS module (~2–3KB) for sprite wandering AI: random direction, pause, idle, reverse, stay within bounds
- [ ] **3.5** Place 2–3 cats on the ground strip with independent wander behavior
- [ ] **3.6** Add occasional bird fly-by (rare, crosses screen slowly at cloud height)
- [ ] **3.7** Add sleeping fox / sitting frog as static-but-breathing sprites (subtle idle animation)

## Phase 4: Content Presentation Layer

- [ ] **4.1** Restyle content containers as frosted-glass cards (`backdrop-filter: blur()` + warm semi-transparent bg `rgba(255,248,240,0.85)`)
- [ ] **4.2** Add soft rounded corners, warm subtle border, gentle box-shadow to cards
- [ ] **4.3** Cards should feel like they float on the water / hover above the world
- [ ] **4.4** Restyle navbar — make it semi-transparent with blur, warm tones, integrate with sky
- [ ] **4.5** Restyle footer — integrate into the world (sits in/near the water layer)
- [ ] **4.6** Ensure text readability is excellent against the frosted card backgrounds

## Phase 5: Color & Theme System

- [ ] **5.1** Redefine SCSS color variables — sky blues, golden accents, soft greens, warm cream
- [ ] **5.2** Restyle links — warm gold (#E8A849) with soft glow hover effect (like sunlight catching)
- [ ] **5.3** Restyle buttons and interactive elements to match the warm palette
- [ ] **5.4** Handle dark mode: transition to a twilight/evening version — deep navy sky, moonlight on water, fireflies instead of sparkles, stars instead of clouds
- [ ] **5.5** Ensure all theme variables cascade properly through al-folio's existing theme system

## Phase 6: Page-Specific Polish

- [ ] **6.1** About page — profile photo with soft warm glow/border, inviting layout
- [ ] **6.2** Blog listing — post cards with gentle hover-lift animation
- [ ] **6.3** Blog post pages — keep story concept art rendering as-is unless improvement is obvious and approved
- [ ] **6.4** Projects page — project cards with organic hover effects, consistent with world theme
- [ ] **6.5** Publications/CV — clean and readable, world visible behind but not distracting

## Phase 7: Responsive & Performance

- [ ] **7.1** Ensure world layers scale properly on mobile (fewer clouds, smaller sprites, water still visible)
- [ ] **7.2** Reduce/disable sprite animations on `prefers-reduced-motion`
- [ ] **7.3** Performance audit — all world JS < 10KB total, sprite PNGs < 50KB total, no layout thrashing
- [ ] **7.4** Test on mobile viewports — sprites and clouds should not overflow or cause horizontal scroll
- [ ] **7.5** Test all pages end-to-end for visual consistency

## Phase 8: Final Integration & Cleanup

- [ ] **8.1** Remove any leftover al-folio default styles that conflict with the new theme
- [ ] **8.2** Cross-browser sanity check (Chrome, Firefox, Safari `backdrop-filter` fallback)
- [ ] **8.3** Final visual QA — does it feel like sitting on Chihiro's train? If not, iterate
- [ ] **8.4** Clean up any temporary files, remove TODO.md or keep as reference

---

## Architecture Overview

```
assets/world/
├── css/
│   └── world.scss          # All world-layer styles (sky, water, ground, clouds)
├── js/
│   ├── sparkles.js         # Sunshine sparkle spawner (~2KB)
│   └── sprites.js          # Sprite wandering AI (~3KB)
├── sprites/
│   ├── cloud-1.png         # Pixel cloud variants
│   ├── cloud-2.png
│   ├── cloud-3.png
│   ├── cat-walk.png        # Cat sprite sheet
│   ├── bird-fly.png        # Bird sprite sheet
│   ├── fox-sleep.png       # Fox idle sprite
│   ├── frog-sit.png        # Frog idle sprite
│   ├── grass-tile.png      # Repeating grass strip
│   └── decorations.png     # Flowers, mushrooms, etc.
```

### Build Order Rationale

We build **back-to-front** (sky → water → ground → sprites → content cards) because each layer visually depends on the one behind it. Content restyling (Phase 4) comes after the world exists so we can tune card opacity/blur against the actual background. Color system (Phase 5) comes after visual elements exist so we can see the palette in context. Polish and responsive fixes come last.

### Key Technical Decisions

1. **CSS-first animation** — clouds, waves, and sprite frames all use CSS keyframes + `steps()`. JS only handles randomized positioning/wandering.
2. **No heavy libraries** — no Three.js, no canvas (except maybe sparkles). Pure DOM + CSS transforms for GPU compositing.
3. **Sprite sheets** — single image files with CSS `background-position` stepping. Industry-standard game technique, tiny file sizes.
4. **`backdrop-filter`** for frosted glass — with solid-color fallback for browsers that don't support it.
5. **World container is fixed-position** — it sits behind all content as a `position: fixed` full-viewport layer, so it's always visible as you scroll. Content scrolls over it.
