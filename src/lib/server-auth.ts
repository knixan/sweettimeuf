"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function requireAdminOrEditor() {
  const hdrs = await headers();

  const session = await auth.api.getSession({ headers: hdrs });

  if (!session?.user) {
    redirect("/logga-in");
  }

  const role = (session.user as { role?: string })?.role ?? "user";
  if (!(role === "admin" || role === "editor")) {
    redirect("/");
  }
}

export default requireAdminOrEditor;
