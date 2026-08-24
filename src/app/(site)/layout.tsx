import Navbar from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";
import { BuyerTypeProvider } from "@/contexts/buyer-type-context";
import { BuyerTypeBar } from "@/components/layout/buyer-type-bar";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/layout/Footer";
import { SanityLive } from "@/sanity/lib/live";

export default async function SiteLayout({
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
      "Database error in SiteLayout:",
      err instanceof Error ? err.message : err,
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BuyerTypeProvider>
        <CartProvider>
          <BuyerTypeBar />
          <Navbar categories={categories} />
          <Toaster position="bottom-right" />
          {children}
          <Footer />
        </CartProvider>
      </BuyerTypeProvider>
      <SanityLive />
    </ThemeProvider>
  );
}
