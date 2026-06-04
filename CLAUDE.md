# Portfolio — CLAUDE.md

Developer guide for Claude Code.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Rendering | HTML5 Canvas 2D (the game world) + React DOM (overlays/sections) |
| Styling | Tailwind CSS (CDN) + CSS custom properties in `index.html` |
| Fonts | Cinzel · Rajdhani · Share Tech Mono (Google Fonts) |
| Deployment | GitHub Pages via GitHub Actions (`gh-pages` branch) |

---

## Concept: Playable driving game

This portfolio is **a game, not a scrolling page**. The visitor drives a car
around an isometric desert world. Each résumé section is a destructible
**cube building**. Crash the car into a building → it explodes → a cinematic
transition plays → that section opens in a modal panel. Close the panel → the
building rebuilds and the car respawns beside it.

Flow: `LoadingScreen` (press any key) → `GameWorld` (drive) → crash →
`LocationTransition` (cinematic) → `SectionPanel` (content) → close → respawn.

There is **no vertical scroll, no nav bar, no hero**. `App.tsx` is a small state
machine; the six résumé components are rendered only inside `SectionPanel`.

---

## Seasonal theming

The world re-skins by **season** (`components/themes.ts`):

| Season | Months | World | Ground / scenery |
|---|---|---|---|
| `desert` | Jun–Aug | DESERT | sand, saguaro cacti, sandstone, dry shrubs, gold flowers, sand wisps |
| `forest` | Mar–May · Sep–Nov | WOODLAND | grass, leafy/blossom trees, mossy rock, berry bushes, falling leaves |
| `ice`    | Dec–Feb | TUNDRA | snow/ice tiles, snowy pines, ice boulders, snow mounds, snowfall |

- `seasonForMonth(month)` picks the default from `new Date().getMonth()`.
- `ThemeToggle` (top-right) lets the user switch; choice persists to
  `localStorage['portfolio-season']`.
- Switching shows `SeasonTransition` — a **fully opaque** themed loader (solid
  `#080A0E` base + accent glow on top; nothing shows through).
- `GameWorld` takes a `theme: Theme` prop mirrored into `themeRef`. The render
  loop reads `PAL = themeRef.current` **every frame**, so a season change is a
  live palette swap — the world is *not* torn down/rebuilt (the map is small;
  no dynamic reload). Weather reinits only when `PAL.id` changes. `drawTree` /
  `drawProp` branch on `PAL.id`; ground/walls/bg/skid/dust read from `PAL`;
  ambient weather (`drawWeather`) is screen-space falling leaves/snow/sand.

**Buildings, coins, emblems, banner titles, and the car stay constant across
seasons** (white buildings + red car). Only the environment changes. Each
season's ground is kept at a **medium tone** so the white buildings always
contrast (notably `ice` is a medium icy-blue, not white-out).

Accent is **white/silver**, not gold. Canvas accent shades: `G1 #FFFFFF` ·
`G2 #C8D0DC` · `G3 #6C7686`. Section/portal colours (`gameData.ts`) are faintly
tinted whites. CSS tokens in `index.html` `:root` are white-on-neutral-dark —
the legacy names `--g-gold/-bright/-blue/-purple/-green/-red` are **now white /
grey shades**; trust values, not names. The season toggle + `SeasonTransition`
use each season's own accent (desert warm-orange, fall orange, winter ice-blue).

---

## Project Structure

```
/
├── App.tsx                        # State machine: loading → game → transition → panel
├── index.tsx                      # React entry point
├── index.html                     # HTML shell — CSS vars, Tailwind config, fonts, keyframes
├── vite.config.ts                 # Vite config — port 3000, path alias
├── types.ts                       # Project interface (rarity fields)
├── assets/
│   ├── profile.png                # Profile photo (About)
│   ├── university.png             # USC photo (Education)
│   └── files/resume.pdf
│
└── components/
    ├── gameData.ts                # PORTALS[] — section id/label/position/gold colours
    ├── themes.ts                  # Season type + THEMES palettes + seasonForMonth()
    ├── GameWorld.tsx              # THE GAME — isometric canvas: car, buildings, scenery, physics
    ├── LoadingScreen.tsx          # Boot screen — "PORTFOLIO GRAND PRIX", gold, press-any-key
    ├── SeasonTransition.tsx       # Themed loader shown while switching seasons
    ├── ThemeToggle.tsx            # Top-right season switcher (persists to localStorage)
    ├── LocationTransition.tsx     # Cinematic overlay when entering a section
    ├── SectionPanel.tsx           # Modal wrapper that renders the section components below
    ├── ControlsHint.tsx           # Bottom-left controls card (car keys)
    ├── About.tsx                  # Character Sheet — portrait, stat table, ability bars
    ├── Education.tsx              # Origins — USC card + campus image
    ├── Experience.tsx             # Quest Log — jobs as quests with rarity badges
    ├── Projects.tsx               # Arsenal — filterable project cards
    ├── ProjectCard.tsx            # Item card — rarity border, brackets, tags, links
    ├── Skills.tsx                 # Ability Tree — 4 groups, gold-shade headers
    ├── Contact.tsx                # Guild Hall — contact channel panel
    ├── Footer.tsx                 # (not currently mounted by App.tsx)
    └── hooks/useInView.ts         # Intersection Observer (fires immediately inside the panel)
```

