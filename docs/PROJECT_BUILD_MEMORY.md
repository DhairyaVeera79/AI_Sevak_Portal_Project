# AI Sevak Portal — Project Build Memory (Live)

This is the **single source of truth** for build progress, implementation details, and AI handoff context.

## 1) Purpose

This document is maintained for:
1. **Team reference**: to track what was built, why, and where.
2. **AI handoff continuity**: to let any new chat/agent continue work immediately with minimal context loss.

## 2) Memory Method Used

We are using a practical memory model inspired by agent memory patterns:
- **Short-term memory**: current sprint checklist and immediate open tasks.
- **Long-term semantic memory**: architecture decisions, stack choices, timelines, and governance rules.
- **Episodic memory**: date-wise implementation log of what was actually done.
- **Procedural memory**: repeatable run/build/deploy workflows.

Reference used: LangGraph memory overview concepts (short-term vs long-term; semantic/episodic/procedural memory).

## 3) Project Anchors (Must Not Drift)

- Project: **AI Sevak Portal**
- Context: SRMD / SRLC internal volunteer operations platform
- Deadline anchor: **31 August 2026** (core build)
- Offering milestone: **26 September 2026**
- Team: Dhairya Veera, Tanvi Savani, Avani Jariwala

## 4) Master Build Checklist (Start → Finish)

### A. Foundation and Repo Setup
- [x] Decide repository strategy (single monorepo)
- [x] Create monorepo folder structure
- [x] Scaffold starter apps/services
- [x] Configure root workspaces and scripts
- [x] Connect local repo to GitHub remote

### B. Documentation and Presentation
- [x] Build comprehensive product doc (`AI_Sevak_Portal.md`)
- [x] Build presentation narrative doc (`AI_Sevak_Portal_Presentaion.md`)
- [x] Add donation-to-impact storytelling in docs
- [x] Align timeline to Aug 31 build + Sept 26 offering
- [x] Generate shareable PDFs from markdown docs
- [x] Build high-end presentation static site starter
- [ ] Refine presentation with final visual polish + charts
- [ ] Deploy presentation to Vercel production URL

### C. V1 Web Prototype
- [x] Scaffold portal web app (Next.js + TypeScript + Tailwind)
- [x] Implement V1 prototype navigation shell
- [x] Implement login screen (GI ID + password for V1)
- [x] Implement dashboard, sevas, onboarding, logs, expenses screens
- [x] Wire portal screens to live API responses
- [x] Add role-based conditional UI (C1/C2/C3/C4)
- [x] Add form validation and error states
- [x] Add basic auth session guard middleware

### D. API Service (Node/Nest)
- [x] Scaffold NestJS API service
- [x] Add CORS + health endpoint
- [x] Add demo endpoints (`v1/sevas`, `v1/dashboard-metrics`, `v1/impact-stories`)
- [x] Update unit and e2e tests for new endpoints
- [x] Add Prisma setup and PostgreSQL connection (mock-safe; real DB URL pending)
- [ ] Define core schema (users, profiles, sevas, logs, expenses, roles)
- [x] Add auth module (V1 local credentials model)
- [ ] Add RBAC and audit-event module

### E. Data and Integrations
- [ ] Add DB migrations and seed data
- [ ] Add file upload strategy (logs/receipts)
- [ ] Add notification queue baseline (optional for V1 demo)
- [x] Design Get-Involved integration adapter (future-compatible)

### F. DevOps and Delivery
- [x] Lint and build pipelines working locally
- [ ] Add GitHub Actions CI (lint/test/build)
- [ ] Add Vercel config for presentation + portal
- [ ] Add API deploy config (Render/Railway/Fly)
- [x] Create environment variable templates
- [ ] Prepare demo runbook + handoff package

## 5) Detailed Implementation Log (Episodic Memory)

## 2026-04-07 — Monorepo and Starter Build

### What was implemented
- Set up monorepo root at `AI_Sevak_Portal_Project` with workspaces:
  - `apps/presentation-site`
  - `apps/portal-web`
  - `services/api`
  - `packages/ui`
  - `packages/config`
  - `infra`
  - `.github/workflows`
- Added root scripts in `package.json` for:
  - `dev:presentation`, `dev:web`, `dev:api`, combined `dev`
  - `build`, `lint`, `test`
- Added root `.gitignore` and normalized workspace lockfile usage.
- Connected GitHub remote:
  - `origin -> https://github.com/DhairyaVeera79/AI_Sevak_Portal_Project.git`

### Why it was implemented this way
- Single monorepo maximizes speed under deadline while allowing independent deployment units.
- Shared scripts reduce onboarding friction for all team members and future AI handoffs.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — Presentation and V1 Prototype Baseline

### What was implemented
- Built presentation site initial high-end page with all required sections:
  - problem, solution, users/beneficiaries, roadmap, dependencies
  - deadline anchors and impact-storytelling positioning
