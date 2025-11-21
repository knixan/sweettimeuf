import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "sonner";

export const metadata = {
  title: "BetterAuth Prisma Example",
  description:
    "An example Next.js project demonstrating BetterAuth with Prisma integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
