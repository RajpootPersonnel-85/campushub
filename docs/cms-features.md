# CampusHub CMS: Features Overview

This document summarizes the current capabilities, structure, and conventions of the CampusHub CMS.

## Key Concepts

- **Framework**: Next.js App Router
- **UI Kit**: Shadcn UI + Radix primitives
- **Icons**: lucide-react
- **State**: Local React state for UI; temporary localStorage for some screens; backend integration pending

## Navigation & Layout

- **Layout file**: `app/cms/layout.tsx`
  - Sidebar: `components/cms/CmsSidebar.tsx`
  - Sticky header with page title context
- **Sidebar sections**:
  - General → Dashboard
  - Marketplace → Books, Notes, Jobs, Hostels, Deals
  - Academics → Exams, Resources, Schemes
  - Community & Career → Community Posts, Careers Manage (All-in-one)
  - Tiffin & Wellbeing → Tiffin, Wellbeing
  - Other → Ads, Leads, Conversions, Site Settings
- **Careers Manage icon**: Custom SVG `public/careers-logo.svg`

## Reusable CMS Components

- **`components/cms/DataTable.tsx`**
  - Sortable columns, search, action buttons, right-side controls
  - Generic via `Column<T>` type
- **`components/cms/EntityDialog.tsx`**
  - Schema-driven forms (`FieldSpec`) for Add/Edit dialogs
  - Supports text, textarea, select, tags, read-only mode

## Careers: Unified All‑in‑one Page

- **Route**: `app/cms/careers/manage/page.tsx`
- **Purpose**: Single page to manage all career-related data with collapsible sections
- **Data strategy**: In-memory React state; dynamic Career Catalog persisted in `localStorage` (temporary)
- **Sections**:
  - **Career Catalog**: Dynamic set of careers (key + name). Drives all selects on the page. Persisted locally.
  - **Adjacent Roles**: Linked/related roles across careers.
  - **Job Links**: External resources per career (label, source, URL).
  - **International Profiles**: Region-wise salary/growth figures (India, USA, Canada, Dubai optional) + global growth.
  - **Career Trends**: Time-series values; supports bulk add for rapid input.
  - **Career Comparisons**: Category-based comparison across careers; quick preview with multi-select.
  - **Career Quiz**: Placeholder for quiz configuration (to be wired to backend).
  - **Roles**: Full roles CRUD (role, company, level, status, active toggle, URL, tags).

## Roles: Consolidation

- Old standalone Roles page: `app/cms/careers/page.tsx` now performs a server-side redirect to `/cms/careers/manage`.
- Roles are fully integrated inside the All‑in‑one page with `DataTable` and `EntityDialog`.

## CMS: Other Feature Areas

- **Books**: `app/cms/books/*` with `components/books/BookForm.tsx`
- **Careers Compare (client UI)**: `components/careers/CompareClient.tsx`, `TrendGraph.tsx`
- **Ads**: `components/ads/*`, data/store under `lib/ads-store.ts`
- **Hooks**: `hooks/use-toast.ts`, `hooks/use-mobile.ts`

## Persistence & APIs

- Current status: No backend persistence for Careers CMS; data is UI-only with optional `localStorage` for Career Catalog.
- Planned:
  - Define REST/Next API routes under `app/api/` for Careers entities.
  - Replace local state with server-backed fetches and mutations.
  - Add optimistic UI and toasts for save/delete operations.

## UX Conventions

- Collapsible sections to manage complexity.
- Schema-driven dialogs for consistency.
- Inline actions in tables (Edit/Delete; toggles for boolean fields).
- Icons in sidebar for rapid scanning; consistent typography and spacing.

## Known Limitations

- Hydration mismatch can occur if stale builds are served; resolve via clearing `.next` and restarting dev server.
- All careers data (besides the dynamic catalog in localStorage) is non-persistent until backend integration.
- No server validation yet.

## Development Tips

- Dev commands (`package.json`):
  - `npm run dev` – start dev server
  - `npm run build` – production build
  - `npm start` – start production server
- Cache resets when needed:
  - Remove `.next` directory and restart dev
- File paths to remember:
  - Layout: `app/cms/layout.tsx`
  - Sidebar: `components/cms/CmsSidebar.tsx`
  - Careers unified: `app/cms/careers/manage/page.tsx`
  - Redirected old roles: `app/cms/careers/page.tsx`
  - Logo: `public/careers-logo.svg`

## Roadmap

- Implement backend APIs for all careers entities.
- Persist and load data on the server; remove localStorage fallback.
- Add toast notifications across CRUD flows.
- Add CSV import/export for Roles and Trends.
- Wire public-facing pages to new APIs.
