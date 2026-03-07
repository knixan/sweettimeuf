import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";
import { Fredoka } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";


const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Sweettime",
  description:
    "An example Next.js project demonstrating BetterAuth with Prisma integration.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auto-fix any categories missing a slug
  try {
    const missing = await prisma.category.findMany({ where: { slug: null } });
    if (missing.length > 0) {
      const withSlug = await prisma.category.findMany({
        where: { slug: { not: null } },
        select: { slug: true },
      });
      const used = withSlug.map((c) => c.slug as string);
      for (const cat of missing) {
        const slug = generateUniqueSlug(generateSlug(cat.name), used);
        used.push(slug);
        await prisma.category.update({ where: { id: cat.id }, data: { slug } });
      }
    }
  } catch {
    // Non-critical – continue without fixing
  }






  // Fetch categories shown in navbar
  type CategoryRow = { id: string; name: string; slug: string | null };
  let categories: CategoryRow[] = [];
  try {
    const result = await prisma.category.findMany({
      where: { showInNavbar: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
    categories = result;
  } catch (err) {
    console.error("Could not load categories for Navbar:", err);
    categories = [];
  }


  return (
    <html lang="sv" className={fredoka.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar categories={categories} />
            <Toaster position="bottom-right" />
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
