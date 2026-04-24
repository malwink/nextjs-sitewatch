import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/unlock" ||
    pathname.startsWith("/api/unlock") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Allow scheduled checks to call the internal endpoint without the unlock cookie
  if (pathname.startsWith("/api/internal/scheduled-checks")) {
    const secret = req.headers.get("x-checker-secret");
    if (secret) return NextResponse.next();
  }

  const cookie = req.cookies.get("site-unlocked");

  if (cookie?.value === "true") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/unlock", req.url));
}

export const config = {
  matcher: "/:path*",
};
