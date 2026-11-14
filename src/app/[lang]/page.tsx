import { notFound } from "next/navigation";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { Award, Features, Hero, HowItWorks, PlansTeaser, Stat } from "@/components/sections/home";
import { CtaBand } from "@/components/sections/cta";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Hero t={t} lang={lang} />
      <HowItWorks t={t} lang={lang} />
      <Features t={t} lang={lang} />
      <Stat t={t} lang={lang} />
      <Award t={t} lang={lang} />
      <PlansTeaser t={t} lang={lang} />
      <CtaBand t={t} lang={lang} />
      <SiteJsonLd t={t} lang={lang} />
    </>
  );
}
