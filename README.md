# SweetTime UF

**Observera: Detta projekt är ett pågående bygge och är under aktiv utveckling. Funktionalitet, struktur och implementation kan ändras löpande.**

---

En Next.js e-handelsapplikation byggd för SweetTime UF. Hanterar produktkatalog, kategorier, kundvagn, kassaköp och orderhantering med fullt admin-gränssnitt.

## Teknologier

- **Next.js 16** – React-ramverk med App Router
- **React 19** – UI-bibliotek
- **TypeScript** – Typat JavaScript
- **Prisma** – ORM för databasåtkomst
- **PostgreSQL** – Relationsdatabas
- **BetterAuth 1.3** – Autentisering (e-post/lösenord, roller)
- **Tailwind CSS 4** – Utility-first CSS-ramverk
- **shadcn/ui** – UI-komponentbibliotek
- **Embla Carousel** – Bildkarusell och lightbox
- **React Hook Form + Zod** – Formulärhantering och validering
- **Sonner** – Toast-notifieringar
- **next-themes** – Mörkt/ljust tema

## Funktioner

### Kund
- Produktkatalog med kategorier och filtrering
- Produktsidor med bildlightbox (Embla Carousel)
- Kundvagn med antal och prisberäkning
- Kassaformulär: kontaktuppgifter, fakturaadress, org.nr
- Beställningsbekräftelse och orderhistorik via "Mina sidor"
- Registrering och inloggning

### Admin
- Produkthantering: skapa/redigera/ta bort produkter med bilder, priser och kategorier
- Kategorier: skapa/redigera, styr vilka som visas i navbar
- Orderhantering: markera som hanterad, skickad, faktura skickad
- Användarhantering

## Installation

1. Klona repositoryt:

    ```bash
    git clone <repository-url>
    cd sweettimeuf
    ```

2. Installera beroenden:

    ```bash
    npm install
    ```

3. Skapa `.env.local` och ange miljövariabler:

    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/sweettimeuf"
    BETTER_AUTH_SECRET="din-hemliga-nyckel"
    BETTER_AUTH_URL="http://localhost:3000"
    ```

4. Pusha schema till databasen och generera Prisma-klient:

    ```bash
    npx prisma db push
    npx prisma generate
    ```

5. Starta utvecklingsservern:

    ```bash
    npm run dev
    ```

## Projektstruktur

```
src/
├── app/
│   ├── admin/
│   │   ├── kategorier/     # Hantera kategorier
│   │   ├── offerter/       # Orderhantering
│   │   └── produkter/      # Produkthantering
│   ├── api/auth/           # BetterAuth API-rutter
│   ├── kassa/              # Kassaköp (checkout-form + actions)
│   ├── kategori/[slug]/    # Dynamiska kategorisidor
│   ├── logga-in/           # Inloggningssida
│   ├── mina-sidor/         # Orderhistorik för inloggad kund
│   ├── produkt/
│   │   ├── [slug]/         # Produktsida med lightbox
│   │   └── page.tsx        # Produktlista
│   ├── registrera/         # Registreringssida
│   ├── layout.tsx          # Root-layout (hämtar kategorier till navbar)
│   └── page.tsx            # Startsida med populära produkter
├── components/
│   ├── layout/
│   │   ├── navbar.tsx      # Navbar med kategorier, dropdown, mobilmeny
│   │   └── navbar-wrapper.tsx
│   ├── site/
│   │   ├── ImageLightbox.tsx    # Bildlightbox med Embla Carousel
│   │   └── PopularProducts.tsx  # Populära produkter (server-komponent)
│   └── ui/                 # shadcn/ui komponenter
├── lib/
│   ├── auth.ts             # BetterAuth-konfiguration
│   ├── auth-client.ts      # Klient-side auth-funktioner
│   ├── prisma.ts           # Prisma-klient
│   └── utils.ts            # Hjälpfunktioner
└── types/
    └── auth.d.ts           # TypeScript-typer för auth
```

## Databas-schema (viktiga modeller)

### Product
- `id`, `title`, `slug`, `articleNumber`
- `summary`, `information`, `aboutProduct`
- `prices` (JSON), `images` (String[])
- `allowCustomerUpload`, `categoryId`

### Category
- `id`, `name`, `slug`, `showInNavbar`

### Order
- `id`, `orderNumber`, `userId` (nullable)
- Kundinformation: namn, e-post, telefon, adress, org.nr
- Separat fakturadress (valfritt)
- `items` (JSON), `totalPrice`, `status`
- Flaggor: `handled`, `shipped`, `invoiceSent`

### User
- `id`, `name`, `email`, `password`, `role` (`user` / `admin`)

## Tillgängliga kommandon

```bash
npm run dev      # Starta utvecklings-server
npm run build    # Bygg för produktion
npm run start    # Starta produktions-server
npm run lint     # Kör ESLint
```

```bash
npx prisma studio     # Öppna Prisma Studio
npx prisma db push    # Pusha schema till databas (används i dev)
npx prisma generate   # Generera Prisma-klient
```

## Licens

Detta projekt är privat och avsett för Sweettime UF men får användas som utbildningsmål.

## Kod och Design 
Av Josefine Eriksson https://kodochdesign.se
