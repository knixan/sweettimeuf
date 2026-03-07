import About from "@/components/site/About";
import Hero from "@/components/site/Hero";
import Team from "@/components/site/Team";
import { PopularProducts } from "@/components/site/PopularProducts";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <Hero />
      <PopularProducts />
      <About />
      <Team />
      <section id="kontakt" className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-foreground mb-4">Kontakta Oss</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Har du en fråga eller vill du skicka en offertförfrågan? Kontakta oss så hör vi av oss!
            </p>
          </div>
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl text-center">
            <p className="text-muted-foreground mb-6 text-lg">
              Skicka din offertförfrågan via e-post så återkommer vi!
            </p>
            <a href="mailto:lg.sweets10@gmail.com">
              <Button size="lg" className="rounded-full px-8 py-3">
                Maila din offertförfrågan
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
