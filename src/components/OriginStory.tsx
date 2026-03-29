import FadeIn from "./motion/FadeIn";
import type { AppLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";

type OriginStoryProps = {
  locale: AppLocale;
};

export default function OriginStory({ locale }: OriginStoryProps) {
  const copy = getMessages(locale).originStory;

  return (
    <section id="about" className="py-24 px-6 bg-surface-container-low/30">
      <div className="max-w-6xl mx-auto">
        <FadeIn direction="up" className="mb-8 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            {copy.badge}
          </span>
        </FadeIn>

        <FadeIn direction="up" delay={0.05} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
            {copy.title}
          </h2>
        </FadeIn>

        <div className="relative mt-16 md:mt-24">
          {/* Decorative background element */}
          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden md:block rounded-[3rem] bg-linear-to-b from-surface-container-high/30 to-transparent opacity-50 blur-2xl" />

          <div className="glass-card relative z-10 overflow-hidden rounded-[2.5rem] border border-outline-variant/30 shadow-2xl shadow-slate-900/5">
            {/* Subtle inner mesh for texture */}
            <div className="mesh-gradient-overlay pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />

            <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
              {/* Image Section */}
              <FadeIn direction="right" delay={0.08} className="relative h-full min-h-[300px] lg:min-h-[500px]">
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
                <img
                  src="https://cdn1.faroutmagazine.co.uk/uploads/1/2023/03/Pearl-Jam-Far-Out-Magazine.jpg"
                  alt="Pearl Jam performing live on stage"
                  className="absolute inset-0 h-full w-full object-cover grayscale-20 contrast-125 transition-transform duration-700 hover:scale-105 hover:grayscale-0"
                />
                {/* Gradient fade to blend with content on mobile */}
                <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-surface/80 lg:to-surface z-20" />
              </FadeIn>

              {/* Content Section */}
              <FadeIn direction="left" delay={0.12} className="relative z-30 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                {/* Decorative Quote Mark */}
                <div className="absolute -top-4 right-8 text-[120px] leading-none text-primary/5 font-serif font-black select-none pointer-events-none">
                  &quot;
                </div>

                <div className="space-y-6 md:space-y-8 relative">
                  {copy.paragraphs.map((paragraph: string, idx: number) =>
                    idx === 0 ? (
                      <p
                        key={idx}
                        className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-on-surface"
                      >
                        {paragraph}
                      </p>
                    ) : (
                      <p
                        key={idx}
                        className="text-base leading-relaxed text-on-surface-variant opacity-90 md:text-lg"
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
                
                {/* Subtle accent line at the bottom */}
                <div className="mt-10 h-1 w-16 rounded-full bg-linear-to-r from-primary to-secondary opacity-80" />
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
