import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import storage from "../../../lib/storage";

export async function GET() {
  const sites = await storage.listSites();
  return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;
    const name = body?.name;
    if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });

    const site = { id: String(Date.now()), url, name };
    await storage.addSite(site as any);
    return NextResponse.json(site);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
