import About from "@/components/site/About";
import Hero from "@/components/site/Hero";
import Team from "@/components/site/Team";
import { Button } from "@/components/ui/button";

// Lägg till importer:
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";

// Lägg till före Page():
type PriceTier = { quantity: number; price: number };
async function getPopularProducts() {
  try {
    const orders = await prisma.order.findMany({ select: { items: true } });
    const cnt: Record<string, number> = {};
    for (const order of orders) {
      const items = order.items as Array<{ productId: string; quantity: number }>;
      for (const item of items) {
        if (item.productId) cnt[item.productId] = (cnt[item.productId] || 0) + item.quantity;
      }
    }
    const topIds = Object.entries(cnt)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);
    if (topIds.length > 0) {
      const found = await prisma.product.findMany({ where: { id: { in: topIds } } });
      return topIds.map((id) => found.find((p) => p.id === id)).filter(Boolean) as typeof found;
    }
    return await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  } catch {
    return [];
  }
}

// Ändra Page till async och lägg till efter <Hero />:
export default async function Page() {
  const popular = await getPopularProducts();
  return (
    <>
      <Hero />
      {popular.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Populäraste Produkterna</h2>
              <p className="text-muted-foreground">De produkter som flest kunder beställer</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popular.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    title: p.title,
                    slug: p.slug ?? undefined,
                    articleNumber: p.articleNumber,
                    summary: p.summary,
                    images: p.images,
                    prices: p.prices as PriceTier[],
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <About />
      <Team />
      <section id="kontakt" className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-foreground mb-4">
              Kontakta Oss
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Har du en fråga eller vill du skicka en offertförfrågan? Kontakta
              oss så hör vi av oss!
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl text-center">
            <p className="text-muted-foreground mb-6 text-lg">
              Skicka din offertförfrågan via e-post så återkommer vi!
            </p>
            <a href="mailto:lg.sweets10@gmail.com">
              <Button size="lg" className="rounded-full px-8 py-3">
                Maila din offertförfrågan 
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
