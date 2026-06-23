import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";
import { Fredoka } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sweettime-uf.se"),
  title: {
    default: "SweetTime UF – Profilprodukter & Trycksaker",
    template: "%s | SweetTime UF",
  },
  description:
    "Beställ profilprodukter, godis och trycksaker från SweetTime UF.",
  openGraph: {
    siteName: "SweetTime UF",
    locale: "sv_SE",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Definiera typen tydligt för att matcha Prisma-modellen
  type CategoryNav = { id: string; name: string; slug: string | null };
  let categories: CategoryNav[] = [];

  try {
    const result = await prisma.category.findMany({
      where: { showInNavbar: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
    // Filtrera bort kategorier som saknar slug för att undvika problem i Navbar
    categories = result.filter((c) => c.slug !== null) as CategoryNav[];
  } catch (err) {
    console.error(
      "Database error in RootLayout:",
      err instanceof Error ? err.message : err,
    );
  }

  return (
    <html lang="sv" className={fredoka.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar categories={categories} />
            <Toaster position="bottom-right" />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
