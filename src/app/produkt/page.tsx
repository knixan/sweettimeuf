import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: category ? { categoryId: category } : {},
    include: {
      category: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      showInNavbar: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const selectedCategory = category
    ? categories.find((c) => c.id === category)
    : null;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {selectedCategory ? selectedCategory.name : "Alla produkter"}
        </h1>
        <p className="text-muted-foreground mb-6">{products.length} produkter</p>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Inga produkter hittades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
