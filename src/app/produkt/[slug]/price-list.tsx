"use client";

import { useBuyerType } from "@/contexts/buyer-type-context";
import { getDisplayPrice, formatPrice } from "@/lib/pricing";

type PriceTier = { quantity: number; price: number };

export function PriceList({ prices }: { prices: PriceTier[] }) {
  const { buyerType } = useBuyerType();

  if (prices.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Pris och antal</h2>
      <div className="bg-card border rounded-lg p-4 space-y-2">
        {prices.map((tier, index) => (
          <div key={index} className="flex justify-between">
            <span>{tier.quantity} st:</span>
            <span className="font-semibold">
              {formatPrice(getDisplayPrice(tier.price, buyerType))} kr
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {buyerType === "private" ? "Priser inkl. 12% moms" : "Priser exkl. moms"}
      </p>
    </div>
  );
}
