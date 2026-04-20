# Portfolio Website — Moksh Sharma

A modern, interactive personal portfolio built with **React**, **Vite**, **Three.js** (via React Three Fiber), and **Tailwind CSS v4**. It features a **WebGL hero background** that reacts to scroll, **Lenis** smooth scrolling, **Framer Motion** UI transitions, and a **data-driven** layout for projects, experience, and roles.

---

## Project purpose

Single-page portfolio highlighting:

- **Professional experience** — expandable cards sourced from `src/data/experience.ts` (internships and current role).
- **Projects & works** — eight featured projects with tags and GitHub / live links (`src/data/works.ts`).
- **Leadership & roles** — alternating motion cards (`src/data/roles.ts`).
- **About** — bio, skills grid, and education tabs.
- **Contact** — GitHub, LinkedIn, WhatsApp, and email (`Overlay.tsx` constants).
- **Résumé download** — PDF bundled with Vite (`src/assets/Moksh Resume.pdf`).

> **Note:** An `Achievements` carousel component exists (`src/app/components/Achievements.tsx` + `src/data/achievementsSlides.ts`) but is **not currently mounted** in the main overlay (placeholder comment in `Overlay.tsx`). Re-enable by importing and rendering `<Achievements />` where desired.

---

## Architecture & file structure

### Entry & app shell

| Path | Role |
|------|------|
| `index.html` | Root shell, Outfit font preconnect, viewport / safe-area styles |
| `src/main.tsx` | React 18 `createRoot` entry |
| `src/app/App.tsx` | R3F `<Canvas>` (Scene), Lenis `ReactLenis` scroll root `#portfolio-scroll`, loading gate, noise overlay |
| `vite.config.ts` | React + Tailwind v4 plugins, `@` → `src`, Figma asset resolver |
| `netlify.toml` | `npm run build`, publish `dist`, Node 20, SPA `/*` → `index.html` |

### UI & 3D

| Path | Role |
|------|------|
| `src/app/components/Overlay.tsx` | All sections: nav (md+), hero, about, projects, experience, roles, contact, footer |
| `src/app/components/Scene.tsx` | Scroll-synced 3D group (torus, knot, sparkles, stars, lights, environment) |
| `src/app/components/HeroMonogram.tsx` | Hero + footer **R3F** monogram in a bordered glass panel |
| `src/app/components/LoadingScreen.tsx` | Full-screen loader tied to `@react-three/drei` `useProgress`, eased bar, reduced-motion path |
| `src/app/components/Experience.tsx` | Experience accordion from `experience.ts` |
| `src/app/components/RolesSection.tsx` | Roles grid from `roles.ts` |
| `src/app/components/LoadingScreen.tsx` | Loader + progress logic |

### Data modules

| Path | Role |
|------|------|
| `src/data/works.ts` | `WORKS` — eight portfolio projects |
| `src/data/experience.ts` | `EXPERIENCE_ENTRIES` — four positions |
| `src/data/roles.ts` | `ROLES` — five leadership / society entries |
| `src/data/achievementsSlides.ts` | Deloitte + certifications + tech stack slides (for optional Achievements UI) |

### Styles

| Path | Role |
|------|------|
| `src/styles/tailwind.css` | `@import 'tailwindcss'`, `@source`, `@theme` (e.g. Outfit) |
| `src/styles/index.css` | App style entry imported by `main.tsx` |

### Assets

| Path | Role |
|------|------|
| `src/assets/Moksh Resume.pdf` | Résumé; imported in Overlay with `?url` for hashed build URL + `download` attribute |

---

## Key features

### 1. Loading experience

- Uses **drei** `useProgress()` so the bar tracks real GLTF / scene asset loading.
- **Minimum visible time** and **ease-out ramp** so the bar never feels instant or stuck (`MIN_VISIBLE_MS`, `RAMP_MS`, `easeOutCubic`).
- **`prefers-reduced-motion`**: simplified progress behavior without continuous RAF ramp.
- Overlay blocks interaction until load completes; canvas mounts after first paint (`mounted` in `App.tsx`).

### 2. Three.js background (`Scene.tsx`)

- **Scroll-driven** rotation and motion: reads `#portfolio-scroll` scroll ratio and lerps group transforms in `useFrame`.
- **@react-three/drei**: `Float`, `Stars`, `Sparkles`, `PerspectiveCamera`, `Environment`.
- **Geometries**: torus, torus knot, icosahedron, octahedron, sphere, ring — metallic / emissive materials, multiple lights.
- **Scene comment** documents scroll bands aligned with sections (hero → contact).

### 3. Hero monogram (`HeroMonogram.tsx`)

- Small **3D** scene (lights + mesh) used inside **glass** frames (hero + footer `compact` prop).
- Same visual language as project cards: `rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm`.

### 4. Smooth scroll & anchors

- **Lenis** (`ReactLenis`) wraps scrollable content; **anchor links** (`#hero`, `#about`, …) use `handleNavClick` with Lenis `scrollTo` when available, else fallback on `#portfolio-scroll`.
- Scroll offset accounts for **fixed nav height on md+**; nav is **hidden below `md`** (mobile has no top bar).

### 5. Motion & layout