- Built portal V1 prototype screens:
  - `/` (entry)
  - `/login`
  - `/dashboard`
  - `/sevas`
  - `/onboarding`
  - `/logs`
  - `/expenses`
- Built reusable portal shell component:
  - `apps/portal-web/src/components/portal-shell.tsx`
- API endpoints created for prototype integration:
  - `GET /`
  - `GET /v1/sevas`
  - `GET /v1/dashboard-metrics`
  - `GET /v1/impact-stories`

### Why it was implemented this way
- Screens-first prototype approach enables stakeholder demos immediately.
- API-first shape allows quick transition from mocked UI to real data.

## 2026-04-07 — Mock Adapter Layer and Live API Wiring

### What was implemented
- Added a datasource contract layer in API to support environment-driven providers:
  - `services/api/src/data/portal-data-source.ts`
  - `services/api/src/data/mock-portal-data-source.service.ts`
  - `services/api/src/data/org-portal-data-source.service.ts`
- Updated Nest module/provider wiring to switch by `DATA_SOURCE_MODE`:
  - `mock` (default, fully functional for current V1)
  - `org` (placeholder adapter that enforces integration readiness)
- Refactored `AppService` to consume datasource interface instead of hardcoded payloads.
- Added debug endpoint for pipeline visibility:
  - `GET /v1/data-source-mode`
- Wired portal web pages to live API fetches with resilient fallback behavior:
  - `apps/portal-web/src/app/dashboard/page.tsx`
  - `apps/portal-web/src/app/sevas/page.tsx`
  - `apps/portal-web/src/app/logs/page.tsx`
  - Shared API client: `apps/portal-web/src/lib/api-client.ts`
- Normalized local dev ports to avoid runtime collision in monorepo dev mode:
  - Presentation: 3000
  - Portal web: 3001
  - API: 3002
  - Config: root `package.json` scripts
