import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Do NOT gate on sf_access / sf_refresh here.
 *
 * Auth cookies are set by the API host (e.g. *.onrender.com) with credentials:
 * "include". They are never present on the Next.js request to *.vercel.app, so
 * checking them in middleware causes an infinite loop:
 *   dashboard → middleware redirects to /login → AuthGate me() succeeds →
 *   replace(/dashboard) → middleware redirects to /login again.
 *
 * Client AuthGate + /auth/me/ own session protection.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
