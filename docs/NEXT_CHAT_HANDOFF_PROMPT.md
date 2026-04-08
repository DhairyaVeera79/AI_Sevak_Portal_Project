# AI Sevak Portal — Next Chat Handoff Prompt (Comprehensive)

Use this prompt to start a fresh chat and continue execution without losing context.

---

## Copy-Paste Prompt for New Chat

You are GitHub Copilot (GPT-5.3-Codex) working in VS Code on this repo:

- Workspace root: /Users/dhairyaveera/SRMD/SRLC AI/AI_Sevak_Portal_Project
- Branch: main
- Current date context: April 2026

Read these files first in this exact order before making any edits:
1. docs/PROJECT_BUILD_MEMORY.md
2. docs/AI_Sevak_Portal.md
3. docs/AI_Sevak_Portal_Presentaion.md
4. README.md
5. docs/NEXT_CHAT_HANDOFF_PROMPT.md

Non-negotiable anchors and constraints:
- Build deadline anchor: 31 Aug 2026
- Offering milestone: 26 Sep 2026
- Keep SRMD/SRLC terminology and impact-storytelling orientation
- Mock-first must continue to work when DATABASE_URL is absent
- Maintain DB-ready path (Prisma + PostgreSQL) with clean fallback behavior
- Update docs/PROJECT_BUILD_MEMORY.md in the same commit as code changes
- After each meaningful step: validate, commit, and push

Current implemented baseline (already done):
- Monorepo with apps/presentation-site, apps/portal-web, services/api
- Presentation site baseline complete
- Portal routes: login, dashboard, sevas, onboarding, logs, expenses
- API health + sevas + dashboard metrics + impact stories
- Mock/org datasource adapter scaffold
- Auth mock login, me, logout with session token flow
- RBAC checks on key endpoints
- Audit event scaffolding
- Domain module: expenses (RBAC + audit + DB/mock dual mode)
- Domain module: logs moderation (RBAC + audit + DB/mock dual mode)
- Prisma schema and seed scaffolding added

Latest known good state:
- Lint/build/tests passing
- Prisma client generation passing
- Working tree clean after latest push

Immediate next priorities (execute in this order unless blocked):
1) Database execution readiness
   - Configure valid DATABASE_URL in services/api/.env
   - Run Prisma migration creation and apply
   - Run Prisma seed and verify seeded records are visible in API responses
2) CI pipeline setup
   - Add GitHub Actions workflow(s) for lint/build/test
   - Ensure monorepo workspaces run reliably in CI
3) Deployment scaffolding
   - Add Vercel-ready configuration for presentation + portal
   - Add API deployment baseline (Render/Railway/Fly-compatible)
4) Presentation polish
   - Final chart/visual polish and production delivery readiness

Important endpoints currently expected:
- GET /
- GET /v1/sevas
- GET /v1/dashboard-metrics
- GET /v1/impact-stories
- POST /v1/auth/login
- GET /v1/auth/me
- POST /v1/auth/logout
- GET /v1/admin/rbac-status
- GET /v1/admin/audit-events
- GET /v1/admin/moderation-queue
- GET /v1/expenses
- POST /v1/expenses
- PATCH /v1/expenses/:id/status
- GET /v1/logs
- PATCH /v1/logs/:id/stage

Definition of done for each new step:
- Code is minimal and consistent with existing style
- Mock mode still works with no DATABASE_URL
- DB mode works when DATABASE_URL is provided
- Lint/build/tests relevant to change pass
- docs/PROJECT_BUILD_MEMORY.md updated (checklist + episodic log + handoff block if needed)
- Commit and push completed

When blocked by missing credentials:
- Do not stall. Implement scaffolding and guardrails, validate what can run locally, and document exact unblock input needed.

At the start of your work in the new chat:
- Briefly summarize what you read from PROJECT_BUILD_MEMORY
- State which next priority you are executing now
- Proceed directly to implementation

---

## Quick Operator Checklist (Human)

Before asking the next chat to run DB migration/seed, ensure:
- services/api/.env exists with valid DATABASE_URL
- Database is reachable from local machine
- You are in repo root when running workspace commands

Useful commands:
- npm install
- npm run lint
- npm run build
- npm run test --workspace api -- --runInBand
- npm run test:e2e --workspace api
- npm run prisma:generate --workspace api
- npm run prisma:migrate:dev --workspace api
- npm run prisma:seed --workspace api

---

## Suggested First Message in Fresh Chat (Short Version)

Continue AI Sevak Portal from current main branch using docs/PROJECT_BUILD_MEMORY.md as source of truth. First execute DB readiness: run Prisma migration + seed (with my DATABASE_URL), verify logs/expenses/auth flows still pass lint/build/tests, update PROJECT_BUILD_MEMORY, then commit and push. Keep mock fallback behavior intact.
