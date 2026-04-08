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
- [x] Add backend RBAC endpoint enforcement scaffolding
- [x] Add RBAC and audit-event module (core scaffolding)
- [x] Add persistent session revocation/logout endpoint
- [x] Add first domain module (`expenses`) with RBAC and audit hooks
- [x] Add logs moderation module (`logs`) with RBAC and audit hooks

### E. Data and Integrations
- [ ] Add DB migrations and seed data (blocked: waiting for local `DATABASE_URL`)
- [x] Add Prisma seed scaffolding (execution pending DB URL)
- [ ] Add file upload strategy (logs/receipts)
- [ ] Add notification queue baseline (optional for V1 demo)
- [x] Design Get-Involved integration adapter (future-compatible)

### F. DevOps and Delivery
- [x] Lint and build pipelines working locally
- [x] Add GitHub Actions CI (lint/test/build)
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

## 2026-04-07 — Backend RBAC Enforcement + DB-Ready Auth Persistence

### What was implemented
- Added backend RBAC enforcement checks on core endpoints using session token headers:
  - `GET /v1/sevas`
  - `GET /v1/dashboard-metrics`
  - `GET /v1/impact-stories`
  - `GET /v1/auth/me`
- Added admin-only RBAC validation endpoint:
  - `GET /v1/admin/rbac-status`
- Added centralized role hierarchy and `requireRole` enforcement in API service.
- Upgraded auth login flow to support DB persistence when `DATABASE_URL` is available:
  - `login` now asynchronously attempts `User` upsert (GI ID + role + displayName).
  - Safe no-op when DB is not configured (mock-first mode preserved).
- Updated portal API client to send `x-session-token` from cookies for protected endpoints.

### Files touched
- `services/api/src/app.controller.ts`
- `services/api/src/app.service.ts`
- `apps/portal-web/src/lib/api-client.ts`

### Why it was implemented this way
- Moves authorization logic to backend where policy should be enforced.
- Preserves current demo velocity with dummy data while making auth compatible with DB-backed user state.
- Keeps migration path clean for future org auth adapter integration.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — DB-Backed Session Strategy + Audit Event Logging

### What was implemented
- Extended Prisma schema with new persistence models:
  - `Session` (session token id, role, expiry, revocation)
  - `AuditEvent` (actor/action/status/metadata)
  - Added user relations for sessions and audit events.
  - File: `services/api/prisma/schema.prisma`
- Upgraded auth session strategy in API service:
  - session payload now includes `sid` (session token id)
  - when DB is configured, token `sid` resolves through persisted `Session` table
  - fallback behavior still works in mock-only mode without DB
  - File: `services/api/src/app.service.ts`
- Added audit logging hooks (DB-available mode):
  - login success/denied events
  - authorization denied events
  - admin endpoint to fetch recent events
  - Endpoints:
    - `GET /v1/admin/audit-events`
  - File: `services/api/src/app.controller.ts`
- Regenerated Prisma client to sync model changes.

### Files touched
- `services/api/prisma/schema.prisma`
- `services/api/src/app.service.ts`
- `services/api/src/app.controller.ts`

### Why it was implemented this way
- Establishes a production-ready session model while preserving the current mock-first working mode.
- Adds governance traceability for auth and authorization actions without blocking feature delivery.

### Validation done
- `npx prisma generate` ✅
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — Logout Revocation + Domain RBAC Pattern

### What was implemented
- Added session logout endpoint in API:
  - `POST /v1/auth/logout`
  - Revokes persisted session (`revokedAt`) when DB-backed session exists.
  - Falls back gracefully in mock-only mode.
- Added RBAC-protected domain moderation endpoint pattern:
  - `GET /v1/admin/moderation-queue`
  - Requires `C2` or above role.
  - Returns moderation-ready stories from current datasource.
- Updated portal sign-out flow to call API logout before local cookie clear.

### Files touched
- `services/api/src/app.service.ts`
- `services/api/src/app.controller.ts`
- `apps/portal-web/src/components/portal-shell.tsx`

### Why it was implemented this way
- Ensures logout can invalidate server-tracked sessions when DB is active.
- Establishes reusable RBAC pattern for upcoming domain modules (expenses/log moderation/admin actions).
- Keeps user-facing behavior consistent regardless of DB availability.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — Expenses Module (DB-backed with Mock Fallback)

