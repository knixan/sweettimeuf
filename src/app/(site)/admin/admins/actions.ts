"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function promoteToAdmin(email: string) {
  await requireAdmin();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return {
      ok: false,
      error: "Ingen användare med den e-postadressen hittades",
    };
  if (user.role === "admin")
    return { ok: false, error: "Användaren är redan admin" };
  await prisma.user.update({ where: { email }, data: { role: "admin" } });
  revalidatePath("/admin/admins");
  return { ok: true };
}

export async function removeAdmin(id: string) {
  const session = await requireAdmin();
  if (id === session.user.id) {
    return { ok: false, error: "Du kan inte ta bort din egen adminroll" };
  }

  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  if (adminCount <= 1) {
    return { ok: false, error: "Det måste finnas minst en admin kvar" };
  }

  await prisma.user.update({ where: { id }, data: { role: "user" } });
  revalidatePath("/admin/admins");
  return { ok: true };
}
