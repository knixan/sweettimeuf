import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/site/product-card";

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">Hem</Link>
            {" / "}
            <Link href="/produkt" className="hover:underline">Produkter</Link>
            {" / "}
            <span>{category.name}</span>
          </p>
          <h1 className="text-4xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground mt-2">
            {category.products.length} produkt{category.products.length !== 1 ? "er" : ""}
          </p>
        </div>

        {category.products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Inga produkter i denna kategori ännu.</p>
            <Link href="/produkt" className="mt-4 inline-block text-primary hover:underline">
              Se alla produkter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
