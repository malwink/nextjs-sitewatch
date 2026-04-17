This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SiteWatch (Website monitoring dashboard)

This repository includes a minimal SiteWatch dashboard to run HTTP checks against sites, record results, and run scheduled checks.

Quick start (local):

1. Install dependencies:

```bash
npm install
```

2. Set environment variables (create a `.env.local` file):

```
# Required for scheduled endpoint
CHECKER_SECRET=some-secret-value

# Optional: Upstash Redis (recommended for persistence)
UPSTASH_REDIS_REST_URL=https://<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>

# Optional: SendGrid (email alerts)
SENDGRID_API_KEY=<your-sendgrid-key>
ALERT_EMAIL_TO=you@example.com
ALERT_EMAIL_FROM=sitewatch@example.com
```

3. Run dev server:

```bash
npm run dev
```

4. Open the dashboard at `http://localhost:3000/dashboard` (you may need to unlock the site via `/unlock` first).

APIs

- `POST /api/checks` — Run an on-demand check. JSON body: `{ "url": "https://example.com", "siteId": "optional" }`
- `GET /api/checks` — List recent checks. Optional query `?siteId=...&limit=50`
- `GET /api/checks/:id` — Get single check result.
- `POST /api/internal/scheduled-checks` — Run scheduled checks. Protected by `x-checker-secret` header (value must match `CHECKER_SECRET`).

Example curl to trigger scheduled checks (from a cron or scheduler):

```bash
curl -X POST \
	-H "Content-Type: application/json" \
	-H "x-checker-secret: $CHECKER_SECRET" \
	-d '{ "sites": [{ "url": "https://example.com" }, { "url": "https://other.com" }] }' \
	https://your-deployment.example.com/api/internal/scheduled-checks
```

Storage

- By default the app uses an in-memory adapter (ephemeral) for quick testing.
- If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, the app will use Upstash Redis for persistent storage.

Notes

- Server-side checks use `fetch` with a 10s timeout and record `status`, `latencyMs`, headers, and a body SHA-256 hash.
- Avoid running heavy JS-rendered checks (Playwright) from serverless functions; use a separate worker if needed.
- Make sure your scheduler (Vercel Cron, GitHub Actions, or external cron) can send the `x-checker-secret` header or call with the unlock cookie if your site is protected.

