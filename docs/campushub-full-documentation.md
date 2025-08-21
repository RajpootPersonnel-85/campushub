# CampusHub: Full Project Documentation

This document describes the CampusHub website: features, architecture, routing, components, and development workflow. It complements `docs/cms-features.md` (CMS-specific).

## 1. Tech Stack

- Framework: Next.js (App Router) — `next@15.2.4`
- React: `^19`, React DOM: `^19`
- UI: Tailwind CSS 4, Shadcn UI (Radix primitives), lucide-react icons
- Charts: recharts
- Carousel: embla-carousel-react
- Forms: react-hook-form + zod + @hookform/resolvers
- Theming: next-themes
- Build tooling: TypeScript 5, PostCSS

## 2. Project Structure

- `app/`
  - Routes for pages and APIs (App Router). Includes:
    - `app/cms/` CMS interface and layout
    - `app/api/` backend routes (ads, conversions, leads)
    - `app/auth/` (login, signup, forgot-password)
    - `app/books/`, `app/careers/` (public-facing site sections)
- `components/`
  - Reusable UI and domain components (ads, books, careers, cms, layout)
- `hooks/` custom hooks (mobile detection, toasts)
- `lib/` shared utilities/data stores (ads-store, careers/exams/sample data)
- `public/` static assets (images, svgs)
- `styles/` global Tailwind styles
- `docs/` documentation

## 3. Routing Overview (App Router)

- Top-level site sections (examples based on repository):
  - `app/books/*` — Books listing and management UI (public UI)
  - `app/careers/*` — Public-facing careers content (e.g., compare)
  - `app/cms/*` — Admin CMS (private)
  - `app/auth/*` — Auth screens
- API endpoints:
  - `app/api/ads/*` — Ads related endpoints
  - `app/api/conversions/*` — Conversions tracking endpoints
  - `app/api/leads/*` — Leads collection endpoints

## 4. CMS

- Layout: `app/cms/layout.tsx` (wraps all CMS pages)
- Sidebar: `components/cms/CmsSidebar.tsx`
  - Sections: Dashboard, Marketplace (Books, Notes, Jobs, Hostels, Deals), Academics (Exams, Resources, Schemes), Community & Career (Community Posts, Careers Manage), Tiffin & Wellbeing (Tiffin, Wellbeing), Other (Ads, Leads, Conversions, Site Settings)
  - Careers uses custom icon `public/careers-logo.svg`
- Unified Careers management page: `app/cms/careers/manage/page.tsx`
  - Collapsible sections:
    - Career Catalog (dynamic; persisted in localStorage temporarily)
    - Roles (CRUD)
    - Adjacent Roles
    - Job Links
    - International Profiles
    - Trends (with bulk add)
    - Comparisons (preview with multi-select)
    - Quiz (placeholder to wire up)
- Legacy redirect: `app/cms/careers/page.tsx` → redirects to `/cms/careers/manage`
- Reusable CMS building blocks:
  - `components/cms/DataTable.tsx` — sorting, search, actions, flexible columns
  - `components/cms/EntityDialog.tsx` — schema-driven Add/Edit dialog
  - `components/cms/CmsSidebar.tsx` — collapsible nav, search, mobile drawer

For details see `docs/cms-features.md`.

## 5. Public Site Features (by domain)

- Books (`app/books/*`, `components/books/BookForm.tsx`)
  - Book forms and listing UI
- Careers (public display components in `components/careers/`)
  - `CompareClient.tsx` — client-driven comparison previews
  - `TrendGraph.tsx` — trend chart via recharts
- Ads (display in `components/ads/*`, state in `lib/ads-store.ts`)
  - `AdSlot.tsx`, `AdsCarousel.tsx`, `CornerAd.tsx`
- Community posts (`app/cms/community` CMS; public counterparts assumed under `app/community` when present)
- Academics: `lib/exams-data.ts`, `lib/careers-data.ts` suggest foundational data utilities for public pages
- Tiffin & Wellbeing: Sidebar entries exist; corresponding UI routes/pages render content for those domains

