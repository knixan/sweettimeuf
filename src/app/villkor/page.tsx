import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Köpvillkor",
  description:
    "Köpvillkor för beställningar hos Sweet Time UF – priser, betalning, leverans, ångerrätt och reklamation.",
};

export default function VillkorPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          Köpvillkor
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Senast uppdaterad: {new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-10 text-foreground">
          <section>
            <h2 className="font-display text-2xl mb-3">1. Om Sweet Time UF</h2>
            <p className="text-muted-foreground">
              Sweet Time UF är ett ungdomsföretag (UF-företag) som säljer
              profilprodukter, godis och trycksaker till privatpersoner,
              företag och föreningar.
            </p>
            <ul className="mt-3 space-y-1 text-muted-foreground">
              <li>Ort: Mjölby, Östergötland</li>
              <li>
                E-post:{" "}
                <a
                  href="mailto:lg.sweets10@gmail.com"
                  className="text-primary hover:underline"
                >
                  lg.sweets10@gmail.com
                </a>
              </li>
              <li>Kontaktperson: Ludvig Hedlund, Verkställande Direktör</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">2. Beställning</h2>
            <p className="text-muted-foreground">
              En beställning läggs via kassan på sajten. När beställningen har
              skickats in får du en orderbekräftelse via e-post med ett
              ordernummer. Bekräftelsen innebär att vi har tagit emot din
              beställning – den utgör inte i sig en bindande faktura.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              3. Priser och betalning
            </h2>
            <p className="text-muted-foreground">
              Priserna anges i svenska kronor (SEK) på respektive produktsida.
              Du kan välja om priserna ska visas för privatperson (inkl. 12%
              moms) eller företag/förening (exkl. moms) via väljaren högst
              upp på sajten – vilket val du gjort avgör vilket pris du
              faktureras. Faktura skickas manuellt efter att beställningen
              har behandlats – betalningsvillkor framgår av fakturan.
            </p>
            <p className="text-muted-foreground mt-3">
              Vid beställning av produkter med egen uppladdad design
              tillkommer en klichékostnad på 1000 kr per unik design (CMYK),
              respektive 500 kr vid repetitionsorder av en tidigare använd
              design. Kostnaden tillkommer per unik design, oavsett antal
              produkter i ordern, och läggs till på fakturan.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">4. Leverans</h2>
            <p className="text-muted-foreground">
              Leverans sker till den adress som anges i kassan. Leveranstid
              varierar beroende på produkt och eventuell tryckprocess – se
              respektive produktsida för uppskattad leveranstid där sådan
              anges.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">5. Ångerrätt</h2>
            <p className="text-muted-foreground">
              Vid köp som privatperson har du enligt lagen om distansavtal
              och avtal utanför affärslokaler normalt 14 dagars ångerrätt från
              det att du mottagit varan.
            </p>
            <p className="text-muted-foreground mt-3">
              Ångerrätten gäller inte produkter som har tillverkats efter
              dina specifikationer eller fått en tydlig personlig prägel –
              det gäller till exempel produkter med eget tryck eller egen
              uppladdad design. Vid köp som företag eller förening (B2B)
              gäller ingen lagstadgad ångerrätt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              6. Reklamation och fel
            </h2>
            <p className="text-muted-foreground">
              Om en produkt är felaktig eller skadad vid leverans, kontakta
              oss så snart som möjligt på{" "}
              <a
                href="mailto:lg.sweets10@gmail.com"
                className="text-primary hover:underline"
              >
                lg.sweets10@gmail.com
              </a>{" "}
              med ditt ordernummer och en beskrivning av felet. Vi hanterar
              reklamationer i enlighet med konsumentköplagen respektive
              köplagen (vid köp mellan företag).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              7. Ansvarsbegränsning
            </h2>
            <p className="text-muted-foreground">
              Sweet Time UF ansvarar inte för förseningar eller
              leveransproblem som beror på omständigheter utanför vår
              kontroll, till exempel force majeure, fel hos
              underleverantörer eller transportörer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              8. Tillämplig lag och tvist
            </h2>
            <p className="text-muted-foreground">
              Svensk lag tillämpas på dessa villkor. Vid tvist försöker vi
              alltid nå en överenskommelse direkt med kunden. Som
              privatperson kan du även vända dig till Allmänna
              reklamationsnämnden (ARN).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">9. Kontakt</h2>
            <p className="text-muted-foreground">
              Har du frågor om dessa villkor eller en pågående beställning,
              kontakta oss på{" "}
              <a
                href="mailto:lg.sweets10@gmail.com"
                className="text-primary hover:underline"
              >
                lg.sweets10@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
