import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { MotionController } from "@/components/MotionController";
import { JsonLd } from "@/components/JsonLd";
import {
  Contact,
  EarlyAccess,
  Faq,
  Features,
  Footer,
  Hero,
  HowItWorks,
  Pricing,
  Stat,
  Story,
} from "@/components/Sections";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <a href="#contenido" className="skip-link">
        {t.nav.skip}
      </a>
      <Header lang={lang} t={t.nav} />
      <main id="contenido">
        <Hero t={t} />
        <HowItWorks t={t} />
        <Features t={t} />
        <Stat t={t} />
        <Pricing t={t} />
        <Story t={t} />
        <Faq t={t} />
        <EarlyAccess t={t} lang={lang} />
        <Contact t={t} />
      </main>
      <Footer t={t} lang={lang} />
      <MotionController />
      <JsonLd t={t} lang={lang} />
    </>
  );
}
