# Deployment Execution (Today) — Click-by-Click

This is the exact operator flow to deploy all three services now.

## 0) Prerequisites

- GitHub repo is up to date on `main`
- Supabase test DB is active
- You have these values ready:
  - `DATABASE_URL`
  - `DIRECT_URL`

---

## 1) Deploy API first (Railway)

### Option A (recommended): Railway

1. Go to Railway dashboard.
2. Create project from GitHub repo: `AI_Sevak_Portal_Project`.
3. Add service from repo with root directory `services/api`.
4. Set build/start commands:
   - Build: `npm ci && npm run build`
   - Start: `npm run start:prod`
5. Set environment variables:
   - `DATABASE_URL` = your Supabase runtime URL
   - `DIRECT_URL` = your Supabase direct URL
   - `DATA_SOURCE_MODE` = `mock`
   - `NODE_ENV` = `production`
6. Deploy and copy API URL.

Expected URL pattern:
- Railway generated service domain (project/service specific)

### Option B: Render Blueprint

If Railway plan/account constraints block deployment, fallback to Render:
1. Go to Render dashboard.
2. Click **New +** → **Blueprint**.
3. Connect/select GitHub repo: `AI_Sevak_Portal_Project`.
4. Confirm Render detected `render.yaml`.
5. Create service and set same env vars as above.

### Smoke check

```bash
curl -s https://<API-URL>/
```

Expected: JSON with `status: "ok"`.

---

## 2) Deploy presentation site (Vercel)

1. Go to Vercel dashboard.
2. Click **Add New...** → **Project**.
3. Import GitHub repo `AI_Sevak_Portal_Project`.
4. Set **Root Directory** to `apps/presentation-site`.
5. Framework should auto-detect as Next.js.
6. No env vars required for current presentation baseline.
7. Click **Deploy**.
8. Copy generated presentation URL.

---

## 3) Deploy portal web (Vercel)

1. In Vercel, create another project from same repo.
2. Set **Root Directory** to `apps/portal-web`.
3. Add env var before deploy:
   - `NEXT_PUBLIC_API_BASE_URL` = your deployed API URL (Railway or Render)
4. Deploy.
5. Copy generated portal URL.

If API URL changes later:
- Update env var in Vercel project settings.
- Redeploy portal project.

---

## 4) End-to-end checks

Use browser and quick API tests.

### API checks

```bash
curl -s https://<API-URL>/
curl -s https://<API-URL>/v1/data-source-mode
```

### Portal checks

1. Open portal URL.
2. Login with mock GI ID + password (4+ chars).
3. Verify pages load:
   - dashboard
   - logs
   - expenses

---

## 5) Send back these 3 URLs

After deployment, share:
1. API URL
2. Portal URL
3. Presentation URL

Then I will run final verification support and prepare production cutover checklist for org DB.
