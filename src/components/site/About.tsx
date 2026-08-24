import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { OM_OSS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

const DEFAULTS = {
  heading: "Om Sweet Time UF",
  subheading: "Din partner för kvalitetsgodis och skräddarsydda lösningar",
  badges: ["Personlig Service", "Snabb Leverans", "Kvalitetsgodis"],
  visionHeading: "Vår Vision",
  visionParagraphs: [
    "Sweet Time UF erbjuder ett brett sortiment av kvalitetsgodis från Karamello AB via en enkel och användarvänlig hemsida. Våra kunder är både privatpersoner, företag och föreningar som vill njuta av vardagen, skapa helgmys eller beställa personliga presenter.",
    "Vi erbjuder dessutom möjligheten att specialdesigna godisboxar och förpackningar, vilket gör våra produkter perfekta för bröllop, mässor eller andra evenemang.",
  ],
  benefitsHeading: "Våra Fördelar",
  benefits: [
    {
      title: "Smidig offertförfrågan",
      description: "Få snabbt svar på dina förfrågningar",
    },
    {
      title: "Specialdesignade lådor",
      description: "Anpassade efter dina önskemål",
    },
    {
      title: "Engagerad kundservice",
      description: "Vi finns här för dig hela vägen",
    },
  ],
};

export default async function About() {
  const { data: page } = await sanityFetch({ query: OM_OSS_QUERY });

  const heading = page?.heading || DEFAULTS.heading;
  const subheading = page?.subheading || DEFAULTS.subheading;
  const badges =
    page?.badges && page.badges.length > 0 ? page.badges : DEFAULTS.badges;
  const visionHeading = page?.visionHeading || DEFAULTS.visionHeading;
  const visionParagraphs =
    page?.visionParagraphs && page.visionParagraphs.length > 0
      ? page.visionParagraphs
      : DEFAULTS.visionParagraphs;
  const benefitsHeading = page?.benefitsHeading || DEFAULTS.benefitsHeading;
  const benefits =
    page?.benefits && page.benefits.length > 0
      ? page.benefits
      : DEFAULTS.benefits;
  const profileImageUrl = page?.profileImage
    ? urlFor(page.profileImage).width(560).height(560).url()
    : "/Profil/ludvig-gabriel.jpg";

  return (
    <section
      id="om-oss"
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4"></div>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Main content card */}
        <div className="bg-card rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left side - Image and badges */}
            <div className="lg:col-span-2 bg-card p-8 md:p-12 flex flex-col justify-center items-center">
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-white opacity-10 rounded-full blur-2xl"></div>
                <Image
                  src={profileImageUrl}
                  alt="Ludvig Gabriel"
                  width={280}
                  height={280}
                  className="rounded-full relative z-10 ring-4 ring-gray-700"
                />
              </div>

              <div className="w-full space-y-3">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="bg-popover rounded-xl p-4 text-center transform hover:scale-105 transition-transform"
                  >
                    <span className="text-card-foreground font-semibold">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:col-span-3 p-8 md:p-12">
              <h3 className="font-display text-3xl font-bold text-foreground mb-6">
                {visionHeading}
              </h3>
              {visionParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-muted-foreground leading-relaxed text-lg ${
                    i === visionParagraphs.length - 1 ? "mb-10" : "mb-6"
                  }`}
                >
                  {paragraph}
                </p>
              ))}

              {/* Benefits section */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h4 className="font-display text-2xl font-bold text-foreground mb-6">
                  {benefitsHeading}
                </h4>
                <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start group">
                      <div className="flex shrink-0 w-10 h-10 bg-popover rounded-lg  items-center justify-center mr-4 group-hover:bg-popover/80 transition-colors">
                        <svg
                          className="w-6 h-6 text-card-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-foreground font-semibold mb-1">
                          {benefit.title}
                        </h5>
                        <p className="text-muted-foreground text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
