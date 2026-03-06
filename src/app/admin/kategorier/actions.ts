"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

export async function createCategory(values: { name: string; showInNavbar?: boolean }) {
  await requireAdminOrEditor();

  const name = String(values.name ?? "").trim();
  const showInNavbar = !!values.showInNavbar;

  if (!name) throw new Error("Name is required");

  try {
    const baseSlug = generateSlug(name);
    const existing = await prisma.category.findMany({ select: { slug: true } });
    const existingSlugs = existing.map((c) => c.slug).filter(Boolean) as string[];
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    const created = await prisma.category.create({
      data: { name, slug, showInNavbar },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/kategorier");

    return { ok: true, id: created.id, name: created.name, slug: created.slug, showInNavbar: created.showInNavbar };
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
    const existing = await prisma.category.findUnique({ where: { id }, select: { name: true, slug: true } });
    let slug = existing?.slug;

    // Regenerate slug if name changed
    if (!slug || existing?.name !== name) {
      const baseSlug = generateSlug(name);
      const others = await prisma.category.findMany({ where: { id: { not: id } }, select: { slug: true } });
      const existingSlugs = others.map((c) => c.slug).filter(Boolean) as string[];
      slug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug, showInNavbar },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/kategorier");
    revalidatePath(`/kategori/${slug}`);

    return { ok: true, id: updated.id, name: updated.name, slug: updated.slug, showInNavbar: updated.showInNavbar };
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