---

## GameWorld.tsx — the engine (all canvas 2D)

Single `useEffect` runs a `requestAnimationFrame` loop. Key pieces:

- **Isometric projection** `iso(wx,wy,wz)` — 2:1 diamond tiles (`TW=80, TH=40`),
  `CZ=36` px per world-unit of height. `sp()` adds camera + screen centre.
- **`drawCube()`** — the primitive: top + right + left face with shading via
  `shd(hex, factor)`. Everything (buildings, car, debris, walls) is built from it.
- **Painter's algorithm** — every frame pushes all objects into `rq[]` and sorts
  by depth (`wx+wy`, then `gz`) so nothing z-fights.
- **Car** — `drawCar()` is direction-aware via forward/right unit vectors from
  `carAng`. Tapered red body, blue glass greenhouse, racing stripe, 4 chunky
  wheels (far wheels drawn before body, near wheels after), headlights with beam
  cones, taillights. Arcade physics: accel/brake/steer, steering scales with
  speed, boundary bounce inside `BORDER`.
- **Buildings** — `MONUMENTS[id]` defines each section as a **voxel sculpture**
  (layers bottom→top of `foot`×`foot` char grids; legend `W` body · `D` dark
  base · `A` accent · `G` glowing window · `.` empty). `parseMonument()` flattens
  + depth-sorts them into `cells`. Sculptures: About = pedestal+orb, Education =
  graduation cap, Experience = windowed skyscraper, Projects = rocket, Skills =
  crystal spire, Contact = antenna tower. Each has an `accent` colour used for
  its iconic detail, an apex **light beam** + pulsing orb + rising sparkles.
  To add/restyle a building, edit `MONUMENTS` (and `PORTALS` for placement).
- **Crash** — `smash()` converts every cube into a `FlyingCube` with physics +
  spawns gold star & coin particles; screen `shake` + white `flash`; after 700ms
  calls `onEnter(id)`.
- **Floating titles** — drawn in a top pass after the world so banners are never
  occluded; bob with a per-building sine offset.
- **Respawn** — parent sets `respawnAt`; the loop rebuilds that tower and places
  the car beside it.
- **Controls** — WASD / arrow keys (keydown/keyup sets). Tap/click a building
  also enters it. HUD (speed gauge, controls, hint) is drawn on canvas.

To add/move a section: edit `gameData.ts` (`PORTALS`) and add a matching entry
to `SHAPES` in `GameWorld.tsx`.

---

## App.tsx state machine

`gameReady` (loading done) · `transitPort` (cinematic active) · `openId` (panel
section) · `respawnAt` (rebuild signal). A fully-opaque `z-48` backstop covers
the canvas whenever an overlay is active so the game never flashes through during
transitions. `lastCrashedId` drives the respawn target on panel close.

---

## Commands

```bash
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build → ./dist
npm run preview  # Preview build locally
```

---

## Deployment

Push to `main` → GitHub Actions → build → publish `./dist` to `gh-pages`.

---

## Content

| What | Where |
|---|---|
| Profile photo | `assets/profile.png` (imported in `About.tsx`) |
| USC photo | `assets/university.png` (imported in `Education.tsx`) |
| Resume | `assets/files/resume.pdf` |
| Section list / positions / colours | `components/gameData.ts` — `PORTALS[]` |
| Building sculptures / accents | `components/GameWorld.tsx` — `MONUMENTS` |
| Seasonal palettes / scenery | `components/themes.ts` — `THEMES` |
| Projects data | `components/Projects.tsx` — `projects[]` |
| Work experience | `components/Experience.tsx` — `quests[]` |
| Skills | `components/Skills.tsx` — `skillGroups[]` |
| Contact channels | `components/Contact.tsx` — `channels[]` |

---

## Change Log

| Date | Summary |
|---|---|
| 2026-06-03 | Voxel monuments — replaced 3×3 height-map silhouettes with per-section cube sculptures (rocket, grad cap, skyscraper, crystal, antenna, pedestal) via `MONUMENTS`; accent light-beam + apex orb + sparkles; debris scatters in real voxel colours. |
| 2026-06-03 | White/silver palette (replaced gold); neutral-dark UI; per-season medium-tone grounds. Slower car (accel 0.003, top speed 0.15); visible 4-wheel tyre trails; exhaust smoke. |
| 2026-06-03 | Seasonal theming — `themes.ts` (desert/forest/ice by month), `ThemeToggle` + `SeasonTransition` loader, season-branching scenery + ambient weather in `GameWorld`. Drift physics (heading vs velocity, handbrake, skid marks, dust, DRIFT HUD). |
| 2026-06-03 | Desert re-skin + single-hue gold palette. Proper car (real wheels, arches, windshield, beams). Per-section building silhouettes via height-maps + emblems + lit windows. Floating banner titles. |
| 2026-06-02 | Converted to a playable isometric driving game — `GameWorld` canvas engine, crash-to-open cube buildings, `LoadingScreen` / `LocationTransition` / `SectionPanel` flow. Earlier RPG/portal and side-scroller iterations replaced. |
| 2026-05-31 | Developer-themed single-page scroll (fully replaced). |
