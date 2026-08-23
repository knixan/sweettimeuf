import { prisma } from "@/lib/prisma";
import { ProductCarousel } from "@/components/site/ProductCarousel";

async function getNewestProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function NewestProducts() {
  const products = await getNewestProducts();

  return <ProductCarousel title="Våra nyaste produkter" products={products} />;
}
