import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import runCheck from "../../../../lib/checker";
import storage from "../../../../lib/storage";

const HEADER = "x-checker-secret";

export async function POST(req: NextRequest) {
  const secret = req.headers.get(HEADER);
  if (!process.env.CHECKER_SECRET || secret !== process.env.CHECKER_SECRET) {
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
      results.push(r);
    } catch (e: any) {
      results.push({ url: s.url, error: e?.message ?? String(e) });
    }
  }

  return NextResponse.json({ ok: true, results });
}
