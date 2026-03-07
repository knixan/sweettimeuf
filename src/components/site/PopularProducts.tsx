import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";

type CartItem = { productId: string; quantity: number };

async function getPopularProducts() {
  const orders = await prisma.order.findMany({ select: { items: true } });

  const countMap: Record<string, number> = {};
  for (const order of orders) {
    const items = order.items as CartItem[];
    for (const item of items) {
      if (item.productId) {
        countMap[item.productId] = (countMap[item.productId] ?? 0) + (item.quantity ?? 1);
      }
    }
  }

  const topIds = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  if (topIds.length === 0) {
    // Inga ordrar ännu – visa senaste produkterna
    return prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  }

  const products = await prisma.product.findMany({ where: { id: { in: topIds } } });

  return products.sort((a, b) => (countMap[b.id] ?? 0) - (countMap[a.id] ?? 0));
}

export async function PopularProducts() {
  const products = await getPopularProducts();
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Populäraste produkterna</h2>
          <p className="text-muted-foreground">Våra mest beställda produkter</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