Note: Some public routes may be stubs/placeholders depending on current repository state.

## 6. Components Directory Map

- `components/ads/`
  - `AdSlot.tsx` — renders ad placements
  - `AdsCarousel.tsx` — rotating ads display
  - `CornerAd.tsx` — anchored corner ad
- `components/books/`
  - `BookForm.tsx` — book create/edit form
- `components/careers/`
  - `CompareClient.tsx` — UI for quick comparisons
  - `TrendGraph.tsx` — graph rendering of trends
- `components/cms/`
  - `CmsSidebar.tsx` — sidebar navigation (search, collapsible sections, mobile drawer)
  - `DataTable.tsx` — generic table with sorting/search/actions
  - `EntityDialog.tsx` — form dialog, schema-based fields
- `components/layout/` (if present) — shared layout components

## 7. Hooks

- `hooks/use-mobile.ts` — mobile detection helpers
- `hooks/use-toast.ts` — toast helpers (integrates with Sonner/Toast provider)

## 8. Libraries and Utilities (`lib/`)

- `lib/ads-store.ts` — in-memory ads state/store utilities
- `lib/careers-data.ts` — sample or helper data for careers
- `lib/exams-data.ts` — sample or helper data for exams
- `lib/date.ts` — date formatting helpers (UTC utilities)

## 9. Styles & Theming

- Global styles: `styles/globals.css` (Tailwind base + design tokens)
- Tailwind 4 with `@tailwindcss/postcss`
- Theme switching via `next-themes` (if configured in layout/provider)

## 10. Assets

- Public assets under `public/`
  - Logos, svgs, images for books, algorithms, calculus, etc.
  - Careers logo: `public/careers-logo.svg`

## 11. API Surface (current folders)

- `app/api/ads/*` — endpoints for ads management or retrieval
- `app/api/conversions/*` — conversions tracking endpoints
- `app/api/leads/*` — leads collection endpoints

Implementation details (schemas, handlers) are in the corresponding route files inside each folder.

## 12. State Management & Persistence

- Client state via React hooks
- Careers CMS: temporary persistence in `localStorage` for the Career Catalog
- Backend APIs to be added for full persistence of careers entities (planned)

## 13. Accessibility & UX

- Keyboard-accessible dialogs and menus via Radix primitives
- Labels and aria props used in tables and toggles where applicable
- Consistent spacing, typography, and iconography per Shadcn conventions

## 14. Performance Considerations

- Code-splitting by App Router routes
- Client components only where necessary
- Recharts and carousel used on client for interactive sections
- Avoid hydration mismatches by removing stale sidebar items and clearing `.next` cache when needed

## 15. Development Workflow

- Scripts (`package.json`):
  - `npm run dev` — start dev server
  - `npm run build` — production build
  - `npm start` — start production server
- Cache reset: delete `.next/` and restart dev server
- Type checking: TypeScript 5
- Linting: `next lint`

## 16. Testing

- No dedicated test setup currently in repo; recommended to add:
  - Unit tests with Vitest/Jest
  - Component tests with React Testing Library
  - E2E tests with Playwright

## 17. Roadmap

- Backend persistence for Careers: roles, adjacent roles, job links, international profiles, trends, comparisons, quiz
- CRUD toasts, optimistic updates, error handling
- CSV import/export for Roles, Trends
- Public pages wired to APIs (careers, books, etc.)
- Analytics/Insights dashboard
- Auth + Role-based Access for CMS

## 18. Contribution Guidelines (suggested)

- Use feature branches and PRs
- Keep components small and typed
- Reuse `DataTable` and `EntityDialog` for consistency
- Update `docs/` for new features

## 19. Known Issues

- Hydration mismatch can occur if old sidebar structure is cached; fix by clearing `.next` and hard reloading
- Careers data is not persisted server-side yet

## 20. Reference Files

- CMS overview: `docs/cms-features.md`
- Full docs: `docs/campushub-full-documentation.md`
- Config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`
- Global styles: `styles/globals.css`
