import { prisma } from "@/lib/prisma";
import { ProductCarousel } from "@/components/site/ProductCarousel";

type CartItem = { productId: string; quantity: number };

async function getPopularProducts() {
  const orders = await prisma.order.findMany({ select: { items: true } });

  const countMap: Record<string, number> = {};
  for (const order of orders) {
    const items = order.items as CartItem[];
    for (const item of items) {
      if (item.productId) {
        countMap[item.productId] =
          (countMap[item.productId] ?? 0) + (item.quantity ?? 1);
      }
    }
  }

  const topIds = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  if (topIds.length === 0) {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: topIds } },
  });
  const sorted = products.sort(
    (a, b) => (countMap[b.id] ?? 0) - (countMap[a.id] ?? 0),
  );

  if (sorted.length < 10) {
    const newProducts = await prisma.product.findMany({
      where: { id: { notIn: topIds } },
      orderBy: { createdAt: "desc" },
      take: 10 - sorted.length,
    });
    return [...sorted, ...newProducts];
  }

  return sorted;
}

export async function PopularProducts() {
  const products = await getPopularProducts();

  return (
    <ProductCarousel title="Våra populära produkter" products={products} />
  );
}
