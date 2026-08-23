"use client";

import { useBuyerType } from "@/contexts/buyer-type-context";
import type { BuyerType } from "@/lib/pricing";

export function BuyerTypeBar() {
  const { buyerType, setBuyerType } = useBuyerType();

  const options: { value: BuyerType; label: string }[] = [
    { value: "private", label: "Privatperson" },
    { value: "company", label: "Företag / förening" },
  ];

  return (
    <div className="bg-muted/50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-end gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground">
          Visar priser för:
        </span>
        <div className="inline-flex rounded-full border bg-background p-0.5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setBuyerType(option.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                buyerType === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {buyerType === "private" ? "Priser inkl. 12% moms" : "Priser exkl. moms"}
        </span>
      </div>
    </div>
  );
}
