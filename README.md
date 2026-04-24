## SiteWatch

A minimal website monitoring dashboard. Run HTTP checks against sites, record results, and receive email alerts when sites are down or slow.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set environment variables (create a `.env.local` file):

```
# Required for Vercel cron authentication
CRON_SECRET=some-long-random-string

# Required for persistence (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>

# Required for email alerts (SendGrid)
SENDGRID_API_KEY=<your-sendgrid-key>
ALERT_EMAIL_TO=you@example.com
ALERT_EMAIL_FROM=alerts@yourdomain.com

# Optional: latency threshold in ms before an alert is sent (default: 1000)
ALERT_LATENCY_THRESHOLD_MS=1000
```

3. Run the dev server:

```bash
npm run dev
```

4. Open the dashboard at `http://localhost:3000`.

## APIs

- `POST /api/checks` — Run an on-demand check. JSON body: `{ "url": "https://example.com", "siteId": "optional" }`
- `GET /api/checks` — List recent checks. Optional query: `?siteId=...&limit=50`
- `GET /api/checks/:id` — Get a single check result.
- `POST /api/sites` — Add a monitored site. JSON body: `{ "url": "https://example.com", "name": "optional" }`
- `GET /api/sites` — List all monitored sites.
- `GET /api/internal/scheduled-checks` — Run checks on all monitored sites and send alerts. Protected by `Authorization: Bearer <CRON_SECRET>`.

## Scheduled Checks

Vercel Cron is configured in `vercel.json` to call `/api/internal/scheduled-checks` once daily at 9am UTC.

To trigger manually:

```bash
curl -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://your-deployment.vercel.app/api/internal/scheduled-checks
```

## Alerting

An email alert is sent via SendGrid when a monitored site is down (`ok: false`) or slow (latency exceeds `ALERT_LATENCY_THRESHOLD_MS`). Alerts are only triggered by scheduled checks, not manual on-demand checks.

## Storage

- Without Upstash env vars set, the app uses an in-memory adapter — data is lost between serverless function invocations.
- With `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` set, data is persisted to Upstash Redis.

## Tests

```bash
npm test
```
