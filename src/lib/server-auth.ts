"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

async function getSessionOrRedirect() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/logga-in");
  }
  return session;
}

/** Kräver att den inloggade användaren är `admin` eller `editor`. */
export async function requireAdminOrEditor() {
  const session = await getSessionOrRedirect();
  const role = session.user.role ?? "user";
  if (role !== "admin" && role !== "editor") {
    redirect("/");
  }
  return session;
}

/** Kräver att den inloggade användaren är `admin`. */
export async function requireAdmin() {
  const session = await getSessionOrRedirect();
  if ((session.user.role ?? "user") !== "admin") {
    redirect("/");
  }
  return session;
}

export default requireAdminOrEditor;
