"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";

type Product = {
  id: string;
  title: string;
  slug?: string | null;
  articleNumber: string | null;
  summary: string | null;
  images: string[];
  prices: unknown;
};

export function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            {title}
          </h2>
          <Link
            href="/produkt"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          >
            Se alla produkter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="pl-4 flex-none w-[85%] sm:w-1/2 md:w-1/3 lg:w-1/5"
              >
                <ProductCard
                  product={{ ...product, slug: product.slug ?? undefined }}
                />
              </div>
            ))}
          </div>
        </div>

        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            aria-label="Föregående"
            className="absolute left-2 sm:left-0 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canScrollNext && (
          <button
            onClick={scrollNext}
            aria-label="Nästa"
            className="absolute right-2 sm:right-0 sm:translate-x-1/2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
}
