import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "sonner";

export const metadata = {
  title: "Sweettime",
  description:
    "An example Next.js project demonstrating BetterAuth with Prisma integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        <Navbar />
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
