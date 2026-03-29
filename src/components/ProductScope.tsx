import FadeIn from "./motion/FadeIn";
import { getMessages, type AppLocale } from "@/i18n/config";

type ProductScopeProps = {
  locale: AppLocale;
};

export default function ProductScope({ locale }: ProductScopeProps) {
  const copy = getMessages(locale).productScope;

  return (
    <section id="scope" className="py-24 px-6 max-w-6xl mx-auto">

      {/* Header */}
      <FadeIn direction="up" className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{copy.title}</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto">{copy.subtitle}</p>
      </FadeIn>

      {/* Delivers vs Is Not — single split card */}
      <FadeIn direction="up" delay={0.08}>
        <div className="glass-card rounded-[2rem] overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/15">
            <div className="p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">{copy.doesTitle}</p>
              <ul className="space-y-4">
                {copy.doesItems.map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-on-surface-variant text-sm leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 md:p-10 bg-surface-container-low/30">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/50 mb-6">{copy.doesNotTitle}</p>
              <ul className="space-y-4">
                {copy.doesNotItems.map((item: string) => (
                  <li key={item} className="flex items-start gap-3 text-on-surface-variant/55 text-sm leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-outline-variant/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Phases */}
      <FadeIn direction="up" delay={0.12}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-7 w-7 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
              <p className="font-semibold text-on-surface">{copy.mvpTitle}</p>
            </div>
            <ul className="space-y-3">
              {copy.mvpItems.map((item: string) => (
                <li key={item} className="text-sm text-on-surface-variant leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-[2rem] p-8 md:p-10 opacity-60">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-7 w-7 flex items-center justify-center rounded-full bg-secondary/10 text-secondary text-xs font-bold">2</span>
              <p className="font-semibold text-on-surface">{copy.aiTitle}</p>
            </div>
            <ul className="space-y-3">
              {copy.aiItems.map((item: string) => (
                <li key={item} className="text-sm text-on-surface-variant leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>

      {/* Vision */}
      <FadeIn direction="up" delay={0.16}>
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/50 mb-3">{copy.visionTitle}</p>
          <p className="text-lg text-on-surface leading-relaxed">{copy.visionText}</p>
        </div>
      </FadeIn>

    </section>
  );
}
