"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function createCategory(values: { name: string; showInNavbar?: boolean }) {
  await requireAdminOrEditor();

  const name = String(values.name ?? "").trim();
  const showInNavbar = !!values.showInNavbar;

  if (!name) throw new Error("Name is required");

  try {
    const created = await prisma.category.create({
      data: { name, showInNavbar },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/kategorier");

    return { ok: true, id: created.id, name: created.name, showInNavbar: created.showInNavbar };
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Kunde inte skapa kategori");
  }
}

export async function updateCategory(values: { id: string; name: string; showInNavbar?: boolean }) {
  await requireAdminOrEditor();

  const id = String(values.id ?? "").trim();
  const name = String(values.name ?? "").trim();
  const showInNavbar = !!values.showInNavbar;

  if (!id) throw new Error("ID is required");
  if (!name) throw new Error("Name is required");

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name, showInNavbar },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/kategorier");

    return { ok: true, id: updated.id, name: updated.name, showInNavbar: updated.showInNavbar };
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Kunde inte uppdatera kategori");
  }
}

export async function deleteCategory(id: string) {
  await requireAdminOrEditor();

  if (!id) throw new Error("ID is required");

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/kategorier");

    return { ok: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Kunde inte ta bort kategori");
  }
}
