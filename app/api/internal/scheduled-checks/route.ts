import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import runCheck from "../../../../lib/checker";
import storage from "../../../../lib/storage";
import { sendAlert } from "../../../../lib/alerts/sendgrid";

export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const sites: { id?: string; url: string }[] = body?.sites || [];

  // if no sites provided, use registered sites from storage
  const finalSites = sites.length ? sites : await storage.listSites();

  const results = [] as any[];
  for (const s of finalSites) {
    try {
      const r = await runCheck(s.url);
      await storage.saveCheck(s.id, r as any);
      // Alerting: send email when check fails or latency exceeds threshold
      const latencyThreshold = Number(process.env.ALERT_LATENCY_THRESHOLD_MS || "1000");
      if (!r.ok || (r.latencyMs && r.latencyMs > latencyThreshold)) {
        const subject = `SiteWatch alert: ${s.url} - ${r.ok ? "slow" : "down"}`;
        const text = `URL: ${s.url}\nStatus: ${r.status}\nOK: ${r.ok}\nLatency: ${r.latencyMs}ms\nCheckedAt: ${r.checkedAt}\nError: ${r.error || "none"}`;
        await sendAlert(subject, text);
      }
      results.push(r);
    } catch (e: any) {
      results.push({ url: s.url, error: e?.message ?? String(e) });
    }
  }

  return NextResponse.json({ ok: true, results });
}
