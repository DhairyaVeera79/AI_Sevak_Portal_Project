# AI Sevak Portal Monorepo

This repository is structured as a **single monorepo** to move fast on documentation, presentation, and V1 product build in parallel.

## Why this structure
- Shared design language and product vocabulary across docs, presentation, and app.
- Faster cross-team collaboration with one source of truth.
- Independent deployment targets while keeping shared code reusable.
- Easier transition to multiple repos later if/when scale demands it.

## Repository Layout

- `docs/` — Product docs and presentation source content.
- `references/` — Context and source material.
- `apps/presentation-site/` — Static, high-end presentation website (Vercel target).
- `apps/portal-web/` — V1 web app frontend (Next.js target).
- `services/api/` — Node backend API (NestJS target).
- `packages/ui/` — Shared UI components/design primitives.
- `packages/config/` — Shared lint, TypeScript, and build configs.
- `infra/` — Deployment and environment templates.
- `.github/workflows/` — CI/CD pipelines.

## Recommended Build Sequence (Today)
1. Build `apps/presentation-site` first for Friday submission readiness.
2. Scaffold `apps/portal-web` and `services/api` for V1 prototype demo.
3. Integrate auth + RBAC baseline.
4. Implement registration, seva listing, and allocation flow for V1.

## Deployment Strategy
- `apps/presentation-site` -> Vercel static deployment.
- `apps/portal-web` -> Vercel web app deployment.
- `services/api` -> Render/Railway/Fly (or org-preferred Node host).
- Database -> PostgreSQL managed instance.

## Timeline Anchor
- Core build completion: **31 August 2026**
- Offering milestone: **26 September 2026**

## Live Build Memory
- Use [docs/PROJECT_BUILD_MEMORY.md](docs/PROJECT_BUILD_MEMORY.md) as the mandatory live tracker for:
	- end-to-end task checklist,
	- detailed implementation logs,
	- architecture/component mapping,
	- AI handoff context.

## Database Quickstart (Supabase)
- Setup guide: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

## Environment and Access Guides
- Environment matrix: [docs/ENVIRONMENT_MATRIX.md](docs/ENVIRONMENT_MATRIX.md)
- Supabase setup + access handoff: [docs/SUPABASE_ACCESS_STEPS.md](docs/SUPABASE_ACCESS_STEPS.md)

## Deployment Guides
- Runbook: [infra/DEPLOYMENT_RUNBOOK.md](infra/DEPLOYMENT_RUNBOOK.md)
- Render blueprint: [render.yaml](render.yaml)
