# Railway Deployment (API) — No-Card Friendly Path

Use this to deploy `services/api` quickly when avoiding Render card verification.

## 1) Create Railway project

1. Go to Railway dashboard.
2. Create a new project from GitHub repo: `AI_Sevak_Portal_Project`.
3. Add a service from the repo.
4. Set service root directory to `services/api`.

## 2) Configure build/start

- Build command: `npm ci && npm run build`
- Start command: `npm run start:prod`

## 3) Set environment variables

- `NODE_ENV=production`
- `DATA_SOURCE_MODE=mock`
- `DATABASE_URL=<supabase-pooled-url>`
- `DIRECT_URL=<supabase-direct-url>`

## 4) Deploy and verify

After deployment, copy API URL and test:

```bash
curl -s https://<API-URL>/
curl -s https://<API-URL>/v1/data-source-mode
```

Expected:
- health endpoint returns `status: ok`
- data-source mode returns `mock`

## 5) Wire portal

In Vercel project for `apps/portal-web`, set:
- `NEXT_PUBLIC_API_BASE_URL=https://<API-URL>`

Redeploy portal service after env update.

## Notes

- Railway plan details can change; check Railway pricing page for latest free-trial/free-tier conditions.
- Keep migration history in git and switch DB host later by changing env vars only.
