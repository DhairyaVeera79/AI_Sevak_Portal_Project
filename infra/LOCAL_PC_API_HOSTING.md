# Local PC API Hosting (No Card Required)

Use this when you want immediate public API access without Render billing.

## 1) Install prerequisites

```bash
brew install cloudflared
npm install -g pm2
```

## 2) Ensure API environment file exists

```bash
cp services/api/.env.example services/api/.env
```

Set values in `services/api/.env`:

```dotenv
DATA_SOURCE_MODE=mock
DATABASE_URL="<your-supabase-pooled-url>"
DIRECT_URL="<your-supabase-direct-url>"
PUBLIC_TUNNEL_API_KEY="<generate-a-long-random-secret>"
# Optional (recommended when portal deployed):
# CORS_ALLOWED_ORIGINS="https://<portal-vercel-domain>"
PUBLIC_RATE_WINDOW_MS=60000
PUBLIC_RATE_LIMIT_MAX=120
```

Set value in `apps/portal-web/.env` (or Vercel env vars):

```dotenv
NEXT_PUBLIC_PUBLIC_TUNNEL_KEY="<same-secret-as-PUBLIC_TUNNEL_API_KEY>"
```

## 3) Build and run API with PM2

```bash
cd services/api
npm ci
npm run build
pm2 start "npm run start:prod" --name ai-sevak-portal-api
pm2 save
pm2 status
```

## 4) Expose API publicly with Cloudflare tunnel

```bash
cloudflared tunnel --url http://localhost:3000
```

Copy the generated URL:
- `https://<random>.trycloudflare.com`

## 5) Verify API health

```bash
curl -s https://<API-URL>/
curl -s https://<API-URL>/v1/data-source-mode
```

## 6) Wire portal deployment

In Vercel project `apps/portal-web`, set:
- `NEXT_PUBLIC_API_BASE_URL=https://<API-URL>`

Redeploy portal after env update.

## 7) Restart/helpful commands

```bash
pm2 logs ai-sevak-portal-api
pm2 restart ai-sevak-portal-api
pm2 stop ai-sevak-portal-api
pm2 delete ai-sevak-portal-api
```

## Important limitations

- If your PC sleeps/shuts down, API and tunnel go offline.
- `trycloudflare.com` URL can change between sessions.
- Good for immediate demo/testing; migrate to always-on host for stable sharing.

## Security defaults now enabled in API

- Optional API key gate for all non-health routes when `PUBLIC_TUNNEL_API_KEY` is set.
- Basic in-memory rate limiting.
- Configurable CORS via `CORS_ALLOWED_ORIGINS`.