- **Framer Motion**: section entrances, project / experience expand panels, staggered children.
- **TypeAnimation** (`react-type-animation`) for rotating hero subtitles (e.g. Data Analysis / Web Development).
- **Tech marquee** strip under hero (`TECH_BELT_ITEMS` in `Overlay.tsx`).

### 6. Projects section

- Accordion-style **Latest Works** list: click row to expand description, tags, and primary CTA (GitHub or Live Demo).
- Content entirely from **`WORKS`** in `works.ts`.

### 7. Contact

- Icon row: **GitHub**, **LinkedIn**, **WhatsApp** (`wa.me`), **mailto**.
- **No Netlify HTML form** in the current React build; to add Netlify Forms, add a `<form name="..." data-netlify="true" method="POST" hidden>` block per Netlify docs and rebuild.

---

## Website sections (DOM order)

1. **Hero** (`#hero`) — intro copy, name, typewriter, bio, résumé + contact CTAs, monogram card, marquee.
2. **About** (`#about`) — narrative + Skills / Education tabs.
3. **Experience** (`#experience`) — from `EXPERIENCE_ENTRIES`.
4. **Projects** (`#projects`) — from `WORKS`.
5. **Roles** (`#roles`) — from `ROLES`.
6. **Contact** (`#contact`) — headline + social links.
7. **Footer** — copyright + compact monogram.

---

## Design & theming

- **Background:** near-black (`#050505` / `#0a0a0a` accents in components).
- **Accents:** indigo / cyan gradients (hero, CTAs, typewriter).
- **Typography:** **Outfit** (Google Fonts, linked in `index.html`).
- **Glass panels:** `bg-black/20`–`bg-black/40`, `backdrop-blur`, subtle `border-white/5`–`border-white/10`.
- **Safe areas:** `env(safe-area-inset-*)` used on hero padding and scroll container where relevant.

---

## Technology stack

| Layer | Choice |
|-------|--------|
| UI | React 18, TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS **v4** (`@tailwindcss/vite`) |
| 3D | three.js, **@react-three/fiber**, **@react-three/drei** |
| Motion | **framer-motion**, **react-type-animation** |
| Scroll | **lenis** (`lenis/react`) |
| Icons | **lucide-react** |
| Deploy | **Netlify** (static `dist`, see `netlify.toml`) |

Additional libraries in `package.json` (Radix, MUI, charts, etc.) are available for future UI; the core portfolio path is R3F + Overlay + data files above.

---

## Scripts & local development

**Prerequisites:** Node.js **18+** (repo targets **20** on Netlify).

```bash
npm install
npm run dev
```

- Dev server: Vite default (`http://localhost:5173`).

**Production build:**

```bash
npm run build
```

- Output: **`dist/`** (upload to any static host or connect repo to Netlify).

---

## Deployment (Netlify + GitHub)

1. Push the repository to GitHub (include **`package-lock.json`** and **`netlify.toml`**).
2. Netlify → **Add new site** → **Import from Git**.
3. Build settings are read from **`netlify.toml`**:  
   - Build: `npm run build`  
   - Publish: `dist`  
   - Node: `20`  
   - SPA redirect: `/*` → `/index.html` (static files under `/assets/` still win).

No environment variables are required for the current codebase (`import.meta.env` unused).

---

## Customization guide

| Goal | Where to edit |
|------|----------------|
| Projects | `src/data/works.ts` |
| Experience | `src/data/experience.ts` |
| Roles | `src/data/roles.ts` |
| Skills / about copy | `Overlay.tsx` (constants + JSX) |
| Achievements content | `src/data/achievementsSlides.ts` + mount `Achievements.tsx` |
| 3D look / motion | `Scene.tsx`, `HeroMonogram.tsx` |
| Loader timing / curves | `LoadingScreen.tsx` |
| Contact URLs | `CONTACT_*` constants top of `Overlay.tsx` |
| Résumé file | Replace `src/assets/Moksh Resume.pdf` and keep import path in sync |
| Fonts / meta | `index.html` |

---

## Performance & UX notes

- **Large JS bundle:** main chunk includes Three + motion; Vite may warn about chunk size — optional future work: lazy routes or dynamic `import()` for heavy sections.
- **WebGL:** requires a capable GPU/driver; canvas is mounted after hydration to avoid SSR issues (SPA only).
- **Reduced motion:** respected in loader and some role cards; extend with `useReducedMotion` elsewhere if needed.
- **SEO:** extend `index.html` with description, Open Graph, and JSON-LD as needed.

---

## Known limitations

- Achievements **UI** not wired into `Overlay` (data + component exist).
- No integrated **contact form** in current React build (social + mail only).
- No automated tests in repo.
- Single-page **hash / in-page** navigation only (no React Router routes in use).

---

## Contact (author)

| | |
|--|--|
| **Name** | Moksh Sharma |
| **GitHub** | [github.com/moksh-sharma](https://github.com/moksh-sharma) |
| **LinkedIn** | [linkedin.com/in/msam1113](https://www.linkedin.com/in/msam1113/) |
| **Email** | moksh11072005@gmail.com |
| **WhatsApp** | [wa.me/9870306895](https://wa.me/9870306895) |

---

## License

Copyright © 2026 Moksh Sharma. All rights reserved.

Built with care — React, Vite, and Three.js on the modern web.
