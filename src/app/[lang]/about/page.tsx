import { notFound } from "next/navigation";
import { AboutHero, AboutJourney, Values } from "@/components/sections/about";
import { CtaBand } from "@/components/sections/cta";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/page-meta";

export function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  return pageMetadata(params, "about");
}

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <AboutHero t={t} lang={lang} />
      <AboutJourney t={t} lang={lang} />
      <Values t={t} lang={lang} />
      <CtaBand t={t} lang={lang} />
    </>
  );
}
