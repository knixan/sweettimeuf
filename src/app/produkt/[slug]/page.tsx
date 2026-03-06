import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AddToCartForm } from "./add-to-cart-form";
import { ImageLightbox } from "@/components/site/ImageLightbox";
import Link from "next/link";

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
        {/* Breadcrumb */}
        <p className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Hem</Link>
          {" / "}
          {product.category ? (
            <>
              <Link
                href={product.category.slug ? `/kategori/${product.category.slug}` : "/produkter"}
                className="hover:underline"
              >
                {product.category.name}
              </Link>
              {" / "}
            </>
          ) : (
            <>
              <Link href="/produkter" className="hover:underline">Produkter</Link>
              {" / "}
            </>
          )}
          <span>{product.title}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Images with lightbox */}
          <div>
            <ImageLightbox images={product.images} title={product.title} />
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
