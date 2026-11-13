import Image from "next/image";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { EarlyAccessForm } from "./EarlyAccessForm";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { prices, site } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type T = { t: Dictionary };

/* ───────────── Hero ───────────── */
export function Hero({ t }: T) {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div aria-hidden="true" data-drift="a" className="blob blob--hero-a" />
      <div aria-hidden="true" data-drift="b" className="blob blob--hero-b" />
      <div className="hero__inner">
        <h1 id="hero-title" data-in="" className="hero__title">
          {t.hero.title}
        </h1>
        <p data-in="" className="hero__lead">
          {t.hero.lead}
        </p>
        <div data-in="" className="hero__ctas">
          <a href="#acceso" className="btn btn--white btn--lg">
            {t.hero.primary}
            <Icon name="arrow_forward" size={24} />
          </a>
          <a href="#como" className="btn btn--navy btn--lg">
            {t.hero.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Cómo funciona ───────────── */
const stepStyle = [
  { color: "var(--blue)", icon: "record_voice_over" },
  { color: "var(--violet)", icon: "volunteer_activism" },
  { color: "var(--green)", icon: "insights" },
];

export function HowItWorks({ t }: T) {
  return (
    <section id="como" className="section section--white" aria-labelledby="como-title">
      <div className="container stack-lg">
        <div className="section-head">
          <h2 id="como-title" className="h2 section-head__title">
            {t.how.title}
          </h2>
          <span className="eyebrow">{t.how.eyebrow}</span>
        </div>
        <ol data-reveal="fade" data-stagger="rise" className="grid grid--300 list-reset">
          {t.how.steps.map((s, i) => (
            <li key={i} className="step" style={{ ["--c" as string]: stepStyle[i].color }}>
              <div className="step__top">
                <span data-pop="" className="step__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="step__icon">
                  <Icon name={stepStyle[i].icon} size={32} />
                </span>
              </div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Funciones ───────────── */
const medMeta = [
  { time: "8:00", done: true },
  { time: "10:00", done: true },
  { time: "13:00", done: false },
];
const bars = [
  { h: 90, c: "var(--green)" },
  { h: 100, c: "var(--green)" },
  { h: 70, c: "#9ED2B1" },
  { h: 100, c: "var(--green)" },
  { h: 95, c: "var(--green)" },
  { h: 100, c: "var(--green)" },
  { h: 85, c: "var(--green)" },
];
const avatars = [
  { l: "A", bg: "var(--violet)" },
  { l: "M", bg: "var(--green)" },
  { l: "R", bg: "var(--red)" },
];
const perkIcons = ["public", "mic", "lock"];

export function Features({ t }: T) {
  const f = t.features;
  return (
    <section id="funciones" className="section" aria-label={f.label}>
      <div className="container stack-sm">
        <div data-reveal="fade" data-stagger="split" className="row">
          <article className="card card--sand card--narrow">
            <div className="card__copy">
              <span className="tag tag--amber">{f.routine.tag}</span>
              <h3 className="h3">{f.routine.title}</h3>
              <p className="body">{f.routine.text}</p>
            </div>
            <ul data-stagger="" className="meds list-reset" aria-label={f.routine.example}>
              {f.routine.items.map((name, i) => (
                <li key={name} className="med" data-done={medMeta[i].done}>
                  <span className="med__dot">
                    <Icon name={medMeta[i].done ? "check" : "alarm"} size={medMeta[i].done ? 20 : 19} />
                  </span>
                  <span className="med__name">{name}</span>
                  <span className="med__time">{medMeta[i].time}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="card card--blue card--wide">
            <div className="card__copy card__copy--wide">
              <span className="tag tag--white-blue">{f.ai.tag}</span>
              <h3 className="h3 h3--xl">{f.ai.title}</h3>
              <p className="body body--lg body--onblue">{f.ai.text}</p>
            </div>
            <div className="recipe-wrap" aria-hidden="true">
              <div className="recipe">
                <div className="recipe__line" style={{ width: "60%", height: 12, background: "var(--ink)" }} />
                {[90, 75, 85, 55, 80].map((w) => (
                  <div key={w} className="recipe__line" style={{ width: `${w}%` }} />
                ))}
                <div data-scan="" className="recipe__scan" />
                <div className="recipe__chip">{f.routine.items[0]} 50 mg · 8:00</div>
              </div>
            </div>
          </article>
        </div>

        <div data-reveal="fade" data-stagger="split" className="row">
          <article id="familias" className="card card--lilac card--narrow">
            <div className="card__copy">
              <span className="tag tag--violet">{f.family.tag}</span>
              <h3 className="h3">{f.family.title}</h3>
              <p className="body">{f.family.text}</p>
            </div>
            <div className="family">
              <div data-stagger="" className="avatars" aria-hidden="true">
                {avatars.map((a) => (
                  <span key={a.l} className="avatar" style={{ background: a.bg }}>
                    {a.l}
                  </span>
                ))}
                <span className="avatar avatar--more">+2</span>
              </div>
              <p className="bubble">
                <b>Marvin</b> {f.family.bubble}
              </p>
            </div>
          </article>

          <article className="card card--mint card--wide">
            <div className="card__copy card__copy--wide">
              <span className="tag tag--green">{f.doctor.tag}</span>
              <h3 className="h3 h3--xl">{f.doctor.title}</h3>
              <p className="body body--lg">{f.doctor.text}</p>
            </div>
            <div className="report" aria-hidden="true">
              <div className="report__head">
                <b>{f.doctor.week}</b>
                <span className="mono-sm">{f.doctor.days}</span>
              </div>
              <div className="report__bars">
                {bars.map((b, i) => (
                  <span key={i} data-bar="" className="report__bar" style={{ height: `${b.h}%`, background: b.c }} />
                ))}
              </div>
              <div className="report__btn">
                <Icon name="description" size={20} />
                {f.doctor.send}
              </div>
            </div>
          </article>
        </div>

        <ul data-reveal="" data-stagger="" className="grid grid--280 list-reset">
          {f.perks.map((p, i) => (
            <li key={p} className="perk">
              <span className="perk__icon">
                <Icon name={perkIcons[i]} size={28} />
              </span>
              <b className="perk__text">{p}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Dato ───────────── */
export function Stat({ t }: T) {
  return (
    <section className="section section--ink" aria-label={t.stat.label}>
      <div data-reveal="zoom" className="container stat">
        <p className="stat__num" aria-label="57%">
          <span data-count="57">57</span>
          <span className="stat__pct">%</span>
        </p>
        <div className="stat__copy">
          <h2 className="stat__title">{t.stat.text}</h2>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Planes ───────────── */
function Checks({ items, color, lead }: { items: string[]; color?: string; lead?: string }) {
  return (
    <ul className="plan__list list-reset">
      {lead && (
        <li className="plan__item plan__item--strong">
          <Icon name="add_circle" size={20} />
          {lead}
        </li>
      )}
      {items.map((text) => (
        <li key={text} className="plan__item">
          <Icon name="check_circle" size={20} style={color ? { color } : undefined} />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function Pricing({ t }: T) {
  const p = t.pricing;
  return (
    <section id="planes" className="section section--white" aria-labelledby="planes-title">
      <div className="container stack-lg">
        <div className="section-head">
          <h2 id="planes-title" className="h2">
            {p.title}
          </h2>
          <p className="section-head__sub">{p.sub}</p>
        </div>

        <div data-reveal="fade" data-stagger="flip" className="grid grid--300 plans">
          <article className="plan">
            <span className="tag tag--green-soft">Free</span>
            <p className="plan__price">{p.freePrice}</p>
            <p className="plan__desc">{p.free.desc}</p>
            <Checks items={p.free.items} color="var(--green)" />
          </article>

          <article className="plan plan--featured">
            <div className="plan__tags">
              <span className="tag tag--white-blue">Plus</span>
              <span className="tag tag--ink">{p.plus.tag}</span>
            </div>
            <p className="plan__price">
              ${prices.plus}
              <span className="plan__per"> {p.perMonth}</span>
            </p>
            <p className="plan__desc">{p.plus.desc}</p>
            <Checks items={p.plus.items} lead={p.plus.everything} />
          </article>

          <article className="plan">
            <span className="tag tag--violet-soft">Business</span>
            <p className="plan__price">
              ${prices.business}
              <span className="plan__per plan__per--muted"> {p.perMonth}</span>
            </p>
            <p className="plan__desc">{p.business.desc}</p>
            <Checks items={p.business.items} color="var(--violet-dark)" />
          </article>
        </div>

        <div data-reveal="wipe" className="award">
          <figure className="award__media">
            <Image
              src="/images/equipo-daury.jpg"
              alt={p.award.alt}
              fill
              sizes="(max-width: 860px) 100vw, 640px"
              className="award__img"
            />
            <figcaption className="award__badge">
              <Icon name="emoji_events" size={20} style={{ color: "var(--amber)" }} />
              {p.award.badge}
            </figcaption>
          </figure>
          <div className="award__copy">
            <span className="tag tag--amber-solid">
              <Icon name="emoji_events" size={18} />
              {p.award.tag}
            </span>
            <h3 className="h3 award__title">{p.award.title}</h3>
            <p className="body body--md">{p.award.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Historia ───────────── */
const factStyle = [
  { icon: "school", bg: "var(--blue)" },
  { icon: "favorite", bg: "var(--violet)" },
  { icon: "diversity_3", bg: "var(--green)" },
];

export function Story({ t }: T) {
  const s = t.story;
  return (
    <section id="historia" className="section section--top-only" aria-labelledby="historia-title">
      <div className="container stack-md">
        <div className="section-head">
          <h2 id="historia-title" className="h2 section-head__title">
            {s.title}
          </h2>
          <span className="eyebrow">{s.eyebrow}</span>
        </div>
        <div data-reveal="fade" data-stagger="split" className="row">
          <article className="story">
            <p className="story__lead">{s.lead}</p>
            <p className="body body--md">{s.p1}</p>
            <p className="body body--md">{s.p2}</p>
            <ul data-stagger="" className="facts list-reset">
              {s.facts.map((text, i) => (
                <li key={text} className="fact">
                  <span className="fact__icon" style={{ background: factStyle[i].bg }}>
                    <Icon name={factStyle[i].icon} size={22} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
export function Faq({ t }: T) {
  const f = t.faq;
  return (
    <section id="preguntas" className="section section--top-only" aria-labelledby="preguntas-title">
      <div className="container faq">
        <div className="faq__intro">
          <h2 id="preguntas-title" className="h2 h2--faq">
            {f.title}
          </h2>
          <p className="body body--md faq__sub">
            {f.subBefore}{" "}
            <a href="#contacto" className="link-strong">
              {f.subLink}
            </a>{" "}
            {f.subAfter}
          </p>
        </div>
        <div data-reveal="fade" data-stagger="slide" className="faq__list">
          {f.items.map((item) => (
            <details key={item.q} className="qa">
              <summary className="qa__q">
                {item.q}
                <Icon name="add" size={26} className="qa__plus" />
              </summary>
              <p className="qa__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Acceso anticipado ───────────── */
export function EarlyAccess({ t, lang }: T & { lang: Locale }) {
  return (
    <section id="acceso" className="cta" aria-labelledby="acceso-title">
      <div data-reveal="zoom" className="container cta__grid">
        <div className="cta__copy">
          <span className="tag tag--white-blue tag--lg">
            <span className="dot" aria-hidden="true" />
            {t.cta.tag}
          </span>
          <h2 id="acceso-title" className="cta__title">
            {t.cta.title}
          </h2>
          <p className="cta__lead">{t.cta.lead}</p>
        </div>
        <div className="cta__card">
          <EarlyAccessForm lang={lang} t={t.form} />
        </div>
      </div>
    </section>
  );
}

/* ───────────── Contacto ───────────── */
const contactStyle = [
  { icon: "favorite", bg: "var(--blue)" },
  { icon: "apartment", bg: "var(--violet)" },
  { icon: "handshake", bg: "var(--green)" },
];

export function Contact({ t }: T) {
  return (
    <section id="contacto" className="section section--contact" aria-labelledby="contacto-title">
      <div className="container stack-md">
        <div className="section-head">
          <h2 id="contacto-title" className="h2 h2--faq">
            {t.contact.title}
          </h2>
          <a href={`mailto:${site.email}`} className="mail-link">
            <Icon name="mail" size={22} />
            {site.email}
          </a>
        </div>
        <div data-reveal="fade" data-stagger="tilt" className="grid grid--280">
          {t.contact.cards.map((c, i) => (
            <a key={c.title} href={`mailto:${site.email}?subject=${encodeURIComponent(c.subject)}`} className="contact">
              <span className="contact__icon" style={{ background: contactStyle[i].bg }}>
                <Icon name={contactStyle[i].icon} size={30} />
              </span>
              <b className="contact__title">{c.title}</b>
              <span className="contact__text">{c.text}</span>
              <span className="contact__cta">
                {c.cta}
                <Icon name="arrow_forward" size={20} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Footer ───────────── */
export function Footer({ t, lang }: T & { lang: Locale }) {
  const n = t.nav;
  return (
    <footer className="footer">
      <div aria-hidden="true" data-drift="b" className="blob blob--footer" />
      <div className="footer__inner">
        <div data-reveal="" className="footer__top">
          <div className="footer__brand">
            <Logo size="lg" />
            <p className="footer__claim">{t.footer.claim}</p>
            <a href={`mailto:${site.email}`} className="btn btn--white btn--md">
              <Icon name="mail" size={22} />
              {site.email}
            </a>
          </div>
          <div className="footer__cols">
            <nav className="footer__col" aria-label={t.footer.product}>
              <b className="footer__heading">{t.footer.product}</b>
              <a href="#funciones">{n.features}</a>
              <a href="#como">{n.howItWorks}</a>
              <a href="#planes">{n.plans}</a>
            </nav>
            <nav className="footer__col" aria-label={t.footer.help}>
              <b className="footer__heading">{t.footer.help}</b>
              <a href="#preguntas">{n.faq}</a>
              <a href="#contacto">{n.contact}</a>
              <a href="#acceso">{n.earlyAccess}</a>
            </nav>
            <LanguageSwitcher lang={lang} label={n.language} variant="footer" />
          </div>
        </div>
        <div aria-hidden="true" className="footer__rule" />
      </div>
      <div aria-hidden="true" data-reveal="" data-stagger="" className="footer__word">
        {"daury".split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
      <div className="footer__bottom">
        <span>
          © {new Date().getFullYear()} Daury · {t.footer.country}
        </span>
        <span>{t.footer.madeWith}</span>
      </div>
    </footer>
  );
}
