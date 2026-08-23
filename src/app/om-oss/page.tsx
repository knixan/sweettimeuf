import About from "@/components/site/About";
import Team from "@/components/site/Team";
import { Contact } from "@/components/site/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Lär känna SweetTime UF – ett ungdomsföretag som säljer profilprodukter, godis och trycksaker med tryck.",
  openGraph: {
    title: "Om oss – SweetTime UF",
    description:
      "Lär känna SweetTime UF – ett ungdomsföretag som säljer profilprodukter, godis och trycksaker med tryck.",
  },
};

export default function Page() {
  return (
    <>
      <About />
      <Team />
      <section id="kontakt" className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-foreground mb-4">
              Kontakta Oss
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Har du en fråga eller vill du skicka en offertförfrågan? Kontakta
              oss så hör vi av oss!
            </p>
          </div>
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl">
            <Contact />
          </div>
        </div>
      </section>
    </>
  );
}
