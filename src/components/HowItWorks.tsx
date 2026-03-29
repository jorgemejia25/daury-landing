import FadeIn from "./motion/FadeIn";
import { getMessages, type AppLocale } from "@/i18n/config";

type HowItWorksProps = {
  locale: AppLocale;
};

export default function HowItWorks({ locale }: HowItWorksProps) {
  const copy = getMessages(locale).howItWorks;
  const steps = copy.steps.map((step, index) => ({
    ...step,
    borderColor: index === 0 ? "border-primary" : index === 1 ? "border-secondary" : "border-tertiary",
    textColor: index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-tertiary",
    bgColor: index === 0 ? "bg-primary/20" : index === 1 ? "bg-secondary/20" : "bg-tertiary/20",
  }));

  return (
    <section id="how-it-works" className="py-24 px-6 md:py-32 relative overflow-hidden bg-surface-container-low/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <FadeIn direction="up">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-on-surface">
              {copy.title}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
              {copy.description}
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-outline-variant/30 z-0 rounded-full" />

          {steps.map((step, i) => (
            <FadeIn key={step.number} direction="up" delay={0.2 + i * 0.15} className="relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  {/* Glow effect behind the circle */}
                  <div className={`absolute inset-0 rounded-full ${step.bgColor} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Step circle */}
                  <div
                    className={`relative w-24 h-24 rounded-full border-[3px] ${step.borderColor} bg-surface flex items-center justify-center font-bold text-3xl ${step.textColor} shadow-xl shadow-slate-900/5 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1`}
                  >
                    {step.number}
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold mb-4 text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
