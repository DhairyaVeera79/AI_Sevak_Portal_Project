# Supabase Setup for Prisma (AI Sevak Portal API)

This guide prepares `services/api` to run Prisma migrations and seed using Supabase PostgreSQL.

## 1) Create local API env file

From repo root:

```bash
cp services/api/.env.example services/api/.env
```

Set in `services/api/.env`:

```dotenv
DATA_SOURCE_MODE=mock
DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@<DB_HOST>:5432/postgres?sslmode=require"
```

Notes:
- Use Supabase **direct** Postgres connection string for migration/seed.
- Keep `sslmode=require`.
- Do not commit `services/api/.env`.

## 2) Generate Prisma client

```bash
npm run prisma:generate --workspace api
```

## 3) Run first migration

```bash
npm run prisma:migrate:dev --workspace api -- --name init
```

## 4) Seed database

```bash
npm run prisma:seed --workspace api
```

## 5) Validate application integrity

```bash
npm run lint
npm run build
npm run test --workspace api -- --runInBand
npm run test:e2e --workspace api
```

## 6) Quick runtime checks

Run API and portal, login with mock GI ID/password, then verify:
- `GET /v1/logs`
- `PATCH /v1/logs/:id/stage`
- `GET /v1/expenses`
- `POST /v1/expenses`
- `PATCH /v1/expenses/:id/status`

Expected behavior:
- DB mode should persist logs/expenses/session/audit when `DATABASE_URL` is valid.
- Mock fallback remains available if DB is unreachable.

## Troubleshooting

- Error `P1012 Environment variable not found: DATABASE_URL`
  - Ensure `services/api/.env` exists and includes `DATABASE_URL`.
- SSL/connection failures
  - Confirm `sslmode=require` and that host/password are correct.
- Migration works but seed fails
  - Re-run `npm run prisma:generate --workspace api` before seed.
