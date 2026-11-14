import Link from "next/link";
import { Icon } from "../ui/Icon";
import { Arrow } from "../ui/Arrow";
import { StackCard } from "../ui/StackCard";
import { prices } from "@/lib/site";
import type { SectionProps } from "./types";

/* ───────────── Encabezado ───────────── */
export function PricingHero({ t, lang }: SectionProps) {
  const p = t.pricing;
  return (
    <section className="phero" aria-labelledby="pricing-title">
      <div className="container">
        <div className="head head--center">
          <span className="eyebrow hero__in">{p.eyebrow}</span>
          <h1 id="pricing-title" className="ahero__title hero__in">
            {p.title}
          </h1>
          <p className="hero__lead hero__in">{p.sub}</p>
        </div>
        <PlanCards t={t} lang={lang} />
      </div>
    </section>
  );
}

/* ───────────── Planes ───────────── */
function Checks({ items, lead }: { items: string[]; lead?: string }) {
  return (
    <ul className="plan__list list-reset">
      {lead && <li className="plan__item plan__item--strong">{lead}</li>}
      {items.map((text) => (
        <li key={text} className="plan__item">
          <Icon name="check" size={18} className="plan__check" />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function PlanCards({ t, lang }: SectionProps) {
  const p = t.pricing;
  const contact = `/${lang}/contact#acceso`;
  return (
    <div className="plans" data-reveal="stagger">
      <article className="plan">
        <h3 className="plan__name">Free</h3>
        <p className="plan__price">{p.freePrice}</p>
        <p className="plan__desc">{p.free.desc}</p>
        <Link href={contact} className="btn btn--soft btn--block">
          {p.choose} Free
        </Link>
        <Checks items={p.free.items} />
      </article>

      <StackCard tone="blue" className="plan plan--featured">
        <div className="plan__row">
          <h3 className="plan__name">Plus</h3>
          <span className="pill pill--white">{p.plus.tag}</span>
        </div>
        <p className="plan__price">
          ${prices.plus}
          <span className="plan__per">{p.perMonth}</span>
        </p>
        <p className="plan__desc">{p.plus.desc}</p>
        <Link href={contact} className="btn btn--white btn--block">
          {p.choose} Plus
          <Arrow />
        </Link>
        <Checks items={p.plus.items} lead={p.plus.everything} />
      </StackCard>

      <article className="plan">
        <h3 className="plan__name">Business</h3>
        <p className="plan__price">
          ${prices.business}
          <span className="plan__per">{p.perMonth}</span>
        </p>
        <p className="plan__desc">{p.business.desc}</p>
        <Link href={`/${lang}/contact`} className="btn btn--ink btn--block">
          {p.contactSales}
        </Link>
        <Checks items={p.business.items} />
      </article>
    </div>
  );
}

/* ───────────── FAQ ───────────── */
export function Faq({ t, lang }: SectionProps) {
  const f = t.faq;
  return (
    <section id="preguntas" className="section" aria-labelledby="preguntas-title">
      <div className="container faq">
        <div className="faq__intro">
          <h2 id="preguntas-title" className="h2" data-reveal="">
            {f.title}
          </h2>
          <p className="body faq__sub">
            {f.subBefore}{" "}
            <Link href={`/${lang}/contact`} className="link">
              {f.subLink}
            </Link>{" "}
            {f.subAfter}
          </p>
        </div>
        <div className="faq__list" data-reveal="stagger">
          {f.items.map((item) => (
            <details key={item.q} className="qa" name="faq">
              <summary className="qa__q">
                {item.q}
                <span className="qa__plus" aria-hidden="true" />
              </summary>
              <p className="qa__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
