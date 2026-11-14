import { Icon } from "../ui/Icon";
import { Arrow } from "../ui/Arrow";
import { EarlyAccessForm } from "../forms/EarlyAccessForm";
import type { SectionProps } from "./types";
import { site } from "@/lib/site";

const cardIcons = ["favorite", "apartment", "handshake"];

export function ContactSection({ t, lang }: SectionProps) {
  const c = t.contact;
  return (
    <section className="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__copy">
          <span className="eyebrow hero__in">{c.eyebrow}</span>
          <h1 id="contact-title" className="ahero__title hero__in">
            {c.title}
          </h1>
          <p className="hero__lead hero__in">{c.lead}</p>

          <p className="contact__or hero__in">{c.or}</p>
          <ul className="contact__list list-reset hero__in">
            {c.cards.map((card, i) => (
              <li key={card.title}>
                <a href={`mailto:${site.email}?subject=${encodeURIComponent(card.subject)}`} className="ccard">
                  <span className="ccard__icon">
                    <Icon name={cardIcons[i]} size={24} />
                  </span>
                  <span className="ccard__body">
                    <b className="ccard__title">{card.title}</b>
                    <span className="ccard__text">{card.text}</span>
                  </span>
                  <span className="ccard__cta">
                    {card.cta}
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${site.email}`} className="contact__mail hero__in">
            <Icon name="mail" size={22} />
            {site.email}
          </a>
        </div>

        <div id="acceso" className="contact__form hero__in">
          <span className="eyebrow eyebrow--light">{t.cta.tag}</span>
          <h2 className="contact__form-title">{t.cta.title}</h2>
          <p className="contact__form-lead">{t.cta.lead}</p>
          <div className="contact__card">
            <EarlyAccessForm lang={lang} t={t.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
