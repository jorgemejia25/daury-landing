import Image from "next/image";
import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Arrow } from "../ui/Arrow";
import { IlanLogo } from "../ui/IlanLogo";
import { Journey } from "../ui/Journey";
import { SectionHead } from "../ui/SectionHead";
import { StackCard } from "../ui/StackCard";
import type { SectionProps } from "./types";

/* ───────────── Encabezado ───────────── */
export function AboutHero({ t }: SectionProps) {
  const a = t.about;
  return (
    <section className="ahero" aria-labelledby="about-title">
      <div className="container">
        <div className="ahero__head">
          <div className="ahero__copy">
            <span className="eyebrow hero__in">{a.eyebrow}</span>
            <h1 id="about-title" className="ahero__title hero__in">
              {a.title}
            </h1>
          </div>
          <p className="hero__lead ahero__lead hero__in">{a.lead}</p>
        </div>
        <figure className="ahero__media hero__in">
          <Image
            src="/images/equipo-daury.jpg"
            alt={a.imageAlt}
            fill
            preload
            quality={85}
            sizes="(max-width: 1272px) 100vw, 1240px"
            className="ahero__img"
          />
          <figcaption className="ahero__tags">
            <span className="ahero__tag">
              <Icon name="public" size={20} />
              {a.values.items[0].title}
            </span>
            <span className="ahero__tag ahero__tag--amber">
              <Icon name="emoji_events" size={20} />
              {t.hero.awardValue} · {t.hero.awardText}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ───────────── Trayectoria ───────────── */
const ideaIcons = ["alarm", "auto_awesome", "diversity_3", "description"];

export function AboutJourney({ t, lang }: SectionProps) {
  const a = t.about;
  const f = t.features;

  const visuals = [
    <div key="origin" className="vphoto">
      <div className="vphoto__img" data-speed="-0.08">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 860px) 100vw, 640px"
          style={{ objectFit: "cover", objectPosition: "60% 40%" }}
        />
      </div>
    </div>,

    <div key="problem" className="vstat">
      <p className="vstat__num">
        <span data-count="57">57</span>%
      </p>
      <p className="vstat__text">{t.stat.text}</p>
    </div>,

    <div key="name" className="vsong" aria-hidden="true">
      <div className="vinyl">
        <div className="vinyl__label">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" />
        </div>
      </div>
      <p className="vsong__line">{a.songLine}</p>
    </div>,

    <StackCard key="idea" tone="blue" className="videa">
      <ul className="videa__list list-reset">
        {[f.routine.title, f.ai.title, f.family.title, f.doctor.title].map((title, i) => (
          <li key={title}>
            <Icon name={ideaIcons[i]} size={22} />
            {title}
          </li>
        ))}
      </ul>
    </StackCard>,

    <div key="award" className="vaward">
      <div className="vaward__photo">
        <Image
          src="/images/ilan-awards.jpg"
          alt={t.award.alt}
          fill
          quality={85}
          sizes="(max-width: 760px) 100vw, 400px"
          style={{ objectFit: "cover", objectPosition: "50% 62%" }}
        />
      </div>
      <div className="vaward__side">
        <div className="vaward__logo">
          <IlanLogo alt={t.award.logoAlt} size={120} />
        </div>
        <div className="vaward__badge">
          <Icon name="emoji_events" size={30} />
          <span>
            <b>{t.hero.awardValue}</b>
            {t.hero.awardText}
          </span>
        </div>
      </div>
    </div>,

    <div key="next">
      <Link href={`/${lang}/contact#acceso`} className="btn btn--blue btn--lg">
        {a.cta}
        <Arrow />
      </Link>
    </div>,
  ];

  return (
    <section className="section" aria-label={a.journey}>
      <div className="container">
        <Journey label={a.journey} chapters={a.chapters} visuals={visuals} />
      </div>
    </section>
  );
}

/* ───────────── Valores ───────────── */
const valueIcons = ["public", "favorite", "handshake"];
const valueTones = ["blue", "violet", "green"] as const;

export function Values({ t }: SectionProps) {
  const v = t.about.values;
  return (
    <section className="section" aria-labelledby="valores-title">
      <div className="container">
        <SectionHead title={v.title} id="valores-title" />
        <ul className="steps list-reset" data-reveal="stagger">
          {v.items.map((item, i) => (
            <li key={item.title} className="steps__item">
              <StackCard tone={valueTones[i]}>
                <Icon name={valueIcons[i]} size={40} />
                <h3 className="step__title">{item.title}</h3>
                <p className="step__text">{item.text}</p>
              </StackCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
