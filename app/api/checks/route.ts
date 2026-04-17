import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import runCheck from "../../../lib/checker";
import storage from "../../../lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;
    const siteId = body?.siteId;
    if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

    const result = await runCheck(url);
    await storage.saveCheck(siteId, result as any);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const siteId = url.searchParams.get("siteId") || undefined;
  const limit = Number(url.searchParams.get("limit") || "50");

  const list = await storage.listChecks(siteId, limit);
  return NextResponse.json(list);
}
