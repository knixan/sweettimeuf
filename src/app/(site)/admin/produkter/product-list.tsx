"use client";

import { useState } from "react";
import { ProductRow } from "./product-row";

type Product = {
  id: string;
  title: string;
  articleNumber: string | null;
  summary: string | null;
  category: { id: string; name: string } | null;
  images: string[];
};

type Category = {
  id: string;
  name: string;
};

export function ProductList({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("alla");

  const term = search.trim().toLowerCase();

  const filtered = products.filter((p) => {
    const matchesSearch = term
      ? p.title.toLowerCase().includes(term) ||
        (p.articleNumber?.toLowerCase().includes(term) ?? false)
      : true;
    const matchesCategory =
      activeCategory === "alla"
        ? true
        : activeCategory === "ingen"
          ? !p.category
          : p.category?.id === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const countFor = (categoryId: string) =>
    products.filter((p) =>
      categoryId === "alla"
        ? true
        : categoryId === "ingen"
          ? !p.category
          : p.category?.id === categoryId,
    ).length;

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Sök på titel eller artikelnummer..."
        className="w-full rounded-md bg-input/10 border border-input px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("alla")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            activeCategory === "alla"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Alla
          <span className="ml-1.5 text-xs opacity-70">
            ({countFor("alla")})
          </span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === c.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {c.name}
            <span className="ml-1.5 text-xs opacity-70">
              ({countFor(c.id)})
            </span>
          </button>
        ))}
        <button
          onClick={() => setActiveCategory("ingen")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            activeCategory === "ingen"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Utan kategori
          <span className="ml-1.5 text-xs opacity-70">
            ({countFor("ingen")})
          </span>
        </button>
      </div>

      <div className="bg-card rounded-lg border">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            {term || activeCategory !== "alla"
              ? "Inga produkter matchar filtret"
              : "Inga produkter än. Skapa din första produkt!"}
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
