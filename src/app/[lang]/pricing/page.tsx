import { notFound } from "next/navigation";
import { CtaBand } from "@/features/landing/components/organisms/sections/cta";
import { Faq, PricingHero } from "@/features/landing/components/organisms/sections/pricing";
import { FaqJsonLd } from "@/ui/atoms/JsonLd";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[lang]/pricing">) {
  return pageMetadata(params, "pricing");
}

export default async function Pricing({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <PricingHero t={t} lang={lang} />
      <Faq t={t} lang={lang} />
      <CtaBand t={t} lang={lang} />
      <FaqJsonLd t={t} lang={lang} />
    </>
  );
}
