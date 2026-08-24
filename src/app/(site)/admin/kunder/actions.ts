"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: string) {
  await requireAdmin();
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/kunder");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
