import Image from "next/image";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Arrow } from "../ui/Arrow";
import { IlanLogo } from "../ui/IlanLogo";
import { SectionHead } from "../ui/SectionHead";
import { StackCard } from "../ui/StackCard";
import { FamilyScreen, FamilyToast, HealthScreen, ScanResult, ScanScreen, ShareChip, TodayScreen } from "../mockups/AppScreens";
import type { SectionProps } from "./types";
import { prices } from "@/lib/site";

/* ───────────── Hero ───────────── */
export function Hero({ t, lang }: SectionProps) {
  const h = t.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__head">
        <span className="eyebrow hero__in">{h.label}</span>
        <h1 id="hero-title" className="hero__title hero__in">
          {h.title}
        </h1>
        <p className="hero__lead hero__in">{h.lead}</p>
      </div>

      <div className="hero__stage hero__in">
        <div className="hero__media">
          <div className="hero__img" data-speed="-0.14">
            <Image
              src="/images/hero.jpg"
              alt={h.imageAlt}
              fill
              preload
              sizes="(max-width: 760px) 100vw, 1100px"
              style={{ objectFit: "cover", objectPosition: "55% 35%" }}
            />
          </div>
        </div>

        <div className="notch notch--tl">
          <div className="statcard">
            <p className="statcard__num">
              <span data-count="57">57</span>%
            </p>
            <p className="statcard__text">{h.statText}</p>
          </div>
        </div>

        <div className="notch notch--br">
          <ul className="chips list-reset">
            {h.chips.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="float float--award" data-speed="0.1">
          <span className="float__icon float__icon--amber">
            <Icon name="emoji_events" size={22} />
          </span>
          <span>
            <b className="float__value">{h.awardValue}</b>
            <span className="float__text">{h.awardText}</span>
          </span>
        </div>

        <div className="float float--free" data-speed="0.18">
          <b className="float__value float__value--xl">{h.freeValue}</b>
          <span className="float__text">{h.freeText}</span>
        </div>
      </div>

      <div className="hero__ctas hero__in">
        <Link href={`/${lang}/contact#acceso`} className="btn btn--blue btn--lg">
          {h.primary}
          <Arrow />
        </Link>
        <a href="#como" className="btn btn--soft btn--lg">
          {h.secondary}
        </a>
      </div>
    </section>
  );
}

/* ───────────── Cómo funciona ───────────── */
const steps = [
  { tone: "blue", icon: "record_voice_over" },
  { tone: "violet", icon: "volunteer_activism" },
  { tone: "green", icon: "insights" },
] as const;

