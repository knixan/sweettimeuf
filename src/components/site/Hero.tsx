"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Slide = {
  title: string;
  text: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Se vårt Julsortiment",
    text: "Perfekta gåvor och säsongsprodukter för företag och privatpersoner",
    image: "/images/bildspel/julkorg-strutar-sack.jpg",
  },

  {
    title: "Müslibar flowpack",
    text: "Müslibar i smakerna choklad och kokos. Perfekt som mellanmål eller snacks",
    image: "/images/bildspel/Muslibar-flowpack.png",
  },
  {
    title: "Chokladbitar express",
    text: "Små chokladbitar med tryck runt omslaget. Perfekt för event och giveaways",
    image: "/images/bildspel/Chokladbitar-express-01.png",
  },
  {
    title: "Twistad Choklad",
    text: "Chokladöverdragna smörkolor, klassiskt reklamgodis.",
    image: "/images/bildspel/Twistad-choklad-01.jpg",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const max = useMemo(() => slides.length, []);

  useEffect(() => {
    const id = setInterval(() => setCurrent((i) => (i + 1) % max), 5000);
    return () => clearInterval(id);
  }, [max]);

  const prev = () => setCurrent((i) => (i - 1 + max) % max);
  const next = () => setCurrent((i) => (i + 1) % max);

  return (
    <section className="py-20 bg-background" id="hem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-5xl text-foreground mb-6">
            Våra Specialiteter
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upptäck vårt handplockade sortiment av premium godis och choklad
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-card">
          {/* Rubrik för mobil ovanför bilden */}
          <div className="md:hidden text-center text-foreground px-8 py-8">
            <h3 className="font-display text-2xl font-bold mb-4">
              {slides[current].title}
            </h3>
          </div>

          <div className="relative w-full aspect-[16/9]">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority={i === current}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
            ))}

            {/* Text för desktop absolut över bilden */}
            <div className="hidden md:flex absolute inset-0 items-end justify-center pb-20 px-8 z-10">
              <div className="text-center text-foreground max-w-3xl">
                <h3 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  {slides[current].title}
                </h3>
                <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                  {slides[current].text}
                </p>
                <Link
                  href="/produkter"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Se Produkter
                </Link>
              </div>
            </div>

            <button
              aria-label="Föregående"
              onClick={prev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-popover/70 hover:bg-popover text-card-foreground p-4 rounded-full transition-all z-20"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              aria-label="Nästa"
              onClick={next}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-popover/70 hover:bg-popover text-card-foreground p-4 rounded-full transition-all z-20"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Gå till slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "bg-white w-8" : "bg-white/50 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Beskrivning och knapp för mobil under bilden */}
            <div className="md:hidden text-center text-foreground px-8 py-8">
            <p className="text-base mb-6 text-muted-foreground">
              {slides[current].text}
            </p>
            <Link
              href="/produkter"
              className="inline-flex items-center px-6 py-3 text-base font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Se Produkter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
