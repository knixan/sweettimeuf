import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartForm } from "./add-to-cart-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  type PriceTier = { quantity: number; price: number };

  const prices = (product.prices as PriceTier[]) || [];

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.title} - bild ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Ingen bild tillgänglig</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            {product.articleNumber && (
              <p className="text-lg text-muted-foreground mb-4">
                Art. nr: {product.articleNumber}
              </p>
            )}

            {product.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Sammanfattning</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.summary}</p>
              </div>
            )}

            {product.information && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Om produkten</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.information}</p>
              </div>
            )}

            {/* Prices */}
            {prices.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Pris och antal</h2>
                <div className="bg-card border rounded-lg p-4 space-y-2">
                  {prices.map((tier, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{tier.quantity} st:</span>
                      <span className="font-semibold">{tier.price.toFixed(2)} kr</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Form */}
            <AddToCartForm
              product={{
                id: product.id,
                title: product.title,
                prices,
                image: product.images[0],
                allowCustomerUpload: product.allowCustomerUpload,
              }}
            />
          </div>
        </div>

        {/* Information */}
        {product.aboutProduct && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Information</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">{product.aboutProduct}</p>
          </div>
        )}
      </div>
    </main>
  );
}
