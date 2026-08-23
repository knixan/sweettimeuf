import { headers } from "next/headers";

// In-memory store: fine for a single-instance deployment; resets on restart.
const store = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  scope: string,
  { windowMs, max }: { windowMs: number; max: number },
) {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0].trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";

  const key = `${scope}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (entry.count >= max) {
    throw new Error("För många förfrågningar. Försök igen om en stund.");
  }

  entry.count++;
}
