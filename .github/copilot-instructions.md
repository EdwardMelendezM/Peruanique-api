opilot Instructions

## Project Overview
The SODU () platform is a high-performance digital ecosystem for a university debate society. It uses a **Feature-Based Architecture** to ensure scalability and maintainability.

### Core Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** Prisma (PostgreSQL)
- **Authentication:** Better Auth
- **State Management:** Zustand (UI state only)
- **Data Fetching:** Server Components (Primary), SWR (Client-side revalidation)
- **Mutations:** Server Actions (Strictly no traditional API routes for internal logic)

---

## Architectural Rules

### 1. Feature-Based Directory Structure
Code is organized by business domain in `src/features/`. Each feature folder must be self-contained:
- `src/features/[feature-name]/components/`: Feature-specific UI (e.g., `book-card.tsx`, `coach-profile.tsx`).
- `src/features/[feature-name]/screens/`: Feature-specific UI (e.g., `books-screen.tsx`, `coachs-screen.tsx`).
- `src/features/[feature-name]/actions/`: All mutations via `'use server'`.
- `src/features/[feature-name]/store/`: Zustand slices for UI state (Modals, Slide-downs).
- `src/features/[feature-name]/schemas/`: Zod schemas for validation.
- `src/features/[feature-name]/types/`: Specific TypeScript interfaces.

### 2. Server-First Logic (KISS Principle)
- **Server Components:** Fetch data directly via Prisma in async components. Use `cache` from React for deduping.
- **Server Actions:** All form submissions and data changes MUST use Server Actions.
  - Always include `'use server'`.
  - Validate inputs with **Zod** at the start of the function.
  - Check session via `better-auth` before proceeding with protected actions (e.g., Reviews).
- **Zustand:** Use strictly for **UI State** (e.g., `isOrganizationChartOpen`). Do not store database entities in Zustand; let the server handle data.

---

## Coding Standards

### Indentation & Style
- **Indent:** 2 spaces.
- **Naming:** PascalCase for components, camelCase for functions/variables.
- **Simplicity:** If a task can be done with a native Next.js feature, do not install a library.

### TypeScript & Validation
- **Strict Types:** Avoid `any`. Use Prisma-generated types or explicit interfaces.
- **Zod Schemas:** Required for every Server Action and Form to ensure data integrity.
- **Strings:** Use template literals for dynamic strings.

### Comments
- Use **JSDoc** for complex business logic (e.g., "Global Config Singleton" logic).
- Focus comments on the **"Why"** (Intent) rather than the "What."

---

## Root Folders & Navigation
- `src/app/`: App Router (Pages, Layouts). Keep logic minimal here; delegate to `features/`.
- `src/components/ui/`: Atomic, reusable UI elements (Buttons, Inputs).
- `src/lib/`: Shared singletons (Prisma client, Better Auth config).
- `src/hooks/`: Global reusable hooks (e.g., `usePagination`, `useStickyNav`).

### UI/UX Interfaces & Reuse of Feature Organization

- Reuse the existing feature-based organization when adding UI/UX interfaces: keep domain-specific UI inside `features/[feature-name]/components/` and screens inside `features/[feature-name]/screens/` so design and behaviour remain co-located with business logic.
- Shared, atomic UI primitives (Buttons, Inputs, Icons, Form controls, Modals) should live in `src/components/ui/` and be framework-agnostic (styling tokens only) so they can be reused across features and the `app/` layer.
- Store types and UI contracts for components close to the feature: `features/[feature-name]/types/` should expose interfaces for props and small UI contracts used by screens and components. Use these types in server components to keep strict typing across server/client boundary.
- UX specs, small wireframes and component usage guidelines should be kept in `docs/ui/` or `docs/features/[feature-name]/ui.md` (lightweight markdown) — include example screenshots, expected responsive behaviour and accessibility notes.
- Design tokens (colors, spacing, typography) should be centralized in `src/styles/tokens.ts` or `src/styles/variables.css` and consumed by `src/components/ui/` primitives to ensure consistent theming across features.
- For admin interfaces or alternate flows, create parallel screen folders under `app/admin/` and follow the same conventions: server components for data-fetching lists and client components for forms/modals that call server actions.
- Accessibility & internationalization: include brief guidance in each feature's `README.md` (e.g., `features/questions/README.md`) about aria roles, keyboard interactions and text keys for translations. Prefer simple, semantic HTML and ensure components expose aria-friendly props.
- When implementing interactive flows, prefer Server Components for lists and data fetching, and Client Components only for interactive controls, forms or local UI state (Zustand remains UI-only).

These guidelines ensure UI/UX artifacts are discoverable, consistently implemented and easy to reuse across the project while preserving the feature-based architecture.

---

## Operational Workflows

### Finding Related Code
- Search `src/features/` by domain (e.g., "Literary Hub" -> `features/library`).
- Check `prisma/schema.prisma` for data structures.

### Validation Steps
1. **Type Check:** `tsc --noEmit`.
2. **Auth Check:** Verify `auth.getSession()` is called in any action modifying the DB.
3. **SEO Check:** Ensure `generateMetadata` is used for dynamic routes (Books, Coaches).
