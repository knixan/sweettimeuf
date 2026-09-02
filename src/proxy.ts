import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Redundant backstop för admin/editor-åtkomst ovanpå de per-sida- och
// per-server-action-kontroller (requireAdmin/requireAdminOrEditor) som faktiskt
// gatekeepar datan. Fångar en framtida /admin-route som glömmer sin egen koll.
// (Rate limiting för auth-endpoints hanteras i better-auth-konfigurationen.)
async function checkAdminAccess(
  request: NextRequest,
): Promise<NextResponse | null> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/logga-in", request.url));
  }

  const role = session.user.role ?? "user";
  if (!(role === "admin" || role === "editor")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return (await checkAdminAccess(request)) ?? NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
