export const VAT_RATE = 0.12;

export type BuyerType = "private" | "company";

/**
 * Alla priser lagras exkl. moms. Privatpersoner ser priset inkl. 12% moms
 * (livsmedelsmoms), företag/föreningar ser grundpriset.
 */
export function getDisplayPrice(basePrice: number, buyerType: BuyerType): number {
  return buyerType === "private" ? basePrice * (1 + VAT_RATE) : basePrice;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
