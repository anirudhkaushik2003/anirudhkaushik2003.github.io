# Solarpunk / Shinkai-Inspired Website Redesign

## Vision
Transform the website into a living terrarium — a Spirited Away sea-train-scene inspired world with pixelated clouds, shimmering water, and wandering pixel sprites. Content floats over the world on warm translucent cards. Full page background on every page.

## Color Palette
- **Background**: Warm sky gradient (bright blue → peach/gold at horizon)
- **Primary accent**: Golden amber `#d4a039` (afternoon sunlight)
- **Secondary accent**: Sky blue `#7cb9e8` (Shinkai sky)
- **Tertiary accent**: Leaf green `#6abf69` (solarpunk energy)
- **Text**: Warm dark brown `#3d3229`
- **Cards**: Semi-transparent warm white `rgba(255,252,245,0.75)` with `backdrop-filter: blur(8px)`

## World Layers (back to front)
1. **Sky** — warm gradient, fixed
2. **Clouds** — pixelated fluffy clouds, CSS animation drifting slowly
3. **Water** — bright blue band at bottom ~30-35%, shimmer/sparkle effect
4. **Horizon** — grass/hill silhouettes at waterline
5. **Sprites** — pixel cats, birds, fox, fish wandering in their zones
6. **Content** — website on warm translucent cards

## Task List

### #1 — Source and download pixel art assets `[pending]`
- 2-3 pixel cloud PNGs (different sizes, fluffy style)
- Pixel cat sprite sheet (idle + walk)
- Pixel bird sprite sheet
- Pixel fox sprite sheet
- Pixel fish sprite sheet
- Grass/hill silhouette PNGs for horizon
- Sources: itch.io, OpenGameArt (free-use)
- All small (<10KB each), works with `image-rendering: pixelated`

### #2 — Build sky and cloud layer `[pending]` ← blocked by #1
- Body background: warm sky gradient (blue top, peach/gold horizon)
- `position: fixed` cloud container with pixel cloud PNGs
- CSS `@keyframes` for clouds drifting at different speeds/heights
- Multiple instances at varying sizes for parallax depth
- Slow animation (60-90s per loop)

### #3 — Build water layer with shimmer effect `[pending]` ← blocked by #1
- Fixed bright blue water band, bottom ~30-35% of viewport
- Subtle CSS wave animation at waterline
- Sunshine sparkle: white dots with randomized fade-in/fade-out
- Gradient from bright top to deeper blue bottom
- Grass/hill silhouettes at horizon line
- Calm, still water feel (Spirited Away train scene)

### #4 — Create sprite animation system (JS) `[pending]` ← blocked by #1
- `assets/js/sprites.js` (~80 lines)
- Sprite manager spawning entities in zones:
  - Cats: walk along ground, pause, change direction
  - Birds: drift across sky
  - Fish: surface in water band
  - Fox: wander ground zone
- CSS `steps()` animation for sprite sheet frame cycling
- Slow, gentle movement
- Reduce sprite count on mobile

### #5 — Restyle content with warm translucent theme `[pending]`
- Overhaul `_sass/_customs.scss`
- Warm CSS variables (browns, amber, sky blue, green)
- Cards: semi-transparent warm backgrounds + backdrop blur
- Navbar: warm frosted glass
- Borders: subtle warm grays
- Shadows: warm, soft
- Buttons: gold primary, earthy secondary
- **Do NOT change any content, layout, stories, or concept art**

### #6 — Inject world layers into page layout `[pending]` ← blocked by #2, #3, #4, #5
- Add world layer divs to default layout
- Link `sprites.js`
- z-index ordering: world behind, content in front
- Content scrolls over fixed world

### #7 — Responsive adjustments and polish `[pending]` ← blocked by #6
- Mobile: fewer sprites, smaller clouds
- Mobile: water band adjusts proportionally
- Mobile: cards slightly more opaque
- Performance check (no animation jank)
- Consistency across all pages (about, blog, projects, publications)

## Files Changed
| File | Change |
|---|---|
| `_sass/_customs.scss` | Full rewrite — warm palette, translucent cards |
| `_includes/head.html` | Add world container markup |
| `_layouts/default.html` | Inject world layers |
| `assets/js/sprites.js` | **New** — sprite spawning/movement |
| `assets/img/world/` | **New** — pixel art assets |

## Not Touching
- Page content (about, blog, publications, projects)
- Stories and concept art rendering
- Layout structure (hero grid, feature cards, split panel, quick links)
- Fonts (Space Grotesk + Plus Jakarta Sans)
