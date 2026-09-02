# SweetTime UF

**Webbshop för SweetTime UF – profilprodukter, godis och trycksaker**

🌐 [www.sweettime-uf.se](https://www.sweettime-uf.se)

---

En Next.js e-handelsapplikation byggd för SweetTime UF. Hanterar produktkatalog, kategorier, kundvagn, kassa och orderhantering med ett fullständigt admingränssnitt.

## Tekniker

| Kategori          | Teknik                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Framework         | Next.js 16 (App Router)                                                                     |
| UI                | React 19, Tailwind CSS 4, shadcn/ui                                                         |
| Typsnitt          | Playfair Display (rubriker), Inter (brödtext)                                               |
| Språk             | TypeScript                                                                                  |
| Databas           | PostgreSQL + Prisma ORM                                                                     |
| Autentisering     | BetterAuth 1.3 (e-post/lösenord, roller) – version **pinnad**, se Säkerhet nedan            |
| Innehåll (CMS)    | Sanity – inbäddad Studio (`/studio`), redigerbara sidor (hero, om oss, villkor, integritet) |
| Filuppladdning    | UploadThing – kundens designfiler, företagets logga i admin                                 |
| Fakturor          | @react-pdf/renderer – PDF-generering server-side                                            |
| E-post            | Nodemailer (SMTP) – orderbekräftelse, verifiering, lösenordsåterställning, kontaktformulär  |
| Formulär          | React Hook Form + Zod                                                                       |
| Carousel/Lightbox | Embla Carousel                                                                              |
| Diagram           | Recharts (försäljningsstatistik i admin)                                                    |
| Notifieringar     | Sonner                                                                                      |
| Tema              | next-themes (mörkt/ljust)                                                                   |

## Funktioner

### Kund

- Produktkatalog med kategorier
- Produktsidor med bildlightbox
- Produktvarianter (t.ex. färg, storlek) med konfigurerbar etikett
- Möjlighet för kunden att ladda upp egen bild/design per produkt (riktig filuppladdning via UploadThing, ej länk)
- Kundvagn med antal och pristrappor
- Kassaformulär: kontaktuppgifter, leveransadress, fakturaadress, organisationsnummer
- Orderbekräftelsesida
- Orderhistorik via "Mina sidor" (kräver inloggning)
- Registrering och inloggning med e-postverifiering
- Glömt lösenord / återställ lösenord via e-post
- Kontaktformulär (om oss-sidan) som skickar e-post direkt via Nodemailer, istället för en mailto-länk
- Prisväljare Privatperson/Företag högst upp på sajten – styr om priser visas inkl. 12% moms (livsmedelsmoms) eller exkl. moms, sparas i localStorage och gäller genom hela köpflödet
- Produktkaruseller på startsidan (populäraste och nyaste produkterna) med pilnavigering på desktop och "peek"-swipe på mobil

### Admin

- Dashboard (`/admin`) med statistik: försäljning senaste 30 dagarna (diagram), antal ordrar, obehandlade ordrar, populäraste produkter och senaste ordrar
- Produkthantering: skapa/redigera/ta bort produkter med bilder, pristrappor, varianter och kategorier – med sökfält och kategorifilter
- Kategorihantering: skapa/redigera, auto-generering av slug, styr vilka kategorier visas i navbaren
- Orderhantering: visa ordrar, sök (ordernummer/namn/e-post/företag) och filtrera på status; orderstatus härleds automatiskt från flaggorna `handled` / `shipped` / `invoiceSent`; visar om kunden betalade som privatperson (inkl. moms) eller företag (exkl. moms)
- Orderredigering (`/admin/offerter/[id]/redigera`, endast `admin`): redigera kunduppgifter, adresser och radera/lägg till/ändra orderrader (t.ex. rabatt eller frakt som extra rad) – totalsumman räknas om automatiskt från raderna
- Fakturagenerering (`/admin/offerter/[id]/faktura`, endast `admin`): genererar en PDF-faktura med företagsuppgifter, Swish/bankgiro och orderrader; fakturanumret sätts löpande (`F-ÅÅÅÅ-NNNN`) första gången och återanvänds vid ny nedladdning av samma order
- Inställningar (`/admin/installningar`, endast `admin`): företagsnamn, org.nr, adress, Swish-nummer, bankgironummer och logga (UploadThing) – används på genererade fakturor
- Kundhantering med sökfält
- Adminanvändarhantering: befordra/ta bort admins
- Mobilanpassad adminmeny (utfällbar sidomeny) utöver den vanliga menyraden på desktop
- Alla adminrutter skyddade via inloggning + roll – två rollnivåer:
  - `admin` – full åtkomst, inklusive adminanvändare och kundhantering
  - `editor` – kan hantera produkter, kategorier och ordrar, men inte adminanvändare eller kundkonton

## Säkerhet

- `/admin/*` – skyddad i tre lager: `src/proxy.ts` (backstop), gemensam layout-nivå sessionscheck (`requireAdminOrEditor` i `src/app/(site)/admin/layout.tsx`) och varje enskild server action gör sin egen roll-kontroll (`requireAdmin` / `requireAdminOrEditor` i `src/lib/server-auth.ts`) så att åtgärder inte kan anropas direkt förbi UI:t
- `role`-fältet på användaren kan aldrig sättas av klienten vid registrering (`input: false` i BetterAuth-konfigurationen) – nya konton får alltid rollen `user`, oavsett vad som skickas i requesten
- Endast `admin`-roll (inte `editor`) kan hantera adminanvändare eller radera kundkonton – `editor` är begränsad till produkter, kategorier och ordrar
- `/mina-sidor` – skyddad via sidnivå sessionscheck, och visar bara den inloggade användarens egna ordrar
- Alla formulär valideras med React Hook Form + Zod, inklusive URL-validering vid bilduppladdning
- Servervalidering av varukorgen i `createOrder` – hela payloaden valideras med Zod (längdgränser på alla fält), priser/varianttillägg/titlar/bilder slås upp mot produkten i databasen (klientens värden litas aldrig på), totalpriset räknas om server-side, och okända kvantiteter/varianter avvisas
- Uppladdade fil-URL:er (`customImageUrl`) låses till UploadThing-värdar (`src/lib/uploads.ts`) både vid validering och vid rendering i adminpanelen, så en manipulerad beställning inte kan smuggla in t.ex. `javascript:`-länkar
- All användarinmatning som interpoleras i utgående mejl escapas (`src/lib/html.ts`, `src/lib/emails.ts`)
- Lösenord kräver minst 8 tecken (konsekvent i formulär, Zod-scheman och BetterAuth-konfiguration)
- Rate limiting:
  - BetterAuth-konfigurationens `rateLimit` – striktare regler per endpoint på inloggning (10/15 min), registrering (10/15 min), lösenordsåterställning (5/15 min) och verifieringsmejl (5/15 min)
  - `src/lib/rate-limit.ts` – samma princip för kontaktformuläret (5/15 min) och kassan (10/15 min) per IP, för att skydda mot spam mot e-postutskicken
- JSON-LD på produktsidor escapas för att undvika att bryta ut ur `<script>`-taggen
- Adminrutter och privata sidor exkluderade från sökmotorindexering via `robots.txt`

### ⚠️ better-auth är medvetet pinnad till 1.3.34

`package.json` låser `better-auth` till exakt `1.3.34` (inte `^1.3.34`). **Kör aldrig `npm update` eller ett fristående `npm install better-auth` utan att läsa detta först.**

Anledningen: version 1.7 införde ett nytt obligatoriskt `issuer`-fält på `Account`-tabellen i Prisma-schemat. Utan en korrekt migrering (med backfill av `issuer` per kontotyp) kraschar inloggning och lösenordsåterställning med ett svårtolkat 500-fel ("Unknown argument `issuer`"). Detta hände skarpt i det här projektet när ett orelaterat `npm install` av ett annat paket råkade dra upp `better-auth` till 1.7.1.

Att stanna på 1.3.34 innebär att projektet saknar patchar för flera CVE:er i senare versioner (se `npm audit`) – ingen av dem gäller funktioner som faktiskt används här (OAuth, magic link, organisationsplugin), men en riktig uppgradering till senaste versionen med korrekt schemamigrering bör göras som ett eget, planerat arbete – inte som en bieffekt av att installera något annat.

## Innehållshantering (Sanity CMS)

Hero-texten, Om oss-sidan, Köpvillkor och Integritetspolicy hämtas från Sanity istället för att vara hårdkodade – produkter och kategorier hanteras fortfarande i det egna admingränssnittet, inte i Sanity.

Studion är **inbäddad** i Next.js-appen på `/studio` – ingen separat process, den körs på samma `npm run dev`/port 3000 som resten av sajten.

Öppna [http://localhost:3000/studio](http://localhost:3000/studio) (eller `/studio` på produktionsdomänen), logga in med det Sanity-konto som äger projektet, redigera under "Innehåll" i menyn och klicka **Publicera** – ändringen syns på sajten inom några sekunder utan omdeploy.

Om en sida saknar innehåll i Sanity (t.ex. innan något fyllts i) visas samma text som tidigare var hårdkodad – sidorna går aldrig tomma.

**Miljövariabler** (`.env`):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="plgh82e6"
NEXT_PUBLIC_SANITY_DATASET="production"
```

> ⚠️ Inbäddad Studio är medvetet valt istället för Sanitys rekommenderade fristående upplägg, för att kunna nå Studio på `/studio` som i andra projekt. Notera: Studio-uppdateringar kräver `npm install` + omdeploy av hela appen (auto-uppdateras inte), och byggen/dev är långsammare än en fristående Vite-driven Studio hade varit.
>
> Studio-sidan (`src/app/studio/[[...tool]]/page.tsx`) måste vara markerad `"use client"` – annars evalueras `sanity.config.ts` som en Server Component och kraschar (`createContext is not a function`), eftersom Sanitys pluginfabriker (t.ex. `structureTool()`) anropar React-context-API:er som inte finns i RSC-miljön.

Efter schemaändringar i `src/sanity/schemaTypes/`, kör om typegenereringen så att frontend-koden får uppdaterade typer:

```bash
npx sanity schemas extract
npx sanity typegen generate
```

## SEO

- Dynamisk `sitemap.xml` genereras automatiskt via `src/app/sitemap.ts` – inkluderar alla produkter och kategorier från databasen med `lastModified` och prioritet
- `robots.txt` blockerar `/admin/`, `/kassa/`, `/mina-sidor/`, `/logga-in/`, `/registrera/`, `/glomt-losenord/`, `/api/` m.fl.
- Sidspecifik metadata (titel, beskrivning, Open Graph-bild) på samtliga publika sidor via `generateMetadata` (produkter, kategorier, produktlista, om oss)
- JSON-LD Product-schema på produktsidor – möjliggör rika sökresultat i Google med prisintervall och lagerstatus
- `metadataBase` konfigurerad i root layout

## Installation

1. Klona repot:

   ```bash
   git clone https://github.com/knixan/sweettimeuf.git
   cd sweettimeuf
   ```

2. Installera beroenden:

   ```bash
   npm install
   ```

3. Skapa `.env` och fyll i miljövariabler:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sweettimeuf"
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_SANITY_PROJECT_ID="plgh82e6"
   NEXT_PUBLIC_SANITY_DATASET="production"
   UPLOADTHING_TOKEN="din-uploadthing-token"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="din@gmail.com"
   SMTP_PASS="ditt-app-losenord"
   ```

4. Pusha schemat till databasen och generera Prisma-klienten:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```

## Tillgängliga kommandon

```bash
npm run dev      # Starta utvecklingsserver
npm run build    # Bygg för produktion (kör prisma generate + prisma db push automatiskt)
npm run start    # Starta produktionsserver
npm run lint     # Kör ESLint
```

```bash
npx prisma studio     # Öppna Prisma Studio (visuell databaseditor)
npx prisma db push    # Pusha schema till databas
npx prisma generate   # Generera Prisma-klient
```

> Projektet använder `prisma db push` (inte `prisma migrate`) för schemaändringar –
> både lokalt och i `npm run build`. Mappen `prisma/migrations/` är historik från
> tidigare och används inte längre; kör **inte** `prisma migrate deploy`.

```bash
npx sanity schemas extract     # Extrahera Sanity-schemat (schema.json)
npx sanity typegen generate    # Generera om TypeScript-typer efter schemaändring
```

## Projektstruktur

```
sanity.config.ts / sanity.cli.ts # Sanity-config (projectId/dataset, schema, structure, plugins)
schema.json                      # Extraherat schema (genereras, underlag för typegen)
sanity.types.ts                  # Genererade TypeScript-typer för GROQ-queries

src/
├── app/
│   ├── (site)/                  # Route group – allt som ska ha Navbar/Footer/BuyerTypeBar
│   │   ├── admin/
│   │   │   ├── admins/          # Adminanvändarhantering
│   │   │   ├── kategorier/      # Kategorihantering
│   │   │   ├── kunder/          # Kundhantering + sökfält
│   │   │   ├── offerter/
│   │   │   │   ├── [id]/redigera/ # Redigera orderrader/kunduppgifter (endast admin)
│   │   │   │   ├── [id]/faktura/  # PDF-fakturaroute (endast admin)
│   │   │   │   └── page.tsx       # Orderhantering + sökfält
│   │   │   ├── produkter/       # Produkthantering (lista + skapa/redigera) + sök/kategorifilter
│   │   │   ├── installningar/   # Företagsuppgifter för fakturor (Swish/bankgiro/logga, endast admin)
│   │   │   └── page.tsx         # Dashboard med statistik och försäljningsdiagram
│   │   ├── integritetspolicy/   # Integritetspolicy (innehåll från Sanity)
│   │   ├── kassa/                # Kassa (formulär + server actions)
│   │   ├── kategori/[slug]/      # Dynamiska kategorisidor
│   │   ├── logga-in/             # Inloggningssida
│   │   ├── mina-sidor/           # Orderhistorik för inloggad kund
│   │   ├── om-oss/               # Om oss-sida (Sanity) + kontaktformulär (server action)
│   │   ├── orderbekraftelse/     # Orderbekräftelse
│   │   ├── produkt/
│   │   │   ├── [slug]/           # Produktsida med lightbox och lägg-i-kundvagn
│   │   │   └── page.tsx          # Produktlista
│   │   ├── registrera/           # Registreringssida
│   │   ├── villkor/               # Köpvillkor (innehåll från Sanity)
│   │   ├── layout.tsx            # Navbar/Footer/BuyerTypeBar/CartProvider/SanityLive
│   │   └── page.tsx              # Startsida med produktkaruseller
│   ├── studio/[[...tool]]/       # Inbäddad Sanity Studio ("use client" – se Innehållshantering)
│   ├── api/
│   │   ├── auth/                 # BetterAuth API-rutter
│   │   └── uploadthing/          # UploadThing route handler (core.ts-router i src/lib/uploadthing.ts)
│   ├── sitemap.ts                # Dynamisk sitemap (produkter + kategorier)
│   └── layout.tsx                # Root layout (endast html/body/typsnitt/metadata)
├── components/
│   ├── admin/                   # admin-navbar (mobilmeny), sales-chart
│   ├── layout/                  # Navbar, footer, kundvagnsdropdown, buyer-type-bar
│   ├── site/                    # Hero, About, Team, ProductCard, ProductCarousel m.m.
│   ├── uploadthing.tsx           # UploadButton/UploadDropzone (typade mot OurFileRouter)
│   └── ui/                      # shadcn/ui-komponenter
├── contexts/
│   ├── cart-context.tsx         # Global kundvagnskontext
│   └── buyer-type-context.tsx   # Privatperson/företag-val (moms-visning)
├── lib/
│   ├── auth.ts / auth-client.ts
│   ├── server-auth.ts           # requireAdmin / requireAdminOrEditor – rollkontroll för admin-actions
│   ├── rate-limit.ts            # Delad rate limiter för kontaktformulär och kassa
│   ├── pricing.ts                # Momsberäkning (privatperson/företag)
│   ├── email.ts                  # Nodemailer-transport + sendEmail
│   ├── emails.ts                 # HTML-mallar för utgående mejl (orderbekräftelse, kontakt)
│   ├── html.ts                   # escapeHtml för användarinmatning i mejl
│   ├── uploads.ts                # Validering av uppladdade fil-URL:er (låst till UploadThing)
│   ├── uploadthing.ts            # UploadThing filrouter (customDesign + companyLogo, admin-gated)
│   ├── invoice-pdf.tsx           # @react-pdf/renderer-mall för fakturor
│   ├── prisma.ts
│   ├── slug.ts
│   └── schema/zod-schemas.ts
├── sanity/                      # Sanity-klient, GROQ-queries, bildhjälpare, schema + structure (Studio)
├── proxy.ts                     # Backstop-rollkontroll för /admin/*
└── types/
```

## Databasschema (viktiga modeller)

### Product

`id` · `title` · `slug` · `articleNumber` · `summary` · `information` · `aboutProduct` · `prices` (JSON) · `images` (String[]) · `variantLabel` · `variants` (String[]) · `variantOptions` (JSON) · `allowCustomerUpload` · `categoryId`

### Category

`id` · `name` · `slug` · `showInNavbar`

### Order

`id` · `orderNumber` · `userId` · kundinformation (namn, e-post, telefon, adress, org.nr) · separat fakturaadress · `items` (JSON) · `totalPrice` · `customerType` (`private` inkl. moms / `company` exkl. moms) · `status` · flaggor: `handled` · `shipped` · `invoiceSent` · `invoiceNumber` (löpnummer, sätts vid första fakturagenerering) · `invoiceGeneratedAt`

### CompanySettings

Singleton-tabell (fast `id`) med företagsuppgifter för fakturor: `companyName` · `orgNumber` · `address` · `postalCode` · `city` · `swishNumber` · `bankgiroNumber` · `logoUrl`. Redigeras i `/admin/installningar`.

### User

`id` · `name` · `email` · `password` · `role` (`user` / `editor` / `admin`)

## Licens

Detta projekt är privat och avsett för SweetTime UF, men får användas i utbildningssyfte.

---

_Kod och design av [Josefine Eriksson](https://kodochdesign.se)_
