# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

**Next.js 16 App Router** with React 19, TypeScript strict mode, Tailwind CSS 4, and shadcn/ui (Base Nova style, Base UI primitives).

Path alias: `@/*` → `./src/*`

### Directory Structure

- `src/app/` — App Router pages: `/` (portfolio dashboard), `/exhibitions/[id]` (exhibition detail), `/followup` (lead queue), `/api/` (empty, no routes yet)
- `src/components/` — `ui/` (shadcn primitives), `layout/` (sidebar), `dashboard/`, `exhibition/`, `leads/`, `shared/`
- `src/types/index.ts` — All domain types and enums
- `src/data/mock.ts` — Mock data (no backend/API integration yet)
- `src/lib/constants.ts` — Status/category labels (Korean localization)
- `src/lib/format.ts` — Formatting utilities
- `src/lib/utils.ts` — `cn()` for classname merging

### Domain Model

The app manages **exhibition operations** with these core entities:
- **Exhibition** — trade shows with gates (stage-gate progression), KPIs, budget
- **Lead** — contacts with grades (A/B/C), SLA tracking, qualification status
- **TaskInstance** — tasks categorized as logistics/booth/marketing/onsite/post
- **Cost** — budget vs. actual tracking with receipt management

### Data Flow

All data is currently served from `src/data/mock.ts` and passed through component props. No server actions or API routes exist yet. The `exhibitions/[id]/page.tsx` does SSR by filtering mock data by ID.

### UI Conventions

- shadcn components live in `src/components/ui/` — add new ones via `npx shadcn@latest add <component>`
- Dark mode is enabled globally in the root layout
- Korean localization for domain labels is in `src/lib/constants.ts`