### What was implemented
- Added expenses API endpoints with RBAC and validations:
  - `GET /v1/expenses` (C4+; scoped listing by role)
  - `POST /v1/expenses` (C4+; create expense)
  - `PATCH /v1/expenses/:id/status` (C2+; review/approve/reject flow)
- Added expenses domain methods in service:
  - list/create/updateStatus with DB path when `DATABASE_URL` is available
  - safe mock in-memory fallback when DB is unavailable
  - audit-event entries for status updates and create actions
- Added RBAC-protected moderation queue pattern endpoint:
  - `GET /v1/admin/moderation-queue` (C2+)
- Wired portal expenses screen to live API data (with fallback):
  - `apps/portal-web/src/lib/api-client.ts`
  - `apps/portal-web/src/app/expenses/page.tsx`

### Files touched
- `services/api/src/app.controller.ts`
- `services/api/src/app.service.ts`
- `apps/portal-web/src/lib/api-client.ts`
- `apps/portal-web/src/app/expenses/page.tsx`

### Why it was implemented this way
- Establishes the first reusable domain implementation pattern (RBAC + audit + DB/mock dual-mode).
- Enables demoable expense pipeline now while preserving direct migration to org data/credentials later.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅

## 2026-04-07 — Logs Moderation Module + Prisma Seed Scaffolding

### What was implemented
- Added logs moderation API endpoints with RBAC and validations:
  - `GET /v1/logs` (C4+; optional stage filter)
  - `PATCH /v1/logs/:id/stage` (C2+; moderation/review transitions)
  - `GET /v1/admin/moderation-queue` now returns live moderation-stage log entries
- Added logs domain methods in service:
  - DB-backed list/update when `DATABASE_URL` is available
  - safe mock in-memory fallback for no-DB mode
  - audit-event entries for stage updates
- Wired portal logs screen to live logs API:
  - shows moderation queue and reviewed storytelling feed
  - adds server-action stage transitions (`moderation`/`reviewed`)
- Added deterministic Prisma seed scaffolding:
  - script file: `services/api/prisma/seed.ts`
  - package scripts: `prisma:seed` via `prisma db seed`
  - seed data includes users, sevas, logs, expenses, and user-seva mappings

### Files touched
- `services/api/src/app.controller.ts`
- `services/api/src/app.service.ts`
- `apps/portal-web/src/lib/api-client.ts`
- `apps/portal-web/src/app/logs/page.tsx`
- `services/api/prisma/seed.ts`
- `services/api/package.json`

### Why it was implemented this way
- Reuses the same proven domain pattern (RBAC + audit + DB/mock dual-mode) established in expenses.
- Keeps V1 demo fully functional in mock mode while making moderation workflows and DB bootstrap production-ready.

### Validation done
- `npm run lint` ✅
- `npm run build` ✅
- `npm run test --workspace api -- --runInBand` ✅
- `npm run test:e2e --workspace api` ✅
- `npm run prisma:generate --workspace api` ✅

## 2026-04-07 — Prisma Migration Attempt + GitHub Actions CI

### What was implemented
- Attempted Prisma migration execution:
  - `npm run prisma:migrate:dev --workspace api -- --name init`
  - blocked because local `services/api/.env` is missing and `DATABASE_URL` is not set.
- Added monorepo CI workflow:
  - File: `.github/workflows/ci.yml`
  - Triggers: push to `main`, pull requests, and manual dispatch
  - Steps: install dependencies, prisma generate, lint, build, API unit tests, API e2e tests

### Why it was implemented this way
- Unblocks delivery velocity by shipping CI immediately even while DB credentials are pending.
- Keeps migration task explicit and reproducible once `DATABASE_URL` is provided.

### Validation done
- Migration command attempted and failed with expected Prisma `P1012` due missing `DATABASE_URL` (documented blocker).
- Existing local quality checks remain green from previous milestone.

## 2026-04-07 — Supabase Readiness Package (DB Unblock Prep)

### What was implemented
- Updated API env template for Supabase-ready usage:
  - File: `services/api/.env.example`
  - Added explicit Supabase direct URI guidance with `sslmode=require`
- Added dedicated runbook for migration/seed against Supabase:
  - File: `docs/SUPABASE_SETUP.md`
  - Covers env setup, prisma generate, migration, seed, validation, and troubleshooting
