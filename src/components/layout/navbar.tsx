"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import authClient, { useSession } from "@/lib/auth-client";
import { ModeToggle } from "@/components/toggle-theme-button";
import { CartDropdown } from "@/components/layout/cart-dropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type LinkItem = { href: string; label: string };

interface NavbarProps {
  title?: string;
  links?: LinkItem[];
  showThemeToggle?: boolean;
  categories?: { id: string; name: string; slug: string | null }[];
}

// Navbar komponent med auth-stöd
const Navbar: React.FC<NavbarProps> = ({
  title = "Sweettime",
  links = [
    { href: "/", label: "Hem" },
    { href: "/produkter", label: "Produkter" },
    { href: "#om-oss", label: "Om oss" },
    { href: "#kontakt", label: "Kontakt" },
  ],
  showThemeToggle = true,
  categories = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthenticated = !!session?.user;
  const user = session?.user ?? null;
  const isActive = (href: string) => pathname === href;

  const handleLogin = () => router.push("/logga-in");

  const handleRegister = () => router.push("/registrera");

  const handleLogout = async () => {
    await authClient.signOut();
    // Refresh so UI updates
    router.refresh();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Titel */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-muted-foreground transition-colors"
            >
              {title}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {/* Navigation länkar */}
            <div className="flex items-center gap-6">
              {links.map((link, index) =>
                link.href === "/produkter" ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger className="text-sm font-medium transition-colors inline-flex items-center">
                      {link.label}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/produkter">Alla produkter</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {categories.map((c) => (
                        <DropdownMenuItem key={c.id} asChild>
                          <Link href={c.slug ? `/kategori/${c.slug}` : `/produkter?category=${c.id}`}>
                            {c.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={index}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Höger sektion: Cart + Theme toggle + auth knappar */}
            <div className="flex items-center gap-3">
              <CartDropdown />
              {showThemeToggle && <ModeToggle />}

              {/* Visa olika knappar beroende på auth-status */}
              {!isAuthenticated ? (
                // Ej inloggad
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Logga in
                  </button>

                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Registrera
                  </button>
                </>
              ) : (
                // Inloggad
                <>
                  <Link
                    href="/mina-sidor"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Mina sidor
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logga ut
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu knapp */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {/* Mobile länkar */}
              {links.map((link, index) => (
                <div key={index}>
                  <Link
                    href={link.href}
                    className={`block px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.href === "/produkter" && categories.length > 0 && (
                    <div className="ml-4 flex flex-col gap-1 mt-1">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={c.slug ? `/kategori/${c.slug}` : `/produkter?category=${c.id}`}
                          className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile actions */}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {showThemeToggle && (
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-sm font-medium">Tema</span>
                    <ModeToggle />
                  </div>
                )}

                {!isAuthenticated ? (
                  // Ej inloggad - mobil
                  <>
                    <button
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      Logga in
                    </button>

                    <button
                      onClick={() => {
                        handleRegister();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Registrera
                    </button>
                  </>
                ) : (
                  // Inloggad - mobil
                  <>
                    {user && (
                      <div className="px-4 py-2 text-sm border-b mb-2">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </div>
                    )}

                    <Link
                      href="/mina-sidor"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Mina sidor
                    </Link>

                    <button
                      onClick={async () => {
                        await handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logga ut
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
