"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function promoteToAdmin(email: string) {
  await requireAdminOrEditor();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Ingen användare med den e-postadressen hittades" };
  if (user.role === "admin") return { ok: false, error: "Användaren är redan admin" };
  await prisma.user.update({ where: { email }, data: { role: "admin" } });
  revalidatePath("/admin/admins");
  return { ok: true };
}

export async function removeAdmin(id: string) {
  await requireAdminOrEditor();
  await prisma.user.update({ where: { id }, data: { role: "user" } });
  revalidatePath("/admin/admins");
  return { ok: true };
}
