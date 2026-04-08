# Environment Matrix (AI Sevak Portal)

Use this matrix to keep local/staging/production setup clean and switch databases safely.

## Naming Convention

- `services/api/.env` → local machine only (never committed)
- CI secrets → GitHub Actions repository secrets
- Host secrets → deployment platform secrets (Vercel/Render/Railway/Fly)

## Variables

### API (`services/api`)

- `DATA_SOURCE_MODE`
  - `mock` for current V1 flow while org adapters are pending
  - `org` later when org integrations are available
- `DATABASE_URL`
  - PostgreSQL connection string for Prisma + app runtime

### Portal Web (`apps/portal-web`)

- `NEXT_PUBLIC_API_BASE_URL`
  - Local: `http://localhost:3002`
  - Staging/Prod: deployed API URL

## Suggested Environment Values

### Local Dev (now)

- API: `DATA_SOURCE_MODE=mock`
- API: `DATABASE_URL=<Supabase test db>`
- Web: `NEXT_PUBLIC_API_BASE_URL=http://localhost:3002`

### Staging

- API: `DATA_SOURCE_MODE=mock` (or `org` once adapter is ready)
- API: `DATABASE_URL=<staging postgres>`
- Web: `NEXT_PUBLIC_API_BASE_URL=<staging api url>`

### Production (org)

- API: `DATA_SOURCE_MODE=org` (target state)
- API: `DATABASE_URL=<org managed postgres>`
- Web: `NEXT_PUBLIC_API_BASE_URL=<prod api url>`

## Safe Cutover Strategy (Test Supabase → Org DB)

1. Keep Prisma migrations in git (`services/api/prisma/migrations`).
2. Freeze schema changes briefly for cutover window.
3. Apply latest migrations to org DB.
4. Set production `DATABASE_URL` to org DB.
5. Run smoke tests for auth/logs/expenses endpoints.
6. Keep test Supabase isolated for non-prod verification.

## Do Not Do

- Do not commit `.env` files with credentials.
- Do not reuse prod credentials in local dev.
- Do not skip migration history tracking.
