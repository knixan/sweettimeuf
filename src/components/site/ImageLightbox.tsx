"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  title: string;
}

export function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Thumbnail carousel
  const [thumbRef, thumbApi] = useEmblaCarousel({ axis: "x", dragFree: true });
  // Lightbox carousel
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const scrollPrev = useCallback(() => {
    lightboxApi?.scrollPrev();
  }, [lightboxApi]);

  const scrollNext = useCallback(() => {
    lightboxApi?.scrollNext();
  }, [lightboxApi]);

  // Scroll lightbox carousel to correct slide when opening
  useEffect(() => {
    if (lightboxOpen && lightboxApi) {
      lightboxApi.scrollTo(lightboxIndex, true);
    }
  }, [lightboxOpen, lightboxIndex, lightboxApi]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    if (lightboxOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, scrollPrev, scrollNext]);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Ingen bild tillgänglig</span>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail grid / single image */}
      {images.length === 1 ? (
        <div
          className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-zoom-in group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt={`${title} - bild 1`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main image */}
          <div
            className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-zoom-in group"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={images[0]}
              alt={`${title} - bild 1`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </div>
          {/* Thumbnail strip */}
          <div className="overflow-hidden" ref={thumbRef}>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`relative flex-none w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    i === 0 ? "border-primary" : "border-transparent hover:border-primary/50"
                  }`}
                  onClick={() => openLightbox(i)}
                >
                  <Image
                    src={img}
                    alt={`${title} - miniatyrbild ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 text-white bg-black/50 rounded-full px-3 py-1 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Carousel */}
          <div
            className="w-full max-w-4xl max-h-screen p-4 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden" ref={lightboxRef}>
              <div className="flex">
                {images.map((img, i) => (
                  <div key={i} className="flex-none w-full flex items-center justify-center">
                    <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                      <Image
                        src={img}
                        alt={`${title} - bild ${i + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollPrev();
                    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollNext();
                    setLightboxIndex((prev) => (prev + 1) % images.length);
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === lightboxIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    lightboxApi?.scrollTo(i);
                    setLightboxIndex(i);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
