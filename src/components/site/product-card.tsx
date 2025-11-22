import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  slug?: string;
  articleNumber: string | null;
  summary: string | null;
  images: string[];
  prices: unknown;
};

type PriceTier = {
  quantity: number;
  price: number;
};

export function ProductCard({ product }: { product: Product }) {
  const prices = (product.prices as PriceTier[]) || [];
  const lowestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null;
  const firstImage = product.images[0];

  return (
    <Link href={`/produkt/${product.slug || product.id}`} className="group">
      <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
        {firstImage ? (
          <div className="relative aspect-square bg-muted">
            <Image
              src={firstImage}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="aspect-square bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Ingen bild</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.articleNumber && (
            <p className="text-sm text-muted-foreground mb-2">Art. nr: {product.articleNumber}</p>
          )}
          {product.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.summary}</p>
          )}
          {lowestPrice !== null && (
            <p className="text-lg font-bold text-primary">Från {lowestPrice.toFixed(2)} kr</p>
          )}
        </div>
      </div>
    </Link>
  );
}
