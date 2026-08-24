import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { CiMail } from "react-icons/ci";
import { sanityFetch } from "@/sanity/lib/live";
import { HERO_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

const DEFAULTS = {
  eyebrow: "Premium godis & choklad",
  heading: "Magiska stunder.",
  headingItalic: "Kvalitet som smakar.",
  body: "Premium godis och choklad för företag, föreningar och privatpersoner. Vi skapar magiska stunder genom kvalitetsprodukter och personlig service.",
  ctaLabel: "Upptäck våra produkter",
  ctaHref: "/produkt",
};

export default async function Hero() {
  const { data: hero } = await sanityFetch({ query: HERO_QUERY });

  const eyebrow = hero?.eyebrow || DEFAULTS.eyebrow;
  const heading = hero?.heading || DEFAULTS.heading;
  const headingItalic = hero?.headingItalic || DEFAULTS.headingItalic;
  const body = hero?.body || DEFAULTS.body;
  const ctaLabel = hero?.ctaLabel || DEFAULTS.ctaLabel;
  const ctaHref = hero?.ctaHref || DEFAULTS.ctaHref;
  const backgroundImageUrl = hero?.backgroundImage
    ? urlFor(hero.backgroundImage).width(1920).url()
    : "/sweettime-hero.png";

  return (
    <section
      className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden bg-[#111111]"
      id="hem"
    >
      <Image
        src={backgroundImageUrl}
        alt="Premium godis och choklad från Sweet Time UF"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-linear-to-r from-[#111111] via-[#111111]/60 to-[#111111]/10" />
      <div className="absolute inset-0 bg-linear-to-t from-[#111111]/70 via-transparent to-[#151515]/20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase mb-4">
              {eyebrow}
            </p>
          )}

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-4">
            {heading}
            {headingItalic && (
              <>
                <br />
                <span className="italic font-normal">{headingItalic}</span>
              </>
            )}
          </h1>

          {body && (
            <p className="text-lg text-white/70 max-w-xl mb-10">{body}</p>
          )}

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-white text-[#111111] hover:bg-white/90 transition-colors"
            >
              {ctaLabel}
              <FiArrowRight />
            </Link>

            <Link
              href="/produkt"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-white text-[#111111] hover:bg-white/90 transition-colors"
            >
              <CiMail />
              Kontakta oss
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