- Linked Supabase runbook from monorepo README:
  - File: `README.md`

### Why it was implemented this way
- Removes ambiguity around DB setup so migration/seed can run immediately when Supabase credentials are provided.
- Keeps preparation explicit without weakening mock-first local behavior.

### Validation done
- Documentation and templates updated; no runtime code-path changes.

## 2026-04-07 — Environment Matrix + Supabase Access Handoff

### What was implemented
- Added environment matrix documentation:
  - `docs/ENVIRONMENT_MATRIX.md`
  - defines local/staging/production env variables and safe DB cutover flow
- Added exact Supabase access handoff steps:
  - `docs/SUPABASE_ACCESS_STEPS.md`
  - includes “how to give Copilot access safely” without sharing secrets in chat
- Linked both docs in root README for quick access.

### Why it was implemented this way
- Gives a repeatable operator flow to provision test DB now and switch to org DB later.
- Reduces credential leakage risk by keeping secrets local while still enabling command execution from workspace.

### Validation done
- Documentation-only updates; no functional code changes.

## 2026-04-07 — Supabase ORM Prompt Alignment (DATABASE_URL + DIRECT_URL)

### What was implemented
- Updated Prisma datasource to support direct migration URL:
  - `services/api/prisma/schema.prisma`
  - added `directUrl = env("DIRECT_URL")`
- Updated env template for Supabase pooled/direct split:
  - `services/api/.env.example`
  - `DATABASE_URL` (pooler `:6543` + `pgbouncer=true`)
  - `DIRECT_URL` (direct `:5432`)
- Updated runbooks to match Supabase ORM → Prisma output exactly:
  - `docs/SUPABASE_SETUP.md`
  - `docs/SUPABASE_ACCESS_STEPS.md`
  - explicitly notes to skip `npx prisma init` in this repo

### Why it was implemented this way
- Matches Supabase’s recommended Prisma pattern and avoids migration issues through pooled connections.
- Keeps runtime connections efficient while preserving reliable migration behavior.

### Validation done
- Config/docs updated; runtime migration still pending actual credentials in local `.env`.

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

Use this repo as a monorepo with active modules in `apps/presentation-site`, `apps/portal-web`, and `services/api`. Current state: backend RBAC checks are enforced on key endpoints, DB-backed session strategy is scaffolded via Prisma `Session`, logout revocation endpoint is active, audit logging is scaffolded via Prisma `AuditEvent`, and domain modules for both `expenses` and `logs moderation` are implemented with DB path + mock fallback. Portal requests send session headers to API and logs page supports moderation stage transitions via server actions. Prisma seed scaffolding is added (`services/api/prisma/seed.ts` + `npm run prisma:seed --workspace api`) and GitHub Actions CI is active at `.github/workflows/ci.yml`. DB migration/seed execution is currently blocked only by missing local `DATABASE_URL`. Next priority is DB migration execution once DB URL is provided, then deployment pipelines (Vercel + API host). Do not change timeline anchors: 31 Aug 2026 build deadline and 26 Sep 2026 offering milestone. Preserve SRMD/SRLC terminology and impact-storytelling requirements.

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
- Fresh chat bootstrap prompt: `docs/NEXT_CHAT_HANDOFF_PROMPT.md`
- Supabase setup runbook: `docs/SUPABASE_SETUP.md`
- Environment matrix: `docs/ENVIRONMENT_MATRIX.md`
- Supabase access handoff: `docs/SUPABASE_ACCESS_STEPS.md`
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
- Admin audit endpoint: `GET /v1/admin/audit-events`
- Logout endpoint: `POST /v1/auth/logout`
- Moderation queue endpoint: `GET /v1/admin/moderation-queue`
- Logs endpoints:
  - `GET /v1/logs`
  - `PATCH /v1/logs/:id/stage`
- Expenses endpoints:
  - `GET /v1/expenses`
  - `POST /v1/expenses`
  - `PATCH /v1/expenses/:id/status`

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
5. `docs/SUPABASE_SETUP.md` (DB setup and migration/seed execution guide)
6. `docs/NEXT_CHAT_HANDOFF_PROMPT.md` (execution-ready restart prompt)
7. `references/*` (deeper source context)
