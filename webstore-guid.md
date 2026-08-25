# Adminguide – SweetTime UF

Den här guiden förklarar hur man använder admin-panelen på [sweettime-uf.se/admin](https://www.sweettime-uf.se/admin) för att hantera produkter, kategorier, offerter och kunder.

## Innehåll

- [Logga in och roller](#logga-in-och-roller)
- [Översikt](#översikt)
- [Produkter](#produkter)
- [Kategorier](#kategorier)
- [Offerter](#offerter)
- [Kunder](#kunder)
- [Admins](#admins)
- [Inställningar](#inställningar)
- [Vanliga frågor](#vanliga-frågor)
- [Todos / framtida funktioner](#todos--framtida-funktioner)

---

## Logga in och roller

Gå till [/logga-in](https://www.sweettime-uf.se/logga-in) och logga in med ditt konto. Kontot måste ha rollen `admin` eller `editor` för att komma åt `/admin` – vanliga kundkonton skickas tillbaka till startsidan.

Det finns två rollnivåer:

| Roll     | Kan hantera                           | Kan **inte** hantera   |
| -------- | ------------------------------------- | ---------------------- |
| `editor` | Produkter, kategorier, offerter       | Kunder, adminanvändare |
| `admin`  | Allt ovan + kunder och adminanvändare | –                      |

Nya konton på sidan får alltid rollen `user` (vanlig kund) och kan aldrig bli admin eller editor genom att registrera sig själva – det gör bara en befintlig admin via [Admins](#admins)-sidan.

## Översikt

`/admin` visar en startsida med genvägar till varje sektion. Vad du ser beror på din roll – `editor` ser Produkter, Kategorier och Offerter; `admin` ser även Kunder och Admins.

## Produkter

**Sida:** `/admin/produkter`

Här listas alla produkter. Klicka på en produkt för att redigera den, eller på **"Ny produkt"** för att skapa en.

### Fält i produktformuläret

| Fält                               | Beskrivning                                                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Titel** \*                       | Produktens namn – visas överallt på sajten                                                                                                                                     |
| **Kategori**                       | Valfri koppling till en kategori (styr var produkten dyker upp under `/kategori/...`)                                                                                          |
| **Art. nummer**                    | Internt artikelnummer, valfritt                                                                                                                                                |
| **Sammanfattning**                 | Kort text som visas i produktlistor/kort                                                                                                                                       |
| **Om produkten**                   | Längre beskrivningstext på produktsidan                                                                                                                                        |
| **Pris och antal**                 | En eller flera prisrader: `antal` + `pris (kr)`. Kunden väljer bland dessa rader i en dropdown vid köp – lägg till en rad per kvantitetssteg (t.ex. 100 st / 500 st / 1000 st) |
| **Information / detaljer**         | Fritext för t.ex. minsta order, hållbarhet, leveranstid                                                                                                                        |
| **Val av smak/färg**               | Valfritt. Ange en etikett (t.ex. "Välj smak") och lägg till alternativ med namn + ett eventuellt pristillägg i kr                                                              |
| **Bilder (URL)**                   | En eller flera bild-URL:er. Första bilden används som huvudbild                                                                                                                |
| **Tillåt kund att ladda upp bild** | Kryssruta – visar en riktig filuppladdningsknapp på produktsidan (bild eller PDF, via UploadThing) där kunden laddar upp sin egen design innan köp                             |
| **Tryckfiler / mallar**            | Länkar till nedladdningsbara PDF-mallar som visas på produktsidan                                                                                                              |

> **Viktigt om priser:** Kassan litar aldrig på vad kunden skickar in – den slår alltid upp det verkliga priset (och ett eventuellt varianttillägg) från produktens prisrader i databasen. Det betyder att en beställning bara går igenom om kunden väljer **exakt** en av de antal-rader du har lagt in, och en variant som faktiskt finns i listan. Lägger du inte in rätt kvantitet som en egen rad kan kunden inte beställa det antalet.

Produkter får automatiskt en unik URL-slug baserat på titeln (t.ex. "Tablettaskar 7010-1" → `/produkt/tablettaskar-7010-1`). Byter du titel på en befintlig produkt genereras en ny slug.

Ta bort en produkt via papperskorgs-knappen i listan – detta går inte att ångra.

## Kategorier

**Sida:** `/admin/kategorier`

Skapa en kategori med ett **namn** och kryssrutan **"Visa i navigering"**, som styr om kategorin dyker upp i navbarens meny. Slug (t.ex. `/kategori/godis`) genereras automatiskt från namnet.

Kategorier kan redigeras och tas bort från listan. Om en kategori tas bort behåller dess produkter sin data men tappar kopplingen till kategorin.

## Offerter

**Sida:** `/admin/offerter`

Alla beställningar som kommer in via kassan hamnar här som "offerter" (fakturering sker manuellt, inte automatiskt).

### Filter

Flikarna högst upp filtrerar listan: **Alla**, **Ohanterad**, **Hanterad**, **Skickad**, **Faktura skickad**.

### Per offert

- **Visa detaljer** – expanderar ordern och visar leverans-/fakturaadress, alla produkter med antal och pris, eventuell kunduppladdad design, och kundens övriga anteckningar
- Tre kryssrutor styr status: **Hanterad**, **Skickad**, **Faktura skickad** – status i listan (Ohanterad/Hanteras/Skickad/Faktura skickad) härleds automatiskt från dessa
- **Redigera** (endast `admin`) – öppnar ordern i ett redigeringsläge där du kan ändra kunduppgifter, adresser, och alla orderrader (titel, antal, pris, variant). Du kan även lägga till en helt ny rad (t.ex. för rabatt eller frakt) eller ta bort en rad. Totalsumman räknas alltid om automatiskt utifrån raderna när du sparar.
- **Generera faktura** (endast `admin`) – skapar en PDF-faktura med företagsuppgifterna från [Inställningar](#inställningar), Swish/bankgiro och orderns rader, och öppnar den i en ny flik. Fakturanumret (`F-2026-0001` osv.) sätts första gången du genererar fakturan för en order och är sedan detsamma varje gång du laddar ner den igen.
- **Ta bort kundens uppladdade bild** – tar bort länken till en kunds designfil från ordern (t.ex. efter att den använts eller om den var olämplig)
- **Ta bort** – raderar hela offerten permanent, går inte att ångra

> **Moms:** varje offert visar om kunden handlade som privatperson (inkl. 12% moms) eller företag/förening (exkl. moms) under totalsumman. Det styrs av väljaren högst upp på sajten och avgör vilket pris kunden fakturerades.

## Kunder

**Sida:** `/admin/kunder` — kräver `admin`-roll

Listar alla registrerade kundkonton (namn, e-post, om e-posten är verifierad, skapad-datum). Ett konto kan tas bort permanent härifrån – det raderar kontot men inte kundens tidigare offerter.

## Admins

**Sida:** `/admin/admins` — kräver `admin`-roll

- **Lägg till admin** – ange e-postadressen till en befintlig användare för att göra kontot till admin. Personen måste redan ha ett konto (registrerat sig) på sajten.
- **Ta bort admin** – tar bort adminrollen från ett konto (blir vanlig `user`) och skickas då tillbaka till att vara vanlig kund. Du kan inte ta bort din egen adminroll härifrån.

Notera att den här sidan bara hanterar rollen `admin`. Rollen `editor` sätts i dagsläget direkt i databasen och finns inte som knapp i gränssnittet.

## Inställningar

**Sida:** `/admin/installningar` — kräver `admin`-roll

Företagsuppgifterna som visas på genererade fakturor:

| Fält                          | Beskrivning                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| **Logga**                     | Laddas upp som bild (via UploadThing), visas överst på fakturan |
| **Företagsnamn**              | Obligatoriskt                                                   |
| **Organisationsnummer**       | Valfritt, visas under företagsnamnet på fakturan                |
| **Adress / Postnummer / Ort** | Avsändaradressen på fakturan                                    |
| **Swish-nummer**              | Visas i betalningsinformationen på fakturan                     |
| **Bankgironummer**            | Visas i betalningsinformationen på fakturan                     |

Fyll i dessa innan ni börjar generera fakturor på riktigt – saknas de blir betalningsinformationen tom på fakturan (inget kraschar, men kunden vet inte hur de ska betala).

## Vanliga frågor

**Jag loggade in men kommer inte in på /admin.**
Kontot har rollen `user` (vanlig kund). Be en befintlig admin ge dig `editor`- eller `admin`-rollen.

**Jag är editor men ser inte Kunder eller Admins i menyn.**
Det är avsett – de sidorna kräver `admin`-roll. Be en admin om hjälp med kund- eller adminhantering.

**En kund kan inte beställa den kvantitet jag tänkt mig.**
Kontrollera att exakt den kvantiteten finns som en egen rad under "Pris och antal" på produkten – kassan accepterar bara de exakta kvantiteter som är definierade där.

**Var skickas orderbekräftelser och kontaktmeddelanden?**
Via e-post (Nodemailer/SMTP), konfigurerat i `.env`. Kontaktformulärets meddelanden går till `lg.sweets10@gmail.com` med kundens e-post som svarsadress.

**Jag är editor men ser inte "Redigera" eller "Generera faktura" på en offert.**
Det är avsett – ordrredigering och fakturagenerering kräver `admin`-roll, eftersom det påverkar belopp och betalningsinformation. `editor` kan fortfarande se offertdetaljer och kryssa i status.

**Jag genererade en faktura innan jag fyllt i Inställningar – blir den fel nu?**
Nej. Fakturanumret sätts permanent första gången du genererar fakturan och ändras inte om du fyller i eller ändrar Inställningar efteråt – men innehållet i PDF:en (företagsnamn, Swish, bankgiro) hämtas på nytt varje gång du laddar ner den, så en ny nedladdning visar de aktuella uppgifterna under samma fakturanummer.

## Todos / framtida funktioner

Saker som inte är byggda idag men som diskuterats. Ingen av dem är påbörjad – markera gärna vad ni vill prioritera.

### Ägarskap / överlämning av drift

Sajten körs idag på Josefines egna konton (Vercel, Neon, Gmail för SMTP). Innan sajten går i skarp drift under Sweet Time UF bör driften flyttas över till företagets egna konton:

- **E-post (SMTP):** byt ut dagens app-lösenord (kopplat till Josefines privata Gmail) mot ett nytt app-lösenord kopplat till Ludvigs Gmail, knutet till den riktiga domänen – så att orderbekräftelser och kontaktmeddelanden går ut från rätt avsändare.
- **Kod/GitHub:** överför ägarskapet av GitHub-repot till Sweet Time UF – kunden har redan ett eget GitHub-konto.
- **Vercel:** driftsätt/flytta projektet till kundens eget Vercel-konto istället för Josefines – kunden har redan ett eget Vercel-konto.
- **Databas (Neon):** kunden behöver skapa ett eget (gratis) Neon-konto och få databasen migrerad dit, så att Sweet Time UF äger sin egen data oberoende av Josefines konto.
- **Sanity:** kunden behöver också skapa ett eget gratis Sanity-konto och få projektet överfört dit (se CMS-avsnittet nedan).

### Stripe för privatpersoner

Idag går alla beställningar via kassan som en "offert" – ingen betalning sker på sajten, faktura skickas manuellt i efterhand. Ett alternativ är att lägga till Stripe för kortbetalning direkt i kassan, åtminstone för privatpersoner (företag/föreningar vill oftast ändå ha faktura mot betalningsvillkor, så den delen kan vara kvar som idag).

**Rekommendation: behåll faktura och lägg inte in Stripe just nu.** Inte för att integrationen i sig är programmeringsmässigt riskabel – Stripe Checkout är ett välkänt, lågriskmönster som inte skulle rota till den befintliga koden särskilt mycket. Den egentliga konflikten är att Stripe kräver ett exakt, färdigt belopp **innan** kunden betalar, medan er nuvarande modell bygger på att lägga till rörliga extrakostnader (expresstillägg, annan förpackning, klichékostnad) **efteråt** på fakturan. Med Stripe måste man antingen bygga in alla de variablerna i kassan innan betalning, eller ta en andra betalning i efterhand för sånt som tillkommer – båda är krångligare än dagens flöde. Utöver det kräver Stripe riktig företagsverifiering för att kunna betala ut pengar – värt att kolla om Sweet Time UF som UF-företag ens kan öppna ett fullständigt Stripe-konto innan man lägger tid på integrationen.

- Kräver ett Stripe-konto och att man växlar mellan test- och livenycklar
- Skulle sannolikt bara aktiveras när köparen valt "Privatperson" i väljaren – företag fortsätter få faktura
- Påverkar orderflödet: en betald order bör markeras annorlunda än dagens "ohanterad/hanterad/skickad/faktura skickad"-status

### Sanity CMS för redigerbara texter — ✅ klart

Hero, Om oss, Köpvillkor och Integritetspolicy hämtar nu sin text från Sanity istället för att vara hårdkodade. Produkter och kategorier rörs inte – de hanteras fortfarande via det egna admingränssnittet, som tänkt.

**Så redigerar du innehållet:**

1. Starta appen som vanligt (`npm run dev`)
2. Öppna [http://localhost:3000/studio](http://localhost:3000/studio) (eller `/studio` på produktionsdomänen) och logga in med samma Sanity-konto som skapade projektet
3. Under "Innehåll" i menyn hittar du **Hero**, **Om oss-sida**, **Köpvillkor** och **Integritetspolicy** – redigera och klicka **Publicera**
4. Ändringen syns på sajten inom några sekunder (ingen omdeploy behövs)

**Tekniskt:**

- Sanity-projektet (`plgh82e6`, dataset `production`) är **inbäddat** i Next.js-appen på `/studio` – körs på samma port/process som resten av sajten, ingen separat server. Detta valdes medvetet framför Sanitys rekommenderade fristående upplägg (som fanns tidigare i en egen `studio/`-mapp), för att kunna nå Studio på samma URL-mönster som andra Sanity-projekt (`/studio` på port 3000). Priset: Studio-uppdateringar (buggfixar, säkerhetspatchar från Sanity) kräver `npm install` + omdeploy av hela appen istället för att ske automatiskt, och Studio-relaterade byggen/dev är långsammare.
- Så länge en sida saknar innehåll i Sanity (innan ni fyllt i något) visas samma text som fanns hårdkodad tidigare – inget blir tomt eller trasigt under övergången.
- Kom ihåg [Ägarskap-sektionen](#ägarskap--överlämning-av-drift) ovan – Sanity-kontot behöver också flyttas till kundens egen organisation.

### Fraktkostnader

**Just nu tillkommer ingen fraktkostnad någonstans i flödet** – varken i kassan eller på fakturan. Rekommendation: bestäm om frakt ska vara inräknad i priset (enklast för kunden, inga överraskningar) eller läggas på separat vid fakturering (mer rättvist om leveranser varierar mycket i vikt/storlek). Om ni vill ha en fraktavgift i kassan är det en förhållandevis liten ändring – en fast summa eller en trappa baserat på ordervärde, adderad till totalsumman på samma sätt som momsberäkningen görs idag.

### Synas på Google/Bing

Grunden finns redan – dynamisk `sitemap.xml`, `robots.txt` som pekar på den, sidspecifik metadata och JSON-LD på produktsidor. Det som återstår är mest verifiering och inskickning, inte kod:

- **Verifiera domänen i Google Search Console.** Görs via en TXT-post i DNS (samma ställe som ni ändrar övrig DNS för domänen, t.ex. Loopia). Detta är det viktigaste steget – utan det vet Google inte att sajten eller sitemapen finns, oavsett hur bra den är.
- **Verifiera i Bing Webmaster Tools** på samma sätt (Bing kan även importera direkt från en verifierad Google Search Console-koppling).
- **Skicka in `sitemap.xml` manuellt** i båda verktygen efter verifiering – snabbar upp den första indexeringen istället för att vänta på att crawlers hittar den själva.
- **Google Business-profil** – separat från sajten, kräver inget kodarbete, men avgörande för att synas i Google Maps/lokala sökningar (t.ex. "godis Mjölby"). Bara ett gratiskonto att skapa.

Mindre kodluckor värda att fixa när ni ändå är där:

- Ingen Twitter Card-metadata idag, bara Open Graph – påverkar hur länkar ser ut när de delas på X/Twitter.
- Inget Organization/LocalBusiness-schema (JSON-LD) utöver Product-schemat som redan finns på produktsidor – hjälper Google visa rätt företagsinfo (kontaktuppgifter, logotyp) i sökresultat.
- Kolla att `favicon.ico` faktiskt är Sweet Time-loggan och inte Next.js standardikon.

### Fortnox-integration

Fortnox har ett publikt REST-API som stödjer att skapa kunder och fakturor programmatiskt. Skulle passa den nuvarande modellen bra som ett mellanting – istället för att en admin skriver av ordern för hand i Fortnox, skickas orderdatan (kund, produkter, pris, moms) som ett **fakturautkast** till Fortnox via en knapp i offert-vyn. Admin fyller bara i det som varierar (klichékostnad, expresstillägg) och skickar iväg fakturan från Fortnox, istället för att skriva av allt manuellt – man behåller alltså den mänskliga kontrollen men slipper dubbelarbetet.

- Kräver att kunden har ett Fortnox-abonnemang med API-åtkomst aktiverad (ofta en liten extra månadskostnad utöver vanligt abonnemang)
- Kräver en registrerad integration i Fortnox utvecklarportal för att få API-nycklar (OAuth 2.0-flöde)
- Inte trivialt men väldokumenterat API – en rimlig storlek på jobb, inte en stor omskrivning

### Klichékostnad – automatisera eller inte?

Idag är klichékostnaden (1000 kr/design, 500 kr vid repetitionsorder) bara en **varningstext** på produktsidan och i kassan – den räknas inte in i totalsumman utan läggs på manuellt när fakturan skapas. Rekommendation: **behåll det manuella flödet tills vidare.** Att automatisera det helt kräver att systemet vet om en design är ny eller en repetition av en tidigare beställning – det betyder att jämföra den uppladdade bildlänken mot kundens tidigare ordrar, vilket inte är trivialt (kunder kan ladda upp samma design till olika URL:er, byta url-tjänst, etc.). Om ni ändå vill automatisera det som en förenkling: lägg alltid till "ny design"-kostnaden (1000 kr) automatiskt när `customImageUrl` finns på en orderrad, och hantera repetitionsrabatten manuellt vid fakturering – det täcker det vanligaste fallet utan att bygga historikjämförelse.
