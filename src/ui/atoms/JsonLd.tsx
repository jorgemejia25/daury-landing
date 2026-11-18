import { prices, site } from "@/lib/site";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Props = { t: Dictionary; lang: Locale };

const orgId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

/** Inserta datos estructurados; escapa `<` para que el JSON no pueda cerrar la etiqueta. */
function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Inicio: organización, sitio web, página y la app con sus planes. */
export function SiteJsonLd({ t, lang }: Props) {
  const p = t.pricing;
  const offers = [
    { name: "Free", price: "0", currency: p.freeCurrency, description: p.free.desc },
    { name: "Plus", price: prices.plus, currency: "USD", description: p.plus.desc },
    { name: "Business", price: prices.business, currency: "USD", description: p.business.desc },
  ];

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": orgId,
            name: site.name,
            url: site.url,
            logo: `${site.url}/icon.svg`,
            email: site.email,
            foundingLocation: { "@type": "Place", name: "Guatemala" },
            award: t.award.title,
            contactPoint: {
              "@type": "ContactPoint",
              email: site.email,
              contactType: "customer support",
              availableLanguage: [...locales],
            },
          },
          {
            "@type": "WebSite",
            "@id": websiteId,
            url: site.url,
            name: site.name,
            inLanguage: [...locales],
            publisher: { "@id": orgId },
          },
          {
            "@type": "WebPage",
            "@id": `${site.url}/${lang}#webpage`,
            url: `${site.url}/${lang}`,
            name: t.meta.title,
            description: t.meta.description,
            inLanguage: lang,
            isPartOf: { "@id": websiteId },
          },
          {
            "@type": "SoftwareApplication",
            name: site.name,
            applicationCategory: "HealthApplication",
            operatingSystem: "Android, iOS",
            inLanguage: lang,
            description: t.meta.description,
            publisher: { "@id": orgId },
            offers: offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              price: o.price,
              priceCurrency: o.currency,
              description: o.description,
            })),
          },
        ],
      }}
    />
  );
}

/** Planes: preguntas frecuentes (deben coincidir con las que se muestran en esa página). */
export function FaqJsonLd({ t, lang }: Props) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${site.url}/${lang}/pricing#preguntas`,
        inLanguage: lang,
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}
