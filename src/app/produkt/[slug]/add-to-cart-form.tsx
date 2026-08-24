"use client";

import { useState } from "react";
import { z } from "zod";
import { useCart } from "@/contexts/cart-context";
import { useBuyerType } from "@/contexts/buyer-type-context";
import { getDisplayPrice, formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const imageUrlSchema = z
  .string()
  .url("Ange en giltig URL (börja med https://)")
  .optional()
  .or(z.literal(""));

type PriceTier = {
  quantity: number;
  price: number;
};

type VariantOption = {
  name: string;
  surcharge: number;
};

type PrintTemplate = {
  label: string;
  url: string;
};

type Product = {
  id: string;
  title: string;
  prices: PriceTier[];
  image?: string;
  allowCustomerUpload: boolean;
  variantLabel?: string | null;
  variantOptions?: VariantOption[];
  variants?: string[];
  printTemplates?: PrintTemplate[];
};

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { buyerType } = useBuyerType();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(
    product.prices[0] || null,
  );
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variantOptions?.[0]?.name ?? product.variants?.[0] ?? "",
  );

  const surcharge =
    product.variantOptions?.find((v) => v.name === selectedVariant)
      ?.surcharge ?? 0;
  const effectivePrice = selectedTier ? selectedTier.price + surcharge : 0;

  const handleAddToCart = (): boolean => {
    if (!selectedTier) return false;

    const urlResult = imageUrlSchema.safeParse(customImageUrl);
    if (!urlResult.success) {
      setImageUrlError(urlResult.error.issues[0].message);
      return false;
    }
    setImageUrlError(null);

    addItem({
      productId: product.id,
      title: product.title,
      quantity: selectedTier.quantity,
      price: effectivePrice,
      image: product.image,
      customImageUrl: customImageUrl || undefined,
      selectedVariant: selectedVariant || undefined,
    });

    setCustomImageUrl("");
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      router.push("/kassa");
    }
  };

  const hasVariants =
    (product.variantOptions && product.variantOptions.length > 0) ||
    (product.variants && product.variants.length > 0);

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      {hasVariants && (
        <div>
          <label className="block text-sm font-medium mb-2">
            {product.variantLabel || "Välj variant"}
          </label>
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          >
            {product.variantOptions
              ? product.variantOptions.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                    {v.surcharge > 0
                      ? ` (+${formatPrice(getDisplayPrice(v.surcharge, buyerType))} kr)`
                      : ""}
                  </option>
                ))
              : product.variants?.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
          </select>
        </div>
      )}
      {product.prices.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Välj antal</label>
          <select
            value={selectedTier ? product.prices.indexOf(selectedTier) : 0}
            onChange={(e) =>
              setSelectedTier(product.prices[parseInt(e.target.value)])
            }
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          >
            {product.prices.map((tier, index) => (
              <option key={index} value={index}>
                {tier.quantity} st —{" "}
                {formatPrice(getDisplayPrice(tier.price + surcharge, buyerType))} kr
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Image Upload */}
      {product.allowCustomerUpload && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Länk till din bild eller design
          </label>
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => {
              setCustomImageUrl(e.target.value);
              setImageUrlError(null);
            }}
            placeholder="https://example.com/min-bild.jpg"
            className="w-full rounded-md bg-input/10 border border-input px-3 py-2"
          />
          {imageUrlError && (
            <p className="text-sm text-red-500 mt-1">{imageUrlError}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Valfritt: Ange URL till din bild (JPG, PNG) eller PDF-fil
          </p>
          <p className="text-sm text-muted-foreground mt-1 font-bold">
            OBS! En klichékostnad tillkommer per unik design som laddas upp,
            oavsett antal produkter i ordern – se prisuppgift under
            Information ovan. Tillkommer på fakturan.
          </p>
        </div>
      )}

      {/* Print Templates */}
      {product.printTemplates && product.printTemplates.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">Ladda ner designmall</p>
          <div className="flex flex-col gap-1">
            {product.printTemplates.map((t, i) => (
              <a
                key={i}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline hover:opacity-80"
              >
                {t.label}
              </a>
            ))}
          </div>
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
          Totalt:{" "}
          {formatPrice(
            getDisplayPrice(effectivePrice, buyerType) * selectedTier.quantity,
          )}{" "}
          kr
          <p className="text-xs font-normal text-muted-foreground mt-1">
            {buyerType === "private" ? "Inkl. 12% moms" : "Exkl. moms"}
          </p>
          {surcharge > 0 && (
            <p className="text-sm font-normal text-muted-foreground mt-1">
              inkl. pristillägg {selectedVariant} (+
              {formatPrice(getDisplayPrice(surcharge, buyerType))} kr)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
