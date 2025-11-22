import { requireAdminOrEditor } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductRow } from "./product-row";

export default async function ProductsPage() {
  await requireAdminOrEditor();

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

        <div className="bg-card rounded-lg border">
          {products.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Inga produkter än. Skapa din första produkt!
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
