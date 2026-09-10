# ŪRDHV ASCENS - AGENT HANDOFF DOCUMENT

> **Generated**: September 10, 2026  
> **Workspace**: `c:\Users\D.Solanki\urdhv-ascens`  
> **Primary Specification Reference**: [`visual-changes.md`](file:///c:/Users/D.Solanki/urdhv-ascens/visual-changes.md) and [`docs/superpowers/specs/2026-09-10-urdhv-ascens-ecosystem-design.md`](file:///c:/Users/D.Solanki/urdhv-ascens/docs/superpowers/specs/2026-09-10-urdhv-ascens-ecosystem-design.md)

---

## 1. Executive Summary & Ecosystem Architecture

Ūrdhv Ascens is a high-performance digital architecture studio and educational platform. The workspace is divided into two decoupled frontend applications and a deployment bundle:

```
urdhv-ascens/
├── apps/
│   ├── main-site/        # Next.js 16 (App Router, Turbopack) - Public Studio Storefront & Admin CMS
│   └── viewer/           # Vite + React 18 + TypeScript - Zero-Leakage WebP Booklet Reader SPA
├── urdhvascens/          # Static production export directory for Hostinger/PHP/cPanel deployment
│   ├── api/              # PHP backend endpoints (content.php, booklets.php, ads.php, upload.php)
│   │   └── data/         # JSON data stores (content.json, booklets.json, ads.json)
│   └── index.html        # Synced from apps/main-site/out/
├── tools/
│   └── local-dev-server.mjs # Standalone Node HTTP server on port 8080 simulating PHP API & CDN
├── cloudflare CDN booklets/ # Documentation and migration scripts for Cloudflare R2 / CDN
├── visual-changes.md     # Master requirements and negative constraints document
└── HANDOFF.md            # Mirror of this handoff document in workspace root
```

### Active Dev Environments & Ports
| Application / Service | Path | Port | Dev Command / Task | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Main Storefront & CMS** | `apps/main-site` | `http://localhost:3000` | `npm run dev` (Task `task-688`) | Next.js 16 + Tailwind |
| **Booklet Viewer SPA** | `apps/viewer` | `http://localhost:5173` | `npm run dev` (Task `task-682`) | Vite + React + Canvas |
| **Local Mock API & CDN** | `tools/local-dev-server.mjs` | `http://localhost:8080` | `node tools/local-dev-server.mjs` (Task `task-1566`) | Serves `/api/*` and booklet assets |

---

## 2. Completed Features & State of Play

### A. Hero Section
- **Headline**: Changed to **`We help you to Ascend.`**
  - Removed `uppercase` transform class in [`Hero.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/sections/Hero.tsx#L58-L60) so the exact requested capitalization is displayed.
  - Sizing adjusted for mobile (`text-3xl sm:text-5xl md:text-7xl lg:text-8xl`).
- **Background**: Blurred logo graphic ([`favicon.png`](file:///c:/Users/D.Solanki/urdhv-ascens/urdhvascens/assets/images/favicon.png)) centered in hero background, editable via the Admin Panel (`backgroundBlur`, `backgroundOpacity`).
- **Glow Removal**: All glowing outer shadows (`shadow-[0_0_...px]`) removed across the entire site in compliance with user constraints.
- **CTA**: Free Course Entry Modal trigger opens [`CourseEntryModal.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/sections/CourseEntryModal.tsx).

### B. About Us Section
- **File**: [`About.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/sections/About.tsx)
- **Counters Below Narrative**: The 3 metric counters are positioned directly below the philosophy text description in a compact 3-column subgrid (`grid grid-cols-3 gap-2 sm:gap-3.5 pt-5 sm:pt-6 border-t border-zinc-900`) with clean typography (`text-base sm:text-2xl lg:text-3xl font-mono text-emerald-400`).
- **Image Holder in Right Column**: Where the counters were originally placed, a dedicated studio visual frame has been installed (`aspect-[16/10] sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-850 bg-zinc-950 group shadow-2xl`):
  - Studio badge overlays (`STUDIO PHILOSOPHY` active beacon, `DIGITAL ARCHITECTURE`, `EST. 2026`).
  - Dynamic API image hydration from `about.imageUrl` with graceful fallback to [`about-graphic.png`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/public/assets/images/about-graphic.png).

### C. Infinite Carousels (Capabilities & Services)
- **Files**: [`Capabilities.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/sections/Capabilities.tsx) and [`Services.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/sections/Services.tsx)
- **Infinite Looping**: RAF-based smooth translation loop with mouse/touch drag support and inertial decay. Cards duplicate seamlessly for gapless wrapping.
- **Mobile Card Proportions**: Card width reduced on mobile from `280px` to `w-[230px] sm:w-[280px] md:w-[320px]` with `p-3.5 sm:p-5`, allowing the next card in the sequence to peek into the viewport without dominating the entire mobile screen.
- **Color Theme**: Yellow accent removed; full palette migrated to Cyberpunk / Studio Emerald Green (`emerald-400` / `#00ff66`).

### D. Projects Showcase Slideshow
- **File**: [`Projects.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/components/sections/Projects.tsx)
- Equal-interval auto-advancing slideshow with visual top progress bar (`duration = 6000ms`).
- Interactive pause/play toggle, previous/next slide controls, keyboard arrow navigation, and touch swipe gestures.
- Responsive mobile container padding (`p-4 sm:p-8 lg:p-14`) and scaled headline typography (`text-xl sm:text-3xl lg:text-4xl`).
- Dynamic CMS data editable from [`/admin/projects`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/app/admin/projects/page.tsx).

### E. Booklet Library & Zero-Leakage Reader Engine
- **Files**:
  - [`BookletLibrary.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/viewer/src/components/BookletLibrary.tsx)
  - [`ReaderEngine.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/viewer/src/components/ReaderEngine.tsx)
- **2-Column Mobile Catalog**: Card grid adjusted to `grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6` on mobile devices, avoiding massive oversized single cards.
- **Booklet Badges**: Strictly styled with **black background and green text** (`bg-black text-emerald-400 border border-emerald-500/40`).
- **Security & Rendering**: HTML5 Canvas rendering of WebP pages fetched with `credentials: 'omit'` and `Cache-Control`. No raw PDF URLs are ever exposed to the client DOM. Right-click, drag, and print shortcuts (`Ctrl+P`, `Ctrl+S`) are intercepted.
- **Page Caching**: In-memory LRU cache limited to 15 pages to keep mobile memory under 50MB.

### F. Ads Engine (Auto-Slideshow Loop)
- **Desktop Side Ads**: [`DesktopReaderSideAds.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/viewer/src/components/DesktopReaderSideAds.tsx) flanks the central reader canvas on left and right on desktop (`hidden lg:flex`).
- **Mobile Top Banner**: [`MobileTopAdBanner.tsx`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/viewer/src/components/MobileTopAdBanner.tsx) renders a thick horizontal image banner below the header on mobile screens.
- **Auto-Slideshow in Infinite Loop**: Continuous timed interval rotation with smooth opacity transitions. Pauses on user hover.
- **Admin Management**: [`/admin/ads`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/app/admin/ads/page.tsx) allows adding/editing/deleting image slides, setting redirect URLs, and customizing rotation speed in seconds.

### G. Admin CMS & Visual Parity
- All admin pages (`/admin/projects`, `/admin/capabilities`, `/admin/services`, `/admin/booklets`, `/admin/ads`, `/admin/settings`, `/admin/media`) styled with dark technical aesthetics matching the public website (`bg-black`, `border-zinc-800`, `text-emerald-400`).
- Firebase config in [`config.ts`](file:///c:/Users/D.Solanki/urdhv-ascens/apps/main-site/src/core/firebase/config.ts) handles invalid/empty API keys gracefully without crashing page modules, allowing local administration.

---

## 3. Strict Design Rules & Negative Constraints

The following constraints are non-negotiable across all components and pages:
- ❌ **NO Pill-shaped buttons** (use `rounded-lg` or `rounded-xl`, never `rounded-full` for action buttons).
- ❌ **NO Glow effects** (no `shadow-emerald-500/50` neon glows; use clean subtle borders `border-zinc-800 hover:border-emerald-500/40`).
- ❌ **NO Purple or generic gradients** (only black, dark zinc, and subtle emerald tints).
- ❌ **NO Emoji icons** (always use `lucide-react` SVGs).
- ❌ **NO Em dashes** (replace any `—` with standard `-`).
- ❌ **NO Fake counters, reviews, client claims, or AI tags**.
- ❌ **NO Cursor-following or excessive scroll-jacking animations**.

---

## 4. Git Repositories & Latest Commits

The workspace uses separate git repositories for `apps/main-site` and `apps/viewer`:

### `apps/main-site`
- **Branch**: `main`
- **Latest Commit**: `311b680`
- **Commit Message**: `feat: update hero title, about stats layout with image holder, and mobile card sizes`
- **Prior Key Commits**:
  - `3be9533`: `feat: site logo, favicon.ico, blurred hero background, admin & viewer visual parity, and zero glow`
  - `ef38bf2`: `feat: complete storefront & admin CMS with thumbnail editor, carousel, readers, and ads`

### `apps/viewer`
- **Branch**: `main`
- **Latest Commit**: `b9ba502`
- **Commit Message**: `feat: add desktop reader side ads, mobile top ad banner, and compact mobile cards`
- **Prior Key Commits**:
  - `34d6c66`: `feat: viewer visual parity with cyberpunk green theme, site logo, and upgraded library view`
  - `938f454`: `feat: add Cloudflare Pages SPA routing _redirects and security _headers`
  - `459e142`: `feat: complete hardened WebP viewer SPA with bounded LRU cache, Canvas engine, and sponsor ads`

---

## 5. Verification Commands

To verify builds or compile static assets in future sessions:

```powershell
# 1. Type-check & build apps/viewer
cd apps/viewer
npm run build     # Runs `tsc -b && vite build` -> outputs to `dist/`

# 2. Type-check & build apps/main-site
cd ../main-site
npx tsc --noEmit  # Zero TypeScript errors
npm run build     # Runs `hydrate-cms.mjs` and `next build` -> outputs to `out/`

# 3. Sync static export to Hostinger deployment directory
node -e "const fs = require('fs'), path = require('path'); function c(s,d){if(!fs.existsSync(d))fs.mkdirSync(d,{recursive:true});for(const i of fs.readdirSync(s)){if(i==='api')continue;const sp=path.join(s,i),dp=path.join(d,i);fs.statSync(sp).isDirectory()?c(sp,dp):fs.copyFileSync(sp,dp);}} c('apps/main-site/out','urdhvascens'); console.log('Synced!');"
```

---

## 6. Guidance & Recommended Skills for the Next Agent

When picking up work:
1. **Always reference this document and [`visual-changes.md`](file:///c:/Users/D.Solanki/urdhv-ascens/visual-changes.md)** before proposing or modifying styling.
2. **Recommended Skills**:
   - `frontend-patterns`: For React / Next.js component boundaries and state management.
   - `react-performance`: For optimizing mobile render cycles and image loading.
   - `modern-web-guidance`: For CSS layout, container queries, and responsive card mechanics.
3. **If pushing to remotes**:
   - Both repos have GitHub remotes (`git -C apps/main-site push origin main` and `git -C apps/viewer push origin main`). If running git push in non-interactive agent mode, ensure SSH keys or credentials are configured or run commands locally.
