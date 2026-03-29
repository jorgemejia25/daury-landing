"use client";

import MaterialIcon from "./MaterialIcon";
import { getMessages, type AppLocale } from "@/i18n/config";

type HeroProps = {
  locale: AppLocale;
};

export default function Hero({ locale }: HeroProps) {
  const copy = getMessages(locale).hero;

  return (
    <section className="h-screen px-6 flex flex-col items-center justify-center text-center">
      <div
        data-aos="fade-up"
        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20 text-xs font-medium tracking-wide text-primary"
      >
        <MaterialIcon name="auto_awesome" className="text-xs" />
        {copy.badge}
      </div>

      <h1
        data-aos="fade-up"
        data-aos-delay="150"
        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-on-surface mb-5 max-w-4xl leading-[1.1] text-glow"
      >
        {copy.titleStart}{" "}
        <span
          className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-tertiary inline-block animate-float-y"
        >
          {copy.titleAccent}
        </span>
      </h1>

      <p
        data-aos="fade-up"
        data-aos-delay="300"
        className="text-base md:text-lg text-on-surface-variant max-w-xl mb-8 font-light leading-relaxed"
      >
        {copy.description}
      </p>

      <div data-aos="fade-up" data-aos-delay="450" className="flex flex-col sm:flex-row gap-4">
        <a href="#features" className="px-7 py-3 bg-primary text-on-primary rounded-full font-bold text-base hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 text-center">
          {copy.primaryCta}
        </a>
        <a href="#how-it-works" className="px-7 py-3 glass-card text-on-surface rounded-full font-bold text-base hover:bg-surface-bright/50 transition-colors text-center">
          {copy.secondaryCta}
        </a>
      </div>
    </section>
  );
}
