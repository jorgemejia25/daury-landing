import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import OriginStory from "@/components/OriginStory";
import ProductScope from "@/components/ProductScope";
import Team from "@/components/Team";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import Footer from "@/components/Footer";
import type { AppLocale } from "@/i18n/config";

type LandingPageProps = {
  locale: AppLocale;
};

export default function LandingPage({ locale }: LandingPageProps) {
  return (
    <>
      <Navbar locale={locale} />
      <main className="mesh-gradient-bg min-h-screen overflow-hidden">
        <Hero locale={locale} />
        <Problem locale={locale} />
        <Features locale={locale} />
        <HowItWorks locale={locale} />
        <OriginStory locale={locale} />
        <ProductScope locale={locale} />
        <Team locale={locale} />
        <EarlyAccessForm locale={locale} />
        <Footer locale={locale} />
      </main>
    </>
  );
}
