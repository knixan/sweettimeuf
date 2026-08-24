import { requireAdminOrEditor } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductList } from "./product-list";

export default async function ProductsPage() {
  await requireAdminOrEditor();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Produkter</h1>
          <Link
            href="/admin/produkter/skapa-produkt"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + Skapa produkt
          </Link>
        </div>

        <ProductList products={products} categories={categories} />
      </div>
    </main>
  );
}
