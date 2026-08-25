"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Översikt", adminOnly: false },
  { href: "/admin/produkter", label: "Produkter", adminOnly: false },
  { href: "/admin/kategorier", label: "Kategorier", adminOnly: false },
  { href: "/admin/offerter", label: "Offerter", adminOnly: false },
  { href: "/admin/kunder", label: "Kunder", adminOnly: true },
  { href: "/admin/admins", label: "Admins", adminOnly: true },
  { href: "/admin/installningar", label: "Inställningar", adminOnly: true },
];

export function AdminNavbar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visibleLinks = links.filter((link) => isAdmin || !link.adminOnly);

  const isLinkActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 h-14">
          {/* Mobil: hamburgerknapp som öppnar en sidomeny */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Öppna adminmeny"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <span className="font-semibold text-sm mr-4 text-muted-foreground">
            Admin
          </span>

          {/* Desktop: horisontell länklista */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {visibleLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isLinkActive(href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Admin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4">
            {visibleLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLinkActive(href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
