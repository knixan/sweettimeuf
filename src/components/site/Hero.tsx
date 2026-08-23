import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { CiMail } from "react-icons/ci";

export default function Hero() {
  return (
    <section
      className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden bg-[#111111]"
      id="hem"
    >
      <Image
        src="/sweettime-hero.png"
        alt="Premium godis och choklad från Sweet Time UF"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-linear-to-r from-[#111111] via-[#111111]/80 to-[#111111]/20" />
      <div className="absolute inset-0 bg-linear-to-t from-[#111111]/90 via-transparent to-[#151515]/40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase mb-4">
            Premium godis &amp; choklad
          </p>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-4">
            Magiska stunder.
            <br />
            <span className="italic font-normal">Kvalitet som smakar.</span>
          </h1>

          <p className="text-lg text-white/70 max-w-xl mb-10">
            Premium godis och choklad för företag, föreningar och
            privatpersoner. Vi skapar magiska stunder genom
            kvalitetsprodukter och personlig service.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/produkt"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-white text-[#111111] hover:bg-white/90 transition-colors"
            >
              Upptäck våra produkter
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
