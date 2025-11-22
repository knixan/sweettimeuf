"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type PriceTier = {
  quantity: number;
  price: number;
};

type Product = {
  id: string;
  title: string;
  prices: PriceTier[];
  image?: string;
  allowCustomerUpload: boolean;
};

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(
    product.prices[0] || null
  );
  const [customImageUrl, setCustomImageUrl] = useState("");

  const handleAddToCart = () => {
    if (!selectedTier) return;

    addItem({
      productId: product.id,
      title: product.title,
      quantity: selectedTier.quantity,
      price: selectedTier.price,
      image: product.image,
      customImageUrl: customImageUrl || undefined,
    });

    setCustomImageUrl("");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/kassa");
  };

  return (
    <div className="space-y-4">
      {/* Quantity/Price Selector */}
      {product.prices.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Välj antal</label>
          <select
            value={selectedTier ? product.prices.indexOf(selectedTier) : 0}
            onChange={(e) => setSelectedTier(product.prices[parseInt(e.target.value)])}
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          >
            {product.prices.map((tier, index) => (
              <option key={index} value={index}>
                {tier.quantity} st - {tier.price.toFixed(2)} kr
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Image Upload */}
      {product.allowCustomerUpload && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Ladda upp din bild (URL)
          </label>
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            placeholder="https://example.com/min-bild.jpg"
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Valfritt: Ange URL till den bild du vill använda på produkten
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!selectedTier}
          className="flex-1"
        >
          Lägg i kassan
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={!selectedTier}
          variant="outline"
          className="flex-1"
        >
          Köp nu
        </Button>
      </div>

      {selectedTier && (
        <div className="text-center text-2xl font-bold text-primary">
          Totalt: {(selectedTier.price * selectedTier.quantity).toFixed(2)} kr
        </div>
      )}
    </div>
  );
}
