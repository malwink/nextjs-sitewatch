import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import storage from "../../../../lib/storage";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await storage.getCheck(id);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(item);
}
