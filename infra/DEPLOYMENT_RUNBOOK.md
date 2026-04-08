# Deployment Runbook (Vercel + API Host)

This runbook covers baseline deployment for:
- `apps/presentation-site` (Vercel)
- `apps/portal-web` (Vercel)
- `services/api` (Railway baseline; Render/Fly-compatible alternatives)

## 1) Vercel — Presentation Site

Create a Vercel project with:
- Root directory: `apps/presentation-site`
- Framework: Next.js (auto-detected via `vercel.json`)
- Build command: default (`npm run build`)
- Output: default

Env vars:
- none required for current presentation baseline

## 2) Vercel — Portal Web

Create a second Vercel project with:
- Root directory: `apps/portal-web`
- Framework: Next.js (auto-detected via `vercel.json`)

Required env vars:
- `NEXT_PUBLIC_API_BASE_URL=<deployed-api-url>`

Example:
- `NEXT_PUBLIC_API_BASE_URL=https://<railway-api-domain>`

## 3) API Host — Railway (baseline)

Use [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for click-by-click setup.

Manual summary:
- Root directory: `services/api`
- Build command: `npm ci && npm run build`
- Start command: `npm run start:prod`

Required env vars:
- `DATABASE_URL=<postgres-url>`
- `DIRECT_URL=<postgres-direct-url>`
- `DATA_SOURCE_MODE=mock` (switch to `org` later)

Health check endpoint:
- `GET /`

## 4) API Host Alternatives (Render / Fly)

Render alternative:
- Use [render.yaml](../render.yaml) blueprint or manual service setup with same commands/env vars.

Use these same commands and env variables:
- Build: `npm ci && npm run build`
- Start: `npm run start:prod`
- Env: `DATABASE_URL`, `DIRECT_URL`, `DATA_SOURCE_MODE`

## 5) Post-Deploy Verification

After deploying all three services:
1. Verify API health endpoint returns `status: ok`.
2. Set portal env `NEXT_PUBLIC_API_BASE_URL` to deployed API URL.
3. Login to portal and verify:
   - dashboard loads,
   - logs moderation page loads,
   - expenses list loads.
4. Re-check CI workflow status on latest commit.

## 6) Future Production Cutover (Org DB)

1. Keep migration history in `services/api/prisma/migrations`.
2. Replace deploy secrets `DATABASE_URL` and `DIRECT_URL` with org-managed DB.
3. Run migrations before traffic switch.
4. Switch `DATA_SOURCE_MODE` from `mock` to `org` when adapter is ready.
