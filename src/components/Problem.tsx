import FadeIn from "./motion/FadeIn";
import ParallaxLayer from "./motion/ParallaxLayer";
import MaterialIcon from "./MaterialIcon";
import { getMessages, type AppLocale } from "@/i18n/config";

type ProblemProps = {
  locale: AppLocale;
};

export default function Problem({ locale }: ProblemProps) {
  const copy = getMessages(locale).problem;

  const stats = [
    {
      icon: "warning",
      iconColor: "text-primary",
      text: copy.stats[0],
    },
    {
      icon: "distance",
      iconColor: "text-secondary",
      text: copy.stats[1],
    },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <div className="space-y-8">
          <FadeIn direction="left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
              {copy.title}
            </h2>
          </FadeIn>

          <FadeIn direction="left" delay={0.1}>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              {copy.description}
            </p>
          </FadeIn>

          <div className="space-y-4">
            {stats.map((stat, i) => (
              <FadeIn key={stat.icon} direction="left" delay={0.2 + i * 0.1}>
                <div className="flex items-start gap-4 p-4 glass-card rounded-2xl">
                  <MaterialIcon
                    name={stat.icon}
                    className={`${stat.iconColor} drop-shadow-[0_0_8px_rgba(146,204,255,0.3)]`}
                  />
                  <p className="text-on-surface-variant">{stat.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Image side */}
        <FadeIn direction="right">
          <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden glass-card">
            <ParallaxLayer speed={0.15} className="absolute inset-0">
              <img
                alt="Abstract cinematic visual of light refracting through textured glass"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ6lRCQBIxEZh5bGfSiOihjTH7s9Qz-RCRg7gnNWrLEiUh2veBomBuGnHdSizEXlhLI5g7HWdV9MwE9UC0ZQK30Qs6Gh-TN8mSHYpTGRj1oN6OO1S3OdVTn-SLXh-IFqfEEKmtA3EUV3MYSP0_gnW3K2TG0epEA-89-WV5xm397mJsAXTvFclqSAOW7TrGn6AEQL_S1KCqMYFt3Qw671l8V4Ou5DQb2VVMK4VhzIbyqsqzPnZ6zrzNn2En5EDYZa5GwYzLhYxo_pY"
                className="w-full h-[120%] object-cover opacity-60 mix-blend-luminosity"
              />
            </ParallaxLayer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 bg-surface-dim/80 backdrop-blur-md rounded-2xl border border-white/10 max-w-xs">
                <MaterialIcon name="psychology_alt" className="text-5xl mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{copy.cardTitle}</h3>
                <p className="text-sm text-on-surface-variant">
                  {copy.cardDescription}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
