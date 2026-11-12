import { faqs, plans, site } from "@/lib/site";

export function JsonLd() {
  const org = `${site.url}/#organization`;
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
        award: "Primer lugar, Premios ILAN a la Innovación Universitaria (Guatemala)",
        contactPoint: {
          "@type": "ContactPoint",
          email: site.email,
          contactType: "customer support",
          availableLanguage: ["es"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "es",
        publisher: { "@id": org },
      },
      {
        "@type": "SoftwareApplication",
        name: site.name,
        applicationCategory: "HealthApplication",
        operatingSystem: "Android, iOS",
        inLanguage: "es",
        description: site.description,
        publisher: { "@id": org },
        offers: plans.map((p) => ({
          "@type": "Offer",
          name: p.name,
          price: p.price,
          priceCurrency: p.currency,
          description: p.description,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
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
