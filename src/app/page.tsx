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

export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <HowItWorks />
        <Features />
        <Stat />
        <Pricing />
        <Story />
        <Faq />
        <EarlyAccess />
        <Contact />
      </main>
      <Footer />
      <MotionController />
      <JsonLd />
    </>
  );
}
