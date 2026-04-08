# Deployment Execution (Today) — Click-by-Click

This is the exact operator flow to deploy all three services now.

## 0) Prerequisites

- GitHub repo is up to date on `main`
- Supabase test DB is active
- You have these values ready:
  - `DATABASE_URL`
  - `DIRECT_URL`

---

## 1) Deploy API first (Choose one)

### Option A (recommended): Render Blueprint

1. Go to Render dashboard.
2. Click **New +** → **Blueprint**.
3. Connect/select GitHub repo: `AI_Sevak_Portal_Project`.
4. Confirm Render detected `render.yaml`.
5. Create service.
6. Open created service `ai-sevak-portal-api`.
7. Set environment variables:
   - `DATABASE_URL` = your Supabase runtime URL
   - `DIRECT_URL` = your Supabase direct URL
   - `DATA_SOURCE_MODE` = `mock`
   - `NODE_ENV` = `production`
8. Trigger deploy if not automatic.
9. Wait for green deploy and copy API URL.

Expected URL pattern:
- `https://ai-sevak-portal-api.onrender.com`

### Option B (no-card, this PC): PM2 + Cloudflare Tunnel

1. Install process manager and tunnel client (once):

```bash
brew install cloudflared
npm install -g pm2
```

2. Ensure API env is configured:
    - file: `services/api/.env`
    - required values:
       - `DATABASE_URL`
       - `DIRECT_URL`
       - `DATA_SOURCE_MODE=mock`
       - `PUBLIC_TUNNEL_API_KEY=<long-random-secret>`
       - `CORS_ALLOWED_ORIGINS` (optional but recommended)

3. If portal is deployed, set in portal env:
   - `NEXT_PUBLIC_PUBLIC_TUNNEL_KEY=<same-secret>`

4. Build and start API with PM2:

```bash
cd services/api
npm ci
npm run build
pm2 start "npm run start:prod" --name ai-sevak-portal-api
pm2 save
```

5. Start public tunnel to local API (`3000`):

```bash
cloudflared tunnel --url http://localhost:3000
```

6. Copy the generated public URL from tunnel output (example: `https://<random>.trycloudflare.com`).

Notes:
- Keep terminal open while tunnel is running.
- For always-on reliability, run this on your always-on Mac mini later.

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
   - `NEXT_PUBLIC_API_BASE_URL` = your API Render URL
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
