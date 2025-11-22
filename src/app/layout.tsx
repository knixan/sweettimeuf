import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";

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
  // Fetch categories shown in navbar
  type CategoryRow = { id: string; name: string };
  let categories: CategoryRow[] = [];
  try {
    const result = await prisma.category.findMany({
      where: { showInNavbar: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    categories = result;
  } catch (err) {
    // If there's an error loading categories, fall back to empty list
    console.error("Could not load categories for Navbar:", err);
    categories = [];
  }

  return (
    <html lang="sv">
      <body>
        <CartProvider>
          <Navbar categories={categories} />
          <Toaster position="bottom-right" />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
