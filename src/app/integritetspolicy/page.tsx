import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Hur Sweet Time UF samlar in, använder och skyddar dina personuppgifter i samband med köp och konto på sajten.",
};

export default function IntegritetspolicyPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          Integritetspolicy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Senast uppdaterad:{" "}
          {new Date().toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="space-y-10 text-foreground">
          <section>
            <h2 className="font-display text-2xl mb-3">
              1. Personuppgiftsansvarig
            </h2>
            <p className="text-muted-foreground">
              Sweet Time UF, Mjölby, är personuppgiftsansvarig för de
              personuppgifter som behandlas i samband med köp och användarkonto
              på sajten. Kontakta oss på{" "}
              <a
                href="mailto:lg.sweets10@gmail.com"
                className="text-primary hover:underline"
              >
                lg.sweets10@gmail.com
              </a>{" "}
              vid frågor om hur dina uppgifter behandlas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              2. Vilka uppgifter vi samlar in
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>
                <span className="font-medium text-foreground">
                  Vid beställning:
                </span>{" "}
                namn, e-postadress, telefonnummer, leveransadress, eventuell
                fakturaadress, samt eventuellt företagsnamn och
                organisationsnummer
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Vid skapande av konto:
                </span>{" "}
                namn, e-postadress och lösenord (lagras krypterat, aldrig i
                klartext)
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Vid kontakt via kontaktformuläret:
                </span>{" "}
                namn, e-postadress, eventuellt telefonnummer och innehållet i
                meddelandet
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Vid egen designuppladdning:
                </span>{" "}
                en länk till den bild eller fil du själv väljer att ange
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              3. Varför vi behandlar dina uppgifter
            </h2>
            <p className="text-muted-foreground">
              Vi behandlar dina uppgifter för att kunna fullgöra köpet (leverera
              varan och skicka faktura), hantera ditt konto och din
              orderhistoria, svara på meddelanden du skickar via
              kontaktformuläret, och uppfylla bokföringsskyldigheter enligt
              bokföringslagen. Den rättsliga grunden är i huvudsak fullgörande
              av avtal samt rättslig förpliktelse.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              4. Hur länge vi sparar uppgifterna
            </h2>
            <p className="text-muted-foreground">
              Uppgifter kopplade till en beställning sparas så länge det krävs
              enligt bokföringslagen, normalt sju år efter räkenskapsårets
              utgång. Kontouppgifter sparas så länge du har ett aktivt konto hos
              oss – du kan när som helst be oss radera ditt konto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              5. Vem vi delar uppgifter med
            </h2>
            <p className="text-muted-foreground">
              Vi säljer aldrig dina uppgifter vidare. Uppgifter kan delas med
              underleverantörer som behövs för att driva sajten och leverera din
              beställning, till exempel vår e-postleverantör (för
              orderbekräftelser och kontoutskick) och vår driftleverantör som
              hostar sajten och databasen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">6. Cookies</h2>
            <p className="text-muted-foreground">
              Sajten använder endast cookies som krävs för att sajten ska
              fungera – framför allt en inloggningscookie som håller dig
              inloggad. Vi använder inga cookies för reklam eller
              tredjeparts­analys. Nödvändiga cookies kräver inte samtycke enligt
              lagen om elektronisk kommunikation, men du informeras om dem här.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">7. Dina rättigheter</h2>
            <p className="text-muted-foreground">
              Du har rätt att begära tillgång till, rättelse av eller radering
              av dina personuppgifter, samt att invända mot viss behandling.
              Kontakta oss på{" "}
              <a
                href="mailto:lg.sweets10@gmail.com"
                className="text-primary hover:underline"
              >
                lg.sweets10@gmail.com
              </a>{" "}
              för att utöva dina rättigheter. Du har även rätt att lämna in ett
              klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att
              vi behandlar dina uppgifter felaktigt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-3">
              8. Ändringar av policyn
            </h2>
            <p className="text-muted-foreground">
              Vi kan uppdatera den här policyn, till exempel om vi ändrar vilka
              verktyg vi använder för att driva sajten. Den senaste versionen
              finns alltid på den här sidan.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
