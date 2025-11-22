import { FiPhone, FiMail } from "react-icons/fi";
import Image from "next/image";

export default function Team() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-semibold text-foreground mb-4">
            Vårt Team
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 text-card-foreground text-center shadow-xl">
            <div className="w-32 h-32 bg-popover rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/Profil/ludvig.jpg"
                alt="Ludvig Hedlund"
                width={128}
                height={128}
                className="object-cover w-32 h-32"
                priority
              />
            </div>
            <h3 className="font-display text-2xl mb-2 text-foreground">Ludvig Hedlund</h3>
            <p className="text-xl mb-4 opacity-90 text-muted-foreground">Verkställande Direktör</p>
            <p className="mb-6 opacity-80 leading-relaxed">
              Ludvig är företagets VD och har det övergripande ansvaret för
              Sweet Time. Han leder verksamheten, ser till att företaget följer
              sina mål och fattar beslut samt håller ihop arbetet inom gruppen.
            </p>
            <div className="text-sm opacity-90 text-muted-foreground">
              <p className="mb-1">
                <a
                  href="tel:+46767942982"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FiPhone aria-hidden />
                  076 794 29 82
                </a>
              </p>
              <p>
                <a
                  href="mailto:lg.sweets10@gmail.com"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FiMail aria-hidden />
                  lg.sweets10@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:ludvig50@icloud.com"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FiMail aria-hidden />
                  ludvig50@icloud.com
                </a>
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 text-card-foreground text-center shadow-xl">
            <div className="w-32 h-32 bg-popover rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/Profil/gabriel.jpg"
                alt="Gabriel Kass Alias"
                width={128}
                height={128}
                className="object-cover w-32 h-32"
                priority
              />
            </div>
            <h3 className="font-display text-2xl mb-2 text-foreground">Gabriel Kass Alias</h3>
            <p className="text-xl mb-4 opacity-90 text-muted-foreground">Vice VD - Ekonomiansvarig</p>
            <p className="mb-6 opacity-80 leading-relaxed">
              Gabriel är ekonomiansvarig och ansvarar för företagets ekonomi.
              Han sköter bokföring, budgetering, fakturering och kontrollerar
              både inkomster och utgifter.
            </p>
            <div className="text-sm opacity-90 text-muted-foreground">
              <p className="mb-1">
                <a
                  href="tel:+46704599367"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FiPhone aria-hidden />
                  070 459 93 67
                </a>
              </p>
              <p>
                <a
                  href="mailto:lg.sweets10@gmail.com"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FiMail aria-hidden />
                  lg.sweets10@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:gabbek08@icloud.com"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <FiMail aria-hidden />
                  gabbek08@icloud.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
