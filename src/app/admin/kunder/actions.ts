"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: string) {
  await requireAdminOrEditor();
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/kunder");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