- Added portal env template:
  - `apps/portal-web/.env.example` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:3002`

### Why it was implemented this way
- Keeps V1 fully demoable using dummy/synthetic data while preserving integration-ready architecture.
- Makes future org integration a provider swap instead of a full rewrite.
- Ensures local multi-service runs are stable and deterministic.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — Prisma/PostgreSQL Readiness Scaffolding

### What was implemented
- Installed Prisma dependencies in API workspace and pinned stable version:
  - `prisma@6.15.0`
  - `@prisma/client@6.15.0`
- Added Prisma schema for V1 core domain models:
  - `User`, `VolunteerProfile`, `Seva`, `UserSeva`, `LogEntry`, `Expense`
  - Enums for role levels, story stages, seva mode, expense status
  - File: `services/api/prisma/schema.prisma`
- Added Prisma Nest integration module/service:
  - `services/api/src/prisma/prisma.module.ts`
  - `services/api/src/prisma/prisma.service.ts`
- Added Prisma scripts:
  - `prisma:generate`, `prisma:migrate:dev`, `prisma:studio`
  - File: `services/api/package.json`
- Added API env template with datasource mode + DB URL:
  - `services/api/.env.example`
- Registered `PrismaModule` in app module for DB-ready wiring.
- Made Prisma service mock-safe: skips DB connect when `DATABASE_URL` is absent.

### Why it was implemented this way
- Keeps mock-first development unblocked while making the backend production-ready for PostgreSQL adoption.
- Avoids runtime failures in local/test environments before credentials are available.

### Validation done
- `npx prisma generate` ✅
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — Auth + RBAC Scaffolding (Mock-First)

### What was implemented
- Added API auth endpoints (mock-first):
  - `POST /v1/auth/login`
  - `GET /v1/auth/me`
  - File: `services/api/src/app.controller.ts`
- Added auth/session logic in service:
  - GI ID-based role derivation (`C1/C2/C3/C4/ADMIN`)
  - session token creation/parse for V1
  - File: `services/api/src/app.service.ts`
- Added portal login integration with API auth:
  - API login request + cookie session persistence
  - inline form validation and error state handling
  - File: `apps/portal-web/src/app/login/page.tsx`
- Added route protection middleware for portal routes:
  - protects `/dashboard`, `/sevas`, `/onboarding`, `/logs`, `/expenses`
  - redirects unauthenticated users to `/login`
  - File: `apps/portal-web/src/middleware.ts`
- Added role-aware UI behavior:
  - nav items filtered by role
  - sign-out clears session cookies
  - role shown in shell header
  - File: `apps/portal-web/src/components/portal-shell.tsx`

### Why it was implemented this way
- Enables V1 authentication and access control now without org credentials.
- Keeps auth model aligned with future GI integration by preserving GI ID as primary identity key.
- Provides immediate demo-ready route protection and role-aware behavior.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 6) Architecture Snapshot (Current)

### Frontend
- `apps/presentation-site`: Next.js App Router + Tailwind (static presentation)
- `apps/portal-web`: Next.js App Router + Tailwind (V1 web prototype)

### Backend
- `services/api`: NestJS API with modular upgrade path to auth, RBAC, Prisma
- Datasource adapters: mock/org mode switch using `DATA_SOURCE_MODE`

### Planned Data Layer
- PostgreSQL + Prisma (next implementation step)
- Prisma schema and client scaffolding completed; migration execution pending DB credentials.

## 7) Component and Ownership Map (Current)

- `apps/presentation-site/src/app/page.tsx`
  - Owns strategic presentation content sections.
- `apps/portal-web/src/components/portal-shell.tsx`
  - Owns app-level shell, nav, and topbar structure.
- `apps/portal-web/src/app/*/page.tsx`
  - Own feature screens for V1 demo journey.
- `services/api/src/app.controller.ts`
  - Owns HTTP route exposure.
- `services/api/src/app.service.ts`
  - Owns V1 demo data payloads.

## 8) Runbook (Procedural Memory)

From repo root:
- Install: `npm install`
- Run all services: `npm run dev`
- Service URLs while running:
  - Presentation: `http://localhost:3000`
  - Portal web: `http://localhost:3001`
  - API: `http://localhost:3002`
- Environment templates:
  - Portal web: `apps/portal-web/.env.example`
  - API: `services/api/.env.example`
- Lint all: `npm run lint`
- Build all: `npm run build`
- API tests: `npm run test --workspace api -- --runInBand`
- API e2e: `npm run test:e2e --workspace api`

## 9) AI Handoff Block (Copy into any new chat)

Use this repo as a monorepo with active modules in `apps/presentation-site`, `apps/portal-web`, and `services/api`. Current state: mock-first auth + RBAC scaffolding is active (API login/session endpoints, portal route guard, role-aware nav/signout), portal dashboard/sevas/logs are wired to API via datasource adapters, and Prisma/PostgreSQL scaffolding is in place (mock-safe when `DATABASE_URL` is absent). Mock mode is default until org credentials are approved. Next priority is domain RBAC enforcement on backend modules + database-backed auth/user persistence + deployment configs (Vercel + API host). Do not change timeline anchors: 31 Aug 2026 build deadline and 26 Sep 2026 offering milestone. Preserve SRMD/SRLC terminology and impact-storytelling requirements.

## 10) Update Protocol (Mandatory for Every Work Session)

After every meaningful implementation step:
1. Update checklist ticks in Section 4.
2. Add a dated log entry in Section 5 with:
   - what changed,
   - why,
   - files touched,
   - validation results.
3. Update Section 9 handoff block if project state materially changed.

This file must be updated in the same PR/commit as code changes.

## 11) Reference Index (Where AI Should Look First)

### Core Product and Strategy Docs
- Main product doc: `docs/AI_Sevak_Portal.md`
- Presentation narrative (source): `docs/AI_Sevak_Portal_Presentaion.md`
- Build memory (this file): `docs/PROJECT_BUILD_MEMORY.md`
- Monorepo overview: `README.md`

### Source/Context References
- Brain dump source: `references/project_ideas_prompt.md`
- Full context document (docx): `references/SRLC_AI_Full_Documentation.docx`
- Full context extract (txt): `references/SRLC_AI_Full_Documentation.txt`

### Shareable Presentation/Product Exports
- Product PDF: `docs/AI_Sevak_Portal.pdf`
- Presentation PDF: `docs/AI_Sevak_Portal_Presentaion.pdf`

### Active Build Modules (Code)
- Presentation app (Next.js): `apps/presentation-site`
- Portal web app (Next.js): `apps/portal-web`
- API service (NestJS): `services/api`

### Critical Implementation Files
- Presentation landing page: `apps/presentation-site/src/app/page.tsx`
- Portal shell/navigation: `apps/portal-web/src/components/portal-shell.tsx`
- Portal routes: `apps/portal-web/src/app`
- API routes: `services/api/src/app.controller.ts`
- API service payloads: `services/api/src/app.service.ts`
- API bootstrap/CORS: `services/api/src/main.ts`
- API datasource contracts/adapters: `services/api/src/data/*`
- Portal API client: `apps/portal-web/src/lib/api-client.ts`
- Prisma schema: `services/api/prisma/schema.prisma`
- Prisma module/service: `services/api/src/prisma/*`
- Portal session middleware: `apps/portal-web/src/middleware.ts`

### External Context Links
- SRLC website: https://srlcusa.org/
- SRLC Inspiration page (Bapa context): https://srlcusa.org/inspiration/
- Memory pattern reference used for this doc:
  - https://docs.langchain.com/oss/python/langgraph/memory

### Retrieval Order for Any New AI Chat
1. `docs/PROJECT_BUILD_MEMORY.md` (state + checklist + handoff)
2. `docs/AI_Sevak_Portal.md` (scope and implementation intent)
3. `docs/AI_Sevak_Portal_Presentaion.md` (narrative and roadmap)
4. `README.md` (repo layout and run strategy)
5. `references/*` (deeper source context)
