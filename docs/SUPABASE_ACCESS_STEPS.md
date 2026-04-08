# Supabase Setup + Access Handoff (Exact Steps)

This is the exact sequence to create a temporary Supabase DB for development and allow me to run Prisma commands from your workspace.

## A) Create the Supabase project

1. Open Supabase dashboard and create a new project.
2. Region: choose nearest to your team.
3. Save the database password securely (you will need it for `DATABASE_URL`).
4. Wait until project status is healthy.

## B) Get connection string

1. In Supabase dashboard, open **Connect** → **ORM** → **Prisma**.
2. Copy both values shown there:
  - pooled connection (`DATABASE_URL`)
  - direct connection (`DIRECT_URL`)

Expected pattern:

`DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true"`

`DIRECT_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-<REGION>.pooler.supabase.com:5432/postgres"`

## C) Add local API env (this gives runtime access in your local workspace)

From repo root:

```bash
cp services/api/.env.example services/api/.env
```

Edit `services/api/.env`:

```dotenv
DATA_SOURCE_MODE=mock
DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-<REGION>.pooler.supabase.com:5432/postgres"
```

Important:
- Do **not** run `npx prisma init` in this repo (already initialized).
- Do **not** re-install Prisma unless you intentionally change versions.

## D) Give me access safely (without sharing secrets in chat)

You do **not** need to paste credentials to me.

- Once `services/api/.env` is present locally, tell me:  
  **"Supabase env is set. Run migration + seed now."**
- I will run commands in your workspace terminal where Prisma reads that local `.env`.
- I can complete migration/seed and validations without your password being posted in chat.

## E) Commands I will run next

```bash
npm run prisma:generate --workspace api
npm run prisma:migrate:dev --workspace api -- --name init
npm run prisma:seed --workspace api
npm run lint
npm run build
npm run test --workspace api -- --runInBand
npm run test:e2e --workspace api
```

## F) Optional: verify DB quickly

If you want to verify manually before asking me to continue:

```bash
npm run prisma:studio --workspace api
```

Check seeded tables: `User`, `Seva`, `LogEntry`, `Expense`, `UserSeva`.

## G) Later switch to org DB in deployment

1. Keep same Prisma schema/migrations.
2. Replace deployment `DATABASE_URL` secret with org DB URL.
3. Run migrations in deployment pipeline or release step.
4. Keep Supabase project as non-prod fallback.
