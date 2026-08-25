import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// In-memory store: ip:path -> { count, resetAt }
// Works well for single-instance; provides baseline protection even on serverless
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10;

// Only rate-limit auth mutation endpoints (not /session which is called on every page load)
const RATE_LIMITED_PATHS = [
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/send-verification-email",
];

function checkRateLimit(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  const isRateLimited = RATE_LIMITED_PATHS.some((p) => pathname.startsWith(p));
  if (!isRateLimited) return null;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_REQUESTS) {
    return new NextResponse("För många försök. Försök igen om 15 minuter.", {
      status: 429,
      headers: { "Retry-After": "900" },
    });
  }

  entry.count++;
  return null;
}

// Redundant backstop for admin/editor route access on top of the per-page and
// per-server-action checks (requireAdmin/requireAdminOrEditor) — catches a
// future /admin route that forgets its own check, since those checks are the
// ones that actually gate data, not this one alone.
async function checkAdminAccess(
  request: NextRequest,
): Promise<NextResponse | null> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/logga-in", request.url));
  }

  const role = (session.user as { role?: string }).role ?? "user";
  if (!(role === "admin" || role === "editor")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminResponse = await checkAdminAccess(request);
    if (adminResponse) return adminResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/admin/:path*"],
};
