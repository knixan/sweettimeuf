import { NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isRateLimited = RATE_LIMITED_PATHS.some((p) => pathname.startsWith(p));
  if (!isRateLimited) return NextResponse.next();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return new NextResponse("För många försök. Försök igen om 15 minuter.", {
      status: 429,
      headers: { "Retry-After": "900" },
    });
  }

  entry.count++;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