export function HowItWorks({ t }: SectionProps) {
  return (
    <section id="como" className="section" aria-labelledby="como-title">
      <div className="container">
        <SectionHead eyebrow={t.how.eyebrow} title={t.how.title} id="como-title" />
        <ol className="steps list-reset" data-reveal="stagger">
          {t.how.steps.map((s, i) => (
            <li key={s.title} className="steps__item">
              <StackCard tone={steps[i].tone}>
                <div className="step__top">
                  <Icon name={steps[i].icon} size={44} />
                  <span className="step__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__text">{s.text}</p>
              </StackCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Funciones (pila sticky con pantallas de la app) ───────────── */
const perkIcons = ["public", "mic", "lock"];

export function Features({ t, lang }: SectionProps) {
  const f = t.features;
  const a = f.app;
  const cards = [
    { tone: "sand", pill: "amber", copy: f.routine, visual: <TodayScreen a={a} lang={lang} /> },
    {
      tone: "blue",
      pill: "white",
      copy: f.ai,
      visual: (
        <>
          <ScanScreen a={a} lang={lang} />
          <ScanResult a={a} lang={lang} />
        </>
      ),
    },
    {
      tone: "lilac",
      pill: "violet",
      copy: f.family,
      visual: (
        <>
          <FamilyScreen a={a} lang={lang} />
          <FamilyToast a={a} lang={lang} text={f.family.bubble} />
        </>
      ),
    },
    {
      tone: "mint",
      pill: "green",
      copy: f.doctor,
      visual: (
        <>
          <HealthScreen a={a} lang={lang} />
          <ShareChip label={f.doctor.send} />
        </>
      ),
    },
  ];

  return (
    <section id="funciones" className="section" aria-labelledby="funciones-title">
      <div className="container">
        <SectionHead eyebrow={f.eyebrow} title={f.title} id="funciones-title" center />
        <div className="fstack" data-stack="">
          {cards.map((c) => (
            <article key={c.tone} className={`fcard fcard--${c.tone}`}>
              <div className="fcard__copy">
                <span className={`pill pill--${c.pill}`}>{c.copy.tag}</span>
                <h3 className="h3">{c.copy.title}</h3>
                <p className="body">{c.copy.text}</p>
              </div>
              <div className="fcard__visual" data-reveal="">
                {c.visual}
              </div>
            </article>
          ))}
        </div>

        <ul className="perks list-reset" data-reveal="stagger">
          {f.perks.map((p, i) => (
            <li key={p} className="perk">
              <Icon name={perkIcons[i]} size={26} />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Dato ───────────── */
export function Stat({ t }: SectionProps) {
  return (
    <section className="stat" aria-label={t.stat.label}>
      <div className="container stat__inner">
        <p className="stat__num" aria-label="57%" data-speed="-0.06">
          <span data-count="57" aria-hidden="true">
            57
          </span>
          <span className="stat__pct" aria-hidden="true">
            %
          </span>
        </p>
        <div className="stat__copy" data-reveal="">
          <h2 className="stat__title">{t.stat.text}</h2>
          <p className="stat__sub">{t.stat.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Premio ILAN → Nosotros ───────────── */
export function Award({ t, lang }: SectionProps) {
  const a = t.award;
  return (
    <section className="section" aria-labelledby="premio-title">
      <div className="container award">
        <figure className="award__media" data-reveal="">
          <div className="award__img" data-speed="-0.06">
            <Image
              src="/images/ilan-awards.jpg"
              alt={a.alt}
              fill
              quality={85}
              sizes="(max-width: 960px) 100vw, 640px"
              style={{ objectFit: "cover", objectPosition: "50% 62%" }}
            />
          </div>
          <figcaption className="award__badge">
            <Icon name="emoji_events" size={20} />
            {a.tag}
          </figcaption>
        </figure>
        <div className="award__copy" data-reveal="stagger">
          <IlanLogo alt={a.logoAlt} size={88} />
          <h2 id="premio-title" className="h2 h2--md">
            {a.title}
          </h2>
          <p className="body body--lg">{a.text}</p>
          <div>
            <Link href={`/${lang}/about`} className="btn btn--ink btn--lg">
              {a.cta}
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Planes (resumen) ───────────── */
export function PlansTeaser({ t, lang }: SectionProps) {
  const p = t.plansTeaser;
  const plans = [
    { name: "Free", price: t.pricing.freePrice, per: "", text: p.free },
    { name: "Plus", price: `$${prices.plus}`, per: t.pricing.perMonth, text: p.plus, featured: true },
    { name: "Business", price: `$${prices.business}`, per: t.pricing.perMonth, text: p.business },
  ];
  return (
    <section className="section" aria-labelledby="planes-title">
      <div className="container teaser">
        <SectionHead eyebrow={p.eyebrow} title={p.title} id="planes-title" />
        <div className="teaser__list" data-reveal="stagger">
          {plans.map((pl) => (
            <Link key={pl.name} href={`/${lang}/pricing`} className={pl.featured ? "tplan tplan--featured" : "tplan"}>
              <span className="tplan__name">{pl.name}</span>
              <span className="tplan__text">{pl.text}</span>
              <span className="tplan__price">
                {pl.price}
                <small>{pl.per}</small>
              </span>
              <Arrow className="tplan__arrow" />
            </Link>
          ))}
          <Link href={`/${lang}/pricing`} className="btn btn--soft btn--lg teaser__cta">
            {p.cta}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
