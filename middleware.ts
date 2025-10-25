import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/", "/dashboard"],
};

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  // Preset redirect: /?preset=rodinna -> /generator/rodinna
  if (url.pathname === "/") {
    const preset = url.searchParams.get("preset");
    if (preset) {
      return NextResponse.redirect(new URL(`/generator/${preset}`, req.url));
    }
  }

  // Keep existing behavior (no-op placeholder)
  return NextResponse.next();
}
