import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";

async function getNewestProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function NewestProducts() {
  const products = await getNewestProducts();
  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Nyaste produkterna</h2>
          <p className="text-muted-foreground">Våra nyaste produkter</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, slug: product.slug ?? undefined }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
