import { prices, site } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function JsonLd({ t, lang }: { t: Dictionary; lang: Locale }) {
  const org = `${site.url}/#organization`;
  const p = t.pricing;
  const offers = [
    { name: "Free", price: "0", currency: p.freeCurrency, description: p.free.desc },
    { name: "Plus", price: prices.plus, currency: "USD", description: p.plus.desc },
    { name: "Business", price: prices.business, currency: "USD", description: p.business.desc },
  ];

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        email: site.email,
        foundingLocation: { "@type": "Place", name: "Guatemala" },
        award: p.award.title,
        contactPoint: {
          "@type": "ContactPoint",
          email: site.email,
          contactType: "customer support",
          availableLanguage: ["es", "en", "it", "pt", "de", "ru"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: ["es", "en", "it", "pt", "de", "ru"],
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": `${site.url}/${lang}#webpage`,
        url: `${site.url}/${lang}`,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: lang,
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "SoftwareApplication",
        name: site.name,
        applicationCategory: "HealthApplication",
        operatingSystem: "Android, iOS",
        inLanguage: lang,
        description: t.meta.description,
        publisher: { "@id": org },
        offers: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          price: o.price,
          priceCurrency: o.currency,
          description: o.description,
        })),
      },
      {
        "@type": "FAQPage",
        inLanguage: lang,
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
