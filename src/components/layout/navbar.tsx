"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Moon, Sun, User, LogOut } from "lucide-react";
import authClient, { useSession } from "@/lib/auth-client";

type LinkItem = { href: string; label: string };

interface NavbarProps {
  title?: string;
  links?: LinkItem[];
  showThemeToggle?: boolean;
}

// Simulerad ModeToggle komponent
const ModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

// Navbar komponent med auth-stöd
const Navbar: React.FC<NavbarProps> = ({
  title = "MinSajt",
  links = [
    { href: "/", label: "Hem" },
    { href: "/om", label: "Om" },
    { href: "/tjanster", label: "Tjänster" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  showThemeToggle = true,
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
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-gray-950/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Titel */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold hover:text-gray-600 transition-colors"
            >
              {title}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {/* Navigation länkar */}
            <div className="flex items-center gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Höger sektion: Theme toggle + auth knappar */}
            <div className="flex items-center gap-3">
              {showThemeToggle && <ModeToggle />}

              {/* Visa olika knappar beroende på auth-status */}
              {!isAuthenticated ? (
                // Ej inloggad
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors dark:text-gray-300"
                  >
                    Logga in
                  </button>

                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Registrera
                  </button>
                </>
              ) : (
                // Inloggad
                <>
                  <Link
                    href="/mina-sidor"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors dark:text-gray-300"
                  >
                    <User className="h-4 w-4" />
                    Mina sidor
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
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
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
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
                <Link
                  key={index}
                  href={link.href}
                  className={`px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
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
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Logga in
                    </button>

                    <button
                      onClick={() => {
                        handleRegister();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-black"
                    >
                      Registrera
                    </button>
                  </>
                ) : (
                  // Inloggad - mobil
                  <>
                    {user && (
                      <div className="px-4 py-2 text-sm border-b mb-2">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    )}

                    <Link
                      href="/mina-sidor"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
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
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
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
