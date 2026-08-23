# SweetTime UF

**Webbshop för SweetTime UF – profilprodukter, godis och trycksaker**

🌐 [www.sweettime-uf.se](https://www.sweettime-uf.se)

---

En Next.js e-handelsapplikation byggd för SweetTime UF. Hanterar produktkatalog, kategorier, kundvagn, kassa och orderhantering med ett fullständigt admingränssnitt.

## Tekniker

| Kategori          | Teknik                                   |
| ----------------- | ---------------------------------------- |
| Framework         | Next.js 16 (App Router)                  |
| UI                | React 19, Tailwind CSS 4, shadcn/ui      |
| Språk             | TypeScript                               |
| Databas           | PostgreSQL + Prisma ORM                  |
| Autentisering     | BetterAuth 1.3 (e-post/lösenord, roller) |
| Formulär          | React Hook Form + Zod                    |
| Carousel/Lightbox | Embla Carousel                           |
| Notifieringar     | Sonner                                   |
| Tema              | next-themes (mörkt/ljust)                |

## Funktioner

### Kund

- Produktkatalog med kategorier
- Produktsidor med bildlightbox
- Produktvarianter (t.ex. färg, storlek) med konfigurerbar etikett
- Möjlighet för kunden att ladda upp egen bild/design per produkt
- Kundvagn med antal och pristrappor
- Kassaformulär: kontaktuppgifter, leveransadress, fakturaadress, organisationsnummer
- Orderbekräftelsesida
- Orderhistorik via "Mina sidor" (kräver inloggning)
- Registrering och inloggning med e-postverifiering

### Admin

- Produkthantering: skapa/redigera/ta bort produkter med bilder, pristrappor, varianter och kategorier
- Kategorihantering: skapa/redigera, auto-generering av slug, styr vilka kategorier visas i navbaren
- Orderhantering: visa ordrar, filtrera på status; orderstatus härleds automatiskt från flaggorna `handled` / `shipped` / `invoiceSent`
- Kundhantering
- Alla adminrutter skyddade – kräver `admin`-roll

## Säkerhet

- `/admin/*` – skyddad via layout-nivå sessionscheck (omdirigerar till `/logga-in` om ej autentiserad, till `/` om ej admin)
- `/mina-sidor` – skyddad via sidnivå sessionscheck
- Alla formulär valideras med React Hook Form + Zod, inklusive URL-validering vid bilduppladdning
- Servervalidering av varukorgen i `createOrder` – Zod verifierar att pris och antal är positiva; totalpriset räknas om server-side och klientens värde ignoreras
- Lösenord kräver minst 8 tecken (konsekvent i formulär och BetterAuth-konfiguration)
- Rate limiting via `src/middleware.ts` – max 10 försök per 15 minuter och IP på inloggning, registrering och lösenordsåterställning (returnerar `429 Too Many Requests`)
- Adminrutter och privata sidor exkluderade från sökmotorindexering via `robots.txt`

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

3. Skapa `.env.local` och fyll i miljövariabler:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sweettimeuf"
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
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
npm run build    # Bygg för produktion (kör prisma generate automatiskt)
npm run start    # Starta produktionsserver
npm run lint     # Kör ESLint
```

```bash
npx prisma studio     # Öppna Prisma Studio (visuell databaseditor)
npx prisma db push    # Pusha schema till databas (dev)
npx prisma generate   # Generera Prisma-klient
```

## Projektstruktur

```
src/
├── app/
│   ├── admin/
│   │   ├── admins/             # Adminanvändarhantering
│   │   ├── kategorier/         # Kategorihantering
│   │   ├── kunder/             # Kundhantering
│   │   ├── offerter/           # Orderhantering
│   │   └── produkter/          # Produkthantering (lista + skapa/redigera)
│   ├── api/auth/               # BetterAuth API-rutter
│   ├── kassa/                  # Kassa (formulär + server actions)
│   ├── kategori/[slug]/        # Dynamiska kategorisidor
│   ├── logga-in/               # Inloggningssida
│   ├── mina-sidor/             # Orderhistorik för inloggad kund
│   ├── om-oss/                 # Om oss-sida
│   ├── orderbekraftelse/       # Orderbekräftelse
│   ├── produkt/
│   │   ├── [slug]/             # Produktsida med lightbox och lägg-i-kundvagn
│   │   └── page.tsx            # Produktlista
│   ├── registrera/             # Registreringssida
│   ├── sitemap.ts              # Dynamisk sitemap (produkter + kategorier)
│   ├── layout.tsx              # Root layout med global metadata
│   └── page.tsx                # Startsida med populära produkter
├── components/
│   ├── admin/
│   ├── layout/                 # Navbar, footer, kundvagnsdropdown
│   ├── site/                   # Hero, About, Team, ProductCard m.m.
│   └── ui/                     # shadcn/ui-komponenter
├── contexts/
│   └── cart-context.tsx        # Global kundvagnskontext
├── lib/
│   ├── auth.ts / auth-client.ts / auth-server.ts
│   ├── email.ts
│   ├── prisma.ts
│   ├── slug.ts
│   └── schema/zod-schemas.ts
├── middleware.ts               # Rate limiting på auth-endpoints
└── types/
```

## Databasschema (viktiga modeller)

### Product

`id` · `title` · `slug` · `articleNumber` · `summary` · `information` · `aboutProduct` · `prices` (JSON) · `images` (String[]) · `variantLabel` · `variants` (String[]) · `variantOptions` (JSON) · `allowCustomerUpload` · `categoryId`

### Category

`id` · `name` · `slug` · `showInNavbar`

### Order

`id` · `orderNumber` · `userId` · kundinformation (namn, e-post, telefon, adress, org.nr) · separat fakturaadress · `items` (JSON) · `totalPrice` · `status` · flaggor: `handled` · `shipped` · `invoiceSent`

### User

`id` · `name` · `email` · `password` · `role` (`user` / `admin`)

## Licens

Detta projekt är privat och avsett för SweetTime UF, men får användas i utbildningssyfte.

---

_Kod och design av [Josefine Eriksson](https://kodochdesign.se)_
