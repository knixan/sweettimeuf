import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaInstagram, FaFacebook, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          <div className="md:col-span-2">
            <Image
              src="/logga/sweettime-svart-loggo.png"
              alt="Sweet Time UF"
              width={120}
              height={64}
              className="h-16 w-auto mb-4 dark:hidden"
            />
            <Image
              src="/logga/sweettime-vit-loggo.png"
              alt="Sweet Time UF"
              width={120}
              height={64}
              className="h-16 w-auto mb-4 hidden dark:block"
            />
            <h3 className="text-2xl mb-3 font-semibold">Sweet Time UF</h3>
            <p className="text-muted-foreground max-w-prose">
              Premium godis och choklad för privatpersoner, företag och
              föreningar. Vi skapar magiska stunder genom kvalitetsprodukter och
              personlig service.
            </p>
            <div className="mt-4 flex items-center text-muted-foreground">
              <FiMapPin className="mr-2" />
              <span>Mjölby, Östergötland</span>
            </div>
          </div>

          <div>
            <h4 className="text-xl mb-4 font-semibold">Kontakt</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Ludvig Hedlund</p>
                <p>Verkställande Direktör</p>
                <p className="flex items-center gap-2">
                  <FiPhone /> 076 794 29 82
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Gabriel Kass Alias</p>
                <p>Vice VD - Ekonomiansvarig</p>
                <p className="flex items-center gap-2">
                  <FiPhone /> 070 459 93 67
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <FiMail />
                <a className="hover:text-foreground transition-colors" href="mailto:lg.sweets10@gmail.com">
                  lg.sweets10@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl mb-4 font-semibold">Länkar</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link className="hover:text-foreground transition-colors" href="/">Hem</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/produkt">Produkter</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/om-oss">Om oss</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/om-oss#kontakt">Kontakt</Link>
              </li>
              <li>
                <a
                  className="hover:text-foreground transition-colors"
                  href="https://www.instagram.com/sweet_timeuf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <FaInstagram /> Instagram
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground transition-colors"
                  href="https://www.facebook.com/profile.php?id=61581595476624"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <FaFacebook /> Facebook
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground transition-colors"
                  href="https://ungforetagsamhet.se/company/sweet-time-uf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <FaGlobe /> UF-sida
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t pt-6 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Sweet Time UF. Alla rättigheter förbehållna.</div>
          <div className="mt-2 md:mt-0">
            Kod och Design:{" "}
            <a
              href="https://www.kodochdesign.se"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              Josefine Eriksson
            </a>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="mailto:lg.sweets10@gmail.com"
            aria-label="Maila offertförfrågan"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Maila offertförfrågan
          </a>
        </div>
      </div>
    </footer>
  );
}
