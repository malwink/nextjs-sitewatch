import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the unlock page and static assets
  if (
    pathname === "/unlock" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("site-unlocked");

  if (cookie?.value === SITE_PASSWORD) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/unlock", req.url));
}

export const config = {
  matcher: "/:path*",
};