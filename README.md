# SweetTime UF

**Note: This project is a work in progress and is under active development. Functionality, structure, and implementation may change over time.**

---

A Next.js e-commerce application built for SweetTime UF. It handles a product catalog, categories, shopping cart, checkout, and order management with a full admin interface.

## Technologies

- **Next.js 16** – React framework with App Router
- **React 19** – UI library
- **TypeScript** – Typed JavaScript
- **Prisma** – ORM for database access
- **PostgreSQL** – Relational database
- **BetterAuth 1.3** – Authentication (email/password, roles)
- **Tailwind CSS 4** – Utility-first CSS framework
- **shadcn/ui** – UI component library
- **Embla Carousel** – Image carousel and lightbox
- **React Hook Form + Zod** – Form handling and validation
- **Sonner** – Toast notifications
- **next-themes** – Dark/light theme

## Features

### Customer
- Product catalog with categories and filtering
- Product pages with image lightbox (Embla Carousel)
- Product variants (e.g. color, size) with configurable label
- Optional custom image/design URL upload per product
- Shopping cart with quantity and price tiers
- Checkout form: contact details, delivery address, billing address, organization number
- Order confirmation page
- Order history via "My Pages" (requires login)
- Registration and login

### Admin
- Product management: create/edit/delete products with images, price tiers, variants, and categories
- Category management: create/edit, slug auto-generation, control which categories appear in the navbar
- Order management: view orders, mark as handled/shipped/invoice sent
- Customer management
- All admin routes protected – requires `admin` role

## Security

- `/admin/*` – protected by layout-level session check (redirects to `/logga-in` if not authenticated, redirects to `/` if not admin)
- `/mina-sidor` – protected by page-level session check (redirects to `/logga-in` if not authenticated)
- All forms use React Hook Form + Zod validation, including URL validation on customer image upload

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd sweettimeuf
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create `.env.local` and set environment variables:

    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/sweettimeuf"
    BETTER_AUTH_SECRET="your-secret-key"
    BETTER_AUTH_URL="http://localhost:3000"
    ```

4. Push the schema to the database and generate the Prisma client:

    ```bash
    npx prisma db push
    npx prisma generate
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── kategorier/         # Manage categories
│   │   ├── kunder/             # Customer management
│   │   ├── offerter/           # Order management
│   │   └── produkter/          # Product management (list + create/edit)
│   ├── api/auth/               # BetterAuth API routes
│   ├── kassa/                  # Checkout (checkout-form + actions)
│   ├── kategori/[slug]/        # Dynamic category pages
│   ├── logga-in/               # Login page
│   ├── mina-sidor/             # Order history for logged-in customer
│   ├── om-oss/                 # About page
│   ├── orderbekraftelse/       # Order confirmation page
│   ├── produkt/
│   │   ├── [slug]/             # Product page with lightbox and add-to-cart form
│   │   └── page.tsx            # Product list
│   ├── registrera/             # Registration page
│   ├── layout.tsx              # Root layout (fetches categories for navbar)
│   └── page.tsx                # Home page with popular products
├── components/
│   ├── admin/
│   │   └── admin-navbar.tsx
│   ├── layout/
│   │   ├── navbar.tsx          # Navbar with categories, dropdown, mobile menu
│   │   └── navbar-wrapper.tsx
│   ├── site/
│   │   ├── About.tsx
│   │   ├── Hero.tsx
│   │   ├── ImageCarousel.tsx
│   │   ├── ImageLightbox.tsx
│   │   ├── PopularProducts.tsx
│   │   ├── product-card.tsx
│   │   └── Team.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── sonner.tsx
│       └── switch.tsx
├── contexts/
│   └── cart-context.tsx
├── lib/
│   ├── schema/
│   │   └── zod-schemas.ts      # Zod schemas (auth: sign-in, sign-up)
│   ├── auth-client.ts
│   ├── auth-server.ts
│   ├── auth.ts
│   ├── prisma.ts
│   ├── server-auth.ts
│   ├── slug.ts
│   └── utils.ts
└── types/
    ├── auth.d.ts
    └── types.ts
```

## Databas-schema (viktiga modeller)

### Product
- `id`, `title`, `slug`, `articleNumber`
- `summary`, `information`, `aboutProduct`
- `prices` (JSON), `images` (String[])
- `variantLabel`, `variants` (String[])
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
