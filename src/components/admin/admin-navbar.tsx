"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/kategorier", label: "Kategorier" },
  { href: "/admin/offerter", label: "Offerter" },
  { href: "/admin/kunder", label: "Kunder" },
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 h-14">
          <span className="font-semibold text-sm mr-4 text-muted-foreground">Admin</span>
          {links.map(({ href, label }) => {
            const isActive =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
