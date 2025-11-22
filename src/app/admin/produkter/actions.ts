"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminOrEditor } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

export type PriceTier = {
  quantity: number;
  price: number;
};

export async function createProduct(values: {
  title: string;
  articleNumber?: string;
  summary?: string;
  information?: string;
  prices?: PriceTier[];
  aboutProduct?: string;
  images?: string[];
  allowCustomerUpload?: boolean;
  categoryId?: string;
}) {
  await requireAdminOrEditor();

  const title = String(values.title ?? "").trim();
  if (!title) throw new Error("Titel krävs");

  try {
    // Generate unique slug
    const baseSlug = generateSlug(title);
    const existingProducts = await prisma.product.findMany({
      select: { slug: true },
    });
    const existingSlugs = existingProducts.map((p) => p.slug);
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    const created = await prisma.product.create({
      data: {
        title,
        slug,
        articleNumber: values.articleNumber || null,
        summary: values.summary || null,
        information: values.information || null,
        prices: values.prices || [],
        aboutProduct: values.aboutProduct || null,
        images: values.images || [],
        allowCustomerUpload: values.allowCustomerUpload || false,
        categoryId: values.categoryId || null,
      },
    });

    revalidatePath("/admin/produkter");
    revalidatePath("/produkt");

    return { ok: true, id: created.id };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Kunde inte skapa produkt");
  }
}

export async function updateProduct(
  id: string,
  values: {
    title: string;
    articleNumber?: string;
    summary?: string;
    information?: string;
    prices?: PriceTier[];
    aboutProduct?: string;
    images?: string[];
    allowCustomerUpload?: boolean;
    categoryId?: string;
  }
) {
  await requireAdminOrEditor();

  if (!id) throw new Error("ID krävs");
  const title = String(values.title ?? "").trim();
  if (!title) throw new Error("Titel krävs");

  try {
    // Check if title changed to regenerate slug
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { title: true, slug: true },
    });

    let slug = existing?.slug || generateSlug(title);
    
    // If title changed, regenerate slug
    if (existing && existing.title !== title) {
      const baseSlug = generateSlug(title);
      const otherProducts = await prisma.product.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      });
      const existingSlugs = otherProducts.map((p) => p.slug);
      slug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        articleNumber: values.articleNumber || null,
        summary: values.summary || null,
        information: values.information || null,
        prices: values.prices || [],
        aboutProduct: values.aboutProduct || null,
        images: values.images || [],
        allowCustomerUpload: values.allowCustomerUpload || false,
        categoryId: values.categoryId || null,
      },
    });

    revalidatePath("/admin/produkter");
    revalidatePath("/produkt");
    revalidatePath(`/produkt/${id}`);

    return { ok: true, id: updated.id };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Kunde inte uppdatera produkt");
  }
}

export async function deleteProduct(id: string) {
  await requireAdminOrEditor();

  if (!id) throw new Error("ID krävs");

  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/produkter");
    revalidatePath("/produkt");

    return { ok: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Kunde inte ta bort produkt");
  }
}

export async function getProductForEdit(id: string) {
  await requireAdminOrEditor();

  try {
    const [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    if (!product) {
      throw new Error("Produkten hittades inte");
    }

    return { product, categories };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Kunde inte hämta produkt");
  }
}
