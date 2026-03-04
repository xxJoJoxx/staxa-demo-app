# Staxa Demo Frontend

A task board UI built to demonstrate the [Staxa](https://staxa.dev) deployment platform. Connects to the Staxa Demo API for data.

## What This Demos

- **Next.js frontend** deployed through Staxa's pipeline
- **Cross-tenant communication** — this frontend talks to a separate API tenant
- **Environment variable injection** — `NEXT_PUBLIC_API_URL` points to the API tenant's URL
- **Framework auto-detection** — Staxa detects Next.js from `next.config.js`

## Deploy on Staxa

### Prerequisites

Deploy the Staxa Demo API first. Note its URL (e.g. `https://demo-api.tenants.staxa.dev`).

### Steps

1. Push this repo to GitHub
2. In the Staxa dashboard, click **New Tenant**
3. Select **GitHub Repo** → pick this repo
4. Staxa auto-detects **Next.js (Node.js 20)**
5. Do NOT enable a database (this is a frontend-only app)
6. Add one environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://demo-api.tenants.staxa.dev` (your API tenant's URL)
7. Click **Create Tenant & Deploy**
8. Your task board is live in ~60 seconds

## Local Development

```bash
# Start the demo API first (see its README)
# Then run this frontend:
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run dev
```

The dev server runs on port 3001 to avoid conflicting with the API on port 3000.
